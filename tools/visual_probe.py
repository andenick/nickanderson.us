#!/usr/bin/env python3
"""Visual occlusion probe for nickanderson.us (NC3, 2026-08-27).

Asserts, for every page x width: body padding >= navbar height, first
heading TEXT (not border box - rmarkdown's anchor-offset tucks the border
box up behind the navbar by design) clears the navbar, no clipped boxes,
no truncated text, no horizontal overflow. Exits non-zero on failure.

Usage: python tools/visual_probe.py [base_url]
Default base: https://www.nickanderson.us/
"""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://www.nickanderson.us/"
PAGES = ["", "research.html", "tnse.html", "aitools.html", "projects.html",
         "data.html", "about.html", "contact.html"]  # 404.html: no navbar chrome by design
WIDTHS = [1440, 992, 834, 768, 390]
CHECK = """() => {
  const vis = el => { const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0; };
  const nav = document.querySelector('.navbar-fixed-top');
  if (!nav) return {fails: ['no fixed navbar found']};
  const navB = Math.ceil(nav.getBoundingClientRect().bottom);
  const out = {fails: [], navH: Math.round(nav.getBoundingClientRect().height)};
  out.pad = parseInt(getComputedStyle(document.body).paddingTop) || 0;
  if (out.pad < out.navH - 2) out.fails.push(`bodyPad ${out.pad} < navbar ${out.navH}`);
  var firstHead = null;
  var cand = document.querySelectorAll('.main-container h1, .main-container h2, .main-container p');
  for (var ci = 0; ci < cand.length; ci++) { if (vis(cand[ci])) { firstHead = cand[ci]; break; } }
  if (firstHead !== null && firstHead.getBoundingClientRect) {
    var t = Math.round(firstHead.getBoundingClientRect().top) + (parseInt(getComputedStyle(firstHead).paddingTop) || 0);
    var walker = document.createTreeWalker(firstHead, NodeFilter.SHOW_TEXT);
    var tn = walker.nextNode();
    if (tn) { var rg = document.createRange(); rg.selectNodeContents(tn); t = Math.round(rg.getBoundingClientRect().top); }
    if (t < navB - 2) out.fails.push('first heading text top ' + t + ' < navbar bottom ' + navB);
  }
  document.querySelectorAll('div,section,p,td,li').forEach(el => {
    if (!vis(el)) return;
    const cs = getComputedStyle(el);
    if ((cs.overflow === 'hidden' || cs.overflowY === 'hidden') &&
        el.scrollHeight > el.clientHeight + 8 && el.clientHeight > 0)
      out.fails.push('clipped box ' + el.tagName + '.' + String(el.className).split(' ')[0]);
  });
  const vw = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > vw + 1) out.fails.push('horizontal overflow');
  /* NV4 2026-08-28: text anomalies - nothing visible above the navbar (outside it),
     and no markup/YAML/template signatures rendering as content. */
  const inNav = el => { while (el) { if (el.classList && el.classList.contains('navbar')) return true; el = el.parentElement; } return false; };
  const sig = /^-{3,}|^(title|description|layout|output):|^<[a-z]|^class=|^href=|\]\(|^\{/;
  const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n2;
  while ((n2 = w2.nextNode())) {
    const t2 = n2.textContent.trim();
    if (!t2 || inNav(n2)) continue;
    const r2 = document.createRange(); r2.selectNodeContents(n2);
    const rr2 = r2.getBoundingClientRect();
    if (rr2.height <= 0 || rr2.width <= 0) continue;
    if (rr2.top < navB - 2) out.fails.push('text above navbar: ' + t2.slice(0, 40));
    if (sig.test(t2)) out.fails.push('markup-signature text: ' + t2.slice(0, 40));
  }
  return out;
}"""
fails = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in WIDTHS:
        pg = b.new_page(viewport={"width": w, "height": 900})
        for path in PAGES:
            pg.goto(BASE + (path or "index.html"), wait_until="load")
            pg.wait_for_timeout(400)
            r = pg.evaluate(CHECK)
            tag = f"{path or 'home'}@{w}"
            if r["fails"]:
                fails += len(r["fails"])
                print(f"FAIL {tag} (nav {r.get('navH')}px pad {r.get('pad')}px): " + "; ".join(r["fails"][:3]))
            else:
                print(f"ok   {tag} (nav {r.get('navH')}px pad {r.get('pad')}px)")
        pg.close()
    b.close()
print(f"\n{'PASS' if fails == 0 else str(fails) + ' FAILURES'} across {len(PAGES)*len(WIDTHS)} page-widths")
sys.exit(0 if fails == 0 else 1)
