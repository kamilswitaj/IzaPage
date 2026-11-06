import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateProjectHero } from './check-project-template.mjs';

export const root = path.resolve(import.meta.dirname, '..');
const template = path.join(root, 'templates/portfolio-project/index.html');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const required = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Wymagane pole: ' + name);
  return value.trim();
};

// Pure rendering also supports checking a future project without creating a page.
export function renderProject(data) {
  const values = {};
  for (const name of ['slug','title','description','number','label','style','software']) values[name] = required(data[name], name);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) throw new Error('slug: użyj małych liter ASCII, cyfr i myślników');
  const image = data.image || {};
  values.imagePath = required(image.path, 'image.path');
  if (!/^assets\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g)$/i.test(values.imagePath) || values.imagePath.split('/').includes('..')) throw new Error('image.path: lokalny plik w assets/');
  values.imageAlt = required(image.alt, 'image.alt');
  for (const dimension of ['width','height']) {
    if (!Number.isInteger(image[dimension]) || image[dimension] <= 0) throw new Error('image.' + dimension + ': dodatnia liczba całkowita');
    values['image' + dimension[0].toUpperCase() + dimension.slice(1)] = image[dimension];
  }
  if (!Array.isArray(data.tags) || !data.tags.length) throw new Error('tags: podaj metadane projektu');
  if (!Array.isArray(data.sections) || !data.sections.length) throw new Error('sections: podaj co najmniej jedną sekcję');
  const ids = new Set(['projekt-' + values.slug, 'project-' + values.slug + '-title', 'kontakt', 'contact-title']);
  const sections = data.sections.map(section => {
    const id = required(section.id, 'sections.id');
    const title = required(section.title, 'sections.title');
    if (!/^[a-z][a-z0-9-]*$/.test(id) || ids.has(id)) throw new Error('Nieprawidłowy lub powtórzony identyfikator sekcji: ' + id);
    ids.add(id);
    return { id, title };
  });
  const html = {
    tagsHtml: data.tags.map(tag => '<li>' + escape(required(tag, 'tags')) + '</li>').join(''),
    navigationHtml: sections.map(s => '<a href="#' + s.id + '">' + escape(s.title) + '</a>').join(''),
    sectionsHtml: sections.map(s => '<section id="' + s.id + '"><h2>' + escape(s.title) + '</h2><!-- Dodaj zaakceptowane treści i media. --></section>').join('\n            '),
  };
  const rendered = fs.readFileSync(template, 'utf8').replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key in html) return html[key];
    if (!(key in values)) throw new Error('Nieznane pole szablonu: ' + key);
    return escape(values[key]);
  });
  validateProjectHero(rendered, values.slug, { requireNavigation: true });
  return rendered;
}

export function createProject(data, { check = false, repositoryRoot = root } = {}) {
  const html = renderProject(data);
  if (!fs.existsSync(path.join(repositoryRoot, data.image.path))) throw new Error('Brak obrazu: ' + data.image.path);
  const target = path.join(repositoryRoot, 'portfolio', data.slug.trim());
  if (fs.existsSync(target)) throw new Error('Projekt już istnieje: ' + target);
  if (!check) {
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'index.html'), html, { flag: 'wx' });
  }
  return target;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const check = args.includes('--check');
    const files = args.filter(arg => arg !== '--check');
    if (files.length !== 1 || files[0].startsWith('-')) throw new Error('Użycie: node scripts/create-project.mjs dane.json [--check]');
    const target = createProject(JSON.parse(fs.readFileSync(files[0], 'utf8')), { check });
    console.log((check ? 'PASS: bez zapisu — ' : 'Utworzono: ') + target);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
