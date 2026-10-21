# Helga – Rechnung hochladen, Hinweise der Zeile (#548)

Persona: Helga, 68. Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300 mit Demodaten, gespeichert nur im Gebäude «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/helga-548/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen, Zeile der Datei, Feld «Verteilschlüssel» | Wenn ich die Kategorie wähle, setzt Dwello den Verteilschlüssel «Pro Fläche (m²)» ein. Das Feld bleibt aber rot umrandet und zeigt weiter «Wählen Sie, wie die Kosten verteilt werden.». Gleichzeitig sind die Hinweise oben leer und der Knopf heisst «1 Rechnung erstellen». Das Feld sagt also «noch wählen», die Zeile sagt «fertig». |
| P-2 | Minor | Rechnungen hochladen, Hinweise der Zeile | «Prüfen Sie: Rechnungsdatum.» (und unter dem Feld «Die KI ist unsicher. Bitte prüfen Sie den Wert.») bleibt stehen, auch nachdem ich das Datum selbst eingetippt oder geändert habe. Auch das Schild «Bitte prüfen» bleibt bis zum Schluss. Ich weiss nicht, ob ich noch etwas tun muss. |
| P-3 | Minor | Rechnungen hochladen, Hinweise der Zeile | Wenn ein Pflichtfeld nachträglich leer wird (ich habe den Betrag gelöscht), sagen die Hinweise nichts darüber. Nur der Knopf wechselt auf «0 Rechnungen erstellen (1 unvollständig)». Erst nach einem weiteren Klick auf «Rechnungen erstellen» erscheinen «Füllen Sie die markierten Felder aus.» und die rote Markierung am Betrag. |

