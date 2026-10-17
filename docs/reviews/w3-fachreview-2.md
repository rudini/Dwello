# Fach-Review 2: #250, #254 (Delta 47babc0..c42b1fb, messages/*)

Gegenstand: Worktree `review-w3-fach2`, Commit c42b1fb, `git diff 47babc0 c42b1fb -- messages/` (de, fr, it, en): `glossary_period_text`, `invoices_service_period_help`, `invoices_service_period_years`, `invoices_service_period_boiler`. Am Rand angesehen: `docs/nebenkostenabrechnung-anforderungen.md` (Regel 1), `src/routes/invoices/InvoiceDataFields.svelte:83-87`, `src/routes/help/+page.svelte:28-35`.

Ergebnis: keine Blocker, keine Major. Die neuen Formulierungen stimmen fachlich, die Zahlen gehen auf, und die vier Sprachen sagen dasselbe. Offen ist ein Minor: Der Absatz zum Boiler braucht einen Grund für «umstritten». Ohne ihn liest sich der Text so, als widerspreche er Art. 5 Absatz 2 Bst. e VMWG (Weber P-3). Der Entscheid in #254 bleibt dabei unverändert. Der korrigierte Text in allen vier Sprachen steht unten.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Minor | `invoices_service_period_boiler`: «umstritten» ohne Grund. Bst. e nennt «der Boiler» wörtlich, deshalb wirkt der Satz zum Wohnungsboiler wie ein Widerspruch zur Verordnung. Der Grund steht in Art. 5 Abs. 1 VMWG (nur die zentrale Anlage) und Art. 256 Abs. 1 OR (Unterhalt durch den Vermieter). |
| V-1 | Verwalter | Nit | `glossary_period_text`: «Mit Leistungszeitraum zählen dessen Tage in der Abrechnungsperiode» ist richtig, sagt aber nicht, dass es um den Teil des Betrags geht. «dessen» ist schwer zu lesen. |
| V-2 | Verwalter | Nit | Helga fragt «Boiler im Keller: ist das zentral?». Der Text erklärt «zentrale Warmwasseranlage» nicht. Ein Einschub wie bei M-1 genügt. |
| V-3 | Verwalter | Nit | en: «boiler» meint im Englischen meist den Heizkessel. Für den Warmwasserspeicher passt «water heater». |
| V-4 | Verwalter | Nit | fr/it: Fedlex sagt «chauffe-eau» bzw. «bollitore», der Text sagt «boiler». In der Romandie und im Tessin ist das üblich und zulässig. Den Begriff am besten einmal neben das Wort aus der Verordnung stellen. |
| V-5 | Verwalter | Nit | fr/it, erster Satz von `invoices_service_period_years`: Die Satzstellung mit vorangestelltem Objekt («Les frais qui …, répartissez-les», «I costi che … li ripartisca») ist korrekt, aber schwerfällig. |
| V-6 | Verwalter | Nit | `docs/nebenkostenabrechnung-anforderungen.md:141` sagt noch «am Tag der Arbeit und endet am Tag vor der nächsten» und «Entkalken des Boilers». Die UI wurde geändert, das Dokument nicht. |

## Befunde

### M-1 (Minor): Grund für «umstritten» beim Wohnungsboiler

