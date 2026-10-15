# Marco – Issue #142, Runde 3: Knöpfe in der Warnung «Abrechnungen fehlen» (Handy 390 × 844)

Persona: Marco, 38, angestellt, macht alles auf dem Handy und hat wenig Zeit. Gerät: 390 × 844, Touch, Zoom 100 %.
Aufgabe: die Mietverträge von Hans Müller und Maria Rossi (beide Musterhaus Zentrum) öffnen und nur beurteilen: ob P-4 (Knöpfe ohne Verb) behoben ist, ob die Knöpfe ohne Umbruch und ohne Seitwärtsscrollen passen und ob sie mind. 48 px hoch sind. Nichts speichern.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-4 | behoben | Mietvertrag (Handy) | Die Knöpfe heissen jetzt «2023 abrechnen», «2022 abrechnen», «2021 abrechnen» (bei Maria Rossi zusätzlich «2020 abrechnen»). Damit ist klar, dass es eine Aktion ist und keine Jahresauswahl. Der Screenreader-Name ist gleich wie die Beschriftung («link "2023 abrechnen"»). Antippen von «2023 abrechnen» bei Hans Müller öffnet «Abrechnungen erstellen», Schritt 3 von 5, «Gewählt: Musterhaus Zentrum, Abrechnungsperiode 01.01.2023 – 31.12.2023»: Das Verb passt zu dem, was passiert. |

Teil der Aufgabe, ohne Befund:

- **Kein Umbruch:** Jede Beschriftung steht auf einer Zeile (Textzeile 20 px hoch, eine Zeile, gemessen bei «2023 abrechnen»); im Screenshot `rossi-fold.png` ist nichts abgeschnitten oder umgebrochen.
- **Kein Seitwärtsscrollen:** Seitenbreite 390 px = Bildschirmbreite bei beiden Verträgen; kein Element ragt über den rechten Rand. Die Knöpfe enden bei x = 280 bis 284 px, die Warnung bei 374 px.
- **Höhe:** Alle Knöpfe sind 48 px hoch, 204 bis 208 px breit, 8 px Abstand senkrecht. Gut zu treffen.

## Beobachtungen

- **Die Warnung ist wieder deutlich höher geworden (durch diese Änderung).** Weil die Knöpfe mit dem Verb breiter sind (rund 208 px statt 120 px), steht jetzt nur noch einer pro Zeile statt zwei. Die Warnung misst bei Hans Müller 448 px (Runde 2: 368 px), bei Maria Rossi 504 px (Runde 2: 368 px). Die Karte «Mieter» beginnt bei 912 bzw. 968 px statt bei 832 px. Auf dem ersten Bildschirm (844 px) sehe ich bei beiden nur noch «2023 abrechnen» und «2022 abrechnen» ganz; «2021 abrechnen» ist unten angeschnitten (816 bis 864 px), «2020 abrechnen» bei Maria Rossi liegt ganz darunter. Damit ist mein P-1 aus Runde 1/2 (Höhe der Warnung) wieder etwa so schlimm wie in Runde 1 (436 px bei Hans). Zwei nebeneinander passen so nicht: 2 × 208 + 8 = 424 px, Platz ist ab x = 76 nur knapp 300 px. Ohne die Einrückung unter das Warn-Symbol (Knöpfe ab x = 76) hätten auch mit Verb vermutlich zwei pro Zeile Platz (16 bis 374 px = 358 px, knapp, nicht gemessen).
- Der Text ist nochmals etwas länger geworden: «Jede Schaltfläche öffnet den Assistenten für alle Mietverträge des Gebäudes in dieser Periode. Erfassen Sie zuerst die Rechnungen der Periode; mit welcher Periode Sie beginnen, spielt keine Rolle.» Jetzt 9 Zeilen. «Schaltfläche» ist ein Computerwort; ich hätte «Knopf» oder einfach «Jeder Knopf …» bzw. gar keinen Satz dazu gebraucht, seit die Knöpfe ein Verb haben.
- Wie in Runde 2: Wo ich die Rechnungen erfasse, sagt die Warnung nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 2 Minuten, 2 Verträge angeschaut, 1 Knopf angetippt («2023 abrechnen» bei Hans Müller), nichts gespeichert.

## Ablauf

1. **Vertrag Hans Müller öffnen.** Erwartet: Knöpfe mit Verb, weiterhin kompakt. Gesehen (Screenshot `hans-fold.png`): Warnung «3 Abrechnungen fehlen», Text in 9 Zeilen, darunter drei Knöpfe untereinander mit Rechner-Symbol: «2023 abrechnen», «2022 abrechnen», «2021 abrechnen». Der dritte ist am unteren Bildschirmrand angeschnitten.
2. **Knöpfe messen.** Erwartet: einzeilig, mind. 48 px. Gesehen: 208 × 48, 207 × 48, 204 × 48 px, einzeilig, 8 px Abstand. Erfüllt.
3. **Seitwärts scrollen.** Erwartet: nein. Gesehen: Seitenbreite 390 px, nichts ragt hinaus.
4. **Vertrag Maria Rossi öffnen.** Erwartet: wie bei Hans, ein Knopf mehr. Gesehen (Screenshot `rossi-fold.png`): «4 Abrechnungen fehlen», vier Knöpfe untereinander (2023 bis 2020), je 48 px hoch, einzeilig. Auf dem ersten Bildschirm ganz sichtbar nur 2023 und 2022, 2021 angeschnitten, 2020 erst nach Scrollen (Screenshot `rossi-full.png`). Kein Seitwärtsscrollen. Warnung 504 px hoch (Beobachtung).
5. **«2023 abrechnen» bei Hans antippen.** Erwartet: der Assistent für 2023. Gesehen (Screenshot `hans-after-tap.png`): «Abrechnungen erstellen», Schritt 3 von 5, Musterhaus Zentrum, Periode 01.01.2023 – 31.12.2023. Kein Seitwärtsscrollen. Nichts gespeichert. P-4 behoben.

## Verwirrung

- Keine bei den Knöpfen: «2023 abrechnen» verstehe ich sofort.
- «Schaltfläche» im Text: Fachwort aus der Computerwelt (Beobachtung).
- «Mietstage» wie in den Runden davor: verstanden, aber kein Alltagswort.

## Fehlerrisiken

- Bei Maria Rossi sehe ich auf dem ersten Bildschirm nur zwei der vier fehlenden Jahre ganz; wer nicht scrollt, könnte meinen, es fehlten nur 2023 und 2022 (die Überschrift «4 Abrechnungen fehlen» sagt es aber).

## Vorschläge

- **P-4:** behoben, kein Vorschlag. Reproduktion zur Kontrolle: 390 × 844, Mietvertrag von Hans Müller öffnen, Knöpfe lesen («2023 abrechnen» …), «2023 abrechnen» antippen: Assistent Schritt 3 für 2023.
- Zur Beobachtung «Warnung höher»: Knöpfe über die volle Breite der Warnung laufen lassen (nicht unter das Symbol einrücken), damit wieder zwei pro Zeile passen, oder den Satz «Jede Schaltfläche öffnet …» kürzen, da das Verb auf dem Knopf das schon sagt.

## Nicht geprüft

- Den Assistenten zu Ende durchlaufen und speichern: laut Auftrag nicht erlaubt.
- Andere Sprachen (längere Verben auf Französisch/Italienisch könnten anders umbrechen) und Dunkelmodus: nicht Teil des Auftrags.
- Die Einzahl (nur eine fehlende Periode): keiner der beiden Verträge hat nur eine.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-142-3/`.
