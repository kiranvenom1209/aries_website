#!/usr/bin/env bash
# A deploy stopped because the new code changes the database in a way that may lose data (a field renamed or removed
# in a Payload collection). Payload then asks before it changes anything; this runs that question for a person.
#   sudo /opt/aries-host/bin/schema-sync.sh /srv/aries/releases/<the release named in the deploy error>
# Read the warning: a removed field's content is deleted, a renamed field starts empty. Back up first if unsure:
#   sudo systemctl start aries-backup
# After "yes": sudo /opt/aries-host/bin/deploy.sh --retry
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
[ -t 0 ] || die "run this in a terminal – it asks a question"
REL=$(readlink -f "${1:?usage: schema-sync.sh /srv/aries/releases/<release>}")
case "$REL" in "$ROOT"/releases/*) ;; *) die "$REL is not a release folder" ;; esac
[ -f "$REL/.pi/bootstrap/seed-admin.mjs" ] || die "$REL has no bootstrap scripts"
echo "Payload compares the database with release $(basename "$REL") and asks before it changes anything."
echo "Answer y only if losing the data it names is intended."
with_lock as_app_env "cd '$REL' && node .pi/bootstrap/seed-admin.mjs"
log "schema sync for $(basename "$REL") run by hand – next: sudo $KIT/bin/deploy.sh --retry"
