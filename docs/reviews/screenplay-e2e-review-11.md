## Schluss-Review 5 (Endstand): Screenplay-E2E, `git diff origin/main...HEAD` (HEAD c632714)

**Ergebnis:** Kein Blocker, ein Major (zu Punkt 2), dazu mehrere Minor.
- Der Umbau ist vollständig (Punkt 1).
- Alle Major aus den Reviews 1 bis 10 sind in der gemeldeten Form behoben (Punkt 3). Einige Sätze im Archiv sind weiter gefasst, als der Lint trägt (Minor).
- Ein Step kann weiterhin mit gewöhnlichem Code in einer Schleife nachfragen: `try/catch` bzw. `.catch` um `sees`, dazu ein Neuladen (M-1). Das ist dieselbe Klasse wie R10 M-2, nur mit `sees` statt `answer`.

| Punkt | Urteil | Beleg (Kurzform) |
|---|---|---|
| 1. Alle Bereiche im schlanken Screenplay | **erfüllt** | Siehe «Punkt 1 im Einzelnen». Ich habe den Kern ganz gelesen, dazu Fixtures und Stichproben aus Tasks, Questions und Steps. Grep: kein `.answer(`, `sees(` nur in Steps, keine When-Handlung über `seed`, API-Weiche nur über `throughUiOrApi`/`CallTheApi`. `bun run lint` ist auf dem echten Code grün. |
| 2. Lint und Strukturtest erzwingen Screenplay für jede realistische Verletzung | **nicht erfüllt** | M-1: Eine Polling-Schleife im Step gibt 0 Meldungen. |
| 3. Frühere Befunde behoben, Archiv wahr | **erfüllt** (mit Minor m-5) | Die Original-Nachweise aller Major aus R1 bis R10 werden jetzt gemeldet (siehe unten). Das Archiv nennt jeden Befund mit einem zutreffenden Status. Drei Begründungssätze sind zu weit gefasst. |

