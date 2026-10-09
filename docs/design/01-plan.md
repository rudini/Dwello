# 01 – Plan

Design decisions for the redesign, with rationale; token proposal; migration, test and terminology strategy. Builds on `00-analyse.md`. Binding requirements: `docs/REDESIGN_BRIEF.md`.

## 1. Guiding principles

The target user is a private landlord who opens Dwello once or twice a year, is unsure about the terms and afraid of legal or financial mistakes. Every decision below serves three questions the user must always be able to answer from the screen alone:

1. **Where am I?** – one page title, at most two navigation levels, breadcrumb on detail pages.
2. **What do I do next?** – one primary action per screen, a task list on the overview, wizards for the two complex jobs.
3. **What does this mean, and what happens if I click?** – visible help text with example at every domain field, plain-language plausibility checks, a summary/preview before anything is created or sent, a confirmation that names the consequence for irreversible actions.

## 2. Design decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Font: Inter (variable), served locally** from `@fontsource-variable/inter`, bundled by Vite. Tabular figures (`font-variant-numeric: tabular-nums`) on all amounts, dates and tables. | Large x-height, very legible at 16 px on screens, open apertures; has `tnum`. Local package satisfies "no external CDN". |
| D2 | **Type scale (rem, base 16 px):** 14 (meta, badges only), **16 (body, inputs, help texts)**, 18 (lead text, card titles), 20 (section titles), 24 (page section h2), 30 (page title h1). Line height 1.5 for text, 1.25 for headings. Weights 400/600/700. | Body and inputs ≥ 16 px; few steps keep hierarchy obvious. 14 px is never used for anything the user must read to act. |
| D3 | **Colour: neutral cool-grey base, one calm accent (deep petrol blue), four semantic colours** (positive, caution, critical, info = accent family). All as CSS custom properties in `src/styles/tokens.css`, exposed to Tailwind under new names. Body text ≥ 7:1 (AAA) on canvas/surface/sunken; accent and semantic text ≥ 6.4:1 on every background (AA, close to AAA – links on `accent-soft` use `accent-strong`, 9.5:1); UI boundaries ≥ 3:1; `line` is decorative only, never an input border. Colour never alone: status always has a word, alerts an icon and a title. | Administration/finance look, calm, no startup palette; AAA text helps older users. |
| D4 | **Dark mode** via `prefers-color-scheme: dark` (token overrides only, no toggle), **switched on in stage 8**, once every screen uses tokens. Until then the dark overrides are scoped to `:root[data-dark-ready]`, which is not set; the axe check runs light only and adds the dark variants in stage 8. | Old screens hard-code `bg-white`/`gray-*`; global dark tokens would make them unreadable mid-migration. A toggle is a feature nobody asked for. |
| D5 | **Spacing on an 8 px grid:** Tailwind's scale is kept but only even steps are allowed (`1` = 4 px for icon gaps, `2` = 8, `4` = 16, `6` = 24, `8` = 32, `10`, `12`, `16`, `20`, `24`). Guarded by a test. | Keeps Tailwind idioms; a guard test is cheaper than a custom scale and catches odd steps. |
| D6 | **Two radii:** `--radius-control` 6 px (buttons, inputs, badges, small surfaces) and `--radius-panel` 12 px (panels, dialogs). No `rounded-full` (step markers and avatars use the control radius). **Two shadows:** `--shadow-raised` (menus, toasts), `--shadow-overlay` (dialogs, drawer). Panels use a border, not a shadow. | Brief: max. 2 radii, 2 shadows, no shadow cards everywhere. |
| D7 | **Icons: Lucide** (`@lucide/svelte`), one `Icon` component with a typed name map (`src/lib/ui/icons.ts`), stroke width 1.75 everywhere, sizes 16/20/24. Decorative icons `aria-hidden`; icon-only buttons need an `aria-label` and a visible text label unless the action is universal (close ×, menu). | Consistent line icons that match the line illustrations; tree-shaken; replaces the Google ligature font. |
| D8 | **Illustrations:** own inline SVG components in `src/lib/ui/illustrations/`, 2 px line style, colours from tokens (`--illu-line`, `--illu-fill`, `--illu-accent`), viewBox 160×120. Motifs: Gebäude (house), Wohnung (door with number), Mietvertrag (key on document), Zähler (meter), Rechnungen (receipts), Abrechnung (document with sum), Versand (envelope), Erledigt (document with check), Keine Treffer (magnifier over empty sheet), Fehler (house with warning sign). Decorative by default (`aria-hidden`); meaningful use passes a `title`. | Brief: ≥ 8 domain motifs, themeable, consistent, no humans, no blobs. |
| D9 | **Motion:** only for state changes (dialog/drawer/toast in, ≤ 200 ms, opacity/translate); `prefers-reduced-motion: reduce` disables all transitions and animations globally. | Functional only. |
| D10 | **Touch targets ≥ 44 px:** buttons and inputs 48 px high (`h-12`), icon buttons 48×48, list rows as full-row links ≥ 48 px. Visible focus: 3 px `--color-focus` outline with 2 px offset on every interactive element (`:focus-visible`). | Brief operability; 48 px stays on the 8 px grid. |
| D11 | **Labels above fields, help text below the label and above the input** (visible, linked by `aria-describedby`), error text below the input with an icon, `aria-invalid`; optional fields marked "(optional)" in words, required fields unmarked (most fields are required). Inline validation on blur and on submit. | Users read top-down; help before input prevents errors; the word "optional" is clearer than an asterisk. |
| D12 | **Navigation:** left sidebar (desktop ≥ 1024 px) / drawer (mobile and tablet) with one level of items, visually grouped (Verwalten · Nebenkosten · Einstellungen und Hilfe). Kategorien, Verteilschlüssel and Heizprofile are sidebar items of the settings group, so `/config/heating-profiles/{id}/edit` is level 2, not 3. Detail and form pages are the second level (breadcrumb "Mieter › Anna Keller"). The header shows the app name, the user menu and on mobile/tablet the menu button. A skip link "Zum Inhalt springen" is the first focusable element. | Max. 2 levels; group headings are labels, not levels. |
| D13 | **Page anatomy:** breadcrumb (on level 2) → page title (h1) + one-sentence purpose → one primary action (top right on desktop, full width at the bottom on mobile) → content. Secondary actions are secondary buttons or in an "Weitere Aktionen" menu; destructive actions are danger-ghost buttons placed apart. | One primary action per screen. |
| D14 | **Overview ("Übersicht") replaces "Dashboard"** and answers "Was ist jetzt zu tun?": a task list (next task first, each with reason, deadline and one button), then deadlines, then a compact status of the buildings. The first-use guide becomes the first task list for new users. KPI tiles move below and shrink to the essentials. **Data sources (no backend change):** `/api/v1/dashboard` (counts) plus the existing list endpoints loaded in `+page.server.ts`: statements with status Entwurf ("versenden"), Überfällig ("Mahnung senden", with Zahlungsfrist), Versendet with Zahlungsfrist in the next 14 days (deadline list); documents with Versandstatus "zu versenden" ("Brief verschicken"); contracts with Vertragsende in the next 60 days (deadline list); set-up steps from the counts. The windows (14/60 days) and any derived rule such as "Abrechnung für die letzte Abrechnungsperiode erstellen" carry `TODO(fachlich prüfen)`. | Brief: dashboard answers what to do now; Anna's task. Only existing data, no invented legal deadlines. |
| D15a | **Defaults and prefilling:** Abrechnungsperiode = last completed period of the configured Abrechnungsperiode; Heizprofil = Standard-Heizprofil, Verwaltungspauschale = configured rate; contract wizard: Mieter/Wohnung prefilled from the page it was started from (`?tenant=`, `?apartment=`), Vertragsbeginn = day the Wohnung becomes free, "unbefristet" preselected; Korrespondenzkanal "Brief" and Sprache "Deutsch" in the tenant form (existing defaults). | Fewer decisions for a rare user; all values already exist in config or URL. |
| D15 | **Wizards** for "Mietvertrag erfassen" (Mieter → Wohnung → Vertragsdauer → Miete → Prüfen) and "Abrechnungen erstellen" (Abrechnungsperiode → Gebäude → Heizprofil und Verwaltungspauschale → Vorschau → Erstellen). Shared `Stepper` (progress, "Schritt 2 von 5", completed steps clickable), `WizardNav` (Zurück/Weiter, the last step names the action). State lives in one object, so "Zurück" never loses data; **intermediate saving** of the inputs in the browser (`localStorage`, versioned key per wizard, read only after hydration) with a visible save status ("Entwurf gespeichert, 14:32") and "Entwurf verwerfen"; the draft is deleted after a successful save and on logout, and on restore ids of Mieter/Wohnung/Gebäude that no longer exist are dropped with a notice. Personal data in browser storage is recorded in `offene-punkte.md` (DSG). A tenant can be created from within the contract wizard and the wizard continues with it. | Brief UX requirements; no backend draft entity exists and none may be added (no data model changes), so the draft is a per-browser convenience. |
| D16 | **Plausibility checks** in plain language with a suggested solution, e.g. "Für diese Abrechnungsperiode sind keine Rechnungen erfasst. Erfassen Sie zuerst die Rechnungen – sonst werden CHF 0.00 verteilt." with a link; Verwaltungspauschale above 3 % (existing rule); Akonto 0 in the contract ("Ohne Akonto bezahlt der Mieter alle Nebenkosten mit der Abrechnung."). Checks only read existing data; they never block what the backend allows. | Brief; no business logic change. |
| D17 | **Irreversible actions** (Löschen, Versenden, Vertrag beenden, Mahnung senden, Als bezahlt markieren) open a confirmation dialog whose title names the action and whose text names the real consequence, **verified against the backend service before writing** (e.g. `updateStatementStatus` only sets the status; `deleteStatement`/`updateStatement` refuse non-drafts; `reminder.service` stores a PDF and e-mails it or leaves it "zu versenden" by Korrespondenzkanal). Example for sending: "Die Abrechnung wird als versendet markiert. Stellen Sie sie Anna Keller per Brief zu (PDF herunterladen). Danach können Sie sie nicht mehr bearbeiten oder löschen." The confirm button repeats the verb ("Als versendet markieren"). Sending a statement newly gets this dialog. | Fear of mistakes; today "Versenden" fires immediately; the app never claims to deliver what it does not deliver. |
| D20 | **Document preview before generating:** the statement wizard result and the statement detail offer "PDF ansehen" (opens the generated PDF in a new tab) before "Als versendet markieren"; the Mahnung dialog shows recipient, Mahnstufe, Korrespondenzkanal and new Zahlungsfrist before sending. Contracts have no document; the wizard's "Prüfen" step is the summary before saving. | Brief "document preview before generating". |
| D18 | **Save status** on forms and wizards: button shows "Wird gespeichert …", success toast names what was saved, wizard shows the draft status. | Visible save status. |
| D19 | **Copy:** "Sie", short sentences, verbs on buttons ("Mietvertrag speichern", not "OK"), error messages = what happened + what to do. Domain terms exactly from the glossary. | Brief. |

