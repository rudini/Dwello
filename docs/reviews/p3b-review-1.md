# Code-Review #788 Teil 3b, Runde 1 (64e0ca7f..318cc3b2)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/architecture/fitness-functions.md:98 | «die übrigen setzen den Status oder beschriften ihn» stimmt nicht: Von den übrigen sieben Dateien lehnen `reminder.service.ts:166`, `contract.service.ts:473` (Nachfolger-Prüfung) und `statement.service.ts:700/919` mit dem Status ab, `tenant-anonymise.service.ts:20` zählt ihn zu den versandten, `statement-run.service.ts:65` ist eine andere Regel (in der Periode ersetzt, wird neu abgerechnet), und `statement.service.ts:359` entscheidet, was eine Abrechnung erlaubt. Die Zeile sollte diese Gründe nennen, so wie es die Commit-Beschreibung tut. |

Keine Blocker, keine Majors.

Geprüft: Die sieben Ersetzungen haben dieselbe Regel und denselben Ausdruck:
- `accounting-period.ts:77/92`, `statement-invoices.service.ts:131` und `statement-run.service.ts:37`: `filter(s => s.status !== 'replaced')` wird zu `counting(...)`; der generische Typ `S` bleibt erhalten.
- `statement-run.service.ts:152`: Der alte Filter verknüpfte reine Prädikate mit `&&`. `counting(statements).filter(Periode)` ergibt dieselbe Menge in derselben Reihenfolge.
- `advance-payment.service.ts:139` und `contract.service.ts:408`: `ne(utilityStatements.status, 'replaced')` wird zu `countingInSql`. Beide Abfragen laufen `from(utilityStatements)` ohne Alias. Damit ist das SQL gleich wie vorher (`"utility_statements"."status" <> $n`).

`countingInSql` als geteiltes Objekt ist sicher: `ne()` baut ein unveränderliches `SQL` mit Spalte und Param, `toQuery` verändert es nicht. Das Objekt kann deshalb mehrfach vorkommen, auch zweimal in derselben Abfrage. Ungeeignet wäre es nur mit einem Alias von `utility_statements` (er würde nicht greifen) oder mit `.inlineParams()`/`.as()`/`.mapWith()` (verändern das Objekt). Nichts davon kommt vor.

Keine weitere handgeschriebene Fassung derselben Regel im Backend gefunden (grep nach `'replaced'`, `<> 'replaced'` und Status-`inArray`). `dashboard.ts:136` und `document.service.ts:22-23` beschriften bzw. schliessen ausdrücklich ein. `invoice-completeness.service.ts:320` (`sent`, `paid`) und `contract.service.ts:472` (`sent`, `paid`, `settled`) sind andere Regeln.

Zählung bestätigt: 8 Backend-Dateien mit dem Literal `'replaced'`.

Ponytail: Das neue Modul hat 12 Zeilen und keinen ungenutzten Export. Beide entfernten `ne`-Importe waren danach unbenutzt. Einen bestehenden Helfer, den das Modul kopiert, gibt es nicht. Eine Änderung ausserhalb der Anforderung gibt es nicht.

Tests: Der Diff ändert kein Verhalten, deshalb braucht es weder neue Tests noch ein Szenario. UI, Texte, a11y und Verträge sind nicht berührt.

## Nicht bestätigt

- Voller Backend-`bun test` (1592 vor und nach dem Commit), Backend-Type-Check, Lint, `bun run fitness` (Modulzyklen 2), Deepcheck-Audit und Commit-Hooks: vom Aufrufer gemeldet, nicht erneut ausgeführt (Backend-Tests brauchen PostgreSQL und schreiben Testdatenbanken).
- Ob die bestehenden Tests jede der sieben Stellen mit einer ersetzten Abrechnung abdecken (so dass ein Rückschritt auffiele), habe ich nicht Stelle für Stelle geprüft. Die Ausdrücke sind beim Lesen gleich.
