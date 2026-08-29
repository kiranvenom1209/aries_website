'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { useMemo } from 'react'

import type { NewsStory } from '@/lib/fallbackNews'
import { previewNewsStory } from '@/lib/newsPreview'

import { MissionStory } from './MissionStory'

export function LiveNewsStory({ story }: { story: NewsStory }) {
  const { data } = useLivePreview({
    depth: 2,
    initialData: story,
    serverURL: typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin,
  })

  const liveStory = useMemo(() => previewNewsStory(data, story), [data, story])

  return <MissionStory story={liveStory} />
}
