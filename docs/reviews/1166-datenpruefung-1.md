# Datenprüfung #1166 (Kontoinhaber im QR-Zahlteil), Runde 1

Commit 319f284 (Worktree review-1166-daten), Persona-Stack, Datenbank `dwello_persona`. Es wurde nichts verändert; PDFs aus `utility_statements.pdf_blob` gelesen (erzeugt 22:46, nach dem Speichern des Kontoinhabers 22:45:36).

## Ergebnis

Keine Findings (kein Blocker, Major oder Minor). Alle Beträge, der Kontoinhaber im Empfangsschein, im Zahlteil und im QR-Code, die Referenz, der Zahlungspflichtige sowie Briefkopf und Gruss stimmen mit meiner Neuberechnung überein.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| – | – | – | – | keine Abweichung |

Geprüft: NK-11111111-2025-0003 (Pierre Dubois, fr), NK-11111111-2025-0004 (Maria Rossi, it), NK-11111111-2025-0002 (Anna Schmidt, de, Rückerstattung ohne Zahlteil), Basislinie NK-11111111-2025-0001 (versendet, unverändert).

## Nachweise

Skripte (Scratchpad, nicht im Repository): `/tmp/claude-0/-home-user-Dwello/5d7f70d4-0be2-5903-a4e8-3a73471da3fb/scratchpad/dp/recompute.py` (Beträge aus Rechnungen, Verteilschlüsseln, Wohnungen, Tankbestand, Akonto), `.../dp/verify.py` (QR-Inhalt, IBAN, Referenz), `.../dp/dec.py` (Decoder, OpenCV `QRCodeDetector`, installiert per pip). Seiten mit `pdftoppm -png -r 300` gerendert.

### Beträge (Neuberechnung aus den Eingaben, Rappen genau)
Eingaben: Gebäude Musterhaus Zentrum, 6 Wohnungen, 492.50 m²; Rechnungen 2025 ohne Leistungszeitraum; Heizung nach Verbrauch 2650.00 + 6565.00 − 2257.20 = 6957.80; Verwaltungspauschale 3 % des Zwischentotals; Akonto 12 × Betrag; Saldo zugunsten des Mieters auf 5 Rappen.

| Abrechnung | Zwischentotal | Pauschale | Total | Akonto | Saldo vor Rundung | Saldo (5 Rp) | gespeichert | PDF | QR |
|---|---|---|---|---|---|---|---|---|---|
| 0003 | 3283.86 | 98.52 | 3382.38 | 3240.00 | 142.38 | 142.35 | 142.35 | 142.35 (Rundung –0.03) | 142.35 |
| 0004 | 4308.85 | 129.27 | 4438.12 | 4200.00 | 238.12 | 238.10 | 238.10 | 238.10 (Rundung –0.02) | 238.10 |
| 0002 | 3488.85 | 104.67 | 3593.52 | 3600.00 | –6.48 | –6.50 | –6.50 | Rückerstattung 6.50 (vor Rundung 6.48) | kein Zahlteil, 2 Seiten |

Alle acht Positionen je Abrechnung (Lift, Hauswart, Kaltwasser, Allgemeinstrom, Gartenpflege, Kehricht, Heizung, Kaminfeger) stimmen mit `utility_statement_line_items` und der Tabelle im PDF 0003 und 0004 überein (z. B. 0003 Heizung 1188.48, Hauswart 635.13).

### QR-Code (decodiert, 31 Zeilen, alle Felder gegen Soll verglichen: keine Abweichung)
0003: `SPC | 0200 | 1 | CH4431999123000889012 | S | Erika Muster | Seeweg 5 | (leer) | 6003 | Luzern | CH | 7 leere Felder | 142.35 | CHF | S | Pierre Dubois | Bahnhofstrasse 42 | (leer) | 8001 | Zürich | CH | QRR | 010682450733478809134468483 | Décompte des charges NK-11111111-2025-0003 | EPD`
0004: gleich, Betrag 238.10, Debtor Maria Rossi, QRR 010603996868153396000642970, Mitteilung «Conteggio spese accessorie NK-11111111-2025-0004».

