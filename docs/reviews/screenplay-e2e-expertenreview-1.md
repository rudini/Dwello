Unabhängiger Screenplay-Spezialist, Stand c632714 (Branch claude/screenplay-e2e). Bericht unverändert abgelegt.

## Gesamturteil

Die Umsetzung ist eine tragfähige, schlanke Screenplay-Implementierung, die ein Team erweitern kann. Der Kern (`tests/e2e/screenplay/`, rund 470 Zeilen) ist klein und hält zusammen. Questions liefern Werte statt Locators, `sees` = `expect.poll` ersetzt die Web-first-Assertions sauber. `throughUiOrApi` entfernt die `if (driver === 'api')`-Verzweigungen, die in der alten Fassung in den Steps standen. Targets tragen deutsche Fachnamen, und die Features sprechen überwiegend Fachsprache.

Die Schwächen liegen woanders als im Kern:
- Ja/Nein-Questions zeigen beim Fehlschlag nicht mehr, was die Seite tatsächlich zeigt. Das ist ein Rückschritt gegenüber `toContainText`.
- Der API-Pfad der Abrechnungserstellung prüft teilweise eine Kopie der BFF-Logik im Testcode.
- Die Lint-Regeln sind syntaktische Namens-Sperrlisten mit Fehlalarmen und erzwingen Umwege.
- Der Struktur-Test ist im aktuellen Checkout rot.

`npx eslint tests/e2e` ist sauber (Exit 0), `tsc` meldet keine Fehler in `tests/e2e`. `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts` schlägt fehl: 3 von 109 Tests rot.

## Findings

### M-1 (Major) Ja/Nein-Questions verlieren den tatsächlichen Wert
**Beleg:**
- `tests/e2e/questions/statement-generate.ts:176-229`: `textOfRowContains`, `statementsCreated`, `balanceShown`, `totalCostsShown` liefern `Boolean(text.includes(...))`.
- `tests/e2e/questions/statement-detail.ts` (`heatingCostsShared`): `text.includes(share) && text.includes(amount)`.
- Die Steps prüfen dann mit `.toBe(true)`, etwa `steps/statement-generate.steps.ts` bei «wurden {int} Nebenkostenabrechnungen erstellt», «beträgt der Saldo», «kostet die Abrechnung».

**Folge:** Beim Fehlschlag meldet Playwright nur «Expected: true, Received: false». Die alte Fassung (`git show f1a2f83:tests/e2e/steps/statement-generate.steps.ts`, Zeilen 127 und 132) nutzte `toContainText(...)` und zeigte den tatsächlichen Text. Gerade bei Beträgen und Saldi, also dem fachlich heikelsten Teil, geht so die Diagnose verloren.

**Empfehlung:**
- Die Question soll den Wert liefern und der Matcher vergleichen: `Text.of(previewRow(name))` mit `.toContain(saldo)`.
- Bei API-Questions soll die Zahl zurückkommen: `remembered(PREVIEW_BALANCES).get(name)` mit `.toBe(signedFrancs)`.
- Wo UI und API verschiedene Darstellungen haben, sollen beide Pfade eine gemeinsame Form liefern, zum Beispiel die Zahl in Franken (UI per `francs()` geparst). Dann gilt ein Matcher für beide Treiber.
- Allgemeine Regel in `tests/e2e/CLAUDE.md`: keine Ja/Nein-Question, die einen Text oder eine Zahl zusammenfasst. Ja/Nein nur für echte Zustände wie Sichtbarkeit, Aktivierung oder Häkchen.

### M-2 (Major) Der API-Treiber der Abrechnungserstellung kopiert eine Fachregel des BFF und prüft teilweise sich selbst
**Beleg:**
- `tests/e2e/tasks/statement-generate-api.ts:14-38` wählt die Verträge aus: Periode überschneidet sich, noch keine Abrechnung in der Periode. Das ist im Kern derselbe Code wie `contractsInPeriod` in `src/lib/server/statement-generation.ts:45-66`.
- `statement-generate-api.ts:64` merkt sich `contracts.length` als Zahl der «erstellten» Abrechnungen. `questions/statement-generate.ts:211` vergleicht genau diese Zahl.

