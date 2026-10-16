# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: shard E2E and axe in CI

Request: make the CI E2E tests faster (follow-up to "axe check only on UI changes"). No issue. No scenario: CI only, no app behaviour changes.

- [x] `e2e-tests` matrix: "E2E tests" in 2, "Accessibility (axe)" in 3 Playwright shards; artifact names per shard (`.github/workflows/ci.yml`)
- [x] Job `e2e-results` keeps the checks "E2E tests" and "Accessibility (axe)" under their names (branch rules may require them): fails when a shard of its suite did
- [x] Workers stay at 2: the repository is private, its `ubuntu-latest` runners have 2 cores
- [x] actionlint clean; gate filter checked with a sample job list
- [x] `docs/test-pyramid.md` rows "Acceptance" and "Accessibility"
- [x] Checks: lint, check (the rest unaffected: no app code changed)
- [x] code-reviewer round
- code-reviewer round 1 (docs/reviews/ci-shards-review-1.md): fixed C-1 (gate requires `changes` to succeed and, on app changes, all shards of its suite to pass), C-3 (no longer applies: the gate counts passed shards), C-4; C-2 (more runner minutes) accepted as the price of the agreed approach, named in the pull request. No re-review: CI config, not code in the sense of Workflow 6
- [ ] Push, pull request, CI shows shard times, merge

Files: `.github/workflows/ci.yml`, `docs/test-pyramid.md`
