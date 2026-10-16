# Fachreview #233 «Rechnungen hochladen: offene Punkte» – Runde 1 (Szenarien vor der Umsetzung)

Gegenstand: Worktree `review-233-fach`, Commit 16df77fb. `git diff 0d970be0 16df77fb -- tests/e2e/features` (13 `@wip`-Szenarien in `dashboard.feature`, `help.feature`, `invoice-detail.feature`, `invoice-edit.feature`, `invoice-new.feature`, `invoices.feature`, `privacy.feature`), geplante Lösungen in `implementation_plan.md` (Session #233), Stand der betroffenen Texte in `messages/{de,fr,it,en}.json`, `backend/src/config/llm.ts` (EXTRACTION_PROMPT), `src/lib/invoice-upload.ts`, `src/routes/invoices/[id]/{InvoiceBeleg,DeleteConsequences}.svelte`, `src/routes/invoices/[id]/edit/+page.svelte`, `src/lib/server/file-proxy.ts`. Grundlagen: #233 (Body, 2 Kommentare, «Decided (product owner)»), #222 (Decided: Gutschrift, Akontorechnung), #120 (Decided: berichtigte Abrechnung), `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/i18n-begriffe.md`, `docs/reviews/upload-fachreview-2.md` und `-4.md`, `docs/design/personas/weber-rechnungen-hochladen-2.md`, `anna-rechnungen-hochladen-2.md`.

Rechtsgrundlage (Fedlex, wörtlich, heute aus dem Fedlex-Filestore geladen):
- OR (SR 220, Stand am 1. Oktober 2026) Art. 257a Abs. 1: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
- OR Art. 257b Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- OR Art. 62 Abs. 1: «Wer in ungerechtfertigter Weise aus dem Vermögen eines andern bereichert worden ist, hat die Bereicherung zurückzuerstatten.»
- VMWG (SR 221.213.11, Stand am 1. Oktober 2025) Art. 5 Abs. 2: «Darunter fallen insbesondere die Aufwendungen für: … g. die Wartung; …». Art. 6: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.» Art. 8 Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- DSG (SR 235.1, Stand am 7. Juli 2025) Art. 6 Abs. 2: «Die Bearbeitung muss nach Treu und Glauben erfolgen und verhältnismässig sein.» Art. 19 Abs. 2: «Er teilt der betroffenen Person bei der Beschaffung diejenigen Informationen mit, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist; er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.» Art. 21 Abs. 1: «Der Verantwortliche informiert die betroffene Person über eine Entscheidung, die ausschliesslich auf einer automatisierten Bearbeitung beruht und die für sie mit einer Rechtsfolge verbunden ist oder sie erheblich beeinträchtigt (automatisierte Einzelentscheidung).»

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Geplante Prompt-Änderung V-13 nimmt einer reinen Reparaturrechnung mit umlagefähiger KI-Kategorie Hinweis und Sperre der Vorauswahl: Reparatur wird mit einem Klick den Mietern belastet |
| V-2 | Verwalter | Minor | Gutschrift-Hinweis: «Öffnen Sie die Rechnung» passt nicht, wenn die zugehörige Rechnung im selben Dialog liegt; der abgerechnete Fall braucht keinen eigenen Satz |
| M-1 | Mietrecht | Minor | Gutschrift wird nicht gespeichert, der Hinweis sagt nicht, sie für die Belegeinsicht aufzubewahren |
| V-3 | Verwalter | Minor | Akonto-Hinweis auf der Rechnungsseite sagt «Akontozahlungen» statt des in #222 entschiedenen «Akontorechnung» und nennt nur einen der zwei richtigen Wege (Weber P-1) |
| V-4 | Verwalter | Minor | Mischkosten-Hinweis auf der Rechnungsseite ist falsch, wenn die Rechnung als nicht umlagefähig erstellt wurde |
| V-5 | Verwalter | Minor | «Ergänzen Sie, falls auf der Rechnung: …» auch für Pflichtfelder macht sie scheinbar freiwillig; Satz ohne Verb |
| V-6 | Verwalter | Minor | Sammelscan-Text: «Rechnung erfassen» hat kein Dateifeld, «dort als Beleg hinzufügen» führt ins Leere |
| M-2 | Mietrecht | Minor | (bestand vorher, wird sichtbarer) «Rechnung bearbeiten» bei abgerechneter Rechnung sagt nicht, zu viel Bezahltes zurückzuzahlen; der Gutschrift-Weg führt jetzt genau dorthin |
| R-1 | Rechtstexte | Nit | «KI» genügt in der Datenschutzerklärung; Wortlaut für alle drei Texte in vier Sprachen vorgeschlagen; Szenario prüft nur eine der drei Varianten |
| T-1 | Begriffe | Nit | «Gutschrift» und «Akontorechnung» sind in #222 entschieden, aber noch nicht im Glossar: neue Texte brauchen `TODO(fachlich prüfen, #222)` |
| T-2 | Begriffe | Nit | Beleg-Hilfe: «klicken Sie dann auf» statt des sonst üblichen «Wählen Sie …»; ohne Beleg heisst der Knopf «Beleg hinzufügen» |
| T-3 | Begriffe | Nit | «(1 unvollständig)»: Mehrzahl und fr/it-Genus festlegen |
| V-7 | Verwalter | Nit | Auf «Neue Rechnung» mit «Reparaturen» stehen die Hilfe und der Hinweis `invoices_legal_text` mit fast demselben Satz untereinander |
| M-3 | Mietrecht | Nit | M-6-Text «Laden Sie den Beleg vorher herunter»: einen Knopf «herunterladen» gibt es nicht (nur «Beleg anzeigen»); fr/it/en bestätigt |

Keine Blocker. Ein Major (V-1).

## Befunde

### V-1 (Verwalter, Major) – Prompt-Änderung V-13 entfernt das Sicherheitsnetz für reine Reparaturen

- Beleg: Plan «Prompt: `nonAllocableItems` only besides operating costs (V-13)». Heute `backend/src/config/llm.ts:276` «nonAllocableItems: true, wenn die Rechnung auch Reparaturen, Erneuerungen oder Anschaffungen enthält, sonst false». `src/lib/invoice-upload.ts:177-181` `preselected` = … `&& !proposal.nonAllocableItems`; `:131` Hinweis `invoices_upload_mixed` nur bei `nonAllocableItems`. Die Kategorie kommt aus der getrennten Kategorisierung und wird ab Konfidenz 0.7 übernommen (`:186-187`); `isValidUtilityCost` folgt ihr (`:155`).
- Warum falsch: Nach der Änderung liefert eine Rechnung, die **nur** Reparatur ist, `false`. Wählt die Kategorisierung dafür eine umlagefähige Kategorie (Reparatur am Lift durch «Lift Service AG» → «Lift»; Brennerreparatur → «Heizung»), ist die Zeile vorausgewählt, ohne Hinweis, und wird umlagefähig erstellt. Reparaturen sind keine Nebenkosten (Art. 257b Abs. 1 OR: «Betriebskosten»; für die Heizung ausdrücklich Art. 6 lit. a VMWG «die Reparatur und Erneuerung der Anlagen»). Regel 2 (`nebenkostenabrechnung-anforderungen.md:142`) fängt das nur, wenn die Kategorie nicht umlagefähig ist. Heute fängt `nonAllocableItems = true` genau diesen Fall: nicht vorausgewählt, Hinweis sichtbar.
- Nachrechnung (Liftreparatur CHF 2'400, 4 Wohnungen, ohne Verteilschlüssel gleichmässig pro Wohnung, Wohnung 1 mit Mieterwechsel am 1.7., A 181 und B 184 von 365 Tagen):
  - richtig (nicht umlagefähig): je Wohnung 0; A 0, B 0.
  - mit Kategorie «Lift» erstellt: je Wohnung 600; A 600 × 181/365 = 297.53, B 600 × 184/365 = 302.47 (Summe 600, stimmt). Über das Gebäude 2'400 zu viel.
  - Randfall: Kategorisierung wählt «Reparaturen» (nicht umlagefähig) → 0 nach Regel 2, mit beiden Prompt-Fassungen richtig. Der Fehler entsteht nur bei umlagefähiger Kategorie, also genau dort, wo der Hinweis gebraucht wird.
- Behebung (im Sinn von V-13, dessen Begründung lautet «Die Kategorie (nicht umlagefähig) regelt diesen Fall bereits»): Prompt **nicht** ändern. Den Hinweis `invoices_upload_mixed` (im Dialog und auf der Rechnungsseite, siehe V-4) nur zeigen, wenn die übernommene Kategorie umlagefähig ist; bei nicht umlagefähiger Kategorie entfällt er, weil die Kategorie den Fall schon regelt. Die Vorauswahl bleibt bei `nonAllocableItems` gesperrt. Kein neuer Text, kein Prompt-Lauf nötig. Unit-Tests in `invoice-upload.test.ts`: (a) `nonAllocableItems` + Kategorie «Reparaturen» → kein Mischkosten-Hinweis; (b) `nonAllocableItems` + Kategorie «Lift» → Hinweis, nicht ausgewählt.
- Falls der Product Owner trotzdem den Prompt ändern will: zusätzlich ein zweites Feld (`allocableItems`: «true, wenn die Rechnung Betrieb, Wartung oder Verbrauch enthält») und Vorauswahl nur bei `allocableItems && !nonAllocableItems`; das braucht einen neuen Hinweistext für reine Reparaturen, Vorschlag: «Die Rechnung betrifft Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Wählen Sie eine Kategorie, die nicht umlagefähig ist, z.B. Reparaturen.»

### V-2 (Verwalter, Minor) – Gutschrift: wo verringern, und der abgerechnete Fall

- Beleg: Entwurf `invoices.feature` «Das ist eine Gutschrift. Erstellen Sie aus dieser Datei keine Rechnung. Öffnen Sie die Rechnung, zu der sie gehört, und verringern Sie ihren Betrag um die Gutschrift.» Weber P-3 (b): «wie ich vorgehe, wenn die zugehörige Rechnung schon in Dwello steht … oder schon abgerechnet ist».
- Fachlich richtig ist der Weg (zugehörige Rechnung mindern): Nebenkosten sind die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR) der Periode, zu der die Leistung gehört. Nachrechnung (Allgemeinstrom 2025 CHF 1'200, abgerechnet; Gutschrift 80 kommt 2026; 2 Wohnungen gleichmässig; Wohnung 1: A bis 30.6., B ab 1.7.2025 und ganz 2026):
  - Rechnung 2025 auf 1'120 gemindert: Wohnung 1 trägt 40 weniger; A 40 × 181/365 = 19.84, B 40 × 184/365 = 20.16 zurück.
  - Gutschrift stattdessen 2026 gebucht (in Dwello ohnehin nicht möglich, Betrag muss > 0 sein, `src/lib/invoice.ts:50`): B erhielte 40, A nichts. Falsch. Der Entwurf wählt also den richtigen Weg.
- Abgerechneter Fall: **kein eigener Satz nötig, kein Product-Owner-Entscheid.** Wer die Rechnung mindert, tut das in «Rechnung bearbeiten»; dort steht bei einer abgerechneten Rechnung schon `invoices_edit_billed_text` («Ändern Sie diese Rechnung, stimmen diese Abrechnungen nicht mehr. Löschen Sie danach die Entwürfe … Versendete oder bezahlte Abrechnungen berichtigen Sie ausserhalb von Dwello gegenüber dem Mieter.», `src/routes/invoices/[id]/edit/+page.svelte:111-114`). Wie Dwello versendete Abrechnungen künftig berichtigt, ist in #120 entschieden (berichtigte Abrechnung), noch nicht umgesetzt; der Gutschrift-Hinweis soll dem nicht vorgreifen. Rest siehe M-2.
- Was falsch ist: «Öffnen Sie die Rechnung» setzt voraus, dass sie schon erfasst ist. Liegen Schlussrechnung und Gutschrift im selben Upload (typisch bei den Werken), ist die Rechnung noch eine Zeile im Dialog.
- Behebung (zusammen mit M-1), Vorschlag:
  - de: «Das ist eine Gutschrift. Erstellen Sie daraus keine Rechnung. Verringern Sie den Betrag der Rechnung, zu der sie gehört, um die Gutschrift: hier in ihrer Zeile oder, wenn sie schon erfasst ist, mit «Rechnung bearbeiten». Bewahren Sie die Gutschrift mit der Originalrechnung auf.»
  - fr: «Il s’agit d’une note de crédit. N’en créez pas de facture. Réduisez le montant de la facture à laquelle elle se rapporte du montant de la note de crédit : ici dans sa ligne ou, si elle est déjà saisie, avec « Modifier la facture ». Conservez la note de crédit avec la facture originale.»
  - it: «Si tratta di una nota di credito. Non ne crei una fattura. Riduca l’importo della fattura a cui si riferisce dell’importo della nota di credito: qui nella sua riga o, se è già registrata, con «Modificare la fattura». Conservi la nota di credito con la fattura originale.»
  - en: «This is a credit note. Do not create an invoice from it. Reduce the amount of the invoice it belongs to by the credit note: here in its row or, if it is already entered, with “Edit invoice”. Keep the credit note with the original invoice.»
  - Begriffe: Gutschrift / note de crédit / nota di credito / credit note (`i18n-begriffe.md:37`); «Rechnung bearbeiten» = Knopf `invoices_edit_title` in allen vier Sprachen.
- Randfall (Nit, Product Owner): Hebt die Gutschrift die ganze Rechnung auf (Storno), lässt sich der Betrag nicht auf 0 senken (`validateInvoice`: Betrag > 0). Möglicher Zusatz: «Hebt sie die ganze Rechnung auf, löschen Sie die Rechnung.» Nur aufnehmen, wenn der Text nicht zu lang wird.

### M-1 (Mietrecht, Minor) – Gutschrift für die Belegeinsicht aufbewahren

- Beleg: neuer Satz «Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht.» (`invoices.feature`, Szenario «Unsichere und nicht gefundene Angaben …»); die Gutschrift ist nicht vorausgewählt und soll nach V-2 nie erstellt werden. Beleg = höchstens eine Datei pro Rechnung (Glossar «Beleg»).
- Warum: Nach dem Mindern zeigt der Beleg der Rechnung 1'200, die Abrechnung 1'120. Die Gutschrift ist der Beleg für die Differenz; der Mieter darf ihn sehen (Art. 257b Abs. 2 OR; Art. 8 Abs. 2 VMWG «sachdienlichen Originalunterlagen»). Dwello hat sie nicht, also muss der Vermieter sie haben.
- Behebung: letzter Satz im Gutschrift-Hinweis von V-2 («Bewahren Sie die Gutschrift mit der Originalrechnung auf.»).

### V-3 (Verwalter, Minor) – Akonto-Hinweis auf der Rechnungsseite

- Beleg: Szenario «Der Hinweis auf abgezogene Akontozahlungen bleibt bei der Rechnung»: «Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass der Betrag das Total vor dem Abzug ist und die Akontozahlungen nicht zusätzlich als Rechnungen erfasst sind.» #222 «Decided (product owner)»: «The hint `invoices_upload_deducted` says «Akontorechnung» instead of «Akontozahlungen» (all four languages).» Glossar «Akonto»: «Monatlicher Vorschuss des Mieters für Nebenkosten».
- Warum: (a) Ein neuer Text mit dem Wort, das der Product Owner eben ersetzt hat; «Akontozahlungen» liest sich als Akonto der Mieter. (b) Weber P-1: Hat der Verwalter die Akontorechnungen schon im Lauf des Jahres erfasst und hier nur den Rest eingetragen, ist das ebenfalls richtig; der Text erklärt diesen Fall für falsch («Prüfen Sie, dass der Betrag das Total … ist»). Nachrechnung (Total 1'200, Akonto 4 × 250, zu bezahlen 200):
  - Betrag 1'200, keine Akontorechnungen erfasst → 1'200 richtig.
  - Betrag 200, 4 × 250 erfasst → 1'200 richtig.
  - Betrag 1'200, 4 × 250 erfasst → 2'200, 1'000 doppelt (der Fall, vor dem der Hinweis warnen soll).
  - Randfall Betrag 0: nicht möglich (Betrag > 0).
- Behebung, Vorschlag (eine Bedingung statt einer Vorschrift; nennt beide richtigen Fälle):
  - de: «Auf dem Beleg sind bereits bezahlte Beträge abgezogen ({amount}). Prüfen Sie, dass sie nur einmal zählen: Ist der Betrag das Total vor dem Abzug, dürfen die Akontorechnungen nicht zusätzlich erfasst sein.»
  - fr: «Des montants déjà payés sont déduits sur la pièce justificative ({amount}). Vérifiez qu’ils ne comptent qu’une fois : si le montant est le total avant la déduction, les factures d’acompte ne doivent pas être saisies en plus.»
  - it: «Sul giustificativo sono dedotti importi già pagati ({amount}). Verifichi che contino una sola volta: se l’importo è il totale prima della deduzione, le fatture d’acconto non devono essere registrate in aggiunta.»
  - en: «Amounts already paid are deducted on the supporting document ({amount}). Check that they count only once: if the amount is the total before the deduction, the advance invoices must not be entered as well.»
  - Die Übersetzungen von «Akontorechnung» stehen nicht in `i18n-begriffe.md` (siehe T-1 und «Nicht bestätigt»). Der Szenariotitel «… abgezogene Akontozahlungen …» folgt («… abgezogene Akontorechnungen …»).

### V-4 (Verwalter, Minor) – Mischkosten-Hinweis auf der Rechnungsseite bei nicht umlagefähiger Rechnung

- Beleg: Entwurf «Der Beleg enthält auch Kosten, die nicht umlagefähig sind. Prüfen Sie, dass der Betrag nur den umlagefähigen Teil enthält.» Plan: «stored with the Beleg».
- Warum: Hat der Verwalter die Rechnung ganz als «Reparaturen» erstellt (oder «Umlagefähig» abgewählt), enthält der Betrag richtigerweise alles; der Hinweis verlangt dann das Gegenteil. Ausserdem fehlt, wo der Rest hingehört (Weber P-2), und «(z.B. Reparaturen)» aus dem Dialoghinweis.
- Behebung: Hinweis nur zeigen, wenn die Rechnung umlagefähig ist (gleiche Bedingung wie V-1). Vorschlag:
  - de: «Der Beleg enthält auch Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Prüfen Sie, dass der Betrag nur den umlagefähigen Teil enthält und der Rest als eigene Rechnung in einer nicht umlagefähigen Kategorie erfasst ist.»
  - fr: «La pièce justificative contient aussi des frais qui ne sont pas imputables (p. ex. réparations). Vérifiez que le montant ne comprend que la part imputable et que le reste est saisi comme facture séparée dans une catégorie non imputable.»
  - it: «Il giustificativo contiene anche costi non addebitabili (p. es. riparazioni). Verifichi che l’importo comprenda solo la parte addebitabile e che il resto sia registrato come fattura separata in una categoria non addebitabile.»
  - en: «The supporting document also contains costs that are not allocable (e.g. repairs). Check that the amount contains only the allocable part and that the rest is entered as a separate invoice in a non-allocable category.»
  - «umlagefähig» fr/it/en sind in `i18n-begriffe.md:44` mit ❓ (#83); die Vorschläge verwenden dieselben Wörter wie die bestehenden Texte.
- Bestätigt: Hinweise beim Beleg speichern und beim Ersetzen verwerfen ist richtig; sie beschreiben den Inhalt dieser Datei, eine neue Datei liest die KI nicht.

### V-5 (Verwalter, Minor) – «Ergänzen Sie, falls auf der Rechnung»

- Beleg: Szenario «Unsichere und nicht gefundene Angaben werden getrennt genannt»: «Ergänzen Sie, falls auf der Rechnung: Fälligkeitsdatum.» Plan: «for fields not found». `missingIn` (`invoice-upload.ts:170-175`) nennt jedes nicht gefundene Feld, auch Pflichtfelder (`validateInvoice`: Rechnungsdatum, Rechnungssteller, Beschreibung, Betrag).
- Warum: Für Rechnungsnummer, Fälligkeitsdatum und Leistungszeitraum stimmt «falls auf der Rechnung». Fehlt Betrag, Rechnungsdatum oder Beschreibung, wird «falls» falsch: ohne sie lässt sich die Rechnung nicht erstellen. Zudem fehlt im Satz das Verb.
- Behebung: zwei Sätze, Pflichtfelder vor Optionalem (wie der Plan es für die Kategorie vorsieht):
  - Pflichtfeld nicht gefunden: de «Füllen Sie aus: {fields}.» / fr «Remplissez : {fields}.» / it «Compili: {fields}.» / en «Fill in: {fields}.»
  - Optionales Feld nicht gefunden: de «Ergänzen Sie, wenn auf der Rechnung angegeben: {fields}.» / fr «Complétez si indiqué sur la facture : {fields}.» / it «Completi se indicato sulla fattura: {fields}.» / en «Add if shown on the invoice: {fields}.»
  - «Prüfen Sie: {fields}.» für unsichere Felder ist bestätigt (Anna P-5).

### V-6 (Verwalter, Minor) – Sammelscan: «dort als Beleg hinzufügen»

- Beleg: Entwurf «… oder erfassen Sie jede Rechnung mit «Rechnung erfassen» und fügen Sie die Datei dort als Beleg hinzu.» «Neue Rechnung» (`src/routes/invoices/new/`) hat kein Dateifeld; den Beleg fügt man danach auf der Seite der Rechnung mit «Beleg hinzufügen» an (`InvoiceBeleg.svelte`).
- Fachlich in Ordnung: dieselbe Sammeldatei als Beleg mehrerer Rechnungen genügt für die Belegeinsicht (Art. 257b Abs. 2 OR).
- Behebung, Vorschlag:
  - de: «Diese Datei enthält mehrere Rechnungen. Laden Sie jede Rechnung als eigene Datei hoch, oder erfassen Sie jede mit «Rechnung erfassen» und fügen Sie diese Datei danach auf ihrer Seite mit «Beleg hinzufügen» an.»
  - fr: «Ce fichier contient plusieurs factures. Téléversez chaque facture dans un fichier séparé, ou saisissez chacune avec « Saisir une facture » et ajoutez ensuite ce fichier sur sa page avec « Ajouter la pièce justificative ».»
  - it: «Questo file contiene più fatture. Carichi ogni fattura come file separato, oppure registri ciascuna con «Registrare una fattura» e aggiunga poi questo file sulla sua pagina con «Aggiungere il giustificativo».»
  - en: «This file contains several invoices. Upload each invoice as a file of its own, or add each one with “Add invoice” and then attach this file on its page with “Add the supporting document”.»

### M-2 (Mietrecht, Minor, bestand vorher) – Rückzahlung fehlt in `invoices_edit_billed_text`

- Beleg: `messages/de.json:765` «… Versendete oder bezahlte Abrechnungen berichtigen Sie ausserhalb von Dwello gegenüber dem Mieter.» Der Löschtext (`:781`) sagt dazu «… und zahlen zu viel Bezahltes zurück.»
- Warum: Eine Gutschrift senkt immer die Kosten; bezahlte der Mieter die Abrechnung, ist er um seinen Anteil zu viel belastet (Art. 257b Abs. 1 OR) und hat einen Rückerstattungsanspruch (Art. 62 Abs. 1 OR). Der neue Gutschrift-Hinweis führt den Verwalter genau in diese Maske. Bestand auf dem Basis-Commit, wird durch #233 sichtbarer.
- Behebung (offene Arbeit oder in #233, wenn klein): «… berichtigen Sie ausserhalb von Dwello gegenüber dem Mieter; zu viel Bezahltes zahlen Sie zurück.» (fr «… ; remboursez le trop-perçu.», it «…; rimborsi quanto pagato in eccesso.», en «…; refund any overpayment.», wie im Löschtext). Wird mit #120 (berichtigte Abrechnung) ohnehin neu gefasst.

### R-1 (Rechtstexte, Nit) – «KI» in der Datenschutzerklärung

- Prüfung: Art. 19 Abs. 2 DSG verlangt Zweck, Empfänger und (Abs. 4) Staat, nicht die Technik. Diese stehen unverändert in `privacy_llm_external` («von {provider} ({country})», übermittelte Daten, Zweck Kategorisierung und Auslesen). Art. 21 DSG greift nicht: die KI schlägt vor, der Verwalter entscheidet (unsichere Felder markiert, Erstellen nur auf Knopfdruck). «KI» ist das Wort, das der Verwalter im Dialog sieht; gleiche Wörter dienen der «transparenten Datenbearbeitung» (Art. 19 Abs. 2) eher als zwei verschiedene. **Bestätigt: «KI» ist für den Rechtstext genau genug.** Die Funktionsweise steht im Text selbst («kategorisiert», «liest … aus», «prüft … ob umlagefähig»).
- Wortlaut (nur die betroffenen Teile; Rest unverändert):
  - `privacy_llm_external` de: «Rechnungen werden von {provider} ({country}) mit einer KI kategorisiert, und hochgeladene Rechnungsdateien liest sie aus. …» / fr «… à l’aide d’une IA, qui lit aussi les fichiers de factures téléversés. …» / it «… con un’IA, che legge anche i file delle fatture caricati. …» / en «… using an AI, which also reads uploaded invoice files. …»
  - `privacy_llm_local` de: «Rechnungen werden mit einer KI kategorisiert, und hochgeladene Rechnungsdateien liest sie aus; auf Wunsch prüft sie auch neue Kategorien darauf, ob ihre Kosten umlagefähig sind. Die KI läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht.» / fr «Les factures sont catégorisées à l’aide d’une IA, qui lit aussi les fichiers de factures téléversés ; sur demande, elle vérifie aussi si les frais de nouvelles catégories sont imputables. L’IA fonctionne sur le serveur de l’exploitant ; les données ne quittent pas le serveur pour cela.» / it «Le fatture sono categorizzate con un’IA, che legge anche i file delle fatture caricati; su richiesta verifica anche se i costi di nuove categorie sono addebitabili. L’IA funziona sul server del gestore; i dati non lasciano il server a tale scopo.» / en «Invoices are categorised with an AI, which also reads uploaded invoice files; on request it also checks whether the costs of new categories are allocable. The AI runs on the operator’s server; the data does not leave the server for this.»
  - `privacy_llm_off` de: «Rechnungen und Kategorien werden nicht von einer KI bearbeitet.» / fr «… ne sont pas traitées par une IA.» / it «… non sono trattate da un’IA.» / en «… are not processed by an AI.»
  - Achtung Genus: de «es» → «sie» (die KI), fr «il» → «elle» (l’IA).
- Nit: Das Szenario prüft nur die Variante, die der E2E-Stack zeigt. Die zwei anderen Texte (und fr/it/en) brauchen einen Test auf tieferer Stufe, dass «Sprachmodell»/«modèle de langage»/«modello linguistico»/«language model» nirgends mehr steht. Das Glossar sagt weiter «durch ein Sprachmodell (KI)» (Kategorisierung); das ist kein Widerspruch.

### T-1 (Begriffe, Nit) – Marker für #222

- «Gutschrift» und «Akontorechnung» sind in #222 entschieden; der Product Owner trägt sie ins Glossar ein, `UBIQUITOUS_LANGUAGE.md` hat sie noch nicht. `grep -rn "#222" src backend/src tests messages`: keine Treffer. Nach `CLAUDE.md` («missing terms get `TODO(fachlich prüfen, #<issue>)`») brauchen die geänderten Texte (Gutschrift-Hinweis, Akonto-Hinweis auf der Rechnungsseite) einen Marker auf #222, weil #233 #222 nicht schliesst. In `i18n-begriffe.md` fehlt eine Zeile «Akontorechnung (eines Rechnungsstellers)», Vorschlag: facture d’acompte / fattura d’acconto / advance invoice.
- Hinweis: #120 sagt «‹Gutschrift› … not used» für die Berichtigung von Abrechnungen; gemeint ist dort eine Gutschrift des Vermieters an den Mieter. #222 grenzt mit «(eines Rechnungsstellers)» ab. Kein Widerspruch, aber der Glossareintrag sollte die Abgrenzung tragen.

### T-2 (Begriffe, Nit) – Hilfe im Beleg-Bereich

- Beleg: Szenario «Beleg ersetzen»: «Wählen Sie die neue Datei und klicken Sie dann auf «Beleg ersetzen».» Sonst sagt Dwello «Wählen Sie «Erneut versuchen» …»; «klicken» kommt in `de.json` nur einmal vor. Auf dem Telefon wird getippt.
- Vorschlag: mit Beleg «Wählen Sie die neue Datei und dann «Beleg ersetzen».» (fr «Choisissez le nouveau fichier, puis « Remplacer la pièce justificative ».», it «Scelga il nuovo file, poi «Sostituire il giustificativo».», en «Choose the new file, then “Replace the supporting document”.»); ohne Beleg «Wählen Sie die Datei und dann «Beleg hinzufügen».» (fr «… puis « Ajouter la pièce justificative ».», it «… poi «Aggiungere il giustificativo».», en «… then “Add the supporting document”.»).

### T-3 (Begriffe, Nit) – «(1 unvollständig)»

- Entscheid #233: «Count only rows without errors on the button, or say «… erstellen (1 unvollständig)»». Das Szenario macht beides («1 Rechnung erstellen (1 unvollständig)»); das passt zum Entscheid.
- fr/it nach Genus und Zahl: fr «(1 incomplète)» / «(2 incomplètes)», it «(1 incompleta)» / «(2 incomplete)», en «(1 incomplete)». Eigene Einzahl-/Mehrzahl-Texte wie bei `invoices_upload_create_one`.

### V-7 (Verwalter, Nit) – doppelter Satz auf «Neue Rechnung»

- Beleg: Szenario «Nicht umlagefähige Kategorie wählen»: Hilfe «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» und danach der bestehende Hinweis `invoices_legal_text` «Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein. Typische …».
- Der Hilfetext selbst ist bestätigt (Glossar «Umlagefähige Rechnung», verneint). fr «La facture n’entre pas dans le décompte des charges.», it «La fattura non confluisce nel conteggio spese accessorie.», en «The invoice does not go into the utility cost statement.»
- Optional: Im Hinweis den ersten Satz weglassen, wenn die Hilfe ihn schon sagt; sonst so lassen.

### M-3 (Mietrecht, Nit) – M-6-Text: «herunterladen»

- Wortlaut entschieden (#233). fr/it/en aus `upload-fachreview-4.md` jetzt geprüft und **bestätigt**: «pièce justificative»/«giustificativo»/«supporting document» = `i18n-begriffe.md:36`; «Télécharger»/«Scaricare»/«Download» = `documents_download_file`; «consultation par le locataire» / «consultazione da parte dell’inquilino» / «tenant’s inspection» = Wortwahl von `privacy_stored_1` in allen drei Sprachen; formelle Anrede (vous, Le) richtig.
- Hinweis: Auf der Rechnungsseite gibt es keinen Knopf «herunterladen»; «Beleg anzeigen» öffnet die Datei im Browser (`file-proxy.ts`, `inline`), dort lässt sie sich speichern. Kein Handlungsbedarf; nur falls Personas stolpern: «Öffnen Sie den Beleg vorher mit «Beleg anzeigen» und speichern Sie ihn, wenn …» (Product Owner).
- Der Text soll im Löschdialog `invoices_beleg_billed` ersetzen, nicht ergänzen (M-6); das Szenario prüft nur, dass er erscheint.

## Bestätigt

- Gutschrift nicht erstellen, zugehörige Rechnung mindern: richtig (Art. 257b Abs. 1 OR, Nachrechnung in V-2); abgerechneter Fall über `invoices_edit_billed_text` abgedeckt, Berichtigung versendeter Abrechnungen in #120 entschieden.
- «Dwello speichert die Datei jeder erstellten Rechnung als Beleg. Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht.»: stimmt mit dem Code (Datei geht erst beim Erstellen an den Server; `extractInvoice` speichert und protokolliert keine Datei, `llm.service.ts:237-246`). Dass Seitenbilder bei externer KI den Server verlassen, sagt `privacy_llm_external`; kein Widerspruch. fr «Dwello enregistre le fichier de chaque facture créée comme pièce justificative. Dwello n’enregistre pas les fichiers dont vous ne créez pas de facture.», it «Dwello salva il file di ogni fattura creata come giustificativo. I file da cui non crea una fattura, Dwello non li salva.», en «Dwello stores the file of each invoice created as its supporting document. Dwello does not store files you create no invoice from.»
- Abbrechen nach dem Erstellen: «Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.» richtig (Anna P-4). fr «Les factures créées restent enregistrées. Les autres fichiers et vos saisies seront perdus.», it «Le fatture create restano salvate. Gli altri file e i Suoi dati andranno persi.», en «Invoices already created stay saved. The other files and your entries will be lost.» Vor dem ersten Erstellen bleibt der alte Text.
- V-14: «Die KI hat keine lesbare Antwort gegeben. Wählen Sie «Erneut versuchen» oder füllen Sie die Felder aus.» passt zu `invoices_upload_read_failed`. fr «L’IA n’a pas donné de réponse lisible. Choisissez « Réessayer » ou remplissez les champs.», it «L’IA non ha dato una risposta leggibile. Scelga «Riprova» o compili i campi.», en «The AI gave no readable answer. Choose “Try again” or fill in the fields.»
- Hilfe: «Mehrere Rechnungen auf einmal: Wählen Sie unter «Rechnungen» «Rechnungen hochladen». Die KI liest die Dateien aus, und Sie prüfen die Angaben, bevor Dwello die Rechnungen erstellt.» Begriffe richtig, Knopfname stimmt (`invoices_upload_open`). fr «Plusieurs factures à la fois : sous « Factures », choisissez « Téléverser des factures ». L’IA lit les fichiers et vous vérifiez les indications avant que Dwello crée les factures.», it «Più fatture in una volta: sotto «Fatture» scelga «Caricare fatture». L’IA legge i file e Lei verifica i dati prima che Dwello crei le fatture.», en «Several invoices at once: under «Invoices», choose «Upload invoices». The AI reads the files, and you check the details before Dwello creates the invoices.» (en mit «» wie `help_invoices_1`).
- «Rechnungen hochladen» in «Häufige Arbeiten» (Schnellaktion wie die bestehenden, `dashboard.feature:64`).
- «Rechnungsnummer korrigieren»: Glossarbegriff «Rechnungsnummer», Feld optional; fachlich nichts einzuwenden.
- Links erstellter Rechnungen mit Datum («vom 31.03.2026»): Rechnungsdatum ist Glossarbegriff; unterscheidet zwei Rechnungen desselben Rechnungsstellers.
- Kategorie als Pflicht zuerst nennen («Wählen Sie eine Kategorie.»): richtig, die Kategorie bestimmt die Umlagefähigkeit (Glossar «Kategorie»).
- Prompt-Wort «Wartung» wäre umlagefähig (Art. 5 Abs. 2 lit. g VMWG, `i18n-begriffe.md:45`); entfällt mit der Behebung von V-1.
- Kein `llm:eval` nötig: Workflow 1 verlangt ihn nur für `proposeAllocability`; mit V-1 ändert sich kein Prompt.
- Cookies (Art. 45c FMG) und Nutzungsbedingungen nicht berührt.

## Fehlende Begriffe

- «Akontorechnung (eines Rechnungsstellers)» und «Gutschrift (eines Rechnungsstellers)»: entschieden in #222, Glossar-Eintrag durch den Product Owner offen; kein neues Issue nötig. In #222 ergänzen: i18n-Zeile «Akontorechnung» (Vorschlag facture d’acompte / fattura d’acconto / advance invoice) und die Abgrenzung zur Gutschrift-Frage von #120.
- Kein weiterer neuer Begriff in den Szenarien («Sammelscan» kommt nur als Testdateiname vor).

## Nicht bestätigt

- EDÖB-Haltung, das DSG verlange bei KI Transparenz über «Zweck, Funktionsweise und Datenquellen»: nur Sekundärquellen über `mmx search` (datenrecht.ch 2023-11-09, steigerlegal.ch 2026-01-31), nicht auf Fedlex. **unsicher**; R-1 stützt sich auf Art. 19 DSG, nicht darauf.
- Übersetzungen «facture d’acompte», «fattura d’acconto», «advance invoice» für «Akontorechnung»: nicht in `i18n-begriffe.md`, nicht in #222. **unsicher**, Product Owner/#222.
- Ob die Kategorisierung reine Reparaturrechnungen tatsächlich umlagefähigen Kategorien zuordnet (V-1): Modellverhalten, nicht prüfbar; der Befund gilt, sobald es einmal geschieht.
- Ob der Plan beim Speichern der Hinweise (V-3, V-4) den Betrag zum Zeitpunkt des Erstellens oder die Umlagefähigkeit berücksichtigt: Code noch nicht geschrieben.
- Ob M-6 `invoices_beleg_billed` im Löschdialog ersetzt: Plan sagt es nicht ausdrücklich.
- Ob Weber P-1, P-2, P-5 aus Runde 2 anderswo offene Arbeit sind: Liste offener Issues gelesen (`gh api repos/rudini/Dwello/issues`), kein passendes gefunden; nur P-3 und P-4 stehen in #233. Die Volltextsuche (`search/issues`) war aus dieser Sitzung gesperrt (HTTP 403).
- Tests nicht ausgeführt (Prüfung vor der Umsetzung; nur Szenario- und Codetext gelesen).
