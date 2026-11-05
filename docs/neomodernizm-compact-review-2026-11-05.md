# Kompozycja i kompaktowe karty — review 2026-11-05

Gałąź `codex/neomodernizm-room-layout`. Kontynuacja czystego stanu `3163902`. Bez merge, push i publikacji.

## Wprowadzone zmiany

- Usunięto wyłącznie wskazany końcowy akapit z założeń. Margines przed układem funkcjonalnym zmniejszony na desktopie z 76 do 48 px, bez globalnego kasowania odstępów.
- Przyczyną pustych obszarów było align-self:center na pierwszej wizualizacji i wspólny wysoki wiersz siatki moodboardu. Moodboard obejmuje teraz dwa wiersze, obie pierwsze wizualizacje zajmują prawą kolumnę, a następne przechodzą do dalszych wierszy. Kolejność DOM/lightboxa i oryginalne proporcje bez zmian; pierwsze górne krawędzie wyrównane. Nie stwierdzono min-height wymuszającego wysokość tej galerii.
- Jawne nadpisania dla pierwszej i drugiej wizualizacji usuwają konflikt specyficzności na telefonie. Układ mobilny ma jedną naturalną kolumnę.
- Wszystkie 23 wystąpienia kart (8 + 15) mają tylko miniaturę, metrykę RYS. N · skala oraz tytuł. Bez opisowego akapitu i stałego linku pod kartą. Cała miniatura nadal jest przyciskiem.
- Czytnik zachowuje 100%, przewijanie, zmianę arkuszy i link „Pełny arkusz” w osobnej karcie. Nie dodano bibliotek ani sztywnych wysokości kart.
- Desktop 1440/1024: dwie kolumny kart. Tablet 768 i telefon 390: jedna.

## Porównanie wysokości przy 1440 px

| Element | Przed | Po | Zmiana |
|---|---|---|---|
| Karta (rys. 2.0) | 654 px | 545 px | −17% |
| Dolna część karty | 216 px | 92 px | −57% |
| Odstęp przed rzutem | 76 px | 48 px | −37% |

Dolna część jest nieco bardziej zwarta niż orientacyjne 40–50%; tytuły nie są obcinane, na telefonie długi tytuł zwiększa naturalnie wysokość do ok. 111 px.

## Miniatury i oryginały

Przygotowano 15 WebP z istniejących pełnych PNG; przycięto wyłącznie zewnętrzną biel, ok. 4% szerokości i poniżej 1% wysokości. Wykryto granice wszystkich oznaczeń, pozostawiono margines bezpieczeństwa 48 px, maksymalne dozwolone przycięcie 5% na krawędź. Dzięki temu na miniaturach nadal mieszczą się legenda, wymiarowanie, obramowanie i tabliczka. Wynik 960 × 703 px, łącznie 523678 B; źródła cropu ponad 4700 px szerokości, bez powiększania bitmap. Skrypt ponownego generowania: scripts/prepare-technical-thumbnails.py.

Pełne PNG 4961 × 3508 px: wszystkie 15 plików porównano bajtowo z commitem 3163902 — identyczne. Numeracja i tytuły zachowane, dane viewer JSON bez zmian.

## Weryfikacja

- 1440/1024/768/390: bez poziomego przepełnienia, poprawna liczba kolumn. Sprawdzono wyrównanie kuchni i pokoju dziewczynek, proporcje oraz mobilną kolejność.
- Galeria wizualizacji otwiera kuchnię i przechodzi do drugiego widoku; 30 pozycji projektu, 49 całego portfolio bez zmian.
- Czytnik otwiera oryginalne PNG, pokazuje 100% 4961 px, przechodzi między arkuszami, zamyka Escape. Osobna karta PNG potwierdzona: 4961 × 3508 px.
- W pomocniczym serwerze podglądu poza repo poprawiono MIME PNG i normalizację ścieżki Windows. Po naprawie cały serwis i PNG odpowiadają poprawnie; to nie jest zmiana produkcyjnego hostingu.
- check-technical-documentation.mjs: PASS, wszystkie 30 URL obrazów HTTP 200 i image MIME, kontrola 8/15, tytułów, numerów, kompaktowej struktury kart, oryginałów i niezmienionej galerii zdjęć.
- check-neomodernizm-hierarchy.py: PASS — H1–H4, struktura HTML, teksty pomieszczeń i spaceru, metryka PR #7.
- check-portfolio.mjs: PASS — 78 unikalnych URL w HTML, 169 odwołań lokalnych, 49 pozycji galerii, strona główna bez zmian. Liczba URL zmalała po usunięciu 15 unikalnych stałych linków kart; pełne obrazy testowane osobno.
- Pozostałe projekty i globalny CSS/JS nietknięte; nie zmieniano opisów pomieszczeń ani poziomów nagłówków. Test mobilny w przeglądarce, bez fizycznego urządzenia.

## Zmienione pliki

- portfolio/neomodernizm/index.html
- portfolio/neomodernizm/neomodernizm.css
- portfolio/neomodernizm/documentation.css
- assets/documentation/neomodernizm/thumbs/arkusz-50.webp … arkusz-64.webp (15)
- scripts/prepare-technical-thumbnails.py
- scripts/check-technical-documentation.mjs
- docs/neomodernizm-compact-review-2026-11-05.md

Poza repo: C:/dev/IzaPage-checkpoints/local-preview.cjs — pomocniczy serwer lokalny.

## Zrzuty

[01-zalozenia-rzut-desktop](C:/dev/IzaPage-checkpoints/compact-review-2026-11-05/01-zalozenia-rzut-desktop.jpg)

[02-kuchnia-desktop](C:/dev/IzaPage-checkpoints/compact-review-2026-11-05/02-kuchnia-desktop.jpg)

[03-dziewczynki-desktop](C:/dev/IzaPage-checkpoints/compact-review-2026-11-05/03-dziewczynki-desktop.jpg)

[04-karty-desktop](C:/dev/IzaPage-checkpoints/compact-review-2026-11-05/04-karty-desktop.jpg)

[02-kuchnia-mobile](C:/dev/IzaPage-checkpoints/compact-review-2026-11-05/02-kuchnia-mobile.jpg)

[04-karty-mobile](C:/dev/IzaPage-checkpoints/compact-review-2026-11-05/04-karty-mobile.jpg)

Podgląd: http://127.0.0.1:8001/portfolio/neomodernizm/#technical-layout-title
