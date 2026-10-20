# Fachreview #451, Runde 2 (Delta 013b32c0..89883897)

Gegenstand: der Hilfetext `invoices_service_period_fuel` (Regel M-1 des Product Owners), die Umsetzung von V-1 bis V-13 und der Antworten des Product Owners (M-1, V-3, V-8; #451 «Decided (product owner)», Eintrag vom 2026-10-19), dazu die neuen Beträge in den Tests. Worktree: `review-451-fach2` (detached, 89883897). Vorbericht: `docs/reviews/451-fachreview-1.md`.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| M-1 | erledigt (Regel), Hilfetext offen, siehe V-14 | `invoice.service.ts` `getInvoicesForStatement`: Eine Lieferung der Tank-Kategorie zählt ganz, eine mit `servicePeriodEnd > periodEnd` fällt weg. `docs/nebenkostenabrechnung-anforderungen.md` Regel 5 nennt die Regel. Test «zählt eine Lieferung ganz in der Periode ihres Lieferdatums». |
| V-1 | erledigt | Der Tank wird als ein Verbrauch geteilt, «+ -» ist ausgeschlossen (`statement-pdf.pg.test.ts`, it.each mit steigendem Bestand 100 → 400). |
| V-2 | erledigt | `sharesNoteFuel` in vier Sprachen, wie vorgeschlagen. |
| V-3 | erledigt (Text wie entschieden) | `statements_existing_old_heating_rule` de/fr/it/en wörtlich wie entschieden; `statement-generate.feature`. Zum Begriff «Heizrechnungen» darin siehe V-18. |
| V-4 | erledigt, mit neuem Randfall V-15 | `statements_heating_whole_title/_text` wie vorgeschlagen; Szenario umbenannt. |
| V-5 | erledigt | `backend_invoice_amount_negative` in vier Sprachen, Begriffe nach `i18n-begriffe.md`. |
| V-6 | erledigt | `sharesNoteBelow` in vier Sprachen; Render-Test «erklärt einen negativen Zeitanteil». |
| V-7 | teilweise | Die Wortfolge ist umgesetzt. Mit `keyShare` steht der genaue Bruch des Verteilschlüssels («70.00 / 140.00 m²»). Ohne ihn druckt `keyFactor` (`pdf.service.ts`) den gerundeten Prozentwert; bei 1/3 bleibt die Differenz von 2 Rappen (Nit, kein neuer Befund). |
| V-8 | erledigt | `partNamed: '{name}, {line}'`, ohne Leistungszeitraum `partNoPeriod` mit `{name}` vorne; Szenarien Z. 445 und 490–492 nachgeführt. |
| V-9 | erledigt | it: `partNoPeriod`, `partBeyond`, `partLine`, `partStock` mit «{days} giorni di locazione su {total}»; `sharesNoteAbove` ohne «lei/locatario». |
| V-10 | erledigt | «facture de CHF», «fattura di CHF», «invoice of CHF», «below the statement line», «alors que d’autres», «affinché» ohne Komma, geschützte Leerzeichen. |
| V-11 | erledigt (de); fr/it/en siehe V-16 | |
| V-12 | erledigt | Kommentar in `statement-detail.feature` angepasst. Die Empfehlung, auf der Detailseite das Rechnungsdatum zu zeigen, war nicht verlangt. |
| V-13 | erledigt | Szenario #280 lädt das PDF und prüft «steht im PDF nicht "Heizprofil"». |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-14 | Verwalter / Mietrecht | Major | Der Hilfetext am Leistungszeitraum widerspricht sich: Absatz 1 sagt «Nicht für Lieferungen von Heizöl, …», Absatz 4 «Tragen Sie als Leistungszeitraum den Tag der Lieferung ein». Absatz 4 sagt ausserdem nicht, was zählt, wenn ein Zeitraum oder keiner eingetragen ist. |
| V-15 | Verwalter | Minor | `statements_heating_whole_text` mit mehreren Kategorien: `PreviewChecks.svelte` fügt die Namen mit «, » in ein Anführungszeichenpaar ein: «der Kategorie «Heizung, Fernwärme»». Das liest sich wie eine einzige Kategorie. Fix: eigene Meldung im Plural (Text unten). |
| V-16 | Verwalter | Nit | fr/it/en `partNoPeriod` doppelt wie früher de (V-11): «valable pour toute la période de décompte : … sur 365 jours de la période de décompte». Fix: «… sur {total} jours» / «… su {total} giorni» / «… of {total} days». |
| V-17 | Verwalter | Nit | Uneinheitliche Minuszeichen: in den Berechnungen «–» (U+2013), bei Beträgen «-» (`formatCHF`), daraus «0.00 0.00 – -500.00» in der Zeile (Test «rechnet bei einer Heizposition, die zusammen null ergibt»). Der Entscheid schreibt «−» (U+2212). Vorschlag: einheitlich «–» auch vor Beträgen, wenn die Schrift U+2212 nicht hat. |
| V-18 | Verwalter | Nit | «Heizrechnungen» steht im entschiedenen Text V-3 (`statements_existing_old_heating_rule`), ist aber kein Begriff in `UBIQUITOUS_LANGUAGE.md`. Der Text ist entschieden. Deshalb ein Glossar-Eintrag statt einer Textänderung (Issue mit `fachlich`, `entscheiden`; Wortlaut unten). |
| V-19 | Verwalter | Nit | Eine benannte Zeile über das Periodenende wiederholt «Rechnung»: «Rechnung vom 05.10.2025 (Nr. 4711), Leistungszeitraum … (Rechnung CHF 765.00 für 123 Tage), davon …». Das kommt selten vor (nur bei zwei gleichen Zeilen) und ist vertretbar; möglich wäre «(Betrag CHF … für … Tage)». Das entscheidet der Product Owner. |
| V-20 | Verwalter | Nit | Der Satz zu Heizmaterial steht bei jeder Kategorie. Bei einer Rechnung, deren Kategorie Brennstoff ist (`is_fuel`), wäre er treffender; sonst lässt er sich leicht überlesen. Optional. |

## V-14 (Major): Hilfetext zu Lieferungen von Heizmaterial

**Beleg.** `src/routes/invoices/InvoiceDataFields.svelte:83-88` zeigt vier Absätze immer zusammen unter «Leistungszeitraum»:
- Absatz 1, `invoices_service_period_help` (de), letzter Satz: «Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz: Deren Verbrauch zählt über den Tankbestand des Gebäudes.» (fr/it/en gleich; festgehalten in `src/__tests__/invoice-pages.dom.test.ts:815`)
- Absatz 4, `invoices_service_period_fuel` (neu): «Bei einer Lieferung von Heizmaterial: Tragen Sie als Leistungszeitraum den Tag der Lieferung ein.»

Regel (`invoice.service.ts`, `getInvoicesForStatement`): Eine Lieferung der Tank-Kategorie zählt ganz in der Periode, in die das Ende ihres Leistungszeitraums fällt, ohne Leistungszeitraum in der Periode des Rechnungsdatums. Der Test selbst trägt eine Lieferung mit dem Zeitraum 20.12.2024 – 10.01.2025 ein; sie zählt ganz in 2025.

**Warum falsch.**
1. Absatz 1 sagt «keinen Leistungszeitraum», Absatz 4 «den Tag der Lieferung». Ein unerfahrener Vermieter kann nicht wissen, welcher Satz gilt.
2. Gerade der Fall, für den M-1 entschieden wurde, braucht den Leistungszeitraum: Heizöl wird am 20.12.2025 geliefert, die Rechnung ist vom 05.01.2026. Ohne Leistungszeitraum zählt sie in 2026. Das Heizöl steckt aber schon im Endbestand 31.12.2025. Der Verbrauch 2025 ist dann um den Betrag zu tief, der von 2026 um ihn zu hoch, und bei einem Mieterwechsel zum Jahreswechsel trägt der neue Mieter Heizöl, das der alte verbraucht hat. Art. 5 Abs. 2 lit. a VMWG zählt die Brennstoffe, «die verbraucht wurden», Art. 8 Abs. 2 VMWG nennt den «Anfangs- und Endbestand von Heizmaterialien» (Wortlaut aus Fedlex, siehe Bericht Runde 1). Richtig ist also die Periode, deren Endbestand die Lieferung enthält: der Tag der Lieferung im Verhältnis zum Stichtag.
3. Das Ende des Leistungszeitraums vertritt den Liefertag nur, wenn der Vermieter wirklich den Liefertag einträgt. Absatz 1 lädt aber zu Zeiträumen ein («zum Beispiel ein Quartal oder ein Jahr»). Ein Zeitraum 20.12.2024 – 10.01.2025 für Heizöl, das am 20.12.2024 geliefert wurde, zählt ganz in 2025, obwohl es im Endbestand 2024 steckt.

**Zur Frage des Product Owners: Soll der Text sagen, dass nur das Ende zählt?** Ja, in einem kurzen Satz. Die Anweisung «Beginn und Ende: der Tag der Lieferung» ist das Wichtigste, denn mit ihr spielt die Regel keine Rolle mehr. Der Satz zum Ende erklärt, was mit schon erfassten Zeiträumen geschieht (auch mit alten Rechnungen, die dem bisherigen Absatz 1 gefolgt sind), und der Satz zum Rechnungsdatum zeigt, wann die Eingabe nötig ist.

**Korrektur.** Den letzten Satz von `invoices_service_period_help` («Nicht für Lieferungen …») in allen vier Sprachen streichen und `invoices_service_period_fuel` ersetzen durch:
- de: «Bei einer Lieferung von Heizöl, Flüssiggas, Pellets oder Holz zählt der Verbrauch über den Tankbestand des Gebäudes. Tragen Sie als Beginn und als Ende den Tag der Lieferung ein. Die Lieferung zählt dann ganz in der Abrechnungsperiode dieses Tages, auch wenn die Rechnung erst später kommt. Ohne Leistungszeitraum zählt das Rechnungsdatum, bei einem längeren Zeitraum dessen letzter Tag.»
- fr: «Pour une livraison de mazout, de gaz liquide, de pellets ou de bois, la consommation compte via le stock de combustible de l’immeuble. Saisissez le jour de la livraison comme début et comme fin. La livraison compte alors entièrement dans la période de décompte de ce jour, même si la facture n’arrive que plus tard. Sans période de prestation, c’est la date de facture qui compte ; pour une période plus longue, son dernier jour.»
- it: «Per una fornitura di olio combustibile, gas liquido, pellet o legna il consumo conta tramite la scorta di combustibile dell’immobile. Inserisca il giorno della fornitura come inizio e come fine. La fornitura conta allora interamente nel periodo di conteggio di quel giorno, anche se la fattura arriva più tardi. Senza periodo di prestazione conta la data della fattura; per un periodo più lungo, il suo ultimo giorno.»
- en: «For a delivery of heating oil, LPG, pellets or wood, the consumption counts through the building’s fuel stock. Enter the day of delivery as both start and end. The delivery then counts in full in the billing period of that day, even if the invoice arrives later. Without a service period the invoice date counts; for a longer period, its last day.»

Danach folgen: die Erwartung in `tests/e2e/features/invoice-new.feature:55` (z.B. «Tragen Sie als Beginn und als Ende den Tag der Lieferung ein.») und `invoice-pages.dom.test.ts:815`. Weil der Product Owner den kurzen Text bei M-1 nur sinngemäss entschieden hat («with help text at the field»), ist der Wortlaut frei. Die Streichung in Absatz 1 ändert einen bestehenden Text, ein Entscheid dazu ist mir nicht bekannt (`git log -S` führt nur zu Commits ohne Issue-Entscheid).

## Weitere vorgeschlagene Texte

**V-15** (neue Meldung `statements_heating_whole_text_many`, gezeigt bei mehr als einer Kategorie; jede Kategorie in eigenen Anführungszeichen, verbunden mit «, » bzw. «und»):
- de: «Diese Rechnungen der Kategorien {categories} haben keinen Leistungszeitraum, andere derselben Kategorie schon. Tragen Sie bei jeder den Leistungszeitraum ein, damit jeder Mieter die Kosten seiner Monate trägt. Gilt eine Rechnung für die ganze Abrechnungsperiode, tragen Sie diese ein.» ({categories} z.B. «Heizung» und «Fernwärme»)
- fr: «Ces factures des catégories {categories} n’ont pas de période de prestation, alors que d’autres de la même catégorie en ont une. …» (Rest wie die Einzahl)
- it: «Queste fatture delle categorie {categories} non hanno un periodo di prestazione, altre della stessa categoria sì. …»
- en: «These invoices in the categories {categories} have no service period, while others in the same category do. …»

Einfacher geht es auch: die Kategorie ganz weglassen («Diese Rechnungen haben keinen Leistungszeitraum, andere Rechnungen derselben Kategorie schon.»), denn die Liste darunter nennt jede Rechnung.

**V-18** (Glossar, Issue `fachlich` + `entscheiden`): «**Heizrechnung**: Rechnung einer Heizkosten-Kategorie; in Hinweisen des Abrechnungslaufs verwendet.» Alternative: im entschiedenen Text «der Rechnungen der Heizkosten», wie es die Szenarien jetzt schreiben. Dafür müsste der Product Owner den entschiedenen Text ändern.

## Nachgerechnet (bestätigt)

| Betrag | Rechnung | Ergebnis |
|---|---|---|
| 418.90 (`statement-pdf.pg.test.ts`, «zählt eine Lieferung ganz …») | Anfangsbestand 600; Lieferungen mit Ende in 2025: 1'000 (15.12.2025) + 300 (20.12.2024 – 10.01.2025) = 1'300; die über 700 (Ende 10.02.2026) zählt nicht; Endbestand 800. Verbrauch 600 + 1'300 − 800 = 1'100.00. Eine Wohnung, 70/70 m²; Mietstage 15.08. – 31.12. = 139; 1'100 × 139/365 = 418.904 | 418.90, und «Rechnungen «Heizung» in der Abrechnungsperiode CHF 1'300.00» bestätigt. Gegenprobe Periode 2024: die 300 hat ihr Ende nach dem 31.12.2024 und fällt dort weg, gezählt wird sie also genau einmal. Periode 2026: die 700 überschneidet 2026 und zählt dort ganz. |
| 533.15 / 228.49 (it.each Tank) | 600 + 900 − 100 = 1'400 × 139/365 = 533.150; 100 + 900 − 400 = 600 × 139/365 = 228.493 | bestätigt; Lieferung Jul – Sep in der Periode, ganz gezählt |
| 459.78 (Summe null) | +900 Jul – Sep (47/92), −900 Apr – Jun (0/91): 900 × 47/92 = 459.783; × 70/70 m² = 459.78. Kosten des Gebäudes 0.00; den Ausgleich −459.78 trägt der Vormieter bzw. der Vermieter (Leerstand) | bestätigt; Zeitanteil «–» |
| 900.00 bei 300 % | Einzug 01.07.; +900 Jul – Sep (92/92), −600 Apr – Jun (0/91); Kosten 300.00; Ihr Anteil 300 × (900 − 0)/300 = 900.00; Zeitanteil 900/300 = 300 %; Leerstand Apr – Jun −600 | bestätigt; Satz `sharesNoteAbove` steht dabei |
| 229.89 (Render, vier Sprachen) | (900 × 47/92 − 900 × 0/91) × 70/140 m² = 459.783 × 0.5 = 229.89; ohne `keyShare` «× 50.00 %» | bestätigt |
| −76.63 (Render) | +900 Apr – Jun (0/91), −300 Jul – Sep (47/92); 300 × (0 − 153.261)/600 = −76.630; Zeitanteil −153.261/600 = −25.54 % | bestätigt; Satz `sharesNoteBelow` steht dabei |
| 345.54 (Render) | 600 × (900 × 47/92 − 300 × 139/365)/600 = 459.783 − 114.247 = 345.536 | bestätigt |
| 183 / 91 Tage, 905.03 | 01.10.2023 – 31.03.2024 = 31+30+31+31+29+31 = 183; Jan – Mär 2024 = 91; 1'820 × 91/183 = 905.027 | bestätigt |
| 92 / 62 Tage, 606.52 | Jul – Sep 92, Jul – Aug 62; 900 × 62/92 = 606.52 | bestätigt |
| 15.68 % | 18.00 % × 27/31 = 15.677 % | bestätigt |
| −500.00 (Heizung, Summe null) | 1'000 Jan – Mär × 0.00 % (Einzug Mai) − 1'000 ohne Leistungszeitraum × 50.00 % = −500.00 | bestätigt (zur Schreibweise V-17) |

## Bestätigt (Regeln und Texte)

- **M-1, Regel:** Sie entspricht Art. 5 Abs. 2 lit. a VMWG, wenn das Ende des Leistungszeitraums der Liefertag ist (V-14). Randfall `covered` (`fuel-stock.service.ts:42`): Gilt der Tank in einer Periode N, in N+1 aber nicht mehr (Endbestand 0 und kein späterer Stichtag), zählt eine Lieferung über den Jahreswechsel in N gar nicht und in N+1 nur mit ihrem Teil. Der Rest geht zulasten des Vermieters, nicht der Mieter. Der umgekehrte Fall ist nicht möglich, denn ein späterer Stichtag macht auch N «covered». Bei einem stillgelegten Tank ist das praktisch bedeutungslos; kein Befund.
- **Regel 5 in `docs/nebenkostenabrechnung-anforderungen.md`:** Sie gibt die Regel M-1, die Beispiele nach V-8 und V-11 (de), «Zeitanteil» in der Berechnung, «–» bei negativen Beträgen, die Hinweise der Punkte 5 und 6 und `INVOICE_AMOUNT_NEGATIVE` richtig wieder.
- **Punkt 5, Bedingung** (`invoice-completeness.service.ts` `oldHeatingRule`, `statement-generation.ts` `rebills`): Die Abrechnung ist versendet oder bezahlt, nach Heizprofil, ohne Rechnungszeile nach den Monaten; eine Heizkostenrechnung hat jetzt einen Leistungszeitraum, und der Lauf rechnet einen anderen Mietvertrag derselben Wohnung ab. Das passt zum Text.
- **Punkt 6, Bedingung:** Nur bei einem Mieterwechsel mit Heizprofil, ohne die Tank-Kategorie (deren Lieferungen nach M-1 zählen). Das passt.
- **Zeilennamen nach V-8** in vier Sprachen: «Rechnung vom … (Nr. …), Leistungszeitraum …»; fr/it/en mit Kleinbuchstaben nach dem Komma («Facture du … (n° …), période de prestation …»); die Veränderung des Tankbestands trägt nie einen Namen.
- **`sharesNoteRoundedHeating`** («Der Prozentwert ist gerundet.») bei einer Heizposition nach Heizprofil; Punkt 3 erfüllt.
- **Szenarien:** `statement-detail.feature` und `statement-generate.feature` folgen den Texten. `invoice-new.feature:51-55` folgt dem heutigen Text (siehe V-14).

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

- «Heizrechnung» (V-18): «**Heizrechnung**: Rechnung einer Heizkosten-Kategorie.»
- «Lieferdatum» bzw. «Tag der Lieferung» (V-14, Regel 5): als Ergänzung zu «Verbrauch (Heizmaterial)»: «Eine Lieferung zählt ganz in der Abrechnungsperiode ihres Lieferdatums: das Ende ihres Leistungszeitraums, ohne Leistungszeitraum das Rechnungsdatum.» (schon in Runde 1 vorgeschlagen, im Glossar noch nicht vorhanden)

## Nicht bestätigt

- **Fedlex:** Die Wortlaute von Art. 5 Abs. 2 lit. a und Art. 8 Abs. 2 VMWG habe ich aus dem Bericht von Runde 1 übernommen (dort aus Fedlex, Fassung 1.10.2025), nicht noch einmal abgerufen.
- **Demo-Daten:** Die `UPDATE`-Anweisung in `backend/demo/demo-data.sql` setzt den Leistungszeitraum auf «erster Tag zwei Monate vor dem Rechnungsdatum bis Rechnungsdatum». Das stimmt nur, wenn die Quartalsrechnungen auf das Quartalsende datiert sind; bei einem Rechnungsdatum im Januar oder Februar ergäbe `make_date` einen Monat ≤ 0. Ob die sechs Rechnungen so datiert sind und ob ihre Kategorie nicht die Tank-Kategorie ist (sonst zählte M-1), habe ich nicht nachgesehen; `demo-data.pg.test.ts` nicht gelesen.
- **Detailseite:** Was `CostTable.svelte` bei einer Summe null und bei einem Zeitanteil über 100 % oder unter 0 % zeigt, habe ich nicht geprüft.
- **Schrift im PDF:** Ob die PDF-Schrift U+2212 darstellen kann (V-17), habe ich nicht geprüft.
- **E2E:** Die Szenarien habe ich nur gelesen, nicht ausgeführt.
