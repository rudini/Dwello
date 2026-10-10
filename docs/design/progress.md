# Redesign progress

Brief: `docs/REDESIGN_BRIEF.md`. Resume rules: `docs/design/arbeitsregeln.md`.

## Status

| Stage | Status | Review | Axe | ui-screenshots |
|---|---|---|---|---|
| 0 Analysis | done | 1 round, 3 Majors fixed (`reviews/0-review-1.md`) | n/a (test from stage 2) | docs-only push: job skips its steps (no routes) |
| 1 Plan | done | 1 round, 6 Majors fixed (`reviews/1-review-1.md`) | n/a | docs-only push: job skips its steps |
| 2 Tokens + base components + axe | done | 2 rounds (`reviews/2-review-1.md`, `2-review-2.md`), all Majors fixed | 79 examples, 0 violations | passed (afcda10, e62b6cf) | | | |
| 3 Icons + illustrations | done | 1 round, 2 Majors fixed (`reviews/3-review-1.md`) | 79 examples, 0 violations | passed (9886b28) | | | |
| 4 Shell, navigation, dashboard | done | 1 round, 3 Majors + persona Blocker fixed (`reviews/4-review-1.md`) | 0 violations (955733a) | passed (955733a, edf1dc4) |
| 5 Rental contract wizard | done | 2 rounds (`reviews/5-review-1.md`, `5-review-2.md`), all Blockers/Majors fixed | 0 violations (5 contract-new states) | passed (bd2ea7c, 9d83882) | | | |
| 6 Statement wizard | done | 2 rounds (`reviews/6-review-1.md`, `6-review-2.md`), all Blockers/Majors fixed | 0 violations (all states, no `@wip`) | passed (15c0ec5, 39eac9f) | | | |
| 7 Remaining screens | done | 2 reviews + 3 fix rounds (`reviews/7-review-1.md`, `7-review-2.md`), all Blockers/Majors fixed or justified | 0 violations (86 examples) | passed (2d20713, 05def10) |
| 8 Remove old design system | done | remnant search + 1 round (`reviews/8-review-1.md`), Major fixed | 0 violations, light and dark | passed (c3b1da6, 832d9a7) |
| 9 Final | done | final review + final persona round (`reviews/9-review-1.md`, `personas/*-final.md`) | 0 violations, light and dark, desktop/tablet/mobile | see stage 9 log |

**Next step:** none – the redesign is complete; remaining points are in `offene-punkte.md`.

## Log

### Stage 0 – Analysis

- Environment: PostgreSQL 16 started locally, role/db `dwello`; dependencies installed. The pre-installed Chromium is older than the project's Playwright and the newer browser cannot be downloaded (proxy); symlinked the old headless shell under the expected path (see `arbeitsregeln.md`). Works for the E2E suite.
- Branch: the brief and the user ask for `feature/new-design`; the session was started on `claude/clever-galileo-lemeud`. Decision: work on `feature/new-design` as explicitly requested by the user.
- Skills: `/tdd` and `/ponytail` exist in `.claude/skills` and are used for every code change.
- `gh` CLI is not available in this session; GitHub operations (PR, checks, comments) go through the GitHub MCP tools. Decision: equivalent to `gh pr create --draft` / `gh pr checks`.
- `cy.yml` does not exist; the job `ui-screenshots` is in `.github/workflows/ci.yml` and runs on draft PRs too (no draft condition), so `gh pr ready` is not needed.
- Found a label bug in the rental contract form: "Nebenkosten Akonto" writes `additionalRent` (Zusatzmiete) and "Parkplatz / Sonstiges" writes `monthlyAdvancePayment` (Akonto). The contract detail page repeats the swap. Planned fix: relabel in the contract wizard (stage 5) and on the contract detail page (stage 7); no logic change.
- Draft PR: rudini/Dwello#32. Review round 1: 3 Majors (contract detail label swap, missing axe states, incomplete term table) fixed.

### Stage 1 – Plan

