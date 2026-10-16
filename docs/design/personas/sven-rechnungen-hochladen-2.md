# Sven – Rechnungen hochladen und Beleg, Runde 2 (nur Tastatur, Bedienungsbaum)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur. Beurteilt wird, was der Bedienungsbaum von Chromium ansagt: Name, Wert, Beschreibung und Zustand des fokussierten Elements sowie die Live-Regionen (mitgeschrieben mit einem MutationObserver).
App: Persona-Stack auf http://localhost:3300, Demodaten. Ich habe nur geschaut und keine Rechnung erstellt und keinen Beleg gespeichert. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/sven-rechnungen-hochladen-2/`.

## Befunde

Bewertet habe ich nur, was die Änderung beantworten soll (Runde 1: P-1 bis P-9, P-12, P-13).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Rechnungen hochladen», Zeile «Notizen.docx» | Der Alert sagt jetzt «Zu dieser Datei. Dwello nimmt nur PDF-, JPG- und PNG-Dateien an …». Er kommt von selbst, während mein Fokus auf dem Dateiknopf liegt. Welche «diese Datei» gemeint ist, sagt er nicht. Das doppelte «Nicht möglich» aus Runde 1 (alt P-12) ist weg, aber der neue Titel ergibt nur Sinn, wenn man die Zeile sieht. |
| P-2 | Minor | Dialog, Öffnen | Der Dialog hat jetzt gar keine Beschreibung mehr. Beim Öffnen höre ich «Rechnungen hochladen, Dialog» und dann «Abbrechen». Den Einleitungssatz «Wählen Sie das Gebäude und die Dateien … Sie prüfen sie, bevor Dwello die Rechnungen erstellt.» und den Satz zum Beleg höre ich nur, wenn ich selbst im Lesemodus suche. Runde 1 (alt P-9) hatte zu viel; jetzt fehlt auch die Einleitung. |
| P-3 | Minor | Dialog, «Datei entfernen» | Der Fokus landet jetzt sauber auf «Dateien hierher ziehen oder auswählen» (alt P-4 gelöst). Es gibt aber keine Ansage, dass die Datei entfernt ist. Beim ersten Entfernen meldet die Status-Region nur «1 von 1 Dateien gelesen». Beim Entfernen der letzten Datei kommt gar nichts. |
| P-4 | Nit | Dialog, Ende des Lesens | Ich höre den Fortschritt («0 von 2 Dateien gelesen», «1 von 2 …», «2 von 2 …»). Das Ergebnis höre ich nicht: Dass «Elektro Blitz AG.pdf» geprüft werden muss, sagt «2 von 2 Dateien gelesen» nicht. Ich muss dazu durch die Zeilen tabben. |
| P-5 | Nit | Dialog, «Angaben prüfen», Rechnungsdatum | «Die KI ist unsicher. Bitte prüfen Sie den Wert.» ist jetzt mit dem Feld verbunden (alt P-2 gelöst). Der Satz steht aber am Ende einer langen Beschreibung, nach etwa 40 Wörtern Hilfetext. Wer die Beschreibung früh abbricht, verpasst ihn. |

Gelöst und ohne neuen Befund:

