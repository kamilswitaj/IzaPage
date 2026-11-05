# Pełna praca dyplomowa — review 2026-11-05

Gałąź `codex/neomodernizm-room-layout`, punkt wejścia `9e6e4e1`, czysty worktree. Realizacja lokalna; bez merge, push i publikacji produkcyjnej.

## Zmiana

Końcowe details „Zobacz wszystkie rysunki techniczne” i komentarz o numeracji usunięto. W ich miejscu jest jedna kompaktowa karta-link „Zobacz całą pracę dyplomową”, z wymaganym podpisem, ikoną PDF i ikoną otwarcia osobnej karty. Zwykły HTML anchor, target=_blank, rel=noopener noreferrer, bez download i bez nowego JavaScriptu. Hover i focus mają subtelne zielone wyróżnienie; fokus klawiatury zachowuje także outline.

## Oryginalny dokument

Źródło: C:/Iza/Pulpit/ATA/praca dyplomowa/ODP__Praca_dyplomowa_Izabela_Świtaj/Izabela Świtaj praca dyplomowa-studium.pdf

Kopia w repo: assets/documentation/neomodernizm/praca-dyplomowa-izabela-switaj.pdf

- 64 strony (pypdf, odczyt bez zapisu).
- 23 529 447 bajtów.
- SHA-256 oryginału, kopii i treści pobranej przez HTTP: `436dbfdc7fd341c0dc222b5268b0431d20a6696db3d63ff01969e88b1600b505`.
- Wykonano wyłącznie kopiowanie pliku. Bez anonimizacji, kadrowania, kompresji, usuwania stron ani zmian metadanych; identyczność bajtowa obejmuje całość dokumentu.
- Serwer zwraca application/pdf, bez Content-Disposition: attachment. W pomocniczym serwerze poza repo dodano jedynie MIME dla PDF.

## Weryfikacja

- check-technical-documentation.mjs: PASS. Główna galeria ośmiu kart porównana z poprzednim commitem, bez zmian. Wszystkie 15 PNG i 15 miniatur nadal istnieją. Pełne PNG nadal identyczne z wcześniejszymi oryginałami. Numery, tytuły i viewer zachowane.
- Wszystkie 30 URL rysunków i pełny PDF: HTTP 200. Hash PDF w odpowiedzi HTTP identyczny z oryginałem.
- check-neomodernizm-hierarchy.py: PASS. Struktura H1–H4 i teksty pomieszczeń/spaceru bez zmian.
- check-portfolio.mjs: PASS, 72 unikalne URL HTTP 200, 155 odwołań, 49 pozycji galerii.
- Desktop 1440: karta ok. 93 px wysokości; telefon 390: ok. 167 px, szerokość 328 px. Bez poziomego przepełnienia, bez stałej wysokości.
- Klik i Enter otwierają nową kartę z oryginalnym PDF, tytuł czytnika „Przytulny neomodernizm (A4)”. Widoczny focus-visible, konsola bez błędów.
- Nie zmieniano innych sekcji, galerii, plików obrazów, JS ani pozostałych projektów.

## Zmienione pliki

- portfolio/neomodernizm/index.html
- portfolio/neomodernizm/documentation.css
- assets/documentation/neomodernizm/praca-dyplomowa-izabela-switaj.pdf
- scripts/check-technical-documentation.mjs
- scripts/prepare-technical-thumbnails.py (kontrola liczby użyć miniatur po usunięciu rozwijanego bloku; bez ponownego generowania obrazów)
- docs/neomodernizm-thesis-link-review-2026-11-05.md

Poza repo: C:/dev/IzaPage-checkpoints/local-preview.cjs (MIME PDF).

## Podgląd i zrzuty

http://127.0.0.1:8001/portfolio/neomodernizm/#pelna-praca-dyplomowa

[Desktop](C:/dev/IzaPage-checkpoints/thesis-link-review-2026-11-05/desktop.jpg) · [Telefon](C:/dev/IzaPage-checkpoints/thesis-link-review-2026-11-05/mobile.jpg)
