# Code-Review #733, Runde 2 (Abschluss, 3ba46e2..7d6d4fb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1

Keine Blocker oder Major.

Geprüft: `data-focus-row` auf dem Suchformular wirkt über `closest('li, tr, [data-focus-row]')` in `place()` (`src/lib/ui/ToastRegion.svelte:80-82`). Ohne das Attribut liegt kein `li`/`tr` über dem Gebäude-Feld, also gilt nur `below(focus)`. Bei 960 px steht das Feld links neben der Spalte der Meldung, und die Meldung bleibt unten über «Suchen». Das neue Szenario zeigt deshalb ohne den Fix rot. `roomBesideConfirmation` gibt `null` zurück, solange keine Meldung da ist, und kann darum nicht grundlos grün werden. Die zusätzliche Abrechnung 2023 lässt nach dem Löschen einen Entwurf in der Liste, sodass das Layout dem von P-1 entspricht. Der geänderte Titel und Schritt des ersten Szenariogrundrisses stehen nicht auf `origin/main`, die Änderung ist also frei. Die Schichten sind eingehalten: Target, Question, Step. Die testid ist kebab-case. Es gibt keine neuen Texte, Bildschirme oder Verträge. Die Berichte liegen am üblichen Ort.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run src/__tests__/form-selects.dom.test.ts src/__tests__/design-guard.test.ts` (497 passed), Prettier ohne Diff, `tests/e2e/features/statements.feature` in Chromium (25 passed), Commit-Hooks: vom Aufrufer gemeldet.
- Der rote Lauf des neuen Szenarios bei 960x600 vor `data-focus-row` (Abstand -56 px) und der grüne Lauf der weggelassenen Zeilen 1029x643 und 390x844 auf der Basis: vom Aufrufer gemeldet. Ich habe sie nicht selbst ausgeführt, sondern nur die Logik in `ToastRegion.svelte` und `tests/e2e/questions/app-frame.ts:50-62` gelesen.
- Dass bei 390 px nach dem Fix die Meldung nicht anders springt als vorher (Helga P-2): nicht geprüft. Bei 390 px gibt es kein Szenario, und `coveredAtTop` begrenzt den Wechsel nach oben.
