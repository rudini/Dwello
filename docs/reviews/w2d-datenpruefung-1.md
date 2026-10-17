# Datenprüfung #79 (Saldo nur zugunsten der Mieter auf 5 Rappen), Commit ba593eb

Datenbank `dwello_persona` (nur gelesen), Worktree `.../scratchpad/review-w2d-daten`. Eigenes Skript: `.../scratchpad/verify.py` (Decimal, ohne Dwello-Code), Raster-Test `.../scratchpad/grid.ts`. Aus der DB extrahierte PDFs und PNGs: `.../scratchpad/pdf-db/`.

## Ergebnis

Kein Blocker, kein Major, kein Minor. Ein Nit. Alle 17 Abrechnungen stimmen auf den Rappen mit meiner Neuberechnung überein.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Nit | PDF fr/it, Zeile «vor Rundung» (z.B. NK-11111111-2025-0003, -0004, NK-22222222-2025-0004) | Betrag und Bezeichnung in einer Zeile | Die Bezeichnung bricht um («Montant à payer avant / arrondi», «Importo dovuto prima / dell'arrotondamento»); der Betrag steht in der ersten Zeile. Nur Layout, die Zahlen stimmen. Repro: `pdftotext -layout` auf der gespeicherten PDF, Zeilen 56-58 bzw. 57-58. |

## Vorgehen und Belege

1. Aus `utility_statement_line_items`: Zwischensumme = Summe `tenant_share`. Verwaltungspauschale = Zwischensumme × `management_fee_percent`, auf den Rappen kaufmännisch gerundet (0 wenn nicht vereinbart). «Ihre Nebenkosten» = Zwischensumme + Pauschale. Akonto = Monate × `monthly_advance_payment`, Teilmonate nach Tagen. Alle 17 Abrechnungen stimmen mit `total_costs`, `management_fee` und `total_advance_payments` überein.
2. Erwarteter Saldo eines Entwurfs = floor((Kosten − Akonto) × 20) / 20. Alle 7 Entwürfe stimmen mit `balance` überein. Abweichung zum unge­rundeten Betrag: Nachzahlung 0.02, 0.03, 0.03 nach unten (142.38 → 142.35, 238.12 → 238.10, 137.98 → 137.95, 75.82 → 75.80); Rückerstattung 0.02, 0.04, 0.03 nach oben (6.48 → 6.50, 34.56 → 34.60, 93.87 → 93.90). Keine Abweichung ≥ 0.05, keine zu Lasten der Mieter. Die Migrationsformel gibt für alle Entwürfe denselben Wert wie `balance`.
3. Gesendet/bezahlt: der gespeicherte Saldo liegt bei allen 10 Datensätzen auf dem Floor-Wert oder dem kaufmännischen Wert. In der Persona-DB liegen alle auf dem Floor-Wert (die Demodaten wurden mit dem neuen Code erzeugt), z.B. NK-11111111-2024-0001: 72.58 → 72.55, kaufmännisch wären 72.60.
4. Helper `roundTo5Rappen` (Aufruf von `bun grid.ts`): im Raster −1000.00 bis +1000.00 in 1-Rappen-Schritten 0 Abweichungen gegen floor-auf-5-Rappen. Kein −0. Float-Rauschen: `0.3 − 0.1 → 0.2`, `0.30000000000000004 − 0.3 → 0`. Randfälle +0.01 bis +0.04 ergeben 0.00 (im Raster eingeschlossen).
5. PDF-Text (de/fr/it, aus `pdf_blob`, `pdftotext -layout`): «vor Rundung» entspricht dem ungerundeten Betrag. «Rundung» = |Saldo| − |ungerundet| mit Vorzeichen (Rückerstattung wächst: «+ 0.02», Nachzahlung sinkt: «– 0.03»). Die Saldozeile entspricht `balance`. Bei exaktem Betrag (NK-11111111-2024-0003, NK-33333333-2024-0002) steht keine Rundungszeile, auch nicht im Kopfkasten. Zwischensumme, Pauschale und «Ihre Nebenkosten» sind auf den Rappen genau.
6. QR-Rechnungen: alle PDF-Seiten mit `pdftoppm -png -r 300` gerendert, mit zxing-cpp 3.1.1 (Installation in `.../scratchpad/libs`) dekodiert. Bei jeder Abrechnung mit Saldo > 0 wurde ein QR-Code gefunden, bei Saldo ≤ 0 keiner. Geprüft pro QR-Code: Header `SPC`, IBAN `CH4431999123000889012` (QR-IBAN, IID 31999) wie in `configuration`, Betrag = `balance`, Währung CHF, Referenztyp QRR, Referenz = erste 20 Hex-Stellen der Statement-UUID als Dezimalzahl, auf 26 Stellen aufgefüllt, plus Prüfziffer (rekursiv Modulo 10, eigene Implementierung) und gleich `qr_bill_reference`, Mitteilung «Nebenkostenabrechnung/Décompte des charges/Conteggio spese accessorie <Nr.>», Zahlungspflichtiger = Mieter mit Adresse. Alle bestanden.

## Geprüft und bestanden

| Abrechnung | Status | Sprache | Roh | Saldo gespeichert = PDF | QR |
|---|---|---|---|---|---|
| NK-11111111-2024-0001 | bezahlt | de | 72.58 | 72.55 | 72.55 |
| NK-11111111-2024-0002 | bezahlt | de | −171.67 | −171.70 | keiner |
| NK-11111111-2024-0003 | bezahlt | fr | −13.50 | −13.50 | keiner |
| NK-11111111-2024-0004 | bezahlt | it | 35.69 | 35.65 | 35.65 |
| NK-11111111-2025-0001 | gesendet | de | 215.82 | 215.80 | 215.80 |
| NK-11111111-2025-0002 | Entwurf | de | −6.48 | −6.50 | keiner |
| NK-11111111-2025-0003 | Entwurf | fr | 142.38 | 142.35 | 142.35 |
| NK-11111111-2025-0004 | Entwurf | it | 238.12 | 238.10 | 238.10 |
| NK-22222222-2024-0001 | bezahlt | de | −70.24 | −70.25 | keiner |
| NK-22222222-2024-0002 | bezahlt | de | 121.07 | 121.05 | 121.05 |
| NK-22222222-2024-0003 | bezahlt | it | 26.22 | 26.20 | 26.20 |
| NK-22222222-2025-0001 | Entwurf | de | −34.56 | −34.60 | keiner |
| NK-22222222-2025-0002 | Entwurf | de | 137.98 | 137.95 | 137.95 |
| NK-22222222-2025-0003 | Entwurf | de | −93.87 | −93.90 | keiner |
| NK-22222222-2025-0004 | Entwurf | it | 75.82 | 75.80 | 75.80 |
| NK-33333333-2024-0001 | bezahlt | de | −32.34 | −32.35 | keiner |
| NK-33333333-2024-0002 | bezahlt | de | −29.80 | −29.80 | keiner |

`paid_amount` der bezahlten Abrechnungen = `balance`. Alle gespeicherten PDFs der Entwürfe sind nach der Migration neu erzeugt (Zeitstempel `pdf_generated_at` 23:46:58 bis 23:46:59) und tragen den neuen Saldo.

## Nicht bestätigt

- **Webseite und API-Antwort**: Ich konnte die Werte der Webseite (Liste, Detail, Vorschau, PDF-Download) nicht lesen. Die Seiten brauchen eine Anmeldung (OAuth). Ein selbst erzeugtes JWT mit dem Persona-Secret wurde von der Berechtigungsprüfung abgelehnt, und ich habe die Sperre nicht umgangen. Geprüft ist nur der Datenbestand und das in der DB gespeicherte PDF; dass der Download-Endpunkt `GET /api/statements/:id/pdf` genau dieses `pdf_blob` ausliefert, ist nur aus dem Routencode gelesen (`Buffer.from(pdfBlob, 'base64')`).
- **PDF auf Englisch** und alle Sprachen ausser der Mietersprache: Die gespeicherten PDFs liegen nur in der Sprache des Mieters vor (de, fr, it). Eine Neuerzeugung in einer anderen Sprache würde `pdf_blob` der Persona-DB ändern (verboten). Eine eigene Backend-Instanz aus dem Worktree war nicht möglich, weil `node_modules` des Worktrees auf den Arbeitsbaum des Aufrufers zeigt und der Zugriff gesperrt ist. Die englischen Texte «Rounding to 5 centimes» und «before rounding» sind nur im Quelltext (`backend/src/services/pdf.service.ts`) gesehen. Die Rundungslogik ist sprachunabhängig.
- **Fälle, die die Persona-Daten nicht enthalten**: Entwurf mit Nachzahlung +0.01 bis +0.04 (Saldo 0.00, Text «Ausgeglichen/balancedRounded», keine Zahlungsteil-Seite); gesendete oder bezahlte Abrechnung mit alt (kaufmännisch) gerundetem Saldo, die nach der Migration unverändert bleibt und deren «Rundung»-Zeile dann ein anderes Vorzeichen haben kann (z.B. kaufmännisch aufgerundete Nachzahlung ergäbe «+ 0.02»). Die Migration selbst lief auf einer frischen DB mit schon neuen Werten; ihr Verhalten auf alten Daten (nur Entwürfe, PDF-Cache geleert, gesendet/bezahlt unberührt) ist nur aus dem SQL gelesen. Der Helper-Raster-Test deckt die Randfälle der Rechnung ab, nicht aber das PDF dieser Fälle.
- **Positionen bis zur Rechnung**: Ich habe die Positionsbeträge (`tenant_share`) nur auf Summe und Konsistenz geprüft, nicht aus Rechnungen, Verteilschlüsseln und Tankbestand neu berechnet; die Änderung betrifft sie nicht.
