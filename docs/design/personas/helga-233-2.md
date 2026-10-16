# Helga – Hinweise bei «ohne KI» (Runde 233-2, Nachprüfung von P-1 aus `helga-233.md`)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus.
Nur angeschaut: nichts erstellt, nichts gespeichert. Jedes Mal mit «Abbrechen» → «Abbrechen und verwerfen» beendet.
Datei: «Hauswart Q1 ohne KI.pdf» aus `/tmp/persona-files`, Gebäude «Musterhaus Zentrum».
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/helga-233-2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen hochladen, Hinweise zu «Hauswart Q1 ohne KI.pdf» | Die Liste «Füllen Sie aus: …» zählt ein Feld schon als erledigt, wenn irgendetwas darin steht. Mit «abc» oder «0» im Betrag oder nur Leerzeichen beim Rechnungssteller verschwindet das Feld aus der Liste. Wenn ich dann alles andere ausfülle, ist die Liste weg, aber der Knopf heisst weiter «0 Rechnungen erstellen (1 unvollständig)». Was noch fehlt, steht nirgends, auch nicht am Feld. |
| P-2 | Nit | Rechnungen hochladen, Hinweise | Die Kategorie steht in einem eigenen Satz («Wählen Sie eine Kategorie.»), die anderen Pflichtfelder in einem zweiten Satz. Die Reihenfolge in «Füllen Sie aus: Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung.» ist anders als die Reihenfolge der Felder (Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung). Ich habe zuerst den Rechnungssteller gesucht und ihn weiter unten gefunden. |

## Beobachtungen

- Der Satz «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.» bleibt stehen, auch wenn alles ausgefüllt ist und der Knopf schon «1 Rechnung erstellen» heisst (wie P-3 in Runde 233).
- Der Hinweiskasten steht über den Feldern. Wenn ich unten beim Betrag oder beim Rechnungssteller schreibe, sehe ich den Kasten nicht. Um zu sehen, ob er sich ändert, muss ich hinaufscrollen.
- Das Dateifeld zeigt «Choose Files / No file chosen» auf Englisch (Testbrowser, wie in Runde 233).
- Im zusammengeklappten Zustand ist nach dem vollständigen Ausfüllen nur noch der Satz «Die KI ist nicht verfügbar …» im gelben Kasten mit Warndreieck zu sehen, dazu das Schild «Bitte prüfen». Das wirkt, als ob noch etwas fehlt, obwohl der Knopf «1 Rechnung erstellen» sagt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 15 Schritte im ersten Durchgang. Danach drei weitere Durchgänge, um zu sehen, was die Hinweise bei falschen Eingaben tun.

## Ablauf

1. **Rechnungen → «Rechnungen hochladen», «Musterhaus Zentrum», Datei «Hauswart Q1 ohne KI.pdf» gewählt.** Erwartet: Dwello liest die Datei und sagt mir, was fehlt. Gesehen: «1 von 1 Dateien gelesen. Bitte prüfen: 1.», die Zeile mit dem Schild «Bitte prüfen» und einem gelben Kasten «Hinweise zu Hauswart Q1 ohne KI.pdf» (Bild `11-notes-before.png`):
   - «Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.»
   - «Wählen Sie eine Kategorie.»
   - «Füllen Sie aus: Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung.»
   Der Knopf unten: «0 Rechnungen erstellen (1 unvollständig)».
   **Weiss ich jetzt, was ich ausfüllen muss? Ja.** Fünf Dinge: Kategorie, Rechnungssteller, Rechnungsdatum, Betrag, Beschreibung. In Runde 233 stand hier nur der allgemeine Satz, jetzt sind die Felder mit Namen genannt. Das hilft mir sehr.
