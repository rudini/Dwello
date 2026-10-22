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

## Zweiter Durchgang

Nach der Korrektur von P-1. Persona: Dr. Weber, Desktop 1440 × 900, Maus. App: http://localhost:3300 mit frischen Demodaten. Gebäude: wieder Alpenblick (Bergstrasse 8, 3800 Interlaken), damit ich mit dem ersten Durchgang vergleichen kann.
Aufgabe: eine Wohnung im ersten und eine im zweiten Untergeschoss erfassen; prüfen, wie die Stockwerke in der Auswahl, auf der Gebäudeseite und auf der Wohnungsseite heissen, auf Deutsch, Französisch und Italienisch, und ob das eindeutig ist.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | behoben | Neue Wohnung / Wohnung bearbeiten, Feld «Stockwerk» | Die Auswahl bietet jetzt «2. UG» und «UG». Die Wohnung im 2. UG liess sich erfassen und speichern; beim Bearbeiten ist «2. UG» vorausgewählt. |
| P-2 | behoben | Gebäudeseite, Wohnungsliste, Wohnungsseite (de/fr/it) | Die beiden Wohnungen sind jetzt getrennt: «2. UG» / «2e sous-sol» / «2° piano interrato» und «UG» / «sous-sol» / «piano interrato». Die Reihenfolge stimmt (2. UG oberhalb von UG, dann EG). |
| P-4 | Minor | Auswahl, Gebäudeseite, Wohnungsliste, Wohnungsseite (de/fr/it) | Das obere Untergeschoss heisst ohne Nummer «UG» / «sous-sol» / «piano interrato», das untere mit Nummer «2. UG» / «2e sous-sol» / «2° piano interrato». Aus der Reihenfolge erschliesse ich, dass «UG» das 1. UG ist; auf der Wohnungsseite steht aber allein «Stockwerk: UG», ohne die Reihe daneben. In einem Gebäude mit zwei Untergeschossen ist das nicht eindeutig; ich erwarte «1. UG» / «1er sous-sol» / «1° piano interrato». |
| P-5 | Nit | Neue Wohnung / Wohnung bearbeiten, Hilfetext beim Feld «Stockwerk» | Der Hilfetext lautet weiterhin «Lage der Wohnung im Gebäude: UG, EG, 1. OG, 2. OG usw.» (fr «sous-sol, rez-de-chaussée, 1er étage, 2e étage, etc.», it «piano interrato, pianterreno, 1° piano, 2° piano ecc.»). Das neue «2. UG» erwähnt er nicht. |
| P-3 | Nit (unverändert) | Gebäudeseite, Französisch und Italienisch | Die Zwischenüberschriften beginnen weiterhin klein, jetzt auch die neue: «2e sous-sol», «sous-sol», «rez-de-chaussée»; «2° piano interrato», «piano interrato», «pianterreno». |

### Beobachtungen

- Die Stockwerksnamen sind in Auswahl, Gebäudeseite, Wohnungsliste und Wohnungsseite in allen drei Sprachen dieselben Wörter. Das ist gut so.
- Die französische Ordnungszahl «2e sous-sol» und die italienische «2° piano interrato» halte ich für die Schweiz für korrekt, passend zu «2e étage» und «2° piano».
- Die Auswahl reicht nach unten nur bis «2. UG». Ein drittes Untergeschoss kommt bei Wohnungen selten vor; ich vermisse es für diese Aufgabe nicht.
- Unverändert aus dem ersten Durchgang: «1.5 pièce» (Einzahl) neben «2 pièces» und Punkt statt Komma als Dezimalzeichen auf Französisch; nicht Teil dieser Aufgabe.
- Das Speichern beider Wohnungen klappte ohne Fehlermeldung; nach dem Speichern landete ich jeweils auf der neuen Wohnungsseite.

### Aufgabe geschafft: ja

Beide Stockwerke sind wählbar, beide Wohnungen sind mit dem richtigen Geschoss gespeichert und werden überall getrennt angezeigt. Eindeutig ist es mit der Einschränkung P-4.

### Aufwand

Etwa 6 Minuten, rund 20 Schritte (Gebäude öffnen, zweimal «Wohnung erfassen», Gebäudeseite, Wohnungsliste, zwei Wohnungsseiten, Bearbeiten-Formular; Sprache auf Français und Italiano wechseln und dieselben Seiten wieder ansehen; zurück auf Deutsch).

### Ablauf

