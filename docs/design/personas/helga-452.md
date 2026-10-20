# Helga – Slice 452: Verteilschlüssel beim Erfassen und Bearbeiten von Rechnungen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Gespeichert habe ich nur in «Seepark Residenz».
Skripte und Bilder: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-452/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neue Rechnung, «Kategorie und Verteilung» | Wechsle ich die Kategorie, bleibt der Vorschlag der vorherigen Kategorie stehen. Heizung → «Pro Fläche (m²)», dann Kaminfeger: weiterhin «Pro Fläche (m²)». Wähle ich Kaminfeger direkt, steht «Verteilschlüssel auswählen» da. Der Hilfetext sagt aber, der Vorschlag komme von der letzten Rechnung *dieser* Kategorie. |
| P-2 | Minor | Neue Rechnung / Rechnung bearbeiten | Dwello sagt nicht, woher der Vorschlag kommt (von welcher früheren Rechnung oder aus den Einstellungen). Beim Hauswart musste ich selbst in der Liste nachsehen, um zu verstehen, warum «Pro Fläche (m²)» dasteht. |
| P-3 | Minor | Rechnung bearbeiten (Fernwärme Q4 2025) | Für eine Heizungsrechnung schlägt Dwello «Pro Fläche (m²)» vor, obwohl es den Schlüssel «Heizung (Fläche 70 % / Einheit 30 %)» gibt. Als Anfängerin weiss ich nicht, welcher richtig ist, und nichts erklärt den Unterschied. |
| P-4 | Minor | Rechnung bearbeiten | Oben steht «Bestehende Abrechnungen ändern sich dadurch nicht.», beim Verteilschlüssel steht «gilt er für jede Abrechnung, die Dwello danach erstellt oder neu berechnet». Für mich klingt das widersprüchlich. |
| P-5 | Nit | Rechnung bearbeiten | Direkt nach dem Öffnen steht «Ungespeicherte Änderungen», obwohl ich noch nichts angefasst habe. Erst nach einem Moment merke ich: Gemeint ist der Vorschlag von Dwello. |

## Beobachtungen

- Ein Knopf «Neue Rechnung» war nicht zu finden. Er heisst «Rechnung erfassen» (Übersicht unter «Häufige Arbeiten» und auf der Seite Rechnungen). Die Seite selbst heisst dann «Neue Rechnung». Ich habe ihn trotzdem gefunden.
- Bei 150 % Zoom ist die Navigation hinter «Menü öffnen» versteckt. Dort steht sie gut gegliedert («Nebenkosten» → «Rechnungen», «Einstellungen und Hilfe» → «Verteilschlüssel»).
- Der Hilfetext zum Leistungszeitraum ist sehr lang (drei Absätze, mit Boiler-Entkalkung und VMWG). Er steht vor dem Feld «Betrag», und ich musste weit scrollen.
- Die Detailseite der Fernwärme-Rechnung zeigte vor dem Bearbeiten beim Verteilschlüssel «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt, wie «Pro Einheit»». Das ist verständlich, aber dort steht nicht, dass ich das unter «Rechnung bearbeiten» beheben soll. Erst das Formular sagt es.
- Vor dem Speichern stand auf der Fernwärme-Rechnung «Abrechnungen nicht aktuell» für 2025. Nach dem Speichern mit «Pro Fläche (m²)» war der Hinweis weg. Vermutlich stimmt die Rechnung jetzt wieder mit den Entwürfen überein. Ganz sicher bin ich nicht.
- In der Kategorienliste der Rechnungsübersicht stand später «Treppenhausbeleuchtung». Diese Kategorie habe nicht ich angelegt (eine andere Persona). Sie ist kein Befund.
- Der lange Text zur Verjährung (Art. 128 OR) im Hinweis «Abrechnungen nicht aktuell» hat mich eher verunsichert als geholfen.
- Die Seite «Verteilschlüssel» erklärt Formeln mit `{area}`, `{units_total}` usw. Für mich sind das Computerzeichen. Die Beispiele darunter helfen. Diese Seite sagt aber nichts darüber, dass Dwello beim Erfassen einen Schlüssel vorschlägt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 12 Durchgänge. Erfassen: 7 Schritte bis zum Speichern (mit dem absichtlichen Fehlversuch). Bearbeiten: 4 Schritte. Einstellungen: 3 Seiten gelesen.

## Ablauf

