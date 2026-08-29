'use client'

import Image from 'next/image'
import { useState } from 'react'

const systems = [
  {
    description: 'Rocker-bogie suspension built for steep inclines, loose gravel and complex obstacles.',
    focus: '50% 56%',
    image: '/media/leap-one-mobility-cinematic.png',
    label: 'Mobility',
  },
  {
    description: 'Onboard perception, dual stereocams, and compute architecture for autonomous field navigation.',
    focus: '50% 52%',
    image: '/media/leap-one-autonomy-cinematic.png',
    label: 'Autonomy',
  },
  {
    description: 'An Igus ReBeL 6-DoF arm with a modular 3D-printed gripper for sample handling, mission tools and maintenance tasks.',
    focus: '50% 54%',
    image: '/media/space-night-exhibit.jpg',
    label: 'Manipulation',
  },
  {
    description: 'A 530 mm coaxial auger reaches beyond 300 mm for regolith sampling, then verifies collected material with onboard weighing and imaging.',
    focus: '50% 60%',
    image: '/media/leap-one-drill-test.png',
    label: 'Science',
  },
]

export function MissionSystems() {
  const [active, setActive] = useState(0)
  const system = systems[active]

  return (
    <div className="mission-systems">
      <div className="mission-systems__tabs" role="tablist" aria-label="LEAP-One mission systems">
        {systems.map((item, index) => (
          <button
            aria-controls="mission-system-description"
            aria-selected={active === index}
            className={active === index ? 'is-active' : ''}
            key={item.label}
            onClick={() => setActive(index)}
            role="tab"
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
        <p id="mission-system-description">{system.description}</p>
      </div>
      <div className={`mission-systems__image mission-systems__image--${system.label.toLowerCase()} reveal-media`}>
        <Image alt={`${system.label} system on the LEAP-One rover`} fill key={system.image} sizes="(max-width: 900px) 100vw, 58vw" src={system.image} style={{ objectPosition: system.focus }} />
      </div>
    </div>
  )
}
