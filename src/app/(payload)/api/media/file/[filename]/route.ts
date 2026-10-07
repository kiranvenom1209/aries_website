import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import config from '@payload-config'
import { getPayload } from 'payload'

import { mediaDir, selfHosted, serverlessHost } from '@/lib/hosting'
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

/**
 * Streams a file from disk instead of buffering it, and answers a single `Range: bytes=` request with 206 —
 * Safari only plays and seeks video that way. Used on our own server and in local development.
 */
const fileResponse = async (request: Request, filePath: string, contentType: string): Promise<Response> => {
  const { size } = await fs.promises.stat(filePath)
  const headers: Record<string, string> = {
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Type': contentType,
  }

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range')?.trim() ?? '')
  if (range && (range[1] || range[2])) {
    // "500-" from byte 500, "0-99" the first hundred, "-500" the last 500
    const start = range[1] ? Number(range[1]) : Math.max(size - Number(range[2]), 0)
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
    if (start >= size || start > end) {
      return new Response(null, { headers: { ...headers, 'Content-Range': `bytes */${size}` }, status: 416 })
    }
    const stream = Readable.toWeb(fs.createReadStream(filePath, { end, start })) as ReadableStream
    return new Response(stream, {
      headers: { ...headers, 'Content-Length': String(end - start + 1), 'Content-Range': `bytes ${start}-${end}/${size}` },
      status: 206,
    })
  }

  const stream = Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream
  return new Response(stream, { headers: { ...headers, 'Content-Length': String(size) }, status: 200 })
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

  // 1. Try Netlify Blobs if configured (never on our own server: uploads live on its disk)
  if (!selfHosted) {
    try {
      const blobResponse = await readNetlifyMedia(safeFilename, media?.prefix ?? undefined)
      if (blobResponse) return blobResponse
    } catch {
      // Continue to next fallback
    }
  }

  // 2. On Netlify / Serverless production, redirect to public static asset CDN path
  if (serverlessHost) {
    const targetFile = safeFilename || media?.filename
    if (targetFile) {
      return Response.redirect(
        new URL(`/media/${encodeURIComponent(targetFile)}`, request.url),
        307,
      )
    }
  }

  // 3. Our own server and local development read from disk: CMS uploads first (MEDIA_DIR on the server),
  //    then the curated files that ship with the site in public/media
  const uploads = selfHosted ? mediaDir() : null
  const candidatePaths = [
    ...(uploads
      ? [
          path.join(uploads, safeFilename),
          ...(media?.filename && media.filename !== safeFilename ? [path.join(uploads, path.basename(media.filename))] : []),
        ]
      : []),
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
        return await fileResponse(request, filePath, getContentType(safeFilename, media?.mimeType))
      } catch {
        // Fall through on read error
      }
    }
  }

  return new Response('Media asset not found.', { status: 404 })
}

