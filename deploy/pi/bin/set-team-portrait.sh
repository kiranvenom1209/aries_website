#!/usr/bin/env bash
# Sets a team member's CMS portrait to a photo that ships with the live release (public/media/<file>) – for portraits
# added in code after the first install (scripts/set-team-portrait.ts). Editors can do the same in /admin → Team.
#   sudo /opt/aries-host/bin/set-team-portrait.sh kk-achari kk-achari.jpg
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
[ "${ARIES_LOCK_HELD:-}" = 1 ] || { with_lock bash "$(readlink -f "$0")" "$@"; exit $?; }
SLUG="${1:?usage: set-team-portrait.sh <slug> <file in public/media>}"; FILE="${2:?usage: set-team-portrait.sh <slug> <file in public/media>}"
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || die "slug must look like kk-achari"
[[ "$FILE" =~ ^[A-Za-z0-9._-]+$ ]] || die "file must be a plain file name in public/media"
cur=$(current_release); [ -n "$cur" ] || die "nothing deployed yet"
[ -f "$cur/.pi/bootstrap/set-team-portrait.mjs" ] || die "the live release has no set-team-portrait script (deploy a newer build)"
[ -f "$cur/public/media/$FILE" ] || die "$FILE is not in the live release's public/media"
as_app_env "cd '$cur' && node .pi/bootstrap/set-team-portrait.mjs '$SLUG' '$FILE'" </dev/null
log "team portrait of $SLUG set to $FILE"
