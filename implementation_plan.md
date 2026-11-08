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
- [x] Backend (83ecc9e): migration 0045 (`apartments.earlier_sizes`), values per day in the Verteilschlüssel (`countingWith`), parts at each change day, statement key values of the first billed day, refusals `APARTMENT_SIZE_*`, `DELETE /apartments/:id/size-change`; `apartment-size-from-day.pg.test.ts` seen red on the base
- [x] code-reviewer `docs/reviews/1301-review-1.md` (whole feature): C-1 Major (PDF head printed today's Fläche) fixed and seen red (a93e158), C-3, C-4 fixed; C-2, C-5 stay Minor
- [x] PDF and statement page (83ecc9e): `sizeChangeIntro`, `segmentNote` once, note on the statement page; render and DOM tests seen red
- [x] UI (83ecc9e): «Neue Fläche und Zimmeranzahl gelten ab» in «Wohnung bearbeiten», earlier values and «Änderung entfernen» on the apartment page, axe and language rows `apartment-detail-resized`; merge note of #1284 replaced by `apartments_form_discontinued_merge_enter`
- [x] Glossary rows and i18n terms decided in #1327 (e66c154)
- [x] Personas `docs/design/personas/helga-1301.md`, `weber-1301.md`: P-1 Major (Zimmer up to 6.5) fixed (a93e158); Weber P-2, P-3 Major → fach-reviewer `docs/reviews/1301-fachreview-2.md`, texts fixed and seen red (8d44290); re-run `weber-1301-2.md`: fixed, Minors stay; daten-pruefer `docs/reviews/1301-datenpruefung-1.md`: no findings
- [ ] Merge of `origin/main`, closing code-reviewer round
- [ ] Archive the session in `docs/archive/sessions/1301.md`; PR with `Fixes #1301`
