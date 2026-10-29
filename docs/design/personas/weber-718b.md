# Dr. Weber – Slice 718b: Sicherung einrichten, Notfallblatt, Datenschutzerklärung, Bestätigung

Frische Installation auf http://localhost:3310, Desktop 1440 × 900, Maus. Abgemeldet und ohne Persona-Kit-Cookie gestartet; eingerichtet mit `PERS-FRSH`, `weber@dwello.test`, lokale KI (Vorgabe). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/weber-718b/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Datenschutzerklärung (vor der Bestätigung) | «Sicherung einrichten» schickt mich mit «Was mit den Sicherungen geschieht, steht in der Datenschutzerklärung» dorthin. Vor der Bestätigung steht dort aber kein Wort über Sicherungen. Die beiden Absätze dazu (unter «Welche Daten Dwello speichert» und «Aufbewahrung») erscheinen erst, nachdem ich den Code bestätigt habe. Genau dann, wenn ich mich informieren soll, fehlt die Information. |
| P-2 | Minor | Datenschutzerklärung, «Aufbewahrung» | Der erste Satz lautet weiterhin «Ausser in der öffentlichen Demo löscht Dwello keine gespeicherten Daten von selbst». Zwei Absätze weiter steht «ältere [Sicherungen] löscht Dwello selbst», und gelöschte Daten bleiben bis zu 12 Monate in den Sicherungen. Das widerspricht sich im selben Abschnitt. |
| P-3 | Minor | Seite, Notfallblatt, Datenschutzerklärung | Zur Kopie auf ein anderes Gerät gibt es drei Fassungen. Die Seite sagt, die betreuende Person «muss … kopieren. Fragen Sie sie, ob sie das tut». Das Blatt sagt, sie «soll» die Kopie ablegen. Die Datenschutzerklärung sagt als Tatsache: «Der Betreiber kopiert sie auf ein anderes Gerät, etwa in einen Cloud-Speicher». Nur die Datenschutzerklärung nennt einen Cloud-Speicher und ein anderes Land. Ausserdem heisst dieselbe Rolle auf Seite und Blatt «Person, die Dwello betreut», in der Datenschutzerklärung «Betreiber». |
| P-4 | Minor | Sicherung einrichten | Der Einleitungssatz «Dwello sichert Ihre Daten jeden Tag verschlüsselt» steht in der Gegenwart. Der Knopf heisst aber «Sicherung starten», und die Übersicht meldet danach «ab jetzt». Vor der Bestätigung läuft also offenbar noch keine Sicherung; der Satz behauptet mehr, als zu diesem Zeitpunkt gilt. |
| P-5 | Minor | Notfallblatt (PDF) | Das Blatt sagt: «Er gilt für die Sicherungen ab dem Tag, an dem Sie ihn in Dwello bestätigt haben.» Diesen Tag kann es aber nicht enthalten: Herunterladen lässt es sich nur vor der Bestätigung, danach leitet `/backup/sheet` auf die Übersicht um. Für meine Ablage fehlt damit das Datum, ab dem der Code gilt. Auch die Übersicht nennt es nicht, und unter «Einstellungen» finde ich nichts zur Sicherung. |
| P-6 | Minor | Notfallblatt (PDF) | Das Blatt soll «bei Ihren Mietverträgen» liegen, sagt aber nirgends, dass es vertraulich ist. Wer das Blatt und eine Kopie der Sicherungen hat, kann alle Daten lesen, auch Ausweiskopien und Betreibungsauszüge der Mieter. Mietverträge gebe ich aber gelegentlich aus der Hand. Ebenso fehlen auf dem Blatt die Aufbewahrungsdauer (7 tägliche, 12 monatliche) und der Satz der Seite, dass ohne Code nichts wiederherstellbar ist. |
| P-7 | Minor | Sicherung einrichten | Ich kann den Code vom Bildschirm abtippen und bestätigen, ohne das Notfallblatt je heruntergeladen zu haben. Die Seite warnt nur, dass der Code danach nicht mehr angezeigt wird. Dass auch das Notfallblatt danach nicht mehr erhältlich ist, steht nirgends. |
| P-8 | Minor | Übersicht, Bestätigung | «Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.» Die Meldung ist nach dem Neuladen verschwunden. Wann die erste Sicherung läuft und wo ich später sehe, ob die Sicherungen laufen, sagt sie nicht, und an das Notfallblatt erinnert sie nicht. |

