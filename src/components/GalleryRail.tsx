'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'

import { authoritativeGalleryImages, galleryImagePosition, groupGalleryImages, type GalleryImage } from '@/lib/gallery'

import { ArrowIcon, CloseIcon, ExpandIcon } from './Icons'

const SWIPE_THRESHOLD = 40

const pad = (value: number) => String(value).padStart(2, '0')

export function GalleryRail({
  expanded = false,
  images: suppliedImages,
}: {
  expanded?: boolean
  images?: GalleryImage[]
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const chaptersRef = useRef<HTMLElement>(null)
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])
  const openerRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const captionId = useId()
  const [active, setActive] = useState<number | null>(null)
  const [modal, setModal] = useState<number | null>(null)
  const [currentChapter, setCurrentChapter] = useState<string | null>(null)
  const sourceImages = suppliedImages ?? authoritativeGalleryImages
  const images = expanded ? sourceImages : sourceImages.slice(0, 6)
  const count = images.length
  const chapters = expanded ? groupGalleryImages(images) : null

  // The native dialog owns focus trapping and Escape. Focus goes back to the
  // tile that opened the lightbox once the dialog has actually closed; while
  // it is open everything outside it is inert and focus() would be a no-op.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (modal !== null) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
      if (openerRef.current !== null) tileRefs.current[openerRef.current]?.focus()
    }
  }, [modal])

  // Marks the chapter whose section crosses a band just below the sticky index.
  useEffect(() => {
    if (!expanded || typeof IntersectionObserver === 'undefined') return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.gallery-chapter'))
    if (sections.length === 0) return
    const visible = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        }
        const latest = sections.filter((section) => visible.has(section)).pop()
        if (latest) setCurrentChapter(latest.id)
      },
      { rootMargin: '-28% 0px -66% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [expanded])

  // On the phone the index is a horizontal strip: keep the current label in view.
  useEffect(() => {
    const bar = chaptersRef.current
    if (!bar || !currentChapter || bar.scrollWidth <= bar.clientWidth) return
    const link = bar.querySelector<HTMLAnchorElement>(`a[href="#${currentChapter}"]`)
    if (!link) return
    const barRect = bar.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    const left = bar.scrollLeft + (linkRect.left - barRect.left) - (bar.clientWidth - linkRect.width) / 2
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    bar.scrollTo({ behavior: reduceMotion ? 'auto' : 'smooth', left: Math.max(0, left) })
  }, [currentChapter])

  const step = (direction: number) => {
    setModal((current) => (current === null ? null : (current + direction + count) % count))
  }

  const handleClose = () => {
    const index = openerRef.current
    setModal(null)
    setActive(null)
    // Escape / native close: the dialog is already closed here, so focus lands.
    if (index !== null && !dialogRef.current?.open) tileRefs.current[index]?.focus()
  }

  const move = (direction: number) => {
    const next = ((active ?? 0) + direction + count) % count
    setActive(next)
    railRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const renderTile = (item: GalleryImage, index: number, wide = false) => {
    // Per-photo framing keeps the subject in the cover crop; the lightbox is untouched.
    const position = galleryImagePosition(item)
    return (
      <button
        aria-label={`Expand image: ${item.alt}`}
        className={[
          'gallery-rail__tile',
          wide ? 'gallery-rail__tile--wide' : '',
          !expanded && active === index ? 'is-active' : '',
        ].filter(Boolean).join(' ')}
        key={item.src}
        onClick={() => { if (!expanded) setActive(index); openerRef.current = index; setModal(index) }}
        ref={(node) => { tileRefs.current[index] = node }}
        type="button"
      >
        <Image
          alt={item.alt}
          fetchPriority={expanded && index === 0 ? 'high' : undefined}
          fill
          loading={expanded && index < 2 ? 'eager' : 'lazy'}
          sizes={expanded ? (wide ? '100vw' : '50vw') : '(max-width: 720px) 80vw, 28vw'}
          src={item.src}
          style={position ? { objectPosition: position } : undefined}
        />
        <span><ExpandIcon /></span>
      </button>
    )
  }

  const current = modal !== null ? images[modal] : null

  return (
    <>
      {chapters ? (
        <>
          <nav aria-label="Gallery chapters" className="gallery-chapters" ref={chaptersRef}>
            <ul>
              {chapters.map(({ chapter }, position) => {
                const id = `gallery-${chapter.group}`
                return (
                  <li key={chapter.group}>
                    <a aria-current={currentChapter === id ? 'true' : undefined} href={`#${id}`}>
                      <b>{pad(position + 1)}</b> {chapter.short}
                    </a>
                  </li>
                )
              })}
            </ul>
            <span className="gallery-chapters__count"><b>{pad(count)}</b> frames · newest first</span>
          </nav>
          {chapters.map(({ chapter, indexes }) => {
            // Two-frame chapters render as one clean pair; longer ones open on a
            // full-width lead and close on a full row.
            const promote = indexes.length > 2
            return (
              <section className="gallery-chapter" id={`gallery-${chapter.group}`} key={chapter.group}>
                <header className="gallery-chapter__header">
                  <span className="hero__eyebrow">{chapter.eyebrow}</span>
                  <h2>{chapter.heading}</h2>
                  <p>{chapter.intro}</p>
                </header>
                <div className="gallery-rail gallery-rail--grid">
                  {indexes.map((index, position) =>
                    renderTile(
                      images[index],
                      index,
                      promote && (position === 0 || (position === indexes.length - 1 && indexes.length % 2 === 0)),
                    ),
                  )}
                </div>
              </section>
            )
          })}
        </>
      ) : (
        <>
          <div className="gallery-controls">
            <button aria-label="Previous image" onClick={() => move(-1)} type="button"><ArrowIcon /></button>
            <span><b>{pad((active ?? 0) + 1)}</b> / {pad(count)}</span>
            <button aria-label="Next image" onClick={() => move(1)} type="button"><ArrowIcon /></button>
          </div>
          <div className="gallery-rail" ref={railRef}>
            {images.map((item, index) => renderTile(item, index))}
          </div>
        </>
      )}
      <dialog
        aria-labelledby={captionId}
        className="gallery-modal"
        onClick={(event) => { if (event.target === event.currentTarget) handleClose() }}
        onClose={handleClose}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); step(1) }
          if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1) }
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current
          touchStartX.current = null
          if (start === null) return
          const delta = event.changedTouches[0].clientX - start
          if (Math.abs(delta) > SWIPE_THRESHOLD) step(delta < 0 ? 1 : -1)
        }}
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
        ref={dialogRef}
      >
        {current && modal !== null ? (
          <>
            <button aria-label="Close image" className="gallery-modal__close" onClick={handleClose} type="button"><CloseIcon /></button>
            {count > 1 ? (
              <button aria-label="Previous image" className="gallery-modal__arrow gallery-modal__arrow--prev" onClick={() => step(-1)} type="button"><ArrowIcon /></button>
            ) : null}
            <figure className="gallery-modal__figure">
              <div className="gallery-modal__image">
                <Image alt={current.alt} fill sizes="95vw" src={current.src} />
              </div>
              <figcaption aria-live="polite" id={captionId}>
                <b>{pad(modal + 1)} / {pad(count)}</b>
                <span>{current.alt}</span>
              </figcaption>
            </figure>
            {count > 1 ? (
              <button aria-label="Next image" className="gallery-modal__arrow gallery-modal__arrow--next" onClick={() => step(1)} type="button"><ArrowIcon /></button>
            ) : null}
          </>
        ) : null}
      </dialog>
    </>
  )
}
