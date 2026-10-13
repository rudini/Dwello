## Schluss-Review 3 (Endstand): Screenplay-E2E, `git diff origin/main...HEAD` (HEAD ee8279a)

**Ergebnis:** Kein Blocker, drei Major, alle zu Punkt 2.
- Der Umbau selbst (Punkt 1) ist vollständig.
- Alle Major aus Review 1 bis 8 sind behoben (Punkt 3).
- Der Lint lässt aber drei Klassen realistischer Verstösse ohne Verschleierung durch:
  - Seiten-Code mit eigenen Locators in `screenplay/`, wohin die Lint-Meldung selbst verweist;
  - die Weiche UI/API über `test.info()`;
  - `fetch` in Steps und Fixtures.

| Punkt | Urteil | Beleg |
|---|---|---|
| 1. Alle Bereiche im schlanken Screenplay | **erfüllt** | Kern und Fixtures ganz gelesen, Stichproben, Import-Auswertung je Schicht, `bun run lint` grün auf dem echten Code (siehe unten) |
| 2. Lint erzwingt Screenplay überall unter tests/e2e | **nicht erfüllt** | M-1 bis M-3 |
| 3. Frühere Befunde behoben, Archiv wahr | **erfüllt** | Jeder Major aus Runde 1 bis 8 hat einen grünen Lint-Testfall und hält im Code. Eine Archiv-Aussage stimmt nur teilweise (Minor «lokaler Re-Export») |

### Was ich ausgeführt habe
- `git diff --stat 04f3780..HEAD`: Geändert sind nur:
  - `eslint.config.js` und `src/__tests__/e2e-screenplay-lint.test.ts`;
  - `tests/e2e/CLAUDE.md` und `docs/test-pyramid.md`;
  - `docs/archive/implementation-plan-verlauf.md` und `docs/design/offene-punkte.md`;
  - `docs/reviews/screenplay-e2e-review-7.md` und `-8.md`.

  Das passt zur Angabe, kein Code unter tests/e2e ausser `CLAUDE.md`.
- `bun run lint`: Exit 0.
- `bun run check`: 0 Fehler, 0 Warnungen.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 86 von 86 grün.
- **Eigene Verstoss-Dateien `zz*`** in steps/, tasks/, questions/, targets/, fixtures/, screenplay/ (auch im Unterordner `screenplay/zz24/`) und oben in `tests/e2e/`:
  - 38 Fälle, je mit `npx eslint` geprüft;
  - danach gelöscht, `git status --short` ist leer.
- E2E habe ich laut Auftrag nicht ausgeführt.

### Blocker
Keine.

### Major

**M-1: `screenplay/` hat keine Regel; der Lint schickt Seiten-Code genau dorthin. Damit ist `screenplay/` der neue Helfer-Ordner mit Page-Code.**
- **Wo:**
  - `eslint.config.js:154`: Der Basisblock nimmt `tests/e2e/screenplay/**` aus.
  - Für `screenplay/` gibt es keinen eigenen Block.
  - `eslint.config.js:18,20-21`: Jede Meldung in tasks/, questions/ und steps/ lautet «Playwright is driven only in tests/e2e/screenplay/ and tests/e2e/targets/ … use an Interaction from screenplay/interactions.ts».
  - Der Ordner-Test (`e2e-screenplay-lint.test.ts:178-184`) prüft nur die Ordner direkt unter `tests/e2e`. Dateien und Unterordner in `screenplay/` sind frei.
- **Warum falsch:**
  - Anforderung 1 verlangt «interactions are actions, targets named locators» und «tasks compose interactions».
  - Wer einen Task schreibt und an der Lint-Meldung scheitert, verschiebt den Page-Code nach `screenplay/`, wie die Meldung es sagt.
  - Dort darf er Locators inline schreiben und domänenspezifische Abläufe bauen, ohne Target und ohne Interaction-Komposition.
  - Das ist genau das Muster von `origin/main` (`tests/e2e/interactions/*.ts` mit `page`-Code), nur unter anderem Ordnernamen.
  - Es braucht keine Verschleierung und fällt nicht unter H-19.
