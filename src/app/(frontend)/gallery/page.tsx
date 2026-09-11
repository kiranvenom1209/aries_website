import type { Metadata } from 'next'

import { GalleryRail } from '@/components/GalleryRail'
import { PageShell } from '@/components/PageShell'
import { getGalleryImages } from '@/lib/gallery.server'
import { absoluteUrl, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'The HSM Aries photo archive: LEAP-One at the ERC 2026 finals in Kraków, field tests, workshop builds, presentations and outreach at Hochschule Schmalkalden.',
  image: '/media/og/gallery.jpg',
  imageAlt: 'The crew around the control-station monitor in the pit tent at the ERC 2026 finals',
  path: '/gallery',
  title: 'Field gallery',
})

export default async function GalleryPage() {
  const images = await getGalleryImages()
  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    description: 'Field tests, rebuilds, presentations and the Mars yard at the ERC 2026 finals in Kraków: the HSM Aries programme as it happened, newest first.',
    image: images.map((image) => ({
      '@type': 'ImageObject',
      caption: image.alt,
      contentUrl: absoluteUrl(image.src),
    })),
    name: 'HSM Aries field gallery',
    url: absoluteUrl('/gallery'),
  }

  return (
    <PageShell>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(galleryJsonLd) }}
        type="application/ld+json"
      />
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <span className="hero__eyebrow">HSM ARIES // FIELD RECONNAISSANCE</span>
          <h1>Tested in the field.</h1>
          <p>Field tests, rebuilds, presentations and the Mars yard at the ERC 2026 finals in Kraków — the HSM Aries programme as it happened, newest first.</p>
        </div>
        <div className="editorial-hero__archive" aria-label={`${images.length} photographs in the field archive`}>
          <span>Field archive</span>
          <strong>{String(images.length).padStart(2, '0')}</strong>
          <p>Frames from the ERC 2026 finals in Kraków back to the first team photo in Schmalkalden.</p>
        </div>
      </section>
      <section className="gallery-index">
        <GalleryRail expanded images={images} />
      </section>
    </PageShell>
  )
}
