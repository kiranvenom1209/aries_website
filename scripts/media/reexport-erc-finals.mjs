/**
 * Re-export the curated ERC 2026 finals photos (public/media/erc-2026-finals-NN-*.jpg)
 * from their raw sources at a 2560 px long edge, then delete their stale WebP variants
 * so `npm run media:responsive` rebuilds them.
 *
 * Curated filename -> raw stem comes from `picks.json` (slug map) in the gitignored
 * raw folder; the four "extra" Galaxy S23 shots are mapped inline.
 *
 *   node scripts/media/reexport-erc-finals.mjs <repoRoot> <rawFolder> [plan|run]
 *   e.g. node scripts/media/reexport-erc-finals.mjs . ../live-site-image-upload-269c43/erc-2026 run
 *
 * `plan` (default) only lists what would change. Run `npm run media:responsive` afterwards.
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [repo, rawRoot, mode = 'plan'] = process.argv.slice(2)
const media = path.join(repo, 'public', 'media')
const picks = JSON.parse(await readFile(path.join(rawRoot, 'picks.json'), 'utf8'))
const slugToStem = Object.fromEntries(Object.entries(picks.slugs).map(([stem, slug]) => [slug, stem]))

const extra = {
  'erc-2026-finals-40-rover-on-the-rocks.jpg': 'extra/20260905_134851.jpg',
  'erc-2026-finals-41-quadcopter-on-deck.jpg': 'extra/20260905_135024.jpg',
  'erc-2026-finals-42-suspension-over-the-rocks.jpg': 'extra/20260905_134844.jpg',
  'erc-2026-finals-43-carrying-the-quadcopter-past-the-markers.jpg': 'extra/20260905_135019.jpg',
}

const files = (await readdir(media)).filter((f) => /^erc-2026-finals-\d\d-.*\.jpg$/.test(f))
const jobs = []
for (const file of files) {
  const slug = file.replace(/^erc-2026-finals-\d\d-/, '').replace(/\.jpg$/, '')
  let src = extra[file] ? path.join(rawRoot, extra[file]) : slugToStem[slug] ? path.join(rawRoot, 'jpg', `${slugToStem[slug]}.jpg`) : null
  const cur = await sharp(path.join(media, file)).metadata()
  const curLong = Math.max(cur.width, cur.height)
  if (!src) { console.log('NO SOURCE', file); continue }
  let raw
  try { raw = await sharp(src).metadata() } catch { console.log('RAW MISSING', file, src); continue }
  const rawLong = Math.max(raw.width, raw.height)
  const target = Math.min(2560, rawLong)
  if (curLong >= target) continue
  jobs.push({ file, src, curLong, rawLong, target })
}
console.log(`${jobs.length} photos to re-export`)
for (const j of jobs) console.log(`  ${j.file}  ${j.curLong} -> ${j.target} (raw ${j.rawLong})`)
if (mode !== 'run') process.exit(0)

const variants = path.join(media, 'r')
for (const j of jobs) {
  const info = await sharp(j.src, { failOn: 'warning' })
    .rotate()
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .jpeg({ mozjpeg: true, progressive: true, quality: 84 })
    .toFile(path.join(media, j.file))
  const stem = j.file.replace(/\.jpg$/, '')
  for (const v of await readdir(variants)) if (v.startsWith(stem + '-') && /-\d+\.webp$/.test(v)) await unlink(path.join(variants, v))
  console.log(`  wrote ${j.file} ${info.width}x${info.height} ${Math.round((await stat(path.join(media, j.file))).size / 1024)} KB`)
}
