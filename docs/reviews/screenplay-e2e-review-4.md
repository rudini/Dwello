## Schluss-Review: Screenplay-E2E (`git diff origin/main...HEAD`, HEAD 0f55450)

**Ergebnis:** Kein Blocker, zwei Major (beide zu Punkt 2). Der Umbau selbst (Punkt 1) und die Fixes der drei Runden (Punkt 3) halten. Die Lint-Durchsetzung hat aber weiterhin realistische Lücken: Ausgerechnet das Muster, das die Anforderung ausdrücklich nennt (`if (driver === 'api')` im Step), geht ohne Meldung durch.

| Punkt | Urteil | Beleg (Kurzform) |
|---|---|---|
| 1. Alle Bereiche von tests/e2e auf dem schlanken Screenplay | **erfüllt** | Kern vollständig gelesen; je Bereich Stichproben; Grep über steps/, tasks/ und questions/ ohne Reste (siehe unten) |
| 2. Lint erzwingt Screenplay für jede realistische Verletzung, ohne Ausnahmen | **nicht erfüllt** | M-1, M-2: Verletzungsdateien in steps/, questions/ und fixtures/ ohne eine einzige `no-restricted-*`-Meldung |
| 3. Frühere Befunde behoben | **erfüllt** | Alle Major und alle als «fixed» markierten Minor/Nits im Code bestätigt, auch Runde-3-M-1 (294aebf) |

**Was ich ausgeführt habe** (im Worktree, nichts ausser diesem Bericht geändert, `git status` am Ende sauber):
- `bun run lint`: Exit 0.
- `bun run check`: 0 Fehler, 0 Warnungen.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 44 von 44 grün.
- `bunx bddgen`: Exit 0, 617 generierte Tests, also kein fehlender Step (chromium; dazu kommen 12 `@api`). `.features-gen/` habe ich danach gelöscht.
- `git diff origin/main...HEAD -- tests/e2e/features`: leer. Die Szenarien sind unverändert.
- Verletzungsdateien habe ich im Scratchpad (`viol/`) geschrieben, als `zz*` nach `tests/e2e/{steps,tasks,questions,fixtures,targets}/` kopiert, mit `bunx eslint … -f json` geprüft und wieder gelöscht.

### Blocker
Keine.

### Major

**M-1: In steps/ gehen die Driver-Weiche, direkte Backend-Aufrufe und Playwrights `expect` ohne Lint-Meldung durch**
- **Wo:** `eslint.config.js:137-151` (Block für steps) zusammen mit `noPlaywright` (`eslint.config.js:21-38`). Weder die Fixture `driver` noch `seed.backend` noch `test.expect` sind gesperrt.
- **Warum falsch:** Anforderung 1 und 2 verlangen, dass der UI- oder API-Driver über die Ability gewählt wird, «not by `if (driver === 'api')` in steps», und dass Steps kein Playwright-`expect` verwenden. `tests/e2e/CLAUDE.md` sagt zu steps «no `expect`». Genau das alte Muster, das dieser Umbau ersetzt hat, ist aber wieder schreibbar. Es braucht dafür keinerlei Verschleierung.
- **Nachweis** (0 Meldungen, Datei `tests/e2e/steps/zzs01.steps.ts`):
  ```ts
  When('a', async ({ driver, verwalter, seed }) => {
  	if (driver === 'api') await seed.backend.post('statements/generate', {});
  	else await verwalter.attemptsTo(openNewContract);
  });
  ```
  Ebenfalls 0 Meldungen:
  - `zzs05.steps.ts`: `When('g', async ({ seed }) => { await seed.backend.post('buildings', {}); })`. Damit treibt ein Step das System direkt über `CallTheApi` an (`fixtures/backend.ts:93` gibt die Ability als `seed.backend` heraus) und umgeht tasks/.
  - `zzs02.steps.ts`: `test.expect(await verwalter.answer(confirmation)).toContain('x');`. Das ist Playwrights `expect` (`node -e "require('@playwright/test').test.expect"` liefert eine `function`). Die Regel greift nur bei `callee.name='expect'` und `object.name='expect'`, nicht bei `test.expect`.
- **Heute im Code:** kein Treffer. `grep -rn "driver\|\.backend" tests/e2e/steps` ist leer. Die Lücke betrifft also nur neuen Code, und genau den soll der Lint erzwingen.
- **Vorschlag** für steps/:
  - `ObjectPattern > Property[key.name='driver']` sperren;
  - `MemberExpression[property.name=/^(backend|expect)$/]` sperren.
  - Je einen Fall in `src/__tests__/e2e-screenplay-lint.test.ts` aufnehmen.

**M-2: Über erlaubte Importe umgehen questions/ und fixtures/ die Schichten: Questions handeln und warten, Fixtures reichen Interactions an Steps weiter**
- **Wo:**
  - `eslint.config.js:153-168`: questions/ darf `screenplay/interactions` importieren.
  - `eslint.config.js:169-191`: fixtures/ darf `screenplay/interactions`, `screenplay/abilities` und `targets/` importieren. Steps dürfen fixtures/ importieren (`tests/e2e/CLAUDE.md`, Tabelle).
