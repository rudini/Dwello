# Dr. Weber – Slice 576: Anmeldung mit «Konto mit Passwort»

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles. Desktop 1440 × 900, Maus. Start abgemeldet (Cookies der Persona-Kit-Sitzung vor dem ersten Aufruf gelöscht). App: http://localhost:3300. Gespeichert habe ich nichts.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Anmelden (`/login`) | Nach dem 5. Fehlversuch steht noch «E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.», obwohl die Anmeldung ab diesem Moment gesperrt ist. Die Sperre erfahre ich erst beim 6. Versuch, auch mit dem richtigen Passwort. Vorher gibt es auch keinen Hinweis wie «noch 1 Versuch». |
| P-2 | Minor | Datenschutz (`/privacy`), «Anmeldung» | Nur bei Fehlversuchen steht ausdrücklich «ohne IP-Adresse». Beim Absatz über erfolgreiche Anmeldungen, Verlängerungen und Abmeldungen fehlt dieser Zusatz. Daraus schliesse ich, dass dort die IP-Adresse gespeichert wird. Ist das nicht so, widerspricht der Text dem Verhalten. Ist es so, fehlt die Angabe. Zudem steht dieser Absatz nach den Google-Absätzen, sodass unklar ist, ob er auch für die Anmeldung mit Passwort gilt. |
| P-3 | Minor | Datenschutz, «Anmeldung» | «Dwello speichert dafür Ihre E-Mail-Adresse und das Passwort nur in umgerechneter Form (Hash)» lässt sich so lesen, dass auch die E-Mail-Adresse nur als Hash gespeichert wird. Die Kopfzeile zeigt sie aber im Klartext. |
| P-4 | Minor | Datenschutz, «Anmeldung», und Anmelden | «Wählen Sie deshalb ein langes Passwort, das Sie sonst nirgends verwenden.» Ich finde in der App aber keinen Ort, an dem ich das Passwort wähle oder ändere: nichts im Benutzermenü, nichts unter «Einstellungen». Die Anmeldeseite sagt, das Passwort sei «bei der Einrichtung festgelegt» worden, und nur der Betreiber setze es «mit einem Befehl» zurück. Die Empfehlung richtet sich also an jemanden, der sie in der App nicht umsetzen kann. |
| P-5 | Minor | Anmelden | Wenn ich ohne Eingaben auf «Anmelden» klicke, erscheint nur «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.» Der Text sagt nicht, was fehlt (E-Mail-Adresse und Passwort), und nicht, was zu tun ist. |
| P-6 | Minor | Anmelden, Sperre | Gibt man eine unbekannte E-Mail-Adresse beliebig oft falsch ein (6 Mal geprüft), heisst es immer nur «stimmen nicht». Bei der bekannten Adresse kommt nach 5 Versuchen die Sperre. Wer ausprobiert, erfährt so, ob es für eine Adresse ein Konto gibt. Die Meldung «stimmen nicht» soll das offenbar gerade verbergen. |
| P-7 | Minor | Anmelden, Sperre | Die Sperrmeldung sagt «gesperrt bis 15:30 Uhr» (gut, mit konkreter Zeit). Darunter bleibt aber «Mit Google anmelden» unverändert stehen. Es ist unklar, ob «die Anmeldung» nur die Anmeldung mit Passwort meint oder jede. Ausserdem steht nur «lassen Sie die Sperre vom Betreiber … aufheben». Beim vergessenen Passwort gibt es den Hinweis «Betreiben Sie Dwello selbst, steht der Befehl in der Installationsanleitung», hier fehlt er. |
| P-8 | Nit | Anmelden | Nach einem Fehlversuch bleibt das falsche Passwort im Feld stehen, und der Fokus liegt danach auf keinem Feld (`BODY`). Ich muss das Feld selbst leeren und anklicken. |

## Beobachtungen

