# Datenprüfung #96 / #104, alle Abrechnungen 2025 (Commit dacc833, Demo-Daten 58d49f6)

Geprüft am 16.10.2026 gegen die laufende Persona-App (DB `dwello_persona`, Backend :3301, Frontend :3300). Keine Daten verändert, nichts gestartet.
Skripte (eigene Neuberechnung, kein Dwello-Code importiert): `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/w1b/recompute.py` (Punkte 1, 2), `pagecmp.py` und `invcmp.py` (Seite gegen DB und PDF), `qr.py` (QR-Rechnung, Decoder zxing-cpp im venv). Rohdaten (JSON aus der DB), PDFs, HTML und PNGs liegen im selben Ordner.

## Ergebnis in einem Satz

Alle Beträge, Rechnungs-Schnappschüsse, Tage, Wohnungsanteile, Zeitanteile, Pauschalen, Akonto, Salden, changed-invoices-Antworten, Webseiten (de/fr/it/en) und PDFs (de/fr/it) stimmen auf den Rappen mit meiner Neuberechnung und untereinander überein. Es gibt keinen Blocker und keinen Major. Zwei Minor-Befunde, einer davon ein vorbestehender Widerspruch zwischen Glossar und Anforderungsdokument bei der Saldo-Rundung.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | `utility_statement_line_items.invoices`, Position Heating, NK-11111111-2025-0001 bis -0004 (Zeile «Veränderung Tankbestand») | `amount` 392.80 (Anfangsbestand 2650.00 minus Endbestand 2257.20) | `392.8000000000002` (Fliesskomma-Rest) im JSONB und in der API-Antwort `GET /api/v1/statements/:id`; Seite und PDF zeigen korrekt CHF 392.80 |
| D-2 | Minor (vorbestehend, Produktentscheid) | Saldo von NK-11111111-2025-0003, NK-22222222-2025-0001, -0002, -0003 | Glossar «Saldo»: gerundet «zugunsten des Mieters» (Nachzahlung ab-, Rückerstattung aufgerundet, geplant #79): 142.35, -34.60, 137.95, -93.90 | gespeichert und in Seite, PDF und QR-Rechnung: 142.40, -34.55, 138.00, -93.85 (kaufmännisch auf 5 Rappen, wie `docs/nebenkostenabrechnung-anforderungen.md` Punkt 8 es beschreibt) |

Keine weiteren Abweichungen. Die vier übrigen Salden (215.80, -6.50, 238.10, 91.40) sind bei beiden Rundungsregeln gleich.

### D-1 Beleg und Reproduktion

```
psql postgresql://dwello:dwello@localhost:5432/dwello_persona -At -c \
 "select s.statement_number, i->>'amount' from utility_statements s join utility_statement_line_items l on l.statement_id=s.id, jsonb_array_elements(l.invoices) i where i->>'fuelStock'='true' and s.period_start='2025-01-01'"
```
Ausgabe: viermal `392.8000000000002`. Mein Skript: `recompute.py`, Prüfung «Fuel-Zeile ungerundet gespeichert». Die Summe der Rechnungen (6565 + 392.8000000000002) rundet auf 6957.80 und stimmt mit `total_amount` überein, deshalb nur Minor. Folge: ein späterer Vergleich oder eine Summe über die gespeicherten Beträge ohne Rundung ergibt 6957.8000000000002.

### D-2 Beleg und Reproduktion

Neuberechnung aus `recompute.py` (Rundung Saldo-vor-Rundung auf 5 Rappen, beide Regeln):

| Abrechnung | Saldo vor Rundung | gespeichert (kaufmännisch) | zugunsten Mieter nach Glossar |
|---|---|---|---|
| NK-11111111-2025-0001 | 215.82 | 215.80 | 215.80 |
| NK-11111111-2025-0002 | -6.48 | -6.50 | -6.50 |
| NK-11111111-2025-0003 | 142.38 | 142.40 | 142.35 |
| NK-11111111-2025-0004 | 238.12 | 238.10 | 238.10 |
| NK-22222222-2025-0001 | -34.56 | -34.55 | -34.60 |
| NK-22222222-2025-0002 | 137.98 | 138.00 | 137.95 |
| NK-22222222-2025-0003 | -93.87 | -93.85 | -93.90 |
| NK-22222222-2025-0004 | 91.41 | 91.40 | 91.40 |

QR-Betrag von -0003 ist 142.40 (siehe unten), also 5 Rappen mehr, als der Mieter nach Glossar zahlen müsste. `UBIQUITOUS_LANGUAGE.md` (Saldo, Rundung auf 5 Rappen) und das Anforderungsdokument (Punkt 8, «kaufmännisch») widersprechen sich; der Code folgt dem Anforderungsdokument. Das ist nicht Teil von #96/#104 und liegt auch auf der Basis vor; Entscheid beim Product Owner (Issue #79).
Reproduktion: `python3 -I .../w1b/recompute.py`, Zeilen «INFO zugunsten-Mieter-Rundung wuerde ...».

## Geprüft und bestanden

### (1) Gespeicherte Rechnungen je Position (alle 8 Abrechnungen, 4 × 8 + 4 × 5 = 52 Positionen)
Für jede Position von NK-11111111-2025-0001 bis -0004 (je 8 Positionen) und NK-22222222-2025-0001 bis -0004 (je 5 Positionen):
- Die gespeicherten Beträge summieren sich auf den Rappen zu `total_amount` (Heating Musterhaus: 6565.00 + 392.80 = 6957.80).
- Die Rechnungs-IDs der Position sind genau die umlagefähigen Rechnungen der Kategorie im Gebäude, die in die Periode fallen (nach Leistungszeitraum: Seepark «Fernwärme Q4 2024», Rechnungsdatum 20.01.2025, Leistungszeitraum 2024, ist zu Recht nicht dabei; «Fernwärme Q4 2025», Rechnungsdatum 20.01.2026, Leistungszeitraum 01.10.–31.12.2025, ist dabei).
- Betrag im Zeitraum und Tage (start/end) jeder Rechnung stimmen mit der Neuberechnung aus den Rechnungen und ihrem Leistungszeitraum überein (anteilig bei Überschneidung; hier keine Rechnung über die Periodengrenze).
- «Wasser und Abwasser Q4 2025» (c0000001-2025-4000-8000-000000000037) ist in den vier Musterhaus-Abrechnungen mit 940.00 gespeichert (Stand bei Erstellung), die Rechnung steht jetzt auf 904.00 (zuletzt geändert 16.10.2026 23:25); `total_amount` Kaltwasser 3840.00 (= 930 + 960 + 1010 + 940) ist konsistent mit dem Schnappschuss.
- Tankbestand: `fuel_stocks` (31.12.2024: 2650.00, 31.12.2025: 2257.20) = `utility_statements.fuel_stock`; Veränderung 392.80.
- Wohnungsanteil je Position (Pro Fläche, Pro Einheit, Heizung 70 % Fläche / 30 % Einheit; Flächen und Einheiten aus `apartments`), Zeitanteil (Mietstage/Periodentage bzw. Anteil nach Heizprofil: A2 Jan–Jun 55.8 %, Jul–Dez 44.2 %, Heizprofil «nicht angewendet» bei Mietvertrag über die ganze Periode), Mieteranteil (gerundeter Wohnungsanteil × Zeitanteil), Zwischensumme, Verwaltungspauschale 3 %, «Ihre Nebenkosten» (total_costs), Akonto (monatlicher Vorschuss × Monate, anteilig bei Teilmonat) und Saldo (kaufmännisch auf 5 Rappen, D-2): alle stimmen.
- `invoice_parts`/`billed_days`: bei den 2025-Abrechnungen nur bei den Seepark-Heizpositionen NULL (Rechnungen mit unterschiedlichen Tagen, aber Mietvertrag über die ganze Periode bzw. Heizprofil); das entspricht dem Glossar («nicht gespeichert bei einem Mietvertrag über die ganze Periode»).

### (2) changed-invoices (`GET /api/v1/statements/:id/changed-invoices`)
- NK-11111111-2025-0001, -0002, -0003, -0004: genau `["c0000001-2025-4000-8000-000000000037"]` (Wasser und Abwasser Q4 2025).
- NK-22222222-2025-0001, -0002, -0003, -0004: `[]`.
- Zusätzlich: alle neun Abrechnungen 2024 `[]`; `GET /api/v1/invoices/:id/statements` meldet `missedIn` nur für die Rechnung ...037 (alle 41 Rechnungen ab 2025 geprüft).
- Die Neuberechnung (Schnappschuss gegen aktuelle Rechnung, neue und gelöschte Rechnungen) liefert dieselben Mengen.

### (3) Webseite gegen Datenbank und PDF
Alle acht Abrechnungen in de, fr, it, en abgerufen (SSR-HTML, Session-Cookie mit selbst signiertem JWT), 1376 Einzelvergleiche ohne Abweichung:
- Tabelle: Kosten des Gebäudes, Wohnungsanteil, Zeitanteil («365/365 Tage», «181/365 Tage», «184/365 Tage», «55.80 % ...», «44.20 % ...»), Betrag je Position gleich DB.
- Summenblock: Zwischensumme, Verwaltungspauschale, «Ihre Nebenkosten», Akonto, «vor Rundung», Rundung mit Vorzeichen (+/−), Saldo gleich DB; Vorzeichen der Rundung gleich dem im PDF (-0001 −0.02, -0002 +0.02, -0003 +0.02, -0004 −0.02, S1 −0.01, S2 +0.02, S3 −0.02, S4 −0.01).
- Mietverhältnis («01.01.2025 – 30.06.2025», «01.07.2025 – 31.12.2025», ...) und Mietstage (365, 181, 184) gleich DB und PDF.
- Rechnungszeilen unter den Positionen (560 Zeilen): Anzahl, Reihenfolge, Link `/invoices/<id>` und Betrag gleich dem Schnappschuss; die Zeile «Veränderung Tankbestand» hat keinen Link und zeigt CHF 392.80.
- Hinweis «Rechnungen seit der Abrechnung geändert» erscheint auf allen vier Musterhaus-Seiten (alle Sprachen, «1 Rechnung») und auf keiner Seepark-Seite; die Rechnungsseite ...037 zeigt «Abrechnungen nicht aktuell» und CHF 904.00.
- PDF (gespeicherter `pdf_blob`, Text mit `pdftotext -layout`): alle Kosten, Wohnungsanteile, Mieteranteile, Zwischensumme, Pauschale, «Ihre Nebenkosten», Zeitanteile, Heizprofil-Monatsanteile, Heizmaterialblock (2'650.00 + 6'565.00 − 2'257.20 = 6'957.80) und Saldo gleich DB. PDFs in der Sprache des Mieters: de (-0001, -0002, S1, S2, S3), fr (-0003), it (-0004, S4); in den fr- und it-PDFs keine deutschen Texte in den geprüften Zeilen.
- Das PDF und die Seite von -0001 zeigen noch 940.00 für Q4 (3'840.00 Kaltwasser): das ist der erwartete Stand «vor der Änderung».

### QR-Rechnungen (PDF-Seite mit `pdftoppm -png -r 300`, Decoder zxing-cpp)
Alle fünf Abrechnungen mit Nachzahlung dekodiert und gegen DB/Konfiguration geprüft: SPC/0200/1, IBAN CH4431999123000889012 (= `configuration.iban`), Kreditor Muster Immobilien AG, Währung CHF, Betrag = |Saldo|, Referenztyp QRR, 27-stellige Referenz = `qr_bill_reference` mit gültiger Prüfziffer (Modulo 10 rekursiv), Meldung «Nebenkostenabrechnung/Décompte des charges/Conteggio spese accessorie NK-...» (in der Sprache des Mieters), Zahlungspflichtiger = Mieter mit Adresse.

| Abrechnung | Betrag | Referenz | Zahlungspflichtiger | Ergebnis |
|---|---|---|---|---|
| NK-11111111-2025-0001 | 215.80 | 003246704217636042157406378 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich | bestanden |
| NK-11111111-2025-0003 | 142.40 | 004094694306010512407055539 | Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich | bestanden (Betrag siehe D-2) |
| NK-11111111-2025-0004 | 238.10 | 003549538168666000446931162 | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich | bestanden |
| NK-22222222-2025-0002 | 138.00 | 009671284619562312106376307 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern | bestanden (Betrag siehe D-2) |
| NK-22222222-2025-0004 | 91.40 | 003977133387822651121009173 | Marco Bernasconi, Seeweg 15, 6003 Luzern | bestanden |

Rückerstattungen (NK-11111111-2025-0002, NK-22222222-2025-0001, NK-22222222-2025-0003) haben im PDF keinen Zahlteil («Wir überweisen Ihnen den Betrag ...»); kein QR-Code gefunden, das ist erwartet und kein Befund.

## Nicht bestätigt

- **Anzeige «Ihr Anteil: …» und Tage je Rechnung (`LineInvoices.svelte`, `statements_part_*`)**: In keiner der acht Abrechnungen 2025 ist `invoice_parts` gesetzt (alle Positionen mit Rechnungen über unterschiedliche Tage sind Seepark-Heizpositionen mit Mietvertrag über die ganze Periode oder Heizprofil). Die Seite zeigt deshalb nur Beträge, und der Zweig mit Tagen, «Leistungszeitraum ...» und «Ihr Anteil: Wohnungsanteil × (Σ Betrag × Tage/Total) / Kosten = Anteil» wird mit diesen Datensätzen nie erreicht. Prüfen liesse er sich nur mit einer neuen Abrechnung (z. B. Mieterwechsel im Seepark mit einer Rechnung, die nur einen Teil der Periode abdeckt); das hätte Daten der Personas verändert oder einen zweiten Stack verlangt, beides war mir untersagt.
- **Englisches PDF**: kein Mieter mit Sprache en in den Demo-Daten; PDFs nur de/fr/it geprüft. Die Webseite habe ich in allen vier Sprachen geprüft.
- **Endpunkt `GET /statements/:id/pdf`**: Ich habe den gespeicherten `pdf_blob` aus der Datenbank gelesen und nicht den Endpunkt aufgerufen, weil der Endpunkt bei einem Entwurf mit altem Abrechnungsdatum das PDF neu erzeugt und speichert (Datenänderung). Die Abrechnungsdaten der Entwürfe stehen auf dem heutigen Datum, der gespeicherte Stand entspricht also dem, was der Endpunkt liefert.
- **Darstellung im Browser** (Layout, Umbruch bei 390 px, Dark Mode): nur SSR-HTML-Text verglichen, nicht gerendert; das gehört zu den Personas und axe.
