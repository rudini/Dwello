# Anna – Update auf eine neue Version (#1453)

Persona: Anna, 29, erste Vermieterin, kommt nach Monaten zurück. Desktop 1440 × 900 (Maus), Hinweis und Bestätigung zusätzlich auf Mobile 390 × 844 (Touch). Frische Installation Dwello 1.4.0 auf http://localhost:3300, abgemeldet und ohne Persona-Kit-Cookie gestartet, Anmeldung mit landlord@dwello.test.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fortschrittsfenster «Dwello wird auf Version 1.5.0 aktualisiert» | Sichtbar unterscheiden sich die drei Schritte nur durch Fettschrift: «Herunterladen» (erledigt) und «Neu starten» (folgt) sehen genau gleich aus, grau und normal. «läuft / erledigt / folgt» hört nur ein Screenreader. Ich wusste beim Hinschauen nicht, ob Herunterladen schon fertig ist oder noch kommt. |
| P-2 | Minor | Sicherung einrichten (/backup) mit Update-Hinweis | Nach der Anmeldung landete ich direkt auf «Sicherung einrichten» statt in der Übersicht. Oben steht im Hinweis der Link «Richten Sie zuerst die Sicherung ein», obwohl ich schon auf dieser Seite bin (er springt nur zu `#backup-code-shown`). Dass Dwello mich *wegen des Updates* hierher geschickt hat, musste ich mir selbst zusammenreimen. |

## Beobachtungen

- Der Hinweis «Neue Version verfügbar: Dwello 1.5.0 ist verfügbar (Sie haben 1.4.0) …» ist oben gut sichtbar und klar. Dass das Update «einige Minuten» dauert und die Daten erhalten bleiben, beruhigt mich.
- Die Bestätigung «Dwello jetzt aktualisieren?» sagt genau, was passiert (herunterladen, sichern, neu starten, so lange nicht nutzbar, ungespeicherte Eingaben gehen verloren). Der Fokus springt auf «Abbrechen», Escape schliesst das Fenster, und der Fokus steht danach wieder auf «Aktualisieren». Das finde ich gut.
- Fortschrittsfenster: «Danach sehen Sie wieder die Seite, auf der Sie waren.» So war es auch: nach etwa 6 s war ich wieder in der Übersicht.
- Nach dem «Update» zeigte nichts an, dass es geklappt hat. Es kam derselbe Hinweis wie vorher (der Platzhalter bleibt auf 1.4.0, das ist laut Auftrag kein Befund). Ob bei einem echten Update eine Bestätigung wie «Dwello ist jetzt auf 1.5.0» erscheint, konnte ich nicht sehen. Ich würde eine erwarten, sonst schaue ich nur unten in der Fusszeile auf die Versionsnummer.
- «Später» blendet den Hinweis sofort aus, auch beim Seitenwechsel und beim Neuladen. Nach Abmelden und erneuter Anmeldung ist er wieder da. Das ist für mich sinnvoll, aber vorher sagt Dwello nicht, wann der Hinweis zurückkommt.
- «Was ist neu?» öffnet GitHub in einem neuen Tab. Der Link sagt nicht, dass er die Seite verlässt oder einen neuen Tab öffnet.
- Der Hinweis zur Sicherung erklärt gut, warum sie vor dem Update nötig ist: «Vor dem Update sichert Dwello Ihre Daten. Dafür muss die Sicherung eingerichtet sein.» Die Seite selbst (Code, Notfallblatt, Code erneut eingeben) ist verständlich.
- Mobile: Der Hinweis bricht sauber um, ohne seitliches Scrollen (Breite 390). «Aktualisieren» und «Später» sind 48 px hoch. Im Bestätigungsfenster steht «Jetzt aktualisieren» oben und «Abbrechen» darunter. «Später» steht allein in einer eigenen Zeile unter den anderen Schaltflächen und wirkt etwas verloren.
- Während ich auf der Sicherungsseite war, hat eine andere Persona die Sicherung eingerichtet. Beim nächsten Laden kam ich auf die Übersicht mit «Aktualisieren». Der Code, den ich gesehen hatte, gilt damit nicht mehr. Das ist die geteilte Installation, kein Befund.
- Auf den ganzseitigen Screenshots deckt der dunkle Hintergrund hinter dem Fenster nur den sichtbaren Bereich ab. So zeichnet Playwright ganzseitige Screenshots. Im Bild ohne Scrollen ist alles abgedeckt.

