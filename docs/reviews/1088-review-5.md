# Code-Review #1088, Runde 5 (Abschlussrunde, Runde 2)

Gegenstand: `git diff e6bbbe6 ce6d11b -- . ':!docs/reviews'` (Worktree review-1088f-code, ce6d11b). Vorheriger Bericht: docs/reviews/1088-review-4.md.

Geschlossen: C-11, C-12, C-14. C-13 ist am Mietvertrag geschlossen, der Teil zur Übersicht ist C-16.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-10 | Minor | tests/e2e/steps/statement-generate.steps.ts:735-739 | Bleibt offen, wie vom Aufrufer gewählt. |
| C-15 | Minor | messages/de.json:2287 (en, fr, it ebenso) | `dashboard_task_missing_outside_text` steht immer im Plural: «Diese Perioden überschneiden sich mit älteren Abrechnungen des Gebäudes … Rechnen Sie sie …». Nach einer Migration fehlt oft nur eine einzige solche Periode. Dann liest der Liegenschaftsverwalter «Ahornhof (2023): Diese Perioden überschneiden sich …». Die Nachbaraufgabe unterscheidet die Zahl bereits (`dashboard_task_missing_period_text` / `_periods_text`, overview.ts:146-148). Bei mehreren Gebäuden ist auch «des Gebäudes» falsch. Der Unit-Test (overview.test.ts:256) prüft genau den Fall mit einer Periode und schreibt damit den falschen Plural fest. |
| C-16 | Minor | docs/api-specification.md:351 | Die Beschreibung von `GET /dashboard` nennt für `contractTasks.missingStatements` weiter `periods: [{ start, end }]`. Das neue Feld `outside`, das die Übersicht jetzt auswertet, fehlt dort. Die Zeilen 105-106 sind nachgeführt, diese nicht (Rest von C-13). |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (Worktree ohne node_modules): auf ce6d11b lint, check, Backend type-check, vitest (4055), Backend-Suite (1991, 97 %), fitness, Hooks.
- Ob die Tests rot waren, habe ich nur durch Lesen beurteilt. Alle drei wären ohne die Änderung rot:
  - pg-Test Übersicht (statement-run.pg.test.ts:184-190): contract-tasks.service.ts gab vorher nur `{ start, end }` weiter, also wäre `outside` undefined gewesen statt `true`.
  - overview.test.ts:241: Ohne die Änderung gibt es keine Aufgabe `missing-outside`, und 2023 steht in `missing-period`.
  - contract-detail-page.dom.test.ts:353: Ohne die Änderung steht der Text `contracts_statement_missing_text` mit «Der Assistent …» im Hinweis.
- «No scenario» und keine a11y- oder Sprachzeile für die Aufgabe «Abrechnungen ausserhalb von Dwello» und die Variante am Mietvertrag: Den Grund halte ich für tragfähig.
  - `generateInPeriod` lehnt Überschneidungen ab (statement-run.service.ts:88-99).
  - `BUILDING_PERIOD_LOCKED` verhindert, dass sich die Abrechnungsperiode eines Gebäudes mit Abrechnungen nachträglich ändert (building.service.ts:202-205).
  - tests/e2e/fixtures/backend.ts hat keinen direkten Zugriff auf die Datenbank.
  - Den Pull-Request-Text mit `No scenario: <Grund>` und `Spec change approved: #1088` (für das gelöschte Szenario #734) gibt es noch nicht.

Geprüft:
- `outside` je Gebäude: `overlapped` hängt nur von den Abrechnungen des Gebäudes und der Periode ab, die Gruppierung in contract-tasks bleibt also widerspruchsfrei.
- Die Daten laufen ungefiltert durch dashboard/+page.server.ts.
- Die Aufteilung in overview.ts und der Link `/contracts` stimmen. Die Liste zeigt die Markierung, die Seite des Mietvertrags den Hinweis.
- Die vier Übersetzungen sind vorhanden.
- Die Verträge dashboard.json und contracts-missing-statements.json sind nachgeführt.
- Nach dem entfernten Schritt sucht kein Feature mehr.
- ponytail-review: nichts zu beanstanden.
