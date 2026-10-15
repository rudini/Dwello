# Datenprüfung #137, Runde 2

Geprüft: Commit `3976b25` (Delta `cbbaafa..3976b25`: `backend/src/services/calculation.service.ts`, Regel 5 in
`docs/nebenkostenabrechnung-anforderungen.md`), Worktree
`/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/review-137-daten2`.
Laufende App: Persona-Stack (Backend :3301, Frontend :3300, Datenbank `dwello_persona`) auf diesem Commit. Während der Prüfung hat der
Aufrufer den Stack versehentlich neu gestartet, und die Datenbank wurde neu erstellt. Alle Ergebnisse unten stammen aus einem
vollständigen zweiten Durchlauf nach diesem Neustart.

Eigene Nachrechnung: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/dp137r2/recompute.py`
(Runde-1-Skript, erweitert um Gruppen je Kategorie und Verteilschlüssel). Es liest Rechnungen, Kategorien, Verteilschlüssel,
Wohnungen, Mietverträge, Akonto und Heizprofil aus der Datenbank. Die Regeln stammen aus
`docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1 bis 9. Kein Dwello-Code ist importiert oder kopiert. Ergebnis:
`.../scratchpad/dp137r2/expected.json`, gespeicherte Werte: `.../scratchpad/dp137r2/stored.txt`.

Rappen-Regel, wie vom Aufrufer genannt und in der Nachrechnung umgesetzt:
1. Der Teil der Rechnung in der Periode wird auf Rappen gerundet.
2. Davon der Wohnungsanteil, auf Rappen gerundet.
3. Davon der Zeitanteil (Mietstage im Leistungszeitraum / Tage des Leistungszeitraums in der Periode), auf Rappen gerundet.

## Testdaten

Nur eigene Datensätze, neu angelegt mit `.../scratchpad/dp137r2/setup.py` (die IDs liest das Skript aus der Datenbank).
Heizprofil «Heizung Mittelland» (Mai 3.5 %, Juni bis August 0 %), Verwaltungspauschale 3 %, wie in Runde 1.

| Kürzel | Abrechnung | Mietvertrag | Periode | Fall |
|---|---|---|---|---|
| S1 | NK-53713B3D-2025-0001 | Sommer, A1 (80 von 180 m²), ab 15.07.2025, Akonto 150 | 01.06.–31.08.2025 | Sommerperiode, Einzug |
| S3 | NK-53713B3D-2025-0002 | Mai, C1 (40 m²), ab 16.05.2025, Akonto 90 | 01.05.–31.08.2025 | Periode mit Heizanteil, Einzug (Heizprofil) |
| S4 | NK-53713B3D-2025-0003 | Voll, B1 (60 m²), ab 01.01.2024, Akonto 120 | 01.06.–31.08.2025 | Zusätzlich: Sommerperiode, ganze Periode gemietet |
| S6 | NK-F16F4663-2025-0001 | Leistung, L1 (70 m², einzige Wohnung), ab 15.07.2025, Akonto 100, mit Adresse | 01.06.–31.08.2025 | Sommerperiode, Einzug; Heizung 920.00 und Hauswart 920.00 (Fläche), beide mit Leistungszeitraum 01.07.–30.09.2025 |
| S7 | NK-7D60D859-2025-0001 | Mix, M1 (50 von 80 m²), ab 15.07.2025, Akonto 80 | 01.06.–31.08.2025 | Zusätzlich: je Kategorie eine Rechnung mit Leistungszeitraum (920.00, 01.07.–30.09.2025) und eine ohne (310.00, 10.08.2025) in derselben Gruppe; Heizung und Hauswart identisch erfasst |
| S8 | NK-50982EAB-2025-0001 | Rappen, P1 (55 von 100 m²), ab 15.07.2025, Akonto 95, mit Adresse | 01.06.–31.08.2025 | Zusätzlich, für die Rappen-Regel: Heizung 1'000.00 und Hauswart 1'000.00 (Fläche) mit Leistungszeitraum 01.07.–30.09.2025; Teil in der Periode 1'000 × 62/92 = 673.913… |

