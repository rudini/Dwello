# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 38 - October 2026: glossary keeps only definitions (#188)

From issue #188 (decision #187, option A): rules of groups 1 and 2 move from `UBIQUITOUS_LANGUAGE.md` to the requirement documents (added there first where missing), group 3 is deleted, group 5 stays; the settings entry «Verwaltungspauschale» says only what the setting is. Editing the glossary is part of this task by the product owner's decision. No scenario: documentation only, no app behavior changes.

- [ ] Map every rule of groups 1 and 2 to its place in `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md` or `docs/PRD-Dwello.md` (and the scenario that shows it); add the missing ones there
- [ ] Reduce the glossary entries of groups 1 to 3 to their definitions; settings entry «Verwaltungspauschale»
- [ ] fach-reviewer on the diff (no rule lost, no definition changed in meaning)
- [ ] code-reviewer round (docs only)
- [ ] Workflow review not needed (no app changes, `CLAUDE.md` Workflow 7)
- [ ] Session archived, pull request
