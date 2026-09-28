# LEAP-One CAD viewer

`/leap-one/cad` renders the rover's CAD assembly in real time with three.js (React Three Fiber and drei). It replaces the WordPress-era `CAD_View.html`, whose old URLs redirect here (`next.config.ts`).

## Model

The viewer loads `public/media/models/leap-one-web.glb`, a web copy of the lossless Onshape export `public/media/models/leap-one.glb` (the same file the turntable is rendered from). Rebuild it after every new export:

```bash
npm run model:web
```

The script runs `gltf-transform optimize` with meshopt compression and a very small simplification error (45.8 MB → 8.8 MB). Two flags matter: `--instance false` keeps every screw and bracket as its own node (GPU instancing merged repeated parts, which broke the exploded view and the part count), and `--join false --flatten false` keep the part hierarchy. Update `CAD_MODEL_BYTES` in `src/components/cad/cadTypes.ts` when the file size changes. The meshopt decoder ships inside three-stdlib; `useGLTF(url, false, true)` turns off Draco so nothing is fetched from Google's decoder CDN.

## Standing on the ground

As in the turntable render, the CAD suspension is slightly articulated and the gripper hangs below the wheels, so the lowest vertex is not the ground. `RoverModel` fits a plane through the six tyre contacts, levels the assembly onto it, and puts the ground 1.5 cm above the highest contact so every tyre sits in the regolith. Tyre contacts use exact vertex bounds (`Box3.setFromObject(node, true)`): a wheel spun about its axle has a rotated bounding box whose corner dips several centimetres below the tread. GLTFLoader sanitises node names (drops dots, spaces become underscores); the original CAD name is in `node.userData.name`, which tyre detection and the hover labels read.

## Scene

Solid mode stands the rover on a procedural Mars yard (`MarsTerrain.tsx`: seeded dunes, a flat pad, half-buried rocks, a dusk sky dome) lit by a low warm sun that is the only shadow caster, a cool rim light and a regolith bounce. Reflections come from drei `Lightformer`s, so no HDR file is loaded. X-ray and Blueprint switch to a dark inspection grid. The sun's shadow map is only redrawn when geometry or mode changes.

The exploded view lifts the rover first (to a height computed from the lowest part at full spread), then separates the parts; collapsing reassembles in the air and then lands. The camera rises and eases back with the lift, and the contact shadows are drawn once the rover has landed.

## Verifying

The in-app browser tab is often throttled. Headless Playwright can use the real GPU on this machine: launch Chromium with `--enable-gpu --use-angle=d3d11 --ignore-gpu-blocklist` (SwiftShader is too slow for 1.85 M triangles), set a consent record in `localStorage` via `addInitScript` so the banner stays out of the way, and wait for `.cad-viewer[data-ready]`.
