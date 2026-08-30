/**
 * Curated public content from the HSM Aries WordPress export & live site.
 */

import { fallbackNews } from '../lib/fallbackNews'
import { authoritativeGalleryImages } from '../lib/gallery'

type LexicalTextNode = {
  detail: 0
  format: 0
  mode: 'normal'
  style: ''
  text: string
  type: 'text'
  version: 1
}

type LexicalBlockNode = {
  children: LexicalTextNode[]
  direction: 'ltr'
  format: ''
  indent: 0
  tag?: 'h2'
  textFormat?: 0
  textStyle?: ''
  type: 'heading' | 'paragraph'
  version: 1
}

export type LexicalRichText = {
  root: {
    children: LexicalBlockNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    type: 'root'
    version: 1
  }
}

type RichTextBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }

const textNode = (text: string): LexicalTextNode => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})

const richText = (...blocks: RichTextBlock[]): LexicalRichText => ({
  root: {
    children: blocks.map((block) =>
      block.kind === 'heading'
        ? {
            children: [textNode(block.text)],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            type: 'heading',
            version: 1,
          }
        : {
            children: [textNode(block.text)],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            type: 'paragraph',
            version: 1,
          },
    ),
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

export type SeedMedia = {
  alt: string
  filename: string
}

const curatedMediaSeed: SeedMedia[] = [
  { filename: 'aries-mark.png', alt: 'HSM Aries circular mission mark' },
  { filename: 'aries-wordmark.png', alt: 'HSM Aries wordmark' },
  { filename: 'erc-video-thumbnail.png', alt: 'LEAP-One in the official ERC 2026 qualification video' },
  { filename: 'ground-station.png', alt: 'HSM Aries unified rover and drone mission ground station' },
  { filename: 'hsm-powered-by.png', alt: 'Powered by Hochschule Schmalkalden' },
  { filename: 'sick-logo-1.png', alt: 'SICK Sensor Intelligence logo' },
  { filename: 'boehm-logo-2.png', alt: 'Boehm Group GmbH logo' },
  { filename: 'skyforce-logo.png', alt: 'Skyforce Drone Solutions logo' },
  { filename: 'eviotech-logo.jpg', alt: 'Eviotech logo' },
  { filename: 'leap-one-hero.jpg', alt: 'HSM Aries LEAP-One planetary rover' },
  { filename: 'qualification-announcement.jpg', alt: 'HSM Aries ERC 2026 qualification announcement' },
  { filename: 'qualification-score.png', alt: 'ERC 2026 qualification result showing HSM Aries ranked first' },
  { filename: 'hsm-png.png', alt: 'ERC 2026 qualification table showing HSM Aries in first place' },
  { filename: 'Thumbail-2-scaled.png', alt: 'LEAP-One featured in the ERC 2026 qualification video' },
  { filename: 'DSC02769-scaled.jpg', alt: 'HSM Aries team meeting aerospace leaders at Space Night 2026' },
  { filename: 'Screenshot-2026-05-10-203543.png', alt: 'ERC 2026 preliminary design report submission' },
  { filename: 'WhatsApp-Image-2026-05-10-at-20.29.43.jpeg', alt: 'LEAP-One high-performance compute unit integration' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.12-1.jpeg', alt: 'AQUILA manual flight trial' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.07.jpeg', alt: 'LEAP-One multi-terrain mobility testing' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.06.jpeg', alt: 'LEAP-One subsurface sampling trial' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.05.jpeg', alt: 'LEAP-One hardware assembly milestone' },
  { filename: 'Qualification-announcement-1.jpg', alt: 'HSM Aries ERC 2026 qualification announcement graphic' },
  { filename: 'HSM-ARIES-LEAPONE-2-scaled.jpg', alt: 'LEAP-One rover at the ERC 2026 qualification milestone' },
  { filename: '1777480994040.jpg', alt: 'HSM Aries team at Space Night 2026' },
  { filename: 'DSC02822-scaled.jpg', alt: 'HSM Aries Space Night 2026 exhibition' },
  { filename: 'DSC02818-scaled.jpg', alt: 'HSM Aries presenting at Space Night 2026' },
  { filename: 'DSC02793-scaled.jpg', alt: 'HSM Aries aerospace outreach conversation' },
  { filename: 'DSC02608-scaled.jpg', alt: 'HSM Aries rover and drone exhibition' },
  { filename: 'DSC02579-scaled.jpg', alt: 'Space Night 2026 exhibition crowd' },
  { filename: 'DSC02577-scaled.jpg', alt: 'Space Night 2026 event record' },
  { filename: 'WhatsApp-Video-2026-05-10-at-19.49.13-1.mp4', alt: 'AQUILA manual flight trial video' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.04.jpeg', alt: 'LEAP-One assembly progress' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.03.jpeg', alt: 'LEAP-One hardware integration' },
  { filename: 'WhatsApp-Image-2026-05-10-at-19.49.02.jpeg', alt: 'LEAP-One field-ready hardware detail' },
  { filename: 'rover-compute.jpg', alt: 'High-performance computational unit integrated into LEAP-One' },
  { filename: 'space-night-exhibit.jpg', alt: 'HSM Aries exhibition at Space Night 2026 in Jena' },
  { filename: 'space-night-rover.jpg', alt: 'LEAP-One rover displayed at Space Night 2026' },
  { filename: 'space-night-team.jpg', alt: 'HSM Aries team at Space Night 2026' },
  { filename: 'alexander-kolbai.jpg', alt: 'Alexander Kolbai — Mechanical Department' },
  { filename: 'johan-manoj-thomas.jpg', alt: 'Johan Manoj Thomas — Software Department' },
  { filename: 'md-bashar.jpg', alt: 'Md Bashar — Mechanical Department' },
  { filename: 'muhammad-abdulaziz.jpg', alt: 'Muhammad Abdulaziz — Software Department' },
  { filename: 'nikhil-meduri.jpg', alt: 'Nikhil Meduri — Electronics Department' },
  { filename: 'niranjan-ramesha.jpg', alt: 'Niranjan Ramesha — Mechanical Department' },
  { filename: 'reeba.jpg', alt: 'Reeba Biju — Software Department' },
  { filename: 'shakunth-nihal-kumar.jpg', alt: 'Shakunth Kiran Kumar Nihal — Software Lead' },
  { filename: 'shreyas-patel.jpg', alt: 'Shreyas Patel — Mechanical Department' },
  { filename: 'sreeniharika-kadudas.jpg', alt: 'Sreeniharika Kadudas — Scientific Payload' },
  { filename: 'virrendra.jpg', alt: 'Virendra — Scientific Payload' },
  { filename: 'yash-lohar.jpg', alt: 'Yash Lohar — Electrical Department' },
  { filename: 'anantha-.jpg', alt: 'Anantha Pathmanabhan — Mechanical Department' },
  { filename: 'ayan.jpg', alt: 'Ayan Akbar Ali — Electrical Department' },
  { filename: 'omar.jpg', alt: 'Omar Abdelrady — Software Department' },
  { filename: 'camila.jpg', alt: 'Camila Chagas Carvalho — Software Department' },
  { filename: 'naveen-.jpg', alt: 'Naveen Kumar Shivakumar — Mechanical Department' },
  { filename: 'ronaldo-goncalves-sobral-araujo.jpg', alt: 'Ronaldo Gonçalves Sobral Araújo — Electrical Department' },
  { filename: 'dhruv.jpg', alt: 'Dhruv Dharji — Communication Department' },
  { filename: 'abhinav-rana.jpg', alt: 'Abhinav Rana — Software & Drone Systems' },
  { filename: 'rover-isometric-1.png', alt: 'LEAP-One rover isometric system model' },
  { filename: 'mars-rover-leap-one-2.png', alt: 'LEAP-One planetary rover Martian simulation' },
  { filename: 'rover-final-with-3d-tyres.jpg', alt: 'LEAP-One rover with 3D printed custom tires' },
  { filename: 'pitching-in-boehm.jpg', alt: 'HSM Aries presentation at Boehm Group GmbH' },
  { filename: 'boehm-manufacturing.jpg', alt: 'CNC manufacturing and prototyping at Boehm Group' },
  { filename: 'dsc01422.jpg', alt: 'Field mobility testing with rocker-bogie chassis' },
  { filename: 'dsc01502.jpg', alt: 'Autonomous obstacle traversal field test' },
  { filename: 'dsc01503.jpg', alt: 'Field trial data acquisition and camera calibration' },
  { filename: 'dsc01524.jpg', alt: 'Field teleoperation and joystick control run' },
  { filename: 'dsc01541.jpg', alt: 'Rover suspension articulation test on steep grade' },
  { filename: 'dsc01546.jpg', alt: 'Field engineering and diagnostics check' },
  { filename: 'dsc01556.jpg', alt: 'Team members analyzing live field telemetry' },
]

export const sponsorSeed = [
  { name: 'Hochschule Schmalkalden', logo: 'hsm-powered-by.png', tier: 'principal', sortOrder: 10, website: 'https://www.hs-schmalkalden.de' },
  { name: 'Boehm Group GmbH', logo: 'boehm-logo-2.png', tier: 'gold', sortOrder: 20 },
  { name: 'SICK Sensor Intelligence', logo: 'sick-logo-1.png', tier: 'partner', sortOrder: 30, website: 'https://www.sick.com' },
  { name: 'Skyforce Drone Solutions', logo: 'skyforce-logo.png', tier: 'partner', sortOrder: 40 },
  { name: 'Eviotech', logo: 'eviotech-logo.jpg', tier: 'partner', sortOrder: 50 },
] as const

const filenameFromPublicURL = (url: string) => {
  const pathname = new URL(url, 'https://hsmaries.space').pathname
  return decodeURIComponent(pathname.split('/').pop() ?? '')
}

const archiveMediaSeed: SeedMedia[] = fallbackNews.flatMap((story) => {
  const assets = [
    { alt: story.imageAlt, url: story.image },
    ...(story.featuredVideo ? [{ alt: story.featuredVideo.alt ?? `${story.title} video`, url: story.featuredVideo.url }] : []),
    ...(story.mediaDeck ?? []).map((asset) => ({
      alt: asset.alt ?? asset.caption ?? `${story.title} supporting image`,
      url: asset.url,
    })),
  ]

  return assets.flatMap((asset) => {
    const filename = filenameFromPublicURL(asset.url)
    return filename ? [{ alt: asset.alt, filename }] : []
  })
})

const galleryArchiveMediaSeed: SeedMedia[] = authoritativeGalleryImages.map((image) => ({
  alt: image.alt,
  filename: filenameFromPublicURL(image.src),
}))

export const mediaSeed: SeedMedia[] = [
  ...new Map(
    [...curatedMediaSeed, ...archiveMediaSeed, ...galleryArchiveMediaSeed].map((item) => [
      item.filename,
      item,
    ]),
  ).values(),
].filter((item) => !item.filename.toLowerCase().endsWith('.svg'))

export type SeedNewsArticle = {
  author?: string
  body: LexicalRichText
  category:
    | 'mission'
    | 'engineering'
    | 'competition'
    | 'team'
    | 'outreach'
    | 'general'
  excerpt: string
  externalVideoUrl?: string
  featured: boolean
  featuredImage: string
  featuredVideo?: string
  mediaDeck?: Array<{
    caption?: string
    filename: string
  }>
  publishedAt: string
  slug: string
  source: {
    wordpressId?: number
    url: string
  }
  tags: string[]
  title: string
}

const curatedNewsSeed: SeedNewsArticle[] = [
  {
    title: 'Number One Worldwide: HSM Aries.space Tops ERC Qualifications with 239.75 Points!',
    slug: 'number-one-worldwide-hsm-aries-space-tops-erc-qualifications-with-239-75-points',
    publishedAt: '2026-06-28T17:34:00.000Z',
    excerpt: 'HSM Aries.space ranked first among 124 international teams in the ERC 2026 qualification stage, earning 239.75 points for the LEAP-One mission.',
    category: 'competition',
    tags: ['ERC 2026', 'Qualification', 'LEAP-One', 'Milestone'],
    featured: true,
    featuredImage: 'hsm-png.png',
    mediaDeck: [
      {
        filename: 'Qualification-announcement-1.jpg',
        caption: 'Qualification milestone announced by the HSM Aries team.',
      },
      {
        filename: 'HSM-ARIES-LEAPONE-2-scaled.jpg',
        caption: 'LEAP-One, the platform behind the ERC 2026 qualification result.',
      },
    ],
    source: {
      wordpressId: 1412,
      url: 'https://hsmaries.space/number-one-worldwide-hsm-aries-space-tops-erc-qualifications-with-239-75-points/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'Schmalkalden, Germany — HSM Aries.space placed first in the ERC 2026 qualification stage. LEAP-One earned 239.75 points in a field of 124 international teams.',
      },
      { kind: 'heading', text: 'Setting the qualification benchmark' },
      {
        kind: 'paragraph',
        text: 'ERC qualification evaluates detailed engineering documentation, mechanical design, software architecture, and practical demonstration. The team’s result reflects its Preliminary Design Review and technical qualification video.',
      },
      { kind: 'heading', text: 'Engineering behind the result' },
      {
        kind: 'paragraph',
        text: 'The published submission highlights RTX 5080-powered processing for ROS 2-based SLAM and autonomous navigation, a custom rocker-bogie mobility system, deep-core drilling and sampling tests, and an integrated ground station for LEAP-One and the AQUILA drone.',
      },
      { kind: 'heading', text: 'Next stop: the physical competition' },
      {
        kind: 'paragraph',
        text: 'The team thanked its faculty advisors, sponsors, and supporters, then returned to hardware optimization and software refinement. HSM Aries.space enters the final competition phase as the top-ranked qualifier.',
      },
    ),
  },
  {
    title: 'HSM Aries.space Releases Official ERC 2026 Submission Video for LEAP-One',
    slug: 'watch-now-hsm-aries-space-releases-official-erc-2026-submission-video-for-leap-one',
    publishedAt: '2026-05-31T17:31:00.000Z',
    excerpt: 'The team has released its official 10-minute ERC 2026 qualification video, presenting LEAP-One’s mobility, navigation, robotic systems, science suite, and mission control.',
    category: 'competition',
    tags: ['ERC 2026', 'Qualification Video', 'LEAP-One', 'Mission Systems'],
    featured: true,
    featuredImage: 'Thumbail-2-scaled.png',
    externalVideoUrl: 'https://www.youtube.com/embed/8-6aMd6mBMg',
    source: {
      wordpressId: 1407,
      url: 'https://hsmaries.space/watch-now-hsm-aries-space-releases-official-erc-2026-submission-video-for-leap-one/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'HSM Aries.space has released its official 10-minute qualification video for the European Rover Challenge 2026. The film brings together months of CAD work, lab integration, PDR documentation, and field testing.',
      },
      { kind: 'heading', text: 'LEAP-One in action' },
      {
        kind: 'paragraph',
        text: 'The video shows the rover’s rocker-bogie suspension crossing inclines, gravel, and obstacles. It also introduces the compute platform used for SLAM and ROS 2-based autonomy, plus the robotic arm and science suite performing manipulation and sampling tasks.',
      },
      { kind: 'heading', text: 'A unified mission architecture' },
      {
        kind: 'paragraph',
        text: 'Viewers are taken inside the integrated ground station, where telemetry from LEAP-One and the AQUILA drone is managed through a common mission-control workflow.',
      },
      { kind: 'heading', text: 'Watch the qualification video' },
      {
        kind: 'paragraph',
        text: 'The official video is available on the HSM Aries.space YouTube channel: https://www.youtube.com/watch?v=8-6aMd6mBMg',
      },
    ),
  },
  {
    title: 'State Leadership & Aerospace Innovation: HSM Aries.space Shines at Space Night 2026',
    slug: 'state-leadership-aerospace-innovation-hsm-aries-space-shines-at-space-night-2026',
    publishedAt: '2026-04-28T18:39:13.000Z',
    excerpt: 'HSM Aries.space represented Hochschule Schmalkalden at Space Night 2026 in Jena, presenting LEAP-One and AQUILA to state leaders and aerospace organizations.',
    category: 'outreach',
    tags: ['Space Night 2026', 'LEAP-One', 'AQUILA', 'Aerospace'],
    featured: true,
    featuredImage: 'DSC02769-scaled.jpg',
    mediaDeck: [
      { filename: '1777480994040.jpg', caption: 'HSM Aries at Space Night 2026.' },
      { filename: 'DSC02822-scaled.jpg' },
      { filename: 'DSC02818-scaled.jpg' },
      { filename: 'DSC02793-scaled.jpg' },
      { filename: 'DSC02608-scaled.jpg' },
      { filename: 'DSC02579-scaled.jpg' },
      { filename: 'DSC02577-scaled.jpg' },
    ],
    source: {
      wordpressId: 1377,
      url: 'https://hsmaries.space/state-leadership-aerospace-innovation-hsm-aries-space-shines-at-space-night-2026/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'Jena, Germany — HSM Aries.space represented Hochschule Schmalkalden at Space Night 2026 on April 28. VESPE Jena e.V. organized the event at Ernst-Abbe-Hochschule Jena, bringing together teams and organizations from the aerospace sector.',
      },
      { kind: 'heading', text: 'Student engineering on display' },
      {
        kind: 'paragraph',
        text: 'The exhibition paired the LEAP-One Mars rover with AQUILA, the high-performance aircraft developed by the Drone Club. Presenting both systems gave visitors a view of the project’s rover, flight, autonomy, and mission-control work.',
      },
      { kind: 'heading', text: 'Conversations with state leadership' },
      {
        kind: 'paragraph',
        text: 'The team presented its progress to Mario Voigt, Minister-President of the Free State of Thuringia, and Colette Boos-John, Thuringia’s Minister for Economic Affairs, Agriculture, and Rural Areas.',
      },
      { kind: 'heading', text: 'Connecting across the aerospace community' },
      {
        kind: 'paragraph',
        text: 'Space Night also created opportunities to exchange ideas with representatives from Starlab, the DLR Institute of Data Science, and Jena-Optronik GmbH.',
      },
    ),
  },
  {
    title: 'Double Milestone: HSM Aries.space Submits ERC 2026 PDR and Activates Unified Ground Station',
    slug: 'double-milestone-hsm-aries-space-submits-erc-2026-pdr-and-activates-unified-ground-station',
    publishedAt: '2026-04-08T18:34:22.000Z',
    excerpt: 'HSM Aries.space completed two key ERC 2026 milestones: submission of its 100-plus-page Preliminary Design Review and hardware integration of the mission ground station.',
    category: 'engineering',
    tags: ['ERC 2026', 'PDR', 'Ground Station', 'Telemetry'],
    featured: false,
    featuredImage: 'Screenshot-2026-05-10-203543.png',
    source: {
      wordpressId: 1373,
      url: 'https://hsmaries.space/double-milestone-hsm-aries-space-submits-erc-2026-pdr-and-activates-unified-ground-station/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'HSM Aries.space reached two connected milestones for ERC 2026: submitting the project’s Preliminary Design Review and completing hardware integration for the Mission Ground Station.',
      },
      { kind: 'heading', text: 'A mission architecture on paper' },
      {
        kind: 'paragraph',
        text: 'The PDR is a technical document of more than 100 pages. It brings together structural analysis and kinematics, power-budget optimization, safety and risk work, and the pathways for software integration and autonomy.',
      },
      { kind: 'heading', text: 'The operational nervous system' },
      {
        kind: 'paragraph',
        text: 'At the same time, the IT and Systems teams integrated the central ground-station hardware. The setup includes calibrated high-gain antennas, a low-latency 4K video link, a multi-monitor control console, and a synchronized dashboard for LEAP-One and AQUILA telemetry.',
      },
    ),
  },
  {
    title: 'The "Central Brain" is Online: LEAP-One Integrates High-Performance Computational Unit',
    slug: 'the-central-brain-is-online-leap-one-integrates-high-performance-computational-unit',
    publishedAt: '2026-04-01T18:29:56.000Z',
    excerpt: 'LEAP-One now carries a compact high-performance computer with an Intel Core Ultra 9 processor and NVIDIA GeForce RTX 5080 for autonomy, perception, and mission data.',
    category: 'engineering',
    tags: ['LEAP-One', 'Autonomy', 'ROS 2', 'SLAM'],
    featured: false,
    featuredImage: 'WhatsApp-Image-2026-05-10-at-20.29.43.jpeg',
    source: {
      wordpressId: 1368,
      url: 'https://hsmaries.space/the-central-brain-is-online-leap-one-integrates-high-performance-computational-unit/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'Schmalkalden, Germany — The HSM Aries.space Systems Department has integrated an ASUS ROG NUC 15 Tall as LEAP-One’s central computational unit.',
      },
      { kind: 'heading', text: 'Desktop-class processing in the rover' },
      {
        kind: 'paragraph',
        text: 'The published configuration combines an Intel Core Ultra 9 275HX processor, an NVIDIA GeForce RTX 5080, 32 GB of memory, a 2 TB NVMe SSD, and Intel Wi-Fi 7 connectivity.',
      },
      { kind: 'heading', text: 'Built for perception and autonomy' },
      {
        kind: 'paragraph',
        text: 'The GPU gives the rover parallel processing capacity for computer vision and SLAM. The team plans to use the platform to build high-fidelity 3D maps, identify targets of scientific interest, navigate difficult terrain, and log mission data at high frequency.',
      },
    ),
  },
  {
    title: 'Taking Flight: AQUILA Drone Proves Stability in Real-World Manual Flight Trials',
    slug: 'taking-flight-aquila-drone-proves-stability-in-real-world-manual-flight-trials',
    publishedAt: '2026-03-17T18:00:00.000Z',
    excerpt: 'The Astroflight department successfully conducted initial outdoor flight trials for the AQUILA fixed-wing and VTOL aircraft.',
    category: 'engineering',
    tags: ['AQUILA', 'Drone', 'Astroflight', 'Telemetry'],
    featured: false,
    featuredImage: 'WhatsApp-Image-2026-05-10-at-19.49.12-1.jpeg',
    featuredVideo: 'WhatsApp-Video-2026-05-10-at-19.49.13-1.mp4',
    source: {
      wordpressId: 1360,
      url: 'https://hsmaries.space/taking-flight-aquila-drone-proves-stability-in-real-world-manual-flight-trials/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'The Astroflight team took to the airfield to test the manual flight dynamics, stabilization gyros, and real-time telemetry downlink of the AQUILA reconnaissance aircraft.',
      },
      { kind: 'heading', text: 'Seamless drone and rover cooperative mapping' },
      {
        kind: 'paragraph',
        text: 'AQUILA is designed to scout ahead of LEAP-One, capturing high-resolution overhead orthomosaics and relaying terrain hazard data directly to the ground station.',
      },
    ),
  },
  {
    title: 'Multi-Terrain Mastery: LEAP-One Rover Aces Mobility Tests for ERC 2026 and ICARM Publication',
    slug: 'multi-terrain-mastery-leap-one-rover-aces-mobility-tests-for-erc-2026-and-icarm-publication',
    publishedAt: '2026-02-25T18:00:00.000Z',
    excerpt: 'Comprehensive field mobility trials validate the rocker-bogie suspension and custom high-traction wheel grousers across gravel, sand, and rock beds.',
    category: 'engineering',
    tags: ['Mobility', 'Rocker-Bogie', 'ICARM 2026', 'Field Trials'],
    featured: false,
    featuredImage: 'WhatsApp-Image-2026-05-10-at-19.49.07.jpeg',
    source: {
      wordpressId: 1350,
      url: 'https://hsmaries.space/multi-terrain-mastery-leap-one-rover-aces-mobility-tests-for-erc-2026-and-icarm-publication/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'LEAP-One underwent rigorous mobility trials across diverse simulated Martian terrains, achieving 100% obstacle clearance on 35-degree inclines.',
      },
      { kind: 'heading', text: 'Peer-reviewed robotics research' },
      {
        kind: 'paragraph',
        text: 'The kinematic suspension data and traction optimization findings are being compiled for publication at the upcoming ICARM 2026 international robotics conference.',
      },
    ),
  },
  {
    title: 'Subsurface Sampling Success: HSM Aries.space Prepares for ICARM 2026 Publication',
    slug: 'subsurface-sampling-success-hsm-aries-space-prepares-for-icarm-2026-publication',
    publishedAt: '2026-02-19T18:00:00.000Z',
    excerpt: 'The deep-core drilling mechanism achieves full 30 cm soil sample retrieval with zero cross-contamination in laboratory trials.',
    category: 'engineering',
    tags: ['Drill Mechanism', 'Scientific Payload', 'ICARM 2026'],
    featured: false,
    featuredImage: 'WhatsApp-Image-2026-05-10-at-19.49.06.jpeg',
    source: {
      wordpressId: 1345,
      url: 'https://hsmaries.space/subsurface-sampling-success-hsm-aries-space-prepares-for-icarm-2026-publication/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'The mechanical and science payload departments successfully demonstrated autonomous core extraction using the telescopic auger drill assembly.',
      },
      { kind: 'heading', text: 'Automated sample deposition' },
      {
        kind: 'paragraph',
        text: 'Extracted soil cores are sealed and transferred into onboard spectroscopy chambers within 45 seconds of retrieval.',
      },
    ),
  },
  {
    title: 'Hardware Milestone: HSM Aries.space Successfully Assembles Latest High-Performance Flight Unit',
    slug: 'hardware-milestone-hsm-aries-space-successfully-assembles-latest-high-performance-flight-unit',
    publishedAt: '2026-01-24T18:00:00.000Z',
    excerpt: 'Complete chassis, electronics bay, and drivetrain hardware assembly completed in partnership with Boehm Group GmbH.',
    category: 'engineering',
    tags: ['Hardware Assembly', 'Boehm Group', 'Manufacturing'],
    featured: false,
    featuredImage: 'WhatsApp-Image-2026-05-10-at-19.49.05.jpeg',
    mediaDeck: [
      { filename: 'WhatsApp-Image-2026-05-10-at-19.49.04.jpeg' },
      { filename: 'WhatsApp-Image-2026-05-10-at-19.49.03.jpeg' },
      { filename: 'WhatsApp-Image-2026-05-10-at-19.49.02.jpeg' },
    ],
    source: {
      wordpressId: 1340,
      url: 'https://hsmaries.space/hardware-milestone-hsm-aries-space-successfully-assembles-latest-high-performance-flight-unit/',
    },
    body: richText(
      {
        kind: 'paragraph',
        text: 'With support from Boehm Group GmbH, the precision aluminum rocker-bogie chassis and avionics bay have been fully machined and integrated.',
      },
      { kind: 'heading', text: 'Industry partnership in Thuringia' },
      {
        kind: 'paragraph',
        text: 'The collaboration with Boehm Group provides students with access to state-of-the-art 5-axis CNC machining, ensuring aerospace-grade manufacturing standards.',
      },
    ),
  },
]

