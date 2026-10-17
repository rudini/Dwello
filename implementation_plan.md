# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17 CI: complete runs on main, balanced E2E shards, cached browsers

No scenario: CI configuration only, no app behaviour changes.

- [x] Runs on main are no longer cancelled by the next merge (`concurrency.cancel-in-progress` only for pull requests; 26 of the last 28 runs on main were cancelled)
- [x] E2E and axe shards balanced by measured duration instead of test count: 5 shards each (full PR suite timed locally: longest E2E shard 561 s → 235 s, axe 367 s → 245 s; a split by tag @i18n gave 241 s with more matrix code)
- [x] Playwright browsers cached between runs (a shared frontend build from the job Build was dropped: the shards would wait for it, about as long as they now build)
- [ ] Slice review (`code-reviewer`)
- [ ] Plan archived, pull request, CI

Files: `.github/workflows/ci.yml`, `docs/test-pyramid.md`
