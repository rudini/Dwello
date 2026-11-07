# Sven, Runde #682: Suche und Filter auf den Listenseiten

Persona: Sven, 45, blind, Screenreader und nur Tastatur, Desktop 1440 × 900, beurteilt nach dem Accessibility-Baum. Ich habe nichts gespeichert, nur gesucht, gefiltert und geblättert.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine. Was #682 ändert, hat mich auf keiner der sechs Listen behindert. |

## Beobachtungen

- Auf allen sechs Listen höre ich den Orientierungspunkt «Suche und Filter, Suche». Über die Landmark-Navigation komme ich direkt zum Formular. Kein Feld heisst «(optional)», und keins meldet sich als Pflichtfeld (im Baum `required=false`, bei den Auswahlfeldern fehlt die Eigenschaft ganz).
- Die Hilfe der Gebäudesuche wird als Beschreibung des Felds vorgelesen: «Suche, Eingabefeld, Suchen Sie nach Name oder Adresse des Gebäudes.» Genauso bei Wohnungen, Rechnungen («Rechnungssteller oder Beschreibung») und beim Jahr der Rechnungen («Jahr des Rechnungsdatums»).
- Nach «Suchen», «Filter zurücksetzen» oder einem Seitenwechsel landet der Fokus auf der Überschrift mit der Anzahl, zum Beispiel «Rechnungen 41–60 von 83, Seite 3 von 5, Überschrift Ebene 2» oder «Keine Gebäude gefunden, Überschrift Ebene 2». So weiss ich sofort, was passiert ist. Allerdings muss ich danach mit Umschalt+Tab zum Suchfeld zurück (Rechnungen: 6 Schritte), bevor ich weitertippen kann. In meinem ersten Versuch habe ich «Xylophon» blind getippt, und es ging ins Leere, weil der Fokus auf der Überschrift lag. Das kenne ich von anderen Seiten, ist aber erwähnenswert.
- Die Überschrift einer Seite mit nur einem Eintrag heisst «Wohnung 13 von 13, Seite 2 von 2» und nicht «Wohnungen 13–13 von 13». Das verstehe ich, es klingt nur anders als die erste Seite.
- Bei nur einer Seite heisst die Überschrift kurz «3 Gebäude», «10 Mieter», «4 Rechnungen». Das ist in Ordnung.
- Einträge als Überschrift Ebene 3 gibt es nur bei Gebäuden und Wohnungen («Alpenblick, Überschrift Ebene 3, Link»). Bei Mietern, Mietverträgen, Rechnungen und Abrechnungen ist ein Eintrag ein Listenelement mit Link, ohne Überschrift. Mit der Überschriften-Taste springe ich dort also nicht von Eintrag zu Eintrag, mit der Listen- oder Link-Navigation geht es aber.
- Eine Suche von Seite 3 der Rechnungen aus führt zu `?search=ewl`, ohne `page`. Leere Felder bleiben aber teils in der Adresse: Gebäude `?search=Bahnhof&city=`, Abrechnungen `?status=paid&search=Bernasconi&building=`. Wohnungen und Rechnungen lassen leere Felder weg. Das höre ich nicht, ich sehe es nur in der Adresse.
- Das Formular zeigt «Filter zurücksetzen» nur, wenn die Adresse einen Filter enthält. Bei einer leeren Liste gibt es nur noch den Link im Leerzustand, einmal. Bei Gebäuden, Wohnungen und Rechnungen ist die Rücksetzung im Formular eine Schaltfläche, bei Abrechnungen ein Link (Ziel `/statements?` mit leerem Fragezeichen). Beide funktionieren.
- Abrechnungen: Der gewählte Status in «Nach Status filtern» heisst «9 Bezahlt Filter aufheben» und ist `aria-current=true`. In einer leeren gefilterten Liste höre ich deshalb zwei Wege zurück: «0 Bezahlt Filter aufheben» oben und «Filter zurücksetzen» im Leerzustand. Ihre Bedeutung ist verschieden (nur Status gegenüber allem), verwirrt hat es mich nicht.
- Das Suchfeld ist bei Mietern und Mietverträgen ein «Suchfeld» (searchbox), auf den anderen vier Seiten ein «Eingabefeld» (textbox).
- Mieter: Der Statusfilter heisst «Mieter, Kombinationsfeld, Alle Mieter». Erst die Optionen («Aktive Mieter», «Künftige Mieter», «Ehemalige Mieter») sagen mir, dass es um den Status geht.
- Enter in einem Auswahlfeld (zum Beispiel «Jahr») schickt das Formular nicht ab, sondern öffnet die Liste. Das ist Verhalten von Chromium. Ich muss zu «Suchen» tabben. Im Suchfeld schickt Enter ab.
- Blättern geht nur über «Vorherige Seite» und «Nächste Seite» in der Navigation «Seiten». Mit Tab sind es auf den Rechnungen 42 bis 49 Schritte bis «Nächste Seite» (jede Rechnung hat zwei Tab-Stopps: Eintrag und «Bearbeiten»), bei Abrechnungen 31. Über die Landmark «Seiten» geht es in einem Schritt. Zu Seite 5 komme ich nur über vier Mal «Nächste Seite».
- Nach dem Absenden meldet die globale Live-Region des Routers «Rechnungen - Dwello», obwohl die Seite gleich bleibt, und gleichzeitig wird die fokussierte Überschrift vorgelesen. Die zwei leeren `status`-Elemente im Formular sagten in meinen Läufen nie etwas.

