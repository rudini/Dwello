# Datenprüfung #1301, Runde 1 (Commit 83ecc9e)

Gegenstand: Abrechnung NK-22222222-2025-0004 (Marco Bernasconi, B2, Seepark Residenz, id 107aba2c-6983-4f90-9de6-d7dbe1a2d787), Entwurf, nach «Neu berechnen» durch Dr. Weber. Die Eingaben habe ich aus der Datenbank `dwello_persona` gelesen und mit einem eigenen Skript nachgerechnet (Python, `Decimal`, kein Code von Dwello): `/tmp/claude-0/-home-user-Dwello/1ad65ad5-87c1-5abb-b07a-cdb69a083791/scratchpad/r1301/recompute.py`. Die Regeln habe ich aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1, 3, 5, 8, 9), `UBIQUITOUS_LANGUAGE.md` und dem Issue #1301 / #1284 abgeleitet.

## Ergebnis

Keine Befunde. Jede Position, jeder Zeitraum, jeder Bruch, die Zwischensumme, die Verwaltungspauschale, der Saldo mit Rundung und der Betrag der QR-Rechnung stimmen auf den Rappen mit dem gespeicherten Wert, der Webseite (de, fr, it, en) und dem italienischen PDF überein.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | – |

Geprüft: NK-22222222-2025-0004 (alle sechs Positionen mit je zwei Zeiträumen bzw. einem Zeitraum bei Gartenpflege, Zwischensumme, Verwaltungspauschale, Akonto, Saldo, Rundung, Webseite de/fr/it/en, PDF it, QR-Rechnung); NK-22222222-2025-0001 bis -0003 nur auf «veraltet» (siehe unten).

## Nachrechnung (Eingaben aus der Datenbank)

- Periode 01.01.2025 – 31.12.2025, Mietvertrag seit 01.07.2023, ohne Ende: 365 Mietstage (gespeichert 365).
- Teilung am 01.07.2025: B1 «Aufgehoben ab» 01.07.2025, B2 `earlier_sizes = [{until 2025-06-30, area 95.00, rooms 4.5}]`, jetzt 170.00 m² / 6.5 Zimmer. Zeitraum 1: 01.01.–30.06. (181 Tage), 4 Wohnungen, Fläche 68 + 82 + 75 + 95 = 320, Zimmer 14.5. Zeitraum 2: 01.07.–31.12. (184 Tage), 3 Wohnungen (B1 zählt nicht mehr), Fläche 68 + 82 + 170 = 320, Zimmer 13. Das stimmt mit `key_values` und `segments[].keyValues` überein.
- Rechnungen ohne Leistungszeitraum zählen für die ganze Periode, wenn ihr Rechnungsdatum in der Periode liegt (Regel 1). Das Gartenpflege-Abo (730.00 für 01.07.2024–30.06.2025) zählt mit 181/365 = 362.00. Die Fernwärme-Quartale haben einen Leistungszeitraum und liegen ganz in einem der beiden Zeiträume. Der Mieter mietet die ganze Periode, daher Zeitanteil 181/181 und 184/184.
- Kosten eines Zeitraums = Summe der Rechnungen nach ihren Tagen darin, danach auf den Rappen gerundet; Wohnungsanteil = Kosten × Einheiten / Gesamteinheiten, wieder gerundet; Position = Summe der Zeiträume.

| Position (Schlüssel) | Zeitraum 1: Kosten, Bruch, Anteil | Zeitraum 2: Kosten, Bruch, Anteil | Position | Gespeichert, Seite, PDF |
|---|---|---|---|---|
| Gartenpflege (Fläche) | 362.00, 95/320, 107.47 | keine Kosten, kein Zeitraum | 107.47 | gleich |
| TV/Kabel (Einheit) | 452.25, 1/4, 113.06 | 459.75, 1/3, 153.25 | 266.31 | gleich |
| Hauswart (Fläche) | 1'517.42, 95/320, 450.48 | 1'542.58, 170/320, 819.50 | 1'269.98 | gleich |
| Heizung (Fläche) | 2'310.00, 95/320, 685.78 | 1'805.00, 170/320, 958.91 | 1'644.69 | gleich |
| Kaltwasser (Fläche) | 1'021.53, 95/320, 303.27 | 1'038.47, 170/320, 551.69 | 854.96 | gleich |
| Allgemeinstrom (Fläche) | 247.60, 95/320, 73.51 | 251.70, 170/320, 133.72 | 207.23 | gleich |

