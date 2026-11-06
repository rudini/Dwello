# Helga – Runde 669: Vertragsbeginn ändern, während die anderen Mietverträge der Wohnung nicht laden

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift. Desktop 1440 × 900 bei 150 % Zoom (Seite 960 × 600) und zum Vergleich bei normaler Grösse (100 %), Maus. Nur angeschaut, nichts gespeichert.
Fehler simuliert: `GET /api/contracts?apartmentId=…` antwortet mit 500, bis ich «Erneut versuchen» drücke; dann antwortet es normal (einmal auch absichtlich ein zweites Mal mit 500).
Verträge: Nina Brunner (Wohnung A2, Seepark Residenz, seit 01.07.2025); früherer Vertrag derselben Wohnung: Sarah Meier (01.08.2021 – 30.06.2025). Im Assistenten: Mieterin Sarah Meier, Wohnung A2.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Major | Neuer Mietvertrag, Schritt 5 «Prüfen» | Nach «Erneut versuchen» steht die Überschneidung nur in einer Meldung unten rechts, die nach etwa 7 Sekunden verschwindet. Danach zeigt «Prüfen» nichts mehr davon, «Mietvertrag speichern» sieht aus wie immer. Die Meldung deckt dazu den «Ändern»-Knopf beim Vertragsbeginn zu (bei 150 % auch die bei Wohnung und Mieter). Sie nennt den anderen Mietvertrag nicht und spricht nur von «Vertragsbeginn oder Vertragsende im Schritt 3», obwohl Schritt 3 selbst sagt: «Sonst wählen Sie eine andere Wohnung.» |
| H-2 | Minor | Mietvertrag bearbeiten, Neuer Mietvertrag Schritt 3 | Die Meldung «… überschneidet sich mit einem davon. Welcher es ist, steht im Hinweis «Zeitraum überschneidet sich».» hat ein grünes Häkchen wie bei einer guten Nachricht. Sie liegt genau über dem, was sie meint: bei 150 % in Schritt 3 über dem Feld Vertragsbeginn, bei 100 % über dem Kasten «Zeitraum überschneidet sich», beim Bearbeiten über dem Hinweis «Vertragsbeginn prüfen». Den genannten Kasten sehe ich zuerst nicht: Er steht unter «Vertragsdauer» (Unbefristet/Befristet), bei 150 % unter dem Bildrand, bei 100 % ganz am unteren Rand. Die Meldung sagt nicht, dass ich nach unten scrollen muss. |
| H-3 | Minor | Neuer Mietvertrag, Schritt 2 «Wohnung» | Nach «Erneut versuchen» sagt die grüne Meldung nur «Die Mietverträge der Wohnung sind geladen.» Meine gewählte Wohnung A2 heisst jetzt in der Liste «(nicht verfügbar)», bleibt aber gewählt, und «Weiter» geht trotzdem. Dass meine Wahl nicht geht, merke ich erst in Schritt 3, nachdem ich ein Datum eingetippt habe. |
| H-4 | Minor | Mietvertrag bearbeiten (oben), Schritt 2, 3 und 5 | Der Kasten beim Fehler hat den Titel «Dwello prüft beim Speichern, ob die Wohnung frei ist». Der klingt beruhigend und nicht nach einem Problem. Der Text sagt, was schiefging, aber nicht, was ich tun soll: Ich soll «Erneut versuchen» drücken oder darf trotzdem weitermachen. Den Knopf darunter habe ich zwar gesehen, aber ich wusste nicht, ob ich ihn brauche. |
| H-5 | Minor | Neuer Mietvertrag, Schritt 2 | Solange die Verträge nicht geladen sind, steht bei jeder Wohnung «(nicht geprüft)». Der Hilfetext darüber spricht aber nur von «nicht verfügbar» und erklärt «nicht geprüft» nicht. Ich wusste nicht, ob ich eine solche Wohnung wählen darf. |

## Beobachtungen

