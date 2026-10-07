#!/usr/bin/env bash
# Every 5 minutes (aries-health.timer): is the site answering locally and through the public address? A site that
# fails twice in a row is restarted. Optional: Healthchecks.io ping (HC_PING_URL in aries.conf) – the only check that
# also notices a Pi that is off or offline.
set -uo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
set +e
load_conf
[ -L "$ROOT/current" ] || exit 0          # nothing deployed yet
lock_busy && exit 0                        # a deploy or rollback is restarting the site right now

fail=0; strikes="$STATE/health-strikes"
if health_ok; then
  rm -f "$strikes"
else
  n=$(( $(cat "$strikes" 2>/dev/null || echo 0) + 1 )); echo "$n" >"$strikes"
  if [ "$n" -ge 2 ]; then log "health: site not answering locally ($n checks) – restarting aries-web"; systemctl restart aries-web; rm -f "$strikes"; fi
  fail=1
fi
if systemctl is-active --quiet aries-tunnel; then
  for h in ${HOSTNAMES:-}; do
    curl -fsS -m 20 -o /dev/null "https://$h/api/health" || { log "health: https://$h unreachable (tunnel, DNS or Cloudflare)"; fail=1; }
    break   # the first hostname is enough; the others reach the same tunnel
  done
fi
if [ -n "${HC_PING_URL:-}" ]; then
  if [ $fail = 0 ]; then curl -fsS -m 10 -o /dev/null "$HC_PING_URL" || true; else curl -fsS -m 10 -o /dev/null "$HC_PING_URL/fail" || true; fi
fi
exit $fail
