# Review Merge 711eb8e (origin/main 76424e0 in claude/statement-list-248-253 b87694f)

Worktree: `review-list-code5`, detached auf 711eb8e. Gelesen: `git show 711eb8e --cc`, `git diff 76424e0 711eb8e` (ganz, Stat und App-Pfade), `git diff b87694f 711eb8e -- src/routes/statements/+page.server.ts`, `src/routes/statements/+page.server.ts`, `src/lib/server/statement.ts`, `src/routes/statements/StatementRow.svelte`, `src/lib/statement.ts` (`nextReminderLater`), `src/routes/dashboard/+page.server.ts`, `tests/contracts/statement(s).json`, `backend/src/__tests__/api-contracts.pg.test.ts` (`drift`), `backend/src/services/statement.service.ts` (`listStatements`), `src/__tests__/statement-list-load.test.ts`, `tests/e2e/features/statement-reminder.feature` und `tests/e2e/steps/documents.steps.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | tests/contracts/statements.json:23 | `"nextReminderFrom": null` reicht für `drift`, das nur prüft, ob der Schlüssel da ist (bei `null` wird der Typ nicht geprüft). Kein Unit-Test zeigt, dass die Liste `nextReminderFrom` an `StatementRow` weitergibt: Das deckt nur das E2E-Szenario «Nächste Mahnung erst nach der Zahlungsfrist der letzten» ab (letzter Schritt, Liste). Auf main war das ebenso (das Inline-Mapping hatte auch keinen Unit-Test). Der Merge macht also nichts schlechter. |

Keine Blocker oder Majors.

## Geprüft und bestätigt

- **Konfliktlösung `+page.server.ts`:** Der Stand im Merge ist derselbe wie auf dem Branch (`git diff b87694f 711eb8e` für diese Datei ist leer). Das Inline-Mapping von main mit `nextReminderFrom: s.nextReminderFrom` ist durch `.map(toStatement)` ersetzt. `toStatement` (`src/lib/server/statement.ts:67`) übernimmt `nextReminderFrom: data.nextReminderFrom`, dazu alle anderen Felder, die das Inline-Mapping gesetzt hat (id … lineItems, `lastReminderDate`). Inhaltlich unterschiedlich sind nur zwei Dinge: `lineItems` laufen jetzt durch `toLineItem` (Zahlen statt Strings), und es kommen zusätzliche Felder dazu (`rentalStart/End`, `notes` usw.). Beides gehört zum Branch (#248), nicht zum Merge.
- **W6-Verhalten in der Liste:** In `StatementRow.svelte` sind beide Seiten enthalten. Von main kommen Import und Anzeige von `nextReminderLater` und `statements_next_reminder_on` (bei `overdue`). Vom Branch kommen die Mietstage und der Link `statement-pdf-missing`. `+page.svelte` ändert der Merge gegenüber main nicht.
- **Backend:** `listStatements` wählt `statementColumns` aus, die `nextReminderFrom` enthalten (`statement.service.ts:51,135`). Die Liste liefert das Feld also, und der Vertrag ist richtig. `drift` meldet einen fehlenden Schlüssel auch bei `null` (`api-contracts.pg.test.ts:33-36`). Ohne den Schlüssel im Vertrag würde der Vertragstest die Liste deshalb nicht absichern. Mit ihm schlägt der Test fehl, sobald das Backend das Feld nicht mehr liefert.
- **Dashboard:** `src/routes/dashboard/+page.server.ts` und `src/lib/overview.ts` sind gegenüber main unverändert (nicht im `git diff 76424e0 711eb8e`). `nextReminderFrom` in `dueStatements` ist erhalten.
- **Detailseite:** `tests/contracts/statement.json` enthält `nextReminderFrom` von main und `rentalStart/End` vom Branch.
- **Messages:** Die automatisch gemergten `messages/*.json` enthalten in allen vier Sprachen sowohl `statements_next_reminder_on` (main) als auch `statements_pdf_missing(_of)` (Branch).
- **Nichts Fremdes:** `git diff 76424e0 711eb8e` enthält nur Dateien des Branches (#248/#253). Der Merge bringt keine zusätzlichen Änderungen.

## Nicht bestätigt

- lint, check, vitest (2654 grün), Backend-Type-Check und `api-contracts.pg.test.ts` (28 grün) auf 711eb8e: vom Aufrufer gemeldet, nicht selbst nochmals ausgeführt.
- E2E auf dem Merge, vor allem `statement-reminder.feature` (Szenario «Nächste Mahnung erst nach der Zahlungsfrist der letzten», Schritt «nennt die Liste der Abrechnungen …») und `statements.feature`: noch nicht gelaufen. Nur dieses Szenario zeigt, dass `nextReminderFrom` in der Liste ankommt (siehe C-1).
