# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-11-03: #734 refused PDF opens the app's error page

- [x] Scenarios: decided sentence and step «liest der Liegenschaftsverwalter auf der Fehlerseite {string}» (statements, statement-detail, statement-generate, contract-detail); new: tab title and app navigation, back to the filtered list, letter's tab title and back to the contract; seen red at the missing behaviour
- [x] `pdfRefusal` redirects (303) to `/documents/refused` with the code, `view`/`letter` and the Dwello referrer; a gone statement leads back only to the list (the other pages show that statement); unit tests seen red
- [x] Page `src/routes/documents/refused` in the look of `+error.svelte`; texts in four languages; endpoint unit tests follow the redirect
- [x] lint, check, vitest (4060), E2E of the four features (319) and the rows of the three refusal screens green
- [x] code-reviewer round 1 (`docs/reviews/734-review-1.md`): C-1 open redirect fixed with a test seen red, C-2 screen row `documents-refused-settings`, C-3 tests pin the PDF title and view sentence, C-4 docs (D7c)
- [x] Personas Helga and Marco (`docs/design/personas/helga-734.md`, `marco-734.md`): no Blocker/Major; P-1 and P-2 met by both became #1094
- [x] Issue for the `proxyFile` downloads: #1093
- [x] code-reviewer round 2 (`docs/reviews/734-review-2.md`): C-1 still open (a path resolving to //x), C-5 an invalid URL threw; both fixed with test cases seen red
- [ ] code-reviewer round 3 (C-1, C-5)
- [ ] PR (`Fixes #734`, `Spec change approved: #734`)
