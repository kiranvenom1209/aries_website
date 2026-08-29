const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

export const validateSafeURL = (value: unknown): string | true => {
  if (value === undefined || value === null || value === '') return true
  if (typeof value !== 'string') return 'Enter a valid URL.'

  const candidate = value.trim()

  if (candidate.startsWith('/') && !candidate.startsWith('//')) return true
  if (candidate.startsWith('#') && candidate.length > 1) return true

  try {
    const parsed = new URL(candidate)

    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return 'Only internal paths and HTTP(S) URLs are allowed.'
    }

    if (parsed.username || parsed.password) {
      return 'URLs containing embedded credentials are not allowed.'
    }

    return true
  } catch {
    return 'Enter an internal path or a complete HTTP(S) URL.'
  }
}
