# Sven – Slice 577: Dwello im Browser einrichten

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, beurteilt über den Accessibility-Baum (Rolle, Name, Beschreibung, Zustand des fokussierten Elements; Live-Regionen).
Installation: frisch, ohne Konto, http://localhost:3322. Einrichtungscode aus dem Serverprotokoll: `AXP6-9K4C`.
Gespeichert: nur die Einrichtung (Konto sven@dwello.test). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/sven-577/`.

| ID | Schwere | Bildschirm | Befund |
|----|---------|------------|--------|
| P-1 | Major | Dwello einrichten, Fehlerzustand | Nach jedem Fehler (falscher Code, Passwörter ungleich) sind beide Passwortfelder leer. Die Fehlermeldung sagt das nicht («Geben Sie ihn erneut ein» meint nur den Code). Ich korrigiere den Code, drücke Enter und laufe in den nächsten Fehler. |
| P-2 | Minor | Dwello einrichten, Fehlerzustand | Der Fokus geht auf die Meldung (gut), aber kein Feld ist danach als ungültig markiert (`invalid=false` bei «Passwort» und «Passwort wiederholen» nach dem Passwortfehler) und die Meldung hängt an keinem Feld. Komme ich per Tab zum Feld, höre ich nur die normale Hilfe, keinen Fehler. |
| P-3 | Minor | Dwello einrichten, leere Felder | Ich habe einmal versehentlich abgeschickt, während E-Mail und Passwort leer waren. Die Meldung war «Die Anfrage war ungültig. Laden Sie die Seite neu und versuchen Sie es erneut.» Sie sagt nicht, welches Feld fehlt, und das Neuladen hilft nicht. Die Felder sind als «erforderlich» angesagt, der Browser hat das Abschicken aber nicht verhindert. |
| P-4 | Minor | Übersicht direkt nach der Einrichtung | Es gibt keine Bestätigung «Dwello ist eingerichtet, Sie sind angemeldet». Der Fokus liegt auf dem Dokument, angesagt wird nur der Seitentitel «Übersicht - Dwello». Dass ich als sven@dwello.test angemeldet bin, finde ich erst nach vier Tabs am Benutzermenü. |
| P-5 | Nit | Übersicht, KI-Hinweis | «Das KI-Modell wird geladen: 40 %.» ist ein einfacher Absatz ohne Überschrift und ohne Live-Region. Ich höre ihn nur, wenn ich den Hauptinhalt lese (direkt nach der Überschrift, also gut auffindbar). Ob ich erfahre, wann das Laden fertig ist, konnte ich nicht prüfen (siehe «Nicht geprüft»). |

## Beobachtungen

- Mein erster Aufruf ging versehentlich mit dem Sitzungs-Cookie des Persona-Werkzeugs (gesetzt für localhost:3300; Cookies gelten nicht pro Port). Die frische Installation auf 3322 hat dieses Cookie angenommen und zeigte die Übersicht als «Vera Verwalter», obwohl noch kein Konto eingerichtet war. Danach erschien ohne Cookie trotzdem noch «Dwello einrichten». Vermutlich verwenden beide Stacks dasselbe JWT-Geheimnis. Ein gültiges Sitzungstoken umgeht also die Einrichtung. Das gehört zur Testumgebung und hat deshalb keine Schwere, sollte aber jemand mit Blick auf echte Installationen prüfen.
- Die Tab-Reihenfolge ist sauber: «Zum Inhalt springen», «Hilfe», «Sprache: Deutsch», dann Einrichtungscode, E-Mail-Adresse, Passwort, Passwort wiederholen, Button «Dwello einrichten», danach die Links zu den Nutzungsbedingungen und zur Datenschutzerklärung.
- Alle vier Felder haben ein sichtbares Label über dem Feld, einen zugänglichen Namen und sind als «erforderlich» angesagt. Einrichtungscode und Passwort haben ihre Hilfe als Beschreibung (`aria-describedby`), die beim Fokussieren vorgelesen wird. E-Mail und «Passwort wiederholen» haben keine Hilfe, brauchen aber auch keine.
- Die Fehlermeldung zum falschen Code ist eine Meldung mit Rolle `alert` (assertive) und bekommt den Fokus. Ihr Text ist klar: «Der Einrichtungscode stimmt nicht. Sie finden ihn im Protokoll des Servers mit dem Befehl docker logs dwello-backend; es gilt der zuletzt angezeigte Code. Geben Sie ihn erneut ein.» Code und E-Mail bleiben stehen.
- Die Meldung bei ungleichen Passwörtern ist ebenso klar: «Die beiden Passwörter stimmen nicht überein. Geben Sie das Passwort zweimal gleich ein.»
- Es gibt keine Möglichkeit, das Passwort anzeigen zu lassen. Gerade mit dem Screenreader wäre das bei «zweimal gleich eingeben» hilfreich.
- Nach der Einrichtung öffnet `/setup` die Seite «Anmelden». Die Anmeldung mit sven@dwello.test und dem gewählten Passwort geht per Tastatur.
- Netzwerk und Cookies: Das Formular schickt einen POST an `http://localhost:3322/setup`. Danach sind `dwello_session` (HttpOnly), `dwello_xsrf` und `PARAGLIDE_LOCALE` gesetzt.
- Der Hinweis «Bis es geladen ist, erfassen Sie Rechnungen von Hand.» ist verständlich. Auch nach 5 Sekunden zeigte er unverändert 40 % (der Platzhalter meldet einen festen Stand).

