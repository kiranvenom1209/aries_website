# ERC cinematic hero

Generated with the built-in Image Gen tool on 2026-09-12, using the current ERC photographs. Original photographs remain unchanged. This image is a creative photographic treatment, not an unaltered event record; the website labels it accordingly.

Production asset: `public/media/erc-2026-cinematic-hero.jpg` (2560 × 1441 — the 1672 × 941 generator output upscaled with Real-ESRGAN x4plus on 2026-09-12 so the 100vw hero slot no longer stretches it; see `knowledge/media-resolution.md`). Responsive WebP derivatives live in `public/media/r/erc-2026-cinematic-hero-*.webp` and are registered in `src/lib/responsive-manifest.json`.

References, in order:

1. `public/media/erc-2026-finals-hero-home.jpg`
2. `public/media/erc-2026-finals-40-rover-on-the-rocks.jpg`

## Final image prompt

Use case: lighting-weather. Asset: cinematic wide website hero photograph for HSM Aries student space robotics. Use image 1 as edit target; image 2 is supporting reference of the same real LEAP-One rover. Create a premium cinematic editorial treatment of this real ERC Mars yard photograph, panoramic 16:9 high resolution. Preserve the exact rover identity, six wheels, chassis, black-and-orange arm, mast, wiring, quadcopter on top, sponsor stickers, LEAPONE plate and proportions; retain actual gravel testing terrain, markers, banners and venue identity. Recompose by outpainting to put the entire rover in the right 58 percent of the frame, fully visible including mast and wheels, with dark understated gravel and softly defocused trees occupying the left 42 percent for white website text. Change lighting to moody late-afternoon with subtle warm copper sunlight on the rover and cool charcoal shadows. Natural cinematic contrast, beautiful mechanical detail, shallow atmospheric depth. Keep this recognizably a real outdoor test yard on Earth; no planets, stars, space landscape, invented machinery or extra wheels. No website layout, no overlaid captions, no watermarks. Keep built-in rover branding. This is a stylized photographic treatment, with crisp rover detail and an uncluttered background.

## Implementation direction

Retain the current homepage sections, routing, programme cards and black/orange identity. Hero uses #030607, #f5f7f8 and #ff5a1f; Space Grotesk display, Inter body, existing monospace labels and square controls. The generated photo receives only a left and bottom contrast fade, with no color filter or grid. Four deliberate headline lines on desktop, natural wrapping on mobile. Narrow screens place the photo above the reading area. The slim milestone strip reuses existing programme facts. Programme card refinement only increases the index scale and adds matching hover/focus accents.
