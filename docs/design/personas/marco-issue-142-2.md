# Marco – Issue #142, Runde 2: Warnung «Abrechnungen fehlen» auf dem Mietvertrag (Handy 390 × 844)

Persona: Marco, 38, angestellt, macht alles auf dem Handy und hat wenig Zeit. Gerät: 390 × 844, Touch, Zoom 100 %.
Aufgabe: die Mietverträge von Hans Müller und Maria Rossi (beide Musterhaus Zentrum) öffnen und nur beurteilen: ob P-1 (Höhe der Warnung), P-2 (umbrechende Knöpfe) und P-3 (womit anfangen) aus Runde 1 behoben sind, ob die Knöpfe mind. 48 px hoch und gut zu tippen sind und ob die Seite seitwärts scrollt. Nichts speichern.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit (war Minor; weitgehend behoben) | Mietvertrag (Handy) | Die Warnung ist jetzt 368 px hoch statt 436 px (Hans, 3 Perioden), und bei Maria Rossi (4 Perioden) gleich hoch, weil die Knöpfe zu zweit nebeneinander stehen. Die Karte «Mieter» beginnt bei 832 px statt bei 900 bzw. 1001 px. Auf dem ersten Bildschirm (844 px) sehe ich aber immer noch nur den oberen Rand der Karte, nicht den Namen. Die Warnung wäre noch kürzer, wenn der Text nicht um zwei Sätze länger geworden wäre (jetzt 8 Zeilen). |
| P-2 | behoben | Mietvertrag (Handy) | Die Knöpfe zeigen nur noch die Jahreszahl mit Rechner-Symbol, einzeilig, je etwa 120 × 48 px. Sie stehen zu zweit nebeneinander (2023 / 2022, darunter 2021 bzw. 2021 / 2020). Keine Beschriftung bricht mehr um. |
| P-3 | behoben | Mietvertrag (Handy) | Der Text sagt jetzt «Erfassen Sie zuerst die Rechnungen der Periode; die Reihenfolge spielt keine Rolle.» Damit weiss ich, dass ich mit jedem Jahr anfangen darf. |
| P-4 | Minor | Mietvertrag (Handy) | Auf den Knöpfen steht nur «2023», «2022» usw., ohne Verb. Was beim Antippen passiert, muss ich aus dem Text darüber schliessen («Jede Periode öffnet den Assistenten …»). Für mich als Eiligen geht das, aber ein Knopf «2023» sieht eher wie ein Filter oder eine Jahresauswahl aus als wie «Abrechnung erstellen». (Der Screenreader-Name ist «Abrechnungen 2023 erstellen», sichtbar ist davon nur die Zahl.) |

Knopfgrösse und Seitenbreite (Teil der Aufgabe, ohne Befund):

- Alle Perioden-Knöpfe sind 48 px hoch und 117 bis 121 px breit, mit 8 px Abstand waagrecht und senkrecht. Gut zu treffen; ich habe beim Antippen von «2020» bei Maria Rossi den richtigen erwischt.
- Kein Seitwärtsscrollen: Seitenbreite 390 px = Bildschirmbreite bei beiden Verträgen, kein Element ragt über den rechten Rand.

## Beobachtungen

- Der neue Satz «Jede Periode öffnet den Assistenten für alle Mietverträge des Gebäudes» beantwortet meine Frage aus Runde 1 (dass die Abrechnung fürs ganze Gebäude entsteht). Gut.
- «Erfassen Sie zuerst die Rechnungen der Periode»: Wo ich die Rechnungen erfasse, sagt die Warnung nicht; es gibt keinen Link dorthin. Weiter unten auf der Seite steht unter «Dazu gehört» ein Link «Rechnungen des Gebäudes», den ich aber erst nach langem Scrollen finde.
- Die Knöpfe bleiben unter das Warn-Symbol eingerückt (beginnen bei x = 76). Darum passen nur zwei nebeneinander statt drei; über die ganze Breite der Warnung hätten bei Hans alle drei auf eine Zeile gepasst und die Warnung wäre nochmals 56 px kürzer.
- Über der Warnung stehen weiterhin «Bearbeiten», «Beenden» und allein auf einer Zeile «Löschen»; die Warnung beginnt deshalb erst bei 432 px (war schon in Runde 1 so).
- «Dwello» im Text («noch keine Nebenkostenabrechnung in Dwello») ist neu; es klingt, als könnte ich die Abrechnung auch anderswo gemacht haben. Hat mich nicht gestört.

## Aufgabe geschafft: ja

## Aufwand

Etwa 3 Minuten, 2 Verträge angeschaut, 1 Knopf angetippt («2020» bei Maria Rossi), nichts gespeichert.

