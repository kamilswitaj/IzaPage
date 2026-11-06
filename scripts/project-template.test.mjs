import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { renderProject, createProject, root } from './create-project.mjs';
import { validateProjectHero, checkProjectTemplates } from './check-project-template.mjs';

const data = {
  slug: 'projekt-testowy', title: 'Projekt testowy', description: 'Opis projektu.',
  number: '04', label: 'Projekt wnętrza', style: 'Styl projektu', software: 'Narzędzie projektu',
  image: { path: 'assets/test.webp', alt: 'Opis obrazu otwierającego', width: 1600, height: 900 },
  tags: ['Dom jednorodzinny', 'Koncepcja'],
  sections: [{ id: 'zalozenia', title: 'Założenia' }, { id: 'pomieszczenia', title: 'Pomieszczenia' }],
};
const html = renderProject(data);

test('future Przytulny domek babci fits the template in memory only', () => {
  const future = { ...data, slug: 'przytulny-domek-babci', title: 'Przytulny domek babci' };
  validateProjectHero(renderProject(future), future.slug);
  assert(!fs.existsSync(path.join(root, 'portfolio', future.slug)));
});

test('escape supplied text and keep Polish characters', () => {
  const rendered = renderProject({ ...data, title: 'Ciepło & drewno <dom> "Izy"' });
  assert(rendered.includes('Ciepło &amp; drewno &lt;dom&gt; &quot;Izy&quot;'));
});

for (const [label, invalid] of [
  ['path traversal', { ...data, slug: '../projekt' }],
  ['image traversal', { ...data, image: { ...data.image, path: 'assets/../test.webp' } }],
  ['missing dimensions', { ...data, image: { ...data.image, width: 0 } }],
  ['empty metadata', { ...data, tags: [] }],
  ['missing navigation', { ...data, sections: [] }],
  ['duplicate section IDs', { ...data, sections: [data.sections[0], data.sections[0]] }],
  ['reserved section ID', { ...data, sections: [{ id: 'kontakt', title: 'Kontakt' }] }],
]) test('generator rejects ' + label, () => assert.throws(() => renderProject(invalid)));

for (const [label, mutate] of [
  ['missing cover', h => h.replace('class="case-cover"', 'class="custom-cover"')],
  ['missing heading class', h => h.replace('class="project-heading"', 'class="custom-heading"')],
  ['missing page class', h => h.replace('class="case-page"', 'class="custom-page"')],
  ['missing metadata', h => h.replace('class="project-software"', 'class="custom-software"')],
  ['empty style value', h => h.replace('Styl: Styl projektu', 'Styl: ')],
  ['missing project number', h => h.replace('04 / Projekt wnętrza', 'Projekt wnętrza')],
  ['wrong stylesheet path', h => h.replace('../project-heading.css', '../../project-heading.css')],
  ['missing shared stylesheet', h => h.replace(/<link[^>]+project-heading.css[^>]+>/, '')],
  ['stylesheet loaded after shared hero', h => h.replace('</head>', '<link rel="stylesheet" href="local.css"></head>')],
  ['forced title wrapping', h => h.replace('Projekt testowy</h1>', 'Projekt<br>testowy</h1>')],
  ['inline hero layout', h => h.replace('class="project-intro"', 'class="project-intro" style="width:50%"')],
  ['embedded hero override', h => h.replace('</head>', '<style>.project-heading { width: 500px; }</style></head>')],
  ['missing image dimensions', h => h.replace('width="1600"', '')],
  ['empty title', h => h.replace('Projekt testowy</h1>', '</h1>')],
  ['broken navigation target', h => h.replace('href="#zalozenia"', 'href="#nieistniejaca"')],
  ['missing navigation', h => h.replace(/<nav class="project-index"[\s\S]*?<\/nav>/, '')],
  ['navigation outside right column', h => h.replace(/(<nav class="project-index"[\s\S]*?<\/nav>)(\s*<\/div>)/, '$2$1')],
]) test('regression check rejects ' + label, () => assert.throws(() => validateProjectHero(mutate(html), data.slug)));

test('create, discover, check and refuse overwrite; dry-run writes nothing', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-template-'));
  try {
    fs.mkdirSync(path.join(temporary, 'assets'));
    fs.writeFileSync(path.join(temporary, data.image.path), 'fixture');
    const target = createProject(data, { check: true, repositoryRoot: temporary });
    assert(!fs.existsSync(target));
    for (const name of ['portfolio.css','project-heading.css']) {
      fs.mkdirSync(path.join(temporary, 'portfolio'), { recursive: true });
      fs.copyFileSync(path.join(root, 'portfolio', name), path.join(temporary, 'portfolio', name));
    }
    createProject(data, { repositoryRoot: temporary });
    assert.equal(fs.readFileSync(path.join(target, 'index.html'), 'utf8'), html);
    assert.equal(checkProjectTemplates(temporary).length, 1);
    assert.throws(() => createProject(data, { repositoryRoot: temporary }), /już istnieje/);
    const customHtml = html.replace('<link rel="stylesheet" href="../project-heading.css', '<link rel="stylesheet" href="local.css"><link rel="stylesheet" href="../project-heading.css');
    fs.writeFileSync(path.join(target, 'index.html'), customHtml);
    fs.writeFileSync(path.join(target, 'local.css'), '.project-heading { width: 800px; }');
    assert.throws(() => checkProjectTemplates(temporary), /lokalne nadpisanie/);
    fs.writeFileSync(path.join(target, 'index.html'), html);
    fs.unlinkSync(path.join(temporary, 'portfolio/project-heading.css'));
    assert.throws(() => checkProjectTemplates(temporary), /brak CSS/);
    fs.unlinkSync(path.join(temporary, data.image.path));
    assert.throws(() => createProject({ ...data, slug: 'inny-projekt' }, { repositoryRoot: temporary }), /Brak obrazu/);
  } finally {
    assert.equal(path.dirname(path.resolve(temporary)), path.resolve(os.tmpdir()));
    assert(path.basename(temporary).startsWith('portfolio-template-'));
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
