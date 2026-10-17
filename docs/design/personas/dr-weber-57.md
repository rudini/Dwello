# Dr. Weber, Runde 57: Ungespeicherte Angaben in «Mietvertrag erfassen»

Desktop 1440 × 900, Maus, Demo-Daten (http://localhost:3300). Nichts gespeichert, keine Abrechnungen erstellt. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/879b2e8a-9792-5ec1-9fc0-43620631e395/scratchpad/weber-57/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Mietvertrag, «Abbrechen» | «Abbrechen» behält die Angaben im Browser. Beim nächsten Öffnen sind sie wieder da. Weder der Assistent noch die Hilfe noch der Datenschutz sagen das. Ich hatte erwartet, dass «Abbrechen» die Angaben verwirft. |
| P-2 | Minor | Neuer Mietvertrag, Statuszeile | Nach dem Neuladen und nach «Meldung schliessen» ist die Statuszeile leer, obwohl die Angaben weiter im Browser liegen. Sie erscheint erst wieder, wenn ich etwas ändere. |
| P-3 | Minor | Statuszeile und Meldung «Angaben wiederhergestellt» | Beide sagen «nur in diesem Browser», aber nicht, wie lange. Dass die Angaben bleiben, bis ich speichere, verwerfe oder mich abmelde, steht nur im Datenschutz und in der Hilfe. |
| P-4 | Nit | Hilfe, «Mieter und Mietverträge verwalten» | Die Hilfe sagt weniger als der Datenschutz. Es fehlt, dass die Angaben erhalten bleiben, wenn nur die Anmeldung abläuft, und dass sie Beträge und die Auswahl von Mieter und Wohnung enthalten. Die Hilfe schreibt «sich abmelden», der Datenschutz «mit «Abmelden» abmelden». |
| P-5 | Nit | Dialog «Angaben verwerfen?» | «Ihre Angaben werden gelöscht.» nennt nicht, was genau gelöscht wird. Gemeint ist nur die Kopie in diesem Browser, kein gespeicherter Mietvertrag. Der Knopf «Abbrechen» im Dialog behält die Angaben. So heisst das Wort im selben Assistenten zwei Dinge (siehe P-1). |

## Beobachtungen

- Nach dem Neuladen öffnet der Assistent bei «Schritt 1 von 5: Mieter» und nicht bei Schritt 2, wo ich aufgehört hatte. Die Auswahl (Thomas Weber) war wiederhergestellt.
- Die Netzwerkanfragen zeigen: Beim Wählen des Mieters, beim Neuladen, beim Verwerfen und beim Wechsel zu «Nebenkostenabrechnungen» schickte die Seite keine einzige Nicht-GET-Anfrage an den Server. Die Angaben lagen im lokalen Speicher des Browsers unter dem Schlüssel `dwello.draft.v1.contract`, mit der Kennung des Mieters (nicht dem Namen) und einer Zeit. Es kam kein neues Cookie dazu. Das passt zum Datenschutz.
- «Entwurf» hat nur eine Bedeutung. Der Mietvertrags-Assistent zeigt das Wort nirgends, er spricht von «Angaben». In der Übersicht («7 Nebenkostenabrechnungen sind noch im Entwurf») und in der Liste der Nebenkostenabrechnungen (Status «Entwurf») sind Entwürfe Abrechnungen, die gespeichert sind. «Abrechnungen erstellen» sagt das klar: «Es entstehen Entwürfe, die Sie danach prüfen und versenden.» Nur der technische Schlüssel im Browser heisst «draft». Diesen sieht kein Anwender.
- In «Abrechnungen erstellen» blieb ohne eigene Änderung (nur Schritt 1 → 2 mit dem Vorschlag) nichts im Browser liegen. Nach dem Neuladen begann der Assistent wieder bei Schritt 1, ohne Meldung. Das passt zu «ungespeicherte Angaben», gesagt wird es aber nirgends.
- Nach «Angaben verwerfen» und der Bestätigung war der Assistent leer und der Browserspeicher leer. Der Fokus lag auf der Überschrift des Schritts. Eine Bestätigung wie «Angaben verworfen» erschien nicht.
- Im Fortschritt bricht «Vertragsdauer» auf 1440 px mitten im Wort um («Vertragsda / uer»).
- Fusszeile: «Version unbekannt».

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Durchgänge im Browser (Datenschutz und Hilfe lesen, Mieter wählen, neu laden, wegnavigieren und zurück, «Abbrechen», Meldung schliessen, verwerfen, Vergleich mit «Abrechnungen erstellen»).

## Ablauf

1. **Datenschutz, «Welche Daten Dwello speichert».** Ich erwartete eine Aussage zu ungespeicherten Eingaben und fand einen eigenen Absatz dazu. Die Angaben in «Mietvertrag erfassen» und «Abrechnungen erstellen» liegen nur in diesem Browser. Sie bleiben, bis ich speichere oder erstelle, verwerfe oder mich mit «Abmelden» abmelde. Läuft nur die Anmeldung ab, bleiben sie erhalten. Sie können Beträge, Daten und die Auswahl von Mieter und Wohnung enthalten. Lässt der Browser keine Websitedaten zu, bewahrt Dwello nichts auf. Das ist klar und vollständig.
2. **Hilfe, «Mieter und Mietverträge verwalten».** Ich erwartete dieselbe Aussage. Die Hilfe sagt kürzer: «Erst «Mietvertrag speichern» im letzten Schritt legt den Mietvertrag an. Bis Sie speichern, Ihre Angaben verwerfen oder sich abmelden, bewahrt Dwello sie nur in diesem Browser auf.» Inhaltlich stimmt das, es fehlen aber Einzelheiten (P-4).
3. **«Mietvertrag erfassen» öffnen** (über «Mietverträge»). Vor der ersten Eingabe ist die Statuszeile leer. Der Browserspeicher ist leer. So hatte ich es erwartet.
4. **Mieter wählen** (Thomas Weber, Luzern). Ich erwartete einen Hinweis, dass noch nichts gespeichert ist. Unter dem Formular erschien mit Info-Symbol: «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf. Stand: 12:28» (Screenshot 06). Das passt zu beiden Texten. Es ging keine Anfrage an den Server.
5. **«Weiter» zu Schritt 2.** Die Statuszeile steht weiter da, mit derselben Zeit. Dazu kam der Hinweis, dass Thomas Weber schon einen Mietvertrag ohne Vertragsende hat (Screenshot 08).
6. **Neu laden.** Ich erwartete die Meldung über meine Angaben. Oben erschien der Kasten «Angaben wiederhergestellt»: «Ihre Angaben, zuletzt am 17.10.2026 um 12:28 bearbeitet, sind wieder da. Sie sind nur in diesem Browser aufbewahrt und noch nicht gespeichert.» Darunter die Knöpfe «Angaben verwerfen» und «Meldung schliessen» (Screenshot 07). Das passt zu den Texten, nur ohne Angabe, bis wann (P-3). Die Statuszeile unten war jetzt leer (P-2). Der Assistent stand wieder bei Schritt 1.
7. **Wegnavigieren** (Seitenleiste «Nebenkostenabrechnungen») **und zurück.** Ich erwartete, dass die Angaben erhalten bleiben. So war es: dieselbe Meldung, der Mieter war gewählt. Die Liste der Abrechnungen zeigt 7 Mal «Entwurf» für gespeicherte Abrechnungen 2025 (Screenshot 09).
8. **«Abbrechen» im Assistenten.** Ich erwartete, dass meine Angaben verworfen werden, oder wenigstens eine Rückfrage. Ich landete ohne Rückfrage auf «Mietverträge». Beim erneuten Öffnen von «Mietvertrag erfassen» kam wieder «Angaben wiederhergestellt» (Screenshot 12). Die Angaben lagen also weiter im Browser (P-1).
9. **«Meldung schliessen».** Die Meldung verschwand. Die Angaben blieben gewählt und im Browser, aber auf der Seite stand jetzt nichts mehr über «nicht gespeichert» (Screenshot 13, P-2). Erst als ich den Mieter wechselte, erschien die Statuszeile wieder mit neuer Zeit.
10. **«Angaben verwerfen».** Ich erwartete eine Bestätigung mit Folge. Der Dialog «Angaben verwerfen?» kam mit «Ihre Angaben werden gelöscht.» und den Knöpfen «Abbrechen» und «Angaben verwerfen» (Screenshot 14). Nach dem Bestätigen war der Assistent leer und der Browserspeicher leer (Screenshot 15). Das passt zu den Texten.
11. **Vergleich mit «Abrechnungen erstellen».** Ich prüfte, ob «Entwurf» dort dasselbe heisst wie die ungespeicherten Angaben. Es heisst etwas anderes. «Entwürfe erstellen» legt gespeicherte Abrechnungen an, und der Einleitungstext sagt das (Screenshots 16, 17). Ein Widerspruch zum Mietvertrags-Assistenten entsteht nicht, weil dieser das Wort «Entwurf» nicht braucht.

## Verwirrung

- **«Abbrechen»:** Für mich heisst Abbrechen «weg damit». Hier heisst es «Seite verlassen, Angaben behalten». Im Verwerfen-Dialog heisst es «nicht verwerfen». Ohne P-1 hätte ich geglaubt, mit «Abbrechen» sei alles gelöscht.
- **«aufbewahren» und «speichern»:** Juristisch ist auch das Ablegen im Browser ein Speichern. Die Texte unterscheiden durchgehend und sauber: «aufbewahren» heisst im Browser, «speichern» heisst bei Dwello. Ich habe das verstanden, aber erst durch den Datenschutz. Die Statuszeile setzt den Unterschied voraus.
- **«Stand: 12:28»:** Gemeint ist die Zeit der letzten Änderung, ohne Datum. In der Meldung steht dagegen Datum und Zeit. Das ist eine Kleinigkeit, aber uneinheitlich.

## Fehlerrisiken

- Auf einem gemeinsam genutzten Computer bleiben nach «Abbrechen» oder nach dem Schliessen des Tabs die Auswahl eines Mieters und Beträge im Browser liegen. Der nächste Benutzer sieht sie, wenn er «Mietvertrag erfassen» öffnet. Gelöscht wird nur mit «Angaben verwerfen» oder «Abmelden» (P-1, P-3).
- Wer die Meldung schliesst und Tage später weitermacht, sieht nicht mehr, dass die Angaben noch nicht gespeichert sind. Er könnte den Mietvertrag für angelegt halten (P-2).
- Ist der Mieter gewählt, der schon einen unbefristeten Vertrag hat, ist das gut erklärt. Das betrifft nicht den geprüften Punkt.

## Vorschläge

- **P-1:** Reproduktion: «Mietvertrag erfassen» öffnen, Mieter wählen, «Abbrechen» wählen, «Mietvertrag erfassen» erneut öffnen. Die Meldung «Angaben wiederhergestellt» erscheint. Hilfreich wäre einer von zwei Wegen. Entweder sagt «Abbrechen» das, etwa mit dem Hinweis «Ihre Angaben bleiben in diesem Browser, bis Sie sie verwerfen» oder mit einer Rückfrage «Angaben behalten / verwerfen». Oder die Hilfe und der Datenschutz nennen ausdrücklich, dass «Abbrechen» und das Schliessen der Seite die Angaben nicht löschen.
- **P-2:** Reproduktion: Mieter wählen, Seite neu laden, «Meldung schliessen». Die Statuszeile ist leer, die Angaben sind noch da. Hilfreich wäre, die Statuszeile «Noch nicht gespeichert …» immer zu zeigen, solange Angaben im Browser liegen. Das gilt auch direkt nach dem Wiederherstellen.
- **P-3:** Reproduktion: Mieter wählen und die Statuszeile lesen, dann neu laden und die Meldung lesen. Hilfreich wäre ein kurzer Zusatz in Meldung oder Statuszeile: «bis Sie speichern, Ihre Angaben verwerfen oder sich abmelden».
- **P-4:** Reproduktion: Hilfe, Abschnitt «Mieter und Mietverträge verwalten», mit Datenschutz, Abschnitt «Welche Daten Dwello speichert», vergleichen. Hilfreich wäre in der Hilfe der Satz «Läuft nur die Anmeldung ab, bleiben die Angaben erhalten.» und dasselbe Wort für das Abmelden («mit «Abmelden»»).
- **P-5:** Reproduktion: Mieter wählen, neu laden, «Angaben verwerfen» wählen. Hilfreich wäre der Dialogtext «Ihre noch nicht gespeicherten Angaben werden aus diesem Browser gelöscht. Gespeicherte Mietverträge bleiben unverändert.» Der Knopf «Abbrechen» im Dialog könnte «Angaben behalten» heissen.

## Nicht geprüft

- **Abmelden:** Ich habe mich nicht abgemeldet. Alle Personas teilen dasselbe Konto, und ich wollte die Sitzungen der anderen nicht gefährden. Ob «Abmelden» die Angaben löscht, wie Datenschutz und Hilfe sagen, ist nicht bestätigt.
- **Ablauf der Anmeldung** («Läuft die Anmeldung nur ab, bleiben die Angaben erhalten»): Ich konnte den Ablauf nicht abwarten.
- **Browser ohne Websitedaten:** nicht nachgestellt.
- **Speichern des Mietvertrags** (ob die Angaben danach aus dem Browser verschwinden): laut Auftrag nicht gespeichert.
- **Weitere Schritte** (Vertragsdauer, Miete, Beträge): Ich habe nur den Mieter gewählt. Ob Beträge ebenso aufbewahrt werden, sah ich nur am Inhalt des Browserspeichers (leere Felder für Miete und Akonto), nicht mit eingegebenen Beträgen.
- **Andere Sprachen und mobile Ansicht:** nicht Teil meines Profils.
