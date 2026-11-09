# Fachreview 1410-1 (Commit 1453945b, Szenarien am Ende von tests/e2e/features/invoice-detail.feature)

Entscheide des PO (via Koordinator) berücksichtigt: Q1 nur Rechnungen (Entwurf ohne Hinweis, Text 3 entfällt), Q2 eine Aufgabe je Gebäude und Abrechnungsperiode mit «Behalten».

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Art. 958f OR allein als Grund ist für den privaten Vermieter falsch: Er ist in der Regel nicht buchführungspflichtig. Der Text muss die Grundlage einschränken und für Privatpersonen das Steuerrecht nennen (Art. 152 DBG). |
| V-1 | Verwalter | Major | Bei Juli–Juni und November–Oktober (und bei einer Rechnung, die nach dem Ende ihres Leistungszeitraums gestellt wurde) liefert die geplante Regel ein Aufbewahrungsdatum, das vor dem gesetzlichen liegt. |
| V-2 | Verwalter | Major | Die Aufgabe «können gelöscht werden» schliesst Rechnungen für wertvermehrende Investitionen mit ein. Diese braucht der Vermieter bis zum Verkauf (Grundstückgewinnsteuer, StHG Art. 12 Abs. 1). |
| V-3 | Verwalter | Major | Löscht der Vermieter nach 10 Jahren abgerechnete Rechnungen, werden alte Abrechnungen «nicht aktuell». Dann erscheinen Aufgaben «Abrechnung berichtigen», und `invoices_delete_billed_text` verlangt eine Berichtigung. |
| V-4 | Verwalter | Minor | Welche Rechnungen zur Aufgabe gehören, ist offen. Der verlinkte Filter (Regel 1, Überlappung mit dem Leistungszeitraum, `backend/src/services/invoice.service.ts:581`) zeigt auch Rechnungen, die noch aufbewahrt werden müssen. Fix: Die Aufgabe zählt nur Rechnungen, deren Frist abgelaufen ist, und endet, wenn diese gelöscht sind. Der Text unten sagt, dass Dwello beim Löschen warnt. |
| V-5 | Verwalter | Minor | Szenarien fehlen für die Übersichtsaufgabe, für «Behalten», für ein Gebäude mit Juli–Juni und für den Grenztag (am Tag «aufbewahren bis» selbst wird noch gewarnt, ab dem Tag danach nicht mehr). Fix: Examples oder Szenarien ergänzen. |

## M-1 (Major): Rechtsgrundlage im Hinweis

**Beleg:** Der Platzhalter `invoice-detail.feature:225` nennt nur «Art. 958f OR». Der bestehende Text `messages/de.json` `privacy_retention_2` beschränkt diesen Artikel schon heute auf Buchführungspflichtige.

**Fedlex, OR (SR 220), Stand 01.10.2026:**
- Art. 957 Abs. 1: «Der Pflicht zur Buchführung und Rechnungslegung gemäss den nachfolgenden Bestimmungen unterliegen: 1. Einzelunternehmen und Personengesellschaften, die einen Umsatzerlös von mindestens 500 000 Franken im letzten Geschäftsjahr erzielt haben; 2. juristische Personen.»
- Art. 958f Abs. 1: «Die Geschäftsbücher und die Buchungsbelege sowie der Geschäftsbericht und der Revisionsbericht sind während zehn Jahren aufzubewahren. Die Aufbewahrungsfrist beginnt mit dem Ablauf des Geschäftsjahres.»

**Fedlex, DBG (SR 642.11), Stand 02.09.2026:**
- Art. 126 Abs. 3: «Natürliche Personen mit Einkommen aus selbständiger Erwerbstätigkeit und juristische Personen müssen […] sonstige Belege, die mit ihrer Tätigkeit in Zusammenhang stehen, während zehn Jahren aufbewahren.»
- Art. 152 Abs. 1: «Das Recht, ein Nachsteuerverfahren einzuleiten, erlischt zehn Jahre nach Ablauf der Steuerperiode, für die eine Veranlagung zu Unrecht unterblieben oder eine rechtskräftige Veranlagung unvollständig ist.»
- Art. 40 Abs. 1: «Als Steuerperiode gilt das Kalenderjahr.»

