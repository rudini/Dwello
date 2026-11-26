# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session

#1480: in a building recorded «ohne Tank», a one-day invoice of a fuel category counts like a delivery over the whole period in every period (PO 26.11.2026, option 1). Branch `ccr-153ae8d3-conoid-1480`.

- [x] `@wip` scenarios in `statement-detail.feature` (Gebäude ohne Tank; after the change of fuel), seen red at «1/1 Tage»
- [x] `fach-reviewer` round 1 on the scenarios: `docs/reviews/1480-fachreview-1.md` (V-1 Major, V-2 to V-6 Minor)
- [x] V-1: delivery kind `'noTank'` (`getInvoicesForStatement`), line text of another fuel, PDF note `sharesNoteDeliveryNoTank`; scenario steps, pdf-render and DOM tests seen red
- [x] V-2: invoice detail says `invoices_fuel_delivery_no_stock` without a tank's category; scenario in `invoice-detail.feature` seen red
- [x] V-4: `buildings_no_tank_help`; V-6: `docs/nebenkostenabrechnung-anforderungen.md`; V-5: issue #1482 (`needs-decision`); V-3 stays (PR text)
- [x] `tdd`: backend rule in `getInvoicesForStatement` (the two pg tests that pinned the old rule flip by the decision)
- [x] Glossary rows «Gebäude ohne Tank», «Verbrauch (Heizmaterial)» with the wording of 1480-fachreview-1
- [x] Files: `invoice.service.ts`, `statement-parts.ts` (`Delivery`), `schema.ts`, `api/invoice.ts`, `pdf-layout.ts`, `pdf-cost-table.ts`, `pdf-texts/*.ts`, `LineInvoices.svelte`, `InvoiceFacts.svelte`, `src/lib/invoice.ts`, `messages/*.json`, `UBIQUITOUS_LANGUAGE.md`, tests
- [x] Slice review `code-reviewer` round 1: `docs/reviews/1480-review-1.md` (C-1, C-2 Minor: DOM tests pin the texts, seen red)
- [x] Feature review: personas Dr. Weber, Helga, Marco (`docs/design/personas/*-1480.md`), `daten-pruefer` `docs/reviews/1480-datenpruefung-1.md` (no findings), `fach-reviewer` `docs/reviews/1480-fachreview-2.md` (V-7 Major, V-8, V-9 Minor: texts of `buildings_no_tank_help`, `invoices_fuel_delivery_no_stock`, `sharesNoteDeliveryNoTank`, glossary bracket; answer Helga P-1, Weber P-1; tests seen red)
- [ ] Persona re-run Helga, Dr. Weber on the new texts
- [ ] Closing `code-reviewer` round
- [ ] Before marking complete; archive; PR `Fixes #1480`
