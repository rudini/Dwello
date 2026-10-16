# Sven – Rechnungen hochladen und Beleg (nur Tastatur, Bedienungsbaum)

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur; beurteilt wird, was der Bedienungsbaum (Accessibility-Tree) ansagt: Name, Wert, Beschreibung, Zustand des fokussierten Elements und Live-Regionen.
App: Persona-Stack auf http://localhost:3300, Demodaten. Ich habe nur geschaut: keine Rechnung erstellt, keinen Beleg gespeichert. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/sven-rechnungen-hochladen/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Rechnungen hochladen», Dateizeilen | In den Zeilen nennt kein Bedienelement seine Datei: Ich höre «Diese Rechnung erstellen, Kontrollkästchen», «Angaben prüfen», «Datei entfernen» und gleich danach nochmals «Datei entfernen». Welche Datei gemeint ist, erfahre ich beim Tabben nicht. |
| P-2 | Major | Dialog, «Angaben prüfen» | Der Hinweis «Die KI ist unsicher. Bitte prüfen Sie den Wert.» steht im Bild unter dem Feld Rechnungsdatum, ist aber nicht mit dem Feld verbunden. Beim Feld höre ich nur «Rechnungsdatum, 31.03.2026, Übernehmen Sie das Datum … Dienstag, 31. März 2026», die Unsicherheit der KI nicht. Auch die Marke «Bitte prüfen» an der Zeile ist mit nichts verbunden. |
| P-3 | Major | Dialog, nach dem Hinzufügen der Dateien | Das Ergebnis des Auslesens wird nicht angesagt. Angesagt wird nur der Fehler zu «Notizen.docx» (role=alert). Dass «Elektro Blitz AG.pdf» fertig ausgelesen ist und geprüft werden muss, kommt nicht an; die Status-Region bleibt die ganze Zeit leer. |
| P-4 | Major | Dialog, «Datei entfernen» | Nach «Datei entfernen» geht der Fokus verloren (er liegt auf dem Dokument, kein Element hat ihn). Es gibt keine Ansage, dass die Datei entfernt ist. |
| P-5 | Major | Beleg auf der Rechnungsseite | Wenn ich «Beleg hinzufügen» ohne Datei drücke, erscheint «Wählen Sie eine Datei.». Der Fokus bleibt aber auf dem Knopf und nichts wird angesagt. Ich höre gar nichts und denke, es sei gespeichert worden. Erst wenn ich mit Umschalt+Tab zurück aufs Dateifeld gehe, höre ich «ungültig» und den Fehler. |
| P-6 | Minor | Dialog, Fokusfalle | Am Rand der Fokusfalle bleibt Tab hängen, statt herumzulaufen. Vor der Gebäudewahl bleibt Tab auf «Gebäude» stehen, und Umschalt+Tab bleibt auf «Abbrechen» stehen. Nach dem Hinzufügen der Dateien bleibt Tab auf «1 Rechnung erstellen» stehen (getestet: 20 Tabs, keine Bewegung). Ohne Ansage wirkt das, als hänge die Tastatur. |
| P-7 | Minor | Dialog, Gebäude | Nach dem Hinzufügen der Dateien ist «Gebäude» gesperrt. Ich höre «Gebäude, gesperrt», aber nicht warum und wie ich das Gebäude wieder wechseln kann. |
| P-8 | Minor | Dialog, «Angaben prüfen» | Der Knopf heisst danach «Angaben ausblenden», hat aber kein `aria-expanded`. Dass darunter ein Formular aufgegangen ist, merke ich nur am neuen Namen. Gut ist: Der Fokus bleibt auf dem Knopf. |
| P-9 | Minor | Dialog, Öffnen | Die Beschreibung des Dialogs liest den ganzen Inhalt vor, auch die Feldtexte: «… Beleg Bewahren Sie … Gebäude Gebäude auswählen Dateien hierher ziehen oder auswählen Wählen Sie zuerst das Gebäude.» Das ist lang und doppelt sich mit dem, was ich danach beim Tabben höre. |
| P-10 | Minor | Dialog, Dateiknopf | Auch nachdem zwei Dateien in der Liste stehen, sagt der Dateiknopf «No file chosen» (englisch, vom Browser). Das widerspricht der Liste darunter. |
| P-11 | Minor | Dialog, Kontrollkästchen | Wenn ich «Diese Rechnung erstellen» abwähle, wird der Hauptknopf zu «0 Rechnungen erstellen». Das wird nicht angesagt. |
| P-12 | Nit | Dialog, Zeile «Notizen.docx» | «Nicht möglich» höre ich zweimal: als Marke und als Titel des Alerts. |
| P-13 | Nit | Dialog und Beleg-Bereich | Der Hinweis hat den Titel «Beleg» als einfachen Absatz. Auf der Rechnungsseite folgt er direkt auf die Überschrift «Beleg», also höre ich «Beleg» zweimal hintereinander. Im Dialog klingt der Absatz «Beleg» wie eine Feldbezeichnung ohne Feld. |
| P-14 | Nit | Dialog, Öffnen | Der erste Fokus liegt auf «Abbrechen», nicht auf «Gebäude». Das ist sicher, aber ich muss erst tabben, um anzufangen. |