**Warum falsch:** Ein privater Vermieter, der sein Privatvermögen verwaltet, fällt weder unter Art. 957 OR noch unter Art. 126 Abs. 3 DBG. Ein Hinweis, der nur Art. 958f OR nennt, behauptet für ihn eine Pflicht, die er nicht hat. Trotzdem gibt es einen sachlichen Grund für 10 Jahre: Seine Abzüge für Unterhaltskosten belegt er mit den Rechnungen, und ein Nachsteuerverfahren ist bis 10 Jahre nach Ende der Steuerperiode möglich.

Die Belegeinsicht des Mieters (Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.») trägt keine 10 Jahre. Forderungen aus der Abrechnung verjähren nach 5 Jahren (Art. 128 Ziff. 1 OR), also innerhalb der 10 Jahre. Darum steht sie nicht im Hinweis.

**Fix:** Den Text `invoices_delete_retention` unten übernehmen. Er nennt das Datum und Art. 958f OR (Entscheid PO), dazu Art. 152 DBG für Privatpersonen. Er spricht von der Originalrechnung, denn Löschen in Dwello vernichtet das Original nicht; das passt zum Glossar, Zeile «Beleg».

## V-1 (Major): Datum «aufbewahren bis»

**Beleg:** Die geplante Regel ist: Ende der Abrechnungsperiode, die das Ende des Leistungszeitraums enthält (ohne Leistungszeitraum: das Rechnungsdatum), plus 10 Jahre. Die gesetzlichen Fristen laufen ab dem Ende des Geschäftsjahres (Art. 958f OR) bzw. der Steuerperiode, also des Kalenderjahres (Art. 40 und 152 DBG). Mit der Abrechnungsperiode haben beide nichts zu tun.

**Nachgerechnet:**

| Fall | Geplant | Gesetzlich (Kalenderjahr) | Vorschlag |
|---|---|---|---|
| Kalenderjahr, Rechnungsdatum 31.03.2024 | 31.12.2034 | 31.12.2034 | 31.12.2034 (Szenario stimmt) |
| Kalenderjahr, 30.06.2015 | 31.12.2025, abgelaufen | 31.12.2025 | 31.12.2025, abgelaufen (Szenario stimmt) |
| Juli–Juni, 31.03.2024 | **30.06.2034** | 31.12.2034 | 31.12.2034 |
| November–Oktober, 15.10.2024 | **31.10.2034** | 31.12.2034 | 31.12.2034 |
| November–Oktober, 15.11.2023 | 31.10.2034 | 31.12.2033 | 31.12.2034 (später, unschädlich) |
| Kalenderjahr, Leistungszeitraum 01.01.–31.12.2024, Rechnungsdatum 20.02.2025 | **31.12.2034** | Beleg und Abzug des Jahres 2025: 31.12.2035 | 31.12.2035 |
| Leistungszeitraum 01.10.2014–30.09.2015, Kalenderjahr | 31.12.2025 | 31.12.2025 | 31.12.2025 (die spätere Periode zählt, wie geplant) |

**Warum falsch:** Das Datum erscheint als gesetzliches Datum. Es liegt bis zu 6 Monate (Juli–Juni) bzw. 2 Monate (November–Oktober) zu früh, bei einer nachträglich gestellten Rechnung um ein Jahr. Die Übersicht meldet dann «können gelöscht werden», bevor die Frist abgelaufen ist.

**Fix (Regel):**
- Der Stichtag ist das spätere Datum von Rechnungsdatum und Ende des Leistungszeitraums.
- Aufbewahren bis zum 31.12. des Jahres, in dem die Abrechnungsperiode des Gebäudes endet, die den Stichtag enthält, plus 10 Jahre.
- Für Kalenderjahr-Gebäude ändert sich nichts. Alle Rechnungen einer Abrechnungsperiode haben weiterhin dasselbe Datum, die Aufgabe je Gebäude und Abrechnungsperiode (Q2) bleibt also möglich. Die Frist wird nie kürzer als «10 Jahre ab Ende der Periode», der Entscheid des PO bleibt also erfüllt.
- Falls der PO mit «Periode» ausdrücklich das Ende der Abrechnungsperiode ohne Aufrunden gemeint hat, muss er neu entscheiden.

