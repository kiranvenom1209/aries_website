# LEAP-One turntable

The viewer uses renders of the original `public/media/models/leap-one.glb`, with a fixed orthographic camera, studio environment lighting, orange rim lighting, ambient occlusion and ground shadows. Orthographic projection keeps the world-to-pixel scale constant at every angle; do not reintroduce perspective or per-frame auto-fitting. Geometry and source colour assignments stay with the original model; pale neutral CAD materials receive a metallic finish.

`npm run render:leap-one-turntable -- --preview` renders five angles into the operating system's temporary directory. It never overwrites the sequence displayed on the site.

For a new complete sequence, run `npm run render:leap-one-turntable -- --version=v5` (choose an unused version). The script requires the installed Three.js, Sharp and Playwright dependencies and uses WebGL through Chromium. It renders 720 half-degree frames at 2400×1800, then exports 1600×1200 desktop and 900×900 mobile WebP images. The mobile images use the same centred square crop throughout.

Inspect the full orbit and verify all 720 files in both directories before changing the version in `RoverTurntable.tsx`. Never publish or point the viewer at an incomplete batch. A new URL also prevents browsers from mixing cached older renders with new ones.

Playback targets 60 fps. Only a small window of frames is decoded; old image bitmaps are closed. Playback stops when offscreen, when the browser tab is hidden, or when the visitor pauses or drags. Reduced-motion visitors get a still view and can choose to rotate it. The slider supports keyboard navigation and the reset button returns to the opening view.
