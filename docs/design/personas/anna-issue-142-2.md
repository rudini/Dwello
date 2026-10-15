# Persona Anna – Issue #142, Runde 2: Warnung «Abrechnungen fehlen» auf dem Mietvertrag

Anna, 29, vermietet zum ersten Mal und kommt nach Monaten zurück. Desktop 1440 × 900, Maus, und ein Bildschirm auf Mobile 390 × 844. Ich habe nichts gespeichert. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/anna-issue-142-2/`.

Aufgabe: die Mietverträge von Hans Müller (Musterhaus Zentrum) und Laura Keller (Alpenblick) öffnen. Zu beurteilen ist nur, ob P-3 (Reihenfolge) und P-4 (ganzes Gebäude) aus Runde 1 behoben sind und ob etwas Neues unklar ist. P-1 (#133) und P-2 (#211) bewerte ich nicht noch einmal.

## Status der Befunde aus Runde 1

- **P-3 (Reihenfolge): behoben.** Die Warnung sagt jetzt ausdrücklich: «die Reihenfolge spielt keine Rolle». Dass die Jahre vom neusten zum ältesten stehen (2023, 2022, 2021 bzw. 2025, 2023, 2022), stört mich nicht mehr: Ich muss mit keinem bestimmten Jahr anfangen. Dafür, dass das neuste Jahr oben steht, ist das sogar praktisch.
- **P-4 (ganzes Gebäude): behoben.** Schon auf dem Mietvertrag steht: «Jede Periode öffnet den Assistenten für alle Mietverträge des Gebäudes.» Der Assistent wiederholt das in seinem Einleitungstext: «… einer Abrechnungsperiode für ganze Gebäude». Jetzt weiss ich vor dem Klick, dass nicht nur Laura eine Abrechnung bekommt.

## Neue Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-6 | Minor | Mietvertrag, Warnung | Neu steht in der Warnung: «Erfassen Sie zuerst die Rechnungen der Periode». Es fehlt aber ein Weg, um zu prüfen, ob die Rechnungen dieser Periode schon erfasst sind. In der Warnung gibt es keinen Link dazu. Ganz unten unter «Dazu gehört» steht «Rechnungen des Gebäudes». Dort sehe ich aber alle Jahre (Filter «Jahr: Alle Jahre»), nicht die Periode, um die es gerade geht. |
| P-7 | Nit | Mietvertrag, Warnung | Auf den Buttons steht nur noch eine Jahreszahl («2025», «2023», «2022»), ohne Verb. Was ein Klick bewirkt, steht nur im Satz darüber («Jede Periode öffnet den Assistenten …»). Ich habe es verstanden, weil die Knöpfe wie Buttons aussehen und gleich unter diesem Satz stehen. Bei «Periode öffnet» musste ich aber kurz überlegen: Eine Periode öffnet doch nichts, der Button tut es. |

## Beobachtungen

- Der Screenreader-Name der Buttons lautet «Abrechnungen 2025 erstellen» und ist damit vollständig. Sichtbar steht aber nur «2025» (für Sven).
- Der Titel «3 Abrechnungen fehlen» ist im Bedienungsbaum weiterhin nur ein Absatz und keine Überschrift (wie in Runde 1).
- Der Hilfetext zum Heizprofil in Schritt 3 des Assistenten ist weiterhin ein sehr langer Absatz (wie in Runde 1).
- Der Warntext ist mit drei Sätzen länger geworden, liest sich auf Desktop aber noch gut. Auf Mobile füllt er etwa den halben Bildschirm.
- Auf Mobile stehen die drei Jahres-Buttons neu zu zweit nebeneinander (2023 und 2022, darunter 2021). Nichts scrollt seitwärts (scrollWidth 390).

## Aufgabe geschafft: ja

Ich konnte beide Mietverträge öffnen und die geänderte Warnung beurteilen. P-3 und P-4 sind aus meiner Sicht behoben.

## Aufwand

Etwa 6 Minuten, 6 Schritte: Liste der Mietverträge, Mietvertrag Müller, Mietvertrag Keller, Button «2025» bei Keller, «Rechnungen des Gebäudes» bei Keller, Mietvertrag Müller auf Mobile.

## Ablauf

1. **Liste der Mietverträge → Hans Müller** (`01-mueller.png`). Erwartet: dieselbe Warnung wie in Runde 1, mit einem Hinweis, womit ich anfangen soll. Gesehen: ein gelber Kasten «3 Abrechnungen fehlen» mit dem neuen Text: «… aber noch keine Nebenkostenabrechnung in Dwello. Jede Periode öffnet den Assistenten für alle Mietverträge des Gebäudes. Erfassen Sie zuerst die Rechnungen der Periode; die Reihenfolge spielt keine Rolle.» Darunter die Buttons «2023», «2022», «2021». Durch «in Dwello» wirkt die Warnung weniger wie ein Vorwurf. Die Reihenfolge ist geklärt.
2. **Zurück → Laura Keller** (`02-keller.png`). Gesehen: derselbe Text, Buttons «2025», «2023», «2022». Ich verstehe: Jeder Button öffnet das ganze Alpenblick für dieses Jahr.
3. **Button «2025» bei Keller** (`04-wizard-keller-2025.png`). Erwartet: den Assistenten für das ganze Gebäude. Gesehen: «Abrechnungen erstellen. Erstellen Sie die Nebenkostenabrechnungen einer Abrechnungsperiode für ganze Gebäude …», Schritt 3 von 5, «Gewählt: Alpenblick, Abrechnungsperiode 01.01.2025 – 31.12.2025». Das passt zur Warnung. Weiter bin ich nicht gegangen.
4. **Zurück → «Rechnungen des Gebäudes»** (`05-rechnungen-alpenblick.png`). Erwartet: Weil die Warnung sagt, ich solle zuerst die Rechnungen der Periode erfassen, wollte ich nachsehen, welche Rechnungen für 2025 schon da sind. Gesehen: die Rechnungsliste mit «14 Rechnungen» von Alpenblick, Jahr «Alle Jahre». Ich muss das Jahr selbst filtern, und ich musste diesen Link erst unten auf der Seite suchen (P-6).
5. **Mietvertrag Hans Müller auf Mobile** (`06-mueller-mobile.png`). Gesehen: Die Warnung steht unter den Aktionen. Die Buttons 2023 und 2022 stehen nebeneinander, 2021 darunter. Alles ist lesbar, nichts scrollt seitwärts.

## Verwirrung

- «Jede Periode öffnet den Assistenten»: Gemeint ist der Button mit der Jahreszahl. Ich musste den Satz zweimal lesen (P-7).
- «Erfassen Sie zuerst die Rechnungen»: Woher weiss ich, ob das schon erledigt ist? (P-6)
- «Mietstage» wird weiterhin nicht erklärt; ich verstehe es aber ungefähr.

## Fehlerrisiken

- Ich klicke auf das Jahr, ohne vorher die Rechnungen zu prüfen. Das Prüfen kostet mich ein paar Umwege (P-6). Die Vorschau im Assistenten warnt zwar bei fehlenden Rechnungen (aus Runde 1), aber erst spät.

## Vorschläge

- **P-6.** Reproduktion: Mietverträge → Laura Keller öffnen, den Satz «Erfassen Sie zuerst die Rechnungen der Periode» lesen, dann «Rechnungen des Gebäudes» unten auf der Seite öffnen. Der Jahresfilter steht auf «Alle Jahre». Was helfen würde: ein Link direkt in der Warnung, zum Beispiel «Rechnungen 2025 von Alpenblick ansehen», der die Rechnungsliste schon nach Gebäude und Jahr gefiltert öffnet.
- **P-7.** Reproduktion: Mietvertrag Hans Müller öffnen; die Buttons heissen nur «2023», «2022», «2021». Was helfen würde: den Satz umformulieren, zum Beispiel «Jeder Button öffnet den Assistenten für dieses Jahr und alle Mietverträge des Gebäudes.» Oder eine kurze Beschriftung über den Buttons wie «Abrechnungen erstellen für:».

## Nicht geprüft

- Weiter als Schritt 3 im Assistenten und «Erstellen»: Laut Auftrag sollte ich nichts speichern. Die Vorschau hatte ich schon in Runde 1 gesehen.
- Andere Mietverträge, dunkler Modus, andere Sprachen: nicht Teil des Auftrags.
- P-1 und P-2: laut Auftrag schon in #133 und #211 erfasst.
