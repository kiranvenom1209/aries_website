import type { Metadata } from 'next'
import Image from 'next/image'

import { MagneticLink } from '@/components/MagneticLink'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import type { TeamMember } from '@/lib/team'
import { getTeam } from '@/lib/team'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'Meet the advisors, mentors and student departments building LEAP-One, the first rover project in the HSM Aries LEAP series.',
  image: '/media/space-night-team.jpg',
  path: '/team',
  title: 'The Team & Crew',
})

type DepartmentMember = { primary?: boolean; role: string; slug: string }

const departments: Array<{
  badge: string
  code: string
  label: string
  members: DepartmentMember[]
}> = [
  {
    badge: '/media/l1-mech-crop.png',
    code: 'MECH',
    label: 'Mechanical Department',
    members: [
      { primary: true, role: 'Mechanical Lead', slug: 'brahama-teja-naroju' },
      { role: 'Mechanical Department', slug: 'shreyas-patel' },
      { role: 'Mechanical Department', slug: 'naveen-kumar-shivakumar' },
      { role: 'Mechanical Department', slug: 'rahul-kamatagi' },
    ],
  },
  {
    badge: '/media/l1-electric-crop.png',
    code: 'ELEC',
    label: 'Electrical Department',
    members: [
      { primary: true, role: 'Electrical Lead', slug: 'ayan-akbar-ali' },
      { role: 'Electrical Department', slug: 'mohammad-abdulaziz' },
      { role: 'Electrical Department', slug: 'yash-lohar' },
      { role: 'Electrical Department', slug: 'md-bashar' },
    ],
  },
  {
    badge: '/media/l1-software-crop.png',
    code: 'SOFT',
    label: 'Software & Navigation Department',
    members: [
      { primary: true, role: 'Software Lead', slug: 'omar-abdelrady' },
      { role: 'Software Department', slug: 'vighnesh-madhav-deshmukh' },
      { role: 'Software Department', slug: 'harsha-vardhan-raju-gottimukkala' },
      { role: 'Software Department', slug: 'rahul-khandait' },
      { role: 'Software Department', slug: 'mukul-bimbra' },
      { role: 'Software Department', slug: 'priyam-bhatnagar' },
    ],
  },
  {
    badge: '/media/l1-comm-crop.png',
    code: 'COMM',
    label: 'Communication Department',
    members: [{ primary: true, role: 'Communication Lead', slug: 'vighnesh-madhav-deshmukh' }],
  },
  {
    badge: '/media/l1-drill-arm-crop.png',
    code: 'DRILL',
    label: 'Drill & Manipulator Department',
    members: [
      { primary: true, role: 'Manipulator Lead', slug: 'brahama-teja-naroju' },
      { role: 'Mechanical Department', slug: 'rahul-kamatagi' },
      { role: 'Drill Department', slug: 'danny-sneham' },
      { role: 'Mechanical Department', slug: 'naveen-kumar-shivakumar' },
    ],
  },
  {
    badge: '/media/l1_astro-1.png',
    code: 'ASTRO',
    label: 'Astroflight Department',
    members: [
      { primary: true, role: 'Drone Lead', slug: 'rahul-khandait' },
      { role: 'Drone Department', slug: 'omar-abdelrady' },
    ],
  },
  {
    badge: '/media/l1-science-crop.png',
    code: 'SCI',
    label: 'Scientific Payload Department',
    members: [
      { primary: true, role: 'Scientific Payload Department', slug: 'anantha-pathmanabhan' },
      { role: 'Scientific Payload Department Lead', slug: 'harsha-vardhan-raju-gottimukkala' },
      { role: 'Scientific Payload Department', slug: 'ashwin-dinesh-ayinipully' },
    ],
  },
  {
    badge: '/media/l1_mro-1.png',
    code: 'MRO',
    label: 'Mission, Resources & Outreach',
    members: [
      { primary: true, role: 'Mission, Resources & Outreach', slug: 'reeba-biju' },
      { role: 'Mission, Resources & Outreach', slug: 'harsha-vardhan-raju-gottimukkala' },
    ],
  },
]

