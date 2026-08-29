import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  console.log('Seeding Master Admin account...')

  const accounts = [
    { email: 'admin@hsmaries.space', name: 'Master Administrator' },
    { email: 'admin@aries.space', name: 'Master Administrator' },
  ]

  for (const acc of accounts) {
    try {
      const existing = await payload.find({
        collection: 'users',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { email: { equals: acc.email } },
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'users',
          id: existing.docs[0].id,
          data: {
            name: acc.name,
            role: 'admin',
            password: '!@#LeapOne',
          },
          overrideAccess: true,
        })
        console.log(`✓ Updated master admin account: ${acc.email}`)
      } else {
        await payload.create({
          collection: 'users',
          data: {
            email: acc.email,
            name: acc.name,
            role: 'admin',
            password: '!@#LeapOne',
          },
          overrideAccess: true,
        })
        console.log(`✓ Created master admin account: ${acc.email}`)
      }
    } catch (err) {
      console.error(`Error configuring account ${acc.email}:`, err)
    }
  }

  // List all users in database
  const allUsers = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 20,
    overrideAccess: true,
  })

  console.log('Registered CMS Accounts:', allUsers.docs.map(u => ({ id: u.id, email: u.email, role: u.role, name: u.name })))

  await payload.destroy()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
