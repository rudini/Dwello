# Persona-Review Anna – issue-201 (Abrechnungen erstellen: Gebäudehinweise, Entwurf wiederherstellen)

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Wochen zurück und erinnert sich an nichts.
Ansicht: Desktop 1440 × 900, Maus; dieselben Ansichten auf Mobile 390 × 844 mit Touch.
App: http://localhost:3300 (Persona-Stack, Demodaten), 16.10.2026 um etwa 21:37 Schweizer Zeit (19:37 UTC).
Ich habe nur angeschaut: keine Abrechnung erstellt und keinen Datensatz geändert. Den Assistenten-Entwurf im Browser habe ich angelegt und wieder verworfen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/987bcc32-5bc2-548b-b1db-07cf87dd37fd/scratchpad/anna-issue-201/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, alle Schritte und Hinweis «Entwurf wiederhergestellt» | «Entwurf» steht für zwei verschiedene Dinge: für meine Angaben im Assistenten («Entwurf gespeichert», «Entwurf wiederhergestellt», «Entwurf verwerfen») und für die Nebenkostenabrechnungen im Status Entwurf (Einleitung direkt darüber: «Es entstehen Entwürfe …», Hinweise bei den Gebäuden: «löschen Sie den Entwurf», Übersicht: «7 Nebenkostenabrechnungen sind noch im Entwurf»). Ich habe gedacht, nach einem Klick auf ein Gebäude sei schon eine Abrechnung entstanden, und dass «Entwurf verwerfen» meine Abrechnungsentwürfe löscht. |
| P-2 | Minor | Dialog «Angaben verwerfen?» | Im Dialog steht nur «Ihre Angaben werden gelöscht.» Er sagt nicht, welche Angaben das sind (Periode, Alpenblick, Pauschale 3 %), dass bestehende Abrechnungen bleiben und dass ich danach bei Schritt 1 neu anfange. Der Knopf heisst «Entwurf verwerfen», der Dialog aber «Angaben verwerfen»: Ich war nicht sicher, ob beides dasselbe ist. |
| P-3 | Minor | Abrechnungen erstellen nach dem Verwerfen | Nach «Angaben verwerfen» bin ich ohne Meldung wieder bei Schritt 1 mit der vorgeschlagenen Periode. Ich sehe nicht, ob das Verwerfen geklappt hat oder ob die Seite nur neu geladen wurde. |
| P-4 | Minor | Schritt 2 Gebäude | Das Häkchen bei «Alle Gebäude» passt nicht immer zur Auswahl. Wähle ich über «Alle Gebäude», ist es gesetzt, und daneben steht «1 von 3 gewählt». Wähle ich nur Alpenblick (also dieselbe Auswahl), ist es leer. Nach dem Wiederherstellen ist es ebenfalls leer. Ein gesetztes «Alle» neben «1 von 3» wirkt auf mich wie ein Fehler. |
| P-5 | Minor | Hinweis «Entwurf wiederhergestellt» | Der Hinweis nennt nur das Datum und die Uhrzeit, aber nicht, was wiederhergestellt ist (Abrechnungsperiode 2025, Alpenblick) und dass die Angaben nur in diesem Browser auf diesem Gerät liegen. Wenn ich am Handy anfange und am Laptop weitermache, ist nichts da, und ich weiss nicht, warum. |
| P-6 | Nit | Schritt 2 Gebäude, Hinweis bei bereits abgerechneten Gebäuden | Der fette Hinweis hat fünf Sätze und steht bei jedem betroffenen Gebäude in voller Länge. «Sie müssen es nicht wählen. Wenn Sie es wählen, wird dafür nichts erstellt» lässt mich fragen, warum ich es dann überhaupt wählen kann. Auf 390 px wird daraus ein Block mit 14 Zeilen. |

## Beobachtungen

