# Helga – Slice 718b: Dwello einrichten und Sicherung einrichten

Frische Installation auf http://localhost:3300, abgemeldet gestartet (ohne Persona-Kit-Cookie), Desktop 1440 × 900 bei 150 % Zoom, Maus. Einrichtungscode PERS-FRSH, Konto `helga@dwello.test`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Sicherung einrichten | Nirgends steht, dass Dwello den Wiederherstellungscode nach dem Bestätigen nicht mehr anzeigt. Ich kann den Code vom Bildschirm abtippen und bestätigen, ohne das Notfallblatt je herunterzuladen oder zu drucken. Danach öffnet `/backup` nur noch die Übersicht, und weder «Einstellungen» noch «Hilfe» erwähnen die Sicherung oder den Code. Wer sich auf «das sehe ich später nochmals nach» verlässt, hat den Code für immer verloren, und laut der Seite «lässt sich nach einem Defekt nichts wiederherstellen». |
| P-2 | Minor | Sicherung einrichten / Notfallblatt | Was ich tun soll, wenn ich das Notfallblatt verliere (kann ich einen neuen Code machen, und was ist dann mit den alten Sicherungen?), steht weder auf der Seite noch auf dem Blatt. |
| P-3 | Minor | Sicherung einrichten | Die Überschrift «Wiederherstellungscode erneut eingeben» hat mich kurz verunsichert: Ich hatte ihn noch gar nie eingegeben. «Abtippen» oder «zur Kontrolle eingeben» würde ich sofort verstehen. Auch der Knopf «Sicherung starten» passt für mich nicht ganz zu «Code bestätigen»: Ich dachte zuerst, jetzt laufe eine lange Sicherung los. |

## Beobachtungen

- Dwello führt nach «Dwello einrichten» direkt auf «Sicherung einrichten». Menüpunkte wie «Gebäude» und auch `/dashboard` führen zurück zur Sicherung, bis ich den Code bestätigt habe. Das ist gut, nur sagt mir die Seite nicht, warum das Menü «nicht geht».
- Beim Neuladen der Seite bleibt der Code gleich (zweimal geprüft), und auf dem Notfallblatt steht derselbe Code wie auf dem Bildschirm. Ein ausgedrucktes Blatt passt also, auch wenn ich die Seite zwischendurch neu lade.
- Die Fehlermeldung bei falschem Code (letzter Buchstabe vertauscht, QZHY statt QZHX) ist klar und rot umrandet, mit Symbol, über dem Feld, und meine Eingabe bleibt stehen, sodass ich sie korrigieren kann. Kleinschreibung mit Leerzeichen statt Bindestrichen wurde wie versprochen angenommen.
- Notfallblatt (A4, eine Seite, Titel «Notfallblatt Dwello»): Es zeigt den Code gross, das Erstelldatum 28.10.2026, die Adresse der Installation, wo die Sicherungen liegen, «Im Notfall: Geben Sie dieses Blatt der Person, die Dwello betreut … was Sie danach erfasst haben, fehlt» und einen Link zur Installationsanleitung. Ich wüsste damit, was zu tun ist: das Blatt meinem Neffen geben. Die Schrift ausser dem Code ist für mich aber klein (normale Briefschrift), und das Blatt ist zu zwei Dritteln leer.
- Auf dem Blatt steht «Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.» Beim Herunterladen hatte ich ihn noch nicht bestätigt; der Satz hat mich gefragt lassen, ob es frühere Sicherungen gibt, für die er nicht gilt.
- Auf dem Blatt steht nicht, zu welchem Konto (E-Mail-Adresse) es gehört. Als Adresse der Installation steht hier `http://localhost:3300`; damit könnte eine helfende Person an einem anderen Gerät nichts anfangen. In der Testumgebung ist das wohl so.
- Dass jemand mit dem Blatt und dem Ordner «backups» meine Daten lesen kann, steht nur indirekt da («Lesen kann eine Sicherung nur, wer diesen Wiederherstellungscode kennt»). Das Blatt sagt nur «an einem sicheren Ort».
- Die Seite verlangt, dass die betreuende Person den Ordner «backups» regelmässig auf ein anderes Gerät kopiert, und rät mir, sie zu fragen. Das habe ich verstanden. Ob sie das wirklich tut, kann Dwello mir aber nicht zeigen. Das ist ein zweiter Weg, auf dem ich meine Daten verlieren könnte, der nicht an mir liegt.
- Bestätigung in der Übersicht: grüner Kasten mit Häkchen «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» Er stand über dem Hinweis zur KI (40 %). Klar und beruhigend. Er bleibt auch nach dem Neuladen stehen (die Adresse endet auf `?backup=confirmed`); erst wenn ich die Übersicht neu öffne, ist er weg.
- In der ganzseitigen Aufnahme nach dem falschen Code liegt die Kopfleiste mitten über dem Bild; das kommt von der Aufnahme beim Scrollen, nicht von der Seite.
- Einrichtungsseite: Der Hinweis beim Einrichtungscode nennt den Befehl `docker logs dwello-backend`; den hätte ich nicht verstanden, aber ich hatte den Code ja bekommen.

