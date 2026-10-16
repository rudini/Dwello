# Fachreview #217 «Rechnungen aus hochgeladenen Belegen» – Runde 3 (Delta)

Gegenstand: Worktree `review-upload-fach3`, Commit be436c1d, Diff `3e3f99c..be436c1d`, beschränkt auf `src/lib/invoice-upload.ts` (Hinweise, Vorauswahl), `src/lib/file-pages.ts` (mehr Seiten), `backend/src/config/llm.ts` (Konfidenzregel), `messages/{de,fr,it,en}.json` (neue und geänderte `invoices_upload_*`, `invoices_beleg_*`, `privacy_llm_external`, `privacy_stored_1`, `invoices_delete_billed_text` en), `src/routes/invoices/[id]/DeleteConsequences.svelte`, `InvoiceBeleg.svelte`, README «OpenRouter», `docs/design/i18n-begriffe.md`, Szenarien am Ende von `tests/e2e/features/invoices.feature`. Grundlage: Runde 2 (`docs/reviews/upload-fachreview-2.md`), Triage `implementation_plan.md:36`, Entscheide in #217 «After the persona review» (2026-10-16).

Rechtsgrundlage: wörtliche Fedlex-Zitate wie in Runde 2 (Abruf 2026-10-15; OR SR 220, VMWG SR 221.213.11, DSG SR 235.1), hier nur die verwendeten:
- OR Art. 257b Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- VMWG Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen …»
- DSG Art. 19 Abs. 2 lit. c: «gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.» Abs. 3: «Werden die Daten nicht bei der betroffenen Person beschafft, so teilt er ihr zudem die Kategorien der bearbeiteten Personendaten mit.» Abs. 4: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ … mit.»
- DSG Art. 9 Abs. 3: «Der Auftragsbearbeiter darf die Bearbeitung nur mit vorgängiger Genehmigung des Verantwortlichen einem Dritten übertragen.»

## Übersicht (neue und offene Befunde)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-5 | Mietrecht | Minor | teilweise behoben: Löschdialog zeigt jetzt den M-3-Text, sagt aber weiterhin zugleich «Der Beleg wird ebenfalls gelöscht.» und «Bewahren Sie den Beleg auf» |
| V-15 | Verwalter | Minor | Nach «Erneut versuchen» bleibt eine vorher gewählte umlagefähige Kategorie, aber «umlagefähig» kommt aus der KI-Kategorie: Rechnung fällt still aus der Abrechnung |
| T-2 | Begriffe | Minor | Entschiedener Akonto-Hinweis braucht «Akontozahlungen» für Teilzahlungen des Vermieters an das Werk; Glossar: «Akonto» = Vorschuss des Mieters |
| T-1 | Begriffe | Nit | Rest: fr `invoices_delete_billed_text` «justificatif» statt «pièce justificative» |
| V-16 | Verwalter | Nit | Szenariotitel «Eine Gutschrift wird nicht als Rechnung erstellt» verspricht mehr als geprüft wird (nur nicht vorausgewählt) |

## Status der Befunde aus Runde 2

