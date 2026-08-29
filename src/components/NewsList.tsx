import Image from 'next/image'
import Link from 'next/link'

import type { NewsStory } from '@/lib/fallbackNews'
import { formatNewsDate } from '@/lib/newsFormat'

import { ArrowIcon } from './Icons'

function StoryMeta({ story }: { story: NewsStory }) {
  return (
    <div className="news-card__meta">
      <span>{story.category ?? 'MISSION UPDATE'}</span>
      <span className="news-card__byline">By {story.author ?? 'HSM Aries Editorial'}</span>
      <time dateTime={story.publishedAt}>{formatNewsDate(story.publishedAt)}</time>
    </div>
  )
}

function StoryCard({ story, variant = 'archive' }: { story: NewsStory; variant?: 'archive' | 'lead' | 'priority' }) {
  const image = (
    <Link className="news-card__image" href={`/news/${story.slug}`}>
      <Image
        alt={story.imageAlt}
        fill
        sizes={variant === 'lead' ? '(max-width: 980px) 100vw, 65vw' : '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw'}
        src={story.image}
      />
    </Link>
  )

  const copy = (
    <>
      {variant === 'lead' && <span className="news-card__eyebrow">Featured dispatch // latest</span>}
      <StoryMeta story={story} />
      <h2>
        <Link href={`/news/${story.slug}`}>{story.title}</Link>
      </h2>
      <p>{story.excerpt}</p>
    </>
  )

  return (
    <article className={`news-card news-card--${variant}`}>
      {variant === 'lead' ? copy : image}
      {variant === 'lead' && (
        <Link className="news-card__read" href={`/news/${story.slug}`}>
          Read full dispatch <ArrowIcon />
        </Link>
      )}
      {variant === 'lead' ? image : copy}
    </article>
  )
}

export function NewsRows({ stories }: { stories: NewsStory[] }) {
  return (
    <div className="news-rows">
      {stories.map((story, index) => (
        <Link href={`/news/${story.slug}`} key={story.slug}>
          <span className="news-rows__index">{String(index + 1).padStart(2, '0')}</span>
          <strong>{story.title}</strong>
          <time dateTime={story.publishedAt}>{formatNewsDate(story.publishedAt)}</time>
          <ArrowIcon />
        </Link>
      ))}
    </div>
  )
}

export function NewsGrid({ stories }: { stories: NewsStory[] }) {
  const [leadStory, ...remainingStories] = stories
  const priorityStories = remainingStories.slice(0, 2)
  const archiveStories = remainingStories.slice(2)

  if (!leadStory) {
    return <p className="news-index__empty">No mission dispatches have been logged yet.</p>
  }

  return (
    <div className="news-grid">
      <div className="news-grid__lead">
        <StoryCard story={leadStory} variant="lead" />
        {priorityStories.length > 0 && (
          <div className="news-grid__priority">
            {priorityStories.map((story) => <StoryCard key={story.slug} story={story} variant="priority" />)}
          </div>
        )}
      </div>

      {archiveStories.length > 0 && (
        <section className="news-grid__archive" aria-labelledby="mission-archive-title">
          <header>
            <span>Mission archive</span>
            <h2 id="mission-archive-title">Every field note. One record.</h2>
            <p>{String(archiveStories.length).padStart(2, '0')} previous dispatches from the HSM Aries programme.</p>
          </header>
          <div className="news-grid__archive-list">
            {archiveStories.map((story) => <StoryCard key={story.slug} story={story} />)}
          </div>
        </section>
      )}
    </div>
  )
}
