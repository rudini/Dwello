# Datenprüfung #1311/#1312 «Aufgehobene Wohnung», Runde 1

Worktree `/tmp/claude-0/-home-user-Dwello/9491f89b-e3dd-58ae-af29-e047f9ed5a53/scratchpad/review-1311-daten` (Commit a1f4b8f). Datenbank `dwello_persona`: nur gelesen (psql-Abfragen, GET auf :3300/:3301). Zum Schluss unverändert: `max(utility_statements.updated_at)` = 21:19:02 (das PDF der Persona), 19 Abrechnungen, `audit_log` leer.

Eigene Rechnung: `/tmp/claude-0/-home-user-Dwello/9491f89b-e3dd-58ae-af29-e047f9ed5a53/scratchpad/dp1311/recompute.py` (liest Wohnungen, Rechnungen, Tankbestände, Heizprofil per `psql`; keine Dwello-Rechenlogik). Aufruf `python3 -I recompute.py`. Weitere Skripte im selben Ordner: `pdfcheck.py` (PDF-Zahlen), `nums.py` (Zahlen je Sprache), `qrall.py` (QR-Rechnungen), `whatif.py` (Rechnungen mit Leistungszeitraum, nur Rechnung, keine Daten geändert).

## Ergebnis

Alle Beträge der beiden Entwürfe, das PDF von 0001 (Persona-Kopie und alle vier Sprachen), die QR-Rechnungen, die Mietstatus-Zahlen und der Datenexport stimmen. Jeder Satz des neuen PDF-Satzes ist für diese Datensätze wahr. Kein Blocker, kein Major. Zwei Minor (D-1 neu, D-2 schon aus #1284 bekannt).

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | Übersicht (`/dashboard`), Karte «Gebäude und Wohnungen», und `GET /api/v1/dashboard` → `portfolio`, auf a1f4b8f | Die Zahlen gehen auf, wie es die Gebäudeseite seit der Korrektur C-1 tut: Wohnungen = vermietet + vermietet ab + leer + gesperrt (+ aufgehoben), oder die aufgehobenen stehen nicht in «Wohnungen». | «13 Wohnungen», darunter 9 vermietet, 0 vermietet ab, 2 leer, 0 gesperrt = 11. Die zwei aufgehobenen Wohnungen (Alpenblick 2.01, Seepark B1) haben keine Kachel. Das API gibt ausserdem `occupancyRate` 69.2 (9/13) neben den Gebäudezeilen, die sie auslassen (4/6, 3/3, 2/2 = 9/11 = 81.8 %); die Quote zeigt die Oberfläche nicht. Der pg-Test «zählt eine aufgehobene Wohnung in der Belegung der Übersicht nicht, bei den Wohnungen schon» legt die 13 mit Absicht fest (gleich wie die Liste, «Wohnungen 1–12 von 13»); es geht um die Summe der Kacheln, nicht um die Zahl. |
| D-2 | Minor (nicht neu: #1284 D-1 und D-2, auf a1f4b8f unverändert) | Detailseite von NK-33333333-2025-0001 und -0002, Zeile «Heizprofil» (de/fr/it/en); PDF 0001 und 0002, Heizungszeilen | Die Seite sagt nicht «nicht angewendet», denn das Heizprofil bestimmt die Kosten der Zeiträume (55.80 % / 44.20 %); das PDF nennt Name und Quelle des Heizprofils. | Seite: «Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)». PDF: nur «55.80 % der Heizkosten nach Heizprofil», ohne Name, Monate und Quelle. Betrag nicht betroffen. |

### Belege und Reproduktion

**D-1.** Frontend aus dem Worktree gebaut und gegen eine Kopie der Datenbank mit dem Backend aus dem Worktree betrieben (siehe «Nicht bestätigt», Punkt 1). Seite: `curl -s -L -b "dwello_session=<Token>; dwello_xsrf=x; PARAGLIDE_LOCALE=de" <Frontend>/dashboard`, Textauszug: `13|Wohnungen|9|Vermietet|0|Vermietet ab …|2|Leer|0|Gesperrt`. API: `{'totalApartments': 13, 'occupiedApartments': 9, 'vacantApartments': 2, 'reletApartments': 0, 'reservedApartments': 0, 'occupancyRate': 69.2}`; `buildingOccupancy` Musterhaus 6/4, Seepark 3/3, Alpenblick 2/2. Datenbank: `select b.name, a.number, a.discontinued_from from apartments a join buildings b on b.id=a.building_id where a.discontinued_from is not null` → Alpenblick 2.01 (2025-07-01), Seepark Residenz B1 (2026-04-01). Quelle im Code: `backend/src/routes/dashboard.ts`, `portfolio()` zählt mit `countApartments()` ohne `existing`.

**D-2.** `select heating_share from utility_statements where statement_number='NK-33333333-2025-0001'` → `{"byDays": true, "reason": "wholePeriod", "names": {…"Heizung + Warmwasser"…}}`; `select segments from utility_statement_line_items …` → `profileShare` 55.8 und 44.2. PDF: `pdftotext -layout` des gespeicherten PDFs, `grep -i heizprofil` trifft nur «55.80 % der Heizkosten nach Heizprofil» und «Anteil nach Heizprofil 100.00 %». Ohne Heizprofil wären es Tage (181/365, 184/365) und andere Beträge.

## Nachrechnung (Alpenblick 2025)

Eingaben aus der Datenbank: Wohnungen 0.01 (72 m²), 1.01 (98 m²), 2.01 (85 m², aufgehoben ab 01.07.2025; kein Mietvertrag), Verteilschlüssel «Pro Fläche» für alle 14 Rechnungen, keine Rechnung mit Leistungszeitraum. Zeiträume 01.01.–30.06. (181 Tage, 3 Wohnungen, 255 m²) und 01.07.–31.12. (184 Tage, 2 Wohnungen, 170 m²). Heizung: 1’792.00 (Bestand 31.12.2024) + 4’880.00 – 1’494.00 = 5’178.00, Heizprofil «Heizung + Warmwasser» Jan–Jun 55.8 %, Jul–Dez 44.2 %. Kosten je Zeitraum: Betrag × Tage/365 (Heizung: × Profilanteil), je Zeitraum auf Rappen gerundet; Wohnungsanteil = Fläche / Fläche der Wohnungen im Zeitraum, gerundet.

| Position | Kosten Zeitraum 1 / 2 | Anteil 0.01 (Laura) | Anteil 1.01 (Kevin) |
|---|---|---|---|
| Schneeräumung 1’300.00 | 644.66 / 655.34 | 182.02 + 277.56 = 459.58 | 247.75 + 377.78 = 625.53 |
| Allgemeinstrom 378.90 | 187.89 / 191.01 | 53.05 + 80.90 = 133.95 | 72.21 + 110.11 = 182.32 |
| Kaltwasser 470.00 | 233.07 / 236.93 | 65.81 + 100.35 = 166.16 | 89.57 + 136.58 = 226.15 |
| Heizung 5’178.00 | 2’889.32 / 2’288.68 | 815.81 + 969.32 = 1’785.13 | 1’110.41 + 1’319.36 = 2’429.77 |

| | 0001 Laura Keller | 0002 Kevin Fischer |
|---|---|---|
| Zwischensumme | 2’544.82 | 3’463.77 |
| Verwaltungspauschale | 3 % → 76.34 | 0.00 (Vertrag ohne Pauschale) |
| Ihre Nebenkosten | 2’621.16 | 3’463.77 |
| Akontobeiträge | 12 × 190.00 = 2’280.00 | 12 × 250.00 = 3’000.00 |
| Saldo vor Rundung | 341.16 | 463.77 |
| Rundung (Nachzahlung ab) | – 0.01 | – 0.02 |
| Saldo | 341.15 | 463.75 |
| `key_values` | Fläche 72/255, Zimmer 3/10.5, Einheiten 1/3 | 98/255, 4/10.5, 1/3 |

Verglichen mit `utility_statements` (`total_costs`, `management_fee`, `total_advance_payments`, `balance`, `key_values`), `utility_statement_line_items` (`tenant_share`, `share_percentage`, `segments`: Kosten, Anteil und Wohnungszahl je Zeitraum; alle 8 Positionen) sowie dem Backend :3301. Alles gleich. Die Beträge sind dieselben wie in der Datenprüfung #1284 (Saldo 341.15 und 463.75).

### Wer trägt den Anteil von 2.01? Stimmt der neue PDF-Satz?

Satz im PDF 0001 und 0002: «Wohnung 2.01 gibt es ab 01.07.2025 nicht mehr. Bis zum 30.06.2025 zählt sie im Verteilschlüssel mit; solange sie leer steht, trägt der Vermieter ihren Anteil. Ab 01.07.2025 werden die Nebenkosten des Gebäudes nur noch auf die übrigen Wohnungen verteilt.»

1. «gibt es ab 01.07.2025 nicht mehr»: `apartments.discontinued_from` = 2025-07-01. Wahr.
2. «Bis zum 30.06.2025 zählt sie im Verteilschlüssel mit»: Zeitraum 1 hat `count` 3 und 255 m² (72 + 98 + 85). Wahr.
3. «solange sie leer steht, trägt der Vermieter ihren Anteil»: 2.01 hat keinen einzigen Mietvertrag (`select … from rental_contracts` in Alpenblick: nur 0.01 und 1.01). Die Differenz «Kosten des Gebäudes minus Mieter» im Zeitraum 1 ist je Position genau der Anteil von 2.01 (85/255): Schnee 214.89, Strom 62.63, Wasser 77.69, Heizung 963.11 (963.10 nach Rundung der Kostenabstimmung, wie in #1284). Summe 1’318.31 = Spalte «davon tragen Sie» der Kostenabstimmung (`GET /api/v1/reports/reconciliation?buildingId=…&periodStart=2025-01-01&periodEnd=2025-12-31`: Kosten 7’326.90, Mieter 6’008.59, Vermieter 1’318.31). Regel 4 («Leerstand trägt immer der Vermieter») und das Glossar bestätigen den Satz. Er ist bedingt formuliert («solange»), also auch richtig, wenn 2.01 früher vermietet gewesen wäre; mit einem Mieter in 2.01 trüge dieser den Anteil. Für diese Datensätze trifft die Bedingung ganz zu.
4. «Ab 01.07.2025 … nur noch auf die übrigen Wohnungen»: Zeitraum 2 hat `count` 2 und 170 m²; die Anteile von 0.01 und 1.01 ergeben je Position genau die Kosten des Zeitraums (277.56 + 377.78 = 655.34; 80.90 + 110.11 = 191.01; 100.35 + 136.58 = 236.93; 969.32 + 1’319.36 = 2’288.68), der Vermieter trägt dort 0.00. Wahr.

### Hinweis P-2 von Dr. Weber (Rechnungen ohne Leistungszeitraum nach Tagen, Laura Keller «etwa CHF 72 zu viel»)

Die Beträge folgen der dokumentierten Regel: `docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1 und 5 (eine Rechnung ohne Leistungszeitraum zählt in der Periode ihres Rechnungsdatums; ihre Tage sind die Tage der Periode) und Glossar «Aufgehobene Wohnung» («alle anderen Kosten nach Tagen»). Gleiche Beurteilung wie in `docs/reviews/1284-datenpruefung-1.md:63`. Beleg: Alle 14 Rechnungen haben `service_period_start` NULL; die Kosten je Zeitraum sind genau Betrag × 181/365 bzw. 184/365 (1’300.00 → 644.66 + 655.34).

Die Zahl der Persona stimmt als Rechnung: Würde man jede Rechnung ihrem Zeitraum zuordnen (Schnee Januar–März und Dezember, Strom H1 und H2, Wasser H1; `whatif.py`, nur Rechnung), trüge Laura 420.70 + 134.70 + 132.71 = 688.11 statt 459.58 + 133.95 + 166.16 = 759.69, also 71.58 weniger (73.73 mit Pauschale 3 %). Kevin trüge 97.40 weniger (936.60 statt 1’034.00). Der Vermieter trägt das, weil der Zeitraum 1 mit dem Anteil von 2.01 mehr Kosten bekäme. Das ist die Folge der Regel (Rechnung ohne Leistungszeitraum zählt gleichmässig über die Periode), kein Rechenfehler. Wer es genauer will, erfasst den Leistungszeitraum an der Rechnung. Kein Befund.

## PDF von NK-33333333-2025-0001

- Persona-Kopie `/tmp/claude-0/-home-user-Dwello/9491f89b-e3dd-58ae-af29-e047f9ed5a53/scratchpad/weber-1311/keller.pdf` ist byteidentisch mit `utility_statements.pdf_blob` (53’809 Bytes). Text mit `pdftotext -layout` gelesen.
- Zeilen je Zeitraum, Zeitanteil 100.00 % (181/181 und 184/184 Tage, Heizung «Anteil nach Heizprofil 100.00 %»), Wohnungsanteile, Zwischensumme 2’544.82, Verwaltungspauschale 76.34, Ihre Nebenkosten 2’621.16, Akontobeiträge 2’280.00, Saldo vor Rundung 341.16, Rundung – 0.01, Nachzahlung 341.15, Tankrechnung 1’792.00 + 4’880.00 – 1’494.00 = 5’178.00: jede Zahl gleich meiner Rechnung (`pdfcheck.py`, 36 Zahlen). Zahlungsfrist 08.12.2026 = Abrechnungsdatum 08.11.2026 + 30 Tage.
- Sprachen: PDF 0001 und 0002 in de, fr, it, en (Kopie, siehe «Nicht bestätigt» Punkt 1). Alle erwarteten Zahlen stehen in jeder Sprache; die Zahlen jeder Sprache sind gleich denen der deutschen Fassung (217 bzw. 213 Zahlen, `nums.py`). Der neue Satz steht in allen vier Sprachen mit dem Wortlaut aus `backend/src/services/pdf-texts/*.ts`, Daten 01.07.2025 und 30.06.2025 richtig. Die deutsche Kopie hat denselben Text wie das gespeicherte PDF der Persona.
- Datenschutz: kein Betrag und kein Name des anderen Mieters in 0001 oder 0002.
- Seite 1 gerendert (`pdftoppm -png -r 70`, fr): der Satz steht über der Kostenübersicht, nichts überlappt.

## QR-Rechnungen

Seite 3 jedes PDFs mit `pdftoppm -png -r 300` gerendert, mit `zxing-cpp` (Scratchpad `dp1311/pylib`) dekodiert, IBAN mod 97 und QR-Referenz (Prüfziffer, Modulo 10 rekursiv) mit `python-stdnum` (`stdnum.ch.esr.is_valid`, `stdnum.iban.is_valid`) geprüft. Alle 9 Codes lassen sich dekodieren (`qrall.py`).

| PDF | IBAN | Betrag | Referenz | Mitteilung | Zahlbar durch |
|---|---|---|---|---|---|
| 0001 gespeichert (de, Persona) | CH44 3199 9123 0008 8901 2 (gültig; QR-IID 31999; = `configuration.iban`) | CHF 341.15 (= `balance`) | QRR 009804199218168267070257792 (Prüfziffer gültig; = `qr_bill_reference`) | Nebenkostenabrechnung NK-33333333-2025-0001 | Laura Keller, Bergstrasse 8, 3800 Interlaken, CH |
| 0001 de/fr/it/en (Kopie) | gleich | 341.15 | gleich | Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie / Utility Cost Statement + Nr. | gleich |
| 0002 de/fr/it/en (Kopie) | gleich | CHF 463.75 (= `balance`) | QRR 001712051876465652100304758 (Prüfziffer gültig) | wie oben, mit NK-33333333-2025-0002 | Kevin Fischer, Bergstrasse 8, 3800 Interlaken, CH |

Zahlungsempfänger in allen: Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. Zusatzfeld `EPD`. Mieteradressen gleich `tenants` (Laura Keller, Kevin Fischer, Bergstrasse 8, 3800 Interlaken).

## Mietstatus-Zahlen für Alpenblick

Datenbank: 0.01 Laura Keller (Mietvertrag ab 01.11.2022, offen) und 1.01 Kevin Fischer (ab 01.05.2021, offen) laufen am 08.11.2026; 2.01 hat keinen Mietvertrag und `discontinued_from` 2025-07-01. Erwartet: 3 Wohnungen, 2 vermietet, 0 leer, 1 aufgehoben. Zum Vergleich Seepark Residenz: 4 Wohnungen, A1/A2/B2 vermietet, B1 aufgehoben ab 01.04.2026 (Demo-Daten, ohne laufenden Vertrag): 3 vermietet, 0 leer, 1 aufgehoben. Musterhaus Zentrum: 6 Wohnungen, 4 vermietet, 2 leer.

Gegen den Stand a1f4b8f geprüft (Frontend aus dem Worktree gebaut, Kopie der Datenbank, de/fr/it/en):

| Ort | Erwartet | Angezeigt (alle vier Sprachen gleich) |
|---|---|---|
| Gebäudeseite Alpenblick «Wohnungen» | 3, davon 2 vermietet, 0 leer und 1 aufgehoben | «3, davon 2 vermietet, 0 leer und 1 aufgehoben» / «3, dont 2 loués, 0 vacants et 1 n’existe plus» / «3, di cui 2 locati, 0 sfitti e 1 non esiste più» / «3, of which 2 let, 0 vacant and 1 no longer exists» |
| Gebäudeliste | Alpenblick 3 / 2 vermietet, 0 leer, 1 aufgehoben; Seepark 4 / 3, 0, 1; Musterhaus 6 / 4, 2 | gleich |
| Übersicht, «Vermietete Wohnungen pro Gebäude» | Alpenblick 2/2, Seepark 3/3, Musterhaus 4/6 | gleich (Wohnung 2.01 steht nicht als leer) |
| Wohnungsliste und Detail 2.01 | «Aufgehoben seit 01.07.2025» | gleich (fr «N’existe plus depuis le 01.07.2025», it «Non esiste più dal 01.07.2025», en «No longer exists since 01.07.2025»); Filter «Aufgehoben» vorhanden; `?status=discontinued` liefert 2.01 und B1 |
| API `GET /api/v1/buildings/<Alpenblick>` | `apartmentCount` 3, `occupiedCount` 2, `vacantCount` 0 | gleich (auch auf :3301) |

Einzige Abweichung: die Übersichtskarte «Wohnungen» (D-1).

Datenexport (`GET /api/v1/export?language=…`, Tabelle Wohnungen, Spalte Mietstatus; auf :3301 und auf der Kopie gleich): 2.01 «Aufgehoben seit 2025-07-01» (fr «N’existe plus depuis le 2025-07-01», it «Non esiste più dal 2025-07-01», en «No longer exists since 2025-07-01»), Seepark B1 «… 2026-04-01». Datumsformat wie bei «Vermietet ab {Datum}» im selben Export.

Geprüft: NK-33333333-2025-0001, NK-33333333-2025-0002 (Positionen, Zeiträume mit Kosten, Anteil und Wohnungszahl, Verwaltungspauschale, Akonto, Saldo, Rundung auf 5 Rappen, `key_values`, Detailseite in vier Sprachen), PDF von 0001 (Persona-Kopie, Satz, Zeilen je Zeitraum, vier Sprachen), PDF von 0002 (Kopie, vier Sprachen), 9 QR-Rechnungen, Kostenabstimmung Alpenblick 2025, Mietstatus von 2.01 und Zahlen Alpenblick (Gebäudeseite, Gebäudeliste, Übersicht-Zeilen, Wohnungsliste, Detail, API), Datenexport (4 Sprachen), Hinweis P-2.

## Nicht bestätigt

1. **Die laufende Persona-Oberfläche (:3300/:3301) ist älter als a1f4b8f.** Dort zeigt die Gebäudeseite «2, davon 2 vermietet, 0 leer und 1 aufgehoben» (die Teile ergeben 3, die Summe sagt 2) und das API `portfolio.totalApartments` 11 (a1f4b8f: 13). Das ist der Stand vor der Korrektur C-1 / Persona Helga P-1 und nicht der geprüfte Commit. Deshalb habe ich die Seiten, die Übersicht, die Wohnungsliste und den Export aus a1f4b8f selbst gebaut und betrieben: Frontend- und Backend-Kopie des Worktrees im Scratchpad (`dp1311/fe`, `dp1311/be`), Ports 3394/3392, auf einer Kopie der Datenbank (`pg_dump` von `dwello_persona` nach `dp1311_copy`, nach dem Lauf gelöscht, beide Prozesse beendet). Der Stand auf :3300/:3301 enthält den neuen PDF-Satz (das PDF der Persona hat ihn), aber nicht die Zählung der Gebäudeseite. Wer die Oberfläche auf :3300 für a1f4b8f prüfen will, muss den Stack neu bauen.
2. **PDF von 0002 und die Sprachen fr/it/en von 0001:** in der Persona-Datenbank gibt es kein PDF von 0002, und «PDF erstellen» oder das Öffnen des PDFs eines Entwurfs (`GET …/pdf` erstellt es neu, in der Sprache des Mieters) würde die Daten ändern. Geprüft habe ich die PDFs, die das Backend aus dem Worktree auf der Kopie der Datenbank erzeugt hat (`generate-pdf` mit `language`, `pdf_blob` aus der Kopie). Das deutsche PDF von 0001 aus der Kopie hat denselben Text wie das gespeicherte der Persona.
3. **Seiten nur als HTML-Text gelesen**, nicht im Browser gerendert (kein Screenshot, kein Kontrast, keine Tastaturprüfung); es ging um Zahlen und Wörter.
4. **Das Formular «Aufgehoben ab» und seine Hilfetexte** habe ich nicht gegen Daten geprüft (kein Betrag).