- Die Uhrzeit stimmt: «Entwurf gespeichert, 21:37» und «zuletzt am 16.10.2026 um 21:37 bearbeitet» entsprechen meiner Schweizer Uhr (19:37 UTC). Der Browser lief dabei auf UTC, die App zeigt also Schweizer Zeit. Mit einer Browseruhr drei Wochen später stand das richtige Datum vom 16.10. da. Dass ein Datum dabei ist und nicht nur «21:37», hilft nach Wochen sehr.
- Die Fortsetzung funktioniert: Nach dem Schliessen des Tabs und in einem neuen Tab war ich sofort bei Schritt 3 mit Alpenblick und meiner geänderten Pauschale (2 %).
- «Meldung schliessen» blendet nur den Hinweis aus. Die Angaben bleiben, und nach einem weiteren Neuladen erscheint der Hinweis wieder. Für mich ist das in Ordnung. Dass «schliessen» nichts löscht, habe ich aber erst durch Ausprobieren gemerkt.
- Nach «Meldung schliessen» stand der Tastaturfokus auf der ganzen Seite (body). Das betrifft eher Sven. Nach dem Verwerfen landet der Fokus dagegen sauber auf «Schritt 1 von 5: Abrechnungsperiode».
- In der Übersicht steht nach meiner Rückkehr nichts davon, dass ich angefangen habe. Ich muss mich selbst erinnern, «Abrechnungen erstellen» zu öffnen.
- Der Hinweis über dem Zähler (««Alle Gebäude» lässt 2 Gebäude aus …») und die Hinweise bei den Gebäuden haben zusammen erklärt, warum «Alle Gebäude» nur Alpenblick wählt. Das habe ich verstanden.
- Während meines Laufs änderte sich der Hinweis von «lässt 2 Gebäude aus» zu «lässt 1 Gebäude aus», und bei Seepark Residenz stand neu «Von 4 Mietverträgen … haben 3 schon eine Abrechnung». Die Zahl der Entwürfe in der Übersicht fiel von 7 auf 6. Das kam von einer anderen Persona, die gleichzeitig in derselben Datenbank arbeitete, und ist kein Befund. Positiv: Auch für ein teilweise abgerechnetes Gebäude gibt es einen passenden eigenen Text.
- Im Bedienbaum (readOut) fehlen die fetten Hinweise bei den Gebäuden. Dort stehen nur der Name, die Adresse, die Rechnungen und die Wohnungen. Prüfen sollte das Sven, ich habe es nicht vertieft.
- Desktop: In der Schrittleiste brechen die Wörter mitten im Wort um («Abrechnun / gsperiode», «Verwaltung / spauschale»).
- Mobile 390 px: kein seitliches Scrollen in Schritt 1, Schritt 2, Schritt 3, im Hinweis, im Dialog und nach dem Verwerfen. Die Knöpfe im Hinweis und im Dialog liegen untereinander und sind gross genug. Nach dem Neuladen war die Seite ein Stück gescrollt, und der Titel war oben abgeschnitten (Screenshot `33-m-restored.png`).

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten als Anna, rund 25 Schritte (Übersicht, Schritt 1, Schritt 2 mit «Alle Gebäude» und Einzelwahl, Schritt 3, Tab schliessen, neuer Tab, Neuladen, Hinweis schliessen, Neuladen, verwerfen, bestätigen), dazu der Durchgang auf Mobile.

## Ablauf

