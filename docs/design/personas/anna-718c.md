# Anna – Slice 718c: Neuer Wiederherstellungscode

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück. Desktop 1440 × 900, einzelne Bildschirme auf dem Handy 390 × 844.
Aufgabe: Ich weiss nur noch, dass ich mal ein Blatt mit einem Code bekommen habe, und finde es nicht mehr. Ist das schlimm, und was kann ich tun? Wenn es einen neuen Code gibt: ganz durchspielen (erstellen, Blatt herunterladen und lesen, bestätigen).
Gestartet abgemeldet, ohne Persona-Kit-Cookie, angemeldet als `anna@dwello.test`. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/anna-718c/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | «Neuer Wiederherstellungscode», erster Schritt (und Karte in «Einstellungen») | Meine eigentliche Frage «Ist es schlimm, dass das Blatt weg ist?» beantwortet die Seite nicht. Weder die Karte noch die Seite sagen, wozu der Code dient (Daten nach einem Notfall zurückholen). Die Seite beginnt gleich mit den Folgen für «Sicherungen von vorher» und verlangt «Bewahren Sie das alte Notfallblatt bis dahin auf», obwohl ich laut Karte gerade deshalb hier bin, weil ich es verloren habe. Was es für mich heisst, dass es weg ist (ältere Sicherungen kann bis zu 12 Monate lang niemand mehr öffnen; wer das Blatt findet, kann sie lesen), muss ich mir selbst zusammenreimen. Verstanden habe ich den Zweck erst im PDF, nach dem Erstellen («Im Notfall: Geben Sie dieses Blatt der Person, die Dwello betreut …»). |
| P-2 | Minor | «Neuer Wiederherstellungscode», nach dem Bestätigen | Nach «Neuen Code bestätigen» steht unter der grünen Meldung wieder das Passwortfeld mit «Neuen Code erstellen» als einziger Knopf. Ich war kurz unsicher, ob ich noch nicht fertig bin und nochmals etwas tun muss. Einen Abschluss gibt es nicht (z. B. «Zurück zu den Einstellungen»), und darüber steht immer noch der Text über die alten Sicherungen. |
| P-3 | Minor | Notfallblatt (PDF) | Laut Blatt gilt der Code «für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben». Auf dem Blatt steht aber nur «Code erstellt am 30.10.2026», denn heruntergeladen wird es vor dem Bestätigen. Auch im «Protokoll» steht weder das Erstellen noch das Bestätigen (nur Anmeldungen). In einem Jahr weiss ich also nicht mehr, ab wann genau dieses Blatt gilt und ab wann das alte. |
| P-4 | Minor | «Neuer Wiederherstellungscode», erster Schritt | Klicke ich «Neuen Code erstellen», ohne etwas einzugeben, kommt «Das Passwort stimmt nicht.» Ich habe aber gar nichts eingegeben und dachte im ersten Moment, mein Passwort sei falsch. |
| P-5 | Minor | Notfallblatt-Download nach dem Bestätigen | Hat man die Seite mit dem Download-Knopf noch in einem anderen Tab offen und lädt nach dem Bestätigen herunter, landet man ohne Erklärung auf der «Übersicht». Dass das Blatt nach dem Bestätigen nicht mehr zu haben ist, steht zwar auf der Seite, aber nicht dort, wo man dann landet. Man kann so leicht glauben, der Download habe geklappt. |

## Beobachtungen

