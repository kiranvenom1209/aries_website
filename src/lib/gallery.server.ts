import 'server-only'

import { authoritativeGalleryImages, type GalleryGroup, type GalleryImage } from './gallery'

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

/**
 * Maps a CMS gallery document title to a chapter. Anything that does not name
 * one of the known chapters lands in the archive.
 */
const groupFromTitle = (title: string): GalleryGroup => {
  const text = title.toLowerCase()
  if (text.includes('erc') || text.includes('krak')) return 'erc-2026'
  if (text.includes('space night')) return 'space-night-2026'
  if (text.includes('trial') || text.includes('field')) return 'field-trials'
  if (text.includes('workshop') || text.includes('build')) return 'workshop'
  if (text.includes('outreach') || text.includes('member') || text.includes('visit')) return 'outreach'
  return 'archive'
}

const galleryMedia = (value: unknown, fallbackAlt: string, group: GalleryGroup): GalleryImage | null => {
  if (!isRecord(value)) return null
  const mimeType = typeof value.mimeType === 'string' ? value.mimeType : ''
  const src = typeof value.url === 'string' ? value.url : ''
  if (!src || (mimeType && !mimeType.startsWith('image/'))) return null

  return {
    alt: typeof value.alt === 'string' && value.alt.trim() ? value.alt : fallbackAlt,
    group,
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
      const title = typeof document.title === 'string' ? document.title : ''
      const fallbackAlt = title || 'HSM Aries field record'
      const group = groupFromTitle(title)
      const items = Array.isArray(document.items) ? document.items : []
      for (const item of items) {
        const media = galleryMedia(item, fallbackAlt, group)
        if (!media) continue
        const key = mediaKey(media.src)
        // A CMS copy of a curated photo keeps the chapter it was filed under.
        const curated = merged.get(key)
        merged.set(key, curated?.group ? { ...media, group: curated.group } : media)
      }
    }
  } catch {
    // The complete public archive remains available before the CMS is seeded.
  }

  return [...merged.values()]
}
