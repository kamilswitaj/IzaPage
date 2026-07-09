const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

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

  function scrollCarousel(direction) {
    if (!track) {
      return;
    }

    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.82, 260),
      behavior: "smooth",
    });
  }

  previous?.addEventListener("click", () => scrollCarousel(-1));
  next?.addEventListener("click", () => scrollCarousel(1));
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  document.body.classList.remove("lightbox-open");
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
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

document.querySelectorAll(".image-open").forEach((trigger) => {
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
