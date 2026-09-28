import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BrandLogoStage, type BrandLogo } from '@/components/BrandLogoStage'
import { CopyButton } from '@/components/CopyButton'
import { JsonLd } from '@/components/JsonLd'
import { PageShell } from '@/components/PageShell'
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo'

const DESCRIPTION =
  'HSM Aries brand assets: wordmarks, the falcon mark, the LEAP-One mission badge and department patches, typography and colour values, with usage rules and downloads.'

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  path: '/brand',
  title: 'Brand assets',
})

const LOGOS: BrandLogo[] = [
  {
    alt: 'HSM Aries white wordmark',
    dimensions: '1024 × 269',
    download: 'HSM-Aries-wordmark-white.png',
    file: '/media/aries-logo-white.png',
    height: 269,
    id: 'wordmark-white',
    name: 'Wordmark — white',
    use: 'Dark backgrounds, photography, colour',
    width: 1024,
  },
  {
    alt: 'HSM Aries gradient wordmark',
    dimensions: '2560 × 672',
    download: 'HSM-Aries-wordmark-gradient.png',
    file: '/media/aries-logoo.png',
    height: 672,
    id: 'wordmark-gradient',
    name: 'Wordmark — gradient',
    use: 'Light backgrounds and documents',
    width: 2560,
  },
  {
    alt: 'HSM Aries falcon mark',
    dimensions: '692 × 688',
    download: 'HSM-Aries-falcon-mark.png',
    file: '/media/falcon.png',
    height: 688,
    id: 'falcon',
    name: 'Falcon mark',
    use: 'Avatars, favicons, stickers',
    width: 692,
  },
  {
    alt: 'LEAP-One mission badge',
    dimensions: '2040 × 2048',
    download: 'HSM-Aries-LEAP-One-mission-badge.png',
    file: '/media/leapone.png',
    height: 2048,
    id: 'badge',
    name: 'LEAP-One mission badge',
    use: 'LEAP-One programme material',
    width: 2040,
  },
]

const PATCHES = [
  { download: 'HSM-Aries-Patch-Mechanical.png', file: '/media/l1-mech-crop.png', name: 'Mechanical' },
  { download: 'HSM-Aries-Patch-Electrical.png', file: '/media/l1-electric-crop.png', name: 'Electrical' },
  { download: 'HSM-Aries-Patch-Software.png', file: '/media/l1-software-crop.png', name: 'Software & Navigation' },
  { download: 'HSM-Aries-Patch-Communication.png', file: '/media/l1-comm-crop.png', name: 'Communication' },
  { download: 'HSM-Aries-Patch-Drill.png', file: '/media/l1-drill-arm-crop.png', name: 'Drill & Manipulator' },
  { download: 'HSM-Aries-Patch-Science.png', file: '/media/l1-science-crop.png', name: 'Scientific Payload' },
  // AQUILA, the UAV built with HSM Zenith, replaced the original Astroflight patch (as on /team).
  { download: 'HSM-Aries-Patch-Astroflight-AQUILA.png', file: '/media/aquila-leapone.png', name: 'Astroflight · AQUILA' },
  { download: 'HSM-Aries-Patch-MRO.png', file: '/media/l1_mro-1.png', name: 'Mission Resources & Outreach' },
]

const TYPE = [
  {
    family: 'Space Grotesk',
    role: 'Display',
    sample: 'Six wheels, one arm, one drill.',
    specimenClass: 'brand-type__sample--display',
    detail: 'Headlines, numbers, buttons · 400–700 · tight tracking',
  },
  {
    family: 'Inter',
    role: 'Text',
    sample: 'LEAP-One integrates six-wheel mobility, autonomous navigation and deep-sampling science on one research platform.',
    specimenClass: 'brand-type__sample--text',
    detail: 'Body copy and interface · 400–600',
  },
  {
    family: 'System monospace',
    role: 'Telemetry',
    sample: 'MISSION READY // AZ 042° · EL 18°',
    specimenClass: 'brand-type__sample--mono',
    detail: 'Labels, eyebrows, readouts · uppercase · wide tracking',
  },
]

