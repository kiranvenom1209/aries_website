import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { GalleryRail } from '@/components/GalleryRail'
import { MagneticLink } from '@/components/MagneticLink'
import { MissionControlShowcase } from '@/components/MissionControlShowcase'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import type { GalleryImage } from '@/lib/gallery'
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'Leap-2 is the second HSM Aries LEAP rover, now in development. Its brief comes from the ERC 2026 scoreboard: mass, autonomous traverse, maintenance and probing.',
  image: '/media/og/leap-2.jpg',
  imageAlt: 'Hands fasten the suspension of the bare LEAP-One chassis during the rebuild at ERC 2026',
  path: '/leap-2',
  title: 'Leap-2 — Project 02, LEAP Rovers',
})

const finalsStoryHref = '/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow'

/**
 * One row per ERC 2026 scoreboard line that sets the Leap-2 brief. Scores and
 * what happened come from the finals report; the requirement column states
 * what the next rover has to do, not how — no specifications are frozen yet.
 *
 * `position` frames the photo in the 4:3 desktop box, `positionNarrow` in the
 * 16:9 box the row switches to under 820px; both are read by leap-2.css.
 */
const tradeStudies = [
  {
    code: '01',
    task: 'Traverse',
    score: '43',
    max: '/ 340',
    happened: 'The suspension carried LEAP-One over the rocky slope of the Mars yard. The traverse task, which rewards autonomous navigation across it, closed at 43 points.',
    requirement: 'Navigate the yard autonomously — designed in from the first frame, not added to a finished platform.',
    photo: {
      alt: 'LEAP-One climbs the rocky slope with its suspension articulating over the stones.',
      position: '50% 38%',
      positionNarrow: '50% 40%',
      src: '/media/erc-2026-finals-17-leap-one-climbs-rocky-slope.jpg',
    },
  },
  {
    code: '02',
    task: 'Maintenance',
    score: '66',
    max: '/ 340',
    happened: 'On the rain day the arm ran wrapped in protective plastic under an umbrella. The maintenance task scored 66 of 340.',
    requirement: 'Carry a manipulator that can be serviced in the pit and operated on the panel, rain included.',
    photo: {
      alt: 'On the rain day LEAP-One works the rocky terrain under an umbrella with its arm wrapped in protective plastic.',
      position: '50% 66%',
      positionNarrow: '50% 64%',
      src: '/media/erc-2026-finals-22-rain-day-umbrella.jpg',
    },
  },
  {
    code: '03',
    task: 'Mass',
    score: '−22',
    max: 'pts',
    happened: 'The chassis was rebuilt on the pavement before the first run. LEAP-One was over the mass allowance — 22 points that no other team in the field lost.',
    requirement: 'Sit under the ERC allowance at the first design review, not after the build.',
    photo: {
      alt: 'A team member fastens the suspension of the bare LEAP-One chassis on the pavement with a hex key set beside it.',
      position: '50% 60%',
      positionNarrow: '50% 60%',
      src: '/media/erc-2026-finals-04-chassis-rebuild-suspension.jpg',
    },
  },
  {
    code: '04',
    task: 'Probing',
    score: '12',
    max: '/ 240',
    happened: 'The gripper worked the switches on the maintenance panel, but the probing task closed at 12 of 240 — the lowest line on the sheet.',
    requirement: 'Run a probing workflow that is rehearsed before the field, not improvised in it.',
    photo: {
      alt: 'LEAP-One’s gripper operates the switches on the ERC maintenance panel.',
      position: '50% 40%',
      positionNarrow: '50% 40%',
      src: '/media/erc-2026-finals-21-gripper-on-maintenance-panel.jpg',
    },
  },
]

const briefGroups = [
  {
    code: '02',
    description: 'The strengths LEAP-One proved in Kraków, carried straight into Project 02.',
    title: 'What carries forward',
    items: [
      { label: 'Documentation', value: '364.25 / 400 · 4th of 25' },
      { label: 'Navigation droning', value: '265 / 300 · 6th of 25' },
      { label: 'Operations software', value: 'Mission Control station, telemetry and control workflow, run at the finals' },
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
      { label: 'Specifications', value: 'Added to this brief as they are frozen' },
    ],
  },
]

const fieldRecord: GalleryImage[] = [
  { alt: 'LEAP-One reaches its arm toward the ERC maintenance panel beside marker 14.', src: '/media/erc-2026-finals-20-maintenance-panel-marker-14.jpg' },
  { alt: 'Team members crouch beside LEAP-One as it drives onto the sand of the Mars yard for a test run.', src: '/media/erc-2026-finals-06-first-sand-test.jpg' },
  { alt: 'The crew huddles around the control-station monitor in the pit tent during a run.', src: '/media/erc-2026-finals-10-control-station-pit-tent.jpg' },
  { alt: 'LEAP-One crosses the sand and rock of the Mars yard with its arm raised and a marker on its mast.', src: '/media/erc-2026-finals-15-leap-one-mars-yard-arm-raised.jpg' },
  { alt: 'LEAP-One’s rocker-bogie suspension works over the loose rock of the Mars yard.', src: '/media/erc-2026-finals-42-suspension-over-the-rocks.jpg' },
  { alt: 'The rebuild continues on the grass with the tool kit and spare wheels laid out around the chassis.', src: '/media/erc-2026-finals-05-chassis-rebuild-wiring.jpg' },
]

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'LEAP Rovers', path: '/leap-one' },
  { name: 'Leap-2' },
])

