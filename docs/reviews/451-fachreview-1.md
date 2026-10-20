# Fachreview #451, Runde 1 (vor der Umsetzung)

Gegenstand: `@wip`-Szenarien in Commit 013b32c0 (`tests/e2e/features/statement-detail.feature`, `statement-generate.feature` mit ihren Steps) und die vorgeschlagenen Texte in `451-texts.md`. Worktree: `review-451-fach` (detached, 013b32c0). Anforderung: #451, «Decided (product owner)» und «Done means»; Hintergrund #256 (mit Kommentaren), #406, `docs/reviews/w4d-native-{fr,it,en}.md`.

Zeilenangaben ohne Pfad beziehen sich auf `tests/e2e/features/statement-detail.feature` im Worktree.

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht / Verwalter | Major | Tank: Was mit dem Betrag einer Lieferung geschieht, deren Leistungszeitraum über das Periodenende reicht, ist nicht festgelegt. Wird er weiter anteilig gezählt, stimmt der Verbrauch nach Art. 5 Abs. 2 lit. a VMWG nicht mehr. |
| V-1 | Verwalter | Minor | Tank-Position ohne Rechnungszeilen (offene Frage 1): fachlich richtig und erfüllt die Absicht von Punkt 2. Die Zeile «Done means» braucht aber andere Worte, und es fehlt ein Randfall mit einer negativen Veränderung des Tankbestands. |
| V-2 | Verwalter | Minor | Bei einer Tank-Position widerspricht `sharesNoteDays` («Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum») der neuen Regel. `sharesNoteFuel` ergänzen (Text unten). |
| V-3 | Verwalter / Mietrecht | Minor | Hinweis Punkt 5: «rechnet die Heizkosten noch ohne die Monate im Leistungszeitraum» beschreibt die alte Regel falsch, und der Hinweis sagt nicht, was bei einer Überschreitung zu tun ist (berichtigte Abrechnung). Der Text ist entschieden, eine Änderung braucht den Product Owner. |
| V-4 | Verwalter | Minor | Hinweis Punkt 6: «Heizrechnungen» ist kein Begriff aus dem Glossar. Vorschlag: «Rechnungen der Kategorie «{Kategorie}»», dazu ein Satz für Rechnungen über die ganze Periode. |
| V-5 | Verwalter | Minor | Ablehnung des negativen Betrags: Der Fall fehlt, dass die zugehörige Rechnung schon abgerechnet ist. Laut Glossar «Gutschrift» braucht es dann eine berichtigte Abrechnung. |
| V-6 | Verwalter | Minor | Ein negativer Zeitanteil (Gutschrift über die Mietstage, Rechnung nicht) wird nicht erklärt; erklärt wird nur ein Zeitanteil über 100 %. |
| V-7 | Verwalter | Minor | `partShareZero`: Der gerundete Prozentwert des Verteilschlüssels lässt sich nicht genau nachrechnen (1/3 ergibt 2 Rappen Differenz), die Wortfolge ist holprig. |
| V-8 | Verwalter | Minor | Der Name der Zeile steht nach « – » am Ende: «Rechnung ohne Leistungszeitraum … – Rechnung vom 30.09.2025» wiederholt «Rechnung», und bei Heizkosten scheint der Name zu «(siehe Heiz- und Warmwasserkosten)» zu gehören (Z. 445). Vorschlag: Name vorne. |
| V-9 | Verwalter | Minor | it: Die Zeilen der Rechnungen behalten die deutsche Wortfolge «i suoi giorni di locazione {days} su {total}» (wie FR-10); `sharesNoteAbove` it hat «lei … locatario» statt «Lei» und «inquilino». |
| V-10 | Verwalter | Nit | fr/it/en Formulierung: «a déjà été envoyé», «alors que d’autres», «facture de CHF», «fattura di CHF», «invoice of CHF», «below the statement line», kein Komma vor «affinché». |
| V-11 | Verwalter | Nit | de `partNoPeriod`: «… gilt für die ganze Abrechnungsperiode: …, Ihre Mietstage 139 von 365 Tagen der Abrechnungsperiode»: das zweite «der Abrechnungsperiode» ist doppelt; streichen. |
| V-12 | Verwalter | Nit | Detailseite (offene Frage 2): Sie muss den neuen PDF-Zeilen nicht folgen, die Beträge sind dieselben. Der Kommentar «wie im PDF» bei Z. 668–669 stimmt dann nur noch für die Berechnung; anpassen. |
| V-13 | Verwalter | Nit | Szenario #280 (Z. 566–577) prüft nur die Detailseite. Ein Schritt «steht im PDF nicht "Heizprofil"» würde auch das PDF festhalten. |

