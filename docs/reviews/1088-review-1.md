# Code-Review #1088, Runde 1

Gegenstand: `git diff origin/main e8dc510` ohne docs/reviews, implementation_plan.md, docs/archive und docs/design/personas (Worktree review-1088b-code, e8dc510). Anforderung: #1088 mit allen Abschnitten «Decided (product owner)», auch «Fachreview 1088-1» und «Fachreview 1088-2».

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement.service.ts:527 (entfernt: `refuseOverlappingPeriod`), backend/src/services/statement-run.service.ts:88-94 | Die Sperre gegen Perioden, die sich überschneiden, ist weg. Bei Altdaten (Abrechnungen eines anderen Typs oder kurze Perioden aus der Zeit vor #1088, die die Migration ausdrücklich vorsieht) nimmt Dwello wieder eine ganze Periode an, die eine bestehende Abrechnung schneidet. Eine Rechnung ohne Leistungszeitraum wird dann über 100 % verteilt. |
| C-2 | Major | backend/src/services/accounting-period.ts:55-57 | Die Ausnahme «Periode gleich einer Abrechnung des Gebäudes» gilt für jeden Mietvertrag. Ein neuer Mietvertrag kann so eine alte kurze Periode oder eine Periode eines anderen Typs bekommen. Das widerspricht Fachreview 1088-2 V-10: Solche Abrechnungen dürfen nicht entstehen, und die Wege in ältere Perioden sollen wegfallen. |
| C-3 | Major | backend/src/services/statement-run.service.ts:187; tests/e2e/features/statement-generate.feature | Was der Benutzer sieht, ändert sich: Schritt 1 des Assistenten schlägt die letzte Periode des Typs vor, den die meisten Gebäude haben (bei Gleichstand der zuletzt beendete). Dafür gibt es kein Szenario und keinen Test von `runDefaultsOf` mit einer Mehrheit, die nicht das Kalenderjahr ist. Getestet ist nur `commonType`. |
| C-4 | Major | tests/a11y/screens.json:261-267; accessibility.feature:61-63; sprachen-bildschirme.feature | `building-edit` `default` zeigt jetzt die gesperrte Variante, denn Seeblick hat Abrechnungen. Für die Bearbeitung mit änderbarer Abrechnungsperiode und Hilfe zum Mietvertrag und für die Ablehnung `BUILDING_PERIOD_LOCKED` fehlen Zeilen. |
| C-5 | Minor | src/routes/buildings/new/+page.server.ts:11-15; backend/src/routes/buildings.ts:93 | Der Vorschlag für ein neues Gebäude ist nur über `commonType` getestet. Das Szenario «Die Erfassung schlägt … der meisten Gebäude vor» erwartet das Kalenderjahr. Das ist zugleich der Rückfall des Loads und der Default des Formulars, also ist der Schritt auch ohne `/new-defaults` grün. Es fehlt ein Test, in dem die Mehrheit Juli – Juni oder November – Oktober ist. |
| C-6 | Minor | src/routes/statements/generate/BuildingStep.svelte:67 | Der Kommentar sagt «a building the period overlaps or …». Eine Überschneidung als Grund gibt es nicht mehr (`unchoosable` prüft nur `otherPeriod`). |

## C-1: Altdaten mit Überschneidung werden wieder doppelt verteilt

Warum falsch:
- Auf origin/main lehnte `generateStatement` jede neue Periode ab, die eine Periode des Gebäudes schneidet, ohne ihr gleich zu sein (`STATEMENT_PERIOD_OVERLAPS`). Grund laut Kommentar und laut dem entfernten `statement-period-overlap.pg.test.ts:1-8`: «A run for 2024 would take the CHF 1'000 again at 91/366 for Eva: 1'248.63 for 1'000».
- `generateInPeriod` prüft jetzt nur `fitsType || gleich einer Periode`. Eine ganze Periode des eigenen Typs geht durch, auch wenn eine Altabrechnung des Gebäudes sie schneidet.
- Die Migration erzeugt genau diesen Zustand: Der Test `migrations.pg.test.ts:283 ff.` («Gewechselt»: 2022/23 Juli – Juni, dann 2024 und kurz 01.01.–31.03.2025) gibt dem Gebäude das Kalenderjahr. Danach ist 2023 wählbar, obwohl 2022/23 es schneidet, ebenso 2025 trotz der kurzen Abrechnung vom 01.01.–31.03.2025.
- `planRun` lässt nur Mietverträge mit eigener überlappender Abrechnung aus. Ein Nachmieter in derselben Wohnung ohne Abrechnung wird abgerechnet. Der Hinweis am Mietvertrag (`missingPeriods`) bietet ihm die Periode sogar an.
- Der Entscheid V-10 sagt «Existing statements stay as they are» und «statements of another period … in one building must not occur, and Dwello enforces it». Dass eine Rechnung wieder über 100 % verteilt wird, deckt er nicht. Auch die Commit-Nachricht von e8dc510 trifft für Altdaten nicht zu: «overlaps of statement periods … can no longer arise».

So zeigt man den Fehler (`*.pg.test.ts`): ein Gebäude im Kalenderjahr, Wohnung 1.
- Eva wohnt dort vom 01.07.2022 bis 31.03.2023, mit einer Abrechnung vom 01.07.2022 bis 30.06.2023, die über `generateStatement` direkt angelegt ist (Altdaten).
- Marc wohnt dort ab 01.04.2023, ohne Abrechnung.
- Eine Rechnung ohne Leistungszeitraum ist vom 15.02.2023.
- `POST /statements/generate` für Marc mit 2023 gibt auf e8dc510 201 zurück. Evas Anteil (273/365) und Marcs Anteil (275/365) an der Rechnung ergeben zusammen rund 150 % des Wohnungsanteils. Auf origin/main kommt 400 `STATEMENT_PERIOD_OVERLAPS`.

Behebung: Die Prüfung auf Überschneidung (gleiche Periode erlaubt) neben `fitsType` behalten. Falls es anders gewollt ist, braucht es einen Entscheid in #1088.

## C-2: Die Ausnahme der gleichen Periode ist breiter als die berichtigte Abrechnung

Warum falsch:
- Fachreview 1088-2 V-10 hat entschieden: «The backend refuses every statement whose period is not a whole period of its building's Abrechnungsperiode. The ways into the periods of older statements (V-1 above) go.»
- `otherPeriod` gibt `null` zurück, sobald irgendeine Abrechnung des Gebäudes dieselbe Periode hat. Schritt 2 (`runPlan`) bietet das Gebäude dann an, und `generateInPeriod` nimmt für jeden Mietvertrag an. Wer in Schritt 1 die Tage einer alten kurzen Periode von Hand eingibt, rechnet damit weiter kurze Perioden ab.
- Die berichtigte Abrechnung braucht die Ausnahme nicht. `correctStatement` ruft `generateStatement` direkt auf (statement.service.ts:958), und ein Lauf in der Periode einer ersetzten Abrechnung betrifft nur deren Mietvertrag (`replacedHere` in `planRun`).

So zeigt man den Fehler: ein Gebäude im Kalenderjahr. Mietvertrag A hat eine Altabrechnung vom 01.01. bis 30.06.2024, direkt über `generateStatement`. `POST /statements/generate` für Mietvertrag B in einer anderen Wohnung mit 01.01.–30.06.2024 gibt 201 zurück statt 400 `STATEMENT_PERIOD_OF_BUILDING`. `accounting-period.test.ts` hält diese breite Ausnahme sogar fest: `otherPeriod('calendar', run, [{ 2023-07-01 … 2024-06-30 }])` ergibt `null`, ohne Bezug zum Mietvertrag.

Behebung: Die Ausnahme auf den Mietvertrag mit einer ersetzten Abrechnung genau dieser Periode beschränken. Wenn der Product Owner die breite Lesart meint (wie in der Zusammenfassung des Aufrufers), das in #1088 festhalten.

## C-3: Kein Szenario für den Vorschlag in Schritt 1

Warum falsch: Der Vorschlag kam bisher aus der Einstellung und kommt jetzt aus der Mehrheit der Gebäude. Das ist eine Verhaltensänderung, die der Benutzer sieht (CLAUDE.md, Workflow 1), und dazu ein geänderter Text (`statements_period_proposed`). Kein Szenario in `statement-generate.feature` prüft die vorgeschlagene Periode. Kein Backend-Test ruft `/statements/run-defaults` mit Gebäuden auf, deren Mehrheit nicht `calendar` ist (statement-run.pg.test.ts:159, :177 nur mit Link bzw. Kalenderjahr).

So zeigt man den Fehler: `runDefaultsOf` auf `getTypedConfig`-freie Werte oder auf `'calendar'` zurücksetzen. Alle Tests bleiben grün.

Behebung: ein Szenario, etwa zwei Gebäude Juli – Juni und ein Gebäude Kalenderjahr: Schritt 1 schlägt die letzte beendete Periode Juli – Juni vor. Dazu ein pg-Test mit Gleichstand.

## C-4: Fehlende a11y- und Sprachzeilen für die Bearbeitung

Warum falsch: CLAUDE.md, «Process», verlangt: «a change that makes an existing state show another variant keeps a row for each». `building-edit` (`/buildings/{building}/edit`, Seeblick mit den Abrechnungen von Anna, Bruno und Carla) zeigt jetzt das gesperrte Select mit `buildings_period_locked`. Zwei Zustände fehlen:
- das änderbare Select auf der Bearbeitungsseite, mit `buildings_help_accounting_period`;
- die Fehlermeldung `backend_building_period_locked`, die das Szenario «… nachdem inzwischen eine Abrechnung entstanden ist» erreicht.

Beide fehlen in screens.json (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`.

So zeigt man den Fehler: `grep -n building-edit tests/a11y/screens.json tests/e2e/features/accessibility.feature` zeigt nur `default`, `submit-cleared` und `saved-toast`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (Worktree ohne node_modules): `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (4038 grün), die ganze Backend-Suite (1987 grün vor der Verschiebung in `generateInPeriod`, danach statement-run, statement-correction, api-contracts und accounting-period erneut grün), `bun run fitness`, Commit-Hooks, Prettier auf neuen Dateien. Ebenfalls vom Aufrufer gemeldet: E2E in Chromium (1699 grün, 1 rot: datenexport «Die Dateinamen des Exports …» fr, auf origin/main gleich rot), auf dem Stand vor der Verschiebung der Prüfung.
- Die Zahlen für C-1 sind aus dem Code und dem entfernten Test statement-period-overlap.pg.test.ts:1-8 gelesen, nicht ausgeführt.
- Ob Altdaten wie in C-1 und C-2 in echten Installationen vorkommen, zeigen nur die Daten (Fachreview 1088-2 nennt dasselbe).
- Ob die neuen Szenarien rot waren, habe ich nur durch Lesen beurteilt. building-edit, building-new (Hilfetext), settings, contract-detail, dashboard und statement-generate (andere Periode) scheitern auf origin/main an fehlendem Verhalten. Zum Vorschlag beim Erfassen siehe C-5.
- Der Fall «nur Entwürfe» beim Text der Sperre (Fachreview 1088-2 V-11, Minor) und V-12: fachlich, nicht geprüft.

Geprüft: Migration 0042 samt Test, die Sperre in `updateBuilding` und ihr Code 409, die Route `/new-defaults` vor `/:id`, BFF-Mapper und Formular (gesperrtes Feld wird nicht gesendet), die Wahl in Schritt 2 und «Alle Gebäude», `missingPeriods` und die Übersicht je Gebäudetyp, der Datenexport, Texte in allen vier Sprachen mit denselben Schlüsseln, die Codes `BUILDING_PERIOD_LOCKED` und `STATEMENT_PERIOD_OF_BUILDING` mit ihren Meldungen `backend_*`, die API-Verträge (building, buildings, building-new-defaults, statement-run, contract-missing-statements), die Glossarzeilen wie entschieden, die Screenplay-Schichten der neuen Steps, `backup-schema.ts` (durch den Ratchet für dicke Dateien in tools/fitness/ratchet.json begründet), ponytail-review: nichts zu kürzen.
