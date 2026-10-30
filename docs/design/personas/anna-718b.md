# Anna – Slice 718b: Warnung zur Sicherung in der Übersicht

Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück. Jemand hat Dwello vor Monaten für sie eingerichtet; sie betreut Dwello nicht selbst. Desktop 1440 × 900, Übersicht zusätzlich auf dem Handy (390 × 844). Angemeldet mit E-Mail und Passwort, ohne Persona-Kit-Cookie. Zustand laut Auftrag: Sicherung vor 40 Tagen eingerichtet, letzte erfolgreiche Sicherung vor 9 Tagen (20.10.2026), seither keine mehr.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Übersicht, Warnung Sicherung | «Melden Sie sich bei der Person, die Dwello betreut»: Ich weiss nach Monaten nicht mehr, wer das ist. Dwello nennt weder Namen noch Kontakt, und ich habe in der App keinen Ort gefunden, wo das steht. Ich weiss also, *dass* ich jemanden anrufen soll, aber nicht *wen*. |
| P-2 | Minor | Übersicht, Warnung Sicherung | «Ihre Daten sind nicht gesichert» klingt, als wäre alles weg oder nie gesichert worden. Tatsächlich fehlt nur, was ich seit dem 20.10. geändert habe. Was mir konkret passieren kann (z. B. «Was Sie seit dem 20.10. erfasst haben, geht verloren, wenn der Computer ausfällt») und ob ich trotzdem weiterarbeiten darf, steht nicht da. Direkt darunter lädt «Als Nächstes zu tun» mit «Gebäude erfassen» zum Erfassen ein; ich war unsicher, ob ich das jetzt tun soll. |
| P-3 | Minor | Übersicht, Link «Zur Installationsanleitung» | Der Link führt zu einer englischen GitHub-Seite für Techniker (Docker-Befehle). Dort habe ich nichts gefunden, das zu dieser Warnung passt: nur ein Abschnitt, wie man die Datenbank von Hand sichert, nichts dazu, was zu tun ist, wenn Dwello meldet, dass die automatische Sicherung nicht mehr läuft. Für mich ist die Seite richtig als «nicht für Sie» gekennzeichnet, aber auch meiner Betreuungsperson würde ich sie so nicht als Hilfe weitergeben können. |
| P-4 | Minor | Übersicht, Link «Zur Installationsanleitung» | Der Link öffnet die Anleitung im selben Tab; Dwello ist danach weg, ich musste zurück navigieren. Es gibt keinen Hinweis, dass ich Dwello verlasse und auf eine fremde Seite (GitHub) komme. |

## Beobachtungen

- Die Warnung ist nicht zu übersehen: roter Kasten mit Ausrufezeichen-Symbol ganz oben unter dem Titel, vor allem anderen, fett gesetzter Haupttext. Auf dem Handy ebenso zuoberst, ohne seitliches Scrollen (Seitenbreite 390 px). Ich habe sie als Erstes gelesen.
- Der zweite Satz «Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung» hat mir klar gemacht, dass der Link nicht für mich ist. Das fand ich gut.
- «seit 20.10.2026»: Ich musste selber rechnen, wie lange das her ist (9 Tage). «seit 9 Tagen» oder «letzte Sicherung am 20.10.2026» wäre für mich schneller zu verstehen gewesen. Unklar war auch, ob die Sicherung am 20.10. noch geklappt hat oder ob es ab dem 20.10. nicht mehr ging.
- Die Warnung steht nur in der Übersicht. Auf «Gebäude» z. B. erscheint sie nicht; wer direkt dorthin springt, sieht sie nicht. Unter «Einstellungen» und in der «Hilfe» habe ich nichts zur Sicherung gefunden.
- Die Datenbank dieser Installation ist leer (0 Gebäude, 0 Wohnungen). «Als Nächstes zu tun» schlägt «Erstes Gebäude erfassen» vor. Das ist für jemanden, der nach Monaten zurückkommt, merkwürdig, kommt aber wohl von der Testinstallation.
- Unter der Sicherungswarnung steht ein blauer Hinweis «Es ist «Keine KI» gewählt». Zwei Kästen hintereinander, aber sie sind gut zu unterscheiden (rot gegen blau, jeder mit eigenem Symbol und eigenem Text).
- Die GitHub-Seite kam im Testbrowser ohne Gestaltung an (ohne Stylesheets). Das liegt vermutlich an der Testumgebung und nicht an Dwello.
- Anmeldeseite: Der Hinweis «Passwort vergessen? …» steht zwischen der Beschriftung «Passwort» und dem Feld. Er hat mich nicht gestört.