## Nachgerechnet (bestätigt)

| Betrag | Rechnung | Ergebnis |
|---|---|---|
| 572.20 (Z. 498–511) | Leistungszeitraum 01.10.2025 – 31.01.2026 = 31+30+31+31 = 123 Tage, davon 92 in 2025; 765.00 × 92/123 = 572.195 | 572.20, bestätigt; Lea Graf ab 15.08. trägt 92/92 |
| 266.58 (Z. 513–533) | Verbrauch 600 + 900 − 100 = 1'400.00; Wohnungsanteil 50 % (zwei gleich grosse Wohnungen) = 700.00; Mietstage 15.08.–31.12. = 17+30+31+30+31 = 139; 700 × 139/365 = 266.575 | 266.58, bestätigt |
| 306.52 (Z. 451–471) | 600 × 0/91 + 1'200 × 47/92 = 613.04; / 1'800 = 34.06 %; × 900 = 306.52; Mittelwert der Brüche (0 + 0.5109)/2 = 25.54 % | bestätigt |
| 953.60 (Z. 410–431) | 05.–31.01. = 27 Tage; 18 % × 27/31 = 15.677 → 15.68 %; 15.68+14+11+5+2+0 = 47.68 %; 47.68/50.00 = 95.36 % (genau); 1'000 × 95.36 % = 953.60 | bestätigt |
| 520.00 (Z. 433–449) | Marc Huber ab 01.05.: Winter Mai–Dez = 100 − (18+14+11+5) = 52 %; 2'000 × (1'000 × 0 % + 1'000 × 52 %) / 2'000 = 520.00 | bestätigt |
| 229.89 (Beispiel `partShareZero`) | 900 × 47/92 = 459.78; − 900 × 0/91 = 0; × 50 % = 229.89 | bestätigt |

Randfälle zu Punkt 1 (Gutschrift, Lea Graf ab 15.08.2025, Wohnung 50 %):
- +900 (Jul–Sep) und −300 (Apr–Jun): 300.00 × (459.78 + 0)/600.00 = 229.89 = 50 % × 459.78; Zeitanteil 76.63 %. Der Vormieter bzw. der Vermieter (Leerstand) trägt 50 % × (900 × 45/92 − 300) = 70.11; zusammen 300.00 = Wohnungsanteil. Bestätigt.
- +900 (Okt–Dez) und −300 (Apr–Jun): 300.00 × 900/600 = 450.00; Zeitanteil 150 % (Fall von `sharesNoteAbove`); der Vormieter trägt −150.00; zusammen 300.00. Bestätigt.
- +900 (Apr–Jun) und −300 (Jul–Sep): 300.00 × (0 − 153.26)/600 = −76.63; Zeitanteil −25.54 %, ohne Erklärung (V-6).
- Summe null (+900 Jul–Sep, −900 Apr–Jun): Wohnungsanteil 0.00, Ihr Anteil 229.89, der Vormieter −229.89. Passt zur Periodengerechtigkeit (Art. 257b Abs. 1 OR: «tatsächlichen Aufwendungen»); siehe V-7 zum gerundeten Schlüssel.

Hinweis Punkt 5, Szenario `statement-generate.feature` Z. 629–642: Eva Frei mietete 01.01.–31.03., Marc Huber mietet ab 01.05., beide in Wohnung 3.01. Marc Huber nach alter Regel: 52 % von 2'000 = 1'040.00. Eva Frei nach neuer Regel: Rechnung Jan–Mär 43/43 = 100 % = 1'000.00, dazu Rechnung ohne Leistungszeitraum 43 % = 430.00, zusammen 1'430.00. Beide zusammen tragen 2'470.00 von 2'000.00 Heizkosten. Der Fall des Hinweises tritt also wirklich ein; bestätigt.

