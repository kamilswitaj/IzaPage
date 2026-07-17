(() => {
  const lightbox = document.querySelector(".portfolio-lightbox");

  if (!lightbox) {
    return;
  }

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const controls = [closeButton, previousButton, nextButton].filter(Boolean);
  let projectImages = [];
  let activeIndex = 0;
  let opener = null;

  const showImage = (index) => {
    activeIndex = (index + projectImages.length) % projectImages.length;
    const button = projectImages[activeIndex];
    const sourceImage = button.querySelector("img");

    image.src = button.dataset.lightboxSrc;
    image.alt = sourceImage.alt;
    image.width = Number(sourceImage.getAttribute("width"));
    image.height = Number(sourceImage.getAttribute("height"));
    caption.textContent = button.dataset.lightboxCaption || sourceImage.alt;
  };

  const openLightbox = (button) => {
    const gallery = button.closest(".project-gallery-grid");
    projectImages = Array.from(gallery.querySelectorAll("[data-lightbox-src]"));
    activeIndex = projectImages.indexOf(button);
    opener = button;
    showImage(activeIndex);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    image.removeAttribute("src");
    image.removeAttribute("width");
    image.removeAttribute("height");
    opener?.focus();
  };

  document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showImage(activeIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showImage(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      showImage(activeIndex + 1);
    } else if (event.key === "Tab") {
      const first = controls[0];
      const last = controls[controls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
