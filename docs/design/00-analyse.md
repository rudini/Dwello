# 00 – Analysis of the current UI

Stage 0 of the redesign (brief: `docs/REDESIGN_BRIEF.md`). Inventory of what exists today, what users struggle with, and how the CI screenshot job works. The design documents are written in English like the rest of `docs/`; UI copy is quoted in German.

## 1. Stack and current design system

- SvelteKit 2 + Svelte 5 (runes), Tailwind CSS 3, TypeScript. Server-side loads in `+page.server.ts`, BFF in `src/routes/api`, backend Elysia (`backend/`).
- **Tokens:** five colours in `tailwind.config.js` (`primary #135bec`, `success`, `text-dark`, `text-secondary`, `border-light`) plus seven CSS variables in `src/styles/globals.css`. In practice most components use raw Tailwind palette classes (`gray-*`, `slate-*`, `blue-*`, `green-*`, `amber-*`, `red-*`, `purple-*`, `orange-*`, `sky-*`), so there is no real token discipline.
- **Typography:** Manrope from Google Fonts (external CDN), body text mostly 14 px (`text-sm`), labels 12–14 px, captions 10–12 px. No tabular figures.
- **Icons:** Material Symbols as a ligature font from Google Fonts (external CDN) via `Icon.svelte`; a few inline SVGs (chevron in the user menu, provider logos on the login page).
- **Illustrations:** none. Empty states are an icon in a coloured circle.
- **Radii/shadows:** `rounded`, `rounded-lg`, `rounded-xl`, `rounded-full`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` mixed freely.
- **Documentation:** `docs/design_system.md` (describes the above).
- **i18n:** `svelte-i18n` with `de.json`/`en.json`, used only in the header and the login page; all other copy is hard-coded German.

## 2. Screen inventory

All routes under `src/routes` with a `+page.svelte`. "States" lists what the page renders besides the normal filled state.

| Area | Route | Purpose | States today |
|---|---|---|---|
| Public | `/login` | Sign in with Google/Microsoft | error (`login-error`) |
| Public | `/` | Redirect to `/dashboard` | – |
| Shell | `+layout.svelte`, `+error.svelte` | Header, sidebar, mobile drawer, footer, toasts; error page (404/403/500) | error |
| Dashboard | `/dashboard` | Getting-started checklist, quick actions, KPI tiles (portfolio, finance), statement status tiles, activity feed, occupancy per building | first-use (checklist), empty activity |
| Buildings | `/buildings`, `/buildings/new`, `/buildings/[id]`, `/buildings/[id]/edit` | List (cards), form with address search and map, detail with apartments and mini map | empty, validation errors, delete dialog, delete error |
| Apartments | `/apartments`, `/apartments/new`, `/apartments/[id]`, `/apartments/[id]/edit` | List with filters, form, detail with current tenant, monthly costs, contract history | filtered empty, vacant, future tenant, validation |
| Tenants | `/tenants`, `/tenants/new`, `/tenants/[id]`, `/tenants/[id]/edit` | List with search/filter, form (contact, address, language, correspondence channel), detail with rental and documents | empty, validation, delete dialog |
| Contracts | `/contracts`, `/contracts/new`, `/contracts/[id]`, `/contracts/[id]/edit` | List with filters, **single long form** (tenant, apartment, period, rent), detail with end/terminate actions | empty, validation, overlap warning, availability notice, running-contract warning |
| Invoices | `/invoices`, `/invoices/new`, `/invoices/[id]`, `/invoices/[id]/edit` | List with filters and pagination, form with AI categorisation, detail with recategorisation | empty, AI unavailable, categorisation pending/error, validation |
| Statements | `/statements`, `/statements/generate`, `/statements/[id]`, `/statements/[id]/edit` | List with status filter, **4-step wizard** (period+heating profile+fee, buildings, preview, create), detail with line items, PDF, send, reminders, mark paid, delete | empty, preview empty, generating, created, reminder modal, mark-paid modal, delete modal, action error |
| Documents | `/documents` | Reminders (letters/e-mails) with "mark as sent" | empty |
| Settings | `/config` and `/config/categories`, `/config/distribution-keys`, `/config/heating-profiles` (each list/new/edit, profiles also detail) | Company data, IBAN, defaults; master data | validation, formula test result, profile sum ≠ 100 % |
| Info | `/help`, `/privacy`, `/terms` | Help text, privacy, terms | – |
| Placeholder | `/analytics`, `/reports` | "kommt in Phase 2" pages, not linked from the navigation | coming soon |

In total 43 pages (incl. login and redirect), 55 shared or route-local Svelte components.

## 3. Component inventory (functional requirements to carry over)

| Component | Functional requirements kept | Look replaced |
|---|---|---|
| `Button` | variants primary / secondary / danger / ghost / icon, link or button, `formaction`, disabled, `data-testid`, `reload` | yes |
| `Card`, `InfoCard`, `StatCard` | surface with padding; label/value pair; KPI with link | yes |
| `Modal`, `ConfirmDeleteDialog` | `role=dialog`, `aria-modal`, focus trap, Escape, return focus, loading state | yes |
| `Toast`, `ToastContainer` | four types, dismiss, live region | yes |
| `Badge`, `StatusBadge` | status label with colour + dot (text always present) | yes |
| `TextField`, `FieldError`, `FormActions`, `MoneyField`, form selects | label, required marker, error text with `form-error` test id, submit busy state | yes |
| `FilterSelect`, `FilterActions`, `SearchField`, `Pagination`, `ListPagination` | URL-driven filters, pagination | yes |
| `Header`, `Navigation`, `NavLinks`, `MobileNav`, `Footer`, `PageTrail` | grouped main menu, active state, user menu with logout, mobile drawer with focus trap, breadcrumb | yes |
| `WizardProgress`, `WizardNavigation`, `WizardStep` (statements) | step indicator, back/next, server step | yes, generalised into `Stepper` |
| Charts (`HeatingProfileChart`, `OccupancyChart`), `BuildingMiniMap`, `AddressSearch` | data display, map (Leaflet), address lookup (openplz) | restyled only |
| `Icon` | Material Symbols ligature font from Google | replaced by a local, consistent set |

## 4. Core flows

1. **First setup:** building → apartments → tenant → rental contract (dashboard "Erste Schritte" links to the four forms; there is no guided flow across them).
2. **Rental contract:** `/contracts/new` – one form with tenant select, apartment select (with availability), period, three money fields; tenants must exist beforehand (no inline creation).
3. **Invoices:** `/invoices/new` – upload/enter invoice data, AI suggests a category.
4. **Utility statement run (Abrechnungslauf):** `/statements/generate` – period + heating profile + management fee, buildings, preview, create; then each statement is sent, PDF generated, paid or reminded on its detail page.
5. **Returning user:** dashboard → KPI tiles and status tiles → lists.

## 5. The five biggest comprehension barriers (target group: private landlords, rare use)

1. **No answer to "what do I do now?"** The dashboard shows eleven KPI tiles, four status tiles, quick actions and charts with equal weight. Deadlines (Zahlungsfrist, overdue statements, letters still to send) are not listed as tasks; a returning user must interpret numbers.
2. **Wrong and unexplained terms in the rental contract form.** The field labelled "Nebenkosten Akonto" writes the *Zusatzmiete* and "Parkplatz / Sonstiges" writes the *Akonto* (labels swapped relative to the data model and the glossary). No field explains what Nettomiete, Akonto or Zusatzmiete mean; "Total Bruttomiete" is not a glossary term.
3. **The statement run asks for expert inputs without explanation.** "Heizungsprofil", "Verwaltungspauschale", "Verteilung der Pauschale" appear without plain-language help; the preview only shows totals per contract, the warnings ("Verteilschlüssel müssen konfiguriert sein") are generic and not actionable.
4. **Small, low-contrast text and many equal-weight actions.** Body text 14 px, captions 10–12 px in `gray-400/500`; detail pages show up to six buttons side by side (PDF, Mahnung, bezahlt, versenden, bearbeiten, löschen) with no single primary action.
5. **Irreversible actions without clear consequences.** "Versenden" on a statement submits immediately without a confirmation or a preview of the document; deleting asks for confirmation but does not say what happens to related data.

## 6. Term inventory (UI vs. `UBIQUITOUS_LANGUAGE.md`)

Deviations found in the current UI; the new UI uses the glossary term.

| Current UI | Where | Glossary term | Action |
|---|---|---|---|
| "Nebenkosten Akonto" (on `additionalRent`) | `contracts/RentFields.svelte` | **Zusatzmiete** | relabel (label bug, no logic change) |
| "Parkplatz / Sonstiges" (on `advancePayment`) | `contracts/RentFields.svelte` | **Akonto** | relabel |
| "Mietzins" (section heading, list column, help) | contract form, contract list, help | **Nettomiete** (glossary: "Auch: Mietzins"; no synonyms in the UI) | use "Nettomiete" |
| "Total Bruttomiete" | contract form | – (gap) | keep sum, label "Monatlich total" marked TODO(fachlich prüfen) |
| "Heizungsprofil" | statement wizard | **Heizprofil** | rename |
| "Periode Start" / "Periode Ende" | statement wizard | **Abrechnungsperiode** (Beginn/Ende) | rename |
| "Verwaltungsgebühr" | statement detail | **Verwaltungspauschale** | rename |
| "Miettage im Zeitraum" | statement detail | **Mietstage** | rename |
| "NK-Abrechnungen", "Akontozahlungen" | dashboard quick action, statement pages | **Nebenkostenabrechnung**, **Geleistete Akontobeiträge** | rename |
| "Verträge" (navigation, help) | navigation, help | **Mietvertrag** → "Mietverträge" | rename |
| "Liegenschaften" (navigation group), "Portfolio" | navigation, dashboard, building form | **Gebäude** (Liegenschaft is a synonym; no mixing) | use "Gebäude"; "Portfolio" removed |
| "Belegungsrate" | dashboard | – (gap) | keep as "vermietet" share, TODO(fachlich prüfen) |
| "Dashboard" | navigation, page title | – (not a domain term) | "Übersicht" (plain German) |
| "Konfiguration" / "Einstellungen" (both) | navigation vs. page title | glossary section "Konfiguration" | one label: "Einstellungen" (page) – TODO(fachlich prüfen) whether the glossary heading is meant as UI label |
| "AKTIV" (tenant badge, upper case) | tenant list | **Mieter** aktiv / ehemalig | "Aktiv" |

Terms used correctly today and kept: Gebäude, Wohnung, Wohnungsnummer, Stockwerk, Fläche, Zimmeranzahl, Mietstatus values (Vermietet, Wiedervermietet, Leer, Gesperrt), Mieter, Korrespondenzkanal, Mietvertrag, Vertragsbeginn, Vertragsende, Nettomiete, Akonto, Rechnung, Lieferant, Rechnungsnummer, Rechnungsdatum, Betrag, Fälligkeitsdatum, Kategorie, Umlagefähig, Verteilschlüssel, Heizprofil (config pages), Nebenkostenabrechnung, Abrechnungsperiode, Abrechnungsposition, Verwaltungspauschale (wizard), Saldo, Entwurf/Versendet/Bezahlt/Überfällig, Zahlungsfrist, Mahnung, Mahnstufe, Dokument, Versandstatus, QR-Rechnung, IBAN.

Gaps (terms the UI needs that the glossary does not define) are listed in `offene-punkte.md` as glossary proposals.

## 7. CI: the `ui-screenshots` job

- **File:** the brief names `.github/workflows/cy.yml`; the repository has **`.github/workflows/ci.yml`**, which contains the job `ui-screenshots`. Treated as the meant file; not changed.
- **Trigger:** `pull_request` (default types: opened, synchronize, reopened) and only for branches of the same repository. **No draft condition** – the job also runs on draft PRs, so `gh pr ready` is not needed.
- **What it captures:** `tests/ui-screenshots/affected-routes.ts` maps the changed files of the PR (`git diff origin/main...HEAD`) to the routes whose page, layout or (transitively) imported modules changed. A change to `src/app.html`/`hooks` or the root layout captures every page. `screenshots.spec.ts` seeds one building, apartment, tenant, contract, invoices, heating profile, statement, category and distribution key through the backend API and shoots each route full-page at 1440×900 (desktop only), signed in.
- **Baseline and comparison:** the base branch is checked out into `../base` and served on port 3200 against the same backend and data; `changed-areas.ts` frames changed regions in red on the new screenshot; the "before" image is kept.
- **Result:** PNGs are pushed to the orphan branch `ui-screenshots` under `pr-<n>/<sha>/`, and a single PR comment (marker `<!-- ui-screenshots -->`) is created or updated with after/before images per route. The job fails only if seeding, servers or the browser fail, not on visual differences.
- **Consequences for the redesign:** every redesign commit touches the layout, so every page is captured. Mobile viewport and dark mode are not captured; the axe check covers them instead (suggestion recorded in `offene-punkte.md`). Pages without `+page.svelte` states (dialogs open, wizard steps) are not captured; the axe screen list covers them.

## 8. Other observations

- External requests at runtime: Google Fonts (Manrope, Material Symbols) – violates the brief's "no external CDNs"; replaced by local assets. The building map loads OpenStreetMap tiles and the address search calls openplz.api – functional features, not design; kept and noted in `offene-punkte.md`.
- Accessibility today: skip link exists; modals and drawer trap focus; labels mostly present. Problems: many text colours `gray-400/500` on white (below 4.5:1 for small text), touch targets of 32 px (`p-1` close buttons, `size-8` icons), no `prefers-reduced-motion`, status conveyed by colour dots plus text (fine), focus rings partly removed (`focus:outline-none` with ring only on some elements).
- Test landscape: 481 Vitest unit/DOM tests, 41 Gherkin features (Playwright-BDD) relying on `data-testid` selectors. The redesign keeps all `data-testid`s where the element survives, so most scenarios stay valid.

## 9. Screen list for the axe check

Kept in `tests/a11y/screens.json` (routes, the states to open, the viewports). Stage 2 adds the Playwright test that reads it.
