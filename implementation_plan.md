# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #837 cycle 4a (categories, distribution keys, heating profiles; #857 categories edge)

- [x] Measure before: `fitness` 4 / 12 / 36, entity mirrors 47, value lists 11
- [x] `backend/src/api/{category,distribution-key,heating-profile}.ts`; services typed against them
- [x] BFF mappers `toCategory`, `toDistributionKey`, `toHeatingProfile` with `Json<…>`; `Category`, `HeatingProfile`, `DistributionKeyRow` derived
- [x] `CategoryWithUsage` and `Proposal` out of `src/lib/server/category.ts` (#857)
- [x] Checks: lint, check, backend type-check, `test:coverage`, backend tests, fitness `--base origin/main`; `fitness --update`
- [ ] Slice review (`code-reviewer`), report `docs/reviews/i837c4a-review-1.md`
- [ ] ADR 0005 section «Zyklus 4a»; archive; PR «Refs #837, #857»
- Files: `backend/src/api/{category,distribution-key,heating-profile}.ts` (new), the three services and two routes, `llm.service.ts`, `src/lib/types.ts`, `src/lib/server/{category,distribution-key,heating-profile,invoice}.ts`, `src/lib/distribution-key.ts`, config and invoice components, three tests and one helper, `tools/fitness/ratchet.json`, ADR 0005