## 3. Token proposal

Defined in `src/styles/tokens.css` (`:root` light, `@media (prefers-color-scheme: dark)` overrides), mapped in `tailwind.config.js` under new names so they never collide with the old palette during migration. Contrast ratios are checked by a unit test (`tokens.test.ts`).

### Colour (light / dark)

| Token | Tailwind name | Light | Dark | Use |
|---|---|---|---|---|
| `--color-canvas` | `canvas` | `#F5F7F8` | `#111518` | page background |
| `--color-surface` | `surface` | `#FFFFFF` | `#1A1F23` | panels, inputs, dialogs |
| `--color-surface-sunken` | `sunken` | `#EBEFF2` | `#242B30` | table header, muted areas, selected row |
| `--color-line` | `line` | `#D3DAE0` | `#3A444C` | dividers, panel borders (decorative) |
| `--color-line-strong` | `line-strong` | `#68747F` | `#8693A0` | input borders, checkbox borders (≥ 3:1) |
| `--color-ink` | `ink` | `#161C21` | `#ECEFF2` | text |
| `--color-ink-muted` | `ink-muted` | `#3F4A54` | `#B4BEC7` | secondary text (≥ 7:1) |
| `--color-accent` | `accent` | `#1B5873` | `#86BFDA` | primary buttons, links, active nav |
| `--color-accent-strong` | `accent-strong` | `#123F54` | `#B3D8EA` | hover/pressed |
| `--color-accent-soft` | `accent-soft` | `#E3EEF3` | `#172C37` | selected/active background, info alert |
| `--color-on-accent` | `on-accent` | `#FFFFFF` | `#0D1A20` | text on accent |
| `--color-positive` / `-soft` | `positive`, `positive-soft` | `#17542E` / `#E3F1E7` | `#8FD1A5` / `#1C3326` | success |
| `--color-caution` / `-soft` | `caution`, `caution-soft` | `#663E00` / `#FBF0DC` | `#F0C27A` / `#3A2C14` | warnings, plausibility |
| `--color-critical` / `-soft` | `critical`, `critical-soft` | `#8A1C24` / `#FAE6E7` | `#F4A3A8` / `#3D1D20` | errors, destructive |
| `--color-focus` | `focus` | `#1B5873` | `#F0C27A` | focus outline |

