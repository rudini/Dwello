# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W1c: outdated drafts and other settings in the wizard preview (#132)

- [x] Plan: #132's "Done means" is worded like a decision issue; the decision (options 1 and 4) is the requirement. Option 1 here; option 4 («Neu berechnen» on a single draft) split off into #338
- [x] `@wip` scenarios in `tests/e2e/features/statement-generate.feature` and their steps, seen failing
- [x] fach-reviewer on the scenarios before implementing: `docs/reviews/w1c-fachreview-1.md` (V-1, V-2, M-1, V-4, V-5, V-7 taken into the scenarios and tests)
- [x] Preview names outdated drafts (stored invoice links of #96, `GET /statements/:id/changed-invoices`, helper `changedInvoiceCount` now shared with the statement detail) and, in the same period, statements with another Heizprofil, one edited since, or another rate per contract (run's, own, none), links to them, says existing statements are kept and where to choose the same settings (`src/lib/server/statement-generation.ts`, `src/lib/statement-wizard.ts`, `PreviewChecks.svelte`, `src/lib/server/statement.ts`, `src/routes/statements/[id]/+page.server.ts`); unit and DOM tests first (`statement-generation.test.ts`, `statement-wizard.dom.test.ts`)
- [x] Contracts: `statements.json` (contractId, heatingProfileId, managementFeePercent, createdAt), new `heating-profiles.json` with its check in `api-contracts.pg.test.ts`
- [x] Texts in `messages/{de,fr,it,en}.json`; a11y/language state `preview-outdated` (`tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tasks/accessibility.ts`, `fixtures/screens.ts`)
- [ ] Slice review round 1
- [ ] Feature review (personas)
- [ ] Closing review, workflow review, session archived, pull request `Fixes #132`, merged
