# Code-Review W4b-Mietstatus, Runde 1 (c069e25..e2ca0f2)

Worktree: `/tmp/claude-0/-home-user-Dwello/91846713-a6c9-5452-8f2c-4a3754630714/scratchpad/review-w4bm-code` (detached, e2ca0f2). Alle 68 Dateien der Diff gelesen.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Major | `src/routes/contracts/[id]/+page.server.ts:148-155`, `DeleteContract.svelte:95-97` | Wenn die Abrechnungen nicht geladen werden können (`rows()` gibt `null`), wird `billedBy` zu `[]`. Der Dialog eines beendeten Mietvertrags sagt dann «Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung.», obwohl das niemand geprüft hat |
| C-2 | Minor | `src/routes/apartments/+page.server.ts:48`, `src/routes/buildings/[id]/+page.server.ts:122` | Neu zeigen auch die Wohnungsliste und die Gebäudeseite «Leer seit …» (Fachreview V-4), aber kein Unit- oder DOM-Test prüft diese beiden Mapper-Zeilen. Wird eine entfernt, bleiben alle Tests grün |
| C-3 | Minor | `src/__tests__/dashboard.test.ts:94-103`, `backend/src/services/apartment.service.ts:125,165` | Die Apartment-Antwort hat ein neues Feld `lastContractEnd`. Frontend-Tests lesen es aus Inline-Daten, nicht aus `tests/contracts/*.json`, und es gibt keinen Apartment-Contract (CLAUDE.md, Gotchas, «API contracts»: «add a contract when there is none»). `api-contracts.pg.test.ts` sichert das Feld deshalb nicht ab |
| C-4 | Minor | `src/routes/contracts/new/+page.server.ts:61` (unverändert, über `statusLabels`) | Im Mietvertrags-Assistenten steht bei einer Wohnung mit künftigem Mietvertrag jetzt wörtlich «Vermietet ab …», obwohl `nextContractStart` vorliegt. #58 verlangt «Vermietet ab {Datum}», wo eine einzelne Wohnung gezeigt wird (vgl. Fachreview V-7) |
| C-5 | Nit | `src/routes/apartments/[id]/ContractHistory.svelte:64` | Die Zwischenüberschrift h3 «Frühere Mietverträge» hat dieselbe Grösse wie der Panel-Titel (`text-xl font-bold`, laut `token-referenz.md:35` für Panel- und Dialogtitel). Andere h3 in Panels nutzen `text-lg font-semibold` (z. B. `FormulaHelp.svelte:36`) |
| C-6 | Nit | `src/lib/apartment.ts:222` und `:236` | ponytail `shrink:` Die Starts werden zweimal sortiert, in `reletStarts` und noch einmal in `reletParts`. Eine Sortierung reicht (die in `reletParts`, dann `.sort()` in `reletStarts` streichen). net: -1 Zeile |
| C-7 | Nit | `tests/e2e/features/tenants.feature:48` | «Dann die Mieterliste enthält genau 0 Mieter»: falsche Wortstellung (bestehender Schritt). Besser «Dann enthält die Mieterliste …» |
| C-8 | Nit | `src/routes/apartments/[id]/edit/StatusField.svelte:9` (unverändert) | Der Kommentar nennt noch «Wiedervermietet». Nur zur Kenntnis, ausserhalb der Diff |

ponytail-review: C-6. Sonst schlank: `hasLater`/`isFuture` und das `rows`-Snippet haben je einen klaren Zweck, und `reletParts` und `reletStarts` ersetzen den Code, der vorher im Dashboard doppelt stand. net: -1 Zeile möglich.

## C-1 (Major): «keine Nebenkostenabrechnung» auch dann, wenn die Abrechnungen nicht geladen wurden

**Was falsch ist.** `rows()` (`+page.server.ts:48-51`) gibt bei einem Fehler oder einer Nicht-OK-Antwort `null` zurück. `billedBy: (statements ?? []).map(...)` macht daraus eine leere Liste. `DeleteContract.svelte` zeigt bei `ended && !billed` dann `contracts_delete_no_statements`. Dwello behauptet in diesem Fall eine Tatsache, die es nicht prüfen konnte.

Dieselbe Datei folgt sonst ausdrücklich der Regel «none rather than a wrong one»:
- `missingStatements` gibt bei `statements === null` `[]` zurück (Kommentar Z. 70-71);
- `nextStepsDue` gibt `null` zurück (Kommentar Z. 57-58).

Die neue Zeile bricht diese Regel. Vor der Änderung zeigte der Dialog in diesem Fall nur die Bestätigung «irrtümlich erfasst», und das Backend lehnt das Löschen eines abgerechneten Mietvertrags weiterhin codiert ab. Daten gehen also nicht verloren. Der Verwalter liest aber eine falsche Aussage, und gerade A-8 soll ihn davor schützen, einen beendeten Mietvertrag für ein Duplikat ohne Abrechnungen zu halten.

**Wie es sich zeigt.** Ein Unit-Test analog `contract-actions.test.ts`: Der Fetch-Stub beantwortet `statements?contractId=…` mit 500. Ergebnis: `data.billedBy` ist `[]`, nicht unterscheidbar von «keine Abrechnung».

Ein DOM-Test mit `open('2018-01-01', '2021-12-31')` und diesem Ladeergebnis zeigt «Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung.».

