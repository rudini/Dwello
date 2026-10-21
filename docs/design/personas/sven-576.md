# Sven – Anmeldung mit E-Mail-Adresse und Passwort (#576)

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt über den Accessibility-Baum (`readOut`) und den Fokus (`document.activeElement`). Start abgemeldet (Cookies des Persona-Kits gelöscht), App auf http://localhost:3300. Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-576/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Anmelden, leer abgeschickt | Ein leeres Formular geht an den Server und kommt mit «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.» zurück. Die Meldung sagt nicht, dass E-Mail-Adresse und Passwort fehlen. Die Felder sind nicht als Pflichtfelder markiert (`required` fehlt). |
| P-2 | Minor | Anmelden, falsches Passwort | Die Fehlermeldung wird als `alert` angesagt, aber die Felder werden nicht als fehlerhaft markiert (`aria-invalid` fehlt) und die Meldung ist mit keinem Feld verbunden (`aria-describedby` zeigt nur auf den Hilfetext). Wer später auf das Feld zurückkehrt, hört den Fehler nicht mehr. |
| P-3 | Nit | Anmelden, falsches Passwort | Nach dem Fehler bleibt der Fokus im Passwortfeld, und das falsche Passwort steht noch drin. Ich muss erst Ctrl+A drücken, sonst hänge ich das neue Passwort an das falsche an. |
| P-4 | Nit | Anmelden | Der Hilfetext «Passwort vergessen? …» hängt per `aria-describedby` am Passwortfeld. Ich höre diese drei Sätze bei jedem Fokus auf das Feld, auch nach jedem Fehlversuch. |

## Beobachtungen

- Die Seite heisst «Anmelden - Dwello», hat eine Überschrift H1 «Anmelden», einen Link «Zum Inhalt springen» und die Bereiche main/contentinfo. Gut zu finden.
- Die Tab-Reihenfolge ist logisch: Zum Inhalt springen, Hilfe, Sprache, E-Mail-Adresse, Passwort, Anmelden, Mit Google anmelden, Nutzungsbedingungen, Datenschutzerklärung, Fusszeile. Die Anmeldung mit Passwort kommt vor Google, also brauche ich wenige Tabs.
- Die Felder sind richtig beschriftet («E-Mail-Adresse» als `type=email`, «Passwort» als `type=password`), mit `autocomplete=username` und `current-password`, so kann ein Passwortmanager ausfüllen.
- Den Begriff «Konto mit Passwort» aus der Anforderung gibt es auf dem Bildschirm nicht. Dort steht «Melden Sie sich mit der E-Mail-Adresse und dem Passwort an, die bei der Einrichtung festgelegt wurden.» Für mich war das klar genug.
- Nach der Anmeldung liegt der Fokus auf `body`. Eine assertive Live-Region sagt «Übersicht - Dwello» an. Der erste Tab führt auf «Zum Inhalt springen». Das ist brauchbar, aber der Fokus wird nicht aktiv auf die Überschrift gesetzt.
- Im Header steht der Knopf «sven@dwello.test Benutzermenü». Enter öffnet ihn (`aria-expanded=true`) mit «sven@dwello.test», «Einstellungen» und «Abmelden». Escape schliesst ihn, und der Fokus bleibt auf dem Knopf.
- Cookies nach der Anmeldung: `dwello_session` ist HTTPOnly, `dwello_xsrf` und `PARAGLIDE_LOCALE` sind lesbar. Alle sind SameSite=Lax. Secure ist nicht gesetzt (lokal über http, daher erwartet).
- Das Formular schickt per `POST /login?/password` an die eigene App. Andere Server habe ich in den Anfragen nicht gesehen.

## Aufgabe geschafft: ja

## Aufwand

Rund 10 Minuten in 4 Skriptläufen. Für die Anmeldung selbst: 4 Tabs bis zum E-Mail-Feld, 1 Tab zum Passwort, Enter. Nach einem Fehler: Ctrl+A, neues Passwort tippen, Enter. Insgesamt 2 falsche Passwörter und 1 leeres Abschicken.

## Ablauf

