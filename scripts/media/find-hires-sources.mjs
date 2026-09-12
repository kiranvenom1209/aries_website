/**
 * For every photo referenced by the site (responsive-manifest.json), look for a
 * higher-resolution copy of the SAME picture in a set of source folders, matched by
 * perceptual hash (dHash + aHash on a 16x16 luma thumbnail), not by filename.
 *
 *   node scripts/media/find-hires-sources.mjs <repoRoot> <out.json> <sourceDir> [<sourceDir> ...]
 *
 * Output: { matches: [{ site, siteW, siteH, candidate, candW, candH, gain, distance }], unmatched: [...] }
 * WordPress thumbnail copies (-300x200, -scaled) are skipped; the largest file per picture wins.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

sharp.cache(false)
const [repo, outPath, ...sourceDirs] = process.argv.slice(2)
const media = path.join(repo, 'public', 'media')
const manifest = JSON.parse(await readFile(path.join(repo, 'src', 'lib', 'responsive-manifest.json'), 'utf8'))
const EXT = /\.(jpe?g|png|webp|tiff?)$/i
const WP_DERIVATIVE = /-(\d+x\d+|scaled)(-e\d+)?\.(jpe?g|png|webp)$/i
const SKIP = /(logo|hsm-png|cropped-falcon|schroedel_540x540|^l1[-_])/i

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (EXT.test(e.name)) yield p
  }
}

async function fingerprint(file) {
  const img = sharp(file, { failOn: 'none' }).rotate()
  const md = await img.metadata()
  const rot = (md.orientation ?? 1) >= 5
  const w = rot ? md.height : md.width, h = rot ? md.width : md.height
  const { data } = await img.grayscale().resize(17, 16, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true })
  const d = []
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) d.push(data[y * 17 + x] > data[y * 17 + x + 1] ? 1 : 0)
  let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i]
  const mean = sum / data.length
  const a = []
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) a.push(data[y * 17 + x] > mean ? 1 : 0)
  return { file, w, h, d, a, aspect: w / h }
}
const ham = (x, y) => { let n = 0; for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) n++; return n }

async function pool(items, fn, n = 8) {
  const out = []; let i = 0
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; try { out[k] = await fn(items[k]) } catch { out[k] = null } } }))
  return out.filter(Boolean)
}

const siteFiles = Object.keys(manifest).filter((f) => !SKIP.test(f))
const site = await pool(siteFiles.map((f) => path.join(media, f)), fingerprint)
const candFiles = []
for (const dir of sourceDirs) for await (const f of walk(dir)) if (!WP_DERIVATIVE.test(path.basename(f))) candFiles.push(f)
console.error(`${site.length} site photos, ${candFiles.length} candidate files`)
const cands = await pool(candFiles, fingerprint)

const matches = [], unmatched = []
for (const s of site) {
  let best = null
  for (const c of cands) {
    if (Math.abs(Math.log(c.aspect / s.aspect)) > 0.06) continue           // same framing only
    const dist = ham(s.d, c.d) + ham(s.a, c.a)                                // 0..512
    if (dist > 60) continue
    if (c.w * c.h <= s.w * s.h * 1.15) continue                               // must be meaningfully bigger
    if (!best || dist < best.dist || (dist === best.dist && c.w * c.h > best.c.w * best.c.h)) best = { c, dist }
  }
  if (best) matches.push({ site: path.basename(s.file), siteW: s.w, siteH: s.h, candidate: best.c.file, candW: best.c.w, candH: best.c.h, gain: +(best.c.w / s.w).toFixed(2), distance: best.dist })
  else unmatched.push({ site: path.basename(s.file), siteW: s.w, siteH: s.h })
}
matches.sort((x, y) => y.gain - x.gain)
await writeFile(outPath, JSON.stringify({ matches, unmatched }, null, 2))
console.error(`${matches.length} site photos have a larger source; ${unmatched.length} do not`)
