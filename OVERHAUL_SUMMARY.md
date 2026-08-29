# HSM Aries — Website Overhaul & Complete Engineering Summary

**Project:** HSM Aries Space Initiative Web Platform (`hsmaries.space`)  
**Institution:** Hochschule Schmalkalden, Germany  
**Status:** Fully Deployed & Verified with Clean Production Build (`npm run build`)  

---

## 1. Executive Summary

This document summarizes the complete overhaul, visual redesign, media asset ingestion, and data realignment performed on the HSM Aries website. The objective was to transform the platform into a high-performance, minimalist space-industry experience (combining the clean aesthetic of SpaceX with the technical depth of European Rover Challenge competitors), replace placeholder/AI media with 100% authentic photography, and accurately replicate the complete crew and technical specifications from the live production site.

---

## 2. Comprehensive Media Audit & Ingestion (330 Assets)

### A. Live WordPress Backend Ingestion
- Connected directly to the live `https://hsmaries.space/` REST API (`/wp-json/wp/v2/`).
- Ingested and downloaded **330 original media files** directly into `public/media/`, including official department insignias, sponsor marks, high-resolution field testing photos, and 3D CAD assets.
- Downloaded and parsed all **8 live pages** and **29 full mission news logs**.

### B. Resolution of Deceptive File Names
Through systematic direct visual inspection of each image binary, numerous critical misattributions caused by legacy file naming were uncovered and corrected:
* **`rover-4-scaled.jpg`**: Uncovered to be an **aerial drone shot of the Hochschule Schmalkalden campus courtyard and solar arrays**, rather than a rover. Accurately relocated to the University Home sections on `/about` and `/gallery`.
* **`proffesional_photo_side_cut-scaled.jpg`**: Uncovered to be a **professional studio headshot of Project Lead & Commander Harsha Vardhan Raju Gottimukkala in a suit**, rather than a mechanical cutaway. Assigned to the Team Lead profile and removed from plain rover backgrounds.
* **`testing.jpg`**: Uncovered to be an **avionics test bench showing engineers calibrating LiFePO4 batteries, wiring harnesses, and brushless motor drivers** via laptop. Mapped to Power Architecture and Hardware Validation.
* **`pitching-in-boehm-scaled.jpg`**: Uncovered to show the **team pitching mechanical rover architecture to Böhm Group executives in their boardroom**. Mapped to Industry Collaboration.
* **`whatsapp-image-2025-03-26-at-4.01.37-pm-scaled.jpeg`**: Uncovered to be an **interdisciplinary whiteboard brainstorming and design review session in the robotics lounge**. Mapped to Team Collaboration.
* **`leap-one-hero.jpg`**: Identified as a poster with giant baked-in graphic typography that clashed with dynamic HTML headings. Replaced across hero sections with clean, high-resolution photography (`dsc01502-scaled.jpg` and `mars-rover-leap-one-1.png`).

---

## 3. Authentic Team & Department Hierarchy Realignment

The entire team roster was updated in `src/lib/fallbackTeam.ts` and `src/collections/Team.ts` to match the exact crew on `hsmaries.space/about/`:

### A. Executive Leadership
* **Harsha Vardhan Raju Gottimukkala** — Team Lead LEAP-One & Interim Lead Scientific Payload
* **Brahama Teja Naroju** — Mechanical Lead & Manipulator Lead
* **Ayan Akbar Ali** — Electrical Department Lead
* **Omar Abdelrady** — Software Department Lead
* **Vighnesh Madhav Deshmukh** — Communication Lead & Software Engineer
* **Danny Sneham** — Drill Department Lead
* **Rahul Khandait** — Drone Lead (Astroflight UAV) & Software Engineer
* **Reeba Biju** — Mission, Resources & Outreach (MRO) Lead

### B. Specialized Engineering Divisions
* **Mechanical & Drivetrain**: Brahama Teja Naroju (Lead), Shreyas Patel, Naveen Kumar Shivakumar, Rahul Kamatagi.
* **Electrical & Power Systems**: Ayan Akbar Ali (Lead), Mohammad Abdulaziz, Yash Lohar, Md Bashar.
* **Software & Navigation**: Omar Abdelrady (Lead), Vighnesh Madhav Deshmukh, Harsha Vardhan Raju Gottimukkala, Rahul Khandait, Mukul Bimbra, Priyam Bhatnagar.
* **Scientific Payload**: Harsha Vardhan Raju Gottimukkala (Lead), Anantha Pathmanabhan, Ashwin Dinesh Ayinipully.
* **Drill & Manipulator**: Brahama Teja Naroju (Manipulator Lead), Danny Sneham (Drill Lead), Rahul Kamatagi, Naveen Kumar Shivakumar.
* **Astroflight (AQUILA Drone)**: Rahul Khandait (Drone Lead), Omar Abdelrady.
* **Communication & Ground Telemetry**: Vighnesh Madhav Deshmukh (Lead).
* **Mission, Resources & Outreach (MRO)**: Reeba Biju (Lead), Harsha Vardhan Raju Gottimukkala.

### C. Academic & Industry Advisory Board
* **Prof. Dr.-Ing. Frank Schrödel** — Faculty Advisor & Academic Sponsor (Hochschule Schmalkalden)
* **Alexander Kolbai** — Industry Advisor (Precision Manufacturing)
* **Swaraj Tendulkar** — University Mentor (Robotics Systems)
* **K.K. Achari** — Senior Industry Mentor (Aerospace Architecture & PDR)
* **Venkata Prashanth Uppalapati** — University Mentor (Embedded Electronics)
* **Niranjan Ramesha** — University Mentor (Suspension Kinematics)
* **Nikhil Meduri** — University Mentor (Custom PCB & Firmware)

