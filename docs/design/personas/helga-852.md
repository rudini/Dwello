# Helga – Slice 852: Dokument löschen, das schon weg ist

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (die Meldung zusätzlich bei 200 %), Maus.
App: Persona-Stack auf :3300 (Fusszeile «Version unbekannt»; der Build in `/tmp/persona-app` ist von 22:04, nach dem letzten Commit des Branches um 22:03).
Gespeichert habe ich nur beim Mieter «Hans Müller»: drei Mal die «Ausweiskopie» hochgeladen und jedes Mal wieder gelöscht. Am Schluss hat Hans Müller wieder «Noch keine Dokumente».

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mieter «Hans Müller», Dialog «Dokument löschen?» im zweiten Tab | Das Dokument war im ersten Tab schon gelöscht. Im zweiten Tab sagt Dwello aber «Das hat nicht geklappt. Das Dokument wurde nicht gelöscht. Versuchen Sie es erneut.» Das stimmt nicht: Das Dokument ist weg. Ich habe getan, was dort steht, und es nochmals versucht. Ich bekam genau dieselbe Meldung, das Dokument stand weiter in der Liste. Eine Meldung, die sagt, dass das Dokument schon gelöscht ist, habe ich nie gesehen. Die geänderte Meldung kommt also bei mir gar nicht an. |

## Beobachtungen

- Ich hatte den Bestätigungsdialog «Dokument löschen?» erwartet. Er nennt das Dokument mit Namen und sagt, dass sich das Löschen nicht rückgängig machen lässt. Gut verständlich.
- Mit der Fehlermeldung bleibt der Dialog offen, und dahinter steht die «Ausweiskopie» weiter in der Liste mit «Datei herunterladen» und «Löschen». Für mich sieht das aus, als sei die Ausweiskopie noch gespeichert. Gerade bei einer Ausweiskopie, die man laut Hilfetext löschen soll, macht mir das Sorgen.
- Erst nach «Abbrechen» und dem Neuladen der Seite stand «Noch keine Dokumente.» da. Auf das Neuladen wäre ich ohne den Auftrag nicht gekommen, die Meldung sagt nichts davon.
- Auf der Seite «Dokumente» im Menü kann man Dokumente nur herunterladen, nicht löschen. Löschen geht nur beim Mieter.
- Im zweiten Tab zeigt der Link «Datei herunterladen» auf die schon gelöschte Ausweiskopie. Klickt man ihn an, startet Chromium einen Download statt eine Seite zu zeigen. Die Antwort ist 404, als Anhang, mit dem Inhalt `{"error":"Document not found"}`. Man bekäme also eine Datei mit englischem Fachtext statt einer Meldung.
- Nach dem Hochladen erscheint unten «Dokument «Ausweiskopie» hochgeladen». Löscht man danach im selben Tab, bleibt diese Meldung stehen, und «Dokument «Ausweiskopie» gelöscht» kommt darunter. Zwei Meldungen übereinander, die sich zu widersprechen scheinen.
- Beim Hochladen gibt es nur «Titel (optional)», keine Auswahl der Art des Dokuments. «Ausweiskopie» habe ich als Titel eingetippt.
- Hans Müller wohnt in «Wohnung 1.01 – Musterhaus Zentrum», nicht in der Seepark Residenz, wie es der Auftrag vermuten liess. Das hat beim Auftrag nicht gestört.
- Bei 150 % und bei 200 % sind Dialog und Meldung gut lesbar. Die Fehlermeldung ist rot umrandet, mit Ausrufezeichen und Überschrift, also nicht nur an der Farbe zu erkennen.

## Aufgabe geschafft: teilweise

Hochladen, Neuladen und das Löschen im ersten Tab gingen ohne Mühe. Im zweiten Tab hat die Meldung mich in die Irre geführt: Sie sagte, das Dokument sei nicht gelöscht, und schickte mich in eine Wiederholung, die nichts bringt. Dass das Dokument wirklich weg ist, habe ich erst nach dem Neuladen gesehen.

