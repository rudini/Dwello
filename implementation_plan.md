# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session: #1474 single delivery date as one-day Leistungszeitraum

- [x] Branch `ccr-153ae8d3-conoid-1474` from origin/main
- [x] `llm:eval` before (allocability + new extraction cases), model and scores noted here: qwen/qwen3-vl-8b-instruct via OpenRouter, allocability 48/48, Leistungszeitraum 2/4
- [x] Eval cases for the extraction prompt: oil invoice with Lieferdatum ≠ Rechnungsdatum, non-fuel invoice with one Leistungsdatum, invoice with start and end, invoice with neither
- [x] Failing test of the prompt rule; parsing tests of one, several and no delivery days (each seen red)
- [x] `fach-reviewer` on the prompt wording before implementing: docs/reviews/1474-fachreview-1.md; V-1 waits for a product decision (sent to the parent session)
- [x] Fachreview V-3: fuel-stock `keyFor` takes the key of the latest delivery by its delivery day (`fuel-stock.service.ts`, `fuel-stock.pg.test.ts`), scenario «Die Veränderung Tankbestand folgt dem Verteilschlüssel der letzten Lieferung nach ihrem Liefertag» in `statement-generate.feature`
- [x] Slice review V-3 round 1: docs/reviews/1474-v3-review-1.md
- [x] PO decision 24.11.2026 second round: option (a), goods only. Fachreview wording (a) put into the period line: eval 4/6 (Kaminfeger got a one-day period, two pellet deliveries a range). Final form: period line unchanged, new field `deliveryDates`, Dwello takes exactly one as the one-day Leistungszeitraum: 6/6 twice
- [ ] `fach-reviewer` round 2 on the `deliveryDates` form
- [x] `llm:eval` after (qwen/qwen3-vl-8b-instruct via OpenRouter): Leistungszeitraum 6/6 (before 4/6 on the same six cases); allocability 42/48 and 44/48, every «kein Vorschlag» an HTTP 429 of OpenRouter, the one wrong answer (ZEV) is also wrong 6 of 6 times with main's prompt (allocability prompt unchanged); before 48/48 and 47/48
- [ ] Slice review (`code-reviewer`), closing round
- [ ] daten-pruefer on the V-3 key change (amounts of the Veränderung Tankbestand)
- [ ] No scenario for the prompt: the E2E KI double reads by file name, not the invoice image, so it cannot show what the KI reads
- [ ] Checks of "Before marking anything complete"
- [ ] Archive session, PR `Fixes #1474`, merge on green