### Typography, spacing, shape, motion

| Token | Value |
|---|---|
| `--font-sans` | `'Inter Variable', system-ui, sans-serif` |
| `--text-sm/base/lg/xl/2xl/3xl` | 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 rem |
| `--leading-text` / `--leading-heading` | 1.5 / 1.25 |
| spacing | Tailwind steps 1, 2, 4, 6, 8, 10, 12, 16, 20, 24 (4 px … 96 px); 4 px only inside controls |
| `--radius-control` / `--radius-panel` | 6 px / 12 px |
| `--shadow-raised` / `--shadow-overlay` | `0 2px 8px rgb(0 0 0 / .12)` / `0 12px 32px rgb(0 0 0 / .24)` |
| `--size-control` | 48 px (buttons, inputs, icon buttons) |
| `--duration-fast` | 150 ms (max. 200 ms) |
| `--focus-ring` | `3px solid var(--color-focus)`, offset 2 px (never 0: in light mode the focus colour equals the accent) |
| `--color-disabled-ink` / `--color-disabled-surface` | ink-muted / sunken; disabled controls keep a visible border and `cursor: not-allowed` |
| `--illu-line`, `--illu-fill`, `--illu-accent` | ink-muted, sunken, accent |

## 4. Component set (new, in `src/lib/ui/`)

