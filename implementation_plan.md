# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session

#1469: in the tank's category, only an invoice without or with a one-day Leistungszeitraum is a delivery (branch `ccr-153ae8d3-conoid-1469`).

- [x] @wip scenarios: invoice detail hint (`invoice-detail.feature`), Tankrevision by its days in the PDF (`statement-detail.feature`), key of the Veränderung Tankbestand (`statement-generate.feature`); seen red
- [x] Spec change of `statement-detail.feature` «Heizöl aus dem Tank … auch mit Leistungszeitraum der Lieferung» and glossary row «Anteil nach Heizprofil»: approved by the PO on #1469 (second round), applied
- [x] fach-reviewer round 1 on the @wip scenarios, the PDF texts and the hint: `docs/reviews/1469-fachreview-1.md` (M-1, M-3 to the PO)
- [x] Backend: delivery rule in `getInvoicesForStatement`, `heatingInvoices`, `keyFor`, `keysFinding`, `stockFinding`, consumption comparison; PDF fuel section without non-deliveries; Kostenabstimmung order
- [x] Frontend: hint on the invoice detail page; help texts `invoices_service_period_fuel`, `categories_fuel_help`; screen row `invoice-tank-detail`
- [x] Glossary rows «Brennstoff (Kategorie)», «Verbrauch (Heizmaterial)»
- [ ] PO decisions on M-1 (preview hint) and M-3 (glossary sentence)
- [ ] Slice reviews (code-reviewer), daten-pruefer, personas
- [ ] PR (`Fixes #1469`, `Spec change approved: #1469`)
