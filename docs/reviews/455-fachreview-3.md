# Fachreview #455, Runde 3 (Persona-Befunde Dr. Weber, Commit e3cb329e)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-455-fach3` (detached, e3cb329e). Gegenstand: `weber-455.md` P-1 bis P-5, die Texte `invoices_upload_deducted_rule`, `invoices_beleg_deducted_rule`, `invoices_edit_deducted_rule`, `invoices_upload_advance_invoice` (de/fr/it/en) und die Glossarzeilen «Akontorechnung», «Abgerechnet (Rechnung)», «Schlussrechnung».
Quellen: #222 (Satz zum Leistungszeitraum, PO 2026-10-18), #455 «Decided (product owner)» mit den Einträgen vom 2026-10-19, #481, #482. Dazu die Fachreviews 222-3, 222-4, 455-1 und 455-2, `UBIQUITOUS_LANGUAGE.md:79-82,184`, `docs/design/i18n-begriffe.md`, `backend/src/services/invoice.service.ts` (`inPeriod`, `deleteInvoice`), `src/lib/invoice.ts:28-31`.
Fedlex: OR in der Fassung 20260101, VMWG in der Fassung 20251001 (Filestore-HTML, in dieser Runde neu geladen).

## Status der offenen IDs aus Runde 2

| ID | Status |
|----|--------|
| V-12 | Behoben: de/fr/it/en der Rechnungsseiten-Regel beginnen wie beschlossen. |
| V-13 | Behoben: `UBIQUITOUS_LANGUAGE.md:81` sagt jetzt «der abgerechneten Akontorechnungen … mit ihnen». |
| V-14 | Behoben: `invoices_edit_deducted_rule` sagt in allen vier Sprachen «auf der Seite der Rechnung». |
| V-4, V-10, V-11, V-15, V-16 | In dieser Runde nicht geprüft (nicht Teil des Auftrags), Stand wie in Runde 2. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht / Verwalter | Major (Produktentscheid) | (P-1) Die Regel «ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen» schiebt die Abweichung zwischen der Akontorechnung und dem tatsächlichen Anteil der abgerechneten Periode in die nächste Periode. Endet der Leistungszeitraum innerhalb der abgerechneten Periode (eine Jahresrechnung, die nach der Abrechnung kommt), wandert sogar der ganze Restbetrag dorthin, und den Satz kann man gar nicht befolgen (Ende vor Beginn wird abgelehnt). Bei weniger als 0 berichtigt Dwello dagegen die alten Abrechnungen. Empfehlung: Option C (immer das Total mit dem Leistungszeitraum laut Beleg erfassen, alle Akontorechnungen löschen und die Abrechnungen nachführen). |
| V-17 | Verwalter | Minor | (P-3) Nach der Glossarzeile 79 zählt eine Akontorechnung, die nur in einem Entwurf steht, als «abgerechnet». Das ist richtig, steht im Hinweis aber nicht. Mit C erledigt sich das; bleibt A, braucht es «(auch in einem Entwurf)». |
| V-18 | Verwalter | Minor | (P-2) «Prüfen Sie, dass sie nur einmal zählen: Die Akontorechnungen sind nicht zusätzlich erfasst.» liest sich wie ein Prüfergebnis. Abhilfe: «Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind.» (Wortlaut unten). |
| V-19 | Verwalter | Minor | (P-4) Im Akonto-Hinweis zeigt «Kommt sie erst nach …» auf die Akontorechnung, von der der Kasten handelt. Gemeint ist die Schlussrechnung. Abhilfe: «Kommt die Schlussrechnung erst nach …». |
| V-20 | Verwalter | Nit | (P-5) Ein langer Absatz. Mit C hat die Regel noch vier Sätze und keine Fallunterscheidung mehr, eine Liste ist dann nicht nötig. Bleibt A: eine Liste nur, wenn die Texte ohnehin in Schlüssel je Fall geteilt werden. Sonst keine Änderung. |

## Blocker / Major

