# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session I2: open issues, one after another, continued (2026-10-19)

Branch `ccr-6c5f45f8-br8wl9`. Product owner: «Weiter mit issues» after Session I1. No open bug; #470 waits for a decision.

### Session C1 (another branch): E2E in every browser on pull requests

Branch `ccr-01e823d6-yhj5kc`. Product owner 2026-10-19: instead of a merge queue (only for repositories of an organisation), pull requests run the E2E tests in every browser, so a race only Firefox or WebKit loses shows before the merge (runs 595 to 614 on `main`). No scenario: CI only.

- [x] `ci.yml`: E2E on pull requests with Chromium, Firefox, WebKit and `api` (60 min, as `main`); the axe check stays Chromium; `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`
- [x] Slice review (`docs/reviews/ci-browsers-review-1.md`): C-1 `docs/tech-stack.md` fixed; C-2 (the axe shards get 60 min on pull requests too) kept, harmless
- [ ] PR: the first pull request with every browser shows the time it takes; its first run found a Firefox failure in «Suche ohne Treffer», cause not found (O-41)

### #464 Akonto with a validity date and PDF line months × amount

Design: a table of Akonto amounts per Mietvertrag with the day from which each applies (migration: one row per contract from its Vertragsbeginn with today's amount; sent statements keep their stored totals); the statement sums each amount over the months (split months by days, as today) it applied; a berichtigte Abrechnung recalculates and so uses the amounts of its period; the contract keeps `monthlyAdvancePayment` as the amount that applies today. Coordinate with #453 (Akonto row «ab {Datum}»).

- [x] @wip scenarios (contract-edit, statement-generate, statement-detail), committed; fach-reviewer before the implementation (domain rule, amounts, PDF)
- [x] Steps and tests red until the review reports
- [x] fach-reviewer round 1 (`docs/reviews/464-fachreview-1.md`: F-1 to F-6 Major, F-7 to F-14 Minor, F-15 Nit); product owner 2026-10-19 (recorded in #464): F-4 option A (warning at the correction), «Gültig ab» only the first of a month within the contract, refusal when a stored statement's Akonto would change, the same day replaces and later entries can be deleted; glossary issue #477 (F-11, marker on «Gültig ab»)
- [x] Scenarios after the review: correction with a change inside 2024 (F-8), PDF lines with closed ranges and «Monate», total and the note (F-6, F-7, F-9), refusal (F-3), warning (F-4); all seven seen red at the missing behaviour
- [x] Migration and schema; calculation over several amounts; contract API and form (amount with «gültig ab»); contract page lists the amounts; PDF lines; help texts in four languages (backend 7ff3c3db; frontend: `contract-form.ts`, `RentStep.svelte`, `ContractForm.svelte`, `ContractTerms.svelte`, contract page action `deleteAdvance`, `Correction.svelte`, `CostTable.svelte`, `messages/*.json`, `docs/data-model.md`, `docs/api-specification.md`)
- [x] Delete a later Akonto (product owner on F-13): scenario «Ein späteres Akonto löschen», seen red; axe and language state `advance-delete-dialog`; the berichtigte Abrechnung of the axe check warns (Carla 2024)
- [x] The first amount keeps its day when the Vertragsbeginn moves (pg test seen red); refusals before the start and after the end name the day
- [x] All eight scenarios green without `@wip`
- [x] Fallow: the action `end` uses `endOnFormDay`, `endDeletingDraft` keeps its order (review C-3); the Akonto rows and «Gültig ab» are components of their own (`AdvancePeriods.svelte`, `AdvanceFrom.svelte`)
- [x] Slice review round 1 (`docs/reviews/464-review-1.md`), fach-reviewer round 2 (`docs/reviews/464-fachreview-2.md`), personas Helga and Dr. Weber (`docs/design/personas/helga-464.md`, `weber-464.md`: both stopped at saving, demo contracts had no Akonto rows; fixed in 8fd1c700)
- [x] Fixes: refusal compares with the stored total too; first amount moves with the Vertragsbeginn, start or end beyond a later Akonto refused; own codes for a refused delete; «Gültig ab» proposes the next first in a running contract, an unchanged Akonto is not sent, an empty «Gültig ab» is refused; the rules of an increase only in a running contract; texts V-4, V-7 to V-9; scenario «Ein Akonto, das eine Abrechnung zählt, lässt sich nicht löschen» and axe states `advance-delete-refused`, `advance-refused`
- [x] Re-reviews: code-reviewer round 2 (`docs/reviews/464-review-2.md`), fach-reviewer round 3 (`docs/reviews/464-fachreview-3.md`), personas again (`docs/design/personas/helga-464-2.md`, `weber-464-2.md`)
- [x] Fixes: V-12 (the new Vertragsbeginn as «Gültig ab» corrects the first amount), V-14, V-15; C-10/C-11 («Beenden» shows a refusal with its message, scenario «Mietvertrag vor einem späteren Akonto beenden», states `end-dialog-advance-refused`, `advance-from-missing`); C-12 (codes as literals), C-13 (contracts for the delete and end refusals, API spec); Helga P-1 (the form lists the amounts), P-2 and Weber P-1 (the refusal says when to correct and names the earliest day), P-3 (example a first of a month), P-4 (toast after deleting)
- [x] daten-pruefer (`docs/reviews/464-datenpruefung-1.md`: no finding above Nit)
- [x] Closing code-review round 1 (`docs/reviews/464-review-3.md`): C-14 (toast after deleting, DOM test with reactive props seen red), C-15 (scenarios «Das Formular nennt die eingetragenen Akonto-Beträge», «Vertragsbeginn und erstes Akonto zusammen korrigieren», toast step in «Ein späteres Akonto löschen», two seen red), C-12 (codes written out), C-17 (subject of d486f1e2 reworded before the push)
- [ ] Closing code-review round 2, PR `Fixes #464`
- [ ] Slice review, persona, daten-pruefer, closing review; PR `Fixes #464`
- [x] Workflow note: Session C1 of another branch is on `main` unfinished, so `open-work.test.ts` counted two sessions; moved below this one as a section, as in Session I1 (`docs/reviews/workflow-notes-issue-464.md`; collected review `docs/reviews/workflow-rules-review-2026-10-19-2.md`)

