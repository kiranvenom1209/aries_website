import { cache } from 'react'
import type { TeamMember } from './fallbackTeam'
import { disciplineLabels, fallbackTeam } from './fallbackTeam'
import { resolveLegacyMediaPath } from './mediaPaths'

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const stringValue = (value: unknown) => (typeof value === 'string' ? value : undefined)

const extractText = (value: unknown): string[] => {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : []
  if (Array.isArray(value)) return value.flatMap(extractText)
  if (!isRecord(value)) return []

  const ownText = stringValue(value.text)
  if (ownText) return [ownText]

  const candidates = [value.children, value.root, value.content]
  return candidates.flatMap(extractText)
}

const mediaUrl = (value: unknown) => {
  if (typeof value === 'string') return value.startsWith('/') ? resolveLegacyMediaPath(value) : undefined
  if (!isRecord(value)) return undefined
  return resolveLegacyMediaPath(stringValue(value.url) ?? stringValue(value.src))
}

export const normalizeMember = (doc: unknown): TeamMember | null => {
  if (!isRecord(doc)) return null

  const name = stringValue(doc.name)
  const slug = stringValue(doc.slug)
  const position = stringValue(doc.position)
  if (!name || !slug || !position) return null

  const fallback = fallbackTeam.find((member) => member.slug === slug)
  const discipline = (stringValue(doc.discipline) ?? fallback?.discipline ?? 'other') as TeamMember['discipline']
  const departments = Array.isArray(doc.departments)
    ? doc.departments.filter((value): value is TeamMember['discipline'] => typeof value === 'string')
    : fallback?.departments ?? [discipline]
  const rankValue = stringValue(doc.rank) as TeamMember['rank'] | undefined
  const rank = rankValue ?? fallback?.rank
  const portraitField = doc.portrait ?? doc.portraitPath ?? doc.image
  const resolvedImage = mediaUrl(portraitField)
  const paragraphs = extractText(doc.bio ?? doc.content)
  const linksField = isRecord(doc.links) ? doc.links : undefined
  const portraitMedia = isRecord(doc.portrait) ? doc.portrait : undefined

  return {
    isAlumni: doc.isAlumni === true,
    bio: doc.bio !== undefined ? paragraphs.join(' ') : fallback?.bio ?? '',
    bioRichText: isRecord(doc.bio) && isRecord(doc.bio.root) && Array.isArray(doc.bio.root.children) ? doc.bio as unknown as TeamMember['bioRichText'] : undefined,
    updatedAt: stringValue(doc.updatedAt),
    createdAt: stringValue(doc.createdAt),
    departments,
    discipline,
    disciplineLabel: disciplineLabels[discipline] ?? 'Core Team',
    image:
      resolvedImage === '/media/schroedel_540x540.png'
        ? fallback?.image ?? resolvedImage
        : resolvedImage ?? fallback?.image ?? '/media/cropped-falcon-1.png',
    imageAlt: `${name} — ${position}`,
    imageAspectRatio: typeof portraitMedia?.width === 'number' && typeof portraitMedia?.height === 'number' && portraitMedia.width > 0 && portraitMedia.height > 0 ? portraitMedia.width / portraitMedia.height : undefined,
    imageCredit: stringValue(doc.portraitCredit) ?? stringValue(portraitMedia?.credit) ?? fallback?.imageCredit,
    imageCreditUrl: stringValue(doc.portraitCreditUrl) ?? fallback?.imageCreditUrl,
    links: {
      linkedIn: publicProfileLink(linksField?.linkedIn === undefined || stringValue(linksField?.linkedIn)?.includes('linkedin.com/company/aries-space') ? fallback?.links?.linkedIn : linksField.linkedIn, true),
      website: publicProfileLink(linksField?.website === undefined ? fallback?.links?.website : linksField.website),
    },
    name,
    position,
    rank,
    rankBadge:
      rank === 'Commander'
        ? '/media/l1_commander_new-cropped.png'
        : rank === 'Captain'
          ? '/media/Untitled-1.png'
          : rank === undefined ? fallback?.rankBadge : undefined,
    slug,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : fallback?.sortOrder ?? 100,
    tags: fallback?.tags ?? [],
  }
}

export const getTeam = cache(async (discipline?: string): Promise<TeamMember[]> => {
  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config: await configModule.default })
    const whereClause: Record<string, unknown> = { isActive: { equals: true } }

    const result = await payload.find({
      collection: 'team' as never,
      depth: 1,
      limit: 0,
      pagination: false,
      overrideAccess: false,
      sort: 'sortOrder',
      where: whereClause as never,
    })

    const members = result.docs
      .map((doc) => normalizeMember(doc))
      .filter((member): member is TeamMember => member !== null)

    if (discipline && discipline !== 'all') {
      return members.filter((member) =>
        (member.departments ?? [member.discipline]).includes(discipline as TeamMember['discipline']),
      )
    }
    return members
  } catch {
    // Falls back gracefully if database is not yet migrated or populated
  }

  if (discipline && discipline !== 'all') {
    return fallbackTeam.filter((item) =>
      (item.departments ?? [item.discipline]).includes(discipline as TeamMember['discipline']),
    )
  }

  return fallbackTeam
})

export const getTeamMemberBySlug = cache(async (slug: string): Promise<TeamMember | null> =>
  (await getTeam()).find((member) => member.slug === slug) ?? null,
)

export function publicProfileLink(value: unknown, linkedIn = false): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const url = new URL(value.trim())
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined
    if (linkedIn && (!(url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com')) || !url.pathname.startsWith('/in/'))) return undefined
    return url.href
  } catch { return undefined }
}

export { disciplineLabels, fallbackTeam } from './fallbackTeam'
export type { TeamMember } from './fallbackTeam'
