# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: one source for the E2E rules (guide review G-10)

Request (chat): «Setze G-10 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Own pull request after #269 is merged.

- [x] `tests/e2e/CLAUDE.md`, "Rules", is the one source for failure states, negative checks, isolation and `@api`; `CLAUDE.md`, `docs/test-pyramid.md` and `.claude/agents/code-reviewer.md` point there
- [x] Nothing lost: every detail of the removed copies is in `tests/e2e/CLAUDE.md`
- [ ] `code-reviewer` round
- [x] Checks: lint, check, the tests that read rule files
- [ ] Archive the session, push after #269 is merged, pull request, CI, merge
