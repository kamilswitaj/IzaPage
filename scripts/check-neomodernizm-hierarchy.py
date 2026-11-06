"""Check restored source prose, heading outline and preserved room content."""
from html.parser import HTMLParser
from pathlib import Path
import re
import hashlib
import subprocess

root = Path(__file__).resolve().parents[1]
git = r'C:\Program Files\Git\cmd\git.exe'
page = 'portfolio/neomodernizm/index.html'
def normalize_typography(text):
    return re.sub(r'<span class="no-break">([^<]*)</span>', r'\1', text).replace(' ', ' ').replace('V‑Ray', 'V-Ray')

html = normalize_typography((root / page).read_text(encoding='utf-8'))
def historical(ref):
    return subprocess.check_output([git, 'show', f'{ref}:{page}'], cwd=root).decode('utf-8').replace('\r\n', '\n')

original = historical('5536e6d')
reading = r'<div class="reading-copy">([\s\S]*?)</div>'
assert re.sub(r'\s+', ' ', re.search(reading, html)[1]) == re.sub(r'\s+', ' ', re.search(reading, original)[1])
assert len(re.findall(r'<p>', re.search(reading, html)[1])) == 9
assert re.search(r'</figure><div class="apartment-walk"', html)
assert '<details class="original-description"><summary>Przeczytaj pełny opis projektu</summary>' in html
assert not re.search(r'<details class="original-description"[^>]*\bopen\b', html)

class Outline(HTMLParser):
    def __init__(self):
        super().__init__(); self.headings = []; self.level = None; self.text = ''
    def handle_starttag(self, tag, attrs):
        if re.fullmatch('h[1-4]', tag): self.level = int(tag[1]); self.text = ''
    def handle_data(self, text):
        if self.level: self.text += text
    def handle_endtag(self, tag):
        if self.level and tag == f'h{self.level}':
            self.headings.append((self.level, self.text)); self.level = None

outline = Outline(); outline.feed(html)
class Nesting(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack = []
    def handle_starttag(self, tag, attrs):
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            return
        assert self.stack and self.stack[-1] == tag, f'Invalid closing tag {tag}: {self.stack[-4:]}'
        self.stack.pop()
nesting = Nesting(); nesting.feed(html); assert not nesting.stack
assert sum(level == 1 for level, _ in outline.headings) == 1
previous = 0
for level, title in outline.headings:
    assert level <= previous + 1, f'Skipped heading level: {title}'
    previous = level
assert outline.headings[:15] == [
    (1, 'Przytulny neomodernizm dla rodziny'), (2, 'Funkcja prowadzi projekt'),
    (2, 'Przestrzeń dopasowana do życia rodziny'), (2, 'Prezentacja pomieszczeń'),
    (3, 'Hol i strefa wejściowa'), (3, 'Strefa dzienna'), (4, 'Kuchnia'),
    (4, 'Jadalnia'), (4, 'Salon'), (4, 'Wizualizacje strefy dziennej'), (3, 'Pokój dziewczynek'),
    (3, 'Sypialnia rodziców'), (3, 'Strefa sanitarna'),
    (4, 'Łazienka'), (4, 'Dodatkowe WC')]
for label in ['01 / Założenia projektowe', '02 / Układ funkcjonalny', '03 / Pomieszczenia', '04 / Dokumentacja techniczna']:
    assert html.count(f'<p class="eyebrow">{label}</p>') == 1
header = r'<header class="project-heading">[\s\S]*?</header>'
assert '<p class="project-number">I</p>' in re.search(header, html)[0]
assert 'class="project-index"' in re.search(header, html)[0]
baseline = historical('4e1ee37e1b653d5f74e3f8a91fb6a19b85a26bfa')
rooms = lambda text: text.split('<section class="room-section" id="hol"')[1].split('</article>')[0]
paragraphs = lambda text: re.findall(r'<p(?: class="(?!eyebrow)[^"]*")?>([\s\S]*?)</p>', text)
# Final copy approved by the owner; verify exact paragraphs in the correct headers.
class RoomDescriptions(HTMLParser):
    def __init__(self):
        super().__init__(); self.in_header = False; self.in_paragraph = False
        self.current_id = None; self.current_text = ''; self.descriptions = {}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'header' and attrs.get('class') in {'room-heading', 'room-chapter-heading'}:
            self.in_header = True; self.current_id = None
        if self.in_header and tag in {'h2', 'h3', 'h4'}:
            self.current_id = attrs.get('id'); self.descriptions[self.current_id] = []
        if self.in_header and self.current_id and tag == 'p' and attrs.get('class') != 'eyebrow':
            self.in_paragraph = True; self.current_text = ''
    def handle_data(self, text):
        if self.in_paragraph: self.current_text += text
    def handle_endtag(self, tag):
        if tag == 'p' and self.in_paragraph:
            self.descriptions[self.current_id].append(self.current_text)
            self.in_paragraph = False
        if tag == 'header': self.in_header = False

current_copy = RoomDescriptions(); current_copy.feed(html)
original_copy = RoomDescriptions(); original_copy.feed(baseline)
assert current_copy.descriptions['hol-title'] == original_copy.descriptions['hol-title']
accepted_copy_hashes = {
    "strefa-dzienna-title": "c73c5f7c82ddccd5a015543c9dec028674e9eab51ede470b984bcbd7e59012ee",
    "kuchnia-title": "f99925ee7a110958b0261ee41c57835bafd343803e6e64ebdd1284797c84773d",
    "jadalnia-title": "e5db7a1862ad209e3251f75b2c8f5e46d9b098f5a0d16e47891bd274dad26cf7",
    "salon-title": "d4b190c7ac63173504cbac2216eee01d7bc2d0563d9e3b06b1f897670484c78b",
    "pokoj-dzieci-title": "83e65f36ef6137ca1e22b628818dd1e730fa978a3e1155025bba98041a515787",
    "sypialnia-rodzicow-title": "4b2e34d4acb518889c4a8183c8eb3b26c1d6e87c2cb7d93b230177d6b2850d90",
    "lazienka-title": "ca28ffd08871d0b9acc8f0a25cb5875232f19eed4918a1e3b0b3e56de7fc7b47",
    "lazienka-podpunkt-title": "d72de374acf7bd7b35cc57d15b36bdae181f72ac78e398625f5a336f3e1f68ad",
    "dodatkowe-wc-title": "736051a510e5adabce03fc6532678cd75f96d1b20379e15956d19051936200c7"
}
for heading_id, expected_hash in accepted_copy_hashes.items():
    text = '\n\n'.join(current_copy.descriptions[heading_id])
    assert hashlib.sha256(text.encode('utf-8')).hexdigest() == expected_hash, heading_id
assert html.count('Moodboard / Mineralny neomodernizm') == 1
print('PASS: original 9 paragraphs, shared Roman-number heading, H1-H4 outline, 9 approved room descriptions and chapter labels.')
