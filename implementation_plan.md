# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: Phase 2a fitness functions (architecture scenarios in CI)

No scenario: tooling and CI only, no app behaviour changes. Request: Phase 2a of the architecture work (fitness functions for the H/H and H/M scenarios of `docs/architecture/utility-tree.md`); Phase 2b waits for the product owner's approval.

- [x] Re-measure with `tools/arch-baseline/run.sh` (values for the ratchet start)
- [x] `tools/fitness/fitness.ts` + `ratchet.json`: Ä1 field spread, AP1 mirrors and literal sets, Ä4 BFF decisions, boundary imports and module cycles, ratchet read from the base, shrink-only exceptions, `--update`
- [x] PR change size (warning) and nightly co-change coupling (warning)
- [x] T1: CI duration and green rate of `main` (report, warning above 15 min)
- [x] U1: upgrade test previous release tag with demo data → HEAD migrations, row counts kept
- [x] CI jobs in `ci.yml`
- [x] Proof: each check fails on a deliberate local violation
- [x] `docs/architecture/fitness-functions.md`
- [ ] Workflow note: the phase 0 scripts list files with `git ls-files`, so a local fitness run misses new untracked files (`git add -N`); CI sees them
- [x] Slice review round 1 (`docs/reviews/fitness-review-1.md`)
- [x] Closing review round 2 (`docs/reviews/fitness-review-2.md`)
- [x] "Before marking anything complete"
- [x] Report to the product owner, wait for 2b approval (approved 23.10.2026; P2 later, #781; new field over 4 files warns)
- [x] New-field warning (decision of the product owner)
- [x] Closing review round 3 (`docs/reviews/fitness-review-3.md`)
- [x] Closing review round 4 (`docs/reviews/fitness-review-4.md`)
- [x] Closing review round 5 after merging #784 (`docs/reviews/fitness-review-5.md`)
- [ ] PR for 2a: open, CI green, merge
- [ ] 2b: propose one Ä1 candidate with prediction, wait for confirmation
