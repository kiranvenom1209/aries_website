import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { GalleryRail } from '@/components/GalleryRail'
import { MagneticLink } from '@/components/MagneticLink'
import { ProjectHero, ProjectNavigation, ProjectHeading } from '@/components/RoverProject'
import { PageShell } from '@/components/PageShell'
import { PartnersBand } from '@/components/PartnersBand'
import type { GalleryImage } from '@/lib/gallery'
import { breadcrumbJsonLd, pageMetadata, serializeJsonLd } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description:
    'Leap-2 is the second HSM Aries LEAP rover, now in development. Its brief comes from the ERC 2026 scoreboard: mass, autonomous traverse, maintenance and probing.',
  image: '/media/leap-2-concept-v3.jpg',
  imageAlt: 'AI-generated design concept for the larger six-wheel Leap-2 rover',
  path: '/leap-2',
  title: 'Leap-2 — Project 02, LEAP Rovers',
})

const finalsStoryHref =
  '/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow'

/**
 * One row per ERC 2026 scoreboard line that sets the Leap-2 brief. Scores and
 * what happened come from the finals report; the requirement column states
 * what the next rover has to do, not how — no specifications are frozen yet.
 *
 * `position` frames the photo in the 4:3 desktop box, `positionNarrow` in the
 * 16:9 box the row switches to under 820px; both are read by leap-2.css.
 */
const tradeStudies = [
  {
    code: '01',
    task: 'Traverse',
    score: '43',
    max: '/ 340',
    happened:
      'The suspension carried LEAP-One over the rocky slope of the Mars yard. The traverse task, which rewards autonomous navigation across it, closed at 43 points.',
    requirement:
      'Navigate the yard autonomously — designed in from the first frame, not added to a finished platform.',
    photo: {
      alt: 'LEAP-One climbs the rocky slope with its suspension articulating over the stones.',
      position: '50% 38%',
      positionNarrow: '50% 40%',
      src: '/media/erc-2026-finals-17-leap-one-climbs-rocky-slope.jpg',
    },
  },
  {
    code: '02',
    task: 'Maintenance',
    score: '66',
    max: '/ 340',
    happened:
      'On the rain day the arm ran wrapped in protective plastic under an umbrella. The maintenance task scored 66 of 340.',
    requirement:
      'Carry a manipulator that can be serviced in the pit and operated on the panel, rain included.',
    photo: {
      alt: 'On the rain day LEAP-One works the rocky terrain under an umbrella with its arm wrapped in protective plastic.',
      position: '50% 66%',
      positionNarrow: '50% 64%',
      src: '/media/erc-2026-finals-22-rain-day-umbrella.jpg',
    },
  },
  {
    code: '03',
    task: 'Mass',
    score: '−22',
    max: '/ 200',
    happened:
      'The chassis was rebuilt on the pavement before the first run. LEAP-One was over the mass allowance and scored −22 on a line worth up to 200 points — nine teams took the full 200; no other team went negative.',
    requirement: 'Sit under the ERC allowance at the first design review, not after the build.',
    photo: {
      alt: 'A team member fastens the suspension of the bare LEAP-One chassis on the pavement with a hex key set beside it.',
      position: '50% 60%',
      positionNarrow: '50% 60%',
      src: '/media/erc-2026-finals-04-chassis-rebuild-suspension.jpg',
    },
  },
  {
    code: '04',
    task: 'Probing',
    score: '12',
    max: '/ 240',
    happened:
      'The gripper worked the switches on the maintenance panel, but the probing task closed at 12 of 240 — the lowest task score on the sheet.',
    requirement: 'Run a probing workflow that is rehearsed before the field, not improvised in it.',
    photo: {
      alt: 'LEAP-One’s gripper operates the switches on the ERC maintenance panel.',
      position: '50% 40%',
      positionNarrow: '50% 40%',
      src: '/media/erc-2026-finals-21-gripper-on-maintenance-panel.jpg',
    },
  },
]

const fieldRecord: GalleryImage[] = [
  {
    alt: 'LEAP-One reaches its arm toward the ERC maintenance panel beside marker 14.',
    src: '/media/erc-2026-finals-20-maintenance-panel-marker-14.jpg',
  },
  {
    alt: 'Team members crouch beside LEAP-One as it drives onto the sand of the Mars yard for a test run.',
    src: '/media/erc-2026-finals-06-first-sand-test.jpg',
  },
  {
    alt: 'The crew huddles around the control-station monitor in the pit tent during a run.',
    src: '/media/erc-2026-finals-10-control-station-pit-tent.jpg',
  },
  {
    alt: 'LEAP-One crosses the sand and rock of the Mars yard with its arm raised and a marker on its mast.',
    src: '/media/erc-2026-finals-15-leap-one-mars-yard-arm-raised.jpg',
  },
  {
    alt: 'LEAP-One’s rocker-bogie suspension works over the loose rock of the Mars yard.',
    src: '/media/erc-2026-finals-42-suspension-over-the-rocks.jpg',
  },
  {
    alt: 'The rebuild continues on the grass with the tool kit and spare wheels laid out around the chassis.',
    src: '/media/erc-2026-finals-05-chassis-rebuild-wiring.jpg',
  },
]

const breadcrumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'LEAP Rovers', path: '/leap-one' },
  { name: 'Leap-2' },
])

const priorityTitles = [
  'Autonomy from the first frame.',
  'An arm built for our mission.',
  'Strength through geometry.',
  'Rehearse the complete task.',
]
const requirements = [
  'Integrate the carried-forward perception and control hardware with navigation from the start.',
  'Develop our own manipulator, targeting faster motion, lower moving mass and greater task capability than the bought-in arm.',
  'Replace solid aluminium plates with folded galvanised sheets and laser-cut, welded box-section suspension links. Budget mass across the complete rover.',
  'Develop the probing tool and its operating workflow together, then rehearse the complete task before field testing.',
]
const carryForward = [
  [
    'Perception',
    'Multiple Intel RealSense cameras',
    'D435i is recorded in the autonomy stack; front cameras and a wrist camera near the gripper carry the perception approach forward.',
  ],
  [
    'Positional awareness',
    '360° cameras + LiDAR',
    'Planned for Leap-2. Exact models and mounting geometry remain to be selected.',
  ],
  [
    'Motor control',
    'Botwheel BLDC + ODrive S1',
    'The six-wheel drive baseline; larger wheels require drivetrain validation.',
  ],
  ['Compute', 'ASUS ROG NUC 15 + Teensy 4.1', 'Onboard computing and low-level control baseline.'],
  ['Power', 'LiFePO₄ · 25.6 V / 60 Ah', 'LEAP-One’s 2S2P battery architecture.'],
  [
    'Communications',
    'Ubiquiti AirMAX + ExpressLRS',
    'Primary data link and independent backup command path.',
  ],
  [
    'Software',
    'ROS 2 + Mission Control',
    'Perception, navigation, telemetry and operator workflows.',
  ],
]
export default function LeapTwoPage() {
  return (
    <PageShell>
      <div className="rover-project rover-project--two">
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
          type="application/ld+json"
        />
        <ProjectHero
          project="two"
          title="Leap-2."
          tagline="Built smarter. Going bigger."
          summary="Folded sheet metal. Larger printed wheels. Our own robotic arm. The next LEAP rover takes a different approach to building a capable exploration platform."
          image="/media/leap-2-concept-v3.jpg"
          imageAlt="Leap-2 concept with folded sheet-metal chassis, custom arm and large airless TPU wheels"
          caption="Leap-2 / AI-GENERATED CONCEPT / DESIGN NOT FROZEN"
        >
          <a className="button button--solid" href="#concept">
            Explore the concept
          </a>
          <a className="button button--outline" href="#roadmap">
            The design brief ↗
          </a>
        </ProjectHero>
        <ProjectNavigation
          current="two"
          sections={[
            { href: '#concept', label: 'The concept' },
            { href: '#roadmap', label: 'Design brief' },
            { href: '#inheritance', label: 'Carried forward' },
            { href: '#field-record', label: 'Field evidence' },
          ]}
        />
        <section className="project-section" id="concept">
          <ProjectHeading label="01 / CONCEPT STUDY" title="More rover." accent="Less dead weight.">
            <p>
              A larger exploration platform with a lighter structural approach. Folded sheet metal,
              custom TPU wheels and an in-house manipulator form the next chapter of the LEAP
              programme.
            </p>
          </ProjectHeading>
          <div className="project-mission-identity">
            <Image
              src="/media/leap-2-mission-badge.png"
              alt="Leap-2 mission badge supplied by HSM Aries"
              width={160}
              height={160}
            />
            <div>
              <p className="project-kicker">HSM ARIES / PROJECT 02</p>
              <h3>
                A new mission.
                <br />
                The same Aries spirit.
              </h3>
            </div>
          </div>
          <div className="project-concept-image">
            <Image
              src="/media/leap-2-concept-v3.jpg"
              alt="Full Leap-2 visual concept showing folded panels, welded box-section links, custom manipulator and printed TPU wheels"
              fill
              sizes="100vw"
            />
            <span>DESIGN EXPLORATION / 01</span>
          </div>
          <div className="project-facts">
            <div>
              <strong>~3×</strong>
              <span>Overall volume · approximate design target</span>
            </div>
            <div>
              <strong>2.5×</strong>
              <span>LEAP-One wheel diameter · design target</span>
            </div>
            <div>
              <strong>6</strong>
              <span>Custom TPU wheels · rocker-bogie layout</span>
            </div>
            <div>
              <strong>In-house</strong>
              <span>Custom manipulator development</span>
            </div>
          </div>
          <p className="project-concept-note">Concept visualisation · Leap-2 is in development.</p>
          <div className="project-accordions">
            <details open>
              <summary>
                <span>01</span>Fold it. Weld it. Make it lighter.<b aria-hidden="true">+</b>
              </summary>
              <p>
                Folded galvanised sheet panels form the chassis. Laser-cut metal sheets are welded
                into hollow box sections for the suspension arms. The aim is rigidity through
                section geometry with less structural mass.
              </p>
            </details>
            <details>
              <summary>
                <span>02</span>Our wheels, scaled up.<b aria-hidden="true">+</b>
              </summary>
              <p>
                In-house 3D-printed TPU wheels continue from LEAP-One. The new diameter target is
                2.5 times larger, with an airless structure. Tread, lattice, hub interfaces and
                drive loads are part of the development work.
              </p>
            </details>
            <details>
              <summary>
                <span>03</span>A custom arm from the ground up.<b aria-hidden="true">+</b>
              </summary>
              <p>
                Leap-2 replaces the bought-in Igus arm with a team-designed manipulator. Faster
                movement, lower moving mass and greater task capability are the goals. Link
                materials, actuators, payload and speed are under development.
              </p>
            </details>
            <details>
              <summary>
                <span>04</span>See the terrain. See the task.<b aria-hidden="true">+</b>
              </summary>
              <p>
                LEAP-One uses multiple front RealSense cameras, a RealSense near the gripper and a
                Logitech mast camera. Leap-2 builds on that distributed view with 360° cameras and
                LiDAR for greater positional awareness. Exact new sensor models and installation
                positions are still being developed.
              </p>
            </details>
          </div>
        </section>
        <section className="project-section" id="roadmap">
          <ProjectHeading
            label="02 / DESIGN BRIEF"
            title="Four priorities."
            accent="One better platform."
          >
            <p>
              The hardware direction answers real field experience. LEAP-One’s results show where
              the next platform needs to improve.
            </p>
          </ProjectHeading>
          <ol className="project-priorities">
            {tradeStudies.map((row, index) => (
              <li key={row.code}>
                <div className="project-priorities__index">
                  <span>{row.code}</span>
                  <div>
                    <h3>{row.task}</h3>
                    <p>
                      LEAP-One: {row.score} {row.max}
                    </p>
                  </div>
                </div>
                <div className="project-priorities__image">
                  <Image
                    fill
                    sizes="(max-width: 760px) 100vw, 25vw"
                    src={row.photo.src}
                    alt={row.photo.alt}
                    style={{ objectPosition: row.photo.position }}
                  />
                </div>
                <div>
                  <h4>{priorityTitles[index]}</h4>
                  <p>{requirements[index]}</p>
                  <details className="project-evidence">
                    <summary>What happened at ERC</summary>
                    <p>{row.happened}</p>
                  </details>
                </div>
              </li>
            ))}
          </ol>
          <p className="project-muted">Photographs show LEAP-One at ERC 2026.</p>
        </section>
        <section className="project-section" id="inheritance">
          <ProjectHeading
            label="03 / CARRIED FORWARD"
            title="Real hardware."
            accent="A familiar foundation."
          >
            <p>
              Most of LEAP-One’s components form the starting point for Leap-2. These are the
              documented baseline parts; integration into the new platform remains under review.
            </p>
          </ProjectHeading>
          <div className="project-accordions">
            <details open>
              <summary>
                LEAP-One component baseline<b aria-hidden="true">+</b>
              </summary>
              <dl>
                {carryForward.map(([label, part, note]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      <strong>{part}</strong>
                      <br />
                      {note}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          </div>
          <div className="project-inheritance">
            <div className="project-inheritance__image">
              <Image
                fill
                sizes="(max-width: 760px) 100vw, 60vw"
                src="/media/mission-control-dashboard.png"
                alt="LEAP-One Mission Control telemetry and operations dashboard"
              />
            </div>
            <div>
              <p className="project-kicker">OPERATIONS SOFTWARE</p>
              <h3>
                One crew.
                <br />
                One Mission Control.
              </h3>
              <p>
                Mapping, telemetry, cameras and subsystem control share the operator environment
                used at the finals.
              </p>
              <Link className="text-link" href="/leap-one#operations">
                Explore Mission Control →
              </Link>
              <dl className="project-proof">
                <div>
                  <dt>Documentation</dt>
                  <dd>364.25 / 400 · 4th</dd>
                </div>
                <div>
                  <dt>Navigation droning</dt>
                  <dd>265 / 300 · 6th</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        <section className="project-section project-field" id="field-record">
          <ProjectHeading label="04 / THE STARTING POINT" title="Lessons from the field.">
            <Link className="text-link" href={finalsStoryHref}>
              Read the finals report →
            </Link>
          </ProjectHeading>
          <GalleryRail images={fieldRecord} />
        </section>
        <section className="project-section project-next">
          <p className="project-kicker">DESIGN PHASE / JOIN THE BUILD</p>
          <h2>
            The next leap
            <br />
            <em>needs your ideas.</em>
          </h2>
          <p>
            Eight departments. One shared platform. Help turn the design brief into the next LEAP
            rover.
          </p>
          <div className="project-actions">
            <MagneticLink className="button button--solid" href="/join">
              Join the crew
            </MagneticLink>
            <MagneticLink className="button button--outline" href="/partner">
              Partner with Aries
            </MagneticLink>
          </div>
        </section>
        <PartnersBand />
      </div>
    </PageShell>
  )
}
