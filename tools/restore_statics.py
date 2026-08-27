#!/usr/bin/env python3
"""Restore static (non-rendered) site assets into docs/ after render_site().

rmarkdown::render_site() PURGES the figure directory of every rendered page
(<page>_files/) and deletes untracked plumbing files in docs/ (llms.txt,
robots.txt, sitemap.xml, 404.html). Those files live canonically in
site_static/ and are copied back by this script. RUN AFTER EVERY RENDER.

Usage: python tools/restore_statics.py   (from the repo root)
"""
import shutil, pathlib, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, DST = ROOT / "site_static", ROOT / "docs"
if not SRC.is_dir():
    sys.exit("site_static/ missing")
for item in SRC.iterdir():
    dst = DST / item.name
    if dst.exists() and dst.is_dir():
        shutil.rmtree(dst)
    if item.is_dir():
        shutil.copytree(item, dst)
    else:
        shutil.copy2(item, dst)
print("restored:", sorted(p.name for p in SRC.iterdir()))

# render_site() also COPIES root-level non-Rmd files/dirs (tools/, site_static/,
# *.Rproj, CNAME is fine) into docs/. Remove the ones that are build tooling.
for junk in ("site_static", "tools", "nickanderson.Rproj"):
    p = DST / junk
    if p.exists():
        shutil.rmtree(p) if p.is_dir() else p.unlink()
        print("removed render-copied junk:", junk)

# also re-delete the lorem demo rmarkdown re-vendors on every render
lorem = DST / "site_libs" / "jqueryui-1.13.2" / "index.html"
if lorem.exists():
    lorem.unlink(); print("deleted lorem demo:", lorem.name)
