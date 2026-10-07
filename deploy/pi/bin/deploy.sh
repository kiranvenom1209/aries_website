#!/usr/bin/env bash
# Deploys the newest successful "Build for the Pi" run of main (.github/workflows/pi-build.yml). Pull, never push: the
# Pi asks GitHub, downloads and switches – no open port, no runner, nothing GitHub can start here.
#   sudo /opt/aries-host/bin/deploy.sh             deploy the newest build if it is not live yet (aries-deploy.timer, every 2 min)
#   sudo /opt/aries-host/bin/deploy.sh --check     only say what would happen
#   sudo /opt/aries-host/bin/deploy.sh --retry     also retry a build whose deploy failed before
#   sudo /opt/aries-host/bin/deploy.sh --sha SHA   deploy the build of that commit (one of the last 20 builds, ≤ 7 days old)
# Steps: app package (+ the node_modules package only when package-lock.json changed) → public/ from git at the same
# commit → new release folder → bootstrap (what the Netlify build command did: Payload schema sync, first administrator,
# curated content on a fresh install, team profiles) → switch → health check → keep it, or switch back automatically.
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
[ "${ARIES_LOCK_HELD:-}" = 1 ] || { with_lock bash "$(readlink -f "$0")" "$@"; exit $?; }

MODE=deploy; WANT=""; RETRY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --check) MODE=check; shift ;;
    --retry) RETRY=1; shift ;;
    --sha) [ $# -ge 2 ] || { echo "--sha needs a commit" >&2; exit 2; }; WANT="$2"; RETRY=1; shift 2 ;;
    *) echo "usage: deploy.sh [--check] [--retry] [--sha SHA]" >&2; exit 2 ;;
  esac
done
[[ -z "$WANT" || "$WANT" =~ ^[0-9a-f]{7,40}$ ]] || die "bad commit '$WANT'"
load_conf
install -d -m 755 "$STATE"
note() { printf '%s  %s\n' "$(date '+%F %T')" "$*" >"$STATE/last-check"; }

# 1. the newest successful build of BRANCH in this repository – a push or a manual run, never a fork's pull request
if ! runs=$(gh_api "/repos/$REPO/actions/workflows/$WORKFLOW/runs?branch=$BRANCH&status=success&per_page=20"); then
  # every 2 minutes while the internet is down or the token expired – into the log only when it starts
  grep -q "GitHub not reachable" "$STATE/last-check" 2>/dev/null     || log "GitHub API request failed – no internet, or the token in $(gh_token_file) expired (MYCROFT.md, checkpoint 1)"
  note "GitHub not reachable or the token was rejected (expired?)"
  exit 1
