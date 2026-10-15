# Design decisions

The decisions behind the redesign as built. The plan (`docs/archive/redesign/01-plan.md`) gives the original reasoning; `docs/archive/redesign/progress.md` has the log per stage; open questions are GitHub issues (functional) and rows in `offene-punkte.md` (non-functional); values are in `token-referenz.md`.

Target users: private landlords with little experience who use Dwello a few times a year. Every decision favours being understood and not making mistakes over speed for experts.

## Visual foundation

| # | Decision | Why | Where |
|---|---|---|---|
| D1 | Inter Variable, bundled locally; tabular figures for amounts, dates and tables. | Legible at 16 px, no external CDN. | `globals.css`, `tokens.css` |
| D2 | Type scale 14/16/18/20/24/30 px; body, inputs and help texts 16 px; 14 px only for badges and navigation group labels. Line height 1.5. | Readable for older users; few steps make the hierarchy obvious. | `token-referenz.md` |
| D3 | Neutral cool-grey base, one petrol-blue accent, three semantic colours (positive, caution, critical); text ≥ 7:1, accent and status text ≥ 6:1, UI boundaries ≥ 3:1. Status always has a word, alerts an icon and a title. | Calm administration look; AAA text; colour never alone. | `tokens.css`, `tokens.test.ts` |
| D4 | Dark mode follows the system setting (`prefers-color-scheme`), token overrides only, no toggle. Switched on in stage 8 when every screen used tokens; the axe check runs light and dark. | No half-dark screens during the migration; a toggle nobody asked for is not built. | `tokens.css` |
| D5 | 8 px grid (Tailwind's even steps only), two radii (6/12 px), two shadows (raised, overlay); panels have a border, not a shadow. Tailwind's colours, radii and shadows are replaced by the tokens. | Brief: few values, no shadow cards. The old palette cannot creep back. | `tailwind.config.js`, `design-guard.test.ts` |
| D7 | Lucide icons through one typed name map, stroke 1.75, sizes 16/20/24; icon-only buttons carry an accessible name. | One consistent line set that matches the illustrations. | `src/lib/ui/icons.ts`, `Icon.svelte` |
| D7a | The browser tab shows the header's house icon (Lucide `House`, stroke 1.75) in `accent`, the dark value inside the SVG under `prefers-color-scheme: dark`. | The tab names Dwello the way the header does; no second logo. | `static/favicon.svg`, `src/app.html` |
| D8 | Ten own line illustrations from the domain (building, apartment, contract, receipts, meter, statement, envelope, done, no results, problem), coloured by tokens, decorative unless they carry meaning. | ≥ 8 themeable domain motifs, no humans, no blobs. | `src/lib/ui/illustrations` |
| D9, D10 | Motion ≤ 200 ms for state changes only, off with `prefers-reduced-motion`. Controls 48 px high, visible 3 px focus outline everywhere. | Operability for touch, keyboard and older users. | `globals.css`, `tokens.css` |

## Screens and interaction

| # | Decision | Why |
|---|---|---|
| D11 | Labels above fields, help text with an example below the label, errors below the field and tied to it; "(optional)" in words. After a failed save the first faulty field gets the focus; a corrected field drops its error. | Users read top-down; help before input prevents errors; screen reader users hear what to fix. |
| D12 | One navigation level, grouped (Verwalten · Nebenkosten · Einstellungen und Hilfe); sidebar from 1024 px, drawer below; skip link. | Max. two levels. |
| D13 | Page anatomy: breadcrumb → title + one-sentence purpose → one primary action → content. Lists are rows or cards whose whole area is one link named by the record; no sideways scrolling on phones. | One primary action per screen; findable rows for touch and screen readers. |
| D14 | The Übersicht answers "Was ist jetzt zu tun?": tasks with reason, deadline and one button, then deadlines, then a compact building status – all from existing endpoints. | Anna's task: knowing what to do after months away. |
| D15, D15a | Guided wizards for Mietvertrag erfassen (Mieter → Wohnung → Vertragsdauer → Miete → Prüfen) and Abrechnungen erstellen (Abrechnungsperiode → Gebäude → Heizprofil und Verwaltungspauschale → Vorschau → Erstellen); back without loss, browser draft with visible save status, sensible prefilling. | Rare, high-stakes tasks need guidance; no backend draft entity may be added. |
| D16 | Plausibility checks in plain language with a way out (no invoices, partly covered period, existing statements, start date in the past, invoice date outside the period); they warn and ask for confirmation, never block what the backend allows. | Catch typical mistakes without changing business rules. |
| D17, D20 | Irreversible actions confirm with the real consequence; "Versenden" says that Dwello does not send anything itself and offers the PDF first. | The app never claims to do what it does not do. |
| D18, D19 | Save status on buttons, toasts that name what was saved or deleted, announced to screen readers; German copy with "Sie", verbs on buttons, errors say what happened and what to do; domain terms only from `UBIQUITOUS_LANGUAGE.md`. | Visible feedback; one name per thing. |

## Decided during the work

| When | Decision | Why |
|---|---|---|
| Stage 2 | Design guard and axe check as unit test and E2E feature instead of CI changes (`cy.yml` untouched). | Runs in the existing jobs; the workflow must not change. |
| Stage 5 | "Monatlich total" for Nettomiete + Zusatzmiete + Akonto (no glossary term). | Landlords want the total; marked TODO(fachlich prüfen). |
| Stage 5 | A Vertragsbeginn in the past is confirmed by a second "Weiter". | Common typo (wrong year) without blocking real back-dated contracts. |
| Stage 6 | The statement detail's send dialog shows recipient, Korrespondenzkanal and address and only marks the statement as sent. | Found that "Versenden" never delivered anything. |
| Stage 7 | Master data shown with their German names (`germanName`), English seed descriptions hidden. | Seed data must not change; English text confused personas. |
| Stage 7 | Vertragsstatus and Mietstatus derived with the backend's boundary (a contract still runs on its last day); "Wiedervermietet ab <Datum>" everywhere, counts that add up. | Three personas found contradictory statuses. |
| Stage 7 | `EarlySelect` for filters and forms that work before hydration; one `Pagination`; focus on the result count after a filter search. | Choices made while the page loads were lost; keyboard users lost their place. |
| Stage 8 | svelte-i18n and `docs/design_system.md` removed; the design guard has no exception list. | Dead code with old wording; the old system cannot come back unnoticed. |
| Session 11 | Every date field is `DateInput`: text TT.MM.JJJJ independent of the browser language, dots set by themselves, TT.MM.JJ and pasted JJJJ-MM-TT accepted, checked on leaving and on sending, the date in words below, a calendar button with the browser's picker; the form sends JJJJ-MM-TT. | The native date field showed the browser's format (MM/DD/YYYY in English browsers); Swiss users type 31.12.2025. |
| Stage 8 | Axe analyses from the top of the page. | A scrolled page slid a 48 px link under the sticky header and `target-size` judged the visible remainder. |
| Session 12 | The Verwaltungspauschale is always a percentage of the tenant's own Nebenkosten (the subtotal of the statement); the choice of a Verteilschlüssel for it is removed. Wizard, settings and help say «ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Üblich sind bis 3 %.»; the PDF says «x % der Zwischensumme von CHF y». | Product owner, after the Mieterinnen- und Mieterverband leaflet «Zulässige und unzulässige Nebenkosten» (2026): a «fester Prozentsatz der Nebenkosten» that the tenant checks on the own statement, more than 2–3 % need not be accepted. Glossary still to adjust; open points in `docs/archive/offene-punkte-verlauf.md` («Session 12»), requirement in `nebenkostenabrechnung-anforderungen.md`, reviews `docs/reviews/F-*.md`. |
| Session 12 | The Saldo (Nachzahlung and Rückerstattung) is rounded commercially to 5 Rappen (…1, …2 → …0; …3–…7 → …5; …8, …9 → next …0); line items, subtotal, fee and «Ihre Nebenkosten» stay exact. PDF and detail page show the amount before rounding, the rounding seen from that amount and the Saldo; the QR payment part carries the rounded Saldo. | Product owner: an amount the tenant can pay exactly in cash or by QR-bill. Reading top to bottom after persona Dr. Weber F2 (the sign confused on refunds). Not required by SIX; rounding against the tenant is an open point. Reviews `G-review-1.md`, `H-final-*.md`. |
| Session 12 | A statement whose Saldo is 0 is settled when it is marked as sent (status «Bezahlt» on that day); its PDF says that nothing is to pay and nothing comes back. | Rounding makes a Saldo of 0 frequent; it would otherwise become «Überfällig» and ask the landlord to check a payment that cannot come (final Fachreview V-1). |
| Session 12 | «Mietvertrag beenden» asks for the Vertragsende, the Kündigungstermin (no day proposed; never before the Vertragsbeginn). A past day, e.g. a notice recorded late, needs a checked confirmation that names since when the contract has ended; dates that change the billed Mietstage of a stored Nebenkostenabrechnung of the contract (fewer or more; the statement stores them as `rental_start`/`rental_end`) are refused by the backend, for «Beenden» and «Bearbeiten» alike (a draft is deleted first and created again). «Bearbeiten» asks for the same confirmation of a changed past end. Only a contract that has not started can be deleted; a running or ended one stays for the Nebenkostenabrechnung and is corrected under «Bearbeiten» (dialog and action). | Product owner: a tenant gives notice for a later day. Personas Helga, Sven and Anna (run I): a proposed «today» ended contracts by mistake. Fachreview I (IF-1, IF-3): a deleted contract loses its tenant's statement and turns his days into Leerstand; notices are often recorded late. Reviews `docs/reviews/I-review-*.md`. |
| Session 12 | The migrations are merged into `0001_schema.sql` and `0002_stammdaten.sql`; until the first installation changes go into these two files and local databases are rebuilt with `bun run db:reset`. | No productive database exists (product owner); a migration that rewrote older statements was rejected by the reviews. The old and the new chain were compared on scratch databases. |

## Anti-patterns (not used; most are caught by `design-guard.test.ts`)

Gradients, glow, blur/glassmorphism, emoji as icons, shadow cards everywhere, decorative bento grids, the old Tailwind palette, arbitrary values (`w-[…]`), `text-xs`, other radii or shadows, external fonts or icon fonts, lorem ipsum, hidden tooltips as the only help, colour as the only carrier of information.
