const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'lesny-grid-'));
const git = process.env.GIT_BINARY || 'C:/Program Files/Git/cmd/git.exe';
const approvedRef = '7b778cd8a4f06e5a8bd0658f9ebd4afbcb381497';
const historical = file => execFileSync(git, ['show', approvedRef + ':' + file], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
const approved = historical('portfolio/lesny-rytm/index.html');
const oldCSS = historical('portfolio/lesny-rytm/lesny-rytm.css');
const currentHTML = fs.readFileSync(path.join(root, 'portfolio/lesny-rytm/index.html'), 'utf8');
assert.equal((currentHTML.match(/V\u2011Ray/g) || []).length, 14, 'All V-Ray names use a nonbreaking hyphen');
assert(!currentHTML.includes('V-Ray'), 'No breakable V-Ray names remain');
// Treat only the approved nonbreaking hyphen as equivalent in preserved-copy checks.
const current = currentHTML.replace(/V\u2011Ray/g, 'V-Ray');
const figures = text => [...text.replace(/\r\n/g, '\n').matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map(m => m[0]);
assert.deepEqual(figures(current), figures(approved), 'Every image, caption and source stays unchanged');
const cards = text => [...text.replace(/\r\n/g, '\n').matchAll(/<article class="technical-card">[\s\S]*?<\/article>/g)].map(m => m[0]);
assert.deepEqual(cards(current), cards(approved), 'Technical cards unchanged');
assert.equal(current.match(/<script type="application\/json" id="technical-sheet-data">[\s\S]*?<\/script>/)[0], approved.match(/<script type="application\/json" id="technical-sheet-data">[\s\S]*?<\/script>/)[0]);
const close = (a, b, label) => assert(Math.abs(a - b) < 1, label + ': ' + a + ' vs ' + b);
const widths = [1700, 1440, 768, 390];
const heroGeometry = page => page.evaluate(() => ['.case-cover img', '.project-heading', '.project-heading h1'].map(s => {
  const r = document.querySelector(s).getBoundingClientRect(); return [r.x, r.y + scrollY, r.width, r.height];
}));
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BINARY || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined) });
  try {
    const page = await browser.newPage();
    const reference = await browser.newPage();
    const before = await browser.newPage();
    for (const p of [page, reference, before]) await p.emulateMedia({reducedMotion:'reduce'});
    const base = process.argv[2] || 'http://127.0.0.1:8766/';
    const url = new URL('portfolio/lesny-rytm/', base).href;
    const errors = [];
    for (const p of [page, reference, before]) p.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
    await before.route(url, r => r.fulfill({ contentType: 'text/html', body: approved }));
    await before.route('**/lesny-rytm.css*', r => r.fulfill({ contentType: 'text/css', body: oldCSS }));
    await page.goto(url, {waitUntil:'networkidle'});
    await reference.goto(new URL('portfolio/japandi/', base).href, {waitUntil:'networkidle'});
    await before.goto(url, {waitUntil:'networkidle'});
    await Promise.all([page, reference, before].map(p => p.evaluate(() => document.fonts.ready)));
    assert(await page.evaluate(html => {
      const old = new DOMParser().parseFromString(html, 'text/html');
      const copy = d => [...d.querySelectorAll('.organic-story h2,.organic-story h3,.organic-story h4,.organic-story p,.organic-story figcaption')].map(e => e.textContent.trim().replace(/V\u2011Ray/g, 'V-Ray'));
      return JSON.stringify(copy(document)) === JSON.stringify(copy(old));
    }, approved), 'All approved text unchanged');
    const measurements = [];
    for (const width of widths) {
      for (const p of [page, reference, before]) {
        await p.setViewportSize({ width, height: 1100 });
        await p.evaluate(async () => { scrollTo(0, 0); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
      }
      const actualHero = await heroGeometry(page), oldHero = await heroGeometry(before);
      actualHero.forEach((box, i) => box.forEach((value, j) => close(value, oldHero[i][j], 'Unchanged hero at ' + width)));
      const ref = await reference.locator('#zalozenia').evaluate(el => {
        const r = el.getBoundingClientRect(), story = document.querySelector('.japandi-story').getBoundingClientRect();
        return { x: r.x, width: r.width, visualWidth: story.width, gap: parseFloat(getComputedStyle(el).marginBottom) };
      });
      const metrics = await page.evaluate(() => {
        const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        const story = document.querySelector('.organic-story');
        return { story: box(story), gap: parseFloat(getComputedStyle(story).rowGap), overflow: document.documentElement.scrollWidth > innerWidth,
          editorial: [...document.querySelectorAll('.organic-editorial,.organic-mural-copy')].map(el => ({ box: box(el), children: [...el.querySelectorAll('h2,h3,p')].map(box) })),
          pairs: [...document.querySelectorAll('.organic-comparison .organic-grid,#zabudowa > .organic-grid')].map(el => [...el.querySelectorAll('.image-button')].map(box)),
          fits: [...document.querySelectorAll('.organic-story .image-button img')].every(el => getComputedStyle(el).objectFit === 'contain'),
          headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(el => Number(el.tagName[1])) };
      });
      assert(!metrics.overflow, 'No overflow at ' + width); assert(metrics.fits, 'Uncropped images');
      close(metrics.story.width, ref.visualWidth, 'Japandi visual width at ' + width);
      close(metrics.gap, ref.gap, 'Japandi section rhythm at ' + width);
      for (const e of metrics.editorial) {
        close(e.box.x, ref.x, 'Japandi editorial left axis at ' + width);
        close(e.box.width, ref.width, 'Japandi editorial width at ' + width);
        for (const c of e.children) { close(c.x, e.box.x, 'Shared text axis'); close(c.width, e.box.width, 'Shared heading and paragraph width'); }
      }
      for (const pair of metrics.pairs) {
        close(pair[0].width, pair[1].width, 'Equal comparison widths');
        close(pair[0].height, pair[1].height, 'Equal comparison heights');
        if (width > 640) close(pair[0].y, pair[1].y, 'Aligned comparison row');
        else assert(pair[1].y > pair[0].y, 'Mobile comparison stacks');
      }
      let previous = 0; for (const level of metrics.headings) { assert(level <= previous + 1); previous = level; }
      await page.locator('img[loading=lazy]').evaluateAll(xs => xs.forEach(x => x.loading = 'eager'));
      await page.evaluate(async () => {
        for (const x of document.querySelectorAll('img[src]')) await x.decode();
        for (let y = 0; y < document.body.scrollHeight; y += 900) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
        scrollTo(0, 0);
      });
      await page.screenshot({ path: path.join(output, 'full-' + width + '.png'), fullPage: true });
      for (const [p, name] of [[page, 'lesny'], [reference, 'japandi']]) {
        await p.locator('#zalozenia').scrollIntoViewIfNeeded();
        await p.screenshot({ path: path.join(output, name + '-editorial-' + width + '.png') });
      }
      if (width === 1440 || width === 390) await page.locator('.organic-comparison').first().screenshot({ path: path.join(output, 'comparison-' + width + '.png') });
      measurements.push({ width, visual: Math.round(metrics.story.width), editorial: Math.round(ref.width), left: Math.round(ref.x), sectionGap: metrics.gap });
    }
    await page.locator('#zabudowa .image-button').first().click();
    await page.locator('.portfolio-lightbox').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape'); assert(await page.locator('.portfolio-lightbox').isHidden());
    for (const n of [2, 5, 10, 14]) {
      await page.locator(`[data-technical-page="${n}"]`).click();
      await page.waitForFunction(() => { const im = document.querySelector('#technical-large-image'); return im.complete && im.naturalWidth > 0; });
      assert((await page.locator('#technical-viewer-meta').textContent()).includes('Rys. ' + n + ' '));
      const zoom = await page.locator('#technical-zoom-value').textContent();
      await page.locator('#technical-zoom-in').click(); assert.notEqual(await page.locator('#technical-zoom-value').textContent(), zoom);
      await page.keyboard.press('Escape'); assert(!(await page.locator('#technical-sheet-viewer').evaluate(el => el.open)));
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'PASS', widths, measurements, hero: 'unchanged', prose: 'unchanged', images: 'contain, equal comparison frames', sheets: [2, 5, 10, 14], errors }, null, 2));
    console.log('Screenshots: ' + output);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
