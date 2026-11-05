(() => {
  const root = document.querySelector('#dokumentacja-techniczna');
  const data = document.querySelector('#technical-sheet-data');
  if (!root || !data) return;
  const sheets = JSON.parse(data.textContent);
  const dialog = document.querySelector('#technical-sheet-viewer');
  const viewport = dialog.querySelector('.technical-viewport');
  const image = dialog.querySelector('#technical-large-image');
  const scaleOutput = dialog.querySelector('#technical-zoom-value');
  let index = 0;
  let scale = 1;
  let fitMode = true;
  let drag;

  function applyScale(value) {
    scale = Math.max(0.05, Math.min(3, value));
    image.style.width = `${sheets[index].width * scale}px`;
    scaleOutput.textContent = `${Math.round(scale * 100)}%`;
  }

  function fit() {
    fitMode = true;
    const sheet = sheets[index];
    applyScale(Math.min((viewport.clientWidth - 48) / sheet.width, (viewport.clientHeight - 48) / sheet.height, 1));
    viewport.scrollTo(0, 0);
  }

  function show(next) {
    index = (next + sheets.length) % sheets.length;
    const sheet = sheets[index];
    dialog.querySelector('#technical-viewer-title').textContent = sheet.title;
    dialog.querySelector('#technical-viewer-meta').textContent = `Rys. ${sheet.number} · Strona PDF ${sheet.page} · Skala ${sheet.scale}`;
    dialog.querySelector('#technical-count').textContent = `${index + 1} / ${sheets.length}`;
    dialog.querySelector('#technical-full-image').href = sheet.detail;
    image.alt = `${sheet.title} — oryginalny arkusz ${sheet.number}`;
    image.width = sheet.width;
    image.height = sheet.height;
    image.src = sheet.detail;
    fit();
  }

  root.querySelectorAll('[data-technical-page]').forEach(button => {
    button.addEventListener('click', () => {
      dialog.showModal();
      document.body.classList.add('technical-viewer-open');
      show(sheets.findIndex(sheet => sheet.page === Number(button.dataset.technicalPage)));
    });
  });
  dialog.querySelector('#technical-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('technical-viewer-open');
    image.removeAttribute('src');
  });
  dialog.querySelector('#technical-fit').addEventListener('click', fit);
  dialog.querySelector('#technical-native').addEventListener('click', () => { fitMode = false; applyScale(1); viewport.scrollTo(0, 0); });
  dialog.querySelector('#technical-zoom-in').addEventListener('click', () => { fitMode = false; applyScale(scale * 1.25); });
  dialog.querySelector('#technical-zoom-out').addEventListener('click', () => { fitMode = false; applyScale(scale / 1.25); });
  dialog.querySelector('#technical-previous').addEventListener('click', () => show(index - 1));
  dialog.querySelector('#technical-next').addEventListener('click', () => show(index + 1));
  image.addEventListener('load', () => { if (dialog.open && fitMode) fit(); });
  image.addEventListener('error', () => { if (dialog.open) dialog.querySelector('#technical-viewer-meta').textContent = 'Nie udało się wczytać arkusza. Zamknij podgląd i spróbuj ponownie.'; });
  window.addEventListener('resize', () => { if (dialog.open && fitMode) fit(); });

  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.pointerType !== 'mouse') return;
    drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag) return;
    viewport.scrollLeft = drag.left - (event.clientX - drag.x);
    viewport.scrollTop = drag.top - (event.clientY - drag.y);
  });
  viewport.addEventListener('keydown', event => {
    const steps = { ArrowLeft: [-100, 0], ArrowRight: [100, 0], ArrowUp: [0, -100], ArrowDown: [0, 100], PageUp: [0, -viewport.clientHeight * 0.8], PageDown: [0, viewport.clientHeight * 0.8] };
    if (!steps[event.key]) return;
    event.preventDefault();
    viewport.scrollBy(steps[event.key][0], steps[event.key][1]);
  });
  const endDrag = () => { drag = null; viewport.classList.remove('dragging'); };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
})();
