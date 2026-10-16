# Fachreview #233 «Rechnungen hochladen: offene Punkte» – Runde 2 (Feature-Review)

Gegenstand: Worktree `review-233-fach2`, Commit a09ae7f6, `git diff 16df77fb a09ae7f6`, soweit Fachregeln, Fachbegriffe und Rechtstexte betroffen sind: `messages/{de,fr,it,en}.json` (alle geänderten Schlüssel), `src/lib/invoice-upload.ts`, `src/routes/invoices/UploadRowNotes.svelte`, `InvoiceUploadDialog.svelte`, `UploadResult.svelte`, `UploadRowFields.svelte`, `InvoiceCategoryFields.svelte`, `src/routes/invoices/[id]/InvoiceBeleg.svelte`, `DeleteConsequences.svelte`, `[id]/edit/+page.svelte`, `backend/migrations/0006_beleg_hints.sql`, `backend/src/services/{invoice,llm}.service.ts`, `backend/src/routes/invoices.ts`, Szenarien in `tests/e2e/features`. Grundlagen: Runde 1 (`docs/reviews/233-fachreview-1.md`), Triage im Plan (Zeile «fach-reviewer round 1»), #222 (offen, «Decided (product owner)», per `gh api` gelesen), `docs/nebenkostenabrechnung-anforderungen.md` Regel 2.

Rechtsgrundlage: die wörtlichen Fedlex-Zitate aus Runde 1 (OR Art. 257a Abs. 1, 257b Abs. 1 und 2, 62 Abs. 1; VMWG Art. 5 Abs. 2 lit. g, 6, 8 Abs. 2; DSG Art. 6 Abs. 2, 19 Abs. 2, 21 Abs. 1; heute aus dem Fedlex-Filestore geladen). In dieser Runde ist keine neue Rechtsfrage dazugekommen.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-8 | Verwalter | Minor | Der Mischkosten-Hinweis im Dialog wird nur einmal beim Lesen bestimmt; er folgt nicht der Kategorie, die der Verwalter danach wählt (fehlt nach dem Wechsel von «Reparaturen» auf «Lift», bleibt nach dem Wechsel auf «Reparaturen» stehen) |
| V-9 | Verwalter | Minor | Dieselbe Datei, zwei Wörter und zwei Regeln: Der Dialog sagt weiter «Akontozahlungen» und schreibt einen einzigen Weg vor, die Rechnungsseite sagt «Akontorechnungen» und nennt beide Wege |
| V-10 | Verwalter | Nit | Statuszeile «2 von 2 Dateien gelesen» zählt eine abgelehnte Datei (nie gelesen) mit; «Fehler – erneut versuchen: 1.» liest sich als Knopf |
| P-1 | Prozess | Nit | Die Triage im Plan sagt «V-7, M-3 see below», darunter steht nichts; beide Befunde haben keinen Status |

Keine Blocker, kein Major.

## Befunde aus Runde 1: Prüfung der Umsetzung

