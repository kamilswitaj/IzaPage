# Audyt bazowy portfolio — 2026-11-04

## Cel i zakres
Etap 1: stan wyjściowy przed zmianą prezentacji /portfolio/. Etap 2 zmienia tylko wstęp i dodaje przegląd trzech projektów; pełne case studies i lightbox pozostają bez zmian.

## Repozytorium
- Statyczne HTML/CSS/JS; pliki: portfolio/index.html, portfolio/portfolio.css, portfolio/portfolio.js.
- Strona główna index.html poza zakresem tego PR.
- Istnieje CNAME wskazujący izabelaswitaj.pl. Nie weryfikowano ustawień deploymentu GitHub Pages.
- W portfolio są 3 rozbudowane projekty i 50 znaczników img (nie są to 50 odrębnych plików).
- Repozytorium zawiera 48 plików assets/gallery/*.webp.
- Początkowe źródła galerii: neomodernizm (diploma-*), Japandi (japandi-*), Leśny rytm (organic-*).
- Lightbox (portfolio.js) obsługuje: kliknięcia, Escape, strzałki i przywracanie fokusu.
- Istniejące meta robots: noindex, follow; zachowane bez zmiany.

## Statyczna walidacja na etapie przygotowania
- Obrazy i zasoby odwołujące się przez ../ w portfolio/index.html: 98 odwołań.
- Brakujące ścieżki zasobów w drzewie repozytorium: brak.
- Elementy img bez atrybutu alt: 0.
- Testu przeglądarkowego mobilnego, Core Web Vitals ani publikacji produkcyjnej NIE wykonano — wymagają środowiska podglądu.

## Zmiany etapu 2
- Zachowanie wszystkich trzech pełnych artykułów, ich opisów, galerii i przycisków lightbox.
- Dodanie CTA z pierwszego ekranu do listy projektów.
- Dodanie trzech kart z wizualizacją, krótkim opisem i odnośnikiem do pełnego projektu.
- Dodanie sekcji rozdzielającej szybki przegląd i pełne prezentacje.
- Delikatne ograniczenie pustej przestrzeni w hero; układ kart 3/2/1 kolumny.
- Nie zmieniano treści istniejących opisów ani kodu JS.

## Lista kontroli przed merge
- [ ] Karty renderują się na desktopie i telefonie.
- [ ] Kliknięcia kart przewijają do właściwych projektów.
- [ ] Lightbox: otwórz/zamknij, Escape, strzałki, fokus.
- [ ] Sprawdź czy obrazy w kartach ładują się i nie kadrują kluczowych elementów.
- [ ] Sprawdź linki w istniejących sekcjach oraz /portfolio/.
- [ ] Zweryfikuj brak regresji na stronie głównej.
- [ ] Upewnij się, że merge do main jest świadomą decyzją produkcyjną.

## Uzupełnienie weryfikacji lokalnej — 2026-11-04
- GitHub: dwie gałęzie (`main`, `feature/portfolio-stages-1-2`) i jeden otwarty PR (#1, Draft). Lokalna gałąź PR odpowiada SHA `92bb54a240b1eb52a3b7f3c4ff8c1b499b034142` przed poprawkami.
- Ponownie sprawdzono 117 odwołań src/href/data-lightbox-src: wszystkie lokalne zasoby i kotwice istnieją.
- Po dodaniu kart są 53 znaczniki img. Wszystkie obrazy treści mają niepusty alt; jedyny pusty alt należy do początkowo ukrytego obrazu lightboxa, uzupełnianego przez JS.
- Usunięto dodatkowy scroll-margin-top z artykułów: scroll-padding-top na html już uwzględnia przyklejony nagłówek (84 px, na telefonach 112 px). Oba odstępy wcześniej się sumowały.
- Podniesiono wersję CSS w HTML, aby przeglądarka pobrała poprawkę.
- Układ kart według CSS: 1440 px — 3 kolumny, 768 px — 2 kolumny, 390 px — 1 kolumna. To analiza reguł, nie wynik renderowania.
- Próba otwarcia podglądu przez narzędzie przeglądarkowe została odrzucona przez bramkę uprawnień. Nie wykonano zrzutów, kontroli kadrowania, przepełnienia, konsoli JS ani interakcyjnych testów lightboxa. Lista powyżej pozostaje do sprawdzenia.
- Repozytorium nie zawiera workflow wdrożenia. CNAME potwierdza nazwę domeny, ale nie dostawcę hostingu; ustawienia GitHub Pages pozostają niezweryfikowane.
- Zachowano istniejące noindex, follow. Decyzja o indeksowaniu należy do osobnego etapu SEO.
- Nie zmieniano strony głównej, tekstów projektów, galerii ani JS. Nie rozpoczęto etapu 3 i nie scalono PR.
