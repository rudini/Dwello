# Review spec643, Runde 4 (Delta 6057462..2ec7821)

## Status offener IDs aus spec643-review-3

| ID | Schwere | Status |
| --- | --- | --- |
| C-4 | Minor | Behoben in 2ec7821. Tag-Zeilen nach der letzten Inhaltszeile (`lead.slice(lead.findLastIndex(content) + 1)`) werden wieder `spec[after + 1]` zugeordnet. Inhalt, der nicht nur aus Beispielen besteht, bleibt beim Szenario darüber. Ohne Inhalt ist `findLastIndex` gleich -1 und `tail` gleich `lead`, das Verhalten ist dort also unverändert. Der neue Test (Beispiele-Block, Leerzeile, `@api` vor «Danach») schlägt ohne den Fix fehl, weil `examplesOnly` dann `undefined` liefert und nichts gemeldet wird. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Diese Checks sind vom Aufrufer gemeldet: `open-work.test.ts`, `readme.test.ts`, `workflows.test.ts`, `commit-msg-gate.test.ts`, `bun run lint`, `bun run check`, Prettier, Commit-Hooks und Backend-`type-check` (dieser ist seit 733d2ae unverändert).
- Den Rotlauf des neuen Falls vor dem Fix habe ich nur durch Lesen des Codes geprüft, nicht durch einen eigenen Lauf.
- Selbst ausgeführt habe ich `bunx vitest run tools/open-work/check-issues.test.ts` auf 2ec7821: 12 Tests bestanden.

Geprüft: Doc-Kommentar von `insertedInto` stimmt mit dem neuen Verhalten überein; erste Assertion des Tests (`@wip` vor neuem Beispiele-Block, exit 0) hält weiter; ponytail: nichts zu kürzen.
