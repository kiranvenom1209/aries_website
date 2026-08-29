import { access } from 'node:fs/promises'
import path from 'node:path'

import type { Payload } from 'payload'

import { fallbackTeam } from '../lib/fallbackTeam'
import { downloadSeed, gallerySeed, mediaSeed, newsSeed } from './news'

type SeedCollection = 'media' | 'news' | 'gallery' | 'downloads' | 'team'
type SeedID = number | string

type SeedDocument = {
  filename?: string | null
  id: SeedID
  slug?: string | null
}

type SeedPayloadAPI = {
  create(args: {
    collection: SeedCollection
    data: Record<string, unknown>
    draft?: boolean
    filePath?: string
    overrideAccess: true
  }): Promise<SeedDocument>
  find(args: {
    collection: SeedCollection
    depth: 0
    limit: number
    overrideAccess: true
    where: Record<string, unknown>
  }): Promise<{ docs: SeedDocument[] }>
  logger: {
    info(message: string): void
  }
  update(args: {
    collection: SeedCollection
    data: Record<string, unknown>
    draft?: boolean
    id: SeedID
    overrideAccess: true
  }): Promise<SeedDocument>
}

const plainTextRichText = (value: string) => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: value,
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const findOne = async (
  payload: SeedPayloadAPI,
  collection: SeedCollection,
  field: 'filename' | 'slug',
  value: string,
) => {
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      [field]: {
        equals: value,
      },
    },
  })

  return result.docs[0]
}

