# Code-Review #788 Teil 5b (Ä2), Runde 2 (Schlussrunde, nur Delta)

Bereich: `git diff 268691d9 0e07df6f -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` (Commit 0e07df6f). Geändert sind 3 Dateien, alle gelesen.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | erledigt | `statement.service.ts` liest «ersetzt» jetzt an allen vier Stellen über `counting-statements.ts`: `allowed()` (:376), `openReplaced` (:496), `STATEMENT_REPLACED` (:717) und `STATEMENT_NOT_REPLACED` (:936). Im Code steht `'replaced'` nur noch in :863, beim Setzen des Status. `openReplaced` nimmt `replacedInSql` auf der Basistabelle `utilityStatements`, wie der frühere Ausdruck, nicht auf dem Alias `successor`. Die Zeile in `fitness-functions.md` beschreibt diesen Stand richtig. |
| C-2 | erledigt | `tenant-anonymise.pg.test.ts:74–80`: Die späteste Abrechnung ist eine ersetzte (statementDate 2018). Damit wird der Test rot, sobald `replaced` nicht mehr zählt, zum Beispiel bei `status = 'sent'` oder bei einer Liste ohne `replaced`. Das Ergebnis 2029-01-01 ergibt sich aus Ende 2018 plus 10 Jahre. Der Test sichert gehaltenes Verhalten ab, ein Rot-Lauf ist deshalb nicht nötig. |

## Neue Befunde

Keine.

Geprüft: `counting-statements.ts` importiert nur `drizzle-orm` und das Schema, es gibt also keinen Zyklus. Die Umschreibungen sind gleichwertig (`!isReplaced` ⇔ `!== 'replaced'`). Die Änderung enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Backend `bun run test` (1611 bestanden, Coverage 96.5 %), type-check, lint und fitness sind vom Aufrufer gemeldet und nicht neu ausgeführt.
- Den Mutationslauf (`status = 'sent'` macht den neuen Fall rot) meldet der Aufrufer. Ich habe ihn nur durch Lesen nachvollzogen.
