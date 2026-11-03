# Helga – PDF einer gelöschten Abrechnung (#734)

Persona: Helga, 68, Desktop 1440 × 900 mit 150 % und 200 % Zoom, Maus. Gebäude: «Musterhaus Zentrum».
Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-734/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | «Abrechnung nicht gefunden», wenn ich von der Detailseite komme | «Zu den Nebenkostenabrechnungen» führt mich zur ganzen Liste (`/statements`), mit allen Gebäuden und allen Status. Meine Filter «Entwurf» und «Musterhaus Zentrum» von vorher sind weg, und ich muss sie neu einstellen. Kam ich direkt von der Liste, blieben sie erhalten. |
| P-2 | Minor | «Abrechnung nicht gefunden» (beide Wege) | Die Seite sagt «Diese Abrechnung», aber nicht welche: kein Mietername, keine Nummer. Ich hatte drei PDF-Knöpfe untereinander und musste mir selbst merken, welchen ich gedrückt hatte. |

## Beobachtungen

- Der Text «Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.» ist kurz und verständlich. Ich habe sofort begriffen, dass das andere Fenster die Abrechnung gelöscht hat. Der Browser-Tab heisst «Abrechnung nicht gefunden - Dwello». Das passt.
- Die Seite sieht aus wie Dwello: oben die gewohnte Leiste mit Menü, Logo, Sprache und Benutzer, darunter ein kleines Haus mit Warndreieck, ein grosser Titel, ein dunkelblauer Knopf und unten die gewohnte Fusszeile. Bei 150 % und bei 200 % ist alles gross und gut lesbar; es gibt nichts zum Seitwärtsscrollen (Seitenbreite = Fensterbreite, 960 bzw. 720 px).
- Von der Liste aus heisst der Knopf nur «Zurück». Er führte mich genau zur gefilterten Liste: «Musterhaus Zentrum» war ausgewählt, unter «Entwurf» stand die richtige Zahl, und Maria Rossi fehlte. Das war gut. Ein Wort mehr, wohin «Zurück» führt, hätte mich aber beruhigt.
- Ein Hinweis, was ich jetzt tun soll (etwa «Erstellen Sie die Abrechnung neu, falls Sie sie noch brauchen»), fehlt. Für mich reicht hier aber der Knopf zurück.
- Die Browser-Taste «Zurück» auf der Fehlerseite (Fall Anna Schmidt) bringt mich auf die Detailseite der gelöschten Abrechnung. Dort steht nur die allgemeine Seite «Diese Seite gibt es nicht. Prüfen Sie die Adresse …» mit dem Tab-Titel «Fehler - Dwello». Ich habe aber keine Adresse eingetippt, das verwirrt.
- Auch der Brotkrumen-Link «Nebenkostenabrechnungen» auf der Detailseite führt zur ungefilterten Liste. P-1 ist also gleich wie der normale Weg zurück von der Detailseite.
- Nach dem Löschen im zweiten Tab kam eine grüne Meldung «Abrechnung NK-11111111-2025-0004 gelöscht». Die Bestätigung davor nennt Nummer und Mieterin und sagt «Das lässt sich nicht rückgängig machen». Das war klar.
- Es wurde kein PDF heruntergeladen: Die Anfrage an `/api/statements/<id>/pdf` antwortete mit 303 und leitete auf `/documents/refused?code=STATEMENT_NOT_FOUND` um (mit `&back=` und der gefilterten Liste, wenn ich von der Liste kam).
- Andere Personas arbeiteten gleichzeitig. Im zweiten Tab fehlte zum Beispiel Nina Brunner (Seepark Residenz) in der Liste. Das zähle ich nicht als Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, rund 20 Schritte (Filter setzen, zweimal löschen, zweimal PDF, zweimal zurück, alles bei 150 % und 200 %).

## Ablauf

- Schritt 1, Filter: Ich erwartete, dass die Wahl «Musterhaus Zentrum» die Liste sofort filtert. Gesehen habe ich, dass sie erst nach «Suchen» filtert. Das ging, weil der Knopf gleich daneben steht.
- Schritt 4, Weg zurück von der Fehlerseite: Ich erwartete, wieder auf meiner gefilterten Liste zu landen, von der aus ich Anna Schmidt geöffnet hatte. Gesehen habe ich die ganze Liste ohne Filter (P-1).
- Schritt 4, Browser-Taste «Zurück»: Ich erwartete die Detailseite oder einen Hinweis «gelöscht». Gesehen habe ich «Diese Seite gibt es nicht. Prüfen Sie die Adresse» (Beobachtung).

## Vorschläge

- P-1: Liste filtern (Entwurf, Musterhaus Zentrum), Anna Schmidt öffnen, in einem zweiten Tab löschen, im ersten Tab «PDF herunterladen» klicken, dann «Zu den Nebenkostenabrechnungen». Es öffnet sich `/statements` ohne Filter. Hilfreich wäre, wenn der Knopf zur Liste mit den Filtern führt, mit denen ich die Detailseite geöffnet habe.
- P-2: Liste filtern, Maria Rossi in einem zweiten Tab löschen, im ersten Tab ihr PDF klicken. Die Seite nennt nicht, welche Abrechnung gemeint ist. Hilfreich wäre ein Satz wie «Die Abrechnung NK-11111111-2025-0004 von Maria Rossi gibt es nicht mehr.», falls die Angaben noch vorhanden sind.

## Nicht geprüft

- Zweimal dasselbe Löschen, also einen dritten Durchgang mit echtem Löschen bei 200 % für Maria Rossi: Ihre Abrechnung war schon gelöscht. Die Fehlerseite habe ich bei 200 % über dieselbe Adresse geöffnet, die mir der Browser vorher angezeigt hatte. Den Fall Anna Schmidt habe ich bei 200 % echt durchgespielt und bei 150 % über die Adresse angesehen.
- Den Dunkelmodus und andere Sprachen habe ich nicht angeschaut, weil das nicht zu meiner Aufgabe gehörte.
