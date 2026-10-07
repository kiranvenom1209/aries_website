import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

/**
 * 200 when the server and its database answer, 503 otherwise. The Pi's deploy script waits for it before it keeps a
 * new release, and its health timer restarts the site when it fails (deploy/pi).
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users', overrideAccess: true })
    return Response.json({ ok: true }, { headers: noStore })
  } catch {
    return Response.json({ ok: false }, { headers: noStore, status: 503 })
  }
}