### M-1 (P-1): Der Leistungszeitraum nach der abgerechneten Periode verschiebt Kosten in eine fremde Periode

**Evidenz**
- `messages/de.json` `invoices_upload_deducted_rule`: «Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist. … Ergibt es weniger als 0, … berichtigen Sie die Abrechnungen mit ihnen.» Ebenso `invoices_beleg_deducted_rule` und `invoices_edit_deducted_rule`, fr/it/en sinngleich.
- `invoices_service_period_help`: «Für das 4. Quartal also 01.10.{year} bis 31.12.{year}, auch wenn die Rechnung erst im Januar kommt. Dann zählen nur die Tage, die in die Abrechnungsperiode fallen.» `invoices_service_period_years`: «Wer später einzieht, zahlt nur für seine Zeit.» Glossar «Gutschrift» (Z. 80): «Ist diese Rechnung schon abgerechnet, braucht es eine berichtigte Abrechnung.» Dwello ordnet Kosten also sonst überall der Zeit zu, in der sie anfallen, und korrigiert eine abgerechnete Periode mit einer berichtigten Abrechnung.
- `src/lib/invoice.ts:31`: Liegt das Ende vor dem Beginn, kommt `invoices_error_service_order`. `invoice.service.ts` `inPeriod`: Eine Rechnung ohne Leistungszeitraum zählt in der Periode ihres Rechnungsdatums.
- `docs/reviews/222-fachreview-4.md:40` hat die Folge von Variante A schon gerechnet (65.07 tragen die Mieter 2025) und als entschieden hingenommen. Der Fall, in dem der Leistungszeitraum innerhalb der abgerechneten Periode endet, war dort nicht gerechnet.
- Fedlex, OR Art. 257a Abs. 1: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» Art. 257b Abs. 1: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Art. 257b Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» VMWG Art. 4 Abs. 1: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»

**Nachgerechnet**

Fall 1 (wie weber-222): Die Abrechnungsperiode ist das Kalenderjahr. Leistungszeitraum der Schlussrechnung 01.10.2024–30.09.2025 (365 Tage, davon 92 in 2024 und 273 in 2025), Total 1’250.00. Die Akontorechnung Q4 2024 über 250.00 ist mit der Abrechnung 2024 versendet. Q1–Q3 2025 (750.00) sind gelöscht.
- Tatsächlicher Anteil: 2024 1’250 × 92/365 = **315.07**, 2025 1’250 × 273/365 = **934.93**.
- Heutige Regel (A): Erfasst werden 1’000.00 mit 01.01.–30.09.2025. Das ergibt 2024 250.00 und 2025 1’000.00, zusammen 1’250.00 ✓. 65.07 Kosten aus 2024 tragen aber die Mieter 2025. Bei einem Mieterwechsel am 30.04.2025 (A bis 30.04., 120 Tage, B ab 01.05., 153 Tage) zahlt B 1’000 × 153/273 = 560.44 statt 934.93 × 153/273 = 523.97, also 36.47 zu viel, und A 28.60 zu viel. 36.47 + 28.60 = 65.07 ✓. Der Mieter von 2024 hat 65.07 zu wenig getragen.
- Akonto zu hoch, gleicher Fall mit einer Akontorechnung Q4 über 400.00: A erfasst 850.00 für 2025. Der Mieter 2024 hat 400.00 statt 315.07 bezahlt, also **84.93 mehr als die tatsächlichen Aufwendungen**, und bekommt nichts zurück. Die Mieter 2025 zahlen 84.93 zu wenig. Ergibt das Total weniger die Akontorechnungen dagegen weniger als 0, berichtigt Dwello die alte Abrechnung, und der frühere Mieter erhält sein Geld zurück. Dieselbe Überzahlung wird also je nach Höhe des Rests einmal ausgeglichen und einmal nicht. Das ist die Ungleichheit, die P-1 nennt.

