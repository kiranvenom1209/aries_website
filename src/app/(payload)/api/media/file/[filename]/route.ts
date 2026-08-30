import config from '@payload-config'
import { getPayload } from 'payload'

import { readNetlifyMedia } from '@/storage/netlifyBlobs'

export const dynamic = 'force-dynamic'

type MediaDocument = {
  filename?: string | null
  prefix?: string | null
}

export async function GET(
  request: Request,
  context: RouteContext<'/api/media/file/[filename]'>,
) {
  const { filename } = await context.params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { isPublic: { equals: true } },
        {
          or: [
            { filename: { equals: filename } },
            { 'sizes.thumbnail.filename': { equals: filename } },
            { 'sizes.card.filename': { equals: filename } },
            { 'sizes.hero.filename': { equals: filename } },
          ],
        },
      ],
    },
  })
  const media = result.docs[0] as MediaDocument | undefined

  if (!media?.filename) {
    return new Response('Media asset not found.', { status: 404 })
  }

  try {
    const blobResponse = await readNetlifyMedia(filename, media.prefix ?? undefined)
    if (blobResponse) return blobResponse
  } catch {
    // Seeded assets also ship in /public/media, providing a durable fallback.
  }

  const fallbackURL = new URL(
    `/media/${media.filename.split('/').map(encodeURIComponent).join('/')}`,
    request.url,
  )

  return Response.redirect(fallbackURL, 307)
}
