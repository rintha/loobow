/* ==========================================================================
   LOOBOW — agency.js
   Smooth scrolling (Lenis), scroll reveals, counters, testimonial slider,
   header + nav behaviour, contact form.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lenis smooth scrolling ---------- */

  var lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target) {
    var el = document.querySelector(target);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -70 });
    } else {
      var top = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }

  /* ---------- Anchor links ---------- */

  var header = document.getElementById("siteHeader");

  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      e.preventDefault();

      if (header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        document.getElementById("navToggle").setAttribute("aria-expanded", "false");
        // mirror the mobile-menu close cleanup below, otherwise Lenis stays
        // paused and the body stays scroll-locked after tapping a link
        if (lenis) lenis.start();
        document.body.style.overflow = "";
      }

      scrollToTarget(href);
    });
  });

  /* ---------- Hero background video ---------- */

  var heroBgImage = document.querySelector(".hero-bg-image");

  if (heroBgImage && heroBgImage.tagName === "VIDEO") {
    if (prefersReducedMotion) {
      // respect reduced-motion: stay on the poster frame, no autoplay
      heroBgImage.pause();
      heroBgImage.removeAttribute("autoplay");
    } else {
      heroBgImage.muted = true;
      var playPromise = heroBgImage.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () { /* autoplay blocked; poster frame stays visible */ });
      }
    }
  }

  /* ---------- Header state + hero parallax ---------- */

  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 600);

    if (heroBgImage && !prefersReducedMotion && y < window.innerHeight * 1.2) {
      heroBgImage.style.transform = "translateY(" + y * 0.25 + "px)";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
  }

  /* ---------- Mobile nav toggle ---------- */

  var navToggle = document.getElementById("navToggle");

  navToggle.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (lenis) {
      if (open) { lenis.stop(); } else { lenis.start(); }
    }
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* ---------- Active nav link on scroll ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav .nav-link"));
  var sectionsForNav = navLinks
    .map(function (link) {
      var el = document.querySelector(link.getAttribute("href"));
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionsForNav.forEach(function (item) {
          item.link.classList.toggle("is-active", item.el === entry.target);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sectionsForNav.forEach(function (item) { navObserver.observe(item.el); });

  /* ---------- Scroll reveal ---------- */

  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Animated counters ---------- */

  var counters = document.querySelectorAll(".count");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }

    // cancel any run still in flight, then count up and settle on the real number
    if (el._countRaf) cancelAnimationFrame(el._countRaf);
    var duration = 2000;
    var start = null;

    function tick(now) {
      if (!start) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        el._countRaf = requestAnimationFrame(tick);
      } else {
        el.textContent = target;
        el._countRaf = null;
      }
    }
    el._countRaf = requestAnimationFrame(tick);
  }

  function resetCount(el) {
    if (el._countRaf) {
      cancelAnimationFrame(el._countRaf);
      el._countRaf = null;
    }
    el.textContent = "0";
  }

  // re-animate every time the stats come back into view
  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
        } else if (!prefersReducedMotion) {
          resetCount(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(function (el) { countObserver.observe(el); });

  /* ---------- Testimonial slider ---------- */

  (function initSlider() {
    var track = document.getElementById("testiTrack");
    if (!track) return;

    var slides = track.children;
    var total = slides.length;
    var index = 0;
    var dotsWrap = document.getElementById("testiDots");
    var autoTimer = null;

    for (var i = 0; i < total; i++) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      (function (n) {
        dot.addEventListener("click", function () { goTo(n); restartAuto(); });
      })(i);
      dotsWrap.appendChild(dot);
    }

    var dots = dotsWrap.children;

    function goTo(n) {
      index = (n + total) % total;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      for (var i = 0; i < total; i++) {
        dots[i].classList.toggle("is-active", i === index);
      }
    }

    function restartAuto() {
      if (prefersReducedMotion) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(index + 1); }, 7000);
    }

    document.getElementById("testiPrev").addEventListener("click", function () {
      goTo(index - 1);
      restartAuto();
    });
    document.getElementById("testiNext").addEventListener("click", function () {
      goTo(index + 1);
      restartAuto();
    });

    /* touch swipe */
    var startX = null;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        goTo(dx < 0 ? index + 1 : index - 1);
        restartAuto();
      }
      startX = null;
    }, { passive: true });

    goTo(0);
    restartAuto();
  })();

  /* ---------- Service card glow on scroll (touch / mobile) ----------
     Desktop gets the glow on hover; on touch there is no hover, so cards
     glow while they sit in the viewport instead (see .is-glow in the CSS,
     gated behind the same media query used here). */

  (function initServiceGlow() {
    var cards = document.querySelectorAll(".service-card");
    if (!cards.length || !("IntersectionObserver" in window)) return;

    var mq = window.matchMedia("(hover: none), (max-width: 900px)");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-glow", entry.isIntersecting);
      });
    }, { threshold: 0.45 });

    function update() {
      cards.forEach(function (card) {
        if (mq.matches) {
          observer.observe(card);
        } else {
          observer.unobserve(card);
          card.classList.remove("is-glow");
        }
      });
    }

    if (mq.addEventListener) mq.addEventListener("change", update);
    update();
  })();

  /* ---------- Work filters ---------- */

  (function initWorkFilters() {
    var filterBar = document.getElementById("workFilters");
    var grid = document.getElementById("workGrid");
    if (!filterBar || !grid) return;

    var buttons = filterBar.querySelectorAll(".filter-btn");
    var cards = grid.querySelectorAll(".work-card");

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      var filter = btn.getAttribute("data-filter");

      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      cards.forEach(function (card) {
        var categories = (card.getAttribute("data-category") || "").split(" ");
        // data-only cards belong to their category view only — "All" skips them
        var match = filter === "all"
          ? !card.hasAttribute("data-only")
          : categories.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !match);
      });
    });
  })();

  /* ---------- Work image / video lightbox ----------
     Cards carry one of three things: data-popup (one or more full-size images,
     shown in the modal), data-video (an embeddable Vimeo/YouTube player URL,
     shown in an iframe with the data-link original offered as a fallback link),
     or only data-link (no embed possible, e.g. Behance — opens in a new tab).

     data-popup holds one path for a single image, or several paths joined with
     "|" to turn the popup into a carousel (Prev/Next arrows + dot indicators).
     Adding another image to a card is just another "|path" — no markup or logic
     changes needed. Closes on the X, on a backdrop click, or on ESC — and locks
     page scrolling while open. */

  (function initWorkLightbox() {
    var grid = document.getElementById("workGrid");
    var lightbox = document.getElementById("workLightbox");
    var image = document.getElementById("workLightboxImage");
    if (!grid || !lightbox || !image) return;

    var video = document.getElementById("workLightboxVideo");
    var videoLink = document.getElementById("workLightboxLink");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = document.getElementById("workLightboxPrev");
    var nextBtn = document.getElementById("workLightboxNext");
    var dots = document.getElementById("workLightboxDots");
    var stage = document.getElementById("workLightboxStage");
    var lastFocused = null;

    // carousel state for the image mode
    var images = [];      // list of image paths for the current card
    var baseLabel = "";   // alt text without the "(n of m)" counter
    var index = 0;

    function showImage(i) {
      if (!images.length) return;
      index = (i + images.length) % images.length; // wrap around
      image.src = images[index];
      image.alt = images.length > 1
        ? baseLabel + " (" + (index + 1) + " of " + images.length + ")"
        : baseLabel;

      if (dots) {
        var buttons = dots.children;
        for (var d = 0; d < buttons.length; d++) {
          var isActive = d === index;
          buttons[d].classList.toggle("is-active", isActive);
          buttons[d].setAttribute("aria-current", isActive ? "true" : "false");
        }
      }
    }

    function buildDots(count) {
      if (!dots) return;
      dots.innerHTML = "";
      for (var i = 0; i < count; i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "lightbox-dot";
        dot.setAttribute("aria-label", "Go to image " + (i + 1));
        dot.dataset.index = i;
        dots.appendChild(dot);
      }
    }

    // enter/leave carousel mode: arrows + dots only appear for >1 image
    function setCarousel(on) {
      lightbox.classList.toggle("has-carousel", on);
      if (prevBtn) prevBtn.hidden = !on;
      if (nextBtn) nextBtn.hidden = !on;
      if (dots) dots.hidden = !on;
    }

    function open(card) {
      var src = card.getAttribute("data-popup");
      var embed = card.getAttribute("data-video");
      var link = card.getAttribute("data-link");

      // no image and no embed — nothing to show in the modal, go to the source
      if (!src && !embed) {
        if (link) window.open(link, "_blank", "noopener");
        return;
      }

      var thumb = card.querySelector("img");
      var title = card.querySelector(".work-card-title");
      baseLabel = (thumb && thumb.getAttribute("alt")) ||
        (title && title.textContent) || "Work preview";

      lastFocused = document.activeElement;

      if (embed && video) {
        setCarousel(false);
        images = [];
        var joiner = embed.indexOf("?") === -1 ? "?" : "&";
        video.innerHTML = '<iframe src="' + embed + joiner + 'autoplay=1' +
          '" title="' + baseLabel.replace(/"/g, "&quot;") +
          '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
        video.hidden = false;
        image.hidden = true;
        if (videoLink && link) {
          videoLink.href = link;
          videoLink.hidden = false;
        }
      } else {
        // one path, or several joined with "|" -> carousel
        images = src.split("|")
          .map(function (s) { return s.trim(); })
          .filter(function (s) { return s; });

        var multi = images.length > 1;
        if (multi) buildDots(images.length);
        setCarousel(multi);
        showImage(0);

        image.hidden = false;
        if (video) video.hidden = true;
        if (videoLink) videoLink.hidden = true;
      }

      lightbox.hidden = false;
      // next frame so the browser has a non-hidden starting state to animate from
      requestAnimationFrame(function () { lightbox.classList.add("is-open"); });

      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (lightbox.hidden) return;
      lightbox.classList.remove("is-open");

      if (lenis) lenis.start();
      document.body.style.overflow = "";

      // wait for the fade-out before hiding and dropping the (large) image /
      // the iframe — removing the iframe is what actually stops playback
      setTimeout(function () {
        lightbox.hidden = true;
        image.src = "";
        image.hidden = false;
        images = [];
        setCarousel(false);
        if (dots) dots.innerHTML = "";
        if (video) {
          video.innerHTML = "";
          video.hidden = true;
        }
        if (videoLink) videoLink.hidden = true;
      }, 350);

      if (lastFocused && lastFocused.focus) lastFocused.focus();
      lastFocused = null;
    }

    grid.addEventListener("click", function (e) {
      var media = e.target.closest(".work-card-media");
      if (!media) return;
      var card = media.closest(".work-card");
      if (card) open(card);
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target.closest("[data-lightbox-close]")) close();
    });

    if (prevBtn) prevBtn.addEventListener("click", function () { showImage(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { showImage(index + 1); });

    if (dots) {
      dots.addEventListener("click", function (e) {
        var dot = e.target.closest(".lightbox-dot");
        if (dot) showImage(parseInt(dot.dataset.index, 10));
      });
    }

    // swipe navigation on touch devices
    if (stage) {
      var startX = 0, startY = 0, tracking = false;
      stage.addEventListener("touchstart", function (e) {
        if (images.length < 2) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        if (!tracking) return;
        tracking = false;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        // horizontal swipe only, and past a small threshold
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          showImage(dx < 0 ? index + 1 : index - 1);
        }
      }, { passive: true });
    }

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") { close(); return; }
      if (images.length < 2) return;
      if (e.key === "ArrowLeft") { showImage(index - 1); e.preventDefault(); }
      else if (e.key === "ArrowRight") { showImage(index + 1); e.preventDefault(); }
    });
  })();

  /* ---------- Portfolio flipbook ---------- */

  (function initFlipbook() {
    var book = document.getElementById("flipbook");
    if (!book) return;

    var stage = document.getElementById("flipbookStage");
    var prevBtn = document.getElementById("flipPrev");
    var nextBtn = document.getElementById("flipNext");
    var counter = document.getElementById("flipCounter");
    var fullBtn = document.getElementById("flipFull");

    var total = parseInt(book.getAttribute("data-pages"), 10);
    var current = 1;
    var busy = false;
    var inView = false;

    function srcFor(n) {
      return "images/portfolio/page-" + (n < 10 ? "0" + n : n) + ".jpg";
    }

    function makePage(n) {
      var img = document.createElement("img");
      img.className = "flip-page";
      img.src = srcFor(n);
      img.alt = "Portfolio page " + n;
      img.draggable = false;
      return img;
    }

    function preload(n) {
      if (n < 1 || n > total) return;
      var img = new Image();
      img.src = srcFor(n);
    }

    function updateUi() {
      counter.textContent = current + " / " + total;
      prevBtn.disabled = current === 1;
      nextBtn.disabled = current === total;
      preload(current + 1);
      preload(current - 1);
    }

    function goTo(n) {
      if (busy || n === current || n < 1 || n > total) return;
      busy = true;

      var forward = n > current;
      var oldPage = stage.querySelector(".flip-page");
      var newPage = makePage(n);

      function run() {
        if (prefersReducedMotion) {
          stage.replaceChildren(newPage);
          busy = false;
        } else if (forward) {
          // new page revealed underneath while the current page flips away
          stage.insertBefore(newPage, oldPage);
          oldPage.classList.add("flip-out");
          oldPage.addEventListener("animationend", function () {
            oldPage.remove();
            busy = false;
          }, { once: true });
        } else {
          // incoming page flips back down on top of the current one
          stage.appendChild(newPage);
          newPage.classList.add("flip-in");
          newPage.addEventListener("animationend", function () {
            if (oldPage) oldPage.remove();
            newPage.classList.remove("flip-in");
            busy = false;
          }, { once: true });
        }
        current = n;
        updateUi();
      }

      // don't animate onto a blank frame if the image isn't cached yet
      if (newPage.complete) {
        run();
      } else {
        newPage.onload = run;
        newPage.onerror = function () { busy = false; };
      }
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); });

    /* keyboard paging while the book is on screen */
    var viewObserver = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
    }, { threshold: 0.35 });
    viewObserver.observe(book);

    document.addEventListener("keydown", function (e) {
      if (!inView) return;
      if (e.key === "ArrowRight") { goTo(current + 1); }
      if (e.key === "ArrowLeft") { goTo(current - 1); }
    });

    /* swipe / drag paging */
    var startX = null;
    stage.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
      startX = null;
    }, { passive: true });

    stage.addEventListener("mousedown", function (e) { startX = e.clientX; });
    stage.addEventListener("mouseup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
      startX = null;
    });

    /* fullscreen */
    fullBtn.addEventListener("click", function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (book.requestFullscreen) {
        book.requestFullscreen();
      }
    });

    /* first page */
    stage.appendChild(makePage(1));
    updateUi();
  })();

  /* ---------- Contact form ---------- */

  (function initForm() {
    var form = document.getElementById("gform");
    if (!form) return;

    var submitBtn = document.getElementById("sendMessage");
    var nameInput = form.querySelector('input[name="name"]');
    var emailInput = form.querySelector('input[name="email"]');
    var successMsg = document.getElementById("formSuccess");
    var errorMsg = document.getElementById("formError");

    function checkRequiredFields() {
      submitBtn.disabled = !(nameInput.value.trim() !== "" && emailInput.value.trim() !== "");
    }

    nameInput.addEventListener("input", checkRequiredFields);
    emailInput.addEventListener("input", checkRequiredFields);
    checkRequiredFields();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Web3Forms returns JSON only for JSON-body requests, so convert the form data
      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      successMsg.classList.remove("show");
      errorMsg.classList.remove("show");

      function finish() {
        submitBtn.textContent = "Book a Free Consultation";
        checkRequiredFields();
      }

      fetch(form.action, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json", Accept: "application/json" }
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          finish();
          if (data.success) {
            successMsg.classList.add("show");
            form.reset();
            checkRequiredFields();
            setTimeout(function () { successMsg.classList.remove("show"); }, 8000);
          } else {
            console.error("Form submission rejected:", data.message);
            errorMsg.classList.add("show");
          }
        })
        .catch(function (error) {
          console.error(error);
          finish();
          errorMsg.classList.add("show");
        });
    });
  })();

})();
