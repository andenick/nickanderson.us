/* =============================================================================
   nickanderson.us — toggle.js (vendored, offline; no CDN)
   Light/dark toggle: follow-system-then-remember.
   - Injects a small toggle button into the Bootstrap navbar.
   - On click, flips document.documentElement.dataset.theme and persists to
     localStorage['ark-theme'].
   - A no-FOUC inline script in _head.html applies the saved theme before paint.
   ============================================================================= */
(function () {
  "use strict";
  var KEY = "ark-theme";

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Effective theme right now: explicit override wins, else the system value.
  function effective() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "dark" || t === "light") return t;
    return systemPrefersDark() ? "dark" : "light";
  }

  var btn;

  function render(t) {
    if (!btn) return;
    // Show the glyph for the mode you would switch TO.
    btn.textContent = (t === "dark") ? "☀" : "☽"; // sun : moon
    btn.setAttribute("aria-label", "Switch to " + (t === "dark" ? "light" : "dark") + " theme");
    btn.setAttribute("title", btn.getAttribute("aria-label"));
  }

  function apply(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) { /* private mode */ }
    render(t);
  }

  function init() {
    btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";
    btn.className = "ark-theme-toggle";
    btn.addEventListener("click", function () {
      apply(effective() === "dark" ? "light" : "dark");
    });

    // Drop the button into the site nav's link list as an <li>.
    // (.na-nav replaced the Bootstrap .navbar-nav in the 2026-07-24 rebuild;
    // the old selector is kept as a fallback so the legacy theme still works.)
    var navUl = document.querySelector(".na-nav") || document.querySelector(".navbar .navbar-nav");
    if (navUl) {
      var li = document.createElement("li");
      li.className = "na-nav-toggle ark-theme-toggle-li";
      li.appendChild(btn);
      navUl.appendChild(li);
    } else {
      var bar = document.querySelector(".na-header-inner, .navbar .container, .navbar");
      if (bar) bar.appendChild(btn);
      else document.body.appendChild(btn);
    }

    render(effective());
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
