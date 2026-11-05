# Korekta nagłówków i szerokości — review 2026-11-05

Gałąź `codex/neomodernizm-room-layout`, kontynuacja `ea02087`. Przed pracą brak niezacommitowanych zmian.

## Zmiany

Sekcja 01: H2 „Funkcja prowadzi projekt”, bez dodatkowego mniejszego powtórzenia. Sekcja 02: H2 „Przestrzeń dopasowana do życia rodziny”. Sekcja 04: H2 „Od układu do detalu” i dokładnie wskazany pojedynczy akapit. Poziomy H1–H4 i wszystkie opisy pomieszczeń zachowane.

Przyczyną zawężenia były max-width na całych kontenerach: globalne 72ch dla case-brief i reading-copy, lokalne 76ch dla nagłówków pomieszczeń oraz 78ch dla spaceru i nagłówków dokumentacji. Lokalne nadpisania zdejmują ograniczenia kontenerów, a limit 80ch stosują wyłącznie do akapitów. Bez zmian fontów i rozmiarów tekstu. Nagłówki korzystają z pełnego kontenera; na telefonie akapity również.

## Pomiary w przeglądarce

| Ekran | Szerokość nagłówków | Szerokość akapitów | Poziome przepełnienie |
|---|---|---|---|
| 1440 | 1252 px | 808 px | brak |
| 1024 | 886 px | 808 px | brak |
| 768 | 661 px | 661 px | brak |
| 390 | 328 px | 328 px | brak |

Przed zmianą akapit założeń miał 727 px, a nagłówki pomieszczeń ograniczono do 767 px. Po zmianie przykładowy pełny opis rodziny ma wiersze 94/97/107/84 znaki (średnio ok. 96, zależnie od słów); limit 80ch uwzględnia proporcjonalny font. Nagłówki na desktopie mieszczą się w jednym wierszu, na telefonie zawijają naturalnie. Lewe krawędzie tekstu i sekcji pozostają wspólne.

## Kontrole

- check-neomodernizm-hierarchy.py: PASS — jeden H1, poprawna hierarchia i zagnieżdżenie HTML, niezmieniony nagłówek PR #7, oryginalne dziewięć akapitów spaceru, niezmienione opisy pomieszczeń.
- check-technical-documentation.mjs: PASS — 8 wyróżnionych / 15 pełnego zestawu, oryginalne numery, podpisy i zasoby, galerie zachowane. Test porównania dokumentacji pomija teraz zmieniony świadomie nagłówek wraz z wprowadzeniem; treść galerii nadal porównuje w całości.
- check-portfolio.mjs: PASS — 93 URL HTTP 200, 192 odwołania, 49 pozycji galerii.
- Interakcje: spacer Enter/Spacja/klik, galeria rzutu 3D, zamknięcie Escape, czytnik rysunku 60 przy 100% (4961 px), mobilny czytnik i spacer. Konsola bez błędów.
- Bez zmian plików obrazów, galerii, globalnego CSS, JavaScriptu czy innych projektów. Kontrole mobilne w przeglądarce, bez fizycznego telefonu.

## Zmienione pliki

- portfolio/neomodernizm/index.html
- portfolio/neomodernizm/neomodernizm.css
- scripts/check-neomodernizm-hierarchy.py
- scripts/check-technical-documentation.mjs
- docs/neomodernizm-text-width-review-2026-11-05.md

## Zrzuty

[01-zalozenia-desktop](C:/dev/IzaPage-checkpoints/text-width-review-2026-11-05/01-zalozenia-desktop.jpg)

[02-uklad-desktop](C:/dev/IzaPage-checkpoints/text-width-review-2026-11-05/02-uklad-desktop.jpg)

[03-pomieszczenia-desktop](C:/dev/IzaPage-checkpoints/text-width-review-2026-11-05/03-pomieszczenia-desktop.jpg)

[04-dokumentacja-desktop](C:/dev/IzaPage-checkpoints/text-width-review-2026-11-05/04-dokumentacja-desktop.jpg)

[02-uklad-mobile](C:/dev/IzaPage-checkpoints/text-width-review-2026-11-05/02-uklad-mobile.jpg)

Podgląd: http://127.0.0.1:8001/portfolio/neomodernizm/#projekt-neomodernizm

Bez merge, push i publikacji produkcyjnej.
