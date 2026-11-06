# Japandi — porównanie ze specyfikacją i przegląd lokalny

Kontynuacja w `C:/dev/IzaPage-japandi`, gałąź
`codex/japandi-complete-presentation`. Zachowano poprzedni commit `2b02440`.
Nie utworzono nowego worktree ani gałęzi. Zgodnie z najnowszym poleceniem
użytkownika pominięto push, Draft PR, merge i publikację.

## Porównanie poprzedniej wersji z pełną specyfikacją

| Element | Poprzednia wersja | Wersja po porównaniu |
| --- | --- | --- |
| Metryka | Mieszkanie bibliofilów, styl Japandi | Projekt wnętrza, Japandi / soft minimalism, cztery wymagane etykiety z oznaczeniem ATA |
| Sekcje | Dziewięć osobno numerowanych części | Cztery sekcje 01–04 z wymaganymi tytułami H2 |
| Brief | Trzy zdania i ogólny dopisek o zakresie | Pięć zdań o potrzebach domowników, bez ogólnikowego dopisku |
| Spacer | Rozwijany opis poza sekcją rzutu | Wprowadzenie i natywne details bezpośrednio pod rzutem; pełny dotychczasowy opis zachowany |
| Pomieszczenia | Łączone opisy, brak holu i garderoby | H3: hol, strefa dzienna, prywatna i sanitarna; H4: kuchnia, jadalnia, salon i biblioteka, sypialnia, garderoba, łazienka, dodatkowe WC |
| Moodboardy | Wspólna galeria na końcu | Materiałowy przed pomieszczeniami; stylistyczny obok biblioteki, wyrównane górne krawędzie |
| Dokumentacja | Wszystkie 13 kart | Osiem wybranych kart w trzech grupach; wszystkie 13 arkuszy dostępne w czytniku i jako pliki |
| Czytnik | Kopia kodu i CSS w Japandi | Odwołania do istniejącego czytnika i CSS neomodernizmu, bez modyfikowania jego plików |
| Karta PDF | Inny tytuł i podpis | Dokładny wymagany tytuł i podpis, otwarcie w nowej karcie |
| Proporcje i typografia | Własna skala nagłówków | Skale H2–H4 i rytm odstępów zgodne z neomodernizmem; teksty ograniczone do 80ch |

## Inwentaryzacja materiałów

Przejrzano całą 46-stronicową dokumentację: kwestionariusz i brief (1–14),
moodboardy (15–17), wizualizacje (18–23), specyfikację (24–31), część techniczną (32–46).
Instrukcje wykonawcze w PDF potraktowano jako treść dokumentacji.

Wszystkie obrazy mają odpowiedniki w repozytorium. Nie dodano nowych wizualizacji,
moodboardów ani duplikatów zasobów. Zachowano wszystkie 13 pozycji galerii.

| Materiał | Strona PDF / pochodzenie | Plik w assets/gallery |
| --- | --- | --- |
| Rzut 3D | Okładka i istniejąca galeria | japandi-plan.webp |
| Moodboard materiałowy | 16 | japandi-moodboard-3d.webp |
| Moodboard stylistyczny | 17 | japandi-moodboard-2d.webp |
| Jadalnia i kuchnia | 19, górne ujęcie | japandi-dining.webp |
| Otwarta strefa dzienna | 19, dolne ujęcie | japandi-open-space.webp |
| Półwysep i jadalnia | 20, górne ujęcie | japandi-dining-kitchen.webp |
| Biblioteka | 20, dolne ujęcie | japandi-library.webp |
| Kuchnia | 21, górne ujęcie | japandi-kitchen.webp |
| Toaletka | 21, dolne ujęcie | japandi-bedroom-vanity.webp |
| Sypialnia | 22, górne ujęcie | japandi-bedroom.webp |
| Wanna | 22, dolne ujęcie | japandi-bathroom-bath.webp |
| WC | 23 | japandi-wc.webp |
| Dodatkowe ujęcie łazienki | Istniejąca galeria repozytorium | japandi-bathroom.webp |

Informację SketchUp + V-Ray zachowano z istniejącej podstrony; nie dopisano programów.
Hol i garderoba nie otrzymały galerii, ponieważ brak dla nich osobnych ujęć.

