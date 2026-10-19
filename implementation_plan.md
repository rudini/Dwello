# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session I1: open issues, one after another (2026-10-19)

Branch `ccr-6c5f45f8-br8wl9`. Product owner: work the open issues one by one, bugs first, one pull request each.

### #439 «Weiter» in step 3 while the agreements load

- [x] @wip scenario: «Weiter» after the check failed says why the wizard waits (`statement-agreed-costs.feature`)
- [x] DOM test: the same while the check loads (`agreed-costs.dom.test.ts`)
- [x] Message in `AgreedCosts.svelte`, text in all four languages; axe and language state `agreements-failed` clicks «Weiter» too
- [x] Slice review round 1 (`docs/reviews/439-review-1.md`)
- [x] Feature review: personas Helga and Sven (`docs/design/personas/{helga,sven}-439.md`)
- [x] Fix Sven P-1, P-3 and Helga P-1: the wizard goes on once the check is done; failed text names «Erneut versuchen»
- [x] Re-review: code-reviewer round 2 (`docs/reviews/439-review-2.md`; C-4 fixed with the scenario «Nach erneuter Prüfung geht der Assistent zur Vorschau»), Sven and Helga (`docs/design/personas/{sven,helga}-439-2.md`)
- [x] Closing code-review round (`docs/reviews/439-review-3.md`, no Blocker/Major)
- [ ] PR `Fixes #439`

### #432 Warning with Akonto and Nebenkostenpauschale

