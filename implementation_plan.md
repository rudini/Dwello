# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7: #141 and #116 (draft delete in one step, delete a started Mietvertrag)

- [ ] #141 `@wip` scenario «Abgelehntes Vertragsende behält den Entwurf» (`contract-detail.feature`), seen red
- [ ] #116 `@wip` scenarios «Irrtümlich erfassten Mietvertrag löschen», «… nur mit Bestätigung», «Mietvertrag mit Abrechnung kann nicht gelöscht werden» (`contract-detail.feature`), seen red
- [ ] fach-reviewer on the #116 scenarios and texts before implementing
- [ ] #141 backend: `PUT /contracts/:id?deleteDraft=<statement>` deletes the draft and changes the contract in one transaction (`contract-end.pg.test.ts`: refused → draft kept, accepted → draft gone)
- [ ] #141 BFF end dialog (`endDeletingDraft`) and edit form (`deleteDraftAndSave`) use it (DOM test: no separate DELETE)
- [ ] #116 backend: `DELETE /contracts/:id` refuses a started contract without `?confirmMistake=true` (`CONTRACT_STARTED`) and one with statements (`CONTRACT_HAS_STATEMENTS`); pg tests
- [ ] #116 dialog: confirmation checkbox for a started contract; help text `contracts_parties_fixed_mistake` names started contracts
- [ ] Test clean-up (`tests/e2e/fixtures/backend.ts`, backend helpers) passes the flag
- [ ] `tests/contracts/*.json`, `docs/api-specification.md`, `docs/anforderungen-vertragsende.md` (A-7 implemented), `tests/a11y/screens.json` + `accessibility.feature` + `sprachen-bildschirme.feature` for the dialog state
- [ ] Slice reviews, feature review (personas, fach-reviewer), finish checks, PR