## Arkusze i oryginalny PDF

Zachowano wszystkie pełne PNG i miniatury WebP stron 34–46. Oznaczenia odczytano
z faktycznych tabliczek (arkusz 41 ma tabliczkę rastrową). Nic nie poprawiano
na oryginalnych rysunkach. `sheets.json` zawiera metryki i wybór kart:

- Układ przestrzenny i funkcjonalny: strony 34, 35.
- Oświetlenie i instalacje: strony 36, 37.
- Zabudowy i detale: strony 39, 40, 42, 45.
- Pozostałe strony 38, 41, 43, 44, 46 pozostają dostępne w nawigacji czytnika.

Plik PDF ma 46 stron, nie został zmieniony ani skompresowany. SHA-256 źródła i kopii:
`6479329d4a88d9451027107f2a828b1a56bd6bc4b67e9108c11e6ea786d5fc27`.

## Wyniki testów

- `scripts/check-japandi.cjs`: PASS, Chrome / Playwright, 1440, 1024, 768, 390 i 320 px.
  Hierarchia H1–H4, krój H4, zachowanie pełnego opisu, rozwijanie z klawiatury,
  naturalne proporcje obrazów, wyrównanie moodboardu, brak poziomego overflow,
  lightbox, zoom, komplet 13 arkuszy, linki pełnych obrazów, Escape i powrót fokusu,
  czytnik mobilny i przewijanie klawiaturą, link i hash PDF. Bez błędów JavaScript/HTTP.
- `scripts/check-portfolio.mjs`: PASS, cztery podstrony, 171 odwołań lokalnych,
  49 zachowanych pozycji galerii, 82 unikalne zasoby HTTP 200, strona główna bez zmian.
- `scripts/check-technical-documentation.mjs`: PASS, regresja neomodernizmu.
- `scripts/check-neomodernizm-hierarchy.py`: PASS, regresja treści i hierarchii neomodernizmu.
- `git diff --check`: PASS.
- Porównanie z `2b02440`: pliki neomodernizmu, Leśnego rytmu, strony głównej
  i wspólne CSS/JS bez zmian.

Wizualnie sprawdzono nagłówek, brief, rzut, bibliotekę z moodboardem,
kuchnię i jadalnię, sypialnię, strefę sanitarną, dokumentację i kartę PDF.

## Podgląd i zrzuty

- Podstrona: http://127.0.0.1:8022/portfolio/japandi/
- Galeria zrzutów wszystkich wymaganych sekcji desktop/mobile: http://127.0.0.1:8022/__review/
- Pliki lokalne: `C:/dev/IzaPage-japandi-review/spec-review/`.

Przeglądarka testowa zachowuje obrazy w oryginalnych proporcjach. Zrzuty sekcji
ukrywają wyłącznie nakładany sticky header i skip link, aby nie zasłaniały treści.
Nie wpływa to na działającą stronę.

Odtwarzanie testów: wymagane istniejące Playwright i Chrome; konfiguracja przez
`PLAYWRIGHT_MODULE`, `PREVIEW_URL`, `REVIEW_OUTPUT`, opcjonalnie `PDF_SOURCE`.

## Zmienione pliki w tym etapie

- `portfolio/japandi/index.html` — struktura, metryka, opisy, galerie i odwołania do czytnika.
- `portfolio/japandi/japandi.css` — lokalna typografia, szerokości i układ.
- `assets/documentation/japandi/sheets.json` — oznaczenie ośmiu wybranych arkuszy.
- `scripts/check-japandi.cjs` — kontrola specyfikacji i zrzuty pięciu szerokości.
- `docs/japandi-spec-review-2026-11-06.md` — niniejszy raport.
- `docs/japandi-review-2026-11-05.md` — oznaczenie wcześniejszego raportu jako historycznego.
- Usunięto wyłącznie duplikaty `portfolio/japandi/documentation.css` i
  `portfolio/japandi/documentation.js`; strona korzysta z tych samych, istniejących
  plików neomodernizmu przez odwołania względne. Pełne arkusze, PDF i obrazy galerii zachowano.