- [x] @wip scenario «Mit Akonto und Nebenkostenpauschale warnt das Formular vor angekreuzten Nebenkosten» (`contract-new.feature`)
- [x] fach-reviewer on the scenario and the proposed variant text before implementing (`docs/reviews/432-fachreview-1.md`)
- [x] Product owner confirms the variant text (decision of #432, 2026-10-19, recorded in the issue)
- [x] `flatRateNotice` warns with Akonto too (variant text), unit test; texts in all four languages; axe and language state `flat-rate-warning-advance` on `contract-new` and `contract-edit`
- [x] Slice review round 1 (`docs/reviews/432-review-1.md`, two Nits; C-1 fixed)
- [x] Feature review: personas Dr. Weber and Helga (`docs/design/personas/{weber,helga}-432.md`)
- [x] Helga 432 P-1 (Major, contradicted the decision): product owner 2026-10-19: with an Akonto the warning shows only while every box is ticked; unit test, scenario, a11y state ticks all first
- [x] Re-review: code-reviewer round 2 (`docs/reviews/432-review-2.md`), Helga (`docs/design/personas/helga-432-2.md`)
- [x] Issue for Helga 432 P-2 (Akonto without agreed Nebenkosten, existed before): #444
- [x] Closing code-review round (`docs/reviews/432-review-3.md`, no findings)
- [ ] PR `Fixes #432`

### #444 Akonto without agreed Nebenkosten

- [x] @wip scenario «Mit Akonto und ohne angekreuzte Nebenkosten warnt das Formular» (`contract-new.feature`)
- [x] fach-reviewer on the scenario and the proposed sentence before implementing (`docs/reviews/444-fachreview-1.md`); product owner confirmed the wording (recorded in #444)
- [x] `AgreedCategories.svelte`: caution tone and the Akonto variant text when an Akonto is entered; DOM test; texts in all four languages; axe and language state `agreed-costs-none-advance`
- [x] Slice review round 1 (`docs/reviews/444-review-1.md`, C-1 and C-3 fixed), feature review (persona Helga, `docs/design/personas/helga-444.md`, no Blocker/Major)
- [x] Closing code-review round (`docs/reviews/444-review-2.md`, no Blocker/Major)
- [ ] PR `Fixes #444`

### #130 Invoice check after a change of billing rhythm (divisor rule of #409 point 1)

- [x] @wip scenario «Kein Hinweis, wenn der Rechnungssteller von monatlich auf vierteljährlich wechselt» (`statement-generate.feature`); unit tests (two red, three pin kept behaviour)
- [x] fach-reviewer on the scenario before implementing (`docs/reviews/130-fachreview-1.md`, no Blocker/Major; V-1 to V-4 tests added)
- [x] Divisor rule in `missingParts` (`invoice-completeness.service.ts`, `coarserRhythm`)
- [x] Marker `TODO(fachlich prüfen, #130)` in `CategoryCheck.svelte` removed (product owner 2026-10-19: settled by #409)
- [x] Slice review round 1 (`docs/reviews/130-review-1.md`, three Nits; C-1, C-3 fixed)
- [x] Feature review: persona Dr. Weber (`docs/design/personas/weber-130.md`, one Nit), data prepared by SQL in `dwello_persona`
- [x] Closing code-review round (`docs/reviews/130-review-2.md`; C-4: the #405 review moved out of this branch)
- [ ] PR `Fixes #130`

### #457 Objection help after a fixed-term end (closes #308)

- [x] @wip scenario «Der Hinweis nach dem Vertragsende nennt die stillschweigende Fortsetzung» (`contract-detail.feature`), DOM test; both red
- [x] fach-reviewer on the fr/it/en drafts before the text turns green (`docs/reviews/457-fachreview-1.md`, recommended wording taken)
- [x] `contracts_fixed_term_objection` with the second sentence in four languages; markers `#308` removed
- [x] Slice review round 1 (`docs/reviews/457-review-1.md`, one Nit, fixed)
- [x] Feature review: persona Dr. Weber (`docs/design/personas/weber-457.md`, two Minors on the decided text, one Nit)
- [x] Closing code-review round (`docs/reviews/457-review-2.md`, no findings)
- [ ] PR `Fixes #457`, `Fixes #308`

### #338 «Neu berechnen» on a single draft

- [x] @wip scenario «Entwurf neu berechnen» (`statement-detail.feature`), seen red at the missing button
- [x] `statement-recalculation.pg.test.ts` (same number, new amounts, no changed invoices after; sent refused), red first
- [x] Backend: `recalculateStatement`, `POST /statements/:id/recalculation`; `generateStatement` shares `calculatedRows`
- [x] Frontend: «Neu berechnen» in «Weitere Aktionen» of a draft, confirmation dialog `statement-recalculate-confirm`; texts that said «delete and create again» point to «Neu berechnen» (statement, wizard, invoice, Tankbestand, Heizprofil texts), four languages; DOM tests and scenarios updated red first; axe and language state `recalculate-dialog`
- [x] Slice review round 1 (`docs/reviews/338-review-1.md`: C-1 Blocker, C-2 to C-4 Major) and persona Helga (`docs/design/personas/helga-338.md`: P-1, P-2 Major)
- [x] Fixes: a berichtigte Abrechnung keeps `replaces` and `priorPayments` (C-1); own codes `STATEMENT_NOT_RECALCULABLE`, `STATEMENT_RECALCULATION_AGREEMENTS_OPEN` with texts (C-2, C-3); paid refused tested (C-4); kept fields tested (C-9); confirmation dialog naming what stays and changes, success toast at the top (P-1, P-2, C-6); it «Ricalcolare» (C-7); API spec and PRD (C-10); nits C-11, C-12
- [x] Re-review round 2 (`docs/reviews/338-review-2.md`: no Blocker/Major; C-14 saldo of a recalculated berichtigte Abrechnung pinned, C-15 duplicate step removed; C-16 to C-18 kept)
- [x] daten-pruefer on the recalculated draft (`docs/reviews/338-datenpruefung-1.md`: every amount to the Rappen, no findings; preview endpoint and PDF not checked)
- [x] Helga round 2 (`docs/design/personas/helga-338-2.md`: P-1, P-2 of round 1 fixed; new P-1, P-2 Minor on the toast, P-3, P-4 Nit, kept); closing code-review round 3 after merging `main` (`docs/reviews/338-review-3.md`, no findings); lint, check, type-check, affected vitest (760) and pg tests, E2E Chromium statement rows (157 passed)
- [ ] PR `Fixes #338`

### Main CI red since #440: E2E leftovers (O-38)

Branch `ccr-01e823d6-yhj5kc`. Runs 595 to 606 on `main` failed in the Firefox and WebKit shards (PRs run Chromium only): the statement wizard's buildings step (two backend requests per building, all buildings up to 1000 since #440) and step 3's agreement check took longer than 5 s, because every scenario with a sent statement left its building, apartment and tenant in `dwello_e2e`. Reproduced in Chromium with 600 leftover buildings (all three «Schon abgerechnet» scenarios fail as on CI). No scenario: test infrastructure only.

- [x] `backend/scripts/e2e-purge-statements.ts`: deletes a scenario's statements and their documents in the E2E database only; `tests/e2e/fixtures/backend.ts` calls it in `cleanUp` (statement-detail.feature left 23 buildings, apartments and tenants before, none after)
- [x] O-38 moved to `docs/archive/offene-punkte-verlauf.md`
- [x] Full Chromium + API run: 1153 passed, 1 failed (O-34, the known IBAN race of `settings.feature`); no tenant or statement left, but 256 buildings «Talblick»: the screen examples seed «Talblick» twice and the second name replaced the first one's token, so the cleanup now keeps every token it handed out
- [x] Slice review round 1 (`docs/reviews/o38-review-1.md`; C-1 fixed: the purge always gets the E2E database's URL, never `backend/.env`'s; C-3 not taken: the extra branch pushed `cleanUp` over fallow's complexity limit, and a scenario without names is rare)
- [x] `previewOf` (axe and language rows of `statement-generate`) waits for step 2's texts before ticking a building, as `chooseBuilding` does (#424; «preview-all-billed» once failed locally with «Clicking the checkbox did not change its state»); the statement-generate rows of both features: 38 passed, nothing left in `dwello_e2e`
- [x] Re-review and closing round 2 (`docs/reviews/o38-review-2.md`, no Blocker/Major; C-5 Nit kept); after the purge refactor statement-detail and statement-generate (Chromium + API): 156 passed, nothing left
- [x] PR #463 (merged); run 612 on `main`: the statement wizard failures are gone, one new failure in Firefox: «contract-new overlap-warning» stayed on step «Wohnung» (screenshot): the open-contract notice, shown once the apartment's contracts are loaded, moved «Weiter» under the second click (#424 kind; the same double click in `goToRentWith` explains WebKit's `start-date-input` timeout of run 600)
- [x] `keepApartment` (`tests/e2e/tasks/contract-form.ts`) waits for the apartment choice before «Weiter»; used by `goToRentWith` and the axe and language states `overlap-warning`, `rent-taken-over`; Chromium: those rows 13 passed, `contract-new.feature` (Chromium + API) 33 passed
- [x] Slice review round 1 (`docs/reviews/612-review-1.md`; C-1: `toRentStep`, used by four `contract-new` rows, clicked twice too, now `keepApartment`; C-2 comment fixed)
- [x] Re-review and closing round 2 (`docs/reviews/612-review-2.md`, no findings)
- [ ] PR

### #468 «Weiter» waits while a step loads

Branch `ccr-01e823d6-yhj5kc`. Run 614 on `main` failed once more in Firefox (statement-generate «generation-result»: «Weiter» on step 2 clicked while the buildings' texts loaded). Product owner: lock «Weiter» while a step loads instead of more waits in the tests. No scenario: the loading state lasts only as long as a request; the E2E stack cannot hold one open.

- [x] DOM: contract wizard step «Wohnung»: «Weiter» locked («Bitte warten …») until the apartments' contracts are loaded (`WizardNav` `loading`)
- [x] DOM: statement wizard step «Gebäude»: locked until invoice counts and billed contracts are loaded; «Zurück» while loading leaves step 1 free (red first: a real bug of the first version)
- [x] DOM: statement wizard step 3: locked while the agreed Nebenkosten are checked and the contracts without a Verwaltungspauschale load (`FeeNotAgreed` moves «Weiter» too); after a failed check as before (#439)
- [x] E2E tasks: `tickBuilding` waits for step «Gebäude» before ticking (four places in `accessibility.ts`, two did not wait: run 614); `keepApartment` (#466) removed, as «Weiter» now waits itself and Playwright clicks only an enabled button
- [x] Affected E2E (Chromium + API): statement-generate, statement-agreed-costs, statement-management-fee, contract-new, statement-minimum-balance, statement-rounding 164 passed; axe and language rows of statement-generate and contract-new 64 passed
- [x] Slice review round 1 (`docs/reviews/468-review-1.md`): C-1 (Major, an answer of a step left before unlocked the step opened anew) fixed with a test seen red; C-2 a failed load lifts the lock, pinned (kept behaviour, green at once); C-6 fixed
- [x] Re-review round 2 (`docs/reviews/468-review-2.md`, no Blocker/Major); C-9 (the C-1 fix of `FeeNotAgreed` had no test): test added, red with the fix taken out
- [ ] Feature review: personas Sven and Marco (locked state reached by delaying the requests)
- [ ] PR `Fixes #468`
