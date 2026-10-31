# Datenprüfung 534/968, Runde 1

Worktree: /tmp/claude/review-534-daten (2b9d542). Laufende App: Backend aus b2c4759, Datenbank `dwello_persona`. Es wurde kein Datensatz verändert (nur SELECT, GET-Aufrufe, PDF-Dateien aus der Datenbank dekodiert). Skripte und Zwischenergebnisse: /tmp/claude/534dp (`work/recompute.py`, `work/decode.py`, `work/chk.py`).

## Ergebnis

Keine Findings. Beide Abrechnungen und alle vier Dokument-PDFs stimmen auf den Rappen mit meiner unabhängigen Berechnung überein.

| ID | Schwere | Record | Erwartet | Tatsächlich |
|----|---------|--------|----------|-------------|
| (keine) | - | - | - | - |

Geprüft: NK-11111111-2025-0003 (Abrechnung, Dokumente 6491234f E-Mail und 9d3efa32 Brief, Webseite fr, PDF fr, QR-Rechnung beider PDFs); NK-11111111-2025-0004 (Abrechnung, Dokumente 64ef14f8 Brief und 71d09efb new_pdf, Webseite, PDF it, QR-Rechnung beider PDFs).

## Vorgehen und Belege

### 1. Neuberechnung aus den Eingaben
`work/recompute.py` liest Rechnungen (2025, gültig), Verteilschlüssel (Fläche 85 bzw. 120 von 492.50 m², Einheiten 1/6, Heizung 70 % Fläche / 30 % Einheit), Tankbestand (2650.00 am 31.12.2024, 2257.20 am 31.12.2025, Heizungsrechnung 6565.00, Verbrauch 6957.80), Akonto (12 x 270.00 bzw. 12 x 350.00) und rechnet nach `docs/nebenkostenabrechnung-anforderungen.md` (Thema 8: Saldo nur zugunsten des Mieters auf 5 Rappen, Nachzahlung ab; Verwaltungspauschale 3 %).

| | -0003 (Dubois) | -0004 (Rossi) |
|---|---|---|
| Zwischensumme | 3283.86 | 4308.85 |
| Verwaltungspauschale 3 % | 98.52 | 129.27 |
| Ihre Nebenkosten | 3382.38 | 4438.12 |
| Akonto | 3240.00 | 4200.00 |
| Saldo vor Rundung | 142.38 | 238.12 |
| Saldo (ab auf 5 Rappen) | 142.35 | 238.10 |

Alle 16 Positionen (`utility_statement_line_items.tenant_share`) stimmen mit meiner Rechnung überein; ebenso `total_costs`, `management_fee`, `total_advance_payments`, `balance` in `utility_statements`, die API-Antwort `GET /api/v1/statements/:id` und die Webseite (`/statements/:id`: Nachzahlung vor Rundung CHF 142.38 / 238.12, Rundung − 0.03 / − 0.02, Saldo CHF 142.35 / 238.10).

### 2. Abrechnungsdatum und Zahlungsfrist
Konfiguration enthält keinen Wert `payment_deadline_days`, es gilt die Vorgabe 30 (`config.service.ts`). Heute 31.10.2026 plus 30 Tage = 30.11.2026.

```
select statement_number, statement_date, payment_deadline, status from utility_statements where statement_number in ('NK-11111111-2025-0003','NK-11111111-2025-0004');
-0003 | 2026-10-31 | 2026-11-30 | sent
-0004 | 2026-10-31 | 2026-11-30 | sent
```
Beide stimmen mit Regel und API/Webseite (Zahlungsfrist 30.11.2026, Abrechnungsdatum 31.10.2026) überein. Die PDFs drucken «Zürich, 31.10.2026», «Date du décompte 31.10.2026» / «Data del conteggio 31.10.2026» und «30.11.2026».

### 3. Dokumente und ihre PDFs
```
select id,type,channel,status,sent_at,payment_deadline,recipient from documents where statement_id in (...) order by statement_id, created_at;
6491234f  statement  email   sent  13:59:26  NULL        pierre.dubois@example.ch
9d3efa32  statement  letter  sent  13:59:51  2026-11-30
64ef14f8  statement  letter  sent  14:01:21  2026-11-30
71d09efb  new_pdf    letter  sent  14:02:07  2026-11-30
```
- `payment_deadline` der Briefdokumente = Zahlungsfrist der Abrechnung zum Versand (30.11.2026). Das E-Mail-Dokument hat bewusst keine (der Code speichert sie nur für Briefe).
- -0003: Dokument E-Mail und Dokument Brief drucken denselben Text (`diff` der `pdftotext -layout`-Ausgabe leer) und rendern auf allen 3 Seiten pixelgleich (nur das PDF-Erstellungsdatum der Datei unterscheidet sich). Das Brief-Dokument ist byte-gleich mit `utility_statements.pdf_blob` und mit dem Download `GET /statements/:id/pdf` (md5 d06929a2...). Sachlich richtig, weil beide Versände am selben Tag lagen.
- -0004: Das Dokument `new_pdf` ist byte-gleich mit `pdf_blob` und dem Download (md5 4497b5f1...). Gegen den Brief davor (64ef14f8): `pdftotext`-Diff ist genau eine Zeile (`Ratenzahlung bis Ende März vereinbart` unter «Osservazioni»); Seite 1 und 3 pixelgleich, Seite 2 weicht nur im Bereich der Bemerkung und darunter ab. Abrechnungsdatum, Zahlungsfrist, Beträge, Saldo unverändert (31.10.2026, 30.11.2026, 238.10).
- Alle vier PDFs: alle Beträge der Tabelle, Zwischensumme, Pauschale, Akonto-Zeile, Rundungszeile, Saldo und Heizkosten-Herleitung wie in Abschnitt 1 (fr für Dubois, it für Rossi).

