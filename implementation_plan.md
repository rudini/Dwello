# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to a file of its own, `docs/archive/sessions/<n>.md` (`<n>`: the lowest issue number it closes, without one its branch name; one file per pull request, also when a brief names one file for a request with several, which is then the first one's; a new file, so parallel pull requests never touch the same lines), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and write the session to its own archive file at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History: `docs/archive/implementation-plan-verlauf.md` (phases 0–22 and the sessions up to 2026-11-08, closed: add nothing) and `docs/archive/sessions/` (one file per later session).

## Session

Issue #1445: marketing videos (short and vertical cut, long cut caption fix, YouTube texts, scripts). No scenario: marketing tooling and video files, no app behaviour changes.

- [x] Long cut: captions no longer cover the app's toast «Gebäude … gespeichert»
- [x] Short cut 16:9, about 60 s, five highlights of about 8–10 s
- [x] Vertical cut 9:16, 30–45 s, mobile view (390 px): invoice PDF → KI → statement → QR-bill → «Gratis installieren – dwello.ch»
- [x] YouTube title, description, chapter marks and thumbnail per cut
- [x] Scripts and README in `docs/marketing-video/`
- [ ] Landing page link: waits for the YouTube address («Stop and ask» of #1445)
- [ ] Slice review (`code-reviewer`), closing round
- [ ] Archive session, PR
- [x] Vertical cut uploads all three invoices and shows one: with only the Kaminfeger the tenants get a refund, which has no QR-bill (issue said «an invoice PDF»; named in the PR)
- [x] Vertical cut has no chapter marks: Shorts show none, and YouTube needs three parts of at least 10 s (named in the PR)
- [x] Files: `docs/marketing-video/*` (new), `docs/design/tools/persona-kit.mjs` (exports `sessionToken`)
