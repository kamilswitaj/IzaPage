const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.REVIEW_OUTPUT || path.join(root, 'tmp/project-headings-review'));
const projects = ['neomodernizm', 'japandi', 'lesny-rytm'];
const git = process.env.GIT_BINARY || (process.platform === 'win32' ? 'C:/Program Files/Git/cmd/git.exe' : 'git');
fs.mkdirSync(output, { recursive: true });

// Opening changes must leave the approved narrative and galleries intact.
for (const slug of projects) {
  const file = 'portfolio/' + slug + '/index.html';
  const before = execFileSync(git, ['show', 'b44cc3f:' + file], { cwd: root, encoding: 'utf8' });
  const after = fs.readFileSync(path.join(root, file), 'utf8');
  const story = html => html.slice(html.indexOf('<div class="project-story'))
    .replace(/<nav class="japandi-index"[\s\S]*?<\/nav>\r?\n/, '').replace(/\r\n/g, '\n');
  assert.equal(story(after), story(before), slug + ': narrative and galleries unchanged');
}

const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  try {
    const types = { '.css': 'text/css', '.js': 'application/javascript', '.html': 'text/html', '.webp': 'image/webp' };
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404); res.end(); }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const metrics = [];
  try {
    for (const width of [1700, 1440, 768, 390]) {
      const group = [];
      for (const slug of projects) {
        const page = await browser.newPage({ viewport: { width, height: 1600 } });
        await page.goto('http://127.0.0.1:' + server.address().port + '/portfolio/' + slug + '/');
        await page.evaluate(() => document.fonts.ready);
        await page.locator('.case-cover img').evaluate(img => img.decode());
        const m = await page.evaluate(() => {
          const rect = selector => {
            const r = document.querySelector(selector).getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height, bottom: r.bottom };
          };
          return {
            cover: rect('.case-cover img'), heading: rect('.project-heading'),
            intro: rect('.project-intro'), number: rect('.project-number'),
            title: rect('h1'), style: rect('.project-style'), software: rect('.project-software'),
            story: rect('.project-story'),
            nav: document.querySelector('.project-index') ? rect('.project-index') : null,
            overflow: document.documentElement.scrollWidth > innerWidth,
            font: getComputedStyle(document.querySelector('h1')).fontFamily,
            columns: getComputedStyle(document.querySelector('.project-heading')).gridTemplateColumns.split(' ').length,
          };
        });
        assert(!m.overflow, slug + ': no overflow at ' + width);
        assert(Math.abs(m.cover.x - m.heading.x) < 1, slug + ': cover/heading axis');
        assert(Math.abs(m.cover.w - m.heading.w) < 1, slug + ': cover/heading width');
        assert.equal(Math.round(m.heading.y - m.cover.bottom), width <= 640 ? 36 : 56);
        assert.equal(Math.round(m.story.y - m.heading.bottom), 56);
        assert.equal(m.columns, width <= 900 ? 1 : 2);
        assert.equal(m.style.x, m.intro.x);
        assert.equal(m.software.x, m.intro.x);
        if (m.nav) {
          assert.equal(m.nav.x, m.intro.x);
          assert(m.nav.y > m.software.bottom);
        }
        group.push({ width, slug, ...m });
        await page.screenshot({ path: path.join(output, slug + '-' + width + '.png'),
          clip: { x: 0, y: 0, width, height: Math.ceil(m.story.y + 140) } });
        await page.close();
      }
      for (const m of group) {
        assert.equal(m.intro.x, group[0].intro.x);
        assert.equal(m.intro.w, group[0].intro.w);
        assert.equal(m.heading.y, group[0].heading.y);
        assert.equal(m.font, group[0].font);
      }
      metrics.push(...group);
      const comparison = await browser.newPage({ viewport: { width: Math.min(width, 640) * 3, height: 1600 } });
      const images = projects.map(slug => {
        const image = fs.readFileSync(path.join(output, slug + '-' + width + '.png')).toString('base64');
        return '<figure><figcaption>' + slug + ' / ' + width + ' px</figcaption><img src="data:image/png;base64,' + image + '"></figure>';
      }).join('');
      await comparison.setContent('<style>body{margin:0;display:flex;background:#ddd;font:16px Arial}figure{margin:0;width:33.333%}figcaption{padding:12px}img{width:100%;display:block}</style>' + images);
      await comparison.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      await comparison.screenshot({ path: path.join(output, 'comparison-' + width + '.png'), fullPage: true });
      await comparison.close();
    }
    fs.writeFileSync(path.join(output, 'metrics.json'), JSON.stringify(metrics, null, 2));
    console.log('PASS: 12 opening layouts; matching axes, spacing, fonts, responsive columns, no overflow; narratives and galleries unchanged.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
