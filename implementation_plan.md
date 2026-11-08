# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session: #1301 «Fläche und Zimmeranzahl ab einem Tag»

- [x] @wip scenario `tests/e2e/features/apartment-size-from-day.feature` before the code (a90a731), seen red at the missing field and the amounts; the 2026 row already holds on the base
- [x] fach-reviewer step 1 `docs/reviews/1301-fachreview-1.md`: every text in four languages; V-1 (remove the last change), V-2 (correction without a day), V-3, V-4, V-5, V-8, M-1 taken in with scenarios; V-6 → #1328 (sentence in the help text); V-7 rejected (the backup is a pg_dump of the whole database); terms → #1327
- [ ] Backend: migration, values per day in the Verteilschlüssel, parts at the day, statement key values, refusals; pg tests seen red
- [ ] code-reviewer round on the backend
- [ ] PDF and statement page: the apartment with other values from a day
- [ ] UI: «gelten ab» in «Wohnung bearbeiten», earlier values on the apartment page; merge note of #1284 removed
- [ ] code-reviewer round on the UI
- [ ] Personas, fach-reviewer step 5 if texts changed, daten-pruefer
- [ ] Merge of `origin/main`, closing code-reviewer round
- [ ] Archive the session in `docs/archive/sessions/1301.md`; PR with `Fixes #1301`
