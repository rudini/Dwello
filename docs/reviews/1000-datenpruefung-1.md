# Datenprüfung #1000, Runde 1 (Commit 449b572, Worktree review-1000-dp)

Ergebnis: keine Befunde. Alle geprüften Mahnungen stimmen auf den Rappen mit der Neuberechnung aus der Datenbank überein.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | – | – | keine |

## Geprüft

Geprüft: P_de (NK-11111111-2025-0001), P_fr (NK-11111111-2025-0003), P_it (NK-11111111-2025-0004), P_en (NK-22222222-2025-0004) je mit Teilzahlung und den Mahnstufen 1 bis 3; Kontrollen C_de, C_fr, C_it, C_en (Klone ohne Teilzahlung, Stufen 1 bis 3); E1 (zwei Teilzahlungen, Neuerstellung beim Markieren als versendet, Zahlung zurücksetzen); je PDF beim Erstellen und nach «versendet» (insgesamt 48 + 5 PDFs, 900 Einzelprüfungen, 0 Abweichungen).

Pro PDF geprüft:
- Einleitungssatz je Stufe und Mieter-Sprache (de, fr, it, en): bei Teilzahlung und Stufe 2/3 der Text M-1 aus `docs/reviews/959-fachreview-1.md` (Zeilen 113-114), sonst der unveränderte Text der Basis (90e0e7b); der jeweils andere Text fehlt.
- Titel, Anrede, Betrag der Abrechnung (= `balance`), Bereits bezahlt (= Summe der `payments` aus der DB, nicht die Spalte `paid_amount`), Offener Betrag (= Differenz). Ohne Teilzahlung nur «Offener Betrag», keine Zeilen «Betrag der Abrechnung»/«Bereits bezahlt».
- Französisch: geschütztes Leerzeichen vor dem Doppelpunkt vorhanden (pdfplumber-Zeichen `\xa0`; `pdftotext` gibt es als normales Leerzeichen aus).
- QR-Rechnung (Seite mit `pdftoppm -png -r 300` gerendert, mit zxing-cpp dekodiert): Kopf `SPC/0200/1`, IBAN CH4431999123000889012 (= Einstellung `iban`), Zahlbar an (Firmenadresse aus `configuration`), Betrag = Offener Betrag auf den Rappen (115.45, 100.25, 138.10, 55.65 bei Teilzahlung; unveränderter Saldo bei den Kontrollen), CHF, Zahlbar durch (Name, Adresse, PLZ, Ort, CH des Mieters), Referenztyp QRR, 27 Ziffern mit korrekter Prüfziffer (Modulo 10 rekursiv), Referenz in allen 6 PDFs einer Abrechnung gleich und gleich wie im Zahlteil der Abrechnungs-PDF (für die Originale P_*), Mitteilung «<Titel der Abrechnung> <Nummer>», `EPD`. Alle 53 QR-Rechnungen waren dekodierbar.
- Empfindlichkeit des Prüfskripts: mit absichtlich falschen Erwartungen (alter Satz, Betrag +0.05) schlug es mit 76 Abweichungen an.
- Neuerstellung beim Markieren als versendet: der Brief übernimmt den Stand der Zahlungen zu diesem Zeitpunkt (E1: Stufe 1 erstellt ohne Teilzahlung, versendet nach zwei Teilzahlungen mit 3 Zeilen und QR 135.65 und unverändertem Einleitungssatz von Stufe 1; Stufe 2 erstellt mit 80.15 bezahlt, nach «Zahlung zurücksetzen» (letzte Zahlung) versendet mit 50.00 bezahlt, QR 165.80; nach dem zweiten Zurücksetzen Stufe 3 ohne Teilzahlung mit dem Standardsatz «… noch immer nicht bezahlt», QR 215.80).

## Verwendete Datensätze und Abfragen

Die Demo-Datenbank `dwello_persona` (:3301/:3300) habe ich nicht verändert. Sie hat nur eine versendete Abrechnung (NK-11111111-2025-0001, Saldo 215.80, keine Teilzahlung, keine Mahnung) und kein Datum, an dem Stufe 2 oder 3 möglich wäre: Stufe 2 geht erst nach der Zahlungsfrist der Stufe 1 (+10 Tage). Darum habe ich einen Abzug der Datenbank gemacht und darauf ein eigenes Backend aus dem Worktree (Commit 449b572) auf Port 3391 gestartet (inzwischen gestoppt).

