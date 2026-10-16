# Dr. Weber – Issue 251: Entwurf neu berechnen, Hinweise im Assistenten

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Demodaten), gespeichert nur in «Seepark Residenz». Datum des Laufs: 16.10.2026, ca. 21:36–21:41 Schweizer Zeit (Systemuhr 19:36–19:41 UTC; der Browser lief in der Zeitzone UTC).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 «Vorschau» und Schritt 5, Periode 01.07.2025–30.06.2026 | Die Vorschau sagt «Alle Mietverträge haben in dieser Periode schon eine Abrechnung» und rät «Um einen Entwurf neu zu berechnen, löschen Sie ihn …». Das stimmt so nicht: Die Abrechnungen 2025 decken nur 01.07.–31.12.2025 ab, 01.01.–30.06.2026 ist gar nicht abgerechnet. Der Rat, die Entwürfe zu löschen, führt hier dazu, dass das erste Halbjahr 2025 nicht mehr abgerechnet ist. Schritt 2 sagt richtig «ganz oder teilweise», die Vorschau lässt das «teilweise» weg. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude», Periode 01.07.2025–30.06.2026 | «Alle Gebäude» wählt hier 3 von 3 Gebäuden, also auch die beiden, bei denen steht «Für dieses Gebäude entsteht keine neue Abrechnung». Der Satz «‹Alle Gebäude› lässt … aus» fehlt. In der Periode 2025 lässt dasselbe Kästchen solche Gebäude aus (1 von 3) und sagt das auch. Je nach Periode verhält sich das Kästchen also anders. |
| P-3 | Minor | Abrechnungen erstellen, alle Schritte: Status «Entwurf gespeichert, HH:MM» | «Entwurf» meint hier die Eingaben im Assistenten. Auf demselben Bildschirm meint «Entwurf» aber auch den Status einer Abrechnung («Um einen Entwurf neu zu berechnen, löschen Sie ihn», «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt»). Ab Schritt 4 kann ich «Entwurf gespeichert» so lesen, als sei die Abrechnung schon erstellt, und den Assistenten vor «Entwürfe erstellen» verlassen. Beim Neuladen steht dann «Entwurf wiederhergestellt … Entwurf verwerfen», und ich weiss nicht, ob das meine Abrechnungsentwürfe löscht. |
| P-4 | Nit | Schritt 2 «Gebäude», Hinweis bei «Seepark Residenz» (2025) | «Versendete Abrechnungen lassen sich nicht neu berechnen» steht auch bei Gebäuden ohne versendete Abrechnung (Seepark: alle 4 im Entwurf). Der Satz sagt ausserdem nicht, was zu tun ist, wenn eine versendete Abrechnung falsch ist. Ich lese ihn leicht als «rechtlich nicht korrigierbar», gemeint ist wohl «in Dwello nicht». |

## Beobachtungen

- Die Uhrzeiten stimmen. «Entwurf gespeichert, 21:39» im Assistenten (Klick um 19:39:45 UTC), «Erstellt 16.10.2026, 21:39» auf der neuen Abrechnung und die Systemuhr (19:39 UTC = 21:39 MESZ) passen zusammen. Die App zeigt Schweizer Zeit, obwohl der Browser in UTC lief. Beim Wiederherstellen stand «zuletzt am 16.10.2026 um 21:39 bearbeitet», ebenfalls stimmig.
- Neu berechnen hat geklappt. Ich habe den Entwurf NK-22222222-2025-0001 gelöscht. Danach erstellte der Assistent für Seepark nur eine Abrechnung (Thomas Weber, A1). Die drei anderen Entwürfe (Meier, Brunner, Bernasconi) liess er stehen.
- Die neue Abrechnung hat die Nummer NK-22222222-2025-0005. Die 0001 ist damit eine Lücke in der Nummerierung. Der Löschdialog («… wird gelöscht. Das lässt sich nicht rückgängig machen.») sagt nicht, dass eine neu erstellte Abrechnung eine neue Nummer bekommt. Für meine Akten wäre das gut zu wissen.
- Nachgerechnet: TV 912.00 × 25 % = 228.00; Hauswart 3’060 × 21.25 % = 650.25; Heizung 4’115 × 21.25 % = 874.44; Kaltwasser 2’060 × 21.25 % = 437.75; Strom 499.30 × 21.25 % = 106.10. Das ergibt eine Zwischensumme von 2’296.54. Dazu 3 % = 68.90, total 2’365.44. Abzüglich Akonto 2’400.00 bleibt eine Rückerstattung von 34.56, gerundet 34.55. Alles stimmt und ist identisch mit dem gelöschten Entwurf. In den Demodaten ist keine Rechnung nachgetragen, deshalb gleicher Betrag. Die Reihenfolge der Positionen ist neu (Heizung vor Hauswart).
- Die neue Abrechnung hat noch kein PDF («PDF erstellen» statt «PDF herunterladen», in der Liste kein PDF-Link). Der alte Entwurf hatte im Verlauf «PDF erstellt».
- Das Neuladen in Schritt 4 stellt die Eingaben wieder her, landet aber in Schritt 3, nicht in der Vorschau. Gespeichert wird im Browser (localStorage). Ein anderer Browser oder ein anderes Gerät sieht diesen «Entwurf» nicht. Das sagt die App nicht.
- Im Schritt 2 gibt es keinen Link zu den Abrechnungen, die man löschen soll. In der Vorschau gibt es einen («Abrechnungen von Seepark Residenz ansehen»).
- Der Hinweistext steht bei der Gebäude-Karte, ist aber nicht Teil des Namens des Kästchens (aria). Ein Screenreader liest ihn beim Kästchen vermutlich nicht vor. Nicht geprüft, Sven-Thema.
- Nach dem Löschen erschien die Meldung «Abrechnung NK-22222222-2025-0001 gelöscht» in der Liste, gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten App-Zeit. Ungefähr 6 Schritte zum Löschen (Liste, Abrechnung, Löschen, Bestätigen) und 8 Schritte im Assistenten (Weiter, Seepark wählen, 3 × Weiter, Entwürfe erstellen, Entwürfe ansehen, Abrechnung öffnen). Dazu der optionale Blick auf 07.2025–06.2026.

