# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W16b: E2E races O-36 and O-37 (product owner's choice for PR #417)

Branch `claude/w16b-e2e-races`. Non-functional (rows in `docs/design/offene-punkte.md`); no issue. No scenario: it fixes a race between test data and a backend write, not a behaviour the Liegenschaftsverwalter sees.

- [x] O-37 root cause: the whole E2E database had no building while «draft-dropped» and «draft-discard-dialog» ran first; `restoreDraft` ticks the first building (or tenant) but the two draft states seeded nothing. Fix: `seedFor` seeds the screen records for `draft-restored` and `draft-discard-dialog` (the failing pair seen red, then green; all 8 draft rows green)
- [x] O-36: `saveConfig` upserts on `key`; pg test with ten parallel first writes (red with a warmed pool, then green)
- [x] rows moved to `docs/archive/offene-punkte-verlauf.md`
- [ ] closing code-reviewer round; pull request, merge; then merge main into #417

Files: `backend/src/services/config.service.ts`, `backend/src/__tests__/config.pg.test.ts`, `tests/e2e/fixtures/screens.ts`, `docs/design/offene-punkte.md`, `docs/archive/offene-punkte-verlauf.md`.