| ID | Status | Beleg |
|----|--------|-------|
| V-9 (Major) | behoben | `invoice-upload.ts` `selected: … && proposal.documentType === 'invoice' && …`; Unit-Test `invoice-upload.test.ts:68` «wählt eine Gutschrift und eine Mahnung nicht zum Erstellen, mit ihrem Hinweis»; Szenario `invoices.feature` «Eine Gutschrift wird nicht als Rechnung erstellt» prüft Hinweis und «nicht zum Erstellen ausgewählt». Entspricht Entscheid #217 «Gutschrift and Mahnung are not preselected». Nachrechnung Runde 2 (Mehrbelastung 80 bei +80) entfällt, solange der Verwalter die Zeile nicht selbst auswählt; der Hinweis sagt dann, was zu tun ist. |
| V-10 | behoben | dieselbe Bedingung (`documentType === 'reminder'` → nicht ausgewählt), derselbe Unit-Test. |
| V-11 | behoben | `file-pages.ts:34` `morePages: document_.numPages > MAX_PAGES`, Dialog übernimmt es vor dem Vorschlag (`InvoiceUploadDialog.svelte:80`), Hinweis `invoices_upload_more_pages` «Die KI hat nur die ersten {pages} Seiten gelesen. Prüfen Sie Betrag und Positionen auf den übrigen Seiten.» (vier Sprachen, `MAX_PAGES` = 3 eine Quelle). Betrag wird nicht zusätzlich als unsicher markiert; der Zeilenhinweis genügt fachlich. Randfall: genau 3 Seiten → kein Hinweis (richtig); Bild → nie. |
| V-12 | behoben | `llm.ts` `return value !== null && !(typeof sure === 'number' && sure >= 0.7)`; Tests `llm-extraction.test.ts:77` (nur ein Feld mit Konfidenz) und `:83` (`confidence` fehlt). Randfälle: Konfidenz als Text «0.9» oder `confidence: null` → unsicher (vorsichtig, richtig); 0.7 genau → sicher (wie die Kategorie-Schwelle). |
| V-13, V-14 | offen in #233 | nicht Gegenstand. V-13 zusätzlich: siehe Bestätigt «gemischte Kosten». |
| M-5 | teilweise | siehe unten. |
| R-6 | behoben | README: «OpenRouter is based in the USA and passes each request on to a model provider of its own choice. Restrict the routing in the OpenRouter account to providers you have checked, and name all recipients with their countries in `LLM_PROVIDER` and `LLM_PROVIDER_COUNTRY` …, so the privacy statement names them (Art. 19 DSG).» Deckt Art. 19 Abs. 2 lit. c und Abs. 4 DSG (alle Empfänger und Staaten) und mit «providers you have checked» die Genehmigung nach Art. 9 Abs. 3 DSG. |
| R-7 | behoben | `privacy_stored_1`: «Die Belege (hochgeladene Dateien der Rechnungen mit allem, was auf ihnen steht, etwa Namen, Adressen und Beträge) erleichtern die Belegeinsicht der Mieter …» – nennt Kategorien (Art. 19 Abs. 3 DSG; «mit allem, was auf ihnen steht» schliesst Bankverbindungen ein), Wortlaut jetzt wie Glossar «Erleichtert die Belegeinsicht». fr/it/en sinngleich. |
| R-8 | behoben | `privacy_llm_external` «(von PDF-Dateien höchstens die ersten drei Seiten, als Bilder)», fr/it/en sinngleich; stimmt mit `MAX_PAGES` = 3 und Backend `maxItems: 3`. |
| T-1 | behoben bis auf Rest | `i18n-begriffe.md` neue Zeilen «Gutschrift (eines Rechnungsstellers) – note de crédit / nota di credito / credit note», «Mahngebühr / Verzugszins – frais de rappel / intérêt moratoire, spese di sollecito / interesse di mora, reminder fee / default interest»; Messages verwenden sie. en `invoices_delete_billed_text` jetzt «Keep the supporting document». Rest fr: siehe T-1 unten. |

## Befunde

### M-5 (Mietrecht, Minor) – Löschdialog widerspricht sich weiter

- Beleg: `src/routes/invoices/[id]/DeleteConsequences.svelte:12-19` zeigt bei abgerechneter Rechnung mit Beleg nacheinander:
  1. `invoices_delete_beleg` «Der Beleg wird ebenfalls gelöscht.»
  2. `invoices_delete_billed_text` «… Bewahren Sie den Beleg auf: Der Mieter kann Einsicht verlangen.» (de, fr, it unverändert; nur en geändert)
  3. neu `invoices_beleg_billed` «Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.»
  DOM-Test `invoice-pages.dom.test.ts` «sagt beim Löschen einer abgerechneten Rechnung, dass Mieter den Beleg verlangen können» prüft nur Satz 3.
- Warum falsch: Der entschiedene M-3-Text ist jetzt da (Teil 1 von M-5 behoben). Der Widerspruch, den M-5 benannte, bleibt: Dwello löscht den Beleg und fordert im selben Dialog, ihn aufzubewahren; Satz 3 sagt zusätzlich, Mieter könnten ihn verlangen. Nach Glossar (`UBIQUITOUS_LANGUAGE.md:64`) ist «Beleg» die hochgeladene Datei; die Einsicht nach Art. 257b Abs. 2 OR / Art. 8 Abs. 2 VMWG kann der Vermieter danach nur mit einer Kopie gewähren, die er vorher heruntergeladen hat – das sagt der Dialog nicht. Ohne Beleg ist «Bewahren Sie den Beleg auf» nach Glossar ebenfalls schief (gemeint ist die Originalrechnung, vgl. `invoices_upload_keep_original`).
- Behebung: letzten Satz von `invoices_delete_billed_text` ersetzen durch «Bewahren Sie die Originalrechnung auf: Der Mieter kann Einsicht verlangen.» (fr «Conservez la facture originale : …», it «Conservi la fattura originale: …», en «Keep the original invoice: …»), und bei Beleg statt Satz 3 (oder zusätzlich) «Laden Sie den Beleg vorher herunter, wenn Sie ihn noch brauchen.» Der entschiedene M-3-Wortlaut darf bleiben; nur der eigene Satz vor #217 ist zu ändern. Test: DOM-Test prüft, dass «Bewahren Sie den Beleg auf» nicht mehr erscheint.

