# Persona Anna – Issue #142: Warnung «Abrechnungen fehlen» auf dem Mietvertrag

Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück. Desktop 1440 × 900, Maus; ein Bildschirm zusätzlich auf Mobile 390 × 844. Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/anna-issue-142/`.

Aufgabe: Nach langer Pause herausfinden, was bei meinen Mietern noch offen ist; die Mietverträge von Hans Müller (Musterhaus Zentrum) und Laura Keller (Alpenblick) öffnen, die neue Warnung beurteilen und einem Button folgen, ohne etwas zu speichern.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Hans Müller, Mietvertrag Laura Keller | Alte Jahre (2021–2023) stehen gleich dringend da wie 2025. Es gibt keinen Hinweis und keine Möglichkeit für den Fall, dass ich diese Jahre schon ausserhalb von Dwello abgerechnet habe. Die Warnung bleibt also für immer stehen, oder ich erstelle doppelte Abrechnungen mit CHF 0.00 Kosten. |
| P-2 | Minor | Übersicht und Mietvertrag Hans Müller | Die Übersicht sagt, nur Alpenblick 2025 sei noch nicht abgerechnet. Auf dem Mietvertrag von Hans Müller steht dagegen «3 Abrechnungen fehlen». Ich weiss nicht, welcher Seite ich glauben soll. |
| P-3 | Minor | Mietvertrag, Warnung | Die Warnung sagt «eine Periode nach der anderen», zeigt die Jahre aber vom neusten zum ältesten (2023, 2022, 2021). Mit welchem Jahr soll ich anfangen? |
| P-4 | Minor | Mietvertrag → Assistent | Der Button steht auf dem Mietvertrag einer einzelnen Mieterin. Der Assistent erstellt aber die Abrechnungen für das ganze Gebäude: In der Vorschau 2021 für Musterhaus Zentrum stehen 3 Abrechnungen, auch eine für Kevin Fischer, der ausgezogen ist. Das sagt die Warnung nicht. |
| P-5 | Nit | Mietvertrag, Warnung | Bei angebrochenen Jahren steht nicht, dass nur ein Teil des Jahres betroffen ist. Bei Hans Müller gilt 2021 erst ab 01.03., bei Laura Keller 2022 nur für November und Dezember. «Abrechnung 2022 erstellen» klingt nach einem ganzen Jahr. |

## Beobachtungen

- In der Liste der Mietverträge sehe ich nirgends, dass Abrechnungen fehlen. Erst wenn ich einen Mietvertrag einzeln öffne, kommt die Warnung. Wenn ich nach Monaten wissen will, was offen ist, müsste ich jeden Mietvertrag einzeln anklicken.
- Der Titel «3 Abrechnungen fehlen» ist im Bedienungsbaum nur ein Absatz und keine Überschrift. Für mich ist das egal, für Screenreader-Nutzer wohl nicht (für Sven).
- Der Assistent springt direkt zu Schritt 3. Das ist praktisch, weil Gebäude und Periode schon gewählt sind (Zeile «Gewählt: Alpenblick, Abrechnungsperiode 01.01.2025 – 31.12.2025»).
- Der Hilfetext zum Heizprofil in Schritt 3 ist ein sehr langer Absatz. Ich habe ihn nicht zu Ende gelesen.
- Die Verwaltungspauschale ist auf 3 % vorbelegt. Ich weiss nicht mehr, ob das in meinen Mietverträgen steht.
- Die Vorschau 2021 warnt gut: «Rechnungen fehlen» (CHF 0.00 Kosten, Rückerstattung CHF 2’400.00 an Hans Müller) und «Möglicherweise fehlen Rechnungen» (Tankbestand). Ohne diese Warnungen hätte ich alte Jahre leicht falsch abgerechnet.
- Auf Mobile (390 px) stehen die drei Buttons untereinander, nichts scrollt seitwärts (scrollWidth 390).

## Aufgabe geschafft: teilweise

Ich sehe jetzt, welche Jahre in Dwello fehlen. Was davon *wirklich* noch zu tun ist, kann ich aber nicht erkennen: 2025 bei Laura Keller ja, die Jahre 2021–2023 wahrscheinlich nicht, weil ich damals noch nicht mit Dwello gearbeitet habe.

## Aufwand

Etwa 15 Minuten, 9 Schritte: Übersicht, Liste der Mietverträge, Mietvertrag Müller, Mietvertrag Keller, Assistent 2025 (Keller), Assistent 2021 (Müller) bis zur Vorschau, Abrechnungen von Keller, Mobile-Ansicht.

## Ablauf

1. **Übersicht** (`01-dashboard.png`). Erwartet: eine Liste, was offen ist. Gesehen: «Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick» für 2025 und «7 Nebenkostenabrechnungen sind noch im Entwurf». Von alten Jahren steht hier nichts. Ich habe angenommen, dass bei Musterhaus Zentrum alles erledigt ist.
2. **Liste der Mietverträge** (`02-vertraege.png`). Erwartet: ein Zeichen bei Mietverträgen mit offenen Punkten. Gesehen: 11 Mietverträge, jeweils mit Status und Miete, aber ohne Hinweis auf fehlende Abrechnungen.
3. **Mietvertrag Hans Müller** (`03-mueller.png`). Erwartet: alles erledigt, wie es die Übersicht nahelegte. Gesehen: ein gelber Kasten mit Warndreieck direkt unter dem Titel: «3 Abrechnungen fehlen. Der Mietvertrag hat Mietstage in diesen Abrechnungsperioden, aber noch keine Nebenkostenabrechnung. Erstellen Sie sie im Assistenten, eine Periode nach der anderen.» Darunter drei Buttons: «Abrechnung 2023 erstellen», «2022», «2021». Erster Gedanke: Erschrecken, ich habe drei Jahre lang nicht abgerechnet? Zweiter Gedanke: Doch, das habe ich, damals auf Papier mit einer Vorlage. Dwello weiss das nicht, und ich finde keinen Weg, es Dwello zu sagen. 2024 und 2025 fehlen in der Liste. Daran merke ich, dass die Warnung nur das zeigt, was nicht in Dwello ist.
4. **Mietvertrag Laura Keller** (`04-keller.png`). Gesehen: wieder «3 Abrechnungen fehlen», diesmal mit 2025, 2023 und 2022. 2025 kenne ich aus der Übersicht, das ist wirklich offen. 2023 und 2022 sehen genau gleich aus. Ich kann das Dringende nicht vom Alten unterscheiden. Laura ist erst am 01.11.2022 eingezogen, für 2022 sind es also zwei Monate. Das steht nicht da.
5. **Button «Abrechnung 2025 erstellen» bei Keller** (`05-wizard-keller-2025.png`). Erwartet: ein Assistent für Laura Keller 2025. Gesehen: «Abrechnungen erstellen», Schritt 3 von 5, «Gewählt: Alpenblick, Abrechnungsperiode 01.01.2025 – 31.12.2025». Es geht also um das ganze Gebäude. Gut, dass Gebäude und Periode schon ausgefüllt sind.
6. **Button «Abrechnung 2021 erstellen» bei Müller, dann «Weiter» zur Vorschau** (`06-wizard-mueller-2021.png`, `07-vorschau-mueller-2021.png`). In der Vorschau wird nur gerechnet, es wird nichts gespeichert. «Erstellen» habe ich nicht gedrückt. Gesehen: 3 Abrechnungen (Hans Müller, Maria Rossi, Kevin Fischer), Kosten CHF 0.00, «Rechnungen fehlen … Für Musterhaus Zentrum sind in der Abrechnungsperiode keine Rechnungen erfasst», Rückerstattung an Hans Müller CHF 2’400.00. Darunter der Button «Die Abrechnungen trotzdem erstellen». Hier wird mir klar: Wäre ich dem Button auf dem Mietvertrag einfach gefolgt, um die Warnung loszuwerden, hätte ich fast eine falsche Abrechnung erstellt.
7. **«Nebenkostenabrechnungen» bei Keller (Dazu gehört)** (`09-keller-abrechnungen.png`). Gesehen: nur die Abrechnung 2024 (bezahlt). Das passt zur Warnung.
8. **Keller auf Mobile** (`08-keller-mobile.png`). Gesehen: Die Warnung steht oben, die drei Buttons in voller Breite untereinander. Gut lesbar.

## Verwirrung

- «Mietstage»: Ich verstehe es ungefähr als Tage, an denen jemand gemietet hat. Erklärt wird es nicht.
- «fehlen» klingt wie ein Fehler, den ich gemacht habe. Gemeint ist aber «in Dwello nicht vorhanden».
- Die Übersicht und der Mietvertrag widersprechen sich (P-2).
- Ich weiss nicht, in welcher Reihenfolge ich die Jahre abarbeiten soll (P-3).
- Ich dachte, ich erstelle die Abrechnung für eine Mieterin. Es entstehen aber Abrechnungen für das ganze Gebäude (P-4).

## Fehlerrisiken

- Ich folge dem Button nur, damit die Warnung verschwindet, und erstelle für schon abgerechnete Jahre doppelte Abrechnungen mit CHF 0.00 Kosten und hohen Rückerstattungen (P-1). Die Vorschau warnt zwar, aber «Die Abrechnungen trotzdem erstellen» ist einen Klick entfernt.
- Ich gewöhne mich an den gelben Kasten, der nie verschwindet, und übersehe dann das wirklich offene Jahr 2025 (P-1).
- Ich erstelle wegen eines einzelnen Mietvertrags Abrechnungen für alle Mieter eines Gebäudes, auch für ehemalige (P-4).

## Vorschläge

- **P-1.** Reproduktion: Mietverträge → Hans Müller öffnen. Die Warnung zeigt 2021–2023 ohne Hinweis auf eine Abrechnung ausserhalb von Dwello. Was helfen würde:
  - Ein Satz in der Warnung, zum Beispiel: «Haben Sie ein Jahr ausserhalb von Dwello abgerechnet, müssen Sie nichts tun.»
  - Besser noch eine Möglichkeit, ein Jahr als «ausserhalb von Dwello abgerechnet» zu markieren, damit die Warnung verschwindet.
  - Das laufende, wirklich fällige Jahr (2025) hervorheben oder getrennt von den alten Jahren zeigen.
- **P-2.** Reproduktion: Übersicht lesen («Noch nicht abgerechnet: Alpenblick»), dann den Mietvertrag Hans Müller öffnen («3 Abrechnungen fehlen»). Was helfen würde: Die Übersicht nennt die alten Lücken auch, oder sie sagt ausdrücklich, dass sie nur die letzte Periode zeigt.
- **P-3.** Reproduktion: Mietvertrag Hans Müller öffnen; die Buttons stehen in der Reihenfolge 2023, 2022, 2021. Was helfen würde: Die Reihenfolge erklären, zum Beispiel «beginnen Sie mit dem ältesten Jahr», oder die Jahre in der Reihenfolge zeigen, in der man sie abarbeiten soll.
- **P-4.** Reproduktion: Mietvertrag Hans Müller → «Abrechnung 2021 erstellen» → «Weiter». Die Vorschau zeigt 3 Abrechnungen für das ganze Gebäude. Was helfen würde: ein Satz in der Warnung wie «Der Assistent erstellt die Abrechnungen für alle Mietverträge von Musterhaus Zentrum in dieser Periode.»
- **P-5.** Reproduktion: Mietvertrag Laura Keller öffnen; dort steht «Abrechnung 2022 erstellen», obwohl Laura ab 01.11.2022 einzog. Was helfen würde: den betroffenen Zeitraum nennen, zum Beispiel «2022 (ab 01.11.2022)».

## Nicht geprüft

- Schritt 5 «Erstellen» und das Verschwinden der Warnung nach dem Erstellen: Laut Auftrag sollte ich nichts speichern.
- Andere Mietverträge (Kevin Fischer Alpenblick, beendete Mietverträge): nicht Teil des Auftrags.
- Dunkler Modus und andere Sprachen: nicht Teil des Auftrags.
