import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { ConsentSettingsButton } from '@/components/ConsentSettingsButton'
import { JsonLd } from '@/components/JsonLd'
import { LegalDocument, type LegalLang, type LegalSection } from '@/components/LegalDocument'
import { LegalAddress, LegalEmail, ResponsiblePerson } from '@/components/LegalFacts'
import { PageShell } from '@/components/PageShell'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'
import { CONSENT_STORAGE_KEY } from '@/lib/consent'
import { selfHosted } from '@/lib/hosting'
import { INTRO_SESSION_KEY } from '@/lib/intro'
import { LEGAL, LEGAL_UPDATED, SUPERVISORY_AUTHORITY } from '@/lib/legal'
import { breadcrumbJsonLd, pageMetadata, webPageJsonLd } from '@/lib/seo'

const DESCRIPTION =
  'How HSM Aries handles personal data on hsmaries.space: hosting, contact forms, consent-based Google Analytics and YouTube, cookies and your rights under the GDPR.'

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  path: '/datenschutz',
  title: 'Privacy policy (Datenschutzerklärung)',
})

const GA_STREAM_COOKIE = `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')}`

const GOOGLE = 'Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland'
const NETLIFY = 'Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA'
const CLOUDFLARE = 'Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA'

const ExternalLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <a href={href} rel="noreferrer" target="_blank">
    {children}
  </a>
)

type StorageRow = {
  category: Record<LegalLang, string>
  duration: Record<LegalLang, string>
  name: string
  purpose: Record<LegalLang, string>
  type: Record<LegalLang, string>
}

const STORAGE: StorageRow[] = [
  {
    category: { de: 'Notwendig', en: 'Essential' },
    duration: { de: '12 Monate', en: '12 months' },
    name: CONSENT_STORAGE_KEY,
    purpose: { de: 'Speichert Ihre Auswahl im Einwilligungs-Panel', en: 'Stores your choice in the consent panel' },
    type: { de: 'Local Storage', en: 'Local storage' },
  },
  {
    category: { de: 'Notwendig', en: 'Essential' },
    duration: { de: 'Bis der Tab geschlossen wird', en: 'Until the tab is closed' },
    name: INTRO_SESSION_KEY,
    purpose: {
      de: 'Merkt sich, dass die Startanimation in diesem Tab schon lief, damit sie nicht bei jedem Neuladen erscheint',
      en: 'Remembers that the intro animation has played in this tab, so it does not repeat on every reload',
    },
    type: { de: 'Session Storage', en: 'Session storage' },
  },
  {
    category: { de: 'Notwendig', en: 'Essential' },
    duration: { de: '8 Stunden', en: '8 hours' },
    name: 'payload-token',
    purpose: {
      de: 'Hält Teammitglieder in Mission Control angemeldet — wird erst beim Login gesetzt',
      en: 'Keeps team members signed in to Mission Control — only set on login',
    },
    type: { de: 'Cookie', en: 'Cookie' },
  },
  {
    category: { de: 'Notwendig (auf Wunsch)', en: 'Essential (on request)' },
    duration: { de: 'Bis zur Abwahl', en: 'Until unticked' },
    name: 'hsm-aries-login-id',
    purpose: {
      de: 'Merkt sich den Benutzernamen, wenn beim Login „Remember my username“ gewählt ist',
      en: 'Remembers the username when “Remember my username” is ticked at login',
    },
    type: { de: 'Local Storage', en: 'Local storage' },
  },
  ...(selfHosted
    ? [
        {
          category: { de: 'Notwendig', en: 'Essential' },
          duration: { de: '30 Minuten', en: '30 minutes' },
          name: '__cf_bm',
          purpose: {
            de: 'Unterscheidet Menschen von automatisierten Zugriffen (Bot-Schutz von Cloudflare) — nur wenn Cloudflare diesen Schutz für eine Anfrage einsetzt',
            en: 'Tells people apart from automated traffic (Cloudflare bot protection) — only when Cloudflare applies this protection to a request',
          },
          type: { de: 'Cookie', en: 'Cookie' },
        },
      ]
    : []),
  {
    category: { de: 'Analyse (Einwilligung)', en: 'Analytics (consent)' },
    duration: { de: '2 Jahre', en: '2 years' },
    name: '_ga',
    purpose: { de: 'Unterscheidet Besucher (Google Analytics)', en: 'Distinguishes visitors (Google Analytics)' },
    type: { de: 'Cookie', en: 'Cookie' },
  },
  {
    category: { de: 'Analyse (Einwilligung)', en: 'Analytics (consent)' },
    duration: { de: '2 Jahre', en: '2 years' },
    name: GA_STREAM_COOKIE,
    purpose: { de: 'Speichert den Sitzungsstatus (Google Analytics)', en: 'Keeps the session state (Google Analytics)' },
    type: { de: 'Cookie', en: 'Cookie' },
  },
  {
    category: { de: 'Externe Medien (Einwilligung)', en: 'External media (consent)' },
    duration: { de: 'Laut Google', en: 'As set by Google' },
    name: 'YouTube',
    purpose: {
      de: 'Erst nach dem Laden eines Videos, z. B. für Wiedergabe-Einstellungen und Aufrufstatistik',
      en: 'Only after a video loads, e.g. for playback preferences and view statistics',
    },
    type: { de: 'Cookies / Local Storage', en: 'Cookies / local storage' },
  },
]

