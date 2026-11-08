# Helga – Zusammenlegung 3.01/3.02 (Runde 1301)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus (und Tastatur zum Tippen der Daten). Gebäude: «Musterhaus Zentrum». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/1ad65ad5-87c1-5abb-b07a-cdb69a083791/scratchpad/helga-1301/`.

Aufgabe: Wohnung 3.02 gibt es seit 01.07.2025 nicht mehr, 3.01 hat seither 175 m² und 7.5 Zimmer (vorher 120 m², 5.5 Zimmer). Zuerst absichtlich den 01.08.2025 bei 3.01 erfassen, dann auf den 01.07.2025 korrigieren und auf der Seite von 3.01 prüfen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Wohnung bearbeiten (3.01) | Bei «Zimmeranzahl» kann ich höchstens «6.5 Zimmer» wählen. 7.5 Zimmer lassen sich nicht erfassen, Tippen von «7.5» in der Liste ändert nichts. Ich musste 5.5 Zimmer stehen lassen; die neue Zimmeranzahl der zusammengelegten Wohnung ist damit falsch gespeichert. |
| P-2 | Minor | Wohnung bearbeiten (3.01), nach erfasster Änderung | Will ich den Tag korrigieren und tippe im Feld «Neue Fläche und Zimmeranzahl gelten ab» den 01.07.2025, kommt oben «Nicht gespeichert – Fläche und Zimmeranzahl sind unverändert. Ändern Sie die Fläche oder die Zimmeranzahl, oder lassen Sie das Feld leer.» Ich wollte ja nur den Tag ändern. Die Meldung sagt nicht, dass schon eine Änderung ab 01.08.2025 besteht und wie ich deren Tag verschiebe (auf der Wohnungsseite «Änderung ab … entfernen» und neu erfassen). |
| P-3 | Minor | Wohnung bearbeiten (3.01) | Das Bearbeiten-Formular zeigt nirgends, dass schon eine Änderung ab 01.08.2025 erfasst ist: Das Datumsfeld ist leer, die Fläche steht auf 175. Ich wusste nicht, ob ein neuer Tag den alten ersetzt oder eine zweite Änderung anlegt. Der Hilfetext («… und wenn schon ein Tag erfasst ist, ab diesem Tag») hilft da nicht, weil er den erfassten Tag nicht nennt. |
| P-4 | Minor | Gebäude «Musterhaus Zentrum», Übersicht, Wohnung 3.02 | 3.02 ist seit 01.07.2025 aufgehoben (heute ist November 2026), trotzdem zeigt das Gebäude «6 Wohnungen, davon 4 vermietet und 2 leer» und 3.02 als «Leer», die Übersicht «4/6 vermietet, Wohnung 2.02 leer, Wohnung 3.02 leer» mit dem Satz «Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.». Auf der Seite von 3.02 steht neben «Aufgehoben ab 01.07.2025» weiter «Leer – Es läuft kein Mietvertrag, die Wohnung kann vermietet werden.» und der Knopf «Mietvertrag erfassen». Da frage ich mich, ob das Speichern gewirkt hat und ob ich für 3.02 noch Nebenkosten trage. |
| P-5 | Minor | Wohnung 3.01 (Ansicht) | Die neuen Werte «Fläche 175 m²» stehen ohne «seit 01.07.2025». Der Tag erscheint nur indirekt («bis 30.06.2025: 120 m², 5.5 Zimmer») und im roten Knopf «Änderung ab 01.07.2025 entfernen». |

## Beobachtungen

- Der Löschen-Dialog von 3.02 ist sehr gut: Er sagt ausdrücklich, dass ich eine umgebaute Wohnung nicht löschen, sondern unter «Bearbeiten» im Feld «Aufgehoben ab» den Tag erfassen soll, und was beim Löschen mit den Nebenkosten der anderen Mieter passiert. Ohne diesen Dialog hätte ich 3.02 wohl gelöscht. Ich habe «Abbrechen» gewählt.
- Die Hilfetexte bei «Neue Fläche und Zimmeranzahl gelten ab» und «Aufgehoben ab» sind sachlich hilfreich (vor allem «Wird eine andere Wohnung dadurch grösser, erfassen Sie bei ihr … ab demselben Tag»), aber sehr lang: Bei 150 % ist der erste Text elf Zeilen, ich musste ihn zweimal lesen. «Berichtigte Abrechnung» und «neu berechnen» kenne ich nicht.
- Unter dem Datumsfeld steht nach dem Tippen «Dienstag, 1. Juli 2025»: Das gibt Sicherheit.
- Der Bestätigungsdialog «Änderung ab 01.08.2025 entfernen?» sagt «Ab dem 01.08.2025 gelten dann wieder 120 m² und 5.5 Zimmer». Dass ich danach die 175 m² noch einmal eintippen muss, sagt er nicht; ich habe es erst im Formular (wieder 120.00) gemerkt.
- Nach dem Speichern erscheint «Wohnung 3.01 gespeichert» oben rechts, bei 150 % überdeckt die Meldung teilweise die Angaben der Wohnung.
- Die Rubrik heisst «Frühere Fläche und Zimmeranzahl», das habe ich verstanden.
- Das Feld «Fläche (m²)» zeigt «175.00» mit zwei Nachkommastellen, auf der Ansicht «175 m²»; kein Problem.

