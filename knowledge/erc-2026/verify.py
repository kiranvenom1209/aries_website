#!/usr/bin/env python3
"""Re-check the ERC 2026 knowledge data and the site's claims against it.

Run from the repo root:  python knowledge/erc-2026/verify.py
Exit code 1 on any failure. No third-party dependencies.
"""
from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
TEAM = "HSM ARIES"
TASKS = [
    "science_exploration", "science_astrobio", "science_sampling",
    "navigation_traverse", "navigation_droning", "maintenance", "probing",
    "presentation",
]
META = ("rank", "team", "affiliation", "country", "rover", "qualified")
failures: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)
    print("FAIL", msg)


def main() -> int:
    rows = list(csv.DictReader((HERE / "scoreboard.csv").open(encoding="utf-8")))
    data = json.loads((HERE / "scoreboard.json").read_text(encoding="utf-8"))

    # 1. Shape and internal sums
    if len(rows) != 25:
        fail(f"expected 25 teams in scoreboard.csv, found {len(rows)}")
    prev = None
    for r in rows:
        q = float(r["preliminary_report"]) + float(r["video"])
        d = q + float(r["final_report"])
        total = d + sum(float(r[k]) for k in TASKS) + float(r["mass"])
        for label, got, want in (
            ("qualification", float(r["qualification"]), q),
            ("documentation", float(r["documentation"]), d),
            ("final_score", float(r["final_score"]), total),
        ):
            if abs(got - want) > 1e-9:
                fail(f"{r['team']}: {label} {got} != recomputed {want}")
        score = float(r["final_score"])
        if prev is not None and score > prev:
            fail(f"{r['team']}: sheet not sorted by final_score")
        prev = score

    # 2. Ranks in the JSON match a fresh computation
    cols = [c for c in rows[0] if c not in META]
    by_team = {t["team"]: t for t in data["teams"]}
    for r in rows:
        for c in cols:
            want = 1 + sum(1 for o in rows if float(o[c]) > float(r[c]))
            got = by_team[r["team"]]["ranks"][c]
            if got != want:
                fail(f"{r['team']} rank[{c}] json={got} recomputed={want}")

    # 3. HSM ARIES headline facts the site relies on
    h = next(r for r in rows if r["team"] == TEAM)
    documented = {
        "rank": 17, "final_score": 1492.25, "documentation": 364.25,
        "qualification": 239.75, "final_report": 124.5, "navigation_droning": 265,
        "presentation": 229, "science_astrobio": 215, "science_sampling": 197,
        "science_exploration": 123, "maintenance": 66, "navigation_traverse": 43,
        "probing": 12, "mass": -22,
    }
    for k, want in documented.items():
        if float(h[k]) != want:
            fail(f"{TEAM} {k}: csv {h[k]} != documented {want}")
    hr = by_team[TEAM]["ranks"]
    for k, want in (("documentation", 4), ("navigation_droning", 6), ("qualification", 1),
                    ("final_score", 17), ("mass", 25)):
        if hr[k] != want:
            fail(f"{TEAM} rank[{k}] = {hr[k]}, site says {want}")
    if sum(1 for r in rows if float(r["mass"]) < 0) != 1:
        fail("site says HSM ARIES is the only negative mass score; csv disagrees")
    if sum(1 for r in rows if float(r["mass"]) >= 200) != 9:
        fail("site says nine teams scored the full 200 on mass; csv disagrees")
    if sum(1 for r in rows if float(r["qualification"]) == float(h["qualification"])) != 2:
        fail("site says qualification 239.75 is joint-highest (two teams); csv disagrees")
    if data["maxima"]["mass"] != 200:
        fail("scoreboard.json maxima.mass must be 200")

    # 4. The site must not regress to the old mass framing
    site = ROOT / "src"
    news = (site / "lib" / "fallbackNews.ts").read_text(encoding="utf-8")
    m = re.search(r'"label":\s*"Mass[^"]*",\s*"points":\s*-22,\s*"max":\s*(\d+)', news)
    if not m:
        fail("fallbackNews.ts: mass scoreboard row not found")
    elif m.group(1) != "200":
        fail(f"fallbackNews.ts: mass row max is {m.group(1)}, must be 200")
    banned = [
        r"22-point mass penalty",
        r"cost 22 points that no other team lost",
        r"only penalty in the field",
        r"lowest line on the sheet",
        r"(?<!joint-)highest qualification score",  # must be "joint-highest"
    ]
    for path in list(site.rglob("*.ts")) + list(site.rglob("*.tsx")):
        if path.name == "payload-types.ts":
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pat in banned:
            for mm in re.finditer(pat, text):
                line = text.count("\n", 0, mm.start()) + 1
                fail(f"{path.relative_to(ROOT)}:{line}: banned wording /{pat}/")

    if failures:
        print(f"\n{len(failures)} problem(s).")
        return 1
    print("OK: scoreboard sums, ranks, HSM facts and site wording all consistent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
