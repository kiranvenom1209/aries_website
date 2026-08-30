'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { NewsMedia, NewsStory } from '@/lib/fallbackNews'
import { formatNewsDate } from '@/lib/newsFormat'
import { ArrowIcon, CloseIcon, ExpandIcon } from './Icons'

function isStorySubhead(paragraph: string) {
  const text = paragraph.trim()
  return text.length <= 78 && !/[.!?]$/.test(text)
}

function MediaAsset({ asset, className }: { asset: NewsMedia; className?: string }) {
  if (asset.mimeType?.startsWith('video/')) {
    return (
      <video className={className} controls playsInline preload="metadata">
        <source src={asset.url} type={asset.mimeType} />
        Your browser does not support this video format.
      </video>
    )
  }

  return (
    <Image
      alt={asset.alt ?? 'HSM Aries mission media'}
      fill
      sizes="(max-width: 760px) 100vw, 760px"
      src={asset.url}
    />
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

  return (
    <section className="mission-story__media-deck" aria-label="Supporting mission media">
      <header>
        <span>Evidence locker</span>
        <p>{String(assets.length).padStart(2, '0')} supporting field assets · click to inspect</p>
      </header>
      <div>
        {assets.map((asset, index) => (
          <figure key={`${asset.url}-${index}`}>
            <button
              type="button"
              className={`mission-story__deck-asset ${asset.mimeType?.startsWith('video/') ? 'is-video' : ''}`}
              onClick={() => onSelectAsset(index)}
              aria-label={`Open media asset: ${asset.caption ?? asset.alt ?? 'Field asset'}`}
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

export function MissionStory({ story }: { story: NewsStory }) {
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const heroAsset: NewsMedia = {
    alt: story.imageAlt,
    caption: 'Primary field masthead record // HSM Aries',
    url: story.image,
  }

  const deckAssets = story.mediaDeck ?? []
  const allModalAssets: NewsMedia[] = [heroAsset, ...deckAssets]

  useEffect(() => {
    if (modalIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalIndex(null)
      } else if (e.key === 'ArrowLeft') {
        setModalIndex((prev) => (prev !== null ? (prev - 1 + allModalAssets.length) % allModalAssets.length : null))
      } else if (e.key === 'ArrowRight') {
        setModalIndex((prev) => (prev !== null ? (prev + 1) % allModalAssets.length : null))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [modalIndex, allModalAssets.length])

  const modalMarkup =
    mounted && modalIndex !== null && allModalAssets[modalIndex] ? (
      <div
        aria-label="Expanded mission media"
        aria-modal="true"
        className="gallery-modal mission-story__modal"
        role="dialog"
        onClick={() => setModalIndex(null)}
      >
        <div className="mission-story__modal-controls" onClick={(e) => e.stopPropagation()}>
          <div className="mission-story__modal-counter">
            <span>ASSET {String(modalIndex + 1).padStart(2, '0')} // {String(allModalAssets.length).padStart(2, '0')}</span>
            <small>{modalIndex === 0 ? 'PRIMARY MASTHEAD' : 'EVIDENCE LOCKER'}</small>
          </div>

          <div className="mission-story__modal-nav">
            {allModalAssets.length > 1 ? (
              <>
                <button
                  aria-label="Previous image"
                  className="mission-story__modal-arrow mission-story__modal-arrow--prev"
                  onClick={() => setModalIndex((prev) => (prev !== null ? (prev - 1 + allModalAssets.length) % allModalAssets.length : null))}
                  type="button"
                >
                  <ArrowIcon style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button
                  aria-label="Next image"
                  className="mission-story__modal-arrow mission-story__modal-arrow--next"
                  onClick={() => setModalIndex((prev) => (prev !== null ? (prev + 1) % allModalAssets.length : null))}
                  type="button"
                >
                  <ArrowIcon />
                </button>
              </>
            ) : null}
            <button
              aria-label="Close image"
              className="mission-story__modal-close"
              onClick={() => setModalIndex(null)}
              type="button"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div
          className="gallery-modal__image mission-story__modal-asset"
          onClick={(e) => e.stopPropagation()}
        >
          {allModalAssets[modalIndex].mimeType?.startsWith('video/') ? (
            <video controls autoPlay playsInline className="mission-story__modal-video">
              <source src={allModalAssets[modalIndex].url} type={allModalAssets[modalIndex].mimeType} />
              Your browser does not support video playback.
            </video>
          ) : (
            <Image
              alt={allModalAssets[modalIndex].alt ?? 'HSM Aries expanded media'}
              fill
              priority
              sizes="95vw"
              src={allModalAssets[modalIndex].url}
            />
          )}
        </div>

        <div className="mission-story__modal-meta" onClick={(e) => e.stopPropagation()}>
          <p>{allModalAssets[modalIndex].caption ?? allModalAssets[modalIndex].alt ?? story.title}</p>
          {allModalAssets[modalIndex].credit ? (
            <small>Credit: {allModalAssets[modalIndex].credit}</small>
          ) : null}
        </div>
      </div>
    ) : null

  return (
    <article className="mission-story">
      <header className="mission-story__masthead">
        <div className="mission-story__masthead-inner">
          <Link className="mission-story__back" href="/news">← Back to mission updates</Link>
          <div className="mission-story__meta">
            <span>{story.category ?? 'MISSION UPDATE'}</span>
            <span>By {story.author ?? 'HSM Aries Editorial'}</span>
            <time dateTime={story.publishedAt}>{formatNewsDate(story.publishedAt)}</time>
          </div>
          <p className="mission-story__issue">Mission log // dispatch record</p>
          <h1>{story.title}</h1>
          <p className="mission-story__deck">{story.excerpt}</p>
        </div>
      </header>

      <figure className="mission-story__figure">
        <button
          type="button"
          className="mission-story__image mission-story__image-btn"
          onClick={() => setModalIndex(0)}
          aria-label="Inspect primary field record in full size"
        >
          <MediaAsset asset={heroAsset} />
          <span className="mission-story__deck-expand" aria-hidden="true">
            <ExpandIcon />
          </span>
        </button>
        <figcaption>
          <span>Field record // HSM Aries</span>
          <span>{formatNewsDate(story.publishedAt)} · Click image to expand</span>
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
          <strong>{formatNewsDate(story.publishedAt).slice(-4)}</strong>
          <p>Filed by<br />{story.author ?? 'HSM Aries Editorial'}</p>
          <span className="mission-story__rail-line" />
          <p>HSM Aries<br />Schmalkalden, DE</p>
        </aside>
        <div className="mission-story__body">
          {story.body.map((paragraph, index) => (
            isStorySubhead(paragraph)
              ? <h2 key={`${story.slug}-${index}`}>{paragraph}</h2>
              : <p className={index === 0 ? 'mission-story__lede' : undefined} key={`${story.slug}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>

      <MediaDeck
        assets={deckAssets}
        onSelectAsset={(idx) => setModalIndex(idx + 1)}
      />

      <footer className="mission-story__footer">
        <span>End of dispatch</span>
        <Link className="button button--outline" href="/news">← View all mission logs</Link>
      </footer>

      {mounted && modalMarkup ? createPortal(modalMarkup, document.body) : null}
    </article>
  )
}
