## Schluss-Review (Endstand): Screenplay-E2E, `git diff origin/main...HEAD` (HEAD 04f3780)

**Ergebnis:** Ein Major (Punkt 2), kein Blocker. Der Umbau selbst (Punkt 1) ist vollständig, und alle früheren Major sind im Code behoben (Punkt 3). Die Lint-Durchsetzung gilt aber nur für die fünf Schichtordner. Eine neue Datei an einer anderen Stelle unter `tests/e2e/` ist völlig ungeprüft, und Steps und Tasks dürfen sie importieren.

| Punkt | Urteil | Beleg (Kurzform) |
|---|---|---|
| 1. Alle Bereiche von tests/e2e auf dem schlanken Screenplay | **erfüllt** | Den Kern und die Fixtures habe ich vollständig gelesen, dazu je Bereich Step, Task und Question. Der Grep findet keine Reste (siehe unten). |
| 2. Lint erzwingt Screenplay für jede realistische Verletzung, ohne Ausnahmen | **nicht erfüllt** | M-1: Ein Helfer-Ordner ausserhalb der Schichten (z. B. das frühere `tests/e2e/interactions/`) mit `page`, Locators und `expect` lässt `bun run lint` mit Exit 0 durch. |
| 3. Frühere Befunde behoben | **erfüllt** | Alle Major aus Runde 1 bis 6 sind im Code und im Lint-Test bestätigt (siehe unten). |

### Was ich ausgeführt habe
Alles im Worktree `wt-end`. Am Ende ist `git status --short` leer.
- `bun run lint`: Exit 0.
- `bun run check`: 0 Fehler, 0 Warnungen.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 62 von 62 grün.
- **Eigene Verletzungsdateien:**
  - in den Schichtordnern: `tests/e2e/steps/zz1.steps.ts`, `tasks/zz2.ts`, `tasks/zz6.ts`, `questions/zz3.ts`, `questions/zz6.ts`, `targets/zz4.ts`, `fixtures/zz5.ts`;
  - ausserhalb der Schichten: `tests/e2e/zzhelpers/act.ts`, `tests/e2e/interactions/zzact.ts`, `tests/e2e/zzroot.ts`.
  - Geprüft mit `npx eslint …` und mit dem vollen `bun run lint`, danach gelöscht.
  - Gegenprobe: `await verwalter.page.goto("/")` in `steps/zz0.steps.ts` meldet 2 Fehler. Die Regeln greifen also, wo sie gelten.
- E2E habe ich laut Auftrag nicht ausgeführt.

### Blocker
Keine.

### Major

**M-1: Dateien ausserhalb von steps/, tasks/, questions/, targets/ und fixtures/ haben keine Schichtregel; Steps und Tasks dürfen sie importieren**
- **Wo:**
  - `eslint.config.js:138-268`: Die Schichtblöcke gelten nur für `tests/e2e/{steps,tasks,questions,fixtures,targets}/**`. Für `tests/e2e/**/*.ts` setzt der Block in `:138` nur `noInlineConfig`.
  - `eslint.config.js:150`: Steps dürfen alles importieren, ausser `**/screenplay/**`, `**/targets/**` und Playwright.
  - Tasks (`belowSteps`) dürfen ebenfalls alles ausser Playwright, `BrowseTheWeb`, `playwright-bdd` und steps/ importieren.
- **Warum falsch:**
  - Anforderung 2 verlangt, dass jede realistische Verletzung der Schichtregeln am Lint scheitert, und Anforderung 1, dass Steps nur Tasks, Questions und Fixtures nutzen.
  - Ein Helfer-Modul neben den Schichten ist keine Verschleierung, sondern genau das Muster, das dieser Umbau ersetzt: `origin/main` hatte `tests/e2e/interactions/*.ts` mit `page`-Code.
  - `.claude/skills/bdd-acceptance/SKILL.md` beschreibt in den Phasen 3 und 5 weiterhin generische `interactions/`. Zwar mit dem Hinweis, dass das hier nicht gilt, aber ein neues Feature kann sich an genau dieser Vorlage orientieren.
  - H-19 deckt das nicht ab: H-19 nennt nur Aliase in fixtures/ und `fetch` in questions/.
