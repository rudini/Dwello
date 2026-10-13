## Re-Review Runde 2: `git diff 43e177e..95bfd7f` (Screenplay-E2E)

**Ergebnis:** M-1 ist nur teilweise geschlossen. Ein Major bleibt offen, Blocker gibt es keinen.

**Was ich ausgeführt habe:**
- `bunx eslint tests/e2e src/__tests__/e2e-screenplay-lint.test.ts eslint.config.js` ist grün. Die neuen Regeln treffen keinen bestehenden Code.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 27 von 27 grün.
- Umgehungen habe ich mit `bunx eslint --stdin --stdin-filename <pfad> -f json` ausprobiert. Das Hilfsskript liegt im Scratchpad.

**Zum Working Tree:** Für einen Prettier-Vergleich habe ich kurz `src/__tests__/__tmp_old.test.ts` angelegt und sofort wieder gelöscht. `git status` ist sauber.

### Blocker
Keine.

### Major

**M-1 (Runde 1) ist noch offen: Playwright ausserhalb von screenplay/ und targets/ geht weiterhin durch den Lint**

Die Umgehungen aus Runde 1 sind jetzt alle gesperrt:
- Destrukturieren von `page`,
- `$eval`,
- Ketten über `mouse` und `keyboard`,
- `x["click"]()`,
- `import("@playwright/test").Page`,
- der Import von `BrowseTheWeb`, auch als Namespace-Import.

Neue Umgehungen gehen aber ohne `no-restricted-*`-Meldung durch:

1. **fixtures/ hat keine Schichtregel** (`eslint.config.js:122-180`, kein Block für `tests/e2e/fixtures/**`). Diese Umgehung braucht keine Verschleierung.
   - Nachweis, beide ohne Meldung:
     - `tests/e2e/fixtures/zz.ts`: `import type { Page } from "@playwright/test"; export const save = (page: Page) => page.getByTestId("save").click();`
     - `tests/e2e/steps/zz.steps.ts`: `import { save } from "../fixtures/zz"; …`
   - Eine neue Fixture kann den Steps also eine Playwright-Funktion geben, ohne dass der Lint anschlägt.
   - **Die Ablehnung aus Runde 1 hält damit nicht.** Sie stützt sich darauf, dass Steps `page` nicht destrukturieren können. Das schliesst aber Playwright-Code in fixtures/ selbst nicht aus.
   - Die einzige Stelle, die heute nötig ist, ist `fixtures/test.ts:24` (`page.context().addCookies`). Sie liesse sich über ein Actor-`attemptsTo(Cookies.add(...))` lösen, so wie `besucher` es jetzt schon macht.
   - **Vorschlag:** Für fixtures/ `noPlaywright` ohne die `ObjectPattern`-Regel setzen, denn Fixtures müssen `page` als Parameter nehmen können.

2. **Dynamischer Import und berechneter Zugriff in tasks/ und questions/.** Dieser Code ist gültiges TypeScript, und der Lint meldet nichts:
   ```ts
   const { BrowseTheWeb } = await import("../screenplay/abilities");
   const p = actor.abilityTo(BrowseTheWeb)["page"];
   const by = "getByTestId", act = "click";
   await p[by]("save")[act]();
   return p.url();
   ```
   Die Ursachen:
   - `no-restricted-imports` prüft keine `ImportExpression`.
   - Die Regel für berechnete Namen greift nur bei `Literal` als Aufrufziel, nicht bei einem Member-Zugriff oder einem Identifier.
   - Ebenso ohne Meldung durchgelassen:
     - `el[\`click\`]()`, `(0, el.click)()`, `el.click.call(el)`, `const { click } = el`,
     - `Object.values(w)[0]`, `p.request.post(...)`,
     - die Page-Methoden `p.title()`, `p.content()`, `p.close()`, `p.pdf()`,
     - die Locator-Methoden `count`, `nth`, `first`, `all`, `filter`.
   - Pfadvarianten umgehen das Import-Verbot: `../screenplay/./abilities`, `../screenplay//abilities` und `../screenplay/abilities.js`.
   - In steps/ geht `await import("@playwright/test")` (inklusive `expect`) ebenfalls durch, und `require(...)` auch.
   - **Vorschlag** (in tests/, steps/, tasks/ und questions/):
     - `ImportExpression` und `require` sperren;
     - jeden berechneten Member-Zugriff mit nicht-numerischem Schlüssel sperren;
     - beim Import-Muster `**/screenplay/**/abilities*` verwenden.
   - Je ein Fall gehört in `src/__tests__/e2e-screenplay-lint.test.ts`, auch einer für fixtures/.

