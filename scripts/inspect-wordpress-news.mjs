import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

const INSERT_PREFIX = 'INSERT INTO `wp_x16fnt5f5z_posts` VALUES '

/**
 * Parse the single VALUES tuple used by the WordPress SQL export. This parser is
 * intentionally scoped to wp_posts and never reads users, forms, logs, or options.
 */
function parseValuesTuple(source) {
  const values = []
  let current = ''
  let quoted = false
  let escaping = false

  const start = source.indexOf('(')
  const end = source.lastIndexOf(')')
  if (start === -1 || end === -1 || end <= start) return null

  for (let index = start + 1; index < end; index += 1) {
    const character = source[index]

    if (escaping) {
      const decoded = {
        0: '\0',
        b: '\b',
        n: '\n',
        r: '\r',
        t: '\t',
        Z: '\x1a',
      }[character]
      current += decoded ?? character
      escaping = false
      continue
    }

    if (character === '\\' && quoted) {
      escaping = true
      continue
    }

    if (character === "'") {
      quoted = !quoted
      continue
    }

    if (character === ',' && !quoted) {
      values.push(current === 'NULL' ? null : current)
      current = ''
      continue
    }

    current += character
  }

  values.push(current === 'NULL' ? null : current)
  return values
}

function decodeEntities(value) {
  return value
    .replaceAll('&#8217;', '’')
    .replaceAll('&#8211;', '–')
    .replaceAll('&#8212;', '—')
    .replaceAll('&#038;', '&')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function plainText(value) {
  return decodeEntities(value)
    .replace(/<!--.*?-->/gs, ' ')
    .replace(/<script\b[^>]*>.*?<\/script>/gis, ' ')
    .replace(/<style\b[^>]*>.*?<\/style>/gis, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function inspectPublishedNews(sqlPath) {
  const records = []
  const lines = createInterface({
    input: createReadStream(sqlPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  for await (const line of lines) {
    if (!line.startsWith(INSERT_PREFIX)) continue
    const values = parseValuesTuple(line)

    if (
      !values ||
      values.length !== 23 ||
      values[7] !== 'publish' ||
      values[10] !== '' ||
      values[20] !== 'post'
    ) {
      continue
    }

    records.push({
      id: Number(values[0]),
      publishedAt: `${values[3].replace(' ', 'T')}Z`,
      title: decodeEntities(values[5]),
      slug: values[11],
      excerpt: plainText(values[6]),
      body: plainText(values[4]),
      sourceUrl: values[18],
    })
  }

  return records.sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sqlPath = process.argv[2]
  if (!sqlPath) {
    throw new Error('Usage: node scripts/inspect-wordpress-news.mjs <database.sql>')
  }

  const records = await inspectPublishedNews(sqlPath)
  process.stdout.write(`${JSON.stringify(records, null, 2)}\n`)
}