export default function LeapTwoPage() {
  return (
    <PageShell>
      <script dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} type="application/ld+json" />
      <section className="hero hero--leap-2">
        <Image alt="The bare LEAP-One chassis on its wheels during the rebuild at ERC 2026 — the baseline Leap-2 starts from" fetchPriority="high" fill preload sizes="100vw" src="/media/erc-2026-finals-hero-leap-2.jpg" style={{ objectFit: 'cover' }} />
        <div aria-hidden="true" className="hero__shade" />
        <div className="hero__content hero__content--low">
          <div className="leap-one-hero__mission">
            <div className="leap-one-hero__mission-copy">
              <p>HSM ARIES // LEAP ROVERS // PROJECT 02</p>
            </div>
          </div>
          <h1>Leap-2.<br />Built on what we learned.</h1>
        </div>
      </section>

      <section aria-labelledby="leap-2-brief-title" className="leap-stats">
        <div className="leap-stats__intro">
          <p>PROJECT 02 // DESIGN BRIEF</p>
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

      <section aria-labelledby="leap-2-status-title" className="series-statement">
        <p className="series-statement__eyebrow">PROJECT 02 // STATUS</p>
        <h2 id="leap-2-status-title">In <em>development.</em></h2>
        <p>
          Leap-2 is the successor to LEAP-One, the rover that took HSM Aries to the European Rover Challenge 2026 finals in Kraków. It is in the design phase, and its requirements are set by the scoreboard rather than by a wish list: the tasks where LEAP-One lost points define what the next platform has to do better.
        </p>
        <p>
          This page is the brief the team is working to. Subsystems and specifications follow here as they are frozen.
        </p>
        <div className="series-statement__actions">
          <MagneticLink className="button button--outline" href="/news">Follow the build</MagneticLink>
        </div>
      </section>

      <section aria-labelledby="leap-2-dossier-title" className="vehicle-dossier" id="roadmap">
        <header className="vehicle-dossier__header">
          <div>
            <p>Project 02 // the brief</p>
            <h2 id="leap-2-dossier-title">What Leap-2 <em>must do better.</em></h2>
          </div>
          <p className="vehicle-dossier__intro">The brief in three parts: what changes, what carries over from LEAP-One, and where the programme stands.</p>
          <div className="vehicle-dossier__readout">
            <span>Scoreboard lines</span>
            <strong>{tradeStudies.length}</strong>
            <span>Set by ERC 2026</span>
          </div>
        </header>

        <div className="vehicle-dossier__groups vehicle-dossier__groups--leap-2">
          <section aria-labelledby="leap-2-trade-study-title" className="vehicle-dossier__group leap-2-trade-study">
            <header>
              <span>01 // brief</span>
              <h3 id="leap-2-trade-study-title">What changes</h3>
              <p>The three lines above, plus probing: the scoreboard entries that define the redesign. Each row pairs the result in Kraków with what Leap-2 has to do about it.</p>
            </header>
            <ol className="leap-2-trade-study__rows">
              {tradeStudies.map((row) => (
                <li className="leap-2-trade-study__row" key={row.task}>
                  <figure className="leap-2-trade-study__photo" style={{ '--photo-position': row.photo.position, '--photo-position-narrow': row.photo.positionNarrow } as CSSProperties}>
                    <Image alt={row.photo.alt} fill sizes="(max-width: 820px) 100vw, 26vw" src={row.photo.src} style={{ objectFit: 'cover' }} />
                    <figcaption>{row.code} // {row.task}</figcaption>
                  </figure>
                  <div className="leap-2-trade-study__result">
                    <span>LEAP-One in Kraków</span>
                    <strong>{row.score} <small>{row.max}</small></strong>
                    <p>{row.happened}</p>
                  </div>
                  <div className="leap-2-trade-study__requirement">
                    <span>Leap-2 has to</span>
                    <p>{row.requirement}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

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

      <MissionControlShowcase
        intro="The subsystem Leap-2 inherits on day one: mapping, telemetry, camera supervision and subsystem control in one operator environment, built for LEAP-One and used at the ERC 2026 finals."
        label="CARRIED FORWARD // OPERATIONS SOFTWARE"
      />

      <section className="field-gallery aries-home-gallery leap-2-field-record">
        <div className="aries-home-gallery__header">
          <div>
            <span className="section-label">FIELD RECORD // ERC 2026</span>
            <h2>Where the brief was written.</h2>
          </div>
          <div className="leap-2-field-record__links">
            <Link className="text-link" href={finalsStoryHref}>Read the finals report <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/gallery">Open the field gallery <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <GalleryRail images={fieldRecord} />
      </section>

      <PartnersBand />

      <section className="join-band join-band--centred">
        <h2>Build Leap-2 with us.</h2>
        <div className="join-band__actions">
          <MagneticLink className="button button--solid" href="/join">Join the crew</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner with Aries</MagneticLink>
          <MagneticLink className="button button--outline" href="/leap-one">LEAP-One dossier</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