- **Nachweis:** Beide Dateien geben 0 Meldungen.
  - `tests/e2e/screenplay/zzcontract.ts`:
    ```ts
    import type { Activity } from './actor';
    import { BrowseTheWeb } from './abilities';
    export const chooseTenantDirect = (id: string): Activity => async (actor) => {
    	const page = actor.abilityTo(BrowseTheWeb).page;
    	await page.getByTestId('contract-tenant-select').selectOption(id);
    	await page.getByTestId('contract-next-button').click();
    };
    ```
  - `tests/e2e/tasks/zz10.ts`:
    `export const chooseTenant = (id: string): Activity => (actor) => actor.attemptsTo(chooseTenantDirect(id));`
  - Ebenso 0 Meldungen: `tests/e2e/screenplay/zz24/helpers.ts` mit `export const save = (page: Page) => page.getByTestId('save').click();`.
- **Vorschlag:**
  - Ein Strukturtest: `screenplay/` enthält genau `actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts` und `target.ts`, ohne Unterordner. Eine neue Kerndatei wird so eine bewusste Änderung am Test.
  - Ein Block für `screenplay/`:
    - keine Importe aus `targets/`, `tasks/`, `questions/`, `steps/` und `fixtures/`;
    - kein `getBy*`/`locator` ausser in `target.ts`. Dafür wird `body[data-hydrated]` (`interactions.ts:13`) selbst ein Target.
  - Den Lint-Testfall `:234-238` («lässt Playwright im Screenplay-Kern zu») entsprechend schärfen.

**M-2: Steps (und Tasks) wählen UI oder API über `test.info().project` bzw. `$test.info()`; nur `$testInfo` ist gesperrt**
- **Wo:**
  - `eslint.config.js:191-193`: gesperrt ist `MemberExpression[object.name='$testInfo']`.
  - `test` (aus `fixtures/test`) und die playwright-bdd-Fixture `$test` sind frei.
- **Warum falsch:**
  - `test.info()` ist dasselbe `TestInfo` wie `$testInfo`. Das ist dieselbe Klasse wie Runde 8 M-2.
  - `test.info()` ist der übliche Playwright-Weg, also keine Umgehung.
  - Anforderung 1 verlangt «UI vs API chosen by ability, not in steps».
  - `tests/e2e/CLAUDE.md:24` sagt «no `$testInfo` but `setTimeout`».
  - Jede Step-Datei importiert `test` ohnehin (`createBdd(test)`).
- **Nachweis:** Je 0 Meldungen.
  - `tests/e2e/steps/zz01.steps.ts`:
    ```ts
    import { test } from '../fixtures/test';
    const { When } = createBdd(test);
    When('zz01', async ({ verwalter }) => {
    	if (test.info().project.name === 'api') return;
    	await verwalter.attemptsTo();
    });
    ```
  - `steps/zz03.steps.ts` mit `async ({ verwalter, $test }) => { if ($test.info().project.name === 'api') return; … }`.
  - `tasks/zz12.ts` mit `if (test.info().project.name === 'api') return;` vor `Navigate.to('/')`: Der Task wählt nach dem Projekt, nicht nach der Ability.
- **Vorschlag:**
  - In steps/ `CallExpression[callee.property.name='info']` und `ObjectPattern > Property[key.name='$test']` sperren.
  - In tasks/ und questions/ ebenfalls `info` sperren, oder dort `MemberExpression[property.name='project']`.
  - Dazu je ein Lint-Testfall.

