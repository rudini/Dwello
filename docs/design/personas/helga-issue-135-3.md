# Persona-Lauf: Helga, Issue #135, Runde 3 (überarbeitete Hinweistexte in Schritt 2 «Gebäude»)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus. Ich habe nur geschaut und nichts gespeichert.
Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-135-3/` (`r1.mjs`, `r2.mjs`, `r3.mjs`; Screenshots `z150-01` bis `z150-04`, `z200-03`).

P-6 und P-7 aus Runde 2 sind offene Arbeit in #199 und #201. Ich bewerte sie hier nicht noch einmal.

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-8 | Nit | Abrechnungen erstellen, Schritt 2 «Gebäude» | Im ersten Satz stehen zwei Wörter für dieselbe Sache: «… in dieser Abrechnungsperiode haben schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt.» Beim ersten Lesen habe ich kurz überlegt, ob mit «diesen Zeitraum» etwas anderes gemeint ist, etwa die Laufzeit des Mietvertrags. Beim zweiten Lesen war klar: Gemeint ist die Abrechnungsperiode. |

## Beobachtungen

- Die neue Fassung «Alle Mietverträge in dieser Abrechnungsperiode» verstehe ich besser als «… dieses Gebäudes» aus Runde 2. Ich lese daraus: Es geht um die Mieter, die in dieser Zeit da waren, und nicht um frühere. Dass «3 Wohnungen» daneben steht, stört mich nicht.
- Die Hinweise sind wie in Runde 2 fett und schwarz und stehen in einem eigenen Absatz unter «… Rechnungen in der Abrechnungsperiode». Bei 150 % brechen sie in drei Zeilen um, bei 200 % in mehr Zeilen. Sie bleiben gut lesbar, und es gibt kein seitliches Scrollen: Die Seitenbreite ist gleich der Fensterbreite (960 bei 150 %, 720 bei 200 %).
- Die Bedienungshilfe des Browsers liefert den Hinweis jetzt als Beschreibung der jeweiligen Checkbox, bei Seepark Residenz und Musterhaus Zentrum. In der vereinfachten Baumansicht taucht er deshalb nicht mehr als eigener Absatz auf. Mit der Maus macht das für mich keinen Unterschied. Wie ein Bildschirmleser den Hinweis vorliest, kann ich nicht beurteilen.
- Bei 2024 haben alle drei Gebäude den Hinweis, die Seite ist dann recht fettlastig (wie in Runde 2 bei der verschobenen Periode).
- «Entwurf gespeichert, 15:09» erscheint nach dem Zurückgehen und erneutem Weiter, wie in den früheren Runden. Das ist nicht Teil dieser Änderung.
- In den Ganzseiten-Screenshots steht der fixierte Kopf «Dwello» mitten in der Seite. Das liegt am Screenshot, beim Scrollen überlappt nichts.

## Aufgabe geschafft: ja

Ich habe Schritt 2 mit 2025 und mit 2024 angesehen, bei 150 % und für 2025 auch bei 200 %.

## Aufwand

Etwa 6 Minuten. Ein Durchgang mit 7 Schritten: Nebenkostenabrechnungen, «Abrechnungen erstellen», Weiter, Zurück, Periode auf 01.01.2024–31.12.2024 ändern, Weiter. Dazu ein kurzer zweiter Durchgang bei 200 %.

## Ablauf

1. **Nebenkostenabrechnungen.** Erwartet: die Liste mit dem Knopf «Abrechnungen erstellen». Gesehen (Screenshot `z150-01`): Der Knopf steht oben rechts. Die Liste zeigt 2025er-Abrechnungen für Seepark Residenz und Musterhaus Zentrum und 2024er für Alpenblick.
2. **«Abrechnungen erstellen».** Erwartet: Schritt 1 mit vorgeschlagener Periode. Gesehen (Screenshot `z150-02`): 01.01.2025 bis 31.12.2025 ist vorausgefüllt.
3. **Weiter, Schritt 2 mit 2025.** Erwartet: Alpenblick hat keinen Hinweis, die beiden anderen Gebäude haben den neuen Text. Gesehen (Screenshot `z150-03`): genau so. Bei Seepark Residenz und Musterhaus Zentrum steht fett: «Alle Mietverträge in dieser Abrechnungsperiode haben schon eine Abrechnung, die diesen Zeitraum ganz oder teilweise abdeckt. Für dieses Gebäude entsteht keine neue Abrechnung. Sie müssen es nicht wählen.» Ich verstehe: nur Alpenblick ankreuzen. Kleines Stolpern bei «diesen Zeitraum» (P-8).
4. **Zurück, Periode 01.01.2024 bis 31.12.2024, Weiter.** Erwartet: Mindestens Alpenblick hat jetzt den Hinweis, weil es dafür bezahlte Abrechnungen 2024 gibt. Gesehen (Screenshot `z150-04`): Alle drei Gebäude haben denselben Hinweis. Für mich heisst das: 2024 ist überall erledigt. Der Text passt zu dem, was ich in der Liste gesehen habe.
5. **Schritt 2 mit 2025 bei 200 %** (Screenshot `z200-03`). Gleicher Inhalt, längerer Umbruch, gut lesbar, kein seitliches Scrollen.

## Verwirrung

- «diesen Zeitraum» direkt nach «Abrechnungsperiode»: Ich habe kurz gezögert, ob das zwei verschiedene Dinge sind (P-8).
- «Mietverträge in dieser Abrechnungsperiode» ist für mich klar: die Verträge, die in dieser Zeit liefen.
- Neue Fachbegriffe kommen nicht dazu.

## Fehlerrisiken

- Durch die neue Formulierung sehe ich kein neues Risiko. Der Text sagt klar, dass für das Gebäude keine neue Abrechnung entsteht und dass ich es nicht wählen muss.

## Vorschläge

- **P-8:** Den Assistenten öffnen, Schritt 1 mit 2025 lassen, Weiter. Bei Seepark Residenz steht «… in dieser Abrechnungsperiode … die diesen Zeitraum ganz oder teilweise abdeckt.» Geholfen hätte mir dasselbe Wort an beiden Stellen, etwa «… eine Abrechnung, die diese Abrechnungsperiode ganz oder teilweise abdeckt.» Oder kürzer: «… die sie ganz oder teilweise abdeckt.»

## Nicht geprüft

- **Die Form für einen einzelnen Mietvertrag («Der einzige Mietvertrag in dieser Abrechnungsperiode …») und die Teilform («Von {total} Mietverträgen in dieser Abrechnungsperiode hat/haben {billed} …»):** In den Demodaten haben bei 2025 und 2024 alle Mietverträge eines Gebäudes entweder eine Abrechnung oder keine. Einen anderen Zustand kann ich nur durch Speichern herstellen, und Speichern war in dieser Runde nicht erlaubt. Deshalb kann ich nicht beurteilen, ob «hat/haben» richtig gebeugt wird und ob die Teilform verständlich ist.
- **Schritte 3 bis 5:** nicht Teil dieser Runde.
