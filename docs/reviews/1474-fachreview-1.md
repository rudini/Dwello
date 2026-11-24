# Fachreview #1474, Runde 1 (Schritt 1, vor der Umsetzung)

Gegenstand: Commit caa5465 (Worktree review-1474-fach), Prompt-Zeile `servicePeriodStart, servicePeriodEnd` in `backend/src/config/llm.ts:300` (Vorschlag des Aufrufers), Eval-Fälle in `backend/scripts/llm-eval.ts` (Ende), Bilder `backend/scripts/llm-eval/*.png`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter (Mietrecht unsicher) | Major (braucht Entscheid) | Ein eintägiger Leistungszeitraum für eine **Dienstleistung** (Kaminfeger, Brennerservice, Lift-Service mit einem «Ausgeführt am») verteilt die ganze Rechnung auf den Mieter, der an diesem einen Tag mietet. Das widerspricht Regel 1 der Anforderungen und der Praxis (pro rata über die Periode). Der Entscheid vom 24.11.2026 deckt das ab («every invoice», «Leistungsdatum»), deshalb: Entscheid des Product Owners nötig. |
| V-2 | Verwalter | Major | Die Zeile schliesst nur das Rechnungsdatum aus. Bestell-, Auftrags-, Offert- und Fälligkeitsdatum sind nicht genannt, und kein Eval-Fall prüft sie. Ein Bestelldatum im Dezember bei einer Lieferung im Januar legt die Rechnung in die falsche Periode. |
| V-3 | Verwalter | Major | Der Verteilschlüssel des Tanks (`fuel-stock.service.ts:87,90`, `keyFor`) wählt die «letzte Lieferung bis Periodenende» nach dem **Rechnungsdatum**. Die Lieferung zählt aber neu nach ihrem Liefertag (Glossar «Verbrauch (Heizmaterial)»). Lieferung am 28.06., Rechnung am 05.07.: Die Lieferung zählt in der Periode bis 30.06., ihr Schlüssel aber erst in der nächsten. Das Problem gibt es schon vorher, die Änderung macht es aber zum Normalfall. |
| V-4 | Verwalter | Minor | Bei mehreren einzelnen Liefer- oder Ausführungstagen auf einer Rechnung (zwei Teillieferungen Heizöl) regelt der Prompt nichts. Ein Modell, das daraus «erster bis letzter Tag» macht, legt einen mehrtägigen Zeitraum an, und `isDelivery` ist dann false: Das Heizöl fällt aus dem Verbrauch. Lösung: im Prompt «mehrere einzelne Daten: null» (Zeile unten), dazu ein Eval-Fall. |

## V-1: Ein Ausführungstag ist kein Leistungszeitraum

**Beleg**
- `docs/nebenkostenabrechnung-anforderungen.md:142` (Regel 1): «der Leistungszeitraum beginnt am Tag, an dem die Arbeit gemacht wird, und endet am Tag, bevor sie das nächste Mal gemacht wird».
- `docs/nebenkostenabrechnung-anforderungen.md:146` (Regel 5): «mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode».
- `UBIQUITOUS_LANGUAGE.md:81`: Leistungszeitraum ist der «Zeitraum, für den eine Rechnung gilt». Eine jährliche Kaminfeger-Reinigung gilt für das Heizjahr, nicht für den Tag des Besuchs.
- Eval-Fall `kaminfeger-ausgefuehrt-am.png`, erwartet 2026-05-12 bis 2026-05-12.

**Nachgerechnet** (Rechnung Kaminfeger 302.68, Anteil der Wohnung 1/4 = 75.67; Periode 01.07.2025–30.06.2026 mit 365 Tagen; Mieter A bis 30.04.2026 mit 304 Tagen, Mieter B ab 01.05.2026 mit 61 Tagen; zur Vereinfachung nach Tagen statt nach Heizprofil):
- Heute (kein Leistungszeitraum, Rechnungsdatum in der Periode): A trägt 304/365 × 75.67 = 63.02, B trägt 61/365 × 75.67 = 12.65.
- Mit dem neuen Prompt (12.05.2026 bis 12.05.2026): A trägt 0/1 = 0.00, B trägt 1/1 = 75.67.
- Randfall Leerstand am 12.05.: Kein Mieter trägt etwas, der Vermieter trägt alles.
- Randfall ohne Mieterwechsel: dasselbe Ergebnis wie heute.

