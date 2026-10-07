#!/usr/bin/env bash
# Set one value in the site's .env without it ever appearing on screen, in the shell history or in a log.
#   sudo /opt/aries-host/bin/set-env.sh SMTP_PASS                     asks for the value (typing is hidden)
#   sudo /opt/aries-host/bin/set-env.sh SMTP_PASS --from-file /path   reads the first line of a file, then shreds it
#   sudo /opt/aries-host/bin/set-env.sh FORMS_NOTIFY_TO --delete
# Restarts the site afterwards so it reads the new value.
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
KEY="${1:?usage: set-env.sh KEY [--from-file FILE | --delete]}"
[[ "$KEY" =~ ^[A-Z][A-Z0-9_]*$ ]] || die "key must look like SMTP_PASS"
case "$KEY" in DATABASE_URL|DEPLOY_TARGET|MEDIA_DIR) die "$KEY is managed by install.sh" ;; esac
[ -f "$ENV_FILE" ] || die "$ENV_FILE missing – run install.sh first"

case "${2:-}" in
  --delete) env_del "$ENV_FILE" "$KEY"; log "$KEY removed from $ENV_FILE" ;;
  --from-file)
    f="${3:?--from-file needs a file}"; [ -s "$f" ] || die "$f is missing or empty"
    v=$(head -n1 "$f" | tr -d '\r' | sed 's/^\xEF\xBB\xBF//')
    shred -u "$f" 2>/dev/null || rm -f "$f"
    [ -n "$v" ] || die "$f had an empty first line"
    env_put "$ENV_FILE" "$KEY" "$v"; log "$KEY set from a file (${#v} characters, value not shown; file shredded)" ;;
  "")
    read -rsp "value for $KEY (hidden): " v; echo
    [ -n "$v" ] || die "empty value – nothing changed"
    env_put "$ENV_FILE" "$KEY" "$v"; log "$KEY set (${#v} characters, value not shown)" ;;
  *) die "usage: set-env.sh KEY [--from-file FILE | --delete]" ;;
esac
chown "$APP_USER:$APP_USER" "$ENV_FILE"; chmod 600 "$ENV_FILE"
if [ -L "$ROOT/current" ]; then systemctl restart aries-web; log "aries-web restarted"; fi