**Behebung (Vorschlag).** `billedBy` bei einem Ladefehler als `null` weitergeben und die Zeile nur bei `billedBy !== null` zeigen. Dazu ein Test, der zuerst rot ist (Unit für `load`, DOM für den Dialog). Ein E2E-Szenario für den Fehlerzustand nur, wenn der Stack ihn erzeugen kann, sonst `No scenario: <Grund>` (`tests/e2e/CLAUDE.md`, «Rules», Fehlerzustände).

## Anforderungen: Abgleich

- **#117:** bestätigt durch Code und Tests.
  - Reihenfolge: Das Backend sortiert nach `startDate desc` (`contract.service.ts:141`). `ContractHistory.svelte` teilt in laufende und künftige Verträge oben und beendete unter dem h3 «Frühere Mietverträge». Die Hilfe steht beim Badge «Beendet».
  - Tests: DOM-Test `apartments-pages.dom.test.ts` («listet beendete Mietverträge …»); E2E «Früherer Mietvertrag auf der Wohnungsseite».
  - Löschdialog verlinkt jede Abrechnung mit Status: DOM-Test (`contract-delete-statement-s1/s2`); E2E «… nennt seine Abrechnungen» und «Abrechnung aus dem Löschdialog öffnen».
  - Ohne Abrechnung: DOM-Test und E2E (Fehlerzustand siehe C-1).
  - Texte stehen in allen vier `messages/*.json`.
  - `docs/anforderungen-vertragsende.md` markiert A-8 als umgesetzt (Tabelle und Abschnitt).
  - a11y- und Sprachzeilen: `apartment-detail-vacant` und `contract-detail-ended` (`default`, `delete-dialog`) stehen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- **#145:** bestätigt.
  - Backend: `lastContractEnd` ist `max(end_date) < heute` (`apartment-status.pg.test.ts`).
  - «Leer seit» = Tag danach über `endedSince`: `apartment.test.ts` (auch Gesperrt ohne «seit»).
  - Wohnungsseite mit Hilfe: DOM-Test und E2E «Leere Wohnung nach dem Auszug».
  - Übersicht: `dashboard.test.ts`, `dashboard-page.test.ts` und E2E «Leere Wohnung in der Belegung».
  - Die Hilfe auf der Übersicht erscheint nur, wenn es eine solche Wohnung gibt (Test vorhanden).
- **#58:** bestätigt.
  - «Vermietet ab {Datum}» auf Wohnungsseite, Wohnungsliste, Gebäudekarten, Gebäudeseite und Übersicht mit denselben Worten (`reletParts`). Tests: Unit, DOM und E2E (apartment-detail, apartments, buildings, dashboard).
  - Mieter «Künftig»: Backend `isFuture`, Filter `future`, `inactive` ohne künftige Verträge (`tenant-status.pg.test.ts` mit Fall «Wieder», V-3). Liste und Badge: `tenant-list.test.ts`, `tenant-detail.test.ts`, E2E «Künftiger Mieter».
  - «Aktiv» nur mit laufendem Mietvertrag: Backend-Test und E2E «Aktiver Mieter» (jetzt mit Beginn 2014).
  - `tests/contracts/tenants.json` hat `isFuture`.
  - Restpunkt: C-4 (Assistent).
- **Fachreview V-2:** Der Wortlaut «… gibt es in Dwello keine …» ist in allen vier Sprachen übernommen.
- **Rote Tests (nach Lesen beurteilt):** Jeder neue Unit-, DOM- und pg-Test prüft Texte, Felder oder Testids, die es vor e2ca0f2 nicht gab, und schlägt ohne die Änderung fehl. Bei den E2E-Szenarien gilt das ebenso, mit einer Ausnahme: Im Szenario «Löschdialog eines beendeten Mietvertrags nennt seine Abrechnungen» besteht der erste Dann-Schritt («abgerechnet in:») schon auf dem alten Text. Rot wird das Szenario erst durch «verlinkt der Dialog …». Das ist in Ordnung.
- **Screenplay:** Die Schritte rufen nur Tasks und Questions auf. Die Questions geben Text oder `href` zurück, nicht ja/nein. Die Features nennen keine «klickt», «Button» oder «Feld». Die Strenge der bestehenden Szenarien ist gleich geblieben: «Aktiver Mieter» wurde gemäss #58 angepasst, die Dashboard-Kennzahl umbenannt.

## Nicht bestätigt

Diese Prüfungen hat der Aufrufer gemeldet. Ich habe keine davon erneut ausgeführt:
- `bun run lint`, `bun run check`, `cd backend && bun run type-check`
- `bunx vitest run` (2692 Tests)
- Backend `tenant-status.pg`, `apartment-status.pg` und `api-contracts.pg`
- E2E chromium für apartment-detail, apartments, buildings, contract-detail, dashboard und tenants (101 bestanden)
- accessibility und sprachen-bildschirme für die genannten Bildschirme (62 bestanden), also 0 axe-Verletzungen und kein Deutsch in fr/it/en

Ausserdem:
- Ob der Bildschirmzustand `contract-detail-ended/delete-dialog` wirklich den Text «keine Nebenkostenabrechnung» zeigt: Laut Seed in `tests/e2e/fixtures/screens.ts:84-86` hat Emil keine Abrechnung, das ist plausibel. Gesehen habe ich es nicht.
- Kein horizontales Scrollen bei 390 px, wenn in der Belegungszeile der Übersicht mehrere «Wohnung … leer seit …» stehen: `BuildingFigures.svelte` hat `flex-wrap`, nicht gemessen.
- Die Übersetzungen fr/it/en habe ich nur gegen `i18n-begriffe.md` gelesen, nicht fachlich geprüft.
