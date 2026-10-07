#!/usr/bin/env bash
# aries-host installer – runs the HSM Aries website on this Pi. Run from the copied kit folder (the share, USB …):
#   sudo bash ./install.sh                     phases 1–10, idempotent – safe to run again
#   sudo bash ./install.sh --phase N           one phase again
# Phases: 1 preflight · 2 kit + config · 3 packages · 4 database · 5 site user, folders, .env, services
#         6 GitHub token · 7 first deploy · 8 public access · 9 backups · 10 timers (auto-deploy, health)
# Optional inputs, each read once and shredded afterwards:
#   GITHUB_TOKEN_FILE=/path/token.txt   phase 6 – fine-grained token, read-only "Actions" on the repository (MYCROFT.md)
#   secrets/aries.env in this folder    phase 5 – KEY=value lines merged into the site's .env (keys set on the Pi win):
#                                       BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD (first administrator on a
#                                       fresh install), SMTP_* (form e-mails); never needed again after the install
#   TUNNEL=quick|named                  phase 8 – quick = temporary test link (default), named = hsmaries.space
#   FRESH_CONTENT=no                    phase 5 – skip the curated content seed (when the CMS content comes from Netlify)
# Nothing here changes the pi5-host kit, the Stegmann site, its tunnel, PostgreSQL's settings or the firewall.
set -euo pipefail
SRC_DIR="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
ONLY=""
case "${1:-}" in
  "") ;;
  --phase) ONLY="${2:?--phase needs a number}" ;;
  *) echo "usage: sudo bash ./install.sh [--phase N]" >&2; exit 2 ;;
esac
# shellcheck source=lib.sh
. "$SRC_DIR/lib.sh"
need_root
run() { [ -z "$ONLY" ] || [ "$ONLY" = "$1" ]; }
say() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
conf_from() { if [ -f "$ETC/aries.conf" ]; then load_conf; else set -a; . "$SRC_DIR/config/aries.conf"; set +a; fi; }

if run 1; then
  say "1 preflight (read only)"
  conf_from
  bad=0
  warn() { echo "  WARN  $*"; }
  no()   { echo "  FAIL  $*"; bad=1; }
  okk()  { echo "  ok    $*"; }
  arch=$(dpkg --print-architecture 2>/dev/null || echo unknown)
  case "$arch" in arm64|amd64) okk "architecture $arch" ;; *) no "architecture $arch – a 64-bit OS is needed" ;; esac
  [ "$arch" = arm64 ] || warn "GitHub builds the packages for arm64 (Raspberry Pi); on $arch change runs-on in pi-build.yml"
  if v=$(node -v 2>/dev/null); then
    case "$v" in v22.*) okk "node $v" ;; v2[0-9].*) warn "node $v – the packages are built with node 22" ;; *) no "node $v is too old (need 22)" ;; esac
  else no "node is not installed (the pi5-host kit installs Node 22: its phase 4)"; fi
  if systemctl is-active --quiet postgresql; then okk "postgresql $(ls /etc/postgresql 2>/dev/null | sort -V | tail -n1) running"; else no "postgresql is not running"; fi
  command -v cloudflared >/dev/null && okk "cloudflared $(cloudflared --version 2>/dev/null | awk '{print $3}')" || warn "cloudflared missing – phase 3 installs it"
  if ss -ltnH "sport = :$PORT" 2>/dev/null | grep -q . && ! systemctl is-active --quiet aries-web 2>/dev/null; then
    no "port $PORT is in use by another service – set another PORT in config/aries.conf"
  else okk "port $PORT free (127.0.0.1)"; fi
  avail=$(df -Pm "$(dirname "$ROOT")" | awk 'NR==2 {print $4}')
  if [ "$avail" -ge 10000 ]; then okk "disk: $((avail / 1024)) GB free"
  elif [ "$avail" -ge 6000 ]; then warn "disk: only $((avail / 1024)) GB free – the site needs ~6 GB (1.4 GB media twice, packages, releases)"
  else no "disk: $((avail / 1024)) GB free – the site needs ~6 GB"; fi
  mem=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo); memav=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
  if [ "$memav" -ge 1500 ]; then okk "memory: ${memav} MB available of ${mem} MB"; else warn "memory: only ${memav} MB available – the site uses up to 1.4 GB"; fi
  thr=$(vcgencmd get_throttled 2>/dev/null | cut -d= -f2 || true); [ -z "$thr" ] || [ "$thr" = 0x0 ] && okk "power/temperature ok" || warn "throttled=$thr (power supply or cooling)"
  { date; echo "--- listening"; ss -ltnp 2>/dev/null; echo "--- running services"; systemctl list-units --type=service --state=running --no-legend 2>/dev/null; } \
    >/var/log/aries-host-preflight.txt 2>&1 || true
  echo "  (listening ports and running services saved to /var/log/aries-host-preflight.txt – nothing may stop after the install)"
  [ $bad = 0 ] || die "preflight found problems (FAIL above)"
  echo "PREFLIGHT OK"
  [ "$ONLY" != 1 ] || exit 0
