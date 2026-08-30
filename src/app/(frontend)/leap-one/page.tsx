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
  description: 'Explore LEAP Rovers, HSM Aries’ evolving planetary rover series, beginning with LEAP-One: the field-ready Project 01 platform.',
  image: '/media/leap-one-hero-cinematic-v2.png',
  path: '/leap-one',
  title: 'LEAP Rovers — LEAP-One / Project 01',
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
        <Image alt="LEAP-One rover on a blue-hour planetary test landscape" fill priority sizes="100vw" src="/media/leap-one-hero-cinematic-v2.png" style={{ objectFit: 'cover' }} />
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
          <h1>LEAP Rovers.<br />Beginning with LEAP-One.</h1>
        </div>
      </section>

      <section aria-labelledby="leap-stats-title" className="leap-stats">
        <div className="leap-stats__intro">
          <p>PROJECT 01 / MISSION BASELINE</p>
          <h2 id="leap-stats-title">Built to<br /><em>go farther.</em></h2>
        </div>
        <div className="leap-stats__item">
          <p>Mobility</p>
          <strong>6×</strong>
          <span>Independent BLDC drive modules</span>
        </div>
        <div className="leap-stats__item">
          <p>Energy</p>
          <strong>1.5 <small>kWh</small></strong>
          <span>25.6 V LiFePO₄ power architecture</span>
        </div>
        <div className="leap-stats__item">
          <p>Science</p>
          <strong>≥300 <small>mm</small></strong>
          <span>Coaxial auger sampling depth</span>
        </div>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '160px 24px 80px', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>A growing rover programme</p>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'clamp(32px, 4.5vw, 56px)', marginBottom: '30px' }}>ONE SERIES. FIRST ROVER.</h2>
        <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
          LEAP Rovers is HSM Aries’ evolving family of planetary robotic platforms. LEAP-One is its inaugural rover: Project 01, built to establish the technical foundation for the missions and machines that follow.
        </p>
        <p style={{ fontSize: '20px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
          Its six independent Botwheel BLDC modules, differential rocker-bogie and 25.6 V LiFePO₄ power bus unite mobility, sensing, manipulation and deep sampling in one field-ready machine—an architecture designed to inform the next leap.
        </p>
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
          <p className="vehicle-dossier__intro">The verified integration baseline for LEAP-One: a field-ready planetary rover platform built for mobility, science and autonomous operation.</p>
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
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '30px' }}>Ready to explore the mission?</h2>
        <div className="join-band__actions" style={{ justifyContent: 'center' }}>
          <MagneticLink className="button button--outline" href="/team">Meet The Team</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner With Aries</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
