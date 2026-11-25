# Fachreview #1478, Runde 1 der Feature-Review (Workflow 5)

Gegenstand: Persona-Bericht `docs/design/personas/weber-1478.md` (P-1 bis P-4) zum Stand e3a39ad, Worktree `review-1478-fach2`. Daten: `dwello_persona`. Die Kategorie «Holz» hat `is_fuel = t`. Darin liegen «Brennholz Buche, 6 Ster» (1'200.00, 30.09.–30.09.2025) und «Reinigung Holzofen» (184.00, 01.07.–31.12.2025). Gelesen wurden die PDFs `26-anna.pdf` und `27-pierre.pdf`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-6 | Verwalter/Mietrecht | Major | Im PDF steht fett `fuelIntro` «Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.». Für «Holz» ist das falsch, denn dort ist der Einkauf abgerechnet. Der neue Satz `sharesNoteDeliveryFuel` darüber sagt das Gegenteil. (P-1, Teil b) |
| V-7 | Verwalter | Minor | `sharesNoteDeliveryFuel` nennt die Kategorie nicht. Er sagt auch nicht, dass eine Rechnung über mehrere Tage in derselben Kategorie (Reinigung des Holzofens) keine Lieferung ist. Beim Tank sagt das `sharesNoteFuelOther`. Der Mieter kann den Satz darum keiner Zeile zuordnen. Fix: Wortlaut unten mit `{categories}`. Das lohnt sich: es ist ein `fill()` mit den Namen der Positionen, deren `tankDelivery === 'fuel'` ist. (P-3) |
| V-8 | Verwalter | Minor | Besteht schon auf der Basis, ist also kein Mangel dieser Änderung. Im Fall #1474 (gar kein Tankbestand) zählt jede eintägige Brennstoff-Rechnung als `delivery: true`. Hat das Gebäude dann Öl und Holz, heissen die Holzzeile `partDelivery` «Lieferung in den Tank» und `sharesNoteDelivery` «Lieferungen … in den Tank». Ohne Tankbestand kennt Dwello die Kategorie des Tanks nicht. Eine einfache Korrektur gibt es nicht; sie gehört in ein eigenes Issue. |
| V-9 | Verwalter | Minor | Besteht schon auf der Basis. `InvoiceFacts.svelte:20-26` blendet «Nur die Tage …» nur aus, wenn `!!tank` gilt, also bei irgendeinem erfassten Tankbestand des Gebäudes. Das Backend zählt aber auch dann eine Lieferung, wenn es gar keinen Tankbestand gibt und das Gebäude nicht «ohne Tank» erfasst ist (`invoice.service.ts:590`, #1474). In diesem Fall sagt die Rechnungsseite weiter «Nur die Tage in der Abrechnungsperiode zählen.». Fix: Bedingung `isFuel && (tank \|\| !noTank)` wie im Backend. Die Seite braucht dafür `noTank` des Gebäudes. |
| V-10 | Verwalter | Minor | Zu Marco P-1. Die Rechnungsseite einer eintägigen Rechnung einer anderen Brennstoff-Kategorie neben dem Tank sagt seit 396a597 nichts mehr dazu, wie sie zählt. Bei einer Rechnung der Kategorie des Tanks steht dagegen `invoices_tank_delivery` (`InvoiceFacts.svelte:30-36`). Die Seite ist nicht falsch, aber sie bricht mit der Hilfe beim Tank. Darum Minor. Fix: Bei `fuelDelivery` an der Stelle von «Nur die Tage …», im Block «Leistungszeitraum», den Text `invoices_fuel_delivery` zeigen (Wortlaut unten), mit `data-testid="invoice-fuel-hint"`. |

## V-6: `fuelIntro` widerspricht der Abrechnung von «Holz»

**Beleg:**
- `pdf-heating.ts:61,69` gibt `t.fuelIntro` immer aus, wenn `data.fuel` gesetzt ist. Der Text steht in `pdf-texts/de.ts:138`.
- Im PDF von Anna Schmidt (S. 2) steht direkt darüber `sharesNoteDeliveryFuel`: «… Seine Lieferungen in dieser Abrechnungsperiode sind deshalb als Verbrauch abgerechnet …».
- Darunter steht fett «Abgerechnet wird das verbrauchte Heizmaterial, nicht der Einkauf.».
- Der Kasten zeigt nur «Heizung». Die Position «Holz» (CHF 1'384.00) enthält den Einkauf von 1'200.00.

**Gesetz:** VMWG, Fedlex, Stand 1. Oktober 2025 (`eli/cc/1990/835_835_835/20251001`).
- Art. 5 Abs. 2 lit. a: «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;»

**Was der Product Owner entschieden hat und was ein Mangel ist:**
- Entschieden ist: Für die zweite Kategorie gibt es keinen eigenen Tankbestand, und ihre eintägige Rechnung zählt wie eine Lieferung ohne Tankbestand (#1474). Daraus folgt, dass ihr Einkauf als Verbrauch abgerechnet wird. Das ist die bewusste Abweichung von lit. a. Sie ist offengelegt, wie bei #1470/#1474. Daran ist nichts zu ändern.
- Ein Mangel ist, dass der fette Einleitungssatz diese Offenlegung für «Holz» aufhebt: Das PDF sagt dem Mieter ausdrücklich, der Einkauf sei nicht abgerechnet. Auf der Basis war der Satz für eine Holzrechnung neben dem Tank genauso falsch. Diese Änderung macht ihn aber sichtbar widersprüchlich, weil der neue Satz direkt darüber das Gegenteil sagt, und die Persona ist in ihrer Aufgabe darauf gestossen. Er gilt darum als Mangel dieser Änderung.

**Fix:**
- In `heatingSection` (`pdf-heating.ts`) `fuelIntroDeliveryFuel` statt `fuelIntro` ausgeben, wenn eine Position `tankDelivery === 'fuel'` hat. Das gilt auch für die Berechnung der Höhe (Zeile 61).
- `{categories}`: die Namen dieser Positionen (`item.category`, in der Sprache des PDF), durch «, » getrennt.
- Ohne eine solche Position bleibt `fuelIntro` unverändert. So bleiben alle bestehenden PDFs mit Tank gleich.
- Eine eigene Betragszeile «Holz» im Kasten ist nicht nötig. Der Kasten rechnet den Verbrauch aus dem Tank, und den Betrag zeigt die Position «Holz» in der Kostenübersicht.
- Ein Test prüft den Satz im PDF, z.B. eine weitere Zeile im Szenario `statement-detail.feature:842`.

**Nicht geändert werden muss:**
- `noteStock` «Über den Anfangs- und Endbestand des Heizmaterials erhalten Sie Auskunft (Art. 8 Abs. 2 VMWG).» bleibt richtig.
- Art. 8 Abs. 2 VMWG: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Das Recht gilt für alle Heizmaterialien, auch für Holz.
- Den Hinweis auf den Tank zu beschränken, hiesse das gesetzliche Recht zu verkürzen. Für Holz lautet die Auskunft dann eben: «kein Bestand erfasst, Einkauf abgerechnet». Das sagen `sharesNoteDeliveryFuel` und der neue Satz.

**P-1, Teil a (Hinweis an den Verwalter beim Neu berechnen) und P-4 (Detailseite):** kein Mangel dieser Änderung.
- Schon auf der Basis war der Holzeinkauf voll abgerechnet, damals nur an seinem Tag. Der Entscheid schliesst einen Bestand für die zweite Kategorie aus.
- `stockFinding` (`invoice-completeness.service.ts:272`) betrifft nur die Kategorie des Tankbestands. Ein Hinweis «Tankbestand fehlt» für «Holz» wäre falsch, weil dort keiner erfasst werden kann.
- Die Zählregel steht auf der Detailseite bereits dort, wo sie den Betrag ändert. Bei Rechnungen über verschiedene Tage, also bei einem Mieterwechsel, zeigt `LineInvoices.svelte` die Zeile `statements_part_delivery_fuel`. Bei 365/365 Tagen ändert die Regel nichts.
- Ob der Verwalter darauf hingewiesen werden soll, dass für eine zweite Brennstoff-Kategorie der Einkauf zählt, ist eine neue Produktfrage. Vorschlag für ein Issue (`domain`, `needs-decision`): «Soll Dwello beim Neu berechnen und auf der Detailseite sagen, dass für eine zweite Brennstoff-Kategorie (z.B. «Holz») kein Bestand erfasst werden kann und ihr Einkauf als Verbrauch zählt? Liegt am Ende der Periode noch Heizmaterial im Lager, trägt der Mieter dieser Periode es mit (Art. 5 Abs. 2 lit. a VMWG).»

## P-2 (= C-1)

- Der Fix in `InvoiceFacts.svelte:20-26,56` stimmt für den Fall von #1478. Bei einem Gebäude mit Tankbestand blendet die Seite «Nur die Tage …» bei einer eintägigen Rechnung einer Brennstoff-Kategorie aus. Die Prüfung von `isValidUtilityCost` entspricht der Abfrage des Backends.
- Eine Lücke bleibt, wie auf der Basis, siehe V-9.
- Ein weiterer Randfall: Das Gebäude ist «ohne Tank» erfasst, hat einen alten Tankbestand, und die Rechnung liegt in einer Periode, die kein Bestand deckt. Dann blendet die Seite den Satz aus, obwohl das Backend nach Tagen zählt. Der Grund: `tankCategories` nimmt den letzten Bestand irgendeiner Periode. Der Fall ist sehr selten und wird mit V-9 mit behoben, wenn `noTank` mitkommt.
- Das Fehlen eines positiven Hinweises auf der Rechnungsseite ist V-10.
- Zu Marco P-2 (Position «Holz» auf der Abrechnung ohne Hinweis): Die Antwort zu P-4 deckt das ab. Es ist kein Mangel dieser Änderung, sondern dieselbe Produktfrage wie im Issue-Vorschlag oben. Marco P-3 (Erklärung bei «Umlagefähig») deckt die Antwort nicht ab.
- In `messages/*.json` ist ` ` das Zeichen U+00A0, nicht ein Escape.

## Texte im Fall #1474 (gar kein Tankbestand)

- Sie bleiben unverändert und richtig für eine einzige Brennstoff-Kategorie. Ohne `tank` liefert `delivery` immer `true` (`invoice.service.ts:604`). `sharesNoteDelivery` erscheint wie vorher (`pdf-cost-table.ts:236`, `=== true`), und `sharesNoteDeliveryFuel` erscheint nicht.
- Bei zwei Brennstoff-Kategorien siehe V-8. Das bestand schon vorher.

## Wortlaut

`{categories}` steht innerhalb der Anführungszeichen der jeweiligen Sprache, wie bei `fuelInvoices`. ` ` ist das geschützte Leerzeichen, wie in den bestehenden fr-Texten. `sharesNoteDeliveryFuel` ersetzt den bisherigen Text, mit führendem Leerzeichen. Das Szenario in `statement-detail.feature:842` ist neu auf dem Branch und darf angepasst werden.

| key | de | fr | it | en |
|-----|----|----|----|----|
| `fuelIntroDeliveryFuel` (pdf-texts, neu) | `Aus dem Tank wird das verbrauchte Heizmaterial abgerechnet, nicht der Einkauf. Für «{categories}» ist kein Tankbestand erfasst: Dort sind die Lieferungen der Abrechnungsperiode abgerechnet, also der Einkauf (siehe Kostenübersicht).` | `Pour la citerne, le décompte porte sur le combustible consommé et non sur les achats. Pour « {categories} », aucun stock de combustible n’est saisi : ce sont les livraisons de la période de décompte qui sont décomptées, donc les achats (voir Aperçu des coûts).` | `Per il serbatoio si conteggia il combustibile consumato, non quello acquistato. Per «{categories}» non è registrata alcuna scorta di combustibile: sono conteggiate le forniture del periodo di conteggio, quindi gli acquisti (vedi Riepilogo costi).` | `For the tank, the fuel consumed is billed, not the fuel purchased. For ‘{categories}’ no fuel stock is recorded: the deliveries in the billing period are billed there, that is, the purchases (see Cost overview).` |
| `sharesNoteDeliveryFuel` (pdf-texts, ersetzt) | ` Für «{categories}» ist kein Tankbestand erfasst. Die Lieferungen in dieser Abrechnungsperiode sind deshalb als Verbrauch abgerechnet, getrennt vom Verbrauch aus dem Tank; sie zählen über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat. Eine Rechnung mit einem Leistungszeitraum über mehrere Tage, zum Beispiel für die Reinigung des Ofens, ist keine Lieferung: Sie zählt mit den Tagen, die in die Periode fallen.` | ` Pour « {categories} », aucun stock de combustible n’est saisi. Les livraisons pendant cette période de décompte sont donc décomptées comme consommation, séparément de la consommation de la citerne ; elles comptent pour toute la période de décompte, même si une livraison a une période de prestation. Une facture dont la période de prestation couvre plusieurs jours, par exemple pour le nettoyage du poêle, n’est pas une livraison : elle compte selon les jours compris dans la période.` | ` Per «{categories}» non è registrata alcuna scorta di combustibile. Le forniture in questo periodo di conteggio sono quindi conteggiate come consumo, separatamente dal consumo del serbatoio; contano per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione. Una fattura con un periodo di prestazione di più giorni, per esempio per la pulizia della stufa, non è una fornitura: conta secondo i giorni che rientrano nel periodo.` | ` For ‘{categories}’ no fuel stock is recorded. The deliveries in this billing period are therefore billed as consumption, separately from the consumption from the tank; they count for the whole billing period, even if a delivery has a service period. An invoice with a service period of several days, for example for cleaning the stove, is not a delivery: it counts by the days that fall within the period.` |
| `invoices_fuel_delivery` (messages, neu) | `Zählt als Lieferung von Heizmaterial, nicht in den Tank: Sie gilt für die ganze Abrechnungsperiode ihres Liefertags. Für diese Kategorie gibt es keinen Tankbestand; abgerechnet wird der Einkauf. Gilt die Rechnung für eine längere Zeit, zum Beispiel für die Reinigung des Ofens, tragen Sie diese Zeit als Leistungszeitraum ein.` | `Compte comme livraison de combustible, pas dans la citerne : elle vaut pour toute la période de décompte de son jour de livraison. Cette catégorie n’a pas de stock de combustible ; ce sont les achats qui sont décomptés. Si la facture porte sur une période plus longue, par exemple pour le nettoyage du poêle, saisissez cette période comme période de prestation.` | `Conta come fornitura di combustibile, non nel serbatoio: vale per l’intero periodo di conteggio del suo giorno di fornitura. Per questa categoria non c’è una scorta di combustibile; si conteggiano gli acquisti. Se la fattura vale per un periodo più lungo, per esempio per la pulizia della stufa, inserisca questo periodo come periodo di prestazione.` | `Counts as a delivery of fuel, not into the tank: it applies to the whole billing period of its delivery day. This category has no fuel stock; the purchase is billed. If the invoice covers a longer time, for example cleaning the stove, enter that time as the service period.` |

## Nicht bestätigt

- **Tenant mit weniger als 365 Tagen in den Persona-Daten:** Nicht nachgeprüft (alle Entwürfe in Musterhaus Zentrum: 365/365). Die Regel bestätigen die Szenarien `statement-detail.feature:823-858`.
  - Nach Tagen: 900 / 2 = 450.00; × 139/365 = 171.37.
  - Nach Heizprofil: 450 × 50 % = 225.00.
- **Persona-Nachrechnung Anna Schmidt:** 70 % × 92 / 492.5 + 30 % / 6 = 18.0761 %. Das ergibt 1'384 × 0.180761 = 250.17, Zwischensumme 3'739.02, + 3 % = 112.17, Nachzahlung 251.19. Das stimmt mit dem PDF überein.
- **Rundung 251.19 → 251.15:** von der Persona beobachtet. Nicht Gegenstand von #1478 und hier nicht geprüft.

Geprüft:
- P-2-Fix für den Fall von #1478.
- `noteStock` bleibt.
- Texte im Fall #1474 bleiben.
- Daten «Holz» in `dwello_persona`.
- VMWG Art. 5 Abs. 2 lit. a und Art. 8 Abs. 2, Stand 1.10.2025.