- **Warum falsch:**
  - Für questions gilt laut Anforderung: «return VALUES … must not block». Für steps gilt «only tasks, questions and fixtures», wobei Steps `screenplay/` und `targets/` gerade nicht importieren dürfen (`eslint.config.js:144`).
  - Beides lässt sich mit gewöhnlichem Code ohne jede Verschleierung brechen.
- **Nachweis** (jeweils 0 Meldungen):
  - `tests/e2e/questions/zzq03.ts`: Eine Question klickt und wartet, bevor sie antwortet. Innerhalb von `actor.sees` würde sie bei jedem Poll erneut klicken.
    ```ts
    export const q = question('x', async (actor) => {
    	await actor.attemptsTo(Wait.until(saveButton), Click.on(saveButton));
    	return actor.answer(Text.of(saveButton));
    });
    ```
  - Fixture als Umweg (Step ohne jeden Task):
    - `tests/e2e/fixtures/zzf04.ts`: `export const save = Click.on(saveButton);` mit Importen aus `../screenplay/interactions` und `../targets/contract-form`;
    - `tests/e2e/steps/zzs06.steps.ts`: `import { save } from '../fixtures/zzf04'; … await verwalter.attemptsTo(save);`.
- **Heute im Code:** kein Treffer. questions/ importiert keine Interactions. fixtures/ importiert nur `Cookies` in `fixtures/test.ts:4`.
- **Vorschlag:**
  - In questions/ den Import von `**/screenplay/interactions*` und von `**/tasks/**` sperren. Das Gedächtnis (`recall`) reicht für die API-Antworten.
  - In fixtures/ `**/targets/**` sperren, ebenso `screenplay/interactions` bis auf `Cookies` (`importNames`).
  - Je einen Lint-Testfall ergänzen.

### Minor
- `eslint.config.js:179-182` (fixtures/): Ein Alias per Zuweisung umgeht die Regel aus Runde 3 weiterhin, z. B. `const p = page; p.on('dialog', …)` oder `const ctx = context; ctx.newPage()` (0 Meldungen, `zzf02.ts`). Ebenso `const { goto } = page` (`zzf03.ts`). Runde 3 hat Aliasing als Verschleierung gewertet; das ist knapp vertretbar.
- `tests/e2e/steps/` (Regel `eslint.config.js:137-151`): Eine selbstgebaute Prüfung `if (!(await verwalter.answer(q))?.includes('x')) throw …` ist nicht gesperrt (`zzs03.steps.ts`). Sie ist nicht Playwright, umgeht aber «assert with actor.sees».
- `tests/e2e/questions/documents.ts:17`: `fetch` ohne Ability. Die Ablehnung aus Runde 1 hält für den Mail-Catcher. Lint würde aber auch `fetch('http://localhost:3100/api/…')` auf das System selbst durchlassen (`zzq01.ts`).
- Commit-Betreffs über 50 Zeichen (CLAUDE.md, Conventions), alle in `git log origin/main..HEAD`:
  - `chore(tests): move a11y, language, frame to Screenplay` (54)
  - `fix(tests): close remaining Screenplay lint bypasses` (52)
  - `chore(tests): move invoices and config to Screenplay` (52)
  - `chore(tests): move statement-generate to Screenplay` (51)

### Nit
- `tests/e2e/tasks/invoices.ts:16`: `searchInvoices =(term` ohne Leerzeichen. Prettier prüft tests/ nicht.

### Punkt 1 im Einzelnen (erfüllt)
- **Kern** vollständig gelesen: `screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts` und `target.ts`.
  - `Actor` hat `whoCan`, `can`, `abilityTo`, `attemptsTo`, `answer`, `sees` (über `expect.poll`, `actor.ts:46-48`) und `remember`/`recall`.
  - Abilities: `BrowseTheWeb(page)` und `CallTheApi(request, token)` (`abilities.ts:5-43`).
  - Interactions: `Navigate`, `Click`, `Enter`, `EnterDate`, `Select`, `Check`, `Press`, `Upload`, `Wait` …
  - Targets sind benannte Fundstellen (`target.ts`).
  - Die Web-Questions liefern Werte und warten nicht: `isVisible`, `count` und `evaluateAll`, sowie nach dem Zählen Fristen von 1 s (`questions.ts:20-28`).
- **Driver nach Ability:** `throughUiOrApi` (`abilities.ts:46-50`). Er wird nur in `tasks/statement-detail.ts`, `tasks/statement-generate.ts`, `questions/statement-detail.ts` und `questions/statement-generate.ts` verwendet. Der API-Driver arbeitet in `tasks/statement-generate-api.ts` über `actor.abilityTo(CallTheApi)`. Die Weiche `driver === 'api'` gibt es nur noch in der Fixture `fixtures/test.ts:32`, wo die Ability vergeben wird.
- **Fixtures:**
  - `test.ts` meldet die page über `Cookies.add` an, `besucher` über `Cookies.clear`.
  - `backend.ts` legt die Testdaten nur über `CallTheApi` an.
  - `screens.ts` und `session.ts` enthalten keine Playwright-Aufrufe.
