# Code-Review issue-128, Runde 2 (Delta)

Geprüft: `98516f6..b0b308a` (2 Commits: `88b9d66 docs(i18n): add workflow review for #128`, `b0b308a fix(i18n): apply #128 review round 1`) im Worktree `review-128-code2`. Alle 13 geänderten Dateien gelesen. Dazu gelesen: `formula.service.ts` (`evaluateFormula`, `calculateDistribution`, `validateFormulaForDistribution`), `distribution-key.service.ts` (`ensureValidFormula`, `testFormulaWithSamples`), `routes/distribution-keys.ts`, `src/lib/server/distribution-key.ts` (`testFormula`), `implementation_plan.md`.

## Status der Befunde aus Runde 1

| ID | Schwere R1 | Status | Beleg |
|----|-----------|--------|-------|
| C-1 | Major | behoben | `backend_formula_not_computable` nennt in allen vier Sprachen «… und ihre Summen wie {area_total}» (messages/*.json:418), gleich formuliert wie `backend_formula_unknown_variable` (Zeile 409, de/fr/it/en). Unit-Test `src/__tests__/backend-error.test.ts:141-143` und Szenario `distribution-keys.feature:31` erwarten den neuen Text. `bunx vitest run src/__tests__/backend-error.test.ts` von mir erneut ausgeführt: 13 grün. |
| C-2 | Minor | behoben | `formula.service.ts:392-397`: Ein `FORMULA_NOT_COMPUTABLE` für die erste Musterwohnung bricht die Prüfung mit genau einem Code ab. Da `evaluateFormula` die Variablen durch positive Zahlen ersetzt und der Fehler nur aus dem Parser der Engine kommt, scheitern die anderen Musterwohnungen identisch; es geht also nichts verloren. Mit `bun -e` geprüft: «{area} 2» und «{area} / {area_total} 2» → `[{code:'FORMULA_NOT_COMPUTABLE',params:{}}]`, 1 Fehler; «{area} / ({rooms} - 2)», «{area} - 100», «({area}», «{area}/0» liefern dieselben Codes wie vorher. Da `testFormulaWithSamples` (distribution-key.service.ts:339) ebenfalls zuerst `validateFormulaForDistribution` aufruft, zeigt auch «Formel testen» den Satz jetzt nur einmal (Persona P-2, Teil 1). Test: `formula-codes.test.ts:55-61`. |
| C-3 | Minor | behoben | `docs/api-specification.md:29`: `FORMULA_NOT_COMPUTABLE` ohne `{detail}`, mit Hinweis, dass der Engine-Text nur in `error` steht. |
| C-4 | Nit | abgelehnt (Begründung trägt) | Die Abwesenheit des englischen Texts zeigen `formula-codes.test.ts:47-53` (`params: {}`) und `backend-error.test.ts:132-144` (`toBe`). Einverstanden. |
| C-5 | Nit | behoben | «(+, -, *, /, %)» in allen vier Sprachen. |

## Neue Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-6 | Minor | implementation_plan.md:9-16 | Die Runde 1 ist im Plan nicht festgehalten: keine Zeile `code-reviewer round 1 (docs/reviews/issue-128-review-1.md): …` und keine Persona-Zeile für `helga-issue-128.md` (Workflow 6). Für den neuen Test «nennt eine Formel, die sich nicht berechnen lässt, beim Prüfen nur einmal» und den geänderten Erwartungstext in `backend-error.test.ts` fehlt die Zeile `Test red: …` (Workflow 2 und 6: ein Fix, der Verhalten ändert, braucht zuerst einen roten Test). Dass der neue Backend-Test auf 98516f6 rot wäre, ist plausibel: Runde 1 hat mit `bun -e` vier Codes für «{area} 2» gezeigt. Notiert ist es aber nicht. |
| C-7 | Minor | docs/design/offene-punkte.md:91 (O-24) | O-24 nennt als offen: «Formel testen» liste denselben Fehler einmal pro Musterwohnung, Vorschlag «Report a value-independent error once in the test too». Für `FORMULA_NOT_COMPUTABLE` stimmt das nach diesem Fix nicht mehr, weil `testFormulaWithSamples` über `validateFormulaForDistribution` läuft (siehe C-2). Offen bleiben die Wertabhängigen (z. B. «{area} / ({rooms} - 2)»: `FORMULA_SAMPLE_FAILED` plus `FORMULA_APARTMENT_FAILED` mit demselben Grund) und die unterschiedlichen Musterwohnungen (3 gegenüber 4). Die Zeile beschreibt also teilweise den Stand vor dem Fix. |
| C-8 | Nit | backend/src/services/formula.service.ts:393, 398-401 | `withTotals(cases.map((tc) => tc.variables))` wird zweimal berechnet. Einmal in einer Konstante würde reichen. |

Keine neuen Blocker oder Majors im Delta.

## Weitere Prüfungen am Delta

- Texte: Jede geänderte Meldung steht in allen vier `messages/*.json`, mit formeller Anrede (Prüfen Sie / Vérifiez / Verifichi), ohne «ß». Die Summen sind gleich benannt wie in der bestehenden Meldung zur unbekannten Variable.
- Szenario: `distribution-keys.feature:28-31` ohne `@wip`, Schritte unverändert und nur der erwartete Text angepasst. Keine Änderung an Screenplay-Code und kein neuer UI-Zustand, also keine Einträge in `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature` nötig.
- API: Kein Contract in `tests/contracts` enthält `FORMULA_NOT_COMPUTABLE` (wie in Runde 1). Die Antwortform von `/validate-formula` und `/test-formula` bleibt gleich, nur mit weniger Einträgen.
- Kein Bezug außerhalb der Anforderung: Die Doku-Dateien (Review-Bericht R1, Persona-Bericht, Workflow-Review, O-24) gehören zum Workflow dieses Tasks. Kein Code außerhalb der Fixes wurde angefasst.
- Persona P-1 (Major) betrifft dieselbe Wiederholung wie C-2 und ist auf Backend-Ebene durch `formula-codes.test.ts:55-61` gezeigt. P-5 entspricht C-1 und ist behoben. P-3 und P-4 stehen in O-24.

## Nicht bestätigt

- `bun run lint` (0), `deepcheck:audit` (still), `bun run test:coverage` (2419), `bun run check` (0), `cd backend && bun run test && bun run type-check` (0), E2E `distribution-keys.feature` (9 grün): vom Aufrufer gemeldet.
- `backend/src/__tests__/formula-codes.test.ts`: nicht erneut ausgeführt, weil `bun test` in `backend/` die Testdatenbank neu anlegt (Preload in `backend/bunfig.toml`). Das Verhalten habe ich stattdessen mit `bun -e` gegen `validateFormulaForDistribution` geprüft (siehe C-2).
- Ob der neue Backend-Test vor dem Fix rot war: Im Plan ist das nicht notiert (C-6). Ich habe es nur aus dem `bun -e`-Ergebnis von Runde 1 abgeleitet (vier Codes).
- Wie der Alert mit nur einem Satz in der UI aussieht (Länge, Umbruch bei 390 px): ohne laufende App nicht geprüft.
