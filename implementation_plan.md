# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #837 cycle 1, statements (Ä1)

- [x] Measure before: `fitness` (field spread), `svelte-check` time
- [x] S1 Backend: `StatementWithDetails` moves to `backend/src/api/statement.ts` (imports only types of `schema.ts`), complete for what `getStatement` returns, which checks it as its return type (the annotation it had; the decision says `satisfies`); status typed (`StatementStatus`)
- [x] S2 BFF: `toStatement` takes `Json<StatementWithDetails>`; drift fixed in types, no value the app shows changes
- [x] S3 Frontend: `Statement`/`StatementWithDetails` in `src/lib/types.ts` take the fields that pass through unchanged from the backend type (`Pick`), declare only what the mapper converts or adds
- [x] ADR 0005 (0004 was taken meanwhile) on the changed step 2 of ADR 0003; measured after, `fitness --update` (max 37 → 36, entity mirrors 54 → 52)
- [x] Slice review round 1: `docs/reviews/i837c1-review-1.md`. Fixed: C-1 (Major, edit page `?? ''`, DOM test seen red), C-3 (`replaces` from the backend type), C-5 (ADR refs); C-2 (Major) answered by splitting the cycle: line items, line invoices and documents follow as cycle 1b in the next PR (ADR 0005, #837); C-4 named in ADR 0005
- [ ] Closing review round (`code-reviewer`) on the fixes
- [ ] PR; No scenario: types only