const categoryForArchiveStory = (category?: string): SeedNewsArticle['category'] => {
  switch (category?.toLowerCase()) {
    case 'competition':
      return 'competition'
    case 'outreach':
      return 'outreach'
    case 'team':
      return 'team'
    case 'general':
      return 'general'
    default:
      return 'engineering'
  }
}

const curatedNewsSlugs = new Set(curatedNewsSeed.map((story) => story.slug))

export const newsSeed: SeedNewsArticle[] = [
  ...curatedNewsSeed.map((story) => ({
    ...story,
    author: story.author ?? 'Harsha Gottimukkala',
  })),
  ...fallbackNews
    .filter((story) => !curatedNewsSlugs.has(story.slug))
    .map((story) => ({
      author: story.author ?? 'Harsha Gottimukkala',
      body: richText(...story.body.map((text) => ({ kind: 'paragraph' as const, text }))),
      category: categoryForArchiveStory(story.category),
      excerpt: story.excerpt,
      externalVideoUrl: story.externalVideoUrl,
      featured: false,
      featuredImage: filenameFromPublicURL(story.image),
      featuredVideo: story.featuredVideo
        ? filenameFromPublicURL(story.featuredVideo.url)
        : undefined,
      mediaDeck: story.mediaDeck?.map((asset) => ({
        caption: asset.caption ?? asset.alt,
        filename: filenameFromPublicURL(asset.url),
      })),
      publishedAt: story.publishedAt,
      slug: story.slug,
      source: {
        url: `https://hsmaries.space/${story.slug}/`,
      },
      tags: [story.category ?? 'Engineering', 'HSM Aries'],
      title: story.title,
    })),
]