### 4. QR-Rechnungen (je Seite 3 mit `pdftoppm -png -r 300` gerendert, Decoder zxing-cpp im Scratchpad-venv)
Alle vier dekodieren (SPC 0200). Inhalt identisch je Abrechnung:

| | -0003 (beide PDFs) | -0004 (beide PDFs) |
|---|---|---|
| IBAN | CH4431999123000889012 (QR-IBAN, IID 31999, mod 97 = 1) | gleich |
| Betrag / Währung | 142.35 CHF | 238.10 CHF |
| Referenztyp / Referenz | QRR 003911722398863693497333292 | QRR 007857596730709276992839781 |
| Prüfziffer (Modulo 10 rekursiv, Rechnung ausserhalb des Dwello-Codes, Gegenprobe mit dem SIX-Beispiel 2100…0901 → 7) | 2, stimmt | 1, stimmt |
| Referenz aus Abrechnungs-ID (erste 80 Bit als Dezimalzahl + Prüfziffer) neu berechnet | gleich, und gleich `qr_bill_reference` | gleich, und gleich `qr_bill_reference` |
| Mitteilung | Décompte des charges NK-11111111-2025-0003 | Conteggio spese accessorie NK-11111111-2025-0004 |
| Zahlungspflichtiger | Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich, CH | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich, CH |
| Zahlungsempfänger | Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH | gleich |

Der gedruckte Zahlteil (Referenz in 5er-Gruppen, IBAN, Betrag, Zahlungspflichtiger) stimmt mit dem QR-Inhalt überein, Empfangsschein und Zahlteil.

### 5. Webseite
Per Cookie `dwello_session` (gleiches HS256-Token wie `persona-kit.mjs`, im Scratchpad mit dem Persona-Secret erzeugt, weil der Worktree kein `node_modules` hat) nur GET: `/statements/52d57d57-…` und `/statements/a6641e02-…` (200). Verlauf -0003: «Versendet per E-Mail an pierre.dubois@example.ch 31.10.2026, 14:59 / Erneut zugestellt per Brief 31.10.2026»; Verlauf -0004: «Versendet per Brief 31.10.2026 / Neues PDF versendet per Brief 31.10.2026»; Bemerkungen «Ratenzahlung bis Ende März vereinbart» nur bei -0004. Zeiten sind Schweizer Zeit (DB in UTC, +1 h).

## Nicht bestätigt

- **Regel «ein späteres Zahlungsziel bleibt» und «Datum heute» bei einem anderen Tag als dem ersten Versand.** Beide Records wurden am 31.10.2026 erstmals versendet und am selben Tag erneut zugestellt bzw. geändert, deshalb sind Abrechnungsdatum und Zahlungsfrist vor und nach identisch. Dass die Neudatierung (heute plus Tage der Einstellung, nie früher als die gesetzte Frist) und «new_pdf ohne Neudatierung» an einem späteren Tag gelten, habe ich nur im Code gelesen (`datedToday` in statement.service.ts; `postNewPdf` und `markDocumentSent` fassen `statement_date` nicht an; `generateStatementPdf` datiert nur Entwürfe), nicht an einem Datensatz belegt. Es gibt in `dwello_persona` keinen solchen Record, und ich darf keinen anlegen oder verändern. Ebenso nicht geprüft: das Abrechnungsdatum der Konfiguration `payment_deadline_days` ungleich 30 (Konfiguration nicht gesetzt).
- **Die Änderungen von 2b9d542 gegenüber b2c4759** (Verweigerungen, `remindersCounted`, `redelivered`, ausgeblendete `paymentDeadline` bei Abrechnungs-Dokumenten in der Dokumentenliste): läuft nicht in der App (Antwort enthält `remindersCounted: null`), also weder Zahlen noch UI dazu geprüft. Sie betreffen keinen Betrag.
- **Browser-Rendering der Seite**: nur den serverseitig gerenderten HTML-Text gelesen (curl), keine Screenshots; `persona-kit.mjs` lief nicht, weil im Worktree `node_modules` fehlt und der Baum des Aufrufers nicht lesbar war.
- **PDF in de und en**: keiner der betroffenen Records hat diese Sprache (Dubois fr, Rossi it). Die Titel «neues PDF» in de/fr/en (`newPdfTitle`) habe ich nur im Code gelesen.
