# Portfolio — zasady dla Codexa

**Każdy nowy projekt portfolio musi być tworzony na podstawie wspólnego szablonu i korzystać ze wspólnego systemu hero.** Nie implementuj od podstaw osobnej sekcji tytułowej dla każdego projektu.

## Tworzenie podstrony

- Szablon: `templates/portfolio-project/index.html`.
- Przygotuj plik JSON zgodnie z przykładem w `README.md`.
- Sprawdź dane bez zapisu: `node scripts/create-project.mjs dane.json --check`.
- Utwórz stronę: `node scripts/create-project.mjs dane.json`.
- Generator zapisuje wyłącznie `portfolio/<slug>/index.html`, nie zmienia istniejących projektów ani nawigacji portfolio. Następnie przygotuj indywidualne treści sekcji. Nie publikuj pustego szkicu jako gotowego projektu.

## Wspólny kontrakt hero

- Arkusz `portfolio/project-heading.css` musi być ostatnim lokalnym CSS strony, po `portfolio.css` i ewentualnym CSS narracji.
- Zachowaj `body.case-page`, `main > .case-cover > img`, `.projects.case-content > article.project`.
- `.project-heading` zawiera lewą `.project-number` i prawą `.project-intro`.
- `.project-intro` zawiera kolejno `h1`, `.project-style`, `.project-software`, `.project-tags`, `.project-index`.
- Nawigacja `.project-index` jest pod metadanymi, wewnątrz `.project-intro`; kotwice prowadzą do istniejących sekcji. `.project-story` następuje po nagłówku.
- Nie dodawaj lokalnych szerokości, proporcji, marginesów, układu kolumn ani fontów hero. Nie nadpisuj `--project-inset` i `--project-gap`. Zmiany standardu wprowadzaj we wspólnym CSS i sprawdzaj na wszystkich projektach.
- Tytuł jest tekstem: bez `<br>`, blokowania zawijania i wymuszania liczby wierszy. Obraz ma opis i rzeczywiste wymiary źródła; proporcje wyświetlania kontroluje wspólny CSS.
- Istniejące wyjątki dotyczą wyłącznie braku nawigacji Neomodernizmu i Leśnego rytmu oraz braku tagów Leśnego rytmu. Nie rozszerzaj tych wyjątków na nowe projekty ani nie przebudowuj zaakceptowanej narracji przy zmianie hero.

## Co można indywidualizować

Tytuł, slug, numer i etykietę, styl, oprogramowanie, metadane, opis SEO, obraz i jego alt oraz listę i nazwy sekcji. Narrację, galerie, moodboardy i dokumentację przygotuj według potrzeb i zaakceptowanych materiałów projektu. Nie kopiuj zawartości niezakończonych gałęzi. Nawigację portfolio i sitemapę aktualizuj osobno, gdy dodanie konkretnego projektu jest autoryzowane.

## Wymagana weryfikacja

1. `node --test scripts/project-template.test.mjs` — generator, tryb bez zapisu i przypadki naruszenia kontraktu.
2. `node scripts/check-portfolio.mjs` — automatycznie wykrywa wszystkie podstrony i uruchamia również `check-project-template.mjs`; sprawdza hero, zasoby i odnośniki.
3. `node scripts/check-technical-documentation.mjs` — zachowanie istniejącej dokumentacji.
4. Przy dodawaniu projektu lub zmianie hero: `node scripts/check-project-headings.cjs` (dostępny Playwright i Chrome; opcjonalnie `PLAYWRIGHT_MODULE` i `REVIEW_OUTPUT`). Porównaj wszystkie projekty przy 1700, 1440, 768 i 390px. Sprawdź osie, odstępy, zawijanie i brak overflow.

Pierwsze trzy kontrole wykonuje `.github/workflows/portfolio.yml` dla PR i zmian na `main`; nie dodawaj wyjątków omijających test dla nowego projektu. Sam workflow nie konfiguruje ochrony gałęzi na GitHubie.
