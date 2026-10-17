# Marco – w16: Brennstoff-Häkchen bei Kategorien und Tankbestand (Handy 390 × 844, Touch)

Nur angeschaut, nichts gespeichert. Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/6a612fe5-db6f-5ef4-85c5-983800bc9434/scratchpad/marco-w16/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäude «Alpenblick», Tankbestand | Neben dem Feld «Kategorie» steht nur «In dieser Kategorie wird der Verbrauch abgerechnet.» Dass hier nur Kategorien mit dem Häkchen «Brennstoff» stehen und wo ich das Häkchen setze, steht nirgends. Fehlt meine Holz-Kategorie, weiss ich nicht, warum. |
| P-2 | Minor | Neue Kategorie / Kategorie bearbeiten | «Brennstoff» hängt am Häkchen «Heizkosten nach dem Heizprofil verteilen», sieht aber gleichrangig aus: gleiche Einrückung, gleiche Grösse. Nehme ich das Heizprofil-Häkchen weg, verschwindet «Brennstoff». Setze ich es wieder, ist «Brennstoff» noch angekreuzt. Ob das versteckte Häkchen beim Speichern mitgeht, sehe ich nicht. |
| P-3 | Minor | Kategorie «Heizung» bearbeiten | «Heizung» hat das Häkchen «Brennstoff». Ihre Beschreibung sagt aber «Brennstoff, Energie, Wartung und Betrieb der Heizung …», und der Hilfetext von «Brennstoff» sagt «Service, Wartung und Kaminfeger sind kein Brennstoff». Ich frage mich, ob ich die Wartungsrechnung jetzt in eine andere Kategorie stecken muss. |

## Beobachtungen

- Der Knopf auf der Liste heisst «Kategorie erfassen», die Seite danach heisst «Neue Kategorie». Ich habe ihn trotzdem sofort gefunden.
- Im Menü auf dem Handy steht «Kategorien» direkt unter «Einstellungen und Hilfe». Das sind zwei Taps, gut.
- «Brennstoff» erscheint auch, wenn ich «Nicht umlagefähig» wähle (wie das Heizprofil-Häkchen). Wofür das bei nicht umlagefähigen Kosten gut sein soll, ist mir unklar. Ich habe es aber nicht weiter verfolgt.
- Der Hilfetext von «Brennstoff» hat 16 px und guten Kontrast. Auf dem Handy ist er neun Zeilen lang. Zusammen mit dem Heizprofil-Text darüber muss ich gut 15 Zeilen lesen, bevor ich beim Feld «Reihenfolge» bin. Das ist lang, aber verständlich.
- Im Tankbestand bietet das Feld «Kategorie» «Stückholz» und «Heizung» an. «Stückholz» kommt nicht von mir, wohl von einer anderen Persona. Ich werte das nicht, es zeigt aber, dass eigene Brennstoff-Kategorien dort erscheinen. «Kaminfeger» erscheint nicht, das ist richtig.
- Der Einleitungstext im Tankbestand («Nur für Gebäude, die mit Öl, Flüssiggas, Pellets oder Holz heizen …») ist sehr lang (etwa 14 Zeilen auf dem Handy), aber klar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten Bedienzeit. Etwa 12 Taps: Menü → Kategorien → Kategorie erfassen → Häkchen Heizprofil → Häkchen Brennstoff (hin und zurück) → Heizung öffnen → zurück → Kaminfeger öffnen → Gebäude → Alpenblick → nach unten zum Tankbestand scrollen.

## Ablauf

