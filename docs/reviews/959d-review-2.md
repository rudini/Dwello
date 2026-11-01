# Code-Review 959d, Runde 2 (001af92, Delta `git diff ca6c3a3 001af92`)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1

C-1 ist behoben. `listStatements` liefert jetzt `asksPayment: !isReplaced(row.statement)` (`backend/src/services/statement.service.ts:227`). Das ist dieselbe Regel wie `allowed()` (`:370`). `tests/contracts/statements.json` führt das Feld. `drift` in `api-contracts.pg.test.ts:870` prüft es deshalb gegen die echte API. Der neue Test in `src/__tests__/statement-list-load.test.ts:80` lädt die Liste aus diesem Vertrag über `toStatement` (`src/lib/server/statement.ts:143`). Ohne das Feld im Vertrag ergäbe das `false`. Der Test schlägt ohne die Änderung also fehl.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run` für statement-list-load, statement-generation und dashboard (62), Backend `api-contracts.pg.test.ts` (98) und Backend type-check auf 001af92. Auf ca6c3a3 außerdem fitness, lint und check. Ich habe keine Tests ausgeführt.
- Weiterhin offen aus Runde 1 (kein Befund): `paid` mit `waived` und eingegebenem Teilbetrag (`statement.service.ts`, `recordPayment`). Die Listenzeile könnte dann auch auf einer bezahlten Abrechnung erscheinen. Ob die UI diesen Weg zulässt, habe ich nicht geprüft.

Geprüft: `StatementRow` ist die einzige Listenansicht, die `partPaid` nutzt (`src/routes/statements/+page.svelte:203`). Der Eintrag in der API-Spezifikation stimmt.
