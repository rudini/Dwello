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
- [ ] Slice review
- [ ] PR
- Deferred (need thresholds first): #748 tenant export streaming, #746 Protokoll paging («once the length is felt»)
