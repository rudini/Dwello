# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: invoice check hints (#130, #131, #134)

- [ ] #130 rhythm: blocked on the product owner (fach-review V-1 Major: the literal rule hides a missing Q4; proposal in #130, label `entscheiden`)
- [x] #130 Leistungszeitraum: a `deviation`/`gap` finding names how many invoices count only in part (unit + DOM test, four languages)
- [ ] #130 scenario (rhythm): waits for the decision; No scenario for the Leistungszeitraum part (unit + DOM test, as the issue asks)
- [x] #131 late invoices without Leistungszeitraum within 90 days after the period end, listed per building with edit link (pg test, scenario, four languages)
- [x] #134 period under a year: invoices without Leistungszeitraum listed per building with edit link, a hint only (scenario, four languages)
- [x] a11y/language state `invoice-hints` for the new hints (screens.json, accessibility.feature, sprachen-bildschirme.feature)
- [x] fach-reviewer round 1 on the scenarios: `docs/reviews/hints-fachreview-1.md`
- [ ] code-reviewer round 1: `docs/reviews/hints-review-1.md`
- [ ] personas on the preview hints
- Files: `backend/src/services/invoice-completeness.service.ts`, `src/lib/statement-wizard.ts`, `src/routes/statements/generate/{PreviewChecks,InvoiceHint}.svelte`, `messages/*.json`, tests (`invoice-completeness*.test.ts`, `api-contracts.pg.test.ts`, `statement-wizard*.test.ts`, `tests/contracts/invoice-completeness.json`, `statement-generate.feature` and steps, a11y screens)
- [ ] workflow-review; session archived
