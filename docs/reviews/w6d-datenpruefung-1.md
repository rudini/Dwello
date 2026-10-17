# Datenprüfung #94 (Saldo unter CHF 5), Commit 4e7bad1

Datenbank `dwello_persona`, Stand 17.10.2026. Nur lesend geprüft. Skripte im Scratchpad:
`/tmp/claude-0/-home-user-Dwello/2c72529f-9bca-535a-94c9-4a75e2c3ffa5/scratchpad/rc.py` (Neuberechnung aller 17 Abrechnungen aus Positionen, Pauschale, Akonto, Rundung, Referenz-Prüfziffer),
`.../dec.py` (QR-Decoder, OpenCV in `.../qrenv`), PDFs und PNGs in `.../pdfs/`.

## Ergebnisse

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Major | NK-22222222-2025-0001 (Weber, Saldo 3.40), nach «Zahlung zurücksetzen» wieder bezahlt | Eine Abrechnung unter CHF 5 hat `paid_amount` 0.00 (Regel #94, `docs/nebenkostenabrechnung-anforderungen.md` Thema 6, Punkt 11); «bezahlt diesen Monat» zählt nur eingegangene Forderungen | `paid_amount` = 3.40. Dashboard `paidThisMonth` = CHF 3.40, obwohl der Betrag nicht eingefordert wird und das PDF «Wir verzichten darauf» sagt |
| D-2 | Minor | Dashboard-Summen `totalPending`/`overdueAmount` nach einem Reset einer verzichteten Abrechnung (Code, nicht an Daten reproduziert) | Ein Betrag unter CHF 5 zählt nirgends als offen oder überfällig | `backend/src/routes/dashboard.ts`: `owed()` prüft nur `balance > 0`, ohne Schwelle. Nach «Zahlung zurücksetzen» ist die Abrechnung `sent` mit Saldo < 5 und fliesst in «offen»/«überfällig» ein. Gleiches gilt für vor #94 versendete Abrechnungen < 5 |
| D-3 | Nit | NK-11111111-2025-0003 (Dubois), NK-22222222-2025-0002 (Meier), beide Entwurf | Saldo nach #79 nur zugunsten des Mieters gerundet: 142.35 und 137.95 | gespeichert 142.40 und 138.00 (kaufmännisch). Ursache: Backend der Persona-Umgebung vor #79 gestartet. Kein Fehler von #94, Umgebungsstand |
| D-4 | Nit | PDF NK-22222222-2025-0003 (Brunner) und Schmidt/Weber | Kopf der Abrechnung nennt, was geschieht | Kopfzeile bleibt «Rückerstattung CHF 2.90», darunter «Wir zahlen ihn nicht aus». Inhaltlich eindeutig, aber der grosse Betrag widerspricht dem Satz darunter. Fachfrage #352 |
| D-5 | Nit | alle drei Datensätze | `payment_deadline` nur dort, wo sie etwas bedeutet | `payment_deadline` = 2026-11-16 bleibt gesetzt, im PDF und im Zahlungsfeld der Web-Seite ausgeblendet. Nur im Datenbestand sichtbar |

### D-1 Beleg
```
select statement_number,status,balance,paid_date,paid_amount,payment_resets from utility_statements where id='1c638a15-00c1-479e-b49b-e74b9c4f94cf';
NK-22222222-2025-0001 | paid | 3.40 | 2026-10-17 | 3.40 | [{"resetOn":"2026-10-17","paidDate":"2026-10-17","paidAmount":"0.00"}]
```
Kontrollabfrage: von den Abrechnungen mit |Saldo| < 5 und Status paid hat genau eine `paid_amount <> 0` (Weber).
Ursache im Code: `StatusActions.svelte` zeigt «Als bezahlt markieren» für jede `sent`/`overdue`-Abrechnung, auch für eine verzichtete nach dem Reset. `updateStatementStatus` setzt dann `paidAmount ?? existing.balance` (statement.service.ts, Zeile 495), also 3.40. `resetPayment` setzt eine verzichtete Abrechnung auf `sent` zurück, statt sie als erledigt zu belassen.
Reproduktion: Abrechnung mit Saldo unter 5 versenden, «Zahlung zurücksetzen», «Als bezahlt markieren» mit Vorgabebetrag. Dann `paid_amount` ansehen und Dashboard-Kachel «bezahlt diesen Monat».
Vorschlag: Mark-paid und Reset bei Saldo < 5 anders behandeln (Betrag 0.00 oder Aktion ausblenden), `owed()` im Dashboard mit der Schwelle versehen.

## Geprüft und bestanden

Gespeicherte Werte der drei Datensätze (Neuberechnung aus `utility_statement_line_items`, Pauschale 3 %, Akonto, Rundung auf 5 Rappen zugunsten des Mieters):

| Abrechnung | Positionen | Pauschale | Nebenkosten | Akonto | Saldo vor Rundung | Rundung | Saldo | Status | paid_date | paid_amount |
|---|---|---|---|---|---|---|---|---|---|---|
| NK-22222222-2025-0001 Weber | 2296.54 | 68.90 | 2365.44 | 2362.00 | 3.44 | -0.04 | 3.40 | paid | 2026-10-17 | 3.40 (D-1) |
| NK-22222222-2025-0003 Brunner | 1306.92 | 39.21 | 1346.13 | 1349.00 | -2.87 | +0.03 | -2.90 | paid | 2026-10-17 (= Abrechnungsdatum) | 0.00 |
| NK-11111111-2025-0002 Schmidt | 3488.85 | 104.67 | 3593.52 | 3596.00 | -2.48 | +0.02 | -2.50 | paid | 2026-10-17 (= Abrechnungsdatum) | 0.00 |

- Gespeicherte PDFs (`pdf_blob`, Basis64, alle Sprache de): Der Text stimmt zeile für Zeile mit meiner Rechnung überein, auch die Zeilen «vor Rundung» und «Rundung auf 5 Rappen» (Weber -0.04, Brunner +0.03, Schmidt +0.02). Kopf-Text: Weber «Der Betrag ist kleiner als CHF 5.00. Wir verzichten darauf; Sie müssen nichts bezahlen.»; Brunner und Schmidt «… Wir zahlen ihn nicht aus.»
- Kein Zahlteil, kein Empfangsschein, keine IBAN-Bitte: `pdftotext` findet weder «IBAN», «Zahlteil», «Empfangsschein» noch «Konto / Zahlbar an». Alle Seiten bei 300 dpi gerendert und mit OpenCV nach einem QR-Code abgesucht: kein Code auf Weber (1 Seite), Brunner (2 Seiten, Seite 2 nur «Hinweise»), Schmidt (2 Seiten).
- Kontrolle des Decoders: Müller 2025 (NK-11111111-2025-0001, Status sent, nicht betroffen) hat einen QR-Code, der decodiert. IBAN CH4431999123000889012 (QR-IBAN, IID 31999), Betrag 215.80 CHF (= gespeicherter Saldo), Referenz QRR 001661796988753212653915045 (Prüfziffer 5 stimmt, Modulo 10 rekursiv), Mitteilung «Nebenkostenabrechnung NK-11111111-2025-0001», Zahlbar durch Hans Müller, Bahnhofstrasse 42, 8001 Zürich.
- Alle 17 Abrechnungen: Summe der Positionen + Pauschale = `total_costs` (17 von 17); Referenz-Prüfziffer aller `qr_bill_reference` stimmt (17 von 17); Saldo = Rundung nach #79 bei 12 von 17. Die 5 Abweichungen sind: vier vor #79 versendete 2024-Abrechnungen (Müller 72.60, Schmidt -171.65, Rossi 35.70, Weber 2024 -70.25 liegen im Bestand; sie behalten laut Spezifikation den kaufmännisch gerundeten Saldo) sowie die zwei Entwürfe aus D-3. Keine Abweichung betrifft #94.
- Dashboard (eigene SQL-Neuberechnung nach den Regeln; die API verlangt ein Token und war nicht lesbar, siehe unten): Entwurf 4, versendet 1, überfällig 0, bezahlt 12, offen (Nachzahlungen, Status sent) 215.80 (nur Müller 2025), «bezahlt diesen Monat» 3.40 (nur Weber, siehe D-1). Brunner und Schmidt (Rückerstattungen, paid_amount 0.00) fliessen in keine Summe ein. Alle anderen bezahlten Abrechnungen mit |Saldo| ≥ 5 haben `paid_amount` = Saldo (0 Abweichungen).
- Status-Übergänge der übrigen Abrechnungen unverändert: Müller 2025 `sent` mit Frist 2026-10-28, vier Entwürfe, 9 bezahlte Abrechnungen 2024 mit `paid_date` 2025-05-05.
- Schwellenlogik im Code (gelesen, nicht importiert): `belowMinimum = |gespeicherter Saldo| < 5` in `pdf-format.ts`, `statement.service.ts`, `reminder.service.ts`, Frontend `statement.ts`; Saldo 5.00 wird eingefordert, 4.95 nicht. Mahnung bei Saldo < 5 mit `REMINDER_BELOW_MINIMUM` verweigert.
- FR/IT/EN-Texte `waivedDue`/`waivedRefund` im Quelltext gelesen (Diff), sinngemäss gleich, mit CHF 5.00 und Beträgen ohne Abweichung.

## Nicht bestätigt

- Web-Seite und Dashboard über die API (:3301, :3300): Die Abfrage braucht ein JWT; ein eigenes Token aus dem Geheimnis zu bilden hat der Berechtigungsfilter abgelehnt. Die Dashboard-Zahlen sind deshalb nur durch eigene SQL-Abfrage nach dem Code-Verhalten bestätigt, nicht an der laufenden Oberfläche.
- PDFs in fr/it/en: Alle drei betroffenen Mieter haben Sprache de, und die PDFs ohne Anmeldung nicht erzeugbar. Nur die Quelltexte sind gelesen. Layout (Umbruch, Länge) in den drei Sprachen ungeprüft.
- Mahnung per API (Verweigerung bei Saldo < 5, auch nach Reset): nur im Code gelesen und durch die mitgelieferten Tests abgedeckt, nicht gegen die laufende Umgebung ausgeführt (Status paid ist sowieso `REMINDER_NOT_OVERDUE`; der Fall nach Reset ist D-2/D-1).
- Grenzfall Saldo genau 5.00 / 4.95 / -5.00 an echten Datensätzen: kein Datensatz im Bestand, nur aus dem Code abgeleitet.
- QR-Rechnung mit Betrag < 5 wird nirgends erzeugt, daher keine QR-Rechnung der drei Datensätze zu decodieren; als Kontrolle nur die von Müller 2025 geprüft.
