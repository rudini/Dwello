# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-16 (#97, #101: identity of a statement)

- [x] #97: a per-building, per-year number sequence that never gives a number twice; a deleted draft leaves a gap (`*.pg.test.ts`: two drafts, delete the second, generate again → `…-0003`); existing numbers unchanged; `docs/data-model.md` names where the sequence is kept
- [x] #97: scenario in `statement-generate.feature` (names its heating profile: the wizard's preselection can be a parallel scenario's deleted profile)
- [x] #101: the PDF download is named after the statement number (safe ASCII), download and inline view; unit test of the BFF route; scenario in `statement-detail.feature`
- [x] fach-reviewer on the scenarios before implementing: `docs/reviews/w3b-fachreview-1.md`; V-1 → #294
- [ ] slice review (code-reviewer), feature review
- [ ] pull request merged

Files: `backend/migrations/0007_statement_numbers.sql`, `backend/src/db/schema.ts`, `backend/src/services/calculation.service.ts`, `backend/src/routes/statements.ts`, `src/lib/server/statement.ts`, `src/routes/statements/[id]/pdf/+server.ts`, `src/routes/api/statements/[id]/pdf/+server.ts`, `docs/data-model.md`, tests (`statement-creation.pg`, `statement.routes.pg`, `statement-endpoints`, `statement-list-load`), E2E (`statement-generate`, `statement-detail` features, steps, tasks, questions)