- Beleg: `messages/de.json:723`: «Das Entkalken der zentralen Warmwasseranlage ist umlagefähig (Art. 5 Absatz 2 Bst. e VMWG), wenn … Bei einem Boiler in der Wohnung ist das umstritten: …». Weber P-3, Helga P-3 («wer streitet da?»).
- Fedlex, Art. 5 Abs. 2 Bst. e VMWG (SR 221.213.11): «die periodische Revision der Heizungsanlage einschliesslich des Öltanks sowie das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes;». Weber hat also recht: Bst. e nennt «der Boiler».
- Fedlex, Art. 5 Abs. 1 VMWG: «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» Abs. 2 beginnt mit «Darunter fallen insbesondere …» und bezieht sich damit auf Abs. 1. Die Boiler in Bst. e sind folglich die Boiler der zentralen Anlage. fr: «l’installation générale de préparation d’eau chaude» / Bst. e «des chauffe-eau»; it: «dell’impianto centrale di produzione dell’acqua calda» / Bst. e «del bollitore».
- Fedlex, Art. 256 Abs. 1 OR: «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.» Abs. 2: «Abweichende Vereinbarungen zum Nachteil des Mieters sind nichtig, wenn sie enthalten sind in: … b. Mietverträgen über Wohn- oder Geschäftsräume.»
- Fedlex, Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Praxis (keine Gesetzesquelle, aus Runde 1): Mieterverband: «Nach Ansicht des Mieterinnen- und Mieterverbands handelt es sich bei der Entkalkung des Wohnungsboilers hingegen um eine Unterhaltsarbeit.» Das Merkblatt des Mieterverbands von 2026 («Zulässige und unzulässige Nebenkosten», S. 1) nennt unter «Zulässige Warmwasserkosten» «Entkalkung von Boiler und Leitungen» und «periodischer Boilerservice alle 3 bis 5 Jahre», ohne zwischen zentralem Boiler und Wohnungsboiler zu unterscheiden.
- Warum ungenau: Die Aussage selbst (umstritten, nur bei ausdrücklicher Nennung, im Zweifel nicht) ist vorsichtig und entspricht #254. Wer aber Bst. e nachschlägt, findet dort «der Boiler» und kann nicht erkennen, warum der Wohnungsboiler anders behandelt wird. Der Grund ist zweistufig: Art. 5 VMWG erfasst nur die zentrale Anlage (Abs. 1). Für einen Boiler in der Wohnung bleibt offen, ob das Entkalken Nebenkosten im Sinne von Art. 257a–257b OR sind oder Unterhalt nach Art. 256 Abs. 1 OR, den eine Klausel im Wohnungsmietvertrag nicht auf den Mieter abwälzen kann (Art. 256 Abs. 2 Bst. b OR). Ein Satz mit diesem Grund beseitigt den scheinbaren Widerspruch und beantwortet Helgas Frage. Am Entscheid des Product Owners ändert er nichts.
- Korrektur (`invoices_service_period_boiler`):
  - de: «Das Entkalken der zentralen Warmwasseranlage (eine Anlage für das ganze Gebäude) und ihrer Boiler ist umlagefähig (Art. 5 Absatz 2 Bst. e VMWG), wenn der Mietvertrag Warmwasserkosten als Nebenkosten nennt. Ein Boiler in der Wohnung ist keine zentrale Anlage. Ob sein Entkalken zu den Nebenkosten gehört oder zur Pflicht des Vermieters, die Wohnung in gebrauchstauglichem Zustand zu erhalten (Art. 256 Absatz 1 OR), ist deshalb umstritten. Verrechnen Sie es nur, wenn der Mietvertrag das Entkalken des Boilers ausdrücklich als Nebenkosten nennt. Im Zweifel ist es nicht umlagefähig.»
  - fr: «Le détartrage de l’installation centrale d’eau chaude (une installation pour tout l’immeuble) et de ses chauffe-eau est imputable (art. 5, al. 2, let. e, OBLF) si le contrat de bail mentionne les frais d’eau chaude comme frais accessoires. Un boiler dans l’appartement n’est pas une installation centrale. La question de savoir si son détartrage fait partie des frais accessoires ou de l’obligation du bailleur d’entretenir l’appartement dans un état approprié à l’usage (art. 256, al. 1, CO) est donc controversée. Facturez-le seulement si le contrat de bail mentionne expressément le détartrage du boiler comme frais accessoires. En cas de doute, il n’est pas imputable.»
  - it: «La decalcificazione dell’impianto centrale dell’acqua calda (un impianto per tutto l’immobile) e dei suoi bollitori è addebitabile (art. 5 cpv. 2 lett. e OLAL) se il contratto di locazione indica i costi dell’acqua calda come spese accessorie. Un boiler nell’appartamento non è un impianto centrale. È quindi controverso se la sua decalcificazione rientri nelle spese accessorie o nell’obbligo del locatore di mantenere l’appartamento in stato idoneo all’uso (art. 256 cpv. 1 CO). La addebiti solo se il contratto di locazione indica espressamente la decalcificazione del boiler come spesa accessoria. Nel dubbio non è addebitabile.»
  - en: «Descaling the central hot water system (one system for the whole building) and its water heaters is allocable (Art. 5 para. 2 let. e VMWG) if the rental contract names hot water costs as utility costs. A water heater inside the apartment is not a central system. Whether descaling it is a utility cost or part of the landlord’s duty to keep the apartment fit for use (Art. 256 para. 1 CO) is therefore disputed. Charge it only if the rental contract expressly names descaling the water heater as a utility cost. If in doubt, it is not allocable.»
  - Die Wendungen zu Art. 256 OR sind aus `categories_reason_repairs` bzw. `categories_reason_renovation` übernommen (`messages/*.json:1198`, `:1203`). «Unterhalt» steht nicht in `UBIQUITOUS_LANGUAGE.md`, deshalb habe ich es umschrieben. Neue Domänenbegriffe kommen keine hinzu.
  - Länge (Helga P-2): ein Satz mehr. Ist das am Feld zu lang, kann der Absatz dort kürzer bleiben («… ist umstritten, siehe Hilfe»), und die volle Fassung steht auf der Hilfeseite. Das entscheidet das Design, nicht die Fachlichkeit.

