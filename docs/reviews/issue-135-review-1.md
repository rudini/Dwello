# Code-Review #135, Runde 1

Geprüft: `039eb29..9952d96` (43c63ad Szenarien, 9952d96 Umsetzung) im Worktree `review-135-code`. Gelesen: alle 28 geänderten Dateien, dazu `hooks.server.ts`, `src/lib/api.ts`, `wizard-draft.ts`, `accounting-period.ts`, `StatementWizard.svelte`, `StatementStep.svelte`, `generate/+page.server.ts`, `tests/e2e/fixtures/screens.ts` und `tests/e2e/CLAUDE.md`. Issues #135, #199 und #200 per `gh api` gelesen; #199 und #200 sind offen und haben die Labels `fachlich` und `entscheiden`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Blocker | src/routes/statements/generate/BuildingStep.svelte:48, src/__tests__/statement-wizard.dom.test.ts:918-923 | Der DOM-Testlauf endet mit Exit 1: «Unhandled Rejection: TypeError: data.map is not a function». Damit scheitern `test:coverage` und CI. |
| C-2 | Major | tests/e2e/tasks/accessibility.ts:255-256 | Der a11y-Zustand `buildings-billed` hängt vom heutigen Datum ab (Standardperiode = letzte abgelaufene). Ab dem 1.1.2027 schlagen die axe- und Sprachzeilen fehl. |
| C-3 | Minor | src/routes/api/statements/billed/+server.ts:6-13; BuildingStep.svelte:41-49 | Die neue BFF-Route hat keinen Test auf unterer Ebene (Query-Parsing, leere `buildingIds`) und fängt keinen Fehler ab. Scheitert das Backend, kommt eine generische 500 zurück, und Schritt 2 zeigt stillschweigend nichts an. Der Nutzer erfährt dann wieder nicht, dass schon Abrechnungen bestehen. Die anderen Routen in `api/statements` nutzen `handleProxyError`. |
| C-4 | Minor | src/lib/server/statement-generation.ts:53-54 | `buildingId` kommt jetzt direkt aus einem GET-Query-String und geht unkodiert in die Backend-URL (`contracts?buildingId=${buildingId}&…`). `invoicesInPeriod` (gleiche Datei) nutzt `encodeURIComponent`. Das Muster gab es schon vorher, die neue Route macht es aber zusätzlich erreichbar. |
| C-5 | Minor | src/routes/statements/generate/StatementWizard.svelte:99-103 | Zurück von «Rechnung erfassen» (`?schritt=3`) springt der Assistent auf Schritt 3, auch wenn Gebäude weggefallen sind. Der neue Hinweis sagt dann «Prüfen Sie die gewählten Gebäude», Schritt 2 wird aber übersprungen. |
| C-6 | Nit | src/lib/server/statement-generation.ts:44-47 | Der Kommentar «Every contract … gets its own statement …» beschreibt `contractsInPeriod`, steht jetzt aber über `type Run` und dem TODO. Von der Funktion ist er durch `contractsOf` getrennt. |
| C-7 | Nit | tests/e2e/tasks/accessibility.ts:247-250 | Der Zustand `draft-dropped` übernimmt Schlüssel und Format des Entwurfsspeichers (`dwello.draft.v1.statements`, `{values, savedAt}`) aus `src/lib/wizard-draft.ts` in den Test. Ändert sich das Format, scheitert der Test, ohne dass das Verhalten falsch ist. |

## C-1 (Blocker): unbehandelte Rejection im DOM-Test, Exit 1

**Warum falsch.** `BuildingStep.svelte` sendet jetzt bei jedem Öffnen von Schritt 2 auch `GET /statements/billed`. Der bestehende Test «sagt bei jedem Gebäude, ob für die Abrechnungsperiode Rechnungen erfasst sind» (`statement-wizard.dom.test.ts:920`) beantwortet aber jeden Aufruf mit `{ invoices: [...], total: 3 }`. Diese Antwort ist kein Array. `data.map` in `BuildingStep.svelte:48` wirft deshalb in einem `.then` ohne `catch`. Der Diff hat den Test nur bei den gezählten Aufrufen angepasst (`invoiceCalls`, Zeile 935), nicht bei der Antwort. Die Tests selbst sind grün. Vitest meldet die Rejection aber als «Errors 1 error» und endet mit Exit-Code 1. Damit scheitern `bun run test:coverage` und der CI-Job.

**Nachweis.** `bunx vitest run src/__tests__/statement-wizard.dom.test.ts; echo $?` zeigt im Worktree auf 9952d96 `exit=1`. Die Ausgabe lautet «Unhandled Rejection … TypeError: data.map is not a function ❯ src/routes/statements/generate/BuildingStep.svelte:48:48 … The last test to run before this error was "sagt bei jedem Gebäude, ob für die Abrechnungsperiode Rechnungen erfasst sind"». Gemeldet war: «the affected unit and DOM tests pass».

**Behebung.** Der Fake dieses Tests soll `/statements/billed` mit einem Array beantworten, so wie der neue `describe`-Block (`billed(...)`, Zeile 204). Nur den Test anzupassen genügt dafür. Danach `test:coverage` erneut laufen lassen.

## C-2 (Major): `buildings-billed` hängt vom Datum ab

