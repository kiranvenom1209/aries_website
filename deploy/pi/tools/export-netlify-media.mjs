// Runs on the development PC (from the repository root, after npm ci): downloads every file editors uploaded to the
// CMS on Netlify – they live in the Netlify Blob store "hsm-aries-media", not in git – into a folder that
// deploy/pi/bin/import-netlify.sh copies onto the Pi.
//
//   $env:NETLIFY_AUTH_TOKEN = '<personal access token>'   # Netlify → User settings → Applications → New access token
//   $env:NETLIFY_SITE_ID    = '<site id>'                 # Netlify → the site → Site configuration → Site ID
//   node deploy/pi/tools/export-netlify-media.mjs out/netlify-media
//
// Prints file names and sizes, never the token. Payload stores uploads flat by file name on the Pi, so keys like
// media/<prefix>/<name> become <name>; a name that occurs twice is kept under _collisions/ and listed in manifest.json.
import fs from 'node:fs'
import path from 'node:path'

import { getStore } from '@netlify/blobs'

const outDir = path.resolve(process.argv[2] ?? 'out/netlify-media')
const token = process.env.NETLIFY_AUTH_TOKEN
const siteID = process.env.NETLIFY_SITE_ID
if (!token || !siteID) {
  console.error('Set NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID first (see the comment at the top of this file).')
  process.exit(2)
}

const store = getStore({ name: 'hsm-aries-media', siteID, token })
fs.mkdirSync(outDir, { recursive: true })

const manifest = { exportedAt: new Date().toISOString(), files: [], collisions: [] }
const taken = new Set()
let bytes = 0

for await (const page of store.list({ paginate: true })) {
  for (const { key } of page.blobs) {
    const data = await store.get(key, { type: 'arrayBuffer' })
    if (!data) continue
    const name = path.basename(key)
    let file = name
    if (taken.has(name)) {
      file = path.join('_collisions', key.replaceAll('/', '__'))
      manifest.collisions.push({ key, file })
      fs.mkdirSync(path.join(outDir, '_collisions'), { recursive: true })
    }
    taken.add(name)
    fs.writeFileSync(path.join(outDir, file), Buffer.from(data))
    manifest.files.push({ key, file, size: data.byteLength })
    bytes += data.byteLength
    console.log(`${key}  ${(data.byteLength / 1024).toFixed(0)} KB`)
  }
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`\n${manifest.files.length} files, ${(bytes / 1e6).toFixed(1)} MB -> ${outDir}`)
if (manifest.collisions.length) console.log(`${manifest.collisions.length} name collisions kept under _collisions/ (see manifest.json)`)
