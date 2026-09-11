import type { Metadata } from 'next'
import Image from 'next/image'

import { MagneticLink } from '@/components/MagneticLink'
import { MissionControlShowcase } from '@/components/MissionControlShowcase'
import { MissionSystems } from '@/components/MissionSystems'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import { RoverViewer } from '@/components/RoverViewer'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'LEAP-One, Project 01 of the HSM Aries LEAP series: the rover that competed at the ERC 2026 finals in Kraków — its result, vehicle dossier and the road to Leap-2.',
  image: '/media/erc-2026-finals-hero-leap-one.jpg',
  path: '/leap-one',
  title: 'LEAP-One — Project 01 / LEAP Rovers',
})

const specGroups = [
  {
    code: '01',
    description: 'Load-bearing structure, terrain handling and motive force.',
    title: 'Mobility & structure',
    items: [
      { label: 'Estimated system mass', value: '≈74.8 kg' },
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

export default function LeapOnePage() {
  return (
    <PageShell>
      <section className="hero">
        <Image alt="LEAP-One reaches out with its arm on the Mars yard at the ERC 2026 finals" fill priority sizes="100vw" src="/media/erc-2026-finals-hero-leap-one.jpg" style={{ objectFit: 'cover' }} />
        <div aria-hidden="true" className="hero__shade" />
        <div className="hero__content" style={{ bottom: '15%', top: 'auto', transform: 'none', width: '100%' }}>
          <div className="leap-one-hero__mission">
            <div className="leap-one-hero__badge">
              <Image alt="LEAP-One mission badge" height={154} src="/media/leapone.png" width={154} />
            </div>
            <div className="leap-one-hero__mission-copy">
              <p>HSM ARIES // LEAP ROVERS / PROJECT 01</p>
            </div>
          </div>
          <h1>LEAP-One.<br />The first leap.</h1>
        </div>
      </section>

      <section aria-labelledby="leap-stats-title" className="leap-stats">
        <div className="leap-stats__intro">
          <p>PROJECT 01 / ERC 2026 RESULT</p>
          <h2 id="leap-stats-title">Tested at<br /><em>ERC 2026.</em></h2>
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

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '160px 24px 80px', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>A growing rover programme</p>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(32px, 4.5vw, 56px)', marginBottom: '30px' }}>ONE SERIES. THE NEXT ROVER.</h2>
        <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
          LEAP Rovers is HSM Aries’ evolving family of planetary robotic platforms. LEAP-One is Project 01, the rover that took the series to the ERC 2026 finals in Kraków.
        </p>
        <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
          Leap-2 is Project 02, now in development. Where LEAP-One had to be better, the next rover starts from the scoreboard.
        </p>
        <div className="join-band__actions" style={{ justifyContent: 'center', marginTop: '36px' }}>
          <MagneticLink className="button button--outline" href="/leap-2">Explore Leap-2</MagneticLink>
        </div>
      </section>

      <section aria-labelledby="leap-2-title" className="vehicle-dossier" id="roadmap">
        <header className="vehicle-dossier__header">
          <div>
            <p>LEAP SERIES // PROJECT ROADMAP</p>
            <h2 id="leap-2-title">From <span style={{ whiteSpace: 'nowrap' }}>LEAP-One</span><br /><em>to Leap-2.</em></h2>
          </div>
          <p className="vehicle-dossier__intro">Not the placing we wanted. What the scoreboard says LEAP-One did well—and where Leap-2 has to be better.</p>
        </header>

        <div className="vehicle-dossier__groups">
          <section className="vehicle-dossier__group">
            <header>
              <span>01 // project</span>
              <h3>LEAP-One</h3>
              <p>Competed · ERC 2026 finals, Kraków</p>
            </header>
            <dl>
              <div>
                <dt>Result</dt>
                <dd>17th of 25 · 1492.25 pts</dd>
              </div>
              <div>
                <dt>Documentation</dt>
                <dd>364.25 / 400 · 4th</dd>
              </div>
              <div>
                <dt>Navigation droning</dt>
                <dd>265 / 300 · 6th</dd>
              </div>
              <div>
                <dt>Presentation</dt>
                <dd>229 / 300</dd>
              </div>
              <div>
                <dt>AstroBio</dt>
                <dd>215 / 300</dd>
              </div>
            </dl>
          </section>
          <section className="vehicle-dossier__group">
            <header>
              <span>02 // project</span>
              <h3>Leap-2</h3>
              <p>In development · design phase</p>
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
          <section className="vehicle-dossier__group">
            <header>
              <span>03 // scoreboard</span>
              <h3>What ERC 2026 taught us</h3>
              <p>The tasks that decide the next rover.</p>
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
              <div>
                <dt>Overall</dt>
                <dd>1492.25 / 3000 · 17th of 25</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>

      <RoverViewer />

      <MissionControlShowcase />

      <section style={{ padding: '160px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Core Subsystems</p>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(30px, 4vw, 50px)', margin: 0 }}>FOUR MISSION SYSTEMS</h2>
        </div>
        <MissionSystems />
      </section>

      <section style={{ position: 'relative', height: '80vh', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '80px 0' }}>
        <Image alt="Custom 3D-printed flexible rover wheel" fill sizes="100vw" src="/media/3d-tyre-scaled.jpg" style={{ objectFit: 'cover', opacity: 0.6, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', textAlign: 'center', padding: '0 24px' }}>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: '20px' }}>CUSTOM DRIVETRAIN &amp; 3D TYRES</h2>
          <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
          The passive differential rocker-bogie keeps all six custom TPU wheels in contact over rough terrain. Its 180 mm nominal clearance, 35° slope target and 60 mm obstacle capability are designed for demanding analogue field work.
          </p>
        </div>
      </section>
      
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', maxWidth: '1400px', margin: '160px auto', padding: '0 24px', alignItems: 'center' }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Power Architecture</p>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: '20px' }}>2S2P LiFePO₄ POWER SYSTEM</h2>
          <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
            Four 12.8 V, 30 Ah LiFePO₄ modules are configured in 2S2P to form a 25.6 V, 60 Ah main bus with approximately 1.5 kWh of stored energy.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
            Regulated DC-DC conversion, centralized distribution and a solid-state-relay E-Stop isolate the mobility bus while retaining computation and communications for diagnostics.
          </p>
        </div>
        <div style={{ position: 'relative', height: '450px', width: '100%' }}>
          <Image alt="LiFePO4 battery and motor calibration test bench" fill sizes="50vw" src="/media/testing.jpg" style={{ objectFit: 'cover' }} />
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', maxWidth: '1400px', margin: '0 auto 160px', padding: '0 24px', alignItems: 'center' }}>
        <div style={{ position: 'relative', height: '450px', width: '100%' }}>
          <Image alt="Precision CNC machined aluminum chassis at Boehm facility" fill sizes="50vw" src="/media/boehm-manufacturing-scaled.jpg" style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Industrial Manufacturing</p>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(30px, 4vw, 50px)', marginBottom: '20px' }}>AEROSPACE-GRADE FABRICATION</h2>
          <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
            The lightweight primary structure uses aluminium 3.3535 (5754), with 20×40 mm rocker linkages and a 20×20 mm differential bar. Boehm Group GmbH manufactured the rover base as part of the team’s industrial collaboration.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.5)' }}>
            Every structural component is engineered to withstand high impact shocks, extreme vibration, and Martian thermal cycles.
          </p>
        </div>
      </section>

      <section aria-labelledby="vehicle-dossier-title" className="vehicle-dossier">
        <header className="vehicle-dossier__header">
          <div>
            <p>Engineering data // project 01</p>
            <h2 id="vehicle-dossier-title">Vehicle <em>dossier.</em></h2>
          </div>
          <p className="vehicle-dossier__intro">The LEAP-One configuration that competed at ERC 2026: a field-ready planetary rover platform built for mobility, science and autonomous operation.</p>
          <div className="vehicle-dossier__readout">
            <span>Validated entries</span>
            <strong>{specGroups.reduce((total, group) => total + group.items.length, 0)}</strong>
            <span>Systems baseline</span>
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

      <section className="join-band" style={{ textAlign: 'center', padding: '160px 24px' }}>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '30px' }}>Ready for the next leap?</h2>
        <div className="join-band__actions" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <MagneticLink className="button button--solid" href="/leap-2">Explore Leap-2</MagneticLink>
          <MagneticLink className="button button--outline" href="/join">Join the crew</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner With Aries</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
