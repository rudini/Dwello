# Fachreview #451, Runde 3 (fr/it/en nach der Umsetzung, 5b5dd2f1)

Gegenstand: alle Texte von #451 in de/fr/it/en, wie sie in 5b5dd2f1 umgesetzt sind: `backend/src/services/pdf.service.ts` (partNoPeriod, partBeyond, partStock, partLine, partShare, partShareZero, partNamed, partName, partNameNumber, partNameNone, monthSplit, sharesNoteRounded, sharesNoteRoundedHeating, sharesNoteAbove, sharesNoteBelow, sharesNoteParts, sharesNoteFuel), `messages/{de,fr,it,en}.json` (backend_invoice_amount_negative, statements_existing_old_heating_rule, statements_heating_whole_title/_text/_text_many, statements_heating_category, invoices_service_period_help, invoices_service_period_fuel, statements_part_share_zero) und die Zeilen «Heizrechnung» und «Verbrauch (Heizmaterial)» in `UBIQUITOUS_LANGUAGE.md`. Worktree `review-451-fach3` (detached, 5b5dd2f1). Vorberichte: `docs/reviews/451-fachreview-1.md`, `451-fachreview-2.md`. Massstab: `docs/design/i18n-begriffe.md` (Begriffe, Stil Z. 5). Tests habe ich keine ausgeführt.

## Status der offenen Befunde aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| V-14 | erledigt | `invoices_service_period_fuel` in allen vier Sprachen wörtlich wie vorgeschlagen. Der letzte Satz von `invoices_service_period_help` ist in allen vier Sprachen gestrichen. `InvoiceDataFields.svelte:89` zeigt den Absatz nur bei einer Brennstoff-Kategorie. Nachgeführt: `invoice-new.feature:55`, `invoice-pages.dom.test.ts:813`. Die Feldnamen «Beginn/Ende», «Début/Fin», «Inizio/Fine», «Start/End» (`invoices_start`/`invoices_end`) passen zum Text. |
| V-15 | erledigt | `statements_heating_whole_text_many` in vier Sprachen. `statement-wizard.ts:328-334` setzt jede Kategorie in eigene Anführungszeichen (`statements_heating_category`: «…» / « … » mit geschütztem Leerzeichen / «…» / ‘…’) und verbindet sie mit `Intl.ListFormat` der Sprache («und», «et», «e», «and»). Zum letzten Satz siehe V-22. |
| V-16 | erledigt | fr/it/en `partNoPeriod`: «… sur {total} jours», «… su {total} giorni», «… of {total} days» (`statement-pdf-render.test.ts:480-482, 493-495`). |
| V-17 | offen (Nit), unverändert | `formatCHF` (`pdf-format.ts:13`) setzt weiter «-» (Bindestrich) vor negative Beträge. In den Berechnungszeilen steht «–» (`partLines`, Test Z. 441-443). Zur Detailseite siehe V-24. |
| V-18 | erledigt | Glossarzeile «Heizrechnung» (UBIQUITOUS Z. 143). fr/it/en des entschiedenen Textes sagen «des factures» / «delle fatture» / «of the invoices». Das «Heiz-» fällt dort weg, ergibt sich aber aus «frais de chauffage» im selben Satz. Die Bedeutung ist dieselbe. |
| V-19 | offen (Nit), Entscheid des Product Owners | `partBeyond` in allen vier Sprachen unverändert: «(Rechnung CHF … für … Tage)», «(facture de CHF … pour … jours)», «(fattura di CHF … per … giorni)», «(invoice of CHF … for … days)». |
| V-20 | erledigt | wie V-14: Der Absatz steht nur bei einer Brennstoff-Kategorie. |
| V-7 (Rest) | offen (Nit), unverändert | Ohne `keyShare` druckt `keyFactor` den gerundeten Prozentwert. |

## Neue Befunde

