#!/usr/bin/env bash
# Public access for the site through a Cloudflare Tunnel – outbound only: no port forwarding, no router settings.
#   sudo /opt/aries-host/bin/tunnel-setup.sh quick   temporary https://<random>.trycloudflare.com link for testing
#                                                   (no account; the link changes whenever the tunnel restarts)
#   sudo /opt/aries-host/bin/tunnel-setup.sh named   hsmaries.space + www (HOSTNAMES in aries.conf) through a tunnel in
#                                                   the Cloudflare account that holds the domain (Kiran's) – the domain must already use
#                                                   Cloudflare's nameservers (HERMES.md, checkpoint 2)
# The named setup needs a person once: `cloudflared tunnel login` prints a link; open it in a browser that is logged
# in to the Cloudflare account holding hsmaries.space and click "Authorize" next to hsmaries.space. Everything of this tunnel lives in
# /etc/aries-host/cloudflared – the Stegmann tunnel (/etc/cloudflared, cloudflared.service, the practice's account)
# is never touched.
set -euo pipefail
. "$(dirname "$(readlink -f "$0")")/../lib.sh"; need_root
load_conf
MODE="${1:?usage: tunnel-setup.sh quick|named}"
command -v cloudflared >/dev/null || die "cloudflared is not installed (it comes with the pi5-host kit; else: https://pkg.cloudflare.com)"
CF="$ETC/cloudflared"; install -d -m 700 "$CF"

case "$MODE" in
quick)
  systemctl enable --now aries-quicktunnel
  url=""
  for _ in $(seq 1 30); do
    sleep 2
    inv=$(systemctl show -p InvocationID --value aries-quicktunnel)
    url=$(journalctl _SYSTEMD_INVOCATION_ID="$inv" --no-pager -o cat 2>/dev/null | grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' | tail -n1 || true)
    [ -n "$url" ] && break
  done
  log "quick tunnel: ${url:-no link yet – sudo $KIT/bin/status.sh shows it once it is up}"
  ;;
named)
  T="${TUNNEL_NAME:?TUNNEL_NAME missing in aries.conf}"
  [ -n "${HOSTNAMES:-}" ] || die "HOSTNAMES missing in aries.conf"
  export HOME="$CF"   # cloudflared keeps its login certificate in $HOME/.cloudflared – here, not in /root
  cert="$CF/.cloudflared/cert.pem"
  if [ ! -f "$CF/config.yml" ]; then
    if [ ! -f "$cert" ]; then
      log "CHECKPOINT: open the link below in a browser logged in to the Cloudflare account that holds, ${HOSTNAMES%% *} (not the practice account), click Authorize next to it"
      cloudflared tunnel login
    fi
    [ -f "$cert" ] || die "Cloudflare login not completed – run this again and open the link within a few minutes"
    chmod 600 "$cert"
    tunnel_id() { local l; l=$(cloudflared tunnel --origincert "$cert" list -o json 2>/dev/null || true); jq -r --arg t "$T" '(. // [])[] | select(.name == $t) | .id' <<<"${l:-[]}" | head -n1; }
    [ -n "$(tunnel_id)" ] || cloudflared tunnel --origincert "$cert" create "$T"
    id=$(tunnel_id); [ -n "$id" ] || die "tunnel $T was not created"
    [ -f "$CF/.cloudflared/$id.json" ] || die "tunnel $T exists in Cloudflare, but its credentials are not on this Pi – delete it in the dashboard (Networking → Tunnels) or choose another TUNNEL_NAME"
    install -m 600 "$CF/.cloudflared/$id.json" "$CF/$id.json"
    {
      echo "tunnel: $id"
      echo "credentials-file: $CF/$id.json"
      echo "ingress:"
      # Payload's "create the first administrator" page and API are open to anyone while the CMS has no account.
      # They never need to be public: the first administrator comes from BOOTSTRAP_ADMIN_* (bin/set-env.sh), and
      # once an account exists Payload refuses them anyway – so the tunnel never passes them on.
      for h in $HOSTNAMES; do
        printf '  - hostname: %s\n    path: ^/(admin/create-first-user|api/users/first-register)\n    service: http_status:404\n' "$h"
      done
      for h in $HOSTNAMES; do printf '  - hostname: %s\n    service: http://127.0.0.1:%s\n' "$h" "$PORT"; done
      echo "  - service: http_status:404"
    } >"$CF/config.yml.new"
    cloudflared tunnel --config "$CF/config.yml.new" ingress validate || die "invalid tunnel configuration"
    mv "$CF/config.yml.new" "$CF/config.yml"
    # DNS: one proxied CNAME per hostname to <id>.cfargotunnel.com. NEVER --overwrite-dns: on the apex it also deletes
    # the MX record (it did on the Stegmann domain) – the GoDaddy e-mail would stop. Old A/CNAME records of
    # these names (copied from Netlify DNS) are deleted by hand in the Cloudflare dashboard first.
    # by id, with retries: right after "tunnel create" Cloudflare's API may not know the new tunnel by name yet
    # ("code: 1002, Tunnel not found" on 2026-10-07)
    for h in $HOSTNAMES; do
      routed=0
      for _ in 1 2 3 4 5 6; do
        if cloudflared tunnel --origincert "$cert" route dns "$id" "$h"; then routed=1; break; fi
        sleep 5
      done
      [ $routed = 1 ] || log "WARN: DNS for $h not set – in the Cloudflare dashboard add a proxied CNAME $h → $id.cfargotunnel.com (delete only an old A/AAAA/CNAME of $h first, keep MX and TXT!)"
    done
  else
    log "tunnel already configured ($CF/config.yml) – only (re)starting it"
  fi
  systemctl enable --now aries-tunnel
  systemctl restart aries-tunnel
  sleep 8
  if journalctl -u aries-tunnel -n 50 --no-pager -o cat 2>/dev/null | grep -q 'Registered tunnel connection'; then
    log "tunnel $T connected – $(for h in $HOSTNAMES; do printf 'https://%s ' "$h"; done)"
  else
    log "tunnel $T started, no connection yet – journalctl -u aries-tunnel -n 30"
  fi
  # the account certificate can change every tunnel and DNS record of the team's domains – the running tunnel only needs
  # its own credentials file. Remove it (running this again later simply asks for the browser login again).
  if [ -f "$cert" ]; then shred -u "$cert" 2>/dev/null || rm -f "$cert"; log "removed the Cloudflare account certificate from the Pi"; fi
  # the quick test link is no longer needed once the domain answers
  if systemctl is-enabled --quiet aries-quicktunnel 2>/dev/null; then
    log "the quick test tunnel still runs – switch it off once https://${HOSTNAMES%% *} works: sudo systemctl disable --now aries-quicktunnel"
  fi
  ;;
*) die "usage: tunnel-setup.sh quick|named" ;;
esac
