'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

import { ArrowIcon, CloseIcon, ExpandIcon } from './Icons'

export type GalleryImage = {
  alt: string
  src: string
}

export const galleryImages: GalleryImage[] = [
  { alt: 'LEAP-One rover navigating rocky terrain during mobility trials', src: '/media/dsc01502-scaled.jpg' },
  { alt: 'High-power field trial traversing steep woodland incline', src: '/media/DSC02822-scaled.jpg' },
  { alt: 'HSM Aries engineering team and LEAP-One at Space Night', src: '/media/space-night-rover.jpg' },
  { alt: 'Close-up of 6-wheel rocker-bogie kinematics clearing trail obstacles', src: '/media/DSC02793-scaled.jpg' },
  { alt: 'Software engineer operating the 6-DoF robotic manipulator', src: '/media/space-night-exhibit.jpg' },
  { alt: 'Autonomous slope ascent and wheel traction validation', src: '/media/DSC02769-scaled.jpg' },
  { alt: 'Full interdisciplinary team gathered in university robotics lab', src: '/media/dsc01422-scaled.jpg' },
  { alt: 'Field operations crew monitoring real-time telemetry on laptop', src: '/media/DSC02608-scaled.jpg' },
  { alt: 'Avionics, LiFePO4 battery pack, and motor calibration test bench', src: '/media/testing.jpg' },
  { alt: 'Sunlight inspection of robotic arm and internal avionics bay', src: '/media/DSC02579-scaled.jpg' },
  { alt: 'Rocker-bogie suspension traverse over forest trail', src: '/media/dsc01546-scaled.jpg' },
  { alt: 'Field deployment perspective of LEAP-One in open grasslands', src: '/media/DSC02577-scaled.jpg' },
  { alt: 'HSM Aries presentation to state leadership at Space Night', src: '/media/space-night-team.jpg' },
  { alt: 'Mechanical architecture presentation to Boehm Group partners', src: '/media/pitching-in-boehm-scaled.jpg' },
  { alt: 'Close-up of custom 3D-printed flexible wheel on mounting plate', src: '/media/3d-tyre-scaled.jpg' },
  { alt: 'Engineering crew conducting outdoor field telemetry validation', src: '/media/dsc01556-scaled.jpg' },
  { alt: 'Precision CNC-machined aluminum chassis at Boehm facility', src: '/media/boehm-manufacturing-scaled.jpg' },
  { alt: 'Hochschule Schmalkalden university campus and testing grounds', src: '/media/rover-4-scaled.jpg' },
]

export function GalleryRail({ expanded = false }: { expanded?: boolean }) {
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [modal, setModal] = useState<number | null>(null)
  const images = expanded ? galleryImages : galleryImages.slice(0, 6)

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

