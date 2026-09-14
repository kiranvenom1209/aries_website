import type { Payload } from 'payload'
import baseline from './team-profile-baseline.json'
import { researchedProfiles } from './teamProfiles'
import { plainTextRichText } from './index'
import { profileRichText } from './profileRichText'

const stable = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(',')}}`
  return JSON.stringify(value) ?? 'undefined'
}

type Previous = { bio: string; position: string; links: { linkedIn?: string; website?: string } }

// Update only known generated values. Empty/custom content is a deliberate admin
// choice; never recreate it on a later deployment. No creation or activation here.
export async function importTeamProfiles(payload: Payload, apply = false, fillEmpty = false) {
  const changes: Array<{ slug: string; fields: string[] }> = []
  for (const [slug, profile] of Object.entries(researchedProfiles)) {
    const previous = (baseline as Record<string, Previous>)[slug]
    const result = await payload.find({ collection: 'team', depth: 0, limit: 1, overrideAccess: true, where: { slug: { equals: slug } } })
    const doc = result.docs[0]
    if (!doc || !previous) continue
    const legacyBio = stable(doc.bio) === stable(plainTextRichText(previous.bio))
    const populateBio = legacyBio || (fillEmpty && !doc.bio)
    const data: Record<string, unknown> = {}
    if (populateBio) data.bio = profileRichText(profile)
    const links = { ...doc.links }
    if (profile.linkedIn && (doc.links?.linkedIn === 'https://www.linkedin.com/company/aries-space' || (populateBio && !doc.links?.linkedIn))) {
      links.linkedIn = profile.linkedIn
    }
    if (profile.website && populateBio && (!doc.links?.website || doc.links.website === previous.links.website)) links.website = profile.website
    if (stable(links) !== stable(doc.links ?? {})) data.links = links
    // Exact superseded titles, corrected by the team; leave any later admin title alone.
    if (slug === 'harsha-vardhan-raju-gottimukkala' && doc.position === 'Team Lead LEAP-One & Interim Lead Scientific Payload') data.position = 'Team Lead LEAP-One'
    if (slug === 'anantha-pathmanabhan' && doc.position === 'Scientific Payload Engineer') data.position = 'Scientific Payload Lead'
    if (slug === 'shivansh-mehta' && doc.position === 'Scientific Payload & Sensors Engineer') {
      data.position = 'Embedded Software Engineer'
      if (doc.discipline === 'science') data.discipline = 'electrical'
      if (doc.departments?.length === 1 && doc.departments[0] === 'science') data.departments = ['electrical']
    }
    if (Object.keys(data).length) {
      changes.push({ slug, fields: Object.keys(data) })
      if (apply) await payload.update({ collection: 'team', id: doc.id, data, overrideAccess: true })
    }
  }
  return changes
}
