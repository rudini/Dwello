# Sven – Rechnungen hochladen (Slice 233)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum (Name, Rolle, Beschreibung über CDP) und an den Live-Regionen (aufgezeichnet mit einem MutationObserver auf `role=status`, `role=alert` und `aria-live`). Dateien habe ich über den Dateidialog des Browsers gewählt, nachdem ich die Schaltfläche mit Enter ausgelöst hatte. Ich habe nichts gespeichert: Vor dem Klick auf die Schaltfläche zum Erstellen hat mein Skript geprüft, dass sie «0 Rechnungen erstellen …» heisst, sonst hätte es abgebrochen.

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/sven-233/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Zeile «Hauswart Q1 ohne KI.pdf», nach «0 Rechnungen erstellen» | Beim ersten Druck auf die Schaltfläche zum Erstellen höre ich «Bitte geben Sie ein Datum ein» zweimal direkt nacheinander: einmal aus einer Live-Region mit `aria-live="assertive"` und einmal in der Beschreibung des Felds Rechnungsdatum, auf das der Fokus springt. |
| P-2 | Minor | dieselbe Zeile, Rechnungsdatum nach einer falschen und dann gelöschten Eingabe | Ich tippe «31.13.2026» ein, verlasse das Feld, lösche es wieder und verlasse es noch einmal. Die Live-Region sagt dann «Bitte geben Sie ein Datum ein». Das Feld ist danach aber nicht mehr ungültig (`invalid=false`), seine Beschreibung enthält keinen Fehler, und auch sichtbar steht kein Fehler da. Bei einem neuen Druck auf die Schaltfläche zum Erstellen springt der Fokus zu «Betrag». Das leere Pflichtfeld Rechnungsdatum wird nicht mehr gemeldet. Ich höre also einen Fehler, den ich nirgends finde. |
| P-3 | Nit | Rechnungen hochladen, beim Öffnen | Nach dem Öffnen steht der Fokus auf «Abbrechen» und nicht auf dem ersten Feld «Gebäude». Ich muss erst einmal Tab drücken, bevor ich etwas tun kann. |

## Beobachtungen

- Die Dateiauswahl ist eine Schaltfläche mit dem Wert «No file chosen» (englisch). Den Text erzeugt der Browser für das Datei-Eingabefeld, er bleibt auch nach der Auswahl stehen. In einem deutschen Browser stünde dort wohl «Keine ausgewählt». Ein Screenreader liest den Wert trotzdem mit vor.
- Der zweite Einleitungsabsatz («Dwello speichert die Datei jeder erstellten Rechnung als Beleg …») gehört nicht zur Beschreibung des Dialogs. Ich höre ihn nur, wenn ich im Lesemodus durch den Dialog gehe.
- Nach jeder Entfernung springt der Fokus auf «Dateien hierher ziehen oder auswählen» und nicht in die nächste Zeile. Danach steht in der Statuszeile nur noch «… entfernt.», und die Zusammenfassung (wie viele bleiben, wie viele sind zu prüfen) ist weg.
- Sind alle Dateien entfernt, kann ich «Gebäude» wieder bedienen. Angesagt wird das nicht, ich merke es erst am Feld selbst.
- In der Ansicht «Angaben prüfen» stehen im Baum mehrere leere Absätze (unter den Datumsfeldern), offenbar leere Platzhalter für Fehler. Ein Screenreader liest dort nichts vor, beim Pfeilen im Lesemodus können sie aber als leere Zeilen auftauchen.
- Im Accessibility-Snapshot zeigt die Kategorie-Auswahl der Elektro-Blitz-Zeile nur die Option «Kategorie auswählen», obwohl der Wert «Allgemeinstrom» ist. Ob das an Optionsgruppen oder am Snapshot liegt, habe ich nicht geprüft.
- Die Hinweisbox sagt «Füllen Sie die markierten Felder aus.» Für mich bedeutet «markiert», dass ein Feld als «ungültig» angesagt wird. Das funktioniert, das Wort ist aber vom Sehen her gedacht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten mit 9 Skriptläufen. Zweimal ist der Dateidialog nicht aufgegangen, weil mein Skript das Gebäude zu schnell gewählt hatte. Danach habe ich die Auswahl im Skript geprüft. An Dwello lag das nicht.

## Ablauf

1. **Dialog öffnen.** Vom Menü «Rechnungen» aus bin ich mit Tab zu «Rechnungen hochladen» gegangen und habe Enter gedrückt.
   Erwartet: Ich höre den Namen des Dialogs, eine kurze Erklärung und lande auf dem ersten Feld.
   Gesehen: «Rechnungen hochladen, Dialog. Wählen Sie das Gebäude und die Dateien Ihrer Rechnungen. Die KI liest die Angaben aus; Sie prüfen sie, bevor Dwello die Rechnungen erstellt.» Danach höre ich «Abbrechen, Schaltfläche» (P-3). Tab und Shift+Tab bleiben im Dialog, solange die Dateiauswahl gesperrt ist: «Gebäude», «Abbrechen», «Gebäude» usw. Die gesperrte Dateiauswahl hat im Baum den Hinweis «Wählen Sie zuerst das Gebäude.». Mit den Pfeiltasten habe ich «Seepark Residenz – Seeweg 15, 6003 Luzern» gewählt.