fi

if run 2; then
  say "2 kit to $KIT, settings to $ETC"
  if [ "$SRC_DIR" != "$KIT" ]; then
    install -d -m 755 "$KIT"
    rsync -a --delete --exclude secrets/ "$SRC_DIR"/ "$KIT"/
  fi
  chmod 755 "$KIT"/install.sh "$KIT"/bin/*.sh
  install -d -m 755 "$ETC"; install -d -m 700 "$ETC/secrets"
  [ -f "$ETC/aries.conf" ] || install -m 644 "$SRC_DIR/config/aries.conf" "$ETC/aries.conf"
  [ -f "$ETC/backup.env" ] || install -m 600 "$SRC_DIR/config/backup.env" "$ETC/backup.env"
  # site secrets from the bundle travel once and are merged into the .env in phase 5
  if [ -f "$SRC_DIR/secrets/aries.env" ]; then
    install -m 600 "$SRC_DIR/secrets/aries.env" "$ETC/secrets/bundle.env"
    shred -u "$SRC_DIR/secrets/aries.env" 2>/dev/null || rm -f "$SRC_DIR/secrets/aries.env"
    log "secrets/aries.env taken over (merged in phase 5) and shredded in the bundle folder"
  fi
  log "kit installed: $KIT, settings: $ETC/aries.conf"
fi

load_conf

if run 3; then
  say "3 packages (only what is missing)"
  ensure_pkgs curl ca-certificates git jq unzip rsync restic openssl util-linux
  if ! command -v cloudflared >/dev/null; then
    install -d -m 755 /usr/share/keyrings
    curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg >/usr/share/keyrings/cloudflare-main.gpg
    echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" >/etc/apt/sources.list.d/cloudflared.list
    DEBIAN_FRONTEND=noninteractive apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y cloudflared
  fi
  # cloudflared updates arrive with the security updates; restart this site's tunnel when its binary was replaced
  # (the pi5-host kit does the same for its own tunnel only)
  cat >/usr/local/sbin/aries-cloudflared-restart-if-upgraded <<'EOF'
#!/bin/sh
for u in aries-tunnel aries-quicktunnel; do
  p=$(systemctl show -p MainPID --value "$u" 2>/dev/null)
  [ -n "$p" ] && [ "$p" != 0 ] || continue
  case "$(readlink "/proc/$p/exe" 2>/dev/null)" in *"(deleted)"*) systemctl try-restart "$u" ;; esac
done
exit 0
EOF
  chmod 755 /usr/local/sbin/aries-cloudflared-restart-if-upgraded
  echo 'DPkg::Post-Invoke { "/usr/local/sbin/aries-cloudflared-restart-if-upgraded || true"; };' >/etc/apt/apt.conf.d/53aries-cloudflared
  log "packages ready"
fi

if run 4; then
  say "4 database $DB_NAME in the existing PostgreSQL (its settings stay untouched)"
  pwf="$ETC/secrets/db.pass"
  [ -s "$pwf" ] || { openssl rand -hex 24 >"$pwf"; chmod 600 "$pwf"; }
  # the password goes in through stdin, never on a command line
  sudo -u postgres psql -v ON_ERROR_STOP=1 -q <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_NAME') THEN
    CREATE ROLE "$DB_NAME" LOGIN PASSWORD '$(cat "$pwf")';
  ELSE
    ALTER ROLE "$DB_NAME" PASSWORD '$(cat "$pwf")';
  END IF;
END \$\$;
SQL
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 \
    || sudo -u postgres createdb -O "$DB_NAME" -E UTF8 -T template0 --locale=C.UTF-8 "$DB_NAME"
  # this role only: commits do not wait for the disk flush. Payload's schema sync runs hundreds of single statements and
  # on the Pi's SSD each flush took long enough that the first sync needed minutes; a crash can lose the last fraction of
  # a second of writes, never corrupt the database. The practice database keeps PostgreSQL's default.
  sudo -u postgres psql -v ON_ERROR_STOP=1 -qc "ALTER ROLE \"$DB_NAME\" SET synchronous_commit TO off"
  enc=$(sudo -u postgres psql -tAc "SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname='$DB_NAME'")
  [ "$enc" = UTF8 ] || die "database $DB_NAME has encoding $enc – it must be UTF8 (drop it if empty and run phase 4 again)"
  log "database $DB_NAME ready (owner $DB_NAME, password in $pwf)"
fi

if run 5; then
  say "5 site user, folders, .env, services"
  id "$APP_USER" >/dev/null 2>&1 || useradd --system --home-dir "$ROOT" --shell /usr/sbin/nologin "$APP_USER"
  install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$ROOT" "$ROOT/releases" "$ROOT/shared" "$ROOT/shared/media" "$ROOT/shared/logs"
  install -d -m 755 "$ROOT/deps" "$ROOT/incoming" "$STATE"
  [ -f "$ENV_FILE" ] || install -o "$APP_USER" -g "$APP_USER" -m 600 /dev/null "$ENV_FILE"
  fresh=no; env_has "$ENV_FILE" PAYLOAD_SECRET || fresh=yes
  if [ -f "$ETC/secrets/bundle.env" ]; then
    while IFS= read -r line; do
      [[ "$line" =~ ^([A-Z][A-Z0-9_]*)=(.*)$ ]] || continue
      k="${BASH_REMATCH[1]}"; v="${BASH_REMATCH[2]}"; v="${v%\"}"; v="${v#\"}"; v="${v%\'}"; v="${v#\'}"
      env_has "$ENV_FILE" "$k" || env_put "$ENV_FILE" "$k" "$v"
    done < <(tr -d '\r' <"$ETC/secrets/bundle.env")
    shred -u "$ETC/secrets/bundle.env" 2>/dev/null || rm -f "$ETC/secrets/bundle.env"
  fi
  env_put "$ENV_FILE" DEPLOY_TARGET node
  env_put "$ENV_FILE" PORT "$PORT"
  env_put "$ENV_FILE" MEDIA_DIR "$ROOT/shared/media"
  env_put "$ENV_FILE" DATABASE_URL "postgres://$DB_NAME:$(cat "$ETC/secrets/db.pass")@127.0.0.1:5432/$DB_NAME"
  env_has "$ENV_FILE" PAYLOAD_SECRET       || env_put "$ENV_FILE" PAYLOAD_SECRET "$(openssl rand -hex 32)"
  env_has "$ENV_FILE" NEXT_PUBLIC_SITE_URL || env_put "$ENV_FILE" NEXT_PUBLIC_SITE_URL "https://${HOSTNAMES%% *}"
  # a fresh install fills the CMS with the curated content once (bin/deploy.sh removes the flag after that deploy);
  # FRESH_CONTENT=no when the content comes from Netlify instead (bin/import-netlify.sh)
  if [ $fresh = yes ] && [ "${FRESH_CONTENT:-yes}" != no ]; then env_put "$ENV_FILE" BOOTSTRAP_PUBLIC_CONTENT true; fi
  chown "$APP_USER:$APP_USER" "$ENV_FILE"; chmod 600 "$ENV_FILE"
  for u in "$KIT"/templates/*.service "$KIT"/templates/*.timer; do install -m 644 "$u" "$SYSTEMD_DIR/"; done
  systemctl daemon-reload
  systemctl enable aries-web >/dev/null 2>&1
  log ".env ready: $(grep -c '^[A-Z0-9_]*=' "$ENV_FILE") keys ($(grep -o '^[A-Z0-9_]*' "$ENV_FILE" | tr '\n' ' ')– values not shown)"
  if ! env_has "$ENV_FILE" BOOTSTRAP_ADMIN_EMAIL && [ $fresh = yes ] && [ "${FRESH_CONTENT:-yes}" != no ]; then
    log "NOTE: no BOOTSTRAP_ADMIN_EMAIL/PASSWORD – the first deploy creates no administrator; set them with bin/set-env.sh before phase 7, or open /admin once to create the first account"
  fi
fi

if run 6; then
  say "6 GitHub token (read-only access to the build packages)"
  tf=$(gh_token_file)
  if [ -n "${GITHUB_TOKEN_FILE:-}" ]; then
    [ -s "$GITHUB_TOKEN_FILE" ] || die "$GITHUB_TOKEN_FILE is missing or empty"
    head -n1 "$GITHUB_TOKEN_FILE" | tr -d '\r\n\t ' | sed 's/^\xEF\xBB\xBF//' >"$tf.new"; chmod 600 "$tf.new"; mv "$tf.new" "$tf"
    shred -u "$GITHUB_TOKEN_FILE" 2>/dev/null || rm -f "$GITHUB_TOKEN_FILE"
    log "token taken over into $tf (source file shredded)"
  fi
  [ -s "$tf" ] || { log "CHECKPOINT: no token yet – MYCROFT.md checkpoint 1, then: sudo GITHUB_TOKEN_FILE=/path bash $KIT/install.sh --phase 6"; exit 3; }
  runs=$(gh_api "/repos/$REPO/actions/workflows/$WORKFLOW/runs?branch=$BRANCH&per_page=1") \
    || die "GitHub rejected the token or the workflow $WORKFLOW does not exist on $BRANCH yet (it is pushed with the site)"
  log "GitHub access ok: $(jq -r .total_count <<<"$runs") runs of $WORKFLOW on $BRANCH so far"
fi

if run 7; then
  say "7 first deploy (downloads ~1.7 GB once: packages + public/ media)"
  "$KIT/bin/deploy.sh" --retry
  if [ -L "$ROOT/current" ]; then log "site answers on http://127.0.0.1:$PORT ($(health_ok && echo healthy || echo NOT healthy))"
  else log "nothing deployed yet – is there a successful 'Build for the Pi' run on $BRANCH? (github.com/$REPO/actions)"; fi
fi

if run 8; then
  say "8 public access (${TUNNEL:-quick})"
  "$KIT/bin/tunnel-setup.sh" "${TUNNEL:-quick}"
fi

if run 9; then
  say "9 nightly encrypted backups"
  set -a; . "$ETC/backup.env"; set +a
  pf="${RESTIC_PASSWORD_FILE:?}"
  if [ ! -s "$pf" ]; then
    openssl rand -base64 32 >"$pf"; chmod 600 "$pf"
    log "CHECKPOINT: copy the backup password from $pf into the team's password manager (sudo cat $pf – never into chat or e-mail). Without it the backups cannot be restored."
  fi
  systemctl enable --now aries-backup.timer >/dev/null 2>&1
  log "backup timer active (03:45). Test now: sudo systemctl start aries-backup && journalctl -u aries-backup -n 20"
fi

if run 10; then
  say "10 timers: auto-deploy every 2 minutes, health check every 5 minutes"
  systemctl enable --now aries-deploy.timer aries-health.timer >/dev/null 2>&1
  log "auto-deploy and health timers active"
fi

say "status"; "$KIT/bin/status.sh" || true
