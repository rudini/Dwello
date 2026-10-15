# Marco – Issue #142: Warnung «Abrechnungen fehlen» auf dem Mietvertrag (Handy 390 × 844)

Persona: Marco, 38, angestellt, macht alles auf dem Handy und hat wenig Zeit. Gerät: 390 × 844, Touch, Zoom 100 %.
Aufgabe: die Mietverträge von Hans Müller (Musterhaus Zentrum) und Laura Keller (Alpenblick) öffnen und nur die neue Warnung beurteilen: wie die Knöpfe passen, ob sie gut zu tippen sind (mind. 48 px), ob die Seite seitwärts scrollt, wie weit die Warnung den Rest des Vertrags nach unten schiebt. Nichts speichern.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag (Handy) | Die Warnung ist bei 3 fehlenden Perioden 436 px hoch (mehr als die halbe Bildschirmhöhe). Auf dem ersten Bildschirm sehe ich nur Titel, Knöpfe und die Warnung; die erste Vertragsangabe (Karte «Mieter») beginnt erst bei etwa 900 px, unter dem Bildschirmrand. Jede weitere Periode kostet 76 px mehr: bei Maria Rossi (4 Perioden) liegt der vierte Knopf schon unter dem Rand und «Mieter» bei 1001 px. |
| P-2 | Minor | Mietvertrag (Handy) | Die Knöpfe sind unter dem Warn-Symbol eingerückt (beginnen bei x = 76, nur 282 px breit). Dadurch bricht jede Beschriftung um: «Abrechnung 2023» / «erstellen» auf zwei Zeilen. Das macht jeden Knopf 68 px statt 48 px hoch und die Warnung entsprechend länger (verstärkt P-1). |
| P-3 | Minor | Mietvertrag (Handy) | Der Text sagt «Erstellen Sie sie im Assistenten, eine Periode nach der anderen», die Knöpfe stehen aber neueste zuerst (2023, 2022, 2021). Ich weiss nicht, ob ich oben (2023) oder unten (2021, die älteste) anfangen soll; alle drei Knöpfe sehen gleich aus. |

## Beobachtungen

- Der Knopf führt in den Assistenten «Abrechnungen erstellen», direkt zu Schritt 3 von 5, mit «Gewählt: Musterhaus Zentrum, Abrechnungsperiode 01.01.2023 – 31.12.2023». Das passt. Mir war aber nicht klar, dass dort Abrechnungen für das ganze Gebäude entstehen («für ganze Gebäude»), obwohl ich vom Vertrag von Hans Müller komme. Auf dem Vertrag steht davon nichts.
- Bei Laura Keller steht «Abrechnung 2025 erstellen» ganz oben. Ob für 2025 schon alle Rechnungen da sind, sagt die Warnung nicht; das merke ich erst im Assistenten (dort nicht weiter geprüft, nichts gespeichert).
- Über der Warnung stehen «Bearbeiten», «Beenden» und, allein auf einer eigenen Zeile, «Löschen» (rot). Das schiebt die Warnung schon auf 432 px herunter; das war vorher schon so.
- Die Lücke bei Laura (2025, 2023, 2022; 2024 fehlt) ist richtig, 2024 ist offenbar schon abgerechnet. Die Lücke fällt aber auf; ein Hinweis «2024 ist erledigt» fehlt nicht wirklich, es hat mich nur kurz stutzig gemacht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 3 Verträge angeschaut (Hans Müller, Laura Keller, zum Vergleich Maria Rossi), 2 Knöpfe angetippt (Hans 2023, Laura 2025), nichts gespeichert.

## Ablauf

