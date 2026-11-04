# Marco – #1089: Verlauf der Abrechnung und Heizprofil-Auswahl auf dem Handy

Persona: Marco, 38, Smartphone 390 × 844, Touch. Gebäude: «Seepark Residenz». Persona-App auf http://localhost:3300 (Demo-Daten).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-1089/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungsdetail, Box «Verlauf» (auch «Cronologia» auf Italienisch) | Der Eintrag «Versendet per E-Mail an thomas.weber@example.ch» bricht mitten in der E-Mail-Adresse um: «thomas.weber@exa» / «mple.ch», dazu steht «an» allein auf einer Zeile. Der Eintrag nimmt vier Zeilen ein, die Adresse ist auf einen Blick schwer zu lesen und zu prüfen. Auf Italienisch dasselbe: «thomas.weber@exa» / «mple.ch». |

## Beobachtungen

- Die Daten im «Verlauf» stehen sauber rechtsbündig untereinander (alle enden an derselben Kante), jeder Eintrag steht in seiner Zeile links, das Datum rechts auf der Höhe der ersten Zeile. Das liest sich gut. Bei Uhrzeiten mit unterschiedlich breiten Ziffern («07:08» und «07:10») beginnen die Daten links um ein paar Pixel versetzt; nur beim genauen Hinsehen sichtbar, gestört hat es mich nicht.
- Bei den drei bezahlten Abrechnungen 2024 (Thomas Weber, Sarah Meier, Marco Bernasconi) steht im Verlauf «Erstellt 04.11.2026» und «PDF erstellt 04.11.2026» vor «Versendet 14.04.2025» und «Bezahlt 05.05.2025»: Erstellt liegt also nach Versendet. Das kommt wohl aus den Demo-Daten (heute erzeugt), sieht aber unlogisch aus. Ausserdem ist die Reihenfolge nicht nach Datum sortiert.
- Bei den bezahlten Einträgen 2024 steht bei «Versendet» kein Weg (E-Mail oder Brief), beim neu versendeten Eintrag 2025 schon. Das ist nicht gleich aufgebaut.
- Nach dem Versand kam unten die Meldung «Abrechnung per E-Mail versendet», Status «Versendet», und im Verlauf ein Link «Versendetes PDF herunterladen». Gut.
- In der Kostenaufstellung bricht «TV/Kabelanschluss» als «TV/Kabelanschl» / «uss» um (Abrechnungsdetail, oben auf dem Handy). Nicht Teil dieser Änderung.
- Der Gebäudefilter in der Abrechnungsliste ändert die Adresse nicht (bleibt `/statements`); nach Neuladen wäre der Filter vermutlich weg. Nicht weiter geprüft.
- Die Sprache gilt nur für diesen Browser: Nach dem Wechsel auf «Italiano» kam eine neue Browsersitzung wieder auf Deutsch.
- Heizprofil-Schritt auf Italienisch: Der Hilfetext über der Auswahl ist sehr lang (etwa 15 Zeilen auf dem Handy), bevor ich zur Auswahl komme.
- Im Diagramm «Quota delle spese di riscaldamento per mese» haben die Sommermonate bei «Riscaldamento Ticino» keine sichtbare Säule, nur die Beschriftung mit viel Leerraum darüber.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 30 Schritte (Liste filtern, 3 Abrechnungen 2024 öffnen, Entwurf 2025 von Thomas Weber per E-Mail senden, Verlauf lesen, Sprache wechseln, Assistent bis Schritt 3, vier Profile wählen, zurück auf Deutsch).

## Ablauf

- Verlauf nach dem Versand (Abrechnung NK-22222222-2025-0001, Thomas Weber). Erwartet: Eintrag «Versendet per E-Mail an …» mit der Adresse in einem Stück. Gesehen: Eintrag über vier Zeilen, die Adresse mitten im Wort getrennt («thomas.weber@exa» / «mple.ch»), «an» allein auf einer Zeile (Screenshot `10-verlauf-2025-weber.png`).
- Verlauf der Abrechnungen 2024. Erwartet: Einträge in zeitlicher Reihenfolge. Gesehen: «Erstellt» und «PDF erstellt» am 04.11.2026 stehen vor «Versendet 14.04.2025» (Screenshot `04-2024-weber-verlauf.png`).
- Heizprofil-Auswahl («Profilo di riscaldamento»). Erwartet und gesehen: jedes der vier Profile («Riscaldamento + acqua calda», «Riscaldamento Altipiano», «Riscaldamento Montagna», «Riscaldamento Ticino») steht vollständig im 48 px hohen Feld, mit Platz bis zum Pfeil; die Seite ist 390 px breit, nichts scrollt seitlich (Screenshots `16-profil-1.png` bis `19-profil-4.png`). Keine Abweichung.

## Vorschläge

- P-1: Abrechnungen → Gebäude «Seepark Residenz» → «Suchen» → Entwurf 2025 von Thomas Weber öffnen → «Per E-Mail senden» → im Dialog «Per E-Mail senden» → nach unten zur Box «Verlauf». Auf 390 px bricht die E-Mail-Adresse mitten im Wort. Hilfreich: die Adresse als eigene Zeile unter «Versendet per E-Mail» und nur an sinnvollen Stellen trennen (z. B. nach «@»), oder auf dem Handy das Datum unter den Eintrag statt daneben setzen, damit der Eintrag die ganze Breite bekommt.

## Nicht geprüft

- Versand per Brief und dessen Verlaufseintrag: alle vier Entwürfe 2025 der Seepark Residenz haben den Korrespondenzkanal E-Mail («Per E-Mail senden»); den Wechsel «Stattdessen per Brief zustellen» im Dialog habe ich nicht genutzt, weil die Aufgabe den Weg des Mieters verlangt.
- Die native Auswahlliste des Handys (aufgeklappt) kann der Headless-Browser nicht zeigen; geprüft habe ich das geschlossene Feld mit jedem gewählten Profil.
- Den Assistenten habe ich nach Schritt 3 nicht weitergeführt (keine neuen Abrechnungen 2024 erstellt).