- **Alt P-1:** Die Knöpfe einer Zeile heissen weiterhin gleich, nennen aber ihre Datei und ihren Stand jetzt als Beschreibung. Zum Beispiel: «Datei entfernen, Knopf, Elektro Blitz AG.pdf Bitte prüfen» und «Datei entfernen, Knopf, Notizen.docx Nicht möglich». Dasselbe gilt für das Kontrollkästchen und für «Angaben prüfen».
- **Alt P-3:** Fortschritt hörbar (siehe P-4 oben).
- **Alt P-5:** Wenn ich «Beleg hinzufügen» ohne Datei drücke, springt der Fokus aufs Feld «Datei des Belegs». Ich höre «ungültig» und als Beschreibung «PDF, JPG oder PNG, höchstens 10 MB. Wählen Sie eine Datei.». Es geht keine Anfrage an den Server. Beim zweiten Drücken passiert dasselbe.
- **Alt P-6:** Tab geht im Kreis: vor der Gebäudewahl Abbrechen ↔ Gebäude (in beide Richtungen), nach der Wahl Gebäude → Dateiknopf → Abbrechen → Gebäude. Nach dem Hinzufügen der Dateien gehen 7 Elemente im Kreis, mit offenem Formular 20.
- **Alt P-7:** Das gesperrte «Gebäude» hat die Beschreibung «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.» Mit Tab erreiche ich es nicht, weil es gesperrt ist. Im Lesemodus höre ich es mit dem Grund. Nach dem Entfernen aller Dateien ist es wieder frei.
- **Alt P-8:** «Angaben prüfen» hat jetzt «reduziert», nach Enter «Angaben ausblenden, erweitert». Der Fokus bleibt auf dem Knopf.
- **Alt P-12:** Siehe P-1 oben.
- **Alt P-13:** Im Beleg-Bereich folgt auf die Überschrift «Beleg» jetzt direkt «Zu dieser Rechnung ist kein Beleg gespeichert.» und «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.». Ich höre «Beleg» nicht mehr doppelt. Im Dialog ist der Satz Teil der Einleitung und keine Bezeichnung ohne Feld mehr.
- **«Die KI hat diesen Wert nicht gefunden»:** beim Fälligkeitsdatum als Beschreibung angesagt: «Format TT.MM.JJJJ. Beispiel: 31.12.2026 Die KI hat diesen Wert nicht gefunden. Füllen Sie ihn aus, wenn er auf der Rechnung steht.»

## Beobachtungen

- Wenn ich «Angaben prüfen» öffne, meldet eine höfliche Live-Region dreimal hintereinander ein Datum: «Dienstag, 31. März 2026», «Donnerstag, 1. Januar 2026», «Dienstag, 31. März 2026». Das sind die Daten in Worten zu den drei vorbelegten Datumsfeldern. Ohne Zusammenhang klingt das wie Rauschen. Beim Fokus aufs jeweilige Feld stehen sie ohnehin in der Beschreibung.
- In der Zeile «Elektro Blitz AG.pdf» steht im Bild der Hinweis «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.». Er ist nicht in der Beschreibung der Knöpfe. Beim Tabben höre ich nur «Bitte prüfen», nicht welche Felder.
- Der Dateiknopf sagt auch mit zwei Dateien in der Liste «No file chosen» (englisch, vom Browser, wie alt P-10).
- Der erste Fokus im Dialog liegt weiterhin auf «Abbrechen» (wie alt P-14).
- Die Rückfrage «Hochladen abbrechen?» (per Escape) funktioniert wie in Runde 1. Der Fokus liegt zuerst auf «Weiter prüfen», und nach «Abbrechen und verwerfen» kehrt er auf «Rechnungen hochladen» zurück. Sind alle Dateien entfernt, schliesst «Abbrechen» den Dialog ohne Rückfrage. Das ist sinnvoll.
- Nach dem Öffnen einer Rechnung liegt der Fokus auf dem Dokument; die Routenansage meldet den Titel. Bis «Datei des Belegs» sind es 22 Tabs (wie in Runde 1).
- In der Rechnungsliste steht «Werke Schlussrechnung 2025, Allgemeinstrom Q1, Seepark Residenz, 31.03.2026» mit Beleg. Diesen Datensatz hat eine andere Persona angelegt. Ich habe ihn kurz geöffnet und nichts daran geändert. Den Beleg-Bereich habe ich an der Demo-Rechnung «ewl Energie Wasser Luzern, Fernwärme Q4 2025» geprüft. Den Hinweis «Rechnung schon abgerechnet …» aus Runde 1 sah ich dort diesmal nicht. Ob das an der Änderung liegt, kann ich nicht sagen.
- Werkzeug, nicht App: Ohne vorab registrierten Datei-Listener öffnete das erste Enter auf dem Dateiknopf in Playwright keine Dateiauswahl. Mit Listener öffnete jedes Enter und jede Leertaste sie zuverlässig. Daraus leite ich keinen Befund ab.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 9 Durchläufe (3 davon wegen des Werkzeug-Problems wiederholt). 18 Tabs ab der Rechnungsliste bis «Rechnungen hochladen», dann 1 Tab, 2 Pfeile, 1 Tab und Enter bis zur Dateiwahl. 36 Tabs bis zur Seepark-Rechnung «ewl … Fernwärme Q4 2025», dann 23 Tabs bis «Beleg hinzufügen».

