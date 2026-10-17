# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W3f: #76 Akonto and new-cost hints for a befristeter Mietvertrag, #119 preset with differing statements

- [x] #76: `@wip` scenario (Akonto-raise and new-cost hints of a running befristeter Mietvertrag), fach-reviewer before implementing
- [x] Fach review round 1 of both scenarios: `docs/reviews/w3f-fachreview-1.md`
- [x] #76: befristeter Mietvertrag gets the decided text (option A) in `akontoHint` (with the form rule, fach-review M-1) and the new-cost finding (after the form rule, V-4); unbefristete keep today's text; F-10b thresholds stay
- [x] #76: `TODO(fachlich prüfen, #76)` marker removed from `src/lib/statement-wizard.ts`
- [x] #119: scenario (other statements of the period with different Heizprofile)
- [x] #119: `chosen()` keeps the settings' defaults when the other statements differ in Heizprofil or Verwaltungspauschale (null profiles skipped, V-5), `PresetNotice.svelte` says so (four languages); tests in `statement-generate-actions.test.ts`
- [ ] Slice reviews, feature review (persona, fach-reviewer), plan archived, PR merged

Files: `src/lib/statement-wizard.ts`, `src/lib/server/statement-generation.ts`, `src/routes/statements/generate/{+page.server.ts,preview.ts,PresetNotice.svelte,CategoryCheck.svelte,CategoryFindingItem.svelte}`, `messages/*.json`, tests in `src/__tests__/statement-{wizard,generation,generate-actions}*.ts`, `tests/contracts/building-contracts.json`, `tests/e2e/{features/statement-generate.feature,steps,targets,questions}`
