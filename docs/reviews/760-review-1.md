# Code-Review #760, Runde 1 (2c6c7e6..abd6172)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/invoices/InvoiceUploadRow.svelte:49 | Eine Zeile mit `status: 'failed'` (Auslesen fehlgeschlagen, «… weil Dwello nicht geantwortet hat. Wählen Sie «Erneut versuchen» oder füllen Sie die Felder aus.», `InvoiceUploadDialog.svelte:160`) hat leere Felder und ist bearbeitbar (`editable`, Z. 47), behält aber «Angaben prüfen», weil sie `byHand: false` hat. `toDoOf` behandelt genau diesen Fall schon als von Hand (`src/lib/invoice-upload.ts:153`: `row.byHand \|\| row.status === 'failed'`). «Done means» im Issue sagt: «After choosing a file that no KI read, the landlord sees «Angaben eingeben»». Das Issue zählt den Fall aber nicht zu den drei `byHand`-Fällen, deshalb ist er nur ein Randfall. Kein Test deckt ihn ab. |
| C-2 | Minor | Commit abd6172 (Nachricht) | Der neue DOM-Test «lässt die Angaben einer gelesenen Datei prüfen» (`src/__tests__/invoice-upload-dialog.dom.test.ts:179`) hält Verhalten fest, das schon auf dem Basis-Commit galt (2c6c7e6 zeigt immer «Angaben prüfen»). Die Commit-Nachricht nennt ihn nicht als solchen, wie es `CLAUDE.md`, Workflow 2, verlangt. Sie sagt stattdessen «DOM test and scenario seen red first». Für diesen Test stimmt das nicht. |

Keine Blocker oder Majors.

Geprüft: Diff aller 9 Dateien; die Texte in allen vier `messages/*.json` entsprechen genau den im Issue entschiedenen Texten; alle drei `withoutKi`-Fälle (`off`, `unavailable`, `unreadable`) setzen `byHand: true` (`invoice-upload.ts:283-291`), `withProposal` setzt `false`; «Angaben ausblenden» bleibt unverändert. Der neue Schritt im Szenario ist ohne `@wip`, ohne Nennung von UI-Elementen und nutzt nur die Frage `belegToggleText` (Screenplay-Schichten eingehalten; die Frage liefert den Text selbst). Den neuen Schritt zu «Angaben eingeben» im DOM-Test und den Szenario-Schritt habe ich gelesen: Auf der Basis schlagen sie fehl, weil dort «Angaben prüfen» erscheint. Kein neuer Bildschirm und kein neuer Zustand, also kein Eintrag in `screens.json` nötig. Ponytail: kürzester Diff, nichts Ungenutztes. Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- lint, check, fallow audit, vitest (3633 grün, Rotlauf des DOM-Tests), E2E chromium (50 grün), Rotlauf des wip-Szenarios: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Die DOM-Tests prüfen nur den Fall «Keine KI» auf «Angaben eingeben». `unavailable` und `unreadable` laufen über denselben Zweig (`row.byHand`). Das habe ich nur durch Lesen von `invoice-upload.ts:283-291` bestätigt, nicht mit einem Test.
