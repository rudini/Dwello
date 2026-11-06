# Helga – Wohnungsprüfung nach «Erneut versuchen» (#1153)

Desktop 1440 × 900 bei 150 % Zoom, Maus. Gespielter Fehler: alle Anfragen an `/api/contracts` antworteten mit 500, bis ich die Wohnung 1.01 gewählt hatte; danach liefen sie wieder durch und ich klickte «Erneut versuchen». Nichts gespeichert, den Vertrag von Hans Müller nicht verändert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, Schritt 2 «Wohnung», Fehlerzustand | Die gelbe Warnung «Dwello prüft beim Speichern, ob die Wohnung frei ist» spricht nur von den «anderen Mietverträgen dieser Wohnung». Dass auch Laura Kellers eigener laufender Vertrag (Wohnung EG, Alpenblick) nicht geprüft werden konnte, steht nirgends. Der blaue Hinweis dazu erschien erst nach «Erneut versuchen». Hätte ich nicht nochmals versucht, wäre ich weitergegangen, ohne davon zu wissen. |
| P-2 | Minor | Schritt 2 «Wohnung», nach «Erneut versuchen» | Die Meldung rechts unten ist bei 150 % zwölf Zeilen lang und verschwindet nach etwa 8 Sekunden von selbst. In dieser Zeit konnte ich sie nicht fertig lesen. Sie deckt dabei die Wohnungsauswahl und die gelbe Box «Wohnung 1.01 … ist nicht verfügbar» halb zu. Weil im Schritt dasselbe stehen bleibt, ging nichts verloren. Ich war aber kurz unsicher, ob ich etwas verpasst habe. |

## Beobachtungen

- Den Knopf «Neuer Mietvertrag» gibt es so nicht. Auf «Mietverträge» und in der Übersicht heisst er «Mietvertrag erfassen», und erst die Seite danach heisst «Neuer Mietvertrag». Gefunden habe ich ihn trotzdem.
- Während des Fehlers stand in der Auswahlliste bei jeder Wohnung «(nicht geprüft)». Zusammen mit der gelben Box und «Ihre Eingaben bleiben erhalten» hat mich das beruhigt. Ich wusste, dass nichts verloren ist und dass ich nochmals versuchen kann.
- Nach «Erneut versuchen» war meine Auswahl 1.01 wieder weg («Wohnung wählen»). Darunter steht klar, warum: «Wohnung 1.01 · Musterhaus Zentrum ist nicht verfügbar … Dwello hat die Auswahl darum aufgehoben». Dazu gibt es den Link «Zum Mietvertrag von Hans Müller». In der Liste steht 1.01 jetzt als «(nicht verfügbar)» und lässt sich nicht mehr wählen. Genau so habe ich es verstanden.
- Die Meldung sagt «Ist dieser Mietvertrag gekündigt, tragen Sie das Vertragsende zuerst … ein». Die Box im Schritt sagt «gekündigt oder ein Vertragsende vereinbart». Das ist fast gleich, aber nicht ganz. Zudem beginnt die Meldung mit «Die Mietverträge der Wohnung sind geladen», und das Wort «geladen» sagt mir wenig.
- Im Schritt stehen nach dem Neuladen zwei Kästen übereinander: blau für Laura Kellers Vertrag (EG) und gelb für die Wohnung 1.01 (Hans Müller). Beide schicken mich zu «Enddatum erfassen», aber bei verschiedenen Verträgen. Ich musste zweimal lesen, welcher Kasten meine Wohnung betrifft.
- Nach «Meldung schliessen» (das X) ist die Meldung weg, und der Schritt zeigt weiter beide Kästen. Der Tastaturfokus lag danach auf dem Seitenanfang (body). Mit der Maus hat mich das nicht gestört.
- Der Link «Zum Mietvertrag von Hans Müller» führt auf «Mietvertrag von Hans Müller, Wohnung 1.01 · Musterhaus Zentrum». Oben steht «Enddatum erfassen», genau der Knopf, den der Text nennt. Dort steht «Vertragsende: Unbefristet». Ich würde jetzt Herrn Müller fragen, ob er gekündigt hat, und erst dann das Enddatum eintragen.
- Mit «Zurück» im Browser kam ich in den Assistenten zurück, und zwar mit «Angaben wiederhergestellt». Er stand aber wieder bei Schritt 1 «Mieter», nicht bei «Wohnung», wo ich war.
- Die ganze Seite als Bild: Die Kopfleiste mit «Dwello» liegt mitten über dem Inhalt (nur auf dem Ganzseiten-Bild, im normalen Fenster nicht).

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, rund 10 Schritte: Mietverträge, «Mietvertrag erfassen», Mieter wählen, Weiter, Wohnung wählen, «Erneut versuchen», Meldung lesen und schliessen, «Zum Mietvertrag von Hans Müller», zurück.

## Ablauf

- Mietverträge geöffnet. Erwartet: ein Knopf «Neuer Mietvertrag». Gesehen: «Mietvertrag erfassen».
- Laura Keller gewählt, Schritt «Wohnung» (Fehler aktiv). Erwartet: ein Hinweis, falls etwas nicht geladen werden konnte. Gesehen: noch keine Meldung, nur «(nicht geprüft)» hinter jeder Wohnung in der Liste. Die gelbe Box erschien erst, als ich 1.01 gewählt hatte.
- «Erneut versuchen» geklickt. Erwartet: Bestätigung, dass jetzt alles geprüft ist, und meine Wohnung bleibt gewählt, falls sie frei ist. Gesehen: Die Auswahl war aufgehoben, und neu erschien zusätzlich der blaue Kasten zu Laura Kellers eigenem Vertrag (siehe P-1). Unten rechts kam eine lange Meldung, die nach rund 8 Sekunden von selbst verschwand (P-2).
- Zurück aus dem Vertrag von Hans Müller. Erwartet: wieder Schritt 2. Gesehen: Schritt 1 mit «Angaben wiederhergestellt».

## Vorschläge

- **P-1:** Mietverträge, «Mietvertrag erfassen», Laura Keller wählen, Weiter; `/api/contracts` schlägt fehl; Wohnung 1.01 Musterhaus Zentrum wählen. Die gelbe Box spricht nur von der Wohnung. Hilfreich wäre ein Satz wie «Auch die Mietverträge von Laura Keller liessen sich nicht prüfen», oder den Hinweis zum Mieter schon im Fehlerzustand als «nicht geprüft» zeigen.
- **P-2:** Wie oben, dann `/api/contracts` wieder durchlassen und «Erneut versuchen» klicken. Die Meldung erscheint und verschwindet nach etwa 8 s. Hilfreich wäre: Die Meldung kurz halten (z. B. «Die Mietverträge sind geprüft. Die Wohnung 1.01 ist nicht verfügbar, Einzelheiten stehen im Schritt.») oder sie stehen lassen, bis ich sie schliesse. Und sie nicht über die Box legen, die dasselbe erklärt.

## Nicht geprüft

- 200 % Zoom: nicht versucht, nur 150 %.
- «Enddatum erfassen» auf dem Vertrag von Hans Müller: nicht geklickt, weil ich nichts ändern durfte. Ob der Dialog die Folgen erklärt, weiss ich darum nicht.
- Den Weg über den blauen Kasten «Zum Mietvertrag für die Wohnung EG» (Laura Kellers eigener Vertrag) bin ich nicht gegangen. Die Aufgabe nannte den Vertrag, der die Wohnung sperrt.
- Ein zweites Fehlschlagen von «Erneut versuchen» (der Fehler bleibt bestehen): nicht nachgestellt, der Auftrag liess die Anfragen danach durch.
