# Review #910, Runde 1 (622b0632..ec327571)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/fitness/fitness.ts:313 | `handDeclared` lässt die Spalte `Shared` weg. Laut `tools/arch-baseline/layers.json:25` ist `Shared/Contracts` aber `src/lib/types.ts`, eine Frontend-/BFF-Datei, die Felder von Hand deklariert. `backend/src/api/` liegt in `Backend` (Zeile 22). Ä1 zählt diese Datei darum nicht mehr, obwohl der Entscheid gerade sie zählen will. Ratchet und «Heute» (1 / 5 / 18) beruhen auf dieser Unterzählung. |
| C-2 | Minor | tools/fitness/fitness.test.ts:251-254 | Der Test legt das Weglassen von `Shared` als gewolltes Verhalten fest: `mailCountry` mit `Shared: '1'` muss 5 ergeben. Zusammen mit C-1 anpassen. |
| C-3 | Minor | docs/architecture/utility-tree.md:69 | Die Zeile «Fitness Function» sagt weiter «in höchstens 4 weiteren Produktivdateien». Seit #910 zählen nur Frontend- und BFF-Dateien, die Zeile beschreibt den Check also falsch. |

## C-1 (Major): `src/lib/types.ts` fällt aus der Zählung

Der Entscheid lautet: Ä1 zählt «only in frontend and BFF files that declare a field by hand». Nicht gezählt werden das Backend als Quelle und `backend/src/api/` als Vertrag. Den Vertrag nennt der Entscheid «Shared».

In der Spalte `Shared` von `m4-field-spread.csv` steht aber etwas anderes. `05-knowledge.ts:169` zählt dort `layer(p) === 'Shared/Contracts'`, und `layers.json` ordnet dieser Schicht nur zwei Pfade zu:

- `^src/lib/types\.ts$` (Zeile 25, `kind: prod`),
- `^tests/contracts/` (Zeile 17, Test, wird ohnehin nicht gezählt).

`backend/src/api/` fällt unter `^backend/src/` und damit unter `Backend` (Zeile 22). Wenn `handDeclared` `Shared` weglässt, schliesst es also nicht den Vertrag aus, sondern die gemeinsame Frontend-/BFF-Typdatei.

Diese Datei deklariert Felder von Hand. Ein Beispiel ist `src/lib/types.ts:147-153` (`MonthlyCosts`): Dort stehen `baseRent`, `additionalRent` und `flatRateUtilityCharge`, alles Felder von `rentalContracts` (schema.ts:146-150), ohne Ableitung aus dem Backend-Typ. Dasselbe gilt für die Gebäude- und Register-Typen ab Zeile 52 (`egid`, `street`, `yearBuilt`, `buildingType` …).

So zeigt es sich:

1. `bun run fitness` laufen lassen oder `05-knowledge.ts` in ein temporäres `ARCH_OUT` schreiben.
2. In `m4-field-spread.csv` die Zeile `rentalContracts.flatRateUtilityCharge` ansehen: `where` enthält `src/lib/types.ts`, `Shared` ist 1, `FE + BFF` zählt die Datei nicht.

Ein neues Feld, das jemand in `src/lib/types.ts` von Hand nachträgt, löst darum auch keine `new-field`-Warnung aus.

In den Phase-0-Daten (eingecheckte CSV vom 24.10.) tauchte `src/lib/types.ts` in 67 von 125 Zeilen auf. Mit ihr ergäben sich Median 2 und P90 11 statt 1 und 10.

Korrektur: `+row.FE + +row.BFF + +row.Shared` verwenden. Dann ratchet und Doku neu messen: fitness-functions.md Zeilen 12 und 131, utility-tree.md Zeile 68, baseline.md Zeile 357.

Falls «Shared» im Entscheid auch `src/lib/types.ts` meinen sollte, widerspricht das dem Wortlaut «frontend and BFF files that declare a field by hand». Dann gehört die Frage als Produktentscheid in #910.

## Nicht bestätigt

- Die genauen heutigen Werte mit `src/lib/types.ts`: Ich habe den Messlauf nicht gestartet, weil er Dateien schreibt. Abgeschätzt ist der Unterschied aus der eingecheckten, veralteten `tools/arch-baseline/out/m4-field-spread.csv` (a920150e, vor #843).
- `bun run lint`, `bun run check`, `bunx vitest run tools/` (337 bestanden) und `bun run fitness` (1 / 5 / 18, keine Findings): vom Aufrufer gemeldet. Neu laufen lassen habe ich nur `bunx vitest run tools/fitness/fitness.test.ts` (30 bestanden).

Geprüft: `measure` und `newFields` nutzen dieselbe Zählung. Das Ratchet wurde nur bei `fieldSpread` verschärft, die Ziele und `NEW_FIELD_MAX` sind unverändert. `07-tables.ts` und `prod_files` bleiben für die Baseline über alle Schichten. Kein Szenario, keine UI- oder Message-Änderung, kein Diff ausserhalb der Anforderung. Der neue Test wäre ohne die Änderung rot (9 statt 5).
