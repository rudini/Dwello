# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (14): #229 Heizprofil share in statements: older PDFs, short periods, detail page

Request (chat): after the bugs, work through the open issues without `entscheiden` whose «Done means» needs no confirmation, one pull request each; this is the first, a follow-up of #209.

Plan: F-6: the stored share also keeps the period's sum (`periodPercent`); the PDF adds «zusammen x % von y % der Abrechnungsperiode» to the month list (new text, four languages). F-3: a statement created before #209 prints the month list only when the recomputed share equals its heating position's `period_share`, and takes the percent from that position. F-7: the detail page names the profile as stored. Rounding (comment on the issue): the stored percent is computed as `period_share`, so note and line show one value.

- [x] Scenario «PDF nennt bei einer Periode unter einem Jahr die Monatsanteile der Periode» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "zusammen 43.00 % von 50.00 % der Abrechnungsperiode"` – the PDF lists the months without their sums (86.00 % and the months are there); the wording changed after fach-reviewer F-1 to «zusammen 43.00 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 50.00 %»
- [x] fach-reviewer on the `@wip` scenario and the new text before implementing
  fach-reviewer round 1 (`docs/reviews/issue-229-fachreview-1.md`): fixed F-1 (Major, «43 % von 50 %» read as a product and as half the period: new wording «; zusammen x %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen y %», without the proposed division because of F-2), F-2 (Minor, part: the tenant's sum from the printed months; whether the share should follow the rounded months changes amounts -> #232 `entscheiden`), F-3 (Minor, the clause whenever the period does not carry 100.00 %, also over a year or with a profile at 100.05 %), F-4 (Minor, a whole-year test checks no clause), F-5 (Nit, scenario title «… die Summen der Monatsanteile»), F-6 (Nit, non-breaking space before «%»); F-7 (Nit, the period's months are not listed) and F-8 (Nit, the old-statement check compares the result only) -> #232
- [x] F-6: test first, `periodPercent` stored (from `handleMidYearMoves`), PDF text `heatingPeriodSums` in de/fr/it/en
  Test red: «nennt bei einer Periode unter einem Jahr die Summen der Monate» – the month list without the sums
- [x] F-3: test first (statement without `heating_share`, profile changed: no months, percent from the line); `heatingOf` split into stored and `recomputedHeating` (fallow CRAP)
  Test red: «nennt bei einer früher erstellten Abrechnung keine Monate, die nicht mehr zum Anteil passen» – 40.00 % with the changed profile's months
- [x] F-7: test first (detail page names the stored profile; `tests/contracts/statement.json` names `heatingShare`)
  Test red: «nennt das Heizprofil, wie die Abrechnung es gespeichert hat» – expected 'Standard' to be 'Winter'
- [x] Rounding: test first (half-way share 70.975 %: note and line equal), the stored percent computed like `period_share`
  Test red: «nennt in der Erläuterung denselben Anteil wie in der Position» – note 70.97 %, line 70.98 %
  Skills: tdd, ponytail, ponytail-review (no findings)
- [x] Checks: test:coverage (2487), lint, check, backend test (633) + type-check, deepcheck:audit, `bunx fallow audit`, E2E chromium + api on all statement features, dashboard and heating profiles (121 passed)
- [ ] code-reviewer round(s)
  code-reviewer round 1 (`docs/reviews/issue-229-review-1.md`): fixed C-1 (Major, scenarios «Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen» and «PDF nennt in der Erläuterung denselben Anteil nach dem Heizprofil wie in der Position», each red with its fix taken out: «Heizprofil Sommer …» instead of «Winter …», and no «70.98 % der Heizkosten»; F-3: No scenario: a statement created before #209 has no `heating_share`, a state the E2E stack cannot produce, as it creates every statement with the current code; the pg tests show it), C-2 (Minor, an older statement of a short period prints the sums too), C-3 (Minor, the older-statement check rounds as the calculation; test «nennt bei einer früher erstellten Abrechnung die Monate und Summen, solange sie zur Position passen», red: no months on the half-way share), C-7 (Nit, scenario-red line), C-8 (Nit, variable name); rejected C-4: the contract's `heatingShare` stays `null` because the API test's rental runs the whole year (`byDays`), the names' shape is typed in `schema.ts` and set by `heatingOfRun`; C-5 (Minor, an older statement shared by days whose profile now gives months names the profile; existed before) -> comment on #232; C-6 (Minor, a statement shared by days names the profile as it is now on the detail page) -> comment on #227
- [ ] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text), persona for the detail page if its text changes
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-229.md`
- [ ] Archive session, push, PR `Fixes #229`, CI, merge
