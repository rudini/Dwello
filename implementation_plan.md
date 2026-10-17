# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W3f: #76 Akonto and new-cost hints for a befristeter Mietvertrag, #119 preset with differing statements

- [ ] #76: `@wip` scenario (Akonto-raise and new-cost hints of a running befristeter Mietvertrag), fach-reviewer before implementing
- [ ] #76: befristeter Mietvertrag gets the decided text (option A) in `akontoHint` and the new-cost finding; unbefristete keep today's text; F-10b thresholds stay
- [ ] #76: `TODO(fachlich prüfen, #76)` marker removed from `src/lib/statement-wizard.ts`
- [ ] #119: `@wip` scenario (other statements of the period with different Heizprofile)
- [ ] #119: `chosen()` keeps the settings' defaults when the other statements differ in Heizprofil or Verwaltungspauschale, `PresetNotice.svelte` says so (four languages); test in `statement-generate-actions.test.ts`
- [ ] Slice reviews, feature review (persona, fach-reviewer), plan archived, PR merged
