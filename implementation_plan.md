# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session I1: open issues, one after another (2026-10-19)

Branch `ccr-6c5f45f8-br8wl9`. Product owner: work the open issues one by one, bugs first, one pull request each.

### #439 «Weiter» in step 3 while the agreements load

- [x] @wip scenario: «Weiter» after the check failed says why the wizard waits (`statement-agreed-costs.feature`)
- [x] DOM test: the same while the check loads (`agreed-costs.dom.test.ts`)
- [x] Message in `AgreedCosts.svelte`, text in all four languages; axe and language state `agreements-failed` clicks «Weiter» too
- [x] Slice review round 1 (`docs/reviews/439-review-1.md`)
- [x] Feature review: personas Helga and Sven (`docs/design/personas/{helga,sven}-439.md`)
- [x] Fix Sven P-1, P-3 and Helga P-1: the wizard goes on once the check is done; failed text names «Erneut versuchen»
- [x] Re-review: code-reviewer round 2 (`docs/reviews/439-review-2.md`; C-4 fixed with the scenario «Nach erneuter Prüfung geht der Assistent zur Vorschau»), Sven and Helga (`docs/design/personas/{sven,helga}-439-2.md`)
- [x] Closing code-review round (`docs/reviews/439-review-3.md`, no Blocker/Major)
- [ ] PR `Fixes #439`
