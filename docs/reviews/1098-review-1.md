# Code-Review #1098, Runde 1 (origin/main..630d679, ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/buildings/[id]/+page.svelte:82 | `building.accountingPeriod ?? 'calendar'`: der Fallback greift nie. `accountingPeriod` ist in `backend/src/db/schema.ts:43` `.notNull().default('calendar')`, `BuildingWithStats` erbt das Feld nicht optional und `tests/contracts/building.json:14` liefert es immer. Der Code ist ungenutzt, `period={building.accountingPeriod}` reicht. |

Keine Blocker oder Majors.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, Backend-Type-Check, `bunx vitest run --changed origin/main` (1231 grün, vor den zwei letzten kleinen Änderungen), `src/__tests__/buildings-pages.dom.test.ts` (38 grün), i18n/messages/design-guard (529 grün), E2E Chromium building-detail/-edit/-new.feature (44 grün), axe- und Sprachzeilen «building-detail» (23 grün), Rot gesehen bei den Szenariozeilen Juli – Juni und November – Oktober und bei den DOM-Tests, Prettier auf eigenen Zeilen.
- Ob fr/it/en bei der Variante Juli – Juni kein Deutsch zeigen: `building-detail-other-period` deckt nur Ahornweg mit November – Oktober ab (`tests/e2e/fixtures/screens.ts:262-263`, `:355`). Den Text `buildings_fuel_intro_july_june` habe ich nur in `messages/{fr,it,en}.json` gelesen; er enthält kein Deutsch. Da die Variante keine eigenen Bedienelemente hat, braucht sie nach CLAUDE.md keine eigene Zeile, darum kein Befund.

Geprüft: Hilfe je Periode (`fuelStockIntro`), Text des Kalenderjahrs unverändert (`buildings_fuel_intro` byte-gleich, die Zeile `calendar` pinnt laut c645ad4 bestehendes Verhalten). `nextPeriodEnd` mit Grenzfall «heute = Periodenende» (DOM-Zeile 2026-10-31) und Jahreswechsel (Juli – Juni am 04.11.2026 ergibt 30.06.2027). `localToday` in Europe/Zurich, also gleich auf Server und Client. Neue Texte in allen vier `messages/*.json`, Begriffe nach UBIQUITOUS_LANGUAGE/i18n-begriffe. Szenariogrundriss ohne `@wip`, Steps rufen nur Questions und den Seed auf, Questions liefern Text, keine Kollision der neuen Step-Texte. Neue Zeile `building-detail-other-period default` in screens.json, accessibility.feature und sprachen-bildschirme.feature, Platzhalter in screens.ts vorhanden. Testid `fuel-stocks-intro` in kebab-case. Keine neuen Bedienelemente oder Tokens. Kein Diff ausserhalb der Anforderung. `LAST_DAY` wiederholt `FIRST_MONTH` aus `backend/src/services/period-types.ts:7`, aber das Frontend importiert vom Backend nur Typen, darum ist das keine Kopie eines verwendbaren Helpers.
