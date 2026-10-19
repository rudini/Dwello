# Datenprüfung #464 (Akonto «Gültig ab»), Runde 1

Geprüft: Worktree a224d0c2 (read only), laufende App (Persona-Stack, gebaut aus 06aac4c5), Datenbank dwello_persona.
Skripte (unabhängig, ohne Dwello-Code): `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/verify.py` (Akonto, Saldo, PDF-Text), `.../qr.py` (QR-Rechnungen), `.../web.py` (Webseite), `.../mk.py`, `mk2.py`, `gen.py`, `lang.py` (Testfälle über die API, nur Alpenblick), `.../api.py` (JWT mit dem Persona-Geheimnis).

## Ergebnis

Kein Blocker, kein Major, kein Minor. Alle Beträge stimmen auf den Rappen mit meiner Neuberechnung überein (Akontozeilen, Total, Saldo inkl. Rundung auf 5 Rappen, PDF-Text in vier Sprachen, QR-Rechnungen). Eine Nit-Beobachtung.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Nit | Webseite `/statements/<id>` (z. B. NK-11111111-2025-0005, NK-33333333-2025-0001) | Nicht vorgegeben (Auftrag: nur das PDF druckt die Zeilen). Wer die Webseite mit dem PDF vergleicht, sieht dort die Aufteilung 6 × 240 + 6 × 250 nicht | Webseite zeigt nur «Geleistete Akontobeiträge − CHF 2'940.00»; `advance_lines` wird im Frontend nirgends gelesen (`grep advanceLines src` leer). Betrag korrekt |
| D-2 | Nit (Beobachtung, kein Fehler dieser Änderung) | NK-33333333-2025-0006 (it) | Grammatik «1 giorno» | Kopfzeile «(1 giorni su 365)» und Kostenübersicht «1/365 giorni»; besteht vor #464 (Mietstage-Text, nicht Akontozeile). Die neuen Akontozeilen sind korrekt: «1/31 giorni», «1 Monat/1 mois/1 mese/1 month» |

Zu D-1 Reproduktion: `curl -s -b "dwello_session=<JWT>" http://localhost:3300/statements/<id>` (JWT: `api.py`, `token()`), Text nach «Geleistete Akontobeiträge» ansehen.

## Regeln, nach denen ich gerechnet habe (aus Glossar und Anforderungen)

- Jeder Akontobetrag gilt vom «Gültig ab» (erster am Vertragsbeginn) bis zum Tag vor dem nächsten; geschnitten mit den Mietstagen der Periode (Vertragsbeginn, -ende, «Abgerechnet bis» + 1 Tag).
- Ganze Kalendermonate: n × Betrag. Angebrochene Monate (Einzug/Auszug/Abgerechnet bis): d/D Tage × Betrag, Zeile auf Rappen gerundet (kaufmännisch). Total = Summe der gerundeten Zeilen.
- Saldo = Ihre Nebenkosten (Summe der Anteile + Verwaltungspauschale) − Akonto − bereits Bezahltes; auf 5 Rappen zugunsten des Mieters (Nachzahlung ab-, Rückerstattung aufgerundet), also floor auf 5 Rappen.

## Geprüft und bestanden (Verifier: 24 von 25 Abrechnungen ohne Abweichung, die 25. ist die ersetzte Abrechnung, siehe unten)

Je Abrechnung geprüft: Mietstage-Bereich, Zeilen von `advance_lines` (von, bis, Betrag, Monate bzw. Tage/Tage im Monat, Total), Summe der Zeilen = `total_advance_payments`, `total_costs` = Summe Anteile + Pauschale, `balance` inkl. Rundung, PDF-Zeilen (Text, Reihenfolge, Betrag rechts, Anzahl) und das Total «Geleistete Akontobeiträge».

