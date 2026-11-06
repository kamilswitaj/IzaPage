import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Small structural reader for the static HTML contract, not a browser DOM replacement.
function readElements(html) {
  const root = { tag: '#document', attrs: {}, children: [] };
  const stack = [root];
  const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  const source = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  for (const match of source.matchAll(/<\/?[a-zA-Z](?:"[^"]*"|'[^']*'|[^'">])*>/g)) {
    const token = match[0];
    const tag = token.match(/^<\/?([\w-]+)/)[1].toLowerCase();
    if (token.startsWith('</')) {
      assert.equal(stack.at(-1).tag, tag, 'Nieprawidłowe zagnieżdżenie: ' + token);
      stack.pop();
      continue;
    }
    const attrs = {};
    for (const a of token.slice(tag.length + 1).matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
    const node = { tag, attrs, children: [], parent: stack.at(-1), source: token, start: match.index, documentSource: source };
    stack.at(-1).children.push(node);
    if (!voidTags.has(tag) && !token.endsWith('/>')) stack.push(node);
  }
  assert.equal(stack.length, 1, 'Niezamknięte elementy HTML');
  return root;
}
const hasClass = (node, name) => (node.attrs.class || '').split(/\s+/).includes(name);
const descendants = node => node.children.flatMap(child => [child, ...descendants(child)]);
const textOf = (_html, node) => node.documentSource.slice(node.start + node.source.length).split('</' + node.tag + '>')[0].replace(/<[^>]*>/g, '').trim();
const textPresent = (html, node) => textOf(html, node).length > 0;

export function validateProjectHero(html, slug, { requireNavigation = !['neomodernizm','lesny-rytm'].includes(slug) } = {}) {
  const document = readElements(html);
  const nodes = descendants(document);
  const one = (list, label) => { assert.equal(list.length, 1, slug + ': wymagany jeden ' + label); return list[0]; };
  const byClass = name => one(nodes.filter(n => hasClass(n, name)), '.' + name);
  const body = one(nodes.filter(n => n.tag === 'body'), 'body');
  assert(hasClass(body, 'case-page'), slug + ': body.case-page');
  const cover = byClass('case-cover');
  const content = byClass('case-content');
  assert.equal(cover.parent.tag, 'main', slug + ': zdjęcie bezpośrednio w main');
  assert.equal(cover.parent, content.parent, slug + ': wspólny rodzic zdjęcia i projektu');
  assert.equal(cover.parent.children.indexOf(content), cover.parent.children.indexOf(cover) + 1, slug + ': treść zaraz po zdjęciu');
  assert(hasClass(content, 'projects'), slug + ': .projects.case-content');
  const project = one(content.children.filter(n => n.tag === 'article' && hasClass(n, 'project')), 'article.project');
  const heading = byClass('project-heading');
  assert.equal(heading.tag, 'header');
  assert.equal(project.children[0], heading, slug + ': nagłówek na początku projektu');
  const number = byClass('project-number');
  const intro = byClass('project-intro');
  assert(heading.children.length === 2 && heading.children[0] === number && heading.children[1] === intro, slug + ': lewa etykieta i prawa kolumna');
  assert.equal(number.tag, 'p');
  assert(/^\d+\s*\/\s*\S/.test(textOf(html, number)), slug + ': wymagany numer i etykieta');
  const title = one(nodes.filter(n => n.tag === 'h1'), 'h1');
  const style = byClass('project-style');
  const software = byClass('project-software');
  assert(intro.children[0] === title && intro.children[1] === style && intro.children[2] === software, slug + ': kolejność tytułu, stylu i oprogramowania');
  assert.equal(style.tag, 'p');
  assert.equal(software.tag, 'p');
  for (const node of [title, style, software]) assert(textPresent(html, node), slug + ': puste dane nagłówka');
  assert(/^Styl:\s*\S/.test(textOf(html, style)), slug + ': wartość stylu');
  assert(/^Oprogramowanie:\s*\S/.test(textOf(html, software)), slug + ': wartość oprogramowania');
  assert.equal(project.attrs['aria-labelledby'], title.attrs.id, slug + ': powiązanie tytułu');
  assert(title.attrs.id, slug + ': identyfikator tytułu');
  assert.equal(title.children.length, 0, slug + ': tytuł zawija się naturalnie, bez br/span');
  assert(hasClass(project.children[1], 'project-story'), slug + ': narracja po nagłówku');
  const tags = nodes.filter(n => hasClass(n, 'project-tags'));
  assert(tags.length <= 1);
  if (slug !== 'lesny-rytm') assert.equal(tags.length, 1, slug + ': metadane .project-tags');
  if (tags.length) {
    assert.equal(tags[0].parent, intro);
    assert.equal(tags[0].tag, 'ul');
    assert(tags[0].children.length && tags[0].children.every(n => n.tag === 'li' && textPresent(html, n)));
  }
  const navigation = nodes.filter(n => hasClass(n, 'project-index'));
  assert(navigation.length <= 1);
  if (requireNavigation) assert.equal(navigation.length, 1, slug + ': nawigacja .project-index');
  if (navigation.length) {
    const nav = navigation[0];
    assert.equal(nav.tag, 'nav');
    assert(nav.attrs['aria-label'], slug + ': etykieta nawigacji');
    assert.equal(nav.parent, intro, slug + ': nawigacja w prawej kolumnie');
    assert.equal(intro.children.at(-1), nav, slug + ': nawigacja pod metadanymi');
    assert(nav.children.length > 0);
    // Technical documentation can remain an independent section after the article.
    const sections = nodes.filter(n => n.tag === 'section');
    for (const link of nav.children) {
      assert.equal(link.tag, 'a');
      assert(textPresent(html, link));
      assert(/^#[\w-]+$/.test(link.attrs.href), slug + ': lokalna kotwica nawigacji');
      assert(sections.some(n => n.attrs.id === link.attrs.href.slice(1)), slug + ': istniejąca sekcja docelowa nawigacji');
    }
  }
  const image = one(cover.children, 'obraz otwierający');
  assert.equal(image.tag, 'img');
  assert(/^\.\.\/\.\.\/assets\//.test(image.attrs.src), slug + ': lokalny obraz');
  assert(image.attrs.alt?.trim(), slug + ': opis obrazu');
  for (const attr of ['width','height']) assert(/^[1-9]\d*$/.test(image.attrs[attr]), slug + ': wymiar obrazu ' + attr);
  assert.equal(image.attrs.fetchpriority, 'high');
  assert.notEqual(image.attrs.loading, 'lazy');
  const sheets = nodes.filter(n => n.tag === 'link' && n.attrs.rel === 'stylesheet');
  const localSheets = sheets.filter(n => !/^https?:/.test(n.attrs.href));
  for (const name of ['portfolio.css','project-heading.css']) one(localSheets.filter(n => n.attrs.href.split('?')[0] === '../' + name), name);
  assert.equal(localSheets.at(-1).attrs.href.split('?')[0], '../project-heading.css', slug + ': wspólny arkusz jako ostatni lokalny CSS');
  for (const node of [cover, image, heading, number, intro, ...descendants(intro)]) assert(!('style' in node.attrs), slug + ': bez stylów inline w hero');
  assert(!/\{\{\w+\}\}/.test(html), slug + ': niewypełnione pola szablonu');
  const ids = nodes.map(n => n.attrs.id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, slug + ': powtórzone identyfikatory');
  for (const block of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) checkLocalHeroOverrides(block[1], slug + ': style');
}

export function projectFiles(root) {
  const visit = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? visit(file) : entry.name === 'index.html' ? [file] : [];
  });
  return visit(path.join(root, 'portfolio')).filter(file => path.dirname(file) !== path.join(root, 'portfolio')).sort();
}

