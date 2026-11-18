# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session

#1453: update Dwello from the browser (branch `ccr-153ae8d3-conoid-1453`)

- [x] `@wip` scenarios `tests/e2e/features/aktualisierung.feature`
- [x] fach-reviewer step 1 (texts in four languages, privacy statement): `docs/reviews/update-fachreview-1.md`; V-1 and the missing terms in #1454
- [x] update service (`backend/src/updater/updater.ts`), lower-layer tests with a Docker API stand-in
- [x] version check and setting `update_check` (backend), `POST /api/v1/update`
- [x] notice, confirmation, animation, failure (frontend), settings switch, privacy statement
- [x] E2E stand-in `backend/scripts/update-stub.ts`, scenarios green
- [x] a11y rows, `accessibility.feature`, `sprachen-bildschirme.feature`
- [x] `compose.yaml`, `docker-compose.prod.yml`, installers, `docs/installation.md`, `marketing/index.html`
- [x] code-reviewer round 1: `docs/reviews/update-review-1.md`
- [x] code-reviewer round 2: `docs/reviews/update-review-2.md`
- [ ] Workflow note: the scenarios ran first after the code; their red was shown by three mutation runs
- [ ] feature review: personas Anna, Helga, Marco, Weber, Sven (`docs/design/personas/*-update.md`), fach-reviewer step 5 `docs/reviews/update-feature-fachreview-1.md`
- [x] No scenario: new version running after the update (`updater.test.ts`), variant without update service and fixed version (`update.pg.test.ts`, `update-notice.test.ts`), the 15-minute sentence (`update-notice.dom.test.ts`)
- [ ] Before marking complete; archive; PR