### Minor
- `tests/e2e/screenplay/questions.ts:182-186` zusammen mit `interactions.ts:115-120`: Das gemerkte `Download` ist über `actor.recall(DOWNLOAD)` in questions/ erreichbar. `.path()`, `.suggestedFilename()` und `.saveAs()` gehen dort ohne Meldung durch (Nachweis: `questions/zz.ts` mit `actor.recall(DOWNLOAD).path()`).
- `eslint.config.js:175-178`: In targets/ ist nur `playwrightActions` gesperrt. Lesende Aufrufe wie `textContent()`, `isVisible()` und `page.url()` in einem Target gehen ohne Meldung durch, obwohl die Regel «locators only» lautet.
- `tests/e2e/CLAUDE.md:29` nennt den `page`-Fixture-Aufruf «the only Playwright call outside screenplay/ and targets/». Das ist eine dokumentierte Ausnahme, die der Lint nicht absichert (siehe Major, Punkt 1).
- `tests/e2e/screenplay/questions.ts:19-20` (`quick`): Läuft die 1-s-Frist ab, gibt es eine Exception statt `null`. In `sees` (Poll) ist das unkritisch. Fragt ein Task aber direkt per `actor.answer(Value.of/Enabled.of/…)`, scheitert er. Heute gibt es keinen solchen Aufruf (`grep "actor.answer(" tests/e2e/tasks` findet nur `Visibility`, `Count`, `pageAddress`, `pageLanguage` und `look`). Der Kommentar sollte das sagen.

### Nit
- `tests/e2e/tasks/building-detail.ts:13`: Nach dem entfernten Import `fuelStockRow` ist eine Leerzeile mit Tab stehen geblieben. Prettier prüft tests/ nicht und fängt sie deshalb nicht ab.

### Fixes und Ablehnungen aus Runde 1
- **Minor Assertion-Bibliotheken und Typ-Importe in steps:** behoben, und es gibt Tests dafür. Ausnahmen: dynamischer Import und `require` (siehe Major, Punkt 2).
- **Minor Targets importieren den Kern:** behoben (`eslint.config.js:169`), Test vorhanden. `../screenplay/./interactions` wird ebenfalls abgelehnt.
- **Minor Fixtures:** Für `besucher` ist es behoben (`fixtures/test.ts:36-39`). Die Ablehnung für fixtures/ hält nicht (siehe Major, Punkt 1).
- **Minor Mail per `fetch`, abgelehnt:** Die Ablehnung hält. Der Mail-Catcher ist weder Playwright noch die Oberfläche des Systems.
- **Minor Tankbestand:** behoben. `Wait.forCount` (`interactions.ts:109-110`) stellt `toHaveCount(listed + 1)` wieder her. Das ungenutzte `fuelStockRow` ist entfernt.
- **Minor API-Gedächtnis:** behoben (`questions/statement-generate.ts:25-30`). Eine leere Vorschau bleibt korrekt, weil `openPreviewViaApi` immer eine (eventuell leere) Map merkt (`tasks/statement-generate-api.ts:52-53`).
- **Minor `single()` wartet:** behoben, mit 1-s-Fristen auf `evaluate`, `isEnabled`, `isChecked`, `getAttribute` und `boundingBox`. Siehe die Minor zu `quick` oben.
- **Minor `ShareInViewport`:** behoben. Die Bedingung `> 1 - 1e-9` mit `?? 0` entspricht `toBeInViewport({ ratio: 1 })` (`questions/contract-detail.ts:17-21`). Der Step prüft auf `toBe(true)`.
- **Minor veraltete Doku:** behoben in `docs/test-pyramid.md:66-67`, `playwright.config.ts:97` und `.claude/skills/bdd-acceptance/SKILL.md:15`. Für die übrigen Phasen enthält die SKILL.md jetzt einen Hinweis.
- **Minor UI-Wörter:** als H-18 in `docs/design/offene-punkte.md` erfasst. Das ist in Ordnung.
- **Nit `Wait.until` mit `.first()`, abgelehnt:** Die Ablehnung hält.
- **Nit `**/interactions/**`-Muster und Nit Plan-Häkchen:** behoben.

### Nicht bestätigt
- E2E-Lauf, also die unveränderte Wirkung von `Wait.forCount`, den 1-s-Fristen und `ShareInViewport` im Browser: Laut Auftrag nicht ausgeführt.
- Ob 1 s bei langsamem WebKit in CI für `evaluate` auf einem vorhandenen Element reicht: nur gelesen, nicht gemessen.
- `bun run lint` über das ganze Repo, `bun run check`, `test:coverage` und die fallow- und deepcheck-Gates: nicht ausgeführt. Ich habe nur die betroffenen Pfade gelintet und den Lint-Test laufen lassen.
- Ob TypeScript die Pfadvarianten `abilities.js` und `abilities.ts` in diesem Projekt auflöst: nicht geprüft. Die Variante `./abilities` löst es sicher auf.
