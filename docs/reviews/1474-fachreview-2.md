# Fachreview #1474, Runde 2 (Schritt 1)

Gegenstand: Commit 22832e5 (Worktree review-1474-fach2), Diff 2c8007d..22832e5 in `backend/src/config/llm.ts`, `backend/scripts/llm-eval.ts`, `backend/src/__tests__/llm-extraction.test.ts`, die Eval-Bilder `heizoel-bestelldatum.png` und `pellets-zwei-lieferungen.png`. Massstab ist der Entscheid vom 24.11.2026 (zweite Runde, Variante a), wie der Aufrufer ihn wiedergibt.

Geschlossen: V-1 (Entscheid a umgesetzt: Kaminfeger erwartet null), V-2 (Ausschlüsse in der Zeile, Eval-Fall Bestelldatum), V-3 (`keyFor` nach `coalesce(servicePeriodEnd, invoiceDate)`), V-4 (Parser: mehrere Liefertage ergeben null, Eval-Fall Pellets)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-5 | Verwalter (Mietrecht unsicher) | Major (braucht Entscheid) | Ein eintägiger Leistungszeitraum, der **keine Lieferung in den Tank** ist, legt die ganze Rechnung auf den Mieter, der an diesem Tag mietet. Das betrifft (a) Heizöl/Pellets in einem Gebäude, für das nie ein Tankbestand erfasst wurde (`periodReadings` gibt `null`, `invoice.service.ts:583` `tank?.categoryId`), und (b) gelieferte Ware ausserhalb der Kategorie des Tanks (Enthärtersalz, Streusalz, Reinigungsmittel), die die Zeile mit «gelieferte Ware» ausdrücklich erfasst. Vorher zählten beide nach dem Rechnungsdatum über die ganze Periode. |
| V-6 | Verwalter | Minor | Ob ein Liefertag als unsicher markiert wird, entscheidet die Sicherheit von `servicePeriodStart` (`llm.ts`, `ANSWERED_AS`, Filter `unsure`). Die KI gibt sie aber für das leere Feld an. Ein falsch gelesener Liefertag verschiebt die ganze Rechnung in eine andere Periode und fällt nicht auf. Lösung: `"deliveryDates": <0 bis 1>` ins `confidence`-Objekt aufnehmen; ein Zeitraum aus dem Liefertag nimmt diese Sicherheit. |

## V-5: Ein eintägiger Zeitraum ausserhalb des Tanks

**Beleg**
- `backend/src/services/fuel-stock.service.ts:58` `if (readings.length === 0) return null;` Ohne einen einzigen Tankbestand gibt es keine Kategorie des Tanks. `invoice.service.ts:583/596-598`: Nur `delivery(invoice)` zählt über die ganze Periode, alle anderen Rechnungen zählen über `inPeriod`, also nur an ihrem einen Tag.
- `messages/de.json:1667` (`statements_tank_text`): Der Abrechnungslauf lässt den Vermieter ohne Tankbestand weitergehen («sonst rechnet Dwello den Einkauf ab statt den Verbrauch»). Für einen unerfahrenen Vermieter ist das der Normalfall.
- `UBIQUITOUS_LANGUAGE.md:163`: «Fehlt der Anfangs- oder Endbestand, zählen die Lieferungen der Periode über die ganze Periode, wie eine Rechnung ohne Leistungszeitraum». Ein Gebäude ganz ohne Tankbestand deckt der Code nicht. Bisher hatte die Rechnung keinen Zeitraum, darum fiel das nicht auf. Jetzt bekommt jede von der KI gelesene Lieferung einen.
- Prompt-Zeile `deliveryDates`: «bei einer Rechnung über gelieferte Ware (z.B. Heizöl, Pellets, Holz)». Gemeint ist damit jede Ware. Der Entscheid nennt «heating material or other goods», die Folge für andere Ware ist aber dieselbe wie bei V-1.

**Nachgerechnet** (Fall a, nach Tagen ohne Heizprofil): Heizöl 6'674.09, geliefert am 28.06.2026, Rechnung vom 05.07.2026, kein Tankbestand erfasst. Anteil der Wohnung 1/4 = 1'668.52. Periode 01.07.2025–30.06.2026 (365 Tage). Mieter A bis 30.04.2026 (304 Tage), Mieter B ab 01.05.2026 (61 Tage).
- Vor #1474: Die Rechnung zählt in der Periode ab 01.07.2026, die Periode 2025/26 enthält sie nicht.
- Mit #1474: In der Periode 2025/26 zählt nur der 28.06.: A 0.00, B 1'668.52.
- Über die ganze Periode (wie Glossar Z. 163 für fehlende Bestände): A 304/365 × 1'668.52 = 1'389.67, B 61/365 × 1'668.52 = 278.85, zusammen 1'668.52.

