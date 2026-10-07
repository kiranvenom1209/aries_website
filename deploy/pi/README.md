# aries-host — hsmaries.space on our own Raspberry Pi

The HSM Aries website runs on the team's Raspberry Pi instead of Netlify: no credits, no paused site. Same idea as
the Stegmann practice site on that Pi (pi5-host kit), but a separate installation – the two never share a user,
folder, service, database or tunnel.

```
git push main ──► GitHub Actions "Build for the Pi" (free Arm machine) ──► packages (app + node_modules)
                                                                              │
Pi: aries-deploy.timer (every 2 min) asks GitHub ◄────────────────────────────┘  (outbound only – nothing reaches in)
     └─► bin/deploy.sh: download → public/ from git → release → schema sync → switch → health check → keep or roll back

visitor ──► https://hsmaries.space ──► Cloudflare (CDN, HTTPS) ──► tunnel (outbound) ──► aries-web :4330 ──► PostgreSQL
```

| Netlify did | Here |
|---|---|
| Build on push | GitHub's free Arm runner builds for the Pi (`.github/workflows/pi-build.yml`); a public repository must never get a self-hosted runner, so the Pi *pulls* finished builds instead |
| Atomic deploys, rollback | `bin/deploy.sh`: `releases/<time>-<sha>`, `current` symlink, health check, automatic switch back; `bin/rollback.sh` |
| Build command `bootstrap:*` | the same scripts, bundled, run before each switch: Payload schema sync, first administrator, curated content (fresh install only), team profiles |
| Netlify Database | PostgreSQL on the Pi (database `aries`, beside the practice's) |
| Netlify Blobs (CMS uploads) | `/srv/aries/shared/media` – outside the releases |
| Netlify Forms | *Mission Control → Inbox → Form messages* (+ e-mail copy when SMTP is set) |
| HTTPS, CDN, domain | Cloudflare Tunnel in Kiran's Cloudflare account (the zone hsmaries.space – never the practice's account); Cloudflare caches `/media/*` for a day |
| Backups | nightly `pg_dump` + uploads → restic (encrypted) |

## Install

Copy this folder to the Pi (e.g. the share) and follow **HERMES.md** – it is the brief for the Pi's agent and reads
fine for people too. In short: `sudo bash install.sh`, plus three things only a person can do: a read-only GitHub
token, the domain moved to Cloudflare, one click on Cloudflare's *Authorize* link.

## Daily use

- **Publish code:** push to `main`. GitHub builds (~6–8 min), the Pi picks it up within 2 minutes and switches after
  its health check. Watch: github.com/kiranvenom1209/aries_website/actions, then `sudo /opt/aries-host/bin/status.sh`.
- **Content:** `/admin` (Mission Control) as before – changes are live immediately; the home, LEAP-One and Leap-2 pages
  pick them up within 5 minutes.
- **Something broke:** `sudo /opt/aries-host/bin/rollback.sh` – the previous release, in seconds.
- More in `docs/runbook.md`.

## Files

| | |
|---|---|
| `install.sh` | phases 1–10, idempotent |
| `bin/deploy.sh` | pull + deploy (timer) · `--check` · `--retry` · `--sha` |
| `bin/rollback.sh`, `bin/status.sh`, `bin/health.sh`, `bin/backup.sh` | operations |
| `bin/set-env.sh` | change a secret without showing it |
| `bin/tunnel-setup.sh` | `quick` test link or `named` hsmaries.space |
| `bin/schema-sync.sh` | answer Payload's question when a deploy would delete CMS data |
| `bin/import-netlify.sh`, `tools/` | one-off move of the Netlify content |
| `templates/` | systemd units (`aries-*`) |
| `config/` | defaults for `/etc/aries-host` |
