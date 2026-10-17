# Marco – Runde w1c: veraltete Entwürfe nach einer neuen Rechnung

Persona: Marco, 38, Handy 390 × 844, Touch. App: Persona-Stack auf http://localhost:3300 (Demodaten).
Gespeichert habe ich nur im Gebäude «Seepark Residenz»: eine neue Rechnung. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/e2b820b1-99c9-50ff-9309-d5cdef855e91/scratchpad/marco-w1c/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung (Detail eines veralteten Entwurfs) | Der Hinweis «Rechnungen seit der Abrechnung geändert» steht oben, aber die Hauptaktion daneben ist «Als versendet markieren». Was ich laut Hinweis tun soll («Löschen Sie ihn …»), steht ganz unten unter «Weitere Aktionen», auf dem Handy rund vier Bildschirmlängen tiefer. Wer in Eile ist, versendet den veralteten Entwurf. |
| P-2 | Minor | Abrechnungen erstellen, Schritt 4 «Vorschau» | Nach dem Hinweis bleibt «Weiter» der grosse Hauptknopf. Wenn ich darauf tippe, kommt unten eine rote Meldung, und ich stehe in einer Sackgasse. Ein Knopf, der zu den veralteten Entwürfen führt, fehlt. |
| P-3 | Minor | Vorschau, «Abrechnungen pro Mietvertrag» | Der Link «Abrechnungen von Seepark Residenz ansehen» und der erste Entwurf-Link «NK-22222222-2025-0004, Marco Bernasconi» kleben ohne Abstand aneinander und sehen aus wie ein einziger Link. |
| P-4 | Minor | Vorschau | Viermal derselbe Satz «Seit dem Erstellen dieses Entwurfs wurden Rechnungen … erfasst, geändert oder gelöscht.» Es fehlt, welche Rechnung es ist und ob das jeden Entwurf betrifft. Ich musste selbst herausfinden, dass alle vier betroffen sind, weil eine Rechnung des Gebäudes alle Mieter trifft. |
| P-5 | Minor | Vorschau | Zuerst kommen «Anzahl Abrechnungen 0», «CHF 0.00» und der Satz «… keine Mietverträge ohne Abrechnung …» mit doppelter Verneinung. Erst darunter steht die eigentliche Botschaft «Alle Mietverträge haben schon eine Abrechnung». |
| P-6 | Minor | Abrechnungen erstellen (alle Schritte) | Die Statuszeile «Entwurf gespeichert, 00:48» meint den Stand des Assistenten. Auf demselben Bildschirm heissen die Abrechnungen aber ebenfalls «Entwurf». Ich habe einen Moment gedacht, gerade sei ein neuer Abrechnungsentwurf gespeichert worden. |
| P-7 | Minor | Nebenkostenabrechnungen (Liste, Ziel des Gebäude-Links) | Der Link aus der Vorschau führt zur Liste. Dort hat keine der vier Zeilen einen Hinweis «veraltet». Ich sehe dort nur «Entwurf» und Beträge, die nicht mehr stimmen. |
| P-8 | Nit | Vorschau | Der Abstand zwischen Link und Hinweissatz ist ungleich: Bei einzeiligen Links ist eine Lücke da, bei umbrochenen nicht. |

## Beobachtungen

- Nach dem Speichern der Rechnung erscheint die Meldung «Rechnung von Hauswartung Seeblick GmbH gespeichert». Ein Hinweis, dass meine Entwürfe 2025 jetzt veraltet sind, kommt nicht. Ich erfahre es erst, wenn ich den Assistenten wieder öffne oder einen Entwurf aufrufe.
- Auch die Übersicht sagt weiter «7 Nebenkostenabrechnungen sind noch im Entwurf. Prüfen Sie sie und stellen Sie sie den Mietern zu.», ohne Warnung.
- In Schritt 2 («Gebäude») steht bei Seepark Residenz nur «16 Rechnungen in der Abrechnungsperiode». Dass es schon Entwürfe gibt, sehe ich erst in Schritt 4.
- Die Uhrzeiten passen nicht zusammen. Der Assistent zeigt «Entwurf gespeichert, 00:48», der Verlauf des Entwurfs zeigt «Erstellt 17.10.2026, 02:46», obwohl der Entwurf vorher entstanden ist. Vermutlich einmal UTC und einmal Schweizer Zeit.
- Im Entwurf-Detail bricht der Kategoriename auf dem Handy mitten im Wort um: «TV/Kabelanschl | uss».
- Im Entwurf-Detail ist die neue Hauswart-Rechnung nicht aufgeführt (Hauswart CHF 3’060.00 aus 4 × 765). Das ist folgerichtig, weil der Entwurf vorher berechnet wurde. Es bestätigt mir aber auch, dass der Betrag nicht mehr stimmt.
- Alle Links in der Vorschau sind 48 px hoch und gut zu treffen.

