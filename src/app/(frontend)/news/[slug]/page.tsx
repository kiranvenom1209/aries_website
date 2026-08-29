import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LiveNewsStory } from '@/components/LiveNewsStory'
import { MissionStory } from '@/components/MissionStory'
import { PageShell } from '@/components/PageShell'
import { getNewsBySlug } from '@/lib/news'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string | string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getNewsBySlug(slug)
  return story
    ? { description: story.excerpt, title: story.title }
    : { title: 'Mission update' }
}

export default async function NewsStoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const story = await getNewsBySlug(slug)
  if (!story) notFound()

  const preview = (await searchParams).preview === '1'

  return (
    <PageShell>
      {preview ? <LiveNewsStory story={story} /> : <MissionStory story={story} />}
    </PageShell>
  )
}
