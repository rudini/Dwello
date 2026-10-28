# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: open functional issues, one pull request each (2026-10-28)

### #773 «Bitte ausfüllen» and «Gelesen» in «Rechnungen hochladen»
- [x] Scenarios: badge and status line in «Rechnungen hochladen, wenn keine KI gewählt ist»; changed status line in «Das Auslesen einer Datei scheitert» and «Dwello sagt, was nach dem Lesen zu tun ist …» (`Spec change approved: #773`); seen red
- [x] DOM tests: «Gelesen: …», badge «Bitte ausfüllen» for a file nobody read, no progress with «Keine KI»; seen red
- [x] Code: `stateOf` in `src/lib/invoice-upload.ts`, `InvoiceUploadRow.svelte`, `InvoiceUploadDialog.svelte`, `messages/*.json`
- [x] Slice review round 1: `docs/reviews/773-review-1.md`
- [x] Persona Helga: `docs/design/personas/helga-773.md` (run 1 with a reading KI stand-in did not reach the state, not kept)
- [x] Helga P-1 (Major, «Gelesen: 1 von 1» next to «nicht gelesen»): product owner decided 2026-10-28, counts only once all are read; DOM tests seen red
- [x] Closing review: `docs/reviews/773-review-2.md`
- [x] PR merged: #929

### #484 Glossary row «Erledigt»
- [x] Row «Erledigt» in `UBIQUITOUS_LANGUAGE.md` as decided on 2026-10-28 (proposal of domain review 448-4 V-28, `settled`)
- [x] Help texts checked: `glossary_balance_text`, `glossary_settled_text` and the help at «Bezahlt am» already follow #448; no marker names #484
- [x] No scenario: glossary text only, no app change
- [x] PR merged: #930

### #512 Missing statements before a change of the period setting
- [x] `@wip` scenarios (contract page, wizard link, Übersicht), seen red at the missing behaviour; the setting stays «Kalenderjahr», the building's statements follow «Juli – Juni» (no global setting changed)
- [x] `fach-reviewer` round 1: `docs/reviews/512-fachreview-1.md`; V-1 (switch point by the first statement under the setting), V-2 (hint #486 in the row of the short period, new scenario), V-3 (Übersicht reads the building's statements) fixed before green; V-4 (two changes of the setting) stays in the report
- [x] Unit tests of the rule in `backend/src/__tests__/accounting-period.test.ts`, seen red; case a of V-1 pins kept behaviour
- [x] Code: `backend/src/services/accounting-period.ts`, `statement-run.service.ts`, `src/routes/contracts/[id]/MissingStatement.svelte`
- [x] Slice review round 1: `docs/reviews/512-review-1.md` (C-1 DOM test of the hint's row, C-2 pg test of the Übersicht wiring, C-3 API docs; all three fixed, both tests seen red by taking the code out)
- [x] Persona Dr. Weber: `docs/design/personas/weber-512.md`; P-1 (Major, a year ended before the change cut by the new setting): product owner decided 2026-10-28 to store the day of the change and the type before (`accounting_period_changed`, no migration: key-value table); unit and pg tests seen red. P-2 to P-5 Minor stay in the report
- [x] No scenario for the stored change: a state of the global setting `accounting_period` that would break the parallel scenarios (`tests/e2e/CLAUDE.md`, "No scenario"); `statement-run.pg.test.ts` shows it
- [x] Re-review round 2: `docs/reviews/512-review-2.md` (C-1 to C-3 closed; C-4 Major, a setting changed back on a later day became the earlier type: fixed, pg test seen red); persona Weber again: `docs/design/personas/weber-512-2.md` (P-1 fixed; two Minors stay)
- [x] Re-review round 3: `docs/reviews/512-review-3.md` (C-4 closed; C-5 Minor, the day of a brief change kept, fixed with a unit test seen red; C-6 Minor, one `month` helper, fixed)
- [x] Closing review: `docs/reviews/512-review-4.md` (C-5, C-6 closed; C-7 Minor: the PR text names the two tests that pin kept behaviour)
- [x] CI fix: fitness P2 counted one more query on `/dashboard` and `/contracts/missing-statements`; `periodSetting()` reads the setting and its change in one query
- [x] Glossary «Hinweis auf fehlende Abrechnungen»: sentence on how periods are cut, decided by the product owner on 2026-10-28 in chat (proposal of Fachreview 512-1)
- [x] PR merged: #938

### #506 Übertrag that reaches no statement
- [x] `@wip` scenarios in `statement-minimum-balance.feature` (C: send dialog of a draft whose Übertrag changed; B: task on the Übersicht and «als ausgeglichen markieren»), seen red at the missing behaviour
- [x] Decided by recommendation (product owner 2026-10-28: decide by my recommendations): C stays in the send dialog (the overview text of outdated drafts is pinned by a scenario and stays); B «settled by hand» is a date on the statement (`carry_settled_on`, migration) set from the statement page after a confirmation
- [x] `fach-reviewer` round 1: `docs/reviews/506-fachreview-1.md`; V-1 to V-3 (Major) and V-4 to V-7, V-9 fixed before green, decided by recommendation and recorded in #506; V-8 fixed after code review 506-1 C-1
- [x] pg tests (`statement-carry-over.pg.test.ts`), DOM and unit tests, seen red (those written after the code by taking it out)
- [x] Code: migration `0038_carry_settled_on.sql`, `carry-over.ts`, `statement.service.ts`, `statement-invoices.service.ts`, `contract-tasks.service.ts`, route `POST /statements/:id/carry-settled`; frontend `PaymentPanel`, `CarrySettleDialog`, send dialog, Übersicht; texts in four languages; glossary; contracts; a11y screen `statement-open-carry-detail`
- [x] Slice review round 1: `docs/reviews/506-review-1.md`; C-1 (Major, V-8 decided but not built): fixed without an extra query (the draft list computes `carryChanged` in SQL), pg test seen red; C-2, C-4, C-5 fixed (C-2 tests red by taking each condition out); C-3 rejected: the decision in #506 names a Nebenkostenpauschale only
- [x] Persona Helga: `docs/design/personas/helga-506.md` (no Blocker/Major; P-1 to P-3 Minor stay)
- [x] `daten-pruefer`: `docs/reviews/506-datenpruefung-1.md` (to the Rappen; D-1 Minor, an off-grid legacy Saldo is not rounded again when a draft loses its Übertrag, «Neu berechnen» heals it, stays)
- [x] Re-review round 2: `docs/reviews/506-review-2.md` (C-1 closed; C-6 Major rejected: the «zu versenden» count is global over every draft of `dwello_e2e`, which parallel scenarios change at any time, so no scenario can assert it (`tests/e2e/CLAUDE.md`, Isolation); `statement-carry-over.pg.test.ts` asserts it; C-7 Minor fixed: one SQL rule `carriedNow` for the calculation and the draft check)
- [x] Closing review: `docs/reviews/506-review-3.md` (no findings; C-6 rejection holds)
- [x] CI fix: Architecture fitness Ä4, a changed status branch in the statement page; the allowed line stays as it was, the Übertrag part beside it (fitness reproduced locally first)
- [x] Copilot review of #941: Akonto from the day after the period (pg test red first), settling checked in its update (no sequential test can show a race), the correction dialog names a hand-settled Übertrag (DOM test red first, four languages); the reset-dialog point answered on its thread, not built
- [ ] PR merged
