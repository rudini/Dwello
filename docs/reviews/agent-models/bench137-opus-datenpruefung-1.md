# Datenprüfung #137, Runde 1 (daten-pruefer, Opus)

Geprüfter Commit: `cbbaafa` (Worktree `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/review-bench137-opus`), Änderung `git diff 25ce827 cbbaafa`.
Skripte und Ausgaben: `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/dp-opus/`.

## Wichtig vorab: Die laufende App ist nicht aus `cbbaafa` gebaut

Der Persona-Stack auf :3301/:3300 läuft aus `/home/user/Dwello` (Commit `032de45`, ein späterer Stand von `main`, der `cbbaafa` enthält und danach genau die betroffene Logik weiter geändert hat). Darum bestätigen alle Vergleiche unten den Stand `032de45`, nicht `cbbaafa`. Für `cbbaafa` selbst ist nichts bestätigt (siehe D-1 und «Nicht bestätigt»).

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Blocker (Prüfgrundlage, kein Fehler im Code) | Prüfumgebung: Backend :3301, Frontend :3300, `dwello_persona` | App und Schema aus `cbbaafa` | Backend-Prozess läuft in `/home/user/Dwello/backend` auf `032de45`; das Schema hat Spalten, die es in `cbbaafa` nicht gibt (`utility_statements.heating_share`, `utility_statement_line_items.position_rental_days`, `billed_days`, `invoice_parts`) |
| D-2 | Minor | Detailseite der Abrechnungen Lea, Marc, Giulia, Tom, Ivo, Nora (DP-Opus; Heizkosten nach Tagen verteilt) | Nach Regel 5 in der neuen Fassung: «die Abrechnung zeigt dann die Mietstage und keinen Heizprofil-Hinweis» | Die Webseite zeigt trotzdem «Heizprofil: Heizung Mittelland» bzw. «Heizung Tessin» (`data-testid="statement-heating-profile"`). Das PDF ist korrekt |

### D-1: Persona-Stack läuft auf `032de45`, nicht auf `cbbaafa`

Nachweis:

```
$ readlink /proc/1257/cwd            # PID von "bun run src/index.ts", DATABASE_URL=…/dwello_persona, PORT=3301
/home/user/Dwello/backend
$ git -C <worktree> merge-base --is-ancestor cbbaafa 032de45; echo $?
0
$ git -C <worktree> log --oneline cbbaafa..032de45 -- backend/src/services/{calculation,prorating,statement-pdf,pdf}.service.ts backend/migrations
… 0fb8145 fix(statements): print the Zeitanteil as days, 6705337 keep the heating share as created,
  637ad2b store the heating share rounded, cf49fa5 list mixed-day invoices in PDF, 23cd2f3 renumber invoice parts migration … (20 Commits)
$ grep -rln "heating_share\|positionRentalDays\|billedDays" <worktree>/backend/src <worktree>/backend/migrations
(keine Treffer)
```

Ursache: `docs/design/tools/persona-stack.sh` Zeile 4 wechselt fest nach `cd /home/user/Dwello` und baut und startet von dort, egal aus welchem Worktree das Skript aufgerufen wird. Im Scratchpad liegt zwar `bench-cbbaafa`, gestartet wurde aber das Haupt-Repository.

Folge: Der PDF-Text unterscheidet sich sichtbar von `cbbaafa`. Beispiel: Die Fussnote im PDF von Lea lautet «… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode.» In `cbbaafa` endet `sharesNote` mit «… in der Abrechnungsperiode{heating}.».

Reproduktion: die App aus einem Checkout von `cbbaafa` starten (das Skript muss dazu im Worktree laufen statt in `/home/user/Dwello`), dann die Skripte unten erneut ausführen.

### D-2: Detailseite nennt das Heizprofil, obwohl nach Tagen verteilt wurde

Nachweis (`web.py`, Ausgabe `out-web.txt`):

