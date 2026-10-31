# Code-Review 524-3: Das versendete PDF bleibt im Verlauf (#524), Abschlussrunde vor dem Push

Bereich: `git diff d4bff5c 5ce025a -- . ':!docs/reviews' ':!docs/archive'` im Worktree `/tmp/claude/main-review-524-cr3` (5ce025a, ein Commit: `fix(tests): show no hint for an unknown change`). Vorheriger Bericht: `docs/reviews/524-review-2.md`.

Geschlossen: C-7, C-8.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | `backend/src/services/statement.service.ts:682-686` | Bleibt offen und ist im Delta unverändert. `pdfChangeOf` vergleicht mit dem Wert vor diesem Speichern, nicht mit dem Wert beim Versand. |
| C-3 | Minor | `src/routes/statements/[id]/+page.svelte:210-214` | Bleibt offen und ist im Delta unverändert. Der Hinweis hängt an `?pdf-change=` und bleibt nach «PDF erstellen» und nach dem Neuladen stehen. Persona P-1 ist als #968 erfasst. |
| C-4 | Minor | `src/routes/statements/[id]/edit/+page.server.ts:36-37` | Bleibt offen und ist im Delta unverändert. Die Weiterleitung mit `?pdf-change=` und das Lesen in `load` haben keinen Unit-Test, und kein Frontend-Test liest den Vertrag `statement-updated.json`. |

Keine Blocker, keine Major, keine neuen Befunde.

Zu C-7 (geschlossen): Der neue Fall `changed('toString', null)` in `src/__tests__/statement-pages.dom.test.ts:1809-1811` erwartet, dass `statement-pdf-changed` fehlt (`:1818`). Ohne `Object.hasOwn` in `+page.svelte:152` liefert `pdfChanged['toString']` die Funktion `Object.prototype.toString`. `pdfAdvice()` gibt dann «[object Undefined]» zurück, und der Alert wird gerendert. Der Test wird deshalb beim Lesen rot ohne die Korrektur, wie der Aufrufer meldet.

Zu C-8 (geschlossen): Der Kommentar zu `which` steht wieder über `sendStatement` (`tests/e2e/fixtures/backend.ts:389`). Über `deliverByLetter` steht nur noch der Kommentar, der zu ihr gehört.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: eslint auf beiden Dateien; `bunx vitest run src/__tests__/statement-pages.dom.test.ts` (198 pass); axe- und Sprachzeilen `-g "documents marked-sent"` (2 pass). Damit ist der offene Punkt aus Bericht 2 erledigt, dass niemand die Zeile `documents` `marked-sent` mit dem zusätzlichen Dokument ausgeführt hat. Den Lauf selbst habe ich nicht gesehen.
- Den roten Lauf von C-7 ohne `Object.hasOwn` habe ich nicht gesehen. Ich habe ihn nur beim Lesen nachvollzogen (siehe oben).

Geprüft: beide geänderten Dateien des Deltas und die Commit-Nachricht (Conventional Commits, 47 Zeichen).
