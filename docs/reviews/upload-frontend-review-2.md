# Code-Review #217, Upload-Slices, Runde 4 (Delta)

Worktree: `review-upload-code4` (be436c1d). Bereich: `git diff 3e3f99c be436c1d`. Darin enthalten sind der Merge `cc69178` (origin/main, #159) und der Fix-Commit `be436c1d`.

Gelesen habe ich:
- alle Code-, Test- und E2E-Dateien von `be436c1d`;
- die geänderten Schlüssel in allen vier `messages/*.json`;
- die Plan-Zeilen der Session #217 und den Abschnitt «After the persona review» in Issue #217.

Die Persona-Berichte und die Fachreview-Datei habe ich nur dort gelesen, wo ein Fix auf sie verweist. Die Merge-Seite von main (#159) habe ich nur an der Konfliktstelle und an den Dateien geprüft, die sich mit dem Branch überschneiden.

## Merge `cc69178`

Die Konfliktauflösung in `src/routes/invoices/+page.svelte` stimmt (`git show --remerge-diff cc69178`):
- Der Upload-Dialog und `UploadResult` bleiben.
- `InvoiceSearch` steht wie in #159 in `{#key $page.url.search}`.
- Kein Konfliktrest, nichts doppelt.

Sonst fügt der Merge nur die Dateien von main ein, ohne Änderung durch den Branch (`git diff c91aa8e9 cc691789` zeigt nur Branch-Inhalt).

## Stand der Befunde aus Runde 3

| ID | Stand | Beleg |
|----|-------|-------|
| C-16 | behoben | Fälligkeitsdatum als Feld (`UploadRowFields.svelte:59-66`). Text für «unsicher» und «nicht gefunden» bei jedem gelesenen Feld, auch bei der Rechnungsnummer (`fieldNote`, `invoice-upload.ts:203`). Die Zeile nennt die Felder ohne Aufklappen («Prüfen Sie: …»). Tests: `invoice-upload-dialog.dom.test.ts:91`, `invoice-upload.test.ts` «nennt die Felder …», Szenarioschritt «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.». |
| C-17 | behoben | `fileRefusal` vor dem Senden (`InvoiceBeleg.svelte:34-36`), danach Fokus auf die Dateiauswahl. Test `invoice-pages.dom.test.ts` «lehnt eine zu grosse Datei ab …» (kein Aufruf, Text, Fokus). |
| C-18 | Ablehnung angenommen | Der Alert ist weg. Das Ziel ist jetzt ein Absatz, im Dialog mit zwei Sätzen (`InvoiceUploadDialog.svelte:179-182`). `toContain` ist dort sachlich begründet. |
| C-19 | behoben | Zeilen werden vor dem ersten `await` eingefügt (`InvoiceUploadDialog.svelte:96-107`). Test «nimmt auch bei zwei schnellen Auswahlen höchstens 20 Dateien». |
| C-20 | behoben | `if (created.length) oncreated(created)` (`:151`). Test «meldet nichts als erstellt, wenn abgebrochen wird». |
| C-21 | behoben | `invoiceChoices` liefert auch den Standard-Schlüssel; die Liste lädt die Kategorien einmal. Test `invoices.test.ts:108`. Eine Nebenwirkung steht unter C-34. |
| C-22 | behoben | `Field`-Notiz über `aria-describedby` (`Field.svelte:47-49`), im Test geprüft. |
| C-23 | teilweise | Kein Formular und fehlende Datei geben jetzt 400 (`formOf`, `belegOf`; Test «Formular, das kein Formular ist»). Ungültiges JSON in `invoice` gibt weiter 500 → C-32. |
| C-24 | teilweise | Gutschrift-Hinweis, Link zur erfassten Rechnung, «Wählen Sie eine Datei.» und das Ergebnis im Dialog sind jetzt getestet. Offen → C-33. |
| C-25 | behoben | `api.ts:128-133`. |
| C-26 | behoben | Die Alerts mit doppeltem Titel sind durch Absätze ersetzt. Die Zeilenhinweise tragen den Titel «Zu dieser Datei». |
| C-27 | teilweise | Der Duplikat-Link öffnet im selben Tab (Test). Gleich lautende Links im Ergebnis (`UploadResult.svelte:16`) bleiben; laut Plan in #233. Die Plan-Zeile führt C-27 zugleich unter «fixed C-19..C-28» → C-38. |
| C-28 | behoben | Was der Verwalter eingetippt hat, bleibt erhalten (`invoice-upload.ts:147,151`). Test «behält, was der Liegenschaftsverwalter schon eingetragen hat …». |

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-29 | Major | implementation_plan.md:35-39 | Slice 3 ändert und ergänzt Szenarien, aber keine `Scenario red:`-Zeile hält ihr Rot fest. Betroffen: das neue Szenario «Eine Gutschrift wird nicht als Rechnung erstellt»; die Schritte «… nicht zum Erstellen ausgewählt» und «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.»; die geänderten Texte für Akonto und gemischte Rechnungen; «öffnet der Beleg …» jetzt als Anzeige in einem neuen Tab. |
| C-30 | Minor | implementation_plan.md:35-38 | Slice 3 hat nur für zwei neue Tests eine eigene `Test red:`-Angabe. Die übrigen (rund 20 DOM- und Unit-Tests, Backend-Test V-12) stehen nur als «tests where behavior» oder «DOM tests» im Plan. |
| C-31 | Minor | src/lib/server/invoice.ts:71; tests/contracts/invoice.json | `toInvoice` liest jetzt `invoiceNumber` aus der Antwort zur Rechnung. `invoice.json` hat das Feld nicht, und kein Load-Test prüft die Zuordnung. Der DOM-Test (`invoice-pages.dom.test.ts` «zeigt die Rechnungsnummer») gibt das Feld direkt in die Komponente. Fehlt das Feld in der Backend-Antwort, bleiben alle Tests grün. |
| C-32 | Minor | src/routes/api/invoices/+server.ts:20 | Rest von C-23: `JSON.parse` des Feldes `invoice` wirft bei ungültigem JSON einen `SyntaxError`. `handleProxyError` macht daraus 500 `PROXY_ERROR` statt 400. |
| C-33 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:142-147,151; src/routes/invoices/[id]/InvoiceBeleg.svelte:107-111 | Rest von C-24 und neu ungetestet: der Fokus auf das erste Feld mit Fehler nach teilweisem Erstellen (Marco P-4, laut Plan behoben); `oncreated` mit den erstellten Rechnungen erst nach dem Verwerfen; eine Absage des Backends mit Code und `params` auf der Rechnungsseite. |
| C-34 | Nit | src/lib/server/invoice.ts:250-254; src/routes/invoices/[id]/+page.server.ts:12; [id]/edit/+page.server.ts:12 | `invoiceChoices` holt jetzt auch `config/default_distribution_key_id`. Auf der Detail- und der Bearbeitungsseite ist das eine Anfrage pro Load, deren Ergebnis niemand braucht. |
| C-35 | Nit | src/lib/invoice-upload.ts:103 | `FIELD_LABELS` sagt «in the order the dialog shows them». Der Dialog zeigt die Felder aber in einer anderen Reihenfolge: Nummer, Datum, Zeitraum, Betrag, Rechnungssteller, Beschreibung, Fälligkeitsdatum. «Prüfen Sie: …» nennt die Felder daher in anderer Reihenfolge als die Felder. |
| C-36 | Nit | src/lib/invoice-upload.ts:130-169 | Nach «Erneut versuchen» bleibt ein Feld, das der Verwalter selbst gefüllt hat, im Wert erhalten (C-28). Trotzdem steht dort «Die KI hat diesen Wert nicht gefunden», und das Feld erscheint in «Prüfen Sie: …». |
| C-37 | Nit | backend/src/config/llm.ts:315; tests/e2e/screenplay/questions.ts:189-190 | Zwei veraltete Kommentare. `unsure` heisst noch «confidence below 0.7»; seit V-12 zählt auch ein Feld ohne Angabe. Der Kommentar von `DownloadedFile` steht jetzt über `OpenedFile`. |
| C-38 | Nit | implementation_plan.md:35 | Die Triage-Zeile meldet «fixed C-19..C-28». Dieselbe Plan-Zeile führt C-27 aber unter #233 als offen. C-27 sollte als teilweise behoben dastehen. |

## Blocker/Major

### C-29 – Kein `Scenario red:` für die Szenario-Änderungen von Slice 3

Warum es falsch ist:
- `CLAUDE.md`, Workflow 1, verlangt für jede Verhaltensänderung, die der Benutzer sieht, ein Szenario, dessen Rot im Plan steht (`Scenario red: <assertion>`).
- Slice 3 ändert sichtbares Verhalten: Gutschrift, Mahnung und gemischte Rechnungen werden nicht mehr vorgewählt; die Zeile nennt die Felder zum Prüfen; die Hinweistexte für Akonto und gemischte Rechnungen sind neu; der Beleg öffnet in einem neuen Tab statt als Download.
- In `tests/e2e/features/invoices.feature` und `tests/e2e/steps/invoice-upload.steps.ts` gibt es dafür Szenarien und Schritte.
- Der Plan hält aber nur das Rot von Slice 1 und 2 fest (`implementation_plan.md:12`). In der Zeile zu fach-reviewer Runde 2 steht nur «test and scenario», ohne die Assertion, an der es rot war.

So lässt es sich zeigen: `grep -n "Scenario red" implementation_plan.md` liefert nur Zeile 12.

Behebung: je Szenario oder Schritt die rote Assertion nachtragen. Ein Szenario, das erst nach dem Code geschrieben wurde, wird dafür ohne den Code laufen gelassen. Beispiele:
- Gutschrift: `belegChosenForCreating` war `true`.
- Beleg anzeigen: `belegShown` war `false`, weil der Beleg mit `attachment` kam.
- Prüfen Sie: der Text fehlte.

## Nicht bestätigt

- **Tests nicht selbst gelaufen.** `node_modules` im Worktree verweist auf `/home/user/dwello/node_modules`, und der Zugriff darauf ist gesperrt (deny rule). Vom Aufrufer gemeldet, nicht von mir wiederholt:
  - `bun run test:coverage` (157 Dateien, 2540 Tests, über dem Floor), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, `bunx fallow audit`;
  - Backend `bun run test` (635/0) und `bun run type-check`;
  - E2E chromium: 101 bestanden (Rechnungs-Szenarien plus Axe- und Sprachzeilen);
  - chromium+api: 64 bestanden. Dieser Lauf war vor der letzten Änderung am Beleg-Schritt; danach liefen nur die 4 Beleg-Szenarien erneut.
- **Rote Tests.** Nur für die zwei in der Plan-Zeile genannten Tests ist ein Rot belegt (siehe C-29, C-30). Nachgestellt habe ich es nicht.
- **Beleg im Browser anzeigen (`inline`).**
  - Geprüft: Das Backend setzt `content-type` nur auf PDF, JPEG oder PNG, erkannt an den ersten Bytes (`document.service.ts:90-92`, `routes/file-response.ts`). Ein HTML-Inhalt aus derselben Quelle ist deshalb nicht zu erwarten.
  - Nicht geprüft: ob die App `X-Content-Type-Options: nosniff` setzt. In `src/hooks.server.ts` und `svelte.config.js` steht nichts dazu.
  - Wie Browser ein PDF im neuen Tab tatsächlich anzeigen, prüft das Szenario nicht. Es folgt dem Link per Request, nicht per Klick.
- **Darstellung.** Die neue Notiz in `Field` (Farbe `text-caution`, Symbol), der Fortschritt, das Fälligkeitsdatum bei 390 px und im Dark Mode sind nur über die vom Aufrufer gemeldeten Axe- und Sprachzeilen abgedeckt. Angesehen habe ich sie nicht.
- **Fachliche Texte.** Die Hinweise zu Akonto und gemischten Rechnungen stimmen wörtlich mit der Entscheidung im Issue überein. Die Kategorie «Reparaturen / Réparations / Riparazioni / Repairs» und «Rechnung erfassen» gibt es in allen Sprachen. Inhaltlich sind diese Texte und die Datenschutztexte Sache von `fach-reviewer`. fr, it und en habe ich nur auf Vollständigkeit und Begriffe nach `i18n-begriffe.md` gelesen.
- **`aria-describedby` am breiten Dialog.** Ohne den Verweis wird der Zweck-Text des Upload-Dialogs beim Öffnen nicht mehr vorgelesen. Bewusst so und getestet (`ui-dialog.dom.test.ts`). Mit einem Screenreader geprüft habe ich das nicht.
