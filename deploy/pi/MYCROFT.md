# Brief for Mycroft — put the HSM Aries website on this Raspberry Pi

You are adding a second website to this Pi: **hsmaries.space**, the HSM Aries rover team's site (Next.js +
Payload CMS + PostgreSQL), replacing Netlify, which keeps pausing it ("usage exceeded"). Your owner is Kiran.
This folder is the complete kit (`aries-host`). Read every script before you run it.

The Pi already hosts the **Stegmann practice site** through the separate **pi5-host** kit (patient data). It must not
notice anything of this installation.

## Rules (non-negotiable)

1. **Secrets:** never print, echo, `cat`, log or paste `/srv/aries/shared/.env`, `/etc/aries-host/secrets/*`,
   `/etc/aries-host/cloudflared/*.json`, tokens or passwords. Check keys by *name* only
   (`sudo grep -o '^[A-Z0-9_]*=' /srv/aries/shared/.env`). Never send them over chat, e-mail or any API.
2. **Do not touch the Stegmann installation:** nothing under `/opt/pi5-host`, `/etc/pi5-host`, `/srv/apps`,
   `/etc/cloudflared`; never restart, reconfigure or stop `cloudflared.service`, `app@stegmann`, `pi5-*` units,
   PostgreSQL's configuration or the firewall. This kit only adds a role and a database to PostgreSQL.
3. **No open ports.** The site listens on 127.0.0.1 only; the public way in is an outbound Cloudflare tunnel. Never add
   port forwards or firewall rules.
4. **Stop and ask Kiran** at every CHECKPOINT and before: rebooting, deleting data, `import-netlify.sh db` (it replaces
   the CMS content), `schema-sync.sh` (it may delete data), or anything not in this brief.
5. **Idempotent:** every phase can run again (`sudo bash install.sh --phase N`). When one fails, read the error, fix the
   cause, run that phase again – no workarounds that weaken security.
6. **Real e-mails:** form tests only with an address Kiran gives you.
7. Log what you do (commands + short results, no secrets) and give Kiran a summary at the end.

## Before you start — CHECKPOINT 0 (with Kiran)

- Save `ss -ltnp` and `systemctl list-units --type=service --state=running` to `~/aries-before.txt`; compare after
  every phase – nothing that ran before may stop.
- The **"Build for the Pi"** workflow must have run successfully on GitHub at least once
  (github.com/kiranvenom1209/aries_website → Actions). It runs on every push to `main`; Kiran pushes the code that
  contains it.

## Phases

From this folder (e.g. the share): `sudo bash install.sh` runs everything up to a test link, or phase by phase with
`sudo bash install.sh --phase N`. Verify each phase before the next.

| # | Phase | Verify |
|---|---|---|
| 1 | preflight (read only) | `PREFLIGHT OK`; port 4330 free; ≥ 6 GB free disk; node v22 |
| 2 | kit → `/opt/aries-host`, settings → `/etc/aries-host` | `ls /opt/aries-host/bin /etc/aries-host` |
| 3 | missing packages only (git, jq, unzip, restic …) | Stegmann site still answers: `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:4321/api/health` → 200 |
| 4 | role + database `aries` (UTF8) | `sudo -u postgres psql -c '\l'` lists aries and still stegmann |
| 5 | user `aries`, `/srv/aries`, `.env`, systemd units | key names only: DEPLOY_TARGET, PORT, MEDIA_DIR, DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL (+ BOOTSTRAP_* on a fresh install) |
| 6 | GitHub token (CHECKPOINT 1) | `GitHub access ok: N runs` |
| 7 | first deploy (~1.7 GB download, 5–15 min) | `curl -s http://127.0.0.1:4330/api/health` → `{"ok":true}`; `sudo /opt/aries-host/bin/status.sh` |
| 8 | public access – first the quick test link | `status.sh` shows a trycloudflare.com link that opens the site |
| 9 | nightly backups (03:45) | `sudo systemctl start aries-backup && journalctl -u aries-backup -n 20` ends with "backup done" |
| 10 | timers: auto-deploy every 2 min, health every 5 min | `systemctl list-timers 'aries-*'` |

**Fresh install or content from Netlify?** Ask Kiran before phase 5. Fresh (default): the first deploy fills the CMS
with the curated content and creates the first administrator from `BOOTSTRAP_ADMIN_EMAIL`/`BOOTSTRAP_ADMIN_PASSWORD`
(Kiran puts them into `secrets/aries.env` in this folder before phase 2, or sets them with
`sudo /opt/aries-host/bin/set-env.sh BOOTSTRAP_ADMIN_PASSWORD` – he types the password himself). From Netlify: run
phase 5 as `sudo FRESH_CONTENT=no bash install.sh --phase 5` and continue with CHECKPOINT 4 after phase 7.

## CHECKPOINT 1 — GitHub token (Kiran)

