# Code-Review 506-2: offener Übertrag, Runde 2 (6aa37c4..2613d70)

Geschlossen: C-1, C-2, C-4, C-5. C-3 bleibt abgelehnt. Die Entscheidung in #506 nennt ausdrücklich «a Nebenkostenpauschale only».

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Major | backend/src/services/statement-invoices.service.ts:159-161 | Die Übersicht zeigt jetzt ein anderes Verhalten («zu versenden» zählt einen Entwurf mit geändertem Übertrag nicht mehr), aber kein Szenario in `tests/e2e/features` prüft das. Belegt ist es nur im pg-Test. |
| C-7 | Minor | backend/src/services/carry-over.ts:72-82, backend/src/services/statement.service.ts:407-427 | Die Regel «welchen Übertrag ein Entwurf verrechnet» steht zweimal da: in `carriedOver` als Drizzle-Ausdruck und in `carryChanged` als SQL-Text. Beide sind heute gleich. Ändert man nur eine Stelle, verrechnet «Neu berechnen» einen anderen Übertrag, als die Liste und der Versanddialog melden. Kein Test vergleicht die beiden Stellen. `carriedOver` könnte dasselbe Fragment aus `carry-over.ts` verwenden. |

## C-6 Kein Szenario für die Zahl «zu versenden» (Major)

- **Warum falsch:** Der Liegenschaftsverwalter sieht die Änderung auf der Übersicht: Die Aufgabe «Abrechnungen prüfen und versenden» zählt den Entwurf nicht mehr. Ist er der einzige Entwurf, fällt die Aufgabe ganz weg. Nach CLAUDE.md, Workflow 1 und «Done means», braucht eine solche Verhaltensänderung ein Szenario ohne `@wip`. Der Diff ändert nichts unter `tests/e2e`. Das Szenario `statement-minimum-balance.feature:176` prüft nur den Versanddialog. Dass die E2E-Umgebung diesen Zustand erzeugen kann, zeigen zwei Szenarien: dieses (2025 erstellt, danach 2024 versendet) und `dashboard.feature:122` (die Zahl der Entwurfsaufgabe). Ein Grund «No scenario» passt also nicht.
- **Wie zeigen:** `grep -rn "versenden" tests/e2e/features/statement-minimum-balance.feature tests/e2e/features/dashboard.feature`: Kein Szenario öffnet nach «Die Abrechnung 2024 ist versendet» die Übersicht. Nimmt man `s.carryChanged ||` in `draftsToSend` heraus, bleibt jeder E2E-Lauf grün.
- **Ausweg:** Ein neues Szenario oder eine neue Zeile im Szenario `statement-minimum-balance.feature:176` (es ist auf `main` noch nicht vorhanden, eine Änderung ist also frei). Die Übersicht nennt dort die Entwurfsaufgabe nicht oder nur mit den übrigen Entwürfen. Die vorhandenen Fragen von `dashboard.feature:122` genügen dafür.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - der neue pg-Test «zählt einen Entwurf, der jetzt einen anderen Übertrag verrechnen würde, nicht als zu versenden» vor dem Fix rot
  - die zwei C-2-Tests rot, wenn man je eine Bedingung von (c) herausnimmt
  - `cd backend && bun run test` (1681 pass, 96.6 %)
  - die pg-Tests statement-carry-over und api-contracts (147 pass)
  - `bun run fitness:p2 -- --queries` innerhalb der Ratchets
  - `src/__tests__/statement-actions.test.ts` (32 pass)
  - `bun run lint`, `bun run check`, Backend-Type-Check, Commit-Hooks
- Fachlich offen, nicht als Befund geführt: Ein Entwurf mit geändertem Übertrag zählt nicht mehr als «zu versenden». Er steht aber auch nicht in der Aufgabe «nicht aktuell» (`outdatedStatements`, `statement-invoices.service.ts:168-176`), so dass ihn die Übersicht gar nicht mehr nennt. Das entspricht V-8 (`docs/reviews/506-fachreview-1.md:14`: den Text der Aufgabe lassen). Nur die Fachreview, die Persona-Runde oder der Product Owner können beurteilen, ob das trägt.
- Dass `carryChanged` bei Listen mit vielen Abrechnungen schnell genug ist: Der Teilabfrage-Ausdruck wird für jede Zeile der Liste geschrieben. Ob Postgres ihn für Abrechnungen, die keine Entwürfe sind, überspringt, habe ich nicht gemessen. Gemeldet ist nur der Fitness-Lauf.

Geprüft: alle Dateien im Bereich gelesen. `carryChanged` habe ich Bedingung für Bedingung mit `carriedOver` verglichen (Alias `prev`, `openOf('prev')`, der Bezug auf die äussere Tabelle durch den Alias, Ausschluss des eigenen Zählers gleicher Periode). Weiter: der neue Test wird ohne `s.carryChanged` rot, die C-2-Fälle sind je ohne eine Bedingung rot (der Vertrag hat standardmässig vereinbarte Kategorien und Akonto 0), der Test der Aktion `settleCarry`, die Verträge `statement.json`/`statements.json` und die Doku zu `carry-settled`, `payment-reset`, `openCarryOvers` und `toSend`.
