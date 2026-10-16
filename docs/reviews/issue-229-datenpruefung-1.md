# Datenprüfung #229, Runde 1

Geprüfter Commit: `fc20902b` (Worktree `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-229-daten`), Änderung `aa36a10a..fc20902b`.
Laufende App: Backend :3301 (Prozess aus `/home/user/dwello/backend`, HEAD dort `fc20902b`, Arbeitsbaum sauber, gestartet 07:31:27), Frontend :3300, Datenbank `dwello_persona` (17 Abrechnungen, alle aus den Demodaten von 07:30).
Persona Dr. Weber hat keine Abrechnung erstellt (Koordinator: Lauf ohne neue Abrechnung beendet); bis 08:00 kam keine neue Zeile in `utility_statements` dazu.

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| – | – | – | – | – |

Keine Befunde. Alle Werte auf den Rappen und auf zwei Prozentstellen gleich.

## Vorgehen und Belege

Skripte und Ausgaben, alle im Scratchpad `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp229/`:

- `export.sh`: liest Rechnungen, Wohnungen, Mietverträge, Verteilschlüssel, Heizprofile, Tankbestände, Abrechnungen, Positionen, Mieter als JSON aus `dwello_persona` (nur `select`).
- `recompute229.py`: eigene Neuberechnung nach den Regeln 1–10 von `docs/nebenkostenabrechnung-anforderungen.md` (kein Dwello-Code). Heizanteil: Summe der Monatsanteile der Mietzeit / Summe der Monatsanteile der Periode, ein angebrochener Monat nach Tagen (Monatsanteil × Miettage im Monat / Tage des Monats); nach Heizprofil nur bei Ein- oder Auszug und wenn die Periode im Profil > 0 % hat. Prüft `heating_share.byDays`, `.percent` (= `period_share` × 100), `.periodPercent`, `.months`, alle Positionen (Gesamtkosten, Wohnungsanteil, Zeitanteil, Betrag), Akonto, Verwaltungspauschale, Gesamtkosten, Saldo auf 5 Rappen. Ausgabe `recompute.out`: `MISMATCHES: 0` (546 Prüfungen über 17 Abrechnungen).
- `checkpdf229.py`: Text der PDFs (`pdftotext`) gegen `expected.json`: Prozent im Hinweis und in der Position, Monatsliste in der Sprache, Satz «zusammen x %. Die Monate der Abrechnungsperiode … y %» genau dann, wenn y ≠ 100.00, mit x = Summe der gedruckten Monate; Saldo und Saldo vor Rundung. Ausgabe `checkpdf.out`: `MISMATCHES 0`.
- `qr.py` (zxing-cpp im Scratchpad-venv) dekodiert die mit `pdftoppm -png -r 200` gerenderten Seiten; `qrcheck.py` prüft Kopf, IBAN (mod 97, QR-IID 31999), Kreditor, Betrag, Währung, Schuldner, Referenztyp QRR, Referenz = gespeichert, 27 Stellen, Prüfziffer Modulo 10 rekursiv, Mitteilung, Trailer. Ausgabe `qrcheck.out`: `MISMATCHES 0`.
- Webseite: `/statements/<id>` mit einer selbst signierten Sitzung (nur GET), Text in `web/`.

Reproduzieren:

```bash
S=/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dp229
$S/export.sh $S/in && python3 -I $S/recompute229.py $S/in | tail -1
python3 -I $S/checkpdf229.py $S/expected.json $S/pdf/*.pdf | tail -1
$S/../venv/bin/python -I $S/qr.py $S/png/*.png > $S/qr.out && python3 -I $S/qrcheck.py $S | tail -1
```

Gespeicherte Werte (Abfrage `select statement_number, heating_share::text from utility_statements where heating_share->>'byDays'='false'`):

- NK-22222222-2025-0002: `percent` 55.8, `periodPercent` 100, Monate Jan 13.6 … Jun 3.7; Heizung `period_share` 0.5580, 1'054.47 × 0.558 = 588.39.
- NK-22222222-2025-0003: `percent` 44.2, `periodPercent` 100, Monate Jul 3.7 … Dez 13.0; Heizung `period_share` 0.4420, 1'054.47 × 0.442 = 466.08.

## Geprüft und bestanden

Nach Heizprofil (Mieterwechsel A2 «Seepark Residenz», Profil «Heizung + Warmwasser», Periode 01.01.–31.12.2025):