## Ablauf

1. **Schritt 1, Periode 01.01.–31.12.2025.** Erwartet: vorgeschlagen. Gesehen: ist vorgeschlagen, mit Wochentag darunter («Mittwoch, 1. Januar 2025»).
2. **Schritt 2, Seepark.** Erwartet: ein Hinweis, dass schon Abrechnungen bestehen, und wie man neu rechnet. Gesehen: «Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen. Wenn Sie es wählen, wird dafür nichts erstellt. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.» Oben steht: «‹Alle Gebäude› lässt 2 Gebäude aus …». Mit «Alle Gebäude» war nur Alpenblick gewählt (1 von 3). Sachlich stimmt das für 2025. Zu Musterhaus (Hans Müller versendet) passt der letzte Satz, zu Seepark ist er überflüssig (P-4).
3. **Entwurf von Thomas Weber löschen.** Erwartet: ein Dialog mit Folgen. Gesehen: Dialog «Die Abrechnung NK-22222222-2025-0001 von Thomas Weber wird gelöscht. Das lässt sich nicht rückgängig machen.», danach die Liste mit der Meldung «… gelöscht» und 6 Entwürfen.
4. **Schritt 2 erneut.** Erwartet: Seepark ist jetzt teilweise offen. Gesehen: «Von 4 Mietverträgen in dieser Abrechnungsperiode haben 3 schon eine Abrechnung …», «Alle Gebäude» lässt jetzt 1 Gebäude aus. Stimmig.
5. **Schritt 3.** Gesehen: Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 % (vorbelegt), Hilfetexte zu Zählern und Pauschale. Unverändert übernommen.
6. **Schritt 4, Vorschau.** Erwartet: 1 Abrechnung, eventuell eine Bestätigung «trotzdem erstellen». Gesehen: «Anzahl Abrechnungen 1», Thomas Weber, Wohnung A1, Kosten CHF 2’365.44, Rückerstattung CHF 34.55. Dazu der Kasten «Es gibt schon Abrechnungen … schon 3 Nebenkostenabrechnungen» mit Link und «Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue.» Es gibt **keine** Bestätigung «trotzdem erstellen». Das halte ich für richtig: Es entsteht keine doppelte Abrechnung, die drei bestehenden bleiben unberührt, und das steht klar da.
7. **Schritt 5, Erstellen.** Gesehen: «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt. Es wird nichts verschickt.» Nach «Entwürfe erstellen» erschien «1 Nebenkostenabrechnung ist als Entwurf erstellt.» mit dem Link «Entwürfe ansehen» (gefiltert auf Seepark und 2025). Danach war der gespeicherte Assistenten-Stand im Browser gelöscht.
8. **Uhrzeiten.** «Entwurf gespeichert, 21:38/21:39» im Assistenten, «Erstellt 16.10.2026, 21:39» auf NK-22222222-2025-0005, Uhr 21:39 MESZ. Alles stimmt überein.
9. **Optional, Periode 01.07.2025–30.06.2026.** Erwartet: Seepark ist teilweise abgerechnet, ein Hinweis auf das offene Halbjahr 2026. Gesehen: In Schritt 2 steht bei Seepark und Musterhaus derselbe Text «Alle Mietverträge … ganz oder teilweise … keine neue Abrechnung». «Alle Gebäude» wählt alle 3 Gebäude, ohne Hinweis (P-2). Die Vorschau zeigt 0 Abrechnungen, «7 Rechnungen vom 30.09.2025 bis 31.12.2025» und «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn …» (P-1). Schritt 5 zeigt «Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude, oder löschen Sie zuerst die Entwürfe …», ohne Knopf zum Erstellen. Nichts erstellt, den gespeicherten Assistenten-Stand danach im Browser gelöscht.

