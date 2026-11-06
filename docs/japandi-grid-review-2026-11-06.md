# Japandi — wspólna siatka i prezentacja pomieszczeń

Gałąź: `codex/japandi-complete-presentation`, PR #9.
Punkt wejścia: `b787876db3dbcb4ca25b822ceead73db2d056961`.
Wzorzec geometrii: `origin/main` po PR #14,
`e433d7a4916ac1035b313ca0cac14ddc97e4a151`.
Nie scalano main do gałęzi i nie edytowano innych worktree.

## Analiza przed implementacją

Istniejące materiały: pięć wizualizacji otwartej strefy dziennej, dwa wspólne
moodboardy, dwa ujęcia sypialni, dwa łazienki, jedno WC i rzut 3D.
Łącznie 13 pozycji lightboxa. Hol i garderoba nie mają osobnych wizualizacji.
Dotychczas pięć kadrów dziennych było rozdzielonych pomiędzy kuchnię (2),
jadalnię (2) i bibliotekę (1), a biblioteka miała dodatkowo nierówne kolumny.

Z Neomodernizmu przyjęto geometrię dwóch równych kolumn, odstęp
`clamp(20px, 3vw, 36px)`, centrowanie moodboardu względem prawej kolumny oraz
centrowanie nieparzystego końcowego kadru przy zachowaniu szerokości jednej kolumny.
Reguły zapisano wyłącznie w lokalnym CSS Japandi.

## Rezultat

- Wszystkie nagłówki projektu mają wspólną lewą oś. Opisy zajmują pierwszą kolumnę.
- Materiałowy moodboard pokazano przy koncepcji kuchni, z zachowaniem podpisu
  wskazującego wspólną paletę. Stylistyczny moodboard jest przy bibliotece.
  Jadalnia nie otrzymała fikcyjnego moodboardu.
- Opisy kuchni, jadalni i biblioteki poprzedzają wspólną galerię pięciu kadrów:
  otwarta przestrzeń, zabudowa kuchenna, jadalnia, półwysep, biblioteka.
  Nie powtórzono żadnego kadru w galerii.
- Sypialnia i łazienka: po dwa obrazy w równych kolumnach.
  WC: jeden wyśrodkowany obraz o szerokości kolumny.
  Piąty kadr strefy dziennej jest wyśrodkowany w osobnym rzędzie.
- Na telefonie obrazy układają się w jednej kolumnie.
- Otwarcie zachowuje pełny obraz bez przycinania, maksymalnie 1000 px szerokości.
  H1 ma ograniczoną skalę i tę samą lewą oś co pozostałe nagłówki.
  Rzut 3D jest wyśrodkowany i ograniczony do 900 px.
- Zatwierdzone opisy i cały narracyjny spacer są niezmienione.
- Dokumentacja techniczna, czytnik i PDF pozostają niezmienione.
  Nie zmieniono żadnych grafik ani dokumentów źródłowych.

## Weryfikacja

`scripts/check-japandi.cjs`: PASS w zainstalowanym Chrome / Playwright dla
1920, 1700, 1440, 1100, 768 i 390 px. Automatyczne pomiary osi, szerokości
kolumn, środka moodboardów, centrowania pojedynczych/nieparzystych obrazów,
proporcji, rzutu i otwarcia mają tolerancję 1 px dla zaokrągleń przeglądarki.
Bez poziomego overflow i błędów JS/HTTP.

Sprawdzono także zachowanie tekstów, hierarchię H1–H4, natywne details
z klawiatury, lightbox, Escape i powrót fokusu, wszystkie 13 arkuszy,
zoom, przewijanie klawiaturą i oryginalny hash PDF.

Pozostałe kontrole:

- `scripts/check-portfolio.mjs`: PASS; 4 podstrony, 171 odwołań,
  49 zachowanych pozycji galerii, 82 zasoby HTTP 200.
- `scripts/check-technical-documentation.mjs`: PASS.
- `scripts/check-neomodernizm-hierarchy.py`: PASS.
- Kontrola zagnieżdżenia HTML i powtórzonych atrybutów: PASS.
- `git diff --check`: PASS.
- Neomodernizm, Leśny rytm, strona główna, wspólne CSS/JS i zasoby:
  bez zmian względem punktu wejścia.

Pełne zrzuty wymaganych sekcji wykonano dla wszystkich sześciu szerokości.
Zrzuty ukrywają wyłącznie sticky header i skip link, aby nie zasłaniały treści;
nie zmienia to działającej strony. Testy używają ograniczonego ruchu,
aby przewijanie nie wpływało na pomiary i obszar zrzutu.

Podgląd: http://127.0.0.1:8022/portfolio/japandi/?review=grid-final

Galeria pełnych sekcji z wyborem szerokości:
http://127.0.0.1:8022/__review/grid/

Lokalne wyniki, pomiary i zrzuty: `C:/dev/IzaPage-japandi-review/grid-review/`.
Bez merge i publikacji.
