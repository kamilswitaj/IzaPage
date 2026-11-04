# Portfolio: review i weryfikacja końcowa

## Zakres
Na prośbę właściciela wykonano etapy 3–6 i przygotowano publikację bez kolejnej bramki akceptacji. Zmiany dotyczą portfolio; pliki strony głównej index.html, styles.css i script.js są identyczne z checkpointem produkcyjnym (po normalizacji końców linii).

- /portfolio/ jest przeglądem: krótki pierwszy ekran, trzy karty, profil i kontakt.
- /portfolio/neomodernizm/, /portfolio/japandi/, /portfolio/lesny-rytm/ zawierają osobne case studies, galerie, rzuty, powrót i kolejny projekt.
- Zachowano wszystkie 48 pozycji galerii, oryginalne pliki WebP i pełne dotychczasowe opisy w rozwijanych sekcjach. Nowe streszczenia oparto wyłącznie na tych opisach.
- Wyeksponowano ergonomię kuchni, przechowywanie, bibliotekę z panelami, ukrywanie TV i porównanie otwartej/zamkniętej zabudowy home office.
- Usunięto przestarzały układ float i ResizeObserver. Wspólny CSS/JS obsługuje wszystkie cztery strony, bez frameworka i build systemu.
- Lightbox przechodzi przez cały projekt, blokuje tło przez inert, obsługuje Escape/strzałki/Tab, przywraca fokus i informuje o błędzie obrazu.
- Dodano cztery podglądy 640 px (łącznie 91 890 bajtów), srcset/sizes dla głównych obrazów, poprawne wymiary źródłowych WebP i lazy loading galerii. Oryginały pozostają w lightboxie.
- Indywidualne title, description, canonical, OG/Twitter i CreativeWork dla projektów. Publiczne portfolio ma index, follow; dodano sitemap.xml i robots.txt. Mapa zawiera tylko stronę główną i cztery publiczne strony portfolio.
- Stare kotwice #projekt-neomodernizm, #projekt-japandi i #projekt-lesny-rytm kierują do nowych stron przez współdzielony JS.

## Weryfikacja
- Test skryptem scripts/check-portfolio.mjs: 4 strony, 141 lokalnych odwołań, 48 pozycji galerii, kompletność srcset, alt, unikalność identyfikatorów, JSON-LD i brak zmian strony głównej.
- Kontrola HTTP: 59 unikalnych adresów stron/zasobów, oczekiwany status 200.
- node --check portfolio/portfolio.js oraz git diff --check.
- Kontrola zagnieżdżenia HTML: brak niedomkniętych/niedopasowanych znaczników w czterech dokumentach.
- Przeglądarka: wszystkie cztery strony w szerokościach 1440, 768 i 390 px; brak elementów wychodzących poziomo poza viewport, brak uszkodzonych widocznych obrazów, jeden h1 na stronę.
- Pełne cykle lightboxa: neomodernizm 29/29, Japandi 13/13, Leśny rytm 6/6; zgodna kolejność i przejście z ostatniego do pierwszego obrazu.
- Klawiatura: Escape, ArrowRight, Shift+Tab i Tab na granicach dialogu, przywrócenie fokusu. Telefon 390 px: przyciski nawigacji i zamknięcia, czytelny podpis i zachowane proporcje.
- Konsola przeglądarki: brak zgłoszonych błędów/ostrzeżeń w sprawdzonych galeriach.
- Zrzuty ekranów zapisano lokalnie poza drzewem publikacji.

## Review: poprawione problemy
1. Sumowanie scroll-padding i scroll-margin przy kotwicach.
2. Nadmierny rozmiar nagłówka pierwszego ekranu; skrócono wstęp i przeniesiono pełny profil pod karty.
3. Nieprawidłowe wymiary odziedziczonych obrazów w kartach i coverach.
4. Niepotrzebna rezerwacja stałej wysokości obrazu lightboxa na telefonie.
5. Rozdzielenie lightboxa na podgalerie: obecnie nawigacja obejmuje cały projekt.
6. Powielone metadane projektów i brak zgodności dawnych odnośników.

Brak znanych blokujących usterek w sprawdzonym zakresie. Review nie zastępuje testów na fizycznych urządzeniach i we wszystkich silnikach przeglądarek.

## Materiały i pomiary wymagające danych zewnętrznych
- Etap 5 wykorzystuje trzy istniejące rzuty koncepcyjne. Nie dostarczono rozwinięć ścian, detali wykonawczych ani dodatkowej dokumentacji zabudów; nie wygenerowano zastępczych rysunków.
- Nie dostarczono portfolio PDF, więc nie dodano pustego odnośnika pobierania.
- Nie ma reprezentatywnych pomiarów terenowych Core Web Vitals dla nowych adresów. Nie deklarujemy wyników LCP/INP/CLS ani wyniku Lighthouse. Sprawdzono responsywność, ładowanie i czynniki wydajności: mały wspólny CSS/JS, WebP, responsive images, lazy loading i rezerwację miejsca na obrazy. Pomiary terenowe wymagają danych po publikacji; nie dodano analityki ani nowej usługi do strony.
- Nie przeprowadzono testów na fizycznym iPhonie/Androidzie ani Safari. Weryfikacja mobilna dotyczy viewportu przeglądarki desktopowej.

## Publikacja i checkpoint
Potwierdzono GitHub Pages: historyczne zadania pages build and deployment oraz deployment github-pages z ref main i SHA 38b00bdb80113d5b5d2e893fc2377df2871e2171. CNAME i domena pozostają bez zmian.

Checkpoint produkcji: gałąź codex/checkpoint-2026-11-04-production na GitHubie, SHA 38b00bdb80113d5b5d2e893fc2377df2871e2171. Gałąź codex/checkpoint-2026-11-04-stage-2 zachowuje początkowy PR. Lokalnie istnieją też tagi checkpoint/2026-11-04-production i checkpoint/2026-11-04-stage-2, ZIP i pełny Git bundle poza katalogiem strony.

W razie potrzeby przywracamy checkpoint nowym commitem/PR-em, bez przepisywania historii main. Po merge można odwrócić commit scalający przez git revert -m 1 <SHA_MERGE>, sprawdzić podgląd, a następnie scalić PR cofający. Gałąź checkpointu pozostaje niezależną kopią sprzed modernizacji.

## Powtórzenie kontroli
Node.js 20.11+ i Git, bez instalacji zależności:

    node scripts/check-portfolio.mjs
    node scripts/check-portfolio.mjs http://127.0.0.1:8001/
    node --check portfolio/portfolio.js

Drugi wariant wymaga działającego serwera HTTP całego repozytorium. Na produkcji można podać https://izabelaswitaj.pl/ jako bazowy URL.
