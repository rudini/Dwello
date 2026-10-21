# Code-Review #509, Runde 2 (Abschlussrunde vor Push)

Commit-Bereich: `381c7c7..214c224` (ohne docs/reviews, implementation_plan.md, docs/archive, docs/design/personas). Vorbericht: `docs/reviews/509-review-1.md`.

## Status offener IDs

| ID | Schwere | Status |
|----|---------|--------|
| C-1 | Minor | Geschlossen: `backend/src/__tests__/statement-pdf.pg.test.ts:430` heisst jetzt «nennt bei einer Heizposition nach Tagen im Leistungszeitraum keinen Anteil nach Heizprofil» und stimmt mit den Prüfungen (`not.toContain('für eine Rechnung ohne Leistungszeitraum')`, `not.toContain('67.39 % der Heizkosten')`) und dem Kommentar :427-429 überein. |

## Neue Befunde im Delta

Keine. Das Delta ändert nur den Testnamen; kein Verhalten, kein weiterer Code.

## Nicht bestätigt

- lint, check, type-check, Render- und PDF-pg-Tests, E2E statement-detail auf 381c7c7: vom Aufrufer gemeldet (nicht erneut ausgeführt; für 214c224 nicht nötig, da nur ein Testname-String geändert wurde).
