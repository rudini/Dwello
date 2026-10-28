# Marco – Zugangsschlüssel für KI-Programme auf dem Telefon (#817)

Persona: Marco, 38, Telefon 390 × 844, Touch. App: http://localhost:3300 (persona-stack, Demo-Daten).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-817/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Zugangsschlüssel für KI-Programme, Kasten «Neuer Zugangsschlüssel» | Es gibt keine Schaltfläche zum Kopieren, obwohl dort «Kopieren Sie den Schlüssel jetzt» steht. Auf dem Telefon bleibt nur langes Drücken. Damit wird aber nur ein «Wort» markiert, und das endet am Bindestrich im Schlüssel: Markiert wurde `dwello_lDY3…FgIoG`, das Ende `-bSzdc` fehlte. Ich kopiere also leicht einen unvollständigen Schlüssel und merke es erst, wenn das KI-Programm nicht geht. Dann ist der Schlüssel weg, denn Dwello zeigt ihn nur einmal. |
| P-2 | Minor | Zugangsschlüssel für KI-Programme, «Adresse für das KI-Programm» | Auch die Adresse hat keine Schaltfläche zum Kopieren. Langes Drücken markiert nur «localhost». Markiere ich den ganzen Absatz, ist «Adresse für das KI-Programm:» mit dabei. Ausserdem bricht die Adresse nach «http://localhost:» um, und «3300/mcp» steht auf der nächsten Zeile. Abtippen geht so schlecht. |
| P-3 | Minor | Zugangsschlüssel für KI-Programme, nach «Zugangsschlüssel erstellen» | Nach dem Erstellen bleibt die Seite oben, und der Fokus liegt wieder auf «Zugangsschlüssel erstellen». Vom neuen Schlüssel sehe ich unten am Bildschirmrand nur den Rahmen und die Überschrift «Neuer Zugangsschlüssel», den Schlüssel selbst nicht. Es sieht kurz so aus, als sei nichts passiert. Da hätte ich fast nochmals auf «Erstellen» getippt. |
| P-4 | Minor | Zugangsschlüssel für KI-Programme, Meldung nach «Widerrufen» | Die Bestätigung lautet «Zugangsschlüssel «» widerrufen», der Name fehlt. Bei drei Schlüsseln bin ich mir so nicht sicher, welchen ich widerrufen habe. Dreimal gleich, also reproduzierbar. Die Meldung liegt ausserdem unten über der ersten Karte der Liste. |

## Beobachtungen

- Die Seite war leicht zu finden: Benutzermenü › «Einstellungen» › Karte «Zugangsschlüssel für KI-Programme». Die Beschreibung «Lesezugriff … mit Ablauf nach 90 Tagen» sagt kurz, worum es geht.
- Auf dem Telefon scrollt nichts seitlich: Die Breite blieb auf allen Seiten bei 390 px (Liste, Dialog Erstellen, neuer Schlüssel, Dialog Widerrufen, Datenschutzerklärung).
- Der lange Schlüssel bricht im Kasten sauber um (zwei Zeilen, Festbreitenschrift) und ist ganz zu sehen. Das Sehen ist also gelöst, das Kopieren nicht (P-1).
- Der Hinweis «Wer den Schlüssel hat, kann Ihre Daten lesen … nicht in eine Nachricht an das Programm» ist klar und kurz.
- Der Dialog «Zugangsschlüssel erstellen» erscheint unten als Blatt. Feld und Knöpfe sind 48 px hoch, es gibt einen Hilfetext mit Beispiel («Claude Desktop Büro»). Ohne Namen kommt «Das hat nicht geklappt / Geben Sie dem Zugangsschlüssel einen Namen.»: verständlich.
- Liste: Jede Karte zeigt Name, «Erstellt am … · Noch nie benutzt · Läuft ab am …» und «Widerrufen» in voller Breite. Gut zu treffen. Für den Screenreader heisst jeder Knopf «Zugangsschlüssel «Name» widerrufen».
- Der Dialog «Zugangsschlüssel widerrufen» nennt den Namen und die Folge («erhält danach keine Daten mehr. Das lässt sich nicht rückgängig machen.»). Der rote Knopf «Widerrufen» steht oben, «Abbrechen» darunter, beide gross. «Abbrechen» schliesst ohne Folgen.
- Ist die Liste leer, steht dort «Noch kein Zugangsschlüssel» mit einem kurzen Satz, was zu tun ist.
- Unter dem Pfad «Einstellungen ›» steht der Seitentitel klein und gleich darunter nochmals gross. Auf dem Telefon kostet das Platz.
- Der Link «Datenschutz» im Hinweis öffnet die Datenschutzerklärung im selben Tab, direkt beim Abschnitt «KI-Programme mit Zugangsschlüssel» (`/privacy#ai-keys`). Tippe ich ihn an, während der neue Schlüssel noch angezeigt wird, ist der Schlüssel weg. Der Hinweis sagt zwar «Bevor Sie einen Schlüssel erstellen», aber der Link bleibt auch danach dort.
- Abschnitt «KI-Programme mit Zugangsschlüssel» in der Datenschutzerklärung: Er ist auf dem Telefon gut lesbar und scrollt nicht seitlich. Er hat vier Absätze: welche Daten das Programm liest, dass es nach eigenen Regeln arbeitet, was ich beim Anbieter prüfen muss (Art. 9, 16, 19 DSG) und Ablauf und Speicherung. Für mich ist das viel Rechtstext. Was ich konkret tun muss, steht mitten im dritten Absatz: Vertrag mit dem Anbieter prüfen, Mietern Programm, Anbieter und Land nennen. Eine kurze Liste wäre schneller. «Hash» wird in Klammern erklärt («umgerechnete Form»), das reicht.
- Andere Personas haben während meines Laufs eigene Schlüssel erstellt und widerrufen (anfangs «Helga Test Kopieren», «Helga Computer Neffe»). Die habe ich nicht angefasst.