- Kreditor: Adresstyp `S` (strukturiert), Name, Strasse, PLZ, Ort, Land `CH` = Kontoinhaber (Erika Muster, Seeweg 5, 6003 Luzern), nicht der Absender.
- IBAN CH4431999123000889012: Modulo-97 gültig; IID 31999 liegt in 30000–31999, also QR-IBAN, daher QRR (richtig).
- Referenz: unabhängig aus den ersten 80 Bit der Abrechnungs-UUID als 26 Ziffern plus Modulo-10-rekursiv-Prüfziffer berechnet; identisch mit QR, `qr_bill_reference` und der Gruppierung im Zahlteil (27 Stellen, Prüfziffer stimmt).
- Debtor stimmt mit Mieteradresse (tenants) überein; Betrag im QR = gespeicherter Saldo.
- Strassenfeld enthält «Seeweg 5», Hausnummernfeld leer: gleiche Form wie beim Absender vor der Änderung (Basislinie 0001, versendet vor dem Speichern des Kontoinhabers: Kreditor «Muster Immobilien AG | Bahnhofstrasse 1 | (leer) | 8001 | Zürich | CH»). Keine Änderung, kein Finding.

### PDF-Text (fr, it)
Empfangsschein, Zahlteil («Compte / Payable à», «Conto / Pagabile a») und rechte Spalte nennen «CH44 3199 9123 0008 8901 2, Erika Muster, Seeweg 5, 6003 Luzern»; Referenz, «Payable par» / «Pagabile da» (Pierre Dubois / Maria Rossi, Bahnhofstrasse 42, 8001 Zürich), Währung CHF und Betrag stimmen auf Empfangsschein und Zahlteil. Gerendertes Bild der Seite 3 (0003) geprüft: Layout unauffällig.

### Briefkopf und Gruss bleiben der Absender
Alle drei PDFs: Kopf Seite 1 «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich»; Seitenkopf «Muster Immobilien AG · Bahnhofstrasse 1 · 8001 Zürich»; Gruss «Meilleures salutations / Cordiali saluti / Mit freundlichen Grüssen» mit «Muster Immobilien AG»; Belegeinsicht «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich». Weder «Erika Muster» noch «Seeweg» noch «Luzern» kommen ausserhalb des Zahlteils vor (0002: `pdftotext | grep -i "Erika\|Seeweg\|Luzern\|IBAN"` ohne Treffer).

Reproduktion: `psql -h localhost -U dwello dwello_persona` (`select value from configuration where key like 'account_holder%'`); PDF: `select pdf_blob from utility_statements where statement_number='NK-11111111-2025-0003'`, `base64 -d`, `pdftoppm -png -r 300 -f 3 -l 3`, danach `python3 dec.py` und `python3 verify.py` im Scratchpad-Ordner `dp`.

## Nicht bestätigt

- Webseite: Der Frontend-Port 3300 leitet ohne Anmeldung auf `/login` weiter (HTTP 303), die Seite der Abrechnung konnte ich ohne Sitzung nicht öffnen. Die Seite zeigt den Zahlungsempfänger nicht (im Quelltext nur `settings.ts`, `config/+page.svelte` und Backend-Dienste verwenden den Kontoinhaber); die dargestellten Beträge stammen aus den geprüften gespeicherten Werten. Geprüft nur über Datenbank und PDF.
- Mahnung: Für die genannten Abrechnungen existiert keine erzeugte Mahnung (kein Mahn-PDF in der Datenbank, `reminder.service.ts` nutzt `qrBillConfig()` gleich). Der QR-Teil einer Mahnung wurde nicht decodiert; nur Quelltext gelesen, keine Daten.
- Deutsche und englische Fassung des Zahlteils mit Kontoinhaber: für diese Datensätze nicht erzeugt (nur fr, it und de-Rückerstattung ohne Zahlteil vorhanden).
- Teilweise ausgefüllter Kontoinhaber (z. B. nur Strasse) und leere Strasse: keine passenden Datensätze, nicht ausgelöst, da keine Daten verändert werden dürfen.
