# Code-Review Runde 2 (Abschlussrunde): #100 «Brennstoff» (59739a08..c66beba1)

Worktree: `/tmp/claude-0/-home-user-Dwello/6a612fe5-db6f-5ef4-85c5-983800bc9434/scratchpad/review-w16-code2` (detached, c66beba1). Gelesen habe ich alle 28 Dateien des Deltas. Zusätzlich gelesen: `HeatingChoice.svelte`, `category.service.ts` (create/update), `fuel-stock.service.ts:105-112`, `routes/categories.ts:36-37`, `fuel-stock.pg.test.ts:285-324`, `category-admin.pg.test.ts:40-71`, `api-contracts.pg.test.ts:140-155`, `fixtures/screens.ts:95-198`, `screenplay/actor.ts` (`sees` pollt), `questions/form.ts`, `targets/accessibility.ts`, `tests/e2e/CLAUDE.md` «Rules», `i18n-begriffe.md:48` sowie `w16-review-1.md` und `w16-fachreview-2.md`.

## Befunde (offen und neu)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Nit | `src/routes/config/categories/HeatingChoice.svelte:17-26` | Aus Runde 1, bewusst offen gelassen (V-5-Rest). |
| C-9 | Nit | `tests/e2e/steps/building-detail.steps.ts:117-123` | Aus Runde 1, bewusst offen gelassen. |
| C-12 | Minor | `backend/src/services/category.service.ts:173,191`; `src/__tests__/categories.test.ts:159-170` | Seit C-7 hält nur noch das Backend die Regel «Brennstoff nur mit Heizkosten». Dafür hat es aber keinen Test: Der entfernte BFF-Testfall (`isHeatingCost: ''` → `isFuel: false`) war die einzige Prüfung. `fuel-stock.pg.test.ts:309` prüft nur die Ablehnung bei Tankbestand. Ein POST mit `{ isFuel: true }` ohne `isHeatingCost` und ein PUT `{ isHeatingCost: false }` ohne Tankbestand sind ungeprüft. Ein Umbau von Z. 173 zu `isFuel: !!data.isFuel` bleibt in allen Tests grün. Danach nimmt `isFuelCategory` (prüft nur `fuel && allowed`) einen Tankbestand für eine Kategorie ohne Heizkosten an. Vorschlag: ein `it.each` in `category-admin.pg.test.ts` (POST ohne Heizkosten, PUT `isHeatingCost: false`), jeweils mit `isFuel === false`. |
| C-13 | Nit | `backend/src/__tests__/migrations.pg.test.ts:220-222` | Kommentar und Testname sagen noch «jede Kategorie, die schon einen Tankbestand hat» bzw. «Kategorien mit Tankbestand». Seit V-9 gilt das nur für Heizkosten-Kategorien, und der Test prüft auch genau das («Gas» bleibt aussen vor). |
| C-14 | Nit | `tests/e2e/steps/categories.steps.ts:85` | Der neue Dann-Schritt fragt mit `errorMessageShown(message)` nur Ja/Nein (`Visibility`). Schlägt er fehl, sieht man «false» statt der Meldung, die angezeigt wurde. Das Muster gibt es in der Datei schon (Z. 184, 245); deshalb nur ein Nit. |

Keine Blocker, keine Major.

Ponytail: Das Delta ist schlank (C-7 hat 1 Zeile und 1 Testfall entfernt). Lean already. Ship.

## Erledigt aus Runde 1 (am Code geprüft)

- **C-1:** Szenario `categories.feature:139-144` ohne `@wip`. Die Steps rufen nur `seed`, Tasks und Questions. Die Daten sind isoliert: Kategorie über `addCategory` mit eindeutigem Namen; der Tankbestand steht per `extras.unshift` vor der Kategorie und dem Gebäude und wird zuerst aufgeräumt (`fixtures/backend.ts:423-429`). Der Zustand `category-edit-fuel` mit `default` und `fuel-refused` steht in `screens.json` (mit Eintrag in `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Der Task `fuel-refused` wartet auf `formProblem`.
- **C-2, C-8:** `git diff 0f3d5d1d c66beba1` auf die drei Zeilen zeigt keine Formatänderung mehr, und `category.service.ts:193` ist sauber.
- **C-3:** `docs/api-specification.md:29,60,109-110` stimmen mit `routes/categories.ts:36-37` und `category.service.ts:173,191-194` überein.
- **C-5/V-10, V-11, V-12, V-13:** Die Texte sind in allen vier `messages/*.json` geändert. fr «maintenance» und en «servicing» entsprechen `i18n-begriffe.md:48`. Die Unit- und DOM-Tests prüfen den deutschen Wortlaut: `categories.test.ts:318`, `buildings-pages.dom.test.ts:329`, `categories-page.dom.test.ts:607`.
- **C-6/V-9:** `0024_category_fuel.sql:10` verlangt jetzt `is_heating_cost`, und der Migrationstest deckt das mit «Gas» ab. Eine Kategorie mit Tankbestand, aber ohne Heizkosten, nimmt wie vor #100 keinen neuen Stand an. Das ist also keine Verschlechterung. Die Migration ist neu in diesem Branch und nicht auf `main` angewendet.
- **C-7:** `src/lib/server/category.ts:76` reicht `isFuel` ungefiltert durch. Wird «Heizkosten» weggenommen, entfernt `{#if heating}` in `HeatingChoice.svelte` das Häkchen aus dem Formular, und das Formular sendet `isFuel` nicht mit. Zur fehlenden Testabdeckung siehe C-12.
- **C-10 (abgelehnt):** Die Ablehnung hält. `api-contracts.pg.test.ts:150` legt vor dem PUT einen eigenen Stand an; auch ein 409 lässt einen Stand zurück.
- **C-11:** Die Dateiliste in `implementation_plan.md` ist ergänzt.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (3031), `cd backend && bun run test` (942) und die E2E-Läufe (65 und 38+4 Bildschirmzeilen): vom Aufrufer gemeldet. Neu ausgeführt habe ich nur `bunx vitest run src/__tests__/categories.test.ts src/__tests__/categories-page.dom.test.ts src/__tests__/buildings-pages.dom.test.ts`: 115 bestanden. Backend und E2E habe ich laut Auftrag nicht ausgeführt.
- Ob das neue Szenario «Eine Kategorie mit Tankbestand bleibt Brennstoff» rot wird, habe ich nur durch Lesen beurteilt, nicht vorgeführt. Ohne die Regel in `category.service.ts:192` würde der PUT gespeichert, `form-error` erschiene nicht, und `sees(...).toBe(true)` liefe in den Poll-Timeout. Es sollte also rot werden. Der Aufrufer meldet es als nicht rot gesehen.
- Wie sich der zusätzliche Seed (Gebäude «Holzhof», Kategorie «Pellets» mit Tankbestand, `fixtures/screens.ts:135-137`) auf alle übrigen Bildschirmzeilen auswirkt (axe, Sprachprüfung): Der Aufrufer meldet nur die Zeilen von buildings, categories, building-detail, audit-log, dashboard und category-edit-fuel als grün. Die übrigen Zeilen von `accessibility.feature` und `sprachen-bildschirme.feature` sind nicht bestätigt.
- Die Wirkung von fr, it und en habe ich nur gegen `i18n-begriffe.md` geprüft, nicht sprachlich.