function StorageTable({ lang }: { lang: LegalLang }) {
  const head =
    lang === 'de'
      ? ['Name', 'Art', 'Zweck', 'Dauer', 'Kategorie']
      : ['Name', 'Type', 'Purpose', 'Duration', 'Category']
  return (
    <div className="legal-table" role="region" aria-label={lang === 'de' ? 'Gespeicherte Informationen' : 'Stored information'} tabIndex={0}>
      <table>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STORAGE.map((row) => (
            <tr key={row.name}>
              <th scope="row">
                <code>{row.name}</code>
              </th>
              <td>{row.type[lang]}</td>
              <td>{row.purpose[lang]}</td>
              <td>{row.duration[lang]}</td>
              <td>{row.category[lang]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SettingsLink = ({ lang }: { lang: LegalLang }) => (
  <ConsentSettingsButton className="legal-inline-button">
    {lang === 'de' ? 'Cookie-Einstellungen' : 'Cookie settings'}
  </ConsentSettingsButton>
)

const sections: LegalSection[] = [
  {
    id: 'overview',
    title: { de: 'Auf einen Blick', en: 'At a glance' },
    body: {
      de: (
        <>
          <p>
            Diese Erklärung beschreibt, welche personenbezogenen Daten beim Besuch von hsmaries.space verarbeitet werden,
            wozu, auf welcher Rechtsgrundlage und welche Rechte Sie haben. Kurz gesagt:
          </p>
          <ul className="legal-checks">
            <li>
              <strong>Kein Tracking ohne Einwilligung.</strong> Google Analytics und eingebettete Videos bleiben aus,
              bis Sie sie erlauben.
            </li>
            <li>
              <strong>Keine Werbung.</strong> Wir verkaufen keine Daten; die Werbefunktionen von Google Analytics sind
              abgeschaltet.
            </li>
            <li>
              <strong>Alles andere kommt von uns.</strong> Schriften, Bilder und 3D-Modelle werden von unserer eigenen
              Domain geladen — kein Google Fonts, keine fremden CDNs.
            </li>
            <li>
              <strong>Sie behalten die Kontrolle.</strong> Ihre Auswahl ändern oder widerrufen Sie jederzeit über die{' '}
              <SettingsLink lang="de" />.
            </li>
          </ul>
        </>
      ),
      en: (
        <>
          <p>
            This policy explains which personal data is processed when you visit hsmaries.space, why, on what legal
            basis, and which rights you have. The short version:
          </p>
          <ul className="legal-checks">
            <li>
              <strong>No tracking without your consent.</strong> Google Analytics and embedded videos stay off until
              you allow them.
            </li>
            <li>
              <strong>No advertising.</strong> We do not sell data, and the advertising features of Google Analytics
              are switched off.
            </li>
            <li>
              <strong>Everything else comes from us.</strong> Fonts, images and 3D models are served from our own
              domain — no Google Fonts, no third-party CDNs.
            </li>
            <li>
              <strong>You stay in control.</strong> Change or withdraw your choice at any time in the{' '}
              <SettingsLink lang="en" />.
            </li>
          </ul>
        </>
      ),
    },
  },
  {
    id: 'controller',
    title: { de: 'Verantwortliche Stelle', en: 'Controller' },
    body: {
      de: (
        <>
          <p>Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
          <LegalAddress lang="de" />
          <dl className="legal-facts">
            <div>
              <dt>Vertreten durch</dt>
              <dd>
                <ResponsiblePerson lang="de" />
              </dd>
            </div>
            <div>
              <dt>E-Mail</dt>
              <dd>
                <LegalEmail />
              </dd>
            </div>
            {LEGAL.dataProtectionOfficer ? (
              <div>
                <dt>Datenschutzbeauftragte/r</dt>
                <dd>
                  {LEGAL.dataProtectionOfficer.name},{' '}
                  <a href={`mailto:${LEGAL.dataProtectionOfficer.email}`}>{LEGAL.dataProtectionOfficer.email}</a>
                </dd>
              </div>
            ) : null}
          </dl>
          <p>Für alle Fragen zum Datenschutz und zur Ausübung Ihrer Rechte schreiben Sie uns an <LegalEmail />.</p>
        </>
      ),
      en: (
        <>
          <p>The controller within the meaning of the General Data Protection Regulation (GDPR) is:</p>
          <LegalAddress lang="en" />
          <dl className="legal-facts">
            <div>
              <dt>Represented by</dt>
              <dd>
                <ResponsiblePerson lang="en" />
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <LegalEmail />
              </dd>
            </div>
            {LEGAL.dataProtectionOfficer ? (
              <div>
                <dt>Data protection officer</dt>
                <dd>
                  {LEGAL.dataProtectionOfficer.name},{' '}
                  <a href={`mailto:${LEGAL.dataProtectionOfficer.email}`}>{LEGAL.dataProtectionOfficer.email}</a>
                </dd>
              </div>
            ) : null}
          </dl>
          <p>For any data protection question, and to exercise your rights, write to us at <LegalEmail />.</p>
        </>
      ),
    },
  },
  {
    id: 'hosting',
    title: { de: 'Hosting und Server-Logfiles', en: 'Hosting and server log files' },
    body: {
      de: selfHosted ? (
        <>
          <p>
            Diese Website läuft auf einem eigenen Server, den unser Team in Deutschland betreibt. Vorgeschaltet ist das
            Netzwerk von {CLOUDFLARE}: Jeder Aufruf erreicht zuerst die Server von Cloudflare, die die Verbindung
            verschlüsseln, Angriffe abwehren, häufig abgerufene Dateien zwischenspeichern und die Anfrage über eine
            verschlüsselte Verbindung an unseren Server weiterreichen. Dabei werden die Informationen verarbeitet, die
            Ihr Browser automatisch übermittelt: IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene Seite,
            verweisende URL, verwendeter Browser und Betriebssystem sowie die übertragene Datenmenge.
          </p>
          <p>
            Diese Daten benötigen wir, um die Website auszuliefern, ihren stabilen und sicheren Betrieb zu gewährleisten
            und Angriffe zu erkennen und abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
            Interesse liegt im sicheren und zuverlässigen Betrieb der Website. Die Logdaten werden gelöscht, sobald sie
            für diese Zwecke nicht mehr benötigt werden.
          </p>
          <p>
            Cloudflare verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO). Cloudflare ist unter dem EU-US Data
            Privacy Framework zertifiziert; Übermittlungen in die USA stützen sich daher auf den Angemessenheitsbeschluss
            der Europäischen Kommission (Art. 45 DSGVO). Zusätzlich setzt Cloudflare die EU-Standardvertragsklauseln ein.
            Zum Schutz vor automatisierten Zugriffen kann Cloudflare ein technisch notwendiges Cookie setzen (siehe die
            Tabelle im Abschnitt zu Cookies).
          </p>
        </>
      ) : (
        <>
          <p>
            Diese Website wird bei {NETLIFY} gehostet. Beim Aufruf einer Seite übermittelt Ihr Browser automatisch
            Informationen, die die Server von Netlify in Logfiles erfassen: IP-Adresse, Datum und Uhrzeit des Abrufs,
            aufgerufene Seite, verweisende URL, verwendeter Browser und Betriebssystem sowie die übertragene Datenmenge.
          </p>
          <p>
            Diese Daten benötigen wir, um die Website auszuliefern, ihren stabilen und sicheren Betrieb zu gewährleisten
            und Angriffe zu erkennen und abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
            Interesse liegt im sicheren und zuverlässigen Betrieb der Website. Die Logdaten werden gelöscht, sobald sie
            für diese Zwecke nicht mehr benötigt werden.
          </p>
          <p>
            Netlify verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO). Netlify ist unter dem EU-US Data Privacy
            Framework zertifiziert; Übermittlungen in die USA stützen sich daher auf den Angemessenheitsbeschluss der
            Europäischen Kommission (Art. 45 DSGVO). Zusätzlich setzt Netlify die EU-Standardvertragsklauseln ein.
          </p>
        </>
      ),
      en: selfHosted ? (
        <>
          <p>
            This website runs on our own server, which our team operates in Germany. It sits behind the network of{' '}
            {CLOUDFLARE}: every request first reaches Cloudflare’s servers, which encrypt the connection, fend off
            attacks, cache frequently requested files and pass the request on to our server over an encrypted
            connection. In the process, the information your browser transmits automatically is processed: IP address,
            date and time of the request, the page requested, the referring URL, the browser and operating system used,
            and the amount of data transferred.
          </p>
          <p>
            We need this data to deliver the website, to keep it stable and secure, and to detect and defend against
            attacks. The legal basis is Art. 6 (1)(f) GDPR; our legitimate interest lies in the secure and reliable
            operation of the website. Log data is deleted as soon as it is no longer needed for these purposes.
          </p>
          <p>
            Cloudflare processes the data on our behalf (Art. 28 GDPR). Cloudflare is certified under the EU–US Data
            Privacy Framework, so transfers to the USA rest on the European Commission’s adequacy decision (Art. 45
            GDPR); in addition, Cloudflare uses the EU Standard Contractual Clauses. To protect against automated
            traffic, Cloudflare may set a strictly necessary cookie (see the table in the section on cookies).
          </p>
        </>
      ) : (
        <>
          <p>
            This website is hosted by {NETLIFY}. When you open a page, your browser automatically transmits information
            that Netlify’s servers record in log files: IP address, date and time of the request, the page requested,
            the referring URL, the browser and operating system used, and the amount of data transferred.
          </p>
          <p>
            We need this data to deliver the website, to keep it stable and secure, and to detect and defend against
            attacks. The legal basis is Art. 6 (1)(f) GDPR; our legitimate interest lies in the secure and reliable
            operation of the website. Log data is deleted as soon as it is no longer needed for these purposes.
          </p>
          <p>
            Netlify processes the data on our behalf (Art. 28 GDPR). Netlify is certified under the EU–US Data Privacy
            Framework, so transfers to the USA rest on the European Commission’s adequacy decision (Art. 45 GDPR); in
            addition, Netlify uses the EU Standard Contractual Clauses.
          </p>
        </>
      ),
    },
  },
  {
    id: 'contact',
    title: { de: 'Kontaktformulare und E-Mail', en: 'Contact forms and email' },
    body: {
      de: (
        <>
          <p>
            Wenn Sie eines unserer Formulare nutzen (Kontakt, Mitmachen, Partnerschaft) oder uns eine E-Mail schreiben,
            verarbeiten wir die Angaben, die Sie machen — in der Regel Name, E-Mail-Adresse und Nachricht, bei
            Bewerbungen zusätzlich Studiengang, Semester und Wunschabteilung, bei Partnerschaftsanfragen Ihre
            Organisation —, um Ihr Anliegen zu bearbeiten.
          </p>
          <p>
            Formulareingaben werden in der Datenbank unseres Content-Management-Systems gespeichert,{' '}
            {selfHosted ? 'das auf unserem eigenen Server läuft' : 'das bei Netlify gehostet wird'}; dort liest das Team
            sie, und eine Kopie jeder Nachricht geht an unser Team-Postfach. E-Mails erreichen unser Team-Postfach, ein Google-Gmail-Konto ({GOOGLE}); Google
            verarbeitet dabei auch den Inhalt der Nachrichten. Eine Übermittlung in die USA ist möglich und stützt sich
            auf das EU-US Data Privacy Framework.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage eine Mitgliedschaft, eine Partnerschaft
            oder andere vorvertragliche Schritte betrifft, im Übrigen Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes
            Interesse an der Beantwortung von Anfragen, die an uns gerichtet werden. Wir löschen Ihre Daten, sobald Ihr
            Anliegen erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>
        </>
      ),
      en: (
        <>
          <p>
            When you use one of our forms (contact, joining the team, partnership) or send us an email, we process the
            information you provide — usually your name, email address and message; for applications also your study
            programme, semester and preferred department; for partnership enquiries your organisation — to handle your
            request.
          </p>
          <p>
            Form submissions are stored in the database of our content management system, which{' '}
            {selfHosted ? 'runs on our own server' : 'is hosted by Netlify'}, where the team reads them; a copy of each
            message goes to our team mailbox. Emails reach our team mailbox, a Google Gmail account ({GOOGLE}); Google therefore also processes the
            content of messages. Transfers to the USA may occur and rest on the EU–US Data Privacy Framework.
          </p>
          <p>
            The legal basis is Art. 6 (1)(b) GDPR where your request concerns membership, a partnership or other steps
            prior to an agreement, and otherwise Art. 6 (1)(f) GDPR — our legitimate interest in answering enquiries
            addressed to us. We delete your data once your request has been dealt with, unless statutory retention
            obligations apply.
          </p>
        </>
      ),
    },
  },
  {
    id: 'cookies',
    title: { de: 'Cookies, lokale Speicherung und Einwilligung', en: 'Cookies, local storage and consent' },
    body: {
      de: (
        <>
          <p>
            Informationen auf Ihrem Endgerät zu speichern oder dort gespeicherte Informationen auszulesen, erfordert nach
            § 25 Abs. 1 Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG) Ihre Einwilligung — es sei denn,
            es ist unbedingt erforderlich, um den von Ihnen gewünschten Dienst bereitzustellen (§ 25 Abs. 2 Nr. 2
            TDDDG). Wir setzen deshalb standardmäßig nur unbedingt erforderliche Speicherungen ein und fragen vor allem
            anderen nach Ihrer Einwilligung.
          </p>
          <p>
            Beim ersten Besuch können Sie im Einwilligungs-Panel alle optionalen Kategorien mit je einem Klick annehmen
            oder ablehnen oder einzeln auswählen; nichts ist vorausgewählt. Ihre Auswahl wird zwölf Monate in Ihrem
            Browser gespeichert; danach oder wenn wir einen neuen Dienst einbinden, fragen wir erneut. Sie können Ihre
            Einwilligung jederzeit mit Wirkung für die Zukunft ändern oder widerrufen — über die{' '}
            <SettingsLink lang="de" />, die auch im Footer jeder Seite verlinkt sind. Der Widerruf berührt nicht die
            Rechtmäßigkeit der bis dahin erfolgten Verarbeitung.
          </p>
          <StorageTable lang="de" />
          <p>
            Rechtsgrundlage für die notwendigen Einträge ist § 25 Abs. 2 Nr. 2 TDDDG in Verbindung mit Art. 6 Abs. 1
            lit. f DSGVO, für die Anmeldung in Mission Control zusätzlich Art. 6 Abs. 1 lit. b DSGVO; für alle übrigen
            Ihre Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO.
          </p>
        </>
      ),
      en: (
        <>
          <p>
            Storing information on your device, or reading information already stored there, requires your consent
            under § 25 (1) of the German Telecommunications Digital Services Data Protection Act (TDDDG) — unless it is
            strictly necessary to provide the service you asked for (§ 25 (2) no. 2 TDDDG). By default we therefore use
            only strictly necessary storage, and we ask for your consent before anything else.
          </p>
          <p>
            On your first visit, the consent panel lets you accept or reject all optional categories with one click
            each, or choose them individually; nothing is pre-selected. Your choice is kept in your browser for twelve
            months; after that, or when we add a new service, we ask again. You can change or withdraw your consent at
            any time with effect for the future in the <SettingsLink lang="en" />, which are also linked in the footer
            of every page. Withdrawal does not affect the lawfulness of processing carried out before it.
          </p>
          <StorageTable lang="en" />
          <p>
            The legal basis for the essential entries is § 25 (2) no. 2 TDDDG together with Art. 6 (1)(f) GDPR, and for
            the Mission Control login also Art. 6 (1)(b) GDPR; for everything else it is your consent under § 25 (1)
            TDDDG and Art. 6 (1)(a) GDPR.
          </p>
        </>
      ),
    },
  },
  {
    id: 'analytics',
    title: { de: 'Google Analytics', en: 'Google Analytics' },
    body: {
      de: (
        <>
          <p>
            Mit Ihrer Einwilligung nutzen wir Google Analytics 4, einen Webanalysedienst der {GOOGLE} („Google“). Er
            zeigt uns, wie die Website genutzt wird — etwa welche Seiten und Mission Updates gelesen werden, wie Besucher
            zu uns finden und welche Geräte sie nutzen —, damit wir Inhalte und Navigation verbessern können.
          </p>
          <dl className="legal-facts">
            <div>
              <dt>Verarbeitete Daten</dt>
              <dd>
                Pseudonyme Online-Kennungen (aus den oben genannten Cookies), besuchte Seiten und Verweildauer,
                verweisende Website, ungefährer Standort (Land/Region, aus der IP-Adresse abgeleitet), Browser,
                Betriebssystem, Gerätetyp und Bildschirmauflösung. Google Analytics 4 protokolliert und speichert keine
                IP-Adressen. Google-Signale und alle Werbefunktionen sind abgeschaltet; wir führen die Daten nicht mit
                anderen Daten zusammen.
              </dd>
            </div>
            <div>
              <dt>Rechtsgrundlage</dt>
              <dd>
                Ihre Einwilligung, Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Das Google-Tag wird erst nach Ihrer
                Einwilligung geladen; vorher wird keine Verbindung zu Google aufgebaut. Über den Google Consent Mode wird
                Ihre Auswahl an Google übermittelt.
              </dd>
            </div>
            <div>
              <dt>Auftragsverarbeitung und Drittland</dt>
              <dd>
                Google verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO). Eine Übermittlung an die Google LLC in
                den USA ist möglich; die Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert, die
                Übermittlung stützt sich daher auf den Angemessenheitsbeschluss der Kommission (Art. 45 DSGVO).
              </dd>
            </div>
            <div>
              <dt>Speicherdauer</dt>
              <dd>Ereignisdaten werden nach {LEGAL.analyticsRetentionMonths} Monaten automatisch gelöscht.</dd>
            </div>
            <div>
              <dt>Widerruf</dt>
              <dd>
                Über die <SettingsLink lang="de" />. Schalten Sie die Analyse ab, endet jede weitere Erfassung und die
                auf dieser Website gesetzten Google-Analytics-Cookies werden gelöscht.
              </dd>
            </div>
          </dl>
          <p>
            Mehr dazu in der{' '}
            <ExternalLink href="https://policies.google.com/privacy?hl=de">Datenschutzerklärung von Google</ExternalLink>{' '}
            und unter{' '}
            <ExternalLink href="https://policies.google.com/technologies/partner-sites?hl=de">
              So nutzt Google Daten von Websites
            </ExternalLink>
            .
          </p>
        </>
      ),
      en: (
        <>
          <p>
            With your consent we use Google Analytics 4, a web analytics service of {GOOGLE} (“Google”). It shows us
            how the website is used — for example which pages and mission updates are read, how visitors find us and
            which devices they use — so we can improve content and navigation.
          </p>
          <dl className="legal-facts">
            <div>
              <dt>Data processed</dt>
              <dd>
                Pseudonymous online identifiers (from the cookies listed above), pages visited and time spent, referring
                website, approximate location (country/region, derived from the IP address), browser, operating system,
                device type and screen resolution. Google Analytics 4 does not log or store IP addresses. Google signals
                and all advertising features are switched off, and we do not combine this data with other data.
              </dd>
            </div>
            <div>
              <dt>Legal basis</dt>
              <dd>
                Your consent, Art. 6 (1)(a) GDPR and § 25 (1) TDDDG. The Google tag loads only after you consent; before
                that, no connection to Google is made. Google Consent Mode passes your choice on to Google.
              </dd>
            </div>
            <div>
              <dt>Processor and transfers</dt>
              <dd>
                Google processes the data on our behalf (Art. 28 GDPR). Data may be transferred to Google LLC in the
                USA; Google LLC is certified under the EU–US Data Privacy Framework, so the transfer rests on the
                Commission’s adequacy decision (Art. 45 GDPR).
              </dd>
            </div>
            <div>
              <dt>Retention</dt>
              <dd>Event data is deleted automatically after {LEGAL.analyticsRetentionMonths} months.</dd>
            </div>
            <div>
              <dt>Withdrawal</dt>
              <dd>
                In the <SettingsLink lang="en" />. Switching analytics off stops all further collection and deletes the
                Google Analytics cookies set on this website.
              </dd>
            </div>
          </dl>
          <p>
            More in <ExternalLink href="https://policies.google.com/privacy">Google’s privacy policy</ExternalLink> and{' '}
            <ExternalLink href="https://policies.google.com/technologies/partner-sites">
              how Google uses information from sites that use its services
            </ExternalLink>
            .
          </p>
        </>
      ),
    },
  },
  {
    id: 'external-media',
    title: { de: 'Eingebettete Videos (YouTube)', en: 'Embedded videos (YouTube)' },
    body: {
      de: (
        <>
          <p>
            Einige Mission Updates enthalten Videos, die auf YouTube liegen, einem Dienst der {GOOGLE}. Wir binden sie im
            erweiterten Datenschutzmodus (youtube-nocookie.com) ein. Ein Video wird erst geladen, wenn Sie auf
            „Play video“ klicken oder im Einwilligungs-Panel „External media“ (externe Medien) erlaubt haben; bis dahin baut Ihr Browser
            keine Verbindung zu YouTube auf.
          </p>
          <p>
            Sobald ein Video geladen wird, erhält Google Informationen wie Ihre IP-Adresse, die aufgerufene Seite und
            Geräteinformationen; YouTube kann Cookies oder ähnliche Daten auf Ihrem Gerät speichern, insbesondere beim
            Abspielen. Sind Sie bei einem Google-Konto angemeldet, kann Google die Wiedergabe diesem Konto zuordnen.
            Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Eine Übermittlung in
            die USA ist möglich; die Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert. Für diese
            Verarbeitung ist Google nach seiner eigenen{' '}
            <ExternalLink href="https://policies.google.com/privacy?hl=de">Datenschutzerklärung</ExternalLink>{' '}
            verantwortlich. Widerruf jederzeit über die <SettingsLink lang="de" />.
          </p>
          <p>
            Bettet ein Beitrag stattdessen ein Vimeo-Video ein, gilt dasselbe Klick-zum-Laden-Prinzip; Anbieter ist dann
            die Vimeo.com, Inc. (USA) nach ihrer eigenen Datenschutzerklärung.
          </p>
        </>
      ),
      en: (
        <>
          <p>
            Some mission updates contain videos hosted on YouTube, a service of {GOOGLE}. We embed them in YouTube’s
            privacy-enhanced mode (youtube-nocookie.com). A video loads only after you press “Play video” or have
            allowed “External media” in the consent panel; until then your browser makes no connection to YouTube.
          </p>
          <p>
            Once a video loads, Google receives information such as your IP address, the page you are on and device
            information, and YouTube may store cookies or similar data on your device, particularly when you play it. If
            you are signed in to a Google account, Google can link the playback to that account. The legal basis is your
            consent (Art. 6 (1)(a) GDPR, § 25 (1) TDDDG). Data may be transferred to the USA; Google LLC is certified
            under the EU–US Data Privacy Framework. Google is responsible for this processing under its own{' '}
            <ExternalLink href="https://policies.google.com/privacy">privacy policy</ExternalLink>. You can withdraw
            consent at any time in the <SettingsLink lang="en" />.
          </p>
          <p>
            If a story embeds a Vimeo video instead, the same click-to-load principle applies; the provider is then
            Vimeo.com, Inc. (USA), under its own privacy policy.
          </p>
        </>
      ),
    },
  },
  {
    id: 'links',
    title: { de: 'Links zu sozialen Netzwerken', en: 'Links to social networks' },
    body: {
      de: (
        <p>
          Auf unsere Profile bei LinkedIn, YouTube und GitHub sowie auf Partner-Websites verweisen wir mit einfachen
          Links. Solange Sie unsere Seiten nur ansehen, werden keine Daten an diese Dienste übertragen. Erst wenn Sie
          einen Link anklicken, öffnet Ihr Browser die andere Website; für die Verarbeitung Ihrer Daten dort ist deren
          Betreiber verantwortlich.
        </p>
      ),
      en: (
        <p>
          We link to our profiles on LinkedIn, YouTube and GitHub and to partner websites with ordinary links. While you
          are only viewing our pages, no data is sent to these services. Only when you click a link does your browser
          open the other website, whose operator is then responsible for processing your data there.
        </p>
      ),
    },
  },
  {
    id: 'people',
    title: { de: 'Teammitglieder auf dieser Website', en: 'Team members on this website' },
    body: {
      de: (
        <p>
          Unsere Teamseiten zeigen Namen, Rollen, Fotos und kurze Biografien aktueller und ehemaliger Mitglieder; die
          Mission Updates berichten über Aktivitäten des Teams. Teammitglieder, die ihr Profil ändern oder entfernen
          lassen möchten, schreiben jederzeit an <LegalEmail />. Inhalte und Bilder werden in unserem
          Content-Management-System verwaltet, das{' '}
          {selfHosted ? 'ebenfalls auf unserem eigenen Server läuft' : 'ebenfalls bei Netlify gehostet wird'}; Zugang zu
          Mission Control haben
          nur berechtigte Teammitglieder.
        </p>
      ),
      en: (
        <p>
          Our team pages show names, roles, photos and short biographies of current and former members, and the mission
          updates report on team activities. Team members who want their profile changed or removed can write to{' '}
          <LegalEmail /> at any time. Content and images are managed in our content management system, which{' '}
          {selfHosted ? 'also runs on our own server' : 'is also hosted by Netlify'}; access to Mission Control is
          limited to authorised team members.
        </p>
      ),
    },
  },
  {
    id: 'security',
    title: { de: 'Datensicherheit', en: 'Data security' },
    body: {
      de: (
        <p>
          Alle Seiten werden verschlüsselt übertragen (HTTPS/TLS) — erkennbar am Schloss-Symbol in der Adresszeile Ihres
          Browsers. Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre Daten vor Verlust und
          unbefugtem Zugriff zu schützen.
        </p>
      ),
      en: (
        <p>
          All pages are transmitted in encrypted form (HTTPS/TLS), shown by the padlock icon in your browser’s address
          bar. We take appropriate technical and organisational measures to protect your data against loss and
          unauthorised access.
        </p>
      ),
    },
  },
  {
    id: 'rights',
    title: { de: 'Ihre Rechte', en: 'Your rights' },
    body: {
      de: (
        <>
          <p>Nach der DSGVO haben Sie gegenüber uns folgende Rechte:</p>
          <ul className="legal-list">
            <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <div className="legal-callout">
            <strong>Widerspruchsrecht (Art. 21 DSGVO)</strong>
            <p>
              Soweit wir Daten auf Grundlage berechtigter Interessen verarbeiten (Art. 6 Abs. 1 lit. f DSGVO), können
              Sie dieser Verarbeitung aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit
              widersprechen. Wir verarbeiten die Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige
              Gründe nachweisen, die Ihre Interessen überwiegen, oder die Verarbeitung dient der Geltendmachung,
              Ausübung oder Verteidigung von Rechtsansprüchen.
            </p>
          </div>
          <p>
            Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
            Zuständig ist der {SUPERVISORY_AUTHORITY.name.de}, {SUPERVISORY_AUTHORITY.street},{' '}
            {SUPERVISORY_AUTHORITY.city},{' '}
            <ExternalLink href={SUPERVISORY_AUTHORITY.url}>tlfdi.de</ExternalLink>.
          </p>
        </>
      ),
      en: (
        <>
          <p>Under the GDPR you have the following rights towards us:</p>
          <ul className="legal-list">
            <li>Access to the data we hold about you (Art. 15 GDPR)</li>
            <li>Rectification of inaccurate data (Art. 16 GDPR)</li>
            <li>Erasure (Art. 17 GDPR) and restriction of processing (Art. 18 GDPR)</li>
            <li>Data portability (Art. 20 GDPR)</li>
            <li>Withdrawal of consent with effect for the future (Art. 7 (3) GDPR)</li>
          </ul>
          <div className="legal-callout">
            <strong>Right to object (Art. 21 GDPR)</strong>
            <p>
              Where we process data on the basis of legitimate interests (Art. 6 (1)(f) GDPR), you may object to this
              processing at any time on grounds relating to your particular situation. We will then stop processing the
              data unless we can demonstrate compelling legitimate grounds that override your interests, or the
              processing serves the establishment, exercise or defence of legal claims.
            </p>
          </div>
          <p>
            You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR).
            The authority responsible for us is the {SUPERVISORY_AUTHORITY.name.en}, {SUPERVISORY_AUTHORITY.street},{' '}
            {SUPERVISORY_AUTHORITY.city}, Germany,{' '}
            <ExternalLink href={SUPERVISORY_AUTHORITY.url}>tlfdi.de</ExternalLink>.
          </p>
        </>
      ),
    },
  },
  {
    id: 'changes',
    title: { de: 'Änderungen', en: 'Changes to this policy' },
    body: {
      de: (
        <p>
          Wir passen diese Erklärung an, wenn sich unsere Website oder die Rechtslage ändert. Es gilt jeweils die hier
          veröffentlichte Fassung.
        </p>
      ),
      en: (
        <p>
          We update this policy when our website or the law changes. The version published here always applies.
        </p>
      ),
    },
  },
]

