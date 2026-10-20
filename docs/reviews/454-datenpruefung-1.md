# Datenprüfung #454, Runde 1 (daten-pruefer)

Stand: Worktree `review-454-daten` bei fa464b46, Datenbank `dwello_persona` (nur SELECT), 20.10.2026.
Eigene Neuberechnung (ohne Dwello-Code): `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/recalc/recalc.py` (2025), `recalc24.py` (2024), `qrcheck.py`, `pdfcheck.py`.
Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1 bis 12), `UBIQUITOUS_LANGUAGE.md` (Saldo, Rundung auf 5 Rappen).

## Ergebnis in einem Satz

Alle Beträge stimmen auf den Rappen. Die Neuberechnung der versendeten Abrechnungen von Thomas Weber (Saldo +162.40 statt -34.60) und Hans Müller (+318.80 statt +215.80) stimmt mit meinen Zahlen und mit dem überein, was die App als «Nicht berichtigt» gespeichert hat. Ein Befund (Minor), keine Blocker/Major.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Minor | Rechnungsliste, Filter «Abrechnungsperiode» zusammen mit dem Jahresfilter (Rechnungsdatum), Seepark 2025 | Die Gruppe «Umlagefähige Kosten» nennt genau die Rechnungen, die eine Abrechnung 2025 nimmt (16 Rechnungen, CHF 11'546.30), auch wenn zusätzlich ein Jahr gewählt ist | Ist zusätzlich `year=2025` gesetzt, schneidet `invoiceQuery` (`src/routes/invoices/+page.server.ts`) mit `dateFrom/dateTo` nach Rechnungsdatum: «Fernwärme Q4 2025» (CHF 1'410.00, Leistungszeitraum 01.10.–31.12.2025, Rechnungsdatum 20.01.2026) fällt weg, 15 statt 16 Rechnungen. Die Überschrift behauptet weiter, die Liste zeige alle Rechnungen der Periode. Aus dem Code und der Datenbank abgeleitet, nicht in der Oberfläche gesehen (kein Login). |

Kein weiterer Befund. Insbesondere: kein Blocker bei Saldo, Rundung, QR-Rechnung.

## D-1: Beleg und Reproduktion

```
psql postgresql://dwello:dwello@localhost:5432/dwello_persona -tA -c "
select count(*), sum(amount) from invoices
where building_id='22222222-2222-2222-2222-222222222222' and is_valid_utility_cost
and ((service_period_start is null and invoice_date between '2025-01-01' and '2025-12-31')
  or (service_period_start<='2025-12-31' and service_period_end>='2025-01-01'))"
-> 16 | 11546.30            (= Summe der Gebäudekosten der Positionen von Weber inkl. der 900.00)

dasselbe mit zusätzlich invoice_date between '2025-01-01' and '2025-12-31' -> 15
```
Reproduktion in der Oberfläche (nicht ausgeführt): `/invoices?building=22222222-2222-2222-2222-222222222222&periodStart=2025-01-01&periodEnd=2025-12-31&year=2025` und dieselbe Adresse ohne `year`; die zweite nennt «Fernwärme Q4 2025», die erste nicht. Vorschlag: bei gesetztem `periodStart` den Jahresfilter ignorieren oder die Auswahl «Jahr» ausblenden.

## Seepark Residenz, Abrechnung NK-22222222-2025-0001 (Thomas Weber, versendet)

Eingaben aus der Datenbank: Wohnung A1 68.00 m² von 320.00 m² (vier Wohnungen), Mietvertrag 01.04.2022 offen, 365 von 365 Tagen, Akonto 200.00 × 12 = 2'400.00, Pauschale 3 %, alle zwölf Kategorien vereinbart, kein Tankbestand.

| Position | Gebäude | Anteil | gespeichert | mein Wert |
|---|---|---|---|---|
| TV/Kabel, Pro Einheit | 912.00 | 1/4 | 228.00 | 228.00 |
| Hauswart, Pro Fläche (4 × 765.00) | 3'060.00 | 68/320 | 650.25 | 650.25 |
| Heizung (1'520 + 790 + 395 + 1'410; Q4 mit Leistungszeitraum 2025) | 4'115.00 | 68/320 | 874.44 | 874.4375 gerundet 874.44 |
| Kaltwasser | 2'060.00 | 68/320 | 437.75 | 437.75 |
| Allgemeinstrom | 499.30 | 68/320 | 106.10 | 106.10125 gerundet 106.10 |

