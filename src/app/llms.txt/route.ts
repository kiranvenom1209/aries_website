import { llmsTxt, markdownResponse } from '@/lib/llms'

export const dynamic = 'force-dynamic'

export async function GET() {
  return markdownResponse(await llmsTxt())
}
