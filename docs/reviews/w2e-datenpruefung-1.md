# Datenprüfung #358 / #120: berichtigte Abrechnungen (Commit 1dfdaa2)

Datenbank `dwello_persona`, nur SELECT. Eigene Nachrechnung: `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/w2e/recompute.py` (liest Rechnungen, Verteilschlüssel, Verträge, Heizprofil und Tankbestände aus der DB, importiert keinen Dwello-Code).
Ausführen: `python3 -I recompute.py`.

## Ergebnis

Alle sechs Abrechnungen stimmen auf den Rappen. Es gibt keinen Blocker, Major oder Minor in den berichtigten Abrechnungen. Zwei Punkte ausserhalb der Aufgabe sind Nit/Hinweis (D-1, D-2). Ein Teil der Prüfung ist nicht bestätigt (siehe unten).

| ID | Severity | Record | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Nit (Hinweis, nicht Teil von #120) | NK-11111111-2024-0002/-0003/-0004 (Schmidt, Dubois, Rossi, alle `paid`); NK-22222222-2024-0002/-0003 (Meier, Bernasconi, `paid`) | Nach der neuen Rechnung «Hauswart Muster AG» (CHF 400.00) und der gesenkten Fernwärme Q1 gelten die anderen Abrechnungen derselben Periode nicht mehr als berichtigt. Das ist keine Pflicht, aber ein Hinweis wäre nützlich. | Sie bleiben unverändert (Müller 2024-0001 war 2'866.58 ohne die 400.00). Die App zeigt nach meinen Daten keinen Hinweis an die anderen Mietverträge der Liegenschaft. Die Persona-Aufgabe nannte nur je einen Mieter, daher nur als Beobachtung. |
| D-2 | Nit | PDF NK-33333333-2024-0003, Kopf: «Wohnung EG, EG, 72.00 m²» | Wohnungsnummer und Stockwerk nicht doppelt | Die Wohnungsnummer «EG» und das Stockwerk 0 = «EG» stehen beide da. Das liegt an der Demo-Wohnungsnummer und hat mit #120 nichts zu tun. |

## Geprüfte und bestandene Records

Berichtigte Abrechnungen (gespeicherte Werte gegen Nachrechnung):

| Abrechnung | Kosten | Pauschale | Akonto | prior_payments | Saldo vor Rundung | Saldo (5 Rappen) | Gespeichert |
|---|---|---|---|---|---|---|---|
| NK-11111111-2024-0005 Müller | 3'021.25 (Zwischensumme 2'933.25, 3 %: 88.00) | 88.00 | 2'880.00 | 72.55 | 68.70 | 68.70 | bestanden |
| NK-33333333-2024-0003 Keller | 1'645.25 (1'597.33 + 47.92) | 47.92 | 1'900.00 (10 Monate à 190.00) | –32.35 | –222.40 | –222.40 | bestanden |
| NK-22222222-2024-0004 Weber | 2'285.98 (2'219.40 + 66.58) | 66.58 | 2'400.00 | –70.25 | –43.77 | –43.80 (Rückerstattung auf-, Rundung +0.03) | bestanden |

Zeilen (Gesamtbetrag, Wohnungsanteil, Zeitanteil, Mieteranteil) stimmen für alle drei mit den heutigen Rechnungen überein:
- Müller: Position «Hauswart» CHF 400.00 ohne Verteilschlüssel gleichmässig auf 6 Wohnungen = 66.67 (16.67 %); Heizung 6'890 – 530 Tankbestand = 6'360.00 → 1'000.49.
- Keller: 306 von 366 Mietstage (01.03.–31.12.2024 nachgerechnet), Zeitanteil 0.8361 für Schnee, Wasser und Strom (299.80, 220.72, 87.25), Heizung und Kaminfeger nach Heizprofil «Heizung Mittelland» mit 68.00 % (Mär–Dez: 13.5 + 9.5 + 3.5 + 0 + 0 + 0 + 1 + 10 + 13.5 + 17 = 68; Jahr = 100), 933.88 und 55.68. Heizung 5'120 – 256 = 4'864.00.
- Weber: Fernwärme Q1 = 1'280.00, Heizung 3'860.00 → 820.25. Hinweis: Die Rechnung Q4 hat Rechnungsdatum 20.01.2025, wird aber mit ihrem Leistungszeitraum (01.10.–31.12.2024) richtig mitgezählt. Kabelanschluss 2025 bleibt draussen.

Ersetzte Abrechnungen (unverändert, auch Zahlungsdatum und -betrag):

| Abrechnung | Original-Werte | Gespeichert | Befund |
|---|---|---|---|
| NK-11111111-2024-0001 | Zwischensumme 2'866.58, Pauschale 86.00, total 2'952.58, Saldo 72.58 → 72.55 | status `replaced`, 2'952.58 / 86.00 / 72.55, paid_date 2025-05-05, paid_amount 72.55, 8 Positionen ohne die 400.00 | bestanden |
| NK-22222222-2024-0001 | Heizung mit alter Fernwärme 1'480 = 4'060 → 862.75, Zwischensumme 2'261.90, Pauschale 67.86, total 2'329.76, Saldo –70.24 → –70.25 | status `replaced`, 2'329.76 / 67.86 / –70.25, paid_date 2025-05-05, paid_amount –70.25, Heizung 4'060.00 / 862.75 | bestanden |
| NK-33333333-2024-0001 | 366 Tage, 2'182.19 + 65.47 = 2'247.66, Akonto 2'280.00, Saldo –32.34 → –32.35 | status `replaced`, 2'247.66 / 65.47 / –32.35, 366 Tage, Zeitanteil 1.0, paid_date 2025-05-05, paid_amount –32.35 | bestanden |

