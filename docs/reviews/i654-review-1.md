# Review #654, Runde 1 (87e9e422..d01c439b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/ui/sent-error.svelte.ts:18-21, src/routes/contracts/[id]/DeleteContract.svelte:61-65 | Im Löschdialog liegt die Checkbox ausserhalb jedes `<form>`, und `check()` läuft vor `requestSubmit()`. Darum gibt es kein `submit`, das den Fehler wieder anzeigt: Wer abhakt, das Häkchen wieder entfernt und erneut «Löschen» wählt, sieht keinen Fehler, und es passiert nichts. |
| C-2 | Minor | src/__tests__/ui-choices.dom.test.ts:39 | Der Kommentar «the dialog checks again on submit» stimmt für den einzigen Dialog mit Checkbox-Fehler nicht: `ActionDialog` prüft vor dem Abschicken und schickt bei einem Fehler nichts ab (siehe C-1). Der Test zeigt nur den Fall mit `<form>`. |
| C-3 | Minor | tests/e2e/steps/contract-detail.steps.ts:187 | Der bestehende Kommentar «the field's error and a refusal … the one with the message counts» gehört zu `meldet der Dialog {string}`. Er steht jetzt über dem neuen Schritt `meldet der Dialog keinen Fehler mehr` und beschreibt dort etwas Falsches. |

## C-1 (Major): Der Fehler bleibt nach erneutem Prüfen ohne Formular verborgen

Ablauf in `DeleteContract` (Vertrag hat begonnen, `future = false`):
1. «Löschen» ohne Häkchen: `checkMistake()` setzt `mistakeError` auf den Text `contracts_delete_mistake_unconfirmed`, der Fehler wird angezeigt.
2. Häkchen setzen: Der `change`-Listener in der Capture-Phase setzt `corrected = error()`, der Fehler verschwindet. `DeleteContract` setzt `mistakeError` dabei nicht zurück.
3. Häkchen wieder entfernen: `corrected` behält denselben Text.
4. Erneut «Löschen»: `ActionDialog` ruft `check() && form?.requestSubmit()` auf (ActionDialog.svelte:83). `checkMistake()` setzt `mistakeError` auf denselben String. Damit läuft der `$effect` nicht (`error()` war nie leer), und es gibt kein `submit`. Das leere `<form>` liegt ausserhalb des Dialogs, und `node.closest('form')` ist für die Checkbox sowieso `null`. `sent.shown` bleibt `undefined`.

Folge: Kein Fehler, kein `aria-invalid`. `focusFirstError` findet weder ein ungültiges Feld noch `[role="alert"]` und setzt den Fokus nirgends hin. Der Dialog reagiert stumm auf «Löschen». Vor der Änderung war der Fehler in diesem Ablauf sichtbar. Die Änderung führt also zu einer Regression in genau dem Dialog, an dem das neue Szenario hängt. Die Anforderung «verschwindet, sobald der Wert geändert wird» ist nur zusammen mit «die nächste Prüfung zeigt ihn wieder» richtig (so steht es auch im Docblock von `sent-error.svelte.ts`).

So lässt es sich zeigen:
- DOM-Test in `src/__tests__/contract-detail-page.dom.test.ts`: Löschdialog eines begonnenen Vertrags öffnen, «Löschen» wählen, Checkbox anklicken, nochmals anklicken, wieder «Löschen» wählen. Dann `[data-testid="form-error"]` mit dem Text erwarten. Mit d01c439b ist das Ergebnis `null`.
- Oder als Szenario: «… löschen will, ohne den Irrtum zu bestätigen / bestätigt den Irrtum / nimmt die Bestätigung zurück / löschen will … Dann meldet der Dialog "Bitte bestätigen Sie …"».

Mögliche Richtung, ohne Vorgabe: Eine neue Prüfung muss den Fehler auch ohne `submit` zurücksetzen. Zum Beispiel setzt `DeleteContract` `mistakeError` beim Abhaken auf `''`, wie es `PastEndConfirm` tut. Oder `sentError` bekommt ein Signal für die neue Prüfung, das nicht von einem `<form>` abhängt.

Andere Aufrufer habe ich geprüft. Diese Lücke betrifft sie nicht: Bei `PastEndConfirm` leert das Abhaken den Fehler. `PreviewChecks`, `CategoryForm`, `RentStep` und `ProviderChecklist` liegen in einem `<form>` mit echtem `submit`. `AgreementQuestion` setzt `failed` vor jedem Speichern auf `undefined`, so dass der `$effect` greift.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (3734 bestanden), Prettier auf der neuen Datei, testcheck- und deepcheck-Audit, die E2E-Läufe auf chromium (contract-detail, contract-new, contract-edit, statement-agreed-costs, statement-generate, categories, categories-ki, building-new) sowie die Axe- und Sprachzeilen (122 bestanden).
- Die roten Läufe habe ich nur durch Lesen beurteilt: Der Namenstest der Radio-Optionen, die beiden «verschwindet»-Tests und das neue Szenario scheitern ohne die Änderung (`aria-labelledby` fehlt, bzw. der Fehler bleibt bestehen). Für «erscheint beim nächsten Abschicken wieder» habe ich den gemeldeten roten Lauf (Formular-Listener entfernt) nicht selbst ausgeführt.
- Das native Datumsfeld von `DateInput` (Screenreader-Prüfung durch Sven) gehört nicht zu diesem Diff.

Geprüft: alle zehn geänderten Dateien; `aria-labelledby`/`aria-describedby` der Radio-Optionen (IDs pro Gruppe eindeutig); `focusFirstError`; die übrigen Radio-Targets in `tests/e2e/targets` (`contract-form.ts` unverändert und nicht betroffen); der Ziel-Umbau in `categories.ts` prüft dasselbe wie vorher; die Screenplay-Schichten des neuen Schritts (Task `Check`, Fragen `Checked`/`Count`, positiver Anker vor der negativen Prüfung); keine neuen Texte, also keine Änderungen an `messages/*.json` nötig; kein neuer Bildschirmzustand für `screens.json`.
