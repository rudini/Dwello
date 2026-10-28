# Code-Review 512-5 (CI-Fix, Runde 1): 93b686c..95f62b6

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `periodSetting()` (backend/src/services/config.service.ts:258) liest `accounting_period` und `accounting_period_changed` in einer Abfrage (`inArray` ist importiert) und liefert dasselbe wie vorher `getTypedConfig('accounting_period')` (Vorgabe aus `CONFIG_KEYS` ohne Zeile, kein Zahlentyp) und `periodChange()` (null ohne Zeile; ein Wert ohne Tag gibt jetzt null statt `{ on: '' }`, das schreibt `storePeriodChange` nie); `periodChange` hat keinen weiteren Aufrufer mehr, `getTypedConfig` bleibt in statement-run.service.ts:185 benutzt; beide Aufrufer (`missingOfContract`, `missingByContract`) ohne Verhaltensänderung, die Casts sind entfallen; der Wechsel-Pfad ist in statement-run.pg.test.ts:124-167 über `/contracts/:id/missing-statements` abgedeckt, die Abfragezahl über die Ratsche (`/api/v1/dashboard` 68, `/api/v1/contracts/missing-statements` 7); nichts Fremdes im Diff, keine Texte, UI, Verträge oder Szenarien berührt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: Reproduktion des Fehlers mit `bun run fitness:p2 -- --queries` vor dem Fix (69/68, 8/7) und danach 68/68 und 7/7; `bun run fitness`; `cd backend && bun run test` (1667 pass, 96.6 %); statement-run.pg.test.ts, period-types.test.ts, accounting-period.test.ts (49 pass); Backend type-check und `bun run lint`; Commit-Hooks.
- Dass `missingByContract` mit gespeichertem Wechsel das richtige Ergebnis liefert, zeigt kein eigener Test (nur `missingOfContract`); der Diff ändert dort aber nur die Herkunft derselben Werte.