- NK-11111111-2025-0005 (Hans Müller, versendet, Kernfall): Zeilen 6 Monate × CHF 240.00 (01.01.2025 – 30.06.2025) = 1'440.00 und 6 Monate × CHF 250.00 (01.07.2025 – 31.12.2025) = 1'500.00, Total 2'940.00; Kosten 3'095.82 (Zwischensumme 3'005.65 + 3 % = 90.17); Saldo vor Rundung 155.82, Rundung − 0.02, Nachzahlung 155.80. Gespeichert = berechnet = Webseite = PDF. Hinweis im PDF: «Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind. Haben Sie Akontobeiträge nicht bezahlt, regeln wir das ausserhalb dieser Abrechnung.» Das Hinweis-Feld `notes` («Berichtigt: Ab 01.07.2025 beträgt Ihr Akonto CHF 250.00 statt CHF 240.00 …») erscheint auf der Webseite, nicht im PDF (interne Bemerkung; kein Fund, nicht als Anforderung gefunden).
- Alle übrigen Demo-Abrechnungen (je ein Akontobetrag, ganze Monate oder halbes Jahr): NK-11111111-2024-0001…0004, 2025-0002…0004; NK-22222222-2024-0001…0003, 2025-0001…0004 (Seepark A2: 2025-0002 = 6 × 220 = 1'320.00 bis 30.06.2025, 2025-0003 = 6 × 240 = 1'440.00 ab 01.07.2025); NK-33333333-2024-0001, 0002. Gespeicherte PDFs: Zeilentext, Betrag, Saldo stimmen (de/fr/it, je nach Mietersprache).
- Ersetzte Abrechnung NK-11111111-2025-0001: behält bewusst ihre alten Werte (1 Zeile 12 × 240 = 2'880.00, Saldo 215.80, Status replaced). Meine Neuberechnung mit heutigen Akonti ergäbe 2'940.00; das ist erwartet, kein Fund (eine ersetzte Abrechnung bleibt historisch; die Prüfung meldet sie nur deshalb als Abweichung).
- Eigene Testfälle in Alpenblick (Wohnungen/Mieter «P464-1…7», Perioden 2025):

| Abrechnung | Fall | Zeilen (gespeichert = berechnet = PDF) | Total | Saldo |
|---|---|---|---|---|
| NK-33333333-2025-0001 (fr) | Einzug 15.03., 200 ab Beginn, 210 ab 01.07. | 17/31 Tage × 200 = 109.68 (15.–31.03.); 3 Monate × 200 = 600.00; 6 Monate × 210 = 1'260.00 | 1'969.68 | − 1'259.20 (vor Rundung − 1'259.19, + 0.01) |
| NK-33333333-2025-0002 (it) | Auszug 20.09., 200 / 230 ab 01.04. / 260 ab 01.09. | 3 × 200 = 600.00; 5 × 230 = 1'150.00; 20/30 Tage × 260 = 173.33 | 1'923.33 | − 1'283.45 (− 1'283.41, + 0.04) |
| NK-33333333-2025-0003 (en) | Einzug 10.02., 333.33 | 19/28 Tage × 333.33 = 226.19; 10 × 333.33 = 3'333.30 | 3'559.49 | − 2'768.70 (− 2'768.69, + 0.01) |
| NK-33333333-2025-0004 (de) | Vertrag ab 2024, «Abgerechnet bis» 14.03.2025, 180 / 199.99 ab 01.02.2025 | 17/31 Tage × 199.99 = 109.67; 9 × 199.99 = 1'799.91 (nur ein Betrag, ab 15.03.) | 1'909.58 | − 1'199.10 (− 1'199.09, + 0.01) |
| NK-33333333-2025-0005 (fr/de/it/en) | Einzug 01.12. | 1 Monat/mois/mese/month × 205.55 | 205.55 | − 138.30 |
| NK-33333333-2025-0006 (it) | Einzug 31.12. | 1/31 giorni × 205.55 = 6.63 | 6.63 | − 4.70 |
| NK-33333333-2025-0007 (en) | Einzug 10.06. bis 20.06. | 11/30 days × 205.55 = 75.37 | 75.37 | − 55.75 |

  Die Zeilen- und Totalrundung (Summe gerundeter Zeilen, nicht Summe ungerundet) ist bestätigt, z. B. 0004: 109.67 (109.6714) + 1'799.91.
