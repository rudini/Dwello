# Code-Review 653, Runde 6 (Re-Review von Runde 5), 3e9c61b gegen db1f458

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde |

Geschlossen: C-1

## Nicht bestätigt

- `bun run lint` ohne Befund; E2E chromium `statement-send.feature` mit 8 bestandenen Tests (das neue Szenario eingeschlossen); E2E statement-detail, invoice-detail, contract-detail und statement-send auf db1f458 mit 217 bestandenen Tests: vom Aufrufer gemeldet.
- Ob das neue Szenario ohne den Fix rot wird, habe ich nur gelesen, nicht ausgeführt. Auf de96fb0 zeigt `aria-describedby` auf den entfernten E-Mail-Absatz, die Beschreibung ist also leer, und der Fokus fällt auf `body`. Beide `sees`-Prüfungen pollen (`actor.ts:47-48`) und schlagen fehl. Den eigenen Rotlauf erspart Workflow 2, weil der DOM-Test von db1f458 rot gesehen wurde.

Geprüft: Das Szenario (`statement-send.feature:86-92`) ist neu und ohne `@wip`, das bestehende Szenario ohne `@wip` (`:76-83`) ist unverändert. Die Schritte rufen nur Tasks und Questions auf. `HoldsFocus` (`screenplay/questions.ts:121-126`) fragt nach einem echten Zustand und darf deshalb ja/nein antworten. Die erwartete Beschreibung steht nur in der Brief-Variante (`SendDialog.svelte:110`, die E-Mail-Variante zeigt `:106`), die Prüfung unterscheidet also wirklich zwischen den beiden. Der Schritt «die Abrechnung per E-Mail senden will» wird wiederverwendet (`statement-send.steps.ts:30`). Auf den einzelnen Klick in `chooseLetterInstead` folgen nur pollende Questions. Die Feature-Texte sind fachlich formuliert. Nichts im Delta gehört nicht zur Anforderung.
