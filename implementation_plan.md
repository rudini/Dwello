# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #837 cycle 1, statements (Ä1)

- [ ] Measure before: `fitness` (field spread), `svelte-check` time
- [ ] S1 Backend: `StatementWithDetails` moves to `backend/src/api/statement.ts` (imports only types of `schema.ts`), complete for what `getStatement` returns, which checks it with `satisfies`; status typed (`StatementStatus`)
- [ ] S2 BFF: `toStatement` takes `Json<StatementWithDetails>`; drift fixed in types, no value the app shows changes
- [ ] S3 Frontend: `Statement`/`StatementWithDetails` in `src/lib/types.ts` take the fields that pass through unchanged from the backend type (`Pick`), declare only what the mapper converts or adds
- [ ] New ADR (0004) on the changed step 2 of ADR 0003; measure after, `fitness --update`
- [ ] Slice reviews (`code-reviewer`)
- [ ] PR; No scenario: types only
