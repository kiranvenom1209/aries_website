// Public professional profiles checked on 2026-09-14. Bios are original summaries;
// HSM roles come from the team's approved roster, background from the linked source.
export type ProfileResearch = { linkedIn?: string; bio: string; website?: string; works?: Array<{ title: string; url: string; detail: string }> }
export const researchedProfiles: Record<string, ProfileResearch> = {
  'omar-abdelrady': {
    linkedIn: 'https://de.linkedin.com/in/omar-mo-abbas',
    bio: "Omar leads the software work that lets LEAP-One perceive its surroundings, estimate its position and respond to the operator. His team responsibilities cover the ROS 2 stack, RealSense perception, localisation, obstacle avoidance and ground-station teleoperation. They place him at the meeting point between sensor data, navigation decisions and real hardware.\n\nKnown professionally as Omar Abbas, he studies at Hochschule Schmalkalden and has trained in embedded systems and deep learning for self-driving cars. He also founded Schmalkalden Autonomous Racing, extending his interest in perception, control and vehicle autonomy into another student engineering programme.",
  },
  'harsha-vardhan-raju-gottimukkala': {
    linkedIn: 'https://de.linkedin.com/in/harshagottimukkala',
    bio: "Harsha takes responsibility for the whole LEAP-One mission: keeping mechanical, electrical, software and science work moving towards a rover the team can operate together. His role spans department coordination, system integration and representing HSM Aries beyond the lab. At Space Night Jena, he presented LEAP-One and AQUILA to visitors from research, industry and government.\n\nHis engineering interests began with automobiles and now extend into software research and development at SOMIC Packaging. He is also a coauthor of the team’s LEAP-One design preprint, helping turn the programme’s practical work into a technical record others can build on.",
  },
  'brahama-teja-naroju': {
    linkedIn: 'https://de.linkedin.com/in/brahamateja99',
    bio: "Brahama works where a rover drawing becomes a physical machine. As Mechanical and Manipulator Lead, his responsibilities span the chassis, suspension and arm, with particular attention to how parts fit, carry loads and move together. His public project updates describe applying geometric dimensioning and tolerancing directly to Mars-rover components.\n\nHe came to his master’s in Mechatronics and Robotics at Hochschule Schmalkalden after three years of professional experience in India. That combination of design study and manufacturing practice informs his approach to the rover. He is a coauthor of the LEAP-One design preprint.",
  },
  'ayan-akbar-ali': {
    linkedIn: 'https://de.linkedin.com/in/ayanakbarali',
    bio: "Ayan designed LEAP-One’s electrical architecture from the ground up: power distribution, safety systems and the connections between mobility, drilling and the robotic arm. Leading the electrical team means making those subsystems work as one system, from the battery and regulated rails to the motor controllers.\n\nHis testing updates describe validating the ODrive setup and emergency-stop chain before field trials—checking that the rover could stop safely as well as move. A master’s student at Hochschule Schmalkalden and coauthor of the LEAP-One design preprint, Ayan brings the same attention to architecture, bench testing and practical integration.",
  },
  'vighnesh-madhav-deshmukh': {
    linkedIn: 'https://de.linkedin.com/in/vighneshdes2211',
    bio: "Vighnesh looks after the connection between LEAP-One and the people operating it. He leads the primary telemetry and video link and the independent backup control path, while also contributing to the software department. This combination puts communications reliability and software integration in the same pair of hands.\n\nA mechanical engineering graduate at Hochschule Schmalkalden, he has expanded his experience through mechatronics, additive manufacturing and ROS 2 training. He is a coauthor of the LEAP-One design preprint, which documents the rover’s mechanical, electrical and communication architecture.",
  },
  'danny-sneham': {
    linkedIn: 'https://de.linkedin.com/in/danny-sneham',
    bio: "Danny’s part of LEAP-One reaches below the surface. His drill work centres on the auger, sample acquisition and the mechanisms needed to retain material for analysis. It is a practical engineering problem: turning rotary motion into useful penetration while keeping the sampling process compatible with the rest of the rover.\n\nHis background includes Hochschule Schmalkalden and experience at Adtran, alongside training in networking and Python. Danny is also a coauthor of the LEAP-One design preprint, contributing to the technical account of a rover built for navigation and scientific sampling.",
  },
  'rahul-khandait': {
    linkedIn: 'https://de.linkedin.com/in/rahul-khandait-569b3420a',
    bio: "Rahul leads AQUILA, the aerial side of the HSM Aries mission. His Astroflight responsibilities bring together flight control, visual mapping and the links between drone and rover operations. He also contributes to the software department, connecting aerial reconnaissance with the wider autonomous-systems effort.\n\nHis involvement extends to the team’s technical documentation: Rahul is a coauthor of the LEAP-One design preprint. Working across aircraft development and rover software gives his role a particular emphasis on how separate robotic platforms contribute to one mission.",
  },
  'reeba-biju': {
    linkedIn: 'https://de.linkedin.com/in/reeba-biju-5a878016a',
    bio: "Reeba works on the resources and relationships that keep the engineering programme moving. As Mission Resources & Outreach Lead, her responsibilities include team operations, industry sponsorships, exhibitions and community engagement. That work gives HSM Aries a point of connection between the workshop, its partners and the people meeting the rover for the first time.\n\nHer background includes experience at Cognizant and study at Rajagiri College of Social Sciences. Within the student team, she brings that organisational perspective to a programme whose progress depends on people, coordination and support as much as hardware.",
  },
  'shreyas-patel': {
    linkedIn: 'https://de.linkedin.com/in/shreyaspatel30',
    bio: "Shreyas contributes to the rover’s structural design and to the simulation environment used to understand it. His mechanical work includes CAD assemblies, stress analysis and suspension reinforcement. He has also documented the team’s ROS 2 integration in Gazebo and RViz, bringing cameras, lidar, coordinate frames and the robotic arm into a shared model.\n\nThat combination is useful at the boundary between departments: physical geometry must agree with the transforms and sensor data used by software. His work connects those representations so mechanical development and perception testing can inform one another.",
  },
  'naveen-kumar-shivakumar': {
    linkedIn: 'https://de.linkedin.com/in/naveen-kumar-s-06ab701b7',
    bio: "Naveen joined the mechanical effort through battery mounting before moving into the LEAP-One drill. His public updates describe the challenge of achieving useful soil penetration within tight space constraints. The work involves prototyping, torque transmission and testing what happens when the mechanism meets real material.\n\nHe has also worked on a modular, entirely mechanical extension to a wind-powered water pump for the Ingenieure ohne Grenzen Challenge. That project shares a practical concern with his rover work: making a mechanism serviceable and effective without adding unnecessary complexity.",
  },
  'rahul-kamatagi': {
    linkedIn: 'https://de.linkedin.com/in/rahul-anil-kamatagi',
    bio: "Rahul works on the fit and assembly of the rover’s mechanical and manipulator components. His responsibilities include CNC-part assembly, joint tolerances and structural checks in the lab and field—details that determine whether a design can move and carry loads as intended.\n\nHe brings professional experience from Tata Technologies to his master’s in Mechatronics and Robotics at Hochschule Schmalkalden. He has also represented HSM Aries at Space Night Jena, explaining the rover and drone programme to visitors. His contribution connects practical mechanical work with the ability to communicate what the team is building.",
  },
  'yash-lohar': {
    linkedIn: 'https://de.linkedin.com/in/yash-lohar',
    bio: "Yash works on the rover’s power-distribution hardware, wiring harnesses, safety cutoffs and battery protection. These are the parts of the electrical system that must remain understandable and dependable as more subsystems are connected and tested. His role gives the team focused attention on how power reaches the vehicle’s working hardware.\n\nHis independent STM32 handheld-console project shows the same interest at a smaller scale: designing charging, battery protection, buck and boost supplies from component datasheets. With further training in PLC, SCADA and industrial automation, he brings practical power-electronics experience to the rover team.",
  },
  'md-bashar': {
    linkedIn: 'https://de.linkedin.com/in/md-bashar-h-8292ab2a7',
    bio: "Bashar contributes to the physical side of the rover’s electronics: enclosures, high-current board assembly and shielding. His electrical-hardware role is concerned with how circuitry is packaged and integrated into a machine that must leave the bench and operate outdoors.\n\nHe joined HSM Aries in August 2025 and has shared the team’s progression through probing, AstroBio and autonomous-navigation trials. He also helped present the rover at Space Night Jena. His updates connect hands-on lab work with the enthusiasm of showing a student-built robot to the public.",
  },
  'tony-mathew': {
    linkedIn: 'https://de.linkedin.com/in/tony2002',
    bio: "Tony brings an electronics and communication engineering background to HSM Aries’ Electrical & Power Systems department. His contribution sits within the work of integrating the rover’s electronic systems, alongside a team responsible for power, control hardware and embedded interfaces.\n\nHe continues his studies at Hochschule Schmalkalden and has also been named among the HSM-Terra crew at the Field Robot Event. Working with student robots in more than one programme gives him experience of collaborative hardware development beyond the classroom and exposure to the demands of outdoor robotics.",
  },
  'mukul-bimbra': {
    linkedIn: 'https://de.linkedin.com/in/mukul-bimbra',
    bio: "Mukul works on the perception problems between a sensor reading and a usable view of the terrain. His Software & Autonomy responsibilities include point-cloud filtering, mapping and obstacle-avoidance work in ROS 2. Those tasks help the navigation system distinguish useful structure from noisy measurements.\n\nHe came to robotics after three years at Pearce Services, where his work ranged from telecom design and costing to quality control and project responsibility. His earlier robotic-arm project included designing a gripper for a mecanum-wheel platform. That background gives him experience with both the geometry of a mechanism and the information needed to operate it.",
  },
  'priyam-bhatnagar': {
    linkedIn: 'https://in.linkedin.com/in/priyam-bhatnagar-2781951a0',
    bio: "Priyam contributes to the rover’s visual understanding of the field. His work in Software & Autonomy includes stereo-depth perception, object classification and spatial-map generation, supporting the transition from camera images to information the navigation system can use.\n\nHis background includes the Indian Institute of Technology Roorkee and study at Hochschule Schmalkalden. He has also been part of the university’s HSM-Terra field-robot team. That involvement places his perception and navigation interests in two practical outdoor-robotics programmes, where algorithms must be exercised against real terrain and sensor data.",
  },
  'anish-paul': {
    linkedIn: 'https://de.linkedin.com/in/anishpaul123',
    bio: "Anish contributes to AQUILA’s software within the Astroflight department. He is part of the effort to make aerial robotics useful to the wider mission, working alongside the drone team as it develops a reconnaissance platform to complement the rover.\n\nHis interests also extend into physical robot construction. The HSM-Terra team credited his mechanical contribution at the Field Robot Event, while his training includes Python and SolidWorks. That combination of programming and hands-on design gives him a useful perspective on the connection between software behaviour and the machine carrying it out.",
  },
  'harsh-mistry': {
    linkedIn: 'https://de.linkedin.com/in/harshmistry2992',
    bio: "Harsh contributes to AQUILA as a UAV Systems Engineer, working with HSM Zenith and HSM Aries on the aircraft that complements LEAP-One. Teammates name him among the crew who took AQUILA through testing, teardown and rebuilding before its competition flight.\n\nAt the European Rover Challenge 2026 finals, AQUILA completed autonomous GPS-denied takeoff, AI-vision probe detection, optical-flow and LiDAR navigation, and a precision landing on an ArUco marker. The mission earned 265 of 300 points; Harsh was part of the team that brought those systems from integration to the field.",
  },
  'ashwin-dinesh-ayinipully': {
    linkedIn: 'https://de.linkedin.com/in/ashwinayinipully',
    website: 'https://github.com/Ayinipully',
    bio: "Ashwin works on the experimental side of Scientific Payload, including regolith simulation, sample classification and sensor integration. He brings three years of industrial experience at Fleetguard Filters to his master’s in Mechatronics and Robotics at Hochschule Schmalkalden.\n\nHis independent projects show a patient, hands-on approach to debugging: building a LeKiwi teleoperation setup and developing an ESP32 pen plotter have involved servo calibration, motor buses, encoder noise and closed-loop control. That experience is relevant to a science subsystem where reliable measurements depend on both the instrument and the hardware around it.",
  },
  'shivansh-mehta': {
    linkedIn: 'https://de.linkedin.com/in/shivansh-mehta-a46496188',
    bio: "Shivansh writes the embedded software that gives parts of the drill and science box their behaviour. His LEAP-One contributions include programming motors and limit switches and working with load cells—the interfaces through which mechanisms move, detect their limits and report measurements.\n\nAlthough that work crosses into sampling and science, his home department is Electrical & Power Systems. He studies at Hochschule Schmalkalden and has experience at Dassault Systèmes. His interests in robotics and drones are reflected in a project role that stays close to hardware, translating instructions into controlled physical actions.",
  },
  'prof-dr-ing-frank-schrodel': {
    linkedIn: 'https://de.linkedin.com/in/dr-frank-schr%C3%B6del',
    bio: "Professor Frank Schrödel provides the academic foundation for HSM Aries: laboratory access, research guidance and the institutional support needed for students to develop and test a rover. His expertise covers control engineering, automation and robotics, with particular interests in robust control, model-based development and the validation of autonomous systems.\n\nBefore joining Hochschule Schmalkalden in 2020, he led a team developing intelligent driving functions at IAV and completed his doctorate at RWTH Aachen. His publication record spans controller design, automated vehicles, human–robot interaction and precision robotics. As a coauthor of the LEAP-One preprint and a supervisor of the surrounding research programme, he connects the students’ engineering work with questions that extend beyond one competition.",
  },
  'swaraj-tendulkar': {
    linkedIn: 'https://de.linkedin.com/in/swaraj-tendulkar-3219651b4',
    bio: "Swaraj helped establish HSM Aries and mentors the team across architecture, integration and mission preparation. His role connects the many technical decisions made by individual departments with the practical question of how a complete robot behaves outside the lab.\n\nHis own research addresses outdoor mobile robots, environment perception and interactions with pedestrians. It includes published work on vehicle-to-everything perception and occupancy analysis, and a newer preprint organising navigation into global, static and dynamic map layers. He is also a coauthor of the LEAP-One design preprint. That research gives his mentoring a concrete foundation in the sensing and navigation challenges faced by real mobile robots.",
  },
  'kk-achari': {
    linkedIn: 'https://de.linkedin.com/in/acharikiran',
    bio: "K.K. Achari helps the team work through the distance between a promising concept and a manufacturable mechanism. As industry mentor and a link to Boehm Group, he supports component selection, engineering reviews and fabrication decisions for systems such as the manipulator, drill and suspension.\n\nHis public account of the role emphasises durability, practical use and the constraints of making parts. He is also a coauthor of the LEAP-One design preprint. His contribution gives students access to an industrial perspective while they learn to justify design choices, prepare reviews and bring hardware into the field.",
  },
  'venkata-prashanth-uppalapati': {
    linkedIn: 'https://de.linkedin.com/in/venkata-prashanth-uppalapati',
    bio: "Venkata Prashanth mentors the electrical and embedded-systems work that turns the rover into a controllable machine. The team’s bench-testing updates identify his guidance during validation of motor controllers, batteries, relays and the emergency-stop system. His support includes firmware, communication and hands-on hardware debugging.\n\nA research assistant and Mechatronics and Robotics graduate at Hochschule Schmalkalden, he has published on low-cost robot drive systems, micro-ROS-based manipulation and human–robot interaction. His drive-system research combines hardware prototyping, feedback control and ROS integration—the same kinds of interfaces the students must understand when bringing their own rover to life.",
  },
  'nikhil-meduri': {
    linkedIn: 'https://de.linkedin.com/in/nikhil-meduri',
    bio: "Nikhil mentors the team on electronic design, sensor interfaces and hardware reliability, bringing a research perspective to the question of whether a system performs as accurately as expected. His support encourages students to look beyond individual components and examine the behaviour of the integrated hardware.\n\nHis research at Hochschule Schmalkalden includes a coordinate-measuring system built around a collaborative robot. With Niranjan Kannali Ramesha and Professor Schrödel, he has studied spatial errors and their correction, including the effects of arm position and loading. Their European Control Conference paper documents this work, connecting careful measurement with practical methods for improving robot accuracy.",
  },
  'mohammad-abdulaziz': {
    bio: "Mohammad contributes to the electrical and teleoperation interfaces running through LEAP-One. His team responsibilities include CAN-bus communication, motor-control signals and power-distribution harnesses across the rover frame. This work connects high-level commands to the electronics and actuators that carry them out.\n\nIt is an integration role with a direct bearing on how the rover is operated: wiring, communication and control must agree across multiple subsystems. Within Electrical & Power Systems, Mohammad works on those connections between the vehicle’s structure, electronics and operator controls.",
  },
  'anantha-pathmanabhan': {
    linkedIn: 'https://www.linkedin.com/in/ananthapathmanabhansp/',
    bio: "Anantha leads Scientific Payload, the part of LEAP-One concerned with making a collected sample scientifically useful. His team responsibilities span analysis chambers, reagent delivery and sample-carousel handling, bringing the mechanics of sampling together with the instruments used to examine material.\n\nA master’s student in Mechatronics & Robotics at Hochschule Schmalkalden, he combines mechanical design with automation and control. His toolkit includes CATIA and SolidWorks alongside PLC programming in TIA Portal, CODESYS and TwinCAT. He describes his European Rover Challenge experience as hands-on work designing, building and programming robotic systems—an approach that fits a science payload where mechanisms, electronics and operating sequences have to work together.\n\nWithin Aries, his leadership connects the drill and sample-handling effort with the science box, keeping the department focused on what happens after the rover reaches its target and retrieves material.",
  },
  'niranjan-ramesha': {
    bio: "Niranjan supports the mechanical team with suspension kinematics, wheel design and terrain testing. His mentoring helps students examine what their mechanisms do under load and how a physical robot differs from an ideal model.\n\nAt Hochschule Schmalkalden, Niranjan Kannali Ramesha has worked with Nikhil Meduri and Professor Schrödel on adapting low-cost collaborative robots for precision measurement with PREMETEC. Their work led to a 2026 European Control Conference paper on spatial-error characterisation and correction. He has also presented work on extreme-ultraviolet laser wavefront sensing, bringing a broader measurement background to his practical robotics guidance.",
  },
  'alexander-kolbai': {
    bio: "Alexander brings an industry perspective to the principal-advisor team, supporting the programme’s attention to manufacturing, tolerances and the practical robustness of its hardware. His contribution complements the university’s academic guidance with experience of how engineering concepts meet industrial constraints.\n\nHis research connections extend into autonomous mobility. He coauthored work with Swaraj Tendulkar, Mayank Khandelwal and Professor Schrödel on interoperability between automobiles and mobile robots for affordable last-mile delivery. That work examines shared software, communication and infrastructure—questions that also matter when separate robotic systems must function together.",
  },
}

