import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { NetlifyForm } from '@/components/NetlifyForm'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'Contact HSM Aries for collaboration, project information or team membership.',
  image: '/media/space-night-exhibit.jpg',
  path: '/contact',
  title: 'Contact',
})

const routes = [
  {
    code: '01',
    href: '/partner',
    label: 'Industry & sponsorship',
    detail: 'Support the rover programme with expertise, equipment, manufacturing or funding.',
  },
  {
    code: '02',
    href: '/join',
    label: 'Join the crew',
    detail: 'Find your division and start building alongside the HSM Aries team.',
  },
  {
    code: '03',
    href: '#contact-dispatch',
    label: 'General mission enquiry',
    detail: 'Ask about HSM Aries, the LEAP rover series, outreach or collaboration.',
  },
]

export default function ContactPage() {
  return (
    <PageShell>
      <section className="conversion-hero conversion-hero--contact">
        <Image alt="HSM Aries rover undergoing a laboratory test" fill priority sizes="100vw" src="/media/cleanroom-lab.jpg" />
        <div className="conversion-hero__veil" />
        <div className="conversion-hero__scan" />
        <div className="conversion-hero__content">
          <span className="hero__eyebrow">Ground control // HSM Aries</span>
          <p className="conversion-hero__kicker">Choose your channel.</p>
          <h1>Start with a<br /><em>clear signal.</em></h1>
          <p className="conversion-hero__summary">Whether you are looking to partner, join or simply get in touch, this is the right place to reach the HSM Aries mission team.</p>
          <div className="conversion-hero__metrics" aria-label="Contact details">
            <span><strong>HSM</strong>Schmalkalden, Germany</span>
            <span><strong>LEAP</strong>rover series</span>
            <span><strong>24/7</strong>mission-minded</span>
          </div>
        </div>
      </section>

      <section className="contact-router" aria-labelledby="contact-routes-title">
        <header className="contact-router__header">
          <span className="hero__eyebrow">Mission routing</span>
          <h2 id="contact-routes-title">Send it to the<br /><em>right team.</em></h2>
        </header>
        <div className="contact-router__routes">
          {routes.map((route) => (
            <Link key={route.code} className="contact-route" href={route.href}>
              <span className="contact-route__code">{route.code}</span>
              <div>
                <h3>{route.label}</h3>
                <p>{route.detail}</p>
              </div>
              <span className="contact-route__arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="conversion-form-section conversion-form-section--contact" id="contact-dispatch" aria-labelledby="contact-form-title">
        <header className="conversion-form-section__header">
          <span className="hero__eyebrow">Direct dispatch</span>
          <h2 id="contact-form-title">Send your<br /><em>message.</em></h2>
          <p>For anything that does not fit a dedicated route, use the direct channel. The right person will pick it up.</p>
          <dl className="conversion-facts conversion-facts--compact">
            <div>
              <dt>Initiative</dt>
              <dd>HSM Aries Space Robotics<br />Chair of Drive, Automation, and Robotics Technologies</dd>
            </div>
            <div>
              <dt>Current project</dt>
              <dd>LEAP-One · project 01 in the LEAP rover series</dd>
            </div>
            <div>
              <dt>Headquarters</dt>
              <dd>Hochschule Schmalkalden<br />Blechhammer 9, 98574 Schmalkalden, Germany</dd>
            </div>
          </dl>
        </header>

        <NetlifyForm className="contact-form conversion-form" name="general-contact" successContext="contact">
          <div>
            <label htmlFor="first-name">First name</label>
            <input autoComplete="given-name" id="first-name" name="first-name" required />
          </div>
          <div>
            <label htmlFor="surname">Surname</label>
            <input autoComplete="family-name" id="surname" name="surname" required />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="contact-email">Email</label>
            <input autoComplete="email" id="contact-email" name="email" required type="email" />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="What would you like to discuss with HSM Aries?" required rows={6} />
          </div>
          <button className="button button--solid" type="submit">Send message <span aria-hidden="true">→</span></button>
        </NetlifyForm>
      </section>
    </PageShell>
  )
}