fi
run=$(jq -c --arg repo "$REPO" --arg branch "$BRANCH" --arg want "$WANT" '
  [.workflow_runs[] | select(.head_branch == $branch and (.event == "push" or .event == "workflow_dispatch")
    and .head_repository.full_name == $repo and ($want == "" or (.head_sha | startswith($want))))] | first // empty' <<<"$runs")
if [ -z "$run" ]; then
  note "no successful build${WANT:+ of $WANT} yet"
  [ $MODE = check ] && echo "no successful build of $BRANCH${WANT:+ for $WANT} among the last 20 runs"
  exit 0
fi
SHA=$(jq -r .head_sha <<<"$run"); RUN_ID=$(jq -r .id <<<"$run")
[[ "$SHA" =~ ^[0-9a-f]{40}$ && "$RUN_ID" =~ ^[0-9]+$ ]] || die "unexpected answer from GitHub"

live=$(release_sha "$(current_release)")
if [ "$SHA" = "$live" ]; then
  note "up to date (${SHA:0:7})"
  [ $MODE = check ] && echo "live: ${SHA:0:7} – the newest build"
  exit 0
fi
if [ $RETRY = 0 ] && [ "$(cat "$STATE/failed" 2>/dev/null)" = "$SHA" ]; then
  note "${SHA:0:7} is not deployed: its deploy failed (sudo $KIT/bin/deploy.sh --retry)"
  [ $MODE = check ] && echo "${SHA:0:7} failed to deploy before – $KIT/bin/deploy.sh --retry tries again"
  exit 0
fi
if [ $MODE = check ]; then echo "would deploy ${SHA:0:7} (run $RUN_ID); live: ${live:0:7}"; exit 0; fi

# 2. its packages
arts=$(gh_api "/repos/$REPO/actions/runs/$RUN_ID/artifacts?per_page=100") || die "could not list the packages of run $RUN_ID"
app_id=$(jq -r --arg n "aries-app-$SHA" '[.artifacts[] | select(.name == $n and .expired == false) | .id] | first // empty' <<<"$arts")
deps_name=$(jq -r '[.artifacts[] | select((.name | startswith("aries-deps-")) and .expired == false) | .name] | first // empty' <<<"$arts")
deps_id=$(jq -r --arg n "$deps_name" '[.artifacts[] | select(.name == $n) | .id] | first // empty' <<<"$arts")
LOCKHASH="${deps_name#aries-deps-}"
if [ -z "$app_id" ] || [ -z "$deps_id" ] || [[ ! "$LOCKHASH" =~ ^[0-9a-f]{16}$ ]]; then
  echo "$SHA" >"$STATE/failed"; note "build ${SHA:0:7} has no packages (expired?)"
  die "run $RUN_ID has no usable aries-app/aries-deps packages – they expire after 7 days; re-run the workflow on GitHub"
fi

log "deploy ${SHA:0:7} (run $RUN_ID, packages $LOCKHASH)"
IN="$ROOT/incoming/$SHA"; REL=""
rm -rf "$IN"; install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$IN"
fail() {   # fail MESSAGE [keep]: nothing was switched – the live release keeps running
  echo "$SHA" >"$STATE/failed"; note "deploy ${SHA:0:7} failed: $1"
  rm -rf "$IN"; if [ -n "$REL" ] && [ "${2:-}" != keep ]; then rm -rf "$REL"; fi
  die "deploy ${SHA:0:7} failed: $1 – the live site was not touched"
}

gh_download "/repos/$REPO/actions/artifacts/$app_id/zip" "$IN/app.zip" || fail "download of the app package"
chown "$APP_USER:$APP_USER" "$IN/app.zip"

D="$ROOT/deps/$LOCKHASH"
if [ -f "$D/.complete" ]; then
  log "packages $LOCKHASH unchanged – reused"
else
  log "packages changed – downloading $LOCKHASH"
  gh_download "/repos/$REPO/actions/artifacts/$deps_id/zip" "$IN/deps.zip" || fail "download of the packages"
  chown "$APP_USER:$APP_USER" "$IN/deps.zip"
  rm -rf "$D" "$D.tmp"; install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$D.tmp"
  as_app "cd '$IN' && unzip -q -o deps.zip deps.tar.gz && tar -xzf deps.tar.gz -C '$D.tmp' && rm -f deps.zip deps.tar.gz" \
    || { rm -rf "$D.tmp"; fail "unpacking the packages"; }
  [ -f "$D.tmp/node_modules/next/package.json" ] || { rm -rf "$D.tmp"; fail "the packages contain no next"; }
  mv "$D.tmp" "$D"; touch "$D/.complete"
fi

# 3. public/ (1.4 GB of photos, models, videos) from git at the same commit: a partial, sparse clone that only fetches
#    what changed since the last deploy. Releases hardlink it – git replaces changed files, never edits them in place.
GR="$ROOT/repo"
if [ ! -d "$GR/.git" ]; then
  log "first checkout of public/ from github.com/$REPO (≈ 1.4 GB, once)"
  as_app "git clone --quiet --filter=blob:none --no-checkout --depth 1 --branch '$BRANCH' 'https://github.com/$REPO.git' '$GR' \
    && git -C '$GR' sparse-checkout set --no-cone '/public/'" || { rm -rf "$GR"; fail "git clone"; }
fi
# Hardlinking public/ into a release changes every file's ctime; with git's default stat check every following checkout
# took that for a modification and rewrote all 1.4 GB (hours on the Pi's USB drive, 2026-10-07). Compare mtime + size only.
as_app "git -C '$GR' config core.trustctime false && git -C '$GR' config core.checkStat minimal" || fail "git config"
as_app "git -C '$GR' fetch --quiet --depth 1 --filter=blob:none origin '$SHA' \
  && git -C '$GR' -c advice.detachedHead=false checkout --quiet --force --detach '$SHA'" || fail "git checkout of public/"

# 4. the release
REL="$ROOT/releases/$(date +%Y%m%d-%H%M%S)-${SHA:0:7}"
install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$REL"
as_app "cd '$IN' && unzip -q -o app.zip app.tar.gz && tar -xzf app.tar.gz -C '$REL' && rm -f app.zip app.tar.gz" || fail "unpacking the app package"
[ "$(release_sha "$REL")" = "$SHA" ] || fail "the package was built from another commit than run $RUN_ID"
grep -q "\"lockhash\": \"$LOCKHASH\"" "$REL/.pi/build.json" || fail "the package expects other node_modules than $LOCKHASH"
as_app "ln -s '$D/node_modules' '$REL/node_modules' && cp -al '$GR/public' '$REL/public'" || fail "assembling the release"
broken=$(as_app "cd '$REL' && find .next/node_modules -xtype l 2>/dev/null" || true)
[ -z "$broken" ] || fail "links in .next/node_modules do not resolve: $(echo "$broken" | tr '\n' ' ')"

# 5. bootstrap – the Netlify build command ran these after every build. NODE_ENV stays unset, so Payload brings the
#    database schema in line with the new code (its "push"). A change that could lose data makes Payload ask; without
#    a terminal the question ends the script silently, so the log is checked for it and nothing is switched.
install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$ROOT/shared/logs"
BLOG="$ROOT/shared/logs/deploy-$(basename "$REL").log"
install -o "$APP_USER" -g "$APP_USER" -m 640 /dev/null "$BLOG"
seeding=no; grep -Eq "^BOOTSTRAP_PUBLIC_CONTENT=[\"']?true" "$ENV_FILE" && seeding=yes
log "bootstrap: schema sync, first administrator$([ $seeding = yes ] && echo ', curated content'), team profiles (log: $BLOG)"
if ! as_app_env "cd '$REL' && timeout 900 node .pi/bootstrap/seed-admin.mjs && timeout 1800 node .pi/bootstrap/seed.mjs \
     && timeout 900 node .pi/bootstrap/import-team-profiles.mjs --apply" </dev/null >>"$BLOG" 2>&1; then
  tail -n 40 "$BLOG" >&2
  fail "bootstrap failed (log: $BLOG)"
fi
if grep -q "Warnings detected during schema push\|DATA LOSS WARNING" "$BLOG"; then
  grep -A12 "Warnings detected during schema push" "$BLOG" | head -n 20 >&2 || true
  fail "this release changes the database in a way that may lose data, and Payload asks before it does that. Read the warning above, then: sudo $KIT/bin/schema-sync.sh $REL – and afterwards sudo $KIT/bin/deploy.sh --retry" keep
fi
grep -q "\[CMS bootstrap\]" "$BLOG" || fail "the bootstrap stopped early (log: $BLOG)"

# 6. switch, health check, keep or go back
prev=$(current_release)
ln -sfn "$REL" "$ROOT/current.new" && mv -Tf "$ROOT/current.new" "$ROOT/current"
started=$(date '+%F %T')
systemctl restart aries-web
ok=0; deadline=$(( $(date +%s) + ${HEALTH_WAIT_SEC:-180} ))
while [ "$(date +%s)" -lt "$deadline" ]; do
  sleep 2
  if health_ok && curl -fsS -m 60 -o /dev/null "http://127.0.0.1:$PORT/"; then ok=1; break; fi
  systemctl is-failed --quiet aries-web && break
done

if [ $ok = 0 ]; then
  log "deploy ${SHA:0:7} UNHEALTHY – switching back to $(basename "${prev:-nothing}")"
  journalctl -u aries-web --since "$started" --no-pager 2>/dev/null | tail -n 60 >&2 || true
  if [ -n "$prev" ] && [ -d "$prev" ]; then
    ln -sfn "$prev" "$ROOT/current.new" && mv -Tf "$ROOT/current.new" "$ROOT/current"
    systemctl restart aries-web
  fi
  echo "$SHA" >"$STATE/failed"; note "deploy ${SHA:0:7} failed its health check – back on the previous release"
  rm -rf "$IN"
  exit 1
fi

echo "$SHA $RUN_ID $(date '+%F %T')" >"$STATE/deployed"; rm -f "$STATE/failed"
note "deployed ${SHA:0:7}"
log "deploy ${SHA:0:7} live"
if [ $seeding = yes ]; then
  # the curated seed overwrites what editors changed in seeded stories – it runs on a fresh install only
  env_del "$ENV_FILE" BOOTSTRAP_PUBLIC_CONTENT
  log "curated content is in the CMS – BOOTSTRAP_PUBLIC_CONTENT removed, later deploys never overwrite CMS edits"
fi
# pages that read the CMS were built without it on GitHub: one request each makes the server render them from the database
for p in / /leap-one /leap-2; do curl -fsS -m 60 -o /dev/null "http://127.0.0.1:$PORT$p" || true; done

# 7. tidy up: old releases, packages no release uses, git objects of old commits
rm -rf "$IN"
ls -1dt "$ROOT"/releases/*/ 2>/dev/null | tail -n +$(( ${KEEP_RELEASES:-5} + 1 )) | while read -r d; do
  d="${d%/}"; [ "$d" = "$(current_release)" ] || rm -rf "$d"
done
for d in "$ROOT"/deps/*/; do
  d="${d%/}"; [ -d "$d" ] || continue
  used=0
  for r in "$ROOT"/releases/*/; do [ "$(readlink "${r%/}/node_modules")" = "$d/node_modules" ] && used=1; done
  if [ $used = 0 ]; then rm -rf "$d"; log "removed packages $(basename "$d") (no release uses them)"; fi
done
gitmb=$(du -sm "$GR/.git" 2>/dev/null | cut -f1 || true); if [ "${gitmb:-0}" -gt 4000 ]; then
  as_app "git -C '$GR' reflog expire --expire=now --all && git -C '$GR' gc --quiet --prune=now" || true
fi
exit 0
