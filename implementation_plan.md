# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #815 part A, the fitness check over the frontend

- [x] Decisions recorded in #815 (25.10.2026): a branch on the status value alone is display; parts A check, B contracts, C statements, D the rest
- [x] `tools/fitness/fitness.ts`: `frontendDecisions` measured with `decides` over `src/lib` outside `server/` and every component; checks `frontend-decision`, `pre-check` (code in the named backend test), warning `frontend-allowed`; shrink-only `exceptions.frontendDecisions`; tests first (`fitness.test.ts`, 5 new, seen red)
- [x] `tools/fitness/ratchet.json`: 44 hits in `display` (format or status value alone, each with its reason), 38 in `exceptions.frontendDecisions` (19 files), `preChecks` empty
- [x] Docs: `utility-tree.md` (Ä4 H/H, BFF and frontend), `principles.md` (AP2), `fitness-functions.md` (§1 rows, §2 lists, §3 proofs, §6 row)
- [x] Checks: fitness, `fitness.test.ts` (26), lint, check
- [ ] Slice review (`code-reviewer`) and closing round
- [ ] PR: «No scenario: tooling and docs», Refs #815