- Sprachen: Akontozeilen und Satz «Abgezogen sind die Akontobeiträge …» in de, fr, it, en geprüft (de: Monate/Tage, fr: mois/jours, it: mesi/giorni, en: months/days; Einzahl «1 Monat/1 mois/1 mese/1 month»). Die PDF-Sprache folgt der Mietersprache (die Sprache im Aufruf `generate-pdf` wirkt nicht; kein Fund, so gestaltet). Ich habe dazu die Sprache meiner eigenen Testmieter geändert.
- QR-Rechnungen (PDF-Seite 3 mit `pdftoppm -png -r 300`, dekodiert mit zxing-cpp in `.../lib`): bei allen 14 Abrechnungen mit Nachzahlung ≥ CHF 5 dekodiert; je Header SPC/0200/1, IBAN CH4431999123000889012, Währung CHF, Betrag = Saldo, QRR-Referenz = `qr_bill_reference` (27 Stellen, Prüfziffer Modulo 10 rekursiv stimmt), Mitteilung «Nebenkostenabrechnung <Nr>» (in der Mietersprache), Zahlungspflichtiger = Mieter mit Adresse, Trailer EPD. Dazu gehört NK-11111111-2025-0005: CHF 155.80, Referenz 004670627350445710631063310, Mitteilung «Nebenkostenabrechnung NK-11111111-2025-0005», Zahlbar durch Hans Müller, Bahnhofstrasse 42, 8001 Zürich. Geprüft: NK-11111111-2024-0001, 2024-0004, 2025-0001, 2025-0003, 2025-0004, 2025-0005; NK-22222222-2024-0002, 2024-0003, 2025-0003, 2025-0004.
- Abrechnungen mit Rückerstattung (alle NK-33333333-2025-000x, andere negative Salden) haben kein Zahlteil im PDF und keinen QR-Code, wie in den Anforderungen vorgesehen.

## Nicht bestätigt

- Die Kostenanteile der Abrechnungspositionen (Verteilschlüssel, Zeitanteile, Heizprofil, Tankbestand) habe ich nicht aus den Rechnungen neu berechnet; sie liegen ausserhalb von #464. Geprüft habe ich nur, dass `total_costs` = Summe der gespeicherten Anteile + Verwaltungspauschale (auf den Rappen) und dass der Saldo daraus stimmt. Den Prozentsatz der Verwaltungspauschale (3 %) habe ich nur an NK-11111111-2025-0005 nachgerechnet (3'005.65 × 3 % = 90.17).
- PDFs der Demo-Abrechnungen habe ich aus dem gespeicherten `pdf_blob` gelesen, nicht neu erzeugt (neu erzeugen würde Daten der Persona-Stack-Datenbank ändern). Frische PDFs in vier Sprachen nur für meine eigenen Testabrechnungen.
- Webseite: nur Kopf-/Saldo-Text von NK-11111111-2025-0005, NK-22222222-2025-0003 und NK-33333333-2025-0001…0003 verglichen (Total, Saldo vor Rundung, Rundung, Saldo stimmen); fr/it/en der Webseite und Rendering im Browser nicht geprüft (nur HTML).
- Webseite in fr/it/en und Hell/Dunkel nicht angesehen.

## Hinweis an den Aufrufer: Testdaten in der Datenbank

Ich habe in Alpenblick sieben Wohnungen «P464-1…7» mit Mietern «Prüf P464-n», Mietverträgen und je einer Abrechnung 2025 (NK-33333333-2025-0001…0007, Entwürfe) angelegt (zusätzliche Wohnungen verändern den Flächenschlüssel von Alpenblick: Gesamtfläche 495.00 m²). Für Persona-Läufe mit Alpenblick neu starten oder diese Datensätze entfernen (`persona-stack.sh`).
Ids: `.../scratchpad/cases.json` (Verträge), `.../scratchpad/stids.json` (Abrechnungen); PDFs und Texte in `.../scratchpad/out/`.

## Reproduktion

`python3 /tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/verify.py` (Ausgabe «OK»/«FAIL» je Abrechnung; einzige Abweichung: die ersetzte NK-11111111-2025-0001, siehe oben) und `python3 .../qr.py`.
