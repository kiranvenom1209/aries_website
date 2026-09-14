import { teamPortrait } from '@/lib/teamPortrait'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { MagneticLink } from '@/components/MagneticLink'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import type { TeamMember } from '@/lib/team'
import { getTeam } from '@/lib/team'
import { absoluteUrl, metadataDescription, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'Meet the advisors, mentors and student departments that took LEAP-One to the ERC 2026 finals and are now building Leap-2, the second LEAP rover.',
  image: '/media/og/team.jpg',
  imageAlt: 'The HSM Aries crew with LEAP-One and the German and Thuringian flags on the Mars yard at the ERC 2026 finals',
  path: '/team',
  title: 'Engineering crew',
})

// primary: rank insignia is shown here. lead: leads this department (a team fact; the role string carries it on the page).
type DepartmentMember = { lead?: boolean; primary?: boolean; role: string; slug: string }

// Role strings are the engineer's actual title (fallbackTeam.position, shortened), never the department name.
// Roster order, leads and ranks are facts owned by the team — do not reorder or re-rank here.
const departments: Array<{
  badge: string
  code: string
  label: string
  members: DepartmentMember[]
  record?: string
}> = [
  {
    badge: '/media/l1-mech-crop.png',
    code: 'MECH',
    label: 'Mechanical & Drivetrain',
    members: [
      { primary: true, role: 'Mechanical Lead', slug: 'brahama-teja-naroju' },
      { role: 'Mechanical Engineer', slug: 'shreyas-patel' },
      { role: 'Mechanical & Drill Specialist', slug: 'naveen-kumar-shivakumar' },
      { role: 'Mechanical & Manipulator Specialist', slug: 'rahul-kamatagi' },
    ],
    record: 'ERC 2026 · mass −22 / 200, the only negative score in the field',
  },
  {
    badge: '/media/l1-electric-crop.png',
    code: 'ELEC',
    label: 'Electrical & Power Systems',
    members: [
      { primary: true, role: 'Electrical Lead', slug: 'ayan-akbar-ali' },
      { role: 'Electrical & Teleoperation Engineer', slug: 'mohammad-abdulaziz' },
      { role: 'Electrical & Power Systems Engineer', slug: 'yash-lohar' },
      { role: 'Electrical Hardware Specialist', slug: 'md-bashar' },
      { role: 'Electrical Engineer', slug: 'tony-mathew' },
      { role: 'Embedded Software Engineer', slug: 'shivansh-mehta' },
    ],
  },
  {
    badge: '/media/l1-software-crop.png',
    code: 'SOFT',
    label: 'Software & Autonomy',
    members: [
      { primary: true, role: 'Software Lead', slug: 'omar-abdelrady' },
      { role: 'Software Engineer', slug: 'vighnesh-madhav-deshmukh' },
      { role: 'Team Lead LEAP-One', slug: 'harsha-vardhan-raju-gottimukkala' },
      { role: 'Software Engineer', slug: 'rahul-khandait' },
      { role: 'Software & Perception Engineer', slug: 'mukul-bimbra' },
      { role: 'Software & Navigation Engineer', slug: 'priyam-bhatnagar' },
    ],
    record: 'ERC 2026 · traverse 43 / 340 · exploration 123 / 340',
  },
  {
    badge: '/media/l1-comm-crop.png',
    code: 'COMM',
    label: 'Communications & RF',
    members: [{ primary: true, role: 'Communication Lead', slug: 'vighnesh-madhav-deshmukh' }],
  },
  {
    badge: '/media/l1-drill-arm-crop.png',
    code: 'DRILL',
    label: 'Drill & Manipulator',
    members: [
      { primary: true, role: 'Manipulator Lead', slug: 'brahama-teja-naroju' },
      { role: 'Mechanical & Manipulator Specialist', slug: 'rahul-kamatagi' },
      { lead: true, role: 'Drill Lead', slug: 'danny-sneham' },
      { role: 'Mechanical & Drill Specialist', slug: 'naveen-kumar-shivakumar' },
    ],
    record: 'ERC 2026 · maintenance 66 / 340 · probing 12 / 240',
  },
  {
    badge: '/media/l1_astro-1.png',
    code: 'ASTRO',
    label: 'Astroflight (AQUILA UAV)',
    members: [
      { primary: true, role: 'Drone Lead', slug: 'rahul-khandait' },
      { role: 'Software Lead', slug: 'omar-abdelrady' },
      { role: 'Drone Software Engineer', slug: 'anish-paul' },
    ],
    record: 'ERC 2026 · navigation droning 265 / 300, 6th of 25',
  },
  {
    badge: '/media/l1-science-crop.png',
    code: 'SCI',
    label: 'Scientific Payload',
    members: [
      { lead: true, primary: true, role: 'Scientific Payload Lead', slug: 'anantha-pathmanabhan' },
      { role: 'Team Lead LEAP-One', slug: 'harsha-vardhan-raju-gottimukkala' },
      { role: 'Scientific Payload Specialist', slug: 'ashwin-dinesh-ayinipully' },
    ],
    record: 'ERC 2026 · AstroBio 215 / 300 · surface & deep sampling 197 / 440',
  },
  {
    badge: '/media/l1_mro-1.png',
    code: 'MRO',
    label: 'Mission Resources & Outreach',
    members: [
      { primary: true, role: 'MRO Lead', slug: 'reeba-biju' },
      { role: 'Team Lead LEAP-One', slug: 'harsha-vardhan-raju-gottimukkala' },
    ],
    record: 'ERC 2026 · documentation 364.25 / 400, 4th of 25 · presentation 229 / 300',
  },
]

