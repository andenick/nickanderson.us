#!/usr/bin/env python3
"""
optimize_figures.py — losslessly shrink the rendered figure PNGs in docs/.

WHY
    research.html carries 22 figures. knitr writes them at fig.retina=2
    (1344x960) as 24-bit RGB PNGs, but they are ggplot charts: each one actually
    contains only ~150-190 distinct colours. Storing them as 24-bit truecolour
    wastes roughly 20% of the bytes for no visual benefit whatsoever.

    Converting to a 256-entry adaptive palette is therefore **bit-exact**, not
    "visually lossless": with fewer than 256 source colours every pixel maps to
    itself. This script VERIFIES that per file and refuses to write any image it
    cannot reproduce exactly.

BUILD ORDER
    Run this AFTER rmarkdown::render_site(), because render_site regenerates the
    PNGs from the knitr cache and would overwrite the optimised files. Re-running
    it is safe and idempotent (already-optimised files simply do not shrink
    further). Skipping it costs ~100 KB on research.html and nothing else.

USAGE
    python tools/optimize_figures.py [--dry-run]
"""

from __future__ import annotations

import argparse
import io
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("Pillow is required: python -m pip install Pillow")

DOCS = Path(__file__).resolve().parent.parent / "docs"


def optimise(path: Path, dry_run: bool) -> tuple[int, int, bool]:
    """Return (old_bytes, new_bytes, changed). Never writes a non-identical image."""
    old_bytes = path.stat().st_size
    original = Image.open(path).convert("RGB")

    buf = io.BytesIO()
    Image.open(path).convert("P", palette=Image.ADAPTIVE, colors=256).save(
        buf, "PNG", optimize=True
    )

    # ---- Prove the round-trip is bit-exact before trusting it. ----
    buf.seek(0)
    roundtrip = Image.open(buf).convert("RGB")
    if roundtrip.size != original.size:
        return old_bytes, old_bytes, False
    if ImageChops.difference(original, roundtrip).getbbox() is not None:
        # Some pixel changed — this image has >256 colours. Leave it alone.
        return old_bytes, old_bytes, False

    new_bytes = buf.tell()
    if new_bytes >= old_bytes:
        return old_bytes, old_bytes, False

    if not dry_run:
        path.write_bytes(buf.getvalue())
    return old_bytes, new_bytes, True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    pngs = sorted(DOCS.rglob("*.png"))
    if not pngs:
        sys.exit(f"no PNGs found under {DOCS} — did you render the site first?")

    old_total = new_total = 0
    changed = skipped = 0
    for p in pngs:
        o, n, did = optimise(p, args.dry_run)
        old_total += o
        new_total += n
        if did:
            changed += 1
        else:
            skipped += 1

    verb = "would save" if args.dry_run else "saved"
    print(
        f"{len(pngs)} PNG(s): {changed} optimised, {skipped} left as-is "
        f"(already optimal or not provably lossless)\n"
        f"  {old_total/1024:.0f} KB -> {new_total/1024:.0f} KB "
        f"({verb} {(old_total-new_total)/1024:.0f} KB)"
    )


if __name__ == "__main__":
    main()
