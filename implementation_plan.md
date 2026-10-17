# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W2e: berichtigte Abrechnung (#120, #358)

- [x] Implementation issue #358 created (A-11, «Done means» from #120)
- [x] @wip scenarios: statement-detail.feature (berichtigen, Bestätigung, Anrechnung, ersetzte bleibt unverändert), contract-edit.feature (Vertragsdaten nach dem Berichtigen)
- [x] fach-reviewer on the scenarios and planned texts before implementing (`docs/reviews/w2e-fachreview-1.md`; new issues #360 partial payments, #362 glossary)
- [ ] Slice 1 backend: migration (replaced_by_id, prior_payments), status `replaced`, `correctStatement`, offset in `generateStatement`, contract dates ignore replaced statements; pg tests
- [ ] Slice 2 UI: action «Abrechnung berichtigen» with confirmation, status «Ersetzt», links «ersetzt NK-…» / «ersetzt durch NK-…», row «Bereits bezahlt», statement run bills a replaced contract again, texts that sent the landlord outside Dwello; four languages
- [ ] Slice 3 PDF: «ersetzt NK-…» and the offset row
- [ ] Docs: A-11 implemented, data-model.md, api-specification.md; markers #120 removed
- [ ] Feature review: personas, fach-reviewer, daten-pruefer
- [ ] Audit log (#111) pointer left for the correction
