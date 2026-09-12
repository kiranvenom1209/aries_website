# Site content rules

Rules the team has set for the site's copy and for working on it. Each was stated by the
team or learned the hard way; none is derivable from the code. Longer implementation notes
live in `GEMINI.md`; this file is the short list to check before writing copy.

## Naming

- The next rover is written exactly **`Leap-2`** — this casing, with the hyphen — in
  source, prose, eyebrows, alt text and tests. No `LEAP-2`, `Leap 2`, `Leap Two`.
- The previous rover keeps **`LEAP-One`** (the organisers' sheet spells it `LEAPONE`).
- The LEAP series numbering: LEAP-One is Project 01, Leap-2 is Project 02.
- Team name in prose: `HSM Aries` / `HSM Aries.space`; on the ERC sheet: `HSM ARIES`.

## What is current status and what is history

- **Current status:** ERC 2026 finalist, 17th of 25, 1492.25 pts, Leap-2 in development.
  This is what the footer pill, hero cards and page intros say.
- **History, kept but never as status:** the June 2026 qualification, 1st of 124 entries
  worldwide with 239.75 of 250. It survives in the June news story and as one line in the
  partner facts. Nothing on the site may read "ERC 2026 QUALIFIED · #1 WORLDWIDE" as the
  present state.
- Result numbers: use only the figures in `erc-2026/hsm-aries-result.md`, in the wording
  given there. Mass is `−22 / 200`, not a "22-point penalty".

## What must not be invented

- No Leap-2 specifications, masses, dimensions, dates, budgets or target competitions.
  "ERC 2027" is unknown as of 2026-09-12. Leap-2 pages state requirements ("what it has
  to do"), never "how" or "by when"; specs are added as they are frozen by the team.
- No ranks for scoreboard lines the site does not already rank without checking
  `erc-2026/scoreboard.json` first.

## Two sources for news, one truth

- `src/lib/fallbackNews.ts` is what the deployed site renders (Netlify only re-seeds the
  CMS when `BOOTSTRAP_PUBLIC_CONTENT=true`). `src/seed/news.ts` is the CMS copy. Any change
  to a story's facts goes into **both**, with identical prose. Only `fallbackNews.ts`
  carries the `scoreboard` array.
- Story slugs are stable and referenced from pages and tests; do not rename.

## Working on the site

- Per-page styling goes in `src/app/(frontend)/styles/<page>.css`; do not edit
  `styles.css` directly for polish work.
- After adding any photo to `public/media/`, run `npm run media:responsive` so
  `public/media/r/` and `src/lib/responsive-manifest.json` are regenerated.
- The pipeline must always emit a variant at the photo's own width (capped at 2560).
  Until 2026-09-12 it only emitted bucket widths *strictly below* the original, so a
  1920-px photo was never served larger than 1280 and 116 of 156 photos were being
  browser-upscaled — the cause of "everything looks low-res". Check with: every entry in
  the manifest must end in `min(originalWidth, 2560)`.
- Full-bleed heroes (`sizes="100vw"`) still fall short on 2× displays because the curated
  sources are capped at 2560; the ERC photos stored at 1920 can be re-exported at 2560
  from the raw files (mapping in `design/erc-2026-finals-manifest.json`, raws in the
  gitignored `erc-2026/` folder of the upload worktree).
- AI-generated imagery comes out at ~1672 px and is soft at native size; upscale it with
  Real-ESRGAN before use in a large slot (`scripts/media/upscale-low-res.mjs`) and label it
  as a treatment on the page. The home hero is one such image, chosen by the team; the
  earlier renders elsewhere were replaced by real photographs.
- Raw ERC material (HEIC/DNG originals, previews, manifests) lives in the gitignored
  `erc-2026/` folder in the upload worktree and is never committed.
- Run a dev server for live review of visible changes before asking for sign-off.
- **Never push to GitHub without explicit, per-push approval.** Approval for one push
  does not carry to the next. Commit only when asked.
- Open items that need the team, not a guess: Impressum/Datenschutz pages, the Scientific
  Payload lead ordering vs. rank on /team, replacement portraits for three members, an
  institutional mailbox.
