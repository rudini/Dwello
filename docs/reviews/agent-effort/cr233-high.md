# Code-Review #233, Slice 3 und Runde 2 (`git diff 1d9d3019 a09ae7f6`)

Worktree `bench-cr233-high`, detached bei a09ae7f6. Alle 50 geänderten Dateien gelesen, dazu `fixtures/screens.ts`, `fixtures/backend.ts`, `screenplay/questions.ts` (`OpenedFile`), `Button.svelte`, `InvoiceUploadRow.svelte`, `src/lib/server/invoice.ts`, `document.service.ts`, `llm-stub.ts`, `invoice-edit.feature`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/routes/invoices/[id]/InvoiceBeleg.svelte:81-85; tests/a11y/screens.json:303-309 | Neuer UI-Zustand «Hinweise zum Beleg» (Alert `invoice-document-hints`) fehlt in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. |
| C-2 | Major | tests/e2e/features/invoices.feature:158-163; InvoiceBeleg.svelte:33 | Der zweite Hinweis auf der Rechnungsseite («Der Beleg enthält auch Kosten, die nicht umlagefähig sind …») und sein Wegfallen bei einer nicht umlagefähigen Rechnung (Fachreview V-4) haben kein Szenario und keinen `No scenario`-Grund; nur der Akonto-Hinweis ist abgedeckt. |
| C-3 | Major | messages/de.json:767 (`invoices_edit_billed_text`), alle vier Sprachen | Der geänderte Warntext beim Bearbeiten einer abgerechneten Rechnung (Fachreview M-2, «zu viel Bezahltes zahlen Sie zurück») hat kein Szenario und keinen `No scenario`-Grund. Das bestehende Szenario prüft nur, dass gewarnt wird, nicht den Text. |
| C-4 | Minor | tests/e2e/screenplay/interactions.ts:244-249 | Im `blob:`-Zweig erfindet `OpenInNewTab` die Disposition `inline; type=…`. Damit ist `belegShown` für jeden Blob-Typ wahr. «zeigt ein neuer Tab die Datei als PDF» prüft so den Typ nicht, mit dem der Tab die Datei zeigt. Ein Rückfall von C-7 (Blob als `text/html`) bliebe in E2E grün; nur der DOM-Test fängt ihn. |
| C-5 | Minor | tests/e2e/tasks/invoice-upload.ts:341-342; src/routes/invoices/UploadRowFields.svelte:30-35 | Bis `fileType` aufgelöst ist, ist `href` leer und `Button` rendert mit derselben testid einen `<button>` ohne Wirkung. `Wait.until(belegFileLink)` ist schon damit erfüllt; danach liefert `getAttribute('href')` `null`, und `href!.startsWith` wirft (Flake-Risiko). In der App gilt: Wird die Zeile vor dem Auflösen geschlossen, läuft der Cleanup mit `url = ''`. Die später erzeugte Object-URL wird dann nie freigegeben. |
| C-6 | Minor | src/lib/server/invoice.ts:94; src/lib/types.ts:225 | Der Mapper castet `beleg` weiter auf `{ fileName; mimeType }`. Die Hinweise kommen nur durch, weil das Objekt ungeprüft weitergereicht wird. Der Typ macht sie optional, obwohl das Backend sie immer schickt (CLAUDE.md, «One mapper per response»). |
| C-7 | Minor | src/routes/invoices/+page.svelte:17-18 | `?upload` bleibt nach dem Schliessen des Dialogs in der Adresse. Neu laden oder «Zurück» von einer Rechnung öffnet «Rechnungen hochladen» erneut, leer. |
| C-8 | Minor | src/routes/invoices/[id]/edit/+page.svelte:125-131; backend/src/routes/invoices.ts:46 | Das neue Feld «Rechnungsnummer» hat keine Längenbegrenzung, und das Backend-Schema auch nicht. Die Spalte ist `varchar(50)`. Eine Nummer mit mehr als 50 Zeichen endet in einem DB-Fehler (500) statt einer Feldmeldung. Gleiche Lücke bestand schon im Upload-Dialog, wird hier aber neu erreichbar. |

## Blocker/Major

### C-1: Der Zustand mit Hinweisen zum Beleg wird nie auf axe und Sprachen geprüft