export type SeedGallery = {
  coverImage: string
  description: LexicalRichText
  eventDate: string
  isPublic: true
  items: string[]
  location: string
  slug: string
  sortOrder: number
  tags: string[]
  title: string
}

export const gallerySeed: SeedGallery[] = [
  {
    title: 'HSM Aries Website Gallery Archive',
    slug: 'website-gallery-archive',
    description: richText({
      kind: 'paragraph',
      text: 'The complete public gallery from hsmaries.space, including field tests, outreach, engineering milestones, renders, and team records.',
    }),
    coverImage: filenameFromPublicURL(authoritativeGalleryImages[0].src),
    items: authoritativeGalleryImages.map((image) => filenameFromPublicURL(image.src)),
    eventDate: '2026-05-31T00:00:00.000Z',
    location: 'Hochschule Schmalkalden, Germany',
    tags: ['Website Archive', 'HSM Aries', 'LEAP-One'],
    sortOrder: 5,
    isPublic: true,
  },
  {
    title: 'Space Night 2026',
    slug: 'space-night-2026',
    description: richText({
      kind: 'paragraph',
      text: 'HSM Aries.space presented LEAP-One and AQUILA at Space Night 2026, hosted at Ernst-Abbe-Hochschule Jena.',
    }),
    coverImage: 'space-night-team.jpg',
    items: [
      'space-night-team.jpg',
      'space-night-rover.jpg',
      'space-night-exhibit.jpg',
    ],
    eventDate: '2026-04-28T18:39:13.000Z',
    location: 'Jena, Germany',
    tags: ['Space Night 2026', 'Outreach', 'LEAP-One', 'AQUILA'],
    sortOrder: 10,
    isPublic: true,
  },
  {
    title: 'ERC 2026 Qualification',
    slug: 'erc-2026-qualification',
    description: richText({
      kind: 'paragraph',
      text: 'The qualification announcement and score from HSM Aries.space’s first-place ERC 2026 qualification result.',
    }),
    coverImage: 'qualification-announcement.jpg',
    items: ['qualification-announcement.jpg', 'qualification-score.png'],
    eventDate: '2026-06-28T17:34:00.000Z',
    location: 'Schmalkalden, Germany',
    tags: ['ERC 2026', 'Qualification', 'Milestone'],
    sortOrder: 20,
    isPublic: true,
  },
  {
    title: 'Field Trials & Terrain Navigation',
    slug: 'field-trials-terrain-navigation',
    description: richText({
      kind: 'paragraph',
      text: 'Field mobility, obstacle traversal, and teleoperation trials across rocky terrain and inclines.',
    }),
    coverImage: 'dsc01524.jpg',
    items: [
      'dsc01422.jpg',
      'dsc01502.jpg',
      'dsc01503.jpg',
      'dsc01524.jpg',
      'dsc01541.jpg',
      'dsc01546.jpg',
      'dsc01556.jpg',
    ],
    eventDate: '2026-03-15T14:00:00.000Z',
    location: 'Thuringian Forest, Germany',
    tags: ['Field Trials', 'Mobility', 'Rocker-Bogie', 'Teleoperation'],
    sortOrder: 30,
    isPublic: true,
  },
  {
    title: 'Industry Manufacturing & Boehm Partnership',
    slug: 'manufacturing-boehm-partnership',
    description: richText({
      kind: 'paragraph',
      text: 'Precision CNC machining, chassis fabrication, and pitch presentation at Boehm Group GmbH.',
    }),
    coverImage: 'pitching-in-boehm.jpg',
    items: [
      'pitching-in-boehm.jpg',
      'boehm-manufacturing.jpg',
      'rover-final-with-3d-tyres.jpg',
    ],
    eventDate: '2026-01-20T10:00:00.000Z',
    location: 'Boehm Group GmbH, Germany',
    tags: ['Manufacturing', 'Partnership', 'CNC', 'Chassis'],
    sortOrder: 40,
    isPublic: true,
  },
]

