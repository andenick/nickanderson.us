/* =============================================================================
   nickanderson.us — plotter.js — "The Pen-Plotter Index"

   One pass of a pen. Each row of the index gets a small monochrome diagram
   sketched stroke by stroke while its label types itself in beside it. About
   1.2 seconds, start to finish, and then it rests. Nothing loops, nothing
   re-triggers on scroll, nothing re-draws on resize.

   CONTRACT — the same discipline as assets/gantt.js
     * ENHANCEMENT ONLY. index.Rmd knits the complete index — every label, every
       link, every blurb — at build time. This file fetches nothing and creates
       no content: it injects decorative SVG into gutters that are already there
       and adds a class that starts a CSS animation. With JavaScript off, or if
       this file 404s, the index is intact and fully linked.
     * ZERO DEPENDENCIES. No framework, no polyfill, no network.
     * prefers-reduced-motion is honoured TWICE, independently:
         1. here — the strokes are appended at their finished length and the
            typing class is never added, so the final state paints directly;
         2. in assets/plotter.css — a media query that forces width/animation/
            transition off even if this file misbehaves.
     * Colour comes from CSS custom properties, so light/dark and any future
       accent change are inherited rather than restated.
   ============================================================================= */
(function () {
  "use strict";

  var root = document.getElementById("plotter-index");
  if (!root || !document.createElementNS) return;

  // Tells the inline pre-collapse snippet in index.Rmd that we are alive, so it
  // does not fire its safety timer and un-collapse the labels mid-animation.
  document.documentElement.setAttribute("data-plotter", "on");

  var REDUCED = !!(window.matchMedia &&
                   window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var NS = "http://www.w3.org/2000/svg";
  var ROW_STAGGER = 55;   // ms between rows
  var DRAW        = 420;  // ms for one diagram to be drawn
  var PEN_LIFT    = 28;   // ms between strokes within one diagram
  var MAX_LIFT    = 3;    // cap, so a six-stroke diagram is not slower than a two

  /* ---------------------------------------------------------------------------
     The stroke dictionary. One entry per `data-glyph` value in data/index.json;
     every path is drawn in a 60x34 box, unfilled, at a single hairline weight.
     A leading "~" marks a path that should be dashed — a reference line, an
     axis of comparison, something inferred rather than measured.

     These are diagrams, not icons: each one is the shape of the thing the row
     is about. An entry with no glyph here simply draws nothing.
     ------------------------------------------------------------------------- */
  var GLYPHS = {
    // A paper: a sheet, folded corner, and a curve on it.
    paper:    ["M10 3h24l8 8v20H10z", "M34 3v8h8",
               "M15 25c6 0 8-11 13-11s8 6 12 3"],
    // The horse race: several theories out of one starting gate.
    race:     ["M7 6v22", "M7 17c14 0 20-9 46-8", "M7 17c14 0 22-1 46-2",
               "M7 17c14 0 20 10 46 11"],
    // A pediment on columns: the department.
    columns:  ["M5 13 30 4l25 9", "M10 13v16M20 13v16M30 13v16M40 13v16M50 13v16",
               "M6 29h48"],
    // Stacked table rows: the warehouse.
    stack:    ["M8 6h44v22H8z", "M8 13h44M8 20h44", "M23 6v22"],
    // A curve with the area beneath it hatched in: a fiscal aggregate.
    area:     ["M6 29h48", "M8 25c8-14 16-2 24-13 6-8 12-4 20-6",
               "M15 29v-9M23 29v-8M31 29v-11M39 29v-14M47 29v-17"],
    // Two rates narrowing about a common centre: turbulent equalisation.
    converge: ["~M6 17h48", "M6 6c10 0 12 8 20 8s16-4 26-2",
               "M6 28c10 0 12-8 20-8s16 4 26 2"],
    // Two flows between two blocks, one out and one back.
    arcs:     ["M6 5v24", "M54 5v24",
               "M12 11c10-5 26-5 36 0", "M44 8l4 3-5 3",
               "M48 24c-10 5-26 5-36 0", "M16 21l-4 3 5 3"],
    // A grid with a path traced through it: the inverse.
    matrix:   ["M12 5h36v24H12z", "M24 5v24M36 5v24M12 13h36M12 21h36",
               "~M14 27 44 7", "M38 7h6v6"],
    // A staircase: successive plans.
    steps:    ["M6 29h48", "M8 27h8v-5h8v-6h8v-3h8v-8h8"],
    // Two series crossing.
    scissors: ["M8 7c14 4 30 16 44 21", "M8 28c14-5 30-17 44-21",
               "M28 17a2 2 0 104 0 2 2 0 10-4 0"],
    // Bars off a baseline: an appropriation.
    bars:     ["M6 29h48", "M11 29v-7h6v7", "M22 29v-12h6v12",
               "M33 29v-9h6v9", "M44 29v-19h6v19"],
    // A network with its nodes marked.
    nodes:    ["M10 26 22 12l14 8 14-12", "M22 12l6 16 16-2 6-14",
               "M8 26a2 2 0 104 0 2 2 0 10-4 0",
               "M20 12a2 2 0 104 0 2 2 0 10-4 0",
               "M48 14a2 2 0 104 0 2 2 0 10-4 0"],
    // Boxes inside a box: tooling.
    boxes:    ["M6 5h48v24H6z", "M12 10h20v14H12z", "M37 10h12v5H37z",
               "M37 19h12v5H37z"]
  };

  function svgEl(name, attrs) {
    var n = document.createElementNS(NS, name), k;
    for (k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* Draw one diagram into `host`, beginning at `delay` ms. */
  function sketch(host, key, delay) {
    var defs = GLYPHS[key];
    if (!defs) return;

    var svg = svgEl("svg", {
      "class": "pi-svg", viewBox: "0 0 60 34",
      "aria-hidden": "true", focusable: "false"
    });

    defs.forEach(function (d) {
      var dashed = d.charAt(0) === "~";
      svg.appendChild(svgEl("path", {
        d: dashed ? d.slice(1) : d,
        "class": dashed ? "pi-stroke pi-stroke-dashed" : "pi-stroke"
      }));
    });
    host.appendChild(svg);

    // getTotalLength() needs the node in the document, so this runs after the
    // append. In the reduced-motion branch we simply stop here: the strokes are
    // already at full length and the diagram is complete on first paint.
    if (REDUCED) return;

    var paths = svg.getElementsByTagName("path"), i, p, len, lens = [];
    for (i = 0; i < paths.length; i++) {
      p = paths[i];
      len = Math.ceil(p.getTotalLength()) + 1;
      lens.push(len);
      p.style.strokeDasharray  = len;
      p.style.strokeDashoffset = len;
      p.style.transition = "stroke-dashoffset " + DRAW + "ms cubic-bezier(.25,.7,.35,1)";
      p.style.transitionDelay = (delay + Math.min(i, MAX_LIFT) * PEN_LIFT) + "ms";
    }

    // Two frames: one to commit the starting offset, one to move off it.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var j = 0; j < paths.length; j++) paths[j].style.strokeDashoffset = "0";
      });
    });

    // When the pen lifts, hand the strokes back to the stylesheet. The draw
    // commandeers stroke-dasharray for its own purposes, so a reference line's
    // real dash pattern can only be applied once the drawing is over.
    setTimeout(function () {
      for (var k = 0; k < paths.length; k++) {
        paths[k].style.strokeDasharray  = "";
        paths[k].style.strokeDashoffset = "";
        paths[k].style.transition       = "";
      }
    }, delay + MAX_LIFT * PEN_LIFT + DRAW + 40);
  }

  /* ---------------------------------------------------------------------------
     Run once over the rows the build already wrote.
     ------------------------------------------------------------------------- */
  var rows = root.getElementsByClassName("pi-item");

  for (var i = 0; i < rows.length; i++) {
    (function (row, delay) {
      var mark = row.getElementsByClassName("pi-mark")[0];
      if (mark) sketch(mark, row.getAttribute("data-glyph"), delay);

      if (REDUCED) return;   // no typing; the label is already at full width

      // The typewriter is pure CSS (steps() over width) so no character is ever
      // added to or removed from the DOM — assistive technology reads the whole
      // label from the first frame, and there is no per-character reflow.
      var name = row.getElementsByClassName("pi-name")[0];
      if (!name) return;
      var n = (name.textContent || "").length || 1;
      row.style.setProperty("--pi-ch", n);
      row.style.setProperty("--pi-delay", delay + "ms");
      row.className += " is-typing";
    })(rows[i], i * ROW_STAGGER);
  }

  // Mark the pass complete. Purely so the state is inspectable; nothing waits
  // on it, and nothing restarts.
  if (!REDUCED) {
    setTimeout(function () { root.setAttribute("data-drawn", "1"); },
               rows.length * ROW_STAGGER + DRAW + MAX_LIFT * PEN_LIFT + 40);
  } else {
    root.setAttribute("data-drawn", "1");
  }
})();
