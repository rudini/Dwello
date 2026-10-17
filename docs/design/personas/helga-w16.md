# Helga, Runde w16: Brennstoff-Kategorie und Tankbestand (Stückholz)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack http://localhost:3300 (Deutsch). Gespeichert nur im Gebäude «Seepark Residenz» und in der eigenen Kategorie «Stückholz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/6a612fe5-db6f-5ef4-85c5-983800bc9434/scratchpad/helga-w16/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Kategorie bearbeiten (Stückholz) | Wenn ich nur das Häkchen «Heizkosten nach dem Heizprofil verteilen» entferne, verschwindet das Feld «Brennstoff». Die Ablehnung sagt dann «… bleibt deshalb Brennstoff. Soll sie kein Brennstoff sein …», obwohl ich am Brennstoff nichts geändert habe und das Feld nicht mehr sehe. Dass die Heizprofil-Änderung wegen der Tankbestände abgelehnt wird, sagt sie nicht. |
| P-2 | Minor | Kategorie bearbeiten (Heizung), Gebäudeseite Tankbestand | Die vordefinierte «Heizung» trägt das Häkchen «Brennstoff», aber ihr Rechtshinweis direkt darüber nennt «Brennstoff, Energie, Wartung und Betrieb der Heizung», und der Brennstoff-Hilfetext sagt «Service, Wartung und Kaminfeger sind kein Brennstoff». Ich weiss nicht, ob ich eine Wartungsrechnung noch unter «Heizung» erfassen darf. Beim Tankbestand bietet die Auswahl neben «Stückholz» auch «Heizung» an. |
| P-3 | Minor | Neue Kategorie | «Brennstoff» erscheint erst, wenn ich «Heizkosten nach dem Heizprofil verteilen» ankreuze. Wer ein Brennstoff-Feld sucht, findet es nicht, und nichts im Formular sagt, dass es dort auftaucht. Ich habe es nur gefunden, weil ich das Heizprofil-Häkchen aus Neugier gesetzt habe. |
| P-4 | Minor | Kategorie-Liste | Die Liste zeigt bei jeder Kategorie «Von Dwello/Eigene» und «Umlagefähig», aber nicht, welche Kategorie Brennstoff ist. Um herauszufinden, ob «Heizung» oder «Kaminfeger» Brennstoff ist, musste ich beide öffnen. |
| P-5 | Nit | Gebäudeseite, Tankbestand | Der Hilfetext hat 7 Sätze mit Rechenregeln (Anfangsbestand + Einkauf − Endbestand, Preis der letzten Lieferung, Rest zum Preis der Lieferung davor). Das ist richtig, aber für mich zu viel auf einmal. «Tankbestand» als Titel für ein Holzlager im Keller passt nicht ganz; der Text sagt immerhin «Tank oder Lager». |

## Beobachtungen

- Die Ablehnung beim Entfernen des Brennstoff-Häkchens hat eine rote Box oben im Formular: «Kategorie wurde nicht gespeichert – Die Kategorie hat Tankbestände und bleibt deshalb Brennstoff. Soll sie kein Brennstoff sein, löschen Sie zuerst ihre Tankbestände auf der Seite des Gebäudes.» Sie sagt klar, was passiert ist und was ich tun muss. Sie nennt nicht, welches Gebäude, aber bei mir gibt es nur eines mit Tankbestand.
- Nach der Ablehnung bleibt meine Eingabe stehen (Brennstoff nicht angekreuzt). Ein zweites Speichern ergibt dieselbe Meldung. Nach dem Neuladen ist das Häkchen wieder gesetzt, also wurde nichts geändert.
- Beim Tankbestand ist «Stückholz» schon vorausgewählt (es steht vor «Heizung»). Für mich passte das, aber wer mit Öl heizt und meine Kategorie nicht kennt, könnte aus Versehen bei der falschen speichern.
- Nach dem Speichern des Tankbestands steht «Bestand gespeichert.» unter der Auswahl, und oben in der Liste erscheint die Zeile «31.12.2025 Stückholz CHF 1’320.00» mit «Löschen». Gut.
- Die Einheit «Ster» im Hilfetext freut mich: Holz wird so gemessen.
- Beim Anlegen der Kategorie habe ich nach dem Speichern keine Erfolgsmeldung bemerkt; ich landete wieder auf der Liste, wo «Stückholz» zuoberst stand. Das hat mir genügt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 11 kleine Durchgänge: Menü, Einstellungen, Kategorien, Formular «Neue Kategorie», speichern, Heizung, Kaminfeger und Stückholz öffnen, Gebäude, Tankbestand speichern, Brennstoff entfernen, Heizprofil entfernen.

