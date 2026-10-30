/* Preserve bookmarks to sections of the former agency homepage. */
(function () {
  "use strict";

  var digitalSections = [
    "home", "stats", "about", "services", "work", "flipbook", "why",
    "process", "industries", "testimonials", "insights", "contact"
  ];

  function openLegacySection() {
    var section = window.location.hash.slice(1);
    if (digitalSections.indexOf(section) !== -1) {
      window.location.replace("/digital" + window.location.search + "#" + section);
    }
  }

  openLegacySection();
  window.addEventListener("hashchange", openLegacySection);
})();
