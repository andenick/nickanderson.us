# =============================================================================
# nickanderson.us — R/identifiers.R
#
# Renders the scholarly-identifier row (ORCID / Google Scholar / RePEc / SSRN)
# from R/identifiers.json at BUILD TIME.
#
# THE RULE THIS FILE ENFORCES
#   An identifier that Nick has not supplied does not appear on the site — not
#   as an empty row, not as a greyed "coming soon", not as a dead link. If every
#   value in identifiers.json is null (today's state) this function returns the
#   empty string and the section vanishes from the output entirely.
#
#   So the SCAFFOLDING is complete and the CONTENT is honest at the same time.
#   Filling one `value` in R/identifiers.json and re-rendering is the whole
#   activation step; no markup has to be written by hand.
#
# Sourced by index.Rmd today; contact.Rmd and _cv.Rmd can source it too, but
# each page that does needs assets/plotter.css (which carries the .na-ids rules)
# linked from its own _meta_<page>.html. One canonical row on the home page is
# the intended arrangement.
#
# This file and R/identifiers.json both live in R/, which _site.yml excludes
# from docs/: they are build inputs and are never served.
# =============================================================================

ids_escape <- function(x) {
  x <- gsub("&", "&amp;", x, fixed = TRUE)
  x <- gsub("<", "&lt;",  x, fixed = TRUE)
  x <- gsub(">", "&gt;",  x, fixed = TRUE)
  gsub('"', "&quot;", x, fixed = TRUE)
}

# Returns the <section> HTML, or "" when nothing has been supplied yet.
identifiers_html <- function(path = "R/identifiers.json",
                             heading = "Profiles",
                             class = "na-ids") {

  if (!file.exists(path)) return("")
  spec <- jsonlite::fromJSON(path, simplifyVector = FALSE)

  live <- Filter(function(p) {
    !is.null(p$value) && !is.na(p$value) && nzchar(trimws(as.character(p$value)))
  }, spec$profiles)

  # Nothing supplied yet -> emit nothing. This is the expected state on the day
  # this file was written, and it must stay clean rather than advertise a gap.
  if (length(live) == 0L) return("")

  items <- vapply(live, function(p) {
    href <- sub("{value}", trimws(as.character(p$value)), p$url_pattern, fixed = TRUE)
    sprintf(
      '<li><a class="na-id" href="%s" rel="me noopener"><span class="na-id-label">%s</span><span class="na-id-value">%s</span></a></li>',
      ids_escape(href), ids_escape(p$label), ids_escape(trimws(as.character(p$value)))
    )
  }, character(1))

  sprintf(
    '<section class="%s" aria-label="%s">\n<h2 class="na-ids-title">%s</h2>\n<ul class="na-ids-list">\n%s\n</ul>\n</section>\n',
    ids_escape(class), ids_escape(heading), ids_escape(heading),
    paste(items, collapse = "\n")
  )
}
