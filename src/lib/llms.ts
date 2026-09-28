import type { NewsStory } from './fallbackNews'
import { LEGAL } from './legal'
import { getNews } from './news'
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_EMAIL, SITE_NAME } from './seo'
import { SITE_PAGES, type SitePage } from './sitePages'
import { getTeam } from './team'
import type { TeamMember } from './fallbackTeam'

/**
 * `/llms.txt` (https://llmstxt.org) and `/llms-full.txt`: a plain-Markdown map of the site for AI
 * assistants and answer engines. Both are built on request from the page registry, the CMS news
 * and the team, so new stories and profiles appear without anyone editing these files.
 * Result figures follow knowledge/erc-2026/hsm-aries-result.md.
 */

const SUMMARY =
  'HSM Aries is the student space-robotics team of Hochschule Schmalkalden in Schmalkalden, Germany, based at the Chair of Drive, Automation, and Robotics Technologies. Its first planetary rover, LEAP-One, finished 17th in the 25-team finals of the European Rover Challenge (ERC) 2026 in Kraków, from a starting field of 124 registered teams, with 1492.25 of 3000 points. Leap-2, the next rover of the LEAP series, is in development.'

const KEY_FACTS = [
  'Name: HSM Aries (also written HSM Aries.space); listed as "HSM ARIES" on the ERC scoreboard.',
  `Home: ${LEGAL.institution}, ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}, Germany.`,
  'Rovers: LEAP-One is Project 01, the first rover of the LEAP series and an ERC 2026 finalist. Leap-2 is Project 02 and in development; its specifications have not been published.',
  'ERC 2026 finals: 4–6 September 2026, AGH University, Kraków. 17th of 25 finalist teams, from 124 registered teams. 1492.25 of 3000 points — the team’s first ERC appearance, achieved without major sponsorship.',
  'Strongest results at the finals: documentation 364.25 of 400 (4th of 25) and navigation droning 265 of 300 (6th of 25), built on the joint-highest qualification score in the finals field, 239.75 of 250.',
  'Organisation: eight engineering departments of undergraduate and postgraduate students, supported by university mentors.',
  `Contact: ${SITE_EMAIL} · ${absoluteUrl('/contact')}`,
  'Language: English; the legal pages are also available in German.',
]

const SECTION_ORDER: SitePage['section'][] = ['Programme', 'Crew', 'Updates', 'Get involved', 'Resources', 'Legal']

const isoDay = (value: string) => (Number.isNaN(Date.parse(value)) ? value : new Date(value).toISOString().slice(0, 10))
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim()
const link = (title: string, path: string) => `[${title.replace(/[[\]]/g, '')}](${absoluteUrl(path)})`

function pageLines() {
  return SECTION_ORDER.flatMap((section) => {
    const pages = SITE_PAGES.filter((page) => page.section === section)
    if (pages.length === 0) return []
    return [`## ${section}`, '', ...pages.map((page) => `- ${link(page.title, page.path)}: ${page.summary}`), '']
  })
}

const storyLine = (story: NewsStory) =>
  `- ${link(story.title, `/news/${story.slug}`)} (${isoDay(story.publishedAt)}): ${oneLine(story.seoDescription || story.excerpt)}`

const memberLine = (member: TeamMember) => `- ${link(member.name, `/team/${member.slug}`)}: ${member.position} · ${member.disciplineLabel}`

function header() {
  return [`# ${SITE_NAME}`, '', `> ${SUMMARY}`, '', ...KEY_FACTS.map((fact) => `- ${fact}`), '']
}

function machineReadable() {
  return [
    '## Machine-readable',
    '',
    `- ${link('Full text for language models', '/llms-full.txt')}: every page summary, mission update and crew profile in one file.`,
    `- ${link('Mission updates feed (RSS)', '/feed.xml')}`,
    `- ${link('Sitemap index', '/sitemap_index.xml')}`,
    '',
  ]
}

export async function llmsTxt(): Promise<string> {
  const [stories, team] = await Promise.all([getNews(100), getTeam()])
  const current = team.filter((member) => !member.isAlumni)
  const alumni = team.filter((member) => member.isAlumni)
  return [
    ...header(),
    ...pageLines(),
    '## Mission updates',
    '',
    ...stories.map(storyLine),
    '',
    '## Crew profiles',
    '',
    ...current.map(memberLine),
    '',
    ...(alumni.length ? ['## Optional', '', ...alumni.map((member) => `${memberLine(member)} (alumni)`), ''] : []),
    ...machineReadable(),
  ].join('\n')
}

/** Story body as Markdown: `## ` markers become headings, the scoreboard a table. */
function storyMarkdown(story: NewsStory) {
  const body = story.body.map((paragraph) => {
    const text = paragraph.trim()
    return /^##\s+/.test(text) ? `### ${text.replace(/^##\s+/, '')}` : text
  })
  const scoreboard = story.scoreboard?.length
    ? [
        '| Line | Points | Max | Rank |',
        '| --- | ---: | ---: | --- |',
        ...story.scoreboard.map((row) => `| ${row.label} | ${row.points} | ${row.max || '—'} | ${row.rank ?? ''} |`),
      ].join('\n')
    : null
  return [
    `## ${story.title}`,
    '',
    `URL: ${absoluteUrl(`/news/${story.slug}`)}`,
    `Published: ${isoDay(story.publishedAt)}${story.category ? ` · ${story.category}` : ''}${story.author ? ` · ${story.author}` : ''}`,
    '',
    ...(scoreboard ? [scoreboard, ''] : []),
    body.join('\n\n'),
    '',
  ].join('\n')
}

function memberMarkdown(member: TeamMember) {
  return [
    `### ${member.name}${member.isAlumni ? ' (alumni)' : ''}`,
    '',
    `${member.position} · ${member.disciplineLabel} · ${absoluteUrl(`/team/${member.slug}`)}`,
    '',
    ...(member.bio ? [oneLine(member.bio), ''] : []),
  ].join('\n')
}

export async function llmsFullTxt(): Promise<string> {
  const [stories, team] = await Promise.all([getNews(100), getTeam()])
  return [
    ...header(),
    `${DEFAULT_DESCRIPTION}`,
    '',
    '# Pages',
    '',
    ...pageLines(),
    '# Mission updates',
    '',
    ...stories.map(storyMarkdown),
    '# Crew',
    '',
    ...team.map(memberMarkdown),
    ...machineReadable(),
  ].join('\n')
}

export function markdownResponse(markdown: string): Response {
  return new Response(markdown, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      // Markdown served as plain text so browsers show it instead of downloading it.
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  })
}
