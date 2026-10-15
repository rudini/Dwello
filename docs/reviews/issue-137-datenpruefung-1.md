# Datenprüfung #137, Runde 1

Geprüft: Commit `cbbaafa` (Änderung `25ce827..cbbaafa`, `backend/src/services/{prorating,statement-pdf,pdf}.service.ts`), Worktree
`/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/review-137-daten`.
Laufende App: Persona-Stack (Backend :3301, Frontend :3300, Datenbank `dwello_persona`). Der Stack startet das Backend aus dem
Arbeitsbaum des Aufrufers, nicht aus dem Worktree; das Verhalten entspricht dem Commit (Sommerfall zeigt «Tage», kein Heizprofil-Hinweis).

Eigene Nachrechnung: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/dp137/recompute.py` (liest
Rechnungen, Kategorien, Verteilschlüssel, Wohnungen, Mietverträge, Akonto, Heizprofil direkt aus der Datenbank; Regeln aus
`docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello» 1 bis 9; kein Dwello-Code importiert oder kopiert).
Ergebnis: `.../scratchpad/dp137/expected.json`.

## Testdaten (neu angelegt, nur eigene Datensätze)

Gebäude «Datenprüfung 137» (A1 80 m², B1 60 m², C1 40 m²) und «Datenprüfung 137 LZ» (L1 70 m²); Mieter mit Nachname
«Datenprüfung137»; Heizprofil «Heizung Mittelland» (vordefiniert: Mai 3.5 %, Juni bis August 0 %); Verwaltungspauschale 3 %.

