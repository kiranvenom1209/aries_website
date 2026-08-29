import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })
  try {
    const existingUsers = await payload.count({
      collection: 'users',
      overrideAccess: true,
    })

    if (existingUsers.totalDocs > 0) {
      console.log('[CMS bootstrap] Existing administrator detected; no account changes made.')
      return
    }

    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD

    if (!email || !password) {
      console.log(
        '[CMS bootstrap] Database initialized. Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD, then redeploy to create the first administrator.',
      )
      return
    }

    if (password.length < 10) {
      throw new Error('BOOTSTRAP_ADMIN_PASSWORD must contain at least 10 characters.')
    }

    await payload.create({
      collection: 'users',
      data: {
        email,
        name: 'Master Administrator',
        role: 'admin',
        password,
      },
      overrideAccess: true,
    })

    console.log(`[CMS bootstrap] Created the first administrator: ${email}`)
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
