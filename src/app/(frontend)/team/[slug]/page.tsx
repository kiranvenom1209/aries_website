import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { PageShell } from '@/components/PageShell'
import { disciplineLabels, getTeam, getTeamMemberBySlug, publicProfileLink } from '@/lib/team'
import { metadataDescription, pageMetadata, serializeJsonLd } from '@/lib/seo'
import { detailPortrait } from '@/lib/teamPortrait'
import { teamProfileJsonLd } from '@/lib/teamSeo'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getTeamMemberBySlug((await params).slug)
  if (!member) return { title: 'Off the map', robots: { index: false, follow: false } }
  const metadata = pageMetadata({
    title: member.name,
    description: metadataDescription(member.bio || `${member.name} — ${member.position} at HSM Aries.`),
    path: `/team/${member.slug}`,
    image: member.image,
    imageAlt: member.imageAlt,
  })
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'profile' } }
}

export default async function MemberProfilePage({ params }: Props) {
  const member = await getTeamMemberBySlug((await params).slug)
  if (!member) notFound()
  const members = await getTeam()
  const next = members.length > 1 ? members[(members.findIndex((person) => person.slug === member.slug) + 1) % members.length] : undefined
  const linkedIn = publicProfileLink(member.links?.linkedIn, true)
  const website = publicProfileLink(member.links?.website)
  const departments = [...new Set(member.departments ?? [member.discipline])]
  const portrait = detailPortrait(member)

  return (
    <PageShell>
      <article className="crew-profile">
        <nav aria-label="Breadcrumb" className="crew-profile__breadcrumb">
          <Link href="/">Home</Link><Link href="/team">Engineering crew</Link><span aria-current="page">{member.name}</span>
        </nav>
        <div className="crew-profile__grid">
          <figure className="crew-profile__portrait">
            <div className={`crew-profile__photo crew-profile__photo--${portrait.key}`} style={{ aspectRatio: portrait.ratio }}>
            <Image alt={member.imageAlt} fill preload sizes={`(max-width: 820px) ${Math.ceil(100 * portrait.zoom)}vw, ${Math.ceil(42 * portrait.zoom)}vw`} src={member.image} />
            {member.rankBadge ? <Image alt={`${member.rank ?? 'Leadership'} insignia`} className="crew-profile__badge" height={110} width={66} src={member.rankBadge} /> : null}
            </div>
            <figcaption>{member.isAlumni ? 'Aries alumni' : member.disciplineLabel}</figcaption>
          </figure>
          <div className="crew-profile__copy">
            <p className="crew-profile__eyebrow">HSM ARIES / {member.isAlumni ? 'ALUMNI · PART OF OUR STORY' : 'THE PEOPLE BEHIND THE ROVER'}</p>
            <h1>{member.name}</h1>
            <p className="crew-profile__role">{member.isAlumni ? `Former ${member.position}` : member.position}</p>
            <ul aria-label="Departments" className="crew-profile__departments">
              {departments.map((department) => <li key={department}>{disciplineLabels[department] ?? 'Core Team'}</li>)}
            </ul>
            {member.bio ? <section className="crew-profile__bio" aria-labelledby="profile-about">
              <h2 id="profile-about">{member.isAlumni ? 'Their contribution' : 'On the team'}</h2>
              {member.bioRichText ? <RichText data={member.bioRichText} /> : member.bio.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </section> : null}
            {linkedIn || website ? <nav aria-label={`Connect with ${member.name}`} className="crew-profile__links">
              {linkedIn ? <a href={linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a> : null}
              {website ? <a href={website} target="_blank" rel="noopener noreferrer">Website / Portfolio <span aria-hidden="true">↗</span></a> : null}
            </nav> : null}
          </div>
        </div>
        <nav aria-label="Explore the crew" className="crew-profile__browse">
          <Link href="/team"><small>BACK TO THE DIRECTORY</small><span>Meet the whole crew <i aria-hidden="true">↗</i></span></Link>
          {next ? <Link href={`/team/${next.slug}`}><small>NEXT CREW MEMBER</small><span>{next.name} <i aria-hidden="true">→</i></span></Link> : null}
        </nav>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(teamProfileJsonLd(member)) }} />
    </PageShell>
  )
}
