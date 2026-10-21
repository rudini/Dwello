# Anna – Slice 576: Anmelden mit Passwort oder Google

Persona: Anna, 29, kommt nach Monaten zurück und weiss nur noch, dass jemand Dwello für sie auf einem Heimserver eingerichtet hat. Desktop 1440 × 900, dazu die Anmeldeseite auf dem Handy (390 × 844). Ich habe ohne Sitzung begonnen und nichts gespeichert. Ich habe 2 falsche Passwörter versucht (erlaubt waren höchstens 3).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Anmelden (`/login`) | Die Seite sagt nicht, wann ich «Mit Google anmelden» nehmen soll. Der Einleitungstext nennt nur E-Mail und Passwort, der Google-Knopf steht ohne Erklärung darunter (kein «oder», kein Hinweis wie «nur wenn Ihr Konto mit Google eingerichtet wurde»). Ich habe überlegt, ob mein Konto vielleicht doch ein Google-Konto ist. |
| P-2 | Minor | Anmelden, Hilfetext beim Passwort | «Passwort vergessen?» hilft mir nur halb. «Der Betreiber Ihrer Dwello-Installation» und «mit einem Befehl» kann ich nicht einordnen: Bin ich der Betreiber, weil es mein Server ist? Welche Installationsanleitung, und wo finde ich sie? Ein Link oder ein Name fehlt. Der Text steht ausserdem zwischen der Beschriftung «Passwort» und dem Feld, mit vier Zeilen ist er dort lang. |
| P-3 | Nit | Hilfe (`/help`, ohne Anmeldung erreichbar) | Die Hilfe, die oben links auf der Anmeldeseite verlinkt ist, enthält nichts zum Anmelden, zum Passwort oder zu Google. Sie erklärt nur Fachbegriffe wie Akonto. Wer beim Anmelden feststeckt, findet dort nichts. |

## Beobachtungen

- Der Google-Knopf hat ein Personen-Symbol und nicht das bekannte Google-Zeichen. Der Text ist trotzdem eindeutig.
- Nach einem falschen Passwort bleibt die E-Mail-Adresse stehen (gut). Im Passwortfeld steht weiter das falsche Passwort, nur als Punkte sichtbar. Ich habe es überschrieben, man könnte aber auch ein zweites Mal mit demselben falschen Passwort auf «Anmelden» drücken.
- Die Fehlermeldung «E-Mail-Adresse oder Passwort stimmen nicht. Prüfen Sie Ihre Eingabe und versuchen Sie es erneut.» ist klar und rot umrandet, mit Symbol, und steht über den Feldern. Sie sagt nicht, wie viele Versuche ich noch habe und ob das Konto gesperrt wird. Ich habe das nicht weiter getestet (siehe «Nicht geprüft»).
- Die Rücksprung-Adresse bleibt erhalten: Ich habe `/buildings` ohne Anmeldung geöffnet, einmal das falsche Passwort eingegeben, dann das richtige, und bin direkt auf «Gebäude» gelandet. Auch der Google-Link nimmt sie mit.
- Der Google-Link leitet zu accounts.google.com weiter (302, Client-ID im Persona-Stack nur ein Platzhalter). Ob das Google-Konto für diese Installation überhaupt eingerichtet ist, verrät die Seite nicht.
- Das Wort «Konto mit Passwort» aus der Anforderung erscheint auf der Seite nirgends. Es steht nur «E-Mail-Adresse» und «Passwort». Mich hat das nicht gestört.
- Auf dem Handy (390 px) gibt es kein seitliches Scrollen (scrollWidth 390). Felder und Knöpfe sind gross genug.
- Nach der Anmeldung zeigt der Kopf meine E-Mail-Adresse «anna@dwello.test». So weiss ich, dass ich mit dem richtigen Konto drin bin.

## Aufgabe geschafft: ja

## Aufwand

Etwa 3 Minuten und 7 Schritte: Seite öffnen, lesen, Hilfe ansehen, ein falsches Passwort, das richtige Passwort, Übersicht lesen, dazu die Kontrolle auf dem Handy mit einem zweiten falschen Versuch.

## Ablauf

