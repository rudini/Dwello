# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #1113 the toast avoids the focused row

- [x] Scenario «Die Erfolgsmeldung verdeckt die Kategorie mit dem Fokus nicht» (`categories.feature`), seen red at its last step (-93 px)
- [x] DOM test in `ui-layout-parts.dom.test.ts`, seen red; `place()` in `src/lib/ui/ToastRegion.svelte` measures the focused element's `li`/`tr`
- [x] Slice review round 1 (`docs/reviews/1113-review-1.md`)
- [x] Personas Marco and Helga (`docs/design/personas/marco-1113.md`, `helga-1113.md`)
- [x] Fixes: button group of a new key (`data-focus-row`), tall rows count by the focused part, focus to the row now in place when the next row went too (#1123)
- [ ] Slice review round 2
- [ ] PR
