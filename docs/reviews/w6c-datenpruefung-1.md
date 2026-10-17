# Datenprüfung W6c (#108), Commit 7ac04a3

Methode: eigenes Skript (Python) liest `dwello_persona` (utility_statements, utility_statement_line_items, tenants, configuration, documents.content). Der Dwello-Code wurde nicht importiert. Die PDFs wurden aus `documents.content` dekodiert (Ablage: /tmp/claude-0/-home-user-Dwello/bb8b5e95-cb4b-5288-89e2-e60f5a92261e/scratchpad/w6c-out/). Die Seiten wurden mit `pdftoppm -png -r 200` gerendert und der QR-Code mit zxing-cpp (venv im Scratchpad) dekodiert. Dekodierskript: /tmp/claude-0/-home-user-Dwello/bb8b5e95-cb4b-5288-89e2-e60f5a92261e/scratchpad/w6c-decode.py

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Major | documents d050926d… (de) und 984ac37a… (it): Layout | Zahlteil in den unteren 105 mm von Seite 1, wie auf der Abrechnung | Zahlteil auf Seite 2. Seite 1 bleibt unten leer, Seite 2 ist oben leer (nur Zahlteil). Beträge sind richtig, das Layout nicht. |

### D-1 Beleg
- `pdfinfo`: beide PDFs haben 2 Seiten. `pdftotext -f 2 -l 2` beginnt mit «Vor der Einzahlung abzutrennen» / «Da staccare prima del versamento».
- Unterkante des Brieftexts auf Seite 1 (`pdftotext -bbox`, grösster yMax): de 568.7 pt, it 556.0 pt.
- Der Zahlteil beginnt bei 841.89 − 105 mm = 544.25 pt. Der Brief reicht also 12 bis 25 pt in den Zahlteil. Die Seite würde überlappen, daher fügt `addPaymentPart` (`doc.y > PAGE.height - PAYMENT_PART - 24`, Schwelle 520.25 pt) eine neue Seite ein. Die Bestätigung von Dr. Weber ist damit nachvollzogen.
- Es wird kein Brieftext überlappt (Seite 2 enthält nur den Zahlteil, Seite 1 nur den Brief). Der Zahlteil selbst steht korrekt in den unteren 105 mm von Seite 2: Trennlinie bei etwa 1293 von 2000 px, also 544 pt, Empfangsschein 62 mm, Zahlteil 148 mm.
- Ursache: Der Brief ist zu lang. Absender-, Adress- und Datumsblock sowie ein Fliesstext mit IBAN und Referenz nehmen etwa 570 pt ein. Der Briefkopf müsste kürzer sein oder der Text kompakter, damit der Brief bis etwa 520 pt reicht. Der Text selbst nennt IBAN und Referenz schon, was sich mit dem Zahlteil doppelt.
- Reproduktion: Skript `pdftotext -f 1 -l 1 -bbox <pdf> - | grep -o 'yMax="[0-9.]*"' | sort -n | tail -1`, oder PDF öffnen und Seite 2 ansehen (PNG: /tmp/claude-0/-home-user-Dwello/bb8b5e95-cb4b-5288-89e2-e60f5a92261e/scratchpad/w6c-out/d050926d-4745-4139-b765-7a4840a38765-2.png).

## Bestätigt (ohne Befund)

### Saldo (beide Abrechnungen)
| Abrechnung | Summe tenant_share (8 Positionen) | Verwaltungsgebühr (3.00 %) | total_costs | Akonto | exakt | Saldo gerundet auf 5 Rp | gespeichert | PDF und QR |
|---|---|---|---|---|---|---|---|---|
| 0966eecb… NK-11111111-2025-0001 | 3005.65 | 90.17 | 3095.82 | 2880.00 | 215.82 | 215.80 | 215.80 | 215.80 |
| 699a967f… NK-11111111-2024-0004 | 4112.32 | 123.37 | 4235.69 | 4200.00 | 35.69 | 35.70 | 35.70 | 35.70 |

Die Gebühr stimmt mit 3 % der Summe überein (90.17 / 3005.65, 123.37 / 4112.32). Die Verteilschlüssel pro Position habe ich hier nicht neu gerechnet, nur die Summen der gespeicherten Positionen. Die Einzelpositionen sind nicht Gegenstand dieser Änderung.

