# HSM Aries

The public HSM Aries mission website and authenticated editorial newsroom. It preserves the published WordPress content while replacing the old presentation and editing workflow with a dark, responsive Next.js and Payload CMS application.

## Local development

Requirements: Node.js 20.9 or newer and npm.

1. Copy `.env.example` to `.env` and replace `PAYLOAD_SECRET` with a long random value.
2. Install exact dependencies with `npm ci`.
3. Import curated public content with `npm run seed`.
4. Start the site with `npm run dev`.
5. Open `http://localhost:3000`.

The public team login is at `/login`. On a new database, `/admin` opens Payload's first-user setup. The server promotes that first account to Administrator.

## Mission Control

The protected CMS at `/admin` manages:

- news and draft publishing;
- public media and galleries;
- the verified team roster and multi-department assignments;
- sponsors, downloads and global site settings;
- editor and administrator accounts.

Editors manage public content. Administrators can also manage accounts. Authentication includes login-attempt limits and timed lockout.

## Verification

```bash
npm run generate:types
npm run generate:importmap
npm run lint
npm run test:int
npm run test:e2e
npm run build
```

`npm run seed` is idempotent. It updates matching public records, activates the 25 verified current profiles, and deactivates obsolete imported profiles without deleting them.

## Content and assets

- Public assets are served from `public/media`.
- Responsive photos: `npm run media:responsive` (`scripts/build-responsive-media.mjs`) scans `src/` for every `/media/<file>.(jpg|jpeg|png)` reference and writes WebP variants to `public/media/r/<stem>-<width>.webp` (144 / 384 / 640 / 960 / 1280 / 1920 / 2560, only widths below the original), recording them in `src/lib/responsive-manifest.json`. `next.config.ts` uses the custom loader `src/lib/imageLoader.ts` so `next/image` emits a real `srcset` from those static files with no image CDN; anything not in the manifest (CMS uploads under `/api/media/file/`, SVGs, sub-folders) is served unchanged. Re-run the script after adding or replacing a photo and commit `public/media/r/` and the manifest; `--force` re-encodes existing variants.
- The native LEAP-One viewer uses an optimized 12.16 MB GLB and a 360-frame fixed-horizon turntable sequence at `/media/leap-one-turntable`.
- All 29 recovered public news stories plus the ERC 2026 finals report remain available; CMS versions override matching stories by slug.
- The ERC 2026 finals photo set is the 39 curated `public/media/erc-2026-finals-NN-<slug>.jpg` files (1920/2560 px long edge, mozjpeg, EXIF stripped), registered in `src/lib/gallery.ts` and the `erc-2026-finals` gallery seed; the raw event dump in `erc-2026/` is gitignored and must never be committed or deployed.
- The team page follows the live hierarchy: two principal advisors, five mentors, mission command and eight departmental manifests.
- Raw WordPress archives and private migration materials are excluded through `.gitignore` and must never be deployed.

Design concepts, implementation guidance and the fidelity ledger live under `design/`.
