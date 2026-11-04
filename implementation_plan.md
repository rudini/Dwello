# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session #1096: toasts never move the page; focus after removal

Branch `ccr-7b33ff2a-sj3b8c`. Decided (product owner) 2026-11-04 in #1096. Spec change approved: #1096 (the step «verdeckt die Erfolgsmeldung nicht, was den Fokus hat» checks no overlap instead of «below the focus»: the toast may stand at the top).

- [x] S1 @wip scenario «Die Erfolgsmeldung bewegt die Seite nicht» (zugangsschluessel.feature), seen red (the page moved 112 px); the step «verdeckt … nicht» now measures above, below and beside (spec change #1096)
- [x] S1 ToastRegion: no scroll padding, spacer, `scrollIntoView` or `--toast-room`; top placement when the focused element lies where the toast would stand. Files: `src/lib/ui/ToastRegion.svelte`, `Dialog.svelte`, `tests/e2e/{features/zugangsschluessel.feature,questions/app-frame.ts,screenplay/{interactions,questions}.ts,steps/app-frame.steps.ts,tasks/{access-keys,categories}.ts}`
- [ ] S2 @wip scenario: one success toast at a time, a new one replaces the older; errors stay; seen red
- [ ] S2 implementation
- [ ] S3 @wip scenarios: after deleting a category the focus is on the next row, without one on the list's heading; the page does not jump; recalculating a statement keeps the place; seen red
- [ ] S3 implementation
- [ ] Slice reviews (code-reviewer) per slice
- [ ] Personas Helga (150 %, 200 %) and Marco (phone, tablet)
- [ ] Before marking complete: lint, check, backend type-check, affected vitest and E2E, Prettier on added files
- [ ] Archive the session; PR merged
