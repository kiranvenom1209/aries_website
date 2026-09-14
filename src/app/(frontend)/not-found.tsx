import Link from 'next/link'

import { PageShell } from '@/components/PageShell'

// A fictional lost-signal scene, rendered inside the regular site shell.
// This file cannot export `metadata`, and the catch-all in [...not-found]/page.tsx discards its own
// export the moment it throws notFound(), so a live 404 carries the layout title and Next's injected
// noindex. A distinct 404 title/robots needs `experimental.globalNotFound` in next.config.ts plus
// app/global-not-found.tsx (config package).
export default function NotFound() {
  return (
    <PageShell>
      <section className="lost-signal" aria-labelledby="lost-signal-heading">
        <div className="lost-signal__main">
          <div className="lost-signal__map" role="img" aria-label="404: a rover waits beyond radio contact on a topographic terrain map, with a broken orange signal path to its base station." />
          <div className="lost-signal__content">
            <p className="lost-signal__code"><span aria-hidden="true" />404 / Connection lost</p>
            <h1 id="lost-signal-heading">Base,<br className="lost-signal__desktop-break" />{' '}do you<br /><em>copy?</em></h1>
            <p className="lost-signal__description">Our rover has wandered beyond this address. The page you’re looking for may have moved, or never made it onto the map.</p>
            <nav aria-label="Routes back" className="lost-signal__actions">
              <Link className="button button--solid" href="/">Return to base <span aria-hidden="true">↗</span></Link>
              <Link className="lost-signal__text-link" href="/leap-one">Explore the rovers <span aria-hidden="true">→</span></Link>
            </nav>
            <p className="lost-signal__report">Wrong coordinates? <Link href="/contact">Report a broken link <span aria-hidden="true">↗</span></Link></p>
          </div>
        </div>
        <div className="lost-signal__footer"><span>HSM Aries / Deep field operations</span><span>Some detours are part of exploration.</span></div>
      </section>
    </PageShell>
  )
}