`Button` (primary, secondary, ghost, danger, danger-ghost; sizes control/compact; link or button; busy state), `IconButton`, `Icon`, `Field` (label, help with example, error, optional marker; renders the control via snippet), `TextInput`, `MoneyInput` (CHF prefix, tabular), `DateInput`, `Select`, `Textarea`, `Checkbox`, `RadioGroup` (card style for big choices), `Table` (caption, header, numeric columns right-aligned/tabular, responsive stacking on mobile), `Dialog` (modal, focus trap, Escape, return focus, consequence text, busy confirm), `Toast` + region, `Tabs` (roving tabindex, arrow keys), `Alert` (info/positive/caution/critical, icon + title + text + optional action), `EmptyState` (illustration, title, text, one action), `Stepper` (ol with `aria-current="step"`), `ProgressBar`/`Spinner` (with `role=progressbar`/`status` and a text), `Badge` (status word + icon/shape, never colour only), `Panel` (bordered surface with optional heading), `PageHeader` (breadcrumb, h1, purpose, primary action), `Breadcrumb`, `SaveStatus`, `AppShell` parts (`Sidebar`, `TopBar`, `MobileNav`). Old components in `src/lib/components/` are rewritten on the new primitives or deleted in stage 8.

## 5. Migration strategy

1. **Stage 2** adds tokens, font, Tailwind mapping and the new components *next to* the old system; nothing old is removed yet, so every intermediate commit builds and runs.
2. **Stages 4–7** migrate screens: shell and overview, the two wizards, then all remaining screens. A migrated file uses only new tokens and `src/lib/ui` components.
3. A **design guard test** (`src/__tests__/design-guard.test.ts`) scans `src/` for forbidden patterns: old palette/token classes (`gray-*`, `slate-*`, `blue-*`, `primary`, `text-dark` …), hex/rgb colours outside `tokens.css`, `text-xs`, odd spacing steps, gradients, `blur`/`backdrop-blur`/glow, emoji, `material-symbols`, external font/icon URLs. It holds an explicit list of not-yet-migrated files that shrinks every stage and must be empty after stage 8.
4. **Stage 8** removes the old palette and tokens from `tailwind.config.js`, the Google font imports and old utilities from `globals.css`, `docs/design_system.md`, unused old components and the `svelte-i18n` strings that only served the old header (if unused), and restricts Tailwind's colour/radius/shadow theme to the tokens (replace, not extend).
   The guard matches class tokens (`bg-primary`, `text-gray-500`, `rounded-xl`), not bare words, so a `variant="primary"` prop is no false positive. It also restricts `text-sm` (14 px) to `Badge` and meta components (never table cells, breadcrumbs or help texts), and spacing to the allowed steps including `gap-*`, `space-*`, `inset-*` and arbitrary values (`p-[13px]`).
   Beyond `src/`, the stage 8 checklist and the guard cover `tailwind.config.js` (old palette), `src/styles/globals.css`, `package.json` (svelte-i18n if unused), `static/`, `docs/design_system.md` and its links (CLAUDE.md, docs), and the old base components in `src/lib/components`.
   Fallow (commit hook and CI) blocks unused files/exports; new components are always committed together with their DOM test (a test import counts as a consumer) and adopted by a screen in the following stage. No fallow ignores are added.
