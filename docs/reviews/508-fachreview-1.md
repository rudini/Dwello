# Fachreview 508-1: Summe der Heizkosten in der Vorschau beim Mieterwechsel

Gegenstand: @wip-Szenario «Die Vorschau nennt, wie viel die Abrechnungen einer Wohnung mehr als ihre Heizkosten verrechnen» (tests/e2e/features/statement-generate.feature:789-801), Commit ec0e6da, Entscheid #508 Option A.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Blocker | Den Anteil des Leerstands (Art. 7 Abs. 1 VMWG) zieht der Vergleich nicht ab. Das Szenario selbst hat im April einen Leerstand: Mit den vollen Heizkosten der Wohnung zeigt die Vorschau CHF 370.00 zu viel statt CHF 450.00. Ist der Leerstand grösser, steht bei Mietern, die zu viel bezahlt haben, sogar «weniger». |
| V-1 | Verwalter | Major | Das Szenario prüft nur den ersten Betrag, als Platzhalter (9'999.99). Was die Abrechnungen verrechnen und den Unterschied, die nach dem Entscheid A gezeigt werden müssen, prüft es nicht. |
| V-2 | Verwalter | Major | Treffen beide Hinweise zu (der Fall P-3 von Dr. Weber), sagt die Zahl «zu viel» zusammen mit dem Satz «Wenn ja, erstellen Sie für {tenant} eine berichtigte Abrechnung» wieder, die richtige Abrechnung zu berichtigen. In diesem Fall fehlt in der Rechnung der Leistungszeitraum. |
| V-3 | Verwalter | Minor | Ein Mietvertrag ohne vereinbarte Heizkosten (oder mit Nebenkostenpauschale) verrechnet seinen Anteil nicht, wie ein Leerstand. Diesen Anteil wie in M-1 abziehen, Text siehe `statements_heating_sum_costs_landlord`. |
| V-4 | Verwalter | Minor | Jede Position wird pro Mietvertrag auf Rappen gerundet. Auch richtige Abrechnungen weichen darum um einige Rappen ab. Liegt der Unterschied unter CHF 0.05 (der Rundung des Saldos), gilt er als «gleich viel». |
| V-5 | Verwalter | Minor | Der bestehende Satz sagt «beide Abrechnungen», hat eine Wohnung aber drei oder mehr Mietverträge in der Periode, stimmt das nicht (messages/de.json:1540; schon auf main). Die neue Zeile sagt darum «die Abrechnungen der Wohnung». |
| V-6 | Verwalter | Minor | Das Szenario trennt die Tausender mit `'` (ASCII). Die Vorschau zeigt `’` (vgl. feature:432, 827 «1’520.00»). In den Erwartungen `’` verwenden. |

## M-1 (Blocker): Leerstand im Vergleich

**Beleg.** Grundlage (feature:9-13): Eva Frei hat vom 01.01. bis 31.03.2024 gemietet, Marc Huber mietet seit 01.05.2024, der April ist ein Leerstand. In Lindenhof gibt es nur die Wohnung 3.01, also ist der Wohnungsanteil 100 %. Das Heizprofil «Winter» ist [18,16,13,8,4,1,0,0,3,9,13,15] (statement-generate.steps.ts:357-359).

- Heizungsrechnung «Heizöl 2024» über CHF 1'000.00 vom 30.06., ohne Leistungszeitraum (fixtures/backend.ts:456-459). Rechnung «Heizung 2024-04-10» über CHF 1'000.00, gleiche Kategorie, erhält ihren Leistungszeitraum 01.01.-31.03. erst nach dem Versand.
- Marc, versendet nach der alten Regel (calculation.service.ts:226-229, `handleMidYearMoves`): Mai bis Dezember sind 45 %, also 2'000 × 45 % = **900.00**. Mit 3 % kommt er auf 927.00.
- Eva, neu (`byProfile`, calculation.service.ts:174-193): Heizöl 1'000 × 47 % = 470.00, Heizung Jan-Mär 1'000 × 100 % = 1'000.00, zusammen **1'470.00**. Mit 3 % kommt sie auf 1'514.10.
- Heizkosten der Wohnung: **2'000.00**. Den Leerstand nach heutiger Regel trägt der Vermieter: Heizöl April 8 % = **80.00**, Heizung 0 (der April liegt ausserhalb ihres Leistungszeitraums). Die Mieter tragen also **1'920.00**.
- Verrechnet: 900.00 + 1'470.00 = **2'370.00**. Das sind gegenüber 1'920.00 **450.00 zu viel**. Gegenprobe: Marc nach heutiger Regel ergibt Heizöl 450.00 + Heizung 0 = 450.00, und 900.00 − 450.00 = 450.00. Ohne Abzug des Leerstands zeigt die Vorschau 370.00 zu viel, 80.00 zu wenig.
- Zweite Stichprobe, Unterschied 0: im Szenario «Kein Hinweis …» (feature:805) ergibt 450.00 + 1'470.00 = 1'920.00 genau den Anteil der Mieter. Ohne Abzug stünde dort «CHF 80.00 weniger», obwohl alles stimmt.
- Dritte Stichprobe, zu wenig: Ist Eva nach der alten Regel versendet (2'000 × 47 % = 940.00) und Marc neu (450.00), ergibt das 1'390.00, also **530.00 zu wenig** (richtig: Eva 1'470.00 − 940.00). Ohne Abzug stünden 610.00.
- Gesetz, VMWG Art. 7 Abs. 1 (Stand 1. Oktober 2025): «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.» UBIQUITOUS_LANGUAGE.md:203 «Leerstand … Dwello rechnet ihn keinem Mieter an.»

**Warum falsch.** Die Abrechnungen der Mieter dürfen zusammen höchstens die Heizkosten der vermieteten Zeit tragen, nicht die ganzen Heizkosten der Wohnung. Bei einem Leerstand zeigt der Vergleich mit den vollen Heizkosten zu wenig Überverrechnung. Bei einem grossen Leerstand (z. B. Leerstand 600.00, zu viel 300.00, verrechnet 1'700.00 gegen 2'000.00) heisst es «weniger», und der Vermieter berichtigt eine Abrechnung nicht, mit der er gegen Art. 257b Abs. 1 OR verstösst. OR Art. 257b Abs. 1 (Stand 1. Oktober 2026): «die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten».

**Fix: Definition pro Wohnung** (Periode des Abrechnungslaufs):
1. **Heizkosten der Wohnung** = Summe der Wohnungsanteile (Wohnungsanteil vor dem Zeitanteil, nach dem Verteilschlüssel jeder Rechnung) aller Positionen von Kategorien mit Heizkosten (`is_heating_cost`, Verbrauch aus dem Tankbestand eingeschlossen), mit den heutigen Rechnungen. Ohne Verwaltungspauschale. Der Wohnungsanteil hängt nicht vom Heizprofil ab.
2. **Anteil des Vermieters** = Wohnungsanteil × Zeitanteil nach heutiger Regel (Heizprofil des Laufs) für die Tage ohne Mietvertrag (Leerstand). Dazu kommen die Tage von Mietverträgen, die keine Heizkosten verrechnen (V-3). **Anteil der Mieter** = 1. − 2.
3. **Verrechnet** = Summe der Mieteranteile der Heizpositionen ohne Verwaltungspauschale. Gezählt werden alle bestehenden Abrechnungen der Wohnung mit derselben Periode, die nicht ersetzt sind (versendet, bezahlt, erledigt, Entwürfe), und alle, die der Lauf erstellen würde (`calculateStatement`). Erstellt der Lauf eine berichtigte Abrechnung (#647), zählt sie statt der ersetzten. Die Verwaltungspauschale bleibt draussen, weil sie ein Satz auf allen eigenen Nebenkosten ist (Art. 4 Abs. 3 VMWG) und keine Heizkosten. Mit der Berichtigung passt sie sich von selbst an.
4. **Unterschied** = 3. − Anteil der Mieter. Positiv heisst zu viel, negativ zu wenig. Unter CHF 0.05 gilt «gleich viel» (V-4).
5. Die Zeile erscheint, wenn die Wohnung eine bestehende Abrechnung der Periode hat und der Lauf einen weiteren Mietvertrag dieser Wohnung abrechnet. Ohne bestehende Abrechnung rechnet alles nach derselben Regel, und der Unterschied ist von selbst 0. Die Zeile steht einmal pro Wohnung, auch bei mehreren Abrechnungen nach der alten Regel.

## V-1 (Major): Das Szenario prüft den Entscheid nicht ganz

**Beleg.** feature:801 prüft nur `"Die Heizkosten der Wohnung betragen CHF 9'999.99"`. Der Entscheid A verlangt drei Zahlen.

**Fix.** Den ganzen Text mit den echten Beträgen dieses Aufbaus prüfen (mit Leerstand, Wortlaut unten):
`Dann sagt die Vorschau zur Abrechnung 2024 von "Marc Huber" "Die Heizkosten der Wohnung betragen CHF 2’000.00, davon tragen die Mieter CHF 1’920.00 und Sie CHF 80.00 für den Leerstand. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 2’370.00 ohne Verwaltungspauschale, CHF 450.00 zu viel."`
Den Kommentar (feature:789) um den Leerstand ergänzen: «Marc alt 900.00 + Eva neu 1'470.00; Leerstand April 80.00». Die Fälle «zu wenig» (530.00, dritte Stichprobe), «gleich viel» und drei Mietverträge auf einer tieferen Schicht prüfen (`runHeatingHints`, *.pg.test.ts). Der Satz des Szenarios auf main (feature:787) bleibt gleich: Die neue Zeile steht dahinter.

Frage 5: Das Szenario sagt in Begriffen des Fachs, was der Verwalter wissen will («sagt die Vorschau zur Abrechnung …» wie die Schritte von #451), ohne Wörter der Oberfläche. Der Titel sagt «mehr». Das passt zu diesem Fall, solange «zu wenig» nur auf der tieferen Schicht geprüft wird.

## V-2 (Major): Beide Hinweise zusammen führen zur falschen Berichtigung

**Beleg.** Persona Dr. Weber 451, P-3 (git c893731^:docs/design/personas/dr-weber-451.md:11, 51): Sarah 591.94 + Nina neu 634.69 = 1'226.63 gegen 1'054.47, also 172.16 zu viel. «Sarahs Abrechnung ist richtig», die Ursache ist die Rechnung Q1 ohne Leistungszeitraum. Nachgerechnet: Trägt man bei Q1 den Leistungszeitraum Jan-Mär ein, ergibt Nina 1'054.47 × (395 + 1'410)/4'115 = 462.53, und 591.94 + 462.53 = 1'054.47 genau. Neben diesen Zahlen sagt der bestehende Satz «Wenn ja, erstellen Sie für Sarah Meier eine berichtigte Abrechnung». Gerade das ist hier falsch.

**Warum falsch.** Mit der Zahl «zu viel» folgt der Verwalter dem Rat jetzt noch eher. Den Fall P-3, mit dem #508 begann, deckt der Entscheid A nur halb ab.

**Fix.** Gilt im selben Lauf auch der Hinweis auf Heizungsrechnungen ohne Leistungszeitraum (#339), folgt nach den Zahlen der Satz `statements_heating_sum_period_first`. Den Fall P-3 mit einem eigenen Szenario abdecken (Aufbau wie feature:819 mit einer versendeten Abrechnung). Dieser Satz geht über den Wortlaut von Option A hinaus: Der Product Owner muss ihn bestätigen (`needs-decision` in #508 oder in einem neuen Issue).

## Wortlaut

Die Zeile steht direkt nach `statements_existing_old_heating_rule`, im selben Hinweis zur bestehenden Abrechnung. Der Satz «Prüfen Sie, ob …» kann bleiben: Die Zahlen beantworten ihn, und das Szenario auf main hält. Gibt es nur den Hinweis #339 und eine bestehende Abrechnung, steht die Zeile im Block «Rechnungen ohne Leistungszeitraum», mit dem Präfix «Wohnung {apartment}: ». Zuerst `_costs` oder `_costs_vacancy` bzw. `_costs_landlord`, dann `_more`, `_less` oder `_equal`, dann gegebenenfalls `_period_first`.

| key | de | fr | it | en |
|---|---|---|---|---|
| statements_heating_sum_costs | Die Heizkosten der Wohnung betragen CHF {costs}. | Les frais de chauffage du logement s’élèvent à CHF {costs}. | Le spese di riscaldamento dell’appartamento ammontano a CHF {costs}. | The heating costs of the apartment amount to CHF {costs}. |
| statements_heating_sum_costs_vacancy | Die Heizkosten der Wohnung betragen CHF {costs}, davon tragen die Mieter CHF {tenants} und Sie CHF {landlord} für den Leerstand. | Les frais de chauffage du logement s’élèvent à CHF {costs}, dont CHF {tenants} à la charge des locataires et CHF {landlord} à votre charge pour la vacance. | Le spese di riscaldamento dell’appartamento ammontano a CHF {costs}, di cui CHF {tenants} a carico degli inquilini e CHF {landlord} a carico Suo per lo sfitto. | The heating costs of the apartment amount to CHF {costs}, of which the tenants bear CHF {tenants} and you bear CHF {landlord} for the vacancy. |
| statements_heating_sum_costs_landlord | Die Heizkosten der Wohnung betragen CHF {costs}, davon tragen die Mieter CHF {tenants} und Sie CHF {landlord} für Leerstand und Mietverträge ohne vereinbarte Heizkosten. | Les frais de chauffage du logement s’élèvent à CHF {costs}, dont CHF {tenants} à la charge des locataires et CHF {landlord} à votre charge pour la vacance et les baux sans frais de chauffage convenus. | Le spese di riscaldamento dell’appartamento ammontano a CHF {costs}, di cui CHF {tenants} a carico degli inquilini e CHF {landlord} a carico Suo per lo sfitto e i contratti senza spese di riscaldamento pattuite. | The heating costs of the apartment amount to CHF {costs}, of which the tenants bear CHF {tenants} and you bear CHF {landlord} for vacancy and for leases without agreed heating costs. |
| statements_heating_sum_more | Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF {billed} ohne Verwaltungspauschale, CHF {difference} zu viel. | Les décomptes du logement en facturent ensemble CHF {billed} sans les frais d’administration, soit CHF {difference} de trop. | I conteggi dell’appartamento ne addebitano insieme CHF {billed} senza le spese amministrative, ossia CHF {difference} di troppo. | The apartment’s statements charge CHF {billed} for them in total, without the management fee: CHF {difference} too much. |
| statements_heating_sum_less | Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF {billed} ohne Verwaltungspauschale, CHF {difference} zu wenig. | Les décomptes du logement en facturent ensemble CHF {billed} sans les frais d’administration, soit CHF {difference} de moins. | I conteggi dell’appartamento ne addebitano insieme CHF {billed} senza le spese amministrative, ossia CHF {difference} in meno. | The apartment’s statements charge CHF {billed} for them in total, without the management fee: CHF {difference} too little. |
| statements_heating_sum_equal | Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF {billed} ohne Verwaltungspauschale, gleich viel. | Les décomptes du logement en facturent ensemble CHF {billed} sans les frais d’administration, soit le même montant. | I conteggi dell’appartamento ne addebitano insieme CHF {billed} senza le spese amministrative, ossia lo stesso importo. | The apartment’s statements charge CHF {billed} for them in total, without the management fee: the same amount. |
| statements_heating_sum_period_first | Fehlt einer Heizrechnung der Leistungszeitraum, tragen Sie ihn zuerst ein und öffnen Sie die Vorschau erneut. Erst dann zeigt sich, ob eine Abrechnung berichtigt werden muss. | S’il manque la période de prestation d’une facture de chauffage, saisissez-la d’abord et rouvrez l’aperçu. Vous verrez alors seulement si un décompte doit être rectifié. | Se a una fattura del riscaldamento manca il periodo di prestazione, lo inserisca prima e riapra l’anteprima. Solo allora si vedrà se un conteggio va rettificato. | If a heating invoice has no service period, enter it first and open the preview again. Only then will you see whether a statement needs to be corrected. |

Fehlende Begriffe: keine. «Heizkosten der Wohnung» und «Anteil der Mieter» sind Umschreibungen aus Wohnungsanteil, Zeitanteil und Leerstand (UBIQUITOUS_LANGUAGE.md:198, 203) und brauchen keine eigene Zeile. Wer «Heizkosten der Wohnung» als Begriff festhalten will, nimmt: «Summe der Wohnungsanteile der Heizpositionen einer Abrechnungsperiode, vor dem Zeitanteil, ohne Verwaltungspauschale».

## Nicht bestätigt

- Ob eine Überverrechnung nach #339 auch ohne den Hinweis auf die alte Regel (#335) vorkommt, also mit einer bestehenden Abrechnung, die schon nach Monaten rechnet. Gesucht in invoice-completeness.service.ts:325-360 und statement-run.service.ts:303-319. Kein solcher Fall gefunden, darum ist der Ort «Block #339 pro Wohnung» nur eine Vorsorge.
- Abrechnungen derselben Wohnung mit einer anderen, überlappenden Periode (eine Abrechnung mit kürzerer Periode, backend.ts:229). Die Definition zählt nur dieselbe Periode, wie `oldHeatingRule`. Ob es diesen Fall im Lauf gibt, habe ich nicht geprüft.
- Ob eine Berichtigung zulasten des Mieters (Fall «zu wenig») nach Bezahlung der Abrechnung noch zulässig ist, ist **unsicher**. Ich habe keinen Wortlaut auf Fedlex. OR Art. 128 Ziff. 1 nennt nur die Verjährung, UBIQUITOUS_LANGUAGE.md:200 «nicht einheitlich geklärt». Der Text zu «zu wenig» rät darum nichts.
- Die Formatierung der Beträge in fr/it/en (Tausendertrennzeichen pro Sprache) habe ich nicht geprüft.
- Die Beträge habe ich aus dem Code nachgerechnet, nicht im laufenden System.

Geprüft: der Seed des Szenarios (eine Wohnung, gleiche Kategorie «Heizung», Heizprofil, 3 %), P-3 nachgerechnet (172.16), VMWG Art. 5 und 7 (Stand 1.10.2025), OR Art. 257a/b (Stand 1.10.2026), dass der Satz «Prüfen Sie, ob …» unverändert bleiben kann, die Begriffe aus i18n-begriffe.md (vacance, sfitto, vacancy, frais d’administration, spese amministrative, management fee).