## Aufgabe geschafft: ja

Den Hinweis habe ich gesehen und das Update ausgelöst und durchlaufen. «Später» und die erneute Anmeldung habe ich auch ausprobiert. Die Sicherung habe ich nicht selbst fertig eingerichtet, weil eine andere Persona schneller war (siehe Nicht geprüft).

## Aufwand

Etwa 10 Minuten, rund 12 Schritte: Anmelden, Sicherungsseite lesen, Notfallblatt (versucht), Übersicht, Aktualisieren, Bestätigen, Fortschritt abwarten, Später, Seitenwechsel, Abmelden, Anmelden, Mobile.

## Ablauf

- **Nach der Anmeldung:** Erwartet hatte ich die Übersicht mit «Was ist zu tun». Gesehen habe ich direkt «Sicherung einrichten» (/backup), oben der Hinweis auf 1.5.0 mit dem Link «Richten Sie zuerst die Sicherung ein» und «Später», aber ohne «Aktualisieren» (P-2).
- **Notfallblatt herunterladen:** Erwartet hatte ich ein PDF. Gesehen habe ich beim nächsten Laden die Übersicht statt der Sicherungsseite, die Sicherung war inzwischen von jemand anderem eingerichtet. Kein Download.
- **Fortschrittsfenster:** Erwartet hatte ich, dass ich sehe, welcher Schritt erledigt ist. Gesehen habe ich nur, dass der laufende Schritt fett ist. Erledigte und folgende Schritte sehen gleich aus (P-1).
- **Nach dem Neustart:** Erwartet hatte ich eine Meldung, dass das Update fertig ist. Gesehen habe ich die Übersicht mit demselben Hinweis wie vorher (Platzhalter, siehe Beobachtungen).

## Vorschläge

- **P-1:** Anmelden, «Aktualisieren», «Jetzt aktualisieren», bei Schritt 2 hinschauen: «Herunterladen» und «Neu starten» sehen gleich aus. Hilfreich wäre ein sichtbares Zeichen pro Schritt, etwa ein Häkchen bei erledigten Schritten oder die Wörter «erledigt / läuft / folgt», die der Screenreader schon vorliest.
- **P-2:** Frische Installation ohne Sicherung, anmelden: Man landet auf /backup, und der Hinweis oben verlinkt auf dieselbe Seite. Hilfreich wäre, auf der Sicherungsseite statt des Links einen Satz zu zeigen wie «Richten Sie die Sicherung unten ein. Danach können Sie aktualisieren.» Oder die Seite sagt oben, warum man hier gelandet ist.

## Nicht geprüft

- **Sicherung selbst einrichten (Notfallblatt, Code erneut eingeben, «Sicherung starten"):** Ein Versuch. Den Code habe ich gesehen, aber vor dem Download hatte eine andere Persona die Sicherung bereits eingerichtet, und die Seite leitete mich auf die Übersicht weiter. Nachholen ging nicht mehr, und die Sicherung unter Einstellungen zurückzusetzen war nicht erlaubt.
- **Erfolgsmeldung nach einem echten Update:** Der Platzhalter bleibt auf 1.4.0, deshalb nicht prüfbar.
- **Fehlschlag des Updates:** Nicht Teil des Auftrags, kein Fehler simuliert.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/8ac6f8d2-3518-57bf-ba01-5c6f20138566/scratchpad/anna-update/
