# Fachreview #222, Runde 3 (Delta): Hinweise auf abgezogene Akontorechnungen

Gegenstand: Worktree `review-222-fach3`, Commit `07478903` (Delta zu `8be686cc`): die zwei `@wip`-Szenarien in `tests/e2e/features/invoices.feature:107-109` und `:163-168`, die entschiedenen Texte `invoices_upload_deducted` und `invoices_beleg_deducted` in de/fr/it/en (Issue #222, «Decided (product owner)», Stand 2026-10-16; in `messages/*.json` noch nicht geändert, geprüft ist der Issue-Text), die offenen Befunde V-1..V-3 aus Runde 2. V-4..V-6 nicht erneut geprüft (triagiert).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter / Mietrecht | erledigt | Variante A im Text: abgerechnete Akontorechnung bleibt, Betrag wird vom Total abgezogen. Nachgerechnet, kein Zuviel für den Mieter. |
| V-2 | Verwalter | erledigt | «oder hier ausgewählt … oder entfernen» deckt die Akontorechnungen im selben Hochladen ab. |
| V-3 | Verwalter | erledigt | `invoices_beleg_deducted` nennt die Regel statt einer Bedingung, mit dem Fall «abgerechnet». |
| V-7 | Verwalter | Minor | Variante A stimmt nur, wenn die Schlussrechnung keinen Leistungszeitraum hat, der in die abgerechnete Periode reicht. Die KI schlägt den Leistungszeitraum aus der Schlussrechnung vor. Dann verliert der Vermieter Kosten (der Mieter zahlt nicht zu viel). |
| V-8 | Verwalter / Mietrecht | Minor | Randfall Guthaben: Sind die schon abgerechneten Akontorechnungen höher als das Total, ergibt «ziehen Sie ihren Betrag vom Total ab» 0 oder weniger. Dwello nimmt das nicht an, und der Hinweis sagt nicht, was dann gilt. |
| V-9 | Verwalter | Nit | fr `invoices_beleg_deducted` im Issue: vor «:» steht U+0020, nicht U+00A0 (die bestehende `messages/fr.json:856` hat U+00A0). |
| V-10 | Verwalter | Nit | en «already in a statement» für «schon abgerechnet», die bestehenden Texte sagen «billed» (`messages/en.json:743`, `:854`). |
| V-11 | Verwalter | Nit | `invoices_beleg_deducted` de: «Der Betrag ist das Total vor dem Abzug» und im nächsten Satz «ihr Betrag ist vom Total abgezogen». Als Ausnahme lesbar, nicht falsch. |

## Delta-Prüfung

### 1. Szenarien gegen die entschiedenen de-Texte

- `invoices.feature:109`: Wort für Wort gleich wie der entschiedene de-Text von `invoices_upload_deducted` in #222 (verglichen mit dem Issue-Text über `gh api`). «CHF 1’000.00» passt zu `deductedAmount: 1000` der Attrappe (`backend/scripts/llm-stub.ts:111`).
- `invoices.feature:168`: Wort für Wort gleich wie der entschiedene de-Text von `invoices_beleg_deducted`. Das Szenario ist jetzt `@wip` (`:163`), richtig, weil der Text noch nicht umgesetzt ist.
- Die Unit- und DOM-Tests (`src/__tests__/invoice-upload.test.ts:47,59`, `invoice-pages.dom.test.ts:879`) haben dieselben Texte, mit U+00A0 im Betrag. Bestätigt.

### 2. fr/it/en

- Anrede: fr vous («supprimez-les ou retirez-les», «ne la supprimez pas, mais déduisez», «Vérifiez»), it Lei («le elimini o le rimuova», «non la elimini, ma deduca», «Verifichi»), en Imperativ. Bestätigt.
- Verben wie auf den Buttons: «Rechnung löschen» / «Datei entfernen» (`messages/de.json:781,836`) entsprechen «Supprimer la facture» / «Retirer le fichier», «Eliminare la fattura» / «Rimuovere il file», «Delete invoice» / «Remove the file» (`messages/{fr,it,en}.json:781,836`). «löschen oder entfernen» ist in allen drei Sprachen gleich zugeordnet. Bestätigt.
- Begriffe: «Akontorechnung» heisst durchgehend facture d’acompte / fattura d’acconto / advance invoice, wie geplant für `i18n-begriffe.md`. «abgerechnet» heisst fr «décomptée» und it «conteggiata», wie `invoices_billed_title` (`messages/fr.json:743` «Facture déjà décomptée», `it.json:743` «Fattura già conteggiata»). In en weicht es ab (V-10).
- Grammatik: fr «Si l’une d’elles est déjà décomptée, ne la supprimez pas, mais déduisez son montant du total.» ist korrekt (Komma statt Doppelpunkt, «ne … pas, mais» gebräuchlich). fr «qu’ils ne comptent qu’une fois» bezieht sich auf «montants», richtig. it «Se una di esse è già stata conteggiata, resta registrata e il suo importo è dedotto dal totale.» korrekt. en «do not delete it; deduct its amount from the total instead.» korrekt.
- Apostroph: im Issue-Text nur U+2019, kein U+0027 (fr 3 bzw. 5, it 2 bzw. 2 Vorkommen, per Skript gezählt).
- U+00A0 vor dem Doppelpunkt: siehe V-9. Der Upload-Text hat in fr keinen Doppelpunkt mehr; keine Guillemets nötig.

### 3. Fachlich (Art. 257b OR, Glossar), nachgerechnet

Art. 257a Abs. 1 OR (Fedlex, Fassung `20270701`, Datei aus dem Fedlex-Filestore): «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
Art. 257b Abs. 1 OR (dieselbe Quelle): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»

Beispiel aus Runde 2: Abrechnungsperiode Kalenderjahr; die Werke rechnen 1.10.2024–30.9.2025 ab; vier Akontorechnungen à 250.00 (15.11.2024, 15.2., 15.5., 15.8.2025); die Abrechnung 2024 mit der Akontorechnung vom November ist versendet; Schlussrechnung 15.10.2025 mit T = 1’250.00, abgezogen A = 1’000.00.

- a) Text befolgt, Schlussrechnung ohne Leistungszeitraum: die drei Akontorechnungen 2025 gelöscht, die abgerechnete bleibt, Betrag 1’250.00 − 250.00 = 1’000.00 → 2024 250.00 + 2025 1’000.00 = **1’250.00** = tatsächliche Aufwendungen. ✓
- b) Ohne abgerechnete Akontorechnung (alle 2025): alle vier gelöscht oder entfernt, 1’250.00 in 2025. ✓
- c) Guthaben, T = 800.00, eine abgerechnet (250.00): 800.00 − 250.00 = 550.00; 250.00 + 550.00 = 800.00. ✓
- d) Gleiches Upload mit Akontorechnungen (V-2): Schlussrechnung 1’250.00 plus vier mitgewählte Akontorechnungen, die entfernt werden → 1’250.00 statt 2’250.00. ✓
- e) Entwurf statt versendet: «abgerechnet» umfasst auch Entwürfe (`invoices_delete_billed_text`, `messages/de.json:783`). Variante A: Akontorechnung bleibt im Entwurf; die Schlussrechnung (1’000.00) fliesst in die Periode ihres Rechnungsdatums. Nach Neuerstellen 250.00 + 1’000.00 = 1’250.00. ✓
- f) Mit Leistungszeitraum 1.10.2024–30.9.2025 (365 Tage, wie die KI ihn vorschlägt): siehe V-7.
- g) Abgerechnete Akontorechnungen über dem Total: siehe V-8.
- Mieterwechsel in der Periode: Die Schlussrechnung wird wie jede Rechnung verteilt; der Hinweis ändert daran nichts (wie Runde 2).