## Beobachtungen

- Wenn ich das Feld leer abschicke, kommt «Der Code stimmt nicht mit dem angezeigten überein». Passender wäre ein Hinweis, dass nichts eingegeben wurde.
- Bei einem falschen Zeichen kommt ein klarer roter Hinweis über dem Feld. Die Eingabe bleibt stehen, und der Code oben ist unverändert. Gut.
- Die Zusage «Bindestriche, Leerzeichen sowie Gross- und Kleinschreibung spielen keine Rolle» stimmt: `lhbd kjw7 7v2x tx3v h47l vlpw` in Kleinbuchstaben mit Leerzeichen wurde angenommen.
- Wenn ich die Seite neu lade oder zur Datenschutzerklärung und zurück gehe, bleibt der Code derselbe. Gut, sonst wäre das heruntergeladene Blatt wertlos.
- Bis zur Bestätigung leitet `/dashboard` auf «Sicherung einrichten» um. Die Seitennavigation ist trotzdem vollständig sichtbar, das wirkt, als könnte ich ausweichen.
- Der Link «Datenschutzerklärung» öffnet im selben Tab und springt an den Anfang, nicht zu den Absätzen über die Sicherung. Nach dem Lesen musste ich selbst zurück.
- Die Datenschutzerklärung trägt «Stand: 20. Oktober 2026». Ob sich dieser Stand mit den neuen Absätzen geändert hat, kann ich nicht erkennen.
- «Weitergabe an Dritte» endet mit «Ausser den hier … genannten Diensten erhält niemand Daten von Dwello». Der Cloud-Speicher aus dem Sicherungsabsatz ist dort nicht genannt. Er erhält zwar nur verschlüsselte Daten, aber immerhin Daten.
- Das Blatt verspricht den «Stand der letzten Sicherung». Nach der Seite gibt es auch ältere Stände (bis 12 Monate); das Blatt erwähnt sie nicht.
- Das Blatt ist sauber und einseitig, Format A4, und hat den Titel «Notfallblatt Dwello». Ein Feld für Name und Kontakt der betreuenden Person fehlt. Gerade die soll ich im Notfall erreichen.
- «Code erstellt am 29.10.2026» stimmt mit dem heutigen Tag überein. Die Adresse der Installation (http://localhost:3310) stimmt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, rund 25 Schritte: Einrichten, Seite lesen, Blatt herunterladen und lesen, Datenschutzerklärung lesen, leer und falsch bestätigen, richtig bestätigen, Übersicht, Einstellungen, Hilfe und noch einmal die Datenschutzerklärung.

## Ablauf

- **Datenschutzerklärung von «Sicherung einrichten» aus geöffnet.** Erwartet: Abschnitte darüber, was gesichert wird, wo, wie lange und wer es lesen kann. Gesehen: kein einziger Satz über Sicherungen. Der Abschnitt «Aufbewahrung» sagt sogar, Dwello lösche nichts von selbst.
- **Nach der Bestätigung die Datenschutzerklärung erneut geöffnet.** Erwartet: derselbe Text wie vorher. Gesehen: zwei neue Absätze über die Sicherung, auch abgemeldet sichtbar.
- **Notfallblatt gelesen.** Erwartet: das Datum, ab dem der Code gilt, weil das Blatt selbst davon spricht. Gesehen: nur das Erstellungsdatum.
- **Nach der Bestätigung das Notfallblatt noch einmal abgerufen.** Erwartet: eine Kopie oder ein Hinweis. Gesehen: stille Umleitung auf die Übersicht.
- **Übersicht neu geladen.** Erwartet: ein Hinweis, dass die Sicherung läuft. Gesehen: keine Spur mehr von der Sicherung, auch nicht unter «Einstellungen» oder in der Hilfe.

## Vorschläge

- **P-1:** So stelle ich es nach: Frische Installation einrichten. Auf «Sicherung einrichten» den Link «Datenschutzerklärung» wählen und nach «Sicherung» suchen: nichts. Dann den Code bestätigen und `/privacy` neu laden: Jetzt stehen die Absätze da. Hilfreich wäre, die Sicherungsabsätze immer zu zeigen, mindestens aber ab der Anzeige des Codes. Der Link sollte direkt zu ihnen springen.
- **P-2:** So stelle ich es nach: Nach der Bestätigung unter `/privacy` den Abschnitt «Aufbewahrung» lesen. Hilfreich wäre, den ersten Satz einzuschränken, etwa: «Ausser in der öffentlichen Demo und bei den Sicherungen (siehe unten) löscht Dwello …».
- **P-3:** So stelle ich es nach: Den Satz zur Kopie auf der Seite, auf dem Blatt und in der Datenschutzerklärung vergleichen. Hilfreich wären eine gemeinsame Aussage («soll kopieren, fragen Sie nach») und ein einziges Wort für die Rolle. Der Hinweis auf einen Cloud-Speicher oder ein anderes Land gehört auch auf die Seite.
- **P-4:** So stelle ich es nach: «Sicherung einrichten» vor der Bestätigung lesen. Hilfreich wäre etwa: «Sobald Sie den Code bestätigt haben, sichert Dwello Ihre Daten jeden Tag verschlüsselt.»
- **P-5:** So stelle ich es nach: Das Blatt herunterladen, bestätigen und danach `/backup/sheet` öffnen. Hilfreich wäre entweder ein Feld «Bestätigt am: ______» zum Eintragen von Hand oder die Möglichkeit, das Blatt nach der Bestätigung mit Datum, aber ohne Code, noch einmal abzurufen. Dazu ein Ort unter «Einstellungen», der den Stand der Sicherung zeigt (eingerichtet seit, letzte Sicherung).
- **P-6:** So stelle ich es nach: Den Text des PDF lesen. Hilfreich wäre ein Satz wie «Vertraulich: Wer dieses Blatt hat, kann Ihre Sicherungen lesen», dazu die Aufbewahrungsdauer und «Ohne diesen Code lässt sich nichts wiederherstellen».
- **P-7:** So stelle ich es nach: Auf «Sicherung einrichten» den Code abtippen, ohne das Blatt herunterzuladen, und «Sicherung starten» wählen. Hilfreich wäre der Hinweis «Danach können Sie auch das Notfallblatt nicht mehr herunterladen», bei Bedarf auch eine Rückfrage, wenn das Blatt nicht heruntergeladen wurde.
- **P-8:** So stelle ich es nach: Bestätigen, die Meldung lesen, die Übersicht neu laden. Hilfreich wäre ein Satz wie «Die erste Sicherung erstellt Dwello heute Nacht. Ob die Sicherungen laufen, sehen Sie unter «Einstellungen» › …».

## Nicht geprüft

- Ob tatsächlich eine Sicherung im Ordner «backups» entsteht, ob sie verschlüsselt ist und ob sie sich mit dem Code wiederherstellen lässt. Als Benutzerin habe ich keinen Zugang zum Server. Versucht habe ich nichts davon, das liegt ausserhalb meiner Rolle.
- Ob der Server den Code nach der Bestätigung wirklich nicht mehr kennt; nur dann stimmt «Lesen kann eine Sicherung nur, wer diesen Code kennt». Von aussen lässt sich das nicht prüfen. Sichtbar ist nur, dass der Code nicht mehr angezeigt wird und das Blatt nicht mehr erhältlich ist.
- Die Datenschutzerklärung vor der Bestätigung habe ich nur einmal gelesen; der vollständige Seitentext ist erfasst. Wiederholen konnte ich es nicht, denn die Einrichtung geht nur einmal, und :3300 gehört einer anderen Persona.
- Die Installationsanleitung auf GitHub habe ich nicht geöffnet: externer Link, nicht Teil der geänderten Seite.

## Triage (caller)

- P-1 (Major): fixed; the privacy statement names the Sicherung from the moment a folder for it is set, before the confirmation too (scenario line in «Von der Sicherung zur Datenschutzerklärung», seen red).
- P-7: fixed with fach review 718b-4 V-5 (the page says the sheet is gone too once the Sicherung starts).
- P-2 to P-6, P-8 (Minor): stay. P-2 and P-3 are wording of legal texts the fach-reviewer read in rounds 3 and 4 (the Betreiber/«Person, die Dwello betreut» split is the glossary decision of #860).
