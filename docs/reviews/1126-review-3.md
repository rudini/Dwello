# Code-Review 1126-3 (Abschlussrunde, `git diff 2ad4081 0e38ec3`)

Geschlossen: C-1, C-2, C-3, C-4 (aus 1126-2)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Major | `tests/e2e/features/statement-cost-reconciliation.feature:57-66` | Die Korrektur von C-1 ist eine sichtbare Verhaltensänderung: Ein Gebäude ohne umlagefähige, aber mit nicht umlagefähigen Rechnungen zeigt in der Vorschau die Zeile «Nicht umlagefähige Rechnungen (tragen Sie ganz)» ohne Tabelle. Dafür fehlt ein Szenario ohne `@wip`. Die Korrektur ist nur im DOM-Test belegt. |
| C-6 | Minor | `src/routes/reports/CostReconciliation.svelte:58-62` | Die neue Zeilenüberschrift `<th scope="row">` hat `font-normal`. Das hebt das `font-semibold` der Totalzeile (`<tr class=… 'font-semibold'>`) für die Bezeichnung «Total» auf. Seit diesem Commit sind die Beträge der Totalzeile fett, ihre Bezeichnung «Total» aber nicht mehr. Kein Test prüft das. |
| C-7 | Minor | `src/routes/reports/CostReconciliation.svelte:36`, `:92` | Das neue `{#if reconciliation.positions.length}` wirkt auch auf «Berichte», nicht nur auf die Vorschau. Für eine Periode mit Abrechnungen, aber ohne Positionen (Screens-Seed: Seeblick 2023, `tests/e2e/fixtures/screens.ts:136`) zeigt die Detailseite jetzt weder Tabelle noch Hilfetext. Ohne Pauschale, ohne nicht umlagefähige Rechnungen und ohne Hinweise steht unter dem Seitenkopf gar nichts. Einen Hinweis «Keine Rechnungen» wie in der Vorschau gibt es auf «Berichte» nicht. Diese Änderung auf «Berichte» deckt kein Test in `reports-pages.dom.test.ts` ab. |
| C-8 | Minor | `src/routes/reports/CostReconciliation.svelte:39`, `:56` | Die Zeilen sind neu nach Index statt nach `row.label` geschlüsselt (Korrektur von 1126-2 C-3). Kein Test belegt das. Ein DOM-Test mit zwei Positionen gleicher Bezeichnung wäre ohne die Änderung rot (`each_key_duplicate` im Dev-Modus von vitest). |

## C-5: Szenario für nicht umlagefähige Rechnungen ohne Positionen fehlt

Issue #1126, «Decided (product owner)», «Empty»: «a building without allocable invoices … shows no table …; the row of non-allocable invoices still shows when not zero.» Bis 2ad4081 fehlte die Zeile (1126-2 C-1, daten-pruefer D-1 hat das in der Persona-Umgebung belegt). Seit 0e38ec3 erscheint sie. CLAUDE.md, Workflow 1, verlangt für eine sichtbare Verhaltensänderung, auch für die Korrektur eines Fehlers, ein Szenario in `tests/e2e/features`. Das Szenario «Ohne umlagefähige Rechnungen zeigt die Vorschau keine Kostenabstimmung» hat für «Birkenhof» keine nicht umlagefähige Rechnung, und kein anderes Szenario deckt den Fall ab. Der DOM-Test «zeigt ohne Positionen die nicht umlagefähigen Rechnungen ohne Tabelle» (`statement-wizard.dom.test.ts:477`) ist korrekt und wäre ohne die Änderung rot. Er stubt aber die Antwort `positions: []`, `nonAllocable: 500` und zeigt deshalb nicht, dass Backend, BFF und Vorschau zusammen die Zeile liefern.

So lässt sich zeigen, dass es fehlt: In `statement-cost-reconciliation.feature` nach einem Szenario suchen, das in einem Gebäude ohne umlagefähige Rechnung eine nicht umlagefähige anlegt und «nennt die Kostenabstimmung der Vorschau für … "Nicht umlagefähige Rechnungen (tragen Sie ganz)"» prüft. Es gibt keines. Zur Korrektur ein neues Szenario für «Birkenhof» schreiben, das vorhandene Schritte nutzt: «Angenommen im Gebäude "Birkenhof" gibt es eine nicht umlagefähige Rechnung der Kategorie "Reparaturen" über "500" Franken vom "2024-08-20"», dann die Zeile mit «CHF 500.00» prüfen und dazu, dass keine Tabelle erscheint. Das bestehende Szenario bleibt unverändert.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - `bun run lint`, `bun run check` (0 errors)
  - `bunx vitest run --changed origin/main` (2593 pass)
  - Prettier auf den hinzugefügten Dateien
  - die Commit-Hooks (fallow, deepcheck, testcheck)
  - E2E `navigation.feature` (57 pass, die zwei neuen Zeilen vorher rot gesehen)
  - die Rot-Läufe der neuen DOM-Tests
- Nach 0e38ec3 ist E2E nicht mehr gelaufen, weder beim Aufrufer noch bei mir. Ich habe nur gelesen, dass `<th>` statt `<td>` die Questions nicht bricht: `tests/e2e/targets/cost-reconciliation.ts:15-24` liest die Zellen über `data-testid="cost-reconciliation-cell"`, das auch die `<th>` trägt.
- Nicht nachgesehen: ob die Liste «Rechnungen in der Abrechnungsperiode» der Vorschau für ein Gebäude mit nur nicht umlagefähigen Rechnungen «Keine Rechnungen erfasst» zeigt. Wenn ja, stünde der Hinweis neben einer Zeile über CHF 500.00. Das betrifft den Text des Szenarios zu C-5.
- `fach-reviewer` zu `help_statements_5` und zum Menüpunkt steht laut `implementation_plan.md` noch aus. Die Formulierung in fr/it/en habe ich nicht fachlich geprüft.

Geprüft: C-2 (gegenüber `c4ae72c` bleiben nur der Import und die `fetch`-Zweige, die Leerzeile am Dateiende ist wieder da), C-3 (Index-Schlüssel, Bezeichnung ohne Klammern samt Test; dass `namesById` bei Fehlern stillschweigend eine leere Map liefert, war schon vor dem Diff so), C-4 (Pinning in der Commit-Nachricht von 0e38ec3 genannt), C-1-Code in `PreviewReconciliations.svelte` und `CostReconciliation.svelte` (die Pauschale ist ein Prozentsatz, ohne Positionen also 0); Menüpunkt mit vorhandenem Icon `calculate`, `app-frame.dom.test.ts` und `navigation.feature` ergänzt; `help-page.dom.test.ts:10` verlangt «Berichte» in der Hilfe und war damit rot, bis `help_statements_5` dazukam; `help_statements_5` in allen vier `messages/*.json`; der Test zu Sven P-4 ist ohne `<th>` rot; die Berichte von Personas und daten-pruefer sind nur Dokumente.
