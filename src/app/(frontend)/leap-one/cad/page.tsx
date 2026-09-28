import type { Metadata } from 'next'
import Link from 'next/link'

import { CadViewer } from '@/components/cad/CadViewer'
import { CAD_MODEL_BYTES, CAD_MODEL_URL } from '@/components/cad/cadTypes'
import { JsonLd } from '@/components/JsonLd'
import { PageShell } from '@/components/PageShell'
import { specGroups } from '@/lib/leapOneSpecs'
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, SITE_URL, webPageJsonLd } from '@/lib/seo'

const DESCRIPTION =
  'Explore the LEAP-One rover CAD assembly in 3D on a Mars yard: orbit, explode all 500+ parts, switch to X-ray or blueprint view and read part names from the team’s Onshape model.'

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  image: '/media/og/leap-one.jpg',
  imageAlt: 'LEAP-One on the Mars yard at the ERC 2026 finals in Kraków',
  path: '/leap-one/cad',
  title: 'LEAP-One CAD viewer',
})

const modelJsonLd = {
  '@context': 'https://schema.org',
  '@type': '3DModel',
  creator: { '@id': `${SITE_URL}/#organization` },
  description: 'CAD assembly of the LEAP-One planetary rover by HSM Aries, exported from Onshape and compressed for the web.',
  encoding: {
    '@type': 'MediaObject',
    contentSize: `${(CAD_MODEL_BYTES / 1_000_000).toFixed(1)} MB`,
    contentUrl: absoluteUrl(CAD_MODEL_URL),
    encodingFormat: 'model/gltf-binary',
  },
  isPartOf: { '@id': `${absoluteUrl('/leap-one/cad')}#webpage` },
  name: 'LEAP-One rover CAD assembly',
}

const HOW_TO = [
  ['Orbit', 'Drag with one finger or the mouse.'],
  ['Zoom', 'Scroll, or pinch on a touch screen.'],
  ['Pan', 'Right-drag, or drag with two fingers.'],
  ['Inspect', 'Hover or tap a component to read its name.'],
]

export default function CadPage() {
  return (
    <PageShell>
      <JsonLd data={webPageJsonLd({ description: DESCRIPTION, name: 'LEAP-One CAD viewer', path: '/leap-one/cad' })} />
      <JsonLd data={modelJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'LEAP-One', path: '/leap-one' }, { name: 'CAD viewer' }])} />

      <section aria-labelledby="cad-title" className="cad-page">
        <header className="cad-page__header">
          <div>
            <span className="hero__eyebrow">LEAP-One // CAD model · Project 01</span>
            <h1 id="cad-title">
              Take it <em>apart.</em>
            </h1>
          </div>
          <p>
            The rover as the team designed it — every bracket, bearing and board of the latest CAD revision, parked on a
            Mars yard at dusk. Explode the assembly, see through the hull, or trace it in blueprint.
          </p>
        </header>
        <CadViewer />
      </section>

      <section aria-labelledby="cad-about-title" className="cad-about">
        <div className="cad-about__intro">
          <span className="section-label" data-section-label="About the model / 01">
            About the model / 01
          </span>
          <h2 id="cad-about-title">
            From Onshape <em>to your browser.</em>
          </h2>
          <p>
            This is the full LEAP-One assembly exported from the team’s Onshape workspace — the same file the path-traced
            turntable on the <Link href="/leap-one">LEAP-One page</Link> is rendered from. For the web it is compressed
            with meshoptimizer, from 45.8 MB to {(CAD_MODEL_BYTES / 1_000_000).toFixed(1)} MB, without visibly changing
            the geometry. Colours and materials come from the CAD model; the Mars yard around it is generated in your
            browser, and X-ray and blueprint move the rover onto a dark inspection grid.
          </p>
          <dl className="cad-about__how">
            {HOW_TO.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="cad-about__specs">
          {specGroups.map((group) => (
            <article className="cad-spec" key={group.code}>
              <header>
                <span>{group.code}</span>
                <h3>{group.title}</h3>
              </header>
              <dl>
                {group.items.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
          <p className="cad-about__note">
            Specifications of the ERC 2026 competition build, as published on the LEAP-One page. Estimates and design
            targets are marked.
          </p>
          <div className="cad-about__actions">
            <Link className="button button--solid" href="/leap-one">
              LEAP-One dossier <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button--outline" href="/press">
              Press kit <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