2. **Drei Dateien wählen.** Auf «Dateien hierher ziehen oder auswählen» (Beschreibung: «PDF, JPG oder PNG, je höchstens 10 MB, bis zu 20 Dateien auf einmal. Ausgewählte Dateien liest die KI sofort aus.») habe ich Enter gedrückt und im Dateidialog die drei Dateien gewählt.
   Erwartet: Ich höre den Fortschritt, am Schluss eine Zusammenfassung und zu jedem Problem den Namen der Datei.
   Gesehen (in der zeitlichen Reihenfolge, Status höflich angesagt):
   - +0,26 s Status «0 von 3 Dateien gelesen»
   - gleich danach ein Alert, neu eingefügt: «Hinweise zu Notizen.docx. Dwello nimmt nur PDF-, JPG- und PNG-Dateien an. Speichern Sie die Datei als PDF und wählen Sie sie erneut.»
   - Status «1 von 3 Dateien gelesen», +0,54 s «2 von 3 Dateien gelesen», +0,8 s «3 von 3 Dateien gelesen. Bitte prüfen: 2. Nicht möglich: 1.»

   Der Fokus bleibt auf der Dateiauswahl. Die Hinweise zu Elektro Blitz («Prüfen Sie: Rechnungsdatum.», «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.») und zu Hauswart («Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.», «Wählen Sie eine Kategorie.») werden nicht live angesagt. Im Lesemodus beginnen sie aber jeweils mit «Hinweise zu <Dateiname>». Jeder Hinweis sagt also, um welche Datei es geht. Auch die Bedienelemente der Zeilen nennen die Datei in ihrer Beschreibung, zum Beispiel «Diese Rechnung erstellen, Kontrollkästchen, aktiviert, Elektro Blitz AG.pdf Bitte prüfen» oder «Datei entfernen, Notizen.docx Nicht möglich». Das ist gut.
3. **Entfernen.** Erst «Datei entfernen» bei Notizen.docx, dann bei Elektro Blitz, dann bei Hauswart.
   Erwartet: Jede Entfernung wird mit dem Dateinamen angesagt.
   Gesehen: Status «Notizen.docx entfernt.», «Elektro Blitz AG.pdf entfernt.», «Hauswart Q1 ohne KI.pdf entfernt.». Jede Entfernung wird angesagt. Der Fokus springt jedes Mal auf die Dateiauswahl (siehe Beobachtungen). Am Schluss heisst die Schaltfläche «0 Rechnungen erstellen» und ist gesperrt.
4. **«Angaben prüfen» bei Elektro Blitz.** Die drei Dateien habe ich neu gewählt.
   Erwartet: Die Schaltfläche wird zu «ausgeklappt». Am Rechnungsdatum höre ich zuerst den Hinweis der KI.
   Gesehen: Die Schaltfläche heisst danach «Angaben ausblenden, ausgeklappt». Mit Tab geht es weiter zu «Datei entfernen», dann zum Link «Datei gross anzeigen (öffnet in neuem Tab)» mit der Beschreibung «Elektro Blitz AG.pdf», dann zu «Rechnungsnummer (optional)», Wert R-1001. Beim Rechnungsdatum (Pflichtfeld, Wert 31.03.2026) lautet die Beschreibung in dieser Reihenfolge: «**Die KI ist unsicher. Bitte prüfen Sie den Wert.** Übernehmen Sie das Datum von der Rechnung, nicht das heutige. Ohne Leistungszeitraum bestimmt es, in welche Abrechnungsperiode die Rechnung fällt. Format TT.MM.JJJJ. Beispiel: 31.12.2026. Dienstag, 31. März 2026». Ich höre den Hinweis der KI also zuerst. Das passt. Beim Fälligkeitsdatum steht «Die KI hat diesen Wert nicht gefunden …» ebenfalls vorne.
