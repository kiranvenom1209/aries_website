import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { clearAnalyticsCookies, disableAnalytics, enableAnalytics, GA_MEASUREMENT_ID, GA_SCRIPT_ID } from '@/lib/analytics'
import {
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  parseConsent,
  readConsent,
  subscribeConsent,
  writeConsent,
} from '@/lib/consent'
import { embedProvider, privacyEnhancedEmbedUrl } from '@/lib/embeds'

const record = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({ analytics: true, decidedAt: new Date().toISOString(), media: false, version: CONSENT_VERSION, ...overrides })

describe('consent record', () => {
  beforeEach(() => window.localStorage.clear())

  it('accepts a current, well-formed decision', () => {
    expect(parseConsent(record())).toMatchObject({ analytics: true, media: false })
  })

  it('asks again when the record is missing, malformed, outdated or expired', () => {
    expect(parseConsent(null)).toBeNull()
    expect(parseConsent('{not json')).toBeNull()
    expect(parseConsent(record({ analytics: 'yes' }))).toBeNull()
    expect(parseConsent(record({ version: CONSENT_VERSION + 1 }))).toBeNull()
    const expired = new Date(Date.now() - CONSENT_MAX_AGE_MS - 1000).toISOString()
    expect(parseConsent(record({ decidedAt: expired }))).toBeNull()
  })

  it('stores a choice, notifies listeners and returns a stable snapshot', () => {
    let calls = 0
    const unsubscribe = subscribeConsent(() => (calls += 1))
    writeConsent({ analytics: false, media: true })
    unsubscribe()
    expect(calls).toBe(1)
    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({ analytics: false, media: true })
    expect(readConsent()).toBe(readConsent())
  })
})

describe('Google Analytics loading', () => {
  afterEach(() => {
    document.getElementById(GA_SCRIPT_ID)?.remove()
    delete window.gtag
    delete window.dataLayer
  })

  it('injects nothing until consent is given', () => {
    disableAnalytics()
    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull()
    expect(window.gtag).toBeUndefined()
  })

  it('defaults every consent signal to denied before granting analytics and loading the tag once', () => {
    enableAnalytics()
    enableAnalytics()
    const scripts = document.querySelectorAll(`#${GA_SCRIPT_ID}`)
    expect(scripts).toHaveLength(1)
    expect((scripts[0] as HTMLScriptElement).src).toContain(`id=${GA_MEASUREMENT_ID}`)
    const commands = (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>))
    const defaults = commands.find(([command, type]) => command === 'consent' && type === 'default')
    expect(defaults?.[2]).toMatchObject({ ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' })
    const grantIndex = commands.findIndex(([command, type]) => command === 'consent' && type === 'update')
    const configIndex = commands.findIndex(([command]) => command === 'config')
    expect(grantIndex).toBeGreaterThan(commands.indexOf(defaults!))
    expect(configIndex).toBeGreaterThan(grantIndex)
    expect(commands[configIndex][2]).toMatchObject({ allow_google_signals: false, allow_ad_personalization_signals: false })
  })

  it('stops collection and removes the GA cookies on withdrawal', () => {
    document.cookie = '_ga=GA1.1.123; path=/'
    document.cookie = `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')}=GS1.1; path=/`
    document.cookie = 'unrelated=1; path=/'
    enableAnalytics()
    disableAnalytics()
    expect(window[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true)
    expect(document.cookie).not.toMatch(/_ga/)
    expect(document.cookie).toContain('unrelated=1')
    clearAnalyticsCookies()
  })
})

describe('two-click embeds', () => {
  it('moves YouTube to privacy-enhanced mode from embed, watch and short links', () => {
    for (const src of [
      'https://www.youtube.com/embed/8-6aMd6mBMg',
      'https://www.youtube.com/watch?v=8-6aMd6mBMg',
      'https://youtu.be/8-6aMd6mBMg',
    ]) {
      const url = new URL(privacyEnhancedEmbedUrl(src))
      expect(url.hostname).toBe('www.youtube-nocookie.com')
      expect(url.pathname).toBe('/embed/8-6aMd6mBMg')
    }
    expect(privacyEnhancedEmbedUrl('https://www.youtube.com/embed/abc', { autoplay: true })).toContain('autoplay=1')
  })

  it('asks Vimeo not to track and names the provider for the gate', () => {
    expect(privacyEnhancedEmbedUrl('https://player.vimeo.com/video/1')).toContain('dnt=1')
    expect(embedProvider('https://www.youtube.com/embed/x')).toMatchObject({ company: 'Google', name: 'YouTube' })
    expect(embedProvider('https://player.vimeo.com/video/1').name).toBe('Vimeo')
  })
})