1. **Übersicht → «Abrechnungen erstellen».** Erwartet: Ich finde den Einstieg. Gesehen: Die Karte «Nächster Schritt» nennt die Periode 01.01.2025 – 31.12.2025 und «Noch nicht abgerechnet: Alpenblick». Der Knopf führt in den Assistenten.
2. **Schritt 1.** Erwartet: Ich muss die Periode eingeben. Gesehen: 01.01.2025 und 31.12.2025 sind schon vorgeschlagen, mit Wochentag darunter. Ich klicke auf «Weiter».
3. **Schritt 2, Lesen.** Erwartet: Ich sehe, welche Gebäude ich abrechnen muss. Gesehen: «0 von 3 gewählt» und darunter ««Alle Gebäude» lässt 2 Gebäude aus, deren Mietverträge … schon eine Abrechnung haben». Bei Seepark und Musterhaus steht je ein langer fetter Hinweis (Screenshot `03-step2.png`). Ich verstehe: Dort gibt es schon Abrechnungen, und wenn ich sie wähle, entsteht nichts. Was «Entwurf neu berechnen» bedeutet, verstehe ich nur halb.
4. **«Alle Gebäude» anklicken.** Erwartet: Alle drei werden gewählt. Gesehen: Nur Alpenblick wird gewählt, «Alle Gebäude» hat ein Häkchen, «1 von 3 gewählt». Kurz habe ich gestutzt, dann den Hinweis darüber gelesen und verstanden (P-4). Gleichzeitig erscheint unten «Entwurf gespeichert, 21:37». Ich erschrecke: Habe ich schon etwas erstellt? (P-1)
5. **Seepark trotzdem wählen.** Erwartet: eine Warnung. Gesehen: Seepark wird gewählt, «2 von 3 gewählt», keine weitere Meldung. Der Hinweis sagt ja, dass dafür nichts erstellt wird (P-6). In der Vorschau habe ich das nicht geprüft.
6. **Neu: nur Alpenblick → Schritt 3 «Heizprofil und Verwaltungspauschale».** Gesehen: «Heizung + Warmwasser (100%)», Pauschale 3, «Entwurf gespeichert, 21:37».
7. **Tab schliessen, neuer Tab mit der Browseruhr drei Wochen später, Übersicht.** Erwartet: ein Hinweis auf meine angefangene Arbeit. Gesehen: dieselbe Übersicht wie vorher, nichts zu meinen Angaben.
8. **«Abrechnungen erstellen» wieder öffnen.** Erwartet: Start bei Schritt 1. Gesehen: Ich bin direkt bei Schritt 3. Oben steht der blaue Hinweis «Entwurf wiederhergestellt – Ihre Angaben, zuletzt am 16.10.2026 um 21:37 bearbeitet, sind wieder da.» mit den Knöpfen «Entwurf verwerfen» und «Meldung schliessen» (Screenshot `12-wizard-wieder.png`). Klar ist mir: Ich kann weitermachen, und wann ich zuletzt daran gearbeitet habe. Die Uhrzeit stimmt mit meiner Uhr überein. Unklar bleibt, was genau wiederhergestellt ist. Das habe ich erst über «Gebäude (erledigt)» gesehen: Alpenblick ist gewählt (P-5).
9. **«Meldung schliessen».** Erwartet: Der Hinweis geht weg, die Angaben bleiben. Gesehen: genau so, die Pauschale 2 % blieb erhalten. Nach erneutem Neuladen ist der Hinweis wieder da.
10. **Neuladen, «Entwurf verwerfen».** Erwartet: eine Rückfrage, die sagt, was weg ist. Gesehen: der Dialog «Angaben verwerfen? Ihre Angaben werden gelöscht.» mit «Abbrechen» und dem roten Knopf «Angaben verwerfen» (Screenshot `21-dialog.png`). Ich war unsicher, ob auch meine Abrechnungsentwürfe gelöscht werden (P-1, P-2).
11. **«Angaben verwerfen» bestätigen.** Erwartet: eine kurze Bestätigung. Gesehen: Schritt 1 mit der vorgeschlagenen Periode, ohne Hinweis und ohne Meldung (P-3). Im Netzwerk lief keine Anfrage ausser GET, also wurde am Server nichts gelöscht.
12. **Mobile 390 px**: dieselben Schritte, kein seitliches Scrollen. Der Hinweis und der Dialog sind gut lesbar (Screenshots `31-m-step2.png`, `33-m-restored.png`, `34-m-dialog.png`).

## Verwirrung

- **«Entwurf»**: einmal meine Angaben im Assistenten, einmal die Nebenkostenabrechnung im Status Entwurf (P-1).
- **«Entwurf verwerfen» und «Angaben verwerfen»**: Ich wusste nicht, ob beides dasselbe ist.
- **«Meldung schliessen»**: Erst nach dem Ausprobieren war klar, dass dabei nichts gelöscht wird.
- **«Alle Gebäude» angehakt bei «1 von 3 gewählt»** (P-4).
- **«Entwurf neu berechnen … löschen Sie ihn und erstellen Sie die Abrechnungen erneut»**: Wo lösche ich ihn? Der Hinweis sagt es nicht.
- **«dieses Laufs»** (bei der Verwaltungspauschale): Das Wort kenne ich nicht.

