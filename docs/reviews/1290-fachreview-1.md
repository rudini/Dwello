# Fach-Review #1290, Runde 1 (Schritt 1), Commit a45279f

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der Platzhalter «Datei und Titel können Sie danach wieder ändern.» stellt eine Änderung in Aussicht, die es nach einem erfolgreichen Hochladen nicht gibt. |

## V-1 (Major): «danach wieder ändern» verspricht eine Umbenennung, die es nicht gibt

- Beleg: tests/e2e/features/tenant-documents.feature, neues Szenario, letzte Zeile («… Datei und Titel können Sie danach wieder ändern.»). src/routes/tenants/[id]/TenantDocumentUpload.svelte:70-71: nach dem Erfolg leert `uploadForm?.reset(); title = '';` das Formular. Zu einem hochgeladenen Dokument gibt es keine Titeländerung (unter src/routes/tenants/[id]/ keine Funktion zum Umbenennen). Die Felder halten ihren Inhalt nur nach einem Fehler (#1262).
- Warum falsch: Ein unerfahrener Vermieter liest den Satz so: «Den Titel dieses Dokuments kann ich später noch ändern.» Nach dem Erfolg sind die Felder aber leer, und ein Dokument lässt sich nicht umbenennen. Ein falscher Titel bleibt also, oder der Vermieter muss das Dokument löschen und neu hochladen. Wahr ist der Satz nur im Fehlerfall. Das Szenario sagt selbst, worum es geht (Kommentar: «warum … gesperrt sind und bis wann»): Es geht um die Dauer der Sperre und nicht um eine spätere Änderung.
- Fix: Der Satz nennt den Grund und das Ende der Sperre, ohne etwas für die Zeit danach zu versprechen. Wortlaut siehe Tabelle. Er sagt weiterhin, dass die Sperre mit dem Hochladen endet, wie es «Done means» verlangt. Er ist bei Erfolg und bei Fehler wahr. Die Szenariozeile übernimmt ihn wörtlich. Falls der Auftraggeber den Wortlaut aus «Done means» («can be changed again afterwards») als entschieden ansieht, ist das eine Produktentscheidung für das Issue.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| tenants_document_upload_busy_note | Das Dokument wird hochgeladen. Bis das Hochladen fertig ist, lassen sich Datei und Titel nicht ändern. | Le document est en cours de téléversement. Le fichier et le titre ne peuvent pas être modifiés avant la fin du téléversement. | Il documento è in fase di caricamento. File e titolo non si possono modificare finché il caricamento non è terminato. | The document is being uploaded. The file and title cannot be changed until the upload is finished. |

Szenariozeile entsprechend: `Dann sagt Dwello beim Hochladen "Das Dokument wird hochgeladen. Bis das Hochladen fertig ist, lassen sich Datei und Titel nicht ändern.", auch einem Screenreader`. Die Zeile «vor dem Hochladen noch nicht "Das Dokument wird hochgeladen."» bleibt gültig.

## Nicht bestätigt

- Ob sich der Titel eines hochgeladenen Dokuments anderswo als unter src/routes/tenants/[id]/ ändern lässt: nur dort und in TenantDocumentUpload.svelte gesucht (grep nach rename/umbenenn/title edit), nichts gefunden.

Geprüft: Begriffe «Dokument», «hochladen», «Datei», «Titel» (UBIQUITOUS_LANGUAGE.md:235/238, i18n-begriffe.md:126/129: téléverser/caricare/upload, Feldlabels in messages/*.json:2073/2077). Formelle Anrede und Stil wie bei ui_dialog_busy_note. Im fr-Text kein Satzzeichen, vor das ein U+00A0 gehört, und kein Apostroph. Szenarioaufbau und Schritte sind fachlich in Ordnung. Kein Mietrechtsbezug (keine Rechtsregel und keine Beträge betroffen).
