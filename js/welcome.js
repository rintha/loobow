/* Main homepage introduction and former agency homepage bookmarks. */
(function () {
  "use strict";

  var digitalSections = [
    "home", "stats", "about", "services", "work", "flipbook", "why",
    "process", "industries", "testimonials", "insights", "contact"
  ];

  function openLegacySection() {
    var section = window.location.hash.slice(1);
    if (digitalSections.indexOf(section) !== -1) {
      window.location.replace("/digital.html" + window.location.search + "#" + section);
      return true;
    }
    return false;
  }

  if (openLegacySection()) return;
  window.addEventListener("hashchange", openLegacySection);

  (function initPreloader() {
    var preloader = document.getElementById("preloader");
    if (!preloader) return;

    var video = preloader.querySelector("video");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      preloader.remove();
      return;
    }

    var hidden = false;
    var shownAt = Date.now();
    var fallbackTimer;
    preloader.hidden = false;

    function remove() {
      hidden = true;
      clearTimeout(fallbackTimer);
      video.pause();
      preloader.remove();
    }

    function hide() {
      if (hidden) return;
      hidden = true;
      clearTimeout(fallbackTimer);
      preloader.classList.add("done");
      setTimeout(remove, 700);
    }

    function pageLoaded() {
      // Keep the animation visible briefly even when the page is cached.
      setTimeout(hide, Math.max(400, 900 - (Date.now() - shownAt)));
    }

    // A refresh starts a new introduction; no session flag suppresses it.
    fallbackTimer = setTimeout(hide, 4000);
    if (document.readyState === "complete") {
      pageLoaded();
    } else {
      window.addEventListener("load", pageLoaded, { once: true });
    }

    // Never leave the homepage covered if playback fails or a cached page returns.
    video.addEventListener("error", hide, true);
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) remove();
    });
    video.muted = true;
    var playback = video.play();
    if (playback && playback.catch) playback.catch(hide);
  })();
})();
