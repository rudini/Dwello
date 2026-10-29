# Dr. Weber – Zugangsschlüssel für KI-Programme (#817)

Desktop 1440 × 900, Maus, persona-stack auf http://localhost:3300 (Demo-Daten), 28.10.2026.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-817/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Zugangsschlüssel für KI-Programme, Meldung nach «Widerrufen» | Die Erfolgsmeldung lautet «Zugangsschlüssel «» widerrufen»: der Name fehlt. Nach einem Schritt, der sich nicht rückgängig machen lässt, bestätigt mir Dwello nicht, *welchen* Schlüssel es widerrufen hat. Zweimal reproduziert («Claude Desktop Praxis Weber», «Weber Gegenprobe»). |
| P-2 | Minor | Zugangsschlüssel, Kasten «Neuer Zugangsschlüssel» | «Kopieren Sie den Schlüssel jetzt» – aber es gibt keine Schaltfläche «Kopieren». Ich muss die lange Zeichenkette von Hand markieren; ein fehlendes Zeichen merke ich erst im KI-Programm, und dann ist der Schlüssel schon weg (wird nur einmal gezeigt). |
| P-3 | Minor | Zugangsschlüssel, Kasten «Neuer Zugangsschlüssel» | Wo ich den Schlüssel aufbewahre, sagt nur die Datenschutzerklärung («wie ein Passwort»), nicht der Kasten selbst. Und «Tragen Sie ihn in den Einstellungen des KI-Programms ein» sagt nicht, dass Adresse (oben auf der Seite, «http://localhost:3300/mcp») und Schlüssel zusammengehören und beide dort eingetragen werden. Ein Anfänger weiss danach nicht, wo in Claude Desktop er was eintragen soll. |
| P-4 | Minor | Nutzungsbedingungen, «Verantwortung für Abrechnungen» | Der Text sagt, bei einem Zugangsschlüssel gehöre auch «KI-Programme mit Zugangsschlüssel» zu den Angaben für die Mieter – die Linkliste darunter führt aber nur die vier anderen Abschnitte. Wer nach der Liste zusammenstellt, vergisst den KI-Abschnitt. |
| P-5 | Minor | Zugangsschlüssel, Hinweis oben | Der Hinweis «Bevor Sie einen Schlüssel erstellen …» nennt nur, was ich beim Anbieter prüfen muss, nicht, dass ich meinen Mietern Programm, Anbieter und Land nennen muss (Art. 19 DSG). Das steht nur in der Datenschutzerklärung im letzten Satz eines langen Absatzes. |
| P-6 | Minor | Protokoll (Einstellungen und Seite «Protokoll») | Die Beschreibung lautet «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen». Erstellen und Widerrufen von Zugangsschlüsseln (und laut Datenschutzerklärung jeder Abruf eines KI-Programms) stehen dort, beeinflussen aber keine Abrechnung. Wer wissen will, was ein KI-Programm abgefragt hat, sucht hier nach dieser Beschreibung nicht. |

## Beobachtungen

- Der Weg ist gut auffindbar: Einstellungen › Abschnitt «KI» › Karte «Zugangsschlüssel für KI-Programme – Lesezugriff für ein KI-Programm Ihrer Wahl, mit Ablauf nach 90 Tagen». Seite `/config/access-keys`, Brotkrümel «Einstellungen › Zugangsschlüssel für KI-Programme».
- Der Link «Datenschutz» auf der Seite springt korrekt zum Abschnitt «KI-Programme mit Zugangsschlüssel» (`/privacy#ai-keys`).
- Der Abschnitt in der Datenschutzerklärung ist inhaltlich vollständig und für mich verständlich: welche Daten (inkl. Mieter-Kontaktdaten, Rechnungssteller als Einzelpersonen), keine Dokumente/PDFs, nur lesen; Auftragsbearbeitung mit Vertrag, kein Training (Art. 9 DSG); Ausland nur mit Angemessenheit oder Standardvertragsklauseln (Art. 16 DSG); Mieter informieren (Art. 19 Abs. 2 und 4 DSG); 90 Tage Ablauf, Widerruf, Hash. Für eine Anfängerin ist er allerdings ein einziger dichter Absatz; eine kurze Prüfliste («Vor der Weitergabe prüfen: 1. … 2. … 3. …») wäre leichter.
- Kleiner Widerspruch im Wortlaut: «Dwello speichert nur seinen Namen, wann er erstellt und zuletzt benutzt wurde, und den Schlüssel als Hash» – weiter oben steht, dass jeder Abruf mit Datenart und Schlüsselname ins Protokoll kommt. «nur» ist gemeint für den Schlüssel selbst, liest sich aber als abschliessend.
- Die Nutzungsbedingungen erklären gut, dass mit «Sie» im weitergegebenen Text der Vermieter gemeint ist. Dass ich das konkrete Programm, den Anbieter und das Land selbst ergänzen muss (der Dwello-Text sagt nur «ein KI-Programm Ihrer Wahl»), steht nur in der Datenschutzerklärung.
- Dialog «Zugangsschlüssel erstellen»: Hilfetext am Feld («Woran Sie den Schlüssel erkennen, etwa «Claude Desktop Büro»») ist gut. Leerer Name: Meldung «Das hat nicht geklappt – Geben Sie dem Zugangsschlüssel einen Namen.» Verständlich; die Überschrift «Das hat nicht geklappt» klingt nach Systemfehler, obwohl nur der Name fehlt.
- Die Liste zeigt pro Schlüssel «Erstellt am 28.10.2026 · Noch nie benutzt · Läuft ab am 26.01.2027». Nachgerechnet: 28.10.2026 + 90 Tage = 26.01.2027, stimmt.
- Bestätigung beim Widerrufen nennt die echte Folge: «Ein KI-Programm mit dem Zugangsschlüssel «Claude Desktop Praxis Weber» erhält danach keine Daten mehr. Das lässt sich nicht rückgängig machen.» Gut. Man könnte ergänzen, dass man für das Programm einen neuen Schlüssel erstellen und dort eintragen muss.
- Protokoll danach: «28.10.2026, 21:51 – Zugangsschlüssel «Claude Desktop Praxis Weber» erstellt» und «… widerrufen», mit Name, Datum, Uhrzeit, je mit «Löschen». Entspricht der Datenschutzerklärung. Die Einträge anderer Personas standen dazwischen; nicht als Befund gezählt.
- Die Adresse lautet «http://localhost:3300/mcp». Mit «localhost» kann ein KI-Programm auf einem anderen Computer nichts anfangen; auf einer echten Installation hoffentlich die öffentliche Adresse (hier Persona-Umgebung).
- Das Bild bei «Noch kein Zugangsschlüssel» ist ein Dokument mit Häkchen, nicht ein Schlüssel; wirkt etwas zufällig.
- Beim Dialog bleibt die Fusszeile (Datenschutz, Nutzungsbedingungen) hell, der Rest ist abgedunkelt.
- Die Erfolgsmeldung nach dem Widerruf liegt nicht in der Statusregion der Seite (`status` blieb leer); für Screenreader evtl. nicht angesagt – nicht weiter geprüft, ist eher Svens Thema.

## Aufgabe geschafft: ja

## Aufwand

ca. 15 Minuten, 14 Schritte (Einstellungen, Datenschutz, Nutzungsbedingungen, Seite Zugangsschlüssel, Dialog leer, Dialog mit Name, Schlüssel ansehen, Liste neu laden, Widerrufen, Bestätigung, Meldung, Protokoll; dazu eine Gegenprobe Erstellen/Widerrufen für P-1).

## Ablauf

- Nach «Widerrufen» bestätigen: erwartet «Zugangsschlüssel «Claude Desktop Praxis Weber» widerrufen». Gesehen: «Zugangsschlüssel «» widerrufen» (Screenshot `10-revoked.png`, Gegenprobe `12-gegenprobe-toast.png`). Die Liste zeigte den Schlüssel danach nicht mehr.
- Neuer Schlüssel angezeigt: erwartet eine Schaltfläche «Kopieren» und einen Hinweis, wo man ihn ablegt (Passwort-Manager). Gesehen: Schlüssel in einem Kasten, «Kopieren Sie den Schlüssel jetzt. Dwello zeigt ihn nur dieses eine Mal.», nur «Schliessen» (`08-created.png`).
- Nutzungsbedingungen: erwartet in der Linkliste der Abschnitte auch «KI-Programme mit Zugangsschlüssel». Gesehen: nur «Verantwortlich», «Welche Daten Dwello speichert», «Aufbewahrung», «Weitergabe an Dritte».
- Protokoll: erwartet eine Beschreibung, die auch KI-Zugriffe nennt. Gesehen: «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen …», die Einträge selbst waren aber da.

## Vorschläge

- **P-1:** Einstellungen › Zugangsschlüssel für KI-Programme › «Zugangsschlüssel erstellen», Name «Weber Gegenprobe», erstellen, «Schliessen», bei diesem Schlüssel «Widerrufen», im Dialog «Widerrufen». Meldung unten rechts: «Zugangsschlüssel «» widerrufen». Hilft: den Namen des widerrufenen Schlüssels in die Meldung einsetzen.
- **P-2:** Schlüssel erstellen, Kasten «Neuer Zugangsschlüssel». Hilft: Schaltfläche «Schlüssel kopieren» mit Rückmeldung «Kopiert».
- **P-3:** Gleicher Kasten. Hilft: ein Satz wie «Bewahren Sie ihn wie ein Passwort auf, etwa in Ihrem Passwort-Manager» und «Tragen Sie im KI-Programm die Adresse … und diesen Schlüssel ein (bei Claude Desktop unter …)» oder ein Verweis auf die Hilfe.
- **P-4:** Nutzungsbedingungen › «Verantwortung für Abrechnungen», Linkliste unter dem dritten Absatz. Hilft: «KI-Programme mit Zugangsschlüssel» als fünften Link (mit Hinweis «nur wenn Sie einen Schlüssel vergeben»).
- **P-5:** Zugangsschlüssel-Seite, Hinweis oben. Hilft: «… was Sie beim Anbieter prüfen und was Sie Ihren Mietern sagen müssen.»
- **P-6:** Einstellungen, Karte «Protokoll» und Seite Protokoll. Hilft: Beschreibung um «und was KI-Programme mit Ihren Zugangsschlüsseln abgefragt haben» ergänzen.

## Nicht geprüft

- Ob der Schlüssel in einem KI-Programm tatsächlich funktioniert, ob «Noch nie benutzt» danach auf ein Datum wechselt und ob Abrufe im Protokoll erscheinen: Ich habe kein KI-Programm zur Hand, und ein Aufruf von `/mcp` von Hand ist nicht, was ein Nutzer tut. Versucht: nichts darüber hinaus.
- Das Ablaufen nach 90 Tagen (Protokolleintrag «abgelaufen»): die Uhr des Servers lässt sich als Nutzerin nicht vorstellen.
- Andere Sprachen, Handy-Ansicht, dunkles Design: nicht Teil meiner Aufgabe.