function checkLocalHeroOverrides(css, file) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert(!/--project-(?:inset|gap)\s*:/.test(source), file + ': nie nadpisuj zmiennych hero');
  const heroClass = /\.(?:case-cover|project-heading|project-intro|project-number|project-style|project-software|project-tags|project-index)\b/;
  const layoutProperty = /(?:^|;)\s*(?:display|position|width|max-width|min-width|height|aspect-ratio|grid[\w-]*|gap|margin[\w-]*|padding[\w-]*|font[\w-]*|line-height|white-space)\s*:/;
  for (const rule of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (heroClass.test(rule[1]) || /\bh1\b/.test(rule[1])) assert(!layoutProperty.test(rule[2]), file + ': lokalne nadpisanie układu lub typografii hero');
  }
}

export function checkProjectTemplates(root) {
  const files = projectFiles(root);
  assert(files.length > 0, 'Brak podstron projektów');
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    validateProjectHero(html, path.basename(path.dirname(file)));
    for (const match of html.matchAll(/<link\b[^>]*href="([^"?#]+\.css)(?:\?[^"#]*)?"[^>]*>/g)) {
      if (!/^https?:/.test(match[1])) {
        const css = path.resolve(path.dirname(file), match[1]);
        assert(fs.existsSync(css), file + ': brak CSS ' + match[1]);
        if (!['portfolio.css','project-heading.css'].some(name => css === path.join(root, 'portfolio', name))) checkLocalHeroOverrides(fs.readFileSync(css, 'utf8'), css);
      }
    }
  }
  console.log('PASS: wspólny szablon hero — ' + files.length + ' projektów (wykrywanych automatycznie)');
  return files;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) checkProjectTemplates(path.resolve(import.meta.dirname, '..'));
