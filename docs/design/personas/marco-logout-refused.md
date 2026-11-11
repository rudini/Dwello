# Marco – Abmelden abgelehnt (#1434), Smartphone 390 × 844

Persona: Marco, 38, auf dem Handy, wenig Zeit. Aufgabe: Auf der Übersicht abmelden, obwohl der Browser das Cookie «dwello_xsrf» verloren hat («dwello_session» bleibt). Dann tun, was die Meldung sagt. Nichts gespeichert.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht -> andere Seite (z. B. Gebäude) | Die Meldung «Dwello konnte Sie nicht abmelden. …» bleibt stehen, wenn ich nach der Ablehnung über das Menü auf eine andere Seite wechsle. Auf «Gebäude» steht sie immer noch oben, ohne Schliessen-Knopf. Sie fordert mich dort auf, «die Seite» neu zu laden, obwohl ich gar nicht mehr auf der Seite bin, auf der ich abmelden wollte. Ich frage mich, ob auf der neuen Seite wieder etwas schiefgegangen ist. Ausserdem nimmt sie im festen Kopfbereich rund 120 px von 844 px dauerhaft weg. |

## Beobachtungen

- Die Meldung erscheint sofort oben, direkt unter der Kopfzeile (rot getönter Kasten mit Ausrufezeichen-Symbol, Text in dunklem Rot). Ich muss sie nicht suchen. Sie gehört zum festen Kopfbereich, bleibt also auch beim Scrollen sichtbar (Screenshot 05: nach dem Scrollen auf 800 px steht sie weiterhin bei y = 64).
- Der Text ist gut lesbar, bricht auf drei Zeilen um und sagt in zwei kurzen Sätzen, was passiert ist und was zu tun ist. Zur Farbe kommt das Symbol dazu, die Bedeutung hängt also nicht nur an der Farbe.
- Kein seitliches Scrollen: Bei 390 px ist scrollWidth = 390.
- Dass ich noch angemeldet bin, steht nicht ausdrücklich da. Es folgt aber aus «konnte Sie nicht abmelden». Darunter sehe ich ausserdem weiterhin meine Übersicht mit allen Daten. Für mich war das klar.
- «Laden Sie die Seite neu» heisst auf dem Handy: nach unten ziehen oder das Browser-Menü öffnen. Das kenne ich, eine Anfängerin vielleicht nicht. Ein Knopf «Seite neu laden» in der Meldung wäre bequemer.
- Nach der Ablehnung setzt der Browser «dwello_xsrf» offenbar neu. Ein zweiter Tipp auf «Abmelden» ohne Neuladen klappt deshalb auch schon (POST /auth/logout 200, danach die Seite «Anmelden»). Die Anweisung ist also strenger als nötig, aber nicht falsch.
- Im Bedienungsbaum steht die Meldung als Überschrift der Ebene 2 im Kopfbereich (banner > alert > heading). Das fiel mir nur im Baum auf, für Sven vielleicht von Belang.
- Nach dem Neuladen ist die Meldung weg, wie erwartet.

## Aufgabe geschafft: ja

## Aufwand

Etwa 1 Minute als Nutzer, 6 Schritte: Übersicht öffnen, Benutzermenü, «Abmelden» (abgelehnt), Seite neu laden, Benutzermenü, «Abmelden» (Seite «Anmelden»).

## Ablauf

- Nach der Ablehnung über das Menü auf «Gebäude» gewechselt. Erwartet: Die Meldung verschwindet mit dem Seitenwechsel oder lässt sich schliessen. Gesehen: Sie steht auf der Seite «Gebäude» unverändert oben, ein Schliessen-Knopf fehlt (Screenshot 05c).
- Ohne Neuladen nochmals «Abmelden» getippt. Erwartet laut Meldung: wieder abgelehnt. Gesehen: Die Abmeldung klappt, ich lande auf «Anmelden».

## Vorschläge

- **P-1:** So kommt man hin: /dashboard öffnen, das Cookie «dwello_xsrf» löschen, dann Benutzermenü -> «Abmelden» (die Meldung erscheint). Danach «Menü öffnen» -> «Gebäude»: Die Meldung steht weiterhin oben. Was helfen würde: Die Meldung beim Seitenwechsel entfernen oder einen Knopf «Schliessen» anbieten. Noch besser wäre in der Meldung selbst ein Knopf «Seite neu laden», damit niemand die Browser-Geste kennen muss.

## Nicht geprüft

- Dunkelmodus und andere Sprachen: Die Aufgabe nannte sie nicht, ich habe sie nicht geöffnet.
- Das echte Neuladen per Wischgeste kann der Testbrowser nicht nachstellen, ich habe stattdessen die Seite per Browser-Befehl neu geladen. Danach war die Meldung weg, und die Abmeldung führte auf «Anmelden». Danach leitete /dashboard auf /login?redirectTo=%2Fdashboard um.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/c91e0497-acb8-583b-83bc-d296ce95f298/scratchpad/marco-logout-refused/ (04-after.png Meldung auf der Übersicht, 05-scrolled.png nach dem Scrollen, 05b-nav.png Menü offen, 05c-buildings.png Meldung auf «Gebäude», 07-reload-end.png Seite «Anmelden»).
