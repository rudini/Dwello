# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: stable invoice order in statements (#759)

Request: fix the red `agreed-from.pg.test.ts` on `main` in its own pull request. Cause: `getInvoicesForStatement` orders by invoice date only, so invoices of one day come in arbitrary order, and with them the statement's positions and the PDF's list of agreed categories.

- [x] Reproducing pg test, seen red (two invoices of one day, the first edited after the second was entered)
- [x] Fix: deterministic tiebreaker in `getInvoicesForStatement`
- [x] Checks: backend suite 1525 pass (coverage 96.3 % lines), lint, check, type-check, Prettier on added files
- [ ] Code review of the slice
- [ ] Archive, PR with `Fixes #759`, `No scenario`
