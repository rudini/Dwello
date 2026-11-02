# Code-Review 1023-1 (`fc923d9^..60afa38`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/statement-invoices.service.ts:106-107 | Der JSDoc von `statementChanges` beschreibt noch die ersetzte Regel: «only when the Saldo as claimed does not fall (M-3 B, 454-3 V-30 A)». Seit #1023 zählt der rohe Saldo, auch unter CHF 5. Nur eine erlassene Nachzahlung (#94) zählt vorher als 0. Der Diff ändert die Regel, aber diesen Kommentar nicht, und der sagt jetzt etwas Falsches. |

Keine Blocker, keine Major.

Geprüft: In `recalculation()` (statement.service.ts:609-612) vergleicht die Regel die rohen Saldi. `paymentOf().waived` ist der bestehende Helper (status `paid`, bezahlt 0.00, Nachzahlung unter CHF 5), keine Kopie. `claimed` ist entfernt, `belowMinimum` wird weiter gebraucht (:616, :791). Die Schlussabrechnung ändert sich nicht. `declineCorrection` verweigert über dasselbe `correctionDeclinable`. Die Antwortform bleibt gleich, also braucht es keine Vertragsänderung. Die geänderte Zeile `changed-invoices` in api-specification.md stimmt mit dem Code überein. Den umgekehrten pg-Test (4.00 → 3.00) und den M-1-Test (erlassene 4.00 → 3.00) habe ich gelesen: Ohne die Änderung bzw. ohne den Fall `waived` schlagen sie fehl. Das Szenario ist neu (also frei) und nicht `@wip`. Es nutzt nur bestehende Steps (statement-detail.steps.ts:422, :453, :628). Bei `fc923d9` scheitert es an «Nicht berichtigen», weil vorher 3.00 → −3.00 unter V-30 A beides als 0 galt. Es gibt keinen neuen Bildschirm oder UI-Zustand (der Hinweis «Saldo sinkt» besteht schon) und keinen neuen Text. UBIQUITOUS_LANGUAGE.md:199 («sinkt der Saldo dabei nicht») passt zur neuen Regel. Ponytail: nichts zu streichen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `cd backend && bun run type-check` sauber; `bun test src/__tests__/statement-invoices.pg.test.ts` 47 grün; geänderter pg-Test und M-1-Test zuerst rot; Szenario bei `fc923d9` rot; E2E chromium statement-minimum-balance.feature 25 grün, statement-detail.feature + dashboard.feature 185 grün; `testcheck:audit` sauber.
- Der Fall «erlassene Nachzahlung → Neuberechnung ergibt eine Rückerstattung» (z. B. 4.00 → −2.00, dann `lowers`) ist nur aus dem Code abgeleitet. Kein Test deckt ihn ab. Gelesen habe ich statement-payment.ts:20-33 und carry-over.ts:12-16.
