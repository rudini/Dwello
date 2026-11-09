# Code-Review #1409 Jahresbericht, Runde 1 (3ee7579f..af3b27d2, Mietertrag-Slice)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/annual-report.service.ts:67, src/__tests__/annual-report.test.ts:30 | `firstYear` ist `Math.min(year, ...)` und damit nie grösser als das gefragte Jahr: Die Vorgabe «erstes Jahr des Gebäudes, wenn seine Daten später beginnen» (V-10) greift nie. Der BFF-Test täuscht eine Antwort vor, die das Backend nicht geben kann. |
| C-2 | Major | tests/e2e/tasks/annual-report.ts:14, :20 | `openAnnualReport` wartet nach dem Absenden nicht auf den gewählten Bericht. `downloadAnnualReport` klickt danach sofort den Download-Link, unter Umständen noch auf der alten Seite (erstes Gebäude der geteilten Datenbank, Vorgabejahr). |
| C-3 | Major | tests/e2e/features/analytics.feature:40-51, backend/src/__tests__/annual-report.pg.test.ts:136-169 | Die Kosten-Spezifikation der Slice (tageweise Aufteilung, drei Gruppen samt umlagefähiger Nebenkosten) widerspricht den Entscheiden in #1409 vom 09.11.2026, die schon im Issue stehen. |
| C-4 | Major | tests/e2e/features/analytics.feature:30 | Das geänderte Verhalten (die Seite zeigt den Mietertrag statt der Ankündigung, CSV und PDF) hat kein Szenario ohne `@wip`. Das bisherige Szenario ist entfernt. |
| C-5 | Major | tests/a11y/screens.json:1224 | Neue Zustände fehlen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`: Bericht, laufendes Jahr mit Hinweis, ohne Gebäude (`analytics-empty`). Die bestehende Zeile `analytics/default` zeigt jetzt einen anderen Bildschirm. |
| C-6 | Minor | backend/src/services/annual-report.service.ts:44 | Hat ein Vertrag keine Zeile in `contract_advance_payments`, wirft `advanceLines([])` in `amountOn` einen TypeError (500 für den ganzen Bericht). `calculation.service.ts:420-425` fällt dafür auf `monthlyAdvancePayment` zurück. |
| C-7 | Minor | tests/e2e/steps/coming-soon.steps.ts:8, :17; tests/e2e/questions/coming-soon.ts; tests/e2e/targets/coming-soon.ts | Die Schritte «die Auswertungen öffnet» und «sieht … die Ankündigung», die Frage `announcement` und das Ziel `comingSoonNotice` nutzt kein Feature mehr (nur noch «die Berichte öffnet» aus reports.feature:22). |
| C-8 | Minor | messages/*.json (de :1965-1970) | `analytics_costs_heading`, `analytics_group_utility(_total)`, `analytics_group_capital(_total)` und `analytics_costs_total` sind in allen vier Sprachen eingetragen, aber nirgends verwendet; nach C-3 sind sie zudem inhaltlich überholt. |
| C-9 | Minor | src/lib/server/annual-report.ts:146 | Der Hinweis zum laufenden Jahr im PDF (`lines`) hat keinen Test. Der PDF-Test des BFF prüft nur 2025 mit der echten Uhr. |

## C-1 Vorgabejahr bei später beginnenden Daten

`firstYear(buildingId, year)` gibt `Math.min(year, ...years)` zurück. Liegt das erste Datum nach dem gefragten Jahr, kommt also das gefragte Jahr zurück, und in `loadAnnualReport` (src/lib/server/annual-report.ts:86) ist `report.firstYear > report.year` nie wahr.

So zeigt es sich: ein Gebäude, dessen einziger Mietvertrag am 01.03.2026 beginnt, heute 09.11.2026, `/analytics` ohne Wahl. Der BFF fragt 2025 und das Backend antwortet `firstYear: min(2025, 2026) = 2025`. Die Seite zeigt 2025 mit lauter 0.00 statt 2026. Der Unit-Test «zeigt ohne Wahl das erste Jahr des Gebäudes …» besteht nur, weil sein Fake `firstYear: 2026` zu `year: 2025` liefert. Den pg-Test (`[2025, 2024]`) und den Vertrag (`year=2024`) besteht der Fehler ebenfalls.

Fix: im Backend das erste Datenjahr liefern (ohne Daten das gefragte Jahr), z. B. `years.length ? Math.min(...years) : year`, und dazu einen pg-Test mit einem Gebäude, dessen Daten nach dem gefragten Jahr beginnen. Die Jahresliste in `loadAnnualReport` nimmt schon `Math.min(report.firstYear, report.year)`, ein gewähltes früheres Jahr bleibt also wählbar.

## C-2 Aufgabe wartet nicht auf den gewählten Bericht

`Click.on(showAnnualReport)` sendet das GET-Formular ab, und die Navigation läuft asynchron. `DownloadFrom(annualReportDownload(kind))` sucht danach sofort `annual-report-csv|pdf`. Den Link gibt es schon auf der Seite vor dem Absenden, dort aber für `buildings[0]` und das Vorgabejahr. Weil Szenarien parallel auf derselben Datenbank laufen (tests/e2e/CLAUDE.md, «Isolation»), ist `buildings[0]` oft das Gebäude eines anderen Szenarios. Der Download kann dann die falsche Datei liefern, und das Szenario wird flaky (Regel: eine Aufgabe wartet auf den Zustand, zu dem sie führt; keine zwei Klicks hintereinander über einen asynchronen Schritt).

So zeigt es sich: Ein zweites Gebäude, dessen Name vor «Seeblick …» sortiert, existiert parallel. Das CSV-Szenario lädt zeitweise «Jahresbericht <anderes> 2025.csv».

Fix: nach dem Absenden auf die URL mit `building=<id>&year=<year>` warten, oder darauf, dass die Überschrift den gewählten Bericht nennt.

## C-3 Kosten-Spezifikation widerspricht dem Entscheid in #1409

Der Aufrufer schreibt, die Kosten warteten auf einen Entscheid. Das Issue #1409 hat unter «Decided (product owner)» aber schon zwei Einträge vom 09.11.2026:
- Jede Rechnung zählt ganz im Jahr ihres Rechnungsdatums.
- **Content changed:** Der Bericht zeigt nur die Kosten, die nicht auf die Mieter überwälzt werden (nicht umlagefähige Rechnungen und der Anteil umlagefähiger Kosten, den die Abrechnungen beim Vermieter lassen, z. B. Leerstand). Keine Hypothekarzinsen. Das ersetzt die Dreiteilung.

Diesen Entscheiden widersprechen in der Slice:
- das `@wip`-Szenario: Heizung 1’840.00 tageweise, «Total Nebenkosten» mit der ganzen umlagefähigen Rechnung, Kosten-Hilfe zur Aufteilung nach Tagen (feature:40-51 und die CSV- und PDF-Zeilen :57-75);
- die drei pg-Tests «Kosten des Jahresberichts»;
- die Kosten-Texte (C-8).

Das sind Spezifikationen eines verworfenen Verhaltens. Sie bleiben rot und müssen umgeschrieben werden, bevor die Kosten-Slice grün werden kann. Die neue Fassung braucht wohl eine neue `fach-reviewer`-Runde (neue Regel: Anteil des Vermieters aus den Abrechnungen).

## C-4 Kein Szenario ohne `@wip`

Die Seite «Auswertungen» zeigt jetzt den Mietertrag und bietet CSV und PDF an. Alle drei Szenarien sind `@wip`, und «Auswertungen sind angekündigt» ist entfernt. Damit deckt auf diesem Commit kein laufendes Szenario das neue Verhalten ab (CLAUDE.md «Done means», Workflow 1). Spätestens vor dem Push braucht es ein grünes Szenario ohne `@wip`. Denkbar ist ein Mietertrag-Szenario ohne Kostenzeilen, solange die Kosten auf C-3 warten.

## C-5 a11y- und Sprachzeilen fehlen

`screens.json` hat für `/analytics` nur `default`, das bisher die Ankündigung war. Neu sind der Bericht (mit Auswahl, Tabelle, Downloads), der Hinweis zum laufenden Jahr (`annual-report-current-year`, ein eigener Zustand mit Alert) und der leere Zustand ohne Gebäude, eine eigene Variante mit eigener Aktion. Jeder braucht eine Zeile mit `stateMeanings` in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Der Aufrufer will sie mit der Kosten-Slice nachliefern. Bis dahin gilt dieser Befund als offen.

Geschlossen: –

Geprüft: Mietertrag-Rechnung (Akonto-Verlauf, angebrochene Monate, Überschneidung mit dem Kalenderjahr) gegen `advanceLines` und die pg-Fälle; `a4Pdf` ohne Verhaltensänderung für Mahnung und Notfallblatt; `fileDownload`/`zipDownload`; Auth der neuen Backend-Routen (hinter `authMiddleware`, JWT über `handleFetch`); Body-Grenzen von `POST /reports/pdf`; 404/422 auf `record_not_found`; alle verwendeten Texte in allen vier `messages/*.json` gemäss Texttabelle der Fachreview; Vertrag `report-annual.json` samt README und Drift-Test; Token, `src/lib/ui`, Labels und Tastatur der Seite; Schichten der neuen E2E-Dateien (Schritte rufen nur Aufgaben und Fragen); die Fragen liefern Werte. Spec-Änderung (Ankündigungs-Szenario entfernt): «It fills the page «Auswertungen»» in #1409 entscheidet sie lesbar; `Spec change approved: #1409` trägt.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, `bunx fallow audit`, `cd backend && bun run type-check`, die vitest-Dateien (annual-report, analytics-page, data-export, i18n), `bun test annual-report.pg.test.ts api-contracts.pg.test.ts` (3 Kosten-Tests rot), die Tests von Mahnung und Backup, die Rot-Läufe jedes neuen Tests.
- E2E: nicht gelaufen (alles `@wip`). Ob die Kopfzellen «Position»/«Betrag» der Tabelle so aus `getByRole('columnheader')` kommen, habe ich nur aus `Table.svelte` gelesen.
- Der Umzug des Roadmap-Eintrags «Berichte und Auswertungen» (marketing/index.html:753) in denselben PR, den #1409 verlangt, fehlt in dieser Slice. Gelesen im Issue; nicht als Befund gewertet, weil die Slice nur den Mietertrag umfasst.
- Ob Altbestände ohne Zeile in `contract_advance_payments` vorkommen (C-6): Migration 0026 füllt sie nach, demo-data.sql auch. Rücksicherung aus dem Backup nicht geprüft.
