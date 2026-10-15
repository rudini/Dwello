# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (7): bug #142, contract page reports a missing statement only for the last period

Task: open `bug` issues one by one (#122, #123, #125, #126, #127, #128, #135, #137 merged in rudini/Dwello#181, #182, #189, #196, #197, #198, #203, #210); now #142. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194 (and #199, #200, #201, #207 opened in this run).

- [x] Scenario «Fehlende Abrechnung einer älteren Periode am Mietvertrag» in `contract-detail.feature`: last year's statement exists, the page names 2024 and not last year. Scenario red: the hint `contract-missing-statement` was missing (null)
- [x] No fach-reviewer: the rule (rent days in an ended period without a statement of the contract) and the terms are those of A-10; only older periods are added
- [x] `endedPeriodsSince` in `accounting-period.ts`; the page load lists every ended period from the Vertragsbeginn with rent days and no statement, newest first, from one request for the contract's statements. Test red: «nennt alle abgelaufenen Perioden ab einem Tag …» (`settings.test.ts`) – not a function; «nennt jede abgelaufene Periode ohne Abrechnung …», «schweigt für Perioden vor dem Vertragsbeginn …» (`contract-actions.test.ts`) – `missingStatements` undefined
- [x] `MissingStatement.svelte`: one period as before; several: «{count} Abrechnungen fehlen» and one «Abrechnung {period} erstellen» per period. DOM test red: «nennt mehrere fehlende Abrechnungen …» – no such links
- [x] Texts in de/fr/it/en; a11y and language rows of `contract-detail` unchanged (its default state now shows several periods)
- [x] Skills: tdd, ponytail, ponytail-review
- [x] Checks: lint, check, deepcheck:audit, fallow, unit and DOM tests, E2E chromium + api contract-detail (28 passed), axe and language rows of contract-detail (12 passed)
- [ ] code-reviewer
- [ ] Personas
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-142.md`
- [ ] PR, CI, merge

Files: `src/lib/accounting-period.ts`, `src/routes/contracts/[id]/+page.server.ts`, `+page.svelte`, `MissingStatement.svelte`, `messages/*.json`, tests (`settings.test.ts`, `contract-actions.test.ts`, `contract-detail-page.dom.test.ts`, `contract-detail.feature` and its steps, targets, tasks, questions)
