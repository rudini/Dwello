

## Session 2026-10-16 (14): persona kit finds Playwright wherever the repo is checked out

Request (chat): `docs/design/tools/persona-kit.mjs` resolved `package.json` from `/home/user/Dwello`; in cloud sessions checked out as `/home/user/dwello` it could not load Playwright, and every persona copied and patched the kit (five times in the persona runs of #217). No scenario: tooling of the persona runs.

- [x] `persona-kit.mjs`: `createRequire(new URL('../../../package.json', import.meta.url))`, resolved from the kit itself
- [x] `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md`: import the kit in place instead of copying it (a copy would resolve `package.json` from the scratchpad); `persona-stack.sh` already resolves its own path on `main`
- [x] Smoke run: `persona-stack.sh`, a script in the scratchpad imports the kit and opens `/login` (200, signed in, redirected to `/dashboard` «Übersicht - Dwello»), also from a worktree checked out as `…/lc/dwello`
  Skills: none loaded (one-line tooling fix); no tdd: the kit has no test layer, the smoke run shows it
- [x] Checks: lint (first run red: `'URL' is not defined` in the kit, fixed), check (0 errors), test:coverage (2486), backend test (630) + type-check, fallow and deepcheck gates
- [x] code-reviewer round(s)
  code-reviewer round 1 (`docs/reviews/persona-kit-review-1.md`; general-purpose subagent with `.claude/agents/code-reviewer.md`, the agent type is not registered in this session): fixed C-1 (Minor, items ticked before done), C-2 (Minor, no `Skills:` line)
- [x] Archive session, push, PR (opened after archiving)

Files: `docs/design/tools/persona-kit.mjs`, `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md`, `docs/reviews/persona-kit-review-1.md`.

## Session 2026-10-16 (13): #209 statement PDF recomputes the heating share with the current Heizprofil

Request (chat): work through the open bug issues one by one (sessions 10 to 12 in the archive); this is the fourth and last one without `entscheiden`, #208 merged in #228.

Cause: `heatingOf` (`backend/src/services/statement-pdf.service.ts`) calls `handleMidYearMoves` with the profile as it is when the PDF is made; the line amounts were calculated with the profile as it was when the statement was created. Plan: the calculation returns the heating share and the month list it used, the statement stores them (new jsonb column `heating_share`, migration `0004`), the PDF prints them; a statement created before keeps today's recomputation.

- [x] Scenario «PDF zeigt den Heizanteil, mit dem die Abrechnung erstellt wurde» (`statement-detail.feature`, `@wip`) red
  Scenario red: `steht im PDF "43.00 % der Heizkosten"` – the PDF shows the share by the changed profile (Januar 30 + Februar 20 + März 10)
- [x] fach-reviewer on the `@wip` scenario before implementing
  fach-reviewer round 1 (`docs/reviews/issue-209-fachreview-1.md`): fixed F-1 (Major, the profile's names are stored too, so a renamed or deleted own profile is still named), F-2 (Major, «shared by days» is stored as `{ byDays: true }`, null means created before), F-4 (Minor, the scenario checks the line «43.00 % 430.00»; F-1 and F-2 shown in pg tests), F-5 title (scenario renamed without a new term); open F-5 terms (Minor) -> #75; F-3 (Minor, older statements), F-6 (Minor, existed before, months of a short period do not add up to the printed percent), F-7 (Minor, detail page names the current profile) -> #229; F-8 (Nit, help text or block when an own profile changes) -> #230 (`entscheiden`)
- [x] Test first (`statement-pdf.pg.test.ts`: a statement with a custom profile, the profile changes, the PDF keeps the share), column `heating_share` (migration `0004_statement_heating_share.sql`, `schema.ts`, `docs/data-model.md`), calculation returns it (`heatingOfRun`), statement stores it with the profile's names, PDF prints it
  Test red: «druckt den Anteil und die Monate, mit denen die Abrechnung gerechnet ist» – the note with the changed profile's 40 %; «nennt das Heizprofil auch nach dem Umbenennen und Löschen …» – no profile note after the deletion; «bleibt bei den Mietstagen, wenn das Heizprofil später den Monaten der Periode einen Anteil gibt» – the changed profile's note instead of 62/92 Tage
  Skills: tdd, ponytail, ponytail-review (no findings)
- [x] Checks: test:coverage (2486), lint, check, backend test (630) + type-check, deepcheck:audit, `bunx fallow audit`, E2E chromium + api on all statement features, dashboard and heating profiles (120 passed)
- [x] code-reviewer round(s)
  code-reviewer round 2 (`docs/reviews/issue-209-review-2.md`): C-1 to C-4 confirmed; fixed C-5 (Nit, the fallback test's name and comment say what it shows and name #229), C-6 (Nit, plan wording); the branch without a profile in `heatingOfRun` has no own test: the foreign key of `heating_profile_id` refuses a statement with an unknown profile, so it is reached only if the profile is deleted between calculation and saving
  code-reviewer round 1 (`docs/reviews/issue-209-review-1.md`): fixed C-1 (Minor, test «rechnet bei einer früher erstellten Abrechnung mit dem Heizprofil, wie es jetzt ist», red without the fallback), C-2 (Minor, `docs/api-specification.md` names `heating` of the preview and `heatingShare` of the detail), C-3 (Nit, `heatingOfRun` reads the profile and its names itself; the helper with two non-null assertions is gone; `handleMidYearMoves` reads the profile once more), C-4 (Nit, double blank line gone with it)
- [x] Feature review: fach-reviewer, daten-pruefer (PDF, statements), persona Dr. Weber only if a PDF text changes (none changes: no persona)
  fach-reviewer round 2 (`docs/reviews/issue-209-fachreview-2.md`): F-1, F-2, F-4, F-5 title confirmed, hand-offs #229, #230, #75 confirmed; fixed V-1 (Nit, `docs/data-model.md`: empty also without heating costs), V-2 (Nit, the fallback test names #229)
  daten-pruefer round 1 (`docs/reviews/issue-209-datenpruefung-1.md`; a first run was lost to a container restart and started again): all 17 demo statements to the Rappen, unchanged since #208, `heating_share` right in all (15 by days, two moves by the profile with names), PDFs in four languages and 14 QR-bills right; fixed D-1 (Nit, the stored percent was unrounded, 44.199999…; stored on two places like the months; test «speichert den Anteil nach dem Heizprofil auf zwei Stellen», red with 44.199999999999996); observation (detail page names the linked profile) -> already #229 (F-7)
- [x] Fixes of the feature review as a new slice (Workflow 7)
  Skills: tdd, ponytail, ponytail-review (no findings)
  code-reviewer round 1 of this slice (`docs/reviews/issue-209-review-3.md`): rounding confirmed (the note equals the earlier one); open C-1 (Minor, existed before: note and line can differ by 0.01 % on an exact half-way share) -> #229; fixed C-2 (Minor, this Skills line), C-3 (Nit, this item ticked only with its round)
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-209.md`
- [x] Archive session, push, PR `Fixes #209`, CI, merge (pull request opened after archiving; merge follows green CI)

Files: `backend/src/services/{calculation,statement,statement-pdf}.service.ts`, `backend/src/db/schema.ts`, `backend/migrations/0004_statement_heating_share.sql`, `backend/src/__tests__/statement-pdf.pg.test.ts`, `tests/e2e/features/statement-detail.feature`, `tests/e2e/steps/statement-detail.steps.ts`, `tests/e2e/fixtures/backend.ts`, `docs/data-model.md`, `docs/api-specification.md`, `docs/reviews/issue-209-{fachreview-1,fachreview-2,datenpruefung-1,review-1,review-2,review-3}.md`, `docs/reviews/workflow-rules-review-issue-209.md`

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
- [x] Checks (final): test:coverage (2487), lint, check, backend test (636) + type-check, deepcheck:audit, `bunx fallow audit`, E2E chromium + api on all statement features, dashboard and heating profiles (123 passed)
- [x] code-reviewer round(s)
  code-reviewer round 1 (`docs/reviews/issue-229-review-1.md`): fixed C-1 (Major, scenarios «Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen» and «PDF nennt in der Erläuterung denselben Anteil nach dem Heizprofil wie in der Position», each red with its fix taken out: «Heizprofil Sommer …» instead of «Winter …», and no «70.98 % der Heizkosten»; F-3: No scenario: a statement created before #209 has no `heating_share`, a state the E2E stack cannot produce, as it creates every statement with the current code; the pg tests show it), C-2 (Minor, an older statement of a short period prints the sums too), C-3 (Minor, the older-statement check rounds as the calculation; test «nennt bei einer früher erstellten Abrechnung die Monate und Summen, solange sie zur Position passen», red: no months on the half-way share), C-7 (Nit, scenario-red line), C-8 (Nit, variable name); rejected C-4: the contract's `heatingShare` stays `null` because the API test's statement has no heating invoice (code review round 2, C-11), the names' shape is typed in `schema.ts` and set by `heatingOfRun`; C-5 (Minor, an older statement shared by days whose profile now gives months names the profile; existed before) -> comment on #232; C-6 (Minor, a statement shared by days names the profile as it is now on the detail page) -> comment on #227
  Scenario red (C-1): «Abrechnung nennt ihr Heizprofil auch nach dem Umbenennen» – `nennt die Abrechnung das Heizprofil "Winter"`: received «Heizprofil Sommer …»; «PDF nennt in der Erläuterung denselben Anteil …» – `steht im PDF "70.98 % der Heizkosten"`: the note said 70.97 %
  Test red (C-2, C-3): «nennt bei einer früher erstellten Abrechnung die Monate und Summen, solange sie zur Position passen» – no «Anteile der Monate» on the half-way share
  code-reviewer round 2 (`docs/reviews/issue-229-review-2.md`): C-1 to C-3, C-7, C-8 confirmed, rejection of C-4 holds; fixed C-9 (Nit, these red lines), C-10 (Nit, the older whole-year statement prints no sums), C-11 (Nit, reason of C-4)
- [x] Feature review: fach-reviewer, daten-pruefer, persona Dr. Weber (PDF text), persona for the detail page if its text changes (no text changes there)
  fach-reviewer round 2 (`docs/reviews/issue-229-fachreview-2.md`): F-1 to F-6 confirmed, hand-offs to #232 confirmed; fixed V-1 (Minor, a share stored under #209 had the old rounding and no period sum: the note takes the heating position's share; test «nennt bei einer unter #209 gespeicherten Abrechnung den Anteil der Position», red: 70.97 %), V-2 (Nit, English «in total»)
  Test red (V-1): «nennt bei einer unter #209 gespeicherten Abrechnung den Anteil der Position» – the note printed 70.97 %
- [x] Fixes of the feature review as a new slice (Workflow 7)
  Skills: tdd, ponytail, ponytail-review (no findings)
  code-reviewer round 1 of this slice (`docs/reviews/issue-229-review-3.md`): V-1 confirmed; fixed C-12 (Minor, render test «nennt bei einer Periode unter einem Jahr die Summen der Monate, auch auf Englisch», red with «together»), C-13 (Minor, this Skills line), C-14 (Nit, the Test red line above)
  daten-pruefer round 1 (`docs/reviews/issue-229-datenpruefung-1.md`): 17 statements, amounts, stored shares, PDFs in four languages and the QR-bill right; the clause's case (a period under a year with a move) is not in the demo data -> round 2 after the persona creates it
  persona Dr. Weber round 1 (`docs/design/personas/weber-issue-229.md`): no review: the four demo drafts 2025 of «Seepark Residenz» overlap the period 01.01.–30.09.2025, the persona may not delete them -> run again after deleting them in `dwello_persona` by SQL
  persona Dr. Weber round 2 (`docs/design/personas/weber-issue-229-2.md`; the four drafts deleted by SQL first, `DELETE FROM utility_statements … building 22222222-…, period_start 2025-01-01, status draft`): the share recomputes (55.80 / 66.80 = 83.53 %); fixed P-2 in part (Minor, the clause ends with a full stop, four languages; tests pin it, red without); P-1 (Minor, the period's months are not listed) and the division of P-2 -> already #232 (F-7, F-2); P-3, P-4 (Nit, existed before: no pointer from the line to page 2, «Heizkosten Ihrer Wohnung» against «Wohnungsanteil») and observations -> `offene-punkte.md` U-38
  daten-pruefer round 2 (`docs/reviews/issue-229-datenpruefung-2.md`): the four drafts 01.01.–30.09.2025 of «Seepark Residenz» to the Rappen, stored shares (83.53 % and 16.47 % of 66.80 %), the clause in four languages and the QR-bill right; no findings
- [x] Workflow review `docs/reviews/workflow-rules-review-issue-229.md`
- [x] Archive session, push, PR `Fixes #229`, CI, merge (pull request opened after archiving; merge follows green CI)

Files: `backend/src/services/{prorating,calculation,statement-pdf,pdf}.service.ts`, `backend/src/db/schema.ts`, `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `src/lib/server/statement.ts`, `src/__tests__/statement-mapping.test.ts`, `tests/contracts/statement.json`, `tests/e2e/features/statement-detail.feature`, `tests/e2e/steps/statement-detail.steps.ts`, `tests/e2e/fixtures/backend.ts`, `docs/design/offene-punkte.md`, `docs/design/personas/weber-issue-229{,-2}.md`, `docs/reviews/issue-229-{fachreview-1,fachreview-2,datenpruefung-1,datenpruefung-2,review-1,review-2,review-3}.md`, `docs/reviews/workflow-rules-review-issue-229.md`
