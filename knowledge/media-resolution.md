# Media resolution — what is real, what is upscaled, and the rules

State of `public/media/` after the 2026-09-12 resolution pass. Read this before adding or
replacing a photo; the verification steps at the end are how to check nothing regressed.

## Why photos looked low-res (fixed 2026-09-12)

Three separate causes, all fixed:

1. **Pipeline bug** — `scripts/build-responsive-media.mjs` emitted only bucket widths
   *strictly below* the source width, so a 1920-px photo was never served above 1280 and
   116 of 156 photos were browser-upscaled on every screen. Now every photo gets a variant
   at `min(originalWidth, 3840)` (cap raised from 2560 later the same day, see 4).
4. **`sizes` hints that ignored cover-scaling.** A `fill` image with `object-fit: cover` in a
   box taller than its own aspect is scaled by *height*; the browser still picks the srcset
   candidate from `sizes`, so "50vw" fetched a 960/1280-px file for a slot that needed
   ~1500 CSS px (the home team photo was served at 0.52×). Fixed per slot (home proof boxes
   78vw, about workshop 92vw, advisors 58vw, mentor tiles 44vw, story hero 64vw, CSS-zoomed
   team tiles scale their hint by the zoom). `scripts/media/audit-image-sizes.mjs` finds these.
5. **Larger originals existed for 71 photos.** `scripts/media/find-hires-sources.mjs`
   (perceptual hash, not filenames) matched site photos against the raw ERC folder and
   `wp-content/uploads`; a workflow of agents verified each pair on a comparison sheet and
   swept Downloads, the August WordPress backup zip and other folders for the rest. 56 verified
   matches were re-exported at 3840 from their raws; the backup zip supplied the unscaled
   Sony originals for the seven `DSC0…-scaled` frames (which are also the /about, /team and
   /join `space-night-*` heroes), two renders, and the leap-2 hero raw.
2. **ERC finals set capped at 1920 by the original export.** Re-exported from the raw
   4000–8064 px files at a 2560 long edge (`scripts/media/reexport-erc-finals.mjs`).
3. **Older photos with no better source** (team portraits, 2025 WhatsApp shots, the
   qualification-era images) — genuinely small files, 400–1600 px. Upscaled with
   Real-ESRGAN x4plus to a 2560 long edge (`scripts/media/upscale-low-res.mjs`).

WebP quality 80 was never the problem; it is unchanged.

## Provenance of what is on disk

| Group | Files | Pixels are | Source |
| --- | --- | --- | --- |
| ERC 2026 finals photos | `erc-2026-finals-01…43-*.jpg`, the three hero crops | **real**, 3840 long edge where the raw allows (#09 is a 1280 video frame, ML-upscaled; #20/#21 stay at 2560 — their raws were judged no sharper; #30's raw is 2048) | raws in the gitignored `erc-2026/` folder of the upload worktree; mapping in `picks.json` (slug → stem) |
| Sony `DSC0…-scaled` frames, `space-night-rover/team`, `dsc01…-scaled`, `pitching-in-boehm`, `rover-4`, `img_87…`, `3d-tyre`, `IMG_18…/19…` | 20 files | **real**, 3840 (or the original's size) | `wp-content/uploads` originals; seven from the August WordPress backup zip in Downloads (extracted to the session scratchpad only) |
| Mission Control dashboards | `*-dashboard.png` | real, 3584 | unchanged |
| 55 older photos & portraits | see `git log -1 --stat -- public/media` for the list; every jpg/jpeg/png under 1920 px that is not a logo or badge | **ML-upscaled** (Real-ESRGAN x4plus, capped 2560) | the only copies we have |
| Five of those were PNG photos | `2-e1776807359413`, `frank-schroedel-wirtschaftsspiegel`, `mars-rover-render2`, `Screenshot-2026-05-10-203543`, `sirleloimage` | now `.jpg` (they were fully opaque; 26 MB of PNG became 1.7 MB), capped 1920; references in `fallbackTeam.ts`, `fallbackNews.ts`, `seed/news.ts` updated | — |
| Home hero `erc-2026-cinematic-hero.jpg` | AI cinematic treatment of two ERC photos (team's choice, credited on the page; prompt in `design/erc-cinematic-hero.md`) | generator output 1672×941, **ML-upscaled** to 3840×2161 | committed on main |
| `hsm-aries-3`, `mars-rover-leap-one-1` | were PNG | now `.jpg` at 3840 from the EWWW pre-optimisation backups in the WordPress zip; legacy `.png` paths resolve via `src/lib/mediaPaths.ts` | — |
| Logos, brand marks, department/rank badges | `*logo*`, `hsm-png.png`, `cropped-falcon-1.png`, `schroedel_540x540.png`, `l1-*`, `l1_*` | untouched | — |

Upscaled portraits look clean but slightly smoothed at 100 % — inherent to 4× on a
passport-size source. Real high-res portraits from the members are still the better fix
(three replacements were already on the open-items list).

## Rules

- **Never ship a photo whose long edge is under 1920 px.** For a full-bleed hero, 3840 if the source allows.
- **A renamed media file needs an entry in `src/lib/mediaPaths.ts`** — CMS rows (team
  `portraitPath`, story image strings) keep the old path, and the deployed database was
  seeded before any rename. The pipeline ignores that file when scanning for references.
- **`sizes` must describe the pixels the slot needs, not the box width.** For a cover box
  taller than the image, that is `boxHeight × imageAspect`. Run
  `node scripts/media/audit-image-sizes.mjs <baseUrl> 1920 2` after touching a layout.
- If a raw exists, re-export from it; only ML-upscale when there is truly no better source,
  and never run the photo model over logos or badges.
- AI-generated imagery comes out at ~1672 px and is soft at 1:1 (small text and logos
  smear). Run it through Real-ESRGAN to 2560 before it goes in a 100vw slot — it cleans
  edges noticeably, though it cannot restore garbled logos. The home hero
  (`erc-2026-cinematic-hero.jpg`) is such an image, chosen by the team and labelled on the
  page as an AI treatment; it was upscaled this way.
- Photos are JPEG. PNG only for logos, badges and anything with real transparency — a PNG photo at 2560 px is 5–12 MB.
- After adding or replacing any photo: `npm run media:responsive`, then the check below.
- The pipeline caps at 3840 (`deviceSizes` includes 3840). Full-bleed heroes on 2× displays
  now sit at 0.85–0.9×; the rest of the shortfall is the crop width of the raw.

## Verification

```bash
# 1. every manifest entry must end at min(originalWidth, 3840)
node -e "const s=require('sharp'),m=require('./src/lib/responsive-manifest.json');(async()=>{let b=0;for(const [f,w] of Object.entries(m)){const d=await s('public/media/'+f).metadata();const ow=(d.orientation??1)>=5?d.height:d.width;if(Math.min(ow,3840)>w[w.length-1]){b++;console.log('short',f)}}console.log('short entries:',b)})()"

# 2. no referenced photo under 1920 px long edge (logos/badges excepted)
node scripts/media/upscale-low-res.mjs . <any> <any> plan   # should print "0 images to upscale"
```

In the browser (dev server, 1920-px viewport), for every `<img>` compare
`srcset`'s best candidate against `clientWidth × 2`; nothing but 100vw heroes should be
below 1.0.
