import Link from 'next/link'
import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = {
  description: 'Your message has been received by the HSM Aries team.',
  robots: { index: false, follow: false },
  title: 'Message received',
}

type FormContext = 'contact' | 'join' | 'partner'

type Outcome = {
  eyebrow: string
  heading: [string, string]
  body: string
  steps: [string, string, string][]
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
}

const outcomes: Record<FormContext, Outcome> = {
  join: {
    eyebrow: 'Crew intake // HSM Aries',
    heading: ['Application received.', 'The department leads have it.'],
    body: 'Your application is with the department you chose. We reply to the address you gave. In the meantime, see who you would be building with.',
    steps: [
      ['01', 'Received', 'Your application is logged with the team inbox.'],
      ['02', 'Routed', 'The lead of your preferred department reads it.'],
      ['03', 'Reply by email', 'We answer at the address you gave and agree a first meeting.'],
    ],
    primary: { href: '/team', label: 'Meet the crew' },
    secondary: { href: '/leap-2', label: 'Explore Leap-2' },
  },
  partner: {
    eyebrow: 'Partnership // HSM Aries',
    heading: ['Enquiry received.', 'A mission lead will reply.'],
    body: 'Your enquiry is with the team. We reply to the address you gave. Leap-2 is in development now; the Leap-2 page shows what the next rover has to change.',
    steps: [
      ['01', 'Received', 'Your enquiry is logged with the team inbox.'],
      ['02', 'Routed', 'The lead responsible for the partnership scope you chose reads it.'],
      ['03', 'Reply by email', 'We answer at the address you gave and propose a first conversation.'],
    ],
    primary: { href: '/leap-2', label: 'Explore Leap-2' },
    secondary: { href: '/leap-one', label: 'LEAP-One dossier' },
  },
  contact: {
    eyebrow: 'Direct dispatch // HSM Aries',
    heading: ['Message received.', 'We have it from here.'],
    body: 'Your message has been received. The relevant lead will reply to the email address you gave.',
    steps: [
      ['01', 'Received', 'Your message is logged with the team inbox.'],
      ['02', 'Routed', 'It goes to the lead who can answer it.'],
      ['03', 'Reply by email', 'We answer at the address you gave.'],
    ],
    primary: { href: '/news', label: 'Mission dispatches' },
    secondary: { href: '/', label: 'Return to HSM Aries' },
  },
}

function resolveContext(value: string | string[] | undefined): FormContext {
  const key = Array.isArray(value) ? value[0] : value
  return key === 'join' || key === 'partner' ? key : 'contact'
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const outcome = outcomes[resolveContext((await searchParams).form)]

  return (
    <PageShell>
      <section className="conversion-form-section conversion-form-section--contact conversion-form-section--thanks" aria-labelledby="thank-you-title">
        <header className="conversion-form-section__header">
          <span className="hero__eyebrow">{outcome.eyebrow}</span>
          <h1 id="thank-you-title">{outcome.heading[0]}<br /><em>{outcome.heading[1]}</em></h1>
          <p>{outcome.body}</p>
          <div className="conversion-form-section__actions">
            <Link className="button button--solid" href={outcome.primary.href}>{outcome.primary.label} <span aria-hidden="true">→</span></Link>
            <Link className="button button--outline" href={outcome.secondary.href}>{outcome.secondary.label} <span aria-hidden="true">→</span></Link>
          </div>
        </header>

        <div className="conversion-track-list" aria-label="What happens next">
          {outcome.steps.map(([number, title, description]) => (
            <article key={number} className="conversion-track">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
