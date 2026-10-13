# Code-Review Screenplay-E2E, Endstand fdfa6ef (gesamter Stand `origin/main...HEAD`, kein Delta)

**Ergebnis:** Ein Blocker, kein Major. Das Muster (Punkt 1) und die Lint-Durchsetzung (Punkt 2) halten. Die neue Wert-Question `heatingCosts` liest aber im UI-Pfad einen falschen Anteil. Dadurch schlagen drei Szenarien im Projekt chromium fehl, und der Fix von Experten-M-1 ist nicht wirksam (Punkt 3).

| Punkt | Urteil | Eigener Beleg |
|---|---|---|
| 1 Muster | erfüllt | `bun run lint` und `bun run check` sauber (0 Fehler, 2818 Dateien). Der Lint-/Strukturtest ist grün (134). UI/API wird nur über `throughUiOrApi` und `abilityTo(CallTheApi)` in tasks/ und questions/ gewählt (grep: kein `driver`/`project` in steps/tasks/questions). Kern, Abilities, `sees` = `expect.poll`, Targets und Questions gelesen. Abweichung nur m-5 (eine Ja/Nein-Question über Texte). |
| 2 Erzwingung | erfüllt | Eigene Verstoss-Dateien (zz*, wieder gelöscht) in steps/, tasks/, questions/, fixtures/, targets/, Kern sowie ein Helfer-Ordner und eine `.js`-Datei: Jeder alltägliche Verstoss wird gemeldet. Was durchgeht, ist Minor (siehe unten). |
| 3 Frühere Findings | nicht erfüllt | Alle Major aus Runde 1–12 sind im Code behoben. Belegt durch die zugehörigen Fälle im Lint-Test und eigene Varianten. Experten-M-2 ist teilweise behoben und als H-20 erfasst, M-3 ist behoben. Experten-M-1 ist für `heatingCosts` im UI-Pfad falsch umgesetzt (B-1). Das Archiv führt M-1 trotzdem als «fixed». |

## Blocker

**B-1: `heatingCosts` liest im UI-Pfad den Anteil aus zusammengeklebtem Zellentext; der Anteil wird 0.0043 statt 43**
- Ort: `tests/e2e/questions/statement-detail.ts:35`, `const share = text?.match(/([\d.]+) %/);`
- Ursache: Svelte entfernt den Leerraum zwischen `<td>` in `<tr>`, siehe `src/routes/statements/[id]/CostTable.svelte:63-64`. Der normalisierte `textContent` der Zeile `statement-line-item` lautet deshalb `HeizungHeizprofilCHF 1’000.0043 %CHF 430.00`. Der Regex findet die am weitesten links stehende Zahl vor « %», also `000.0043`. Das ergibt `{ share: 0.0043, amount: 430 }`.
- Folge: Im Projekt chromium (und Firefox/WebKit auf main) schlagen beide Beispielzeilen von «Heizkosten bei Mieterwechsel mit Leerstand» und «Anteil an den Heizkosten des Gebäudes» fehl (`tests/e2e/features/statement-detail.feature:36,51`). Der Step `statement-detail.steps.ts:142` erwartet `{ share: 43, amount: 430 }`. Der API-Pfad ist korrekt. Die vorherige Question nutzte `text.includes('43 %')` und war deshalb grün.
- Beweis, ohne E2E: Ich habe CostTable mit `render` aus `svelte/server` serverseitig gerendert (temporärer Vitest-Test, gelöscht), mit einer Position Heizung, `totalAmount: 1000`, `percentage: 43`, `tenantShare: 430`. Ergebnis: `text = "HeizungHeizprofilCHF 1’000.0043 %CHF 430.00"`, `share = "000.0043"`. Die Kompilierung mit `svelte/compiler` zeigt für Server und Client `<tr><td>…</td><td>…</td></tr>` ohne Leerraum.
- Abhilfe: Die Zellen einzeln lesen statt den Zeilentext zu parsen, etwa ein Target `statementLineItem(category)` + `.locator('td')` mit `Text.ofAll`, oder testids pro Zelle. Danach die drei Szenarien in chromium laufen lassen. Die Vorschauzeile ist nicht betroffen: Dort stehen die Beträge hinter den Wörtern «Kosten», «Nachzahlung» und «Rückerstattung». Geprüft mit `PreviewStep.svelte:122-138` und dem Akonto-Hinweis «Kosten CHF … (25 %)»: Der erste Treffer von «Kosten» ist immer die Gesamtsumme.

