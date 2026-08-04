# R/cache.R -------------------------------------------------------------------
#
# Portable data loading for research.Rmd.
#
# research.Rmd used to read every one of its inputs straight off Nick's E:\
# drive, which meant rmarkdown::render_site() only worked on one machine. The
# minimal data each chunk actually consumes is now cached under data-cache/ and
# committed, so the site builds anywhere. The E:\ originals remain an OPTIONAL
# fallback for the maintainer's own machine; missing originals must never abort a render.
#
# Two accessors:
#   src()      -- return a data frame: committed cache file if present,
#                 otherwise rebuild it from the E:\ original.
#   src_path() -- return a file path: committed verbatim copy if present,
#                 otherwise the E:\ original.
#
# Regenerate data-cache/ with:  Rscript R/build_data_cache.R
# (only runs on a machine with the E:\ sources mounted -- see data-cache/README.md)
#
# The source root can be redirected for testing with the environment variable
# NICKANDERSON_SOURCE_ROOT.
# -----------------------------------------------------------------------------

NA_CACHE_DIR <- "data-cache"

# Root that holds DaPF/, Tax Revenue Cyclicality/ and BoP/. There is no useful
# default: set NICKANDERSON_SOURCE_ROOT to the folder holding the originals.
na_source_root <- function() {
  Sys.getenv(
    "NICKANDERSON_SOURCE_ROOT",
    unset = "_references"
  )
}

na_src_file <- function(...) file.path(na_source_root(), ...)

# --- accessors ---------------------------------------------------------------

# `fallback` is evaluated lazily: it is only touched when the cache file is
# absent, so a machine without the originals never even looks for them.
src <- function(cache_file, fallback, col_types = NULL) {
  p <- file.path(NA_CACHE_DIR, cache_file)
  if (file.exists(p)) {
    return(readr::read_csv(p, col_types = col_types, show_col_types = FALSE))
  }
  message("data-cache/", cache_file, " missing; falling back to ", na_source_root())
  if (!dir.exists(na_source_root())) {
    stop("Neither data-cache/", cache_file, " nor the source root '",
         na_source_root(), "' is available. Restore data-cache/ from the ",
         "repository, or run R/build_data_cache.R on a machine that has the ",
         "source data mounted.", call. = FALSE)
  }
  fallback
}

# For inputs cached verbatim (small CSVs read with read.csv(check.names=FALSE)).
src_path <- function(cache_file, fallback_path) {
  p <- file.path(NA_CACHE_DIR, cache_file)
  if (file.exists(p)) return(p)
  message("data-cache/", cache_file, " missing; falling back to ", fallback_path)
  if (!file.exists(fallback_path)) {
    stop("Neither data-cache/", cache_file, " nor '", fallback_path,
         "' is available. Restore data-cache/ from the repository, or run ",
         "R/build_data_cache.R on a machine that has the source data mounted.",
         call. = FALSE)
  }
  fallback_path
}

# --- column specifications ---------------------------------------------------
# Explicit so the cached CSVs deserialise to exactly the types readxl produced
# (recDate must stay POSIXct/UTC, not Date -- the x scales depend on it).

na_cols_looptest <- function() {
  readr::cols(
    recDate        = readr::col_datetime(),
    secDesc1       = readr::col_character(),
    yearsCat       = readr::col_character(),
    outsAmtMln     = readr::col_double(),
    durApproxPct   = readr::col_double(),
    durApproxInUSD = readr::col_double(),
    sumOuts        = readr::col_double(),
    sumDur         = readr::col_double()
  )
}

na_cols_det <- function() {
  readr::cols(
    recDate        = readr::col_datetime(),
    yearsCat       = readr::col_character(),
    outsAmtMln     = readr::col_double(),
    durApproxInUSD = readr::col_double(),
    sumOuts        = readr::col_double(),
    sumDur         = readr::col_double()
  )
}

# The RExport sheets have three shapes: date/value, date/value/type, and
# date/value/type/order.
na_cols_tax <- function(cols = c("date", "value", "type")) {
  spec <- list(
    date  = readr::col_double(),
    value = readr::col_double(),
    type  = readr::col_character(),
    order = readr::col_double()
  )
  do.call(readr::cols, spec[cols])
}

# --- fallback builders (E:\ originals) ---------------------------------------
# These are also the single source of truth used by R/build_data_cache.R, so the
# committed cache and the E:\ fallback can never drift apart.

# looptest-graph1.xlsx: 11,774 CUSIP-level rows x 333 columns (9.7 MB).
# Every chunk that touches it draws stacked bars keyed on recDate x secDesc1 and
# recDate x yearsCat, so the CUSIP detail is collapsed away. Stacking sums the
# y values within a (x, fill) group, and outsAmtMln / durApproxPct /
# durApproxInUSD are each single-signed throughout, so pre-summing is exact.
# sumOuts and sumDur are per-recDate totals already, hence first().
na_build_looptest <- function() {
  readxl::read_excel(na_src_file("DaPF", "looptest-graph1.xlsx")) |>
    dplyr::group_by(recDate, secDesc1, yearsCat) |>
    dplyr::summarise(
      outsAmtMln     = sum(outsAmtMln),
      durApproxPct   = sum(durApproxPct),
      durApproxInUSD = sum(durApproxInUSD),
      sumOuts        = dplyr::first(sumOuts),
      sumDur         = dplyr::first(sumDur),
      .groups        = "drop"
    )
}

# det_data_mkt_fix_graph1.xlsx: 71,679 CUSIP-level rows x 333 columns (58 MB).
# Only ever used through three recDate windows (GFC / Obama-Trump / Covid) and
# always plotted as stacked bars keyed on recDate x yearsCat. Filtering by
# recDate commutes with the aggregation, so the windows are cut afterwards in
# the chunk exactly as before.
na_build_det <- function() {
  readxl::read_excel(na_src_file("DaPF", "det_data_mkt_fix_graph1.xlsx")) |>
    dplyr::group_by(recDate, yearsCat) |>
    dplyr::summarise(
      outsAmtMln     = sum(outsAmtMln),
      durApproxInUSD = sum(durApproxInUSD),
      sumOuts        = dplyr::first(sumOuts),
      sumDur         = dplyr::first(sumDur),
      .groups        = "drop"
    )
}

# IncomeTaxData_NA.xlsx sheets RExport1..RExport8 are already small, tidy
# (date/value/type[/order]) export sheets, so they are cached verbatim. Row
# ORDER is load-bearing here -- several chunks index marks positionally
# (UnempRate$mark[1], TaxEra$mark[21], ...) -- so nothing is sorted.
na_build_tax <- function(sheet) {
  readxl::read_excel(
    na_src_file("Tax Revenue Cyclicality", "IncomeTaxData_NA.xlsx"),
    sheet = sheet
  )
}

na_bop_source <- function(file) na_src_file("BoP", file)
