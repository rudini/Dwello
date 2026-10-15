# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (6): bug #137, PDF says «nach Heizprofil» when heating costs were shared by days

Task: open `bug` issues one by one (#122, #123, #125, #126, #127, #128, #135 merged in rudini/Dwello#181, #182, #189, #196, #197, #198, #203); now #137. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194.

- [x] Scenario `@wip` «Heizkosten einer Sommerperiode stehen im PDF nach Tagen» in `statement-detail.feature`: a move-in on 15.07.2024 in the period 01.06.–31.08.2024 of a profile with 0 % from June to August; the PDF shows the days, no «nach Heizprofil». Scenario red: expected «48/92 Tage», the PDF showed «52.17 %» and «Heizkosten nach Heizprofil «Winter»: 52.17 % … Jul 0.00 %, Aug 0.00 %»
- [ ] fach-reviewer on the scenario (PDF, heating costs)
- [ ] The calculation says when it shared heating costs by days (`handleMidYearMoves`); the PDF follows it (lower-layer test first)
- [ ] Skills: tdd, ponytail, ponytail-review
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, E2E
- [ ] code-reviewer
- [ ] daten-pruefer (PDF)
- [ ] Personas (only if what the PDF shows a persona changes)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-137.md`
- [ ] PR, CI, merge
