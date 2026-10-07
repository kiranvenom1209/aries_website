# DNS of hsmaries.space

Registrar: **GoDaddy**. DNS until the move: **Netlify DNS** (NS1 nameservers dns1–4.p01.nsone.net). E-mail:
**GoDaddy** (secureserver.net). DNSSEC: off (no DS record) – the nameservers can be switched without extra steps.

Since 2026-10-07 the zone also exists, still *pending*, in Kiran's Cloudflare account
(kiranvenom1209@gmail.com – not the practice's account). It becomes active once GoDaddy points the domain at
Cloudflare's two nameservers (shown in the Cloudflare dashboard under hsmaries.space → DNS → Records).

## Records the Cloudflare zone must hold (all *DNS only*, grey cloud)

Copied from the Netlify zone on 2026-10-07 (14 records; the 4 Netlify hosting records are not carried over).

| Type | Name | Content | Note |
|---|---|---|---|
| MX | `@` | `smtp.secureserver.net`, priority **0** | GoDaddy mail |
| MX | `@` | `mailstore1.secureserver.net`, priority **10** | GoDaddy mail |
| TXT | `@` | `v=spf1 include:secureserver.net -all` | SPF |
| TXT | `_dmarc` | `v=DMARC1; p=reject; rua=mailto:dmarc_rua@onsecureserver.net;` | DMARC – **reject**: mail without valid DKIM/SPF bounces |
| CNAME | `secureserver1._domainkey` | `s1.dkim.hsmaries_space.96d.onsecureserver.net` | DKIM – **not found by Cloudflare's scan, add by hand** |
| CNAME | `secureserver2._domainkey` | `s2.dkim.hsmaries_space.96d.onsecureserver.net` | DKIM – **not found by Cloudflare's scan, add by hand** |
| CNAME | `email` | `email.secureserver.net` | webmail – the scan set it to *Proxied*; switch it to **DNS only** |
| SRV | `_autodiscover._tcp` | `0 0 443 autodiscover.secureserver.net` | mail client setup |
| TXT | `@` | `google-site-verification=BP3kcgNkDMEaVZ84uZq8tuqWschD6UHy5hWUz9sKmb0` | Google Search Console |
| TXT | `@` | `T3984061` | a verification token – origin unknown, kept |

## Records that must go

The scan also copied Netlify's hosting addresses: **4 × A** and **4 × AAAA** for `hsmaries.space` and
`www.hsmaries.space` (52.52.192.191, 13.52.188.95, 2600:1f1c:446:4900::258/259, 2600:1f18:16e:df01::258/259). Delete
them before the tunnel is set up – `bin/tunnel-setup.sh named` then creates one proxied CNAME per name, pointing at the
tunnel. Never use `--overwrite-dns` (on the apex it also deletes the MX records).

## After the nameserver switch

```bash
nslookup -type=NS hsmaries.space          # *.ns.cloudflare.com
nslookup -type=MX hsmaries.space          # smtp.secureserver.net + mailstore1.secureserver.net
nslookup -type=CNAME secureserver1._domainkey.hsmaries.space
```
Then send one test mail from the GoDaddy mailbox to a Gmail address and check *Show original*: SPF, DKIM and DMARC
must all say PASS.
