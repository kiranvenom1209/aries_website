import { readFile } from 'node:fs/promises'

const filePath = process.argv[2]
if (!filePath) throw new Error('Usage: node scripts/inspect-glb.mjs <model.glb>')

const file = await readFile(filePath)
if (file.toString('ascii', 0, 4) !== 'glTF') throw new Error('Not a GLB file')

const version = file.readUInt32LE(4)
const declaredLength = file.readUInt32LE(8)
const jsonLength = file.readUInt32LE(12)
const jsonChunkType = file.toString('ascii', 16, 20)

if (version !== 2 || declaredLength !== file.length || jsonChunkType !== 'JSON') {
  throw new Error('Invalid or unsupported GLB 2.0 header')
}

const document = JSON.parse(file.toString('utf8', 20, 20 + jsonLength).trim())
const externalReferences = [
  ...(document.buffers ?? []).flatMap((buffer) =>
    typeof buffer.uri === 'string' ? [buffer.uri] : [],
  ),
  ...(document.images ?? []).flatMap((image) =>
    typeof image.uri === 'string' ? [image.uri] : [],
  ),
]

process.stdout.write(
  `${JSON.stringify(
    {
      animations: document.animations?.length ?? 0,
      asset: document.asset,
      bytes: file.length,
      externalReferences,
      extensionsRequired: document.extensionsRequired ?? [],
      extensionsUsed: document.extensionsUsed ?? [],
      images: document.images?.length ?? 0,
      materials: document.materials?.length ?? 0,
      meshes: document.meshes?.length ?? 0,
      nodes: document.nodes?.length ?? 0,
      scenes: document.scenes?.length ?? 0,
      skins: document.skins?.length ?? 0,
      textures: document.textures?.length ?? 0,
      version,
    },
    null,
    2,
  )}\n`,
)