- **Den Ort finden:** Zuerst habe ich in der «Übersicht» gesucht (dort steht nichts zu Sicherung oder Code), dann im Benutzermenü (nur «Einstellungen» und «Abmelden»), dann in der «Hilfe». Die Hilfe kennt weder «Sicherung» noch «Code» noch «Notfallblatt», auch nicht unter «Begriffe kurz erklärt». Gefunden habe ich es erst in «Einstellungen», als dritte Karte «Sicherung». Dort hat mich das Wort «verloren» im Kartentext abgeholt: «… etwa wenn Sie das Notfallblatt verloren haben». Das Wort «Wiederherstellungscode» hätte ich nie gesucht. «Sicherung» ist ein Wort, das ich kenne.
- Die Einleitung der «Einstellungen» («Absender für Abrechnungen und Mahnungen, Vorschläge … und die Stammdaten») erwähnt die Sicherung nicht. Wer nur den Anfang liest, sucht hier nicht weiter.
- Auf dem Desktop bricht der Linktext der Karte als «Neuer Wiederherstellungs» / «code» um, ohne Trennstrich (schmale Karte, Screenshot `06-card-clip.png`). Auf dem Handy passt das Wort auf eine Zeile. Die Überschrift der Seite trennt auf dem Handy richtig mit Trennstrich.
- Gut: Das falsche Passwort meldet die Seite klar oben im Kasten. Ein falsch abgetippter Code wird abgelehnt mit «Der Code stimmt nicht mit dem angezeigten überein …». Der Code in Kleinbuchstaben mit Leerzeichen statt Bindestrichen wird angenommen, wie es der Hilfetext verspricht.
- Gut: Der Hinweis «innerhalb von 30 Minuten … sonst verfällt er und der bisherige Code gilt weiter» und «zeigt Dwello ihn nicht mehr an» steht vor dem Download-Knopf. Ich habe deshalb zuerst heruntergeladen und dann bestätigt. Lädt man die Seite vor dem Bestätigen neu, zeigt sie den Code weiter an.
- Das Notfallblatt ist auf eine A4-Seite gut lesbar, mit grossem Code oben. Für mich unverständlich sind der Ordner «backups» auf dem Server und der GitHub-Link zur Installationsanleitung. Den Satz «Geben Sie dieses Blatt der Person, die Dwello betreut» verstehe ich, aber wer das bei mir ist, weiss ich nach Monaten auch nicht mehr; die App sagt es mir nirgends. Der Satz «geben Sie im Notfall beide Blätter weiter» geht ins Leere, wenn das alte Blatt verloren ist.
- Das Blatt enthält «Ihre Dwello-Installation: http://localhost:3300». Das ist die Adresse der Testumgebung, kein Befund.
- Handy 390 × 844: Seite im Zustand «Code erstellt» ohne seitliches Scrollen (Breite 390), Code bricht nach dem dritten Block um, Knöpfe gross genug. Die Karte in «Einstellungen» ist gut lesbar.
- Die Erfolgsmeldung «Der neue Wiederherstellungscode gilt ab jetzt. Dwello erstellt gleich eine erste Sicherung mit ihm …» ist klar und beruhigend.

## Aufgabe geschafft: teilweise

Den neuen Code habe ich vollständig erstellt, das Blatt heruntergeladen und gelesen und den Code bestätigt. Ob der Verlust des alten Blatts schlimm ist, weiss ich nach der Seite aber nur ungefähr (P-1).

## Aufwand

Etwa 15 Minuten, 14 Schritte: Anmelden, Übersicht, Benutzermenü, Hilfe, Einstellungen, Karte, leeres Passwort, falsches Passwort, richtiges Passwort, Download, PDF lesen, falscher Code, richtiger Code, Kontrolle in Einstellungen und Protokoll. Davon 3 Schritte nur für die Suche nach dem Ort.

## Ablauf

1. Übersicht und Hilfe. Erwartet: irgendwo ein Hinweis auf Sicherung oder auf das Blatt mit dem Code. Gesehen: nichts. Weder die Übersicht noch die Hilfe erwähnen Sicherung, Code oder Notfallblatt.
2. Seite «Neuer Wiederherstellungscode» geöffnet. Erwartet: zuerst eine Erklärung, wozu der Code dient und ob der Verlust schlimm ist. Gesehen: zuerst ein Absatz über «Sicherungen von vorher», der mich auffordert, das alte Blatt aufzubewahren, das ich ja nicht mehr habe (P-1).
3. Ohne Passwort auf «Neuen Code erstellen» geklickt. Erwartet: «Geben Sie Ihr Passwort ein». Gesehen: «Das Passwort stimmt nicht.» (P-4).
4. PDF gelesen. Erwartet: ein Datum, ab wann das Blatt gilt. Gesehen: nur das Erstellungsdatum, und der Hinweis, es gelte ab dem Tag der Bestätigung (P-3).
5. Code bestätigt. Erwartet: ein klarer Abschluss. Gesehen: grüne Meldung, darunter erneut das Formular «Neuen Code erstellen» (P-2).
6. Im Protokoll nachgesehen. Erwartet: ein Eintrag zum neuen Code. Gesehen: nur Anmeldungen und «KI gewählt» (P-3).
7. Nach dem Bestätigen den Download-Link nochmals aufgerufen (wie aus einem zweiten Tab). Erwartet: eine Erklärung, dass das Blatt nicht mehr zu haben ist. Gesehen: stilles Weiterleiten zur Übersicht (P-5).