1. **Übersicht → Menü.** Erwartet: Einstellungen im Menü. Gesehen: Das Menü (Screenshot `02-menu.png`) zeigt unter «Einstellungen und Hilfe» direkt «Kategorien».
2. **Kategorien.** Erwartet: ein Knopf «Neue Kategorie». Gesehen: «Kategorie erfassen» oben unter dem Einleitungstext. Klar genug.
3. **Neue Kategorie.** Erwartet: «Brennstoff» ist noch nicht da. Gesehen: Nur «Heizkosten nach dem Heizprofil verteilen» mit Hilfetext, «Brennstoff» fehlt noch. Richtig.
4. **Heizprofil-Häkchen gesetzt.** Erwartet: «Brennstoff» erscheint. Gesehen (`06-brennstoff-view.png`, `07-brennstoff-help.png`): Darunter erscheint «Brennstoff», fett, Kästchen 24 px, mit Hilfetext. Die ganze Zeile mit der Beschriftung ist 358 × 48 px gross und lässt sich gut antippen. Ein Tap auf die Beschriftung setzt das Häkchen. Kein seitliches Scrollen (Seitenbreite 390 px). Der Text ist verständlich: Heizmaterial für Tank oder Lager (Heizöl, Flüssiggas, Pellets, Holz). Den Tankbestand erfasse ich auf der Seite des Gebäudes, abgerechnet wird der Verbrauch. Erdgas, Fernwärme und Strom gehören nicht dazu, Service, Wartung und Kaminfeger auch nicht. Gut erklärt. Optisch ist aber nicht zu sehen, dass «Brennstoff» zum Heizprofil-Häkchen gehört (P-2).
5. **Heizprofil-Häkchen weg, wieder setzen.** Erwartet: «Brennstoff» verschwindet und ist danach leer. Gesehen: Es verschwindet, kommt aber angekreuzt zurück (P-2).
6. **Kategorie «Heizung» öffnen.** Erwartet: «Brennstoff» angekreuzt. Gesehen (`09-heizung.png`): Heizprofil und «Brennstoff» sind beide angekreuzt. Richtig. Die Beschreibung darüber nennt aber auch Wartung und Betrieb (P-3).
7. **Kategorie «Kaminfeger» öffnen.** Erwartet: «Brennstoff» nicht angekreuzt. Gesehen (`10-kaminfeger.png`): Heizprofil angekreuzt, «Brennstoff» leer. Richtig.
8. **Gebäude «Alpenblick», Tankbestand.** Erwartet: Heizung als Kategorie, eine Erklärung, warum gerade diese. Gesehen (`12-tank-1.png`, `13-tank-2.png`): Einleitung, drei Bestände (31.12.2023 bis 31.12.2025, alle «Heizung»), Felder Stichtag, Wert in Franken, Kategorie. In der Auswahl stehen «Stückholz» und «Heizung», vorgewählt ist «Heizung». Das Auswahlfeld ist 48 px hoch. Warum genau diese zwei? Das steht nirgends (P-1). Ich vermute es nur, weil ich eben das Häkchen gesehen habe.

## Verwirrung

- «Brennstoff» bei «Heizung», obwohl in «Heizung» auch Wartung steckt (P-3).
- Zuerst habe ich «Tankbestand» als Liter gelesen. Der Text sagt aber «in Franken». Das ist erklärt, aber ungewohnt.
- Warum das Tankbestand-Feld nur bestimmte Kategorien zeigt (P-1).

## Fehlerrisiken

- Ich entferne das Heizprofil-Häkchen bei einer Kategorie, bei der «Brennstoff» gesetzt war. Speichert Dwello «Brennstoff» trotzdem, taucht die Kategorie weiter im Tankbestand auf, ohne dass ich das sehe (P-2, nicht geprüft).
- Ich lege eine eigene Kategorie «Pellets» an und vergesse «Brennstoff». Dann finde ich sie im Tankbestand nicht und weiss nicht, wo ich nachschauen muss (P-1).
- Wegen P-3 buche ich Wartungsrechnungen vielleicht unter einer anderen Kategorie, damit «Heizung» rein Brennstoff bleibt.

## Vorschläge

- **P-1:** Menü → Gebäude → Alpenblick → nach unten zum Tankbestand → Feld «Kategorie». Hilfe: Ein Satz im Hilfetext wie «Hier stehen die Kategorien mit dem Häkchen «Brennstoff». Fehlt Ihre Kategorie, setzen Sie das Häkchen unter Einstellungen > Kategorien.», am besten mit Link.
- **P-2:** Kategorien → Kategorie erfassen → Häkchen «Heizkosten nach dem Heizprofil verteilen» → «Brennstoff» ankreuzen → Heizprofil-Häkchen weg und wieder setzen: «Brennstoff» ist noch angekreuzt. Hilfe: «Brennstoff» sichtbar unter das Heizprofil-Häkchen einrücken. Wird das Heizprofil-Häkchen entfernt, auch «Brennstoff» leeren (oder sagen, dass es mitgeht).
- **P-3:** Kategorien → Heizung. Hilfe: Im Brennstoff-Hilfetext oder in der Beschreibung von «Heizung» sagen, wie Wartungsrechnungen in einer Brennstoff-Kategorie behandelt werden. Zum Beispiel: Wartung und Service in eine eigene Kategorie ohne Häkchen «Brennstoff» einordnen, oder: der Tankbestand betrifft nur den Brennstoffanteil.

## Nicht geprüft

- Speichern einer Kategorie mit oder ohne «Brennstoff» und ob ein verstecktes «Brennstoff»-Häkchen gespeichert wird: Auftrag war nur anschauen, eine andere Persona speichert parallel.
- Ob eine neu gespeicherte Brennstoff-Kategorie im Tankbestand erscheint: Ich konnte nicht speichern. «Stückholz» deutet darauf hin, stammt aber nicht von mir.
- Speichern eines Tankbestands und dessen Wirkung auf die Abrechnung.
- Andere Sprachen als Deutsch.
