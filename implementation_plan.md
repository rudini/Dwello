# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W1c: outdated drafts and other settings in the wizard preview (#132)

- [x] Plan: #132's "Done means" is worded like a decision issue; the decision (options 1 and 4) is the requirement. Option 1 here; option 4 («Neu berechnen» on a single draft) split off into #338
- [x] `@wip` scenarios in `tests/e2e/features/statement-generate.feature` and their steps, seen failing
- [x] fach-reviewer on the scenarios before implementing: `docs/reviews/w1c-fachreview-1.md` (V-1, V-2, M-1, V-4, V-5, V-7 taken into the scenarios and tests)
- [x] Preview names outdated drafts (stored invoice links of #96, `GET /statements/:id/changed-invoices`, helper `changedInvoiceCount` now shared with the statement detail) and, in the same period, statements with another Heizprofil, one edited since, or another rate per contract (run's, own, none), links to them, says existing statements are kept and where to choose the same settings (`src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `PreviewChecks.svelte`, `src/lib/server/statement.ts`, `src/routes/statements/[id]/+page.server.ts`); unit and DOM tests first (`statement-generation.test.ts`, `statement-wizard.dom.test.ts`)
- [x] Contracts: `statements.json` (contractId, heatingProfileId, managementFeePercent, createdAt), new `heating-profiles.json` with its check in `api-contracts.pg.test.ts`
- [x] Texts in `messages/{de,fr,it,en}.json`; a11y/language state `preview-outdated` (`tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tasks/accessibility.ts`, `fixtures/screens.ts`)
- [x] Preview without new statements (every contract billed, `PreviewEmpty.svelte`) names the outdated drafts only; scenario «Vorschau ohne neue Abrechnung nennt einen Entwurf, dem eine danach erfasste Rechnung fehlt»
- [x] Merge of `main` (additive conflicts in E2E steps and tasks only)
- [x] Slice review round 1: `docs/reviews/w1c-review-1.md` (C-1, C-5, C-8 fixed)
- [x] Feature review: personas Marco (`docs/design/personas/marco-w1c.md`, P-3 fixed, P-1 added to #338) and Dr. Weber (`weber-w1c.md`, P-2 fixed, P-1 under "Blocked on me"), Fachreview round 2 `docs/reviews/w1c-fachreview-2.md` (V-14, V-15 fixed)
- [x] `docs/PRD-Dwello.md`, wizard step «Review & Calculate»
- [x] Workflow review notes: `docs/reviews/workflow-notes-issue-132.md`
- [x] Second merge of `main` (no conflicts)
- [x] Closing code review round 2: `docs/reviews/w1c-review-2.md` (C-12 scenario «Vorschau nennt kein anderes Heizprofil bei einer Abrechnung über die ganze Periode», C-13 fixed)
- [ ] Code review round 3 on the C-12/C-13 fix
- [ ] Pull request `Fixes #132`, CI green, merged (session archived before the push)
