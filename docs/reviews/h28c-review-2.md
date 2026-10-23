# Code-Review H-28 (Heizkosten-Hinweise des Laufs), Runde 2

Bereich: `git diff 030103e39 302e6bc05` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree review-h28c-2 bei 302e6bc05. Vorheriger Bericht: docs/reviews/h28c-review-1.md.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| E-1 | Major | behoben | backend/src/services/statement-run.service.ts:260: Abgerechnet werden wieder die Mietverträge mit Mietstagen in der Periode, die keine überlappende Abrechnung haben, egal welchen Status diese hat. Das entspricht `runContracts` im früheren BFF (`0669cb270^:src/lib/server/statement-generation.ts:277-282`; dort ist `overlapping` ungefiltert nach Status). Der neue Test steht in backend/src/__tests__/statement-run.test.ts:456-461. Durch Lesen bestätigt: Mit der Zählung aus `planRun` (`replacedHere`, statement-run.service.ts:51) wäre `einzug` nicht abgerechnet, der Hinweis erschiene, und der Test schlüge fehl. Damit stimmt «No scenario: behaviour unchanged» wieder. Die fachliche Frage ist als #647 offen. |
| E-2 | Minor | behoben | statement-run.service.ts:265: Die Bedingung `c.id !== sent.contractId` ist entfernt. Sie bleibt auch mit der neuen Zählung überflüssig: Der Mietvertrag einer versendeten Abrechnung dieser Periode hat eine überlappende Abrechnung und steht daher nie in `billed`. Der Kommentar in :262 stimmt. |
| E-3 | Minor | behoben (soweit möglich) | Die Nachricht von Commit 302e6bc05 nennt die beiden BFF-Tests als festgehaltenes Verhalten. Die Historie von 0669cb270 bleibt unverändert. |

## Neue Befunde

Keine.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet: invoice-completeness.pg.test.ts, api-contracts.pg.test.ts, Backend type-check, fallow audit, `bunx vitest run open-work.test.ts statement-generation.test.ts`. Selbst wiederholt habe ich nur `bun test src/__tests__/statement-run.test.ts` (43 bestanden).
- Den Rot-Lauf des neuen Tests mit der Zählung von `planRun` habe ich nicht ausgeführt, nur durch Lesen bestätigt (siehe E-1).

Geprüft: Gleichwertigkeit von `billed`/`rebilled` zum früheren BFF (`runContracts`, `rebills`). Den Merge 030103e39 habe ich nicht geprüft; er liegt ausserhalb des Bereichs.
