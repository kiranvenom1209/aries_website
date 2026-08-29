import type { Metadata } from 'next'

import { GalleryRail } from '@/components/GalleryRail'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = {
  description: 'Field tests, engineering work and life behind the scenes with HSM Aries.',
  title: 'Gallery',
}

export default function GalleryPage() {
  return (
    <PageShell>
      <section className="editorial-hero">
        <div>
          <span className="hero__eyebrow">HSM ARIES // FIELD RECONNAISSANCE</span>
          <h1>Tested in the field.</h1>
          <p>Field tests, engineering work and life behind the scenes with HSM Aries.</p>
        </div>
      </section>
      <section className="gallery-index">
        <GalleryRail expanded />
      </section>
    </PageShell>
  )
}

