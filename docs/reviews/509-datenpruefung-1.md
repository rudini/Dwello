# Datenprüfung #509, Runde 1 (Commit 381c7c7 gegen Basis 9f03c10)

Gegenstand: Heizungsabschnitt des Abrechnungs-PDF, wenn jede Heizposition nach Heizprofil Rechnungszeilen hat und keine ohne Leistungszeitraum ist (`pdf.service.ts`: `noRunShare`, `heatingNoteKey`, `heatingNoteOwn`).
Datenbank: `dwello_persona` (Demo-Daten), Backend :3301 läuft im Arbeitsbaum des Aufrufers auf 381c7c7 (sauber), geprüft wurde der Worktree `review-509-daten`.

## Ergebnis

Keine Blocker, Major, Minor-Befunde. Ein Nit (D-1). Alle Beträge der beiden betroffenen Abrechnungen stimmen auf den Rappen mit meiner Neuberechnung aus der Datenbank überein, in der Datenbank, in allen vier PDF-Sprachen und im QR-Code.

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Nit | NK-22222222-2025-0002 / -0003, Sprache en | Nach dem Doppelpunkt kleiner Satzanfang wie in fr/it, oder ein Satz ohne Doppelpunkt | «…heating profile ‘Heating + Hot Water’: For an invoice with a service period, …». Grossbuchstabe nach Doppelpunkt vor ganzem Satz ist im Englischen zulässig; das Fachreview (V-4) hat es für de und en ausdrücklich zugelassen. Nur zur Kenntnis, keine Änderung nötig. |

## Vorgehen (reproduzierbar)

1. Skript `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/render509.ts` rendert alle 17 Abrechnungen × 4 Sprachen aus dem Worktree (381c7c7) in `.../scratchpad/out/` (PDF, Text, Daten-JSON). `db.update` ist dabei durch einen Stub ersetzt, es wird nichts gespeichert (Stub-Test `stubtest.ts`: 1 Aufruf, keine Zeilenänderung).
2. Dasselbe Skript gegen den Stand 9f03c10 (`git archive` nach `.../scratchpad/base509`) ergibt `.../scratchpad/outbase/`.
3. `pdftotext -layout` beider Stände und Vergleich: nur die 8 PDFs NK-22222222-2025-0002 und -0003 (de/fr/it/en) unterscheiden sich; die übrigen 128 Texte sind byte-gleich.
4. Neuberechnung unabhängig von Dwellos Rechencode: `.../scratchpad/recompute509.py` (liest Rechnungen, Kategorien, Verteilschlüssel, Mietverträge, Heizprofil «Heizung + Warmwasser» per `psql`; Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1, 5, 8, 9). Aufruf: `python3 -I .../recompute509.py`.
5. QR-Rechnung: `pdftoppm -png -r 300` der letzten Seite, Decoder zxing-cpp (installiert in `.../scratchpad/pylib`), Skript `.../scratchpad/qr509.py`.

## Neuberechnung Seepark Residenz, Wohnung A2, Periode 01.01.–31.12.2025 (365 Tage)

Eingaben: Schlüssel Fläche 82 / 320 m², Einheit 1 / 4, Verwaltungspauschale 3 %, Heizprofil Jan 13.6 / Feb 12.1 / Mär 11.5 / Apr 9.3 / Mai 5.6 / Jun 3.7 / Jul 3.7 / Aug 3.6 / Sep 3.7 / Okt 9.5 / Nov 10.7 / Dez 13.0. Fernwärme: Q1 1520, Q2 790, Q3 395, Q4 1410 (alle mit Leistungszeitraum; Rechnung Q4 2024 vom 20.01.2025 zählt nicht, Rechnung Q4 2025 vom 20.01.2026 zählt).

### Sarah Meier, NK-22222222-2025-0002 (Mietstage 181, Akonto 6 × 220.00)

| Position | Kosten Gebäude | Wohnungsanteil | Zeitanteil | Ihr Anteil | Neuberechnet = gespeichert = PDF (4 Sprachen) |
|---|---|---|---|---|---|
| TV/Kabel | 912.00 | 228.00 | 181/365 | 113.06 | ja |
| Heizung | 4'115.00 | 1'054.47 | 56.14 % | 591.94 | ja |
| Kaltwasser | 2'060.00 | 527.88 | 181/365 | 261.77 | ja |
| Hauswart | 3'060.00 | 784.13 | 181/365 | 388.84 | ja |
| Allgemeinstrom | 499.30 | 127.95 | 181/365 | 63.45 | ja |

