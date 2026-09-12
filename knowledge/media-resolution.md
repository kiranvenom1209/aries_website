# Media resolution — what is real, what is upscaled, and the rules

State of `public/media/` after the 2026-09-12 resolution pass. Read this before adding or
replacing a photo; the verification steps at the end are how to check nothing regressed.

## Why photos looked low-res (fixed 2026-09-12)

Three separate causes, all fixed:

1. **Pipeline bug** — `scripts/build-responsive-media.mjs` emitted only bucket widths
   *strictly below* the source width, so a 1920-px photo was never served above 1280 and
   116 of 156 photos were browser-upscaled on every screen. Now every photo gets a variant
   at `min(originalWidth, 2560)`.
2. **ERC finals set capped at 1920 by the original export.** Re-exported from the raw
   4000–8064 px files at a 2560 long edge (`scripts/media/reexport-erc-finals.mjs`).
3. **Older photos with no better source** (team portraits, 2025 WhatsApp shots, the
   qualification-era images) — genuinely small files, 400–1600 px. Upscaled with
   Real-ESRGAN x4plus to a 2560 long edge (`scripts/media/upscale-low-res.mjs`).

WebP quality 80 was never the problem; it is unchanged.

## Provenance of what is on disk

| Group | Files | Pixels are | Source |
| --- | --- | --- | --- |
| ERC 2026 finals photos | `erc-2026-finals-01…43-*.jpg`, the two hero crops | **real**, 2560 long edge (#30 is 2048, its raw is 2048) | raws in the gitignored `erc-2026/` folder of the upload worktree; mapping in `picks.json` (slug → stem) |
| Mission Control dashboards, Space Night, 2025 hero renders | already ≥ 2560 | real | unchanged |
| 55 older photos & portraits | see `git log -1 --stat -- public/media` for the list; every jpg/jpeg/png under 1920 px that is not a logo or badge | **ML-upscaled** (Real-ESRGAN x4plus, capped 2560) | the only copies we have |
| Five of those were PNG photos | `2-e1776807359413`, `frank-schroedel-wirtschaftsspiegel`, `mars-rover-render2`, `Screenshot-2026-05-10-203543`, `sirleloimage` | now `.jpg` (they were fully opaque; 26 MB of PNG became 1.7 MB), capped 1920; references in `fallbackTeam.ts`, `fallbackNews.ts`, `seed/news.ts` updated | — |
| Home hero `erc-2026-cinematic-hero.jpg` | AI cinematic treatment of two ERC photos (team's choice, credited on the page; prompt in `design/erc-cinematic-hero.md`) | generator output 1672×941, **ML-upscaled** to 2560×1441 | lives in the main checkout |
| Logos, brand marks, department/rank badges | `*logo*`, `hsm-png.png`, `cropped-falcon-1.png`, `schroedel_540x540.png`, `l1-*`, `l1_*` | untouched | — |

Upscaled portraits look clean but slightly smoothed at 100 % — inherent to 4× on a
passport-size source. Real high-res portraits from the members are still the better fix
(three replacements were already on the open-items list).

## Rules

- **Never ship a photo whose long edge is under 1920 px.** For a full-bleed hero, 2560.
- If a raw exists, re-export from it; only ML-upscale when there is truly no better source,
  and never run the photo model over logos or badges.
- AI-generated imagery comes out at ~1672 px and is soft at 1:1 (small text and logos
  smear). Run it through Real-ESRGAN to 2560 before it goes in a 100vw slot — it cleans
  edges noticeably, though it cannot restore garbled logos. The home hero
  (`erc-2026-cinematic-hero.jpg`) is such an image, chosen by the team and labelled on the
  page as an AI treatment; it was upscaled this way.
- Photos are JPEG. PNG only for logos, badges and anything with real transparency — a PNG photo at 2560 px is 5–12 MB.
- After adding or replacing any photo: `npm run media:responsive`, then the check below.
- The pipeline caps at 2560. Full-bleed heroes on 2× displays therefore run at ~0.7× —
  accepted; raising the cap means larger originals across the board.

## Verification

```bash
# 1. every manifest entry must end at min(originalWidth, 2560)
node -e "const s=require('sharp'),m=require('./src/lib/responsive-manifest.json');(async()=>{let b=0;for(const [f,w] of Object.entries(m)){const d=await s('public/media/'+f).metadata();const ow=(d.orientation??1)>=5?d.height:d.width;if(Math.min(ow,2560)>w[w.length-1]){b++;console.log('short',f)}}console.log('short entries:',b)})()"

# 2. no referenced photo under 1920 px long edge (logos/badges excepted)
node scripts/media/upscale-low-res.mjs . <any> <any> plan   # should print "0 images to upscale"
```

In the browser (dev server, 1920-px viewport), for every `<img>` compare
`srcset`'s best candidate against `clientWidth × 2`; nothing but 100vw heroes should be
below 1.0.
