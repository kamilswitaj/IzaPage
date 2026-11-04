(() => {
  // Preserve previously shared links to projects on the overview page.
  const legacyProjects = {
    '#projekt-neomodernizm': 'neomodernizm/',
    '#projekt-japandi': 'japandi/',
    '#projekt-lesny-rytm': 'lesny-rytm/'
  };
  const followLegacyLink = () => {
    if (!document.body.classList.contains('case-page') && legacyProjects[location.hash]) {
      location.replace(new URL(legacyProjects[location.hash], location.href));
    }
  };
  followLegacyLink();
  window.addEventListener('hashchange', followLegacyLink);

  const lightbox = document.querySelector('.portfolio-lightbox');
  if (!lightbox) return;
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  const controls = [closeButton, previousButton, nextButton];
  let projectImages = [];
  let activeIndex = 0;
  let opener;
  let background = [];

  const showImage = (index) => {
    activeIndex = (index + projectImages.length) % projectImages.length;
    const button = projectImages[activeIndex];
    const thumbnail = button.querySelector('img');
    image.alt = thumbnail.alt;
    image.width = Number(thumbnail.getAttribute('width'));
    image.height = Number(thumbnail.getAttribute('height'));
    caption.textContent = (button.dataset.lightboxCaption || thumbnail.alt) + ' · ' + (activeIndex + 1) + ' / ' + projectImages.length;
    image.src = button.dataset.lightboxSrc;
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    for (const [element, wasInert] of background) element.inert = wasInert;
    background = [];
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  };

  const openLightbox = (button) => {
    projectImages = Array.from(button.closest('.project').querySelectorAll('[data-lightbox-src]'));
    opener = button;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    background = Array.from(document.body.children)
      .filter(element => element !== lightbox && element.tagName !== 'SCRIPT')
      .map(element => [element, element.inert]);
    for (const [element] of background) element.inert = true;
    showImage(projectImages.indexOf(button));
    closeButton.focus();
  };

  image.addEventListener('error', () => {
    if (!lightbox.hidden) caption.textContent = 'Nie udało się wczytać obrazu. Wybierz inne zdjęcie lub zamknij podgląd.';
  });
  document.querySelectorAll('[data-lightbox-src]').forEach(button => {
    button.addEventListener('click', () => openLightbox(button));
  });
  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showImage(activeIndex - 1));
  nextButton.addEventListener('click', () => showImage(activeIndex + 1));
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (lightbox.hidden) return;
    if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
    if (event.key === 'Escape') closeLightbox();
    else if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
    else if (event.key === 'ArrowRight') showImage(activeIndex + 1);
    else if (event.key === 'Tab') {
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
})();