**Folge:** Im Projekt `api` prüfen «die Vorschau enthält genau N Abrechnungen», «meldet …, dass es in der Periode keine Mietverträge gibt» und «wurden N … erstellt» den Filter des Tests, nicht das System. Ändert sich die Regel im BFF, bleibt der API-Lauf grün. Das gab es schon vor dem Umbau (`createdStatements` in f1a2f83); der Umbau hat es übernommen.

**Empfehlung:**
- Kurzfristig die Zahl der erstellten Abrechnungen aus dem System lesen, per `GET statements?buildingId=…` vorher und nachher, statt `contracts.length` zu verwenden.
- Die Fragen nach der Vertragsauswahl (`statementsInPreview`, `noContractsInPeriod`, `previewHasStatementOf`) als reine UI-Fragen kennzeichnen, oder die Auswahl in einen Backend-Endpunkt verschieben. Dann sitzt die Fachregel auch dort, wo `CLAUDE.md` sie verlangt («all business logic in backend/src/services»).
- Das Thema gehört als Issue erfasst.

### M-3 (Major, nur lokal) Struktur-Test im aktuellen Checkout rot
**Beleg:** `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts` zeigt 3 rote Tests: «hat in tests/e2e nur die Schichtordner», «… nur TypeScript, Szenarien und Doku», «hält den Screenplay-Kern bei seinen fünf Dateien …». Auslöser ist der git-ignorierte Cache `tests/e2e/.fallow/` (vom Werkzeug fallow angelegt, Zeitstempel 07:52). Der Test liest das Dateisystem (`readdirSync`, Zeilen 180-205), nicht git.

**Folge:** In diesem Checkout scheitert das Pflicht-Gate `bun run test:coverage`. Der Fehler kommt durch eine Datei, die nie eingecheckt wird; CI auf einem sauberen Checkout ist nicht betroffen.

**Empfehlung:** Den Test auf `git ls-files tests/e2e` umstellen, oder ignorierte Pfade (Punkt-Ordner, `.gitignore`) überspringen.

