# Dr. Weber, Slice 597: Stockwerke im Untergeschoss

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Demodaten). Gebäude: Alpenblick (Bergstrasse 8, 3800 Interlaken).
Aufgabe: Zwei Wohnungen erfassen, eine im 1. und eine im 2. Untergeschoss; prüfen, wie Dwello die Stockwerke in der Auswahl, in der Liste und auf der Wohnungsseite nennt, auf Deutsch, Französisch und Italienisch.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neue Wohnung / Wohnung bearbeiten, Feld «Stockwerk» | Die Auswahl bietet nur ein einziges «UG» (dann EG, 1. OG … 6. OG). Ein 2. Untergeschoss lässt sich nicht erfassen; beide Wohnungen landen im selben «UG». |
| P-2 | Major | Gebäudeseite, Wohnungsliste, Wohnungsseite (de/fr/it) | Folge von P-1: Die Wohnung im 2. UG steht unter «UG» / «sous-sol» / «piano interrato», genau wie die im 1. UG. Nicht eindeutig, und die gespeicherte Angabe ist schlicht falsch. Für die Schweiz erwarte ich «1. UG / 2. UG», «1er sous-sol / 2e sous-sol», «1° piano interrato / 2° piano interrato». |
| P-3 | Nit | Gebäudeseite, Französisch und Italienisch | Die Zwischenüberschriften der Stockwerke beginnen klein: «sous-sol», «rez-de-chaussée», «piano interrato», «pianterreno». Als Überschrift wirkt das unfertig; auf Deutsch («UG», «EG») fällt es nicht auf. |

## Beobachtungen

- Der Hilfetext beim Feld lautet «Lage der Wohnung im Gebäude: UG, EG, 1. OG, 2. OG usw.». Das «usw.» gilt nur nach oben; dass es nach unten nichts mehr gibt, steht nirgends.
- Auf Französisch steht bei der Wohnung U2.01 «1.5 pièce» (Einzahl), bei 3.5 dagegen «3.5 pièces». Grammatisch vertretbar, nebeneinander aber uneinheitlich. Das Komma als Dezimalzeichen («1,5») würde ich auf Französisch eher erwarten; das gehört aber nicht zu dieser Aufgabe.
- Nach dem Klick auf «Wohnung erfassen» zeigte der Knopf «Wird gespeichert …», danach war die Wohnung auf der Gebäudeseite da. Das Speichern selbst klappte ohne Fehlermeldung.
- Die übrigen Stockwerksnamen halte ich für korrekt und für die Schweiz üblich: de «EG, 1. OG, 2. OG», fr «rez-de-chaussée, 1er étage, 2e étage», it «pianterreno, 1° piano, 2° piano». Auswahl, Liste und Wohnungsseite verwenden in allen drei Sprachen dieselben Wörter.

## Aufgabe geschafft: teilweise

Die beiden Wohnungen sind gespeichert, aber nur mit einem Umweg: beide als «UG». Ein Stockwerk −2 bietet Dwello nicht an.

## Aufwand

Etwa 10 Minuten, rund 25 Schritte (Gebäude öffnen, zweimal das Formular «Neue Wohnung», Gebäudeseite, Wohnungsliste, Wohnungsseite, Bearbeiten-Formular, Sprache zweimal wechseln und dieselben vier Seiten wieder ansehen, zurück auf Deutsch).

## Ablauf

