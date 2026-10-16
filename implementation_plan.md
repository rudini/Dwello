# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (14): #229 Heizprofil share in statements: older PDFs, short periods, detail page

Request (chat): after the bugs, work through the open issues without `entscheiden` whose «Done means» needs no confirmation, one pull request each; this is the first, a follow-up of #209.

Plan: F-6: the stored share also keeps the period's sum (`periodPercent`); the PDF adds «zusammen x % von y % der Abrechnungsperiode» to the month list (new text, four languages). F-3: a statement created before #209 prints the month list only when the recomputed share equals its heating position's `period_share`, and takes the percent from that position. F-7: the detail page names the profile as stored. Rounding (comment on the issue): the stored percent is computed as `period_share`, so note and line show one value.

- [x] Scenario «PDF nennt bei einer Periode unter einem Jahr die Monatsanteile der Periode» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "zusammen 43.00 % von 50.00 % der Abrechnungsperiode"` – the PDF lists the months without their sums (86.00 % and the months are there)
- [ ] fach-reviewer on the `@wip` scenario and the new text before implementing
- [ ] F-6: test first, `periodPercent` stored, PDF text in de/fr/it/en
- [ ] F-3: test first (statement without `heating_share`, profile changed: no months, percent from the line)
- [ ] F-7: test first (detail page names the stored profile)
- [ ] Rounding: test first (half-way share: note and line equal)
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
- [ ] code-reviewer round(s)
- [ ] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text), persona for the detail page if its text changes
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-229.md`
- [ ] Archive session, push, PR `Fixes #229`, CI, merge
