import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/fallbackTeam', () => ({ fallbackTeam: [
  { slug: 'existing', name: 'Existing', bio: 'Seed bio', discipline: 'software', image: '/portrait.jpg', position: 'Engineer' },
  { slug: 'new-seed', name: 'New seed', bio: 'Seed bio', discipline: 'science', image: '/portrait.jpg', position: 'Engineer' },
] }))
vi.mock('@/seed/news', () => ({ downloadSeed: [], gallerySeed: [], newsSeed: [], mediaSeed: [], sponsorSeed: [] }))
import { seedPublicContent } from '@/seed'

describe('Team bootstrap preserves admin ownership', () => {
  it('creates missing seed members once and leaves edited, hidden and admin-added people untouched', async () => {
    const existing = { id: 1, slug: 'existing', bio: 'Editor bio', isActive: false, portrait: 123 }
    const added = { id: 2, slug: 'admin-added', bio: 'New colleague', isActive: true }
    const rows: Array<Record<string, unknown>> = [existing, added]
    const update = vi.fn()
    const create = vi.fn(async ({ data }) => { const row = { id: rows.length + 1, ...data }; rows.push(row); return row })
    const payload = {
      logger: { info: vi.fn() }, update, create,
      find: async ({ collection, where }: { collection: string; where: { slug?: { equals: string } } }) => ({
        docs: collection === 'team' ? rows.filter((row) => !where.slug || row.slug === where.slug.equals) : [],
      }),
    } as unknown as Payload
    await seedPublicContent(payload)
    await seedPublicContent(payload)
    expect(create).toHaveBeenCalledTimes(1)
    expect(update).not.toHaveBeenCalled()
    expect(existing).toEqual({ id: 1, slug: 'existing', bio: 'Editor bio', isActive: false, portrait: 123 })
    expect(added.isActive).toBe(true)
  })
})
