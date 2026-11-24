# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session 2026-11-24: #1470 delivery into the tank without Tankbestand counts over the whole period

- [x] Read #1470 and its decision (24.11.2026); no scenario on `main` pins the old uncovered behaviour (searched tank scenarios with a Leistungszeitraum)
- [x] `@wip` scenarios (statement-detail.feature: by days and by Heizprofil), seen red
- [x] fach-reviewer on scenario and glossary rows before implementing (`docs/reviews/1470-fachreview-1.md`)
- [x] Backend: a delivery counts over the whole period also without `covered` (pg test red first)
- [x] V-1: not after the tank is recorded decommissioned (`periodReadings` null; guard seen red)
- [x] V-2/V-3: PDF note `sharesNoteDelivery` and line `partDelivery`, detail page `statements_part_delivery(_profile)`; third scenario
- [x] V-4: a one-day delivery does not make hint #339 name an invoice without Leistungszeitraum
- [x] Glossary «Verbrauch (Heizmaterial)», «Anteil nach Heizprofil» (wording of 1470-fachreview-1)
- [x] Slice review (code-reviewer), round 1: `docs/reviews/1470-review-1.md` (no Blocker/Major)
- [ ] Feature review: Dr. Weber (PDF texts, creates the statement; setup SQL in Musterhaus Zentrum), then Marco (phone) and daten-pruefer; no step-5 fach-reviewer (rules and texts unchanged since its round 1)
- [x] Persona Dr. Weber: `docs/design/personas/weber-1470.md` (P-1 rejected: a unique Leistungszeitraum and amount identify the receipt, #236/#451 V-8, also on `main`; P-2, P-3, P-5, P-6 Minor on `main` too)
- [x] fach-reviewer round (feature review): heating-section sentence with a delivery by the Heizprofil (Code-Review 1470-1 C-1b), Dr. Weber P-4: `docs/reviews/1470-fachreview-2.md` (V-6 `heatingNoteDelivery`, V-7 `sharesNoteDelivery` says why; both Minor, fixed)
- [x] Persona Marco: `docs/design/personas/marco-1470.md` (Minors only, on `main` too)
- [ ] daten-pruefer: `docs/reviews/1470-datenpruefung-1.md`
- [ ] Before marking complete: lint, check, fitness, type-check, tests, E2E
- [ ] Archive session, PR (`Fixes #1470`)
