import type { Metadata } from 'next'

import { NewsGrid } from '@/components/NewsList'
import { PageShell } from '@/components/PageShell'
import { getNews } from '@/lib/news'
import { absoluteUrl, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'Mission updates from HSM Aries: ERC 2026 finals and qualification results, LEAP-One field reports, engineering milestones and the Leap-2 build in Schmalkalden.',
  image: '/media/og/news.jpg',
  imageAlt: 'LEAP-One climbs the rocky slope of the Mars yard at the ERC 2026 finals',
  path: '/news',
  title: 'Mission updates',
})

type PageProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const stories = await getNews()
  const { category } = await searchParams
  const activeCategory = typeof category === 'string' ? category : undefined
  const newsListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: stories.map((story, index) => ({
      '@type': 'ListItem',
      item: {
        '@type': 'NewsArticle',
        datePublished: story.publishedAt,
        headline: story.title,
        image: absoluteUrl(story.image),
        url: absoluteUrl(`/news/${story.slug}`),
      },
      position: index + 1,
    })),
    name: 'HSM Aries mission updates',
    numberOfItems: stories.length,
  }

  return (
    <PageShell>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(newsListJsonLd) }}
        type="application/ld+json"
      />
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <span className="hero__eyebrow">HSM ARIES // MISSION UPDATES</span>
          <h1>Mission<br /><em>updates.</em></h1>
          <p>Engineering milestones, field reports and the latest from HSM Aries.</p>
        </div>
        <div className="editorial-hero__archive" aria-label={`${stories.length} dispatches published`}>
          <span>Dispatches</span>
          <strong>{String(stories.length).padStart(2, '0')}</strong>
          <p>Dispatches charting the road from first sketch to the ERC 2026 finals — and on to Leap-2.</p>
        </div>
      </section>
      <section className="news-index">
        <NewsGrid category={activeCategory} stories={stories} />
      </section>
    </PageShell>
  )
}
