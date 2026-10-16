# Code-Review #217, Slice 2 (Frontend), Runde 1, mit dem Delta der Backend-Runde 2

Worktree: `review-upload-code3` (3e3f99c). Bereich: `git diff 0ab1543 3e3f99c` (58 Dateien). Gelesen habe ich alle geänderten Dateien ausser `bun.lock`, dort nur die neuen Pakete. Von `messages/*.json` habe ich die Schlüssel geprüft, die der Branch seit `1d871ef` neu hat: alle vier Dateien haben dieselben Schlüssel, und jeder neue Schlüssel wird im Code verwendet. fr, it und en habe ich stichprobenweise gelesen.

## Delta der Backend-Runde 2

| ID | Stand | Beleg |
|----|-------|-------|
| C-12 | behoben | Die Texte der Datenschutzerklärung prüft jetzt `privacy-page.dom.test.ts` (3 neue Tests). Die Texte des Dialogs prüfen `invoice-upload*.test.ts` und die Szenarien. |
| C-13 | behoben | `invoice-extraction.pg.test.ts:91` prüft den Code `EXTRACTION_UNAVAILABLE`. |
| C-14 | behoben | `backend/src/services/real-date.ts`. Die Importe in `config/llm.ts:1`, `routes/buildings.ts:25` und `routes/invoices.ts:6` sind angepasst. |
| C-15 | behoben | `count()` (`backend/src/config/llm.ts:327-330`). Test mit `-2`, `1.5` und `true` (`llm-extraction.test.ts:82`). |

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-16 | Major | src/routes/invoices/UploadRowFields.svelte:32-38; src/routes/invoices/InvoiceDataFields.svelte:75-147; src/lib/invoice-upload.ts:125,166 | Felder, die die KI nicht gelesen hat, sind nicht markiert. Unsichere Rechnungsnummer und Fälligkeitsdatum sind ebenfalls nicht markiert. Das Fälligkeitsdatum wird gespeichert, ohne dass der Verwalter es sieht. |
| C-17 | Major | src/routes/invoices/[id]/InvoiceBeleg.svelte:23-35 | «Beleg ersetzen/hinzufügen» prüft die Datei nicht im Browser. Ist sie grösser als `BODY_SIZE_LIMIT` (11M), heisst es fälschlich «… weil Dwello nicht geantwortet hat. Versuchen Sie es noch einmal.» Keine Absage ist getestet. |
| C-18 | Minor | tests/e2e/steps/invoice-upload.steps.ts:182 | Die Prüfung des Hinweises «Originalrechnung aufbewahren» ist von `toBe` auf `toContain` gelockert. Das Ziel `invoice-keep-original` umfasst jetzt auch den Alert-Titel «Beleg». Besser: ein Ziel auf den Text selbst, dann wieder `toBe`. |
| C-19 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:90-98 | `add()` ist asynchron (`await fileRefusal` je Datei) und rechnet das Limit mit `rows.length` beim Start. Zwei schnelle Auswahlen (oder Drop plus Auswahl) können zusammen mehr als 20 Dateien aufnehmen. |
| C-20 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:129-141; src/routes/invoices/+page.svelte:658-661 | Auch Abbrechen ohne erstellte Rechnung ruft `oncreated([])` auf. Das löst ein unnötiges `invalidateAll()` aus und löscht die Erfolgsmeldung eines früheren Hochladens. |
| C-21 | Minor | src/routes/invoices/+page.server.ts:39-47 | Die Liste lädt die Kategorien jetzt zweimal (`categoriesRes` und `invoiceChoices`). Den Standard-Schlüssel holt sie mit eigenem Code statt wie `invoices/new/+page.server.ts:25`. Kein Load-Test prüft `distributionKeys` und `defaultDistributionKeyId` der Liste. |
| C-22 | Minor | src/routes/invoices/UnsureHint.svelte:10; InvoiceDataFields.svelte:75ff. | Der Hinweis «Die KI ist unsicher» hängt nicht über `aria-describedby` am Feld. Wer mit dem Screenreader von Feld zu Feld springt, hört ihn nicht. |
| C-23 | Minor | src/routes/api/invoices/+server.ts:467-470; src/routes/api/invoices/[id]/document/+server.ts:502 | Ein Multipart-Body ohne `file` oder mit ungültigem `invoice`-JSON führt zu einer Ausnahme und 500, nicht zu einer 400-Absage. |
| C-24 | Minor | src/__tests__/invoice-upload*.test.ts, invoice-pages.dom.test.ts | Diese Verhalten sind nicht getestet: der Hinweis zur Gutschrift (`credit_note`), der Link zur schon erfassten Rechnung, das teilweise Erstellen (Ergebnis im Dialog, `oncreated` erst nach dem Verwerfen) und in `InvoiceBeleg` «Wählen Sie eine Datei.» sowie eine Absage mit Code (`DOCUMENT_TYPE_NOT_ALLOWED`). |
| C-25 | Nit | src/lib/api.ts:126-133 | Die Header werden zerlegt und neu zusammengesetzt. Kürzer: `headers` bauen und bei `FormData` den Eintrag `Content-Type` löschen. |
| C-26 | Nit | src/routes/invoices/[id]/InvoiceBeleg.svelte:759; InvoiceUploadDialog.svelte:177 | Alert-Titel wiederholen den umgebenden Titel: «Beleg» im Panel «Beleg», «Rechnungen hochladen» im gleichnamigen Dialog. |
| C-27 | Nit | src/routes/invoices/UploadRowNotes.svelte:27; UploadResult.svelte:16 | Der Link zur erfassten Rechnung öffnet ohne Ankündigung einen neuen Tab. Zwei erstellte Rechnungen desselben Rechnungsstellers haben gleich lautende Links. |
| C-28 | Nit | src/routes/invoices/InvoiceUploadDialog.svelte:70-88 | «Erneut versuchen» bei einer fehlgeschlagenen Zeile überschreibt Werte, die der Verwalter dort schon eingetippt hat (die Zeile ist im Status `failed` bearbeitbar). |

