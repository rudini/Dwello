# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: fourth guide review T-1 to T-6

Request (chat): «Setze deine Empfehlung um» for `docs/reviews/opus55-guide-review-4.md` (T-1 to T-6). Rules only, no app behaviour, so no scenario.

- [x] T-1: step 1 loads the skill `bdd-acceptance`; its description says when; its run and selector lines point to `tests/e2e/CLAUDE.md` and "Conventions"
- [x] T-2: step 8 in three parts (start, during, end); the details of workflow notes in the skill `workflow-review`
- [x] T-3, T-4: "Done means" says the plan's session is moved to the archive, with several pull requests before the last one
- [x] T-5: step 4 says to keep working while the review runs
- [x] T-6: the test-database rule once (`backend/CLAUDE.md`), the other places point there; the UI-only sentence on `tdd`/`ponytail` goes
- [ ] `code-reviewer` round
- [x] Checks: lint, the tests that read rule files
- [ ] Archive the session, push, pull request, CI, merge
