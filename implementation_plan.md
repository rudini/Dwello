# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 38 - October 2026: glossary keeps only definitions (#188)

From issue #188 (decision #187, option A): rules of groups 1 and 2 move from `UBIQUITOUS_LANGUAGE.md` to the requirement documents (added there first where missing), group 3 is deleted, group 5 stays; the settings entry «Verwaltungspauschale» says only what the setting is. Editing the glossary is part of this task by the product owner's decision. No scenario: documentation only, no app behavior changes.

- [x] Map every rule of groups 1 and 2 to its place in `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md` or `docs/PRD-Dwello.md` (and the scenario that shows it); add the missing ones there (new sections «Regeln in Dwello» in both requirement docs; stale PRD lines aligned to the code as decided on #188)
- [x] Reduce the glossary entries of groups 1 to 3 to their definitions; settings entry «Verwaltungspauschale»
  Files: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md`, `docs/PRD-Dwello.md`, `implementation_plan.md`
- [ ] Pull request lists each rule with its new place and names the help texts that quote a moved rule (`glossary_*_text`, `config_help_*`)
- [x] fach-reviewer on the diff (no rule lost, no definition changed in meaning)
  fach-reviewer round 1 (`docs/reviews/glossary-fachreview-1.md`): open GF-2 (Major, existed before, product decision: #89), fixed GF-1, GF-3, GF-5, GF-6, GF-7, GF-8, GF-9, GF-10, GF-4 described as the code is and opened #191, GF-11 noted (no change)
  fach-reviewer round 2 (`docs/reviews/glossary-fachreview-2.md`): open GF-2 (Major, existed before, #89), fixed GF2-1, GF2-2, GF2-3; heating profile with a Leistungszeitraum named in rule 5 as open in #71
- [x] code-reviewer round (docs only)
  code-reviewer round 1 (`docs/reviews/glossary-review-1.md`): fixed GR-1, GR-2, GR-3 (missing update test: `offene-punkte.md` O-22), GR-4, GR-5, GR-6, GR-8; GR-7 named in the pull request
- [ ] Workflow review not needed (no app changes, `CLAUDE.md` Workflow 7)
- [ ] Session archived, pull request
