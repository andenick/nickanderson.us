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

    // Prefer dropping the button into the navbar's link list as an <li>.
    var navUl = document.querySelector(".navbar .navbar-nav");
    if (navUl) {
      var li = document.createElement("li");
      li.className = "ark-theme-toggle-li";
      li.appendChild(btn);
      navUl.appendChild(li);
    } else {
      var bar = document.querySelector(".navbar .container, .navbar .container-fluid, .navbar");
      if (bar) bar.appendChild(btn);
      else document.body.appendChild(btn);
    }

    render(effective());
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

/* NC3 2026-08-27: keep body padding in step with the fixed navbar's real
   height (wrap edge cases, zoom, font swaps). Runs on load + resize. */
(function () {
  function syncPad() {
    var nav = document.querySelector('.navbar-fixed-top');
    if (!nav) return;
    var h = Math.ceil(nav.getBoundingClientRect().height);
    if (h > 0) document.body.style.paddingTop = h + 'px';
  }
  window.addEventListener('load', syncPad);
  window.addEventListener('resize', syncPad);
  if (document.readyState !== 'loading') syncPad();
})();
