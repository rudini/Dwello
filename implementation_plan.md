# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: second guide review R-1 to R-8

Request (chat): «Setze deine Empfehlung um, R-4 auch» from `docs/reviews/opus55-guide-review-2.md`. Rules only, no app behaviour, so no scenario. Same pull request as the G findings (not pushed yet).

- [x] R-2: one source per rule (rounds, the two exception kinds, Minor/Nit triage, `Refs` in the KI case, one pull request per issue); elsewhere only a pointer
- [x] R-4: glossary-term merge condition, split issues and a fix that closes two issues to skill `pull-request`; "its own slice for this limit" out of `CLAUDE.md`
- [x] R-1: cut, not move: the longest lines of `CLAUDE.md` (UI languages, Open work); `CLAUDE.md` 3'229 → 3'146 words, the rule files together 6'095 → 6'005
- [x] R-3: friction with a rule is noted at once as a plan item «Workflow note: …»
- [x] R-5: «or a loaded skill says to ask» out of "When to ask"
- [x] R-6: affected tests include those that read a changed file
- [x] R-7: descriptions of `slice-review` and `workflow-review` match their text
- [x] R-8: finish line of an issue is its "Done means" plus the workflow's "Done means"
- [ ] `code-reviewer` round
- [x] Checks: lint, check, type-check, the tests that read rule files
- [ ] Archive the session, push after #266 is merged, pull request, CI, merge
