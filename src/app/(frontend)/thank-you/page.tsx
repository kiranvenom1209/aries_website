import Link from 'next/link'
import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = {
  description: 'Your message has been delivered to the HSM Aries mission team.',
  robots: { index: false, follow: false },
  title: 'Signal received',
}

export default function ThankYouPage() {
  return (
    <PageShell>
      <main className="conversion-form-section conversion-form-section--contact">
        <header className="conversion-form-section__header">
          <span className="hero__eyebrow">Transmission complete // HSM Aries</span>
          <h1>Signal received.<br /><em>We have it from here.</em></h1>
          <p>Your submission is safely in mission control. The appropriate team member will review it and respond using the email address you provided.</p>
          <Link className="button button--solid" href="/">Return to HSM Aries <span aria-hidden="true">→</span></Link>
        </header>
      </main>
    </PageShell>
  )
}
