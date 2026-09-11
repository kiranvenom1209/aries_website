export type GalleryGroup =
  | 'erc-2026'
  | 'space-night-2026'
  | 'field-trials'
  | 'workshop'
  | 'outreach'
  | 'archive'

export type GalleryImage = {
  alt: string
  group?: GalleryGroup
  /**
   * CSS `object-position` for the cover-cropped tile, set only where the
   * centred crop would lose the subject (a portrait whose rover or faces sit
   * near one edge). Applies at every tile size; the lightbox shows the full frame.
   */
  position?: string
  src: string
}

export type GalleryChapter = {
  eyebrow: string
  group: GalleryGroup
  heading: string
  intro: string
  short: string
}

/**
 * Chapters of the expanded field record, in reading order. The eyebrow is the
 * numbered section label (`LABEL / NN`), the intro states only what the
 * captions already say. Images without a group land in the archive chapter.
 */
export const galleryChapters: GalleryChapter[] = [
  {
    eyebrow: 'ERC 2026 FINALS, KRAKÓW / 01',
    group: 'erc-2026',
    heading: 'Mars yard, pit tent, lecture hall.',
    intro: 'Three days at AGH in September: the chassis rebuilt on the pavement, the first sand runs, the maintenance panel, the rain day and the team presentation.',
    short: 'ERC 2026',
  },
  {
    eyebrow: 'SPACE NIGHT 2026, JENA / 02',
    group: 'space-night-2026',
    heading: 'LEAP-One and AQUILA on show.',
    intro: 'The stand at Ernst-Abbe-Hochschule Jena on 28 April 2026: the rover and the quadcopter on display, a camera crew, and the visit from the Thuringian state leadership.',
    short: 'Space Night',
  },
  {
    eyebrow: 'FIELD TRIALS, SCHMALKALDEN / 03',
    group: 'field-trials',
    heading: 'Out of the lab.',
    intro: 'LEAP-One and the AQUILA quadcopter on the grass outside the Hochschule Schmalkalden building during multi-terrain trials.',
    short: 'Field trials',
  },
  {
    eyebrow: 'WORKSHOP & FIRST BUILD / 04',
    group: 'workshop',
    heading: 'Bare chassis, live bus.',
    intro: 'CAN-bus testing on the bare chassis with the ODrive controllers wired in, the quadcopter on the bench, and the team after the first build phase.',
    short: 'Workshop',
  },
  {
    eyebrow: 'NEW MEMBERS & OUTREACH / 05',
    group: 'outreach',
    heading: 'Briefings, pitches, visitors.',
    intro: 'Department briefings for new members in the seminar room, the pitch at Boehm Group, and visits from KUKA Robotics and the Thuringian Ministry of Science.',
    short: 'Outreach',
  },
  {
    eyebrow: 'ARCHIVE / 06',
    group: 'archive',
    heading: 'Where it started.',
    intro: 'The first HSM Aries team photo and the earliest team meetings.',
    short: 'Archive',
  },
]

export type GalleryChapterImages = {
  chapter: GalleryChapter
  /** Index of each image in the flat, page-wide list (used by the lightbox). */
  indexes: number[]
}

/**
 * Splits a flat image list into the chapters above, keeping the original
 * newest-first order inside each chapter. Empty chapters are dropped and the
 * eyebrow numbers are reassigned so the sequence stays gap-free in DOM order.
 */
export function groupGalleryImages(images: GalleryImage[]): GalleryChapterImages[] {
  const byGroup = new Map<GalleryGroup, number[]>()
  images.forEach((image, index) => {
    const group = image.group ?? 'archive'
    const list = byGroup.get(group)
    if (list) list.push(index)
    else byGroup.set(group, [index])
  })

  return galleryChapters
    .filter((chapter) => byGroup.has(chapter.group))
    .map((chapter, position) => ({
      chapter: {
        ...chapter,
        eyebrow: chapter.eyebrow.replace(/\/ \d+$/, `/ ${String(position + 1).padStart(2, '0')}`),
      },
      indexes: byGroup.get(chapter.group) ?? [],
    }))
}

/**
 * The complete public gallery published on hsmaries.space, preserved in the
 * same newest-first order. The ERC 2026 finals set from Kraków leads the list:
 * the first six entries feed the homepage rail, the rest of the curated finals
 * photos follow, then the historical photo archive (renders, posters and
 * diagrams were retired once the rover had competed). CMS media is merged over
 * this archive at runtime.
 */
