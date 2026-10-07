import 'dotenv/config'

import { access } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Sets one team member's CMS portrait to a photo that ships with the site in public/media. The curated seed only runs on
 * a fresh install, so this is how a portrait added in code reaches a running site without touching anything else an
 * editor changed. Reuses the media record when the file was uploaded before.
 *
 *   npx tsx scripts/set-team-portrait.ts <slug> <file in public/media> [alt text]
 *   on the Pi: sudo /opt/aries-host/bin/set-team-portrait.sh <slug> <file>
 */
const [slug, file, altText] = process.argv.slice(2)
if (!slug || !file) {
  console.error('usage: set-team-portrait <slug> <file in public/media> [alt text]')
  process.exit(2)
}

const filename = path.basename(file)
const filePath = path.resolve(process.cwd(), 'public', 'media', filename)
await access(filePath)

const payload = await getPayload({ config })
try {
  const members = await payload.find({
    collection: 'team',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  const member = members.docs[0]
  if (!member) throw new Error(`no team member with the slug "${slug}"`)

  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  })
  const media =
    existing.docs[0] ??
    (await payload.create({
      collection: 'media',
      data: { alt: altText ?? `${member.name}, HSM Aries`, isPublic: true },
      filePath,
      overrideAccess: true,
    }))

  await payload.update({ collection: 'team', data: { portrait: media.id }, id: member.id, overrideAccess: true })
  console.log(`[Team portrait] ${slug} now shows ${media.filename}`)
} finally {
  await payload.destroy()
}
process.exit(0)
