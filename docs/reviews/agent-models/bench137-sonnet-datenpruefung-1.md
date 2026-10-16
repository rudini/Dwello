# Datenprüfung #137, Runde 1 (daten-pruefer, Sonnet)

Geprüfter Commit laut Auftrag: `cbbaafa` (Worktree `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/review-bench137-sonnet`).
Geprüfte Anwendung: Persona-Stack (Backend :3301, Frontend :3300, Datenbank `dwello_persona`).

**Vorweg, wichtig:** Der laufende Backend-Prozess ist nicht `cbbaafa` (Befund D-1). Alle Zahlen unten sind bestätigt für den Code, der auf :3301 läuft, nicht für `cbbaafa`. Für `cbbaafa` selbst gibt es nur eine Lesebefundung (D-2, nicht ausgeführt).

## Übersicht der Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Blocker (für die Gültigkeit dieser Prüfung) | Laufender Stack | Backend und Frontend laufen aus `cbbaafa` | Backend läuft aus `/home/user/Dwello/backend` auf `main`-HEAD `032de45`, 146 Commits nach `cbbaafa`; `cbbaafa` wurde nicht ausgeführt |
| D-2 | Major (nur gelesen, nicht ausgeführt) | `cbbaafa`, Heizkosten einer Sommerperiode mit Rechnung mit Leistungszeitraum (Fall S3-T2, Position «Heizung / Pro Fläche») | Zeitanteil nach Regel 5: Mietstage im Leistungszeitraum / Tage des Leistungszeitraums in der Periode; Ihr Anteil CHF 223.75 | Nach `cbbaafa`-Code Mietstage / Tage der Periode (75/153); Ihr Anteil CHF 239.40 (+15.65) |
| D-3 | Minor | Detailseite jeder Abrechnung mit Heizprofil, die nach Tagen verteilt wurde (z. B. S1-T3, S3-T2, S4-T3) | Kein Heizprofil-Hinweis, wie im PDF | Seite zeigt «Heizprofil: Heizung Mittelland» (live-Stack und nach Lesen auch `cbbaafa`: `src/lib/server/statement.ts:56`) |
| D-4 | Nit | Regel «Geleistete Akontobeiträge» bei Ein-/Auszug mitten im Monat | In den Anforderungen beschrieben | Nicht beschrieben; Dwello rechnet den angebrochenen Monat nach Kalendertagen (z. B. 120.00 × 17/31 + 120.00 = 185.81). Meine Herleitung deckt sich damit |

Keine Betragsabweichung im laufenden Stack: 27 Abrechnungen plus 1 Tank-Fall, alle auf den Rappen bestätigt (siehe «Geprüft und bestanden»).

## Befunde im Einzelnen

### D-1 (Blocker): Der laufende Stack ist nicht `cbbaafa`

Der Auftrag sagt, die App sei aus `cbbaafa` gebaut. Belege, dass das Backend etwas anderes ausführt:

```
$ ls -l /proc/$(fuser 3301/tcp | tr -d ' ')/cwd
/proc/1257/cwd -> /home/user/Dwello/backend          (Prozess "bun run src/index.ts", Start 15:16)
$ git -C /home/user/Dwello log --oneline -1            -> 032de45 docs(config): plan subagent model benchmark
$ git -C /home/user/Dwello log --oneline cbbaafa..HEAD | wc -l   -> 146
$ grep -rln heating_share <Worktree>/backend/migrations <Worktree>/backend/src   -> (leer)   # cbbaafa kennt die Spalte nicht
```

- Die gespeicherten Abrechnungen enthalten `heatingShare` (`{"byDays":true}`), Spalte `utility_statements.heating_share`. Diese Spalte gibt es in `cbbaafa` nicht (eingeführt später, Commit `6705337`).
- Die PDF-Fusszeile der Zeitanteile weicht vom `cbbaafa`-Code ab: `pdf.service.ts` in `cbbaafa` hängt «, bei Heizkosten der Anteil nach dem Heizprofil» an (Zeile 88); das gelieferte PDF hat «; bei Heizkosten …» und bei Leistungszeitraum eine zusätzliche Klausel «bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode», die `cbbaafa` nicht kennt.
- Das Frontend (`/tmp/persona-app`, gebaut 15:16) konnte ich nicht einem Commit zuordnen.

