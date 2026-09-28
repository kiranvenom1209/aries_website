import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * Search and AI crawlers named explicitly, so the site's openness to them is a stated choice.
 * A crawler that matches its own group ignores `*`, which is why every group repeats the rules.
 */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  const rules = {
    allow: ['/', '/api/media/file/'],
    // /login and /thank-you are noindex in their metadata; leaving them crawlable lets robots see it.
    disallow: ['/admin/', '/api/'],
  }
  return {
    rules: [
      { ...rules, userAgent: '*' },
      { ...rules, userAgent: AI_CRAWLERS },
    ],
    sitemap: `${SITE_URL}/sitemap_index.xml`,
  }
}
