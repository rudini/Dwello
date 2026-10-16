# Dr. Weber – Abrechnungsliste (Slice «list»)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300, Demodaten. Nur angesehen, nichts gespeichert (PDFs nur heruntergeladen).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/2d6e0557-c7a1-50fc-8e2b-2c19ae995e43/scratchpad/dr-weber-list/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungsliste `/statements` | Der Zeitraum in der Zeile (Sarah Meier «01.01.2025 – 30.06.2025», Nina Brunner «01.07.2025 – 31.12.2025») ist richtig, steht aber ohne Bezeichnung. Ob das die Abrechnungsperiode oder die Mietdauer ist, lässt sich nur erraten. Die Detailseite nennt in der Kopfzeile «Abrechnungsperiode 01.01.2025 – 31.12.2025», also für dieselbe Abrechnung ein anderes Datum. |
| P-2 | Minor | Abrechnungsliste `/statements` | Ob es schon ein PDF gibt, zeigt die Liste nicht. Jede Zeile hat denselben Link «PDF» (Entwurf, Versendet, Bezahlt). Das PDF erstellt ist, steht nur auf der Detailseite unter «Verlauf» («PDF erstellt 16.10.2026, 21:14»). Die zweite Frage meiner Aufgabe kann ich in der Liste also nicht beantworten. |

## Beobachtungen

