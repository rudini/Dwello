# Marco – Update auf eine neue Version (Slice `update`, #1453)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Frische Installation Dwello 1.4.0, angemeldet mit Konto mit Passwort (landlord@dwello.test). Ein Stand-in meldet Dwello 1.5.0; nach dem Update bleibt die Version 1.4.0 und der Hinweis kommt wieder (Stand-in, kein Befund).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hinweis «Neue Version verfügbar» (jede Seite) | Der Hinweis braucht auf dem Handy 200 px von 844, also knapp ein Viertel des Bildschirms, auf jeder Seite, bis ich «Später» tippe. «Später» steht allein auf einer eigenen Zeile, und sein Text beginnt eingerückt (x 42) statt bündig mit «Was ist neu?» (x 16); das sieht aus wie ein loses Stück und kostet eine ganze Zeile. |
| P-2 | Minor | Update-Bildschirm «Dwello wird auf Version 1.5.0 aktualisiert» | Bei den drei Schritten sieht man nur, welcher gerade läuft (fett). Erledigte Schritte sehen genau gleich aus wie die noch folgenden (grau, normal); «(erledigt)», «(läuft)», «(folgt)» stehen nur im Bildschirmleser. Auf dem Handy sehe ich beim Schritt «Neu starten» nicht, ob «Sichern» geklappt hat; nur der Balken zeigt den Fortschritt. |
| P-3 | Minor | Hinweis, solange die Sicherung fehlt (auf «Sicherung einrichten») | In dieser Form ist der Hinweis rund 280 px hoch, ein Drittel des Bildschirms, mit grossem Leerraum zwischen «Was ist neu?», «Richten Sie zuerst die Sicherung ein» und «Später». Er steht auf genau der Seite, auf die sein Link führt; der Link schickt mich an eine Stelle, an der ich schon bin, und schiebt den Wiederherstellungscode unter den Rand. |

## Beobachtungen

- Die Treffflächen sind gut: «Was ist neu?», «Aktualisieren» und «Später» sind je 48 px hoch, «Jetzt aktualisieren» und «Abbrechen» im Dialog 310 × 48 px, untereinander mit Abstand. Kein seitliches Scrollen (scrollWidth 390 = Bildschirmbreite), weder mit Hinweis noch mit Dialog oder Update-Bildschirm.
- Der Hinweis scrollt mit der Seite weg, er klebt nicht oben. Gut beim Lesen; um zu aktualisieren, muss ich wieder ganz nach oben.
- Die Bestätigung ist klar und kurz: was passiert (herunterladen, sichern, neu starten), wie lange, dass ich so lange nicht arbeiten kann und dass ungespeicherte Eingaben auf dieser Seite verloren gehen. Sie erscheint als Fenster unten am Bildschirm, gut mit dem Daumen erreichbar. «Jetzt aktualisieren» ist die hervorgehobene Taste, «Abbrechen» darunter.
- «Abbrechen» im Dialog behält meine Eingabe («Marco Test halb» im Gebäudenamen blieb stehen), der Fokus geht zurück auf «Aktualisieren».
- Nach dem Update war ich wieder auf «Neues Gebäude», wie versprochen. Die Eingabe im Gebäudenamen war weg; das hat der Dialog vorher gesagt. Auf der Hilfe-Seite stand ich danach wieder oben, nicht an der Stelle, an der ich gelesen hatte; da ich für «Aktualisieren» ohnehin nach oben musste, störte das nicht.
- Der Update-Bildschirm deckt alles ab, ruhig, ein Satz «Danach sehen Sie wieder die Seite, auf der Sie waren.» beruhigt. Mit dem Stand-in dauerte es rund 6,6 s vom Tippen bis zur Seite.
- «Später» blendet den Hinweis ohne Rückmeldung aus, auch auf anderen Seiten. In einer neuen Sitzung (neuer Browser) war er wieder da. Wo ich das Update später finde, sagt Dwello nicht; im Benutzermenü steht nichts dazu.
- «Was ist neu?» öffnet einen neuen Tab (GitHub), ohne dass der Link das ankündigt. Auf dem Handy merkt man das erst, wenn man zurück will.
- Nach der Anmeldung landete ich direkt auf «Sicherung einrichten». Dort bricht der Wiederherstellungscode mitten in einer Vierergruppe um («…-TJG3-P / KSK-…»); beim Abschreiben am Handy eine Fehlerquelle. Betrifft nicht das Update selbst. Die Sicherung hatte bei meinem nächsten Aufruf schon eine andere Persona eingerichtet; ich musste sie nicht selbst starten.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 9 Schritte für das eigentliche Update (Anmelden 3, Seite öffnen und tippen 2, «Aktualisieren», «Abbrechen», «Aktualisieren», «Jetzt aktualisieren»), dazu Prüfen von «Später» und Benutzermenü.

