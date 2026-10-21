# Code-Review 548, Runde 1 (cf343b6..6f963da)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/__tests__/invoice-upload-dialog.dom.test.ts:89 | Die zweite Hälfte von «Done means» («while one is still empty it does») hat nach einer Eingabe keinen Test. Der DOM-Test markiert nur den Verteilschlüssel und füllt ihn dann aus. Im Szenario steht nach «Kategorie wählen» (Verteilschlüssel noch leer) keine Prüfung, dass der Satz bleibt. Ungetestet bleibt damit, dass bei zwei markierten Feldern nach dem Ausfüllen nur des einen der Satz bleibt, ebenso ein Feld, das auf einen weiterhin ungültigen Wert korrigiert wurde. Beim Lesen ist das korrekt, weil `field in open` die Gültigkeit über `checkRow` prüft und nicht nur, ob das Feld leer ist. Eine Mutation wie `some` → `every` oder ein reiner Leer-Test würde aber kein Test bemerken. |

Keine Blocker/Major.

Geprüft:
- Die Logik in UploadRowNotes.svelte:18–20 nutzt dieselbe `checkRow` wie die `errors` des Dialogs (InvoiceUploadDialog.svelte:198). Die Kosten sind gering: die Validierung ist rein synchron, und der Dialog rechnet `checkRow` je Zeile ohnehin schon für `complete` (Zeile 114).
- Neue Felder, die beim letzten Versuch nicht markiert waren, lösen den Satz nicht aus, wie gefordert.
- Der neue Schritt «hat die Datei von … keinen Hinweis mehr» hält die Screenplay-Schichten ein und ruft nur die Question `noteOnBeleg`. Die positive Prüfung «bietet Dwello "1 Rechnung erstellen" an» steht direkt davor. Ohne den Fix bleibt der Satz stehen, der Schritt wäre also rot.
- Das Feature nennt nur fachliche Begriffe.
- Es gibt keine neuen Texte und keinen neuen Bildschirm.
- Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt
- DOM-Test zuerst rot, danach 48 grün: vom Aufrufer gemeldet. Ein erneuter Lauf im Review-Worktree ging nicht, weil node_modules zu /home/user/Dwello zeigt und der Zugriff verweigert wurde.
- `bunx vitest run --changed origin/main`, design-guard, e2e-screenplay-lint, `bun run lint`, `bun run check` und E2E `invoices.feature` (33 grün): alles vom Aufrufer gemeldet.
- Dass in diesem Szenario nach dem Wählen des Verteilschlüssels wirklich kein anderer Hinweis bleibt (z. B. `invoices_upload_add_if_shown` für leere optionale Felder) und `toBeNull` deshalb hält, ist nur durch den gemeldeten grünen E2E-Lauf belegt.
