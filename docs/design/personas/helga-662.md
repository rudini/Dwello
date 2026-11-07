# Helga – Filter wirken sofort (#662)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack (:3300, Branch w-662), Demo-Daten. Nichts gespeichert (keine Aufgabe mit Speichern).
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-662/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Major | Rechnungen | Was ich ins Suchfeld getippt, aber nicht mit «Suchen» abgeschickt habe, wird beim Wählen eines Gebäudes still mitgenommen. Ich tippte «Heizung Alpenblick 2025», es passierte nichts; dann wählte ich das Gebäude Alpenblick: «Keine Rechnungen gefunden». Die Filter waren dabei ganz aus dem Bild gerutscht, der Hinweis sagt nur «Versuchen Sie es mit anderen Filtern.» Ich hätte geglaubt, es gebe keine Heizungsrechnungen. |
| H-2 | Minor | Rechnungen (auch Mietverträge) | Nach jeder Auswahl springt die Seite nach unten zur Überschrift der Liste. Gebäude und Kategorie sind dann unter der Kopfleiste verschwunden; für «Heizung» und danach «2025» musste ich jedes Mal wieder nach oben scrollen. |
| H-3 | Minor | Rechnungen | Nirgends steht, dass der Suchtext «Suchen» braucht, die Auswahlfelder aber nicht. Bei 150 % liegt «Suchen» unter dem Feld «Jahr», ausserhalb des Bildes, wenn ich im Suchfeld tippe. Ich tippte und wartete, und nichts geschah. |

## Beobachtungen

- Wohnungen: Nach der Wahl von «Musterhaus Zentrum» und dann «Leer» änderte sich die Liste sofort (13 → 6 → 2 Wohnungen: 2.02 und 3.02). Bei 150 % sehe ich von der Liste aber nur die eingerahmte Überschrift «6 Wohnungen» bzw. «2 Wohnungen» ganz unten am Bildrand; die Wohnungen selbst muss ich hinunterscrollen. Die Zahl hat mir gereicht, um zu merken, dass sich etwas getan hat.
- Wohnungen: Dort steht «Suchen» direkt unter dem Suchfeld. Da ist eher klar, dass der Knopf zum Suchfeld gehört, nicht zu den Auswahlfeldern.
- «Filter zurücksetzen» erscheint, sobald ein Filter gewählt ist, und verschwindet nach dem Klick wieder. Er setzt alles zurück, auch das Suchfeld (83 Rechnungen, Suchfeld leer). Danach blieb die Seite unten bei der Liste stehen, nicht oben bei den Filtern.
- «Filter zurücksetzen» sieht nicht überall gleich aus: Bei Wohnungen und Rechnungen ist es ein Knopf mit «×», bei Mieter, Mietverträge und Abrechnungen ein Link ohne Zeichen. Beides funktioniert.
- Mieter, Mietverträge, Abrechnungen: Die Liste ändert sich ebenfalls sofort, wenn ich etwas auswähle (z. B. «Aktive Mieter» → 9 Mieter, Gebäude Alpenblick → 2 Mietverträge, 2 Abrechnungen).
- Das Feld «Jahr» bedeutet «Jahr des Rechnungsdatums». Die Rechnung «Fernwärme Q4 2025» (Seepark Residenz) ist auf den 20.01.2026 datiert und erscheint darum unter 2025 nicht. Unter «Heizungsrechnungen vom letzten Jahr» hätte ich sie aber gesucht. Das ist nicht Teil der Änderung.
- Wenn ich den Suchtext lösche, ohne «Suchen» zu drücken, bleibt die Liste beim alten Suchtext (die Adresse enthält ihn noch). Das passt zur Regel, war aber für mich nicht sichtbar.

## Aufgabe geschafft: ja

- Leere Wohnungen in Musterhaus Zentrum: 2.02 und 3.02.
- Heizungsrechnungen 2025 von Alpenblick: 1 Rechnung (Heizöl Oberland AG, 25.08.2025, CHF 4'880.00).
- Filter zurückgesetzt: wieder alle 83 Rechnungen.

## Aufwand

Etwa 20 Minuten, rund 15 Schritte für die Aufgabe selbst (mit dreimal Hochscrollen auf der Seite Rechnungen); dazu Proben mit dem Suchfeld.

## Ablauf

- Rechnungen, Gebäude «Alpenblick» gewählt. Erwartet: Die Liste ändert sich, ich bleibe bei den Filtern. Gesehen: Die Seite sprang nach unten zu «14 Rechnungen»; Kategorie und Gebäude waren nicht mehr zu sehen. Ich musste hochscrollen, um «Heizung» zu wählen, und danach noch einmal für das Jahr.
- Rechnungen, im Suchfeld «Heizöl» getippt. Erwartet: Es passiert etwas, oder ein Hinweis sagt, was zu tun ist. Gesehen: nichts; die Liste zeigt weiter «1–20 von 83», «Suchen» ist ausserhalb des Bildes.
- Rechnungen, «Heizung Alpenblick 2025» getippt, nicht gesucht, dann Gebäude gewählt. Erwartet: Nur das Gebäude wirkt. Gesehen: «Keine Rechnungen gefunden», der Suchtext wirkte mit, die Filter waren aus dem Bild.
- Wohnungen, Gebäude und Mietstatus gewählt. Erwartet: Ich sehe die Wohnungen. Gesehen: nur die Überschrift mit der Anzahl am unteren Bildrand, die Wohnungen weiter unten.

## Vorschläge

- **H-1:** `/invoices` öffnen, ins Suchfeld «Heizung Alpenblick 2025» tippen, nicht «Suchen» drücken, Gebäude «Alpenblick» wählen → «Keine Rechnungen gefunden». Hilfreich wäre: Beim Wählen eines Gebäudes nur die Auswahl anwenden und einen nicht abgeschickten Text nicht mitnehmen, oder deutlich zeigen, welcher Suchtext gerade wirkt («Gesucht nach: …» über der Liste). Im Hinweis bei leerer Liste den Suchtext nennen («Keine Rechnungen für "Heizung Alpenblick 2025" in Alpenblick»).
- **H-2:** `/invoices` bei 150 % Zoom öffnen, Gebäude wählen → die Seite springt, die Felder Gebäude und Kategorie sind nicht mehr zu sehen. Hilfreich wäre: an der Stelle bleiben und nur die Liste neu zeigen (die Anzahl kann trotzdem angesagt werden), oder höchstens so weit scrollen, dass die Filter sichtbar bleiben.
- **H-3:** `/invoices` bei 150 % Zoom öffnen, ins Suchfeld tippen → nichts geschieht, «Suchen» ist nicht zu sehen. Hilfreich wäre: «Suchen» direkt neben oder unter das Suchfeld (wie bei Wohnungen) und ein kurzer Hilfetext beim Suchfeld, z. B. «Geben Sie einen Begriff ein und klicken Sie auf Suchen. Die Auswahlfelder wirken sofort.»

## Nicht geprüft

- 200 % Zoom: nicht versucht, die Aufgabe nannte 150 %.
- Mit echter Maus geöffnete Ausklapplisten: Ich habe die Einträge über die Auswahl des Browsers gewählt (gleiche Wirkung wie ein Klick); ob ein echter Mausklick den Rahmen um die Überschrift auch zeigt, habe ich nicht gesehen (nach «Filter zurücksetzen», per Mausklick, war kein Rahmen da).
- Speichern: nicht Teil der Aufgabe, kein Gebäude zugeteilt.
