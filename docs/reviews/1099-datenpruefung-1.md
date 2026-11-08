# Datenprüfung #1099, Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/265fa598-79c9-5d0d-b8ff-283c9a4a6167/scratchpad/review-1099-daten` (Commit 8aa99e4). App: Frontend :3300, Backend :3301, Datenbank `dwello_persona`. Es wurde kein Repo-Test ausgeführt und kein Repo-Datei geändert.

**Ergebnis: keine Findings.** Beide berichtigten Abrechnungen stimmen mit meiner unabhängigen Nachrechnung auf den Rappen überein: gespeicherte Werte, Webseite und PDF in de/fr/it/en. Die beibehaltenen Pfade (Heizprofil mit Division durch die Monate der Periode, `noHeatingMonths`) geben die richtigen Beträge und das richtige PDF.

| ID | Schwere | Record | Erwartet | Tatsächlich |
|----|---------|--------|----------|-------------|
| – | – | keine Findings | – | – |

Geprüft: NK-33333333-2024-0004 (f3df17f7-ad8b-4511-864d-29038b6e63ba) und NK-33333333-2024-0006 (e32408be-943d-417e-b1fd-40289f0cdf54), je gespeicherte Werte, Positionen, Akontobeiträge, Saldo und Rundung, Webseite `/statements/:id`, PDF de/fr/it/en, QR-Rechnung in allen 8 PDFs.

## Vorgehen