| ID R1 | Umgesetzt wie vorgeschlagen | Beleg |
|-------|----|----|
| V-1 (Major) | Ja. Prompt unverändert (`backend/src/config/llm.ts` nicht im Diff); Hinweis nur bei umlagefähiger Kategorie (`invoice-upload.ts` `notesOn(…, values.isValidUtilityCost)`), Vorauswahl bleibt bei `nonAllocableItems` gesperrt (`preselected`). Test (a) und (b) in `src/__tests__/invoice-upload.test.ts:77-85`. **Geschlossen**; Restlücke beim späteren Kategoriewechsel siehe V-8. |
| V-2, M-1 | Ja, Wortlaut in allen vier Sprachen wie vorgeschlagen (`invoices_upload_credit_note`); Knopfname «Rechnung bearbeiten» = `invoices_edit_title` (de/fr/it/en geprüft). Szenario `invoices.feature` «Eine Gutschrift …». **Geschlossen.** |
| V-3 | Ja für die Rechnungsseite (`invoices_beleg_deducted`, Szenario «Der Hinweis auf abgezogene Akontorechnungen bleibt bei der Rechnung»). Der Dialog blieb beim alten Wort, siehe V-9. |
| V-4 | Ja: `InvoiceBeleg.svelte` zeigt `invoices_beleg_mixed` nur bei `invoice.isValidUtilityCost`; das Backend setzt bei nicht umlagefähiger Kategorie immer `false` (`invoice.service.ts:231`, Regel 2), die Bedingung ist also verlässlich. Hinweise werden beim Ersetzen verworfen (`setBeleg`: `deductedAmount: null, nonAllocableItems: false`). **Geschlossen.** |
| V-5 | Ja: `toDoOf` trennt Pflichtfelder (`REQUIRED` = Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung, deckungsgleich mit `validateInvoice`) «Füllen Sie aus: …» von optionalen «Ergänzen Sie, wenn auf der Rechnung angegeben: …»; Kategorie zuerst. Wortlaut in allen vier Sprachen wie vorgeschlagen. **Geschlossen.** |
| V-6 | Ja, alle vier Sprachen; «Rechnung erfassen» = `dashboard_add_invoice` (Knopf auf `/invoices`, `+page.svelte:45`), «Beleg hinzufügen» = `invoices_beleg_add`, fr/it/en stimmen mit den Knöpfen überein. **Geschlossen.** |
| M-2 | Ja, alle vier Sprachen (`invoices_edit_billed_text`), deckt Art. 62 Abs. 1 OR («… hat die Bereicherung zurückzuerstatten.»). **Geschlossen.** |
| R-1 | Ja: `privacy_llm_external`, `_local`, `_off` in vier Sprachen wie vorgeschlagen, Genus de «sie»/fr «elle» richtig; kein «Sprachmodell»/«modèle de langage»/«modello linguistico»/«language model» mehr in `messages/` (grep leer); Test für alle Varianten `src/__tests__/privacy-page.dom.test.ts:24-27`. **Geschlossen.** |
| T-1 | Ja: Marker `TODO(fachlich prüfen, #222)` in `src/lib/invoice-upload.ts:158` (Gutschrift) und `src/routes/invoices/[id]/InvoiceBeleg.svelte:29` (Akontorechnung); #222 ist offen. **Geschlossen.** |
| T-2 | Ja: `invoices_beleg_how_replace` / `_how_add` in vier Sprachen, je nach vorhandenem Beleg (`InvoiceBeleg.svelte` `help`). **Geschlossen.** |
| T-3 | Ja: eigene Einzahl/Mehrzahl, fr «(1 incomplète)»/«({count} incomplètes)», it «(1 incompleta)»/«({count} incomplete)», en «incomplete». **Geschlossen.** |
| V-7 | Nicht im Plan behandelt (P-1). In der Sache erledigt: Mein Beleg in Runde 1 war falsch. Auf dem Formular steht unter der Hilfe «Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.» der Hinweis `invoices_category_not_allocable_text` («Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung) können nicht auf Mieter umgelegt werden.», `InvoiceCategoryFields.svelte:98-113`), nicht `invoices_legal_text` (der steht nur auf der Detailseite, `[id]/+page.svelte:111`). Kein doppelter Satz. **Zurückgezogen.** |
| M-3 | Nicht im Plan behandelt (P-1). In der Sache: `DeleteConsequences.svelte` ersetzt `invoices_beleg_billed` durch `invoices_delete_beleg_billed` (wie M-6 verlangt). Wortlaut entschieden, kein Handlungsbedarf (wie Runde 1). **Bestätigt.** |

## Neue Befunde

### V-8 (Verwalter, Minor) – Mischkosten-Hinweis folgt nicht der gewählten Kategorie

- Beleg: `src/lib/invoice-upload.ts` `withProposal`: `const notes = notesOn(proposal, row.morePages, values.isValidUtilityCost)` wird einmal beim Lesen berechnet und als `row.notes` gespeichert. `UploadRowNotes.svelte` zeigt `row.notes` unverändert; nur `toDoOf(row)` wird aus den aktuellen Werten abgeleitet (C-1). Ein Kategoriewechsel setzt `isValidUtilityCost` neu (`InvoiceCategoryFields.svelte` `chooseCategory`), die Notiz bleibt aber.
- Warum falsch:
  - Fall A: Die KI wählt «Reparaturen» → kein Hinweis (richtig nach V-1). Der Verwalter merkt, dass die Rechnung vor allem den Lift-Service betrifft, wählt «Lift» und kreuzt die Zeile an. Jetzt wäre der Hinweis nötig, er erscheint nicht. Die Rechnung wird mit dem ganzen Betrag umlagefähig erstellt; die Reparatur ist keine Nebenkostenposition (Art. 257b Abs. 1 OR «Betriebskosten»). Erst auf der Rechnungsseite erscheint `invoices_beleg_mixed` (die Hinweise werden ja gespeichert), aber nur, wenn er sie öffnet.
  - Fall B: Die KI wählt «Lift» → Hinweis «Tragen Sie hier nur den umlagefähigen Betrag ein …». Der Verwalter stellt auf «Reparaturen» um (die ganze Rechnung soll nicht umgelegt werden). Der Hinweis bleibt stehen und verlangt jetzt das Gegenteil: den Betrag kürzen, den Rest als zweite Rechnung «Reparaturen» erfassen. Kein Schaden für den Mieter, aber unnötige Arbeit und ein widersprüchlicher Text, genau das, was V-1/V-4 vermeiden sollten.
