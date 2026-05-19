# Iza Świtaj - strona one-page

Statyczna strona HTML/CSS/JS dla projektantki wnętrz. Nie wymaga backendu ani płatnego silnika.

## Pliki

- `index.html` - treść i struktura strony
- `styles.css` - layout, kolory, responsywność
- `script.js` - mobilne menu, rok w stopce, stan nagłówka
- `assets/gallery/*.webp` - wybrane i zoptymalizowane prace z folderu `gallery`
- `assets/logo.svg` - proste logo/favikona
- `BOOKING.md` - rekomendacja i konfiguracja kalendarza konsultacji

## Hosting

Najprostsze opcje na start:

- Cloudflare Pages - bardzo dobre pod statyczne strony, darmowy plan, łatwe domeny i SSL.
- Netlify - proste wdrożenie przez przeciągnięcie folderu albo Git, darmowy plan.
- GitHub Pages - darmowo, dobre jeśli strona będzie w repozytorium.

Rekomendacja na tę stronę: Cloudflare Pages albo Netlify.

## IIS

Jeśli publikujesz na IIS, wrzuć razem ze stroną plik `web.config`. Dodaje MIME type dla `.webp`, bez którego IIS potrafi zwracać `404 Not Found` mimo że pliki są na serwerze.

## Umawianie konsultacji

Rekomendacja: Cal.com. Na stronie ustawiono link:

`https://cal.com/izabela-switaj/konsultacja-30-min`

Trzeba założyć konto i utworzyć taki typ spotkania albo podmienić link w `index.html`.

## Domeny do sprawdzenia u rejestratora

DNS nie zwrócił rekordów dla tych nazw w dniu 2026-05-17, ale dostępność trzeba potwierdzić przy zakupie:

- `izaswitaj.pl`
- `izaswitajwnetrza.pl`
- `switajwnetrza.pl`
- `pracowniaswitaj.pl`
- `switajinteriors.pl`
- `izaswitajinteriors.pl`

Najczystsza nazwa na start: `izaswitaj.pl`. Najbardziej opisowa: `izaswitajwnetrza.pl`.

## Następne dane do podmiany

- docelowe zdjęcia / wizualizacje do galerii
- link do kalendarza, jeśli powstanie w Calendly, Cal.com albo Google Calendar
- polityka prywatności po wyborze formularza lub analityki
- ewentualne social media
