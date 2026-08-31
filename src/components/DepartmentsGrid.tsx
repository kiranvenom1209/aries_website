import Image from 'next/image'
import Link from 'next/link'

export const departments = [
  {
    id: 'mechanical',
    teamCode: 'mech',
    name: 'Mechanical & Drivetrain',
    lead: 'Brahama Teja Naroju',
    badge: '/media/l1-mech-crop.png',
    description: 'Aluminium 3.3535 chassis architecture, differential rocker-bogie suspension, and six custom TPU wheels driven by Botwheel BLDC motors and ODrive S1 controllers.',
    specs: ['6WD Independent BLDC', 'Differential Leveling Bar', '35° Gradeability'],
  },
  {
    id: 'drill-manipulator',
    teamCode: 'drill',
    name: 'Drill & Manipulator',
    lead: 'Danny Sneham & Brahama Teja',
    badge: '/media/l1-drill-arm-crop.png',
    description: 'Igus ReBeL 6-DoF manipulation with a modular 3D-printed gripper, paired with a 530 mm coaxial auger system for deep regolith collection.',
    specs: ['2 kg Arm Payload', '≥300 mm Drill Depth', 'Modular End-Effector'],
  },
  {
    id: 'software',
    teamCode: 'soft',
    name: 'Software & Autonomy',
    lead: 'Omar Abdelrady',
    badge: '/media/l1-software-crop.png',
    description: 'ROS 2 on Ubuntu 24.04 combines RealSense depth sensing, EKF localization, Pure Pursuit path following and Dynamic Window Approach obstacle avoidance.',
    specs: ['ROS 2 + EKF', 'RealSense D435i', 'DWA Obstacle Avoidance'],
  },
  {
    id: 'electrical',
    teamCode: 'elec',
    name: 'Electrical & Power Systems',
    lead: 'Ayan Akbar Ali',
    badge: '/media/l1-electric-crop.png',
    description: 'A 25.6 V, 60 Ah LiFePO₄ main bus from four 12.8 V modules powers centralized distribution, regulated rails, CAN-connected motor control and the safety system.',
    specs: ['2S2P LiFePO₄ · 1.5 kWh', 'CAN Bus Telemetry', 'SSR E-Stop'],
  },
  {
    id: 'astroflight',
    teamCode: 'astro',
    name: 'Astroflight (AQUILA UAV)',
    lead: 'Rahul Khandait',
    badge: '/media/l1_astro-1.png',
    description: 'Autonomous reconnaissance UAV for aerial orthomosaic mapping, terrain hazard scanning, and cooperative rover-drone telemetry downlinks.',
    specs: ['VTOL / Fixed Wing', '4K Aerial Survey', 'Telemetry Relay'],
  },
  {
    id: 'science',
    teamCode: 'sci',
    name: 'Scientific Payload',
    lead: 'Harsha Vardhan Raju Gottimukkala',
    badge: '/media/l1-science-crop.png',
    description: 'Environmental, gas, pH, turbidity, Raman and microscopy instruments pair with load-cell sample verification and a peristaltic liquid-handling system.',
    specs: ['Raman Spectrometry', 'HX711 Load Cells', 'pH + Gas Analysis'],
  },
  {
    id: 'communication',
    teamCode: 'comm',
    name: 'Communication & Comms',
    lead: 'Vighnesh Madhav Deshmukh',
    badge: '/media/l1-comm-crop.png',
    description: 'The primary Ubiquiti AirMAX TDMA link carries telemetry and 720p video, while 2.4 GHz ExpressLRS provides an independent command and backup path.',
    specs: ['5 GHz AirMAX TDMA', '400 m Verified Link', '2.4 GHz ELRS Backup'],
  },
  {
    id: 'mro',
    teamCode: 'mro',
    name: 'Mission Resources & Outreach',
    lead: 'Reeba Biju',
    badge: '/media/l1_mro-1.png',
    description: 'Coordinates sponsor relations with industry partners (Boehm Group, SICK), public exhibitions at Space Night, media documentation, and logistics.',
    specs: ['Sponsorships', 'Space Night Exhibitions', 'Operations'],
  },
]

export function DepartmentsGrid() {
  return (
    <div className="department-grid">
      {departments.map((dept, index) => (
        <Link
          aria-label={`View the ${dept.name} team`}
          className="department-card"
          href={`/team#department-${dept.teamCode}`}
          key={dept.id}
        >
          <span className="department-card__number">{String(index + 1).padStart(2, '0')}</span>
          <div className="department-card__top">
            <div className="department-card__badge">
              <Image alt={`${dept.name} badge`} fill sizes="72px" src={dept.badge} />
            </div>
            <div>
              <p>LEAD / {dept.lead}</p>
              <h3>{dept.name}</h3>
            </div>
          </div>
          <p className="department-card__description">{dept.description}</p>
          <div className="department-card__specs">
            {dept.specs.map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>
          <span className="department-card__link-label">View team <span aria-hidden="true">→</span></span>
          <div aria-hidden="true" className="department-card__scan" />
        </Link>
      ))}
    </div>
  )
}
