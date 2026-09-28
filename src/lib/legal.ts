import { SITE_EMAIL, SITE_URL } from './seo'

/**
 * Facts the Impressum (§ 5 DDG, § 18 MStV) and the privacy policy (Art. 13 GDPR) are built
 * from. Everything here must be supplied by the team — nothing may be guessed. A `null` field
 * renders as a visible "to be confirmed" marker on the legal pages until it is filled in.
 */
export const LEGAL_UPDATED = '2026-09-28'

type Person = {
  name: string
  /** Role within the team, e.g. "Team lead". */
  role?: { de: string; en: string }
}

export const LEGAL = {
  name: 'HSM Aries',
  institution: 'Hochschule Schmalkalden',
  chair: 'Chair of Drive, Automation, and Robotics Technologies',
  street: 'Blechhammer 9',
  postalCode: '98574',
  city: 'Schmalkalden',
  country: { de: 'Deutschland', en: 'Germany' },
  email: SITE_EMAIL,
  contactPage: `${SITE_URL}/contact`,
  /**
   * The natural person who represents HSM Aries as service provider (§ 5 (1) no. 1 DDG) and
   * answers for its editorial content (§ 18 (2) MStV). Required before the pages are complete.
   */
  responsiblePerson: null as Person | null,
  /** Only if HSM Aries is a registered association (e.V.): register court and number (§ 5 (1) no. 4 DDG). */
  register: null as { court: string; number: string } | null,
  /** Only if a data protection officer is appointed for the team (or the university's DPO covers it). */
  dataProtectionOfficer: null as { email: string; name: string } | null,
  /** GA4 → Admin → Data collection → Data retention; keep this in step with the property setting. */
  analyticsRetentionMonths: 2,
} as const

/** Competent supervisory authority for a controller seated in Thuringia (Art. 77 GDPR). */
export const SUPERVISORY_AUTHORITY = {
  name: {
    de: 'Thüringer Landesbeauftragter für den Datenschutz und die Informationsfreiheit (TLfDI)',
    en: 'Thuringian State Commissioner for Data Protection and Freedom of Information (TLfDI)',
  },
  street: 'Häßlerstraße 8',
  city: '99096 Erfurt',
  url: 'https://www.tlfdi.de/',
} as const

export const legalPendingFields = () =>
  [LEGAL.responsiblePerson ? null : 'LEGAL.responsiblePerson'].filter((field): field is string => field !== null)