- **Warum falsch:** CLAUDE.md, Design-Regeln, «Process»: Ein neuer Zustand kommt in `tests/a11y/screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. `InvoiceBeleg.svelte` zeigt neu einen `Alert tone="caution"` mit Titel und ein bis zwei Absätzen (`invoices_beleg_hints_title`, `invoices_beleg_deducted`, `invoices_beleg_mixed`). `invoice-detail` hat nur `default` und `delete-dialog`. Die Fixture legt den Beleg mit `seed.beleg` an (`fixtures/backend.ts:327-330`), also mit `PUT /document`. Dort setzt `setBeleg` die Hinweise auf `null`/`false` (`invoice.service.ts:292`). Kein Bildschirm-Lauf erreicht also den Alert. Weder axe (hell/dunkel, drei Breiten) noch die Prüfung «fr/it/en zeigen kein Deutsch» sehen diese Texte.
- **Wie zeigen:** `grep -n "hints" tests/a11y/screens.json tests/e2e/features/accessibility.feature tests/e2e/features/sprachen-bildschirme.feature` findet nichts. In `fixtures/screens.ts` gibt es keine Rechnung, deren Beleg mit `deductedAmount`/`nonAllocableItems` angelegt wird.
- **Behebung:** Einen Zustand ergänzen, z. B. `invoice-detail` / `beleg-hints`. Dafür in der Fixture eine Rechnung über `POST /invoices` mit `beleg: { …, deductedAmount, nonAllocableItems: true }` anlegen (umlagefähige Kategorie, damit beide Absätze erscheinen). Dazu je eine Zeile in beiden Features.

### C-2: Kein Szenario für den Hinweis auf nicht umlagefähige Kosten auf der Rechnungsseite

- **Warum falsch:** CLAUDE.md, Workflow 1: Jede Verhaltensänderung braucht ein Szenario. Der Plan-Punkt «Hints of the upload kept with the Beleg … : deducted Akonto, costs not allocable» nennt beide Hinweise. Das Szenario «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung» prüft nur den ersten. Die Regel aus V-4 bleibt ohne Szenario: Der zweite Hinweis erscheint nur bei einer umlagefähigen Rechnung (`InvoiceBeleg.svelte:33`). Der E2E-Stack kann den Fall herstellen: `llm-stub.ts:112` setzt `nonAllocableItems` für Dateinamen mit «Reparatur», und `invoices.feature:109` lädt eine solche Datei schon hoch. Unter «No scenario» im Plan steht der Fall nicht.
- **Wie zeigen:** `grep -rn "Der Beleg enthält auch Kosten" tests/e2e/features` findet nichts.
- **Behebung:** Ein Szenario «Der Hinweis auf nicht umlagefähige Kosten bleibt bei der Rechnung»: «Lift Service und Reparatur» hochladen, eine umlagefähige Kategorie wählen, erstellen, Rechnung ansehen, Text prüfen. Optional ein zweites mit nicht umlagefähiger Kategorie: dann kein Hinweis.

### C-3: Der geänderte Warntext zu abgerechneten Rechnungen hat kein Szenario

- **Warum falsch:** Der Satz «zu viel Bezahltes zahlen Sie zurück» ist ein neuer, sichtbarer, mietrechtlicher Hinweis (Fachreview M-2) in vier Sprachen. CLAUDE.md, Workflow 1 und 6, zählt einen Text, den der Nutzer sieht, als Verhalten. Abgedeckt ist er nur durch den DOM-Test (`invoice-pages.dom.test.ts:717`). Das Szenario «Warnung beim Bearbeiten einer schon abgerechneten Rechnung» (`invoice-edit.feature:14-20`) prüft nur, dass gewarnt wird. Der Plan nennt keinen `No scenario`-Grund.
- **Wie zeigen:** `grep -rn "zu viel Bezahltes" tests/e2e/features` findet nichts.
- **Behebung:** Ein neues Szenario mit der Prüfung des Warntexts (das bestehende bleibt unverändert). Alternativ ein begründetes `No scenario` aus der Liste von Workflow 1; ein solcher Grund ist hier aber nicht ersichtlich.

## Nicht bestätigt

- Selbst erneut ausgeführt: `bunx vitest run` für `invoice-upload-dialog.dom`, `invoice-pages.dom`, `invoice-upload`, `invoice-upload-endpoints`, `invoices`, `privacy-page.dom`, `help-page.dom`, `dashboard-page`: 8 Dateien, 186 Tests grün.
- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bun run lint` und die betroffenen Unit-Tests auf a09ae7f6.
- Nicht gelaufen (kein E2E/Build erlaubt, keine Datenbank genutzt): `backend/src/__tests__/invoice-beleg.pg.test.ts`, `api-contracts.pg.test.ts`, Migration `0006_beleg_hints.sql`, `bun run check`, `cd backend && bun run type-check`, alle E2E-Szenarien (auch der im Plan gemeldete Rotlauf der Szenarien von C-8 aus Runde 2 und «148 passed»).
- Ob der jetzt sichtbare Zusatz «(öffnet in neuem Tab)» auf der Gebäudekarte (`BuildingCard.svelte:52`) und im Versanddialog (`SendDialog.svelte:66`) bei 390 px ohne seitliches Scrollen bleibt: nur im Browser prüfbar.
- Rot ohne die Änderung habe ich durch Lesen beurteilt: C-7-, C-9- und C-10-Test, Backend-Test zu den Hinweisen, Hilfe, Datenschutz, Übersicht und `?upload` scheitern auf 1d9d3019. `invoices.test.ts` («nennt den Beleg … mit den Hinweisen») wäre auch ohne die Änderung grün, weil der Mapper `beleg` unverändert durchreicht. Das gehört zu C-6; die Commit-Nachricht nennt den Test nicht als Pin.

Geprüft: Backend-Validierung der Hinweise (Pattern, optional) und ihr Verlust beim Ersetzen; BFF-Zusammenführung von Hinweisen und Datei; Vertrag `invoice.json` und API-/Datenmodell-Doku; neue Texte in allen vier `messages/*.json`; Entfernen von `@wip` (nur Szenarien von diesem Branch oder auf `main` nur verschärft: zusätzliche `Dann`-Zeilen, `replaceBeleg` wartet zusätzlich); Screenplay-Schichten der neuen Steps; Tokens und Komponenten.
