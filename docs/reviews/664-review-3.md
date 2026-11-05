# Code-Review 664, Runde 3 (Abschlussrunde CI-Fix), Delta 2f89596..e2a802a

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| –  | –       | –           | Keine Befunde |

Geprüft: `moveOutOf`/`moveOutsByApartment` wörtlich nach `backend/src/services/move-out.service.ts` verschoben (gleicher Code, gleiche Kommentare), keine zyklische Abhängigkeit (statement-run importiert move-out nicht), beide Aufrufer (`routes/apartments.ts:18`, `routes/contracts.ts:8`) umgestellt, keine weiteren Importe der alten Stelle (`statement-run.pg.test.ts:123` ist eine lokale HTTP-Hilfsfunktion); in `statement-run.service.ts` entfallen genau die nicht mehr genutzten Importe `moveOut` und `laterContract`, `swissToday`, `listStatements`, `overlapped`, `listContracts` werden dort weiter genutzt; `typeOf` nur zusätzlich exportiert; `src/lib/types.ts`: `moveOut?: ApiApartment['moveOut']` ist typgleich zu `Partial<Pick<…, 'moveOut'>>`, `MoveOut` per `export type … from` weiter exportiert, geänderte Zeilen innerhalb printWidth 100; `ratchet.json`-Eintrag `display` für `RefusedStatements.svelte:38` verzweigt nur auf den Statuswert (Entwurf mit Mieter und Periode, sonst Nummer), wie `fitness.ts:75`/`:200` es für `display` verlangt; Backend liegt ausserhalb von Prettier (`.prettierignore`); kein Verhalten geändert, daher kein neuer Test und kein Szenario nötig; nichts Fremdes im Delta.

## Nicht bestätigt

- `bun run fitness` exit 0 (vom Aufrufer gemeldet)
- lint und check sauber (vom Aufrufer gemeldet)
- Backend type-check sauber (vom Aufrufer gemeldet)
- Backend `bun test` statement-run.pg, api-contracts.pg, apartment-status.pg 134/134 (vom Aufrufer gemeldet)
- vitest apartment* und contract-detail-page 138/138 (vom Aufrufer gemeldet)
- `fallow audit --base origin/main` ohne Befunde (vom Aufrufer gemeldet)
- Ob der Ratchet-Abgleich die Zeile `>{statement.status === 'draft'` genau so (getrimmt) extrahiert, nur über die gemeldete Fitness-Ausgabe; gelesen: `tools/fitness/fitness.ts:286-290` (Schlüssel Pfad+Zeile).
