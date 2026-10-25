# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: module dependency graph (`bun run deps:graph`)

Request: a dependency graph of the whole project; the product owner chose the existing import graph of `tools/arch-baseline/02-imports.ts` over madge, and no second cycle check in CI (the fitness check `module-cycle` covers it). The pdf ↔ reminder-letter cycle went to #808. No scenario: tooling only, no app change.

- [x] `tools/arch-baseline/graph.ts`: production modules as DOT, edge weight = file imports, cycle edges red (test first)
- [x] `deps:graph` script in `package.json`, output under `build/deps/` (not committed), usage in `docs/architecture/fitness-functions.md`
- [x] Slice review (`code-reviewer`): `docs/reviews/depsgraph-review-1.md`
- [x] Checks: lint, check, backend type-check, affected tests, Prettier on added files
- [ ] PR
