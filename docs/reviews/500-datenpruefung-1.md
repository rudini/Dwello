# Datenprüfung #500: Stockwerk nur einmal im Abrechnungs-PDF (Commit e214aa7)

Geprüft im Worktree `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/review-500-daten`, App auf :3300/:3301 mit `dwello_persona`. In `dwello_persona` wurde nichts geschrieben (`max(updated_at)` bleibt 16:41:07, 17 Abrechnungen). Die PDFs erzeugte ich in-process aus einer Kopie der Datenbank (`dwello_review500`, nach der Prüfung gelöscht). Die gespeicherten PDFs und die Web-Seiten las ich mit dem Persona-Kit-Cookie.

## Ergebnis

Keine Befunde. Die Wohnungszeile ist wie verlangt. Gegenüber dem Vorgänger-Commit (e214aa7~1) ändert sich in 12 PDFs genau eine Textzeile, und die QR-Rechnung ist unverändert. Alle Beträge stimmen auf den Rappen mit meiner eigenen Rechnung überein.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine) | – | – | – | – |

Hinweise ohne Befund stehen unten unter «Beobachtungen».

## 1. Wohnungszeile

PDF-Text mit `pdftotext -layout`, Zeile unter «Gebäude». «Neu» ist der Stand e214aa7, «Alt» der Stand e214aa7~1. Für «Alt» kopierte ich `backend/src` in den Scratchpad und ersetzte nur `pdf.service.ts` durch die Fassung des Vorgängers.

| Abrechnung | Sprache | Alt | Neu | Erwartet |
|---|---|---|---|---|
| NK-33333333-2024-0001, Alpenblick EG (Laura Keller) | de | `Wohnung EG, EG, 72.00 m²` | `Wohnung EG, 72.00 m²` | ok |
| dieselbe | fr | `Appartement EG, rez-de-chaussée, 72.00 m²` | unverändert | ok (siehe Beobachtung 1) |
| dieselbe | it | `Appartamento EG, pianterreno, 72.00 m²` | unverändert | ok |
| dieselbe | en | `Apartment EG, ground floor, 72.00 m²` | unverändert | ok |
| NK-11111111-2025-0001, Musterhaus Zentrum 1.01 (Hans Müller) | de | `Wohnung 1.01, 1. OG, 75.50 m²` | gleich | ok |
| dieselbe | fr / it / en | `Appartement 1.01, 1er étage, …` / `Appartamento 1.01, 1° piano, …` / `Apartment 1.01, 1st floor, …` | gleich | ok |
| NK-11111111-2024-0001, Hans Müller 2024 | de/fr/it/en | – | Text identisch zu Alt | ok |

Nichts anderes hat sich geändert. Ich verglich den PDF-Text von 12 Dateien (Laura, Hans 2025 und Hans 2024, je de/fr/it/en) zwischen Alt und Neu mit `diff`. Ergebnis: 0 Zeilen Unterschied ausser `laura-de` mit genau den zwei Zeilen `< Wohnung EG, EG, 72.00 m²` und `> Wohnung EG, 72.00 m²`. Die QR-Codes von Hans 2025 (de/fr/it/en) sind in Alt und Neu bytegleich (siehe 3).

Das gespeicherte PDF der Web-Seite (`GET /api/statements/<id>/pdf` über :3300) ist bytegleich zum `pdf_blob` der Datenbank. Für Laura und Hans enthält es dieselbe Wohnungszeile wie mein Neu-Render. Es wurde beim Start des Stacks mit dem neuen Code erzeugt (`pdf_generated_at` 16:41:05).

## 2. Beträge, eigene Neuberechnung

