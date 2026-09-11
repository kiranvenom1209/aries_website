import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LiveNewsStory } from '@/components/LiveNewsStory'
import { MissionStory } from '@/components/MissionStory'
import { PageShell } from '@/components/PageShell'
import type { NewsStory } from '@/lib/fallbackNews'
import { getNews, getNewsBySlug } from '@/lib/news'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  metadataDescription,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
  socialImage,
  socialImageDimensions,
} from '@/lib/seo'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string | string[] }>
}

/** A hand-written `seoDescription` is preferred over the excerpt; both are sanitised and clipped to 160 characters. */
const storyDescription = (story: NewsStory) =>
  metadataDescription(story.seoDescription?.trim() || story.excerpt)

/** The story photo as a share image, with its pixel size when the file can be read. */
const storyShareImage = async (story: NewsStory) =>
  socialImage({
    alt: story.imageAlt,
    url: story.image,
    ...(await socialImageDimensions(story.image)),
  })

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getNewsBySlug(slug)
  // Matches the catch-all not-found route so the same 404 page carries one tab title however it is reached.
  if (!story) return { robots: { follow: false, index: false }, title: 'Off the map' }

  const description = storyDescription(story)
  const shareImage = await storyShareImage(story)
  return {
    alternates: { canonical: `/news/${story.slug}` },
    description,
    openGraph: {
      authors: [story.author ?? SITE_NAME],
      description,
      images: [shareImage],
      locale: 'en_GB',
      modifiedTime: story.publishedAt,
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
      images: [shareImage],
      title: story.title,
    },
  }
}

export default async function NewsStoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const story = await getNewsBySlug(slug)
  if (!story) notFound()

  const preview = (await searchParams).preview === '1'
  const articleUrl = `${SITE_URL}/news/${story.slug}`
  const description = storyDescription(story)
  const shareImage = await storyShareImage(story)

  // Neighbouring dispatches: the list is newest-first, so "next" is newer and "previous" is older.
  const stories = await getNews()
  const position = stories.findIndex((item) => item.slug === story.slug)
  const toLink = (item?: NewsStory) =>
    item ? { publishedAt: item.publishedAt, slug: item.slug, title: item.title } : undefined
  const next = position > 0 ? toLink(stories[position - 1]) : undefined
  const previous = position >= 0 ? toLink(stories[position + 1]) : undefined
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    author: story.author
      ? { '@type': 'Person', name: story.author }
      : { '@id': `${SITE_URL}/#organization`, '@type': 'Organization', name: SITE_NAME },
    dateModified: story.publishedAt,
    datePublished: story.publishedAt,
    description,
    headline: story.title,
    image: [
      {
        '@type': 'ImageObject',
        caption: story.imageAlt,
        ...(shareImage.height ? { height: shareImage.height } : {}),
        url: absoluteUrl(story.image),
        ...(shareImage.width ? { width: shareImage.width } : {}),
      },
    ],
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
        height: 512,
        url: `${SITE_URL}/media/cropped-falcon-1.png`,
        width: 512,
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
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Mission updates', path: '/news' },
    { name: story.title },
  ])

  return (
    <PageShell>
      {!preview ? (
        <>
          <script
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
            type="application/ld+json"
          />
          <script
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
            type="application/ld+json"
          />
        </>
      ) : null}
      {preview ? (
        <LiveNewsStory next={next} previous={previous} story={story} />
      ) : (
        <MissionStory next={next} previous={previous} story={story} />
      )}
    </PageShell>
  )
}
