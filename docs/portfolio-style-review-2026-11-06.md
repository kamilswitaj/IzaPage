# Ujednolicenie portfolio — kontrola 6 listopada 2026

Baza: `adac8b9` (`main` po PR #19). Zakres obejmuje `/portfolio/` i cztery istniejące projekty. Pliki strony biura (`index.html`, `styles.css`, `script.js`) pozostają bez zmian.

## Standard

- Nagłówek używa istniejącego `assets/is-sygnet.png`, nazwiska i dopisku zawodu. Cała marka prowadzi do `/portfolio/`. Na stronie portfolio są odnośniki do projektów, biografii i kontaktu.
- Hero korzysta ze wspólnego `portfolio.css`: siatka i rozmiary odpowiadają Domkowi babci. Lokalne reguły hero Japandi usunięto. Tytuły zawijają się naturalnie, a liczba wierszy informacji o narzędziach jest dowolna. Numery projektów: I–IV.
- Spis sekcji znajduje się pod metadanymi, pomiędzy delikatnymi liniami. Neomodernizm otrzymał kotwice do założeń, układu, pomieszczeń i dokumentacji.
- Kontakt ma identyczny HTML na pięciu stronach, granatowe tło, złamaną biel i Inter 400. Pionowy padding wynosi `clamp(24px, 2.5vw, 32px)`, a przy szerokości do 640 px — 20–24 px. Odstępy kontaktu to 6–8 px; linki mają minimalny obszar 32 px. Nazwisko: 21,6–28,8 px.
- Nawigacja projektów zachowuje kolejność I → II → III → IV, bez zapętlenia. Powrót do portfolio jest osobno, na jasnym tle.
- H1 i nagłówki rozdziałów: Playfair Display 600. Opisy, metadane, podpisy, nawigacja i kontakt: Inter. Ładowane są wagi Inter 400/500/600/700 oraz Playfair Display 600/700. Stopka świadomie używa Inter.
- Sieroty poprawiono statycznie w tekście HTML twardymi spacjami. Nazwy programów otrzymały krótkie oznaczenia `no-break`; V‑Ray używa nierozdzielającego łącznika. Nie dodano skryptu przepisującego treść.
- Galerie, pliki obrazów, kolejność wizualizacji, dokumentacja i dane kontaktowe pozostają zachowane. Testy porównujące zaakceptowaną treść normalizują wyłącznie dozwolone zmiany typograficzne.

## Weryfikacja

Uruchomiono:

```text
node scripts/check-portfolio.mjs
node scripts/check-technical-documentation.mjs
python scripts/check-neomodernizm-hierarchy.py
node scripts/check-portfolio-layout.cjs
git diff --check
```

Kontrola przeglądarkowa: Chrome headless, pięć stron × 1700, 1440, 768 i 390 px. Sprawdza dekodowanie obrazów, błędy HTTP/JS, overflow, kotwice, pozycję hero, wielkość nagłówków rozdziałów, jednakowy nagłówek i stopkę, numerację, sąsiadów projektów, obsługę klawiaturą lightboxów oraz otwieranie i zamykanie rysunków technicznych. Zapisuje pełne zrzuty stron, osobne zrzuty stopek i `report.json`.

Test wymaga Playwright i Chrome. Można wskazać `PLAYWRIGHT_MODULE`, `CHROME_PATH` i `REVIEW_OUTPUT`. Domyślnie zapisuje materiały w `tmp/portfolio-unify-review`; materiały QA nie należą do źródeł witryny.

Nie wykonano publikacji ani merge. Ocena estetyczna pozostaje do akceptacji właścicielki portfolio.

## Korekta wysokości stopki w PR #20

Porównano przed/po na wszystkich pięciu stronach przy 1700, 1440, 768, 640 i 390 px. Wysokość przy 1440 px spadła z około 244 do 164 px, a przy 390 px z 275 do 203 px. Kontrola potwierdziła zachowanie kolumn, kolorów i zawartości, brak poziomego przewijania oraz brak nakładania się z poprzednią sekcją. Wysokość stopki nadal wynika z treści. Zapisano porównania desktopu i telefonu. Trzy istniejące kontrole portfolio, dokumentacji i hierarchii Neomodernizmu przeszły.
