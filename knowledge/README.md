# Knowledge base

Facts the site's copy depends on, kept next to the code so they can be checked
instead of remembered. Everything here was derived from a primary source named in
the file; nothing is a guess. When a fact changes, change it here first, then the
copy, then run the verifier.

| Path | What it holds |
| --- | --- |
| [`erc-2026/scoreboard.csv`](erc-2026/scoreboard.csv) | The official ERC 2026 finals scoreboard, all 25 teams, one row per team, exactly as in the organisers' sheet |
| [`erc-2026/scoreboard.json`](erc-2026/scoreboard.json) | Same data plus per-column competition ranks for every team and field statistics (best, median, mean, teams at max) |
| [`erc-2026/scoring-structure.md`](erc-2026/scoring-structure.md) | How an ERC 2026 final score is composed: columns, maxima, bonuses, what "3000" means |
| [`erc-2026/hsm-aries-result.md`](erc-2026/hsm-aries-result.md) | HSM ARIES / LEAP-One's result line by line, its rank in every column, and the wording rules for the site |
| [`erc-2026/field-analysis.md`](erc-2026/field-analysis.md) | What the whole field did: leaders per task, distributions, where LEAP-One sits, internal what-ifs (not for publication) |
| [`erc-2026/site-claims-audit.md`](erc-2026/site-claims-audit.md) | Every place the result appears in the codebase, how it was verified against the sheet, and the corrections made |
| [`erc-2026/verify.py`](erc-2026/verify.py) | Re-checks the CSV's internal sums, recomputes ranks, and greps the site for claims that contradict the data |
| [`media-resolution.md`](media-resolution.md) | Which photos are real pixels and which are ML-upscaled, the never-under-1920 rule, the pipeline bug history, and the verification commands |
| [`site-content-rules.md`](site-content-rules.md) | Copy and naming rules the team has set (Leap-2 spelling, what is history vs. current status, dual news sources, push approval) |

Run the verifier from the repo root:

```bash
python knowledge/erc-2026/verify.py
```

Source spreadsheet: `Book1.xlsx` (organisers' results sheet, received 11 September 2026).
It is not committed; the CSV is its faithful extraction and is the reference from here on.
