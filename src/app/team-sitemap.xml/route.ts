import { getTeamSitemapEntries, sitemapXml, xmlResponse } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'

export async function GET() {
  return xmlResponse(sitemapXml(await getTeamSitemapEntries()))
}