Fall 2 (häufig, zum Beispiel bei Strom- oder Wasserrechnungen fürs Jahr): Leistungszeitraum 01.01.–31.12.2024, Akontorechnungen Q1–Q4 2024 (4 × 250.00) in der versendeten Abrechnung 2024, die Schlussrechnung über 1’250.00 kommt im Februar 2025, Rest 250.00.
- A: Der Leistungszeitraum soll «erst nach der Abrechnungsperiode beginnen», also frühestens am 01.01.2025. Das Ende auf dem Beleg ist aber der 31.12.2024, und Dwello lehnt Ende vor Beginn ab. Der Liegenschaftsverwalter muss einen Zeitraum erfinden oder das Feld leer lassen. Leer fallen die 250.00 mit dem Rechnungsdatum ganz in 2025: **100 % des Rests sind Kosten von 2024**. Zieht am 01.01.2025 ein neuer Mieter ein, zahlt er 250.00 für ein Jahr, in dem er nicht dort wohnte.
- C (unten): Die vier Akontorechnungen werden gelöscht, die Schlussrechnung mit 1’250.00 und 01.01.–31.12.2024 erfasst und die Abrechnung 2024 berichtigt. Das ergibt eine Nachzahlung von 250.00 beim Mieter 2024 und 0 in 2025 ✓.

Randfälle mit C:
- Ergibt das Total weniger die Akontorechnungen 0 (Total 1’000, Akontorechnungen 1’000): Es werden 1’000 erfasst und die Akontorechnungen gelöscht. Die berichtigte Abrechnung verschiebt nur den Anteil nach Tagen. Er ist 0, wenn die Zeiträume der Akontorechnungen den Tagen entsprechen.
- Weniger als 0 (Total 800, Akontorechnungen 1’000, alle in einer Periode): Es werden 800 erfasst und die Akontorechnungen gelöscht. Die berichtigte Abrechnung ergibt eine Rückerstattung von 200 ✓. Das ist dasselbe Ergebnis wie nach #481, nur ohne Sonderfall.

**Warum falsch**
1. Dwello rechnet im Übrigen nach Leistungszeitraum, also nach den Tagen, in denen die Kosten anfallen (Hilfetext, `inPeriod`, Gutschrift). Nach Art. 257a Abs. 1 OR sind die Nebenkosten das «Entgelt für die Leistungen …, die mit dem Gebrauch der Sache zusammenhängen». Wer in einer Zeit nicht Mieter war, hatte dort keinen Gebrauch. Dass ein neuer Mieter Kosten vor seinem Einzug tragen muss oder ein früherer Mieter mehr als die tatsächlichen Aufwendungen bezahlt, ist mit Art. 257b Abs. 1 OR nur schwer vereinbar. Einen Fedlex-Wortlaut, der die Zuordnung zur Periode ausdrücklich regelt, gibt es nicht: Diese Folgerung ist **unsicher** (siehe «Nicht bestätigt»).
2. Der Satz widerspricht der Hilfe zum Leistungszeitraum und dem Beleg. Der erfasste Zeitraum stimmt dann nicht mit dem überein, den der Mieter bei der Einsicht nach Art. 257b Abs. 2 OR sieht.
3. In Fall 2 lässt sich der Satz gar nicht befolgen.
4. Es gibt eine Ungleichheit: Eine Überzahlung von weniger als 0 wird berichtigt, eine kleinere wird weitergeschoben.

P-1 ist im Ergebnis richtig, aber in der Begründung zu breit. Im Fall 1 gehört der Rest nach dem 31.12. tatsächlich in die Folgeperiode. Nur die Schätzabweichung der Akontorechnung (65.07) wandert. Ganz falsch ist der Satz im Fall 2.

**Abhilfe: Produktentscheid.** Der Satz ist in #222 beschlossen (PO 2026-10-18), die Folge wurde in 222-fachreview-4 Fall c bewusst hingenommen, der Satz für weniger als 0 in #409, #455 und #481. Optionen:

