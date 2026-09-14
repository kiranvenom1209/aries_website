import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'

// Read-only: run against localhost, a deploy preview or production after release.
const base = new URL(process.argv[2] ?? 'http://localhost:3000')
const canonicalOrigin = 'https://hsmaries.space'
const headers = { 'User-Agent': 'Googlebot' }
const localURL = (url) => new URL(new URL(url, canonicalOrigin).pathname, base)
const fetchPage = async (url) => {
  const response = await fetch(localURL(url), { headers, signal: AbortSignal.timeout(30000) })
  assert.equal(response.status, 200, `HTTP status: ${url}`)
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') ?? ''), `X-Robots-Tag: ${url}`)
  return response
}
const xml = async (url) => {
  const response = await fetchPage(url)
  assert.match(response.headers.get('content-type') ?? '', /xml/)
  return new JSDOM(await response.text(), { contentType: 'application/xml' }).window.document
}

const index = await xml('/sitemap_index.xml')
const sections = [...index.querySelectorAll('sitemap > loc')].map((node) => node.textContent)
assert.ok(sections.includes(`${canonicalOrigin}/team-sitemap.xml`))
const allLocations = []
for (const section of sections) {
  assert.equal(new URL(section).origin, canonicalOrigin)
  const document = await xml(section)
  allLocations.push(...[...document.querySelectorAll('url > loc')].map((node) => node.textContent))
}
assert.equal(new Set(allLocations).size, allLocations.length, 'Duplicate URLs between sitemap sections')
const aggregate = [...(await xml('/sitemap.xml')).querySelectorAll('url > loc')].map((node) => node.textContent)
assert.deepEqual([...allLocations].sort(), aggregate.sort(), 'Aggregate/index sitemap mismatch')

const teamDocument = await xml('/team-sitemap.xml')
const entries = [...teamDocument.querySelectorAll('url')].map((node) => ({
  url: node.querySelector('loc').textContent,
  lastmod: node.querySelector('lastmod')?.textContent,
}))
assert.ok(entries.length > 0, 'No public team profiles found')
const directory = new JSDOM(await (await fetchPage('/team')).text()).window.document
const directoryURLs = new Set([...directory.querySelectorAll('a.member-profile-link')].map((link) => new URL(link.getAttribute('href'), canonicalOrigin).href))
assert.deepEqual([...directoryURLs].sort(), entries.map(({ url }) => url).sort(), 'Orphan profile or missing sitemap entry')
const about = new JSDOM(await (await fetchPage('/about')).text()).window.document
const aboutProfiles = [...about.querySelectorAll('a[href^="/team/"]')]
assert.ok(aboutProfiles.length > 0, 'About page has no direct profile links')
for (const link of aboutProfiles) assert.ok(directoryURLs.has(new URL(link.getAttribute('href'), canonicalOrigin).href), 'About links to a hidden or missing profile')
assert.equal(about.querySelectorAll('a a').length, 0, 'Nested links in About cards')
const titles = new Set()
const descriptions = new Set()
for (let offset = 0; offset < entries.length; offset += 4) {
  await Promise.all(entries.slice(offset, offset + 4).map(async ({ url, lastmod }) => {
    assert.equal(new URL(url).origin, canonicalOrigin)
    assert.ok(new URL(url).pathname.startsWith('/team/'))
    const document = new JSDOM(await (await fetchPage(url)).text()).window.document
    const canonical = document.querySelectorAll('link[rel="canonical"]')
    assert.equal(canonical.length, 1, url)
    assert.equal(canonical[0].getAttribute('href'), url)
    assert.match(document.querySelector('meta[name="robots"]')?.content ?? '', /index, follow/)
    assert.ok(!/noindex/.test(document.querySelector('meta[name="robots"]')?.content ?? ''))
    assert.equal(document.querySelector('meta[property="og:type"]')?.content, 'profile')
    assert.equal(document.querySelector('meta[property="og:url"]')?.content, url)
    const title = document.querySelector('title')?.textContent
    const description = document.querySelector('meta[name="description"]')?.content
    const name = document.querySelector('h1')?.textContent
    assert.ok(name && title?.includes(name), `Name/title: ${url}`)
    assert.ok(description?.length && description.length <= 170, `Description: ${url}`)
    assert.ok(!titles.has(title), `Duplicate title: ${url}`)
    assert.ok(!descriptions.has(description), `Duplicate description: ${url}`)
    titles.add(title)
    descriptions.add(description)
    const structured = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((node) => { const data = JSON.parse(node.textContent); return data['@graph'] ?? data })
    const profile = structured.find((node) => node['@type'] === 'ProfilePage')
    assert.ok(profile, `Missing ProfilePage: ${url}`)
    assert.equal(profile.url, url)
    assert.equal(profile.mainEntity.name, name)
    assert.equal(profile.mainEntity['@type'], 'Person')
    assert.equal(profile.mainEntity['@id'], `${url}#person`)
    assert.equal(profile.dateModified, lastmod)
    const breadcrumb = structured.find((node) => node['@type'] === 'BreadcrumbList')
    assert.equal(breadcrumb?.itemListElement.at(-1)?.item, url)
    if (profile.mainEntity.image) {
      const image = await fetchPage(profile.mainEntity.image)
      assert.match(image.headers.get('content-type') ?? '', /^image\//, `Portrait: ${url}`)
      await image.body?.cancel()
    }
  }))
}
const missing = await fetch(localURL('/team/this-profile-does-not-exist-seo-check'), { headers })
assert.equal(missing.status, 404, 'Missing profile must return a real 404')
const missingDocument = new JSDOM(await missing.text()).window.document
assert.match(missingDocument.querySelector('meta[name="robots"]')?.content ?? '', /noindex/)
const robots = await (await fetchPage('/robots.txt')).text()
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap_index.xml`))
assert.ok(!/^Disallow:\s*\/team/m.test(robots))
console.log(`PASS: ${entries.length} profiles; sitemap coverage, unique metadata, canonical URLs, indexability, structured data, dates, portrait access, internal links and real 404 verified at ${base.origin}.`)
