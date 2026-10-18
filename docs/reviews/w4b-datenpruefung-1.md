# Datenprüfung W4b (#93, #92, #138), Commit cdfdc23

Prüfer: daten-pruefer. Datenbank `dwello_persona`, Backend :3301, Frontend :3300. Geändert wurden nur Datensätze im Gebäude «Seepark Residenz» (Meier, Weber, Bernasconi). Skripte und Ausgaben liegen in `/tmp/claude-0/-home-user-Dwello/3a249483-dd2a-5ba2-b226-2da9cde281a8/scratchpad/w4b/` (`recompute.py`, `qrcheck.py`, `chk.py`, `tok.py`, PDFs in `pre/`, `post/`, `paid/`).

## Ergebnis

Kein Blocker, kein Major. Zwei Nit-Beobachtungen, beide ohne Auswirkung auf Beträge.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Nit | `payment-reset`, Verwerfen des PDF (Demo-Daten Meier, Weber, Bernasconi) | Nur ein PDF, das als bezahlt erstellt wurde, wird verworfen | Die Regel «PDF-Tag >= Zahlungsdatum» verwirft auch ein PDF, das als `sent` erstellt wurde, sobald es am selben Tag oder später als das Zahlungsdatum entstand (Demo: Zahlungsdatum rückdatiert auf 05.05.2025, PDF vom 16.10.2026). Es wird danach identisch als `sent` neu erstellt (gleiche Referenz, Datum, Frist), also nur unnötige Neuerstellung. |
| D-2 | Nit | Gespeichertes PDF bei Wechsel `sent` -> `paid` | Informativ | Ein beim Versand erstelltes PDF bleibt beim Bezahlen unverändert (zeigt «Bitte bezahlen Sie …» mit Zahlteil), bis «PDF erstellen» neu ausgelöst wird. Das entspricht der Beschreibung (nur ein bei `paid` erstelltes PDF zeigt «Bezahlt am …»). Kein Fehler, nur für die Persona zu wissen. |

## Belege

### Alle bezahlten Demo-Abrechnungen (#93)
`python3 -I recompute.py 2026-10` liest Abrechnungen und Positionen aus der Datenbank und rechnet unabhängig: Gesamtkosten = Summe `tenant_share` + Verwaltungspauschale; Saldo = (Gesamtkosten - Akonto) auf 5 Rappen gerundet (kaufmännisch); bei `paid`: `paid_amount = balance`.

Ergebnis vor und nach meinen Änderungen: `DIFFS 0` bei allen 17 Abrechnungen. Die 9 bezahlten:

| Mieter | Saldo | paid_amount |
|--------|-------|-------------|
| Müller | 72.60 | 72.60 |
| Schmidt | -171.65 | -171.65 |
| Dubois | -13.50 | -13.50 |
| Rossi | 35.70 | 35.70 |
| Weber | -70.25 | -70.25 |
| Meier | 121.05 | 121.05 |
| Bernasconi | 41.55 | 41.55 |
| Keller | -32.35 | -32.35 |
| Fischer | 59.30 | 59.30 |

Meier von Hand: 2761.07 - 2640.00 = 121.07, gerundet 121.05; Rundungszeile -0.02 stimmt mit der Webseite überein. Weber: 2329.76 - 2400.00 = -70.24, ausgewiesen -70.25; die PDF-Zeile «Rückerstattung vor Rundung 70.24» stimmt.

Dashboard `financial.paidThisMonth`: alle Demo-Zahlungen haben `paid_date` 2025-05-05, also im aktuellen Monat (Oktober 2026) 0. Unabhängige Summe 0, API 0. Mit Meier bezahlt am 2026-10-16: unabhängig 121.05, API 121.05. Weber (Rückerstattung -70.25) am selben Monat bezahlt: Summe blieb 121.05, die Rückerstattung ist ausgeschlossen. Nach Wiederherstellung wieder 0.

### Zurücksetzen (#92), Meier (Nachzahlung) und Weber (Rückerstattung)
`POST /api/v1/statements/:id/payment-reset`:

- Antwort und Datenbank: `status` `sent` (API meldet `overdue`, Frist 14.05.2025 vorbei), `paid_date` und `paid_amount` NULL.
- `payment_resets` = `[{"resetOn":"2026-10-16","paidDate":"2025-05-05","paidAmount":"121.05"}]` (Weber `-70.25`).
- `pdf_blob` und `pdf_generated_at` NULL (PDF-Tag 16.10.2026 >= Zahlungsdatum).
- Dashboard vorher: `totalPending 215.8`, `overdueAmount 0`, `outstandingStatements 1`, paid 9, overdue 0.
- Dashboard nachher: `totalPending 336.85` (= 215.80 + 121.05, die Rückerstattung zählt nicht), `overdueAmount 121.05`, `outstandingStatements 3`, paid 7, overdue 2. Alles stimmt mit der unabhängigen Rechnung überein.
- Zweiter Reset auf `sent`: 400 `STATEMENT_NOT_PAID`. Unbekannte ID: 404 `STATEMENT_NOT_FOUND`.
- Webseite `/statements/<Meier>`: «Status: Überfällig», «Saldo: Nachzahlung CHF 121.05», Verlauf «Zahlung vom 05.05.2025 zurückgesetzt 16.10.2026», Zahlungsfrist 14.05.2025, Abrechnungsdatum 14.04.2025.
- PDF danach (Meier, `post/meier.pdf`): «Bezahlt» fehlt, Abrechnungsdatum 14.04.2025, «bis 14.05.2025 mit dem Zahlteil», 2 Seiten mit Zahlteil. Weber (`post/weber.pdf`): «Rückerstattung CHF 70.25», kein «Überwiesen am», «bis 14.05.2025», kein Zahlteil (richtig bei Rückerstattung).
- Bei Meier und Weber wurde ein bei `paid` erstelltes PDF zuerst erzeugt (`Bezahlt am 16.10.2026. Vielen Dank.`, ohne Zahlteil, 1 Seite; Weber `Überwiesen am 14.04.2025.`), dann zurückgesetzt, verworfen und als `sent` neu erstellt (Zahlteil bei Meier wieder da).

