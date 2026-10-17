# Anna – Runde 57: Angefangene Angaben in «Mietvertrag erfassen» und «Abrechnungen erstellen»

Persona: Anna, 29, Vermieterin zum ersten Mal, kommt nach Monaten zurück und erinnert sich an nichts. Desktop 1440 × 900, ein Bildschirm zusätzlich auf Mobile 390 × 844, Maus/Touch.
App: http://localhost:3300 (Demodaten). Nichts gespeichert, kein Mietvertrag und keine Abrechnung erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/879b2e8a-9792-5ec1-9fc0-43620631e395/scratchpad/anna-57/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Bestätigung «Angaben verwerfen?» (beide Assistenten) | Der Text sagt nur «Ihre Angaben werden gelöscht.» Er sagt nicht, dass nur die Eingaben in diesem Browser weg sind und kein Mietvertrag und keine Abrechnung (kein «Entwurf») in Dwello gelöscht wird. Bei «Abrechnungen erstellen», wo oben «Es entstehen Entwürfe» steht, war ich unsicher, ob meine 7 Entwürfe mit weg sind. |
| P-2 | Minor | Beide Assistenten nach der Rückkehr | Nach dem Wiederherstellen fehlt die Statuszeile «Noch nicht gespeichert …» unter dem Assistenten, bis ich wieder etwas ändere. Schliesse ich die Meldung «Angaben wiederhergestellt», steht nirgends mehr, dass die angezeigten Angaben nicht gespeichert sind. |
| P-3 | Minor | «Neuer Mietvertrag» nach der Rückkehr | Der Mietvertrag-Assistent beginnt nach der Rückkehr wieder bei Schritt 1 (Mieter), obwohl ich bei Schritt 2 eine Wohnung gewählt hatte; die Wohnung sehe ich erst nach «Weiter». «Abrechnungen erstellen» öffnet dagegen den Schritt, auf dem ich war. Ich dachte zuerst, die Wohnung sei verloren. |
| P-4 | Minor | «Neuer Mietvertrag», Link «Abbrechen» | «Abbrechen» behält die Angaben: Beim nächsten Öffnen stehen sie wieder da. Ich hatte erwartet, dass «Abbrechen» meine Eingabe wegwirft. |

## Beobachtungen

