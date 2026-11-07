# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #1175 examples at the Kontoinhaber fields

- [x] Scenario «Die Felder des Kontoinhabers zeigen Beispiele» (`settings.feature`), seen red at the examples and at «(optional)»
- [x] Examples at name (new `settings_account_holder_name_example`, four languages), street, PLZ, Ort; street marked optional (`SettingField` passes `optional`)
- [x] Checks: lint, check, fitness, type-check, affected unit tests, a11y and language looks of `account-holder`, Prettier on added files
- [ ] Slice review (`code-reviewer`)
- [ ] Persona Marco (P-3 of #1166) on the Kontoinhaber fields
- [ ] Archive session, PR (`Fixes #1175`)