### QR-Payload (dekodiert, SPC 0200, 31 Zeilen, Ende mit EPD)
Beide Payloads: `SPC`, `0200`, Coding `1`.
- IBAN `CH4431999123000889012`. IID 31999 liegt im QR-IBAN-Bereich 30000 bis 31999. IBAN-Prüfsumme mod 97 = 1, gültig.
- Zahlungsempfänger (Adresstyp S): Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. Das entspricht `configuration` (company_*).
- Betrag/Währung: d050926d: `215.80` CHF. 984ac37a: `35.70` CHF. Beide gleich dem gespeicherten Saldo.
- Zahlungspflichtiger (Typ S): d050926d: Hans Müller, Bahnhofstrasse 42, 8001 Zürich, CH. 984ac37a: Maria Rossi, gleiche Adresse. Beides stimmt mit `tenants` überein.
- Referenztyp QRR. d050926d: `000444000731565837738783844`. 984ac37a: `004987001238567399882486918`.
  - Beide gleich `utility_statements.qr_bill_reference`.
  - Beide 27-stellig, MOD-10-rekursiv-Prüfziffer unabhängig berechnet (Tabelle 0,9,4,6,8,2,7,1,3,5): 4 bzw. 8, stimmt.
  - Beide gleich den ersten 80 Bits der Abrechnungs-UUID als Dezimalzahl (44400073156583773878384 bzw. 498700123856739988248691, links mit Nullen aufgefüllt).
- Mitteilung (Ustrd): d050926d: «Nebenkostenabrechnung NK-11111111-2025-0001». 984ac37a: «Conteggio spese accessorie NK-11111111-2024-0004». Sprache des Mieters, gleiche Mitteilung wie auf der Abrechnung (`t.title` plus Nummer).
- Strukturierte Rechnungsinformation leer, Alternativverfahren leer.

### Zahlteil-Text (gedruckt) gegen QR
- Gedruckte IBAN `CH44 3199 9123 0008 8901 2`, Referenz `00 04440 00731 56583 77387 83844` bzw. `00 49870 01238 56739 98824 86918`, Betrag, Zahlungsempfänger, Zahlungspflichtiger und Zusätzliche Informationen stimmen mit der Payload überein. Der Betrag steht in Empfangsschein und Zahlteil.
- Die Beschriftung stimmt mit der Mietersprache überein: de «Empfangsschein / Zahlteil / Konto / Zahlbar an / Referenz / Zusätzliche Informationen / Zahlbar durch / Währung / Betrag / Annahmestelle» und it «Ricevuta / Sezione pagamento / Conto / Pagabile a / Riferimento / Informazioni supplementari / Pagabile da / Valuta / Importo / Punto di accettazione». Das entspricht den offiziellen SIX-Texten.
- Brieftext: IBAN, Referenz und Betrag (CHF 215.80 bzw. CHF 35.70) stimmen mit dem Zahlteil überein, ebenso die Frist 27.10.2026 mit `documents.payment_deadline`.
- Schweizerkreuz vorhanden (Bild gesichtet).

### Code-Lektüre (Zusatz, keine Datenlage)
- `reminder.service.ts`: kein Zahlteil bei `status === 'paid'` oder ohne IBAN (`qrBillConfig()` liefert null). Die Datensätze in der Datenbank erlauben es nicht, das auszuprobieren, ohne Daten zu ändern. Siehe «Nicht bestätigt».

## Nicht bestätigt
- «Keine Zahlteil nach Zahlung» und «keine ohne IBAN»: nur durch Lesen des Diffs gesehen, nicht an einem PDF geprüft. Ich darf die Daten der Persona-Datenbank nicht ändern (Abrechnung bezahlen, IBAN löschen). Der neue Test `backend/src/__tests__/reminders.pg.test.ts` deckt es laut Diff ab, ich habe ihn nicht ausgeführt.
- Die Datumzeile «Zürich, 17.10.2026» liegt einen Tag nach dem Systemdatum (16.10.2026 UTC, 23:02 UTC = 01:02 in Zürich am 17.10.). Das ist plausibel Zürcher Zeit, ich habe es nicht weiter geprüft.
- Französische und englische Mahnung: keine Datensätze genannt, nicht geprüft.
- Einzelpositionen (Verteilschlüssel, Rechnungen, Akonto-Aufteilung): nur die Summen wurden gegen den gespeicherten Saldo gerechnet.