**Nachgerechnet** (Fall b): Enthärtersalz 240.00, geliefert am 10.02.2026, Rechnung vom 20.02.2026, Anteil der Wohnung 1/4 = 60.00. Periode 01.01.–31.12.2026. A bis 31.03. (90 Tage), B ab 01.04. (275 Tage).
- Vorher: A 90/365 × 60 = 14.79, B 275/365 × 60 = 45.21.
- Neu: A 60.00, B 0.00.
- Randfall Leerstand am Liefertag: Kein Mieter trägt etwas, der Vermieter trägt 60.00.
- Randfall ohne Mieterwechsel: dasselbe wie vorher.

**Warum falsch:** Ware für den Vorrat (Heizmaterial, Salz) wird über die Zeit verbraucht, nicht am Liefertag. Das ist derselbe Grund, aus dem V-1 Dienstleistungen ausnimmt. Recht: Art. 257a Abs. 1 OR (Stand 1.10.2026, Wortlaut in Runde 1) knüpft an den «Gebrauch der Sache». Eine Pflicht zur zeitanteiligen Verteilung steht dort nicht, deshalb **unsicher** (wie Anforderungen Z. 69, unsicher-C).

**Lösung (Entscheid des Product Owners)**, eine von zwei Möglichkeiten:
- **(1)** Rechenregel: In einer Brennstoff-Kategorie (`is_fuel`) zählt eine Rechnung mit eintägigem Leistungszeitraum auch ohne Tankbestand wie eine Lieferung, also über die ganze Periode ihres Liefertags (in `getInvoicesForStatement` `categories.isFuel` statt `tank?.categoryId`, wenn `tank` null ist). Dazu ein Szenario und eine Ergänzung von Glossar Z. 163, die der Product Owner freigibt. Für Ware ausserhalb des Tanks die Prompt-Zeile auf Heizmaterial beschränken (Wortlaut unten).
- **(2)** Allgemein, wie Variante (b) aus Runde 1: Ein eintägiger Leistungszeitraum bestimmt nur die Abrechnungsperiode, der Anteil rechnet wie ohne Leistungszeitraum. Das ändert Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:146`).

Issue-Vorschlag (Labels `domain`, `needs-decision`): «Ein Leistungszeitraum von einem Tag (Liefertag), der keine Lieferung in den Tank ist, bestimmt nur die Abrechnungsperiode der Rechnung; davon trägt der Mieter wie bei einer Rechnung ohne Leistungszeitraum seine Mietstage / Tage der Periode bzw. nach dem Heizprofil.»

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| `EXTRACTION_PROMPT` Zeile `deliveryDates`, nur bei V-5 Lösung (1) | `- deliveryDates: bei einer Rechnung über Heizmaterial (z.B. Heizöl, Flüssiggas, Pellets, Holz) jeder Tag, an dem geliefert wurde (z.B. «Lieferdatum», «geliefert am», «Lieferung vom»), als Liste (JJJJ-MM-TT); Rechnungs-, Bestell-, Auftrags-, Offert- und Fälligkeitsdatum sind kein Liefertag, der Tag einer ausgeführten Arbeit (z.B. «ausgeführt am») auch nicht; sonst []` | – (Prompt nur deutsch) | – | – |

Die aktuelle Zeile setzt den Entscheid (a) richtig und vollständig um: nur Liefertage von Ware, die Ausschlüsse aus V-2, der Tag einer Arbeit ausgenommen, «mehrere» über den Parser. Sie bleibt so, wenn der Product Owner V-5 mit (2) oder gar nicht ändert.

## Nicht bestätigt

- **Zeitanteilige Verteilung beim Mieterwechsel** (V-5): steht nicht im Wortlaut von Art. 257a/257b OR. Den Wortlaut von Runde 1 (Stand 1.10.2026) habe ich in dieser Runde nicht neu abgerufen, weil Netzabfragen nicht freigegeben waren.
- **Wie häufig ein Gebäude mit Ölheizung ganz ohne Tankbestand abgerechnet wird:** Nur aus dem Code geschlossen (`fuel-stock.service.ts:58`, `statements_tank_text`), keine Daten.
- **Text von Issue #1474 und der Entscheid der zweiten Runde:** nicht selbst gelesen, die Grundlage ist die Wiedergabe des Aufrufers.
- **Eval-Ergebnis 6/6 in zwei Läufen:** nicht selbst ausgeführt (keine Tests oder Server erlaubt).

Geprüft: Parser (ein Tag, auch doppelt genannt, ergibt einen Zeitraum; mehrere Tage oder ein ungültiger Eintrag ergeben null; ein genannter Zeitraum hat Vorrang); die Erwartungen der Eval (Kaminfeger null, Pellets mit zwei Lieferungen null, Bestelldatum 2026-01-08, über die Grenze des Kalenderjahrs); Beträge und MWST der neuen Bilder (4'384.54 und 2'951.13 stimmen); ein Liefertag nach dem Rechnungsdatum zählt in der Periode seines Liefertags (Glossar Z. 163, VMWG Art. 5 Abs. 2 lit. a, Verbrauch); der Liefertag nach dem Periodenende wird ausgefiltert (`invoice.service.ts:588`); die Aufbewahrung folgt dem späteren Datum (`invoice-retention.ts:27`); V-3 in `keyFor` ist fachlich richtig.
