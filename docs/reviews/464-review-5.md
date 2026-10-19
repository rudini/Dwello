# Code-Review #464, Runde 5: Teil #477 («Geleistete Akontobeiträge» wird «Akontobeiträge»)

Worktree `review-464-code2`, Bereich `cfd2c8ef..aaab8475` (231e42ad @wip-Szenario, aaab8475 Umsetzung), ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`, `docs/design/personas`. Alle 14 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Kein Befund. |

## Abgleich mit der Anforderung

- Seitenzeile `statements_advance_paid` (`CostTable.svelte:175`): de «Akontobeiträge», fr «Acomptes», it «Acconti», en «Advance payments» in allen vier `messages/*.json`. Der DOM-Test `statement-pages.dom.test.ts:693` prüft das deutsche Label genau (`toBe`); ohne die Änderung stünde dort «Geleistete Akontobeiträge», er wäre also rot.
- PDF `advancePayments` (`pdf.service.ts:47, 148, 248, 348`): dieselben vier Wörter. Der neue `it.each` in `statement-pdf-render.test.ts:599-609` prüft pro Sprache das Label mit dem Betrag und dass das alte Teilwort fehlt («Geleistete», «versés», «versati», «made»). Mit dem alten Text wäre jede Zeile rot (de/fr/it am `not.toContain`, en schon am `toContain`, weil «Advance payments made – …» nicht «Advance payments – …» enthält). Da es dieselbe Konstante ist, trifft das auch die Ergebnisbox.
- E2E: Im Szenario «Das PDF nennt das Akonto als Monate mal Betrag» (`statement-detail.feature:813-825`) heisst die Zeile jetzt «Akontobeiträge – 580.00», und neu kommt «Und steht im PDF nicht "Geleistete"» dazu. Der Schritt (`statement-detail.steps.ts:274`) gibt es schon; er ruft nur die Question `downloadedPdfText` auf und hält die Screenplay-Schichten ein. Das Szenario hat kein `@wip`. Das Zusammenlegen folgt V-5 der Fachreview, und die Strenge bleibt erhalten.
- Hilfetexte V-2 (`contracts_agreed_costs_none_text_advance`), V-3 (`contracts_billed_until_help`) und `glossary_balance_text`: In allen vier Sprachen stehen jetzt Wort für Wort die Texte aus der Tabelle der Fachreview.
- V-6 bis V-8 (Dokumente, bestehende Backend-Tests, Zielname `statementAdvancePaid`, Kommentar in `statement-generate.feature:153`): umgesetzt. Ausserhalb von Glossar, Plan, Personas und Archiv steht das alte Wort nirgends mehr: Ich habe `src`, `backend/src`, `messages`, `tests` und `docs` durchsucht. Übrig ist nur «Zahlung bereits geleistet» in `reminder-letter.ts:41`, und das ist richtig so.
- Nichts im Diff gehört nicht zur Anforderung. Es gibt keinen neuen Bildschirm oder Zustand, also ist kein Eintrag in `screens.json` nötig. API-Antworten ändern sich nicht, also auch keine Contracts.

## Nicht bestätigt

- `UBIQUITOUS_LANGUAGE.md:48, 161, 174, 175` sagt in aaab8475 noch «Geleistete Akontobeiträge» bzw. «geleistete» (Fachreview V-1). Laut Auftrag ist das die Änderung des Product Owners und nicht Teil dieses Codes. Bis sie kommt, verwendet der Code einen Begriff, den das Glossar so nicht kennt. Das gehört unter «Blocked on me» und ist kein Befund dieses Diffs.
- Die geänderten Hilfetexte V-2, V-3 und `glossary_balance_text` prüft kein Test. Es ist eine Formulierung, die die Fachreview geprüft hat (Ausnahme im Skill `slice-review`, «Triage»). Ob in fr/it/en kein Deutsch erscheint, deckt `sprachen-bildschirme.feature` ab. Das habe ich nicht laufen lassen.
- lint, check, vitest (3169), Backend (1023), fallow, das E2E-Szenario und dass die neuen Tests zuerst rot waren: alles vom Aufrufer gemeldet, nicht neu laufen lassen. Ob die neuen Tests ohne die Änderung rot sind, habe ich durch Lesen beurteilt (siehe oben).
