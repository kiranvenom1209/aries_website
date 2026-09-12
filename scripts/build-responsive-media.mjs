/**
 * Responsive image pipeline for the static `/media/*` photos.
 *
 * Scans `src/` for every `/media/<file>.(jpg|jpeg|png)` reference, and for each
 * source that lives directly under `public/media/` writes WebP variants to
 * `public/media/r/<stem>-<width>.webp` for every bucket width strictly below
 * the original width, plus one at the original's own width (capped at 3840)
 * so every photo has a 1:1 candidate and is never served upscaled from a
 * smaller bucket. `src/lib/imageLoader.ts` reads the emitted manifest
 * (`src/lib/responsive-manifest.json`) so `next/image` can build a real srcset
 * without an image CDN.
 *
 *   node scripts/build-responsive-media.mjs          # skip variants that already exist
 *   node scripts/build-responsive-media.mjs --force  # re-encode everything
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(workspace, 'src')
const mediaRoot = path.join(workspace, 'public', 'media')
const outputRoot = path.join(mediaRoot, 'r')
const manifestPath = path.join(sourceRoot, 'lib', 'responsive-manifest.json')

/** Width buckets, ascending. Mirrors `images.imageSizes` + `images.deviceSizes` in next.config.ts. */
const BUCKETS = [144, 384, 640, 960, 1280, 1920, 2560, 3840]
const MAX_BUCKET = BUCKETS[BUCKETS.length - 1]
/** Logos and badges narrower than this get no variants; they are small enough as they are. */
const MIN_SOURCE_WIDTH = 300
const CONCURRENCY = 4

const force = process.argv.includes('--force')

const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.css', '.md', '.mdx'])
const SKIP_DIRECTORIES = new Set(['node_modules', '.next'])
const REFERENCE_PATTERN = /\/media\/([^/"'`\s()<>?#]+\.(?:jpe?g|png))/gi

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) yield* walk(path.join(directory, entry.name))
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      yield path.join(directory, entry.name)
    }
  }
}

/** Every distinct `/media/<file>` image reference under `src/`, as bare filenames. */
async function collectReferences() {
  const references = new Set()
  for await (const file of walk(sourceRoot)) {
    // The manifest itself is not a reference source, and the legacy-path map lists old names on purpose.
    if (file === manifestPath || path.basename(file) === 'mediaPaths.ts') continue
    const text = await readFile(file, 'utf8')
    for (const match of text.matchAll(REFERENCE_PATTERN)) references.add(match[1])
  }
  return [...references].sort((a, b) => a.localeCompare(b))
}

const stemOf = (filename) => filename.replace(/\.[^.]+$/, '')

function variantWidths(originalWidth) {
  const widths = BUCKETS.filter((width) => width < originalWidth)
  // Top variant is the source's own width (capped): a 1920 px photo must be
  // available at 1920, not stretched from 1280. The 3840 cap is what lets a
  // 100vw hero reach 1:1 on a 2x display.
  const top = Math.min(originalWidth, MAX_BUCKET)
  if (widths.length === 0 || top > widths[widths.length - 1]) widths.push(top)
  return widths
}

async function exists(file) {
  try {
    await stat(file)
    return true
  } catch {
    return false
  }
}

async function sourceWidth(file) {
  const metadata = await sharp(file).metadata()
  // EXIF orientation 5-8 rotates by 90°, so the displayed width is the stored height.
  const rotated = (metadata.orientation ?? 1) >= 5
  return rotated ? metadata.height : metadata.width
}

async function encodeVariant(source, destination, width) {
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(destination)
}

async function processImage(filename) {
  const source = path.join(mediaRoot, filename)
  if (!(await exists(source))) return { filename, skipped: 'missing' }

  const width = await sourceWidth(source)
  if (!width || width < MIN_SOURCE_WIDTH) return { filename, skipped: `narrow (${width}px)` }

  const widths = variantWidths(width)
  if (widths.length === 0) return { filename, skipped: `narrow (${width}px)` }

  const stem = stemOf(filename)
  let written = 0
  for (const variantWidth of widths) {
    const destination = path.join(outputRoot, `${stem}-${variantWidth}.webp`)
    if (!force && (await exists(destination))) continue
    await encodeVariant(source, destination, variantWidth)
    written += 1
  }

  const [original, largest] = await Promise.all([
    stat(source),
    stat(path.join(outputRoot, `${stem}-${widths[widths.length - 1]}.webp`)),
  ])

  return {
    filename,
    largestBytes: largest.size,
    largestWidth: widths[widths.length - 1],
    originalBytes: original.size,
    originalWidth: width,
    widths,
    written,
  }
}

async function runPool(items, worker) {
  const results = new Array(items.length)
  let cursor = 0
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++
        results[index] = await worker(items[index])
      }
    }),
  )
  return results
}

const kb = (bytes) => `${Math.round(bytes / 1024).toLocaleString('en-GB')} KB`

async function main() {
  const references = await collectReferences()

  // Two sources with the same stem (photo.jpg + photo.png) would overwrite each other's variants.
  const stems = new Map()
  for (const filename of references) {
    const stem = stemOf(filename)
    if (stems.has(stem)) {
      throw new Error(`Stem collision: "${stems.get(stem)}" and "${filename}" both map to "${stem}-<w>.webp"`)
    }
    stems.set(stem, filename)
  }

  await mkdir(outputRoot, { recursive: true })

  const results = await runPool(references, processImage)

  const manifest = {}
  const rows = []
  const skipped = []
  let originalTotal = 0
  let variantTotal = 0
  let written = 0

  for (const result of results) {
    if (result.skipped) {
      skipped.push(`${result.filename} (${result.skipped})`)
      continue
    }
    manifest[result.filename] = result.widths
    rows.push(result)
    originalTotal += result.originalBytes
    variantTotal += result.largestBytes
    written += result.written
  }

  // One source per line keeps the manifest diff-friendly.
  const manifestText = `{\n${Object.entries(manifest)
    .map(([filename, widths]) => `  ${JSON.stringify(filename)}: [${widths.join(', ')}]`)
    .join(',\n')}\n}\n`
  await writeFile(manifestPath, manifestText)

  const nameWidth = Math.max(...rows.map((row) => row.filename.length), 8)
  process.stdout.write(`\n${'source'.padEnd(nameWidth)}  ${'original'.padStart(18)}  ${'largest variant'.padStart(18)}  saved\n`)
  for (const row of rows) {
    const saved = Math.round((1 - row.largestBytes / row.originalBytes) * 100)
    process.stdout.write(
      `${row.filename.padEnd(nameWidth)}  ${`${row.originalWidth}w ${kb(row.originalBytes)}`.padStart(18)}  ${`${row.largestWidth}w ${kb(row.largestBytes)}`.padStart(18)}  ${String(saved).padStart(3)}%\n`,
    )
  }
  process.stdout.write(
    `\n${rows.length} sources, ${written} variants written${force ? ' (forced)' : ''}, ${skipped.length} skipped.\n` +
      `Originals ${kb(originalTotal)} -> largest variants ${kb(variantTotal)}.\n` +
      `Manifest: ${path.relative(workspace, manifestPath)}\n`,
  )
  if (skipped.length) process.stdout.write(`Skipped: ${skipped.join(', ')}\n`)
}

await main()