- Die Statuszeile unter dem Assistenten erscheint sofort beim ersten Eingeben (Mieter gewählt, Gebäude angekreuzt, Periode geändert): «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf. Stand: 12:27». Sie ist gut verständlich, mit Info-Symbol, nicht nur Farbe. Der «Stand» zeigt nur die Uhrzeit, kein Datum; die Meldung beim Wiederherstellen zeigt dagegen Datum und Uhrzeit («zuletzt am 17.10.2026 um 12:28 bearbeitet»). Nach Monaten ist das Datum wichtig; in der Meldung steht es ja.
- Übernehme ich in «Abrechnungen erstellen» nur die vorgeschlagene Periode (01.01.2025 – 31.12.2025) und gehe weiter, erscheint keine Statuszeile und nichts wird aufbewahrt. Erst das Ankreuzen eines Gebäudes zeigt sie. Das ist stimmig (ich habe ja nichts eingegeben), aber ich hätte bei «Weiter» auch eine Zeile erwartet.
- Die Meldung «Angaben wiederhergestellt» ist klar: «Sie sind nur in diesem Browser aufbewahrt und noch nicht gespeichert.» Mit den Knöpfen «Angaben verwerfen» und «Meldung schliessen». Auf Mobile (390 px) passt sie ohne seitliches Scrollen (scrollWidth 390), Knöpfe untereinander.
- Ausserhalb der Assistenten zeigt nichts, dass ich etwas angefangen habe: Übersicht, Liste «Mietverträge» (weiter 11) und Liste «Nebenkostenabrechnungen» (weiter 17, 7 Entwurf) sind unverändert. Ich finde meine Angaben nur, wenn ich den Assistenten wieder öffne. Das passt zu «nur in diesem Browser», aber als Wiederkehrerin hätte ich sie ohne Zufall nicht gefunden.
- In einem anderen Browser (frische Sitzung) ist nichts da, keine Meldung. Das stimmt mit dem Text überein.
- Beim Verlassen und Zurückkommen gab es keine Nachfrage «Seite verlassen?», auch nicht über «Abbrechen». Während des ganzen Tests schickte die Seite keine einzige Anfrage ausser GET (keine Speicherung auf dem Server).
- Nach «Angaben verwerfen» steht der Assistent wieder leer auf Schritt 1 (Mietvertrag: «Mieter wählen»; Abrechnungen: Vorschlag 01.01.2025 – 31.12.2025 statt meiner 2024), die Meldung ist weg, der Fokus liegt auf der Schrittüberschrift. Die Anzahl Entwürfe auf der Übersicht blieb 7.
- Der Bestätigungsdialog hat einen roten Knopf «Angaben verwerfen» und «Abbrechen»; die Seite dahinter hat ebenfalls «Abbrechen» (bricht den Assistenten ab). Zwei «Abbrechen» mit verschiedener Wirkung.
- Die Schrittleiste bricht Wörter ohne Trennstrich mitten durch: «Vertragsda / uer», «Abrechnun / gsperiode», «Verwaltung / spauschale» (Desktop 1440).
- Im Mietvertrag-Assistenten erscheint nach Wahl eines Mieters mit laufendem Vertrag (Thomas Weber, Maria Rossi) ein Hinweis «… hat einen Mietvertrag ohne Vertragsende» mit Link. Nicht Teil der Aufgabe, aber verständlich.
- Ein ganzseitiger Screenshot mit offenem Dialog zeigte die Seite verschoben; das liegt an der Aufnahme, nicht an der App (im Zugänglichkeitsbaum war alles in Ordnung).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 12 Durchgänge. Pro Assistent etwa 4 Schritte bis zur Wahl, je 2 Arten zurückzukommen (über Navigation/Übersicht und Neu laden), dazu «Meldung schliessen», «Angaben verwerfen», «Abbrechen» und ein anderer Browser.

## Ablauf

