export type NewsMedia = {
  alt?: string
  caption?: string
  credit?: string
  mimeType?: string
  url: string
}

export type NewsStory = {
  author?: string
  body: string[]
  category?: string
  externalVideoUrl?: string
  excerpt: string
  image: string
  imageAlt: string
  featuredVideo?: NewsMedia
  mediaDeck?: NewsMedia[]
  publishedAt: string
  slug: string
  title: string
}

const sourceNews: NewsStory[] = [
  {
    "slug": "number-one-worldwide-hsm-aries-space-tops-erc-qualifications-with-239-75-points",
    "title": "Number One Worldwide: HSM Aries.space Tops ERC Qualifications with 239.75 Points!",
    "excerpt": "Schmalkalden, Germany ' History has been made at Hochschule Schmalkalden! HSM Aries.space is incredibly proud to announce that we have officially conquered the ERC qualifications, securing the 1st-place position globally. Out of a highly competitive field of 124 international teams fighting for a spot in the ERC, our LEAP-One Mars Rover project achieved the top [&hellip;]",
    "publishedAt": "2026-06-28T15:34:00.000Z",
    "category": "Competition",
    "image": "/media/hsm-png.png",
    "imageAlt": "Number One Worldwide: HSM Aries.space Tops ERC Qualifications with 239.75 Points!",
    "mediaDeck": [
      { "alt": "HSM Aries ERC 2026 qualification announcement", "url": "/media/Qualification-announcement-1.jpg" },
      { "alt": "LEAP-One rover at the ERC 2026 qualification milestone", "url": "/media/HSM-ARIES-LEAPONE-2-scaled.jpg" }
    ],
    "body": [
      "Schmalkalden, Germany ' History has been made at Hochschule Schmalkalden! HSM Aries.space is incredibly proud to announce that we have officially conquered the ERC qualifications , securing the 1st-place position globally.",
      "Out of a highly competitive field of 124 international teams fighting for a spot in the ERC , our LEAP-One Mars Rover project achieved the top ranking with an outstanding overall score of 239.75 points .",
      "The path to becoming an ERC-qualified team is notoriously rigorous. It requires engineering teams to demonstrate absolute excellence across complex documentation, mechanical design, software architecture, and practical execution. Our top-ranking score reflects the exceptional quality of our Preliminary Design Review (PDR) and the flawless technical demonstration in our qualification video.",
      "Earning 1st place out of 124 teams proves that our mission architecture sets a new standard for the ERC . Our unprecedented score of 239.75 was driven by several key engineering successes:",
      "This historic achievement is a testament to the countless late nights, rigorous testing, and unwavering dedication of every single student engineer in the HSM Aries.space team.",
      "We want to extend our deepest gratitude to our faculty advisors, sponsors, and supporters. Your belief in our vision has empowered us to compete and win on a global stage."
    ]
  },
  {
    "slug": "watch-now-hsm-aries-space-releases-official-erc-2026-submission-video-for-leap-one",
    "title": "HSM Aries.space Releases Official ERC 2026 Submission Video for LEAP-One",
    "excerpt": "The journey to the European Rover Challenge (ERC) 2026 has reached an exciting new visual milestone! The HSM Aries.space team is thrilled to announce that our official 10-minute qualification video is now live on our YouTube channel. Showcasing Months of Engineering Getting to this stage required massive cross-departmental synchronization. After months of CAD design, late [&hellip;]",
    "publishedAt": "2026-05-31T15:31:00.000Z",
    "category": "Competition",
    "image": "/media/Thumbail-2-scaled.png",
    "imageAlt": "HSM Aries.space Releases Official ERC 2026 Submission Video for LEAP-One",
    "externalVideoUrl": "https://www.youtube.com/embed/8-6aMd6mBMg",
    "body": [
      "The journey to the European Rover Challenge (ERC) 2026 has reached an exciting new visual milestone! The HSM Aries.space team is thrilled to announce that our official 10-minute qualification video is now live on our YouTube channel.",
      "Getting to this stage required massive cross-departmental synchronization. After months of CAD design, late nights in the lab, rigorous PDR documentation, and extensive field testing, we are incredibly proud to finally share the LEAP-One Mars Rover in action with the world.",
      "The video provides a comprehensive breakdown of the core engineering and mission architecture behind our ERC 2026 entry.",
      "Key highlights featured in the video include:",
      "This submission represents a massive leap forward for our team and validates the hard work of every student engineer involved in the project. We want to extend a huge thank you to our university, sponsors, and supporters who have helped us reach this stage.",
      "Watch the full 10-minute qualification video below!"
    ]
  },
  {
    "slug": "state-leadership-aerospace-innovation-hsm-aries-space-shines-at-space-night-2026",
    "title": "State Leadership & Aerospace Innovation: HSM Aries.space Shines at Space Night 2026",
    "excerpt": "Jena, Germany ' On April 28th, the HSM Aries.space team had the distinct honor of representing Hochschule Schmalkalden at Space Night 2026. Organized by VESPE Jena e.V. and hosted at the Ernst-Abbe-Hochschule Jena, the event brought together leading organizations, industry experts, and innovators from across the aerospace sector. Showcasing Student-Led Engineering Exhibiting our technology alongside [&hellip;]",
    "publishedAt": "2026-04-28T16:39:13.000Z",
    "category": "Outreach",
    "image": "/media/DSC02769-scaled.jpg",
    "imageAlt": "State Leadership & Aerospace Innovation: HSM Aries.space Shines at Space Night 2026",
    "mediaDeck": [
      { "alt": "HSM Aries team with state leadership at Space Night 2026", "url": "/media/1777480994040.jpg" },
      { "alt": "Space Night 2026 aerospace exhibition", "url": "/media/DSC02822-scaled.jpg" },
      { "alt": "HSM Aries presenting at Space Night 2026", "url": "/media/DSC02818-scaled.jpg" },
      { "alt": "HSM Aries aerospace outreach conversation", "url": "/media/DSC02793-scaled.jpg" },
      { "alt": "HSM Aries rover and drone exhibition", "url": "/media/DSC02608-scaled.jpg" },
      { "alt": "Space Night 2026 exhibition crowd", "url": "/media/DSC02579-scaled.jpg" },
      { "alt": "LEAP-One on display at Space Night 2026", "url": "/media/DSC02577-scaled.jpg" }
    ],
    "body": [
      "Jena, Germany ' On April 28th, the HSM Aries.space team had the distinct honor of representing Hochschule Schmalkalden at Space Night 2026 . Organized by VESPE Jena e.V. and hosted at the Ernst-Abbe-Hochschule Jena, the event brought together leading organizations, industry experts, and innovators from across the aerospace sector.",
      "Exhibiting our technology alongside established aerospace pioneers was a significant milestone for our team. As a centerpiece of the exhibition, we proudly presented our flagship Mars rover, LEAP-One .",
      "Joining the rover on display was AQUILA , the advanced high-performance drone developed by our dedicated Drone Club. Showcasing both autonomous platforms demonstrated the comprehensive scope of our project to the wider aerospace community.",
      "A major highlight of the evening was the opportunity to present our engineering directly to state leadership. We were honored to discuss our progress and long-term vision with the following:",
      "We deeply appreciated their time. Our discussion with Minister-President Voigt was particularly motivating, and his genuine interest and encouraging feedback greatly validate our team's hard work.",
      "Furthermore, the event served as an exceptional platform for collaboration and knowledge exchange. Our engineers connected with industry experts from esteemed organizations, including:"
    ]
  },
  {
    "slug": "double-milestone-hsm-aries-space-submits-erc-2026-pdr-and-activates-unified-ground-station",
    "title": "Double Milestone: HSM Aries.space Submits ERC 2026 PDR and Activates Unified Ground Station",
    "excerpt": "Schmalkalden, Germany ' April has been a month of intense technical and operational synergy for HSM Aries.space. On April 27th, our team successfully reached two critical mission milestones simultaneously: the official submission of our Preliminary Design Review (PDR) and the complete hardware integration of our new Mission Ground Station. Milestone 1: Preliminary Design Review (PDR) [&hellip;]",
    "publishedAt": "2026-04-08T16:34:22.000Z",
    "category": "Competition",
    "image": "/media/Screenshot-2026-05-10-203543.png",
    "imageAlt": "Double Milestone: HSM Aries.space Submits ERC 2026 PDR and Activates Unified Ground Station",
    "body": [
      "Schmalkalden, Germany ' April has been a month of intense technical and operational synergy for HSM Aries.space . On April 27th, our team successfully reached two critical mission milestones simultaneously: the official submission of our Preliminary Design Review (PDR) and the complete hardware integration of our new Mission Ground Station .",
      "The road to the European Rover Challenge (ERC) 2026 requires absolute engineering precision. Our team officially submitted our PDR'a comprehensive, 100+ page technical document detailing every facet of the LEAP-One mission architecture.",
      "This document represents total team synchronization across all departments, featuring rigorous data on:",
      "Submitting the PDR is a major theoretical milestone, proving that our engineering concepts are competition-ready and peer-reviewable.",
      "While the documentation was finalized, the IT and Systems teams shifted their focus to the physical hardware, successfully integrating our centralized Mission Ground Station. This setup acts as the operational nervous system for the entire project.",
      "Key features of the newly activated Ground Station include:"
    ]
  },
  {
    "slug": "the-central-brain-is-online-leap-one-integrates-high-performance-computational-unit",
    "title": "The \"Central Brain\" is Online: LEAP-One Integrates High-Performance Computational Unit",
    "excerpt": "Schmalkalden, Germany ' The HSM Aries.space Systems Department has achieved a massive technological leap with the procurement and integration of the ASUS ROG NUC 15 Tall. As the new \"central brain\" of the LEAP-One Mars Rover, this unit provides the extreme computational throughput required for the next generation of planetary exploration. Desktop-Class Power in a [&hellip;]",
    "publishedAt": "2026-04-01T16:29:56.000Z",
    "category": "LEAP-One",
    "image": "/media/WhatsApp-Image-2026-05-10-at-20.29.43.jpeg",
    "imageAlt": "The \"Central Brain\" is Online: LEAP-One Integrates High-Performance Computational Unit",
    "body": [
      "Schmalkalden, Germany ' The HSM Aries.space Systems Department has achieved a massive technological leap with the procurement and integration of the ASUS ROG NUC 15 Tall . As the new \"central brain\" of the LEAP-One Mars Rover, this unit provides the extreme computational throughput required for the next generation of planetary exploration.",
      "The selection of the ROG NUC 15 (RNUC15JNK) was driven by the need for massive parallel processing at the edge. By utilizing the NVIDIA GeForce RTX 5080 , LEAP-One now possesses thousands of CUDA cores , allowing for near-instantaneous processing of complex environmental data.",
      "Key Hardware Specifications:",
      "Beyond raw hardware specs, this unit provides native support for OpenClaw and the Hermes Agent . These tools allow our software team to implement sophisticated AI orchestration, enabling the rover to manage subsystems autonomously and react to environmental hazards in milliseconds.",
      "With the ROG NUC 15 now fully integrated, the LEAP-One mission is moving into its most ambitious phase. We are no longer simply navigating; we are perceiving. This unit enables the rover to map its surroundings in high-fidelity 3D, identify scientific targets of interest, and chart paths through treacherous terrain'all without human intervention.",
      "This investment secures our position as a leader in student-led robotics and provides the stable, high-performance foundation required for th e ERC 2026 competition."
    ]
  },
  {
    "slug": "taking-flight-aquila-drone-proves-stability-in-real-world-manual-flight-trials",
    "title": "Taking Flight: AQUILA Drone Proves Stability in Real-World Manual Flight Trials",
    "excerpt": "Schmalkalden, Germany ' Following our successful assembly phase in January, the HSM Aries.space Drone Department officially moved from the laboratory to the field. Our latest UAV, AQUILA, underwent rigorous manual flight testing to evaluate its aerodynamic stability and responsiveness under real-world wind conditions. Pilot Evaluation: Precision & Power The primary objective of this session was [&hellip;]",
    "publishedAt": "2026-03-17T17:23:19.000Z",
    "category": "Astroflight",
    "image": "/media/WhatsApp-Image-2026-05-10-at-19.49.12-1.jpeg",
    "imageAlt": "Taking Flight: AQUILA Drone Proves Stability in Real-World Manual Flight Trials",
    "body": [
      "Schmalkalden, Germany ' Following our successful assembly phase in January, the HSM Aries.space Drone Department officially moved from the laboratory to the field. Our latest UAV, AQUILA , underwent rigorous manual flight testing to evaluate its aerodynamic stability and responsiveness under real-world wind conditions.",
      "The primary objective of this session was to assess how the craft translates pilot inputs into physical movement. Our lead pilot executed a complex flight plan, including high-speed passes, vertical climbs, and precision hovering.",
      "Key performance takeaways from the field:",
      "While the flight was a resounding success, our high-speed descent tests revealed a slight oscillation. This is a common challenge in high-performance UAV engineering. Our software team is already addressing this by fine-tuning the PID (Proportional-Integral-Derivative) values within the flight controller to ensure perfectly smooth descents in future missions.",
      "The success of these manual trials marks a major transition for the AQUILA project. With full confidence in our hardware's physical flight characteristics, we are now moving toward semi-autonomous flight modes .",
      "Our next phase will integrate onboard sensors for:"
    ]
  },
  {
    "slug": "multi-terrain-mastery-leap-one-rover-aces-mobility-tests-for-erc-2026-and-icarm-publication",
    "title": "Multi-Terrain Mastery: LEAP-One Rover Aces Mobility Tests for ERC 2026 and ICARM Publication",
    "excerpt": "Schmalkalden, Germany ' The Rover Department at HSM Aries.space recently conducted a comprehensive field testing session to evaluate our LEAP-One mobility platform. This rigorous test served a critical dual purpose: validating our chassis for the upcoming European Rover Challenge (ERC) 2026, and capturing empirical mobility data for our upcoming peer-reviewed publication. The data gathered during [&hellip;]",
    "publishedAt": "2026-02-25T17:15:37.000Z",
    "category": "Competition",
    "image": "/media/WhatsApp-Image-2026-05-10-at-19.49.07.jpeg",
    "imageAlt": "Multi-Terrain Mastery: LEAP-One Rover Aces Mobility Tests for ERC 2026 and ICARM Publication",
    "body": [
      "Schmalkalden, Germany ' The Rover Department at HSM Aries.space recently conducted a comprehensive field testing session to evaluate our LEAP-One mobility platform. This rigorous test served a critical dual purpose: validating our chassis for the upcoming European Rover Challenge (ERC) 2026 , and capturing empirical mobility data for our upcoming peer-reviewed publication.",
      "The data gathered during these trials will directly support our upcoming ICARM 2026 paper:",
      "\"Hierarchical Mars Surface Exploration with LEAP-One: A Compact Rover for Fast Reconnaissance and Subsurface Validation.\"",
      "To simulate the harsh, unpredictable surfaces of a planetary mission site, the engineering team subjected the rover to gravel, loose sand, steep inclines, and muddy terrain. The primary objective was to validate our custom suspension geometry and traction control algorithms under high-stress conditions.",
      "Key performance highlights from the field test:",
      "The field test concluded with zero mechanical failures. The rigorous environment did highlight a minor need for improved dust sealing around the drive gears'an essential refinement for long-term survival in dusty Martian or lunar environments, which the team is already addressing."
    ]
  },
  {
    "slug": "subsurface-sampling-success-hsm-aries-space-prepares-for-icarm-2026-publication",
    "title": "Subsurface Sampling Success: HSM Aries.space Prepares for ICARM 2026 Publication",
    "excerpt": "Schmalkalden, Germany ' The Drill Department at HSM Aries.space has successfully concluded an intensive series of subsurface sampling tests. This critical milestone was designed to gather empirical data for our upcoming peer-reviewed research paper, which will be presented at ICARM 2026 (International Conference on Advanced Robotics and Mechatronics). Our upcoming publication is titled: \"Hierarchical Mars [&hellip;]",
    "publishedAt": "2026-02-19T17:12:50.000Z",
    "category": "Research",
    "image": "/media/WhatsApp-Image-2026-05-10-at-19.49.06.jpeg",
    "imageAlt": "Subsurface Sampling Success: HSM Aries.space Prepares for ICARM 2026 Publication",
    "body": [
      "Schmalkalden, Germany ' The Drill Department at HSM Aries.space has successfully concluded an intensive series of subsurface sampling tests. This critical milestone was designed to gather empirical data for our upcoming peer-reviewed research paper, which will be presented at ICARM 2026 (International Conference on Advanced Robotics and Mechatronics).",
      "Our upcoming publication is titled:",
      "\"Hierarchical Mars Surface Exploration with LEAP-One: A Compact Rover for Fast Reconnaissance and Subsurface Validation.\"",
      "The primary focus of this testing phase was to evaluate the efficiency of our custom auger design when operating in various regolith simulants . To achieve this, the engineering team established a highly controlled testing environment to measure critical performance metrics during deep-core penetration.",
      "Key elements of the testing setup included:",
      "Throughout the afternoon, the team successfully extracted ten pristine core samples . Each sample was meticulously documented and sealed for further laboratory analysis."
    ]
  },
  {
    "slug": "hardware-milestone-hsm-aries-space-successfully-assembles-latest-high-performance-flight-unit",
    "title": "Hardware Milestone: HSM Aries.space Successfully Assembles Latest High-Performance Flight Unit",
    "excerpt": "Schmalkalden, Germany ' The Drone Department of HSM Aries.space has reached a major hardware milestone. Our engineering team completed the assembly of our latest flight unit, marking the transition from months of CAD design and prototyping to a physical, flight-ready system. Precision Engineering & Meticulous Integration The assembly process centered on the integration of a [&hellip;]",
    "publishedAt": "2026-01-24T17:04:15.000Z",
    "category": "Astroflight",
    "image": "/media/WhatsApp-Image-2026-05-10-at-19.49.05.jpeg",
    "imageAlt": "Hardware Milestone: HSM Aries.space Successfully Assembles Latest High-Performance Flight Unit",
    "mediaDeck": [
      { "alt": "LEAP-One assembly progress", "url": "/media/WhatsApp-Image-2026-05-10-at-19.49.04.jpeg" },
      { "alt": "LEAP-One hardware integration", "url": "/media/WhatsApp-Image-2026-05-10-at-19.49.03.jpeg" },
      { "alt": "LEAP-One field-ready hardware detail", "url": "/media/WhatsApp-Image-2026-05-10-at-19.49.02.jpeg" }
    ],
    "body": [
      "Schmalkalden, Germany ' The Drone Department of HSM Aries.space has reached a major hardware milestone. Our engineering team completed the assembly of our latest flight unit, marking the transition from months of CAD design and prototyping to a physical, flight-ready system.",
      "The assembly process centered on the integration of a lightweight carbon fiber frame with custom-designed motor mounts and advanced flight controllers. To ensure maximum reliability, the team conducted a rigorous inspection of every component before the build began.",
      "Technical highlights of the assembly include:",
      "This flight unit represents the culmination of extensive research into UAV aerodynamics and structural integrity. By updating the firmware to the latest stable release, the team has ensured the hardware is fully optimized for our upcoming mission parameters.",
      "With the physical build complete, the team is moving immediately into the static testing phase . Our primary objective is to measure thrust-to-weight ratios and validate our propulsion efficiency. These tests are vital for ensuring the drone meets the high-performance standards required for the AQUILA project and beyond."
    ]
  },
  {
    "slug": "field-test-update-manual-joystick-control-on-multiple-terrains",
    "title": "Field Test Update: Manual Joystick Control on Multiple Terrains",
    "excerpt": "Today, we conducted a field test of our rover using only manual control through a handheld joystick. The purpose of this session was to evaluate how well the rover performs when directly driven by an operator'no autonomous navigation, just pure manual handling. We tested the rover across a variety of terrains, including gravel paths, paved [&hellip;]",
    "publishedAt": "2025-11-24T13:13:51.000Z",
    "category": "LEAP-One",
    "image": "/media/rover-isometric-1-scaled.png",
    "imageAlt": "Field Test Update: Manual Joystick Control on Multiple Terrains",
    "featuredVideo": {
      "alt": "LEAP-One manual joystick field test",
      "mimeType": "video/mp4",
      "url": "/media/c0576.mp4"
    },
    "body": [
      "Today, we conducted a field test of our rover using only manual control through a handheld joystick. The purpose of this session was to evaluate how well the rover performs when directly driven by an operator'no autonomous navigation, just pure manual handling.",
      "We tested the rover across a variety of terrains, including gravel paths, paved roads, uphill sections, and muddy ground. On each surface, the rover responded smoothly to joystick inputs, maintaining good traction and stability. The control system exhibited no lag, enabling precise movements and easy handling, even on uneven or slippery surfaces.",
      "Despite the challenging conditions, the rover held up extremely well. Its mechanical components performed consistently, and the chassis remained sturdy throughout the entire test. No issues were observed in the motors, wheels, or control link, confirming that the rover is reliable for manual field operations.",
      "Overall, this session was a success. The rover performed exactly as expected under manual control, proving its durability and responsiveness across different terrain types. Additional testing will follow as we continue to refine the system and prepare for future upgrades."
    ]
  },
  {
    "slug": "industry-outreach-hsm-aries-space-explores-the-future-of-aerospace-at-space-tech-expo-bremen-2025",
    "title": "Industry Outreach: HSM Aries.space Explores the Future of Aerospace at Space Tech Expo Bremen 2025",
    "excerpt": "Bremen – In a major step for our industry outreach and project development, a delegation from the HSM ARIES LEAP-One Mars Rover team recently traveled to Bremen to attend the Space Tech Expo 2025. As one of Europe's largest and most prestigious gatherings for the global space industry, the expo featured over 950 exhibitors showcasing [&hellip;]",
    "publishedAt": "2025-11-18T14:57:00.000Z",
    "category": "Outreach",
    "image": "/media/WhatsApp-Image-2026-05-10-at-19.48.57-4.jpeg",
    "imageAlt": "Industry Outreach: HSM Aries.space Explores the Future of Aerospace at Space Tech Expo Bremen 2025",
    "mediaDeck": [
      { "alt": "HSM Aries delegation at Space Tech Expo Bremen 2025", "url": "/media/WhatsApp-Image-2026-05-10-at-19.48.57-1.jpeg" },
      { "alt": "Space technology exhibition in Bremen", "url": "/media/WhatsApp-Image-2026-05-10-at-19.48.59.jpeg" },
      { "alt": "HSM Aries industry outreach at Space Tech Expo", "url": "/media/WhatsApp-Image-2026-05-10-at-19.49.00.jpeg" },
      { "alt": "Aerospace technology display at Space Tech Expo Bremen", "url": "/media/WhatsApp-Image-2026-05-10-at-19.48.58.jpeg" },
      { "alt": "HSM Aries meeting aerospace organizations in Bremen", "url": "/media/WhatsApp-Image-2026-05-10-at-19.48.57-3.jpeg" },
      { "alt": "HSM Aries team at Space Tech Expo Bremen", "url": "/media/WhatsApp-Image-2026-05-10-at-19.48.57-2.jpeg" }
    ],
    "body": [
      "Bremen – In a major step for our industry outreach and project development, a delegation from the HSM ARIES LEAP-One Mars Rover team recently traveled to Bremen to attend the Space Tech Expo 2025 . As one of Europe's largest and most prestigious gatherings for the global space industry, the expo featured over 950 exhibitors showcasing everything from next-generation space stations to cutting-edge propulsion systems.",
      "For our team, this event was much more than an educational trip- it was a strategic mission to place Aries LEAP-One on the map, benchmark our designs against industry standards, and secure vital partnerships for the future.",
      "The project was proudly represented by our core student leadership team:",
      "This journey was made possible by the dedication of our Research Assistants, Swaraj Tendulkar and Niranjan Ramesha , who secured our attendance and provided invaluable guidance throughout the event.",
      "Throughout the exhibition, our team was highly active, engaging with representatives from global aerospace giants and specialized startups. Our primary objectives included:",
      "Sharing our project website and technical vision with industry experts opened doors for future collaborations. By the end of the expo, the team had gathered a wealth of technical documentation and forged preliminary agreements for technical consultations."
    ]
  },
  {
    "slug": "innovation-in-focus-thuringias-minister-of-science-christian-tischner-visits-hsm-aries-space",
    "title": "Innovation in Focus: Thuringia's Minister of Science, Christian Tischner, Visits HSM Aries.space",
    "excerpt": "We were honored to welcome Thuringia's Minister of Science, Christian Tischner, to Hochschule Schmalkalden this past Friday. The visit provided a high-profile platform to showcase the university's interdisciplinary research and its commitment to fostering the next generation of STEM innovators. Hands-on Research: The Mars Rover in Action The highlight of the minister's tour was a [&hellip;]",
    "publishedAt": "2025-11-17T16:51:00.000Z",
    "category": "Outreach",
    "image": "/media/WhatsApp-Image-2026-05-10-at-19.48.57.jpeg",
    "imageAlt": "Innovation in Focus: Thuringia's Minister of Science, Christian Tischner, Visits HSM Aries.space",
    "body": [
      "We were honored to welcome Thuringia's Minister of Science, Christian Tischner , to Hochschule Schmalkalden this past Friday. The visit provided a high-profile platform to showcase the university's interdisciplinary research and its commitment to fostering the next generation of STEM innovators.",
      "The highlight of the minister's tour was a visit to the robotics laboratory. Guided by Prof. Frank Schr'del and the HSM Aries.space team, Minister Tischner was introduced to our current flagship project , the' LEAP-One Mars Rover 'model, which f eatures a sophisticated integrated manipulator system.",
      "In a vivid demonstration of the practical synergy between research and teaching, the minister didn't just observe, he took the controls. Minister Tischner personally activated the rover for a test drive, experiencing firsthand the precision engineering and robotics expertise developed here at Hochschule Schmalkalden.",
      "\"The visit showed how consistently the university promotes young scientists – from early STEM enthusiasm to the processing of research projects at the highest levels.",
      "For HSM Aries.space , this visit reinforces the importance of our mission. By bridging the gap between academic theory and industrial application, we are not just building robots- we are contributing to a sustainable, high-tech future for Thuringia.",
      "We want to thank Minister Tischner for his genuine interest and the encouraging discussions regarding our vision for the LEAP-One project. The momentum from this visit will continue to drive our team as we push the boundaries of what student-led aerospace engineering can achieve."
    ]
  },
  {
    "slug": "first-motion-milestone-six-wheel-drive-system-comes-to-life",
    "title": "First Motion Milestone: Six-Wheel Drive System Comes to Life!",
    "excerpt": "The HSM Aries Space team has reached another major milestone on our rover's journey from concept to reality! This week, our team successfully tested the CAN adapter with six ODrives using ROS commands ' achieving full calibration and coordinated motion for all six wheels for the very first time. The integration marks a crucial step [&hellip;]",
    "publishedAt": "2025-10-27T10:25:21.000Z",
    "category": "Hardware",
    "image": "/media/img_8789-scaled.jpg",
    "imageAlt": "First Motion Milestone: Six-Wheel Drive System Comes to Life!",
    "body": [
      "This week, our team successfully tested the CAN adapter with six ODrives using ROS commands ' achieving full calibration and coordinated motion for all six wheels for the very first time .",
      "The integration marks a crucial step toward validating the rover's drivetrain and control architecture, proving the seamless communication between hardware and software subsystems.",
      "This achievement was led by Harsha Gottimukkala (Team Lead) , with critical contributions from Ayan (Electronics Lead) and Omar (Software Team) ' who successfully executed the first motion control sequence that brought the rover's wheels to life.",
      "Moments like these remind us how collaboration and persistence transform complex systems into tangible progress. The rover is rolling forward ' literally and figuratively! ??",
      "#RoverMotion #SpaceTech #EngineeringProgress #ROS #ODrive #HSMAriesSpace #Teamwork #Milestone"
    ]
  },
  {
    "slug": "first-publication-submitted-to-icra-2026",
    "title": "First publication submitted to ICRA 2026",
    "excerpt": "Team Submits Paper to ICRA 2026. LEAPOne rover concept enters the global'robotics'stage.",
    "publishedAt": "2025-09-14T16:06:02.000Z",
    "category": "Research",
    "image": "/media/screenshot-2025-09-14-200225.png",
    "imageAlt": "First publication submitted to ICRA 2026",
    "body": [
      "Team Submits Paper to ICRA 2026. LEAPOne rover concept enters the global'robotics'stage."
    ]
  },
  {
    "slug": "from-vision-to-machine-rover-fully-assembled",
    "title": "From Vision to Machine: Rover Fully Assembled",
    "excerpt": "LEAP-ONE is now fully manufactured and assembled'precision parts from Boehm Group and final 3D-printed wheels complete the platform. After months of design and testing, the rover moves from concept to mission-ready hardware. The team prepares for dynamic trials to validate performance, durability, and payload integration.",
    "publishedAt": "2025-09-09T14:39:20.000Z",
    "category": "LEAP-One",
    "image": "/media/sirleloimage.png",
    "imageAlt": "From Vision to Machine: Rover Fully Assembled",
    "body": [
      "A fusion of student innovation and industry support, now ready for trials.",
      "The journey from design to reality has reached a thrilling milestone'our rover is now fully manufactured and assembled. With precision-fabricated components from Boehm Group GmbH and the finalized 3D-printed wheels securely in place, the rover is standing as a complete system for the first time.",
      "This achievement reflects months of design work, testing, and collaboration, culminating in a platform that is both robust and mission-ready. The rover is no longer just a concept'it's a tangible machine, ready to roar into testing and exploration.",
      "As we move into the next phase of dynamic trials, the team is excited to push the rover to its limits and showcase the combined power of student innovation and industry support."
    ]
  },
  {
    "slug": "welcoming-fresh-talent-10-new-members-join-the-rover-team",
    "title": "Welcoming Fresh Talent: New Members Joins the Rover Team",
    "excerpt": "After a competitive selection process, HSMAries welcomed 10 new members to the rover team. Carefully shortlisted from strong applicants, these student engineers bring mechanical, electrical and software skills, fresh perspectives, and a 30-day action focus to speed the LEAP-ONE project from bench to field.",
    "publishedAt": "2025-09-08T14:44:10.000Z",
    "category": "LEAP-One",
    "image": "/media/presentation-01.jpg",
    "imageAlt": "Welcoming Fresh Talent: New Members Joins the Rover Team",
    "body": [
      "From applications to interviews, a rigorous selection brings new energy on board.",
      "Our team has taken another important step toward strengthening its foundation for the challenges ahead'welcoming 10 new members into the rover project.",
      "The recruitment process began with an open call for applications shared across social media platforms. The response was overwhelming, with many enthusiastic students eager to contribute their skills to the mission. To help candidates better understand the scope of the project, we conducted an introductory briefing session outlining our rover's objectives, current progress, and future roadmap.",
      "Following this, shortlisted candidates were invited for interviews designed to evaluate their technical knowledge, problem-solving skills, and commitment. After multiple rounds of careful review and discussion, the team finalized 'th e outstanding individuals who will now be part of our journey.",
      "This new wave of talent brings diverse expertise and fresh perspectives, ensuring the rover project continues to grow stronger with every phase. With our expanded team, we are more prepared than ever to innovate, collaborate, and push the boundaries of what student-led engineering can achieve."
    ]
  },
  {
    "slug": "shaping-the-path-ahead-final-rover-wheels-3d-printed-after-iterations-and-team-discussions",
    "title": "Shaping the Path Ahead: Final Rover Wheels 3D-Printed After Iterations and Team Discussions",
    "excerpt": "After multiple iterations and load tests, the team finalized the LEAP-ONE wheel design. Test prints proved traction and durability; Vighnesh then produced the final 3D-printed wheels. This marks a critical mobility milestone as the rover prepares for field trials, with a robust wheelset ready to handle rough terrain and real-world testing.",
    "publishedAt": "2025-09-05T14:35:02.000Z",
    "category": "Hardware",
    "image": "/media/3d-tyre-scaled.jpg",
    "imageAlt": "Shaping the Path Ahead: Final Rover Wheels 3D-Printed After Iterations and Team Discussions",
    "body": [
      "Vighnesh leads the print effort, turning design debates into a ready-to-roll reality",
      "Another exciting milestone has been reached as our team finalized the design of the rover's wheels. After multiple design iterations and in-depth discussions within the team, the final model has been locked in.",
      "To validate our approach, we produced test wheels that allowed us to assess performance under load and refine critical details. With those insights, Vighnesh successfully produced the finalized wheels, marking a key step toward completing the rover's mobility system.",
      "This achievement highlights not only the technical precision behind our design process but also the creativity and adaptability that 3D printing enables. The rover now has its foundation for navigating upcoming field trials'ready to roll into the next phase of development."
    ]
  },
  {
    "slug": "powering-up-rover-electronics-successfully-tested",
    "title": "Powering Up: Rover Electronics Successfully Tested",
    "excerpt": "Under Harsha and electrical lead Ayan, the team validated ODrive S1 motor controllers, hub motors, battery modules, relays, and the emergency stop system. Early trials showed smooth motor response and stable power delivery. With safety systems confirmed, the rover moves into dynamic testing where control, power, and fail-safes will be stress-tested for field readiness.",
    "publishedAt": "2025-08-04T11:29:00.000Z",
    "category": "LEAP-One",
    "image": "/media/testing.jpg",
    "imageAlt": "Powering Up: Rover Electronics Successfully Tested",
    "body": [
      "From motors to safety systems, the heart of the rover is coming online.",
      "Our rover project has entered an exciting new phase as the team begins testing the core electronic systems. Team lead Harsha and electrical lead Ayan , under the guidance of our university mentor Prashanth , are spearheading the validation of key components'including the Odrive S1 motor controllers, hub motors, battery modules, relays, and the emergency stop system'to ensure performance, reliability, and safety.",
      "Early trials have already demonstrated smooth motor response and stable power delivery, while the successful activation of the emergency stop confirms our critical safety measures are fully operational. Each test brings us closer to a fully integrated rover, transforming it from a mechanical framework into a responsive, mobile system.",
      "This milestone marks the beginning of dynamic testing, where power, control, and safety converge to prepare the rover for its first real-world field trials."
    ]
  },
  {
    "slug": "building-the-future-boehm-company-joins-forces-with-students-for-rover-innovation",
    "title": "Building the Future: Boehm Company Joins Forces with Students for Rover Innovation",
    "excerpt": "Boehm Group GmbH in Zella-Mehlis sponsors materials and machining for the LEAP-ONE rover, providing professional-grade fabrication and hands-on mentorship. This industry collaboration accelerates prototype durability and assembly, lets students learn industry processes, and helps the team document build steps as parts move toward integration and upcoming field tests.",
    "publishedAt": "2025-07-31T14:23:22.000Z",
    "category": "Hardware",
    "image": "/media/boehm-manufacturing-1.jpg",
    "imageAlt": "Building the Future: Boehm Company Joins Forces with Students for Rover Innovation",
    "body": [
      "Advancing Rover Innovation with Industry Support",
      "We are excited to share a major milestone in our project: the fabrication and machining of our rover components is now underway, thanks to the generous support of Boehm Group GmbH in Zella-Mehlis.",
      "Boehm Group GmbH has sponsored the materials and machining process, enabling us to bring our rover design from concept to reality with professional-grade precision. Their expertise in high-quality fabrication is helping us achieve the durability and performance needed for cutting-edge space exploration prototypes.",
      "This collaboration marks an important step in our journey. With Boehm's backing, our team can focus on integrating advanced engineering solutions while learning from industry-standard processes. From structural parts to complex assemblies, the rover is taking shape'piece by piece'through the shared commitment of students and professionals alike.",
      "Stay tuned as we continue documenting the build process, highlight behind-the-scenes insights from the workshop, and move closer to field testing our rover. This partnership reflects the spirit of innovation and community that drives our mission forward.",
      "Together with Boehm Company, we're not just building a rover'we're building the future of student-driven space exploration."
    ]
  },
  {
    "slug": "boehm-group-gmbh-joins-forces-with-our-team-to-advance-rover-development",
    "title": "Our Pitch Succeeds: Boehm Group GmbH Joins as Rover Manufacturing Sponsor",
    "excerpt": "After a successful pitch at Boehm Group GmbH in Zella-Mehlis, Boehm agreed to sponsor materials and machining for the LEAP-ONE rover. This sponsorship validates our design and brings professional fabrication capacity to the project, letting the team move from prototype parts to precision-manufactured assemblies and accelerate toward integration and field testing.",
    "publishedAt": "2025-05-09T09:18:00.000Z",
    "category": "Hardware",
    "image": "/media/pitching-in-boehm-scaled.jpg",
    "imageAlt": "Our Pitch Succeeds: Boehm Group GmbH Joins as Rover Manufacturing Sponsor",
    "body": [
      "Partnership Secured: Boehm Group GmbH to Support Rover Manufacturing",
      "In an important step toward realizing our rover, the team recently visited Boehm Group GmbH in Zella-Mehlis to present our project and pitch for manufacturing support. During the presentation, we outlined the rover's design, the technical challenges, and the materials required for fabrication.",
      "The pitch was met with strong enthusiasm, and we are proud to share that Boehm has agreed to sponsor both the materials and machining processes needed for manufacturing. This positive outcome reflects not only the strength of our design but also the dedication of our team to effectively communicating our vision.",
      "We extend our sincere thanks to Boehm Group GmbH for their trust and support. With this partnership in place, we are well-prepared to move forward into the next phase of rover development."
    ]
  },
  {
    "slug": "final-structural-design-ready-for-fabrication",
    "title": "Design Complete: Rover Structure Ready for Manufacturing",
    "excerpt": "After months of prototyping and iteration, the team has finalized the rover's structural design'optimised for strength, weight, and manufacturability. With designs signed off, parts will move to precision machining at Boehm Group in Zella-Mehlis. This milestone moves the project from CAD into physical production and assembly.",
    "publishedAt": "2025-04-28T20:10:00.000Z",
    "category": "Hardware",
    "image": "/media/01.jpg",
    "imageAlt": "Design Complete: Rover Structure Ready for Manufacturing",
    "body": [
      "After months of brainstorming, prototyping, and multiple design iterations, our team has successfully finalized the rover's structural design. This marks a critical milestone, as every component has been carefully refined to balance strength, weight, and manufacturability.",
      "With the design phase now complete, the rover is officially ready for fabrication at Boehm Group GmBHCompany in Zella-Mehlis, where industry-grade machining will bring our digital models to life. This transition from virtual design to physical production is a defining moment'turning concepts into real components that will form the backbone of our rover.",
      "The final design reflects not only technical precision but also the collaborative spirit of our team, laying the groundwork for the next stage of manufacturing and assembly."
    ]
  },
  {
    "slug": "aries-space-website-development-kicks-off",
    "title": "Aries.space Website Development Kicks Off",
    "excerpt": "Development of the Aries.space website is underway. The new digital hub will showcase HSMAries projects (including the LEAP Series), publish mission updates, and host resources for students and collaborators. Expect behind-the-scenes content, progress reports, and a user-friendly launch that brings our student-driven space work into one public home.",
    "publishedAt": "2025-03-16T13:00:26.000Z",
    "category": "LEAP-One",
    "image": "/media/whatsapp-image-2025-03-17-at-4.05.48-pm.jpeg",
    "imageAlt": "Aries.space Website Development Kicks Off",
    "body": [
      "Building a Digital Hub for Student-Driven Space Exploration",
      "We are thrilled to announce that the development of the Aries.space website is now underway. As the digital gateway for our student-led space club, HSMaries.space (commonly known as Aries.space), our new site will showcase our innovative projects, including the flagship LEAP Series, share our mission, and provide a platform for collaboration and updates.",
      "Our team is hard at work crafting an engaging, user-friendly platform that highlights our journey'from breakthrough rover designs to pioneering research'and offers exclusive behind-the-scenes insights into our progress. Stay tuned for sneak peeks, progress updates, and the official launch date as we build a digital home for the future of student-led space exploration.",
      "Join us on this exciting new venture as we bring Aries.space online and continue to push the boundaries of what's possible in aerospace innovation."
    ]
  },
  {
    "slug": "leap-one-rover-selected-for-erc-2025-2",
    "title": "LEAP-ONE Rover Selected for ERC 2025",
    "excerpt": "LEAP-ONE has been selected for the European Rover Challenge 2025. This honor puts HSMAries on an international stage to test autonomy, sampling systems, and a modular chassis under competition conditions. Over the coming months we'll intensify field tests, refine systems, and publish behind-the-scenes updates as we prepare to represent Hochschule Schmalkalden.",
    "publishedAt": "2025-03-13T04:46:16.000Z",
    "category": "Competition",
    "image": "/media/mars-rover-render2.png",
    "imageAlt": "LEAP-ONE Rover Selected for ERC 2025",
    "body": [
      "We're thrilled to share some exciting news: LEAP-ONE , our flagship rover at HSMaries.space (Aries.space), has been officially selected to compete in the European Rover Challenge (ERC) 2025 . As one of Europe's premier events for next-generation space robotics, ERC brings together top student teams from around the globe to test their designs against rigorous planetary exploration tasks.",
      "What's Next: Over the coming months, we'll be refining LEAP-ONE's capabilities, running intensive field tests, and sharing behind-the-scenes progress on our blog. We can't wait to represent the future of student-led space exploration at ERC 2025' stay tuned for more updates on our mission!"
    ]
  },
  {
    "slug": "leap-one-final-render-revealed",
    "title": "Final Render of LEAP-One Unveiled by the Team",
    "excerpt": "HSMAries has released the final high-fidelity render of LEAP-ONE, showcasing the modular chassis, integrated sensors, and drive architecture developed after months of iteration. The image marks a design milestone ahead of subsystem integration and ERC 2025 preparations. With visuals public, the team now focuses on integration, testing, and field readiness.",
    "publishedAt": "2025-03-09T12:40:53.000Z",
    "category": "LEAP-One",
    "image": "/media/mars-rover-leap-one-1.png",
    "imageAlt": "Final Render of LEAP-One Unveiled by the Team",
    "body": [
      "The Vision Takes Shape as Our Flagship Rover's Design is Revealed",
      "We are excited to announce that the final render of our LEAP-One rover has been made public by the HSMaries.space team. This stunning visual represents the culmination of months of rigorous design, iterative testing, and dedicated teamwork. The render highlights the rover's sleek, modular chassis, advanced sensor integration, and innovative drive system'all engineered to excel in planetary exploration scenarios.",
      "'Our final render is more than just an image'it's the embodiment of our collective passion and hard work,' said Teja. 'Each detail reflects our commitment to pushing the boundaries of student-led space innovation and serves as a glimpse into the future of off-world exploration.'",
      "With the LEAP-One design now unveiled, the team is eager to move into the next phase: integrating subsystems and preparing for intensive testing ahead of ERC 2025. Stay tuned as we continue our journey from vision to reality, and join us as we pave the way for the next generation of space exploration."
    ]
  },
  {
    "slug": "robotic-arm-design-completed",
    "title": "Initial Robotic Arm Design Completed by Mechanical Lead Teja",
    "excerpt": "Mechanical lead Teja completed the initial robotic arm design for LEAP-ONE: a multi-jointed manipulator with an adaptive gripper engineered for sample collection and maintenance. Optimized for durability and precision, the design will now be integrated with rover subsystems and undergo rigorous testing to validate dexterity, payload handling, and resilience in field conditions.",
    "publishedAt": "2025-03-03T11:08:23.000Z",
    "category": "LEAP-One",
    "image": "/media/whatsapp-image-2025-03-03-at-12.08.33-pm.jpeg",
    "imageAlt": "Initial Robotic Arm Design Completed by Mechanical Lead Teja",
    "body": [
      "Advancing Precision in Sample Collection and Manipulation",
      "We are excited to announce that our mechanical lead, Teja, has completed the initial design of the robotic arm for the LEAP-One rover. This critical milestone marks a significant step forward in our mission to equip the rover with versatile and precise manipulation capabilities essential for off-world exploration.",
      "Teja's innovative design features a multi-jointed arm equipped with an adaptive gripper, engineered to handle a variety of tasks'from delicate sample collection to robust maintenance operations. The design is optimized for both functionality and efficiency, ensuring that the arm can operate reliably under the challenging conditions expected in planetary environments.",
      "\"Completing the initial robotic arm design is a major achievement for our team,\" said Teja. \"This design not only embodies our commitment to pushing the boundaries of student-led innovation but also sets the stage for further refinements and rigorous testing. Our goal is to provide LEAP-One with the dexterity and resilience needed to execute its scientific missions successfully.\"",
      "With this milestone reached, our focus now shifts to integrating the robotic arm with the rest of the rover's subsystems and initiating comprehensive testing protocols. Stay tuned for more updates as we continue to transform our vision into a mission-ready reality, paving the way for groundbreaking advancements in space exploration."
    ]
  },
  {
    "slug": "drill-mechanism-design-completed",
    "title": "Drill Mechanism Design Completed by Danny",
    "excerpt": "Mechanical lead Danny completed the LEAP-ONE drill mechanism: a telescopic solid-auger design with dual-motor drilling and rotation capable of extracting soil samples beyond 30 cm. The design emphasizes reliability and precision for varied terrains. With the mechanism finalized, the team proceeds to subsystem integration and upcoming testing to validate deep-sampling performance.",
    "publishedAt": "2025-03-02T07:40:33.000Z",
    "category": "LEAP-One",
    "image": "/media/whatsapp-image-2025-03-02-at-8.41.38-pm.jpeg",
    "imageAlt": "Drill Mechanism Design Completed by Danny",
    "body": [
      "Paving the Way for Deep Sampling Capabilities on LEAP-One",
      "We are excited to announce that the drill mechanism design for LEAP-One has been successfully completed by Danny, a key innovator in our HSMaries.space team. This milestone marks a significant step forward in developing a robust system capable of deep-sampling and in-situ analysis'essential for tackling the scientific challenges of planetary exploration.",
      "The newly finalized design features a telescopic, solid auger drill engineered to extract soil samples from depths exceeding 30 cm. With its innovative integration of dual motor functions for both drilling and rotation, the mechanism promises precise, efficient operation under extreme conditions. Danny's design emphasizes reliability and adaptability, ensuring that LEAP-One can gather crucial data from varied terrain types.",
      "\"Completing the drill mechanism is a major achievement,\" said Danny. \"It not only validates our design approach but also reinforces our commitment to student-led innovation in space exploration. I'm proud to contribute a solution that will help unlock the secrets hidden beneath planetary surfaces.\"",
      "With the drill mechanism design now complete, the team is set to move into the integration phase, where this critical component will be assembled with the rest of LEAP-One's subsystems. Stay tuned for more updates as we continue to transform our vision into reality and prepare for upcoming testing and mission challenges."
    ]
  },
  {
    "slug": "electronic-bay-design-completed",
    "title": "LEAP-One Electronic Bay Design Successfully Completed",
    "excerpt": "Electronic bay design for LEAP-ONE completed, providing modular integration for power management, sensors, comms and control. The layout improves wiring, thermal management, and future upgrades. With design finalized under mentor KK Achari's guidance, the team will now begin integration testing and prototyping to validate system performance ahead of field trials.",
    "publishedAt": "2025-02-25T13:16:18.000Z",
    "category": "LEAP-One",
    "image": "/media/whatsapp-image-2025-02-23-at-1.45.42-pm.jpeg",
    "imageAlt": "LEAP-One Electronic Bay Design Successfully Completed",
    "body": [
      "Advancing the Integration of Critical Systems for Space Exploration",
      "We are excited to announce that the electronic bay design for LEAP-One has been successfully completed'a key milestone in our mission to push the boundaries of planetary exploration.",
      "The new electronic bay streamlines the integration of vital subsystems, including power management, sensor arrays, communication modules, and control circuitry. Its modular layout enhances internal wiring efficiency, thermal management, and future upgradability, ensuring that LEAP-One remains adaptable to a range of mission requirements.",
      "\"Completing the electronic bay design is a major achievement for our team,\" said KK Achari on of the teams mentors. \"It not only brings together the core operational systems of our rover but also sets a solid foundation for the upcoming integration and testing phases. Our innovative approach and collaborative effort have been crucial in reaching this milestone.\"",
      "With the electronic bay design finalized, our focus now shifts to rigorous integration tests and prototyping, bringing LEAP-One one step closer to its upcoming challenges and the next phase of development.",
      "Stay tuned for further updates as we continue to transform our vision into reality and shape the future of student-driven space exploration."
    ]
  },
  {
    "slug": "initial-leap-one-mission-badge-design-completed-by-team-mentor-kk-achari",
    "title": "Initial LEAP-One Mission Badge Design Completed by Team Mentor KK Achari",
    "excerpt": "Mentor KK Achari has finalized the LEAP-ONE mission badge'a futuristic emblem that symbolizes the team's technical ambition and collaborative spirit. Designed for use across branding, documentation and promotional materials, the badge unifies the project identity and strengthens trust with partners as LEAP-ONE prepares for ERC 2025 and upcoming outreach.",
    "publishedAt": "2025-02-24T10:58:34.000Z",
    "category": "LEAP-One",
    "image": "/media/whatsapp-image-2025-02-23-at-11.59.05-am.jpeg",
    "imageAlt": "Initial LEAP-One Mission Badge Design Completed by Team Mentor KK Achari",
    "body": [
      "Pioneering the Visual Identity of Our Next-Generation Rover",
      "We are thrilled to announce that our team mentor, KK Achari, has finalized the initial design of the LEAP-One mission badge. This emblem is more than a logo'it encapsulates the innovative spirit, academic excellence, and relentless ambition that drive the LEAP-One project.",
      "The badge features futuristic elements and dynamic imagery that reflect the core values of our student-led initiative. It serves as a unifying symbol for our mission, representing both the technological prowess of our rover and the collaborative energy of HSMaries.space.",
      "\"This badge isn't just a visual marker; it's a representation of our shared vision and commitment to pushing the boundaries of space exploration,\" said KK Achari. \"It inspires our team and builds trust with our partners as we prepare to take LEAP-One to new frontiers.\"",
      "With the badge design now complete, we look forward to integrating it across our branding, mission documentation, and promotional materials'solidifying the identity of LEAP-One as it prepares for ERC 2025 and beyond.",
      "Stay tuned for further updates as we continue to transform visionary ideas into tangible breakthroughs in student-led space exploration."
    ]
  },
  {
    "slug": "hsmaries-space-announces-completion-of-leap-one-base-design",
    "title": "Completion of LEAP-One Base Design",
    "excerpt": "The HSMAries team has completed the LEAP-ONE base design: a modular chassis, optimized power management, and payload-ready interfaces engineered for durability and adaptability. This foundational milestone clears the path for subsystem integration, prototyping, and testing ahead of ERC 2025 ' bringing the rover one confident step closer from blueprint to field-ready hardware.",
    "publishedAt": "2025-02-23T09:24:04.000Z",
    "category": "LEAP-One",
    "image": "/media/whatsapp-image-2025-02-23-at-10.24.15-am.jpeg",
    "imageAlt": "Completion of LEAP-One Base Design",
    "body": [
      "In a major milestone for student-led space innovation, the HSMaries.space team is proud to announce the completion of the base design for LEAP-One, the flagship rover in our LEAP Series. This achievement lays a robust foundation for integrating cutting-edge technologies essential for successful planetary exploration.",
      "The newly finalized base design features a modular chassis engineered for rugged terrain, an energy-efficient power management system, and optimized interfaces for future payloads. By focusing on durability, adaptability, and simplicity, the design ensures that LEAP-One can efficiently support advanced navigation, autonomous operations, and sample collection missions.",
      "\"Completing the base design is a testament to the dedication and expertise of our student engineers and mentors,\" said Teja. \"This milestone not only validates our innovative approach but also sets the stage for the next phases of subsystem integration, prototyping, and rigorous testing.\"",
      "As a subsidiary of Hochschule Schmalkalden, HSMaries.space continues to foster a collaborative environment where interdisciplinary teams come together to solve real-world aerospace challenges. With the base design complete, the team is now preparing to integrate advanced sensor arrays, drive systems, and communication modules to ensure LEAP-One meets the demanding requirements of ERC 2025.",
      "Stay tuned for further updates as LEAP-One moves from design to prototyping, bringing us one step closer to redefining the future of student-driven space exploration."
    ]
  }
]

export const fallbackNews: NewsStory[] = sourceNews.map((story) => ({
  ...story,
  author: story.author ?? 'Harsha Gottimukkala',
}))