- Skript (nur Lesezugriff auf die Datenbank, ohne Dwello-Code): `/tmp/claude-0/-home-user-Dwello/265fa598-79c9-5d0d-b8ff-283c9a4a6167/scratchpad/d1099-recompute.py`. Aufruf: `python3 -I d1099-recompute.py f3df17f7-ad8b-4511-864d-29038b6e63ba e32408be-943d-417e-b1fd-40289f0cdf54`.
- Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` («Regeln in Dwello», 1, 5, 6, 8), `UBIQUITOUS_LANGUAGE.md` (Anteil nach Heizprofil, Akontobeiträge, Saldo, Rundung auf 5 Rappen).
- Eingaben aus der Datenbank: Rechnungen des Gebäudes, Kategorien, Verteilschlüssel (`{area}`), Wohnungen (Summen zum Erstellzeitpunkt der Abrechnung), Mietverträge, Akonto-Beträge, Heizprofil «Heizung Mittelland», Tankbestände.

## NK-33333333-2024-0004 (DG 1099, Periode 01.07.–31.12.2024 = 184 Tage, Miete 01.10.–31.12. = 92 Tage)

Tankbestand: Anfangsbestand am 30.06.2024 fehlt, also zählt die Lieferung (Einkauf). Rechnung ohne Leistungszeitraum, Rechnungsdatum 20.08.2024, zählt die Monate der ganzen Periode.

Heizprofil: Monate der Periode Jul 0, Aug 0, Sep 1, Okt 10, Nov 13.5, Dez 17 = 41.50 %. Monate des Mietverhältnisses Okt/Nov/Dez = 40.50 %. 40.50 / 41.50 = 97.59 % (gespeichert `percent` 97.59, `periodPercent` 41.5, Monate 10 / 13.5 / 17).

| Position | Kosten | Wohnungsanteil (60/315 m²) | Zeitanteil | Betrag (meine Rechnung = gespeichert = Web = PDF) |
|----------|--------|---------------------------|------------|-----------|
| Heizung | 5120.00 | 975.24 | 97.59 % Heizprofil | 951.74 |
| Kaminfeger (Heizkosten-Kategorie, 15.10.2024) | 290.00 | 55.24 | 97.59 % Heizprofil | 53.91 |
| Allgemeinstrom | 191.20 | 36.42 | 92/184 | 18.21 |
| Kaltwasser | 475.00 | 90.48 | 92/184 | 45.24 |
| Schneeräumung | 410.00 | 78.10 | 92/184 | 39.05 |

Summe 1108.15 (gespeichert 1108.15). Akonto 3 × 150.00 = 450.00. Saldo 658.15, ein Vielfaches von 0.05, keine Rundungszeile. Gespeichert 658.15.

Ich habe die Heizungsbeträge auch mit dem ungerundeten Bruch 40.5/41.5 gerechnet: dieselben Rappen (951.74, 53.91).

PDF (alle vier Sprachen): Seite 1 Zeitanteil «97.59 %» bei Heizung und Kaminfeger, «92/184 Tage» bei den übrigen, Fussnote «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil». Seite 2 «Heiz- und Warmwasserkosten»: Monate des Mietverhältnisses «Okt 10.00 %, Nov 13.50 %, Dez 17.00 %; zusammen 40.50 %», Monate der Abrechnungsperiode «Jul 0.00 %, Aug 0.00 %, Sep 1.00 %, Okt 10.00 %, Nov 13.50 %, Dez 17.00 %; zusammen 41.50 %», «Anteil nach Heizprofil: 40.50 % / 41.50 % = 97.59 %», Quelle der Monatsanteile. Alle Beträge in fr/it/en identisch.

## NK-33333333-2024-0006 (DG2 1099, Periode 01.06.–31.08.2024 = 92 Tage, Miete 15.07.–31.08. = 48 Tage)

Die Monate Jun/Jul/Aug haben im Heizprofil zusammen 0 %. Also werden die Heizkosten nach Tagen verteilt (`byDays`, `reason noHeatingMonths`). Tankbestände (Anfang 31.05., Ende 31.08.) fehlen, also zählt die Lieferung vom 20.08.2024. Wohnungsanteil 60/375 m².

| Position | Kosten | Wohnungsanteil | Zeitanteil | Betrag |
|----------|--------|---------------|------------|--------|
| Allgemeinstrom | 178.40 | 28.54 | 48/92 | 14.89 |
| Kaltwasser | 460.00 | 73.60 | 48/92 | 38.40 |
| Heizung | 5120.00 | 819.20 | 48/92 | 427.41 |

Summe 480.70. Akonto: 15.–31.07. = 17/31 × 150 = 82.26, August 150.00, zusammen 232.26. Saldo vor Rundung 248.44, Rundung −0.04 (Nachzahlung abgerundet), Saldo 248.40. Alles gleich wie gespeichert.

Webseite: «Heizung Mittelland (nicht angewendet: die Monate der Abrechnungsperiode haben im Heizprofil zusammen 0 %)», Zeitanteil «48/92 Tage», Anteil 8.35 %, Rundungszeile −0.04. PDF (de/fr/it/en): «48/92 Tage» auch bei Heizung, kein Abschnitt «Heiz- und Warmwasserkosten», passend zu Regel 5 («keinen Heizprofil-Hinweis», #137). Rundungszeile «− 0.04» und Akontozeilen «17/31 Tage × CHF 150.00 … 82.26» in allen Sprachen.

## QR-Rechnungen

Mit `zxing-cpp` im venv `d1099-venv` entschlüsselt (`pdftoppm -png -r 400`, Seite 2, alle 8 PDFs; Skript `d1099-qr.py`). In allen Sprachen gleich ausser der Meldung:

| Abrechnung | IBAN | Betrag | Referenz (QRR) | Prüfziffer | Mitteilung |
|------------|------|--------|----------------|-----------|------------|
| 0004 | CH4431999123000889012 (mod 97 ok, QR-IID 31999) | 658.15 CHF | 011516504063055568076488457 | stimmt (7) | «Nebenkostenabrechnung NK-33333333-2024-0004» (fr «Décompte des charges …», it «Conteggio spese accessorie …», en «Utility Cost Statement …») |
| 0006 | wie oben | 248.40 CHF | 010726419045020516985533410 | stimmt (0) | «Nebenkostenabrechnung NK-33333333-2024-0006» (und die drei Sprachen) |

Zahlungsempfänger «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich» wie in den Einstellungen; Betrag und Referenz gleich wie in `qr_bill_reference` und `balance`, Empfangsschein und Zahlteil.

## Nebenwirkung meiner Prüfung

Um die PDFs in allen vier Sprachen zu erhalten, habe ich `POST /api/v1/statements/:id/generate-pdf` je Sprache aufgerufen. Das schreibt `pdf_blob`, `pdf_generated_at` und `qr_bill_reference` der beiden Entwürfe (der Entwurf wird ohnehin bei jedem `GET /pdf` neu erzeugt). Beträge, Status und Positionen blieben unverändert. Der letzte gespeicherte PDF-Stand ist Englisch.

## Nicht bestätigt

- **Zahlungspflichtiger (Debitor) im QR-Code:** Die Felder sind leer, im Zahlteil steht das leere Feld «Zahlbar durch (Name/Adresse)». Die beiden Test-Mieter (Petra Teiljahr Herbst / Sommer) haben keine Adresse (`tenants.address`, `postal_code`, `city` leer), und der Code nennt den Debitor nur mit Name, PLZ und Ort (`backend/src/services/pdf.service.ts:820`, `qr-bill.service.ts:254`). Das ist erwartet und kein Befund, aber ein gefüllter Debitor wurde an diesen Records nicht geprüft. Ausserhalb von #1099.
- **Amtliche Prüfung der Prüfziffer / Validator der SIX:** Ich habe nur die Prüfziffer (Modulo 10 rekursiv) und die IBAN (Modulo 97) selbst nachgerechnet, nicht mit einem Validator der SIX.
- **Nicht geprüft:** der Zustand «versendet» der ersetzten Abrechnungen 0003 und 0005 (nur die berichtigten waren verlangt; deren Summen sind identisch mit den berichtigten) und die Vorschau des Assistenten (Änderung von #1099, im Auftrag nicht enthalten).
