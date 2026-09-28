import type { MetadataRoute } from 'next'

/**
 * Every static public route, in one place. The sitemap, `/llms.txt` and the SEO coverage test
 * (tests/int/seo-coverage.int.spec.ts) read this list, so a new page is indexed — or knowingly
 * kept out — by adding one entry here. Dynamic routes (news stories, team profiles) come from
 * the CMS and join the sitemap, feed and llms files automatically.
 */
export type SitePage = {
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  path: string
  priority: number
  /** Plain-language summary for AI assistants (`/llms.txt`); facts only, no marketing. */
  summary: string
  section: 'Programme' | 'Crew' | 'Updates' | 'Get involved' | 'Resources' | 'Legal'
  title: string
}

export const SITE_PAGES: SitePage[] = [
  {
    changeFrequency: 'weekly',
    path: '/',
    priority: 1,
    section: 'Programme',
    summary:
      'Overview of HSM Aries: the LEAP rover series, the ERC 2026 finals result, the eight engineering departments, partners and latest mission updates.',
    title: 'Home',
  },
  {
    changeFrequency: 'monthly',
    path: '/about',
    priority: 0.9,
    section: 'Programme',
    summary:
      'Who HSM Aries is: the student space-robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden, its programme record, engineering culture and leadership.',
    title: 'About HSM Aries',
  },
  {
    changeFrequency: 'monthly',
    path: '/leap-one',
    priority: 0.9,
    section: 'Programme',
    summary:
      'LEAP-One (Project 01), the team’s first planetary rover and ERC 2026 finalist: subsystems, field results and an interactive 3D turntable.',
    title: 'LEAP-One / Project 01',
  },
  {
    changeFrequency: 'monthly',
    path: '/leap-2',
    priority: 0.9,
    section: 'Programme',
    summary:
      'Leap-2 (Project 02), the next rover of the LEAP series, in development: the requirements it has to meet, drawn from the LEAP-One experience.',
    title: 'Leap-2 / Project 02',
  },
  {
    changeFrequency: 'monthly',
    path: '/team',
    priority: 0.8,
    section: 'Crew',
    summary: 'The engineering crew, mentors and alumni, organised by department, with links to individual profiles.',
    title: 'Engineering crew',
  },
  {
    changeFrequency: 'weekly',
    path: '/news',
    priority: 0.9,
    section: 'Updates',
    summary: 'Mission updates: competition results, field reports, engineering milestones and the Leap-2 build.',
    title: 'Mission updates',
  },
  {
    changeFrequency: 'monthly',
    path: '/gallery',
    priority: 0.8,
    section: 'Updates',
    summary: 'Photographs from the lab, field tests, outreach events and the ERC 2026 finals in Kraków.',
    title: 'Field gallery',
  },
  {
    changeFrequency: 'monthly',
    path: '/join',
    priority: 0.7,
    section: 'Get involved',
    summary: 'How students of Hochschule Schmalkalden can join one of the eight departments, with an application form.',
    title: 'Join the crew',
  },
  {
    changeFrequency: 'monthly',
    path: '/partner',
    priority: 0.7,
    section: 'Get involved',
    summary: 'Partnership and sponsorship options for companies and institutions supporting the LEAP rover programme.',
    title: 'Partner with HSM Aries',
  },
  {
    changeFrequency: 'monthly',
    path: '/contact',
    priority: 0.6,
    section: 'Get involved',
    summary: 'Contact routes and address of the team at Hochschule Schmalkalden, with a general enquiry form.',
    title: 'Contact',
  },
  {
    changeFrequency: 'monthly',
    path: '/leap-one/cad',
    priority: 0.7,
    section: 'Resources',
    summary:
      'Interactive 3D viewer of the LEAP-One CAD assembly on a Mars yard: orbit, exploded view of 500+ parts, X-ray and blueprint modes, part names.',
    title: 'LEAP-One CAD viewer',
  },
  {
    changeFrequency: 'monthly',
    path: '/press',
    priority: 0.6,
    section: 'Resources',
    summary:
      'Press kit: fact sheet, short and long descriptions in English and German, full-resolution press photos with credit line, logos and press contact.',
    title: 'Press kit',
  },
  {
    changeFrequency: 'monthly',
    path: '/brand',
    priority: 0.5,
    section: 'Resources',
    summary: 'Brand assets: wordmarks, falcon mark, LEAP-One mission badge and department patches, typography, colour values and usage rules.',
    title: 'Brand assets',
  },
  {
    changeFrequency: 'yearly',
    path: '/impressum',
    priority: 0.3,
    section: 'Legal',
    summary: 'Legal notice (Impressum) under § 5 DDG and § 18 MStV, in English and German.',
    title: 'Impressum (legal notice)',
  },
  {
    changeFrequency: 'yearly',
    path: '/datenschutz',
    priority: 0.3,
    section: 'Legal',
    summary: 'Privacy policy under the GDPR: hosting, forms, consent-based analytics and video embeds, cookies and visitor rights.',
    title: 'Privacy policy',
  },
]

/** Public routes deliberately kept out of search indexes; each carries `robots: noindex` in its metadata. */
export const NOINDEX_ROUTES = ['/login', '/thank-you'] as const