## Blocker/Major

### C-16 – Nicht gelesene und unsichere Felder sind nur teilweise markiert, das Fälligkeitsdatum ist unsichtbar

Was das Issue verlangt:
- «Decided», Prüfen: «Fields the KI could not read or is unsure about are marked with text, not only colour.»
- «Done means»: «Fields the KI did not read, or read with low confidence, are visibly marked».

Was der Code tut:
- `UnsureHint` steht nur bei `invoiceDate`, `servicePeriodStart`, `amount`, `billingEntityName` und `description` (`InvoiceDataFields.svelte`). Bei der Rechnungsnummer (`UploadRowFields.svelte:32-38`) fehlt er.
- Ein Feld für das Fälligkeitsdatum gibt es nirgends in der App (`grep dueDate src/routes` findet nichts). `withProposal` übernimmt `fields.dueDate` (`invoice-upload.ts:125`), und `invoiceOf` speichert es (`:166`). Der KI-Wert wird also gespeichert, ohne dass der Verwalter ihn sieht oder korrigieren kann. Ist er unsicher, merkt das niemand.
- Ein Feld, das die KI nicht gelesen hat (`null`), bleibt einfach leer. Bei Pflichtfeldern erscheint erst nach «Erstellen» ein Fehler. Optionale Felder (Rechnungsnummer, Leistungszeitraum) werden nie markiert.
- Gerade die Rechnungsnummer trägt die Duplikatprüfung. Eine unsicher gelesene Nummer ohne Hinweis führt zu falsch erkannten oder übersehenen Duplikaten.

So lässt es sich zeigen:
- DOM-Test in `invoice-upload-dialog.dom.test.ts` mit einer Antwort `{ ...read, unsure: ['invoiceNumber', 'dueDate'] }`. Nach dem Aufklappen fehlen `invoice-upload-unsure-invoiceNumber` und `invoice-upload-unsure-dueDate`.
- Ebenso mit `fields.invoiceNumber: null`: Am leeren Feld steht kein Text.
- `invoiceOf(...)` enthält `dueDate: '2026-04-30'` (`invoice-upload.test.ts:251`), obwohl kein Feld es zeigt.

Behebung, eine von zwei Möglichkeiten:
- Fälligkeitsdatum als Feld zeigen und eine Markierung «nicht gelesen» für leere Felder einführen (auch für die Rechnungsnummer).
- Oder das Fälligkeitsdatum nicht übernehmen. Dann muss die Abweichung vom Issue der Product Owner entscheiden.

