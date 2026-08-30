import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    rules: {
      allow: '/',
      disallow: ['/admin/', '/api/', '/login', '/thank-you'],
      userAgent: '*',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
