# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17: #211, #199 missing statements

- [x] Merge `origin/main` (#133 «Abgerechnet bis», #120 replaced statements) into the branch; drop the step-2 scenarios that wait on #281
- [ ] Scenarios: partial range without a wizard button, «Abgerechnet bis» on dashboard and list, V-4 and V-8 of fachreview 1
- [ ] fach-reviewer round 2 on the scenarios and the new texts
- [ ] `missingPeriods` (accounting-period): uncovered intervals per ended period with rent days, «Abgerechnet bis», replaced statements
- [ ] Contract page: uncovered ranges, invoice link per range, no wizard button for a partial range (#281)
- [ ] Dashboard: every ended period since the Vertragsbeginn, by building
- [ ] Contract list: badge «Abrechnung fehlt»
- [ ] Texts in de/fr/it/en
- [ ] Slice review (code-reviewer), feature review (personas Anna, Helga; fach-reviewer)
- [ ] Workflow notes, archive the session, pull request (Fixes #211, Refs #199, #281)

Files: 