## Aufgabe geschafft: ja

Gebäude gefunden (Suche «Bahnhof», Musterhaus Zentrum). Wohnung gefunden (Gebäude Seepark Residenz, Mietstatus Leer: Wohnung B1). Rechnungen gefunden (Suche «ewl», Kategorie Heizung, Jahr 2025: 4 Rechnungen). Suchen ohne Treffer: Gebäude «Xylophon», Rechnungen mit Jahr 2021, Mieter und Mietverträge «Xylophon», Abrechnungen Erledigt. Jedes Mal mit «Filter zurücksetzen» zurückgesetzt. Geblättert: Wohnungen Seite 1, 2 und zurück; Rechnungen Seite 1, 2, 3; Abrechnungen Seite 1 und 2.

## Aufwand

Etwa 45 Minuten, 14 Skripte. Von «Zum Inhalt springen» bis zum Suchfeld: 2 Tab-Schritte (Gebäude, Wohnungen), 3 bei Rechnungen. Von der Ergebnis-Überschrift einer leeren Liste zu «Filter zurücksetzen»: 1 Tab-Schritt. Von der Seitenüberschrift einer Rechnungsseite zu «Nächste Seite»: 42 bis 49 Tab-Schritte.

## Ablauf

- Gebäude, nach dem ersten «Suchen». Erwartet: Der Fokus bleibt im Suchfeld, ich kann gleich das nächste Wort tippen. Gesehen: Der Fokus springt auf «1 Gebäude, Überschrift Ebene 2». Mein getipptes «Xylophon» ging ins Leere. Mit Umschalt+Tab zurück ins Feld ging es.
- Rechnungen, Jahr gewählt, dann Enter. Erwartet: Das Formular wird abgeschickt. Gesehen: Die Auswahlliste «Jahr» klappt auf (`expanded=true`), nichts wird gesucht. Mit Tab auf «Suchen» und Enter ging es.
- Wohnungen, Seite 2. Erwartet: «Wohnungen 13–13 von 13, Seite 2 von 2». Gesehen: «Wohnung 13 von 13, Seite 2 von 2». Verständlich.
- Mieter, Mietverträge, Rechnungen, Abrechnungen. Erwartet nach der Beschreibung der Änderung: Einträge als Überschrift Ebene 3. Gesehen: keine Überschriften in den Einträgen, nur Listenelemente mit Link.

## Vorschläge

Keine Befunde in der Tabelle. Zu den Beobachtungen nur Hinweise, falls gewünscht:

- Leere Parameter (`city=`, `building=`) wie bei Wohnungen und Rechnungen aus der Adresse weglassen.
- Die Rücksetzung im Formular überall gleich machen (Schaltfläche oder Link) und bei Abrechnungen ohne das leere `?`.
- Bei Mietern, Mietverträgen, Rechnungen und Abrechnungen den Eintrag als Überschrift Ebene 3 auszeichnen, wenn das gemeint war.

## Nicht geprüft

- Ein echter Screenreader (NVDA, VoiceOver): Ich habe nur den Accessibility-Baum von Chromium (ariaSnapshot und CDP `Accessibility.getFullAXTree`) und den Tastaturfokus gelesen. Wie stark die Live-Region des Routers die Überschrift unterbricht, kann ich so nicht hören.
- Ein Fehlerzustand beim Laden der Liste: nicht Teil der Aufgabe, keine Anfrage zum Fehlschlagen genannt.
- Mietverträge und Mieter blättern: Mit 11 und 10 Einträgen haben sie nur eine Seite.