- Im Protokoll unter «Einstellungen» standen 9 gleiche Einträge «21.10.2026, 15:14 – Anmeldung mit Passwort». Zwei davon stammen von mir, die anderen vermutlich von gleichzeitig laufenden Personas auf demselben Konto. Die Einträge lassen sich nicht unterscheiden: keine Sekunden, kein Gerät oder Browser. Ob eine Anmeldung wirklich von mir stammte, könnte ich so nicht erkennen. Das entspricht aber dem, was die Datenschutzerklärung verspricht («ohne Namen und E-Mail-Adresse»).
- Die Einleitung des Protokolls sagt «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen». Gelesen klingt das so, als beeinflussten Anmeldungen die Abrechnungen.
- Fehlversuche und Sperren sieht der Verwalter im Protokoll nicht, nur der Betreiber im Protokoll des Servers. Als vorsichtiger Vermieter möchte ich erfahren, dass jemand mein Konto ausprobiert hat. Die Datenschutzerklärung beschreibt diese Trennung aber korrekt.
- Cookies stimmen mit der Datenschutzerklärung überein. Nach der Anmeldung mit Passwort gibt es `dwello_session` (HttpOnly, läuft am 28.10.2026 ab, also 7 Tage), `dwello_xsrf` (7 Tage) und `PARAGLIDE_LOCALE` (rund 400 Tage). `dwello_oauth_state` und `dwello_login` setzt die Passwort-Anmeldung nicht, nur der Weg über Google (beim Aufruf von `/auth/login?provider=google` gesehen, Weiterleitung zu accounts.google.com). Das passt zu «über einen Anbieter wie Google auch nicht ohne …».
- Abgemeldet ohne Cookies sendet die Anmeldeseite nur Anfragen an localhost:3300 (`GET /login`, `POST /login?/password`). Keine Schrift und keine Skripte von Dritten.
- Ein falscher Versuch während der Sperre verlängert sie nicht (weiter «bis 15:30 Uhr»). Das passt zu «eine allfällige Sperre, bis sie abläuft».
- Die Sperre gilt auch für dieselbe Adresse in Grossbuchstaben (`WEBER@dwello.test`). Gut.
- Nach «Abmelden» landet man ohne Bestätigung auf der Anmeldeseite, etwa «Sie sind abgemeldet» gibt es nicht. Das Benutzermenü bietet nur «Einstellungen» und «Abmelden».
- Die Hilfe (`/help`) erwähnt Anmeldung, Passwort und Sperre mit keinem Wort.
- In der Fusszeile steht «Version unbekannt».
- Die Datenschutzerklärung nennt weder die Zahl der Fehlversuche (5) noch die Dauer der Sperre (15 Minuten), und die Anmeldeseite auch nicht, solange nichts passiert. Für die Datenschutzerklärung ist das nicht nötig. Auf der Anmeldeseite würde es helfen (siehe P-1).

## Aufgabe geschafft: ja

Texte gelesen, mit Passwort angemeldet, Eintrag «Anmeldung mit Passwort» im Protokoll gefunden, abgemeldet, Sperre mit 5 Fehlversuchen ausgelöst und beurteilt.

## Aufwand

Etwa 15 Minuten, 10 Skripte. Anmelden selbst: 2 Felder, 1 Klick, nach etwa 0,5 s auf der Übersicht. Bis zum Protokoll: Einstellungen, dann Protokoll (2 Klicks).

## Ablauf

