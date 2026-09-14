import type { TeamMember } from '../lib/fallbackTeam'
import type { ProfileResearch } from './teamProfiles'

const text = (value: string) => ({ type: 'text', text: value, version: 1, detail: 0, format: 0, mode: 'normal', style: '' })
const paragraph = (children: unknown[]) => ({ type: 'paragraph', version: 1, children, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '' })

// Standard Lexical nodes keep the entire biography and research list editable in admin.
export function profileRichText(profile: ProfileResearch): NonNullable<TeamMember['bioRichText']> {
  const children: unknown[] = profile.bio.split(/\n\s*\n/).map((value) => paragraph([text(value)]))
  if (profile.works?.length) {
    children.push({ type: 'heading', tag: 'h3', version: 1, children: [text('Selected research & projects')], direction: 'ltr', format: '', indent: 0 })
    for (const work of profile.works) children.push(paragraph([
      { type: 'link', version: 3, children: [text(work.title)], direction: 'ltr', format: '', indent: 0, fields: { linkType: 'custom', newTab: true, url: work.url } },
      text(` — ${work.detail}`),
    ]))
  }
  return { root: { type: 'root', version: 1, children, direction: 'ltr', format: '', indent: 0 } } as NonNullable<TeamMember['bioRichText']>
}
