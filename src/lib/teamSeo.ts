import type { TeamMember } from './team'
import { publicProfileLink } from './team'
import { absoluteUrl, breadcrumbJsonLd, metadataDescription } from './seo'

export function profileDate(value?: string): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return undefined
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined
}

export function profileImage(member: TeamMember): string | undefined {
  return member.image === '/media/cropped-falcon-1.png' ? undefined : absoluteUrl(member.image)
}

export function teamProfileJsonLd(member: TeamMember) {
  const url = absoluteUrl(`/team/${member.slug}`)
  const image = profileImage(member)
  const sameAs = [publicProfileLink(member.links?.linkedIn, true), publicProfileLink(member.links?.website)]
    .filter((link): link is string => Boolean(link) && new URL(link!).origin !== new URL(absoluteUrl('/')).origin)
  return [{
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: `${member.name} — HSM Aries`,
    description: metadataDescription(member.bio || `${member.name} — ${member.position} at HSM Aries.`),
    dateCreated: profileDate(member.createdAt),
    dateModified: profileDate(member.updatedAt),
    mainEntity: {
      '@type': 'Person',
      '@id': `${url}#person`,
      url,
      name: member.name,
      description: `${member.isAlumni ? 'HSM Aries alumni; former ' : ''}${member.position}`,
      ...(member.isAlumni ? {} : { jobTitle: member.position }),
      ...(image ? { image } : {}),
      affiliation: { '@type': 'Organization', name: 'HSM Aries', url: absoluteUrl('/') },
      ...(sameAs.length ? { sameAs: [...new Set(sameAs)] } : {}),
    },
  }, breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Engineering crew', path: '/team' },
    { name: member.name, path: `/team/${member.slug}` },
  ])]
}