---

## 4. Page Architecture & Design Overhauls

### 1. Homepage (`/`)
* **Cinematic Dark Hero**: High-res field photo (`dsc01502-scaled.jpg`) with subtle atmospheric shading and magnetic CTA buttons.
* **Live Competition Metric Band**: `#1 ERC QUALIFICATION · 239.75 POINTS · 124 UNIVERSITIES · 7× TORQUE HUB MOTORS`.
* **Interactive 3D / Sequence Rover Viewer**: Smooth interactive scrubber showcasing the full rover frame from all angles.
* **Mission Systems Showcase (`MissionSystems.tsx`)**: 4-system interactive tabbed interface covering Mobility (rocker-bogie), Autonomy (RTX 5080 & ROS 2), Manipulation (6-DoF arm), and Science (subsurface drill).
* **Specialized Departments Grid (`DepartmentsGrid.tsx`)**: 8 division cards with official crests (`l1_mechancial.png`, `l1_electric.png`, `l1_software.png`, `l1_drill_arm.png`, `l1_astro-1.png`, `l1_science.png`, `l1_mro-1.png`, `l1_comms.png`).
* **Field Reconnaissance Rail (`GalleryRail.tsx`)**: 18 curated high-resolution photos with modal zoom.
* **Mission Updates Feed (`NewsRows.tsx`)**: Live feed of the latest competition and hardware logs.
* **Industry Partners Marquee (`PartnersBand.tsx`)**: SICK Sensor Intelligence, Böhm Group GmbH, Skyforce Drone Solutions, Eviotech, and Hochschule Schmalkalden.

### 2. Flagship Vehicle Page (`/leap-one`)
* **Extraterrestrial Canyon Hero**: High-res Martian render (`mars-rover-leap-one-1.png`).
* **Subsystem Deep Dive**:
  * **7× Torque Enclosed Hub Motors**: Sealed BLDC motors with custom 3D-printed compliant grousers (`3d-tyre-scaled.jpg`).
  * **Three-Pack Battery Architecture**: Isolated LiFePO4 power rails preventing voltage sags during heavy actuator load (`testing.jpg`).
  * **5-Axis Precision CNC Aerospace Fabrication**: 6061-T6 structural aluminum chassis machined at Böhm Group facility (`boehm-manufacturing-scaled.jpg`).
* **Full 16-Point Engineering Specification Sheet**: Mass (48.5 kg), Ground Clearance (220 mm), Gradeability (35°), Compute (Intel Core Ultra 9 + NVIDIA RTX 5080), Telemetry (5.8 GHz COFDM).

### 3. Mission & Team Page (`/about`)
* **Space Night Team Hero**: Full crew with the robotic arm rover and AQUILA drone (`space-night-rover.jpg`).
* **The Story & Principles**: In-depth coverage of club founding, *"We Stop at Nothing"*, *"We Take It Step-by-Step"*, *"We Keep It Simple"*, and *"Hard Work & Dedication"*.
* **University Home**: Campus aerial view (`rover-4-scaled.jpg`) and robotics lab context (`dsc01422-scaled.jpg`).
* **Division Architecture**: Complete 8-department interactive breakdown.
* **Advisory Board Grid**: Individual portrait cards for faculty advisors and mentors.
* **Industry Sponsorship**: Mechanical pitch at Böhm Group boardroom (`pitching-in-boehm-scaled.jpg`).

### 4. Crew & Roster Page (`/team`)
* **Interactive Department Filter Tabs**: Instant filtering by `All Crew`, `Leadership`, `Mechanical`, `Electrical`, `Software`, `Science`, `Advisors & Mentors`.
* **Crew Member Cards**: Clean portrait display with names, official titles, and biographies.
* **Team Culture & Collaboration**: Whiteboard brainstorming session (`whatsapp-image-2025-03-26-at-4.01.37-pm-scaled.jpeg`).

### 5. News & Mission Logs (`/news` & `/news/[slug]`)
* Complete archive of **29 authentic mission stories** parsed directly from the live WordPress database.
* Individual dynamic article reader with formatted timestamps, category pills, responsive hero media, structured body text, and back navigation.

### 6. Media Gallery (`/gallery`)
* Grid of 18 high-resolution field photos covering outdoor rock clearance, forest traversal, Space Night exhibits, Böhm CNC manufacturing, and campus test grounds.

---

## 5. Technical Fixes & Reliability Improvements

### A. Blank News Article Bug Fix
* **Problem**: Opening any `/news/[slug]` article rendered a blank page.
* **Root Cause**: `styles.css` applied `opacity: 0` to `[data-reveal]` and `clip-path: inset(0 100% 0 0)` to `.reveal-media`. Because the static/server-rendered story pages did not run a client observer, all content was hidden at `0%` opacity.
* **Solution**: Updated `[data-reveal]` and `.reveal-media` in `styles.css` to default to visible (`opacity: 1; transform: none; clip-path: none;`), and cleaned up the `NewsStoryPage` component to render all content directly.

### B. Production Build Verification
* Ran `npm run build` with Next.js Turbopack and TypeScript verification.
* **Result**: All 11 static routes and 5 dynamic API/CMS endpoints compiled in 2.4s with **0 errors**.

---

*Document compiled for the HSM Aries engineering team and stakeholders.*