- Zwischensumme 4'350.64; Verwaltungspauschale 2.5 % = 108.766 → 108.77; Ihre Nebenkosten 4'459.41 (gespeichert `total_costs` 4459.41).
- Akonto 12 × 260.00 = 3'120.00; Saldo vor Rundung 1'339.41; Nachzahlung wird zugunsten des Mieters abgerundet: –0.01 → 1'339.40 (gespeichert `balance` 1339.40, PDF und Seite gleich).
- `profileShare` der Heizung (56.14 % / 43.86 %) = 2'310 / 4'115 und 1'805 / 4'115, wie gedruckt. Prozentwerte «Anteil» der Seite (29.69, 29.20, 41.50, 39.97, 41.50, 41.50) = Wohnungsanteil / Kosten, nachgerechnet.
- Skriptausgabe (Auszug): `Zwischensumme 4350.64`, `Verwaltungspauschale 108.77`, `Ihre Nebenkosten 4459.41`, `Saldo vor Rundung 1339.41`, `Saldo gerundet 1339.4`. Reproduzieren: `python3 -I /tmp/claude-0/-home-user-Dwello/1ad65ad5-87c1-5abb-b07a-cdb69a083791/scratchpad/r1301/recompute.py`.

## Webseite

`GET http://localhost:3300/statements/107aba2c-…` mit Sitzungs-Cookie in den vier Sprachen (Textauszüge `page_de.txt` usw. in `…/r1301/`): Beträge, Prozentwerte, Zwischensumme, Pauschale, Rundung und Saldo sind in allen vier Sprachen gleich und entsprechen der Nachrechnung. Die zwei Hinweise («Wohnung B1 gibt es ab 01.07.2025 nicht mehr …», «Wohnung B2 hat ab 01.07.2025 eine andere Fläche oder Zimmeranzahl …») stehen in de, fr, it und en mit dem Wortlaut des Fachreviews.

## PDF (Italienisch, Sprache des Mieters)

Das PDF, das Dr. Weber erstellt hat (Blob aus der Datenbank, vor meinem Abruf gesichert als `…/r1301/st4.pdf`), druckt für alle sechs Positionen genau die Zeilen der Tabelle oben, z. B. «01.07.2025 – 31.12.2025, 3 appartamenti: 170.00 / 320.00 m² × CHF 1'542.58 = CHF 819.50 × 184/184 giorni = CHF 819.50». Zwischensumme, Spese amministrative, Acconti, «Importo dovuto prima dell'arrotondamento 1'339.41», «Arrotondamento a 5 centesimi – 0.01» und «Importo dovuto 1'339.40» stimmen. Die Einleitungen (B1 nicht mehr, B2 hat dal 01.07.2025 170.00 m² und 6.5 locali, fino al 30.06.2025 95.00 m² und 4.5 locali) und der Satz «Sotto le voci … per periodo» stehen einmal und wie im Fachreview (V-4). Die Zimmeranzahl 6.5 ist der bekannte, in Behebung stehende Befund und zählt hier nicht.

## QR-Rechnung

Seite 3 mit `pdftoppm -png -r 300` gerendert, mit zxing-cpp 3.1.1 (in `…/r1301/pylib`, Skript `dec.py`) entschlüsselt. Inhalt: `SPC 0200 1`, IBAN `CH4431999123000889012` (QR-IBAN, IID 31999; Prüfsumme mod 97 und `stdnum.iban` gültig; gleich `configuration.iban`), Zahlungsempfänger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH (gleich `configuration.company_*`), Betrag `1339.40` CHF, Zahlungspflichtiger Marco Bernasconi, Seeweg 15, 6003 Luzern, CH, Referenztyp `QRR`, Referenz `000778217817163096150911741` (27 Stellen, Prüfziffer 1 gültig laut `stdnum.ch.esr`, gleich `qr_bill_reference`), Mitteilung «Conteggio spese accessorie NK-22222222-2025-0004», `EPD`. Der gedruckte Betrag (1 339.40) und die gedruckte Referenz stimmen mit dem QR-Inhalt überein. Dasselbe gilt für das neu erzeugte PDF (siehe «Nebenwirkung»).