## Fehlerrisiken

- Ich sehe «Entwurf gespeichert» und glaube, meine Abrechnungen seien schon erstellt. Dann höre ich auf und versende nie etwas (P-1).
- Ich traue mich nicht, «Entwurf verwerfen» zu drücken, weil ich Angst um meine Abrechnungsentwürfe habe. Oder ich lösche umgekehrt in der Liste echte Entwürfe, weil ich die Angaben im Assistenten loswerden will (P-1, P-2).
- Ich wechsle das Gerät und meine, Dwello habe meine Angaben verloren (P-5).

## Vorschläge

- **P-1:** Reproduktion: «Abrechnungen erstellen» öffnen → Weiter → ein Gebäude anklicken → unten steht «Entwurf gespeichert». Seite neu laden → «Entwurf wiederhergestellt», «Entwurf verwerfen». Was helfen würde: Für den Assistenten ein anderes Wort als «Entwurf» verwenden, etwa «Angaben gespeichert», «Ihre Angaben sind wieder da», «Angaben verwerfen», und das Wort «Entwurf» nur für die Nebenkostenabrechnungen.
- **P-2:** Reproduktion: Angaben bis Schritt 3, neu laden, «Entwurf verwerfen». Was helfen würde: Der Dialog nennt die Angaben (Periode, Gebäude, Pauschale) und sagt: «Erstellte Nebenkostenabrechnungen bleiben unverändert. Sie beginnen wieder bei Schritt 1.» Knopf und Dialog sollten dasselbe Wort verwenden.
- **P-3:** Reproduktion: wie bei P-2, dann «Angaben verwerfen». Was helfen würde: eine kurze Meldung wie «Ihre Angaben sind verworfen.»
- **P-4:** Reproduktion: Schritt 2 → «Alle Gebäude» (gesetzt, «1 von 3») und im Vergleich dazu nur Alpenblick anklicken (leer, «1 von 3»). Was helfen würde: Das Häkchen bei «Alle Gebäude» sollte immer gesetzt sein, wenn alle abrechenbaren Gebäude gewählt sind, auch nach dem Wiederherstellen. Der Zähler könnte die abrechenbaren Gebäude zählen, etwa «1 von 1 abrechenbaren Gebäuden gewählt».
- **P-5:** Reproduktion: Angaben bis Schritt 3, Tab schliessen, «Abrechnungen erstellen» in einem neuen Tab öffnen. Was helfen würde: Der Hinweis nennt die Periode und die Gebäude («Abrechnungsperiode 01.01.2025 – 31.12.2025, Alpenblick») und sagt: «Die Angaben sind nur in diesem Browser gespeichert.»
- **P-6:** Reproduktion: Schritt 2 mit der Periode 2025, Hinweis bei Musterhaus Zentrum lesen. Was helfen würde: Ein Satz in normaler Schrift, z. B. «Schon abgerechnet: Hier entsteht keine neue Abrechnung.». Den Rest (neu berechnen, versendete Abrechnungen) über einen Link zur Hilfe oder als aufklappbaren Zusatz anbieten.

## Nicht geprüft

- Die Vorschau (Schritt 4) mit dem trotzdem gewählten Seepark: Ich wollte im gemeinsamen Datenbestand nichts anstossen und blieb bei Schritt 3.
- Was beim Wiederherstellen passiert, wenn ein gewähltes Gebäude inzwischen abgerechnet wurde: Dafür hätte ich eine Abrechnung erstellen müssen, das war nicht erlaubt.
- Andere Sprachen und der Dunkelmodus.
- Die Tastaturbedienung und der Screenreader, das ist Svens Teil. Aufgefallen sind mir nur der Fokus nach «Meldung schliessen» und die fehlenden Gebäudehinweise im Bedienbaum (siehe Beobachtungen).
- Eine andere Zeitzone im Browser als UTC: Für Anna in der Schweiz stimmte die Uhrzeit, andere Zeitzonen habe ich nicht ausprobiert.
