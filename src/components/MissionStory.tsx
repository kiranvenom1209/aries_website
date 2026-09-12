'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import type { NewsMedia, NewsScoreboardRow, NewsStory } from '@/lib/fallbackNews'
import { formatNewsDate, readingTimeMinutes } from '@/lib/newsFormat'
import { ArrowIcon, CloseIcon, ExpandIcon } from './Icons'
import { photoKey } from './NewsList'

/** The slice of a neighbouring story the footer needs. */
export type StoryLink = Pick<NewsStory, 'publishedAt' | 'slug' | 'title'>

const SUBHEAD_MARKER = /^##\s+/

/**
 * A body entry is a heading when it is explicitly marked with `## `, or — as a
 * fallback for imported prose — when it is a short capitalised line with no
 * comma and no terminal punctuation. A line ending in ':' is never a heading.
 */
function storyLine(paragraph: string): { kind: 'heading' | 'paragraph'; text: string } {
  const text = paragraph.trim()
  if (SUBHEAD_MARKER.test(text)) return { kind: 'heading', text: text.replace(SUBHEAD_MARKER, '') }
  const looksLikeHeading =
    text.length <= 78 && /^[A-Z0-9]/.test(text) && !text.includes(',') && !/[.!?:]$/.test(text)
  return { kind: looksLikeHeading ? 'heading' : 'paragraph', text }
}

const isVideo = (asset: NewsMedia) => asset.mimeType?.startsWith('video/') ?? false

function MediaAsset({ asset, className, priority = false }: { asset: NewsMedia; className?: string; priority?: boolean }) {
  if (isVideo(asset)) {
    return (
      <video className={className} controls playsInline poster={asset.poster} preload="metadata">
        <source src={asset.url} type={asset.mimeType} />
        Your browser does not support this video format.
      </video>
    )
  }

  return (
    <Image
      alt={asset.alt ?? 'HSM Aries mission media'}
      fill
      preload={priority}
      sizes={priority ? '(max-width: 980px) 100vw, 64vw' : '(max-width: 760px) 100vw, 760px'}
      src={asset.url}
    />
  )
}

const formatPoints = (value: number) => {
  const magnitude = Number.isInteger(value) ? String(Math.abs(value)) : Math.abs(value).toFixed(2)
  return value < 0 ? `−${magnitude}` : magnitude
}

