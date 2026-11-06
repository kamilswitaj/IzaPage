# Leśny rytm codzienności — przegląd zmian

- Worktree: `C:/dev/IzaPage-lesny-rytm`.
- Gałąź: `codex/lesny-rytm-complete-presentation`.
- Baza: aktualny `origin/main`, `3c1ef6378da194d87a1705b0ca683bedfcb8ebfd`.
- Referencja: otwarty, niescalony PR #9, head `b787876db3dbcb4ca25b822ceead73db2d056961`. Nie przenoszono zmian Japandi.

## Prezentacja

Cztery główne części: założenia, układ funkcjonalny, zabudowa RTV i biuro oraz wizualizacje z AI. Dokumentacja jest krótką podsekcją ostatniej części. Metryka rozróżnia projekt kursowy ON-ARCH z 2023 roku i rozwinięcie wizualizacji w 2026 roku. Nie przypisuje projektowi realizacji ani niezweryfikowanej powierzchni.

Zachowano istniejące sześć zasobów `organic-*.webp`. Dodano jedynie trzy brakujące oryginalne rendery do porównań: `kuchnia.jpg`, `biuro orginal.jpg` i `sofa.jpg`, przekonwertowane do WebP. Nie dodawano nowych wizualizacji. Zestawienia są statyczne, bez suwaka, ponieważ kadry i geometria różnią się między wersjami. Para zamkniętej i otwartej zabudowy zachowuje układ dwóch wnęk, blatu i kieszeni; dokumentacja pozostaje źródłem informacji o konstrukcji.

## Dokumentacja

Źródło lokalne: `C:/Iza/Iza/wnetrza/on arch/projekt/Izabela Switaj.pdf`, 14 stron. Wybrane arkusze wyrenderowano bez kadrowania i zmian w 300 dpi do PNG. Tabliczki sprawdzono również wizualnie:

| Strona / rysunek | Oryginalny tytuł | Skala |
| --- | --- | --- |
| 2 | Układ funkcjonalny | 1:50 |
| 5 | Oświetlenie | 1:50 |
| 10 | Widok A-A kuchnia | 1:20 |
| 14 | Szafka TV i biurko | 1:20; widok zamknięty 1:50 |

Miniatura rzutu korzysta z istniejącego `organic-plan.webp`; pozostałe trzy miniatury są nowe. Wcześniejsze sekcje odwołują się do tych samych plików arkuszy. Czytnik i jego style pochodzą z istniejącego neomodernizmu, bez kopiowania infrastruktury. Pełnego PDF nie dodano.

## Weryfikacja

- `scripts/check-lesny-rytm.cjs`: PASS. Chrome / Playwright; 1440, 768, 390 i 320 px; brak poziomego przewijania; cztery części, unikalne identyfikatory, proporcje i ładowanie obrazów, lightbox, otwieranie wszystkich czterech arkuszy, zoom i Escape; brak błędów JS i HTTP.
- Dodatkowo sprawdzono lokalne ścieżki, kotwice, `srcset` oraz zachowanie istniejących sześciu zasobów galerii.
- Wizualnie obejrzano desktop, telefon i czytnik dokumentacji na telefonie.
- `git diff --check`: PASS.
- Nie zmieniano wspólnych stylów, czytnika, innych projektów ani strony głównej.

Test uruchamia się po uruchomieniu serwera statycznego w katalogu repozytorium:

```powershell
node scripts/check-lesny-rytm.cjs http://127.0.0.1:8766/
```

Wymaga dostępnego pakietu `playwright` (ewentualnie przez `NODE_PATH`). `CHROME_BINARY` wskazuje niestandardową lokalizację przeglądarki. Zrzuty testowe trafiają do osobnego katalogu tymczasowego.

Nie wykonano push, merge ani publikacji produkcyjnej.