- **NK-22222222-2025-0002** (Sarah Meier, bis 30.06.2025, Entwurf): `percent` 55.80 = `period_share` 0.5580 × 100; `periodPercent` 100.00 (12 Monate); Monate Jan–Jun wie neu berechnet, Summe 55.80. PDF de/fr/it/en und das gespeicherte PDF: Hinweis und Position 55.80 %, Monatsliste in der Sprache, **kein** Satz zu den Summen (Periode = 100.00 %). Beträge: Zwischensumme 1'415.51, Verwaltungspauschale 3 % 42.47, Gesamtkosten 1'457.98, Akonto 1'320.00, vor Rundung 137.98, Rundung + 0.02, Nachzahlung 138.00 (Datenbank, Webseite, PDF gleich). QR-Rechnung de/fr/it/en/gespeichert: IBAN CH4431999123000889012 (mod 97 gültig, QR-IID 31999), Betrag 138.00 CHF, Referenz QRR 001944976666071834644006463 (Prüfziffer gültig, = gespeichert), Mitteilung «Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie / Utility Cost Statement NK-22222222-2025-0002», Schuldner Sarah Meier, Hirschmattstrasse 21, 6003 Luzern, CH.
- **NK-22222222-2025-0003** (Nina Brunner, ab 01.07.2025, Entwurf): `percent` 44.20 = 0.4420 × 100; `periodPercent` 100.00; Monate Jul–Dez, Summe 44.20. PDF de/fr/it/en/gespeichert: 44.20 % in Hinweis und Position, Monatsliste, kein Summensatz. Zwischensumme 1'306.92, Pauschale 39.21, Gesamtkosten 1'346.13, Akonto 1'440.00, vor Rundung −93.87, Rundung − 0.02, Rückerstattung 93.85 (Datenbank, Webseite, PDF gleich). Keine QR-Rechnung (Rückerstattung), richtig.

Ohne Heizprofil-Anteil (ganze Periode gemietet, `heating_share.byDays = true`), alle Positionen, Akonto, Pauschale, Saldo auf 5 Rappen gegen die Datenbank bestanden: NK-11111111-2024-0001 … 0004, NK-11111111-2025-0001 … 0004, NK-22222222-2024-0001 … 0003, NK-22222222-2025-0001, NK-22222222-2025-0004, NK-33333333-2024-0001, 0002. Deren Beträge ändert die Änderung nicht; ihre PDFs und QR-Rechnungen wurden in dieser Runde nicht neu geprüft (Diff berührt nur den Heizprofil-Hinweis).

Webseite beider Abrechnungen: Heizprofil «Heizung + Warmwasser» (neu aus `heating_share.names`), Beträge der Positionen und Saldo wie oben.

Nebenwirkung meiner Prüfung: Für die zwei Entwürfe 0002 und 0003 habe ich die PDFs in fr, it, en und zuletzt wieder de erzeugt (`POST /api/v1/statements/:id/generate-pdf`, vom Koordinator erlaubt). Gespeichert ist wieder das deutsche PDF; Abrechnungsdatum (16.10.2026) und Zahlungsfrist (15.11.2026) blieben gleich, die QR-Referenzen auch.

## Nicht bestätigt

- **Der Fall, für den der neue Satz gedacht ist (Periode unter einem Jahr mit Mieterwechsel, y ≠ 100.00):** In `dwello_persona` gibt es keine solche Abrechnung (alle 17 Abrechnungen gehen über ein ganzes Jahr); die Persona hat keine erstellt, und neue Abrechnungen anlegen durfte ich nicht. Deshalb nicht live bestätigt: dass der Satz in de/fr/it/en gedruckt wird, dass x die Summe der gedruckten Monate und y = `periodPercent` ist, und ein angebrochener Monat nach Tagen. Geprüft habe ich nur mit Papier und Bleistift, dass die Erwartungen der neuen Tests in `backend/src/__tests__/statement-pdf.pg.test.ts` zu meinen Regeln passen: Jan–Jun mit Einzug 01.03., Profil 10/10/10/10/10/0 → 30.00 / 50.00 → 60.00 %; Profil 18.6/13.9/11.2/6.1/2.3/0, Periode Jan–Jun → 52.10 %. Diese Tests habe ich nicht laufen lassen.
- **Ältere Abrechnung ohne `heating_share` (vor #209):** In den Demodaten gibt es keine (alle 17 haben `heating_share`), und Daten ändern durfte ich nicht. Nicht bestätigt sind beide Fälle: dass das PDF den Anteil der Position druckt, und dass es Monate nur druckt, wenn die Neuberechnung zur Position passt.
- **Ein Heizprofil, dessen zwölf Monate nicht genau 100.00 % ergeben (erlaubt sind ±0.1):** Bei einer Jahresperiode würde der Satz dann mit z. B. «99.90 %» gedruckt. In den Demodaten ergeben alle vier Profile 100.00 %; nicht beobachtet. Das entspricht dem Wortlaut der Aufgabe («wenn y nicht 100.00»). Ob das fachlich gewollt ist, muss `fach-reviewer` beurteilen.