### V-1 (Nit): Glossar «Abrechnungsperiode»

- Beleg: `messages/de.json:86`: «Mit Leistungszeitraum zählen dessen Tage in der Abrechnungsperiode.»
- Quelle: Anforderungen Regel 1 (`docs/nebenkostenabrechnung-anforderungen.md:141`): «Mit Leistungszeitraum zählt vom Betrag nur der Teil, der nach Tagen in die Periode fällt.» `UBIQUITOUS_LANGUAGE.md:158` («Abgerechnete Tage»: «mit Leistungszeitraum dessen Tage innerhalb der Abrechnungsperiode»). Der Satz in der UI ist also inhaltlich richtig, und Weber P-1 und Helga P-4 sind damit behoben.
- Warum: «es zählen Tage» lässt offen, was gezählt wird. Gemeint ist der Teil des Betrags. «dessen» bremst Helga.
- Korrektur:
  - de: «Mit Leistungszeitraum zählt nur der Teil des Betrags, der auf die Tage in der Abrechnungsperiode fällt.»
  - fr: «Avec une période de prestation, seule compte la part du montant qui correspond aux jours compris dans la période de décompte.»
  - it: «Con un periodo di prestazione conta solo la parte dell’importo che corrisponde ai giorni compresi nel periodo di conteggio.»
  - en: «With a service period, only the part of the amount for its days within the billing period counts.»
- Helga P-4 vermisst ausserdem einen eigenen Glossar-Eintrag «Leistungszeitraum». Dafür gibt es eine Vorlage in `UBIQUITOUS_LANGUAGE.md:64` («Zeitraum, für den eine Rechnung gilt»): «Die Zeit, für die eine Rechnung gilt, zum Beispiel ein Quartal. Die Abrechnung zählt dann nur die Tage, die in die Abrechnungsperiode fallen.» Das ist optional und ausserhalb des Deltas.

### V-2 (Nit): «zentral» für Laien

- Beleg: Helga, «Verwirrung»: «Bei mir steht der Boiler im Keller. Ist das zentral?»
- Korrektur: Der Einschub «(eine Anlage für das ganze Gebäude)» aus M-1 löst das. Steht der Boiler im Keller und versorgt er alle Wohnungen, ist er zentral, unabhängig vom Standort.

### V-3 (Nit): en «boiler»

- Beleg: `messages/en.json:722-723` «the boiler of the central hot water system», «a boiler inside the apartment».
- Warum: Im britischen Englisch ist ein «boiler» meist der Heizkessel. Der Warmwasserspeicher heisst «water heater» oder «hot water cylinder». Als Wort aus der Schweizer Alltagssprache bleibt «boiler» verständlich, ist aber mehrdeutig.
- Korrektur: in `invoices_service_period_years` «the water heater of the central hot water system is descaled …», in `_boiler` wie bei M-1 (en). `i18n-begriffe.md` hat für diesen Begriff keine Zeile. Er ist kein Domänenbegriff, ein Issue braucht es nicht.

### V-4 (Nit): fr/it «boiler» und der Wortlaut der Verordnung

- Fedlex fr Bst. e: «le détartrage de l’installation d’eau chaude, des chauffe-eau et des conduites». it: «la decalcificazione dell’impianto di produzione dell’acqua calda, del bollitore e delle condutture».
- «boiler» ist in der Westschweiz und im Tessin gebräuchlich (**unsicher**, keine amtliche Quelle, Sprachgebrauch). Der Text kann so bleiben. Die Fassung bei M-1 nennt im Satz mit dem Zitat den Begriff der Verordnung («chauffe-eau», «bollitori»), damit stimmt der Text mit dem nachgeschlagenen Wortlaut überein.