## Major

Keine.

## Minor
- `eslint.config.js:292-296`: Die Sperre «seed nur in Given» greift nur in `When(`/`Then(`. `Step('x', async ({ seed }) => seed.sendStatement(…))` und `When('b', send)` mit benanntem Handler gehen durch (zz1.steps.ts, Exit 0).
- `eslint.config.js:256-266`: Web-Questions in `screenplay/questions.ts` sind nur gegen `expect`/`waitFor…` gesperrt. `element.inputValue()`, `innerText()` und `textContent()` warten automatisch (kein `actionTimeout` in `playwright.config.ts`). Ein `element.click()` in einer Web-Question geht ebenfalls durch (Lint Exit 0). Das widerspricht «never wait» bzw. «Questions only ask».
- `eslint.config.js:66-75,375-395`: Die Importregeln für tasks/, questions/, fixtures/ und targets/ sind Sperrlisten, nur Steps haben eine Freigabeliste. `node:http`, `child_process` oder ein neues Paket (`postgres` in einer Fixture, `axios` in einer Task oder einem Target) erreichen Backend oder Datenbank an `CallTheApi` vorbei. H-19 nennt diese Art nicht.
- `docs/archive/implementation-plan-verlauf.md:5168`: «From here on the layers use allowlists» ist zu weit. Freigabelisten gibt es nur für Step-Importe, Page-Methoden im Kern, Selektoren im Kern, Exporte von `target.ts`, Page-Member in Targets und die Ordnerstruktur.
- `tests/e2e/questions/apartment-detail.ts:22-26`: `contractHistoryLists` fasst Texte zu Ja/Nein zusammen. Das widerspricht der neuen Regel in `tests/e2e/CLAUDE.md:35`.
- `docs/archive/implementation-plan-verlauf.md:5225`: Experten-M-1 steht als «fixed», für `heatingCosts` (UI) gilt das nicht (B-1).

## Nit
- `tests/e2e/CLAUDE.md:19`: «Nothing … comes from outside tests/e2e except the backend's PDF reader» stimmt nicht ganz: `fixtures/screens.ts:5-6` liest `tests/a11y/screens.json` (Daten, als Typ-Import).
- `eslint.config.js:283`: `void verwalter.sees(q).toContain('x')` oder ein zugewiesenes `sees` ohne `await` gehen durch. Das ist bewusster Umweg-Charakter.

## Nicht bestätigt
- E2E auf fdfa6ef nicht selbst ausgeführt, wie vorgegeben. Dass B-1 im echten Lauf rot wird, folgt aus dem SSR-Render und der Svelte-Kompilierung, nicht aus einem Playwright-Lauf. Der parallele Lauf sollte genau die drei Testfälle von `statement-detail.feature` zeigen.
- Parsing der Vorschauzeile nur mit konstruierten Strings und dem Template geprüft (`PreviewStep.svelte`), nicht im gerenderten DOM.
- `throughUiOrApi` und `generateStatementsViaApi` (`after.billed - billed`) nur gelesen. Ob das Backend pro Vertrag genau eine Abrechnung anlegt, habe ich nicht geprüft.
- Die Reviews 1–12 habe ich nur in ihren Major-Abschnitten gelesen. Die Fixes habe ich über die Fälle im Lint-Test (alle grün) und eigene Varianten geprüft, nicht jede Minor-Zeile einzeln.
- `.claude/skills/bdd-acceptance/SKILL.md` enthält weiter generische `fixtures/actor`-Beispiele. Laut Zeile 15 gelten sie hier ausdrücklich nicht; nicht weiter geprüft.
- `git status` im Worktree ist am Ende sauber.
