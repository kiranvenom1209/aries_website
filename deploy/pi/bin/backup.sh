#!/usr/bin/env bash
# Nightly (aries-backup.timer, 03:45 – after the Stegmann backup at 03:15): database dump + CMS uploads + the site's
# .env into an encrypted restic repository of its own. Default target is a folder on the Pi itself, which does not
# survive a dead SSD – point RESTIC_REPOSITORY in /etc/aries-host/backup.env at the NAS or a cloud folder.
#   sudo systemctl start aries-backup      (now)       ·   sudo /opt/aries-host/bin/backup.sh --list
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
[ -f "$ETC/backup.env" ] || die "$ETC/backup.env missing – run install.sh (phase 8)"
set -a
# shellcheck disable=SC1091
. "$ETC/backup.env"
set +a
export RESTIC_REPOSITORY RESTIC_PASSWORD_FILE
if [ "${1:-}" = --list ]; then restic snapshots --tag aries; exit; fi

D=/var/backups/aries; install -d -m 700 "$D"
sudo -u postgres pg_dump -Fc "$DB_NAME" >"$D/$DB_NAME.dump.tmp" && mv "$D/$DB_NAME.dump.tmp" "$D/$DB_NAME.dump"
install -m 600 "$ENV_FILE" "$D/site.env"
restic cat config >/dev/null 2>&1 || restic init
restic backup --tag aries --tag nightly "$D" "$ROOT/shared/media" "$ETC/aries.conf"
restic forget --tag aries --keep-daily 14 --keep-weekly 8 --keep-monthly 12 --prune
[ -z "${HC_BACKUP_URL:-}" ] || curl -fsS -m 10 -o /dev/null "$HC_BACKUP_URL" || true
log "backup done ($(du -sh "$D/$DB_NAME.dump" | cut -f1) database, $(du -sh "$ROOT/shared/media" | cut -f1) uploads)"
