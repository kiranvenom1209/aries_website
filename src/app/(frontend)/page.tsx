import Image from 'next/image'
import Link from 'next/link'

import { GalleryRail } from '@/components/GalleryRail'
import { MagneticLink } from '@/components/MagneticLink'
import { MissionControlShowcase } from '@/components/MissionControlShowcase'
import { NewsRows } from '@/components/NewsList'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import { getNews } from '@/lib/news'

const programmes = [
  {
    code: '01',
    description:
      'The LEAP series is our field programme for mobility, manipulation, autonomous navigation and scientific operations.',
    label: 'Fielded now',
    signal: 'LEAP-One / field validation',
    title: 'LEAP Rovers',
  },
  {
    code: '02',
    description:
      'Perception, planning and mission-control tools that move advanced robots safely from a lab bench into the field.',
    label: 'Systems capability',
    signal: 'Shared stack / active development',
    title: 'Autonomy & operations',
  },
  {
    code: '03',
    description:
      'A future programme direction for automation, test infrastructure and precision landing systems that can help teams working in rocketry.',
    label: 'Future direction',
    signal: 'Collaboration horizon',
    title: 'Flight & recovery',
  },
  {
    code: '04',
    description:
      'A future programme direction for compact satellite platforms, payload integration and the ground systems that keep them useful.',
    label: 'Future direction',
    signal: 'Research horizon',
    title: 'CubeSat & orbital systems',
  },
] as const

function ProgrammeGraphic({ code }: { code: (typeof programmes)[number]['code'] }) {
  return (
    <svg aria-hidden="true" className="aries-programme-card__graphic" viewBox="0 0 320 180">
      {code === '01' ? (
        <>
          <path className="programme-line programme-line--muted" d="M28 148h264" />
          <path className="programme-scan" d="M38 45h92" />
          <path className="programme-line" d="M72 105h164l20 23H54l18-23Z" />
          <path className="programme-line" d="M94 104V75h87v30M181 76l25-24 27 18m-27-18-8-12m35 30 17 24" />
          <path className="programme-line" d="M122 75V49h16v26m-19-26h22m-14-7h7m-3 0V29" />
          <g className="programme-rover__far-wheels">
            <circle cx="91" cy="132" r="16" />
            <circle cx="159" cy="132" r="16" />
            <circle cx="227" cy="132" r="16" />
          </g>
          <g className="programme-rover__wheels">
            <circle cx="84" cy="137" r="18" />
            <circle cx="152" cy="137" r="18" />
            <circle cx="220" cy="137" r="18" />
          </g>
          <g className="programme-rover__hubs">
            <circle cx="84" cy="137" r="6" />
            <circle cx="152" cy="137" r="6" />
            <circle cx="220" cy="137" r="6" />
          </g>
          <path className="programme-line programme-line--accent" d="M64 128h184" />
        </>
      ) : null}
      {code === '02' ? (
        <>
          <path className="programme-contour" d="M32 130c31-34 61-13 84-48 20-30 55-20 72 1 26 32 57 8 96 32" />
          <path className="programme-contour" d="M26 148c33-26 63-10 94-37 28-25 55-17 76 2 25 23 52 15 92 27" />
          <path className="programme-route" d="M48 128 94 94l45 20 55-57 78 32" />
          {[['48','128'],['94','94'],['139','114'],['194','57'],['272','89']].map(([x,y]) => <circle className="programme-node" cx={x} cy={y} key={`${x}-${y}`} r="5" />)}
          <circle className="programme-pulse" cx="194" cy="57" r="18" />
        </>
      ) : null}
      {code === '03' ? (
        <>
          <path className="programme-route" d="M41 52c76 1 125 28 158 76" />
          <path className="programme-line" d="m193 73 15-18 15 18v42l-15 13-15-13V73Z" />
          <path className="programme-line programme-line--accent" d="m199 128 9 20 9-20M145 151h126" />
          <path className="programme-line programme-line--muted" d="M164 142h88M177 133h62" />
          <circle className="programme-pulse" cx="208" cy="151" r="22" />
        </>
      ) : null}
      {code === '04' ? (
        <>
          <path className="programme-orbit" d="M28 133C79 42 221 15 292 78" />
          <path className="programme-orbit programme-orbit--secondary" d="M42 154C118 96 233 92 288 119" />
          <g className="programme-cubesat">
            <polygon className="programme-cubesat__panel" points="42,75 132,94 132,127 42,108" />
            <polygon className="programme-cubesat__panel" points="198,94 288,75 288,108 198,127" />
            <path className="programme-cubesat__grid" d="m64 80-1 33m22-28-1 33m23-28-2 33M46 86l82 18m-82-7 82 18m75-11 82-18m-82 29 82-18m-60-12 1 33m22-38 1 33m22-38 1 33" />
            <polygon className="programme-cubesat__top" points="132,72 169,57 198,73 161,90" />
            <polygon className="programme-cubesat__front" points="132,72 161,90 161,137 132,119" />
            <polygon className="programme-cubesat__side" points="161,90 198,73 198,120 161,137" />
            <path className="programme-line programme-line--accent" d="M169 57V37m0 0 10-10m-10 10-10-10" />
            <path className="programme-cubesat__detail" d="m143 84 9 5v19l-9-5Zm28 12 17-8v20l-17 8Zm-29 24 10 6m19-1 17-8" />
          </g>
          <path className="programme-signal-wave" d="M207 41c12 4 20 12 24 24m-19-35c19 6 31 18 37 37" />
          <circle className="programme-node" cx="288" cy="119" r="5" />
        </>
      ) : null}
    </svg>
  )
}