## Beobachtungen

- Die Rückfrage beim Abbrechen funktioniert gut. Sie heisst «Hochladen abbrechen?», sagt «Hochgeladene Dateien und Ihre Eingaben gehen verloren.», und der Fokus liegt zuerst auf dem sicheren «Weiter prüfen». Tab läuft sauber zwischen den beiden Knöpfen herum. Der Dialog dahinter ist `inert` (nicht erreichbar). Escape in der Rückfrage bringt den Fokus zurück auf «Abbrechen». Nach «Abbrechen und verwerfen» landet der Fokus auf «Rechnungen hochladen», und der Dialog ist beim nächsten Öffnen leer. Das ist so, wie ich es erwarte.
- Escape im Upload-Dialog öffnet ebenfalls die Rückfrage. Gut.
- Die Felder unter «Angaben prüfen» sind sonst sauber beschriftet: Name, Wert, Hilfetext als Beschreibung, Pflicht/optional, das Datum zusätzlich in Worten («Dienstag, 31. März 2026»). Der Leistungszeitraum ist eine Gruppe. Kategorie «Allgemeinstrom» ist vorbelegt.
- «Vorschau von Elektro Blitz AG.pdf» ist ein Bild mit Namen. Gut.
- Nach dem Öffnen einer Rechnung liegt der Fokus auf dem Dokument; die Routenansage meldet den Seitentitel. Von dort sind es 22 Tabs bis zum Beleg-Bereich, und ein Sprung zu «Beleg» geht nur über die Überschriften. Das betrifft alle Seiten, nicht diese Änderung.
- In der Rechnungsliste stand oben «Werke Schlussrechnung 2025 … Seepark Residenz», erfasst am 16.10.2026. Das hat vermutlich eine andere Persona angelegt. Ich habe den Datensatz nur angesehen (Beleg mit Datei: «Werke Schlussrechnung 2025.pdf», Link «Beleg anzeigen», Knopf «Beleg ersetzen») und daraus keine Befunde abgeleitet. Bewertet habe ich den Beleg-Bereich an der Demo-Rechnung «ewl Energie Wasser Luzern, Fernwärme Q4 2025».
- In der Liste hat jede Zeile «Bearbeiten: Rechnung von …» mit Namen. Gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 40 Minuten, 16 Durchläufe. Bis «Rechnungen hochladen» brauchte ich 18 Tabs ab Seitenbeginn, danach etwa 10 Tastendrücke bis zur ersten Dateizeile und 26 Tabs bis zur ersten Seepark-Rechnung in der Liste.

## Ablauf