- N-1: Beim Bearbeiten steht beim Vertragsbeginn, solange die Verträge fehlen: «Dwello prüft beim Speichern, ob die Wohnung frei ist – «Erneut versuchen» steht oben auf der Seite.» Das ist klar, ich wusste, wo ich hin muss. Den Knopf musste ich dann selber suchen, weil er weit oben ist (bei 150 % etwa zwei Bildschirmhöhen weiter oben).
- N-2: Der Kasten «Zeitraum überschneidet sich» beim Bearbeiten ist sehr gut: Er nennt Sarah Meier mit ihren Daten, sagt, dass der Vertragsbeginn nach dem 30.06.2025 liegen muss, und hat einen Link zu ihrem Mietvertrag. Im Assistenten nennt er Nina Brunner und sagt, was zu tun ist.
- N-3: Ohne Überschneidung sagt die Meldung nach «Erneut versuchen»: «Die anderen Mietverträge dieser Wohnung sind geladen. Der Zeitraum überschneidet sich mit keinem davon.» Das ist klar und beruhigend. Sie liegt bei 150 % über dem rechten Teil der Auswahl Unbefristet/Befristet, nicht über dem Feld.
- N-4: Schlägt auch der zweite Versuch fehl, kommt eine rote Meldung: «… konnten wieder nicht geladen werden. Versuchen Sie es später erneut; Ihre Eingaben bleiben erhalten.» Das ist gut verständlich.
- N-5: Nach «Erneut versuchen» springt die Seite beim Bearbeiten zum Feld Vertragsbeginn und im Assistenten zur Schrittüberschrift. Den Sprung beim Bearbeiten fand ich hilfreich, er hat mich aber überrascht.
- N-6: Nach «Erneut versuchen» erscheint beim Bearbeiten zusätzlich «Vertragsbeginn prüfen: … liegt in der Vergangenheit. Stimmt das Datum?» Vorher stand dort der Fehler-Kasten. Zwei gelbe Kästen untereinander mit verschiedenen Aussagen: Ich musste beide lesen, um zu verstehen, welcher wichtiger ist.
- N-7: Ganz oben beim Bearbeiten steht ein langer gelber Kasten «Laufender Mietvertrag» mit Mietzinserhöhung und amtlichem Formular, danach vier Absätze zu Mieterwechsel, Tod und Scheidung. Bis zum Feld Vertragsbeginn muss ich bei 150 % weit scrollen.
- N-8: In der Liste der Wohnung A2 sehe ich die anderen Verträge gut («Frühere Mietverträge»: Sarah Meier 01.08.2021 – 30.06.2025). So wusste ich vorher, welches Datum sich überschneidet.

## Aufgabe geschafft: teilweise

Den Vertragsbeginn konnte ich ändern und habe die Überschneidung beim Bearbeiten und in Schritt 3 gefunden. In «Prüfen» war der Hinweis weg, bevor ich ihn fertig gelesen hatte, und auf der Seite stand danach nichts mehr davon.

## Aufwand

Etwa 30 Minuten, rund 60 Schritte (Bearbeiten bei 150 % und 100 %, Assistent bis «Prüfen» bei 150 % und 100 %).

## Ablauf

- Bearbeiten, erster Bildschirm: Ich erwartete eine Fehlermeldung, die sagt, was ich tun soll. Ich sah den Titel «Dwello prüft beim Speichern, ob die Wohnung frei ist», einen Satz zum Fehler und darunter den Knopf. Was ich tun soll, stand nirgends (H-4).
- Bearbeiten, Vertragsbeginn 01.06.2025, «Erneut versuchen»: Ich erwartete die Überschneidung beim Feld. Ich sah eine grüne Meldung mit Häkchen unten rechts, die über dem Hinweis «Vertragsbeginn prüfen» lag. Den Kasten «Zeitraum überschneidet sich» fand ich erst nach Scrollen unter der Auswahl Unbefristet/Befristet. Bei 100 % war nur sein oberster Rand im Bild (H-2).
- Schritt 2, «Erneut versuchen»: Ich erwartete eine Antwort, ob Wohnung A2 frei ist. Ich sah «Die Mietverträge der Wohnung sind geladen.», und A2 stand nun als «(nicht verfügbar)» in der Auswahl. «Weiter» ging trotzdem (H-3).
- Schritt 3 mit 01.12.2026, «Erneut versuchen»: Ich erwartete die Meldung neben dem Feld. Bei 150 % lag die Meldung über dem Feld Vertragsbeginn und dem Kalenderknopf, der Kasten mit Nina Brunner war unter dem Bildrand (H-2).
- «Prüfen», «Erneut versuchen»: Ich erwartete einen Kasten in der Zusammenfassung, wie in Schritt 3. Ich sah nur die Meldung unten rechts über den «Ändern»-Knöpfen. Nach etwa 7 Sekunden war sie weg, und die Seite sah aus, als wäre alles in Ordnung (H-1).

