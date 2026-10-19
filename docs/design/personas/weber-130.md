# Persona-Review: Dr. Weber, Abgleich der Kategorien mit dem Vorjahr (#130)

Desktop 1440 × 900, Maus, Deutsch. Persona-App auf http://localhost:3300, Daten vom Aufrufer vorbereitet (Alpenblick: Hauswartung Keller GmbH 2024 zwölf Monatsrechnungen à CHF 150, 2025 vier Quartalsrechnungen à CHF 450). Nur angesehen, nichts gespeichert, keine Abrechnung erstellt. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/weber-130/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Nit | Abrechnungen erstellen, Schritt 4 «Vorschau» | Der Hauswart wird zu Recht nicht mehr gemeldet. Der Hinweis sagt aber nicht, welche Kategorien geprüft und für vollständig befunden wurden; dass Dwello den Wechsel auf Quartalsrechnungen erkannt hat, sieht man nur am Fehlen einer Meldung. |

## Beobachtungen

- Die beiden Meldungen sind unterschiedlich aufgebaut: «Kaminfeger: … Im Vorjahr: Kosten von CHF 290.00.» nennt einen Betrag, «Kaltwasser: Die Rechnung für das 2. Halbjahr fehlt. Im Vorjahr: 2 Rechnungen.» nur eine Anzahl. Für die fehlende Kaltwasser-Rechnung hätte ich gern den Vorjahresbetrag des 2. Halbjahres gesehen (CHF 475.00, den habe ich in der Rechnungsliste nachgeschlagen), um abzuschätzen, was den Mietern fehlen würde.
- «Rechnungen in der Abrechnungsperiode: Alpenblick 10 Rechnungen vom 31.03.2025 bis 31.12.2025»: Die Daten sind Rechnungsdaten. Auf den ersten Blick las ich das so, als fehlten Januar bis März. Die Quartalsrechnung vom 31.03.2025 deckt diese Monate aber ab.
- Der Satz «bestätigen Sie unten, dass alles stimmt» passt nicht ganz zur Checkbox «Die Abrechnungen trotzdem erstellen». Wenn ich weiss, dass die Kaltwasser-Rechnung für das 2. Halbjahr fehlt, stimmt eben nicht alles. Ich bestätige nur, dass ich trotzdem erstellen will. Die Checkbox ist ehrlicher als der Satz.
- Ohne Häkchen hält «Weiter» an: Die Checkbox wird als ungültig markiert, und darunter steht «Bestätigen Sie, dass die Abrechnungen trotzdem erstellt werden sollen.» Das finde ich richtig.
- Der Warnsatz «Fehlt eine Rechnung, fehlen ihre Kosten in jeder Abrechnung des Gebäudes. Später können Sie sie nur noch mit einer berichtigten Abrechnung und nicht in jedem Fall nachverlangen.» ist sachlich und benennt die Folge. Gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 7 Durchgänge. Durch den Assistenten bis zur Vorschau (Schritte 1 bis 4, je mit «Weiter», in Schritt 2 Alpenblick gewählt), dazu die Rechnungsliste mit dem Filter Alpenblick für 2025 und 2024 zum Nachrechnen.

## Ablauf

1. **Übersicht → «Abrechnungen erstellen».** Erwartet: Assistent mit Periode. Gesehen: Schritt 1 von 5, vorgeschlagen 01.01.2025 – 31.12.2025, mit Wochentag darunter. Passt.
2. **Schritt 2 «Gebäude».** Erwartet: Alpenblick wählbar. Gesehen: «Alpenblick … 10 Rechnungen in der Abrechnungsperiode, 3 Wohnungen». Alpenblick gewählt.
3. **Schritt 3 «Heizprofil und Verwaltungspauschale».** Unverändert übernommen (Heizung + Warmwasser, 3 %).
4. **Schritt 4 «Vorschau».** Erwartet: Hinweis zu Kaminfeger und Kaltwasser, die laut Aufgabe absichtlich fehlen, aber keine Meldung zum Hauswart. Gesehen: gelber Kasten «Möglicherweise fehlen Rechnungen» mit Vergleichszeitraum 01.01.2024 – 31.12.2024. Darin für Alpenblick genau zwei Punkte:
   - «Kaminfeger: Keine Rechnung in dieser Kategorie erfasst. Im Vorjahr: Kosten von CHF 290.00.»
   - «Kaltwasser: Die Rechnung für das 2. Halbjahr fehlt. Im Vorjahr: 2 Rechnungen.»
   Der **Hauswart wird nicht gemeldet.** Darunter «Rechnung erfassen» und die Checkbox «Die Abrechnungen trotzdem erstellen». Screenshot `08-hinweis.png`: Kasten mit Warnsymbol, Kategorienamen fett, Button «Rechnung erfassen» mit Rahmen.