**Warum falsch.** Der Zustand klickt nur auf «Weiter» und wartet dann auf `generate-building-billed-<Seeblick>` (`tasks/accessibility.ts:255-256`). Er übernimmt also die vorgeschlagene Abrechnungsperiode. Diese berechnet `lastCompletedPeriod(... today = new Date())` (`src/lib/accounting-period.ts:9`) aus dem heutigen Datum. Heute ist das 2025. `seedFor` (`tests/e2e/fixtures/screens.ts`) legt Abrechnungen aber nur für 2023, 2024 und 2025 an. Ab dem 1.1.2027 schlägt das System 2026 vor, und Seeblick hat dann keine Abrechnung in der Periode. Das Element erscheint nicht, `Wait.until` läuft in den Timeout, und beide Zeilen von `buildings-billed` in `accessibility.feature` und `sprachen-bildschirme.feature` werden auf `main` rot, ohne dass sich etwas geändert hat. Die übrigen Wizard-Zustände geben das Jahr ausdrücklich ein (`previewOf('2025', …)`, Zeilen 80-91).

**Nachweis.** Den E2E-Lauf der Zeile `statement-generate | buildings-billed` mit einer Systemzeit im Jahr 2027 starten: Die Wartebedingung läuft in den Timeout. Ohne Lauf zeigt es die Codekette: Zeile 256 gibt kein Jahr ein, `lastCompletedPeriod` nutzt `new Date()`, und der Seed hat keine Abrechnung 2026.

**Behebung.** Das Jahr 2025 vor dem Klick eingeben, wie in `previewOf` (`EnterDate.of('2025-01-01')…`, `EnterDate.of('2025-12-31')…`, dann `Click.on(nextButton)`).

## Bestätigt

- `restoredSelection` gibt `{ selection, dropped: { buildings, heatingProfile } }` zurück. Belegt durch den Unit-Test (`statement-wizard.test.ts:359-374`, auch ohne gewähltes Heizprofil) und die DOM-Tests (Einzahl, Mehrzahl, Heizprofil, nichts weggefallen). Der Hinweis erscheint in `DraftNotice` (`draft-note`).
- Die Zählung in Schritt 2 nutzt dieselbe Regel wie Vorschau und Lauf: `contractsOf` wird gemeinsam genutzt (`statement-generation.ts:49-82`). Gezählt werden verschiedene Mietverträge (Set der `contractId`, gefiltert auf `inPeriod`). Belegt durch den Unit-Test (zwei Abrechnungen eines Vertrags zählen einmal, eine aus einer früheren Periode zählt nicht). Die Fälle «alle abgerechnet» (Einzahl und Mehrzahl) und «Teil, Einzahl» sind mit DOM-Tests belegt. Bei 0 abgerechneten Mietverträgen erscheint kein Text.
- Die Route ist durch `hooks.server.ts` geschützt (ohne Sitzung 401 für `/api/`). Als GET braucht sie kein XSRF. Das JWT geht über `handleFetch` nur ans Backend. An den Client gehen nur Zahlen.
- Die 7 neuen Schlüssel stehen in allen vier `messages/*.json`, mit Sie/vous/Lei und den Begriffen aus `i18n-begriffe.md` (contrat de bail, contratto di locazione, rental contract, période de décompte / periodo di conteggio).
- Die neuen Zustände `draft-dropped` und `buildings-billed` stehen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`.
- Die Szenarien in `statement-generate.feature` entsprechen «Done means» von #135. Die Steps rufen nur Tasks, Questions und `seed` auf. Die Questions geben Text zurück. Die Features enthalten keine UI-Wörter.
- Der Marker `TODO(fachlich prüfen, #199)` nennt ein offenes Issue.
- Plan: Es gibt nur eine Session. Die Zeilen `Scenario red`, `Test red` und `Skills: tdd, ponytail, ponytail-review` sind vorhanden.
- Ausser den Tests des Wizards hat der Diff keinen Code geändert, der nicht zur Anforderung gehört. Die Änderung am bestehenden DOM-Test (Filter auf `/invoices`) war nötig, siehe aber C-1.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet; ich habe sie nicht wiederholt:
  - lint 0, check 0, `deepcheck:audit` ohne Ausgabe, fallow audit sauber;
  - backend test 607 pass, backend type-check 0;
  - E2E chromium 18 passed.
- `test:coverage` 2428 passed: ebenfalls vom Aufrufer gemeldet, aber auf dem Commit vor 9952d96. Mein Lauf von `statement-wizard.dom.test.ts` auf 9952d96 endet mit Exit 1 (C-1). Deshalb ist auch der gemeldete Coverage-Lauf für diesen Commit nicht bestätigt.
- Selbst wiederholt: `bunx vitest run src/__tests__/statement-wizard.test.ts src/__tests__/statement-wizard.dom.test.ts src/__tests__/statement-generation.test.ts`. Ergebnis: 84 Tests grün, 1 unbehandelter Fehler, Exit 1.
- Ob die Szenarien vor der Umsetzung rot waren, habe ich nur an den Plan-Zeilen gesehen, nicht selbst nachgestellt.
- Die Wortwahl der fr-, it- und en-Texte habe ich nur gegen `docs/design/i18n-begriffe.md` und die vorhandenen Schlüssel geprüft, nicht mit einer Übersetzung.
