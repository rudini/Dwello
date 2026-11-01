# Datenprüfung #959 (Teilzahlungen), Runde 1

Worktree: /tmp/claude/review-959-daten (eb6ef7d), App: Persona-Stack (Backend :3301, Frontend :3300, DB `dwello_persona`). Es wurde nichts verändert (nur SELECT, GET über Backend und BFF mit einem selbst signierten Lese-JWT).

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| – | – | – | – | Keine Befunde: alle geprüften Beträge stimmen auf den Rappen. |

## Rechnung (unabhängig, Skript /tmp/claude/w959/recompute.py, liest nur die DB)

Abrechnung NK-11111111-2025-0001 (Hans Müller, Musterhaus Zentrum, Wohnung 1.01)
- Saldo-Probe: Teilsummen 281.67 + 564.14 + 588.67 + 116.94 + 143.34 + 165.00 + 1094.53 + 51.36 = 3005.65; Verwaltungspauschale 3 % = 90.1695 → 90.17; Nebenkosten 3095.82; Akonto 12 × 240.00 = 2880.00; vor Rundung 215.82; auf 5 Rappen 215.80. DB `balance` = 215.80 (Detailseite und PDF ebenso).
- DB: `payments` = [{"date":"2026-10-31","amount":"50.00"}], `paid_amount` = 50.00 (= Summe der Liste), Status `sent`, `paid_date` und `payment_recorded_at` leer (Teilzahlung, nicht bezahlt), `payment_deadline` 28.10.2026 < heute 31.10.2026, also Überfällig.
- Offener Betrag = 215.80 − 50.00 = **165.80**.

Mahnbrief (documents 217c79f5-…, Typ reminder, Stufe 1, Kanal Brief, Status sent, PDF aus `documents.content` extrahiert, Erstelldatum im PDF = `sent_at` 22:15:20, also beim Markieren neu erstellt)
- «Betrag der Abrechnung: CHF 215.80», «Bereits bezahlt: CHF 50.00», «Offener Betrag: CHF 165.80»: alle drei richtig.
- Zahlungsfrist 10.11.2026 = Briefdatum 31.10.2026 + 10 Tage; `documents.payment_deadline` ebenso. Nächste Mahnung «ab 11.11.2026» auf der Detailseite und in der Liste = Frist + 1 Tag.
- Empfangsschein und Zahlteil im PDF: je «CHF 165.80».

QR-Rechnung des Mahnbriefs (pdftoppm -r 300, Seite 2; Decoder zxing-cpp in /tmp/claude/w959/venv)
- Payload: SPC / 0200 / 1; IBAN CH4431999123000889012 (Prüfsumme mod 97 = 1; IID 31999 liegt im QR-IBAN-Bereich 30000–31999, passend zu Referenztyp QRR); Zahlungsempfänger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH (= `configuration`); **Betrag 165.80 CHF**; Zahlungspflichtiger Hans Müller, Bahnhofstrasse 42, 8001 Zürich, CH (= Gebäudeadresse); Referenz QRR `004808373587120631831414928` (27 Stellen, Modulo-10-rekursiv, Prüfziffer 8 stimmt; gleich `utility_statements.qr_bill_reference`); Mitteilung «Nebenkostenabrechnung NK-11111111-2025-0001»; Trailer EPD.
- Gedruckte Felder (Zahlteil und Empfangsschein) stimmen mit dem Payload überein (IBAN, Referenz in 5er-Gruppen, Zahlbar durch, Betrag).

Übersicht (`GET /api/v1/dashboard` mit Lese-JWT, gegen Rechnung aus der DB)
- Offene/überfällige Abrechnungen mit positivem Saldo in der Persona-Datenbank: nur NK-11111111-2025-0001 (alle anderen Entwurf oder Bezahlt). `open` = Status `sent` (schliesst Überfällige ein), also `totalPending` = 165.80, `overdueAmount` = 165.80, `outstandingStatements` = 1, `paidThisMonth` = 0 (keine Zahlung dieses Monats mit Status Bezahlt). API liefert genau diese Werte. Vor der Änderung wären es 215.80 gewesen.
- Weboberfläche: Dashboard «Überfällige Beträge CHF 165.80», «1 Überfällig», Frist «28.10.2026 Zahlungsfrist · Hans Müller seit 3 Tagen abgelaufen»; Liste und Detailseite «Bezahlt: CHF 50.00, offen: CHF 165.80», Saldo «Nachzahlung CHF 215.80» unverändert, Badge Überfällig, «Gemahnt am 31.10.2026».
- PDF der Abrechnung (unverändert wie entschieden): Nachzahlung CHF 215.80, QR-Betrag 215.80, gleiche Referenz und IBAN. Das ist die bekannte Folgearbeit #1003, kein Befund.

Geprüft: NK-11111111-2025-0001 (Saldo, Teilzahlung, Offener Betrag, Liste, Detailseite, Statement-PDF samt QR), Mahnbrief 217c79f5-2b3c-461a-b4b3-a99f82f71ba4 (drei Beträge, Frist, QR-Rechnung samt Prüfziffer), Übersichtssummen (totalPending, overdueAmount, outstandingStatements, paidThisMonth) gegen alle 17 Abrechnungen der Persona-Datenbank.

## Nicht bestätigt

- **Mahnbrief in fr/it/en:** Die Persona-Datenbank hat nur einen Mahnbrief (Mieter Hans Müller, Sprache de). Briefe in anderen Sprachen brauchen eine neue Mahnung, das hiesse Datensätze ändern (verboten), und die Vorschau gibt es nicht als Endpunkt. Geprüft nur im Diff (`backend/src/services/reminder-letter.ts`): die Bezeichnungen «Montant du décompte / Déjà payé / Montant dû», «Importo del conteggio / Già pagato / Importo dovuto», «Statement amount / Already paid / Amount outstanding» sind vorhanden; die Beträge rechnet dieselbe Formel (`CHF` mit zwei Dezimalstellen, sprachunabhängig), also kein anderer Betrag zu erwarten. Der QR-Betrag ist sprachunabhängig (`open` in `reminder.service.ts`).
- **Teilzahlung auf Rückerstattung, mehrere Teilzahlungen, Zahlung zurücksetzen, Berichtigung mit Eingabe von «Bereits bezahlt»:** Kein solcher Datensatz in der Persona-Datenbank, und ich darf keinen anlegen. Nur Code gelesen (`recordPayment`, `paidAmountOf`, `resetPayment`, Dashboard-SQL): Vorzeichen, Rundung auf Rappen und Summe stimmen in der Lektüre. Beobachtung ohne sichtbare Wirkung: `replaceStatement(id, paidAmount)` (statement.service.ts, Zeile ~876) setzt `paid_amount` auf den eingegebenen Betrag, lässt `payments` aber unverändert; bei einer ersetzten Abrechnung mit Teilzahlung kann also die Summe von `payments` vom `paid_amount` abweichen. `payments` wird nur in `recordPayment` und `resetPayment` gelesen, beides auf einer ersetzten Abrechnung nicht möglich, deshalb kein Befund. Nicht live bestätigt.
- **Seitenumbruch:** Der Zahlteil steht im Mahnbrief auf Seite 2 (Seite 1 ist der Brief); keine Beträge betroffen, nicht beurteilt.
