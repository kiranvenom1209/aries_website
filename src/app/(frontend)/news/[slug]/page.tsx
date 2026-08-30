import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LiveNewsStory } from '@/components/LiveNewsStory'
import { MissionStory } from '@/components/MissionStory'
import { PageShell } from '@/components/PageShell'
import { getNewsBySlug } from '@/lib/news'
import {
  absoluteUrl,
  metadataDescription,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string | string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getNewsBySlug(slug)
  const description = story ? metadataDescription(story.excerpt) : undefined
  return story
    ? {
        alternates: { canonical: `/news/${story.slug}` },
        description,
        openGraph: {
          authors: [story.author ?? 'HSM Aries Editorial'],
          description,
          images: [{ alt: story.imageAlt, url: story.image }],
          locale: 'en_GB',
          publishedTime: story.publishedAt,
          section: story.category ?? 'Mission update',
          siteName: SITE_NAME,
          title: story.title,
          type: 'article',
          url: `/news/${story.slug}`,
        },
        title: story.title,
        twitter: {
          card: 'summary_large_image',
          description,
          images: [story.image],
          title: story.title,
        },
      }
    : { robots: { follow: false, index: false }, title: 'Mission update' }
}

export default async function NewsStoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const story = await getNewsBySlug(slug)
  if (!story) notFound()

  const preview = (await searchParams).preview === '1'
  const articleUrl = `${SITE_URL}/news/${story.slug}`
  const description = metadataDescription(story.excerpt)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    author: {
      '@type': 'Person',
      name: story.author ?? 'HSM Aries Editorial',
    },
    datePublished: story.publishedAt,
    description,
    headline: story.title,
    image: [absoluteUrl(story.image)],
    inLanguage: 'en',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@id': articleUrl,
      '@type': 'WebPage',
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
      '@type': 'Organization',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/media/cropped-falcon-1.png`,
      },
      name: SITE_NAME,
    },
    ...(story.externalVideoUrl
      ? {
          video: {
            '@type': 'VideoObject',
            embedUrl: story.externalVideoUrl,
            name: story.title,
            thumbnailUrl: absoluteUrl(story.image),
            uploadDate: story.publishedAt,
          },
        }
      : {}),
    url: articleUrl,
  }

  return (
    <PageShell>
      {!preview ? (
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
          type="application/ld+json"
        />
      ) : null}
      {preview ? <LiveNewsStory story={story} /> : <MissionStory story={story} />}
    </PageShell>
  )
}
