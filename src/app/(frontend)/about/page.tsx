import type { Metadata } from 'next'
import Image from 'next/image'

import { DepartmentsGrid } from '@/components/DepartmentsGrid'
import { MagneticLink } from '@/components/MagneticLink'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import { getTeam } from '@/lib/team'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description: 'HSM Aries is the space robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden.',
  title: 'About HSM Aries',
}

const principles = [
  {
    code: 'NO / 01',
    title: 'We stop at nothing',
    copy: 'From late-night debugging in university labs to extreme outdoor obstacle clearance, our engineers push through every barrier.',
  },
  {
    code: 'NO / 02',
    title: 'We take it step by step',
    copy: 'Iterative mechanical CAD, finite-element analysis, firmware bench validation and multi-terrain field trials make the hardware mission-ready.',
  },
  {
    code: 'NO / 03',
    title: 'We keep it simple',
    copy: 'Elegant, modular architecture wins in harsh environments. Swappable payloads and robust linkages outlast unnecessary complexity.',
  },
  {
    code: 'NO / 04',
    title: 'Hard work. Shared purpose.',
    copy: 'Undergraduate and postgraduate specialists turn classroom theory into a rover that competes on the international stage.',
  },
]

const buildLoop = [
  ['01', 'Discover', 'Start with the mission, terrain and science objective.'],
  ['02', 'Design', 'Model every interface across mechanical, electrical and software teams.'],
  ['03', 'Build', 'Machine, print, wire and integrate in the Schmalkalden lab.'],
  ['04', 'Prove', 'Test in the field, learn from failure and return stronger.'],
]

export default async function AboutPage() {
  const team = await getTeam()
  const leadership = team.filter((member) => member.rank === 'Commander' || member.rank === 'Captain').slice(0, 8)
  const mentors = team.filter((member) => member.discipline === 'mentors')

  return (
    <PageShell>
      <section className="mission-hero">
        <Image
          alt="HSM Aries team with LEAP-One and AQUILA at Space Night"
          fill
          priority
          sizes="100vw"
          src="/media/space-night-rover.jpg"
        />
        <div aria-hidden="true" className="mission-hero__shade" />
        <div aria-hidden="true" className="mission-hero__orbit" />
        <div className="mission-hero__copy">
          <span>HSM ARIES / CHAIR OF DRIVE, AUTOMATION, AND ROBOTICS TECHNOLOGIES</span>
          <h1>Twenty-five minds.<br /><em>A growing program.</em></h1>
          <p>
            The space robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden—engineering planetary systems from first sketch to field test.
          </p>
          <div className="mission-hero__actions">
            <MagneticLink className="button button--solid" href="/team">Open crew database</MagneticLink>
            <MagneticLink className="button button--outline" href="#divisions">Explore divisions</MagneticLink>
          </div>
        </div>
        <div className="mission-hero__readout" aria-label="Mission team facts">
          <div><strong>{String(team.length).padStart(2, '0')}</strong><span>Crew + advisors</span></div>
          <div><strong>08</strong><span>Specialist divisions</span></div>
          <div><strong>#01</strong><span>ERC qualification 2026</span></div>
        </div>
      </section>

      <section className="mission-manifesto">
        <div className="mission-manifesto__label">
          <span>01 / THE MISSION</span>
          <i />
        </div>
        <div className="mission-manifesto__copy">
          <h2>We do not wait for the future of exploration. <em>We build it.</em></h2>
          <div>
            <p>
              HSM Aries brings mechanical engineering, electronics, autonomous software, scientific payloads and mission operations into one space robotics initiative.
            </p>
            <p>
              LEAP-One is the first rover project in the LEAP series. It is one way the initiative turns research, collaboration and systems thinking into real hardware.
            </p>
          </div>
        </div>
      </section>

      <section className="culture-grid">
        <div className="culture-grid__media">
          <Image
            alt="HSM Aries engineers collaborating in the robotics laboratory"
            fill
            sizes="(max-width: 900px) 100vw, 52vw"
            src="/media/dsc01422-scaled.jpg"
          />
          <span>LAB FEED / SCHMALKALDEN</span>
        </div>
        <div className="culture-grid__principles">
          <header>
            <span>02 / ENGINEERING CULTURE</span>
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
          <div><span>03 / DIVISION ARCHITECTURE</span><i /></div>
          <h2>Eight disciplines.<br /><em>Zero silos.</em></h2>
          <p>LEAP-One is the first project in the LEAP series. Its eight departments show how HSM Aries integrates a complete rover platform.</p>
        </header>
        <DepartmentsGrid />
      </section>

      <section className="command-crew">
        <header className="section-command section-command--compact">
          <div><span>04 / COMMAND CREW</span><i /></div>
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
                    <Image alt={`${member.rank ?? 'Mission'} badge`} fill sizes="54px" src={member.rankBadge} />
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
          <span>05 / OUR UNIVERSITY HOME</span>
          <h2>Built in<br />Schmalkalden.</h2>
          <p>
            HSM Aries is rooted in the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden, bringing students and disciplines together in a shared robotics lab.
          </p>
          <a href="https://www.hs-schmalkalden.de" rel="noreferrer" target="_blank">Visit Hochschule Schmalkalden ↗</a>
        </div>
      </section>

      <section className="mentor-orbit">
        <header className="section-command">
          <div><span>06 / ADVISORY ORBIT</span><i /></div>
          <h2>Experience around<br /><em>the student mission.</em></h2>
          <p>Academic faculty, university mentors and industry experts help the crew turn ambitious ideas into robust engineering.</p>
        </header>
        <div className="mentor-orbit__grid">
          {mentors.map((mentor, index) => (
            <article key={mentor.slug}>
              <div className="mentor-orbit__portrait">
                <Image alt={mentor.imageAlt} fill sizes="(max-width: 700px) 44vw, 16vw" src={mentor.image} />
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
          <span>07 / INDUSTRY COLLABORATION</span>
          <h2>From CAD to five-axis reality.</h2>
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
        <span>THE NEXT MISSION NEEDS YOUR DISCIPLINE</span>
        <h2>Build something<br />that leaves the classroom.</h2>
        <div>
          <MagneticLink className="button button--solid" href="/join">Join HSM Aries</MagneticLink>
          <MagneticLink className="button button--outline" href="/team">Explore the crew</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
