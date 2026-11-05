# Przywrócenie spaceru i hierarchii — review 2026-11-05

Gałąź: `codex/neomodernizm-room-layout`. Stan wejściowy czysty, commit `4f92d3e` z lokalną dokumentacją techniczną. Sprawdzono aktualne gałęzie obu PR po fetch. PR #7 (`fcd4f2b`) różni się od PR #6 (`7d159ac`) wyłącznie metryką nagłówka w jednym pliku. Jego istniejący commit przeniesiono przez cherry-pick jako `1826229`; nie implementowano tych zmian ponownie. Nie zmieniano main ani zdalnych gałęzi.

## Wynik

- Cztery rozdziały 01–04, jeden H1 i pełna wymagana hierarchia H2–H4.
- Spacer bezpośrednio po rzucie 3D, natywne details domyślnie zwinięte. Tytuł oraz zachęta zgodne z poleceniem.
- Oryginalne dziewięć akapitów z `5536e6d:portfolio/neomodernizm/index.html` przywrócono bez zmian tekstu i podziału akapitów.
- Strefa dzienna: Kuchnia/Jadalnia/Salon, trzy moodboardy; sanitarna: Łazienka/WC, jeden moodboard łazienki.
- Galeria techniczna nadal 8 wyróżnionych i komplet 15 w rozwijanym bloku, bez zmian plików i podpisów.
- Typografia zmieniona tylko w lokalnym neomodernizm.css; globalny CSS i pozostałe projekty nietknięte.

## Weryfikacja

- check-neomodernizm-hierarchy.py: PASS — poprawne zagnieżdżenie HTML, jeden H1, bez przeskoków poziomów, oryginalna narracja, nagłówek identyczny z PR #7, niezmienione opisy pomieszczeń.
- check-technical-documentation.mjs: PASS — kolejność 8/15, numery, wymiary, zasoby, niezmienione galerie wizualizacji i dokumentacji. Test zachowania całej poprzedniej strony dostosowano do świadomej zmiany hierarchii.
- check-portfolio.mjs: PASS — 93 URL HTTP 200, 192 odwołania lokalne, 49 pozycji galerii, strona główna bez zmian.
- Przeglądarka 1440 × 1000 i 390 × 844: brak poziomego przepełnienia; natywne rozwijanie myszą, Enterem i spacją, widoczny fokus; powiększanie dokumentacji, zamykanie Escape, rozwijany komplet 15 arkuszy. Konsola bez błędów. Telefon testowany przez szerokość przeglądarki, nie na fizycznym urządzeniu.

## Uwagi do treści

W oryginalnym spacerze jest starsze określenie tapety w sypialni „o tekstylnej strukturze”. Zachowano je zgodnie z wymaganiem wiernego odtworzenia narracji. Aktualny opis sypialni nadal zawiera zatwierdzony delikatny wzór roślinny. Ewentualna korekta oryginalnej narracji wymaga osobnej decyzji.

## Zmienione pliki

- portfolio/neomodernizm/index.html
- portfolio/neomodernizm/neomodernizm.css
- scripts/check-technical-documentation.mjs
- scripts/check-neomodernizm-hierarchy.py
- docs/neomodernizm-hierarchy-review-2026-11-05.md

## Zrzuty

| Widok | Desktop 1440 | Mobile 390 |
|---|---|---|
| Początek projektu | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/01-poczatek-desktop.jpg) | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/01-poczatek-mobile.jpg) |
| Spacer po mieszkaniu | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/02-spacer-desktop.jpg) | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/02-spacer-mobile.jpg) |
| Strefa dzienna | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/03-dzienna-desktop.jpg) | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/03-dzienna-mobile.jpg) |
| Strefa sanitarna | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/04-sanitarna-desktop.jpg) | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/04-sanitarna-mobile.jpg) |
| Dokumentacja techniczna | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/05-dokumentacja-desktop.jpg) | [Zrzut](C:/dev/IzaPage-checkpoints/hierarchy-review-2026-11-05/05-dokumentacja-mobile.jpg) |

Podgląd: http://127.0.0.1:8001/portfolio/neomodernizm/#projekt-neomodernizm

Nie wykonano merge, push nowych zmian ani publikacji.