## Aufwand

Der eigentliche Durchgang dauerte etwa 11 Sekunden Skriptzeit und 16 Schritte: 2 Tabs öffnen, Datei wählen, Titel, hochladen, zweiten Tab neu laden, 2 × Löschen im ersten Tab, 2 × Löschen im zweiten Tab, erneuter Versuch, Abbrechen, Neuladen, Menü, «Dokumente». Dazu kamen etwa 10 Minuten zum Zurechtfinden, nämlich die Dateiauswahl und der Weg zum Mieter.

## Ablauf

1. Datei auswählen: Ich erwartete, dass ein Klick auf «Datei auswählen» die Dateiauswahl öffnet. Ein Klick auf das Element, das als Schaltfläche «Datei Datei auswählen» angesagt wird, öffnete im ersten Versuch keine Dateiauswahl (Zeitüberschreitung im Skript). Ein Klick auf den sichtbaren Text «Datei auswählen» öffnete sie. Das kann am Skript liegen, nicht an Dwello.
2. Löschen im zweiten Tab: Ich erwartete einen Hinweis wie «Dieses Dokument ist schon gelöscht». Ich bekam «Das hat nicht geklappt. Das Dokument wurde nicht gelöscht. Versuchen Sie es erneut.». Der Dialog blieb offen, und das Dokument stand weiter in der Liste (Screenshot 23-B-meldung.png). Im Netzwerk war die Antwort auf `?/deleteDocument` ein `failure` mit Status 404 und genau diesem Text.
3. Erneuter Versuch, wie die Meldung sagt: Ich erwartete, dass es jetzt klappt oder dass Dwello erklärt, was los ist. Ich bekam dieselbe Meldung noch einmal (24-B-erneut.png).
4. Abbrechen: Ich erwartete, dass die Liste nun stimmt. Die «Ausweiskopie» stand weiter da (25-B-abgebrochen.png). Erst nach dem Neuladen hiess es «Noch keine Dokumente.» (26-B-reload.png). Auch auf der Seite «Dokumente» war sie nicht mehr aufgeführt.

## Vorschläge

**P-1**
Nachstellen:
1. Mieter «Hans Müller» in zwei Tabs öffnen.
2. Im ersten Tab ein PDF mit dem Titel «Ausweiskopie» hochladen.
3. Den zweiten Tab neu laden.
4. Im ersten Tab «Löschen: Ausweiskopie» und dann «Dokument löschen» wählen.
5. Im zweiten Tab, ohne neu zu laden, «Löschen: Ausweiskopie» und dann «Dokument löschen» wählen.

Ergebnis: Die Meldung «Das Dokument wurde nicht gelöscht. Versuchen Sie es erneut.» erscheint, auch beim zweiten Versuch, auf eine 404-Antwort des Servers.

Was helfen würde:
- Sagen, was wirklich ist, etwa: «Dieses Dokument ist schon gelöscht, vielleicht in einem anderen Fenster. Sie müssen nichts mehr tun.»
- Danach den Dialog schliessen und die Dokumentliste neu zeigen, damit die gelöschte Ausweiskopie nicht mehr dasteht.
- Für das Team: Bitte prüfen, ob der Persona-Build die Änderung von Slice 852 überhaupt enthält. Der Build ist zeitlich nach dem letzten Commit entstanden, die alte Meldung kommt aber trotzdem.

## Nicht geprüft

- Welche Fassung der App läuft, kann ich nicht sicher sagen: In der Fusszeile steht «Version unbekannt». Ich habe nur die Zeit des Builds (22:04) mit dem letzten Commit (22:03, «fix(api): never show the backend's own text») verglichen.
- Andere Stellen, an denen ein schon gelöschtes Dokument gelöscht werden könnte: Auf der Seite «Dokumente» gibt es keinen Löschknopf. Weitere Stellen habe ich nicht gesucht.
- Fehler wegen eines Serverausfalls (500) habe ich nicht nachgestellt, weil der Auftrag nur das schon gelöschte Dokument nannte.
