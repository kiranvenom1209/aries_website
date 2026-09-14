import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'

vi.mock('node:fs/promises', async (importOriginal) => ({
  ...await importOriginal<typeof import('node:fs/promises')>(),
  access: async () => {},
}))
vi.mock('@/lib/fallbackTeam', () => ({ fallbackTeam: [] }))
vi.mock('@/seed/news', () => ({
  downloadSeed: [], gallerySeed: [], newsSeed: [],
  mediaSeed: [{ filename: 'eviotech-logo.jpg', alt: 'Eviotec' }],
  sponsorSeed: [{ name: 'Eviotec', logo: 'eviotech-logo.jpg', sortOrder: 50, tier: 'partner' }],
}))

import { seedPublicContent } from '@/seed'

describe('Sponsor seeding after a rename', () => {
  it.each([false, true])('reuses existing records and remains idempotent (current record exists: %s)', async (hasCurrent) => {
    const rows = [
      { id: 1, name: 'Eviotech', isActive: true },
      ...(hasCurrent ? [{ id: 2, name: 'Eviotec', isActive: true }] : []),
    ]
    const create = vi.fn(() => { throw new Error('Should reuse an existing record') })
    const payload = {
      logger: { info: vi.fn() }, create,
      find: vi.fn(async ({ collection, where }) => {
        if (collection === 'media') return { docs: [{ id: 10, filename: 'eviotech-logo.jpg' }] }
        if (collection === 'sponsors') return { docs: rows.filter((row) => where.name.in.includes(row.name)) }
        return { docs: [] }
      }),
      update: vi.fn(async ({ collection, id, data }) => {
        if (collection === 'sponsors') {
          const row = rows.find((item) => item.id === id)!
          Object.assign(row, data)
          return row
        }
        return { id }
      }),
    }
    await seedPublicContent(payload as unknown as Payload)
    await seedPublicContent(payload as unknown as Payload)
    expect(create).not.toHaveBeenCalled()
    expect(rows.filter((row) => row.isActive)).toEqual([
      expect.objectContaining({ id: hasCurrent ? 2 : 1, name: 'Eviotec', isActive: true }),
    ])
    if (hasCurrent) expect(rows.find((row) => row.name === 'Eviotech')?.isActive).toBe(false)
  })
})