5. **Nachgerechnet in «Rechnungen», Filter Alpenblick:**
   - 2024: 20 Rechnungen, davon Hauswart 01. bis 12.2024 je CHF 150.00, also CHF 1’800.00.
   - 2025: 10 Rechnungen, davon Hauswart Quartal 1 bis 4/2025 je CHF 450.00, also CHF 1’800.00.
   - Der Hauswart ist also vollständig, und das Schweigen der Prüfung ist richtig. Ein Rechnungssteller, der von monatlich auf vierteljährlich wechselt und das ganze Jahr abdeckt, darf keine Rückfrage auslösen. Die frühere Meldung «8 Monatsrechnungen fehlen» wäre schlicht falsch gewesen und hätte mich zu einer Suche nach Rechnungen verleitet, die es nicht gibt.
   - Weitere Kategorien: Kaltwasser 2024 H1 + H2, 2025 nur H1 (CHF 470.00), also richtig gemeldet. Kaminfeger 2024 CHF 290.00, 2025 keine, also richtig gemeldet. Schneeräumung (Januar bis März und Dezember in beiden Jahren), Allgemeinstrom (H1 + H2 in beiden Jahren) und Heizung (je eine Heizöl-Lieferung) sind vollständig und werden zu Recht nicht gemeldet.
6. **«Weiter» ohne Häkchen.** Erwartet: Sperre. Gesehen: Fehlermeldung an der Checkbox, Schritt 4 bleibt. Weiter bin ich nicht gegangen (nichts erstellen).

## Verwirrung

- Wurde der Hauswart überhaupt geprüft? Die Liste nennt nur Probleme. Als vorsichtiger Vermieter frage ich mich bei einer Kategorie, die mich im Vorjahr noch zwölf Rechnungen gekostet hat, ob Dwello sie übersehen oder geprüft und für gut befunden hat (P-1). Der Einleitungssatz «Dwello vergleicht jede Kategorie …» deutet Letzteres an. Er sagt aber nicht, dass ein Wechsel des Rhythmus berücksichtigt wird.
- «vom 31.03.2025 bis 31.12.2025» liest sich wie ein abgedeckter Zeitraum, gemeint sind Rechnungsdaten (siehe Beobachtungen).
- «… oder der Rechnungssteller rechnet anders ab»: Nach dieser Änderung ist das beim Hauswart gerade der Fall, nur ohne Meldung. Das ist stimmig, aber der Satz klingt so, als würde ein anderer Rhythmus eher gemeldet.

## Fehlerrisiken

- Kein falscher Alarm mehr beim Hauswart, also auch keine Gefahr, dass ich nach Phantom-Rechnungen suche oder die Warnung aus Gewohnheit wegklicke. Das senkt das Risiko, die echten Hinweise (Kaminfeger, Kaltwasser) zu übergehen. Gut.
- Restrisiko, nicht prüfbar: Wechselt ein Rechnungssteller auf Quartale und fehlt dann ein Quartal, wird das hoffentlich weiterhin gemeldet. Siehe «Nicht geprüft».
- Wer «bestätigen Sie unten, dass alles stimmt» wörtlich nimmt, setzt das Häkchen womöglich, obwohl er weiss, dass Kaltwasser H2 fehlt.

## Vorschläge

- **P-1:** Übersicht → «Abrechnungen erstellen» → Weiter → Alpenblick wählen → Weiter → Weiter → Vorschau, gelber Kasten. Hilfreich wäre ein kurzer Satz im Kasten, etwa «Andere Kategorien sind vollständig, auch wenn ein Rechnungssteller jetzt in anderen Abständen abrechnet (z. B. vierteljährlich statt monatlich).» Alternativ ein Satz, dass ein gleichbleibender Jahresbetrag in anderem Rhythmus nicht als Lücke gilt. Dann wüsste ich, dass das Schweigen beim Hauswart Absicht ist.

## Nicht geprüft

- Ob ein fehlendes Quartal nach dem Wechsel gemeldet wird (z. B. nur Q1 bis Q3 2025). Dafür hätte ich eine Rechnung löschen oder ändern müssen; die Aufgabe erlaubt nur Ansehen.
- Ob ein Wechsel mit deutlich anderem Jahresbetrag (z. B. 4 × CHF 300) gemeldet wird. Aus demselben Grund nicht geprüft.
- Schritt 5 «Erstellen» und das PDF: nicht erstellt, laut Aufgabe nichts speichern.
- Andere Gebäude, Mobilansicht und andere Sprachen: nicht Teil der Aufgabe.
