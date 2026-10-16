# Datenprüfung #137, Runde 2 (daten-pruefer, Sonnet)

Geprüft: Stack, der wirklich aus `cbbaafa` läuft (`/proc/7755/cwd` -> `.../scratchpad/bench-cbbaafa/backend`; Spalte `heating_share` fehlt im Schema; Datenbank `dwello_persona` frisch). D-1 aus Runde 1 ist damit behoben.
Daten neu angelegt mit denselben Skripten (nur Gebäude «DP-Sonnet Sommer» und «DP-Sonnet Tank», nur über die API): `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/dp-sonnet/` (`setup.ts`, `setup2.ts`, `dump.ts`, `recompute.py`, `checkpdf.py`, `qr.py`, `checkweb.py`).

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-2 | Major (jetzt bestätigt) | Läufe S3 (01.05.–30.09.2024, Profil Tessin, alle Monate 0 %), alle 4 Teilperioden-Verträge T2 bis T5; Position «Heizung / Pro Fläche» (enthält Rechnung mit Leistungszeitraum 01.06.–31.12.) | Nach Regel 5 nach Tagen mit Gewichtung pro Rechnung: z. B. T2 Ihr Anteil CHF 223.75, Saldo CHF 836.30 | Ganze Position mit Mietstage/Tage der Periode: T2 CHF 239.40, Saldo CHF 852.45 |
| D-3 | Minor | Detailseite aller Abrechnungen mit Heizprofil, die nach Tagen verteilt sind (S1, S3, S4) | Kein Heizprofil-Hinweis wie im PDF | Seite zeigt «Heizprofil: Heizung Mittelland / Tessin» |
| D-5 | Nit (vor #137 bestehend) | S2-T1, S6-T1 (Mietvertrag läuft die ganze Periode, Periode mit Heizanteil > 0) | Regel 5: Profil nur bei einem Vertrag, der einen Teil der Periode läuft; also «122/122 Tage» ohne Profilhinweis | Heizpositionen «100.00 %», Abschnitt «Heizkosten nach Heizprofil … 100.00 %» und Fusszeilen-Satz zum Heizprofil. Betrag stimmt |
| D-4 | Nit | Akonto bei angebrochenem Monat | beschrieben | Nicht in den Anforderungen; Dwello rechnet nach Kalendertagen, meine Herleitung deckt sich |

### D-2 im Einzelnen

```
$ python3 recompute.py          (im Skriptordner)
S3-T2 ... line Heating/Per Area (m²) mode=days frac=0.45815 act periodShare=0.4902
  MISMATCH tenant: expected 223.75 actual 239.40
  MISMATCH totalCosts: expected 1081.47 actual 1097.59 ; fee 31.50 vs 31.97 ; balance 836.30 vs 852.45
S3-T3 tenant 264.63 vs 248.98, balance 851.85 vs 835.70
S3-T4 tenant 341.80 vs 369.32, balance 1264.85 vs 1293.20
S3-T5 tenant 235.52 vs 221.59, balance 642.95 vs 628.60
mismatches 16   (alle in S3; S3-T1, Vertrag die ganze Periode, stimmt)
```
Ursache, wie in Runde 1 gelesen: Die Heizkosten gehen bei Summe 0 % in `handleMidYearMoves` auf `Tage des Vertrags / Tage der Periode` (`prorating.service.ts:236-239`), ohne die Gewichtung nach Leistungszeitraum der Rechnung, die `calculation.service.ts` (`rentalShare`) für alle anderen Positionen anwendet. Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`) verlangt für 0 % «nach Tagen», und nach Tagen heisst mit Leistungszeitraum «seine Mietstage darin / Tage des Leistungszeitraums in der Periode». Die Heizrechnung I10 (1000.00, Leistungszeitraum 01.06.–31.12.) hat in der Periode nur 122 Tage; T2 mietet davon 44.
Die Summe der Anteile von T2 und T3 (gleiche Wohnung) ergibt 239.40 + 248.98 = 488.38 = Wohnungsanteil; der Fehler ist also nur die Aufteilung zwischen zwei Mietern, nicht die Summe. Auf dem PDF (S3-T2, fr) steht die falsche Zahl mit «75/153 jours», der Zeitanteil entspricht der Zeile, nicht der Regel.
Der Sommerfall ohne Leistungszeitraum (S1, S4, S5, F1) ist nicht betroffen. Reproduktion: `bun setup.ts && bun dump.ts && python3 recompute.py`.

### D-3 im Einzelnen
`GET http://localhost:3300/statements/<id>` mit Sitzungs-Cookie: «Heizprofil»-Zeile bei allen 24 Abrechnungen mit Profil, auch bei den 16, die nach Tagen verteilt sind. Nur S5 (ohne Profil) hat sie nicht (`python3 checkweb.py`).

## Bestanden

Das Gesamtergebnis aller 27 Abrechnungen im Gebäude «Sommer» und der Abrechnung im Gebäude «Tank» (F1):
- Läufe S1 (Sommer, Mittelland), S2 (Grenzfall Summe 1 %), S4 (Juli), S5 (ohne Heizprofil), S6 (Jahr, Regression) und F1 (Tank, Verbrauch 3700.00): alle Positionen, Zwischensumme, Pauschale, Akonto, Saldo vor Rundung, Rundung und Saldo auf den Rappen bestätigt (11 Läufe-Abrechnungen S1 bis S6 ausser S3-T2 bis T5; zusammen 23 von 27 plus F1).
- S3-T1 (Vertrag die ganze Periode) stimmt.
- Rundung aufwärts (S1-T3 727.74 → 727.75), abwärts (S1-T5), Rückerstattung (S6-T5 −82.52 → −82.50, ohne Zahlteil).
- PDF (de, fr, it, en): In den nach Tagen verteilten Abrechnungen steht «n/m Tage» (jours, giorni, days) in jeder Heizposition, die Kopfzeile nennt Mietstage von Tagen der Periode, kein Heizprofil-Text; der Satz zum Heizprofil in der Fusszeile fehlt dort (S1, S4, S5, F1, S3). Der Hinweis nach Art. 8 Abs. 1 VMWG steht in allen Abrechnungen, auch ohne Heizprofil (S5). Abrechnungen mit Profil (S2-T2 bis T5, S6-T2 bis T5) behalten Abschnitt und Satz zum Heizprofil. Die Tankabrechnung F1 zeigt «48/92 Tage» und den Tankabschnitt statt des Profils.
- Die Beträge im PDF und auf der Seite (nur Deutsch) stimmen mit den gespeicherten Werten überein; dort wo gespeichert falsch ist (S3-T2 bis T5), stimmen sie mit dem falschen Wert überein.
- Das Szenario-Beispiel «48/92 Tage» ohne «Heizprofil» ist mit S1-T3 (it, «48/92 giorni») und F1 (de, «48/92 Tage») erfüllt.

### QR-Rechnungen
Alle 27 Nachzahlungen dekodiert (zxing-cpp aus dem venv, Seite 2 mit `pdftoppm -png -r 300`): `SPC 0200`, IBAN CH4431999123000889012 (QR-IBAN, Prüfsumme gültig), Betrag = gespeicherter Saldo, QRR-Referenz 27 Ziffern mit gültiger Prüfziffer und gleich der gedruckten, Mitteilung «<Titel> NK-992F37D4-2024-00nn» in der Mietersprache, Zahlungspflichtiger = Mieter, Empfänger = Muster Immobilien AG. Ausnahmen gegenüber meiner Regel-Erwartung: S3-T2 (852.45), S3-T3 (835.70), S3-T4 (1293.20), S3-T5 (628.60): QR = gespeicherter Saldo, weicht wegen D-2 vom erwarteten ab. F1: `1257.35`, Referenz `011220079938265141968631675`, gültig. S6-T5 ist eine Rückerstattung ohne QR-Rechnung (erwartet).

## Nicht bestätigt
1. Web-Seite in fr, it, en: Die Oberflächensprache hängt am Konto; ich ändere keine Einstellungen. Das PDF ist in allen vier Sprachen geprüft.
2. E2E-Szenario nicht ausgeführt.
3. Eigenes Heizprofil mit 0.1 % Rest (Schwelle `<= 0`): Heizprofile gehören keinem Gebäude, daher nicht angelegt.
4. Angebrochene Monate mit Heizanteil > 0 % im Profil: meine Ein- und Auszugstage liegen im Juli (0 %); nicht Teil von #137.
5. Beobachtung ohne Befund: In S2 (Summe 1 %) trägt bei A3 niemand die Heizkosten nach Profil (Vermieter); im Fachreview als V-4 bekannt, durch #137 nicht verändert.
