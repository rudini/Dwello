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
| 6 Statement wizard | in progress | | | |
| 7 Remaining screens | open | | | |
| 8 Remove old design system | open | | | |
| 9 Final | open | | | |

**Next step:** stage 6 – commit, CI, review, all personas, checkpoint summary.

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