## Ablauf

1. **Vertrag Hans Müller öffnen.** Erwartet: eine kürzere Warnung mit kompakten Knöpfen. Gesehen (Screenshot `hans-fold.png`): Titel, Bearbeiten / Beenden / Löschen, dann die beige Warnung «3 Abrechnungen fehlen» mit dem Text «Der Mietvertrag hat Mietstage in diesen Abrechnungsperioden, aber noch keine Nebenkostenabrechnung in Dwello. Jede Periode öffnet den Assistenten für alle Mietverträge des Gebäudes. Erfassen Sie zuerst die Rechnungen der Periode; die Reihenfolge spielt keine Rolle.» Darunter die Knöpfe «2023», «2022» in einer Zeile, «2021» darunter. Die ganze Warnung ist auf dem ersten Bildschirm sichtbar, darunter knapp der obere Rand der nächsten Karte.
2. **Knöpfe messen.** Erwartet: mind. 48 px, einzeilig. Gesehen: 121 × 48, 120 × 48, 117 × 48 px, einzeilig, 8 px Abstand. P-2 behoben.
3. **Seitwärts scrollen.** Erwartet: nein. Gesehen: Seitenbreite 390 px, nichts ragt hinaus.
4. **Höhe der Warnung.** Erwartet: deutlich kürzer als 436 px. Gesehen: 368 px (432 bis 800 px), Karte «Mieter» ab 832 px, Überschrift «Mieter» bei 857 px, also knapp unter dem Bildschirmrand (P-1, jetzt nur noch Nit).
5. **Vertrag Maria Rossi öffnen.** Erwartet: in Runde 1 lag der vierte Knopf unter dem Bildschirmrand. Gesehen (Screenshot `rossi-fold.png`): «4 Abrechnungen fehlen», Knöpfe 2023 / 2022 und 2021 / 2020 in zwei Zeilen, alle vier auf dem ersten Bildschirm; Warnung gleich hoch wie bei Hans (368 px), «Mieter» ebenfalls bei 832 px. Kein Seitwärtsscrollen.
6. **Text lesen: womit anfangen?** Erwartet: ein Hinweis zur Reihenfolge. Gesehen: «die Reihenfolge spielt keine Rolle». P-3 behoben.
7. **«2020» bei Maria Rossi antippen.** Erwartet: der Assistent für 2020. Gesehen: «Abrechnungen erstellen», Schritt 3 von 5, «Gewählt: Musterhaus Zentrum, Abrechnungsperiode 01.01.2020 – 31.12.2020» (Screenshot `rossi-after-tap.png`). Kein Seitwärtsscrollen. Nichts gespeichert.

## Verwirrung

- Ein Knopf nur mit «2023»: ich musste kurz überlegen, ob das eine Jahresauswahl oder eine Aktion ist (P-4).
- «Erfassen Sie zuerst die Rechnungen der Periode»: wo? (Beobachtung)
- «Mietstage» wie in Runde 1: verstanden, aber kein Alltagswort.

## Fehlerrisiken

- Wer nur auf die Knöpfe schaut und den Text überspringt, weiss nicht, dass «2023» einen Assistenten fürs ganze Gebäude öffnet (P-4).
- Wer den Hinweis «zuerst die Rechnungen» überliest, startet den Assistenten vielleicht ohne Rechnungen; was dann passiert, habe ich nicht geprüft.

## Vorschläge

- **P-1:** Reproduktion: 390 × 844, Mietvertrag von Hans Müller oder Maria Rossi öffnen; Warnung 432 bis 800 px, Karte «Mieter» ab 832 px. Hilfreich: Knöpfe nicht unter das Symbol einrücken (dann drei pro Zeile), oder den Text kürzen; für mich reicht es aber schon so.
- **P-4:** Reproduktion: wie P-1, Knöpfe lesen: sichtbar nur «2023», «2022», «2021». Hilfreich: ein Verb, das kurz bleibt, z. B. eine Zeile über den Knöpfen «Abrechnung erstellen für:» oder die Knöpfe «2023 erstellen»; dann ist klar, dass es eine Aktion ist.

## Nicht geprüft

- Den Assistenten zu Ende durchlaufen und speichern: laut Auftrag nicht erlaubt; ob die Warnung danach kürzer wird, nicht gesehen.
- Andere Sprachen (Maria Rossi ist italienischsprachig, die Oberfläche war aber auf Deutsch) und Dunkelmodus: nicht Teil des Auftrags.
- Die Einzahl (nur eine fehlende Periode): keiner der beiden Verträge hat nur eine.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-142-2/`.