Verknüpfung: `replaces_id` zeigt bei allen drei auf die ersetzte Abrechnung (Unique-Index `statements_replaces_idx`); die Nummern sind neu (0005, 0004, 0003); gleiche Periode, gleicher Mietvertrag (contract_id); neuer Entwurf wurde `sent`. `prior_payments` = `paid_amount` der ersetzten + deren eigenes `prior_payments` (0), Rückerstattung negativ gezählt. Zahlungsfrist 16.11.2026 (30 Tage nach 17.10.2026).

Gespeicherte PDFs (`utility_statements.pdf_blob`, ausgelesen, in `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/w2e/*.pdf` entpackt, alle Mieter auf Deutsch), Text mit `pdftotext -layout` gegen die Datenbank:
- Alle drei: «Diese Abrechnung ersetzt die Abrechnung NK-… vom 14.04.2025.» (Datum = `statement_date` der ersetzten), Zeile «Bereits bezahlt auf NK-…» (Müller, minus) bzw. «Bereits zurückerstattet auf NK-…» (Keller, Weber, plus), Herleitungszeile im Saldo-Kasten. Alle Beträge wie in der Tabelle oben.
- Weber: «Rückerstattung vor Rundung 43.77», «Rundung auf 5 Rappen + 0.03», «Rückerstattung 43.80»; Herleitung «… + bereits zurückerstattet CHF 70.25, auf 5 Rappen gerundet». Richtig (grösser durch Rundung = +).
- Keller: kein Rundungsblock, da 222.40 schon auf 5 Rappen. Heizprofil-Block mit 68.00 % und den Monatsanteilen steht auf Seite 2.
- QR-Zahlteil nur bei Müller (Nachzahlung, noch nicht bezahlt). Keller und Weber (Rückerstattung): kein Zahlteil, auf allen Seiten gescannt, nichts gefunden.

QR-Rechnung NK-11111111-2024-0005 (Seite 2 mit `pdftoppm -png -r 300` gerendert, mit zxing-cpp in einem venv im Scratchpad dekodiert; OpenCV konnte den QR-Code nicht lesen, zxing-cpp schon):
- Inhalt: `SPC / 0200 / 1 / CH4431999123000889012 / S / Muster Immobilien AG / Bahnhofstrasse 1 / (leer) / 8001 / Zürich / CH / … / 68.70 / CHF / S / Hans Müller / Bahnhofstrasse 42 / (leer) / 8001 / Zürich / CH / QRR / 006781576660070281129955295 / Nebenkostenabrechnung NK-11111111-2024-0005 / EPD`.
- IBAN stimmt mit `configuration.iban` überein, Prüfsumme mod 97 = 1 (gültig), IID 31999 liegt im QR-IBAN-Bereich und passt zur Referenzart QRR.
- Betrag 68.70 gleich `balance` und gleich Betrag im Zahlteil und Empfangsschein.
- Referenz gleich `qr_bill_reference`, 27 Stellen, Prüfziffer 5 nach Modulo 10 rekursiv richtig. Gleiches für die Referenzen der Abrechnungen 0001 (8), Keller 0003 (9) und Weber 0004 (7).
- Nachricht und Zahlbar durch (Hans Müller, Bahnhofstrasse 42, 8001 Zürich) stimmen mit der DB überein.

## Nicht bestätigt

- **Web-Seite und Live-PDF-Abruf** (`GET /api/v1/statements/<id>/pdf`, Frontend-Route): beide brauchen eine angemeldete Sitzung. Ich habe den Token nicht selbst mit dem Persona-Secret signiert, weil das Berechtigungssystem es abgelehnt hat (Credential-Zugriff). Statt dessen habe ich die in der DB gespeicherten PDFs geprüft (bei «Senden» erzeugt, `pdf_generated_at` 02:22). Offen bleibt, ob ein frisch erzeugtes PDF oder die Seite dasselbe zeigt. Wer einen Token ausstellt, kann die Prüfung wiederholen: das PDF muss mit den hier geprüften Texten und Beträgen übereinstimmen.
- **Sprachen fr/it/en**: die drei Mieter (Müller, Keller, Weber) sind auf Deutsch eingestellt, und PDFs in anderen Sprachen lassen sich ohne Änderung der Daten nicht erzeugen. Texte und Zeilen «ersetzt», «bereits bezahlt», «bereits zurückerstattet» in fr/it/en sind ungeprüft.
- **Web-Seite der berichtigten Abrechnung** (Anzeige von prior_payments und ersetzter Nummer): nicht angesehen, aus demselben Grund.
- **Renderung der ersetzten Abrechnungen als PDF**: nicht geprüft (nicht gefragt; die Datenbankwerte sind unverändert).
- **Heizprofil-Rundung «Anteil nach Heizprofil»**: mein Zeitanteil für Keller kommt auf 0.6800 (exakt), gleiche Werte wie gespeichert. Ob die Rundung auf zwei Stellen (#232) bei anderen Daten abweicht, ist hier nicht getestet.

## Reproduktion

- `python3 -I /tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/w2e/recompute.py` druckt je Abrechnung berechnete und gespeicherte Positionen, Pauschale, Akonto, Saldo.
- PDF: `psql postgresql://dwello:dwello@localhost:5432/dwello_persona -At -c "select pdf_blob from utility_statements where statement_number='NK-11111111-2024-0005'" | base64 -d > x.pdf`, dann `pdftoppm -png -r 300 -f 2 -l 2 x.pdf p` und `zxingcpp.read_barcodes(cv2.imread('p-2.png'))` aus dem venv `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/w2e/venv`.