Hinweis Punkt 6 (Z. 658–682): Die Rechnung über 1'520 ohne Leistungszeitraum wird genannt, die über 1'410 mit Leistungszeitraum und die Hauswart-Rechnung nicht. Das passt zur Bedingung in `451-texts.md`; bestätigt.

Die Zeilennamen (Z. 473–496) folgen dem Entscheid «Rechnung vom {Datum} (Nr. {Nummer})», ohne Nummer nur das Datum, die Beschreibung nicht mehr; die Rechnung vom 05.07.2025 ist eindeutig und bleibt ohne Name. Bestätigt (zur Stellung V-8).

## Rechtsrahmen (Fedlex)

- Art. 257a OR (Fedlex, SR 220, konsolidierte Fassung `20270701`, Deutsch): Abs. 1 «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» Abs. 2 «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Art. 257b OR: Abs. 1 «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2 «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»
- Art. 5 VMWG (SR 221.213.11, Fassung 1.10.2025): Abs. 1 «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» Abs. 2 «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden; …»
- Art. 8 VMWG: Abs. 1 «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Abs. 2 «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»

Bestätigt:
- **Punkt 2** (Tank über den Verbrauch der ganzen Periode): entspricht Art. 5 Abs. 2 lit. a VMWG («die verbraucht wurden»). Der Verbrauch hängt am Bestand, nicht am Lieferdatum; bei Lieferungen über das Periodenende siehe M-1.
- **Punkt 1** (Anteil je Rechnung): ordnet jede tatsächliche Aufwendung ihren Tagen zu (Art. 257b Abs. 1 OR). Die Summe der Anteile aller Mieter und des Leerstands ist der Wohnungsanteil (Randfälle oben).
- **Namen nach Rechnungsdatum und -nummer:** Sie machen die Belegeinsicht (Art. 257b Abs. 2 OR, Art. 8 Abs. 2 VMWG) leichter als die Beschreibung, die frei erfasst wird.
- **Punkt 5:** schützt vor der Verrechnung von mehr als den tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR).

---

## M-1 (Major): Tank-Lieferung mit Leistungszeitraum über das Periodenende

**Beleg.** `backend/src/services/invoice.service.ts:552-563` wählt die Rechnungen einer Periode nach der Überschneidung mit dem Leistungszeitraum aus. Eine Rechnung über das Periodenende hinaus zählt heute nur mit ihrem Teil in der Periode (`partBeyond`, z.B. 572.20 von 765.00). `backend/src/services/statement-pdf.service.ts:168-187` (`fuelOf`) rechnet die «Rechnungen» des Tank-Abschnitts aus den Positionsbeträgen zurück. `451-texts.md` sagt nur «every invoice and the change of the Tankbestand now count over the whole period», also etwas über die Tage, nicht über den Betrag. Das Szenario Z. 513–533 hat nur eine Lieferung ganz in der Periode (Jul–Sep).

**Warum falsch.** Heizöl, das vor dem Stichtag in den Tank kommt, steckt ganz im Endbestand. Beispiel: Lieferung CHF 1'000.00 am 15.12.2025, Leistungszeitraum 01.12.2025 – 31.01.2026 (62 Tage, 31 davon in 2025). Zählt Dwello weiter nur 500.00 in 2025, ist der Verbrauch 2025 um 500.00 zu tief und der Verbrauch 2026 um 500.00 zu hoch. Bei einem Mieterwechsel zum Jahreswechsel trägt so der eine Mieter Heizöl, das der andere verbraucht hat. Art. 5 Abs. 2 lit. a VMWG verlangt die Brennstoffe, «die verbraucht wurden», je Abrechnungsperiode. Punkt 2 sagt «ignoring a delivery's Leistungszeitraum»; eine Teilung nach dem Leistungszeitraum beim Betrag widerspräche dem.