Gebäude «Datenprüfung 137» hat dieselben vier Rechnungen wie in Runde 1:
- Heizöl 1'234.55, Schlüssel Heizung 70/30
- Heizung Wartung 317.30, Fläche
- Hauswart 905.15, Fläche
- Hauswart 213.40, Pro Einheit

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | Keine neuen Befunde |

D-1 aus Runde 1 ist behoben (siehe unten). D-2 und D-3 sind offene Arbeit in #208; ich habe sie hier nicht neu bewertet.

### D-1 (Runde 1, Major): behoben

S6, nachgerechnet mit `recompute.py`:

```
NK-F16F4663-2025-0001 48 / 92 sub 960.00 fee 28.80 total 988.80 ak 154.84 before 833.96 rnd -0.01 saldo 833.95
   grp Fernwärme Q3   620.00 620.00 share 48/62 480.00
   grp Hauswart Q3 LZ 620.00 620.00 share 48/62 480.00
```

Gespeichert (`utility_statement_line_items`, `utility_statements`):

```
NK-F16F4663-2025-0001 | Caretaker | 620.00 | 620.00 | 0.7742 | 480.00
NK-F16F4663-2025-0001 | Heating   | 620.00 | 620.00 | 0.7742 | 480.00
rental_days 48 | total_costs 988.80 | management_fee 28.80 | total_advance_payments 154.84 | balance 833.95
```

PDF de; fr, it und en zeigen dieselben Beträge:

```
Heizung    Pro Fläche (m²)   620.00   620.00   77.42 %   480.00
Hauswart   Pro Fläche (m²)   620.00   620.00   77.42 %   480.00
Zwischensumme 960.00 · Verwaltungspauschale 3 % 28.80 · Ihre Nebenkosten 988.80 · Geleistete Akontobeiträge – 154.84
Nachzahlung vor Rundung 833.96 · Rundung auf 5 Rappen – 0.01 · Nachzahlung 833.95
```

Die Detailseite zeigt dieselben Beträge. Heizung und Hauswart werden jetzt gleich gerechnet, wie es Regel 5 in der Fassung von
`3976b25` verlangt («dann wie jede andere Rechnung, mit ihrem Leistungszeitraum»).