export type SeedDownload = {
  category: 'press-kit' | 'technical' | 'competition' | 'brand' | 'other'
  description: string
  file: string
  isPublic: true
  publishedAt: string
  slug: string
  sortOrder: number
  title: string
  version: string
}

export const downloadSeed: SeedDownload[] = [
  {
    title: 'HSM Aries Wordmark (PNG)',
    slug: 'hsm-aries-wordmark-png',
    description: 'Transparent PNG wordmark for approved HSM Aries communications and coverage.',
    file: 'aries-wordmark.png',
    category: 'brand',
    version: '2026',
    publishedAt: '2026-06-28T17:34:00.000Z',
    sortOrder: 10,
    isPublic: true,
  },
  {
    title: 'HSM Aries Mission Mark (PNG)',
    slug: 'hsm-aries-mission-mark-png',
    description: 'Transparent PNG mission mark for approved HSM Aries communications and coverage.',
    file: 'aries-mark.png',
    category: 'brand',
    version: '2026',
    publishedAt: '2026-06-28T17:34:00.000Z',
    sortOrder: 20,
    isPublic: true,
  },
]

export type SeedTeamMember = {
  bio: LexicalRichText
  discipline:
    | 'leadership'
    | 'mechanical'
    | 'electrical'
    | 'software'
    | 'science'
    | 'operations'
    | 'other'
  isActive: boolean
  links?: {
    linkedIn?: string
    website?: string
  }
  name: string
  portrait?: string
  position: string
  slug: string
  sortOrder: number
  tags: string[]
}

