# Code-Review #1200, Abschlussslice Runde 2 (Delta 001604f..2c1cb84)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-3

Geprüft: Szenario «Nach einem Baustein in der Formel weiterschreiben» (`tests/e2e/features/distribution-keys.feature:159-164`) ohne `@wip`, fachlich formuliert, ohne UI-Wörter. Die Startformel `{area}` kommt aus `DistributionKeyForm.svelte:29`, nach `insertBlock` stehen Fokus und Cursor am Ende (Zeilen 33-38). Ohne den Fix bleibt der Fokus auf dem Knopf: das Leerzeichen in « * 2» drückt ihn noch einmal (`{area}{rooms}{rooms}`), «*2» kommt nie im Feld an, und `steht in der Formel` (`formulaValue` per `toBe`, steps:200) schlägt fehl. Das Szenario wäre also rot. Laut Commit-Nachricht wurde der DOM-Test von 9879c22 rot gesehen, damit braucht es nach Workflow 2 keinen eigenen roten Lauf. Die Ebenen stimmen: Steps rufen nur die Tasks `insertBlock`/`typeOn` auf, `TypeOn` liegt als einzige Playwright-Stelle in `screenplay/interactions.ts`, und der Task `typeOn` ist nötig, weil Steps keine Interaktionen importieren dürfen. Nichts im Delta hat mit der Anforderung nichts zu tun, es kommen keine neuen Texte und kein neuer Bildschirm dazu.

## Nicht bestätigt

- `bun run lint` bestanden, E2E chromium `distribution-keys.feature` 24 bestanden: vom Aufrufer gemeldet (ich habe nichts ausgeführt).
- Dass der DOM-Test aus 9879c22 rot gesehen wurde: Das steht nur in der Commit-Nachricht von 2c1cb84 und im Prompt.
