# Slice-Review W8b, Runde 1: Tankbestand-Prüfungen im Abrechnungsassistenten

Worktree `review-w8b-code`, Commit 7e98aaa, Bereich `git diff 2287599 7e98aaa` (083188b @wip-Szenarien, 7e98aaa Umsetzung). Alle 46 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | docs/api-specification.md:123 | `GET /completeness/:buildingId` nennt weiter `kind: stock \| tank \| missing \| gap \| new \| deviation`; die neue Art `consumption` (#73) fehlt, die Bedeutung von `stock` (nur noch fehlender Stichtag) ist nicht nachgeführt. |
| C-2 | Minor | tests/a11y/screens.json:134-140, 377-390 | Neue Varianten ohne eigene Zeile: Gebäudeseite mit Fakt «Tank: Keiner oder stillgelegt» (`building-no-tank`) und Vorschau mit Verbrauchshinweis (`statements_finding_consumption_more/less`, Titel «Tankbestände prüfen» ohne Vorjahr, V-4). Gleiche Komponenten wie bestehende Zustände (axe-seitig unkritisch), aber `sprachen-bildschirme.feature` prüft diese Texte in fr/it/en nicht. Als Minor gewertet, weil kein neuer Bildschirm oder Dialog, sondern Inhalt bestehender Zustände (`default`, `category-check`). |
| C-3 | Minor | backend/src/routes/buildings.ts:49 | Kein Backend-Test (Route, `*.pg.test.ts`), dass `PUT/POST /buildings` `noTank` annimmt, speichert und `GET /buildings/:id` es zurückgibt; die pg-Tests setzen `noTank` direkt per `db.update` (fuel-stock.pg.test.ts:124, 138, 147). Gezeigt nur über E2E (building-edit.feature, `seed.noTank`). |
| C-4 | Nit | backend/migrations/0011_building_no_tank.sql:4 | Kommentar «a period with an opening or closing reading still needs both» ist enger als der Code: `covered` (fuel-stock.service.ts:220) gilt bei jedem Stand ab dem Tag vor Periodenbeginn, auch einem weit späteren. Entspricht V-1 («vom Tag vor der Periode an»), nur der Kommentar weicht ab. |
| C-5 | Nit | src/routes/statements/generate/CategoryFindingItem.svelte:9 | Kommentar «a missing reading is captured, a negative consumption checked» nicht nachgeführt: der Link «Tankbestände prüfen» gilt jetzt auch für den Vorjahresvergleich des Verbrauchs. |
| C-6 | Nit | tests/e2e/questions/statement-generate.ts:118 | `missingStockFindings = Count.of(categoryFinding('Tankbestand am'))` missbraucht den Parameter «Kategorie» des Targets als Textfilter; ein eigenes Target (`category-finding` mit Text «Tankbestand am») wäre lesbarer. |
| C-7 | Nit | implementation_plan.md:5 | Doppelte Leerzeile vor `## Session`. |

Keine Blocker, keine Majors.

## Geprüfte Anforderungen

- **#136** (fehlender Stichtag nach heute, Schweizer Tag): `stockFinding` filtert `missing` mit `day <= swissToday()` (invoice-completeness.service.ts:305-306); Anfangsbestand und negativer Verbrauch bleiben. pg-Tests: Periode nach heute (`onDay('2026-12-30')`, :53) gegen gestern beendet (`onDay('2027-01-01')`, :46), Anfangsbestand in laufender Periode (:57). Szenario «Laufende Periode verlangt keinen Endbestand» mit Warnung, keinem Tankbestand-Befund (V-7) und ohne Bestätigung; ohne Änderung rot (fehlender Endbestand → Befund und Bestätigung).
- **#72**: Migration 0011, `schema.ts`, Route-Schema, `parseBuildingForm` (`formData.has`), Checkbox aus `$lib/ui` mit sichtbarer Hilfe, Fakt in `BuildingFacts`, Link aus der Tankfrage zum Formular. `periodReadings` liefert jetzt auch ungedeckte Perioden mit `covered`; `noTank && !covered` → kein Befund, keine Tankfrage; mit Ständen ohne Eigenschaft → Befund «fehlt» (pg :107, Szenario «Ein vergessener Tankbestand fällt auf», ohne Änderung rot). V-1: Endbestand im Jahr der Stilllegung verlangt (pg :135, Szenario «Im Jahr der Stilllegung …»). Die übrigen Aufrufer von `periodReadings` (`fuelStockChange`) bleiben gleich, weil sie nur `opening`/`closing` lesen. Unit-/DOM-Tests: Formular (checked), Parser, Mapper (`noTank` aus `building.json`), Fakt, Link.
- **#73**: negativer Verbrauch als `consumption` ohne Bestätigung (`lacksInvoices` kennt nur `missing/gap/stock`, statement-wizard.ts:250); Vorjahresvergleich als `consumption` nur, wenn beide Jahre `isFuelStock` haben und beide Summen > 0 (V-2, `changeFinding`), Schwellen > 25 % und ≥ CHF 100 wie `deviation`; sonst `deviation`. pg-Tests :68, :77, :92, :162 (ein Befund pro Kategorie), Texte in statement-wizard.test.ts, DOM ohne Bestätigung und Titel ohne Vorjahr (V-4), Szenarien für beide Hinweise; ohne Änderung rot (Art, Text, Bestätigung).
- **#61**: Marker in FuelStocks.svelte entfernt; `No scenario` im Plan begründet.
- **Ein Mapper**: `src/lib/server/building.ts` ersetzt beide Kopien identisch (plus `noTank`); getestet über den Detail-Load in buildings-i18n.test.ts.
- Texte: alle neuen und geänderten Schlüssel in allen vier `messages/*.json`; Begriffe nach `UBIQUITOUS_LANGUAGE.md` (Tankbestand, Stichtag, Heizmaterial, Anfangs-/Endbestand) und `i18n-begriffe.md` (stock de combustible, scorta di combustibile). Vertrag `building.json` ergänzt.
- Design: nur Token-Klassen, Links `min-h-12`, Checkbox aus `src/lib/ui`, Label und Hilfe sichtbar.
- Sicherheit: `noTank` per `t.Boolean()` validiert, keine neue Datenweitergabe.
- E2E: Schritte rufen nur Tasks/Questions; Questions liefern Text bzw. Anzahl; Negativprüfungen mit positivem Anker (Warnung laufende Periode, «1 erfasste Rechnung»); Task `recordNoTankFromQuestion` wartet auf die URL; Features ohne UI-Wörter; bestehende Szenarien unverändert.

## Ponytail-Review

- `src/routes/statements/generate/CategoryFindingItem.svelte:L9`: delete: veralteter Kommentar (C-5). Neuer Kommentar oder keiner.
- `tests/e2e/questions/statement-generate.ts:L118`: reuse mit falscher Bedeutung (C-6). Eigenes Target, gleich lang.
- Sonst schlank: `changeFinding`/`changeText` teilen die Logik von `deviation` und `consumption` statt sie zu kopieren, `hasFuelStocks` entfällt, der doppelte Gebäude-Mapper ist entfernt.

net: -1 Zeile möglich.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `cd backend && bun run test` (734 pass, 94.1 % Zeilen), `bunx vitest run` gesamt (2696 pass), E2E chromium für statement-generate.feature, building-edit.feature, building-detail.feature, die accessibility/sprachen-bildschirme-Zeilen für building-new, building-edit, building-detail, statement-generate (40 pass), fallow audit.
- Selbst erneut ausgeführt und grün: `bunx vitest run` für statement-wizard.test.ts, statement-wizard.dom.test.ts, building-form.test.ts, buildings-i18n.test.ts, buildings-pages.dom.test.ts (129 pass).
- Ob das Szenario «Laufende Periode …» an jedem Kalendertag hält (Periode über den Jahreswechsel, Zeitzonengrenze um Mitternacht zwischen `inDays` und `swissToday`): nur durch Lesen von tests/e2e/fixtures/dates.ts und today.ts geprüft, beide rechnen mit Europe/Zurich.
- V-6 (Stichtag gleich heute am letzten Periodentag) laut Plan «recorded»; wo festgehalten, habe ich nicht geprüft (Fach-Review-Minor, kein Befund dieses Reviews).
