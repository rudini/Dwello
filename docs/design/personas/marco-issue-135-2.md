# Marco – Issue #135, Runde 2: Hinweis «schon abgerechnet» im Abrechnungs-Assistenten, Schritt 2

Persona: Marco, 38, auf dem Smartphone (390 × 844, Touch, 100 %). App: Persona-App auf http://localhost:3300 mit Demodaten. Ich habe nur geschaut und nichts gespeichert (zum Antippen siehe Beobachtungen).
Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/marco-issue-135-2/`.
Runde 1: `docs/design/personas/marco-issue-135.md`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor (weiter offen) | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der Hinweis steht jetzt unter der Zeile mit dem Kästchen, nimmt aber nicht die ganze Kartenbreite ein. Er ist 40 px eingerückt (bündig unter dem Gebäudenamen), der Text läuft von x = 99 bis 331, ist also 232 px breit statt 159 px wie vorher. Weil der Text länger und fett ist, bricht er trotzdem auf **8 Zeilen** um (192 px). Die Karte von Seepark Residenz ist jetzt **388 px** hoch (in Runde 1 waren es 384 px). Auf meinem Handy passt immer noch nur eine solche Karte ganz auf den Bildschirm (`07-viewport-seepark.png`). |
| P-2 | – (behoben) | Abrechnungen erstellen, Schritt 2 «Gebäude» | Der Hinweis ist jetzt fett (600) und fast schwarz (rgb 22,28,33), die Rechnungszeile darüber normal und grau (rgb 63,74,84). Beim Überfliegen springt er mir ins Auge, und es hängt nicht an der Farbe. |
| P-3 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | **Wenn ich auf den Hinweis tippe, passiert nichts.** Er liegt im selben Kartenrahmen wie das Kästchen, gehört aber nicht mehr zur Tippfläche. Ein Tipp mitten auf den Hinweis oder rechts daneben lässt das Kästchen leer, erst ein Tipp auf den Namen kreuzt an. Damit ist die untere Hälfte der Karte (192 von 388 px) eine tote Fläche. In Runde 1 hat ein Tipp auf den Satz die Karte noch angekreuzt. Dass ich so ein Gebäude nicht aus Versehen wähle, ist vielleicht gewollt. Für mich sieht die umrandete Karte aber aus wie ein einziger Knopf, und ich habe zweimal getippt und gedacht, das Handy hätte nicht reagiert. |

Nicht bemängelt (geprüft, in Ordnung):
- **Kein seitliches Scrollen:** `scrollWidth` = `clientWidth` = 390; nach `scrollTo(500, …)` bleibt `scrollX` bei 0. Der Hinweis bleibt ganz in der Karte (Kartenrahmen 41–349, Text 99–318).
- **Tippen auf den Kartenkopf:** Ein Tipp auf den Namen kreuzt Seepark Residenz an, der Zähler wechselt auf «1 von 4 gewählt». Ein zweiter Tipp nimmt das Häkchen wieder weg.

## Beobachtungen

- **«N Wohnungen» ragt weiter über den Kartenrand:** Das Wort «Wohnungen» reicht bis x = 365, der Kartenrahmen endet bei 349 (in allen vier Karten, auch ohne Hinweis, siehe `04-step2-full.png`). Das war in Runde 1 schon so. Diese rechte Spalte macht die Textspalte oben in der Karte so schmal, dass Adresse und «15 Rechnungen in der Abrechnungsperiode» auf 2 bis 3 Zeilen umbrechen.
- **Automatisch gesichert:** Nach dem Ankreuzen über den Namen meldete der Assistent «Entwurf gespeichert, 14:36». Ich habe das Häkchen gleich wieder entfernt, sodass der Stand wieder «0 von 4 gewählt» ist. Dass schon ein Tipp einen Entwurf sichert, ohne dass ich speichere, überrascht mich.
- **Fremdes Gebäude «Anna Testhaus 2»:** Das hat eine andere Persona angelegt, ich habe es nicht bewertet.
- **Weg über das Menü:** Im Menü heisst der Eintrag «Nebenkostenabrechnungen», nicht «Abrechnungen». Ich habe ihn trotzdem sofort gefunden.

## Aufgabe geschafft: ja

## Aufwand

Etwa 4 Minuten und 5 Taps bis Schritt 2 (Menü › «Nebenkostenabrechnungen» › «Abrechnungen erstellen» › «Weiter»; laut Skript rund 3 s). Danach musste ich über vier Karten scrollen, die Seite ist etwa 2260 px lang.

## Ablauf

1. **Menü › «Nebenkostenabrechnungen».** Erwartet: die Liste der Abrechnungen mit einem Knopf zum Erstellen. Gesehen: die Seite «Nebenkostenabrechnungen» mit dem Link «Abrechnungen erstellen». Passt.
2. **«Abrechnungen erstellen».** Erwartet: 2025 ist vorgeschlagen. Gesehen: Schritt 1 von 5, Beginn 01.01.2025, Ende 31.12.2025. Passt.
3. **«Weiter».** Erwartet: Der Hinweis steht unter der Kästchenzeile, über die ganze Breite, und hebt sich ab. Gesehen: Er steht unten in der Karte, fett und dunkel, und hebt sich deutlich ab (P-2 behoben). Er ist aber unter dem Namen eingerückt und braucht 8 Zeilen, deshalb ist die Karte so hoch wie vorher (P-1).
4. **Breite prüfen.** Erwartet: Nichts scrollt seitlich. Gesehen: Nichts scrollt seitlich. Nur «Wohnungen» ragt wie bisher über den Rahmen (Beobachtung).
5. **Auf den Hinweis tippen.** Erwartet: Wie in Runde 1 wird die Karte angekreuzt, oder ich bekomme eine Rückmeldung. Gesehen: Es passiert nichts, auch nicht rechts neben dem Text (P-3).
6. **Auf den Namen tippen.** Erwartet: Die Karte wird angekreuzt. Gesehen: Ja, «1 von 4 gewählt» und «Entwurf gespeichert». Mit einem weiteren Tipp habe ich das Häkchen wieder entfernt.

## Verwirrung

- «Sie müssen es nicht wählen»: Ich verstehe das so, dass ich es wählen darf. Was passiert dann? Entsteht etwas, oder nichts? Dass sich die Karte trotzdem ankreuzen lässt, ein Tipp auf den Hinweis aber nichts tut, passt für mich nicht zusammen. Klarer wäre «Wählen Sie es nicht» oder «Es wird übersprungen, wenn Sie es wählen».
- «ganz oder teilweise abdeckt»: Den Teil lese ich auf dem Handy nicht. Mir genügt «schon abgerechnet».

## Fehlerrisiken

- P-3: Ich tippe auf die grosse untere Hälfte der Karte, nichts passiert, und ich halte die App für hängengeblieben oder tippe mehrmals.
- P-1: Wegen der zwei langen Karten scrolle ich viel und übersehe leicht Alpenblick, das einzige Gebäude, das 2025 noch offen ist.

## Vorschläge

- **P-1:** So kann man es nachstellen: Handy 390 × 844, Menü › «Nebenkostenabrechnungen» › «Abrechnungen erstellen» › «Weiter». Die Karte Seepark Residenz ist 388 px hoch, der Hinweis hat 8 Zeilen und ist 40 px eingerückt. Helfen würde, die Einrückung auf dem Handy wegzulassen (dann wirklich über die ganze Kartenbreite) und den Text zu kürzen, etwa «Alle Mietverträge sind schon abgerechnet. Es entsteht keine neue Abrechnung.» Dann wären es etwa 3 Zeilen.
- **P-3:** So kann man es nachstellen: wie oben, dann mitten auf den fetten Hinweis bei Seepark Residenz tippen. Das Kästchen bleibt leer, ein Tipp auf den Namen kreuzt an. Helfen würde eine von zwei Lösungen. Entweder gehört der Hinweis wieder zur Tippfläche, so dass die ganze Karte wie ein Knopf wirkt. Oder solche Gebäude sind gar nicht wählbar: dann ist die Karte sichtbar als «nicht wählbar» gekennzeichnet, mit Text und nicht nur grau, und ein Kästchen gibt es nicht.

## Nicht geprüft

- Schritte 3 bis 5 und das Ergebnis, wenn ich Seepark Residenz wähle: Ich sollte nichts speichern.
- Einen Fall, in dem nur ein Teil der Mietverträge abgerechnet ist: Mit den Demodaten für 2025 kommt er nicht vor.
- Dunkelmodus und andere Sprachen gehörten nicht zum Auftrag.
