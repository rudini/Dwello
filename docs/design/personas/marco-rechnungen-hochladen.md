# Marco – Rechnungen hochladen auf dem Handy

Persona: Marco, 38, angestellt, fast alles auf dem Handy, wenig Zeit. Viewport 390 × 844, Touch.
App: Persona-Stack auf http://localhost:3300 (Demodaten), Version 0.4.12+9-g3e3f99c.
Gespeichert habe ich nur im Gebäude «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/marco-rechnungen-hochladen/`

Aufgabe: Die beiden Dateien «Werke Schlussrechnung 2025.pdf» und «Lift Service und Reparatur.pdf» für «Seepark Residenz» hochladen, die Hinweise lesen, entscheiden und die gewünschten Rechnungen erstellen. Danach auf dem Handy den Beleg einer erstellten Rechnung ansehen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Dialog «Rechnungen hochladen», nach dem Erstellen | Ist danach noch eine Datei in der Liste (bei mir die abgewählte Lift-Rechnung), bleibt der Dialog offen und bleibt unten stehen. Die Erfolgsmeldung «1 Rechnung erstellt» erscheint ganz oben im Dialog, ausserhalb des sichtbaren Bereichs. Sichtbar sind nur der graue Knopf «0 Rechnungen erstellen» und «Wählen Sie mindestens eine Rechnung zum Erstellen.». Das sieht aus wie ein Fehler, und ich wusste nicht, ob gespeichert wurde. |
| P-2 | Major | Dialog, Hinweis bei «Werke Schlussrechnung 2025.pdf» | «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt.» sagt mir nicht, welchen Betrag ich eintragen soll: die ausgelesenen CHF 1’250.00 oder 1’250 + 1’000? Ob ich die Akonto-Rechnungen schon erfasst habe, weiss ich nicht. Der Dialog zeigt sie mir auch nicht. Ich habe geraten (1’250.00 gelassen). |
| P-3 | Minor | Dialog, Hinweis bei «Lift Service und Reparatur.pdf» | «Erfassen Sie diese als eigene Rechnung.» Im Dialog finde ich aber keinen Weg, eine Datei auf zwei Rechnungen aufzuteilen. Ich habe die ganze Rechnung als «Reparaturen» (nicht umlagefähig) erfasst. Damit fehlt der umlagefähige Lift-Service in der Abrechnung. |
| P-4 | Minor | Dialog, «2 Rechnungen erstellen» ohne Kategorie | Beide Dateien klappen auf, der Dialog wächst auf rund 7000 px Höhe, und ich lande mitten in der leeren Vorschau der ersten Datei. Der Fehler «Wählen Sie eine Kategorie.» steht knapp über dem sichtbaren Bereich (im Hinweis-Kasten) und weiter unten am Feld. Der Fokus bleibt auf dem Knopf «Erstellen» ganz unten. Ich musste hochwischen, um zu verstehen, was fehlt. |
| P-5 | Minor | Rechnungsseite, «Beleg anzeigen» | Ein Tipp auf «Beleg anzeigen» lädt die Datei herunter (Antwort `Content-Disposition: attachment`). Auf der Seite passiert sichtbar nichts. Ich erwartete, das PDF zu sehen. Das Symbol ist zwar ein Download-Pfeil, aber der Text sagt «anzeigen». |
| P-6 | Minor | Dialog, Feld «Umlagefähig» nach Wahl von «Reparaturen» | Das Kästchen ist leer und gesperrt, darunter steht aber weiterhin «Die Rechnung fliesst in die Nebenkostenabrechnung ein.». Erst der Kasten «Nicht umlagefähige Kategorie» darunter sagt das Gegenteil. |
| P-7 | Nit | Dialog, jede Datei | «Bitte prüfen» steht zweimal hintereinander (Markierung und Titel des Hinweis-Kastens). Im Bedienungshilfen-Baum wird es auch zweimal vorgelesen. |
| P-8 | Nit | Dialog, Dateiauswahl | Auf dem Handy steht «Dateien hierher ziehen oder auswählen». Ziehen geht auf dem Handy nicht. Das Dateifeld des Browsers zeigt auch dann noch «No file chosen», wenn darunter schon zwei Dateien gelesen sind. |
| P-9 | Nit | Dialog und Rechnungsseite, Kasten «Beleg» | «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» Ich frage mich: Wenn Dwello den Beleg speichert, muss ich das Papier dann trotzdem behalten? Auf der Rechnungsseite steht der Kasten «Beleg» direkt unter der Überschrift «Beleg». |
| P-10 | Nit | Dialog, «Angaben prüfen» | Die Vorschau ist rund 440 px hoch und zeigt bei meinen Dateien nur das Wort «Rechnung» auf weissem Grund. Ich musste bei jeder Datei an viel Leerfläche vorbeiwischen, bis die Felder kamen. |

Was gut war: keine Seitwärts-Scrollbalken (Seitenbreite 390 = Fensterbreite), Knöpfe gross genug zum Tippen, das Gebäude wird nach dem Lesen gesperrt, «Abbrechen» fragt nach («Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» / «Abbrechen und verwerfen»), «Weiter prüfen» behält alles. Der Knopf zählt mit («2 Rechnungen erstellen» → «1 Rechnung erstellen»). Bei «Reparaturen» wird «Umlagefähig» von selbst abgewählt. Lade ich eine schon erfasste Datei noch einmal hoch, steht dort «Diese Rechnung ist schon erfasst.» mit dem Link «Erfasste Rechnung ansehen», und die Datei ist nicht angehakt. Wird alles erstellt, schliesst der Dialog, und auf der Liste steht ein grüner Kasten «1 Rechnung erstellt» mit Link.

## Beobachtungen

- Die Werte der KI sind die des Stand-ins: Als Rechnungssteller steht der Dateiname («Werke Schlussrechnung 2025», «Lift Service und Reparatur»). Beide haben die Beschreibung «Allgemeinstrom Q1», den Betrag 1’250.00, die Rechnungsnummer R-1001 und das Datum 31.03.2026 mit Zeitraum Q1 2026, obwohl die Datei «Schlussrechnung 2025» heisst. Eine Kategorie ist nie vorbelegt. Mit echter KI nicht geprüft.
- In der Rechnungsliste stehen beide neuen Rechnungen als «Manuell», obwohl die KI sie ausgelesen hat. Auf der Rechnungsseite steht «Manuell kategorisiert»; das stimmt, weil ich die Kategorie selbst gewählt habe.
- Im Bedienungshilfen-Baum stehen unter jedem Datumsfeld leere Absätze.
- Das gesperrte Feld «Gebäude» schneidet den Text ab: «Seepark Residenz – Seeweg 15, 6».
- Im Hauptmenü auf dem Handy reagierte ein sehr früher Tipp (bevor die Seite fertig geladen war) nicht. Nach dem Laden ging es.

## Aufgabe geschafft: ja

Beide Dateien sind hochgeladen. Die Werke-Rechnung ist als «Allgemeinstrom» (umlagefähig, CHF 1’250.00) erstellt, die Lift-Rechnung im zweiten Durchgang als «Reparaturen» (nicht umlagefähig, CHF 1’250.00). Der Beleg der Werke-Rechnung liess sich über «Beleg anzeigen» herunterladen, aber nicht in der Seite ansehen. Ob der Betrag der Werke-Rechnung stimmt, weiss ich nicht (P-2).

## Aufwand

Etwa 6 Minuten Benutzerzeit, rund 30 Tipps und Wischer: Menü → Rechnungen → Hochladen → Gebäude → Dateien. Dann pro Datei «Angaben prüfen», Kategorie wählen, ein Fehlversuch ohne Kategorie, Abbrechen ausprobiert, Erstellen. Wegen P-1 habe ich die Lift-Datei in einem zweiten Durchgang hochgeladen und erstellt. Danach Liste filtern, Rechnung öffnen, Beleg. Das Lesen beider Dateien dauerte etwa 1 bis 2 Sekunden.

## Ablauf

1. **Übersicht → Menü → «Rechnungen».** Erwartet: die Rechnungsliste. Gesehen: «Rechnungen» mit den Knöpfen «Rechnungen hochladen» (Hauptknopf) und «Rechnung erfassen» (Screenshot `03-invoices.png`).
2. **«Rechnungen hochladen».** Erwartet: ein Dialog, in dem ich Dateien wähle. Gesehen (`04-dialog.png`): Titel, Einleitung («Die KI liest die Angaben aus; Sie prüfen sie, bevor Dwello die Rechnungen erstellt.»), blauer Kasten «Beleg», Feld «Gebäude», gestrichelte Fläche «Dateien hierher ziehen oder auswählen» mit «Wählen Sie zuerst das Gebäude.» und gesperrtem Dateifeld. Darunter «0 Rechnungen erstellen» (grau) und «Abbrechen». Der Dialog passt in die Breite. Klar.
3. **Gebäude «Seepark Residenz – Seeweg 15, 6003 Luzern».** Erwartet: Dateiauswahl wird frei. Gesehen: Hilfetext wechselt auf «PDF, JPG oder PNG, je höchstens 10 MB, bis zu 20 Dateien auf einmal. Ausgewählte Dateien liest die KI sofort aus.». Gut.
4. **Beide Dateien auswählen.** Erwartet: eine Ladeanzeige, dann die Angaben. Gesehen (`06-reading.png`, `08-scroll-1.png`, `08-scroll-2.png`): nach etwa einer Sekunde zwei Einträge, beide mit «Bitte prüfen» in Gelb und angehakt «Diese Rechnung erstellen», dazu «Angaben prüfen» und «Datei entfernen». Das Gebäude ist jetzt gesperrt. Das Dateifeld sagt weiter «No file chosen» (P-8).
5. **Hinweise lesen.** Werke: Akonto-Abzug von CHF 1’000.00, «so erfassen, dass jede Leistung nur einmal zählt». Erwartet: was ich konkret tun soll. Gesehen: keine Zahl und keine Anleitung (P-2). Lift: «enthält Kosten, die nicht umlagefähig sind … Erfassen Sie diese als eigene Rechnung.». Erwartet: eine Möglichkeit zum Aufteilen. Gesehen: keine (P-3).
6. **«Angaben prüfen» bei Werke.** Gesehen (`09-werke-angaben.png`, `10-werke-scroll-1…4.png`): eine grosse, fast leere Vorschau (P-10), dann die Felder Rechnungsnummer, Rechnungsdatum mit «Die KI ist unsicher. Bitte prüfen Sie den Wert.», Leistungszeitraum mit langem Hilfetext, Betrag, Rechnungssteller, Beschreibung, Kategorie («Kategorie auswählen»), Verteilschlüssel und Umlagefähig. Die Beschriftungen stehen über den Feldern, alles gut lesbar.
7. **Gleich «2 Rechnungen erstellen» getippt (Kategorie vergessen).** Erwartet: ein klarer Hinweis, was fehlt. Gesehen (`12-create-without-cat.png`): beide Dateien klappen auf, ich lande in einer leeren Vorschau. Erst nach dem Hochwischen (`13-scrolled-up.png`) sehe ich «Wählen Sie eine Kategorie.» im gelben Kasten (P-4). Nichts wurde gespeichert, gut.
8. **«Abbrechen» probiert.** Erwartet: eine Rückfrage. Gesehen (`15-after-cancel.png`): Rückfrage «Hochladen abbrechen?» unten am Bildschirm. «Weiter prüfen» brachte mich zurück, beide Dateien waren noch da. Gut.
9. **Entscheidung.** Werke: Kategorie «Allgemeinstrom», Betrag gelassen (`16-werke-kategorie.png`). Lift: «Diese Rechnung erstellen» abgehakt, weil ich den Reparaturanteil nicht kenne. Der Knopf zählt jetzt «1 Rechnung erstellen» (`17-lift-unchecked.png`).
10. **«1 Rechnung erstellen».** Erwartet: Bestätigung und Dialog zu, oder klar sichtbar «erstellt». Gesehen (`19-after-create.png`): Der Dialog bleibt offen; sichtbar sind nur die Lift-Datei, «Wählen Sie mindestens eine Rechnung zum Erstellen.» und «0 Rechnungen erstellen» in Grau. Die Meldung «1 Rechnung erstellt» mit Link steht oben im Dialog, ausserhalb meiner Sicht (P-1). Ich dachte zuerst, es habe nicht geklappt.
11. **Zweiter Durchgang für Lift.** Dieselben zwei Dateien noch einmal gewählt. Gesehen: Bei Werke steht «Diese Rechnung ist schon erfasst.» mit «Erfasste Rechnung ansehen», nicht angehakt. Sehr gut. Werke mit «Datei entfernen» entfernt (ohne Rückfrage; nichts war gespeichert, also in Ordnung). Bei Lift die Kategorie «Reparaturen» gewählt: «Umlagefähig» wird leer und gesperrt, dazu ein Kasten «Nicht umlagefähige Kategorie» (`21-lift-reparaturen.png`). Darüber steht noch «fliesst in die Nebenkostenabrechnung ein» (P-6).
12. **«1 Rechnung erstellen».** Gesehen (`22-after-create-lift.png`): Der Dialog schliesst, auf der Liste steht oben ein grüner Kasten «1 Rechnung erstellt – Lift Service und Reparatur». Der Fokus liegt auf «Rechnungen hochladen». So hatte ich es auch in Schritt 10 erwartet.
13. **Liste nach Seepark Residenz / 2026 gefiltert.** Gesehen (`24-list-seepark-2026.png`): beide neuen Rechnungen, Werke «Umlagefähig», Lift «Nicht umlagefähig».
14. **Werke-Rechnung geöffnet, Abschnitt «Beleg».** Gesehen (`27-beleg-section.png`): Dateiname «Werke Schlussrechnung 2025.pdf», Knopf «Beleg anzeigen» mit Download-Symbol, Kasten «Beleg», darunter «Datei des Belegs» und «Beleg ersetzen».
15. **«Beleg anzeigen».** Erwartet: das PDF sehen. Gesehen (`28-beleg-open.png`): Die Seite bleibt gleich, kein neuer Tab. Der Browser lädt «Werke Schlussrechnung 2025.pdf» herunter (application/pdf, attachment) (P-5).

## Verwirrung

- «Akonto» bzw. «bereits bezahlte Beträge abgezogen»: Ich weiss nicht, ob ich den Rest- oder den Gesamtbetrag erfassen soll (P-2).
- «Erfassen Sie diese als eigene Rechnung»: Wie, wenn ich nur eine Datei habe und der Dialog nicht aufteilen kann (P-3)?
- «Die KI ist unsicher. Bitte prüfen Sie den Wert.»: Bei welchem Wert genau? Es steht unter dem Rechnungsdatum, gilt das auch für den Zeitraum?
- «Beleg» und «Bewahren Sie die Originalrechnung auf»: Ist die hochgeladene Datei der Beleg, oder muss ich zusätzlich das Papier behalten (P-9)?
- «Wählen Sie mindestens eine Rechnung zum Erstellen.» direkt nach dem erfolgreichen Erstellen (P-1).
- «Manuell» in der Liste, obwohl ich hochgeladen habe.

## Fehlerrisiken

- P-1: Ich halte das Erstellen für gescheitert und lade noch einmal hoch. Die Doppelt-Erkennung fängt das ab; ohne sie gäbe es Doppelte. Oder ich breche ab und lese «Ihre Eingaben gehen verloren» (nach dem Teil-Erstellen nicht geprüft) und glaube, auch die erstellte Rechnung sei weg.
- P-2: Ein falscher Betrag in einer umlagefähigen Rechnung führt zu einer falschen Nebenkostenabrechnung: Die Mieter zahlen 1’000 zu viel oder zu wenig.
- P-3: Wer den Hinweis nicht befolgen kann, erfasst die ganze Lift-Rechnung als umlagefähig (Mieter zahlen die Reparatur) oder als nicht umlagefähig (der Vermieter bleibt auf dem Lift-Service sitzen, so bei mir).
- P-6: Wer nur «Die Rechnung fliesst in die Nebenkostenabrechnung ein» liest, glaubt, die Reparatur werde umgelegt.

## Vorschläge

- **P-1** Reproduktion: Rechnungen → «Rechnungen hochladen» → Seepark Residenz → beide Dateien → bei Werke Kategorie «Allgemeinstrom» → bei Lift «Diese Rechnung erstellen» abhaken → «1 Rechnung erstellen». Was helfen würde: die erstellten Dateien aus der Liste nehmen und die Meldung «1 Rechnung erstellt» dort zeigen, wo ich gerade bin, oder nach oben scrollen bzw. den Fokus darauf setzen. Den Satz «Wählen Sie mindestens eine Rechnung zum Erstellen.» in diesem Zustand nicht zeigen. Einen Knopf «Schliessen» anbieten, der nicht nach «verwerfen» fragt.
- **P-2** Reproduktion: «Werke Schlussrechnung 2025.pdf» für Seepark hochladen, Hinweis lesen. Was helfen würde: konkret sagen, was zu tun ist, zum Beispiel «Haben Sie die Akonto-Rechnungen schon erfasst, lassen Sie CHF 1’250.00 stehen. Sonst tragen Sie CHF 2’250.00 ein.», und die schon erfassten Rechnungen desselben Rechnungsstellers verlinken.
- **P-3** Reproduktion: «Lift Service und Reparatur.pdf» hochladen, Hinweis lesen, Möglichkeit zum Aufteilen suchen. Was helfen würde: «Als zwei Rechnungen erfassen» (dieselbe Datei als Beleg für beide), oder der Hinweis sagt, wo ich den Rest erfasse.
- **P-4** Reproduktion: zwei Dateien hochladen, ohne Kategorie «2 Rechnungen erstellen» tippen. Was helfen würde: zum ersten fehlenden Feld scrollen und es fokussieren, oder oben eine Zusammenfassung «Bei 2 Rechnungen fehlt die Kategorie».
- **P-5** Reproduktion: Werke-Rechnung öffnen → «Beleg anzeigen». Was helfen würde: das PDF im Browser öffnen (inline, neuer Tab) oder den Knopf «Beleg herunterladen» nennen.
- **P-6** Reproduktion: im Dialog Kategorie «Reparaturen» wählen. Was helfen würde: den Hilfetext unter dem gesperrten Kästchen anpassen («Fliesst nicht in die Nebenkostenabrechnung ein») oder ausblenden.
- **P-7** Reproduktion: eine Datei mit Hinweis hochladen. Was helfen würde: die Markierung oder den Titel des Kastens weglassen.
- **P-8** Reproduktion: Dialog auf dem Handy öffnen und Dateien wählen. Was helfen würde: auf kleinen Bildschirmen «Dateien auswählen» schreiben und das Browser-Dateifeld durch einen eigenen Knopf ersetzen.
- **P-9** Reproduktion: Dialog oder Rechnungsseite, Kasten «Beleg». Was helfen würde: ein Satz wie «Dwello speichert die Datei als Beleg. Bewahren Sie das Papier-Original trotzdem auf …» und kein zweites «Beleg» direkt unter der Überschrift.
- **P-10** Reproduktion: «Angaben prüfen». Was helfen würde: eine kleinere Vorschau auf dem Handy, die man zum Vergrössern antippt.

## Nicht geprüft

- Wie das Herunterladen bzw. Anzeigen des Belegs auf einem echten iPhone oder Android aussieht: Headless-Chromium zeigt keine Download-Leiste und keine PDF-Ansicht.
- Was «Abbrechen» direkt nach einem Teil-Erstellen (Zustand von P-1) fragt. Dafür hätte ich eine weitere Rechnung erstellen müssen, und meine beiden Dateien waren schon erfasst.
- Eine echte KI und echte Rechnungsinhalte: Die Vorschau zeigt nur «Rechnung», und die Werte kommen vom Stand-in.
- Das Ziehen von Dateien (auf dem Handy nicht möglich), das Querformat und ein dunkles Design.
- Den Kalenderknopf und den Verteilschlüssel habe ich nicht benutzt.
