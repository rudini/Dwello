# Code-Review 1126-4 (Abschlussrunde, `git diff 0e38ec3 680357f`)

Geschlossen: C-5, C-6 (aus 1126-3)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Minor | `src/routes/reports/CostReconciliation.svelte:36`, `:92` | Noch offen aus 1126-3 und in diesem Diff unverändert: Auf «Berichte» zeigt eine Periode ohne Positionen weder Tabelle noch Hilfetext. Kein Test deckt das ab. |
| C-8 | Minor | `src/routes/reports/CostReconciliation.svelte:39`, `:56` | Noch offen aus 1126-3: Die Zeilen sind nach Index geschlüsselt. Kein Test zeigt, dass zwei Positionen mit gleicher Bezeichnung funktionieren. |
| C-9 | Minor | `src/routes/reports/CostReconciliation.svelte:61-63` | Die Korrektur von C-6 (die Bezeichnung «Total» ist fett) ist eine geänderte Zeile ohne Test. Kein DOM-Test in `reports-pages.dom.test.ts` oder `statement-wizard.dom.test.ts` prüft die Klasse der `<th>` der Totalzeile. Nimmt man die Änderung zurück, bleiben alle Tests grün. |

Keine Blocker, keine Majors.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - `bun run lint`, `bun run check` (0 errors), der Type-Check des Backends
  - `cost-reconciliation.pg.test.ts` (13 pass; den Rotlauf des Drafts-Tests habe ich nicht gesehen)
  - `api-contracts.pg.test.ts` für `report-reconciliation.json`
  - die vitest-Dateien reports-pages, cost-reconciliation, statement-wizard und i18n (174 pass; den Rotlauf des Drafts-DOM-Tests habe ich nicht gesehen)
  - E2E chromium für `statement-cost-reconciliation`, `reports` und `navigation` (74 pass)
  - die Commit-Hooks
- Nicht gemeldet und nicht ausgeführt:
  - a11y- und Sprachen-Lauf für `report-reconciliation` (`tests/a11y/screens.json:1090`). Der Hinweis zu den Entwürfen hat jetzt Links. Ob der Seed dieser Zeile Entwürfe enthält und axe dort 0 Verstösse meldet, habe ich nicht geprüft.
  - die vollen Suites und Prettier auf den hinzugefügten Dateien (`LinkedNote.svelte`)
- Rotlauf der Szenarien nur durch Lesen beurteilt:
  - Das neue Szenario zu C-5 wäre auf `2ad4081` rot, denn dort steht die Tabelle samt «Total» auch ohne Positionen. Es gehört zum Fix von 1126-2 C-1, dessen DOM-Test rot gesehen wurde. Ein eigener Rotlauf ist nicht nötig.
  - Der neue Schritt «nennt der Hinweis zu den Entwürfen …» wäre ohne die Änderung rot: Es gäbe keinen `cost-reconciliation-drafts` und damit eine leere Liste.
- Weiter offen aus 1126-3: Der Hinweis «Keine Rechnungen erfasst» (`statements_coverage_none`) könnte im neuen Birkenhof-Szenario neben der Zeile über CHF 500.00 stehen. Ob die Liste der Vorschau nicht umlagefähige Rechnungen mitzählt, habe ich nicht nachgelesen. Das Szenario prüft es nicht. Der Entscheid «Empty» der Issue lässt diesen Hinweis ausdrücklich zu.

Geprüft:
- PO-Entscheid «Drafts on „Berichte“» in #1126 gegen Backend (`named`, gemeinsam mit `notUpToDate`), Vertrag, BFF-Typ, Mapper (`?? []`) und `LinkedNote`. Keine weiteren Nutzer von `drafts` als Zahl.
- Texte mit `{statements}` in allen vier `messages/*.json`, U+00A0 vor den französischen Doppelpunkten (V-14), Glossarzeile (V-15).
- `reports.feature` gibt es auf `origin/main` nur als `@coming-soon` ohne das Entwurfs-Szenario, die Änderung ist also frei.
- `.first()` in `reconciliationStatement`: nötig, wenn ein Entwurf auch nicht aktuell ist. Beide Links führen dann zur selben Abrechnung.
- Screenplay-Schichten des neuen Schritts, der Question und des Targets.
