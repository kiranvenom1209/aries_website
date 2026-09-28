'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

import { disableAnalytics, enableAnalytics, GA_MEASUREMENT_ID } from '@/lib/analytics'
import {
  FULL_CONSENT,
  NO_CONSENT,
  OPEN_CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoices,
} from '@/lib/consent'
import { useConsent } from '@/lib/useConsent'

type View = 'closed' | 'banner' | 'settings'
type Outcome = 'granted' | 'partial' | 'denied'

type Channel = {
  code: string
  details: string[]
  key: keyof ConsentChoices | 'essential'
  summary: string
  title: string
}

const CHANNELS: Channel[] = [
  {
    code: 'CH-01',
    details: [
      'Your choice here, stored in this browser for up to 12 months',
      'Mission Control login session — team members only',
      'Set by hsmaries.space itself; nothing is shared',
    ],
    key: 'essential',
    summary: 'Keeps the site running and remembers this decision. No tracking, no profiles.',
    title: 'Essential',
  },
  {
    code: 'CH-02',
    details: [
      'Google Analytics 4 · Google Ireland Limited, Dublin',
      `Cookies _ga and _ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')} · up to 2 years`,
      'IP addresses are not stored; Google signals and ad features are off',
      'Transfer to the USA possible (EU–US Data Privacy Framework)',
    ],
    key: 'analytics',
    summary: 'Counts visits and the pages people read, so we learn which rover stories land.',
    title: 'Analytics',
  },
  {
    code: 'CH-03',
    details: [
      'YouTube / Vimeo players inside mission dispatches',
      'YouTube runs in privacy-enhanced mode (youtube-nocookie.com)',
      'The provider receives your IP address once a player loads',
      'Transfer to the USA possible (EU–US Data Privacy Framework)',
    ],
    key: 'media',
    summary: 'Loads embedded videos straight away. Off means each video waits behind a click.',
    title: 'External media',
  },
]

const STATUS: Record<Outcome | 'idle', string> = {
  denied: 'Signal withheld · nothing transmitted',
  granted: 'Uplink granted · thank you',
  idle: 'Awaiting your call',
  partial: 'Selection saved · only what you allowed',
}

const SIGNAL_BARS = 36
const SHOW_DELAY_MS = 450
const EXIT_MS = 1150

const outcomeOf = (choices: ConsentChoices): Outcome =>
  choices.analytics && choices.media ? 'granted' : choices.analytics || choices.media ? 'partial' : 'denied'

/**
 * The consent panel (§ 25 TDDDG): shown on the first visit once the preloader has left, and
 * again from any "Cookie settings" control. Rejecting is exactly as prominent as accepting,
 * nothing is pre-selected, and Google Analytics loads only after an explicit yes.
 */
