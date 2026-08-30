import 'server-only'

import { authoritativeGalleryImages, type GalleryImage } from './gallery'

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const mediaKey = (src: string) => {
  try {
    return decodeURIComponent(
      new URL(src, 'https://hsmaries.space').pathname.split('/').pop() ?? src,
    ).toLowerCase()
  } catch {
    return src.toLowerCase()
  }
}

const galleryMedia = (value: unknown, fallbackAlt: string): GalleryImage | null => {
  if (!isRecord(value)) return null
  const mimeType = typeof value.mimeType === 'string' ? value.mimeType : ''
  const src = typeof value.url === 'string' ? value.url : ''
  if (!src || (mimeType && !mimeType.startsWith('image/'))) return null

  return {
    alt: typeof value.alt === 'string' && value.alt.trim() ? value.alt : fallbackAlt,
    src,
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const merged = new Map(authoritativeGalleryImages.map((image) => [mediaKey(image.src), image]))

  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config: await configModule.default })
    const result = await payload.find({
      collection: 'gallery' as never,
      depth: 1,
      limit: 100,
      overrideAccess: false,
      sort: 'sortOrder',
    })

    for (const document of result.docs as unknown[]) {
      if (!isRecord(document)) continue
      const fallbackAlt =
        typeof document.title === 'string' ? document.title : 'HSM Aries field record'
      const items = Array.isArray(document.items) ? document.items : []
      for (const item of items) {
        const media = galleryMedia(item, fallbackAlt)
        if (media) merged.set(mediaKey(media.src), media)
      }
    }
  } catch {
    // The complete public archive remains available before the CMS is seeded.
  }

  return [...merged.values()]
}
