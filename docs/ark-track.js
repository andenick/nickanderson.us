/* =============================================================================
   Arcanum Site Kit — ark-track.js — v2.0.1
   Tiny FIRST-PARTY usage beacon for static / SPA sites with no backend
   middleware. Sends ONE pageview event {site, path, ref, ts} to a same-origin
   (or configured) endpoint. No cookies, no PII, no third party. Respects DNT.

   Usage:
     <script>window.ARK_TRACK = { site:"heterodata", endpoint:"/__track" };</script>
     <script src="/_shared/ark-track.js" defer></script>
   The endpoint is fronted by the site. If the site has no backend (pure
   static), point `endpoint` at your own first-party collector hostname.
   ============================================================================= */
(function () {
  "use strict";
  try {
    var C = window.ARK_TRACK || {};
    // Honor Do-Not-Track / Global Privacy Control.
    var dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
    if (dnt) return;
    var site = C.site || (window.ARK_CONFIG && window.ARK_CONFIG.site_key) || location.hostname;
    var endpoint = C.endpoint || "/__track";
    var payload = JSON.stringify({
      site: site,
      path: location.pathname,
      ref: document.referrer ? new URL(document.referrer, location.href).hostname : "",
      ts: Math.floor(Date.now() / 1000) // server re-stamps; client ts is advisory
    });
    // Cross-origin?  sendBeacon always sends credentials:"include"; a wildcard
    // `ACAO: *` collector forbids that → the browser drops the beacon (the CORS
    // bug that killed telemetry on this cross-origin author-anchor deploy).
    // v2.0.1 fix: for a cross-origin endpoint use fetch keepalive with
    // credentials:"omit" (allowed against `ACAO: *`); same-origin still prefers
    // sendBeacon.  keepalive lets the request survive the page unload.
    var crossOrigin = true;
    try { crossOrigin = (new URL(endpoint, location.href)).origin !== location.origin; } catch (e) {}
    if (!crossOrigin && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
    } else if (window.fetch) {
      fetch(endpoint, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true, credentials: "omit", mode: "cors" }).catch(function () {});
    } else if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
    }
  } catch (e) { /* tracking must never break a page */ }
})();
