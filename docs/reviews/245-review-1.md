# Code-Review #245, Runde 1

Gegenstand: `git diff a828b368 9353cc58 -- . ':!docs/reviews'` (eae980e6, 822c6c6c, 9353cc58), Worktree `w9-review-245-code` (detached, 9353cc58). Anforderung: Issue #245 (Text, Kommentare, «Decided (product owner)»), Plan `w9-review-245-fach/245-texts.md`, Fachreview `docs/reviews/245-fachreview-1.md` (V-1 bis V-7, V-9 bis V-12 übernommen; V-8 nicht).

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | `src/lib/invoice-upload.ts:209` | `selectionHelp` nennt den Mischkosten-Grund («weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.») bei jeder nicht angekreuzten Zeile mit `nonAllocableItems`, auch wenn sie aus einem anderen Grund nicht angekreuzt ist. Das betrifft eine Datei mit mehreren Rechnungen (Häkchen gesperrt, `InvoiceUploadRow.svelte:76` `disabled={row.several}`, die Hilfe verlangt aber, es zu setzen), ein Duplikat und eine Akontorechnung. `toDoOf` schliesst diese Fälle über `recorded`/`several` aus, `selectionHelp` nicht. Zeigen: Unit-Test `selectionHelp(withProposal(newRow(…), proposal({ invoiceCount: 2, nonAllocableItems: true })))` gibt heute den Mischkosten-Text statt `undefined` zurück. |
| C-2 | Minor | `src/routes/invoices/UploadResult.svelte:26` | `{#each open as one (one.name)}` ist nach dem Dateinamen geschlüsselt. Der Dialog lässt dieselbe Datei oder zwei gleichnamige Dateien zu (`fileRefusal` prüft nur Grösse und Typ, `invoice-upload.ts:86`; Zeilen sind nach `row.key` geschlüsselt). Bleiben beide offen, gibt es einen doppelten Schlüssel: Svelte wirft im Dev-Build `each_key_duplicate`, im Build ist die Liste unbestimmt. Vorher stand ein `join(', ')` ohne Schlüssel. Zeigen: DOM-Test mit zweimal `scan.pdf` ohne Kategorie und einer vollständigen Datei, danach erstellen. Behebung: Schlüssel `row.key` mitgeben oder ohne Schlüssel iterieren. |
| C-3 | Minor | `tests/e2e/steps/invoice-form.steps.ts:173` | `Number(inDays(0).slice(0, 4))` kopiert `thisYear` aus `tests/e2e/steps/invoice-detail.steps.ts:173`. Das ist eine Kopie eines bestehenden Helfers (ponytail-review `reuse`): ihn exportieren oder nach `fixtures/dates` verschieben. |

Keine Blocker, keine Major.

## Abgleich mit der Anforderung (bestätigt durch Code und Test)

