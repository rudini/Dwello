# Persona-Review Sven, Issue #135, Runde 2: Schritt 2 «Gebäude» im Assistenten «Abrechnungen erstellen»

Persona: Sven, 45, blind, Screenreader und nur Tastatur. Desktop 1440 × 900, Zoom 100 %. Beurteilt nach dem Accessibility-Tree von Chromium (zugänglicher Name, Beschreibung, Zustand des fokussierten Elements) und nach der Tab-Reihenfolge.
App: Persona-App http://localhost:3300 mit Demodaten. Ich habe nichts gewählt und nichts gespeichert.
Runde 1: `docs/design/personas/sven-issue-135.md`. P-2 aus Runde 1 (kein Lade- und Fehlerzustand) ist offene Arbeit O-25 und wird hier nicht neu bewertet.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/sven-issue-135-2/` (`r1.mjs`, `01-schritt1.png`, `02-schritt2.png`).

## Befunde (nur die Änderung)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 (Runde 1) | behoben | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der Hinweis zu bestehenden Abrechnungen steckt nicht mehr im zugänglichen Namen der Checkbox, sondern kommt als Beschreibung. Der Name enthält ihn nicht mehr, und die Beschreibung folgt nach einer Pause. |
| P-3 | Nit | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der neue Schlusssatz «Sie müssen es nicht wählen.» sagt nicht, was passiert, wenn ich das Gebäude trotzdem wähle (zum Beispiel über «Alle Gebäude»). Beim Hören bleibt offen, ob das schadet oder einfach nichts bewirkt. |

## Beobachtungen

- Positiv: Die Beschreibung ist nur bei den betroffenen Gebäuden da (Seepark Residenz, Musterhaus Zentrum). Alpenblick hat keine Beschreibung. Der Satz ist vorwärts (Tab) und rückwärts (Shift+Tab) gleich angesagt.
- Positiv: Der neue Text ist klarer als in Runde 1. «Für dieses Gebäude entsteht keine neue Abrechnung.» nennt jetzt ausdrücklich die Abrechnung; meine Unsicherheit aus Runde 1 («keine neue» was?) ist weg. Die Zahl der Mietverträge fehlt jetzt; damit fällt auch das Durcheinander «4 Mietverträge» / «6 Wohnungen» weg.
- Der zugängliche Name ist immer noch lang (rund 100 Zeichen): Gebäudename, Adresse, Rechnungszahl und Wohnungszahl am Stück, ohne Satzzeichen dazwischen, z. B. «Seepark Residenz Seeweg 15, 6003 Luzern 15 Rechnungen in der Abrechnungsperiode 4 Wohnungen». Das war schon vor der Änderung so (Runde 1, Alpenblick) und betrifft alle Gebäude. Mein Vorschlag aus Runde 1, auch Rechnungs- und Wohnungszahl in die Beschreibung zu nehmen, ist nicht umgesetzt. Der Hinweis kommt deshalb erst nach rund 15 Wörtern Name.
- Im Accessibility-Tree steht nach jeder Checkbox der ganze Label-Text noch einmal als Text-Knoten, und danach der Hinweis als eigener Absatz. Im Lesemodus höre ich den Hinweis also einmal als Absatz, im Formularmodus als Beschreibung; das ist üblich und in Ordnung. Die Verdoppelung des Label-Texts bestand schon in Runde 1.
- Das Gebäude «Anna Testhaus 2» (0 Wohnungen, «Keine Rechnungen in der Abrechnungsperiode erfasst») stammt von einer anderen Persona; nicht gezählt.
- Beim Laden von `/statements/generate` steht der Fokus wieder auf dem Dokument (Fokus «none»), nicht auf der Überschrift. Wie in Runde 1, nicht Teil der Änderung.
- Visuell (Screenshot `02-schritt2.png`): Der Hinweis steht fett unter der Rechnungszahl in der Karte. In der Schrittleiste sind die Wörter weiterhin mitten im Wort umgebrochen («Abrechnun / gsperiode», «Verwaltung / spauschale»), wie in Runde 1. Im ganzseitigen Screenshot liegt die Brotkrümelnavigation über der Kopfzeile; vermutlich ein Effekt der Ganzseiten-Aufnahme mit fester Kopfzeile, für mich nicht hörbar.

## Aufgabe geschafft

Ja. Nur mit der Tastatur von der Übersicht in Schritt 2 gelangt (vorgeschlagene Abrechnungsperiode 01.01.2025 bis 31.12.2025) und alle Gebäude-Checkboxen vorwärts und rückwärts abgehört.

## Aufwand

Etwa 5 Minuten, 2 Durchläufe. Von der Übersicht bis Schritt 2: 15 Tabs bis «Abrechnungen erstellen», Enter, 20 Tabs in Schritt 1 bis «Weiter», Enter. Danach 6 Tabs vorwärts und 6 rückwärts in Schritt 2.

## Ablauf

1. **Übersicht, Tab bis «Abrechnungen erstellen».** Erwartet: Link mit diesem Namen. Gesehen: Link «Abrechnungen erstellen» nach 15 Tabs, Enter öffnet «Abrechnungen erstellen - Dwello».
2. **Schritt 1.** Erwartet: vorgeschlagene Abrechnungsperiode 2025. Gesehen: textbox «Beginn», Beschreibung «… Mittwoch, 1. Januar 2025»; textbox «Ende», Beschreibung «… Mittwoch, 31. Dezember 2025». Tab bis «Weiter», Enter.
3. **Schritt 2, Fokus.** Erwartet: Überschrift des Schritts. Gesehen: heading «Schritt 2 von 5: Gebäude».
4. **Tab auf «Alle Gebäude».** Gesehen: checkbox «Alle Gebäude», nicht angekreuzt, keine Beschreibung.
5. **Tab auf Alpenblick.** Erwartet: kein Hinweis. Gesehen: checkbox «Alpenblick Bergstrasse 8, 3800 Interlaken 6 Rechnungen in der Abrechnungsperiode 3 Wohnungen», keine Beschreibung. Stimmt.
6. **Tab auf Seepark Residenz.** Erwartet: Name ohne den Hinweis, Hinweis als Beschreibung. Gesehen: Name «Seepark Residenz Seeweg 15, 6003 Luzern 15 Rechnungen in der Abrechnungsperiode 4 Wohnungen»; Beschreibung «Alle Mietverträge dieses Gebäudes haben schon eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen.»; nicht angekreuzt. Die Checkbox verweist über `aria-describedby` auf genau diesen sichtbaren Absatz. P-1 ist damit behoben.
7. **Tab auf Musterhaus Zentrum.** Gesehen: Name «Musterhaus Zentrum Bahnhofstrasse 42, 8001 Zürich 19 Rechnungen in der Abrechnungsperiode 6 Wohnungen», gleiche Beschreibung wie bei Seepark Residenz.
8. **Tab weiter.** Gesehen: button «Zurück». Reihenfolge stimmt.
9. **Shift+Tab zurück bis zur Schrittleiste.** Gleiche Namen und Beschreibungen in umgekehrter Reihenfolge, danach button «Abrechnungsperiode (erledigt)».

Screenshots: `01-schritt1.png` (Schritt 1 mit 2025), `02-schritt2.png` (Schritt 2: Karten Seepark Residenz und Musterhaus Zentrum mit dem dreizeiligen fetten Hinweis unter der Rechnungszahl, Alpenblick ohne Hinweis).

## Verwirrung

- «… die diese Abrechnungsperiode ganz oder teilweise abdeckt»: verständlich. Ich verstehe daraus, dass auch eine Abrechnung über einen Teil des Jahres zählt.
- «Sie müssen es nicht wählen.»: Beim ersten Hören habe ich mich gefragt, ob ich es wählen darf und was dann geschieht (siehe P-3).

## Fehlerrisiken

- Wer den Namen nach dem Gebäudenamen abbricht (das mache ich oft), hört die Beschreibung trotzdem nicht, weil sie erst nach dem ganzen langen Namen kommt. Mit der Beschreibung ist es aber besser als in Runde 1: Der Screenreader liest sie nach einer Pause, und ich kann sie gezielt abfragen.
- Wer «Alle Gebäude» ankreuzt, wählt auch die beiden Gebäude, bei denen keine neue Abrechnung entsteht. Ob das ein Problem ist, sagt der Hinweis nicht.

## Vorschläge

- **P-1 (Runde 1):** behoben, kein Vorschlag. Weiterhin hilfreich, aber nicht Teil dieser Änderung: Name auf Gebäudename und Adresse kürzen, Rechnungs- und Wohnungszahl als eigene Sätze in die Beschreibung, den Hinweis zu bestehenden Abrechnungen dort zuerst.
- **P-3:** Reproduktion: Übersicht › «Abrechnungen erstellen» › Schritt 1 mit 2025 › «Weiter» › Tab bis «Seepark Residenz», Beschreibung anhören. Hilfreich: den letzten Satz so fassen, dass er die Folge einer Wahl nennt, etwa «Wenn Sie es wählen, wird dafür nichts erstellt.» statt «Sie müssen es nicht wählen.».

## Nicht geprüft

- Einen echten Screenreader (NVDA, VoiceOver) habe ich nicht benutzt; beurteilt nach dem Accessibility-Tree von Chromium.
- Wählen eines betroffenen Gebäudes und die Schritte 3 bis 5: Der Auftrag sagte, nichts zu speichern, und der Assistent speichert beim Wählen einen Entwurf (Runde 1).
- Ein Gebäude, bei dem nur ein Teil der Mietverträge schon eine Abrechnung hat: Die Demodaten von 2025 haben keines.
- Lade- und Fehlerzustand: P-2 aus Runde 1 ist offene Arbeit O-25 und laut Auftrag nicht zu bewerten.