## Verwirrung

- «Entwurf» bedeutet zweierlei: der gespeicherte Stand des Assistenten («Entwurf gespeichert», «Entwurf wiederhergestellt», «Entwurf verwerfen») und der Status einer Abrechnung (P-3).
- «ganz oder teilweise abdeckt» in Schritt 2 gegenüber «in dieser Periode schon eine Abrechnung» in der Vorschau. Die beiden Texte sagen Verschiedenes (P-1).
- «lassen sich nicht neu berechnen»: Meint das, dass die App das nicht kann, oder dass ich rechtlich nicht korrigieren darf (P-4)?

## Fehlerrisiken

- Bei einer verschobenen Periode (Juli–Juni) glaubt der Vermieter, alles sei abgerechnet. Oder er löscht nach dem Rat die Entwürfe 2025 und verliert damit die Abrechnung von Januar bis Juni 2025 (P-1).
- Der Vermieter verlässt den Assistenten nach «Entwurf gespeichert» in der Vorschau, und die Abrechnung entsteht nie. Nach dem Löschen des alten Entwurfs fehlt dann die Abrechnung des Mieters ganz (P-3).
- Die Lücke in der Nummerierung (0001 gelöscht, 0005 neu) kann bei einer Prüfung Fragen aufwerfen. Das sagt die App nirgends.

## Vorschläge

- **P-1.** Reproduktion: Abrechnungen erstellen, Periode 01.07.2025–30.06.2026, «Seepark Residenz» wählen, weiter bis zur Vorschau. Hilfreich: Die Vorschau sagt wie Schritt 2 «ganz oder teilweise» und nennt den nicht abgedeckten Zeitraum, zum Beispiel: «Die bestehenden Abrechnungen decken nur 01.07.2025–31.12.2025 ab. Für 01.01.2026–30.06.2026 gibt es noch keine Abrechnung. Wählen Sie dafür eine Periode, die an die letzte Abrechnung anschliesst.» Der Rat «Entwurf löschen» gehört nur zu Mietverträgen, deren Periode gleich ist.
- **P-2.** Reproduktion: dieselbe Periode, Schritt 2, «Alle Gebäude» anklicken. Ergebnis: 3 von 3 gewählt, kein Hinweis. Hilfreich: Das Kästchen verhält sich wie in der Periode 2025 (blockierte Gebäude auslassen und das sagen) oder sagt, warum es sie hier mitwählt.
- **P-3.** Reproduktion: Assistent bis Schritt 4 führen und unten «Entwurf gespeichert, HH:MM» lesen. Dann neu laden: «Entwurf wiederhergestellt … Entwurf verwerfen». Hilfreich: ein anderes Wort, zum Beispiel «Eingaben gespeichert, 21:39» und «Eingaben verwerfen». Der Hinweis «noch keine Abrechnung erstellt» bis Schritt 5 wäre gut.
- **P-4.** Reproduktion: Periode 2025, Schritt 2, Hinweis bei Seepark lesen. Hilfreich: den Satz nur zeigen, wenn das Gebäude versendete Abrechnungen hat, und sagen, was dann zu tun ist (zum Beispiel «Eine versendete Abrechnung korrigieren Sie ausserhalb von Dwello»; das muss fachlich geprüft werden).

## Nicht geprüft

- PDF der neuen Abrechnung: Ich habe kein PDF erzeugt, das war nicht Teil der Aufgabe.
- Ein echter Nachtrag einer Rechnung: Die Aufgabe setzt ihn voraus. Ich habe keinen erfasst, deshalb ist der Betrag gleich geblieben.
- Wiederherstellung des Assistenten in einem anderen Browser: Das Werkzeug startet jedes Mal einen neuen Browser. Ich sehe nur, dass der Stand in diesem Browser gespeichert wird.
- Screenreader-Ausgabe der Hinweise (Sven).
- Andere Sprachen.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/987bcc32-5bc2-548b-b1db-07cf87dd37fd/scratchpad/dr-weber-issue-251/`. Die wichtigsten: 04-gebaeude.png (Hinweise 2025), 07-loeschen-dialog.png, 11-vorschau.png, 16-ergebnis.png, 18-weber-neu.png, 19/21/20/22 (Periode 07.2025–06.2026).