function Scoreboard({ rows }: { rows: NewsScoreboardRow[] }) {
  const lines = rows.filter((row) => row.label.toLowerCase() !== 'total')

  return (
    <section className="mission-story__scoreboard" aria-labelledby="mission-story-scoreboard-title">
      <header>
        <span id="mission-story-scoreboard-title">Scoreboard</span>
        <p>{lines.length} lines · points of maximum · rank where placed</p>
      </header>
      <table>
        <thead className="mission-story__sr-only">
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Share of maximum</th>
            <th scope="col">Points</th>
            <th scope="col">Rank</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isTotal = row.label.toLowerCase() === 'total'
            const isPenalty = row.points < 0
            const share = row.max > 0 ? Math.max(0, Math.min(100, (row.points / row.max) * 100)) : 0
            const tone = isTotal ? 'is-total' : isPenalty ? 'is-penalty' : row.rank ? 'is-ranked' : ''
            return (
              <tr className={tone || undefined} key={row.label}>
                <th scope="row">{row.label}</th>
                <td className="mission-story__scoreboard-track" aria-hidden="true">
                  {isPenalty ? null : <span style={{ width: `${share}%` }} />}
                </td>
                <td className="mission-story__scoreboard-points">
                  {formatPoints(row.points)}
                  {row.max > 0 ? <small> / {row.max}</small> : null}
                </td>
                <td className="mission-story__scoreboard-rank">{row.rank ?? ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

function MediaDeck({
  assets,
  onSelectAsset,
}: {
  assets: NewsMedia[]
  onSelectAsset: (index: number) => void
}) {
  if (assets.length === 0) return null
  const hasVideo = assets.some(isVideo)

  return (
    <section className="mission-story__media-deck" aria-labelledby="mission-story-deck-title">
      <header>
        <h2 id="mission-story-deck-title">Field photography</h2>
        <p>{String(assets.length).padStart(2, '0')} {hasVideo ? 'photos and video' : 'photographs'} · select to enlarge</p>
      </header>
      <div>
        {assets.map((asset, index) => (
          <figure key={`${asset.url}-${index}`}>
            <button
              type="button"
              className={`mission-story__deck-asset ${isVideo(asset) ? 'is-video' : ''}`}
              data-photo={photoKey(asset.url)}
              onClick={() => onSelectAsset(index)}
              aria-label={`Enlarge: ${asset.caption ?? asset.alt ?? 'field photo'}`}
            >
              <MediaAsset asset={asset} />
              <span className="mission-story__deck-expand" aria-hidden="true">
                <ExpandIcon />
              </span>
            </button>
            {(asset.caption ?? asset.credit) ? (
              <figcaption>
                <span>{asset.caption}</span>
                {asset.credit ? <small>Credit: {asset.credit}</small> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  )
}

function NeighbourCell({ direction, story }: { direction: 'previous' | 'next'; story?: StoryLink }) {
  const label = direction === 'previous' ? 'Previous dispatch' : 'Next dispatch'
  if (!story) {
    return (
      <div className={`mission-story__neighbour mission-story__neighbour--${direction} is-empty`}>
        <span>{label}</span>
        <strong>{direction === 'previous' ? 'This is the first dispatch on record.' : 'You are reading the latest dispatch.'}</strong>
      </div>
    )
  }
  return (
    <Link className={`mission-story__neighbour mission-story__neighbour--${direction}`} href={`/news/${story.slug}`}>
      <span>{label}</span>
      <strong>{story.title}</strong>
      <time dateTime={story.publishedAt}>{formatNewsDate(story.publishedAt)}</time>
    </Link>
  )
}

const CONTINUE_LINKS = [
  { eyebrow: 'Project 02', href: '/leap-2', label: 'Explore Leap-2' },
  { eyebrow: 'Project 01', href: '/leap-one', label: 'LEAP-One dossier' },
  { eyebrow: 'Photography', href: '/gallery', label: 'Field gallery' },
  { eyebrow: 'Contact', href: '/contact', label: 'Join or partner' },
]

export function MissionStory({
  next,
  previous,
  story,
}: {
  next?: StoryLink
  previous?: StoryLink
  story: NewsStory
}) {
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Legacy stories reuse the title as alt text; that is not a caption worth printing under the photo.
  const heroCaption = story.imageAlt === story.title ? undefined : story.imageAlt
  const heroAsset: NewsMedia = {
    alt: story.imageAlt,
    caption: heroCaption ?? story.title,
    url: story.image,
  }

  const deckAssets = story.mediaDeck ?? []
  const allModalAssets: NewsMedia[] = [heroAsset, ...deckAssets]
  const assetCount = allModalAssets.length
  const activeAsset = modalIndex !== null ? allModalAssets[modalIndex] : undefined

  const step = (direction: number) =>
    setModalIndex((current) => (current === null ? null : (current + direction + assetCount) % assetCount))

  // showModal() gives the lightbox the top layer, Escape handling, a focus trap and focus return for free.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (modalIndex !== null && !dialog.open) {
      dialog.showModal()
      dialog.querySelector<HTMLButtonElement>('.mission-story__modal-close')?.focus()
    } else if (modalIndex === null && dialog.open) {
      dialog.close()
    }
  }, [modalIndex])

  const lines = story.body.map(storyLine)
  const firstParagraphIndex = lines.findIndex((line) => line.kind === 'paragraph')
  const [day, month, year] = formatNewsDate(story.publishedAt).split(' ')
  const readingTime = readingTimeMinutes(story.body)
  const author = story.author ?? 'HSM Aries Editorial'

  return (
    <article className="mission-story">
      <header className="mission-story__masthead">
        <div className="mission-story__masthead-inner">
          <Link className="mission-story__back" href="/news">← Back to mission updates</Link>
          <div className="mission-story__meta">
            <span>{story.category ?? 'Mission update'}</span>
            <span>By {author}</span>
            <time dateTime={story.publishedAt}>{formatNewsDate(story.publishedAt)}</time>
          </div>
          <p className="mission-story__issue">Mission update // dispatch</p>
          <h1>{story.title}</h1>
          <p className="mission-story__deck">{story.excerpt}</p>
        </div>
      </header>

      <figure className="mission-story__figure">
        <button
          type="button"
          className="mission-story__image mission-story__image-btn"
          data-photo={photoKey(story.image)}
          onClick={() => setModalIndex(0)}
          aria-label="Enlarge the cover photo"
        >
          <MediaAsset asset={heroAsset} priority />
          <span className="mission-story__deck-expand" aria-hidden="true">
            <ExpandIcon />
          </span>
        </button>
        <figcaption>
          {heroCaption ? <span>{heroCaption}</span> : null}
          <span>{formatNewsDate(story.publishedAt)} · Select to enlarge</span>
        </figcaption>
      </figure>

      {story.featuredVideo ? (
        <section className="mission-story__feature-video" aria-label="Primary story video">
          <div>
            <span>Mission playback</span>
            <p>Primary visual record // {formatNewsDate(story.publishedAt)}</p>
          </div>
          <MediaAsset asset={story.featuredVideo} />
        </section>
      ) : null}

      {story.externalVideoUrl ? (
        <section className="mission-story__feature-video" aria-label="Embedded mission video">
          <div>
            <span>Mission playback</span>
            <p>Official HSM Aries video // {formatNewsDate(story.publishedAt)}</p>
          </div>
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src={story.externalVideoUrl}
            title={`${story.title} video`}
          />
        </section>
      ) : null}

      <div className="mission-story__article">
        <aside className="mission-story__rail" aria-label="Dispatch information">
          <span>Dispatch</span>
          <strong>{day} {month}<br />{year}</strong>
          <p>Filed by<br />{author}</p>
          <p>{readingTime} min read</p>
          <span className="mission-story__rail-line" />
          <p>HSM Aries<br />Schmalkalden, DE</p>
        </aside>
        <div className="mission-story__body">
          {lines.map((line, index) => {
            const key = `${story.slug}-${index}`
            if (line.kind === 'heading') return <h2 key={key}>{line.text}</h2>
            const isLede = index === firstParagraphIndex
            return (
              <div className="mission-story__block" key={key}>
                <p className={isLede ? 'mission-story__lede' : undefined}>{line.text}</p>
                {isLede && story.scoreboard && story.scoreboard.length > 0 ? <Scoreboard rows={story.scoreboard} /> : null}
              </div>
            )
          })}
        </div>
      </div>

      <MediaDeck
        assets={deckAssets}
        onSelectAsset={(idx) => setModalIndex(idx + 1)}
      />

      <footer className="mission-story__footer">
        <span>End of dispatch</span>
        <nav className="mission-story__neighbours" aria-label="Adjacent dispatches">
          <NeighbourCell direction="previous" story={previous} />
          <NeighbourCell direction="next" story={next} />
        </nav>
        <nav className="mission-story__continue" aria-label="Continue">
          <span>Continue</span>
          <ul>
            {CONTINUE_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <small>{item.eyebrow}</small>
                  <strong>{item.label} <ArrowIcon /></strong>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="button button--outline" href="/news">← All mission updates</Link>
      </footer>

      <dialog
        aria-labelledby="mission-story-modal-caption"
        className="gallery-modal mission-story__modal"
        onClick={(event) => {
          if (event.target === event.currentTarget) setModalIndex(null)
        }}
        onClose={() => setModalIndex(null)}
        onKeyDown={(event) => {
          if (assetCount < 2) return
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            step(-1)
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            step(1)
          }
        }}
        ref={dialogRef}
      >
        {modalIndex !== null && activeAsset ? (
          <>
            <div className="mission-story__modal-controls">
              <p className="mission-story__modal-counter" aria-live="polite">
                {assetCount > 1 ? (
                  <span>Photo {String(modalIndex + 1).padStart(2, '0')} of {String(assetCount).padStart(2, '0')}</span>
                ) : null}
                <small>{modalIndex === 0 ? 'Cover photo' : 'Field photo'}</small>
              </p>

              <div className="mission-story__modal-nav">
                {assetCount > 1 ? (
                  <>
                    <button
                      aria-label="Previous photo"
                      className="mission-story__modal-arrow mission-story__modal-arrow--prev"
                      onClick={() => step(-1)}
                      type="button"
                    >
                      <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <button
                      aria-label="Next photo"
                      className="mission-story__modal-arrow mission-story__modal-arrow--next"
                      onClick={() => step(1)}
                      type="button"
                    >
                      <ArrowIcon />
                    </button>
                  </>
                ) : null}
                <button
                  aria-label="Close"
                  className="mission-story__modal-close"
                  onClick={() => setModalIndex(null)}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="gallery-modal__image mission-story__modal-asset">
              {isVideo(activeAsset) ? (
                <video controls autoPlay playsInline className="mission-story__modal-video" poster={activeAsset.poster}>
                  <source src={activeAsset.url} type={activeAsset.mimeType} />
                  Your browser does not support video playback.
                </video>
              ) : (
                <Image
                  alt={activeAsset.alt ?? 'HSM Aries expanded media'}
                  fill
                  sizes="95vw"
                  src={activeAsset.url}
                />
              )}
            </div>

            <div className="mission-story__modal-meta">
              <p id="mission-story-modal-caption">{activeAsset.caption ?? activeAsset.alt ?? story.title}</p>
              {activeAsset.credit ? <small>Credit: {activeAsset.credit}</small> : null}
            </div>
          </>
        ) : null}
      </dialog>
    </article>
  )
}
