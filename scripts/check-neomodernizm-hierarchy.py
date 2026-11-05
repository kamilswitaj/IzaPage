"""Check restored source prose, heading outline and preserved room content."""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
git = r'C:\Program Files\Git\cmd\git.exe'
page = 'portfolio/neomodernizm/index.html'
html = (root / page).read_text(encoding='utf-8')
def historical(ref):
    return subprocess.check_output([git, 'show', f'{ref}:{page}'], cwd=root).decode('utf-8').replace('\r\n', '\n')

original = historical('5536e6d')
reading = r'<div class="reading-copy">([\s\S]*?)</div>'
assert re.search(reading, html)[1] == re.search(reading, original)[1]
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
assert outline.headings[:14] == [
    (1, 'Przytulny neomodernizm dla rodziny'), (2, 'Funkcja prowadzi projekt'),
    (2, 'Przestrzeń dopasowana do życia rodziny'), (2, 'Prezentacja pomieszczeń'),
    (3, 'Hol i strefa wejściowa'), (3, 'Strefa dzienna'), (4, 'Kuchnia'),
    (4, 'Jadalnia'), (4, 'Salon'), (3, 'Pokój dziewczynek'),
    (3, 'Sypialnia rodziców'), (3, 'Strefa sanitarna'),
    (4, 'Łazienka'), (4, 'Dodatkowe WC')]
for label in ['01 / Założenia projektowe', '02 / Układ funkcjonalny', '03 / Pomieszczenia', '04 / Dokumentacja techniczna']:
    assert html.count(f'<p class="eyebrow">{label}</p>') == 1
header = r'<header class="project-heading">[\s\S]*?</header>'
assert re.search(header, html)[0] == re.search(header, historical('fcd4f2b'))[0]
baseline = historical('4f92d3e')
rooms = lambda text: text.split('<section class="room-section" id="hol"')[1].split('</article>')[0]
paragraphs = lambda text: re.findall(r'<p(?: class="(?!eyebrow)[^"]*")?>([\s\S]*?)</p>', text)
assert paragraphs(rooms(html)) == paragraphs(rooms(baseline))
assert html.count('Moodboard / Mineralny neomodernizm') == 1
print('PASS: original 9 paragraphs, exact PR #7 header, H1-H4 outline, room descriptions and chapter labels.')
