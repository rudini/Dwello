# Fachreview #455, Runde 2 (Delta c09ec4fd..cd08fd80)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-455-fach2` (detached, cd08fd80). Vorbericht: `docs/reviews/455-fachreview-1.md`. Quellen: #455 «Decided (product owner)» mit dem Eintrag vom 2026-10-19, #481, #482, #483 (je «Decided (product owner)»), `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`. Den Wortlaut von Art. 257b Abs. 1 OR hat Runde 1 auf Fedlex (Fassung 1.1.2026) geprüft: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …».

## Status der offenen IDs aus Runde 1

| ID | Status |
|----|--------|
| V-1 | Behoben. Der Wortlaut nach «…» entspricht dem Entscheid vom 2026-10-19 wörtlich (de.json `invoices_beleg_deducted_rule`, beide Szenarien). Der Anfang stammt aus meinem Vorschlag und ist mehrdeutig, siehe neu V-12. |
| V-2 | Behoben. Der Text ist wörtlich wie beschlossen, auch in fr/it/en sinngleich. |
| V-3 | In der Oberfläche behoben: Upload- und Beleg-Regel sagen jetzt «der abgerechneten Akontorechnungen … mit ihnen» (#481). Das Glossar ist noch nicht nachgeführt, siehe neu V-13. |
| V-4 | Teilweise behoben. Der Prompt (llm.ts:268) verwendet jetzt die Glossarwörter und nennt das Gegenbeispiel «Rechnung, die nur in Raten bezahlt wird». Es fehlt aber noch ein Fall für die Auslesung in `llm:eval`. Bleibt **Minor** (siehe «Nicht bestätigt»). |
| V-5 | Behoben. Mit `invoices_upload_deducted_no_total` gibt es eine Variante ohne Total. Nachgerechnet: deductedAmount 1000 mit amount 1250.00 ergibt «… vorgeschlagen: CHF 1’250.00.». deductedAmount 1000 mit amount null ergibt «… Tragen Sie als Betrag das Total vor dem Abzug ein.». deductedAmount null ergibt keine Zeile (`deductedOn`, invoice-upload.ts). |
| V-6 | Behoben. Der Text ist wörtlich wie in #482 beschlossen. Die Bezeichnung des Bedienelements stimmt in allen vier Sprachen mit `invoices_upload_select` überein («Diese Rechnung erstellen» / « Créer cette facture » / «Creare questa fattura» / “Create this invoice”). |
| V-7 | Behoben. Schritt «Und erinnert der Beleg nicht an abgezogene Akontorechnungen» in invoices.feature. |
| V-8 | Behoben. Glossarzeile und i18n-Zeile wie in #483 beschlossen, siehe unten. |
| V-9 | Behoben: en «a prepayment». |
| V-10 | Offen, Nit (beschlossen und unverändert). |
| V-11 | en ist behoben («If it comes back later»). «der letzten Rechnung» ist wie beschlossen geblieben: offen, Nit. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-12 | Verwalter | Major | Rechnungsseite und «Rechnung bearbeiten»: «Ergibt das Total weniger **diese** Akontorechnungen 0, löschen Sie diese Rechnung …». Man kann das als alle abgezogenen Akontorechnungen lesen. Dann wird eine Schlussrechnung mit Restbetrag 0 gelöscht, und ihre Kosten fehlen ganz. |
| V-13 | Verwalter | Major (Produktentscheid) | Die Glossarzeile «Akontorechnung» (UBIQUITOUS_LANGUAGE.md:81) sagt noch «Der Betrag **einer** abgerechneten Akontorechnung … mit ihr». Die Oberfläche sagt nach #481 «der abgerechneten Akontorechnungen … mit ihnen». Laut «Done means» von #481 muss der Product Owner das Glossar nachführen, sonst schliesst «Fixes #481» das Issue zu früh. |
| V-14 | Verwalter | Minor | In «Rechnung bearbeiten» verweist die Regel auf «Rechnung löschen». Diesen Knopf gibt es nur auf der Detailseite (`invoices_delete()` nur in `src/routes/invoices/[id]/+page.svelte`). Lösung: «… auf der Seite der Rechnung mit «Rechnung löschen»». Der Text ist beschlossen, deshalb Issue oder Rückfrage. |
| V-15 | Verwalter | Nit | `proposeKey` und `keyFor` (InvoiceUploadDialog.svelte:60–70) nehmen nur die neueste Rechnung (`limit: '1'`). Hat diese keinen Verteilschlüssel, schlägt Dwello nichts vor, auch wenn ältere Rechnungen derselben Kategorie einen haben. Lösung: die neueste Rechnung *mit* Verteilschlüssel nehmen, oder den Fall so belassen. |
| V-16 | Verwalter | Nit | Für den vorgeschlagenen Verteilschlüssel gibt es kein Szenario, nur Unit-Tests (`invoice-upload.test.ts:225–236`). Die Änderung ist sichtbar, die Behebung steht in #455 / #268. Lösung: ein Szenario in invoices.feature oder `No scenario: <Grund>`. |

## Blocker / Major

### V-12: «diese Akontorechnungen» ist mehrdeutig
- **Evidenz:** `messages/de.json` `invoices_beleg_deducted_rule`: «… Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen, … Ergibt das Total weniger diese Akontorechnungen 0, löschen Sie diese Rechnung mit «Rechnung löschen».» Gleich in `invoice-detail.feature` («Abgezogene Akontorechnungen beim Betrag») und `invoice-edit.feature`. fr «ces factures d’acompte», it «queste fatture d’acconto», en «these advance invoices».
- **Warum falsch:** Der Satz davor spricht im Singular von «eine davon». Für den Plural «diese Akontorechnungen» liegt deshalb der nächste Plural am nächsten, und das sind alle Akontorechnungen, die auf dem Beleg abgezogen sind. Gemeint sind aber nur die abgerechneten. Zwei Rechenbeispiele:
  - Total 1250, abgezogen 1250 (der Restbetrag ist 0), keine davon in Dwello erfasst. Richtig ist: Betrag 1250 bleibt, es zählen 1250. Liest man den Satz wie oben, ergibt 1250 − 1250 = 0, also «löschen». Danach zählen 0, und CHF 1250 tatsächliche Kosten fehlen in der Abrechnung.
  - Total 1250, abgezogen 1000, davon 500 abgerechnet. Richtig ist 1250 − 500 = 750, also nicht löschen. Liest man es falsch, ergibt 1250 − 1000 = 250, also auch nicht löschen. Hier ändert die falsche Lesart das Ergebnis nicht.

  Der Fehler trifft also genau den Fall, in dem der Restbetrag 0 ist. Das kommt bei Werken vor, deren Akonto die Jahreskosten deckt. Weniger als die tatsächlichen Kosten zu verlangen verstösst nicht gegen Art. 257b Abs. 1 OR, ist aber ein Verlust für den Liegenschaftsverwalter. Die Anweisung führt zu einer unumkehrbaren Löschung.
- **Abhilfe:** Der Entscheid vom 2026-10-19 legt den Wortlaut erst ab «…» fest. Den Anfang kann man deshalb ohne neuen Entscheid ändern:
  - de: «Ergibt das Total weniger die abgerechneten Akontorechnungen 0, löschen Sie diese Rechnung …»
  - fr: «Si le total moins les factures d’acompte décomptées donne 0, …»
  - it: «Se il totale meno le fatture d’acconto conteggiate dà 0, …»
  - en: «If the total less the advance invoices already in a statement gives 0, …»

  Beide Szenarien passen sich an. Die Upload-Regel («Ergibt das 0, …») ist eindeutig, weil sich «das» auf «ziehen Sie ihren Betrag vom Total ab» bezieht. Sie bleibt.

### V-13: Glossarzeile «Akontorechnung» widerspricht #481
- **Evidenz:** UBIQUITOUS_LANGUAGE.md:81: «… Der Betrag einer abgerechneten Akontorechnung wird um den Unterschied verringert, und die Abrechnungen mit ihr werden berichtigt.» In #481 steht unter «Options» A: «Glossary row «Akontorechnung» follows», unter «Done means»: «`UBIQUITOUS_LANGUAGE.md` is updated by the product owner». Im Diff ist nur die Zeile «Schlussrechnung» neu (#483).
- **Warum falsch:** Das Glossar ist die Quelle der Begriffe. Jetzt beschreibt es für den Fall «weniger als 0» etwas anderes als die Oberfläche. Rechenbeispiel aus #481: Schlussrechnung 200, zwei abgerechnete Akontorechnungen à 500, Unterschied −800. Nach dem Glossar wäre eine einzelne Akontorechnung um 800 zu verringern, das ergibt −300 und lässt sich nicht speichern. Nach der Oberfläche verringert man beide zusammen um 800, z.B. auf 100 + 100 = 200, und das stimmt.
- **Abhilfe (Produktentscheid, gehört unter «Blocked on me»):** Der Product Owner führt den Satz nach (oder ordnet ihn an wie in #483): «… Der Betrag der abgerechneten Akontorechnungen wird um den Unterschied verringert, und die Abrechnungen mit ihnen werden berichtigt.» Bis dahin sagt der Pull Request bei #481 `Refs` statt `Fixes`.

## Bestätigt
- **Upload-Regel** `invoices_upload_deducted_rule`: Sie besteht aus dem in #222 beschlossenen Rest, dem Satz aus Punkt 3 und #481 A. Gerechnet: 1250 − 500 = 750 wird erfasst. Ergibt es 0, wird nichts erfasst. 800 − 1000 = −200: die Akontorechnung wird auf 300 verringert, es zählen 800 ✓.
- **Kurze Zeilen:** `invoices_upload_deducted` und `invoices_beleg_deducted` (de) sind wörtlich wie in #455 6.1 und V-2 beschlossen. «Akontorechnungen» statt «bereits bezahlte Beträge» und «abgezogen» entsprechen Punkt 6.3.
- **Akonto-Hinweis** `invoices_upload_advance_invoice`: de ist wörtlich wie in #482. Die Begriffe in fr/it/en entsprechen i18n-begriffe.md: facture d’acompte / fattura d’acconto / advance invoice (Z. 44), facture finale / fattura finale / final invoice (Z. 45), émetteur de la facture / emittente della fattura / invoice issuer (Z. 49).
- **fr/it/en der Regeln:** Abrechnungsperiode = période de décompte / periodo di conteggio / billing period (Z. 71). Leistungszeitraum = période de prestation / periodo di prestazione / service period (Z. 74). berichtigen = rectifier / rettificare / correct (Z. 82). abgerechnet = décomptée / conteggiata / in a statement (Z. 55). löschen = supprimer / eliminare / delete (Z. 120). Die zitierten Knöpfe stimmen mit `invoices_delete` und `invoices_upload_remove` überein. Die französischen Guillemets haben innen einen geschützten Leerschlag (U+00A0).
- **`invoices_service_period_years`:** de ist wörtlich wie in #455 Punkt 2 beschlossen, fr/it/en sind sinngleich. Die Rechnung aus Runde 1 (183.47) gilt weiter.
- **«In Abrechnungen enthalten»:** de/fr/it/en «In Abrechnungen enthalten» / «Contenue dans les décomptes» / «Contenuta nei conteggi» / «In statements». Feminin passt zu facture/fattura, «Aucun» / «Nessuno» zu décompte/conteggio (m.). en `invoices_billed_title` und `invoices_beleg_billed` sind wörtlich wie beschlossen. Die i18n-Zeile «abgerechnet» ist auf «in a statement» geändert.
- **Dateiauswahl:** «Dateien auswählen» / «Datei auswählen» / «Keine Datei ausgewählt», dazu fr «Choisir …», it im Infinitiv «Scegliere …», en «Choose …». Das folgt der Knopfregel (i18n-begriffe.md:5) und der Regel «Datei vor dem Speichern».
- **Prompt** (llm.ts:268): «invoice» umfasst die Schlussrechnung, «advance_invoice» ist mit der Glossardefinition beschrieben («Teilrechnung über einen Vorschuss», UBIQUITOUS_LANGUAGE.md:81), dazu kommt das Ratenbeispiel. `DOCUMENT_TYPES` und `Extraction` sind ergänzt. Eine Akontorechnung ist nicht vorausgewählt (`preselected`). Ist sie angehakt, erscheinen die To-dos (`toDoOf`), und die Szenarien «nicht zum Erstellen ausgewählt» und «Eine ausgewählte Akontorechnung erstellen» decken beide Fälle ab. Das entspricht #455 Punkt 4 und Art. 257b Abs. 1 OR (keine doppelte Zählung).
- **Vorgeschlagener Verteilschlüssel:** Er folgt dem Entscheid vom 2026-10-19 («when the building already has an invoice of the same Kategorie, … proposes that invoice's Verteilschlüssel, as long as the landlord has not changed the key himself»). Die Abfrage filtert nach `buildingId` und `categoryId` und sortiert nach `invoiceDate desc, createdAt desc` (invoice.service.ts:157), liefert also die neueste Rechnung. `proposeKey` überschreibt nur, solange der Wert dem zuletzt vorgeschlagenen entspricht, also nichts, was der Liegenschaftsverwalter selbst gewählt hat. Wechselt das Gebäude, wird pro Gebäude neu gefragt: Der Cache-Schlüssel enthält `buildingId`, und der `$effect` liest es mit.
- **Glossarzeile «Schlussrechnung (eines Rechnungsstellers)»:** Wortlaut wie in #483 beschlossen (mein Vorschlag aus Runde 1). Sie passt zu den Texten: Erfasst wird das Total vor dem Abzug, ohne die schon abgerechneten Akontorechnungen, so wie es die kurze Zeile nach V-2 sagt. Die i18n-Zeile (Z. 45) ist wie beschlossen.

## Fehlende Begriffe
Keine neuen.

## Nicht bestätigt
- **Prompt-Verhalten bei Akontorechnungen** (V-4): `llm:eval` hat keine Fälle für die Auslesung. Die 45/47 für die Umlagefähigkeit vorher und nachher sagen nichts darüber, ob eine Akontorechnung als `advance_invoice` erkannt wird, ob eine Schlussrechnung `invoice` bleibt und ob eine Ratenrechnung nicht als Akontorechnung gilt. Gesucht: Auftrag des Aufrufers, `backend/src/config/llm.ts`. Nicht ausgeführt, das Review ist nur lesend.
- **fr «facture finale» / it «fattura finale»** als übliche Wörter der Werke in der Romandie und im Tessin: Es gibt keine Fedlex-Quelle. Der Product Owner hat sie in #483 beschlossen. Eine Prüfung durch Muttersprachler (wie #342) steht noch aus.
- **Häufigkeit von Schlussrechnungen mit Restbetrag 0** (Gewicht von V-12): Das stammt nur aus der Praxis, eine Quelle habe ich nicht gesucht.
- **Art. 257b Abs. 1 OR:** Wortlaut aus Runde 1 (Fedlex), in dieser Runde nur über `mmx search` gegengelesen (Sekundärquellen Mobiliar und Mieterverband zitieren ihn gleich), Fedlex nicht neu abgerufen.
