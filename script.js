const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPlaceholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
let lastLightboxTrigger = null;
const carouselControllers = new Map();

function formatSlideNumber(number) {
  return String(number).padStart(2, "0");
}

function restoreGalleryImages() {
  document.querySelectorAll(".image-open").forEach((trigger) => {
    if (trigger.querySelector("img") || !trigger.dataset.lightboxSrc) {
      return;
    }

    const image = document.createElement("img");
    image.src = trigger.dataset.lightboxSrc;
    image.alt = trigger.dataset.lightboxAlt || trigger.dataset.lightboxCaption || "";
    trigger.prepend(image);
  });
}

function pauseAllCarousels() {
  carouselControllers.forEach((controller) => controller.pause());
}

function startAllCarousels() {
  carouselControllers.forEach((controller) => controller.start());
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const previous = carousel.querySelector(".carousel-button-prev");
  const next = carousel.querySelector(".carousel-button-next");
  const current = carousel.querySelector("[data-carousel-current]");
  const total = carousel.querySelector("[data-carousel-total]");
  const originalSlides = Array.from(carousel.querySelectorAll(".project-slide"));
  const realCount = originalSlides.length;
  const loopCopies = 7;
  const middleLoop = Math.floor(loopCopies / 2);
  let slides = [];
  let activeIndex = realCount * middleLoop;
  let autoplayTimer = null;
  let resumeTimer = null;
  let isJumping = false;

  if (total) {
    total.textContent = formatSlideNumber(realCount);
  }

  if (!track || realCount === 0) {
    return;
  }

  function buildLoop() {
    const loopedSlides = [];

    for (let copyIndex = 0; copyIndex < loopCopies; copyIndex += 1) {
      originalSlides.forEach((slide) => {
        loopedSlides.push(slide.cloneNode(true));
      });
    }

    track.replaceChildren(...loopedSlides);
    slides = Array.from(track.querySelectorAll(".project-slide"));
  }

  function getRealIndex(index) {
    return ((index % realCount) + realCount) % realCount;
  }

  function setTrackTransition(enabled) {
    track.style.transition = enabled ? "" : "none";
  }

  function centerSlide(index, animate = true) {
    const slide = slides[index];

    if (!track || !slide) {
      return;
    }

    activeIndex = index;
    setTrackTransition(animate);
    track.style.transform = `translate3d(${(carousel.clientWidth - slide.offsetWidth) / 2 - slide.offsetLeft}px, 0, 0)`;
    updateActiveSlide(index);
  }

  function normalizeLoopPosition() {
    const middleIndex = realCount * middleLoop + getRealIndex(activeIndex);

    if (activeIndex >= realCount * (loopCopies - 2) || activeIndex < realCount) {
      isJumping = true;
      centerSlide(middleIndex, false);
      track.offsetHeight;
      setTrackTransition(true);
      isJumping = false;
    }
  }

  function updateActiveSlide(forcedIndex) {
    if (slides.length === 0) {
      return;
    }

    activeIndex = typeof forcedIndex === "number" ? forcedIndex : activeIndex;

    const activeRealIndex = getRealIndex(activeIndex);

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
      slide.classList.toggle("is-neighbour", Math.abs(index - activeIndex) === 1);
    });

    if (current) {
      current.textContent = formatSlideNumber(activeRealIndex + 1);
    }
  }

  function pauseAutoplay() {
    window.clearInterval(autoplayTimer);
    window.clearTimeout(resumeTimer);
    autoplayTimer = null;
    carousel.classList.add("is-paused");
  }

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || autoplayTimer) {
      return;
    }

    carousel.classList.remove("is-paused");
    autoplayTimer = window.setInterval(() => {
      centerSlide(activeIndex + 1);
    }, 5000);
  }

  function restartAutoplay(delay = 1800) {
    pauseAutoplay();
    resumeTimer = window.setTimeout(startAutoplay, delay);
  }

  function scrollCarousel(direction) {
    centerSlide(activeIndex + direction);
    restartAutoplay();
  }

  buildLoop();
  centerSlide(activeIndex, false);

  previous?.addEventListener("click", () => scrollCarousel(-1));
  next?.addEventListener("click", () => scrollCarousel(1));

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform" && !isJumping) {
      normalizeLoopPosition();
    }
  });

  track.addEventListener("pointerdown", () => restartAutoplay(3000));
  window.addEventListener("resize", () => centerSlide(activeIndex, false));

  carouselControllers.set(carousel, {
    pause: pauseAutoplay,
    start: startAutoplay,
  });

  startAutoplay();
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightboxImage.src = lightboxPlaceholder;
  document.body.classList.remove("lightbox-open");

  if (lastLightboxTrigger?.isConnected) {
    lastLightboxTrigger.focus({ preventScroll: true });
  }

  restoreGalleryImages();

  startAllCarousels();
}

function openLightbox(trigger) {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  const image = trigger.querySelector("img");
  const src = trigger.dataset.lightboxSrc || image?.src;
  const caption = trigger.dataset.lightboxCaption || image?.alt || "";

  if (!src) {
    return;
  }

  lightboxImage.src = src;
  lightboxImage.alt = image?.alt || caption;
  lightboxCaption.textContent = caption;
  lastLightboxTrigger = trigger;
  pauseAllCarousels();
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

document.querySelectorAll(".image-open").forEach((trigger) => {
  const image = trigger.querySelector("img");

  if (image?.alt && !trigger.dataset.lightboxAlt) {
    trigger.dataset.lightboxAlt = image.alt;
  }

  trigger.addEventListener("click", () => openLightbox(trigger));
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

if (year) {
  year.textContent = new Date().getFullYear();
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