### V-15 (Verwalter, Minor) – Kategorie und «umlagefähig» laufen nach erneutem Lesen auseinander

- Beleg: `src/lib/invoice-upload.ts` `withProposal`: `const typed = Object.fromEntries(Object.entries(row.values).filter(([, value]) => value !== '' && value !== true));` dann `values: { ...read, ...typed, … }`. `read.isValidUtilityCost = category?.isAllowedUtilityCost ?? true` kommt aus der KI-Kategorie. Eine im Zustand «Fehler – erneut versuchen» (`InvoiceUploadRow.svelte:42` editierbar) gewählte Kategorie setzt `isValidUtilityCost` (`InvoiceCategoryFields.svelte:50`); ist sie umlagefähig, ist der Wert `true` und wird von `typed` verworfen. Test `invoice-upload.test.ts:87-89` prüft nur den Betrag.
- Nachrechnung: Verwalter wählt nach einem Fehler «Allgemeinstrom» (umlagefähig), drückt «Erneut versuchen»; die KI schlägt «Reparaturen» mit 0.9 vor → Ergebnis `categoryId` = Allgemeinstrom, `isValidUtilityCost` = false. Rechnung CHF 1'200, zwei Wohnungen zu gleichen Teilen: richtig je 600, so erstellt je 0 – die Kosten fehlen still in der Abrechnung (Art. 257b Abs. 1 OR: tatsächliche Aufwendungen). Umgekehrt (Verwalter wählt «Reparaturen», KI «Allgemeinstrom»): `false` bleibt erhalten, Ergebnis stimmig. Randfall ohne KI-Kategorie (`category` null): `read` = true, Ergebnis stimmig.
- Warum Minor: braucht Fehler, Eingabe und erneutes Lesen; die Checkbox ist sichtbar, aber die Kategorie entscheidet laut `categories_allocable_help` und Code-Kommentar «A category decides whether its costs may be charged».
- Behebung: `isValidUtilityCost` mit der Kategorie zusammen übernehmen: hat der Verwalter eine Kategorie gewählt, auch seinen `isValidUtilityCost` behalten (z.B. `typed.categoryId` → `isValidUtilityCost: row.values.isValidUtilityCost`). Unit-Test mit dem Fall oben.

### T-2 (Begriffe, Minor) – «Akontozahlungen» im Sinn des Rechnungsstellers

