## Schluss-Review 6 (Endstand): Screenplay-E2E, `git diff origin/main...HEAD` (HEAD 6d687c1)

**Ergebnis:** Kein Blocker, ein Major (zu Punkt 2), dazu einige Minor.
- Punkt 1 (Umbau) und Punkt 3 (frühere Befunde, Archiv) sind erfüllt.
- Punkt 2 ist nicht erfüllt: Ein When-Step kann die Handlung über `seed.<anlegen>()` am UI vorbei ausführen. Das ist gewöhnlicher Code und gibt 0 Meldungen. Nach Namen und Step-Schlüsselwort liesse es sich prüfen (M-1).

| Punkt | Urteil | Beleg (Kurzform) |
|---|---|---|
| 1. Alle Bereiche im schlanken Screenplay | **erfüllt** | Kern (5 Dateien) und Fixtures ganz gelesen, dazu Stichproben (Accessibility, Statement-Generate UI/API). `bun run lint` ist auf dem echten Code grün. Greps: kein `sees` in tasks/questions; `fetch` nur `questions/documents.ts:17`; `throughUiOrApi`/`CallTheApi` nur in `tasks/statement-*`/`questions/statement-*`; jede `seed.<anlegen>()`-Handlung in Steps steht in einem `Given` (eigene ESLint-Probe über alle Step-Dateien). |
| 2. Lint und Strukturtest erzwingen Screenplay für jede realistische Verletzung | **nicht erfüllt** | M-1. Freigabelisten (Step-Importe, Page-Methoden im Kern, Kern-Selektoren, Exporte von `target.ts`, Dateitypen, Ordner) sind vorhanden und greifen. `noInlineConfig` ist gesetzt, es gibt keine Ausnahmeliste. |
| 3. Frühere Befunde behoben, Archiv wahr | **erfüllt** | Die Original-Nachweise aller Major aus R1 bis R11 habe ich neu gelintet; jeder gibt mindestens eine `no-restricted-*`-Meldung (Liste unten). Die Strukturtests habe ich mit echten Dateien rot gesehen. Session 19 im Archiv nennt jeden Status zutreffend; zwei Sätze sind zu weit gefasst (m-4). |

