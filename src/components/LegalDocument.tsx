'use client'

import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

export type LegalLang = 'de' | 'en'
export type Bilingual<T = ReactNode> = Record<LegalLang, T>

export type LegalSection = {
  body: Bilingual
  id: string
  title: Bilingual<string>
}

type LegalDocumentProps = {
  eyebrow: Bilingual<string>
  initialLang: LegalLang
  lead: Bilingual
  sections: LegalSection[]
  title: Bilingual<[string, string]>
  /** ISO date of the last change to the text. */
  updated: string
}

const UI = {
  de: {
    appliesTo: 'Gilt für',
    contents: 'Inhalt',
    language: 'Sprache',
    note: 'Die deutsche Fassung ist maßgeblich.',
    updated: 'Stand',
  },
  en: {
    appliesTo: 'Applies to',
    contents: 'Contents',
    language: 'Language',
    note: 'In case of doubt, the German version prevails.',
    updated: 'Last updated',
  },
} as const

const formatDate = (value: string, lang: LegalLang) =>
  new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(value))

/**
 * Bilingual legal text (Impressum, privacy policy). The language switch swaps the text in place
 * and mirrors the choice into `?lang=de` so the German version has a shareable address.
 */
export function LegalDocument({ eyebrow, initialLang, lead, sections, title, updated }: LegalDocumentProps) {
  const [lang, setLang] = useState<LegalLang>(initialLang)
  const pathname = usePathname()
  const ui = UI[lang]

  const choose = (next: LegalLang) => {
    setLang(next)
    window.history.replaceState(null, '', `${pathname}${next === 'de' ? '?lang=de' : ''}${window.location.hash}`)
  }

  return (
    <article className="legal-doc" lang={lang}>
      <header className="legal-hero">
        <span aria-hidden="true" className="legal-hero__grid" />
        <div className="legal-hero__copy">
          <span className="hero__eyebrow">{eyebrow[lang]}</span>
          <h1>
            {title[lang][0]}
            <br />
            <em>{title[lang][1]}</em>
          </h1>
          <div className="legal-hero__lead">{lead[lang]}</div>
        </div>
        <aside className="legal-hero__panel">
          <dl>
            <div>
              <dt>{ui.updated}</dt>
              <dd>
                <time dateTime={updated}>{formatDate(updated, lang)}</time>
              </dd>
            </div>
            <div>
              <dt>{ui.appliesTo}</dt>
              <dd>hsmaries.space</dd>
            </div>
          </dl>
          <div aria-label={ui.language} className="legal-lang" role="group">
            <button aria-pressed={lang === 'en'} lang="en" onClick={() => choose('en')} type="button">
              English
            </button>
            <button aria-pressed={lang === 'de'} lang="de" onClick={() => choose('de')} type="button">
              Deutsch
            </button>
          </div>
          <p className="legal-hero__note">{ui.note}</p>
        </aside>
      </header>

      <div className="legal-body">
        <nav aria-label={ui.contents} className="legal-toc">
          <span>{ui.contents}</span>
          <ol>
            {sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {section.title[lang]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="legal-sections">
          {sections.map((section, index) => {
            const number = String(index + 1).padStart(2, '0')
            return (
              <section aria-labelledby={`${section.id}-title`} className="legal-section" id={section.id} key={section.id}>
                <header className="legal-section__head">
                  <span aria-hidden="true">{number}</span>
                  <h2 data-section-label={`${number} / ${section.title[lang]}`} id={`${section.id}-title`}>
                    {section.title[lang]}
                  </h2>
                </header>
                <div className="legal-section__body">{section.body[lang]}</div>
              </section>
            )
          })}
        </div>
      </div>
    </article>
  )
}
