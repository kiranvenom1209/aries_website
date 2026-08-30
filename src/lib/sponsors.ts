import 'server-only'

export type PublicSponsor = {
  name: string
  logo: string
  website?: string
}

export const fallbackSponsors: PublicSponsor[] = [
  { name: 'Hochschule Schmalkalden', logo: '/media/hsm-powered-by.png', website: 'https://www.hs-schmalkalden.de' },
  { name: 'Boehm Group GmbH', logo: '/media/boehm-logo-2.png' },
  { name: 'SICK Sensor Intelligence', logo: '/media/sick-logo-1.png', website: 'https://www.sick.com' },
  { name: 'Skyforce Drone Solutions', logo: '/media/skyforce-logo.png' },
  { name: 'Eviotech', logo: '/media/eviotech-logo.jpg' },
]

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
      limit: 50,
      overrideAccess: false,
      sort: 'sortOrder',
      where: { isActive: { equals: true } },
    })
    const sponsors = result.docs.flatMap((doc) => {
      const logo = doc.logo && typeof doc.logo === 'object' ? doc.logo.url : null
      return logo ? [{ name: doc.name, logo, ...(doc.website ? { website: doc.website } : {}) }] : []
    })
    return sponsors.length ? sponsors : fallbackSponsors
  } catch {
    return fallbackSponsors
  }
}
