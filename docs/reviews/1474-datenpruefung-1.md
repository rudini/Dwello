# Datenprüfung #1474, Runde 1

Gegenstand: Commit 5033c05 (Worktree `scratchpad/review-1474-daten`), Gebäude «Seepark Residenz», Rechnung `cf25aa62-8553-4491-ba9d-dedeb5eaecbd` (Heizung CHF 3'000.00, Rechnungsdatum 2025-06-02, Leistungszeitraum 2025-05-15 bis 2025-05-15), Entwürfe NK-22222222-2025-0001 bis -0004. Datenbank `dwello_persona`, nur lesend (SELECT, GET mit selbst signiertem Sitzungscookie der Persona-Verwalterin). Nichts geändert, keine PDFs neu erzeugt.

Ergebnis: Alle Beträge stimmen auf den Rappen mit meiner unabhängigen Nachrechnung, der Weboberfläche (de/fr/it/en) und den beiden PDFs überein. Kein Blocker, kein Major. Ein Minor (D-1, der von Fachreview 1474-3 als V-8 gemeldete, vom Aufrufer bewusst offen gelassene Hinweistext).

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | PDF NK-22222222-2025-0002 und -0003, Hinweis unter der Kostenübersicht (`sharesNoteDelivery`, `backend/src/services/pdf-texts/de.ts:134`; fr/it/en: Zeile 133) | Ein Satz, der auch für ein Gebäude ganz ohne Tankbestand stimmt: «Für den Tank sind der Anfangs- und der Endbestand nicht beide erfasst.» (Wortlaut Fachreview 1474-3, Tabelle «Wortlaut», in allen vier Sprachen) | «Für den Tank fehlt der Anfangs- oder der Endbestand.» Seepark hat gar keinen Tankbestand (`fuel_stocks` leer, `no_tank` false); der Satz lässt die Mieterin glauben, einer der beiden Bestände sei erfasst. Betrag und Rechnung bleiben richtig. |

## D-1: Hinweistext zum Tank

Beleg (PDF-Text, Persona-PDFs sind byte-gleich mit `utility_statements.pdf_blob`, siehe unten):

```
pdftotext -layout /tmp/claude-0/-home-user-Dwello/5d09ef2c-a4a4-5466-818f-3163ccca8d53/scratchpad/weber-1474/after-meier.pdf - | grep -n "Für den Tank"
 ... zusammen 0 %, zählen stattdessen Ihre Mietstage darin. Für den Tank fehlt der Anfangs- oder der Endbestand. Die Lieferungen von
```

```
psql postgresql://dwello:dwello@localhost:5432/dwello_persona -c "select count(*) from fuel_stocks where building_id='22222222-2222-2222-2222-222222222222'"   -> 0
grep -n sharesNoteDelivery backend/src/services/pdf-texts/de.ts   (Worktree)   -> «fehlt der Anfangs- oder der Endbestand»
```

Reproduktion: PDF zu NK-22222222-2025-0002 oder -0003 öffnen, Seite 2, Absatz unter «Kostenübersicht». Der Aufrufer hat V-8 laut `docs/reviews/1474-review-1.md` Zeile 29 bewusst offen gelassen; ich melde ihn nur, weil der Text in den geprüften PDFs steht und ein Mieter ihn liest.

## Nachrechnung (Skript `/tmp/claude-0/-home-user-Dwello/5d09ef2c-a4a4-5466-818f-3163ccca8d53/scratchpad/dp1474-recompute.py`, `python3 -I`, liest nur aus der Datenbank)

Eingaben aus der Datenbank: 32 Rechnungen des Gebäudes (2025: Fernwärme Q1 1520.00 / Q2 790.00 / Q3 395.00 / Q4 1410.00 mit Leistungszeitraum, dazu die Heizöllieferung 3000.00; Q4 2024 mit Rechnungsdatum 2025-01-20 fällt mit seinem Leistungszeitraum in 2024 und zählt nicht, Q4 2025 mit Rechnungsdatum 2026-01-20 zählt), Fläche 68/82/75/95 = 320 m² (Wohnung B1 leer), 4 Wohnungen, Heizprofil «Heizung + Warmwasser» (13.6 / 12.1 / 11.5 / 9.3 / 5.6 / 3.7 / 3.7 / 3.6 / 3.7 / 9.5 / 10.7 / 13.0, Summe 100.0), Mietverträge (Meier bis 2025-06-30, Brunner ab 2025-07-01), Akonto 220 und 240 CHF pro Monat, 3 % Verwaltungspauschale (Bernasconi 2.5 %).

Regeln (aus `docs/nebenkostenabrechnung-anforderungen.md`, Regeln 1, 3, 5, 8, 9): Wohnungsanteil auf Rappen gerundet; Ihr Anteil = gerundeter Wohnungsanteil × Σ(Rechnung × Zeitanteil) / Σ Rechnungen; Heizkosten bei Teilperiode nach Heizprofil (Rechnung mit Leistungszeitraum: Monate darin, auf 100 % gebracht; Lieferung ohne Tankbestand: ganze Periode); Verwaltungspauschale auf die Zwischensumme; Saldo zugunsten des Mieters auf 5 Rappen (Nachzahlung ab-, Rückerstattung aufgerundet).

Position Heizung, Wohnung A2 (Wohnungsanteil 7115.00 × 82/320 = 1823.21875 → 1823.22; Lieferung allein 3000.00 × 82/320 = 768.75):

- Meier: Σ = 1520.00 × 100 % + 3000.00 × 55.80 % + 790.00 × 100 % + 395.00 × 0 % + 1410.00 × 0 % = 3984.00; 1823.22 × 3984.00 / 7115.00 = **1020.90** (Zeitanteil 0.559944, gespeichert 0.5599, Web/PDF «55.99 %»). Anteil der Lieferung 768.75 × 55.80 % = 428.96.
- Brunner: Σ = 3000.00 × 44.20 % + 395.00 + 1410.00 = 3131.00; 1823.22 × 3131.00 / 7115.00 = **802.32** (0.440056, gespeichert 0.4401, «44.01 %»). Anteil der Lieferung 768.75 × 44.20 % = 339.79.
- Meier + Brunner = 1823.22 = Wohnungsanteil; die 55.80 % und 44.20 % stimmen mit den Monatswerten Jan–Jun und Jul–Dez des Heizprofils überein.
- Zur Einordnung: Ohne die Änderung zählte die Lieferung nur mit ihrem einen Tag (Meier trüge die ganzen 768.75, Brunner nichts); diese Rechnung habe ich nicht ausgeführt.

Vergleich mit den gespeicherten Abrechnungspositionen (alle OK, Differenz 0.00):

| Entwurf | Wohnung / Mieter | Gartenpflege | TV/Kabel | Hauswart | Heizung | Kaltwasser | Allgemeinstrom | Zwischensumme | Pauschale | Nebenkosten | Akonto | Saldo vor Rundung | Saldo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2025-0001 | A1 Weber | 76.93 | 228.00 | 650.25 | 1511.94 | 437.75 | 106.10 | 3010.97 | 90.33 | 3101.30 | 2400.00 | 701.30 | 701.30 |
| 2025-0002 | A2 Meier | 92.76 | 113.06 | 388.84 | 1020.90 | 261.77 | 63.45 | 1940.78 | 58.22 | 1999.00 | 1320.00 | 679.00 | 679.00 |
| 2025-0003 | A2 Brunner | 0.00 | 114.94 | 395.29 | 802.32 | 266.11 | 64.50 | 1643.16 | 49.29 | 1692.45 | 1440.00 | 252.45 | 252.45 |
| 2025-0004 | B2 Bernasconi | 107.47 | 228.00 | 908.44 | 2112.27 | 611.56 | 148.23 | 4115.97 | 102.90 | 4218.87 | 3120.00 | 1098.87 | 1098.85 (Rundung −0.02) |

Alle Werte meiner Rechnung sind gleich den Spalten `line_items.tenant_share`, `apartment_share`, `total_amount`, `utility_statements.management_fee`, `total_costs`, `total_advance_payments`, `balance`. Gebäudekosten je Position (Heizung 7115.00 = 1520 + 790 + 395 + 1410 + 3000; Gartenpflege 362.00 = 730.00 × 181/365; Hauswart 3060.00; Kaltwasser 2060.00; Allgemeinstrom 499.30; TV 912.00) ebenso. Gespeicherte Tankbestände der vier Entwürfe: keine (`fuel_stock` leer), also keine Zeile «Veränderung Tankbestand», richtig.

## PDF und Web

- `after-meier.pdf` und `after-brunner.pdf` sind **byte-gleich** mit `utility_statements.pdf_blob` von -0002 und -0003 (`cmp`). Text Position für Position gelesen: alle Beträge der Kostenübersicht, Zwischensumme, Pauschale, «Ihre Nebenkosten», Akonto (6 Monate × 220.00 bzw. 240.00), Nachzahlung (679.00 / 252.45), die Heizprofil-Anteile je Rechnung (37.20 % / 37.20 %, 18.60 % / 18.60 %, 11.00 % …, 55.80 % bzw. 44.20 % für die Lieferung) und die Formel «1'823.22 × Zeitanteil (…) / 7'115.00 = 1'020.90» bzw. «= 802.32» stimmen mit meiner Rechnung überein. Die Lieferung steht als «Rechnung vom 02.06.2025, Lieferung in den Tank, gilt für die ganze Abrechnungsperiode».
- Weboberfläche `/statements/<id>` mit Cookie, Sprachen de, fr, it, en, alle vier Entwürfe (Skripte `dp1474-webcheck.py`, `dp1474-webcheck2.py`): jede gespeicherte Summe (Gebäudekosten, Wohnungsanteil, Ihr Anteil jeder Position, Zwischensumme, Pauschale, Nebenkosten, Akonto, Saldo) kommt in allen 16 Seiten vor (0 fehlend). Für -0004: «Nachzahlung vor Rundung CHF 1'098.87, Rundung auf 5 Rappen − CHF 0.02, Saldo CHF 1'098.85». Prozentwerte (z. B. 14.35 %, 12.40 %, 25.62 %) stimmen mit Betrag / Gebäudekosten überein. Die Lieferungszeile lautet in fr «Livraison dans la citerne, valable pour toute la période de décompte», it «Fornitura nel serbatoio, vale per l'intero periodo di conteggio», en «Delivery into the tank, applies to the whole billing period».

## QR-Rechnung (Meier -0002, Brunner -0003)

Seite 3 gerendert (`pdftoppm -png`, `.../scratchpad/dp1474-out/qr-0002-3.png`, `qr-0003-3.png`). Den QR-Code selbst konnte ich nicht dekodieren (siehe «Nicht bestätigt»). Geprüft habe ich den gedruckten Zahlteil und die gespeicherten Felder (Skript `dp1474-qrcheck.py`):

- IBAN CH44 3199 9123 0008 8901 2: Prüfsumme Modulo 97 gültig, IID 31999 liegt im QR-IBAN-Bereich, also ist eine QR-Referenz richtig.
- Referenz -0002: 00 81895 34835 85583 98418 18420, Prüfziffer 0 = berechnet 0 (Modulo 10 rekursiv). Referenz -0003: 00 51900 46671 57329 07731 33916, Prüfziffer 6 = berechnet 6. Beide stimmen mit `qr_bill_reference` überein.
- Betrag Zahlteil und Empfangsschein: CHF 679.00 bzw. 252.45 (gleich Saldo). Zusätzliche Informationen «Nebenkostenabrechnung NK-22222222-2025-000x». Zahlbar durch: Sarah Meier, Hirschmattstrasse 21, 6003 Luzern; Nina Brunner, Seeweg 15, 6003 Luzern (gleich Mieterdaten).

## Nicht bestätigt

1. **Inhalt der QR-Codes** (IBAN, Betrag, Referenz, Mitteilung, Zahlungspflichtiger im Datenfeld): Auf dem System steht kein QR-Dekoder (`zbarimg`, `cv2`, `pyzbar` fehlen), und Installieren war nicht erlaubt. Nur gedruckter Text und gespeicherte Referenz sind geprüft (oben). Gesucht in `which zbarimg`, Python-Module, den PDFs. Bitte einen Dekoder im Scratchpad der nächsten Runde erlauben oder mit dem Handy prüfen.
2. **PDF von -0001 (Weber, de) und -0004 (Bernasconi, Sprache it):** Beides sind Entwürfe ohne gespeichertes PDF (`pdf_blob` leer); ein GET auf `/statements/<id>/pdf` erzeugt es neu und schreibt `pdf_blob`, das wäre eine Datenänderung. Darum sind nur ihre Weboberfläche und Datenbankwerte geprüft. Damit ist auch das **italienische PDF** (und sein Hinweistext zur Lieferung) nicht gesehen. Französische und englische PDFs gibt es in Seepark nicht (kein Mieter mit dieser Sprache, `tenants.language`: de, de, de, it); die Texte sind nur in der Weboberfläche gesehen.
3. **Punkt 2 der Änderung (Schlüssel der «Veränderung Tankbestand» nach dem Liefertag):** Kein Datensatz der Demodaten übt ihn aus. `fuel_stocks` hat nur Alpenblick und Musterhaus Zentrum (je 2023-12-31, 2024-12-31, 2025-12-31); deren Heizöl-Rechnungen haben keinen Leistungszeitraum (Rechnungsdatum 2024-08-20, 2025-08-25 bzw. 2024-09-18, 2025-09-22), Liefertag und Rechnungsdatum sind also gleich. Seepark hat keinen Tankbestand und damit keine Veränderung. Abfrage: `select b.name, i.invoice_date, i.service_period_start, i.service_period_end from invoices i join buildings b on b.id=i.building_id join categories c on c.id=i.category_id where c.is_fuel and b.id<>'2222…'`. Die bestehenden Entwürfe dieser beiden Gebäude wurden nicht neu berechnet, ich habe sie nicht nachgerechnet.
4. **Liefertag in einer anderen Periode als das Rechnungsdatum:** Rechnungsdatum 2025-06-02 und Liefertag 2025-05-15 liegen beide in 2025; die Regel «zählt in der Periode des Liefertags» ist mit diesem Datensatz nicht von «Rechnungsdatum» zu unterscheiden. Nur die Wirkung «ganze Periode statt ein Tag» ist bestätigt.

Geprüft: Rechnung cf25aa62-8553-4491-ba9d-dedeb5eaecbd und alle 2025-Rechnungen von Seepark Residenz; NK-22222222-2025-0001, -0002, -0003, -0004 (alle sechs Positionen, Wohnungsanteil, Zeitanteil, Verwaltungspauschale, Akonto, Saldo und Rundung auf 5 Rappen, Heizprofil-Anteile); Web in de/fr/it/en für alle vier; PDFs after-meier.pdf und after-brunner.pdf (Text, Zahlteil, Referenz mit Prüfziffer, IBAN, Zahlungspflichtiger, Betrag).
