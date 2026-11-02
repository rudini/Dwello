# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #738 statement wizard step «Gebäude»

- [x] Scenarios (`statement-generate.feature`): failed invoice count, failed existing-statements check, name and description of a building's choice, 390 px, focus on the step when resumed; seen red (390 px: red only at the missing test id, the overflow does not reproduce; it pins kept behaviour)
- [x] A failed state per count (`BuildingStep.svelte`, `statements_buildings_invoices_failed`, `statements_buildings_billed_failed` in de/fr/it/en)
- [x] Checkbox named by building and address, counts and apartments as description; «1 Wohnung» singular (`BuildingChoice.svelte`)
- [x] Focus on the step heading when the wizard opens in a later step (`StatementWizard.svelte`)
- [x] a11y and language rows: state `buildings-counts-failed`
- [x] Code review round 1: `docs/reviews/738-review-1.md`
- [x] Persona round 1: `docs/design/personas/sven-738.md`, `docs/design/personas/marco-738.md`
- [ ] Code review of the review fixes (Sven P-1 Major)
- [ ] PR