## Ablauf

1. **Rechnungsliste, 18 Tabs zu «Rechnungen hochladen», Enter.** Erwartet: Der Dialog geht auf, ich höre seinen Namen und kurz, worum es geht. Gesehen: «Rechnungen hochladen, Dialog», Fokus auf «Abbrechen», keine Beschreibung (P-2).
2. **Tab und Umschalt+Tab vor der Gebäudewahl.** Erwartet: Der Fokus läuft im Kreis. Gesehen: Abbrechen ↔ Gebäude in beide Richtungen, kein Hängen.
3. **Gebäude, zweimal Pfeil nach unten.** Erwartet: «Seepark Residenz – Seeweg 15, 6003 Luzern». Gesehen: genau so. Danach läuft Tab Gebäude → Dateiknopf → Abbrechen → Gebäude im Kreis.
4. **Dateiknopf, Enter, beide Dateien gewählt.** Erwartet: Ich höre den Fortschritt und das Ergebnis. Gesehen: Die Status-Region meldet «0 von 2», «1 von 2», «2 von 2 Dateien gelesen», dazu der Alert «Zu dieser Datei Dwello nimmt nur PDF-, JPG- und PNG-Dateien an …» (P-1). Dass Elektro Blitz geprüft werden muss, wird nicht angesagt (P-4). Der Fokus bleibt auf dem Dateiknopf. Screenshot `02-dateien.png`: Zeile «Elektro Blitz AG.pdf» mit gelber Marke «Bitte prüfen» und gelbem Hinweis «Zu dieser Datei / Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.», darunter Zeile «Notizen.docx» mit roter Marke «Nicht möglich».
5. **Tab durch die Zeilen.** Erwartet: Jedes Element nennt seine Datei. Gesehen: «Diese Rechnung erstellen, angekreuzt, Elektro Blitz AG.pdf Bitte prüfen», «Angaben prüfen, reduziert, Elektro Blitz AG.pdf Bitte prüfen», «Datei entfernen, Elektro Blitz AG.pdf Bitte prüfen», «Datei entfernen, Notizen.docx Nicht möglich», «Abbrechen», «1 Rechnung erstellen», danach zurück zum Dateiknopf. Gut.
6. **Umschalt+Tab vom Dateiknopf.** Erwartet: «Gebäude» oder etwas davor. Gesehen: «1 Rechnung erstellen». «Gebäude» ist gesperrt und nicht im Tab-Kreis. Im Bedienungsbaum hat es die Beschreibung «Das Gebäude gilt für alle Dateien. Entfernen Sie die Dateien, um ein anderes zu wählen.». Gut.
7. **«Angaben prüfen», Enter.** Erwartet: «erweitert». Gesehen: «Angaben ausblenden, erweitert», Fokus bleibt. Dazu kommen drei unerwartete Datumsansagen aus einer Live-Region (siehe Beobachtungen). Screenshot `03-angaben.png`.
8. **Tab durchs Formular.** Erwartet: Bei unsicheren und fehlenden Werten höre ich den KI-Hinweis. Gesehen: Beim Rechnungsdatum steht «… Format TT.MM.JJJJ. Beispiel: 31.12.2026 Die KI ist unsicher. Bitte prüfen Sie den Wert. Dienstag, 31. März 2026» (am Ende, P-5). Beim Fälligkeitsdatum steht «… Die KI hat diesen Wert nicht gefunden. Füllen Sie ihn aus, wenn er auf der Rechnung steht.». Gut.
9. **«Datei entfernen» bei Notizen.docx (und in einem zweiten Durchlauf bei Elektro Blitz zuerst).** Erwartet: Der Fokus geht an eine sinnvolle Stelle, und ich höre «entfernt». Gesehen: Der Fokus liegt beide Male auf dem Dateiknopf. Angesagt wird nur «1 von 1 Dateien gelesen». Beim Entfernen der letzten Datei kommt keine Ansage, der Fokus liegt wieder auf dem Dateiknopf, und «Gebäude» ist wieder frei (P-3). Screenshots `04-entfernt-first.png`, `04-entfernt-second.png`.
10. **Abbrechen (Escape) mit Dateien.** Erwartet: eine Rückfrage. Gesehen: «Hochladen abbrechen?», Fokus auf «Weiter prüfen». Nach Tab und Enter auf «Abbrechen und verwerfen» liegt der Fokus auf «Rechnungen hochladen».
11. **Rechnung «ewl Energie Wasser Luzern, Fernwärme Q4 2025, Seepark Residenz» geöffnet, 23 Tabs bis «Beleg hinzufügen», Enter ohne Datei.** Erwartet: Ich höre den Fehler oder lande am Feld. Gesehen: Der Fokus springt auf «Datei des Belegs», das Feld ist «ungültig» mit der Beschreibung «PDF, JPG oder PNG, höchstens 10 MB. Wählen Sie eine Datei.». Es ging keine Anfrage an den Server. Screenshot `06-beleg-fehler.png`.

