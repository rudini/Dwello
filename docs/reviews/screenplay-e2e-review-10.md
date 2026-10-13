## Schluss-Review 4 (Endstand): Screenplay-E2E, `git diff origin/main...HEAD` (HEAD 654d854)

**Ergebnis:** Es gibt keinen Blocker, aber drei Major, alle zu Punkt 2.
- Der Umbau selbst ist vollständig (Punkt 1).
- Jeder Major aus Review 1 bis 9 hält in seiner gemeldeten Form (Punkt 3).
- Der Lint lässt aber drei Arten gewöhnlichen Codes ohne jede Verschleierung durch:
  - Seiten-Code mit Selektor-Strings im Kern;
  - eine Abfrageschleife mit `for` im Step;
  - einen Seiten-Helfer ausserhalb von `tests/e2e`, den Steps und Tasks importieren.

| Punkt | Urteil | Beleg (Kurzform) |
|---|---|---|
| 1. Alle Bereiche im schlanken Screenplay | **erfüllt** | Kern und Fixtures ganz gelesen. Importe der Steps ausgewertet: nur `playwright-bdd`, `fixtures/`, `tasks/`, `questions/`. Kein `.answer(`/`driver`/`fetch` in Steps. API-Weiche nur über `throughUiOrApi`/`CallTheApi` in tasks/questions. `bun run lint` grün auf dem echten Code. |
| 2. Lint und Strukturtest erzwingen Screenplay für jede realistische Verletzung | **nicht erfüllt** | M-1 bis M-3: Verletzungsdateien mit 0 `no-restricted-*`-Meldungen |
| 3. Frühere Befunde behoben, Archiv wahr | **erfüllt** | Die Original-Nachweise aller Major aus R1 bis R9 werden jetzt gemeldet (siehe unten). Das Archiv stimmt bis auf zu weit gefasste Formulierungen (Minor m-5). |

