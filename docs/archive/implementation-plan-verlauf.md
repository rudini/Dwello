

## Session 2026-10-16 (14): persona kit finds Playwright wherever the repo is checked out

Request (chat): `docs/design/tools/persona-kit.mjs` resolved `package.json` from `/home/user/Dwello`; in cloud sessions checked out as `/home/user/dwello` it could not load Playwright, and every persona copied and patched the kit (five times in the persona runs of #217). No scenario: tooling of the persona runs.

- [x] `persona-kit.mjs`: `createRequire(new URL('../../../package.json', import.meta.url))`, resolved from the kit itself
- [x] `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md`: import the kit in place instead of copying it (a copy would resolve `package.json` from the scratchpad); `persona-stack.sh` already resolves its own path on `main`
- [x] Smoke run: `persona-stack.sh`, a script in the scratchpad imports the kit and opens `/login` (200, signed in, redirected to `/dashboard` «Übersicht - Dwello»), also from a worktree checked out as `…/lc/dwello`
- [x] Checks: lint, check, test:coverage, backend test + type-check
- [x] code-reviewer round(s)
- [x] Archive session, push, PR

Files: `docs/design/tools/persona-kit.mjs`, `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md`.

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
