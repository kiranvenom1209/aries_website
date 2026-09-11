import Image from 'next/image'
import Link from 'next/link'

import { PageShell } from '@/components/PageShell'

// Same visual chassis as /login: a real ERC 2026 photo full-bleed behind a left-to-right shade,
// the site nav on top, a mono eyebrow, the display heading and a compact rail of routes back.
// This file cannot export `metadata`, and the catch-all in [...not-found]/page.tsx discards its own
// export the moment it throws notFound(), so a live 404 carries the layout title and Next's injected
// noindex. A distinct 404 title/robots needs `experimental.globalNotFound` in next.config.ts plus
// app/global-not-found.tsx (config package).
export default function NotFound() {
  return (
    <PageShell>
      <section className="not-found">
        <div aria-hidden="true" className="not-found__photo">
          <Image alt="" fill priority sizes="100vw" src="/media/erc-2026-finals-03-mars-yard-morning.jpg" />
        </div>
        <div aria-hidden="true" className="not-found__shade" />
        <div aria-hidden="true" className="not-found__marks">
          <span>SMK 50.7147° N 10.4657° E</span><span>KRK 50.0647° N 19.9450° E</span>
        </div>
        <div className="not-found__content">
          <span className="hero__eyebrow">Error 404 // No signal at this address</span>
          <h1>Nothing here.<br /><em>The rover is elsewhere.</em></h1>
          <p>The link is outdated or mistyped; the team, the ERC 2026 finals and the Leap-2 programme are all one step away.</p>
          <nav aria-label="Routes back" className="not-found__rail">
            <Link className="button button--solid" href="/">Return to HSM Aries <span aria-hidden="true">→</span></Link>
            <Link className="button button--outline" href="/leap-one">LEAP-One dossier</Link>
            <Link className="button button--outline" href="/leap-2">Explore Leap-2</Link>
            <Link className="button button--outline" href="/contact">Report a broken link</Link>
          </nav>
        </div>
      </section>
    </PageShell>
  )
}
