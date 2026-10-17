# Datenprüfung W6c (#108), Runde 2, Commit 38e8b36

Methode wie Runde 1 (PDF aus documents.content, pdfinfo, pdftotext -bbox, pdftoppm -r 200, zxing-cpp via w6c-decode.py). Dateien: /tmp/claude-0/-home-user-Dwello/bb8b5e95-cb4b-5288-89e2-e60f5a92261e/scratchpad/w6c-out2/

## Befunde
Keine neuen. D-1 ist behoben.

| ID | Schwere | Datensatz | Status |
|----|---------|-----------|--------|
| D-1 | Major | 0a552e32… (de), d2829175… (it) | Behoben |

### D-1 Beleg
- `pdfinfo`: beide PDFs haben 1 Seite.
- Unterkante des Brieftexts (grösster yMax der Wörter oberhalb des Trennhinweises): 481.6 pt in beiden PDFs. Hinweis «Vor der Einzahlung abzutrennen» / «Da staccare prima del versamento» bei y 532.3 bis 538.7 pt, Trennlinie bei 544.25 pt (841.89 − 105 mm). Abstand Brieftext zum Hinweis rund 51 pt, keine Überlappung. Sichtprüfung des gerenderten PNG (de): Grussformel am Ende des Briefs, dann Leerraum, Hinweis, gestrichelte Linie, Empfangsschein und Zahlteil in den unteren 105 mm.
- Reproduktion: `pdftotext -bbox <pdf> - | grep '<word' | awk -F'"' '$4<525{print $8}' | sort -n | tail -1`.
- Der Wert 481.6 gilt für die genannten Texte (de 2. Mahnung, it 2° sollecito, längster it-Text mit 3-zeiligem Absatz). Die Schwelle 16 pt vor dem Zahlteil greift bei längeren Texten; ein Brief mit mehr als ca. 60 pt zusätzlicher Länge würde wieder umbrechen. Nicht an Extremfällen geprüft (Minor-Hinweis, kein Befund).

## Beträge und QR (dekodiert, SPC 0200, 31 Zeilen, Ende EPD)
| Datensatz | IBAN | Betrag | Referenz (QRR) | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|
| 0a552e32 (de) | CH4431999123000889012 | 215.80 CHF | 000444000731565837738783844 | Nebenkostenabrechnung NK-11111111-2025-0001 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich |
| d2829175 (it) | CH4431999123000889012 | 35.70 CHF | 004987001238567399882486918 | Conteggio spese accessorie NK-11111111-2024-0004 | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich |

- Beträge gleich utility_statements.balance (215.80 bzw. 35.70, in Runde 1 unabhängig aus den Positionen neu gerechnet, auf 5 Rp gerundet).
- Referenzen gleich utility_statements.qr_bill_reference (SQL-Abfrage); Prüfziffern 4 bzw. 8 in Runde 1 mod-10-rekursiv berechnet, die Referenzen sind unverändert.
- IBAN, Empfänger (Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich) und Zahlungspflichtiger unverändert zu Runde 1.
- Gedruckter Zahlteil (IBAN, Referenz, Betrag, Zusätzliche Informationen, Zahlbar durch) und Brieftext (IBAN, Referenz, Betrag, Frist 27.10.2026) stimmen mit der Payload überein. Mieter-Sprache stimmt (de/it).

## Geprüft und bestanden
documents 0a552e32-e002-47d6-b321-1dd8f91f3c63, documents d2829175-43cc-4b19-94c3-811fdfe3dcf8: Seitenzahl, Layout, Beträge, QR-Payload, Referenz, Mitteilung, Zahlungspflichtiger.

## Nicht bestätigt
- Kein Zahlteil bei bezahlter Abrechnung / ohne IBAN: weiterhin nicht an einem PDF geprüft (Persona-Daten dürfen nicht geändert werden); den neuen pg-Test (alle Mahnstufen eine Seite) habe ich nicht ausgeführt.
- Französische und englische Mahnung sowie 1. Mahnung / Zahlungserinnerung: keine Datensätze genannt, nicht geprüft.
- Datum «Zürich, 17.10.2026» (Systemdatum 16.10. UTC): unverändert zu Runde 1, plausibel Zürcher Zeit.
- Einzelpositionen der Abrechnung: nicht Gegenstand der Änderung.
