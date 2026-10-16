# Code-Review #233, Slice 1, Runde 1

Worktree `review-233-code1`, Commit e30b1913, Diff `git diff 0d970be0 e30b1913` (39 Dateien; Code, Tests, Messages, Verträge und E2E ganz gelesen; Fachreview `docs/reviews/233-fachreview-1.md` zu V-1, V-2, M-1, V-5, V-6 gelesen). Issue #233 und seine Kommentare über `gh api` gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/invoice-upload.ts:123, :197; src/routes/invoices/UploadRowNotes.svelte:11 | Die neuen Aufforderungen «Wählen Sie eine Kategorie.» und «Füllen Sie aus: …» werden beim Lesen eingefroren und bleiben stehen, nachdem der Liegenschaftsverwalter die Kategorie gewählt oder das Feld ausgefüllt hat; der Knopf zählt die Zeile dann schon als vollständig. |
| C-2 | Major | tests/a11y/screens.json:12-13; tests/e2e/features/accessibility.feature:92-93 | Die Zustände mit neuen Texten fehlen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`: das Ergebnis nach einem Teil-Erfolg mit «Noch offen: …», die Abbruchfrage nach einem Erstellen («Erstellte Rechnungen bleiben gespeichert …») und die Zeile mit `EXTRACTION_UNREADABLE`. |
| C-3 | Minor | src/routes/invoices/UploadRowNotes.svelte:11 | Das Entfernen doppelter Sätze (`new Set`) hat keinen Test: Kein Test zeigt, dass «Wählen Sie eine Kategorie.» nach «Erstellen» bei einer gelesenen Zeile ohne Kategorie nur einmal erscheint. |
| C-4 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:197 | «Noch offen» nennt jede nicht abgelehnte Zeile, auch eine Gutschrift, einen Sammelscan oder eine schon erfasste Rechnung, also Dateien, aus denen der Dialog gerade keine Rechnung erstellen lässt. Abgelehnte Dateien bleiben aber ebenfalls im Dialog und fehlen in der Liste. Die Regel ist nirgends begründet oder getestet. |
| C-5 | Minor | src/__tests__/invoice-upload.test.ts:73 | Zu V-1 verlangt das Fachreview zwei Tests (b: `nonAllocableItems` + umlagefähige Kategorie: Hinweis **und nicht ausgewählt**). Der Test prüft «nicht ausgewählt» nur für die nicht umlagefähige Kategorie. |
| C-6 | Nit | src/routes/invoices/InvoiceUploadDialog.svelte:69 | Ohne vollständige Zeile heisst der Knopf «0 Rechnungen erstellen (2 unvollständig)», und er bleibt wählbar. Das ist vertretbar (Entscheid: «… erstellen (1 unvollständig)»), liest sich aber holprig. |

## Blocker/Major

### C-1: Aufforderungen bleiben nach dem Erledigen stehen

- **Warum falsch:** `withProposal` berechnet die Hinweise einmal, beim Lesen: `toDo(read, values.categoryId)` in `notesOn`/`toDo` (`invoice-upload.ts:123`, `:197`). `row.notes` wird danach nur noch beim erneuten Lesen, bei `withoutKi` und bei einer Ablehnung gesetzt (grep `notes` in `src/routes/invoices/*.svelte` und `src/lib/invoice-upload.ts`). Wählt der Liegenschaftsverwalter in der Zeile die Kategorie, steht in «Hinweise zu werke.pdf» weiter «Wählen Sie eine Kategorie.» im Ton «caution». Der Knopf zeigt gleichzeitig «2 Rechnungen erstellen», weil er `checkRow` mit den aktuellen Werten rechnet (`InvoiceUploadDialog.svelte:68`). Ebenso bleibt «Füllen Sie aus: Betrag.» stehen, wenn der Betrag eingetragen ist.
- **Ursprung:** Früher stand an dieser Stelle «Prüfen Sie: …, Kategorie.». Das las sich auch nach dem Wählen noch als Prüfauftrag. Die neuen Sätze dieses Slices sind Aufforderungen und widersprechen jetzt dem Knopf, den derselbe Slice eingeführt hat (Helga P-1). Für die Zielgruppe mit wenig Erfahrung heisst das: Sie hat erledigt, was verlangt war, und Dwello verlangt es weiter.
- **Wie zeigen:** Ein DOM-Test im Stil von «zählt auf dem Knopf nur Rechnungen …» mit `werke.pdf` → `{ ...read, categorization: null }`: die Zeile öffnen, im Select der Kategorie `c1` wählen, dann erwarten, dass `invoice-upload-row-message` «Wählen Sie eine Kategorie.» nicht mehr enthält. Mit dem heutigen Code ist dieser Test rot. Ein E2E-Gegenstück: Im Szenario «Nur vollständige Rechnungen …» die Kategorie wählen, danach steht der Satz noch da.
- **Behebung (Vorschlag):** Den Teil aus `toDo` (Kategorie, fehlende Pflichtfelder) aus den aktuellen Werten ableiten, z.B. in `UploadRowNotes` aus `row.values`, gefiltert wie `filledIn`. Nur die Hinweise zur Datei (Mahnung, Gutschrift, Akonto …) bleiben in `row.notes`. Damit erübrigt sich wohl auch das `new Set` (C-3).

### C-2: Neue Zustände nicht in den Bildschirm-Prüfungen

- **Warum falsch:** CLAUDE.md, «Design-Regeln/Process», verlangt für jeden Zustand einen Eintrag (axe hell/dunkel, drei Grössen, kein Deutsch in fr/it/en). In `screens.json` gibt es für den Upload nur `upload-dialog` und `upload-discard-dialog` (`tests/e2e/tasks/accessibility.ts:162-178`). Beide erreichen weder das Ergebnis nach einem Teil-Erfolg noch die Abbruchfrage nach einem Erstellen oder eine Zeile mit `EXTRACTION_UNREADABLE`. Die neuen Texte `invoices_upload_still_open`, `invoices_upload_discard_text_created` und `backend_extraction_unreadable` prüft damit keine Sprachprüfung. Auch «(n unvollständig)» kommt in `upload-dialog` nicht vor: Die einzige gelesene Zeile («Werke Schlussrechnung Reparatur») ist wegen `nonAllocableItems` nicht ausgewählt, der Knopf heisst dort «0 Rechnungen erstellen».
- **Einordnung:** Das Ergebnis und die Fehlerzeile gab es schon unter #217 ohne Eintrag (bestand vorher). Dieser Slice fügt ihnen aber neue sichtbare Texte und einen neuen Abbruch-Zustand hinzu und macht die Lücke damit sichtbarer.
- **Wie zeigen:** `grep -n "upload" tests/a11y/screens.json` liefert nur die zwei Zustände oben. Keine der Aufbauaufgaben in `accessibility.ts` erstellt eine Rechnung oder lädt eine Datei «… unlesbar» hoch.
- **Behebung:** Zustände wie `upload-partial-result` (zwei Dateien, eine ohne Kategorie, erstellen; danach abbrechen für die Abbruchfrage) und `upload-unreadable` (Datei «… unlesbar», die Stand-in-Attrappe kann das schon) in alle drei Dateien aufnehmen, mit `stateMeanings`.

## Bestätigt durch Code und Test

- Knopf zählt nur vollständige Zeilen und nennt die unvollständigen (Helga P-1): `InvoiceUploadDialog.svelte:66-77`, DOM-Test «zählt auf dem Knopf …», Szenario «Nur vollständige Rechnungen …».
- Titel «Hinweise zu {Datei}»: DOM-Test «nennt im Hinweis einer Datei ihren Namen …».
- Kategorie zuerst, «Füllen Sie aus» (Pflicht = `validateInvoice`: Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung), «Prüfen Sie» (unsicher), «Ergänzen Sie, wenn …» (freiwillig), nichts davon bei einem Sammelscan: Unit-Tests in `invoice-upload.test.ts`, Szenario «Unsichere und nicht gefundene Angaben …». Wortlaut in allen vier Sprachen wie im Fachreview V-5.
- C-42 (ein von Hand ausgefülltes Feld ist weder unsicher noch fehlend): `readIn`, Unit-Test «nennt ein selbst ausgefülltes Feld nach erneutem Lesen nicht als unsicher».
- Texte für Sammelscan und Gutschrift wie in den Vorschlägen V-6 und V-2/M-1 (alle vier Sprachen). Die genannten Knöpfe stimmen mit `dashboard_add_invoice`, `invoices_beleg_add` und `invoices_edit_title` überein. Marker `TODO(fachlich prüfen, #222)`, #222 ist offen.
- Beleg-Satz: DOM-Test und Szenario.
- Teil-Erfolg: «Noch offen», die Abbruchfrage und `oncreated` nach dem Verwerfen (C-39) sind im DOM-Test «nennt nach einem Teil-Erfolg …» abgedeckt.
- Verlinkte Rechnungen mit Datum (C-27): DOM-Test und Szenario-Zeile «verlinkt Dwello die erstellte Rechnung … vom "31.03.2026"».
- V-14: `extractInvoice` → `'unreadable'` → 502 `EXTRACTION_UNREADABLE`. Abgedeckt durch `invoice-extraction.pg.test.ts`, den Vertrag `tests/contracts/invoice-extraction-unreadable.json` samt Prüfung in `api-contracts.pg.test.ts`, den DOM-Test mit Vertrag (Text und «Erneut versuchen») und das Szenario. `docs/api-specification.md` ist nachgeführt. `parseExtractionResponse` steht jetzt ausserhalb des `try`, wirft aber nicht (`config/llm.ts:334-340`).
- V-1: Der Hinweis zu gemischten Kosten erscheint nur bei umlagefähigen Werten, der Prompt bleibt unverändert, `preselected` ist unverändert. Unit-Test vorhanden (Lücke siehe C-5).
- C-41: Der Kommentar steht über `valuesOf`.
- Plan: «Test red», «Scenario red» und «Skills: tdd, ponytail, ponytail-review» stehen drin. Die grünen Szenarien dieses Slices tragen kein `@wip`, die übrigen `@wip` gehören zu späteren Slices.
- E2E: Steps rufen nur Tasks und Questions auf. Die Questions liefern Werte (Text, Linknamen). Die neue Bedingung in `chooseCategory` ist ein fachlicher Schritt («Rechnung der Datei öffnen, falls zu»). Gegenüber vorher geht keine Prüfung verloren: «Prüfen Sie: …» ist ins neue Szenario gewandert.
- Französische Guillemets und Doppelpunkte mit U+00A0 in den neuen fr-Texten.

## Nicht bestätigt

- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/invoice-upload.test.ts src/__tests__/invoice-upload-dialog.dom.test.ts`, 41/41 grün.
- Vom Aufrufer gemeldet, nicht erneut ausgeführt: `bunx vitest run` (157 Dateien, 2584 Tests), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, Backend `bun run type-check`, Backend-Tests `invoice-extraction.pg.test.ts`, `llm-extraction.test.ts` und `api-contracts.pg.test.ts`, E2E `invoices.feature` chromium+api (22 bestanden).
- Noch nicht gelaufen (vom Aufrufer genannt): `bun run test:coverage` und die ganze Backend-Suite.
- Ob «Test red» für den C-39-Test wirklich am fehlenden Verhalten rot war: Das steht nur im Plan, im Code nachvollziehbar ist es nicht.
- Ob der Stand-in-Fall «… unlesbar» den Code-Pfad mit `parseExtractionResponse` trifft und nicht nur einen JSON-String: Gesehen habe ich nur `llm-stub.ts:117`. Der Inhalt ist kein JSON-Objekt, also `null`, also `'unreadable'`.
