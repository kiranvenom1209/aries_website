import type { NewsStory } from './fallbackNews'
import { fallbackNews } from './fallbackNews'
import { formatNewsDate } from './newsFormat'
import { previewNewsStory } from './newsPreview'

export { formatNewsDate }

const normalizeStory = (doc: unknown, index: number): NewsStory | null => {
  if (typeof doc !== 'object' || doc === null) return null

  const fallback = fallbackNews[index % fallbackNews.length]
  const story = previewNewsStory(doc, fallback)
  return story.title && story.slug ? story : null
}

export async function getNews(limit = fallbackNews.length): Promise<NewsStory[]> {
  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config: await configModule.default })
    const result = await payload.find({
      collection: 'news' as never,
      depth: 1,
      limit: Math.max(limit, fallbackNews.length),
      overrideAccess: false,
      sort: '-publishedAt',
    })
    const stories = result.docs
      .map((doc, index) => normalizeStory(doc, index))
      .filter((story): story is NewsStory => story !== null)

    const merged = new Map(fallbackNews.map((story) => [story.slug, story]))
    for (const story of stories) merged.set(story.slug, story)

    return [...merged.values()]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
  } catch {
    return fallbackNews.slice(0, limit)
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsStory | null> {
  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config: await configModule.default })
    const result = await payload.find({
      collection: 'news' as never,
      depth: 1,
      limit: 1,
      overrideAccess: false,
      where: { slug: { equals: slug } },
    })
    const story = normalizeStory(result.docs[0], 0)
    if (story) return story
  } catch {
    // The public experience remains available before the CMS is seeded.
  }

  return fallbackNews.find((story) => story.slug === slug) ?? null
}
