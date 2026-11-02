# Code-Review #1001, Runde 1 (90e0e7b..b887231)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `tenant-export.service.ts:133-134` gibt `payments` als `{ date, amount }` aus (`Payment` aus `schema.ts:435`, ein künftiges `recordedAt` aus #999 bleibt draussen); der neue Test in `tenant-export.pg.test.ts:273-288` schlägt auf 90e0e7b fehl (das Feld fehlt, `undefined` ≠ Liste) und setzt die Zeile im `finally` zurück; eine Abrechnung, die vor #959 bezahlt wurde, behält laut `0041_statement_payments.sql` eine leere Liste, und `paidAmount`/`paidDate` bleiben im Export, es geht also nichts verloren; `tests/contracts/tenant-export.json` enthält nur die Felder, die das Frontend liest (keine `statements`), muss also nicht nachgeführt werden; `docs/api-specification.md:90` beschreibt das neue Feld richtig; keine UI-Texte, kein `messages/*.json`, kein E2E-Code; ein Szenario braucht es nicht (laut Issue deckt das bestehende Export-Szenario die Datei ab); keine Änderung ohne Bezug zur Anforderung; ponytail-review: nichts.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun test src/__tests__/tenant-export.pg.test.ts` (12 pass, neuer Test vorher rot gesehen), `bun run type-check` sauber, Prettier auf beiden geänderten Code-Dateien ohne Diff. Selbst ausgeführt habe ich nichts.
- Dass `getStatement()` (`statement.service.ts:261`) `payments` immer als Array liefert, habe ich nur über den Spaltentyp (`schema.ts:492`, `NOT NULL DEFAULT '[]'`) und den gemeldeten sauberen Type-Check bestätigt.
