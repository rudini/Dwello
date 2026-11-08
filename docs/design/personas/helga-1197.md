# Helga – Slice 1197: Prüfung der vereinbarten Nebenkosten schlägt fehl (Schritt 3)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 % nachgeprüft), Maus. Persona-App auf http://localhost:3300 mit Demodaten. Ich habe nur geschaut, nichts gespeichert. Alle Anfragen an `/api/statements/agreements` habe ich vor dem Öffnen der Seite mit 500 beantworten lassen (mit 1,5 s Verzögerung, damit ich auch den Wartezustand sehe); für den letzten Versuch habe ich sie wieder durchgelassen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 3 von 5, nach «Weiter» | Ich klicke «Weiter» und im sichtbaren Teil der Seite passiert nichts: Die neue Meldung «Dwello konnte die Mietverträge nicht prüfen. Wählen Sie «Erneut versuchen». …» erscheint unter dem roten Kasten, weit unterhalb des Bildschirmrands. Die Seite scrollt nicht hin, und der Knopf «Weiter» behält den Fokus. Bei 150 % sehe ich unten am Rand gerade noch die rote Überschrift «Vereinbarte Nebenkosten nicht geprüft», die vorher schon dastand. Bei 200 % sehe ich vom roten Kasten gar nichts. Ich würde denken, der Knopf geht nicht, und noch einmal klicken. |

## Beobachtungen

- Nach dem gescheiterten «Erneut versuchen» ist klar, was ich tun soll: Im roten Kasten steht jetzt «Dwello hat es erneut versucht und konnte die Mietverträge wieder nicht prüfen. Ohne diese Prüfung geht es nicht weiter. Versuchen Sie es in einigen Minuten noch einmal.», darunter der Knopf «Erneut versuchen». Ich würde einen Kaffee trinken und es dann noch einmal versuchen. Der Schritt sagt mir eine einzige Sache, und zwar dieselbe an beiden Stellen: im Kasten und in der Zeile darunter.
- Während des Versuchs zeigen «Erneut versuchen» und «Weiter» beide «Bitte warten …» (ausgegraut). Darunter steht «Dwello geht weiter, sobald die Mietverträge geprüft sind.» Das ist beruhigend.
- Die Zeile «Gelingt die Prüfung, geht es weiter.» steht nach dem zweiten Fehlschlag allein unter dem roten Kasten. Sie gehört zum Kasten, sieht aber etwas verloren aus.
- Hat die Prüfung geklappt, bin ich ohne weiteren Klick auf «Weiter» direkt in «Schritt 4 von 5: Vorschau» gelandet. Die Seite steht oben bei der Überschrift, und als Heizprofil ist «Heizung + Warmwasser» übernommen, das vorausgewählt war. Das wurde mir ja angekündigt («Gelingt die Prüfung, geht es weiter»). Ich habe mir das Heizprofil aber gar nicht bewusst ausgesucht. Wer in Schritt 3 noch etwas ändern wollte, ist jetzt schon einen Schritt weiter. In der Vorschau steht das Heizprofil allerdings gut sichtbar.
- Schon beim Öffnen von Schritt 3 steht der rote Kasten unten, unter «Zurück»/«Weiter». Oben sehe ich nur Heizprofil und Verwaltungspauschale. Der Satz «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» über den Knöpfen hilft, wenn man ihn liest.
- Während der Prüfung steht «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …». Das ist verständlich.
- Fachwort: «vereinbaren» verstehe ich so, dass im Mietvertrag steht, welche Nebenkosten der Mieter zahlt. Das passt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 12 Schritte: Übersicht → «Abrechnungen erstellen» → Periode 2025 (vorgeschlagen) «Weiter» → Alpenblick wählen, «Weiter» → Schritt 3 «Weiter» → hinunterscrollen → «Erneut versuchen» (scheitert) → «Erneut versuchen» (gelingt) → Schritt 4.

## Ablauf

- Schritt 3, Klick auf «Weiter». Erwartet: Eine Meldung beim Knopf oder die Seite springt zum Fehler. Gesehen: Im sichtbaren Ausschnitt ändert sich nichts. Die neue Meldung steht unten unter dem roten Kasten, ausserhalb des Bildschirms (Bildschirmfotos `z1.5-c-step3-at-weiter.png` und `z1.5-d-after-weiter.png` sind gleich; `z2-d-after-weiter.png` zeigt den roten Kasten gar nicht).
- Zweites «Erneut versuchen» bei funktionierender Prüfung. Erwartet: Der rote Kasten verschwindet, dann klicke ich selbst «Weiter». Gesehen: Dwello geht direkt zu Schritt 4 Vorschau. Das war angekündigt, kam für mich aber trotzdem etwas überraschend.

## Vorschläge

- P-1: Reproduktion: Zoom 150 % (oder 200 %), `/api/statements/agreements` antwortet mit 500. Abrechnungen erstellen → 2025 → Alpenblick → Schritt 3, zum Knopf «Weiter» scrollen und klicken. Was helfen würde: Nach «Weiter» die Seite zum roten Kasten «Vereinbarte Nebenkosten nicht geprüft» scrollen und den Fokus auf ihn oder auf «Erneut versuchen» setzen. Oder die Meldung direkt beim Knopf «Weiter» anzeigen, damit ich sie dort sehe, wo ich geklickt habe.

## Nicht geprüft

- Speichern bzw. Erstellen der Abrechnungen (Schritt 5): Ich sollte nur schauen.
- Mobile Ansicht und Tastaturbedienung: nicht Teil meines Profils.
- Wie es aussieht, wenn die Prüfung beim ersten Öffnen von Schritt 3 gelingt: nicht Teil der Aufgabe.

Bildschirmfotos und Skripte: `/tmp/claude-0/-home-user-Dwello/9c5fd6ca-c820-54d3-917c-661582d3aa72/scratchpad/helga-1197/`.
