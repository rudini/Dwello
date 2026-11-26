# Helga – Einstellung «Kein Tank oder Tank stillgelegt» und Lieferung von Heizmaterial (#1480)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (Hilfetext auch bei 200 %), Maus. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/c886409d-428b-57e9-8b50-0b7fc9169d0e/scratchpad/helga-1480/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Gebäude bearbeiten (Alpenblick) und Gebäudeseite, Abschnitt «Tankbestand» | Ich weiss nicht, ob ich das Häkchen setzen soll, wenn ich auf Pellets umstelle. Der Hilfetext beim Häkchen sagt: nach der Stilllegung zählen «Pellets oder Holz aus einem Lager» nach Liefertag. Auf der Gebäudeseite steht beim Tankbestand aber: «Nur für Gebäude, die mit Öl, Flüssiggas, Pellets oder Holz heizen». Mit Pellets im eigenen Keller müsste ich also weiter einen Tankbestand erfassen? Die zwei Texte widersprechen sich für meinen Fall. |
| P-2 | Minor | Gebäude bearbeiten | «Lager» hat im Hilfetext zwei Bedeutungen: «der Tank oder das Lager für Heizmaterial stillgelegt» meint meinen Keller, «Pellets oder Holz aus einem Lager» klingt nach dem Lager vom Händler. Mein Nachbar sagte «aus einem Laden». Ich bin unsicher, welches Lager gemeint ist. |
| P-3 | Minor | Gebäude bearbeiten | «zählt jede Lieferung über die ganze Abrechnungsperiode ihres Liefertags» musste ich dreimal lesen. Erst mit dem Beispiel auf der Rechnung habe ich verstanden: Eine Lieferung im Oktober 2025 kommt ganz in die Abrechnung 2025. Ein Beispiel mit Datum direkt beim Häkchen würde helfen. |
| P-4 | Minor | Gebäude bearbeiten | «Im Jahr der Stilllegung erfassen Sie zuerst auf der Seite des Gebäudes den Endbestand …»: Ich bin ja schon «auf der Seite des Gebäudes» (die Adresse oben bleibt gleich, die Überschrift heisst «Gebäude bearbeiten»). Auf dieser Seite gibt es aber kein Feld dafür, und ich sehe nicht, ob der Endbestand schon erfasst ist. Ich müsste abbrechen und den Abschnitt «Tankbestand» weiter unten auf der Gebäudeseite suchen; der Text sagt nicht, wo genau. |
| P-5 | Minor | Rechnung «Pellets Zentralschweiz AG» (Seepark Residenz) | «Zählt als Lieferung von Heizmaterial: Sie gilt für die ganze Abrechnungsperiode …»: Das grosse «Sie» nach dem Doppelpunkt habe ich zuerst als mich gelesen («Sie», die Vermieterin). Gemeint ist die Lieferung. Ausserdem steht nicht, welche Periode: «01.01.2025 – 31.12.2025» stünde ja gleich darüber im gelben Kasten, hier fehlt sie. |

## Beobachtungen

- Das Häkchen ist leicht zu finden: unter «Weitere Angaben», nach Gebäudetyp und Baujahr. Bei 150 % und 200 % gut lesbar, das Kästchen ist gross genug, und der Klick auf den Text trifft es auch (Beschriftung 48 px hoch).
- Wann ankreuzen ist für die einfachen Fälle klar: Fernwärme, Gas aus der Leitung, Wärmepumpe, oder Tank stillgelegt. Dass Dwello dann nicht mehr nach dem Tankbestand fragt, verstehe ich.
- Dass ich im Jahr der Stilllegung zuerst den Endbestand erfassen muss, «auch wenn er 0 ist», verstehe ich. Unklar bleibt mir: Wird der Tank im Jahr 2026 stillgelegt, ist das der Wert per 31.12.2026, ein Tag, der noch nicht war (heute ist der 26.11.2026). Darf ich den schon jetzt eintragen, oder muss ich bis Ende Jahr warten und erst dann das Häkchen setzen? Nicht ausprobiert, weil ich nicht speichern durfte.
- Was nach dem Häkchen mit dem Abschnitt «Tankbestand» auf der Gebäudeseite und den alten Werten (31.12.2023 bis 31.12.2025 bei Alpenblick) passiert, sagt der Text nicht.
- «Gebäude bearbeiten» öffnet sich unter derselben Adresse wie die Gebäudeseite. Für mich sah es aus wie eine neue Seite.
- Auf der Rechnung steht der Leistungszeitraum als «05.10.2025 – 05.10.2025». Ein Tag als Bereich wirkt seltsam; «05.10.2025 (Liefertag)» wäre klarer.
- Der Satz auf der Rechnung «Für dieses Gebäude ist kein Tankbestand erfasst; abgerechnet wird der Einkauf» ist verständlich. Den Hinweis zur Reinigung des Ofens als längeren Leistungszeitraum finde ich hilfreich.
- Die Pellet-Rechnung hat die andere Persona heute erfasst (Erfasst 26.11.2026, 21:05). In der Datenbank ist bei Seepark Residenz «kein Tank» gesetzt (nur gelesen). Der gelbe Kasten «Abrechnungen nicht aktuell» mit dem Text über Verjährung steht über allem und ist lang. Für meine Frage war er nicht wichtig, er schiebt die Erklärung aber nach unten.

