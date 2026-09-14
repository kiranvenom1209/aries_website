import { beforeEach, describe, expect, it, vi } from 'vitest'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@/payload.config', () => ({ default: {} }))

import { getTeam, getTeamMemberBySlug, normalizeMember, publicProfileLink } from '@/lib/team'
import { teamPortrait } from '@/lib/teamPortrait'

beforeEach(() => find.mockReset())

describe('Public crew profiles', () => {
  it('keeps alumni public and resets source-specific framing when an editor replaces a portrait', async () => {
    const doc = { name: 'Rahul Khandait', slug: 'rahul-khandait', position: 'Drone Lead', isAlumni: true, portraitPath: '/media/image-6.jpg' }
    find.mockResolvedValue({ docs: [doc] })
    const member = await getTeamMemberBySlug(doc.slug)
    expect(member?.isAlumni).toBe(true)
    expect(member?.image).toBe('/media/rahul-khandait-portrait.jpg')
    expect(teamPortrait(member!)).toEqual({ key: doc.slug, zoom: 3.2 })
    const replacement = normalizeMember({ ...doc, portrait: { url: '/api/media/file/new-portrait.jpg' } })!
    expect(teamPortrait(replacement)).toEqual({ key: 'custom', zoom: 1 })
  })

  it('does not resurrect a removed or inactive member from seed data', async () => {
    find.mockResolvedValue({ docs: [] })
    expect(await getTeam()).toEqual([])
    expect(await getTeamMemberBySlug('anantha-pathmanabhan')).toBeNull()
    expect(find).toHaveBeenCalledWith(expect.objectContaining({
      overrideAccess: false, where: { isActive: { equals: true } },
    }))
  })

  it('keeps an editor-cleared biography and links empty and never borrows another person’s data', () => {
    const member = normalizeMember({ name: 'New engineer', slug: 'new-engineer', position: 'Engineer', bio: null, links: { linkedIn: null, website: null } })!
    expect(member.bio).toBe('')
    expect(member.rankBadge).toBeUndefined()
    expect(member.tags).toEqual([])
    expect(member.links).toEqual({ linkedIn: undefined, website: undefined })
    expect(member.image).toBe('/media/cropped-falcon-1.png')
  })

  it('preserves rich biography formatting and personal links from the CMS', () => {
    const bio = { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Editor biography', format: 1 }] }] } }
    const member = normalizeMember({ name: 'Engineer', slug: 'new-engineer', position: 'Lead', bio, links: { linkedIn: 'https://www.linkedin.com/in/engineer' } })!
    expect(member.bio).toBe('Editor biography')
    expect(member.bioRichText).toEqual(bio)
    expect(member.links?.linkedIn).toBe('https://www.linkedin.com/in/engineer')
  })

  it('hides company placeholders and unsafe or misleading social URLs', () => {
    for (const value of ['javascript:alert(1)', 'https://linkedin.com.evil.test/in/member', 'https://www.linkedin.com/company/aries-space']) {
      expect(publicProfileLink(value, true)).toBeUndefined()
    }
    expect(publicProfileLink('https://www.linkedin.com/in/member', true)).toBe('https://www.linkedin.com/in/member')
  })
})