Die Heizungszeile zeigt «77.42 %» statt «48/62 Tage», genau wie die Hauswartzeile. Das ist dieselbe Art wie D-3 (#208); nicht neu
bewertet.

S7 bestätigt den Fix auch für eine Gruppe mit gemischten Rechnungen, mit und ohne Leistungszeitraum. Heizung und Hauswart sind
gleich, und beide stimmen mit der Nachrechnung:

```
recompute:   Heizung  930.00 581.25 share 0.690042 401.09 (Summe je Rechnung 300.00 + 101.09 = 401.09)
             Hauswart 930.00 581.25 share 0.690042 401.09
             sub 802.18 fee 24.07 total 826.25 ak 123.87 before 702.38 rnd +0.02 saldo 702.40
gespeichert: Heating 930.00 581.25 0.6900 401.09 | Caretaker 930.00 581.25 0.6900 401.09 | 826.25 | 24.07 | 123.87 | 702.40
```

S8 übt die Rappen-Regel mit einem krummen Teil in der Periode aus. Gerechnet: 673.913 → 673.91, dann × 55/100 = 370.65, dann
× 48/62 = 286.95.

```
recompute:   Heizung 673.91 370.65 48/62 286.95 | Hauswart 673.91 370.65 48/62 286.95
             sub 573.90 fee 17.22 total 591.12 ak 147.10 before 444.02 rnd -0.02 saldo 444.00
gespeichert: Heating 673.91 370.65 0.7742 286.95 | Caretaker 673.91 370.65 0.7742 286.95 | 591.12 | 17.22 | 147.10 | 444.00
PDF de:      Nachzahlung vor Rundung 444.02 · Rundung auf 5 Rappen – 0.02 · Nachzahlung 444.00
```

## Geprüft und bestanden

Je Abrechnung habe ich geprüft:
- Kosten Liegenschaft, Wohnungsanteil, Zeitanteil und Ihr Anteil jeder Position
- Zwischensumme, Verwaltungspauschale, Ihre Nebenkosten, Geleistete Akontobeiträge
- Saldo vor Rundung, Rundung auf 5 Rappen mit Vorzeichen, Saldo

Verglichen habe ich diese Werte mit drei Quellen:
- **Datenbank.**
- **Detailseite:** serverseitig gerendert und mit dem Sitzungs-Cookie `dwello_session` abgerufen. Die Seite zeigt keinen
  Wohnungsanteil. Beträge ab 1'000 schreibt sie mit typografischem Apostroph (`1’234.55`), darum hat der einfache Textvergleich sie
  nicht gefunden. Der Wert stimmt.
- **PDF in de, fr, it und en:** `checkpdf.py` meldet für alle 24 PDFs «missing amounts: []».

| Abrechnung | Ergebnis |
|---|---|
| S1 NK-53713B3D-2025-0001 | Wie in Runde 1: Heizung 73.58 und 264.80, Hauswart 209.89, alle drei «48/92 Tage» (jours/giorni/days); 548.27 / 16.45 / 564.72 / 232.26 / 332.46 / −0.01 / Nachzahlung 332.45. In allen vier Sprachen kein Heizprofil-Hinweis; Art.-8-Hinweis vorhanden (VMWG/OBLF/OLAL/VMWG). Bestanden |
| S3 NK-53713B3D-2025-0002 | Wie in Runde 1: Heizung 36.39 und 162.84 mit «51.61 %» nach Heizprofil, Hauswart 62.46 und 176.61 mit 108/123 Tagen; 438.30 / 13.15 / 451.45 / 316.45 / Nachzahlung 135.00 ohne Rundungszeile. Heizprofil-Satz, Monatsabschnitt (Mai 1.81 %, Juni bis August 0.00 %) und Art.-8-Hinweis in allen vier Sprachen. Bestanden |
| S4 NK-53713B3D-2025-0003 | Wie in Runde 1: 105.77 / 411.52 / 301.72, «92/92 Tage»; 819.01 / 24.57 / 843.58 / 360.00 / 483.58 / +0.02 / 483.60. Kein Heizprofil-Hinweis in allen vier Sprachen. Bestanden |
| S6 NK-F16F4663-2025-0001 | Wie oben unter D-1. Kein Heizprofil-Hinweis; Satz «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode.» und Art.-8-Hinweis in allen vier Sprachen. Bestanden |
| S7 NK-7D60D859-2025-0001 | Wie oben; Rundung +0.02 auf Webseite und PDF. Bestanden |
| S8 NK-50982EAB-2025-0001 | Wie oben; Rundung −0.02 auf Webseite und PDF; kein Heizprofil-Hinweis. Bestanden |

QR-Rechnungen: Je PDF habe ich die letzte Seite mit `pdftoppm -png -r 300` gerendert und mit `zxing-cpp` aus
`.../scratchpad/dp137/py` dekodiert (Skript `.../scratchpad/dp137r2/qr.py`). Für alle 24 PDFs (S1, S3, S4, S6, S7, S8, je de/fr/it/en)
gilt:
- **IBAN:** CH44 3199 9123 0008 8901 2. Es ist eine QR-IBAN, die Prüfsumme ist gültig.
- **Gläubiger:** Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH.
- **Währung:** CHF; Referenztyp QRR.
- **Referenz:** Die Prüfziffer (Modulo 10 rekursiv) ist gültig, und die Referenz ist gleich der gespeicherten `qr_bill_reference`.
- **Mitteilung:** je nach Sprache «Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie / Utility Cost Statement»
  mit der Abrechnungsnummer.

| Abrechnung | Betrag (= Nachrechnung = gespeichert) | Referenz | Schuldner | Ergebnis |
|---|---|---|---|---|
| S6 | 833.95 | 007512547140483807651877474 | S / Leistung Datenprüfung137 / Prüfweg 2 / – / 8400 / Winterthur / CH; im Zahlteil «Zahlbar durch» mit derselben Adresse | Bestanden |
| S8 | 444.00 | 002325301114536797576687745 | S / Rappen Datenprüfung137 / Prüfweg 4 / – / 8400 / Winterthur / CH | Bestanden |
| S1 | 332.45 | 006308667091056511966060463 | leer (Mieter ohne Adresse, zulässig) | Bestanden |
| S3 | 135.00 | 004512124920894073466827422 | leer | Bestanden |
| S4 | 483.60 | 003521434556337646682497454 | leer | Bestanden |
| S7 | 702.40 | 005160484793354920836860096 | leer | Bestanden |

### Reproduktion

Im Ordner `.../scratchpad/dp137r2/` nacheinander:
1. `python3 setup.py $PWD`
2. `python3 recompute.py > expected.json`
3. `python3 pdfs.py $PWD`
4. `pdftotext -layout` für jedes PDF
5. `python3 checkpdf.py`
6. `pdftoppm -png -r 300` für die letzte Seite jedes PDFs
7. `python3 -I qr.py`

Datenbank, gespeicherte Positionen von S6:
`select s.statement_number,l.description,l.total_amount,l.apartment_share,l.period_share,l.tenant_share from utility_statement_line_items l join utility_statements s on s.id=l.statement_id where s.statement_number='NK-F16F4663-2025-0001'`.

## Nicht bestätigt

- **Rappen-Regel, Unterscheidung:** In S8 ergibt «Teil erst auf Rappen runden» dasselbe Ergebnis wie «ungerundet weiterrechnen»
  (370.6522 und 370.6505 geben beide 370.65). Der Fall zeigt also, dass die App richtig rechnet. Er zeigt nicht, welche der beiden
  Rechenwege sie nimmt. Belegt ist nur, dass der gespeicherte und gedruckte Betrag «Kosten Liegenschaft» der gerundete Teil 673.91 ist.
- **Sprachen der Detailseite:** Ich habe nur die deutsche Seite (Server-Rendering) geprüft; fr, it und en nur im PDF. Rätoromanisch
  (`rm`) habe ich wie in Runde 1 nicht geprüft.
- **Laufendes Backend:** Es läuft aus dem Arbeitsbaum des Aufrufers (`/home/user/Dwello/backend`, `bun run src/index.ts`). Um den
  Commit festzustellen, habe ich dort einmal `git log --oneline -1` und `git status --short` gelesen: HEAD `3976b25`, keine
  Änderungen. Sonst habe ich im Arbeitsbaum des Aufrufers nichts ausgeführt.
- **Akonto und Heizprofil bei angebrochenem Monat:** Die Dokumente regeln das weiterhin nicht (wie in Runde 1). App und Nachrechnung
  rechnen beide nach Tagen des Monats.

## Hinterlassene Daten in `dwello_persona`

Ich habe vier eigene Gebäude angelegt: «Datenprüfung 137», «Datenprüfung 137 LZ», «Datenprüfung 137 MIX» und «Datenprüfung 137 RP».
Dazu gehören Wohnungen, Mieter mit Nachname «Datenprüfung137», Mietverträge, Rechnungen und die Abrechnungen S1, S3, S4, S6, S7 und
S8. Die Abrechnungen sind Entwürfe; ihre PDFs sind zuletzt in der Sprache des Mieters erzeugt. Keine Demo-Datensätze verändert.
