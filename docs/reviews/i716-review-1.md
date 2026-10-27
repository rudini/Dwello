# Review #716, Runde 1 (b4bed6d5..239d8b5b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `src/__tests__/backend-codes.test.ts` (einzige geänderte Datei) findet mit `\bnew \w+\(\s*'…'` die Codes beider Unterklassen von `CodedError` (`ReminderError` in `backend/src/services/reminder.service.ts:34`, `Conflict` in `backend/src/services/conflict.ts:4`); der Mustertest mit `new ReminderError('E_F', …)` scheitert mit der alten Regex (liefert nur `['A_B','C_D','D_1']`), ist also rot ohne die Änderung. Falsch-Positive: im heutigen `backend/src` (ohne `__tests__`) treffen ausser `new CodedError` genau die 13 Stellen `new Conflict`/`new ReminderError` zu, alle echte Codes; die übrigen `new X(`-Aufrufe (`BilledDaysError`, `Error` mit Template-String, `MailConfigError`) treffen nicht. Künftig würde ein `new Error('ABC')` oder ein anderer Konstruktor mit einem einzelnen Wort in Grossbuchstaben als erstem String-Argument eine unnötige Meldung `backend_abc` verlangen; der Test schlägt dann laut fehl, sodass kein Fehler unbemerkt bleibt. Da es heute keinen solchen Treffer gibt, ist das kein Befund. Kein Szenario nötig (reine Teständerung, «No scenario: test only»).

## Nicht bestätigt

- `bun run lint`, `bun run check` und den Prettier-Diff der Datei habe ich nicht erneut ausgeführt; sie sind «vom Aufrufer gemeldet». `bunx vitest run src/__tests__/backend-codes.test.ts` habe ich auf 239d8b5b erneut ausgeführt: 2 bestanden.
