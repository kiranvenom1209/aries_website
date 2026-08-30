import type { NewsMedia, NewsStory } from './fallbackNews'

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const stringValue = (value: unknown) => (typeof value === 'string' ? value : undefined)

export const extractNewsText = (value: unknown): string[] => {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  if (Array.isArray(value)) return value.flatMap(extractNewsText)
  if (!isRecord(value)) return []

  const ownText = stringValue(value.text)
  if (ownText) return [ownText]

  return [value.children, value.root, value.content].flatMap(extractNewsText)
}

export const mediaFromValue = (value: unknown): NewsMedia | undefined => {
  if (typeof value === 'string') {
    return value.startsWith('/') ? { url: value } : undefined
  }
  if (!isRecord(value)) return undefined

  const url = stringValue(value.url) ?? stringValue(value.src)
  if (!url) return undefined

  return {
    alt: stringValue(value.alt),
    caption: stringValue(value.caption),
    credit: stringValue(value.credit),
    mimeType: stringValue(value.mimeType),
    url,
  }
}

const deckFromValue = (value: unknown): NewsMedia[] => {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!isRecord(item)) return []
    const asset = mediaFromValue(item.asset)
    if (!asset) return []

    return [{ ...asset, caption: stringValue(item.caption) ?? asset.caption }]
  })
}

/**
 * Converts Payload's document shape into the small, browser-safe public-story
 * shape. It is also used by the live-preview iframe, where document data has
 * not necessarily been saved or published yet.
 */
export const previewNewsStory = (value: unknown, fallback: NewsStory): NewsStory => {
  if (!isRecord(value)) return fallback

  const imageValue = value.heroImage ?? value.featuredImage ?? value.image
  const image = mediaFromValue(imageValue)
  const paragraphs = extractNewsText(value.content ?? value.body)
  const title = stringValue(value.title) ?? fallback.title

  return {
    ...fallback,
    author:
      stringValue(value.author) === 'HSM Aries Editorial' && fallback.author
        ? fallback.author
        : stringValue(value.author) ?? fallback.author ?? 'HSM Aries Editorial',
    body: paragraphs.length > 0 ? paragraphs : fallback.body,
    category: stringValue(value.category) ?? fallback.category,
    externalVideoUrl: stringValue(value.externalVideoUrl) ?? fallback.externalVideoUrl,
    excerpt:
      stringValue(value.excerpt) ?? stringValue(value.summary) ?? paragraphs[0] ?? fallback.excerpt,
    featuredVideo: mediaFromValue(value.featuredVideo) ?? fallback.featuredVideo,
    image: image?.url ?? fallback.image,
    imageAlt: image?.alt ?? fallback.imageAlt ?? `${title} — HSM Aries mission update`,
    mediaDeck: deckFromValue(value.mediaDeck).length > 0 ? deckFromValue(value.mediaDeck) : fallback.mediaDeck,
    publishedAt: stringValue(value.publishedAt) ?? stringValue(value.createdAt) ?? fallback.publishedAt,
    slug: stringValue(value.slug) ?? fallback.slug,
    title,
  }
}