**Korrektur (Produktentscheid; Vorschlag für ein Issue mit den Labels `fachlich` und `entscheiden`).**
- Regel: «In einer Kategorie mit Tankbestand zählt eine Lieferung mit ihrem ganzen Betrag in der Abrechnungsperiode, in die das Ende ihres Leistungszeitraums fällt (der Tag der Lieferung), ohne Leistungszeitraum in der Periode ihres Rechnungsdatums. Sie wird nie auf zwei Perioden geteilt.»
- Hilfetext am Feld Leistungszeitraum bei einer Brennstoff-Kategorie: «Bei einer Lieferung von Heizmaterial: Tragen Sie als Leistungszeitraum den Tag der Lieferung ein.»
- Test: ein Test in `calculation`/`statement-pdf.pg.test.ts` mit dem Beispiel oben. Erwartet: Verbrauch 2025 = Anfangsbestand + 1'000.00 − Endbestand, kein «davon» unter der Tank-Position.

Ist der Entscheid nicht vor der Umsetzung zu haben, gehört M-1 unter «Blocked on me». Die anteilige Zählung gab es schon vor dieser Änderung, aber Punkt 2 legt die Tank-Regel neu fest und macht die Frage damit sichtbar.

## Vorgeschlagene Texte (Minor/Nit)

**V-1 (offene Frage 1).** Fachlich richtig: Zählen alle Rechnungen und die Veränderung des Tankbestands über dieselben Tage, ist der Zeitanteil einfach «139/365 Tage». Der Abschnitt «Heiz- und Warmwasserkosten» zeigt dann Anfangsbestand + Rechnungen − Endbestand = Verbrauch, genau wie das Praxis-Schema in `docs/nebenkostenabrechnung-anforderungen.md:57`. Der Entscheid nennt «− 300.00 × 139/365» mit «e.g.» als Beispiel. Gemeint ist: kein «+ -300.00» mehr. Die Zeile «Done means» sagt es wörtlich ohne «e.g.».
- Vorschlag für «Done means»: «Without a Heizprofil, tank fuel … is shared by days over the consumption of the whole period; the PDF prints no «+ -», a negative amount in a calculation line prints as «– 300.00 × …».»
- Ein Randfall dazu, als Render- oder `pg`-Test: Anfangsbestand 100, Lieferung 900, Endbestand 400. Verbrauch 600.00, Wohnungsanteil 300.00, Ihr Anteil 300 × 139/365 = 114.25. Das PDF zeigt «– Endbestand» und kein «+ -».
- Ausserhalb des Diffs, schon vorher so: `formatCurrency` (`pdf.service.ts:509`) druckt `Math.abs`. Ein negativer Verbrauch (Fehleingabe) erschiene also positiv. Nur zur Kenntnis.

**V-2.** `sharesNoteFuel` ergänzen, sonst widerspricht `sharesNoteDays` bei Tank-Lieferungen:
- de: «Kosten des Gebäudes bei Heizmaterial aus dem Tank: der Verbrauch (siehe Heiz- und Warmwasserkosten). Er zählt über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat.»
- fr: «… la consommation (voir « Frais de chauffage et d’eau chaude »). Elle compte pour toute la période de décompte, même si une livraison a une période de prestation.»
- it: «… il consumo (vedi spese di riscaldamento e acqua calda). Conta per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione.»
- en: «… the fuel consumed (see ‘Heating and hot water costs’). It counts for the whole billing period, even if a delivery has a service period.»