1. **Vertrag Hans Müller öffnen.** Erwartet: oben eine kurze Warnung, darunter die Vertragsangaben. Gesehen: Titel «Mietvertrag von Hans Müller», Knöpfe Bearbeiten / Beenden / Löschen, dann eine beige Warnung mit Warndreieck: «3 Abrechnungen fehlen», Text «Der Mietvertrag hat Mietstage in diesen Abrechnungsperioden, aber noch keine Nebenkostenabrechnung. Erstellen Sie sie im Assistenten, eine Periode nach der anderen.» und drei umrandete Knöpfe «Abrechnung 2023 erstellen», «… 2022 …», «… 2021 …». Der dritte Knopf ist am Bildschirmrand halb abgeschnitten (Screenshot `hans-fold.png`). Von den Vertragsangaben sehe ich nichts.
2. **Knöpfe messen.** Erwartet: mind. 48 px hoch, gut zu treffen. Gesehen: jeder Knopf 282 × 68 px, 8 px Abstand dazwischen. Gut zu tippen, ich habe keinen falschen erwischt. Die Beschriftung bricht aber in jedem Knopf um (P-2).
3. **Seitwärts scrollen.** Erwartet: nein. Gesehen: Seitenbreite 390 px = Bildschirmbreite, kein Element ragt über den Rand. In Ordnung.
4. **Nach unten scrollen.** Erwartet: Vertragsangaben gleich unter der Warnung. Gesehen: Warnung von 432 bis 868 px, die Karte «Mieter» erst ab etwa 900 px. Ich muss also immer erst über die Warnung scrollen, um Name, Telefon oder Miete zu sehen (P-1).
5. **Vertrag Laura Keller öffnen.** Gesehen: gleiches Bild, «3 Abrechnungen fehlen», Knöpfe 2025, 2023, 2022, gleiche Masse (Screenshot `laura-full.png`: ganze Seite 2369 px lang, Warnung belegt das obere Drittel nach den Aktionsknöpfen).
6. **Vergleich Maria Rossi** (seit 2020). Gesehen: 4 Knöpfe (2023 bis 2020), der vierte beginnt bei 860 px und liegt damit unter dem Bildschirmrand, «Mieter» erst bei 1001 px.
7. **«Abrechnung 2023 erstellen» bei Hans antippen.** Erwartet: der Assistent mit Gebäude und Jahr schon gewählt. Gesehen: «Abrechnungen erstellen», Schritt 3 von 5, «Gewählt: Musterhaus Zentrum, Abrechnungsperiode 01.01.2023 – 31.12.2023» (Screenshot `hans-after-tap.png`). Passt. Kein Seitwärtsscrollen. Nichts gespeichert.
8. **«Abrechnung 2025 erstellen» bei Laura antippen.** Gesehen: gleicher Assistent, «Alpenblick, 01.01.2025 – 31.12.2025». Nichts gespeichert.

## Verwirrung

- «eine Periode nach der anderen» zusammen mit der Reihenfolge neueste zuerst: wo anfangen? (P-3)
- «Mietstage» habe ich verstanden, ist aber ein Wort, das ich sonst nicht brauche.
- Dass der Knopf auf einem Vertrag eine Abrechnung für das ganze Gebäude anstösst, steht erst im Assistenten.

## Fehlerrisiken

- Auf dem Handy übersehe ich unter einer langen Warnung leicht, dass der Vertrag selbst weiter unten steht; wer nur die Telefonnummer sucht, muss jedes Mal an drei oder mehr Knöpfen vorbeiscrollen (P-1).
- Wer die Perioden in der angezeigten Reihenfolge abarbeitet, macht die neueste zuerst; falls die ältere zuerst gemacht werden sollte, steht das nirgends (P-3).

## Vorschläge

- **P-1:** Reproduktion: 390 × 844, Mietvertrag von Hans Müller öffnen; Warnung 436 px hoch, «Mieter» bei etwa 900 px; bei Maria Rossi 4 Knöpfe, «Mieter» bei 1001 px. Hilfreich: bei mehreren Perioden die Knöpfe kompakter (siehe P-2) oder ab 3 Perioden nur den nächsten Knopf zeigen und die übrigen hinter «Alle 3 anzeigen» auf- und zuklappbar machen.
- **P-2:** Reproduktion: wie P-1, Knöpfe messen: 282 × 68 px, Beschriftung zweizeilig. Hilfreich: Knöpfe auf dem Handy nicht unter das Symbol einrücken, sondern über die ganze Breite der Warnung (dann passt «Abrechnung 2023 erstellen» auf eine Zeile, 48 px hoch), oder Knöpfe kürzer beschriften, solange das Verb bleibt.
- **P-3:** Reproduktion: Warnung lesen, Text «eine Periode nach der anderen», Knöpfe 2023, 2022, 2021. Hilfreich: im Text sagen, womit man anfängt (z. B. «Beginnen Sie mit der obersten»), oder die Reihenfolge so wählen, wie man sie abarbeiten soll.

## Nicht geprüft

- Den Assistenten zu Ende durchlaufen und speichern: laut Auftrag nicht erlaubt. Ob die Warnung nach dem Erstellen einer Abrechnung kürzer wird, konnte ich deshalb nicht sehen.
- Die Einzahl («1 Abrechnung fehlt» o. ä.): keiner der angeschauten Verträge hatte nur eine fehlende Periode.
- Andere Sprachen und Dunkelmodus: nicht Teil des Auftrags.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-142/`.