- Die Zeiträume stimmen: Sarah Meier 01.01.–30.06.2025 hat 181 Mietstage, Nina Brunner 01.07.–31.12.2025 hat 184. Zusammen sind das 365. Auf der Detailseite und im PDF («Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025 (181 Mietstage von 365 Tagen)») steht dasselbe. Nachgerechnet habe ich Wohnung A2: TV 113.06 + 114.94 = 228.00 (= Wohnungsanteil) und Heizung 588.39 + 466.08 = 1'054.47 (= Wohnungsanteil). Damit ist A2 vollständig auf die beiden Mieterinnen verteilt.
- Das PDF formuliert es besser als die Liste: «Nebenkostenabrechnung 01.01.2025 – 31.12.2025» und darunter «Ihr Mietverhältnis in dieser Periode …». Die Liste nennt nur eines der beiden Daten und sagt nicht, welches.
- Die Detailseite zeigt nur «181 Mietstage», aber nicht die Daten des Mietverhältnisses. Um die Liste zu prüfen, muss ich also selbst rechnen.
- Zur Wohnung A2 gibt es zwei Zeilen, aber keinen Hinweis auf einen Mieterwechsel («ausgezogen», «eingezogen»). Wer genau hinsieht, erkennt ihn nur an den Daten.
- Die Liste lässt sich nicht nach Jahr filtern. 2024 und 2025 stehen gemischt; ohne Filter sind es 17 Abrechnungen auf 2 Seiten. Mit dem Filter «Seepark Residenz» bleiben 7 Abrechnungen auf einer Seite (4 aus 2025 im Entwurf, 3 aus 2024 bezahlt). Die Status-Kacheln übernehmen den Gebäudefilter, das ist gut.
- Den PDF-Link gibt es zweimal mit zwei Dateinamen: Aus der Liste heisst die Datei `statement-<id>.pdf` (englisch, nur eine ID), aus der Detailseite `abrechnung-<id>.pdf`. Der Inhalt ist gleich (24'626 Bytes). Für meine Ablage taugt keiner der beiden Namen, weil weder Mieter noch Nummer darin stehen.
- Unterschiedliche Begriffe: In der Kopfzeile von Sarahs Abrechnung steht «Zahlungsfrist», bei Nina «Rückerstattung bis». Das ist richtig und verständlich.

## Aufgabe geschafft: teilweise

Ob die Zeiträume stimmen: ja, die Liste zeigt sie richtig, aber ohne Bezeichnung (P-1). Welche Abrechnungen noch kein PDF haben: Die Liste sagt es nicht. Erst auf den vier Detailseiten unter «Verlauf» sah ich, dass alle vier Abrechnungen 2025 der Seepark Residenz schon ein PDF haben (P-2). Wie man aus der Liste ein PDF erstellt, ging nicht zu prüfen, weil es in den Demodaten keine Abrechnung ohne PDF gibt.

## Aufwand

Etwa 10 Minuten, 6 Schritte: Übersicht, Liste, Gebäudefilter, 4 Detailseiten, 2 PDFs heruntergeladen und gelesen.

## Ablauf

1. **Übersicht** (`01-dashboard.png`). Erwartet: ein Weg zu den Abrechnungen. Gesehen: «7 Nebenkostenabrechnungen sind noch im Entwurf … Entwürfe ansehen» und der Menüpunkt «Nebenkostenabrechnungen». Klar.
2. **Liste** (`02-list.png`). Erwartet: pro Abrechnung Mieter, Wohnung, abgerechneter Zeitraum und ob ein PDF da ist. Gesehen: Name als Link, Nummer, «Seepark Residenz, Wohnung A2», Datum ohne Bezeichnung, Saldo, Status-Etikett «Entwurf» und rechts «PDF». Die Zeile «01.01.2025 – 30.06.2025» bei Sarah Meier hielt ich zuerst für die Abrechnungsperiode und wunderte mich, warum das Gebäude eine halbjährige Periode hätte.
3. **Filter Gebäude «Seepark Residenz» + Suchen** (`03-seepark.png`). Erwartet: nur die Seepark-Abrechnungen. Gesehen: 7 Abrechnungen, die 2025 oben, dazu «Filter zurücksetzen». Ein Jahresfilter fehlt, ist hier aber nicht nötig.
4. **Detail Sarah Meier** (`05-sarah.png`). Erwartet: Bestätigung der Mietdauer. Gesehen: in der Kopfzeile «Abrechnungsperiode 01.01.2025 – 31.12.2025», unten «Mietstage in der Abrechnungsperiode: 181 Mietstage», im Verlauf «PDF erstellt 16.10.2026, 21:14». Damit war klar: Die Liste zeigt die Mietdauer, nicht die Periode. Gesagt wird das aber nirgends.
5. **Detail Nina Brunner** (`05-nina.png`). Gleich aufgebaut: 184 Mietstage, PDF erstellt. Danach Marco Bernasconi und Thomas Weber (`06-marco.png`, `06-thomas.png`): beide ganzjährig, beide mit «PDF erstellt».
6. **PDFs von Sarah und Nina** über den Link «PDF» in der Liste heruntergeladen. Erwartet: dieselben Daten. Gesehen: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025 (181 Mietstage von 365 Tagen)» bzw. «01.07.2025 – 31.12.2025 (184 …)», dazu ein Zeitanteil von 181/365 bzw. 184/365 Tagen in jeder Zeile, bei Heizung 55.80 % nach Heizprofil. Stimmig.

## Verwirrung

- Ein Datum ohne Bezeichnung in der Liste, während die Detailseite unter «Abrechnungsperiode» ein anderes Datum nennt. Für mich als vorsichtigen Leser wirkt das zuerst wie ein Widerspruch.
- «PDF» in jeder Zeile: Ist das ein vorhandenes Dokument oder wird es beim Klick erzeugt? Die Liste sagt es nicht. «PDF erstellt» steht nur im Verlauf der Detailseite.

## Fehlerrisiken

- Wer die Liste überfliegt, kann Sarah Meiers Zeile für eine Abrechnung mit falscher (halbjähriger) Abrechnungsperiode halten und sie unnötig löschen und neu erstellen.
- Wer wissen will, ob ein PDF fehlt, muss jede Detailseite öffnen. Bei vielen Entwürfen wird dann leicht eine Abrechnung ohne PDF übersehen und nicht versendet.

## Vorschläge

- **P-1:** Liste → Filter «Seepark Residenz» → Zeile Sarah Meier zeigt «01.01.2025 – 30.06.2025» ohne Bezeichnung, die Detailseite «Abrechnungsperiode 01.01.2025 – 31.12.2025». Hilfreich wäre in der Liste eine Bezeichnung wie «Mietdauer 01.01.2025 – 30.06.2025 (Periode 2025)», wie sie das PDF verwendet («Ihr Mietverhältnis in dieser Periode»). Auf der Detailseite sollten neben «181 Mietstage» die Daten des Mietverhältnisses stehen.
- **P-2:** Liste → Zeile Nina Brunner → «PDF». Ob es das PDF schon gibt, steht nur auf der Detailseite unter «Verlauf». Hilfreich wäre in der Zeile ein Hinweis wie «PDF erstellt am …» oder «Noch kein PDF», dazu bei fehlendem PDF eine Schaltfläche «PDF erstellen» statt des Download-Links. Ein Filter «ohne PDF» würde die Arbeit vor dem Versand verkürzen.

## Nicht geprüft

- Eine Abrechnung ohne PDF: In den Demodaten haben alle Seepark-Abrechnungen 2025 (und laut Liste auch alle übrigen) einen PDF-Link, und auf allen vier geöffneten Detailseiten steht «PDF erstellt». Wie die Liste eine Abrechnung ohne PDF zeigt und wie man von dort ein PDF erstellt, konnte ich nicht sehen. Dafür bräuchte es einen Datensatz ohne PDF oder eine fehlschlagende Anfrage, die mir nicht vorgegeben war.
- «Als versendet markieren» und die Bearbeitung habe ich nicht ausgelöst (nur ansehen).
- Seite 2 der ungefilterten Liste habe ich nicht geöffnet. Mit dem Gebäudefilter war sie nicht nötig.
