#!/usr/bin/env bash
# One-off move of what editors created on Netlify (MYCROFT.md, checkpoint 4). Run after the first deploy – Payload has
# created the tables by then.
#   sudo /opt/aries-host/bin/import-netlify.sh db FILE       FILE: one line, the Netlify Database connection string
#                                                          (postgres://…). Replaces ALL CMS content on the Pi with
#                                                          Netlify's – accounts, stories, team, uploads' records.
#                                                          The file is shredded afterwards.
#   sudo /opt/aries-host/bin/import-netlify.sh media DIR    DIR: the folder deploy/pi/tools/export-netlify-media.mjs
#                                                          wrote on the PC (the uploaded files themselves)
# Order: media, then db (or db, then media – both work; the site shows broken images only until both are in).
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
[ "${ARIES_LOCK_HELD:-}" = 1 ] || { with_lock bash "$(readlink -f "$0")" "$@"; exit $?; }
load_conf
WHAT="${1:?usage: import-netlify.sh db FILE | media DIR}"; SRC="${2:?usage: import-netlify.sh db FILE | media DIR}"
cur=$(current_release); [ -n "$cur" ] || die "deploy the site once first (sudo $KIT/bin/deploy.sh)"

case "$WHAT" in
db)
  [ -s "$SRC" ] || die "$SRC is missing or empty"
  tool="$cur/.pi/tools/copy-db.mjs"; [ -f "$tool" ] || die "this release has no import tool ($tool)"
  # the tool runs as the postgres superuser (it loads rows without checking foreign keys) – give it private copies
  T=$(mktemp -d); chmod 711 "$T"
  install -m 644 "$tool" "$T/copy-db.mjs"
  install -o postgres -m 600 /dev/null "$T/source-url"; head -n1 "$SRC" | tr -d '\r' >"$T/source-url"
  shred -u "$SRC" 2>/dev/null || rm -f "$SRC"
  log "copying the CMS database from Netlify (tables and row counts below; no values are printed)"
  rc=0
  (cd "$T" && sudo -u postgres env SOURCE_URL_FILE="$T/source-url" TARGET_DB="$DB_NAME" node "$T/copy-db.mjs") || rc=$?
  shred -u "$T/source-url" 2>/dev/null || true; rm -rf "$T"
  [ $rc = 0 ] || die "the copy failed – nothing was changed on the Pi (it runs in one transaction)"
  systemctl restart aries-web
  log "CMS database imported from Netlify – the site restarted; editors sign in with their Netlify passwords"
  ;;
media)
  [ -d "$SRC" ] || die "$SRC is not a folder"
  [ -f "$SRC/manifest.json" ] || die "$SRC has no manifest.json – export it with deploy/pi/tools/export-netlify-media.mjs"
  n=$(find "$SRC" -maxdepth 1 -type f ! -name manifest.json | wc -l)
  rsync -a --chown="$APP_USER:$APP_USER" --chmod=D750,F640 --exclude manifest.json --exclude '_collisions/' "$SRC"/ "$ROOT/shared/media"/
  log "$n uploaded files from Netlify copied to $ROOT/shared/media"
  [ ! -d "$SRC/_collisions" ] || log "WARN: $SRC/_collisions holds files whose names clashed – see manifest.json, copy by hand if needed"
  ;;
*) die "usage: import-netlify.sh db FILE | media DIR" ;;
esac
