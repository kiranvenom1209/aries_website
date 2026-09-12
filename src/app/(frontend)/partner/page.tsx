import Image from 'next/image'
import type { Metadata } from 'next'

import { CustomSelect } from '@/components/CustomSelect'
import { NetlifyForm } from '@/components/NetlifyForm'
import { PageShell } from '@/components/PageShell'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'Sponsor or partner with HSM Aries: fund the Leap-2 build, supply hardware and manufacturing, and work with student engineers on a planetary rover programme.',
  image: '/media/og/partner.jpg',
  imageAlt: 'LEAP-One with its sponsor panel and the German flag on the grass at the ERC 2026 finals',
  path: '/partner',
  title: 'Partnerships & sponsorship',
})

const partnershipTracks = [
  ['01', 'Fund the mission', 'Put resources directly into the Leap-2 build, field testing and the next competition campaign.'],
  ['02', 'Supply the capability', 'Place hardware, tooling and specialist manufacturing in the hands of the crew.'],
  ['03', 'Grow future engineers', 'Work alongside ambitious student engineers on a live planetary robotics programme.'],
]

export default function PartnerPage() {
  return (
    <PageShell>
      <section className="conversion-hero conversion-hero--partner">
        <Image alt="LEAP-One on the grass at ERC 2026 in Kraków, sponsor decals on the chassis side panel" fill priority sizes="100vw" src="/media/erc-2026-finals-24-sponsor-panel-low-angle.jpg" />
        <div className="conversion-hero__veil" />
        <div className="conversion-hero__scan" />
        <div className="conversion-hero__content">
          <span className="hero__eyebrow">Industry partnership // HSM Aries</span>
          <p className="conversion-hero__kicker">A direct line to the workshop.</p>
          <h1>Back the mission.<br /><em>Build the next rover.</em></h1>
          <p className="conversion-hero__summary">LEAP-One carried its partners' names to the ERC 2026 finals. <span className="conversion-hero__nobreak">Leap-2</span> is on the drawing board now.</p>
          <div className="conversion-hero__metrics" aria-label="Partnership facts">
            <span><strong>17/124</strong>Place / registered teams · 25 finalists</span>
            <span><strong>1492.25</strong>finals points</span>
            <span><strong>Leap-2</strong>in development</span>
          </div>
        </div>
      </section>

      <section className="conversion-desk conversion-desk--partner" aria-labelledby="partner-case-title">
        <div className="conversion-desk__intro">
          <span className="hero__eyebrow">Partnership // prospectus</span>
          <h2 id="partner-case-title">Make a visible<br /><em>contribution.</em></h2>
          <p>Leap-2 is being designed around what the ERC 2026 finals exposed: a mass score of −22 on a 200-point line beside a 4th-place documentation score. Mass is decided in the design phase, by materials, machining and the budget behind them. That is where a partner's hardware, tooling or funding shows on the vehicle rather than on a decal.</p>
          <dl className="conversion-facts">
            <div>
              <dt>ERC 2026 record</dt>
              <dd>17th place at our first ERC finals, from a starting field of 124 registered teams; 25 qualified for Kraków. We earned 1492.25 points, placing 4th in documentation and 6th in navigation droning. Built without major sponsorship, with valued support from our partners. Help us take the next step with Leap-2.</dd>
            </div>
            <div>
              <dt>Next rover</dt>
              <dd>Leap-2 · Project 02 of the LEAP series, in development</dd>
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
          <p className="conversion-form-section__direct-label">Direct line · team inbox</p>
          <a className="conversion-form-section__direct" href="mailto:hsmariesleapone@gmail.com">hsmariesleapone@gmail.com <span aria-hidden="true">↗</span></a>
        </header>

        <NetlifyForm className="contact-form conversion-form" name="partnership-enquiry" submitLabel="Send enquiry" successContext="partner">
          <div>
            <label htmlFor="partner-first-name">Contact first name</label>
            <input autoComplete="given-name" id="partner-first-name" name="first-name" required />
          </div>
          <div>
            <label htmlFor="partner-surname">Contact surname</label>
            <input autoComplete="family-name" id="partner-surname" name="surname" required />
          </div>
          <div>
            <label htmlFor="partner-company">Company / organisation</label>
            <input autoComplete="organization" id="partner-company" name="company" required />
          </div>
          <div>
            <label htmlFor="partner-email">Corporate email</label>
            <input autoComplete="email" id="partner-email" name="email" required type="email" />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="partner-scope" id="partner-scope-label">Partnership scope</label>
            <CustomSelect
              id="partner-scope"
              name="partnership-scope"
              options={[
                { label: 'Financial Mission Sponsorship', value: 'Financial Mission Sponsorship', detail: 'Leap-2 build & next competition campaign' },
                { label: 'Hardware & Component Donation', value: 'Hardware & Component Donation', detail: 'Motors, LiDAR, cameras, batteries and encoders' },
                { label: 'Tooling & Manufacturing Support', value: 'Tooling & Manufacturing Support', detail: 'CNC machining, 3D printing, carbon fibre and anodizing' },
                { label: 'Software & Compute Partner', value: 'Software & Compute Partner', detail: 'Edge AI, simulation and ROS 2 cloud infrastructure' },
                { label: 'Research Collaboration & Mentorship', value: 'Research Collaboration & Mentorship', detail: 'Academic / industry technical mentorship' },
                { label: 'General Sponsorship & Media', value: 'General Sponsorship & Media', detail: 'Press, exhibition and promotional partner' },
              ]}
              placeholder="Select the kind of partnership"
              required
            />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="partner-message">Partnership proposal / enquiry details</label>
            <textarea id="partner-message" name="message" placeholder="Describe the collaboration, sponsorship or equipment you have in mind — and any useful timing." required rows={5} />
          </div>
        </NetlifyForm>
      </section>
    </PageShell>
  )
}