function PrincipalAdvisor({ member, index }: { index: number; member: TeamMember }) {
  return (
    <article className="principal-advisor profile-entry">
      <div className="principal-advisor__portrait" itemScope itemType="https://schema.org/ImageObject">
        <Image alt={member.imageAlt} fill sizes="(max-width: 760px) 100vw, 58vw" src={member.image} />
        <meta content={member.image} itemProp="contentUrl" />
        {member.imageCredit ? <meta content={member.imageCredit} itemProp="creditText" /> : null}
        {member.imageCreditUrl ? <link href={member.imageCreditUrl} itemProp="acquireLicensePage" /> : null}
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="principal-advisor__copy">
        <small>PRINCIPAL ADVISOR / {String(index + 1).padStart(2, '0')}</small>
        <h3><Link className="member-profile-link" href={`/team/${member.slug}`}>{member.name}</Link></h3>
        <strong>{member.position}</strong>
        <p>{metadataDescription(member.bio, 240)}</p>
        <span className="profile-entry__hint" aria-hidden="true">View profile ↗</span>
      </div>
    </article>
  )
}

// One tile per listing. Rank insignia at the primary post only; a repeat listing carries an
// "Also …" chip pointing back to the earlier department instead of a second full card.
function RosterPerson({ also = [], member, role, showBadge = false }: { also?: string[]; member: TeamMember; role: string; showBadge?: boolean }) {
  const { key: portraitKey, zoom } = teamPortrait(member)
  return (
    <article className={`roster-person profile-entry roster-person--${portraitKey}`}>
      <div className="roster-person__portrait">
        <Image alt={`${member.name} — ${role}`} fill sizes={`(max-width: 820px) ${Math.ceil(50 * zoom)}vw, ${Math.ceil(200 * zoom)}px`} src={member.image} />
        {showBadge && member.rankBadge ? (
          <Image
            alt={`${member.rank ?? 'Leadership'} rank insignia`}
            className="roster-person__rank"
            height={97}
            src={member.rankBadge}
            width={58}
          />
        ) : null}
      </div>
      <div className="roster-person__copy">
        <h4><Link className="member-profile-link" href={`/team/${member.slug}`}>{member.name}</Link></h4>
        <p>{role}</p>
        <span className="profile-entry__hint" aria-hidden="true">View profile ↗</span>
        {also.length > 0 ? <span className="roster-person__also">Also {also.join(' · ')}</span> : null}
      </div>
    </article>
  )
}

