# Code-Review i815b3, Runde 2 (71567741..594b92eb: Behebung C-1, C-2)

## Status der offenen IDs aus Runde 1

- **C-1 (Major): behoben.** Im Assistenten gilt eine Antwort nur noch für ihr Datum: `checked = { start, past }`, und `startPast` ist abgeleitet (ContractWizard.svelte:94-95). «Weiter» auf Schritt 3 (:304) und das Speichern (:267) warten auf `checkStart()`. Beide Fälle aus Runde 1 haben einen DOM-Test, der auf 71567741 rot ist: contract-wizard.dom.test.ts:518-526 (vergangen, «Weiter» vor der Antwort) und :528-536 (alte Antwort, künftiges Datum, Hinweis leer, Schritt 4). Im Bearbeiten-Formular ist die Ableitung dieselbe (ContractForm.svelte:69-70), dort fehlt aber ein roter Test, siehe C-5.
- **C-2 (Minor): behoben.** contract-edit.dom.test.ts:95-106 prüft einen späteren Beginn ohne Hinweis und einen früheren mit Hinweis, und zwar mit dem Vertrag `contract-check-start.json`.
- C-3, C-4: vom Aufrufer abgelehnt, hier nicht neu bewertet.

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | src/routes/contracts/ContractForm.svelte:69-70; src/__tests__/contract-edit.dom.test.ts:95-106 | Kein Test deckt die C-1-Behebung im Bearbeiten-Formular ab. Der neue Test ist auch mit dem ContractForm.svelte von 71567741 grün, denn er wartet nach jeder Eingabe mit `settle()`. Fehlt ein Test wie «früherer Beginn, `settle`, späterer Beginn, Hinweis sofort leer», kommt ein veralteter Hinweis zurück, ohne dass ein Test rot wird. |
| C-6 | Minor | tests/e2e/tasks/contract-form.ts:83-84 (nicht im Diff) | Mit dem Delta wartet Schritt 3 auf das Backend und ist damit asynchron. `fillContract` klickt bei `confirmPastStart` aber zweimal hintereinander auf «Weiter» und wartet nicht auf die Rückfrage. Die zwei Klicks warten beide auf `checkStart()` und laufen danach nacheinander durch. Darum bleibt «Vertragsbeginn in der Vergangenheit bestätigen» (contract-new.feature:29) grün, ob der Assistent zurückfragt oder nicht. Die Rückfrage belegt nur der DOM-Test. Diese Lücke steht schon in Runde 1 als Beleg zu C-1, behoben ist sie nicht. |

Geprüft: Die zehn Zeilen `await settle()` in contract-wizard.dom.test.ts (:90, 148, 173, 219, 239, 262, 370, 715, 805, 836) kommen nur hinzu. Keine Prüfung fällt weg oder ist schwächer geworden. Der Effekt liest `checked` und läuft nach jeder Antwort erneut, endet dann aber ohne Anfrage. `startInPast` wirft nicht, also bleibt «Weiter» nicht hängen. Rückfrage, Hinweis und Prüfung lesen alle dasselbe abgeleitete `startPast`. Ein Doppelklick auf «Weiter» bei einem vergangenen Beginn verhält sich wie vorher: Der erste Klick fragt zurück, der zweite bestätigt. Es gibt keinen ungenutzten Code und keine neuen Texte.

## Nicht bestätigt

- `bunx vitest run` (3648), lint, check, fitness und E2E chromium für contract-new und contract-edit (80) hat der Aufrufer gemeldet. Ich habe keinen dieser Läufe wiederholt.
- Dass die zwei neuen Assistenten-Tests ohne die Änderung rot sind und der Bearbeiten-Test es ist, wenn die Antwort fehlt, hat der Aufrufer gemeldet. Ich habe das nur aus dem Code gelesen: Die Assistenten-Tests sind auf 71567741 rot, der Bearbeiten-Test ist auf 71567741 grün (C-5).
