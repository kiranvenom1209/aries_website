// Launcher for the Cycles turntable render: finds Blender, runs scripts/render-leap-one-turntable.py
// with the given arguments, then (for a full run) encodes the PNG frames into the site's WebP sequence.
//
//   npm run render:leap-one-turntable -- --preview
//   npm run render:leap-one-turntable -- --version=v6
//   npm run render:leap-one-turntable -- --version=v6 --resume      (continue an interrupted render)
//   npm run render:leap-one-turntable -- --version=v6 --encode-only (frames already rendered)
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const args = process.argv.slice(2)
const preview = args.includes('--preview')
const encodeOnly = args.includes('--encode-only')
const version = args.find(argument => argument.startsWith('--version='))?.split('=')[1] ?? 'v6'

function findBlender() {
  if (process.env.BLENDER && existsSync(process.env.BLENDER)) return process.env.BLENDER
  const candidates = []
  for (const base of ['C:\\Program Files\\Blender Foundation', '/Applications', '/usr/bin', '/usr/local/bin', '/snap/bin']) {
    if (!existsSync(base)) continue
    for (const entry of readdirSync(base)) {
      for (const name of ['blender.exe', 'blender', 'Blender.app/Contents/MacOS/Blender']) {
        const candidate = path.join(base, entry, name)
        if (existsSync(candidate)) candidates.push(candidate)
      }
      if (entry === 'blender' || entry === 'blender.exe') candidates.push(path.join(base, entry))
    }
  }
  candidates.sort().reverse()
  return candidates.find(existsSync)
}

const framesDirectory = path.join(os.tmpdir(), preview ? 'aries-turntable-preview' : `aries-turntable-${version}`)

if (!encodeOnly) {
  const blender = findBlender()
  if (!blender) throw new Error('Blender was not found. Install Blender 4.x or set the BLENDER environment variable to the executable.')
  process.stdout.write(`Using ${blender}\n`)
  const passthrough = args.filter(argument => argument !== '--encode-only')
  const result = spawnSync(blender, ['-b', '--python', path.join(rootDirectory, 'scripts', 'render-leap-one-turntable.py'), '--', ...passthrough], { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (!preview) {
  const result = spawnSync(process.execPath, [path.join(rootDirectory, 'scripts', 'encode-leap-one-turntable.mjs'), framesDirectory, `--version=${version}`, ...(args.includes('--resume') || encodeOnly ? ['--force'] : [])], { stdio: 'inherit' })
  process.exit(result.status ?? 1)
}
