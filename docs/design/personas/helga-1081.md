# Helga – Bestätigungsmeldungen (#1081)

Desktop 1440 × 900, Zoom 150 % (Teile mit 200 % wiederholt), Maus. App: http://localhost:3300 (Persona-Stack, Demodaten). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1081/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen › Zugangsschlüssel für KI-Programme | Nach «Zugangsschlüssel erstellen» erscheint keine Meldung, und der neue Schlüssel steht unterhalb des sichtbaren Bereichs. Bei 150 % sehe ich ganz unten nur die Überschrift «Neuer Zugangsschlüssel», bei 200 % ändert sich im Fenster gar nichts. Ich hätte fast noch einmal auf «Zugangsschlüssel erstellen» geklickt. |
| P-2 | Minor | Zugangsschlüssel, Kasten «Neuer Zugangsschlüssel» | Nach jedem Klick auf «Schlüssel kopieren» oder «Adresse kopieren» rollt die Seite etwa eine halbe Sekunde später von selbst nach oben (bei 150 % etwa 2 cm, bei 200 % etwa 3 cm). Die Knöpfe rutschen unter der Maus weg. Bei 200 % ist nach dem zweiten Kopieren der Schlüssel selbst mit dem Satz «Kopieren Sie den Schlüssel jetzt …» oben aus dem Fenster gerollt. |
| P-3 | Minor | Einstellungen › Kategorien | Nach «Löschen» einer Kategorie springt die Seite ganz nach oben. Ist die Meldung «… gespeichert» noch zu sehen, stehen zwei Meldungen übereinander. Bei 200 % decken sie fast die halbe Seite ab, auch den Einleitungstext. |
| P-4 | Minor | Einstellungen › Kategorien, nach «Kategorie speichern» | Bei 150 % deckt die Meldung «Kategorie «Helga Blumenschmuck» gespeichert» etwa 8 Sekunden lang genau die Zeile meiner neuen Kategorie ab: «Nicht umlagefähig», «0 Rechnungen» und «Löschen». Ob ich «Nicht umlagefähig» richtig gewählt hatte, konnte ich erst danach sehen. Bei 200 % ist die neue Kategorie gar nicht im Fenster. |
| P-5 | Minor | Zugangsschlüssel, nach dem Widerrufen | Die Meldung lautet «Zugangsschlüssel «Helga Test 200» widerrufen». So heisst auch das Fenster, in dem ich vorher gefragt wurde. Ich habe zuerst gemeint, Dwello frage mich noch einmal, statt mir zu sagen, dass es erledigt ist. |

## Beobachtungen

- Alle Meldungen sind gut zu lesen: grosse Schrift, grünes Häkchen und ein klarer Text mit dem Namen in «…». Das «X» zum Schliessen ist gross genug (48 px) und schliesst genau eine Meldung, die Seite springt dabei nicht.
- Eine Meldung verschwindet nach etwa 8 Sekunden von selbst, auch wenn ich mit der Maus darauf zeige. Für die kurzen Sätze hat mir das gereicht. Bei zwei Meldungen übereinander wurde es knapp.
- Das Kopieren hat funktioniert: Im Zwischenspeicher stand der Schlüssel (`dwello_…`) und danach `http://localhost:3300/mcp`. Die Meldungen «Der Schlüssel ist kopiert.» und «Die Adresse ist kopiert.» erscheinen unten rechts. Die Knöpfe, die ich gerade benutzt hatte, bleiben dabei sichtbar und frei.
- Bei 150 % und 200 % deckt die Meldung nach dem Kopieren rechts in der Zeile «Helga Test» das «Widerrufen» und die Daten teilweise ab. Benutzt habe ich dort nichts, ich habe es nur bemerkt.
- Beim Dokument hochladen (Maria Rossi): Die Meldung «Dokument «Hausordnung Helga» hochgeladen» deckt nichts vom Formular ab. Das Formular wird geleert, und die Seite bleibt ruhig (bei 200 % gleicht Dwello das neue Dokument oben aus). Das neue Dokument steht aber oberhalb des Fensters. Ich sehe nur das leere Formular und muss mich auf die Meldung verlassen.
- Nach dem Löschen eines Dokuments deckt die Meldung das Ende des Hilfetexts «… Löschen Sie Ausweiskopien u…» ab.
- Bei 150 % sind «Einstellungen» und «Mieter» nur über das Menü-Symbol (drei Striche) oben links zu erreichen.
- Beim Widerrufen einer Meldung war die Meldung nach 0,4 Sekunden noch nicht sichtbar, nach etwa 1 Sekunde dann schon.

## Aufgabe geschafft: ja

## Aufwand

Etwa 30 Minuten, rund 60 Schritte. Darin enthalten sind die Wiederholung mit 200 % und das Aufräumen meiner Zusatzdatensätze.