## Die anderen Entwürfe (nur: veraltet?)

Mit der neuen Regel nachgerechnet, ohne Heizprofil-Feinheiten bei Teilmietdauer (Heizung dort gleich geblieben):

- NK-22222222-2025-0001 (A1): **veraltet**. TV/Kabel 228.00 gespeichert, neu 266.31 (113.06 + 153.25 mit 1/4 und 1/3 je Zeitraum); Allgemeinstrom 106.10 gespeichert, neu 106.11. Die Abrechnung zeigt keine Zeiträume (`segments` leer).
- NK-22222222-2025-0003 (A2, 01.07.–31.12.): **veraltet**. TV/Kabel 114.94 gespeichert (459.75 / 4), neu 153.25 (459.75 / 3, B1 zählt ab 01.07. nicht mehr).
- NK-22222222-2025-0002 (A2, 01.01.–30.06.): Beträge unverändert, nicht veraltet.

## Nebenwirkung meiner Prüfung

Mein Abruf von `GET /api/v1/statements/107aba2c-…/pdf` hat das PDF neu erzeugt und in der Datenbank gespeichert (`pdf_generated_at` 2026-11-08 21:03:41, vorher 20:59:04; Länge gleich). Der Text ist laut `pdftotext` zeilengleich zum vorherigen PDF, die Bytes unterscheiden sich (Zeitstempel). Sonst habe ich keine Daten geändert. Der Abruf einer Abrechnung als PDF schreibt also in die Datenbank; das gilt auch für den GET durch andere Personas.

## Nicht bestätigt

- **PDF auf Deutsch, Französisch, Englisch:** Der Mieter ist Italiener, nur dieses PDF existiert. Ein weiteres PDF zu erzeugen hätte Daten geändert. Ich habe stattdessen die Texte `sizeChangeIntro`, `segmentIntro`, `segmentNote`, `keyShareSegments`, `segmentLine*` in `backend/src/services/pdf-texts/{de,fr,it,en}.ts` (Worktree) mit dem Wortlaut des Fachreviews 1301-1 verglichen: sie stimmen überein. Die Beträge sind sprachunabhängig. Wie die Zeilen in diesen Sprachen umbrechen und ob die Zahlen dort auf der Seite stehen, habe ich nicht gesehen.
- **Rundung je Rechnung statt je Position:** Die Anforderung sagt «jede Rechnung nach ihren Tagen» und «je Zeitraum auf den Rappen, wie gedruckt», nicht, ob zuerst jede Rechnung oder erst die Summe der Position gerundet wird. Ich habe die Summe gerundet (Regel 5, #237: «Betrag × Anteil», Summe zuletzt). Würde je Rechnung gerundet, wären die Kosten des Zeitraums 1 beim Hauswart 1'517.44 statt 1'517.42 und beim Kaltwasser 1'021.52 statt 1'021.53. Die Wohnungsanteile blieben bei Hauswart (450.49 statt 450.48 im Zeitraum 1, 819.49 statt 819.50 im Zeitraum 2: Summe gleich 1'269.98) und könnten sich in anderen Fällen um einen Rappen unterscheiden. Eine Entscheidung dazu habe ich in den gelesenen Dokumenten nicht gefunden.
- **Heizprofil bei Rechnungen über den Schnitttag hinweg:** Alle Fernwärme-Rechnungen enden am 30.06. oder beginnen am 01.07. Der Fall «Heizrechnung über den Schnitttag, Kosten nach Monaten des Heizprofils» (Fachreview 1284-1 V-3) kommt in diesem Datensatz nicht vor. Ich habe ihn nicht geprüft.
- **Schnitt mitten im Mietverhältnis:** Mieterwechsel im zweiten Zeitraum, Schnitt am ersten Mietstag und Schnitt am Tag nach dem Auszug sind in NK-22222222-2025-0004 nicht vorhanden. Die Beträge der Szenarien in `tests/e2e/features/apartment-size-from-day.feature` (Lindenhof) habe ich nicht gegengerechnet.
- **Kopfzeile des PDF:** «Appartamento B2, 1° piano, 170.00 m²» druckt die heutige Fläche, die Abrechnung rechnet im ersten Halbjahr mit 95.00 m². Die Einleitung auf Seite 1 erklärt es. Ich werte es nicht als Fehler.
