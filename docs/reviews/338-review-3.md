# Review #338 «Neu berechnen» – Runde 3 (Abschlussrunde vor dem Push)

Worktree: `review-338-close` (detached 0ff694e4). Delta: `4f6d52d9..0ff694e4`, drei Commits (03e3216f, 8dca333d, Merge 0ff694e4). Ich habe alle geänderten Dateien des Deltas gelesen: `statement-recalculation.pg.test.ts`, `statement-detail.feature`, `questions/statement-detail.ts`, `steps/statement-detail.steps.ts`, `docs/reviews/338-review-2.md`, `docs/reviews/338-datenpruefung-1.md`, `implementation_plan.md` und die Dateien aus dem Merge (`backend/package.json`, `tests/e2e/fixtures/backend.ts`, `tests/e2e/tasks/accessibility.ts`, `backend/scripts/e2e-purge-statements.ts` (nur über den Diff), Berichte o38). Zusätzlich gelesen: `calculateBalance` (`calculation.service.ts:314`) und `recalculateStatement` (`statement.service.ts:455-480`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde |

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-14 | behoben | `statement-recalculation.pg.test.ts:98-100` erwartet den Saldo genau: `roundTo5Rappen(totalCosts - totalAdvancePayments - priorPayments)`, wie `calculateBalance(totalCosts, advance + prior)` in `kept`. Zur Mutation (Zeile `balance` aus `kept` entfernen): Dann gilt `values.balance`, gerechnet mit `priorPayments = 0`. Er weicht um `priorPayments` ab, und Z. 97 sichert `priorPayments != 0`. Der Test wird damit rot. Das bestätige ich durch Lesen, der Aufrufer meldet den Rot-Lauf. `totalAdvancePayments` steht in der API-Antwort (`tests/contracts/statements.json`) |
| C-15 | behoben | Schritt «bestätigt die Abrechnung {string}» und Question `recalculatedDone` sind entfernt. Das Szenario nutzt den bestehenden Schritt «bestätigt Dwello {string}» (`statement-detail.steps.ts:432`, `replacedDone` = `Text.of(successToast)`). Er prüft den gleichen Toast, so streng wie vorher. Es gibt keine Verweise mehr auf die entfernten Namen (grep über `tests/` und `src/`) |
| C-16, C-17, C-18 | unverändert offen (Minor/Nit) | Das Delta ändert keinen Produktionscode (`git diff 4f6d52d9 0ff694e4 -- messages src backend/src/services backend/src/routes` ist leer) |

## Merge 0ff694e4

- Konflikt nur in `implementation_plan.md`. Die Auflösung behält den Abschnitt «#338» (mit den Zeilen aus Runde 2 und der Datenprüfung) und hängt den Abschnitt «O-38» von `main` unverändert an. Es bleibt eine einzige `## Session` (Z. 5), wie `open-work.test.ts` verlangt.
- `tests/e2e/tasks/accessibility.ts`: Der Unterschied zu `origin/main` (33fe1d98) beschränkt sich auf die beiden #338-Zeilen (Zustand `recalculate-dialog`, Z. 336-337). Die O-38-Änderung (Import `buildingInvoiceCount`, Warten in `previewOf`) ist vollständig übernommen. `tests/e2e/targets/accessibility.ts` behält `recalculateButton`.
- `tests/e2e/fixtures/backend.ts` und `backend/package.json` entsprechen `main`. #338 hatte diese Dateien nicht geändert, also gibt es keine Überschneidung.
- Gegenüber `main` unterscheiden sich ausserhalb der Dokumente nur Dateien von #338 (`git diff 33fe1d98 0ff694e4 --stat`). Der Merge bringt nichts Fremdes in den Diff des Pull Requests.

## Bestätigt

- 8dca333d fügt nur den Bericht der Datenprüfung hinzu (keine Blocker/Major/Minor, D-1 und D-2 als Nit). Eine Prüfung ist dafür nicht nötig.
- 03e3216f: Für C-15 braucht es keinen Rot-Lauf, denn es ersetzt einen Schritt durch einen gleichwertigen. Der Rot-Lauf für C-14 steht in der Commit-Nachricht.
- Ponytail: Das Delta ist minimal. C-15 entfernt Code (−6 Zeilen), und C-14 ändert zwei Zeilen und einen Typ.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/statement-recalculation.pg.test.ts` grün auf 03e3216f und der Rot-Lauf von C-14 (Saldozeile aus `kept` entfernt): vom Aufrufer gemeldet. Ich habe den Test nicht wiederholt, weil Backend-Tests in die Datenbank schreiben.
- lint, `bun run check` und der Backend-Type-Check auf 0ff694e4: vom Aufrufer gemeldet (laufen noch).
- E2E-Lauf des Szenarios «Entwurf neu berechnen» mit dem Schritt «bestätigt Dwello» nach C-15 sowie der Zeilen von `recalculate-dialog` nach dem Merge: Diesen Lauf meldet niemand. Durch Lesen halte ich ihn für unkritisch (gleiche Question, gleicher Toast), er ist aber nicht ausgeführt.
- `backend/scripts/e2e-purge-statements.ts` habe ich nicht im Detail geprüft. Es kommt von `main` (Review o38-1/o38-2) und gehört nicht zu #338.
