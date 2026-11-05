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
assert.ok(html.includes('Wybrane arkusze dokumentacji pokazują przełożenie koncepcji na rozwiązania techniczne — od zmian budowlanych i układu funkcjonalnego, przez oświetlenie, po szczegóły zabudów meblowych.'));
assert.ok(!html.includes('technical-project-status'));
assert.ok(html.includes('<h2 id="technical-title">Od układu do detalu</h2>'));
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
const baseline = execFileSync(git, ['show', '4f92d3e:'+pagePath], { cwd: root, encoding: 'utf8' });
const galleries = text => [...text.matchAll(/<button[^>]*data-lightbox-src[^>]*>[\s\S]*?<\/button>/g)].map(m => m[0].replace(/\r\n/g, '\n'));
assert.deepEqual(galleries(html), galleries(baseline));
const compactCards = [...html.matchAll(/<div class="technical-card-copy">([\s\S]*?)<\/div>/g)];
assert.equal(compactCards.length, 23);
for (const [, body] of compactCards) {
  assert.equal((body.match(/<p/g) || []).length, 1);
  assert.ok(!body.includes('<a'));
  assert.match(body, /Rys\. [\d.]+ <span aria-hidden="true">·<\/span> 1:(25|50)/);
}
const titles = text => [...text.matchAll(/<div class="technical-card-copy">[\s\S]*?(<h[34]>[\s\S]*?<\/h[34]>)/g)].map(m => m[1]);
assert.deepEqual(titles(html), titles(baseline));
assert.ok(html.includes('id="technical-full-image"'));
for (const s of sheets) {
  const old = execFileSync(git, ['show', '3163902:assets/documentation/neomodernizm/details/arkusz-'+s.page+'.png'], { cwd: root, maxBuffer: 5*1024*1024 });
  assert.deepEqual(readFileSync(resolve(root, 'portfolio/neomodernizm', s.detail)), old);
}
if (process.argv[2]) {
  const base = new URL('portfolio/neomodernizm/', process.argv[2]);
  await Promise.all(sheets.flatMap(s => [s.thumbnail, s.detail]).map(async path => {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').startsWith('image/'), path);
    await response.arrayBuffer();
  }));
  console.log('HTTP 200: all 30 technical images, including full-resolution viewer URLs.');
}
console.log('PASS: 8 featured / 15 complete; numbering, assets, source dimensions and existing galleries preserved.');
