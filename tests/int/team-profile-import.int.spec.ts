import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import baseline from '@/seed/team-profile-baseline.json'
import { plainTextRichText } from '@/seed'
import { importTeamProfiles } from '@/seed/teamProfileImport'
import { researchedProfiles } from '@/seed/teamProfiles'
import { profileRichText } from '@/seed/profileRichText'

describe('Profile enrichment import', () => {
  it('fills blank biographies only during an explicitly requested initial population', async () => {
    const slug = 'anantha-pathmanabhan'
    const doc = { id: 1, slug, bio: null, links: { linkedIn: null } }
    const update = vi.fn(async ({ data }) => Object.assign(doc, data))
    const payload = { find: async ({ where }: { where: { slug: { equals: string } } }) => ({ docs: where.slug.equals === slug ? [doc] : [] }), update } as unknown as Payload
    expect(await importTeamProfiles(payload, true)).toEqual([])
    expect(update).not.toHaveBeenCalled()
    await importTeamProfiles(payload, true, true)
    expect(doc.bio).toEqual(profileRichText(researchedProfiles[slug]))
    expect(doc.links.linkedIn).toBe('https://www.linkedin.com/in/ananthapathmanabhansp/')
    expect(await importTeamProfiles(payload, true)).toEqual([])
  })

  it('updates old generated copy once, without changing portraits, roles or active state', async () => {
    const slug = 'ayan-akbar-ali'
    const doc = { id: 1, slug, bio: plainTextRichText(baseline[slug].bio), links: baseline[slug].links, isActive: false }
    const update = vi.fn(async ({ data }) => Object.assign(doc, data))
    const payload = { find: async ({ where }: { where: { slug: { equals: string } } }) => ({ docs: where.slug.equals === slug ? [doc] : [] }), update } as unknown as Payload
    expect(await importTeamProfiles(payload)).toHaveLength(1)
    expect(update).not.toHaveBeenCalled()
    await importTeamProfiles(payload, true)
    expect(doc.bio).toEqual(profileRichText(researchedProfiles[slug]))
    expect(doc.isActive).toBe(false)
    expect(await importTeamProfiles(payload, true)).toEqual([])
    expect(update).toHaveBeenCalledTimes(1)
    expect(Object.keys(update.mock.calls[0][0].data).sort()).toEqual(['bio', 'links'])
  })

  it('preserves custom text, formatting and deliberately cleared links', async () => {
    const slug = 'ayan-akbar-ali'
    const bio = plainTextRichText('Biography written in admin')
    const doc = { id: 1, slug, bio, links: { linkedIn: null, website: 'https://example.com' } }
    const update = vi.fn()
    const payload = { find: async ({ where }: { where: { slug: { equals: string } } }) => ({ docs: where.slug.equals === slug ? [doc] : [] }), update } as unknown as Payload
    expect(await importTeamProfiles(payload, true)).toEqual([])
    expect(update).not.toHaveBeenCalled()
  })
})
