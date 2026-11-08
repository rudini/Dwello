# Helga – Suchfeld und Liste (Issue 680)

Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App http://localhost:3300 mit Demodaten. Nichts gespeichert, gelöscht oder gesendet.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Minor | Wohnungen, Rechnungen, Nebenkostenabrechnungen, Mieter, Mietverträge (Auswahlfelder) | Wenn ich ein Wort ins Suchfeld tippe und dann ohne «Suchen» ein Gebäude, Jahr oder einen Status auswähle, filtert die Liste sofort nach der Auswahl, und mein getipptes Wort verschwindet ohne Hinweis aus dem Suchfeld. Feld und Liste stimmen zwar überein, aber ich hätte erwartet, dass mein Wort mitgesucht oder wenigstens stehen bleibt. |

## Beobachtungen

- In allen sechs Listen zeigte das Suchfeld nach jedem Schritt genau das, wonach die Liste gefiltert war. Die einzige Ausnahme ist die Zeit zwischen Tippen und «Suchen»: da steht im Feld das neue Wort, die Liste zeigt noch das Ergebnis der letzten Suche. Das finde ich normal, ich habe ja noch nicht gesucht.
- Hauptmenü, gleiche Liste noch einmal gewählt: Die Liste ist wieder ungefiltert (z. B. «Rechnungen 1–20 von 84»), das Suchfeld leer, mein ungesuchtes Wort ist weg. Das passt zusammen und hat mich nicht gestört: Mit dem Menü fange ich neu an.
- Andere Adresse (/dashboard), dann Zurück: Das Suchfeld zeigt das zuletzt *gesuchte* Wort (z. B. «BKW», «Müller», «Alpenblick»), nicht das nur getippte («ewl», «Meier», «Seepark»), und die Liste ist genau danach gefiltert. Vorwärts und nochmals Zurück: dasselbe. Noch einmal Zurück führte zur ungefilterten Liste mit leerem Feld. Gleich verhalten hat es sich, wenn ich statt der Adressleiste «Übersicht» im Menü geklickt habe, und bei Zurück/Vorwärts nach einem Klick auf die gleiche Liste im Menü.
- Nach «Suchen» und nach einem Klick auf die gleiche Liste im Menü springt die Seite nach unten zur Überschrift mit der Anzahl (bei Rechnungen ca. 515 Pixel, bei Wohnungen 395, Nebenkostenabrechnungen 348, Mieter ca. 300, Mietverträge 395; bei Gebäude nicht). Auf dem Bildschirm sah ich danach die Seitenüberschrift und das Suchfeld nicht mehr, nur noch «Jahr», «Suchen» und «Rechnungen 1–20 von 84». Dass mein Suchwort nach dem Menüklick gelöscht wurde, sah ich deshalb erst beim Hochscrollen. Bei Zurück blieb die Seite ebenfalls weiter unten stehen.
- Bei «Werke» in Rechnungen kam «Keine Rechnungen gefunden» mit «Filter zurücksetzen»; das war klar.
- Gebäude hat kein Auswahlfeld (nur «Ort» als Textfeld), dort konnte ich Schritt 3 nicht machen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, rund 90 Schritte über sechs Listen (je drei Abläufe), plus eine zweite Runde mit Menü-Navigation statt Adressleiste.

## Ablauf

- Rechnungen, Wort «ewl» getippt, dann Auswahl «Gebäude» geändert. Erwartet: Liste nach Gebäude *und* «ewl» gefiltert, oder das Wort bleibt im Feld stehen. Gesehen: Adresse nur `?building=…`, Suchfeld leer, 14 Rechnungen des Gebäudes. Gleich bei Wohnungen (Gebäude), Nebenkostenabrechnungen (Gebäude), Mieter (Status «Aktive Mieter») und Mietverträge (Gebäude).
- Rechnungen, nach Klick auf «Rechnungen» im Menü. Erwartet: Seite oben, Suchfeld sichtbar. Gesehen: Seite nach unten gesprungen, Fokus auf «Rechnungen 1–20 von 84, Seite 1 von 5», Suchfeld ausserhalb des Bildschirms.

## Vorschläge

- H-1: Rechnungen öffnen, ins Suchfeld «ewl» tippen (nicht «Suchen» drücken), im Feld «Jahr» «2025» wählen. Die Liste lädt sofort, das Suchfeld ist leer. Hilfreich wäre, das getippte Wort beim Wechsel der Auswahl mitzunehmen (dann filtert die Liste nach beidem und das Feld zeigt es weiter an). Wenn das nicht gewollt ist, wenigstens ein kurzer Hinweis beim Suchfeld, dass eine Auswahl sofort sucht und ein ungesuchtes Wort verwirft.

## Nicht geprüft

- 200 % Zoom: nicht durchgespielt, nur 150 %.
- Die Ausklappliste der Auswahlfelder habe ich über die Auswahl des Werts bedient, nicht die native Ausklappliste angeschaut (die zeichnet der kopflose Browser nicht).
- Gebäude Schritt 3: keine Auswahl vorhanden.
