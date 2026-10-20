# Datenprüfung #451, Runde 1 (Branch w3-issue-451, c9439466)

Geprüft gegen die laufende Persona-Datenbank `dwello_persona` (frische Demo-Daten, 20.10.2026). Nichts geschrieben, nichts neu erzeugt.

## Ergebnis

Keine Abweichung bei den geprüften Beträgen. Findings: keine (D-1 ff. leer). Aber: Web-Seiten, frisch erzeugte PDFs und die Sprachen fr/en liessen sich nicht prüfen, mehrere neue Regeln (#451) kommen in den geprüften Datensätzen gar nicht vor. Beides steht unter «Nicht bestätigt». Die Abnahme von #451 durch `daten-pruefer` ist damit nur für Seepark 2025 und die gespeicherten PDFs (de, it) erfüllt, nicht für die ganze Änderung.

| ID | Schwere | Datensatz | Erwartet | Gedruckt/gespeichert |
|---|---|---|---|---|
| (keine) | | | | |

## Vorgehen

- Eigenes Skript `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/chk/recompute.py`. Es liest Rechnungen, Verteilschlüssel, Wohnungen, Mietverträge, Akonto und das Heizprofil per `psql` und rechnet die Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1, 5, 8, 9) neu. Es nutzt keinen Dwello-Code. Aufruf: `python3 .../chk/recompute.py`.
- Verglichen mit `utility_statements`, `utility_statement_line_items` und dem Text der gespeicherten PDFs (`pdf_blob`, base64; `pdftotext -layout`, Dateien `chk/stored-*.txt`).
- QR-Rechnung: Seite 2 mit `pdftoppm -png -r 300` gerendert, mit `zxing-cpp` (pip, in `scratchpad/pylib`) dekodiert.

Konvention, die das Skript erst nach dem Vergleich übernommen hat: «Ihr Anteil» = gedruckter, auf 2 Stellen gerundeter Wohnungsanteil × Zeitanteil (das druckt auch die Formel «Ihr Anteil: 1'054.47 × Zeitanteil (…) / 4'115.00»). Nur so ergeben die beiden Mieter zusammen den gedruckten Wohnungsanteil auf den Rappen (Hauswart 388.84 + 395.29 = 784.13; mit dem ungerundeten Anteil wären es 784.12). Der Saldo wird nach Regel 8 für beide Richtungen zugunsten des Mieters auf 5 Rappen gerundet (Nachzahlung ab, Rückerstattung auf).

## Geprüft und bestanden

### Seepark A2, Meier, NK-22222222-2025-0002 (01.01.–30.06.2025, 181 von 365 Tagen)

Eingaben: Schlüssel Fläche 82/320, Einheit 1/4. Heizprofil «Heizung + Warmwasser».

| Position | Kosten | Wohnungsanteil | Zeitanteil | Ihr Anteil | Datenbank / PDF |
|---|---|---|---|---|---|
| TV/Kabel (1 Rechnung) | 912.00 | 228.00 | 181/365 Tage | 113.06 | gleich |
| Heizung (4 Rechnungen) | 4'115.00 | 1'054.47 | 56.14 % | 591.94 | gleich |
| Hauswart (4 Rechnungen) | 3'060.00 | 784.13 | 181/365 Tage | 388.84 | gleich |
| Kaltwasser (4) | 2'060.00 | 527.88 | 181/365 Tage | 261.77 | gleich |
| Allgemeinstrom (2) | 499.30 | 127.95 | 181/365 Tage | 63.45 | gleich |

- Heizung je Rechnung (Anteil nach Heizprofil, Monate aus den gedruckten Werten): Q1 CHF 1'520.00: 37.20 % / 37.20 % = 100 %. Q2 CHF 790.00: 18.60 / 18.60 = 100 %. Q3 CHF 395.00: 0 / 11.00 = 0 %. Q4 CHF 1'410.00: 0 / 33.20 = 0 %. Zeitanteil = 2'310 / 4'115 = 56.136 %, gedruckt 56.14 %. «Ihr Anteil» = 1'054.47 × 2'310 / 4'115 = 591.94. Die Fussnote «Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position» steht auf Seite 2.
- Zwischensumme 1'419.06, Verwaltungspauschale 3 % = 42.57, Nebenkosten 1'461.63, Akonto 6 × 220.00 = 1'320.00, Saldo vor Rundung 141.63, Rundung − 0.03, Saldo 141.60. Gleich in Datenbank (`balance` 141.60) und PDF.
- Heizprofil-Satz: 55.80 % (13.6 + 12.1 + 11.5 + 9.3 + 5.6 + 3.7), gedruckt 55.80 %.

