# Fachreview #217 «Rechnungen aus hochgeladenen Belegen» – Runde 2 (Umsetzung)

Gegenstand: Worktree `review-upload-fach2`, Commit 3e3f99c, Diff `ec7ebeb..3e3f99c`, beschränkt auf: `backend/src/config/llm.ts` (EXTRACTION_PROMPT, `parseExtractionResponse`), Texte `invoices_upload_*`, `invoices_beleg_*`, `invoices_delete_beleg`, `backend_extraction_unavailable`, `backend_beleg_not_found` in `messages/{de,fr,it,en}.json` und ihre Verwendung (`src/lib/invoice-upload.ts`, `src/routes/invoices/*Upload*.svelte`, `UploadRowNotes.svelte`, `src/routes/invoices/[id]/InvoiceBeleg.svelte`, `[id]/+page.svelte`), `privacy_llm_external`, `privacy_llm_local`, `privacy_stored_1`, README «External LLM provider», Glossarzeile «Beleg», `docs/design/i18n-begriffe.md` Zeile Beleg, Szenarien am Ende von `invoices.feature` und `invoice-detail.feature`. Grundlage: Runde 1 (`docs/reviews/upload-fachreview-1.md`), Triage im Plan (`implementation_plan.md:14`), Entscheide des Product Owners in #217 («After the domain review»).