Glossar: `UBIQUITOUS_LANGUAGE.md:71` sagt weiter nur «die Akontorechnungen nicht zusätzlich». Der Satz zur abgerechneten Akontorechnung fehlt dort noch. Der Produktverantwortliche trägt ihn selbst nach (laut Auftrag nicht in diesem Commit). Bis dahin gehen beide Hinweise über das Glossar hinaus, widersprechen ihm aber nicht. Vorschlag aus Runde 2 bleibt: «Ist eine Akontorechnung schon abgerechnet, bleibt sie erfasst, und die Schlussrechnung wird um ihren Betrag gemindert.» Das passt wörtlich zu beiden Texten. Gegenstück Gutschrift (`:70`, «braucht es eine berichtigte Abrechnung») ist eine andere Regel, aber kein Widerspruch: Die Gutschrift mindert eine abgerechnete Rechnung, die Akontorechnung ist selbst abgerechnet.

## Befunde

### V-1, V-2, V-3 (Runde 2): erledigt

- V-1: Upload-Text «Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab.» und Beleg-Text «… bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.» setzen Variante A um. Nachgerechnet in a), c), e). Kein Widerspruch mehr zum Löschdialog («Löschen Sie nur falsch erfasste Rechnungen», `messages/de.json:783`). Rest siehe V-7, V-8.
- V-2: Text wie vorgeschlagen; nachgerechnet in d).
- V-3: Bedingung durch die Regel ersetzt, Fall «abgerechnet» ergänzt (wie in Runde 2 für Variante A verlangt).

### V-7 (Minor): Leistungszeitraum der geminderten Schlussrechnung