## V-2 (Major): Wertvermehrende Investitionen

**Beleg:** «Wertvermehrende Investitionen» ist eine vordefinierte Kategorie (`UBIQUITOUS_LANGUAGE.md:115`).

**Fedlex, StHG (SR 642.14), Stand heute:** Art. 12 Abs. 1: «Der Grundstückgewinnsteuer unterliegen Gewinne, die sich bei Veräusserung eines Grundstückes des Privatvermögens […] ergeben, soweit der Erlös die Anlagekosten (Erwerbspreis oder Ersatzwert zuzüglich Aufwendungen) übersteigt.»

**Warum falsch:**
- Ohne Rechnung kann der Vermieter die Aufwendungen beim Verkauf nicht belegen und zahlt dann mehr Grundstückgewinnsteuer.
- Auch eine Mietzinserhöhung wegen Mehrleistungen (Art. 269a lit. b OR: «durch Kostensteigerungen oder Mehrleistungen des Vermieters begründet sind») muss er belegen.
- Ein Treuhänder bewahrt diese Rechnungen bis zum Verkauf auf.

**Fix:**
- Die Aufgabe zählt Rechnungen dieser Kategorie nicht mit.
- Die Löschbestätigung zeigt bei dieser Kategorie immer `invoices_delete_retention_investment`, auch nach Ablauf der 10 Jahre.

## V-3 (Major): Folgen des Löschens für alte Abrechnungen

**Beleg:**
- `UBIQUITOUS_LANGUAGE.md:206` «Nicht aktuelle Abrechnung»: Rechnungen, die seit dem Erstellen «gelöscht […] wurden», machen eine Abrechnung nicht aktuell.
- `backend/src/services/statement-invoices.service.ts:277-283` (`outdatedStatements`, `correctionDue`) erzeugt daraus die Aufgabe «Abrechnung berichtigen», ergänzt um `dashboard_task_correct_old`.
- `messages/de.json:1113` `invoices_delete_billed_text` sagt: «Versendete oder bezahlte Abrechnungen berichtigen Sie mit «Abrechnung berichtigen»».

**Warum falsch:** Die neue Aufgabe führt den Vermieter dazu, die Rechnungen einer Periode zu löschen, die 10 Jahre zurückliegt. Diese Rechnungen sind fast alle abgerechnet. Jede Löschung erzeugt dann für alle Abrechnungen dieser Periode eine Aufgabe «Abrechnung berichtigen». Eine Abrechnung, die 10 Jahre zurückliegt, berichtigt kein Verwalter; die Forderungen sind verjährt (Art. 128 Ziff. 1 OR). Wer aufräumt, ändert keine Kosten.

