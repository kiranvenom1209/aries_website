import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/news', async () => {
  const { fallbackNews } = await import('@/lib/fallbackNews')
  return { getNews: async () => fallbackNews }
})
vi.mock('@/lib/gallery.server', () => ({
  getGalleryImages: async () => [{ src: '/api/media/file/gallery.jpg' }],
}))
vi.mock('@/lib/team', () => ({
  getTeam: async () => [{ slug: 'public-engineer', image: '/media/portrait.jpg', updatedAt: '2026-09-14T00:00:00Z' }, { slug: 'former-engineer', isAlumni: true, image: '/media/cropped-falcon-1.png', updatedAt: 'invalid' }],
}))
vi.mock('@payloadcms/next/withPayload', () => ({ withPayload: (config: unknown) => config }))

import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { GET as pageSitemap } from '@/app/page-sitemap.xml/route'
import { GET as postSitemap } from '@/app/post-sitemap.xml/route'
import { GET as teamSitemap } from '@/app/team-sitemap.xml/route'
import { GET as sitemapIndex } from '@/app/sitemap_index.xml/route'
import { sitemapXml } from '@/lib/sitemap'
import nextConfig from '../../next.config'

const parse = (xml: string) => {
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  expect(document.querySelector('parsererror')).toBeNull()
  return document
}
const locations = (document: Document) => [...document.querySelectorAll('url > loc')].map((node) => node.textContent)

describe('Sitemap migration compatibility', () => {
  it('serves a valid index referencing restored URLs and the dedicated team sitemap', async () => {
    const response = sitemapIndex()
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('application/xml')
    const document = parse(await response.text())
    expect(document.documentElement.localName).toBe('sitemapindex')
    expect([...document.querySelectorAll('sitemap > loc')].map((node) => node.textContent)).toEqual([
      'https://hsmaries.space/page-sitemap.xml',
      'https://hsmaries.space/post-sitemap.xml',
      'https://hsmaries.space/team-sitemap.xml',
    ])
  })

  it('covers every current sitemap URL exactly once across pages, posts and team profiles', async () => {
    const pages = parse(await (await pageSitemap()).text())
    const posts = parse(await (await postSitemap()).text())
    const pageUrls = locations(pages)
    const postUrls = locations(posts)
    const profiles = parse(await (await teamSitemap()).text())
    const profileUrls = locations(profiles)
    const combined = [...pageUrls, ...postUrls, ...profileUrls]
    expect(pageUrls).toHaveLength(10)
    expect(profileUrls).toEqual(['https://hsmaries.space/team/public-engineer', 'https://hsmaries.space/team/former-engineer'])
    const profileEntries = [...profiles.querySelectorAll('url')]
    expect(profileEntries[0].querySelector('lastmod')?.textContent).toBe('2026-09-14T00:00:00.000Z')
    expect(profileEntries[1].querySelector('lastmod')).toBeNull()
    expect(profileEntries[1].getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')).toHaveLength(0)
    expect(postUrls.length).toBeGreaterThan(0)
    expect(postUrls.every((url) => url?.startsWith('https://hsmaries.space/news/'))).toBe(true)
    expect(pageUrls.every((url) => !url?.includes('/news/'))).toBe(true)
    expect(new Set(combined).size).toBe(combined.length)
    expect(combined.sort()).toEqual((await sitemap()).map((entry) => entry.url).sort())
    expect(combined).not.toContain('https://hsmaries.space/login')
    expect(combined).not.toContain('https://hsmaries.space/thank-you')
    expect(pages.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')[0]?.textContent)
      .toBe('https://hsmaries.space/api/media/file/gallery.jpg')
  })

  it('escapes XML values and preserves image metadata and modification dates', () => {
    const url = 'https://hsmaries.space/news/example?a=1&b=<test>'
    const image = 'https://hsmaries.space/media/photo.jpg?a=1&b=2'
    const document = parse(sitemapXml([{ url, images: [image], lastModified: new Date('2026-09-14T00:00:00Z'), priority: 0 }]))
    expect(locations(document)).toEqual([url])
    expect(document.querySelector('lastmod')?.textContent).toBe('2026-09-14T00:00:00.000Z')
    expect(document.querySelector('priority')?.textContent).toBe('0')
    expect(document.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')[0]?.textContent).toBe(image)
  })

  it('advertises the restored index and permits public sitemap images through the API restriction', () => {
    const result = robots()
    expect(result.sitemap).toBe('https://hsmaries.space/sitemap_index.xml')
    expect(result.rules).toMatchObject({ allow: ['/', '/api/media/file/'], disallow: ['/admin/', '/api/'] })
  })

  it('redirects the retired author sitemap without losing existing article redirects', async () => {
    const redirects = await nextConfig.redirects!()
    expect(redirects).toContainEqual({ source: '/author-sitemap.xml', destination: '/page-sitemap.xml', permanent: true })
    expect(redirects.some((redirect) => redirect.destination.startsWith('/news/'))).toBe(true)
  })
})
