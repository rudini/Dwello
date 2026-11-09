# Code-Review 1309, Runde 9: Merge 1c8873f6 (origin/main mit #1328) und eed2cf5f

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: jede Konfliktauflösung aus `git show --remerge-diff 1c8873f6` gegen beide Absichten.
- `backend/src/services/statement-invoices.service.ts`: `Loaders` mit `keys` und `valuesChangedAt`, keine Kollision der Memo-Schlüssel (`apartments` und `apartments <id>`, `keys` und `keys <Periode>`).
- `changesOf`: `correctable` schliesst fehlschlagende Verteilschlüssel ein. `full` und damit `check` fehlen, solange ein Verteilschlüssel fehlschlägt, also kein Saldo. `correctionOf` gibt dann `due = correctable` zurück, nicht ablehnbar, `result` undefiniert (`declineCorrection` wirft `STATEMENT_CORRECTION_NOT_RECALCULABLE`). Das entspricht dem früheren `correction` dieses Branches.
- `touched`/`valuesChanged` nur ohne geänderte Rechnungen, Tankbestand oder fehlschlagende Verteilschlüssel (#1328 unverändert).
- `notUpToDate`: zuerst der Verteilschlüssel, `valuesChanged` eines Entwurfs zählt als `changed`. `draftOutdated` und der Eintrag von `outdatedStatements` tragen beide Felder.
- Übrige Dateien: `LaterChanges.svelte` (Titel- und Textreihenfolge, `changedText` und `shown` mit `values`), `src/lib/server/statement.ts`, beide Contracts, `statement-actions.test.ts`, die vier `messages/*.json` (Wortlaut von #1328 plus `reports_note_key_*`), die Zeile in `UBIQUITOUS_LANGUAGE.md` (alle Sätze beider Seiten, Code-Spalte mit beiden).
- E2E: Step von main `der Verteilschlüssel {string} hat danach die Formel {string}` (`seed.keyFormula`, gleicher Körper wie das entfernte `distributionKeyFormula`). Die geänderten Zeilen in `statement-detail.feature` gehören zu Szenarien dieses Branches (nicht auf `main`), also keine Spec-Änderung.
- eed2cf5f: Testtext folgt `dashboard_task_outdated_drafts_text` von #1328. Ratchet 67 -> 63 passt zur Doku in `fitness-functions.md`.

## Nicht bestätigt

- Alle Prüfungen des Aufrufers nur «vom Aufrufer gemeldet», keine davon selbst ausgeführt:
  - lint, check, `fitness --base origin/main`, Backend-type-check (je auf eed2cf5f);
  - volle vitest-Suite (4765);
  - Backend `bun run test` mit Coverage (2256) auf 1c8873f6;
  - `p2-benchmark --queries` (outdated 21, dashboard 63);
  - E2E chromium statement-detail, statement-generate, distribution-keys, dashboard, reports und die accessibility-/sprachen-Zeilen ihrer Bildschirme (397).
- `docs/api-specification.md` nennt `valuesChanged` (`/:id/changed-invoices`) und `values` (`/outdated`) nicht. Das kommt so von `main` (#1328) und nicht aus dieser Zusammenführung, daher kein Befund.
