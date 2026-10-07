# Runbook — hsmaries.space on the Pi

| Task | Command |
|---|---|
| Overview | `sudo /opt/aries-host/bin/status.sh` |
| Site log (live) | `journalctl -u aries-web -f` |
| Deploy log | `sudo tail -n 50 /var/log/aries-host.log` · per release: `/srv/aries/shared/logs/deploy-*.log` |
| What would deploy now | `sudo /opt/aries-host/bin/deploy.sh --check` |
| Deploy now / retry a failed build | `sudo /opt/aries-host/bin/deploy.sh` · `--retry` |
| Deploy an older build | `sudo /opt/aries-host/bin/deploy.sh --sha <commit>` (last 20 builds, packages kept 7 days) |
| Back to the previous release | `sudo /opt/aries-host/bin/rollback.sh` |
| Restart the site | `sudo systemctl restart aries-web` |
| Change a secret (SMTP_PASS …) | `sudo /opt/aries-host/bin/set-env.sh SMTP_PASS` (typing hidden; restarts the site) |
| Pause auto-deploy | `sudo systemctl stop aries-deploy.timer` · resume: `start` |
| Backup now / list | `sudo systemctl start aries-backup` · `sudo /opt/aries-host/bin/backup.sh --list` |
| Tunnel log | `journalctl -u aries-tunnel -n 50` |
| A replaced photo still shows the old one | Cloudflare dashboard → hsmaries.space → Caching → *Purge Everything* (edge copies live up to a day) |

## A deploy stopped with "may lose data"

The new code renames or removes a field of a Payload collection. Nothing was changed; the old release keeps running.
Read the warning in the deploy log. If the loss is intended: `sudo systemctl start aries-backup`, then
`sudo /opt/aries-host/bin/schema-sync.sh /srv/aries/releases/<release from the message>`, answer `y`, then
`sudo /opt/aries-host/bin/deploy.sh --retry`. If not intended, fix the code (keep the field, or migrate its content)
and push again.

## The GitHub token expired

`status.sh` → last check "GitHub not reachable or the token was rejected". Create a new fine-grained token (HERMES.md,
checkpoint 1), save it as the first line of a file, then
`sudo GITHUB_TOKEN_FILE=/path/token.txt bash /opt/aries-host/install.sh --phase 6`.

## Restore the database

```bash
sudo systemctl stop aries-web aries-deploy.timer
sudo bash -c 'set -a; . /etc/aries-host/backup.env; restic restore latest --tag aries --target /tmp/restore --include /var/backups/aries/aries.dump'
sudo -u postgres dropdb aries && sudo -u postgres createdb -O aries -E UTF8 -T template0 aries
sudo -u postgres pg_restore -d aries --no-owner --role=aries /tmp/restore/var/backups/aries/aries.dump
sudo systemctl start aries-web aries-deploy.timer && sudo rm -rf /tmp/restore
```

## Restore the uploads

```bash
sudo bash -c 'set -a; . /etc/aries-host/backup.env; restic restore latest --tag aries --target /tmp/restore --include /srv/aries/shared/media'
sudo rsync -a /tmp/restore/srv/aries/shared/media/ /srv/aries/shared/media/ && sudo chown -R aries:aries /srv/aries/shared/media
sudo rm -rf /tmp/restore
```

## New Pi / dead SSD

Raspberry Pi OS Lite 64-bit, Node 22 and PostgreSQL (the pi5-host kit's phases 3–5 install them, or `apt`), then this
kit's `install.sh` with `FRESH_CONTENT=no`; restore the database and the uploads as above; the site's `.env` is in the
backup as `/var/backups/aries/site.env` (copy it to `/srv/aries/shared/.env`, owner aries, mode 600). The tunnel:
`sudo TUNNEL=named bash install.sh --phase 8` (a new login creates a new tunnel; delete the old one in the Cloudflare
dashboard and its two DNS records first).

## Disk

`status.sh` shows the big folders. `releases/` keeps 5 releases (≈ 100 MB each, media are hardlinks), `deps/` the
node_modules of releases still kept, `repo/` the git copy of public/ (gc runs by itself above 4 GB).