Kiran creates a **fine-grained personal access token** on github.com → Settings → Developer settings → Fine-grained
tokens: resource owner `kiranvenom1209`, *Only select repositories* → `aries_website`, permission **Actions:
Read-only** (nothing else), expiry 1 year (note the date). He saves it as the first line of a text file in this folder,
e.g. `secrets/github-token.txt`. Then:
`sudo GITHUB_TOKEN_FILE=<this folder>/secrets/github-token.txt bash install.sh --phase 6` (the file is shredded).
The token can only *read* build results; it cannot change the repository.

## CHECKPOINT 2 — the domain (Kiran)

hsmaries.space is registered at **GoDaddy**; its DNS is at **Netlify DNS** today and its e-mail at **GoDaddy**.
The zone is already added (still *pending*) to **Kiran's Cloudflare account** (kiranvenom1209@gmail.com) – never the
practice's account. `docs/dns.md` lists every record it must hold.

1. Kiran, in Cloudflare → hsmaries.space → DNS → Records: delete the 8 A/AAAA records of `hsmaries.space` and `www`
   (Netlify's addresses), add the two DKIM CNAMEs `secureserver1._domainkey` / `secureserver2._domainkey` (the scan
   missed them – without them the DMARC policy `p=reject` bounces the team's outgoing mail), switch `email` to
   *DNS only*. Compare the result with `docs/dns.md`. Never delete MX or TXT.
2. Kiran, at GoDaddy (dcc.godaddy.com → hsmaries.space → DNS → Nameservers → *Change* → *I'll use my own*): enter
   Cloudflare's two nameservers. Wait until Cloudflare shows the domain as **Active** (minutes to a few hours).
3. Cloudflare settings: SSL/TLS → Edge Certificates → *Always Use HTTPS* on; Scrape Shield → *Email Address
   Obfuscation* **off** (it rewrites the e-mail links on the site).
4. You: `sudo TUNNEL=named bash install.sh --phase 8`. `cloudflared tunnel login` prints a link – send it to Kiran; he
   opens it logged in to that Cloudflare account and clicks *Authorize* next to hsmaries.space; wait for "You have
   successfully logged in". The script creates the tunnel `hsm-aries`, the two DNS records and removes the account
   certificate again. Check: https://hsmaries.space and https://www.hsmaries.space (→ redirects to the first) load;
   the checks at the end of `docs/dns.md` pass. Then `sudo systemctl disable --now aries-quicktunnel`.

## CHECKPOINT 3 — acceptance test with Kiran

Home, LEAP-One, Leap-2, News + one story, Team + one profile, Gallery, Datenschutz (shows "eigenen Server" and
Cloudflare), `/admin` login (Kiran types the password), upload one image in Media and open it, send the contact form
once with Kiran's address → it appears in Mission Control under *Inbox → Form messages*. Delete the test message.

## CHECKPOINT 4 — content from Netlify (only if Kiran wants it)

Netlify has been paused for exceeded usage; reading its database and blob store may still work.
1. Media: Kiran runs on his PC, in the website repository:
   `node deploy/pi/tools/export-netlify-media.mjs out/netlify-media` (with `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
   set, see the file) and copies `out/netlify-media` into this folder. You:
   `sudo /opt/aries-host/bin/import-netlify.sh media <this folder>/netlify-media`.
2. Database: Kiran puts the Netlify Database connection string (Netlify → the site → Database) as the first line of
   `secrets/netlify-db-url.txt`. With his go: `sudo /opt/aries-host/bin/import-netlify.sh db <that file>` – it replaces
   all CMS content on the Pi, prints tables and row counts, shreds the file. Editors then sign in with their Netlify
   passwords.

## CHECKPOINT 5 — reboot test

Ask Kiran, then `sudo reboot`. Without logging in, after ~3 min: `curl -s http://127.0.0.1:4330/api/health`, the public
address loads, the Stegmann site answers too. `sudo /opt/aries-host/bin/status.sh`.

## Later (each needs Kiran once)

- **Backups off the Pi:** point `RESTIC_REPOSITORY` in `/etc/aries-host/backup.env` at the NAS share, run
  `sudo systemctl start aries-backup`. Kiran stores `/etc/aries-host/secrets/restic.pass` in the team's password
  manager (he reads it himself).
- **Form e-mails:** a Gmail app password for hsmariesleapone@gmail.com (Google account → Security → App passwords).
  Kiran sets `SMTP_HOST` = smtp.gmail.com, `SMTP_PORT` = 465, `SMTP_USER` = the address with
  `sudo /opt/aries-host/bin/set-env.sh <KEY>`, and types `SMTP_PASS` himself. Until then form messages are only in
  Mission Control.
- **Outside alert:** a free Healthchecks.io check; its ping URL into `HC_PING_URL` in `/etc/aries-host/aries.conf`.
- **Netlify:** once hsmaries.space runs here, Kiran stops builds of the Netlify site (Site configuration → Build &
  deploy → *Stop builds*) so pushes no longer use Netlify credits.

## Done = report to Kiran

Public address, `status.sh` output, what was tested (with results), open checkpoints, anything unusual — no secrets.
