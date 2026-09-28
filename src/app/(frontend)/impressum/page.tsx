import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/JsonLd'
import { LegalDocument, type LegalLang, type LegalSection } from '@/components/LegalDocument'
import { LegalAddress, LegalEmail, ResponsiblePerson } from '@/components/LegalFacts'
import { PageShell } from '@/components/PageShell'
import { LEGAL, LEGAL_UPDATED } from '@/lib/legal'
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo'

const DESCRIPTION =
  'Legal notice (Impressum) for hsmaries.space under § 5 DDG and § 18 MStV: provider, contact and editorial responsibility for HSM Aries, the student space-robotics team of Hochschule Schmalkalden.'

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  path: '/impressum',
  title: 'Impressum (legal notice)',
})

const sections: LegalSection[] = [
  {
    id: 'provider',
    title: { de: 'Diensteanbieter', en: 'Service provider' },
    body: {
      de: (
        <>
          <p>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG):</p>
          <LegalAddress lang="de" />
          <dl className="legal-facts">
            <div>
              <dt>Vertreten durch</dt>
              <dd>
                <ResponsiblePerson lang="de" />
              </dd>
            </div>
            {LEGAL.register ? (
              <div>
                <dt>Registereintrag</dt>
                <dd>
                  Vereinsregister, {LEGAL.register.court}, {LEGAL.register.number}
                </dd>
              </div>
            ) : null}
          </dl>
        </>
      ),
      en: (
        <>
          <p>Information pursuant to § 5 of the German Digital Services Act (DDG):</p>
          <LegalAddress lang="en" />
          <dl className="legal-facts">
            <div>
              <dt>Represented by</dt>
              <dd>
                <ResponsiblePerson lang="en" />
              </dd>
            </div>
            {LEGAL.register ? (
              <div>
                <dt>Register entry</dt>
                <dd>
                  Register of associations, {LEGAL.register.court}, {LEGAL.register.number}
                </dd>
              </div>
            ) : null}
          </dl>
        </>
      ),
    },
  },
  {
    id: 'contact',
    title: { de: 'Kontakt', en: 'Contact' },
    body: {
      de: (
        <dl className="legal-facts">
          <div>
            <dt>E-Mail</dt>
            <dd>
              <LegalEmail />
            </dd>
          </div>
          <div>
            <dt>Kontaktformular</dt>
            <dd>
              <Link href="/contact">hsmaries.space/contact</Link>
            </dd>
          </div>
        </dl>
      ),
      en: (
        <dl className="legal-facts">
          <div>
            <dt>Email</dt>
            <dd>
              <LegalEmail />
            </dd>
          </div>
          <div>
            <dt>Contact form</dt>
            <dd>
              <Link href="/contact">hsmaries.space/contact</Link>
            </dd>
          </div>
        </dl>
      ),
    },
  },
  {
    id: 'editorial',
    title: { de: 'Redaktionell verantwortlich', en: 'Editorial responsibility' },
    body: {
      de: (
        <>
          <p>
            Verantwortlich für journalistisch-redaktionelle Inhalte, insbesondere die Mission Updates, gemäß § 18 Abs. 2
            Medienstaatsvertrag (MStV):
          </p>
          <p className="legal-emphasis">
            <ResponsiblePerson lang="de" />
            <br />
            Anschrift wie oben
          </p>
        </>
      ),
      en: (
        <>
          <p>
            Responsible for journalistic and editorial content, in particular the mission updates, pursuant to § 18 (2)
            of the German Interstate Media Treaty (MStV):
          </p>
          <p className="legal-emphasis">
            <ResponsiblePerson lang="en" />
            <br />
            Address as above
          </p>
        </>
      ),
    },
  },
  {
    id: 'about',
    title: { de: 'Über HSM Aries', en: 'About HSM Aries' },
    body: {
      de: (
        <p>
          HSM Aries ist eine studentische Initiative am {LEGAL.chair} der {LEGAL.institution}. Für die Website der
          Hochschule gilt deren eigenes Impressum unter{' '}
          <a href="https://www.hs-schmalkalden.de/" rel="noreferrer" target="_blank">
            hs-schmalkalden.de
          </a>
          .
        </p>
      ),
      en: (
        <p>
          HSM Aries is a student initiative at the {LEGAL.chair} of {LEGAL.institution}. The university’s own legal
          notice applies to its website at{' '}
          <a href="https://www.hs-schmalkalden.de/" rel="noreferrer" target="_blank">
            hs-schmalkalden.de
          </a>
          .
        </p>
      ),
    },
  },
  {
    id: 'liability-content',
    title: { de: 'Haftung für Inhalte', en: 'Liability for content' },
    body: {
      de: (
        <p>
          Wir erstellen die Inhalte dieser Seiten mit Sorgfalt und halten sie aktuell. Als Diensteanbieter sind wir nach
          § 7 Abs. 1 DDG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Nach den §§ 8 bis 10 DDG sind
          wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
          Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Pflichten zur Entfernung oder Sperrung
          von Informationen nach den allgemeinen Gesetzen bleiben unberührt; eine Haftung ist insoweit erst ab Kenntnis
          einer konkreten Rechtsverletzung möglich. Sobald wir von einer Rechtsverletzung erfahren, entfernen wir die
          betreffenden Inhalte umgehend.
        </p>
      ),
      en: (
        <p>
          We create the content of these pages with care and keep it up to date. As a service provider we are
          responsible for our own content under general law (§ 7 (1) DDG). Under §§ 8 to 10 DDG, however, we are not
          obliged to monitor third-party information that we transmit or store, or to search for circumstances that
          indicate illegal activity. Obligations to remove or block information under general law remain unaffected;
          liability in this respect is only possible from the moment we become aware of a specific infringement. As
          soon as we learn of an infringement, we remove the content concerned without delay.
        </p>
      ),
    },
  },
  {
    id: 'liability-links',
    title: { de: 'Haftung für Links', en: 'Links to other websites' },
    body: {
      de: (
        <p>
          Unsere Seiten verlinken auf externe Websites, etwa unserer Partner, auf LinkedIn, YouTube und GitHub. Auf
          deren Inhalte haben wir keinen Einfluss und übernehmen dafür keine Gewähr; verantwortlich ist stets der
          jeweilige Anbieter oder Betreiber der verlinkten Seite. Zum Zeitpunkt der Verlinkung haben wir die Seiten auf
          mögliche Rechtsverstöße geprüft und keine rechtswidrigen Inhalte festgestellt. Eine laufende Kontrolle ist
          ohne konkrete Anhaltspunkte für eine Rechtsverletzung nicht zumutbar. Wird uns eine Rechtsverletzung bekannt,
          entfernen wir den Link umgehend.
        </p>
      ),
      en: (
        <p>
          Our pages link to external websites, for example those of our partners and our profiles on LinkedIn, YouTube
          and GitHub. We have no influence on their content and therefore cannot accept responsibility for it; the
          respective provider or operator of a linked page is always responsible for its content. We checked the linked
          pages for possible legal violations when we set the links and found no illegal content at that time.
          Permanent monitoring is not reasonable without concrete indications of an infringement. If we become aware of
          an infringement, we will remove the link without delay.
        </p>
      ),
    },
  },
  {
    id: 'copyright',
    title: { de: 'Urheberrecht', en: 'Copyright' },
    body: {
      de: (
        <p>
          Texte, Fotografien, Renderings und 3D-Modelle auf dieser Website unterliegen dem deutschen Urheberrecht.
          Vervielfältigung, Bearbeitung, Verbreitung und jede Verwertung außerhalb der Grenzen des Urheberrechts bedürfen
          der vorherigen Zustimmung der jeweiligen Rechteinhaber. Soweit Inhalte nicht von uns erstellt wurden, beachten
          wir die Urheberrechte Dritter. Die Logos unserer Partner und der Hochschule gehören den jeweiligen Inhabern und
          werden gezeigt, um deren Unterstützung sichtbar zu machen. Sollten Sie dennoch auf eine
          Urheberrechtsverletzung stoßen, bitten wir um einen Hinweis an <LegalEmail />.
        </p>
      ),
      en: (
        <p>
          Texts, photographs, renderings and 3D models on this website are protected by German copyright law.
          Reproduction, editing, distribution and any use beyond the limits of copyright law require the prior consent
          of the respective rights holder. Where content was not created by us, the copyrights of third parties are
          respected. The logos of our partners and the university belong to their owners and are shown to acknowledge
          their support. Should you nevertheless notice a copyright infringement, please let us know at <LegalEmail />.
        </p>
      ),
    },
  },
]

type PageProps = {
  searchParams: Promise<{ lang?: string | string[] }>
}

export default async function ImpressumPage({ searchParams }: PageProps) {
  const initialLang: LegalLang = (await searchParams).lang === 'de' ? 'de' : 'en'

  return (
    <PageShell>
      <JsonLd data={webPageJsonLd({ dateModified: LEGAL_UPDATED, description: DESCRIPTION, name: 'Impressum (legal notice)', path: '/impressum' })} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Impressum' }])} />
      <LegalDocument
        eyebrow={{ de: 'Rechtliches // Impressum', en: 'Legal // Impressum' }}
        initialLang={initialLang}
        lead={{
          de: <p>Wer hinter hsmaries.space steht und wie Sie uns erreichen — nach § 5 DDG und § 18 MStV.</p>,
          en: <p>Who is behind hsmaries.space and how to reach us — as required by § 5 DDG and § 18 MStV.</p>,
        }}
        sections={sections}
        title={{ de: ['Impressum', '& Kontakt.'], en: ['Legal notice', '& contact.'] }}
        updated={LEGAL_UPDATED}
      />
    </PageShell>
  )
}
