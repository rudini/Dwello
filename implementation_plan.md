# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session: #1474 single delivery date as one-day Leistungszeitraum

- [ ] Branch `ccr-153ae8d3-conoid-1474` from origin/main
- [ ] `llm:eval` before (allocability + new extraction cases), model and scores noted here
- [ ] Eval cases for the extraction prompt: oil invoice with Lieferdatum ≠ Rechnungsdatum, non-fuel invoice with one Leistungsdatum, invoice with start and end, invoice with neither
- [ ] Failing test of the prompt rule; parsing test of the one-day case (pins kept behaviour)
- [ ] `fach-reviewer` on the prompt wording before implementing
- [ ] Prompt change (`backend/src/config/llm.ts`), test green
- [ ] `llm:eval` after, no regression
- [ ] Slice review (`code-reviewer`), closing round
- [ ] No scenario: the E2E KI double reads by file name, not the invoice image, so it cannot show what the KI reads
- [ ] Checks of "Before marking anything complete"
- [ ] Archive session, PR `Fixes #1474`, merge on green