### Seepark A2, Brunner, NK-22222222-2025-0003 (01.07.–31.12.2025, 184 von 365 Tagen)

| Position | Kosten | Wohnungsanteil | Zeitanteil | Ihr Anteil | Datenbank / PDF |
|---|---|---|---|---|---|
| TV/Kabel | 912.00 | 228.00 | 184/365 Tage | 114.94 | gleich |
| Heizung | 4'115.00 | 1'054.47 | 43.86 % | 462.53 | gleich |
| Hauswart | 3'060.00 | 784.13 | 184/365 Tage | 395.29 | gleich |
| Kaltwasser | 2'060.00 | 527.88 | 184/365 Tage | 266.11 | gleich |
| Allgemeinstrom | 499.30 | 127.95 | 184/365 Tage | 64.50 | gleich |

- Heizung: Q1 und Q2 je 0 %, Q3 11.00 / 11.00 = 100 %, Q4 33.20 / 33.20 = 100 %. Zeitanteil = 1'805 / 4'115 = 43.86 %. Anteil = 1'054.47 × 1'805 / 4'115 = 462.53. Heizprofil-Satz 44.20 % (3.7 + 3.6 + 3.7 + 9.5 + 10.7 + 13.0).
- Zwischensumme 1'303.37, Pauschale 3 % = 39.10, Nebenkosten 1'342.47, Akonto 6 × 240.00 = 1'440.00, Saldo vor Rundung − 97.53, Rundung + 0.02, Rückerstattung 97.55. Gleich in Datenbank und PDF.

### Die beiden Mieter zusammen (Regel 5, Mieterwechsel)

| Position | Meier | Brunner | Summe | Wohnungsanteil |
|---|---|---|---|---|
| TV/Kabel | 113.06 | 114.94 | 228.00 | 228.00 |
| Heizung | 591.94 | 462.53 | 1'054.47 | 1'054.47 |
| Hauswart | 388.84 | 395.29 | 784.13 | 784.13 |
| Kaltwasser | 261.77 | 266.11 | 527.88 | 527.88 |
| Allgemeinstrom | 63.45 | 64.50 | 127.95 | 127.95 |

Alle fünf Summen stimmen auf den Rappen. Heizung ausserdem exakt: 1'054.46875 (ungerundet) gegen 1'054.47. Die Heizprofil-Sätze addieren sich zu 100.00 % (55.80 + 44.20). Die Rechnungstage und Beträge pro Rechnung in `utility_statement_line_items.invoices` und `invoice_parts` stimmen mit der Tabelle `invoices` überein (Q1 bis Q4 mit Leistungszeitraum 01.01./01.04./01.07./01.10.2025 bis Quartalsende; die Rechnung Q4 2024 mit Rechnungsdatum 20.01.2025 und Leistungszeitraum 2024 zählt zu Recht nicht in 2025, die Rechnung Q4 2025 mit Rechnungsdatum 20.01.2026 zählt zu Recht in 2025).

### Regression ohne Mieterwechsel

- A1 Weber, NK-22222222-2025-0001: alle fünf Positionen (228.00 / 874.44 / 650.25 / 437.75 / 106.10, je 365/365 Tage), Zwischensumme 2'296.54, Pauschale 68.90, Total 2'365.44, Akonto 2'400.00, Saldo vor Rundung − 34.56, Rundung + 0.04, Rückerstattung 34.60. Alles gleich. Kein Heizprofil-Hinweis, keine Rechnungszeilen (richtig bei ganzer Periode).
- B2 Bernasconi, NK-22222222-2025-0004 (PDF italienisch): 228.00 / 1'221.64 / 908.44 / 611.56 / 148.23, Zwischensumme 3'117.87, Pauschale 2.5 % = 77.95, Total 3'195.82, Akonto 3'120.00, Saldo vor Rundung 75.82, Rundung − 0.02, Saldo 75.80. Alles gleich.

### QR-Rechnungen (dekodiert)

| Abrechnung | IBAN | Betrag | Referenz | Prüfziffer | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|---|
| 2025-0002 Meier | CH4431999123000889012 | CHF 141.60 | QRR 005322569271292252637443864 | 4 (stimmt) | Nebenkostenabrechnung NK-22222222-2025-0002 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern |
| 2025-0004 Bernasconi (it) | CH4431999123000889012 | CHF 75.80 | QRR 007879385539008377171193979 | 9 (stimmt) | Conteggio spese accessorie NK-22222222-2025-0004 | Marco Bernasconi, Seeweg 15, 6003 Luzern |

