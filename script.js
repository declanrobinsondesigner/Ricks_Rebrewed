(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-year]");
  const lightboxRoot = document.querySelector("[data-lightbox-root]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-lightbox-caption]");
  let lastFocus = null;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  let headerTicking = false;
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    headerTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (headerTicking) return;
      headerTicking = true;
      window.requestAnimationFrame(setHeaderState);
    },
    { passive: true }
  );

  if (toggle && nav && header) {
    const closeNav = () => {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const closeLightbox = () => {
    if (!lightboxRoot || !lightboxImage) return;
    lightboxRoot.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    if (lightboxCaption) lightboxCaption.textContent = "";
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  };

  const openLightbox = (trigger) => {
    if (!lightboxRoot || !lightboxImage) return;
    const src = trigger.getAttribute("data-src");
    if (!src) return;

    lastFocus = trigger;
    const alt =
      trigger.getAttribute("data-alt") ||
      trigger.querySelector("img")?.alt ||
      "";

    lightboxImage.classList.remove("is-small-source");
    lightboxImage.onload = () => {
      lightboxImage.classList.toggle(
        "is-small-source",
        lightboxImage.naturalWidth > 0 && lightboxImage.naturalWidth < 900
      );
    };
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    if (lightboxCaption) lightboxCaption.textContent = alt;
    lightboxRoot.hidden = false;
    document.body.classList.add("lightbox-open");

    const closeBtn = lightboxRoot.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
  };

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(trigger);
    });
  });

  if (lightboxRoot) {
    lightboxRoot.querySelectorAll("[data-lightbox-close]").forEach((btn) => {
      btn.addEventListener("click", closeLightbox);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightboxRoot.hidden) {
        closeLightbox();
      }
    });
  }

  const foodMore = document.querySelector("[data-food-more]");
  const foodToggle = document.querySelector("[data-food-toggle]");
  if (foodMore && foodToggle) {
    foodToggle.addEventListener("click", () => {
      const open = foodMore.hasAttribute("hidden");
      if (open) {
        foodMore.removeAttribute("hidden");
        foodToggle.setAttribute("aria-expanded", "true");
        foodToggle.textContent = "Show less";
      } else {
        foodMore.setAttribute("hidden", "");
        foodToggle.setAttribute("aria-expanded", "false");
        foodToggle.textContent = "Show us a bit more food";
        document.querySelector("#gallery")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  const mapFrame = document.querySelector("iframe[data-map-src]");
  if (mapFrame) {
    const loadMap = () => {
      const src = mapFrame.getAttribute("data-map-src");
      if (!src || mapFrame.getAttribute("src") === src) return;
      mapFrame.setAttribute("src", src);
    };

    if ("IntersectionObserver" in window) {
      const mapObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          loadMap();
          mapObserver.disconnect();
        },
        { rootMargin: "200px 0px" }
      );
      mapObserver.observe(mapFrame);
    } else {
      loadMap();
    }
  }
})();
