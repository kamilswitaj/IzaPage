import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';
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
// Lesny Rytm intentionally reuses AI views in labelled before/after pairs and
// opens the plan as its full-resolution source sheet. Keep an explicit inventory
// instead of treating these approved additions as missing historical positions.
const organicGallery = [
  'arkusz-2.png', 'organic-rtv-closed.webp', 'organic-home-office.webp',
  'arkusz-14.png', 'organic-sofa.webp', 'organic-kitchen.webp', 'organic-rtv-open.webp',
  'organic-original-kitchen.webp', 'organic-kitchen.webp',
  'organic-original-office.webp', 'organic-rtv-open.webp',
  'organic-original-sofa.webp', 'organic-sofa.webp'
];
const historicalOrganic = galleryNames(original).filter(name => name.startsWith('organic-'));
for (const name of historicalOrganic) {
  assert(fs.existsSync(path.join(root, 'assets/gallery', name)), 'Retain organic source file: ' + name);
}
const organic = fs.readFileSync(path.join(root, 'portfolio/lesny-rytm/index.html'), 'utf8');
assert.deepEqual([...organic.matchAll(/data-lightbox-src="([^"]+)"/g)].map(m => path.basename(m[1])), organicGallery, 'Approved organic gallery order and repetitions');
for (const name of historicalOrganic) assert(organic.includes('/' + name + '"'), 'Display existing organic source: ' + name);
const expected = [
  ...galleryNames(original).filter(name => !name.startsWith('organic-')),
  'dyplom3D-lazienka i wc p_druk.jpg', ...organicGallery
].filter(name => !omittedNeoViews.includes(name)).sort();
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
    if (/\bsrc=/.test(m[0]) && !(file === 'portfolio/index.html' && /class="cv-logo"/.test(m[0]))) assert(/\balt="[^"]+"/.test(m[0]),file + ': empty content alt');
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

// The studio homepage and recruitment portfolio have distinct contracts.
function checkRecruitmentPortfolio() {
  const home = fs.readFileSync(path.join(root, 'portfolio/index.html'), 'utf8');
  assert.equal((home.match(/<h1\b/g) || []).length, 1, 'Recruitment portfolio: one h1');
  assert(home.includes('rel="canonical" href="https://izabelaswitaj.pl/portfolio/"'), 'Recruitment portfolio: canonical');
  assert(home.includes('property="og:url" content="https://izabelaswitaj.pl/portfolio/"'), 'Recruitment portfolio: Open Graph URL');
  assert(/<meta\s+name="description"\s+content="Portfolio projektowe[^"]+"/.test(home), 'Recruitment portfolio: recruitment description');
  assert(home.includes('property="og:title" content="Izabela Świtaj — portfolio projektowe"'), 'Recruitment portfolio: Open Graph title');
  assert(!/http-equiv="refresh"|location\.(?:href|replace|assign)/i.test(home), 'Recruitment portfolio: no redirect');
  assert(home.includes('href="../"'), 'Recruitment portfolio: studio navigation');
  const ids = [...home.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, 'Recruitment portfolio: unique IDs');
  const cards = [...home.matchAll(/<a\b[^>]*class="cv-project"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(cards.length, 3, 'Recruitment portfolio: three project cards');
  const destinations = ['neomodernizm/', 'japandi/', 'lesny-rytm/'];
  cards.forEach((card, i) => {
    assert.equal(card[0].match(/\bhref="([^"]+)"/)?.[1], destinations[i], 'Recruitment portfolio: project destination');
    assert(/<h2\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h2>/.test(card[1]), 'Recruitment portfolio: project title');
    assert(/<p\b[^>]*>[^<]+<\/p>/.test(card[1]), 'Recruitment portfolio: project type');
    assert.equal((card[1].match(/<img\b/g) || []).length, 1, 'Recruitment portfolio: one preview per project');
    assert(/<img\b[^>]*alt="[^"]+"/.test(card[1]), 'Recruitment portfolio: descriptive preview alt');
  });
  const about = home.match(/<section\b[^>]*class="cv-about cv-container"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert(about, 'Recruitment portfolio: dedicated about section');
  assert(/<p class="eyebrow">O MNIE<\/p>/.test(about), 'Recruitment portfolio: about label');
  assert(/<h2 id="about-title">Od funkcji do atmosfery wnętrza<\/h2>/.test(about), 'Recruitment portfolio: about heading');
  const aboutCopy = about.match(/<div class="cv-about-copy">([\s\S]*?)<\/div>/)?.[1] || '';
  assert.equal((aboutCopy.match(/<p>/g) || []).length, 3, 'Recruitment portfolio: three about paragraphs');
  for (const phrase of ['wykształceniem inżynierskim', 'układom funkcjonalnym', 'pCon.planner', 'AutoCAD', 'SketchUp', 'V-Ray']) {
    assert(aboutCopy.includes(phrase), 'Recruitment portfolio: about content ' + phrase);
  }
  const footer = home.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] || '';
  assert(footer.includes('href="mailto:izabela.switaj@gmail.com"'), 'Recruitment portfolio: email');
  assert(footer.includes('href="tel:+48502272469"'), 'Recruitment portfolio: phone');
  assert(footer.includes('Warszawa'), 'Recruitment portfolio: location');
  assert(!/wykształceni|pCon|AutoCAD|SketchUp|V-Ray/.test(footer), 'Recruitment portfolio: no repeated biography in footer');
  assert(!/cal\.eu|id="oferta"|class="hero"|<form\b/.test(home), 'Recruitment portfolio: recruitment portfolio');
  assert(/<header\b[\s\S]*?<img class="cv-logo" src="\.\.\/assets\/is-sygnet\.png" alt="" width="630" height="725"/.test(home), 'Recruitment portfolio: decorative original monogram in header');
  assert(/<link rel="icon" href="\.\.\/assets\/is-favicon\.png" type="image\/png" sizes="64x64"/.test(home), 'Recruitment portfolio: PNG favicon');
  for (const match of home.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:)/.test(url)) continue;
    const [resource, fragment] = url.split('#');
    let target = path.join(root, 'portfolio', resource.split('?')[0] || 'index.html');
    assert(fs.existsSync(target), 'Recruitment portfolio: existing resource ' + url);
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert(fs.existsSync(target), 'Recruitment portfolio: existing destination ' + url);
    if (fragment) assert(fs.readFileSync(target, 'utf8').includes('id="' + fragment + '"'), 'Recruitment portfolio: anchor ' + url);
    httpPaths.add(path.relative(root, target).split(path.sep).join('/'));
    links++;
  }
  for (const match of home.matchAll(/srcset="([^"]+)"/g)) for (const entry of match[1].split(',')) {
    const resource = entry.trim().split(/\s+/)[0];
    assert(fs.existsSync(path.join(root, 'portfolio', resource)), 'Recruitment portfolio: existing srcset ' + resource);
    httpPaths.add(path.relative(root, path.join(root, 'portfolio', resource)).split(path.sep).join('/'));
  }
  for (const match of home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
  httpPaths.add('portfolio/index.html');
  checkTransparentPng('assets/is-sygnet.png', 630, 725);
  checkTransparentPng('assets/is-favicon.png', 64, 64);
}

// Decode PNG scanlines with Node's built-in zlib: an alpha-capable header alone
// does not prove the image actually contains transparent background pixels.
function checkTransparentPng(file, width, height) {
  const png = fs.readFileSync(path.join(root, file));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file + ': PNG signature');
  const chunks = [];
  let header;
  for (let offset = 8; offset < png.length;) {
    const size = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    assert(offset + size + 12 <= png.length, file + ': complete chunk');
    const data = png.subarray(offset + 8, offset + 8 + size);
    if (type === 'IHDR') header = data;
    if (type === 'IDAT') chunks.push(data);
    offset += size + 12;
  }
  assert(header, file + ': IHDR');
  assert.equal(header.readUInt32BE(0), width, file + ': original width');
  assert.equal(header.readUInt32BE(4), height, file + ': original height');
  assert.equal(header[8], 8, file + ': 8-bit channels');
  assert.equal(header[9], 6, file + ': RGBA');
  assert.equal(header[10], 0, file + ': standard compression');
  assert.equal(header[11], 0, file + ': standard filters');
  assert.equal(header[12], 0, file + ': noninterlaced');
  const stride = width * 4;
  const raw = inflateSync(Buffer.concat(chunks));
  assert.equal(raw.length, (stride + 1) * height, file + ': complete pixel data');
  let previous = Buffer.alloc(stride), transparent = 0, opaque = 0, smooth = 0;
  const corners = [];
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    assert(filter <= 4, file + ': valid scanline filter');
    const row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const left = x >= 4 ? row[x - 4] : 0, up = previous[x], upperLeft = x >= 4 ? previous[x - 4] : 0;
      const p = left + up - upperLeft;
      const paeth = Math.abs(p - left) <= Math.abs(p - up) && Math.abs(p - left) <= Math.abs(p - upperLeft) ? left : Math.abs(p - up) <= Math.abs(p - upperLeft) ? up : upperLeft;
      const predictor = [0, left, up, Math.floor((left + up) / 2), paeth][filter];
      row[x] = (raw[y * (stride + 1) + 1 + x] + predictor) & 255;
    }
    for (let x = 0; x < width; x++) {
      const alpha = row[x * 4 + 3];
      if (alpha === 0) transparent++;
      else if (alpha === 255) opaque++;
      else smooth++;
      if ((y === 0 || y === height - 1) && (x === 0 || x === width - 1)) corners.push(alpha);
    }
    previous = row;
  }
  assert(transparent > width * height / 2, file + ': genuinely transparent background');
  assert(opaque > 0, file + ': visible solid mark');
  assert(smooth > 0, file + ': antialiased edges');
  assert.deepEqual(corners, [0, 0, 0, 0], file + ': transparent corners');
}