| Kürzel | Abrechnung | Mietvertrag | Periode | Fall |
|---|---|---|---|---|
| S1 | NK-5356B980-2025-0001 | Sommer, A1, ab 15.07.2025, Akonto 150 | 01.06.–31.08.2025 | Sommerperiode, Einzug (Kern von #137) |
| S2 | NK-5356B980-2025-0002 | Sommer, A1 | 01.05.–31.08.2025 | Vergleich: Periode mit Heizanteil (Mai), gemietete Monate 0 % |
| S3 | NK-5356B980-2025-0003 | Mai, C1, ab 16.05.2025, Akonto 90 | 01.05.–31.08.2025 | Vergleich: Periode mit Heizanteil, Mieteranteil > 0 |
| S4 | NK-5356B980-2025-0004 | Voll, B1, ab 01.01.2024, Akonto 120 | 01.06.–31.08.2025 | Sommerperiode, ganze Periode gemietet |
| S5 | NK-5356B980-2025-0005 | Voll, B1 | 01.05.–31.08.2025 | Periode mit Heizanteil, ganze Periode gemietet |
| S6 | NK-93A9F4A5-2025-0001 | Leistung, L1, ab 15.07.2025, Akonto 100 | 01.06.–31.08.2025 | Sommerperiode, Einzug, Rechnungen mit Leistungszeitraum 01.07.–30.09.2025 |

Rechnungen «Datenprüfung 137»: Heizöl 1'234.55 (10.07.2025, Schlüssel Heizung 70/30), Heizung Wartung 317.30 (20.06.2025, Fläche),
Hauswart 905.15 (05.08.2025, Fläche), Hauswart 213.40 (20.05.2025, Pro Einheit). «Datenprüfung 137 LZ»: Heizung 920.00 und Hauswart
920.00, beide Fläche, Leistungszeitraum 01.07.–30.09.2025.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Major | S6 NK-93A9F4A5-2025-0001, Position Heizung (Leistungszeitraum 01.07.–30.09.2025) | Zeitanteil 48/62 Tage, Ihr Anteil 480.00; Zwischensumme 960.00, Pauschale 28.80, Ihre Nebenkosten 988.80, Saldo vor Rundung 833.96, Rundung −0.01, Nachzahlung 833.95 (QR 833.95) | Zeitanteil «48/92 Tage» (period_share 0.5217), Ihr Anteil 323.48; Zwischensumme 803.48, Pauschale 24.10, Ihre Nebenkosten 827.58, vor Rundung 672.74, Rundung +0.01, Nachzahlung 672.75 (Datenbank, Webseite, PDF de/fr/it/en, QR) |
| D-2 | Minor | S5 NK-5356B980-2025-0005, beide Heizungspositionen | Mietvertrag läuft die ganze Periode: Heizkosten nach Tagen, «123/123 Tage», kein Heizprofil-Hinweis, keine Heizprofil-Zeile im Text (Regel 5) | «100.00 %», Satz «…, bei Heizkosten der Anteil nach dem Heizprofil», Abschnitt «Heizkosten nach Heizprofil «Heizung Mittelland»: 100.00 % …» (alle vier Sprachen). Beträge stimmen. Vorbestehend |
| D-3 | Minor | S6 NK-93A9F4A5-2025-0001, Position Hauswart (Leistungszeitraum) | Zeitanteil als Bruch der Mietstage: «48/62 Tage» (Thema 6, Betragsformat) | «77.42 %» (Betrag 480.00 stimmt). Vorbestehend, ausserhalb der Änderung |

### D-1 (Major): Sommerfall mit Leistungszeitraum rechnet Heizkosten über die Tage der Periode statt des Leistungszeitraums

Regel 5 (mit diesem Commit ergänzt): Heizkosten werden «ohne Heizprofil auch … nach Tagen, ebenso wenn die Monate der Periode im
Heizprofil zusammen 0 % haben». «Nach Tagen» heisst laut Regel 5 «mit Leistungszeitraum seine Mietstage darin / Tage des
Leistungszeitraums in der Periode». Die Hauswart-Rechnung mit demselben Leistungszeitraum wird so gerechnet (480.00), die Heizung nicht.

Eigene Rechnung (`recompute.py`):

```
NK-93A9F4A5-2025-0001 48 / 92 sub 960.00 fee 28.80 total 988.80 ak 154.84 before 833.96 rnd -0.01 saldo 833.95
    Fernwärme Q3 620.00 620.00 days 48/62 480.00
    Hauswart Q3 LZ 620.00 620.00 days 48/62 480.00
```

Gespeichert:

```
NK-93A9F4A5-2025-0001 | Heating   | 620.00 | 620.00 | 0.5217 | 323.48
NK-93A9F4A5-2025-0001 | Caretaker | 620.00 | 620.00 | 0.7742 | 480.00
rental_days 48 | total_costs 827.58 | management_fee 24.10 | total_advance_payments 154.84 | balance 672.75
```

PDF (de): `Heizung  Pro Fläche (m²)  620.00  620.00  48/92 Tage  323.48` und `Hauswart  Pro Fläche (m²)  620.00  620.00  77.42 %  480.00`;
QR-Betrag 672.75. Der Mieter zahlt CHF 161.20 zu wenig (833.95 − 672.75).

Ursache (Code gelesen, nicht kopiert): der Sommerzweig in `handleMidYearMoves` (`backend/src/services/prorating.service.ts`,
`if (period.percentage <= 0)`) teilt durch `calculateDaysBetween(periodStart, periodEnd)`; der Aufruf in
`calculation.service.ts` (Heizkosten-Zweig) übergibt nur die Periode, nicht den Leistungszeitraum, während der Tage-Zweig daneben
`rentalShare(group, …)` nutzt. Der Betrag ist vorbestehend (`calculation.service.ts` ist im Diff unverändert, `prorating.service.ts`
ergänzt nur `byDays`). Neu durch #137: die Zeile heisst jetzt «48/92 Tage» und widerspricht damit sichtbar der Hauswart-Zeile mit
demselben Leistungszeitraum im selben PDF und der in diesem Commit geschriebenen Regel 5. Vorher stand dort ein Heizprofil-Anteil.
Verwandt mit #71 (Heizprofil und Leistungszeitraum), das aber nur den Profilfall behandelt, nicht den Tage-Fall.

Reproduktion: `python3 .../dp137/setup.py .../dp137` (Gebäude 1), dann `python3 .../dp137/setup2.py .../dp137` (Gebäude LZ und S5/S6),
`python3 .../dp137/recompute.py`, `python3 .../dp137/pdfs.py .../dp137`, `pdftotext -layout .../dp137/pdf/S6-de.pdf -`.
Datenbank: `select description,total_amount,apartment_share,period_share,tenant_share from utility_statement_line_items where statement_id='9cbbbdb2-496e-4759-b0a5-5e7046b25659'`.

### D-2 (Minor, vorbestehend): Ganze Periode gemietet, Periode mit Heizanteil, PDF zeigt Heizprofil

Regel 5: nach dem Heizprofil nur «für einen Mietvertrag, der nur einen Teil der Periode läuft», alle anderen nach Tagen.
S5 (Mietvertrag seit 01.01.2024, Periode 01.05.–31.08.2025):

```
Heizung   Pro Fläche (m²)   317.30   105.77   100.00 %   105.77
Heizung   Heizung (Fläche 70% / …)   1'234.55   411.52   100.00 %   411.52
Hauswart  Pro Einheit   213.40   71.13   123/123 Tage   71.13
… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode, bei Heizkosten der Anteil nach dem Heizprofil.
Heizkosten nach Heizprofil «Heizung Mittelland»: 100.00 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode
```

Derselbe Mietvertrag in der Sommerperiode (S4) zeigt «92/92 Tage» ohne Hinweis. Die Beträge stimmen auf den Rappen (Ergebnis
gleich, 100 %). Vorbestehend: im Basis-Commit war `byProfile: heating && !!statement.heatingProfileId`, also für jede Heizungsposition
mit Heizprofil. Reproduktion: `pdftotext -layout .../dp137/pdf/S5-de.pdf - | grep -n "%\|Tage"`.

### D-3 (Minor, vorbestehend, ausserhalb der Änderung): Zeitanteil einer Rechnung mit Leistungszeitraum als Prozent

S6, Hauswart: `period_share 0.7742` = 48/62, PDF druckt «77.42 %» statt «48/62 Tage»; Thema 6 verlangt «den Zeitanteil als Bruch
der Mietstage drucken, damit die Zeile mit dem Taschenrechner aufgeht». Gilt in allen vier Sprachen. Betrag 480.00 stimmt.

## Geprüft und bestanden

Je Abrechnung: Wohnungsanteil, Zeitanteil, Ihr Anteil jeder Position, Zwischensumme, Verwaltungspauschale, Ihre Nebenkosten,
Geleistete Akontobeiträge, Saldo vor Rundung, Rundung auf 5 Rappen (Vorzeichen), Saldo; verglichen mit Datenbank, Detailseite
(`/statements/:id`, serverseitig gerendert, mit Sitzungs-Cookie abgerufen) und PDF in de, fr, it, en.

| Abrechnung | Ergebnis |
|---|---|
| S1 NK-5356B980-2025-0001 | Heizung 73.58 und 264.80, Hauswart 209.89; Zwischensumme 548.27, Pauschale 16.45, Ihre Nebenkosten 564.72, Akonto 232.26, vor Rundung 332.46, Rundung −0.01, Nachzahlung 332.45. Alle drei Positionen «48/92 Tage» (jours/giorni/days). Kein Heizprofil-Hinweis, kein Abschnitt «Heiz- und Warmwasserkosten», Satz endet «… Mietstage in der Abrechnungsperiode.» in allen vier Sprachen; Hinweis Art. 8 Abs. 1 VMWG vorhanden (de «Art. 8 Abs. 1 VMWG», fr «art. 8 al. 1 OBLF», it «art. 8 cpv. 1 OLAL», en «Art. 8 para. 1 VMWG»). Bestanden |
| S2 NK-5356B980-2025-0002 | Heizung 0.00 und 0.00 (Profil: gemietete Monate Jul/Aug 0 % von 3.5 %), Hauswart 27.76 und 156.99 (48/123 Tage); 184.75 / 5.54 / 190.29 / 232.26 / −41.97 / +0.02 / Rückerstattung 41.95. Heizung «0.00 %», Heizprofil-Satz und Abschnitt vorhanden, Art.-8-Hinweis vorhanden. Bestanden |
| S3 NK-5356B980-2025-0003 | Heizung 36.39 und 162.84 mit «51.61 %» (Mai 3.5 % × 16/31 = 1.81 % von 3.5 %), Hauswart 62.46 und 176.61 (108/123 Tage); 438.30 / 13.15 / 451.45 / 316.45 / Nachzahlung 135.00 ohne Rundungszeile. Heizprofil-Satz, Abschnitt «Mai 1.81 %, Jun 0.00 %, Jul 0.00 %, Aug 0.00 %» und Art.-8-Hinweis in allen Sprachen. Bestanden |
| S4 NK-5356B980-2025-0004 | 105.77 / 411.52 / 301.72, «92/92 Tage»; 819.01 / 24.57 / 843.58 / 360.00 / 483.58 / +0.02 / 483.60. Kein Heizprofil-Hinweis, Art.-8-Hinweis vorhanden. Bestanden |
| S5 NK-5356B980-2025-0005 | Beträge: 890.14 / 26.70 / 916.84 / 480.00 / 436.84 / +0.01 / 436.85. Bestanden; Darstellung siehe D-2 |
| S6 NK-93A9F4A5-2025-0001 | Akonto 154.84 und Hauswart 480.00 stimmen, kein Heizprofil-Hinweis, Art.-8-Hinweis vorhanden; Heizung und Saldo siehe D-1 |

QR-Rechnungen (letzte PDF-Seite mit `pdftoppm -png -r 300` gerendert, mit `zxing-cpp` aus dem Scratchpad dekodiert, Skript
`.../dp137/qr.py`), je de/fr/it/en:

| Abrechnung | IBAN | Betrag | Referenz (QRR, Prüfziffer Modulo 10 rekursiv) | Mitteilung | Ergebnis |
|---|---|---|---|---|---|
| S1 | CH44 3199 9123 0008 8901 2 (QR-IBAN, Prüfsumme gültig) | 332.45 | 002211870939945595297280015, gültig, = gespeicherte `qr_bill_reference` | «Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie / Utility Cost Statement NK-5356B980-2025-0001» | Bestanden |
| S3 | wie oben | 135.00 | 003539746694120798446992269, gültig, = gespeichert | wie oben mit -0003 | Bestanden |
| S4 | wie oben | 483.60 | 003709072493030364052018093, gültig, = gespeichert | wie oben mit -0004 | Bestanden |
| S5 | wie oben | 436.85 | 007185124131235460281559519, gültig, = gespeichert | wie oben mit -0005 | Bestanden |
| S6 | wie oben | 672.75 (= gespeicherter Saldo; erwartet 833.95, siehe D-1) | 007401523815380053546559090, gültig, = gespeichert | wie oben mit NK-93A9F4A5-2025-0001 | Betrag siehe D-1, Rest bestanden |
| S2 | – | Rückerstattung: kein QR-Code auf der Seite, wie erwartet | – | – | Bestanden |

Schuldner: Die Testmieter hatten zuerst keine Adresse, der QR-Code führt dann keinen Schuldner (leer, zulässig). Nach dem Erfassen
einer Adresse für «Sommer Datenprüfung137» und neuem PDF (S1, de) enthält der QR-Code `S / Sommer Datenprüfung137 / Prüfweg 1 /  /
8400 / Winterthur / CH`, Betrag 332.45, gleiche Referenz; der Zahlteil zeigt «Zahlbar durch» mit derselben Adresse. Bestanden.

## Nicht bestätigt

- **Akonto bei angebrochenem Monat:** Die Dokumente sagen nicht, wie ein angebrochener Monat zählt (Glossar: «Summe der monatlichen
  Vorauszahlungen … während der Abrechnungsperiode»). Ich habe nach Tagen des Monats gerechnet (150 × (17/31 + 1) = 232.26); die App
  rechnet gleich. Die Regel selbst ist damit nicht aus den Dokumenten bestätigt.
- **Heizprofil bei angebrochenem Monat:** ebenfalls nicht dokumentiert; ich habe den Monatsanteil nach Tagen des Monats gekürzt
  (Mai 3.5 % × 16/31), die App gleich (S3 51.61 %).
- **Rätoromanisch (`rm`):** `pdf.service.ts` hat keine eigene `rm`-Übersetzung; ein PDF in `rm` habe ich nicht erzeugt.
- **Basis-Commit nicht laufend geprüft:** «vorbestehend» bei D-1 bis D-3 stützt sich auf den Diff (`calculation.service.ts`
  unverändert, alte Zeile `byProfile: heating && !!statement.heatingProfileId`), nicht auf eine laufende App mit `25ce827`; der
  Persona-Stack durfte nicht neu gestartet werden.
- **Detailseite:** nur als serverseitig gerendertes HTML (curl mit Sitzungs-Cookie) geprüft, nicht im Browser. Sie zeigt den Anteil
  als `share_percentage` (z. B. 23.19 %) und «Heizprofil: Heizung Mittelland» als Einstellung des Laufs (auch im Sommerfall);
  #137 betrifft nur das PDF, darum kein Befund.
- **Laufendes Backend:** Es läuft aus dem Arbeitsbaum des Aufrufers (`persona-stack.sh`), nicht aus dem Worktree `cbbaafa`. Ich habe
  nicht geprüft, welcher Commit dort stand; das Verhalten entspricht dem Diff von `cbbaafa`.

## Hinterlassene Daten in `dwello_persona`

Gebäude «Datenprüfung 137» und «Datenprüfung 137 LZ» mit Wohnungen, Mietern «… Datenprüfung137», Mietverträgen, sechs Rechnungen und
den Abrechnungen S1 bis S6 (Entwürfe, PDFs erzeugt; S1 zuletzt auf Deutsch mit Mieteradresse). Keine Demo-Datensätze verändert.
