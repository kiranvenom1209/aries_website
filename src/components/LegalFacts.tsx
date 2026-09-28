import type { ReactNode } from 'react'

import { LEGAL } from '@/lib/legal'
import type { LegalLang } from './LegalDocument'

/** Visible marker for a fact the team still has to supply (see src/lib/legal.ts). */
export function LegalPending({ children }: { children: ReactNode }) {
  return <mark className="legal-pending">{children}</mark>
}

export function LegalAddress({ lang }: { lang: LegalLang }) {
  return (
    <address className="legal-address">
      <strong>{LEGAL.name}</strong>
      <span>
        {lang === 'de'
          ? `Studentisches Raumfahrtrobotik-Team der ${LEGAL.institution}`
          : `Student space-robotics team of ${LEGAL.institution}`}
      </span>
      <span>c/o {LEGAL.institution}</span>
      <span>{LEGAL.street}</span>
      <span>
        {LEGAL.postalCode} {LEGAL.city}
      </span>
      <span>{LEGAL.country[lang]}</span>
    </address>
  )
}

export function ResponsiblePerson({ lang }: { lang: LegalLang }) {
  const person = LEGAL.responsiblePerson
  if (!person) {
    return (
      <LegalPending>
        {lang === 'de'
          ? 'Noch einzutragen: Vor- und Nachname der verantwortlichen Person'
          : 'To be confirmed: full name of the responsible person'}
      </LegalPending>
    )
  }
  return (
    <>
      {person.name}
      {person.role ? `, ${person.role[lang]}` : null}
    </>
  )
}

export function LegalEmail() {
  return <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
}
