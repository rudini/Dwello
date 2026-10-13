## Schluss-Review 2 (Endstand): Screenplay-E2E, `git diff origin/main...HEAD` (HEAD 7bdad9d)

**Ergebnis:** Kein Blocker, drei Major (alle zu Punkt 2). Der Umbau selbst (Punkt 1) ist vollständig. Alle Major aus den Runden 1 bis 7 sind im Code behoben, und das Archiv führt sie (Punkt 3). Der Lint lässt aber drei realistische Verstösse ohne jede Verschleierung durch:
- eine `.js`-Datei unter `tests/e2e`,
- eine Weiche UI/API im Step über `$testInfo.project.name`,
- eine `for`-Schleife in einer Question.

| Punkt | Urteil | Beleg |
|---|---|---|
| 1. Alle Bereiche im schlanken Screenplay | **erfüllt** | Kern und Fixtures ganz gelesen, Stichproben je Bereich, Grep ohne Reste (siehe unten) |
| 2. Lint erzwingt Screenplay überall unter tests/e2e | **nicht erfüllt** | M-1 bis M-3 |
| 3. Frühere Befunde behoben | **erfüllt** | Alle Major aus Review 1 bis 7 im Code bestätigt; Archiv Session 19 führt jeden Befund mit Status |

### Was ich ausgeführt habe
- `git diff --stat 04f3780..HEAD`: Geändert sind nur `eslint.config.js`, `src/__tests__/e2e-screenplay-lint.test.ts`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md`, `docs/archive/implementation-plan-verlauf.md` und `docs/reviews/screenplay-e2e-review-7.md`. Wie angegeben.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 72/72 grün.
- `bun run lint`: grün.
- `bun run check`: 0 Fehler, auch mit meiner Verstoss-Datei `.js` (siehe M-1).
- Eigene Verstoss-Dateien (`zz*`) in steps/, tasks/, questions/, targets/, fixtures/, in `tests/e2e/zzhelpers/`, `tests/e2e/interactions/` und `tests/e2e/zz_top.ts` angelegt und mit `npx eslint` geprüft. Danach alle gelöscht; `git status --short` ist leer.
- E2E: nicht ausgeführt (laut Auftrag).

### Blocker
Keine.

### Major

**M-1: Dateien mit anderer Endung als `.ts` unter tests/e2e sind von allen Schichtregeln ausgenommen, auch von `noInlineConfig`**
- **Wo:** `eslint.config.js`. Jeder Block für tests/e2e trägt `files: ['tests/e2e/**/*.ts']` bzw. `tests/e2e/<schicht>/**/*.ts`. Das betrifft:
  - den Block mit `noInlineConfig`,
  - den Basisblock «any other file»,
  - die Schichtblöcke.
- **Was das öffnet:**
  - Eine `.js`-Datei wird nur mit den allgemeinen Regeln für `**/*.js` geprüft.
  - `.mts` und `.cts` prüft ESLint gar nicht («no matching configuration»).
  - `tsconfig.json` hat `allowJs`/`checkJs`, also importiert ein `.ts`-Step die Datei ohne Fehler.
- **Warum falsch:** Das ist keine Verschleierung, sondern «any other file» im Sinn von Anforderung 2.
  - `tests/e2e/CLAUDE.md:19` sagt «any other file is held to the limits of the layers».
  - `tests/e2e/CLAUDE.md:34` sagt, der Lint «ignores `eslint-disable` comments in tests/e2e». In einer `.js`-Datei wirkt ein `eslint-disable` aber.
  - H-19 nennt den Fall nicht.
- **Nachweis:** `bun run lint` (bzw. `npx eslint` auf beide Dateien) endet mit Exit 0, `bun run check` meldet 0 Fehler.
  - `tests/e2e/tasks/zz2.js`:
    ```js
    import { BrowseTheWeb } from '../screenplay/abilities';
    /** @param {import('../screenplay/actor').Actor} actor */
    export const save = (actor) => actor.abilityTo(BrowseTheWeb).page.getByTestId('building-save-button').click();
    ```
  - `tests/e2e/steps/zz13.steps.ts`: `import { save } from '../tasks/zz2.js'; … await verwalter.attemptsTo(save);`
- **Vorschlag:**
  - Die e2e-Blöcke auf `**/*.{ts,mts,cts,js,mjs,cjs}` stellen und `**/*.{mts,cts}` dem TS-Parser zuordnen.
  - Oder in `e2e-screenplay-lint.test.ts` neben dem Ordner-Test einen Test ergänzen, der unter tests/e2e nur `.ts` und `.feature` (plus `CLAUDE.md`) zulässt.
  - Dazu ein Lint-Testfall `tests/e2e/tasks/example.js`.

**M-2: Ein Step kann über `$testInfo.project.name` zwischen UI und API wählen**
- **Wo:** `eslint.config.js`, Block steps/. Gesperrt sind nur:
  - `driver` (über `ObjectPattern` und `MemberExpression`),
  - `backend`/`expect`.
- **Warum falsch:**
  - Anforderung 1 verlangt «UI vs API chosen by ability, not in steps», `tests/e2e/CLAUDE.md:30` «steps never branch on the driver».
  - Das Projekt `api` ist genau der API-Lauf (`tests/e2e/CLAUDE.md:30`, `docs/test-pyramid.md`). Die Weiche über den Projektnamen ist also dieselbe Weiche wie über `driver`.
  - `$testInfo` ist in Steps erlaubt und wird schon benutzt (`steps/accessibility.steps.ts:12`, `steps/language.steps.ts:62`). Wer `driver` gesperrt sieht, findet diesen Weg ohne Verschleierung.
- **Nachweis:** `tests/e2e/steps/zz11.steps.ts`, 0 Meldungen:
  ```ts
  When('zz11', async ({ verwalter, $testInfo }) => {
  	if ($testInfo.project.name === 'api') return;
  	await verwalter.attemptsTo();
  });
  ```
  Ebenfalls 0 Meldungen: ein Step, der `CallTheApi` über eine Re-Export-Fixture bekommt und `if (verwalter.can(CallTheApi)) await verwalter.abilityTo(CallTheApi).post(…)` schreibt (`fixtures/zz7.ts` mit `export { CallTheApi } from '../screenplay/abilities'`). Das ist ein Re-Export, siehe Minor.
- **Vorschlag:**
  - In steps/ `MemberExpression[property.name='project']` sperren (`$testInfo.setTimeout` bleibt erlaubt), ebenso `CallExpression[callee.property.name=/^(can|abilityTo)$/]`.
  - Je ein Lint-Testfall.

**M-3: Questions dürfen weiter in einer `for`-Schleife nachfragen; `tests/e2e/CLAUDE.md` verbietet Schleifen, der Lint sperrt nur `while`/`do … while`**
- **Wo:**
  - `eslint.config.js:224`: `WhileStatement, DoWhileStatement`.
  - `tests/e2e/CLAUDE.md:26`: questions «no loops, no timers».
- **Warum falsch:** Das Archiv meldet Runde-7-Minor «questions blocking through `sees` or a loop – fixed». Die naheliegende Schleife zum Nachfragen geht aber durch. Sie verletzt «questions … do not block» aus Anforderung 1, und `actor.sees` würde sie bei jedem Poll erneut durchlaufen.
- **Nachweis:** `tests/e2e/questions/zz12.ts`, 0 Meldungen:
  ```ts
  export const ready = question('ready', async (actor) => {
  	for (let i = 0; i < 50; i++) if (await actor.answer(Visibility.of(saveButton))) return true;
  	return false;
  });
  ```
  Mit `import { setTimeout as delay } from 'node:timers/promises'` und `await delay(200)` in der Schleife ebenfalls 0 Meldungen (`questions/zz4.ts`).
- **Heute im Code:** Kein Treffer, `grep -rn "for (" tests/e2e/questions` ist leer. Eine Sperre bricht also nichts.
- **Vorschlag:**
  - In questions/ zusätzlich `ForStatement, ForOfStatement, ForInStatement` sperren.
  - `node:timers*` als Import sperren (questions/ und steps/).
  - Je ein Lint-Testfall.

### Minor
- `eslint.config.js:162-165` (steps/): Timer im Step gehen über `globalThis.setTimeout(…)`, `scheduler.wait(…)` und `import { setTimeout as sleep } from 'node:timers/promises'` durch (`steps/zz1.steps.ts`, 0 Meldungen); in questions/ ist `globalThis.setTimeout` gesperrt, in steps/ nicht.
- `eslint.config.js:192-201` (tasks/): Das Runde-7-Minor «`fetch` in tasks/ – fixed» hält nur für `fetch(…)`; `globalThis.fetch(…)` gibt 0 Meldungen (`tasks/zz5.ts`).
- Re-Exporte umgehen die Grenze der Steps: `tasks/x.ts` mit `export { Click } from '../screenplay/interactions'; export { saveButton } from '../targets/…'`, ebenso `fixtures/x.ts` mit `export { CallTheApi }`, geben Steps Interactions, Targets und die API-Ability (0 Meldungen). Nicht in H-19 erfasst.
- `docs/design/offene-punkte.md` H-19 nennt nur den Alias in fixtures/ und `fetch` in questions/. Das Archiv verweist aber auch den umbenannten `actor`-Parameter (Runde 6, Runde 7 Nit) auf H-19. Fall: `question('x', async (a) => { await goToNextStep(a); })` gibt 0 Meldungen. H-19 sollte diese Umwege und die Re-Exporte nennen.
- Eine Question kann über `actor.abilityTo(CallTheApi).post(…)` handeln (`questions/zz4.ts`, 0 Meldungen). `post`, `put` und `remove` in questions/ sind nicht gesperrt.
- `fixtures/backend.ts:93` (`backend: api`) und `fixtures/test.ts:31`: Eine neue Fixture, die `seed.backend` unter anderem Namen an Steps gibt (`apiOf(seed).post(…)`), geht durch. Das ist knapp Verschleierung und gehört zu H-19.

### Nit
- `tests/e2e/questions/accessibility.ts:8` liest `'findings'` als Literal, `tasks/accessibility.ts:42` als nicht exportierte Konstante `FINDINGS`. In Runde 7 abgelehnt, bleibt doppelt.
- Commit-Betreffs über 50 Zeichen (54, 52, 52, 51) bleiben; laut Archiv beim Squash-Merge zu lösen.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern ganz gelesen:** `screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts`, `target.ts`.
  - `Actor` hat `whoCan`/`can`/`abilityTo`, `attemptsTo`, `answer` und `sees` über `expect.poll`, dazu `remember`/`recall`.
  - Abilities: `BrowseTheWeb` (page) und `CallTheApi` (HTTP an der einzigen Stelle); `throughUiOrApi` wählt nach Ability.
  - Interactions sind Activities. Web-Questions geben Werte; `single()` ist strikt, und `quick` begrenzt das Warten auf 1 s.
- **Fixtures ganz gelesen:** `test.ts`, `backend.ts` (über `CallTheApi`), `screens.ts`, `session.ts`, `dates.ts`.
  - Das `page`-Fixture setzt die Cookies über `Cookies.add` durch einen Actor.
  - `verwalter` bekommt je nach `driver` `seed.backend` oder `BrowseTheWeb`.
- **Gelesen, je Bereich mindestens Step, Task oder Question:**
  - statement-generate (Step, Task, Task-API, Question), statement-detail (Question), contract-detail (Task, Question), invoices (Task, Question), building-detail (Task), authentication (Task), accessibility (Step, Task, Question), language (Step, Question), dashboard (Question), documents (Question).
  - Die übrigen Bereiche habe ich über Grep und die Importe der Steps geprüft: Steps importieren nur `playwright-bdd`, `fixtures/`, `tasks/` und `questions/`.
- **Grep auf Reste** (`page`, `expect`, `locator`, `getBy`, `driver`, `.backend`, `waitFor`, `setTimeout`, `throw`, `.evaluate` in steps/, tasks/, questions/): Treffer gibt es nur in Kommentaren, Namen (`pagePath`) und bei `$testInfo.setTimeout`.
- `tests/e2e` enthält nur die Schichtordner.

### Punkt 3 im Einzelnen (erfüllt)
- **R1 M-1** (Destrukturieren von `page`, `$eval`, `mouse`/`keyboard`, berechnete Namen): gesperrt in `noPlaywright`; Tests `e2e-screenplay-lint.test.ts:46-55`.
- **R2 M-1** (fixtures ohne Regel, `import()`/`require`, Pfadvarianten, berechnete Namen): Block für fixtures/ und `ImportExpression`/`require` gesperrt, Pfadmuster `**/screenplay/**/abilities*`; Tests `:66-90`.
  - `el.click.call(el)` und `(0, el.click)()` gehen in tasks/ noch durch.
  - Ohne Weg zu einem Locator (`page`, `locate` und `BrowseTheWeb` sind gesperrt) ist das aber folgenlos.
- **R3 M-1** (Member-Zugriff auf Playwright-Fixtures, `APIRequestContext` in `backend.ts`): `MemberExpression[object.name=/^(page|context|browser|request)$/]` und die Regel gegen Umbenennen sind gesperrt; HTTP liegt in `CallTheApi` (`abilities.ts:17-44`).
- **R4 M-1** (`driver`, `seed.backend`, `test.expect` im Step): gesperrt; Tests `:117-124`, `:149-156`.
- **R4 M-2** (Questions handeln, Fixtures reichen Interactions weiter): gesperrt; Tests `:128-145`.
- **R7 M-1** (Dateien ausserhalb der Schichtordner): Basisblock mit `ignores` für screenplay/ und targets/, dazu Ordner-Test `:170-176`. Das Original aus Runde 7 in `tests/e2e/interactions/zzact.ts` gibt jetzt 7 Fehler.
  - Für `.ts` ist das bestätigt. Für andere Endungen nicht, siehe M-1.
- **Archiv** `docs/archive/implementation-plan-verlauf.md`, Session 19: Runden 1 bis 7 sind mit jedem Befund, Schweregrad und Status (fixed / rejected mit Grund / H-18 / H-19) aufgeführt.
  - Abweichung: Bei Runde 7 sind «`fetch` in tasks/ – fixed» und «loop – fixed» nur teilweise wahr (siehe Minor und M-3).

### Doku
- `tests/e2e/CLAUDE.md`: Die Tabelle «May use» stimmt mit den Importen im Code überein. Zwei Abweichungen:
  - Zeile 19 «any other file is held to the limits of the layers» und Zeile 34 «ignores `eslint-disable` comments in tests/e2e» gelten nur für `.ts` (M-1).
  - Zeile 26 «no loops» gilt nur für `while` (M-3).
- `docs/test-pyramid.md:66-72` passt zum Code (Abilities, `throughUiOrApi`, Steps ohne Weiche).

### Nicht bestätigt
- E2E-Lauf (chromium + api): nicht ausgeführt, laut Auftrag. Ob das Given «hat die Abrechnungen … erstellt» (`steps/statement-generate.steps.ts:68-74`, `sees(generationOutcomeShown)` ist nur UI) in einem `@api`-Szenario vorkommt, habe ich nicht geprüft. Laut Auftrag war der api-Lauf grün.
- `bun run test:coverage`, Backend-Tests, `deepcheck:audit`, `fallow audit`: nicht ausgeführt. Der Delta seit 04f3780 betrifft nur ESLint-Konfiguration, Lint-Test und Doku.
- Semantische Regel «`seed` nur für Vorbedingungen»: Ein When-Step, der die Handlung über `seed.building(…)` an der Oberfläche vorbei ausführt, ist mit Namensregeln nicht von einem Given zu unterscheiden. Heute gibt es keinen Treffer (Grep über When/Then mit `seed.<anlegen>`).
