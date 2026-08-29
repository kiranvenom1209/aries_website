import type { TeamMember } from './fallbackTeam'
import { disciplineLabels, fallbackTeam } from './fallbackTeam'

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
  if (typeof value === 'string') return value.startsWith('/') ? value : undefined
  if (!isRecord(value)) return undefined
  return stringValue(value.url) ?? stringValue(value.src)
}

const normalizeMember = (doc: unknown, index: number): TeamMember | null => {
  if (!isRecord(doc)) return null

  const name = stringValue(doc.name)
  const slug = stringValue(doc.slug)
  const position = stringValue(doc.position)
  if (!name || !slug || !position) return null

  const fallback = fallbackTeam.find((member) => member.slug === slug) ?? fallbackTeam[index % fallbackTeam.length]
  const discipline = (stringValue(doc.discipline) ?? fallback.discipline) as TeamMember['discipline']
  const departments = Array.isArray(doc.departments)
    ? doc.departments.filter((value): value is TeamMember['discipline'] => typeof value === 'string')
    : fallback.departments ?? [discipline]
  const rankValue = stringValue(doc.rank) as TeamMember['rank'] | undefined
  const rank = rankValue ?? fallback.rank
  const portraitField = doc.portrait ?? doc.portraitPath ?? doc.image
  const resolvedImage = mediaUrl(portraitField)
  const paragraphs = extractText(doc.bio ?? doc.content)
  const linksField = isRecord(doc.links) ? doc.links : undefined
  const portraitMedia = isRecord(doc.portrait) ? doc.portrait : undefined

  return {
    bio: paragraphs.length > 0 ? paragraphs.join(' ') : fallback.bio,
    departments,
    discipline,
    disciplineLabel: disciplineLabels[discipline] ?? 'Core Team',
    image:
      resolvedImage === '/media/schroedel_540x540.png'
        ? fallback.image
        : resolvedImage ?? fallback.image,
    imageAlt: `${name} — ${position}`,
    imageCredit: stringValue(doc.portraitCredit) ?? stringValue(portraitMedia?.credit) ?? fallback.imageCredit,
    imageCreditUrl: stringValue(doc.portraitCreditUrl) ?? fallback.imageCreditUrl,
    links: {
      linkedIn: stringValue(linksField?.linkedIn) ?? fallback.links?.linkedIn,
      website: stringValue(linksField?.website) ?? fallback.links?.website,
    },
    name,
    position,
    rank,
    rankBadge:
      rank === 'Commander'
        ? '/media/l1_commander_new-cropped.png'
        : rank === 'Captain'
          ? '/media/Untitled-1.png'
          : fallback.rankBadge,
    slug,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : fallback.sortOrder,
    tags: fallback.tags,
  }
}

export async function getTeam(discipline?: string): Promise<TeamMember[]> {
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
      limit: 50,
      overrideAccess: false,
      sort: 'sortOrder',
      where: whereClause as never,
    })

    const members = result.docs
      .map((doc, index) => normalizeMember(doc, index))
      .filter((member): member is TeamMember => member !== null)

    if (members.length > 0) {
      if (discipline && discipline !== 'all') {
        return members.filter((member) =>
          (member.departments ?? [member.discipline]).includes(discipline as TeamMember['discipline']),
        )
      }
      return members
    }
  } catch {
    // Falls back gracefully if database is not yet migrated or populated
  }

  if (discipline && discipline !== 'all') {
    return fallbackTeam.filter((item) =>
      (item.departments ?? [item.discipline]).includes(discipline as TeamMember['discipline']),
    )
  }

  return fallbackTeam
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config: await configModule.default })
    const result = await payload.find({
      collection: 'team' as never,
      depth: 1,
      limit: 1,
      overrideAccess: false,
      where: { slug: { equals: slug } },
    })

    const member = normalizeMember(result.docs[0], 0)
    if (member) return member
  } catch {
    // Fallback if not available
  }

  return fallbackTeam.find((member) => member.slug === slug) ?? null
}

export { disciplineLabels, fallbackTeam } from './fallbackTeam'
export type { TeamMember } from './fallbackTeam'
