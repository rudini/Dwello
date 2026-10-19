# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W7: glossary help texts of #402 (#447)

Branch `w7-issue-447`. Issue #447 (closes #286, #294, #362, #369, #370): an own rate of 0 % is refused, «bis 3 %», it «Costi dell’immobile», help texts as the glossary rows.

- [ ] `@wip` scenarios: «Eigener Satz von 0 % wird abgelehnt» (`contract-new.feature`), «… beim Bearbeiten abgelehnt» (`contract-edit.feature`), «Die Hilfe erklärt "<Begriff>" wie das Glossar» (`help.feature`); red lower-layer tests (contract form, management fee pg, PDF render, help, settings, audit log page)
- [ ] fach-reviewer on the scenarios and the proposed texts (de/fr/it/en)
- [ ] Own rate above 0: `src/lib/contract-form.ts`, `backend/src/routes/contracts.ts`, `contracts_error_fee_rate_zero`
- [ ] «bis 3 %»: `glossary_fee_text`, `config_help_management_fee`, `docs/nebenkostenabrechnung-anforderungen.md`
- [ ] it «Costi dell’immobile»: `statements_building_costs`, `pdf.service.ts`, `docs/design/i18n-begriffe.md`
- [ ] Help texts: `glossary_balance_text`, `audit_empty_text`; markers #286, #294, #362, #369, #370 removed
- [ ] Slice review (code-reviewer)
- [ ] Feature review (persona, fach-reviewer if texts changed after review 1)
- [ ] PR `Fixes #447`, `#286`, `#294`, `#362`, `#369`, `#370`
