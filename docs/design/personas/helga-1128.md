# Helga – Kategorien erfassen: Bestätigung, Fokus und Klickbarkeit nach «Speichern» (1128)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % (Fenster 960 × 600 CSS-Pixel) und 200 % (720 × 450), Maus.
App: http://localhost:3300 (Persona-Stack, Demodaten). Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1128/`.

Ich habe elf eigene Kategorien erfasst, sechs bei 150 % (Treppenhausreinigung, Dachrinnenreinigung, Waschküchenstrom, Spielplatzkontrolle, Zaunreparatur 1.5, Abfallcontainer) und fünf bei 200 % (Hauswartwohnung Strom, Rasenmäher Service, Fassadenreinigung, Briefkastenanlage, Zaunreparatur 2). Mit der «Reihenfolge» habe ich gesteuert, ob die neue Kategorie ganz oben, in der Mitte oder ganz unten in der Liste landet. Nach jedem «Kategorie speichern» habe ich gleich auf «Löschen» der neuen Kategorie geklickt (Rückfrage erschien, ich habe «Abbrechen» gewählt) und dann auf ihren Namen (die Bearbeiten-Seite öffnete sich). Vordefinierte Kategorien und Gebäude habe ich nicht angerührt.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|----|---------|-----------|--------|
| – | – | – | Keine. In allen elf Fällen waren Name und «Löschen» der neuen Kategorie sofort und ohne Schliessen der Meldung anklickbar; die Meldung lag nie darüber. |

## Beobachtungen

- **Wo die Bestätigung steht:** Die Meldung «Kategorie «…» gespeichert» mit grünem Haken und einem X zum Schliessen erscheint rechts, entweder oben (über der Kopfzeile) oder unten am Fensterrand, je nachdem wo die neue Kategorie steht. Sie weicht der neuen Zeile aus:
  - Neue Kategorie ganz oben in der Liste (ohne Reihenfolge, z. B. «Treppenhausreinigung», «Abfallcontainer»), 150 %: Die Seite scrollt nicht, die neue Zeile steht ganz am unteren Fensterrand (Name bei 560–584 von 600 Pixeln, «Löschen» bei 548–596), die Karte ist unten angeschnitten. Die Meldung steht dann oben rechts. Beides frei klickbar.
  - Neue Kategorie in der Mitte oder weiter unten (Reihenfolge 1, 5, 50, 99), beide Zoomstufen: Die Seite scrollt so, dass die neue Zeile in der Fenstermitte steht; die Meldung steht unten rechts. Frei klickbar.
  - Bei 200 % ohne Reihenfolge («Hauswartwohnung Strom») scrollt die Seite ebenfalls zur Mitte, Meldung unten.
  - Bei 200 % mit Reihenfolge 99 («Fassadenreinigung») stand die neue Zeile auch in der Mitte, die Meldung diesmal aber oben rechts – warum, sehe ich nicht. Gestört hat es nicht.
  - Letzte Zeile der Liste (Reihenfolge 999, «Zaunreparatur»): bei 150 % steht sie knapp über der Fusszeile (Name bei 418–442), die Meldung unten rechts über der Fusszeile. Bei 200 % in der Mitte. Frei klickbar.
- **Wo der Fokus steht:** Immer auf dem Namen der neuen Kategorie (Link). Mit der Maus sehe ich keinen Fokusrahmen, das ist für mich in Ordnung; die neue Zeile ist sonst nicht hervorgehoben. Ich finde sie, weil sie in der Mitte steht und «Eigene» trägt. Im Fall «ganz oben ohne Scrollen» schaut man zuerst auf die Meldung oben rechts, die neue Zeile steht unten am Rand.
- **Nach «Löschen» → «Abbrechen»** steht der Fokus wieder auf dem «Löschen»-Knopf derselben Kategorie. Die Rückfrage nennt den Namen und die Folge («verschwindet aus der Auswahl beim Erfassen von Rechnungen»). Gut.
- **Die Meldung verdeckt Nachbarn:** Bei 200 % deckt die Meldung unten rechts die rechte Hälfte der *nächsten* Zeile ab, mit deren «Rechnungen»-Zahl und «Löschen» (Bild `z200-1-a-after.png`: «Löschen» von «Treppenhausreinigung» unter der Meldung; `z200-4-a-after.png`: dasselbe bei «Fassadenreinigung»). Oben rechts deckt sie Sprachwahl und Benutzermenü zu (`z200-3-a-after.png`), bei 150 % am Listenende einen Teil der Fusszeile. Die neue Kategorie selbst war nie betroffen.
- **Die Meldung verschwindet von selbst** nach etwa 6 bis 12 Sekunden, auch wenn ich mit der Maus darauf stehe. Bei drei Wörtern reicht mir das zum Lesen.
- **Reihenfolge:** Eine Kategorie ohne Reihenfolge steht ganz oben, noch vor einer mit Reihenfolge 1. Der Hilfetext sagt «kleinere Zahlen stehen weiter oben»; dass «leer» noch vor 1 kommt, hätte ich nicht erwartet. Ausserdem mischen sich umlagefähige und nicht umlagefähige Kategorien nach der Zahl (Fassadenreinigung, nicht umlagefähig, 99, steht zwischen Kaminfeger und Waschküchenstrom).
- Bei 200 % zeigt die Kopfzeile nur noch das Personensymbol ohne «Vera Verwalter»; Name, Kennzeichen und «Löschen» stehen in zwei Zeilen, ohne seitliches Scrollen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten; elf Kategorien, je rund 7 Schritte (Kategorie erfassen, Name, Umlagefähig/Nicht umlagefähig, eventuell Reihenfolge, Speichern, Löschen → Abbrechen, Name anklicken).

## Ablauf

- Neue Kategorie ohne Reihenfolge, 150 %: erwartet, dass sie nach dem Namen einsortiert wird; gesehen: sie steht ganz oben, vor allen anderen, und die Seite scrollt nicht, die Zeile klebt am unteren Fensterrand.
- «Fassadenreinigung», 200 %: erwartet, dass die Meldung wie bei den anderen mittleren Zeilen unten steht; gesehen: oben rechts, über Sprachwahl und Benutzermenü.
- Mauszeiger auf der Meldung: erwartet, dass sie stehen bleibt, solange ich darauf zeige; gesehen: sie verschwindet trotzdem.

## Vorschläge

Keine Tabellen-IDs. Zu den Beobachtungen: Die neue Zeile kurz hervorheben (z. B. Rahmen), damit man sie auch am unteren Rand findet; die Meldung beim Darüberfahren stehen lassen.

## Nicht geprüft

- Wirklich gelöscht habe ich keine Kategorie (jeweils «Abbrechen» in der Rückfrage), weil die Aufgabe nur nach der Klickbarkeit fragte.
- Ob die Meldung vor einer Kategorie liegt, die genau an ihrer Stelle steht, wenn die Seite nicht scrollen kann (z. B. sehr kurze Liste mit Filter): Mit 30 und mehr Kategorien in der Liste kam dieser Fall nicht vor; mit einem Filter habe ich es nicht versucht, weil nach dem Speichern immer «Alle» gezeigt wurde.
- Die Liste wurde von anderen Personas gleichzeitig verändert; Scrollpositionen können deshalb von Lauf zu Lauf abweichen.