- Belege: Die KI liest den Leistungszeitraum aus, wenn die Rechnung Beginn und Ende nennt (`backend/src/config/llm.ts:273`); eine Werke-Schlussrechnung nennt ihn praktisch immer (Ablesung). Dwello teilt eine Rechnung mit Leistungszeitraum nach Tagen auf die Perioden auf (`backend/src/services/invoice.service.ts:508-517`, `inPeriod`). Runde 2, V-1 Variante A, sagte: «Den Leistungszeitraum der Schlussrechnung dann ab dem Tag nach der abgerechneten Periode setzen (sonst wie Fall 2 zu wenig).» Der entschiedene Text sagt das nicht.
- Nachgerechnet (Beispiel oben, Text befolgt, vorgeschlagener Leistungszeitraum 1.10.2024–30.9.2025 übernommen): Betrag 1’000.00; Anteil 2025 = 1’000.00 × 273/365 = **747.95**; Anteil 2024 = 252.05, aber 2024 ist versendet und wird nicht neu gerechnet. Total bei den Mietern 250.00 + 747.95 = **997.95** statt 1’250.00, also 252.05 (20 %) zu wenig. Zum Vergleich ohne Leistungszeitraum: 1’250.00 ✓; mit Leistungszeitraum 1.1.–30.9.2025: 1’000.00 ganz in 2025, 1’250.00 ✓.
- Warum: Mietrechtlich kein Verstoss: Der Mieter zahlt weniger als die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR). Für den Vermieter ist es ein Verlust. Der Grund ist nicht offensichtlich: Er folgt dem Hinweis und übernimmt den Vorschlag der KI. Der Verlust über die versendete Periode trifft jede Rechnung, deren Leistungszeitraum in eine versendete Periode reicht (besteht schon vorher). Variante A macht ihn hier aber grösser: 997.95 statt 1’184.93, wenn alle gelöscht werden. Der Grund: Der abgezogene Betrag deckt die Vorperiode schon, und der Leistungszeitraum zieht nochmals einen Anteil dorthin.
- Korrektur (Entscheid des Produktverantwortlichen; sonst `fachlich`/`entscheiden`-Issue, Text nicht blockiert):
  - Upload-Text, letzter Satz: de «Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der abgerechneten Periode beginnen.»; fr «… mais déduisez son montant du total et faites commencer la période de prestation après la période décomptée.»; it «… ma deduca il suo importo dal totale e faccia iniziare il periodo di prestazione dopo il periodo conteggiato.»; en «… deduct its amount from the total instead and let the service period start after the period already in a statement.» (fr/it/en «période de prestation» / «periodo di prestazione» / «service period» nach `i18n-begriffe.md` prüfen; dort nicht nachgesehen.)
  - Oder nur im Glossar zu «Akontorechnung» ergänzen und im Beleg-Text weglassen.

### V-8 (Minor): Abgerechnete Akontorechnungen über dem Total

