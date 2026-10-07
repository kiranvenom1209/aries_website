#!/usr/bin/env bash
# Shared helpers of the aries-host kit (deploy/pi). Sourced by the scripts, never run directly.
#
# The kit runs the HSM Aries website on a Raspberry Pi next to whatever else the Pi does – it was written for the
# shared Pi "hawatchdog", which also hosts the Stegmann practice through the separate pi5-host kit. Nothing here
# touches pi5-host: own user (aries), own folders (/srv/aries, /etc/aries-host, /opt/aries-host), own systemd units
# (aries-*), own database in the shared PostgreSQL, own Cloudflare tunnel in the team's own Cloudflare account.
# Every root below can be overridden for tests only; production uses the defaults.
set -euo pipefail
# shellcheck disable=SC2034  # used by the scripts that source this file
{
KIT="${ARIES_KIT:-/opt/aries-host}"
ETC="${ARIES_ETC:-/etc/aries-host}"
ROOT="${ARIES_ROOT:-/srv/aries}"
SYSTEMD_DIR="${ARIES_SYSTEMD_DIR:-/etc/systemd/system}"
LOG="${ARIES_LOG:-/var/log/aries-host.log}"
LOCKFILE="${ARIES_LOCK:-/run/aries-host/lock}"
APP_USER="${ARIES_USER:-aries}"
DB_NAME="${ARIES_DB:-aries}"
ENV_FILE="$ROOT/shared/.env"
STATE="$ROOT/state"
}

log()  { local m; m="$(date '+%F %T')  $*"; echo "$m" >&2; { [ -e "$LOG" ] || install -m 640 /dev/null "$LOG"; echo "$m" >>"$LOG"; } 2>/dev/null || true; }
die()  { log "ERROR: $*"; exit 1; }
need_root() { [ "${ARIES_ALLOW_NONROOT:-}" = 1 ] || [ "$(id -u)" -eq 0 ] || die "run with sudo"; }

load_conf() {
  [ -f "$ETC/aries.conf" ] || die "$ETC/aries.conf missing – run install.sh (phase 2) first"
  set -a
  # shellcheck disable=SC1091
  . "$ETC/aries.conf"
  set +a
  : "${REPO:?REPO missing in $ETC/aries.conf}" "${PORT:?PORT missing in $ETC/aries.conf}"
  BRANCH="${BRANCH:-main}"; WORKFLOW="${WORKFLOW:-pi-build.yml}"
}

# one kit operation at a time (deploy, rollback, import) – waits up to 15 min; re-entrant for nested calls
with_lock() {
  if [ "${ARIES_LOCK_HELD:-}" = 1 ]; then "$@"; return; fi
  install -d -m 700 "$(dirname "$LOCKFILE")"
  (
    flock -w 900 9 || die "another aries-host operation has held $LOCKFILE for 15 min"
    export ARIES_LOCK_HELD=1
    "$@"
  ) 9>>"$LOCKFILE"
}
lock_busy() { [ -e "$LOCKFILE" ] && ! flock -n "$LOCKFILE" true 2>/dev/null; }

ensure_pkgs() {   # install only the missing ones
  local p missing=()
  for p in "$@"; do dpkg-query -W -f='${Status}' "$p" 2>/dev/null | grep -q 'install ok installed' || missing+=("$p"); done
  [ "${#missing[@]}" -gt 0 ] || return 0
  log "installing ${missing[*]}"
  export DEBIAN_FRONTEND=noninteractive
  apt-get install -y "${missing[@]}" || { apt-get update && apt-get install -y "${missing[@]}"; }
}

# env_put FILE KEY VALUE: set KEY without ever printing the value. Single quotes, which systemd's EnvironmentFile and
# bash both take literally; a value with a single quote is written double-quoted with \ " $ ` escaped.
env_put() {
  local f="$1" k="$2" v="$3" tmp e
  [[ "$k" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || die "env_put: bad key name '$k'"
  case "$v" in *$'\n'*|*$'\r'*) die "env_put: the value for $k contains a line break – nothing changed" ;; esac
  [ -e "$f" ] || install -m 600 /dev/null "$f"
  tmp=$(mktemp "$f.tmp.XXXXXX"); chmod 600 "$tmp"
  grep -v "^$k=" "$f" >"$tmp" || true
  if [[ "$v" != *"'"* ]]; then
    printf "%s='%s'\n" "$k" "$v" >>"$tmp"
  else
    e=$(printf '%s' "$v" | sed 's/[\\"$`]/\\&/g')
    printf '%s="%s"\n' "$k" "$e" >>"$tmp"
  fi
  cat "$tmp" >"$f"; rm -f "$tmp"
}
env_has() { grep -q "^$2=..*" "$1" 2>/dev/null; }   # set and non-empty
env_del() { local tmp; [ -f "$1" ] || return 0; tmp=$(mktemp "$1.tmp.XXXXXX"); grep -v "^$2=" "$1" >"$tmp" || true; cat "$tmp" >"$1"; rm -f "$tmp"; }

# as_app CMD: run a shell command as the app user in a clean environment (nothing of root's environment leaks in)
as_app() {
  runuser -u "$APP_USER" -- env -i PATH=/usr/local/bin:/usr/bin:/bin HOME="$ROOT" LANG=C.UTF-8 bash -c "$1"
}
# as_app_env CMD: the same with the app's .env loaded – NODE_ENV stays unset, so Payload syncs its schema like the
# Netlify build command did (see bin/deploy.sh)
as_app_env() {
  runuser -u "$APP_USER" -- env -i PATH=/usr/local/bin:/usr/bin:/bin HOME="$ROOT" LANG=C.UTF-8 NODE_OPTIONS=--no-deprecation \
    bash -c "set -a && . '$ENV_FILE' && set +a && unset NODE_ENV && $1"
}

# gh_api PATH: GET from the GitHub API with the read-only token. The token goes to curl on stdin (-H @-), never on
# its command line, where every local user could read it with ps.
gh_token_file() { echo "$ETC/secrets/github.token"; }
gh_api() {
  local tf; tf=$(gh_token_file)
  [ -s "$tf" ] || die "no GitHub token in $tf – see HERMES.md, checkpoint 1"
  printf 'Authorization: Bearer %s\n' "$(head -n1 "$tf" | tr -d '\r\n ')" \
    | curl -fsS -m 30 --retry 2 -H @- -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28' \
        "https://api.github.com$1"
}
# gh_download PATH OUT: an artifact zip (GitHub answers with a redirect to its storage; curl does not forward the
# Authorization header to that other host)
gh_download() {
  local tf; tf=$(gh_token_file)
  printf 'Authorization: Bearer %s\n' "$(head -n1 "$tf" | tr -d '\r\n ')" \
    | curl -fsSL -m 1800 --retry 3 --retry-delay 5 -H @- -H 'Accept: application/vnd.github+json' -o "$2" \
        "https://api.github.com$1"
}

health_ok() { curl -fsS -m 5 -o /dev/null "http://127.0.0.1:$PORT/api/health"; }

current_release() { readlink -f "$ROOT/current" 2>/dev/null || true; }
release_sha() { sed -n 's/.*"sha": *"\([0-9a-f]*\)".*/\1/p' "$1/.pi/build.json" 2>/dev/null | head -n1; }
