const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = process.env.REVIEW_OUTPUT || path.join(root, 'tmp/japandi-review');
  fs.mkdirSync(output, { recursive: true });
  const html = fs.readFileSync(path.join(root,'portfolio/japandi/index.html'),'utf8');
  const git = process.env.GIT_BINARY || 'C:/Program Files/Git/cmd/git.exe';
  const original = execFileSync(git,['show','e79fe962503432e584c2e1cff93a311b97a67b72:portfolio/japandi/index.html'],{cwd:root,encoding:'utf8'});
  const prose = text => text.match(/<div class="reading-copy">([\s\S]*?)<\/div>/)[1].replace(/\s+/g,' ').trim();
  assert.equal(prose(html),prose(original),'Retain full original description');
  const pdf = path.join(root,'assets/documentation/japandi/projekt-b-izabela-switaj.pdf');
  const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const pdfHash = hash(pdf);
  assert.equal(pdfHash,'6479329d4a88d9451027107f2a828b1a56bd6bc4b67e9108c11e6ea786d5fc27');
  if(process.env.PDF_SOURCE) assert.equal(pdfHash,hash(process.env.PDF_SOURCE));
  const sheets = JSON.parse(fs.readFileSync(path.join(root,'assets/documentation/japandi/sheets.json'),'utf8'));
  assert.deepEqual(sheets.map(s=>s.page),Array.from({length:13},(_,i)=>34+i));
  assert.equal(sheets.filter(s=>s.featured).length,8);
  for(const s of sheets) {
    const png=fs.readFileSync(path.resolve(root,'portfolio/japandi',s.detail));
    assert.equal(png.readUInt32BE(16),s.width);
    assert.equal(png.readUInt32BE(20),s.height);
    assert(fs.existsSync(path.resolve(root,'portfolio/japandi',s.thumbnail)));
  }
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const url = process.env.PREVIEW_URL || 'http://127.0.0.1:8022/portfolio/japandi/';
  page.on('response', r => { if (new URL(r.url()).origin === new URL(url).origin && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const captures = {header:'.project-heading',brief:'#zalozenia',plan:'#uklad',library:'#salon',kitchen:'#kuchnia',dining:'#jadalnia',bedroom:'#strefa-prywatna',sanitary:'#strefa-sanitarna',documentation:'#dokumentacja-techniczna',pdf:'#pelne-opracowanie'};
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(url);
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
      await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode()));
    });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('[data-lightbox-src]').count(), 13);
    assert.equal(await page.locator('[data-technical-page]').count(), 8);
    const outline = await page.locator('main h1,main h2,main h3,main h4').evaluateAll(nodes => nodes.map(n=>({level:Number(n.tagName[1]),text:n.textContent})));
    for(let i=1;i<outline.length;i++) assert(outline[i].level<=outline[i-1].level+1,`heading skip: ${outline[i].text}`);
    assert.deepEqual(outline.filter(h=>h.level===2).map(h=>h.text),['Książki wyznaczają rytm wnętrza','Przestrzeń zorganizowana wokół codziennych rytuałów','Prezentacja pomieszczeń','Od koncepcji do szczegółu','Izabela Świtaj']);
    assert.equal(await page.locator('#hol img,#garderoba img').count(),0);
    const libraryTops=await page.locator('.library-presentation > figure').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));
    if(width>640) assert(Math.abs(libraryTops[0]-libraryTops[1])<1,'Moodboard/render top alignment');
    for(const id of ['kuchnia','jadalnia','salon','sypialnia','garderoba','lazienka','dodatkowe-wc']) assert.equal(await page.locator(`#${id} h4`).count(),1);
    assert.equal(await page.locator('#salon h4').evaluate(n=>getComputedStyle(n).fontFamily),await page.locator('#strefa-dzienna h3').evaluate(n=>getComputedStyle(n).fontFamily));
    const ratios=await page.locator('.japandi-story .image-button img').evaluateAll(nodes=>nodes.map(n=>Math.abs(n.width/n.height-n.naturalWidth/n.naturalHeight)));
    assert(ratios.every(delta=>delta<0.02),'Original image proportions');
    const details=page.locator('#spacer-po-mieszkaniu details');
    assert.equal(await details.getAttribute('open'),null);
    const summary=details.locator('summary');
    await summary.focus(); await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'),'');
    await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'),null);
    await summary.blur();
    // Visit every image before a full-page capture so offscreen decoded images are painted.
    for (const image of await page.locator('img[src]').all()) await image.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    const captureStyle='.portfolio-header,.skip-link { visibility:hidden !important; }';
    await page.screenshot({ path: path.join(output, `japandi-${width}.png`), fullPage: true,style:captureStyle });
    for(const [name,selector] of Object.entries(captures)) await page.locator(selector).screenshot({path:path.join(output,`${width}-${name}.png`),style:captureStyle});
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(url);
  const opener = page.locator('[data-lightbox-src]').first();
  await opener.click();
  await page.locator('.portfolio-lightbox img').evaluate(i => i.decode());
  assert(await page.locator('.portfolio-lightbox').isVisible());
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.lightbox-frame figcaption').innerText(), /2 \/ 13/);
  await page.keyboard.press('Escape');
  assert(await opener.evaluate(el => el === document.activeElement));
  for (let n = 0; n < 8; n++) {
    const button = page.locator('[data-technical-page]').nth(n);
    await button.click();
    await page.locator('#technical-large-image').evaluate(i => i.decode());
    const selectedPage=Number(await button.getAttribute('data-technical-page'));
    const sheetIndex=sheets.findIndex(s=>s.page===selectedPage);
    assert.equal(await page.locator('#technical-count').innerText(), `${sheetIndex + 1} / 13`);
    await page.locator('#technical-native').click();
    assert.equal(await page.locator('#technical-zoom-value').innerText(), '100%');
    await page.locator('#technical-zoom-in').click();
    assert.equal(await page.locator('#technical-zoom-value').innerText(), '125%');
    if (n === 0) await page.screenshot({ path: path.join(output, 'technical-viewer.png') });
    await page.keyboard.press('Escape');
    assert(await button.evaluate(el => el === document.activeElement));
  }
  await page.locator('[data-technical-page]').first().click();
  const firstSheetIndex=sheets.findIndex(s=>s.featured);
  for(let n=0;n<13;n++) {
    await page.locator('#technical-large-image').evaluate(i=>i.decode());
    assert.equal(await page.locator('#technical-full-image').getAttribute('href'),sheets[(n+firstSheetIndex)%13].detail);
    await page.locator('#technical-next').click();
  }
  await page.keyboard.press('Escape');
  const pdfLink=page.locator('#pelne-opracowanie');
  assert.equal(await pdfLink.getAttribute('target'),'_blank');
  assert.equal((await page.request.get(new URL(await pdfLink.getAttribute('href'),url).href)).status(),200);
  // Review the controls at the mobile breakpoint as well.
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-technical-page]').first().click();
  const closeBox=await page.locator('#technical-close').boundingBox();
  assert(closeBox.x>=0 && closeBox.y>=0 && closeBox.x+closeBox.width<=390 && closeBox.y+closeBox.height<=844);
  await page.locator('#technical-native').click();
  await page.locator('.technical-viewport').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('.technical-viewport').scrollLeft>0);
  await page.locator('#technical-fit').click();
  await page.screenshot({path:path.join(output,'technical-viewer-mobile.png')});
  await page.keyboard.press('Escape');
  const result = { result:'PASS', widths:[1440,1024,768,390,320], gallery:13, featuredSheets:8, technicalSheets:13, pdfSha256:pdfHash, checks:['H1–H4 hierarchy','original prose retained','keyboard walkthrough','image decoding','no horizontal overflow','moodboard alignment','lightbox navigation','Escape and focus restoration','all technical sheets and full-image links','100% and zoom','mobile viewer and keyboard scrolling','original PDF hash and HTTP link'], browserErrors:errors };
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