- Nachrechnung Fall A (Rechnung «Lift Service und Reparatur» CHF 3'000, davon 2'400 Reparatur; 4 Wohnungen ohne Verteilschlüssel; Wohnung 1 mit Mieterwechsel am 1.7., A 181, B 184 von 365 Tagen):
  - richtig (600 umlagefähig): je Wohnung 150; A 150 × 181/365 = 74.38, B 150 × 184/365 = 75.62 (Summe 150).
  - ohne Hinweis ganz als «Lift» erstellt: je Wohnung 750; A 750 × 181/365 = 371.92, B 750 × 184/365 = 378.08 (Summe 750). Über das Gebäude 2'400 zu viel.
  - Randfall Fall B: ganze 3'000 als «Reparaturen» → 0 für alle Mieter, richtig; nur der Text ist falsch.
- Warum nur Minor: Die Vorauswahl bleibt gesperrt (`preselected`), der Verwalter muss die Zeile selbst ankreuzen; die Rechnungsseite zeigt den Hinweis später.
- Behebung: den Mischkosten-Hinweis wie `toDoOf` aus den aktuellen Werten ableiten: `row.hints.nonAllocableItems && row.values.isValidUtilityCost && m.invoices_upload_mixed()` (die Angabe liegt schon in `row.hints`), an der bisherigen Stelle in der Reihenfolge der Hinweise; aus `notesOn` entfernen. Test zuerst: Zeile mit `nonAllocableItems`, Kategorie «Reparaturen» → kein Hinweis; Kategorie auf «Lift» → Hinweis; zurück auf «Reparaturen» → weg. Kein neuer Text.

### V-9 (Verwalter, Minor) – «Akontozahlungen» im Dialog, «Akontorechnungen» auf der Rechnungsseite

