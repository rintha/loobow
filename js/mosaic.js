(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.getElementById("mosaicHeader");
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mosaicNav");
  var toTop = document.getElementById("toTop");
  var mobileQuery = window.matchMedia("(max-width: 900px)");

  function setMenu(open, restoreFocus) {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (restoreFocus) menuToggle.focus();
  }

  menuToggle.addEventListener("click", function () {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", function (event) {
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  document.addEventListener("focusin", function (event) {
    if (!header.contains(event.target) && menuToggle.getAttribute("aria-expanded") === "true") setMenu(false);
  });
  mobileQuery.addEventListener("change", function () { setMenu(false); });

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
    if (window.scrollY <= 20) {
      nav.querySelectorAll("a.is-active").forEach(function (link) {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });
    }
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  if (toTop) {
    toTop.addEventListener("click", function () {
      var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  if ("IntersectionObserver" in window) {
    var navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.hash === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
    navLinks.forEach(function (link) {
      var section = document.querySelector(link.hash);
      if (section) navObserver.observe(section);
    });
  }

  /* The brochure images are samples; retain the full image in each preview. */
  (function initGallery() {
    var cards = Array.from(document.querySelectorAll("[data-gallery-image]"));
    var dialog = document.getElementById("galleryDialog");
    var image = document.getElementById("galleryImage");
    var caption = document.getElementById("galleryCaption");
    var details = document.getElementById("galleryDetails");
    var current = 0;
    var opener = null;

    function show(index) {
      current = (index + cards.length) % cards.length;
      var card = cards[current];
      image.src = card.dataset.galleryImage;
      image.alt = card.querySelector("img").alt;
      var collection = card.closest(".collection-card");
      caption.replaceChildren();
      if (collection) {
        var size = document.createElement("span");
        size.className = "gallery-art-size";
        size.textContent = card.querySelector(".collection-size").textContent;
        var name = document.createElement("span");
        name.className = "gallery-art-name";
        name.textContent = card.dataset.galleryTitle;
        caption.append(size, "\n", name);
      } else {
        caption.textContent = card.dataset.galleryTitle;
      }
      var template = collection && collection.querySelector(".gallery-details-template");
      details.replaceChildren();
      details.hidden = !template;
      dialog.classList.toggle("has-details", Boolean(template));
      if (template) details.appendChild(template.content.cloneNode(true));
    }

    cards.forEach(function (card, index) {
      card.addEventListener("click", function () {
        if (typeof dialog.showModal !== "function") {
          window.open(card.dataset.galleryImage, "_blank", "noopener");
          return;
        }
        opener = card;
        show(index);
        dialog.showModal();
        document.body.classList.add("gallery-open");
      });
    });
    dialog.querySelector(".gallery-close").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector(".gallery-prev").addEventListener("click", function () { show(current - 1); });
    dialog.querySelector(".gallery-next").addEventListener("click", function () { show(current + 1); });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        show(current + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", function () {
      document.body.classList.remove("gallery-open");
      if (opener) opener.focus({ preventScroll: true });
      opener = null;
    });
  })();

  /* Reuse Digital's Web3Forms delivery, with a Mosaic enquiry subject. */
  (function initForm() {
    var form = document.getElementById("mosaicForm");
    var submit = document.getElementById("mosaicSubmit");
    var label = submit.querySelector("span");
    var success = document.getElementById("mosaicSuccess");
    var error = document.getElementById("mosaicError");
    var fields = Array.from(form.querySelectorAll("[required]"));
    var sending = false;

    function updateButton() {
      submit.disabled = sending || !fields.every(function (field) { return field.value.trim() && field.validity.valid; });
    }
    form.addEventListener("input", updateButton);
    updateButton();

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      sending = true;
      success.hidden = true;
      error.hidden = true;
      form.setAttribute("aria-busy", "true");
      label.textContent = "Sending…";
      updateButton();

      var controller = new AbortController();
      var timeout = window.setTimeout(function () { controller.abort(); }, 15000);
      try {
        var payload = Object.fromEntries(new FormData(form).entries());
        var response = await fetch(form.action, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          signal: controller.signal
        });
        var data = await response.json();
        if (!response.ok || data.success !== true) throw new Error("Enquiry was not accepted.");
        form.reset();
        success.hidden = false;
        success.focus({ preventScroll: true });
      } catch (failure) {
        error.hidden = false;
        error.focus({ preventScroll: true });
      } finally {
        window.clearTimeout(timeout);
        sending = false;
        form.removeAttribute("aria-busy");
        label.textContent = "Send your enquiry";
        updateButton();
      }
    });
  })();
})();
