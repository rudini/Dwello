# Fachreview #71 (F-13, Option B), Runde 1

Gegenstand: Worktree `review-71-fach`, Commit c491eeb. Geprüft wurden die zwei `@wip`-Szenarien in `tests/e2e/features/statement-detail.feature` (Z. 53–66 und 368–381) und die geplante Umsetzung (Punkte 1–5 des Auftrags), gegen den aktuellen Code: `calculation.service.ts`, `prorating.service.ts`, `heating-profile.service.ts`, `pdf.service.ts`, `invoice.service.ts`, `invoice-completeness.service.ts` und `messages/de.json`, sowie gegen `UBIQUITOUS_LANGUAGE.md` und `docs/nebenkostenabrechnung-anforderungen.md` (Regel 5).

## Übersicht

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Satz im Heizungsabschnitt «52.00 % der Heizkosten Ihrer Wohnung» ist falsch, sobald eine Position Rechnungen mit eigenem Anteil hat (Marc trägt 26 %) |
| M-2 | Mietrecht | Major | Übergang: Abrechnungen derselben Wohnung und Periode nach alter und neuer Regel ergeben zusammen mehr als die tatsächlichen Kosten (2'470 von 2'000) |
| M-3 | Mietrecht | Minor | «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.» stimmt nicht mehr, wenn eine Heizrechnung nach Tagen geteilt wird (Punkt 2) |
| V-1 | Verwalter | Minor | Leistungszeitraum über das Periodenende: der Betrag der Periode folgt den Tagen, der Mieteranteil dem Heizprofil. Die Lesart muss ausdrücklich festgehalten werden |
| V-2 | Verwalter | Minor | Punkt 3: Die Tank-Kategorie nicht daran erkennen, ob die Gruppe eine «Veränderung Tankbestand» hat, sondern am Tank des Gebäudes |
| V-3 | Verwalter | Minor | Sprung zwischen 0 % und einem kleinen Monatsanteil (Rechnung Juni–September, September 2 %): Wer im September mietet, trägt alles |
| V-4 | Verwalter | Minor | Die Hilfe zum Leistungszeitraum sagt nicht, was er bei Heizkosten bewirkt (Wartungsabo, Revision, Kaminfeger) |
| V-5 | Verwalter | Minor | Es fehlen Fälle: eine einzige Heizrechnung mit Leistungszeitraum (gleiche Tage), Leistungszeitraum über die Periode hinaus, 0-%-Rückfall, Tank-Ausnahme |
| V-6 | Verwalter | Minor | Positionen, die zusammen 0 ergeben (Gutschrift, #237): Ihr Anteil als Σ Betrag × Anteil rechnen, nicht über die Teilung durch Σ Betrag |
| V-7 | Verwalter | Minor | Glossar: «Anteil nach Heizprofil» und «Zeitanteil» decken den Anteil je Rechnung nicht ab (Vorschläge unten) |
| V-8 | Verwalter | Nit | PDF-Zeile: «Ihre Monate darin» weicht vom bestehenden «Anteile der Monate Ihres Mietverhältnisses» ab; Doppelpunkt uneinheitlich; «Ohne Leistungszeitraum» hängt an #256 |

## Bestätigt

**Rechnung der Szenarien.** Heizprofil «Winter»: zusammen 100 %. Jan–Mär = 18 + 14 + 11 = 43. Mai–Dez = 2 + 0 + 0 + 0 + 2 + 8 + 14 + 26 = 52. April 5 % ist Leerstand und bleibt beim Vermieter. Das Gebäude hat eine Wohnung, also ist der Wohnungsanteil 100 % von 2'000.00.
- Eva (Jan–Mär): Rechnung Q1 43/43 = 100.00 % gibt 1'000.00; Rechnung ohne Leistungszeitraum 43.00 % gibt 430.00. Zusammen 1'430.00 / 2'000.00 = 71.50 %. Szenario Z. 64 stimmt.
- Marc (ab Mai): Q1 0.00 / 43.00 = 0.00 % gibt 0.00; ohne Leistungszeitraum 52.00 % gibt 520.00. Zusammen 520.00 / 2'000.00 = 26.00 %. Szenario Z. 65 stimmt.
- PDF-Zeile Z. 381: 2'000.00 × (1'000.00 × 0.00 % + 1'000.00 × 52.00 %) / 2'000.00 = 520.00 stimmt.
- Bisher (Hintergrund Z. 34–44): Eva 860.00, Marc 1'040.00. Die Änderung senkt Marcs Anteil, wie der Product Owner es im Beispiel verlangt («a tenant moving in in July pays nothing of an invoice for January to March»).
- Randfall Monatsmitte, mit `calculateHeatingShare` gerechnet (angebrochener Monat × Tage / Tage des Monats, auf 2 Stellen gerundet): Marc zieht am 15.03.2024 ein, Eva zieht am 14.03.2024 aus. März für Marc: 11 × 17/31 = 6.03; Q1-Anteil 6.03 / 43.00 = 14.02 %. Eva: 18 + 14 + 11 × 14/31 (4.97) = 36.97; 36.97 / 43.00 = 85.98 %. Zusammen 100.00 %, die Rundung ist hier aufgegangen. Ganzes Jahr für Marc: 6.03 + 57 = 63.03 %.
- Randfall Monatsgrenze im Leistungszeitraum: Rechnung 15.01.–14.04.2024. Jan 18 × 17/31 = 9.87, Feb 14, Mär 11, Apr 5 × 14/30 = 2.33, zusammen 37.20. Mieter ab 01.03.: 11 + 2.33 = 13.33, also 13.33 / 37.20 = 35.83 %. Mit den gedruckten Monatswerten lässt sich das nachrechnen (#232).

**Punkt 1 (Anteil je Rechnung, gewichtet nach Betrag) ist bestätigt.** Er folgt dem Entscheid in #71 und Art. 257b Abs. 1 OR (Fedlex, Stand 1.1.2026): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Wer im Januar bis März nicht gemietet hat, hat die Energie aus dieser Zeit nicht gebraucht. Folgendes ist richtig:
- Die Regel gilt nur, wo das Heizprofil schon heute gilt (`handleMidYearMoves`, `prorating.service.ts:216`, `221`). Ein Mietvertrag über die ganze Periode trägt jede Rechnung ganz, also bleibt das Ergebnis gleich.
- Eine Rechnung ohne Leistungszeitraum erhält den Anteil des Laufs.
- Eine Position, deren Rechnungen alle die ganze Periode abrechnen, bleibt unverändert.
- Gerundet wird wie #232.
- Gewichtet wird wie #226 (Σ Betrag × Anteil / Σ Betrag).

**Punkt 2 (0 % im Leistungszeitraum, dann nach Tagen darin) ist bestätigt.** Es ist die Fortsetzung von #137 (Regel 5). Ohne Rückfall wäre der Anteil 0 / 0, und der Vermieter bliebe auf tatsächlich angefallenen, anrechenbaren Kosten sitzen. Das ist nicht unzulässig, aber für eine Rechnung mit echtem Betrag nicht sachgerecht. Zur Begründung: Art. 5 Abs. 1 VMWG (Fedlex, Stand 1.10.2025): «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» Zum PDF-Satz siehe M-3, zum Sprung V-3.

**Punkt 3 (Tank-Kategorien behalten die heutige Teilung) ist in der Sache bestätigt. #257 blockiert #71 nicht.** Gründe:
- Art. 5 Abs. 2 lit. a VMWG (Fedlex, Stand 1.10.2025): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;». In einer Tank-Kategorie sagt der Leistungszeitraum einer Lieferung nichts darüber, wann der Brennstoff verbraucht wurde. Ihn mit Monaten des Heizprofils zu gewichten, wäre genau der Fehler, den #257 bei der Teilung nach Tagen beschreibt.
- Mit Heizprofil teilt Dwello eine Tank-Gruppe heute schon über die ganze Periode und ohne Leistungszeitraum (`calculation.service.ts:345–358`). Die Ausnahme hält also den heutigen Stand. Diesen Stand schlägt #257 vor («#71 … stays as decided for heating costs without a Tankbestand»).
- `invoice-completeness.service.ts:234` sagt dasselbe: «deliveries in the category of the building's Tankbestand count by consumption, never by a Leistungszeitraum». Ebenso `invoices_service_period_help` (`messages/de.json:760`): «Nicht für Lieferungen von Heizöl … Deren Verbrauch zählt über den Tankbestand des Gebäudes.»
- Der Wortlaut von #71 («a heating-cost invoice with a Leistungszeitraum») nimmt Tank-Kategorien nicht aus. Die Ausnahme ist deshalb in #71 (Kommentar) und in Regel 5 festzuhalten, und der Pull Request nennt sie. Entscheidet der Product Owner #257 anders, berührt das nur die Teilung nach Tagen, nicht die nach Heizprofil.
- Zur Abgrenzung der Tank-Kategorie siehe V-2.

**Punkt 5 (gespeicherte Abrechnungen bleiben) ist bestätigt.** Versendete Abrechnungen lassen sich nicht neu berechnen (`statements_all_billed`, `messages/de.json:1156`). Das ist richtig: Eine einmal zugestellte Abrechnung darf sich nicht still ändern. Zur Mischung alter und neuer Abrechnungen derselben Wohnung siehe M-2.

**Punkt 4 (PDF):** Die Zeile je Rechnung folgt dem Muster von `heatingPeriodMonths` (`pdf.service.ts:67`) und `partShare` (`:79`) und lässt sich nachrechnen. Die Zeile ist in Ordnung, der Satz im Heizungsabschnitt nicht (M-1). Kleinigkeiten unter V-8.

**Begriffe.** Diese Begriffe stehen im Glossar und werden richtig gebraucht: «Leistungszeitraum» (Z. 64), «Heizprofil» (Z. 132), «Monatsanteil» (Z. 133), «Wohnungsanteil» (Z. 124), «Abrechnungsposition» (Z. 151), «Mietstage», «Abrechnungsperiode», «Tankbestand», «Veränderung Tankbestand». «Anteil nach Heizprofil» und «Zeitanteil» müssen erweitert werden (V-7).

## Befunde

### M-1 (Major): Der Satz im Heizungsabschnitt nennt einen falschen Anteil

**Beleg:**
- `pdf.service.ts:64`: `heatingNote: 'Heizkosten nach Heizprofil «{profile}»: {percent} % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode'`.
- Punkt 4 des Plans will diesen Satz unverändert lassen.
- Im Szenario Z. 372–381 stünde für Marc «52.00 % der Heizkosten Ihrer Wohnung». Er trägt aber 520.00 von 2'000.00, also 26.00 %. Die Position zeigt im selben PDF 26.00 %.
- Haben alle Heizrechnungen einen Leistungszeitraum (z. B. vier Quartalsrechnungen Gas), gilt die Zahl des Satzes für keine einzige Rechnung.

**Warum falsch:** Der Mieter liest zwei widersprüchliche Anteile an denselben Kosten. Art. 8 Abs. 1 VMWG (Fedlex, Stand 1.10.2025) verlangt eine «detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten». Eine Aufteilung mit einem falschen Gesamtsatz ist irreführend, und ein Mieter würde genau diesen Widerspruch beanstanden.

**Lösung:** Hat eine Heizposition Rechnungen mit eigenem Anteil, den Satz einschränken. Vorschlag de:
«Heizkosten nach Heizprofil «Winter»: 52.00 % für eine Rechnung ohne Leistungszeitraum. Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition.»

Das gilt analog für fr/it/en. Ohne solche Rechnungen bleibt der heutige Satz. Dazu gehört ein Render-Test für beide Fälle und eine Zeile im Szenario Z. 379 ff. (`Und steht im PDF "…52.00 % für eine Rechnung ohne Leistungszeitraum…"`).

### M-2 (Major): Alte und neue Regel in derselben Wohnung und Periode

**Beleg:** Punkt 5. Dazu `statements_all_billed` (`messages/de.json:1156`): Ein Entwurf wird neu berechnet, indem man ihn löscht und die Abrechnungen erneut erstellt; versendete bleiben. Rechnung mit dem Szenario-Bestand:
- Marcs Abrechnung ist vor der Änderung versendet, nach alter Regel 52 % von 2'000.00 = 1'040.00.
- Evas Entwurf wird nach der Änderung neu erstellt: 1'430.00.
- Zusammen tragen die Mieter 2'470.00. Die Heizkosten der Wohnung sind 2'000.00, davon trägt der Vermieter 100.00 für den Leerstand im April.

Umgekehrt (Eva alt 860.00, Marc neu 520.00) trägt der Vermieter 620.00 statt 50.00.

**Warum falsch:** Art. 257b Abs. 1 OR (Wortlaut oben): Nebenkosten sind nur «die tatsächlichen Aufwendungen». Was die Mieter über 2'000.00 hinaus zahlen, ist keine Aufwendung. Das gilt nur im Übergang und nur, wenn die Wohnung in der Periode einen Mieterwechsel hat, eine Heizrechnung mit Leistungszeitraum vorliegt und eine Abrechnung schon versendet ist. Dann wird der Fehler aber sicher gemacht, und der Vermieter sieht ihn nicht. Ähnlich wirkt schon heute eine Änderung der Monatsanteile (`profiles_shares_keep`), die die Hilfe mit «löschen Sie die Entwürfe aller Mietverträge der betroffenen Wohnungen» auffängt. Für #71 gibt es keinen solchen Hinweis.

**Lösung (Entscheid nötig, Issue mit `fachlich`, `entscheiden`):** Eine der beiden Varianten:
- (a) Der Abrechnungslauf weist hin, wenn ein Mietvertrag derselben Wohnung für dieselbe Periode schon eine versendete Abrechnung mit Heizkosten nach Heizprofil hat und eine Heizrechnung mit Leistungszeitraum in einem Monat liegt, der nicht die ganze Periode ist. Vorschlag: «Die Abrechnung von Marc Huber ist schon versendet und rechnet die Heizkosten noch ohne die Monate im Leistungszeitraum. Prüfen Sie, ob beide Abrechnungen zusammen die Heizkosten Ihrer Wohnung nicht übersteigen.»
- (b) Ausdrücklich in Kauf nehmen und in Regel 5 festhalten.

Variante (a) ist vorzuziehen.

### M-3 (Minor): Erläuterung «Zeitanteil» bei Heizkosten

**Beleg:** `pdf.service.ts:95`: `sharesNoteHeating: ' Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.'`. Nach Punkt 2 steht unter einer Heizposition auch «Ihre Mietstage x von y Tagen». Ausserdem ist der Zeitanteil der Position bei mehreren Rechnungen ein gewichteter Wert und nicht «der» Anteil nach Heizprofil.

**Lösung:** Wo eine Heizposition Rechnungszeilen hat, ergänzen: «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil; bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin, haben sie dort zusammen 0 %, Ihre Mietstage darin.» Für alle vier Sprachen.

### V-1 (Minor): Leistungszeitraum über das Periodenende

**Beleg:** `invoice.service.ts:516`: Der Teil einer Rechnung in der Periode ist `amount × Tage in der Periode / Tage des Leistungszeitraums`. Punkt 1 normiert danach nur über «die Tage der Rechnung in der Periode». Beispiel:
- Fernwärme 01.10.2023–31.03.2024, CHF 1'820.00, 183 Tage (2024 ist ein Schaltjahr).
- Nach Tagen fallen auf 2024: 1'820.00 × 91/183 = 905.03.
- Nach Heizprofil: Jan–Mär 43 gegen Okt–Dez 48, also 1'820.00 × 43/91 = 860.00.
- Eva (Jan–Mär) trägt nach Plan 905.03, nach Heizprofil 860.00. Unterschied 45.03.

**Warum relevant:** Der Entscheid sagt «only the Heizprofil's months inside that Leistungszeitraum count, normalised to 100 %». Das lässt sich als ganzer Leistungszeitraum lesen. Bei Gas und Fernwärme sind Abrechnungen über die Heizperiode (Juli–Juni oder Oktober–März) häufig, während die Abrechnungsperiode das Kalenderjahr ist. Die Teilung nach Tagen über die Periodengrenze hält aber Regel 1 ein. Sie bleibt richtig, wenn zwei Perioden mit verschiedenen Heizprofilen oder einer ohne Heizprofil gerechnet werden, und sie ändert die «Kosten Liegenschaft» nicht. Deshalb ist die Lesart des Plans vertretbar.

**Lösung:**
- Die Lesart in Regel 5 ausdrücklich festhalten: «Der Teil einer Rechnung in der Periode folgt den Tagen (Regel 1); innerhalb dieses Teils zählen die Monate des Heizprofils.»
- Im PDF die Zeile wie `partBeyond` mit dem Beleg drucken: «Leistungszeitraum 01.10.2023 – 31.03.2024 (Rechnung CHF 1'820.00), davon 01.01.2024 – 31.03.2024: CHF 905.03, Anteile der Monate im Heizprofil: …».
- Will der Product Owner die Teilung nach Heizprofil auch über die Periodengrenze, ein Issue `fachlich`, `entscheiden` öffnen.

### V-2 (Minor): Woran die Tank-Kategorie erkannt wird

**Beleg:** Punkt 3 erkennt sie an der «fuel stock change in the group». `fuelStockChange` (`fuel-stock.service.ts:72–74`) liefert nichts, solange der Anfangs- oder der Endbestand fehlt. Dann rechnet Dwello den Einkauf ab (Regel 10). Eine Lieferung mit Leistungszeitraum würde in diesem Fall nach #71 auf die Monate darin gelegt, im Widerspruch zu `invoice-completeness.service.ts:234` und `invoices_service_period_help`.

**Lösung:** Ausnehmen nach der Kategorie des Tankbestands des Gebäudes (`listFuelStocks(buildingId)`, irgendein Stichtag), wie es die Vollständigkeitsprüfung tut, nicht nach der Zeile der Veränderung. Dazu ein Test mit einer Tank-Kategorie ohne Endbestand.

### V-3 (Minor): Sprung bei kleinen Monatsanteilen

**Beleg:** Normiert wird über die Monate im Leistungszeitraum. Beispiel mit Heizprofil «Winter» und einer Rechnung 01.06.–30.09.2024 über CHF 800.00: Juni–August 0 %, September 2 %. Ein Mieter, der nur im September mietet, trägt 2/2 = 100 %, also 800.00. Wer Juni bis August mietet, trägt nichts. Hätte der September 0 %, griffe Punkt 2, und die Teilung wäre 92/122 zu 30/122.

**Warum relevant:** Das folgt aus Option B und ist nicht unzulässig. Ein grosser Sommerbetrag zeigt aber, dass das Heizprofil die Kosten nicht abbildet, etwa wenn Warmwasser in der Rechnung ist und ein reines Heizungsprofil gewählt wurde.

**Lösung:** In Regel 5 nennen. `statements_heating_help` um einen Satz ergänzen: «Enthalten Ihre Heizrechnungen auch das Warmwasser, wählen Sie ein Heizprofil mit Warmwasser, zum Beispiel «Heizung + Warmwasser».» Dazu ein Test am Rand 0 % gegen > 0 %.

### V-4 (Minor): Hilfe zum Leistungszeitraum

**Beleg:** `invoices_service_period_help` (`messages/de.json:760`): «… Dann zählen nur die Tage, die in die Abrechnungsperiode fallen.» Bei einer Heizkostenrechnung mit Heizprofil zählen beim Mieterwechsel neu die Monate des Heizprofils im Leistungszeitraum. Die KI liest einen Leistungszeitraum aus, wenn die Rechnung Beginn und Ende nennt (`backend/src/config/llm.ts:273`), also auch bei einem Wartungs- oder Serviceabo.

**Warum relevant:** Ein Serviceabo 01.07.2024–30.06.2025 verteilt sich dann nur auf Juli bis Dezember. Das ist vertretbar, aber für den Vermieter nicht erkennbar.

**Lösung:** Einen Satz anfügen: «Bei Heizkosten zählen bei einem Mieterwechsel die Monate des Heizprofils in diesem Zeitraum.» Für alle vier Sprachen.

### V-5 (Minor): Fälle ohne Szenario oder Test

**Beleg:** Die Szenarien decken nur die Mischung «Rechnung mit Leistungszeitraum plus Rechnung ohne» ab. `daysOf` (`calculation.service.ts:150–153`) liefert heute für Rechnungen mit gleichen Tagen keine `invoiceParts`. Eine einzige Heizrechnung Q1 (ohne Jahresrechnung) gäbe Marc 0.00 % ohne jede Zeile, die das erklärt.

**Lösung:** Tests auf tieferer Ebene (`statement-pdf.pg.test.ts` oder ein Rechnungstest) für:
- (a) eine einzige Heizrechnung mit Leistungszeitraum, der kürzer ist als die Periode: Die Zeile wird gedruckt.
- (b) einen Leistungszeitraum über die Periode hinaus (V-1).
- (c) den 0-%-Rückfall (Punkt 2, mit der Tage-Zeile).
- (d) eine Tank-Kategorie mit Lieferung mit Leistungszeitraum: unverändert (Punkt 3, V-2).

### V-6 (Minor): Positionen, die zusammen 0 ergeben

**Beleg:**
- `calculation.service.ts:137` gibt 0 zurück, wenn `totalAmount === 0` (#237, `entscheiden`).
- Mit Heizprofil, Beispiel Jahresrechnung 1'000.00 und Gutschrift Q1 −1'000.00: Richtig wäre für Marc 1'000.00 × 52 % − 1'000.00 × 0 % = 520.00 (beim Wohnungsanteil 100 %), die Formel des Plans gibt 0.00.
- Für Eva wäre es 430.00 − 1'000.00 = −570.00.

**Lösung:** Mindestens keinen neuen Fall schaffen. Ihr Anteil = (Wohnungsanteil / Kosten Liegenschaft) × Σ Betrag × Anteil lässt sich ohne Teilung durch Σ Betrag rechnen. Sonst #237 um den Heizfall ergänzen.

### V-7 (Minor): Fehlende Begriffe im Glossar

**Beleg:**
- `UBIQUITOUS_LANGUAGE.md:134` definiert «Anteil nach Heizprofil» nur als Monate des Mietvertrags in der Periode geteilt durch die Monate der Periode.
- `:160` «Zeitanteil» nennt für Heizkosten nur «der Anteil nach Heizprofil».
- Das PDF druckt künftig «Anteil nach Heizprofil: 0.00 % / 43.00 %» mit den Monaten des Leistungszeitraums als Nenner.

**Vorschläge (Issue `fachlich`, `entscheiden`, Glossar nicht von mir geändert):**
- **Anteil nach Heizprofil:** «Summe der Monatsanteile über die Tage, an denen der Mietvertrag läuft, geteilt durch die Summe der Monatsanteile über die abgerechneten Tage: ohne Leistungszeitraum die Abrechnungsperiode, mit Leistungszeitraum dessen Tage in der Abrechnungsperiode. Ein angebrochener Monat zählt mit dem Teil seiner Tage. Gerechnet aus diesen Monatswerten, auf zwei Stellen gerundet wie im PDF. Rechnungen einer Kategorie mit Tankbestand zählen immer über die ganze Abrechnungsperiode.»
- **Zeitanteil** (Satz zu Heizkosten): «Heizkosten mit Heizprofil im Abrechnungslauf bei Ein- oder Auszug: je Rechnung der Anteil nach Heizprofil, bei mehreren Rechnungen nach ihren Beträgen gewichtet. Haben die abgerechneten Tage einer Rechnung im Heizprofil zusammen 0 %, zählen die Mietstage der Position darin.»

### V-8 (Nit): Wortlaut der PDF-Zeile

- «Ihre Monate darin: keine; zusammen 0.00 %»: Das bestehende PDF sagt «Anteile der Monate Ihres Mietverhältnisses» (`pdf.service.ts:65`). Vorschlag: «Anteile der Monate Ihres Mietverhältnisses darin: keine; zusammen 0.00 %».
- «Anteil nach Heizprofil 52.00 %» ohne Doppelpunkt, «Anteil nach Heizprofil: 0.00 % / …» mit. Einheitlich mit Doppelpunkt schreiben.
- «Ohne Leistungszeitraum: …» soll nach #256 (P-4, `entscheiden`) vielleicht «Rechnung ohne Leistungszeitraum, gilt für die ganze Abrechnungsperiode» heissen. Die neue Zeile muss dann mitziehen. Die Abhängigkeit im Pull Request nennen.

## Nicht bestätigt

- **Übliche Praxis von Option B:**
  - Die HEV-Heizgradtage (hev-schweiz.ch/vermieten/nebenkostenabrechnungen/heizgradtage) und das Muster des Mieterverbands bzw. von mietrecht.ch («Die ausziehende Mieterschaft muss für die Monate Juli–November 24.50% der Heizkosten … übernehmen», mietrecht.ch/fileadmin/files/Heiz_Nebenkosten/Verteilung_Heizkosten_Mieterwechsel.pdf, nur als Suchtreffer gesehen) wenden die Monatsskala auf die Heizkosten der ganzen Periode an.
  - Eine Schweizer Quelle für die Normierung je Rechnung über ihren Leistungszeitraum habe ich nicht gefunden (Suche mit `mmx search` nach Heizgradtagen, Mieterwechsel und Quartalsrechnung).
  - Option B ist mit Art. 257b Abs. 1 OR vereinbar und entschieden, als gängige Praxis aber **unsicher**.
- **Rundungssumme über alle Mietverträge:** Die Anteile je Rechnung sind auf 0.01 % gerundet, zusammen können sie 100.01 % ergeben (bei CHF 10'000 sind das CHF 1.00). Im Beispiel oben gehen sie auf. Das besteht seit #232 und war nicht Gegenstand dieser Prüfung.
- **Gleiche Gruppe im Szenario:** Dass die Rechnung «Heizung» aus `invoiceOn` und die Hintergrund-Rechnung «Heizöl 2024» aus `heatingInvoice` (beide Kategorie Heating, `tests/e2e/fixtures/backend.ts:316–332`) denselben Verteilschlüssel haben und damit eine Abrechnungsposition bilden, habe ich aus den Kommentaren («distributed by area») geschlossen, nicht im Helper `invoice()` nachgelesen.
- **Fedlex-Fassung:** VMWG Art. 5, 7 und 8 sind wörtlich aus dem Fedlex-Filestore (Fassung 20251001) zitiert, OR Art. 257a und 257b aus der Fassung 20260101. Gespeichert unter `/tmp/claude-0/-home-user-Dwello/80f6c78d-4176-5c5e-b0cf-a0f1691f2996/scratchpad/fedlex71/`.