const upsertBySlug = async (
  payload: SeedPayloadAPI,
  collection: Exclude<SeedCollection, 'media'>,
  slug: string,
  data: Record<string, unknown>,
  draft?: boolean,
) => {
  const existing = await findOne(payload, collection, 'slug', slug)

  if (existing) {
    return payload.update({
      collection,
      data,
      draft,
      id: existing.id,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection,
    data,
    draft,
    overrideAccess: true,
  })
}

const publicMediaPath = (filename: string) => {
  const mediaDirectory = path.resolve(process.cwd(), 'public', 'media')
  const filePath = path.resolve(mediaDirectory, filename)

  if (!filePath.startsWith(`${mediaDirectory}${path.sep}`)) {
    throw new Error(`Unsafe seed media path: ${filename}`)
  }

  return filePath
}

/**
 * Idempotently seeds only the curated public content in ./news.ts.
 * Existing records with the same filename or slug are updated in place.
 */
export async function seedPublicContent(payloadInstance: Payload) {
  const payload = payloadInstance as unknown as SeedPayloadAPI
  const mediaIDs = new Map<string, SeedID>()

  payload.logger.info('Seeding curated HSM Aries public media…')

  for (const media of mediaSeed) {
    const filePath = publicMediaPath(media.filename)
    await access(filePath)

    const existing = await findOne(payload, 'media', 'filename', media.filename)
    const record = existing
      ? await payload.update({
          collection: 'media',
          data: { alt: media.alt, isPublic: true },
          id: existing.id,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'media',
          data: { alt: media.alt, isPublic: true },
          filePath,
          overrideAccess: true,
        })

    mediaIDs.set(media.filename, record.id)
  }

  const mediaID = (filename: string) => {
    const id = mediaIDs.get(filename)
    if (id === undefined) throw new Error(`Missing seeded media: ${filename}`)
    return id
  }

  payload.logger.info('Seeding the five latest confirmed public news stories…')

  for (const article of newsSeed) {
    await upsertBySlug(
      payload,
      'news',
      article.slug,
      {
        _status: 'published',
        body: article.body,
        category: article.category,
        excerpt: article.excerpt,
        featured: article.featured,
        featuredImage: mediaID(article.featuredImage),
        ...(article.featuredVideo ? { featuredVideo: mediaID(article.featuredVideo) } : {}),
        ...(article.mediaDeck
          ? {
              mediaDeck: article.mediaDeck.map((item) => ({
                asset: mediaID(item.filename),
                ...(item.caption ? { caption: item.caption } : {}),
              })),
            }
          : {}),
        publishedAt: article.publishedAt,
        slug: article.slug,
        tags: article.tags.map((tag) => ({ tag })),
        title: article.title,
      },
      false,
    )
  }

  payload.logger.info('Seeding public galleries…')

  for (const gallery of gallerySeed) {
    await upsertBySlug(payload, 'gallery', gallery.slug, {
      coverImage: mediaID(gallery.coverImage),
      description: gallery.description,
      eventDate: gallery.eventDate,
      isPublic: gallery.isPublic,
      items: gallery.items.map(mediaID),
      location: gallery.location,
      slug: gallery.slug,
      sortOrder: gallery.sortOrder,
      tags: gallery.tags.map((tag) => ({ tag })),
      title: gallery.title,
    })
  }

  payload.logger.info('Seeding approved public brand downloads…')

  for (const download of downloadSeed) {
    await upsertBySlug(payload, 'downloads', download.slug, {
      category: download.category,
      description: download.description,
      file: mediaID(download.file),
      isPublic: download.isPublic,
      publishedAt: download.publishedAt,
      slug: download.slug,
      sortOrder: download.sortOrder,
      title: download.title,
      version: download.version,
    })
  }

  payload.logger.info('Seeding HSM Aries team members and mentors…')

  for (const member of fallbackTeam) {
    await upsertBySlug(payload, 'team', member.slug, {
      bio: plainTextRichText(member.bio),
      departments: member.departments ?? [member.discipline],
      discipline: member.discipline,
      isActive: true,
      links: member.links ?? {},
      name: member.name,
      portrait: null,
      portraitPath: member.image,
      portraitCredit: member.imageCredit,
      portraitCreditUrl: member.imageCreditUrl,
      position: member.position,
      rank: member.rank ?? (member.discipline === 'mentors' ? 'Advisor' : 'Crew'),
      slug: member.slug,
      sortOrder: member.sortOrder,
    })
  }

  const liveTeamSlugs = new Set(fallbackTeam.map((member) => member.slug))
  const existingTeam = await payload.find({
    collection: 'team',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where: {},
  })

  for (const member of existingTeam.docs) {
    if (member.slug && !liveTeamSlugs.has(member.slug)) {
      await payload.update({
        collection: 'team',
        data: {
          departments: [],
          discipline: 'other',
          isActive: false,
          rank: 'Crew',
        },
        id: member.id,
        overrideAccess: true,
      })
    }
  }

  payload.logger.info('Seeding Master Admin account...')

  const adminEmails = [
    { email: 'admin@hsmaries.space', name: 'Master Administrator' },
    { email: 'admin@aries.space', name: 'Master Administrator' },
  ]

  for (const acc of adminEmails) {
    try {
      const existingUser = await payload.find({
        collection: 'users' as never,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { email: { equals: acc.email } },
      })

      if (existingUser.docs.length > 0) {
        await payload.update({
          collection: 'users' as never,
          id: existingUser.docs[0].id,
          data: {
            name: acc.name,
            role: 'admin',
            password: '!@#LeapOne',
          },
          overrideAccess: true,
        })
      } else {
        await (payload as unknown as { create: (args: Record<string, unknown>) => Promise<unknown> }).create({
          collection: 'users',
          data: {
            email: acc.email,
            name: acc.name,
            role: 'admin',
            password: '!@#LeapOne',
          },
          overrideAccess: true,
        })
      }
    } catch (err) {
      payload.logger.info(`Admin user seed (${acc.email}): ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  payload.logger.info(
    `Seed complete: ${mediaSeed.length} media, ${newsSeed.length} news, ${gallerySeed.length} galleries, ${downloadSeed.length} downloads, ${fallbackTeam.length} active team members, master admin credentials ready.`,
  )
}

export { downloadSeed, gallerySeed, mediaSeed, newsSeed } from './news'
