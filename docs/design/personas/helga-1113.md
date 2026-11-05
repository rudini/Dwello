# Helga, Runde 1113: Bestätigungsmeldungen am unteren Fensterrand

Desktop 1440 × 900 bei 150 % (CSS-Fenster 960 × 600) und 200 % (720 × 450), Maus. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1113/`.

Die Bestätigung erscheint rechts unten, etwa eine halbe Sekunde nach dem Klick, und bleibt rund 7 Sekunden stehen. Sie weicht dem Knopf aus, den ich gerade gedrückt habe (dann rutscht sie nach oben rechts), aber nicht den Nachbarknöpfen derselben Reihe. Nach «Änderungen speichern» liegt der Fokus auf der Überschrift «Kategorien», nicht auf meiner Zeile; dann bleibt die Meldung unten und deckt den «Löschen» meiner Zeile zu.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Zugangsschlüssel, Kasten «Neuer Zugangsschlüssel» | Nach «Schlüssel kopieren» liegt «Der Schlüssel ist kopiert.» über den Nachbarknöpfen derselben Reihe: bei 150 % über 56 % von «Schliessen» (nur «Sc» sichtbar), bei 200 % über 84 % von «Schliessen» (ganz verdeckt) und 70 % von «Adresse kopieren» (nur der linke Rand mit dem Symbol sichtbar). Ein Klick dorthin, wo der Knopf war, trifft die Meldung und tut nichts: Der Kasten bleibt offen, und bei 200 % wird die Adresse nicht kopiert, während weiter «Der Schlüssel ist kopiert.» dasteht. |
| P-2 | Major | Zugangsschlüssel, Kasten «Neuer Zugangsschlüssel», 150 % | Nach «Adresse kopieren» bleibt die Meldung «Die Adresse ist kopiert.» unten und deckt «Schliessen» wieder zur Hälfte zu; ein Klick auf die Mitte von «Schliessen» tut nichts. (Bei 200 % rutscht dieselbe Meldung nach oben, dort ist «Schliessen» frei.) |
| P-3 | Major | Einstellungen → Kategorien, nach «Änderungen speichern» | Zurück in der Liste steht «Helga Test A» als erste Zeile genau am unteren Fensterrand; die Meldung «Kategorie «Helga Test A» gespeichert» deckt «Löschen» dieser Zeile zu 72 % (150 %) bzw. 84 % (200 %, nach dem Scrollen um eine Zeile) zu, dazu die Plakette «Umlagefähig» und «0 Rechnungen». Ein Klick auf «Löschen» trifft die Meldung, der Löschen-Dialog öffnet nicht. Der Fokus steht dabei auf der Überschrift «Kategorien», nicht auf der Zeile, die ich gerade bearbeitet habe. |

## Beobachtungen

- Revoke eines Schlüssels: Die Meldung «Zugangsschlüssel «Helga Laptop» widerrufen» lag bei 150 % und 200 % nicht über «Widerrufen» von «Helga Tablet»; der Klick darauf öffnete den richtigen Dialog («… «Helga Tablet» erhält danach keine Daten mehr …»), ich habe abgebrochen.
- Kategorie löschen: Nach dem Löschen springt der Fokus auf die nächste Zeile («Helga Test B» bzw. «Heizung»), und die Meldung «… gelöscht» rutscht nach oben rechts. «Löschen» von «Helga Test B» war frei und öffnete den Dialog. So hätte ich es mir auch nach dem Speichern gewünscht.
- Oben rechts liegt die Meldung über «Deutsch» und dem Benutzermenü und bei 200 % über dem oberen Rand von «Nicht umlagefähig (9)». Das hat mich diesmal nicht gestört.
- Bei 200 % deckt die Meldung unten auch den Text «Adresse für das KI-Programm: http://…» zu; ich konnte die Adresse nicht lesen, solange sie da war.
- Wenn ich einen Schlüssel widerrufe, während der Kasten «Neuer Zugangsschlüssel» eines anderen Schlüssels noch offen ist, verschwindet der Kasten und mit ihm der neue Schlüssel, ohne Warnung. Hätte ich ihn noch nicht kopiert, wäre er weg («Dwello zeigt ihn nur dieses eine Mal»).
- «Zugangsschlüssel «Helga Laptop» widerrufen» liest sich für mich wie eine Aufforderung, nicht wie «wurde widerrufen».
- Gleich nach dem Laden reagierte «Widerrufen» einmal nicht auf den ersten Klick (der Dialog kam erst, als die Seite fertig geladen war).
- Eine neue umlagefähige Kategorie liess sich ohne «Von der KI prüfen lassen» speichern; neue Kategorien stehen zuoberst in der Liste.

## Aufgabe geschafft: ja

Beide Schlüssel erstellt, kopiert, «Helga Laptop» widerrufen (bei 150 % und 200 %; «Helga Tablet» der letzten Runde bleibt stehen). «Helga Test A» und «Helga Test B» erstellt, die Beschreibung von A bei 150 % und 200 % geändert, A bei 150 % und B bei 200 % gelöscht.

Ob der Klick auf den sichtbaren Knopf funktionierte:

| Fall | Zoom | Meldung über … | Klick |
|---|---|---|---|
| «Schlüssel kopieren» unten, danach «Adresse kopieren» | 150 % | nichts (0 %) | ja, Adresse in der Zwischenablage |
| «Schlüssel kopieren» unten, danach «Schliessen» | 150 % | «Schliessen» 56 % | Mitte: nein, nichts passiert; sichtbares «Sc» (linker Teil): ja |
| «Adresse kopieren» unten, danach «Schliessen» | 150 % | «Schliessen» 56 % | sichtbarer linker Teil: ja |
| «Schlüssel kopieren» unten, danach «Adresse kopieren» | 200 % | «Adresse kopieren» 70 % | Mitte: nein, nichts kopiert; linker Rand: ja |
| «Schlüssel kopieren» unten, danach «Schliessen» | 200 % | «Schliessen» 84 % | Mitte: nein; sichtbar ist nur ein Streifen am unteren Rand |
| «Adresse kopieren» unten, danach «Schliessen» | 200 % | nichts (Meldung oben) | ja |
| «Helga Laptop» widerrufen, danach «Widerrufen» von «Helga Tablet» | 150 % / 200 % | nichts | ja, Dialog öffnet |
| «Änderungen speichern» A, danach «Löschen» von A | 150 % | «Löschen» 72 % | Mitte: nein, kein Dialog |
| «Änderungen speichern» A, danach «Löschen» von A | 200 % | «Löschen» 84 % | Mitte: nein, kein Dialog |
| A gelöscht, danach «Löschen» von B (Fokus) | 150 % | nichts (Meldung oben) | ja, Dialog öffnet |
| B gelöscht, Fokus auf «Heizung» | 200 % | nichts (Meldung oben) | Link «Heizung» ja (Bearbeiten-Seite öffnete, nichts gespeichert) |

## Aufwand

Etwa 35 Minuten, rund 70 Schritte (Klicks, Eingaben, Scrollen), davon etwa 15 für das Aufräumen meiner eigenen Schlüssel aus Vorversuchen.

## Ablauf

- Schlüssel kopiert, erwartet: Meldung lässt die Knöpfe daneben frei. Gesehen: bei 150 % ist «Schliessen» bis auf «Sc» zu, bei 200 % sind «Adresse kopieren» und «Schliessen» fast ganz zu (`z200-A1-key-copied.png`, `z150-B1-addr-copied.png`).
- Auf «Schliessen» geklickt, erwartet: Kasten zu. Gesehen: nichts passiert, Kasten bleibt (`z150`/`z200-V1-centre-close.png`).
- Bei 200 % auf «Adresse kopieren» geklickt, erwartet: Adresse kopiert. Gesehen: nichts kopiert, die Meldung sagt weiter «Der Schlüssel ist kopiert.»
- «Änderungen speichern», erwartet: zurück bei meiner Zeile, Fokus dort, Meldung frei. Gesehen: Liste von oben, Fokus auf der Überschrift, meine Zeile am unteren Rand, «Löschen» unter der Meldung (`cat-z150-edit-A-1-saved.png`, `cat-z200-edit-A-1b-scrolled.png`).
- Auf «Löschen» geklickt, erwartet: Löschen-Dialog. Gesehen: kein Dialog.

## Vorschläge

- **P-1:** Zugangsschlüssel erstellen, Fenster so scrollen, dass die Reihe «Schlüssel kopieren / Adresse kopieren / Schliessen» am unteren Rand liegt, «Schlüssel kopieren» klicken, dann sofort «Schliessen» bzw. bei 200 % «Adresse kopieren». Hilfe: Die Meldung sollte der ganzen Reihe ausweichen (oder dem Kasten, in dem der Knopf steht), nicht nur dem gedrückten Knopf; oder die Bestätigung direkt am Knopf zeigen («Kopiert»).
- **P-2:** Wie P-1 bei 150 %, aber «Adresse kopieren» klicken, dann «Schliessen». Hilfe: wie P-1.
- **P-3:** Kategorien → «Helga Test A» öffnen, Beschreibung ändern, «Änderungen speichern», bei 200 % eine Zeile hinunterscrollen, «Löschen» der Zeile klicken. Hilfe: Nach dem Speichern den Fokus auf die bearbeitete Zeile setzen (wie nach dem Löschen) und die Meldung der ganzen Zeile ausweichen lassen.

## Nicht geprüft

- Ob die Meldung beim Bewegen der Maus darüber länger stehen bleibt; ich habe nur gewartet, bis sie verschwand (rund 7 Sekunden).
- Das Schliessen der Meldung mit ihrem «×»; ich habe nur auf die verdeckten Knöpfe geklickt.
- «Helga Test A» bei 200 % löschen: A war schon bei 150 % gelöscht; bei 200 % habe ich stattdessen «Helga Test B» gelöscht.
- Den Abschnitt «Adresse kopieren» oben auf der Seite (ausserhalb des Kastens) am unteren Rand: Bei der kurzen Seite kommt er dort nicht hin.
