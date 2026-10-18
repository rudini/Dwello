# Slice-Review W8b, Runde 2 (Abschluss vor dem Push): Tankbestand-Prüfungen

Worktree `review-w8b-code2`, Commit da8ac3d. Geprüft: 76989a8 (Fixes aus Runde 1, Fach-Review 2, Personas), 8115654 (Merge von origin/main, Konfliktauflösung), da8ac3d (V-16). Alle Code-, Test-, Text- und Doku-Dateien dieser Commits gelesen (ohne `docs/reviews`, `docs/design/personas`); die Merge-Auflösung über `git show --cc 8115654` und `git diff origin/main da8ac3d` geprüft.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Nit | backend/src/services/invoice-completeness.service.ts:149-150 | Kommentar von `changeFinding` nach V-16 nicht nachgeführt: «with both years' readings their consumption, only while both are above zero». Jetzt sperrt schon **ein** Jahr mit Ständen und Verbrauch ≤ 0 den Vergleich, auch wenn das andere Jahr nur Einkauf hat. «a negative consumption has its own hint» stimmt nur für das laufende Jahr, nicht für das Vorjahr. |
| C-9 | Nit | backend/src/services/invoice-completeness.service.ts:152-154 | Ponytail `shrink`: die zwei Sperren lassen sich zu einer Zeile zusammenfassen: `if ((stockNow && base.current.total <= 0) \|\| (stockBefore && base.previous.total <= 0)) return null;` (net −1). |

Keine Blocker, keine Majors.

## Geprüfte Punkte

- **V-11** (`covered`, fuel-stock.service.ts:42): `>` statt `>=` plus `Number(opening?.amount) > 0`. Nachgerechnet: Stand 0 am Tag vor der Periode → nicht `covered` → kein Befund bei `noTank`; Anfangsbestand > 0 → Endbestand bleibt verlangt (V-1-Test :164 bleibt grün). `covered` wird nur in `stockFinding` zusammen mit `noTank` gelesen (:232), `fuelStockChange` liest nur `opening`/`closing`: Gebäude ohne «Kein Tank» bleiben unverändert. pg-Test «verlangt nach dem Jahr der Stilllegung keinen Tankbestand mehr» wäre mit `>=` rot (Stand 2024-12-31 deckt 2025 → Befund `stock`). Szenario «Nach dem Jahr der Stilllegung …» wäre ohne Änderung rot (Befund `stock` → Bestätigung verlangt); positiver Anker «1 erfasste Rechnung». JSDoc und Migrationskommentar (C-4) stimmen jetzt mit dem Code.
- **V-12** (76989a8): `stockNow && current ≤ 0` sperrt; pg-Test «vergleicht einen negativen Verbrauch nicht mit dem Einkauf des Vorjahres» erwartet `['consumption']`, vorher kam zusätzlich `deviation` (change −1300) → rot ohne Änderung.
- **V-16** (da8ac3d): `stockBefore && previous ≤ 0` sperrt; pg-Test: Vorjahr 100 + 0 − 400 = −300, jetzt Einkauf 1000; vorher `deviation` mit −433 % (|1300| ≥ 100, nicht ≤ −75) → rot ohne Änderung; der Filter `kind !== 'stock'` blendet den echten fehlenden Endbestand 2024-12-31 aus.
- **Anna P-1 / V-13** (CategoryCheck.svelte): `compared` nur bei einem Befund ausser `stock`/`consumption`; `tank` erreicht CategoryCheck nicht (PreviewChecks.svelte:40 filtert ihn). DOM-Test prüft Titel «Tankbestände prüfen» (erstes `<p>` ist der Alert-Titel, Alert.svelte:31) und das Fehlen des Einleitungssatzes; ohne Änderung kam der Vergleichstitel → rot.
- **Helga P-1**: Hilfetext in allen vier `messages/*.json`, Unit-Test building-form.test.ts prüft den neuen Satz. Übersetzungen V-14/V-15 in fr/it/en, Begriffszeile in i18n-begriffe.md mit #315.
- **C-1** API-Spezifikation: `stock`/`tank`/`consumption` beschrieben, deckt sich mit `stockFinding`, `tankQuestion`, `changeFinding`. **C-3** Route-pg-Test PUT `noTank: true` + GET. **C-4**, **C-5**, **C-7** erledigt. C-2, C-6 offen gelassen (Minor/Nit, im Plan vermerkt).
- **Merge 8115654**: `src/lib/server/building.ts` ohne `latitude`/`longitude`, wie main sie aus `Building` entfernt hat; beide Loads nutzen `toBuilding`, `git diff origin/main da8ac3d` zeigt in den Loads nur den Mapper-Ersatz (Felder identisch plus `noTank`). E2E-Targets/Questions/Steps: Exporte beider Seiten erhalten (`buildingMap`/`shownMaps` von main, `noTankValue`/`tankOfBuilding`, `periodRunning`/`missingStockFindings` und `wizardPresetNotice`/`presetNoticeText`). Migration als `0013_building_no_tank.sql`, keine verbliebene Referenz auf `0011_building_no_tank` ausser in Review-Berichten; `migrate.ts` wendet nach Dateinamen an, 0011/0012 von main bleiben unberührt. Vertrag `building.json` unterscheidet sich von main nur um `noTank`.
- Keine unverwandten Änderungen in den Fix-Commits; Plan nachgeführt.

## Ponytail-Review

- `backend/src/services/invoice-completeness.service.ts:L152-154`: shrink: zwei Sperren und Hilfsvariable für eine Bedingung (C-9). Eine Zeile mit `||`, `tank` nur noch für die Art.

net: -1 Zeile möglich.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht erneut ausgeführt: auf 8115654 `bun run lint`, `bun run check`, `bunx vitest run` (2720 pass), `cd backend && bun run type-check`, `cd backend && bun run test` (762 pass, 94.3 % Zeilen), E2E chromium statement-generate, building-edit, building-detail, building-new (57 pass); auf da8ac3d `bun run lint`, Backend-Type-Check, fuel-stock/invoice-completeness pg- und Unit-Tests (66 pass).
- Selbst nichts ausgeführt: `bunx vitest run` im Worktree scheitert, weil `node_modules` auf `/home/user/Dwello/node_modules` zeigt und dieser Zugriff gesperrt ist. Rot/Grün der neuen Tests nur durch Lesen und Nachrechnen beurteilt.
- E2E statement-generate lief nur auf 8115654, nicht auf da8ac3d. V-16 sperrt zusätzliche Vorjahresvergleiche; dass kein bestehendes Szenario einen solchen Hinweis erwartet, habe ich nur über die Fallkonstellation (Vorjahr mit Ständen und Verbrauch ≤ 0) abgeschätzt, nicht ausgeführt.
- Das Szenario «Nach dem Jahr der Stilllegung …» liegt beim Vorjahresvergleich genau auf der Schwelle (800 Verbrauch 2023 gegen 1000 Einkauf 2024: Änderung 200 = 25 %, `<=` → kein Hinweis). Für seine Prüfungen (Rechnungszahl, keine Bestätigung) ist das ohne Einfluss, da ein `deviation`-Hinweis keine Bestätigung verlangt.
- Eine lokale Entwicklungsdatenbank, die auf diesem Branch schon `0011_building_no_tank.sql` angewendet hat, würde `0013_building_no_tank.sql` erneut versuchen (`ADD COLUMN` ohne `IF NOT EXISTS`); betrifft nur nicht gepushte lokale Stände, nicht geprüft, ob eine solche existiert.