- **Lift (V-2, V-3):** neuer Text `invoices_upload_mixed` in vier Sprachen. Die Hilfe am Häkchen hat dieselbe Bedingung wie der Mischkosten-Hinweis (`mixedCosts`, `invoice-upload.ts:203`). Abgedeckt im Szenario «Rechnung mit Kosten, die nicht umlagefähig sind» mit dem Schritt «erklärt … nichts mehr» nach dem Anker, dazu im Unit-Test.
- **Gutschrift (V-6, V-12):** Text mit Betrag nur ohne `deductedAmount` (`invoice-upload.ts:196`). Unit-Tests für beide Fälle, Szenario mit «CHF 1’250.00». Das Häkchen bleibt ankreuzbar (PO), die Hilfe sagt warum (DOM- und Unit-Test, Szenario).
- **Vorauswahl (PO, V-4):** Texte wörtlich wie im Fachreview, die Hilfe geht beim Ankreuzen (DOM-Test `invoice-upload-row-select-help` wird `null`).
- **«Noch offen» (V-5):** `openReason` ist die erste Meldung von `checkRow`, sonst `createError` (`invoice-upload.ts:300`). Abgedeckt durch Unit-Test, DOM-Test und Szenario «Nur vollständige Rechnungen …». Neue Schlüssel `_title`/`_item`, alter Schlüssel `invoices_upload_still_open` in allen vier Dateien entfernt.
- **Sammelscan:** Reihenfolge in vier Sprachen getauscht, Unit-Test und Szenario.
- **Datei und Felder vergleichen:** abgelehnt, mit Begründung im Plan, vom Fachreview bestätigt. Kein Code.
- **Ohne KI:** `invoices_upload_not_read` erscheint als erste Aufgabe, solange Pflichtfelder fehlen, und `withoutKi` setzt keine Notiz mehr. `backend_extraction_unavailable` bleibt über `backendMessage()` erreichbar (`backend-error.ts:19`). Abgedeckt durch Unit-Test, DOM-Test und Szenario, mit Negativprüfung nach dem Anker.
- **KI-Notiz «nicht gefunden»:** `quiet` in `fieldNote` und `Field.svelte` (ohne Icon, `text-ink-muted`), DOM-Test.
- **Abbrechen nach dem Erstellen:** «Übrige Dateien verwerfen» in vier Sprachen, DOM-Test und Szenario.
- **Statuszeile (V-1):** «Fertig: {done} von {count}» ohne abgelehnte Dateien, «Nicht gelesen» als Zusammenfassung. Nachgerechnet: (a) 1 gelesen und 1 abgelehnt ergibt «Fertig: 1 von 1. Bitte prüfen: 1. Nicht möglich: 1.», (b) gescheitert ergibt «Fertig: 1 von 1. Nicht gelesen: 1.», nur abgelehnte ergibt nur «Nicht möglich: n.». DOM-Tests und zwei Szenarien.
- **Duplikat:** `recorded` schliesst ein nicht angekreuztes Duplikat aus und nimmt es angekreuzt wieder auf. Unit-Test und Szenario.
- **«z. B.»:** beide Stellen in de, im Unit-, DOM- und E2E-Text nachgezogen.
- **Abgerechnete Rechnung (P-5, V-7):** `BilledWarning` listet Nummer und Status (`statusLabels`, Getter, keine Modulebene). Die Daten kommen aus `statementPeriods` (`src/lib/server/invoice.ts:110`), die Lade- und Bearbeitungsseite geben sie schon zurück. Abgedeckt durch DOM-Tests beim Löschen und Bearbeiten und durch Szenarien in `invoice-detail.feature` und `invoice-edit.feature`. P-6 ist als «already fixed» begründet, vom Fachreview bestätigt.
- **Kategorie Pflicht beim Bearbeiten (PO, V-11):** `categoryRequired` und der Fehler `invoices_upload_category_missing` vor dem Aufruf (`edit/+page.svelte:87`). Der DOM-Test prüft kein «optional» und keinen BFF-Aufruf, das Szenario prüft das Label ohne «(optional)» und die Fehlermeldung. «Neue Rechnung» bleibt optional.
- **Gesperrtes «Umlagefähig»:** `Checkbox.svelte` mit `cursor-not-allowed opacity-60`, wie `Button.svelte:58`. DOM-Test.
- **Gescheitertes Lesen (C-25):** `toDoOf` nennt bei `failed` die Pflichtfelder. Unit-Test und Szenario.
- **Reihenfolge:** `FIELD_LABELS` in Formularreihenfolge, die Kategorie bleibt ein eigener Satz (V-10). Unit-Test und Szenario.
- **Hinweistexte aus #222 und i18n-Zeile «Akontorechnung»:** schon auf der Basis vorhanden (#455, `docs/design/i18n-begriffe.md:46`).
- **fr (V-9):** U+00A0 per Skript geprüft in allen neuen und geänderten fr-Texten (« », vor «:» und «;»), keine normalen Leerzeichen.
- **Vier Sprachen:** alle 12 neuen oder geänderten Schlüssel in de/fr/it/en vorhanden, alle Dateien mit 1838 Schlüsseln.
- **Red:** Die neuen Unit- und DOM-Tests scheitern nach dem Lesen auf der Basis, an fehlenden Exporten, alten Texten, Klassen oder Zählungen. Ausnahme ist «nennt bei einer Gutschrift mit abgezogenen Beträgen keinen Betrag»: Der Test besteht auch auf der Basis, wird aber rot, sobald die Bedingung `!proposal.deductedAmount` fehlt. Er schützt also den neuen Zweig, kein Befund.
- **Screenplay:** Die Steps rufen nur Tasks und Questions auf. Die Questions geben Texte zurück, ausser bei Ja/Nein-Zuständen. Die Negativprüfungen haben einen Anker. Die Features beschreiben fachlich, ohne «klickt», «Button» oder «Feld».
- **a11y:** Die neuen Inhalte stehen in bestehenden Zuständen (`upload-dialog` mit Mischkosten-Datei, `upload-partial`, `upload-discard-created`, `invoice-billed-detail/delete-dialog`, `invoice-billed-edit/default`, `invoice-edit/submit-cleared`), also kein neuer Bildschirm und kein neuer Zustand.

Ponytail: abgesehen von C-3 nichts zu kürzen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx fallow audit`, alle Vitest-Läufe (gezielt und voll) und die E2E-Läufe (rot auf main, danach 111 und 38 grün): vom Aufrufer gemeldet. Selbst nicht wiederholt, weil der Worktree kein `node_modules` hat.
- Ob jedes geänderte Szenario auf der Basis an der fehlenden Funktion rot war: vom Aufrufer gemeldet (10 + 5). Beim Szenario «Eine schon erfasste Rechnung wird nicht doppelt erstellt» hängt das Rot von der Kategorie-Sicherheit ab, die die KI-Ersatzattrappe für «Hauswart Huber» liefert. Nicht nachgeprüft.
- Zu «KI-Notiz» (P-4) und «Umlagefähig gesperrt» (P-6) gibt es keine Szenarien, nur DOM-Tests. Die Commit-Meldungen enthalten kein `No scenario: <reason>`. Das ist reine Darstellung, Text und Verhalten bleiben gleich (Fachreview, «Nicht bestätigt»), deshalb kein Major. Der Pull Request sollte es nennen.
- Der Zustand «Lesen gescheitert» (neu mit Aufgabenliste und «Nicht gelesen») steht nicht in `tests/a11y/screens.json`. Er fehlte schon auf der Basis, deshalb kein Befund des Diffs.
- Wie C-2 im Build aussieht: nicht ausgeführt, nur aus dem Svelte-Verhalten abgeleitet (Prüfung der Schlüssel nur im Dev-Build).
- `implementation_plan.md` hat auf 9353cc58 keine Session für #245 (Workflow 8). Die Begründungen der abgelehnten Punkte («Datei und Felder vergleichen», P-6, V-8) stehen noch nicht im Issue (Done means von #245). Beides ist Sache des Abschlusses, nicht des Codes.
