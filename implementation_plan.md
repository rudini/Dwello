# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: CI on pull requests in Chromium only, red main gets an owner

Request: implement proposals 1 and 3 of the follow-up CI recommendations.

- [x] Pull requests run the E2E tests in Chromium and the API driver only (1098 instead of 3240 tests); every browser on push to `main` and nightly (`.github/workflows/ci.yml`)
- [x] A red run on `main` opens or comments on the issue «CI auf main ist rot», a green one closes it (job "Main status")
- [x] Skill `pull-request`, "After the merge": the merging session checks the run of `main` with its merge and fixes a failure
- [ ] `code-reviewer` round 1
- No scenario: CI configuration, no app behaviour changes
- Files: `.github/workflows/ci.yml`, `.claude/skills/pull-request/SKILL.md`, `docs/test-pyramid.md`, `docs/tech-stack.md`, `tests/e2e/CLAUDE.md`
