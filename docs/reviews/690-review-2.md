# Code-Review #690, Runde 2 (89ba506..49e4237)

Geschlossen: C-1, C-2, C-3.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Minor | backend/src/services/qr-bill.service.ts:334-345 | `creditorOf` wurde zwischen den JSDoc «Generate complete QR-bill data for a statement» und `generateQRBillForStatement` eingefügt. Der alte Kommentar steht jetzt verwaist über dem neuen JSDoc von `creditorOf`, und `generateQRBillForStatement` hat keinen Doc-Kommentar mehr. Der Kommentar sagt damit über die Stelle, an der er steht, etwas Falsches. Abhilfe: den alten Block direkt über `generateQRBillForStatement` stellen. |

Keine Blocker, keine Major.

Geprüft:
- `creditorOf` entscheidet Warnung und Verweigerung gleich. `creditorAddressMissing` ist ohne IBAN `false` (`qrBillConfig` gibt dann `null` zurück).
- Die Einstellungsseite markiert beim Laden weiter nach `creditorMissing`, also nach der Regel der Speicherung (`src/routes/config/+page.server.ts:22`, unverändert).
- Die Verträge `config.json` und `config-creditor-missing.json` sind durch `api-contracts.pg.test.ts:994-1010` abgedeckt. `paymentPart` in `statements.json` und `statement-updated.json` passt zu `claimed: true`.
- Die API-Spezifikation ist nachgeführt.
- Ohne die Änderung schlagen die neuen Tests fehl:
  - `config.pg`, weil das Feld fehlt;
  - `statement-actions`, weil `holderComplete` dann ein nicht leeres `creditorMissing` trägt und die Seite `true` meldet.
- `FRESH_APP` wird in `accessibility.ts` weiter verwendet, der Import bleibt nötig.
- Laut ponytail-review fehlt nichts.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - lint, check, backend type-check;
  - vitest 4347, Backend-Tests 412;
  - fitness, fallow, Prettier;
  - E2E 148: `einrichtung`, `sicherung`, `ki-einstellungen`, die Zeilen `backup-*`, `ki-*` und `creditor-missing` sowie die Szenarien von #690.
- Für den Rand «vollständiger Kontoinhaber, Firmenadresse fehlt» gibt es kein Szenario, nur pg- und Unit-Test. Die Speicherung verweigert eine IBAN ohne Firmenadresse (`config.service.ts:206-219`), daher ist dieser Zustand über die Oberfläche kaum herzustellen. Geprüft habe ich das nur beim Lesen, nicht im E2E-Stack.
