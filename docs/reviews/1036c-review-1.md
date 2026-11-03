# Code-Review 1036c-1 (Abschlussrunde vor dem ersten Push)

Geprüft: `git diff 569af89 92ea5b1 -- . ':!docs'` (Minor-Fixes C-2, C-6, C-7 aus 1036-review-1) und `git diff HEAD^ HEAD` (f6a81c8, Aufteilung nach Fitness-Regeln), im Worktree review-1036c-code.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/server/settings.ts:60-64, 92-110 | Offen aus Runde 1: `periodChange(fetch)` nach erfolgreichem PUT ohne `catch`; kein Test. |
| C-3 | Minor | src/routes/contracts/[id]/+page.server.ts:96-102 | Offen aus Runde 1: `runningConsent` ohne Test auf unterster Ebene. |
| C-4 | Minor | backend/src/services/period-change.service.ts:28 | Offen aus Runde 1 (jetzt in diesem Modul statt in statement-run.service.ts:131): `started: true` von keinem Backend-Test geprüft. |
| C-5 | Minor | backend/src/services/accounting-period.ts:177-179 | Offen aus Runde 1: zwei Bedingungen der Ersatzregel in `consentPeriod` ungetestet. |

Geschlossen: C-2, C-6, C-7.

Keine neuen Befunde im Delta.

Geprüft: `periodChange` wörtlich unverändert nach backend/src/services/period-change.service.ts verschoben, einzige Verwendung (backend/src/routes/config.ts) umgestellt, Tests rufen nur den HTTP-Endpunkt auf; in statement-run.service.ts bleiben `consentPeriod`, `same`, `periodSetting`, `listContracts`, `listStatements`, `swissToday` weiter benutzt, `shortPeriodOfChange` und `daysAfter` sind korrekt entfernt, keine unbenutzten Importe; kein Importzyklus (accounting-period, config.service, contract.service, statement.service, today importieren period-change.service nicht); `PeriodChangeHint` in src/lib/types.ts deckt sich Feld für Feld mit dem Rückgabewert des Mappers (`start`, `short {start,end}`, `started`, `contracts {id, tenant, apartment, letter}`), alter Typexport entfernt, keine Verweise auf den alten Pfad oder `$lib/server/settings` für den Typ übrig; Verschiebung von PeriodChange.svelte nach src/lib ändert nur den Typimport; C-2 (`finally` um `freshAccountingPeriod()`), C-6 (Kommentar #512 wieder beim zugehörigen Test), C-7 (`gap-2`) richtig behoben; Umbruch der Signatur in settings.ts entspricht Prettier (einzeilig 101 Zeichen); ponytail-review: nur Verschiebungen, nichts Unbenutztes, keine Kopie.

## Nicht bestätigt

- `bun run fitness`, `bun run lint`, `bun run check`, Backend `bun run type-check`, `bunx vitest run --changed origin/main` (4058), Backend-Tests api-contracts/statement-run/accounting-period (156), E2E abrechnungsperiode.feature und settings.feature (25), a11y- und Sprachzeilen `config` / `consent-running` / `period-change` (15): vom Aufrufer gemeldet.
- Prettier auf src/lib/PeriodChange.svelte (neu gegenüber origin/main): nicht ausgeführt (keine `node_modules`); einzige Zeile über 100 Zeichen ist ein Kommentar (Zeile 9), den Prettier nicht umbricht.
- Sauberkeit des Merges 66b413f: nur über den Hinweis des Aufrufers, Merge-Inhalt nicht einzeln gelesen.
