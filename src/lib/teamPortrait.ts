import { fallbackTeam, type TeamMember } from './fallbackTeam'
import portraitRatios from './team-portrait-ratios.json'

const zooms: Record<string, number> = {
  'ayan-akbar-ali': 2.6,
  'brahama-teja-naroju': 1.45,
  'reeba-biju': 1.6,
  'omar-abdelrady': 1.25,
  'tony-mathew': 1.4,
  'shivansh-mehta': 1.25,
  'anish-paul': 1.25,
  'rahul-khandait': 3.2,
  'swaraj-tendulkar': 2,
  'niranjan-ramesha': 1.9,
}

// Framing belongs to the supplied photograph, not permanently to the person.
// A replacement uploaded in the CMS starts with a neutral crop.
export function teamPortrait(member: TeamMember) {
  const original = fallbackTeam.find((person) => person.slug === member.slug)
  const usesOriginal = original?.image === member.image
  return { key: usesOriginal ? member.slug : 'custom', zoom: usesOriginal ? zooms[member.slug] ?? 1 : 1 }
}

// Large profile photos retain their composition instead of inheriting card close-ups.
export function detailPortrait(member: TeamMember) {
  const { key } = teamPortrait(member)
  const ratio = (portraitRatios as Record<string, number>)[member.image] ?? member.imageAspectRatio ?? .85
  const needsLessHeadroom = ['vighnesh-madhav-deshmukh', 'niranjan-ramesha'].includes(key)
  return { key, ratio: needsLessHeadroom ? .85 : ratio, zoom: key === 'rahul-khandait' ? 1.6 : 1 }
}
