# Code-Review #499, Runde 1 (5ca29006..b39a53d5)

Worktree: `w1-review-499-code` (detached, b39a53d5). Gelesen: alle 20 geänderten Dateien des Diffs, dazu `contract.service.ts:290-470` (checkBilledUntil, statementsChanged, checkNewDates), `ContractForm.svelte:140-220, 330-340`, `src/lib/backend-error.ts`, `src/lib/accounting-period.ts:72`, `src/lib/ui/Field.svelte`, `tests/e2e/targets/form.ts`, `tests/e2e/targets/accessibility.ts:17`, `tests/e2e/fixtures/screens.ts:55-120`, `tests/e2e/steps/contract-detail.steps.ts:70-95`, `schema.ts:440-480`, Issue #499 (Body), `docs/reviews/499-fachreview-1.md`, `.claude/skills/ponytail-review/SKILL.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `tests/contracts/contract-billed-until-billed.json:1` / `backend/src/__tests__/api-contracts.pg.test.ts:518-525` | Der Vertrag, aus dem der DOM-Test die Antwort `BILLED_UNTIL_BILLED` nimmt, wird von `api-contracts.pg.test.ts` nicht gegen die echte API geprüft (nur `contract-billed-until-billed-start.json`). `billed-until.pg.test.ts:192-201` prüft `code` und `params` mit `toMatchObject`, also inhaltlich gedeckt, aber nicht wie CLAUDE.md («Gotchas», API contracts) es verlangt. |
| C-2 | Minor | `tests/e2e/targets/contract-form.ts:91` | `page.locator('#billedUntil-error')` ist ein CSS-Selektor (CLAUDE.md, «Selectors»: keine CSS-Selektoren in Tests); als einziger in `tests/e2e/targets`. Das Feld zeigt den Fehler mit `data-testid="form-error"` (`Field.svelte:78`); so wie in `contract-detail.ts:91` (`<Feld>.locate(page).getByTestId('form-error')`) ginge es ohne CSS. |
| C-3 | Minor | `tests/e2e/features/contract-edit.feature:176` | Das Szenario «bis zum Tag vor einer versendeten Abrechnung» besteht laut Aufrufer schon auf der Basis (Verhalten bleibt). Es ist keine Fehlerbehebung, die Basis zeigt das Verhalten (31.12.2024 vor einer Abrechnung 2025 ändert keine Mietstage). Die Nachricht des Commits, der es hinzufügt (80df615e), sagt aber nicht, dass es beibehaltenes Verhalten festhält, sondern «Scenarios … that reproduce the dead end» (CLAUDE.md, Workflow 2). |
| C-4 | Minor | `backend/src/services/contract.service.ts:424` | V-1 (a): «zählt, solange die berichtigte Abrechnung fehlt oder ein Entwurf ist». Den dritten Fall (berichtigte Abrechnung versendet: die ersetzte zählt nicht mehr, genannt wird die Nummer der berichtigten) prüft kein Test. Ohne `or(isNull(successor.id), eq(successor.status, 'draft'))` bleibt `billed-until.pg.test.ts` grün; dann zählen beide Abrechnungen mit demselben `rentalStart` und `orderBy(rentalStart)` nennt zufällig die eine oder die andere Nummer. |

Keine Blocker, keine Major.

## Bestätigt

