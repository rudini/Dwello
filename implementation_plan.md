# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16: #124, #89, #60 Verwaltungspauschale

- [ ] #60: remove the marker in `SettingsStep.svelte`, cite the Mieterverband leaflet 2026 in the comment (No scenario: code comment only, no behaviour change)
- [ ] #124: preview and generate refuse a rate above 10 % (route schema), `PUT /api/v1/config` refuses `management_fee_pct` above 10 (validator); `*.pg.test.ts` for 10 accepted and stored, 10.01 refused, no 500
- [ ] #124: wizard step «Einstellungen» and settings page refuse above 10 at the field; `statements_error_fee` «von 0 bis 10» in four languages; unit tests in `statement-wizard.test.ts` and for `saveSettings`; hint above 3 % unchanged
- [ ] #124: scenario in `statement-management-fee.feature`: «1000» shows the field error, the wizard stays on the step
- [ ] #89: Mietvertrag gets «Verwaltungspauschale vereinbart» (ja/nein, optional own rate): migration, schema, `docs/data-model.md`, API contracts
- [ ] #89: new contract: ja or nein must be chosen (no default); existing contracts start with «nein»; edit and detail page show it
- [ ] #89: the run rate applies only to contracts with «ja» (or their own rate); «nein» gets 0 %
- [ ] #89: the statement wizard points out the contracts with «nein»
- [ ] #89: help texts (`statements_fee_help`), requirements doc rule 9, four languages
- [ ] fach-reviewer on the @wip scenarios before implementing
- [ ] Slice reviews, feature review (personas, fach-reviewer, daten-pruefer), workflow notes, archive session, PR