- Beleg: `invoices_upload_deducted` (Wortlaut des Product Owners, #217 «After the persona review»): «… Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.» Glossar `UBIQUITOUS_LANGUAGE.md:44`: «**Akonto** | Monatlicher Vorschuss des Mieters für Nebenkosten.»; `:135` «Geleistete Akontobeiträge … Vorauszahlungen des Mieters».
- Warum: Im Upload-Dialog sind die Teil- oder Vorauszahlungen des Vermieters an Werk oder Brennstofflieferanten gemeint, im Glossar die des Mieters an den Vermieter. Ein unerfahrener Vermieter kann lesen, er solle die Akonti der Mieter nicht erfassen (die er ohnehin nicht als Rechnung erfasst) und den eigentlichen Punkt übersehen: die Akontorechnungen des Werks. Fachlich ist der Satz richtig; es fehlt nur der Begriff.
- Behebung: Text ist entschieden, daher nur über den Product Owner: Glossarbegriff ergänzen (Vorschlag unten, in #222 aufnehmen, Labels `fachlich`, `entscheiden`) und ggf. Hinweis präzisieren: «… Erfassen Sie die Akontorechnungen des Rechnungsstellers nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.»

### T-1 (Begriffe, Nit) – Rest fr

- Beleg: `messages/fr.json` `invoices_delete_billed_text` «Conservez le justificatif : …» neben `invoices_delete_beleg` «La pièce justificative est également supprimée.» im selben Dialog; `i18n-begriffe.md` Beleg = «pièce justificative». it «giustificativo» stimmt.
- Behebung: erledigt sich mit M-5 («Conservez la facture originale»).

### V-16 (Verwalter, Nit) – Szenariotitel

- Beleg: `invoices.feature` «Szenario: Eine Gutschrift wird nicht als Rechnung erstellt» – geprüft wird Hinweis und «nicht zum Erstellen ausgewählt»; der Verwalter kann die Zeile weiter auswählen und erstellen.
- Behebung: «Eine Gutschrift ist nicht zum Erstellen ausgewählt».

## Fehlende Begriffe (für #222, Labels `fachlich`, `entscheiden`)

- **Akontorechnung (eines Rechnungsstellers)**: «Rechnung eines Werks oder Lieferanten über eine Vorauszahlung des Vermieters (z.B. Strom, Gas, Fernwärme). Die Schlussrechnung zieht sie ab; erfasst wird das Total der Leistungen der Schlussrechnung, die Akontorechnungen nicht zusätzlich. Nicht zu verwechseln mit dem Akonto des Mieters.» (fr «facture d'acompte», it «fattura d'acconto», en «advance invoice» – unsicher, in `i18n-begriffe.md` zu bestätigen)
- Gutschrift und Mahnung eines Rechnungsstellers: laut Plan bereits in #222.

## Bestätigt

- Akonto-Hinweis de wörtlich wie entschieden; Szenario «Schlussrechnung mit abgezogenen Akontozahlungen» prüft ihn. Nachrechnung (aus Runde 2, unverändert gültig): Leistungen 1'200, Akonto 1'000, zu zahlen 200 → Vorschlag 1'200; mit 4 × 250 zusätzlich erfasst 2'200 (1'000 doppelt), genau das sagt der Text. Randfall `deductedAmount` 0 oder fehlt → kein Hinweis (`francs` > 0).
- Gemischte Kosten: Hinweis wörtlich wie entschieden, Zeile nicht ausgewählt (`!proposal.nonAllocableItems`), Szenario prüft beides. Verweis «Rechnung erfassen» stimmt mit dem Knopf `dashboard_add_invoice` auf `/invoices` (fr «Saisir une facture», it «Registrare una fattura», en «Add invoice» – alle vier Texte zitieren ihn richtig), Kategorie «Reparaturen / Réparations / Riparazioni / Repairs» existiert in den Stammdaten (`backend/migrations/0002_stammdaten.sql:30`, nicht umlagefähig). Nachrechnung: Liftrechnung 1'500 = Wartung 900 + Reparatur 600 → hier 900 (umlagefähig), danach 600 in Reparaturen; Abrechnung enthält 900, Reparatur nach Art. 257b Abs. 1 OR nicht. Randfall reine Reparatur → umlagefähiger Betrag 0 nicht erfassbar; V-13 (#233).
- Vorauswahl nach Entscheid: nur `documentType === 'invoice'`, nicht mehrfach, kein Duplikat, keine gemischten Kosten; sonst bleibt die Zeile ausgewählt und nennt die zu prüfenden Felder: `invoices_upload_check_these` «Prüfen Sie: {fields}.» aus unsicheren und nicht gefundenen Feldern in Dialogreihenfolge (Leistungszeitraum einmal, Ende über Beginn); Szenario «… sagt die Datei von "Elektro Blitz" "Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum."». Feldhinweis `invoices_upload_missing` «Die KI hat diesen Wert nicht gefunden. Füllen Sie ihn aus, wenn er auf der Rechnung steht.» – richtig für optionale Felder (Rechnungsnummer, Fälligkeit, Leistungszeitraum).
- Feldbezeichnungen in «Prüfen Sie» aus Glossarbegriffen (Rechnungssteller, Rechnungsnummer, Rechnungsdatum, Leistungszeitraum, Fälligkeitsdatum, Betrag, Beschreibung); neu `invoices_due_date` «Fälligkeitsdatum» = Glossar `:60`.
- `invoices_upload_kept` «Dwello speichert jede Datei als Beleg zu ihrer Rechnung.» entspricht Glossar «Beleg».
- `InvoiceBeleg.svelte`: Warnung «abgerechnet» nur, wenn ein Beleg da ist, der ersetzt würde (M-3: «replacing the Beleg … warns»); Hinzufügen eines ersten Belegs ersetzt nichts. Hinweis Originalrechnung bleibt sichtbar (M-2, Art. 8 Abs. 2 VMWG). Datei wird vor dem Senden geprüft (gleiche Regeln wie der Dialog).
- Cookies (Art. 45c FMG) und Nutzungsbedingungen nicht berührt.

## Nicht bestätigt

- Fedlex-Wortlaute nicht neu abgerufen, sondern aus Runde 2 (2026-10-15) übernommen; das Delta berührt keine neue Norm.
- DPF-Zertifizierung von OpenRouter und die Anbieter/Staaten von `qwen/qwen2.5-vl-72b-instruct` (README-Beispiel «Alibaba Cloud, Singapur»): wie in Runde 2 nicht abrufbar, **unsicher**; das README überlässt die Prüfung jetzt ausdrücklich dem Betreiber.
- Übersetzung «Akontorechnung» (fr/it/en) im Vorschlag T-2: nicht recherchiert, **unsicher**.
- Ob reale Modelle `documentType` und `nonAllocableItems` zuverlässig setzen: Modellqualität, nur Stand-in und Unit-Tests mit festen Antworten (wie #217 vorsieht).
- V-15 nicht im Browser nachgespielt, nur aus dem Code (`invoice-upload.ts` `withProposal`, `InvoiceCategoryFields.svelte:50`) abgeleitet.
