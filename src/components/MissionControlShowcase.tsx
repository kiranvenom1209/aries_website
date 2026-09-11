import Image from 'next/image'
import type { ReactNode } from 'react'

const workspaces = [
  {
    alt: 'LEAP-One Mission Control overview with telemetry, camera feeds, navigation map, drive status, arm status and drill controls',
    className: 'mission-control-showcase__workspace--overview',
    code: '01 / OVERVIEW',
    src: '/media/mission-control-dashboard.png',
    title: 'Mission Control',
  },
  {
    alt: 'LEAP-One manual driving workspace with focused rover controls and navigation telemetry',
    className: 'mission-control-showcase__workspace--driving',
    code: '02 / MOBILITY',
    src: '/media/manual-driving-dashboard.png',
    title: 'Manual driving',
  },
  {
    alt: 'LEAP-One drill operations workspace with sampling and payload controls',
    className: 'mission-control-showcase__workspace--drill',
    code: '03 / SAMPLING',
    src: '/media/drill-operations-dashboard.png',
    title: 'Drill operations',
  },
  {
    alt: 'LEAP-One science operations workspace with payload instrumentation controls',
    className: 'mission-control-showcase__workspace--science',
    code: '04 / SCIENCE',
    src: '/media/science-operations-dashboard.png',
    title: 'Science operations',
  },
] as const

const DEFAULT_INTRO =
  'A purpose-built LEAP-One workstation brings mapping, telemetry, camera supervision and subsystem operations into one field-ready control environment. Used at the ERC 2026 finals, it carries forward to Leap-2.'

type MissionControlShowcaseProps = {
  /** Body copy beside the headline; pages pass their own so the block is not repeated verbatim across routes. Accepts nodes so product names can be wrapped in non-breaking spans. */
  intro?: ReactNode
  /** Mono eyebrow above the headline (on the home page this carries the section number). */
  label?: string
  /** `home` lets the home polish layer restyle the eyebrow as a numbered section label. */
  variant?: 'home'
}

export function MissionControlShowcase({ intro = DEFAULT_INTRO, label = 'LEAP-ONE / OPERATIONS SOFTWARE', variant }: MissionControlShowcaseProps = {}) {
  return (
    <section className={variant ? `mission-control-showcase mission-control-showcase--${variant}` : 'mission-control-showcase'}>
      <header className="mission-control-showcase__header">
        <div>
          <span className="section-label">{label}</span>
          <h2>The view from<br /><em>mission control.</em></h2>
        </div>
        <p>{intro}</p>
      </header>

      <div className="mission-control-showcase__grid">
        {workspaces.map((workspace) => (
          <figure className={`mission-control-showcase__workspace ${workspace.className}`} key={workspace.src}>
            <Image alt={workspace.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 66vw" src={workspace.src} />
            <figcaption>
              <span>{workspace.code}</span>
              <strong>{workspace.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>

      <ul aria-label="Mission Control capabilities" className="mission-control-showcase__capabilities">
        <li>CAMERA SUPERVISION</li>
        <li>ROVER TELEMETRY</li>
        <li>DRIVE + ARM + DRILL</li>
        <li>SCIENCE PAYLOAD</li>
      </ul>
    </section>
  )
}