Zwischensumme 2'296.54, Pauschale 68.8962 gerundet 68.90, Nebenkosten 2'365.44, Akonto 2'400.00, vor Rundung -34.56, Rundung +0.04 (Rückerstattung aufgerundet), Saldo -34.60. Gespeichert -34.60. PDF (aus `pdf_blob`, Deutsch): jeder Betrag gleich, «Rückerstattung vor Rundung 34.56, Rundung auf 5 Rappen + 0.04, Rückerstattung 34.60». Keine QR-Rechnung (Rückerstattung), korrekt.

Die Rechnung 7274c66b-1749-4b6e-8147-9acd2acba019 (Hauswart, CHF 900.00, 20.05.2025, Pro Fläche) wird von einer Abrechnung 2025 genommen (Rechnungsdatum in der Periode, gültig, Kategorie vereinbart).

Neuberechnung (meine Rechnung, gleiche Eingaben plus die 900.00):
- Hauswart Gebäude 3'960.00, Anteil 3'960.00 × 68/320 = 841.50
- Zwischensumme 228.00 + 841.50 + 874.44 + 437.75 + 106.10 = 2'487.79
- Pauschale 74.6337 gerundet 74.63, Nebenkosten 2'562.42, minus 2'400.00 = +162.42, Nachzahlung abgerundet auf 162.40.

Gespeichert in `correction_declined.result` (von der App berechnet): Saldo "162.4", Hauswart 841.50, alle anderen Positionen unverändert. Stimmt. Die Schätzung von Dr. Weber (etwa CHF 162) stimmt (genau 162.40, eine Nachzahlung statt der Rückerstattung von 34.60). Die Differenz der Salden vor Rundung ist 196.98 = 900.00 × 68/320 = 191.25 plus 3 % Pauschale (191.25 × 1.03 = 196.99, Rundung der Pauschale). «Nicht berichtigen» war zulässig, weil der Saldo steigt (`raises`).

Entwürfe anderer Mieter, Seepark (Datenbank, 17 Abrechnungen insgesamt; alle 2025 und 2024 stimmen mit meinem Modell überein, ohne die zwei von den Personas erfassten Rechnungen):

| Abrechnung | gespeichert (Positionen, Kosten, Saldo) | mein Wert ohne die 900.00 | Neuberechnung heute (mit der 900.00), mein Wert |
|---|---|---|---|
| -0002 Meier (181 Tage) | 1'250.32, -69.70 | gleich | Hauswart 503.20, Nebenkosten 1'368.11, Saldo +48.10 |
| -0003 Brunner (184 Tage) | 1'553.79, +113.75 | gleich | Hauswart 511.55, Nebenkosten 1'673.53, Saldo +233.50 |
| -0004 Bernasconi (2.5 %) | 3'195.82, +75.80 | gleich | Hauswart 1'175.63, Nebenkosten 3'469.69, Saldo +349.65 |