- IBAN: Prüfsumme mod 97 stimmt; IID 31999 liegt im QR-IID-Bereich, passend zu QRR. Betrag und gedruckter Saldo gleich. Referenz in der Datenbank (`qr_bill_reference`) gleich. Prüfziffer nach Modulo 10 rekursiv; mein Prüfskript ist am SIX-Beispiel 21 00000 00003 13947 14300 09017 (Ziffer 7) validiert.
- Brunner (Rückerstattung 97.55) und Weber (Rückerstattung 34.60) haben richtig keinen Zahlteil; die Referenzen in der Datenbank (…8779 und …3892) haben gültige Prüfziffern.

### Texte der PDFs (de, Meier und Brunner)

Geprüft und richtig: Formel «Ihr Anteil: 1'054.47 × Zeitanteil (1'520.00 × 100.00 % + … ) / 4'115.00 = 591.94», Zeilen «Leistungszeitraum … : CHF …, Anteile der Monate im Heizprofil … zusammen …; Anteile der Monate Ihres Mietverhältnisses darin … ; Anteil nach Heizprofil: x / y = z» (benannt nach dem Beleg, daher ohne «Rechnung vom»), Satz zum gerundeten Prozentwert bei der Heizposition, Zahlenformat (`'` als Tausendertrenner), Rundungszeile mit Vorzeichen vom Betrag aus gesehen.

## Nicht bestätigt

1. **Web-Detailseiten und frisch erzeugte PDFs.** `http://localhost:3300/` leitet ohne Sitzung auf `/login` (HTTP 303). Der in `docs/design/personas/README.md` genannte Weg ist `docs/design/tools/persona-kit.mjs`; es braucht `@playwright/test` und `jose` aus dem Worktree, dort ist kein `node_modules` (Glob findet nichts). Selbst ein JWT zu signieren hat die Koordinator-Notiz verboten. Darum nur Datenbank und gespeicherte `pdf_blob` (erzeugt 20.10.2026 09:41:32 beim Seeden, also vom laufenden Stand). Die Detailseite zeigt dieselben Werte aus `utility_statement_line_items` (`share_percentage`, `period_share`, `apartment_share`, `tenant_share`); ihre Anzeige (z. B. der Faktor nach Heizprofil in %, persona P-1: Meier 56.14 %, Brunner 43.86 %) habe ich nicht gerendert.
2. **Sprachen.** Gespeichert sind Meier und Brunner nur auf Deutsch (Mieter-Sprache `de`), Bernasconi (Regression) auf Italienisch. fr und en habe ich nicht gesehen. Sie zu erzeugen hätte `generate-pdf` mit Sprachparameter gebraucht (überschreibt `pdf_blob`, nur mit Sitzung möglich). Die Beträge im italienischen PDF sind geprüft; die neuen #451-Texte (Heizposition, «Ihr Anteil»-Formel) kommen im italienischen PDF nicht vor, weil B2 die ganze Periode mietet.
3. **Neue Regeln, die in Seepark 2025 nicht auftreten:** (a) Tank: Seepark hat keinen Tankbestand (`fuel_stocks` nur für die Gebäude 1111… und 3333…), «Lieferung zählt ganz am Lieferdatum» und «− 300.00 × 139/365» sind nicht prüfbar. (b) Rechnungssumme null / Gutschrift, Zeitanteil «–», Satz bei Zeitanteil über 100 % oder unter 0 %: keine Gutschrift in den Daten (das Backend lehnt negative Beträge ab). (c) «davon … (n Tage)» für einen Leistungszeitraum über die Periode hinaus: keine solche Rechnung in 2025. (d) «Rechnung ohne Leistungszeitraum …» und «Rechnung vom {Datum} (Nr. {Nr.})» (Zeilen bei Positionen mit Rechnungen über verschiedene Tage): in Seepark 2025 gelten alle Rechnungen einer Position für gleiche Tage oder haben einen Beleg. (e) Geteilter Monat «Jan 15.68 % (18.00 % × 27/31 Tage)»: der Mieterwechsel liegt am Monatswechsel. (f) Punkt 8, Abrechnung ohne Heizkosten ohne Heizprofil: alle 17 Demo-Abrechnungen haben Heizkosten. Diese Fälle bräuchten andere Daten (z. B. ein Mieterwechsel mitten im Monat, ein Tankgebäude oder Rechnungen per API); ich habe sie nicht angelegt, weil nichts gespeichert werden darf.
4. **Hinweise im Abrechnungslauf** (Punkte 5 und 6: versendete Abrechnung mit alter Regel, Heizrechnungen ohne Leistungszeitraum): nicht Teil der Beträge, nicht geprüft. Die Demo-Heizrechnungen Q1 bis Q4 2024/2025 tragen ihr Quartal als Leistungszeitraum (Tabelle `invoices`, bestätigt).
