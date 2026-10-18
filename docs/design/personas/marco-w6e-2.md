# Marco – Nachträgliche Rechnung 2024, zweite Prüfung nach dem Fix (w6e-2)

Persona: Marco, 38, auf dem Smartphone (390 × 844, Touch), wenig Zeit. Persona-App auf http://localhost:3300 mit frischen Demodaten. Gespeichert habe ich nur im Gebäude «Seepark Residenz»: eine Rechnung «Hauswart Muster AG», CHF 250.00, Kategorie Hauswart, Rechnungsdatum 20.12.2024, Beschreibung «Hauswartung Dezember 2024». Abrechnungen habe ich nur angeschaut. Ich habe nichts gelöscht, berichtigt oder zurückgesetzt.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fb7498aa-16d8-576c-b542-2cec6868dbbd/scratchpad/persona-marco2/`

Zu den Befunden aus `marco-w6e.md`:

- **P-1 (kein Link zu den Abrechnungen): gilt nicht mehr.** Im Hinweis steht jetzt der Link «Abrechnungen von Seepark Residenz ansehen». Er öffnet die Abrechnungsliste schon gefiltert auf Seepark Residenz und die Periode 01.01.2024 – 31.12.2024. Dort stehen genau meine drei Abrechnungen 2024, ohne Umweg über das Menü.
- **P-2 (der Text beginnt mit Entwürfen, obwohl 2024 keine hat): gilt noch, aber schwächer.** Der Text ist gleich aufgebaut und beginnt weiterhin mit «Löschen Sie die Entwürfe dieser Periode …». «Bezahlt» wird weiterhin nicht erwähnt. Neu ist, dass mich der Link auf eine Liste mit «0 Entwurf / 0 Versendet / 3 Bezahlt» bringt. Die Entwürfe 2025 sehe ich dort nicht mehr. Ausserdem steht auf der bezahlten Abrechnung ein Knopf «Abrechnung berichtigen», den der Text nennt. Die Gefahr, die falschen Abrechnungen zu löschen, ist damit viel kleiner. Verwirrend bleibt der Text trotzdem. Schwere neu: Minor (vorher Major).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | – (behoben) | Rechnung (Detail nach dem Speichern) | Der Link «Abrechnungen von Seepark Residenz ansehen» im Hinweis führt direkt zu den drei Abrechnungen 2024 von Seepark Residenz. Der Befund gilt nicht mehr. |
| P-2 | Minor | Rechnung (Detail nach dem Speichern) | Der Hinweis beginnt weiterhin mit «Löschen Sie die Entwürfe dieser Periode und erstellen Sie die Abrechnungen erneut», obwohl Seepark 2024 keine Entwürfe hat. Was für mich gilt, steht erst im zweiten Satz und spricht von «Versendete Abrechnungen». Meine drei sind «Bezahlt». Ob sie mitgemeint sind, sagt der Text nicht. Erst die gefilterte Liste («0 Entwurf», «3 Bezahlt») und der Knopf «Abrechnung berichtigen» auf der Abrechnung klären das. |

## Beobachtungen

- Der Linktext nennt das Gebäude, aber nicht das Jahr («Abrechnungen von Seepark Residenz ansehen»). Die Periode steht im Satz direkt darüber, und die Liste sagt oben «Sie sehen die Abrechnungen der Abrechnungsperiode 01.01.2024 – 31.12.2024». Das reicht mir.
- Die gefilterte Liste ist auf 390 px sauber: kein seitliches Scrollen, drei Karten mit Name, Nummer, Wohnung, Periode, Saldo und Status «Bezahlt». Mit «Alle Abrechnungen anzeigen» komme ich aus dem Filter wieder heraus. Das ist gut.
- In der Liste ist keine der drei Abrechnungen als «nicht aktuell» markiert. Erst in der einzelnen Abrechnung steht der gelbe Kasten «Rechnungen seit der Abrechnung geändert». Da der Link aber genau die betroffenen Abrechnungen zeigt, stört mich das wenig.
- Der grösste Knopf auf der gefilterten Liste ist «Abrechnungen erstellen». Kommt man aus dem Hinweis «… erstellen Sie die Abrechnungen erneut», liegt dieser Knopf nahe. Für bezahlte Abrechnungen ist er aber nicht der richtige Weg. Ich habe ihn nicht angetippt.
- Auf der Abrechnung steht «Zahlung zurücksetzen» weiterhin als zweiter Knopf oben, direkt über dem Warnkasten. «Abrechnung berichtigen» steht erst weit unten unter «Weitere Aktionen». Wer nach «berichtigen» sucht, muss lange scrollen und kommt vorher an «Zahlung zurücksetzen» vorbei.
- Die Brotkrümelnavigation «Nebenkostenabrechnungen» auf der Abrechnung führt zur ungefilterten Liste. Die Zurück-Taste des Browsers behält den Filter. Wer die Brotkrümelnavigation antippt, verliert die Auswahl 2024.
- Die Erfolgsmeldung «Rechnung von Hauswart Muster AG gespeichert» liegt nach dem Speichern immer noch über dem Hinweis. Auch nach etwa 7 Sekunden war sie noch da und verdeckte den Satz «Versendete Abrechnungen berichtigen Sie …», also genau den Satz, der für mich gilt (alter Befund P-3, hier nicht Teil der Aufgabe).
- Der Hinweis selbst ist neu formuliert: Statt «ausserhalb von Dwello» verweist er jetzt auf «Abrechnung berichtigen» auf der Abrechnung und sagt, dass Bezahltes angerechnet wird. Das finde ich klarer als beim letzten Mal.
- In der Abrechnung von Thomas Weber fehlen meine CHF 250.00 bei Hauswart erwartungsgemäss (Q1 bis Q4 je CHF 750.00). Der Kasten sagt weiterhin nur «1 Rechnung … erfasst, geändert oder gelöscht», ohne die Rechnung zu nennen (alter Befund P-5, hier nicht Teil der Aufgabe).