## Aufgabe geschafft: ja

## Aufwand

- Etwa 8 Durchläufe mit Skripten. Davon gehörten 3 zur eigentlichen Aufgabe (falscher Code, ungleiche Passwörter mit anschliessender richtiger Einrichtung, Anmeldung zur Kontrolle); die übrigen waren Fehlversuche meines Werkzeugs.
- Einrichtung im Durchgang mit Korrektur: rund 6,5 Sekunden Skriptzeit. 4 Tabs bis zum Codefeld, danach 4 Felder, Enter, einmal korrigieren (beide Passwörter neu eingeben), Enter.
- Falscher Code: höchstens zweimal abgeschickt. Einmal davon versehentlich mit leeren Feldern (Meldung «Anfrage ungültig», siehe P-3); ob der Server dort den Code überhaupt geprüft hat, weiss ich nicht. Das zweite Mal bewusst mit FALS-CHER.

## Ablauf

1. **Erster Aufruf ohne Konto.** Erwartet: «Dwello einrichten». Gesehen: Weiterleitung auf `/setup`, Titel «Dwello einrichten - Dwello», Überschrift H1 «Dwello einrichten». Darunter der Satz «Legen Sie das Konto mit Passwort an, mit dem Sie sich bei Dwello anmelden. Danach sind Sie angemeldet.» Der Fokus liegt zuerst auf dem Dokument. (Screenshot 02: schlichtes Formular mit vier Feldern untereinander, Button darunter.)
2. **Tab durch die Felder.** Erwartet: Labels und Hilfen. Gesehen: «Einrichtungscode», erforderlich, mit der Beschreibung «Er steht im Protokoll des Servers: Geben Sie auf dem Server den Befehl docker logs dwello-backend ein. Es gilt der zuletzt angezeigte Code.» Dann «E-Mail-Adresse», erforderlich. «Passwort», erforderlich, mit der Beschreibung «Mindestens 8 Zeichen, am besten ein langes Passwort, das Sie sonst nirgends verwenden.» «Passwort wiederholen», erforderlich. Zuletzt der Button «Dwello einrichten».
3. **Versehentliches Abschicken** (mein Werkzeug hatte den Fokus verloren, der Text landete im Codefeld, E-Mail und Passwort blieben leer). Erwartet: ein Hinweis, welches Feld fehlt. Gesehen: «Die Anfrage war ungültig. Laden Sie die Seite neu und versuchen Sie es erneut.» → P-3.
4. **Falscher Code FALS-CHER**, E-Mail und gleiche Passwörter, Enter im letzten Feld. Erwartet: Fehler wird angesagt, Fokus beim Fehler oder am Codefeld. Gesehen: Nach 150 ms liegt der Fokus auf der `alert`-Meldung «Der Einrichtungscode stimmt nicht. …», Live-Region assertive. Das Codefeld enthält noch «FALS-CHER», die E-Mail ist noch da, **beide Passwortfelder sind leer** → P-1. (Screenshot 04: rote Meldung über dem Formular, Code und E-Mail ausgefüllt, Passwörter leer.)
5. **Richtiger Code, absichtlich ungleiche Passwörter.** Erwartet: Fehler am Passwortfeld. Gesehen: Fokus auf der Meldung «Die beiden Passwörter stimmen nicht überein. …». Per Tab: Code und E-Mail stehen noch, beide Passwortfelder sind leer und `invalid=false`, die Fehlermeldung hängt an keinem Feld → P-1, P-2.
6. **Korrigieren und einrichten.** Beide Passwörter neu eingegeben, Enter. Erwartet: Bestätigung und Übersicht, Fokus am Seitenanfang oder an der Überschrift. Gesehen: Nach etwa 800 ms `/dashboard`, Fokus auf dem Dokument, Seitentitel «Übersicht - Dwello» in der Ansage-Region, keine Bestätigung der Einrichtung → P-4. Das Benutzermenü heisst «sven@dwello.test Benutzermenü» (4. Tab).
7. **KI-Hinweis.** Erwartet: Hinweis auf das Laden mit Prozentzahl, auffindbar und verständlich. Gesehen: Im Hauptinhalt direkt nach H1 «Übersicht» und dem Untertitel stehen zwei Absätze: «Das KI-Modell wird geladen: 40 %.» und «Bis es geladen ist, erfassen Sie Rechnungen von Hand.» Keine Live-Region, keine Überschrift, keine Rolle `status` → P-5. (Screenshot 06: Hinweis als Textzeilen über der Karte «Als Nächstes zu tun».)
8. **Kontrolle.** `/setup` ohne Sitzung führt nun zu «Anmelden». Die Anmeldung per Tastatur führt wieder auf die Übersicht, der Fokus liegt wieder auf dem Dokument.