5. **Nur Hauswart angehakt, Erstellen.** Bei Elektro Blitz habe ich mit der Leertaste den Haken entfernt. Hauswart blieb angehakt, Notizen.docx hat kein Kontrollkästchen. Die Schaltfläche hiess «0 Rechnungen erstellen (1 unvollständig)», dort habe ich Enter gedrückt.
   Erwartet: Ich lande beim ersten Fehler und höre ihn einmal.
   Gesehen: Nichts wurde gespeichert, die Adresse blieb /invoices. Die Zeile Hauswart klappte auf, und der Fokus sprang auf «Rechnungsdatum, ungültig, Pflichtfeld». Zugleich fügte die Seite eine Live-Region mit `aria-live="assertive"` ein, die «Bitte geben Sie ein Datum ein» ansagte. Die Beschreibung des Felds endet ebenfalls mit «Bitte geben Sie ein Datum ein». **Jetzt: zweimal** (P-1).
   **Später, wenn ich wieder hinkomme:** Komme ich mit Tab oder Shift+Tab zum Feld, höre ich den Fehler **einmal**, in der Beschreibung. Es kommt keine neue Live-Ansage. Beim zweiten Druck auf die Schaltfläche zum Erstellen gibt es keine Live-Ansage mehr, ich höre den Fehler über den Fokus wieder einmal. Im Lesemodus, wenn ich Zeile für Zeile lese, kommt der Text zweimal: einmal beim Feld (Beschreibung) und einmal als Absatz nach «Kalender für Rechnungsdatum öffnen». Das kenne ich so und finde es in Ordnung.
   Zusätzlich habe ich «31.13.2026» eingegeben und das Feld verlassen. Assertive angesagt: «Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2026.» Das ist gut. Dann habe ich das Feld geleert und verlassen, daraus wurde P-2.

## Verwirrung

- Bei P-2 höre ich «Bitte geben Sie ein Datum ein». Ich gehe zurück zum Rechnungsdatum, und dort ist weder Fehler noch «ungültig». Ich weiss nicht, zu welchem Feld die Ansage gehörte.
- «Bitte prüfen: 2. Nicht möglich: 1.» Die Zusammenfassung zählt nur, welche Dateien es sind, muss ich in der Liste suchen. Weil die Bedienelemente der Zeilen Name und Status tragen, geht das aber.
- «Füllen Sie die markierten Felder aus»: siehe Beobachtungen.

## Fehlerrisiken

- P-2: Wenn das Datumsfeld nach dem Löschen nicht mehr als Fehler gilt, könnte das leere Rechnungsdatum nach dem Ausfüllen der übrigen Felder durchrutschen oder erst beim Speichern scheitern. Das habe ich nicht geprüft, weil ich nicht speichern durfte.
- P-1: Wenn ich dieselbe Meldung zweimal direkt hintereinander höre, denke ich schnell, es gäbe zwei Fehler.

## Vorschläge

- **P-1:** Ablauf: «Rechnungen hochladen», Seepark Residenz, die drei Dateien wählen, bei Elektro Blitz den Haken entfernen, «0 Rechnungen erstellen (1 unvollständig)» drücken. Zu hören ist «Bitte geben Sie ein Datum ein» aus der Live-Region und noch einmal in der Beschreibung des fokussierten Felds. Was helfen würde: Beim Absenden reicht der Fokus mit `aria-describedby` auf das erste fehlerhafte Feld. Die assertive Live-Ansage sollte nur beim Verlassen eines Felds kommen und nicht, wenn der Fokus ohnehin auf das Feld springt.
- **P-2:** Ablauf wie bei P-1, dann ins Rechnungsdatum «31.13.2026» tippen, Tab drücken, mit Shift+Tab zurück, das Feld leeren, Tab drücken, mit Shift+Tab zurück. Die Live-Ansage lautet «Bitte geben Sie ein Datum ein», das Feld ist aber nicht ungültig und hat keine Fehlerbeschreibung, auch sichtbar steht kein Fehler (Screenshot `09-datum-geleert.png`: leeres Feld mit Fokusrahmen, ohne Fehlertext). Ein neues Erstellen springt zu «Betrag». Was helfen würde: Fehler-Absatz, `aria-invalid` und `aria-describedby` sollten aus demselben Zustand kommen wie die Live-Ansage. Das geleerte Pflichtfeld müsste wieder als ungültig gelten und beim Erstellen gemeldet werden.
- **P-3:** Den Dialog öffnen und den Fokus prüfen. Was helfen würde: Den Anfangsfokus auf «Gebäude» setzen, das erste Feld, das ich ausfüllen muss.

## Nicht geprüft

- Ein echter Screenreader (NVDA, JAWS, VoiceOver): Ich habe den Accessibility-Baum und die Änderungen der Live-Regionen aufgezeichnet. Ob ein Screenreader die schnell aufeinander folgenden Status-Ansagen («0 von 3» bis «3 von 3») alle vorliest oder ob der Alert sie unterbricht, kann ich so nicht sagen.
- Ob das leere Rechnungsdatum nach P-2 beim Speichern durchkommt: Ich durfte nichts speichern.
- Ziehen und Ablegen von Dateien: Das geht nicht mit der Tastatur und gehört nicht zu meiner Rolle.
- Der Link «Datei gross anzeigen»: Ich habe nur seinen Namen geprüft, den neuen Tab nicht geöffnet.