export const teamSeed: SeedTeamMember[] = [
  {
    name: 'Brahama Teja Naroju',
    slug: 'brahama-teja-naroju',
    position: 'Commander / Project Lead',
    discipline: 'leadership',
    tags: ['Mission Architecture', 'Systems Engineering', 'ERC Campaign'],
    portrait: 'space-night-team.jpg',
    sortOrder: 10,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
      website: 'https://hsmaries.space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Directs overall rover development, system architecture and competition readiness for LEAP-One at European Rover Challenge.',
    }),
  },
  {
    name: 'Danny Sneham',
    slug: 'danny-sneham',
    position: 'Mechanical & Subsystems Lead',
    discipline: 'mechanical',
    tags: ['Chassis & Suspension', 'Telescopic Drill', 'CAD / FEA'],
    portrait: 'space-night-exhibit.jpg',
    sortOrder: 20,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Engineered the LEAP-One telescopic auger drill mechanism and rocker-bogie suspension for extreme terrain navigation.',
    }),
  },
  {
    name: 'Shakunth Kiran Kumar Nihal',
    slug: 'shakunth-kiran-kumar-nihal',
    position: 'Software & Navigation Department Lead',
    discipline: 'software',
    tags: ['ROS 2', 'RTX 5080 Compute', '3D SLAM', 'Autonomy'],
    portrait: 'shakunth-nihal-kumar.jpg',
    sortOrder: 30,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
      website: 'https://github.com/kiranvenom1209/LeapOne_rover',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Architect of LEAP-One autonomous navigation pipeline, ROS 2 integration, LiDAR SLAM, and GPU edge perception.',
    }),
  },
  {
    name: 'Alexander Kolbai',
    slug: 'alexander-kolbai',
    position: 'Mechanical Department Specialist',
    discipline: 'mechanical',
    tags: ['Rocker-Bogie', 'FEA Analysis', 'Precision Machining'],
    portrait: 'alexander-kolbai.jpg',
    sortOrder: 40,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Specializes in structural kinematics, rocker-bogie differential mechanics, and precision component machining at partner facilities.',
    }),
  },
  {
    name: 'Johan Manoj Thomas',
    slug: 'johan-manoj-thomas',
    position: 'Software & Perception Engineer',
    discipline: 'software',
    tags: ['Computer Vision', 'Stereo Depth', 'Obstacle Detection'],
    portrait: 'johan-manoj-thomas.jpg',
    sortOrder: 50,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Develops stereo vision pipelines, point cloud filtering, and real-time obstacle avoidance algorithms on ROS 2.',
    }),
  },
  {
    name: 'Nikhil Meduri',
    slug: 'nikhil-meduri',
    position: 'Electronics & Embedded Systems Engineer',
    discipline: 'electrical',
    tags: ['Custom PCB', 'Microcontrollers', 'CAN Bus', 'BMS'],
    portrait: 'nikhil-meduri.jpg',
    sortOrder: 60,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Designs custom micro-PCB boards, low-level microcontroller firmware, CAN bus communications, and power management circuits.',
    }),
  },
  {
    name: 'Niranjan Ramesha',
    slug: 'niranjan-ramesha',
    position: 'Mechanical & Suspension Engineer',
    discipline: 'mechanical',
    tags: ['Drivetrain', 'Suspension', 'Wheel Grousers'],
    portrait: 'niranjan-ramesha.jpg',
    sortOrder: 70,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Focuses on 6-wheel independent drivetrain, custom 3D-printed flexible wheel grousers, and planetary terrain testing.',
    }),
  },
  {
    name: 'Md Bashar',
    slug: 'md-bashar',
    position: 'Mechanical Manufacturing Specialist',
    discipline: 'mechanical',
    tags: ['Fabrication', 'Chassis Assembly', 'Tolerancing'],
    portrait: 'md-bashar.jpg',
    sortOrder: 80,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Handles physical assembly, CNC manufacturing tolerances, aluminum framing, and structural stress testing.',
    }),
  },
  {
    name: 'Muhammad Abdulaziz',
    slug: 'muhammad-abdulaziz',
    position: 'Software & Teleoperation Engineer',
    discipline: 'software',
    tags: ['Teleoperation', 'Low-Latency Control', 'ROS 2 Nodes'],
    portrait: 'muhammad-abdulaziz.jpg',
    sortOrder: 90,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Develops teleoperation interfaces, low-latency gamepad control servers, and status telemetry feeds.',
    }),
  },
  {
    name: 'Yash Lohar',
    slug: 'yash-lohar',
    position: 'Electrical & Power Systems Engineer',
    discipline: 'electrical',
    tags: ['Power Distribution', 'Harnessing', 'Safety Relays'],
    portrait: 'yash-lohar.jpg',
    sortOrder: 100,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Engineers the centralized power distribution unit, wiring harnesses, safety cutoffs, and battery thermal protection.',
    }),
  },
  {
    name: 'Sreeniharika Kadudas',
    slug: 'sreeniharika-kadudas',
    position: 'Scientific Payload Engineer',
    discipline: 'science',
    tags: ['Spectroscopy', 'Soil Analysis', 'Sample Carousel'],
    portrait: 'sreeniharika-kadudas.jpg',
    sortOrder: 110,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Designs the scientific carousel, spectroscopic analysis chamber, and geochemical sampling sensors for field evaluation.',
    }),
  },
  {
    name: 'Virendra',
    slug: 'virendra',
    position: 'Scientific Payload Specialist',
    discipline: 'science',
    tags: ['Planetary Geology', 'Sample Preservation', 'Chemical Tests'],
    portrait: 'virrendra.jpg',
    sortOrder: 120,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Develops contamination-free soil sample storage, chemical reagent delivery, and geological sample documentation procedures.',
    }),
  },
  {
    name: 'Dhruv Dharji',
    slug: 'dhruv-dharji',
    position: 'Communication & Ground Station Engineer',
    discipline: 'operations',
    tags: ['RF Antennas', '5.8 GHz Link', 'Ground Control'],
    portrait: 'dhruv.jpg',
    sortOrder: 130,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Implements long-range RF links, 5.8 GHz redundant data streams, high-gain directional antennas, and ground station base units.',
    }),
  },
  {
    name: 'Ayan Akbar Ali',
    slug: 'ayan-akbar-ali',
    position: 'Electrical & Avionics Specialist',
    discipline: 'electrical',
    tags: ['Motor Drivers', 'Sensor Integration', 'Power Lines'],
    portrait: 'ayan.jpg',
    sortOrder: 140,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Integrates brushless motor drivers, rotary encoders, current monitoring shunts, and sensor cabling across all joints.',
    }),
  },
  {
    name: 'Reeba Biju',
    slug: 'reeba-biju',
    position: 'Software & UI Developer',
    discipline: 'software',
    tags: ['Dashboard', 'Telemetry UI', 'Mission Control'],
    portrait: 'reeba.jpg',
    sortOrder: 150,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Builds real-time telemetry dashboards, mission control user interfaces, and 3D visualization tools for rover teleoperation.',
    }),
  },
  {
    name: 'Camila Chagas Carvalho',
    slug: 'camila-chagas-carvalho',
    position: 'Software & State Estimation Engineer',
    discipline: 'software',
    tags: ['State Estimation', 'IMU Fusion', 'EKF'],
    portrait: 'camila.jpg',
    sortOrder: 160,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Focuses on multi-sensor state estimation, IMU/wheel-odometry sensor fusion using Extended Kalman Filtering on ROS 2.',
    }),
  },
  {
    name: 'Ronaldo Gonçalves Sobral Araújo',
    slug: 'ronaldo-goncalves',
    position: 'Electrical & Sensor Specialist',
    discipline: 'electrical',
    tags: ['Sensor Busses', 'EMI Shielding', 'Power Circuits'],
    portrait: 'ronaldo-goncalves-sobral-araujo.jpg',
    sortOrder: 170,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Handles electromagnetic interference shielding, sensor bus isolation, and high-efficiency DC-DC conversion.',
    }),
  },
  {
    name: 'Shreyas Patel',
    slug: 'shreyas-patel',
    position: 'Mechanical & Structural Engineer',
    discipline: 'mechanical',
    tags: ['CAD Modeling', 'Structural Rigidity', 'Rapid Prototyping'],
    portrait: 'shreyas-patel.jpg',
    sortOrder: 180,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Develops CAD assemblies, structural rigidity reinforcements, and 3D-printed protective enclosures for onboard avionics.',
    }),
  },
  {
    name: 'Omar Abdelrady',
    slug: 'omar-abdelrady',
    position: 'Software & Mission Control Engineer',
    discipline: 'software',
    tags: ['Mission Control', 'Telemetry Protocols', 'Data Logging'],
    portrait: 'omar.jpg',
    sortOrder: 190,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Develops mission data loggers, synchronized flight recording, and network protocol optimization for ground teleoperation.',
    }),
  },
  {
    name: 'Naveen Kumar Shivakumar',
    slug: 'naveen-kumar-shivakumar',
    position: 'Mechanical Fabrication Engineer',
    discipline: 'mechanical',
    tags: ['Machining', 'Drill Bit Assembly', 'Testing'],
    portrait: 'naveen-.jpg',
    sortOrder: 200,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Works on precision drill bit assembly, torque transmission gearing, and physical soil penetration testing.',
    }),
  },
  {
    name: 'Anantha Pathmanabhan',
    slug: 'anantha-pathmanabhan',
    position: 'Mechanical & Actuation Engineer',
    discipline: 'mechanical',
    tags: ['Joint Actuation', 'Harmonic Drives', 'Arm Mechanics'],
    portrait: 'anantha-.jpg',
    sortOrder: 210,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Specializes in harmonic drive gearboxes, joint backlash reduction, and robotic arm inverse kinematics calibration.',
    }),
  },
  {
    name: 'Abhinav Rana',
    slug: 'abhinav-rana',
    position: 'Software & Drone Systems Specialist',
    discipline: 'operations',
    tags: ['AQUILA UAV', 'Aerial Survey', 'Multi-Vehicle Coordination'],
    portrait: 'abhinav-rana.jpg',
    sortOrder: 220,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Leads the AQUILA drone telemetry link, aerial reconnaissance flight trials, and rover-drone cooperative mapping.',
    }),
  },
  {
    name: 'K.K. Achari',
    slug: 'kk-achari',
    position: 'Senior Technical Mentor & Systems Advisor',
    discipline: 'other',
    tags: ['Aerospace Mentorship', 'Mission Architecture', 'PDR Guidance', 'Mission Badge'],
    portrait: 'space-night-team.jpg',
    sortOrder: 230,
    isActive: true,
    links: {
      linkedIn: 'https://www.linkedin.com/company/aries-space',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Guides mission systems architecture, electronic bay layout, PDR milestone documentation, and project visual identity.',
    }),
  },
  {
    name: 'Prof. Dr.-Ing. Frank Schrödel',
    slug: 'prof-dr-ing-frank-schrodel',
    position: 'Faculty Advisor & Academic Sponsor',
    discipline: 'other',
    tags: ['Academic Sponsor', 'Faculty Governance', 'Hochschule Schmalkalden', 'Robotics Lab'],
    portrait: 'hsm-powered-by.png',
    sortOrder: 240,
    isActive: true,
    links: {
      website: 'https://www.hs-schmalkalden.de',
    },
    bio: richText({
      kind: 'paragraph',
      text: 'Provides institutional governance, faculty mentorship, robotics lab sponsorship, and university research facilities at Hochschule Schmalkalden.',
    }),
  },
]