**V-3 (Punkt 5; der Text ist entschieden, deshalb dem Product Owner vorlegen).** Die alte Abrechnung lässt die Monate nicht weg. Sie verteilt die Heizrechnung über die Monate der ganzen Periode statt über die Monate ihres Leistungszeitraums. Dem Vermieter fehlt ausserdem der nächste Schritt (Glossar «Berichtigte Abrechnung»).
- de: «Die Abrechnung von {tenant} ist schon versendet. Sie verteilt die Heizkosten noch über die ganze Abrechnungsperiode, nicht nach dem Leistungszeitraum der Heizrechnungen. Prüfen Sie, ob beide Abrechnungen zusammen mehr als die Heizkosten der Wohnung verrechnen. Wenn ja, erstellen Sie für {tenant} eine berichtigte Abrechnung.»
- fr: «Le décompte de {tenant} a déjà été envoyé. Il répartit encore les frais de chauffage sur toute la période de décompte, et non selon la période de prestation des factures. Vérifiez si les deux décomptes ensemble facturent plus que les frais de chauffage du logement. Si c’est le cas, établissez un décompte rectificatif pour {tenant}.»
- it: «Il conteggio di {tenant} è già stato inviato. Ripartisce ancora le spese di riscaldamento sull’intero periodo di conteggio, non secondo il periodo di prestazione delle fatture. Verifichi se i due conteggi insieme addebitano più delle spese di riscaldamento dell’appartamento. In tal caso, allestisca un conteggio rettificato per {tenant}.»
- en: «The statement for {tenant} has already been sent. It still spreads the heating costs over the whole billing period, not by the service period of the invoices. Check whether the two statements together charge more than the heating costs of the apartment. If so, create a corrected statement for {tenant}.»

Wenn der Product Owner den entschiedenen Text behält: fr «a déjà été envoyé» statt «est déjà envoyé»; die übrigen Übersetzungen sind treu.

**V-4 (Punkt 6).** «Heizrechnung» steht nicht in `UBIQUITOUS_LANGUAGE.md` (dort: «Heizkosten (Kategorie)»). Ein fehlender Begriff; Vorschlag: den Begriff vermeiden und die Kategorie nennen.
- Titel de «Heizkosten: Rechnungen ohne Leistungszeitraum» / fr «Frais de chauffage : factures sans période de prestation» / it «Spese di riscaldamento: fatture senza periodo di prestazione» / en «Heating costs: invoices without a service period».
- de: «Diese Rechnungen der Kategorie «{category}» haben keinen Leistungszeitraum, andere derselben Kategorie schon. Tragen Sie bei jeder den Leistungszeitraum ein, damit jeder Mieter die Kosten seiner Monate trägt. Gilt eine Rechnung für die ganze Abrechnungsperiode, tragen Sie diese ein.»
- fr: «Ces factures de la catégorie « {category} » n’ont pas de période de prestation, alors que d’autres de la même catégorie en ont une. Saisissez-la pour chacune, afin que chaque locataire supporte les frais de ses mois. Si une facture vaut pour toute la période de décompte, saisissez celle-ci.»
- it: «Queste fatture della categoria «{category}» non hanno un periodo di prestazione, altre della stessa categoria sì. Lo inserisca per ognuna affinché ogni inquilino sostenga le spese dei propri mesi. Se una fattura vale per l’intero periodo di conteggio, inserisca questo.»
- en: «These invoices in the category ‘{category}’ have no service period, while others in the same category do. Enter one for each so that each tenant bears the costs of their own months. If an invoice applies to the whole billing period, enter that period.»

Falls «Heizrechnung» bleiben soll, ein Glossar-Eintrag (Issue mit `fachlich`, `entscheiden`): «**Heizrechnung**: Rechnung einer Heizkosten-Kategorie.»

**V-5 (Ablehnung `backend_INVOICE_AMOUNT_NEGATIVE`).** Der zweite Satz bekommt einen Zusatz:
- de: «… Ziehen Sie eine Gutschrift vom Betrag der Rechnung ab, zu der sie gehört. Ist diese Rechnung schon abgerechnet, erstellen Sie danach eine berichtigte Abrechnung.»
- fr: «… Si cette facture est déjà décomptée, établissez ensuite un décompte rectificatif.»
- it: «… Se questa fattura è già conteggiata, allestisca poi un conteggio rettificato.»
- en: «… If that invoice is already billed, then create a corrected statement.»

Begriffe: «abgerechnet» / «décomptée» / «conteggiata» / «billed» laut `docs/design/i18n-begriffe.md:54`.

