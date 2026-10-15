# Persona-Lauf: Helga – Issue #142 (Warnung «Abrechnungen fehlen» auf dem Mietvertrag)

Persona: Helga, 68, hat eine Wohnung geerbt, wenig Computererfahrung, unsicher bei Fachbegriffen. Desktop 1440 × 900, Zoom 150 % (Gegenprobe 200 %), Maus.
Aufgabe: Die Mietverträge von Hans Müller (Musterhaus Zentrum, seit 01.03.2021) und Laura Keller (Alpenblick, seit 01.11.2022) öffnen und nur die neue Warnung beurteilen. Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-142/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag Hans Müller / Laura Keller | Die Warnung verlangt Abrechnungen für 2021, 2022 und 2023, also Jahre, die ich vielleicht auf Papier oder gar nicht mit Dwello gemacht habe. Es gibt keinen Weg zu sagen «schon ausserhalb von Dwello erledigt». Die Warnung bleibt also für immer stehen, oder ich erstelle Abrechnungen ohne Rechnungen. Die Übersicht nennt dagegen nur «Alpenblick» für 2025. |
| P-2 | Minor | Mietvertrag, Knöpfe «Abrechnung {Jahr} erstellen» | Der Knopf klingt nach «die Abrechnung für diesen Mieter». Er führt aber in den Assistenten «Abrechnungen erstellen» für das ganze Gebäude (bei Müller 2021 sind es 3 Abrechnungen: Müller, Rossi, Fischer). Ausserdem landet man direkt in Schritt 3 von 5. |
| P-3 | Minor | Mietvertrag, Text der Warnung | Die Warnung sagt nicht, dass ich zuerst die Rechnungen des Jahres erfassen muss. Das steht erst in der Vorschau des Assistenten («Rechnungen fehlen … die Mieter erhalten ihr Akonto weitgehend zurück»). Die Übersicht sagt es dagegen gleich. |
| P-4 | Nit | Mietvertrag Laura Keller | Die Liste springt von 2025 auf 2023. Dass 2024 fehlt, weil es erledigt ist, steht nirgends. Ich habe zuerst gedacht, 2024 sei vergessen gegangen. |

## Beobachtungen

- Das Hauptmenü ist hinter einem Knopf mit drei Strichen versteckt. Auf der Übersicht habe ich zuerst «Mietvertrag erfassen» angeklickt, weil ich «Mietverträge» gesucht habe, und bin im Assistenten für einen neuen Vertrag gelandet.
- Im Assistenten ist der Hilfetext zum Heizprofil sehr lang (ein ganzer Absatz mit Zählern, Heizkostenverteilern und Entwürfen löschen). Für mich ist das schwer zu lesen.
- Die Vorschau warnt bei 2021 deutlich vor fehlenden Rechnungen und fehlendem Tankbestand. Das hat mich beruhigt: Ich wäre nicht aus Versehen weitergegangen.
- Auf der Liste der Nebenkostenabrechnungen zum Vertrag von Hans Müller stehen nur 2024 und 2025. Das passt zur Warnung.

## Aufgabe geschafft: ja

Beide Verträge geöffnet und die Warnung gelesen. Die Knöpfe habe ich bis zur Vorschau verfolgt, ohne etwas zu erstellen.

## Aufwand

Etwa 15 Minuten, rund 12 Schritte (einmal falsch abgebogen über «Mietvertrag erfassen»).

## Ablauf

1. **Übersicht.** Erwartet: ein Link «Mietverträge». Gesehen: Nur «Mietvertrag erfassen» unter «Häufige Arbeiten». Ich habe darauf geklickt und landete in «Neuer Mietvertrag, Schritt 1 von 5». Ich bin zurück und habe das Menü (drei Striche) gefunden, darin «Mietverträge».
2. **Liste der Mietverträge.** Erwartet: Hans Müller und Laura Keller in der Liste. Gesehen: 11 Mietverträge, beide mit «Laufend, seit …». In der Liste gibt es keinen Hinweis auf fehlende Abrechnungen. Das ist in Ordnung, ich habe ihn erst im Vertrag erwartet.
3. **Vertrag Hans Müller.** Erwartet: höchstens ein Hinweis auf das letzte Jahr. Gesehen (Screenshot `05-mueller.png`): Ein beiger Kasten mit Warndreieck direkt unter dem Titel, «3 Abrechnungen fehlen». Darunter steht «Der Mietvertrag hat Mietstage in diesen Abrechnungsperioden, aber noch keine Nebenkostenabrechnung. Erstellen Sie sie im Assistenten, eine Periode nach der anderen.» und es folgen drei Knöpfe: «Abrechnung 2023 erstellen», «Abrechnung 2022 erstellen», «Abrechnung 2021 erstellen». Das Neueste steht zuerst. Ich habe sofort gesehen, dass etwas fehlt und welche Jahre. Mein erster Gedanke war aber: «2021? Damals hatte ich Dwello doch noch gar nicht.» (P-1)
4. **Vertrag Laura Keller.** Erwartet: «Abrechnung 2025 fehlt», weil ich weiss, dass Alpenblick 2025 noch offen ist. Gesehen (`06-keller.png`): Auch hier «3 Abrechnungen fehlen» mit 2025, 2023 und 2022. 2024 fehlt in der Liste, ohne Erklärung (P-4). Die Einzahl-Fassung «Abrechnung 2025 fehlt» habe ich bei keinem der beiden Verträge gesehen.
5. **Bei 200 % Zoom** (`12-keller-200.png`): Der Kasten ist gut lesbar, die Knöpfe brechen sauber um, es gibt keine Bildlaufleiste zur Seite.
6. **Knopf «Abrechnung 2025 erstellen» (Keller).** Erwartet: eine Abrechnung für Laura Keller. Gesehen (`07-keller-2025.png`): «Abrechnungen erstellen … für ganze Gebäude», Schritt 3 von 5. Gebäude Alpenblick und Periode 01.01.2025 – 31.12.2025 sind schon gewählt. Dass es um das ganze Gebäude geht, hat mich überrascht (P-2). Positiv: Gebäude und Jahr stimmen.
7. **Knopf «Abrechnung 2022 erstellen» (Keller)** (`08-keller-2022.png`): Gleich, mit der Periode 2022. Das stimmt.
8. **Knopf «Abrechnung 2021 erstellen» (Müller), dann «Weiter» bis zur Vorschau** (`11-mueller-2021-vorschau.png`): Die Vorschau zeigt 3 Abrechnungen, Kosten CHF 0.00, «Rechnungen fehlen» und den Hinweis zum Tankbestand. Hans Müller bekäme CHF 2'400.00 zurück. Erst hier habe ich verstanden, dass ich für 2021 zuerst Rechnungen bräuchte (P-3). Ich habe nichts erstellt.
9. **«Dazu gehört › Nebenkostenabrechnungen» (Müller)** (`10-mueller-nka.png`): Zwei Abrechnungen, 2025 «Versendet» und 2024 «Bezahlt». Das bestätigt die Warnung.

