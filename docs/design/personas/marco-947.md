# Marco – Slice 947 (#947, #956): Sicherung einrichten und neuer Wiederherstellungscode

Gerät: Smartphone 390 × 844, Touch. Frische Installation auf http://localhost:3300, abgemeldet gestartet, Einrichtungscode `PERS-FRSH`. Skripte und Screenshots: `<scratchpad>/marco-947/` (`/tmp/claude-scratch/marco-947/`).

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Wiederherstellungscode, nach «Neuen Code bestätigen» (`/config/backup?confirmed`) | Nach dem Bestätigen steht die Seite oben, und der ganze lange Erklärtext von vorher (alter Code, 12 Monate, verlorenes Blatt) füllt den Bildschirm. Die grüne Bestätigung «Der neue Wiederherstellungscode gilt ab jetzt …» ist auf dem Handy nur am unteren Rand angeschnitten zu sehen, «Zurück zu den Einstellungen» erst nach dem Scrollen. Ich musste suchen, ob es geklappt hat. |

## Beobachtungen

- «Sicherung einrichten», nur die erste Gruppe («MCLE») eingegeben: Dwello zeigt über dem Feld rot «Der Code ist unvollständig: Sie haben 4 von 24 Zeichen eingegeben. Geben Sie alle 6 Gruppen ein, wie sie oben und auf dem Notfallblatt stehen.» Das ist genau richtig: Es sagt, was fehlt und was zu tun ist. Die Seite scrollt zur Meldung, darunter sehe ich gleich das Feld mit meinem «MCLE» drin. Das Feld behält meine Eingabe, ich muss nur weitertippen.
- Leeres Feld: «Geben Sie den Wiederherstellungscode ein, der oben und auf dem Notfallblatt steht.» Klar und kurz.
- Mit dem ganzen Code (mit Bindestrichen getippt) landet man auf der «Übersicht» mit grünem Hinweis «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» ganz oben. Da ist klar, dass die Einrichtung fertig ist.
- Beim «Neuen Wiederherstellungscode» erscheint bei nur einer Gruppe dieselbe Meldung «4 von 24 Zeichen …» – gleich gut wie bei der Einrichtung.
- Der Code bricht auf dem Handy nach «ZDH3-» in eine zweite Zeile um. Beim Abtippen ging das, weil der Bruch beim Bindestrich ist.
- Der Hinweis sagt «getrennt von diesem Computer aufbewahren». Ich sitze am Handy; das Wort passt für mich nicht ganz, hat mich aber nicht aufgehalten.
- Auf «Neuer Wiederherstellungscode» gibt es vor dem Bestätigen (Passwortschritt und Code-Schritt) keinen Link zurück zu den Einstellungen, nur das Menü. Erst nach der Bestätigung kommt «Zurück zu den Einstellungen».
- «Zurück zu den Einstellungen» führt auf `/config`. Mit der Zurück-Taste des Browsers lande ich wieder auf der Bestätigung «gilt ab jetzt»; dasselbe beim Neuladen von `/config/backup?confirmed`. Kein Problem für mich, aber die Meldung tut so, als hätte ich eben bestätigt.
- Ruft man `/backup` nach der Einrichtung nochmals auf, leitet Dwello auf die «Übersicht» um; den alten Code sieht man nicht mehr.
- Das Feld zum Code hat bei einem Fehler kein `aria-invalid` (nur `aria-describedby` auf den Hilfetext); das ist eher etwas für Sven.
- Das Notfallblatt (PDF) liess sich in beiden Schritten abrufen (Antwort 200, `application/pdf`); ich habe es nicht angeschaut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, rund 20 Schritte (Einrichtung 6, Sicherung 6, Einstellungen bis zur Bestätigung 8).

## Ablauf

- Neuer Code bestätigt (`/config/backup?confirmed`): Erwartet habe ich oben eine deutliche Bestätigung und einen Knopf, um weiterzumachen. Gesehen habe ich wieder den langen Erklärtext; die grüne Meldung erst am unteren Rand, den Knopf «Zurück zu den Einstellungen» erst nach dem Scrollen (Screenshot `13-confirmed-viewport.png`: Titel, der lange Absatz, unten die angeschnittene grüne Meldung).

## Vorschläge

- **P-1:** Einrichten, dann «Menü öffnen» › «Einstellungen» › «Neuer Wiederherstellungscode», Passwort eingeben, «Neuen Code erstellen», den ganzen Code eintippen, «Neuen Code bestätigen» – auf 390 × 844. Die Bestätigung sieht man nur angeschnitten am unteren Rand. Helfen würde, die Bestätigung nach dem Bestätigen oben zu zeigen (direkt unter dem Titel oder mit dem Fokus darauf), so wie auf der «Übersicht» nach der Einrichtung, und den langen Erklärtext dann wegzulassen oder darunter zu stellen.

## Nicht geprüft

- Den Inhalt des Notfallblatts (PDF): nur abgerufen, nicht geöffnet; nicht Teil der Aufgabe.
- Einen falschen, aber vollständigen Code (24 Zeichen mit einem Tippfehler): nicht Teil der Aufgabe, nicht versucht.
- Ein falsches Passwort und das Ablaufen der 30 Minuten beim neuen Code: nicht Teil der Aufgabe, nicht versucht.
- Echtes Einfügen aus der Zwischenablage: Ich habe getippt; die Wirkung (nur die erste Gruppe im Feld) ist dieselbe.
