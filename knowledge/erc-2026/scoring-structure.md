# ERC 2026 — how the final score is built

Source: column headers of the official finals scoreboard (`scoreboard.csv`), rows 7–10
of the organisers' sheet. Verified 2026-09-12 by recomputing every team's sums.

## Stages

```
Preliminary report (max 150) + Video (max 100)            = QUALIFICATION (max 250)
QUALIFICATION (250)        + Final report (max 150)       = DOC SCORE      (max 400)
DOC SCORE (400) + 8 task lines + Additional points for mass = ERC FINAL SCORE (max 3000)
```

All 25 finalists carry `Qualified = 1`. The qualification score earned in June is
carried into the finals as the first half of the documentation score — it is not a
separate ranking at the finals.

## The ten components of the 3000

| # | Column on sheet | Base max | Bonus | Max shown on sheet |
| --- | --- | ---: | ---: | ---: |
| 1 | DOC SCORE (qualification + final report) | 400 | — | 400 |
| 2 | Science Task: Exploration | 300 | +40 | 340 |
| 3 | Science Task: AstroBio | 300 | — | 300 |
| 4 | Science Task: Surface & Deep Sampling | 400 | +40 | 440 |
| 5 | Navigation Task: Traverse | 300 | +40 | 340 |
| 6 | Navigation Task: Droning | 300 | — | 300 |
| 7 | Maintenance Task | 300 | +40 | 340 |
| 8 | Probing Task | 200 | +40 | 240 |
| 9 | Presentation Task | 300 | — | 300 |
| 10 | Additional Points for Mass | 200 | — | 200 |
| | **Total** | **3000** | +200 | 3200 |

- The **3000** on the sheet is the sum of the *base* maxima. The five +40 bonuses sit on
  top, so a perfect sheet would read 3200; nobody came near it (best: 2547.9).
- **Mass is a scored component, not a penalty column.** Its maximum is 200 and nine teams
  scored the full 200. A rover over the allowance goes *negative* (HSM ARIES: −22).
  Never describe it as "max 0" or "a 22-point penalty" — the line is worth 200.
- Task scores can be negative (STAR Dresden: maintenance −20) and several tasks have a
  visible floor score: droning shows 15 for ten teams (participation-level), probing shows
  0 for four.

## Ranking

The sheet is sorted by ERC FINAL SCORE descending and numbered 1–25 in column `No.`.
Per-column ranks in `scoreboard.json` use competition ranking (1 + number of teams
strictly above), so ties share a rank — e.g. HSM ARIES and ARES Project are joint 1st
on qualification at 239.75.

## Sheet quirks worth knowing

- Four teams' affiliations span two sheet rows (Project Scorpio, Raptors PL, UCU Space
  Robotics, PUCRA); the extra row carries only the second affiliation string. The CSV
  joins them with ` / `.
- Rover names are as typed by the teams: `LEAPONE` for LEAP-One, `Tras2`, `HAL-062`.
  UPC Space Program left the rover name blank.
- Country spellings are inconsistent on the sheet (`GERMANY`, `EGYPT`, `Türkiye`); the
  CSV keeps them verbatim.