### Was ich ausgeführt habe
- **Diffstat:** `git diff --stat 654d854..6d687c1` enthält nur `eslint.config.js`, den Lint-Test, `tests/e2e/CLAUDE.md`, das Archiv, `offene-punkte.md` und die Reviews 10/11. Unter tests/e2e ändert sich also nur `CLAUDE.md`.
- **Gates:**
  - `bun run lint`: Exit 0.
  - `bun run check`: 2818 Dateien, 0 Fehler, 0 Warnungen.
  - `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 121 von 121 grün.
- **Probes:** Mit der ESLint-API (`lintText` mit `filePath` unter `tests/e2e/<schicht>/zz…`) habe ich die `no-restricted-*`-Meldungen gezählt. Skripte und Fälle liegen in `scratchpad/r6probe/` (`probe.mjs`, `c1.mjs` bis `c6.mjs`, `seedwhen.mjs`).
- **Echte Dateien:** Angelegt habe ich `tests/e2e/zzhelpers/web.ts`, `tests/e2e/tasks/zz.js` und `tests/e2e/screenplay/zz.ts`, dazu ein `export { contractSaveButton }` in `screenplay/target.ts`. Ergebnis: 4 failed / 117 passed, also scheitern alle vier Strukturtests wie gewollt.
- **Aufräumen:** Alles gelöscht bzw. mit `git checkout` zurückgesetzt; `git status --short` ist leer.
- **E2E:** nicht ausgeführt, wie vereinbart.

### Blocker
Keine.

### Major

**M-1: Ein When- oder Then-Step führt die Handlung über `seed` am UI vorbei aus. Der Lint sperrt nur `seed.backend`.**
- **Wo:**
  - `eslint.config.js:280-283` (steps/) sperrt `seed.backend`, aber nicht `seed.sendStatement(…)`, `seed.statement(…)`, `seed.remind(…)`, `seed.notice(…)` usw.
  - `tests/e2e/CLAUDE.md:24` erlaubt Steps `fixtures/` nur mit «(`seed` for preconditions)»; `:29` sagt «preconditions always through the backend API».
  - `fixtures/backend.ts` bietet dieselben Handlungen an, die Szenarien als «Wenn …» beschreiben: versenden, mahnen, kündigen, Abrechnung erstellen, PDF erstellen.
- **Warum falsch:**
  - Ein When-Step mit `seed.sendStatement(…)` läuft auch im UI-Projekt über die API. Das Szenario wird grün, ohne dass die Oberfläche je bedient wurde.
  - Der Step legt damit selbst den Weg fest. Das verletzt Punkt 1 («UI vs API chosen by ability, not in steps») und die Fixture-Regel «preconditions only».
  - Das ist gewöhnlicher Code, kein Umweg: Die vorhandenen Given-Steps (`steps/statement-detail.steps.ts:67`, `steps/documents.steps.ts:18`, `steps/dashboard.steps.ts:155`) zeigen genau dieses Muster. Wer eine neue Wenn-Formulierung derselben Handlung braucht, kopiert es.
  - Frühere Runden (R8, R10) haben das unter «Nicht bestätigt» geführt, weil es sich nach Namen nicht prüfen lasse. Das Step-Schlüsselwort reicht aber zur Unterscheidung.
- **Nachweis:** In `tests/e2e/steps/zz.steps.ts` gibt es 0 Meldungen (`r6probe/c1.mjs`, Fall `s-when-seed`):
  ```ts
  When('der Verwalter versendet die Abrechnung {int} von {string}', async ({ seed }, year, tenant) => {
  	await seed.sendStatement(tenant, year);
  });
  ```
- **Vorschlag:**
  - In steps/ `CallExpression[callee.name=/^(When|Then)$/] CallExpression[callee.object.name='seed']:not([callee.property.name=/^(idOf|unique)$/])` sperren.
  - Gegenprobe (`r6probe/seedwhen.mjs`): Auf dem heutigen Code trifft diese Regel nichts. `exampleOf(seed, …)` und `statementPath(seed, …)` in Then-Steps geben `seed` nur weiter.
  - Dazu ein Fall im Lint-Test und ein Halbsatz in `tests/e2e/CLAUDE.md:24` («`seed` only in `Given`»).

### Minor
- **m-1** `eslint.config.js:273`: Steps dürfen `question.answeredBy(verwalter)` statt des gesperrten `answer` aufrufen. Eine `for`-Schleife mit `answeredBy` und `reloadPage` gibt 0 Meldungen (`c1.mjs` `s-answeredBy-loop`). Dasselbe gilt für `Promise.allSettled([verwalter.sees(…)])` mit anschliessendem `if` und Neuladen statt `try`/`catch` (`s-allSettled-loop`). Beides umgeht eine Namensregel, gehört also in die H-19-Klasse, steht dort aber nicht. Fix: `answeredBy` in die Step-Sperre aufnehmen, `allSettled` in H-19 nennen.
- **m-2** `eslint.config.js:200-233` und der Strukturtest `src/__tests__/e2e-screenplay-lint.test.ts:648-663`: Im Kern sucht `screenplay/questions.ts` Elemente weiterhin am Target vorbei.
  - Der Strukturtest prüft nur Argumente von `querySelector`, `querySelectorAll` und `closest`.
  - `document.getElementById('flash-message')`, `document.getElementsByClassName('toast')` und `document.elementFromPoint(…)` in einer neuen Web-Question geben 0 Meldungen. Der Test bleibt grün (`c3.mjs` `wq-getById`, `wq-getByClass`).
  - Ebenso darf eine Web-Question in `questions.ts` warten (`expect(…)`, `waitForResponse`, `waitForURL`; `wq-expect`, `wq-waitForResponse`), entgegen «Questions … never wait for the page» (`tests/e2e/CLAUDE.md:35`).
  - `tests/e2e/CLAUDE.md:19` («the core looks elements up only with its fixed, general selectors») und Archiv `:5196-5197` sind damit zu weit gefasst.
  - Stufe Minor, wie R11 m-2: Das betrifft nur den geschlossenen Kern.
- **m-3** `eslint.config.js:71-74` (`insideE2e`): Nur Pfade mit `../../` gelten als «ausserhalb».
  - In tasks/, questions/, fixtures/, targets/ und im Kern geben `import … from '$lib/paraglide/messages'` (App-Code über den SvelteKit-Alias) und `'./../../ui-screenshots/…'` 0 Meldungen (`c5.mjs`). Steps fängt ihre Freigabeliste ab.
  - Ein `$lib`-Import in einer Question, etwa für erwartete Texte, ist gewöhnlicher Code. Er bringt aber keinen Playwright-Code mit, deshalb nur Minor.
  - `tests/e2e/CLAUDE.md:19` («Nothing … comes from outside `tests/e2e`») und Archiv `:5175` sind dafür zu weit.
  - Fix: Die Freigabeliste der Steps sinngemäss auf die anderen Schichten übertragen (`^(\.{1,2}/|playwright-bdd$|node:|crypto$|fs$|jose$|@axe-core/playwright$ (nur Kern))`), oder `$lib`/`src/` sperren.
- **m-4** Archiv `docs/archive/implementation-plan-verlauf.md:5175` und `:5196-5197`: Die Sätze sind weiter gefasst, als Lint und Test tragen (siehe m-2 und m-3). Die Status selbst stimmen.
- **m-5** Ein `verwalter.sees(q).toContain('x');` ohne `await` gibt im Step 0 Meldungen (`s-noawait-sees`).
  - R7 hat das mit «needs type information» abgelehnt. Die direkte Form lässt sich aber rein syntaktisch fassen: `ExpressionStatement > CallExpression > MemberExpression.callee > CallExpression.object[callee.property.name='sees']`, dazu dieselbe Form mit `.not`.
  - Das ist keine Schichtverletzung, aber ein häufiger Fehler, der eine Prüfung wirkungslos machen kann.
- **m-6** `eslint.config.js:291`: Steps dürfen `browserName` destrukturieren und `test.skip(…)` rufen (`s-browserName`, `s-testskip`). Ein `if (browserName === 'webkit') return;` als Workaround für wackelige Tests ist ein Blick auf den Testlauf, gegen den Geist von «no `test.info()`». Mit UI gegen API hat es nichts zu tun, deshalb nur Minor.
- **m-7** Vier Commit-Betreffe sind länger als 50 Zeichen (54, 52, 52, 51), wie bisher. Laut Archiv `:5186` und `:5203` werden sie beim Squash-Merge gelöst.

### Nit
- `docs/test-pyramid.md:73`: Der Satz «Today: …» zu `@api` lässt `statement-rounding.feature` aus, das ganz `@api` ist (`statement-rounding.feature:2`). Die Zeile ist alt und nicht Teil des Diffs.
- `src/__tests__/e2e-screenplay-lint.test.ts`: Die Testgruppen tragen Review-Runden als Kommentar («Schluss-Review Endstand 5 …»). Die Herkunft lässt sich damit verfolgen, nach Verhalten geordnet ist der Test aber nicht.

### H-19-Einordnung
- **Schon in H-19:**
  - Alias von Page oder Fixture: `const browserPage = pageOf(actor); browserPage.click(…)` im Kern gibt 0 Meldungen (`i-alias-p`).
  - Question-Parameter `verwalter`, der einen Task aufruft (`q-task-via-attempt-param`).
  - `fetch` in questions/.
- **Nicht in H-19, aber Umweg:** `answeredBy`, `Promise.allSettled` (m-1) und der Pfad `./../../` (m-3).
- **Nicht in H-19 und kein Umweg:** M-1, m-2 und der `$lib`-Teil von m-3.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern** (`tests/e2e/screenplay/*.ts`, ganz gelesen):
  - `Actor` mit `whoCan`, `can`, `abilityTo`, `attemptsTo`, `answer`, `sees` (`expect.poll`, `actor.ts:47-49`) und `remember`/`recall`.
  - `BrowseTheWeb` und `CallTheApi`; `throughUiOrApi` wählt nach Ability (`abilities.ts:46-50`).
  - Interactions laufen über `on(target, …)`. Web-Questions zählen zuerst und lesen dann mit `quick`.
  - `target.ts` exportiert `target`, `Target` und `hydratedPage`.
- **Fixtures** (ganz gelesen):
  - `test.ts`: Die Ability wird nach `driver` gewählt; die `page`-Fixture meldet über `Cookies.add` an.
  - `backend.ts`: nur über `CallTheApi`.
  - `screens.ts`, `session.ts`, `dates.ts`: reine Verdrahtung und Daten.
- **Stichproben:**
  - `tasks/accessibility.ts`, `steps/accessibility.steps.ts`, `questions/accessibility.ts`.
  - `tasks/statement-generate.ts` und `tasks/statement-generate-api.ts` (UI- und API-Pfad über `throughUiOrApi`), `questions/statement-generate.ts`, `questions/documents.ts`.
  - Targets: Alle Exporte entstehen über `target(…)`, die Fabriken oder parametrisierte Funktionen.
- **Steps:**
  - Imports stammen nur aus `playwright-bdd`, `tasks/`, `questions/` und `fixtures/` (Freigabeliste, Lint grün).
  - Kein `if` als Prüfung, kein `recall`, kein `answer`.
  - `seed`-Handlungen stehen nur in `Given`.

### Punkt 3 im Einzelnen (erfüllt)
Die Original-Nachweise habe ich neu gelintet (`r6probe/c4.mjs`, `c6.mjs`); jeder gibt mindestens eine Meldung:
- **R1 M-1:**
  - `const { page } = actor.abilityTo(BrowseTheWeb); page.$eval` in tasks/: 3 Meldungen.
  - `content`/`dragAndDrop`/`waitForNavigation`: 3; `mouse.wheel`: 1; `x["click"]()` im Step: 2.
  - `p.url()`, `l.all()` und `l.count()` auf einem schon vorhandenen Objekt geben weiter 0. An ein solches Objekt kommt man aber nur noch über einen Alias (H-19).
- **R2 M-1:** Fixture `save(page)` mit `getByTestId().click()`: 3; dynamischer Import: 1.
- **R3 M-1:** `page.on('dialog')`: 1; `setDefaultTimeout`/`grantPermissions`/`newContext`: 3; `request.get`: 1.
- **R4 M-1:** `driver`: 1; `seed.backend.post`: 1; `test.expect`: 2. **R4 M-2:** Question mit Interaction und `attemptsTo`: 2; Fixture mit `Click.on(saveButton)`: 2.
- **R5 und R6:** keine offenen Major.
- **R7 M-1:** Helfer-Datei mit `expect`-Import: 1; Helfer-Ordner: Strukturtest rot (echte Datei).
- **R8:** M-1 `.js`-Datei: Strukturtest rot (echte Datei). M-2 `$testInfo.project`: 2. M-3 `for` in einer Question: 1.
- **R9:** M-1 `getByTestId` im Kern: 2; Zusatzdatei `screenplay/zz.ts`: Strukturtest rot. M-2 `test.info().project` in Step und Task: je 2. M-3 `fetch` in Step, Fixture und Helfer: je 1.
- **R10:** M-1 `pageOf(actor).fill/click/waitForSelector(sel)`: 3; `isVisible/textContent/inputValue(sel)`: 3. M-2 `for` mit `answer` im Step: 1. M-3 `../../support/web` in Step, Task und Fixture: je 1.
- **R11:** M-1 `try`/`catch`, `.catch` und `.then(ok, fail)` um `sees`: je 1. Die Minors sind ebenfalls behoben:
  - `.page.fill(sel)` im Kern: 1; Re-Export und Import von ausserhalb im Kern: 2, in Targets: 1.
  - `test.info()` im Kern: 2; `setTimeout` im Kern: 1; `node:timers` in Targets: 1; `keyboard` im Kern: 1.
  - `target.ts` mit `export { … }`: Strukturtest rot.

**Archiv, Session 19** (`docs/archive/implementation-plan-verlauf.md:5031-5205`):
- Die Runden 1 bis 11 stehen mit jedem Befund, Schweregrad und Status; jeder Status stimmt für den gemeldeten Nachweis.
- H-19 in `docs/design/offene-punkte.md:45` enthält die in R10 nachgetragenen Arten.
- Zu weit gefasst sind nur die Sätze aus m-4.

### Doku
- **`tests/e2e/CLAUDE.md`:** Schichtentabelle, Actor-API, Abilities, `throughUiOrApi`, «No exceptions», Struktur und Beispiel stimmen mit Code, Lint und Strukturtest überein. Abweichungen:
  - `:19`: siehe m-2 und m-3.
  - `:24` «`seed` for preconditions» ist nicht erzwungen (M-1).
  - `:35` «never wait» gilt für den Kern nur als Konvention (m-2).
- **`docs/test-pyramid.md:66-77`:** Die DSL- und Protokolltreiber-Tabelle (`BrowseTheWeb`, `CallTheApi`, `throughUiOrApi`, `tasks/*-api.ts`) und der Abschnitt «Two protocol drivers» passen zum Code. Einzige `-api`-Datei ist `tasks/statement-generate-api.ts`.
- **`.claude/skills/bdd-acceptance/SKILL.md`** und **`tests/ui-screenshots/screenshots.spec.ts`** passen zur neuen Struktur bzw. Signatur von `testData`.

### Nicht bestätigt
- **E2E und Gates:** Den E2E-Lauf habe ich nicht ausgeführt (vereinbart). `bun run test:coverage`, die Backend-Tests, `deepcheck:audit` und `fallow audit` habe ich ebenfalls nicht ausgeführt.
- **Lesetiefe:** Nicht jede der 195 Dateien habe ich ganz gelesen. Für steps/, tasks/, questions/ und targets/ stütze ich mich auf den grünen Lint, die Greps, die Probe `seedwhen.mjs` über alle Step-Dateien und die Stichproben oben.
- **Fehlendes `await`:** Ob Playwright ein nicht abgewartetes `expect.poll` selbst als Fehler meldet (m-5), konnte ich nicht prüfen. `node_modules` liegt unter `/home/user/Dwello` und ist für mich gesperrt.
- **Squash-Merge:** Ob die Betreffe über 50 Zeichen dabei ersetzt werden, kann ich nicht feststellen.
