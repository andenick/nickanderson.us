/* =============================================================================
   Arcanum Site Kit — ark-table.js — v1.0  (responsive narrative tables)
   DNA TABLE_RENDERING_STANDARD: a table too wide to render inline must NOT
   horizontally-scroll as a mystery — it reflows to label-stacked cards at narrow
   widths. Auto-enhances narrative tables (in .ark-prose / .prose) and any table
   opted-in via [data-arktable] or .ark-table:
     - stamps each <td> with data-label from its column header (so the CSS reflow
       in arcanum.css §18 can show the label beside each value on mobile)
     - wraps the table in a focusable scroll region (a11y) as a fallback
   Large interactive data grids should use the Explorer (Tabulator), not this.
   Dependency-free. Auto-runs on DOMContentLoaded; also exposed as ArkTable.enhance.
   ============================================================================= */
(function () {
  "use strict";
  var DOC = document;
  var SEL = ".ark-prose table, .prose table, table[data-arktable], table.ark-table";

  // Column labels from the LAST header row (handles a grouped top header row),
  // expanding colspans so the label array aligns 1:1 with body cells.
  function labelsFor(tb) {
    var rows = tb.querySelectorAll("thead tr");
    var hrow = rows.length ? rows[rows.length - 1] : null;
    if (!hrow) return [];
    var out = [];
    Array.prototype.forEach.call(hrow.children, function (th) {
      var span = parseInt(th.getAttribute("colspan") || "1", 10) || 1;
      var txt = (th.textContent || "").trim();
      for (var k = 0; k < span; k++) out.push(txt);
    });
    return out;
  }

  function enhance(root) {
    (root || DOC).querySelectorAll(SEL).forEach(function (tb) {
      if (tb._arkTable) return;
      tb._arkTable = true;
      tb.classList.add("ark-table");
      var labels = labelsFor(tb);
      if (labels.length) {
        tb.querySelectorAll("tbody tr").forEach(function (tr) {
          var ci = 0;
          Array.prototype.forEach.call(tr.children, function (td) {
            if (td.tagName !== "TD") return;
            if (labels[ci] && !td.hasAttribute("data-label")) td.setAttribute("data-label", labels[ci]);
            ci += parseInt(td.getAttribute("colspan") || "1", 10) || 1;
          });
        });
      }
      // Focusable scroll region (a11y) — also the graceful fallback for any table
      // wider than its container.
      var p = tb.parentElement;
      if (!p || !p.classList.contains("ark-table-wrap")) {
        var wrap = DOC.createElement("div");
        wrap.className = "ark-table-wrap";
        wrap.setAttribute("role", "region");
        wrap.setAttribute("tabindex", "0");
        var cap = tb.querySelector("caption");
        wrap.setAttribute("aria-label", (cap && (cap.textContent || "").trim()) || "data table");
        tb.parentNode.insertBefore(wrap, tb);
        wrap.appendChild(tb);
      }
    });
  }

  DOC.addEventListener("DOMContentLoaded", function () { enhance(DOC); });
  window.ArkTable = { enhance: enhance };
})();
