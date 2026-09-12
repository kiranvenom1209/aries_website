# HSM ARIES at the ERC 2026 finals — the result, line by line

Team `HSM ARIES` · affiliation `HOCHSCHULE SCHMALKALDEN` · country `GERMANY` · rover
`LEAPONE` (our spelling: LEAP-One) · sheet row 29 · **17th of 25 · 1492.25 / 3000**.
Event: ERC 2026 on-site finals, 4–6 September 2026, AGH University, Kraków.
Source: `scoreboard.csv`; ranks recomputed 2026-09-12 (`verify.py`).

## Every column

| Line | Points | Max | Rank of 25 | Field best | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| Preliminary report | 139.75 | 150 | 2nd | 140 (ProjectRED) | 0.25 behind the best |
| Video | 100 | 100 | joint 1st | 100 | 11 teams scored full marks |
| **Qualification** | **239.75** | 250 | **joint 1st** | 239.75 (also ARES Project) | "joint-highest in the finals field" — not "highest" |
| Final report | 124.5 | 150 | 6th | 135 (PUCRA) | |
| **Documentation** | **364.25** | 400 | **4th** | 371.75 (AGH) | strongest line; 7.5 behind the best |
| Science: Exploration | 123 | 340 | 20th | 281 (DJS Antariksh) | below field median 169 |
| Science: AstroBio | 215 | 300 | 14th | 285 | just below median 220 |
| Science: Surface & deep sampling | 197 | 440 | 8th | 314 (DIANA) | above median 148 |
| Navigation: Traverse | 43 | 340 | 21st | 300 | far below median 114.5 |
| **Navigation: Droning** | **265** | 300 | **6th** | 300 (EPFL) | median is 40; ten teams scored 15 |
| Maintenance | 66 | 340 | 17th | 233 (DIANA) | below median 102 |
| Probing | 12 | 240 | 21st | 200 | lowest *task* score; four teams at 0 |
| Presentation | 229 | 300 | 15th | 300 | just below median 237 |
| **Mass** | **−22** | 200 | **25th** | 200 (nine teams) | only negative mass score in the field |
| **ERC final score** | **1492.25** | 3000 | **17th** | 2547.9 (EPFL Xplore) | 36.25 behind 16th, 65.75 ahead of 18th |

Field-task subtotal (the eight task lines, no documentation, no mass): 1150 → 14th of 25
(field median 1191). Documentation and mass together are what move LEAP-One from a
mid-table field performance to 17th: documentation adds ~+18 over median, mass costs
200 against the median team's 178.

## Wording rules for the site

For detailed finals tables use these formulations. Public summary messaging now also includes the 124 registered teams and explains that 25 qualified; see the 12 September messaging update in ../site-content-rules.md.

- "17th of 25" · "1492.25 of 3000 points" · "25 finalist teams" · "4–6 September 2026,
  AGH University, Kraków".
- Documentation: "364.25 of 400, 4th of 25". Built on "the joint-highest qualification
  score in the finals field, 239.75 of 250" and "a final report of 124.5 of 150".
- Navigation droning: "265 of 300, 6th of 25".
- Presentation 229 of 300 · AstroBio 215 of 300 · sampling 197 of 440 · exploration
  123 of 340 · maintenance 66 of 340 · traverse 43 of 340 · probing 12 of 240.
- Mass: "**−22 of 200** — the only negative mass score in the field; nine teams took
  the full 200". Show it as `−22 / 200`, in the same form as every other line.
- "Documentation and navigation droning placed in the top six" (4th and 6th).
- Probing is "the lowest **task** score" — mass at −22 is lower, so don't say "lowest
  line on the sheet".

Do **not** say:

- "highest qualification score" (it is joint with ARES Project).
- "a 22-point penalty" / "cost 22 points that no other team lost" / `max: 0`. The
  mass line is worth 200; framing it as a 22-point side penalty understates the gap to
  the field by 200 points.
- Any rank for lines the site does not rank (presentation 15th, AstroBio 14th, …) unless
  the number is checked against `scoreboard.json` first.
- Anything about ERC 2027, Leap-2 specifications, dates or targets — none exist as of
  2026-09-12 (see `../site-content-rules.md`).

## History vs. current status

The June 2026 qualification stage result — **1st of 124 entries worldwide, 239.75 of 250**
— is true and stays as history (June news story, partner facts). It is not the site's
current status anywhere; the current status is the finals result above.
