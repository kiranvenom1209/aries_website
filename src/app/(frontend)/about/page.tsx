import type { Metadata } from 'next'
import Image from 'next/image'

import { DepartmentsGrid } from '@/components/DepartmentsGrid'
import { ArrowIcon } from '@/components/Icons'
import { MagneticLink } from '@/components/MagneticLink'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import { getTeam } from '@/lib/team'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  description: 'HSM Aries is the space robotics initiative at Hochschule Schmalkalden — an ERC 2026 finalist with LEAP-One, now building Leap-2.',
  image: '/media/og/about.jpg',
  imageAlt: 'HSM Aries members in conversation at the Space Night exhibition at Hochschule Schmalkalden',
  path: '/about',
  title: 'About HSM Aries',
})

const programmeRecord = [
  { label: 'Project 01', value: 'LEAP-One', note: 'First rover of the LEAP series.' },
  { label: 'ERC 2026 finals', value: '4–6 Sep', note: 'AGH Kraków, 25 finalist teams.' },
  { label: 'Final result', value: '17/25', note: '1492.25 of 3000 points.' },
  { label: 'Documentation', value: '4th', note: '364.25 of 400 points.' },
  { label: 'Navigation droning', value: '6th', note: '265 of 300 points.' },
]

const principles = [
  {
    code: '01',
    title: 'We write the record as we build',
    copy: 'Documentation placed 4th of 25 at ERC 2026. The design record is kept alongside the hardware and handed from one cohort to the next.',
  },
  {
    code: '02',
    title: 'We iterate in small steps',
    copy: 'CAD, finite-element checks, firmware bench validation and field trials each have to pass before the next stage starts.',
  },
  {
    code: '03',
    title: 'We keep it simple',
    copy: 'Modular architecture survives harsh terrain. Swappable payloads and robust linkages outlast clever complexity.',
  },
  {
    code: '04',
    title: 'One team across eight departments',
    copy: 'Undergraduate and postgraduate students from mechanical, electrical, software and science backgrounds share one lab, one rover and one deadline.',
  },
]

const buildLoop = [
  ['STEP 01', 'Discover', 'Start with the mission, terrain and science objective.'],
  ['STEP 02', 'Design', 'Model every interface across mechanical, electrical and software teams.'],
  ['STEP 03', 'Build', 'Machine, print, wire and integrate in the Schmalkalden lab.'],
  ['STEP 04', 'Prove', 'Test in the field, learn from failure and return stronger.'],
]

