# Code-Review #233, Runde 3 (Delta)

Worktree `review-233-code3`, Commit a09ae7f6, Delta `git diff 1d9d3019 a09ae7f6` (50 Dateien). Ich habe alle geänderten Dateien gelesen. Zusätzlich angesehen: `invoice.service.ts` (`createInvoice`, `setBeleg`), `document.service.ts` (`checkedFile`), `config/llm.ts` (`francs`), `src/lib/server/invoice.ts` (`fieldsOf`, `belegOf`), `Button.svelte`, `tests/a11y/screens.json`, `tests/e2e/fixtures/screens.ts` und `fixtures/backend.ts` (Seed `beleg`, `supplierInvoice`), außerdem Issue #233 mit seinen Kommentaren.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-11 | Blocker | src/routes/invoices/UploadRowFields.svelte:29-35 | `fileType(row.file).then(...)` liest `row.file` erst, wenn das Promise aufgelöst ist. Ist die Zeile inzwischen entfernt (zum Beispiel nach dem Erstellen), ist `row` `undefined`. Die Folge ist eine Unhandled Rejection «Cannot read properties of undefined (reading 'file')». `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts` endet deshalb jedes Mal mit Exit 1 (33/33 Tests grün, aber «2 errors»). Damit ist auch die gemeldete grüne Gesamtsuite bzw. `test:coverage` rot. |
| C-12 | Minor | src/routes/invoices/UploadRowFields.svelte:29-35, :44-50; tests/e2e/tasks/invoice-upload.ts:103-104 | Solange `fileType` nicht aufgelöst ist, gilt `href=''`. `Button` rendert dann ein `<button>` mit derselben testid `invoice-upload-file-link`. `openFileLarge` wartet nur darauf, dass diese testid sichtbar ist, und liest dann `getAttribute('href')!`. Je nach Zeitpunkt ist der Wert `null`, und `href.startsWith` wirft (mögliches Flackern des Tests). Dazu kommt: Läuft das Cleanup vor dem Auflösen, wird die später erzeugte URL nie freigegeben. |
| C-13 | Major | tests/a11y/screens.json:302-308; tests/e2e/fixtures/screens.ts:57 | Neuer UI-Zustand «Hinweise zum Beleg» (caution-Alert `invoice-document-hints` auf der Rechnungsseite) fehlt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Der Seed `seed.beleg('Hauswart Huber', …)` legt einen Beleg ohne `deductedAmount`/`nonAllocableItems` an. Axe und die Sprachprüfung sehen den Alert und seine drei neuen Texte deshalb nie. |
| C-14 | Minor | src/routes/invoices/[id]/edit/+page.svelte:124-131; backend/src/routes/invoices.ts:46 | Neues Feld Rechnungsnummer ohne Längengrenze. Die Spalte ist `varchar(50)`, das Schema hat kein `maxLength`. Eine Nummer mit 51 Zeichen führt zu einem DB-Fehler (500) und zur allgemeinen Meldung `invoices_save_failed`, die nicht sagt, was zu tun ist. Dieselbe Lücke besteht schon im Hochladen-Dialog; mit dem Bearbeiten-Formular kommt ein neuer Weg dazu. |
| C-15 | Minor | tests/e2e/fixtures/screens.ts:52-57 | Den geänderten Text M-6 (`invoice-delete-billed-document-note`) prüfen weder Axe noch die Sprachprüfung. Grund: `billedInvoice` hat keinen Beleg, und die Rechnung mit Beleg (Huber, datiert heute) ist nicht abgerechnet. Die Lücke bestand schon vorher. |
| C-16 | Nit | src/routes/invoices/+page.svelte:17-18 | `?upload` bleibt nach dem Schliessen in der Adresse. Neu laden oder «Zurück» öffnet den Dialog wieder. |
| C-17 | Nit | messages/en.json (`invoices_beleg_how_replace`, `invoices_beleg_how_add`) | In derselben Änderung stehen englische Anführungszeichen “…”, `help_invoices_4` verwendet dagegen «…» (der Grossteil von en.json nutzt «»). |
| C-18 | Nit | src/routes/api/invoices/+server.ts:20-22 | Die Destrukturierung `const { beleg: hints, ...fields } = fieldsOf(...)` wirft bei einem Formularfeld `invoice` = `null` einen TypeError (500). Vorher reichte das Feld das Backend als 422 weiter. |
| C-19 | Nit | backend/src/routes/invoices.ts:73; backend/migrations/0006_beleg_hints.sql:7 | Das Muster `^\d+(\.\d{1,2})?$` lässt mehr als 10 Vorkommastellen zu, `DECIMAL(12,2)` aber nicht. Ein unsinniger Wert der KI als Hinweis lässt so das Erstellen der ganzen Rechnung mit 500 scheitern. |

## Blocker/Major

### C-11: Unhandled Rejection nach dem Entfernen einer Zeile; die Unit-Suite endet rot

