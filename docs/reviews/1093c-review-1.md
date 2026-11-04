# Code-Review #1093, Schlussrunde (Delta `20e6b12a7..910f261ae`)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/documents/refused/+page.server.ts:28-36`, `src/lib/server/file-proxy.ts:13` | Weiter offen wie in `docs/reviews/1093-review-1.md`: Eine andere Ablehnung eines Belegs als `INVOICE_NOT_FOUND` (z.B. `BELEG_NOT_FOUND`, 500, Body ohne JSON) zeigt «PDF nicht verfügbar» und führt auf `/statements`. Das Delta ändert daran nichts. |

Geschlossen: C-2, C-3.

Geprüft: `deleted` geht vor `backendMessage`, nur für `INVOICE_NOT_FOUND` und `DOCUMENT_NOT_FOUND`. Die übrigen Codes (`STATEMENT_NOT_FOUND`, Einstellungen, ohne Code) sind unverändert. Der neue Unit-Test wäre ohne die Änderung rot, weil er den alten Satz «Laden Sie die Seite neu.» bekäme. Die zwei geänderten Szenarien sind auf `origin/main` (`e9436d597`) noch nicht vorhanden, also frei änderbar. Die neuen Schlüssel stehen in allen vier `messages/*.json`. Der Wortlaut in fr/it/en folgt `backend_statement_not_found` und `docs/design/i18n-begriffe.md` (facture/fattura/invoice, document/documento, supprimer/eliminare/delete), Genus und Angleichung stimmen («supprimée», «eliminata», «supprimé», «eliminato»). `invoice-not-found.json` entspricht `refusal('INVOICE_NOT_FOUND', 'Invoice not found')` (`backend/src/routes/invoices.ts`). Die zwei neuen pg-Vertragstests rufen die echten Routen auf, und der Frontend-Test liest beide Contracts. Für den unveränderten Bildschirmzustand ist keine neue Zeile in `screens.json` nötig. Ponytail: Lean already.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Prüfungen, jeweils «vom Aufrufer gemeldet»: `bun run lint` (auf 910f261ae), `bun run check` (nur auf 99fac4d0f, nicht auf 910f261ae), `bunx vitest run src/__tests__/pdf-refusal.test.ts` (neuer Satz-Test zuerst rot), Backend `bun test src/__tests__/api-contracts.pg.test.ts -t "gelöschten Dokuments|gelöschten Rechnung"`, E2E Chromium der vier neuen Szenarien und der axe-/Sprachzeilen von `invoice-document-refused` und `document-pdf-refused`, Prettier auf den geänderten Zeilen.
- `cd backend && bun run type-check` für das Delta (geänderte `api-contracts.pg.test.ts`) meldet der Aufrufer nicht als gelaufen.
- WebKit (Bild-Dokument ohne `download`, #424): weiterhin nur durch Lesen geprüft, wie in Runde 1.