const leapPaper = {
  title: 'LEAP-One: A Mars Rover Designed for Remote Mars Analogue Scientific Exploration and Sampling Missions',
  url: 'https://www.researchgate.net/publication/401401918_LEAP-One_A_Mars_Rover_Designed_for_Remote_Mars_Analogue_Scientific_Exploration_and_Sampling_Missions',
  detail: '2026 preprint; rover design, scientific sampling and remote operation.',
}
const robotAccuracy = {
  title: 'Data-Driven and Sensor-Based Spatial Error Characterisation and Correction for Multi-Axis Robots',
  url: 'https://controls.papercept.net/conferences/conferences/ECC26/program/ECC26_ContentListWeb_1.html',
  detail: 'European Control Conference, 2026. N. K. Ramesha, N. Meduri and F. Schrödel.',
}
const robotDrive = {
  title: 'Design and Prototyping of a Low-Cost Mobile Robot Drive System for Outdoor Autonomous Logistics Solutions',
  url: 'https://www.med-control.org/med2024/wp-content/uploads/MED-2024-Program-and-Book-of-Abstracts.pdf',
  detail: 'Mediterranean Conference on Control and Automation, 2024; coauthored work on hardware prototyping and feedback-controlled mobile robot drives.',
}
const perception = {
  title: 'V2X based Vehicle Environment Perception and Occupancy Analysis for Dynamic Pedestrian Behaviour',
  url: 'https://paperhost.org/proceedings/controls/ECC24/files/0476.pdf',
  detail: 'European Control Conference, 2024. S. Tendulkar, M. Y. Khandelwal and F. Schrödel.',
}
const coaction = {
  title: 'Coaction between Automobiles and Mobile Robots',
  url: 'https://www.ame-konferenz.de/resource/blob/2257670/2a380f6607e052cbf2e16c197d6e8ece/vde-amec2024-download-data.pdf',
  detail: 'AmEC 2024; interoperability for affordable last-mile delivery. M. Y. Khandelwal, S. Tendulkar, G. A. Kolbai and F. Schrödel.',
}
const multilayer = {
  title: 'Multilayer Environment Model for Outdoor Autonomous Mobile Robot Navigation',
  url: 'https://www.researchgate.net/publication/403799969_Multilayer_Environment_Model_for_Outdoor_Autonomous_Mobile_Robot_Navigation',
  detail: '2026 preprint by S. Tendulkar, A. Nannuri, S. Nagdev and F. Schrödel; an ongoing research framework for outdoor navigation.',
}
const precisionProject = {
  title: 'Low-cost cobots for precision measurement',
  url: 'https://hereingeforscht.de/en/research-in-profile/in-the-midst-of-a-paradigm-shift-how-can-low-cost-cobots-be-adapted-for-precision-measurement-technologies/',
  detail: 'Hochschule Schmalkalden’s account of the collaborative research project with PREMETEC.',
}