- **Warum falsch:** Der Effekt in `UploadRowFields.svelte`:
  ```svelte
  $effect(() => {
  	let url = '';
  	void fileType(row.file).then((type) => {
  		if (type) fileUrl = url = URL.createObjectURL(new Blob([row.file], { type }));
  	});
  	return () => URL.revokeObjectURL(url);
  });
  ```
  Er liest `row.file` ein zweites Mal im `.then`. Wird die Zeile vor dem Auflösen aus der Liste genommen (erstellte Rechnungen verschwinden aus dem Dialog), ist die Prop `row` `undefined`. Der Fehler fällt im Browser als Unhandled Rejection an. Vitest bewertet so etwas als Fehler des Laufs. `bunx vitest run` und damit `bun run test:coverage` (Teil von «Before marking anything complete» und der CI) enden mit Exit 1, obwohl jeder einzelne Test grün ist. Der Aufrufer meldet «2602 tests pass». Das widerspricht dem nicht, verdeckt aber den roten Exit-Code.
- **Wie zeigen:** `bunx vitest run src/__tests__/invoice-upload-dialog.dom.test.ts`, drei Läufe, jedes Mal `EXIT 1`. Die Ausgabe: «Vitest caught 2 unhandled errors … TypeError: Cannot read properties of undefined (reading 'file') ❯ src/routes/invoices/UploadRowFields.svelte:32:63». Letzter Test davor: «liest jede Datei sofort aus und erstellt die gewählten Rechnungen mit ihrem Beleg».
- **Behebung (Vorschlag):** Die Datei synchron festhalten (`const file = row.file`) und im Cleanup ein Flag setzen, das den späten `.then` übergeht. Das behebt zugleich die nicht freigegebene URL aus C-12.

### C-13: Der neue Zustand «Hinweise zum Beleg» ist weder durch Axe noch durch die Sprachprüfung abgedeckt