1. **Rechnungsliste, Tab bis «Rechnungen hochladen», Enter.** Erwartet: Ein Dialog geht auf, Fokus im Dialog. Gesehen: dialog «Rechnungen hochladen» (aria-modal), Fokus auf «Abbrechen». Die Beschreibung liest den ganzen Inhalt vor (P-9, P-14).
2. **Tab zu «Gebäude», zweimal Pfeil nach unten.** Erwartet: «Seepark Residenz – Seeweg 15, 6003 Luzern» wird gewählt, danach wird der Dateiknopf frei. Gesehen: genau so. Vorher hiess der Dateiknopf «gesperrt» mit der Beschreibung «Wählen Sie zuerst das Gebäude.», das ist gut. Vor der Wahl blieb Tab aber auf «Gebäude» stehen (P-6).
3. **Tab zu «Dateien hierher ziehen oder auswählen», Enter, beide Dateien gesetzt.** Erwartet: eine Ansage, dass zwei Dateien gelesen werden und wie das Ergebnis ist. Gesehen: nur der Alert zu Notizen.docx, «Nicht möglich. Dwello nimmt nur PDF-, JPG- und PNG-Dateien an …». Zu Elektro Blitz kam keine Ansage (P-3). Der Fokus blieb auf dem Dateiknopf, der weiter «No file chosen» sagt (P-10).
4. **Tab durch die Zeilen.** Erwartet: Jedes Element nennt seine Datei. Gesehen: «Diese Rechnung erstellen», «Angaben prüfen», «Datei entfernen», «Datei entfernen», «Abbrechen», «1 Rechnung erstellen», danach Stillstand (P-1, P-6). Leertaste auf dem Kontrollkästchen macht daraus «0 Rechnungen erstellen», ohne Ansage (P-11).
5. **«Angaben prüfen», Enter.** Erwartet: Das Formular geht auf, ich höre «erweitert». Gesehen: Der Knopf heisst jetzt «Angaben ausblenden», ohne erweitert/reduziert (P-8). Ich tabbe durch Rechnungsnummer R-1001, Rechnungsdatum 31.03.2026, Beginn 01.01.2026, Ende 31.03.2026, Betrag 1250.00, Rechnungssteller Elektro Blitz AG, Beschreibung Allgemeinstrom Q1, Kategorie Allgemeinstrom, Verteilschlüssel (leer) und Umlagefähig (angekreuzt). Alle haben gute Namen und Hilfetexte. Erwartet: Beim unsicheren Wert höre ich «Die KI ist unsicher». Gesehen: nicht angesagt, der Satz ist nicht mit dem Feld verbunden (P-2). Im Bild steht er unter dem Rechnungsdatum.
6. **Tab zu «Abbrechen», Enter.** Erwartet: eine Rückfrage, mit Fokus auf der sicheren Wahl. Gesehen: «Hochladen abbrechen?» mit Fokus auf «Weiter prüfen». Escape bringt mich zurück zu «Abbrechen», ein zweites Escape öffnet die Rückfrage wieder.
7. **«Abbrechen und verwerfen».** Erwartet: Der Dialog ist zu, und der Fokus liegt auf dem Knopf, der ihn geöffnet hat. Gesehen: genau so, der Fokus liegt auf «Rechnungen hochladen». Beim erneuten Öffnen ist alles leer.
8. **Zusatz: «Datei entfernen».** Erwartet: Der Fokus geht zur nächsten Zeile oder zum Dateiknopf, und ich höre «entfernt». Gesehen: Der Fokus ist weg, es gibt keine Ansage (P-4).
9. **Rechnung «ewl Energie Wasser Luzern, Fernwärme Q4 2025, Seepark Residenz» per Tab und Enter geöffnet.** Der Beleg-Bereich hat die Überschrift «Beleg» (h2) und sagt: «Zu dieser Rechnung ist kein Beleg gespeichert.», «Rechnung schon abgerechnet: Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.», danach den Hinweis «Beleg» (P-13). Dann folgen das Feld «Datei des Belegs» mit der Beschreibung «PDF, JPG oder PNG, höchstens 10 MB.» und der Knopf «Beleg hinzufügen». Die Tab-Reihenfolge ist logisch.
10. **«Beleg hinzufügen» ohne Datei.** Erwartet: Ich höre den Fehler, oder der Fokus springt zum Feld. Gesehen: Es ging keine Anfrage an den Server, der Fehler stand still auf der Seite, und der Fokus blieb auf dem Knopf (P-5). Das Feld selbst ist danach korrekt «ungültig» und hat den Fehler in der Beschreibung.

## Verwirrung

- Wenn ich «Datei entfernen» zweimal hintereinander höre, weiss ich nicht, welche Datei gemeint ist.
- Den Absatz «Beleg» im Dialog hielt ich zuerst für eine Feldbezeichnung, zu der ein Feld fehlt.
- «Bitte prüfen»: Was genau soll ich prüfen? Erst im Bild steht beim Rechnungsdatum, dass die KI unsicher ist. Ich höre das nicht.
- «Hochgeladene Dateien gehen verloren»: Sind die Dateien schon auf dem Server? Für mich war offen, ob sie dort liegen bleiben.
- «No file chosen» nach der Dateiwahl.

## Fehlerrisiken

- Ich übernehme ein unsicher ausgelesenes Rechnungsdatum ungeprüft, weil mir niemand sagt, dass es unsicher ist (P-2). Damit landet die Rechnung womöglich in der falschen Abrechnungsperiode.
- Ich entferne die falsche Datei, weil die Knöpfe gleich heissen (P-1).
- Ich glaube, ein Beleg sei gespeichert, obwohl nichts passiert ist (P-5).
- Ich halte die Fokusfalle für einen Absturz und schliesse den Tab (P-6).

## Vorschläge

