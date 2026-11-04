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
