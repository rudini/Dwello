# Code-Review #233, Runde 2 (Delta)

Worktree `review-233-code2`, Commit 1d9d3019, Delta `git diff e30b1913 1d9d3019` (21 Dateien). Gelesen habe ich alle geänderten Dateien ausser dem Bericht `docs/reviews/233-review-1.md`, dazu im Umfeld `Button.svelte`, `UploadFiles.svelte`, `UploadResult.svelte`, `invoices/+page.svelte` und `backend/scripts/llm-stub.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-7 | Major | src/routes/invoices/UploadRowFields.svelte:27-33; src/lib/invoice-upload.ts:70-74 | Der neue Link öffnet `URL.createObjectURL(row.file)` mit dem MIME-Typ, den der Browser aus der Dateiendung ableitet. `fileRefusal` prüft nur die ersten Bytes. Eine Datei `rechnung.html`, die mit `%PDF-` beginnt, kommt also durch, besonders beim Ablegen per Drag-and-drop, wo `accept` nicht greift. Sie wird dann als HTML im Ursprung von Dwello geöffnet (XSS). |
| C-8 | Major | implementation_plan.md:52 («No scenario: … the preview opened from an unsaved file …») | Für die sichtbaren neuen Verhalten gibt es kein Szenario: den Link «Datei gross anzeigen» und die sichtbare Statuszeile («… entfernt.», «Bitte prüfen: 1.»). Der Grund «blob URL» gehört nicht zu den Fällen, die der E2E-Stack nicht herstellen kann. |
| C-9 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:56, :193-201 | `finish()` setzt `removed` nicht zurück, und der Dialog bleibt auf der Seite gemountet. Ablauf: einzige Datei entfernen, schliessen (ohne Rückfrage, weil keine Zeile mehr da ist), wieder öffnen. Dann steht im leeren Dialog weiter «blitz.pdf entfernt.». Kein Test deckt das ab. |
| C-10 | Nit | src/routes/invoices/UploadRowFields.svelte:42-44 | Jede geöffnete Zeile hat einen Link mit demselben Namen «Datei gross anzeigen». In der Linkliste eines Screenreaders lassen sie sich nicht unterscheiden; die Vorschau dagegen nennt die Datei («Vorschau von {name}»). |

## Blocker/Major

### C-7: Eine hochgeladene HTML-Datei läuft im Ursprung von Dwello

- **Warum falsch:** Bisher ging eine gewählte Datei nur als `FormData` an das Backend, und die Vorschau ist ein `<img>` aus `pdfjs`-Seiten. Neu erzeugt `UploadRowFields` einen Link `blob:` direkt auf das `File`-Objekt (`URL.createObjectURL(row.file)`). Der Typ des Blobs ist `file.type`, abgeleitet aus der Endung. `fileRefusal` (`invoice-upload.ts:70-74`) prüft nur die ersten 8 Bytes gegen PDF/JPG/PNG. Das `accept` von `UploadFiles.svelte:35` ist nur ein Hinweis für den Dateidialog; `drop` (`UploadFiles.svelte:17`) filtert gar nicht. Ein `blob:`-Dokument erbt den Ursprung der Seite, die es erzeugt hat. Ein Skript darin kann `/api/...` mit dem Session-Cookie aufrufen und das XSRF-Token aus dem gleichen Ursprung lesen. Rechnungen kommen von Dritten, etwa als Mail-Anhang, also ist der Inhalt fremdbestimmt.
- **Wie zeigen:** Eine Datei `rechnung.html` mit dem Inhalt `%PDF-1.4\n<script>alert(document.domain)</script>` in den Upload-Dialog ziehen. Sie wird angenommen (die ersten Bytes passen). Die Zeile öffnen und «Datei gross anzeigen» wählen: Der neue Tab rendert HTML und führt das Skript auf dem Ursprung der App aus. Ein DOM-Test kann das Kernproblem zeigen: `new File([...'%PDF-...'], 'x.html', { type: 'text/html' })` hochladen und erwarten, dass der Blob hinter dem Link einen der erlaubten Typen hat. Heute ist dieser Test rot.
- **Behebung (Vorschlag):** Den Link aus einem Blob mit dem Typ bauen, der aus den ersten Bytes erkannt wurde, z.B. `new Blob([row.file], { type: 'application/pdf' | 'image/jpeg' | 'image/png' })`. Dafür kann `fileRefusal`/`STARTS` den Typ liefern.

### C-8: Kein Szenario für den Link und die sichtbare Statuszeile

- **Warum falsch:** CLAUDE.md, Workflow 1, verlangt für jede Änderung des Verhaltens ein Szenario. `No scenario` ist nur für Zustände erlaubt, die der E2E-Stack nicht herstellen kann (Fehler zwischen Serverteilen, Uhr, Start, Ablehnungen, die die UI nie sendet, Qualität der KI). Der Link `invoice-upload-file-link` erscheint aber im echten Stack, sobald eine Zeile geöffnet ist. Playwright kann seinen Namen prüfen und mit dem Popup des Klicks auch den neuen Tab. Die Statuszeile ist kein `sr-only`-Text, sondern sichtbar (`text-ink-muted`). «notizen.docx entfernt.» und «2 von 2 Dateien gelesen. Bitte prüfen: 1. Nicht möglich: 1.» lassen sich deshalb als Text abfragen. Diese Zeile ist kein reiner Screenreader-Fall, der Grund im Plan trifft auf sie also nicht zu.
- **Wie zeigen:** `grep -rn "gross anzeigen\|entfernt\|Bitte prüfen:" tests/e2e/features` liefert für diese Texte keinen Treffer. Der Plan zeigt kein `Scenario red` für sie.
- **Behebung:** In `invoices.feature` ein Szenario «Die Datei gross ansehen» (Question: Name des Links und Adresse des geöffneten Tabs) und eine Prüfung der Statuszeile nach dem Entfernen einer Datei. Beide zuerst rot zeigen, gegen den Stand ohne den Code. Wer die sichtbare Statuszeile weiter als `No scenario` führen will, braucht einen Grund aus der Liste in Workflow 1.

## Bestätigt durch Code und Test

- C-1: `toDoOf` leitet Kategorie, «Füllen Sie aus» und «Ergänzen Sie, wenn …» aus den aktuellen `row.values` ab (`invoice-upload.ts:126-137`, angezeigt in `UploadRowNotes.svelte:14`). Abgedeckt durch den DOM-Test «nimmt eine Aufforderung zurück, sobald das Feld ausgefüllt ist». «Prüfen Sie: …» bleibt bewusst stehen; der Test prüft das.
- C-2: drei Zustände in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature` und `fixtures/screens.ts`. Die Aufbauaufgaben in `tasks/accessibility.ts` warten jeweils auf den erreichten Zustand. «Werke <uuid>.pdf» bleibt laut `llm-stub.ts:104-135` ohne Kategorie und ausgewählt, damit erscheint «Noch offen». Der Stand-in antwortet bei «unlesbar» kein JSON. Die 10 grünen Zeilen hat der Aufrufer gemeldet.
- C-3: DOM-Test «sagt die fehlende Kategorie nach dem Erstellen nur einmal».
- C-4: `stillOpen` = gewählte, nicht erstellte Dateien; der DOM-Test schliesst die Gutschrift aus.
- C-5: zusätzliche Prüfung `selected` false für die umlagefähige Kategorie.
- Sven P-2: Option `describedby` in `Dialog.svelte`, gesetzt auf den Zwecksatz; DOM-Test vorhanden.
- Sven P-3/P-4: Statuszeile immer im DOM (`empty:hidden`), Zusammenfassung nach dem Lesen, Ansage jeder entfernten Datei, auch der letzten; DOM-Test vorhanden (Lücke C-9).
- Sven P-5: In `Field.svelte` steht `note` vor der Hilfe. `note` wird nur in den Upload-Feldern benutzt (`UploadRowFields`, `InvoiceDataFields`), andere Bildschirme ändern sich also nicht. DOM-Test vorhanden.
- Anna P-9: `DateInput` leert die Live-Region nach 2 s; DOM-Test mit Fake-Timern, der Fehler steht danach einmal im Dokument.
- Link: `Button` mit `target="_blank"` setzt `rel="noopener"` und den Zusatz «öffnet in neuem Tab» (`Button.svelte:72-83`). Es ist ein `ghost`-Knopf mit `min-h-12`, nur mit Tokens gebaut. `revokeObjectURL` läuft im Cleanup.
- Neue Texte `invoices_upload_summary`, `invoices_upload_removed`, `invoices_upload_file_open` stehen in allen vier Sprachen; im Französischen steht U+00A0 vor dem Doppelpunkt.
- Plan: «Test red (slice 2)» für jeden neuen Verhaltenstest, `Skills: tdd, ponytail, ponytail-review` und die Triage von Runde 1 stehen drin. Die Ablehnung von C-6 ist begründet; ich nehme sie an.
- Die nach `$derived` verschobenen Ausdrücke (`buildingOptions`, `buildingHelp`, `discardText`) ändern kein Verhalten. Sie sind mit dem fallow-Gate begründet.

## Nicht bestätigt

- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/invoice-upload.test.ts src/__tests__/invoice-upload-dialog.dom.test.ts src/__tests__/date-input.dom.test.ts`, 66/66 grün.
- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bunx vitest run` (157 Dateien, 2591 Tests), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, fallow audit im Commit-Hook, E2E chromium für axe und Sprachen `invoices upload-*` (10 bestanden).
- Noch nicht gelaufen (vom Aufrufer genannt): `bun run test:coverage`, die ganze Backend-Suite, die ganze E2E-Suite.
- C-7 habe ich nicht im Browser nachgestellt (kein E2E/Build erlaubt). Belegt ist es durch den Code (`fileRefusal` prüft nur Bytes, `drop` filtert nicht, `createObjectURL(row.file)`) und das bekannte Verhalten von `blob:`-URLs, die den Ursprung der erzeugenden Seite erben.
- Ob ein Screenreader die Ansage des Datumsfehlers zu Ende spricht, wenn die Live-Region nach 2 s geleert wird: Das lässt sich nur mit einem echten Screenreader prüfen. Das ist Sache der Persona Sven bzw. Anna.
- Der offene Punkt «Kategorie list there at once (Anna P-10)» gehört nicht zu diesem Delta.
