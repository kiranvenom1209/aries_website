/**
 * Upscale every referenced photo whose long edge is under 1920 px with Real-ESRGAN
 * (realesrgan-x4plus, ncnn-vulkan build), capped at a 2560 px long edge, and write it back
 * under the same filename so nothing in `src/` changes. Logos, brand marks and department
 * badges are excluded (see EXCLUDE) — a photo model must not touch them.
 *
 * Only for photos that have NO higher-resolution original. Where a raw exists (the ERC
 * finals set), re-export from the raw instead: scripts/media/reexport-erc-finals.mjs.
 *
 * Needs the Real-ESRGAN Windows release unzipped somewhere (realesrgan-ncnn-vulkan.exe +
 * models/): https://github.com/xinntao/Real-ESRGAN/releases (realesrgan-ncnn-vulkan-*-windows.zip).
 *
 *   node scripts/media/upscale-low-res.mjs <repoRoot> <esrganDir> <tmpDir> [plan|run]
 *
 * `plan` (default) lists the candidates. EXIF orientation is baked in before upscaling
 * (the ncnn binary ignores it). Stale WebP variants are deleted; run
 * `npm run media:responsive` afterwards. Idempotent: anything already >= 1920 is skipped.
 */
import { readdir, readFile, mkdir, unlink, stat, rm, copyFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import sharp from 'sharp'

sharp.cache(false) // libvips' operation cache keeps sources open on Windows, which blocks overwriting them

const [repo, esrganDir, tmpDir, mode = 'plan'] = process.argv.slice(2)
const media = path.join(repo, 'public', 'media')
const manifest = JSON.parse(await readFile(path.join(repo, 'src', 'lib', 'responsive-manifest.json'), 'utf8'))
const EXCLUDE = /(logo|hsm-png|cropped-falcon|schroedel_540x540|^l1[-_])/i
const MIN_LONG = 1920, CAP = 2560

const jobs = []
for (const file of Object.keys(manifest)) {
  if (EXCLUDE.test(file)) continue
  const md = await sharp(path.join(media, file)).metadata()
  const rot = (md.orientation ?? 1) >= 5
  const w = rot ? md.height : md.width, h = rot ? md.width : md.height
  const long = Math.max(w, h)
  if (long >= MIN_LONG) continue
  jobs.push({ file, w, h, target: Math.min(CAP, long * 4), format: md.format })
}
console.log(`${jobs.length} images to upscale`)
for (const j of jobs) console.log(`  ${j.file}  ${j.w}x${j.h} -> long edge ${j.target}`)
if (mode !== 'run') process.exit(0)

await mkdir(tmpDir, { recursive: true })
const exe = path.join(esrganDir, 'realesrgan-ncnn-vulkan.exe')
let n = 0
for (const j of jobs) {
  n += 1
  const src = path.join(media, j.file)
  const pre = path.join(tmpDir, `pre-${n}.png`), up = path.join(tmpDir, `up-${n}.png`)
  await sharp(src).rotate().png().toFile(pre)                     // bake EXIF orientation
  execFileSync(exe, ['-i', pre, '-o', up, '-n', 'realesrgan-x4plus', '-s', '4'], { stdio: 'ignore' })
  let img = sharp(up).resize({ width: j.target, height: j.target, fit: 'inside', withoutEnlargement: true })
  img = j.format === 'png' ? img.png({ compressionLevel: 9 }) : img.jpeg({ mozjpeg: true, progressive: true, quality: 86 })
  const out = path.join(tmpDir, `out-${n}${path.extname(j.file)}`)
  const info = await img.toFile(out)
  await copyFile(out, src)                                          // in-place toFile fails on Windows while the source is mapped
  await rm(out, { force: true })
  const stem = j.file.replace(/\.[^.]+$/, '')
  for (const v of await readdir(path.join(media, 'r'))) if (v.startsWith(stem + '-') && /-\d+\.webp$/.test(v)) await unlink(path.join(media, 'r', v))
  console.log(`  [${n}/${jobs.length}] ${j.file} ${j.w}x${j.h} -> ${info.width}x${info.height} ${Math.round((await stat(src)).size / 1024)} KB`)
  await rm(pre, { force: true }); await rm(up, { force: true })
}
