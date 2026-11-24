# Code-Review 1470, Runde 2 (Abschlussrunde vor dem ersten Push)

Bereich: `git diff 5b7cfe1 7b690a1` (4ac21d0, 7b690a1), ohne docs/reviews, Plan, Archiv, Personas.

Geschlossen: C-1 (a und c in 5b7cfe1, b in 4ac21d0).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Major | tests/e2e/features/statement-detail.feature:795-806 | Der neue Satz `heatingNoteDelivery` (V-6) ist eine sichtbare Änderung im PDF (Commit `fix(statements)`), aber kein Szenario prüft ihn. Er ist nur im Render-Test mit einem von Hand gebauten Teil `delivery: true` festgehalten. |

## C-2: Der Satz im Heizungsabschnitt bei einer Lieferung hat kein Szenario

- Warum falsch: Nach `CLAUDE.md` («Done means», Workflow 1) braucht eine Verhaltensänderung, die der Benutzer sieht, ein Szenario ohne `@wip`. Mit 4ac21d0 druckt das PDF bei einer Lieferung in den Tank und dem Heizprofil statt «… % für eine Rechnung ohne Leistungszeitraum» neu «… % für eine Rechnung, die für die ganze Abrechnungsperiode gilt. Bei einer anderen Rechnung …». Das Szenario «Eine Lieferung in den Tank ohne Anfangs- und Endbestand zählt im PDF nach dem Heizprofil der ganzen Periode» (`statement-detail.feature:795`) hat genau diesen Aufbau. Es prüft aber nur den Betrag `"900.00 450.00 50.00 % 225.00"`.
- Wie zeigen: Setzt man `runShareNote` (`backend/src/services/pdf-cost-table.ts:158-159`) fest auf `'heatingNoteParts'` zurück, bleibt `statement-detail.feature` grün. Rot werden nur die vier Fälle in `statement-pdf-render.test.ts:810-821`. Diese prüfen weder, ob der echte Weg über `invoice.service.ts:597` (`delivery: true`) die Bedingung `ownProfileDays` und `!noRunShare` erfüllt, noch ob er bis zum Heizungsabschnitt kommt.
- Fix: Dem Szenario bei Zeile 806 eine Zeile anfügen, z. B. `Und steht im PDF "»: 50.00 % für eine Rechnung, die für die ganze Abrechnungsperiode gilt. Bei einer anderen Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition."`. Das Szenario ist neu auf diesem Branch, die Änderung ist also frei. Die Zeile ist rot zu sehen, indem man `runShareNote` wie oben herausnimmt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main --structure`, `cd backend && bun run type-check`, `statement-pdf-render.test.ts` (199 pass; 8 neue oder geänderte Tests vor den Texten von 4ac21d0 rot), `bunx vitest run --changed origin/main` (1035 pass), E2E `statement-detail.feature` chromium+api auf dem Baum von 4ac21d0 (169 passed).
- Nicht nachgestellt: ob das Heizprofil-Szenario (`statement-detail.feature:795`) wirklich zum Satz `heatingNoteDelivery` führt, also ob die Position `invoiceParts` mit `delivery` trägt. Gelesen habe ich nur `invoice.service.ts:583-597` und `pdf-cost-table.ts:151-159`. Das Persona-PDF (laut `docs/reviews/1470-fachreview-2.md`, V-6) zeigt den Fall auf dem echten Weg.

Geprüft: Wortlaut von `heatingNoteDelivery` und `sharesNoteDelivery` in allen vier Sprachen, Zeichen für Zeichen gleich wie `docs/reviews/1470-fachreview-2.md` (inklusive ` ` im Französischen, führendes Leerzeichen); die Bedingung von V-6 wie dort vorgegeben, `heatingMonths` bleibt erhalten (`pdf-heating.ts:23-24`); `heatingNoteParts` unverändert (`statement-detail.feature:695`); 7b690a1 ändert kein Verhalten; die neuen und geänderten Render-Tests sind ohne die Änderung rot; nichts Unbezogenes im Diff.
