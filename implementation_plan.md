# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17: QR-bill against SIX IG v2.4 (#78, W13)

- [x] Field-by-field check of `qr-bill.service.ts` and the payment part of `pdf.service.ts` against IG QR-bill v2.4 (six-group.com blocked by the network policy: guideline excerpts through `mmx search`, cross-checked with the `swissqrbill` 4.4.2 package); no change of the stored data needed, so the «Stop and ask» does not apply
- [x] Scenario `@wip` «Der Zahlteil ohne Korrespondenzadresse hat ein Feld für Name und Adresse» (`statement-detail.feature`), seen red
- [x] fach-reviewer round 1 on the scenario and the planned changes (`docs/reviews/78-fachreview-1.md`)
- [x] QR payload only with the permitted character set (IG 4.1.1), IBAN in capitals, no line break after EPD; unit tests first. No scenario: the payload is only readable by a decoder, covered in `qr-bill.service.test.ts`
- [x] «Zahlbar durch (Name/Adresse)» with a blank field with corner marks (52 × 20 mm receipt, 65 × 25 mm payment part) when the QR code names no debtor; the payment part prints creditor and debtor as in the QR code; unit tests first, scenario green
- [x] House number in the street line: decided in #102 (no separate field), no new issue
- [x] Issue #395 for the made-up creditor without Firmenadresse (pre-existing)
- [x] code-reviewer round 1 (`docs/reviews/78-review-1.md`): C-1 to C-7 fixed (field size test, receipt field ends above the amount, lengths cut in the QR data, scenario step without Korrespondenzadresse)
- [x] persona Dr. Weber (`docs/design/personas/dr-weber-78.md`): nothing to fix
- [ ] daten-pruefer round 1
- [ ] code-reviewer round 2 on the fixes
- [ ] Result with guideline chapters noted in #78
- [ ] Slice reviews, feature review (fach-reviewer, daten-pruefer, persona)
- [ ] Workflow review, archive the session

Files: `tests/e2e/features/statement-detail.feature`, `backend/src/services/qr-bill.service.ts`, `backend/src/services/pdf.service.ts`, `backend/src/__tests__/qr-bill.service.test.ts`, `backend/src/__tests__/statement-pdf-render.test.ts`, `backend/src/__tests__/helpers/pdf-text.ts`, `tests/e2e/steps/tenant-form.steps.ts`, `docs/reviews/78-fachreview-1.md`, `docs/reviews/78-review-1.md`, `docs/design/personas/dr-weber-78.md`