## Vorschläge

- **H-1** – Nachstellen: Neuer Mietvertrag, Request `GET /api/contracts?apartmentId=…` mit 500. Sarah Meier, Wohnung A2, «Weiter». Vertragsbeginn 01.12.2026, unbefristet. Nettomiete 1500, Verwaltungspauschale «Nein», bis «Prüfen». Request freigeben, «Erneut versuchen», 10 Sekunden warten. Was helfen würde: In «Prüfen» bleibt ein Kasten wie in Schritt 3 auf der Seite stehen. Er nennt den anderen Mietvertrag (Nina Brunner, seit 01.07.2025) und bietet beide Wege: «Vertragsbeginn ändern» oder «Wohnung ändern». Die kurze Meldung sollte bei einer schlechten Nachricht nicht von selbst verschwinden.
- **H-2** – Nachstellen: Mietvertrag von Nina Brunner, «Bearbeiten» mit dem fehlschlagenden Request. Vertragsbeginn 01.06.2025, Request freigeben, «Erneut versuchen». Oder im Assistenten in Schritt 3 wie bei H-1. Was helfen würde: Bei einer Überschneidung ein Warnzeichen statt des grünen Häkchens. Den Kasten «Zeitraum überschneidet sich» direkt unter das Feld Vertragsbeginn setzen oder in der Meldung sagen «weiter unten, unter Vertragsdauer». Die Meldung so platzieren, dass sie Feld und Kasten nicht verdeckt.
- **H-3** – Nachstellen: Neuer Mietvertrag mit fehlschlagendem Request, Sarah Meier, Wohnung A2, Request freigeben, «Erneut versuchen» in Schritt 2. Was helfen würde: Ist die gewählte Wohnung danach nicht verfügbar, sagt die Meldung das («Wohnung A2 ist vermietet. Wählen Sie eine andere Wohnung.»), und die Auswahl wird zurückgesetzt oder als Fehler markiert.
- **H-4** – Nachstellen: Mietvertrag bearbeiten mit fehlschlagendem Request, ersten Bildschirm anschauen. Was helfen würde: Ein Titel, der das Problem nennt (zum Beispiel «Andere Mietverträge nicht geladen»), und ein Satz, was zu tun ist: «Drücken Sie «Erneut versuchen». Sie können auch weiterarbeiten; Dwello prüft beim Speichern, ob die Wohnung frei ist.»
- **H-5** – Nachstellen: Neuer Mietvertrag mit fehlschlagendem Request, Schritt 2, Auswahl «Wohnung» öffnen. Was helfen würde: Im Hilfetext über der Auswahl ein Satz zu «nicht geprüft», etwa «Konnte Dwello nicht prüfen, ob die Wohnung frei ist, steht «nicht geprüft». Sie können sie trotzdem wählen.»

## Nicht geprüft

- Speichern (beim Bearbeiten und «Mietvertrag speichern» in «Prüfen»): Auftrag war nur anschauen. Ob Dwello das Speichern mit Überschneidung ablehnt und welche Meldung dann kommt, weiss ich daher nicht.
- 200 % Zoom: nicht verlangt, nicht ausprobiert.
- Ob die kurze Meldung stehen bleibt, wenn die Maus darauf liegt: nicht ausprobiert, ich habe nur gewartet (sie war nach 6 bis 8 Sekunden weg, bei 150 % und 100 %).
- Ob «Weiter» in Schritt 3 trotz Kasten «Zeitraum überschneidet sich» weitergeht: Bei H-1 bin ich mit noch fehlschlagendem Request durch Schritt 3 gegangen, daher war dort noch kein Kasten.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-669/` (z… = 150 %, n… = 100 %).