- **C (empfohlen): eine einzige Regel ohne Sonderfälle.** Die Schlussrechnung wird immer mit dem Total und dem Leistungszeitraum laut Beleg erfasst. Erfasste Akontorechnungen werden gelöscht, auch abgerechnete. Danach führt der Liegenschaftsverwalter ihre Abrechnungen nach: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen» (der Ablauf, den `invoices_delete_billed_text` und `invoices_edit_billed_text` schon beschreiben). Die Sätze für 0 und weniger als 0 fallen weg, ebenso das Verschieben des Leistungszeitraums. Die kurze Zeile auf der Rechnungsseite wird wieder «Der Betrag ist das Total vor dem Abzug.» (der Wortlaut aus #409 6.1). Jede Periode trägt damit genau ihre Kosten. Das gilt auch bei einem Mieterwechsel (Fall 1: 315.07 / 934.93, B 523.97). Beleg und Erfassung stimmen überein.
  Was C kostet:
  - Jede Schlussrechnung, die eine schon versendete Akontorechnung ersetzt, führt zu einer berichtigten Abrechnung. Oft geht es dabei um kleine Nachzahlungen oder Rückerstattungen, auch an Mieter, die schon ausgezogen sind. Die Verjährung ist nach Art. 128 Ziff. 1 OR fünf Jahre: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen». Ab wann die Frist läuft, ist laut Glossar Z. 184 nicht einheitlich geklärt.
  - Der erste Satz von `invoices_delete_billed_text` («Löschen Sie nur falsch erfasste Rechnungen.») passt dann nicht mehr ganz. Er braucht einen Zusatz, etwa «… oder Akontorechnungen, die eine Schlussrechnung ersetzt».
  - Die Szenarien der drei Hinweise und die Glossarzeilen «Akontorechnung» und «Schlussrechnung» ändern sich.
  - Werden die Akontorechnungen erst nach der Schlussrechnung gelöscht, zählen sie in der Zwischenzeit doppelt. Das ist harmlos, solange in dieser Zeit keine Abrechnung erstellt wird.
- **A (heute, beschlossen): beibehalten.** Das entspricht der Praxis, bei der der Unterschied zur Abgrenzung in der Folgeperiode gebucht wird. Es bleibt aber die Ungleichheit, und Fall 2 braucht dann mindestens den Satz «Endet der Leistungszeitraum der Rechnung vorher, lassen Sie ihn leer.». Damit wird das Weiterschieben ganz offen und trifft bei einem Mieterwechsel den Falschen. Für A spricht nur der geringere Aufwand. Wählt der PO A, gelten die Teilsätze unter V-17 bis V-19 (Option A).

Meine Empfehlung ist eindeutig C. Weil sie beschlossene Texte aus #222, #409/#455 und #481 ändert, braucht sie aber die Wahl des Product Owners (gehört unter «Blocked on me»).

**Texte für C**

`invoices_upload_deducted_rule`
- de: «Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen», auch wenn sie schon abgerechnet sind. Sind ihre Dateien hier ausgewählt, entfernen Sie diese mit «Datei entfernen». Sonst zählen sie doppelt. Übernehmen Sie den Leistungszeitraum der Rechnung. War eine Akontorechnung schon abgerechnet, führen Sie danach die Abrechnungen mit ihr nach: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen». So trägt jede Abrechnungsperiode ihre tatsächlichen Kosten.»
- fr: «Si vous avez déjà saisi les factures d’acompte, supprimez-les sur leur page avec « Supprimer la facture », même si elles sont déjà décomptées. Si leurs fichiers sont sélectionnés ici, retirez-les avec « Retirer le fichier ». Sinon, elles comptent deux fois. Reprenez la période de prestation de la facture. Si une facture d’acompte était déjà décomptée, mettez ensuite à jour les décomptes qui la contiennent : les brouillons avec « Recalculer », les décomptes envoyés ou payés avec « Rectifier le décompte ». Ainsi, chaque période de décompte supporte ses frais effectifs.»
- it: «Se ha già registrato le fatture d’acconto, le elimini sulla loro pagina con «Eliminare la fattura», anche se sono già state conteggiate. Se i loro file sono selezionati qui, li rimuova con «Rimuovere il file». Altrimenti contano due volte. Riprenda il periodo di prestazione della fattura. Se una fattura d’acconto era già stata conteggiata, aggiorni poi i conteggi che la contengono: le bozze con «Ricalcolare», i conteggi inviati o pagati con «Rettificare il conteggio». Così ogni periodo di conteggio sostiene i suoi costi effettivi.»
- en: «If you have already entered the advance invoices, delete them on their page with “Delete invoice”, even if they are already in a statement. If their files are selected here, remove them with “Remove the file”. Otherwise they count twice. Keep the service period of the invoice. If an advance invoice was already in a statement, then update the statements that contain it: drafts with “Recalculate”, sent or paid statements with “Correct statement”. This way each billing period bears its actual costs.»

`invoices_beleg_deducted_rule` und `invoices_edit_deducted_rule` (mit C gleich, denn gelöscht wird nur auf der Seite der Akontorechnung, V-14 entfällt):
- de: «Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind. Ist eine noch erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen», auch wenn sie schon abgerechnet ist, und führen Sie danach die Abrechnungen mit ihr nach: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen». Der Leistungszeitraum ist der auf dem Beleg.»
- fr: «Vérifiez que les factures d’acompte ne sont pas saisies en plus. Si l’une d’elles est encore saisie, supprimez-la sur sa page avec « Supprimer la facture », même si elle est déjà décomptée, puis mettez à jour les décomptes qui la contiennent : les brouillons avec « Recalculer », les décomptes envoyés ou payés avec « Rectifier le décompte ». La période de prestation est celle de la pièce justificative.»
- it: «Verifichi che le fatture d’acconto non siano registrate in aggiunta. Se una di esse è ancora registrata, la elimini sulla sua pagina con «Eliminare la fattura», anche se è già stata conteggiata, e aggiorni poi i conteggi che la contengono: le bozze con «Ricalcolare», i conteggi inviati o pagati con «Rettificare il conteggio». Il periodo di prestazione è quello del giustificativo.»
- en: «Check that the advance invoices are not entered as well. If one of them is still entered, delete it on its page with “Delete invoice”, even if it is already in a statement, and then update the statements that contain it: drafts with “Recalculate”, sent or paid statements with “Correct statement”. The service period is the one on the supporting document.»

`invoices_beleg_deducted`, zweiter Satz:
- de: «Der Betrag ist das Total vor dem Abzug.»
- fr: «Le montant est le total avant la déduction.»
- it: «L’importo è il totale prima della deduzione.»
- en: «The amount is the total before the deduction.»

`invoices_upload_advance_invoice`, letzter Satz (darin auch V-19):
- de: «Kommt die Schlussrechnung erst nach der Abrechnung dieser Periode, setzen Sie das Häkchen bei «Diese Rechnung erstellen» und erfassen Sie die Akontorechnung; löschen Sie sie, wenn Sie die Schlussrechnung erfassen.»
- fr: «Si la facture finale n’arrive qu’après le décompte de cette période, cochez « Créer cette facture » et saisissez la facture d’acompte ; supprimez-la lorsque vous saisissez la facture finale.»
- it: «Se la fattura finale arriva solo dopo il conteggio di questo periodo, spunti «Creare questa fattura» e registri la fattura d’acconto; la elimini quando registra la fattura finale.»
- en: «If the final invoice arrives only after the statement of this period, tick “Create this invoice” and enter the advance invoice; delete it when you enter the final invoice.»

Glossar (der PO führt es nach, `UBIQUITOUS_LANGUAGE.md` wird hier nicht geändert):
- «Akontorechnung (eines Rechnungsstellers)»: «Teilrechnung eines Rechnungsstellers über einen Vorschuss auf seine Leistungen; die Schlussrechnung zieht sie ab. In Dwello wird die Schlussrechnung mit dem Total der Leistungen und dem Leistungszeitraum laut Beleg erfasst; erfasste Akontorechnungen werden gelöscht, auch abgerechnete, und ihre Abrechnungen werden neu berechnet (Entwurf) oder berichtigt. Nicht zu verwechseln mit dem Akonto des Mieters.»
- «Schlussrechnung (eines Rechnungsstellers)»: «Rechnung eines Rechnungsstellers über das Total seiner Leistungen, die seine Akontorechnungen abzieht. Dwello erfasst sie mit dem Total vor dem Abzug.»
- «Abgerechnet (Rechnung)»: bleibt unverändert.

## Antworten auf die Fragen

**1. P-1:** Siehe M-1. Ja, der Rat schiebt Kosten in eine fremde Periode. In Fall 2 lässt er sich nicht befolgen, und gegenüber dem Fall unter 0 ist er ungleich. Major, Produktentscheid. Die Empfehlung C ist eindeutig, sie ändert aber beschlossene Texte.

**2. P-3 (V-17, Minor):** Ja. Nach `UBIQUITOUS_LANGUAGE.md:79` («gleich welchen Status diese hat (Entwurf, versendet, bezahlt oder ersetzt)») gilt eine Akontorechnung, die nur in einem Entwurf steht, als abgerechnet. Die heutige Regel ergibt auch dann die richtige Summe: Fall 1 als Entwurf ergibt 250 + 1’000 = 1’250 ✓. Genau nach Tagen verteilt ist sie aber nur, wenn die Akontorechnung gelöscht und der Entwurf neu berechnet wird (315.07 / 934.93), und das kostet beim Entwurf keine Berichtigung.
- Mit C braucht es keinen Satz: Die Regel nennt Entwürfe ausdrücklich («Entwürfe mit «Neu berechnen»»).
- Bleibt A, braucht es einen Zusatz hinter «schon abgerechnet» in allen drei Regeln:
  - de «(auch in einem Entwurf)»
  - fr «(même dans un brouillon)»
  - it «(anche in una bozza)»
  - en «(even a draft)», also «already in a statement (even a draft)»

  Diese Empfehlung ist eindeutig. Weil sie beschlossene Texte ändert, braucht es die Bestätigung des PO oder des Koordinators mit seiner Vollmacht.

**3a. P-2 (V-18, Minor):** Ja, eine Änderung ist nötig. Der Anfang kommt aus #222. Der Satz im Indikativ war dort eine Prüfbedingung hinter «Prüfen Sie, dass …:». Seit dem Wegfall des Teilsatzes «Der Betrag ist das Total vor dem Abzug, und» liest er sich als Feststellung.
- Mit C ist der Wortlaut oben schon geändert («Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind.»).
- Bleibt A, lauten die ersten beiden Sätze:
  - de: «Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind. Ist eine davon schon abgerechnet, muss sie erfasst bleiben, ihr Betrag vom Total abgezogen sein und der Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist.»
  - fr: «Vérifiez que les factures d’acompte ne sont pas saisies en plus. Si l’une d’elles est déjà décomptée, elle doit rester saisie, son montant doit être déduit du total et la période de prestation doit commencer après la période de décompte dans laquelle elle est décomptée.»
  - it: «Verifichi che le fatture d’acconto non siano registrate in aggiunta. Se una di esse è già stata conteggiata, deve restare registrata, il suo importo deve essere dedotto dal totale e il periodo di prestazione deve iniziare dopo il periodo di conteggio in cui è stata conteggiata.»
  - en: «Check that the advance invoices are not entered as well. If one of them is already in a statement, it must stay entered, its amount must be deducted from the total, and the service period must start after the billing period of that statement.»

  Der Rest ab «Ergibt das Total …» bleibt. Die Empfehlung ist eindeutig, ändert aber einen beschlossenen Text (Bestätigung wie bei V-17).

**3b. P-4 (V-19, Minor):** Ja, eine Änderung ist nötig. Das «sie» steht in einem Kasten über die Akontorechnung. Liest man es als Akontorechnung, erfasst man sie, wenn sie spät kommt, und nicht, wenn die Schlussrechnung spät kommt.
- Mit C gilt der Satz oben.
- Bleibt A, wird nur das Subjekt ersetzt:
  - de «Kommt die Schlussrechnung erst nach der Abrechnung dieser Periode, setzen Sie das Häkchen bei «Diese Rechnung erstellen» und erfassen Sie die Akontorechnung; ziehen Sie ihren Betrag dann von der Schlussrechnung ab.»
  - fr «Si la facture finale n’arrive qu’après le décompte de cette période, …»
  - it «Se la fattura finale arriva solo dopo il conteggio di questo periodo, …»
  - en «If the final invoice arrives only after the statement of this period, …»

  Der Rest bleibt wie heute. Die Empfehlung ist eindeutig, aber der Text ist in #482 beschlossen (Bestätigung).

**3c. P-5 (V-20, Nit):** Keine Änderung. Mit C fällt die Fallunterscheidung weg. Mit A hiesse eine Liste, die Schlüssel zu teilen, und das lohnt sich für einen Nit nicht. Das ist eindeutig.

## Bestätigt
- Weber, Beobachtung 1: Total 1’250.00, die Akontorechnung über 1’000.00 im selben Leistungszeitraum ist nicht erfasst, und es zählen 1’250.00. Das entspricht Art. 257b Abs. 1 OR ✓.
- Die Akontorechnung ist beim Hochladen nicht vorausgewählt (#455 Punkt 4) ✓.
- Rechnungen, die in Abrechnungen stehen, lassen sich löschen (`deleteInvoice` ohne Sperre, dazu der Hinweis `invoices_delete_billed_text`). C ist also ohne Änderung am Code machbar.
- Leistungszeitraum Ende vor Beginn wird abgelehnt (`src/lib/invoice.ts:31`). Das ist die Grundlage für Fall 2.

## Fehlende Begriffe
Keine. «nachführen» in den Texten für C ist ein gewöhnliches Verb und kein Fachbegriff.

## Nicht bestätigt
- **Zuordnung der Kosten zur Periode, in der sie anfallen:** OR Art. 257a und 257b sowie VMWG Art. 4 und 8 (Fedlex, Wortlaut oben) sagen nicht ausdrücklich, dass Kosten der Periode zuzuordnen sind, in der sie anfallen. Die Folgerung aus «Entgelt für die Leistungen …, die mit dem Gebrauch der Sache zusammenhängen» ist meine Auslegung, **unsicher**. Ob die Rechtsprechung kleine Abweichungen in die Folgeperiode zulässt, wenn der Vermieter es immer gleich macht (Abgrenzung oder Kassaprinzip), habe ich nicht gesucht. Gesucht habe ich auf Fedlex (OR 20260101, VMWG 20251001).
- **Nachforderung mit einer berichtigten Abrechnung, die der Mieter schon bezahlt hat:** Fedlex regelt nur die Verjährung (Art. 128 Ziff. 1 OR). Ob der Mieter mit der Zahlung die Abrechnung anerkennt und ob dann noch etwas nachgefordert werden darf, ist **unsicher**. Das betrifft die Kosten von C, nicht dessen Richtigkeit.
- **Wie häufig Fall 2 vorkommt** (Jahresrechnungen von Werken, die nach der Abrechnung kommen): Das stützt sich nur auf Erfahrung aus der Verwalterrolle. `docs/nebenkostenabrechnung-anforderungen.md` und `docs/anforderungen-vertragsende.md` regeln keine Rechnungen von Rechnungsstellern.
- **fr/it/en der Texte für C:** Die Begriffe stammen aus `i18n-begriffe.md` (Z. 44, 45, 71, 74, 82, 88, 120), die Knopfnamen aus `invoices_delete_billed_text` fr/it/en. Muttersprachler haben sie nicht geprüft. «mettre à jour» und «aggiornare» für «nachführen» sind meine Wahl.
- **Wie Dwello eine versendete Abrechnung nach dem Löschen einer abgerechneten Akontorechnung berichtigt:** Dass die berichtigte Abrechnung 315.07 statt 250.00 ergibt, habe ich nur aus `inPeriod` abgeleitet. Weder im Code von «Abrechnung berichtigen» noch in einem Persona-Lauf habe ich es geprüft.