- **Warum falsch:** CLAUDE.md, Design-Regeln «Process», verlangt für neue Zustände je einen Eintrag in `tests/a11y/screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Der Alert in `InvoiceBeleg.svelte:81-85` ist ein neuer Zustand der Seite `invoice-detail`. Er bringt drei neue Texte mit (`invoices_beleg_hints_title`, `invoices_beleg_deducted`, `invoices_beleg_mixed`). Der Seed für die Bildschirme legt den Beleg nur über `PUT …/document` an (`fixtures/backend.ts:327-330`). `setBeleg` setzt die Hinweise dabei ausdrücklich auf `null`/`false`. Der Alert erscheint also in keinem geprüften Zustand. Die gemeldeten 88 Zeilen «axe and language rows» können ihn nicht enthalten.
- **Wie zeigen:** `grep -n "invoice-detail" -A6 tests/a11y/screens.json` liefert nur `default` und `delete-dialog`. Der Seed in `fixtures/screens.ts:57` erzeugt einen Beleg ohne Hinweise. Mit `InvoiceBeleg.svelte:27-36` ist `hints` dort leer, der Alert wird nicht gerendert.
- **Behebung:** einen Zustand (z. B. `beleg-hints`) mit Bedeutung in `stateMeanings` anlegen, dazu eine Rechnung mit Beleg und Hinweisen seeden (über `POST /invoices` mit `beleg.deductedAmount`/`nonAllocableItems`). Je eine Zeile in `accessibility.feature` und in `sprachen-bildschirme.feature`.

## Bestätigt durch Code und Test

- **C-7** (Runde 2): Der Blob hinter dem Link bekommt den Typ aus den ersten Bytes (`fileType`, `invoice-upload.ts:73-78`). DOM-Test «zeigt eine Datei gross nur als das, was ihre ersten Bytes sagen …» mit `rechnung.html`/`text/html` erwartet `application/pdf`. `fileRefusal` verwendet dieselbe Funktion. `createObjectURL` wird sonst nirgends verwendet.
- **C-8:** Die Szenarien «Dwello sagt, was nach dem Lesen zu tun ist, und meldet eine entfernte Datei» und «Eine hochgeladene Datei gross ansehen» stehen in `invoices.feature` ohne `@wip`. Die Steps rufen nur Tasks und Questions auf. `OpenInNewTab` liest `blob:` in der Seite. Die Questions liefern den Text selbst bzw. die Magic Bytes, die Plan-Zeile 27 nennt «Scenario red». Einschränkung siehe C-12.
- **C-9:** `removed = ''` in `finish()`; DOM-Test mit `reactiveProps`, Wiederöffnen.
- **C-10:** `describedby="upload-{row.key}-name"`; DOM-Test prüft den Text `blitz.pdf`.
- **Hinweise beim Beleg (Anna P-8, V-3/V-4):** Migration 0006, Schema, Route mit Muster und `setBeleg`, das die Hinweise zurücksetzt. Abgedeckt durch den pg-Test «behält die Hinweise … und verliert sie mit einem neuen Beleg». Contract `tests/contracts/invoice.json` und `api-contracts.pg.test.ts` sind angepasst. Die BFF-Weitergabe zeigt ein Endpoint-Test, `invoiceOf` ein Unit-Test. Anzeige nur auf umlagefähiger Rechnung: DOM-Test, Szenario «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung». Der Marker `TODO(fachlich prüfen, #222)` steht an «Akontorechnung». `api-specification.md` und `data-model.md` sind nachgeführt.
- **Rechnungsnummer in «Rechnung bearbeiten» (Helga P-4):** Feld mit Label über dem Feld, `optional`. DOM-Test prüft Trim und Body; Szenario «Rechnungsnummer korrigieren». Lücke C-14.
- **Hilfe von «Umlagefähig» (Marco P-6):** Sie folgt der Checkbox. DOM-Test im Formular «Rechnung erfassen», Szenario «Nicht umlagefähige Kategorie wählen». Die testid `invoice-utility-cost-checkbox-help` folgt dem Schema `{testid}-help`.
- **«(öffnet in neuem Tab)» sichtbar (Helga P-5):** `Button.svelte:84-85`, DOM-Test. Der Text betrifft auch BuildingCard und SendDialog. Das steht im Plan, die Szenarien `buildings` und `statement-detail` hat der Aufrufer als grün gemeldet.
- **Hilfe am Beleg (Helga P-6):** `join` der beiden Sätze; DOM-Test für hinzufügen und ersetzen; Szenario «Beleg ersetzen». `replaceBeleg` wartet auf `successToast`. Damit ist der beobachtete Doppelschritt behoben.
- **M-6:** Text wie entschieden, in allen vier Sprachen. DOM-Test und Szenario «Abgerechnete Rechnung mit Beleg löschen». Der alte Satz im Löschdialog ist entfernt; `invoices_beleg_billed` bleibt im Beleg-Panel in Gebrauch.
- **M-2 (Fachreview):** Satz zur Rückzahlung in allen vier Sprachen; der DOM-Test ist angepasst.
- **«Häufige Arbeiten» und Hilfe (Anna P-7):** `/invoices?upload` öffnet den Dialog (DOM-Test, Dashboard-Test, Szenario). `help_invoices_4` steht in allen Sprachen, mit DOM-Test und Szenario. Die zitierten Labels entsprechen `invoices_upload_open` bzw. dem Navigationspunkt.
- **«KI» statt «Sprachmodell»:** alle drei Varianten in de/fr/it/en; der Test prüft alle Sprachen, Szenario `privacy.feature`. Französische Guillemets mit U+00A0 in den neuen fr-Texten.
- Kein `@wip` mehr in den geänderten Features (`grep -rn "@wip" tests/e2e/features`, Stichprobe der Diff-Zeilen).
- Plan: für Slice 3 je eine «Test red»-Zeile pro neuem Test, `Skills: tdd, ponytail, ponytail-review` und «Scenario red» für die Szenarien des Slice. Die Triage der Runde 2 ist eingetragen.
- Die Verschiebung des `save`-Bodys nach `$derived body` ändert kein Verhalten (Wert identisch; `$derived` wird erst beim Lesen ausgewertet).

## Nicht bestätigt

- **Selbst ausgeführt:** `bunx vitest run` für `invoice-pages.dom`, `invoice-upload-dialog.dom`, `invoice-upload`, `invoice-upload-endpoints`, `privacy-page.dom`, `help-page.dom`, `dashboard-page` und `invoices`. Ergebnis: 186/186 Tests grün, aber 2 Unhandled Errors und Exit 1 (C-11). Danach die Dialog-Datei allein, zweimal: wieder Exit 1.
- **Vom Aufrufer gemeldet, nicht selbst ausgeführt:**
  - `bunx vitest run` (157 Dateien, 2602 Tests); laut C-11 mit Exit 1 zu erwarten
  - `bun run lint`, `bun run check`, `bun run deepcheck:audit`, fallow audit im Commit-Hook
  - Backend `bun run test` (659) und `type-check`
  - E2E chromium+api, 148 bestanden
  - Axe- und Sprachzeilen, 88 bestanden
- **Noch nicht gelaufen (laut Aufrufer):** `bun run test:coverage`.
- **Nicht im Browser geprüft (E2E und Build nicht erlaubt):**
  - Ob der sichtbare Zusatz «(öffnet in neuem Tab)» bei 390 px seitliches Scrollen verursacht (BuildingCard, SendDialog, Beleg-Link).
  - Ob das Rennen aus C-12 im E2E tatsächlich auftritt. Belegt ist es nur durch den Code (`Button.svelte:63` `isLink = !!href`, `data-testid` auch am `<button>`).
- **Fachliche Richtigkeit** der neuen Texte (V-3/V-4, M-2, M-6) ist Sache von `fach-reviewer` (`docs/reviews/233-fachreview-1.md`). Geprüft habe ich nur, dass sie in allen vier Sprachen stehen.
