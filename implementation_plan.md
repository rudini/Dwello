# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: contracts-not-loaded hint linked and shorter (#665, #666)

- [x] @wip scenarios: the hint is the description of «Wohnung» and «Vertragsbeginn» (#665); its shorter wording (#666)
- [x] fach-reviewer step 1 on the wording of #666 (`docs/reviews/b665-fachreview-1.md`); V-1 fixed (af5fab3), issues #1142, #1143
- [x] Product decision on the changed lines of the non-@wip scenarios that quote the old wording (#666, «Decided (product owner)»)
- [x] Slice 1 (#665): `Field` `describedby` through `Select` and `DateInput`; the hint linked (`Field`, `Select`, `DateInput`, `ContractsUnknown`, `ApartmentStep`, `PeriodStep`)
- [x] Slice 2 (#665): `src/lib/ui/LiveRegion.svelte` replaces the hand-made `role="status"` wrappers (also `ContractForm`); the round-3 region at «Vertragsbeginn» was dropped again (C-1: unreachable since #468)
- [x] code-reviewer slice 1+2 (`docs/reviews/b665-review-1.md`); C-1 fixed (8e11340)
- [x] Slice 3 (#666): shorter wording in all four languages (`messages/*.json`, `ContractsUnknown.svelte`, scenarios, DOM tests)
- [ ] code-reviewer round 2: af5fab3, C-1 fix, #666 (`docs/reviews/b665-review-2.md`)
- [x] fitness split: `fe:ui/illustrations` module (8c17129)
- [x] Feature review: Sven (`docs/design/personas/sven-b665.md`)
- [ ] Feature review: Helga or Marco on the #666 wording
- [ ] #665 «the rest»: say which findings are fixed and which stay
- [ ] Checks: lint, check, backend type-check, full vitest, fitness `--base origin/main`, fallow audit, Prettier on added files, affected E2E and axe/language rows
- [ ] Archive the session; PR (step 9 by the coordinator)
