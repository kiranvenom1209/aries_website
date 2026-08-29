# HSM Aries interface specification

## Source of truth

- `01-home-hero.png` — header, hero, achievement rail, first-section preview.
- `02-mission-rover-dark.png` — dark mission and LEAP-One system sections.
- `03-news-gallery-footer-dark.png` — dark news, gallery, CTA, and footer.
- `04-admin-news.png` — CMS density, controls, table/list treatment.
- `05-login.png` — branded editor login composition.

The two `*-dark.png` boards replace their earlier mixed-light variants. The entire product is dark mode.

## Color lock

- Canvas: `#050607` (true near-black).
- Raised canvas: `#0a0d0f`.
- Interactive surface: `#11161a`.
- Primary text: `#f5f7f8`.
- Muted text: `#9aa4aa`.
- Hairline: `rgba(255, 255, 255, 0.15)`.
- Accent: `#ff5a1f` (rover-arm orange).
- Focus: `#ff7a45` with a 2 px exterior outline.
- Never use purple/pink UI gradients. Never tint documentary photography.

## Typography

- Display: Space Grotesk Variable, 600–700, tight tracking.
- UI and body: Inter Variable, 400–650.
- Hero: clamp from 3.75rem to 7rem, line-height 0.94.
- Section title: clamp from 2.5rem to 5rem, line-height 1.
- Body: 1rem–1.2rem, line-height 1.55.
- Controls: deliberate 0.9rem–1rem sizing; never browser-default typography.
- Micro labels are sparse, uppercase, letter-spaced, and must communicate real section structure.

## Grid and geometry

- Twelve-column layout, max width 1440 px, 32–64 px desktop gutters and 20 px mobile gutters.
- Corners are square or 2 px. Avoid floating rounded cards and giant wrappers.
- Use open lists, bands, rails, tables, and image frames with hairline rules.
- Desktop concept viewport is 1536×1024. The first viewport must show the achievement rail or its leading edge.

## Above-the-fold copy lock

- Nav: `Mission`, `LEAP-One`, `News`, `Gallery`, `Contact`, `Join Aries`.
- H1: `Built by students. Bound for Mars.`
- Supporting copy: `HSM Aries designs planetary rovers, scientific payloads and autonomous systems at Hochschule Schmalkalden.`
- Primary action: `Explore LEAP-One`.
- Achievement rail: `#1 ERC QUALIFICATION 2026`, `239.75 POINTS`, `124 INTERNATIONAL TEAMS`.
- Do not add an eyebrow, badge, pill, extra hero metric, or decorative headline.

## Public section order

1. Fixed quiet header.
2. Rover-led hero with a natural-color photo and black edge fade only.
3. ERC achievement rail.
4. Mission/team and the four disciplines.
5. LEAP-One systems: Mobility, Autonomy, Manipulation, Science.
6. Native interactive rover story and viewer.
7. Mission updates as an editorial list, not a card grid.
8. Field gallery rail.
9. Join/partner CTA.
10. Footer.

## Image treatment

- Preserve original photo color, identity, rover geometry, and branding.
- Hero media may use a black edge mask to merge into the canvas; no color overlay or wash.
- Stable aspect ratios, hard crop logic, 0–2 px radius, and hairline frames.
- Loading placeholders retain the final aspect ratio to prevent layout shift.

## Icon system

- Use Lucide only where its 1.5 px outline language matches the concept.
- Arrows use a simple line/chevron SVG with square caps and consistent optical alignment.
- Discipline icons are 24–32 px outlines, white by default, orange in active/hover states.
- Every icon button requires a visible label or accessible name, focus state, and 44 px minimum target.

## Motion language

- Scroll progress and tick rails communicate page position.
- Headings reveal through a short mask/shutter transition.
- Documentary images use a restrained edge scan and 1–2% parallax, never a tint.
- CTAs have magnetic pointer movement, arrow travel, and a fast hairline sweep.
- Orbit/telemetry arcs drift slowly behind mission headings.
- Gallery movement uses inertia with explicit previous/next controls.
- Native rover viewer supports orbit, pinch/zoom, guided camera views, reset, fullscreen, subsystem hotspots, and loading progress.
- All nonessential motion stops under `prefers-reduced-motion: reduce`; content and controls remain fully usable.

## CMS and login

- CMS uses the same dark tokens with denser spacing and Inter-based control typography.
- Content is managed through Payload collections with server-side access control, drafts, rich text, and media.
- `/login` is the branded entry point; `/admin` is the authenticated Payload workspace.
- Login retains an open grid layout rather than a floating rounded card.

## Responsive behavior

- Mobile header becomes a full-height dark menu with the same nav order.
- Hero stacks copy above media; headline remains the focal point and no content clips at 320 px.
- Achievement rail becomes a horizontal snap rail or three readable rows.
- Editorial news rows stack title above date without becoming generic cards.
- 3D viewer falls back to guided views and a static poster when WebGL or reduced-data conditions require it.
