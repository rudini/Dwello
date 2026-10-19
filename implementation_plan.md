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

- [x] @wip scenario «Die Frage nach dem Vertragsende nennt die stillschweigende Fortsetzung» (`contract-detail.feature`), DOM test; both red
- [x] fach-reviewer on the fr/it/en drafts before the text turns green (`docs/reviews/457-fachreview-1.md`, recommended wording taken)
- [x] `contracts_fixed_term_objection` with the second sentence in four languages; markers `#308` removed
- [ ] Slice review
- [ ] PR `Fixes #457`, `Fixes #308`
