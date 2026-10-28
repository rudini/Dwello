# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #654 Checkbox and RadioGroup errors, date picker

- [x] `@wip` scenario «Die Meldung verschwindet, sobald der Irrtum bestätigt ist» (`contract-detail.feature`), seen red (the dialog still showed 1 error)
- [x] Each radio option's explanation is read once (`ui-choices.dom.test.ts`)
- [x] A Checkbox error disappears once the box is changed, and shows again on the next submit
- [x] A RadioGroup error disappears once the choice is changed (`sent-error.svelte.ts` notes the change in the capture phase, before a caller whose error follows from the choice, `AgreementQuestion`, sees the new value); category radio target in `tests/e2e/targets/categories.ts` now finds the option by its exact name
- [ ] Native date picker checked with a screen reader (persona Sven); findings fixed or recorded
- [ ] Slice review
- [ ] PR