2. **«Angaben prüfen».** Gesehen: links die Vorschau (nur das Wort «Rechnung»), rechts die Felder. Die genannten Felder haben kein «(optional)», alle anderen schon. Das passt zum Hinweis. Die Reihenfolge ist aber anders als im Hinweis (P-2).
3. **Rechnungssteller «Hauswartung Meier GmbH» eingetippt.** Erwartet: Er verschwindet aus der Liste. Gesehen: «Füllen Sie aus: Rechnungsdatum, Betrag, Beschreibung.» Schon beim ersten Buchstaben verschwindet er, nicht erst beim Verlassen des Feldes. Als ich das Feld wieder geleert habe, kam er zurück. Gut.
4. **Betrag «920.00» eingetippt.** Gesehen: «Füllen Sie aus: Rechnungsdatum, Beschreibung.» (Bild `12-notes-after-two.png`). **Folgen die Hinweise meinen Eingaben? Ja.** Der Knopf bleibt «0 Rechnungen erstellen (1 unvollständig)», das stimmt, es fehlt ja noch etwas.
5. **Zusatz: Weiter ausgefüllt.** Nach dem Rechnungsdatum 31.03.2026: «Füllen Sie aus: Beschreibung.» Nach der Beschreibung verschwindet der Satz «Füllen Sie aus» ganz. Nach der Kategorie «Hauswart» verschwindet auch «Wählen Sie eine Kategorie.», und der Knopf heisst «1 Rechnung erstellen». So soll es sein.
6. **Zusatz: Falsche Werte.** Im Betrag «abc» (das Feld nimmt es an, Bild `13-betrag-abc.png`) oder «0»: Der Betrag verschwindet trotzdem aus der Liste. Mit nur Leerzeichen beim Rechnungssteller verschwindet er auch. Wenn alles andere stimmt, ist kein Hinweis mehr da, unter den Feldern steht kein Fehler, aber der Knopf sagt «0 Rechnungen erstellen (1 unvollständig)». Ich würde nicht wissen, was ich noch tun muss (P-1).
7. **«Abbrechen» → «Abbrechen und verwerfen».** Erwartet: Rückfrage, dann ist alles weg. Gesehen: «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» und «Abbrechen und verwerfen». Nach dem Verwerfen ist das Fenster zu, auf der Seite «Rechnungen» ist nichts Neues. Gut.

## Verwirrung

- Warum steht die Kategorie in einem eigenen Satz und nicht in der Liste «Füllen Sie aus»? Ich habe kurz gedacht, sie sei etwas anderes als die übrigen Felder (P-2).
- «unvollständig» auf dem Knopf, obwohl kein Hinweis mehr etwas nennt (P-1).
- «Die KI ist nicht verfügbar.» bleibt stehen, nachdem ich alles selbst ausgefüllt habe (Beobachtung).

## Fehlerrisiken

- Wer sich beim Betrag vertippt, zum Beispiel mit einem Komma oder einem Buchstaben, sieht den Betrag aus der Liste verschwinden und glaubt, er sei richtig. Dann bleibt die Rechnung «unvollständig», und man weiss nicht warum (P-1).
- Wer unten in den Feldern schreibt, sieht nicht, dass sich die Liste oben ändert (Beobachtung).

## Vorschläge

- **P-1:** Rechnungen → «Rechnungen hochladen» → «Musterhaus Zentrum» → «Hauswart Q1 ohne KI.pdf» → «Angaben prüfen» → Rechnungssteller «Hauswartung Meier GmbH», Betrag «abc», Rechnungsdatum «31.03.2026», Beschreibung «Hauswartung Q1 2026», Kategorie «Hauswart». Der Hinweiskasten nennt kein Feld mehr, der Knopf heisst «0 Rechnungen erstellen (1 unvollständig)». Gleich mit Betrag «0» oder mit drei Leerzeichen als Rechnungssteller. Hilfreich: ein Feld erst dann aus der Liste nehmen, wenn sein Wert gültig ist, oder in der Liste sagen «Prüfen Sie: Betrag (kein gültiger Betrag).» bzw. den Fehler direkt unter dem Feld zeigen.
- **P-2:** wie oben, Schritt 1. Hilfreich: alle Pflichtfelder in einem Satz in der Reihenfolge der Felder, zum Beispiel «Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung, Kategorie.»

## Nicht geprüft

- Erstellen der Rechnung: Ich sollte nur anschauen.
- Die Hinweise bei mehreren Dateien gleichzeitig und bei Dateien, die die KI gelesen hat.
- Andere Zoomstufen als 150 %.
- Ob der Knopf «… erstellen» bei «0 Rechnungen» die fehlenden Felder rot markiert (dafür hätte ich auf erstellen klicken müssen).
