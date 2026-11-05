import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = 'portfolio/neomodernizm/index.html';
const html = readFileSync(resolve(root, pagePath), 'utf8');
const sheets = JSON.parse(html.match(/<script type="application\/json" id="technical-sheet-data">([\s\S]*?)<\/script>/)[1]);
const pages = Array.from({ length: 15 }, (_, i) => i + 50);
assert.deepEqual(sheets.map(s => s.page), pages);
assert.deepEqual(sheets.map(s => s.number), pages.map(p => `${p - 49}.0`));
const buttons = text => [...text.matchAll(/data-technical-page="(\d+)"/g)].map(m => Number(m[1]));
const complete = html.split('<details class="technical-complete"')[1].split('</details>')[0];
assert.deepEqual(buttons(complete), pages);
assert.deepEqual(buttons(html).slice(0, 8), [51, 53, 55, 56, 59, 60, 61, 63]);
assert.equal(sheets.find(s => s.page === 64).title, 'Łazienka i toaleta -okładziny');
assert.ok(html.includes('Projekt dyplomowy — mieszkanie 67,25 m² dla rodziny 2+2.'));
assert.ok(html.includes('w spisie pracy występuje jako 7.1'));
assert.ok(!/href="[^"]*\.pdf/i.test(html));
for (const sheet of sheets) {
  const png = readFileSync(resolve(root, 'portfolio/neomodernizm', sheet.detail));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.equal(png.readUInt32BE(16), 4961);
  assert.equal(png.readUInt32BE(20), 3508);
  assert.equal(readFileSync(resolve(root, 'portfolio/neomodernizm', sheet.thumbnail)).toString('ascii', 8, 12), 'WEBP');
}
for (const [folder, ext] of [['details', '.png'], ['thumbs', '.webp']]) {
  const files = readdirSync(resolve(root, 'assets/documentation/neomodernizm', folder));
  assert.equal(files.length, 15);
  assert.ok(files.every(f => f.endsWith(ext)));
}
const git = process.env.GIT_EXECUTABLE || 'C:/Program Files/Git/cmd/git.exe';
const baseline = execFileSync(git, ['show', `checkpoint/2026-11-05-before-technical-docs:${pagePath}`], { cwd: root, encoding: 'utf8' });
const restored = html
  .replace(/<!-- TECHNICAL_DOCUMENTATION_START -->[\s\S]*?<!-- TECHNICAL_DOCUMENTATION_END -->/, '')
  .replace(/<!-- TECHNICAL_VIEWER_START -->[\s\S]*?<!-- TECHNICAL_VIEWER_END -->/, '')
  .replace('    <link rel="stylesheet" href="documentation.css?v=20261105-1" />\n', '');
assert.equal(restored.replace(/\r\n/g, '\n'), baseline.replace(/\r\n/g, '\n'));
console.log('PASS: 8 featured / 15 complete; numbering, assets, source dimensions and existing page preserved.');
