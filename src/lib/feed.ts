import type { NewsStory } from './fallbackNews'
import { absoluteUrl, DEFAULT_DESCRIPTION, metadataDescription, SITE_EMAIL, SITE_NAME } from './seo'

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const rfc822 = (value: string) => {
  const time = Date.parse(value)
  return (Number.isFinite(time) ? new Date(time) : new Date()).toUTCString()
}

const MIME_BY_EXTENSION: Record<string, string> = { jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }

/** RSS 2.0 feed of the mission updates, newest first — every CMS story joins it on publication. */
export function newsFeedXml(stories: NewsStory[]): string {
  const items = stories.map((story) => {
    const url = absoluteUrl(`/news/${story.slug}`)
    const extension = story.image.split(/[?#]/)[0].split('.').pop()?.toLowerCase() ?? ''
    const body = story.body.map((paragraph) => `<p>${escapeXml(paragraph.replace(/^##\s+/, ''))}</p>`).join('')
    return [
      '<item>',
      `<title>${escapeXml(story.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<pubDate>${rfc822(story.publishedAt)}</pubDate>`,
      story.category ? `<category>${escapeXml(story.category)}</category>` : '',
      `<dc:creator>${escapeXml(story.author ?? SITE_NAME)}</dc:creator>`,
      `<description>${escapeXml(metadataDescription(story.seoDescription || story.excerpt, 300))}</description>`,
      `<content:encoded><![CDATA[${body.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>`,
      MIME_BY_EXTENSION[extension]
        ? `<media:content medium="image" type="${MIME_BY_EXTENSION[extension]}" url="${escapeXml(absoluteUrl(story.image))}"><media:description>${escapeXml(story.imageAlt)}</media:description></media:content>`
        : '',
      '</item>',
    ].join('')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">',
    '<channel>',
    `<title>${escapeXml(`${SITE_NAME} — Mission updates`)}</title>`,
    `<link>${escapeXml(absoluteUrl('/news'))}</link>`,
    `<atom:link href="${escapeXml(absoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml"/>`,
    `<description>${escapeXml(DEFAULT_DESCRIPTION)}</description>`,
    '<language>en</language>',
    `<managingEditor>${escapeXml(`${SITE_EMAIL} (${SITE_NAME})`)}</managingEditor>`,
    `<image><url>${escapeXml(absoluteUrl('/media/cropped-falcon-1.png'))}</url><title>${escapeXml(`${SITE_NAME} — Mission updates`)}</title><link>${escapeXml(absoluteUrl('/news'))}</link></image>`,
    stories[0] ? `<lastBuildDate>${rfc822(stories[0].publishedAt)}</lastBuildDate>` : '',
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n')
}
