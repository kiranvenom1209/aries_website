import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CopyButton } from '@/components/CopyButton'
import { JsonLd } from '@/components/JsonLd'
import { PageShell } from '@/components/PageShell'
import { authoritativeGalleryImages } from '@/lib/gallery'
import { LEGAL } from '@/lib/legal'
import { breadcrumbJsonLd, pageMetadata, SITE_EMAIL, SITE_URL, socialImageDimensions, webPageJsonLd } from '@/lib/seo'

const DESCRIPTION =
  'HSM Aries press kit: fact sheet, ready-to-use descriptions in English and German, press photos from the ERC 2026 finals, logos and the press contact.'

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  image: '/media/og/news.jpg',
  imageAlt: 'LEAP-One climbs the rocky slope of the Mars yard at the ERC 2026 finals',
  path: '/press',
  title: 'Press kit',
})

const CREDIT = 'Photo: HSM Aries (hsmaries.space)'

// Result figures follow knowledge/erc-2026/hsm-aries-result.md and knowledge/site-content-rules.md.
const BOILERPLATE = {
  en: {
    long: [
      'HSM Aries is the student space-robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden in Thuringia, Germany. Undergraduate and postgraduate students from eight departments — mechanical, electrical, software and autonomy, communications, drill and manipulator, drone, science, and mission resources and outreach — design, build and field planetary rovers in the LEAP series.',
      'LEAP-One, Project 01, is a six-wheel rocker-bogie rover with a six-axis robotic arm and a 530 mm sampling drill. At the European Rover Challenge 2026 finals at AGH University in Kraków (4–6 September 2026) it finished 17th of 25 finalist teams, from a starting field of 124 registered teams, with 1492.25 of 3000 points — 4th in documentation and 6th in navigation droning. It was the team’s first ERC appearance, achieved without major sponsorship. Leap-2, Project 02, is in development.',
    ],
    short:
      'HSM Aries is the student space-robotics team of Hochschule Schmalkalden, Germany. Its first planetary rover, LEAP-One, finished 17th at the European Rover Challenge 2026 finals in Kraków — from a starting field of 124 registered teams — on the team’s first ERC appearance. Leap-2, the next rover, is in development.',
  },
  de: {
    long: [
      'HSM Aries ist die studentische Raumfahrtrobotik-Initiative am Chair of Drive, Automation, and Robotics Technologies der Hochschule Schmalkalden in Thüringen. Studierende aus Bachelor- und Masterstudiengängen entwerfen, bauen und testen in acht Abteilungen – Mechanik, Elektrik, Software und Autonomie, Kommunikation, Bohrer und Manipulator, Drohne, Wissenschaft sowie Ressourcen und Öffentlichkeitsarbeit – Planetenrover der LEAP-Serie.',
      'LEAP-One, Projekt 01, ist ein sechsrädriger Rocker-Bogie-Rover mit einem sechsachsigen Roboterarm und einem 530-mm-Probenbohrer. Beim Finale der European Rover Challenge 2026 an der AGH-Universität Krakau (4.–6. September 2026) belegte er Platz 17 von 25 Finalteams, aus einem Starterfeld von 124 angemeldeten Teams, mit 1492,25 von 3000 Punkten – Platz 4 in der Dokumentation und Platz 6 im Navigation Droning. Es war die erste ERC-Teilnahme des Teams, erreicht ohne großes Sponsoring. Leap-2, Projekt 02, ist in Entwicklung.',
    ],
    short:
      'HSM Aries ist das studentische Raumfahrtrobotik-Team der Hochschule Schmalkalden. Sein erster Planetenrover LEAP-One belegte beim Finale der European Rover Challenge 2026 in Krakau Platz 17 – aus einem Starterfeld von 124 angemeldeten Teams, bei der ersten ERC-Teilnahme des Teams. Der nächste Rover, Leap-2, ist in Entwicklung.',
  },
}

const QUICK_FACTS = [
  { label: 'ERC 2026 finals', value: '17th', note: 'of 25 finalists · 124 teams registered' },
  { label: 'Final score', value: '1492.25', note: 'of 3000 points' },
  { label: 'Departments', value: '08', note: 'student engineering teams' },
  { label: 'Next rover', value: 'Leap-2', note: 'Project 02 · in development' },
]

