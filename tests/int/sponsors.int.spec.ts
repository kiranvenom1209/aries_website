import { beforeEach, describe, expect, it, vi } from 'vitest'

const { find } = vi.hoisted(() => ({ find: vi.fn() }))
vi.mock('server-only', () => ({}))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@/payload.config', () => ({ default: {} }))

import { fallbackSponsors, getSponsors } from '@/lib/sponsors'

describe('Public sponsor reconciliation', () => {
  beforeEach(() => { find.mockReset() })

  it('renders one logo per sponsor when old and current records coexist', async () => {
    find.mockResolvedValue({ docs: [
      { name: 'Skyforce Drone Solutions', logo: { url: '/old-skyforce.png' }, isActive: true },
      { name: 'Skyforce Innovations', logo: { url: '/current-skyforce.png' }, isActive: true },
      { name: 'Eviotech', logo: { url: '/old-eviotec.jpg' }, isActive: true },
      { name: 'Eviotec', logo: { url: '/current-eviotec.jpg' }, isActive: true },
    ] })
    const sponsors = await getSponsors()
    expect(sponsors).toHaveLength(6)
    expect(sponsors.filter((sponsor) => sponsor.name === 'Skyforce Innovations'))
      .toEqual([{ name: 'Skyforce Innovations', logo: '/current-skyforce.png', website: 'https://skyforceinnovations.com' }])
    expect(sponsors.filter((sponsor) => sponsor.name === 'Eviotec'))
      .toEqual([{ name: 'Eviotec', logo: '/current-eviotec.jpg' }])
  })

  it.each([true, false])('honors an inactive current record regardless of row order (%s)', async (reverse) => {
    const docs = [
      { name: 'Eviotech', isActive: true },
      { name: 'Eviotec', isActive: false },
    ]
    find.mockResolvedValue({ docs: reverse ? docs.reverse() : docs })
    expect((await getSponsors()).some((sponsor) => sponsor.name === 'Eviotec')).toBe(false)
  })

  it('recognizes a legacy name even when its logo is unavailable', async () => {
    find.mockResolvedValue({ docs: [{ name: 'Skyforce Drone Solutions', isActive: false }] })
    expect((await getSponsors()).some((sponsor) => sponsor.name === 'Skyforce Innovations')).toBe(false)
  })

  it('preserves custom sponsors and adds missing curated sponsors', async () => {
    const custom = { name: 'New Partner', logo: '/custom.png', website: 'https://example.com' }
    find.mockResolvedValue({ docs: [{ ...custom, logo: { url: custom.logo } }] })
    expect(await getSponsors()).toEqual([custom, ...fallbackSponsors])
  })

  it('falls back when the CMS is unavailable', async () => {
    find.mockRejectedValue(new Error('offline'))
    expect(await getSponsors()).toEqual(fallbackSponsors)
  })
})