### Minor
- **m-1 Lint-Sperrlisten nach Methodennamen geben Fehlalarme und erzwingen Umwege.** Gesperrt sind unter anderem `path|content|check|clear|type|focus|locate|context`, in Questions zusätzlich `delete|remove` und alle Schleifen, dazu Zugriff mit berechnetem Namen (`eslint.config.js:10-13, 30-33, 314-317`). `Map.delete`, `names.clear()` oder eine `for`-Schleife in einer reinen Berechnung werden abgelehnt. Belegter Umweg: `tasks/accessibility.ts:224` («a lookup, then a call: lint refuses calls by computed name»). Zehn Review-Runden fast nur zu Lint deuten auf ein Wettrüsten. Empfehlung: Die Grenzen über Typen statt Namen ziehen. `Target.locate` sollte nicht öffentlich einen `Locator` liefern; der Kern hält ihn privat, dann braucht es keine Sperrliste von Playwright-Methoden. Danach Regeln streichen, die nur Schleifen und Namen sperren.
- **m-2 Gedächtnis mit Schlüsseln als Strings, ohne Typprüfung.** `actor.recall<T>` castet ungeprüft (`screenplay/actor.ts:55`). `'findings'` steht als Literal in `questions/accessibility.ts:8` und als Konstante in `tasks/accessibility.ts:44`. Empfehlung: typisierte Schlüssel (`const FINDINGS = key<string[]>('findings')`), an einer Stelle definiert; `recall` soll bei einem fehlenden Schlüssel mit einem klaren Fehler abbrechen.
- **m-3 `sees` pollt auch über Werte, die sich nicht ändern.** Betroffen sind das Gedächtnis (`findings`, alle API-Questions, `DownloadedFile`) und Ergebnisse, die schon fertig gesammelt sind. Beim Fehlschlag wartet der Test die ganzen 5 s Expect-Timeout und fragt dabei nur dieselbe Map ab. Das passt nicht zur Doku, die verspricht, dass `sees` so lange nachfragt, bis die Erwartung hält. Empfehlung: `sees(q, { timeout: 0 })` oder eine eigene Einmal-Prüfung (`actor.ensures(q)`, Prinzip `Ensure` aus Serenity/JS) für Questions über Gedächtnis.
- **m-4 Negativprüfungen sind nur per Konvention verankert.** `statement-reminder.feature:22` prüft «bietet die Abrechnung keine Mahnung an» (`Count.of(...)` ergibt 0) ohne positiven Anker und wäre auch auf einer Fehlerseite grün. Das gab es schon vorher. Empfehlung: den Anker in den Step legen, wie es `steps/dashboard.steps.ts:176` vormacht, oder Zähl-Questions null liefern lassen, solange das Seitengerüst fehlt.
- **m-5 Zwei Klicks auf «Weiter» ohne Synchronisation dazwischen.** Belegt in `tasks/contract-form.ts:74` (bei `confirmPastStart`) und `tasks/accessibility.ts:72` (`Click.on(nextButton), Click.on(nextButton)`). Das birgt Flake-Gefahr, wenn ein Schritt asynchron prüft. Empfehlung: Zwischen den Schritten auf ein Element des Zielschritts warten (`Wait.until`), wie es `contractWizardSteps` bereits tut.
- **m-6 `filterInvoices` wartet nicht auf das Ergebnis.** `searchInvoices` wartet per `Wait.forUrl`, `filterInvoices` nicht (`tasks/invoices.ts:16-31`). Empfehlung: dieselbe Synchronisation verwenden.
- **m-7 Testdaten-Auflösung in den Steps wiederholt.** `names.get(x) ?? x` steht 57-mal in den Steps, `seed.idOf(x)!` 56-mal. Empfehlung: Helfer im Fixture (`seed.nameOf`, `seed.id`), der bei unbekanntem Namen laut scheitert statt `undefined!` weiterzugeben.
- **m-8 Steps machen Umrechnungen.** Sie leiten das Vorzeichen des Saldos aus «Rückerstattung» ab und parsen Franken (`steps/statement-generate.steps.ts`, «beträgt der Saldo»); `francs` liegt in `tasks/statement-generate-api.ts:68` und wird von Steps und `questions/statement-detail.ts` importiert. Hängt mit M-1 zusammen: Die Umrechnung gehört in die Question.
- **m-9 Mechanik des Assistenten im Gherkin, und viele Tasks sind nur Aliase.** Formulierungen wie «weitergeht», «zum Schritt … zurückgeht», «eintippt», «im Feld» sind teils gewollt (Formularverhalten), driften aber zur UI. 72 von 221 exportierten Tasks sind reine Aliase einer einzigen Interaktion (`Click.on`, `Check.the`, `Navigate.to`). Das ist im Screenplay zulässig, aber `tryNextWithoutConfirmation = goToNextStep` zeigt, dass der Name die Arbeit macht, nicht die Task.

