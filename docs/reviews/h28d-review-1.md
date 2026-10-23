# Code-Review H-28 (#717), Slice «Kennzeichen aus dem Laufplan», Runde 1

Bereich: `git diff 2c6c7e656 e9ac0eabc` (ohne docs/reviews, implementation_plan.md, docs/archive), Worktree `review-h28d-code`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| H-1 | Major | src/__tests__/statement-endpoints.test.ts:313-328, src/__tests__/statement-generate-actions.test.ts:9-15, 148-159 | Zwei bestehende Unit-Tests, die `tests/contracts/statement-run.json` bzw. den Laufplan nachbilden, sind nach dem Diff rot; der Aufrufer hat sie nicht laufen lassen. |
| H-2 | Minor | docs/api-specification.md:266 | `GET /statements/run` ist weiter als `→ { contracts, overlap, skipped }` beschrieben: `withoutFee` und die Felder `movedOut`, `fixedTerm`, `shortenedTo` je Mietvertrag fehlen. Die Doku stimmt damit nicht mehr. |
| H-3 | Minor | src/lib/server/statement-generation.ts:13-15, 19; src/lib/contract-status.ts:19 | Übrig gebliebener, ungenutzter Code: Der BFF-Typ `Contract` führt noch `startDate`, `endDate`, `billedUntil` und `managementFeeAgreed`, die nach dem Diff nirgends mehr gelesen werden (`terminated` wurde entfernt, diese vier nicht). `billingStart` wird ausserhalb von `contract-status.ts` nicht mehr importiert, das `export` ist also überflüssig. |

## H-1 (Major): zwei Unit-Tests sind rot

**Warum es falsch ist:** Laut CLAUDE.md («Before marking anything complete») müssen die Tests laufen, die eine geänderte Datei lesen. `statement-endpoints.test.ts` und `statement-generate-actions.test.ts` importieren beide `tests/contracts/statement-run.json` und bilden `/statements/run` nach. Gemeldet wurden aber nur `statement-generation.test.ts` und `statement-wizard.dom.test.ts`. CI wird rot.

- `statement-endpoints.test.ts:313` spreizt `...statementRun` in die Backend-Antwort. Damit kommt das neue `withoutFee: [{ id: 'c3', … }]` aus dem Contract mit, und der BFF gibt es jetzt unverändert weiter. Der Test erwartet aber `withoutFee: []` (Z. 327). Auf der Basis hat der BFF `withoutFee` selbst aus `c1` berechnet (billed, daher `[]`).
- `statement-generate-actions.test.ts:148`: Der Mock `plan([befristet])` (Helfer Z. 9-15) liefert kein `fixedTerm`. Der BFF hat es auf der Basis aus `endDate: '2099-12-31'` selbst berechnet und übernimmt es jetzt aus dem Plan. Ergebnis `[false]` statt `[true]` (Z. 159).

**So zeigt man den Fehler:** `bunx vitest run src/__tests__/statement-endpoints.test.ts src/__tests__/statement-generate-actions.test.ts` auf e9ac0eabc. Ergebnis: 2 failed (`GET /api/statements/billed > zählt je Gebäude …` und `Vorschau der Abrechnungen > sagt pro Gebäude, ob ein laufender befristeter Mietvertrag abgerechnet wird`). Selbst nachgeprüft.

**Behebung (nur Tests):** In `statement-endpoints.test.ts` `withoutFee: []` in den Mock setzen oder `statementRun.withoutFee` erwarten. Im Actions-Test `fixedTerm: true` am Plan-Eintrag `befristet` setzen und den Helfer `plan` um die neuen Felder (`movedOut`, `fixedTerm`, `shortenedTo`, `withoutFee`) ergänzen, so wie es `backend()` in `statement-generation.test.ts` schon tut.

Geprüft: Die vier Regeln verhalten sich wie vorher. `movedOut` und `fixedTerm` sind wörtlich übernommen. `shortenedTo` liefert dasselbe wie das alte `billedUntil`, weil `shortens` ein gesetztes `billedUntil` voraussetzt. `billingStart` im Backend entspricht dem des BFF für `YYYY-MM-DD`. `withoutFee` filtert wie bisher `!billed && !managementFeeAgreed`. `swissToday()` und `localToday()` sind identisch (Europe/Zurich, sv-SE). Der zweite Aufrufer von `planRun` (`apartmentProfile`) ist von den Zusatzfeldern nicht betroffen. Contract und Drift-Test sind passend erweitert, und `c1` im Beispiel ist in sich stimmig (beendet 2024-03-31, gekündigt, also `movedOut` true und `fixedTerm` false). Ohne die Änderung wären die neuen Tests rot: die vier Backend-Tests mangels Feldern, die beiden BFF-Tests, weil ihre Kennzeichen nicht aus den Daten folgen. Keine UI-Texte, keine neuen Zustände, kein E2E-Diff. «No scenario» ist vertretbar, weil sich das Verhalten nicht ändert.

## Nicht bestätigt

- bun run check, eslint auf den zwei Frontend-Dateien, Backend-Type-Check, Backend-Tests (statement-run, statement-run.pg, api-contracts.pg, invoice-completeness.pg), bunx vitest statement-wizard.dom.test.ts, E2E statement-generate.feature (chromium und api) und fallow audit: vom Aufrufer gemeldet, nicht selbst wiederholt.
- bunx vitest statement-generation.test.ts: selbst wiederholt, grün.
- Die rote Phase der neuen Tests: nur durch Lesen beurteilt, nicht vorgeführt.