```
pg_dump dwello_persona | psql dwello_review1000      # Kopie, nur für diese Prüfung
-- in der Kopie: Zustellung 'letter', Marco Bernasconi Sprache 'en', 4 Klone (Endung -C) und 2 Klone (-E1, -E2),
-- alle Status 'sent', payment_deadline 2026-09-01 (überfällig)
update documents set payment_deadline='2026-10-01' where id=<Mahnung>   -- nur in der Kopie, damit die nächste Stufe möglich wird
```

API-Aufrufe (Backend 3391, JWT wie `persona-kit.mjs`):
- `PUT /api/v1/statements/:id/status {"status":"paid","paidDate":"2026-10-20","paidAmount":"100.35"}` (P_de), 42.10 (P_fr), 100.00 (P_it), 20.15 (P_en); E1: 50.00 und 30.15
- `POST /api/v1/statements/:id/reminders` (Stufe 1, 2, 3), `GET /api/v1/documents/:id/pdf`, `PUT /api/v1/documents/:id/sent`, `GET /api/v1/documents/:id/pdf`
- `POST /api/v1/statements/:id/payment-reset`
- `GET /api/v1/statements/:id/pdf` (Referenz der Abrechnung)

Neu erzeugen: Skripte `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/w1000/run.sh` (Ablauf), `.../w1000/check.py` (Neuberechnung und QR-Prüfung: `./venv/bin/python check.py postgresql://dwello:dwello@localhost:5432/dwello_review1000`), `.../w1000/qr1.py`. PDFs liegen in `.../w1000/pdf/`. Die Kopie `dwello_review1000` habe ich stehen lassen.

Beispiel (P_de, Stufe 2, versendet): «Trotz unserer Zahlungserinnerung ist die Nebenkostenabrechnung NK-11111111-2025-0001 für die Periode 01.01.2025 – 31.12.2025 noch nicht vollständig bezahlt.» / Betrag der Abrechnung: CHF 215.80 / Bereits bezahlt: CHF 100.35 / Offener Betrag: CHF 115.45 / QR-Betrag 115.45.

## Nicht bestätigt

- Die laufende Demo-Datenbank (:3301) selbst: dort habe ich nur gelesen (eine versendete Abrechnung ohne Mahnung, Saldo 215.80, unverändert). Stufe 2/3 mit Teilzahlung habe ich bewusst in der Kopie auf einem zweiten Backend desselben Commits geprüft, weil die Mahnfrist ohne Datumsänderung in `dwello_persona` nicht erreichbar ist. Dass das laufende Backend auf :3301 wirklich Commit 449b572 ausführt, habe ich nicht unabhängig geprüft (Angabe des Auftraggebers).
- Die Weboberfläche: sie zeigt den Einleitungssatz der Mahnung nirgends (Suche in `messages/de.json` und `src` ohne Treffer); der Satz steht nur im PDF und in der E-Mail. Der E-Mail-Weg (Mieter mit Kanal «email») wurde nicht geprüft: In der Kopie habe ich alle Mieter auf «letter» gestellt, damit der gemeinsame Mail-Catcher nichts erhält. Der E-Mail-Text (`letter.text`) verwendet dieselben Absätze wie das PDF.
- Der Saldo der Abrechnung selbst (Summe der Positionen, Rundung auf 5 Rappen) wurde nicht neu berechnet; Gegenstand dieser Prüfung ist der Wert `balance` aus der DB als Betrag der Abrechnung. Die Klone haben dieselben Positionen wie ihre Originale.
- Wortlaut-Unterschied in der Spezifikation (kein Befund, nur zur Kenntnis): Französisch Stufe 2 ohne Teilzahlung sagt «rappel de paiement», mit Teilzahlung «rappel»; Italienisch ebenso «promemoria di pagamento» gegenüber «promemoria». Der Code folgt dem Text M-1.
