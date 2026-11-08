# Datenprüfung #1284 «Aufgehobene Wohnung», Runde 1

Worktree: `/tmp/claude-0/-home-user-Dwello/68aac57b-89dc-5db4-991a-d8f9dcf9ab09/scratchpad/review-1284-daten` (Commit 3d2a0cd). Datenbank `dwello_persona`, nur gelesen (Abfragen, GET auf Backend :3301 und Frontend :3300 mit einem Persona-Token). Zum Schluss: 19 Abrechnungen, `max(updated_at)` unverändert (17:53:52, das PDF von 0001).

Eigene Rechnung: `/tmp/claude-0/-home-user-Dwello/68aac57b-89dc-5db4-991a-d8f9dcf9ab09/scratchpad/dp1284/recompute.py` (liest Rechnungen, Verteilschlüssel, Wohnungen, Heizprofil und Tankbestände per `psql`; keine Dwello-Rechenlogik). Aufruf: `python3 -I recompute.py`.

## Ergebnis

Alle Beträge stimmen auf den Rappen: Positionen, Zeiträume, Verwaltungspauschale, Akonto, Saldo, Rundung auf 5 Rappen, Kostenabstimmung, Seite und PDF in vier Sprachen, QR-Rechnungen. Zwei Befunde, beide Minor und beide zum Heizprofil (Text, kein Betrag). Kein Blocker, kein Major.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | Detailseite von NK-33333333-2025-0001 und -0002, Zeile «Heizprofil» (de/fr/it/en, Schlüssel `statements_profile_not_applied` + `statements_profile_reason_whole_period`) | Das Heizprofil «Heizung + Warmwasser» ist angewendet: Es bestimmt die Kosten der Zeiträume (55.80 % bis 30.06., 44.20 % ab 01.07.). Die Seite darf nicht «nicht angewendet» sagen. | «Heizung + Warmwasser (nicht angewendet: Mietvertrag über die Periode)». Das gilt nur für den Zeitanteil des Mieters (100 %). Die Heizkosten (Position 1’785.13 bzw. 2’429.77) hängen aber vom Heizprofil ab. Ohne Heizprofil wären es Tage (181/365, 184/365) und andere Beträge. |
| D-2 | Minor | PDF von NK-33333333-2025-0001 (alle Sprachen; 0002 gleich), Abschnitt «Heiz- und Warmwasserkosten» und Zeilen der Heizung | Das PDF nennt das Heizprofil und die Quelle der Monatsanteile (Glossar «Quelle der Monatsanteile»: steht im PDF unter der Zeile zum Heizprofil, #465; Anforderung: Anteil nachvollziehbar). Der Mieter kann «55.80 %» sonst nicht nachrechnen. | Die Zeilen sagen «55.80 % der Heizkosten nach Heizprofil», aber weder der Name des Heizprofils noch seine Monate noch die Quelle stehen im PDF (`grep -i heizprofil` trifft nur die zwei Zeilen). Im PDF von NK-22222222-2025-0002 (Mieter mit Teilzeit) stehen Name, Monate und Quelle. |

### Belege und Reproduktion

**D-1.** `curl -s -L -b "dwello_session=<Token>; dwello_xsrf=x" localhost:3300/statements/71e2609b-ffe8-4d2e-befd-d783a220b907` (Token wie `docs/design/tools/persona-kit.mjs`, Skript `dp1284/token.cjs`). Ausgabe der Zeile: `Heizprofil / Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)`. In der Datenbank: `select segments from utility_statement_line_items where description='Heating'` zeigt `profileShare` 55.8 und 44.2, `heating_share` `{"byDays": true, "reason": "wholePeriod"}`. Gleiche Texte in fr (`non appliqué : contrat de bail sur toute la période`), it (`non applicato: …`), en (`not applied: …`). Betrag nicht betroffen.

**D-2.** `pdftotext -layout` des gespeicherten PDFs (`select pdf_blob from utility_statements where statement_number='NK-33333333-2025-0001'`, base64-dekodiert): Zeilen 70–73 nennen die Prozentwerte, der Abschnitt «Heiz- und Warmwasserkosten» enthält nur die Tankrechnung (1’792.00 + 4’880.00 – 1’494.00 = 5’178.00). Vergleich: das PDF von NK-22222222-2025-0002 druckt «Heizkosten nach Heizprofil «Heizung + Warmwasser»» und «Quelle der Monatsanteile: …». Auszug und Texte: `dp1284/0001.txt`, `dp1284/pdfs/71e2-{de,fr,it,en}.txt`.

## Nachrechnung (Alpenblick 2025)

Eingaben: 3 Wohnungen (0.01 72 m², 1.01 98 m², 2.01 85 m² aufgehoben ab 01.07.2025), Verteilschlüssel «Pro Fläche» für alle Rechnungen, keine Rechnung mit Leistungszeitraum, Zeiträume 01.01.–30.06. (181 Tage, 3 Wohnungen, 255 m²) und 01.07.–31.12. (184 Tage, 2 Wohnungen, 170 m²). Heizkosten 1’792.00 + 4’880.00 – 1’494.00 = 5’178.00 nach Tankbestand, Heizprofil «Heizung + Warmwasser» Jan–Jun 55.8 %, Jul–Dez 44.2 %.

| Position | Kosten Zeitraum 1 / 2 | Wohnungsanteil 0.01 (Laura) | Wohnungsanteil 1.01 (Kevin) |
|---|---|---|---|
| Schneeräumung 1’300.00 | 644.66 / 655.34 | 182.02 + 277.56 = 459.58 | 247.75 + 377.78 = 625.53 |
| Allgemeinstrom 378.90 | 187.89 / 191.01 | 53.05 + 80.90 = 133.95 | 72.21 + 110.11 = 182.32 |
| Kaltwasser 470.00 | 233.07 / 236.93 | 65.81 + 100.35 = 166.16 | 89.57 + 136.58 = 226.15 |
| Heizung 5’178.00 | 2’889.32 / 2’288.68 | 815.81 + 969.32 = 1’785.13 | 1’110.41 + 1’319.36 = 2’429.77 |

Beide Mieter mieten die ganzen Zeiträume (Zeitanteil 100 %).

| | Laura Keller 0001 | Kevin Fischer 0002 |
|---|---|---|
| Zwischensumme | 2’544.82 | 3’463.77 |
| Verwaltungspauschale | 3 % = 76.3446 → 76.34 | 0.00 (Vertrag ohne Pauschale) |
| Ihre Nebenkosten (`total_costs`) | 2’621.16 | 3’463.77 |
| Akonto | 12 × 190.00 = 2’280.00 | 12 × 250.00 = 3’000.00 |
| Saldo vor Rundung | 341.16 | 463.77 |
| Rundung (Nachzahlung ab) | – 0.01 | – 0.02 |
| Saldo | 341.15 | 463.75 |
| `key_values` | Fläche 72/255, Zimmer 3/10.5, Einheiten 1/3 | 98/255, 4/10.5, 1/3 |

Verglichen mit: Tabelle `utility_statements` und `utility_statement_line_items` (`tenant_share`, `apartment_share`, `segments` mit `costs`, `apartment`, `share`, `count`, `keyValues`, `profileShare`), API `GET /api/v1/statements/:id`, Detailseite (de/fr/it/en), PDF 0001 (gespeichert, de) und PDF 0001/0002 in vier Sprachen. Jede Zahl stimmt überein. Die `key_values` zählen alle drei Wohnungen am ersten abgerechneten Tag (01.01.2025), wie die Regel verlangt. Alle Beträge der vier PDF-Sprachen sind je Abrechnung identisch (117 bzw. 115 Zahlen).

Kostenabstimmung Alpenblick 2025 (`GET /api/v1/reports/reconciliation` und `/api/v1/statements/run-reconciliation?...&managementFeePercent=3`, beide gleich; Seite `/reports/33333333-…?periodStart=2025-01-01&periodEnd=2025-12-31`):

| Position | Kosten des Gebäudes | davon Mieter | davon tragen Sie |
|---|---|---|---|
| Schneeräumung | 1’300.00 | 1’085.11 (459.58 + 625.53) | 214.89 |
| Allgemeinstrom | 378.90 | 316.27 | 62.63 |
| Kaltwasser | 470.00 | 392.31 | 77.69 |
| Heizung | 5’178.00 | 4’214.90 | 963.10 |
| Total | 7’326.90 | 6’008.59 | 1’318.31 |

Verwaltungspauschale 76.34 getrennt. Stimmt: 3’463.77 + 2’544.82 = 6’008.59.

## Urteil zu den Hinweisen von Dr. Weber

- **963.10 gegen 963.11: kein Fehler.** Der Anteil der aufgehobenen Wohnung 2.01 an der Heizung im ersten Zeitraum ist 2’889.32 × 85/255 = 963.1067 → 963.11. Die drei gerundeten Wohnungsanteile (815.81 + 1’110.41 + 963.11) ergeben aber 2’889.33, ein Rappen mehr als die Kosten des Zeitraums. Die Kostenabstimmung rechnet «Kosten des Gebäudes minus Mieter» = 5’178.00 – 4’214.90 = 963.10, und das Glossar zählt die Rundung zu dieser Differenz («Differenz, die der Vermieter trägt (…, Rundung)»). Die Seite sagt es auch: «Weil jeder Anteil auf Rappen gerundet ist, kann «davon tragen Sie» einige Rappen höher oder tiefer sein.» Bei den übrigen drei Positionen ist die Differenz genau der Anteil von 2.01 (214.89, 62.63, 77.69).
- **P-3 (Rechnungen ohne Leistungszeitraum nach Tagen über die Periode): entspricht der Regel.** Die Regel heisst «Leistungszeitraum, sonst die Periode». Alle 14 Rechnungen von Alpenblick haben keinen; «Schneeräumung Dezember 2025» (380.00, Datum 31.12.) zählt deshalb mit 181/365 in den Zeitraum mit drei Wohnungen (188.44), obwohl sie wirtschaftlich in den zweiten gehört. Das ist die Folge der Regel, kein Rechenfehler: `docs/nebenkostenabrechnung-anforderungen.md` Regel 1 und 5 (abgerechnete Tage ohne Leistungszeitraum = Tage der Periode). Die Summe stimmt (644.66 + 655.34 = 1’300.00). Wer es genauer will, erfasst den Leistungszeitraum an der Rechnung. Kein Befund.

## QR-Rechnungen

Seite 3 jedes PDFs mit `pdftoppm -png -r 300` gerendert, mit `zxing-cpp` (Scratchpad `dp1284/pylib`) dekodiert; IBAN-Prüfsumme (mod 97) und QR-Referenz mit `python-stdnum` (`stdnum.ch.esr.is_valid`) geprüft. Alle QR-Codes lassen sich dekodieren.

| PDF | IBAN | Betrag | Referenz | Mitteilung | Zahlbar durch |
|---|---|---|---|---|---|
| 0001 gespeichert (de) | CH44 3199 9123 0008 8901 2 (gültig; = `configuration.iban`) | CHF 341.15 (= `balance`) | QRR 005378033381639504914511332 (Prüfziffer gültig; = `qr_bill_reference`) | Nebenkostenabrechnung NK-33333333-2025-0001 | Laura Keller, Bergstrasse 8, 3800 Interlaken, CH |
| 0001 de/fr/it/en (Scratch) | gleich | 341.15 | gleich | Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie / Utility Cost Statement + Nr. | gleich |
| 0002 de/fr/it/en (Scratch) | gleich | CHF 463.75 | QRR 010954650121540144424236857 (gültig) | wie oben, mit NK-33333333-2025-0002 | Kevin Fischer, Bergstrasse 8, 3800 Interlaken, CH |

Zahlungsempfänger in allen: Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. Zusatzfeld `EPD`.

## Zusatzprüfung auf einer Kopie (nicht an den Persona-Daten)

Die Persona-Datensätze zeigen nur Mieter über die ganzen Zeiträume. Darum habe ich eine Kopie der Datenbank (`pg_dump` in `dp1284_copy`, danach gelöscht) mit einem Backend aus dem Worktree (Commit 3d2a0cd, `bun install` in einer Kopie im Scratchpad, Port 3391, nach dem Lauf beendet) verändert und neu berechnet:

1. Laura 10.04.–20.09.2025, Schneerechnung 920.00 mit Leistungszeitraum 01.03.–30.09.2025, Heizöl-Lieferung mit Leistungszeitraum bis 31.07.2026. Erwartet und gefunden: Schnee 712.92 / 587.08 (Summe der Rechnungsteile, einmal gerundet), Zeitanteile 61.42 % und 74.59 % (nach Beträgen gewichtet), Anteile 123.64 + 185.46 = 309.10; Strom 24.03 + 36.05; Kaltwasser 29.81 + 44.72; Heizung (nur Verbrauch 298.00, Lieferung zählt in 2026) 13.30 + 12.33 = 25.63 nach Heizprofil (Anteile 28.33 % und 22.10 %); Zwischensumme 469.34, Pauschale 14.08, Akonto 1’019.67 (Monate 133.00 + 760.00 + 126.67), Saldo –536.25.
2. Laura ab 01.08.2025: kein Zeitraum geteilt, `key_values` zählen nur zwei Wohnungen (72/170), Schnee 230.80, Heizung 888.18 (Monate Aug–Dez 40.5 %), Saldo 357.75.

Beide Rechnungen stimmen mit meiner Handrechnung auf den Rappen. Die Rundung der Kosten eines Zeitraums nimmt die Summe der Rechnungsteile und rundet einmal (712.92, nicht 712.93 aus je Rechnung gerundeten Teilen). Das entspricht «Kosten je Zeitraum, wie gedruckt»: Die Zeile druckt nur die Summe, nicht die einzelnen Rechnungen.

Geprüft: NK-33333333-2025-0001, NK-33333333-2025-0002 (Positionen, Zeiträume, Verwaltungspauschale, Akonto, Saldo, Rundung, key_values, Seite in vier Sprachen), PDF von 0001 (Zeilen je Zeitraum, Bruch je Zeitraum, vier Sprachen, QR-Betrag), Kostenabstimmung Alpenblick 2025 (Seite, Bericht, Lauf-Vorschau), Hinweise P-3 und 963.10/963.11.

## Nicht bestätigt

- **PDF von NK-33333333-2025-0002 in der Persona-Datenbank:** Es existiert keines (`pdf_blob` leer), und «PDF erstellen» würde die Daten ändern. Seine Zeilen, Zahlen und der QR-Code sind deshalb nur am PDF geprüft, das ein Backend aus dem Worktree auf einer Kopie der Datenbank erzeugt hat (`dp1284/pdfs/e7f9-*.pdf`). Ob das laufende Backend :3301 dasselbe Ergebnis liefert, ist hier nur durch den Textvergleich des gespeicherten PDFs von 0001 mit dem Scratch-PDF belegt (gleicher Text).
- **PDF von 0001 in fr/it/en aus der Persona-Datenbank:** Nur das deutsche PDF ist dort gespeichert. Die drei anderen Sprachen habe ich wie bei 0002 aus der Kopie erzeugt und geprüft.
- **Kostenabstimmung in der Vorschau des Abrechnungslaufs (Wizard-Seite):** Die API `run-reconciliation` (gleiche Werte wie der Bericht) habe ich gelesen, die Wizard-Seite selbst nicht gerendert, weil sie einen Lauf im Browser verlangt (Playwright-Lauf gegen :3300 hätte Daten ändern können).
- **Abrechnung 2026 (ohne 2.01) und Wohnungsformular «Aufgehoben ab»:** Nicht Teil der genannten Datensätze, nicht geprüft.
- **Rechtliche Würdigung von P-3 und der Heizprofil-Aufteilung:** Nur gegen die Regeln in `docs/nebenkostenabrechnung-anforderungen.md` und `docs/reviews/1284-fachreview-1.md` geprüft, nicht gegen Fedlex.
