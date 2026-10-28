# Code-Review 506-3 (Schlussrunde vor dem Push, Runde 1)

Bereich: `git diff 2613d70 c8c2bc3 -- . ':!docs/reviews' ':!implementation_plan.md'` (c8c2bc3, C-7 aus 506-review-2).

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | Keine neuen Befunde |

Geschlossen: C-7. C-6: die Zurückweisung hält. `draftsToSend()` (`backend/src/services/statement-invoices.service.ts:156-161`) zählt jeden Entwurf aus `listStatements({ status: 'draft' })`, also auch die Entwürfe paralleler Szenarien in `dwello_e2e`. Die Übersicht zeigt nur diese Zahl oder lässt die Aufgabe weg (`src/lib/overview.ts:248-258`). Ein Szenario könnte also nur prüfen, dass die Aufgabe fehlt oder eine bestimmte Zahl nennt, und beides hängt von fremden Daten ab (`tests/e2e/CLAUDE.md`, «Isolation»). Der pg-Test `statement-carry-over.pg.test.ts:443` erwartet `before - 2`. Ohne `s.carryChanged ||` wäre das Ergebnis `before - 1`, der Test zeigt das Verhalten also. Die Begründung für «No scenario» steht im Plan (`implementation_plan.md:54`).

Geprüft: `carriedNow` gibt die alte Bedingung von `carriedOver` und von `carryChanged` Bedingung für Bedingung wieder (Mietvertrag, `carriable`, `carry_settled_on is null`, nicht offen, `period_end < start`, kein Verrechnen in einer anderen Periode, neueste zuerst, `limit 1`). Der Alias `prev` verhindert, dass die äussere Tabelle `utility_statements` im Teil-Select verwechselt wird. Die Casts `::uuid`/`::date` passen zu den Spaltentypen (`schema.ts:461-466`). `undefined` gibt es weiterhin nur, wenn kein Übertrag da ist. Die übrigen Imports (`lt`, `desc`, `isNull`, `openCarry`) werden noch verwendet. Die Commit-Nachricht nennt das beibehaltene Verhalten, ein roter Lauf ist also nicht nötig.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `cd backend && bun run test` (1681 pass, 96.6 %)
  - `bun run fitness:p2 -- --queries` innerhalb der Ratchets
  - `bun run lint` und Backend-type-check sauber
  - E2E chromium + api statement-minimum-balance, statement-detail, dashboard (182 passed, auf 2613d70)
  - Commit-Hooks bestanden
- Dass die Abfrage auf PostgreSQL dieselben Zeilen liefert wie vorher, habe ich nur durch Lesen geprüft. Die pg-Tests in `backend/src/__tests__/statement-carry-over.pg.test.ts` laufen über `carriedOver` und `carryChanged`, ich habe sie aber nicht ausgeführt.
