# Code-Review Runde 1: WebKit, fehlende Frist auf «Abrechnung bearbeiten» (3e3ab8a2..80913051)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | Commit 80913051 (Betreffzeile) | «fix(statements): let the page check a missing Frist» hat 51 Zeichen; CLAUDE.md und `.claude/hooks/commit-msg-gate.mjs:73` erlauben höchstens 50. Der Hook hat den Commit offenbar nicht gesehen (etwa bei `-F`). Mit einem Wort weniger ist die Zeile kurz genug, z. B. «fix(statements): let the page check the Frist». |

Keine Blocker, keine Major.

## Die drei anderen Formulare mit DateInput

- `src/routes/contracts/[id]/+page.svelte:207` (`endDeletingDraft`): Das Formular enthält nur versteckte Felder und einen Button. Die DateInputs `endDate` und `noticeReceivedOn` liegen im `Dialog` von `ActionDialog` (`src/lib/ui/ActionDialog.svelte:57-73`). Dessen `<form>` ist leer, und es sendet mit `requestSubmit()` über `fields`. Das Kalenderfeld liegt also in keinem Formular, und die Prüfung des Browsers erreicht es nicht. **Gleicher Fehler: nein.**
- Detailseite der Abrechnung mit `PaidDateFields` (`src/routes/statements/[id]/+page.svelte:225-241`, `FormDialog.svelte:42-58`): Auch hier ist das `<form>` leer und `hidden`, und die Felder liegen im `Dialog`. Auf der Liste (`src/routes/statements/+page.svelte:183`) gibt es nur einen `Dialog` mit `onconfirm={markPaid}` und gar kein Formular. **Gleicher Fehler: nein.**
- `src/routes/buildings/[id]/FuelStocks.svelte:46` (`addFuelStock`): Der DateInput `fuelStockDate` liegt direkt im Formular, und `novalidate` fehlt. Damit liegt dasselbe Kalenderfeld im Formular wie auf der Seite «Abrechnung bearbeiten», die diese Änderung repariert. **Dasselbe Risiko: ja, latent.** Kein E2E-Szenario leert dort ein schon gefülltes Datum und speichert dann, darum ist die CI nicht rot. **In diesen Slice gehört es nicht:** Die Anforderung ist die rote CI auf `main`. Für Tankbestand fehlt ein WebKit-Nachweis, und eine Korrektur dort braucht ein eigenes Szenario oder einen eigenen Test. Ich empfehle eine Zeile in `docs/design/offene-punkte.md` oder ein `bug`-Issue. Robuster wäre auch eine Korrektur im `DateInput` selbst, sodass das versteckte Kalenderfeld nie an der Prüfung des Formulars teilnimmt. Das würde alle Formulare abdecken, betrifft aber Code ausserhalb dieser Änderung.

## Nicht bestätigt

- Die Ursache in WebKit ist nicht belegt. Das versteckte `<input type="date">` (`src/lib/ui/DateInput.svelte:156-169`) hat weder `required` noch hier ein `min`. Ein leerer Wert sollte die Prüfung also bestehen. Dass WebKit 1.64 das Feld trotzdem als ungültig markiert (vermutlich `badInput`, nachdem ein vorbelegter Wert geleert wurde), schliesse ich nur aus dem CI-Fehlerkontext des Aufrufers. Selbst ansehen konnte ich das nicht, weil lokal kein WebKit läuft. Ob `novalidate` die beiden roten Tests in WebKit grün macht, zeigt erst die CI.
- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - DOM-Test «überlässt die Prüfung der Seite, nicht dem Browser» vor der Änderung rot. Beim Lesen bestätigt: Ohne `novalidate` ist `form.noValidate` false.
  - `bunx vitest run src/__tests__/statement-pages.dom.test.ts`: 179 bestanden.
  - `bun run lint` und `bun run check` grün.
  - E2E `--project=chromium --grep "Zahlungsfrist|statement-edit"`: 14 bestanden.

Geprüft: Diff (`+page.svelte`, DOM-Test) gelesen; Server-Action (`src/routes/statements/[id]/edit/+page.server.ts:20-22`) meldet eine leere Frist mit `statements_deadline_missing`; die Verhaltensänderung ist durch die bestehenden Szenarien «Zahlungsfrist fehlt» und «statement-edit submit-cleared» abgedeckt (ohne `@wip`, bereits in screens.json); keine neuen Texte, Bildschirme oder Verträge; Ponytail: kürzester Diff, nichts Ungenutztes.
