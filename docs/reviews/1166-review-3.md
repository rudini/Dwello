# Code-Review 1166, Runde 3 (Schlussrunde, Delta 492b68f..12f3566)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-3 (aus `docs/reviews/1166-review-1.md`).

Geprüft: `src/lib/ui/Field.svelte:80-91`: `flagged !== errorId && flagged` lässt die zweite Referenz weg, wenn `invalidBy` die eigene Fehler-id nennt. `aria-invalid` bleibt über `invalid` (`!!flagged`) gesetzt. Fremde `invalidBy`-ids bleiben unverändert erhalten. Nach einer Eingabe (`edited`) und nach dem erneuten Absenden (`check`) verhält sich das Feld wie zuvor. Der neue DOM-Test in `src/__tests__/ui-fields.dom.test.ts:110-123` schlägt ohne die Änderung fehl («accountHolderName-error accountHolderName-error»), denn auf dem Basis-Commit kamen `shown && errorId` und `flagged` beide in die Liste. Der Testtitel sagt, was der Test prüft. Der Diff enthält nichts, das nicht zur Anforderung gehört, und keine neuen Texte. Nach ponytail-review ist kein Code ungenutzt.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (1685 Tests): vom Aufrufer gemeldet. Ich habe sie nicht selbst ausgeführt, weil der Worktree kein `node_modules` hat.
- Ein E2E-Szenario fehlt. Die Änderung betrifft nur die Screenreader-Beschreibung (`aria-describedby`), und die zeigt die DOM-Ebene als unterste Schicht. Nicht geprüft habe ich, ob der Pull-Request-Text dafür `No scenario: <reason>` nennt oder ob die Szenarien des Pull Requests das schon abdecken. Den PR-Text habe ich nicht gelesen.
