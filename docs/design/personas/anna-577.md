# Anna – Slice 577: Dwello im Browser einrichten

Persona: Anna, 29, erstmals Vermieterin. Desktop 1440 × 900, Übersicht zusätzlich auf Mobile 390 × 844. Frische Installation unter http://localhost:3323, abgemeldet gestartet (Cookie des Persona-Kits vorher gelöscht).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dwello einrichten (`/setup`) | Leeres Formular abgeschickt: Meldung «Die Anfrage war ungültig. Laden Sie die Seite neu und versuchen Sie es erneut.» Sie sagt nicht, dass Felder fehlen, und markiert kein Feld. Neu laden hilft nicht. |
| P-2 | Minor | Dwello einrichten, Hilfetext zum Einrichtungscode | Der Befehl `docker logs dwello-backend` steht als normaler Fliesstext im Satz und bricht am Bindestrich um («dwello-» / «backend»). Ich sehe nicht sofort, was genau ich eintippen muss. «Auf dem Server» sagt mir nicht, ob mein PC gemeint ist. |
| P-3 | Nit | Übersicht, Hinweis zum KI-Modell | «Das KI-Modell wird geladen: 40 %.» ist verständlich. Ich erfahre aber nicht, wofür die KI gut ist, und nicht, ob ich warten oder die Seite neu laden muss, damit sich die Zahl ändert. |

## Beobachtungen

- Die erste Adresse `/` führt direkt auf «Dwello einrichten» (Seitentitel «Dwello einrichten - Dwello»). Ich musste nichts suchen.
- Falscher Code: «Der Einrichtungscode stimmt nicht. Sie finden ihn im Protokoll des Servers mit dem Befehl docker logs dwello-backend; es gilt der zuletzt angezeigte Code. Geben Sie ihn erneut ein.» Das hilft gut. Code und E-Mail-Adresse bleiben stehen, die beiden Passwörter werden geleert.
- Ungleiche Passwörter: «Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein.» Klar formuliert.
- Die Zeile im Log ist gut zu finden und erklärt sich selbst: «[setup] Einrichtungscode: LAYS-K2LR (Dwello einrichten: die Adresse von Dwello im Browser öffnen)».
- Nach der Einrichtung lande ich direkt auf der «Übersicht». Oben rechts steht «anna@dwello.test», ich bin also angemeldet, wie es die Seite versprochen hat. Ein «Willkommen» oder «Dwello ist eingerichtet» gibt es nicht. Die Übersicht macht trotzdem klar, wo ich stehe.
- Unter «Als Nächstes zu tun» steht der nächste Schritt: «Nächster Schritt: Erstes Gebäude erfassen», mit der Schaltfläche «Gebäude erfassen». Ich wüsste sofort, was zu tun ist.
- Unter «Häufige Arbeiten» stehen «Mieter erfassen» und «Mietvertrag erfassen», obwohl es noch kein Gebäude gibt. Das könnte mich verleiten, falsch anzufangen.
- Auf dem Handy (390 px) scrollt nichts seitwärts (scrollWidth 390). Der KI-Hinweis und der nächste Schritt stehen oben.
- Die Fusszeile zeigt «Version unbekannt», auch schon auf der Einrichtungsseite. Das wirkt unfertig. Vermutlich ist es ein Wert, der beim Bauen gesetzt wird.
- Die Passwortfelder sind als Passwort markiert (`type=password`, `autocomplete=new-password`). Der Browser könnte also ein Passwort vorschlagen.
- Wenn ich nach der Einrichtung abgemeldet `/setup` öffne, komme ich auf «Anmelden». Der Text dort, «Melden Sie sich mit der E-Mail-Adresse und dem Passwort an, die bei der Einrichtung festgelegt wurden.», passt dazu. Der Hinweis zu «Passwort vergessen?» nennt den Betreiber oder die Installationsanleitung.
- Cookies nach der Einrichtung: `dwello_session` (HttpOnly), `dwello_xsrf`, `PARAGLIDE_LOCALE`. Bis zur Übersicht ruft die Seite nur localhost:3323 auf.

## Aufgabe geschafft: ja

Ich verstehe, was die Seite will: ein Konto mit Passwort anlegen. Ich weiss, wo der Code steht, nämlich im Protokoll des Servers, den Befehl nennt die Seite. Und ich weiss, was danach kommt: das erste Gebäude erfassen. Dass das KI-Modell noch lädt und ich Rechnungen bis dahin von Hand erfasse, ist ebenfalls klar.

## Aufwand

Etwa 5 Minuten, 4 Absendeversuche. Drei davon waren absichtliche Fehlversuche (leer, ungleiche Passwörter, falscher Code), der vierte war die echte Einrichtung. Sie ging beim ersten Mal durch. Eine Suche im Log.

## Ablauf

