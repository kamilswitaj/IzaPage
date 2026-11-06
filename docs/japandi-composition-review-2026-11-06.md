# Japandi — whole-page composition review (2026-11-06)

The audit covered navigation, opening image, project heading, brief, plan, walkthrough, all rooms, documentation, pagination and contact. Previously the desktop content could reach 1736px at 1920px, while copy and headings followed different widths. Room wrappers combined 128px chapter spacing with extra padding/margins; moodboards and room descriptions shared row heights.

## Local composition system

- Visual container: maximum 1280px; editorial blocks: maximum 960px; paragraphs: maximum 68ch. All text sections share the left edge of the visual container, including navigation and contact.
- Concept block: independent left stack (Strefa dzienna, Kuchnia, Jadalnia, Salon i biblioteka) and right stack (two existing moodboards, centered, maximum 320px). Below 900px the stacks follow each other. A 240px moodboard-height perturbation does not move the descriptions.
- Visual blocks: equal two-column galleries, centered last odd image at one-column width; one column below 640px. Opening image maximum 960px and plan maximum 900px, centered and uncropped.
- Rhythm: 16px between paragraphs and below main headings, 28–40px between subsections/text and galleries, 56–80px between major sections. No artificial height matching.
- Local CSS is loaded after the shared documentation CSS. Shared styles, reader code, other projects, homepage, images and PDFs are unchanged in this commit.

## Verification

PASS: Chrome/Playwright at 1920, 1700, 1440, 1100, 768 and 390px. Full-page captures, complete sections and five section transitions per width; common axes, widths, independent stacks, centered odd frames, native proportions, no horizontal overflow or browser errors. Keyboard walkthrough/lightbox, Escape/focus restoration, 13 technical sheets, zoom and mobile reader scrolling passed. Approved paragraph and walkthrough snapshots and technical-card markup remain identical.

PASS: portfolio regression (4 pages, 171 references, 49 gallery positions, 82 HTTP 200 resources), technical-documentation checks, Neomodernizm hierarchy checks, HTML structure and git diff --check. Original 46-page PDF SHA-256: 6479329d4a88d9451027107f2a828b1a56bd6bc4b67e9108c11e6ea786d5fc27.

Local evidence: C:/dev/IzaPage-japandi-review/composition-review (results.json, metrics.json, screenshots). Preview: http://127.0.0.1:8022/portfolio/japandi/ . Screenshot gallery: http://127.0.0.1:8022/__review/composition/ . Evidence is local, outside the published site.

Existing branch and PR #9 updated through authorized GitHub API. No merge or production publication.