## Ablauf

1. **Übersicht > Menü > Einstellungen.** Erwartet: Kategorien unter Einstellungen. Gesehen: «Stammdaten» mit dem Link «Kategorien» und dem Satz «Kostenarten, nach denen Sie Rechnungen einordnen». Gefunden.
2. **Kategorien > «Kategorie erfassen».** Erwartet: ein Feld, mit dem ich sage, dass es Heizmaterial ist. Gesehen: Name, Beschreibung, Umlagefähig/Nicht umlagefähig, «Heizkosten nach dem Heizprofil verteilen», Reihenfolge, Übersetzungen. Kein «Brennstoff». Zuerst dachte ich, das gibt es hier nicht (P-3).
3. **Name «Stückholz», Umlagefähig, Heizprofil-Häkchen gesetzt.** Erst jetzt erscheint darunter das Häkchen «Brennstoff» mit Hilfetext (Screenshot `06-neu-ausgefuellt.png`). Ich kreuze es an und speichere. Erwartet: die Kategorie in der Liste. Gesehen: «Stückholz», «Eigene», «Umlagefähig», «0 Rechnungen».
4. **Heizung und Kaminfeger öffnen.** Erwartet: zu sehen, welche Brennstoff ist. Gesehen: Bei Heizung ist «Brennstoff» angekreuzt, bei Kaminfeger nicht (Screenshot `09-heizung.png`, `10-kaminfeger.png`). Der Hilfetext erklärt es: «Service, Wartung und Kaminfeger sind kein Brennstoff». Damit verstehe ich, warum Kaminfeger keiner ist. Bei Heizung bin ich unsicher, weil dort auch Wartung dazugehört (P-2).
5. **Gebäude > Seepark Residenz.** Erwartet: irgendwo «Tankbestand». Gesehen: ganz unten, nach den Wohnungen und der Erklärung zum Mietstatus, ein Abschnitt «Tankbestand» mit Stichtag, Wert in Franken und Kategorie (Auswahl: «Stückholz», «Heizung»). Ich musste weit nach unten scrollen.
6. **31.12.2025, 1320.00 (12 Ster zu CHF 110), Stückholz, «Bestand speichern».** Gesehen: «Bestand gespeichert.» und die Zeile «31.12.2025 Stückholz CHF 1’320.00» (Screenshot `14-tank-nach.png`).
7. **Stückholz bearbeiten, «Brennstoff» abhaken, «Änderungen speichern».** Erwartet: eine Warnung oder Ablehnung, weil ein Bestand existiert. Gesehen: rote Box «Kategorie wurde nicht gespeichert» mit Ursache und Ausweg (Screenshot `15-brennstoff-weg.png`). Verstanden.
8. **Zusatzversuch: nur «Heizkosten nach dem Heizprofil verteilen» abhaken.** Das Brennstoff-Feld verschwindet. Speichern ergibt dieselbe Meldung über Brennstoff (Screenshot `16-heizprofil-weg.png`). Ich hatte Brennstoff gar nicht angefasst (P-1). Nach dem Neuladen sind beide Häkchen wieder gesetzt.

## Verwirrung