Zur eigentlichen Änderung (#548): «Füllen Sie die markierten Felder aus.» verschwindet jetzt, sobald alle markierten Felder gefüllt sind, und bleibt stehen, solange eines fehlt. Das habe ich in drei Durchgängen gesehen (Kategorie zuerst, Verteilschlüssel zuerst, Betrag geleert und neu gefüllt). Der alte Fehler (der Satz bleibt bis zum nächsten «Rechnungen erstellen») tritt nicht mehr auf.

## Beobachtungen

- Die Testhilfe hat die Datei doch «gelesen». Statt leerer Felder kamen: Rechnungsnummer R-1001, Rechnungsdatum 31.03.2026, Leistungszeitraum 01.01.2026 – 31.03.2026, Betrag 1250.00, Rechnungssteller «rechnung-elektro-blitz» (der Dateiname), Beschreibung «Allgemeinstrom Q1». Kategorie und Verteilschlüssel waren leer. Deshalb waren nach dem ersten «Rechnungen erstellen» nur Kategorie und Verteilschlüssel markiert, nicht Rechnungssteller, Beschreibung und Betrag.
- Die vorgeschlagene Rechnungsnummer R-1001 und der Leistungszeitraum 01.01. – 31.03.2026 wurden mitgespeichert. Ich hatte sie nicht geprüft, weil die Hinweise nur das Rechnungsdatum nennen. Siehe Fehlerrisiken.
- Die Vorschau links neben den Feldern blieb eine weisse Fläche. Meine selbst gemachte PDF hat aber auch keinen Inhalt.
- Nach dem Erstellen meldet die Seite «1 Rechnung erstellt» und zeigt den Link «Elektro Blitz, 31.03.2026». Die Detailseite zeigt CHF 180.00, Allgemeinstrom, Pro Fläche (m²), Umlagefähig, Beleg rechnung-elektro-blitz.pdf. Das ist so, wie ich es eingegeben habe.
- Der Hinweis «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.» bleibt stehen, obwohl auf meiner Rechnung keins steht. Er sagt ja «wenn angegeben», das ist für mich verständlich.
- Der Knopf zählt mit: «0 Rechnungen erstellen (1 unvollständig)» wird zu «1 Rechnung erstellen», sobald alles da ist. Das hilft mir.

## Aufgabe geschafft: ja

Die Rechnung «Elektro Blitz – Treppenhauslicht», CHF 180.00, ist in «Seepark Residenz» erstellt.

## Aufwand

Etwa 15 Sekunden reine Klickzeit im letzten Durchgang. Als Helga mit Lesen etwa 5 bis 8 Minuten. Schritte: Rechnungen → Rechnungen hochladen → Gebäude wählen → Dateien auswählen → Rechnungen erstellen (leer) → 4 Textfelder → Kategorie → Verteilschlüssel → 1 Rechnung erstellen. Das sind etwa 11 Schritte.

## Ablauf

1. **«Rechnungen» → «Rechnungen hochladen».** Ich erwartete ein Fenster zum Hochladen. Es öffnet sich ein Dialog: zuerst Gebäude wählen, das Ablagefeld ist bis dahin gesperrt («Wählen Sie zuerst das Gebäude.»). Das ist klar.
2. **Gebäude «Seepark Residenz – Seeweg 15, 6003 Luzern», «Dateien auswählen», PDF gewählt.** Ich erwartete, dass die Datei gelesen wird. Ich sah «Fertig: 1 von 1. Bitte prüfen: 1.», das Schild «Bitte prüfen» und die Hinweise «Wählen Sie eine Kategorie.», «Wählen Sie, wie die Kosten verteilt werden.», «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.». Der Knopf heisst «0 Rechnungen erstellen (1 unvollständig)».
3. **Sofort «Rechnungen erstellen» gedrückt.** Ich erwartete, dass Dwello zeigt, was fehlt. Die Angaben klappen auf, und die Hinweise bekommen zusätzlich «Füllen Sie die markierten Felder aus.» (Screenshot `51-nach-erstem-erstellen.png`: gelber Kasten mit fünf Zeilen). Kategorie und Verteilschlüssel sind rot umrandet, mit Fehlertext darunter. Es wurde nichts gespeichert. Das passt.
4. **Rechnungssteller auf «Elektro Blitz» geändert.** Die Hinweise bleiben gleich (fünf Zeilen). Das passt, denn die markierten Felder sind ja noch leer.
5. **Beschreibung «Treppenhauslicht».** Gleich wie Schritt 4. Das passt.
6. **Betrag «180.00».** Gleich wie Schritt 4. Das passt.
7. **Rechnungsdatum «31.03.2026» neu eingetippt.** Ich erwartete, dass «Prüfen Sie: Rechnungsdatum.» verschwindet, weil ich es geprüft habe. Er bleibt, ebenso «Die KI ist unsicher» unter dem Feld. Das passt nicht (P-2).
8. **Kategorie «Allgemeinstrom».** Ich erwartete, dass «Wählen Sie eine Kategorie.» verschwindet, «Füllen Sie die markierten Felder aus.» aber bleibt, weil der Verteilschlüssel noch fehlt. Ich sah, dass Dwello den Verteilschlüssel «Pro Fläche (m²)» selbst eingesetzt hat. Die Hinweise zeigen nur noch «Prüfen Sie: Rechnungsdatum.» und die Zeile zum Fälligkeitsdatum (`53-kategorie-hinweise.png`). Der Knopf heisst «1 Rechnung erstellen». Unten ist das Verteilschlüssel-Feld aber weiter rot, mit «Wählen Sie, wie die Kosten verteilt werden.» (`54-kategorie-vs-feld.png`, rot umrandetes Feld mit «Pro Fläche (m²)», darunter der rote Fehlertext). Die Hinweise oben passen, das Feld nicht (P-1).
9. **Verteilschlüssel «Pro Fläche (m²)» selbst gewählt.** Danach ist das Feld nicht mehr rot. Die Hinweise sind unverändert. Das passt.
10. **«1 Rechnung erstellen».** Der Dialog geht zu, oben steht «1 Rechnung erstellt» mit dem Link «Elektro Blitz, 31.03.2026». Das passt.

Zusätzliche Durchgänge, jeweils ohne zu speichern:
- **Verteilschlüssel zuerst («Pro Einheit»):** «Wählen Sie, wie die Kosten verteilt werden.» verschwindet sofort, «Wählen Sie eine Kategorie.» und «Füllen Sie die markierten Felder aus.» bleiben, und nur Kategorie ist rot. Das ist richtig. Nach der Kategorie ist alles weg, und «Pro Einheit» bleibt stehen (der Vorschlag überschreibt meine Wahl nicht).
- **Betrag geleert:** Die Hinweise sagen nichts, nur der Knopf wechselt auf «(1 unvollständig)» (P-3). Nach «Rechnungen erstellen» erscheinen «Füllen Sie die markierten Felder aus.» und «Bitte geben Sie einen gültigen Betrag ein.». Sobald ich 180.00 tippe, verschwinden beide schon während der Cursor noch im Feld steht. Das ist richtig.

## Verwirrung

- Rotes Feld mit Wert drin (P-1): Ich hätte gedacht, «Pro Fläche (m²)» sei falsch und ich müsse etwas anderes wählen.
- «Prüfen Sie: Rechnungsdatum.»: Wie zeige ich Dwello, dass ich geprüft habe? Es gibt keinen Haken dafür, und der Hinweis geht nie weg.
- «Bitte prüfen» bleibt oben am Rand stehen, obwohl alles ausgefüllt ist.
- «Verteilschlüssel» erklärt der Hilfetext gut. «Umlagefähig» wird mit «fliesst in die Nebenkostenabrechnung ein» erklärt, das verstehe ich.

## Fehlerrisiken

- P-1: Helga wählt, damit das Rot weggeht, einen anderen Verteilschlüssel als vorgeschlagen, und die Kosten werden dann anders verteilt als bei früheren Allgemeinstrom-Rechnungen. Oder sie wählt den gleichen Eintrag nochmals. In einem echten Browser löst das Wählen des schon gewählten Eintrags meist nichts aus, dann bliebe das Feld rot (nicht nachgeprüft, siehe «Nicht geprüft»).
- Die von der KI eingesetzten Werte, die nicht in den Hinweisen stehen (Rechnungsnummer, Leistungszeitraum), werden ungeprüft gespeichert. Ein falscher Leistungszeitraum ändert, in welche Abrechnungsperiode die Kosten fallen.

## Vorschläge

- **P-1:** Nachstellen: Rechnungen hochladen → Seepark Residenz → PDF → «Rechnungen erstellen» → Kategorie «Allgemeinstrom» wählen → zum Verteilschlüssel scrollen. Was helfen würde: Wenn Dwello den Verteilschlüssel einsetzt, die rote Markierung und den Fehlertext ebenfalls entfernen, so wie bei der Kategorie. Dazu könnte ein Satz wie «Vorgeschlagen nach der letzten Rechnung dieser Kategorie» erklären, woher der Wert kommt.
- **P-2:** Nachstellen: Datei hochladen, Rechnungsdatum neu eintippen oder ändern. Der Hinweis «Prüfen Sie: Rechnungsdatum.» und «Die KI ist unsicher» bleiben. Was helfen würde: Den Hinweis entfernen, sobald ich das Datum geändert oder bestätigt habe. Und das Schild «Bitte prüfen» durch «Bereit» ersetzen, wenn nichts mehr fehlt.
- **P-3:** Nachstellen: Nach dem Ausfüllen den Betrag löschen und daneben klicken. Was helfen würde: Ein fehlendes Pflichtfeld sofort in den Hinweisen nennen («Geben Sie den Betrag ein.»), so wie es bei Kategorie und Verteilschlüssel schon geschieht.

## Nicht geprüft

- Was das Wählen des schon gewählten Verteilschlüssels in einem echten Browser macht. Die Teststeuerung löst beim Wählen immer ein Ereignis aus, eine echte Maus-Auswahl desselben Eintrags meist nicht.
- Der Fall «Datei ganz ungelesen» (alle Felder leer). Die Testhilfe hat Werte eingesetzt, deshalb waren Rechnungssteller, Beschreibung und Betrag nie markiert. Dass deren Markierung beim Füllen verschwindet, habe ich nur über den geleerten Betrag gesehen.
- 200 % Zoom, und Ziehen und Ablegen der Datei.