| ID | Rolle | Schwere | Befund | Empfehlung eindeutig? |
|---|---|---|---|---|
| V-21 | Verwalter | Minor | it `sharesNoteFuel` schreibt «combustibile in cisterna». Der Begriff für «Tank» ist «serbatoio» (`i18n-begriffe.md:100`), und `it.json` sagt überall «serbatoio» (Z. 327, 328, 366, 1082, 1288, 1290, 1449). Fix: «… per il combustibile del serbatoio …» (Text unten). | ja |
| V-22 | Verwalter | Minor | de/fr `statements_heating_whole_text(_many)`, letzter Satz: «tragen Sie diese ein» bzw. «saisissez celle-ci» kann sich auf die Rechnung oder auf die Abrechnungsperiode beziehen (beide feminin). it «inserisca questo» und en «enter that period» sind eindeutig. Fix siehe unten, dazu `statement-generate.feature:666`. | ja |
| V-23 | Verwalter / Mietrecht | Minor | Glossar «Verbrauch (Heizmaterial)»: «Eine Lieferung zählt ganz in der Abrechnungsperiode ihres Lieferdatums …» steht ohne Bedingung direkt nach «Fehlt der Anfangs- oder Endbestand, rechnet Dwello die Lieferungen ab.» Der Code zählt eine Lieferung aber nur dann ganz, wenn der Tank in der Periode Anfangs- und Endbestand hat (`invoice.service.ts:574`, `delivery = !!tank?.covered && …`). Sonst wird ein längerer Leistungszeitraum nach Tagen geteilt (`inPeriod`). | ja (Wortlaut unten); die Zeile hat der Product Owner angeordnet, also Issue `fachlich` + `entscheiden` |
| V-24 | Verwalter | Minor | Detailseite `statements_part_share_zero`: Die Summe steht als «(900.00 × 47/92 + -900.00 × 0/91)» (`LineInvoices.svelte:30`, Test `statement-pages.dom.test.ts:805`). Das PDF schreibt «(900.00 × 47/92 – 900.00 × 0/91)» (#257). Rechnungen, die zusammen null ergeben, haben immer einen negativen Betrag, also erscheint «+ -» hier jedes Mal. In `statements_part_share` gab es das bei Gutschriften schon vorher (Test Z. 795). Fix: die Summe wie `partLines` in `pdf.service.ts:846` bilden, mit Betrag ohne Vorzeichen und «–»/«+» davor. | ja |
| V-25 | Verwalter | Nit | en `sharesNoteFuel` sagt «the fuel consumed», der Begriff ist «consumption» (`i18n-begriffe.md:100`; de «der Verbrauch», fr «la consommation», it «il consumo»). Fix: «Building costs for fuel from a tank: the consumption (see ‘Heating and hot water costs’). It counts for the whole billing period, even if a delivery has a service period.» | ja |
| V-26 | Verwalter | Nit | `sharesNoteBelow`: it «mentre le fatture della stessa voce non lo sono» ist holprig, weil «lo» für «relative ai suoi giorni» steht. Fix: «… mentre le fatture della stessa voce non li riguardano: Lei riceve …». en «the invoices of the same line» weicht vom Begriff «statement line» ab (`i18n-begriffe.md:71`). Fix: «… but the invoices of the same statement line do not: …». | ja |
| V-27 | Verwalter | Nit | Detailseite `statements_part_share_zero`: Der Text nennt statt einer Zahl nur «Anteil Ihrer Wohnung nach dem Verteilschlüssel», das PDF dagegen «× 70.00 / 140.00 m² (…)». Der Vermieter kann auf der Detailseite also nicht nachrechnen. `StatementLineItem` (`src/lib/types.ts:284`) hat kein `keyShare`. Optional: den Bruch mitliefern oder den Namen des Verteilschlüssels nennen (`distributionKeyName`). Der Wortlaut selbst ist in vier Sprachen richtig und gleichbedeutend. | nein (braucht Daten aus dem Backend; ob es nötig ist, entscheidet der Product Owner) |
| V-28 | Verwalter | Nit | `invoices_service_period_fuel`, erster Satz: «zählt der Verbrauch über den Tankbestand» / «la consommation compte via le stock» / «il consumo conta tramite la scorta» / «the consumption counts through». Das ist verständlich, aber nicht idiomatisch. Möglich wäre: de «… wird der Verbrauch über den Tankbestand des Gebäudes abgerechnet.», fr «… la consommation est décomptée d’après le stock de combustible de l’immeuble.», it «… il consumo viene conteggiato in base alla scorta di combustibile dell’immobile.», en «… the consumption is billed from the building’s fuel stock.» | nein (Stilfrage, optional) |
| V-29 | Verwalter | Nit | Bei einer Brennstoff-Kategorie steht der Absatz zu Lieferungen an vierter Stelle, nach drei Absätzen, die für Zeiträume das Gegenteil sagen («Dann zählen nur die Tage, die in die Abrechnungsperiode fallen», Kosten über mehrere Jahre, Entkalken) (`InvoiceDataFields.svelte:86-89`). Optional: bei Brennstoff den Absatz zuerst zeigen. | nein (Reihenfolge in der Oberfläche, optional) |

## Texte zu den Befunden

**V-21** (it `sharesNoteFuel`, `pdf.service.ts:333`):
«Costi immobile per il combustibile del serbatoio: il consumo (vedi spese di riscaldamento e acqua calda). Conta per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione.»
(Den Verweis «vedi spese di riscaldamento e acqua calda» ohne Anführungszeichen lasse ich so: Er folgt `partProfileRun` it und der deutschen Fassung «siehe Heiz- und Warmwasserkosten».)

**V-22** (letzter Satz von `statements_heating_whole_text` und `_text_many`, beide Schlüssel gleich):
- de: «Gilt eine Rechnung für die ganze Abrechnungsperiode, tragen Sie die Abrechnungsperiode als Leistungszeitraum ein.»
- fr: «Si une facture vaut pour toute la période de décompte, saisissez cette période comme période de prestation.»
- it: unverändert («… inserisca questo.»), oder parallel zu fr: «Se una fattura vale per l’intero periodo di conteggio, inserisca questo periodo come periodo di prestazione.»
- en: unverändert («… enter that period.»)

Danach folgt `tests/e2e/features/statement-generate.feature:666`. Diesen Text hatte ich in Runde 1 (V-4) selbst so vorgeschlagen; ein Entscheid des Product Owners zum Wortlaut ist mir nicht bekannt.

**V-23** (Glossar, nur über ein Issue; UBIQUITOUS bleibt unverändert):
«**Verbrauch (Heizmaterial)**: Anfangsbestand plus Lieferungen der Abrechnungsperiode minus Endbestand, in CHF; das wird als Heizkosten abgerechnet (Art. 5 Abs. 2 lit. a VMWG). Mit Anfangs- und Endbestand zählt eine Lieferung ganz in der Abrechnungsperiode ihres Lieferdatums: das Ende ihres Leistungszeitraums, ohne Leistungszeitraum das Rechnungsdatum (#451). Fehlt der Anfangs- oder Endbestand, rechnet Dwello die Lieferungen ab, jede wie eine Rechnung mit den Tagen ihres Leistungszeitraums in der Periode.»
Zum Hilfetext `invoices_service_period_fuel`: Er braucht keine Änderung. Wer der Anweisung folgt (Beginn = Ende = Tag der Lieferung), bekommt in beiden Fällen dieselbe Periode, denn ein Tag lässt sich nicht teilen. Nur der Nachsatz «bei einem längeren Zeitraum dessen letzter Tag» stimmt ohne Tankbestand nicht. Der erste Satz des Hilfetexts setzt aber einen Tankbestand voraus, und ohne Bestand warnt der Abrechnungslauf ohnehin (`statements_finding_stock_tail`). Deshalb kein eigener Befund.

**V-24** (Detailseite, Summe): Erwartung in `statement-pages.dom.test.ts:805` neu «Ihr Anteil: (900.00 × 47/92 – 900.00 × 0/91) × Anteil Ihrer Wohnung nach dem Verteilschlüssel = 229.89», in Z. 795 entsprechend «(600.00 × 91/91 – 100.00 × 92/92)».

## Bestätigt (Texte in vier Sprachen)

Geprüft auf Begriffe nach `i18n-begriffe.md`, geschützte Leerzeichen im Französischen und gleiche Aussage wie im Deutschen.

- **Geschützte Leerzeichen fr:** In allen neun `fr.json`-Schlüsseln des Gegenstands steht vor «:», «;», «?» und innerhalb von « » ein U+00A0 (maschinell geprüft, kein Treffer ohne). Im PDF steht `colon` fr « : », dazu ` ` in `sharesNoteRounded`, `sharesNoteBelow`, `sharesNoteFuel` (« Frais de chauffage et d’eau chaude »), «n° », « %» in `monthSplit` und «jours de location».
- **partNoPeriod, partBeyond, partStock, partLine, partShare, partShareZero:** gleichbedeutend. Die Begriffe stimmen: période de prestation / periodo di prestazione / service period; période de décompte / periodo di conteggio / billing period; jours de location / giorni di locazione / days rented; part temporelle / quota temporale / time share; variation du stock de combustible / variazione della scorta di combustibile / change in fuel stock; clé de répartition / chiave di riparto / distribution key. In it steht die Wortfolge «{days} giorni di locazione su {total}» (V-9).
- **partNamed, partName, partNameNumber, partNameNone:** «Facture du … (n° …)», «Fattura del … (n. …)», «Invoice dated … (no. …)». Nach dem Komma folgt ein Kleinbuchstabe (`partNamedLower` fr/it/en, Test Z. 508-510). Die Abkürzungen entsprechen dem Gebrauch in der Schweiz.
- **monthSplit:** «janv. 15.68 % (18.00 % × 27/31 jours)», «gen 15.68 % (… giorni)», «Jan … days». Die Monatskürzel folgen `months` der Sprache. 18.00 × 27/31 = 15.677 → 15.68 (wie Runde 2).
- **sharesNoteRounded, sharesNoteRoundedHeating, sharesNoteParts, sharesNoteAbove:** gleichbedeutend. it «Lei» gross und «sua/suo» klein wie im übrigen PDF (z.B. `noteReceipts`).
- **sharesNoteBelow fr, sharesNoteFuel de/fr:** gleichbedeutend, fr «citerne» = Tank nach `i18n-begriffe.md:100`.
- **backend_invoice_amount_negative:** note de crédit / nota di credito / credit note, décomptée / conteggiata / billed (`i18n-begriffe.md:43, 54`), décompte rectificatif / conteggio rettificato / corrected statement (Z. 79), «établissez» / «allestisca» (Z. 81).
- **statements_existing_old_heating_rule:** Die Texte sind entschieden (V-3). fr/it/en geben den deutschen Text wieder (zu «Heizrechnungen» siehe V-18).
- **statements_heating_whole_title:** «Frais de chauffage : factures sans période de prestation», it/en entsprechend.
- **statements_heating_whole_text(_many)**, ohne den letzten Satz (V-22): gleichbedeutend, «locataire / inquilino / tenant» (Z. 20). Die Mehrzahl «catégories / categorie / categories» mit «derselben Kategorie» in der Einzahl ist richtig.
- **invoices_service_period_help:** In allen vier Sprachen endet der Text mit dem Satz über die Tage in der Abrechnungsperiode. Der gestrichene Satz fehlt überall.
- **invoices_service_period_fuel:** gleichbedeutend. Swiss usage: «mazout», «gaz liquide», «olio combustibile», «gas liquido» wie in `buildings_fuel_intro` der jeweiligen Sprache, en «heating oil, LPG» wie `en.json` sonst. «Saisissez» / «Inserisca» passen zum Verb des Formulars.
- **statements_part_share_zero:** Der Wortlaut ist in vier Sprachen gleichbedeutend und passt zu `partShareZero` im PDF. fr «part de votre logement» folgt dem PDF («Part du logement»); `i18n-begriffe.md` Z. 3 lässt das zu, obwohl die Tabelle «appartement» nennt. «Ihr Anteil», «Ihre Wohnung» auf der Detailseite des Vermieters folgen `statements_part_share` und den übrigen `statements_part_*` (vorher schon so). Siehe V-24 und V-27.
- **Glossar «Heizrechnung»:** Die Definition passt zu `is_heating_cost` (`schema.ts:198`). Der einzige Text mit dem Wort ist `statements_existing_old_heating_rule`, ein Hinweis des Abrechnungslaufs (`statement-wizard.ts:325`). Die Zeile ist also richtig.
- **Glossar «Verbrauch (Heizmaterial)»:** Die Regel entspricht dem Code bei vorhandenem Tankbestand (`invoice.service.ts:574-585`) und der Zeile «Anteil nach Heizprofil» («Rechnungen einer Kategorie mit Tankbestand zählen immer über die ganze Periode»). Zur fehlenden Bedingung siehe V-23. Rechtsgrundlage: Art. 5 Abs. 2 lit. a VMWG «die Brennstoffe und die Energie, die verbraucht wurden» (Wortlaut aus Fedlex, Bericht Runde 1).

## Nachgerechnet

| Text | Rechnung | Ergebnis |
|---|---|---|
| partShareZero (Render Z. 441-443) | (900 × 47/92 − 900 × 0/91) × 70/140 = 459.783 × 0.5 = 229.89 | bestätigt in vier Sprachen |
| Detailseite, Summe null (dom Z. 805) | dieselben Teile; 229.89 = 459.78 × 50 % | bestätigt (zur Schreibweise V-24) |
| partNoPeriod (Render Z. 480-482) | Mietstage 15.08. – 31.12.2025 = 17+30+31+30+31 = 139 von 365 | bestätigt |
| partBeyond (Render Z. 480-482) | 01.11.2025 – 31.01.2026 = 30+31+31 = 92 Tage, davon 61 in 2025; 1'200 × 61/92 = 795.652 → 795.65 | bestätigt |
| Randfall Lieferung ohne Tankbestand (V-23) | Heizöl 1'000, Leistungszeitraum 20.12.2025 – 10.01.2026 (22 Tage), Tank ohne Endbestand 2025: 2025 zählt 1'000 × 12/22 = 545.45, 2026 der Rest 454.55. Mit Anfangs- und Endbestand: 2025 nichts, 2026 1'000 ganz. | Der Code macht das so. Das Glossar sagt in beiden Fällen «ganz». |

## Fehlende Begriffe

- «Lieferung (Heizmaterial) / Tag der Lieferung» fehlt in `docs/design/i18n-begriffe.md`. Die Texte übersetzen einheitlich mit livraison / jour de la livraison, fornitura / giorno della fornitura, delivery / day of delivery. Eine Zeile mit genau diesen Wörtern würde das festhalten. Diese Datei ist nicht das Glossar, ein `entscheiden`-Issue braucht es dafür nicht.
- Zu V-23 (Glossar «Verbrauch (Heizmaterial)»): Issue mit `fachlich`, `entscheiden` und dem Wortlaut oben.

## Nicht bestätigt

- **Fedlex:** Diese Runde habe ich nicht neu auf Fedlex nachgeschlagen. Eine Suche mit `mmx search` zu Art. 8 Abs. 2 OBLF fand nur lexfind.ch, nicht Fedlex. Die französischen und italienischen Begriffe stützen sich deshalb auf `i18n-begriffe.md`, nicht auf den Verordnungstext.
- **`Intl.ListFormat` für `en-CH`:** Ob bei drei und mehr Kategorien ein Komma vor «and» steht (Oxford comma), habe ich nicht ausgeführt, nur gelesen.
- **V-17 in der Tabelle:** Wie eine negative Zelle «Ihr Anteil» im PDF jetzt aussieht, hält kein Test mehr fest. Der frühere Test zur Heizposition mit Summe null prüft nur noch die Berechnungszeile (`statement-pdf.pg.test.ts:447-448`). Nicht ausgeführt.
- **Render-Tests:** `sharesNoteAbove`, `sharesNoteBelow`, `sharesNoteFuel`, `sharesNoteRoundedHeating` und `monthSplit` habe ich in fr/it/en nur im Quelltext gelesen. In `statement-pdf-render.test.ts` fand ich für sie keine Erwartung in diesen Sprachen. Keine Tests ausgeführt.
- **E2E:** Die Szenarien habe ich nur gelesen, nicht ausgeführt.