function PrincipalAdvisor({ member, index }: { index: number; member: TeamMember }) {
  return (
    <article className="principal-advisor">
      <div className="principal-advisor__portrait" itemScope itemType="https://schema.org/ImageObject">
        <Image alt={member.imageAlt} fill sizes="(max-width: 760px) 100vw, 50vw" src={member.image} />
        <meta content={member.image} itemProp="contentUrl" />
        {member.imageCredit ? <meta content={member.imageCredit} itemProp="creditText" /> : null}
        {member.imageCreditUrl ? <link href={member.imageCreditUrl} itemProp="acquireLicensePage" /> : null}
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="principal-advisor__copy">
        <small>PRINCIPAL ADVISOR / {String(index + 1).padStart(2, '0')}</small>
        <h3>{member.name}</h3>
        <strong>{member.position}</strong>
        <p>{member.bio}</p>
      </div>
    </article>
  )
}

function RosterPerson({ member, role, showBadge = false }: { member: TeamMember; role: string; showBadge?: boolean }) {
  return (
    <article className={`roster-person roster-person--${member.slug}`}>
      <div className="roster-person__portrait">
        <Image alt={`${member.name} — ${role}`} fill sizes="(max-width: 600px) 100vw, 25vw" src={member.image} />
        {showBadge && member.rankBadge ? (
          <Image
            alt={`${member.rank ?? 'Leadership'} badge`}
            className="roster-person__rank"
            height={97}
            src={member.rankBadge}
            width={58}
          />
        ) : null}
      </div>
      <div className="roster-person__copy">
        <h4>{member.name}</h4>
        <p>{role}</p>
      </div>
    </article>
  )
}