- **«Brennstoff»:** Das Wort kenne ich. Der Hilfetext mit Beispielen (Heizöl, Flüssiggas, Pellets, Holz) und Gegenbeispielen (Erdgas aus der Leitung, Fernwärme, Strom, Kaminfeger) macht es klar. Vier Sätze sind gerade noch in Ordnung. Unklar ist nur, warum «Heizung» Brennstoff ist, obwohl dort auch Wartung hineingehört (P-2).
- **Dass Brennstoff am Heizprofil hängt,** ist für mich nicht logisch: Was hat die Verteilung auf Monate mit dem Holzlager zu tun? (P-3, P-1)
- **«Tankbestand»** für ein Holzlager: Ich habe es verstanden, weil im Text «Tank oder Lager» steht.
- **«Stichtag»:** Ein Fachwort, aber mit «Format TT.MM.JJJJ» und dem 31.12. im Hilfetext verständlich.
- **«Anfangsbestand + Einkauf − Endbestand»:** Das habe ich zweimal lesen müssen. Dass «der Wert vom 31.12.2024 der Endbestand 2024 und der Anfangsbestand 2025 ist», hat geholfen.

## Fehlerrisiken

- Holzlieferungen unter «Heizung» statt «Stückholz» erfassen: Beide sind Brennstoff, beide stehen beim Tankbestand zur Wahl. Dann stimmen Bestand und Einkauf nicht in derselben Kategorie überein.
- Wer das Heizprofil-Häkchen nie setzt, findet «Brennstoff» nicht und hat später keinen Tankbestand für seine Kategorie, rechnet also den Einkauf statt des Verbrauchs ab.
- Wert falsch berechnet (Menge mal Preis der letzten Lieferung): Der Text erklärt es, aber Rechenfehler bleiben beim Benutzer.
- Vorausgewählte Kategorie beim Tankbestand: Man speichert leicht bei der falschen.

## Vorschläge

- **P-1:** Stückholz (mit Tankbestand) bearbeiten, nur «Heizkosten nach dem Heizprofil verteilen» abhaken, speichern. Die Meldung spricht von Brennstoff, das Feld ist versteckt. Hilfreich: das Heizprofil-Häkchen nicht abhakbar machen, solange Tankbestände bestehen, oder die Meldung sagen lassen, dass auch das Heizprofil wegen der Tankbestände bleibt.
- **P-2:** Kategorie «Heizung» öffnen: «Brennstoff» angekreuzt, Rechtshinweis nennt Wartung, Hilfetext sagt «Wartung ist kein Brennstoff». Hilfreich: ein Satz bei Heizung, wohin Wartungsrechnungen gehören (z. B. eigene Kategorie), oder Heizung im Hilfetext ausdrücklich als Brennstoff-Sammelkategorie erklären.
- **P-3:** «Kategorie erfassen» öffnen: Brennstoff ist nicht sichtbar. Hilfreich: im Hilfetext von «Heizkosten nach dem Heizprofil verteilen» ein Satz wie «Für Heizöl, Pellets oder Holz im Tank oder Lager setzen Sie dann auch «Brennstoff»».
- **P-4:** Kategorie-Liste öffnen: kein Hinweis auf Brennstoff. Hilfreich: neben «Umlagefähig» ein Text «Brennstoff».
- **P-5:** Gebäudeseite, Abschnitt Tankbestand: den Hilfetext kürzen auf das Nötigste (was, wann, wie berechnen), die Sonderfälle (Rest zum Preis der Lieferung davor, Ablesen im Januar) in einen zweiten Absatz.

## Nicht geprüft

- Ob die Nebenkostenabrechnung wirklich den Verbrauch statt des Einkaufs abrechnet: Dafür bräuchte ich eine Holzrechnung und zwei Stichtage, das war nicht Teil der Aufgabe.
- Das Löschen des Tankbestands und danach das Entfernen von Brennstoff: Der Bestand bleibt für spätere Prüfungen stehen.
- 200 % Zoom und andere Sprachen.
- Die Kategorie «Heizung» habe ich nicht verändert (vordefiniert, nicht meine).