const PALETTES = [
  {
    code: '01',
    name: 'Web interface',
    note: 'The palette of hsmaries.space: near-black surfaces, one orange signal colour.',
    colours: [
      { hex: '#FF5A1F', name: 'Ignition Orange' },
      { hex: '#FF7A45', name: 'Flare' },
      { hex: '#050607', name: 'Void' },
      { hex: '#090C0E', name: 'Hull' },
      { hex: '#11161A', name: 'Panel' },
      { hex: '#9AA4AA', name: 'Regolith' },
      { hex: '#F5F7F8', name: 'Starlight' },
    ],
  },
  {
    code: '02',
    name: 'Identity gradient',
    note: 'The gradient of the wordmark and the falcon mark.',
    colours: [
      { hex: '#4A1F5C', name: 'Nebula Purple' },
      { hex: '#A23A86', name: 'Orbit Magenta' },
      { hex: '#E35C9A', name: 'Stellar Rose' },
    ],
  },
  {
    code: '03',
    name: 'Mission patches',
    note: 'The navy, teal, orange and red of the LEAP-One badge and department patches.',
    colours: [
      { hex: '#041225', name: 'Abyssal Navy' },
      { hex: '#114D62', name: 'Triton Teal' },
      { hex: '#FE9C3D', name: 'Aries Orange' },
      { hex: '#942B21', name: 'Signal Red' },
    ],
  },
]

const RULES = {
  do: [
    'Scale the logo proportionally.',
    'Keep clear space around it at least the height of the “A”.',
    'Use the white wordmark on dark, photographic or coloured backgrounds.',
    'Use the gradient wordmark on light backgrounds and documents.',
  ],
  dont: [
    'Stretch, skew, rotate or outline the logo.',
    'Recolour the wordmark or rebuild it in another typeface.',
    'Place the white wordmark on light backgrounds.',
    'Add effects such as shadows, glows or bevels.',
  ],
}

const NAV = [
  ['01', 'Logos', '#logos'],
  ['02', 'Patches', '#patches'],
  ['03', 'Type', '#type'],
  ['04', 'Colour', '#colour'],
  ['05', 'Usage', '#usage'],
]