### Was ich ausgeführt habe
- **Lint, Check, Lint-Test:**
  - `bun run lint`: Exit 0.
  - `bun run check`: 2818 Dateien, 0 Fehler, 0 Warnungen.
  - `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 96 von 96 grün.
- **Verletzungen per stdin:** mit `npx eslint --stdin --stdin-filename tests/e2e/<schicht>/zz… -f json`. Die Proben und das Skript `try.sh` liegen in `scratchpad/r4probe/`.
- **Strukturtest mit echten Dateien:** angelegt habe ich `tests/e2e/zzhelpers/web.ts`, `tests/e2e/zztop.ts`, `tests/e2e/steps/zzsub/web.ts`, `tests/e2e/tasks/zzx.mts` und `tests/e2e/screenplay/zzextra.ts`.
  - Ergebnis: Die drei Strukturtests scheitern wie gewollt (3 failed / 93 passed).
- **Helfer ausserhalb von tests/e2e:** angelegt habe ich `tests/zzsupport/web.ts`, `tests/e2e/steps/zzout.steps.ts` und `tests/e2e/tasks/zzout.ts`, geprüft mit `npx eslint`.
- **Aufräumen:** Alle Dateien sind danach gelöscht. `git status --short` ist leer.
- **E2E:** nicht ausgeführt, wie vereinbart.

### Blocker
Keine.

### Major

**M-1: Der Kern findet Elemente weiterhin ohne Target, über Selektor-Strings der Page-API (`page.click(sel)`, `fill`, `waitForSelector`, `isVisible`, `textContent`, `inputValue` …)**
- **Wo:**
  - `eslint.config.js:181-203` (Block für `screenplay/`) sperrt nur Methoden, die Locators erzeugen: `getBy*`, `locator`, `frameLocator`, `$`, `$$`, `$eval`, `$$eval`.
  - `tests/e2e/CLAUDE.md:28` sagt dagegen für den Kern: «elements only through targets».
  - Das Archiv (`docs/archive/implementation-plan-verlauf.md:5149-5151`) meldet R9 M-1 als behoben mit «finds elements only through targets».
- **Warum falsch:**
  - Die selektorbasierten Page-Methoden sind gewöhnliche, dokumentierte Playwright-API. Wer im Kern eine neue Interaction oder Web-Question schreibt (z. B. «Cookie-Banner schliessen»), schreibt das ohne jeden Trick.
  - Dann liegt eine Fundstelle als String im Kern, nicht in `targets/`. Das ist dieselbe Klasse wie R9 M-1 (Seiten-Code mit eigenen Fundstellen im Kern), nur ohne `getBy…`.
  - Ein Task, der diese Interaction komponiert, ist für Lint und Strukturtest sauber.
- **Nachweis:** Beide Proben geben 0 `no-restricted-*`-Meldungen.
  - `--stdin-filename tests/e2e/screenplay/interactions.ts`:
    ```ts
    export const SaveContract: Activity = async (actor) => {
    	await pageOf(actor).fill('[data-testid="contract-rent-input"]', '1500');
    	await pageOf(actor).click('[data-testid="contract-save-button"]');
    	await pageOf(actor).waitForSelector('[data-testid="toast"]');
    };
    ```
  - Ebenso `--stdin-filename tests/e2e/screenplay/questions.ts`, mit `pageOf(actor).isVisible('[data-testid="toast"]')`, `.textContent('[data-testid="contract-rent"]')` und `.inputValue('#rent')`.
- **Vorschlag:**
  - Im Kern-Block die selektorbasierten Methoden auf der Page sperren, also nicht auf dem Locator-Parameter von `on(…)`. Beispiel:
    `CallExpression[callee.property.name=/^(click|dblclick|tap|fill|type|press|check|uncheck|setChecked|selectOption|setInputFiles|hover|focus|dispatchEvent|dragAndDrop|waitForSelector|isVisible|isHidden|isEnabled|isDisabled|isChecked|isEditable|textContent|innerText|innerHTML|inputValue|getAttribute)$/]:matches([callee.object.callee.name='pageOf'], [callee.object.name='page'])`
  - Der heutige Kern ruft auf `pageOf(actor)`/`page` nur `goto`, `reload`, `route`, `waitFor*`, `context`, `evaluate`, `url`, `title`, `setViewportSize`, `emulateMedia` und `setExtraHTTPHeaders` auf (Grep), bricht also nicht.
  - Dazu ein Fall in `e2e-screenplay-lint.test.ts` neben «lässt im Kern Locators nur in target.ts zu».

**M-2: Ein Step fragt in einer `for`-Schleife ab (Retry/Poll am `sees` vorbei); gesperrt sind nur `while` und `do … while`**
- **Wo:**
  - `eslint.config.js:224` sperrt in steps/ nur `WhileStatement, DoWhileStatement`.
  - `tests/e2e/CLAUDE.md:24` sagt für Steps: «no polling loops».
- **Warum falsch:**
  - Eine Retry-Schleife mit Zähler und Neuladen ist das übliche Muster gegen wackelige Tests: gewöhnlicher Code, keine Umgehung.
  - Sie ersetzt das Warten über `actor.sees` (`expect.poll`) durch eigenes Abfragen. Das widerspricht Punkt 1 («answer/sees via expect.poll»).
  - In questions/ hat R8 M-3 genau diese Klasse (`for`-Schleife) als Major geführt und für alle Schleifenarten geschlossen. Für Steps gilt laut Archiv (`implementation-plan-verlauf.md:5159`) «polling loop in a step – fixed», aber nur für `while`.
  - Zur Einordnung: R9 hat die `while`-Variante im Step als Minor geführt. Nach der vorgegebenen Regel («plausibel in gewöhnlichem Code») ist die `for`-Variante aber ein Major, gleich wie R8 M-3.
- **Nachweis:** Beide Proben in `tests/e2e/steps/zzs1.steps.ts` bzw. `zzs5.steps.ts` geben 0 Meldungen.
  ```ts
  Then('zz1', async ({ verwalter }) => {
  	for (let attempt = 0; attempt < 5; attempt++) {
  		if (await verwalter.answer(confirmation)) break;
  		await verwalter.attemptsTo(reloadPage);
  	}
  });
  ```
  Ebenso mit einer Frist über die Uhr, ganz ohne Timer:
  `for (const deadline = Date.now() + 5000; Date.now() < deadline; ) if (await verwalter.answer(confirmation)) return;`
- **Vorschlag:**
  - Heute ruft kein Step `.answer(` auf (Grep über `tests/e2e/steps`: 0 Treffer).
  - Deshalb in steps/ `CallExpression[callee.property.name='answer']` sperren. Steps fragen nur über `sees`.
  - Oder enger: `:matches(ForStatement, ForOfStatement, ForInStatement) CallExpression[callee.property.name=/^(answer|sees)$/]`. Dann bleibt die `for`-Schleife über Vorbedingungen (`steps/statements.steps.ts:59`) erlaubt.
  - Dazu ein Lint-Testfall.

**M-3: Steps und Tasks importieren Seiten-Code von ausserhalb `tests/e2e`; die Import-Regeln sind reine Sperrlisten**
- **Wo:**
  - `eslint.config.js:210-216` (steps/) sperrt nur `**/screenplay/**`, `**/targets/**`, Playwright, Timer und Assertion-Bibliotheken.
  - `belowSteps` (`:71`) für tasks/ sperrt nur Playwright, Timer, `BrowseTheWeb`, `playwright-bdd` und `**/steps/**`.
  - Der Strukturtest (`e2e-screenplay-lint.test.ts`, «hat in tests/e2e nur die Schichtordner» u. a.) prüft nur das Innere von `tests/e2e`.
  - Dateien ausserhalb von `tests/e2e` bekommen nur die allgemeinen Regeln.
- **Warum falsch:**
  - Das ist R7 M-1 (Helfer-Ordner mit `page`-Code, das alte `tests/e2e/interactions/`), nur eine Ebene höher: z. B. `tests/helpers/`, neben den bestehenden Geschwistern `tests/mocks/` und `tests/ui-screenshots/`.
  - Importe von ausserhalb sind in den Schichten normal (`questions/download.ts:3` importiert aus `backend/src/__tests__/helpers`). Ein solcher Import fällt also nicht auf.
  - Punkt 1 verlangt «steps only tasks/questions/fixtures». Der verletzende Import steht in einem Step unter `tests/e2e`.
- **Nachweis:** `npx eslint` mit Exit 0, 0 Meldungen.
  - `tests/zzsupport/web.ts`:
    ```ts
    import { expect } from '@playwright/test';
    import { BrowseTheWeb } from '../e2e/screenplay/abilities';
    import type { Actor } from '../e2e/screenplay/actor';
    export const clickSave = async (actor: Actor) => {
    	const { page } = actor.abilityTo(BrowseTheWeb);
    	await page.getByTestId('save').click();
    	await expect(page.getByTestId('toast')).toBeVisible();
    };
    ```
  - `tests/e2e/steps/zzout.steps.ts`: `import { clickSave } from '../../zzsupport/web';` und `When('zz speichert', async ({ verwalter }) => { await verwalter.attemptsTo(clickSave); });`.
  - `tests/e2e/tasks/zzout.ts` mit demselben Import gibt ebenfalls 0 Meldungen.
- **Vorschlag:**
  - In steps/ eine Freigabeliste statt einer Sperrliste: alles verbieten ausser `playwright-bdd`, `../tasks/*`, `../questions/*`, `../fixtures/*`. Steps importieren heute nur diese vier (ausgewertet: 37 fixtures, 57 questions, 44 tasks, 32 playwright-bdd).
  - In tasks/ und questions/ Importe mit `../../*` verbieten. Ausnahme ist der PDF-Leser des Backends, als ausdrücklich genanntes Muster.
  - Ausserdem den Import von `**/e2e/screenplay/abilities` mit `BrowseTheWeb` überall ausserhalb von `tests/e2e/fixtures` und `tests/e2e/screenplay` sperren. `tests/ui-screenshots/screenshots.spec.ts` braucht nur `CallTheApi`.
  - Dazu ein Lint-Testfall.

### Minor
- m-1 `tests/e2e/screenplay/target.ts` nimmt Fachziele auf, z. B. `export const contractSaveButton = target('Speichern', (page) => page.getByTestId('contract-save-button'))` (0 Meldungen). Dazu kommen fachliche Abläufe in `interactions.ts`, die daraus komponiert sind. Damit sitzen Tasks und Targets im Kern; der Lint kann generisch und fachlich nicht unterscheiden. Nicht in H-19.
- m-2 `tests/e2e/screenplay/interactions.ts`: `pageOf(actor).evaluate(() => document.querySelector('[data-testid="…"]').click())` gibt 0 Meldungen. Das ist eine Fundstelle im Browser-Kontext; `ThePage.texts` und `Accessible.nameOf` nutzen das legitim. Grenzfall, nicht in H-19.
- m-3 Re-Export per Deklaration in tasks/: `export const clickOn = Click.on; export const theSaveButton = saveButton;` gibt 0 Meldungen (`tasks/zzt1.ts`). Steps bekommen so Interactions und Targets, gegen `CLAUDE.md:19` «exports only what it defines». Das ist Aliasing, also H-19-Art, aber H-19 nennt es nicht.
- m-4 `eslint.config.js:348` (targets/): Der Filter `!/property.name=|ObjectPattern/` entfernt mit den Page-Regeln auch die Sperren für `setTimeout`, `info()`/`.project` und `fetch`. Zudem gilt der Basisblock nicht für targets/, also fehlen dort auch Timer-Importe. Probe `targets/zzg1.ts`/`zzg2.ts`: `test.info().project.name` in einem Target, `setTimeout`, `fetch`, `import … from 'node:timers/promises'` geben je 0 Meldungen. In einem Target ist das kaum realistisch.
- m-5 Das Archiv fasst einige Aussagen zu weit (`implementation-plan-verlauf.md`):
  - `:5149-5151` R9 M-1 «finds elements only through targets»: siehe M-1.
  - `:5152-5153` «`info()` and `.project` banned in every layer»: nicht in targets/ und im Kern.
  - `:5156` «clock timers banned in every layer» und `:5138` «timer modules banned in every layer»: nicht in targets/ und im Kern.
  - `:5154-5155` «`fetch` … banned everywhere but questions»: nicht in targets/.
- m-6 Ein Step kann den API-Pfad direkt wählen: `import { generateStatementsViaApi } from '../tasks/statement-generate-api'` gibt 0 Meldungen (`steps/zzs2.steps.ts`). Im UI-Projekt scheitert das zur Laufzeit an `abilityTo(CallTheApi)`, bleibt also nicht unbemerkt.
- m-7 Unter H-19 (laut Auftrag höchstens Minor, Art in H-19 genannt):
  - Question-Parameter `verwalter` statt `actor` ruft einen Task auf (`questions/zzq2.ts`, 0 Meldungen). Wie schon R9 anmerkte: `verwalter` ist der übliche Name im Projekt, keine Tarnung. Die H-19-Begründung trägt hier schwächer.
  - `fetch` in questions/ gegen das eigene Backend (`questions/zzq3.ts`).
  - Rekursives Nachfragen mit `Date.now()`-Frist (`questions/zzq4.ts`).
  - Fixture `seite: async ({ page }, use) => use(page)` (`fixtures/zzf2.ts`).
  - Nicht in H-19 genannt sind die Arten aus m-1 bis m-3 sowie `.call` und `(0, fn)()`. Diese wurden nicht erneut geprüft, weil ohne Weg zu einem Locator.
- m-8 Commit-Betreffe über 50 Zeichen (54, 52, 52, 51) bestehen weiter. Laut Archiv werden sie beim Squash-Merge gelöst.

### Nit
- `tests/e2e/CLAUDE.md:28`: «elements only through targets» ist für den Kern eine Konvention, kein Lint. Bis M-1 behoben ist, sollte der Text das sagen.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern ganz gelesen** (`screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts`, `target.ts`):
  - `Actor` mit `whoCan`/`can`/`abilityTo`, `attemptsTo`, `answer`, `sees` (über `expect.poll`) und `remember`/`recall`.
  - Abilities `BrowseTheWeb` und `CallTheApi`; `throughUiOrApi` wählt nach Ability.
  - Interactions sind Activities über Targets (`on(target, …)`), dazu `hydratedPage` als Kern-Target.
  - Web-Questions geben Werte und warten nicht: `count`, `isVisible`, `evaluateAll`, nach dem Zählen mit `quick` 1 s.
- **Fixtures gelesen:** `test.ts`, `session.ts` und von `backend.ts` den Anfang und die Oberfläche.
  - Die einzige Weiche nach Driver ist `fixtures/test.ts` (`verwalter` bekommt `seed.backend` oder `BrowseTheWeb`).
  - Die `page`-Fixture meldet über `Cookies.add` an.
- **Gelesen:** `tasks/contract-form.ts`, `steps/contract-form.steps.ts` (Anfang) und `questions/documents.ts`.
- **Grep:**
  - `throughUiOrApi`/`CallTheApi` kommen nur in `tasks/statement-detail.ts`, `tasks/statement-generate*.ts`, `questions/statement-detail.ts` und `questions/statement-generate.ts` vor.
  - Kein `sees(` in tasks/ oder questions/.
  - `driver` kommt nur in Kommentaren vor.

### Punkt 3 im Einzelnen (erfüllt)
Original-Nachweise der früheren Major, neu als Probe gelintet, jeweils mit mindestens einer `no-restricted-*`-Meldung:
- R1 M-1: `const { page } = actor.abilityTo(BrowseTheWeb); page.$eval(…)` in tasks/ und questions/: 3 Meldungen.
- R2 M-1: dynamischer Import und `['page']`, `p[by]()` in tasks/: 3 Meldungen.
- R3 M-1: `page.on`, `request.get` in fixtures/: 2 Meldungen.
- R4 M-1: `driver`, `seed.backend`, `test.expect` im Step: 4 Meldungen.
- R4 M-2: Question mit Interaction und `attemptsTo`: 2 Meldungen. Fixture mit `Click.on(saveButton)`: 2 Meldungen.
- R7 M-1: Helfer-Ordner `tests/e2e/zzhelpers/`: Strukturtest rot.
- R8 M-1: `.mts`-Datei: Strukturtest rot.
- R8 M-2: `$testInfo.project` im Step: 2 Meldungen.
- R8 M-3: `for` in einer Question: 1 Meldung.
- R9 M-1: `getByTestId` im Kern: 1 Meldung. Zusätzliche Datei in `screenplay/`: Strukturtest rot.
- R9 M-2: `test.info()`/`$test.info()` in steps/ und tasks/: je 4 Meldungen.
- R9 M-3: `fetch` in steps/ und fixtures/: je 1 Meldung.

Archiv, Session 19 (`docs/archive/implementation-plan-verlauf.md:5031-5164`): Runden 1 bis 9 stehen mit jedem Befund, Schweregrad und Status. Die Fixes stimmen, einige Formulierungen sind zu weit (m-5).

### Doku
- `tests/e2e/CLAUDE.md`:
  - Schichten, Actor-API, `throughUiOrApi`, `noInlineConfig` und Strukturregeln stimmen mit Code und Test überein.
  - Abweichungen: `:28` «elements only through targets» (M-1); `:24` «no polling loops» (M-2); `:19` «a helper belongs in one of the layers» gilt per Test nur innerhalb von `tests/e2e` (M-3).
- `docs/test-pyramid.md:66-67` und die Absätze zu `driver`/`@api` passen zum Code.

### Nicht bestätigt
- **E2E-Lauf:** nicht ausgeführt, wie vereinbart. Der Lauf auf 654d854 läuft anderswo.
- **Gates:** `bun run test:coverage`, die Backend-Tests, `deepcheck:audit` und `fallow audit` habe ich nicht ausgeführt.
- **Lesetiefe:** Nicht jede der 193 geänderten Dateien habe ich gelesen. Ganz gelesen habe ich:
  - Kern, `fixtures/test.ts`, `fixtures/session.ts`;
  - `eslint.config.js`, den Lint-Test, `tests/e2e/CLAUDE.md`;
  - die Diffs von `docs/test-pyramid.md`, `playwright.config.ts`, `tests/ui-screenshots/screenshots.spec.ts` und der Archiv-Session;
  - die Berichte 1 bis 9.

  Für steps/, tasks/, questions/ und targets/ stütze ich mich ausserdem auf den grünen Lint, die Import-Auswertung, den Grep und die Stichproben.
- **Semantik der Steps:** Ob ein When-Step die Handlung über `seed.<anlegen>` an der Oberfläche vorbei ausführt, lässt sich nicht nach Namen prüfen. Nicht geprüft.
- **Squash-Merge:** Ob die Betreffe über 50 Zeichen beim Squash-Merge ersetzt werden, kann ich nicht feststellen.
