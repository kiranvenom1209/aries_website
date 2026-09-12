import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { MagneticLink } from '@/components/MagneticLink'
import { MissionControlShowcase } from '@/components/MissionControlShowcase'
import { MissionSystems } from '@/components/MissionSystems'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import { ProjectHero, ProjectNavigation, ProjectHeading } from '@/components/RoverProject'
import { RoverViewer } from '@/components/RoverViewer'
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description:
    'LEAP-One is Project 01 of the HSM Aries LEAP series: the rover that competed at the ERC 2026 finals in Kraków. Result, vehicle dossier and the road to Leap-2.',
  image: '/media/og/leap-one.jpg',
  imageAlt: 'LEAP-One reaches out with its arm on the Mars yard at the ERC 2026 finals',
  path: '/leap-one',
  title: 'LEAP-One — Project 01, LEAP Rovers',
})

const finalsStoryHref =
  '/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow'

const specGroups = [
  {
    code: '01',
    description: 'Load-bearing structure, terrain handling and motive force.',
    title: 'Mobility & structure',
    items: [
      { label: 'Chassis material', value: 'Aluminium 3.3535 (5754)' },
      { label: 'Suspension type', value: '6-Wheel Rocker-Bogie with Differential' },
      { label: 'Ground clearance', value: '180 mm nominal' },
      { label: 'Gradeability', value: '35° incline traverse · design target' },
      { label: 'Drivetrain', value: '6× Botwheel BLDC + ODrive S1' },
      { label: 'Wheel architecture', value: 'Custom 3D-Printed TPU Wheels' },
    ],
  },
  {
    code: '02',
    description: 'Energy storage, endurance and the compute core behind the mission.',
    title: 'Power & compute',
    items: [
      { label: 'Battery architecture', value: '4× 12.8 V, 30 Ah LiFePO₄ in 2S2P' },
      { label: 'Stored energy', value: '25.6 V · 60 Ah · ≈1.5 kWh' },
      { label: 'Estimated autonomy', value: '≈1 h 21 min at design load' },
      { label: 'Primary compute', value: 'ROG NUC 15 + Teensy 4.1' },
    ],
  },
  {
    code: '03',
    description: 'Autonomy, science instrumentation and mission communication links.',
    title: 'Mission systems',
    items: [
      { label: 'Autonomy framework', value: 'ROS 2 on Ubuntu 24.04 · EKF + DWA' },
      {
        label: 'Depth cameras',
        value: 'Multiple front RealSense cameras + wrist camera near gripper',
      },
      { label: 'Mast camera', value: 'Logitech camera' },
      { label: 'Manipulation system', value: 'Igus ReBeL 6-DoF · 2 kg payload' },
      { label: 'Sampling drill', value: '530 mm coaxial auger · ≥300 mm depth' },
      { label: 'Primary data link', value: '5 GHz AirMAX TDMA · 400 m verified' },
      { label: 'Backup link', value: '2.4 GHz ExpressLRS' },
    ],
  },
]

const breadcrumbs = breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'LEAP-One' }])