export default function BrandPage() {
  return (
    <PageShell>
      <JsonLd data={webPageJsonLd({ description: DESCRIPTION, name: 'Brand assets', path: '/brand' })} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Brand assets' }])} />

      <header className="resource-hero">
        <div className="resource-hero__inner">
          <div>
            <span className="hero__eyebrow">Resources // Brand assets</span>
            <h1>
              Brand
              <br />
              <em>assets.</em>
            </h1>
            <p className="resource-hero__lead">
              Logos, mission patches, type and colour for anyone writing, designing or presenting with HSM Aries —
              partners, press, event organisers and the crew itself.
            </p>
            <div className="resource-hero__actions">
              <a className="button button--solid" href="#logos">
                Get the logos <span aria-hidden="true">↓</span>
              </a>
              <Link className="button button--outline" href="/press">
                Press kit <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="resource-hero__visual">
            <Image alt="" height={688} priority sizes="(max-width: 1080px) 60vw, 320px" src="/media/falcon.png" width={692} />
          </div>
        </div>
      </header>

      <nav aria-label="Brand sections" className="resource-nav">
        {NAV.map(([code, label, href]) => (
          <a href={href} key={href}>
            <span>{code}</span>
            {label}
          </a>
        ))}
      </nav>

      <section aria-labelledby="logos-title" className="resource-section" id="logos">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Logos / 01">
              Logos / 01
            </span>
            <h2 id="logos-title">
              One mark, <em>four forms.</em>
            </h2>
          </div>
          <p>
            Pick a version and a surface to see whether they belong together. Every file downloads as a transparent PNG at
            full resolution.
          </p>
        </header>
        <BrandLogoStage logos={LOGOS} />
      </section>

      <section aria-labelledby="patches-title" className="resource-section" id="patches">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Mission patches / 02">
              Mission patches / 02
            </span>
            <h2 id="patches-title">
              Eight departments, <em>one mission.</em>
            </h2>
          </div>
          <p>
            Each LEAP-One department carries its own patch. Use them for department pages, slides, stickers and merchandise
            about that team.
          </p>
        </header>
        <ul className="brand-patches">
          {PATCHES.map((patch) => (
            <li className="brand-patch" key={patch.file}>
              <div className="brand-patch__art">
                <Image alt={`${patch.name} department patch`} fill sizes="(max-width: 700px) 45vw, 260px" src={patch.file} />
              </div>
              <div className="brand-patch__meta">
                <strong>{patch.name}</strong>
                <a className="resource-download" download={patch.download} href={patch.file}>
                  PNG
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="type-title" className="resource-section" id="type">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Typography / 03">
              Typography / 03
            </span>
            <h2 id="type-title">
              Set in <em>two families.</em>
            </h2>
          </div>
          <p>
            Space Grotesk and Inter are open-source (SIL Open Font License) and free to install. The monospace readouts use
            the system’s own monospace font.
          </p>
        </header>
        <div className="brand-type">
          {TYPE.map((face) => (
            <article className="brand-type__card" key={face.family}>
              <header>
                <span>{face.role}</span>
                <strong>{face.family}</strong>
              </header>
              <p className={`brand-type__sample ${face.specimenClass}`}>{face.sample}</p>
              <small>{face.detail}</small>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="colour-title" className="resource-section" id="colour">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Colour / 04">
              Colour / 04
            </span>
            <h2 id="colour-title">
              Colour, <em>by the value.</em>
            </h2>
          </div>
          <p>Select a swatch to copy its hex value.</p>
        </header>
        <div className="brand-palettes">
          {PALETTES.map((palette) => (
            <div className="brand-palette" key={palette.code}>
              <header>
                <span>{palette.code}</span>
                <strong>{palette.name}</strong>
                <p>{palette.note}</p>
              </header>
              <ul>
                {palette.colours.map((colour) => (
                  <li key={colour.hex}>
                    <CopyButton className="brand-swatch" label={`Copy ${colour.name} ${colour.hex}`} text={colour.hex}>
                      <i aria-hidden="true" style={{ background: colour.hex }} />
                      <strong>{colour.name}</strong>
                      <code>{colour.hex}</code>
                    </CopyButton>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="usage-title" className="resource-section" id="usage">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Usage / 05">
              Usage / 05
            </span>
            <h2 id="usage-title">
              Keep it <em>clean.</em>
            </h2>
          </div>
          <p>
            The mark blends forward motion with orbital precision; its geometric letterforms stay legible on badges,
            dashboards and document covers. Give it room and leave it as it is.
          </p>
        </header>
        <div className="brand-usage">
          <figure className="brand-clearspace">
            <div>
              <Image alt="HSM Aries white wordmark with its clear-space margin marked" height={269} sizes="(max-width: 900px) 70vw, 420px" src="/media/aries-logo-white.png" width={1024} />
            </div>
            <figcaption>Clear space = height of the “A” on every side</figcaption>
          </figure>
          <div className="brand-rules">
            <div className="brand-rules__column" data-kind="do">
              <strong>Do</strong>
              <ul>
                {RULES.do.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="brand-rules__column" data-kind="dont">
              <strong>Don’t</strong>
              <ul>
                {RULES.dont.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="brand-cta-title" className="resource-cta">
        <div>
          <span className="section-label">Writing about us?</span>
          <h2 id="brand-cta-title">
            Facts, photos and <em>descriptions</em> are in the press kit.
          </h2>
          <p>Need a format that is not here, or approval for a special use? Write to the team.</p>
        </div>
        <div className="resource-cta__actions">
          <Link className="button button--solid" href="/press">
            Press kit <span aria-hidden="true">→</span>
          </Link>
          <Link className="button button--outline" href="/contact">
            Contact <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
