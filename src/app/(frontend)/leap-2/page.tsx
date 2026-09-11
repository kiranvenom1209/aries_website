import type { Metadata } from 'next'
import Image from 'next/image'

import { GalleryRail } from '@/components/GalleryRail'
import { MagneticLink } from '@/components/MagneticLink'
import { MissionControlShowcase } from '@/components/MissionControlShowcase'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import type { GalleryImage } from '@/lib/gallery'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'Leap-2 is the second rover in the HSM Aries LEAP series: Project 02, in development, with a design brief set by the ERC 2026 scoreboard — mass, traverse, maintenance and probing.',
  image: '/media/erc-2026-finals-hero-leap-2.jpg',
  path: '/leap-2',
  title: 'Leap-2 — Project 02 / LEAP Rovers',
})

const briefGroups = [
  {
    code: '01',
    description: 'The four lines on the ERC 2026 scoreboard that define the redesign.',
    title: 'What changes',
    items: [
      { label: 'Mass', value: 'Under the allowance from the first design review — LEAP-One carried the only penalty in the field (−22)' },
      { label: 'Traverse', value: 'Autonomous navigation designed in from the start; 43 / 340 is the line to beat' },
      { label: 'Maintenance', value: 'A manipulator built to be serviced and operated in the field; 66 / 340' },
      { label: 'Probing', value: 'A probing workflow that scores; 12 / 240' },
    ],
  },
  {
    code: '02',
    description: 'The strengths LEAP-One proved in Kraków, carried straight into Project 02.',
    title: 'What carries forward',
    items: [
      { label: 'Documentation', value: '364.25 / 400 · 4th of 25' },
      { label: 'Navigation droning', value: '265 / 300 · 6th of 25' },
      { label: 'Presentation', value: '229 / 300' },
      { label: 'Operations software', value: 'Mission Control, telemetry and the control station' },
    ],
  },
  {
    code: '03',
    description: 'Where Project 02 stands today.',
    title: 'Programme status',
    items: [
      { label: 'Status', value: 'Design phase' },
      { label: 'Baseline', value: 'LEAP-One as competed at ERC 2026' },
      { label: 'Crew', value: 'The eight LEAP departments' },
      { label: 'Specifications', value: 'Published here as they are frozen' },
    ],
  },
]

const fieldRecord: GalleryImage[] = [
  { alt: 'A team member wires the bare LEAP-One chassis on the grass before its first run at ERC 2026.', src: '/media/erc-2026-finals-05-chassis-rebuild-wiring.jpg' },
  { alt: 'Team members repair wiring beside LEAP-One’s arm and signal tower with a toolbox open on the grass.', src: '/media/erc-2026-finals-12-field-wiring-repair.jpg' },
  { alt: 'The crew huddles around the control-station monitor in the pit tent during a run.', src: '/media/erc-2026-finals-10-control-station-pit-tent.jpg' },
  { alt: 'LEAP-One’s gripper operates the switches on the ERC maintenance panel.', src: '/media/erc-2026-finals-21-gripper-on-maintenance-panel.jpg' },
  { alt: 'On the rain day LEAP-One works the rocky terrain under an umbrella with its arm wrapped in protective plastic.', src: '/media/erc-2026-finals-22-rain-day-umbrella.jpg' },
  { alt: 'LEAP-One climbs the rocky slope with its suspension articulating over the stones.', src: '/media/erc-2026-finals-17-leap-one-climbs-rocky-slope.jpg' },
]

export default function LeapTwoPage() {
  return (
    <PageShell>
      <section className="hero">
        <Image alt="Hands fasten the suspension of LEAP-One’s bare chassis during the rebuild at ERC 2026 — the baseline Leap-2 starts from" fill priority sizes="100vw" src="/media/erc-2026-finals-hero-leap-2.jpg" style={{ objectFit: 'cover' }} />
        <div aria-hidden="true" className="hero__shade" />
        <div className="hero__content" style={{ bottom: '15%', top: 'auto', transform: 'none', width: '100%' }}>
          <div className="leap-one-hero__mission">
            <div className="leap-one-hero__mission-copy">
              <p>HSM ARIES // LEAP ROVERS / PROJECT 02</p>
            </div>
          </div>
          <h1>Leap-2.<br />Built on what we learned.</h1>
        </div>
      </section>

      <section aria-labelledby="leap-2-brief-title" className="leap-stats">
        <div className="leap-stats__intro">
          <p>PROJECT 02 / DESIGN BRIEF</p>
          <h2 id="leap-2-brief-title">Three numbers<br /><em>set the brief.</em></h2>
        </div>
        <div className="leap-stats__item">
          <p>Traverse</p>
          <strong>43 <small>/ 340</small></strong>
          <span>Autonomous navigation comes first</span>
        </div>
        <div className="leap-stats__item">
          <p>Maintenance</p>
          <strong>66 <small>/ 340</small></strong>
          <span>Manipulation that can be serviced</span>
        </div>
        <div className="leap-stats__item">
          <p>Mass</p>
          <strong>−22 <small>pts</small></strong>
          <span>Under the allowance from day one</span>
        </div>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '160px 24px 80px', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>The second rover in the LEAP series</p>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(32px, 4.5vw, 56px)', marginBottom: '30px' }}>IN DEVELOPMENT.</h2>
        <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
          Leap-2 is the successor to LEAP-One, the rover that took HSM Aries to the European Rover Challenge 2026 finals in Kraków. It is in the design phase, and its requirements are set by the scoreboard rather than by a wish list: the tasks where LEAP-One lost points define what the next platform has to do better.
        </p>
        <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
          Subsystems, specifications and the competition campaign will be published on this page as they are frozen. Until then, this is the brief the team is working to.
        </p>
      </section>

      <section aria-labelledby="leap-2-dossier-title" className="vehicle-dossier">
        <header className="vehicle-dossier__header">
          <div>
            <p>Design brief // project 02</p>
            <h2 id="leap-2-dossier-title">What Leap-2 <em>must do better.</em></h2>
          </div>
          <p className="vehicle-dossier__intro">The brief in three parts: what changes, what carries over from LEAP-One, and where the programme stands.</p>
          <div className="vehicle-dossier__readout">
            <span>Requirements</span>
            <strong>{briefGroups.reduce((total, group) => total + group.items.length, 0)}</strong>
            <span>Set by ERC 2026</span>
          </div>
        </header>

        <div className="vehicle-dossier__groups">
          {briefGroups.map((group) => (
            <section className="vehicle-dossier__group" key={group.code}>
              <header>
                <span>{group.code} // brief</span>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </header>
              <dl>
                {group.items.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <MissionControlShowcase />

      <section className="field-gallery aries-home-gallery">
        <div className="aries-home-gallery__header">
          <span className="section-label">FIELD RECORD / ERC 2026</span>
          <h2>Where the brief was written.</h2>
        </div>
        <GalleryRail images={fieldRecord} />
      </section>

      <PartnersBand />

      <section className="join-band" style={{ textAlign: 'center', padding: '160px 24px' }}>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '30px' }}>Build Leap-2 with us.</h2>
        <div className="join-band__actions" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <MagneticLink className="button button--solid" href="/join">Join the crew</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner with Aries</MagneticLink>
          <MagneticLink className="button button--outline" href="/leap-one">LEAP-One dossier</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
