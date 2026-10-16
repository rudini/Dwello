# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7: #141 and #116 (draft delete in one step, delete a started Mietvertrag)

- [x] #141 `@wip` scenario «Abgelehntes Vertragsende behält den Entwurf» (`contract-detail.feature`), seen red
- [x] #116 `@wip` scenarios «Irrtümlich erfassten Mietvertrag löschen», «… nur mit Bestätigung», «Mietvertrag mit Abrechnung kann nicht gelöscht werden» (`contract-detail.feature`), seen red
- [x] fach-reviewer on the #116 scenarios and texts before implementing
- [x] #141 backend: `PUT /contracts/:id` with `deleteDraft` in the body deletes the draft and changes the contract in one transaction (`contract-end.pg.test.ts`: refused → draft kept, accepted → draft gone)
- [x] #141 BFF end dialog (`endDeletingDraft`) and edit form (`deleteDraftAndSave`) use it (DOM test: no separate DELETE)
- [x] #116 backend: `DELETE /contracts/:id` refuses a started contract without `?confirmMistake=true` (`CONTRACT_STARTED`) and one with statements (`CONTRACT_HAS_STATEMENTS`); pg tests
- [x] #116 dialog: confirmation checkbox for a started contract; help text `contracts_parties_fixed_mistake` names started contracts
- [x] Test clean-up (`tests/e2e/fixtures/backend.ts`, backend helpers) passes the flag
- [x] `tests/contracts/*.json`, `docs/api-specification.md`, `docs/anforderungen-vertragsende.md` (A-7 implemented), `tests/a11y/screens.json` + `accessibility.feature` + `sprachen-bildschirme.feature` for the dialog state
- [x] fach-reviewer round 1: `docs/reviews/w7-fachreview-1.md`; glossary «Leerstand» → #279
- [x] fach-reviewer round 2: `docs/reviews/w7-fachreview-2.md`
- [x] code-reviewer round 1: `docs/reviews/w7-review-1.md`
- [x] personas: `docs/design/personas/anna-w7.md`, `docs/design/personas/helga-w7.md`
- [x] Helga again on the new text of a billed contract: `docs/design/personas/helga-w7-2.md`
- [ ] code-reviewer round 2
- [x] Workflow note: `docs/reviews/workflow-notes-issue-116-141.md`
- [ ] Slice reviews, feature review (personas, fach-reviewer), finish checks, PR

Files: `backend/src/services/contract.service.ts`, `backend/src/routes/contracts.ts`, `src/routes/contracts/[id]/+page.server.ts`, `src/routes/contracts/[id]/+page.svelte`, `src/routes/contracts/[id]/DeleteContract.svelte`, `src/routes/contracts/ContractForm.svelte`, `messages/*.json`, tests (`contract-end.pg`, `contract-delete.pg`, `api-contracts.pg`, test clean-ups, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`), `tests/e2e/**`, `tests/a11y/screens.json`, `tests/contracts/*`, `docs/api-specification.md`, `docs/anforderungen-vertragsende.md`.
