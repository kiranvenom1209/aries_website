import { describe, expect, it } from 'vitest'
import { normalizeMember } from '@/lib/team'
import { profileDate, teamProfileJsonLd } from '@/lib/teamSeo'
import { serializeJsonLd } from '@/lib/seo'

const member = normalizeMember({
  name: 'Example Engineer', slug: 'example-engineer', position: 'Mechanical Lead',
  portraitPath: '/media/person.jpg', createdAt: '2026-09-01T12:00:00Z', updatedAt: '2026-09-14T09:30:00Z',
  links: { linkedIn: 'https://www.linkedin.com/in/example-engineer/', website: 'https://hsmaries.space/' },
})!

describe('Team profile search data', () => {
  it('ties the page, person and breadcrumb to one permanent canonical URL', () => {
    const [profile, breadcrumb] = teamProfileJsonLd(member)
    expect(profile).toMatchObject({
      '@type': 'ProfilePage', '@id': 'https://hsmaries.space/team/example-engineer#profile',
      dateCreated: '2026-09-01T12:00:00.000Z', dateModified: '2026-09-14T09:30:00.000Z',
      mainEntity: { '@type': 'Person', '@id': 'https://hsmaries.space/team/example-engineer#person',
        name: 'Example Engineer', url: 'https://hsmaries.space/team/example-engineer',
        image: 'https://hsmaries.space/media/person.jpg', sameAs: ['https://www.linkedin.com/in/example-engineer/'] },
    })
    expect(breadcrumb).toMatchObject({ '@type': 'BreadcrumbList', itemListElement: [
      { name: 'Home', position: 1, item: 'https://hsmaries.space/' },
      { name: 'Engineering crew', position: 2, item: 'https://hsmaries.space/team' },
      { name: member.name, position: 3, item: 'https://hsmaries.space/team/example-engineer' },
    ] })
  })

  it('retains alumni identity without describing their old role as a current job or a logo as their photo', () => {
    const [profile] = teamProfileJsonLd({ ...member, isAlumni: true, image: '/media/cropped-falcon-1.png', updatedAt: 'bad date' })
    expect(profile).toMatchObject({ mainEntity: { '@id': 'https://hsmaries.space/team/example-engineer#person', description: 'HSM Aries alumni; former Mechanical Lead' } })
    const serialized = JSON.parse(serializeJsonLd(profile))
    expect(serialized.mainEntity).not.toHaveProperty('jobTitle')
    expect(serialized.mainEntity).not.toHaveProperty('image')
    expect(serialized).not.toHaveProperty('dateModified')
    expect(profileDate(undefined)).toBeUndefined()
    expect(profileDate('not-a-date')).toBeUndefined()
  })

  it('escapes editor-controlled markup in JSON-LD', () => {
    const data = serializeJsonLd(teamProfileJsonLd({ ...member, name: '</script><script>alert(1)</script>' }))
    expect(data).not.toContain('</script>')
    expect(JSON.parse(data)[0].mainEntity.name).toBe('</script><script>alert(1)</script>')
  })
})
