import Image from 'next/image'
import type { Metadata } from 'next'

import { CustomSelect } from '@/components/CustomSelect'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = {
  description: 'Partner with HSM Aries to support student-built planetary rovers, advance aerospace robotics, and connect with top engineering talent.',
  title: 'Partner with Aries',
}

const partnershipTracks = [
  ['01', 'Fund the mission', 'Put resources directly into development, field testing and ERC readiness.'],
  ['02', 'Supply the capability', 'Place hardware, tooling and specialist manufacturing in the hands of the crew.'],
  ['03', 'Grow future engineers', 'Work alongside ambitious student engineers on a live planetary robotics programme.'],
]

export default function PartnerPage() {
  return (
    <PageShell>
      <section className="conversion-hero conversion-hero--partner">
        <Image alt="HSM Aries presenting its rover work to an industry audience" fill priority sizes="100vw" src="/media/pitching-in-boehm-scaled.jpg" />
        <div className="conversion-hero__veil" />
        <div className="conversion-hero__scan" />
        <div className="conversion-hero__content">
          <span className="hero__eyebrow">Industry partnership // HSM Aries</span>
          <p className="conversion-hero__kicker">A direct line to the workshop.</p>
          <h1>Back the mission.<br /><em>Build the future.</em></h1>
          <p className="conversion-hero__summary">A partnership with HSM Aries puts your technology, expertise or support at the centre of a student-built planetary robotics programme.</p>
          <div className="conversion-hero__metrics" aria-label="Partnership highlights">
            <span><strong>#01</strong>ERC 2026 qualification</span>
            <span><strong>25</strong>crew &amp; advisors</span>
            <span><strong>01</strong>live rover programme</span>
          </div>
        </div>
      </section>

      <section className="conversion-desk conversion-desk--partner" aria-labelledby="partner-case-title">
        <div className="conversion-desk__intro">
          <span className="hero__eyebrow">Partnership // prospectus</span>
          <h2 id="partner-case-title">Make a visible<br /><em>contribution.</em></h2>
          <p>HSM Aries combines student ambition with industrial-grade engineering rigour. Your support directly accelerates rover development, testing campaigns and competition readiness.</p>
          <dl className="conversion-facts">
            <div>
              <dt>Worldwide ranking</dt>
              <dd>#1 worldwide ERC qualification 2026 — 239.75 points across 124 international teams.</dd>
            </div>
            <div>
              <dt>Institution</dt>
              <dd>Hochschule Schmalkalden University of Applied Sciences<br />Blechhammer 9, 98574 Schmalkalden, Germany</dd>
            </div>
          </dl>
        </div>

        <div className="conversion-track-list" aria-label="Ways to collaborate">
          {partnershipTracks.map(([number, title, description]) => (
            <article key={number} className="conversion-track">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="conversion-form-section conversion-form-section--partner" aria-labelledby="partner-form-title">
        <header className="conversion-form-section__header">
          <span className="hero__eyebrow">Start a conversation</span>
          <h2 id="partner-form-title">Open a partnership<br /><em>channel.</em></h2>
          <p>Tell us what you would like to build with the team. We will route your enquiry to the relevant mission lead.</p>
          <a className="conversion-form-section__direct" href="mailto:hsmariesleapone@gmail.com">hsmariesleapone@gmail.com <span aria-hidden="true">↗</span></a>
        </header>

        <form action="mailto:hsmariesleapone@gmail.com?subject=Partnership%20Inquiry%20-%20HSM%20Aries" className="contact-form conversion-form" encType="text/plain" method="post">
          <div>
            <label htmlFor="partner-first-name">Contact first name</label>
            <input autoComplete="given-name" id="partner-first-name" name="first-name" required />
          </div>
          <div>
            <label htmlFor="partner-surname">Contact surname</label>
            <input autoComplete="family-name" id="partner-surname" name="surname" required />
          </div>
          <div>
            <label htmlFor="partner-company">Company / organization</label>
            <input autoComplete="organization" id="partner-company" name="company" required />
          </div>
          <div>
            <label htmlFor="partner-email">Corporate email</label>
            <input autoComplete="email" id="partner-email" name="email" required type="email" />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="partner-scope">Partnership scope</label>
            <CustomSelect
              defaultValue="Financial Mission Sponsorship"
              id="partner-scope"
              name="partnership-scope"
              options={[
                { label: 'Financial Mission Sponsorship', value: 'Financial Mission Sponsorship', detail: 'ERC 2026 competition & logistics campaign' },
                { label: 'Hardware & Component Donation', value: 'Hardware & Component Donation', detail: 'Motors, LiDAR, cameras, batteries and encoders' },
                { label: 'Tooling & Manufacturing Support', value: 'Tooling & Manufacturing Support', detail: 'CNC machining, 3D printing, carbon fibre and anodizing' },
                { label: 'Software & Compute Partner', value: 'Software & Compute Partner', detail: 'Edge AI, simulation and ROS 2 cloud infrastructure' },
                { label: 'Research Collaboration & Mentorship', value: 'Research Collaboration & Mentorship', detail: 'Academic / industry technical mentorship' },
                { label: 'General Sponsorship & Media', value: 'General Sponsorship & Media', detail: 'Press, exhibition and promotional partner' },
              ]}
              required
            />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="partner-message">Partnership proposal / enquiry details</label>
            <textarea id="partner-message" name="message" placeholder="Describe the collaboration, sponsorship or equipment you have in mind — and any useful timing." required rows={5} />
          </div>
          <button className="button button--solid" type="submit">Submit partnership enquiry <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </PageShell>
  )
}
