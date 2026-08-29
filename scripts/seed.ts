import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { seedPublicContent } from '../src/seed'

const payload = await getPayload({ config })

try {
  await seedPublicContent(payload)
} finally {
  await payload.destroy()
}
