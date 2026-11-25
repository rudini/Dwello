# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session: 2026-11-25 issue #1478, a one-day invoice in a second fuel category counts like a delivery

- [x] Branch `ccr-153ae8d3-conoid-1478` from origin/main (#1477 merged)
- [x] `@wip` scenarios «Eine Lieferung einer zweiten Brennstoff-Kategorie zählt im PDF nach den Mietstagen / nach dem Heizprofil der ganzen Periode» (`statement-detail.feature`; seen red: «Holz 900.00 450.00 1/1 Tage 450.00»); step «es gibt die umlagefähige Heizkosten-Kategorie {string} als Brennstoff», `invoiceOn` takes an own category
- [x] `fach-reviewer` round 1 on the scenarios and every text and place that prints the value: docs/reviews/1478-fachreview-1.md; V-1, M-1, V-2, V-4 fixed, V-3 glossary sentences word for word; proposed issue for a building ohne Tank after a change of fuel
- [x] Rule in `getInvoicesForStatement` (`delivery()`, part marker `delivery: 'fuel'`), V-2 included (`isFuel` without `no_tank` beside a Tankbestand); `fuel-stock.pg.test.ts` seen red, each guard taken out once; the multi-day case pins kept behaviour
- [x] Texts `partDeliveryFuel`, `sharesNoteDeliveryFuel` (PDF), `statements_part_delivery_fuel(_profile)` (page) in de/fr/it/en as the report gives them, render and DOM tests seen red; glossary rows «Verbrauch (Heizmaterial)», «Brennstoff (Kategorie)», «Anteil nach Heizprofil»; scenarios green without `@wip`; E2E «Tank|Lieferung|Brennstoff|Heizprofil|PDF» 173 passed; backend `bun run test` 2450 pass
- [x] Slice review round 1: docs/reviews/1478-review-1.md; C-1 fixed (invoice page hides «Nur die Tage …» for a one-day invoice of another fuel beside the tank, DOM test seen red, guard `fuel` taken out once), C-2 Minor: that test pins kept behaviour, said in the next commit
- [x] Issue #1480 (`needs-decision`) for a building ohne Tank after a change of fuel (Fachreview 1478-1)
- [x] Slice review round 2 of the C-1 fix: docs/reviews/1478-review-2.md; C-1, C-2 closed; Minors C-3 (load test of `fuel`) and C-4 (non-allocable) fixed, each test seen red; C-5 stays in the report
- [x] Persona Dr. Weber (Holz beside the oil tank in Musterhaus Zentrum): docs/design/personas/weber-1478.md
- [x] Persona Marco (phone, Musterhaus Zentrum drafts, invoice page): docs/design/personas/marco-1478.md
- [x] daten-pruefer: docs/reviews/1478-datenpruefung-1.md; all amounts of Anna Schmidt and Pierre Dubois 2025 to the Rappen, QR-bills decoded; D-1 Minor (a category agreed after a draft does not mark it not current) existed before, stays in the report
- [x] `fach-reviewer` feature round on Weber P-1 to P-4 and Marco P-1: docs/reviews/1478-fachreview-2.md; V-6 Major fixed (`fuelIntroDeliveryFuel`), V-7 (`sharesNoteDeliveryFuel` with `{categories}`) and V-10 (`invoices_fuel_delivery` on the invoice page, scenario in `invoice-detail.feature`, no red run of its own: its DOM test was seen red) fixed word for word, render and DOM tests seen red; V-8, V-9 existed before, stay in the report; Weber P-1 beyond V-6 rejected (the purchase billed without own Tankbestand is the product owner's decision, Fachreview 1478-2)
- [x] The invoice page reads `category.isFuel` from the invoice response (contract `invoice.json`), not a `fuel` value of its load (fitness: maintainability of the load); api-contracts test seen red
- [ ] Slice review round of the feature-review fixes
- [ ] Checks of "Before marking anything complete"
- [ ] Archive session, PR `Fixes #1478`
