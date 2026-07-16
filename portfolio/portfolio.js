(() => {
  const printButtons = document.querySelectorAll("[data-print]");
  const imageButtons = Array.from(document.querySelectorAll("[data-lightbox-src]"));
  const lightbox = document.querySelector(".portfolio-lightbox");

  printButtons.forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  if (!lightbox || imageButtons.length === 0) {
    return;
  }

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const focusableControls = [closeButton, prevButton, nextButton].filter(Boolean);
  let activeIndex = 0;
  let lastFocusedElement = null;

  const setImage = (index) => {
    activeIndex = (index + imageButtons.length) % imageButtons.length;
    const trigger = imageButtons[activeIndex];
    const nestedImage = trigger.querySelector("img");
    const caption = trigger.dataset.lightboxCaption || nestedImage?.alt || "";

    lightboxImage.src = trigger.dataset.lightboxSrc;
    lightboxImage.alt = nestedImage?.alt || caption;
    lightboxCaption.textContent = caption;
  };

  const openLightbox = (index) => {
    lastFocusedElement = document.activeElement;
    setImage(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton?.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const showPrevious = () => setImage(activeIndex - 1);
  const showNext = () => setImage(activeIndex + 1);

  imageButtons.forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index));
  });

  closeButton?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", showPrevious);
  nextButton?.addEventListener("click", showNext);

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
    }

    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }

    if (event.key === "Tab" && focusableControls.length > 0) {
      const firstControl = focusableControls[0];
      const lastControl = focusableControls[focusableControls.length - 1];

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault();
        lastControl.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl.focus();
      }
    }
  });
})();
