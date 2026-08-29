import type { Metadata } from 'next'

import { NewsGrid } from '@/components/NewsList'
import { PageShell } from '@/components/PageShell'
import { getNews } from '@/lib/news'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description: 'Mission updates, engineering milestones and field reports from HSM Aries.',
  title: 'News',
}

export default async function NewsPage() {
  const stories = await getNews()

  return (
    <PageShell>
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
