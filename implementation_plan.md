# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: structure report (Structure101-style, A/I graph, traffic lights)

Request from the product owner (chat, 1.11.2026): build the structure report as a tool in the repo, show the results with the full Git history, add an Abstractness/Instability graph and scores with a traffic-light system. No scenario: developer tooling, nothing a landlord sees.

- [x] `tools/arch-baseline/structure.ts` with tests: Lakos levels from module edges and cycles
- [x] Abstractness per module (exported types and interfaces / all exports), instability, distance from the main sequence
- [x] Traffic lights per module (distance, complexity findings, hotspot) and per KPI (tangles, health score, duplication, maintainability)
- [x] HTML report: KPI tiles, DSM with back-edges red, A/I graph, module table worst first
- [x] `bun run structure:report` (01-map, 02-imports, fallow health without cache, structure.ts), docs in `docs/architecture/fitness-functions.md`
- [ ] Results with full history to the product owner
- [ ] Slice review, PR
