import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { NOINDEX_ROUTES, SITE_PAGES } from '@/lib/sitePages'

/**
 * Guard for future pages: every page under src/app/(frontend) must either be registered in
 * SITE_PAGES (sitemap + llms.txt) or be listed as noindex, and must declare its own metadata.
 */
const FRONTEND = path.resolve(__dirname, '../../src/app/(frontend)')

function pageFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const full = path.join(directory, entry)
    if (statSync(full).isDirectory()) return pageFiles(full)
    return entry === 'page.tsx' ? [full] : []
  })
}

const routeOf = (file: string) => {
  const segments = path
    .relative(FRONTEND, path.dirname(file))
    .split(path.sep)
    .filter((segment) => segment && !/^\(.*\)$/.test(segment))
  return `/${segments.join('/')}`
}

const pages = pageFiles(FRONTEND).map((file) => ({ file, route: routeOf(file), source: readFileSync(file, 'utf8') }))
const staticPages = pages.filter((page) => !page.route.includes('['))
const dynamicPages = pages.filter((page) => page.route.includes('[') && !page.route.includes('[...'))

describe('SEO coverage of every frontend page', () => {
  it('registers each static page for indexing or marks it noindex on purpose', () => {
    const registered = new Set(SITE_PAGES.map((page) => page.path))
    const unaccounted = staticPages
      .map((page) => page.route)
      .filter((route) => !registered.has(route) && !(NOINDEX_ROUTES as readonly string[]).includes(route))
    expect(unaccounted, 'add these routes to SITE_PAGES (src/lib/sitePages.ts) or NOINDEX_ROUTES').toEqual([])
  })

  it('lists no route in the registry that has no page', () => {
    const routes = new Set(staticPages.map((page) => page.route))
    expect(SITE_PAGES.map((page) => page.path).filter((route) => !routes.has(route))).toEqual([])
  })

  it('gives indexed pages a canonical URL and share card through pageMetadata', () => {
    for (const page of staticPages.filter((entry) => SITE_PAGES.some((registered) => registered.path === entry.route))) {
      expect(page.source, `${page.route} should use pageMetadata()`).toMatch(/pageMetadata\(/)
      expect(page.source, `${page.route} should set path '${page.route}'`).toContain(`path: '${page.route}'`)
    }
  })

  it('keeps noindex routes out of search engines in their own metadata', () => {
    for (const route of NOINDEX_ROUTES) {
      const page = staticPages.find((entry) => entry.route === route)
      expect(page, route).toBeDefined()
      expect(page!.source).toMatch(/robots:\s*\{[^}]*index:\s*false/)
    }
  })

  it('builds metadata for dynamic routes (news stories, team profiles, future collections)', () => {
    expect(dynamicPages.length).toBeGreaterThan(0)
    for (const page of dynamicPages) expect(page.source, page.route).toMatch(/export async function generateMetadata/)
  })

  it('keeps registry summaries short enough for llms.txt', () => {
    for (const page of SITE_PAGES) {
      expect(page.summary.length, page.path).toBeLessThanOrEqual(260)
      expect(page.title.trim()).not.toBe('')
    }
  })
})