## Aufgabe geschafft: ja

Ich habe die Rechnung erfasst, die Vorschau erreicht, die veralteten Entwürfe gefunden und einen davon geöffnet. Was als Nächstes zu tun ist, habe ich verstanden: löschen und neu erstellen. Gelöscht habe ich nichts, weil das nicht zur Aufgabe gehörte. Siehe «Nicht geprüft».

## Aufwand

Etwa 6 Minuten, rund 14 Taps. Rechnung: Übersicht → «Rechnung erfassen» → Formular → Speichern (6 Taps und Eingaben). Assistent: «Abrechnungen erstellen» → Weiter → Seepark Residenz → Weiter → Weiter (5 Taps). Danach ein Tap auf den Entwurf.

## Ablauf

1. **Übersicht.** Erwartet: ein Einstieg zum Erfassen einer Rechnung. Gesehen: «Häufige Arbeiten → Rechnung erfassen», gut zu finden. Screenshot `01-dashboard.png`.
2. **Neue Rechnung.** Erwartet: ein kurzes Formular. Gesehen: Gebäude, Rechnungsdatum (vorbelegt mit heute, mit dem Hinweis, das Datum von der Rechnung zu nehmen; gut), Leistungszeitraum, Betrag, Rechnungssteller, Beschreibung, Kategorie und «Umlagefähig» (angehakt). Die Kategorien erscheinen erst nach der Wahl des Gebäudes. Erfasst: Seepark Residenz, 15.11.2025, CHF 380.00, «Hauswartung Seeblick GmbH», Kategorie Hauswart. `03-form-filled.png`.
3. **Speichern.** Erwartet: eine Bestätigung und vielleicht ein Hinweis auf die Entwürfe. Gesehen: Ich lande in der Rechnungsliste mit der Meldung «Rechnung von Hauswartung Seeblick GmbH gespeichert», die über den Filtern liegt. Kein Hinweis auf die Entwürfe. `04-after-save.png`.
4. **Abrechnungen erstellen, Schritt 1.** Periode 01.01.2025 – 31.12.2025 vorgeschlagen, wie erwartet. `05-wizard-start.png`.
5. **Schritt 2 «Gebäude».** Seepark Residenz gewählt, «16 Rechnungen». Erwartet hatte ich hier schon einen Hinweis «hat bereits Entwürfe». Gesehen: keinen. `07-step2-selected.png`.
6. **Schritt 3 «Heizprofil und Verwaltungspauschale».** Ein langer Text, für das Handy viel zu lesen. Unverändert weiter. Unten steht «Entwurf gespeichert, 00:48» (siehe P-6).
7. **Schritt 4 «Vorschau».** Erwartet: was mit meinen Entwürfen passiert. Gesehen: «Anzahl Abrechnungen 0», «CHF 0.00». Darunter folgt «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.» Dann der Link «Abrechnungen von Seepark Residenz ansehen» und vier Entwürfe (0004 Marco Bernasconi, 0003 Nina Brunner, 0002 Sarah Meier, 0001 Thomas Weber), jeder mit dem Satz «Seit dem Erstellen dieses Entwurfs wurden Rechnungen … geändert …». Damit ist klar: Der Assistent überschreibt nichts, alle vier Entwürfe sind veraltet, und ich komme per Tap zu ihnen. `08-step4.png`.
8. **«Weiter» in der Vorschau.** Erwartet: entweder nichts oder ein Hinweis. Gesehen: Ich bleibe auf Schritt 4, unten erscheint rot «Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude, oder löschen Sie zuerst die Entwürfe, die Sie neu berechnen wollen.» Verständlich, aber eine Sackgasse (P-2). `08-step5.png`.
9. **Entwurf «NK-22222222-2025-0001, Thomas Weber» geöffnet.** Erwartet: der Hinweis «veraltet» und ein Weg, ihn neu zu berechnen. Gesehen: oben ein gelber Kasten «Rechnungen seit der Abrechnung geändert – Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. Löschen Sie ihn und erstellen Sie die Abrechnung erneut.» Klar. Direkt darüber stehen aber die Knöpfe «PDF herunterladen» und der dunkle Hauptknopf «Als versendet markieren». «Abrechnung löschen» finde ich erst nach langem Scrollen ganz unten (P-1). `09-draft-detail.png`.
10. **Liste der Seepark-Abrechnungen** (Ziel des Gebäude-Links). Erwartet: die veralteten Entwürfe markiert. Gesehen: vier Zeilen «Entwurf» mit den alten Beträgen, ohne Hinweis (P-7). `10-list-seepark.png`.

