# Dokumentacja techniczna — kontrola 2026-11-05

Kontynuacja istniejących eksportów, bez ponownego renderowania PDF. Checkpoint przed integracją: `checkpoint/2026-11-05-before-technical-docs`. Zmiany lokalne na `codex/neomodernizm-room-layout`; bez publikacji i merge.

Źródło: Izabela Świtaj praca dyplomowa-studium.pdf, 64 strony. SHA-256: 436dbfdc7fd341c0dc222b5268b0431d20a6696db3d63ff01969e88b1600b505. Wykorzystano wyłącznie strony 50–64.

Projekt dyplomowy — mieszkanie 67,25 m² dla rodziny 2+2. Dane inwestorów fikcyjne; tabliczki, autorstwo i oznaczenia zachowane.

| PDF | Rys. | Podpis | Główna galeria |
|---|---|---|---|
| 50 | 1.0 | Inwentaryzacja | — |
| 51 | 2.0 | Wyburzenia i projektowane ściany | tak |
| 52 | 3.0 | Rzut po zmianach budowlanych | — |
| 53 | 4.0 | Rzut funkcjonalny | tak |
| 54 | 5.0 | Podłogi i listwy przypodłogowe | — |
| 55 | 6.0 | Przekroje | tak |
| 56 | 7.0 | Lokalizacja opraw oświetleniowych | tak |
| 57 | 8.0 | Lokalizacja gniazd elektrycznych | — |
| 58 | 9.0 | Instalacje wod.-kan. | — |
| 59 | 10.0 | Kuchnia — rzut | tak |
| 60 | 11.0 | Kuchnia — widoki | tak |
| 61 | 12.0 | Kuchnia — sposób otwierania szafek | tak |
| 62 | 13.0 | Kuchnia — kolorystyka | — |
| 63 | 14.0 | Łazienka i toaleta | tak |
| 64 | 15.0 | Łazienka i toaleta -okładziny | — |

## Układ i zasoby

Trzy grupy: układ przestrzenny i funkcjonalny (51, 53, 55), oświetlenie i instalacje (56), zabudowy meblowe i detale (59, 60, 61, 63). Rozwijany blok „Zobacz wszystkie rysunki techniczne” zawiera komplet 15 stron w oryginalnej kolejności.

15 PNG 4961 × 3508 px, eksport bezpośrednio z PDF przy 300 dpi. 15 miniatur WebP 960 × 679 px. Wspólne pliki dla obu galerii, bez duplikacji. Bez przycinania, bez nowej biblioteki. Pełne PNG dostępne w osobnej karcie; cały PDF nie został skopiowany do witryny.

## Weryfikacja

- Wszystkie 15 arkuszy sprawdzono na planszy przeglądowej i w tabliczkach; obrazy zachowują oryginalną treść.
- Numer gniazd 8.0 pochodzi z rysunku; spis podaje 7.1. Rozbieżność opisana na stronie, oryginał bez korekty.
- Strona 64: podpis „Łazienka i toaleta -okładziny” zgodnie z wcześniejszą decyzją. Oryginalna tabliczka bez zmian.
- Desktop 1440 px, tablet 768 px, telefon 390 px: brak poziomego przepełnienia strony. Test telefonu wykonany w przeglądarce przy szerokości mobilnej, nie na fizycznym urządzeniu.
- Powiększenie 100% wyświetla 4961 px; wymiary kuchni czytelne. Przetestowano przewijanie klawiaturą, zmianę arkusza, zamykanie Escape i mobilny modal. Konsola bez błędów.
- Test `scripts/check-technical-documentation.mjs`: PASS (8/15, kolejność, numeracja, formaty i wymiary, brak PDF, zachowanie wcześniejszej strony).
- Test `scripts/check-portfolio.mjs`: PASS, 93 URL HTTP 200, 192 odwołania lokalne, 49 pozycji istniejących galerii; strona główna bez zmian.
- Po usunięciu dodanych bloków i jednego odnośnika CSS treść HTML jest identyczna bajtowo z kopią sprzed integracji. Pozostałe opisy, moodboardy, wizualizacje i projekty nie były edytowane.

## Zmienione pliki

- portfolio/neomodernizm/index.html
- portfolio/neomodernizm/documentation.css
- portfolio/neomodernizm/documentation.js
- assets/documentation/neomodernizm/details/arkusz-50.png … arkusz-64.png (15)
- assets/documentation/neomodernizm/thumbs/arkusz-50.webp … arkusz-64.webp (15)
- scripts/check-technical-documentation.mjs
- docs/technical-documentation-review-2026-11-05.md

Podgląd: http://127.0.0.1:8001/portfolio/neomodernizm/#dokumentacja-techniczna