const results = [
  ['Documentation', '364.25 / 400'],
  ['Navigation droning', '265 / 300'],
  ['Presentation', '229 / 300'],
  ['AstroBio', '215 / 300'],
  ['Surface & deep sampling', '197 / 440'],
  ['Exploration', '123 / 340'],
  ['Traverse', '43 / 340'],
  ['Maintenance', '66 / 340'],
  ['Probing', '12 / 240'],
  ['Mass', '−22 / 200'],
]
export default function LeapOnePage() {
  return (
    <PageShell>
      <div className="rover-project rover-project--one">
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
          type="application/ld+json"
        />
        <ProjectHero
          project="one"
          title="LEAP-One."
          tagline="Built to explore."
          summary="Our first planetary rover. Designed and built in Schmalkalden, put to the test at the European Rover Challenge in Kraków."
          image="/media/erc-2026-finals-hero-leap-one.jpg"
          imageAlt="LEAP-One on the rocky ERC Mars yard with its robotic arm extended"
          caption="KRAKÓW, POLAND / ERC 2026 / FIELD PHOTOGRAPH"
        >
          <a className="button button--solid" href="#vehicle">
            Explore the vehicle
          </a>
          <a className="button button--outline" href="#results">
            ERC 2026 results ↗
          </a>
        </ProjectHero>
        <ProjectNavigation
          current="one"
          sections={[
            { href: '#vehicle', label: 'The vehicle' },
            { href: '#engineering', label: 'Engineering' },
            { href: '#operations', label: 'Mission Control' },
            { href: '#results', label: 'Field results' },
          ]}
        />
        <section className="project-section" id="vehicle">
          <ProjectHeading label="01 / THE VEHICLE" title="Six wheels." accent="One first leap.">
            <p>
              A six-wheel rocker-bogie platform brings mobility, manipulation and science together.
              Explore the rover and the systems that took it into the field.
            </p>
          </ProjectHeading>
          <div className="project-facts">
            <div>
              <strong>6</strong>
              <span>Driven wheels</span>
            </div>
            <div>
              <strong>
                180 <small>mm</small>
              </strong>
              <span>Nominal ground clearance</span>
            </div>
            <div>
              <strong>
                6 <small>DoF</small>
              </strong>
              <span>Igus ReBeL robotic arm</span>
            </div>
            <div>
              <strong>
                1.5 <small>kWh</small>
              </strong>
              <span>Approx. stored energy</span>
            </div>
          </div>
        </section>
        <RoverViewer />
        <section className="project-section project-systems">
          <ProjectHeading label="INSIDE LEAP-ONE" title="Four mission systems." />
          <MissionSystems />
        </section>
        <section className="project-section project-engineering" id="engineering">
          <div>
            <ProjectHeading label="02 / ENGINEERING" title="The vehicle," accent="in detail." />
            <p className="project-muted">
              The ERC 2026 configuration. Estimates and design targets are marked; estimated system
              mass is 74.8 kg.
            </p>
            <Image
              className="project-badge"
              alt="LEAP-One mission badge"
              src="/media/leapone.png"
              width={110}
              height={110}
            />
          </div>
          <div className="project-accordions">
            {specGroups.map((group, index) => (
              <details key={group.code} open={index === 0}>
                <summary>
                  <span>{group.code}</span>
                  {group.title}
                  <b aria-hidden="true">+</b>
                </summary>
                <p>{group.description}</p>
                <dl>
                  {group.items.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
          </div>
        </section>
        <section className="project-hardware project-section" aria-label="Hardware development">
          {[
            {
              image: '/media/erc-2026-finals-07-wheels-in-the-sand.jpg',
              title: 'Traction, made in-house.',
              text: 'Custom 3D-printed TPU tyres and a passive rocker-bogie differential keep the six driven wheels working over uneven ground.',
            },
            {
              image: '/media/testing.jpg',
              title: 'Power that stays connected.',
              text: 'Four LiFePO₄ modules form the 25.6 V bus. The E-Stop isolates mobility while retaining compute and communications for diagnostics.',
            },
            {
              image: '/media/boehm-manufacturing-scaled.jpg',
              title: 'Strong as a tank.',
              text: 'Boehm Group manufactured the solid 5754 aluminium plate structure. It was robust, but heavy — the lesson behind Leap-2’s folded sheet-metal approach.',
            },
          ].map((item) => (
            <article key={item.title}>
              <div className="project-hardware__image">
                <Image
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  src={item.image}
                  alt={item.title}
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
        <div id="operations">
          <MissionControlShowcase />
        </div>
        <section className="project-section project-results" id="results">
          <ProjectHeading
            label="03 / FIELD RECORD — ERC 2026"
            title="Built in Schmalkalden."
            accent="Tested in Kraków."
          >
            <p>
              124 teams registered worldwide; 25 qualified for the finals. We took 17th place on our
              first attempt, without major sponsorship. Our partners and crew made that possible.
              This is just the beginning: the experience is already shaping Leap-2.
            </p>
          </ProjectHeading>
          <div className="project-facts">
            <div>
              <strong>
                17 <small>/ 124</small>
              </strong>
              <span>Place / registered teams · 25 finalists</span>
            </div>
            <div>
              <strong>1492.25</strong>
              <span>Overall points / 3000</span>
            </div>
            <div>
              <strong>
                4<small>th</small>
              </strong>
              <span>Documentation</span>
            </div>
            <div>
              <strong>
                6<small>th</small>
              </strong>
              <span>Navigation droning</span>
            </div>
          </div>
          <div className="project-accordions">
            <details>
              <summary>
                Full task breakdown<b aria-hidden="true">+</b>
              </summary>
              <dl>
                {results.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </div>
          <Link className="text-link" href={finalsStoryHref}>
            Read the finals report →
          </Link>
        </section>
        <section className="project-next project-section" id="roadmap">
          <p className="project-kicker">NEXT / PROJECT 02</p>
          <h2>
            Every first leap
            <br />
            <em>starts the next.</em>
          </h2>
          <p>The lessons from LEAP-One become the brief for a larger, more capable platform.</p>
          <MagneticLink className="button button--solid" href="/leap-2">
            Meet Leap-2 →
          </MagneticLink>
        </section>
        <PartnersBand />
      </div>
    </PageShell>
  )
}
