/**
 * Replace site photos with re-encodes of their verified higher-resolution originals.
 *
 * Input: the match list written by find-hires-sources.mjs (plus, optionally, a verdicts
 * file from the visual verification pass: only matches whose verdict says same_picture
 * AND candidate_sharper are applied). Each accepted photo is re-encoded from its source at
 * the pipeline cap (3840 long edge, mozjpeg q82) under the SAME filename, and its stale
 * WebP variants are deleted so `npm run media:responsive` rebuilds them.
 *
 *   node scripts/media/replace-from-hires-sources.mjs <repoRoot> <matches.json> [verdicts.json] [plan|run]
 *
 * PNG targets (renders, logos) are left alone — a 3840 px PNG photo is 15 MB for nothing.
 */
import { readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

sharp.cache(false)
const [repo, matchesPath, verdictsPath, mode = 'plan'] = process.argv.slice(2)
const media = path.join(repo, 'public', 'media')
const CAP = 3840
const { matches } = JSON.parse(await readFile(matchesPath, 'utf8'))
let accepted = new Map(matches.map((m) => [m.index, true]))
if (verdictsPath && verdictsPath !== 'plan' && verdictsPath !== 'run') {
  const { verdicts } = JSON.parse(await readFile(verdictsPath, 'utf8'))
  accepted = new Map(verdicts.map((v) => [v.index, v.same_picture && v.candidate_sharper]))
}
const runMode = [verdictsPath, mode].includes('run')

const jobs = []
for (const m of matches) {
  if (!accepted.get(m.index)) { console.log(`  skip (verdict)   ${m.site}`); continue }
  if (/\.png$/i.test(m.site)) { console.log(`  skip (png)       ${m.site}`); continue }
  const long = Math.max(m.siteW, m.siteH)
  const target = Math.min(CAP, Math.max(m.candW, m.candH))
  if (long >= target) { console.log(`  skip (at cap)    ${m.site}`); continue }
  jobs.push({ ...m, target })
}
console.log(`${jobs.length} photos to re-export at up to ${CAP}`)
for (const j of jobs) console.log(`  ${j.site}  ${Math.max(j.siteW, j.siteH)} -> ${j.target}`)
if (!runMode) process.exit(0)

const variants = path.join(media, 'r')
const written = []
for (const j of jobs) {
  const out = path.join(media, j.site)
  const info = await sharp(j.candidate, { failOn: 'none' })
    .rotate()
    .resize({ width: CAP, height: CAP, fit: 'inside', withoutEnlargement: true })
    .jpeg({ mozjpeg: true, progressive: true, quality: 82 })
    .toFile(out + '.tmp')
  await unlink(out).catch(() => {})
  const { rename } = await import('node:fs/promises')
  await rename(out + '.tmp', out)
  const stem = j.site.replace(/\.[^.]+$/, '')
  for (const v of await readdir(variants)) if (v.startsWith(stem + '-') && /-\d+\.webp$/.test(v)) await unlink(path.join(variants, v))
  const kb = Math.round((await stat(out)).size / 1024)
  written.push({ site: j.site, width: info.width, height: info.height, kb, source: j.candidate })
  console.log(`  wrote ${j.site} ${info.width}x${info.height} ${kb} KB`)
}
await writeFile(path.join(path.dirname(matchesPath), 'hires-replaced.json'), JSON.stringify(written, null, 2))
console.log(`${written.length} written, ${Math.round(written.reduce((a, w) => a + w.kb, 0) / 1024)} MB of originals`)