export default async function TeamPage() {
  const members = await getTeam()
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
  const studentCount = members.filter((member) => member.discipline !== 'mentors').length

  return (
    <PageShell>
      <section className="crew-hero">
        <Image alt="HSM Aries mission crew at Space Night" fill priority sizes="100vw" src="/media/space-night-team.jpg" />
        <div aria-hidden="true" className="crew-hero__shade" />
        <div className="crew-hero__copy">
          <span>PERSONNEL / HSM ARIES</span>
          <h1>HSM Aries has<br /><em>no passengers.</em></h1>
          <p>Every contributor shapes the initiative through research, systems engineering and hands-on projects. The current crew is building LEAP-One, the first rover in the LEAP series.</p>
        </div>
        <div className="crew-hero__ticker" aria-label="Crew summary">
          <span>CREW MANIFEST</span>
          <strong>{String(studentCount).padStart(2, '0')} STUDENT ENGINEERS</strong>
          <i /><strong>02 PRINCIPAL ADVISORS</strong><i /><strong>05 MENTORS</strong><i /><strong>08 MISSION DIVISIONS</strong>
        </div>
      </section>

      <section className="crew-intro">
        <span>01 / GUIDANCE</span>
        <h2>One organization.<br />Clear technical ownership.</h2>
          <p>The structure is presented as it operates: principal advisors, a dedicated mentor council, program command, and every LEAP-One department with its complete membership.</p>
      </section>

      <section className="roster-guidance">
        <header className="section-command">
          <div><span>01A / PRINCIPAL ADVISORS</span><h2>The two people<br />guiding the program.</h2></div>
          <p>Academic and industry leadership at the highest level of the HSM Aries organization.</p>
        </header>
        <div className="principal-advisors">
          {principalAdvisors.map((member, index) => <PrincipalAdvisor index={index} key={member.slug} member={member} />)}
        </div>
      </section>

      <section className="mentor-council">
        <header><span>01B / MENTOR COUNCIL</span><h2>Specialist guidance<br />across the program.</h2></header>
        <div className="mentor-council__grid">
          {mentors.map((member, index) => (
            <article className="mentor-profile" key={member.slug}>
              <div>
                <Image alt={member.imageAlt} fill sizes="(max-width: 600px) 50vw, 20vw" src={member.image} />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{member.name}</h3>
              <p>{member.position}</p>
            </article>
          ))}
        </div>
      </section>

      {commander ? (
        <section className="mission-command-profile">
          <div className="mission-command-profile__portrait">
            <Image alt={commander.imageAlt} fill sizes="(max-width: 760px) 100vw, 45vw" src={commander.image} />
            {commander.rankBadge ? <Image alt="Commander badge" className="mission-command-profile__rank" height={135} src={commander.rankBadge} width={86} /> : null}
          </div>
          <div className="mission-command-profile__copy">
            <span>02 / PROJECT COMMAND</span><small>LEAP-ONE PROJECT COMMANDER</small>
            <h2>{commander.name}</h2><strong>{commander.position}</strong><p>{commander.bio}</p>
          </div>
        </section>
      ) : null}

      <section className="department-manifests">
        <header className="section-command">
          <div><span>03 / LEAP-ONE / PROJECT 01</span><h2>Eight teams.<br />One integrated rover.</h2></div>
          <p>Members appear in every department they serve. Rank insignia is shown only at the person’s primary command post, never on a repeated secondary assignment.</p>
        </header>

        {departments.map((department, departmentIndex) => {
          const departmentMembers = department.members
            .map((entry) => ({ entry, member: bySlug.get(entry.slug) }))
            .filter((item): item is { entry: DepartmentMember; member: TeamMember } => Boolean(item.member))

          return (
            <section className="department-manifest" id={`department-${department.code.toLowerCase()}`} key={department.code}>
              <header className="department-manifest__header">
                <span>{String(departmentIndex + 1).padStart(2, '0')} / {department.code}</span>
                <Image alt={`${department.label} badge`} height={92} src={department.badge} width={92} />
                <h3>{department.label}</h3>
                <strong>{String(departmentMembers.length).padStart(2, '0')} CREW</strong>
              </header>
              <div className="department-manifest__members">
                {departmentMembers.map(({ entry, member }) => (
                  <RosterPerson key={`${department.code}-${member.slug}`} member={member} role={entry.role} showBadge={entry.primary} />
                ))}
              </div>
            </section>
          )
        })}
      </section>

      <section className="collaboration-lab">
        <div className="collaboration-lab__media">
          <Image alt="HSM Aries engineering team brainstorming in the robotics lab" fill sizes="(max-width: 900px) 100vw, 58vw" src="/media/whatsapp-image-2025-03-26-at-4.01.37-pm-scaled.jpeg" />
          <div aria-hidden="true" /><span>DESIGN REVIEW / ROBOTICS LAB</span>
        </div>
        <div className="collaboration-lab__copy">
          <span>04 / SYSTEMS INTEGRATION</span><h2>Integrated by design.</h2>
          <p>Weekly design reviews align mechanical interfaces, power distribution, communications, autonomous software, scientific payloads and mission operations. Each subsystem is verified against shared requirements before vehicle-level integration.</p>
          <div><span>CAD ↔ FABRICATION</span><span>POWER ↔ CONTROL</span><span>PERCEPTION ↔ MOTION</span><span>SCIENCE ↔ SAMPLING</span></div>
        </div>
      </section>

      <PartnersBand />
      <section className="mission-cta">
        <span>OPEN CALL / ALL SEMESTERS + DISCIPLINES</span><h2>Your name belongs<br />on the next manifest.</h2>
        <p>Code in ROS 2, machine aluminum, design high-current PCBs, run science experiments or build partner relationships—there is a mission role for you.</p>
        <div>
          <MagneticLink className="button button--solid" href="/join">Apply to join Aries</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner / Sponsor</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
