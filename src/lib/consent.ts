/**
 * Visitor consent under § 25 TDDDG and Art. 6 (1)(a) GDPR. Nothing optional runs until the
 * visitor opts in, and the choice itself is kept in localStorage — a strictly necessary entry
 * (§ 25 (2) no. 2 TDDDG), so storing it needs no consent of its own.
 */
export const CONSENT_STORAGE_KEY = 'hsm-aries-consent'
/** Bump when a category is added or a provider changes: every visitor is asked again. */
export const CONSENT_VERSION = 1
/** A stored decision is asked again after twelve months. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

/** Window event that reopens the consent panel (footer link, privacy page). */
export const OPEN_CONSENT_EVENT = 'hsm-aries:open-consent'
const CHANGE_EVENT = 'hsm-aries:consent-change'

export type ConsentChoices = {
  /** Google Analytics 4. */
  analytics: boolean
  /** Third-party players (YouTube, Vimeo) embedded in news stories. */
  media: boolean
}

export type ConsentRecord = ConsentChoices & {
  decidedAt: string
  version: number
}

export const NO_CONSENT: ConsentChoices = { analytics: false, media: false }
export const FULL_CONSENT: ConsentChoices = { analytics: true, media: true }

/** A stored decision, or null when there is none, it is malformed, outdated or expired. */
export function parseConsent(raw: string | null, now = Date.now()): ConsentRecord | null {
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return null
    const { analytics, decidedAt, media, version } = value as Record<string, unknown>
    if (version !== CONSENT_VERSION || typeof decidedAt !== 'string') return null
    if (typeof analytics !== 'boolean' || typeof media !== 'boolean') return null
    const decided = Date.parse(decidedAt)
    if (!Number.isFinite(decided) || now - decided > CONSENT_MAX_AGE_MS || decided - now > 60_000) return null
    return { analytics, decidedAt, media, version }
  } catch {
    return null
  }
}

// Fallback when storage is blocked (privacy mode, sandboxed frame): the choice holds for this
// page view only, and the panel returns on the next load.
let memoryRaw: string | null | undefined

const readRaw = () => {
  if (memoryRaw !== undefined) return memoryRaw
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch {
    return null
  }
}

let cachedRaw: string | null | undefined
let cachedRecord: ConsentRecord | null = null

/** Current decision; the parsed record is cached per raw string so snapshots stay referentially stable. */
export function readConsent(): ConsentRecord | null {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedRecord = parseConsent(raw)
  }
  return cachedRecord
}

export function writeConsent(choices: ConsentChoices): ConsentRecord {
  const record: ConsentRecord = {
    analytics: choices.analytics,
    decidedAt: new Date().toISOString(),
    media: choices.media,
    version: CONSENT_VERSION,
  }
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
  } catch {
    memoryRaw = JSON.stringify(record)
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
  return record
}

export function subscribeConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === CONSENT_STORAGE_KEY) onChange()
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