- **Nachweis:** `bun run lint` endet mit Exit 0, obwohl diese Dateien im Worktree liegen.
  - `tests/e2e/zzhelpers/act.ts`, identisch auch als `tests/e2e/interactions/zzact.ts` und `tests/e2e/zzroot.ts`:
    ```ts
    import { expect } from '@playwright/test';
    import { BrowseTheWeb } from '../screenplay/abilities';
    import type { Actor } from '../screenplay/actor';
    export const clickSave = async (actor: Actor) => {
    	const { page } = actor.abilityTo(BrowseTheWeb);
    	await page.getByTestId('save').click();
    	await expect(page.getByTestId('toast')).toBeVisible();
    };
    ```
  - `tests/e2e/steps/zz1.steps.ts`: `import { clickSave } from '../zzhelpers/act';` und dazu `When('zz speichert', async ({ verwalter }) => { await verwalter.attemptsTo(clickSave); });`. Das ergibt 0 Meldungen.
  - Damit treibt ein Step die Page mit Locators und Playwright-`expect` an, ohne Task, Target und Interaction.
- **Heute im Code:** kein Treffer. `ls tests/e2e` zeigt nur `features fixtures questions screenplay steps targets tasks` und `CLAUDE.md`. Die Lücke betrifft also nur neuen Code, und genau den soll der Lint erzwingen.
- **Vorschlag**, eine der beiden Varianten:
  - (a) Einen Block `files: ['tests/e2e/**/*.ts'], ignores: ['tests/e2e/screenplay/**', 'tests/e2e/targets/**']` vor die Schichtblöcke stellen, mit `noPlaywright` und `playwrightImports` als Grundregel. Die Schichtblöcke müssen sie dann einschliessen, weil Flat Config eine Regel pro Block ganz ersetzt.
  - (b) In steps/ und tasks/ nur Importe aus den bekannten Schichtordnern zulassen (Whitelist-Muster über `group` mit Negation).
  - In beiden Fällen gehört ein Fall «Helfer ausserhalb der Schichten» in `src/__tests__/e2e-screenplay-lint.test.ts`, z. B. `tests/e2e/helpers/example.ts` mit `page.getByTestId('x').click()`.

### Minor
- `eslint.config.js:172-204` (tasks/, questions/): Playwrights `expect` läuft über `test.expect` aus `fixtures/test` ohne Meldung durch, z. B. `await test.expect.poll(() => actor.answer(pageTitle)).toBe('x')` und `const { expect: check } = test` (`tasks/zz6.ts` und `questions/zz6.ts`: 0 Meldungen). In steps/ ist derselbe Weg gesperrt (`:161-164`). Die Sperre für `backend|expect` gehört auch in die Blöcke für tasks und questions.
- `eslint.config.js:180-204` (questions/): Eine Question kann blockieren, ohne einen Timer zu benutzen. Fälle: `await actor.sees(Text.of(statTile('x'))).toBe('1')` in der Question, oder eine `while`-Schleife über `actor.answer` (`questions/zz3.ts`, 0 Meldungen). Gegen die Regel «questions … do not block». Vorschlag: `CallExpression[callee.property.name='sees']` in questions/ sperren.
- `eslint.config.js:172-177` (tasks/): Ein Task kann das System per `fetch('http://localhost:3101/api/v1/…')` an der Ability `CallTheApi` vorbei antreiben (`tasks/zz2.ts`, 0 Meldungen). H-19 nennt `fetch` nur für questions/. Vorschlag: die Zeile H-19 auf tasks/ erweitern.
- `eslint.config.js:143-170` (steps/): Wartezeit im Step mit `await new Promise((r) => setTimeout(r, 2000))` wird nicht gemeldet (`steps/zz1.steps.ts`). In questions/ ist sie gesperrt, in steps/ nicht.
- `eslint.config.js:207-236` (fixtures/): Eine Fixture darf Tasks importieren und ausführen (`await actor.attemptsTo(openDashboard)`, `fixtures/zz5.ts`, 0 Meldungen). Das versteckt eine Handlung vor dem Szenario. Runde 6 hat nur den Re-Export bewertet, nicht das Ausführen.
- `tests/e2e/CLAUDE.md:25-26`: Die Spalte «May use» stimmt nicht mit dem Code überein.
  - tasks/ importiert auch `questions/` (`tasks/accessibility.ts:3-5`, `tasks/building-detail.ts:3` über `screenplay/questions`) und `fixtures/` (`tasks/accessibility.ts:1-2`, `tasks/authentication.ts:1`, `tasks/contract-detail.ts:1`).
  - questions/ importiert `tasks/` (Konstanten: `questions/statement-generate.ts:22`, `questions/statement-detail.ts:15-16`, `questions/authentication.ts:4`) und `fixtures/` (`questions/statements.ts:1`).
  - Ausserdem fehlt der Satz, dass es neben den Schichtordnern keine weiteren Ordner geben darf (siehe M-1).
