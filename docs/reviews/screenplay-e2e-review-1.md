Review von `git diff f1a2f83..43e177e` (Branch claude/screenplay-e2e, HEAD 43e177e). Den Working Tree habe ich nicht verändert.

**Ergebnis:** Ein Major ist offen, Blocker gibt es keinen. Pattern und Umbau sind vollständig (a, c). Die Durchsetzung per Lint (b) hat aber eine Lücke: In tasks/ und questions/ kommt man über das Destrukturieren der Ability weiterhin an `page`.

Geprüft habe ich so:
- `bunx eslint tests/e2e src/__tests__/e2e-screenplay-lint.test.ts eslint.config.js` ist grün.
- `bunx vitest run src/__tests__/e2e-screenplay-lint.test.ts`: 17 von 17 grün.
- Umgehungen habe ich mit `bunx eslint --stdin --stdin-filename <pfad> -f json` ausprobiert.
- Alle alten `expect`-Aufrufe der Steps habe ich paarweise mit den neuen `sees`-Aufrufen verglichen.

## Blocker
Keine.

## Major

**M-1: Lint-Lücke, tasks/ und questions/ erreichen `page` über Destrukturieren und rufen Playwright-Methoden ausserhalb der Sperrliste**
- Fundstellen: `eslint.config.js:12-24` (Selektoren) und `eslint.config.js:140-155` (Block für tasks und questions).
- **Warum falsch:** Anforderung 2 verlangt, dass jede Verletzung der Schichtregeln scheitert. Gesperrt sind aber nur:
  - `MemberExpression[property.name='page']`,
  - Aufrufe mit Namen aus einer festen Liste.

  Das Destrukturieren über `ObjectPattern > Property[key.name=page]` ist nur für steps/ gesperrt, nicht für tasks/ und questions/. Dort dürfen `BrowseTheWeb` aus `screenplay/abilities` importiert werden (das ist nötig für `throughUiOrApi`/`CallTheApi`). Damit ist die ganze Page offen.
- **Nicht erfasste Aufrufe:**
  - Methoden, die in der Liste fehlen: `$`, `$$`, `$eval`, `content`, `url`, `title`, `on`, `dragAndDrop`, `waitForNavigation`, `all`, `count`, `nth`, `first`.
  - Ketten über `mouse` und `keyboard`, z. B. `page.mouse.wheel()`, `page.mouse.move()`, `page.keyboard.down()`, `page.keyboard.insertText()`. `mouse`/`keyboard` stehen zwar in der Liste, aber nur als aufgerufene Methode, nicht als Zwischenglied.
  - Zugriffe mit berechnetem Namen: `x["click"]()`.
- **Nachweis**, jeweils 0 `no-restricted-*`-Meldungen:
  ```
  printf '%s\n' 'import { BrowseTheWeb } from "../screenplay/abilities"; export const a = async (actor: any) => { const { page } = actor.abilityTo(BrowseTheWeb); await page.$eval("x", () => 1); };' | bunx eslint --stdin --stdin-filename tests/e2e/tasks/zz.ts -f json
  ```
  Ebenso ohne Meldung durchgelassen:
  - in `tests/e2e/tasks/zz.ts`: `p.content()`, `p.dragAndDrop("a","b")`, `p.waitForNavigation()`;
  - in `tests/e2e/questions/zz.ts`: `p.url()`, `p.title()`, `l.all()`;
  - in `tests/e2e/steps/zz.steps.ts`: `x["click"]()`, `l.count()`.
- `src/__tests__/e2e-screenplay-lint.test.ts` deckt keinen dieser Wege ab.
- **Vorschlag:**
  - Den `ObjectPattern`-Selektor für `page|context|browser|request` auch im Block für tasks und questions setzen, oder `abilityTo(BrowseTheWeb)` dort ganz sperren.
  - `MemberExpression[property.name=/^(page|mouse|keyboard|request)$/]` sperren.
  - `MemberExpression[computed=true][property.type='Literal']` sperren.
  - Je einen Fall im Fixture-Test ergänzen.

## Minor
- `eslint.config.js:117-138`: In steps fangen die Regeln Assertions nur ab, wenn sie über den Namen `expect` laufen. Ohne Meldung gehen durch: `import { expect as e } from "vitest"` und `import assert from "node:assert"`. Ebenso Typ-Importe der Form `import("@playwright/test").Page`.
- `eslint.config.js:156-169`: Targets dürfen `screenplay/interactions` und `screenplay/questions` importieren, und `page.$eval(...)` geht ohne Meldung durch.
- `tests/e2e/fixtures/` hat keine Schichtregel:
  - `fixtures/test.ts:23` und `:36` rufen Playwright ausserhalb von screenplay/ und targets/ auf (`addCookies`, `clearCookies`).
  - Eine Fixture könnte den Steps unbemerkt eine Page oder einen Locator geben.
