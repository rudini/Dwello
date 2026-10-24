# Code-Review 790a, Runde 2 (Delta 0ff6d16)

Keine neuen Befunde.

| ID | Schwere | Status |
|----|---------|--------|
| C-1 | Blocker | behoben. Das Plugin ändert beim Import acht vorhandene Formate (`date`, `time`, `duration`, `url`, `email`, `ipv4`, `ipv6`, `uuid`) und fügt 27 neue hinzu (`datetime`, `ip`, `iso_date` …). `restoreElysiaFormats()` setzt alle 25 Formate von Elysia zurück. Nach `import('./src/app.ts')` ist jeder Eintrag identisch mit dem Stand vor dem Import, auch nach dem ersten Request. Die 27 neuen Formate bleiben zwar registriert, aber im Backend nutzt kein Schema eines davon (nur `format: 'date'` 24× und `'uuid'` 19×). |
| C-2 | Minor | behoben. `2025-02-30` kommt wieder bis zu `isRealDate` und ergibt 400. Das prüfen `invoice-completeness.pg.test.ts:72` und der neue Test in `api-docs.pg.test.ts`. |
| C-3 | Minor | abgewiesen, die Begründung des Aufrufers ist nachvollziehbar (Bun schreibt `package.json` bei jedem `bun add` neu). Bleibt in diesem Bericht und wird nicht weiterverfolgt. |

Zur Zuverlässigkeit: Nur `app.ts` importiert `@elysiajs/openapi`, und ESM wertet `./elysia-formats` vor dem Plugin aus. Der Schnappschuss entsteht deshalb vor dem Ersetzen der Formate, und `restoreElysiaFormats()` läuft vor `new Elysia()`. Wann Elysia die Validatoren übersetzt, spielt keine Rolle. Der übersetzte TypeBox-Check schlägt das Format bei jedem Aufruf in `FormatRegistry` nach, und zu diesem Zeitpunkt ist die Registry schon wiederhergestellt. Würde jemand die Import-Reihenfolge umstellen, fiele der neue Test in `api-docs.pg.test.ts` rot.

Der neue Test ist ohne die Korrektur rot: Mit dem strengen `uuid`-Format liefert die Musterhaus-ID 422 (Nachweis in Runde 1).

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run type-check`, `bun run test` (1565 bestanden, 96,4 %). Selbst wiederholt habe ich nur `bun test src/__tests__/api-docs.pg.test.ts src/__tests__/invoice-completeness.pg.test.ts`: 21 bestanden, 0 fehlgeschlagen.
- Die offenen Punkte unter «Nicht bestätigt» aus Runde 1 (Dependabot-Alerts, postcss-selector-parser-Override, cookie, zod, fallow) berührt das Delta nicht. Ich habe sie nicht erneut geprüft.

Geprüft: Registry-Vergleich mit und ohne Plugin sowie vor und nach dem Import von `app.ts`. `/swagger/json` liefert weiterhin 89 Pfade, die Parameter behalten `format: uuid` bzw. `date`. Die Musterhaus-ID ohne Token ergibt 401 statt 422.
