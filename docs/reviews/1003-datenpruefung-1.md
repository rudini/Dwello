# Datenprüfung #1003, Runde 1 (daten-pruefer)

Geprüfter Stand: Commit 395ed01 (Branch w-1003). Code und Docs habe ich nur über `git archive 395ed01` gelesen (nach /tmp/scratchpad/d1003/src), nicht aus dem Arbeitsbaum. Daten: `dwello_persona`, nur lesend (psql, GET auf Backend :3301 und Frontend :3300; kein `generate-pdf`, kein Schreibzugriff).

## Ergebnis

Keine Findings. Kein Blocker, kein Major, kein Minor.

| ID | Schwere | Record | Erwartet | Tatsächlich |
|----|---------|--------|----------|-------------|
| (keine) | – | – | – | – |

Geprüft: NK-22222222-2025-0004 (3a6688d6-b90a-4e9c-8a22-ed9f735bc5c8): gespeicherte Werte, Webseite, `pdf_blob` und API-PDF (identisch, md5 bb4fa479…), Dokument 8285920f-31a3-4f28-a587-3e201f4c157c (identischer Text, gleicher QR-Inhalt), QR-Rechnung der Abrechnung und des Dokuments.

## Nachrechnung (unabhängig, /tmp/scratchpad/d1003/verify.py, liest nur aus der DB)

Eingaben aus der DB: 16 Rechnungen Gebäude 22222222 (is_valid_utility_cost, Periode 2025, Rechnung SR-2024-014 mit Leistungszeitraum 2024 ausgeschlossen, SR-2025-014 mit Rechnungsdatum 2026 und Leistungszeitraum Q4 2025 eingeschlossen), Verteilschlüssel (Fläche 95/320 m², Einheit 1/4), Vertrag b0000002-…04 (alle Kategorien vereinbart, Verwaltungspauschale 2.5 %, Akonto 260.00 × 12, Mietstage 365/365), Teilzahlungen `payments` = [40.00 am 01.11.2026].