1. **Gebäude → Alpenblick.** Erwartet: wie beim ersten Mal EG, 1. OG, 2. OG. Gesehen: genau das, 3 Wohnungen.
2. **«Wohnung erfassen», Feld «Stockwerk».** Erwartet: «2. UG, 1. UG, EG …». Gesehen: «Stockwerk wählen, 2. UG, UG, EG, 1. OG … 6. OG». Das 2. UG ist da; das obere Untergeschoss heisst aber weiterhin nur «UG». Der Hilfetext darüber nennt «UG, EG, 1. OG, 2. OG usw.», das 2. UG nicht.
3. **Wohnung U1.01 erfassen** (UG, 45 m², 2 Zimmer). Gespeichert, Weiterleitung auf die Wohnungsseite.
4. **Wohnung U2.01 erfassen** (2. UG, 38 m², 1.5 Zimmer). Gespeichert, diesmal ohne Umweg.
5. **Gebäudeseite Alpenblick.** Erwartet: zwei getrennte Gruppen, das tiefere Geschoss zuerst. Gesehen: Zwischenüberschriften «2. UG» (U2.01), «UG» (U1.01), «EG», «1. OG», «2. OG»; oben «5, davon 2 vermietet und 3 leer». Wie erwartet, bis auf das unnummerierte «UG».
6. **Wohnungsliste, gefiltert auf Alpenblick.** Gesehen: U2.01 mit «2. UG», U1.01 mit «UG», dann EG, OG1, OG2. Reihenfolge stimmt.
7. **Wohnungsseiten.** U1.01: «Stockwerk: UG». U2.01: «Stockwerk: 2. UG». Erwartet hätte ich bei U1.01 «1. UG»: Wer nur diese Seite liest, weiss nicht, dass es darunter noch ein Geschoss gibt, und «UG» allein könnte auch «irgendein Untergeschoss» heissen.
8. **Wohnung U2.01 bearbeiten.** Dieselbe Auswahl, «2. UG» vorausgewählt. Richtig.
9. **Sprache Français.** Auswahl «Choisir l’étage, 2e sous-sol, sous-sol, rez-de-chaussée, 1er étage …». Gebäudeseite (Screenshot: unter «Appartements» die klein geschriebenen Zwischentitel «2e sous-sol» mit Appartement U2.01, «sous-sol» mit U1.01, dann «rez-de-chaussée», «1er étage», «2e étage»), Liste und Wohnungsseiten («Étage: sous-sol» bzw. «Étage: 2e sous-sol») einheitlich.
10. **Sprache Italiano.** Auswahl «Scegliere il piano, 2° piano interrato, piano interrato, pianterreno, 1° piano …». Gebäudeseite, Liste und Wohnungsseiten («Piano: piano interrato» bzw. «Piano: 2° piano interrato») einheitlich, Überschriften klein.
11. **Sprache zurück auf Deutsch.** Klappt, das Menü zeigt wieder «Sprache: Deutsch».

### Verwirrung

- «UG» neben «2. UG»: Wo es ein «2.» gibt, erwarte ich auch ein «1.». Ohne Nummer frage ich mich kurz, ob «UG» etwas anderes meint als das 1. Untergeschoss. In der Auswahl löst die Reihenfolge das auf, auf der Wohnungsseite nicht.
- Gleiches im Französischen («sous-sol» neben «2e sous-sol») und Italienischen («piano interrato» neben «2° piano interrato»).

### Fehlerrisiken

- Wird die Stockwerksangabe der Wohnungsseite später anderswo übernommen (etwa in die Bezeichnung des Mietobjekts im Mietvertrag), steht dort für die Wohnung im 1. UG nur «UG». In einem Gebäude mit zwei Untergeschossen ist das eine ungenaue Objektbezeichnung. Das ist weniger schwer als die falsche Angabe aus dem ersten Durchgang, aber nicht ganz sauber.

### Vorschläge

- **P-4:** Reproduktion: Gebäude Alpenblick → «Wohnung erfassen» → Stockwerk «UG» speichern, dann eine zweite mit «2. UG»; Wohnungsseite der ersten zeigt «Stockwerk: UG». Hilfreich: das obere Untergeschoss «1. UG» / «1er sous-sol» / «1° piano interrato» nennen, in Auswahl und Anzeige gleich (Wortlaut fachlich prüfen lassen). Bestehende Wohnungen mit «UG» würden dann ebenfalls «1. UG» heissen, was auch bei nur einem Untergeschoss korrekt ist.
- **P-5:** Reproduktion: «Wohnung erfassen» → Hilfetext beim Feld «Stockwerk». Hilfreich: «Lage der Wohnung im Gebäude: 2. UG, 1. UG, EG, 1. OG usw.» und entsprechend in fr/it.
- **P-3:** wie im ersten Durchgang: Zwischenüberschriften auf der Gebäudeseite gross beginnen («2e sous-sol» bleibt, «Sous-sol», «Rez-de-chaussée»; «Piano interrato», «Pianterreno»).

### Nicht geprüft

- Englisch: nicht Teil der Aufgabe.
- Wo das Stockwerk sonst erscheint (Mietvertrag, Abrechnung, PDF): dafür hätte ich Mietverträge für die neuen Wohnungen anlegen müssen, was über die Aufgabe hinausgeht.
- Ein drittes Untergeschoss: wird nicht angeboten; ob das gewollt ist, kann ich als Benutzer nicht beurteilen.
- Die Ansicht auf dem Telefon: nicht mein Gerät.
