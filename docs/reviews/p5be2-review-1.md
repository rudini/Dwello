# Code-Review #788 Teil 5b (Ä2), Runde 1

Bereich: `git diff 96c57e80 268691d9 -- . ':!implementation_plan.md'` (Commit 268691d9), 7 Dateien, alle gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/architecture/fitness-functions.md:103 | Laut der Zeile bleibt in `statement.service` nur «das Setzen und Ablehnen» von `replaced`. Das stimmt nicht ganz: `allowed()` (statement.service.ts:375, `status !== 'replaced'` entscheidet editable/asksPayment/superseded) und `openReplaced()` (:495, `eq(utilityStatements.status, 'replaced')`) lesen die Bedeutung von «ersetzt» weiterhin selbst. Der entschiedene Plan nennt diese Datei nicht, deshalb ist das kein Defekt im Code. Entweder wird die Zeile richtiggestellt («… die Regel in `allowed` und die Suche in `openReplaced`»), oder die zwei Stellen nutzen `isReplaced`/`replacedInSql`. Die Dateizahl ändert sich in beiden Fällen nicht, :716/:862/:935 bleiben. |
| C-2 | Minor | backend/src/services/tenant-anonymise.service.ts:20 | Die geänderte Bedingung (`status <> 'draft'` statt der Liste) ist nur mit `sent` gegenüber `draft` abgesichert (tenant-anonymise.pg.test.ts:62–65). Dass eine bezahlte, erledigte oder ersetzte Abrechnung als späteste zählt, prüft kein Test. Eine falsche Umschreibung wie `status = 'sent'` bliebe grün. Abhilfe: ein Testfall mit einer `replaced`- oder `paid`-Abrechnung als spätestem `statementDate`. Das Verhalten der Basis bleibt erhalten, ein Rot-Lauf ist also nicht nötig. |

Geprüft:
- SQL-Gleichwertigkeit:
  - `not(eq(status,'replaced'))` entspricht `ne(...)`, unter dreiwertiger Logik auch bei NULL.
  - `status` ist ohnehin `notNull()` (schema.ts:490).
  - `status <> 'draft'` entspricht der Liste, weil die CHECK-Bedingung genau draft, sent, paid, settled und replaced zulässt (0028).
  - Der SQL-Kommentar `--` in der Vorlage endet vor der nächsten Zeile.
- Abgesichert sind die verschobenen Stellen durch:
  - dashboard.pg.test.ts:85/144 (ersetzte Abrechnung in `paidThisMonth`, 270)
  - reminders.pg.test.ts:548–556 (`REMINDER_STATEMENT_REPLACED`)
  - statement-run.test.ts:46, 124, 456–476 (`replacedHere`)
  - billed-until.pg.test.ts:256–273 (#499)
- Übrige `'replaced'`-Literale (grep): counting-statements, document.service, statement.service und src/lib/types.ts, also 4 Dateien in 2 Schichten wie gemeldet.
- Ponytail: schlank, nichts zu streichen.
- Konventionen: keine UI-Texte, kein Szenario nötig (Verhalten unverändert), Commit-Betreff gültig.

## Nicht bestätigt

- Backend `bun run test` (1610 bestanden, Coverage 96.5 %), backend type-check, `bun run lint`, `bun run fitness`: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Die Messung von `tools/arch-baseline/run.sh` (4 Dateien, 2 Schichten): vom Aufrufer gemeldet. Nicht ausgeführt, weil das Skript Dateien schreibt. Ich habe sie nur mit grep auf `'replaced'`/`"replaced"` in backend/src, src und shared nachvollzogen. Dass Migrationen (`.sql`) nicht als Produktionsdateien zählen, folgt aus der gemeldeten Schichtzahl. Den Filter `prod` in `tools/arch-baseline/05-knowledge.ts` habe ich nicht nachgelesen.