const PRESS_FACTS: Array<[string, string]> = [
  ['Official name', 'HSM Aries (also written HSM Aries.space)'],
  ['Website', SITE_URL],
  ['Home', `${LEGAL.institution}, ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}, Thuringia, Germany`],
  ['Affiliation', `${LEGAL.chair}, ${LEGAL.institution}`],
  ['Rovers', 'LEAP-One — Project 01, ERC 2026 finalist · Leap-2 — Project 02, in development'],
  ['Latest result', 'ERC 2026 finals, AGH University, Kraków, 4–6 September 2026 — 17th of 25 finalists, from 124 registered teams · 1492.25 of 3000 points'],
  ['Press contact', SITE_EMAIL],
  ['Photo credit', CREDIT],
]

const PHOTOS = [
  'erc-2026-finals-15-leap-one-mars-yard-arm-raised.jpg',
  'erc-2026-finals-17-leap-one-climbs-rocky-slope.jpg',
  'erc-2026-finals-33-team-with-leap-one-and-flags.jpg',
  'erc-2026-finals-41-quadcopter-on-deck.jpg',
  'erc-2026-finals-10-control-station-pit-tent.jpg',
  'erc-2026-finals-21-gripper-on-maintenance-panel.jpg',
  'erc-2026-finals-31-presentation-lecture-hall.jpg',
  'erc-2026-finals-34-team-on-the-steps.jpg',
  'DSC02769-scaled.jpg',
]

const NAV = [
  ['01', 'Facts', '#facts'],
  ['02', 'Descriptions', '#descriptions'],
  ['03', 'Photos', '#photos'],
  ['04', 'Logos', '#logos'],
  ['05', 'Contact', '#press-contact'],
]

