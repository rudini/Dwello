# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: no shouting in the tdd skill (guide review G-11)

Request (chat): «Setze G-11 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Own pull request after #270 is merged.

- [x] `.claude/skills/tdd/SKILL.md`: «DO NOT», «ONE … ONE» and «Never refactor while RED» in plain words with their reason; labels in examples (WRONG/RIGHT, GOOD/BAD) stay
- [ ] `code-reviewer` round
- [x] Checks: lint, the tests that read rule files
- [ ] Archive the session, push after #270 is merged, pull request, CI, merge
