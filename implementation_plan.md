# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17: QR-bill against SIX IG v2.4 (#78, W13)

- [x] Field-by-field check of `qr-bill.service.ts` and the payment part of `pdf.service.ts` against IG QR-bill v2.4 (six-group.com blocked by the network policy: guideline excerpts through `mmx search`, cross-checked with the `swissqrbill` 4.4.2 package); no change of the stored data needed, so the «Stop and ask» does not apply
- [ ] Scenario `@wip` «Der Zahlteil ohne Korrespondenzadresse hat ein Feld für Name und Adresse» (`statement-detail.feature`), seen red
- [ ] fach-reviewer on the scenario and the planned changes
- [ ] Slice 1: QR payload only with the permitted character set (IG 4.1.1); unit test first. No scenario: the payload is only readable by a decoder, covered in `qr-bill.service.test.ts`
- [ ] Slice 2: «Zahlbar durch (Name/Adresse)» with a blank field with corner marks (52 × 20 mm receipt, 65 × 25 mm payment part) when the QR code names no debtor; unit test first
- [ ] Issue for separate house number fields (data model decision) from the comment on #78
- [ ] Result with guideline chapters noted in #78
- [ ] Slice reviews, feature review (fach-reviewer, daten-pruefer, persona)
- [ ] Workflow review, archive the session

Files: `tests/e2e/features/statement-detail.feature`
