import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { NetlifyForm } from '@/components/NetlifyForm'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'Reach the HSM Aries rover team at Hochschule Schmalkalden for sponsorship, collaboration, press or membership enquiries.',
  image: '/media/og/contact.jpg',
  imageAlt: 'A team member works at a laptop beside the LEAP-One rover at the Space Night exhibition',
  path: '/contact',
  title: 'Contact the team',
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
    detail: 'Find your department and start building alongside the HSM Aries team.',
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
        <Image alt="The HSM Aries crew at the LEAP-One control station in the pit tent at ERC 2026" fill priority sizes="100vw" src="/media/erc-2026-finals-10-control-station-pit-tent.jpg" />
        <div className="conversion-hero__veil" />
        <div className="conversion-hero__scan" />
        <div className="conversion-hero__content">
          <span className="hero__eyebrow">Ground control // HSM Aries</span>
          <p className="conversion-hero__kicker">Choose your channel.</p>
          <h1>Start with a<br /><em>clear signal.</em></h1>
          <p className="conversion-hero__summary">Partnership, recruitment or a general enquiry: pick the route and it reaches the right lead.</p>
          <div className="conversion-hero__metrics" aria-label="Contact facts">
            <span><strong>08</strong>departments</span>
            <span><strong>17/124</strong>Place / registered teams · 25 finalists</span>
            <span><strong>Leap-2</strong>in development</span>
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
              <dt>Next rover</dt>
              <dd>Leap-2 · Project 02 of the LEAP series, in development</dd>
            </div>
            <div>
              <dt>Last mission</dt>
              <dd>LEAP-One · ERC 2026 finals · 17th place · 124 teams entered · 1492.25 pts</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href="mailto:hsmariesleapone@gmail.com">hsmariesleapone@gmail.com</a></dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>Hochschule Schmalkalden<br />Blechhammer 9, 98574 Schmalkalden, Germany</dd>
            </div>
          </dl>
        </header>

        <NetlifyForm className="contact-form conversion-form" name="general-contact" submitLabel="Send message" successContext="contact">
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
        </NetlifyForm>
      </section>
    </PageShell>
  )
}
