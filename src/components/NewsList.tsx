import Image from 'next/image'
import Link from 'next/link'

import type { NewsStory } from '@/lib/fallbackNews'
import { formatNewsDate } from '@/lib/newsFormat'

import { ArrowIcon } from './Icons'

type CardVariant = 'archive' | 'lead' | 'priority'

export const categorySlug = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Filename stem of a media URL, exposed as `data-photo` so the stylesheet can frame a specific photograph. */
export const photoKey = (url: string) => url.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? ''

function StoryMeta({ showByline = true, story }: { showByline?: boolean; story: NewsStory }) {
  return (
    <div className={`news-card__meta${showByline ? '' : ' news-card__meta--compact'}`}>
      <span>{story.category ?? 'Mission update'}</span>
      {showByline ? <span className="news-card__byline">By {story.author ?? 'HSM Aries Editorial'}</span> : null}
      <time dateTime={story.publishedAt}>{formatNewsDate(story.publishedAt)}</time>
    </div>
  )
}

const formatPoints = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2))

/** Three-cell mono strip for a story that carries a scoreboard: total, then the ranked lines. */
function ScoreStrip({ story }: { story: NewsStory }) {
  const rows = story.scoreboard ?? []
  const total = rows.find((row) => row.label.toLowerCase() === 'total')
  const ranked = rows.filter((row) => row !== total && row.rank).slice(0, 2)
  if (!total) return null

  return (
    <dl className="news-card__scores" aria-label="Result summary">
      <div>
        <dt>Result</dt>
        <dd>{total.rank ?? `${formatPoints(total.points)} pts`}</dd>
        {total.rank ? <dd className="news-card__scores-sub">{formatPoints(total.points)} / {total.max} pts</dd> : null}
      </div>
      {ranked.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.rank}</dd>
          <dd className="news-card__scores-sub">{formatPoints(row.points)} / {row.max}</dd>
        </div>
      ))}
    </dl>
  )
}

function StoryCard({ story, variant = 'archive' }: { story: NewsStory; variant?: CardVariant }) {
  const Heading = variant === 'archive' ? 'h3' : 'h2'
  const image = (
    <Link className="news-card__image" data-photo={photoKey(story.image)} href={`/news/${story.slug}`}>
      <Image
        alt={story.imageAlt}
        fill
        // The lead photo is the LCP candidate: preload emits the high-priority hint. Priority cards load eagerly.
        loading={variant === 'priority' ? 'eager' : undefined}
        preload={variant === 'lead'}
        sizes={variant === 'lead' ? '(max-width: 980px) 100vw, 65vw' : '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw'}
        src={story.image}
      />
    </Link>
  )

  const copy = (
    <>
      {variant === 'lead' && <span className="news-card__eyebrow">Latest dispatch</span>}
      <StoryMeta showByline={variant === 'lead'} story={story} />
      <Heading>
        <Link href={`/news/${story.slug}`}>{story.title}</Link>
      </Heading>
      <p>{story.excerpt}</p>
      {variant === 'lead' ? <ScoreStrip story={story} /> : null}
    </>
  )

  return (
    <article className={`news-card news-card--${variant}`}>
      {variant === 'lead' ? copy : image}
      {variant === 'lead' && (
        <Link className="news-card__read" href={`/news/${story.slug}`}>
          Read the dispatch <ArrowIcon />
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

function CategoryFilter({
  active,
  stories,
}: {
  active?: string
  stories: NewsStory[]
}) {
  const counts = new Map<string, { count: number; label: string }>()
  for (const story of stories) {
    if (!story.category) continue
    const slug = categorySlug(story.category)
    const entry = counts.get(slug) ?? { count: 0, label: story.category }
    entry.count += 1
    counts.set(slug, entry)
  }
  const categories = [...counts.entries()].sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label))
  if (categories.length < 2) return null

  return (
    <nav className="news-filter" aria-label="Filter dispatches by category">
      <Link aria-current={active ? undefined : 'page'} href="/news#archive">
        All <b>{stories.length}</b>
      </Link>
      {categories.map(([slug, entry]) => (
        <Link aria-current={active === slug ? 'page' : undefined} href={`/news?category=${slug}#archive`} key={slug}>
          {entry.label} <b>{entry.count}</b>
        </Link>
      ))}
    </nav>
  )
}

const yearOf = (story: NewsStory) => new Date(story.publishedAt).getUTCFullYear()

export function NewsGrid({ category, stories }: { category?: string; stories: NewsStory[] }) {
  const [leadStory, ...remainingStories] = stories
  const priorityStories = remainingStories.slice(0, 2)
  const archiveStories = remainingStories.slice(2)
  const activeCategory = category && archiveStories.some((story) => story.category && categorySlug(story.category) === category) ? category : undefined
  const visibleStories = activeCategory
    ? archiveStories.filter((story) => story.category && categorySlug(story.category) === activeCategory)
    : archiveStories
  const activeLabel = activeCategory ? visibleStories[0]?.category : undefined

  if (!leadStory) {
    return <p className="news-index__empty">No dispatches have been published yet.</p>
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
        <section className="news-grid__archive" id="archive" aria-labelledby="mission-archive-title">
          <header>
            <span>Archive</span>
            <h2 id="mission-archive-title">Every dispatch since the first sketch.</h2>
            <p>
              {activeCategory
                ? `${visibleStories.length} of ${archiveStories.length} earlier dispatches · ${activeLabel}.`
                : `${String(archiveStories.length).padStart(2, '0')} earlier dispatches from the HSM Aries programme.`}
            </p>
          </header>
          <CategoryFilter active={activeCategory} stories={archiveStories} />
          <div className="news-grid__archive-list">
            {visibleStories.map((story, index) => {
              const year = yearOf(story)
              const previous = index > 0 ? yearOf(visibleStories[index - 1]) : undefined
              return (
                <StoryCardWithYear key={story.slug} showYear={previous !== undefined && previous !== year} story={story} year={year} />
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function StoryCardWithYear({ showYear, story, year }: { showYear: boolean; story: NewsStory; year: number }) {
  return (
    <>
      {showYear ? (
        <div className="news-grid__year" role="presentation">
          <span>{year}</span>
        </div>
      ) : null}
      <StoryCard story={story} />
    </>
  )
}
