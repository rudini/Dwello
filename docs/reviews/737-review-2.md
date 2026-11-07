# Code-Review #737, Runde 2 (Abschlussrunde, ac043d1..40cd1ef)

Geschlossen: C-1, C-2, C-3, C-4

Keine neuen Befunde.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer als grün gemeldet, ich habe keine davon ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, vitest für backend-error, formula-test-result.dom, distribution-keys und a11y-screens, backend `bun test` für distribution-key-admin.pg, formula-codes und api-contracts.pg, E2E chromium `-g "distribution-key-(new|edit) |Verteilschlüssel"` (47 bestanden, die neuen Zeilen für edit eingeschlossen). Alle Angaben sind vom Aufrufer gemeldet.
- `bun run fitness` und Prettier auf den neu hinzugefügten Dateien stehen nicht in der Liste des Aufrufers für 40cd1ef. Der Delta fügt keine Datei hinzu.
- Den Rot-Lauf des DOM-Tests mit dem alten Titel `keys_test_failed` habe ich nicht gesehen. Dem Code nach scheitert der Test daran: Der Regex verlangt am Anfang «Der Test hat einen Fehler gefunden».
- Dass der Zustand `formula-test-failed` auf der Bearbeiten-Seite des geseedeten Schlüssels «Nach Wohnungen» (`tests/e2e/fixtures/screens.ts:311,365`) erscheint, habe ich nur gelesen. Die Aufgabe `tests/e2e/tasks/accessibility.ts:675` füllt nur das Formelfeld aus, also gilt sie für beide Seiten. Ausgeführt hat den Lauf der Aufrufer.

Geprüft: C-1 (Zustand in screens.json:1074 und in beiden Features, Bedeutung steht in `stateMeanings`:117), C-2 (der entfernte Zweig ist unerreichbar, weil `validateFormulaForDistribution` in formula.service.ts:338-340 mit denselben `SAMPLE_APARTMENTS` rechnet, der Kommentar stimmt), C-3 (Titel behauptet nicht mehr, dass der Text vom Backend kommt), C-4 (`testid` ist eine Prop von `Alert`, `titleId` ist aus FormulaTestResult entfernt, der Test liest über `byTestId`, `titleId` hat in `Alert` mit ContractsUnknown weiter einen Nutzer). Im Delta ist nichts, das nicht zur Anforderung gehört.
