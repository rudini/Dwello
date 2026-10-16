# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: less bookkeeping, findings and checks (guide review G-3, G-4, G-6)

Request (chat): «Setze auch G-3, G-4 und G-6 um» from `docs/reviews/opus55-guide-review.md`. Rules only, no app behaviour, so no scenario. Goes into the same pull request as G-1/G-2/G-5/G-8 (not pushed yet).

- [x] G-3: no `Red:` lines, no plan line per reviewer and round, no exit codes handed to reviewers; the checklist stays, a review item names its report (`CLAUDE.md`, `slice-review`, `code-reviewer`, `docs/test-pyramid.md`)
- [x] G-4: a Minor/Nit is fixed when trivial, else it stays in its report; open work only for a Blocker/Major of the two kinds; persona "Beobachtungen" stay in the report (`CLAUDE.md`, `slice-review`, `pull-request`, `docs/design/arbeitsregeln.md`)
- [x] G-6: before every push lint, check, type-check, the affected tests and scenarios; CI runs the full suites with the coverage floors (`CLAUDE.md` "Before marking anything complete", `pull-request`)
- [ ] `code-reviewer` round
- [x] Checks: lint, check, type-check, the rule tests (`open-work`, `commit-msg-gate`, deepcheck `readme`, `check-issues`)
- [ ] Archive the session, push after #266 is merged, pull request, CI, merge
