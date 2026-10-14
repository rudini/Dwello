# Code-Review #121 (B-2), Runde 3: Fixes aus Runde 2, Persona-Befunde P-1 und P-2

Geprüft: `f3e6c68..0049589` im Worktree `review-b2-r3`. Alle 17 geänderten Dateien des Deltas habe ich gelesen. Dazu kamen die offenen Befunde aus `docs/reviews/b2-review-2.md` und die Persona-Berichte `docs/design/personas/{helga,marco}-b2.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-17 | Major | `tests/e2e/features/contract-detail.feature:184-194`, `statement-generate.feature:155-164` | Persona P-1 ist ein Fix, den der Benutzer sieht: Die Status-Kacheln zählen jetzt über die Filter der Liste. Kein Szenario prüft eine Kachelzahl, und im Plan steht kein `Scenario red` dafür |
| C-18 | Minor | `implementation_plan.md:62-70` | Im Stand `0049589` fehlen mehrere Zeilen: `code-reviewer round 2 (docs/reviews/b2-review-2.md): fixed …, rejected C-15: <Grund>`, die Zeilen der Personas Helga und Marco (round 1: fixed P-1/P-2, open → U-25) und `Test red` für die neuen Tests (Zählung `statement-list-contract.pg.test.ts:52`, `urls[1]` in `statement-list-load.test.ts:129`, Reihenfolge `statement-pages.dom.test.ts:72`, `periodEnd` allein `:108`, ungültiges Datum `statement-list-load.test.ts:201`). Der Aufrufer schreibt, die Triage stehe im Plan. Im geprüften Commit steht sie nicht |
| C-19 | Minor | `docs/api-specification.md:207` | `/counts` nennt als Query weiterhin nur `buildingId`. Die Route nimmt jetzt `search`, `contractId`, `buildingId`, `periodStart` und `periodEnd` an (`backend/src/routes/statements.ts:79-85`). Derselbe Befund wie C-5 aus Runde 1 |
| C-20 | Minor | `backend/src/__tests__/statement-list-contract.pg.test.ts:52-59` | Die neue Zählung wird nur für `draft` und `total` unter `contractId` getestet. Die Aufteilung `sent` und `overdue` prüft kein Test, weder vor noch nach dem Umbau von drei Abfragen auf eine. Ebenso fehlt ein Test für den Gebäude- und den Suchfilter, die jetzt neu gezählt werden. Dass `status` aus der Zählabfrage entfernt wird (`+page.server.ts:57`), prüft auch kein Test: Der Load-Test mit `status=sent` (`statement-list-load.test.ts:40`) prüft `urls[1]` nicht |
| C-21 | Minor | `docs/design/offene-punkte.md:31` (U-25) | Helga P-7 (neue Entwürfe ohne Link «PDF», ältere schon) ist ein funktionaler Punkt (Verhalten oder Fehler der App). Er gehört in ein Issue, nicht in die nicht-funktionale Liste (CLAUDE.md, «Open work») |
| C-22 | Nit | `src/routes/statements/+page.server.ts:47,49` | Neue Zeilen sind länger als 100 Zeichen und nicht mit Prettier formatiert. In `f3e6c68` war Zeile 47 noch formatiert (`prettier --check` meldet die Datei) |
| C-23 | Nit | `src/routes/statements/+page.server.ts:49-50` | Die Regex prüft nur die Form. `?periodStart=2024-13-45&periodEnd=…` ergibt weiterhin «Invalid Date» im Satz (Rest von C-14; nur über eine von Hand gebaute URL erreichbar) |
| C-24 | Nit | `src/__tests__/statement-list-load.test.ts:15` | Die Counts-Antwort in den Load-Tests ist erfunden (`{ draft: 2, overdue: 1 }`), in den neuen Tests ist es `period-statements.json`. Für `/statements/counts` gibt es keinen Contract in `tests/contracts/` (Gotcha «API contracts»). Das war schon vor dem Delta so; das Delta ändert aber die Abfrage dieses Endpunkts |

## C-17 (Major): Persona-Fix P-1 ohne Szenario

**Warum falsch:** CLAUDE.md, Workflow 1: Jede Verhaltensänderung, auch ein sichtbarer Bugfix, beginnt mit einem Szenario in `tests/e2e/features`. Der Plan hält es mit `Scenario red: …` fest. Laut Helga und Marco ist P-1 ein Major. Die Kachel «9 Entwurf» führt zu «1 Abrechnung». Nach dem Fix zeigen die Kacheln andere Zahlen. Das Delta ändert keine Datei unter `tests/e2e/` ausser zwei Tabellenzeilen für axe und i18n. Die Szenarien «Abrechnungen eines Mietvertrags anzeigen» und «Nach dem Erstellen die Entwürfe der Abrechnungsperiode anzeigen» prüfen nur den Satz und die Zeilen der Liste, keine Kachelzahl. Die Tests auf tieferer Ebene (pg-Test für `contractId`, Load-Test der URL) zeigen nicht, dass die Seite die richtige Zahl zeigt. Ein Rückfall im BFF-Mapping oder im Durchreichen der Filter (z. B. `counted` wieder ohne Query) bliebe in E2E grün.

**Wie man es zeigt:** `git diff f3e6c68..0049589 --stat -- tests/e2e` zeigt nur `accessibility.feature` und `sprachen-bildschirme.feature`. Wenn man in `+page.server.ts:60` die Query `?${counted}` entfernt (alter Stand), bleiben alle Szenarien grün. Nur `statement-list-load.test.ts:129` wird rot.

**Fix:** Eines der beiden Szenarien bekommt einen Schritt, der die Zahl einer Status-Kachel als Wert abfragt, z. B. «Und zählt der Statusfilter 1 Entwurf», über eine Question. Das Szenario zuerst ohne den Fix rot laufen lassen und `Scenario red: …` im Plan notieren.

## Runde-2-Befunde

| ID | Status | Nachweis |
|----|--------|----------|
| C-10 (Major) | behoben | `git diff bd2e94f..0049589 -- src/__tests__/statement-wizard.test.ts` enthält nur noch den Import `draftsLink` und den neuen `describe` |
| C-11 (Minor) | teilweise | Die Zeile zu Runde 1, `Test red` für Slice 2, die Haken und C-9 (`FILTERS`/`backendQuery` wegen des Fallow-Gates) stehen jetzt in `implementation_plan.md:63-67`. Was zu Runde 2 und zu den Personas fehlt, siehe C-18 |
| C-12 (Minor) | behoben | `+page.svelte:32-34` und `StatementSearch.svelte:28-30` prüfen auch `periodEnd`. DOM-Test `statement-pages.dom.test.ts:108-113` |
| C-13 (Minor) | behoben | Bildschirm `statements-period` (`screens.json:328-337`) mit Periode in der Query. Zeilen in `accessibility.feature:101` und `sprachen-bildschirme.feature:102`. Laut Aufrufer grün |
| C-14 (Minor) | behoben, Rest C-23 | Regex in `+page.server.ts:49`, Test `statement-list-load.test.ts:201-211` |
| C-15 (Nit) | abgelehnt | Im geprüften Commit steht der Grund nicht im Plan (C-18) |
| C-16 (Nit) | behoben | `periodStart`/`periodEnd` als zwei Konstanten (`+page.svelte:30-31`) |

## Bestätigt durch Code und Test

- **P-1, Zählung = Liste je Status:** `getStatementCountsByStatus` (`statement.service.ts:546-575`) nutzt dieselben `statementFilterConditions` wie `listStatements`. Das Feld `status` ist per Typ ausgeschlossen (`Omit<StatementFilters, 'status'>`), und die Route nimmt es nicht an. Dazu kommen dieselben Joins `tenants` (Suche) und `apartments` (Gebäude). Jede Kachel zählt mit `count(*) filter (where statusCondition(s))`, also mit derselben Bedingung, die die Liste beim Klick auf die Kachel anwendet. `sent` schliesst überfällige aus (Frist ≥ heute oder leer), `overdue` ist `sent` mit Frist < heute. Das ist gleichwertig zu den drei alten Abfragen. `total` zählt wie vorher alle Status. Die Imports `lt`, `gte` und `or` werden in `statusCondition` weiter gebraucht.
- **Keine alten Aufrufer:** `getStatementCountsByStatus` wird nur in `backend/src/routes/statements.ts:76` aufgerufen, `/statements/counts` nur in `src/routes/statements/+page.server.ts:60` (grep über `src`, `backend`, `tests`).
- **BFF:** Die Zählabfrage nimmt dieselben Parameter wie die Liste, ohne `limit`, `offset` und `status` (`+page.server.ts:55-60`). Test für `contractId`: `statement-list-load.test.ts:129`. Schlägt die Zählabfrage fehl (z. B. ungültiges Datum), zeigt die Seite überall 0 (`countsData.draft || 0`). Dazu passt die leere Liste.
- **P-2:** Der Satz steht vor `StatusFilter` und `StatementSearch` (`+page.svelte:101-125`). Der DOM-Test `statement-pages.dom.test.ts:71-79` prüft die Reihenfolge in der DOM-Struktur. Das ist die tiefste Ebene, die das zeigen kann.
- **Sicherheit:** Die neuen Query-Parameter landen im Backend nur parametrisiert in Drizzle-Bedingungen (`ilike` mit Bind-Wert). Zum Client gelangt nichts Neues.
- **Texte:** Das Delta ändert keine UI-Texte. `messages/*.json` sind unverändert.
- **Neu ausgeführt:** `bunx vitest run` auf `statement-list-load`, `statement-pages.dom` und `statement-wizard`: 106 bestanden.

## Nicht bestätigt

- Lint, `bun run check`, `deepcheck:audit`, `bun run test:coverage` (2308), Backend `bun run test` (553) und `type-check`, E2E chromium (92 sowie 2 Zeilen von `statements-period`): vom Aufrufer gemeldet, nicht wiederholt.
- Den pg-Test `statement-list-contract.pg.test.ts` habe ich nicht ausgeführt, weil er die Testdatenbank neu anlegt. Gleichwertigkeit von `sent` und `overdue` mit der Liste: nur aus dem Code abgeleitet (`statement.service.ts:70-84`), nicht durch einen Test belegt (C-20).
- Ob Elysia unbekannte Query-Parameter wie `status` auf `/counts` verwirft oder ablehnt: nicht ausgeführt. Der BFF schickt `status` nicht mit.
- Triage zu Runde 2 und zu den Personas: Laut Aufrufer steht sie in `implementation_plan.md`. Im Commit `0049589` habe ich sie nicht gefunden (`grep "C-15\|b2-review-2\|helga-b2"` findet nur die Dateiliste). Möglicherweise steht sie im Arbeitsbaum des Aufrufers und ist nicht committet.