Skript: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/recompute500.py`, Ausgabe: `.../recompute500.out`. Ich rechne aus den Rohdaten der DB und benutze keinen Dwello-Code. Eingaben: Rechnungen des Gebäudes in der Periode (umlagefähig, vereinbarte Kategorien), Verteilschlüssel-Formeln, Wohnungsflächen und -anzahl, Tankbestände, Akonto, Mietvertrag und Verwaltungspauschale 3 %. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Thema 8, 9, 12) und `UBIQUITOUS_LANGUAGE.md`: Wohnungsanteil auf Rappen gerundet, Ihr Anteil = Wohnungsanteil × Zeitanteil, Saldo zugunsten des Mieters auf 5 Rappen (Nachzahlung ab-, Rückerstattung aufgerundet).

**NK-33333333-2024-0001, Laura Keller (EG, 366/366 Tage)**

| Position | Eigene Rechnung | Gespeichert / PDF / Web |
|---|---|---|
| Schneeräumung 860.00 + 410.00 = 1'270.00 × 72/255 | 358.59 | 358.59 |
| Allgemeinstrom 178.40 + 191.20 = 369.60 | 104.36 | 104.36 |
| Kaltwasser 460 + 475 = 935.00 | 264.00 | 264.00 |
| Heizung: 1'536.00 + 5'120.00 – 1'792.00 = 4'864.00 | 1'373.36 | 1'373.36 |
| Kaminfeger 290.00 | 81.88 | 81.88 |
| Zwischensumme | 2'182.19 | 2'182.19 |
| Verwaltungspauschale 3 % | 65.47 | 65.47 |
| Ihre Nebenkosten | 2'247.66 | 2'247.66 |
| Akonto 12 × 190.00 | 2'280.00 | 2'280.00 |
| Saldo vor Rundung | –32.34 | –32.34 |
| Rundung auf 5 Rappen | +0.01 | +0.01 |
| Saldo (Rückerstattung) | –32.35 | –32.35 |

**NK-11111111-2025-0001, Hans Müller (1.01, 365/365 Tage)**

| Position | Eigene Rechnung | Gespeichert / PDF / Web |
|---|---|---|
| Lift 1'690.00 × 1/6 | 281.67 | 281.67 |
| Hauswart 3'680.00 × 75.5/492.5 | 564.14 | 564.14 |
| Kaltwasser 3'840.00 | 588.67 | 588.67 |
| Allgemeinstrom 762.80 | 116.94 | 116.94 |
| Gartenpflege 935.00 | 143.34 | 143.34 |
| Kehricht 990.00 × 1/6 | 165.00 | 165.00 |
| Heizung: 2'650.00 + 6'565.00 – 2'257.20 = 6'957.80, Schlüssel 70 % Fläche / 30 % Einheit | 1'094.53 | 1'094.53 |
| Kaminfeger 335.00 | 51.36 | 51.36 |
| Zwischensumme | 3'005.65 | 3'005.65 |
| Verwaltungspauschale 3 % | 90.17 | 90.17 |
| Ihre Nebenkosten | 3'095.82 | 3'095.82 |
| Akonto 12 × 240.00 | 2'880.00 | 2'880.00 |
| Saldo vor Rundung | 215.82 | 215.82 |
| Rundung auf 5 Rappen | –0.02 | –0.02 |
| Saldo (Nachzahlung) | 215.80 | 215.80 |

Das Skript meldet für beide `RESULT PASS`. Alle Werte stehen so im PDF-Text (de) und auf der Web-Seite `/statements/<id>`. Die Web-Seite zeigt «Wohnung EG» ohne Stockwerk; dieser Ort gehört nicht zur Änderung.

## 3. QR-Rechnungen

Zahlteil-Seite mit `pdftoppm -png -r 300` gerendert und mit zxing-cpp (venv im Scratchpad: `.../venv500`, Skript `.../decode500.py`) dekodiert, Rohausgabe in `.../qr500.out`.

| Abrechnung | Zahlteil | Ergebnis |
|---|---|---|
| NK-11111111-2025-0001 (Hans Müller, Nachzahlung 215.80) | ja, Seite 3 (de), Seite 2 (fr) | Kontrolle bestanden, Details unten |
| NK-33333333-2024-0001 (Laura, Rückerstattung) | kein QR | richtig: bei einer Rückerstattung kein Zahlteil (Anforderungen Zeile «Pflichtangaben Zahlteil») |
| NK-11111111-2024-0001 (Hans 2024, bezahlt, 72.55) | kein QR gefunden | Zahlteil bei bezahlter Abrechnung nicht erwartet; nicht weiter geprüft |

Dekodierte Nutzlast für Hans 2025:

- IBAN `CH4431999123000889012`. Prüfsumme mod 97 = 1 (gültig), IID 31999, also eine QR-IBAN. Das passt zu «QRR».
- Gläubiger: Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. Stimmt mit der `configuration`-Tabelle überein.
- Betrag `215.80`, Währung CHF. Gleich dem Saldo.
- Referenztyp `QRR`, Referenz `002311877285508748922389033`. Ich berechnete sie unabhängig: die ersten 20 Hex-Zeichen der Abrechnungs-ID (`30f4b63d97f04...`) als Dezimalzahl, auf 26 Stellen aufgefüllt, plus Prüfziffer mod-10 rekursiv. Ergebnis `…033` stimmt. Prüfziffer 3 stimmt auch mit der Prüfziffer in der Nutzlast überein. Auch `qr_bill_reference` in der DB ist gleich.
- Zahlungspflichtiger: Hans Müller, Bahnhofstrasse 42, 8001 Zürich, CH. Gleich dem Mieter in der DB.
- Zusätzliche Information: de «Nebenkostenabrechnung NK-11111111-2025-0001», fr «Décompte des charges …», it «Conteggio spese accessorie …», en «Utility Cost Statement …», Trailer `EPD`.

Die Nutzlast ist in de, fr, it und en für Alt und Neu bytegleich (Vergleich je Sprache `new==base True`). Auch das gespeicherte Web-PDF liefert dieselbe Nutzlast.

Reproduzieren:

```
cd /tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad
python3 -I recompute500.py fd93237e-0e26-4197-9645-f357110e8670 30f4b63d-97f0-4b2c-8037-bae3fa023b89
pdftoppm -png -r 300 out500/hans-de.pdf qr500/x && venv500/bin/python decode500.py qr500
```

`render500.ts` und `render500-base.ts` erzeugten die PDFs, `jwt500.mjs` das Cookie für die Web-Seite.

## Geprüft und bestanden

- Alpenblick EG (Etage 0), Laura Keller, NK-33333333-2024-0001: Wohnungszeile in 4 Sprachen, Beträge, Referenz, kein Zahlteil.
- Musterhaus Zentrum 1.01, Hans Müller, NK-11111111-2025-0001: Wohnungszeile in 4 Sprachen, Beträge, QR-Rechnung vollständig.
- Musterhaus Zentrum 1.01, Hans Müller 2024, NK-11111111-2024-0001: Text in 4 Sprachen unverändert gegenüber dem Vorgänger.
- Vergleich Alt gegen Neu der 12 gerenderten PDFs: genau 1 Zeile geändert.
- Gespeichertes PDF (Web-Download) gegen `pdf_blob`: bytegleich.

## Beobachtungen (kein Befund, nicht durch die Änderung verursacht)

1. fr/it/en drucken bei Nummer «EG» weiterhin «Appartement EG, rez-de-chaussée». Das ist gewollt: Der Test `statement-pdf-render.test.ts` (Zeilen 78–95) legt es so fest («in another language the floor's own name says what «EG» means»). Die Behauptung des Auftrags («Wohnung EG, 72.00 m²») gilt für Deutsch.
2. Das gespeicherte PDF von Laura (Status «Bezahlt», Web-Download) enthält noch «Wir überweisen Ihnen den Betrag bis 14.05.2025 …». Mein frischer Render zeigt «Überwiesen am 05.05.2025.». Ursache: Der Demo-Seed erzeugte das PDF um 16:41:05.779 und markierte die Abrechnung erst um 16:41:05.795 als bezahlt. Es hängt nicht von #500 ab, ist ein Seed-Artefakt der Demo-Daten, und alle Beträge sind gleich. Nit, nur für Personas relevant, die dieses PDF lesen.
3. Seepark Residenz A1/A2 (Etage 0, Nummern «A1», «A2») habe ich nicht gerendert. Sie gehören nach der Regel nicht zu «EG…» und behalten ihre Etage.

## Nicht bestätigt

- Die Anzeige in der Vorschau des PDFs im Browser (Viewer) habe ich nicht geprüft. Ich prüfte das Web-Seitentext und den PDF-Download, nicht die Darstellung im Browser.
- Die Darstellung des Zahlteils (Schnittlinien, Schriftgrössen nach SIX) habe ich nicht geprüft, nur den dekodierten Inhalt.
- Nicht gerendert: Abrechnungen von Seepark Residenz, die übrigen Musterhaus-Abrechnungen, Alpenblick OG1 (Kevin Fischer) und die Entwürfe. Sie gehören nicht zu den benannten Datensätzen.
- Hans 2024 (NK-11111111-2024-0001): Beträge nicht neu gerechnet, nur der Text ist gegen den Vorgänger verglichen. Es ist eine bezahlte Abrechnung mit 72.55 und gehört nicht zu den benannten Datensätzen.
