# Japandi — prezentacja projektu B

Worktree: `C:/dev/IzaPage-japandi`. Gałąź: `codex/japandi-complete-presentation`.
Baza: `origin/main`, `3c1ef63` (scalony PR #8).

## Zakres

Podstrona prowadzi przez brief, układ funkcjonalny, strefę dzienną, kuchnię,
sypialnię, łazienkę i WC, moodboardy, specyfikację oraz opracowanie techniczne.
Zachowano pełny wcześniejszy opis koncepcji i wszystkie 13 pozycji galerii.
Układ i style są lokalne dla Japandi. Nie zmieniono neomodernizmu ani strony głównej.

Źródło: dostarczony „Projekt b Izabela Świtaj.pdf”, 46 stron. Metraż 69,6 m²
i dwoje domowników pochodzą z kwestionariusza na stronach 4–6. Moodboardy:
16–17; wizualizacje: 19–23; specyfikacja: 25–31; arkusze techniczne: 34–46.
Oryginalny PDF jest dołączony bez zmian (39 459 121 bajtów).

## Arkusze

Pełne strony wyrenderowano w 180 dpi do PNG, bez przycinania rysunków,
legend ani tabliczek. Lekkie miniatury WebP mają maksymalnie 960 × 720 px.
Plik `assets/documentation/japandi/sheets.json` opisuje wymiary i powiązania.
Duże arkusze wczytują się po otwarciu przeglądarki rysunków, a PDF po kliknięciu linku.

| Strony PDF | Zakres | Numery z tabliczek |
| --- | --- | --- |
| 34–35 | Inwentaryzacja i układ funkcjonalny | 1.0, 2.0 |
| 36–38 | Oświetlenie, gniazda i wod.-kan. | 3.0, 3.1, 4.0 |
| 39–41 | Kuchnia: rzut, przekroje, tekstury | 5.0, 5.1, 5.2 |
| 42–46 | Łazienka i WC: instalacje i okładziny | 6.0, 6.1, 6.1, 6.2, 6.3 |

Numerację odwzorowano z tabliczek arkuszy, ponieważ spis treści ma rozbieżności.
Powtórzone 6.1 na stronach 43–44 rozróżniają tytuły i numery stron PDF.
Instrukcje wykonawcze w PDF są treścią dokumentacji, nie poleceniami dla agenta.

## Weryfikacja

- `scripts/check-portfolio.mjs http://127.0.0.1:8022/`: PASS;
  4 podstrony, 179 odwołań lokalnych, 49 zachowanych pozycji galerii,
  89 unikalnych zasobów HTTP 200, strona główna bez zmian.
- `scripts/check-technical-documentation.mjs`: PASS; regresja neomodernizmu.
- `scripts/check-neomodernizm-hierarchy.py`: PASS; treść i hierarchia neomodernizmu.
- `scripts/check-japandi.cjs`: PASS w Chrome / Playwright;
  szerokości 1440, 768, 390, 320 px, dekodowanie obrazów, brak overflow,
  13 pozycji galerii, 13 arkuszy, nawigacja, zoom 100%/125%, Escape i przywracanie fokusu.
- Wizualnie sprawdzono pełne zrzuty strony desktop/mobile i podgląd techniczny.
- Test odnośników sprawdza fragmenty identyfikatorów wyłącznie w HTML;
  fragment PDF `#page=25` jest parametrem przeglądarki PDF, nie identyfikatorem HTML.

Test przeglądarkowy wymaga Playwright i lokalnego Chrome. Przykład:
`PREVIEW_URL=http://127.0.0.1:8022/portfolio/japandi/ node scripts/check-japandi.cjs`.
Ścieżkę do pakietu można podać przez `PLAYWRIGHT_MODULE`, a katalog zrzutów przez
`REVIEW_OUTPUT`. Domyślny katalog wyników to `tmp/japandi-review`.

Podgląd lokalny: http://127.0.0.1:8022/portfolio/japandi/.
Nie wykonano merge ani publikacji GitHub Pages.