export default async function PressPage() {
  const photos = await Promise.all(
    PHOTOS.map(async (file) => {
      const src = `/media/${file}`
      const entry = authoritativeGalleryImages.find((image) => image.src === src)
      const size = await socialImageDimensions(src)
      return { alt: entry?.alt ?? 'HSM Aries press photo', file, size, src }
    }),
  )
  const factsText = PRESS_FACTS.map(([label, value]) => `${label}: ${value}`).join('\n')

  return (
    <PageShell>
      <JsonLd data={webPageJsonLd({ description: DESCRIPTION, name: 'Press kit', path: '/press' })} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Press kit' }])} />

      <header className="resource-hero">
        <div className="resource-hero__inner">
          <div>
            <span className="hero__eyebrow">Resources // Media &amp; press</span>
            <h1>
              Press
              <br />
              <em>kit.</em>
            </h1>
            <p className="resource-hero__lead">
              Facts, ready-to-use descriptions, photos and logos for journalists, sponsors and collaborators — free for
              editorial use with credit.
            </p>
            <div className="resource-hero__actions">
              <a className="button button--solid" href="#photos">
                Press photos <span aria-hidden="true">↓</span>
              </a>
              <Link className="button button--outline" href="/brand">
                Brand assets <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <dl className="press-quickfacts">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  <strong>{fact.value}</strong>
                  <span>{fact.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <nav aria-label="Press kit sections" className="resource-nav">
        {NAV.map(([code, label, href]) => (
          <a href={href} key={href}>
            <span>{code}</span>
            {label}
          </a>
        ))}
      </nav>

      <section aria-labelledby="facts-title" className="resource-section" id="facts">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Fact sheet / 01">
              Fact sheet / 01
            </span>
            <h2 id="facts-title">
              The record, <em>in one place.</em>
            </h2>
          </div>
          <p>Checked against the organisers’ official ERC 2026 results sheet. Copy the whole sheet into your notes in one click.</p>
        </header>
        <div className="press-facts">
          <dl>
            {PRESS_FACTS.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{label === 'Press contact' ? <a href={`mailto:${value}`}>{value}</a> : label === 'Website' ? <a href={value}>{value}</a> : value}</dd>
              </div>
            ))}
          </dl>
          <CopyButton label="Copy the fact sheet" text={factsText}>
            Copy fact sheet
          </CopyButton>
        </div>
      </section>

      <section aria-labelledby="descriptions-title" className="resource-section" id="descriptions">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Descriptions / 02">
              Descriptions / 02
            </span>
            <h2 id="descriptions-title">
              Ready to <em>paste.</em>
            </h2>
          </div>
          <p>A short and a long description in English and German. Use them as they are, or shorten them — please keep the figures unchanged.</p>
        </header>
        <div className="press-boilerplate">
          {(['en', 'de'] as const).map((lang) => (
            <article className="press-copy" key={lang} lang={lang}>
              <header>
                <span>{lang === 'en' ? 'English' : 'Deutsch'}</span>
              </header>
              <div className="press-copy__block">
                <div className="press-copy__head">
                  <strong>{lang === 'en' ? 'Short · ~50 words' : 'Kurz · ca. 50 Wörter'}</strong>
                  <CopyButton label={lang === 'en' ? 'Copy short English description' : 'Kurze deutsche Beschreibung kopieren'} text={BOILERPLATE[lang].short}>
                    {lang === 'en' ? 'Copy' : 'Kopieren'}
                  </CopyButton>
                </div>
                <p>{BOILERPLATE[lang].short}</p>
              </div>
              <div className="press-copy__block">
                <div className="press-copy__head">
                  <strong>{lang === 'en' ? 'Long · ~150 words' : 'Lang · ca. 150 Wörter'}</strong>
                  <CopyButton label={lang === 'en' ? 'Copy long English description' : 'Lange deutsche Beschreibung kopieren'} text={BOILERPLATE[lang].long.join('\n\n')}>
                    {lang === 'en' ? 'Copy' : 'Kopieren'}
                  </CopyButton>
                </div>
                {BOILERPLATE[lang].long.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="photos-title" className="resource-section" id="photos">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Press photos / 03">
              Press photos / 03
            </span>
            <h2 id="photos-title">
              From the <em>Mars yard.</em>
            </h2>
          </div>
          <p>
            Full-resolution originals from the ERC 2026 finals and Space Night 2026. Editorial use is free with the credit
            “{CREDIT}”. For commercial use, please ask first.
          </p>
        </header>
        <ul className="press-photos">
          {photos.map((photo) => (
            <li className="press-photo" key={photo.file}>
              <div className="press-photo__image">
                <Image alt={photo.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw" src={photo.src} />
              </div>
              <div className="press-photo__meta">
                <p>{photo.alt}</p>
                <a className="resource-download" download={`HSM-Aries-${photo.file}`} href={photo.src}>
                  JPG {photo.size ? <small>{`${photo.size.width} × ${photo.size.height}`}</small> : null}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="press-note">
          More in the <Link href="/gallery">field gallery</Link>. The rover itself can be explored in 3D in the{' '}
          <Link href="/leap-one/cad">LEAP-One CAD viewer</Link>.
        </p>
      </section>

      <section aria-labelledby="press-logos-title" className="resource-section" id="logos">
        <header className="resource-section__head">
          <div>
            <span className="section-label" data-section-label="Logos / 04">
              Logos / 04
            </span>
            <h2 id="press-logos-title">
              The mark, <em>ready to place.</em>
            </h2>
          </div>
          <p>Transparent PNGs. The brand page has every version, the mission patches, colours and usage rules.</p>
        </header>
        <div className="press-logos">
          <a className="press-logo press-logo--dark" download="HSM-Aries-wordmark-white.png" href="/media/aries-logo-white.png">
            <Image alt="HSM Aries white wordmark" height={269} sizes="320px" src="/media/aries-logo-white.png" width={1024} />
            <span>White wordmark · for dark backgrounds</span>
          </a>
          <a className="press-logo press-logo--light" download="HSM-Aries-wordmark-gradient.png" href="/media/aries-logoo.png">
            <Image alt="HSM Aries gradient wordmark" height={672} sizes="320px" src="/media/aries-logoo.png" width={2560} />
            <span>Gradient wordmark · for light backgrounds</span>
          </a>
          <Link className="press-logo press-logo--more" href="/brand">
            <strong>All brand assets</strong>
            <span>Mark, badge, patches, colour and type →</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="press-contact-title" className="resource-cta" id="press-contact">
        <div>
          <span className="section-label" data-section-label="Press contact / 05">
            Press contact / 05
          </span>
          <h2 id="press-contact-title">
            Interviews, visits, <em>footage.</em>
          </h2>
          <p>
            For interviews with the team, lab visits, high-resolution renders or anything not in this kit, write to{' '}
            <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>. Logos may not be altered; images are free for editorial
            coverage with credit.
          </p>
        </div>
        <div className="resource-cta__actions">
          <a className="button button--solid" href={`mailto:${SITE_EMAIL}?subject=Press%20enquiry`}>
            Email the team <span aria-hidden="true">→</span>
          </a>
          <Link className="button button--outline" href="/contact">
            Contact page <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