- Steps ohne `await` vor `verwalter.sees(…)` meldet kein Lint (`steps/zz1.steps.ts`, `Then('zz nicht awaited', …)`). Heute sind alle 234 Aufrufe in steps/ awaited (Grep). Ob Playwright ein nicht abgewartetes `expect.poll` selbst als Fehler meldet, siehe «Nicht bestätigt».

### Nit
- `docs/test-pyramid.md:67`: «API driver … used by `tasks/*-api.ts`». `tasks/statement-detail.ts:23-25` benutzt `CallTheApi` aber ebenfalls direkt.
- `docs/archive/implementation-plan-verlauf.md` (Session 19, Zeile «Files:»): nennt nur `offene-punkte.md (H-18)`, nicht H-19. Der erste Haken spricht von «with a ratchet list»; die Liste ist laut einem späteren Haken entfernt, das ist als Verlauf aber korrekt.
- `tests/e2e/questions/statements.ts:14-15`: `statementPath(seed, …)` ist keine Question, sondern ein Pfad-Helfer mit `TestData`. Er wird von steps/ benutzt und gehört eher in fixtures/.
- `tests/e2e/screenplay/questions.ts:174-176`: `ThePage.accessibilityViolations` scrollt die Seite nach oben, bevor axe läuft. Damit handelt eine Question. Das ist begründet und kommentiert, weicht aber von «questions only ask» ab.
- `tests/e2e/questions/accessibility.ts:8` liest den Schlüssel `'findings'` als Literal, `tasks/accessibility.ts:44` als Konstante `FINDINGS`. Die Konstante sollte exportiert und an beiden Stellen benutzt werden, wie bei `STATEMENT` und `PREVIEW_TOTALS`.
- `tests/e2e/steps/language.steps.ts:46,54`: `{ verwalter: viewer }` beantwortet Fragen auch in Besucher-Szenarien. Es funktioniert, weil beide Actors dieselbe Page teilen (Kommentar `:45`), liest sich aber irreführend.
- `tests/e2e/targets/zz4.ts`, nur als Probe: Ein Target mit umbenanntem Parameter (`(p) => { p.on('dialog', …) }`) geht durch. Das ist Umbenennung und fällt damit unter H-19, keine eigene Arbeit nötig.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern vollständig gelesen** (`tests/e2e/screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts`, `target.ts`):
  - Der `Actor` hat `whoCan`, `can`, `abilityTo`, `attemptsTo`, `answer`, `sees` (über `expect.poll`, `actor.ts:46-48`) und `remember`/`recall`.
  - Die Abilities sind `BrowseTheWeb(page)` und `CallTheApi(request, token)`; dazu kommt `throughUiOrApi` (`abilities.ts:46-50`).
  - Interactions sind Activities über Targets.
  - Web-Questions liefern Werte und warten nicht: `isVisible`, `count`, `evaluateAll`, nach dem Zählen mit 1-s-Fristen.
  - Targets sind benannte Locators.
- **Fixtures vollständig gelesen** (`test.ts`, `backend.ts`, `screens.ts`, `session.ts`, `dates.ts`):
  - Der `verwalter` bekommt je nach `driver` die Ability `BrowseTheWeb` oder `CallTheApi` (`fixtures/test.ts:30-35`). Das ist die einzige Weiche nach Driver.
  - Testdaten laufen nur über `CallTheApi`.
- **Gelesen je Bereich** (Step, Task, Question und, wo vorhanden, Target):
  - Accessibility, Sprache, Dashboard, Abrechnungserstellung mit API-Driver (`tasks/statement-generate-api.ts`), Abrechnungs-Detail, Abrechnungsliste und -bearbeitung;
  - Gebäude (Liste, Formular, Detail), Wohnungen (Liste, Formular, Detail), Mieter (Liste, Formular, Detail);
  - Mietverträge (Liste, Formular, Detail), Rechnungen (Liste, Formular, Detail);
  - Kategorien, Verteilschlüssel, Heizprofile, Dokumente, Einstellungen, Authentifizierung, App-Rahmen, Kontakt, «Demnächst», Formular und Navigation;
  - die Steps `common`, `documents`, `authentication`, `tenants`, `apartment-list`, `accessibility`, `language`, `dashboard` und `statement-detail`.
