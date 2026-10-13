## Review Screenplay-E2E, Gesamtstand `git diff f1a2f83..62bac41`

### Gesamturteil zu den drei Anforderungen
1. **Muster in allen Bereichen:** erfüllt, soweit ich es gelesen habe. Der Kern, die Fixtures, accessibility/language, die statement-Bereiche und die Stichproben aus den Steps folgen den Schichten. In Steps gibt es keine Verzweigung auf `driver` mehr, und `can(` steht nur noch in `screenplay/abilities.ts`. **Aber:** Der neue Import von BFF-Code in den API-Treiber macht den E2E-Job in CI kaputt (B-1).
2. **Durchsetzung per Lint:** grösstenteils erfüllt. Der Lint läuft sauber, der Fixture-Test ist mit 44/44 grün. **Eine Lücke:** Die ausdrücklich genannte Regel «`driver`-Verzweigung nur über `throughUiOrApi`» ist gar nicht durchgesetzt (M-1).
3. **Gleiche Szenarien:** bestätigt, soweit ohne Lauf prüfbar. Die Features sind unverändert, `bddgen` erzeugt in beiden Ständen 617 `test(`-Einträge mit identischen Titeln. Wo ich Stichproben genommen habe, ist die Strenge gleich oder höher.

**Wo ich die Grenze ziehe:**
- **Realistisch:** direkte Aufrufe auf greifbaren Objekten, Destrukturieren von Fixtures, Muster, die es in f1a2f83 schon gab, gewöhnliche Hilfsfunktionen.
- **Verschleierung, die ich nicht werte:** Methoden in Variablen holen, `Reflect`, Casts auf private Felder, gezieltes Umbenennen, um eine Namensregel zu umgehen.

---

### Blocker

**B-1: Der E2E-Job in CI scheitert schon bei `bddgen`. Grund ist der `$lib`-Import aus dem API-Treiber.**
- **Wo:** `tests/e2e/tasks/statement-generate-api.ts:1` importiert `src/lib/server/statement-generation.ts`. Die Datei bindet `$lib/backend-error`, `$lib/contract-status`, `$lib/paraglide/messages` und `$lib/server/statement` ein. `$lib` löst sich nur über `.svelte-kit/tsconfig.json` auf (`tsconfig.json:2`, `extends`).
- **Was im Job fehlt:** Der Job `e2e-tests` in `.github/workflows/ci.yml:148-161` macht `bun install` (das erzeugt nur Paraglide, über `prepare`) und dann `bun run test:e2e` (`bddgen && playwright test`). Ein `svelte-kit sync` fehlt. Die Jobs fallow und deepcheck haben ihn genau deshalb (`ci.yml:185-186` und `205-206`, mit Kommentar «without it … cannot resolve $lib imports»). `bddgen` lädt alle Step-Dateien und damit diesen Import.
- **Nachweis (im Scratchpad):**
  - `git archive 62bac41`, dazu `bun run i18n`, dann `bunx bddgen` bricht ab mit `Error: Cannot find package '$lib' imported from …/src/lib/server/statement-generation.ts`.
  - Derselbe Ablauf mit `f1a2f83` endet mit Exit 0.
  - Nach `bunx svelte-kit sync` endet auch 62bac41 mit Exit 0.
- **Warum lokal unsichtbar:** Lokal existiert `.svelte-kit/`, also zeigt auch der separate Vollauf das nicht.
- **Folge:** Alle E2E-Szenarien in CI fallen aus, auch a11y.
- **Behebung:** einen Schritt `bunx svelte-kit sync` in den E2E-Job einfügen, oder `test:e2e` zu `svelte-kit sync && bddgen && playwright test` ändern.

### Major

**M-1: Verzweigen auf den Treiber ist nicht per Lint gesperrt.**
- **Was durchgeht:** In `tests/e2e/steps/x.steps.ts` geht `When('x', async ({ verwalter, driver }) => { if (driver === 'api') … else … })` ohne Meldung durch. In tasks/ und questions/ geht `actor.can(CallTheApi) ? a(actor) : b(actor)` durch.
- **Warum realistisch:** Genau dieses Muster stand in f1a2f83: `steps/statement-generate.steps.ts:58,63,72` und `steps/statement-detail.steps.ts:64,134`.
- **Wo:** `eslint.config.js:137-170` (die Blöcke für steps, tasks und questions) kennt weder `driver` noch `.can(`. `src/__tests__/e2e-screenplay-lint.test.ts` hat dafür keinen Fall.
- **Nachweis:** Ich habe beide Fälle mit `ESLint.lintText` gegen die Projektkonfiguration geprüft. Ergebnis: `[]`.
- **Behebung:**
  - in steps/: `ObjectPattern > Property[key.name='driver']` und `MemberExpression[property.name='driver']` sperren;
  - in steps/, tasks/ und questions/: `CallExpression[callee.property.name='can']` sperren;
  - je einen Fall dazu in den Lint-Test.

### Minor
- `eslint.config.js:137-153`: Steps können ohne `sees` prüfen. `const v = await verwalter.answer(q); if (v !== 'a') throw new Error()` bleibt ohne Meldung. `answer` ist in Steps nicht gesperrt, wird heute aber nirgends genutzt.
- `eslint.config.js`: `fetch(…)` in steps/, tasks/ und fixtures/ umgeht `CallTheApi` ohne Meldung. `questions/documents.ts:17` holt den Mail-Catcher per `fetch` ausserhalb einer Ability.
- `eslint.config.js:169-190`: In fixtures/ geht ein Playwright-Aufruf über einen Hilfsparameter durch, etwa `const acceptDialogs = (p) => p.on('dialog', …)`. `on`, `once`, `off`, `close` und `setDefaultTimeout` stehen in keiner Liste.
- fixtures/: Eine Fixture kann über `new Actor(…).whoCan(new BrowseTheWeb(page)).attemptsTo(Click.on(…))` die UI bedienen. Lint lässt das durch, `CLAUDE.md:29` verlangt aber Vorbedingungen nur über die API.
- `questions/apartment-detail.ts:22-26`: `contractHistoryLists` ist eine Ja/Nein-Question, die die Zeilentexte verbirgt. Das widerspricht `tests/e2e/CLAUDE.md:35`; das alte `toHaveText([…])` zeigte die Texte. Genutzt wird sie in `steps/apartment-detail.steps.ts:82` und `steps/tenant-detail.steps.ts:72`.

