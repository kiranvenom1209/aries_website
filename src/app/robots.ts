import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      // /login and /thank-you are noindex in their metadata; leaving them crawlable lets robots see it.
      disallow: ['/admin/', '/api/'],
      userAgent: '*',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
