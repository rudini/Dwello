# Sven, Runde 677: Dokument hochladen, Fehler, gleiche Datei, Filter «Mieter», beschäftigte Knöpfe

Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum (Fokus, `aria-describedby`, Live-Bereiche). Mieter: Laura Keller (Alpenblick EG). Zwei erfundene Dateien «Hausordnung-Sven.pdf» (gleicher Name, anderer Inhalt) hochgeladen und am Schluss wieder gelöscht. Damit ich den Zustand «wird gesendet» hören kann, habe ich die Anfragen im Browser um 1,5 bis 2,5 Sekunden verzögert; einmal habe ich ein Hochladen mit 500 beantworten lassen (nichts gespeichert).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| S-1 | Major | Dokumente, Filter «Mieter» | Jede Pfeiltaste im geschlossenen Auswahlfeld lädt die Liste sofort neu. Kommt ein Mieter ohne Dokumente (Nina Brunner), springt der Fokus aus dem Auswahlfeld auf die Überschrift «Noch keine Dokumente», weitere Pfeiltasten wirken nicht mehr. Laura Keller erreiche ich mit den Pfeiltasten nicht ohne Umweg. |
| S-2 | Minor | Mieter, «Dokument hochladen», Feld «Datei» | Der Hinweis auf die gleiche Datei («Eine Datei «Hausordnung-Sven.pdf» haben Sie schon … hochgeladen …») kommt nur über die Beschreibung des Feldes. Er erscheint, wenn der Fokus schon auf dem Feld steht, und liegt in keinem Live-Bereich: Ob er angesagt wird, hängt vom Screenreader ab. Sicher höre ich ihn erst, wenn ich das Feld verlasse und wieder hineingehe. |
| S-3 | Minor | Dokumente, Filter «Mieter» | Nach dem Filtern höre ich nur den Seitentitel «Dokumente - Dwello». Der Statusbereich neben dem Filter bleibt leer, ich erfahre nicht, wie viele Dokumente jetzt gezeigt werden. |
| S-4 | Minor | Mieter, Liste «Dokumente» (nach dem zweiten Hochladen) | Die zwei Dokumente heissen gleich und haben das gleiche Datum bis auf die Minute. Beide Knöpfe heissen «Löschen: Hausordnung-Sven», beide Links «Datei herunterladen: Hausordnung-Sven». Ich kann sie nicht unterscheiden und lösche womöglich die falsche Fassung. |

## Frühere Befunde (#677)

- **P-3** (beschäftigter Knopf deaktiviert, Fokus auf body, nichts angesagt): **behoben.** Bei «Dokument hochladen», bei «Dokument löschen» im Dialog und bei «Änderungen speichern» (Mieter bearbeiten) bleibt der Fokus auf dem Knopf. Der Knopf hat `aria-disabled="true"` und `aria-busy="true"`, sein Name wird «Bitte warten …» bzw. «Wird gespeichert …», und der Statusbereich daneben sagt dasselbe. Wenn ich während des Sendens noch zweimal Enter oder Leertaste drücke, geht trotzdem nur eine Anfrage raus.
- **P-7**, erste Stelle (Fehler nach der Hilfe gelesen): **behoben.** Feld «Datei» ohne Datei abgeschickt: der Fokus kommt ins Feld, `aria-invalid="true"`, die Beschreibung lautet zuerst «Wählen Sie eine Datei aus.», danach die Hilfe «PDF, JPG oder PNG …».
- **P-7**, zweite Stelle: **behoben.** «Mieter bearbeiten», Nachname geleert: der Fokus kommt ins Feld «Nachname», zuerst «Nachname ist erforderlich.», danach «Beispiel: Keller». Dwello hat abgelehnt, gespeichert wurde nichts.
- **P-4**, erste Stelle (Fokus nach der Aktion): **behoben.** Nach dem Hochladen steht der Fokus wieder auf dem Feld «Datei» (leer, bereit für die nächste Datei), danach sagt der Status «Dokument «Hausordnung-Sven» hochgeladen».
- **P-4**, zweite Stelle: **behoben.** Nach «Dokument löschen» im Dialog steht der Fokus auf der Liste «Dokumente», der Status sagt «Dokument «Hausordnung-Sven» gelöscht». Das gilt auch, wenn die Liste danach leer ist («Noch keine Dokumente.»).

## Beobachtungen

