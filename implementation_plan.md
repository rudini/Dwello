# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).


## Session

#1202: Kontoinhaber entries kept when «Kontoinhaber ist der Absender» is ticked and cleared again (branch `ccr-153ae8d3-conoid-1202`).

- [x] `@wip` scenario «Die eingegebenen Angaben zum Kontoinhaber bleiben bis zum Speichern erhalten» (`settings.feature`), seen red at its `Dann` step
- [x] DOM test reproducing the loss (`config-page.dom.test.ts`), seen red (empty fields)
- [x] Fix in `src/routes/config/+page.svelte` and `SettingField.svelte` (typed values held in the page), scenario green without `@wip` (`settings.feature` 30 passed)
- [x] Slice review round 1 (`docs/reviews/1202-review-1.md`); C-1 and C-2 fixed, C-2 with the scenario «Gespeichert mit dem Absender als Kontoinhaber, kommen die gelöschten Angaben nicht zurück» (seen red)
- [x] Feature review: personas Marco and Helga (`docs/design/personas/marco-1202.md`, `helga-1202.md`), no findings; shared observation → #1298
- [ ] Merge `origin/main`, closing round, archive in `docs/archive/sessions/1202.md`, PR with `Fixes #1202`
