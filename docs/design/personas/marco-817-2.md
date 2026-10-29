# Marco – Zugangsschlüssel für KI-Programme auf dem Telefon, 2. Runde (#817)

Persona: Marco, 38, Telefon 390 × 844, Touch. App: http://localhost:3300 (persona-stack, neuer Build, Demo-Daten).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-817-2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Zugangsschlüssel für KI-Programme, Kasten «Neuer Zugangsschlüssel» | Im Kasten steht die Adresse nochmals, aber sie bricht mitten im Wort um: «http://loc» und auf der nächsten Zeile «alhost:3300/mcp». Gleich darunter kommt der Knopf «Schlüssel kopieren». Einen Knopf für die Adresse gibt es im Kasten nicht, «Adresse kopieren» steht rund 700 px weiter oben. Wer die Adresse hier abschreibt, schreibt leicht «loc alhost». Und wer den Knopf direkt unter der Adresse antippt, um die Adresse zu kopieren, hat danach den Schlüssel in der Zwischenablage. |

## Frühere Befunde

- **P-1 (kein Kopierknopf für den Schlüssel): erledigt.** Im Kasten gibt es jetzt «Schlüssel kopieren» (48 px hoch). Ein Tipp darauf legte den Schlüssel vollständig in die Zwischenablage, Bindestriche und Ende eingeschlossen. Ich habe es zweimal geprüft: 50 Zeichen, genau gleich wie angezeigt. Danach kommt die Meldung «Kopiert.».
- **P-2 (kein Kopierknopf für die Adresse): erledigt.** Unter «Adresse für das KI-Programm» gibt es jetzt «Adresse kopieren». In der Zwischenablage stand genau `http://localhost:3300/mcp`, ohne die Beschriftung. Oben bricht die Adresse immer noch nach «localhost:» um. Mit dem Knopf muss ich aber nichts mehr abtippen. Zum Umbruch im Kasten siehe den neuen P-1.
- **P-4 (Name fehlt in der Meldung nach dem Widerrufen): erledigt.** Die Meldung lautet jetzt «Zugangsschlüssel «Marco Handy Kopiertest» widerrufen», beim zweiten Schlüssel «Zugangsschlüssel «Marco Handy Zweittest» widerrufen». Beide Meldungen standen kurz übereinander, und jede nannte den richtigen Schlüssel.

## Beobachtungen

- Nichts scrollt seitlich. Die Breite blieb überall bei 390 px: Seite ohne Schlüssel, Dialog «Zugangsschlüssel erstellen», neuer Schlüssel, nach beiden Kopien, Dialog «Zugangsschlüssel widerrufen», nach dem Widerrufen.
- Die Meldung heisst bei beiden Knöpfen nur «Kopiert.». Habe ich zuerst den Schlüssel und dann die Adresse kopiert, sagt sie mir nicht, was jetzt in der Zwischenablage ist. Sie erschien etwa 0,5 Sekunden nach dem Tipp und war nach 6 Sekunden noch da. Sie liegt unten über dem Kasten oder der Liste.
- P-3 aus der ersten Runde ist unverändert, war aber nicht Teil dieser Aufgabe: Nach dem Erstellen bleibt die Seite oben (scrollY 0), und der Fokus liegt auf «Zugangsschlüssel erstellen». Der neue Schlüssel und «Schlüssel kopieren» liegen weit unten, der Knopf bei etwa y = 1260 auf einem 844 px hohen Bildschirm.
- Auf der Seite «Einstellungen» öffnete mein erster Tipp auf die Karte «Zugangsschlüssel für KI-Programme» nichts, ich blieb auf `/config`. Erst nachdem ich die Karte ins Bild gescrollt und nochmals getippt hatte, ging die Seite auf. Möglicherweise kam der Tipp zu früh, bevor die Seite fertig geladen war.
- Andere Personas haben eigene Schlüssel angelegt, darunter «Helga Laptop Neffe». Die habe ich nicht angefasst.

## Aufgabe geschafft: ja

## Aufwand

Etwa 8 Minuten, 5 Skriptläufe. Bis zum neuen Schlüssel: Benutzermenü, «Einstellungen», Karte (zweiter Tipp nötig), «Zugangsschlüssel erstellen», Name, bestätigen. Kopieren: je 1 Tipp. Widerrufen: 2 Tipps pro Schlüssel. Ich habe zwei eigene Schlüssel erstellt: «Marco Handy Kopiertest» und «Marco Handy Zweittest». Den zweiten brauchte ich, um die Meldung nach dem Kopieren nochmals zu prüfen. Beide habe ich wieder widerrufen.

## Ablauf

1. Auf «Einstellungen» die Karte «Zugangsschlüssel für KI-Programme» angetippt. Erwartet: Die Seite geht auf. Gesehen: Beim ersten Tipp blieb ich auf «Einstellungen», erst der zweite Tipp öffnete die Seite.
2. Den neuen Schlüssel angesehen. Erwartet: Adresse gut lesbar, mit eigenem Knopf. Gesehen: Im Kasten bricht die Adresse mitten in «localhost» um, und direkt darunter steht nur «Schlüssel kopieren» (P-1, Screenshot `04-created-full.png`).
3. «Schlüssel kopieren» angetippt. Erwartet: sofort eine Bestätigung. Gesehen: «Kopiert.» erschien erst nach etwa 0,5 Sekunden (`07-keycopy-toast.png`). Der Inhalt der Zwischenablage war vollständig.

## Vorschläge

- **P-1:** Einstellungen › Zugangsschlüssel für KI-Programme › «Zugangsschlüssel erstellen», Namen eingeben, bestätigen, auf 390 × 844. Im Kasten «Neuer Zugangsschlüssel» steht «Adresse für das KI-Programm: http://loc» / «alhost:3300/mcp», darunter «Schlüssel kopieren» (`04-created-full.png`, `05-after-keycopy.png`). Hilfreich: die Adresse im Kasten auf eine eigene Zeile und nicht mitten im Wort umbrechen, mit einem eigenen «Adresse kopieren» daneben. Oder die Adresse im Kasten weglassen, weil sie oben schon mit Knopf steht. Den Knopf «Schlüssel kopieren» direkt unter den Schlüssel.

## Nicht geprüft

- Echtes Einfügen in ein KI-Programm auf einem Telefon: Es ist kein KI-Programm angebunden. Die Zwischenablage habe ich im Browser ausgelesen (Berechtigung im headless Chromium erteilt). Ob ein echtes Telefon-Betriebssystem das Kopieren ohne Nachfrage zulässt, konnte ich nicht prüfen.
- Dunkler Modus, andere Sprachen und Bildschirmleser: nicht Teil der Aufgabe.
