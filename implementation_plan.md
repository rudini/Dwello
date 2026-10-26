# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #838 screen checks in their own shards on main (T1)

- [x] Issue #838 from run 40293821912 (shards 3, 7, 11 held the screen checks of one browser each: 11–18 min against 3.5–7)
- [x] `shardingSeed` tried: no change in `--list --shard`; reverted
- [x] `ci.yml`: on main six shards `--grep sprachen-bildschirme` and six `--grep-invert '@a11y|sprachen-bildschirme'`, names «E2E tests (n/12)» kept; pull requests unchanged; entries carry their Playwright args. Checked: the Changes script run for both events, `--list` 813 + 6×486 = 3731 tests
- [x] Docs: `test-pyramid.md`, T1 measurement in `utility-tree.md`
- [ ] Slice review (`code-reviewer`)
- [ ] PR; No scenario: CI configuration only. After the merge: slowest shard and «CI duration» of the push run on main
