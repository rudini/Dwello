# Helga – #1094 (Weg zurück zur gefilterten Abrechnungsliste)

Desktop 1440 × 900, Zoom 150 %, Maus. App: http://localhost:3300 (Persona-Stack, Demodaten).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde zu dem, was geändert wurde. Wo ich den Weg zurück prüfen konnte (Ersatz mit «Musterhaus Zentrum», siehe unten), kam ich jedes Mal auf die gefilterte Liste zurück. |

## Beobachtungen

- Im Gebäude «Alpenblick» gibt es keinen einzigen Entwurf. Ich habe die Liste mit «Entwurf» und «Alpenblick» gefiltert und bekam «Keine Abrechnungen gefunden – Versuchen Sie, Ihre Filter anzupassen.» Die Statusfilter zeigten für Alpenblick «0 Entwurf», «2 Bezahlt». Auch die Übersicht sagt «Noch nicht abgerechnet: Alpenblick (2025, 2023, 2022, 2021)». Alle 7 Entwürfe gehören zu «Seepark Residenz» (4) und «Musterhaus Zentrum» (3). Ich habe zwischen 15:51 und 15:54 Uhr viermal nachgeschaut, es kam keiner dazu.
- Nach «Suchen» hiess der Statusfilter «0 Entwurf», und sein Link führt ohne `status=draft` auf die Liste. Ob «Entwurf» gerade gewählt ist, sehe ich in der Vorlesefassung nicht (kein «aktuell»). Auf dem Bild konnte ich das nicht genau prüfen.
- In der Liste geht «PDF» direkt auf `/api/statements/<id>/pdf`, auf der Detailseite geht «PDF herunterladen» auf `/statements/<id>/pdf?list=…` und merkt sich die Liste. Ob ein «PDF» aus der Liste bei einem gelöschten Entwurf auch zurück auf die gefilterte Liste führt, habe ich nicht geprüft.
- Wenn ich eine Abrechnung direkt über ihre Adresse öffne (nicht über die Liste), führt «Nebenkostenabrechnungen» oben auf die ungefilterte Liste `/statements`. Das finde ich richtig.
- Die Seite «Abrechnung nicht gefunden» (Bild 07) ist ruhig und gut lesbar: ein Haus mit Warndreieck, die grosse Überschrift, ein Satz «Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.» und ein grosser blauer Knopf «Zurück» mit Pfeil. Bei 150 % war alles ohne Scrollen sichtbar. Nur: «Zurück» sagt nicht, wohin. «Zurück zur Liste» würde mir mehr Sicherheit geben.

## Aufgabe geschafft: nein

Ich bin schon beim ersten Schritt hängen geblieben: «einen Entwurf von Alpenblick öffnen». Es gibt in Alpenblick keinen Entwurf. Einen Entwurf neu zu erstellen, hätte etwas anderes gespeichert, und das sollte ich nicht. Deshalb habe ich auch nichts gelöscht. Den Weg zurück habe ich ersatzweise nur angeschaut, ohne etwas zu speichern (siehe Ablauf).

## Aufwand

Etwa 6 Minuten (zusätzlich etwa 3 Minuten Warten), 7 Skripte, rund 15 Klicks.

## Ablauf

1. **Liste nach Entwürfen von «Alpenblick» filtern.** Erwartet: einige Entwürfe von Alpenblick. Gesehen: «Keine Abrechnungen gefunden» (Bild 03). Ich habe es dreimal versucht (gleich nach dem Filtern, dann zweimal über die Adresse mit Filter, je 45 s später). Jedes Mal war die Liste leer.
2. **Ersatz, nur angeschaut: Entwürfe von «Musterhaus Zentrum».** Ich habe «Entwurf» gewählt, dann «Musterhaus Zentrum» und «Suchen» gedrückt. 3 Abrechnungen. Ich habe «Anna Schmidt NK-11111111-2025-0002» geöffnet. Oben stand die Brotkrümelnavigation «Nebenkostenabrechnungen › Abrechnung NK-11111111-2025-0002». Ein Klick auf «Nebenkostenabrechnungen» führte zurück auf die Entwürfe von Musterhaus Zentrum (Gebäude gewählt, «3 Abrechnungen», Bild 06). Das ist genau das, was ich erwartet hatte. Diesen Schritt führe ich nur auf, weil er der Ersatz für Alpenblick ist.
3. **Ersatz für «PDF eines gelöschten Entwurfs»:** Ich habe die Adresse des PDF-Knopfs der Detailseite mit einer Abrechnung aufgerufen, die es nicht gibt (`/statements/00000000-…-999/pdf?list=<Entwürfe Musterhaus>`). Gelöscht oder gespeichert habe ich nichts. Erwartet: eine verständliche Meldung statt eines kaputten Downloads. Gesehen: die Seite «Abrechnung nicht gefunden» (Bild 07). «Zurück» führte auf die Entwürfe von Musterhaus Zentrum (Bild 08), also dorthin, wo ich hinwollte. Das ist aber nicht derselbe Weg wie mit einem echten Löschen in einem zweiten Tab.

## Vorschläge

Keine Tabellen-IDs. Allgemein: Damit die Aufgabe so durchgeführt werden kann, braucht «Alpenblick» im Persona-Stack mindestens einen Entwurf. Entweder legt ihn der Aufrufer vor dem Lauf an, oder die Aufgabe erlaubt mir, für Alpenblick Abrechnungen zu erstellen.

## Nicht geprüft

- Schritt 1 mit einem Entwurf von Alpenblick: In Alpenblick gibt es keinen Entwurf. Ich habe es dreimal gefiltert, auch über einige Minuten verteilt.
- Schritt 2 als Ganzes (PDF erstellen, zweiter Tab, Entwurf löschen, im zweiten Tab das PDF herunterladen): Ohne Entwurf in Alpenblick ging das nicht. In anderen Gebäuden durfte ich weder löschen noch speichern. Als Ersatz habe ich nur das PDF einer Abrechnung aufgerufen, die es nicht gibt (Ablauf 3).
- Der Weg zurück von «PDF» direkt in der Liste bei einem gelöschten Entwurf: nicht versucht.

Bilder und Skripte: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1094/`
