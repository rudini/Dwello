# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: axe check only on UI changes

Request: the CI accessibility (axe) check runs only when a pull request changes the UI. No issue. No scenario: CI only, no app behaviour changes.

- [x] `changes` job outputs `ui`; job "Accessibility (axe)" skips its steps when it is `false`, so the required check still reports (`.github/workflows/ci.yml`)
- [x] Filter checked locally with sample change lists (backend only, unit tests only, other feature file, docs/tools: skipped; page, messages, e2e steps, accessibility.feature, bun.lock: runs)
- [x] `docs/test-pyramid.md` row "Accessibility" updated
- [ ] code-reviewer round
- [ ] Workflow review `docs/reviews/workflow-rules-review-axe-ui-only.md`
- [ ] Checks before push, push, pull request, CI green, merge