**V-6.** Neuer Satz `sharesNoteBelow`, wenn ein Zeitanteil unter 0 % liegt:
- de: «␣Ein negativer Zeitanteil entsteht, wenn eine Gutschrift (negativer Betrag) Ihre Mietstage betrifft, die Rechnungen derselben Position aber nicht: Sie erhalten Ihren Teil der Gutschrift.»
- fr: «␣Une part temporelle négative résulte d’une note de crédit (montant négatif) portant sur vos jours de location, alors que les factures du même poste n’y portent pas : vous recevez votre part de la note de crédit.»
- it: «␣Una quota temporale negativa risulta da una nota di credito (importo negativo) relativa ai suoi giorni di locazione, mentre le fatture della stessa voce non lo sono: Lei riceve la sua parte della nota di credito.»
- en: «␣A negative time share arises when a credit note (negative amount) covers your days rented but the invoices of the same line do not: you receive your part of the credit note.»

**V-7 (`partShareZero`).** Zuerst die Summe, dann der Schlüssel in Klammern. Gerundete Prozentwerte (z.B. 1/3): Mit dem gedruckten 33.33 % ergibt sich 459.78 × 33.33 % = 153.24, gedruckt würde der genaue Wert 153.26. Entweder mit dem gedruckten Prozentwert rechnen oder einen Satz zur Rundung anhängen.
- de: «Ihr Anteil{colon}({sum}) × {keyShare} (Anteil Ihrer Wohnung nach dem Verteilschlüssel) = {share}»
- fr: «Votre part{colon}({sum}) × {keyShare} (part de votre logement selon la clé de répartition) = {share}»
- it: «La sua quota{colon}({sum}) × {keyShare} (quota del suo appartamento secondo la chiave di riparto) = {share}»
- en: «Your share{colon}({sum}) × {keyShare} (your apartment’s share under the distribution key) = {share}»

**V-8 (Stellung des Namens).** Beide entschiedenen Wortlaute bleiben, der Name kommt nach vorne. Dann sind keine Klammern in Klammern nötig und keine Verwechslung mit «(siehe …)» möglich:
- ohne Leistungszeitraum: «Rechnung vom 30.09.2025 ohne Leistungszeitraum, gilt für die ganze Abrechnungsperiode: CHF 765.00, Ihre Mietstage 139 von 365 Tagen»
- mit Leistungszeitraum: «Rechnung vom 05.10.2025 (Nr. 4711), Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 900.00, Ihre Mietstage 47 von 92 Tagen»
- fr «Facture du 30.09.2025 sans période de prestation, valable pour toute la période de décompte : …» / «Facture du 05.10.2025 (n° 4711), période de prestation …»
- it «Fattura del 30.09.2025 senza periodo di prestazione, vale per l’intero periodo di conteggio: …» / «Fattura del 05.10.2025 (n. 4711), periodo di prestazione …»
- en «Invoice dated 30.09.2025 without a service period, applies to the whole billing period: …» / «Invoice dated 05.10.2025 (no. 4711), service period …»

Die Erwartungen in Z. 445, 490–492 müssten dann folgen. Der Product Owner entscheidet, weil die Zeile anders aussieht als im Beispiel des Entscheids. Bleibt « – {name}», ist das vertretbar (Minor).

**V-9 (it).**
- `partNoPeriod` (it): «… CHF {amount}, {days} giorni di locazione su {total} giorni del periodo di conteggio»
- `partBeyond`, `partLine`, `partStock` (it): «…{colon}CHF {amount}, {days} giorni di locazione su {total}»
- `sharesNoteAbove` (it): «␣Una quota temporale superiore al 100 % risulta da una nota di credito (importo negativo) relativa a giorni che non rientrano nella sua locazione.» (ohne «lei»/«locatario»; laut `i18n-begriffe.md:20` heisst Mieter «inquilino», die Anrede ist «Lei»)

**V-10 (Nit).**
- fr `partBeyond` «(facture de CHF {wholeAmount} pour {wholeDays} jours)»
- it «(fattura di CHF {wholeAmount} per {wholeDays} giorni)»
- en «(invoice of CHF {wholeAmount} for {wholeDays} days)»
- en `sharesNoteRounded` «… shown below the statement line.»
- fr Punkt 6 «…, alors que d’autres de la même catégorie en ont une.»
- it Punkt 6 «Lo inserisca affinché ogni inquilino sostenga le spese dei propri mesi.»
- Geschützte Leerzeichen auch in «jours de location», «giorni di locazione» und «days rented».