## Verwirrung

- «Zu dieser Datei» als Ansage ohne Dateinamen: Zu welcher?
- «1 von 1 Dateien gelesen» direkt nach «Datei entfernen» klingt, als sei eine Datei neu gelesen worden, nicht, als sei eine weg.
- Die drei Datumsansagen beim Aufklappen kommen ohne Feld dazu.

## Fehlerrisiken

- Ich überhöre «Die KI ist unsicher», weil der Satz hinter dem langen Hilfetext kommt, und übernehme ein falsches Rechnungsdatum (P-5).
- Wenn ich mehrere Dateien gleichzeitig hochlade und nur den Alert höre, weiss ich nicht, welche Datei abgelehnt wurde (P-1).

## Vorschläge

- **P-1:** Dialog öffnen, Seepark Residenz wählen, «Elektro Blitz AG.pdf» und «Notizen.docx» wählen und die Live-Regionen beobachten. Hilft: den Dateinamen in den Alert aufnehmen, zum Beispiel «Notizen.docx: Dwello nimmt nur PDF-, JPG- und PNG-Dateien an …». Oder den Titel nur im Bild zeigen und für den Screenreader durch den Dateinamen ersetzen.
- **P-2:** Dialog öffnen. Hilft: `aria-describedby` auf den ersten Einleitungssatz setzen («Wählen Sie das Gebäude und die Dateien Ihrer Rechnungen. …»), nicht auf den ganzen Inhalt.
- **P-3:** Zwei Dateien hinzufügen und nacheinander beide mit «Datei entfernen» entfernen. Hilft: in der Status-Region «Notizen.docx entfernt.» melden, auch wenn es die letzte Datei war.
- **P-4:** Dateien hinzufügen und auf die letzte Statusmeldung achten. Hilft: zum Schluss melden «2 von 2 Dateien gelesen: 1 bitte prüfen, 1 nicht möglich.».
- **P-5:** «Angaben prüfen» öffnen und Tab zum Rechnungsdatum. Hilft: den KI-Hinweis in `aria-describedby` an die erste Stelle setzen, vor den Hilfetext.

## Nicht geprüft

- Rechnungen erstellen und einen Beleg speichern: Die Aufgabe lautete «nur schauen». Was nach dem Erstellen angesagt wird, kenne ich darum nicht.
- Abwählen von «Diese Rechnung erstellen» (alt P-11) war nicht Teil der Aufgabe.
- Echte Sprachausgabe (NVDA, VoiceOver): Beurteilt habe ich den Bedienungsbaum von Chromium und die Live-Regionen. Ob ein Screenreader die schnell aufeinanderfolgenden Statusmeldungen «0 von 2», «1 von 2» und «2 von 2» alle vorliest oder nur die letzte, hängt vom Screenreader ab.
- Die Kalender-Knöpfe und das Ziehen und Ablegen von Dateien (nicht nötig für die Aufgabe).
