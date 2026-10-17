# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W10c: agreed Nebenkosten per Mietvertrag (#91)

- [ ] Implementation issue for #91 created (own "Done means")
- [ ] `@wip` scenarios (`statement-agreed-costs.feature`, `contract-new.feature`, `contract-edit.feature`) committed, `fach-reviewer` before implementing
- [ ] Slice 1, backend: `contract_categories` (migration 0017, schema, `docs/data-model.md`), new contract with all umlagefähige categories, existing contracts from their statements, calculation bills only agreed categories, API to read and answer
- [ ] Slice 2, statement wizard: question for unanswered categories in the step «Einstellungen», answer stored on the Mietvertrag; notice of not agreed costs; text of the «Neu» finding
- [ ] Slice 3, contract: checkboxes in «Neuer Mietvertrag» and «Mietvertrag bearbeiten», list on the detail page
- [ ] Slice 4, PDF names the agreed categories, stored with the statement; stored statements unchanged
- [ ] a11y screens and languages for the new states
- [ ] Feature review: personas, `fach-reviewer`, `daten-pruefer`
- [ ] Session archived, pull request merged

Files changed: –
