# Code-Review #1172 (Slice 1), Commit 194fbb34c

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `tests/ui-screenshots/screenshots.spec.ts:53-56`. Die URL-Ersetzung (Zeile 62) hängt `ids['/reports']` samt Query an `/reports/`. Der Dateiname kommt aus der Route und nicht aus der URL, er bleibt also `reports_buildingId`. Den Zeitraum legt `seed.statement('Anna', 'Seeblick', 2025, 'Standard')` an, standardmässig vom 2025-01-01 bis zum 2025-12-31 (`tests/e2e/fixtures/backend.ts:253-254`). Das passt zum Filter in `src/routes/reports/[buildingId]/+page.server.ts:12-17` und zur URL-Form in `tests/e2e/steps/cost-reconciliation.steps.ts:82`. Es handelt sich um reines CI-Tooling ohne App-Verhalten, deshalb braucht es kein Szenario, keine Texte und keine Einträge in `screens.json`. Der Commit-Text hält die Konventionen ein und verweist mit `Refs #1172` auf das Issue, das offen bleibt.

## Nicht bestätigt

- Lokaler Screenshot-Lauf mit UI_BASE_DIR auf origin/main: vor dem Fix nur `reports_buildingId.png` als neue Seite, nach dem Fix keine Datei, 3 passed (vom Aufrufer gemeldet).
- `bun run lint` sauber, Prettier sauber (vom Aufrufer gemeldet).
- Dass `reportPeriods` den Zeitraum der generierten Abrechnung (Status «Entwurf») tatsächlich als Berichtsperiode liefert, habe ich nicht im Backend nachgelesen. Das Szenario in `cost-reconciliation.steps.ts` öffnet die Seite auf die gleiche Weise, und der Aufrufer meldet für den Lauf nach dem Fix «sieht gleich aus», was ein 200 auf beiden Branches voraussetzt.
