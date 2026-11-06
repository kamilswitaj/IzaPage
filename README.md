# Iza Świtaj - strona one-page

Statyczna strona HTML/CSS/JS dla projektantki wnętrz. Nie wymaga backendu ani płatnego silnika.

## Nowy projekt portfolio

Wymagany jest Node.js 22 lub nowszy. Bez instalowania pakietów i bez procesu budowania strony.
Wspólny szablon znajduje się w `templates/portfolio-project/index.html`, a układ otwarcia w `portfolio/project-heading.css`.
Reguły pracy Codexa zapisano w `AGENTS.md`.

Przygotuj `dane.json` (przykładowe dane; obraz musi już istnieć w `assets/`, a wymiary odpowiadać plikowi):

```json
{
  "slug": "nazwa-projektu",
  "title": "Tytuł projektu",
  "description": "Krótki opis projektu do wyników wyszukiwania.",
  "number": "04",
  "label": "Projekt wnętrza",
  "style": "Styl projektu",
  "software": "Oprogramowanie użyte w projekcie",
  "image": {
    "path": "assets/gallery/obraz-otwierajacy.webp",
    "alt": "Opis tego, co przedstawia obraz",
    "width": 1600,
    "height": 900
  },
  "tags": ["Dom jednorodzinny", "Koncepcja wnętrz"],
  "sections": [
    { "id": "zalozenia", "title": "Założenia projektowe" },
    { "id": "pomieszczenia", "title": "Pomieszczenia" }
  ]
}
```

```sh
node scripts/create-project.mjs dane.json --check
node scripts/create-project.mjs dane.json
```

Pierwsza komenda sprawdza dane bez zapisywania plików. Druga tworzy wyłącznie `portfolio/<slug>/index.html` i odmawia nadpisania istniejącego projektu. Generator nie dodaje karty do portfolio, linków między projektami ani wpisu w sitemapie.

Automatycznie otrzymujesz wspólny obraz otwierający, kolumny etykiety i tytułu, typografię, wyrównanie metadanych, nawigację pod metadanymi oraz układ mobilny. Nie powstaje osobny CSS hero. Obraz wyświetla się zgodnie ze wspólnym CSS (na telefonie 16:9); generator nie przetwarza pliku źródłowego. Nawigacja i puste sekcje z nagłówkami powstają z tej samej listy `sections`.

Indywidualnie przygotuj dane projektu, zaakceptowane teksty, zoptymalizowane zdjęcia, galerie, moodboardy i ewentualną dokumentację. Sekcje wygenerowane jako szkic trzeba wypełnić. Jeśli dodajesz galerię z lightboxem, zastosuj istniejący wzorzec galerii i `portfolio.js`. Dla obrazu z wariantami `srcset` zachowaj `sizes` zgodne ze wspólnym kontenerem. Nowy projekt nie wymaga dopisywania go do listy testów.

```sh
node --test scripts/project-template.test.mjs
node scripts/check-portfolio.mjs
node scripts/check-technical-documentation.mjs
```

`check-portfolio.mjs` uruchamia kontrolę wspólnego wzorca dla wszystkich wykrytych `portfolio/**/index.html`, oprócz indeksu portfolio. Kontrola sprawdza strukturę i klasy, kolejność CSS, metadane, obraz, położenie i cele nawigacji oraz brak stylów inline i wymuszonych podziałów tytułu. Nowe projekty wymagają nawigacji i tagów; zachowano tylko istniejące wyjątki Neomodernizmu i Leśnego rytmu.

Kontrole te działają w GitHub Actions (`.github/workflows/portfolio.yml`). Do porównania wizualnego po dodaniu projektu lub zmianie hero uruchom również `node scripts/check-project-headings.cjs` przy dostępnym Playwright i Chrome. Skrypt automatycznie obejmuje nowe projekty przy 1700, 1440, 768 i 390px; `PLAYWRIGHT_MODULE` pozwala wskazać istniejącą instalację, a `REVIEW_OUTPUT` katalog zrzutów. Nie są to zależności strony ani generatora.

## Pliki

- `index.html` - treść i struktura strony
- `styles.css` - layout, kolory, responsywność
- `script.js` - mobilne menu, rok w stopce, stan nagłówka
- `assets/gallery/*.webp` - wybrane i zoptymalizowane prace z folderu `gallery`
- `assets/logo.svg` - proste logo/favikona
- `BOOKING.md` - rekomendacja i konfiguracja kalendarza konsultacji

## Hosting

Najprostsze opcje na start:

- Cloudflare Pages - bardzo dobre pod statyczne strony, darmowy plan, łatwe domeny i SSL.
- Netlify - proste wdrożenie przez przeciągnięcie folderu albo Git, darmowy plan.
- GitHub Pages - darmowo, dobre jeśli strona będzie w repozytorium.

Rekomendacja na tę stronę: Cloudflare Pages albo Netlify.

## IIS

Jeśli publikujesz na IIS, wrzuć razem ze stroną plik `web.config`. Dodaje MIME type dla `.webp`, bez którego IIS potrafi zwracać `404 Not Found` mimo że pliki są na serwerze.

## Umawianie konsultacji

Rekomendacja: Cal.com. Na stronie ustawiono link:

`https://cal.com/izabela-switaj/konsultacja-30-min`

Trzeba założyć konto i utworzyć taki typ spotkania albo podmienić link w `index.html`.

## Domeny do sprawdzenia u rejestratora

DNS nie zwrócił rekordów dla tych nazw w dniu 2026-05-17, ale dostępność trzeba potwierdzić przy zakupie:

- `izaswitaj.pl`
- `izaswitajwnetrza.pl`
- `switajwnetrza.pl`
- `pracowniaswitaj.pl`
- `switajinteriors.pl`
- `izaswitajinteriors.pl`

Najczystsza nazwa na start: `izaswitaj.pl`. Najbardziej opisowa: `izaswitajwnetrza.pl`.

## Następne dane do podmiany

- docelowe zdjęcia / wizualizacje do galerii
- link do kalendarza, jeśli powstanie w Calendly, Cal.com albo Google Calendar
- polityka prywatności po wyborze formularza lub analityki
- ewentualne social media