export function ConsentManager() {
  const consent = useConsent()
  const [view, setView] = useState<View>('closed')
  const [draft, setDraft] = useState<ConsentChoices>(NO_CONSENT)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [reopened, setReopened] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const exitTimerRef = useRef(0)
  const titleId = useId()
  const descriptionId = useId()

  // The stored decision drives the tag — also when it changes in another tab.
  useEffect(() => {
    if (consent === undefined) return
    if (consent?.analytics) enableAnalytics()
    else disableAnalytics()
  }, [consent])

  // First visit (or an expired / outdated decision): wait for the preloader to leave, then ask.
  useEffect(() => {
    if (consent !== null || view !== 'closed' || outcome) return
    // Payload's live preview renders the site in a frame; editors are not visitors.
    if (window.self !== window.top) return

    const root = document.documentElement
    let observer: MutationObserver | undefined
    let timer = 0
    const show = () => {
      timer = window.setTimeout(() => {
        setDraft(NO_CONSENT)
        setReopened(false)
        setView('banner')
      }, SHOW_DELAY_MS)
    }
    // SitePreloader marks <html> in its own effect; one frame later its class is reliable.
    const frame = window.requestAnimationFrame(() => {
      if (!root.classList.contains('preloader-active')) return show()
      observer = new MutationObserver(() => {
        if (root.classList.contains('preloader-active')) return
        observer?.disconnect()
        show()
      })
      observer.observe(root, { attributeFilter: ['class'], attributes: true })
    })
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [consent, outcome, view])

  // "Cookie settings" anywhere on the site reopens the panel on the channel list.
  useEffect(() => {
    const open = () => {
      window.clearTimeout(exitTimerRef.current)
      const active = document.activeElement
      returnFocusRef.current = active instanceof HTMLElement ? active : null
      const current = readConsent()
      setDraft(current ? { analytics: current.analytics, media: current.media } : NO_CONSENT)
      setOutcome(null)
      setReopened(true)
      setView('settings')
    }
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  // A reopened panel takes focus; the first-visit banner never steals it.
  useEffect(() => {
    if (view === 'settings' && reopened) headingRef.current?.focus({ preventScroll: true })
  }, [reopened, view])

  useEffect(() => () => window.clearTimeout(exitTimerRef.current), [])

  const close = () => {
    setView('closed')
    setOutcome(null)
    const target = returnFocusRef.current
    returnFocusRef.current = null
    if (target?.isConnected) target.focus({ preventScroll: true })
  }

  const decide = (choices: ConsentChoices) => {
    if (outcome) return
    setDraft(choices)
    setOutcome(outcomeOf(choices))
    writeConsent(choices)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    exitTimerRef.current = window.setTimeout(close, reducedMotion ? 350 : EXIT_MS)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || outcome) return
    if (reopened) {
      event.stopPropagation()
      close()
    } else if (view === 'settings') {
      event.stopPropagation()
      setView('banner')
    }
  }

  if (view === 'closed') return null

  const settings = view === 'settings'

  return (
    <section
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      aria-modal="false"
      className={`consent${settings ? ' consent--settings' : ''}`}
      data-outcome={outcome ?? undefined}
      onKeyDown={onKeyDown}
      role="dialog"
    >
      <div className="consent__frame">
        <span aria-hidden="true" className="consent__corner consent__corner--tl" />
        <span aria-hidden="true" className="consent__corner consent__corner--tr" />
        <span aria-hidden="true" className="consent__corner consent__corner--bl" />
        <span aria-hidden="true" className="consent__corner consent__corner--br" />
        <span aria-hidden="true" className="consent__scan" />

        <header className="consent__chrome">
          <span className="consent__channel">
            <i aria-hidden="true" className="consent__beacon" />
            Privacy uplink / {settings ? '02' : '01'}
          </span>
          <span className="consent__law">§ 25 TDDDG · GDPR</span>
          {reopened && !outcome ? (
            <button aria-label="Close cookie settings" className="consent__close" onClick={close} type="button">
              <span aria-hidden="true" />
            </button>
          ) : null}
        </header>

        <div aria-hidden="true" className="consent__signal">
          {Array.from({ length: SIGNAL_BARS }, (_, index) => (
            <i key={index} style={{ '--i': index } as CSSProperties} />
          ))}
        </div>

        <div className="consent__body">
          {settings ? (
            <>
              <h2 className="consent__title" id={titleId} ref={headingRef} tabIndex={-1}>
                Choose your <em>channels.</em>
              </h2>
              <p className="consent__copy" id={descriptionId}>
                Switch on only what you want. Everything optional starts off, and you can change it here at any time.
              </p>
              <ul className="consent__channels">
                {CHANNELS.map((channel) => {
                  const locked = channel.key === 'essential'
                  const on = locked || draft[channel.key as keyof ConsentChoices]
                  const labelId = `${titleId}-${channel.key}`
                  return (
                    <li className="consent-channel" data-on={on || undefined} key={channel.key}>
                      <div className="consent-channel__head">
                        <span className="consent-channel__code">{channel.code}</span>
                        <strong id={labelId}>{channel.title}</strong>
                        {locked ? (
                          <span className="consent-channel__locked">Always on</span>
                        ) : (
                          <button
                            aria-checked={on}
                            aria-labelledby={labelId}
                            className="consent-switch"
                            disabled={Boolean(outcome)}
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                [channel.key]: !current[channel.key as keyof ConsentChoices],
                              }))
                            }
                            role="switch"
                            type="button"
                          >
                            <span aria-hidden="true" className="consent-switch__track">
                              <span className="consent-switch__thumb" />
                            </span>
                            <span aria-hidden="true" className="consent-switch__state">{on ? 'On' : 'Off'}</span>
                          </button>
                        )}
                      </div>
                      <p className="consent-channel__summary">{channel.summary}</p>
                      <details className="consent-channel__details">
                        <summary>Details</summary>
                        <ul>
                          {channel.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <>
              <h2 className="consent__title" id={titleId} ref={headingRef} tabIndex={-1}>
                Permission to <em>transmit?</em>
              </h2>
              <p className="consent__copy" id={descriptionId}>
                We would like to use Google Analytics to count visits and see which rover stories people read. Nothing
                is sent to Google unless you say yes — and saying no works just as well.
              </p>
              <p className="consent__fine">
                Change your mind any time under <strong>Cookie settings</strong> in the footer.
              </p>
            </>
          )}
        </div>

        <div className={`consent__actions${settings ? ' consent__actions--three' : ''}`}>
          <button className="consent__button" disabled={Boolean(outcome)} onClick={() => decide(NO_CONSENT)} type="button">
            <span>Reject all</span>
          </button>
          {settings ? (
            <button className="consent__button" disabled={Boolean(outcome)} onClick={() => decide(draft)} type="button">
              <span>Save selection</span>
            </button>
          ) : null}
          <button className="consent__button" disabled={Boolean(outcome)} onClick={() => decide(FULL_CONSENT)} type="button">
            <span>Accept all</span>
          </button>
        </div>

        <footer className="consent__meta">
          <p aria-live="polite" className="consent__status" role="status">
            <span className="consent__status-label">Status //</span> {STATUS[outcome ?? 'idle']}
            {!outcome ? <i aria-hidden="true" className="consent__caret" /> : null}
          </p>
          <nav aria-label="Privacy information" className="consent__links">
            {settings ? (
              reopened ? null : (
                <button className="consent__link" disabled={Boolean(outcome)} onClick={() => setView('banner')} type="button">
                  ← Back
                </button>
              )
            ) : (
              <button className="consent__link" disabled={Boolean(outcome)} onClick={() => setView('settings')} type="button">
                Customise
              </button>
            )}
            <Link className="consent__link" href="/datenschutz">
              Privacy
            </Link>
            <Link className="consent__link" href="/impressum">
              Impressum
            </Link>
          </nav>
        </footer>
      </div>
    </section>
  )
}
