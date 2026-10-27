# Fachreview #890, Runde 1: Hinweis auf verschiedene Verteilschlüssel der Lieferungen für den Tank

Gegenstand: Szenario «Die Prüfung nennt verschiedene Verteilschlüssel der Lieferungen für den Tank» (`tests/e2e/features/statement-generate.feature:305-314`, @wip) und der geplante Befund der Kategorienprüfung, Worktree bei 4e6ffb2b.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Der Hinweis muss den Schlüssel aus demselben `keyFor`-Aufruf nennen, mit dem `fuelStockChange` die Veränderung verteilt, und ausser den Lieferungen untereinander auch die Lieferungen mit diesem Schlüssel vergleichen. Sonst nennt er einen falschen Schlüssel oder bleibt still, obwohl die Veränderung anders verteilt wird. |
| V-2 | Verwalter | Minor | Eine Lieferung ohne Verteilschlüssel (vor #379 erfasst) wird «Gleichmässig pro Wohnung» verteilt (`messages/de.json`, `invoices_key_missing_note`), `keyFor` überspringt sie aber (`fuel-stock.service.ts:71`). Fix: Für den Vergleich `null` als eigenen Schlüssel zählen und nicht weglassen. |
| V-3 | Verwalter | Minor | Ist die Veränderung Tankbestand 0 (Anfangsbestand = Endbestand), ändert ihr Schlüssel keinen Betrag, und der Hinweis wäre nur Rauschen. Fix: Den Befund nur zeigen, wenn `inPeriod.amount !== 0`, falls das Product Owner die Option-1-Regel so liest. Sonst bleibt es wie entschieden. |
| V-4 | Verwalter | Minor | Das Szenario zeigt nicht, worauf sein «Dann» beruht: Dass die erste Rechnung nach «Fläche» verteilt wird, versteckt sich im Fixture (`tests/e2e/fixtures/backend.ts:104`, `Per Area (m²)`). Ausserdem pinnt es nicht «Hinweis, keine Bestätigung». Fix: Bei der ersten Rechnung «nach dem Verteilschlüssel "Fläche"» angeben (die Variante des Steps ohne «danach» fehlt noch) und `Und verlangt die Vorschau keine Bestätigung` ergänzen. |

## V-1 (Major): welche Menge «Lieferungen der Periode», welcher Schlüssel

Belege:
- `UBIQUITOUS_LANGUAGE.md:154` (Verbrauch): «Mit Anfangs- und Endbestand zählt eine Lieferung ganz in der Abrechnungsperiode ihres Lieferdatums: das Ende ihres Leistungszeitraums, ohne Leistungszeitraum das Rechnungsdatum (#451).» Die geplante Menge stimmt damit: die umlagefähigen Rechnungen der Kategorie des Tankbestands, die `getInvoicesForStatement` liefert (`invoice.service.ts:592-610`, Überschneidung mit der Periode und `servicePeriodEnd <= periodEnd`, also Lieferdatum in der Periode). Diese Menge ist zu verwenden, nicht eine eigene Abfrage nach Rechnungsdatum.
- `keyFor` (`fuel-stock.service.ts:59-82`) wählt dagegen nach **Rechnungsdatum** (`lte(invoices.invoiceDate, upTo)`), aus allen Jahren, und ohne Rechnung bis zum Periodenende irgendeine spätere. Die Rechnung, die den Schlüssel bestimmt, gehört also nicht immer zu den Lieferungen der Periode:
  1. Periode 2024. Lieferung X: Rechnung vom 15.02.2024 ohne Leistungszeitraum, «Fläche». Lieferung Y: Leistungszeitraum bis 28.12.2023, Rechnung vom 01.03.2024, «Pro Einheit». Y zählt in 2023. Lieferungen 2024 = {X}, also nur ein Schlüssel und kein Hinweis nach der geplanten Regel. `keyFor` nimmt aber Y (01.03.2024 ist die letzte Rechnung bis zum 31.12.2024), und die Veränderung wird nach «Pro Einheit» verteilt.
  2. Periode 2024: einzige Lieferung mit Leistungszeitraum bis 20.12.2024, Rechnung vom 10.01.2025, «Pro Einheit». Die letzte Rechnung bis 31.12.2024 ist eine aus 2023 nach «Fläche». Die Lieferung zählt in 2024, die Veränderung wird nach «Fläche» verteilt, und es gibt keinen Hinweis.
  3. Lieferungen 2024 nach «Fläche» (Juni) und «Pro Einheit» (Lieferdatum 20.12.2024, Rechnung 10.01.2025). `keyFor` nimmt die Juni-Rechnung. Ein Hinweis, der «die letzte Lieferung» selbst bestimmt, würde «Pro Einheit» nennen, also falsch.

Warum das zählt: Die Veränderung ist Teil eines einzigen Kostenpostens. VMWG Art. 5 Abs. 2 (Stand 1. Oktober 2025): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;». Der Verbrauch ist Anfangsbestand + Lieferungen − Endbestand. Wird ein Teil davon nach einem anderen Schlüssel verteilt, kann bei einer Wohnung ein Minus entstehen. Nachgerechnet mit 2 Wohnungen (80 m² / 20 m²): Lieferungen 1000 nach Fläche ergeben 800 / 200. Anfangsbestand 100, Endbestand 700, Veränderung −600 nach Pro Einheit ergibt −300 / −300. Ergebnis 500 / **−100**, Summe 400 = 100 + 1000 − 700. Mit einem einzigen Schlüssel (Fläche): 320 / 80. Fälle 1 und 2 sind genau der Fehler, den #890 zeigen soll.

Fix:
- Den Schlüssel der Veränderung aus dem Ergebnis von `fuelStockChange` übernehmen (`distributionKeyId`, `distributionKey`). Ihn nicht neu bestimmen.
- Den Befund zeigen, wenn die Menge {Schlüssel der Lieferungen der Periode} ∪ {Schlüssel der Veränderung} mehr als einen Eintrag hat (mit `null` als «Gleichmässig pro Wohnung», V-2).
- Bei mindestens zwei Lieferungen mit verschiedenen Schlüsseln deckt sich das mit dem Entscheid. In den Fällen 1 und 2 (eine Lieferung oder alle mit gleichem Schlüssel) ist der erste Satz des entschiedenen Textes ungenau. Der zweite Satz nennt den Schlüssel aber richtig, und die Fälle setzen einen Leistungszeitraum bei Lieferungen voraus, sind also selten. Ich halte den Text dafür für tragbar. Soll er in diesen Fällen anders lauten, ist das ein Entscheid des Product Owners.
- Den Schlüssel als `id` im Befund mitgeben und im BFF wie die Kategorie über `namesById(fetch, 'distribution-keys')` in die UI-Sprache übersetzen (`src/lib/server/statement-generation.ts:341-353` macht das schon für `categoryName`). Sonst steht in fr/it/en «Pro Einheit».
- `categoryInvoices` (`invoice-completeness.service.ts:197-215`) führt bisher kein `distributionKeyId` mit. Ergänzen oder die Lieferungen anders beziehen.
- Den neuen Befund **neben** `stockFinding` liefern, nicht an seiner Stelle. `stockFinding` gibt nur einen Befund zurück, und bei negativem Verbrauch (`kind: 'consumption'`, Zeile 258) müssen beide erscheinen. Gerade dann ist ein abweichender Schlüssel am folgenreichsten (siehe Rechnung oben).
- Wie geplant nur, wenn `fuelStockChange` eine Veränderung liefert, also mit Anfangs- und Endbestand und umlagefähiger Kategorie. Das deckt auch die laufende Periode und `noTank` ab.
- `needsConfirmation` (`src/lib/statement-wizard.ts:286`) nicht erweitern: Es ist ein Hinweis.

## Wortlaut

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_finding_stock_keys | Die Lieferungen der Kategorie {category} haben verschiedene Verteilschlüssel. Die Veränderung Tankbestand wird nach «{key}» verteilt. Prüfen Sie die Verteilschlüssel der Rechnungen. | Les livraisons de la catégorie {category} ont des clés de répartition différentes. La variation du stock de combustible est répartie selon « {key} ». Vérifiez les clés de répartition des factures. | Le forniture della categoria {category} hanno chiavi di riparto diverse. La variazione della scorta di combustibile è ripartita secondo «{key}». Verifichi le chiavi di riparto delle fatture. | The deliveries in the category {category} have different distribution keys. The change in fuel stock is distributed by «{key}». Check the distribution keys of the invoices. |

(fr: Guillemets mit geschütztem Leerzeichen innen, gemäss `docs/design/i18n-begriffe.md:5`; Begriffe aus den Zeilen 68, 73, 114/115 und 118. en: «» wie in `messages/en.json`, z.B. `buildings_saved_toast`.)

## Nicht bestätigt

- Ob `keyFor` nach Rechnungsdatum statt nach Lieferdatum wählen soll, habe ich nicht geprüft. #770 hat «letzte Rechnung bis zum Periodenende» entschieden, und es liegt ausserhalb dieses Auftrags. Gesucht habe ich nur in `fuel-stock.service.ts` und `UBIQUITOUS_LANGUAGE.md:154`, nicht in #770 selbst. Würde `keyFor` nach Lieferdatum wählen (Ende des Leistungszeitraums, sonst Rechnungsdatum, nur Lieferungen der Periode), entfielen die Fälle 1 und 2 von V-1. Das wäre ein eigenes Issue (`domain`, `needs-decision`).
- Den deutschen Namen des vordefinierten Schlüssels «Pro Einheit» (`nameDE`) habe ich in den Seeds nicht nachgesehen. Der Step `invoiceOnByKey` sucht ihn genau unter diesem Namen, das Szenario scheitert also schon in der Vorbereitung, falls er anders heisst.

Geprüft: Daten des Szenarios (Anfangsbestand 600, Endbestand 100, Veränderung 500, Verbrauch 600 + 1500 − 100 = 2000 ≥ 0, also kein Befund «consumption»; ohne Vorjahr keine Vergleichsbefunde; der Schlüssel der letzten Rechnung vom 15.10.2024 ist «Pro Einheit»); die Begriffe «Lieferung», «Veränderung Tankbestand», «Verteilschlüssel» und «Kategorie» stimmen mit `UBIQUITOUS_LANGUAGE.md` überein; der Hinweis erscheint nur mit beiden Tankbeständen; der Hinweis verlangt keine Bestätigung.