- `tests/e2e/questions/documents.ts:15-20`: Die Question liest den Mail-Catcher per rohem `fetch`, ohne Ability. Lint erkennt `fetch` nicht.
- `tests/e2e/tasks/building-detail.ts:33-39`: Die Prüfung ist schwächer als vorher. Alt hiess sie `toHaveCount(listed + 1)`. Neu wartet der Task nur, bis eine Zeile `nth(listed)` existiert; zwei neue Zeilen fallen nicht mehr auf.
- `tests/e2e/questions/statement-generate.ts:26`: `recall(...) ?? new Map()` verdeckt einen fehlenden API-Lauf. Betroffen sind `noContractsInPeriod` und `statementsInPreview(0)`: Sie würden ohne vorherige Vorschau grün. Alt warf `previewTotals(...)` dann einen TypeError.
- `tests/e2e/screenplay/questions.ts:20-24`: `single()` zählt zuerst und ruft danach `evaluate`, `getAttribute`, `isEnabled`, `isChecked` oder `boundingBox` auf. Diese Aufrufe warten, und es gibt kein `actionTimeout`. Verschwindet das Element dazwischen, hängt die Antwort bis zur Poll-Deadline, statt `null` zu liefern. Die Question blockiert also nicht strikt nie.
- `tests/e2e/screenplay/questions.ts:107`: `ShareInViewport` rundet auf 2 Stellen. Ein Anteil von 0.995 erfüllt damit `toBe(1)`, wo früher `toBeInViewport({ ratio: 1 })` scheiterte (Step in `steps/contract-detail.steps.ts:74-77`).
- Veraltete Doku:
  - `docs/test-pyramid.md:66-67` nennt `fixtures/actor.ts` und `tests/e2e/interactions/`.
  - `playwright.config.ts:97` nennt `tests/e2e/interactions/accessibility.ts`.
  - `.claude/skills/bdd-acceptance/SKILL.md` (Zeilen 15, 31, 92, 98, 198-253) beschreibt noch `interactions/`, `fixtures/actor.ts` und `perform`.
- Features enthalten UI-Wörter, obwohl die neue Regel in `tests/e2e/CLAUDE.md` sie verbietet. Beispiele: `statement-edit.feature:31`, `statement-management-fee.feature:38`, `invoice-new.feature:32,35`, `statement-detail.feature:88` («Feld»). Diese Zeilen gab es schon vorher, aber kein Lint und kein Text setzt die Regel durch.

## Nit
- `tests/e2e/screenplay/interactions.ts:106`: `Wait.until` nimmt immer `.first()`. Früher waren `getByText(...).waitFor()` und `dialogError` strikt.
- `eslint.config.js:126,149`: Die Muster `**/interactions/**` zeigen auf ein Verzeichnis, das es nicht mehr gibt.
- `implementation_plan.md:14,17`: Die Punkte «Areas moved …» und «Ratchet list … removed» sind nicht abgehakt, obwohl der Diff sie umsetzt.

## Bestätigt
- **(a) Pattern:**
  - Den Kern habe ich vollständig gelesen: `screenplay/actor.ts`, `abilities.ts`, `interactions.ts`, `questions.ts`, `target.ts`.
    - Der Actor hat `whoCan`/`can`/`abilityTo`, `attemptsTo`, `answer`, `sees` (über `expect.poll`) und `remember`/`recall`.
    - `Navigate.to` wartet auf `body[data-hydrated]`. Die zurückgehaltenen Skripte sind gleichwertig zum alten `visitWhileLoading`.
  - `fixtures/test.ts` gibt die Ability je nach `driver`.
  - `throughUiOrApi` wird nur in tasks/ und questions/ verwendet (`statement-detail`, `statement-generate`).
  - Die Web-Questions liefern Werte. `Text.of` normalisiert wie `toHaveText` und ist strikt bei mehreren Treffern.
- **(c) Bestand:**
  - `tests/e2e/interactions/` und `fixtures/actor.ts` sind gelöscht.
  - In steps/, tasks/ und questions/ gibt es keine Treffer mehr für `.page`, `perform(`, `driver`, `expect`, `getBy`, `locator` und `@playwright`.
  - In `eslint.config.js` gibt es keine Ausnahmeliste mehr; `noInlineConfig` ist für `tests/e2e/**` gesetzt und per Test belegt.
- **Assertions:** Alle 32 Step-Dateien habe ich paarweise verglichen. Die Abweichungen in der Anzahl kommen von zusammengeführten Driver-Zweigen (`statement-generate`, `statement-detail`, `dashboard`) und von einer aufgeteilten Download-Prüfung (`documents`).
  - Nicht abgeschwächt sind unter anderem:
    - `statusFilterShown`,
    - `contractHistoryLists`,
    - `heatingCostsShared`,
    - `Enabled`/`Checked` (`null` bei fehlendem Element erfüllt `toBe(false)` nicht),
    - `mailsTo`,
    - die Sammlung der Axe- und Sprachbefunde.
  - Die Axe- und Sprachbefunde werden jetzt am Ende statt nach jeder Variante geprüft; das ist gleich streng.
  - Ausnahmen davon stehen unter Minor.

## Nicht bestätigt
- E2E-Lauf und die 629 gleichnamigen Szenarien: nicht ausgeführt, wie vereinbart als gegeben übernommen.
- tasks/ und targets/: Sie sind nur über Lint (grün) und Stichproben geprüft. Gelesen habe ich `accessibility`, `statement-*`, `contract-form`, `apartments`, `authentication`, `building-detail` und `dashboard`. Die übrigen Target-Dateien habe ich nicht Zeile für Zeile mit ihren alten interactions verglichen.
- Ob die eigene Berechnung in `Accessible.nameOf` und `descriptionOf` für alle Felder dasselbe liefert wie `toHaveAccessibleName`/`toHaveAccessibleDescription`: Ich habe den Code gelesen, aber nicht gegen den Browser laufen lassen.
- `bun run lint` über das ganze Repo, `check`, `test:coverage` sowie die fallow- und deepcheck-Gates habe ich nicht ausgeführt.
