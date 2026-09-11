export function formatNewsDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .toUpperCase()
    // ICU renders September as "Sept" in en-GB; keep every month at three letters.
    .replace(/\bSEPT\b/, 'SEP')
}

/** Reading time in whole minutes at ~220 words per minute, never below 1. */
export function readingTimeMinutes(paragraphs: string[]) {
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