### Was ich ausgeführt habe
- **Diffstat geprüft:** `git diff --stat 654d854..c632714` enthält nur `eslint.config.js`, `src/__tests__/e2e-screenplay-lint.test.ts`, `tests/e2e/CLAUDE.md`, `docs/archive/implementation-plan-verlauf.md`, `docs/design/offene-punkte.md` und `docs/reviews/screenplay-e2e-review-10.md`. Unter tests/e2e ändert sich also nur die Doku, so wie der Auftrag sagt.
- **Lint, Check und Lint-Test:**
  - `bun run lint`: Exit 0.
  - `bun run check`: 2818 Dateien, 0 Fehler, 0 Warnungen.
  - `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 109 von 109 grün.
- **Verletzungen per stdin:** `npx eslint --stdin --stdin-filename tests/e2e/<schicht>/zz… -f json`, gezählt habe ich die `no-restricted-*`-Meldungen. Proben und Skript liegen in `scratchpad/r5probe/` (`try.sh`).
- **Echte Dateien:**
  - Angelegt: `tests/e2e/zzhelpers/web.ts`, `tests/e2e/steps/zzsub/x.ts`, `tests/e2e/zz.ts`, `tests/e2e/tasks/zz.mts`, `tests/e2e/tasks/zz.js` und `tests/e2e/screenplay/zz.ts`. Die drei Strukturtests scheitern wie gewollt (3 failed / 106 passed).
  - Zeitweise ergänzt: `tests/e2e/screenplay/target.ts` (siehe m-3).
- **Aufräumen:** Alles ist gelöscht bzw. mit `git checkout` zurückgesetzt. `git status --short` ist leer.
- **E2E:** nicht ausgeführt, wie vereinbart.

### Blocker
Keine.

### Major

**M-1: Ein Step fragt in einer Schleife nach, über `try/catch` (oder `.catch`) um `sees` und ein Neuladen. Gesperrt ist nur `answer`.**
- **Wo:**
  - `eslint.config.js:255-258` (steps/) sperrt `WhileStatement`, `DoWhileStatement` und `.answer(`.
  - `for`, `try/catch` und `.catch`/`.then(ok, fail)` an `sees` bleiben erlaubt.
  - `tests/e2e/CLAUDE.md:24` sagt für Steps: «no polling loops».
  - Das Archiv (`docs/archive/implementation-plan-verlauf.md:5173`) meldet R10 M-2 als behoben.
- **Warum falsch:**
  - «Assertion probieren, bei Fehlschlag neu laden, nochmals» ist das gewöhnliche Muster gegen wackelige Tests. Dafür braucht es keine Umbenennung, kein Aliasing und keinen Trick.
  - Die Lint-Meldung zu R10 M-2 («actor.sees retries») führt sogar direkt dorthin. `sees` lädt nämlich nicht neu, also packt man es in `try/catch`.
  - Das Muster ersetzt das Warten über `expect.poll` durch ein eigenes Abfragen im Step, gegen Punkt 1 («steps only tasks/questions»; Polling gehört in `sees` oder, mit Neuladen, in einen Task).
  - Es ist dieselbe Klasse wie R10 M-2 und R8 M-3, die als Major geführt wurden. Mit `answer` wird sie gemeldet, mit `sees` nicht.
- **Nachweis:** `scratchpad/r5probe/s1.ts` als `tests/e2e/steps/zz1.steps.ts` gibt 0 Meldungen:
  ```ts
  Then('zz', async ({ verwalter }) => {
  	for (let attempt = 0; attempt < 5; attempt++) {
  		try {
  			await verwalter.sees(confirmation, { timeout: 1000 }).toContain('gespeichert');
  			break;
  		} catch {
  			await verwalter.attemptsTo(reloadPage);
  		}
  	}
  });
  ```
  Ebenso mit 0 Meldungen:
  - `s5.ts`: `await verwalter.sees(confirmation).toContain('gespeichert').catch(() => verwalter.attemptsTo(reloadPage));`
  - `s2.ts`: `const shown = await verwalter.sees(q).toContain('x').then(() => true, () => false);` (eine eigene Prüfung per Verzweigung, Gegenstück zum gesperrten `throw`).
- **Vorschlag:**
  - In steps/ `TryStatement` sperren; heute hat kein Step `try`/`catch`/`.then(` (Grep über `tests/e2e/steps`: 0 Treffer).
  - Dazu `CallExpression[callee.property.name=/^(catch|then|finally)$/]` sperren.
  - Je ein Fall in `e2e-screenplay-lint.test.ts`.
  - Die `for`-Schleife über Vorbedingungen (`steps/statements.steps.ts:59`) bleibt davon unberührt.

### Minor
- **m-1** `eslint.config.js:212`: Die Freigabeliste der Page-Methoden im Kern greift nur, wenn der Empfänger `pageOf(…)` oder ein Bezeichner `page` ist.
  - `actor.abilityTo(BrowseTheWeb).page.fill('[data-testid="…"]', '1500')` und `.click(sel)` in `screenplay/interactions.ts` geben 0 Meldungen (`r5probe/c1.ts`).
  - Das ist genau der Rumpf von `pageOf` (`interactions.ts:8`, `questions.ts:12`). Weil beide Kerndateien `pageOf` anbieten, schreibt man das kaum direkt.
  - Fix: `[callee.object.property.name='page']` in die Regel aufnehmen.
  - Nicht in H-19.
- **m-2** `eslint.config.js:216`: `querySelector` auf `data-testid` ist im Kern nur als String-Literal gesperrt.
  - In `screenplay/questions.ts` geben 0 Meldungen (`r5probe/c2.ts`):
    - `pageOf(actor).evaluate((id) => document.querySelector(`[data-testid="${id}"]`)…, id)`, also ein Template-Literal;
    - `document.querySelector('#rent')`.
  - In `interactions.ts` fängt `no-restricted-properties` beides.
  - Das Archiv (`:5171-5172`, «querySelector on data-testid banned in the core») ist für Template-Literale zu weit.
  - Nicht in H-19.
- **m-3** `src/__tests__/e2e-screenplay-lint.test.ts:211`: Der Strukturtest zu den Exporten von `target.ts` erkennt nur `export (type|const|function) Name`.
  - Mit diesen Zeilen in `tests/e2e/screenplay/target.ts` bleiben Lint und alle 109 Tests grün:
    ```ts
    const contractSaveButton = target('Speichern', (page) => page.getByTestId('contract-save-button'));
    export { contractSaveButton };
    export let contractRentInput = target(…);
    ```
    Geprüft habe ich das mit einer echten Datei, danach `git checkout`.
  - Damit stimmt die Archivzeile `:5177-5178` («it exports only … (structure test)») nur für die `export const`-Form.
  - Fix: `Object.keys(await import('../../tests/e2e/screenplay/target'))` vergleichen. Die Datei importiert zur Laufzeit nichts.
- **m-4** Kern und Targets dürfen von ausserhalb `tests/e2e` importieren und (der Kern) wieder exportieren.
  - `eslint.config.js:220-229` und `:363-372` haben kein `insideE2e`. Der Basisblock (`:171-179`) lässt `screenplay/` und `targets/` aus.
  - Belege mit 0 Meldungen:
    - `r5probe/c4.ts` in `screenplay/interactions.ts`: `export { clickSave } from '../../zzsupport/web'`;
    - `r5probe/tg1.ts` in `targets/`: `import { byTestId } from '../../zzsupport/places'`.
  - Damit erreicht Seiten-Code von ausserhalb (R10 M-3) die Tasks über den Kern. Das verlangt aber eine bewusste Re-Export-Zeile im geschlossenen Kern, deshalb nur Minor.
  - Zu weit gefasst sind damit `tests/e2e/CLAUDE.md:19` («Nothing in the layers comes from outside tests/e2e …», «No layer re-exports another module») und Archiv `:5175` («no layer imports from outside tests/e2e»).
- **m-5** Archivsätze, die weiter gehen als der Code:
  - `:5153` «(targets and the core: round 10)» zu `info()`/`.project`: Im Kern gibt `test.info().project.name` 0 Meldungen (`r5probe/c5.ts`, in `interactions.ts`), ebenso `setTimeout`.
  - `:5181` «timers … in targets – fixed»: `import { setTimeout as pause } from 'node:timers/promises'; await pause(1);` in `targets/` gibt 0 Meldungen (`r5probe/tg2.ts`). Gesperrt sind dort nur `setTimeout(…)`-Aufrufe.
  - Dazu m-2, m-3 und m-4.
  - Beides ist im Kern bzw. in einem Target kaum realistisch. Es geht also nur um die Wahrheit des Archivs.
- **m-6** Commit-Betreffe über 50 Zeichen (54, 52, 52, 51) bestehen weiter. Laut Archiv `:5186` werden sie beim Squash-Merge gelöst.

### Nit
- `screenplay/interactions.ts`: `pageOf(actor).keyboard.press('Enter')` und `pageOf(actor).mouse.click(x, y)` geben 0 Meldungen (`r5probe/c3.ts`). Ein Klick per Koordinate geht an jedem Target vorbei. Heute nutzt das niemand.
- `screenplay/questions.ts:122-125`: `Width.of` antwortet ohne Element `null` (über `single`), nicht `0`, wie es `tests/e2e/CLAUDE.md` («answers null, false or 0») und der Kommentar `:9-10` nahelegen. Der Typ ist ehrlich `number | null`, also nur Wortlaut.

### H-19-Einordnung
- **Unter H-19 (höchstens Minor, dort beschrieben), alle mit 0 Meldungen:**
  - Re-Export per Deklaration über Fixtures. Beispiel: `r5probe/f2.ts`, `export const browserOf = (actor) => { const { page } = actor.abilityTo(BrowseTheWeb); return page; }`, das ist «a fixture handing … page on under another name». Die Nutzung im Step (`browserOf(verwalter).goto(…)`) meldet der Lint wieder, weil `goto` auf der Liste steht.
  - `fetch` in questions (`questions/documents.ts:17`, Mail-Catcher).
- **Nicht von H-19 erfasst** sind m-1 bis m-4. Sie sind aber keine Verschleierung, sondern Lücken der Regeln, also zu beheben oder in H-19 nachzutragen.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern ganz gelesen** (`tests/e2e/screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts`, `target.ts`):
  - `Actor` mit `whoCan`, `can`, `abilityTo`, `attemptsTo`, `answer`, `sees` (über `expect.poll`, `actor.ts:47-49`) und `remember`/`recall`.
  - Abilities `BrowseTheWeb` und `CallTheApi`; `throughUiOrApi` wählt nach Ability (`abilities.ts:46-50`).
  - Interactions sind Activities auf Targets (`on(target, …)`).
  - Web-Questions zählen zuerst und lesen dann mit `quick` (1 s).
  - `target.ts` exportiert `target`, `Target` und `hydratedPage`.
- **Fixtures:**
  - `test.ts`: Der Actor bekommt nach `driver` entweder `seed.backend` oder `BrowseTheWeb`. Die `page`-Fixture meldet über `Cookies.add` an.
  - `backend.ts`: nur über `CallTheApi`.
  - `session.ts`: JWT.
- **Stichproben:**
  - `tasks/contract-form.ts`, `questions/contract-form.ts`, `questions/documents.ts`, `tasks/accessibility.ts:240-275` und `steps/accessibility.steps.ts`.
  - Targets: Alle Exporte entstehen über `target(…)` bzw. die Fabriken `byTestId`/`bySelector`.
- **Grep:**
  - Kein `.answer(` in steps.
  - `sees(` weder in tasks noch in questions.
  - `fetch` nur in `questions/documents.ts`.
  - Keine When-Handlung über `await seed.<x>(`.
  - `throughUiOrApi`/`CallTheApi` nur in `tasks/statement-*.ts` und `questions/statement-*.ts`.

### Punkt 3 im Einzelnen (erfüllt)
Die Original-Nachweise habe ich neu als Probe gelintet (`r5probe/r*.ts`). Jeder ergibt mindestens eine `no-restricted-*`-Meldung:
- R1 M-1: `const { page } = actor.abilityTo(BrowseTheWeb); page.$eval(…); page.mouse.wheel(…)` in tasks/ und questions/: je 4.
- R2 M-1: dynamischer Import, `["page"]`, `p[by]()[act]()`, `p.url()` in tasks/: 4. Der Fixture-Weg ist unter R3 geprüft.
- R3 M-1: `page.getByTestId().click()`, `page.on('dialog')` und `request.get` in fixtures/: 5. `fixtures/backend.ts` nutzt nur noch `CallTheApi`.
- R4 M-1: `driver`, `seed.backend.post` und `test.expect` im Step: 4.
- R4 M-2: Question mit Interaction und `attemptsTo`: 2. Fixture mit `Click.on(saveButton)`: 2.
- R5 und R6: keine offenen Major (R5 meldet M-1/M-2 aus R4 als geschlossen, R6 «Major: Keine»).
- R7 M-1: Ordner `tests/e2e/zzhelpers/`: Strukturtest rot.
- R8 M-1: `.mts` und `.js` unter tests/e2e: Strukturtest rot.
- R8 M-2: `$testInfo.project` im Step: 2.
- R8 M-3: `for` in einer Question: 1.
- R9 M-1:
  - `getByTestId` im Kern: 1.
  - Zusätzliche Datei `screenplay/zz.ts`: Strukturtest rot.
- R9 M-2: `$test.info().project` in steps/ und tasks/: je 2.
- R9 M-3: `fetch` in steps/, fixtures/ und `tests/e2e/zzhelp.ts`: je 1.
- R10 M-1: `pageOf(actor).fill/click/waitForSelector(sel)` in `interactions.ts`: 3. `isVisible/textContent/inputValue(sel)` in `questions.ts`: 3.
- R10 M-2: `for` mit `answer` und Neuladen im Step: 1.
- R10 M-3: Import von `../../zzsupport/web` in steps/, tasks/, questions/ und fixtures/: je 1.

**Archiv, Session 19** (`docs/archive/implementation-plan-verlauf.md:5031-5188`):
- Die Runden 1 bis 10 stehen mit jedem Befund, Schweregrad und Status. Auch die Minors aus R10 sind vollständig erfasst (m-1 bis m-8 und das Nit); das H-19-Update ist in `offene-punkte.md:45` vorhanden.
- Jeder genannte Status stimmt für den gemeldeten Nachweis. Zu weit gefasst sind nur die Begründungssätze aus m-2 bis m-5.
- `implementation_plan.md` hat keine offene Session mehr.

### Doku
- **`tests/e2e/CLAUDE.md`:** Schichten, Actor-API, `throughUiOrApi`, `noInlineConfig`, die Struktur (Ordner, Dateitypen, fünf Kerndateien) und die Import-Freigabe der Steps stimmen mit Code und Test überein. Abweichungen:
  - `:24` «no polling loops»: siehe M-1.
  - `:19` «Nothing in the layers comes from outside tests/e2e» und «No layer re-exports»: siehe m-4.
  - `:28` «target.ts exports only …»: siehe m-3. «the page itself only as a whole»: siehe m-1.
- **`docs/test-pyramid.md:66-76`:** DSL- und Protokolltreiber-Tabelle, `driver`, `throughUiOrApi` und `tasks/*-api.ts` passen zum Code. Einzige `-api`-Datei ist `tasks/statement-generate-api.ts`.
- **`tests/ui-screenshots/screenshots.spec.ts`:** Die Umstellung auf `testData(new CallTheApi(…))` passt zur neuen Signatur von `fixtures/backend.ts:5`.

### Nicht bestätigt
- **E2E-Lauf und Gates:**
  - Den E2E-Lauf habe ich nicht ausgeführt (vereinbart). Er stützt sich auf die Angabe zu 654d854 und den Diffstat, der unter tests/e2e nur `CLAUDE.md` ändert.
  - `bun run test:coverage`, die Backend-Tests, `deepcheck:audit` und `fallow audit` habe ich nicht ausgeführt.
- **Lesetiefe:** Nicht jede der 194 geänderten Dateien habe ich ganz gelesen.
  - Ganz gelesen: den Kern, `fixtures/test.ts`, `fixtures/session.ts`, `eslint.config.js`, den Lint-Test, `tests/e2e/CLAUDE.md`, Review 10 und die Major-Abschnitte von 1 bis 9.
  - Diffs gelesen: die Archiv-Session 19 ab `:5140`, `docs/test-pyramid.md` und `screenshots.spec.ts`.
  - Für steps/, tasks/, questions/ und targets/ stütze ich mich auf den grünen Lint, die Greps und die Stichproben.
- **Semantik:** Ob ein Step über einen Task fachlich am UI vorbeigeht (z. B. ein Task, der im UI-Projekt über `CallTheApi` schreibt), zeigt erst der Lauf: Er scheitert dann an `abilityTo(CallTheApi)`. Nach Namen lässt sich das nicht prüfen.
- **Squash-Merge:** Ob die Betreffe über 50 Zeichen beim Squash-Merge ersetzt werden, kann ich nicht feststellen.
