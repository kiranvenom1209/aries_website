import { copyFile, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDirectory = path.join(workspace, 'wordpress-source', 'selected-assets')
const destinationDirectory = path.join(workspace, 'public', 'media')

// This explicit allowlist prevents the optimizer from traversing the WordPress backup.
const assets = [
  { filename: 'aries-mark.png', maxDimension: 1200 },
  { filename: 'aries-wordmark.png', maxDimension: 1920 },
  { filename: 'erc-video-thumbnail.png', maxDimension: 1920, palette: true },
  { filename: 'ground-station.png', maxDimension: 1200 },
  { filename: 'hsm-powered-by.png', maxDimension: 1920 },
  { filename: 'leap-one-hero.jpg', maxDimension: 2560 },
  { filename: 'qualification-announcement.jpg', maxDimension: 1600 },
  { filename: 'qualification-score.png', maxDimension: 1600, palette: true },
  { filename: 'rover-compute.jpg', maxDimension: 1600 },
  { filename: 'space-night-exhibit.jpg', maxDimension: 2560 },
  { filename: 'space-night-rover.jpg', maxDimension: 2560 },
  { filename: 'space-night-team.jpg', maxDimension: 2560 },
]

for (const asset of assets) {
  const source = path.join(sourceDirectory, asset.filename)
  const destination = path.join(destinationDirectory, asset.filename)
  const temporary = path.join(destinationDirectory, `.${asset.filename}.optimized`)
  const extension = path.extname(asset.filename).toLowerCase()

  const pipeline = sharp(source, { failOn: 'warning' })
    .rotate()
    .resize({
      width: asset.maxDimension,
      height: asset.maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    })

  if (extension === '.jpg' || extension === '.jpeg') {
    pipeline.jpeg({ mozjpeg: true, progressive: true, quality: 86 })
  } else {
    pipeline.png({
      adaptiveFiltering: true,
      compressionLevel: 9,
      ...(asset.palette
        ? { colours: 256, dither: 1, palette: true, quality: 92 }
        : {}),
    })
  }

  await pipeline.toFile(temporary)

  const [before, optimized] = await Promise.all([stat(source), stat(temporary)])

  if (optimized.size < before.size) {
    await copyFile(temporary, destination)
  } else {
    await copyFile(source, destination)
  }

  await unlink(temporary)

  const after = await stat(destination)
  const savedPercent = Math.round((1 - after.size / before.size) * 100)
  process.stdout.write(
    `${asset.filename}: ${before.size} -> ${after.size} bytes (${savedPercent}% saved)\n`,
  )
}
