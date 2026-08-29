import Image from 'next/image'
import type { Metadata } from 'next'

import { CustomSelect } from '@/components/CustomSelect'
import { PageShell } from '@/components/PageShell'

export const metadata: Metadata = {
  description: 'Apply to join the HSM Aries student space initiative and build planetary rovers for international competitions.',
  title: 'Join the Crew',
}

const crewPath = [
  ['01', 'Find your system', 'Choose a division that fits your curiosity, from autonomy and electronics to science and operations.'],
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
          <div className="conversion-hero__metrics" aria-label="Crew recruitment highlights">
            <span><strong>08</strong>specialist divisions</span>
            <span><strong>01</strong>shared rover mission</span>
            <span><strong>ERC</strong>field-driven learning</span>
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
              <dt>Active campaign</dt>
              <dd>ERC 2026 competition rover development.</dd>
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
          <span className="hero__eyebrow">Crew intake // 2026</span>
          <h2 id="join-form-title">Start with<br /><em>your signal.</em></h2>
          <p>There is no perfect CV for a rover team. Tell us what interests you, what you have tried and where you want to learn.</p>
          <div className="conversion-form-section__location">
            <span>Lab location</span>
            <strong>Robotics workshop &amp; proving grounds</strong>
            <p>Hochschule Schmalkalden<br />Blechhammer 9, 98574 Schmalkalden</p>
          </div>
        </header>

        <form action="mailto:hsmariesleapone@gmail.com?subject=Student%20Application%20-%20HSM%20Aries" className="contact-form conversion-form" encType="text/plain" method="post">
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
            <label htmlFor="join-division">Primary division preference</label>
            <CustomSelect
              defaultValue="Mechanical & Drivetrain"
              id="join-division"
              name="division-preference"
              options={[
                { label: 'Mechanical & Drivetrain', value: 'Mechanical & Drivetrain', detail: 'Chassis, 6-wheel suspension, CAD / FEA and 3D print' },
                { label: 'Electrical & Power Systems', value: 'Electrical & Power Systems', detail: 'Custom PCBs, motor drives and power distribution' },
                { label: 'Software & Autonomy', value: 'Software & Autonomy', detail: 'ROS 2, RealSense perception, EKF and path planning' },
                { label: 'Communications & RF', value: 'Communications & RF', detail: 'AirMAX TDMA, ELRS backup and base station dashboard' },
                { label: 'Drill & Manipulator', value: 'Drill & Manipulator', detail: '6-DoF inverse kinematics and sampling auger' },
                { label: 'Science & Astrobiology', value: 'Science & Astrobiology', detail: 'Spectroscopy, chemical assays and life detection' },
                { label: 'Media, Sponsorship & Ops', value: 'Media, Sponsorship & Ops', detail: 'Logistics, video, partner relations and outreach' },
              ]}
              required
            />
          </div>
          <div className="contact-form__wide">
            <label htmlFor="join-motivation">Technical background &amp; motivation</label>
            <textarea id="join-motivation" name="motivation" placeholder="Tell us about your interests, previous projects, software or hardware tools you use, or why you want to build rovers." required rows={5} />
          </div>
          <button className="button button--solid" type="submit">Submit application <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </PageShell>
  )
}
