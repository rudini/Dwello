# Marco – Slice 577: Dwello einrichten (Handy)

Persona: Marco, 38, Handy 390 × 844, Touch. Installation: frisch, ohne Konto (http://localhost:3325), abgemeldet gestartet (Kit-Cookies gelöscht).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/marco-577/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dwello einrichten | Das Feld «Einrichtungscode» schaltet Autokorrektur und automatische Grossschreibung nicht aus (`type="text"`, kein `autocapitalize`/`autocorrect`/`spellcheck="false"`). Auf dem Handy kann die Tastatur aus «QMNU» ein Wort machen. Kleinbuchstaben nimmt Dwello an, das ist gut. |
| P-2 | Minor | Dwello einrichten, Fehler «Passwörter stimmen nicht überein» | Die Meldung steht oben und ist gut zu sehen. Die zwei Passwortfelder sind danach aber leer, nicht markiert (kein roter Rahmen, kein `aria-invalid`, kein Hinweis direkt beim Feld) und liegen unterhalb des sichtbaren Bereichs. Ich muss selbst nach unten scrollen und erraten, dass ich beide neu eingeben muss. |
| P-3 | Nit | Dwello einrichten | Der Befehl «docker logs dwello-backend» steht als normaler Fliesstext im Hilfetext. Man sieht nicht, wo der Befehl anfängt und aufhört (keine Code-Schrift). |
| P-4 | Nit | Übersicht, KI-Hinweis | «Das KI-Modell wird geladen: 40 %.» liest sich gut. Ich weiss aber nicht, ob die Zahl von selbst weiterläuft oder ob ich die Seite neu laden muss, und auch nicht, wie lange das ungefähr dauert. |

## Beobachtungen

- Alle Felder und der Knopf sind 48 px hoch und 292 px breit, gut mit dem Daumen zu treffen. Die Labels stehen über den Feldern.
- Tastaturtypen: E-Mail `type="email"` mit `autocomplete="username"`, beide Passwörter `type="password"` mit `autocomplete="new-password"`, also schlägt der Passwortmanager ein neues Passwort vor. Das passt.
- Es scrollt nichts seitwärts: `scrollWidth` war auf der Einrichtung, nach dem Fehler und auf der Übersicht 390.
- Nach dem Fehler bleiben Code und E-Mail stehen, nur die Passwörter werden geleert. Das ist gut so.
- Die Fehlermeldung ist ein `alert`, und die Seite springt so, dass sie zu sehen ist (scrollY 241, Screenshot 03-mismatch-viewport.png: rote Box mit Ausrufezeichen direkt unter der Einleitung).
- Nach dem Einrichten landete ich direkt angemeldet auf der Übersicht, wie es der Einleitungstext verspricht. Danach führt `/setup` im abgemeldeten Zustand zur Anmeldung. Der Hilfetext dort («… die bei der Einrichtung festgelegt wurden») passt.
- Netzwerk: Der Browser sprach nur mit localhost:3325. Cookies: `dwello_session` (HttpOnly, Lax), `dwello_xsrf`, `PARAGLIDE_LOCALE`.
- Nebenbei: Die Cookies des Persona-Kits gelten auf localhost für alle Ports. Mit ihnen zeigte die frische Installation die Übersicht schon vor der Einrichtung, offenbar weil sie dasselbe JWT-Secret hat wie der Persona-Stack. Das ist vermutlich nur ein Effekt des Teststands und kein Befund.

## Aufgabe geschafft: ja

## Aufwand

Etwa 3 Minuten echte Bedienung, 2 Versuche: 4 Felder + 1 Tipp beim ersten Versuch (Fehler), beim zweiten 4 Felder + 1 Tipp (in der Wirklichkeit wären es nur die 2 Passwörter neu).

## Ablauf

1. **http://localhost:3325 öffnen.** Erwartet: eine Seite zum Einrichten. Gesehen: Weiterleitung auf `/setup`, «Dwello einrichten» mit kurzer Einleitung, vier Feldern, einem Knopf und den Links auf Nutzungsbedingungen und Datenschutz (02-signedout.png). Klar.
2. **Code holen.** Erwartet: der Hilfetext sagt, wo der Code steht. Gesehen: «Er steht im Protokoll des Servers: Geben Sie auf dem Server den Befehl docker logs dwello-backend ein. Es gilt der zuletzt angezeigte Code.» Im Log stand `QMNU-CB5Z`. Verständlich, nur der Befehl hebt sich nicht ab (P-3).
3. **Felder antippen und ausfüllen, die Passwörter absichtlich verschieden.** Erwartet: eine klare Meldung. Gesehen: rote Box oben: «Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein.» Sie ist im Blick, Code und E-Mail bleiben, die Passwörter sind leer und unten ausserhalb des Bildschirms, ohne Markierung (P-2).
4. **Nochmals mit gleichen Passwörtern, den Code so getippt, wie ihn die Handytastatur macht («Qmnu-cb5z»).** Erwartet: entweder angenommen oder ein Hinweis zur Schreibweise. Gesehen: angenommen, direkt weiter zur Übersicht.
5. **Übersicht.** Erwartet: ein Hinweis zur KI. Gesehen: eine blaue Info-Box mit Info-Icon, «Das KI-Modell wird geladen: 40 %.», darunter «Bis es geladen ist, erfassen Sie Rechnungen von Hand.» (04-after-Qmnu-cb5z.png). Sie ist gut lesbar und bricht sauber um, und es scrollt nichts seitwärts. Darunter kommt sofort der nächste Schritt «Erstes Gebäude erfassen».

## Verwirrung

- «Protokoll des Servers» und «docker logs»: Ich kenne das als Betreiber knapp. Wer Dwello nicht selbst installiert hat, versteht es nicht. Für den Zweck der Seite reicht es aber.
- «KI-Modell wird geladen»: Gemeint ist der Download. «geladen» kann auch «wird gerade benutzt» heissen. Es bleibt offen, ob ich warten oder später wiederkommen soll (P-4).

## Fehlerrisiken

- Autokorrektur verändert den Code (P-1). Dann kommt die Meldung, und ich weiss nicht, warum.
- Nach dem Passwortfehler tippe ich auf «Dwello einrichten», ohne nach unten zu scrollen. Die Felder sind leer, und es kommt vermutlich eine weitere Meldung (P-2).

## Vorschläge

- **P-1:** `/setup` auf dem Handy öffnen und das Feld «Einrichtungscode» antippen: Die Tastatur startet mit Gross-/Kleinschreibung und Autokorrektur. Hilfreich wäre im Feld `autocapitalize="characters"`, `autocorrect="off"`, `spellcheck="false"`.
- **P-2:** Code und E-Mail eingeben, Passwort «Velo-Zuerich-2026!» und Wiederholung «Velo-Zuerich-2062!», dann «Dwello einrichten» tippen. Die Meldung steht oben, die leeren Passwortfelder liegen unsichtbar weiter unten. Hilfreich wären: den Fokus nach der Meldung auf «Passwort» setzen oder bei den Feldern eine Fehlermarkierung mit Text zeigen (`aria-invalid`, `aria-describedby`), und in der Meldung «Geben Sie beide Passwörter neu ein» schreiben.
- **P-3:** Hilfetext beim Einrichtungscode lesen. Hilfreich wäre der Befehl in Code-Schrift oder auf einer eigenen Zeile.
- **P-4:** Nach dem Einrichten die Übersicht ansehen. Hilfreich wäre ein Satz wie «Die Anzeige aktualisiert sich von selbst» oder «Laden Sie die Seite später neu».

## Nicht geprüft

- Ob die 40 % von selbst weiterlaufen und wie der Hinweis bei 100 % oder bei einem Fehler aussieht: Der Teststand liefert fest 40 %.
- Eine echte Handytastatur (iOS/Android): Headless Chromium zeigt keine. Die Tastaturtypen habe ich aus den Feldattributen abgeleitet.
- Ein falscher oder abgelaufener Einrichtungscode: nicht Teil der Aufgabe, und nach der Einrichtung nicht mehr erreichbar.
- Dunkler Modus und andere Sprachen.
