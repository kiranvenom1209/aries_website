#!/usr/bin/env bash
# Back to the previous release (or a given one). The database stays as it is – Payload's schema sync only ever adds
# to it unless someone accepted a data-losing change (bin/schema-sync.sh).
#   sudo /opt/aries-host/bin/rollback.sh                      the release before the current one
#   sudo /opt/aries-host/bin/rollback.sh /srv/aries/releases/<release>
# The deploy timer would bring the newest build straight back, so it remembers that build as "failed": it stays off
# until a newer commit is built or someone runs deploy.sh --retry.
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
[ "${ARIES_LOCK_HELD:-}" = 1 ] || { with_lock bash "$(readlink -f "$0")" "$@"; exit $?; }
load_conf
cur=$(current_release)
target="${1:-$(ls -1dt "$ROOT"/releases/*/ 2>/dev/null | sed 's:/$::' | grep -vxF "$cur" | head -n1 || true)}"
target=$(readlink -f "$target" 2>/dev/null || true)
case "$target" in "$ROOT"/releases/*) ;; *) die "no release to go back to (sudo ls $ROOT/releases)" ;; esac
[ -f "$target/.pi/build.json" ] && [ -e "$target/node_modules/next/package.json" ] || die "$target is not a complete release"
[ "$target" != "$cur" ] || die "$target is already live"

ln -sfn "$target" "$ROOT/current.new" && mv -Tf "$ROOT/current.new" "$ROOT/current"
systemctl restart aries-web
cur_sha=$(release_sha "$cur"); [ -z "$cur_sha" ] || echo "$cur_sha" >"$STATE/failed"
for _ in $(seq 1 60); do sleep 2; health_ok && break; done
if health_ok; then
  log "rolled back to $(basename "$target") – the build ${cur_sha:0:7} is skipped until a newer commit or deploy.sh --retry"
else
  log "rolled back to $(basename "$target"), but its health check fails – journalctl -u aries-web -n 50"; exit 1
fi
