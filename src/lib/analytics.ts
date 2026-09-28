/**
 * Google Analytics 4, loaded only after the visitor opts in ("basic" consent mode): before
 * consent no request reaches Google, not even for gtag.js. Page views on client-side
 * navigation are counted by GA4's enhanced measurement (browser-history events), which is on
 * by default for web data streams.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-QS9F1ZSDRM'
export const GA_SCRIPT_ID = 'google-analytics'

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
    [disableFlag: `ga-disable-${string}`]: boolean | undefined
  }
}

const isLocalHost = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.localhost')

/** The gtag stub from Google's snippet, with every Consent Mode v2 signal denied by default. */
function ensureGtag(): Gtag {
  if (window.gtag) return window.gtag
  window.dataLayer = window.dataLayer || []
  // gtag.js reads `arguments` objects from the dataLayer, not arrays — keep the snippet's shape.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('consent', 'default', {
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    analytics_storage: 'denied',
  })
  window.gtag('set', 'ads_data_redaction', true)
  return window.gtag
}

export function enableAnalytics() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false
  const gtag = ensureGtag()
  gtag('consent', 'update', { analytics_storage: 'granted' })
  if (document.getElementById(GA_SCRIPT_ID)) return

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    // Local sessions show up in GA's DebugView, so a dev check never looks like real traffic.
    ...(isLocalHost(window.location.hostname) ? { debug_mode: true } : {}),
  })
  const script = document.createElement('script')
  script.async = true
  script.id = GA_SCRIPT_ID
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
  document.head.appendChild(script)
}

/** Withdrawal: stop all further hits and delete the GA cookies this site set. */
export function disableAnalytics() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  clearAnalyticsCookies()
}

/** `_ga`, `_ga_<stream>` and legacy `_gid`/`_gat*`, on the host and every parent domain gtag may have used. */
export function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name) && /^(_ga($|_)|_gid$|_gat)/.test(name!))
  if (names.length === 0) return

  const labels = window.location.hostname.split('.')
  const domains = [''].concat(labels.slice(0, -1).map((_, index) => `; domain=.${labels.slice(index).join('.')}`))
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  for (const name of names) {
    for (const domain of domains) document.cookie = `${name}=; ${expired}${domain}`
  }
}
