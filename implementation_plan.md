# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17: #211, #199 missing statements

- [x] Merge `origin/main` (#133 «Abgerechnet bis», #120 replaced statements) into the branch; drop the step-2 scenarios that wait on #281
- [x] Scenarios: partial range without a wizard button, «Abgerechnet bis» on dashboard and list, V-4 and V-8 of fachreview 1
- [x] fach-reviewer round 2 on the scenarios and the new texts (`docs/reviews/issue-211-fachreview-2.md`)
- [x] `missingPeriods` (accounting-period): uncovered intervals per ended period with rent days, «Abgerechnet bis», replaced statements
- [x] Contract page: uncovered ranges, invoice link per range, no wizard button for a partial range (#408)
- [x] Dashboard: every ended period since the Vertragsbeginn, by building
- [x] Contract list: badge «Abrechnung fehlt»
- [x] Texts in de/fr/it/en
- [x] Slice review (code-reviewer): `docs/reviews/issue-211-review-1.md`, round 2 `issue-211-review-2.md`
- [x] Feature review: personas `docs/design/personas/anna-211.md`, `helga-211.md`; fach-reviewer `docs/reviews/issue-211-fachreview-3.md`
- [x] Workflow note: issues closed into #408 during the task (markers and «Fixes» line), persona state set up by SQL (`docs/reviews/workflow-notes-issue-211.md`)
- [ ] Workflow notes, archive the session, pull request (Refs #408, #199; #211 closed into #408)

Files: `src/lib/accounting-period.ts`, `src/lib/server/missing-statements.ts`, `src/lib/overview.ts`, `src/lib/types.ts`, `src/routes/dashboard/+page.server.ts`, `src/routes/contracts/+page.server.ts`, `src/routes/contracts/ContractRow.svelte`, `src/routes/contracts/[id]/+page.server.ts`, `src/routes/contracts/[id]/MissingStatement.svelte`, `src/lib/server/statement-generation.ts` (marker), `messages/*.json`, tests and scenarios
