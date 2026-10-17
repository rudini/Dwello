# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W15c: Nebenkostenpauschale on the Mietvertrag (#429)

Branch `claude/w15c-pauschale-429`. Product owner 2026-10-17: field «Nebenkostenpauschale pro Monat», shown everywhere the Akonto is, counts in «Monatlich total», never billed, not on the PDF.

- [ ] @wip scenarios: record in the wizard (review step, total), edit and contract page, apartment monthly costs, statement does not bill it
- [ ] fach-reviewer on scenarios, texts and glossary rows before implementing
- [ ] Migration 0025 `flat_rate_utility_charge` (nullable, default 0), schema, routes, service, API contracts
- [ ] Form: field in `RentStep`, `contract-form`, `contract-wizard` (summary, total, carry-over), hint «Kein Akonto» points to it
- [ ] Display: contract page, apartment monthly costs, every «Monatlich total»
- [ ] Glossary rows «Nebenkostenpauschale», «Monatlich total» (product owner confirms), i18n-begriffe
- [ ] Slice review, feature review, PR `Fixes #429`