1. **Übersicht → Rechnungen.** Erwartet: Menüpunkt «Rechnungen». Gesehen: Bei 150 % muss ich zuerst «Menü öffnen» drücken, dann «Rechnungen». Auf der Seite gibt es «Rechnung erfassen», kein «Neue Rechnung».
2. **Neue Rechnung ausfüllen.** Gebäude «Seepark Residenz – Seeweg 15», Rechnungsdatum 28.02.2026, Betrag 380, Rechnungssteller «Hauswart Gerber», Beschreibung «Treppenhausreinigung Februar». Nach der Wahl des Gebäudes steht beim Verteilschlüssel noch «Verteilschlüssel auswählen». Erwartet hatte ich das so.
3. **Kategorie «Hauswart» gewählt.** Erwartet: irgendein Vorschlag. Gesehen: «Pro Fläche (m²)» ist sofort gewählt. Der Hilfetext darüber sagt: «Dwello schlägt den Verteilschlüssel vor, den die letzte Rechnung dieser Kategorie im Gebäude hat, sonst den aus den Einstellungen. Verwenden Sie für eine Kategorie immer denselben Verteilschlüssel.» Verstanden habe ich das erst, als ich in der Liste nachsah: Die Hauswartung der Facility Service AG (Q1–Q4 2025) hat «Pro Fläche (m²)». Das Formular selbst sagt nicht, welche Rechnung den Vorschlag geliefert hat (P-2).
4. **Ohne Verteilschlüssel gespeichert.** Ich habe «Verteilschlüssel auswählen» gewählt und «Rechnung speichern» gedrückt. Erwartet: eine Fehlermeldung. Gesehen: Die Seite bleibt, das Feld hat einen roten Rahmen und den Fokus, darunter steht rot mit Ausrufezeichen «Wählen Sie, wie die Kosten verteilt werden.» Alle anderen Eingaben bleiben stehen (Bild `07-ohne-schluessel.png`). Klar und freundlich.
5. **Verteilschlüssel wieder gewählt und gespeichert.** «Pro Fläche (m²)» gewählt, die Fehlermeldung verschwindet. Nach dem Speichern komme ich zur Rechnungsliste mit der Meldung «Rechnung von Hauswart Gerber gespeichert». Die Rechnung steht zuoberst: Seepark Residenz, 28.02.2026, Hauswart, CHF 380.00 (Bild `09-gespeichert.png`).
6. **Fernwärme Q4 2025 geöffnet.** Auf der Detailseite steht beim Verteilschlüssel «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt, wie «Pro Einheit»». Dazu kommt der Hinweis «Abrechnungen nicht aktuell» für 2025.
7. **«Rechnung bearbeiten».** Erwartet: ein leeres Feld. Gesehen: «Pro Fläche (m²)» ist schon gewählt, darunter ein brauner Warnhinweis mit Dreieck: «Diese Rechnung hat noch keinen Verteilschlüssel. Dwello verteilt sie darum gleichmässig pro Wohnung, wie «Pro Einheit». Prüfen Sie den Verteilschlüssel, den Dwello vorschlägt. Speichern Sie die Rechnung, gilt er für jede Abrechnung, die Dwello danach erstellt oder neu berechnet; schon versendete bleiben, wie sie sind.» Unten steht «Ungespeicherte Änderungen» (Bild `12-edit-hinweis.png`). Ich weiss, was zu tun ist: prüfen und speichern. Unsicher war ich, ob für Heizung nicht «Heizung (Fläche 70 % / Einheit 30 %)» richtig wäre (P-3). Ich habe «Pro Fläche (m²)» gelassen, weil die Fernwärme Q1–Q3 2025 und Q4 2024 der Seepark Residenz auch so verteilt sind und der Hilfetext sagt, man solle immer denselben verwenden.
8. **«Änderungen speichern».** Meldung «Rechnung von ewl Energie Wasser Luzern gespeichert». Die Detailseite zeigt jetzt «Verteilschlüssel: Pro Fläche (m²)», und der Hinweis «Abrechnungen nicht aktuell» ist weg.
9. **Einstellungen.** Unter «Vorschläge für Abrechnungen und Rechnungen» steht beim Standard-Verteilschlüssel «Kein Vorschlag». Der Text dazu: «… Dwello schlägt den hier gewählten Verteilschlüssel beim Erfassen einer Rechnung vor, wenn im Gebäude noch keine Rechnung derselben Kategorie einen hat.» Das passt zu Schritt 3: Für Hauswart gibt es eine frühere Rechnung, für Kaminfeger oder Lift in der Seepark Residenz nicht, dort bleibt das Feld leer.
10. **Seite «Verteilschlüssel».** Sie erklärt, was ein Verteilschlüssel ist, und listet die vier vordefinierten mit Formel und Anzahl Rechnungen («Pro Fläche (m²)»: 72 Rechnungen). Zum Vorschlag beim Erfassen steht dort nichts. Das widerspricht nichts, hilft mir aber auch nicht beim Erfassen.
11. **Gegenprobe ohne Speichern.** Neue Rechnung, Seepark: Heizung → «Pro Fläche (m²)», danach Kaminfeger → bleibt «Pro Fläche (m²)». Kaminfeger direkt → «Verteilschlüssel auswählen» (P-1). Wähle ich zuerst die Kategorie und dann das Gebäude, kommt der Vorschlag trotzdem. Habe ich selbst «Pro Zimmer» gewählt, überschreibt die Kategorie meine Wahl nicht. Das finde ich richtig.

