# Datenprüfung #459 Slice B «Mieter anonymisieren» (Mieter a0000001-…-000000000006)

Worktree: .../scratchpad/review-459-B-daten (d22c72c5). Daten: dwello_persona, nur gelesen. Zum Erzeugen der PDFs (Entwurf 2025, alle Sprachen) habe ich die Persona-DB in eine Kopie `dwello_459copy` restauriert, den Service aus dem Worktree dagegen laufen lassen und die Kopie danach gelöscht. Skripte/Artefakte: .../scratchpad/dump459/ (gen.ts, *.pdf, *.txt).

## Befunde

| ID | Schwere | Record | Erwartet | Tatsächlich |
|----|---------|--------|----------|-------------|
| D-1 | Nit | audit_log (leer) | Prüfung «audit_log details ohne Name» | Tabelle hat 0 Zeilen in dwello_persona; Punkt (3) für audit_log daher nicht aussagekräftig (siehe «Nicht bestätigt»). Kein Fehler. |

Keine Blocker, Major oder Minor.

## Ergebnisse

1. Beträge unverändert (bestanden). `select … from utility_statements where tenant_id=…` ergibt
   - NK-22222222-2024-0002: 2761.07 / 2640.00 / 80.42 / 121.05 / paid 121.05
   - NK-22222222-2025-0002 (draft): 1461.63 / 1320.00 / 42.57 / 141.60 / –
   identisch mit amounts.csv. Die 5 Positionen (utility_statement_line_items) von 2024 stimmen mit dem PDF: 228.00, 1040.38, 516.34, 768.75, 127.18.
2. Eigene Neurechnung (Python, Decimal) aus den DB-Eingaben:
   - 2024: Zwischensumme 2680.65, Pauschale 3 % = 80.42, Total 2761.07, Saldo vor Rundung 121.07, Rundung – 0.02, Saldo 121.05 (Nachzahlung ab-gerundet, Regel 8).
   - 2025: Positionen 113.06 / 591.94 (1054.47 × 2310/4115) / 261.77 / 388.84 / 63.45 = 1419.06; Pauschale 42.57; Total 1461.63; Akonto 6 × 220 = 1320.00; vor Rundung 141.63; Rundung – 0.03; Saldo 141.60. (Kaufmännisch wären 141.65; die Regel «nur zugunsten des Mieters» verlangt 141.60, DB und PDF stimmen.)
   - PDF 2024 nachher (helga-459B/abr2024-nachher.pdf und das in der DB gespeicherte pdf_blob, per `diff` identisch) == PDF vorher (459B-before/statement-paid.pdf) in jeder Zeile und Summe; Unterschiede nur: Empfängerblock «Anonymisierter Mieter» ohne Adresse, Abrechnungsdatum 01.03.2015 (künstlich per SQL) und Status paid: neu steht «Bezahlt am 05.05.2025. Vielen Dank.» statt Zahlungsfrist, und der Zahlteil fehlt (vorher mit Zahlteil und Debitor Sarah Meier). Beide Beträge 121.05.
   - Entwurf 2025: PDF mit dem Worktree-Service in der Kopie erzeugt (der Download auf der Persona-App würde schreiben: getStatementPdf speichert Datum/Blob), alle Zeilen = DB. Auch fr/it/en: 1'461.63, 141.63, 141.60 und 2024: 2'761.07, 121.05 gleich wie de.
3. Kein Personenbezug (bestanden). Volldump aller Tabellen (`pg_dump --data-only --inserts`) durchsucht: «Sarah», «sarah.meier», «Hirschmattstrasse»: 0 Treffer. «Meier»: 8 Treffer, alle der Lieferant «Hauswartung Meier GmbH» in invoices (kein Mieterbezug). «Luzern»: Gebäude Seepark Residenz (Seeweg 15, 6003 Luzern, im PDF als Gebäudeadresse zu erwarten), Rechnungen und die Mieter Weber, Bernasconi, Brunner; nicht dieser Mieter (tenants-Zeile: Anonymisierter Mieter, E-Mail/Telefon/Adresse/PLZ/Ort leer, anonymised_on 2026-10-22).
   documents: 0 Zeilen für den Mieter; rental_contracts: notes und contract_pdf NULL; utility_statements: notes NULL; alle 16 gespeicherten pdf_blob (Base64) dekodiert und per pdftotext nach Sarah/Hirschmatt durchsucht: 0 Treffer; die PDFs des Mieters (gespeichert, 2024 neu, Entwurf 2025, vier Sprachen) enthalten weder Name noch Strasse. JSON-Spalten (fuel_stock, key_values, heating_share, advance_lines, payment_resets …) liegen im Dump und haben keinen Treffer.
4. QR-Rechnung (bestanden): Das 2024-PDF (paid) druckt keinen Zahlteil. Der Entwurf 2025: Seite 2 mit `pdftoppm -r 300` gerendert, mit zxing-cpp dekodiert: IBAN CH4431999123000889012, Betrag 141.60 CHF, Referenz QRR 003143428799906893214268289 (Prüfziffer 9 stimmt, Modulo 10 rekursiv, eigene Rechnung), Mitteilung «Nebenkostenabrechnung NK-22222222-2025-0002», Zahlungspflichtiger: alle 7 Felder leer (kein Teilblock; SIX-konform: ganz leer, nicht nur ohne Adresse). Im Zahlteil steht «Zahlbar durch (Name/Adresse)» als leeres Feld. Die Referenz des paid-Statements (…07914, Prüfziffer 4) stimmt ebenfalls und deckt sich mit dem Zahlteil vorher.

## Geprüft und bestanden
NK-22222222-2024-0002 (DB, 2 PDFs, 4 Sprachen), NK-22222222-2025-0002 (DB, PDF in 4 Sprachen, QR), tenants-Zeile, documents, rental_contracts, alle pdf_blob, Volltextsuche aller Tabellen.

## Nicht bestätigt
- Webseite der Abrechnung (Seite :3300): nicht geprüft, keine Sitzung/Anmeldung; nur DB und PDF.
- audit_log: in dwello_persona leer, also kein Beleg, dass Anonymisieren Einträge mit Namen bereinigt. Der Service fasst audit_log nicht an; ein Eintrag mit Name wäre nur bei einer anderen Datenlage möglich.
- Entwurf 2025 auf der laufenden Persona-App: nicht heruntergeladen (würde Daten schreiben); stattdessen Kopie der DB mit dem Worktree-Stand d22c72c5 (die App läuft mit 7840d938, gleicher Servicecode laut Auftrag).
- Pixelgenaue Seitenprüfung: nicht ausgeführt, nur Text und QR-Dekodierung.