Das heisst: gleiche Rechnungen gleiche Positionen und Beträge. Die Entwürfe sind heute veraltet, weil die Rechnung 900.00 dazugekommen ist; eine Neuberechnung ergibt die Werte der rechten Spalte, nur die Position Hauswart ändert sich (und Pauschale und Saldo folgen). Rundungsnotiz: Dwello rundet den Wohnungsanteil der Position auf zwei Stellen, bevor es mit dem Zeitanteil malnimmt (Brunner Hauswart 3'060 × 82/320 = 784.125, gerundet 784.13, × 184/365 = 395.29, direkt 395.28). Das PDF druckt dasselbe (Wohnungsanteil × Zeitanteil), also in sich stimmig. `docs/nebenkostenabrechnung-anforderungen.md` Regel 5 schreibt das nicht ausdrücklich vor (ohne Befund).

## Musterhaus Zentrum, Abrechnung NK-11111111-2025-0001 (Hans Müller, versendet 28.09.2026)

Wohnung 1.01 75.50 m² von 492.50 m², 6 Wohnungen (zwei leer, Leerstand trägt der Vermieter), Akonto 240 × 12 = 2'880.00, Pauschale 3 %.

Stand beim Versand (gespeichert = mein Wert): Lift 281.67, Hauswart 564.14 (3'680 × 75.5/492.5 = 564.142), Kaltwasser 588.67, Allgemeinstrom 116.94, Gartenpflege 143.34, Kehricht 165.00, Heizung 1'094.53 (Verbrauch 2'650.00 + 6'565.00 - 2'257.20 = 6'957.80; Schlüssel 0.7 × 75.5/492.5 + 0.3/6 = 0.157310), Kaminfeger 51.36. Zwischensumme 3'005.65, Pauschale 90.17, Nebenkosten 3'095.82, vor Rundung +215.82, Rundung -0.02, Saldo 215.80. PDF stimmt (Seite 1 bis 3).

Rechnung 356c92eb-3346-477d-a40d-996cd61a4a35 (Hauswart, 600.00, 15.06.2025, ohne Verteilschlüssel): Regel 3, ohne Schlüssel gleichmässig pro Wohnung, geteilt durch alle sechs Wohnungen, also 600/6 = 100.00 Mieteranteil (Zeitanteil 365/365). Zwischensumme 3'105.65, Pauschale 93.1695 gerundet 93.17, Nebenkosten 3'198.82, vor Rundung +318.82, Saldo 318.80. Gespeichert in `correction_declined.result`: "318.8", Position Hauswart/ohne Schlüssel 100.00, alle anderen Positionen unverändert. Stimmt.

Zum Hinweis: Die Rechnung ändert den Saldo um +103.00 und fügt eine Position hinzu. «Weder den Saldo noch eine Position» (`statements_later_sent_none`) wäre falsch, «Abrechnung berichtigen» (`statements_later_sent`) ist richtig; nach dem Entscheid zeigt die Seite `statements_later_sent_declined` («Am … haben Sie entschieden …»), passend zum gespeicherten Zustand. Nach Code (`statementChanges`): Rechnung nicht in einer Position mit Kategorie und Schlüssel enthalten, also geändert; `recalculation.changes` wahr; Saldo steigt, also ablehnbar. Konsistent.

Entwürfe Musterhaus (gespeichert = mein Wert ohne die 600.00; mit der 600.00 je +103.00 brutto, jeweils nach Rundung): -0002 Schmidt -6.50 / neu +96.50; -0003 Dubois +142.35 / neu +245.35; -0004 Rossi +238.10 / neu +341.10 (Position Hauswart ohne Schlüssel 100.00 bei jedem, 600/6).

Tankbestand: Für jede der 17 Abrechnungen wurde `fuel_stock` mit den heutigen `fuel_stocks` (Anfangsbestand am Tag vor Periodenbeginn, Endbestand am Periodenende) verglichen: keine Abweichung, bei Seepark gar kein Bestand (Fernwärme). Es gibt also in den Daten keinen Tankbestand-Hinweis zu erwarten, und der Vergleich löst bei diesen Daten nicht fälschlich aus.

## Rechnungsliste, Abrechnungsperiode

Mit SQL (Regel 1: Leistungszeitraum, sonst Rechnungsdatum; gültig) die Menge je Gebäude gebildet und mit der Menge der Rechnungen verglichen, die die Positionen aller Abrechnungen derselben Periode tragen (`utility_statement_line_items.invoices`):
- 2024: identisch (ausser den Pseudo-Einträgen `fuel-stock-…` der Tankbestandspositionen).
- 2025: unterschiedlich nur die zwei neuen Rechnungen der Personas (nach den Abrechnungen erfasst) und Alpenblick (für 2025 gibt es keine Abrechnung).
- Seepark 2025: 16 umlagefähige Rechnungen, Summe 11'546.30 = Gebäudekosten der Positionen Weber (3'060 + 912 + 4'115 + 2'060 + 499.30 = 10'646.30) + 900.00. Nicht umlagefähig: keine. «Fernwärme Q4 2024» (Rechnungsdatum 20.01.2025, Leistungszeitraum 2024) wird zu Recht nicht gezählt, «Fernwärme Q4 2025» (Rechnungsdatum 20.01.2026) zu Recht gezählt.
- Die Gruppe «Nicht umlagefähige Kosten» wäre bei Musterhaus nur 2024 gefüllt («Reparatur Boiler Wohnung 2.01», 2'350.00, Kategorie nicht umlagefähig, 20.02.2024: ausserhalb 2025).
- Der Teil in der Periode (`inPeriod`): Code liest sich wie das Beispiel der Anforderungen (1'200.00 × 61/92 = 795.65; Boiler 500 × 365/1'826 = 99.95): Betrag × Tage in der Periode / Tage des Leistungszeitraums, auf Rappen gerundet; bei einer Rechnung ohne Leistungszeitraum oder ganz in der Periode wird «davon» nicht gezeigt. In den Daten gibt es keine Rechnung mit Leistungszeitraum über das Jahresende (nur Q4 2024 vollständig in 2024 und Q4 2025 vollständig in 2025), also kein «davon CHF …» zu prüfen, siehe «Nicht bestätigt».

## QR-Rechnungen (aus `pdf_blob`, `pdftoppm -png -r 300` der letzten Seite, Decoder zxing-cpp 3.1.1 im Scratchpad)

Alle mit IBAN CH4431999123000889012 (Prüfsumme Mod 97 gültig, QR-IBAN, IID 31999), Währung CHF, Adresse Typ S, Referenztyp QRR (27 Stellen, Prüfziffer Mod 10 rekursiv gültig, gleich `qr_bill_reference`), Schlusszeile EPD, Schuldner und Betrag gleich dem Mieter und dem Saldo:

| Abrechnung | Sprache | Betrag | Referenz | Schuldner | Mitteilung |
|---|---|---|---|---|---|
| NK-11111111-2025-0001 (versendet) | de | 215.80 | 005071557400998267862798712 | Hans Müller | Nebenkostenabrechnung NK-11111111-2025-0001 |
| NK-11111111-2025-0003 | fr | 142.35 | 005842029565878907526556035 | Pierre Dubois | Décompte des charges NK-11111111-2025-0003 |
| NK-11111111-2025-0004 | it | 238.10 | 007871128999812539608295587 | Maria Rossi | Conteggio spese accessorie NK-11111111-2025-0004 |
| NK-22222222-2025-0003 | de | 113.75 | 011072129808442281882129625 | Nina Brunner | Nebenkostenabrechnung NK-22222222-2025-0003 |
| NK-22222222-2025-0004 | it | 75.80 | 010269340453917883629960642 | Marco Bernasconi | Conteggio spese accessorie NK-22222222-2025-0004 |

Alle Beträge gleich `balance`. Die Abrechnungen mit Rückerstattung (-0001 Weber, -0002 Schmidt, -0002 Meier) haben kein Zahlteil, korrekt. PDF-Zahlen: für alle acht Abrechnungen 2025 stehen Kosten, Pauschale, Akonto, Saldo und jeder Positionsbetrag (Gebäude, Wohnungsanteil, Ihr Anteil) im PDF (`pdfcheck.py`).

## Geprüft und bestanden

- NK-22222222-2025-0001 Weber: Positionen, Pauschale, Saldo, Rundung, PDF, Neuberechnung 162.40, gespeichertes Ergebnis von «Nicht berichtigen».
- NK-11111111-2025-0001 Müller: dasselbe, Neuberechnung 318.80, Hinweis passt (Berichtigung, nicht «weder noch»), QR 215.80.
- NK-11111111-2025-0002/-0003/-0004, NK-22222222-2025-0002/-0003/-0004: gespeicherte Werte und mein Modell gleich; Werte einer Neuberechnung heute aus meinem Modell (oben).
- 2024: alle neun Abrechnungen (Musterhaus 4, Seepark 3, Alpenblick 2) mit meinem Modell gleich auf den Rappen (inkl. Rundung, Tankbestand, Pauschale 2.5 % / 0 %).
- Tankbestand: kein Unterschied zwischen `fuel_stock` und `fuel_stocks` bei 17 Abrechnungen.
- Rechnungsliste 2024 und 2025: Menge gleich der von den Abrechnungen genommenen (ausser neuen Rechnungen).
- Der Code `recalculated()` in `statement.service.ts` rechnet wie vorher (Diff gegen 6095bab9: Auszug von `recalculateStatement`, Saldo mit `priorPayments` und Übertrag gleich).

## Nicht bestätigt

- Weboberfläche (Statusseite, Hinweise, Rechnungsliste mit gruppierten Rechnungen, Übersicht «veraltete Abrechnungen»): Login und JWT sind mir untersagt, die Seiten leiten auf die Anmeldung (HTTP 303). Texte nur aus `messages/de.json` und dem Svelte-Code gelesen. Deshalb auch nicht gesehen: das Verhalten von D-1 in der Oberfläche, die Anzahl der Aufgaben in der Übersicht.
- Tatsächliche «Neu berechnen»-Ausgabe der App für die sechs veralteten Entwürfe: nicht ausgeführt (würde Daten ändern; `backend/node_modules` ist mir nicht zugänglich). Die Werte stammen aus meinem unabhängigen Modell, das alle 17 gespeicherten Abrechnungen auf den Rappen trifft, und für Weber und Müller zusätzlich aus dem von der App gespeicherten `correction_declined.result`.
- «davon CHF … in der Abrechnungsperiode» bei einem Leistungszeitraum über das Jahresende: keine solche Rechnung in der Datenbank. Nur Codeformel (Betrag × Tage / Tage, gerundet) mit den Beispielen der Anforderungen gerechnet, nicht an einem Datensatz.
- PDFs in Englisch und die PDFs in fr/it für Weber und Müller: in `pdf_blob` liegen nur die vorhandenen (de, fr, it je nach Mieter); ich habe keine PDF neu erzeugt. Die nach dem letzten Stand (a96fc0a0) geänderten Teile (Mahnstufe, Ablehnungsregeln) habe ich nicht gelesen.
- Backend-Tests mit `dwello_test_r454d` nicht ausgeführt.
