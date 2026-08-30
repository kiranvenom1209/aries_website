import type { Metadata } from 'next'

import { NewsGrid } from '@/components/NewsList'
import { PageShell } from '@/components/PageShell'
import { getNews } from '@/lib/news'
import { absoluteUrl, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'Read the complete HSM Aries archive of mission updates, engineering milestones, competition results, field reports and team stories.',
  image: '/media/hsm-png.png',
  path: '/news',
  title: 'News & Mission Updates',
})

export default async function NewsPage() {
  const stories = await getNews()
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
    name: 'HSM Aries News & Mission Updates',
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
          <span className="hero__eyebrow">HSM ARIES // MISSION LOG</span>
          <h1>Mission<br /><em>updates.</em></h1>
          <p>Engineering milestones, field reports and the latest from HSM Aries.</p>
        </div>
        <div className="editorial-hero__archive" aria-label={`${stories.length} mission dispatches published`}>
          <span>Mission archive</span>
          <strong>{String(stories.length).padStart(2, '0')}</strong>
          <p>Dispatches charting the road from first sketch to field test.</p>
        </div>
      </section>
      <section className="news-index">
        <NewsGrid stories={stories} />
      </section>
    </PageShell>
  )
}
