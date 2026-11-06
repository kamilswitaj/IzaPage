const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = process.env.REVIEW_OUTPUT || path.join(root, 'tmp/japandi-review');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.url().startsWith('http://127.0.0.1:8012') && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const url = process.env.PREVIEW_URL || 'http://127.0.0.1:8012/portfolio/japandi/';
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(url);
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
      await Promise.all([...document.images].filter(i => i.getAttribute('src')).map(i => i.decode()));
    });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('[data-lightbox-src]').count(), 13);
    assert.equal(await page.locator('[data-technical-page]').count(), 13);
    // Visit every image before a full-page capture so offscreen decoded images are painted.
    for (const image of await page.locator('img[src]').all()) await image.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, `japandi-${width}.png`), fullPage: true });
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
  for (let n = 0; n < 13; n++) {
    const button = page.locator('[data-technical-page]').nth(n);
    await button.click();
    await page.locator('#technical-large-image').evaluate(i => i.decode());
    assert.equal(await page.locator('#technical-count').innerText(), `${n + 1} / 13`);
    await page.locator('#technical-native').click();
    assert.equal(await page.locator('#technical-zoom-value').innerText(), '100%');
    await page.locator('#technical-zoom-in').click();
    assert.equal(await page.locator('#technical-zoom-value').innerText(), '125%');
    if (n === 0) await page.screenshot({ path: path.join(output, 'technical-viewer.png') });
    await page.keyboard.press('Escape');
    assert(await button.evaluate(el => el === document.activeElement));
  }
  const result = { result:'PASS', widths:[1440,768,390,320], gallery:13, technicalSheets:13, checks:['image decoding','no horizontal overflow','lightbox navigation','Escape and focus restoration','all technical sheets','100% and zoom'], browserErrors:errors };
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