## Ablauf

1. Anmelden. Erwartet: Übersicht mit Hinweis «Neue Version». Gesehen: Weiterleitung auf «Sicherung einrichten», Hinweis ohne «Aktualisieren», stattdessen der Link «Richten Sie zuerst die Sicherung ein» auf dieselbe Seite; der Hinweis nahm ein Drittel des Bildschirms (P-3).
2. Neuer Aufruf. Erwartet: Sicherung einrichten. Gesehen: Weiterleitung auf die Übersicht, Sicherung inzwischen eingerichtet (andere Persona), Hinweis jetzt mit «Aktualisieren».
3. Update läuft. Erwartet: sehen, welche Schritte erledigt sind. Gesehen: nur der laufende Schritt hervorgehoben, erledigte und folgende sehen gleich aus (P-2).
4. Nach dem Update. Erwartet: zurück auf «Neues Gebäude», eine Meldung, dass das Update geklappt hat. Gesehen: zurück auf der Seite, aber keine Erfolgsmeldung und wieder der Hinweis mit Version 1.4.0 (laut Auftrag der Stand-in).
5. «Später». Erwartet: eine kurze Rückmeldung, wann der Hinweis wiederkommt. Gesehen: Hinweis einfach weg, ohne Text.

## Vorschläge

- **P-1:** Am Handy auf einer beliebigen Seite (z. B. `/buildings/new`) bei gemeldeter neuer Version: Hinweis misst 200 px, «Später» auf eigener Zeile, eingerückt. Hilfreich: «Später» auf dieselbe Zeile wie «Aktualisieren» (Platz ist da: «Aktualisieren» endet bei x 281) oder als schlichter Link bündig links; den Satz «Das Update dauert einige Minuten; Ihre Daten bleiben erhalten.» kürzen oder erst im Dialog zeigen, damit der Hinweis auf zwei bis drei Zeilen passt.
- **P-2:** «Aktualisieren», «Jetzt aktualisieren», auf den Schritt «Neu starten» warten. Hilfreich: erledigte Schritte sichtbar markieren (Häkchen-Symbol plus Wort «erledigt»), folgende sichtbar als «folgt», nicht nur für den Bildschirmleser.
- **P-3:** Sicherung nicht eingerichtet, Anmeldung am Handy, man landet auf «Sicherung einrichten». Hilfreich: auf dieser Seite den Hinweis ohne den Link auf sich selbst zeigen (oder ganz kurz: «Richten Sie unten die Sicherung ein, dann können Sie aktualisieren.») und die Leerräume zwischen den Zeilen kleiner machen.

## Nicht geprüft

- Ob Dwello nach einem echten Update eine Erfolgsmeldung zeigt und die Version 1.5.0 im Fuss steht: der Stand-in lässt 1.4.0 stehen; ich sah nach dem Neustart wieder den Hinweis.
- Ein Fehler beim Update (Herunterladen oder Sichern scheitert): kein fehlschlagender Request im Auftrag genannt; nicht versucht.
- Die Seite hinter «Was ist neu?» (GitHub, ausserhalb von Dwello): nur geprüft, dass der Link einen neuen Tab öffnet.
- Den Link «Richten Sie zuerst die Sicherung ein» angetippt: beim zweiten Aufruf war die Sicherung schon von einer anderen Persona eingerichtet, die Form des Hinweises gab es nicht mehr.
- Das Notfallblatt-PDF: nicht heruntergeladen, die Sicherung war schon eingerichtet.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/8ac6f8d2-3518-57bf-ba01-5c6f20138566/scratchpad/marco-update/` (02-after-login.png Hinweis ohne Sicherung, 04-backup-now.png Hinweis mit «Aktualisieren», 06-confirm.png Dialog, 07-step-0/5.png Update-Bildschirm, 07-step-8.png zurück auf «Neues Gebäude», 10-after-spaeter.png nach «Später»).