export const authoritativeGalleryImages: GalleryImage[] = [
  { alt: 'LEAP-One\'s wheels dig into the sand during the test, with the sponsor and flag decals on its flank.', group: 'erc-2026', src: '/media/erc-2026-finals-07-wheels-in-the-sand.jpg' },
  { alt: 'The gripper operates the switches on the maintenance panel.', group: 'erc-2026', src: '/media/erc-2026-finals-21-gripper-on-maintenance-panel.jpg' },
  { alt: 'LEAP-One’s rocker-bogie suspension works over the loose rock of the Mars yard.', group: 'erc-2026', src: '/media/erc-2026-finals-42-suspension-over-the-rocks.jpg' },
  { alt: 'The crew huddles around the control-station monitor in the pit tent, the table draped in the Thuringian and German flags.', group: 'erc-2026', src: '/media/erc-2026-finals-10-control-station-pit-tent.jpg' },
  { alt: 'LEAP-One carries the quadcopter past the navigation markers on the Mars yard.', group: 'erc-2026', src: '/media/erc-2026-finals-43-carrying-the-quadcopter-past-the-markers.jpg' },
  { alt: 'A team member kneels beside LEAP-One with sample containers mounted and the arm raised.', group: 'erc-2026', position: '50% 12%', src: '/media/erc-2026-finals-16-sample-containers-arm-raised.jpg' },
  { alt: 'The team lines up on the steps with the German flag, LEAP-One carrying the quadcopter in front.', group: 'erc-2026', src: '/media/erc-2026-finals-34-team-on-the-steps.jpg' },
  { alt: 'The LEAPONE competition plate is held up against the rocky Mars yard.', group: 'erc-2026', src: '/media/erc-2026-finals-28-leapone-plate-mars-yard.jpg' },
  { alt: 'The team poses with the Japanese team, both flags side by side and LEAP-One behind them.', group: 'erc-2026', src: '/media/erc-2026-finals-37-with-the-japanese-team.jpg' },
  { alt: 'The sunset is reflected in the glass facade above the ERC team-zone entrance at AGH.', group: 'erc-2026', src: '/media/erc-2026-finals-39-agh-team-zone-sunset.jpg' },
  { alt: 'LEAP-One stands on the campus plaza with its flag and sponsor decals.', group: 'erc-2026', position: '50% 12%', src: '/media/erc-2026-finals-01-campus-plaza-before-departure.jpg' },
  { alt: 'The ERC 2026 banner on the AGH fence announces the event dates in Kraków.', group: 'erc-2026', src: '/media/erc-2026-finals-02-agh-banner.jpg' },
  { alt: 'Morning light falls on the Mars yard, the ERC banner and the blue pit tents before the first runs.', group: 'erc-2026', src: '/media/erc-2026-finals-03-mars-yard-morning.jpg' },
  { alt: 'A team member fastens the suspension of the bare LEAP-One chassis on the pavement with a hex key set beside it.', group: 'erc-2026', src: '/media/erc-2026-finals-04-chassis-rebuild-suspension.jpg' },
  { alt: 'The rebuild continues on the grass with the tool kit and spare wheels laid out around the chassis.', group: 'erc-2026', src: '/media/erc-2026-finals-05-chassis-rebuild-wiring.jpg' },
  { alt: 'Team members crouch beside LEAP-One as it drives onto the sand of the Mars yard for a test run.', group: 'erc-2026', src: '/media/erc-2026-finals-06-first-sand-test.jpg' },
  { alt: 'Another team runs its rover on the gravel mounds of the Mars yard with the AGH campus behind.', group: 'erc-2026', src: '/media/erc-2026-finals-08-mars-yard-other-team-run.jpg' },
  { alt: 'Two team members lean over a laptop beside LEAP-One\'s mast in the indoor hall.', group: 'erc-2026', src: '/media/erc-2026-finals-09-laptop-check-indoor-hall.jpg' },
  { alt: 'A team member works at a laptop under the pit tent with the arena netting behind.', group: 'erc-2026', src: '/media/erc-2026-finals-11-pit-tent-laptop.jpg' },
  { alt: 'Team members repair wiring beside LEAP-One\'s arm and signal tower with a toolbox open on the grass.', group: 'erc-2026', src: '/media/erc-2026-finals-12-field-wiring-repair.jpg' },
  { alt: 'One team member sets the arm while another sorts tools on the lawn before a run.', group: 'erc-2026', src: '/media/erc-2026-finals-13-arm-setup-on-the-lawn.jpg' },
  { alt: 'Three team members walk LEAP-One out to the field with the controller in hand.', group: 'erc-2026', position: '50% 0%', src: '/media/erc-2026-finals-14-walking-leap-one-to-the-field.jpg' },
  { alt: 'LEAP-One crosses the sand and rock of the Mars yard with its arm raised and a marker on its mast.', group: 'erc-2026', src: '/media/erc-2026-finals-15-leap-one-mars-yard-arm-raised.jpg' },
  { alt: 'LEAP-One climbs the rocky slope with its suspension articulating over the stones.', group: 'erc-2026', position: '50% 25%', src: '/media/erc-2026-finals-17-leap-one-climbs-rocky-slope.jpg' },
  { alt: 'LEAP-One extends its arm on the Mars yard in front of the solar-panel stand and the red ERC dome.', group: 'erc-2026', src: '/media/erc-2026-finals-18-arm-extended-solar-stand.jpg' },
  { alt: 'LEAP-One faces the camera on the gravel with its arm extended and a sample container on top.', group: 'erc-2026', src: '/media/erc-2026-finals-19-leap-one-gravel-arm-extended.jpg' },
  { alt: 'LEAP-One reaches its arm toward the ERC maintenance panel beside marker 14.', group: 'erc-2026', src: '/media/erc-2026-finals-20-maintenance-panel-marker-14.jpg' },
  { alt: 'On the rain day LEAP-One works the rocky terrain under an umbrella with its arm wrapped in protective plastic.', group: 'erc-2026', src: '/media/erc-2026-finals-22-rain-day-umbrella.jpg' },
  { alt: 'LEAP-One carries the quadcopter on its top deck beside marker 9.', group: 'erc-2026', src: '/media/erc-2026-finals-23-carrying-the-quadcopter.jpg' },
  { alt: 'A low angle shows LEAP-One\'s sponsor panel, German flag and LEAPONE plate above the chevron wheels.', group: 'erc-2026', src: '/media/erc-2026-finals-24-sponsor-panel-low-angle.jpg' },
  { alt: 'The gripper, depth camera and emergency stop sit above the sponsor logos on LEAP-One\'s front.', group: 'erc-2026', src: '/media/erc-2026-finals-25-gripper-depth-camera-front.jpg' },
  { alt: 'LEAP-One\'s arm, sensor mast and sample container in front of the ERC banner.', group: 'erc-2026', position: '50% 5%', src: '/media/erc-2026-finals-26-arm-mast-erc-banner.jpg' },
  { alt: 'LEAP-One raises its arm on the grass beneath the blue ERC welcome banner.', group: 'erc-2026', src: '/media/erc-2026-finals-27-arm-raised-welcome-banner.jpg' },
  { alt: 'The team\'s quadcopter rests on its cardboard landing pad with a fiducial marker on the grass.', group: 'erc-2026', src: '/media/erc-2026-finals-29-quadcopter-landing-pad.jpg' },
  { alt: 'The carbon quadcopter sits on its printed marker sheet seen from above.', group: 'erc-2026', src: '/media/erc-2026-finals-30-quadcopter-marker-sheet.jpg' },
  { alt: 'A team member presents LEAP-One\'s mobility results during the team presentation in the lecture hall.', group: 'erc-2026', src: '/media/erc-2026-finals-31-presentation-lecture-hall.jpg' },
  { alt: 'The team lines up under the projector screen after the presentation.', group: 'erc-2026', src: '/media/erc-2026-finals-32-team-after-presentation.jpg' },
  { alt: 'The team gathers around LEAP-One on the Mars yard with the German and Thuringian flags.', group: 'erc-2026', src: '/media/erc-2026-finals-33-team-with-leap-one-and-flags.jpg' },
  { alt: 'The team gathers around LEAP-One under the AGH faculty lettering at the host university.', group: 'erc-2026', src: '/media/erc-2026-finals-35-team-at-agh.jpg' },
  { alt: 'Three team members stand behind LEAP-One with the quadcopter in hand.', group: 'erc-2026', src: '/media/erc-2026-finals-36-three-members-with-quadcopter.jpg' },
  { alt: 'Several teams gather with their rovers and drones under Indian and German flags.', group: 'erc-2026', src: '/media/erc-2026-finals-38-teams-with-rovers-and-drones.jpg' },
  { alt: 'LEAP-One picks its way across the rocks of the Mars yard beside marker 9, with the crowd and the ERC flag behind.', group: 'erc-2026', src: '/media/erc-2026-finals-40-rover-on-the-rocks.jpg' },
  { alt: 'LEAP-One climbs the gravel with the team’s quadcopter riding on its deck.', group: 'erc-2026', src: '/media/erc-2026-finals-41-quadcopter-on-deck.jpg' },
  { alt: 'The team gathers around LEAP-One on the HSM Aries stand at Space Night 2026.', group: 'space-night-2026', src: '/media/DSC02769-scaled.jpg' },
  { alt: 'A camera crew films LEAP-One on the HSM Aries stand at Space Night 2026.', group: 'space-night-2026', position: '35% 50%', src: '/media/DSC02608-scaled.jpg' },
  { alt: 'The AQUILA quadcopter and the rover\'s gripper laid out on the table at Space Night 2026.', group: 'space-night-2026', src: '/media/DSC02577-scaled.jpg' },
  { alt: 'Team members with representatives of the Thuringian state leadership beside LEAP-One at Space Night 2026.', group: 'space-night-2026', src: '/media/1777480994040.jpg' },
  { alt: 'A conversation in front of the Hochschule Schmalkalden banner during Space Night 2026.', group: 'space-night-2026', src: '/media/DSC02822-scaled.jpg' },
  { alt: 'LEAP-One on the grass outside the Hochschule Schmalkalden building during multi-terrain trials.', group: 'field-trials', position: '50% 68%', src: '/media/WhatsApp-Image-2026-05-10-at-19.49.07.jpeg' },
  { alt: 'Visitors from KUKA Robotics with the team and LEAP-One at Hochschule Schmalkalden.', group: 'outreach', src: '/media/1769862721077.jpg' },
  { alt: 'The AQUILA quadcopter set down on the grass during field operations.', group: 'field-trials', src: '/media/IMG_1913.JPG-scaled.jpeg' },
  { alt: 'Thuringia\'s Minister of Science examines LEAP-One during a visit to the lab.', group: 'outreach', src: '/media/WhatsApp-Image-2026-04-13-at-22.13.10.jpeg' },
  { alt: 'Team members and guests stand behind LEAP-One in the lab.', group: 'outreach', src: '/media/IMG_1852.JPG-scaled.jpeg' },
  { alt: 'The AQUILA quadcopter on the workshop bench, wired to a multimeter during assembly.', group: 'workshop', src: '/media/WhatsApp-Image-2026-05-10-at-19.49.02.jpeg' },
  { alt: 'The team around LEAP-One in the seminar room after the first build phase.', group: 'workshop', src: '/media/dsc01422-scaled.jpg' },
  { alt: 'Team members around LEAP-One\'s bare chassis during CAN-bus testing.', group: 'workshop', src: '/media/img_8789-scaled.jpg' },
  { alt: 'LEAP-One\'s bare chassis on a workshop pedestal during CAN-bus testing, ODrive controllers wired in.', group: 'workshop', src: '/media/img_8798-scaled.jpg' },
  { alt: 'New members follow the mechanical department briefing in the seminar room.', group: 'outreach', src: '/media/presentation-01.jpg' },
  { alt: 'A member presents the rover programme to new members in the seminar room.', group: 'outreach', src: '/media/presentation-01-03.jpg' },
  { alt: 'The electrical department briefing during the introduction for new members.', group: 'outreach', src: '/media/presentation-01-02.jpg' },
  { alt: 'The team pitches the rover programme in a conference room at Boehm Group.', group: 'outreach', src: '/media/pitching-in-boehm-scaled.jpg' },
  { alt: 'The engineering team meets in the lounge, laptops open.', group: 'archive', src: '/media/whatsapp-image-2025-03-26-at-4.01.37-pm-scaled.jpeg' },
  { alt: 'The founding members in the first HSM Aries team photo.', group: 'archive', src: '/media/hsm-aries-3.png' },
]

const positionByFile = new Map(
  authoritativeGalleryImages
    .filter((image) => image.position)
    .map((image) => [image.src.split('/').pop()?.toLowerCase() ?? image.src, image.position as string]),
)

/**
 * Framing for a tile: the entry's own `position`, else the curated one for the
 * same file (CMS copies and page-local lists reuse the archive photos), else
 * undefined so the stylesheet's default crop applies.
 */
export function galleryImagePosition(image: GalleryImage): string | undefined {
  if (image.position) return image.position
  const file = image.src.split('/').pop()
  if (!file) return undefined
  try {
    return positionByFile.get(decodeURIComponent(file).toLowerCase())
  } catch {
    return positionByFile.get(file.toLowerCase())
  }
}