| Position | Skript | Gespeichert / PDF |
|---|---|---|
| TV/Kabel (912.00 / 4) | 228.00 | 228.00 |
| Hauswart (3'060.00 × 95/320) | 908.44 | 908.44 |
| Heizung (4'115.00 = 1'520 + 790 + 395 + 1'410) | 1'221.64 | 1'221.64 |
| Kaltwasser (2'060.00) | 611.56 | 611.56 |
| Allgemeinstrom (499.30) | 148.23 | 148.23 |
| Zwischensumme | 3'117.87 | 3'117.87 |
| Verwaltungspauschale 2.5 % | 77.95 | 77.95 |
| Ihre Nebenkosten | 3'195.82 | `total_costs` 3195.82, PDF 3'195.82 |
| Akonto | 3'120.00 | 3120.00, PDF 3'120.00 |
| Saldo vor Rundung | 75.82 | PDF 75.82 |
| Rundung (zugunsten Mieter, auf 5 Rappen) | – 0.02 | PDF – 0.02 |
| Saldo | 75.80 | `balance` 75.80, PDF «Importo dovuto 75.80» |
| Bereits bezahlt | 40.00 | `paid_amount` 40.00 |
| Offener Betrag | 35.80 | siehe unten |

Die Kostentabelle endet auf Seite 1 mit «Importo dovuto 75.80» (Saldo, nicht der offene Betrag). Die Webseite (/statements/3a6688d6…) zeigt «CHF 75.80» und «Bezahlt: CHF 40.00, offen: CHF 35.80».

## Offener Betrag im PDF (Italienisch, `pdftotext -layout` und gerenderte Seiten)

- Ergebnisbox: «Importo ancora dovuto CHF 35.80», «La preghiamo di pagare l'importo ancora dovuto entro il 01.12.2026 tramite la sezione pagamento.», «Importo del conteggio CHF 75.80 – Già pagato CHF 40.00», dazu die Zeile «Le sue spese accessorie CHF 3'195.82 – Acconti CHF 3'120.00, arrotondato a 5 centesimi». 75.80 – 40.00 = 35.80 stimmt, es wird nicht noch einmal auf 5 Rappen gerundet.
- Empfangsschein: Währung CHF, Betrag 35.80.
- Zahlteil: Währung CHF, Betrag 35.80.
- Konto, Referenz (gruppiert 00 27578 86841 73845 89063 22269), Zusatzinformation und Zahlbar durch im Text stimmen mit dem QR-Code überein.

## QR-Rechnung (Dekodierung)

Seite 2 mit `pdftoppm -png -r 300` gerendert, mit zxing-cpp (venv in /tmp/scratchpad/d1003/venv) dekodiert, für die Abrechnung (stmt-2.png) und das Dokument (doc-2.png). Beide liefern dieselbe Nutzlast (31 Zeilen, SPC 0200, Kodierung 1):

| Feld | Wert im QR | Soll | OK |
|---|---|---|---|
| IBAN | CH4431999123000889012 | `configuration.iban`; QR-IBAN (IID 31999), Modulo 97 = 1 | ja |
| Zahlbar an | S, Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH | `company_*` | ja |
| Betrag / Währung | 35.80 / CHF | Saldo 75.80 – 40.00 | ja |
| Zahlbar durch | S, Marco Bernasconi, Seeweg 15, 6003 Luzern, CH | `tenants` a0000001-…07 | ja |
| Referenztyp / Referenz | QRR / 002757886841738458906322269 | = `qr_bill_reference`; 27 Stellen, Prüfziffer (Modulo 10 rekursiv) erwartet 9, tatsächlich 9 | ja |
| Mitteilung | Conteggio spese accessorie NK-22222222-2025-0004 | Titel in Tenant-Sprache it + Nummer | ja |
| Trailer | EPD | EPD | ja |

Vergleich mit dem Vorgänger-PDF (/tmp/weber-1003/versendet.pdf): dort Box «Importo dovuto 75.80», Empfangsschein und Zahlteil 75.80; Referenz, IBAN, Adressen unverändert. Es ändern sich nur Box, Betragsfelder und QR-Betrag. Dass Seite 1 jetzt mit der Kostentabelle endet und die Erklärung «Costi dell'immobile …» auf Seite 2 rutscht, ist Layout (alle Beträge und Texte stimmen), kein Finding.

## Reproduktion

```
export PGPASSWORD=dwello
psql -h localhost -U dwello -d dwello_persona -c "select balance,paid_amount,payments from utility_statements where id='3a6688d6-b90a-4e9c-8a22-ed9f735bc5c8'"
psql ... -At -c "select pdf_blob from utility_statements where id='3a6688d6-…'" | base64 -d > stmt.pdf
pdftoppm -png -r 300 stmt.pdf stmt
/tmp/scratchpad/d1003/venv/bin/python -I /tmp/scratchpad/d1003/verify.py stmt-2.png
```

Ausgabe des Skripts (Auszug): `sub 3117.87 fee 77.95 costs 3195.82 advance 3120.00 raw 75.82 saldo 75.80 paid 40.00 open 35.80`, `amount 35.80 CHF`, `QRR len 27 check digit expected 9 actual 9`, `ref == stored: True`, `OK, QR amount == open == 35.80`.

## Nicht bestätigt

- PDF in Deutsch, Französisch und Englisch nach Teilzahlung: In der Persona-Datenbank liegt nur dieses eine PDF (Italienisch, Mieter Bernasconi); ein anderes zu erzeugen hiesse `generate-pdf` aufzurufen und das gespeicherte PDF der Persona zu überschreiben, das habe ich nicht getan. Gelesen habe ich nur die neuen Übersetzungen im Diff von `backend/src/services/pdf.service.ts` (de, fr, it, en: `openAmount`, `openRefund`, `paidSoFarLine`, `refundedSoFarLine`, `paidSoFarOwnLine`, `payOpenBy/NoDate`, `refundOpenBy/NoDate`, `replacesPayOpen`); sie stimmen im Aufbau mit dem italienischen PDF überein, gerendert sind sie nicht.
- Rückerstattung nach Teilzahlung (negativer Saldo, «Remboursement restant») und berichtigte Abrechnung (`paidSoFarOwnLine`, `replacesPayOpen`): kein solcher Datensatz in der Persona-Datenbank für diese Prüfung benannt; nicht geprüft.
- Offener Betrag, der nach der Teilzahlung keine 5-Rappen-Zahl ist (z. B. Teilzahlung 40.03): nur aus dem Code gelesen (`openOf` rundet auf Rappen, nicht auf 5 Rappen), nicht an einem Datensatz geprüft.
