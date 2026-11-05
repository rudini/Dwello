# Code-Review #659, Runde 2 (0af7831..4187172)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2

- C-1: `git diff 0a73289 4187172 -- tests/e2e/features/statement-generate.feature` fügt nur noch Zeilen an (ab 873). Das Szenario #1089 endet wieder mit «Und scrollt die Seite nicht seitwärts» (Zeile 872), das neue Szenario #659 behält den Schritt (Zeile 881).
- C-2: `src/__tests__/statement-wizard.dom.test.ts:384-385` verlangt jetzt, dass `heating-profile-chart` nach `heating-meter-warning` steht. `hp1` ist vorgewählt (Zeile 364), also wird das Diagramm gezeichnet. Fehlt es, wirft der Test bei `compareDocumentPosition(null)`. Die Reihenfolge in `SettingsStep.svelte:81-84` (Warnung, dann eigene Beschreibung, dann Diagramm) passt zu dieser Prüfung.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `statement-wizard.dom.test.ts` 103 bestanden, die strengere Prüfung rot, wenn die Warnung hinter dem Diagramm steht, und grün, wenn sie davor steht; E2E chromium `statement-generate.feature -g Telefon` 2 bestanden; auf 0af7831 `bun run check` sauber und `vitest --changed` 607 bestanden.
- `bun run lint` und `bun run check` hat der Aufrufer auf 4187172 nicht gemeldet. Der Delta ändert nur eine Testdatei und das Feature, ich habe sie nur gelesen.
- `docs/design/personas/marco-659.md` ist ein Persona-Bericht und kein Code. Laut Aufrufer bleibt der Wortlaut so, wie ihn das Issue entschieden hat. Diese Entscheidung habe ich nicht im Issue nachgeprüft.
