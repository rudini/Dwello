# Marco – Rechnungen hochladen auf dem Handy, Runde 2

Persona: Marco, 38, angestellt, fast alles auf dem Handy, wenig Zeit. Viewport 390 × 844, Touch.
App: Persona-Stack auf http://localhost:3300 (frische Demodaten), Version 0.4.14+12-gbe436c1d.
Gespeichert habe ich nur im Gebäude «Seepark Residenz», und nur eine Rechnung (Werke).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/marco-rechnungen-hochladen-2/`
Runde 1: `docs/design/personas/marco-rechnungen-hochladen.md`

Aufgabe: «Werke Schlussrechnung 2025.pdf» und «Lift Service und Reparatur.pdf» für «Seepark Residenz» hochladen, die Hinweise lesen, nur die Werke-Rechnung erstellen, prüfen, ob sie erstellt wurde, den Rest abbrechen, die Rechnung öffnen und «Beleg anzeigen» tippen.
Bewertet werden nur die Punkte aus Runde 1, die die Änderung beantwortet: P-1, P-2, P-3, P-4, P-5, P-7, P-9 und P-10.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit (Runde 1: Major, behoben) | Dialog, nach «1 Rechnung erstellen» | Gelöst: Die erstellte Datei verschwindet aus der Liste. Der Dialog springt nach oben, und der grüne Kasten «1 Rechnung erstellt» mit dem Link «Werke Schlussrechnung 2025» ist sichtbar und hat den Fokus. Rest: Weiter unten steht unter der Lift-Datei noch «Wählen Sie mindestens eine Rechnung zum Erstellen.» mit dem grauen Knopf «0 Rechnungen erstellen». Das stört nicht mehr, weil ich zuerst die Erfolgsmeldung sehe. |
| P-2 | behoben | Dialog, Hinweis bei Werke | Jetzt steht dort: «Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.» Damit weiss ich, dass ich den vorgeschlagenen Betrag stehen lassen kann und keine Akonto-Rechnungen erfassen soll. |
| P-3 | behoben | Dialog, Hinweis bei Lift | «Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen.» Jetzt weiss ich, wie ich vorgehe. Die Lift-Datei ist zudem nicht mehr vorab angehakt. So erstellt man sie nicht aus Versehen ganz. |
| P-4 | behoben | Dialog, Erstellen ohne Kategorie | Der Dialog springt zum Feld «Kategorie». Das Feld ist rot umrandet und hat den Fokus, darunter steht «Wählen Sie eine Kategorie.». Ich musste nichts suchen. |
| P-5 | behoben | Rechnungsseite, «Beleg anzeigen» | Der Link öffnet einen neuen Tab (vorgelesen als «Beleg anzeigen (öffnet in neuem Tab)»), und der Server sendet das PDF jetzt als `inline`. Das Symbol ist jetzt ein Dokument statt eines Download-Pfeils. |
| P-7 | behoben | Dialog, jede Datei | Die Markierung heisst weiterhin «Bitte prüfen». Der Kasten heisst jetzt «Zu dieser Datei». Es gibt nichts mehr doppelt. |
| P-9 | Nit (teilweise) | Dialog und Rechnungsseite, Beleg | Im Dialog steht jetzt «Dwello speichert jede Datei als Beleg zu ihrer Rechnung. Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Auf der Rechnungsseite ist der doppelte Kasten «Beleg» weg. Dort steht nur noch «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» direkt unter «Beleg anzeigen». Ob «Originalrechnung» das Papier meint oder die gespeicherte Datei schon genügt, sagt mir keiner der beiden Sätze. |
| P-10 | Nit (teilweise) | Dialog, «Angaben prüfen» | Die Vorschau ist kleiner (310 × 384 px statt rund 440 px hoch), zeigt bei meiner Datei aber immer noch fast nur Weiss mit dem Wort «Rechnung». Antippen zum Vergrössern geht nicht (es ist nur ein Bild, kein Link und kein Knopf). Ich wische immer noch fast eine Bildschirmhöhe an Leerfläche vorbei. |

## Beobachtungen

- Die Werte stammen vom Stand-in, wie in Runde 1: Rechnungssteller ist der Dateiname, Beschreibung «Allgemeinstrom Q1», Betrag 1’250.00, Datum 31.03.2026 mit Zeitraum 01.01. bis 31.03.2026, obwohl die Datei «Schlussrechnung 2025» heisst. Ob CHF 1’250.00 wirklich das «Total vor dem Abzug» ist, kann ich in der leeren Vorschau nicht prüfen.
- In der Liste steht die neue Rechnung wieder als «Manuell», obwohl die KI sie ausgelesen hat.
- Beim Hilfetext zu «Umlagefähig» steht bei Werke «Die Rechnung fliesst in die Nebenkostenabrechnung ein.». Das ist hier richtig. Den Fall «Reparaturen» (Runde 1, P-6) habe ich nicht erneut geprüft.
- Lade ich dieselben Dateien noch einmal hoch, zeigt die Werke-Datei «Diese Rechnung ist schon erfasst.» mit «Erfasste Rechnung ansehen». Darunter steht aber weiter der Akonto-Hinweis. Für eine schon erfasste Datei ist er überflüssig.
- Das Dateifeld zeigt weiterhin «Choose Files / No file chosen» und «Dateien hierher ziehen oder auswählen» (Runde 1, P-8, nicht Teil dieser Änderung). Auch der Beleg-Ersatz auf der Rechnungsseite zeigt «Choose File / No file chosen», auf Englisch.
- Das gesperrte Feld «Gebäude» schneidet den Text ab: «Seepark Residenz – Seeweg 15, 6».
- Unter jedem Datumsfeld stehen im Bedienungshilfen-Baum weiterhin leere Absätze.

## Aufgabe geschafft: ja

Die Werke-Rechnung ist als «Allgemeinstrom», umlagefähig, CHF 1’250.00 in Seepark Residenz erstellt. Ich habe gesehen, dass sie erstellt wurde: im Dialog oben und danach in der Liste. Den Rest (Lift) habe ich abgebrochen. «Beleg anzeigen» öffnet einen neuen Tab mit dem PDF (inline).

## Aufwand

Etwa 3 Minuten Benutzerzeit, rund 15 Tipps und Wischer: Rechnungen → «Rechnungen hochladen» → Gebäude → Dateien → Hinweise lesen → «Angaben prüfen» → ein Fehlversuch ohne Kategorie → Kategorie → «1 Rechnung erstellen» → Abbrechen → Liste filtern → Rechnung → «Beleg anzeigen». Weniger als in Runde 1 (6 Minuten, rund 30 Schritte), weil kein zweiter Durchgang nötig war.

## Ablauf

1. **Rechnungen → «Rechnungen hochladen».** Erwartet: Dialog wie in Runde 1. Gesehen (`02-dialog.png`): gleicher Aufbau. Der Beleg-Satz lautet jetzt «Dwello speichert jede Datei als Beleg zu ihrer Rechnung. Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» (P-9).
2. **Gebäude «Seepark Residenz», beide Dateien gewählt.** Erwartet: beide gelesen. Gesehen (`s2-02-read.png`): «2 von 2 Dateien gelesen», Gebäude gesperrt mit Hinweis «Das Gebäude gilt für alle Dateien …».
3. **Hinweis Werke lesen.** Erwartet nach Runde 1: was ich mit dem Betrag tun soll. Gesehen (`10-werke-hint.png`): Markierung «Bitte prüfen», gelber Kasten «Zu dieser Datei»: Akonto-Abzug CHF 1’000.00, «Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen …», dazu «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.». Angehakt. Jetzt klar (P-2, P-7).
4. **Hinweis Lift lesen.** Erwartet: wie ich aufteile. Gesehen (`11-lift-hint.png`): «Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen.». Die Datei ist nicht angehakt, der Knopf heisst «1 Rechnung erstellen». Gut (P-3). Lift lasse ich so, wie die Aufgabe sagt.
5. **«Angaben prüfen» bei Werke.** Gesehen (`12-werke-angaben.png`): Die Vorschau ist etwas kleiner, aber immer noch fast leer und lässt sich nicht antippen (P-10). Darunter folgen die Felder, Betrag 1250.00. Ich lasse den Betrag stehen, wie der Hinweis sagt.
6. **«1 Rechnung erstellen» ohne Kategorie.** Erwartet: dass ich sehe, was fehlt. Gesehen (`14-no-category.png`): Der Dialog steht beim Feld «Kategorie», rot umrandet, mit Fokus und «Wählen Sie eine Kategorie.». Nichts gespeichert. Sehr gut (P-4).
7. **Kategorie «Allgemeinstrom», «1 Rechnung erstellen».** Erwartet: klar sichtbar «erstellt». Gesehen (`16-after-create.png`): Der Dialog bleibt offen, ist aber nach oben gesprungen. Der grüne Kasten «1 Rechnung erstellt» mit Link «Werke Schlussrechnung 2025» steht im Bild und hat den Fokus. In der Liste ist nur noch die Lift-Datei («1 von 1 Dateien gelesen»). Weiter unten steht noch «Wählen Sie mindestens eine Rechnung zum Erstellen.» (P-1, Rest). Ich wusste sofort, dass es geklappt hat.
8. **Rest abbrechen.** Mein Skript hat das Abbrechen nach dem Erstellen nicht ausgelöst (Bedienfehler meinerseits), und der Dialog war beim Schliessen des Browsers weg. Deshalb habe ich die beiden Dateien noch einmal hochgeladen (`20-reupload.png`): Werke zeigt «Diese Rechnung ist schon erfasst.» mit Link und ist nicht angehakt, Lift ist nicht angehakt. «Abbrechen» → Rückfrage «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Abbrechen und verwerfen» / «Weiter prüfen» (`21-cancel-confirm.png`). «Abbrechen und verwerfen» → Dialog zu, nichts weiter gespeichert.
9. **Liste nach Seepark Residenz und «Werke» gefiltert.** Gesehen (`23-list.png`): «1 Rechnung»: Werke Schlussrechnung 2025, Allgemeinstrom Q1, 31.03.2026, CHF 1’250.00, «Umlagefähig», «Manuell».
10. **Rechnung geöffnet, Abschnitt «Beleg».** Gesehen (`25-beleg-section.png`): Überschrift «Beleg», Dateiname, Knopf «Beleg anzeigen» mit Dokument-Symbol, darunter «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.», dann «Datei des Belegs» und «Beleg ersetzen». Kein doppelter Kasten mehr (P-9).
11. **«Beleg anzeigen».** Erwartet: das PDF sehen. Gesehen: Es öffnet sich ein neuer Tab. Die Antwort ist `application/pdf` mit `Content-Disposition: inline`. Headless-Chromium hat keine PDF-Ansicht und lädt die Datei deshalb im neuen Tab herunter. Ein Handy-Browser würde sie anzeigen (P-5).

## Verwirrung

- «Bewahren Sie die Originalrechnung auf»: Auf der Rechnungsseite fehlt der Satz «Dwello speichert jede Datei als Beleg», den der Dialog hat. Ob ich das Papier zusätzlich behalten muss, bleibt offen (P-9).
- «Vorgeschlagen ist das Total der Leistungen vor dem Abzug»: Ist klar. Prüfen kann ich es aber nur, wenn die Vorschau etwas zeigt (P-10).
- «Wählen Sie mindestens eine Rechnung zum Erstellen.» nach dem Erstellen: Ich sehe es jetzt erst nach der Erfolgsmeldung, deshalb nur ein kleiner Stolperstein (P-1).

## Fehlerrisiken

- P-9: Wer den Satz auf der Rechnungsseite so liest, dass die Datei in Dwello reicht, wirft vielleicht das Papier weg. Wer ihn umgekehrt liest, hebt alles doppelt auf. Beides ist harmlos, solange die gesetzliche Pflicht nicht mehr verlangt. Das kann ich nicht beurteilen.
- P-10: Ohne lesbare Vorschau übernehme ich die KI-Werte ungeprüft, auch den Betrag «vor dem Abzug».
- Die Risiken aus Runde 1 zu P-1, P-2 und P-3 sehe ich nicht mehr.

## Vorschläge

- **P-1** Reproduktion: Seepark → beide Dateien → Werke Kategorie «Allgemeinstrom» → «1 Rechnung erstellen». Was helfen würde: Den Satz «Wählen Sie mindestens eine Rechnung zum Erstellen.» nach einem Erstellen ausblenden, solange ich nichts Neues angehakt habe, oder einen Knopf «Fertig» statt «Abbrechen» zeigen.
- **P-2** Kein Handlungsbedarf.
- **P-3** Kein Handlungsbedarf.
- **P-4** Kein Handlungsbedarf.
- **P-5** Kein Handlungsbedarf. Auf einem echten Handy prüfen, ob das PDF angezeigt wird (siehe «Nicht geprüft»).
- **P-7** Kein Handlungsbedarf.
- **P-9** Reproduktion: erstellte Rechnung öffnen, Abschnitt «Beleg». Was helfen würde: auch dort «Dwello speichert die Datei als Beleg.» voranstellen und sagen, ob das Papier-Original zusätzlich nötig ist, zum Beispiel «Bewahren Sie die Papierrechnung trotzdem auf …».
- **P-10** Reproduktion: «Angaben prüfen» bei «Werke Schlussrechnung 2025.pdf». Was helfen würde: auf dem Handy eine kleine Vorschau (Vorschaubild), die man zum Vergrössern antippt, zum Beispiel öffnet sie den Beleg in einem neuen Tab.

## Nicht geprüft

- Die Rückfrage von «Abbrechen» genau im Zustand nach einem Teil-Erstellen: Mein Skript hat den Schritt nicht ausgelöst. Für einen zweiten Versuch hätte ich eine weitere Rechnung erstellen müssen, und die Aufgabe erlaubt nur die Werke-Rechnung. Geprüft habe ich die Rückfrage in einem neuen Durchgang mit denselben Dateien. Ob dort «Hochgeladene Dateien und Ihre Eingaben gehen verloren» auch nach einem Teil-Erstellen steht, und ob man dann glaubt, die erstellte Rechnung sei verloren, bleibt offen.
- Wie das PDF auf einem echten iPhone oder Android aussieht: Headless-Chromium zeigt keine PDF-Ansicht. Geprüft habe ich, dass ein neuer Tab aufgeht und die Antwort `inline` ist.
- Das Erfassen des Lift-Rests mit «Rechnung erfassen»: Die Aufgabe sagt «nur die Werke-Rechnung».
- Den Fall «Reparaturen» beim Feld «Umlagefähig» (Runde 1, P-6), die Dateiauswahl (P-8), Querformat und dunkles Design: nicht Teil dieser Änderung.