- **P-1:** Datei auswählen und Tab durch die Zeile. Hilft: den Dateinamen in den Namen aufnehmen, etwa «Datei entfernen: Notizen.docx», «Angaben prüfen: Elektro Blitz AG.pdf», «Diese Rechnung erstellen: Elektro Blitz AG.pdf» (oder `aria-describedby` auf den Dateinamen). Jede Zeile könnte zudem eine Gruppe mit dem Dateinamen als Namen sein.
- **P-2:** «Elektro Blitz AG.pdf» hinzufügen, «Angaben prüfen», Tab zum Rechnungsdatum. Hilft: den Satz «Die KI ist unsicher …» in `aria-describedby` des betroffenen Feldes aufnehmen, am besten an erster Stelle. Die Marke «Bitte prüfen» könnte als Beschreibung an «Angaben prüfen» hängen.
- **P-3:** Dateien hinzufügen und die Live-Regionen beobachten. Hilft: in der Status-Region nach dem Auslesen eine kurze Meldung wie «2 Dateien gelesen: 1 bitte prüfen, 1 nicht möglich.» ausgeben.
- **P-4:** Zwei Dateien hinzufügen und bei einer «Datei entfernen» drücken. Hilft: den Fokus auf die nächste Zeile setzen (oder auf den Dateiknopf, wenn keine mehr da ist) und «Notizen.docx entfernt» in der Status-Region melden.
- **P-5:** Rechnung öffnen, Tab zu «Beleg hinzufügen», Enter ohne Datei. Hilft: den Fokus aufs Feld «Datei des Belegs» setzen, wie bei anderen Formularen mit Fehler, oder den Fehler über eine Live-Region ansagen.
- **P-6:** Dialog öffnen, einmal Tab (Gebäude), dann nochmals Tab: Der Fokus bleibt stehen. Nach der Dateiwahl genügt Tab bis «1 Rechnung erstellen» und ein weiterer Tab. Hilft: Die Fokusfalle sollte nur fokussierbare, nicht gesperrte Elemente zählen und am Ende zum Anfang springen.
- **P-7:** Dateien hinzufügen, Umschalt+Tab bis «Gebäude». Hilft: eine Beschreibung wie «Um das Gebäude zu wechseln, entfernen Sie zuerst alle Dateien.».
- **P-8:** «Angaben prüfen» drücken. Hilft: `aria-expanded` und `aria-controls` setzen; der Name kann dann gleich bleiben.
- **P-9:** Dialog öffnen. Hilft: `aria-describedby` nur auf den Einleitungssatz zeigen lassen.
- **P-10:** Dateien hinzufügen, Fokus auf dem Dateiknopf. Hilft: Der Knopf sollte keinen Browser-Wert sagen, oder eine Beschreibung wie «2 Dateien in der Liste» bekommen.
- **P-11:** Kontrollkästchen abwählen. Hilft: die neue Anzahl in der Status-Region melden.
- **P-12:** Notizen.docx hinzufügen. Hilft: die Marke vor dem Screenreader verbergen, wenn der Alert denselben Titel hat.
- **P-13:** Beleg-Bereich lesen. Hilft: Im Beleg-Bereich den Hinweistitel weglassen oder anders nennen, etwa «Original aufbewahren».
- **P-14:** Dialog öffnen. Hilft: den ersten Fokus auf «Gebäude» setzen (der Dialogname wird trotzdem angesagt).

## Nicht geprüft

- Erstellen von Rechnungen und Speichern eines Belegs: Die Aufgabe lautete «nur schauen». Darum weiss ich nicht, was beim Erstellen angesagt wird und wohin der Fokus danach geht, und auch nicht, ob «Beleg hinzufügen» mit einer .docx-Datei sauber abgelehnt wird. Im Beleg-Bereich nimmt das Dateifeld Notizen.docx ohne sofortige Rückmeldung an, anders als der Dialog.
- «Beleg anzeigen» habe ich nicht geöffnet, weil der Datensatz mit Beleg nicht von mir stammt.
- Die Kalender-Knöpfe im Dialog und das Ziehen und Ablegen von Dateien (für mich ohne Maus nicht bedienbar und für die Aufgabe nicht nötig).
- Echte Screenreader-Sprachausgabe (NVDA/VoiceOver): Beurteilt habe ich den Bedienungsbaum von Chromium. Die Ansage «No file chosen» kann je nach Browser und Sprache anders lauten. Die Optionen in Gruppen (`optgroup`) zeigt mein Werkzeug in der Übersicht nicht an; den gewählten Wert «Allgemeinstrom» habe ich über den Bedienungsbaum des fokussierten Felds bestätigt.
