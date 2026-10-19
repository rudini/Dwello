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

### Main CI red since #440: E2E leftovers (O-38)

Branch `ccr-01e823d6-yhj5kc`. Runs 595 to 606 on `main` failed in the Firefox and WebKit shards (PRs run Chromium only): the statement wizard's buildings step (two backend requests per building, all buildings up to 1000 since #440) and step 3's agreement check took longer than 5 s, because every scenario with a sent statement left its building, apartment and tenant in `dwello_e2e`. Reproduced in Chromium with 600 leftover buildings (all three «Schon abgerechnet» scenarios fail as on CI). No scenario: test infrastructure only.

- [x] `backend/scripts/e2e-purge-statements.ts`: deletes a scenario's statements and their documents in the E2E database only; `tests/e2e/fixtures/backend.ts` calls it in `cleanUp` (statement-detail.feature left 23 buildings, apartments and tenants before, none after)
- [x] O-38 moved to `docs/archive/offene-punkte-verlauf.md`
- [x] Full Chromium + API run: 1153 passed, 1 failed (O-34, the known IBAN race of `settings.feature`); no tenant or statement left, but 256 buildings «Talblick»: the screen examples seed «Talblick» twice and the second name replaced the first one's token, so the cleanup now keeps every token it handed out
- [x] Slice review round 1 (`docs/reviews/o38-review-1.md`; C-1 fixed: the purge always gets the E2E database's URL, never `backend/.env`'s; C-3 not taken: the extra branch pushed `cleanUp` over fallow's complexity limit, and a scenario without names is rare)
- [x] `previewOf` (axe and language rows of `statement-generate`) waits for step 2's texts before ticking a building, as `chooseBuilding` does (#424; «preview-all-billed» once failed locally with «Clicking the checkbox did not change its state»); the statement-generate rows of both features: 38 passed, nothing left in `dwello_e2e`
- [ ] Re-review round 2, PR
