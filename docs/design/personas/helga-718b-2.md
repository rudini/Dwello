# Helga – Slice 718b, zweiter Durchgang: «Sicherung einrichten»

Frische Installation auf http://localhost:3310, abgemeldet und ohne Persona-Cookie gestartet. Desktop 1440 × 900 bei 150 % Zoom, kurz auch bei 200 %, Maus. Konto `helga@dwello.test` mit dem Einrichtungscode PERS-FRSH angelegt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Sicherung einrichten | Die Seite sagt nirgends, was auf dem Notfallblatt steht. Das Wort kommt zum ersten Mal in der Warnung vor («… und das Notfallblatt lässt sich nicht mehr herunterladen»). Dass der Code darauf gedruckt ist, muss ich mir selber zusammenreimen. Ich hätte auch denken können, es reiche, den Code von Hand auf einen Zettel zu schreiben, oder auf dem Blatt stehe nur eine Anleitung. |
| P-2 | Minor | Sicherung einrichten | Unter dem Feld steht «Damit ist sicher, dass Sie den Code haben.» Das stimmt nicht ganz: Ich kann den Code ja einfach vom Bildschirm abtippen, genau wie im ersten Durchgang. Der Satz gibt mir ein falsches Gefühl von Sicherheit, gerade an der Stelle, an der ich auf «Sicherung starten» klicke. |

## Beobachtungen

- Die neue Warnung steht direkt unter dem grossen Code, im selben Kasten und vor dem Knopf «Notfallblatt herunterladen (PDF)». Bei 150 % sehe ich sie ohne zu scrollen, zusammen mit dem Download-Knopf (Bildschirmfoto 03). Bei 200 % ist sie ebenfalls ganz oben und nichts ragt seitlich hinaus (Bildschirmfoto 05). Das Feld und «Sicherung starten» kommen erst danach. Die Reihenfolge führt mich also richtig.
- Die Warnung ist normaler schwarzer Text, ohne Rahmen und ohne Hinweiszeichen. Ich habe sie gelesen, weil ich alles lese. Wer schneller ist, könnte sie überspringen. Der Text selbst ist aber klar: «zeigt Dwello den Code nicht mehr an» und «Notfallblatt lässt sich nicht mehr herunterladen».
- «etwa bei Ihren Mietverträgen» finde ich hilfreich, so weiss ich, wohin damit.
- Nach dem Klick auf «Notfallblatt herunterladen (PDF)» lädt der Browser die Datei «Notfallblatt-Dwello.pdf» herunter. Die Seite selbst ändert sich nicht und bestätigt nichts. Ich wusste nicht recht, ob es geklappt hat, bis ich die Datei fand.
- Auf dem Notfallblatt steht alles Nötige: der Code (derselbe wie am Bildschirm), das Datum, die Adresse meiner Installation, was im Notfall zu tun ist, und noch einmal der Hinweis, es getrennt vom Computer aufzubewahren. Gut verständlich.
- Den Code habe ich klein und mit Leerzeichen statt Bindestrichen eingetippt (`yfzn 853y …`). Dwello hat ihn angenommen, wie der Hilfetext es verspricht.
- Danach kam ich auf die «Übersicht» mit der Meldung «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» Als ich «Sicherung einrichten» noch einmal aufrufen wollte, kam ich auf die Übersicht. Auch die Adresse des Notfallblatts lieferte kein PDF mehr. Dwello hält also, was die Warnung sagt.
- Der Absatz unten über den Ordner «backups» und die «Person, die Dwello betreut» ist lang. Für mich ist das der Herr, der mir Dwello eingerichtet hat. Den Satz «Fragen Sie sie, ob sie das tut» verstehe ich.

## Aufgabe geschafft: ja

Würde ich das Notfallblatt jetzt vor dem Start herunterladen und ausdrucken? Ja. Die Warnung sagt deutlich, dass Code und Blatt nach dem Start weg sind, und sie steht vor dem Feld. Unklar bleibt nur, was auf dem Blatt steht (P-1), und der Satz unter dem Feld wiegt mich in falscher Sicherheit (P-2).

## Aufwand

Etwa 6 Minuten, rund 10 Schritte: Einrichten (4 Felder, 1 Knopf), Seite lesen, Notfallblatt herunterladen und anschauen, Code eintippen, «Sicherung starten».

## Ablauf

- Notfallblatt herunterladen. Erwartet: Die Seite sagt mir, dass das Blatt heruntergeladen ist, oder sie öffnet es. Gesehen: Die Seite blieb gleich, nur der Browser hat die Datei geladen.
- Text unter dem Feld. Erwartet: ein Hinweis, dass ich den Code vom Blatt abtippen soll. Gesehen: «Damit ist sicher, dass Sie den Code haben», obwohl der Code noch gross darüber steht (P-2).

## Vorschläge

- **P-1:** Fertig einrichten, auf «Sicherung einrichten» die Warnung unter dem Code lesen. Helfen würde ein Halbsatz, der sagt, was auf dem Blatt ist, etwa «Auf dem Notfallblatt stehen der Code und was im Notfall zu tun ist.»
- **P-2:** Gleiche Seite, Hilfetext unter «Wiederherstellungscode erneut eingeben». Helfen würde, mich zum Blatt zu schicken statt eine Sicherheit zu versprechen, etwa «Tippen Sie den Code vom ausgedruckten Notfallblatt ab. So sehen Sie, dass das Blatt stimmt.»

## Nicht geprüft

- Das Ausdrucken selbst: Der Testbrowser hat keinen Drucker. Den Inhalt des PDF habe ich als Text gelesen, nicht als gedruckte Seite angeschaut.
- Dunkles Erscheinungsbild und andere Sprachen: gehörten nicht zur Aufgabe.

## Triage (caller)

- Closes helga-718b P-1: Helga would now print the sheet before starting the Sicherung.
- P-1, P-2 (Minor): stay. Both change texts the fach-reviewer decided in rounds 1 to 4; a new wording would need its own round.
