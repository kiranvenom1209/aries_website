import type { MetadataRoute } from 'next'

import { getGalleryImages } from '@/lib/gallery.server'
import { getNews } from '@/lib/news'
import { absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, galleryImages] = await Promise.all([getNews(100), getGalleryImages()])
  const lastPublished = stories[0]?.publishedAt ?? '2026-08-30T00:00:00.000Z'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: lastPublished, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/about'), lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/leap-one'), lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/team'), lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/news'), lastModified: lastPublished, changeFrequency: 'weekly', priority: 0.9 },
    {
      url: absoluteUrl('/gallery'),
      lastModified: '2026-08-30',
      changeFrequency: 'monthly',
      priority: 0.8,
      images: galleryImages.map((image) => absoluteUrl(image.src)),
    },
    { url: absoluteUrl('/join'), lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/partner'), lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/contact'), lastModified: '2026-08-30', changeFrequency: 'monthly', priority: 0.6 },
  ]

  const newsRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: absoluteUrl(`/news/${story.slug}`),
    lastModified: story.publishedAt,
    changeFrequency: 'yearly',
    priority: 0.7,
    images: [absoluteUrl(story.image)],
  }))

  return [...staticRoutes, ...newsRoutes]
}
