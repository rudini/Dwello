# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: third guide review S-1 to S-6

Request (chat): «Setze deine Empfehlung um» for `docs/reviews/opus55-guide-review-3.md` (S-1 to S-6). Rules only, no app behaviour, so no scenario. Own pull request after #271 is merged.

- [x] S-2: `bdd-acceptance` keeps the Dwello part and the Gherkin rules that hold here; the generic phases, examples and API variant go (2'073 → 465 words; the rule files together 14'939 → 13'380)
- [x] S-1: the `bdd-acceptance` question out of "When to ask"
- [x] S-3: workflow-note rule from step 7 "Rounds" to step 8 "Plan"
- [x] S-4: the two new facts of `arbeitsregeln.md`, "Persona runs: how", into the personas README; `persona.md` and the README point to the README only
- [x] S-5: circular pointer in `backend/CLAUDE.md` out
- [x] S-6: `pull-request` points to "Before marking anything complete" instead of a short copy
- [ ] `code-reviewer` round 1 (docs/reviews/s16-review-1.md): C-1 (Major: navigation-scenario rule lost in the cut) restored, C-2..C-4 fixed; round 2 on the delta
- [x] Checks: lint, check, the tests that read rule files
- [ ] Archive the session, push after #271 is merged, pull request, CI, merge
