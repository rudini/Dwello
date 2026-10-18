# Helga – Issue #222, Runde 2: geänderte Hinweise zu Akontorechnungen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (den Hinweis im Dialog auch bei 200 %), Maus.
App: Persona-Stack auf http://localhost:3300, Demodaten, KI-Stellvertreter.
Gespeichert im Gebäude «Seepark Residenz»: eine Rechnung «Werke Schlussrechnung 2025» (Allgemeinstrom, CHF 1’250.00).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/helga-222-2/`

Bewertet werden nur die beiden geänderten Hinweistexte. Die Punkte aus Runde 1, die schon in Issue #268 stehen (Länge, wo das Feld «Betrag» ist, welche Rechnungen Akontorechnungen sind, «abgerechnet»), wiederhole ich nicht.

**Stand von P-1 aus Runde 1 (Major): behoben.** Der Hinweis trennt jetzt die beiden Fälle und nennt bei jedem den Knopf: «löschen Sie sie auf ihrer Seite mit «Rechnung löschen»» und «Sind ihre Dateien hier ausgewählt, entfernen Sie diese mit «Datei entfernen»». Weil dort «ihre Dateien» steht, verstehe ich: «Datei entfernen» drücke ich nur bei den Dateien der Akontorechnungen, nicht bei der Schlussrechnung. Ich hätte diesmal nicht auf den roten Knopf unter dem Hinweis gedrückt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen (Dialog), Hinweis | «löschen Sie sie auf ihrer Seite mit «Rechnung löschen»»: Wo «ihre Seite» ist, steht nicht (Rechnungen → Rechnung öffnen). Beim lauten Lesen höre ich «auf Ihrer Seite», als wäre ich gemeint. Ausserdem sagt der Hinweis nicht, dass ich erst die Schlussrechnung erstellen soll: Verlasse ich den Dialog, um eine Akontorechnung zu löschen, kommt «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» |
| P-2 | Minor | Rechnungen hochladen (Dialog), Hinweis | Neu ist der Schluss «… und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist.» Was ich konkret eintragen soll, verstehe ich nicht: welches Datum bei «Beginn», und woher ich weiss, welche Abrechnungsperiode das ist. Vorgeschlagen war 01.01.2026 bis 31.03.2026; ob das passt, kann ich nicht beurteilen. |
| P-3 | Minor | Rechnung (Detail), «Hinweise zum Beleg» | «Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen, und der Leistungszeitraum beginnt erst nach der Abrechnungsperiode, in der sie abgerechnet ist.» Das klingt weiter wie eine Feststellung von Dwello, nicht wie eine Prüfliste (Runde 1, P-4), jetzt mit drei Aussagen statt zwei. Wo ich eine Akontorechnung lösche, sagt dieser Hinweis nicht. Der einzige Knopf «Rechnung löschen» auf dieser Seite löscht die Schlussrechnung selbst. |
| P-4 | Nit | beide Hinweise | Noch immer «Auf der Rechnung» im Dialog und «Auf dem Beleg» auf der Detailseite (Runde 1, P-5). |

## Beobachtungen

- Beim zweiten Hochladen derselben Datei (nur zum Prüfen, nicht gespeichert) steht oben im Hinweis «Diese Rechnung ist schon erfasst.» mit dem Link «Erfasste Rechnung ansehen», und «Diese Rechnung erstellen» ist abgewählt. Das hat mich vor einer doppelten Schlussrechnung bewahrt. Gut.
- Das Dateifeld des Browsers ist weiterhin englisch («Choose Files / No file chosen», «Choose File»), wie in Runde 1.
- Der Stellvertreter schlägt für die «Schlussrechnung 2025» weiterhin «Allgemeinstrom Q1», 31.03.2026 und 01.01.–31.03.2026 vor (Werte vom Stellvertreter).

## Aufgabe geschafft: ja

Hochgeladen, mit Kategorie «Allgemeinstrom» erstellt, geöffnet, beide Hinweise gelesen. Wo ich eine schon erfasste Akontorechnung lösche, ist jetzt klar genug: auf ihrer eigenen Seite mit «Rechnung löschen». Dass ich die Schlussrechnung im Dialog behalte, ist auch klar. Unklar bleibt der neue Satz zum Leistungszeitraum (P-2).

## Aufwand

Etwa 6 Minuten, 9 Schritte: Rechnungen → Rechnungen hochladen → Gebäude → Datei → Hinweis lesen → Angaben prüfen → Kategorie → 1 Rechnung erstellen → Rechnung öffnen und Hinweis lesen. Dazu ein Kontrollversuch: noch einmal hochladen und «Abbrechen» drücken (Rückfrage nicht bestätigt, nichts gespeichert).

## Ablauf

1. **Menü «Rechnungen» → «Rechnungen hochladen» → Gebäude «Seepark Residenz – Seeweg 15, 6003 Luzern» → Datei «Werke Schlussrechnung 2025.pdf».** Erwartet: Dwello liest die Datei und warnt wie beim letzten Mal. Gesehen: «1 von 1 Dateien gelesen. Bitte prüfen: 1.» und ein gelber Kasten «Hinweise zu Werke Schlussrechnung 2025.pdf» (Screenshot 02, bei 200 % Screenshot 07):
   «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total vor dem Abzug. Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen». Sind ihre Dateien hier ausgewählt, entfernen Sie diese mit «Datei entfernen». Sonst zählen sie doppelt. Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab und lassen Sie den Leistungszeitraum erst nach der Abrechnungsperiode beginnen, in der sie abgerechnet ist.»
   Darunter stehen «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.», «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.» und die Knöpfe «Diese Rechnung erstellen», «Angaben prüfen» und, rot, «Datei entfernen».
   - Besser als beim letzten Mal: Zwei Sätze, zwei Fälle, zwei Knopfnamen. «Datei entfernen» gilt für die Dateien *der Akontorechnungen*. Die Schlussrechnung behalte ich.
   - Noch unklar: «auf ihrer Seite». Ich habe zuerst «auf Ihrer Seite» gelesen. Gemeint ist wohl die Seite der Akontorechnung, die ich unter «Rechnungen» öffne. Und soll ich das jetzt machen oder nachher? Wenn ich jetzt weggehe, ist mein Hochladen weg (siehe Schritt 5).
   - Neu und schwer: der Satz zum Leistungszeitraum am Schluss. Ich weiss nicht, welches Datum ich bei «Beginn» eintragen soll.
2. **«Angaben prüfen».** Gesehen: Betrag 1250.00, Leistungszeitraum 01.01.2026 bis 31.03.2026, Kategorie leer. Ich wähle «Allgemeinstrom» und lasse den Rest wie vorgeschlagen (Screenshot 03).
3. **«1 Rechnung erstellen».** Gesehen: «1 Rechnung erstellt» mit dem Link «Werke Schlussrechnung 2025, 31.03.2026» (Screenshot 04).
4. **Rechnung geöffnet.** Gesehen: Betrag CHF 1’250.00, Kategorie Allgemeinstrom. Im Abschnitt «Beleg» ein gelber Kasten «Hinweise zum Beleg» (Screenshot 06):
   «Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, ihr Betrag ist vom Total abgezogen, und der Leistungszeitraum beginnt erst nach der Abrechnungsperiode, in der sie abgerechnet ist.»
   Erwartet: eine kurze Prüfliste, was ich noch tun muss. Gesehen: Sätze, die klingen, als sei schon alles in Ordnung. Unten auf der Seite steht «Rechnung löschen». Das ist aber diese Rechnung, die Schlussrechnung. Den Knopf darf ich hier nicht drücken.
5. **Kontrolle: noch einmal hochladen und «Abbrechen».** Gesehen: «Diese Rechnung ist schon erfasst.» und dann die Rückfrage «Hochladen abbrechen?» mit «Hochgeladene Dateien und Ihre Eingaben gehen verloren.» Ich habe «Abbrechen und verwerfen» nicht gedrückt (Screenshot 08). Wer der Anweisung im Hinweis folgt und mitten im Dialog eine Akontorechnung löschen geht, verliert also das Hochladen.

## Verwirrung

- **«auf ihrer Seite»**: klein geschrieben gemeint als «die Seite der Akontorechnung», gelesen als «auf Ihrer Seite».
- **«den Leistungszeitraum erst nach der Abrechnungsperiode beginnen lassen»**: Leistungszeitraum und Abrechnungsperiode kenne ich als zwei Wörter aus Dwello, aber zusammen in einem Satz verstehe ich nicht, welches Datum ich nehmen soll.
- **Detailseite**: «sind nicht zusätzlich erfasst», «bleibt sie erfasst», «beginnt erst nach …»: Ist das eine Feststellung oder ein Auftrag an mich?

## Fehlerrisiken

- Ich verlasse den Dialog, um die Akontorechnungen zu löschen, und verliere die gelesene Schlussrechnung samt meiner Eingaben (P-1).
- Ich lasse den Leistungszeitraum, wie vorgeschlagen, weil ich den neuen Satz nicht verstehe, und eine schon abgerechnete Akontorechnung zählt doppelt (P-2).
- Auf der Detailseite lese ich «Akontorechnungen … nicht zusätzlich erfasst» als Entwarnung. Oder ich habe im Kopf «mit «Rechnung löschen»» aus dem Dialog und drücke den Knopf auf der Seite der Schlussrechnung (P-3).

## Vorschläge

- **P-1**: Rechnungen → «Rechnungen hochladen» → «Seepark Residenz» → «Werke Schlussrechnung 2025.pdf», dritter Satz des Hinweises. Hilfreich wäre: «Haben Sie die Akontorechnungen schon erfasst, erstellen Sie zuerst diese Rechnung. Öffnen Sie dann jede Akontorechnung unter Rechnungen und wählen Sie «Rechnung löschen».»
- **P-2**: Gleicher Weg, letzter Satz. Hilfreich wäre ein Beispiel mit Datum, etwa: «Ist die Akontorechnung für Januar bis Juni schon abgerechnet, geben Sie als Beginn den 01.07. an.»
- **P-3**: Erstellte Rechnung öffnen, Abschnitt «Beleg», «Hinweise zum Beleg». Hilfreich wären Prüfschritte als Fragen oder Aufträge, etwa: «Prüfen Sie: Ist der Betrag das Total vor dem Abzug? Haben Sie die Akontorechnungen auf ihrer eigenen Seite gelöscht (nicht diese Rechnung)? …»
- **P-4**: In beiden Hinweisen dasselbe Wort, «Rechnung» oder «Beleg».

## Nicht geprüft

- Das Löschen einer echten Akontorechnung: In «Seepark Residenz» gibt es keine Akontorechnung der Werke, die ich erfasst hätte. Fremde Rechnungen lösche ich nicht.
- Den Fall «Dateien hier ausgewählt»: Es gibt keine Testdatei für eine Akontorechnung der Werke.
- Dunkelmodus und Handy, weil das nicht zu Helgas Gerät gehört.