type PageProps = {
  searchParams: Promise<{ lang?: string | string[] }>
}

export default async function PrivacyPage({ searchParams }: PageProps) {
  const initialLang: LegalLang = (await searchParams).lang === 'de' ? 'de' : 'en'

  return (
    <PageShell>
      <JsonLd data={webPageJsonLd({ dateModified: LEGAL_UPDATED, description: DESCRIPTION, name: 'Privacy policy', path: '/datenschutz' })} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Privacy policy' }])} />
      <LegalDocument
        eyebrow={{ de: 'Rechtliches // Datenschutz', en: 'Legal // Privacy' }}
        initialLang={initialLang}
        lead={{
          de: (
            <p>
              Welche Daten beim Besuch dieser Website anfallen, wofür wir sie nutzen und wie Sie selbst entscheiden. Ihre
              Einwilligung verwalten Sie jederzeit über die <SettingsLink lang="de" />.
            </p>
          ),
          en: (
            <p>
              What data a visit to this website involves, what we use it for, and how you stay in charge. Manage your
              consent at any time in the <SettingsLink lang="en" />.
            </p>
          ),
        }}
        sections={sections}
        title={{ de: ['Datenschutz-', 'erklärung.'], en: ['Privacy', 'policy.'] }}
        updated={LEGAL_UPDATED}
      />
    </PageShell>
  )
}