export default async function HomePage() {
  const stories = await getNews(3)

  return (
    <PageShell>
      <section className="aries-home-hero">
        <Image
          alt="HSM Aries LEAP-One Mars Rover exploring Martian terrain"
          className="aries-home-hero__image"
          fill
          priority
          sizes="100vw"
          src="/media/rover-hero-mars-v3.jpg"
        />
        <div aria-hidden="true" className="aries-home-hero__grid" />
        <div aria-hidden="true" className="aries-home-hero__wash" />
        <div className="aries-home-hero__content">
          <p className="aries-home-hero__eyebrow">HSM ARIES / CHAIR OF DRIVE, AUTOMATION, AND ROBOTICS TECHNOLOGIES</p>
          <h1>Build the systems<br /><em>that take us further.</em></h1>
          <p className="aries-home-hero__summary">
            HSM Aries is the space robotics initiative at Hochschule Schmalkalden. We turn student engineering into capable machines for exploration—starting in the field, and building toward what comes next.
          </p>
          <div className="hero__actions">
            <MagneticLink className="button button--solid" href="/about">Explore HSM Aries</MagneticLink>
            <MagneticLink className="button button--outline" href="/leap-one">Meet LEAP Rovers</MagneticLink>
          </div>
        </div>
        <div className="aries-home-hero__mission-card">
          <span>NOW FIELDING</span>
          <strong>LEAP-One</strong>
          <p>The opening rover in the LEAP series.</p>
          <Link href="/leap-one">View project <b aria-hidden="true">↗</b></Link>
        </div>
        <div aria-hidden="true" className="aries-home-hero__signal">
          <i /><span>EXPLORATION SYSTEMS / 01</span>
        </div>
      </section>

      <section className="aries-home-manifesto">
        <div>
          <span className="section-label">THE ARIES PREMISE / 01</span>
          <h2>We began with a rover.<br />We are building a <em>space robotics programme.</em></h2>
        </div>
        <div className="aries-home-manifesto__copy">
          <p>
            Rovers are where mechanics, electronics, autonomy, science payloads and mission operations have to work together under real constraints. LEAP-One is our first proving ground—not the limit of our ambition.
          </p>
          <p>
            HSM Aries is built to become a practical partner for teams and research projects that need capable systems, disciplined engineering and people ready to test ideas beyond the screen.
          </p>
          <Link className="text-link" href="/about">How HSM Aries works <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="aries-home-programmes">
        <header className="aries-home-programmes__header">
          <div>
            <span className="section-label">PROGRAMME MAP / 02</span>
            <h2>One chair.<br />Multiple trajectories.</h2>
          </div>
          <p>
            The first systems are on the ground. The same engineering discipline can support the next generation of student-led space technology.
          </p>
        </header>
        <div className="aries-programme-grid">
          {programmes.map((programme) => (
            <article className="aries-programme-card" key={programme.code}>
              <div className="aries-programme-card__topline">
                <span>{programme.code}</span>
                <small>{programme.label}</small>
              </div>
              <ProgrammeGraphic code={programme.code} />
              <div className="aries-programme-card__copy">
                <h3>{programme.title}</h3>
                <p>{programme.description}</p>
              </div>
              {programme.code === '01' ? <Link href="/leap-one">Explore the LEAP series <span aria-hidden="true">→</span></Link> : <span className="aries-programme-card__status">{programme.signal}</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="aries-home-platform">
        <div className="aries-home-platform__image">
          <Image alt="HSM Aries rover during a field engineering test" fill sizes="(max-width: 820px) 100vw, 50vw" src="/media/dsc01556-scaled.jpg" />
          <span>FIELD TEST / THURINGIA</span>
        </div>
        <div className="aries-home-platform__copy">
          <span className="section-label">HOW WE BUILD / 03</span>
          <h2>A platform for teams who want to make hardware matter.</h2>
          <p>
            HSM Aries connects hands-on design, system integration and field validation. Every discipline learns from the same platform—then carries that capability into the next mission.
          </p>
          <dl>
            <div><dt>01</dt><dd>Mechanical systems<br /><small>chassis, mechanisms, fabrication</small></dd></div>
            <div><dt>02</dt><dd>Embedded &amp; power<br /><small>electronics, energy, communications</small></dd></div>
            <div><dt>03</dt><dd>Autonomy &amp; mission software<br /><small>perception, control, operator tools</small></dd></div>
          </dl>
          <MagneticLink className="button button--outline" href="/team">Meet the engineering crew</MagneticLink>
        </div>
      </section>

      <section className="aries-home-leap-proof">
        <div className="aries-home-leap-proof__content">
          <span className="section-label">PROOF IN THE FIELD / 04</span>
          <p className="aries-home-leap-proof__kicker">LEAP SERIES / PROJECT 01</p>
          <h2>LEAP-One is the first leap—not the whole story.</h2>
          <p>
            A six-wheel research rover that brings mobility, autonomous navigation, precision manipulation and deep-sampling science onto one field-ready platform.
          </p>
          <div className="aries-home-leap-proof__facts">
            <span><b>06</b> independent drive wheels</span>
            <span><b>04</b> integrated mission systems</span>
            <span><b>#01</b> ERC 2026 qualification</span>
          </div>
          <MagneticLink className="button button--solid" href="/leap-one">Enter the LEAP rover dossier</MagneticLink>
        </div>
        <div className="aries-home-leap-proof__image">
          <Image alt="LEAP-One rover on a Mars-like landscape" fill sizes="(max-width: 820px) 100vw, 50vw" src="/media/leap-one-hero-cinematic-v2.png" />
        </div>
      </section>

      <MissionControlShowcase />

      <section className="aries-home-collaboration">
        <div>
          <span className="section-label">NEXT HORIZON / 05</span>
          <h2>From a strong first platform to systems that help others fly.</h2>
        </div>
        <div>
          <p>
            The long view is collaborative: bring the practical lessons from rover development to teams working on rocketry automation, recovery and landing systems, CubeSats, payloads and the ground stations that support them.
          </p>
          <p className="aries-home-collaboration__note">This is the direction of the HSM Aries programme. New mission concepts will be announced as they become real.</p>
          <div className="join-band__actions">
            <MagneticLink className="button button--solid" href="/partner">Build with Aries</MagneticLink>
            <MagneticLink className="button button--outline" href="/contact">Start a conversation</MagneticLink>
          </div>
        </div>
      </section>

      <section className="updates-section aries-home-updates">
        <div className="aries-home-updates__header">
          <div>
            <span className="section-label">MISSION LOG / LATEST</span>
            <h2>What we&apos;re testing,<br />building and learning.</h2>
          </div>
          <Link className="text-link" href="/news">Open mission log <span aria-hidden="true">→</span></Link>
        </div>
        <NewsRows stories={stories} />
      </section>

      <section className="field-gallery aries-home-gallery">
        <div className="aries-home-gallery__header">
          <span className="section-label">FIELD RECORD / 06</span>
          <h2>Engineering proves itself in the field.</h2>
        </div>
        <GalleryRail />
      </section>

      <PartnersBand />

      <section className="join-band aries-home-join">
        <span className="section-label">MAKE THE NEXT LEAP / 07</span>
        <h2>Bring your curiosity.<br /><em>Build the capability.</em></h2>
        <p>Join the crew, partner on a programme or start a mission conversation with HSM Aries.</p>
        <div className="join-band__actions">
          <MagneticLink className="button button--solid" href="/join">Join the team</MagneticLink>
          <MagneticLink className="button button--outline" href="/partner">Partner with Aries</MagneticLink>
        </div>
      </section>
    </PageShell>
  )
}
