# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #837 cycle 4b (buildings, apartments; #857 buildings edge)

- [x] Measure before: `fitness` 4 / 12 / 36, entity mirrors 46, value lists 10
- [x] #857: building pages take `PageData` from `./$types`; `FuelStock` from the page data; `AddressHit`, `RegisterApartment`, `RegisterBuilding` out of `src/lib/server/building-register.ts`
- [x] `backend/src/api/building.ts` (and apartment); services typed against them; BFF mappers with `Json<…>`; `Building`, `BuildingWithStats`, `Apartment` derived
- [x] Checks: lint, check, backend type-check, `test:coverage`, backend tests, fitness `--base origin/main`; `fitness --update`
- [x] Slice review (`code-reviewer`), report `docs/reviews/i837c4b-review-1.md` (1 Minor, fixed)
- [ ] Closing round (`code-reviewer`), report `docs/reviews/i837c4b-close-review-1.md`
- [ ] ADR 0005 section «Zyklus 4b»; archive; PR «Refs #837, #857»
