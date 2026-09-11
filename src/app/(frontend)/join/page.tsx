import Image from 'next/image'
import type { Metadata } from 'next'

import { CustomSelect } from '@/components/CustomSelect'
import { NetlifyForm } from '@/components/NetlifyForm'
import { PageShell } from '@/components/PageShell'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  description: 'Join HSM Aries at Hochschule Schmalkalden and build Leap-2: eight student departments across mechanical, electrical, software, autonomy, drone and science.',
  image: '/media/og/join.jpg',
  imageAlt: 'Students repair the wiring on LEAP-One in the field at the ERC 2026 finals',
  path: '/join',
  title: 'Join the crew',
})

const crewPath = [
  ['01', 'Find your department', 'Choose one of eight departments, from drivetrain and electronics to autonomy, payload and outreach.'],
  ['02', 'Build with the crew', 'Turn ideas into hardware and software in the workshop with a multidisciplinary team.'],
  ['03', 'Prove it in the field', 'Test, iterate and take the rover into a live European Rover Challenge campaign.'],
]

export default function JoinPage() {
  return (
    <PageShell>
      <section className="conversion-hero conversion-hero--join">
        <Image alt="HSM Aries crew working together during an outreach event" fill priority sizes="100vw" src="/media/space-night-team.jpg" />
        <div className="conversion-hero__veil" />
        <div className="conversion-hero__scan" />
        <div className="conversion-hero__content">
          <span className="hero__eyebrow">Student recruitment // HSM Aries</span>
          <p className="conversion-hero__kicker">Not a spectator sport.</p>
          <h1>Bring the curiosity.<br /><em>Build the rover.</em></h1>
          <p className="conversion-hero__summary">HSM Aries is for students who want to make space robotics real — in CAD, code, the workshop and the field.</p>
          <div className="conversion-hero__metrics" aria-label="Crew recruitment facts">
            <span><strong>08</strong>departments</span>
            <span><strong>17/25</strong>ERC 2026 finals</span>
            <span><strong>Leap-2</strong>in development</span>
          </div>
        </div>
      </section>

      <section className="conversion-desk conversion-desk--join" aria-labelledby="join-path-title">
        <div className="conversion-desk__intro">
          <span className="hero__eyebrow">Recruitment // onboarding</span>
          <h2 id="join-path-title">Your route to<br /><em>the rover.</em></h2>
          <p>At HSM Aries, you will design, machine, program and field-test planetary rovers competing at the European Rover Challenge.</p>
          <dl className="conversion-facts">
            <div>
              <dt>Who can join</dt>
              <dd>Students of Hochschule Schmalkalden and partner universities across all semesters and faculties.</dd>
            </div>
            <div>
              <dt>Next rover</dt>
              <dd>Leap-2 · Project 02 of the LEAP series, in development</dd>
            </div>
          </dl>
        </div>

        <div className="conversion-track-list" aria-label="Crew onboarding path">
          {crewPath.map(([number, title, description]) => (
            <article key={number} className="conversion-track">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="conversion-form-section conversion-form-section--join" aria-labelledby="join-form-title">
        <header className="conversion-form-section__header">
          <span className="hero__eyebrow">Crew intake // Project 02</span>
          <h2 id="join-form-title">Apply to<br /><em>the crew.</em></h2>
          <p>There is no perfect CV for a rover team. Tell us what interests you, what you have tried and where you want to learn.</p>
          <div className="conversion-form-section__location">
            <span>Address</span>
            <strong>Robotics lab, Hochschule Schmalkalden</strong>
            <p>Blechhammer 9, 98574 Schmalkalden, Germany</p>
          </div>
        </header>

        <NetlifyForm className="contact-form conversion-form" name="join-aries" submitLabel="Send application" successContext="join">
          <div>
            <label htmlFor="join-first-name">First name</label>
            <input autoComplete="given-name" id="join-first-name" name="first-name" required />
          </div>
          <div>
            <label htmlFor="join-surname">Surname</label>
            <input autoComplete="family-name" id="join-surname" name="surname" required />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="join-email">Student / personal email</label>
            <input autoComplete="email" id="join-email" name="email" required type="email" />
          </div>
          <div>
            <label htmlFor="join-faculty">Study programme / degree</label>
            <input id="join-faculty" name="study-program" placeholder="e.g. Mechanical Eng, CS, Electrical" required />
          </div>
          <div>
            <label htmlFor="join-semester">Current semester</label>
            <input id="join-semester" name="semester" placeholder="e.g. 3rd semester B.Eng" required />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="join-division" id="join-division-label">Primary department preference</label>
            <CustomSelect
              id="join-division"
              name="division-preference"
              options={[
                { label: 'Mechanical & Drivetrain', value: 'Mechanical & Drivetrain', detail: 'Chassis, 6-wheel suspension, CAD / FEA and 3D print' },
                { label: 'Electrical & Power Systems', value: 'Electrical & Power Systems', detail: 'Custom PCBs, motor drives and power distribution' },
                { label: 'Software & Autonomy', value: 'Software & Autonomy', detail: 'ROS 2, RealSense perception, EKF and path planning' },
                { label: 'Communications & RF', value: 'Communications & RF', detail: 'AirMAX TDMA, ELRS backup and base station dashboard' },
                { label: 'Drill & Manipulator', value: 'Drill & Manipulator', detail: '6-DoF inverse kinematics and sampling auger' },
                { label: 'Astroflight (AQUILA UAV)', value: 'Astroflight (AQUILA UAV)', detail: 'Reconnaissance UAV, orthomosaic mapping and rover-drone telemetry' },
                { label: 'Scientific Payload', value: 'Science & Astrobiology', detail: 'Spectroscopy, chemical assays and life detection' },
                { label: 'Mission Resources & Outreach', value: 'Media, Sponsorship & Ops', detail: 'Logistics, video, partner relations and outreach' },
              ]}
              placeholder="Select a department"
              required
            />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="join-motivation">Technical background &amp; motivation</label>
            <textarea id="join-motivation" name="motivation" placeholder="Tell us about your interests, previous projects, software or hardware tools you use, or why you want to build rovers." required rows={5} />
          </div>
        </NetlifyForm>
      </section>
    </PageShell>
  )
}
