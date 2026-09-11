'use client'

import Image from 'next/image'
import type { KeyboardEvent } from 'react'
import { useState } from 'react'

const systems = [
  {
    alt: 'LEAP-One’s rocker-bogie suspension works over the loose rock of the Mars yard at ERC 2026.',
    description: 'Rocker-bogie suspension built for steep inclines, loose gravel and complex obstacles.',
    image: '/media/erc-2026-finals-42-suspension-over-the-rocks.jpg',
    label: 'Mobility',
    slug: 'mobility',
  },
  {
    alt: 'LEAP-One carries the quadcopter past the navigation markers on the Mars yard at ERC 2026.',
    description: 'Onboard perception, dual stereocams, and compute architecture for autonomous field navigation.',
    image: '/media/erc-2026-finals-43-carrying-the-quadcopter-past-the-markers.jpg',
    label: 'Autonomy',
    slug: 'autonomy',
  },
  {
    alt: 'LEAP-One’s gripper operates the switches on the ERC 2026 maintenance panel.',
    description: 'An Igus ReBeL 6-DoF arm with a modular 3D-printed gripper for sample handling, mission tools and maintenance tasks.',
    image: '/media/erc-2026-finals-21-gripper-on-maintenance-panel.jpg',
    label: 'Manipulation',
    slug: 'manipulation',
  },
  {
    alt: 'Sample containers mounted on LEAP-One with the arm raised at ERC 2026.',
    description: 'A 530 mm coaxial auger reaches beyond 300 mm for regolith sampling, then verifies collected material with onboard weighing and imaging.',
    image: '/media/erc-2026-finals-16-sample-containers-arm-raised.jpg',
    label: 'Science',
    slug: 'science',
  },
]

const tabId = (index: number) => `mission-tab-${index}`

export function MissionSystems() {
  const [active, setActive] = useState(0)
  const system = systems[active]

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = systems.length
    let next: number | null = null

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (index + 1) % count
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (index - 1 + count) % count
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = count - 1
        break
      default:
        return
    }

    event.preventDefault()
    setActive(next)
    const target = event.currentTarget.parentElement?.children[next]
    if (target instanceof HTMLElement) target.focus()
  }

  return (
    <div className="mission-systems">
      <div className="mission-systems__tabs">
        <div aria-label="LEAP-One mission systems" aria-orientation="vertical" className="mission-systems__tablist" role="tablist">
          {systems.map((item, index) => (
            <button
              aria-controls="mission-system-panel"
              aria-selected={active === index}
              className={active === index ? 'is-active' : ''}
              id={tabId(index)}
              key={item.label}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              role="tab"
              tabIndex={active === index ? 0 : -1}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <p aria-live="polite" id="mission-system-description">{system.description}</p>
      </div>
      <div
        aria-describedby="mission-system-description"
        aria-labelledby={tabId(active)}
        className="mission-systems__image reveal-media"
        id="mission-system-panel"
        role="tabpanel"
      >
        {systems.map((item, index) => (
          <Image
            alt={item.alt}
            aria-hidden={active !== index}
            className={`mission-systems__photo mission-systems__photo--${item.slug}${active === index ? ' is-active' : ''}`}
            fill
            key={item.image}
            sizes="(max-width: 900px) 100vw, 58vw"
            src={item.image}
          />
        ))}
      </div>
    </div>
  )
}