checkRecruitmentPortfolio();
const studio = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const approvedStudio = execFileSync(git, ['show', 'c4bad4a:index.html'], {cwd: root, encoding: 'utf8'});
const body = text => text.slice(text.indexOf('<body>')).replace(/\r\n/g, '\n');
assert.equal(body(studio).replace('        <a href="/portfolio/">Portfolio</a>\n', ''), body(approvedStudio), 'Studio: restore full historical content and behavior, with portfolio navigation');
assert(studio.includes('rel="canonical" href="https://izabelaswitaj.pl/"'), 'Studio: canonical');
assert(studio.includes('property="og:url" content="https://izabelaswitaj.pl/"'), 'Studio: Open Graph URL');
assert(/<meta\s+name="description"\s+content="Projektowanie wnętrz i konsultacje[^"]+"/.test(studio), 'Studio: service description');
assert(studio.includes('property="og:title" content="Iza Świtaj — projektowanie wnętrz i konsultacje"'), 'Studio: Open Graph title');
assert(studio.includes('href="/portfolio/"'), 'Studio: portfolio navigation');
assert(studio.includes('https://cal.eu/izabela-switaj/30min'), 'Studio: consultation booking');
// Validate all restored page resources and in-page navigation, including galleries.
for (const match of studio.matchAll(/(?:src|href|data-lightbox-src)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
  const [resource, fragment] = url.split('#');
  let target = path.join(root, resource.split('?')[0] || 'index.html');
  assert(fs.existsSync(target), 'Studio: existing resource ' + url);
  if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  assert(fs.existsSync(target), 'Studio: existing destination ' + url);
  if (fragment) assert(fs.readFileSync(target, 'utf8').includes('id="' + fragment + '"'), 'Studio: anchor ' + url);
  httpPaths.add(path.relative(root, target).split(path.sep).join('/'));
  links++;
}
httpPaths.add('index.html');
for (const file of ['styles.css','script.js']) {
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
console.log(JSON.stringify({pages:files.length + 1,localReferences:links,galleryPositions:actual.length,homepage:'historical studio restored',recruitmentPortfolio:'verified at /portfolio/',result:'PASS'},null,2));
