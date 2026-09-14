import { sectionSitemapResponse } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'

export async function GET() {
  return sectionSitemapResponse('pages')
}