**Fix (braucht einen Entscheid des PO, denn der Glossarbegriff ändert sich):**
- Eine gelöschte Rechnung, deren Frist abgelaufen ist, zählt nicht als Änderung im Sinn von «nicht aktuell».
- Die Löschbestätigung solcher Rechnungen zeigt `invoices_delete_billed_text` nicht.
- Issue mit `domain` und `needs-decision`.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| invoices_delete_retention | Bewahren Sie die Originalrechnung bis zum {date} auf, auf Papier oder als Datei. Wer zur Buchführung verpflichtet ist, muss Buchungsbelege 10 Jahre ab Ende des Geschäftsjahres aufbewahren (Art. 958f OR). Auch als Privatperson brauchen Sie die Rechnung bis dann: Die Steuerbehörde kann bis 10 Jahre nach Ende der Steuerperiode ein Nachsteuerverfahren einleiten (Art. 152 DBG). | Conservez la facture originale jusqu’au {date}, sur papier ou sous forme de fichier. Quiconque est tenu de tenir une comptabilité doit conserver les pièces comptables pendant 10 ans à compter de la fin de l’exercice (art. 958f CO). En tant que particulier, vous en avez aussi besoin jusqu’à cette date : l’autorité fiscale peut introduire une procédure de rappel d’impôt jusqu’à 10 ans après la fin de la période fiscale (art. 152 LIFD). | Conservi la fattura originale fino al {date}, su carta o come file. Chi è tenuto alla contabilità deve conservare i documenti contabili per 10 anni dalla fine dell’esercizio (art. 958f CO). Anche come privato le serve fino ad allora: l’autorità fiscale può avviare una procedura di ricupero d’imposta fino a 10 anni dopo la fine del periodo fiscale (art. 152 LIFD). | Keep the original invoice until {date}, on paper or as a file. Anyone required to keep accounts must keep accounting vouchers for 10 years from the end of the financial year (Art. 958f CO). As a private person you also need it until then: the tax authority can open back-tax proceedings up to 10 years after the end of the tax period (Art. 152 DBG). |
| invoices_delete_retention_investment | Rechnungen für wertvermehrende Investitionen bewahren Sie auf, bis Sie das Gebäude verkaufen: Sie belegen die Anlagekosten bei der Grundstückgewinnsteuer. | Conservez les factures d’investissements créant une plus-value jusqu’à la vente de l’immeuble : elles justifient les dépenses d’investissement pour l’impôt sur les gains immobiliers. | Conservi le fatture per investimenti che aumentano il valore fino alla vendita dell’immobile: comprovano i costi d’investimento per l’imposta sugli utili da sostanza immobiliare. | Keep invoices for value-enhancing investments until you sell the building: they prove the investment costs for the property gains tax. |
| dashboard_task_retention | Rechnungen {period} von {building} können gelöscht werden | Les factures {period} de {building} peuvent être supprimées | Le fatture {period} di {building} possono essere eliminate | Invoices for {period} of {building} can be deleted |
| dashboard_task_retention_text_one | Die Aufbewahrungsfrist von {count} Rechnung dieser Abrechnungsperiode endete am {date}. Löschen Sie, was Sie nicht mehr brauchen. Rechnungen für wertvermehrende Investitionen zählt Dwello hier nicht: Behalten Sie sie, bis Sie das Gebäude verkaufen. Muss eine Rechnung der Liste länger aufbewahrt werden, nennt Dwello das beim Löschen. | Le délai de conservation de {count} facture de cette période de décompte a pris fin le {date}. Supprimez ce dont vous n’avez plus besoin. Dwello ne compte pas ici les factures d’investissements créant une plus-value : conservez-les jusqu’à la vente de l’immeuble. Si une facture de la liste doit être conservée plus longtemps, Dwello vous l’indique lors de la suppression. | Il termine di conservazione di {count} fattura di questo periodo di conteggio è scaduto il {date}. Elimini ciò che non le serve più. Dwello non conta qui le fatture per investimenti che aumentano il valore: le conservi fino alla vendita dell’immobile. Se una fattura dell’elenco va conservata più a lungo, Dwello lo indica al momento dell’eliminazione. | The retention period of {count} invoice of this billing period ended on {date}. Delete what you no longer need. Dwello does not count invoices for value-enhancing investments here: keep them until you sell the building. If an invoice in the list must be kept longer, Dwello tells you when you delete it. |
| dashboard_task_retention_text_many | Die Aufbewahrungsfrist von {count} Rechnungen dieser Abrechnungsperiode endete am {date}. Löschen Sie, was Sie nicht mehr brauchen. Rechnungen für wertvermehrende Investitionen zählt Dwello hier nicht: Behalten Sie sie, bis Sie das Gebäude verkaufen. Muss eine Rechnung der Liste länger aufbewahrt werden, nennt Dwello das beim Löschen. | Le délai de conservation de {count} factures de cette période de décompte a pris fin le {date}. Supprimez ce dont vous n’avez plus besoin. Dwello ne compte pas ici les factures d’investissements créant une plus-value : conservez-les jusqu’à la vente de l’immeuble. Si une facture de la liste doit être conservée plus longtemps, Dwello vous l’indique lors de la suppression. | Il termine di conservazione di {count} fatture di questo periodo di conteggio è scaduto il {date}. Elimini ciò che non le serve più. Dwello non conta qui le fatture per investimenti che aumentano il valore: le conservi fino alla vendita dell’immobile. Se una fattura dell’elenco va conservata più a lungo, Dwello lo indica al momento dell’eliminazione. | The retention period of {count} invoices of this billing period ended on {date}. Delete what you no longer need. Dwello does not count invoices for value-enhancing investments here: keep them until you sell the building. If an invoice in the list must be kept longer, Dwello tells you when you delete it. |
| dashboard_task_retention_action | Rechnungen ansehen | Voir les factures | Vedere le fatture | View invoices |
| dashboard_task_retention_keep | Behalten | Conserver | Conservare | Keep |
| dashboard_task_retention_kept | Sie behalten die Rechnungen {period} von {building}. Dwello nennt sie in der Übersicht nicht mehr. | Vous conservez les factures {period} de {building}. Dwello ne les mentionne plus dans la vue d’ensemble. | Conserva le fatture {period} di {building}. Dwello non le indica più nella panoramica. | You are keeping the invoices for {period} of {building}. Dwello no longer lists them in the overview. |