export default async function AboutPage() {
  const team = await getTeam()
  const leadership = team.filter((member) => member.rank === 'Commander' || member.rank === 'Captain').slice(0, 5)
  const mentors = team.filter((member) => member.discipline === 'mentors')

  return (
    <PageShell>
      <section className="mission-hero">
        <Image
          alt="HSM Aries team with LEAP-One and AQUILA at Space Night"
          fill
          preload
          sizes="100vw"
          src="/media/space-night-rover.jpg"
        />
        <div aria-hidden="true" className="mission-hero__shade" />
        <div aria-hidden="true" className="mission-hero__orbit" />
        <div className="mission-hero__copy">
          <span>HSM ARIES / CHAIR OF DRIVE, AUTOMATION, AND ROBOTICS TECHNOLOGIES</span>
          <h1>Built by students.<br /><em>Proven in Kraków.</em></h1>
          <p>
            The space robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden—engineering planetary systems from first sketch to field test.
          </p>
          <div className="mission-hero__actions">
            <MagneticLink className="button button--solid" href="/team">Meet the crew</MagneticLink>
            <MagneticLink className="button button--outline" href="#divisions">Explore departments</MagneticLink>
          </div>
        </div>
        <div className="mission-hero__readout" aria-label="Mission team facts">
          <div><strong>{String(team.length).padStart(2, '0')}</strong><span>Crew + advisors</span></div>
          <div><strong>08</strong><span>Departments</span></div>
          <div><strong>17/25</strong><span>ERC 2026 finals</span></div>
        </div>
      </section>

      <section className="mission-manifesto">
        <div className="mission-manifesto__label">
          <span>01 / THE MISSION</span>
          <i />
        </div>
        <div className="mission-manifesto__copy">
          <h2>One rover has competed.<br /><em>The next is being designed.</em></h2>
          <div>
            <p>
              HSM Aries brings mechanical engineering, electronics, autonomous software, scientific payloads and mission operations into one space robotics initiative.
            </p>
            <p>
              LEAP-One is Project 01 in the LEAP series. It competed at the ERC 2026 finals at AGH in Kraków and finished 17th of 25 with 1492.25 points—4th in documentation, 6th in navigation droning. Leap-2, Project 02, is now being designed around those lessons.
            </p>
          </div>
        </div>
      </section>

      <section className="programme-record" aria-labelledby="programme-record-title">
        <header className="programme-record__header">
          <span id="programme-record-title">02 / PROGRAMME RECORD</span>
          <i />
          <p>LEAP series, from the first rover to the next.</p>
        </header>
        <ol className="programme-record__rail">
          {programmeRecord.map((cell) => (
            <li key={cell.label}>
              <span>{cell.label}</span>
              <strong>{cell.value}</strong>
              <p>{cell.note}</p>
            </li>
          ))}
          <li className="programme-record__next">
            <span>Next rover</span>
            <strong>Leap-2</strong>
            <p>Project 02 · in development</p>
            <MagneticLink className="text-link" href="/leap-2">Explore Leap-2</MagneticLink>
          </li>
        </ol>
      </section>

      <section className="culture-grid">
        <div className="culture-grid__media">
          <Image
            alt="The team around LEAP-One in the seminar room after the first build phase."
            fill
            sizes="(max-width: 900px) 100vw, 92vw"
            src="/media/dsc01422-scaled.jpg"
          />
          <span>SEMINAR ROOM / SCHMALKALDEN</span>
        </div>
        <div className="culture-grid__principles">
          <header>
            <span>03 / ENGINEERING CULTURE</span>
            <h2>How we move<br />from idea to terrain.</h2>
          </header>
          {principles.map((principle) => (
            <article key={principle.code}>
              <span>{principle.code}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="build-loop" aria-label="HSM Aries build process">
        {buildLoop.map(([number, title, copy]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="division-architecture" id="divisions">
        <header className="section-command">
          <div><span>04 / DEPARTMENT ARCHITECTURE</span><i /></div>
          <h2>Eight disciplines.<br /><em>Zero silos.</em></h2>
          <p>Each department owned one subsystem of LEAP-One and now carries that architecture into Leap-2. The cards list what was built, who leads it, and link to the people behind it.</p>
        </header>
        <DepartmentsGrid />
      </section>

      <section className="command-crew">
        <header className="section-command section-command--compact">
          <div><span>05 / COMMAND CREW</span><i /></div>
          <h2>The people coordinating the mission.</h2>
          <MagneticLink className="text-link" href="/team">Meet all team members</MagneticLink>
        </header>
        <div className="command-crew__rail">
          {leadership.map((member, index) => (
            <article key={member.slug}>
              <div>
                <Image alt={member.imageAlt} fill sizes="(max-width: 700px) 72vw, 25vw" src={member.image} />
                <span>{String(index + 1).padStart(2, '0')}</span>
                {member.rankBadge ? (
                  <div className="command-crew__rank">
                    <Image alt="" fill sizes="54px" src={member.rankBadge} />
                  </div>
                ) : null}
              </div>
              <h3>{member.name}</h3>
              <p>{member.position}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="university-home">
        <div className="university-home__media">
          <Image
            alt="Aerial view of Hochschule Schmalkalden campus"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            src="/media/rover-4-scaled.jpg"
          />
          <span>50.7147° N / 10.4657° E</span>
        </div>
        <div className="university-home__copy">
          <span>06 / OUR UNIVERSITY HOME</span>
          <h2>Built in<br />Schmalkalden.</h2>
          <p>
            HSM Aries is rooted in the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden, bringing students and disciplines together in a shared robotics lab.
          </p>
          <a className="text-link" href="https://www.hs-schmalkalden.de" rel="noreferrer" target="_blank">
            <span>Visit Hochschule Schmalkalden</span>
            <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="mentor-orbit">
        <header className="section-command">
          <div><span>07 / ADVISORY ORBIT</span><i /></div>
          <h2>Experience around<br /><em>the student mission.</em></h2>
          <p>Academic faculty, university mentors and industry experts help the crew turn ambitious ideas into robust engineering.</p>
        </header>
        <div className="mentor-orbit__grid">
          {mentors.map((mentor, index) => (
            <article key={mentor.slug}>
              <div className={`mentor-orbit__portrait mentor-orbit__portrait--${mentor.slug}`}>
                <Image alt={mentor.imageAlt} fill sizes="(max-width: 700px) 44vw, 25vw" src={mentor.image} />
              </div>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{mentor.name}</h3>
              <p>{mentor.position}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="industry-bridge">
        <div className="industry-bridge__copy">
          <span>08 / INDUSTRY COLLABORATION</span>
          <h2>From CAD to five&#8209;axis reality.</h2>
          <p>
            The team works directly with industry leaders such as Boehm Group GmbH, pitching mechanical architecture and learning how rover subsystems move from student design to precision manufacturing.
          </p>
        </div>
        <div className="industry-bridge__media">
          <Image
            alt="HSM Aries pitching the rover architecture to Boehm Group"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            src="/media/pitching-in-boehm-scaled.jpg"
          />
        </div>
      </section>

      <PartnersBand />

      <section className="mission-cta">
        <span>Project 02 needs your discipline</span>
        <h2>Build something<br />that leaves the classroom.</h2>
        <div>
          <MagneticLink className="button button--solid" href="/join">Join the crew</MagneticLink>
          <MagneticLink className="button button--outline" href="/leap-2">Explore Leap-2</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