Folge: Meine Bestätigung gilt für die ausgeführte Version (Stand `main` 15:10 UTC), die Regel 5 inklusive #137 umsetzt. Sie ist kein Nachweis für `cbbaafa`.
Reproduktion: die drei Befehle oben.
Vorschlag: Stack aus einem Worktree von `cbbaafa` neu starten (die Instruktion verbietet mir das) und Runde 1 mit meinen Skripten (siehe unten) wiederholen. Ein Lauf dauert unter einer Minute.

### D-2 (Major, nicht ausgeführt): Rückfall auf Tage ignoriert in `cbbaafa` den Leistungszeitraum bei Heizkosten

Beim Lesen von `cbbaafa` (nicht ausgeführt, weil D-1; ich konnte den Worktree nicht ausführen, `node_modules` ist mir gesperrt):

- `backend/src/services/calculation.service.ts:298-316`: Heizkosten mit Heizprofil gehen immer durch `handleMidYearMoves`; nur die übrigen Positionen nehmen `rentalShare(group, …)`, das pro Rechnung die Mietstage im Leistungszeitraum durch dessen Tage teilt.
- `backend/src/services/prorating.service.ts:236-239`: Bei 0 % rechnet der neue Zweig `Tage des Mietvertrags in der Periode / Tage der Periode`, ohne Leistungszeitraum.
- Anforderung Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`): Bei 0 % gelten die Heizkosten wie alle anderen nach Tagen, und dort zählt mit Leistungszeitraum «seine Mietstage darin / Tage des Leistungszeitraums in der Periode».

Rechenbeispiel (aus meinen Daten, Fall S3-T2, Periode 01.05.–30.09.2024, Profil Tessin = 0 % in allen Monaten, Vertrag bis 14.07.2024; Heizrechnung I10 CHF 1'000.00 mit Leistungszeitraum 01.06.–31.12.2024):

| | Wert |
|---|---|
| Position «Heizung / Pro Fläche», Wohnungsanteil | CHF 488.38 |
| Ihr Anteil nach Regel 5 (laufender Stack, von mir unabhängig bestätigt) | CHF 223.75 (Zeitanteil 45.82 %, gewichtet nach Rechnung) |
| Ihr Anteil nach `cbbaafa`-Lesung | CHF 488.38 × 75/153 = CHF 239.40 |

Das ist eine Vorhersage aus dem Quelltext; ich habe `cbbaafa` nicht gestartet. Der laufende Stack liefert den Regel-5-Wert. Bitte vom Aufrufer an `cbbaafa` (oder einem aktuellen Branchstand) mit meinem Skript `setup.ts` prüfen lassen.

### D-3 (Minor): Detailseite zeigt «Heizprofil» trotz Verteilung nach Tagen

```
GET http://localhost:3300/statements/3f016521-089e-4e56-8de1-705743e20c02   (S1-T3, Cookie dwello_session mit signiertem Token)
... Gesamtkosten ... "Heizprofil" "Heizung Mittelland" "Zwischensumme" CHF 886.94 ...
```
`python3 checkweb.py` im Skriptordner: «Heizprofil»-Zeile bei allen 24 Abrechnungen mit Profil, auch bei den 16, die nach Tagen verteilt sind (S1, S2-T1, S3, S4, S6-T1); nur S5 (ohne Profil) hat sie nicht. Das PDF derselben Abrechnung nennt kein Heizprofil. Die Anforderung #137 nennt nur das PDF; die Seite widerspricht ihm aber. Entscheid beim Aufrufer: Zeile ausblenden oder als «gewählt im Abrechnungslauf» erklären.

### D-4 (Nit): Akonto bei angebrochenem Monat nicht in den Anforderungen

`UBIQUITOUS_LANGUAGE.md` («Summe der monatlichen Vorauszahlungen») sagt nichts zum angebrochenen Monat. Dwello rechnet nach Kalendertagen des Monats; alle 28 Fälle stimmen mit dieser Herleitung auf den Rappen. Dokumentationslücke, keine Abweichung.

## Vorgehen und Testdaten

Neue Gebäude, nur über die API angelegt (Token mit dem Persona-Geheimnis signiert):
- «DP-Sonnet Sommer» (`40b295ac-b4da-49a6-9d65-54bfeb1cd0bc`): 4 Wohnungen (80.00 / 60.50 / 100.00 / 45.00 m², 3.5 / 2.5 / 4.5 / 1.5 Zimmer; A4 leer), 5 Mieter (de, fr, it, en, de), 16 Rechnungen (Heizung mit allen Schlüsseln und ohne, Kaminfeger, Lift, Hauswart, Kehricht und Heizung mit Leistungszeitraum, Warmwasser, Abwasser, nicht umlagefähige Reparatur, Rechnung am 01.09. ausserhalb), 6 Läufe: Sommer 01.06.–31.08. Mittelland (alle Monate 0 %), 01.06.–30.09. Mittelland (Summe 1 %, Grenzfall), 01.05.–30.09. Tessin (alle 0 %), Juli (31 Tage), 01.07.–31.08. ohne Heizprofil, Jahr 2024 Mittelland (Regression).
- «DP-Sonnet Tank»: Tankbestand 4000.00 / 1500.00, Heizrechnung 1200.00, Einzug 15.07.2024, Sommerperiode.
Skripte (Python/Bun, eigene Herleitung aus den Anforderungen, ohne Dwello-Code): `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/dp-sonnet/` : `setup.ts`, `setup2.ts` (Daten), `dump.ts` (PDF und gespeicherte Werte), `recompute.py` (Neuberechnung und Vergleich mit gespeicherten Werten), `checkpdf.py`, `qr.py`, `checkweb.py`. Reproduktion: `python3 recompute.py` (Ausgabe «mismatches 0»), `python3 checkpdf.py`, `./venv/bin/python qr.py`, `python3 checkweb.py`.

Angewendete Regeln (aus `docs/nebenkostenabrechnung-anforderungen.md`, Regeln 1 bis 8, und Glossar): Rechnung zählt nach Rechnungsdatum bzw. nach Tagen des Leistungszeitraums in der Periode; nicht umlagefähige Rechnungen entfallen; gleiche Kategorie und gleicher Schlüssel bilden eine Position, «ohne Schlüssel» eine eigene Position; Schlüssel immer durch alle Wohnungen des Gebäudes; Positionssumme auf Rappen, Wohnungsanteil auf Rappen gerundet, Ihr Anteil = gerundeter Wohnungsanteil × Zeitanteil, auf Rappen gerundet; Zeitanteil nach Tagen (mit Leistungszeitraum nach Rechnung gewichtet), bei Heizkosten und Teilperiode nach Heizprofil (Monate des Mieters / Monate der Periode), ausser die Monate der Periode haben zusammen 0 %; Verwaltungspauschale auf Zwischensumme; Saldo auf 5 Rappen kaufmännisch.

## Geprüft und bestanden (laufender Stack, nicht `cbbaafa`)

Summe: 27 Abrechnungen im Gebäude «Sommer» plus 1 im Gebäude «Tank». Je Abrechnung verglichen: Mietstage, jede Position (Kosten Liegenschaft, Wohnungsanteil, Ihr Anteil), Zwischensumme, Pauschale, Gesamtkosten, Akonto, Saldo vor Rundung, Rundung, Saldo. Ergebnis `recompute.py`: 0 Abweichungen (Rappen).

Alle Abrechnungen enthalten die Hinweise nach Art. 257b Abs. 2 OR und Art. 8 Abs. 1 VMWG, auch die ohne Heizprofil (S5) und nach Tagen.

| Lauf | Verträge | Verteilung der Heizkosten | PDF-Sprachen geprüft |
|---|---|---|---|
| S1 Sommer 01.06.–31.08. Mittelland | T1 bis T5 | nach Tagen (alle 0 %); Beispiel «48/92 Tage» bei T3 (it) | de, fr, it, en |
| S2 01.06.–30.09. Mittelland (1 %) | T1 bis T5 | T1 voll: Tage; T2 bis T5: Heizprofil (0 % bzw. 100 %), Profilhinweis vorhanden | de, fr, it, en |
| S3 01.05.–30.09. Tessin | T1 bis T5 | nach Tagen, mit gewichteter Rechnung mit Leistungszeitraum (z. B. 45.82 %) | de, fr, it, en |
| S4 Juli 2024 | T1, T3, T4, T5 | nach Tagen (z. B. 17/31) | de, it, en |
| S5 01.07.–31.08. ohne Heizprofil | T1, T3, T5 | nach Tagen, Seite ohne Heizprofil-Zeile | de, it |
| S6 Jahr 2024 Mittelland (Regression) | T1 bis T5 | T1 Tage; T2 bis T5 nach Heizprofil (58.5 / 41.5 / 58.5 / 0 %), Profilhinweis vorhanden | de, fr, it, en |
| F1 Tank 01.06.–31.08. | 1 Vertrag | Verbrauch 3700.00 (4000 + 1200 − 1500), nach Tagen 48/92, Tankabschnitt statt Profil | de |

Zusätzlich:
- Fälle mit Rundung: aufwärts (S1-T3 727.74 → 727.75, Rundung + 0.01), abwärts (S1-T5 902.56 → 902.55), Rückerstattung (S6-T5 −82.52 → −82.50, «− 0.02», kein Zahlteil).
- PDF-Zeitanteil: In allen nach Tagen verteilten PDFs stehen «n/m Tage» (de), «n/m jours» (fr), «n/m giorni» (it), «n/m days» (en) in jeder Heizungsposition, die Kopfzeile nennt Mietstage von Tagen der Periode, und kein Text des Heizprofils (Wörter und Profilnamen in allen vier Sprachen) kommt vor. Mit Profil verteilte PDFs enthalten den Abschnitt «Heiz- und Warmwasserkosten» mit Profilname in der Mietersprache.
- Der Satz zur Fussnote «bei Heizkosten der Anteil nach dem Heizprofil» steht nur in PDFs, in denen mindestens eine Position nach Profil verteilt ist.
- Web-Seite (nur Deutsch): Saldo, Rundung, Zwischensumme, Gesamtkosten, Akonto, Positionsbeträge, Mietstage aller 27 Abrechnungen stimmen mit den gespeicherten Werten überein (`checkweb.py`: 0 Abweichungen).

### QR-Rechnungen (Decoder: `zxing-cpp` im venv `dp-sonnet/venv`; Seite 2 mit `pdftoppm -png -r 300`)

26 Nachzahlungen im Gebäude «Sommer» plus F1 («Tank») sind dekodiert und stimmen: Kopf `SPC`/`0200`/Kodierung 1; IBAN CH4431999123000889012 (QR-IBAN, IID 31999, Prüfziffern gültig); Betrag = gespeicherter Saldo = meine Berechnung; Währung CHF; Referenztyp QRR, 27 Ziffern, Prüfziffer (rekursiv Modulo 10) gültig; Referenz im QR = gedruckte Referenz im Zahlteil und Empfangsschein; Mitteilung = «Nebenkostenabrechnung <Abrechnungsnummer>» in der Sprache des Mieters; Zahlungspflichtiger = Mietername und Adresse; Zahlungsempfänger = Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich.

Dekodierte Beispiele: S1-T3 `727.75` / `002975348222800094323378895`; S2-T3 `1411.75` / `012025311671491226519829813`; F1 `1257.35` / `011820909368604241168741839`. Alle 27 Werte stehen in der Ausgabe von `qr.py`.
S6-T5 ist eine Rückerstattung (−82.50): kein Zahlteil, daher keine QR-Rechnung (erwartet).

## Nicht bestätigt

1. **`cbbaafa` selbst** (D-1): nie ausgeführt. Der Stack läuft aus dem Arbeitsbaum des Aufrufers; `node_modules` im Worktree ist mir gesperrt, ein eigener Start ist mir verboten. Gilt für Berechnung, PDF-Text und Frontend. D-2 ist daher eine Lesebefundung.
2. **Web-Seite in fr, it, en:** Die Oberflächensprache hängt am Konto und ist eine Einstellung der Demo-Daten; ich habe sie nicht geändert. Gedruckt sind alle vier Sprachen im PDF geprüft, die Seite nur in Deutsch.
3. **Szenario** `tests/e2e/features/statement-detail.feature` («Heizkosten stehen im PDF nach Mietstagen …»): nicht ausgeführt (E2E gehört nicht zu diesem Auftrag; es würde den Build stören).
4. **Andere Profile mit Grenzwerten:** ein eigenes Heizprofil mit 0.1 % Rest (Prüfung der Schwelle `<= 0`) habe ich nicht angelegt (Heizprofile gehören keinem Gebäude, Auftrag erlaubt nur «DP-Sonnet»-Gebäude). Die Schwelle ist mit den vordefinierten Profilen nur bei Summe 0 % (S1, S3, S4) und 1 % (S2) belegt.
5. **Teilmonate mit Heizanteil > 0 %:** Meine Ein- und Auszugstage liegen in Monaten mit 0 % (Juli), sodass die Behandlung angebrochener Monate im Heizprofil unberührt blieb. Nicht Teil von #137, nicht geprüft.
6. **Beobachtung, kein Befund:** In S2 (Summe 1 %) trägt T2/T4/T5 nach Profil 0 % der Heizkosten und der Vermieter die ganze Wohnungsheizung von A3; Sprung zwischen «eine Periode mit einem Heizmonat» und «ohne Heizmonat» (im Fachreview als V-4 bekannt, durch #137 nicht verändert).