## Aufgabe geschafft: teilweise

Dass meine Daten seit Tagen nicht gesichert werden, habe ich sofort gesehen, und auch, dass ich mich an jemanden wenden soll. Wen, wusste ich nicht (P-1). Wie schlimm das für mich ist, habe ich nur ungefähr verstanden (P-2). Der Link zur Anleitung hat mir nicht geholfen, und er wäre wohl auch für meine Betreuungsperson keine Hilfe zu dieser Warnung (P-3).

## Aufwand

Etwa 10 Minuten, 6 Schritte: anmelden, Übersicht auf dem Desktop lesen, Übersicht auf dem Handy, «Einstellungen» und «Hilfe» nach der Sicherung durchsuchen, Link zur Anleitung öffnen, Anleitung durchsuchen.

## Ablauf

- **Warnung lesen.** Erwartet: wer «die Person, die Dwello betreut» ist, oder wo ich das nachsehen kann. Gesehen: kein Name, kein Kontakt (P-1).
- **«Ihre Daten sind nicht gesichert».** Erwartet: was mir konkret droht und ob ich weiterarbeiten kann. Gesehen: ein pauschaler Satz, der nach Totalverlust klingt; darunter der Vorschlag «Gebäude erfassen» (P-2).
- **«Einstellungen» und «Hilfe».** Erwartet: irgendwo eine Angabe zur Sicherung (Stand, wer zuständig ist). Gesehen: nichts zur Sicherung.
- **Link «Zur Installationsanleitung».** Erwartet: eine Seite in Deutsch, die zur Warnung passt, vielleicht in einem neuen Tab. Gesehen: die englische GitHub-Seite «Installing Dwello» im selben Tab. Abschnitt 5 zeigt Docker-Befehle zur Sicherung von Hand. Was zu tun ist, wenn die automatische Sicherung ausfällt, steht dort nicht (P-3, P-4).

## Vorschläge

- **P-1:** Anmelden als anna@dwello.test → Übersicht → Warnung lesen. Hilfreich wäre ein Satz, wo ich meine Betreuungsperson finde, zum Beispiel ein in den Einstellungen hinterlegter Kontakt, der hier angezeigt wird. Oder wenigstens: «Das ist in der Regel die Person, die Dwello für Sie eingerichtet hat.»
- **P-2:** Gleicher Weg. Statt «Ihre Daten sind nicht gesichert» lieber konkret: «Was Sie seit dem 20.10.2026 erfasst oder geändert haben, ist nicht gesichert und kann bei einem Ausfall verloren gehen.» Dazu ein Satz, ob ich weiterarbeiten kann (z. B. «Sie können weiterarbeiten. Lassen Sie die Sicherung bald wieder einrichten.»).
- **P-3:** Gleicher Weg → «Zur Installationsanleitung». Der Link sollte direkt zu einem Abschnitt führen, der genau diesen Fall behandelt (Sicherung läuft nicht mehr: prüfen, wieder in Gang bringen). Ideal wäre eine deutsche Fassung oder wenigstens ein Hinweis «(englisch, für Technikerinnen und Techniker)».
- **P-4:** Gleicher Weg. Den Link in einem neuen Tab öffnen oder ihn als externen Link kennzeichnen («öffnet GitHub»).

## Nicht geprüft

- Ob die Anleitung zum geprüften Stand einen passenden Abschnitt hat: Der Link führt auf `main` bei GitHub. Gelesen habe ich nur, was dort jetzt steht, keine Dateien im Repository (Regel: keine Doku lesen). Kommt der Abschnitt mit dieser Änderung erst noch, gilt P-3 nur, solange er nicht auf `main` ist.
- Dunkelmodus und Zoom: nicht Teil von Annas Profil, nicht angeschaut.
- Wie die Warnung aussieht, wenn die Sicherung wieder läuft oder nie eingerichtet wurde: Dieser Zustand liess sich in diesem Lauf nicht herstellen. Gesehen habe ich nur den Zustand, den der Auftrag vorbereitet hat.
- Speichern: Der Auftrag nannte kein Gebäude, darum habe ich nichts gespeichert.

## Triage (caller)

- P-1 to P-4 (Minor): stay. P-3: the guide on `main` predates this change; the section «Sicherung» and «Wiederherstellung» of `docs/installation.md` comes with this pull request. P-1 (no name of the person who looks after Dwello) is the decided wording of #860.
