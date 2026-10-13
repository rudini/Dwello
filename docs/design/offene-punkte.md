# Open points

Non-functional open points (security, operations, reliability, performance, usability and accessibility, maintainability) until the quality requirements are set up. Functional points (domain, features, bugs) are GitHub issues in `rudini/Dwello` (labels `fachlich`, `produkt`, `bug`, `entscheiden`); the functional rows that stood here until October 2026 became issues whose titles start with their old ID. The sign-in restriction (former O-1) is issue #51; it was written as an issue before this split. History: `docs/archive/offene-punkte-verlauf.md`. Rules: `CLAUDE.md`, "Open work".

## Accessibility and layout

| ID | Point | Where | Decide / do |
|---|---|---|---|
| U-1 | The mobile drawer uses `aria-modal` without `inert`; toast timing (500 ms after navigation) has not been checked with NVDA or VoiceOver. | `src/lib/ui/MobileNav.svelte`, `src/lib/ui/ToastRegion.svelte` | Make the rest inert; manual screen reader check. |
| U-2 | No error summary at the top of forms; detail-page actions («Bearbeiten», «Löschen», «Beenden») do not name the record; contract list rows have a second link «… bearbeiten» (Sven). | forms, detail pages, contract list | Design decision. |
| U-3 | Dialogs: the confirm button comes before the field in the tab order, focus starts on «Abbrechen», the whole body is read as description, a date error makes a centred dialog grow under the pointer (R7-F2), no visible scrollbar; the page title is announced again after saving. | `src/lib/ui/Dialog.svelte`, `ActionDialog` | Fix in the shared components. |
| U-4 | Errors of `Checkbox` and `RadioGroup` stay until the next submit, and radio options read their explanation twice; the calendar button of `DateInput` opens the browser's own picker, whose screen reader use was not checked (CC-9). | `src/lib/ui/Checkbox.svelte`, `RadioGroup.svelte`, `DateInput.svelte` | Fix and check. |
| U-5 | Name conflicts of heating profiles and distribution keys show as a form error, not at the Name field (categories do). | `src/lib/server/heating-profile.ts`, `distribution-key.ts` (no `conflict` option) | Set `conflict: 'name'`. |
| U-6 | Language switcher and user menu have no arrow keys; nothing announces the language change and focus starts at the top; the footer does not mark the current page; the «Anmelden» and «Hilfe» links sit outside a landmark. | header, footer | Fix when touching the header. |
| U-7 | The header fits 390 px with about 7 px to spare and would overflow at 360 px; the login page scrolls by about 64 px (R1-3, R1-4); the mobile menu needs scrolling to reach «Hilfe». | header, login, `MobileNav.svelte` | Layout decision. |
| U-8 | Layout at mid widths: invoice and statement rows stack below 1280 px; contract list filters and the statement table are cut at 1024 px; a success toast covers content on phones, at 1024 px and at 150 %; the Verlauf labels do not align; the Italian heating profile choice is cut at 390 px. | lists, statement detail, toasts | Design decision. |
| U-9 | The long heating profile help before the choice hides the warning about meters on phones (Marco; left open by the user's decision). | statement wizard step 3 | Shorten or move the help. |
| U-10 | Smaller persona and review findings (runs I to J, session 11 rounds 4 to 8, session 15) are listed in the history and not repeated here. | `docs/archive/offene-punkte-verlauf.md` | Take them when touching the screen. |
| U-11 | The mobile navigation drawer has no scenarios (same targets as the sidebar). | `tests/e2e/features/navigation.feature` | Add scenarios. |
| U-12 | List filters apply only after «Suchen»; applying a select on change would be quicker (E2E tasks click the button). | `src/routes/invoices/InvoiceSearch.svelte` and the other list filters | Decide. |
| U-13 | Contract end and statements after a changed end (PR #54, personas K1): «Nächste Schritte» speak of the «Schlussabrechnung» without its year, and Helga read the yellow «Abrechnung 2025 fehlt» as part of the notice (Helga M2); the link to a refused draft replaces the dialog and its entries are lost (Anna m2); the statement wizard shows the chosen building and period only as a notice on the settings step, done steps stay bare check marks (Helga M1, Sven M2); «Die Abrechnungen trotzdem erstellen» reads like a duplicate (Anna M3). | `src/routes/contracts/[id]/NextSteps.svelte`, `MissingStatement.svelte`, `RefusedStatements.svelte`, `src/routes/statements/generate` | Usability pass; reports `docs/design/personas/*-k1.md`. |
| U-14 | Personas K2 (PR #54): «Beenden» next to «Löschen» reads like «stop now» (Helga M1); with a successor from the next day the apartment says «Vermietet» without a hint on the move-out (Helga M4, K-4); the wizard's «erstellt» status is inserted already filled and not announced (Sven M2); refusals name the statement only by its number (Sven M3). | contract detail actions, `src/lib/apartment.ts` (`followedOn`), statement wizard, `RefusedStatements.svelte` | Usability pass; reports `docs/design/personas/*-k2.md`. |

## Housekeeping

| ID | Point | Where | Decide / do |
|---|---|---|---|
| H-2 | Old HTML mockups with Material Symbols and Google Fonts. | `screens/*/code.html` | Delete when nobody needs them. |
| H-3 | The PRD still names svelte-i18n as the translation library. | `docs/PRD-Dwello.md` | Update to Paraglide JS. |
| H-4 | A manual script uses a CSS class selector for the heating profile sum. | `tests/exploratory-test.ts` | Use a `data-testid`. |
| H-5 | The Paraglide options are repeated (R1-9). | `vite.config.ts`, `vitest.config.ts`, `package.json` (`i18n`) | Share one definition. |
| H-6 | `prorateCosts` is only used by its own tests (reviews F-9, H-3). | `backend/src/services/prorating.service.ts` | Delete or use it. |
| H-7 | The CI screenshot job shoots routes only: no mobile viewport, dark mode, dialog or wizard states. | `.github/workflows/ci.yml` (`ui-screenshots`) | Extend the job. |
| H-8 | Help texts live in several places; no central registry. | `src/routes/help/Glossary.svelte`, `src/routes/config/help.ts` | Decide whether a registry is worth it. |
| H-9 | Scenario names «Wohnung hinzufügen» and «Erste Wohnung erstellen», while the buttons read «Wohnung erfassen»; master data key names without unit, US and UK spelling mixed (R8-11). | `tests/e2e/features/building-detail.feature`, `backend/migrations/0002_stammdaten.sql` | Rename. |
| H-10 | Frontend coverage is below the target in `docs/test-pyramid.md`; the floors in `vitest.config.ts` rise with it. | `vitest.config.ts`, `docs/test-pyramid.md` | Add tests, raise the floor. |
| H-11 | Major updates without a security reason are pending: SvelteKit 3 / Vite 8, Tailwind 4, Zod 4, TypeScript 7, ESLint 10, jose 6. | `package.json`, `backend/package.json` | Update one at a time, each with all checks. |
| H-12 | The project skills `.claude/skills/ponytail*` and the user-level ponytail plugin both load and mark shortcuts differently (`ponytail:` vs `shortcut:`). | `.claude/skills/` | Keep one. |
| H-13 | `bdd-acceptance` says one feature file per page, `tests/e2e/CLAUDE.md` one per area. | `.claude/skills/bdd-acceptance/SKILL.md`, `tests/e2e/CLAUDE.md` | Decide and align. |
| H-14 | fallow's existing findings (the gate blocks only new ones): 9 unused exports (`verifyJwt`, `optionalAuthMiddleware`, `PREDEFINED_DISTRIBUTION_KEYS`, `getDistributionKeyByName`, `CATEGORIZATION_PROMPT`, `invoiceExists`, `clearCategorizationCache`, `XSRF_COOKIE_NAME`, `toggleMobileNav`), about 590 duplicated lines (e.g. `backend/src/routes/distribution-keys.ts` and `heating-profiles.ts`), 12 functions above the health threshold. | `bunx fallow dead-code`, `bunx fallow dupes`, `bunx fallow health` | Reduce when the file is touched. |
| H-15 | Deliberate shortcuts marked `ponytail:` in the code (today one: an invoice group summing to 0 over different Leistungszeiträume bills nothing). | `backend/src/services/calculation.service.ts:128`; all markers: `/ponytail-debt` | Revisit when it occurs. A new `ponytail:` marker gets a row here when it is about maintainability, an issue when it changes what the landlord sees. |
| H-16 | The E2E step «sieht den monatlichen Mietzins» reads the monthly total, while the glossary defines Mietzins as Nettomiete. | `tests/e2e/features/contract-detail.feature`, `contract-edit.feature` | Rename the step. |
| H-17 | Demo data: `paid_amount` empty, no invoice with a Leistungszeitraum across the year end (R8-12, DP8-F2, DP8-F3), «Wohnung EG, EG» (DIV2-08), statements sent before they were created. | `backend/demo/demo-data.sql` | Fix the demo data. |
| H-18 | Some scenarios still name UI elements, against the feature rule in `tests/e2e/CLAUDE.md` («Feld» and the like; review screenplay-e2e-review-1, Minor): e.g. `statement-edit.feature:31`, `statement-management-fee.feature:38`, `invoice-new.feature:32,35`, `statement-detail.feature:88`. No lint checks feature wording. | `tests/e2e/features/` | Reword the steps in domain language; consider a check for UI words in features. |
| H-19 | The Screenplay lint (`eslint.config.js`) matches names, without type information, so deliberate detours stay possible: an alias of a Playwright fixture in `fixtures/` (`const p = page; p.on(…)`), `fetch` in `questions/` (needed for the mail catcher; a URL rule would be brittle), a question whose parameter is not named `actor` calling a task with it, a fixture handing `seed.backend` or `page` on under another name, a question asking again by recursion instead of a loop. Final review of the Screenplay refactor, `docs/reviews/screenplay-e2e-review-*.md`. | `eslint.config.js`, `tests/e2e/fixtures`, `tests/e2e/questions` | Typed lint rules (`@typescript-eslint` with type information) if a detour shows up in a diff; until then the code-reviewer checks the layer rules. |

## Operations and security

| ID | Point | Where | Decide / do |
|---|---|---|---|
| O-2 | No database backup (MVA R2). | `docker-compose.prod.yml` | Daily `pg_dump`, documented restore, first restore drill. |
| O-3 | Production publishes Postgres (5432), Ollama (11434) and the backend (3001) on the host; the Postgres password defaults to `dwello`; `ollama/ollama:latest` is not pinned. | `docker-compose.prod.yml` | Publish only the frontend or the reverse proxy; require a password; pin the image. |
| O-4 | Swagger UI is served in production. | `backend/src/app.ts` (`/swagger`) | Only in development. |
| O-5 | No Content-Security-Policy. | `svelte.config.js` (`kit.csp`) | Set a CSP. |
| O-6 | The reverse proxy with TLS is only commented out; `COOKIE_SECURE=true` needs HTTPS. | `docker-compose.prod.yml` | Configure the proxy and TLS, document it in the README. |
| O-7 | `.env.example` lists variables nothing reads: `SENTRY_DSN`, `FEATURE_*`, `UPLOAD_MAX_SIZE`, `UPLOAD_ALLOWED_TYPES`, `QR_REFERENCE_PREFIX`, `DATABASE_POOL_MIN`. | `.env.example` | Remove them. |
| O-8 | The Minimum Viable Architecture is half done: quality scenarios not confirmed, no ADRs in `docs/adr/` (step 1); no tests for R1 (LLM down while entering an invoice) and S2 (no token readable by scripts); P1 and P2 not measured (step 2; R2 is O-2). Five structural flaws wait until their code is touched («Structural flaws»). | `docs/migration-mva.md` | Steps 1 and 2 and the structural flaws there. |
| O-9 | No rate limiting on the BFF or the backend; no logging or monitoring for operation (Sentry or similar is not wired up). | `src/hooks.server.ts`, `backend/src/app.ts` | Decide what a single-user installation needs; record it as an ADR (O-8). |