Heizung je Rechnung: Q1 37.20 % / 37.20 % = 100.00 %; Q2 18.60 % / 18.60 % = 100.00 %; Q3 0.00 % / 11.00 % = 0.00 %; Q4 0.00 % / 33.20 % = 0.00 %. Zeitanteil: (1520 + 790) / 4115 = 56.1361 % → 56.14 %. 1'054.47 × 2'310 / 4'115 = 591.94.
Zwischensumme 1'419.06; Verwaltungspauschale 3 % = 42.57 (42.5718); Nebenkosten 1'461.63; Akonto 1'320.00; Saldo vor Rundung 141.63; Rundung auf 5 Rappen zugunsten des Mieters (Nachzahlung abrunden) –0.03; Nachzahlung 141.60. Datenbank: `total_costs 1461.63`, `management_fee 42.57`, `total_advance_payments 1320.00`, `balance 141.60`.

### Nina Brunner, NK-22222222-2025-0003 (Mietstage 184, Akonto 6 × 240.00)

| Position | Kosten Gebäude | Wohnungsanteil | Zeitanteil | Ihr Anteil | Neuberechnet = gespeichert = PDF (4 Sprachen) |
|---|---|---|---|---|---|
| TV/Kabel | 912.00 | 228.00 | 184/365 | 114.94 | ja |
| Heizung | 4'115.00 | 1'054.47 | 43.86 % | 462.53 | ja |
| Kaltwasser | 2'060.00 | 527.88 | 184/365 | 266.11 | ja |
| Hauswart | 3'060.00 | 784.13 | 184/365 | 395.29 | ja |
| Allgemeinstrom | 499.30 | 127.95 | 184/365 | 64.50 | ja |

Heizung je Rechnung: Q1 0.00 % / 37.20 %; Q2 0.00 % / 18.60 %; Q3 11.00 % / 11.00 % = 100.00 %; Q4 33.20 % / 33.20 % = 100.00 %. (395 + 1410) / 4115 = 43.8639 % → 43.86 %; 1'054.47 × 1'805 / 4'115 = 462.53.
Zwischensumme 1'303.37; Pauschale 39.10 (39.1011); Nebenkosten 1'342.47; Akonto 1'440.00; Saldo vor Rundung –97.53; Rundung +0.02; Rückerstattung 97.55. Datenbank: `balance -97.55`. Kein Zahlteil (Rückerstattung), das PDF bittet um die IBAN.

Hinweis zur Methode: «Ihr Anteil» rechnet aus dem gedruckten, auf Rappen gerundeten Wohnungsanteil (Hauswart Brunner: 784.13 × 184/365 = 395.29; mit dem ungerundeten 784.125 käme 395.28). Das PDF ist so mit den gedruckten Zahlen nachrechenbar; ich habe das als richtig gewertet.

## Aussage des Heizungsabschnitts (Regel des Auftrags)

| Datensatz | Sprache | Basis 9f03c10 | Stand 381c7c7 | Soll |
|---|---|---|---|---|
| 0002 Meier | de | «55.80 % für eine Rechnung ohne Leistungszeitraum.» + Zeile «Anteile der Monate Ihres Mietverhältnisses: Jan … Jun» | Satz nur noch «Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition.», keine Monatszeile | richtig (alle 4 Rechnungen mit Leistungszeitraum) |
| 0002 Meier | fr / it / en | analog mit 55.80 % und Monatszeile | analog gekürzt (fr/it beginnen klein nach dem Doppelpunkt: «: pour une facture avec …», «: per una fattura con …»), keine Monatszeile | richtig |
| 0003 Brunner | de / fr / it / en | 44.20 % und Monatszeile Jul–Dez | gekürzt, keine Monatszeile | richtig |

- Wortvergleich Basis gegen Stand je PDF (Wortfolge ohne Layout): ausser diesen zwei Streichungen (bei fr/it auch die Streichung eines Seitenkopfs, weil der Meier-Text von 3 auf 2 Seiten schrumpft) gibt es keine Änderung. Keine Zahl, kein Betrag ändert sich.
- Die 55.80 % und 44.20 % stimmen mit der Summe der Profilmonate der Mietzeit überein (Meier Jan–Jun 13.6+12.1+11.5+9.3+5.6+3.7 = 55.8; Brunner Jul–Dez 3.7+3.6+3.7+9.5+10.7+13.0 = 44.2), die Zeile ist also zu Recht entfallen und war vorher richtig berechnet.
- Je Rechnungszeile bleiben «Anteile der Monate im Heizprofil», «Anteile der Monate Ihres Mietverhältnisses darin» und «Anteil nach Heizprofil: x % / y % = z %" im PDF stehen, damit bleibt der Zeitanteil nachrechenbar.
- Erläuterungstext unter der Tabelle («Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil; …») ist unverändert und passt weiter.

### Übrige Abrechnungen mit Heizungsabschnitt
Die 15 übrigen Abrechnungen (Musterhaus Zentrum, Alpenblick: Heizöl mit Tankbestand, Seepark 2024 und 2025-0001/-0004: Heizkosten nach Tagen, `heating_share.byDays = true`) drucken keine Heizprofil-Zeile und keine Monatszeile. Ihr PDF-Text ist in allen vier Sprachen byte-gleich mit dem der Basis (`cmp` über 120 Textdateien). Der Pfad `noRunShare` wird dort nicht erreicht.

