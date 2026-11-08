# Helga – Runde 1316: Suche mit «%» und «_», Kategorien mit «%» im Namen

Desktop 1440 × 900, Zoom 150 %, Maus. App: http://localhost:3300 (Persona-Stack, Demodaten). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/c35a8abe-2bfd-517a-87df-a37e657d0791/scratchpad/helga-1316/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Zu dem, was sich geändert hat, habe ich keinen Befund. Die Suchen mit «_» und «%» finden nur noch, was wirklich so geschrieben ist, und die beiden Kategorien mit «50%» und «50 Prozent» konnte ich beide speichern. |

## Beobachtungen

- **Mieter, Suche «Hans Müller»:** Es kommt genau ein Treffer, «1 Mieter», Hans Müller mit Wohnung 1.01 im Musterhaus Zentrum. Gleich unter dem Knopf «Suchen» erscheint der Link «Filter zurücksetzen». So habe ich es erwartet.
- **Mieter, Suche «Hans_Müller» und «%»:** Beide Male steht «Keine Mieter gefunden. Kein Mieter passt zur Suche und zum Filter.» und darunter der grosse Knopf «Filter zurücksetzen». Dass «Hans_Müller» nichts findet, verstehe ich: Ich habe ja einen Strich statt eines Leerschlags getippt. Dass «%» nichts findet, ist für mich auch richtig, denn bei keinem Mieter steht ein Prozentzeichen. «Hans%Müller» und «_» allein finden ebenfalls nichts. Der Text «…und zum Filter» hat mich kurz verunsichert: Ich hatte keinen Filter gewählt, nur gesucht, und bei «Mieter» stand «Alle Mieter».
- **Zurück zu allen Mietern:** Nach dem Klick auf «Filter zurücksetzen» ist das Suchfeld leer und es stehen wieder «10 Mieter» da. Das hat gut geklappt. Das Wort «Filter» passt für mich aber nicht ganz, ich habe ja eine *Suche* gemacht. «Alle Mieter zeigen» hätte ich sofort verstanden.
- **Gebäude, «Musterhaus Zentrum» / «Musterhaus_Zentrum» / «%»:** Mit Leerschlag erhalte ich «1 Gebäude», mit Strich und mit «%» kommt «Keine Gebäude gefunden. Kein Gebäude passt zu Ihrer Suche. Prüfen Sie die Schreibweise oder zeigen Sie alle Gebäude.» Dieser Text ist der klarste der drei Listen. Er sagt «zeigen Sie alle Gebäude», der Knopf darunter heisst aber «Filter zurücksetzen». Ich musste kurz überlegen, ob das derselbe Weg ist. Er ist es: Danach stehen wieder «3 Gebäude» da.
- **Rechnungen, «%»:** Ich erhalte «Keine Rechnungen gefunden. Versuchen Sie es mit anderen Filtern.» und den Knopf «Filter zurücksetzen». Der Text erwähnt meine Suche nicht. Ich hätte zuerst bei Gebäude, Kategorie und Jahr nachgeschaut, obwohl dort überall «Alle …» steht. «Filter zurücksetzen» bringt wieder alle 84 Rechnungen. Zur Probe: «Winterdienst Oberland» findet 4 Rechnungen, «Winterdienst_Oberland» keine. Auch das ist für mich richtig.
- Die drei Listen sagen dasselbe («nichts gefunden») mit drei verschiedenen Texten. Auf der Gebäudeliste heisst das Suchfeld bei einem Treffer «Filter zurücksetzen» als Knopf, bei den Mietern ist es ein Link. Das hat mich nicht aufgehalten.
- Die Seite «Rechnungen» zeigt ohne Suche «Rechnungen 1–20 von 84, Seite 1 von 5», mit Suche nur «4 Rechnungen». Das ist in Ordnung.
- **Kostenkategorien, «Reinigung 50% Treppe»:** Ich habe die Kategorie mit «Umlagefähig» gespeichert. Danach komme ich auf die Liste zurück, die Kategorie steht zuoberst mit «Eigene», «Umlagefähig» und «0 Rechnungen», und die Zahl oben ändert auf «Alle (22)». Eine Meldung wie «Kategorie gespeichert» habe ich nicht gesehen. Dass es geklappt hat, habe ich nur gemerkt, weil die Kategorie zuoberst in der Liste stand. Bei 150 % bricht der Name in der Liste auf drei Zeilen um («Reinigung / 50% / Treppe»), weil die Spalte für den Namen schmal ist.
- **«Reinigung 50 Prozent Treppe»:** Auch diese Kategorie wurde ohne Einwand gespeichert und steht jetzt über der ersten. Das hatte ich erwartet, denn es sind zwei verschiedene Namen. Ich frage mich aber, ob ich mir mit zwei so ähnlichen Kategorien nicht später selbst ein Bein stelle, wenn ich Rechnungen einordne. Einen Hinweis darauf gibt Dwello nicht. Das ist meine Sache und kein Fehler.
- **Nochmals «Reinigung 50% Treppe»:** Ich bleibe auf «Neue Kategorie». Das Feld «Name» ist rot umrandet, und darunter steht in Rot: «Eine Kategorie mit dem Namen «Reinigung 50% Treppe» existiert bereits. Wählen Sie einen anderen Namen.» Dieser Text ist klar: Er sagt, was los ist und was ich tun soll, und meine Eingaben (Umlagefähig) sind noch da. Ich hätte mir einzig gewünscht, dass ich die bestehende Kategorie von dort direkt öffnen kann.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 30 Schritte: 5 Suchen bei den Mietern, 3 bei den Gebäuden, 6 bei den Rechnungen, je einmal «Filter zurücksetzen» und 3 Speicherversuche bei den Kategorien.

## Ablauf

- **Rechnungen, Suche «%»:** Ich erwartete einen Hinweis, dass meine Suche nichts gefunden hat. Gesehen habe ich «Versuchen Sie es mit anderen Filtern.», ohne Wort zur Suche.
- **Mieter, Suche «Hans_Müller»:** Ich erwartete «Kein Mieter passt zu Ihrer Suche». Gesehen habe ich «…passt zur Suche und zum Filter», obwohl ich keinen Filter gewählt hatte.
- **Kategorie speichern:** Ich erwartete eine kurze Bestätigung «gespeichert». Gesehen habe ich nur die Liste mit der neuen Kategorie zuoberst.

## Vorschläge

Keine Tabellen-IDs. Für die Beobachtungen: ein gemeinsamer Leertext für alle Listen, der die Suche nennt (z. B. «Nichts passt zu Ihrer Suche «%». Prüfen Sie die Schreibweise.»), und einen Knopf, der sagt, was er tut («Alle Mieter zeigen» / «Alle Rechnungen zeigen»).

## Nicht geprüft

- **Heizprofile mit «%» oder «_» im Namen:** Laut Auftrag durfte ich nur bei den Kostenkategorien speichern, deshalb habe ich es nicht versucht.
- **Zoom 200 %:** Ich habe nur mit 150 % gearbeitet.
- **Andere Listen mit Suche** (Wohnungen, Mietverträge): Sie gehörten nicht zum Auftrag.
