import type { MetadataRoute } from 'next'

import { getGalleryImages } from '@/lib/gallery.server'
import { getNews } from '@/lib/news'
import { getTeam, type TeamMember } from '@/lib/team'
import { profileDate, profileImage } from '@/lib/teamSeo'
import { LEGAL_UPDATED } from '@/lib/legal'
import { absoluteUrl, SITE_UPDATED } from '@/lib/seo'
import { SITE_PAGES } from '@/lib/sitePages'

export function teamSitemapEntries(members: TeamMember[]): MetadataRoute.Sitemap {
  return members.map((member) => {
    const lastModified = profileDate(member.updatedAt)
    const image = profileImage(member)
    return {
      url: absoluteUrl(`/team/${member.slug}`),
      ...(lastModified ? { lastModified } : {}),
      ...(image ? { images: [image] } : {}),
    }
  })
}

export async function getTeamSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  return teamSitemapEntries(await getTeam())
}

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const [stories, galleryImages, members] = await Promise.all([getNews(100), getGalleryImages(), getTeam()])
  const lastPublished = stories[0]?.publishedAt ?? SITE_UPDATED
  const lastTeamUpdate = [profileDate(SITE_UPDATED)!, ...members.map((member) => profileDate(member.updatedAt)).filter((date): date is string => Boolean(date))].sort().at(-1)!

  // Pages that change with the CMS take their date from it; the rest from the static stamps.
  const lastModifiedFor: Record<string, string> = {
    '/': lastPublished,
    '/datenschutz': LEGAL_UPDATED,
    '/impressum': LEGAL_UPDATED,
    '/news': lastPublished,
    '/team': lastTeamUpdate,
  }
  const staticRoutes: MetadataRoute.Sitemap = SITE_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: lastModifiedFor[page.path] ?? SITE_UPDATED,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    ...(page.path === '/gallery' ? { images: galleryImages.map((image) => absoluteUrl(image.src)) } : {}),
  }))

  const newsRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: absoluteUrl(`/news/${story.slug}`),
    lastModified: story.publishedAt,
    changeFrequency: 'yearly',
    priority: 0.7,
    images: [absoluteUrl(story.image)],
  }))

  const memberRoutes = teamSitemapEntries(members)
  return [...staticRoutes, ...newsRoutes, ...memberRoutes]
}

const escapeXml = (value: string | number) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export const sitemapSections = ['/page-sitemap.xml', '/post-sitemap.xml', '/team-sitemap.xml']

export function sitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries.map((entry) => {
    const lastModified = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified
    return `<url><loc>${escapeXml(entry.url)}</loc>` +
      (lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : '') +
      (entry.changeFrequency ? `<changefreq>${escapeXml(entry.changeFrequency)}</changefreq>` : '') +
      (entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : '') +
      (entry.images ?? []).map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`).join('') +
      '</url>'
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`
}

export function sitemapIndexXml(): string {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemapSections.map((section) => `<sitemap><loc>${escapeXml(absoluteUrl(section))}</loc></sitemap>`).join('\n') +
    '\n</sitemapindex>'
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}

export async function sectionSitemapResponse(section: 'pages' | 'posts'): Promise<Response> {
  const entries = await getSitemapEntries()
  const newsPrefix = absoluteUrl('/news/')
  const teamPrefix = absoluteUrl('/team/')
  return xmlResponse(sitemapXml(entries.filter((entry) => section === 'posts'
    ? entry.url.startsWith(newsPrefix)
    : !entry.url.startsWith(newsPrefix) && !entry.url.startsWith(teamPrefix))))
}