## QR-Rechnungen

Jeweils Seite 2 bei 300 dpi gerendert, mit zxing-cpp dekodiert. IBAN CH4431999123000889012 (Prüfziffer IBAN gültig, QR-IBAN, Referenztyp QRR), Währung CHF, Gläubiger Muster Immobilien AG; Referenz: Prüfziffer (Modulo 10 rekursiv) gültig und gleich `qr_bill_reference` in der Datenbank; Betrag = Saldo in der Datenbank; Zahlungspflichtiger = Mieter mit Adresse; Mitteilung «Nebenkostenabrechnung NK-…» in de, «Utility Cost Statement» en, «Décompte des charges» fr, «Conteggio spese accessorie» it.

| Abrechnung | Betrag | Referenz | Zahlungspflichtiger | Sprachen | Ergebnis |
|---|---|---|---|---|---|
| NK-22222222-2025-0002 | 141.60 | 001171594247150419313028503 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern | de fr it en | ok |
| NK-22222222-2025-0004 | 75.80 | 007559027385459630280230348 | Marco Bernasconi, Seeweg 15, 6003 Luzern | de fr it en | ok |
| NK-11111111-2025-0001 | 215.80 | 002064000989703039743170330 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich | de fr it en | ok |
| NK-11111111-2025-0003 | 142.35 | 008230324987609912516702426 | Pierre Dubois | de fr it en | ok |
| NK-11111111-2025-0004 | 238.10 | 012070251762405352938898639 | Maria Rossi | de fr it en | ok |

NK-22222222-2025-0003 (Brunner) hat zu Recht keine QR-Rechnung (Rückerstattung). Ebenso keine bei den Rückerstattungen und den bezahlten Abrechnungen (kein «Zahlteil» im Text).

## Geprüft und bestanden

- NK-22222222-2025-0002 (Meier): Beträge, Anteile, Prozentwerte, Saldo und Rundung, QR, de/fr/it/en.
- NK-22222222-2025-0003 (Brunner): dasselbe, ohne QR (Rückerstattung).
- Alle 38 erwarteten Zahlenwerte je PDF (Kosten, Wohnungsanteile, Ihr Anteil, Zwischensumme, Pauschale, Saldo, Rechnungsbeträge, Profil- und Mieterprozente) sind in allen vier Sprachen vorhanden (`recompute509.py`, Zeile «missing []»).
- Die 15 übrigen Abrechnungen: PDF unverändert gegenüber der Basis (Textgleichheit), Heizungsabschnitt ohne Heizprofil-Zeile.

## Nicht bestätigt

- Webseite (Abrechnungsdetail im Frontend :3300): Der Zugang läuft über Google-OAuth; ohne Anmeldung konnte ich die Seite nicht abrufen, und ein Token mit dem Stack-Geheimnis zu prägen habe ich nicht getan. Die Änderung betrifft nur das PDF; die Seite ist ungeprüft.
- Die gespeicherten Beträge der 15 übrigen Abrechnungen habe ich nicht unabhängig neu berechnet (das PDF ist textgleich zur Basis; Betragsregeln dort nicht Gegenstand der Änderung).
- Mischfall aus dem Fachreview M-1 (zweite Heizposition ohne Rechnungszeilen oder Rechnung ohne Leistungszeitraum neben einer mit): in den Demo-Daten nicht vorhanden, daher nicht im PDF geprüft; nur die Bedingung im Code gelesen (`noRunShare`: jede `byProfile`-Position mit `invoiceParts` und kein `noPeriod`). Er lässt sich mit den Demo-Daten nicht erzeugen, ohne Daten zu speichern.
- Lesbarkeit/Layout der PDFs habe ich nur über den Text und die QR-Seite geprüft, nicht Seite für Seite visuell.

## Hinweis zum Datenbestand (Seiteneffekt, nicht von mir verursacht, soweit feststellbar)

Zwischen meinem ersten Rendern und der Prüfung stehen bei allen sieben Entwürfen `pdf_generated_at` auf 18:55:06–18:55:07 (die Entwürfe waren vorher 18:51–18:54 gespeichert). Meine Skripte setzen `db.update` auf einen Stub (später per Zähler bestätigt: 1 Aufruf, keine Änderung der Zeilen); die nicht-Entwurf-Abrechnungen blieben unverändert. Vermutlich hat ein anderer Zugriff auf die Entwurfs-PDFs (die Route erstellt Entwurfs-PDFs frisch, `getStatementPdf`) die Zeitstempel gesetzt. Ich kann es nicht ausschliessen, dass mein erster Lauf beteiligt war; falls ja, wurde nur der abgeleitete PDF-Cache der Entwürfe neu geschrieben (gleiche Blob-Längen wie zuvor, gleiche Abrechnungsdaten, Datum heute).
