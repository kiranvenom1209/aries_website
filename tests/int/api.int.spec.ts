import type {} from '@/payload-types'
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { getNews, getNewsBySlug, formatNewsDate } from '@/lib/news'
import { getTeam, getTeamMemberBySlug } from '@/lib/team'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Payload API & Collections', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users collection', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
    expect(Array.isArray(users.docs)).toBe(true)
  })

  it('fetches news collection with seeded articles', async () => {
    const news = await payload.find({
      collection: 'news',
      limit: 10,
    })
    expect(news).toBeDefined()
    expect(news.docs.length).toBeGreaterThanOrEqual(1)
    const firstArticle = news.docs[0]
    expect(firstArticle.title).toBeDefined()
    expect(firstArticle.slug).toBeDefined()
  })

  it('fetches media collection with seeded images', async () => {
    const media = await payload.find({
      collection: 'media',
    })
    expect(media).toBeDefined()
    expect(media.docs.length).toBeGreaterThanOrEqual(1)
  })

  it('fetches gallery collection', async () => {
    const gallery = await payload.find({
      collection: 'gallery',
    })
    expect(gallery).toBeDefined()
    expect(gallery.docs.length).toBeGreaterThanOrEqual(1)
  })

  it('fetches downloads collection', async () => {
    const downloads = await payload.find({
      collection: 'downloads',
    })
    expect(downloads).toBeDefined()
    expect(downloads.docs.length).toBeGreaterThanOrEqual(1)
  })

  it('fetches team collection with seeded members', async () => {
    const team = await payload.find({
      collection: 'team',
      limit: 15,
    })
    expect(team).toBeDefined()
    expect(team.docs.length).toBeGreaterThanOrEqual(1)
    const firstMember = team.docs[0]
    expect(firstMember.name).toBeDefined()
    expect(firstMember.position).toBeDefined()
  })
})

describe('Team Library Functions', () => {
  it('getTeam returns list of formatted team members', async () => {
    const members = await getTeam()
    expect(members).toBeDefined()
    expect(members.length).toBeGreaterThanOrEqual(5)
    expect(members[0]).toHaveProperty('name')
    expect(members[0]).toHaveProperty('position')
    expect(members[0]).toHaveProperty('discipline')
  })

  it('getTeam filters by discipline', async () => {
    const mechanical = await getTeam('mechanical')
    expect(mechanical.length).toBeGreaterThanOrEqual(1)
    expect(mechanical.every((m) => m.discipline === 'mechanical')).toBe(true)
  })

  it('getTeamMemberBySlug retrieves a specific member', async () => {
    const member = await getTeamMemberBySlug('brahama-teja-naroju')
    expect(member).toBeDefined()
    expect(member?.name).toBe('Brahama Teja Naroju')
    expect(member?.position).toContain('Mechanical Lead')
  })
})

describe('News Library Functions', () => {
  it('getNews returns list of formatted news stories', async () => {
    const stories = await getNews(3)
    expect(stories).toBeDefined()
    expect(stories.length).toBeGreaterThanOrEqual(1)
    expect(stories[0]).toHaveProperty('title')
    expect(stories[0]).toHaveProperty('slug')
    expect(stories[0]).toHaveProperty('excerpt')
    expect(stories[0]).toHaveProperty('image')
  })

  it('getNewsBySlug retrieves a specific news story', async () => {
    const story = await getNewsBySlug(
      'number-one-worldwide-hsm-aries-space-tops-erc-qualifications-with-239-75-points',
    )
    expect(story).toBeDefined()
    expect(story?.title).toContain('Number One Worldwide')
  })

  it('formatNewsDate formats ISO dates to UK military format', () => {
    const formatted = formatNewsDate('2026-06-28T17:34:00.000Z')
    expect(formatted).toBe('28 JUN 2026')
  })
})