### V-5 (Nit): fr/it, erster Satz

- Beleg: fr «Les frais qui ne reviennent qu’à intervalles de plusieurs années, répartissez-les sur ces années avec la période de prestation.» it «I costi che si presentano solo a intervalli di alcuni anni li ripartisca su questi anni con il periodo di prestazione.» Inhaltlich gleich wie de, C-4 ist behoben.
- Vorschlag (optional, gerader Satzbau): fr «Avec la période de prestation, vous répartissez sur ces années les frais qui ne reviennent qu’à intervalles de plusieurs années.» it «Con il periodo di prestazione ripartisce su questi anni i costi che si presentano solo a intervalli di alcuni anni.» Die E2E-Szenarien prüfen nur den deutschen Satz, die Änderung berührt also keinen Test.
- Kleinigkeit en: «contain their part by themselves» liest sich leichter als «include their part automatically».

### V-6 (Nit): Anforderungsdokument

- Beleg: `docs/nebenkostenabrechnung-anforderungen.md:141`: «der Leistungszeitraum beginnt am Tag der Arbeit und endet am Tag vor der nächsten (Entkalken des Boilers 01.04.2026 – 31.03.2031 …)».
- Korrektur: «… beginnt am Tag, an dem die Arbeit gemacht wird, und endet am Tag, bevor sie das nächste Mal gemacht wird (Entkalken des Boilers der zentralen Warmwasseranlage 01.04.2026 – 31.03.2031 …)». Das Dokument richtet sich an Entwickler, deshalb nur ein Nit.

## Bestätigt

- **«endet am Tag, bevor die Arbeit das nächste Mal gemacht wird»** (de; fr «la veille du jour où il sera effectué la prochaine fois»; it «il giorno prima che venga eseguito la volta successiva»; en «the day before the work is done the next time»): eindeutig, alle vier sagen dasselbe. Mit «das nächste Mal in 5 Jahren» ergibt sich 31.03.{year+5}, so wie `InvoiceDataFields.svelte:85` und `help/+page.svelte:33` `end: year + 5` setzen. Damit sind Helga P-5 und V-1 aus Runde 1 behoben.
- **Beispiel «Der Boiler der zentralen Warmwasseranlage»:** Das Beispiel ist jetzt eindeutig der Fall, den Art. 5 Abs. 2 Bst. e VMWG trägt (Wortlaut oben), und deckt sich mit dem Szenario (Kategorie «Warmwasser», Runde 1). Weber P-2 ist behoben.
- **Zahlen nachgerechnet** (Tage inklusive, Teil je Periode auf Rappen gerundet wie `invoice.service.ts:516`):
  - 01.04.2026–31.03.2031, 1'826 Tage. Kalenderjahr: 75.30 / 99.95 / 100.22 / 99.95 / 99.95 / 24.64, Summe 500.01. Juli–Juni: 24.92 / 99.95 / 100.22 / 99.95 / 99.95 / 75.03, Summe 500.02.
  - 01.04.2027–31.03.2032 (Beispiel im Jahr 2027, zwei 29. Februare), 1'827 Tage. Kalenderjahr: 75.26 / 100.16 / 99.89 / 99.89 / 99.89 / 24.90, Summe 499.99.
  - «etwa CHF 100 pro Jahr, im ersten und im letzten Jahr weniger» stimmt in allen Fällen. Bei Juli–Juni ist das erste Stück das kleinere, der Satz gilt trotzdem.
  - Mieterwechsel am 01.07.2027: Teil 2027 ist 99.95, der Ausziehende trägt 99.95 × 181/365 = 49.56, der Einziehende 99.95 × 184/365 = 50.39 (Regel 5). «Wer später einzieht, zahlt nur für seine Zeit» stimmt.
  - Gutschrift über −500 mit demselben Leistungszeitraum: −75.30 in 2026, symmetrisch.
  - Randfall null: Ohne Leistungszeitraum zählt der ganze Betrag in der Periode des Rechnungsdatums (Regel 1). Genau das sagen das Glossar und `invoices_date_help`.