```
Lea:   OK heizprofil-on-page=[…, 'Heizprofil', 'Heizung Mittelland']   (heating_share = {"byDays": true})
Giulia: OK heizprofil-on-page=[…, 'Heizprofil', 'Heizung Tessin']      (heating_share = {"byDays": true})
Sven:  OK heizprofil-on-page=None                                      (ohne Heizprofil erstellt)
```

Quelle im geprüften Commit: `src/routes/statements/[id]/CostTable.svelte:73-76` zeigt `statement.heatingProfileName`, sobald die Abrechnung ein Heizprofil gespeichert hat. Ob es angewendet wurde, spielt keine Rolle. Gleich in `25ce827` (bestand also schon vorher). Die neue Formulierung von Regel 5 («die Abrechnung zeigt dann … keinen Heizprofil-Hinweis») macht es aber widersprüchlich. Die Beträge auf der Seite stimmen. Die Spalte «Anteil» zeigt den Anteil am Total der Liegenschaft, keinen Zeitanteil; das betrifft die Änderung nicht.

Reproduktion: `GET http://localhost:3300/statements/fc1cda7a-aa45-4eb9-a4b1-c0315550c2df` (Lea, mit Session-Cookie) zeigt «Heizprofil Heizung Mittelland». Im PDF derselben Abrechnung steht kein «Heizprofil».

## Testdaten (selbst angelegt, nur Gebäude «DP-Opus …», über die API)

Angelegt mit `setup.py` und `generate.py`. Profile: vordefiniertes «Heating Mittelland» (Jun–Aug 0 %, Mai 3.5 %, Sep 1 %) und «Heating Tessin» (Mai–Sep 0 %).

| Abrechnung | Gebäude / Wohnung | Periode, Profil | Mietvertrag | Fall |
|---|---|---|---|---|
| Lea (de) `fc1cda7a…` | DP-Opus Sommer 1.01 | 01.06.–31.08.2025, Mittelland, Pauschale 3.5 % | ab 15.07.2025, Akonto 150 | Szenario-Fall 48/92; Heizung mit Leistungszeitraum 01.05.–31.07. (eigene Gruppe, Schlüssel 70/30); Kaminfeger (Heizkosten-Kategorie); Rechnung ausserhalb der Periode (Allgemeinstrom 15.03.) |
| Marc (fr) `eb5e4a07…` | DP-Opus Sommer 1.02 | wie Lea, 0 % | 01.01.2024–20.07.2025 | Auszug in der Sommerperiode, 50/92 und 50/61 |
| Nora (en) `386456a3…` | DP-Opus Sommer 1.03 | 01.06.–02.07.2025 (32 Tage), Mittelland | ab 02.07.2025 | Grenzfall 1/32 (Zeitanteil 0.03125 liegt genau auf der Rundungsgrenze der 4 Nachkommastellen) |
| Giulia (it) `ac9f0a9b…` | DP-Opus Tessin A | 01.05.–30.09.2025, Tessin | ab 2023, Akonto 80 | ganze Periode, alle Monate 0 %: 153/153 |
| Tom (en) `87095783…` | DP-Opus Tessin B | wie Giulia, Pauschale 2 % | ab 10.06.2025, Akonto 400 | Rückerstattung, 113/153 |
| Pia (de) `eeafdead…` | DP-Opus Gemischt 1 | 01.05.–31.08.2025, Mittelland | ab 15.07.2025 | Gegenfall: Periode hat 3.5 % (Mai), also nach Profil; Mietmonate 0 %, Heizkosten 0.00 |
| Ruth (de) `71d39294…` | DP-Opus Gemischt 2 | 20.05.–31.08.2025, Mittelland | ab 01.06.2025, Akonto 50 | angebrochener Mai (12/31 × 3.5 % = 1.35 %): nach Profil, nicht nach Tagen |
| Sven (de) `4356c0f2…` | DP-Opus Gemischt 3 | 01.05.–31.08.2025, ohne Heizprofil | ab 15.07.2025 | ohne Profil nach Tagen; Hinweis Art. 8 Abs. 1 VMWG |
| Ivo (de) `1f2bb599…` | DP-Opus Tank 1 | 01.06.–31.08.2025, Mittelland | ab 15.07.2025, Akonto 200 | Tank (Anfangsbestand 31.05. 5000, Endbestand 31.08. 4200, Lieferung 1500): Verbrauch 2300, nach Tagen |

