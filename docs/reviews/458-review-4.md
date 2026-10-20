# Code-Review Runde 4, PR #515 (#458): CI-Fix bf5368ac..c145ba5f

Worktree: review-458-code4 (detached, c145ba5f). Gelesen: beide geänderten Dateien (tests/e2e/fixtures/backend.ts, tests/e2e/steps/statement-detail.steps.ts), dazu die Szenarien statement-detail.feature:681-810, `replaceStatement`/`correctStatement`/`removeStatement` (backend.ts:316-366), `createCorrection` (tests/e2e/tasks/statement-detail.ts:86), `statementPath` (tests/e2e/questions/statements.ts:14), Status `replaced` im Backend (statement.service.ts:667), Vertrag tests/contracts/statements.json (Feld `status`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Bewertung

- Korrektheit: Im Szenario «Die berichtigte Abrechnung nennt ein anderes Akonto als die ersetzte» (statement-detail.feature:800) setzt der Given-Schritt «ist ersetzt» (`replaceStatement`, backend.ts:357-361) den Status `replaced`, bevor geklickt wird. Darum findet `statementOf(tenant, year, 'replaced')` (backend.ts:51-57) immer die ersetzte Abrechnung, auch während der POST der Berichtigung noch läuft oder schon fertig ist. Die Berichtigung kommt als Entwurf, also nie mit `replaced`. Damit ist die Zeitabhängigkeit weg. Ohne Status bleibt das Verhalten gleich (`!status ||`). Die Liste liefert `status` (Vertrag statements.json, Backend-Mapping).
- `createCorrection` bleibt ein reiner Klick. Das stimmt mit den Refusal-Szenarien überein (statement-detail.feature:743-749, statement-agreed-costs.feature:143-150).
- Rot: Für eine reine Testkorrektur gibt es kein Produktverhalten, das ein neuer Test zeigen müsste. Liest man den Code, wird der alte Lookup rot, sobald die Berichtigung in der Liste vor der ersetzten steht. Das deckt sich mit dem gemeldeten Experiment (rot 3/3 mit Warten auf die Berichtigungsseite, siehe «Nicht bestätigt»). Die Commit-Nachricht nennt das.
- ponytail-review: Der optionale Parameter hat genau einen Aufrufer, wird aber genutzt und gehört zum Fix. Eine kürzere Variante (die Nummer über die geseedete ID `Abrechnung <Mieter> <Jahr>` lesen) wäre nur eine andere Schreibweise und kein Defekt. Kein unbenutzter Code.
- Kommentare (backend.ts:49-50, statement-detail.steps.ts:469) sind zutreffend.
- Nichts Fremdes im Diff, keine UI-Texte, keine Vertragsänderung nötig, kein `@wip`.

## Weitere Aufrufe von `seed.statementNumber(tenant, year)` (Frage des Koordinators)

- tests/e2e/steps/statement-generate.steps.ts:133 (ZIP der erstellten Abrechnungen) und tests/e2e/steps/tenant-export.steps.ts:35 und :46 (Mieterexport): In diesen Szenarien wird keine berichtigte Abrechnung erstellt, also gibt es kein zweites Jahr-Duplikat. Kein Risiko, kein Befund.
- `removeStatement` (backend.ts:319) greift ohne Status auf `statementOf` zurück, aber nur, wenn keine geseedete ID da ist. Es wird nur aus «wurde inzwischen gelöscht» aufgerufen (statements.steps.ts:180), nicht in der Berichtigungsfamilie. Kein Befund.
- Die übrigen Schritte der Berichtigungsfamilie («nennt die Abrechnung, dass sie … ersetzt», statement-detail.steps.ts:451-455, und die Detailseite der berichtigten Abrechnung, :403-407) nehmen geseedete IDs (`statementPath`, `idOf`), nicht den Jahres-Lookup. Kein Risiko.

## Nicht bestätigt

- `bun run lint`: vom Aufrufer gemeldet.
- E2E Chromium `-g 'berichtigte Abrechnung'` `--repeat-each=3` (15 bestanden): vom Aufrufer gemeldet, nicht erneut ausgeführt (E2E ist laut Auftrag ausgeschlossen).
- Experiment rot 3/3 bzw. grün 3/3: vom Aufrufer gemeldet, nicht nachgestellt. Die Sortierung der Liste `GET statements?tenantId=…` habe ich nicht im Service nachgelesen. Das Rot leite ich nur aus dem gemeldeten Experiment ab.
- WebKit-Lauf: nicht prüfbar. Erst der nächste CI-Lauf von «E2E tests (5/5)» zeigt den Fix in WebKit.
