// Historical CMS names must continue to identify the same sponsor after a rename.
const aliases: Record<string, string[]> = {
  'Skyforce Innovations': ['Skyforce Drone Solutions'],
  Eviotec: ['Eviotech'],
}

export const sponsorNames = (name: string): string[] => [name, ...(aliases[name] ?? [])]

export const sponsorNameKey = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/gmbh$/, '')