## Nachrechnung (gegen den laufenden Stand `032de45`)

`recompute.py` liest Rechnungen, Kategorien, Schlüssel, Wohnungen, Mietverträge, Akonto, Heizprofile und Tankbestände aus `dwello_persona`. Es importiert keinen Dwello-Code. Angewendete Regeln: Regeln 1, 3, 5, 8, 9 und 10, Thema 6 («gerundeter Wohnungsanteil × Zeitanteil»), Glossar «Geleistete Akontobeiträge». Zwei Lesarten habe ich selbst festgelegt:

- Die Monatsanteile des Profils zählen in einem angebrochenen Monat nach seinen Tagen.
- Das Akonto eines angebrochenen Monats zählt nach dessen Tagen.

Beide Annahmen bestätigt der gespeicherte Wert.

Ergebnis: `checks ok 70 diff 0` (`out-recompute.txt`). Alle 25 Positionen stimmen auf den Rappen, ebenso Pauschale, «Ihre Nebenkosten», Akonto, Saldo mit 5-Rappen-Rundung und Mietstage. Auszug:

```
== Lea 2025-06-01..2025-08-31 Mietstage 48/92 (2025-07-15..2025-08-31)
  OK  Heizung     days(0%)  total  1840.00 apt 644.00/644.00 share 0.521739/0.5217 tenant 336.00/336.00
  OK  Heizung     days(0%)  total   596.74 apt 205.88/205.88 share 0.278689/0.2787 tenant 57.38/57.38
  OK  Kaminfeger  days(0%)  total   300.00 apt 100.00/100.00 share 0.521739/0.5217 tenant 52.17/52.17
  OK  balance: expected 430.15 stored 430.15   (raw saldo 430.16 rounding -0.01)
== Pia … OK  Heizung profile total 2000.00 apt 736.84 share 0.000000/0.0000 tenant 0.00/0.00
== Ivo … OK  Heizung days(0%) total 2300.00 (5000 + 1500 − 4200) apt 1150.00 tenant 600.00
== Nora … OK  Kaminfeger days(0%) share 0.031250/0.0313 tenant 3.13/3.13
```

PDF in allen vier Sprachen (`pdfs.py` erzeugt sie mit `generate-pdf` und `language`; Prüfung mit `checkpdf.py`, Ausgabe `out-pdf.txt`): `ok 36 bad 0`. Geprüft sind die Positionszeilen (Kosten Liegenschaft, Wohnungsanteil, Zeitanteil als Bruch mit der richtigen Einheit Tage/jours/giorni/days oder als Profil-%, Ihr Anteil), Zwischensumme, Pauschale, «Ihre Nebenkosten», Akonto, Saldo vor Rundung, Rundung mit Vorzeichen, Saldo, Betrag im Kopf und die Mietstage-Zeile. Weitere Textprüfungen:

- Sommerfälle (Lea, Marc, Giulia, Tom, Ivo, Nora), Sven und Ivo: kein «Heizprofil / profil de chauffage / profilo di riscaldamento / heating profile», kein Heizprofil-Abschnitt. Bei Ivo gibt es nur den Tank-Abschnitt mit 5000 / 1500 / 4200 / 2300.
- Lea zeigt «48/92 Tage» (4×) und «17/61 Tage», wie im Szenario verlangt.
- Pia und Ruth: Klausel «bei Heizkosten der Anteil nach dem Heizprofil» und Heizprofil-Abschnitt vorhanden, Pia mit Periodenanteil 3.50 %, Ruth mit 1.35 %.
- Alle 36 PDFs haben den Hinweis «detaillierte Abrechnung der Heiz- und Warmwasserkosten (Art. 8 Abs. 1 VMWG / art. 8 al. 1 OBLF / art. 8 cpv. 1 OLAL / Art. 8 para. 1 VMWG)». Ivo hat zusätzlich Art. 8 Abs. 2.

