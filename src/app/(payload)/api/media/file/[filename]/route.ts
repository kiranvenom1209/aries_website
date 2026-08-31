import fs from 'node:fs'
import path from 'node:path'
import config from '@payload-config'
import { getPayload } from 'payload'

import { readNetlifyMedia } from '@/storage/netlifyBlobs'

export const dynamic = 'force-dynamic'

type MediaDocument = {
  filename?: string | null
  mimeType?: string | null
  prefix?: string | null
}

const MIME_MAP: Record<string, string> = {
  '.avif': 'image/avif',
  '.csv': 'text/csv',
  '.gif': 'image/gif',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.zip': 'application/zip',
}

const getContentType = (filename: string, fallbackMime?: string | null): string => {
  const ext = path.extname(filename).toLowerCase()
  return MIME_MAP[ext] ?? fallbackMime ?? 'application/octet-stream'
}

export async function GET(
  request: Request,
  context: RouteContext<'/api/media/file/[filename]'>,
) {
  const { filename } = await context.params
  const safeFilename = path.basename(filename)

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      or: [
        { filename: { equals: safeFilename } },
        { 'sizes.thumbnail.filename': { equals: safeFilename } },
        { 'sizes.card.filename': { equals: safeFilename } },
        { 'sizes.hero.filename': { equals: safeFilename } },
      ],
    },
  })
  const media = result.docs[0] as MediaDocument | undefined

  // 1. Try Netlify Blobs if configured
  try {
    const blobResponse = await readNetlifyMedia(safeFilename, media?.prefix ?? undefined)
    if (blobResponse) return blobResponse
  } catch {
    // Continue to local filesystem checks
  }

  // 2. Try serving from local disk (public/media or media)
  const candidatePaths = [
    path.resolve(process.cwd(), 'public', 'media', safeFilename),
    path.resolve(process.cwd(), 'media', safeFilename),
    ...(media?.filename && media.filename !== safeFilename
      ? [
          path.resolve(process.cwd(), 'public', 'media', media.filename),
          path.resolve(process.cwd(), 'media', media.filename),
        ]
      : []),
  ]

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = await fs.promises.readFile(filePath)
        const contentType = getContentType(safeFilename, media?.mimeType)

        return new Response(fileBuffer, {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Length': fileBuffer.byteLength.toString(),
            'Content-Type': contentType,
          },
          status: 200,
        })
      } catch {
        // Fall through on read error
      }
    }
  }

  return new Response('Media asset not found.', { status: 404 })
}