export default async function TeamPage() {
  const publicMembers = await getTeam()
  const members = publicMembers.filter((member) => !member.isAlumni)
  const alumni = publicMembers.filter((member) => member.isAlumni)
  const bySlug = new Map(members.map((member) => [member.slug, member]))
  const principalAdvisors = ['prof-dr-ing-frank-schrodel', 'alexander-kolbai']
    .map((slug) => bySlug.get(slug))
    .filter((member): member is TeamMember => Boolean(member))
  const mentors = [
    'swaraj-tendulkar',
    'kk-achari',
    'venkata-prashanth-uppalapati',
    'niranjan-ramesha',
    'nikhil-meduri',
  ]
    .map((slug) => bySlug.get(slug))
    .filter((member): member is TeamMember => Boolean(member))
  const commander = bySlug.get('harsha-vardhan-raju-gottimukkala')
  const listedSlugs = new Set([...principalAdvisors, ...mentors, ...(commander ? [commander] : [])].map((member) => member.slug).concat(departments.flatMap((department) => department.members.map((entry) => entry.slug))))
  const additionalMembers = members.filter((member) => !listedSlugs.has(member.slug))
  const studentCount = members.filter((member) => member.discipline !== 'mentors').length

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        url: absoluteUrl('/team'), name: 'HSM Aries crew and alumni',
        mainEntity: {
          '@type': 'ItemList', itemListOrder: 'https://schema.org/ItemListUnordered',
          numberOfItems: publicMembers.length,
          itemListElement: publicMembers.map((member) => ({
            '@type': 'ListItem', url: absoluteUrl(`/team/${member.slug}`), name: member.name,
          })),
        },
      }) }} />
      <section className="crew-hero">
        <Image alt="HSM Aries mission crew at Space Night" fetchPriority="high" fill preload sizes="100vw" src="/media/space-night-team.jpg" />
        <div aria-hidden="true" className="crew-hero__shade" />
        <div className="crew-hero__copy">
          <span>PERSONNEL / HSM ARIES</span>
          <h1>HSM Aries has <em>no passengers.</em></h1>
          <p>{studentCount} student engineers, 2 principal advisors and 5 mentors at Hochschule Schmalkalden. The crew took LEAP-One to the ERC 2026 finals in Kraków — 17th place from 124 registered teams, with 25 finalists and 4th in documentation — and is now building Leap-2.</p>
        </div>
        <div className="crew-hero__ticker" aria-label="Crew summary" role="group">
          <span>CREW MANIFEST</span>
          <strong>{String(studentCount).padStart(2, '0')} STUDENT ENGINEERS</strong>
          <i /><strong>02 PRINCIPAL ADVISORS</strong><i /><strong>05 MENTORS</strong><i /><strong>08 DEPARTMENTS</strong><i /><strong>ERC 2026 FINALS · 17TH OF 25 · 1492.25 PTS</strong>
        </div>
      </section>

      <nav aria-label="Crew directory" className="crew-directory">
        <div className="crew-directory__intro">
          <span>01 / CREW DIRECTORY</span>
          <p>Student-led. Backed by experience.<br />Meet the people behind each subsystem.</p>
        </div>
        <div className="crew-directory__links">
          <a href="#principal-advisors">Principal advisors <span aria-hidden="true">↘</span></a>
          <a href="#mentor-council">Mentor council <span aria-hidden="true">↘</span></a>
          {commander ? <a href="#project-command">Project command <span aria-hidden="true">↘</span></a> : null}
          <a href="#departments">Departments <span aria-hidden="true">↘</span></a>
          {alumni.length ? <a href="#alumni">Alumni <span aria-hidden="true">↘</span></a> : null}
        </div>
      </nav>

      <section className="roster-guidance" id="principal-advisors">
        <header className="section-command">
          <div><span>02 / PRINCIPAL ADVISORS</span><i /></div>
          <h2>The two people<br />guiding the programme.</h2>
          <p>A faculty advisor at Hochschule Schmalkalden and an industry advisor from precision manufacturing anchor the programme.</p>
        </header>
        <div className="principal-advisors">
          {principalAdvisors.map((member, index) => <PrincipalAdvisor index={index} key={member.slug} member={member} />)}
        </div>
      </section>

      <section className="mentor-council" id="mentor-council">
        <header><span>03 / MENTOR COUNCIL</span><h2>Specialist guidance<br />across the programme.</h2></header>
        <div className="mentor-council__grid">
          {mentors.map((member, index) => (
            <article className={`mentor-profile profile-entry mentor-profile--${teamPortrait(member).key}`} key={member.slug}>
              <div>
                <Image alt={member.imageAlt} fill sizes="(max-width: 600px) 50vw, 44vw" src={member.image} />
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3><Link className="member-profile-link" href={`/team/${member.slug}`}>{member.name}</Link></h3>
              <p>{member.position}</p>
              <span className="profile-entry__hint" aria-hidden="true">View profile ↗</span>
            </article>
          ))}
        </div>
      </section>

      {commander ? (
        <section className="mission-command-profile profile-entry" id="project-command">
          <div className="mission-command-profile__portrait">
            <Image alt={commander.imageAlt} fill sizes="(max-width: 760px) 100vw, 45vw" src={commander.image} />
            {commander.rankBadge ? <Image alt="Commander rank insignia" className="mission-command-profile__rank" height={135} src={commander.rankBadge} width={86} /> : null}
          </div>
          <div className="mission-command-profile__copy">
            <span>04 / PROJECT COMMAND</span><small>LEAP-ONE PROJECT COMMANDER</small>
            <h2><Link className="member-profile-link" href={`/team/${commander.slug}`}>{commander.name}</Link></h2><strong>Team Lead LEAP-One</strong><p>{metadataDescription(commander.bio, 280)}</p>
            <span className="profile-entry__hint" aria-hidden="true">View profile ↗</span>
          </div>
        </section>
      ) : null}

      <section className="department-manifests" id="departments">
        <header className="section-command">
          <div><span>05 / DEPARTMENTS</span><i /></div>
          <h2>Eight teams.<br />One integrated rover.</h2>
          <p>Eight departments built LEAP-One and are now designing Leap-2. Engineers who serve in more than one are listed in each; rank insignia are shown at primary posts only.</p>
        </header>

        {departments.map((department, departmentIndex) => {
          const departmentMembers = department.members
            .map((entry) => ({ entry, member: bySlug.get(entry.slug) }))
            .filter((item): item is { entry: DepartmentMember; member: TeamMember } => Boolean(item.member))
          // Departments an engineer was already listed under, shown as an "Also …" chip on repeat listings.
          const earlierPosts = (slug: string) =>
            departments
              .slice(0, departmentIndex)
              .filter((other) => other.members.some((entry) => entry.slug === slug))
              .map((other) => other.code)

          return (
            <section className="department-manifest" id={`department-${department.code.toLowerCase()}`} key={department.code}>
              <header className="department-manifest__header">
                <span>05.{departmentIndex + 1} / {department.code}</span>
                <Image alt={`${department.label} badge`} height={92} src={department.badge} width={92} />
                <h3>{department.label}</h3>
                <strong>{String(departmentMembers.length).padStart(2, '0')} CREW</strong>
                {department.record ? <em className="department-manifest__record">{department.record}</em> : null}
              </header>
              <div className="department-manifest__body">
                <div className="department-manifest__members">
                  {departmentMembers.map(({ entry, member }) => (
                    <RosterPerson also={earlierPosts(member.slug)} key={`${department.code}-${member.slug}`} member={member} role={entry.role} showBadge={entry.primary} />
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </section>

      {additionalMembers.length > 0 ? <section className="additional-crew" aria-labelledby="additional-crew-heading">
        <h2 id="additional-crew-heading">More of the crew</h2>
        <div className="department-manifest__members">
          {additionalMembers.map((member) => <RosterPerson key={member.slug} member={member} role={member.position} showBadge />)}
        </div>
      </section> : null}

      {alumni.length > 0 ? <section className="additional-crew alumni-crew" id="alumni" aria-labelledby="alumni-heading">
        <header>
          <span>ARIES ALUMNI</span>
          <h2 id="alumni-heading">Part of every mission that follows.</h2>
          <p>The people who helped build Aries. Explore their contributions, research and the work they leave with the team.</p>
        </header>
        <div className="department-manifest__members">
          {alumni.map((member) => <RosterPerson key={member.slug} member={member} role={`Alumni · ${member.position}`} />)}
        </div>
      </section> : null}

      <section className="collaboration-lab">
        <div className="collaboration-lab__media">
          <Image alt="The crew huddles around the control-station monitor in the pit tent, the table draped in the Thuringian and German flags." fill sizes="(max-width: 900px) 100vw, 58vw" src="/media/erc-2026-finals-10-control-station-pit-tent.jpg" />
          <div aria-hidden="true" /><span>ERC 2026 / CONTROL STATION</span>
        </div>
        <div className="collaboration-lab__copy">
          <span>06 / SYSTEMS INTEGRATION</span><h2>Integrated by design.</h2>
          <p>Weekly design reviews align mechanical interfaces, power distribution, communications, autonomous software, scientific payloads and mission operations. Each subsystem is verified against shared requirements before vehicle-level integration.</p>
          <div><span>CAD ↔ FABRICATION</span><span>POWER ↔ CONTROL</span><span>PERCEPTION ↔ MOTION</span><span>SCIENCE ↔ SAMPLING</span></div>
        </div>
      </section>

      <PartnersBand />
      <section className="mission-cta">
        <span>OPEN CALL / ALL SEMESTERS + DISCIPLINES</span><h2>Your name belongs<br />on the next manifest.</h2>
        <p>Code in ROS 2, machine aluminium, design high-current PCBs, run science experiments or build partner relationships—there is a mission role for you.</p>
        <div>
          <MagneticLink className="button button--solid" href="/join">Join the crew</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner with Aries</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