## Aufgabe geschafft: ja

Konto angelegt, auf die Sicherung geführt, Notfallblatt heruntergeladen und gelesen, einmal falsch und dann richtig bestätigt, in der Übersicht angekommen. Die Prüfung der Sicherungsseite bei 200 % fehlt (siehe «Nicht geprüft»).

## Aufwand

Etwa 25 Minuten, 8 Skripte; die Einrichtung selbst brauchte 5 Felder und 1 Klick, die Sicherung 1 Download, 2 Bestätigungsversuche.

## Ablauf

- Nach der Bestätigung wollte ich nochmals auf «Sicherung einrichten», um auch bei 200 % zu schauen und den Code nachzusehen. Erwartet: die Seite oder eine Seite mit dem Stand der Sicherung. Gesehen: `/backup` führt direkt zur Übersicht (ohne die grüne Meldung); in «Einstellungen» (`/config`) und «Hilfe» kommt «Sicherung», «Wiederherstellungscode» oder «Notfallblatt» nicht vor.
- Knopf «Sicherung starten». Erwartet: es beginnt eine Sicherung, die dauert. Gesehen: sofort Weiterleitung zur Übersicht mit der Bestätigung; der Knopf bestätigt also nur den Code.
- Notfallblatt: Erwartet: grosse Schrift wie auf dem Bildschirm. Gesehen: nur der Code ist gross, der Rest in kleiner Schrift.

## Vorschläge

- **P-1:** Frisch einrichten, auf «Sicherung einrichten» den angezeigten Code ins Feld abtippen (ohne Notfallblatt), «Sicherung starten». Danach `/backup` öffnen sowie «Einstellungen» und «Hilfe» durchsuchen: der Code ist nirgends mehr zu sehen. Hilfreich: auf der Seite deutlich sagen «Dwello zeigt diesen Code nur jetzt. Drucken Sie das Notfallblatt aus, bevor Sie weitergehen.» Dazu entweder den Download vor dem Bestätigen verlangen (oder zumindest nachfragen, wenn er fehlt) oder in den Einstellungen eine Stelle anbieten, an der man einen neuen Code und ein neues Blatt erstellt.
- **P-2:** Seite und Notfallblatt lesen; kein Satz zum Verlust des Blattes. Hilfreich: ein Satz «Haben Sie das Blatt verloren? …» mit dem Weg, der dann gilt.
- **P-3:** Seite «Sicherung einrichten» öffnen. Hilfreich: Überschrift «Code zur Kontrolle abtippen» und Knopf «Code bestätigen» oder «Bestätigen und Sicherung einschalten».

## Nicht geprüft

- **Sicherungsseite bei 200 %:** Ich habe die Seite nur bei 150 % geprüft und den Code bestätigt, bevor ich auf 200 % schaute. Danach führt `/backup` nur noch zur Übersicht (versucht mit 200 %: Weiterleitung auf `/dashboard`, dort kein Querscrollen, Breite 720 = 720). Die Einrichtung geht nur einmal; eine zweite Instanz (:3310) gehörte nicht mir.
- Ob das Notfallblatt beim echten Ausdrucken gut lesbar ist: nur als Bild bei 60 dpi und als Text gelesen.
- Ob die Sicherung wirklich jeden Tag läuft und ob sich mit dem Code etwas wiederherstellen lässt: das kann ich als Benutzerin nicht sehen.

Skripte und Bilder: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-718b/` (01-start, 02-after-setup, 05-wrong, 06-overview, 07-overview-reload, pdf-1.png, dl/notfallblatt.pdf).

## Triage (caller)

- P-1 (Major): fixed. «Sicherung einrichten» says «Nach der Bestätigung zeigt Dwello den Code nicht mehr an.» (scenario line, seen red), in all four languages.
- P-2: a new code after a lost Notfallblatt is part 3 of #718. P-3: stays (wording reviewed by the fach-reviewer).