- N-1: Während des Sendens heisst der Knopf «Bitte warten …», und gleichzeitig sagt der Statusbereich «Bitte warten …». Je nach Screenreader höre ich das zweimal. Das stört nicht.
- N-2: Nach jedem Absenden (Fehler, Hochladen, Löschen, Speichern) wird der Seitentitel assertiv neu angesagt («Laura Keller - Dwello»), im selben Moment, in dem der Fokus ins Fehlerfeld springt. Mit einem echten Screenreader kann das die Ansage des Feldes oder die Erfolgsmeldung unterbrechen. Im Accessibility-Baum lässt sich das nicht prüfen.
- N-3: Das Feld «Datei» heisst im Baum «Datei Datei auswählen» (zwei Labels). Der gewählte Dateiname («Hausordnung-Sven.pdf») steht als Text daneben, aber nicht im Namen und nicht in der Beschreibung des Feldes.
- N-4: In der Aufgabe stand «ohne Titel abschicken». Der Titel ist aber optional, ohne Titel gibt es keinen Fehler. Für den Fehler habe ich deshalb ohne Datei abgeschickt.
- N-5: Der Lösch-Dialog öffnet mit dem Fokus auf «Abbrechen» und sagt die Folge klar: «Dokument «Hausordnung-Sven» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.» Gut.
- N-6: Simulierter Serverfehler beim Hochladen (500): ein Alert «Das hat nicht geklappt. Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen».», und der Fokus bleibt auf dem Knopf. Gut.
- N-7: Wenn ich auf der Seite «Dokumente» einem Link mit dem Namen eines Mieters folge, landet der Fokus auf body, angesagt wird «Laura Keller - Dwello», mein erster Tab trifft «Zum Inhalt springen». Das ist wie bei jedem anderen Seitenwechsel.
- N-8: Den Filter erreiche ich vom Seitenanfang mit 21 Tabs. Mit Tippen des Anfangsbuchstabens («L») oder mit Alt+Pfeil runter, Pfeiltasten und Enter wähle ich genau einmal, dann bleibt der Fokus im Auswahlfeld. Das ist der Umweg für S-1.
- N-9: Nach dem ungültigen Speichern sagt der Seitentitel «Laura Keller bearbeiten - Dwello», die Überschrift heisst aber «Mieter bearbeiten». Das ist eine kleine Abweichung.
- N-10: Der Einleitungstext auf «Dokumente» ist lang (Versand, Mahnungen, Zahlungsfrist), bevor der Filter kommt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 30 Minuten, 11 Skriptläufe. Zum Knopf «Dokument hochladen» sind es 29 Tabs vom Seitenanfang, zum Filter auf «Dokumente» 21 Tabs.

## Ablauf

- Ich habe ohne Titel abgeschickt und eine Fehlermeldung beim Titel erwartet. Es kam keine, weil der Titel optional ist (N-4). Ohne Datei kam der Fehler am Feld «Datei», zuerst der Fehler und dann die Hilfe.
- Beim Wählen der gleichen Datei habe ich eine Ansage erwartet, dass es diese Datei schon gibt. Der Hinweis steht sichtbar unter dem Knopf (gelb, mit Warnsymbol) und in der Beschreibung des Feldes, wird aber nicht als Meldung angesagt (S-2). Hochladen ging trotzdem, und die Liste hatte danach zwei nicht unterscheidbare Einträge (S-4).
- Im Filter «Mieter» habe ich mit Pfeil runter durch die Namen gehen wollen und erst bei «Laura Keller» eine neue Liste erwartet. Schon beim ersten Mieter wurde neu geladen, beim zweiten Mieter (Nina Brunner, keine Dokumente) war der Fokus auf «Noch keine Dokumente» und das Auswahlfeld weg (S-1).
- Nach dem Filtern habe ich eine Ansage der Anzahl erwartet. Gesagt wurde nur «Dokumente - Dwello» (S-3).

## Vorschläge

- **S-1:** Seite «Dokumente» öffnen, mit Tab ins Auswahlfeld «Mieter», Pfeil runter drücken. Schon nach dem ersten Druck wird die Liste neu geladen, nach dem zweiten (Nina Brunner) steht der Fokus auf «Noch keine Dokumente». Was helfen würde: erst filtern, wenn ich es bestätige (Knopf «Filtern» wie auf «Mieter» mit «Suchen»), oder den Fokus nach dem Neuladen immer im Auswahlfeld lassen, auch bei leerer Liste.
- **S-2:** Bei Laura Keller eine Datei hochladen, dann im Feld «Datei» mit der Leertaste dieselbe Datei noch einmal wählen. Der Hinweis erscheint, angesagt wird nichts. Was helfen würde: den Hinweis zusätzlich in einem höflichen Live-Bereich ansagen (role="status"), nicht nur über die Beschreibung.
- **S-3:** Auf «Dokumente» einen Mieter im Filter wählen. Angesagt wird nur der Seitentitel. Was helfen würde: den leeren Statusbereich beim Filter mit «2 Dokumente zu Laura Keller» füllen.
- **S-4:** Dieselbe Datei zweimal ohne Titel hochladen. Was helfen würde: im Namen der Knöpfe die Uhrzeit oder eine Nummer nennen (zum Beispiel «Löschen: Hausordnung-Sven, hochgeladen 23:09»), oder beim zweiten Hochladen einen anderen Titel vorschlagen.

## Nicht geprüft

- Wie NVDA, JAWS oder VoiceOver den Hinweis aus S-2 und die gleichzeitige Titelansage (N-2) wirklich sprechen: Ich hatte nur den Accessibility-Baum und habe die Live-Bereiche und den Fokus alle 20 ms mitgeschrieben.
- Den nativen Dateidialog des Betriebssystems: Headless Chromium zeigt keinen. Ich habe das Feld mit der Leertaste geöffnet und die Datei über den Dateiauswahl-Event gesetzt.
- Einen Mieter erfolgreich speichern: In meiner Aufgabe durfte ich ausser den Dokumenten nichts ändern. Ich habe deshalb nur ein ungültiges Speichern geprüft (Nachname leer, abgelehnt). Laura Keller ist danach unverändert.
