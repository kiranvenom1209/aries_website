import type { Metadata } from 'next'

import { GalleryRail } from '@/components/GalleryRail'
import { PageShell } from '@/components/PageShell'
import { getGalleryImages } from '@/lib/gallery.server'
import { pageMetadata, serializeJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'Explore the complete field-test, engineering, outreach and behind-the-scenes image archive from the HSM Aries space robotics programme.',
  image: '/media/DSC02769-scaled.jpg',
  path: '/gallery',
  title: 'Field Gallery',
})

export default async function GalleryPage() {
  const images = await getGalleryImages()
  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    description: 'Field tests, engineering work and life behind the scenes with HSM Aries.',
    image: images.map((image) => ({
      '@type': 'ImageObject',
      caption: image.alt,
      contentUrl: new URL(image.src, 'https://hsmaries.space').toString(),
    })),
    name: 'HSM Aries Field Gallery',
    url: 'https://hsmaries.space/gallery',
  }

  return (
    <PageShell>
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(galleryJsonLd) }}
        type="application/ld+json"
      />
      <section className="editorial-hero">
        <div>
          <span className="hero__eyebrow">HSM ARIES // FIELD RECONNAISSANCE</span>
          <h1>Tested in the field.</h1>
          <p>Field tests, engineering work and life behind the scenes with HSM Aries.</p>
        </div>
      </section>
      <section className="gallery-index">
        <GalleryRail expanded images={images} />
      </section>
    </PageShell>
  )
}
