# Persona-Review: Anna, Issue #135, Runde 2 (Hinweis «Entwurf wiederhergestellt» bei gelöschtem Gebäude)

Persona: Anna, 29, erste Vermietung, kommt nach Monaten zurück und erinnert sich an nichts. Desktop 1440 × 900, Maus; der Hinweis zusätzlich auf 390 px Breite angeschaut.
App: Persona-App auf http://localhost:3300 (Demo-Daten). Gespeichert habe ich nur mein eigenes Gebäude «Anna Testhaus 2» und es danach wieder gelöscht, wie es die Aufgabe verlangt. Die Demo-Gebäude habe ich nicht verändert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/anna-issue-135-2/`. Ich habe die ganze Zeit dasselbe Browserfenster benutzt, damit der Entwurf im Browser erhalten bleibt.

Bewertet habe ich nur den Hinweis im wieder geöffneten Assistenten. Den neuen Satz habe ich so gesehen: «Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Dwello hat es aus der Auswahl entfernt. Prüfen Sie die Gebäude im Schritt «Gebäude».» P-3 aus Runde 1 (Hinweis lässt sich nicht schliessen) ist offene Arbeit in #201 und hier nicht noch einmal bewertet.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 (Runde 1) | behoben (Rest: Nit, siehe P-4) | Abrechnungen erstellen, Hinweis | Jetzt ist klar, was passiert ist: Das Gebäude gibt es nicht mehr, und **Dwello hat es aus der Auswahl entfernt**. Ich muss also nichts mehr abwählen, sondern nur noch prüfen, ob der Rest stimmt. Das war der wichtigere Teil von P-1. |
| P-2 (Runde 1) | behoben | Abrechnungen erstellen, Schritt 1 | «im Schritt «Gebäude»» sagt mir, wo ich prüfen soll. Auf dem Desktop steht direkt unter dem Hinweis die Schrittliste mit «2 Gebäude», und der Name stimmt genau mit dem Satz überein. Nach «Weiter» heisst die Karte ebenfalls «Gebäude» (Screenshot 10). Ich habe den Weg ohne Suchen gefunden. |
| P-4 | Nit | Abrechnungen erstellen, Hinweis | Der Hinweis nennt weiterhin nicht, **welches** Gebäude entfernt wurde. Nach Monaten weiss ich nicht mehr, was ich gewählt hatte. Hätte ich ein Gebäude aus Versehen gelöscht, merke ich hier nicht, welches es war. Da Dwello es schon entfernt hat und ich nichts mehr tun muss, ist das nur noch ein Schönheitsfehler. |
| P-5 | Nit | Abrechnungen erstellen, Schritt 1, Handy 390 px | Auf dem Handy zeigt der Fortschritt nur «Schritt 1 von 5: Abrechnungsperiode». Die Namen der anderen Schritte stehen nicht da (Screenshots 11 und 12, im Accessibility-Baum nur Absatz und Fortschrittsbalken). Den Schritt «Gebäude» aus dem Hinweis sehe ich erst nach «Weiter». Wer nicht darauf kommt, dass er weiter muss, sucht ihn vergeblich. |

## Beobachtungen

- «Gebäude» steht im Hinweis in Anführungszeichen, und links im Menü gibt es auch einen Punkt «Gebäude». Ich habe kurz überlegt, ob ich dort hinklicken soll. «im Schritt» macht klar, dass der Assistent gemeint ist. Wer schnell liest, landet vielleicht trotzdem in der Gebäudeliste und verlässt den Assistenten.
- Der Assistent öffnet nach dem Wiederherstellen wieder in Schritt 1, obwohl ich zuletzt in Schritt 2 war (schon in Runde 1 so).
- Die Schrittbeschriftungen brechen auf dem Desktop weiterhin mitten im Wort um: «Abrechnun / gsperiode», «Verwaltung / spauschale» (Screenshots 09 und 10; schon in Runde 1 so).
- Der Hinweis steht auch in Schritt 2 noch da, wo ich gerade prüfe (Screenshot 10). Das gehört zu #201.
- Musterhaus Zentrum ist weiter gewählt, aber seine Karte sagt «Für dieses Gebäude entsteht keine neue Abrechnung». Mit der verbliebenen Auswahl entsteht also nichts (Demo-Daten, schon in Runde 1 so).
- Wenn man das Handy-Fenster auf die Assistenten-Seite lädt, war die Seite nicht ganz oben, sondern mitten im Hinweis gescrollt (Screenshot 11). Das kann daran liegen, dass ich dasselbe Fenster schmal gemacht habe; auf einem echten Handy nicht geprüft.
- In Schritt 2 steht jetzt «1 von 3 gewählt», nur Musterhaus Zentrum ist angekreuzt. Die Auswahl stimmt.
- Die Meldung «Gebäude Anna Testhaus 2 gelöscht» habe ich diesmal vor dem Zurückgehen geschlossen, damit sie mir nicht verrät, welches Gebäude fehlt. So sieht es aus, wenn man nach Monaten zurückkommt.
- Auf 390 px ist der längere Satz gut lesbar, und es gibt kein seitliches Scrollen (`scrollWidth` 390).

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 12 Schritte (Gebäude erfassen 3, Assistent bis Schritt 2 und auswählen 3, Gebäude löschen 3, Assistent wieder öffnen und prüfen 3). Dazu ein Fehlgriff von mir: In der Gebäudeliste heisst auch der Link «Route planen zu Anna Testhaus 2» ähnlich, ich musste genau auf den Namen klicken.

## Ablauf

