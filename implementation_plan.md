# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #788 point 5b, the end refusals (the backend decides)

Product owner, 24.10.2026: on every save (`PUT /contracts/:id`) the backend refuses an end before the start (`CONTRACT_END_BEFORE_START`) and a newly set end before today without `confirmPastEnd: true` (`CONTRACT_END_PAST`); a stored end sent again needs no confirmation (Fachreview #459 V-3). The texts keep today's wording (`backend_<code>` = `contracts_end_before_start_on`, `contracts_end_past_confirm` in all four languages). No scenario: the refusal is only reached past the dialog's and the form's own check, which the E2E stack cannot bypass; «Vergangenes Vertragsende ohne Bestätigung» and the past-end scenarios of `contract-edit.feature` pin what the user sees. Refs #788.

- [x] Backend `CONTRACT_END_BEFORE_START` (`contract-end-refusals.pg.test.ts`, red first)
- [x] Backend `CONTRACT_END_PAST` with `confirmPastEnd` (same file, red first; the stored-end test by taking the exception out)
- [x] Messages `backend_contract_end_before_start`, `backend_contract_end_past` (four languages, copied from `contracts_end_before_start_on`, `contracts_end_past_confirm`)
- [x] BFF end action: sends `confirmPastEnd`, shows the backend refusal; no date compare; keeps the «no real day» hint (input check, no decision) and «already set» (`contract-actions.test.ts`, red first)
- [x] «Bearbeiten» (`ContractForm`) sends `confirmPastEnd` once confirmed (`contract-edit.dom.test.ts`, red first)
- [x] Callers that set a past end: 14 backend tests in 5 files and the E2E seeds (`fixtures/backend.ts`) send the confirmation
- [x] API contracts `contract-end-past.json`, `contract-end-before-start.json` (checked in `api-contracts.pg.test.ts`); `docs/api-specification.md`; fitness `--update` (bffDates 5 → 3, BFF decisions 13 → 11)
- [x] Workflow note: no `fach-reviewer` round before the code; the rule and its texts are unchanged (same wording, new keys), only the layer that enforces it moves; the `POST` of a new contract does not check a past end (the wizard asks in the browser), named in the pull request
- [ ] E2E `contract-detail.feature`, `contract-edit.feature` green, review, PR