- Beleg: `messages/de.json:817` `invoices_upload_deducted` «… Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.» (fr «les acomptes», it/en entsprechend, unverändert). Neu `invoices_beleg_deducted` «… Ist der Betrag das Total vor dem Abzug, dürfen die Akontorechnungen nicht zusätzlich erfasst sein.» #222 «Decided (product owner)»: «The hint `invoices_upload_deducted` says «Akontorechnung» instead of «Akontozahlungen» (all four languages).»
- Warum: Bis #233 gab es den Hinweis nur im Dialog. Jetzt sieht der Verwalter für dieselbe Datei zwei Wörter für dieselbe Sache und zwei Regeln: der Dialog schreibt das Total vor, die Rechnungsseite lässt auch den Restbetrag gelten (Weber P-1, V-3). «Akontozahlungen» liest sich als Akonto der Mieter (Glossar «Akonto»: «Monatlicher Vorschuss des Mieters für Nebenkosten»). Die Uneinheitlichkeit entsteht durch diese Änderung.
- Nachrechnung (Schlussrechnung Total 1'200, Akontorechnungen 4 × 250, zu bezahlen 200):
  - Dialog befolgt, keine Akontorechnungen erfasst: 1'200, richtig.
  - Akontorechnungen schon erfasst (1'000), Dialogvorschlag 1'200 übernommen: 2'200, 1'000 doppelt. Der Dialog sagt nur «nicht zusätzlich erfassen»; dass man dann 200 eintragen muss, sagt er nicht. Die Rechnungsseite warnt danach («Ist der Betrag das Total …»), der Dialog nicht.
  - mit 200 eingetragen: 1'200, richtig.
  - Randfall Betrag 0 (Akonto deckt alles): nicht erfassbar (Betrag > 0); dann trägt die Summe der Akontorechnungen die Kosten, richtig.
- Behebung (Text ist in #222 entschieden; #233 schliesst #222 nicht, Marker `TODO(fachlich prüfen, #222)` wie T-1). Vorschlag, der beide Wege nennt:
  - de: «Auf der Rechnung sind bereits bezahlte Beträge abgezogen ({amount}). Vorgeschlagen ist das Total vor dem Abzug. Haben Sie die Akontorechnungen schon erfasst, tragen Sie den Betrag nach dem Abzug ein, sonst zählen sie doppelt.»
  - fr: «Des montants déjà payés sont déduits sur la facture ({amount}). Le montant proposé est le total avant la déduction. Si vous avez déjà saisi les factures d’acompte, indiquez le montant après la déduction, sinon elles comptent deux fois.»
  - it: «Sulla fattura sono dedotti importi già pagati ({amount}). L’importo proposto è il totale prima della deduzione. Se ha già registrato le fatture d’acconto, inserisca l’importo dopo la deduzione, altrimenti contano due volte.»
  - en: «Amounts already paid are deducted on the invoice ({amount}). The amount proposed is the total before the deduction. If you have already entered the advance invoices, enter the amount after the deduction, otherwise they count twice.»
  - Szenario `invoices.feature` (Akonto-Hinweis im Dialog, falls vorhanden) und Unit-Test folgen. Wenn das ausserhalb von #233 bleiben soll: in #222 kommentieren, dass die Rechnungsseite das neue Wort schon trägt und der Dialog nachziehen muss (dann bleibt V-9 offene Arbeit unter #222, kein neues Issue).

### V-10 (Verwalter, Nit) – Statuszeile nach dem Lesen

- Beleg: `InvoiceUploadDialog.svelte` `done = rows.filter((row) => row.status !== 'reading').length`; Schlusssatz `${m.invoices_upload_progress(…)}.` + `outcome`. Szenario `invoices.feature` «Dwello sagt, was nach dem Lesen zu tun ist …»: «2 von 2 Dateien gelesen. Bitte prüfen: 1. Nicht möglich: 1.» – die zweite Datei ist `notizen.docx`, die Dwello nach Dateityp ablehnt (`status: 'refused'`), also nie der KI zeigt. Ebenso zählt eine Datei «gelesen», die ohne KI zum Ausfüllen bereitsteht (`withoutKi`).
- Warum: Der Satz behauptet etwas, das für die abgelehnte Datei nicht stimmt; «Nicht möglich: 1.» direkt danach klärt es zum Teil. Als Teil «Fehler – erneut versuchen: 1.» liest sich die Statusbezeichnung einer Zeile wie ein Knopf. Inhaltlich sonst richtig: die Summen stimmen (1 + 1 = 2), «Bitte prüfen» und «Nicht möglich» sind die Bezeichnungen, die der Verwalter an den Zeilen sieht.
- Vorschlag (nur Schlusssatz, Fortschritt während des Lesens bleibt): de «{done} von {count} Dateien bearbeitet.» / fr «{done} fichiers sur {count} traités.» / it «{done} file su {count} elaborati.» / en «{done} of {count} files processed.»; für «failed» im Satz «Fehler: {count}.» / «Erreur : {count}.» / «Errore: {count}.» / «Error: {count}.». Product Owner, kein Muss.

### P-1 (Prozess, Nit) – V-7 und M-3 ohne Status

- Beleg: `implementation_plan.md:45` «… V-7, M-3 see below»; unter Zeile 45 bis Zeilenende 49 steht nichts zu V-7 oder M-3.
- Behebung: in der Plan-Zeile nachtragen: V-7 zurückgezogen (Beleg falsch, siehe oben), M-3 kein Handlungsbedarf, M-6-Ersatz bestätigt.

## Neue Texte (nicht in Runde 1): bestätigt

- «2 von 2 Dateien gelesen. Bitte prüfen: 1. Nicht möglich: 1.»: Zählung richtig, Wort siehe V-10.
- «Noch offen: {Dateien}.» (`invoices_upload_still_open`, `UploadResult.svelte`): nennt die angekreuzten, nicht erstellten Dateien (`stillOpen` aus `chosen`). Fachlich richtig, dass eine nicht angekreuzte Gutschrift oder ein Sammelscan nicht als «offen» erscheint: aus ihnen soll keine Rechnung werden. Der Gutschrift-Hinweis bleibt nach dem Erstellen der zugehörigen Rechnung richtig, weil dann der Weg «mit «Rechnung bearbeiten»» gilt (die Zeile der Rechnung ist weg). fr «Encore à traiter», it «Ancora da completare», en «Still open» passend.
- «Hinweise zu {Datei}» (`invoices_upload_notes_title`): passt; unter dem Titel stehen auch Fehler (Ton «critical»), «Hinweise» trägt das. fr «Remarques sur», it «Indicazioni su», en «Notes on», gleich wie «Hinweise zum Beleg» in allen Sprachen.
- «Datei gross anzeigen» (`invoices_upload_file_open`): «Datei» statt «Beleg» ist richtig, vor dem Erstellen ist die Datei noch kein Beleg (#222 Decided: «The dialog calls files not yet saved «Datei», a saved one «Beleg»»). Die Datei bleibt im Browser (`URL.createObjectURL`), kein neuer Datenfluss, kein Rechtstext betroffen.
- «(1 unvollständig)»: siehe T-3; «0 Rechnungen erstellen (2 unvollständig)» fachlich korrekt (C-6-Ablehnung nachvollziehbar).
- KI antwortet nichts Lesbares: eigener Code `EXTRACTION_UNREADABLE` (502), Text `backend_extraction_unreadable` in vier Sprachen wie in Runde 1 bestätigt; die Zeile wird «Fehler – erneut versuchen» mit Knopf, der Text nennt «Erneut versuchen». `refusal()` setzt immer `params` (`coded-error.ts`), also zeigt `reasonOf` den eigenen Text und nicht «weil Dwello nicht geantwortet hat». Ein erneuter Versuch übermittelt die Datei noch einmal demselben Empfänger; das deckt `privacy_llm_external` («wird jede sofort … übermittelt»), kein neuer Empfänger, keine neue Informationspflicht (Art. 19 Abs. 2 lit. c DSG).
- «Hinweise zum Beleg» auf der Rechnungsseite: Bedingungen richtig (V-4), Betrag mit `formatCurrency`, Szenario zeigt «CHF 1’000.00».
- Migration `0006_beleg_hints.sql`: `deducted_amount DECIMAL(12,2)` (wie Rechnungsbeträge), `non_allocable_items BOOLEAN NOT NULL DEFAULT FALSE`; bestehende Belege ohne Hinweise, richtig (die KI hat sie nicht gelesen). Gespeichert wird der Wert beim Erstellen (`invoiceOf` → `beleg: row.hints`), unabhängig vom später geänderten Betrag: richtig, der Hinweis beschreibt die Datei. Keine Personendaten, `privacy_stored_1` («Rechnungen», «Belege») deckt es.
- Rechnungsnummer in «Rechnung bearbeiten»: optional, Glossarbegriff; fachlich nichts einzuwenden.
- Hilfe «Umlagefähig» folgt dem Kästchen (`invoices_allocable_help` / `invoices_not_allocable_help`); bei nicht umlagefähiger Kategorie ist das Kästchen gesperrt und falsch (Regel 2), die Hilfe sagt dann richtig «fliesst nicht … ein».
- «Laden Sie den Beleg vorher herunter …» ersetzt im Löschdialog den alten Satz (M-6, M-3).
- `invoices_upload_kept`, Abbruch-Text nach dem Erstellen, Hilfe-Satz, Schnellaktion: wie in Runde 1 bestätigt, Wortlaut unverändert übernommen.

## Fehlende Begriffe

Keine neuen. «Gutschrift» und «Akontorechnung» bleiben bei #222 (Glossar-Eintrag durch den Product Owner); die i18n-Zeile «Akontorechnung» (facture d’acompte / fattura d’acconto / advance invoice) fehlt weiter in `docs/design/i18n-begriffe.md`, Vorschlag aus Runde 1 gilt.

## Nicht bestätigt

- Fedlex-Wortlaut heute nicht neu geladen: `mmx search` lieferte nur Sekundärquellen (reklamiere.ch, gerichte-zh.ch, kreuzlingen.ch); die Zitate stammen aus Runde 1 (Fedlex-Filestore, OR Stand 1. Oktober 2026). Neue Rechtsaussagen gibt es in dieser Runde nicht.
- Übersetzungen «facture d’acompte», «fattura d’acconto», «advance invoice» für «Akontorechnung»: weiter **unsicher** (nicht in `i18n-begriffe.md`, nicht in #222); betrifft `invoices_beleg_deducted` und den Vorschlag V-9.
- Ob die Kategorisierung reine Reparaturen tatsächlich umlagefähigen Kategorien zuordnet (Modellverhalten): nicht prüfbar, wie in Runde 1.
- Tests und E2E nicht selbst ausgeführt; Grundlage sind Code, Texte, Szenarien und die im Plan genannten Läufe.
