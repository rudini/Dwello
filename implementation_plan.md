# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (#250, #254: Leistungszeitraum over several years)

- [x] #250: help text and field examples of the Leistungszeitraum use one year (the current year, as the date fields' examples), all four languages; DOM tests pin it (form, help page). No scenario: wording without new behaviour, as #250 says; covered by `sprachen-bildschirme.feature`
- [x] #254: help at the Leistungszeitraum (invoice form, edit form, upload dialog) and on the help page names a cost over several years, all four languages; scenarios in `invoice-new.feature`, `help.feature`
- [x] #254: scenario in `statement-generate.feature`: CHF 500 over 01.04.2026 – 31.03.2031 counts CHF 75.30 in 2026 and CHF 99.95 in 2027 (green on the base: the behaviour exists)
- [x] #254: lower-layer test of `inPeriod` over five years (`service-period.pg.test.ts`, red with the prorating taken out)
- [x] fach-reviewer round 1 on scenarios and texts: `docs/reviews/w3-fachreview-1.md`; V-2 → #276
- [x] code-reviewer round 1: `docs/reviews/w3-review-1.md`; C-1 → #282 (decision)
- [x] personas: `docs/design/personas/weber-w3-leistungszeitraum.md`, `docs/design/personas/helga-w3-leistungszeitraum.md`
- [x] fach-reviewer round 2 on the changed texts: `docs/reviews/w3-fachreview-2.md`
- [x] Workflow note: scenario of existing behaviour, one pull request for two issues, contradicting decisions block the merge (`docs/reviews/workflow-notes-issue-250-254.md`)
- [ ] closing code-reviewer round
- [ ] pull request merged

Files: `messages/{de,fr,it,en}.json`, `src/routes/invoices/InvoiceDataFields.svelte`, `src/routes/help/+page.svelte`, `src/__tests__/{invoice-pages,invoice-upload-dialog,help-page}.dom.test.ts`, `backend/src/__tests__/service-period.pg.test.ts`, `tests/e2e/features/{statement-generate,help,invoice-new}.feature`, `tests/e2e/{steps,targets,questions}/invoice-form*`, `docs/nebenkostenabrechnung-anforderungen.md`
