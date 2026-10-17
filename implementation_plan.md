# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17 CI: complete runs on main, balanced E2E shards, cached browsers

No scenario: CI configuration only, no app behaviour changes.

- [ ] Runs on main are no longer cancelled by the next merge (`concurrency.cancel-in-progress` only for pull requests)
- [ ] E2E and axe shards balanced by measured duration instead of test count
- [ ] Playwright browsers cached between runs
- [ ] Slice review (`code-reviewer`)
- [ ] Plan archived, pull request, CI