- **Stichproben je Bereich** (Step, Task, Question und Target gelesen):
  - Abrechnungserstellung inklusive API-Driver;
  - Dashboard;
  - Accessibility (`steps/accessibility.steps.ts`, `tasks/accessibility.ts`, `questions/accessibility.ts`);
  - Sprache (`steps/language.steps.ts`, `tasks/language.ts`, `questions/language.ts`);
  - Rechnungen (`tasks/invoices.ts`);
  - Mieter (`questions/tenants.ts`);
  - Dokumente (`questions/documents.ts`);
  - Gebäude-Detail (`tasks/building-detail.ts`);
  - Mietvertrag-Detail (`questions/contract-detail.ts`).
- **Grep über alle Bereiche:**
  - in steps/: keine Treffer für `page`, `getBy`, `locator`, `expect(`, `@playwright`, `driver`, `.backend`, `abilityTo` und Importe aus `screenplay/` oder `targets/` (nur Kommentare mit dem Wort «page»);
  - in tasks/ und questions/: keine Treffer für `@playwright`, `.page`, `getBy`, `.click(`, `.fill(`, `expect(` und `waitFor`.
- **Verhalten unverändert:** `goToGeneration` prüft die Sichtbarkeit wie zuvor ohne Warten (alt: `isVisible()`). `recordFuelStock` wartet wieder auf `listed + 1` (`Wait.forCount`).

### Punkt 3 im Einzelnen (erfüllt)
- **Runde 1, M-1** (Destrukturieren von `page`, `$eval`, Ketten über `mouse` und `keyboard`, berechnete Aufrufe): gesperrt. Tests in `e2e-screenplay-lint.test.ts:48-57`.
- **Runde 1, Minors:**
  - Assertion-Bibliotheken und Typ-Importe: Tests `:54`, `:61-62`.
  - Targets importieren den Kern nicht mehr: Test `:63`.
  - Tankbestand: `tasks/building-detail.ts:32-40`.
  - API-Gedächtnis wirft: `questions/statement-generate.ts:187-192`.
  - `single()` mit Fristen: `screenplay/questions.ts:279-288`.
  - `ShareInViewport` wie `toBeInViewport`: `questions/contract-detail.ts:20`.
  - Doku: `docs/test-pyramid.md`, `playwright.config.ts:97`, SKILL.md.
  - UI-Wörter: H-18 in `offene-punkte.md`.
- **Runde 2, M-1:**
  - dynamischer Import und `require`, Pfadvarianten, berechneter Zugriff: Tests `:68-92`;
  - `request`-Ketten: `MemberExpression[property.name=request]`;
  - Download-Methoden: in `playwrightActions`.
- **Runde 2, Minors:**
  - Targets lesen nicht: Test `:82`.
  - `quick`-Kommentar: `questions.ts:279-281`.
  - CLAUDE.md nennt keine Ausnahme mehr.
  - Leerzeile in `building-detail.ts`: behoben.
- **Runde 3, M-1** (294aebf):
  - Der Fixture-Block sperrt jeden Member-Zugriff auf `page`, `context`, `browser` und `request` (`eslint.config.js:179-182`) und das Umbenennen beim Destrukturieren (`:183-186`).
  - `fixtures/backend.ts` ruft nur noch `CallTheApi` auf.
  - Meine Proben `page.on`, `request.get`, `context.newPage` und `{ page: p }` in `zzf01.ts` werden alle gemeldet. Die Tests stehen in `:77-80`.
  - Einschränkung: Aliase per Zuweisung gehen weiterhin durch (siehe Minor).
- **Runde 3, Minors:**
  - Targets: `page.on` und `page.request.get` werden gemeldet (`zzg01.ts`).
  - `reachState`: Kommentar steht in `tasks/accessibility.ts`.

### Nicht bestätigt
- E2E-Lauf (629 Tests in chromium + api, gleiche Namen): Laut Auftrag nicht ausgeführt. Belegt ist nur, dass die Features unverändert sind und `bddgen` alle Steps auflöst (617 chromium-Tests).
- `bun run test:coverage`, Backend-Tests, `deepcheck:audit` und `fallow audit`: nicht ausgeführt.
- Ob die eigene Berechnung in `Accessible.nameOf` und `descriptionOf` dasselbe liefert wie `toHaveAccessibleName`: nur gelesen (`screenplay/questions.ts:330-359`).
- Nicht jede Target-Datei habe ich Zeile für Zeile mit dem alten `interactions/` verglichen. Ausserhalb der Stichproben stützt sich das Urteil auf den grünen Lint und den Grep.