1. **`/` abgemeldet öffnen.** Erwartet: die Anmeldeseite. Gesehen: Weiterleitung auf `/login?redirectTo=%2F`, Titel «Anmelden - Dwello». Fokus anfangs auf `body` (Screenshot 01-start.png: Karte «Anmelden» mit zwei Feldern, Knopf «Anmelden», darunter «Mit Google anmelden»).
2. **Mit Tab zu den Feldern.** Erwartet: beschriftete Felder. Gesehen: «E-Mail-Adresse», danach «Passwort» mit dem Hilfetext «Passwort vergessen? …» als Beschreibung.
3. **Leer abschicken (Enter im E-Mail-Feld).** Erwartet: ein Hinweis, dass die Felder fehlen. Gesehen: die Anfrage geht an den Server, dann ein `alert` «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.». Der Fokus bleibt im E-Mail-Feld. Die Meldung sagt nicht, was fehlt (P-1, Screenshot 02-empty.png).
4. **E-Mail-Adresse sven@dwello.test, falsches Passwort, Enter.** Erwartet: eine angesagte Fehlermeldung, die E-Mail-Adresse bleibt stehen, der Fokus landet sinnvoll. Gesehen: `alert` «E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.» oberhalb der Felder. Die E-Mail-Adresse bleibt stehen, das falsche Passwort steht auch noch im Feld, und der Fokus bleibt im Passwortfeld. Kein Feld ist mit `aria-invalid` markiert (P-2, P-3, Screenshot 03-wrong.png: roter Hinweiskasten über den Feldern). Die Meldung nennt nicht, welches der beiden Felder falsch ist. Bei der Anmeldung ist das vertretbar.
5. **In neuer Sitzung noch einmal falsch, dann Ctrl+A, Dwello-Test-2026, Enter.** Erwartet: die App und ein brauchbarer Fokus. Gesehen: nach rund 1,7 s `/dashboard` mit dem Titel «Übersicht - Dwello», angesagt über die Live-Region. Fokus auf `body`, der erste Tab führt auf «Zum Inhalt springen» (Screenshot 04-after-login.png: Übersicht mit Navigation links).
6. **Header prüfen.** Erwartet: mein Konto wird genannt. Gesehen: Knopf «sven@dwello.test Benutzermenü», der Inhalt per Tastatur bedienbar (Screenshot 05-usermenu.png: aufgeklapptes Menü mit E-Mail-Adresse, Einstellungen, Abmelden).

## Verwirrung

- «Die Anmeldung ist fehlgeschlagen» beim leeren Formular klingt nach einem technischen Fehler, nicht nach «Sie haben nichts eingegeben».
- «Der Betreiber Ihrer Dwello-Installation setzt es mit einem Befehl zurück»: Als Vermieter weiss ich nicht, ob ich selbst dieser Betreiber bin. Der zweite Satz hilft nur halb, denn wo die Installationsanleitung liegt, steht nicht da.

## Fehlerrisiken

- Das falsche Passwort bleibt nach einem Fehlversuch im Feld stehen (P-3). Wer einfach weitertippt, schickt «alt+neu» ab und verbraucht einen weiteren Versuch. Nach 5 Fehlversuchen wird das Konto gesperrt, und die Seite sagt nirgends, wie viele Versuche bleiben oder dass eine Sperre droht.
- Ob ein leeres Abschicken als Fehlversuch zählt, kann ich als Nutzer nicht erkennen.

## Vorschläge

- **P-1:** Abgemeldet `/login` öffnen, mit Tab ins Feld «E-Mail-Adresse», ohne Eingabe Enter drücken. Hilfreich: `required` auf beide Felder, oder eine eigene Meldung wie «Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein.», die mit dem leeren Feld verbunden ist und auf das erste leere Feld fokussiert.
- **P-2:** sven@dwello.test mit einem falschen Passwort abschicken und dann `aria-invalid` und `aria-describedby` der Felder prüfen. Hilfreich: `aria-invalid="true"` auf beide Felder und die Fehlermeldung per `aria-describedby` mit dem Passwortfeld verbinden (zusätzlich zum Hilfetext).
- **P-3:** Wie P-2, dann direkt weitertippen. Hilfreich: das Passwortfeld nach dem Fehlversuch leeren oder den Inhalt markieren, und den Fokus dort lassen.
- **P-4:** Mit Tab ins Passwortfeld gehen. Hilfreich: den Hilfetext kürzen («Passwort vergessen? Hinweise in der Hilfe.») oder ihn erst nach einem Fehlversuch mit dem Feld verbinden.

## Nicht geprüft

- Ob dieselbe Fehlermeldung bei einem zweiten Fehlversuch in derselben Seite erneut angesagt wird. Dafür wäre ein dritter Fehlversuch nötig gewesen. Das leere Abschicken zählt womöglich mit, und ich wollte unter dem Limit bleiben.
- Die Meldung bei gesperrtem Konto (5 Fehlversuche): laut Auftrag nicht versucht.
- Die Anmeldung mit Google (externer Dienst) und eine Anmeldung ohne JavaScript.
- Ein echter Screenreader (NVDA/VoiceOver). Beurteilt habe ich über den Accessibility-Baum von Chromium.
