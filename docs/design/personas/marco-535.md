# Marco, Runde 535: Liftrechnung mit Reparatur hochladen und aufteilen

Smartphone 390 × 844, Touch. Gebäude «Alpenblick». Dateien: «Lift Service Reparatur März.pdf» und «Elektro Blitz Strom.pdf». Skripte und Screenshots liegen in `/tmp/scratchpad/marco-535/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen, Meldung «2 Rechnungen erstellt» | Der Hinweis «Erfassen Sie noch den Rest als zweite Rechnung …» nennt den Restbetrag nicht. Den Gesamtbetrag (CHF 1'250.00) habe ich im Fenster mit CHF 450.00 überschrieben, danach zeigt Dwello ihn nirgends mehr. Den Rest von CHF 800.00 musste ich im Kopf behalten. Wer sich verrechnet, erfasst einen falschen Betrag. |
| P-2 | Minor | Meldung «2 Rechnungen erstellt» → «Rechnung erfassen» | Der Link öffnet ein leeres Formular «Neue Rechnung». Gebäude, Rechnungsdatum und Rechnungssteller muss ich nochmals eingeben, die Kategorie Reparaturen selbst wählen und den Beleg anhängen, obwohl Dwello das alles von der Liftrechnung kennt. Auf dem Handy sind das viele Felder, und ich kann mich leicht vertippen (anderes Datum, anderer Rechnungssteller). |
| P-3 | Minor | Neue Rechnung → «Rechnung speichern» | Nach dem Speichern lande ich in der Rechnungsliste. Es gibt keine Bestätigung, und die neue Rechnung steht erst unter fünf Filterfeldern, also nicht im ersten Bildschirm. Der nächste Schritt, den Dwello verlangt hat («Beleg hinzufügen»), geht nur auf der Seite der Rechnung. Diese Seite muss ich in der Liste suchen und öffnen. |
| P-4 | Minor | Rechnung «Lift Service AG» (Lift), Abschnitt Beleg | Auch nachdem die Reparatur mit Beleg erfasst ist, steht dort unverändert «Prüfen Sie, dass … der Rest als eigene Rechnung in einer nicht umlagefähigen Kategorie erfasst ist.» Dwello sagt mir nie, ob das erledigt ist, und verbindet die beiden Rechnungen nicht miteinander. Ob nichts fehlt, prüfe ich selbst mit der Suche. Die Erinnerung aus der Erfolgsmeldung ist nach dem Neuladen der Liste weg. |

## Beobachtungen

- Beim Hochladen ist die Liftdatei gut erklärt. Das Häkchen «Diese Rechnung erstellen» ist bewusst nicht gesetzt, mit der Begründung «weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.» Der Hinweis sagt klar, was zu tun ist: nur den umlagefähigen Betrag eintragen, den Rest unter Reparaturen erfassen und die Datei mit «Beleg hinzufügen» anhängen. So habe ich nicht aus Versehen CHF 1'250 auf die Mieter verteilt.
- Auf der Seite der Liftrechnung erklärt die Kategorie Lift gut, dass nur die Wartung umlagefähig ist und Reparaturen der Vermieter trägt.
- Bei der Kategorie Reparaturen setzt Dwello «Umlagefähig» von selbst auf aus und sperrt die Checkbox. Das ist gut. Trotzdem verlangt das Formular einen Verteilschlüssel («Wählen Sie, wie die Kosten verteilt werden.»), obwohl die Kosten gar nicht verteilt werden. Ich habe «Pro Einheit» geraten.
- Für die Kategorie Lift schlug Dwello keinen Verteilschlüssel vor (Alpenblick hat offenbar noch keine Liftrechnung). Ich habe «Pro Einheit» gewählt. Im Hochladen-Fenster wird der Hinweis «Wählen Sie, wie die Kosten verteilt werden.» gelöscht, sobald ein Verteilschlüssel gewählt ist. Das war klar.
- Die KI-Stellvertretung hat als Rechnungssteller den Dateinamen («Lift Service Reparatur März») und als Beschreibung «Allgemeinstrom Q1» eingesetzt, bei beiden Dateien mit der Rechnungsnummer R-1001. Das ist die Stellvertretung, kein Befund. Bei Elektro Blitz habe ich den Rechnungssteller «Elektro Blitz Strom» so gelassen.
- Werkzeug: Wähle ich Dateien über den Pfad im Dateisystem aus und enthält der Name ein «ä» («März»), kommt die Liftdatei gar nicht an: Es gibt keine Anfrage und keine Meldung. Mit demselben Namen als Datei-Inhalt aus dem Speicher (wie ein Handy sie liefert) klappt es. Das ist wohl eine Eigenheit von Playwright und kein Befund an Dwello.
- Werkzeug: Ein Tippen auf die gestrichelte Fläche «Dateien hierher ziehen oder auswählen» öffnete im Skript keine Dateiauswahl, ein Tippen auf den Knopf «Dateien auswählen» darin schon. Ob ein echtes Handy das gleich macht, konnte ich nicht prüfen.

## Aufgabe geschafft: ja

Am Ende stehen in Alpenblick drei Rechnungen vom 31.03.2026: Lift Service AG, Lift, CHF 450.00, umlagefähig, mit Beleg. Lift Service AG, Reparaturen, CHF 800.00, nicht umlagefähig, mit demselben Beleg. Elektro Blitz Strom, Allgemeinstrom, CHF 1'250.00, umlagefähig, automatisch kategorisiert.

## Aufwand

Etwa 25 Minuten, davon viel Skriptarbeit. Als Nutzer etwa 35 Tipp- und Eingabeschritte: Hochladen und Aufteilen 12, die zweite Rechnung von Hand erfassen 10, die Rechnung suchen und den Beleg anhängen 5, die Kontrolle 5. Die Hälfte davon fällt erst nach «Rechnungen erstellen» an.

## Ablauf

1. Hochladen mit beiden Dateien. Erwartet: zwei Karten. Gesehen: zuerst nur «Elektro Blitz Strom.pdf», die Liftdatei fehlte ohne Meldung. Das lag am Werkzeug (siehe Beobachtungen). Beim zweiten Versuch erschienen beide Karten.
2. Liftkarte. Erwartet: Die KI schlägt die Kategorie Lift vor. Gesehen: keine Kategorie und keinen Verteilschlüssel, dafür einen klaren Hinweis zum Aufteilen. Ich verstehe: Hier trage ich nur die Wartung ein (450), die Reparatur (800) kommt danach separat.
3. «2 Rechnungen erstellt». Erwartet: Dwello bietet mir an, die Reparatur gleich mit vorausgefüllten Angaben zu erfassen. Gesehen: einen Textlink «Rechnung erfassen» auf ein leeres Formular, ohne Restbetrag (P-1, P-2).
4. Neue Rechnung mit Reparaturen. Erwartet: Speichern geht ohne Verteilschlüssel, weil nichts verteilt wird. Gesehen: «Wählen Sie, wie die Kosten verteilt werden.» (Beobachtung).
5. Nach «Rechnung speichern». Erwartet: die Seite der neuen Rechnung mit «Beleg hinzufügen» oder wenigstens eine Bestätigung. Gesehen: die Rechnungsliste ohne Meldung, die neue Rechnung erst nach langem Scrollen (P-3).
6. Kontrolle auf der Liftrechnung. Erwartet: Der Hinweis zeigt, dass der Rest erfasst ist, oder verschwindet. Gesehen: derselbe «Prüfen Sie …»-Hinweis wie vorher (P-4).

## Vorschläge

- **P-1:** Alpenblick wählen, «Lift Service Reparatur März.pdf» hochladen, «Angaben prüfen», den Betrag von 1250.00 auf 450.00 ändern, Kategorie Lift wählen, Häkchen setzen und «Rechnungen erstellen». Die Meldung nennt keinen Betrag. Hilfreich wäre, den von der KI gelesenen Gesamtbetrag und den Rest im Hinweis zu nennen («Rest: CHF 800.00 von CHF 1'250.00»), oder den Gesamtbetrag auf der Karte stehen zu lassen.
- **P-2:** Wie P-1, dann in der Meldung auf «Rechnung erfassen» tippen. Das Formular ist leer. Hilfreich wäre ein Link, der Gebäude, Datum, Rechnungssteller, Kategorie Reparaturen und den Restbetrag vorausfüllt und die Datei gleich als Beleg übernimmt. Dann entfallen auch die Schritte von P-3.
- **P-3:** Unter «Neue Rechnung» eine Rechnung speichern. Man landet ohne Bestätigung auf der Liste, die neue Rechnung steht unter den Filtern. Hilfreich wäre, nach dem Speichern auf die Seite der neuen Rechnung zu führen, mit der Meldung «Rechnung gespeichert», damit «Beleg hinzufügen» gleich da ist. Mindestens braucht es eine Bestätigung oben mit einem Link zur Rechnung.
- **P-4:** Nach P-1 bis P-3 die Liftrechnung öffnen. Der Hinweis zum Beleg ist unverändert. Hilfreich wäre, dass Dwello sieht, dass derselbe Beleg an einer Rechnung in einer nicht umlagefähigen Kategorie hängt, und dann schreibt «Rest erfasst: Rechnung Reparaturen, CHF 800.00» mit Link. Sonst wäre eine dauerhafte Erinnerung nützlich, zum Beispiel unter «Als Nächstes zu tun» auf der Übersicht, bis der Rest erfasst ist.

## Nicht geprüft

- Das Ziehen von Dateien in die Fläche: Auf dem Handy gibt es das nicht.
- Den Link «Datei gross anzeigen (öffnet in neuem Tab)», einen blob-Link: Neue Tabs habe ich nicht geöffnet.
- Wie die beiden Liftrechnungen in einer Nebenkostenabrechnung 2026 erscheinen: Das gehörte nicht zur Aufgabe, und die Periode 2026 ist noch nicht abgeschlossen.
- Ein echtes Smartphone mit Dateiauswahl über den Fotos- oder Dateien-Dialog: Ich habe nur Playwright mit Touch-Emulation verwendet.