## Vorschläge

- **P-1:** Anmelden, «Einstellungen», Karte «Neuer Wiederherstellungscode». Die Seite sagt nicht, wozu der Code dient und was der Verlust bedeutet. Hilfreich wäre ein erster Satz in der Art «Mit dem Code auf dem Notfallblatt lassen sich Ihre Daten aus einer Sicherung zurückholen, wenn der Server ausfällt. Haben Sie das Blatt verloren, erstellen Sie hier einen neuen Code: Neue Sicherungen öffnet dann nur das neue Blatt.» Danach getrennt ein Satz für den Fall, dass das alte Blatt fehlt: dass die älteren Sicherungen damit nicht mehr zu öffnen sind und nach höchstens 12 Monaten gelöscht werden. Die Aufforderung, das alte Blatt aufzubewahren, sollte nur gelten, wenn man es noch hat. Der Kartentext in «Einstellungen» könnte ebenfalls kurz den Zweck nennen.
- **P-2:** Code erstellen und bestätigen. Danach steht wieder «Neuen Code erstellen» da. Hilfreich: Im Zustand «bestätigt» das Formular ausblenden oder einklappen und stattdessen «Zurück zu den Einstellungen» anbieten.
- **P-3:** Notfallblatt herunterladen, dann bestätigen, dann «Protokoll» öffnen. Hilfreich: Erstellen und Bestätigen des Codes im Protokoll eintragen, oder das Blatt als «gilt ab dem Tag der Bestätigung, voraussichtlich [Datum]» mit einem Feld zum Eintragen von Hand gestalten.
- **P-4:** Auf «Neuer Wiederherstellungscode» ohne Eingabe auf «Neuen Code erstellen» klicken. Hilfreich: eine eigene Meldung für das leere Feld («Geben Sie Ihr Passwort ein.»).
- **P-5:** Code erstellen, die Seite in zwei Tabs offen haben, in einem bestätigen, im anderen «Notfallblatt herunterladen (PDF)» klicken. Man landet ohne Erklärung auf der Übersicht. Hilfreich: zurück auf «Neuer Wiederherstellungscode» mit einer Meldung, dass der Code schon bestätigt ist und das Blatt nicht mehr heruntergeladen werden kann (bei Verlust: erneut einen neuen Code erstellen).

## Nicht geprüft

- Das Verfallen des Codes nach 30 Minuten. Ich habe nicht 30 Minuten gewartet, und ohne Eingriff in die Uhr des Servers lässt sich das nicht erreichen.
- Den Zustand «Code erstellt» habe ich nur einmal erreicht und auf dem Handy nur angesehen, nicht dort bestätigt. Einen zweiten Code wollte ich nicht erstellen, um die Sicherung nicht unnötig mehrfach umzustellen.
- Fehlerzustände des Servers (z. B. ein fehlschlagender Download) habe ich nicht simuliert; sie gehörten nicht zur Aufgabe.
- Dunkelmodus und andere Sprachen habe ich nicht geprüft.

## Triage (caller)

- P-1 (Major): fixed. The page now starts with what the code is for and says what a lost sheet means (`backup_new_intro`, scenario line seen red; #957). Its wording goes to the fach-reviewer (718c-fachreview-4).
- P-2: #956. P-3, P-4, P-5 (Minor): stay.
