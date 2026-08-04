# `shared/` — vendored Arcanum Site Kit assets

Physical copies of files from the Arcanum Site Kit, canonical source:

```
arcanum-site-kit/v1/ (maintainer's private kit tree)
```

Vendoring (plain file copy — no symlink, submodule or CDN) is how all thirteen
other estate sites consume the kit. See `VENDORED_FROM.txt` for the stamp.

## Why this directory has no underscore

`rmarkdown::render_site()` skips any file or directory whose name begins with
`_` or `.`. A `_shared/` directory — the name every other estate site uses —
would therefore **never be copied into `docs/`** and every stylesheet link would
404 in production. Hence `shared/`.

## What is actually used

Only these are linked by the site:

| File | Linked from | Purpose |
|---|---|---|
| `arcanum.css` | `_head.html` | The kit design system. Loaded FIRST; `../styles.css` then overrides the accent and adds the layout/typography the kit does not ship. |
| `ark-table.js` | `_after_body.html` | Stamps `data-label` on every `<td>` so wide tables reflow to labelled cards below 680px. R Markdown emits bare tables, so `_after_body.html` tags them with `.ark-table` first — the kit enhancer only matches `.ark-prose table`, `.prose table`, `table[data-arktable]` and `table.ark-table`. |
| `favicon.svg` | (not linked) | Kept for parity; the site uses an inline SVG data-URI monogram in `_head.html` instead, which costs no request. |
| `theme-kit-slate.css` | **not linked — deliberately** | The kit's `themes/nickanderson.css` (accent `#475569`). See below. |

If `revendor.ps1` adds further kit files here (`arcanum-chrome.js`,
`ark-triad.js`, `ark-chart.js`, …), that is expected: it syncs its full
`$CoreFiles` list into every vendored directory. Unlinked files cost repository
space but **zero page weight**, since nothing requests them.

## The accent decision

The kit theme for this site is slate `#475569`. The site instead keeps its
**maroon `#640000` / green `#006400`** identity — a unified structure, not
identical branding, which is the documented exception in the rebuild plan.

That override lives in exactly one place: **§1 of `../styles.css`**. To adopt the
kit accent, either replace the three values in that block, or link
`shared/theme-kit-slate.css` after `styles.css` in `_head.html`. Nothing else in
the site needs to change.

## `ark-track.js` — the site's copy is the NEWER one

The site's `../ark-track.js` is **v2.0.1**; the kit shipped **v1.1**. v2.0.1 adds
an origin-aware transport fix: `sendBeacon` always sends credentials, which a
wildcard-CORS collector must reject, so a cross-origin beacon from this static
site was being dropped silently. v2.0.1 detects cross-origin and uses
`fetch(..., {keepalive:true, credentials:"omit", mode:"cors"})` instead.

**This was backported TO the kit on 2026-07-24** (kit copy is now v2.0.1; the
previous kit file is kept as `ark-track.js.bak-pre-v201-backport-20260724`). Do
not let a revendor overwrite the site copy with an older one.

## Keeping this directory current

`revendor.ps1` was originally scoped to `Technical/deploy/` only and computed its
search root by relative path arithmetic, so it **could not see this tree at all**
— `sites_source/` is a sibling of `deploy/`, and recursion never walks upward.
This site was therefore silently excluded from every kit fix.

**Fixed 2026-07-24:** `revendor.ps1` now scans `deploy/` *and* `sites_source/`
(see the `$SearchRoots` block). Verify with:

```powershell
pwsh -File <kit-root>/arcanum-site-kit/v1/revendor.ps1 -Check -Site nickanderson
```

`-Check` writes nothing and exits 1 on any mismatch. Drop `-Check` to sync.
Re-run `rmarkdown::render_site()` afterwards so `docs/shared/` picks up the change.
