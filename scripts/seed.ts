import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { seedPublicContent } from '../src/seed'

if (process.env.BOOTSTRAP_PUBLIC_CONTENT !== 'true') {
  console.log('Public content bootstrap skipped. Set BOOTSTRAP_PUBLIC_CONTENT=true to run it.')
  process.exit(0)
}

if (
  process.env.NETLIFY &&
  (!(process.env.NETLIFY_SITE_ID ?? process.env.SITE_ID) || !process.env.NETLIFY_API_TOKEN)
) {
  throw new Error(
    'Build-time media import requires NETLIFY_SITE_ID and NETLIFY_API_TOKEN. Both must be server-only environment variables.',
  )
}

const payload = await getPayload({ config })

try {
  await seedPublicContent(payload)
} finally {
  await payload.destroy()
}

process.exit(0)
