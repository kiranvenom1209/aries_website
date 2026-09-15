// Turns a directory of rendered turntable frames (PNG, any size with a 4:3 aspect) into the WebP
// sequences the site streams, each composited onto the page colour so the masked edges vanish into
// the section:
//   frame_NNN.webp          2400x1800 full-resolution frames, shown while the rover is at rest
//   lite/frame_NNN.webp     1200x900 light frames (~35 KB) that drive the idle spin and dragging
//   mobile/…, lite/mobile/… 1200x1200 and 720x720 squares cropped tightly around the rover for phones
//
//   node scripts/encode-leap-one-turntable.mjs <input-dir> --version=v6
import { existsSync } from 'node:fs'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const inputDirectory = process.argv[2]
const version = process.argv.find(argument => argument.startsWith('--version='))?.split('=')[1]
const force = process.argv.includes('--force')
if (!inputDirectory || !version || !/^[a-z0-9-]+$/.test(version)) {
  throw new Error('Usage: node scripts/encode-leap-one-turntable.mjs <input-dir> --version=<v5>')
}
const rootDirectory = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const outputDirectory = path.join(rootDirectory, 'public', 'media', `leap-one-studio-${version}`)
if (existsSync(outputDirectory) && !force) {
  throw new Error('This render version already exists. Choose a new --version, or pass --force to re-encode into it.')
}
await mkdir(path.join(outputDirectory, 'mobile'), { recursive: true })
await mkdir(path.join(outputDirectory, 'lite', 'mobile'), { recursive: true })

const pageColor = { r: 3, g: 5, b: 6 }
const frames = (await readdir(inputDirectory)).filter(name => /^frame_\d{3}\.png$/.test(name)).sort()
if (frames.length === 0) throw new Error(`No frame_NNN.png files in ${inputDirectory}`)

const startedAt = Date.now()
let done = 0
const concurrency = 4
const queue = [...frames]
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const name = queue.shift()
      const output = name.replace(/\.png$/, '.webp')
      const source = sharp(path.join(inputDirectory, name)).flatten({ background: pageColor })
      await Promise.all([
        source.clone().resize(2400, 1800, { kernel: 'lanczos3' }).webp({ quality: 88, smartSubsample: true }).toFile(path.join(outputDirectory, output)),
        // Phones get a tighter square around the rover (it spans roughly x 450-1950, y 250-1600 of the
        // 2400x1800 frame at every angle) rather than the full-height centre crop.
        source.clone().extract({ left: 400, top: 120, width: 1600, height: 1600 }).resize(1200, 1200, { kernel: 'lanczos3' }).webp({ quality: 85, smartSubsample: true }).toFile(path.join(outputDirectory, 'mobile', output)),
        source.clone().resize(1200, 900, { kernel: 'lanczos3' }).webp({ quality: 72, smartSubsample: true }).toFile(path.join(outputDirectory, 'lite', output)),
        source.clone().extract({ left: 400, top: 120, width: 1600, height: 1600 }).resize(720, 720, { kernel: 'lanczos3' }).webp({ quality: 72, smartSubsample: true }).toFile(path.join(outputDirectory, 'lite', 'mobile', output)),
      ])
      done += 1
      if (done % 30 === 0 || done === frames.length) {
        process.stdout.write(`Encoded ${done}/${frames.length} (${((Date.now() - startedAt) / 1000).toFixed(0)} s)\n`)
      }
    }
  }),
)
process.stdout.write(`Wrote ${frames.length} frames to ${outputDirectory}\n`)