## Aufgabe geschafft: teilweise

3.02 ist ab 01.07.2025 aufgehoben, 3.01 hat ab 01.07.2025 175 m² (bis 30.06.2025 120 m²). Die 7.5 Zimmer konnte ich nicht erfassen (P-1), 3.01 steht weiter auf 5.5 Zimmer.

## Aufwand

Etwa 20 Minuten, 12 Durchgänge (Skripte), rund 25 Schritte; die Korrektur des Tages brauchte zwei Versuche.

## Ablauf

- Wohnung 3.01 bearbeiten, Zimmeranzahl 7.5 wählen. Erwartet: 7.5 in der Liste. Gesehen: Liste endet bei 6.5 Zimmer; ich liess 5.5 stehen und speicherte 175 m² ab 01.08.2025.
- Tag korrigieren: «Bearbeiten» bei 3.01. Erwartet: Das Feld «gelten ab» zeigt 01.08.2025, ich überschreibe es. Gesehen: Feld leer, kein Hinweis auf die bestehende Änderung. Ich tippte 01.07.2025 und speicherte. Erwartet: gespeichert. Gesehen: «Nicht gespeichert – Fläche und Zimmeranzahl sind unverändert …».
- Zweiter Versuch über die Wohnungsseite: «Änderung ab 01.08.2025 entfernen» bestätigt. Erwartet: Die Werte bleiben, nur der Tag ist weg. Gesehen: Wohnung wieder 120 m², im Formular 120.00; ich tippte 175 und 01.07.2025 neu ein. Danach stimmt die Seite: «175 m²», «bis 30.06.2025: 120 m², 5.5 Zimmer».
- Gebäude und Übersicht nachher. Erwartet: 5 Wohnungen, 3.02 nicht mehr als leer. Gesehen: weiterhin 6 Wohnungen, «Wohnung 3.02 leer».

## Vorschläge

- **P-1:** Wohnung 3.01 → «Bearbeiten» → Liste «Zimmeranzahl» öffnen: endet bei 6.5. Die Liste bis mindestens 10 Zimmer verlängern oder eine Eingabe erlauben, damit grosse oder zusammengelegte Wohnungen erfasst werden können.
- **P-2:** Bei 3.01 eine Änderung ab 01.08.2025 erfassen, dann «Bearbeiten», nur den Tag 01.07.2025 eintippen, speichern. Die Meldung sollte den bestehenden Tag nennen und den Weg zeigen, z. B. «Ab 01.08.2025 gelten schon 175 m² und 5.5 Zimmer. Um den Tag zu ändern, entfernen Sie diese Änderung auf der Seite der Wohnung und erfassen Sie sie neu.» Besser noch: den Tag einer bestehenden Änderung direkt verschieben lassen.
- **P-3:** Wie P-2, Formular ansehen. Im Formular über oder unter dem Datumsfeld anzeigen: «Erfasst: ab 01.08.2025 175 m², 5.5 Zimmer (bis 31.07.2025: 120 m², 5.5 Zimmer)».
- **P-4:** Bei 3.02 «Aufgehoben ab» 01.07.2025 speichern, dann Gebäude «Musterhaus Zentrum» und Übersicht öffnen. Aufgehobene Wohnungen nicht mehr als «Leer» zählen und zeigen, sondern z. B. als «Aufgehoben seit 01.07.2025»; auf ihrer Seite «Mietvertrag erfassen» und «die Wohnung kann vermietet werden» weglassen.
- **P-5:** Wohnung 3.01 nach der Änderung öffnen. Bei Fläche und Zimmeranzahl «seit 01.07.2025» dazuschreiben.

## Nicht geprüft

- 200 % Zoom: nicht versucht, nur 150 %.
- Ob die Nebenkostenabrechnungen 2025 die Werte vor und nach dem 01.07.2025 richtig verteilen: Ich habe keine Abrechnung erstellt (das gehört nicht zu meiner Aufgabe und würde Daten des Gebäudes für andere Prüfungen verändern).
- Was passiert, wenn bei 3.01 ein neuer Tag mit geänderten Werten eingegeben wird, während schon eine Änderung besteht (zweite Änderung?): nicht versucht, um die Daten nicht zu verwirren.
