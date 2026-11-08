# Code-Review 740-2 (Delta `git diff 6336874 654a2eb^1`, ohne docs/reviews und docs/design/personas)

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

## Nicht bestätigt

- Vom Aufrufer gemeldet: auf 654a2eb `bun run lint`, `bun run check` (0 Fehler), `bun run fitness`, `cd backend && bun run type-check`, `bunx vitest run` (4383), Prettier auf den neuen Dateien. Ebenfalls gemeldet: der volle E2E-Lauf auf 6336874 (1973 grün, 3 rot), danach 13 grüne Szenarien nach den Fixes. Das schliesst die Zeile `dashboard mobile-menu-open` ein, `invoice-detail.feature:146`, `statement-generate.feature:933` (vorher rot, bestätigt das Rot von 57d8c28), «Die Schrittanzeige trennt keinen Namen» und «Dialog im kleinen Fenster». Dazu Persona Helga ohne Blocker/Major. Ich habe nichts davon selbst laufen lassen.
- Spezifikationsänderung durch C-1: Der Zustand `mobile-menu-open` prüft das Tablet nicht mehr (`tests/e2e/tasks/accessibility.ts:708`). Damit prüft eine Step-Definition eines Szenarios ohne `@wip` weniger. Inhaltlich deckt die Entscheidung von #740 das («opens the drawer on the mobile viewport only»). Der Pull Request muss aber `Spec change approved: #740` nennen. Es gibt noch keinen Pull Request, deshalb konnte ich das nicht prüfen.
- `fuelStocksHeading` mit `.first()` (`tests/e2e/targets/building-detail.ts:30`): Nach dem Code steht der Titel des Panels (`Panel.svelte:24`) vor allen `Alert`s aus `FuelStocks.svelte` (Zeilen 47–99). `.first()` trifft also den Titel des Panels. Ob ein Alert dort in `building-detail.feature:63` wirklich erscheint, habe ich nicht im Lauf gesehen.
- `RunSummary.svelte:34` (`hyphens-auto break-words`): Für einen Umbruch im Layout gibt es keine tiefere Testschicht als E2E (jsdom rechnet kein Layout). Der Rotlauf ist im bestehenden Szenario `statement-generate.feature:933` gemeldet. Die Klassen werden bereits in `PageHeader`, `Stepper` und `CostReconciliation` verwendet. Die Silbentrennung habe ich visuell nicht geprüft.

Geprüft: Den Aufruf `getByRole('dialog').getByRole('heading')` ohne Namen gibt es in `tests/e2e` nicht mehr. Die übrigen Ziele mit `level: 2` sind unproblematisch: `coming-soon` ist ein EmptyState in einem Panel ohne Titel, `contract-missing-statement` ist der Alert selbst. `data-testid="dialog-title"` folgt der Namensregel. Es gibt keine neuen UI-Texte. Kommentar, `stateMeanings` und D12 nennen jetzt 768 px. Ponytail: nichts Unbenutztes und keine Kopie. Die Merge-Seite von 654a2eb ist nicht Teil des Deltas.
