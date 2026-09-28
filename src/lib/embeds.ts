export type EmbedProvider = {
  /** Company that receives the visitor's data when the player loads. */
  company: string
  key: 'youtube' | 'vimeo' | 'other'
  name: string
}

const hostOf = (src: string) => {
  try {
    return new URL(src).hostname.toLowerCase()
  } catch {
    return ''
  }
}

const isYouTubeHost = (host: string) =>
  host === 'youtu.be' || /(^|\.)youtube(-nocookie)?\.com$/.test(host)

export function embedProvider(src: string): EmbedProvider {
  const host = hostOf(src)
  if (isYouTubeHost(host)) return { company: 'Google', key: 'youtube', name: 'YouTube' }
  if (/(^|\.)vimeo\.com$/.test(host)) return { company: 'Vimeo', key: 'vimeo', name: 'Vimeo' }
  return { company: host || 'a third party', key: 'other', name: host || 'an external site' }
}

/**
 * The player URL in its most privacy-friendly form: YouTube through youtube-nocookie.com
 * (privacy-enhanced mode, from embed, watch or youtu.be links), Vimeo with `dnt=1`.
 */
export function privacyEnhancedEmbedUrl(src: string, { autoplay = false } = {}): string {
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return src
  }
  const host = url.hostname.toLowerCase()

  if (isYouTubeHost(host)) {
    const id =
      host === 'youtu.be'
        ? url.pathname.slice(1)
        : url.pathname.startsWith('/embed/')
          ? url.pathname.slice('/embed/'.length)
          : url.searchParams.get('v') ?? ''
    if (id) {
      const params = new URLSearchParams(url.search)
      params.delete('v')
      url = new URL(`https://www.youtube-nocookie.com/embed/${id.split('/')[0]}`)
      params.forEach((value, key) => url.searchParams.set(key, value))
      url.searchParams.set('rel', '0')
    }
  } else if (/(^|\.)vimeo\.com$/.test(host)) {
    url.searchParams.set('dnt', '1')
  }

  if (autoplay) url.searchParams.set('autoplay', '1')
  return url.toString()
}