Webseite (`web.py`, Ausgabe `out-web.txt`): Bei allen 9 Abrechnungen stimmen Positionen, Zwischensumme, Total, Akonto und Saldo. Ausnahme ist nur D-2.

QR-Rechnungen (`qr.py`: `pdftoppm -png -r 200` der letzten Seite, dekodiert mit `zxing-cpp` im venv, Ausgabe `out-qr.txt`): 28 QR-Rechnungen (7 Nachzahlungen × 4 Sprachen) sind dekodiert und OK.

- Header `SPC/0200/1`.
- IBAN `CH4431999123000889012`: Prüfziffer mod 97 gültig, gleich der Konfiguration.
- Kreditor «Muster Immobilien AG».
- Betrag gleich dem nachgerechneten Saldo, Währung CHF.
- Referenztyp `QRR`: 27 Stellen, Prüfziffer Modulo 10 rekursiv gültig, gleich `qr_bill_reference`.
- Mitteilung mit der Abrechnungsnummer in der Sprache des PDFs.
- Debitor: Name und Adresse des Mieters, Typ S, CH.

Bei den Rückerstattungen Tom und Ruth gibt es in keiner Sprache einen QR-Code oder Zahlteil (richtig).

## Geprüft und bestanden (nur für Stand `032de45`)

- Gespeicherte Werte: alle Positionen und Summen der 9 Abrechnungen Lea, Marc, Nora, Giulia, Tom, Pia, Ruth, Sven, Ivo.
- PDF de/fr/it/en dieser 9 Abrechnungen (36 PDFs).
- Webseite der 9 Abrechnungen, Beträge.
- QR-Rechnungen Lea, Marc, Nora, Giulia, Pia, Sven, Ivo in 4 Sprachen (28). Kein QR bei Tom und Ruth (8 PDFs).

## Nicht bestätigt

- **Alles für `cbbaafa`** (D-1): Gespeicherte Werte, Webseite, PDF und QR des geprüften Commits konnte ich nicht prüfen, weil keine App aus `cbbaafa` läuft. Starten darf ich sie nicht. Aus dem Code von `cbbaafa` lese ich zwei Abweichungen heraus, die beim erneuten Lauf zuerst zu prüfen sind. Beide sind statisch abgeleitet, nicht mit Daten belegt:
  1. **Heizkosten-Rechnung mit Leistungszeitraum in einer Sommerperiode.** In `cbbaafa` (`prorating.service.ts:236-239`, Zweig `period.percentage <= 0`) rechnet sie mit Mietstagen der Periode / Tagen der Periode, ohne den Leistungszeitraum. Regel 5 («ebenso … nach Tagen», mit Leistungszeitraum: seine Mietstage darin / Tage des Leistungszeitraums in der Periode) verlangt für Lea 205.88 × 17/61 = **57.38**. `cbbaafa` ergäbe 205.88 × 48/92 = 107.42. Für Marc verlangt die Regel 202.99 (50/61), `cbbaafa` ergäbe 134.59 (50/92). Das wäre ein Major beim Betrag. Der Zweig bestand schon in `25ce827`, die Regel stellt diese Änderung aber neu auf.
  2. **Grenzfall Nora 1/32.** In `cbbaafa` (`pdf.service.ts`, `timeShare`) gilt `Math.abs(0.0313 - 1/32) = 0.00005000000000000143`, das ist nicht `< 0.00005`. Das PDF zeigt dann «3.13 %» statt «1/32 days» (Minor, gleiche Logik schon in `25ce827`). In `032de45` steht korrekt «1/32».
- Die Fälle mit den Schlüsseln «Pro Zimmer» und eigenen Formeln habe ich nicht angelegt. Sie sind von der Änderung nicht betroffen.
- Die Abrechnungen «DP-Sonnet …» und die Demo-Daten habe ich bewusst nicht geprüft und nicht verändert.
