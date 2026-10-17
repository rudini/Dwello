# Code-Review Merge W10c (#363), Runde 3

Gegenstand: `git diff bf177ef dc6407a`, Worktree `review-w10c-merge3` (dc6407a). Gelesen habe ich alle 9 geänderten Dateien sowie `backend/src/routes/statements.ts`, `agreed-category.service.ts`, `coded-error.ts`, `src/lib/server/statement-generation.ts`, `src/routes/statements/[id]/+page.server.ts`, die E2E-Steps des neuen Szenarios und `src/__tests__/statement-generation.test.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 (R2) | erledigt | backend/src/services/statement.service.ts:620-636, 650 | `correctStatement` lehnt mit `STATEMENT_AGREEMENTS_OPEN` ab, solange `agreementsInPeriod` ein `agreed: null` liefert. Die Route antwortet mit 409 (`correctionStatus`, routes/statements.ts:33-34, 226). Pg-Test und E2E-Szenario sind ohne den Aufruf rot. Der Assistent führt nicht in eine Sackgasse, siehe unten |
| C-2 (R2) | erledigt | backend/src/__tests__/agreed-categories.pg.test.ts:330-347 | Nach der Antwort enthält die Berichtigung die beantwortete Kategorie (`totalCosts` 1300.00) |
| C-3 (R2) | erledigt | docs/archive/implementation-plan-verlauf.md:1185 | Die Zeile nennt jetzt 0019 |
| C-5 | Minor | messages/fr.json:415 | «le décompte rectifié» passt nicht zum Begriff in `docs/design/i18n-begriffe.md`:66 («décompte rectificatif»), den fr.json 23-mal verwendet. Ersetzen durch «établit le décompte rectificatif» |
| C-6 | Minor | backend/src/services/statement.service.ts:634 | `{categories}` steht in fr/it/en mit deutschen Namen (`nameDE \|\| name`). Der Assistent nennt dieselben Kategorien in der Sprache der Oberfläche (`namesById` -> `localName`). Es gibt Vorbilder (`invoice-completeness.service.ts`:187, `utility-validation.service.ts`:29), darum nur Minor. Lösung: die IDs mitgeben und im BFF benennen, oder die Namen je Sprache mitgeben |
| C-7 | Minor | docs/api-specification.md:227 | Die Zeile zu `POST /:id/correction` zählt die 409-Codes auf. `STATEMENT_AGREEMENTS_OPEN` (`categories`) fehlt dort |
| C-8 | Nit | backend/src/services/statement.service.ts:622-626 | reuse: eigene Abfrage von `rentalContracts` für id, startDate und endDate. `getContract` (contract.service.ts:173) liefert die Felder schon, so wie `routes/contracts.ts`:121-127 vor demselben `agreementsInPeriod` |
| C-9 | Nit | messages/de.json:415 | Die Meldung nennt den Weg nur als Text. Mit `statement-wizard.ts`:317 gibt es schon einen Link, der Gebäude und Periode vorbelegt. Das würde den Weg kürzen, ist aber nicht nötig |

Keine Blocker, keine Majors.

## Frage des Aufrufers: Führt «Abrechnungen erstellen» zur berichtigten Abrechnung und fragt dort?

Ja, laut Code:
- `contractsOf` (statement-generation.ts:58-63) zählt eine ersetzte Abrechnung genau dieser Periode nicht als abgerechnet. Der Mietvertrag kommt darum in `contractsInPeriod`.
- `contractAgreements` (Schritt «Einstellungen», Zeile 100-120) und `generateStatements` (Zeile 149-165) verwenden beide `contractsInPeriod`. Der Assistent fragt also für genau diesen Mietvertrag nach der offenen Kategorie (`GET contracts/:id/agreements` -> dasselbe `agreementsInPeriod` wie in der Ablehnung) und erstellt dann seinen Entwurf.
- `POST /statements/generate` -> `calculateStatement` -> `openReplaced` (statement.service.ts:350-376) verknüpft den Entwurf mit der ersetzten Abrechnung derselben Periode (`replacesId`, `priorPayments`). So entsteht die berichtigte Abrechnung.
- Abgedeckt ist das durch den Vitest «erstellt für einen Mietvertrag mit einer ersetzten Abrechnung die berichtigte» (statement-generation.test.ts:211), den pg-Test «entsteht auch im Abrechnungslauf der Periode» (statement-correction.pg.test.ts:231) und das Szenario «Der Abrechnungslauf rechnet einen Mietvertrag mit ersetzter Abrechnung wieder ab» (statement-generate.feature:49). Das Fragen im Lauf zeigt «Ohne Antwort geht der Assistent nicht weiter».
- `PeriodStep` nimmt beliebige Daten an. Jede Periode einer ersetzten Abrechnung lässt sich also wählen. Den Knopf mit der Beschriftung «Abrechnungen erstellen» gibt es auf der Abrechnungsliste (`statements/+page.svelte`:93-96) und im Dashboard. Die Beschriftung stimmt in allen vier Sprachen mit `dashboard_create_statements` überein.

Unterschied der beiden Wege (Nit, besteht schon auf main): Die direkte Berichtigung übernimmt Heizprofil und Verwaltungspauschale der ersetzten Abrechnung. Im Lauf wählt der Liegenschaftsverwalter beides neu, und der Lauf erstellt auch Entwürfe für andere Mietverträge des Gebäudes, die in der Periode noch keine Abrechnung haben. Die Meldung verspricht nur «erstellt die berichtigte Abrechnung», und das stimmt.

## Bestätigt beim Lesen

- **Status:** `CodedError` aus `correctStatement` wird über `correctionStatus` zu 409. Nur `STATEMENT_NOT_FOUND` wird 404.
- **Ablehnung vor `CONTRACT_NOT_IN_PERIOD`:** `agreementsInPeriod` zählt nur Kosten, die die Mietdauer überlappen. Ohne Mietstage ist die Liste leer, und die bestehenden Ablehnungen `STATEMENT_NO_RENTAL_DAYS_*` greifen weiter. `rental_contracts` ist mit `onDelete: 'restrict'` verknüpft, der Mietvertrag existiert also immer.
- **Pg-Test rot ohne die Änderung:** Ohne `refuseOpenAgreements` gibt der erste POST 201 zurück, und `toBe(409)` schlägt fehl. Die Kategorie wird nach dem Mietvertrag angelegt und ist darum unbeantwortet (`name` mit Token, `nameDE` leer, `nameDE || name` trifft). Aufgeräumt wird über `own`.
- **E2E-Szenario rot ohne die Änderung:** Ohne Ablehnung leitet die Action auf den neuen Entwurf weiter (`+page.server.ts`:80-83), und die Fehlermeldung erscheint nicht. Alle Steps gibt es (common.steps.ts:32, statement-detail.steps.ts:124/129/203/384/411, categories.steps.ts:37, agreed-costs.steps.ts:28). Der Text kommt über `actionError` aus `backendMessage`, wie bei den anderen Ablehnungen der Berichtigung. Die Feature-Sprache ist fachlich, ohne «klickt», «Button» oder «Feld».
- **Meldung in allen vier `messages/*.json`.** `backend-codes.test.ts` findet den Code mit seiner Meldung.
- **a11y:** Die Meldung erscheint im bestehenden Fehlerbereich der Detailseite. Die anderen Ablehnungen von `/correction` haben auch keinen eigenen Zustand in `screens.json`. Darum ist das kein neuer Zustand im Sinn der Regel.
- **Nichts Fremdes im Diff:** `docs/reviews/w10c-merge-review-2.md` ist der eingecheckte Bericht der Runde 2, wie die anderen Berichte in `docs/reviews/`.

## Nicht bestätigt

- **Selbst wiederholt:** `bunx vitest run src/__tests__/backend-codes.test.ts src/__tests__/i18n.test.ts`, 30 grün.
- **Vom Aufrufer gemeldet, nicht wiederholt:** Backend type-check; pg-Tests `agreed-categories` und `statement-correction` grün; lint. Ebenso das Rot des E2E-Szenarios ohne den Aufruf und sein Grün mit dem Aufruf. Dazu der volle E2E-Lauf auf bf177ef (1001 grün, 4 rot, einzeln grün). Backend-Tests und E2E durfte ich nicht starten.
- Das Rot des pg-Tests und des Szenarios ohne die Änderung habe ich nur durch Lesen beurteilt.
- Den Ablauf «Ablehnung, dann Assistent, dann berichtigte Abrechnung» zeigt kein einzelner Test von Anfang bis Ende. Bestätigt ist er nur aus den einzelnen Teilen (siehe oben).
