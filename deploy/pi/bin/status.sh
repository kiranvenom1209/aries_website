#!/usr/bin/env bash
# One screen: services, live release, deploy state, public address, disk, last backup. Prints no secrets.
#   sudo /opt/aries-host/bin/status.sh
set -uo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"
set +e   # report everything, even when one check fails
load_conf

echo "== HSM Aries website (aries-host)"
for u in aries-web aries-tunnel aries-quicktunnel aries-deploy.timer aries-health.timer aries-backup.timer; do
  printf '%-22s %s\n' "$u" "$(systemctl is-active "$u" 2>/dev/null)"
done
printf '%-22s %s\n' "health" "$(health_ok && echo ok || echo FAILING)"

echo "== Release"
cur=$(current_release)
if [ -n "$cur" ]; then
  echo "live       $(basename "$cur")  (commit $(release_sha "$cur" | cut -c1-7), built $(sed -n 's/.*"builtAt": *"\([^"]*\)".*/\1/p' "$cur/.pi/build.json" 2>/dev/null))"
else
  echo "live       – nothing deployed yet"
fi
echo "deployed   $(cut -d' ' -f1,3- "$STATE/deployed" 2>/dev/null | sed 's/^\(.\{7\}\)[0-9a-f]*/\1/' || echo –)"
[ -s "$STATE/failed" ] && echo "failed     $(cut -c1-7 "$STATE/failed") (skipped until a newer build or deploy.sh --retry)"
echo "last check $(cat "$STATE/last-check" 2>/dev/null || echo –)"
echo "releases   $(ls -1d "$ROOT"/releases/*/ 2>/dev/null | wc -l) kept, packages: $(ls -1 "$ROOT/deps" 2>/dev/null | tr '\n' ' ')"

echo "== Public address"
if systemctl is-active --quiet aries-tunnel; then
  echo "named tunnel: $(for h in ${HOSTNAMES:-}; do printf 'https://%s ' "$h"; done)"
fi
if systemctl is-active --quiet aries-quicktunnel; then
  inv=$(systemctl show -p InvocationID --value aries-quicktunnel)
  url=$(journalctl _SYSTEMD_INVOCATION_ID="$inv" --no-pager -o cat 2>/dev/null | grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' | tail -n1)
  echo "quick tunnel (test link, changes on every restart): ${url:-not ready yet}"
fi

echo "== Disk"
df -h "$ROOT" | awk 'NR==2 {print "free " $4 " of " $2 " (" $5 " used)"}'
du -sh "$ROOT/shared/media" "$ROOT/repo" "$ROOT/releases" "$ROOT/deps" 2>/dev/null | awk '{printf "%-8s %s\n", $1, $2}'

echo "== Last backup"
journalctl -u aries-backup -n 1 --no-pager -o cat 2>/dev/null || true
echo "== Recent log"
tail -n 6 "$LOG" 2>/dev/null || true