- **Glossar «Abrechnungsperiode»** entspricht Regel 1 und `UBIQUITOUS_LANGUAGE.md:158` (siehe V-1). fr/it/en sagen dasselbe wie de.
- **`invoices_service_period_help`:** «Geben Sie den Leistungszeitraum …» behebt V-7 aus Runde 1. `{year}` im Quartalsbeispiel ist fachlich richtig, eine Rechnung für Q4 kommt im Januar des Folgejahres. Die Ausnahme Heizöl, Flüssiggas, Pellets oder Holz entspricht Regel 10 und Thema 3 (Verbrauch statt Einkauf, Art. 5 Abs. 2 Bst. a VMWG).
- **Zitierweise:** de «Art. 5 Absatz 2 Bst. e VMWG» folgt der Hausschreibweise (`messages/de.json:1197` «Art. 5 Absatz 2 Bst. d VMWG», `:1185` «Art. 257a Absatz 2 OR»). Weber P-5 («Abs.») würde vom Rest der App abweichen und ist deshalb zu Recht nicht umgesetzt. fr «art. 5, al. 2, let. e, OBLF», it «art. 5 cpv. 2 lett. e OLAL», en «Art. 5 para. 2 let. e VMWG» entsprechen den Hausschreibweisen der Zeilen 1185–1207. OBLF und OLAL sind die amtlichen Abkürzungen (Fedlex fr/it).
- **Begriffe nach `docs/design/i18n-begriffe.md`:** période de prestation / periodo di prestazione / service period, période de décompte / periodo di conteggio / billing period, contrat de bail / contratto di locazione / rental contract, frais accessoires / spese accessorie / utility costs, imputable / addebitabile / allocable (❓, #83, schon vorher so) stimmen überall. Neue Domänenbegriffe gibt es keine, ein Issue braucht es nicht.
- **Weber P-3 und #254:** Die Regel für den Wohnungsboiler (nur bei ausdrücklicher Nennung, im Zweifel nicht umlagefähig) widerspricht der VMWG nicht. Art. 5 erfasst den Wohnungsboiler nicht, für ihn gilt Art. 257a Abs. 2 OR mit dem Vorbehalt aus Art. 256 Abs. 2 Bst. b OR. Es fehlt nur der Grund im Text (M-1).

## Nicht bestätigt

- Ob eine ausdrückliche Klausel das Entkalken eines Wohnungsboilers wirksam zu Nebenkosten macht: Ein Gerichtsentscheid fehlt, wie in Runde 1. Die Aussage «umstritten» stützt sich auf den Mieterverband (Unterhalt) und den Beobachter (Runde 1). Das Merkblatt des Mieterverbands von 2026 nennt die Entkalkung «von Boiler und Leitungen» ohne Unterscheidung als zulässig. Das zeigt, dass die Frage auch dort nicht einheitlich beantwortet wird. **Unsicher.** Die vorsichtige Regel aus #254 bleibt deshalb richtig.
- Dass die Boiler in Art. 5 Abs. 2 Bst. e nur die Boiler der zentralen Anlage meinen, folgt aus dem Wortlaut (Abs. 1, «Darunter fallen»). Eine Kommentarstelle habe ich nicht gefunden (Suche `mmx search` «Entkalkung Wohnungsboiler Nebenkosten Unterhalt Art. 5 VMWG zentrale Warmwasseraufbereitung umstritten»; newhome.ch war nicht erreichbar). Wird ein Wohnungsboiler von der zentralen Heizung beheizt, ist die Zuordnung offen. Der vorgeschlagene Text sagt deshalb nur «ist keine zentrale Anlage» und lässt die Folge «umstritten».
- «boiler» als übliches Wort in fr-CH und it-CH: Sprachgebrauch, keine amtliche Quelle (V-4).
- Fedlex-Quellen: VMWG de aus `scratchpad/vmwg.html` (Runde 1, Fassung 20251001), fr/it neu aus dem Fedlex-Filestore, Fassung 20251001. OR aus `scratchpad/or_20260101.html`.
- Ausserhalb des Deltas, nicht bewertet: Weber P-4 und Helga P-1 (Hinweis beim Kästchen «Umlagefähig», das bei «Warmwasser» angehakt ist). Mietrechtlich ist das ein echtes Risiko: Ein Vermieter mit Wohnungsboilern übernimmt den Haken und verrechnet ohne ausdrückliche Klausel. Ob der Punkt schon triagiert ist, weiss ich nicht. Wenn nicht, sollte er als Issue (`fachlich`) aufgenommen werden.
