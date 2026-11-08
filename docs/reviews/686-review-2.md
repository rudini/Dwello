# Code-Review 686-2 (Slice #686, Runde 2), Bereich 8671329..4152a94

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1, C-2, C-3, C-4

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe keinen davon ausgeführt: vitest (957), Render-Tests (176), PDF- und Zahlungsfrist-Szenarien von statement-detail (54), lint, check, backend type-check, fitness, fallow, Prettier.
- Die Rot-Läufe habe ich nur durch Lesen beurteilt. C-2-Test: Auf 8671329 setzt der Callback `generating = false`, bevor `await update()` läuft. Während `reloaded` offen ist, wäre der Button also nicht beschäftigt, und `busy` ergäbe `[null, 'PDF erstellen']`. Der Test ist dann rot. C-4: Mit dem Wert `'abc'` liefert `Number` den Wert `NaN`. Ohne `> 0` gäbe die Ladefunktion `NaN` zurück und nicht `undefined`, der Test würde also rot. Die Fälle 500 und «nicht erreichbar» sowie der DOM-Test ohne `paymentDeadlineDays` halten Verhalten fest, das es auf 8671329 schon gibt. Der Commit-Text sagt das.

Geprüft: `toSettings` wird für `payment_deadline_days` verwendet (leerer Wert ergibt 0, daher `undefined`). In `PdfAction.svelte` bleiben Erfolgs- und Fehlerpfad gleich wie bisher (Toast, kein `update` bei einer Ablehnung). `busy` sperrt den Klick über `Button.svelte:71`. Der Kommentar nennt den Fachreview. Es gibt keine Änderungen ausserhalb der vier Minors.
