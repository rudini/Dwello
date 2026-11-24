# Fachreview #1470, Runde 2 (Feature-Review, Commit 5b7cfe1)

Geschlossen: V-1, V-2, V-3, V-4 (V-5 bleibt vorbestehend, ausserhalb von #1470)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-6 | Verwalter / Mietrecht | Minor | `heatingNoteParts` ist mit Lieferung falsch: «38.87 % für eine Rechnung ohne Leistungszeitraum», obwohl es keine gibt. Die 38.87 % rechnet die eintägige Lieferung ab (steiner.pdf, Zeile «Lieferung in den Tank … Anteil nach Heizprofil: 38.87 % (siehe Heiz- und Warmwasserkosten)»). Der Folgesatz «Bei einer Rechnung mit Leistungszeitraum zählen die Monate» widerspricht der Lieferung, die einen Leistungszeitraum hat. Fix: neuer Schlüssel `heatingNoteDelivery` (Wortlaut unten). `heatingNoteParts` bleibt unverändert, es ist in `statement-detail.feature:695` auf `main` festgehalten |
| V-7 | Verwalter / Mietrecht | Minor | `sharesNoteDelivery` sagt, wie gerechnet wird, aber nicht warum. Der Mieter erfährt nicht, dass kein Tankbestand erfasst ist und deshalb der Einkauf als Verbrauch gilt (Art. 5 Abs. 2 lit. a VMWG verlangt den Verbrauch). Fix: Begründung neutral nennen, ohne die Bestätigung des Vermieters (Wortlaut unten) |

## V-6: Bedingung

- `heatingNoteKey` (`pdf-heating.ts:11-12`):
  - `!ownProfileDays` → `heatingNote` (wie bisher)
  - sonst `noRunShare` → `heatingNoteOwn` (wie bisher)
  - sonst, wenn eine Position mit `byProfile` einen Teil mit `delivery` hat → **`heatingNoteDelivery`**
  - sonst `heatingNoteParts` (wie bisher)
- `heatingNoteDelivery` gilt mit oder ohne zusätzliche Rechnung ohne Leistungszeitraum. Der Satz spricht von einer «Rechnung, die für die ganze Abrechnungsperiode gilt». Das ist derselbe Wortlaut wie in `partNoPeriod` und `partDelivery` («gilt für die ganze Abrechnungsperiode»), deshalb deckt er beide Fälle.
- In `heatingLines` wie `heatingNoteParts` behandeln: Die Zeile mit den Monaten (`heatingMonths`) bleibt.

Nachgerechnet (Persona-Abrechnung): 888.62 × (6'565.00 × 38.87 % + 368.00 × 87.94 %) / 6'933.00 = 888.62 × 2'875.43 / 6'933.00 = 368.55. Das stimmt mit dem PDF überein. Ohne Lieferung (nur eine Rechnung ohne Leistungszeitraum) bleibt der Text `heatingNoteParts`, der bisherige Wortlaut.

## V-7: Begründung

- Beleg: `statements_finding_stock_tail` (messages/de.json:1349): «Ohne Anfangs- und Endbestand rechnet Dwello den Einkauf ab, nicht den Verbrauch.»
- Art. 5 Abs. 2 lit. a VMWG (Fedlex, Stand 1.10.2025): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;»
- Die Persona schlägt vor: «Der Tank war am Anfang und am Ende gleich voll». Das darf nicht ins PDF. Diese Bestätigung des Vermieters kennt das PDF nicht, und es würde damit dem Mieter eine Tatsache zusichern.
- Der neue Text sagt nur, was stimmt:
  - Ein Bestand fehlt («fehlt der Anfangs- oder der Endbestand»; das «oder» ist einschliessend, denn `data.fuel` fehlt schon bei einem fehlenden Bestand).
  - Die Lieferungen sind deshalb als Verbrauch abgerechnet.
- Damit weiss der Mieter, wonach er bei der Belegeinsicht fragen kann (Art. 257b Abs. 2 OR).
- Die Bedingung bleibt: der Text steht nur ohne `data.fuel` und nur mit `tankDelivery`.
- `statement-detail.feature:793` und `statement-pdf-render.test.ts:696` übernehmen den neuen Wortlaut. Die Szenariozeile ist neu in diesem Branch, ihre Änderung ist also frei.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| heatingNoteDelivery | Heizkosten nach Heizprofil «{profile}»: {percent} % für eine Rechnung, die für die ganze Abrechnungsperiode gilt. Bei einer anderen Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition. | Frais de chauffage selon le profil « {profile} » : {percent} % pour une facture valable pour toute la période de décompte. Pour une autre facture avec période de prestation, ce sont les mois du profil de chauffage compris dans cette période qui comptent ; sa part figure sous le poste du décompte. | Spese di riscaldamento secondo il profilo «{profile}»: {percent} % per una fattura che vale per l’intero periodo di conteggio. Per un’altra fattura con periodo di prestazione contano i mesi del profilo di riscaldamento compresi in tale periodo; la quota di tale fattura figura sotto la voce del conteggio. | Heating costs under the heating profile ‘{profile}’: {percent} % for an invoice that applies to the whole billing period. For any other invoice with a service period, the months of the heating profile within it count; its share is shown below the statement line. |
| sharesNoteDelivery | ␣Für den Tank fehlt der Anfangs- oder der Endbestand. Die Lieferungen von Heizmaterial in den Tank in dieser Abrechnungsperiode sind deshalb als Verbrauch abgerechnet; sie zählen über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat. | ␣Pour la citerne, le stock initial ou le stock final manque. Les livraisons de combustible dans la citerne pendant cette période de décompte sont donc décomptées comme consommation ; elles comptent pour toute la période de décompte, même si une livraison a une période de prestation. | ␣Per il serbatoio manca la scorta iniziale o la scorta finale. Le forniture di combustibile nel serbatoio in questo periodo di conteggio sono quindi conteggiate come consumo; contano per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione. | ␣For the tank, the opening or the closing stock is missing. The deliveries of fuel into the tank in this billing period are therefore billed as consumption; they count for the whole billing period, even if a delivery has a service period. |

(␣ = führendes Leerzeichen wie im bisherigen `sharesNoteDelivery`. Die Begriffe für Anfangs- und Endbestand stimmen in allen vier Sprachen mit `fuelOpening`/`fuelClosing` überein.)

## Nicht bestätigt

- Ob eine Position nach Heizprofil ohne `invoiceParts`, deren Rechnung einen Leistungszeitraum über die ganze Periode hat, heute `heatingNoteParts` druckt («für eine Rechnung ohne Leistungszeitraum»), habe ich nicht nachgestellt. Gesehen habe ich nur `noRunShare`/`ownProfileDays` in `pdf-cost-table.ts:151-155`. Der Wortlaut von `heatingNoteDelivery` wäre auch dort richtig. Der Fall ist vorbestehend und nicht Teil dieser Runde.

Geprüft: Rechnung 368.55 der Persona; Bedingung von `sharesNoteDelivery` (`pdf-cost-table.ts:229-231`); Art. 5 Abs. 2 lit. a VMWG auf Fedlex.
