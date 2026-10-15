# Persona Marco – Dokument-Upload beim Mieter, Runde 2 (upload174-2)

Marco, 38, Handy 390 × 844, Touch. Aufgabe: Foto der Ausweiskopie (IMG_2041.jpg) bei Marco Bernasconi (Seepark Residenz) mit dem Titel «Ausweiskopie» ablegen, darauf achten, wo ich danach auf der Seite stehe. Dann das vorhandene Übergabeprotokoll öffnen und unter «Dokumente» › «Zu versenden» nachsehen, was dort steht.

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ef0e447-cbd4-5868-810d-381376519773/scratchpad/marco-upload174-2/`

## Stand der Befunde aus Runde 1

| ID | Runde 1 | Stand jetzt |
|---|---|---|
| P-1 | Major: Link «PDF»/«JPG», 31 × 24 px, direkt neben «Löschen», lädt herunter | **Behoben.** Der Link ist jetzt ein Knopf «Datei herunterladen» mit Symbol, 233 × 48 px. Darunter, in eigener Zeile, steht «Löschen» (146 × 48 px), 16 px Abstand. Für den Screenreader heisst er «Datei herunterladen: Übergabeprotokoll Wohnung B2». Er lädt weiterhin herunter, das sagt der Knopf jetzt aber ehrlich. |
| P-3 | Minor: Leertext «Zu versenden» versprach hochgeladene Dokumente | **Behoben.** Der Leertext lautet jetzt «Keine Briefe zu versenden. Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.» Das passt: Meine Ausweiskopie ist kein Brief. Der Knopf «Zu den Nebenkostenabrechnungen» steht weiterhin darunter (siehe Beobachtungen). |
| P-4 | Minor: Seite sprang nach dem Hochladen ganz nach oben | **Behoben.** Nach dem Hochladen stehe ich auf der Karte «Dokumente». Oben im Bild steht die Überschrift «Dokumente», direkt darunter die neue «Ausweiskopie, Hochgeladen am 14.10.2026». Die Meldung «Dokument «Ausweiskopie» hochgeladen» erscheint unten. |

## Neue Befunde zu den geänderten Zuständen

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde zu den geänderten Zuständen. |

## Beobachtungen

- Auf «Zu versenden» steht unter dem Leertext weiterhin der Knopf «Zu den Nebenkostenabrechnungen». Wenn ich wissen will, ob ich etwas verschicken muss, brauche ich ihn nicht. Er ist der einzige grosse dunkle Knopf auf der Seite und lenkt ab. (In Runde 1 war das Teil von P-3.)
- Nach dem Hochladen liegt die Erfolgsmeldung unten über dem Bereich «Datei» des Formulars. Das stört nicht, weil das neue Dokument oben sichtbar ist.
- Nach dem Hochladen liegt der Fokus auf dem (jetzt leeren) Feld «Datei». Für mich als Touch-Nutzer unwichtig.
- Der Hilfetext beim Titel heisst jetzt «Ohne Titel heisst das Dokument wie die Datei, ohne Endung.» Ein Beispiel wie «Ausweiskopie» fehlt weiterhin (P-2 aus Runde 1, diesmal nicht bewertet).
- Unter «Dokumente» › «Alle» stehen die Einträge weiterhin ohne Hinweis, ob sie versendet werden müssen (P-6 aus Runde 1, nicht bewertet).
- Das Dateifeld zeigt «Choose File» auf Englisch, vermutlich das Feld des Test-Browsers.
- Unter «Alle» steht ausserdem «Mietvertrag unterschrieben» zu Laura Keller. Er stammt von einer anderen Persona, ich habe ihn nicht angefasst.
- Auf beiden Seiten lässt sich nichts zur Seite scrollen (Seitenbreite 390 px).

## Aufgabe geschafft: ja

## Aufwand

Etwa 2 Minuten, 9 Schritte: Mieter → Marco Bernasconi → nach unten zur Karte «Dokumente» → Datei wählen → Titel «Ausweiskopie» → «Dokument hochladen» → «Datei herunterladen» beim Übergabeprotokoll → Menü → Dokumente → «Zu versenden».

## Ablauf

1. **Mieter → Marco Bernasconi.** Erwartet: seine Seite. Gesehen: Die Mieterliste zeigt ihn zuoberst («Wohnung B2 - Seepark Residenz, Aktiv»). Ein Tippen auf den Namen öffnet seine Seite.
2. **Karte «Dokumente».** Erwartet: das Übergabeprotokoll und das Formular. Gesehen (Screenshot 05): «Übergabeprotokoll Wohnung B2, Hochgeladen am 30.06.2023», darunter ein umrandeter Knopf «Datei herunterladen», in eigener Zeile ein rotes «Löschen». Darunter «Dokument hochladen» mit Datei, Titel (optional) und dem Knopf «Dokument hochladen». Klar und gut mit dem Daumen zu treffen.
3. **Datei wählen, Titel «Ausweiskopie» eintippen, «Dokument hochladen».** Erwartet: Bestätigung, und dass ich das neue Dokument sehe. Gesehen (Screenshot 06): Die Seite steht auf der Karte «Dokumente». Ganz oben steht «Ausweiskopie, Hochgeladen am 14.10.2026», darunter das Übergabeprotokoll. Unten erscheint «Dokument «Ausweiskopie» hochgeladen». Genau so wollte ich es.
4. **Übergabeprotokoll öffnen.** Erwartet: Wenn der Knopf «Datei herunterladen» heisst, wird die Datei heruntergeladen. Gesehen: «Uebergabeprotokoll-B2.pdf» wird heruntergeladen, die Seite bleibt stehen. Das passt zum Knopf. Die PDF selbst sehe ich auf dem Handy dann im Download-Ordner.
5. **Menü → Dokumente.** Erwartet: meine Ausweiskopie in der Liste. Gesehen (Screenshot 09): Unter «Alle» steht zuoberst «Ausweiskopie – Zu Marco Bernasconi, hochgeladen am 14.10.2026» mit «Datei herunterladen».
6. **«Zu versenden».** Erwartet: eine klare Antwort, ob ich etwas verschicken muss. Gesehen (Screenshot 10): Der Filter «Zu versenden» ist hervorgehoben, darunter ein Briefsymbol und «Keine Briefe zu versenden». Darunter: «Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.» Jetzt ist mir klar: Ich muss nichts versenden, und die Ausweiskopie gehört nicht hierher. Darunter der Knopf «Zu den Nebenkostenabrechnungen».

## Verwirrung

- Keine bei den geänderten Zuständen. «Datei herunterladen» und «Keine Briefe zu versenden» verstehe ich sofort.
- Der Knopf «Zu den Nebenkostenabrechnungen» auf der leeren Liste «Zu versenden»: Ich weiss nicht, warum ich jetzt dorthin soll.

## Fehlerrisiken

- «Löschen» steht jetzt in eigener Zeile unter «Datei herunterladen». Daneben vertippt man sich kaum noch. Der Löschdialog kommt zusätzlich (in Runde 1 geprüft).
- Keine neuen Risiken gesehen.

## Vorschläge

- **P-1, P-3, P-4:** behoben, nichts mehr nötig.
- Beobachtung zum Knopf auf «Zu versenden»: Den Knopf weglassen, oder einen nehmen, der zur Frage passt (z. B. «Alle Dokumente ansehen»).

## Nicht geprüft

- Wie ein echtes Handy die heruntergeladene PDF anzeigt; im Test-Browser kommt nur ein Download.
- Ein zweites Hochladen, um die Position nach dem Hochladen noch einmal zu messen: Das hätte eine doppelte Ausweiskopie erzeugt. Ich habe nur einmal hochgeladen und mich auf den Bildschirmausschnitt direkt danach gestützt (Screenshot 06). Eine spätere Messung nach einem Ganzseiten-Screenshot zeigte eine andere Position; das halte ich für eine Folge dieses Screenshots, nicht der App.
- Fehlerfälle beim Hochladen: Der Aufrufer hat keinen fehlschlagenden Request genannt.
