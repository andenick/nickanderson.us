# R/build_data_cache.R --------------------------------------------------------
#
# Regenerates data-cache/ from the original source workbooks.
#
# THIS SCRIPT ONLY RUNS ON A MACHINE THAT HAS THE ORIGINAL WORKBOOKS MOUNTED.
# Point NICKANDERSON_SOURCE_ROOT at the folder holding them; it reads:
#
#   <SOURCE_ROOT>\DaPF\looptest-graph1.xlsx
#   <SOURCE_ROOT>\DaPF\det_data_mkt_fix_graph1.xlsx
#   <SOURCE_ROOT>\Tax Revenue Cyclicality\IncomeTaxData_NA.xlsx
#   <SOURCE_ROOT>\BoP\GERdata_annual_pct.csv
#   <SOURCE_ROOT>\BoP\USdata_annual_pct.csv
#
# (root overridable with the NICKANDERSON_SOURCE_ROOT environment variable)
#
# Those originals total ~71 MB and are deliberately NOT committed. What is
# committed is the minimal derived data the research.Rmd chunks actually
# consume -- for the two big Treasury workbooks that is the stacked-bar
# aggregate, not the CUSIP-level detail. The aggregation logic lives in
# R/cache.R (na_build_*), which is also what research.Rmd falls back to when
# data-cache/ is absent, so cache and fallback cannot drift apart.
#
# Run from the site root:   Rscript R/build_data_cache.R
# -----------------------------------------------------------------------------

suppressPackageStartupMessages({
  library(readxl)
  library(readr)
  library(dplyr)
})

source("R/cache.R")

if (!dir.exists(na_source_root())) {
  stop("Source root not found: ", na_source_root(),
       "\nThis script only runs on a machine with the original data mounted.")
}

dir.create(NA_CACHE_DIR, showWarnings = FALSE)

emit <- function(df, file) {
  path <- file.path(NA_CACHE_DIR, file)
  readr::write_csv(df, path)
  cat(sprintf("  %-32s %6d rows x %2d cols  %8.1f KB\n",
              file, nrow(df), ncol(df), file.size(path) / 1024))
}

cat("Treasury (Duration and Public Finance)\n")
emit(na_build_looptest(), "treasury_looptest_agg.csv")
emit(na_build_det(),      "treasury_det_agg.csv")

cat("Tax Revenue Cyclicality\n")
for (i in 1:8) {
  emit(na_build_tax(paste0("RExport", i)), sprintf("tax_rexport%d.csv", i))
}

cat("Balance of Payments (verbatim copies)\n")
for (f in c("GERdata_annual_pct.csv", "USdata_annual_pct.csv")) {
  dest <- file.path(NA_CACHE_DIR, paste0("bop_", f))
  file.copy(na_bop_source(f), dest, overwrite = TRUE)
  cat(sprintf("  %-32s %8.1f KB (verbatim)\n", basename(dest), file.size(dest) / 1024))
}

cat(sprintf("\ndata-cache/ total: %.1f KB across %d files\n",
            sum(file.size(list.files(NA_CACHE_DIR, full.names = TRUE))) / 1024,
            length(list.files(NA_CACHE_DIR))))