## Verwirrung

- «Einrichtungscode»: Die Hilfe erklärt, wo er steht. Für mich als Screenreader-Nutzer ist «docker logs dwello-backend» vorlesbar, aber ohne Code-Auszeichnung werden die Bindestriche und Wörter zu einem Satzteil. Verstanden habe ich es trotzdem.
- «Es gilt der zuletzt angezeigte Code»: Das deutet an, dass sich der Code ändern kann (etwa nach einem Neustart). Wann das geschieht, steht nicht da.
- «Die Anfrage war ungültig» (P-3): Ich wusste nicht, was ich falsch gemacht hatte.
- «KI-Modell»: Was das für mich bedeutet, erklärt der zweite Satz. Ob die Prozentzahl von selbst weiterläuft oder ob ich neu laden muss, ist unklar.

## Fehlerrisiken

- P-1: Wer nach der Code-Meldung nur den Code korrigiert und abschickt, bekommt die nächste Fehlermeldung. Wer dann die Passwörter in Eile neu eingibt, tippt leichter zwei verschiedene ein.
- P-2: Wer die Meldung überhört (sie bekommt zwar den Fokus, doch ein Tab springt sofort weiter), findet am Feld selbst keinen Hinweis auf den Fehler.
- P-3: Die Empfehlung «Laden Sie die Seite neu» löscht womöglich die übrigen Eingaben und löst das Problem nicht.
- P-4: Ohne Bestätigung bin ich unsicher, ob das Konto angelegt ist, und versuche die Einrichtung vielleicht noch einmal.

## Vorschläge

- **P-1** Reproduktion: `/setup` ohne Konto öffnen, falschen Code (oder ungleiche Passwörter) und sonst alles ausfüllen, Enter. Die Passwortfelder sind danach leer. Hilfe: Die Meldung ergänzen, etwa «… Geben Sie den Code und Ihr Passwort zweimal erneut ein.» Oder die Passwörter nach einem Codefehler stehen lassen.
- **P-2** Reproduktion: wie P-1 mit ungleichen Passwörtern, danach Tab bis «Passwort». Ansage ohne Fehler, `invalid=false`. Hilfe: Das betroffene Feld bekommt `aria-invalid="true"` und eine Beschreibung, die auf die Meldung zeigt, oder den Fokus selbst (Code bei Codefehler, «Passwort» bei ungleichen Passwörtern), mit der Meldung als Beschreibung.
- **P-3** Reproduktion: `/setup`, nur den Einrichtungscode ausfüllen, Enter im Codefeld. Hilfe: eine Meldung pro fehlendem Feld («Geben Sie Ihre E-Mail-Adresse ein.», «Geben Sie ein Passwort mit mindestens 8 Zeichen ein.») statt «Anfrage ungültig … neu laden». Den Fokus auf das erste fehlende Feld setzen.
- **P-4** Reproduktion: Einrichtung erfolgreich abschliessen. Auf der Übersicht keine Bestätigung, Fokus auf dem Dokument. Hilfe: eine kurze Bestätigung in einer `status`-Region, etwa «Dwello ist eingerichtet. Sie sind als sven@dwello.test angemeldet.», und den Fokus auf die H1 «Übersicht».
- **P-5** Reproduktion: Übersicht mit ladendem Modell öffnen. Hilfe: den Hinweis als `status` auszeichnen (polite, nur bei Statuswechseln wie «geladen» ansagen, nicht bei jedem Prozentschritt) oder ihm eine kleine Überschrift «KI-Modell» geben, damit man ihn über die Überschriftennavigation findet.

## Nicht geprüft

- Ob das Codefeld im Fehlerzustand «falscher Code» als ungültig markiert ist: Nach der Meldung bin ich nur rückwärts (Shift+Tab) gelaufen, und ein dritter falscher Code war nicht erlaubt. Den Feldzustand kenne ich nur aus dem Fall «Passwörter ungleich» (P-2).
- Ob sich die Prozentzahl des KI-Modells aktualisiert und ob «fertig geladen» angesagt wird: Der Platzhalter meldet fest 40 %.
- Zu kurze Passwörter (unter 8 Zeichen) und eine ungültige E-Mail-Adresse habe ich nicht abgeschickt, um nichts über die Aufgabe hinaus auszulösen.
- Ein echter Screenreader (NVDA, VoiceOver) lief nicht. Beurteilt habe ich über den Accessibility-Baum von Chromium.
