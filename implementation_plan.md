# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: faster CI round trips (GitHub bottleneck)

Request: implement proposals 1 and 2 of the CI analysis (42 % of PR runs came from merging `main`, 48 % from docs commits).

- [x] Push to `main` runs the E2E tests and the axe check (`.github/workflows/ci.yml`), so a pull request no longer needs to be up to date with `main`
- [ ] Turn off "Require branches to be up to date" and turn on auto-merge (GitHub settings)
- [x] A pull request push that changes only documentation since the last green run of its branch skips the backend tests, E2E and axe (`tools/ci/docs-only-since.mjs`, `.github/workflows/ci.yml`)
- [x] Skill `pull-request`: merge `main` and auto-merge as the new settings allow
- No scenario: CI configuration, no app behaviour changes
- Files: `.github/workflows/ci.yml`, `tools/ci/docs-only-since.mjs`, `tools/ci/docs-only-since.test.ts`, `docs/test-pyramid.md`, `.claude/skills/pull-request/SKILL.md`
