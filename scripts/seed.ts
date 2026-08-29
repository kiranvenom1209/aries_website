import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { seedPublicContent } from '../src/seed'

if (process.env.BOOTSTRAP_PUBLIC_CONTENT !== 'true') {
  console.log('Public content bootstrap skipped. Set BOOTSTRAP_PUBLIC_CONTENT=true to run it.')
  process.exit(0)
}

const payload = await getPayload({ config })

try {
  await seedPublicContent(payload)
} finally {
  await payload.destroy()
}

process.exit(0)
