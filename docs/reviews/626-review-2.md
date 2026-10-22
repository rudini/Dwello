# Code-Review #626, Runde 2 (Delta 8d6984e..a09c313)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | behoben | `src/routes/invoices/UploadFiles.svelte:13-14` zeigt bei `kiOff` `invoices_upload_files_help_no_ki`; `InvoiceUploadDialog.svelte:267` reicht `{kiOff}` weiter. Der neue Schlüssel steht in allen vier `messages/*.json` (Zeile 1022) und entspricht jeweils dem ersten Satz des bisherigen Hilfetexts. `invoice-upload-dialog.dom.test.ts:171-174` wählt mit `kiOff: true` das Gebäude und erwartet kein «liest die KI». Mit dem alten `UploadFiles` schlägt das fehl, wie ich aus dem Code gelesen habe. |
| C-2 | Minor | behoben | `src/__tests__/invoices.test.ts:179-192` lässt `GET /ki-settings` scheitern und erwartet eine Rechnung sowie `kiOff: false`. Ohne `.catch(() => false)` (`src/lib/server/ki-settings.ts:38`) lehnt `Promise.all` ab (`+page.server.ts:48-53`). Der Fehlerzweig liefert dann `invoices: []`, und der Test wird rot. |

## Neue Befunde

Keine.

## Nicht bestätigt

- lint, check, fallow audit, i18n: vom Aufrufer gemeldet, nicht wiederholt. Die Testdateien `invoice-upload-dialog.dom.test.ts` und `invoices.test.ts` habe ich auf a09c313 erneut laufen lassen: 83 grün.
- Rot von C-1 und C-2 nicht selbst gesehen, nur aus dem Code gelesen (siehe oben).
- Texte nach der Wahl einer Datei (z. B. `invoices_upload_not_read` «Die KI hat diese Datei nicht gelesen …» in den Zeilen) gehören nicht zur Frage «bevor eine Datei gewählt ist». Ich habe sie in diesem Delta nicht geprüft.

Geprüft: Mit «Keine KI» zeigt der Dialog vor der Wahl einer Datei diese Texte (`InvoiceUploadDialog.svelte:236-291`, `UploadFiles.svelte`): Titel, `purpose_no_ki`, `upload_kept`, `keep_original`, Gebäude-Select mit Platzhalter und `building_locked`, `building_first` bzw. `files_help_no_ki`, `files_label`, `files_choose` und `too_many`. Keiner sagt noch, dass eine KI die Dateien liest. `FileInput` bringt keinen eigenen Text mit. ponytail-review: nichts zu kürzen.
