# Persona-Lauf: Helga – Issue #142, Runde 2 (Warnung «Abrechnungen fehlen» auf dem Mietvertrag)

Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, unsicher bei Fachbegriffen. Desktop 1440 × 900, Zoom 150 % (Gegenprobe 200 %), Maus.
Aufgabe: Die Mietverträge von Hans Müller (Musterhaus Zentrum) und Laura Keller (Alpenblick) öffnen und nur beurteilen, ob P-2 (was der Knopf tut) und P-3 (zuerst Rechnungen) behoben sind, ob die kurzen Jahres-Knöpfe klar sind und ob etwas Neues unklar ist. P-1 (alte Jahre ohne Ausweg) bleibt nach Entscheid offen (#133) und wird hier nicht bewertet. Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-142-2/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-2 | behoben | Mietvertrag, Warnung | Der Text sagt jetzt, dass sich der Assistent «für alle Mietverträge des Gebäudes» öffnet. Ich bin nicht mehr überrascht, dass auch Rossi und Fischer dabei sind. |
| P-3 | behoben (Text) | Mietvertrag, Warnung | «Erfassen Sie zuerst die Rechnungen der Periode» steht jetzt in der Warnung. |
| P-5 | Minor | Mietvertrag, Satz nach «zuerst die Rechnungen» | «… die Reihenfolge spielt keine Rolle» steht direkt nach «Erfassen Sie zuerst die Rechnungen». Ich habe es zuerst so gelesen: «Rechnungen oder Abrechnung zuerst, egal». Das widerspricht dem «zuerst» davor. Erst beim zweiten Lesen habe ich vermutet, dass die Reihenfolge der Jahre gemeint ist. |
| P-6 | Minor | Mietvertrag, Knöpfe «2025», «2023», «2022» | Auf den Knöpfen steht nur die Jahreszahl, ohne Tätigkeitswort. Ob ich damit etwas anschaue oder etwas erstelle, sagt mir der Knopf nicht; beim Darüberfahren erscheint auch kein Hinweis. Ich muss es aus dem Satz «Jede Periode öffnet den Assistenten …» schliessen, und dort ist eine «Periode» das, was etwas öffnet, nicht ein Knopf. Das Rechner-Symbol hilft etwas («hier wird gerechnet»). |
| P-7 | Minor | Mietvertrag, Warnung | Die Warnung sagt «zuerst die Rechnungen», aber die einzigen Knöpfe in der Warnung führen zur Abrechnung, also zum zweiten Schritt. Den Weg zu den Rechnungen («Rechnungen des Gebäudes») finde ich erst ganz unten unter «Dazu gehört», und dort ist das Jahr nicht vorgewählt («Alle Jahre»). |

## Beobachtungen

- Der Assistent beginnt nach dem Klick weiterhin bei «Schritt 3 von 5». Die Zeile «Gewählt: Alpenblick, Abrechnungsperiode 01.01.2023 – 31.12.2023» hilft mir aber, und die ersten zwei Schritte sind als «erledigt» markiert. Das hat mich nicht mehr gestört.
- Der Hilfetext zum Heizprofil in Schritt 3 ist immer noch ein sehr langer Absatz (schon in Runde 1 notiert).
- In der Rechnungsliste von Alpenblick stehen mehrere Rechnungen aus 2025 (z. B. Winterdienst Oberland, BKW Energie AG, Heizöl Oberland AG), obwohl die Übersicht in Runde 1 Alpenblick 2025 als «noch nicht abgerechnet» nannte. Ob Rechnungen fehlen oder schon da sind, kann ich als Laie nicht beurteilen.
- P-4 aus Runde 1 (die Lücke 2024 bei Keller wird nicht erklärt) ist unverändert: 2025, 2023, 2022. Mit den Jahreszahlen nebeneinander fällt die Lücke sogar etwas mehr auf. Nach meiner Aufgabe nicht bewertet.
- Das Menü ist weiterhin hinter den drei Strichen. Diesmal habe ich es gleich gefunden.

## Aufgabe geschafft: ja

Beide Verträge geöffnet, die Warnung gelesen, einen Jahres-Knopf bis in den Assistenten verfolgt und den Link zu den Rechnungen ausprobiert. Nichts erstellt.

## Aufwand

Etwa 8 Minuten, 9 Schritte.

## Ablauf

1. **Übersicht › Menü › Mietverträge › Hans Müller.** Erwartet: dieselbe Warnung wie letztes Mal, vielleicht mit besserem Text. Gesehen (`03-mueller.png`): beiger Kasten mit Warndreieck, «3 Abrechnungen fehlen», darunter der neue Text mit drei Sätzen und drei kurze Knöpfe «2023», «2022», «2021», je mit einem kleinen Rechner-Symbol. Der Kasten ist kompakter als vorher.
2. **Text lesen.** Erwartet: Was passiert beim Klick, und was muss ich vorher tun. Gesehen: «Jede Periode öffnet den Assistenten für alle Mietverträge des Gebäudes.» Das beantwortet meine Frage aus Runde 1 (P-2 behoben). «Erfassen Sie zuerst die Rechnungen der Periode» beantwortet P-3. Dann aber «die Reihenfolge spielt keine Rolle»: Hier bin ich hängen geblieben. Gerade stand doch «zuerst»? (P-5)
3. **Die Knöpfe ansehen.** Erwartet: ein Knopf, der sagt, was er tut, wie «Bearbeiten» oder «Beenden» oben. Gesehen: nur «2023». Ich hätte auch denken können, dass ich damit die Abrechnung 2023 ansehe. Mit der Maus darüber erscheint kein Hinweis (`05-keller-hover.png`, der Knopf wird nur hellblau). (P-6)
4. **Vertrag Laura Keller** (`04-keller.png`). Gleiche Warnung, Knöpfe «2025», «2023», «2022».
5. **Klick auf «2023» (Keller).** Erwartet nach dem Text: der Assistent für ganz Alpenblick. Gesehen (`06-keller-2023-assistent.png`): «Abrechnungen erstellen … für ganze Gebäude», Schritt 3 von 5, «Gewählt: Alpenblick, Abrechnungsperiode 01.01.2023 – 31.12.2023». Das passt zum Text. Ich bin nicht weitergegangen.
6. **Zurück zum Vertrag, Rechnungen suchen.** Erwartet: in der Warnung einen Weg zu den Rechnungen, weil sie «zuerst» kommen. Gesehen: Keiner in der Warnung. Ganz unten unter «Dazu gehört» gibt es «Rechnungen des Gebäudes» (P-7).
7. **Klick auf «Rechnungen des Gebäudes»** (`08-rechnungen-gebaeude.png`). Gesehen: Rechnungen, Gebäude «Alpenblick» vorgewählt, Jahr «Alle Jahre», 14 Rechnungen. Für 2023 müsste ich das Jahr selbst wählen.
8. **Bei 200 % Zoom** (`07-keller-200.png`): Text bricht sauber um, die drei Knöpfe stehen nebeneinander und sind gross genug, nichts läuft seitlich hinaus.

## Verwirrung

- **«die Reihenfolge spielt keine Rolle»:** Reihenfolge wovon? Der Jahre oder von Rechnungen und Abrechnung? (P-5)
- **«Jede Periode öffnet den Assistenten»:** Eine Periode ist für mich ein Zeitraum, kein Knopf. Gemeint ist wohl «Jeder Knopf mit einem Jahr öffnet …». (P-6)
- **«den Assistenten»:** Welcher Assistent, steht noch immer nicht da (z. B. «Abrechnungen erstellen»). Nach dem Klick war es aber klar.
- **«Mietstage», «Abrechnungsperiode»:** wie in Runde 1 erraten, nicht erklärt. Dass Jahr und Abrechnungsperiode dasselbe sind, sehe ich jetzt eher, weil die Knöpfe direkt unter «Abrechnungsperioden» stehen.

## Fehlerrisiken

- Wenn ich «die Reihenfolge spielt keine Rolle» auf Rechnungen und Abrechnung beziehe, erstelle ich vielleicht doch zuerst die Abrechnung ohne Rechnungen. Die Mieter bekämen dann ihr Akonto zurück (Runde 1: Vorschau 2021 mit CHF 0.00 Kosten). Die Vorschau im Assistenten warnt zwar noch.
- Der Knopf in der Warnung ist bequemer als der Rechnungen-Link ganz unten. Ich würde ihn zuerst klicken, also genau den zweiten Schritt zuerst machen.

## Vorschläge

- **P-5:** Vertrag Hans Müller öffnen, Warnung lesen, letzter Satz. Was helfen würde: den Bezug nennen, z. B. «Die Jahre können Sie in beliebiger Reihenfolge abrechnen.» als eigenen Satz, getrennt vom Satz über die Rechnungen.
- **P-6:** Vertrag Laura Keller öffnen, auf die Knöpfe «2025», «2023», «2022» schauen. Was helfen würde: ein Tätigkeitswort auf dem Knopf («2023 abrechnen») oder ein Satz direkt davor wie «Klicken Sie auf ein Jahr, um die Abrechnungen dafür zu erstellen.»
- **P-7:** Vertrag Laura Keller öffnen, Warnung lesen («zuerst die Rechnungen»), einen Weg zu den Rechnungen in der Warnung suchen: keiner. Was helfen würde: in der Warnung ein Link «Rechnungen 2023 ansehen» je Jahr oder einmal «Rechnungen des Gebäudes», mit dem Jahr vorgewählt.

## Nicht geprüft

- Die Einzahl-Fassung «Abrechnung … fehlt»: Beide Verträge zeigen drei fehlende Perioden.
- Ob die Warnung nach dem Erstellen kürzer wird: Ich sollte nichts speichern.
- Andere Sprachen, Handy, Bildschirmleser: nicht Teil meines Profils. (Im Bildschirmleser-Baum heissen die Knöpfe «Abrechnungen 2023 erstellen»; sichtbar steht nur «2023».)