1. **Gebäude → Alpenblick.** Erwartet: Liste der Wohnungen nach Stockwerk. Gesehen: Gruppen EG, 1. OG, 2. OG mit den Wohnungen EG, OG1 und OG2, Knopf «Wohnung erfassen». Wie erwartet.
2. **Wohnung erfassen, Feld «Stockwerk».** Erwartet: «2. UG, 1. UG, EG, 1. OG …» oder ähnlich. Gesehen: «Stockwerk wählen, UG, EG, 1. OG, 2. OG, 3. OG, 4. OG, 5. OG, 6. OG». Es gibt nur ein UG. Bei einem einzigen Untergeschoss ist «UG» in der Schweiz üblich, bei zwei nicht mehr eindeutig.
3. **Wohnung U1.01 erfassen** (UG, 45 m², 2 Zimmer). Gespeichert, erscheint unter «UG».
4. **Wohnung U2.01 erfassen.** Da es kein 2. UG gibt, habe ich den Umweg gewählt, den ich auch im Alltag nehmen würde: Stockwerk «UG» und das Geschoss in der Wohnungsnummer festhalten («U2.01»). Gespeichert, erscheint ebenfalls unter «UG» (Screenshot: unter der Überschrift «UG» stehen beide Wohnungen, U1.01 und U2.01, untereinander, ohne Unterschied).
5. **Wohnungsliste (Wohnungen).** Beide Zeilen zeigen «Alpenblick · UG». Nur die von mir gewählte Nummer unterscheidet sie.
6. **Wohnungsseite U2.01.** «Stockwerk: UG». Falsch für eine Wohnung im 2. UG; ein Leser des Datensatzes hat keine Möglichkeit, das zu merken.
7. **Wohnung bearbeiten.** Dieselbe Auswahl wie beim Erfassen, «UG» ausgewählt, auch hier kein 2. UG.
8. **Sprache auf Français.** Auswahl «Choisir l’étage, sous-sol, rez-de-chaussée, 1er étage, 2e étage …»; Gebäudeseite, Liste und Wohnungsseite zeigen für beide Wohnungen «sous-sol». Die Überschriften auf der Gebäudeseite sind klein geschrieben (Screenshot: «sous-sol», «rez-de-chaussée», «1er étage», «2e étage» als Zwischentitel über den Wohnungszeilen).
9. **Sprache auf Italiano.** Auswahl «Scegliere il piano, piano interrato, pianterreno, 1° piano, 2° piano …»; überall «piano interrato» für beide Wohnungen.
10. **Sprache zurück auf Deutsch.** Klappt.

## Verwirrung

- «UG» ohne Nummer: Solange es nur ein Untergeschoss gibt, ist das klar. Ich habe zwei; ist «UG» dann das obere, das untere oder «irgendein» Untergeschoss? Das sagt Dwello nicht.
- Der Hilfetext «UG, EG, 1. OG, 2. OG usw.» lässt mich ein «2. UG» vermuten, das es nicht gibt.

## Fehlerrisiken

- Wer ein zweites Untergeschoss hat, speichert zwangsläufig eine falsche Stockwerksangabe. Wird das Stockwerk später für etwas Rechtliches gebraucht, etwa die Bezeichnung des Mietobjekts im Mietvertrag («Wohnung im 2. UG»), steht dort das falsche Geschoss.
- Zwei Wohnungen unter derselben Überschrift «UG» verwechselt man leicht, vor allem wenn ihre Nummern das Geschoss nicht verraten.

## Vorschläge

- **P-1:** Reproduktion: Gebäude Alpenblick → «Wohnung erfassen» → Feld «Stockwerk» öffnen: nur «UG» unterhalb von EG. Hilfreich: «2. UG» und «1. UG» anbieten (sinnvoll ist wohl auch ein «3. UG»), dazu einen Hilfetext, der sie nennt: «… 2. UG, 1. UG, EG, 1. OG …». Wird wie bisher nur ein Untergeschoss angeboten, sollte es «1. UG» heissen, damit klar ist, dass es mehrere geben kann.
- **P-2:** Reproduktion: zwei Wohnungen mit «UG» im selben Gebäude erfassen; Gebäudeseite, Wohnungsliste und Wohnungsseite zeigen beide gleich. Hilfreich: Mit P-1 behoben, dann in allen Sprachen nummeriert anzeigen: de «1. UG / 2. UG», fr «1er sous-sol / 2e sous-sol», it «1° piano interrato / 2° piano interrato» (Wortlaut bitte fachlich prüfen lassen).
- **P-3:** Reproduktion: Sprache Français oder Italiano, Gebäudeseite Alpenblick. Hilfreich: Zwischenüberschriften mit grossem Anfangsbuchstaben («Sous-sol», «Rez-de-chaussée», «Piano interrato», «Pianterreno»); in Auswahl und Fliesstext kann es klein bleiben.

## Nicht geprüft

- Ob ein Stockwerk −2 auf anderem Weg als über die Auswahl gespeichert werden kann (etwa durch Manipulation der Anfrage): Das tut ein normaler Benutzer nicht, also habe ich es nicht versucht.
- Englisch: Das gehört nicht zur Aufgabe.
- Wo das Stockwerk sonst noch erscheint (Mietvertrag, Nebenkostenabrechnung, PDF): Dafür hätte ich einen Mietvertrag für die neuen Wohnungen anlegen müssen, was über die Aufgabe hinausgeht.
- Ob die Sortierung bei zwei Untergeschossen stimmt (2. UG vor 1. UG): Ohne 2. UG lässt sich das nicht prüfen.