## Verwirrung

- **Verteilschlüssel:** Der Hilfetext erklärt das Wort gut («Wie die Kosten auf die Wohnungen des Gebäudes verteilt werden»).
- **«Pro Einheit»:** Was ist eine Einheit? Erst die Seite «Verteilschlüssel» sagt «1 für jede Wohnung, alle tragen gleich viel». Beim Formular steht das nicht.
- **«Heizung (Fläche 70 % / Einheit 30 %)» oder «Pro Fläche (m²)» für eine Heizungsrechnung?** Unklar (P-3).
- **«Umlagefähig»:** Mit «Die Rechnung fliesst in die Nebenkostenabrechnung ein» verständlich.
- **«Leistungszeitraum», «Abrechnungsperiode»:** Erklärt, aber sehr lang.
- **«Formel», `{area}`, `{units_total}`:** Für mich unverständlich, nur die Beispiele helfen.
- **«Bestehende Abrechnungen ändern sich dadurch nicht» und «gilt für jede Abrechnung, die Dwello danach … neu berechnet»:** Wirkt wie ein Widerspruch (P-4).

## Fehlerrisiken

- Wer zuerst die falsche Kategorie wählt und sie dann korrigiert, behält still den Schlüssel der falschen Kategorie (P-1). Im Glauben, er komme von einer früheren Rechnung derselben Kategorie, speichert man ihn. Das führt genau zu den uneinheitlichen Schlüsseln, vor denen der Hilfetext warnt.
- Bei Heizungskosten kann eine Anfängerin den Vorschlag gegen «Heizung (70/30)» tauschen, weil der Name besser passt. Dann ist eine einzige Heizungsrechnung anders verteilt als die übrigen.
- Der Vorschlag ist schon gewählt. Wer nicht liest, merkt nicht, dass er ihn übernimmt. Bei der Bearbeitung hilft der braune Hinweis, beim Erfassen gibt es keinen solchen Hinweis.

## Vorschläge

- **P-1:** Neue Rechnung → Gebäude «Seepark Residenz», Kategorie «Heizung» (Vorschlag «Pro Fläche (m²)»), dann Kategorie «Kaminfeger» → es bleibt «Pro Fläche (m²)». Erwartet: Hat der Verteilschlüssel nur aus dem Vorschlag gestammt, sollte er beim Kategoriewechsel neu bestimmt werden (hier leer, weil «Kein Vorschlag»). Eine Wahl, die ich selbst getroffen habe, soll bleiben (das tut sie schon).
- **P-2:** Neue Rechnung → Seepark → Hauswart. Hilfreich wäre ein kurzer Satz unter dem Feld, etwa «Vorgeschlagen wie bei der letzten Hauswart-Rechnung dieses Gebäudes (31.12.2025).» oder «Vorschlag aus den Einstellungen.»
- **P-3:** Fernwärme Q4 2025 → «Rechnung bearbeiten». Hilfreich wäre eine kurze Erklärung, wann «Heizung (Fläche 70 % / Einheit 30 %)» gedacht ist, oder der Satz, dass die übrigen Heizungsrechnungen dieses Gebäudes «Pro Fläche (m²)» haben.
- **P-4:** Fernwärme Q4 2025 → «Rechnung bearbeiten». Den Einleitungssatz ergänzen, zum Beispiel «Bestehende Abrechnungen ändern sich erst, wenn Sie Entwürfe neu berechnen; versendete bleiben, wie sie sind.»
- **P-5:** Fernwärme Q4 2025 → «Rechnung bearbeiten» → unten «Ungespeicherte Änderungen». Besser wäre ein Text wie «Vorschlag von Dwello noch nicht gespeichert.»

## Nicht geprüft

- 200 % Zoom: Ich habe nur 150 % benutzt.
- Rechnungen hochladen mit KI-Lesen: nicht Teil der Aufgabe.
- Neu berechnen der Entwürfe 2025 nach der Änderung der Fernwärme-Rechnung: nicht verlangt. Ob die Entwürfe den neuen Schlüssel übernehmen, habe ich nicht angesehen.
- Den Standard-Verteilschlüssel in den Einstellungen habe ich nicht geändert. Das sind gemeinsame Daten aller Personas, und ich speichere nur in der Seepark Residenz. Deshalb ist ungeprüft, ob ein gesetzter Standard für eine Kategorie ohne frühere Rechnung wirklich vorgeschlagen wird.
- Die Rechnungsfilter Gebäude + Kategorie haben einmal gewirkt (8 Hauswart-Rechnungen der Seepark Residenz). Einmal, nach einem Aufruf mit `?building=` in der Adresse, zeigten sie aber alle Rechnungen. Das lag wohl an meinem Skript und nicht am Klickweg, darum habe ich es nicht weiter verfolgt.
