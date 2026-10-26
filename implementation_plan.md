# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-26 #837 cycle 4c: layer direction (#857)

- [x] Measure before (`fitness`, layer edges FE→BFF 6, Shared→FE 0)
- [x] `KiModel` to `src/lib/types.ts`; dashboard, audit log and settings components take `PageData` from `./$types`
- [x] Fitness `boundary-import` refuses type-only imports FE→BFF and Shared→FE; proof table in `fitness-functions.md` §3, deps:graph row in §6
- [x] ADR 0005 «Zyklus 4c», measure after (FE → BFF 6 → 0; other values unchanged)
- [x] Code review round 1 (`docs/reviews/i837c4c-review-1.md`)
- [ ] Closing round
- [ ] Archive, PR (Fixes #857)