- **Regel (2026-10-19):** `checkBilledByDwello` lehnt ein neues oder geändertes «Abgerechnet bis» ab, sobald `rentalStart` einer versendeten oder bezahlten Abrechnung des Mietvertrags nicht später ist; Codes `BILLED_UNTIL_BILLED` (number/start/end/date) und `BILLED_UNTIL_BILLED_START` (number/start/end), HTTP 400. Tests: `billed-until.pg.test.ts` (versendet, bezahlt V-6b, Grenze `rentalStart` mit `date: 2024-04-30` V-4, 2023-12-31 weiter 409 #120); DOM-Tests am Feld (`aria-invalid`, kein «berichtigen»); Szenario «über eine versendete Abrechnung».
- **V-1 (a):** ersetzt ohne berichtigte Abrechnung und mit einem Entwurf der berichtigten Abrechnung zählt, genannt wird die ersetzte Nummer (pg-Test «zählt eine ersetzte Abrechnung …»). `statements_replaces_idx` ist eindeutig, der Left Join liefert also höchstens eine Zeile je Abrechnung. Der Fall mit einer versendeten berichtigten Abrechnung ist nicht getestet (C-4).
- **V-2:** `date < startDate` ergibt die Variante ohne Datum, die mit «Lassen Sie das Feld leer.» endet; pg-Test im eigenen `describe`, api-contracts-Test, DOM-Test, Szenario «… ab dem Vertragsbeginn». Der deutsche Text entspricht dem Wortlaut der Fachreview.
- **V-3:** Die Prüfung läuft vor `statementsChanged` und #141 (`contract.service.ts:394`); pg-Test mit Entwurf 2025.
- **V-6c:** `periodName` zeigt eine Periode über den Jahreswechsel mit ihren Daten (DOM-Test). **V-7 bis V-9:** fr/it «Le décompte {number} ({period})», en «no later than», it «al più tardi», fr mit U+00A0 (Bytes geprüft).
- **Entwürfe wie bisher:** Die neue Abfrage zählt `draft` nicht; der Weg über #141 bleibt (`onlyDraft`).
- **Unverändert gespeicherter Wert:** Er löst keine Ablehnung aus (`billedUntil === current.billedUntil`). Das ist nötig, weil das Formular «Abgerechnet bis» bei jedem Speichern mitschickt.
- **UI:** Die Meldung steht am Feld (`errors.billedUntil`) über `backendMessage`; das ISO-Datum formatiert `render`, keine Nachricht kommt aus dem Backend-Text. Beide Texte stehen in allen vier `messages/*.json`.
- **a11y/Sprachen:** Zustand `billed-until-statement` in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature`. Seed: Anna 2024 bezahlt (`screens.ts:79`), die Ablehnung wartet auf `formProblem` (`[aria-invalid="true"]`).
- **Screenplay:** Die Schritte rufen nur Fragen auf (`billedUntilErrorText`, `errorMessageShown`); die Fragen geben Text zurück, Ja/Nein nur für die Negativprüfung. Die Negativprüfung folgt auf eine positive Prüfung desselben Fehlers und trifft `form-error` am Feld wie im Formular (`Field.svelte:78`). Die Features beschreiben fachlich, ohne «klickt», «Button» oder «Feld» als Bedienung.
- **Rot zuerst (beim Lesen geprüft):** Die pg-Tests (vorher 409 ohne `code`), die DOM-Tests (vorher kein `aria-invalid`, kein Schlüssel `backend_billed_until_billed*`) und die Szenarien 1 und 2 scheitern ohne die Änderung. Szenario 3: siehe C-3.
- **Ponytail-Review:** Keine unbenutzten Importe (`alias`, `inArray`, `errorMessageShown`, `billedUntilErrorText` werden verwendet), keine Kopie eines bestehenden Helfers. Lean already. Ship.
- **Nichts Fremdes im Diff:** Alle Änderungen gehören zu #499.
- `billed-until.pg.test.ts` habe ich selbst neu laufen lassen: 18 pass, 0 fail (`TEST_DATABASE_URL=…/dwello_test_r499c`).

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-`type-check`, `bunx vitest run` (3276) und `api-contracts.pg.test.ts`: vom Aufrufer gemeldet.
- E2E (`contract-edit.feature`, die neuen Zeilen in `accessibility.feature` und `sprachen-bildschirme.feature`): nicht gestartet, wie verlangt; laut Aufrufer laufen sie noch. Ob axe für `billed-until-statement` 0 Verstösse meldet und fr/it/en kein Deutsch zeigen, ist offen.
- Rot vor dem Code: nur beim Lesen beurteilt, keine Läufe auf den Zwischencommits.
- V-4 (die Grenze ist `rentalStart`, nicht der Periodenbeginn, abweichend von Done means): Ob der Pull Request das nennt, lässt sich noch nicht prüfen, es gibt noch keinen PR.
- Ob Produktivdaten oder Demo-Seeds ein gespeichertes «Abgerechnet bis» über einer versendeten Abrechnung haben, das bei einer späteren Änderung neu abgelehnt würde: Ich habe nur `tests/e2e/fixtures` gelesen (Dora und Emil ohne Abrechnung über ihrem Datum), keine Datenbank.