## Aufgabe geschafft: ja

Ich habe die Rechnung erfasst und gespeichert. Über den Link im Hinweis bin ich mit einem Tap bei den drei Abrechnungen 2024 von Seepark Residenz gelandet und habe eine davon geöffnet. Welche Abrechnungen betroffen sind, war klar. Welcher Teil des Textes für mich gilt, habe ich erst aus der Liste und der Abrechnung abgeleitet, nicht aus dem Hinweis selbst (P-2).

## Aufwand

- Etwa 3 Minuten für Marco, rund 12 Taps und Eingaben.
- Rechnung erfassen: 9 Schritte (Übersicht > «Rechnung erfassen», Gebäude, Datum, Betrag, Rechnungssteller, Beschreibung, Kategorie, «Rechnung speichern»).
- Den Abrechnungen nachgehen: 2 Taps (Link im Hinweis, Abrechnung Thomas Weber). Beim letzten Mal waren es 5 Schritte über das Menü.
- Ein Skriptfehler meinerseits (Gebäudeliste zu früh gelesen) hat einen ersten Versuch ohne Speichern abgebrochen. Es wurde nichts gespeichert, das Formular meldete «Bitte wählen Sie ein Gebäude».

## Ablauf

1. **Übersicht > «Rechnung erfassen».** Erwartet: das Formular. Gesehen: Formular «Neue Rechnung» wie beim letzten Mal. (01-dashboard.png)
2. **Ausfüllen.** Erwartet: problemlos. Gesehen: Seepark Residenz, 20.12.2024 (darunter «Freitag, 20. Dezember 2024»), CHF 250.00, Hauswart Muster AG, Kategorie Hauswart. (02-filled.png)
3. **«Rechnung speichern».** Erwartet: der gelbe Hinweis, diesmal mit einem Weg zu den Abrechnungen. Gesehen: Detailseite «Hauswart Muster AG». Der gelbe Kasten «Abrechnungen nicht aktuell» sagt: «Für die Abrechnungsperiode 01.01.2024 – 31.12.2024 gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon.» Direkt darunter steht als unterstrichener Link «Abrechnungen von Seepark Residenz ansehen». Der Link ist im ersten Bildschirm ohne Scrollen sichtbar. Danach folgt der Absatz «Löschen Sie die Entwürfe dieser Periode … Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung …». Die Erfolgsmeldung unten verdeckt ein paar Zeilen davon. (03-after-viewport.png, 03-after-full.png; nach etwa 7 Sekunden unverändert: 04-after-7s-viewport.png)
4. **Link antippen.** Erwartet: meine Abrechnungen 2024 von Seepark. Gesehen: Liste «Nebenkostenabrechnungen» mit dem Satz «Sie sehen die Abrechnungen der Abrechnungsperiode 01.01.2024 – 31.12.2024», Gebäude Seepark Residenz vorgewählt, Zähler «0 Entwurf, 0 Versendet, 3 Bezahlt, 0 Überfällig». Darunter die Karten Marco Bernasconi (Nachzahlung CHF 26.20), Sarah Meier (Nachzahlung CHF 121.05) und Thomas Weber (Rückerstattung CHF 70.25), alle «Bezahlt». (05-list-viewport.png, 05-list-full.png) Genau das hatte ich erwartet. Jetzt sehe ich auch: Der Satz mit den Entwürfen betrifft mich nicht.
5. **Abrechnung Thomas Weber öffnen.** Erwartet: ein Hinweis, dass sie veraltet ist, und ein Weg zum Berichtigen. Gesehen: Status «Bezahlt», darüber die Knöpfe «PDF herunterladen» und «Zahlung zurücksetzen», darunter der gelbe Kasten «Rechnungen seit der Abrechnung geändert». Er hat denselben Text zum Berichtigen wie auf der Rechnung, nur ohne den Satz zu den Entwürfen. Ganz unten unter «Weitere Aktionen» steht der Knopf «Abrechnung berichtigen». Angetippt habe ich ihn nicht. (06-statement-viewport.png, 06-statement-full.png)
6. **Zurück.** Die Zurück-Taste bringt mich zur gefilterten Liste 2024 zurück. Das ist gut.