1. **Gebäude › Gebäude erfassen.** Erwartet: dasselbe Formular wie in Runde 1. Gesehen: «Neues Gebäude». Name «Anna Testhaus 2», Testweg 2, 3000 Bern, Kanton Bern (BE). «Gebäude erfassen» führt auf die Gebäudeseite mit «Noch keine Wohnungen» (Screenshot 03). Wie erwartet.
2. **Nebenkostenabrechnungen › Abrechnungen erstellen.** Erwartet: Schritt 1 mit Abrechnungsperiode. Gesehen: 01.01.2025 – 31.12.2025, kein Hinweis (Screenshot 04). «Weiter».
3. **Schritt 2, Gebäude.** «Anna Testhaus 2» und «Musterhaus Zentrum» angekreuzt. Danach stand «2 von 4 gewählt» und «Entwurf gespeichert, 14:35» da (Screenshot 06). Wie erwartet.
4. **Assistent verlassen, Gebäude löschen.** Über das Menü zu Gebäude › Anna Testhaus 2 › «Löschen». Der Dialog «Gebäude löschen?» nennt das Gebäude (Screenshot 07). Nach «Gebäude löschen» bin ich in der Liste, dort steht «Gebäude Anna Testhaus 2 gelöscht» (Screenshot 08). Die Meldung habe ich geschlossen.
5. **Assistent wieder öffnen.** Erwartet: ein Hinweis, der sagt, was mit dem fehlenden Gebäude passiert ist und wo ich prüfen soll. Gesehen (Screenshot 09): Infokasten «Entwurf wiederhergestellt», «Ihre Angaben, zuletzt am 15.10.2026 um 14:35 bearbeitet, sind wieder da.» und darunter «Ein Gebäude aus Ihren Angaben gibt es nicht mehr. Dwello hat es aus der Auswahl entfernt. Prüfen Sie die Gebäude im Schritt «Gebäude».», dann der Knopf «Entwurf verwerfen». Direkt darunter die Schrittliste mit «2 Gebäude».
   - Verstehe ich, was passiert ist? Ja. Das Gebäude ist weg, und Dwello hat es schon aus der Auswahl genommen. Ich muss nichts reparieren (P-1 behoben). Welches Gebäude, steht nicht da (P-4).
   - Weiss ich, wo ich prüfen soll? Ja: Der Satz nennt den Schritt, und ich sehe ihn in der Schrittliste (P-2 behoben).
6. **«Weiter» zu Schritt 2.** Erwartet: «Anna Testhaus 2» ist weg, «Musterhaus Zentrum» angekreuzt. Gesehen (Screenshot 10): Karte «Gebäude», drei Gebäude, nur Musterhaus Zentrum angekreuzt, «1 von 3 gewählt». Stimmt mit dem Hinweis überein.
7. **390 px Breite** (dasselbe Fenster schmal gemacht, Seite neu geladen): Der Hinweis bricht sauber um. Die Schrittliste fehlt aber, es steht nur «Schritt 1 von 5: Abrechnungsperiode» da (Screenshots 11 und 12; P-5).

## Verwirrung

- **Welches Gebäude?** Bleibt offen (P-4). Dass ich nichts mehr tun muss, ist jetzt klar, darum stört es weniger als in Runde 1.
- **«Gebäude» in Anführungszeichen:** meint den Schritt, nicht den Menüpunkt «Gebäude» links. Mit «im Schritt» davor habe ich es verstanden, aber kurz gezögert.
- **Auf dem Handy:** Wo ist der Schritt «Gebäude»? Ohne Schrittliste muss ich erraten, dass er nach «Weiter» kommt (P-5).
- **«Auswahl»:** Gemeint ist meine Auswahl in Schritt 2. Das war mir klar, weil der Satz gleich danach den Schritt nennt.

## Fehlerrisiken

- Wer ein Gebäude aus Versehen gelöscht hat, erfährt hier nicht, welches es war, und rechnet ohne es ab (P-4).
- Wer «Gebäude» als Menüpunkt liest und links auf «Gebäude» klickt, verlässt den Assistenten. Der Entwurf bleibt zwar gespeichert, aber man kommt vom Weg ab.

## Vorschläge

- **P-1, P-2:** Kein weiterer Vorschlag. Der neue Satz beantwortet beides.
- **P-4.** Reproduktion: Gebäude «Anna Testhaus 2» ohne Wohnungen erfassen, unter Abrechnungen erstellen in Schritt 2 «Anna Testhaus 2» und «Musterhaus Zentrum» wählen, Assistent verlassen, «Anna Testhaus 2» löschen, Löschmeldung schliessen, Assistent wieder öffnen. Der Hinweis nennt kein Gebäude. Hilfreich wäre der Name, falls Dwello ihn noch kennt, z. B. «Das Gebäude Anna Testhaus 2 gibt es nicht mehr.»
- **P-5.** Reproduktion wie bei P-4, aber mit 390 px Breite: Der Hinweis nennt den Schritt «Gebäude», der Fortschritt zeigt nur «Schritt 1 von 5: Abrechnungsperiode». Hilfreich wäre die Schrittnummer im Satz («im Schritt 2 «Gebäude»»). Dann passt er zu «Schritt 1 von 5» und ich weiss, dass ich einmal «Weiter» drücken muss.

## Nicht geprüft

- **Gelöschtes Heizprofil** (der zweite Satz dieser Art): Dafür hätte ich ein Heizprofil anlegen und löschen müssen. Die Aufgabe nennt nur das Gebäude.
- **Andere Sprachen** (fr, it, en): nicht angeschaut.
- **Echtes Handy:** Ich habe nur dasselbe Fenster auf 390 px verkleinert. Auf einem anderen Gerät gäbe es den Entwurf nicht. Ob die Seite dort auch mitten im Hinweis gescrollt öffnet, weiss ich nicht.
- **Schliessen des Hinweises:** offene Arbeit in #201, nicht bewertet.
- **Bildschirmleser-Ansage:** nicht Annas Bereich (Sven).