### Nit
- `single()` zählt zuerst und liest dann. Verschwindet das Element dazwischen, liefert `evaluateAll` `[]` und `Text.of` `undefined` statt `null` (`screenplay/questions.ts:176-187`).
- `Wait.until` nutzt `.first()` und ist damit nicht strikt; die Questions sind strikt (`screenplay/interactions.ts:106`). Das ist uneinheitlich.
- `throughUiOrApi`: `toString` nennt nur die UI-Seite. Ein Actor mit beiden Abilities nähme immer die API (`screenplay/abilities.ts:104-107`).
- `fixtures/test.ts:23-41`: Der `page`-Fixture legt einen Wegwerf-Actor an. `verwalter` und `besucher` teilen sich dieselbe Page, sodass `besucher` die Cookies des Verwalters löscht. Heute kommen die beiden nicht im selben Szenario vor; das sollte dokumentiert sein.
- `targets/accessibility.ts:5-40` nutzt CSS-Selektoren, entgegen der Repo-Konvention «no CSS selectors in tests». Für generische Bildschirmprüfungen ist das vertretbar, die Ausnahme sollte aber dokumentiert werden.
- `fixtures/screens.ts:85`: lange Inline-Liste von Zuständen in einer Zeile. Besser als Eigenschaft in `screens.json` führen.
- `steps/contract-form.steps.ts:157-161`: Ein `Then` führt eine Task aus (Suche). Das sollte ein `When` sein, oder die Question sollte selbst suchen.
- `openStatementWizard` ist im API-Pfad ein `async () => {}` ohne Wirkung (`tasks/statement-generate.ts:26`). Das ist ehrlich, sollte aber kommentiert sein.
- Assertions in Interactions (`EnterDate` mit `expect(...).toHaveValue`, `Wait.forValue`, `Wait.forCount`) dienen zur Synchronisation. Das ist in Ordnung, steht aber nicht in `CLAUDE.md`.

## Stärken
- Kleiner, verständlicher Kern: `Actor` mit `attemptsTo`/`answer`/`sees`/`remember`, Abilities als Protokolltreiber nach Farley, Interactions und Web-Questions mit sprechenden Beschreibungen. Die Meldungen von `expect.poll` lauten «Liegenschaftsverwalter sees the text of Mieterauswahl».
- Questions antworten mit drei Zuständen: Ein fehlendes Element ergibt `null`, nicht `false`. So können «nicht aktivierbar» oder «nicht angehakt» nicht auf einer leeren Seite durchrutschen (`Enabled.of`, `Checked.of`).
- `Text.of` normalisiert Leerraum wie `toHaveText` und verlangt genau einen Treffer wie der Strict Mode von Playwright.
- `throughUiOrApi` hält die Wahl des Treibers aus den Steps heraus. Das ist eine klare Verbesserung gegenüber den `if (driver === 'api')`-Zweigen in f1a2f83.
- Die Hydration ist ausdrücklich modelliert (`Navigate.to` wartet auf `body[data-hydrated]`, `Click.toReload`); `Navigate.toWithScriptsHeldBack` macht den Wettlauf mit der Hydration testbar.
- Die Barrierefreiheitsprüfung sammelt jetzt alle Ansichten mit Präfix (Viewport, Schema), statt beim ersten Fehler abzubrechen. Das erleichtert die Diagnose.
- Die Features sprechen überwiegend die Fachsprache (Liegenschaftsverwalter, Mietvertrag, Saldo, Akonto, Verwaltungspauschale), und die Targets sind deutsch und fachlich benannt.
- `tests/e2e/CLAUDE.md` erklärt die Schichten mit Tabelle und durchgängigem Beispiel gut.

## Nicht geprüft
- Kein E2E-Lauf (laut Vorgabe). Die 629 grünen Szenarien und die Flake-Raten unter Firefox und WebKit habe ich nicht selbst gesehen.
- Nicht alle 45 Features, 32 Step-Dateien und Targets gelesen, nur eine Stichprobe: contract-form, statement-generate (mit API-Pfad), statement-detail, accessibility/language, dashboard, invoices, Fixtures, Kern.
- Ob der Lint-Beweistest jede Regel positiv und negativ abdeckt, habe ich nicht einzeln geprüft.
- `backend.ts` (Testdaten und Aufräumen) nur überflogen. Isolation und Aufräumen bei parallelen Läufen habe ich nicht untersucht.
