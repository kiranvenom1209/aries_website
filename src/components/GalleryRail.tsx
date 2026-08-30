'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

import { authoritativeGalleryImages, type GalleryImage } from '@/lib/gallery'

import { ArrowIcon, CloseIcon, ExpandIcon } from './Icons'

export function GalleryRail({
  expanded = false,
  images: suppliedImages,
}: {
  expanded?: boolean
  images?: GalleryImage[]
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [modal, setModal] = useState<number | null>(null)
  const sourceImages = suppliedImages ?? authoritativeGalleryImages
  const images = expanded ? sourceImages : sourceImages.slice(0, 6)

  const move = (direction: number) => {
    const next = (active + direction + images.length) % images.length
    setActive(next)
    railRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <>
      <div className="gallery-controls">
        <button aria-label="Previous image" onClick={() => move(-1)} type="button"><ArrowIcon /></button>
        <span><b>{String(active + 1).padStart(2, '0')}</b> / {String(images.length).padStart(2, '0')}</span>
        <button aria-label="Next image" onClick={() => move(1)} type="button"><ArrowIcon /></button>
      </div>
      <div className={expanded ? 'gallery-rail gallery-rail--grid' : 'gallery-rail'} ref={railRef}>
        {images.map((item, index) => (
          <button
            aria-label={`Expand image: ${item.alt}`}
            className={active === index ? 'is-active' : ''}
            key={item.src}
            onClick={() => { setActive(index); setModal(index) }}
            type="button"
          >
            <Image alt={item.alt} fill sizes={expanded ? '(max-width: 720px) 100vw, 50vw' : '(max-width: 720px) 80vw, 28vw'} src={item.src} />
            <span><ExpandIcon /></span>
          </button>
        ))}
      </div>
      {modal !== null ? (
        <div aria-label="Expanded gallery image" aria-modal="true" className="gallery-modal" role="dialog">
          <button aria-label="Close image" onClick={() => setModal(null)} type="button"><CloseIcon /></button>
          <div className="gallery-modal__image">
            <Image alt={images[modal].alt} fill sizes="95vw" src={images[modal].src} />
          </div>
          <p>{images[modal].alt}</p>
        </div>
      ) : null}
    </>
  )
}
