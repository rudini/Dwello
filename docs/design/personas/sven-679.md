# Sven – #679: Entwurf löschen und zurück zur gefilterten Liste

Persona: Sven, 45, blind, Screenreader und nur Tastatur, Desktop 1440 × 900. Beurteilt habe ich den Accessibility-Tree, den Fokus (`document.activeElement`) und was in den Live-Regionen (`role=status`, `aria-live`) erscheint. Gespeichert (gelöscht) habe ich nur im Gebäude «Musterhaus Zentrum». Skripte und Screenshots: `/tmp/sven-679/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fehlerseite nach «Zurück» im Browser (`/statements/<gelöschte id>`) | Ein Schritt zurück nach dem Löschen öffnet wieder die Adresse der gelöschten Abrechnung. Ich höre «Fehler - Dwello» und dann «Diese Seite gibt es nicht. Prüfen Sie die Adresse oder gehen Sie zur Übersicht.» Der Fokus steht auf dem Body, nicht auf der Überschrift. Mit der Adresse ist aber alles in Ordnung, die Abrechnung habe ich eben selbst gelöscht. Ich habe zuerst gedacht, ich hätte mich vertippt oder das Löschen sei schiefgegangen. |

## Beobachtungen

- Der Statusfilter «Entwurf» hat `aria-current="true"`, ich höre also, welcher Filter aktiv ist. Gut.
- Nach dem Klick auf den Filter «7 Entwurf» oder auf «Suchen» steht der Fokus auf der Überschrift «7 Abrechnungen» bzw. «3 Abrechnungen». Das ist gut, denn ich höre sofort, wie viele Treffer es gibt. Die Gebäude-Auswahl liegt aber vor dieser Überschrift. Mit Tab bin ich erst nach 42 Schritten (einmal um die ganze Seite) wieder dort, mit Shift+Tab geht es schneller. Hat mich nicht aufgehalten.
- Die Gebäude-Auswahl löst beim Wechsel mit den Pfeiltasten nichts aus, erst «Suchen» filtert. Das ist für die Tastatur richtig.
- Auf der Abrechnung liegt «Abrechnung löschen» unter der Überschrift «Weitere Aktionen» (h2), nach der langen Kostentabelle. Mit Tab sind es 45 Schritte, mit der Überschriften-Navigation geht es rasch.
- Der Bestätigungsdialog ist sauber: `aria-modal="true"`, Name «Abrechnung löschen» über die Überschrift, die Beschreibung wird über `aria-describedby` mitgelesen («Die Abrechnung NK-11111111-2025-0004 von Maria Rossi wird gelöscht. Das lässt sich nicht rückgängig machen.»). Der erste Fokus liegt auf «Abbrechen», Tab bleibt im Dialog. Mit Escape geht der Dialog zu und der Fokus zurück auf «Abrechnung löschen».
- Nach dem Löschen komme ich wieder auf die Liste mit beiden Filtern (Entwurf + Musterhaus Zentrum). Der Fokus steht auf der h1 «Nebenkostenabrechnungen», und gut eine halbe Sekunde später erscheint in der Status-Region «Abrechnung NK-11111111-2025-0004 gelöscht». Der Name des Mieters fehlt in der Meldung, die Nummer genügt mir aber, weil der Dialog den Namen genannt hat.
- Die Meldung «… gelöscht» verschwindet nach weniger als 10 Sekunden von selbst. Sie hat einen Knopf «Meldung schliessen». Die Region ist höflich (polite), die Meldung kommt also nach der Überschrift. Wer langsam liest, findet sie danach nicht mehr.
- Zweimal zurück im Browser: wieder die gefilterte Liste, der gelöschte Entwurf ist nicht mehr da («2 Abrechnungen»). Der Fokus steht dabei auf dem Body, nicht auf der h1 wie nach dem Löschen. Die alte Meldung «… gelöscht» stand in den ersten Sekunden noch da, auch auf der Fehlerseite.
- Wenn ich die Abrechnung direkt über die Adresse öffne und lösche, lande ich auf der ungefilterten Liste `/statements` («Alle Gebäude», kein Statusfilter). Der Fokus steht auf der h1, die Meldung kommt wie oben. Das finde ich nachvollziehbar, weil es vorher ja keinen Filter gab.
- Diese Abrechnung habe ich in einem frischen Tab direkt über die Adresse geöffnet. Wenn ich dort auf der Fehlerseite (nach einem Schritt zurück) «Zurück» drücke, verlasse ich Dwello ganz (`about:blank`). Der Knopf geht also einfach in der Browser-Geschichte zurück.
- Die Zahl der Entwürfe beim Filter (ungefiltert zuletzt «4 Entwurf») hängt auch von anderen Personas ab, die gleichzeitig arbeiten. Ich zähle das nicht als Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten. Liste filtern: 19 Tabs bis «7 Entwurf», danach Gebäude-Auswahl, 3 Pfeiltasten und «Suchen». Abrechnung öffnen: 1 Tab ab der Trefferzahl. Löschen: 45 Tabs bis «Abrechnung löschen», Enter, Tab, Enter. Zweite Abrechnung über die Adresse: Adresse eingeben, dann die gleichen Löschschritte.

## Ablauf

- Einmal zurück im Browser nach dem Löschen. Erwartet: die Liste oder ein Hinweis, dass diese Abrechnung gelöscht wurde. Gehört: «Fehler - Dwello», «Diese Seite gibt es nicht. Prüfen Sie die Adresse …», Fokus auf dem Body (Screenshot `06-back1.png`: grosse Überschrift «Diese Seite gibt es nicht.», darunter die Knöpfe «Zurück» und «Zur Übersicht», unten rechts noch die Meldung «Abrechnung NK-11111111-2025-0004 gelöscht»).
- Zweimal zurück. Erwartet: Fokus wie nach dem Löschen auf der h1. Gehört: nur den Seitentitel, der Fokus steht auf dem Body (`07-back2.png`: die gefilterte Liste mit 2 Entwürfen).
- Fehlerseite nach direktem Öffnen, Knopf «Zurück». Erwartet: zurück zur Liste. Gesehen: leere Seite `about:blank`, Dwello verlassen.

## Vorschläge

- P-1: Reproduktion: Nebenkostenabrechnungen → «Entwurf» → Gebäude «Musterhaus Zentrum» → «Suchen» → eine Abrechnung öffnen → «Abrechnung löschen» → bestätigen → im Browser einmal zurück. Was helfen würde: Die Detailseite beim Weiterleiten nach dem Löschen in der Browser-Geschichte ersetzen. Dann führt «Zurück» direkt zur Seite davor (der Liste). Oder, wenn die Seite bleibt: für eine nicht mehr vorhandene Abrechnung einen eigenen Text, zum Beispiel «Diese Abrechnung gibt es nicht mehr. Sie wurde vielleicht gelöscht.», mit einem Link «Zu den Nebenkostenabrechnungen» und dem Fokus auf der Überschrift.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver). Ich habe nur den Accessibility-Tree und die Live-Regionen gelesen. Ob die h1 und die höfliche Meldung in der richtigen Reihenfolge vorgelesen werden, ist daraus abgeleitet.
- Ein Fehler beim Löschen (der Server lehnt ab): Das gehörte nicht zur Aufgabe, darum habe ich keine Anfrage scheitern lassen.
- Die dritte Musterhaus-Abrechnung (Anna Schmidt) habe ich nicht gelöscht, zwei Löschungen haben die Aufgabe abgedeckt.
