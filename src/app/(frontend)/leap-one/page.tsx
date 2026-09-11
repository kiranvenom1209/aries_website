import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { MagneticLink } from '@/components/MagneticLink'
import { MissionControlShowcase } from '@/components/MissionControlShowcase'
import { MissionSystems } from '@/components/MissionSystems'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import { RoverViewer } from '@/components/RoverViewer'
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'LEAP-One is Project 01 of the HSM Aries LEAP series: the rover that competed at the ERC 2026 finals in Kraków. Result, vehicle dossier and the road to Leap-2.',
  image: '/media/og/leap-one.jpg',
  imageAlt: 'LEAP-One reaches out with its arm on the Mars yard at the ERC 2026 finals',
  path: '/leap-one',
  title: 'LEAP-One — Project 01, LEAP Rovers',
})

const finalsStoryHref = '/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow'

const specGroups = [
  {
    code: '01',
    description: 'Load-bearing structure, terrain handling and motive force.',
    title: 'Mobility & structure',
    items: [
      { label: 'Chassis material', value: 'Aluminium 3.3535 (5754)' },
      { label: 'Suspension type', value: '6-Wheel Rocker-Bogie with Differential' },
      { label: 'Ground clearance', value: '180 mm nominal' },
      { label: 'Gradeability', value: '35° incline traverse' },
      { label: 'Drivetrain', value: '6× Botwheel BLDC + ODrive S1' },
      { label: 'Wheel architecture', value: 'Custom 3D-Printed TPU Wheels' },
    ],
  },
  {
    code: '02',
    description: 'Energy storage, endurance and the compute core behind the mission.',
    title: 'Power & compute',
    items: [
      { label: 'Battery architecture', value: '4× 12.8 V, 30 Ah LiFePO₄ in 2S2P' },
      { label: 'Stored energy', value: '25.6 V · 60 Ah · ≈1.5 kWh' },
      { label: 'Estimated autonomy', value: '≈1 h 21 min at design load' },
      { label: 'Primary compute', value: 'ROG NUC 15 + Teensy 4.1' },
    ],
  },
  {
    code: '03',
    description: 'Autonomy, science instrumentation and mission communication links.',
    title: 'Mission systems',
    items: [
      { label: 'Autonomy framework', value: 'ROS 2 on Ubuntu 24.04 · EKF + DWA' },
      { label: 'Manipulation system', value: 'Igus ReBeL 6-DoF · 2 kg payload' },
      { label: 'Sampling drill', value: '530 mm coaxial auger · ≥300 mm depth' },
      { label: 'Primary data link', value: '5 GHz AirMAX TDMA · 400 m verified' },
      { label: 'Backup link', value: '2.4 GHz ExpressLRS' },
    ],
  },
]

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'LEAP-One' },
])

