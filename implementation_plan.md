# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: NFR issues on my own (#671 first)

- [x] #671 part 1: new-tab links send no Referer (`Button.svelte`, `ui-button.dom.test.ts` seen red)
- [x] #671 part 2: @wip scenario seen red; `fach-reviewer` (`docs/reviews/671-fachreview-1.md`): V-1 wording «rappels suivants» taken, V-2 English gap taken; Stand stays (no content change)
- [x] fr and en texts of `privacy_mail_smtp`, `privacy_mail_resend`, `privacy_mail_smtp_provider`; scenario green without @wip, privacy.feature 37 passed
- [x] Slice review (`docs/reviews/671-review-1.md`): C-1 smtp/resend variants now in `privacy-i18n.dom.test.ts` (red with the old texts), C-2 scenario title
- [x] #671 PR: pushed
- [x] #847: a 413 shows «Die Datei ist zu gross.» and what to do in four languages (`error-page.test.ts` seen red); No scenario: with JavaScript the browser refuses the file first (tests/e2e/CLAUDE.md, No scenario, item 4)
- [x] #847 review (`docs/reviews/847-review-1.md`): no findings
- [x] #847 PR: pushed
- [x] #713: PreToolUse hook `main-push-guard.mjs` asks before a push whose resolved target is main; tests red first
- [x] #713 reviews: `docs/reviews/713-review-1.md` (C-1 Major: cd not followed, fixed; C-2 to C-5 fixed), `713-review-2.md` (C-6 to C-8 Minor, fixed), `713-review-3.md` (closing round, C-9 to C-11 Minor, fixed without a further round)
- [x] #713 PR: pushed
- [x] #713 Copilot review on #1011 (six findings, all held, fixed with tests red first); closing rounds `713-review-4.md` (C-12 to C-15), `713-review-5.md` (C-16), `713-review-6.md` (C-17, C-18), all Minor and fixed; the last fixes without a further round (three rounds reached)
- [x] #724: cause found (cold import in the first test against the old 5 s timeout, removed by #849); three full server runs green; issue closed with the evidence, no code change
- [x] #728: footer shows «Version unbekannt» in four languages when the build has no version (`src/lib/app-version.ts`, `shell.dom.test.ts` seen red); No scenario: the E2E app is always a build with a version
- [x] #728 review (`docs/reviews/728-review-1.md`): no findings
- [x] #728 PR: pushed
- Deferred (need thresholds first): #748 tenant export streaming, #746 Protokoll paging («once the length is felt»)
