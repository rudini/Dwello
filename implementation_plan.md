# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 part 0, fitness check for date comparisons in the BFF

No scenario: tooling only (fitness functions), no app behaviour changes. Product owner, 24.10.2026: #788 in the order 0, 1, 2, point 5, 3, 4.

- [x] Line matcher as a tested function; date comparisons against today (`localToday()`, `today`) count as BFF decisions
- [x] Ratchet: today's findings as legacy exceptions (#788), shrink-only
- [x] Proof: a new date comparison fails
- [x] `fitness-functions.md`
- [x] Review round 1 (`docs/reviews/p0-review-1.md`, 4 Minor: C-1 wrapped `localToday(),` caught; C-2 limits documented; C-3 a list may not be removed; C-4 doc counts)
- [ ] Closing review, PR