1. **`http://localhost:3300/` ohne Anmeldung öffnen.** Ich erwartete eine Anmeldeseite. Ich sah eine Weiterleitung auf «Anmelden – Dwello» mit Haus-Bild, dem Satz «Melden Sie sich mit der E-Mail-Adresse und dem Passwort an, die bei der Einrichtung festgelegt wurden.», den Feldern E-Mail-Adresse und Passwort, dem dunklen Knopf «Anmelden» und darunter dem hellen Knopf «Mit Google anmelden» (Screenshot 01). Der Hauptweg ist klar: E-Mail und Passwort. Wozu der Google-Knopf da ist, sagt die Seite nicht (P-1).
2. **Lesen, was bei einem vergessenen Passwort zu tun ist.** Ich erwartete einen Link «Passwort vergessen». Ich sah einen Text über dem Passwortfeld: Der Betreiber setzt das Passwort mit einem Befehl zurück, steht in der Installationsanleitung. Ich verstehe daraus, dass ich die Person fragen muss, die Dwello für mich eingerichtet hat. «Betreiber» und «Befehl» klingen aber technisch (P-2).
3. **Oben links «Hilfe» öffnen.** Ich erwartete etwas zum Anmelden. Ich sah eine Seite mit Fachbegriffen (Akonto usw.), aber nichts zum Anmelden (P-3).
4. **Ein falsches Passwort eingeben (Dwello-Test-2025).** Ich erwartete eine verständliche Fehlermeldung. Ich sah den roten Hinweis «E-Mail-Adresse oder Passwort stimmen nicht …». Die E-Mail-Adresse blieb stehen, das falsche Passwort auch (Screenshot 03).
5. **Das richtige Passwort eingeben (Dwello-Test-2026).** Ich erwartete die Startseite. Ich sah die «Übersicht» mit «Als Nächstes zu tun» und dem Kasten «Nächster Schritt: Nebenkostenabrechnungen erstellen»: Noch nicht abgerechnet sind Alpenblick 2025 usw., zuerst Rechnungen erfassen, dazu der Knopf «Abrechnungen erstellen». Darunter steht «7 Nebenkostenabrechnungen sind noch im Entwurf» mit dem Knopf «Entwürfe ansehen» und eine Frist am 28.10.2026 (Screenshot 04). **Ja, ich weiss, was als Nächstes zu tun ist.** Der Kasten «Nächster Schritt» sagt es mir direkt.
6. **Handy: `/buildings` ohne Anmeldung öffnen.** Ich erwartete die Anmeldeseite und danach die Gebäude. Ich sah dieselbe Seite, passend zur Breite (Screenshot 05). Nach einem falschen Versuch (kleines «d») und dann dem richtigen Passwort landete ich auf «Gebäude».

## Verwirrung

- «Mit Google anmelden»: Gehört das zu meinem Konto? Der Text oben spricht nur vom Passwort.
- «Betreiber Ihrer Dwello-Installation»: Meine Freundin, die den Server eingerichtet hat? Oder ich selbst, weil der Server bei mir steht?
- «mit einem Befehl» und «Installationsanleitung»: Ich weiss nicht, wo die Anleitung ist. Auf der Seite gibt es keinen Link dazu.

## Fehlerrisiken

- Wer unsicher ist, klickt «Mit Google anmelden», landet bei Google, meldet sich dort mit einer anderen Adresse an und bekommt vielleicht ein leeres oder fremdes Konto oder eine Absage. Was dann passiert, habe ich nicht geprüft.
- Das falsche Passwort bleibt im Feld stehen. Wer schnell noch einmal auf «Anmelden» drückt, verbraucht einen weiteren Versuch.
- Ohne Hinweis auf eine Sperre probiert man vielleicht mehrere Passwörter hintereinander durch.

## Vorschläge

- **P-1:** `/login` ohne Anmeldung öffnen, den Text über den Feldern und den Google-Knopf ansehen. Hilfreich wäre ein Trenner «oder» und ein Satz beim Google-Knopf, zum Beispiel «Nur wenn Ihr Konto bei der Einrichtung mit Google verbunden wurde». Oder den Google-Knopf ausblenden, wenn Google auf dieser Installation nicht eingerichtet ist.
- **P-2:** `/login` öffnen und den Text unter «Passwort» lesen. Hilfreich wäre ein Text in einfachen Worten, etwa «Passwort vergessen? Fragen Sie die Person, die Dwello für Sie eingerichtet hat. Sie kann es zurücksetzen.» Den Teil für Selbstbetreiber mit einem Link auf die Anleitung ergänzen. Der Text könnte auch unter das Feld rücken, damit die Beschriftung direkt über dem Feld steht.
- **P-3:** Auf `/login` auf «Hilfe» klicken. Hilfreich wäre ein kurzer Abschnitt «Anmelden» in der Hilfe: welche Wege es gibt und was bei einem vergessenen Passwort zu tun ist.

## Nicht geprüft

- Die Anmeldung mit Google bis zum Ende: Der Persona-Stack hat nur eine Platzhalter-Client-ID, und ein echtes Google-Konto habe ich nicht.
- Was nach mehreren falschen Passwörtern passiert (Sperre, Wartezeit): Ich durfte höchstens 3 falsche Passwörter versuchen und habe bei 2 aufgehört.
- Das Zurücksetzen des Passworts selbst: Das geht nur mit einem Befehl auf dem Server, nicht über die Oberfläche.
- Abmelden und andere Sprachen: Sie gehörten nicht zur Aufgabe.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-576/` (01-start, 02-help, 03-falsch, 04-nach-anmeldung, 05-mobil-login, 06-mobil-falsch, 07-mobil-danach).