## Aufgabe geschafft: teilweise

Erstellen, Ansehen, Widerrufen und die Datenschutzerklärung gingen. Den Schlüssel vollständig zu kopieren gelang mit Touch nur über Umwege (Markieren per Ziehen statt Kopierknopf). Mit dem üblichen langen Drücken fehlte das Ende (P-1).

## Aufwand

Etwa 15 Minuten, 13 Skriptläufe. Bis zum Erstellen 4 Tipps (Menü, Einstellungen, Karte, Erstellen) plus Name und Bestätigen. Widerrufen braucht pro Schlüssel 2 Tipps. Ich habe drei eigene Schlüssel erstellt («Marco Handy Claude», «Marco Handy Zweitversuch», «Marco Handy Drittversuch»), um Kopieren und Fokus nachzuprüfen, und alle drei wieder widerrufen.

## Ablauf

1. Auf «Zugangsschlüssel erstellen» im Dialog getippt. Erwartet: Der neue Schlüssel steht vor mir, mit «Kopieren». Gesehen: Die Seite bleibt oben, nur die Überschrift des neuen Kastens ragt unten ins Bild (P-3).
2. Schlüssel kopieren wollen. Erwartet: ein Knopf «Kopieren». Gesehen: kein Knopf, nur Text in einem Kasten. Langes Drücken (Wortauswahl) markierte nur bis zum Bindestrich (P-1). Erst mit Auswahl des ganzen Kastens stand der vollständige Schlüssel in der Zwischenablage.
3. Adresse kopieren wollen. Erwartet: Knopf oder wenigstens markierbar. Gesehen: Wortauswahl ergibt «localhost», Absatzauswahl enthält die Beschriftung (P-2).
4. Widerrufen bestätigt. Erwartet: «Zugangsschlüssel «Marco Handy Claude» widerrufen». Gesehen: «Zugangsschlüssel «» widerrufen» (P-4).

## Vorschläge

- **P-1:** Einstellungen › Zugangsschlüssel für KI-Programme › «Zugangsschlüssel erstellen», Namen eingeben, bestätigen. Im Kasten «Neuer Zugangsschlüssel» lange auf den Schlüssel drücken: Markiert wird nur der Teil bis zum ersten «-» (Screenshot `09-crop.png`, Lauf `s9.mjs`). Hilfreich: ein Knopf «Schlüssel kopieren» mit kurzer Bestätigung «Kopiert» direkt unter dem Schlüssel. Oder der Schlüssel in einem schreibgeschützten Feld, das beim Antippen alles markiert.
- **P-2:** Gleiche Seite, lange auf die Adresse drücken: markiert «localhost». Hilfreich: Die Adresse auf eine eigene Zeile, ohne die Beschriftung, und mit einem eigenen Knopf «Adresse kopieren».
- **P-3:** Schlüssel erstellen auf 390 × 844: Die Seite bleibt bei scrollY 0, der Fokus liegt auf dem Knopf oben (`09-created-view.png`). Hilfreich: zum Kasten «Neuer Zugangsschlüssel» scrollen und den Fokus auf seine Überschrift setzen.
- **P-4:** Bei einem eigenen Schlüssel «Widerrufen» antippen und im Dialog «Widerrufen» bestätigen. Die Meldung zeigt «Zugangsschlüssel «» widerrufen» (`13-after-revoke.png`). Hilfreich: den Namen des widerrufenen Schlüssels einsetzen, wie es der Dialog schon tut.

## Nicht geprüft

- Echtes Kopieren mit den Griffen eines Telefons (Android/iOS): Das headless Chromium kennt keine Auswahl-Griffe. Langes Drücken habe ich mit der Wortauswahl (Doppelklick) nachgestellt. Die vollständige Auswahl des Kastens samt Kopieren in die Zwischenablage gelang per Skript.
- Ob ein KI-Programm mit dem Schlüssel und der Adresse tatsächlich Daten erhält: Auf der Persona-Instanz ist kein KI-Programm angebunden, und das gehört nicht zur Aufgabe.
- Dunkler Modus und andere Sprachen: nicht Teil der Aufgabe.
