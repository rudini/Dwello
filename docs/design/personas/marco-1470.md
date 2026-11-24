# Marco – Heizkosten in der Abrechnung von Claudia Steiner (Handy)

Persona: Marco, 38, Handy 390 × 844, Touch. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/1050036a-1394-59ea-a01a-2a53c78f1ce6/scratchpad/marco-1470/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Abrechnungsposition Heizung | Die zweite Rechnung (Brennerservice) hat im PDF keine Bezeichnung, kein Datum und keine Nummer. Die Zeile beginnt direkt mit «Leistungszeitraum 01.07.2025 – 31.12.2025: CHF 368.00 …». Die Ölrechnung darüber dagegen heisst «Rechnung vom 22.09.2025 (Nr. MZ-2025-010)». Die Mieterin kann die Zeile keinem Beleg zuordnen, und auf dem Handy heisst dieselbe Rechnung «Brennerservice Juli–Dezember 2025». |
| P-2 | Minor | Abrechnung (Handy), Abrechnungsposition Heizung | Auf dem Handy steht nur «Anteil nach Heizprofil: 87.94 %» für den Brennerservice, ohne Begründung. Warum es 87.94 % sind (Monatsanteile Aug–Dez 38.87 % geteilt durch Jul–Dez 44.20 %), steht nur im PDF. Ich sehe ihre 139 Mietstage von 184 Tagen im Leistungszeitraum (rund 75 %) und verstehe auf dem Handy nicht, wie 87.94 % entstehen. |
| P-3 | Minor | Abrechnung (Handy) und PDF, Formel unter Heizung | Die Formel ist nicht gleich formuliert. Auf dem Handy steht «Ihr Anteil: 888.62 × (6’565.00 × 38.87 % + …) / 6’933.00 = 368.55», im PDF «888.62 × Zeitanteil (6'565.00 × 38.87 % + …)». Mit dem Wort «Zeitanteil» davor lese ich im PDF: 888.62 mal den Zeitanteil 41.47 % (aus der Spalte) mal die Klammer. Das wäre doppelt gerechnet. Die Rechnung stimmt nur ohne diese zusätzliche Multiplikation. |
| P-4 | Minor | Abrechnung (Handy), Abrechnungsposition Heizung | Als «Zeitanteil» steht bei Heizung nur «41.47 %». Die anderen Positionen zeigen dort «139/365 Tage», Kaminfeger «38.87 % nach Heizprofil». Woher die 41.47 % kommen (Mischwert beider Rechnungen), sagt der Bildschirm nicht. Im PDF erklärt das die Legende. Dazu kommen auf einer Karte vier verschiedene «Anteil»-Wörter: Wohnungsanteil, Anteil, Anteil nach Heizprofil und Ihr Anteil. |

## Beobachtungen

- **Kaminfeger-Karte auf dem Handy abgeschnitten:** Bei Kaminfeger ist der Zeitanteil abgeschnitten. Sichtbar ist «38.87 % nach Heiz», der Rest liegt ausserhalb der Karte. Das Element ist 184 px breit, die Spalte nur 129 px (Screenshot `05-kaminfeger.png`). Die Seite selbst scrollt nicht seitwärts (scrollWidth 390 = clientWidth 390). Das betrifft nicht die Heizungs-Position, aber dieselbe Seite und dasselbe Heizprofil.
- In der Heizungs-Karte auf dem Handy ist nichts abgeschnitten (Screenshot `04-heizung.png`). Alle Zeilen umbrechen sauber und haben 16 px Schrift. Den Verteilschlüssel «Heizung (Fläche 70 % / Einheit 30 %)» bricht die App auf drei Zeilen um, rechtsbündig. Das ist lesbar, aber etwas holprig. Die Formel bricht mitten im Ausdruck um, das ist noch lesbar.
- Die Ölrechnung erkenne ich auf dem Handy gut: Ihr Name «Heizöl EL, 6'400 Liter» ist ein Link, darunter steht «Lieferung in den Tank, gilt für die ganze Abrechnungsperiode». Auf der Rechnung selbst steht «Zählt als Lieferung in den Tank». Beim Brennerservice steht «Zählt mit den Tagen ihres Leistungszeitraums, nicht als Lieferung in den Tank». Das ist klar.
- Im PDF sagt nur der Halbsatz «Lieferung in den Tank», dass es um Öl geht. Den Namen «Heizöl» nennt das PDF bei der Rechnung nicht.
- Im PDF ergeben die Monatsanteile der Mieterin beim Brennerservice «zusammen 38.87 %». Das ist zufällig dieselbe Zahl wie der Anteil der Ölrechnung. Beim ersten Lesen dachte ich, da sei etwas doppelt.
- Im PDF stehen die Zeilen unter Heizung klein und grau, ohne Abstand zwischen den beiden Rechnungen (Screenshot `crop2-1.png`). Auf dem Handy muss ich stark zoomen und dann seitwärts schieben, weil das PDF eine A4-Seite ist. In der App ist das besser gelöst.
- Im PDF steht bei Kaminfeger als Zeitanteil «38.87 %», auf dem Handy «38.87 % nach Heizprofil». Das ist leicht verschieden, aber nicht widersprüchlich.
- «Ihr Anteil» auf dem Bildschirm des Verwalters: Gemeint ist der Anteil der Mieterin, angesprochen bin aber ich. Im PDF passt das «Ihr», weil es an die Mieterin geht.
- «PDF herunterladen» lädt auf dem Handy direkt die Datei `NK-11111111-2025-0005.pdf` herunter, und die Seite bleibt stehen. Das ist gut.
- Die Rechnung «Brennerservice» zeigt «Abrechnungen nicht aktuell», weil sie nur in der Abrechnung von Claudia Steiner steckt. Das kommt vom Aufbau dieses Prüflaufs und ist kein Befund.
- Die Rechnung von P-2 habe ich nachgerechnet: 888.62 × (6’565 × 38.87 % + 368 × 87.94 %) / 6’933 = 368.55. Das stimmt.

## Aufgabe geschafft: ja

Die Heizung kostet Claudia Steiner CHF 368.55. Der Betrag besteht aus zwei Rechnungen:
- Heizöl EL, 6'400 Liter, CHF 6’565.00, vom 22.09.2025: Lieferung in den Tank, zählt über die ganze Periode, ihr Anteil nach Heizprofil ist 38.87 %.
- Brennerservice Juli–Dezember 2025, CHF 368.00: zählt mit seinem Leistungszeitraum, ihr Anteil ist 87.94 %.

Das «Warum» der 87.94 % fand ich erst im PDF.

## Aufwand

Etwa 10 Minuten. Rund 8 Taps: Übersicht → «Musterhaus Zentrum, 2025» → Claudia Steiner → Heizungs-Karte lesen → Ölrechnung öffnen → zurück → Brennerservice öffnen → zurück → «PDF herunterladen».

## Ablauf

- **Heizungs-Karte, Zeitanteil.** Erwartet: «139/365 Tage» oder «nach Heizprofil», wie bei den anderen Positionen. Gesehen: nur «41.47 %», ohne Erklärung (P-4).
- **Brennerservice auf dem Handy.** Erwartet: ein Anteil um 75 % (139 von 184 Tagen) oder eine Begründung. Gesehen: 87.94 %, ohne Begründung (P-2).
- **Kaminfeger-Karte.** Erwartet: Alles ist sichtbar. Gesehen: «38.87 % nach Heiz» ist abgeschnitten (Beobachtungen).
- **PDF, Heizungs-Zeilen.** Erwartet: dieselben beiden Rechnungsnamen wie in der App. Gesehen: Die Ölrechnung erscheint als «Rechnung vom 22.09.2025 (Nr. MZ-2025-010)», der Brennerservice ganz ohne Bezeichnung (P-1).
- **PDF, Formel.** Erwartet: dieselbe Formel wie in der App. Gesehen: ein zusätzliches Wort «Zeitanteil» vor der Klammer (P-3).

## Vorschläge

- **P-1:** Öffnen Sie die Abrechnung NK-11111111-2025-0005 und tippen Sie auf «PDF herunterladen». Auf Seite 1 unter Heizung hat die zweite Zeile keinen Bezug zu einer Rechnung. Hilfreich wäre, jede Rechnungszeile gleich zu beginnen: «Rechnung vom 31.12.2025 (Nr. MZ-2025-1470), Leistungszeitraum …». Noch besser wäre die Beschreibung der Rechnung wie in der App, zum Beispiel «Heizöl EL, 6'400 Liter».
- **P-2:** Öffnen Sie die Abrechnung von Claudia Steiner auf dem Handy und schauen Sie die Heizungs-Karte an. Hilfreich wäre ein kurzer Satz unter der Rechnungszeile, wie im PDF: «Monate im Heizprofil Jul–Dez zusammen 44.20 %, davon in Ihrem Mietverhältnis 38.87 %». Es kann auch ein Hilfetext sein, der sagt, dass die Wintermonate im Heizprofil mehr zählen.
- **P-3:** Vergleichen Sie die Formel unter Heizung in der App und im PDF. Beide sollten gleich lauten. Das Wort «Zeitanteil» vor der Klammer im PDF sollte wegfallen, oder es sollte klar sein, dass die Klammer der Zeitanteil ist, zum Beispiel «× (… ) / 6’933.00 (Zeitanteil 41.47 %)».
- **P-4:** Schauen Sie auf dem Handy die Heizungs-Karte an, Zeile «Zeitanteil». Hilfreich wäre ein Zusatz wie bei Kaminfeger, zum Beispiel «41.47 % nach Heizprofil, aus den Rechnungen unten». Den Zeitanteil von Kaminfeger sollte die App umbrechen statt abschneiden.

## Nicht geprüft

- **Das PDF in einem echten Handy-PDF-Viewer:** Headless Chromium zeigt das PDF nicht an. Ich habe es heruntergeladen und als Bild in Handy-Breite (47 dpi) und vergrössert angeschaut.
- **Ob die Kaminfeger-Abschneidung Teil der Änderung ist:** Dafür kenne ich die Änderung nicht.
- **Speichern, Neu berechnen und Versenden:** Das habe ich absichtlich nicht gemacht, weil die Aufgabe nur das Anschauen erlaubte.
