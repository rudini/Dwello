# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #919 statements/outdated without N+1

- [x] Measured with `bun run fitness:p2`: 1012–1139 ms p95; `getStatement` per statement is ~70 % of the time, the invoices of the period ~25 %
- [x] `outdatedStatements` and `draftsToSend` take the listed statements and load invoices and Tankbestand once per building and period; the full statement only for a correctable one (No scenario: same answer, pinned by `statement-invoices.pg.test.ts`, `dashboard.pg.test.ts`)
- [x] `bun run fitness:p2`: outdated 1100 → 80 ms p95, dashboard 227 → 214 ms; docs (P2)
- [ ] Slice review
- [ ] PR
