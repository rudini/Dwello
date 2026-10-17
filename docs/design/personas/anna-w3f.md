# Persona-Review: Anna – Abrechnung aus dem Mietvertrag starten (w3f)

Persona: Anna, 29, erstmals Vermieterin, kommt nach Monaten zurück. Desktop 1440 × 900, Maus; Schritt 3 und Mietvertrag zusätzlich auf Mobile 390 × 844.
App: Persona-Stack http://localhost:3300, Deutsch. Nur angeschaut, nichts gespeichert oder erstellt (einzige Nicht-GET-Anfrage: `POST /statements/generate?/preview` beim Wechsel zur Vorschau).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/persona-anna/anna-w3f/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Assistent Schritt 3 (Hinweis oben) | Der Hinweis sagt «Heizprofil und Verwaltungspauschale kommen deshalb aus den Einstellungen». In den Einstellungen steht beim Standard-Heizprofil aber «Kein Vorschlag». Woher «Heizung + Warmwasser» kommt, kann ich nicht nachvollziehen; die Erklärung passt nicht zu dem, was ich nachschlagen kann. |
| P-2 | Major | Assistent Schritt 3 (Hinweis oben) | «Die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode sind verschieden eingestellt.» Ich weiss nicht, welche Abrechnungen gemeint sind, und es gibt keinen Link. Als ich die drei Entwürfe 2025 von Seepark selbst öffne, haben alle das Heizprofil «Heizung + Warmwasser». Bei zwei steht 3 %, bei einer 2.5 %. Die 2.5 % sind aber der eigene Satz im Mietvertrag von Marco Bernasconi. Für mich sehen sie also gleich eingestellt aus. Ich verstehe nicht, worauf ich achten soll. |
| P-3 | Minor | Assistent Schritt 3 | Dass der Assistent Schritt 1 und 2 für mich schon erledigt hat (Periode 2025, nur Seepark Residenz), steht nur in einer Zeile («Gewählt: …») und an den Häkchen. Dass dabei nur der Vertrag von Sarah Meier eine neue Abrechnung bekommt (die anderen 3 haben schon eine), erfahre ich erst in der Vorschau. |
| P-4 | Minor | Assistent Schritt 3 (Hilfetext Heizprofil) | Der Hilfetext zum Heizprofil ist 9 Zeilen lang und mischt Zählerstände, das Löschen von Entwürfen und Heizkostenverteiler. Der Satz, den ich brauche («wählen Sie das Profil, das Ihre Mietverträge vorsehen»), geht darin unter. Nach Monaten weiss ich nicht, was mein Mietvertrag vorsieht, und die Seite zeigt es mir nicht. |

## Beobachtungen

- Mietvertrag Sarah Meier: Der gelbe Kasten «4 Abrechnungen fehlen» mit den Knöpfen «2025 abrechnen», «2023 abrechnen», «2022 abrechnen» und «2021 abrechnen» ist gut sichtbar und klar. Ich habe sofort gewusst, worauf ich klicken muss.
- Im selben Kasten steht «Erfassen Sie zuerst die Rechnungen der Periode», aber es gibt keinen Link zu den Rechnungen 2025. Nur weiter unten unter «Dazu gehört» steht «Rechnungen des Gebäudes», ohne Jahr.
- «Mietstage» (im Kasten auf dem Mietvertrag und in der Liste der Abrechnungen, z. B. «365 Mietstage») habe ich zuerst für einen Tippfehler von «Miettage» gehalten.
- Die Übersicht sagt «Noch nicht abgerechnet: Alpenblick, Seepark Residenz». In Schritt 2 steht aber, dass in Seepark 3 von 4 Mietverträgen schon eine Abrechnung 2025 haben. «Noch nicht abgerechnet» heisst also «nicht ganz abgerechnet».
- In Schritt 1 (über den Fortschritt zurück) steht «Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen». Ich bin aber über «2025 abrechnen» gekommen, die Periode kam also vom Mietvertrag.
- In der Schrittanzeige auf Desktop werden Wörter mitten im Wort getrennt: «Abrechnun / gsperiode» und «Verwaltung / spauschale». Das sieht kaputt aus.
- Vorschau: Unter dem gelben Kasten «Es gibt schon Abrechnungen» steht die Checkbox «Die Abrechnungen trotzdem erstellen». Es entsteht ja nur eine Abrechnung, die von Sarah Meier. Ob ich das Häkchen setzen muss und ob dann Doppelte entstehen, verstehe ich nicht.
- Vorschau: Die Kästchen «Heizprofil: Heizung + Warmwasser» und «Verwaltungspauschale: 3 % … Ein eigener Satz im Mietvertrag geht vor» fassen gut zusammen, was gilt. Das hätte ich gern schon in Schritt 3 so gelesen.
- Mobile 390 px: Mietvertrag und Schritt 3 lassen sich nicht seitlich scrollen (scrollWidth 390). Der Hinweis oben braucht dort aber fast den ganzen ersten Bildschirm.