for (const slug of ['ayan-akbar-ali', 'brahama-teja-naroju', 'danny-sneham', 'harsha-vardhan-raju-gottimukkala', 'vighnesh-madhav-deshmukh', 'rahul-khandait', 'kk-achari']) {
  researchedProfiles[slug].works = [leapPaper]
}
researchedProfiles['prof-dr-ing-frank-schrodel'].works = [leapPaper, robotAccuracy, perception, multilayer, {
  title: 'Full university publication list',
  url: 'https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/frank-schroedel',
  detail: 'Further research in control engineering, autonomous systems and human–robot interaction.',
}]
researchedProfiles['prof-dr-ing-frank-schrodel'].website = 'https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/frank-schroedel'
researchedProfiles['swaraj-tendulkar'].works = [leapPaper, perception, coaction, multilayer]
researchedProfiles['venkata-prashanth-uppalapati'].works = [robotDrive, {
  title: 'Robots in Town – Low-Cost Automated Logistic Concept',
  url: 'https://irispublishers.com/ojrat/fulltext/Robots-in-Town-Low-Cost-Automated-Logistic-Concept.ID.000524.php',
  detail: 'Online Journal of Robotics & Automation Technology, 2023; a coauthored concept for low-cost delivery robots.',
}, {
  title: 'University research profile and publications',
  url: 'https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/venkata-prashanth-uppalapti',
  detail: 'Further work in mobile robotics, manipulation and human–robot interaction.',
}]
researchedProfiles['nikhil-meduri'].works = [robotAccuracy, precisionProject]
researchedProfiles['niranjan-ramesha'].works = [robotAccuracy, precisionProject, {
  title: 'Wavefront sensing of an extreme-ultraviolet free-electron laser',
  url: 'https://www.hs-schmalkalden.de/fileadmin/portal/Bilder/Forschung/005_Ramesha_Wavefront_Sensing_of_an_Extreme-Ultraviolet_Free-Electron_Laser_-_Kopie.pdf',
  detail: 'Research poster by N. K. Ramesha, M. Ruiz Lopez and C. Rödel.',
}]
researchedProfiles['niranjan-ramesha'].website = 'https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/niranja-kannali-ramesha'
researchedProfiles['alexander-kolbai'].works = [coaction]
researchedProfiles['ashwin-dinesh-ayinipully'].works = [{
  title: 'Building an ESP32 motion-control plotter',
  url: 'https://www.linkedin.com/posts/ashwinayinipully_engineering-mechatronics-esp32-activity-7471943821355028480-euHm',
  detail: 'Project notes on encoders, motor noise and closed-loop control.',
}, {
  title: 'LeKiwi teleoperation: hardware integration and debugging',
  url: 'https://www.linkedin.com/posts/ashwinayinipully_robotics-engineeringjourney-lerobot-activity-7418753733511073793-8r8e',
  detail: 'Personal project update on getting leader and follower arms working together.',
}]
researchedProfiles['omar-abdelrady'].works = [{
  title: 'Founding Schmalkalden Autonomous Racing',
  url: 'https://www.linkedin.com/posts/omar-mo-abbas_i-am-excited-to-announce-the-founding-of-activity-7473698616692555776-PIOO',
  detail: 'Omar’s announcement of the student autonomous-racing initiative.',
}]