1. **Übersicht öffnen.** Erwartet: einen Weg zum Mietvertrag. Gesehen: «Häufige Arbeiten» mit «Mietvertrag erfassen» und «Abrechnungen erstellen»; oben «Als Nächstes zu tun: Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick».
2. **«Mietvertrag erfassen».** Erwartet: ein Formular. Gesehen: «Neuer Mietvertrag», Schritt 1 von 5 «Mieter», Auswahl «Mieter wählen». Unter dem Assistenten noch keine Statuszeile.
3. **Mieter wählen (Thomas Weber, Luzern).** Erwartet: nichts Besonderes. Gesehen: sofort darunter «Noch nicht gespeichert: Dwello bewahrt Ihre Angaben nur in diesem Browser auf. Stand: 12:27». Gedanke: «Aha, es ist also noch nichts in Dwello, nur hier im Browser.»
4. **«Weiter», Wohnung wählen (OG2 – Alpenblick).** Gesehen: Statuszeile bleibt mit neuem Stand 12:28.
5. **Weggehen über «Übersicht» in der Seitenleiste.** Erwartet: vielleicht eine Frage «Wirklich verlassen?». Gesehen: keine Frage; Übersicht wie vorher, nichts von meinem angefangenen Vertrag.
6. **Zurück über «Mietvertrag erfassen».** Erwartet: entweder leer oder genau da, wo ich war. Gesehen: Meldung «Angaben wiederhergestellt – Ihre Angaben, zuletzt am 17.10.2026 um 12:28 bearbeitet, sind wieder da. Sie sind nur in diesem Browser aufbewahrt und noch nicht gespeichert.» Thomas Weber ist gewählt, aber ich bin auf Schritt 1, nicht auf Schritt 2 (P-3). Die Statuszeile unten fehlt jetzt (P-2). Screenshot `07-contract-return.png`: blaue Meldung oben, darunter Schrittleiste mit «1 Mieter» aktiv.
7. **Seite neu laden.** Gesehen: gleich wie 6.
8. **«Weiter».** Gesehen: Wohnung OG2 ist noch gewählt; die Meldung bleibt oben stehen. Erleichterung.
9. **Liste «Mietverträge».** Erwartet (befürchtet): ein halbfertiger Vertrag. Gesehen: weiter 11 Mietverträge, nichts Neues. Bestätigt: in Dwello ist nichts gespeichert.
10. **«Meldung schliessen».** Gesehen: Meldung weg, keine Statuszeile mehr, nur noch das Formular mit meinen Angaben (P-2). Nach erneutem Laden ist die Meldung wieder da.
11. **«Angaben verwerfen».** Erwartet: dass nur meine Eingabe weg ist. Gesehen: Dialog «Angaben verwerfen? Ihre Angaben werden gelöscht.» mit «Abbrechen» und rotem «Angaben verwerfen». «Gelöscht» hat mich kurz erschreckt: Was wird gelöscht? (P-1) Nach Bestätigen: leeres Formular, Liste weiter 11 Mietverträge.
12. **«Abbrechen» (Link unten) mit gewähltem Mieter.** Erwartet: Eingabe weg. Gesehen: Liste «Mietverträge»; beim erneuten Öffnen ist die Meldung «Angaben wiederhergestellt» mit Kevin Fischer wieder da (P-4).
13. **Anderer Browser.** Gesehen: kein Hinweis, leeres Formular. Passt zu «nur in diesem Browser».
14. **Übersicht → «Abrechnungen erstellen».** Gesehen: «Es entstehen Entwürfe, die Sie danach prüfen und versenden.» Schritt 1 mit vorgeschlagener Periode 01.01.2025 – 31.12.2025, keine Statuszeile.
15. **Vorschlag übernehmen, «Weiter».** Gesehen: Schritt 2 «Gebäude», noch keine Statuszeile.
16. **Alpenblick ankreuzen.** Gesehen: «Alle Gebäude» wird mit angekreuzt, «1 von 3 gewählt», die anderen zwei mit Erklärung «haben schon eine Abrechnung». Statuszeile «Noch nicht gespeichert … Stand: 12:29».
17. **Weggehen über «Nebenkostenabrechnungen».** Gesehen: Liste mit 17 Abrechnungen, 7 Entwurf, wie vorher. Keine neue Abrechnung. Gut.
18. **Zurück über «Abrechnungen erstellen» in der Liste.** Gesehen: Meldung «Angaben wiederhergestellt», diesmal direkt Schritt 2 mit Alpenblick angekreuzt. Statuszeile fehlt (P-2). Unterschied zum Mietvertrag (P-3).
19. **Neu laden.** Gesehen: gleich, Schritt 2.
20. **Neuer Versuch mit Periode 01.01.2024 – 31.12.2024.** Gesehen: Statuszeile erscheint sofort nach dem Tippen. Schritt 2: «lässt 3 Gebäude aus». Alpenblick trotzdem angekreuzt, über Adresszeile zur Übersicht gegangen: kein Hinweis dort. Zurück über «Häufige Arbeiten»: Schritt 2, «Zurück» zeigt meine Periode 2024.
21. **«Angaben verwerfen» bei den Abrechnungen.** Erwartet: dass ein Satz sagt, die bestehenden Entwürfe bleiben. Gesehen: derselbe Dialog «Ihre Angaben werden gelöscht.» (P-1). Nach Bestätigen: Schritt 1 mit Vorschlag 2025. Übersicht weiter «7 Entwurf».
22. **Mobile 390 × 844, Mietvertrag.** Gesehen: Meldung passt, Knöpfe untereinander, kein seitliches Scrollen (`31-mobile-contract-restored.png`).

**Was ich denke, was passiert ist:** In Dwello ist nichts gespeichert, weder ein Mietvertrag noch eine Abrechnung. Meine Angaben liegen nur in diesem Browser, auf diesem Computer. «Angaben verwerfen» löscht nur diese Eingaben; meine Entwürfe und Verträge bleiben. Das habe ich aber erst durch Nachschauen in den Listen sicher gewusst, nicht durch den Dialog.

## Verwirrung

