# data-cache/

Committed input data for `research.Rmd`, so that `rmarkdown::render_site()`
works on any machine.

`research.Rmd` previously read all of its inputs directly from Nick's `E:\`
drive, which meant the site could only be built on one workstation. The files
here are the *minimal data the chunks actually consume*. The originals total
~71 MB and are deliberately **not** committed; everything below is 351 KB.

Loading goes through `src()` / `src_path()` in [`../R/cache.R`](../R/cache.R):
the committed cache is always preferred, and the `E:\` original is only
consulted if a cache file is missing. A missing `E:\` never aborts a render.

## Files

| File | Rows × cols | Source | Consumed by |
|---|---|---|---|
| `treasury_looptest_agg.csv` | 526 × 8 | `DaPF\looptest-graph1.xlsx` (9.7 MB, 11,774 × 333) | chunk **2. Begin Treasury** → `looptest_graph`; then **3. Treasury**, **7./9./10./11. Treasury** (Figures 1, 3, 7, 8) |
| `treasury_det_agg.csv` | 1,876 × 6 | `DaPF\det_data_mkt_fix_graph1.xlsx` (58 MB, 71,679 × 333) | chunk **4b. Data** → `det_data_mkt_fix_graph`; then **4./5./6.x Treasury** and **12.–18. Treasury** (Figures 9–15) |
| `tax_rexport1.csv` … `tax_rexport8.csv` | 60/30/930/23/12/20/16/14 × 2–4 | `Tax Revenue Cyclicality\IncomeTaxData_NA.xlsx`, sheets `RExport1`…`RExport8` (3.3 MB) | `IncomeTaxData` … `IncomeTaxData8`; Tax Revenue Cyclicality Figures 1–8 |
| `bop_GERdata_annual_pct.csv` | verbatim | `BoP\GERdata_annual_pct.csv` | chunk **20. BoP** |
| `bop_USdata_annual_pct.csv` | verbatim | `BoP\USdata_annual_pct.csv` | chunk **20. BoP** |

Source root: set the `NICKANDERSON_SOURCE_ROOT` environment variable to the
folder that holds `DaPF/`, `Tax Revenue Cyclicality/` and `BoP/`.

## Why the two Treasury files are aggregates, not copies

Both Treasury workbooks are CUSIP-level: one row per security per month, 333
columns. Every figure drawn from them is a **stacked bar chart** keyed on
`recDate` × a categorical fill, and `position = "stack"` sums the y values
within each (x, fill) group. So collapsing the CUSIP detail to the group total
in advance produces mathematically identical bars.

* `treasury_looptest_agg.csv` — grouped by `recDate` × `secDesc1` × `yearsCat`
  (both fills that document uses), summing `outsAmtMln`, `durApproxPct`,
  `durApproxInUSD`. `sumOuts` / `sumDur` are already per-`recDate` totals, so
  they are carried through with `first()`.
* `treasury_det_agg.csv` — grouped by `recDate` × `yearsCat`, summing
  `outsAmtMln` and `durApproxInUSD`, same treatment of `sumOuts` / `sumDur`.
  The three date windows (GFC / Obama-Trump / Covid) are still cut in the
  chunk; filtering on `recDate` commutes with the aggregation.

Two properties make the pre-summing exact rather than approximate, and both
were checked against the originals: `outsAmtMln`, `durApproxPct` and
`durApproxInUSD` are each single-signed throughout (so `position = "stack"`
never splits a group into a positive and a negative stack), and `sumOuts` /
`sumDur` are constant within each `recDate`.

The Tax Revenue Cyclicality sheets and the BoP CSVs are already small and tidy,
so they are cached verbatim — **row order is preserved**, because several
chunks place labels by position (`UnempRate$mark[1]`, `TaxEra$mark[21]`, …).

## Regenerating

On a machine with the source data mounted, from the site root:

```
Rscript R/build_data_cache.R
```

The aggregation logic lives in `R/cache.R` (`na_build_looptest()`,
`na_build_det()`, `na_build_tax()`), which is both what the builder writes and
what `research.Rmd` falls back to when this directory is absent — so the cache
and the fallback cannot drift apart.

Set `NICKANDERSON_SOURCE_ROOT` to override the source location (it is also the
hook used to test the "no `E:\`" build path).

## Verified

Rendering `research.Rmd` four ways — original file with `E:\`; cached version
with `E:\` present; cached version with the source root pointed at a
non-existent drive; and cached version deleted so the `E:\` fallback runs —
produces four byte-identical HTML files (`md5 9784a097c525682718f20db461256c71`,
1,964,654 bytes).