Beim Heizprofil wird der Unterschied noch grösser, weil A fast alle Heizmonate hat.

Für eine **Lieferung in den Tank** stimmt der eintägige Zeitraum. Lieferungen zählen nach Glossar Z. 158 immer über die ganze Periode. Und erst mit dem Liefertag stimmt der Verbrauch: Anfangsbestand 3'000, Verbrauch 4'000, Lieferung 6'674.09 am 28.06., Rechnung am 05.07., Endbestand am 30.06. = 5'674.09.
- Heute: 3'000 + 0 − 5'674.09 = −2'674.09.
- Neu: 3'000 + 6'674.09 − 5'674.09 = 4'000.00.

**Recht:** Art. 257a Abs. 1 OR (Stand 1.10.2026): «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.» Daraus folgt, dass B nicht für den Gebrauch durch A zahlen sollte. Eine ausdrückliche Pflicht zur zeitanteiligen Verteilung steht aber weder hier noch in Art. 257b OR. Diese Folgerung ist deshalb **unsicher** (siehe auch `docs/nebenkostenabrechnung-anforderungen.md:69`, unsicher-C).

**Lösung (Entscheid des Product Owners)**, eine von zwei Varianten:
- **(a)** Nur ein einzelnes **Lieferdatum von Ware** (Heizöl, Pellets, Holz) wird zum eintägigen Zeitraum. Ein Ausführungsdatum einer Arbeit bleibt `null` und zählt wie heute nach dem Rechnungsdatum. Prompt-Zeile (a) unten. Der Eval-Fall Kaminfeger erwartet dann null bis null.
- **(b)** Prompt wie entschieden, dazu eine neue Rechenregel: Ein eintägiger Leistungszeitraum bestimmt nur die Abrechnungsperiode. Für den Anteil rechnet die Rechnung wie eine ohne Leistungszeitraum (Mietstage / Tage der Periode bzw. Monate der ganzen Periode im Heizprofil), in `inPeriod` (`backend/src/services/invoice-period.ts:17`) bei `start === end`. Das ändert Regel 5 und braucht ein Szenario. Vorschlag für die Regel (Issue, Labels `domain`, `needs-decision`): «Ein Leistungszeitraum von einem Tag (Liefer- oder Ausführungstag) bestimmt nur die Abrechnungsperiode der Rechnung; davon trägt der Mieter wie bei einer Rechnung ohne Leistungszeitraum seine Mietstage / Tage der Periode.»

## V-2: Andere Einzeldaten sind kein Leistungsdatum

**Beleg:** Vorgeschlagene Zeile «das Rechnungsdatum ist kein Leistungsdatum; sonst null». Auf Schweizer Heizöl- und Handwerkerrechnungen stehen oft zusätzlich «Bestelldatum», «Ihre Bestellung vom», «Auftrag vom», «Offerte vom», «Valuta» oder «Fällig am».

**Warum falsch:** Steht neben dem Rechnungsdatum nur ein solches Datum, passt es auf «nur ein einzelnes … Datum». Ein Modell, das den Unterschied nicht kennt, nimmt es. Beispiel: Heizöl bestellt am 15.12.2025, geliefert am 08.01.2026, Rechnung vom 12.01.2026. Ist das Bestelldatum gelesen, zählt die Lieferung im Kalenderjahr 2025 statt 2026.

**Lösung:** Die Zeile unten nennt die Ausschlüsse. Dazu kommt ein fünfter Eval-Fall `heizoel-bestelldatum.png` mit Bestelldatum 15.12.2025, Lieferdatum 08.01.2026 und Rechnungsdatum 12.01.2026, erwartet `2026-01-08` bis `2026-01-08`. Er prüft zugleich die Grenze eines Kalenderjahrs; der bestehende Heizöl-Fall prüft nur die Grenze Juli–Juni. Optional ein sechster Fall «Auftrag vom» ohne Ausführungsdatum, erwartet null bis null.

## V-3: Der Schlüssel der Lieferung folgt nicht ihrem Liefertag

