import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const files = ['portfolio/index.html', ...['neomodernizm','japandi','lesny-rytm'].map(s => 'portfolio/' + s + '/index.html')];
const git = process.env.GIT_BINARY || (process.platform === 'win32' && fs.existsSync('C:/Program Files/Git/cmd/git.exe') ? 'C:/Program Files/Git/cmd/git.exe' : 'git');
const original = execFileSync(git, ['show','92bb54a240b1eb52a3b7f3c4ff8c1b499b034142:portfolio/index.html'], {cwd: root, encoding:'utf8'});
const galleryNames = text => [...text.matchAll(/data-lightbox-src="([^"]+)"/g)].map(m=>path.basename(m[1])).sort();
// Preserve the source gallery except the four owner-approved redundant living-zone views.
const omittedNeoViews = [
  'diploma-kitchen-second-view.webp', 'diploma-kitchen-dining-1.webp',
  'diploma-dining-overview.webp', 'diploma-living-tv.webp'
];
for (const name of omittedNeoViews) assert(fs.existsSync(path.join(root, 'assets/gallery', name)), 'Retain omitted source file: ' + name);
const expected = [...galleryNames(original), 'dyplom3D-lazienka i wc p_druk.jpg'].filter(name => !omittedNeoViews.includes(name)).sort();
const actual = [];
const httpPaths = new Set();
let links = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root,file),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,file + ': one h1');
  assert(!html.includes('src=""'),file + ': empty src');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,file + ': duplicate IDs');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\balt="[^"]*"/.test(m[0]),file + ': missing alt');
    if (/\bsrc=/.test(m[0])) assert(/\balt="[^"]+"/.test(m[0]),file + ': empty content alt');
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  for (const m of html.matchAll(/(?:src|href|data-lightbox-src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(m[1])) continue;
    const [resource,fragment] = m[1].split('#');
    let target = path.resolve(root,path.dirname(file),resource.split('?')[0] || path.basename(file));
    if (!resource) target=path.join(root,file);
    assert(fs.existsSync(target),file + ': missing ' + m[1]);
    if(fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
    if(fragment && path.extname(target) === '.html') assert(fs.readFileSync(target,'utf8').includes('id="'+fragment+'"'),file + ': missing fragment ' + m[1]);
    httpPaths.add(path.relative(root,target).split(path.sep).join('/'));
    links++;
  }
  for(const m of html.matchAll(/srcset="([^"]+)"/g)) for(const entry of m[1].split(',')) {
    const target = path.resolve(root,path.dirname(file),entry.trim().split(' ')[0]);
    assert(fs.existsSync(target),file + ': missing srcset');
    httpPaths.add(path.relative(root,target).split(path.sep).join('/'));
  }
  httpPaths.add(file);
  actual.push(...galleryNames(html));
}
assert.deepEqual(actual.sort(),expected,'Retain the curated gallery and the supplied WC render');
const neo = fs.readFileSync(path.join(root, 'portfolio/neomodernizm/index.html'), 'utf8');
const livingGallery = neo.match(/<section class="room-chapter room-visualizations"[\s\S]*?<\/section>/)?.[0];
assert(livingGallery, 'One shared living-zone gallery');
assert.deepEqual([...livingGallery.matchAll(/data-lightbox-src="[^"]+\/([^/"]+)"/g)].map(m => m[1]), [
  'diploma-living-wide.webp', 'diploma-kitchen-counter.webp',
  'diploma-kitchen-dining-2.webp', 'diploma-living-room.webp'
], 'Living-zone narrative order');
assert.equal((neo.match(/class="room-concept"/g) || []).length, 6, 'Six separate concept blocks');
assert.equal(new Set(galleryNames(neo)).size, galleryNames(neo).length, 'No duplicate lightbox images');
assert.equal((fs.readFileSync(path.join(root,files[0]),'utf8').match(/class="overview-card"/g)||[]).length,3);
for (const file of ['index.html','styles.css','script.js']) {
  const baseline = execFileSync(git,['show','38b00bdb80113d5b5d2e893fc2377df2871e2171:'+file],{cwd:root});
  const normalize = value => value.toString().replace(/\r\n/g,'\n');
  assert.equal(normalize(fs.readFileSync(path.join(root,file))),normalize(baseline),file + ': homepage regression');
}
if (process.argv[2]) {
  const base = process.argv[2];
  const responses = await Promise.all([...httpPaths].map(async file => {
    const response = await fetch(new URL(file, base));
    assert.equal(response.status, 200, 'HTTP: ' + file);
    await response.arrayBuffer();
    return file;
  }));
  console.log('HTTP 200: ' + responses.length + ' unique page/resource URLs');
}
console.log(JSON.stringify({pages:files.length,localReferences:links,galleryPositions:actual.length,homepage:'unchanged',result:'PASS'},null,2));
