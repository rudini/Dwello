# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: project rules only (guide review G-9)

Request (chat): «Setze G-9 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario.

- [x] `CLAUDE.md`, "Coding guidelines": only the Dwello rules stay (issue text wrong in a detail, decided texts, one mapper per response); generic advice goes ("state assumptions", "push back", "Stay in scope", "Surgical changes": the ask list, the formatting gotcha, fallow and `code-reviewer` cover them)
- [x] `.claude/skills/tdd`: philosophy, SOLID and the checklist per cycle go; `mocking.md`, `tests.md`, `refactoring.md` go, `docs/test-pyramid.md` is the source for test doubles (`mocking.md` allowed mocking the database, which Dwello forbids)
- [ ] `code-reviewer` round
- [x] Checks: lint, the tests that read rule files
- [ ] Archive the session, push, pull request, CI, merge