**Beleg:** `backend/src/services/fuel-stock.service.ts:87` `upTo ? lte(invoices.invoiceDate, upTo)` und `:90` `orderBy(desc(invoices.invoiceDate), …)`. Dagegen `UBIQUITOUS_LANGUAGE.md:163`: «Eine Lieferung zählt ganz in der Abrechnungsperiode ihres Lieferdatums: der Tag ihres Leistungszeitraums, ohne Leistungszeitraum das Rechnungsdatum (#451)».

**Warum falsch:** Beispiel mit Lieferung am 28.06.2026 (Schlüssel A), Rechnung am 05.07.2026 und Vorlieferung im Oktober 2025 (Schlüssel B). Die Periode bis 30.06.2026 rechnet die Lieferung als Zukauf ab, `keyFor` nimmt aber B. Die Periode ab 01.07.2026 nimmt A, obwohl die Lieferung dort nicht mehr zählt.

**Lösung:** In `keyFor` filtern und ordnen nach `coalesce(servicePeriodStart, invoiceDate)`. Dazu ein `*.pg.test.ts` mit genau diesem Beispiel. Das gehört nicht zum Prompt, aber zur Folge des Entscheids.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| `EXTRACTION_PROMPT` Zeile Leistungszeitraum, wie entschieden bzw. Variante (b) | `- servicePeriodStart, servicePeriodEnd: Leistungszeitraum mit Beginn und Ende, wenn die Rechnung ihn nennt (JJJJ-MM-TT); nennt die Rechnung nur ein einzelnes Liefer- oder Leistungsdatum (z.B. «Lieferdatum», «geliefert am», «Leistungsdatum», «ausgeführt am»), setze es als Beginn und Ende; Rechnungs-, Bestell-, Auftrags-, Offert- und Fälligkeitsdatum sind kein Liefer- oder Leistungsdatum; nennt sie mehrere einzelne Liefer- oder Leistungsdaten oder keines, null` | – (Prompt nur deutsch) | – | – |
| `EXTRACTION_PROMPT` Zeile Leistungszeitraum, Variante (a) | `- servicePeriodStart, servicePeriodEnd: Leistungszeitraum mit Beginn und Ende, wenn die Rechnung ihn nennt (JJJJ-MM-TT); nennt eine Rechnung über gelieferte Ware (z.B. Heizöl, Pellets, Holz) nur ein einzelnes Lieferdatum (z.B. «Lieferdatum», «geliefert am»), setze es als Beginn und Ende; Rechnungs-, Bestell-, Auftrags-, Offert- und Fälligkeitsdatum sind kein Lieferdatum; nennt sie mehrere Liefertage, nur den Tag einer ausgeführten Arbeit oder keines, null` | – | – | – |

Der Test in `llm-extraction.test.ts` zum mittleren Teil bleibt mit der ersten Zeile gültig, wenn er auf «… «Leistungsdatum», «ausgeführt am»), setze es als Beginn und Ende» angepasst wird.

## Nicht bestätigt

- **Zeitanteilige Verteilung nicht verbrauchsabhängiger Kosten beim Mieterwechsel:** Im Wortlaut von Art. 257a/257b OR (Stand 1.10.2026, Fedlex) steht sie nicht. Die Anforderungen selbst führen sie als unsicher-C (`docs/nebenkostenabrechnung-anforderungen.md:69,163`).
- **Wie sich die Daten bei Kaminfeger und Brennerservice in Ihrer Branche üblicherweise lesen** («Ausgeführt am», «Kontrolldatum»): nicht mit einer Quelle belegt, nur Erfahrung aus der Praxis.
- **Text von Issue #1474:** nicht selbst gelesen. Grundlage war der Entscheid, wie der Aufrufer ihn wiedergibt.

Geprüft: die Beträge und MWST der vier Bilder (6'674.09, 302.68, 465.26, 724.27 stimmen); die erwarteten Werte für Werke (01.01.–31.03.2026) und Hauswart (null); die realistische Aufmachung der Rechnungen; die Bedeutung von `isDelivery` und `inPeriodOf` für eintägige Zeiträume; «Lieferdatum» im Glossar (Z. 163); «Leistungsdatum» und «Ausführungsdatum» sind keine Begriffe der Oberfläche (nur Prompt), also kein Glossar-Issue nötig.
