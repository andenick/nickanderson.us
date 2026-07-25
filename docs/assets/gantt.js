/* =============================================================================
   nickanderson.us — gantt.js — "The Coverage Gantt"
   FreeNIC warehouse archival coverage as an inline SVG timeline.

   CONTRACT
     * Data is COMMITTED at /data/coverage.json — the hero never depends on a
       third party and never blocks first paint on the network.
     * Progressive enhancement: index.Rmd renders the same families as a static
       <ul> at build time. With JS off that list IS the content.
     * One pass: bars draw left-to-right, staggered 40ms, ~1.2s, then rest.
     * prefers-reduced-motion: complete bars, no animation.
     * Themed from CSS custom properties, so light/dark is free.
   ============================================================================= */
(function () {
  "use strict";

  var root = document.getElementById("coverage-gantt");
  if (!root || !window.fetch) return;

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  // Banking-history reference lines: the archive's shape follows the record.
  var ERAS = [
    { year: 1863, label: "National Banking Act" },
    { year: 1934, label: "FDIC" }
  ];

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  function commas(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  // Row counts span 8,653 to 1.95 billion. Compact form for the bar labels.
  function compact(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return Math.round(n / 1e3) + "K";
    return String(n);
  }

  // First tier token drives fill weight: direct-from-regulator reads strongest,
  // derived and reference faintest. Honest visual encoding.
  var TIER_OPACITY = { T1: 1, T2: 0.82, T3: 0.66, T4: 0.55, derived: 0.42, reference: 0.34 };
  function tierWeight(tier) {
    var first = String(tier).split("/")[0].trim();
    return TIER_OPACITY[first] != null ? TIER_OPACITY[first] : 0.6;
  }

  var tip;
  function tooltip() {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "gantt-tip";
      tip.setAttribute("role", "status");
      root.appendChild(tip);
    }
    return tip;
  }

  function showTip(d, evt) {
    var t = tooltip();
    t.innerHTML =
      '<strong>' + d.name + '</strong>' +
      '<span>' + d.start_date + " → " + d.end_date + '</span>' +
      '<span>' + commas(d.rows) + " rows · " + d.tables + " table" + (d.tables === 1 ? "" : "s") + '</span>' +
      '<span class="gantt-tip-meta">' + d.provider + " · tier " + d.tier + '</span>';
    t.classList.add("is-on");
    var box = root.getBoundingClientRect();
    var x = evt.clientX - box.left, y = evt.clientY - box.top;
    // Flip before the tooltip can push the page sideways.
    t.style.left = (x > box.width * 0.6 ? x - t.offsetWidth - 14 : x + 14) + "px";
    t.style.top = Math.max(0, y - t.offsetHeight - 10) + "px";
  }

  function hideTip() { if (tip) tip.classList.remove("is-on"); }

  function draw(data) {
    var fams = data.families;
    var W = root.clientWidth || 720;
    var narrow = W < 620;

    var padL = narrow ? 8 : 186;   // label gutter on wide screens
    var padR = narrow ? 46 : 54;   // room for the row-count label
    var rowH = narrow ? 34 : 23;
    var top = narrow ? 14 : 22;
    var axisH = 30;
    var barH = narrow ? 11 : 12;
    var plotW = Math.max(60, W - padL - padR);
    var H = top + fams.length * rowH + axisH;

    var y0 = data.span_min, y1 = data.span_max;
    var scale = function (yr) { return padL + ((yr - y0) / (y1 - y0)) * plotW; };

    var svg = el("svg", {
      class: "gantt-svg",
      width: "100%",
      height: H,
      viewBox: "0 0 " + W + " " + H,
      role: "img",
      "aria-label":
        "Timeline of " + fams.length + " dated archival source families spanning " +
        y0 + " to " + y1 + ", totalling " + commas(data.total_rows) + " rows of data."
    });

    // ---- era reference lines ------------------------------------------------
    ERAS.forEach(function (e) {
      var x = scale(e.year);
      svg.appendChild(el("line", {
        class: "gantt-era", x1: x, x2: x, y1: top - 8, y2: top + fams.length * rowH + 4
      }));
      var lbl = el("text", { class: "gantt-era-label", x: x + 4, y: top - 11 });
      lbl.textContent = narrow ? String(e.year) : e.year + " " + e.label;
      svg.appendChild(lbl);
    });

    // ---- one row per dated family ------------------------------------------
    fams.forEach(function (d, i) {
      var yTop = top + i * rowH;
      var x = scale(d.start);
      var w = Math.max(3, scale(d.end) - x);
      var barY = narrow ? yTop + 15 : yTop + (rowH - barH) / 2;

      var g = el("g", { class: "gantt-row", tabindex: "0", role: "listitem" });
      g.setAttribute("aria-label",
        d.name + ", " + d.start_date + " to " + d.end_date + ", " +
        commas(d.rows) + " rows, provenance tier " + d.tier + ".");

      // Full-width hit area so hover/focus is forgiving.
      g.appendChild(el("rect", {
        class: "gantt-hit", x: 0, y: yTop, width: W, height: rowH
      }));

      var label = el("text", {
        class: "gantt-label",
        x: narrow ? padL : padL - 10,
        y: narrow ? yTop + 10 : yTop + rowH / 2 + 4,
        "text-anchor": narrow ? "start" : "end"
      });
      label.textContent = d.name;
      g.appendChild(label);

      var bar = el("rect", {
        class: "gantt-bar", x: x, y: barY, width: REDUCED ? w : 0, height: barH,
        rx: 2, "fill-opacity": tierWeight(d.tier)
      });
      if (!REDUCED) {
        bar.style.transition = "width .62s cubic-bezier(.22,.7,.3,1)";
        bar.style.transitionDelay = (i * 40) + "ms";
      }
      g.appendChild(bar);

      var cnt = el("text", {
        class: "gantt-count", x: Math.min(W - 6, x + w + 7), y: barY + barH - 1
      });
      cnt.textContent = compact(d.rows);
      g.appendChild(cnt);

      g.addEventListener("mousemove", function (e) { showTip(d, e); });
      g.addEventListener("mouseleave", hideTip);
      g.addEventListener("focus", function () {
        var b = bar.getBoundingClientRect();
        showTip(d, { clientX: b.left + b.width / 2, clientY: b.top + 8 });
      });
      g.addEventListener("blur", hideTip);

      svg.appendChild(g);
      if (!REDUCED) {
        // Force layout once, then let the transition run.
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bar.setAttribute("width", w); });
        });
      }
    });

    // ---- axis ---------------------------------------------------------------
    var axisY = top + fams.length * rowH + 12;
    svg.appendChild(el("line", {
      class: "gantt-axis", x1: padL, x2: padL + plotW, y1: axisY - 6, y2: axisY - 6
    }));
    [y0, 1863, 1934, y1].forEach(function (yr, i, arr) {
      var t = el("text", {
        class: "gantt-tick", x: scale(yr), y: axisY + 8,
        "text-anchor": i === 0 ? "start" : (i === arr.length - 1 ? "end" : "middle")
      });
      t.textContent = yr;
      svg.appendChild(t);
    });

    root.setAttribute("role", "list");
    root.innerHTML = "";
    root.appendChild(svg);
    tip = null;
  }

  var current = null, w0 = 0, timer;
  function render(data) {
    current = data;
    w0 = root.clientWidth;
    draw(data);
  }

  fetch("data/coverage.json", { cache: "force-cache" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (data) {
      render(data);
      window.addEventListener("resize", function () {
        // Only re-render on a real width change (ignore mobile URL-bar scroll).
        if (Math.abs(root.clientWidth - w0) < 24) return;
        clearTimeout(timer);
        timer = setTimeout(function () { if (current) render(current); }, 160);
      });
    })
    // On any failure the build-time static list stays: still complete, correct.
    .catch(function () {});
})();