export default function LeapOnePage() {
  return (
    <PageShell>
      <script dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} type="application/ld+json" />
      <section className="hero">
        <Image alt="LEAP-One reaches out with its arm on the Mars yard at the ERC 2026 finals" fetchPriority="high" fill preload sizes="100vw" src="/media/erc-2026-finals-hero-leap-one.jpg" style={{ objectFit: 'cover' }} />
        <div aria-hidden="true" className="hero__shade" />
        <div className="hero__content" style={{ bottom: '15%', top: 'auto', transform: 'none', width: '100%' }}>
          <div className="leap-one-hero__mission">
            <div className="leap-one-hero__badge">
              <Image alt="LEAP-One mission badge" height={154} src="/media/leapone.png" width={154} />
            </div>
            <div className="leap-one-hero__mission-copy">
              <p>HSM ARIES // LEAP ROVERS // PROJECT 01</p>
            </div>
          </div>
          <h1>LEAP-One.<br />The first leap.</h1>
        </div>
      </section>

      <section aria-labelledby="leap-stats-title" className="leap-stats">
        <div className="leap-stats__intro">
          <p>PROJECT 01 // ERC 2026 RESULT</p>
          <h2 id="leap-stats-title">Tested at<br /><em>ERC 2026.</em></h2>
          <div className="leap-stats__links">
            <Link className="text-link" href={finalsStoryHref}>Read the finals report <span aria-hidden="true">→</span></Link>
            <Link className="text-link" href="/gallery">Field gallery <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="leap-stats__item">
          <p>Overall</p>
          <strong>1492.25 <small>/ 3000</small></strong>
          <span>17th of 25 teams</span>
        </div>
        <div className="leap-stats__item">
          <p>Documentation</p>
          <strong>364.25 <small>/ 400</small></strong>
          <span>4th of 25 teams</span>
        </div>
        <div className="leap-stats__item">
          <p>Navigation droning</p>
          <strong>265 <small>/ 300</small></strong>
          <span>6th of 25 teams</span>
        </div>
      </section>

      <section aria-labelledby="leap-2-title" className="vehicle-dossier" id="roadmap">
        <header className="vehicle-dossier__header">
          <div>
            <p>LEAP SERIES // PROJECT ROADMAP</p>
            <h2 id="leap-2-title">From <span style={{ whiteSpace: 'nowrap' }}>LEAP-One</span><br /><em>to Leap-2.</em></h2>
          </div>
          <p className="vehicle-dossier__intro">Not the placing we wanted. The scoreboard says what LEAP-One did well and what Leap-2 has to do better; the vehicle dossier below records the configuration that competed.</p>
        </header>

        <div className="vehicle-dossier__groups">
          <section className="vehicle-dossier__group">
            <header>
              <span>01 // scored</span>
              <h3>Points scored</h3>
              <p>The rest of the ERC 2026 scoreboard, task by task.</p>
            </header>
            <dl>
              <div>
                <dt>Presentation</dt>
                <dd>229 / 300</dd>
              </div>
              <div>
                <dt>AstroBio</dt>
                <dd>215 / 300</dd>
              </div>
              <div>
                <dt>Surface &amp; deep sampling</dt>
                <dd>197 / 440</dd>
              </div>
              <div>
                <dt>Exploration</dt>
                <dd>123 / 340</dd>
              </div>
            </dl>
          </section>
          <section className="vehicle-dossier__group">
            <header>
              <span>02 // the brief</span>
              <h3>Points lost</h3>
              <p>The four lines that decide Leap-2.</p>
            </header>
            <dl>
              <div>
                <dt>Traverse</dt>
                <dd>43 / 340</dd>
              </div>
              <div>
                <dt>Maintenance</dt>
                <dd>66 / 340</dd>
              </div>
              <div>
                <dt>Probing</dt>
                <dd>12 / 240</dd>
              </div>
              <div>
                <dt>Mass</dt>
                <dd>−22 · only penalty in the field</dd>
              </div>
            </dl>
          </section>
          <section className="vehicle-dossier__group">
            <header>
              <span>03 // project</span>
              <h3>Leap-2</h3>
              <p>Project 02 · in development</p>
            </header>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>Requirements set by the ERC 2026 scoreboard</dd>
              </div>
              <div>
                <dt>Mass</dt>
                <dd>Under the allowance from day one</dd>
              </div>
              <div>
                <dt>Traverse</dt>
                <dd>Autonomous navigation first</dd>
              </div>
              <div>
                <dt>Manipulation</dt>
                <dd>Serviceable for maintenance and probing</dd>
              </div>
              <div>
                <dt>Carried forward</dt>
                <dd>Documentation, droning, operations</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>

      <RoverViewer />

      <MissionControlShowcase />

      <section aria-labelledby="leap-systems-title" className="leap-feature">
        <header className="leap-feature__header">
          <p className="leap-feature__eyebrow">LEAP-ONE // CORE SUBSYSTEMS</p>
          <h2 className="leap-feature__title" id="leap-systems-title">Four <em>mission systems.</em></h2>
        </header>
        <MissionSystems />
      </section>

      <section aria-labelledby="leap-drivetrain-title" className="leap-feature-bleed">
        <Image alt="LEAP-One's 3D-printed TPU wheels dig into the sand at the ERC 2026 Mars yard" className="leap-feature-bleed__image" fill sizes="100vw" src="/media/erc-2026-finals-07-wheels-in-the-sand.jpg" />
        <div aria-hidden="true" className="leap-feature-bleed__shade" />
        <div className="leap-feature-bleed__copy">
          <p className="leap-feature__eyebrow">LEAP-ONE // DRIVETRAIN</p>
          <h2 className="leap-feature__title" id="leap-drivetrain-title">Custom drivetrain. <em>3D-printed tyres.</em></h2>
          <p className="leap-feature__lede">
            The passive differential rocker-bogie keeps all six custom TPU wheels in contact over rough terrain. Its 180 mm nominal clearance, 35° slope target and 60 mm obstacle capability are designed for demanding analogue field work.
          </p>
        </div>
      </section>

      <section aria-labelledby="leap-power-title" className="leap-feature-split">
        <div className="leap-feature-split__copy">
          <p className="leap-feature__eyebrow">LEAP-ONE // POWER ARCHITECTURE</p>
          <h2 className="leap-feature__title" id="leap-power-title">2S2P LiFePO₄ <em>power system.</em></h2>
          <p className="leap-feature__lede">
            Four 12.8 V, 30 Ah LiFePO₄ modules are configured in 2S2P to form a 25.6 V, 60 Ah main bus with approximately 1.5 kWh of stored energy.
          </p>
          <p className="leap-feature__note">
            Regulated DC-DC conversion, centralized distribution and a solid-state-relay E-Stop isolate the mobility bus while retaining computation and communications for diagnostics.
          </p>
        </div>
        <div className="leap-feature-split__media">
          <Image alt="LiFePO4 battery and motor calibration test bench" fill sizes="(max-width: 820px) 100vw, 50vw" src="/media/testing.jpg" style={{ objectFit: 'cover' }} />
        </div>
      </section>

      <section aria-labelledby="leap-structure-title" className="leap-feature-split leap-feature-split--reverse">
        <div className="leap-feature-split__media">
          <Image alt="Machined 5754 aluminium rover base and rocker linkages on a lift cart at Boehm Group" fill sizes="(max-width: 820px) 100vw, 50vw" src="/media/boehm-manufacturing-scaled.jpg" style={{ objectFit: 'cover' }} />
        </div>
        <div className="leap-feature-split__copy">
          <p className="leap-feature__eyebrow">LEAP-ONE // MANUFACTURING</p>
          <h2 className="leap-feature__title" id="leap-structure-title">Machined to the <em>CAD.</em></h2>
          <p className="leap-feature__lede">
            The lightweight primary structure uses aluminium 3.3535 (5754), with 20×40 mm rocker linkages and a 20×20 mm differential bar. Boehm Group GmbH manufactured the rover base as part of the team’s industrial collaboration.
          </p>
          <p className="leap-feature__note">
            Machining the base to drawing keeps the rocker linkages, differential bar and mounting pattern within tolerance — the reference every other subsystem is aligned to. The structure is sized for transport, repeated field handling and rebuilds between runs: in Kraków the chassis was rebuilt on the pavement before LEAP-One’s first run.
          </p>
        </div>
      </section>

      <section aria-labelledby="vehicle-dossier-title" className="vehicle-dossier">
        <header className="vehicle-dossier__header">
          <div>
            <p>Engineering data // project 01</p>
            <h2 id="vehicle-dossier-title">Vehicle <em>dossier.</em></h2>
          </div>
          <p className="vehicle-dossier__intro">Every number below is the LEAP-One configuration that competed at ERC 2026 — not a target, not a render.</p>
          <div className="vehicle-dossier__readout">
            <span>System mass, est.</span>
            <strong>74.8</strong>
            <span>kg · ERC 2026 competition build</span>
          </div>
        </header>

        <div className="vehicle-dossier__groups">
          {specGroups.map((group) => (
            <section className="vehicle-dossier__group" key={group.code}>
              <header>
                <span>{group.code} // subsystem</span>
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

      <PartnersBand />

      <section aria-labelledby="leap-cta-title" className="join-band leap-feature-cta">
        <h2 id="leap-cta-title">Ready for the <em>next leap?</em></h2>
        <div className="join-band__actions">
          <MagneticLink className="button button--solid" href="/leap-2">Explore Leap-2</MagneticLink>
          <MagneticLink className="button button--outline" href="/join">Join the crew</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner with Aries</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
