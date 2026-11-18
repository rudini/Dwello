# Marco: Update am Handy, Sicherung vor dem Update schlägt fehl (#1457)

Persona: Marco, 38, Handy 390 × 844, Touch. Frische Installation auf http://localhost:3310 (Version 1.4.0), abgemeldet gestartet, Einrichtungscode PERS-FRSH.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0707e57c-adc4-51b7-b1c3-3e077895d5a1/scratchpad/marco-1457/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Fenster «Das Update hat nicht geklappt» (390 px) | Die Meldung ist ein einziger Absatz mit fünf Sätzen (rund 60 Wörter, 10 Zeilen am Handy). Das Wichtigste für mich, «Es hat sich nichts geändert» und «was tun», steht mitten im Block. Der Titel sagt nur «nicht geklappt», nicht dass die Sicherung das Problem war. Ich habe es verstanden, aber erst beim zweiten Lesen. |
| P-2 | Minor | Fenster «Das Update hat nicht geklappt» | «Melden Sie sich bei der Person, die Dwello betreut» hilft mir nicht: Ich habe Dwello eben selbst eingerichtet, die betreuende Person bin ich. Anders als die Seite «Sicherung einrichten» («Betreuen Sie Dwello selbst … Installationsanleitung») gibt die Meldung keinen Weg für diesen Fall. Auch «Sobald Dwello wieder eine Sicherung erstellen kann» lässt offen, woran ich das erkenne. |
| P-3 | Minor | Fenster «Dwello wird auf Version 1.5.0 aktualisiert», Schritt 3 | Bei «Neu starten (läuft)» ist der Fortschrittsbalken schon ganz voll. Am Handy sieht das nach «fertig» aus, obwohl der Neustart noch läuft. Ich könnte das Fenster für hängengeblieben halten und die Seite neu laden. |

## Beobachtungen

- Die Bestätigung «Dwello jetzt aktualisieren?» nennt die Schritte in der richtigen Reihenfolge: «sichert Ihre Daten, lädt Version 1.5.0 herunter und startet neu». Dass man Dwello in dieser Zeit nicht nutzen kann und ungespeicherte Eingaben verloren gehen, steht auch drin. Am Handy erscheint sie als Karte im unteren Teil, beide Knöpfe sind 310 × 48 px gross, «Jetzt aktualisieren» steht oben, «Abbrechen» darunter. Nichts scrollt seitwärts (scrollWidth 390).
- Das Fenster mit den Schritten füllt den ganzen Bildschirm. Die Liste zeigt «Sichern / Herunterladen / Neu starten» mit «(läuft)», «(folgt)», «(erledigt)», also in Worten und nicht nur über die Farbe. Der aktuelle Schritt ist fett. Während der 3 Sekunden bis zum Fehler stand «Sichern (läuft)», Schritt 1 von 3. Gut verständlich.
- Im Fehlerfall verschwindet die Schrittliste und es kommt die Meldung mit «Schliessen» (136 × 48 px). Sie passt ohne Scrollen auf den Bildschirm. Danach bin ich auf derselben Seite wie vorher (Übersicht, beim zweiten Versuch «Gebäude»). Der Hinweis auf 1.5.0 steht weiterhin oben, und mit «Aktualisieren» kann ich es sofort erneut versuchen. Nach dem Schliessen liegt der Fokus wieder auf einem Knopf, nicht irgendwo im Leeren.
- Nach dem Schliessen erinnert nichts mehr daran, dass der letzte Versuch gescheitert ist. Der Hinweis sagt wieder «Ihre Daten bleiben erhalten» und bietet «Aktualisieren» an, als wäre nichts gewesen. Wer die Meldung schnell wegtippt, versucht es vielleicht einfach immer wieder.
- Ohne simulierten Fehler war «Sichern» schon nach weniger als 0,5 s erledigt, danach je etwa 2 s «Herunterladen» und «Neu starten». Dann verschwand das Fenster und die Seite war wieder da, mit derselben Version und dem Hinweis (Stand-in, wie angekündigt).
- Ausserhalb der Änderung: Bevor die Sicherung eingerichtet ist, hat der Hinweis einen anderen Text («Richten Sie zuerst die Sicherung ein» statt «Aktualisieren»). Das war klar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 20 Schritte: Einrichten 6, Sicherung einrichten 2, Update mit Fehler 4, Schliessen und zweiter Versuch 4, Zuschauen 1.

## Ablauf

- Fehlermeldung lesen. Erwartet: kurz, oben «nichts kaputt», dann was ich tun soll. Gesehen: ein langer Absatz, «Es hat sich nichts geändert» im zweiten Satz, die Handlung («Melden Sie sich bei der Person, die Dwello betreut») gegen Ende, ohne Hinweis für den Fall, dass ich das selbst bin (P-1, P-2).
- Schritt «Neu starten». Erwartet: ein Balken, der erst am Ende voll ist. Gesehen: voller Balken, während «Neu starten (läuft)» noch dasteht (P-3).

## Vorschläge

- **P-1:** Einrichten, Sicherung bestätigen, am Handy auf «Aktualisieren» und «Jetzt aktualisieren» tippen, `POST /api/update` mit 409 `UPDATE_BACKUP_FAILED` beantworten. Hilfreich wäre ein Titel, der die Ursache nennt (etwa «Die Sicherung vor dem Update hat nicht geklappt»). Darunter zwei kurze Absätze: zuerst «Es hat sich nichts geändert; Dwello läuft weiter in Version 1.4.0», dann getrennt, was zu tun ist.
- **P-2:** Gleiche Schritte wie P-1. Den Satz zur betreuenden Person so ergänzen wie auf der Seite «Sicherung einrichten»: «Betreuen Sie Dwello selbst, …» mit Link zur Installationsanleitung bzw. zum Abschnitt über das Server-Protokoll. Beim erneuten Versuch sagen, woran man erkennt, dass die Sicherung wieder geht, etwa an der Seite «Sicherung» oder einfach «Versuchen Sie es danach erneut mit «Aktualisieren»».
- **P-3:** Update ohne Fehler starten und bei «Schritt 3 von 3: Neu starten» hinschauen. Den Balken bei laufendem Schritt 3 nicht ganz füllen, etwa auf zwei Drittel plus ein Stück, oder erst beim Neuladen voll anzeigen.

## Nicht geprüft

- Wie es aussieht, wenn das Herunterladen oder der Neustart scheitert: Die Aufgabe nannte nur den Fehler bei der Sicherung, andere Fehler habe ich nicht simuliert.
- Querformat und grössere Schrift am Handy: nicht Teil des Profils.
- Ein echtes Update mit neuer Version: Der Update-Dienst ist ein Stand-in, die Version bleibt 1.4.0.