Rechtsgrundlage (Fedlex, wörtlich; dieselben Fedlex-Abrufe wie Runde 1 vom 2026-10-15, OR SR 220 Stand 1.10.2026, VMWG SR 221.213.11 Stand 1.10.2025, DSG SR 235.1 Stand 7.7.2025):
- OR Art. 257b Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- VMWG Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- DSG Art. 19 Abs. 2: «… er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.» Abs. 3: «Werden die Daten nicht bei der betroffenen Person beschafft, so teilt er ihr zudem die Kategorien der bearbeiteten Personendaten mit.» Abs. 4: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.»
- DSG Art. 9 Abs. 3: «Der Auftragsbearbeiter darf die Bearbeitung nur mit vorgängiger Genehmigung des Verantwortlichen einem Dritten übertragen.»
- DSG Art. 6 Abs. 5 (Satz 1): «Wer Personendaten bearbeitet, muss sich über deren Richtigkeit vergewissern.»

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-9 | Verwalter | Major | Gutschrift wird als normale Rechnung vorgeschlagen und ist zum Erstellen ausgewählt; mit positivem Betrag erhöht sie die Nebenkosten statt sie zu senken |
| V-10 | Verwalter | Minor | Mahnung ist zum Erstellen ausgewählt; ohne passende Rechnungsnummer wird die Forderung doppelt erfasst, Rechnungsdatum ist das der Mahnung |
| V-11 | Verwalter | Minor | Die KI liest nur die ersten 3 Seiten einer PDF; das sagt Dwello nirgends (Total, Abzüge, Reparaturpositionen auf späteren Seiten) |
| V-12 | Verwalter | Minor | Fehlt der Konfidenzwert in der KI-Antwort, gilt jede Angabe als sicher |
| V-13 | Verwalter | Nit | Hinweis «gemischte Kosten» passt nicht, wenn die ganze Rechnung eine Reparatur ist |
| V-14 | Verwalter | Nit | «Die KI ist nicht verfügbar» auch, wenn die KI läuft, aber nichts Lesbares antwortet |
| M-5 | Mietrecht | Minor | Löschdialog einer abgerechneten Rechnung sagt zugleich «Der Beleg wird ebenfalls gelöscht.» und «Bewahren Sie den Beleg auf»; der entschiedene M-3-Text fehlt dort |
| R-6 | Rechtstexte | Minor | README-Beispiel OpenRouter: Daten gehen über OpenRouter an einen weiteren Modellanbieter; Datenschutzerklärung nennt dann nur «OpenRouter (USA)» |
| R-7 | Rechtstexte | Nit | `privacy_stored_1` nennt Zweck und Dauer der Belege, aber nicht die Kategorien der darin enthaltenen Personendaten (Rest von R-1) |
| R-8 | Rechtstexte | Nit | `privacy_llm_external` sagt «PDF-Seiten als Bilder», übermittelt werden höchstens die ersten 3 Seiten |
| T-1 | Begriffe | Nit | «Gutschrift», «Mahngebühren», «Verzugszinsen» fehlen in `i18n-begriffe.md`; en «receipt» neben «supporting document» im selben Dialog |

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| V-1 | behoben | Prompt `llm.ts` EXTRACTION_PROMPT: «totalAmount: Total der Leistungen in CHF inkl. MWST, ohne Mahngebühren und Verzugszinsen, vor dem Abzug bereits bezahlter Beträge …», `deductedAmount`, `documentType`; Hinweise `invoices_upload_deducted`, `_reminder`, `_credit_note` (de/fr/it/en), entspricht dem Entscheid in #217. Nachgerechnet siehe unten. Gutschrift/Mahnung: siehe neue Befunde V-9, V-10. |
| V-2 | behoben | `description: alle erbrachten Leistungen … jede Position genannt`, `nonAllocableItems`; Hinweis `invoices_upload_mixed` wörtlich wie #217; Szenario `invoices.feature` «Rechnung mit Kosten, die nicht umlagefähig sind». Rest V-13 (Nit). |
| V-3 | abgelehnt (V-3a, V-3b) | Basis unverändert: Unsicheres wird markiert, sperrt nicht (Entscheid); Leistungszeitraum fehlt → #131/#134. Kein neuer Blick. |
| V-4 | behoben | `invoices_upload_create_failed`: «… Versuchen Sie es noch einmal.» |
| V-5 | behoben | Prompt: «dueDate: … nur wenn die Rechnung ein Datum nennt …; bei «zahlbar innert 30 Tagen» null». |
| V-6 | abgelehnt | Basis: `extractFromFile` vergleicht jetzt `lower(trim(…))` für Rechnungssteller und -nummer (Gross/Klein normalisiert), sonst wie entschieden. Kein neuer Blick. |
| V-7 | behoben | Prompt nennt «Handwerker, Lieferanten, Gemeinde oder Werke»; Sprache «auf Deutsch» festgelegt; einzelnes Leistungsdatum → null («nur wenn die Rechnung ihn mit Beginn und Ende nennt»); Zahlformat «1'250.00 oder 1'250.–». |
| V-8 | bestätigt | unverändert, «inkl. MWST». |
| M-1 | behoben | `checkRow` (`invoice-upload.ts:150-153`) verlangt die Kategorie, Text «Wählen Sie eine Kategorie.»; Kategorie unter 0.7 wird nicht übernommen (`:114`); Szenario «Rechnung ohne KI aus einer Datei erfassen» zeigt es. |
| M-2 | behoben | Glossar `UBIQUITOUS_LANGUAGE.md:64` (Wortlaut des Product Owners: «Hochgeladene Datei einer Rechnung (Scan, Foto oder PDF) … Erleichtert die Belegeinsicht … die Originalrechnung bewahrt der Liegenschaftsverwalter auf.»); `invoices_upload_keep_original` im Dialog (`InvoiceUploadDialog.svelte:157-159`) und beim Beleg (`InvoiceBeleg.svelte:57-59`), Szenarien prüfen beides. Passt zu Art. 8 Abs. 2 VMWG. |
| M-3 | teilweise | Beleg-Bereich warnt bei abgerechneter Rechnung (`InvoiceBeleg.svelte:52-56`, Szenario «Warnung beim Ersetzen …»). Löschdialog: siehe M-5. |
| M-4 | behoben in Szenarien/UI; Glossar offen in #222 | Szenarien sagen «Datei» vor dem Erstellen, «Beleg» danach. `UBIQUITOUS_LANGUAGE.md:54` definiert «Rechnung» weiterhin als «Beleg eines Dienstleisters» – offen in #222 «Glossary: Rechnung vs. Beleg, Konfidenz per field, Auslesen». |
| R-1 | teilweise | `privacy_stored_1` nennt jetzt Belege, Zweck und Dauer («dienen der Belegeinsicht der Mieter und bleiben gespeichert, bis Sie den Beleg ersetzen oder die Rechnung löschen»), richtig zu `invoices_delete_beleg` und Ersetzen. Kategorien der Daten fehlen: R-7. |
| R-2 | abgelehnt | Basis unverändert (lokaler Text, Bedingung in #216). Kein neuer Blick. |
| R-3 | behoben | `privacy_llm_external`: «Wählen Sie unter «Rechnungen hochladen» Dateien aus, wird jede sofort mit ihrem Dateinamen übermittelt (PDF-Seiten als Bilder), auch wenn Sie das Hochladen danach abbrechen …». Code bestätigt: Auslesen nur über `POST /invoices/extract` aus dem Dialog; `PUT /invoices/:id/document` (Beleg hinzufügen/ersetzen) ruft keine KI. fr/it/en sinngleich. |
| R-4 | abgelehnt | Basis unverändert (Dateiname im Prompt, in der Erklärung genannt). |
| R-5 | behoben | `src/lib/file-pages.ts:19-20` lädt pdf.js und Worker aus dem eigenen Bundle (`pdfjs-dist` 6.3.289, `?url`), kein CDN; `getDocument` ohne `cMapUrl`/`standardFontDataUrl`, also keine Nachladeanfragen. |

## Nachrechnung der Betragsregeln

Parser `parseExtractionResponse` (`llm.ts`): `francs` nimmt nur Zahlen > 0, rundet auf 0.01 (`roundToRappen`, nicht auf 5 Rappen – richtig für Rechnungsbeträge).
- 1250 → «1250.00»; 1234.567 → «1234.57»; Text «1'250.-» → null (Test `llm-extraction.test.ts:47-58`); −80 → null; 0 → null.
- Schlussrechnung (Entscheid V-1): Total Leistungen 1'200, abgezogen Akonto 1'000, zu bezahlen 200. Vorschlag 1'200, Hinweis «(CHF 1’000.00)». Akonto nicht als Rechnungen erfasst: 1'200 = tatsächliche Aufwendung, richtig. Akonto als 4 × 250 erfasst: 2'200, also 1'000 doppelt – genau das sagt der Hinweis. Stimmt mit dem Entscheid überein.
- Leistungszeitraum mit Ende vor Beginn oder nur einem Datum → beide null (`whole`, Test `:76-83`); Regel 1 (`nebenkostenabrechnung-anforderungen.md`) zählt die Rechnung dann nach Rechnungsdatum (bekannt, #134).
- Gutschrift: siehe V-9.

## Befunde

### V-9 (Verwalter, Major) – Gutschrift wird zum Erstellen vorgeschlagen

- Beleg: `src/lib/invoice-upload.ts:137-138` `selected: !several && !proposal.duplicateOf` – eine Gutschrift (`documentType === 'credit_note'`) bleibt ausgewählt; nur der Hinweis `invoices_upload_credit_note` «Das ist eine Gutschrift. Ziehen Sie sie vom Betrag der Rechnung ab, zu der sie gehört.» erscheint (`:104`). Prompt: «totalAmount: Total der Leistungen in CHF …» ohne Regel für Gutschriften; Schweizer Gutschriften drucken den Betrag meist positiv («Gutschrift CHF 80.00»), `francs` übernimmt ihn dann. Kein Test für `credit_note` (weder `llm-extraction.test.ts` noch `invoice-upload.test.ts:54`, obwohl dessen Name «nennt Mahnung, Gutschrift …» sagt), kein Szenario.
- Warum falsch: Eine Gutschrift senkt die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR); als Rechnung mit +80 erhöht sie sie. Mit «{n} Rechnungen erstellen» geschieht das im Stapel mit einem Klick. Nachrechnung: Allgemeinstrom 2025 1'200, Rückvergütung 80, zwei Wohnungen zu gleichen Teilen, Wohnung 1 mit Mieterwechsel am 1.7.2025 (A 181, B 184 von 365 Tagen, zeitanteilig vereinfacht):
  - richtig 1'120 → Wohnung 1: 560; A 560 × 181/365 = 277.70, B 560 × 184/365 = 282.30.
  - mit +80 erstellt: 1'280 → 640; A 317.37, B 322.63. A zahlt 39.67, B 40.33 zu viel (Summe 80 über beide Wohnungen = 2 × 40, stimmt).
  - Randfall: KI liefert −80 → Betrag leer, Zeile kann nicht erstellt werden (Pflichtfeld) – richtig.
- Behebung: Gutschriften wie Duplikate nicht vorauswählen (`selected: … && proposal.documentType !== 'credit_note'`), Hinweis bleibt; Unit-Test für `credit_note` (Auswahl und Hinweis) und ein Parser-Test. Das ergänzt den Entscheid «A Gutschrift gets a hint», ändert ihn nicht; sieht der Product Owner das anders: Issue (`fachlich`, `entscheiden`) «Gutschrift im Upload-Dialog nicht vorauswählen».

### V-10 (Verwalter, Minor) – Mahnung ist zum Erstellen ausgewählt

- Beleg: wie V-9, `documentType === 'reminder'` bleibt ausgewählt; Hinweis «… erfassen Sie die ursprüngliche Rechnung.». Duplikatprüfung greift nur bei gleicher Rechnungsnummer (`invoice.service.ts` `extractFromFile`); Mahnungen tragen oft eine eigene Mahnnummer. `invoiceDate` ist auf einer Mahnung meist das Mahndatum.
- Warum: Ist die Originalrechnung schon erfasst, wird der Betrag doppelt umgelegt (Art. 257b Abs. 1 OR); ist sie es nicht, fällt sie mit dem Mahndatum ggf. in eine spätere Periode (Regel 1).
- Behebung: Mahnungen ebenfalls nicht vorauswählen (Hinweis bleibt). Gleiches Issue wie V-9.

### V-11 (Verwalter, Minor) – nur die ersten 3 Seiten werden gelesen

- Beleg: `src/lib/file-pages.ts:6` `MAX_PAGES = 3`, `:23`; Backend `pages … maxItems: 3` (`backend/src/routes/invoices.ts:158`). Kein Text sagt es.
- Warum: Schlussrechnungen von Werken, Heizungs- und Hauswartrechnungen haben oft mehr Seiten; «Total», «abzüglich Akonto» und Reparaturpositionen stehen häufig auf der letzten Seite. Die KI schlägt dann einen Zwischenbetrag vor, ohne `deductedAmount` und ohne `nonAllocableItems` – also genau ohne die Hinweise aus V-1/V-2 –, und markiert ihn womöglich nicht als unsicher.
- Behebung: Bei mehr als 3 Seiten einen Hinweis in der Zeile, Vorschlag: «Die KI hat nur die ersten 3 Seiten gelesen. Prüfen Sie Betrag und Positionen auf den übrigen Seiten.» (und Betrag als unsicher markieren); oder erste 2 und letzte Seite senden. Neuer Text → alle vier Sprachen.

### V-12 (Verwalter, Minor) – fehlende Konfidenz zählt als sicher

- Beleg: `llm.ts` `parseExtractionResponse`: `return value !== null && typeof sure === 'number' && sure < 0.7;` – fehlt `confidence` oder ein Feld darin, ist die Angabe nicht «unsicher». #217 Done means: «Fields the KI did not read, or read with low confidence, are visibly marked».
- Warum: Kleine lokale Modelle (`qwen2.5vl:7b`) lassen verschachtelte Objekte gern weg; dann sieht jede Zeile geprüft aus. Der Verwalter muss sich über die Richtigkeit vergewissern (Art. 6 Abs. 5 DSG, sinngemäss für die Abrechnung Art. 257b Abs. 1 OR).
- Behebung: Fehlt die Konfidenz eines gelesenen Feldes, gilt es als unsicher; Unit-Test mit Antwort ohne `confidence`.

### V-13 (Verwalter, Nit) – Hinweis «gemischte Kosten» bei reiner Reparatur

- Beleg: Prompt «nonAllocableItems: true, wenn die Rechnung auch Reparaturen …»; Text «… Erfassen Sie diese als eigene Rechnung.»
- Warum: Ist die ganze Rechnung eine Reparatur, gibt es keinen umlagefähigen Rest; «als eigene Rechnung» verwirrt. Die Kategorie (nicht umlagefähig) regelt diesen Fall bereits.
- Behebung: Prompt «true, wenn die Rechnung neben Betrieb oder Wartung auch Reparaturen … enthält»; oder Text «Erfassen Sie umlagefähige und nicht umlagefähige Kosten als je eigene Rechnung.» (betrifft entschiedenen Wortlaut → Product Owner).

### V-14 (Verwalter, Nit) – «KI nicht verfügbar» bei unlesbarer Antwort

- Beleg: `invoices.ts:148-151` antwortet `EXTRACTION_UNAVAILABLE` auch, wenn `parseExtractionResponse` null liefert (KI läuft, antwortet ohne JSON); Text «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.»
- Warum: Der Verwalter versucht es bei einer laufenden KI nicht erneut, obwohl ein zweiter Versuch oft gelingt. Text ist vom Product Owner entschieden; nur Hinweis.
- Behebung: eigener Code für «KI hat die Datei nicht lesen können» mit «Erneut versuchen», oder belassen.

### M-5 (Mietrecht, Minor) – Löschdialog widerspricht sich, M-3-Text fehlt dort

- Beleg: `src/routes/invoices/[id]/+page.svelte:145-152`: bei Beleg «Der Beleg wird ebenfalls gelöscht.», bei abgerechneter Rechnung zusätzlich `invoices_delete_billed_text` «… Bewahren Sie den Beleg auf: Der Mieter kann Einsicht verlangen.» (Text vor #217, damals meinte «Beleg» die Papierrechnung). Glossar neu: Beleg = hochgeladene Datei (`UBIQUITOUS_LANGUAGE.md:64`). #217 M-3: «replacing the Beleg or deleting an invoice that is in a statement warns «Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.»» – der Löschdialog zeigt diesen Text nicht. en sagt im selben Dialog «supporting document» und «Keep the receipt».
- Warum: Im selben Dialog löscht Dwello den Beleg und verlangt, ihn aufzubewahren. Nach dem Löschen kann der Vermieter die Einsicht (Art. 257b Abs. 2 OR) aus Dwello nicht mehr gewähren; was er aufbewahren soll (Datei herunterladen? Papier?), bleibt offen.
- Behebung: Bei Beleg und abgerechneter Rechnung im Löschdialog den entschiedenen Text `invoices_beleg_billed` zeigen und den letzten Satz von `invoices_delete_billed_text` in diesem Fall ersetzen, Vorschlag: «Laden Sie den Beleg vorher herunter und bewahren Sie ihn mit der Originalrechnung auf.» (in vier Sprachen, en «supporting document»). Szenario «Rechnung mit Beleg löschen» für eine abgerechnete Rechnung ergänzen.

### R-6 (Rechtstexte, Minor) – OpenRouter leitet an weitere Anbieter weiter

- Beleg: README «**OpenRouter (optional):** … `LLM_PROVIDER=OpenRouter`, `LLM_PROVIDER_COUNTRY=USA`. Check the checklist above first: OpenRouter is based in the USA.» `privacy_llm_external` nennt nur `{provider} ({country})`. OpenRouter ist ein Router: laut eigener Dokumentation (openrouter.ai/docs/guides/privacy/provider-logging, Suchtreffer via `mmx`) «Each AI provider on OpenRouter has its own data handling policies for logging and retention»; das Modell läuft bei einem Drittanbieter, den OpenRouter wählt (Steuerung über `provider.data_collection: "deny"`, `zdr: true`, Anbieterliste).
- Warum: Empfänger und Staat sind dann OpenRouter (USA) **und** der Modellanbieter (Staat je nach Anbieter). Art. 19 Abs. 2 lit. c und Abs. 4 DSG verlangen Empfänger(kategorien) und Staat; Art. 9 Abs. 3 DSG verlangt die vorgängige Genehmigung der Weiterübertragung. Das README-Beispiel führt zu einer Datenschutzerklärung, die nur einen Empfänger nennt.
- Behebung (README, Englisch): «OpenRouter forwards each request to a model provider it chooses. Restrict routing in the OpenRouter account (zero data retention, no data collection, an allow-list of providers) and name all recipients and their countries, e.g. `LLM_PROVIDER="OpenRouter und <Anbieter>"`, `LLM_PROVIDER_COUNTRY="USA, <Staat>"`.» Der DPF-Status von OpenRouter ist nicht bestätigt (siehe «Nicht bestätigt»); die Checkliste verlangt ihn bereits.

### R-7 (Rechtstexte, Nit) – Kategorien der Daten in Belegen

- Beleg: `privacy_stored_1` (alle vier Sprachen): «Die Belege (hochgeladene Dateien der Rechnungen) dienen der Belegeinsicht der Mieter und bleiben gespeichert, bis …». Art. 19 Abs. 3 DSG (Kategorien, wenn nicht bei der Person beschafft).
- Warum: Bei lokaler KI ist das die einzige Stelle; dass Belege Namen, Adressen und Bankverbindungen der Rechnungssteller und manchmal Mieter enthalten, steht nur im externen Text. Ausserdem «dienen der Belegeinsicht» vs. Glossar «Erleichtert die Belegeinsicht».
- Behebung: «Die Belege (hochgeladene Dateien der Rechnungen, mit allem, was darauf steht, etwa Namen, Adressen und Bankverbindungen) erleichtern die Belegeinsicht der Mieter und bleiben gespeichert, bis …».

### R-8 (Rechtstexte, Nit) – «PDF-Seiten» statt «höchstens 3 Seiten»

- Beleg: `privacy_llm_external` «(PDF-Seiten als Bilder)»; `file-pages.ts:6` `MAX_PAGES = 3`.
- Warum: Nicht falsch (weniger als gesagt), aber ungenau; zusammen mit V-11 lohnt «(höchstens die ersten drei Seiten als Bilder)».

### T-1 (Begriffe, Nit)

- `docs/design/i18n-begriffe.md` hat keine Zeilen für Gutschrift (fr «note de crédit», it «nota di credito», en «credit note»), Mahngebühren (frais de rappel / spese di sollecito / reminder fees), Verzugszinsen (intérêts moratoires / interessi di mora / default interest); die Übersetzungen in `invoices_upload_reminder` und `_credit_note` sind sachlich richtig. «Gutschrift» fehlt auch im Glossar (siehe «Fehlende Begriffe»).
- en: `invoices_delete_billed_text` «Keep the receipt» neben `invoices_delete_beleg` «The supporting document …» im selben Dialog (siehe M-5); fr «justificatif» vs. «pièce justificative» ebenso.

## Fehlende Begriffe (Vorschläge; Issue `fachlich`, `entscheiden`, oder in #222 aufnehmen)

1. **Gutschrift**: «Dokument eines Rechnungsstellers, das einen Betrag zurückerstattet oder eine Rechnung mindert. Senkt die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR); Dwello erfasst sie nicht als eigene Rechnung, sondern zieht sie vom Betrag der zugehörigen Rechnung ab.»
2. **Mahnung (eines Rechnungsstellers)**: Das Glossar kennt «Mahnung» nur an den Mieter. Vorschlag zur Abgrenzung: «Mahnung eines Rechnungsstellers: Zahlungserinnerung zu einer Rechnung; Mahngebühren und Verzugszinsen sind keine Nebenkosten.» (#222 nennt Rechnung/Beleg, Konfidenz, Auslesen bereits.)

## Bestätigt

- Prompt: Rollen- und Absenderbeschreibung, «erfinde nichts», Datumsformat, Schweizer Zahlformat, Fälligkeit, Leistungszeitraum nur mit Beginn und Ende, Total ohne Mahngebühren/Verzugszinsen, vor Abzug (Entscheid V-1), Positionen in der Beschreibung (V-2). Fremdwährung → null («steht kein CHF-Betrag … null»).
- Parser: Daten werden auf Existenz geprüft (`isRealDate`), halber oder umgekehrter Leistungszeitraum verworfen, unbekannter `documentType` → «invoice», `invoiceCount` robust; Leistungszeitende übernimmt die Konfidenz des Beginns.
- Kategorie im Dialog: nur bei ≥ 0.7 übernommen, sonst Pflichtfeld (M-1); `isValidUtilityCost` folgt der Kategorie.
- Duplikate und Mehrfachrechnungen nicht vorausgewählt (Entscheid), Link auf die erfasste Rechnung.
- Abbrechen fragt mit dem entschiedenen Text; nichts wird vor «Erstellen» gespeichert; die Datei selbst geht erst beim Erstellen an den Server (`file-pages.ts:2`), an die KI nur Seitenbilder.
- `privacy_llm_local` stimmt: Seitenbilder gehen nur an den eigenen Server; bei `LLM_ENABLED=false` ruft `extractInvoice` keine KI (`llm.service.ts:235`).
- `privacy_stored_1` Dauer: «bis Sie den Beleg ersetzen oder die Rechnung löschen» entspricht Ersetzen (überschreibt) und `invoices_delete_beleg` (Kaskade).
- Glossar «Beleg» (Product-Owner-Wortlaut) und i18n-Zeile (pièce justificative / giustificativo / supporting document) werden in allen Texten einheitlich verwendet; «Beleg hinzufügen» (Runde 1, fehlender Begriff 3) umgesetzt.
- Szenarien: «Datei» vor dem Erstellen, «Beleg» danach (M-4); Aufbewahrungshinweis (M-2); Warnung abgerechnet beim Beleg (M-3); Akonto- und Mischkosten-Hinweise wörtlich wie in #217; Fehlertext Erstellen (V-4).
- Cookies (Art. 45c FMG) und Nutzungsbedingungen nicht berührt.

## Nicht bestätigt

- Ob OpenRouter unter dem Swiss-U.S. Data Privacy Framework zertifiziert ist: `mmx search` fand nur die Datenschutzerklärung von OpenRouter (openrouter.ai/privacy) ohne Auszug; Abruf von openrouter.ai war aus dieser Umgebung nicht möglich (DNS/Proxy 403). **unsicher** (R-6).
- Welche Anbieter und Staaten `qwen/qwen2.5-vl-72b-instruct` bei OpenRouter bedienen: Seite nicht abrufbar. **unsicher**.
- Ob Schweizer Gutschriften überwiegend positiv gedruckt sind und `qwen2.5vl:7b` sie positiv ausgibt (V-9): Praxis/Modellverhalten, kein Fedlex-Bezug; kein Testfall vorhanden. **unsicher**, der Befund gilt für beide Vorzeichen-Fälle nur bei positivem Betrag.
- Qualität echter KI-Antworten (Konfidenzangaben, Positionen, Mahnung/Gutschrift-Erkennung): nicht prüfbar; laut #217 `llm:eval`/Unit-Tests mit festen Antworten.
- Ob `billedIn` (`src/lib/server/invoice.ts:98-116`, enthält auch Entwürfe) «abgerechnet» im Sinne von «dem Mieter zugestellt» trifft: vorbestehend, nicht Gegenstand.
- Zeitanteilige Verteilung in V-9 vereinfacht nachgerechnet (Tage/365), nicht mit `calculation.service.ts` nachgespielt; die Richtung (Mehrbelastung = Betrag der Gutschrift) hängt davon nicht ab.