Platzhalter im Szenario (`invoice-detail.feature:225`): der de-Text von `invoices_delete_retention` mit {date} = 31.12.2034.

## Fehlende Begriffe (Issue mit `domain`, `needs-decision`)

- **Aufbewahrungsfrist (Rechnung):** Datum, bis zu dem der Liegenschaftsverwalter eine Rechnung aufbewahrt: der 31.12. des Jahres, in dem die Abrechnungsperiode des Gebäudes endet, die das spätere Datum von Rechnungsdatum und Ende des Leistungszeitraums enthält, plus 10 Jahre (Art. 958f OR; Art. 152 DBG). Löschen bleibt möglich, Dwello nennt dabei das Datum. Rechnungen für wertvermehrende Investitionen bewahrt er bis zum Verkauf des Gebäudes auf. Übersetzung: fr délai de conservation, it termine di conservazione, en retention period.
- **Behalten (Rechnungen einer Abrechnungsperiode):** Entscheid des Liegenschaftsverwalters, die Rechnungen einer Abrechnungsperiode eines Gebäudes nach Ablauf der Aufbewahrungsfrist zu behalten. Die Aufgabe in der Übersicht entfällt, Dwello löscht nichts (wie «Dokumente geprüft»).

## Nicht bestätigt

- Ob Unterhaltskosten im Jahr des Rechnungsdatums oder der Zahlung abgezogen werden, regeln die Kantone und die Praxis (Fälligkeits- bzw. Zahlungsprinzip). Auf Fedlex nicht gefunden; der Fall «Rechnungsdatum nach Leistungszeitraum» in V-1 beruht nur auf Art. 40 DBG und ist **unsicher**. Geschaut habe ich nur im DBG.
- Ob ein Beleg in Dwello als elektronische Aufbewahrung nach Art. 958f Abs. 3 OR und GeBüV genügt, habe ich nicht geprüft (GeBüV nicht geholt). Darum nennt der Text die Originalrechnung «auf Papier oder als Datei» und sagt nicht, dass Dwello genügt.
- Die fr/it-Begriffe des StHG («impôt sur les gains immobiliers», «dépenses d’investissement», «imposta sugli utili da sostanza immobiliare», «costi d’investimento») habe ich nicht auf Fedlex FRA/ITA nachgelesen, nur die deutsche Fassung. Für DBG Art. 152 sind «rappel d’impôt», «période fiscale», «ricupero d’imposta» und «periodo fiscale» auf Fedlex FRA/ITA bestätigt.
- Ob ein Mietzinsstreit (Art. 269 ff. OR, Renditeberechnung) im Einzelfall länger als 10 Jahre Belege verlangt, bleibt offen; das gibt nur Art. 269a lit. b OR (wörtlich oben).

Geprüft: PO-Entscheid Q1 (ein Entwurf ist kein Buchungsbeleg und wurde nicht versandt, ohne Hinweis richtig), Q2 (Aufgabe je Gebäude und Abrechnungsperiode mit «Behalten» ist fachlich sinnvoll, siehe V-2 und V-4), Szenario 2 (Text `invoices_delete_text` unverändert; 31.12.2025 liegt vor dem 09.11.2026), spätere Periode bei einem Leistungszeitraum über zwei Perioden, Begriffe Rechnung, Rechnungsdatum, Leistungszeitraum, Abrechnungsperiode, Übersicht und Beleg (Glossar, i18n-begriffe).