1. **Adresse öffnen.** Erwartet: eine Anmeldung oder etwas wie «Willkommen». Gesehen: Weiterleitung über `/login` auf `/setup`, «Dwello einrichten», vier Felder (Einrichtungscode, E-Mail-Adresse, Passwort, Passwort wiederholen), die Schaltfläche «Dwello einrichten» und Links zu den Nutzungsbedingungen und zur Datenschutzerklärung. Der Einleitungstext sagt, dass ich danach angemeldet bin. Gut. (Screenshot 01-start.png)
2. **Leer abschicken.** Erwartet: «Bitte füllen Sie … aus» bei den Feldern. Gesehen: ein rotes Feld oben mit «Die Anfrage war ungültig. Laden Sie die Seite neu …». Ich hätte gedacht, die Seite sei kaputt. (02-leer.png, P-1)
3. **Ungleiche Passwörter, erfundener Code.** Erwartet: Hinweis auf die Passwörter. Gesehen: genau das, Code und E-Mail bleiben stehen. (03-ungleich.png)
4. **Falscher Code, gleiche Passwörter.** Erwartet: «Code falsch». Gesehen: eine klare Meldung mit dem Weg zum richtigen Code. (04-falscher-code.png)
5. **Im Log nachsehen**, wie es die Seite sagt. Erwartet: eine Zeile mit dem Code. Gesehen: `Einrichtungscode: LAYS-K2LR` mit einem Hinweis, was damit zu tun ist.
6. **Echte Einrichtung** mit LAYS-K2LR, anna@dwello.test und einem eigenen Passwort (zweimal). Erwartet: angemeldet sein. Gesehen: «Übersicht», oben meine E-Mail-Adresse. (05-ausgefuellt.png, 06-nach-einrichtung.png)
7. **Übersicht lesen.** Erwartet: was ich jetzt tun soll. Gesehen: ein blauer Info-Kasten «Das KI-Modell wird geladen: 40 %. Bis es geladen ist, erfassen Sie Rechnungen von Hand.», darunter «Nächster Schritt: Erstes Gebäude erfassen». Überall stehen 0 Gebäude, 0 Wohnungen, 0 Abrechnungen. Ich habe nichts weiter gespeichert.
8. **Übersicht auf dem Handy.** Gleiche Reihenfolge, nichts abgeschnitten. (07-uebersicht-mobil.png)
9. **`/setup` abgemeldet erneut öffnen.** Erwartet: keine zweite Einrichtung. Gesehen: «Anmelden». (08-setup-erneut.png)

## Verwirrung

- «Protokoll des Servers», «auf dem Server», «docker logs»: Ohne meinen Helfer wüsste ich nicht, was das ist und wo ich es eintippe. Weil der Helfer «der Code steht im Log» gesagt hat, passt es. «Protokoll» und «Log» sind für mich aber zwei verschiedene Wörter.
- «Es gilt der zuletzt angezeigte Code»: Warum gibt es mehrere Codes? Bleibt unklar, stört mich aber nicht.
- «KI-Modell»: Was die KI für mich tut, steht nirgends. Dass es um Rechnungen geht, ahne ich nur aus dem zweiten Satz.
- «Liegenschaft» im nächsten Schritt, «Gebäude» auf der Schaltfläche: Ich nehme an, das ist dasselbe.

## Fehlerrisiken

- Beim Abtippen des Befehls kann aus dem Umbruch «dwello- backend» mit Leerzeichen werden (P-2).
- Wer leer oder unvollständig abschickt, lädt wegen der Meldung die Seite neu und verliert dabei den schon eingetippten Code (P-1).
- Wer das Passwort vergisst, braucht den Betreiber. Das steht erst auf der Anmeldeseite, nicht schon bei der Einrichtung.
- «Mieter erfassen» oder «Mietvertrag erfassen» vor dem ersten Gebäude.

## Vorschläge

- **P-1:** `/setup` abgemeldet öffnen und «Dwello einrichten» drücken, ohne etwas einzugeben. Hilfreich wäre eine Meldung pro Feld («Geben Sie den Einrichtungscode ein.», «Geben Sie Ihre E-Mail-Adresse ein.» …) mit Fokus auf das erste leere Feld, statt «Laden Sie die Seite neu».
- **P-2:** `/setup` auf dem Desktop öffnen und den Hilfetext unter «Einrichtungscode» lesen. Hilfreich wäre der Befehl als eigene Zeile in Schreibmaschinenschrift, die nicht umbricht. Dazu ein Satz wie «auf dem Computer, auf dem Dwello installiert ist (meist erledigt das, wer Dwello installiert hat)».
- **P-3:** Nach der Einrichtung die Übersicht ansehen. Hilfreich wäre ein Halbsatz zum Zweck («Die KI ordnet hochgeladene Rechnungen einer Kategorie zu.») und ob die Anzeige sich selbst aktualisiert.

## Nicht geprüft

- Zu kurzes Passwort: Ich habe es nur zusammen mit einem falschen Code versucht, um nichts zu speichern. Es kam die Meldung zum Code, die Prüfung der Länge habe ich also nicht gesehen.
- Ob die 40 % mit der Zeit steigen und was die Übersicht bei 100 % zeigt: Auf dieser Installation bleibt der Wert fest bei 40 %.
- Anmelden mit dem neuen Passwort nach dem Abmelden: Die Anmeldeseite habe ich nur angesehen, um die Sitzung nicht unnötig zu ändern.
- Andere Sprachen als Deutsch, dunkler Modus.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-577/`