## Aufgabe geschafft: teilweise

Einstellung gefunden und Hilfetext gelesen; die Erklärung auf der Pellet-Rechnung verstanden. Ob ich bei Pellets im eigenen Keller das Häkchen setzen soll, weiss ich aber nicht (P-1).

## Aufwand

Etwa 12 Minuten, 9 Schritte: Übersicht → Gebäude → Alpenblick → Bearbeiten → Hilfetext lesen (150 % und 200 %) → Abschnitt Tankbestand auf der Gebäudeseite gelesen → Seepark Residenz → Rechnungen ansehen → Pellet-Rechnung geöffnet.

## Ablauf

- Hilfetext beim Häkchen. Erwartet: eine klare Antwort, ob ich bei Pellets ankreuzen soll. Gesehen: Pellets «aus einem Lager» zählen nach Liefertag, aber auf der Gebäudeseite stehen Pellets ausdrücklich beim Tankbestand (P-1, P-2).
- «auf der Seite des Gebäudes den Endbestand». Erwartet: ein Feld oder einen Link hier. Gesehen: nichts auf der Bearbeiten-Seite; das Feld steht im Abschnitt «Tankbestand» der Gebäudeseite (P-4).
- Erklärung auf der Rechnung. Erwartet: «wird in der Abrechnung 2025 abgerechnet». Gesehen: «Sie gilt für die ganze Abrechnungsperiode ihres Liefertags», ohne Jahr (P-5).

## Vorschläge

- **P-1:** Gebäude → Alpenblick: Abschnitt «Tankbestand» lesen, dann «Bearbeiten» und den Hilfetext beim Häkchen lesen. Hilfe: Beide Texte sagen dasselbe, z. B. beim Häkchen: «Lagern Sie Pellets oder Holz weiterhin bei sich und erfassen den Bestand, setzen Sie das Häkchen nicht. Setzen Sie es, wenn Sie keinen Bestand mehr erfassen; dann wird jede Lieferung ganz im Jahr ihres Liefertags abgerechnet.» Und beim Tankbestand: «Ohne Bestand: Häkchen «Kein Tank oder Tank stillgelegt» beim Bearbeiten setzen.»
- **P-2:** Bearbeiten → Hilfetext. Hilfe: «aus einem Lager» streichen oder «vom Händler» schreiben; «Lager» nur für den eigenen Raum verwenden.
- **P-3:** Bearbeiten → Hilfetext. Hilfe: ein Beispiel, z. B. «Beispiel: Eine Lieferung vom 05.10.2025 wird ganz in der Abrechnung 2025 abgerechnet.»
- **P-4:** Bearbeiten → Hilfetext. Hilfe: «im Abschnitt «Tankbestand» auf der Seite des Gebäudes (nach «Abbrechen»)», oder den letzten erfassten Bestand beim Häkchen anzeigen.
- **P-5:** Seepark Residenz → Rechnungen ansehen → «Pellets Zentralschweiz AG» → Leistungszeitraum. Hilfe: «Die Lieferung zählt ganz zur Abrechnungsperiode 01.01.2025 – 31.12.2025, in der ihr Liefertag liegt.»

## Nicht geprüft

- Speichern mit Häkchen und was danach mit dem Abschnitt «Tankbestand» und mit den Abrechnungen geschieht: Aufgabe sagte, nichts zu speichern.
- Ob ein Endbestand per 31.12.2026 heute schon erfasst werden kann: hätte gespeichert.
- Andere Rechnungen mit Liefertag: auf Seite 1 der Rechnungen von Seepark Residenz gab es nur die Pellet-Rechnung; Seite 2 (ältere Rechnungen, 2024 und früher) habe ich nicht geöffnet.