### QR-Rechnungen (decodiert mit zxing-cpp, 200 dpi)

| Abrechnung | IBAN | Betrag | Referenz | Mitteilung | Schuldner |
|------------|------|--------|----------|------------|-----------|
| Meier (de) | CH4431999123000889012 | 121.05 CHF | 004917780928888407614240765 | Nebenkostenabrechnung NK-22222222-2024-0002 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern |
| Bernasconi (it) | CH4431999123000889012 | 41.55 CHF | 009679085197479753196289347 | Conteggio spese accessorie NK-22222222-2024-0003 | Marco Bernasconi, Seeweg 15, 6003 Luzern |

Zahlungsempfänger beide Male Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich (stimmt mit `configuration`). Referenztyp QRR, 27 Stellen, Prüfziffer (Modulo 10 rekursiv) gültig. IBAN-Prüfsumme (mod 97) gültig, QR-IID 31999. Betrag = Saldo, Referenz identisch mit `qr_bill_reference` vor dem Reset. Weber hat als Rückerstattung keine QR-Rechnung.

### Wieder bezahlen und Datum (#138)
`PUT /:id/status` mit `status: paid`, ohne Betrag:

- `2025-04-13` (vor Abrechnungsdatum 2025-04-14): 400 `PAID_DATE_BEFORE_STATEMENT`.
- `2026-10-17` (morgen): 400 `PAID_DATE_IN_FUTURE`.
- `2025-02-30`, `2025-1-1`, `abc`, `2026-10-16T10:00`: 400 `PAID_DATE_INVALID`.
- Datenbank blieb nach allen Ablehnungen `sent`, unverändert.
- Grenzen: `2026-10-16` (heute, Meier) und `2025-04-14` (Abrechnungsdatum, Weber) werden angenommen. `paid_amount` = 121.05 beziehungsweise -70.25 (= Saldo).
- Anschliessend alle drei Abrechnungen mit `2025-05-05` wieder bezahlt: Ausgangszustand wiederhergestellt, `paid_amount` = Saldo, `payment_resets` jetzt 2 Einträge (Meier, Weber) und 1 (Bernasconi); Dashboard wieder wie vor der Prüfung.

### PDF-Sprachen (bezahlt, Meier und Weber)
- Meier: de «Bezahlt am 05.05.2025. Vielen Dank.», fr «Payé le … Merci.», it «Pagato il … Grazie.», en «Paid on … Thank you.»; alle 1 Seite, ohne Zahlteil.
- Weber (Rückerstattung): de «Überwiesen am», fr «Viré le», it «Bonificato il», en «Transferred on».
- Bernasconi (it) bezahlt: «Pagato il 05.05.2025. Grazie.», 1 Seite. Nach dem Reset: italienisches PDF mit Zahlteil, «entro il 14.05.2025».

## Geprüft und bestanden
- 9 bezahlte Demo-Abrechnungen 2024: Saldo und `paid_amount` (alle 17 Abrechnungen: Gesamtkosten, Saldo, Rundung auf 5 Rappen)
- Dashboard `paidThisMonth`, `totalPending`, `overdueAmount`, `outstandingStatements` vor und nach Reset und Zahlung
- Reset Meier, Weber, Bernasconi: Felder, `payment_resets`, Verlauf, Statusanzeige, Fehlercodes
- QR-Rechnungen Meier (de) und Bernasconi (it) nach dem Reset
- PDF nach dem Reset in de und it, ohne «Bezahlt»
- Zahlungsdatum: alle Ablehnungen und beide Grenzen
- Zahlungsmeldungen im PDF in de, fr, it, en (Nachzahlung und Rückerstattung)

## Nicht bestätigt
- Automatisches `paid` bei Saldo 0.00 beim Versand: im Demo-Gebäude gibt es keinen Saldo 0.00; nicht erzeugbar, ohne Daten zu verfälschen.
- Explizit mitgegebener `paidAmount` (nicht überschrieben): nicht getestet, um keine falschen Beträge in die Daten zu schreiben.
- Gebäude «Parkview» und «Bahnhof» (3333, 1111): Datensätze dort wurden nicht verändert; ihr Saldo wurde nur gegen die Positionen gerechnet, nicht gegen Rechnungen, Verteilschlüssel und Akonto neu hergeleitet.
- Rechnungs-, Schlüssel- und Heizkostenherleitung der Gesamtkosten (Eingaben aus `invoices`, `distribution_keys`, Heizprofile): diese Prüfung gilt der Zahlungsänderung, nicht der Kostenberechnung. Die Summe der Positionen und die Verwaltungspauschale (Meier 3 % von 2680.65 = 80.42) habe ich geprüft.
- Weber/Fr: nur die Zahlungsmeldung geprüft, kein vollständiger fr/en-Abgleich des PDF.
- Webseite nur für Meier (de) gelesen, nicht in fr/it/en.
- Playwright-Rendering nicht ausgeführt; die Seite wurde per HTTP mit Sitzungs-Cookie abgerufen und der Text extrahiert.
