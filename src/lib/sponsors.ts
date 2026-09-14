import 'server-only'

import { sponsorNameKey, sponsorNames } from './sponsorNames'

export type PublicSponsor = {
  name: string
  logo: string
  website?: string
}

/**
 * Source of truth for partner names, logos and links. The CMS `sponsors` collection can
 * override order and activity, but a link or a sponsor added here reaches the live site even
 * when the deployed database was seeded before the change (Netlify only re-seeds with
 * BOOTSTRAP_PUBLIC_CONTENT=true): getSponsors() overlays these entries onto the CMS rows.
 */
export const fallbackSponsors: PublicSponsor[] = [
  { name: 'Hochschule Schmalkalden', logo: '/media/hsm-powered-by.png', website: 'https://www.hs-schmalkalden.de' },
  { name: 'Boehm Group GmbH', logo: '/media/boehm-logo-2.png', website: 'https://www.boehm-group.com' },
  { name: 'SICK Sensor Intelligence', logo: '/media/sick-logo-1.png', website: 'https://www.sick.com' },
  { name: 'Skyforce Innovations', logo: '/media/skyforce-logo.png', website: 'https://skyforceinnovations.com' },
  { name: 'Eviotec', logo: '/media/eviotech-logo.jpg' },
  { name: 'ODrive Robotics', logo: '/media/odrive-logo.png', website: 'https://odriverobotics.com' },
]

const logoKey = (value: string) => value.split('/').pop()?.replace(/\.[^.]+$/, '').toLowerCase() ?? ''

/** A CMS row and a fallback entry are the same sponsor if the name matches (ignoring punctuation and a trailing "GmbH") or the logo file does — the latter also catches a spelling fix like Eviotech → Eviotec. */
const matchFallback = (name: string, logo: string | null) =>
  fallbackSponsors.find(
    (sponsor) =>
      sponsorNames(sponsor.name).some((alias) => sponsorNameKey(alias) === sponsorNameKey(name)) ||
      (logo !== null && logoKey(sponsor.logo) === logoKey(logo)),
  )

export async function getSponsors(): Promise<PublicSponsor[]> {
  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('@/payload.config'),
    ])
    const payload = await getPayload({ config: await configModule.default })
    const result = await payload.find({
      collection: 'sponsors',
      depth: 1,
      limit: 100,
      // Server-only read of the full list, inactive rows included: public access hides them,
      // and a sponsor the team switched off must not be re-added from the code list below.
      overrideAccess: true,
      sort: 'sortOrder',
    })
    if (result.docs.length === 0) return fallbackSponsors

    // Group before rendering so a renamed CMS row cannot produce a second logo.
    // Prefer the current name, including its activity setting, over legacy rows.
    const rows = new Map<string, (typeof result.docs)[number]>()
    for (const doc of result.docs) {
      const logo = doc.logo && typeof doc.logo === 'object' ? (doc.logo.url ?? null) : null
      const fallback = matchFallback(doc.name, logo)
      const identity = sponsorNameKey(fallback?.name ?? doc.name)
      if (!rows.has(identity) || doc.name === fallback?.name) rows.set(identity, doc)
    }

    const seen = new Set<PublicSponsor>()
    const sponsors = [...rows.values()].flatMap((doc) => {
      const logo = doc.logo && typeof doc.logo === 'object' ? (doc.logo.url ?? null) : null
      const fallback = matchFallback(doc.name, logo)
      if (fallback) seen.add(fallback)
      if (doc.isActive === false) return [] // deactivated in the CMS stays hidden, even if listed here
      const resolvedLogo = logo ?? fallback?.logo
      if (!resolvedLogo) return []
      const website = doc.website || fallback?.website
      // The name spelling is owned here (it is what appears on the strip and in alt text); the CMS owns order and activity.
      return [{ name: fallback?.name ?? doc.name, logo: resolvedLogo, ...(website ? { website } : {}) }]
    })
    // Sponsors added in code after the database was last seeded.
    const missing = fallbackSponsors.filter((sponsor) => !seen.has(sponsor))
    return [...sponsors, ...missing]
  } catch {
    return fallbackSponsors
  }
}