- «Ihre Angaben werden gelöscht.» – «gelöscht» klingt endgültig und nach Daten in Dwello. Welche Angaben? Auch die Entwürfe?
- «Angaben» (meine Eingaben im Browser) neben «Entwürfe» (Abrechnungen in Dwello): Zwei Arten von «noch nicht fertig», die ich als Wiederkehrerin leicht verwechsle.
- «Abbrechen» behält die Angaben, «Angaben verwerfen» löscht sie. Ich hätte «Abbrechen» als «alles weg» verstanden.
- Warum beginnt der eine Assistent bei Schritt 1 und der andere dort, wo ich war?
- «in diesem Browser»: Ich weiss, was ein Browser ist, aber nicht, dass ein anderes Gerät oder ein privates Fenster nichts davon sieht. Steht so nicht da.

## Fehlerrisiken

- Ich traue mich wegen «gelöscht» nicht, «Angaben verwerfen» zu drücken, und arbeite stattdessen mit alten Angaben von vor Monaten weiter (z. B. einem Mieter oder einer Periode, die nicht mehr stimmt).
- Ich schliesse die Meldung, sehe danach keinen Hinweis mehr und halte die wiederhergestellten Angaben für gespeichert, z. B. denke ich, der Vertrag für OG2 sei schon erfasst (P-2).
- Beim Mietvertrag sehe ich auf Schritt 1 nur den Mieter und wähle in Schritt 2 eine andere Wohnung, ohne zu merken, dass vorher schon eine gewählt war (P-3).
- Nach «Abbrechen» denke ich, alles sei weg; Monate später erscheinen alte Angaben wieder (P-4).

## Vorschläge

- **P-1:** Mietvertrag erfassen oder Abrechnungen erstellen, etwas wählen, Seite neu laden, «Angaben verwerfen» drücken. Der Dialog zeigt «Ihre Angaben werden gelöscht.» Hilfreich: die echte Folge nennen, z. B. «Ihre Eingaben in diesem Browser werden entfernt. Bestehende Mietverträge und Abrechnungen in Dwello bleiben unverändert.» (bei den Abrechnungen: «… Ihre Entwürfe bleiben unverändert.»).
- **P-2:** Assistent öffnen, etwas wählen, neu laden. Unter dem Assistenten fehlt die Statuszeile; nach «Meldung schliessen» gibt es gar keinen Hinweis mehr. Hilfreich: die Statuszeile «Noch nicht gespeichert …» auch nach dem Wiederherstellen anzeigen, solange Angaben aufbewahrt sind.
- **P-3:** Mietvertrag erfassen, Mieter wählen, «Weiter», Wohnung wählen, neu laden. Der Assistent steht auf Schritt 1. Hilfreich: wie bei «Abrechnungen erstellen» auf dem zuletzt offenen Schritt weitermachen, oder in der Meldung sagen, was schon gewählt ist (Mieter und Wohnung).
- **P-4:** Mietvertrag erfassen, Mieter wählen, «Abbrechen» unten links, dann «Mietvertrag erfassen» wieder öffnen: die Angaben sind wieder da. Hilfreich: «Abbrechen» fragt, ob die Angaben verworfen oder aufbewahrt werden sollen, oder ein Satz bei «Abbrechen», dass die Angaben aufbewahrt bleiben.

## Nicht geprüft

- Schritte 3–5 beider Assistenten (Vertragsdauer, Miete, Heizprofil, Vorschau, Erstellen): Die Aufgabe verlangt nur Mieter/Wohnung bzw. Periode/Gebäude, und ich durfte nichts speichern.
- Wirklich «Monate später»: Ich konnte nur Minuten warten; ob Angaben nach langer Zeit noch da sind oder verfallen, sehe ich nicht.
- Was passiert, wenn der gewählte Mieter oder das Gebäude inzwischen gelöscht oder vermietet ist: hätte Daten ändern müssen, die nicht mir gehören.
- «Neuen Mieter erfassen» aus dem Assistenten heraus und zurück: hätte einen Mieter gespeichert.
- Abrechnungen-Assistent auf Mobile: nur der Mietvertrag-Assistent wurde auf 390 px angeschaut.
- Andere Sprachen: laufen nur allein.