1. **Startseite abgemeldet aufrufen.** Erwartet: Anmeldeseite mit E-Mail und Passwort, Google als Zusatz. Gesehen: Weiterleitung auf `/login?redirectTo=%2F`, Überschrift «Anmelden», Hinweis «… die bei der Einrichtung festgelegt wurden», die Felder E-Mail-Adresse und Passwort, eine Hilfe zu «Passwort vergessen?», «Anmelden» als Hauptknopf, «Mit Google anmelden» als zweiter Knopf, Verweise auf Nutzungsbedingungen und Datenschutzerklärung (Screenshot `01-start.png`). Wie erwartet. Zur Sperre steht nichts.
2. **Datenschutzerklärung lesen.** Erwartet: Passwort nur als Hash, Sperre, Protokoll der Fehlversuche ohne IP, Cookies. Gesehen: alles erwähnt, mit den Unklarheiten P-2 und P-3 sowie der Empfehlung P-4. Der Abschnitt «Verantwortlich» weist Anmeldung, Protokoll des Servers und Cookies dem Betreiber zu. Das ist schlüssig. Die Nutzungsbedingungen erlauben, die Sätze zur Anmeldung beim Weitergeben an die Mieter wegzulassen. Auch das ist schlüssig.
3. **Leer absenden.** Erwartet: «Bitte E-Mail-Adresse und Passwort eingeben». Gesehen: «Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.» (`03-leer.png`, P-5).
4. **Unbekannte Adresse.** Erwartet: neutrale Meldung. Gesehen: «E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe …», die E-Mail-Adresse bleibt stehen (`04-unbekannt.png`). Gut.
5. **weber@dwello.test / Dwello-Test-2026.** Erwartet: Übersicht. Gesehen: nach etwa 0,5 s `/dashboard`, die Kopfzeile zeigt «weber@dwello.test» (`05-nach-login.png`). Cookies wie oben unter Beobachtungen.
6. **Einstellungen, dann Protokoll.** Erwartet: Eintrag «Anmeldung mit Passwort» mit Datum und Uhrzeit. Gesehen: `/config/audit-log`, Einträge «21.10.2026, 15:14 – Anmeldung mit Passwort», jeder mit «Löschen» (`07-protokoll.png`). Die Ortszeit stimmt (Sommerzeit). Weder Name noch E-Mail-Adresse, wie angekündigt.
7. **Abmelden** über das Benutzermenü (`08-menue.png`). Erwartet: Bestätigung. Gesehen: direkt die Anmeldeseite, nur `PARAGLIDE_LOCALE` bleibt (`09-abgemeldet.png`).
8. **5 falsche Passwörter.** Erwartet: spätestens beim 5. Versuch ein Hinweis auf die Sperre. Gesehen: fünf Mal dieselbe Meldung «stimmen nicht … versuchen Sie es erneut» (`15-versuch-5.png`, P-1).
9. **6. Versuch mit dem richtigen Passwort.** Erwartet: Sperre. Gesehen: rote Meldung mit Symbol, als `alert` angesagt: «Nach mehreren Fehlversuchen ist die Anmeldung gesperrt bis 15:30 Uhr. Versuchen Sie es danach erneut, oder lassen Sie die Sperre vom Betreiber Ihrer Dwello-Installation aufheben.» (`16-versuch-6.png`). Die Meldung ist verständlich und nennt eine Uhrzeit, siehe aber P-7.
10. **Gegenproben.** Ein weiterer Fehlversuch während der Sperre: die Zeit bleibt 15:30. Dieselbe Adresse gross geschrieben: ebenfalls gesperrt. Eine unbekannte Adresse 6 Mal: nie gesperrt (P-6).

## Verwirrung

- «Betreiber» und «Installation»: Auf der Anmeldeseite muss ich mich fragen, ob ich selbst der Betreiber bin. Die Datenschutzerklärung erklärt den Begriff, die Anmeldeseite nicht.
- «die Anmeldung ist gesperrt»: Gilt das auch für Google (P-7)?
- «Protokoll» kommt zweimal vor: das Protokoll unter «Einstellungen» und das «Protokoll des Servers». Die Datenschutzerklärung trennt die beiden sauber («davon getrennt»). Trotzdem habe ich zweimal lesen müssen, welches Protokoll die Fehlversuche enthält.
- «umgerechnete Form (Hash)»: gut erklärt, nur der Satzbau ist mehrdeutig (P-3).

## Fehlerrisiken

- Wer nach dem 5. Fehlversuch der Meldung «versuchen Sie es erneut» folgt, versucht es weiter und hält die Sperre beim 6. Versuch für einen neuen Fehler (P-1).
- Wer Dwello mit anderen teilt (oder wie hier mit mehreren gleichzeitigen Sitzungen), kann im Protokoll keine fremde Anmeldung erkennen.
- Eine vertippte E-Mail-Adresse eines Dritten landet laut Datenschutzerklärung im Protokoll des Servers. Das ist korrekt beschrieben, aber eine Aufbewahrungsdauer gibt es nur als «legt der Betreiber fest».

