# Helga – Slice 576: Anmelden mit E-Mail-Adresse und Passwort

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (Fehlmeldung zusätzlich bei 200 %), Maus. Start abgemeldet (ohne das Sitzungs-Cookie des Persona-Kits). Konto: helga@dwello.test. Gespeichert habe ich nichts. Skripte und Bildschirmfotos liegen in `<scratchpad>/helga-576/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Anmelden (200 %, auch 150 % betroffen) | Nach einem falschen Passwort steht die Meldung oben über dem Formular. Ich habe aber nach unten gescrollt, um «Anmelden» zu klicken, und dort bleibt die Seite stehen. In meinem Blickfeld wird der Knopf nur kurz zu «Bitte warten …» und dann wieder zu «Anmelden». Sonst ändert sich nichts. Ich würde meinen, die Seite hat nichts gemacht. Der Fokus springt auch nicht zur Meldung (er liegt danach auf der Seite selbst). |
| P-2 | Minor | Anmelden | Wie es nach einem vergessenen Passwort weitergeht, verstehe ich nicht: «Der Betreiber Ihrer Dwello-Installation setzt es mit einem Befehl zurück. Betreiben Sie Dwello selbst, steht der Befehl in der Installationsanleitung.» Ich weiss nicht, wer mein «Betreiber» ist, was eine «Installation» ist und welchen «Befehl» ich bräuchte. Auch die Hilfe-Seite sagt nichts zu Anmeldung oder Passwort. |
| P-3 | Minor | Anmelden | Die Seite sagt nirgends, dass das Konto nach mehreren falschen Passwörtern gesperrt wird. Das weiss ich nur aus der Aufgabe. Auch nach einem falschen Versuch steht nur «versuchen Sie es erneut», ohne Hinweis auf die Sperre. Probiere ich weiter, sperre ich mich selbst aus. |
| P-4 | Nit | Anmelden | Nach dem falschen Versuch steht mein falsches Passwort noch als Punkte im Feld. Ich muss es zuerst selbst löschen. Tippe ich einfach weiter, hängt mein neues Passwort am alten an. |

## Beobachtungen

- Die Fehlmeldung selbst ist gut: Sie steht in einem roten Kasten mit Ausrufezeichen, ist gross geschrieben und auch ohne Farbe als Meldung zu erkennen. Der Text heisst «E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.» Das verstehe ich, und meine E-Mail-Adresse bleibt stehen.
- Den Begriff «Konto mit Passwort» aus der Aufgabe zeigt die Seite nirgends. Dort steht nur «E-Mail-Adresse» und «Passwort». Das hat mich nicht gestört.
- Die Erklärung zu «Passwort vergessen?» steht zwischen der Überschrift «Passwort» und dem Feld. Ich musste drei Zeilen lesen, bevor ich zum Feld kam.
- Das richtige Passwort hat mich in etwa einer halben Sekunde auf die «Übersicht» gebracht.
- Oben rechts steht «helga@dwello.test» mit einem Personen-Zeichen. Ein Klick darauf öffnet ein Menü mit der Adresse, «Einstellungen» und «Abmelden» (rot). Wer angemeldet ist, sehe ich also. Einen Namen zeigt Dwello nicht, nur die E-Mail-Adresse. Die Datenschutzerklärung sagt das so: «Die Kopfzeile zeigt Ihre E-Mail-Adresse.»
- Die Datenschutzerklärung finde ich auf der Anmeldeseite (Link im Text und unten «Datenschutz») und in der App unten in der Fusszeile. Im Benutzermenü fehlt sie.
- Die Cookies im Browser nach dem Anmelden: «dwello_session» (für JavaScript nicht lesbar), «dwello_xsrf» und «PARAGLIDE_LOCALE». Beide Anmelde-Cookies laufen nach etwa 167 Stunden ab, also nach 7 Tagen. Das stimmt mit der Datenschutzerklärung überein. Beim Anmelden mit Passwort hat der Browser nur Anfragen an Dwello selbst geschickt (localhost:3300), keine an Google.
- Die Fusszeile zeigt «Version unbekannt».

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten. Ich habe zweimal ein falsches Passwort versucht (einmal bei 150 %, einmal bei 200 %) und mich einmal richtig angemeldet. Dazu kamen das Benutzermenü, die Hilfe und die Datenschutzerklärung. Insgesamt etwa 12 Schritte.

## Ablauf

1. **Seite öffnen.** Erwartet: eine Anmeldeseite. Gesehen: Ein Haus-Bild und «Anmelden», darunter «Melden Sie sich mit der E-Mail-Adresse und dem Passwort an, die bei der Einrichtung festgelegt wurden.» Danach kommen die Felder «E-Mail-Adresse» und «Passwort», der Knopf «Anmelden» und darunter «Mit Google anmelden». Gross und gut lesbar (Bild 01-start).
2. **Falsches Passwort (Dwello-Test-2025).** Erwartet: eine Meldung, dass es nicht stimmt. Gesehen bei 150 %: Der Knopf zeigt «Bitte warten …» (Bild 02-falsch). Danach erscheint oben ein roter Kasten mit «E-Mail-Adresse oder Passwort stimmen nicht …». Die E-Mail-Adresse bleibt stehen, das falsche Passwort auch.
3. **Noch einmal falsch bei 200 % (Kleinschreibung).** Gesehen: Nach dem Klick bleibt die Seite unten bei Feld und Knopf stehen. Die rote Meldung liegt oben ausserhalb meines Blickfelds (Bild 06-falsch-200-viewport). Erst auf der ganzen Seite sieht man sie über dem Feld «E-Mail-Adresse» (Bild 06-crop). Siehe P-1.
4. **Passwort vergessen?** Erwartet: ein Link «Passwort vergessen» mit einer E-Mail zum Zurücksetzen. Gesehen: kein Link, nur der Text vom Betreiber und vom Befehl in der Installationsanleitung. Ich würde den Betreuer anrufen, der mir Dwello eingerichtet hat. Dass «der Betreiber» genau diese Person ist, muss ich aber erraten. Unter «Hilfe» fand ich nichts dazu (P-2).
5. **Richtiges Passwort (Dwello-Test-2026).** Erwartet: die Startseite. Gesehen: «Übersicht» mit «Als Nächstes zu tun» (Bild 03-angemeldet).
6. **Kopfzeile.** Erwartet: mein Name. Gesehen: «helga@dwello.test». Das Menü zeigt die Adresse, «Einstellungen» und «Abmelden» (Bild 04-menu). Das genügt mir.
7. **Datenschutzerklärung (in der App unten «Datenschutz»).** Erwartet: was über meine Anmeldung gespeichert wird. Gesehen: einen Abschnitt «Anmeldung». Dort steht, dass Dwello meine E-Mail-Adresse speichert und das Passwort «nur in umgerechneter Form (Hash)», dazu die Zahl der Fehlversuche und eine allfällige Sperre. Jede Anmeldung kommt in ein Protokoll unter «Einstellungen» (ohne Name und E-Mail-Adresse). Fehlversuche mit der eingetippten E-Mail-Adresse und Anmeldungen kommen in das «Protokoll des Servers». Unter «Cookies» steht, dass die Anmelde-Cookies 7 Tage gelten (Bild 05-privacy).
   **Verstehe ich es?** Zum grössten Teil ja. Dwello kennt meine E-Mail-Adresse, aber nicht mein Passwort im Klartext, und merkt sich, wie oft ich mich vertippt habe. Ich soll ein langes Passwort wählen, das ich sonst nirgends brauche. Unklar bleibt der Unterschied zwischen dem «Protokoll» unter «Einstellungen» und dem «Protokoll des Servers». Ebenso unklar ist, wer der «Betreiber» bei mir ist und wie lange er das Protokoll aufbewahrt.

## Verwirrung

- «Betreiber», «Dwello-Installation», «Befehl», «Installationsanleitung»: Diese Wörter sind für mich Technik. Wer ist das bei mir?
- «bei der Einrichtung festgelegt»: Ich habe nichts festgelegt, das hat jemand für mich gemacht.
- «Hash», «umgerechnete Form»: Die Erklärung danach («lässt sich nicht zurückrechnen») hilft.
- Zwei Protokolle («Protokoll unter Einstellungen» und «Protokoll des Servers»): Ich weiss nicht, welches ich selbst sehen kann.
- «Verlängerung der Sitzung (etwa alle 50 Minuten)»: Muss ich da etwas tun?

## Fehlerrisiken

- Bei grosser Schrift merke ich nicht, dass das Passwort falsch war (P-1). Dann klicke ich immer wieder auf «Anmelden» und sperre so mein Konto, ohne es zu wissen (P-3).
- Tippe ich nach einem Fehler einfach weiter, hängt das neue Passwort am alten an (P-4). Das gibt wieder einen Fehlversuch.
- Vergesse ich das Passwort, weiss ich nicht, an wen ich mich wenden soll (P-2).

## Vorschläge

- **P-1:** Bei 200 % (oder 150 %) abgemeldet die Anmeldeseite öffnen, E-Mail-Adresse und ein falsches Passwort eingeben, nach unten scrollen und «Anmelden» klicken. Die Meldung liegt dann oben ausserhalb des Blickfelds. Helfen würde: die Meldung nach dem Fehler ins Blickfeld holen und den Fokus auf sie oder das Passwortfeld setzen. Oder die Meldung direkt beim Passwortfeld bzw. über dem Knopf zeigen.
- **P-2:** Die Anmeldeseite ansehen und unter «Hilfe» nach «Passwort» suchen. Helfen würde ein einfacher Satz wie «Passwort vergessen? Wenden Sie sich an die Person, die Dwello für Sie eingerichtet hat.» Den technischen Teil (Befehl, Installationsanleitung) könnte man in die Hilfe verschieben. Ein Abschnitt zur Anmeldung in der Hilfe wäre auch gut.
- **P-3:** Ein falsches Passwort eingeben und die Meldung lesen. Helfen würde ein Satz in der Meldung oder beim Feld, etwa: «Nach 5 falschen Versuchen wird das Konto für eine Weile gesperrt.» Am besten mit der Zahl der Versuche, die noch bleiben, oder der Dauer der Sperre.
- **P-4:** Ein falsches Passwort eingeben, absenden und danach ins Passwortfeld klicken. Das alte Passwort steht noch da. Helfen würde, das Passwortfeld nach dem Fehler zu leeren.

## Nicht geprüft

- Die Sperre nach 5 Fehlversuchen und ihre Meldung: Die Aufgabe erlaubt höchstens 3 falsche Passwörter. Ich habe 2 verwendet.
- «Mit Google anmelden»: Das gehört nicht zur Aufgabe und ist ohne echtes Google-Konto nicht möglich.
- Ob die Meldung bei 150 % ganz oder nur teilweise aus dem Blickfeld rutscht: Die Ansicht direkt nach dem Fehler habe ich nur bei 200 % festgehalten. Bei 150 % lag der Knopf ebenfalls unter dem ersten Bildschirm.
- Das Protokoll unter «Einstellungen», also ob meine Anmeldung dort steht: Ich habe nur die Datenschutzerklärung gelesen.
- Abmelden und danach wieder anmelden.
