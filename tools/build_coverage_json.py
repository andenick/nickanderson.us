#!/usr/bin/env python3
"""
build_coverage_json.py — distil the FreeNIC coverage matrix into the landing-page dataset.

SOURCE OF TRUTH
    D:/Arcanum/Projects/freenic/Outputs/coverage_matrix.csv   (6,487 bytes, 21 source families)

OUTPUT
    data/coverage.json   — committed to the repo and served at /data/coverage.json

WHY THIS SCRIPT EXISTS
    The landing page ("The Coverage Gantt") renders real archival coverage, not decoration.
    Every bar must trace to a real file. This script is the audit trail between the warehouse
    artifact and the bytes the browser downloads: re-run it and you get the same JSON, or the
    upstream data changed and the site should be updated deliberately.

HONESTY CONTRACT
    * Row counts are copied verbatim from coverage_matrix.csv. Nothing is rounded.
    * The 21 families' base_rows SUM EXACTLY to 4,965,894,572 — the figure published as
      `base_rows` in Projects/freenic/site/app/data/freenic_counts.json (which also records
      base_tables = 58, n_families = 21, coverage_span "1782-2026"). This script ASSERTS that
      identity and fails loudly if it ever stops holding, so the headline is not a separate
      claim: it is the total of the bars on screen.

      NOTE ON PAIRING — do not cross these two measurements:
        coverage matrix  : 4,965,894,572 rows across 58 base tables   <- what this page shows
        live warehouse   : 4,968,889,667 rows across 62 base tables   <- Technical/coverage_analysis/live_counts.json
      The row count and the table count must always come from the same artifact.
    * 7 of the 21 families have NO time axis (cross-sectional reference tables: entity masters,
      crosswalks, peer benchmarks). They are NOT given invented dates. They are emitted in a
      separate `atemporal` list and shown on the page as a labelled group, so the row total on
      screen still reconciles to the headline.

USAGE
    python tools/build_coverage_json.py [--source PATH] [--out PATH] [--check]

    --check   verify the committed JSON matches what this script would produce (CI-friendly);
              exits 1 on drift and writes nothing.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

# The FreeNIC base-row count published in site/app/data/freenic_counts.json ("base_rows").
# The coverage matrix must sum to exactly this. Do not round it, anywhere, ever.
HEADLINE_BASE_ROWS = 4_965_894_572

DEFAULT_SOURCE = Path("D:/Arcanum/Projects/freenic/Outputs/coverage_matrix.csv")
DEFAULT_OUT = Path(__file__).resolve().parent.parent / "data" / "coverage.json"


def year_of(value: str) -> int | None:
    """Leading 4-digit year of an ISO-ish date, or None when there is no time axis."""
    value = (value or "").strip()
    if not value:
        return None
    head = value[:4]
    return int(head) if head.isdigit() else None


def tidy_tier(raw: str) -> str:
    """Provenance tier, normalised for display. Empty means the row carries no tier."""
    raw = (raw or "").strip()
    return raw if raw else "reference"


def first_provider(raw: str) -> str:
    """The coverage matrix pipe-separates providers; take the primary for the tooltip."""
    return (raw or "").split("|")[0].strip() or "FreeNIC"


def build(source: Path) -> dict:
    with source.open("r", encoding="utf-8-sig", newline="") as fh:
        rows = [r for r in csv.DictReader(fh) if (r.get("family") or "").strip()]

    if not rows:
        sys.exit(f"FATAL: no data rows parsed from {source}")

    timed: list[dict] = []
    atemporal: list[dict] = []
    total = 0

    for r in rows:
        base_rows = int((r["base_rows"] or "0").strip())
        total += base_rows

        record = {
            "name": r["family"].strip(),
            "rows": base_rows,
            "tables": int((r["n_tables"] or "0").strip()),
            "tier": tidy_tier(r["provenance_tier"]),
            "provider": first_provider(r["provider"]),
        }

        y0, y1 = year_of(r["period_min"]), year_of(r["period_max"])
        if y0 is not None and y1 is not None:
            record["start"] = y0
            record["end"] = y1
            record["start_date"] = r["period_min"].strip()
            record["end_date"] = r["period_max"].strip()
            timed.append(record)
        else:
            atemporal.append(record)

    # ---- The honesty assertion. If this fails, the page must not be published. ----
    if total != HEADLINE_BASE_ROWS:
        sys.exit(
            f"FATAL: coverage matrix sums to {total:,} but the published headline is "
            f"{HEADLINE_BASE_ROWS:,}. The landing page claims these reconcile. Fix the data or "
            f"the headline before publishing."
        )

    # Earliest start first — the bars cascade, which is the whole visual idea.
    timed.sort(key=lambda d: (d["start"], -d["rows"]))
    atemporal.sort(key=lambda d: -d["rows"])

    span_min = min(d["start"] for d in timed)
    span_max = max(d["end"] for d in timed)

    return {
        "_comment": (
            "Distilled from Projects/freenic/Outputs/coverage_matrix.csv by "
            "tools/build_coverage_json.py. Row counts are verbatim; the families sum exactly to "
            "total_rows. Do not hand-edit."
        ),
        "source": "FreeNIC warehouse coverage matrix",
        "source_file": "Outputs/coverage_matrix.csv",
        "total_rows": total,
        "family_count": len(timed) + len(atemporal),
        "table_count": sum(d["tables"] for d in timed + atemporal),
        "span_min": span_min,
        "span_max": span_max,
        "families": timed,
        "atemporal": atemporal,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--check", action="store_true", help="verify committed JSON is current; write nothing")
    args = ap.parse_args()

    if not args.source.exists():
        sys.exit(f"FATAL: source not found: {args.source}")

    payload = build(args.source)
    text = json.dumps(payload, indent=1, ensure_ascii=False) + "\n"

    if args.check:
        if not args.out.exists():
            sys.exit(f"DRIFT: {args.out} does not exist")
        if args.out.read_text(encoding="utf-8") != text:
            sys.exit(f"DRIFT: {args.out} is stale — re-run without --check")
        print(f"OK: {args.out} is current ({payload['total_rows']:,} rows across "
              f"{payload['family_count']} families)")
        return

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(text, encoding="utf-8")
    print(
        f"wrote {args.out} — {len(text):,} bytes\n"
        f"  {payload['family_count']} families "
        f"({len(payload['families'])} dated, {len(payload['atemporal'])} atemporal)\n"
        f"  {payload['total_rows']:,} rows  |  span {payload['span_min']}-{payload['span_max']}\n"
        f"  reconciles to freenic_counts.json base_rows: OK"
    )


if __name__ == "__main__":
    main()