### Nit
- `questions/amounts.ts:8`: `signedFrancs('Rückerstattung CHF 0.00')` ergibt `-0`, und `toBe` (Object.is) scheitert dann gegen `0`. Bei 0 sind die Labels austauschbar. Kein heutiges Beispiel ist betroffen.
- `questions/statement-detail.ts`: `percent` (parseFloat) akzeptiert «50.00 %», wo das alte `includes('50 %')` scheiterte. Das Format ist damit minimal lockerer.
- `screenplay/abilities.ts:39-43`: Im Fehlerfall wirft der BFF-Code `m.statements_backend_failed` statt URL, Status und Body. Die Diagnose ist schlechter als bei `body()` (`abilities.ts:12`).
- `tasks/statement-detail.ts:19`: Der Kommentar nennt noch `heatingCostsShared`; die Question heisst jetzt `heatingCostsOfTenant`.
- `docs/test-pyramid.md:67`: Dort heisst der API-Treiber «backend API via `tasks/*-api.ts`». Die Erstellung läuft jetzt aber über BFF-Servercode.

---

### Bestätigt
- **Runde-3 M-1 ist geschlossen**, für alle im Bericht genannten Fälle:
  - `page.on`, `page.url`, `context.*`, `browser.newContext` und `request.get` auf Fixture-Parametern sind gesperrt, ebenso das Umbenennen beim Destrukturieren (`eslint.config.js:169-190`, Tests `e2e-screenplay-lint.test.ts:77-80`).
  - `fixtures/backend.ts` ist frei von Playwright; das HTTP liegt in `CallTheApi`.
  - `fixtures/test.ts` reicht `page` und `request` nur an Abilities weiter.
  - Was noch offen ist, steht oben als Minor (Hilfsparameter, `on`).
- **Experten-M-1 ist korrekt und mindestens gleich streng:**
  - Das Betragsformat wird per Regex geprüft, mit dem Tausendertrenner `’`; das NBSP aus `Intl` normalisiert `\s` korrekt.
  - «Kosten» muss jetzt direkt vor dem Betrag stehen (vorher genügte der Betrag irgendwo in der Zeile).
  - Anteil und Betrag der Heizung werden spaltengenau gelesen, über `lineItemCell` mit `nth(3)` und `nth(4)`, entsprechend `CostTable.svelte:64-65`. Das ist strenger als vorher.
  - Die Einzahl/Mehrzahl-Regex passt zu `messages/de.json:996-997`, und der Operatorvorrang in `createdStatements` stimmt.
  - UI und API antworten in derselben Form.
- **Experten-M-2 ist inhaltlich sauber:**
  - Es ist dieselbe `contractsInPeriod`-Regel wie im Assistenten.
  - Die lazy Regex in `CallTheApi.fetch` behält Pfad und Query.
  - `Authorization` wird zu den Headern hinzugefügt (bei GET ist `init` undefined).
  - Die Zahl der erstellten Abrechnungen ist dieselbe BFF-Zahl, die auch die UI zeigt.
  - Einziges Risiko ist der Modulimport, siehe B-1. Mit `svelte-kit sync` lädt das Modul samt `@sveltejs/kit` und Paraglide fehlerfrei (`bddgen` Exit 0).
- **Ausgeführt:**
  - `npx eslint tests/e2e …`: sauber.
  - `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 44/44 grün.
  - `bunx tsc --noEmit -p tsconfig.json`: ohne Fehler.
- **Features und Steps:** Die Features sind unverändert, es gibt in beiden Ständen 32 Step-Dateien, und die erzeugten Testtitel sind identisch.
- **Matcher-Umstellung (Stichprobe):** `toHaveText(string)` wurde zu `toBe`, `toContainText` zu `toContain`. Negativprüfungen mit `toBe(0)` haben einen positiven Anker, etwa in invoices, tenant-detail und dashboard.

### Nicht geprüft
- Kein E2E-Lauf, wie vorgegeben. Ob die 629 Ergebnisse grün sind und ob sich Firefox und WebKit gleich verhalten, habe ich nicht gesehen.
- Nicht jede der 189 Dateien habe ich ganz gelesen.
  - **Vollständig gelesen:** screenplay/, fixtures/, `eslint.config.js`, der Lint-Test, `tests/e2e/CLAUDE.md`, `tasks/accessibility.ts`, `questions/accessibility.ts`, statement-generate und statement-detail (Tasks, Questions, Targets) sowie `questions/amounts.ts`.
  - **Nur stichprobenhaft:** die Steps der übrigen Bereiche. Die meisten targets/ sowie tasks/ und questions/ von buildings, apartments, tenants, invoices, config, language und dashboard habe ich nur per grep geprüft.
- Nicht ausgeführt: `bun run test:coverage`, `bun run check`, das Backend, fallow und deepcheck.
- Ob der Paraglide-Aufruf `m.*()` im Fehlerpfad des BFF-Codes im Playwright-Prozess die richtige Sprache liefert, habe ich nicht ausgeführt.