### C-17 – Zu grosser Beleg auf der Rechnungsseite: falsche Meldung

`upload()` in `InvoiceBeleg.svelte:23-35` schickt die gewählte Datei ungeprüft ab. Der Dialog prüft sie dagegen mit `fileRefusal` (`invoice-upload.ts:221`).

Ablauf bei einer Datei über rund 11 MB, etwa einem PDF-Scan vom Handy:
1. Die BFF-Route liest den Body über `BODY_SIZE_LIMIT=11M` (Dockerfile:52) nicht. `request.formData()` scheitert, die Antwort trägt keinen Code.
2. `failure()` in `api.ts` liefert dann `UNKNOWN_ERROR` oder `HTTP_413` ohne `params`.
3. `InvoiceBeleg` zeigt `invoices_beleg_failed`: «Der Beleg wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Versuchen Sie es noch einmal.»

Diese Meldung nennt eine falsche Ursache und empfiehlt eine Wiederholung, die nie gelingt. Das verletzt «A file that cannot be read (… too large) shows what happened and what to do» und die Design-Regel «errors say what happened and what to do».

Zwischen 10 und 11 MB greift `DOCUMENT_TOO_LARGE` des Backends richtig. Weder dieser Fall noch `DOCUMENT_TYPE_NOT_ALLOWED` ist getestet.

So lässt es sich zeigen: DOM-Test auf der Rechnungsseite mit einer Datei von 12 MB. `fakeBff` antwortet `[413, 'Payload Too Large']` (Text, kein JSON). Erwartet ist «grösser als 10 MB», angezeigt wird «weil Dwello nicht geantwortet hat».

Behebung: vor `api.put` `fileRefusal(file)` aufrufen und dessen Text als `error` setzen. Dazu ein Test, der zuerst rot ist.

## Nicht bestätigt

- **Tests nicht selbst gelaufen.** `bunx vitest run` war im Worktree nicht möglich: `node_modules` verweist auf `/home/user/dwello/node_modules`, und der Zugriff darauf ist gesperrt. Vom Aufrufer gemeldet, nicht von mir wiederholt: `bun run test:coverage` (2498 Tests), `bun run lint`, `bun run check`, `deepcheck:audit`, `fallow audit`, Backend `bun run test` (634/1, O-29) und `type-check`, E2E (65 bestanden) sowie die Axe- und Sprachzeilen (48 bestanden).
- **Rote Tests.** Nur die Plan-Zeilen belegen sie, z. B. den Dialog-Test «red shown with an empty component». Nachgestellt habe ich sie nicht.
- **`src/lib/file-pages.ts`.** Das Rendern mit pdf.js und `createImageBitmap` ist in den DOM-Tests gemockt und nur über die E2E-Szenarien abgedeckt (PDF und PNG). Nicht geprüft: wie der Legacy-Build in älteren Safari-Versionen läuft, und dass der Worker wirklich aus dem eigenen Build geladen wird (nur am Import `?url` gesehen).
- **Darstellung.** Layout bei 390 px, Grösse der Bedienelemente (48 px) und Dark Mode des Dialogs habe ich nicht angesehen. Gemeldet ist nur, dass die Axe-Zeilen grün sind. `max-w-4xl` und `border-2 border-dashed` stehen nicht in `token-referenz.md`. Laut Aufrufer akzeptiert `design-guard.test.ts` sie, das habe ich nicht nachgeprüft.
- **Fokus.** Wohin der Fokus nach «Abbrechen und verwerfen» zurückgeht, wenn beide Dialoge gleichzeitig schliessen, ist nicht geprüft und nicht getestet.
- **Inhalt der Texte.** Datenschutztexte und Fachtexte sind Sache von `fach-reviewer`. Die Begriffe in fr, it und en habe ich nur stichprobenweise gegen `i18n-begriffe.md` geprüft.
- **Abhängigkeit `pdfjs-dist` 6.3.289.** Sie bringt `@napi-rs/canvas` als optionale native Abhängigkeit mit. Ob das das Docker-Image vergrössert, habe ich nicht geprüft.
