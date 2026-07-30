const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = lightbox?.querySelector("[data-lightbox-image]");
const lightboxCaption = lightbox?.querySelector("[data-lightbox-caption]");
const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");
const lightboxPlaceholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
let lastLightboxTrigger = null;

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Otwórz menu");
    }
  });
}

function formatProjectIndex(index) {
  return String(index + 1).padStart(2, "0");
}

document.querySelectorAll("[data-project-gallery]").forEach((gallery) => {
  const mainButton = gallery.querySelector("[data-project-main]");
  const mainImage = gallery.querySelector("[data-project-main-image]");
  const caption = gallery.querySelector("[data-project-caption]");
  const counter = gallery.querySelector("[data-project-counter]");
  const previous = gallery.querySelector("[data-project-prev]");
  const next = gallery.querySelector("[data-project-next]");
  const thumbnails = Array.from(gallery.querySelectorAll("[data-project-thumb]"));
  const projectName = gallery.dataset.projectName || "projektu";
  let currentIndex = 0;

  if (!mainButton || !mainImage || !caption || !counter || thumbnails.length === 0) {
    return;
  }

  function showImage(index, { focusThumbnail = false, revealThumbnail = false } = {}) {
    currentIndex = (index + thumbnails.length) % thumbnails.length;

    const activeThumbnail = thumbnails[currentIndex];
    const thumbnailImage = activeThumbnail.querySelector("img");

    if (!thumbnailImage) {
      return;
    }

    const source = thumbnailImage.getAttribute("src");
    const imageAlt = thumbnailImage.alt;
    const imageCaption = activeThumbnail.dataset.caption || imageAlt;
    const fit = activeThumbnail.dataset.fit || "cover";

    mainImage.src = source;
    mainImage.alt = imageAlt;
    mainImage.width = Number(thumbnailImage.getAttribute("width")) || thumbnailImage.naturalWidth;
    mainImage.height = Number(thumbnailImage.getAttribute("height")) || thumbnailImage.naturalHeight;
    mainImage.dataset.fit = fit;

    mainButton.dataset.lightboxSrc = source;
    mainButton.dataset.lightboxCaption = `${projectName} - ${imageCaption}`;
    mainButton.setAttribute("aria-label", `Powiększ zdjęcie projektu ${projectName}: ${imageCaption}`);

    caption.textContent = imageCaption;
    counter.textContent = `${formatProjectIndex(currentIndex)} / ${String(thumbnails.length).padStart(2, "0")}`;

    thumbnails.forEach((thumbnail, thumbnailIndex) => {
      const isActive = thumbnailIndex === currentIndex;
      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-pressed", String(isActive));
      thumbnail.tabIndex = isActive ? 0 : -1;

      if (isActive) {
        thumbnail.setAttribute("aria-current", "true");
      } else {
        thumbnail.removeAttribute("aria-current");
      }
    });

    if (revealThumbnail) {
      activeThumbnail.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }

    if (focusThumbnail) {
      activeThumbnail.focus();
    }
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => showImage(index, { revealThumbnail: true }));
    thumbnail.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(index - 1, { focusThumbnail: true, revealThumbnail: true });
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(index + 1, { focusThumbnail: true, revealThumbnail: true });
      }

      if (event.key === "Home") {
        event.preventDefault();
        showImage(0, { focusThumbnail: true, revealThumbnail: true });
      }

      if (event.key === "End") {
        event.preventDefault();
        showImage(thumbnails.length - 1, { focusThumbnail: true, revealThumbnail: true });
      }
    });
  });

  previous?.addEventListener("click", () => showImage(currentIndex - 1, { revealThumbnail: true }));
  next?.addEventListener("click", () => showImage(currentIndex + 1, { revealThumbnail: true }));

  showImage(0);
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