- **Grep:**
  - steps/: keine Treffer für `.page`, `getBy`, `locator`, `expect`, `driver`, `.backend` und Importe aus `screenplay/` oder `targets/`. Treffer für «page» gibt es nur in Kommentaren.
  - tasks/ und questions/: kein Playwright-Aufruf.
  - `throughUiOrApi` und `CallTheApi` kommen nur in `tasks/statement-detail.ts`, `tasks/statement-generate*.ts`, `questions/statement-detail.ts` und `questions/statement-generate.ts` vor, ausserdem in den Fixtures.
  - Alle 234 `sees(`-Aufrufe in steps/ sind awaited.

### Punkt 3 im Einzelnen (erfüllt)
- **Runde 1, M-1** (Destrukturieren von `page`, `$eval`, Ketten über `mouse` und `keyboard`, berechnete Aufrufe): gesperrt (`eslint.config.js:10-38`). Tests in `e2e-screenplay-lint.test.ts`, Gruppe «Umwege zur Page».
- **Runde 2, M-1:**
  - fixtures/ hat einen Schichtblock (`:206-236`);
  - `import()` und `require` sind gesperrt (`:35`);
  - Pfadvarianten von `abilities` sind gesperrt (`:41-44`);
  - berechnete Zugriffe sind gesperrt (`:29-33`);
  - Tests sind vorhanden («weitere Umwege», «Pfadvarianten»).
- **Runde 3, M-1:**
  - In fixtures/ ist jeder Member-Zugriff auf `page`, `context`, `browser` und `request` gesperrt, ebenso das Umbenennen beim Destrukturieren (`:225-232`).
  - `fixtures/backend.ts` ruft nur noch `CallTheApi` auf (`backend.ts:5-13`).
- **Runde 4, M-1:** `driver`, `backend` und `expect` sind in steps/ gesperrt (`:157-165`), ebenso `throw` (`:166`). Tests: «Schluss-Review M-1» und «Re-Review, Minor».
- **Runde 4, M-2:**
  - questions/ darf keine Interactions importieren und kein `attemptsTo` aufrufen; ein direkter Aufruf mit `actor` und Timer sind gesperrt (`:184-201`).
  - fixtures/ darf keine Targets importieren und aus den Interactions nur `Cookies` (`:212-222`).
  - Tests: «Schluss-Review M-2».
- **Runden 5 und 6:** Darin gab es keine Major. Die Minors sind laut Plan behoben oder in H-19 erfasst; die Lint-Fälle stehen im Test (62 von 62 grün).

### Doku
- `tests/e2e/CLAUDE.md` stimmt im Kern mit dem Code überein: Schichten, Actor-API, `throughUiOrApi`, `noInlineConfig`, Beispiel. Abweichungen in der Spalte «May use» siehe Minor.
- `docs/test-pyramid.md:66-72` stimmt bis auf den Nit zu `tasks/*-api.ts`.
- `docs/archive/implementation-plan-verlauf.md`, Session 19: Die Runden 1 bis 6 sind mit Status geführt, bis auf den Nit zu «Files».

### Nicht bestätigt
- **E2E-Lauf:** laut Auftrag nicht ausgeführt, die 629 grünen Tests auf 04f3780 sind als gegeben übernommen. Dass jeder Step eines `@api`-Szenarios mit `CallTheApi` auskommt, habe ich nur gelesen, nicht laufen lassen.
- **Nicht abgewartetes `sees`:** Ob Playwright ein nicht abgewartetes `expect.poll` am Testende als Fehler meldet, habe ich nicht geprüft. Davon hängt ab, wie schwer der Minor zum fehlenden `await` wiegt.
- **Gates und Tests:** `bun run test:coverage`, Backend-Tests, `deepcheck:audit` und `fallow audit` habe ich nicht ausgeführt.
- **Targets:** Ich habe nicht jede Target-Datei Zeile für Zeile gelesen. Gelesen habe ich `accessibility`, `dashboard` und `language`; für die übrigen stütze ich mich auf den Lint-Block für targets/ und auf die Tasks und Questions, die sie benutzen.
- **Accessible-Name:** Ob `Accessible.nameOf` und `descriptionOf` dasselbe liefern wie `toHaveAccessibleName`, habe ich nur gelesen (`screenplay/questions.ts:77-104`).
