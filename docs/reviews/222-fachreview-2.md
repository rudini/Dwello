# Fachreview #222, Runde 2: Hinweis auf abgezogene Akontorechnungen (nur ein Weg)

Gegenstand: Worktree `review-222-fach2`, Commit `8be686cc`: `@wip`-Szenario «Schlussrechnung mit abgezogenen Akontorechnungen» (`tests/e2e/features/invoices.feature:106-109`), der neu entschiedene Text `invoices_upload_deducted` in de/fr/it/en (Issue #222, «Decided (product owner)», Stand 2026-10-16), die geplanten Zeilen «Akontorechnung (eines Rechnungsstellers)», «Auslesen» und «Mahnung eines Rechnungsstellers» für `docs/design/i18n-begriffe.md` (im Commit noch nicht enthalten; geprüft gegen den Plan und den Vorschlag aus Runde 1, V-4) sowie der Hinweis auf der Rechnungsseite `invoices_beleg_deducted` (`messages/*.json:856`, Szenario `invoices.feature:163-168`). Triage Runde 1: `implementation_plan.md:11`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter / Mietrecht | Major | «löschen Sie sie» gilt auch für Akontorechnungen, die schon in einer versendeten Abrechnung einer früheren Abrechnungsperiode stehen; dann zählen sie doppelt (Mieter zahlt zu viel), oder der Löschdialog widerspricht dem Hinweis. |
| V-2 | Verwalter | Minor | «schon erfasst» deckt Akontorechnungen nicht ab, die im selben Hochladen als Dateien dabei sind; sie werden mit der Schlussrechnung erstellt und zählen doppelt. |
| V-3 | Verwalter | Minor | `invoices_beleg_deducted` («Ist der Betrag das Total vor dem Abzug, …») lässt den Betrag nach dem Abzug weiter als Weg offen und sagt nicht, was dann gilt; passt nicht mehr ganz zur Ein-Weg-Regel. |
| V-4 | Verwalter | Nit | Plan veraltet: Item `implementation_plan.md:12` sagt noch «both ways»; Zeile 11 nennt die Zeilen in `i18n-begriffe.md` «added», im Commit fehlen sie. |
| V-5 | Verwalter | Nit | Geplante `i18n-begriffe.md`-Zeilen (Vorschlag Runde 1): deutsche Spalte soll das Glossarwort sein («Auslesen»), und die Klammer bei «Mahnung eines Rechnungsstellers» soll die bestehende Übersetzung von «Rechnungssteller» wiederverwenden. |
| V-6 | Verwalter | Nit | Schon vorher: Eine einzeln hochgeladene Akontorechnung bekommt keinen Hinweis (die KI kennt keinen Dokumenttyp dafür), obwohl das Glossar sie nicht zusätzlich erfassen lässt. Nicht Teil der Änderung, offene Arbeit. |

## Befunde

### V-1 (Major): Löschen von Akontorechnungen, die schon abgerechnet sind

- Belege:
  - Entschiedener Text (Issue #222; `invoices.feature:109`): «Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie, sonst zählen sie doppelt.» Ohne Einschränkung.
  - Glossar `UBIQUITOUS_LANGUAGE.md:71`: «In Dwello wird die Schlussrechnung mit dem Total der Leistungen erfasst, die Akontorechnungen nicht zusätzlich.» Was mit schon abgerechneten Akontorechnungen geschieht, sagt der Eintrag nicht; beim Gegenstück Gutschrift (`:70`) schon: «Ist diese Rechnung schon abgerechnet, braucht es eine berichtigte Abrechnung.»
  - Löschdialog einer abgerechneten Rechnung, `messages/de.json:783` `invoices_delete_billed_text`: «Löschen Sie nur falsch erfasste Rechnungen. … Versendete oder bezahlte Abrechnungen berichtigen Sie ausserhalb von Dwello gegenüber dem Mieter und zahlen zu viel Bezahltes zurück.» `invoices_delete_text` (`:782`): Die Rechnung «fliesst dann in keine neue Nebenkostenabrechnung mehr ein»; die versendete bleibt.
  - Art. 257b Abs. 1 OR (Fedlex, Fassung `20270701`, Datei über den SPARQL-Endpunkt): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Nachgerechnet: Abrechnungsperiode Kalenderjahr. Die Werke rechnen 1.10.2024–30.9.2025 ab. Vier Akontorechnungen à 250.00 (15.11.2024, 15.2., 15.5., 15.8.2025) sind erfasst; die Abrechnung 2024 mit der Akontorechnung vom November (250.00) ist versendet. Schlussrechnung 15.10.2025: T = 1’250.00, abgezogen A = 1’000.00. Dieser Fall ist häufig: Die Abrechnungsjahre der Werke (Ablesung im Herbst) fallen selten auf die Abrechnungsperiode.
  1. Hinweis befolgt, Schlussrechnung ohne Leistungszeitraum (zählt ganz in 2025, `invoice.service.ts:504-517`): alle vier gelöscht → 2024 (versendet) 250.00 + 2025 1’250.00 = **1’500.00** statt 1’250.00, also 250.00 (20 %) zu viel bei den Mietern. Bricht der Liegenschaftsverwalter beim abgerechneten Stück ab, weil der Dialog sagt «Löschen Sie nur falsch erfasste Rechnungen», und löscht nur die drei übrigen: ebenfalls 250.00 + 1’250.00 = 1’500.00.
  2. Gleich, aber mit Leistungszeitraum 1.10.2024–30.9.2025: 2025 = 1’250.00 × 273/365 = 934.93; mit den 250.00 aus 2024 = 1’184.93. Kein Zuviel für den Mieter, aber der Ausgang hängt an einem Feld, das der Hinweis nicht nennt.
  3. Gegenprobe ohne abgerechnete Akontorechnungen (alle in 2025): alle gelöscht, 2025 = 1’250.00. Korrekt. Randfall Guthaben (T = 800.00, A = 1’000.00): 800.00, positiv, korrekt; Randfall T = A: T > 0, wird angenommen. Die Ein-Weg-Regel löst also V-1 bis V-3 aus Runde 1, nur nicht diesen Fall.
- Warum falsch: Der Hinweis führt bei einer häufigen Konstellation zu Nebenkosten über den tatsächlichen Aufwendungen, oder er schickt den Liegenschaftsverwalter in einen Dialog, der das Gegenteil sagt («nur falsch erfasste»), und verlangt dort eine Berichtigung ausserhalb von Dwello mit Rückzahlung. Ein unerfahrener Vermieter erfährt das erst beim Löschen, nicht beim Hinweis.
- Korrektur (Entscheid des Produktverantwortlichen, weil Hinweis und Glossar entschieden sind; sonst `entscheiden`-Issue). Zwei Varianten:
  - **A (empfohlen, Praxis):** abgerechnete Akontorechnungen stehen lassen und ihren Betrag vom Total abziehen. Nachgerechnet: 1’250.00 − 250.00 = 1’000.00; 2024 250.00 + 2025 1’000.00 = 1’250.00 ✓. Guthaben: 800.00 − 250.00 = 550.00 > 0; 250.00 + 550.00 = 800.00 ✓. Den Leistungszeitraum der Schlussrechnung dann ab dem Tag nach der abgerechneten Periode setzen (sonst wie Fall 2 zu wenig). Satz anhängen:
    - de: «Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab.»
    - fr: «Si l’une d’elles est déjà décomptée, ne la supprimez pas : déduisez son montant du total.»
    - it: «Se una di esse è già stata conteggiata, non la elimini: deduca il suo importo dal totale.»
    - en: «If one of them is already in a statement, do not delete it: deduct its amount from the total.»
    - Glossar `:71` zweiter Satz ergänzen: «Ist eine Akontorechnung schon abgerechnet, bleibt sie erfasst, und die Schlussrechnung wird um ihren Betrag gemindert.»
  - **B (wie Gutschrift):** Hinweis um «Ist eine davon schon abgerechnet, braucht es eine berichtigte Abrechnung.» ergänzen (fr «Si l’une d’elles est déjà décomptée, il faut un décompte rectifié.», it «Se una di esse è già stata conteggiata, occorre un conteggio rettificato.», en «If one of them is already in a statement, a corrected statement is needed.»). Stimmt mit dem Löschdialog überein, verlangt aber eine Rückzahlung über 250.00 und einen neuen Versand.
  - Jede Variante ändert den entschiedenen Text und braucht das Szenario `invoices.feature:109` angepasst.

### V-2 (Minor): Akontorechnungen im selben Hochladen

- Belege: Hinweis «Haben Sie die Akontorechnungen schon erfasst, …». Der Dialog erstellt alle Dateien einer Auswahl (bis 20, `messages/de.json:788`), eine Datei lässt sich entfernen (`invoices_upload_removed`, `:810`). Die KI kennt nur `invoice`, `reminder`, `credit_note` (`backend/src/config/llm.ts:267`); eine mit hochgeladene Akontorechnung erscheint als gewöhnliche Rechnung ohne Hinweis.
- Nachgerechnet: Schlussrechnung (T = 1’250.00) und vier Akontorechnungen à 250.00 in einer Auswahl, alle erstellt → 2’250.00 statt 1’250.00.
- Warum: Wer seine Werke-Rechnungen gesammelt hochlädt, ist der typische Fall; «schon erfasst» liest er als «früher erfasst» und lässt die Dateien in der Liste.
- Korrektur (Entscheid, Text ist entschieden): de «Haben Sie die Akontorechnungen schon erfasst oder hier ausgewählt, löschen oder entfernen Sie sie, sonst zählen sie doppelt.»; fr «Si vous avez déjà saisi ou sélectionné ici les factures d’acompte, supprimez-les ou retirez-les, sinon elles comptent deux fois.»; it «Se ha già registrato o selezionato qui le fatture d’acconto, le elimini o le rimuova, altrimenti contano due volte.»; en «If you have already entered the advance invoices or selected them here, delete or remove them, otherwise they count twice.» Mit eigenem Szenario nur, wenn der Text geändert wird.

### V-3 (Minor): `invoices_beleg_deducted` nach der Ein-Weg-Regel

- Belege: `messages/de.json:856`: «Auf dem Beleg sind bereits bezahlte Beträge abgezogen ({amount}). Prüfen Sie, dass sie nur einmal zählen: Ist der Betrag das Total vor dem Abzug, dürfen die Akontorechnungen nicht zusätzlich erfasst sein.» (fr/it/en gleich, `:856`; Szenario `invoices.feature:168`). Glossar `:71` kennt nur einen Weg: Schlussrechnung mit Total, Akontorechnungen nicht zusätzlich.
- Warum: Der Bedingungssatz widerspricht dem Glossar nicht wörtlich, setzt aber voraus, dass der Betrag auch etwas anderes sein darf, also den zweiten Weg, den der Produktverantwortliche gestrichen hat. Hat der Liegenschaftsverwalter den Betrag nach dem Abzug erfasst (z.B. 250.00), sagt der Hinweis nichts; die Rechnung zählt 1’000.00 zu wenig, oder, falls er die Akontorechnungen erfasst hat, richtig, aber gegen die Glossarregel. Wörter («Akontorechnungen», fr «factures d’acompte», it «fatture d’acconto», en «advance invoices») passen zu Glossar und neuem Hinweis.
- Korrektur (Text aus #233 entschieden, also Entscheid; sonst `fachlich`-Issue): Bedingung durch die Regel ersetzen:
  - de: «Auf dem Beleg sind bereits bezahlte Beträge abgezogen ({amount}). Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst.»
  - fr: «Des montants déjà payés sont déduits sur la pièce justificative ({amount}). Vérifiez qu’ils ne comptent qu’une fois : le montant est le total avant la déduction, et les factures d’acompte ne sont pas saisies en plus.»
  - it: «Sul giustificativo sono dedotti importi già pagati ({amount}). Verifichi che contino una sola volta: l’importo è il totale prima della deduzione e le fatture d’acconto non sono registrate in aggiunta.»
  - en: «Amounts already paid are deducted on the supporting document ({amount}). Check that they count only once: the amount is the total before the deduction, and the advance invoices are not entered as well.»
  - Bei V-1 Variante A müsste auch dieser Text die abgerechneten Akontorechnungen nennen. Szenario `:168` folgt.

### V-4 (Nit): Plan

- Belege: `implementation_plan.md:12`: «`invoices_upload_deducted` in de/fr/it/en as decided (both ways, «Akontorechnung»)»; `:11`: «rows … added to `i18n-begriffe.md`», aber `git show --stat HEAD` ändert `i18n-begriffe.md` nicht, und die Datei (`:31-45`) hat keine der drei Zeilen.
- Korrektur: Item 12 auf «one way» ändern; Zeile 11 «planned» statt «added», oder die Zeilen mit dem nächsten Commit eintragen.

### V-5 (Nit): Wortlaut der geplanten Zeilen in `i18n-begriffe.md`

- Belege: Glossar `UBIQUITOUS_LANGUAGE.md:106` heisst «Auslesen», `:72` «Mahnung eines Rechnungsstellers»; `i18n-begriffe.md:33` übersetzt «Rechnungssteller» mit «émetteur de la facture / emittente della fattura / invoice issuer». Mein Vorschlag aus Runde 1 schrieb «Auslesen (eines Belegs durch die KI)» und «rappel (d’un émetteur de facture)».
- Korrektur, mit den Wörtern, die die UI schon verwendet (`help_invoices_4`, `invoices_upload_purpose`, `invoices_upload_reminder`, `messages/{fr,it,en}.json:73,785,818`):
  - `| Auslesen | lire (les indications) | leggere (i dati) | read (the details) |`
  - `| Mahnung eines Rechnungsstellers | rappel | sollecito | payment reminder |` (ohne Klammer; abgegrenzt durch die Zeile «Mahnung» an den Mieter, falls es sie gibt, sonst die Klammer mit «de l’émetteur de la facture / dell’emittente della fattura / from the invoice issuer»)
  - `| Akontorechnung (eines Rechnungsstellers) | facture d’acompte | fattura d’acconto | advance invoice |`: bestätigt (siehe unten).

### V-6 (Nit, schon vorher): Einzelne Akontorechnung ohne Hinweis

- Belege: `llm.ts:267` (`documentType` ohne Akontorechnung), `invoice-upload.ts:163-172` (`notesOn`). Glossar `:71`: Akontorechnungen werden nicht zusätzlich erfasst.
- Warum: Wer im Mai eine Akontorechnung hochlädt, erstellt sie ohne Hinweis; der Konflikt kommt erst mit der Schlussrechnung (V-1). Besteht auf dem Basis-Commit; der neue Text macht ihn nicht schlimmer.
- Korrektur: als `fachlich`-Issue: Dokumenttyp «Akontorechnung» im Prompt (verlangt `llm:eval`) mit Hinweis «Das ist eine Akontorechnung. Erfassen Sie später die Schlussrechnung mit dem Total; diese Akontorechnung zählt dann nicht zusätzlich.» (Wortlaut vom Produktverantwortlichen zu entscheiden).

## Bestätigt

- Szenario `invoices.feature:109` entspricht Wort für Wort dem entschiedenen de-Text in #222; «CHF 1’000.00» passt zu `deductedAmount: 1000` der Attrappe (Runde 1).
- Ein-Weg-Regel und Glossar `:71` stimmen jetzt überein (Runde-1-V-1 erledigt). «Total vor dem Abzug» (Hinweis) und «Total der Leistungen» (Glossar) meinen dasselbe; beide passen zum Prompt `llm.ts:271`.
- Runde-1-V-2 erledigt: Der Betrag ist immer das Total, auch bei Guthaben (T = 800.00 bei A = 1’000.00) und bei T = A; keine Eingabe ≤ 0 nötig (`src/lib/invoice.ts:50`).
- Runde-1-V-3 erledigt, soweit keine Akontorechnung schon abgerechnet ist: Die Kosten folgen allein der Schlussrechnung (Rechnungsdatum oder Leistungszeitraum). Mieterwechsel in der Periode: Der Anteil der Schlussrechnung an der Periode wird wie jede Rechnung verteilt; der Hinweis ändert daran nichts.
- fr/it/en des entschiedenen Textes: korrekt, Anrede vous/Lei (Imperativ «supprimez-les», Lei-Konjunktiv «le elimini»), Verben wie der Löschbutton (fr «Supprimer», it «Eliminare», en «Delete», `messages/*.json:781`), Fachwort wie `invoices_beleg_deducted` und Glossarzeile; Apostroph U+2019 in fr/it (geprüft im Issue-Text); keine Guillemets nötig. Kleiner Unterschied zum bisherigen Text: fr «elles comptent» statt «ils comptent», richtig, weil sich jetzt auf «factures» bezogen.
- Zeile «Akontorechnung (eines Rechnungsstellers) | facture d’acompte | fattura d’acconto | advance invoice»: üblich, grenzt sich vom Mieter-Akonto ab (`i18n-begriffe.md:32` acompte / acconto / advance payment), deckt sich mit Hinweis und `invoices_beleg_deducted` in allen drei Sprachen.
- «Auslesen» und «Mahnung eines Rechnungsstellers» stehen im Glossar (`:106`, `:72`); die UI-Wörter lit/legge/reads und rappel/sollecito/payment reminder sind in allen drei Sprachen einheitlich (`messages/{fr,it,en}.json:73,785,818`).
- Art. 257b OR verbatim von Fedlex (siehe V-1; Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»). Löschen einer Akontorechnung nimmt ihren Beleg mit (`messages/de.json:861`); für die Belegeinsicht genügt die Schlussrechnung, die die Akonti ausweist, bei abgerechneten warnt `:858`. Kein Befund.

## Fehlende Begriffe / Glossar (für ein Issue, Labels `fachlich`, `entscheiden`)

- `UBIQUITOUS_LANGUAGE.md:71` um schon abgerechnete Akontorechnungen ergänzen (V-1, Wortlaut je nach Variante A oder B).
- «Schlussrechnung (eines Rechnungsstellers)» weiterhin nur in der Definition von «Akontorechnung» (Runde 1); der Hinweis verwendet das Wort nicht, für #222 also nicht nötig.

## Nicht bestätigt

- Fedlex-Fassung: Der SPARQL-Endpunkt (`fedlex.data.admin.ch/sparqlendpoint`) lieferte als neueste HTML-Fassung `20270701`; die heute geltende Fassung habe ich nicht separat geladen. Art. 257b OR ist seit 1990 unverändert (nach meinem Wissen, nicht aus der Quelle belegt).
- Ob Dwello «abgerechnet» bei einer Rechnung als versendete/bezahlte Abrechnung oder schon als Entwurf zählt: nur aus den Texten `invoices_delete_billed_text` erschlossen, nicht im Service (`invoice.service.ts:348-359`, `deleteInvoice`) nachgelesen. Für Entwürfe greift V-1 nicht (Entwürfe werden neu erstellt).
- Praxis «abgerechnete Akonti stehen lassen und Schlussrechnung mindern» (V-1 A): Erfahrung aus der Verwalterrolle; `docs/nebenkostenabrechnung-anforderungen.md` regelt nur das Mieter-Akonto (Zeilen 38–43, 79–81), `docs/anforderungen-vertragsende.md` nichts zu Rechnungen von Rechnungsstellern.
- Die drei Zeilen für `i18n-begriffe.md` liegen am Commit `8be686cc` nicht vor; geprüft ist der geplante Wortlaut (Plan `:11-13`, Runde 1 V-4).
