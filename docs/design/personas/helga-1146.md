# Helga – Schrittanzeige in den Assistenten (#1146)

Persona: Helga, 68, Desktop 1440 × 900, zuerst 150 % Zoom, dann 100 %, Maus. Nur angesehen, nichts gespeichert und nichts erstellt.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1146/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritte 2–4 (150 % und 100 %) | Bei den erledigten Schritten steht meine Auswahl, aber mitten im Wort umgebrochen: «01.01.20 / 25 – / 31.12.20 / 25», «Alpenbli / ck», «Warmwass / er». Das Datum lese ich falsch («20» und «25» getrennt), den Gebäudenamen erkenne ich kaum. Bei 100 % genauso («Alpenbli / ck» in Schritt 3, «Warmwass / er» in Schritt 4). |
| P-2 | Major | Neuer Mietvertrag, alle Schritte bei 150 % | Oben sehe ich nur beim aktuellen Schritt einen Namen. Die nächsten Schritte sind nur Nummern (2, 3, 4, 5), die erledigten nur grüne Häkchen ohne Namen und ohne meine Auswahl. Ich weiss also nicht, was als Nächstes kommt («Vertragsdauer»? «Miete»?), und oben steht nicht, welchen Mieter und welche Wohnung ich gewählt habe. Mit der Maus über einem Häkchen erscheint auch nichts. |
| P-3 | Minor | Abrechnungen erstellen, alle Schritte (150 % und 100 %) | Auch hier sind die kommenden Schritte nur Nummern («3», «4», «5»). Dass «Vorschau» und dann «Erstellen» kommen, sehe ich erst, wenn ich dort bin. Bei 100 % gilt das nur für diesen Assistenten: beim Mietvertrag stehen bei 100 % alle fünf Namen da. |
| P-4 | Minor | Beide Assistenten, Schrittanzeige | Die beiden Assistenten zeigen bei erledigten Schritten Verschiedenes: beim Mietvertrag (100 %) den Namen des Schritts («Mieter», «Wohnung»), bei den Abrechnungen meine Auswahl («Alpenblick», das Datum), aber nicht den Namen des Schritts. Steht oben «Heizung + Warmwasser», weiss ich nicht, dass das der Schritt «Heizprofil und Verwaltungspauschale» war. |
| P-5 | Minor | Neuer Mietvertrag Schritt 2, Abrechnungen erstellen Schritt 2 (150 %) | Nach «Weiter» springt die Seite so weit nach unten, dass die Schrittanzeige ganz verschwunden ist und die Überschrift des Schritts («Wohnung», «Gebäude») oben abgeschnitten ist. Ich muss hochscrollen, um zu sehen, wo ich bin. In den Schritten 3–5 bleibt die Anzeige sichtbar. |

## Beobachtungen

- Die Zeile «Schritt 3 von 5: Vertragsdauer» über dem Balken ist gut lesbar und sagt klar, wo ich bin. Sie ist bei 150 % meine einzige Hilfe; sie sagt aber nicht, was danach kommt.
- Bei «Abrechnungen erstellen», Schritt 3, bricht der Name des aktuellen Schritts in zwei Zeilen um («Heizprofil und / Verwaltungspauschale»), aber zwischen den Wörtern; das stört nicht.
- Die fünf Kästchen sind ungleich verteilt: der aktuelle Schritt mit Namen bekommt viel Platz, die Nummern rechts stehen weit auseinander, die erledigten Häkchen bei 150 % eng beieinander.
- Unter den Überschriften «Gebäude» und «Heizprofil und Verwaltungspauschale» (Abrechnungen, Schritte 2 und 3) ist eine grosse leere Fläche, bevor das erste Feld kommt.
- Auf der Übersicht und der Mietvertragsliste heisst der Knopf «Mietvertrag erfassen», die Seite danach «Neuer Mietvertrag». Ich habe ihn trotzdem gefunden.
- Beim Mietvertrag mit Maria Rossi kam in Schritt 2 ein Hinweis, dass sie schon einen Mietvertrag ohne Vertragsende hat. Gut erklärt.
- Schritt «Prüfen» beim Mietvertrag zeigt alles, was ich gewählt habe, mit «Ändern» daneben. So eine Übersicht hätte ich mir oben in der Schrittanzeige gewünscht, wenigstens kurz.
- In Schritt 2 der Abrechnungen steht «‹Alle Gebäude› lässt 2 Gebäude aus …», darunter sind aber alle drei Gebäude zum Ankreuzen aufgeführt. Das hat mich kurz verwirrt.

