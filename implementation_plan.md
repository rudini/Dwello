# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W10c: agreed Nebenkosten per Mietvertrag (#91)

- [x] Implementation issue for #91 created (own "Done means"): #363; decision issues #368 (agreed from a date, follow-up contract), #369 (glossary)
- [x] `@wip` scenarios (`statement-agreed-costs.feature`, `contract-new.feature`, `contract-edit.feature`) committed, `fach-reviewer` before implementing: `docs/reviews/w10c-fachreview-1.md`
- [x] Slice 1, backend: `contract_categories` (migration 0018, schema, `docs/data-model.md`), new contract with all umlagefähige categories, existing contracts from their statements, calculation bills only agreed categories, API to read and answer; heating profile and Tankbestand only when agreed (V-3), no «Rechnung geändert» for not agreed categories (V-2), demo contracts agree everything
- [ ] Code review slice 1
- [ ] Slice 2, statement wizard: question for unanswered categories in the step «Einstellungen», answer stored on the Mietvertrag; notice of not agreed costs; text of the «Neu» finding
- [ ] Slice 3, contract: checkboxes in «Neuer Mietvertrag» and «Mietvertrag bearbeiten», list on the detail page
- [ ] Slice 4, PDF names the agreed categories, stored with the statement; stored statements unchanged
- [ ] a11y screens and languages for the new states
- [ ] Feature review: personas, `fach-reviewer`, `daten-pruefer`
- [ ] Session archived, pull request merged

Files changed: `backend/migrations/0018_contract_categories.sql`, `backend/src/db/schema.ts`, `backend/src/services/agreed-category.service.ts`, `contract.service.ts`, `calculation.service.ts`, `statement.service.ts`, `statement-invoices.service.ts`, `backend/src/routes/contracts.ts`, `backend/demo/demo-data.sql`, `docs/data-model.md`, tests (`agreed-categories.pg.test.ts`, `migrations.pg.test.ts`, `tests/e2e/…`)