5. `data-testid`s survive wherever the element survives, so E2E steps keep working; where behaviour changes on purpose (overview, wizards, send confirmation, renamed terms), the Gherkin scenario is changed first (ATDD).

## 6. Test strategy

| Layer | What | Tool |
|---|---|---|
| Pure logic (TDD) | wizard state (steps, back without loss, draft save/restore), overview task list and deadlines, plausibility checks, token contrast ratios, help-text registry | Vitest (node) |
| Components (TDD) | every `src/lib/ui` component: states, interaction, roles, labels, `aria-*`, focus behaviour (dialog trap/return, tabs arrows, stepper current step) | Vitest + jsdom (`*.dom.test.ts`) |
| Guard | forbidden patterns / remnants (see 5.3), illustration count and `aria-hidden`/title rules | Vitest (node) |
| Acceptance | existing 41 features kept green; new/changed scenarios for overview tasks, contract wizard, statement wizard steps, send confirmation | Playwright-BDD, `npm run test:e2e` |
| Accessibility | **axe check** (`@axe-core/playwright`, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`) over every screen and state of `tests/a11y/screens.json`, desktop 1440×900 and mobile 390×844, light and dark | Feature `tests/e2e/features/accessibility.feature` (Szenariogrundriss, one example per screen; the steps read `screens.json`, set up the states and run axe in all four variants). Runs in the existing `chromium` project, i.e. in CI's E2E job without changing the workflow. A unit test asserts that the feature's examples and `screens.json` list the same screens. |
| Manual/agent | keyboard order, label quality, understandability | reviewers and personas |

Variants: desktop 1440×900, tablet 820×1180 and mobile 390×844 in light; dark variants from stage 8 (D4). **One example per screen × state** (viewport/scheme loop inside, step timeout raised with `testInfo.setTimeout`), so the 30 s default test timeout is not hit. On pushes to `main` the firefox/webkit projects would rerun the check; they get `grepInvert: /@a11y/` in `playwright.config.ts` (the workflow file stays untouched).

States "empty" (no records at all) and "first-use" (no buildings yet) cannot be produced in the shared E2E database (scenarios run in parallel). They are covered by DOM tests of the pages' empty branches plus the browser axe check of the same `EmptyState` component in the "filtered-empty" state; recorded in `offene-punkte.md`.

## 7. Help texts and terminology

- One registry `src/lib/help-texts.ts`: per glossary term the plain-language help text (derived from the definition, meaning unchanged) and an example from realistic content (Musterstrasse, Grundsteuer, Wasser, Müll). Fields take their help from the registry, so the same term is explained the same way everywhere. Entries without glossary basis carry `todo: 'fachlich prüfen'` and a `TODO(fachlich prüfen)` comment, and are listed in `offene-punkte.md`.
- Examples of planned help texts (from the glossary):
  - **Nettomiete:** "Die monatliche Miete ohne Nebenkosten, in CHF. Beispiel: 1'650.00"
  - **Akonto:** "Monatlicher Vorschuss des Mieters für die Nebenkosten. Er wird mit der Nebenkostenabrechnung verrechnet. Beispiel: 180.00"
  - **Zusatzmiete:** "Zusätzliche monatliche Kosten, zum Beispiel für Garage, Parkplatz oder Keller. Leer lassen, wenn es keine gibt."
  - **Abrechnungsperiode:** "Zeitraum, für den Sie die Nebenkosten abrechnen, z. B. Kalenderjahr (01.01.–31.12.), Juli–Juni oder November–Oktober."
  - **Heizprofil:** "Verteilt die Heizkosten in Prozent auf die 12 Monate. Zieht ein Mieter während der Abrechnungsperiode ein oder aus, werden seine Heizkosten so nach Monaten statt nach Tagen berechnet – im Winter wird mehr geheizt als im Sommer."
  - **Verwaltungspauschale:** "Abgeltung Ihres Aufwands für die Nebenkosten: ein Prozentsatz der Nebenkosten der Liegenschaft. 3 % ist der übliche Richtwert, keine Obergrenze."
- Renames of section 6 of the analysis are applied when the screen is migrated; terms are never renamed to please a persona – unclear terms get better help texts.
- UI-only words that are not domain terms (Übersicht, Einstellungen, Entwurf speichern …) are plain German; gaps go to `offene-punkte.md`.

## 8. Illustrations: where they appear and what they lead to

| Motif | Screen / state | Next step offered |
|---|---|---|
| Gebäude (house) | Gebäude list empty; Übersicht first use | "Gebäude erfassen" |
| Wohnung (door) | Wohnungen list empty; building detail without apartments | "Wohnung erfassen" |
| Mietvertrag (key on document) | Mietverträge list empty; contract wizard result | "Mietvertrag erfassen" / "Mietvertrag ansehen" |
| Zähler (meter) | Heizprofile / Verteilschlüssel lists, statement wizard intro | "Abrechnungen erstellen" |
| Rechnungen (receipts) | Rechnungen list empty; plausibility "keine Rechnungen" | "Rechnung erfassen" |
| Abrechnung (document with sum) | Nebenkostenabrechnungen list empty | "Abrechnungen erstellen" |
| Versand (envelope) | Dokumente list empty | "Zur Übersicht" |
| Erledigt (document with check) | wizard completion; Übersicht with no open tasks | "Abrechnungen ansehen" / none needed |
| Keine Treffer (magnifier) | any filtered-empty list | "Filter zurücksetzen" |
| Fehler (house with warning sign) | error page 404/500, failed load | "Zur Übersicht" / "Erneut versuchen" |

## 9. Stage plan with acceptance

| Stage | Output | Done when |
|---|---|---|
| 2 | `tokens.css`, font, Tailwind mapping, `src/lib/ui` components with DOM tests, design guard test, `accessibility.feature` + steps + `screens.json` consistency test, `@axe-core/playwright` | checks green, axe green on all screens as they are (old screens fixed only where axe fails), review |
| 3 | `Icon` + Lucide map, 10 illustrations, gallery in DOM tests | guard counts ≥ 8 illustrations, review |
| 4 | app shell, navigation, Übersicht with task list/deadlines, error page, login | scenarios green, Anna + Helga |
| 5 | contract wizard incl. inline tenant creation and draft saving | scenarios green, all personas |
| 6 | statement wizard with plausibility checks, send confirmation, PDF preview access | scenarios green, all personas, checkpoint |
| 7 | all remaining screens | guard list nearly empty, personas |
| 8 | old system removed | guard list empty, Explore remnant review |
| 9 | docs + CLAUDE.md "Design-Regeln" | final review, all personas, axe all screens |