## Verwirrung

- «Entwurf» bedeutet hier zwei Dinge: den gespeicherten Stand des Assistenten («Entwurf gespeichert, 00:48») und die Abrechnung im Status Entwurf.
- «Anzahl Abrechnungen 0» hat mich kurz erschreckt: Sind meine Abrechnungen weg?
- «keine Mietverträge ohne Abrechnung»: doppelte Verneinung, ich musste den Satz zweimal lesen.
- «NK-22222222-2025-0004» ist für mich eine technische Nummer. Nützlicher wäre die Wohnung (B2) neben dem Namen.
- «erneut erstellen»: Muss ich alle vier Entwürfe löschen oder nur einen? Der Text sagt «Um einen Entwurf neu zu berechnen, löschen Sie ihn». Dass alle vier falsch sind, steht nur implizit da, weil der Satz bei allen vier steht.

## Fehlerrisiken

- Den veralteten Entwurf über den Hauptknopf «Als versendet markieren» versenden, ohne bis zum Löschen zu scrollen (P-1).
- Nur einen Entwurf löschen und neu erstellen, die anderen drei bleiben veraltet. Weder die Liste noch die Übersicht zeigen das (P-7, Beobachtungen).
- «PDF herunterladen» beim veralteten Entwurf liefert ein PDF mit falschen Beträgen, ohne Warnung am Knopf.
- Den Gebäude-Link für den ersten Entwurf halten oder umgekehrt (P-3).

## Vorschläge

- **P-1.** Schritte: Rechnung 2025 in Seepark Residenz erfassen → Abrechnungen → einen Entwurf 2025 öffnen. Was helfen würde: Bei veraltetem Entwurf den Hauptknopf «Abrechnung löschen und neu erstellen» (oder «Löschen») direkt im gelben Kasten zeigen und «Als versendet markieren» zurückstufen oder mit einer Rückfrage versehen.
- **P-2.** Schritte: wie oben, dann Abrechnungen erstellen → 2025 → Seepark Residenz → bis Vorschau → «Weiter». Was helfen würde: «Weiter» weglassen oder deaktivieren, wenn nichts zu erstellen ist, und als Hauptaktion «Veraltete Entwürfe ansehen» anbieten.
- **P-3.** Schritte: Vorschau wie bei P-2. Was helfen würde: Den Gebäude-Link vom ersten Eintrag absetzen (Abstand oder eigene Zeile oberhalb der Liste) und die Entwürfe als eigene Zeilen zeigen, deren ganze Fläche ein Link ist.
- **P-4.** Schritte: Vorschau wie bei P-2. Was helfen würde: Einmal oben sagen «Alle 4 Entwürfe von Seepark Residenz sind veraltet: 1 Rechnung wurde seit dem Erstellen erfasst, geändert oder gelöscht», gern mit dem Namen der Rechnung, und den Satz nicht viermal wiederholen.
- **P-5.** Schritte: Vorschau wie bei P-2. Was helfen würde: Bei 0 neuen Abrechnungen die Kennzahlen weglassen und mit dem Satz «Alle Mietverträge haben schon eine Abrechnung» beginnen, ohne doppelte Verneinung.
- **P-6.** Schritte: Abrechnungen erstellen → Schritt 3. Was helfen würde: «Eingaben gespeichert» statt «Entwurf gespeichert», und dieselbe Zeitzone wie im Verlauf des Entwurfs.
- **P-7.** Schritte: Vorschau → «Abrechnungen von Seepark Residenz ansehen». Was helfen würde: In der Liste bei jedem veralteten Entwurf einen kurzen Text «Veraltet: Rechnungen geändert» neben «Entwurf».
- **P-8.** Schritte: Vorschau wie bei P-2. Was helfen würde: einheitlicher Abstand zwischen Link und Hinweissatz.

## Nicht geprüft

- Löschen und neu erstellen: Das Antippen von «Abrechnung löschen» (nur um den Bestätigungsdialog anzusehen) wurde von der Berechtigungsprüfung der Umgebung abgelehnt. Den Text des Bestätigungsdialogs und den Weg danach habe ich deshalb nicht gesehen.
- Den Betrag einer bestehenden Rechnung ändern (die zweite Variante der Aufgabe). Ich habe nur eine neue Rechnung erfasst.
- Die Entwürfe 0002 bis 0004 im Detail. Geöffnet habe ich nur 0001 (Thomas Weber).
- Dunkelmodus, andere Sprachen, PDF-Inhalt.