## Verwirrung

- «Löschen Sie die Entwürfe dieser Periode»: Für Seepark 2024 gibt es keine. Der Satz steht trotzdem an erster Stelle.
- «Versendete Abrechnungen»: Meine sind «Bezahlt». Weil die Liste «Versendet» und «Bezahlt» als zwei getrennte Zähler zeigt, lese ich «Versendete» eher als nur den einen Status. Erst der Knopf «Abrechnung berichtigen» auf der bezahlten Abrechnung zeigt mir, dass es auch für «Bezahlt» gilt.
- «… mit einem früheren Stand davon»: Bei einer neuen Rechnung passt das nicht, ich habe nichts geändert.
- «Lassen Sie sich im Zweifel beraten»: Von wem, sagt der Text weiterhin nicht.

## Fehlerrisiken

- Wer nur den Hinweis auf der Rechnung liest und den Link nicht antippt, sucht womöglich weiterhin Entwürfe zum Löschen und findet die Entwürfe 2025 desselben Gebäudes über das Menü. Über den Link passiert das nicht mehr, dort steht «0 Entwurf».
- Auf der gefilterten Liste lockt «Abrechnungen erstellen» als Hauptknopf, passend zum Wort «erstellen» im Hinweis. Für bezahlte Abrechnungen ist das nicht der richtige Weg.
- «Zahlung zurücksetzen» steht auf der Abrechnung oben, «Abrechnung berichtigen» weit unten. Wer «korrigieren» will, findet den falschen Knopf zuerst.
- Die Erfolgsmeldung verdeckt beim schnellen Lesen gerade den Satz zum Berichtigen.

## Vorschläge

- **P-1:** Behoben. Übersicht > «Rechnung erfassen» > Seepark Residenz, 20.12.2024, CHF 250.00, Hauswart > «Rechnung speichern» > «Abrechnungen von Seepark Residenz ansehen» zeigt genau die drei Abrechnungen 2024. Optional könnte das Jahr in den Linktext («Abrechnungen 2024 von Seepark Residenz ansehen»).
- **P-2:** Gleiche Schritte bis zum Hinweis. Hilfreich wäre, nur den vorliegenden Fall zu nennen: Den Satz zu den Entwürfen nur zeigen, wenn es in der Periode Entwürfe gibt. Den Satz zum Berichtigen mit «Versendete oder bezahlte Abrechnungen …» beginnen. Noch besser wäre eine Zahl: «Für diese Periode gibt es 3 Abrechnungen, alle schon bezahlt.» Den Wortlaut zu Versendet und Bezahlt müsste fachlich jemand prüfen.

## Nicht geprüft

- «Abrechnung berichtigen» selbst: Ich sollte nichts berichtigen. Was dabei herauskommt (neuer Betrag pro Mieter, Anrechnung des Bezahlten), habe ich nicht gesehen.
- Der Fall mit Entwürfen in der Periode: Seepark 2024 hat keine, und ich sollte nichts löschen.
- Ob der Hinweis bei gemischten Fällen (Entwürfe und versendete Abrechnungen in derselben Periode) richtig gewichtet: Dafür gibt es in meinem Gebäude keine Daten.
- Ob die Erfolgsmeldung irgendwann von selbst verschwindet: Ich habe nur etwa 7 Sekunden gewartet.
- Die anderen beiden Abrechnungen (Meier, Bernasconi) im Detail, das PDF, Dunkelmodus und andere Sprachen.
