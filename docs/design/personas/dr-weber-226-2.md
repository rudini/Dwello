# Persona-Lauf: Dr. Weber, Erklärung des Zeitanteils bei Rechnungen mit Leistungszeitraum (Issue 226, Runde 2)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles und rechnet nach. Desktop 1440 × 900, Maus (Persona-Kit, Zoom 100 %).
App: http://localhost:3300 (Persona-Stack, Version 0.4.11+981-g53b3db99), gespeichert nur im Gebäude «Seepark Residenz».
Skripte, Screenshots und das PDF: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dr-weber-226-2/`.

Aufgabe: Den vier Hauswart-Rechnungen 2025 der Seepark Residenz (je CHF 765.00) ihr Quartal als Leistungszeitraum geben, die Nebenkostenabrechnung 2025 für Nina Brunner (Wohnung A2, Einzug 01.07.2025) erstellen, das PDF erzeugen und als Nina Brunner lesen. Geprüft wird nur die Erklärung unter der Kostentabelle («Zeitanteil: …»).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF Seite 1, Erklärung unter der Kostentabelle | Die Erklärung des Zeitanteils ist ein einziger Satz mit vier Fällen, drei Strichpunkten und einer Klammer, in der wieder ein Strichpunkt steht. Inhaltlich führt sie zum Ergebnis, aber eine Mieterin muss ihn zwei- bis dreimal lesen. Der wichtigste Satz für die Hauswart-Zeilen («Ihr Anteil ist der Wohnungsanteil mal diese Berechnung») steckt mitten in der Klammer. |
| P-2 | Minor | PDF Seite 1, Zeilen unter «Hauswart» | Die Zeilen «01.07.2025 – 30.09.2025: 765.00, 92/92 Tage» sagen nicht, was die beiden Zahlen sind. Nur aus der Erklärung weiter unten erfährt man, dass die erste Zahl «Ihre Mietstage» und die zweite die Tage des Leistungszeitraums sind; das Wort «Leistungszeitraum» steht bei den Daten selbst nicht. |
| P-3 | Minor | PDF Seite 1, Formelzeile unter «Hauswart» | Die Formelzeile endet bei «= 50.00 %». Der letzte Schritt zu «Ihr Anteil» (784.13 × 50.00 % = 392.07) steht nicht da; die Mieterin muss ihn aus dem Klammersatz der Erklärung herleiten. |
| P-4 | Nit | PDF Seite 1, Erklärung | «Ihre Mietstage darin von dessen Tagen in der Periode» ist sprachlich holprig («darin», «dessen» beziehen sich auf «Leistungszeitraum», das man erst zurücksuchen muss). |

## Beobachtungen

- Die App nennt den Ort «Gebäude», das PDF und die Erklärung «Liegenschaft» («Kosten Liegenschaft», Absenderblock «Liegenschaft»). Für die Mieterin kein Problem, für mich als Vermieter ein Begriffswechsel zwischen App und Dokument.
- Die Detailseite der Abrechnung in der App zeigt für Hauswart nur «12.81 %» und CHF 392.07, ohne die Zeilen pro Rechnung und ohne Zeitanteil. Was das PDF erklärt, sehe ich als Vermieter vor dem Versand in der App nicht; 12.81 % ist dort Flächenanteil mal Zeitanteil zusammen, das steht nirgends.
- Im Assistenten «Abrechnungen erstellen» steht «Entwurf gespeichert, 09:56», auf der Rechnung und der Abrechnung «Zuletzt geändert 16.10.2026, 11:56» bzw. «Erstellt 16.10.2026, 11:57». Zwei Stunden Unterschied: vermutlich eine Zeitzone (UTC gegen Schweizer Zeit).
- Die Bearbeitungsseite der Rechnung warnt korrekt «Rechnung schon abgerechnet» (es gibt Entwürfe für Sarah Meier, Thomas Weber, Marco Bernasconi). Diese Entwürfe sind nach meiner Änderung nicht mehr richtig; ich habe sie nicht angefasst, da ich sie nicht erstellt habe.
- Die Abrechnungsliste zeigt bei Sarah Meier und Nina Brunner (beide Wohnung A2) die gleiche Zeile «01.01.2025 – 31.12.2025»; dass die beiden nur je ein halbes Jahr gewohnt haben, sieht man in der Liste nicht.
- Hilfetext beim Leistungszeitraum ist gut und konkret («Für das 4. Quartal also 01.10.2024 bis 31.12.2024 …»), das Beispieljahr 2024 wirkt im Jahr 2026 etwas alt.
- In der Abrechnungsliste hatte der neue Entwurf von Nina Brunner keinen Link «PDF», die anderen Entwürfe schon; das PDF entsteht erst mit «PDF erstellen» auf der Detailseite. Nachvollziehbar, aber in der Liste nicht erklärt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 25 Schritte: Rechnungen filtern (Gebäude, Kategorie, Jahr), vier Rechnungen bearbeiten und speichern (je Beginn, Ende, Speichern), Assistent in 5 Schritten mit «Die Abrechnungen trotzdem erstellen», Detailseite, «PDF erstellen», «PDF herunterladen», PDF lesen und nachrechnen.

## Ablauf

1. **Rechnungen finden.** Erwartet: Filter nach Gebäude und Kategorie. Gesehen: Filter «Gebäude», «Kategorie», «Jahr» mit «Suchen»; ergab genau «4 Rechnungen», Facility Service AG, Hauswartung Q1–Q4 2025, je CHF 765.00. Gut.
2. **Leistungszeitraum eintragen (4 ×).** Erwartet: Felder Beginn/Ende. Gesehen: Gruppe «Leistungszeitraum (optional)» mit klarem Hilfetext und Warnkasten «Rechnung schon abgerechnet». Eingetragen 01.01.–31.03., 01.04.–30.06., 01.07.–30.09., 01.10.–31.12.2025, gespeichert. Die Detailseite zeigt danach «Leistungszeitraum 01.01.2025 – 31.03.2025 – Nur die Tage in der Abrechnungsperiode zählen.» Kategorie Hauswart und Verteilschlüssel blieben erhalten. Gut.
3. **Abrechnung erstellen.** Erwartet: Assistent, nur Nina Brunner neu. Gesehen: Schritt 1 Periode 01.01.–31.12.2025 vorgeschlagen; Schritt 2 Seepark Residenz gewählt («15 Rechnungen in der Abrechnungsperiode»); Schritt 3 Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 %; Schritt 4 Vorschau «Anzahl Abrechnungen 1», Hinweis «Es gibt schon Abrechnungen … Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue», Liste nur «Nina Brunner Wohnung A2 … Rückerstattung CHF 97.20»; Häkchen «Die Abrechnungen trotzdem erstellen»; Schritt 5 «Entwürfe erstellen» → «1 Nebenkostenabrechnung ist als Entwurf erstellt.» Gut.
4. **PDF erstellen.** Detailseite NK-22222222-2025-0005, Knopf «PDF erstellen», danach «PDF herunterladen». PDF mit 2 Seiten.
5. **PDF lesen als Nina Brunner.** Kopf: «Ihr Mietverhältnis in dieser Periode: 01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)». Kostenübersicht mit Spalten Kosten Liegenschaft, Wohnungsanteil, Zeitanteil, Ihr Anteil. Hauswart: 3'060.00 | 784.13 | 50.00 % | 392.07, darunter (kleiner, grau):
   ```
   01.01.2025 – 31.03.2025: 765.00, 0/90 Tage
   01.04.2025 – 30.06.2025: 765.00, 0/91 Tage
   01.07.2025 – 30.09.2025: 765.00, 92/92 Tage
   01.10.2025 – 31.12.2025: 765.00, 92/92 Tage
   (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 92/92 + 765.00 × 92/92) / 3'060.00 = 50.00 %
   ```
   Unter der Tabelle (grau, klein):
   «Kosten Liegenschaft: die Rechnungen der Abrechnungsperiode; eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen. Wohnungsanteil: Kosten der Liegenschaft nach dem Verteilschlüssel. Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode; bei Rechnungen über verschiedene Tage nach ihren Beträgen gewichtet (Berechnung unter der Abrechnungsposition; Ihr Anteil ist der Wohnungsanteil mal diese Berechnung, der Prozentwert ist gerundet); bei Heizkosten der Anteil nach dem Heizprofil.»
6. **Nachrechnen.** Wohnungsanteil 3'060.00 × 82/320 = 784.125 → 784.13 ✓. Zeitanteil (0 + 0 + 765 + 765) / 3'060 = 0.5 = 50.00 % ✓. Ihr Anteil 784.13 × 50 % = 392.065 → 392.07 ✓. Zum Vergleich Kaltwasser 527.88 × 184/365 = 266.11 ✓. Erwartet: Die Erklärung sagt mir, was «92/92 Tage» ist und wie ich von den Zeilen zu 392.07 komme. Gesehen: Ja, beides steht drin: «Ihre Mietstage darin von dessen Tagen» erklärt 92/92 und 0/90, «nach ihren Beträgen gewichtet» erklärt die Formelzeile, «Ihr Anteil ist der Wohnungsanteil mal diese Berechnung» führt zu 392.07. Ich komme mit der Erklärung zum gedruckten Ergebnis, aber erst nach mehrmaligem Lesen (P-1 bis P-4).
7. **Plausibilität aus Mietersicht.** Warum Hauswart 50.00 %, die anderen Positionen aber 184/365 Tage (50.41 %)? Die Erklärung beantwortet es («bei einer Rechnung mit Leistungszeitraum …»), und die Zeilen zeigen, dass das 1. Halbjahr mit 181 Tagen kürzer ist als das 2. mit 184. Für Nina ist 50 % sogar etwas günstiger; die Rechnung ist nachvollziehbar und fair.

## Verwirrung

- «92/92 Tage» und «0/90 Tage» ohne Beschriftung: Ich habe zuerst gelesen «92 von 92 Tagen der Rechnung», was stimmt, aber dass die erste Zahl meine Mietstage sind, steht erst in der Erklärung (P-2).
- «Ihre Mietstage darin von dessen Tagen in der Periode»: «darin» und «dessen» muss man auf «Leistungszeitraum» zurückbeziehen (P-4).
- «Berechnung unter der Abrechnungsposition»: Gemeint sind die grauen Zeilen unter «Hauswart». Das Wort «Abrechnungsposition» steht im PDF sonst nirgends als Überschrift; man muss erraten, dass eine Tabellenzeile gemeint ist.
- «Leistungszeitraum»: Für eine Mieterin ein Fachwort, im PDF nicht erklärt und bei den Daten nicht genannt.
- Die Spalte «Zeitanteil» mischt «184/365 Tage» und Prozentwerte; die Erklärung deckt das ab, aber nur im langen Satz.

## Fehlerrisiken

- Eine Mieterin, die nur die Spalte «Zeitanteil» und die Kopfzeile «184 Mietstage von 365 Tagen» vergleicht, sieht 50.00 % statt 50.41 % und könnte einen Fehler vermuten; die Auflösung steht in kleiner grauer Schrift im langen Satz.
- Die Formelzeile endet in Prozent; wer 3'060.00 × 50 % rechnet (statt 784.13 × 50 %), kommt auf 1'530.00 und ist verwirrt (P-3).
- Für mich als Vermieter: Die App-Detailseite zeigt nur 12.81 %, so dass ich die PDF-Erklärung vor dem Versand nicht in der App kontrollieren kann (siehe Beobachtungen).

## Vorschläge

- **P-1** Reproduktion: Schritte 1–5 oben, PDF Seite 1, Absatz unter «Rückerstattung». Hilfreich: den Zeitanteil in eigene kurze Sätze teilen, etwa «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode. Bei einer Rechnung mit Leistungszeitraum zählen Ihre Mietstage in diesem Zeitraum. Hat eine Position mehrere solche Rechnungen, steht die Berechnung darunter. Ihr Anteil ist der Wohnungsanteil mal den Zeitanteil. Bei Heizkosten gilt der Anteil nach dem Heizprofil.»
- **P-2** Reproduktion: wie P-1, die vier grauen Zeilen unter «Hauswart». Hilfreich: die Zeile beschriften, z. B. «Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 765.00, Ihre Mietstage 92 von 92 Tagen».
- **P-3** Reproduktion: wie P-1, Formelzeile unter «Hauswart». Hilfreich: eine zweite Zeile «784.13 × 50.00 % = 392.07» oder die Formelzeile mit «Ihr Anteil: 784.13 × 50.00 % = 392.07» abschliessen.
- **P-4** Reproduktion: wie P-1. Hilfreich: «bei einer Rechnung mit Leistungszeitraum: Ihre Mietstage in diesem Zeitraum von seinen Tagen» oder die Formulierung aus dem Vorschlag zu P-1.

## Nicht geprüft

- Eine Rechnung, deren Leistungszeitraum über die Abrechnungsperiode hinausgeht (der Teil «in der Periode» der Erklärung): nicht Teil der Aufgabe, und ich hätte dafür eine weitere Rechnung anlegen oder ändern müssen.
- Ein Prozentwert, der wirklich gerundet wird («der Prozentwert ist gerundet»): hier ergibt sich genau 50.00 %.
- Andere Sprachen des PDFs, Darstellung in Dark Mode oder auf dem Handy: nicht Teil der Aufgabe.
- Die anderen Entwürfe der Seepark Residenz (Sarah Meier, Thomas Weber, Marco Bernasconi) habe ich nicht neu erstellt, da ich sie nicht angelegt habe.
