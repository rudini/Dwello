# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (7): bug #142, contract page reports a missing statement only for the last period

Task: open `bug` issues one by one (#122, #123, #125, #126, #127, #128, #135, #137 merged in rudini/Dwello#181, #182, #189, #196, #197, #198, #203, #210); now #142. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194 (and #199, #200, #201, #207 opened in this run).

- [x] Scenario «Fehlende Abrechnung einer älteren Periode am Mietvertrag» in `contract-detail.feature`: last year's statement exists, the page names 2024 and not last year. Scenario red: the hint `contract-missing-statement` was missing (null)
- [x] No fach-reviewer: the rule (rent days in an ended period without a statement of the contract) and the terms are those of A-10; only older periods are added
- [x] `endedPeriodsSince` in `accounting-period.ts`; the page load lists every ended period from the Vertragsbeginn with rent days and no statement, newest first, from one request for the contract's statements. Test red: «nennt alle abgelaufenen Perioden ab einem Tag …» (`settings.test.ts`) – not a function; «nennt jede abgelaufene Periode ohne Abrechnung …», «schweigt für Perioden vor dem Vertragsbeginn …» (`contract-actions.test.ts`) – `missingStatements` undefined
- [x] `MissingStatement.svelte`: one period as before; several: «{count} Abrechnungen fehlen» and one «Abrechnung {period} erstellen» per period. DOM test red: «nennt mehrere fehlende Abrechnungen …» – no such links
- [x] Texts in de/fr/it/en; a11y and language state `missing-statements` on contract-detail (code review C-3)
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: lint, check, deepcheck:audit, fallow, test:coverage (2434; two page tests needed `missingStatements: []` in their data), E2E chromium + api contract-detail (28 passed), axe and language rows of contract-detail (12 passed)
- [ ] code-reviewer
  - code-reviewer round 1 (`docs/reviews/issue-142-review-1.md`): no Blocker/Major; fixed C-1 (Minor; the load test uses `tests/contracts/contract.json` and `period-statements.json`, README names `?contractId=…`), C-2 (Minor; the fake filters by `contractId` and a previous tenant's statement must not count; test red with the filter taken out), C-3 (Minor; a11y and language state `missing-statements` on contract-detail), C-4 (Nit; the dead `variant` gone), C-7 (Nit; the helper test in its own `describe`), rejected C-5 (Nit): `start_date` is `notNull`, the endless loop cannot be reached; C-6 (Minor: a changed period setting reports every period as missing) added to #199
- [ ] Personas
  - persona helga round 1 (`docs/design/personas/helga-issue-142.md`): open P-1 (Major: old years without a way out; product owner kept «from the Vertragsbeginn», case added to #133; dashboard part in #211), fixed P-2 (Minor; the text says the wizard covers all contracts of the building), P-3 (Minor; «Erfassen Sie zuerst die Rechnungen der Periode»), rejected P-4 (Nit): a period that has its statement is not missing, the list names only what is open
  - persona marco round 1 (`docs/design/personas/marco-issue-142.md`): fixed P-1, P-2 (Minor; several periods as short buttons side by side, named in full for a screen reader), P-3 (Minor; «die Reihenfolge spielt keine Rolle»); observations in O-27
  - persona anna round 1 (`docs/design/personas/anna-issue-142.md`): open P-1 (Major, as Helga P-1, #133), P-2 (Minor: dashboard names only the last period) in #211, fixed P-3, P-4 (Minor; as Marco P-3, Helga P-2), P-5 (Nit: partial years) rejected: the wizard names the Mietstage per contract; observations in #211 and O-27
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-142.md`
- [ ] PR, CI, merge

Files: `src/lib/accounting-period.ts`, `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tests/e2e/tasks/accessibility.ts`, `tests/contracts/README.md`, `docs/design/offene-punkte.md` (O-27), `src/routes/contracts/[id]/+page.server.ts`, `+page.svelte`, `MissingStatement.svelte`, `messages/*.json`, tests (`settings.test.ts`, `contract-actions.test.ts`, `contract-detail-page.dom.test.ts`, `contract-rent-labels.test.ts`, `tenant-email-link.test.ts`, `contract-detail.feature` and its steps, targets, tasks, questions)