## Aufgabe geschafft: ja

Den Mietvertrag gefunden, den Assistenten über «2025 abrechnen» geöffnet, Schritt 3 beurteilt und bis zur Vorschau gegangen. Dort habe ich wie verlangt aufgehört, ohne etwas zu erstellen. Verstanden, woher Heizprofil und Pauschale kommen, habe ich aber nicht (P-1, P-2).

## Aufwand

Etwa 15 Minuten. Bis zur Vorschau braucht es 4 Klicks (Mietverträge → Sarah Meier → «2025 abrechnen» → «Weiter»). Für den Versuch, Schritt 3 zu verstehen, habe ich zusätzlich etwa 8 Seiten geöffnet: Einstellungen, Liste der Abrechnungen, 3 Entwürfe und 3 Mietverträge.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis, was zu tun ist. Gesehen: «Nebenkostenabrechnungen erstellen … Noch nicht abgerechnet: Alpenblick, Seepark Residenz». Gut.
2. **Mietverträge → Sarah Meier.** Erwartet: ihr Vertrag als beendet markiert. Gesehen: In der Liste steht «Beendet, 01.08.2021 – 30.06.2025, gekündigt». Auf der Detailseite steht oben der gelbe Kasten «4 Abrechnungen fehlen» mit Knöpfen pro Jahr. Für 2024 gibt es keinen Knopf, und tatsächlich hat Sarah eine bezahlte Abrechnung 2024. Klar.
3. **«2025 abrechnen».** Erwartet: Der Assistent beginnt bei Schritt 1, oder er sagt mir, dass er schon etwas gewählt hat. Gesehen: Er öffnet direkt bei «Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Schritt 1 und 2 haben Häkchen. Im blauen Kasten steht «Gewählt: Seepark Residenz, Abrechnungsperiode 01.01.2025 – 31.12.2025». Dass Periode und Gebäude gewählt sind, habe ich verstanden.
4. **Schritt 3 lesen.** Erwartet: ein Satz, warum genau dieses Heizprofil und diese Pauschale vorgewählt sind. Gesehen: «Die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode sind verschieden eingestellt. Heizprofil und Verwaltungspauschale kommen deshalb aus den Einstellungen.» Vorgewählt sind «Heizung + Warmwasser (100%)» mit Monatsbalken und 3 %. Welche «übrigen» Abrechnungen gemeint sind und warum «verschieden», habe ich nicht verstanden.
5. **Einstellungen nachgeschaut.** Erwartet: dort «Heizung + Warmwasser» und 3 %. Gesehen: Verwaltungspauschale 3 % stimmt. Beim Standard-Heizprofil steht aber «Kein Vorschlag» (P-1).
6. **Die drei Entwürfe 2025 von Seepark angeschaut** (Thomas Weber, Nina Brunner, Marco Bernasconi). Erwartet: verschiedene Einstellungen. Gesehen: Alle haben «Heizung + Warmwasser», die Pauschale ist 3 %, 3 % und 2.5 %. Laut Mietvertrag hat Bernasconi einen eigenen Satz von 2.5 %, die anderen «Satz des Abrechnungslaufs». Ich sehe keinen Unterschied (P-2).
7. **Zurück zu Schritt 2 geschaut.** Gesehen: Nur Seepark ist angehakt, mit «Von 4 Mietverträgen … haben 3 schon eine Abrechnung». Damit ist mir klar, dass nur Sarah neu dazukommt. Das hätte ich gern schon in Schritt 3 gewusst (P-3).
8. **«Weiter» zur Vorschau.** Erwartet: was entsteht. Gesehen: 1 Abrechnung (Sarah Meier, Wohnung A2), Kosten CHF 1'457.98, Nachzahlung CHF 137.95, Heizprofil «Heizung + Warmwasser», Pauschale 3 %. Dazu der Hinweis zum Tankbestand, der gelbe Kasten «Es gibt schon Abrechnungen» und die Checkbox «Die Abrechnungen trotzdem erstellen». Hier habe ich aufgehört.

