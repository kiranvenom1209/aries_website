# LEAP-One turntable

The viewer uses renders of the original `public/media/models/leap-one.glb`, with a fixed orthographic camera, studio environment lighting, orange rim lighting, ambient occlusion and ground shadows. Orthographic projection keeps the world-to-pixel scale constant at every angle; do not reintroduce perspective or per-frame auto-fitting. Geometry and source colour assignments stay with the original model; pale neutral CAD materials receive a metallic finish.

`npm run render:leap-one-turntable -- --preview` renders five angles into the operating system's temporary directory. It never overwrites the sequence displayed on the site.

For a new complete sequence, run `npm run render:leap-one-turntable -- --version=v5` (choose an unused version). The script requires the installed Three.js, Sharp and Playwright dependencies and uses WebGL through Chromium. It renders 720 half-degree frames at 2400×1800, then exports 1600×1200 desktop and 900×900 mobile WebP images. The mobile images use the same centred square crop throughout.

Inspect the full orbit and verify all 720 files in both directories before changing the version in `RoverTurntable.tsx`. Never publish or point the viewer at an incomplete batch. A new URL also prevents browsers from mixing cached older renders with new ones.

Playback targets 60 fps. Compressed frames stay resident in a wide window; only a small window around the current angle is decoded, and older bitmaps are closed. The rover turns slowly on its own, a drag or flick takes over immediately (fast drags show the nearest decoded frame so motion never waits on the network), and the idle turn eases back in a few seconds after the last interaction. Playback stops when offscreen or when the browser tab is hidden. Reduced-motion visitors get a still view that they can still drag, without coasting. The stage is keyboard focusable: the arrow keys rotate the rover and Home returns to the opening view. There are no visible controls; the frame edges are masked so the rover stands directly on the page.
