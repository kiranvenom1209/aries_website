import Image from 'next/image'
import Link from 'next/link'
import type { TeamMember } from '@/lib/team'

export const departments = [
  {
    id: 'mechanical',
    teamCode: 'mech',
    name: 'Mechanical & Drivetrain',
    leadSlugs: ['brahama-teja-naroju'],
    badge: '/media/l1-mech-crop.png',
    description: 'Aluminium 3.3535 chassis architecture, differential rocker-bogie suspension, and six custom TPU wheels driven by Botwheel BLDC motors and ODrive S1 controllers.',
    specs: ['6WD Independent BLDC', 'Differential Leveling Bar', '35° Gradeability'],
  },
  {
    id: 'drill-manipulator',
    teamCode: 'drill',
    name: 'Drill & Manipulator',
    leadSlugs: ['danny-sneham', 'brahama-teja-naroju'],
    badge: '/media/l1-drill-arm-crop.png',
    description: 'Igus ReBeL 6-DoF manipulation with a modular 3D-printed gripper, paired with a 530 mm coaxial auger system for deep regolith collection.',
    specs: ['2 kg Arm Payload', '≥300 mm Drill Depth', 'Modular End-Effector'],
  },
  {
    id: 'software',
    teamCode: 'soft',
    name: 'Software & Autonomy',
    leadSlugs: ['omar-abdelrady'],
    badge: '/media/l1-software-crop.png',
    description: 'ROS 2 on Ubuntu 24.04 combines RealSense depth sensing, EKF localization, Pure Pursuit path following and Dynamic Window Approach obstacle avoidance.',
    specs: ['ROS 2 + EKF', 'RealSense D435i', 'DWA Obstacle Avoidance'],
  },
  {
    id: 'electrical',
    teamCode: 'elec',
    name: 'Electrical & Power Systems',
    leadSlugs: ['ayan-akbar-ali'],
    badge: '/media/l1-electric-crop.png',
    description: 'A 25.6 V, 60 Ah LiFePO₄ main bus from four 12.8 V modules powers centralized distribution, regulated rails, CAN-connected motor control and the safety system.',
    specs: ['2S2P LiFePO₄ · 1.5 kWh', 'CAN Bus Telemetry', 'SSR E-Stop'],
  },
  {
    id: 'astroflight',
    teamCode: 'astro',
    name: 'Astroflight (AQUILA UAV)',
    leadSlugs: ['rahul-khandait'],
    badge: '/media/aquila-leapone.png',
    description: 'Developed in collaboration with HSM Zenith, HSM’s aeronautical division: an autonomous reconnaissance UAV for aerial orthomosaic mapping, terrain hazard scanning, and cooperative rover-drone telemetry downlinks.',
    specs: ['VTOL / Fixed Wing', '4K Aerial Survey', 'Telemetry Relay'],
  },
  {
    id: 'science',
    teamCode: 'sci',
    name: 'Scientific Payload',
    leadSlugs: ['anantha-pathmanabhan'],
    badge: '/media/l1-science-crop.png',
    description: 'Environmental, gas, pH, turbidity, Raman and microscopy instruments pair with load-cell sample verification and a peristaltic liquid-handling system.',
    specs: ['Raman Spectrometry', 'HX711 Load Cells', 'pH + Gas Analysis'],
  },
  {
    id: 'communication',
    teamCode: 'comm',
    name: 'Communications & RF',
    leadSlugs: ['vighnesh-madhav-deshmukh'],
    badge: '/media/l1-comm-crop.png',
    description: 'The primary Ubiquiti AirMAX TDMA link carries telemetry and 720p video, while 2.4 GHz ExpressLRS provides an independent command and backup path.',
    specs: ['5 GHz AirMAX TDMA', '400 m Verified Link', '2.4 GHz ELRS Backup'],
  },
  {
    id: 'mro',
    teamCode: 'mro',
    name: 'Mission Resources & Outreach',
    leadSlugs: ['reeba-biju'],
    badge: '/media/l1_mro-1.png',
    description: 'Coordinates sponsor relations with industry partners (Boehm Group, SICK), public exhibitions at Space Night, media documentation, and logistics.',
    specs: ['Sponsorships', 'Space Night Exhibitions', 'Operations'],
  },
]

export function DepartmentsGrid({ members }: { members: TeamMember[] }) {
  const bySlug = new Map(members.filter((member) => !member.isAlumni).map((member) => [member.slug, member]))
  return (
    <div className="department-grid">
      {departments.map((dept, index) => (
        <article className="department-card" key={dept.id}>
          <span className="department-card__number">{String(index + 1).padStart(2, '0')}</span>
          <div className="department-card__top">
            <div className="department-card__badge">
              <Image alt="" fill sizes="72px" src={dept.badge} />
            </div>
            <div>
              <p className="department-card__leads">{dept.leadSlugs.filter((slug) => bySlug.has(slug)).map((slug, leadIndex) => (
                <span key={slug}>{leadIndex === 0 ? 'LEAD / ' : ' & '}<Link href={`/team/${slug}`}>{bySlug.get(slug)!.name}</Link></span>
              ))}</p>
              <h3>{dept.name}</h3>
            </div>
          </div>
          <p className="department-card__description">{dept.description}</p>
          <div className="department-card__specs">
            {dept.specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
          <Link aria-label={`View the ${dept.name} team`} className="department-card__link-label" href={`/team#department-${dept.teamCode}`}>View team <span aria-hidden="true">→</span></Link>
          <div aria-hidden="true" className="department-card__scan" />
        </article>
      ))}
    </div>
  )
}
