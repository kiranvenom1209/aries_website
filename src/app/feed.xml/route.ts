import { newsFeedXml } from '@/lib/feed'
import { getNews } from '@/lib/news'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(newsFeedXml(await getNews(50)), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=1800, stale-while-revalidate=86400',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