## Verwirrung

- **Mietstage:** Ich habe es als «Tage, an denen die Wohnung vermietet war» verstanden. Ganz sicher war ich nicht, eine Erklärung am Text fehlt.
- **Abrechnungsperiode:** Auf den Knöpfen stehen nur Jahre, im Text «Abrechnungsperioden». Dass beides dasselbe ist, habe ich erraten.
- **«im Assistenten»:** Welcher Assistent? Erst nach dem Klick war klar, dass «Abrechnungen erstellen» gemeint ist.
- **Warum 2021–2023?** Die Übersicht sagt «Noch nicht abgerechnet: Alpenblick» (nur 2025), der Vertrag sagt dagegen drei Jahre. Wem soll ich glauben?

## Fehlerrisiken

- Ich könnte für alte Jahre ohne Rechnungen Abrechnungen erstellen, nur damit die Warnung verschwindet. Die Mieter bekämen dann ihr ganzes Akonto zurück (Vorschau 2021: CHF 2'400.00 für Müller, CHF 4'200.00 für Rossi). Der Assistent warnt zwar, aber mit «Die Abrechnungen trotzdem erstellen» geht es trotzdem weiter.
- Über den Knopf beim einen Mieter entstehen auch Entwürfe für andere Mieter desselben Gebäudes, ohne dass ich das vorher wusste.

## Vorschläge

- **P-1:** Vertrag Hans Müller öffnen. Die Warnung nennt 2021–2023, die Übersicht nur Alpenblick 2025. Was helfen würde: ein Satz, was zu tun ist, wenn die Abrechnung ausserhalb von Dwello gemacht wurde. Zum Beispiel «Haben Sie diese Abrechnung ausserhalb von Dwello erstellt? Dann …», mit einer Möglichkeit, die Periode als erledigt zu kennzeichnen. Oder die Warnung nur ab dem Zeitpunkt zeigen, ab dem ich Dwello nutze. Ausserdem sollten Übersicht und Vertrag dasselbe sagen.
- **P-2:** Vertrag Hans Müller › «Abrechnung 2021 erstellen» › Assistent für ganz Musterhaus Zentrum. Was helfen würde: ein Knopftext oder Satz wie «Abrechnungen 2021 für Musterhaus Zentrum erstellen» oder «Es entstehen Entwürfe für alle Mietverträge des Gebäudes».
- **P-3:** Vertrag Laura Keller › Warnung lesen. Dass Rechnungen nötig sind, steht nicht da. Was helfen würde: «Erfassen Sie zuerst die Rechnungen dieser Periode», wie auf der Übersicht, eventuell mit einem Link auf die Rechnungen des Jahres.
- **P-4:** Vertrag Laura Keller: Die Liste lautet 2025, 2023, 2022. Was helfen würde: eine kurze Zeile «2024 ist abgerechnet» oder die Jahre im Text nennen, etwa «Es fehlen: 2025, 2023, 2022».

## Nicht geprüft

- Die Einzahl-Fassung «Abrechnung 2025 fehlt»: Beide genannten Verträge zeigen drei fehlende Abrechnungen. Einen Vertrag mit genau einer fehlenden Periode habe ich nicht gesucht, weil die Aufgabe nur diese zwei Verträge nennt.
- Ob die Warnung nach dem Erstellen einer Abrechnung kürzer wird: Ich sollte nichts speichern.
- Andere Sprachen und das Handy: nicht Teil meines Profils.