**M-3: `fetch` in Steps, Fixtures und Dateien ausserhalb der Schichten geht durch; gesperrt ist es nur in tasks/**
- **Wo:**
  - `eslint.config.js:206-209`: die `fetch`-Regel steht nur im Block für tasks/.
  - Der Block für steps/ (`:174-195`), der für fixtures/ (`:259-275`) und der Basisblock (`:157`) haben sie nicht.
- **Warum falsch:**
  - Ein Step mit `fetch` an das Backend redet am Actor vorbei mit dem System. Anforderung 1 verlangt «steps only tasks/questions/fixtures» und «UI vs API chosen by ability».
  - `tests/e2e/CLAUDE.md:28` verlangt für Fixtures «preconditions always through the backend API via `CallTheApi`».
  - Für tasks/ ist dieselbe Lücke in Runde 7 und 8 geschlossen worden. Für Steps ist sie gewöhnlicher Code ohne Trick, etwa eine Vorbedingung oder eine Mail-Prüfung direkt im Step nach dem Vorbild von `questions/documents.ts:17`.
  - H-19 nennt `fetch` nur für questions/.
- **Nachweis:** Je 0 Meldungen.
  - `tests/e2e/steps/zz02.steps.ts`:
    ```ts
    Given('zz02', async () => {
    	await fetch('http://localhost:3101/api/v1/buildings', { method: 'POST', body: JSON.stringify({ name: 'x' }) });
    });
    ```
  - `tests/e2e/fixtures/zz13.ts`: `export async function seedBuilding(name) { await fetch('http://localhost:3101/api/v1/buildings', …) }`.
- **Vorschlag:**
  - Die Regel `CallExpression[callee.name='fetch'], MemberExpression[property.name='fetch']` in `noPlaywright` aufnehmen. Dann gilt sie in steps/, tasks/, fixtures/ und im Basisblock.
  - questions/ bekommt eine Ausnahme nur für den Mail-Catcher, oder es bleibt bei H-19.
  - Dazu je ein Lint-Testfall.

### Minor
- `eslint.config.js:200-211` (tasks/): Ein Task wartet per Uhr mit `new Promise((r) => setTimeout(r, 2000))` oder `while (!(await actor.answer(q))) await new Promise(…setTimeout…)`, 0 Meldungen (`tasks/zz11.ts`, `tasks/zz20.ts`). Der Import der Timer-Module ist in derselben Schicht mit «No waiting by the clock» gesperrt (`:49`). Das globale `setTimeout` ist es nicht.
- `eslint.config.js:43`: Gesperrt sind nur `export … from`. `import { Click } …; import { saveButton } …; export { Click, saveButton };` in tasks/ gibt 0 Meldungen (`tasks/zz30.ts`), und Steps bekommen so Interactions und Targets. Das widerspricht `tests/e2e/CLAUDE.md:19` («No layer re-exports») und der Archiv-Aussage zu Runde 8 «fixed: no layer re-exports». Nicht in H-19.
- `eslint.config.js:174-195` (steps/): Ein Step kann mit einer Schleife nachfragen, `while (!(await verwalter.answer(confirmation))) {}` (`steps/zz04.steps.ts`, 0 Meldungen). Das ist Warten am `sees` vorbei.
- `eslint.config.js:233-236` (questions/): Rekursives Nachfragen, `const ask = async (n) => (await actor.answer(shown)) || (n > 0 && ask(n - 1))`, umgeht die Schleifensperre (`questions/zz16.ts`, `questions/zz38.ts` mit Frist über `Date.now()`; 0 Meldungen). Grenzfall zur Verschleierung, H-19 nennt es nicht.
- `e2e-screenplay-lint.test.ts:178-184`: Eine `.ts`-Datei direkt in `tests/e2e/` ist erlaubt. Sie darf Interactions und Targets komponieren, und Steps dürfen sie importieren. `tests/e2e/zzflows.ts` mit `export const save = Click.on(saveButton)` und `steps/zz09.steps.ts`: 0 Meldungen. Damit liegt ein Task ausserhalb von tasks/, gegen `CLAUDE.md:19` «a helper belongs in one of the layers».
- **Unter H-19** (Umbenennen oder Alias, laut Auftrag höchstens Minor und durch H-19 abgedeckt):
  - Fixture `seite: async ({ page }, use) => use(page)`, dann im Step `seite.on('dialog', …)` und `seite.url()` (`fixtures/zz32.ts`, `steps/zz33.steps.ts`, 0 Meldungen). Fällt unter «alias of a Playwright fixture».
  - `question('x', async (verwalter) => { await openDashboard(verwalter); … })` (`questions/zz17.ts`, 0 Meldungen). Fällt unter «parameter not named `actor`». Der Name `verwalter` ist hier allerdings der übliche Name im Projekt, keine bewusste Tarnung.
  - `fetch` in questions/ (`questions/zz21.ts`). Fällt unter H-19.

### Nit
- `docs/test-pyramid.md:76`: «the API path lives in `tasks/<area>-api.ts`». API-Pfade liegen aber auch inline in `tasks/statement-detail.ts:23-25` und in `questions/statement-generate.ts:186-230`. Zeile 66 sagt es schon richtig.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern ganz gelesen** (`screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts`, `target.ts`):
  - `Actor` hat `whoCan`/`can`/`abilityTo`, `attemptsTo`, `answer`, `sees` über `expect.poll` (`actor.ts:47-49`) und `remember`/`recall`.
  - Abilities: `BrowseTheWeb` und `CallTheApi`; `throughUiOrApi` wählt nach Ability (`abilities.ts:46-50`).
  - Interactions sind Activities über Targets.
  - Web-Questions geben Werte, ohne zu warten: `isVisible`, `count`, `evaluateAll`, nach dem Zählen mit Fristen von 1 s.
- **Fixtures ganz gelesen** (`test.ts`, `session.ts`, Oberfläche von `backend.ts`):
  - Die einzige Weiche nach Driver ist `fixtures/test.ts:29-34` (Ability).
  - Testdaten laufen über `CallTheApi`.
- **Stichproben:** `tasks/statement-generate.ts`, `tasks/statement-generate-api.ts`, `questions/statement-generate.ts`, `questions/documents.ts`, `steps/statement-generate.steps.ts`.
- **Importe je Schicht ausgewertet:**
  - steps/ importiert nur `playwright-bdd`, `fixtures/`, `tasks/` und `questions/`.
  - tasks/ und questions/ importieren `screenplay/`, `targets/`, `tasks/`, `questions/` und `fixtures/`, dazu `fs` (`questions/language.ts:1`) und den PDF-Leser des Backends (`questions/download.ts:3`).
- **Grep über steps/, tasks/, questions/ und fixtures/** auf `fetch`, `test.info`, `project`, `setTimeout`, `while`, `can(`, `abilityTo`: nur erlaubte Treffer.
  - `$testInfo.setTimeout`: `steps/language.steps.ts:62`, `steps/accessibility.steps.ts:12`.
  - Mail-Catcher (H-19): `questions/documents.ts:17`.
  - `CallTheApi`/`throughUiOrApi` nur in den statement-Tasks und -Questions.
- **Lint und Ordner:** `bun run lint` ist auf dem ganzen Code grün. `tests/e2e/` enthält nur die Schichtordner und `CLAUDE.md`.
- **Hinweis:** Die Lücken aus M-1 bis M-3 nutzt heute kein Code. Punkt 1 ist also erfüllt, nur nicht abgesichert.

### Punkt 3 im Einzelnen (erfüllt)
Jeder Major hat einen grünen Fall in `src/__tests__/e2e-screenplay-lint.test.ts`:
- **R1 M-1** (Destrukturieren von `page`, `$eval`, `mouse`/`keyboard`, berechnete Aufrufe): `:49-58`.
- **R2 M-1** (fixtures/, `import()`/`require`, Pfadvarianten, berechnete Namen): `:69-93`.
  - Meine Probe `tasks/zz34.ts` (`abilities.ts`) und `tasks/zz35.ts` (absoluter Pfad) melden je 3-4 Fehler.
  - Die Namespace-Probe `tasks/zz31.ts` ebenso.
- **R3 M-1** (Member-Zugriff auf Playwright-Fixtures, HTTP in `fixtures/backend.ts`): `:78-81`. `backend.ts` nutzt nur `CallTheApi`. Meine Probe `fixtures/zz14.ts` (`page.on`) meldet einen Fehler.
- **R4 M-1** (`driver`, `seed.backend`, `test.expect`): `:119-125`, `:157-160`. Meine Proben `steps/zz08` (`test.skip(({ driver }) …)`), `steps/zz25` (`seed['backend']`) und `steps/zz36` (`test.expect`) melden je einen Fehler oder mehr.
- **R4 M-2** (Questions handeln, Fixtures reichen Interactions weiter): `:130-146`. Meine Probe `fixtures/zz15.ts` (`Navigate`) meldet einen Fehler.
- **R7 M-1** (Dateien ausserhalb der Schichtordner): Basisblock `eslint.config.js:150-159` und Ordner-Test `:171-184`.
- **R8 M-1** (`.js` u. ä.): `:186-190`. Der Filter weist `.js`, `.mts`, `.cts`, `.tsx` und `.d.ts` ab.
- **R8 M-2** (`$testInfo.project`): `:194-195`. Meine Probe `$testInfo.skip()` meldet einen Fehler. Zum Variantenweg `test.info()` siehe M-2.
- **R8 M-3** (`for`-Schleifen in questions/): `:199-200`.
- **Archiv** `docs/archive/implementation-plan-verlauf.md:5031-5143`, Session 19:
  - Runden 1 bis 8 stehen mit jedem Befund, Schweregrad und Status (fixed / rejected mit Grund / H-18 / H-19).
  - Die Session ist aus `implementation_plan.md` entfernt.
  - Inhaltlich stimmt der Status. Eine Ausnahme: Runde 8 «re-exports … fixed: no layer re-exports» gilt nur für `export … from` (siehe Minor).
  - H-19 enthält, wie im Archiv angegeben, den umbenannten `actor`-Parameter und das umbenannte `seed.backend`.

### Doku
- `tests/e2e/CLAUDE.md`: Schichten, Actor-API, `throughUiOrApi`, `noInlineConfig` und das Beispiel stimmen mit dem Code überein. Abweichungen zwischen Doku und Lint:
  - `:19` «No layer re-exports» (Minor zum lokalen Re-Export);
  - `:24` «no `$testInfo`» (M-2: `test.info()` frei);
  - `:28` Fixtures «always through … `CallTheApi`» (M-3);
  - die Zeile zu `screenplay/` (`:27`) erlaubt Playwright ohne Einschränkung, das stützt M-1.
- `docs/test-pyramid.md:64-76` passt bis auf den Nit.

### Nicht bestätigt
- **E2E-Lauf:** nicht ausgeführt, laut Auftrag. Die 629 grünen Tests auf 04f3780 sind übernommen; seit 04f3780 ist kein Code unter tests/e2e geändert (`git diff --stat 04f3780..HEAD`).
- **Weitere Gates:** `bun run test:coverage`, die Backend-Tests, `deepcheck:audit` und `fallow audit` habe ich nicht ausgeführt.
- **Lesetiefe:** Nicht jede Datei in targets/, tasks/, questions/ und steps/ habe ich Zeile für Zeile gelesen. Für die übrigen stütze ich mich auf den grünen Lint, die Import-Auswertung und den Grep oben.
- **Fixtures:** `fixtures/screens.ts` und `fixtures/dates.ts` habe ich nicht gelesen. `backend.ts` habe ich nur bis zur öffentlichen Oberfläche gelesen (bis `statement`).
- **Merge-Schritt:** Nach Archiv sollen die Commit-Betreffe über 50 Zeichen beim Squash-Merge gelöst werden. Ob das geschieht, kann ich nicht prüfen. Die beiden letzten Betreffe (ee8279a, 7bdad9d) sind konform.