## Aufgabe geschafft: ja

Beide Assistenten bis «Prüfen» (Mietvertrag) bzw. «Vorschau» (Abrechnungen) durchlaufen, bei 150 % und 100 %, ohne zu speichern.

## Aufwand

Etwa 20 Minuten, rund 30 Schritte (Mietvertrag: 5 Schritte × 2 Zoomstufen; Abrechnungen: 4 Schritte × 2 Zoomstufen, dazu Ansehen und Darüberfahren).

## Ablauf

- Mietvertrag, Schritt 1, 150 %: Ich erwartete die fünf Schritte mit Namen. Ich sah «1 Mieter» und daneben nur «2», «3», «4», «5».
- Mietvertrag, Schritt 2, 150 %: Ich erwartete oben den gewählten Mieter oder wenigstens «Mieter» mit Häkchen. Die Seite war nach unten gesprungen, die Schrittanzeige nicht zu sehen, die Überschrift «Wohnung» oben abgeschnitten. Hochgescrollt: nur ein grünes Häkchen ohne Text.
- Mietvertrag, Schritt 5, 150 %: Mit der Maus auf ein Häkchen erwartete ich einen Hinweis, was das war. Es erschien nichts.
- Mietvertrag, 100 %: Wie erwartet alle Namen sichtbar; die erledigten Schritte zeigen den Namen («Mieter», «Wohnung»), nicht meine Auswahl.
- Abrechnungen, Schritt 2, 150 %: Wie beim Mietvertrag nach unten gesprungen, Schrittanzeige weg, Überschrift «Gebäude» abgeschnitten.
- Abrechnungen, Schritt 3, 150 %: Ich erwartete beim ersten Häkchen den Zeitraum lesbar. Ich sah «01.01.20 / 25 – / 31.12.20 / 25» untereinander und daneben «Alpenbli / ck».
- Abrechnungen, Schritt 4 (Vorschau), 150 % und 100 %: Ich erwartete «Heizprofil» o. ä. beim dritten Häkchen. Ich sah «Heizung + / Warmwass / er».
- Abrechnungen, 100 %: Ich erwartete wie beim Mietvertrag alle Namen. Kommende Schritte sind auch hier nur Nummern, die Auswahl bricht ebenfalls mitten im Wort («Alpenbli / ck» in Schritt 3).

## Vorschläge

- **P-1:** «Abrechnungen erstellen» öffnen, Zeitraum lassen, «Weiter», «Alpenblick» ankreuzen, «Weiter», «Weiter» bis «Vorschau»; bei 150 % und 100 % die Schrittanzeige ansehen. Hilfreich: Wörter und Daten nie mitten im Wort trennen; der Zeitraum dürfte höchstens beim Bindestrich umbrechen. Lieber den Text kürzen oder unter das Kästchen setzen als ihn so zu zerhacken.
- **P-2:** «Mietvertrag erfassen» bei 150 % öffnen, Mieter wählen, «Weiter», Wohnung wählen, «Weiter». Hilfreich: die Namen aller Schritte auch bei grosser Schrift zeigen (notfalls in zwei Zeilen unter den Nummern), oder wenigstens den nächsten Schritt nennen («Als Nächstes: Vertragsdauer»). Bei erledigten Schritten den Namen oder die Auswahl stehen lassen statt nur ein Häkchen.
- **P-3:** «Abrechnungen erstellen» bei 100 % oder 150 % öffnen. Hilfreich: wie bei P-2 die Namen der kommenden Schritte zeigen, mindestens den nächsten.
- **P-4:** Beide Assistenten bei 100 % bis Schritt 4 durchgehen und die erledigten Schritte vergleichen. Hilfreich: überall dasselbe Muster, am besten Name des Schritts und darunter klein die Auswahl («Gebäude: Alpenblick»).
- **P-5:** Bei 150 % in einem der beiden Assistenten in Schritt 1 «Weiter» klicken. Hilfreich: nach «Weiter» so scrollen, dass die Schrittanzeige oben sichtbar bleibt, wie es in den späteren Schritten schon geschieht.

## Nicht geprüft

- Den Schritt «Erstellen» (5) der Abrechnungen und das Speichern des Mietvertrags: laut Auftrag nur ansehen.
- Ob ein Klick auf ein erledigtes Häkchen zum Schritt zurückführt: habe ich nicht angeklickt, nur mit der Maus darübergefahren.
- 200 % Zoom: nicht verlangt.
