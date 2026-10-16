# Datenprüfung Zahlungserinnerung NK-11111111-2025-0001 (Hans Müller), Commit c450b43

Stand: 16.10.2026, DB dwello_persona. Eigenes Skript/SQL, keine Dwello-Rechenlogik verwendet.

## Findings

| ID | Schwere | Record | Erwartet | Tatsächlich |
|----|---------|--------|----------|-------------|
| D-1 | Nit | PDF-Abgleich | (nur Hinweis) Gleicher Tag: Erstellung und Markierung als versendet liegen am selben Datum, daher lässt sich nicht unterscheiden, ob das PDF beim Markieren neu erstellt wurde | `created_at` 19:30:26, `sent_at` 19:30:48, beide 16.10.2026 |

Keine Blocker/Major/Minor.

## Geprüft und bestanden

Dokument 8ee9f629-468b-4420-ae84-de42fa151379 (einziges reminder-Dokument der Abrechnung 6a5ec350-...):
- `documents.payment_deadline` = 2026-10-26; im PDF gedruckt: "bis 26.10.2026"; Briefdatum im PDF "Zürich, 16.10.2026"; 16.10.2026 + 10 Tage = 26.10.2026. OK.
- Briefdatum = Tag des Markierens: `sent_at` 2026-10-16 19:30:48 (UTC; in Zürich 21:30, gleicher Tag). OK.
- `channel` = 'letter', `status` = 'sent', `reminder_level` = 1, `delivery_error` leer. OK.
- `utility_statements.reminder_sent_date` = 2026-10-16 = Briefdatum. OK.
- Offener Betrag im PDF CHF 215.80. Saldo gespeichert 215.80; Gegenrechnung total_costs 3095.82 - Akonto 2880.00 = 215.82, auf 5 Rappen = 215.80. OK. (Die Kosten selbst aus den Rechnungen neu zu berechnen war nicht Auftrag; der Betrag der Mahnung stimmt mit dem Saldo überein.)
- IBAN im PDF CH4431999123000889012 = `configuration.iban`. IID 31999 liegt im QR-IID-Bereich (30000-31999), also QR-IBAN, daher ist die QR-Referenz zulässig.
- QR-Referenz im PDF "00 50231 89148 91263 73908 20545" = 005023189148912637390820545 = `qr_bill_reference`; 27 Stellen, Prüfziffer Modulo 10 rekursiv: berechnet 5, gedruckt 5. OK.
- nextReminderFrom: Regel im Code (`statement.service.ts`: max(payment_deadline)+1, nur bei count<3 und status 'sent') mit eigener SQL nachgerechnet: count=1, max(payment_deadline)+1 = 2026-10-27 = 26.10.2026 + 1 Tag. OK (rechnerisch).

Reproduktion: `psql postgresql://dwello:dwello@localhost:5432/dwello_persona`, Select auf `documents` (type='reminder') und `utility_statements`; PDF: `psql -At -c "select content ..." | base64 -d > rem.pdf; pdftotext -layout rem.pdf -`.

## Nicht bestätigt

- GET /api/v1/statements/<id> `nextReminderFrom`: Backend antwortet ohne JWT mit 401; Wert nur über die SQL der Code-Regel nachgerechnet (2026-10-27), nicht über die API.
- Dass das PDF beim Markieren mit Tagesdatum/Frist neu erstellt wurde (und nicht beim Erstellen): am selben Tag nicht unterscheidbar (D-1). Ein Test über mehrere Tage (Erstellen, später markieren) wurde nicht gemacht, da keine Daten geändert werden dürfen.
- Kein QR-Rechnungs-Teil im Mahnbrief (nur IBAN und Referenz als Text), daher keine QR-Dekodierung nötig.
- Anzeige im Web und andere Sprachen (fr/it/en) des Mahnbriefs: nur das gespeicherte deutsche PDF geprüft.
- Kosten/Verteilschlüssel aus Rechnungen nicht neu berechnet (nur Saldo-Rundung und Übereinstimmung mit dem PDF).
