# Site-claims audit — ERC 2026 result

How the site's copy was checked against the official sheet, where every claim lives, and
what was corrected. Re-run the check with `python knowledge/erc-2026/verify.py`.

## Method (2026-09-12)

1. Dumped every cell of `Book1.xlsx` with coordinates (openpyxl, formulas and values —
   the sheet has no formulas, only pasted values, and 96 merged ranges for the header
   block and the four two-row affiliations).
2. Recomputed each team's Qualification, DOC SCORE and ERC FINAL SCORE from the
   components: all 25 rows add up exactly; the sheet is sorted by final score.
3. Computed HSM ARIES's competition rank in every numeric column (see
   `hsm-aries-result.md`).
4. Grepped the source tree for every numeric or ordinal claim (`1492`, `17th`, `of 25`,
   `364.25`, `239.75`, `265/300`, `−22`, `joint-highest`, `only penalty`, …) and read each
   hit in context.

## Where the result lives

| Surface | File | What it states |
| --- | --- | --- |
| Footer status pill | `src/components/Footer.tsx` | ERC 2026 finals · 17th of 25 · 1492.25 pts |
| Home "Proof in the field" | `src/app/(frontend)/page.tsx` (~L247–252) | 17/25 · 04/25 documentation 364.25/400 · 06/25 droning 265/300 |
| Home "Next Leap" readout table | `src/app/(frontend)/page.tsx` (~L283–287) | −22/200 mass · 43/340 traverse · 12/240 probing · doc 4th · droning 6th |
| /leap-one stats band + "Points lost" dossier | `src/app/(frontend)/leap-one/page.tsx` (~L96–110, 150–170) | overall, documentation, droning; traverse, maintenance, probing, mass |
| /leap-2 trade studies + stats band + brief | `src/app/(frontend)/leap-2/page.tsx` (~L33–100, 152–166) | traverse 43/340, maintenance 66/340, mass −22/200, probing 12/240; carried-forward strengths |
| /about programme record + principles + intro | `src/app/(frontend)/about/page.tsx` (~L22–36, 107) | 17/25, 4th, 6th, 25 finalists, 4–6 Sep |
| /team header strip + department records | `src/app/(frontend)/team/page.tsx` (~L43, 96, 117, 206, 211) | mass, droning, documentation + presentation per department |
| /partner hero metrics + prospectus | `src/app/(frontend)/partner/page.tsx` (~L37–51) | 17/25, 1492.25, mass −22 of 200, June qualification 1st of 124 |
| /contact status | `src/app/(frontend)/contact/page.tsx` (~L93) | LEAP-One · ERC 2026 finals · 17th of 25 · 1492.25 pts |
| Finals news story (live source) | `src/lib/fallbackNews.ts` (`scoreboard` array + `body`) | full 11-row scoreboard and the prose |
| Finals news story (CMS seed) | `src/seed/news.ts` (~L248–340) | same prose as rich text; no scoreboard array |
| Scoreboard renderer | `src/components/MissionStory.tsx` (`Scoreboard`) | bars, `points / max`, rank; negative rows get the penalty tone |
| News-list score strip | `src/components/NewsList.tsx` (`ScoreStrip`) | total + the two ranked lines |
| Tests | `tests/e2e/frontend.e2e.spec.ts`, `tests/int/api.int.spec.ts` | assert "17th of 25" and the story slug |
| Project notes | `GEMINI.md` §3.9 | prose summary of the above |

Story slug (everywhere): `mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow`.

## Findings

**Correct on first check** — every headline number, rank and maximum: 17th of 25,
1492.25/3000, documentation 364.25/400 4th, droning 265/300 6th, qualification 239.75/250
joint-highest, final report 124.5/150, presentation 229, AstroBio 215, sampling 197/440,
exploration 123/340, maintenance 66/340, traverse 43/340, probing 12/240, "top six", "25
teams", the dates and venue.

**Corrected 2026-09-12 — mass framing.** The site treated mass as a side penalty: the
scoreboard row was `{ label: "Mass penalty", points: -22, max: 0 }`, the renderer hid the
maximum for `max <= 0`, and prose said the overrun "cost 22 points that no other team
lost". On the sheet mass is *Additional Points for Mass (SUM, max 200 pts)*, one of the
ten components of the 3000; nine teams scored 200. The true gap to a full-mass team is
222 points, not 22. Changed in nine files (21 lines):

- `fallbackNews.ts` row → `{ label: "Mass", points: -22, max: 200 }`; both mass paragraphs
  in `fallbackNews.ts` and `seed/news.ts` now read "−22 of a possible 200 … nine teams took
  the full 200 … no other team went negative".
- `MissionStory.tsx`: penalty tone keys off `points < 0`; `/ max` is shown whenever
  `max > 0`; header counts "lines" (10) not "tasks" (9).
- Mass wording on home, /leap-one, /leap-2 (score cell `−22 / 200`), /partner, /team and
  GEMINI.md → "−22 / 200 · only negative score in the field".
- /leap-2: probing is "the lowest task score on the sheet" (mass is lower).

**Not changed, but watch:** the June "1st of 124" qualification claim comes from the June
stage, not from this sheet; the sheet only shows that 239.75 is joint-best *among the 25
finalists*. Keep the two statements distinct.

## Lesson

A `max: 0` in a data row is a modelling decision, not a fact from the source — check the
header of the source column before deciding a line is a penalty. The verifier now fails if
the site's mass row has any max other than 200.