Was jetzt von mir da ist: der aktive Zugangsschlüssel «Helga Test» und bei Maria Rossi das Dokument «Hausordnung Helga». Selbst angelegt und wieder entfernt habe ich zwei Schlüssel (den ersten «Helga Test», weil sich ein Schlüssel nur einmal kopieren lässt, und «Helga Test 200»), das Dokument «Hausordnung Helga 200» und die Kategorien «Helga Blumenschmuck», «Helga Blumenschmuck 200» und «Helga Zeitmessung».

## Ablauf

- Einstellungen öffnen: Ich erwartete einen Eintrag in der Kopfzeile, sah aber nur Menü-Symbol, Sprache und Namen. «Einstellungen» stand im Menü hinter dem Symbol.
- Schlüssel erstellen: Ich erwartete eine Meldung oder den Schlüssel im Blick. Ich sah aber dieselbe Seite wie vorher, nur ganz unten am Rand «Neuer Zugangsschlüssel», bei 200 % gar nichts (P-1).
- Schlüssel kopieren (Knöpfe unten im Fenster): Ich erwartete, dass die Meldung erscheint und die Seite stillsteht. Die Meldung kam, und kurz danach rollte die Seite hoch, der Knopf rutschte unter der Maus weg (P-2). An der Stelle, wo die Maus noch stand, war bei 200 % danach die Zeile «Helga Test 200».
- Adresse kopieren: Ich erwartete eine zweite Meldung. Sie kam unter die erste, und die Seite rollte noch einmal hoch. Bei 200 % war der Schlüssel danach nicht mehr im Fenster (P-2).
- Dokument hochladen: Ich erwartete das neue Dokument in der Liste vor Augen. Ich sah aber das leere Formular und die Meldung, das Dokument stand weiter oben (Beobachtung).
- Kategorie speichern: Ich erwartete meine neue Kategorie zu sehen. Ihre Zeile war zur Hälfte unter der Meldung (150 %) oder gar nicht im Fenster (200 %) (P-4).
- Kategorie löschen: Ich erwartete, an derselben Stelle zu bleiben. Die Seite sprang an den Anfang, mit zwei Meldungen übereinander (P-3).
- Schlüssel widerrufen (Aufräumen): Ich erwartete «… ist widerrufen». Die Meldung «Zugangsschlüssel «…» widerrufen» las sich aber wie eine Frage oder ein Knopf (P-5).

## Vorschläge

- **P-1:** Einstellungen › Zugangsschlüssel für KI-Programme, Zoom 150 % oder 200 %, «Zugangsschlüssel erstellen», Name «Helga Test», im Fenster «Zugangsschlüssel erstellen» bestätigen. Hilfreich wäre, wenn die Seite zum Kasten «Neuer Zugangsschlüssel» rollt oder eine Meldung «Zugangsschlüssel «Helga Test» erstellt» erscheint, damit man sieht, dass es geklappt hat.
- **P-2:** Gleiche Seite, neuen Schlüssel erstellen, so weit rollen, dass «Schlüssel kopieren» knapp über dem unteren Fensterrand steht, «Schlüssel kopieren» und dann «Adresse kopieren» klicken. Hilfreich wäre, die Seite gar nicht oder sofort mit dem Erscheinen der Meldung zu verschieben. Oder die Meldung so hinstellen, dass sie die Knöpfe nicht erreicht, statt die Seite zu rollen. Mindestens sollte der Schlüssel selbst im Fenster bleiben.
- **P-3:** Einstellungen › Kategorien › «Kategorie erfassen», Name eingeben, «Nicht umlagefähig», «Kategorie speichern». Danach innert 8 Sekunden bei der neuen Kategorie «Löschen» klicken und im Fenster bestätigen. Hilfreich wäre, wenn die Seite an der Stelle bleibt und die alte Meldung «gespeichert» verschwindet, sobald «gelöscht» kommt.
- **P-4:** Gleich wie P-3 bis «Kategorie speichern», dann bei 150 % die erste Zeile der Liste ansehen. Hilfreich wäre, die Meldung nicht über die eben gespeicherte Zeile zu legen, sie zum Beispiel zur neuen Zeile zu rollen und die Meldung darüber oder daneben zu zeigen.
- **P-5:** Zugangsschlüssel › bei einem Schlüssel «Widerrufen», im Fenster «Widerrufen» bestätigen. Hilfreich wäre ein Satz, der klar sagt, dass es erledigt ist, etwa «Der Zugangsschlüssel «…» ist widerrufen.», so wie «Der Schlüssel ist kopiert.»

## Nicht geprüft

- Wie die Meldungen im dunklen Modus aussehen: Ich habe nur das helle Aussehen gesehen und keinen Umschalter gesucht.
- Meldungen bei Fehlern (z. B. ein fehlgeschlagener Upload): Die Aufgabe nannte keine Anfrage, die fehlschlagen soll, deshalb habe ich keine scheitern lassen.
- Ob das Kopieren in einem echten Browser ohne erteilte Zwischenspeicher-Erlaubnis gleich funktioniert: Die Erlaubnis habe ich im Testbrowser vorher gegeben.
