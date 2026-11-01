# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #691 cut-off cost table on the statement edit page

- [x] Reproduced at 1440 × 900 (persona stack, demo data): the table needs 1010 px, the edit page's panel gives 716 px; «Zeitanteil» is cut, the scroll bar sits below the whole table. The detail page is 22 px short too, but its mid widths are #658 (`needs-decision`), so it stays as is
- [x] Scenario in `statement-edit.feature` seen red (203 px hidden sideways), then green: the edit page shows the lines one below the other at every width (`CostTable` `stacked`), as phones already do
- [x] E2E: `statement-edit.feature`, `statement-detail.feature` (132 passed), axe and language rows of `statement-edit` (4 passed); unit tests on changed files (322 passed)
- [ ] Slice review (`code-reviewer`)
- [ ] Persona review: Anna (she found it in #448)
- [ ] Archive, PR