## Vorschläge

- **P-1:** Abgemeldet `/login` öffnen, 5 Mal `weber@dwello.test` mit falschem Passwort, beim 5. Mal steht noch «… versuchen Sie es erneut». Hilfreich: Beim Versuch, der die Sperre auslöst, gleich die Sperrmeldung mit Uhrzeit zeigen. Ab dem 3. Fehlversuch zudem «Nach 5 Fehlversuchen wird die Anmeldung 15 Minuten gesperrt».
- **P-2:** `/privacy`, Abschnitt «Anmeldung», die letzten beiden Absätze lesen. Hilfreich: auch beim Absatz über Anmeldung, Verlängerung und Abmeldung sagen, ob die IP-Adresse gespeichert wird, und ihn ausdrücklich auf beide Anmeldearten beziehen («ob mit Passwort oder über Google»).
- **P-3:** `/privacy`, «Anmeldung», erster Satz. Hilfreich: «Dwello speichert dafür Ihre E-Mail-Adresse und Ihr Passwort, das Passwort nur in umgerechneter Form (Hash) …».
- **P-4:** Angemeldet Benutzermenü und «Einstellungen» durchsehen: Es gibt nichts zum Ändern des Passworts. Hilfreich: entweder eine Möglichkeit, das Passwort zu ändern, oder die Empfehlung an den richten, der es festlegt («Wer Dwello einrichtet, wählt ein langes Passwort …»).
- **P-5:** `/login`, ohne Eingaben «Anmelden» wählen. Hilfreich: «Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein.» direkt bei den Feldern.
- **P-6:** `/login`, 6 Mal `fremd@dwello.test` mit beliebigem Passwort: keine Sperre. Mit der bekannten Adresse kommt sie nach 5 Versuchen. Hilfreich: auch unbekannte Adressen nach 5 Versuchen gleich behandeln, oder den Unterschied bewusst in Kauf nehmen und in der Begründung festhalten.
- **P-7:** Sperre auslösen wie bei P-1, dann den Text lesen. Hilfreich: «Die Anmeldung mit Passwort ist gesperrt bis …». Gilt die Sperre auch für Google, sollte das dastehen. Den Hinweis «Betreiben Sie Dwello selbst, steht der Befehl in der Installationsanleitung» wie beim Passwort ergänzen.
- **P-8:** `/login`, ein falsches Passwort eingeben: Das Feld bleibt gefüllt, der Fokus ist weg. Hilfreich: das Passwortfeld leeren und den Fokus darauf setzen.

## Nicht geprüft

- Das Protokoll des Servers (Fehlversuche mit eingetippter E-Mail-Adresse, ohne IP): Als Benutzerin sehe ich es nicht.
- Die Anmeldung über Google bis zum Ende, und ob sie während der Sperre funktioniert: Der Weg führt zu accounts.google.com, einem externen Dienst. Ich habe nur die Weiterleitung und das gesetzte Cookie `dwello_oauth_state` gesehen.
- Ob das Passwort wirklich nur als Hash gespeichert ist: nicht von aussen prüfbar.
- Das Ablaufen der Sperre um 15:30 Uhr: Ich habe nicht 15 Minuten gewartet. Hinweis an den Aufrufer: `weber@dwello.test` ist bis 15:30 Uhr (21.10.2026) gesperrt. Bestehende Sitzungen anderer Personas laufen weiter, neue Anmeldungen mit Passwort sind bis dahin gesperrt.
- Ob ein leeres Absenden als Fehlversuch zählt: nicht getrennt geprüft.
- Wie viele der 9 Protokolleinträge von mir stammen: Zwei sind sicher meine. Die übrigen ordne ich anderen Personas zu und werte sie nicht.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/weber-576/`.
