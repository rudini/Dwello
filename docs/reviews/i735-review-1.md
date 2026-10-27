# Code-Review #735, Runde 1 (8d852ded..210e718d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Diff (nur `backend/src/__tests__/contract-overlap.pg.test.ts`) gegen #735; der neue Fall läuft über `PUT /api/v1/contracts/:id` → `updateContract` → `checkNewDates` (contract.service.ts:433–440) und erwartet 400 mit `code: 'CONTRACT_OVERLAP'`; `confirmPastEnd: true` ist nötig, weil `checkEnd` (Z. 535) sonst vorher mit CONTRACT_END_PAST ablehnt, und die Route nimmt das Feld an (routes/contracts.ts:85); der neue Vertrag 2021 überschneidet mit Ende 2024-06-30 den laufenden Vertrag ab 2024-04-01 auch dann, wenn der Fall allein läuft (Titel stimmt); der Datensatz wird von `contracts.removeAll()` aufgeräumt; der Commit nennt das Festhalten bestehenden Verhaltens, kein Bugfix, und laut Lesen schlägt der Test ohne die Overlap-Prüfung fehl (Update gelingt dann mit 200); `No scenario: test only` passt zu einer reinen Teständerung; Kopfkommentar stimmt mit dem Inhalt überein; nichts Fremdes im Diff.

## Nicht bestätigt

- `cd backend && bun run type-check`, eslint auf der Testdatei, `bun test src/__tests__/contract-overlap.pg.test.ts` (4 pass), Prettier-Diff leer: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rot-Lauf mit `if (false && hasOverlap)` in contract.service.ts:437: vom Aufrufer gemeldet; nur durch Lesen von `checkNewDates` nachvollzogen.