## Verwirrung

- «Die übrigen Nebenkostenabrechnungen»: Welche sind das? Die von anderen Gebäuden oder die anderen Mieter in Seepark?
- «verschieden eingestellt»: Was ist verschieden? Ich sehe es nirgends.
- «aus den Einstellungen»: Die Einstellungen sagen beim Heizprofil «Kein Vorschlag».
- «das Profil, das Ihre Mietverträge vorsehen»: Auf dem Mietvertrag in Dwello steht kein Heizprofil.
- «Satz des Abrechnungslaufs» (auf dem Mietvertrag): «Abrechnungslauf» kommt im Assistenten nicht als Wort vor.
- «Mietstage».
- «Die Abrechnungen trotzdem erstellen»: Muss ich das ankreuzen, damit Sarahs Abrechnung entsteht?

## Fehlerrisiken

- Weil der Hinweis behauptet, die Werte kämen aus den Einstellungen, übernehme ich sie ungeprüft. Wäre für Seepark ein anderes Heizprofil richtig, stimmt bei Sarah (Auszug Mitte Jahr) die Heizkostenverteilung nicht. Bei ihr wirkt das Profil wirklich, weil sie nur ein halbes Jahr gemietet hat.
- Ich könnte das Heizprofil ändern, damit es zu «verschieden eingestellt» passt. Dann wäre Sarahs Abrechnung anders als die von Nina Brunner, ihrer Nachmieterin in derselben Wohnung, und die Heizkosten von A2 im Jahr gingen nicht mehr auf.
- Die Checkbox «trotzdem erstellen» lädt dazu ein, auch Doppelte anzunehmen. Ich kreuze sie vielleicht an, ohne zu wissen, was sie bewirkt.

## Vorschläge

- **P-1:** Mietvertrag Sarah Meier → «2025 abrechnen» → Schritt 3 lesen → Einstellungen öffnen: Dort steht «Standard-Heizprofil: Kein Vorschlag». Hilfreich wäre ein Satz, der die echte Quelle nennt, etwa «Kein Heizprofil in den Einstellungen; vorgewählt ist …, prüfen Sie es». Oder der Hinweis nennt «aus den Einstellungen» nur, wenn dort tatsächlich etwas steht. Am besten mit Link zu den Einstellungen.
- **P-2:** Wie P-1 bis Schritt 3. Dann Nebenkostenabrechnungen → Gebäude Seepark: Die drei Entwürfe 2025 zeigen alle «Heizung + Warmwasser» und 3 %, ausser dem eigenen Satz 2.5 % im Vertrag. Hilfreich wäre es, die übrigen Abrechnungen beim Namen zu nennen (Gebäude, Anzahl) und zu zeigen, was bei ihnen verschieden ist (z. B. «2 mit Heizung + Warmwasser, 1 mit …»). Dazu ein Link «Abrechnungen ansehen» wie in der Vorschau. Und ein Satz, was ich tun soll: dasselbe wie bei den bestehenden wählen.
- **P-3:** Wie P-1 bis Schritt 3. Hilfreich wäre im blauen Kasten ein Satz wie «Es entsteht 1 neue Abrechnung: Sarah Meier, Wohnung A2. Die anderen 3 Mietverträge haben schon eine.»
- **P-4:** Wie P-1 bis Schritt 3. Hilfreich wäre ein kurzer erster Satz, der sagt, was ich tun soll. Die Sonderfälle (Zählerstände, Heizkostenverteiler) könnten als eigener, kürzerer Absatz darunter stehen. Falls Dwello weiss, welches Profil die Abrechnungen 2025 von Seepark schon nutzen, sollte es das sagen.

## Nicht geprüft

- Schritt 5 «Erstellen» und das Speichern: laut Auftrag nur ansehen, nichts erstellen.
- Was die Checkbox «Die Abrechnungen trotzdem erstellen» bewirkt, und ob «Weiter» ohne sie gesperrt ist: nicht ausprobiert, um nichts auszulösen.
- Der Fall, in dem die übrigen Abrechnungen gleich eingestellt sind und der Hinweis vermutlich anders lautet: Dafür gab es keinen Datenstand, ohne etwas zu ändern.
- Die anderen Knöpfe («2023/2022/2021 abrechnen») und die Vorschau auf Mobile.