- `01-plan.md` written: 19 design decisions, token proposal (contrast checked with a script: all text pairs ≥ 6.9:1, most ≥ 7:1), component set, migration via a shrinking design-guard list, axe check as a Gherkin Szenariogrundriss inside the existing `chromium` project (CI runs it without workflow changes).
- Decision: Inter (variable, `@fontsource-variable/inter`) over Source Sans 3 / IBM Plex Sans – larger x-height at 16 px, tabular figures.
- Decision: dark mode only via `prefers-color-scheme` (no toggle).
- Review round 1: 6 Majors (send copy, task data sources, dark mode timing, axe timeout, empty-state claim, remnant scope/fallow) fixed in the plan.
- `/tdd` asks to confirm interfaces with the user; the user asked for autonomous work, so the plan (`01-plan.md`) serves as the agreed interface and behaviour list.

### Stage 2 – Tokens, base components, axe check

- Tokens in `src/styles/tokens.css` (light; dark scoped to `:root[data-dark-ready]` until stage 8), mapped to Tailwind under new names next to the old palette; Inter served from `@fontsource-variable/inter`; global `:focus-visible` ring and `prefers-reduced-motion`.
- New components in `src/lib/ui/` (all with DOM tests written first): Icon (Lucide, stroke 1.75), Button, IconButton, Field + TextInput/MoneyInput/Select/Textarea, Checkbox, RadioGroup, Dialog, Alert, Badge, EmptyState, SaveStatus, ProgressBar, Stepper, Tabs, Table, ToastRegion, PageHeader (with breadcrumb), Panel, NavList.
- Decision (/ponytail): no separate Spinner – the busy state is a text ("Wird gespeichert …") on the button; no `iconEnd` on buttons until a screen needs it.
- Decision: form controls use `aria-required` instead of native `required`, so empty submits reach the inline validation (native bubbles would block it and are not readable for everyone).
- Design guard `src/__tests__/design-guard.test.ts` with 129 legacy files in `design-guard-legacy.json` (shrinks per stage).
- Axe check: `tests/e2e/features/accessibility.feature` (76 screen × state examples, 6 more `@wip` until their UI exists), steps `tests/e2e/steps/accessibility.steps.ts`, driver `tests/e2e/interactions/accessibility.ts`; desktop, tablet, mobile; consistency test `tests/unit/a11y-screens.test.ts`. Runs in the `chromium` project, so CI's E2E job runs it unchanged; Firefox/WebKit skip `@a11y`.
- First axe run on the old UI: 304 violations on all 76 examples (contrast of `gray-400/500`, `green-600` …; `dt`/`dd` outside `dl`; a scrollable table not reachable by keyboard). Fixed by mapping low-contrast text colours to tokens across the legacy files, restructuring the tenant contact list, and making scroll regions focusable (with a targeted `svelte-ignore a11y_no_noninteractive_tabindex`, because Svelte's lint and WCAG 2.1.1 disagree here). Result: 0 violations.
- Found: several old confirmation dialogs (building, contract end/delete) have no `role="dialog"`; fixed when they move to the new `Dialog` in stage 7.
- Review round 1: 3 Majors (axe states not proven, no browser check of the new components) fixed: states now wait for proof, new `/gallery` page in the axe check; 9 Minors fixed or justified (`reviews/2-review-1.md`). Axe: 79 examples, 0 violations. E2E 352 passed, unit 760 passed.
- Review round 2: 1 Major (old and new toast regions both rendered) fixed by switching the layout to `ToastRegion` and deleting the old toast components; 7 Minors fixed. The session worker restarted once; PostgreSQL restarted, no work lost.

### Stage 3 – Icons and illustrations

- Icon set: Lucide, 75 icons named by meaning in `src/lib/ui/icons.ts`, drawn by `src/lib/ui/Icon.svelte` (stroke 1.75, decorative unless labelled).
- Decision: the plain `lucide` package (shape data) instead of `@lucide/svelte` – no third-party components, works with the project's server-render test helper, smaller. `@lucide/svelte` removed again.
- The old `Icon` component is now an adapter: Material Symbols names of the not yet migrated screens map to the new set (`src/lib/components/material-icons.ts`, test checks every name used in the sources). The Google Material Symbols font is no longer loaded – from this stage on the whole app uses one icon set, served locally.
- Illustrations: 10 line motifs in `src/lib/ui/illustrations/` (Gebäude, Wohnung, Mietvertrag, Zähler, Rechnungen, Nebenkostenabrechnung, Versand, Erledigt, Keine Treffer, Fehler), viewBox 160×120, 2 px stroke, colours only from tokens (`--illu-*`, surface, caution); decorative by default, `title` makes them an image with a name. `EmptyState` takes an illustration by name. All shown in the gallery and checked by axe.
- Test helper `src/__tests__/helpers/hydrate.ts`: compiled server modules are now named by their path below `src/` (two components called `Icon.svelte` overwrote each other) and relative TypeScript imports are resolved.
- Checks: unit 798, lint/check/build/fallow clean, E2E 352 passed incl. 79 axe examples, 0 violations.
- Review round 1: 2 Majors (room count drawn as "vacant", invoice icon with a dollar sign) fixed with meaning tests; 6 Minors fixed, 2 moved to the stage 7 icon pass.

### Stage 4 – Shell, navigation, Übersicht

- ATDD: `dashboard.feature` (now "Übersicht") gets scenarios for overdue statements, drafts, payment deadlines and contract ends as tasks/deadlines; quick actions changed to the four common jobs; header actions removed (one primary action per screen). `navigation.feature`: new labels, settings sub-pages as items, "only the current area is marked". Step phrase "das Dashboard öffnet" renamed to "die Übersicht öffnet". New seeding helpers `paymentDeadline`, `contractEnd` (through the API).
- `src/lib/overview.ts` (TDD, 9 tests): set-up tasks (first building → apartments → first contract), work tasks (overdue → letters to send → drafts) with singular/plural, deadlines (Zahlungsfrist ≤ 14 days or passed, Vertragsende ≤ 60 days; TODO(fachlich prüfen) on the windows), relative wording ("seit 5 Tagen abgelaufen", "heute", "morgen", "in 10 Tagen"). Loader reads only existing endpoints (dashboard, statements overdue/sent, documents to send, active contracts); "today" is the server's local date.
- Shell: header (logo → Übersicht, user menu with Escape/outside close and focus return, menu button below 1024 px), sidebar `w-80` from 1024 px with one-level NavList (`activeHref` picks the most specific item), mobile drawer as modal dialog with focus trap, footer, skip link "Zum Inhalt springen". `NavLinks`, the old dashboard parts (GettingStarted, QuickActions, StatementTiles, ActivityFeed, StatCard, OccupancyChart) and `ProviderIcon` deleted.
- Decision: the login page shows no third-party logos (brand colours would be hard-coded colours outside the tokens); buttons say "Mit Google anmelden".
- Decision: the header shows a user icon instead of the Google profile picture (no external image request).
- Error page with the "Fehler" illustration and "Zur Übersicht". Copy that promised "Ihre Daten sind davon nicht betroffen" removed – not verifiable for every error.
- Legacy list: 111 files left.
- Checks: unit 839, lint/check/build/fallow clean, E2E 359 passed incl. axe (drawer state now also on tablet).
- Commit 955733a pushed; CI green incl. ui-screenshots.
- Personas Anna (partly) and Helga (yes) on the persona stack (`docs/design/tools/persona-stack.sh`, `persona-kit.mjs`; zoom emulates browser zoom). Reports in `personas/anna-4.md`, `personas/helga-4.md`.
- Review round 1 (`reviews/4-review-1.md`): 3 Majors and Anna's Blocker fixed – overview task "Nebenkostenabrechnungen erstellen" for an ended Abrechnungsperiode without statements, status-dependent error hint, user-menu button size and name, "Überfällige Beträge"; Minors fixed (neutral overdue wording, network-tolerant loader, sidebar height via `--size-header`, focusout closes the user menu, generic login text, 48 px links, dead E2E helpers removed, equal quick-action cards).

#### Persona backlog (from stage 4 runs, for stages 5–7)

- Stage 5 (rental contract wizard): Swiss date format and the date repeated in words (Helga); confirmation after saving tenant and contract with the key data (Helga); explain Akonto in plain words, Unbefristet hint, examples that look like examples (Helga); free apartments first / explain "nicht verfügbar" (Helga).
- Stage 6 (statement wizard / detail): confirmation before «Versenden» with recipient and PDF preview; Verteilschlüssel per line and the share explained ("62 m² von 340 m²"); refund wording for Zahlungsfrist (Anna).
- Stage 7 (remaining screens): a future contract must not show "Aktiv … – heute" (Helga); whole list rows clickable, text labels for eye/pencil icons (Anna, Helga); English category and heating-profile names in German (Anna); help-page names matching the menu (Anna); "1 Abrechnungen", "Mietstagen", stray "·" (Anna); one name for the management fee (Anna); Bruttomiete label in the contract list (Helga); Anrede field is a data-model change – listed in `offene-punkte.md` instead.
- Review fixes committed as edf1dc4; CI green incl. ui-screenshots.

### Stage 5 – Rental contract wizard

- ATDD: `contract-new.feature` rewritten for the wizard (`@wip`): save with confirmation, review step, step validation, back without loss, rented apartment not selectable, draft restore and discard, inline tenant creation. Watched them fail (no wizard yet).
- Decision: the sum per month is labelled "Monatlich total" (no glossary term for "Bruttomiete", see `offene-punkte.md`).
- Logic (TDD): `src/lib/contract-wizard.ts` (steps and their fields, step validation, first step with an error, Akonto plausibility notice, summary in words, start values from address and draft with dropped ids, apartment choices free first), `src/lib/wizard-draft.ts` (versioned `localStorage` draft, tolerant of blocked storage, cleared on save, discard and logout), `formatDateLong` ("Mittwoch, 1. Januar 2025").
- UI: `/contracts/new` is a wizard (Mieter → Wohnung → Vertragsdauer → Miete → Prüfen) with `Stepper`, new `WizardNav` (Weiter submits the step, so Enter works; last step "Mietvertrag speichern"), `SaveStatus`, restore notice with "Entwurf verwerfen", focus moves to the step heading. Dates repeated in words (Helga), Unbefristet/Befristet as explained choices, glossary help texts for Nettomiete, Akonto, Zusatzmiete, "Monatlich total", confirmation toast "Mietvertrag von … gespeichert" (Helga).
- Inline tenant creation: "Neuen Mieter erfassen" opens `/tenants/new?for=contract`; after saving, the tenant form returns to `/contracts/new?tenant=…&created=1`, the wizard confirms the new tenant and keeps the draft.
- Bug fix (UI mapping, no logic change): the contract list returns `startDate`/`endDate`, the availability check reads `start_date`/`end_date`, so every apartment with any contract – even one ended years ago – showed as "nicht verfügbar" and the overlap check never fired. The wizard and the edit form now map the fields (`forAvailability`). Explains Helga's confusion about "(nicht verfügbar)".
- Bug fix (labels): the edit form and the contract detail called `additional_rent` "Nebenkosten Akonto" and `monthly_advance_payment` "Parkplatz / Sonstiges" (found in stage 0). Now "Akonto" and "Zusatzmiete" as in the glossary; the wizard writes Akonto to `monthlyAdvancePayment`. Existing data is not touched. The edit form lost its unused "new contract" branch.
- Axe: contract-new states `every-wizard-step` (all five steps incl. limited contract), `overlap-warning`, `draft-restored` out of `@wip`; screens may put `{ids}` in their state queries. The axe check clears browser storage per viewport.
- Commit bd2ea7c pushed; CI green incl. ui-screenshots (wizard step 1 and the fixed Akonto label on the contract detail checked in the screenshots).
- Personas (all five, `personas/*-5.md`): Helga yes (after spotting two silent errors), Sven yes, Anna/Marco/Dr. Weber partly (statement screens, stage 6).
- Review round 1 (`reviews/5-review-1.md`): 6 Majors + Helga's Blocker + Sven's Majors fixed – Swiss amounts ("1'450"), past start date notice, German save errors and blocking overlap, drafts only after user input, correct "Mieter erfasst" name, focus on the first faulty field, mobile review grid, Swiss date in the apartment choice, step position for screen readers, safe browser storage, one contract table for availability and overlap, tenant list limit, Akonto label on the apartment page.

#### Persona backlog (from stage 5 runs)

- Stage 6 (statement wizard): warning when the period has no invoices or invoices only for part of it (Anna, Marco, Dr. Weber – Blockers); step "Erstellen" must say that drafts are made, nothing is sent; confirmation before «Versenden» with recipient and PDF preview; old unsent drafts flagged (Anna); mobile: no horizontal scrolling, 48 px targets (Marco); trace the Verwaltungspauschale base and the Verteilschlüssel per line (Dr. Weber).
- Stage 7: contract list/detail "AKTIV … – heute" for future contracts (Helga, Sven); English category/heating profile names; "Mietstagen" typo; one name for the management fee and Akonto everywhere; Saldo "CHF-83.43" format and US date on the statement edit page; clickable list rows; tenant form in the new design with "erfassen"; invoice date hint (Marco).
- Review round 1 committed (ca34041, 9d83882), CI green. Review round 2 and re-runs of Helga and Sven (`personas/helga-5b.md`, `sven-5b.md`): strict amounts, in-place normalising, impossible years rejected, past start confirmed by a second "Weiter" (read out), longer confirmation – `reviews/5-review-2.md`.

### Stage 6 – Statement wizard

- ATDD: `statement-generate.feature` – warning for a building without invoices and confirmation, invoices named in the preview, "nothing is sent" before creating, draft restored; `statement-detail.feature` – recipient, Korrespondenzweg and PDF before marking as sent. Watched them fail.
- Logic (TDD): `src/lib/statement-wizard.ts` (five steps, step checks incl. impossible years, invoices per building in words, draft restore without deleted buildings/heating profiles); `invoicesInPeriod` (BFF, same filter as the statement calculation: utility invoices dated in the period); the preview action returns them.
- UI: `/statements/generate` rebuilt with the new components in five steps (Abrechnungsperiode → Gebäude → Heizprofil und Verwaltungspauschale → Vorschau → Erstellen): dates in words, buildings as cards, preview as a list (no sideways scrolling on phones) with the Saldo in words ("Nachzahlung"/"Rückerstattung"), invoices per building, warning + confirmation for buildings without invoices (link "Rechnung erfassen"), "Es wird nichts verschickt" before creating, result links to the drafts. Browser draft with save status (shared `DraftNotice`, also used by the contract wizard). Old `WizardNavigation`, `WizardProgress`, `WizardStep`, `ManagementFeeField` removed; their tests moved to the new components.
- Finding: "Versenden" never sent anything – it only set the status "Versendet". It now opens a confirmation (`SendDialog`): "Dwello verschickt die Abrechnung nicht selbst", recipient with Korrespondenzweg and e-mail/postal address (address loaded from the tenant in the page loader), "PDF ansehen" in a new tab (the BFF creates the PDF if missing and shows it inline), then "Als versendet markieren".
- Statement detail: action buttons, PDF button and history extracted into new-design components (`StatusActions`, `PdfAction`, `MetadataCard`); the rest of the page follows in stage 7.
- Axe: statement-generate `every-wizard-step` (all five steps), `preview-empty`, `draft-restored`; statement-detail `send-dialog`; statement-sent-detail `action-error` – no `@wip` examples left.
- Commit 15c0ec5, CI green incl. ui-screenshots (wizard step 1 checked). Review round 1 and all five personas (`reviews/6-review-1.md`): confirmation per preview, no run without contracts, preview kept after a failed generation, hints for partial periods and existing statements, overview names every building without statements, accessible confirmation error, busy states, toast after "Als versendet markieren".

#### Checkpoint after stage 6 (summary)

- Done: tokens, base components, icons, illustrations, shell, overview, both wizards (Mietvertrag, Abrechnungen) with drafts, plausibility checks and confirmations; axe over all listed screens and states with 0 violations; 6 review rounds, 15 persona runs.
- Personas at the checkpoint: Helga and Sven complete the contract task; Marco completes the statement run on the phone; Anna is guided to the right next step; Dr. Weber still would not send a statement – his blockers are the statement detail and the PDF (English category names, empty Verteilschlüssel column, fee base, PDF content), stage 7 and backend.
- Biggest risks left: the remaining 102 legacy files (stage 7/8), the statement detail page, data/content issues that are outside the UI (English master data names, PDF content).
- Persona backlog for stage 7: statement detail (Verteilschlüssel per line, fee base, one name for the fee, "Mietstagen", refund wording), lists as cards/rows on phones with clickable rows, invoice form (date default, building preselected, back to the wizard), contract list ("AKTIV … – heute", Mietzins column), tenant form, help page names, English master data names (display decision), heating profile chart values for screen readers.
- Review round 2 (`reviews/6-review-2.md`): no Blockers/Majors; minors and the re-runs of Anna and Sven fixed (overlapping statements counted, links per building, status line while the server works, warnings read with their checkbox, warning repeated before creating).

### Stage 7 – Remaining screens

- Plan: 102 legacy files (~9000 lines). Work packages by area in parallel git worktrees (agents run unit/lint/check/fallow; E2E runs centrally after each merge because its ports and database are fixed): A buildings + apartments, B tenants + contracts, C invoices + statements + documents, D settings (config, categories, distribution keys, heating profiles), E help, privacy, terms, analytics, reports. Shared legacy components stay until stage 8. Conventions for all packages: `docs/design/migration-guide.md`.
- Finding: master data (categories, distribution keys, heating profiles) carry German names (`nameDE`); the old UI showed the English `name` ("Heating", "Caretaker" – persona blocker). New helper `germanName` (`src/lib/names.ts`).
- Package E merged (help, privacy, terms, analytics, reports): help with the menu names, both guided jobs and 12 terms in plain words; privacy page mentions browser drafts; coming-soon pages as EmptyState. Decision: "Analytics"/"Phase 2" replaced by "Auswertungen sind in Vorbereitung" / "Berichte sind in Vorbereitung" (English word and internal jargon; scenarios changed first).
- Package D merged (settings): categories, distribution keys, heating profiles and the settings page with shared `SaveForm`/`DeleteDialog`, German names everywhere (`nameDE` now also on heating profiles), formula help for non-programmers, heating profile chart with every monthly value as text (list for screen readers), rows as links, phone lists. Follow-up: the statement wizard shows the German heating profile name (149696b).
- Package B merged (tenants, contracts): lists as rows/cards with the name as link and `Pagination`, Vertragsstatus Laufend/Künftig/Beendet derived with the backend's boundary (no "AKTIV … – heute"), Nettomiete and "Monatlich total" separate, contract edit form reuses the wizard steps, tenant form "Mieter erfassen" with save toast, `ActionDialog` for form-action confirmations, `Dialog` `confirmDisabled`.
- Package A merged (buildings, apartments): cards as single links, floors as "EG"/"1. OG" in numeric order, Mietstatus legend and help, one primary action per screen, save/delete toasts, delete dialog names the invoices deleted with the building, `EmptyState` `actionTestid`.
- Package C merged (invoices, statements, documents): statement detail with German line items, Verteilschlüssel per line, Verwaltungspauschale base in words, Saldo in words, Mahnung as `Dialog`, "Bezahlt" with confirmation (plan D17); invoice form with date in words, `?building=` and `?returnTo=` (from the statement wizard); documents page in the new design.
- Merge decisions: one paging component (`src/lib/ui/Pagination.svelte`; the packages' duplicate `Pager` variants and the legacy `Pagination`/`ListPagination` removed); legacy components left without users deleted (Badge, Button, ContractHistoryTable, DocumentRow, FieldError, PageTrail, StatusBadge, ConfirmDeleteDialog, FilterActions, FormActions, RecordForm, Modal, RecordTable, TextField). Legacy list down to the few files stage 8 removes.
- E2E driver fix: "nur … markiert in der Hauptnavigation" now looks inside the landmark "Hauptnavigation"; the breadcrumb's `aria-current="page"` was counted before.
- Open points of all packages in `offene-punkte.md` (stage 7 sections).
- Commit 2d20713 pushed, CI green incl. ui-screenshots. E2E 384/384 incl. axe (85 states, 0 violations).
- Review round 1 (`reviews/7-review-1.md`): 0 Blockers, 6 Majors, 14 Minors (page-wide sideways scrolling on statement detail, invoice and statement lists, long titles on phones; focus lost after failed submits; English category descriptions; "– heute" for future contracts). Personas (all five, `personas/*-7.md`): Helga yes, Sven yes (keyboard only), Marco partly (categorization by hand), Anna partly on purpose (stopped before creating 2025 statements without invoices), Dr. Weber would not send (PDF content and seed formula – backend, documented).
- Fixes in three parallel packages: F1 statements/invoices (layout, labels, category descriptions, invoice period notice), F2 Mietstatus consistency (relet apartments in every count and page), F3 focus after failed submits and announced toasts.
- Fixes merged: F1 02decfb, F3 4a79ffe, F2 52b9f64 (resolutions in `reviews/7-review-1.md`). Unit 1256, coverage 89 % statements / 75 % branches, lint, check, fallow clean, E2E 386 passed incl. axe. Next: review round 2 and re-runs of the personas the fixes affect (Helga, Sven, Marco).
- Review round 2 (`reviews/7-review-2.md`): 1 Blocker (header regression from the round 1 fix), 1 Major, 7 Minors; persona re-runs Helga yes, Sven yes, Marco yes (`personas/*-7b.md`). Round 3 fixes merged (2cf2dd9 layout, 4053818 accessibility: delete toasts, errors cleared on change, focus on the result count after filtering, overview bars with relet apartments, all seeded categories recognized) and d7ced5a (count shown once). Unit 1288, lint, check, fallow clean, E2E 389 passed incl. axe and three new layout scenarios. Stage 7 done; max. 3 review rounds reached, remaining points in `offene-punkte.md`.

### Stage 8 – Remove the old design system

- Design guard first (TDD): no exception list any more, every file under `src/` is checked; imports from `$lib/components/` and the folder itself are forbidden. Watched it fail (17 findings).
- Moved the restyled parts out of `src/lib/components`: `Header`, `Footer`, `MobileNav`, `Navigation`, `HeatingProfileChart` to `src/lib/ui`; `BuildingForm`, `AddressSearch`, `BuildingMiniMap` to `src/routes/buildings`; `CurrentTenantCard`, `MonthlyCostsCard` to `src/routes/apartments/[id]`; `TenantFormFields` to `src/routes/tenants`. Deleted the unused legacy parts (`Card`, `FilterSelect`, `SearchField`, the Material `Icon` and its icon table) with their tests.
- Tailwind theme: colours, radii and shadows are replaced by the tokens (old palette gone; `tokens.test.ts` checks the config). `globals.css` keeps only the base styles and the focus outline (old colour variables, focus-ring and animation utilities, duplicate `.sr-only` removed).
- Decision: the unused `svelte-i18n` setup is removed as plan section 7 foresaw (no page used a translation; its `de.json` still carried old texts like "Verwaltungsgebühr"). Multilingual UI (PRD) would start again from the glossary terms. `docs/design_system.md` removed; CLAUDE.md, README and tech-stack link to `docs/design/token-referenz.md`.
- Dark mode switched on (plan D4): the dark tokens follow `prefers-color-scheme` without the `data-dark-ready` switch; the axe check covers every screen and state light and dark (86 examples, 0 violations). Checked dark screens by eye (overview, lists, empty state, heating profile chart, statement detail).
- Axe harness: the check scrolls to the top before analysing; a scrolled wizard slid the 48 px breadcrumb link under the sticky header and `target-size` judged the visible part (intermittent, 1 in 4).
- Commit 531a70c. Unit 1279, coverage 89 % statements / 76 % branches, lint, check, fallow, build clean, E2E 388 + axe 86 passed.
- Remnant search (Explore) and review round 1 (`reviews/8-review-1.md`): 0 Blockers, 1 Major (map over dialogs, pre-existing) and Minors fixed: map isolated and dark in dark mode, border and placeholder colours from tokens, dead `package.json` entries, German error texts, unused tokens and icon keys removed, docs updated. Unit 1284, E2E 389 passed incl. axe light and dark. Stage 8 done.

### Stage 9 – Final

- Docs: `design-decisions.md` (decisions as built, decided during the work, anti-patterns), `token-referenz.md` completed (theme replaced, dark mode, components), `offene-punkte.md` with the complete glossary table (25 `TODO(fachlich prüfen)` places), CLAUDE.md section "Design-Regeln" and links (c4bb7d4).
- CI on 38d3505 failed in "Unit tests" (all tests passed, 2 unhandled rejections from the map test: map created after the component was gone). Fixed with a test that reproduces it (832d9a7, CI green). Lesson: check the exit code of the coverage run, not only the test count.
- Final review (`reviews/9-review-1.md`) and final persona round with the brief's tasks: Helga, Marco, Dr. Weber, Sven and Anna all completed their task (`personas/*-final.md`). Dr. Weber would not send the statement yet because of the PDF content and seed data (backend, documented); the screens let him trace every number.
- Fixes (7c88a89): apartment choice with rooms and area, focus on the field when changing from the review, notices after a page change take the focus, no past-date notice for impossible years, cost table at full width, empty positions explained, vacancy share explained in the preview, back from an invoice to the step before the preview, clearer Verwaltungspauschale help. Remaining Majors justified in `offene-punkte.md` (stage 9 section). TDD slip: the loader test for rooms/area was written after the change.
- Checks: unit 1292 (exit 0, coverage 89 % statements / 76 % branches), lint, check, fallow clean, E2E 389 passed incl. axe light and dark.
- Axe coverage completed after the final review (0c237df): `submit-cleared` on every edit form, `saved-toast` (category and building edit), `server-error` (error page of a failed load), `statement-empty-detail`; 100 examples, 0 violations, light and dark, desktop/tablet/mobile. The tenant edit form cannot be saved unchanged for a tenant "Per Brief" without address (correct behaviour), so the toast state uses the building edit form. Also fixed: help glossary (Umlagefähig, Mietstatus, Nachzahlung/Rückerstattung), "50.0 %" on the overview (scenario changed first), one width for the statement list actions. E2E 403 passed.
- Axe coverage without exceptions: a second, empty instance joins the E2E stack (backend 3103 on `dwello_e2e_empty`, the same frontend build on 3102, `playwright.config.ts`); the axe check runs `empty` (7 lists) and `first-use` (overview) there. The unit sync test no longer excludes any state. 108 axe examples, 0 violations; E2E 411 passed.
- Persona Majors fixed instead of only justified (089ecfe): invoice list filter "Jahr" (scenario first), overview task links to the period's invoices, the statement wizard names the invoices per building already in step 2, the invoice form opened from the wizard starts without a date (scenario step first). E2E driver: the invoice search waits for its result before the next step (a one-off failure under full load showed the race). Unit 1298, E2E 412 passed incl. 108 axe examples. Remaining deviations are outside the UI (PDF content, seed data: business logic and seed data must not change) or the browser's native date field.
- Final round b: Anna and Marco repeated their tasks after the fixes and completed them (`personas/anna-final-b.md`, `marco-final-b.md`): the overview link leads to the period's invoices, step 2 names missing invoices, no sideways scrolling. Fixed from their findings (TDD): one request for the invoice counts in step 2 (one per building slowed the wizard with many buildings, seen in E2E), a notice why the wizard returns to the step before the preview, an empty year in the invoice list says that nothing is recorded yet and offers "Rechnung erfassen", the building list stays inside its panel. Unit 1299, E2E 412 passed incl. 108 axe examples. Remaining points in `offene-punkte.md` ("Final round b").