- Belege: Betrag muss grösser als 0 sein (`src/lib/invoice.ts:50`, `invoices_error_amount`). Der Text sagt «ziehen Sie ihren Betrag vom Total ab» ohne Grenze.
- Nachgerechnet: Werke-Jahr 1.7.2024–30.6.2025, Akontorechnungen à 250.00 am 15.8., 15.11.2024, 15.2., 15.5.2025; Abrechnung 2024 mit 500.00 versendet; Schlussrechnung 15.7.2025, T = 450.00, A = 1’000.00 (Guthaben 550.00). Variante A: 450.00 − 500.00 = **−50.00**, Dwello weist das ab. Richtig wäre: Die Mieter haben 2024 500.00 bezahlt, tatsächlich waren es 450.00; 50.00 zu viel. Lässt der Vermieter die Schlussrechnung weg und löscht die zwei Akontorechnungen 2025: 2025 = 0, Summe 500.00, also 50.00 zu viel bei den Mietern (gegen Art. 257b Abs. 1 OR). Randfall T = 500.00: Ergebnis 0.00, nicht eingebbar; richtig ist 0 in 2025, also Weglassen korrekt.
- Warum: Selten (der Verbrauch liegt deutlich unter den Akonti, und mehr als die Hälfte ist abgerechnet), aber dann führt der Hinweis in eine Fehlermeldung ohne Ausweg. Ein Zuviel beim Mieter ist möglich.
- Korrektur (Entscheid, als Issue `fachlich`, `entscheiden`; blockiert #222 nicht): Ergibt das 0 oder weniger, gilt die Regel der Gutschrift: de «Ergibt das 0 oder weniger, erfassen Sie die Schlussrechnung nicht; die Abrechnung mit der Akontorechnung ist dann zu berichtigen.» (fr «Si le résultat est nul ou négatif, ne saisissez pas la facture finale ; le décompte qui contient la facture d’acompte doit alors être rectifié.» (U+00A0 vor «;»); it «Se il risultato è zero o negativo, non registri la fattura finale; il conteggio che contiene la fattura d’acconto va rettificato.»; en «If the result is zero or less, do not enter the final invoice; the statement that contains the advance invoice must be corrected.»). Ob man den Hinweis dafür verlängert oder nur das Glossar ergänzt, entscheidet der Produktverantwortliche.

### V-9 (Nit): U+00A0 im fr Beleg-Text

- Beleg: Issue #222, fr von `invoices_beleg_deducted`: «Vérifiez qu’ils ne comptent qu’une fois : le montant …», vor «:» steht U+0020 (per Skript gezählt: 1 Leerzeichen-Doppelpunkt, 0 U+00A0). `messages/fr.json:856` hat heute U+00A0.
- Korrektur: In `messages/fr.json` U+00A0 vor «:» setzen (Konvention in `CLAUDE.md`, `docs/design/i18n-begriffe.md`). Das Issue muss dafür nicht geändert werden. Der Text im Issue hat das Zeichen vermutlich beim Einfügen verloren.

### V-10 (Nit): en «in a statement» neben «billed»

- Belege: neu «If one of them is already in a statement» (beide Texte); bestehend «Invoice already billed» (`messages/en.json:743`), «The invoice has been billed» (`:854`). fr/it verwenden in alt und neu dasselbe Wort.
- Warum: Zwei englische Wörter für «abgerechnet». «billed» ist mehrdeutig (der Rechnungssteller hat auch «billed»), «in a statement» ist hier klarer, darum den neuen Text so lassen.
- Korrektur: keine im Commit; als offene Arbeit die zwei alten en-Texte auf «in a statement» angleichen oder eine Zeile «abgerechnet (Rechnung)» in `i18n-begriffe.md` aufnehmen.

### V-11 (Nit): Regel und Ausnahme im Beleg-Text

- Beleg: de «Der Betrag ist das Total vor dem Abzug, … Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.» (gleich in fr/it/en).
- Warum: Der zweite Satz schränkt den ersten ein. Fachlich stimmt das, und ein Leser versteht es als Ausnahme. Ein unerfahrener Vermieter mit Variante A könnte beim ersten Satz aber meinen, sein Betrag (1’000.00) sei falsch.
- Korrektur: optional «Ausnahme: Ist eine davon …». Keine Änderung nötig. Der Text ist entschieden.

## Fehlende Begriffe / Glossar

- «Akontorechnung (eines Rechnungsstellers)», Satz zu Variante A: trägt der Produktverantwortliche nach (kein neues Issue). Vorschlag: «Ist eine Akontorechnung schon abgerechnet, bleibt sie erfasst, und die Schlussrechnung wird um ihren Betrag gemindert; ihr Leistungszeitraum beginnt dann nach der abgerechneten Periode. Ergibt das 0 oder weniger, ist die Abrechnung mit der Akontorechnung zu berichtigen.» (zweiter und dritter Teil nur, falls V-7 und V-8 so entschieden werden).
- «abgerechnet» (bei einer Rechnung: in einem Entwurf, einer versendeten oder bezahlten Abrechnung enthalten) hat keinen eigenen Glossareintrag und keine Zeile in `i18n-begriffe.md` (V-10). Vorschlag für ein Issue (`fachlich`, `entscheiden`): «Abgerechnet (Rechnung): Die Rechnung ist in einer Nebenkostenabrechnung enthalten (Entwurf, versendet oder bezahlt).» fr décomptée / it conteggiata / en in a statement.

## Nicht bestätigt

- Ob «schon abgerechnet» im Hinweis den Entwurf meint: im Text nicht gesagt; aus `invoices_delete_billed_text` (`messages/de.json:783`) erschlossen, `deleteInvoice` im Service nicht nachgelesen. Für Entwürfe stimmt Variante A rechnerisch auch (Fall e).
- fr/it/en «période de prestation» / «periodo di prestazione» / «service period» in V-7: nicht gegen `i18n-begriffe.md` geprüft.
- fr U+00A0 vor «;» (V-8-Vorschlag): Regel in `i18n-begriffe.md` nicht nachgelesen.
- Praxis «abgerechnete Akonti stehen lassen, Schlussrechnung mindern, Leistungszeitraum nach der Periode»: Erfahrung aus der Verwalterrolle. `docs/nebenkostenabrechnung-anforderungen.md` regelt nur das Akonto des Mieters, `docs/anforderungen-vertragsende.md` keine Rechnungen von Rechnungsstellern.
- Die fr/it/en-Texte sind in `messages/*.json` am Commit `07478903` noch nicht geändert. Geprüft ist der Issue-Text, nicht die umgesetzten Strings.
- Fedlex-Fassung `20270701` (die neueste im Filestore). Die heute geltende Fassung habe ich nicht separat geladen. Art. 257a/257b sind dort wörtlich wie zitiert.