**V-11 (Nit).** de `partNoPeriod`: «Rechnung ohne Leistungszeitraum, gilt für die ganze Abrechnungsperiode{colon}CHF {amount}, Ihre Mietstage {days} von {total} Tagen». Die Erwartung in Z. 490 müsste dann folgen.

**V-12 (offene Frage 2).** Der Entscheid (Punkt 3) nennt nur das PDF. Die Detailseite ist die Sicht des Vermieters; dort hilft die Beschreibung («Hauswart 2025-07-05»), die er selbst erfasst hat. Die Beträge kommen aus dem Backend und folgen den Punkten 1 und 2 von selbst. Nicht verlangt, aber empfohlen: auf der Detailseite das Rechnungsdatum zur Beschreibung stellen, damit der Vermieter eine Frage zum PDF zuordnen kann. Der Kommentar bei Z. 668–669 lautet dann: «… steht jede Rechnung mit ihren Tagen und die Berechnung wie im PDF; die Zeile heisst nach der Beschreibung der Rechnung».

**V-13 (Nit).** In Szenario Z. 566–577 ergänzen: «Und der Liegenschaftsverwalter das PDF der Abrechnung herunterlädt», dann «Und steht im PDF nicht "Heizprofil"».

## Fehlende Begriffe (Issue mit den Labels `fachlich` und `entscheiden`)

- «Heizrechnung» (V-4): vermeiden (Vorschlag oben) oder ins Glossar: «**Heizrechnung**: Rechnung einer Heizkosten-Kategorie.»
- Regel für Tank-Lieferungen über das Periodenende (M-1): als Ergänzung zu «Verbrauch (Heizmaterial)»: «Eine Lieferung zählt mit ihrem ganzen Betrag in der Abrechnungsperiode, in die ihr Lieferdatum (Ende des Leistungszeitraums, sonst Rechnungsdatum) fällt.»

## Nicht bestätigt

- **Fedlex-Fassung OR:** Der SPARQL-Endpunkt von Fedlex lieferte als neueste konsolidierte Fassung `20270701` (Datum in der Zukunft). Der Wortlaut von Art. 257a/257b ist derselbe wie in `docs/nebenkostenabrechnung-anforderungen.md` (Fassung 1.10.2026). Die Fassung zum 19.10.2026 habe ich nicht eigens geöffnet.
- **VMWG fr/it:** Die Fedlex-Fassungen habe ich nicht gelesen. Die fr/it-Begriffe stammen aus `docs/design/i18n-begriffe.md`.
- **Tankbestand mit fehlender Ablesung:** Ob Punkt 2 auch gilt, wenn Anfangs- oder Endbestand fehlt (Dwello rechnet dann die Lieferungen, Glossar «Verbrauch (Heizmaterial)»), sagen weder #451 noch `451-texts.md`. Gesucht in `fuel-stock.service.ts:31-43, 74-103` und in `docs/nebenkostenabrechnung-anforderungen.md:57, 151`.
- **Detailseite bei Summe null und Zeitanteil über 100 % / unter 0 %:** Was sie zeigt, habe ich nicht geprüft; `CostTable.svelte` nicht gelesen.
- **PDF bei #280:** Ob das PDF einer Abrechnung ohne Heizkosten heute schon kein Heizprofil nennt, habe ich nur über `heatingSection`/`runDetailsOf(hasHeating)` in `pdf.service.ts`/`statement-pdf.service.ts` überflogen, nicht nachgewiesen.
- **Heizkosten nach Tagen ohne Heizprofil** (bei einem Mieterwechsel statt nach Heizgradtagen): als Praxis **unsicher**. Das gab es schon vorher und ist nicht Gegenstand von #451.
- **Schweizer Französisch:** ob «n° 4711» oder «no 4711» üblicher ist, **unsicher**; beides ist verständlich.
- **E2E-Steps:** nur gelesen, nicht ausgeführt. Ob «Verbrauch CHF 1'400.00» aus «= Heizkosten nach Verbrauch» und dem rechtsbündigen Betrag zusammen extrahiert wird, folgt nur aus dem Vorbild Z. 321.
