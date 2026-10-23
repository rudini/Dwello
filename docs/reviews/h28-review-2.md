# H-28 Code-Review, Runde 2 (Abschlussrunde)

Geprüft im Worktree `review-h28-2-code` (5f12d9623): `git diff 596539d1c 7041cbb5f -- . ':!docs/reviews'`, alle vier geänderten Dateien gelesen. Dazu als Plausibilitätsprüfung den Merge 7041cbb5f..5f12d9623.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt, sobald der Grund im Pull Request steht | Die Commit-Nachricht von 7041cbb5f nennt `No scenario:` mit Grund: Der Fehler liegt nur zwischen BFF-`load` und Backend, `FailRequests` erreicht ihn nicht. Den Fall zeigt der Load-Test in `statement-generate-actions.test.ts`. Im PR-Text muss der Grund noch stehen; das kann ich nicht prüfen, weil der PR noch nicht existiert. |
| C-2 | erledigt | `backend/src/services/statement-run.service.ts:159-160` nutzt jetzt `isRealDate`. Die Kopie `isDay` ist entfernt. `isRealDate` ist strenger beim Monat und Tag (`0[1-9]\|1[0-2]` …), lässt also dieselben Tage durch. Die Fälle `2025-02-30` und `2025-13-01` decken weiterhin `statement-run.pg.test.ts:119-120` ab. |
| C-3 | erledigt | `backend/src/routes/contracts.ts:131`: Der Kommentar `// Get single contract` steht wieder über `.get('/:id', …)`. |
| C-4 | erledigt | `src/__tests__/dashboard.test.ts:11, 73-74`: Die Form eines fehlenden Teils kommt jetzt aus `tests/contracts/contracts-missing-statements.json` (`c1[0]`). |
| C-5 | erledigt | `backend/src/__tests__/statement-run.pg.test.ts:79-82` prüft die 404 für eine unbekannte ID. `missingOfContract` liefert dafür `null` (`statement-run.service.ts:77-78`), die Route setzt 404 (`contracts.ts:126-129`). Ohne das `set.status` wäre die Antwort 200, der Test also rot. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die genannten Vitest-Dateien (160 grün) und die Backend-Tests `statement-run.test.ts`, `accounting-period.test.ts`, `statement-run.pg.test.ts`, `api-contracts.pg.test.ts` (128 grün): vom Aufrufer gemeldet, nicht wiederholt.
- Volle E2E-Suite auf 7041cbb5f (1531 grün, 1 Hydration-Timeout unter Last, einzeln grün): vom Aufrufer gemeldet, nicht wiederholt.
- PR-Text mit dem `No scenario`-Grund (C-1): Den PR gibt es noch nicht.
- Der Rot-Lauf des 404-Tests ist nur beim Lesen bestätigt, nicht ausgeführt.

Geprüft: Merge 5f12d9623. Mit dem Branch überschneidet er sich nur in `tests/e2e/CLAUDE.md`, und zwar in anderen Absätzen ohne Konflikt; der H-28-Satz im Abschnitt Abilities bleibt erhalten. Die App-Änderungen von main (`StatementWizard.svelte`, Scrollen #637, und sein DOM-Test) berühren weder die Load-Daten noch die Mapper dieses Branches.
