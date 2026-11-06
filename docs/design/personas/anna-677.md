# Anna, Runde 677: Dokumente finden und wissen, wo man hochlädt

Persona: Anna, 29. Ich komme nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900, Maus; dann Handy 390 × 844, Touch. App: http://localhost:3300 (Persona-Stack, Demodaten, Build von w-677). Ich habe nur geschaut und nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| A-1 | Minor | Dokumente, Einleitung | Wo ich hochlade, steht jetzt da, aber erst im letzten Satz eines Absatzes mit sechs Sätzen. Die Sätze davor erklären, wie man Briefe als versendet markiert und zur Post bringt. Auf dem Handy sind das 13 Zeilen. Ich habe zuerst nur den Anfang gelesen («Mahnungen, Nebenkostenabrechnungen …») und gedacht, hier gehe es nur um Post. Erst beim zweiten Lesen habe ich «Dokument hochladen» gefunden. «Seite des Mieters» ist kein Link. |
| A-2 | Minor | Dokumente, Filter «Mieter» auf einen Mieter ohne Dokumente (Hans Müller), Ansicht «Alle» | Dwello zeigt «Noch keine Dokumente» und «Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.» Darunter steht nur die Schaltfläche «Zu den Nebenkostenabrechnungen». Kurz dachte ich, alle Dokumente seien weg. Dabei fehlen nur die von Hans Müller. Die einzige Schaltfläche führt zu den Abrechnungen und nicht zu Hans Müller, wo ich ein Dokument hochladen könnte. |

## Beobachtungen

- **N-1:** Die Seite «Dokumente» steht in der Navigation unter «Nebenkosten». Ein Übergabeprotokoll oder einen Mietvertrag hätte ich eher unter «Verwalten» bei den Mietern gesucht. Gefunden habe ich «Dokumente» trotzdem schnell.
- **N-2:** Laut Einleitung erscheinen hier auch Nebenkostenabrechnungen. In der Übersicht stehen aber 9 bezahlte Abrechnungen, und keine davon taucht unter «Dokumente» auf. Ich weiss nicht, welche Abrechnungen hier hingehören.
- **N-3:** Der Mietername in einer Zeile ist auf dem Handy ein Link im Fliesstext und nur etwa 20 px hoch. Ich habe ihn mit dem Finger getroffen, aber knapp. Die Schaltfläche «Datei herunterladen» darunter ist 48 px hoch.
- **N-4:** Der Filter «Mieter» greift sofort beim Auswählen, ohne Schaltfläche, und ändert die Adresse (`?tenant=…`). Mit «Alle» und «Zu versenden» bleibt der Mieter gewählt. Mit «Zurück» im Browser ist er wieder da. Über die Navigation ist «Dokumente» wieder ungefiltert. So habe ich es erwartet.
- **N-5:** Auf dem Handy gibt es kein seitliches Scrollen (Breite 390 = 390). «Alle», «Zu versenden» und das Auswahlfeld sind 48 px hoch.
- **N-6:** Während meiner Runde haben andere Personas Dokumente hochgeladen, darunter zweimal «Mietvertrag Weber unterschrieben» und «Hausordnung-Sven». Die neuen stehen oben, das alte Übergabeprotokoll von 2023 ganz unten. Mit dem Filter «Mieter» war es sofort die einzige Zeile. Die fremden Datensätze zähle ich nicht als Befund.
- **N-7:** Auf der Seite des Mieters ist der Abschnitt «Dokument hochladen» klar beschriftet: Dateitypen, höchstens 10 MB, Titel optional mit Hilfetext. Auf dem Handy steht er ganz unten nach Kontaktdaten, Miete, Datenexport und Mietverträgen. Ich musste lange scrollen, habe ihn aber gefunden.

### Frühere Befunde (#677)

- **Anna P-3 (kein Weg zum Hochladen, kein Hinweis wo):** Teilweise behoben. Der Hinweis steht jetzt da, ist aber versteckt (A-1). Hochladen geht wie entschieden nur auf der Seite des Mieters. Dorthin komme ich jetzt über den Namen in jeder Zeile.
- **Anna P-4 (Name kein Link, kein Filter nach Mieter, alte Uploads weit unten):** Behoben. Der Name verlinkt auf den Mieter. Der Filter «Mieter» listet alle 10 Mieter nach Nachnamen. Ein altes Dokument finde ich über den Filter.
- **Weber P-4 (laut #677 dieselben Punkte):** Behoben wie Anna P-4. Den Wortlaut von Webers Bericht habe ich nicht gelesen, ich habe nur die Zusammenfassung in #677 geprüft.
- **Leeres «Zu versenden» (Marco 2):** Behoben. Es erscheinen «Keine Briefe zu versenden» und eine Erklärung, ohne Schaltfläche. Geprüft mit und ohne Filter auf einen Mieter.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, etwa 25 Schritte auf Desktop und Handy zusammen.

## Ablauf

- Desktop, «Dokumente» geöffnet. Erwartet: ein kurzer Satz, wofür die Seite ist und wo ich hochlade. Gesehen: ein langer Absatz über Briefe und Zahlungsfristen, der Hinweis zum Hochladen erst ganz am Ende (A-1).
- Filter «Mieter» auf «Hans Müller». Erwartet: «Keine Dokumente zu Hans Müller» und ein Weg zu ihm. Gesehen: «Noch keine Dokumente» und die Schaltfläche «Zu den Nebenkostenabrechnungen» (A-2).
- Navigation auf dem Desktop. Erwartet: «Dokumente» bei den Mietern. Gesehen: unter «Nebenkosten» (N-1).

## Vorschläge

- **A-1:** «Dokumente» öffnen. Den Satz zum Hochladen an den Anfang stellen oder als eigenen kurzen Absatz absetzen, z. B. «Ein Dokument laden Sie auf der Seite des Mieters unter «Dokument hochladen» hoch.» Die Erklärung zum Versenden gehört eher zu «Zu versenden».
- **A-2:** «Dokumente» öffnen, unter «Mieter» «Hans Müller» wählen. Ist ein Mieter gewählt, könnte der leere Zustand z. B. «Zu Hans Müller gibt es noch keine Dokumente.» sagen und auf seine Seite verlinken («Zu Hans Müller»), statt auf die Nebenkostenabrechnungen.

## Nicht geprüft

- Hochladen selbst: Ich sollte nur schauen.
- Eine «Zu versenden»-Ansicht mit Briefen: In den Demodaten gibt es keine, und ohne Speichern kann ich keine erzeugen.
- Den Filter mit der Tastatur (Pfeiltasten im Auswahlfeld, das sofort greift): Anna arbeitet mit Maus und Touch.
- Den Wortlaut von Weber P-4: Ich kenne nur die Zusammenfassung in #677.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/anna-677/`
