# LEAP project pages — 12 September 2026

Both pages retain the existing black, white and orange visual language. LEAP-One now leads with the vehicle, then engineering, Mission Control and field results. Leap-2 leads with the concept, construction direction, field-derived priorities and the component baseline. Shared project navigation and native disclosures make the detail easier to explore.

## Team-provided direction

The team supplied these changes during this design session, superseding the earlier requirement-only Leap-2 brief:

- Approximately 3× LEAP-One's overall volume, not 3× length. This is an approximate envelope target.
- Six-wheel rocker-bogie suspension; custom printed TPU wheels with a diameter target 2.5× LEAP-One's.
- Folded galvanised sheet chassis, inspired by Japanese and Ukrainian competition teams; laser-cut sheets welded into box-section suspension links.
- Custom manipulator replacing the Igus arm. Faster movement, lower mass and greater task capability are development goals, not measured results.
- Most LEAP-One parts form the carried-forward baseline. Exact final packaging and compatibility remain engineering work.

## Hardware evidence

- `src/components/DepartmentsGrid.tsx`: Intel RealSense D435i, Botwheel BLDC, ODrive S1, battery architecture, communications and software.
- Existing LEAP-One page: ROG NUC 15, Teensy 4.1, LiFePO4 2S2P 25.6 V / 60 Ah, AirMAX and ExpressLRS.
- `wp-content/uploads/2026/01/LeapOne_dossier.pdf`: earlier sponsorship dossier names SICK multiScan 165S. Kept distinct from confirmed installation status.
- RealSense product reference: https://www.realsenseai.com/products/depth-camera-d435i/
- Broader competition inspiration: https://roverchallenge.eu/edition-teams-archive/2026-on-site/ ; https://spacetech.agh.edu.pl/student-research-groups/agh-spacesystems ; https://make.epfl.ch/projects/2/make-epfl-xplore-2 . Specific Japanese/Ukrainian teams were not identified by name; construction direction came from the team, not an independently verified attribution.

## Generated asset

Production asset: `public/media/leap-2-concept.jpg`, with responsive WebP variants. Created using the built-in image generation tool, then revised in response to team feedback. Original selected output: `C:/Users/IBN/.codex/generated_images/01a09570-6fb9-7be1-b6e6-6c4d598e5f21/exec-75f44d99-de37-4720-91ae-566dab73a963.png`.

Final cumulative prompt: Create a photorealistic wide Leap-2 concept on rocky analogue terrain, rover on the right and dark negative space on the left. Six large airless 3D-printed TPU wheels with visible lattice and chevron tread, passive rocker-bogie layout, folded galvanised sheet chassis and laser-cut welded box-section suspension links. Replace the Igus-style arm with an illustrative bespoke slender manipulator. Replace invented sensor hardware with the compact silver-and-black Intel RealSense D435i camera on a plain bracket, with practical cabling; remove the fictional cylindrical LiDAR. Keep baseline electronics inside the enclosure. Use restrained orange highlights and the exact label “Leap-2”. Preserve the corrected wheel, chassis and arm geometry between edits. This is concept art, not engineering CAD or proof of exact component proportions.

The visible custom arm links and joints are illustrative: materials, actuator selection, payload and speed are not frozen. The rendering does not demonstrate the numerical size targets or mechanical validation. The page labels it as an AI-generated concept.

## Fidelity notes

### Latest team corrections and pending rendering work

The team clarified that LEAP-One has multiple front RealSense cameras, a RealSense at the wrist near the gripper, and a Logitech mast camera. Leap-2 adds 360-degree cameras and LiDAR for positional awareness; exact new models are not yet specified. The original rover photo `erc-2026-finals-40-rover-on-the-rocks.jpg` supplies the decal reference (ODrive, Boehm, Aries, Hochschule, ERC, heraldic stripe and German-flag nameplate).

The supplied mission badge was found at `C:/Users/IBN/Downloads/leap2_badge.png` and copied unchanged to `public/media/leap-2-mission-badge.png`. The initially supplied path with a `leap2` subdirectory did not exist.

Image generation returned `usage_limit_reached` before the decal/distributed-camera revision could run. The live page includes the new brief, mission badge and original reference photo, and explicitly says the selected render predates these additions. The image itself still needs that revision. Do not claim those changes are in the render.

Pending prompt: Edit the selected Leap-2 image, preserving all chassis, custom arm, airless TPU wheel and rocker-bogie geometry. Transfer original rover decals and German-flag nameplate from the reference photo, changing the plate name to Leap-2; include the supplied Leap-2 mission badge. Add two compact RealSense bars at the front and one near the gripper with practical brackets and cabling. Replace the single mast RealSense with a compact dual-fisheye 360 camera and a separately mounted practical LiDAR; include rear 360 coverage. Do not invent exact unselected sensor models. Preserve the six large printed wheels and custom arm, not Igus or pneumatic tyres.

Validation: TypeScript and ESLint passed after the page rewrites. Live browser checks covered project anchors, task-result disclosure, brief disclosures and layouts at 1440, 390 and 320 px; no horizontal overflow at 320 px on Leap-2. Final badge integration was checked separately.

- Preserved existing typography, palette, square actions, header, footer and partner treatment.
- Implemented the generated hero / engineering-disclosure / editorial-priority concepts with live HTML and existing components.
- Leap-2 hero departs from the first layout concept to accommodate the team's newly requested rover rendering and mechanical brief.
- Original ERC photography remains the evidence on LEAP-One and in Leap-2's field-derived priorities.


## Completed image revision

The built-in image-generation retry succeeded. Selected output: exec-93687524-1b40-459a-81ff-9374c0258e13.png. Production asset: public/media/leap-2-concept-v2.jpg. Applied the pending prompt above with the original rover photo and supplied mission badge: decals, German-flag plate, badge, two front RealSense-style cameras, wrist camera, mast 360 camera and separate LiDAR, rear camera. Six airless TPU wheels, custom arm and folded structure preserved. Updated page image references only; no public prompt/process copy added. The previous pending-limit note is historical.

## Decal correction
Replaced Leap-2 concept with v3. Two imagegen edits referenced the original sponsor-panel photograph, official Schmalkalden coat (https://www.schmalkalden.de/stadtwappen/), Thuringian flag (https://www.thueringer-landtag.de/landtag/geschichte/landeswappen/), mission badge and original ODrive, Boehm, ARIES.space and Hochschule logo files. Prompt constrained edits to markings and preserved mechanical design. Generated heraldic details remain approximate at small scale.
