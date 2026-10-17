# Helga – Kein Tank / Tank stillgelegt (Runde w8b)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Formular auch bei 200 %), Maus. Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/57f5a1ca-407e-5441-98f4-66ca786359d9/scratchpad/helga-w8b/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Gebäude bearbeiten, Hilfetext der Checkbox | «Im Jahr der Stilllegung erfassen Sie noch den Endbestand, auch wenn er 0 ist.» sagt nicht, **wo** ich den Endbestand erfasse (das Formular «Brennstoff im Tank oder Lager» steht auf der Gebäudeseite, nicht hier) und nicht, in welcher **Reihenfolge**: zuerst Endbestand speichern und dann das Häkchen setzen, oder umgekehrt? Und darf ich das Häkchen im Stilllegungsjahr überhaupt schon setzen, wenn die Abrechnung des Jahres noch fehlt? |
| P-2 | Minor | Gebäudeseite nach dem Speichern | Oben steht «Tank: Keiner oder stillgelegt», aber unten bietet die Karte «Brennstoff im Tank oder Lager» weiter Stichtag, Wert in Franken und «Bestand speichern» an, ohne Hinweis auf das, was ich gerade angegeben habe. Ich dachte zuerst, das Speichern habe nicht geklappt, oder ich müsse dort doch noch etwas eingeben. |
| P-3 | Minor | Gebäudeseite | Nirgends steht, wie ich die Angabe «Keiner oder stillgelegt» wieder ändere (z. B. «Ändern Sie das unter Bearbeiten»). Ich habe es erst durch Ausprobieren über «Bearbeiten» gefunden. |
| P-4 | Nit | Gebäude bearbeiten / Gebäudeseite | Drei Wörter für dasselbe: Checkbox «Kein Tank oder Tank stillgelegt», Anzeige «Tank: Keiner oder stillgelegt», Hilfetext «Tankbestand» und «Endbestand», Karte «Brennstoff im Tank oder Lager». Bei Pellets oder Holz heisst es «Lager», die Checkbox spricht aber nur vom «Tank». |

## Beobachtungen

- Die Frage zum Heizen mit Öl in der Vorschau habe ich für die Seepark Residenz **nie gesehen**. Die Vorschau zeigte «Anzahl Abrechnungen 0» und «Alle Mietverträge haben in dieser Periode schon eine Abrechnung. Um einen Entwurf neu zu berechnen, löschen Sie ihn …», dazu die Meldung «Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude, oder löschen Sie zuerst die Entwürfe, die Sie neu berechnen wollen.» «Weiter» führt nicht weiter. Die Entwürfe 2025 sind schon da (aus den Demodaten); ich habe sie nicht gelöscht, weil ich sie nicht selber erstellt habe. Das liegt an den Startdaten, nicht an der neuen Änderung.
- Zum Vergleich habe ich nur angeschaut (nicht erstellt): Vorschau mit Alpenblick zeigt 2 Abrechnungen und den Hinweis «Möglicherweise fehlen Rechnungen», aber auch keine Frage zum Tank.
- Die Hilfe (`/help`) erwähnt das Wort «Tank» nicht.
- Der Hilfetext an der Checkbox selbst ist gut verständlich: «Für Gebäude mit Fernwärme, Erdgas aus der Leitung oder Wärmepumpe …». Ich wusste sofort: Fernwärme, also ankreuzen. Lesbar bei 150 % und 200 %, kein seitliches Scrollen bei 200 %.
- Die Erfolgsmeldung «Gebäude Seepark Residenz gespeichert» erschien nach dem Speichern, und unter «Angaben zum Gebäude» stand neu «Tank – Keiner oder stillgelegt».
- Der lange Text der Karte «Brennstoff im Tank oder Lager» beginnt mit «Nur für Gebäude, die mit Öl, Flüssiggas, Pellets oder Holz heizen.» Das hat mir bei Fernwärme geholfen: ich weiss, dass mich die Karte nichts angeht.

## Aufgabe geschafft: teilweise

Angabe «Kein Tank» gespeichert und auf der Gebäudeseite wiedergefunden: ja. Die Frage in der Vorschau lesen und ihrem Weg folgen: nein, die Vorschau zeigte keine Frage (Entwürfe 2025 schon vorhanden, siehe «Nicht geprüft»). Ob die Frage danach verschwindet, liess sich deshalb nicht beurteilen.

## Aufwand

Etwa 15 Minuten, 4 Vorschau-Durchläufe des Assistenten (je 4 Schritte), 1 Speichern im Gebäudeformular, 2 Besuche der Gebäudeseite.

## Ablauf

1. Übersicht, «Abrechnungen erstellen». Erwartet: Assistent. Gesehen: Schritt 1 mit 01.01.2025 – 31.12.2025 vorgeschlagen. Gut.
2. Schritt 2, Häkchen bei «Seepark Residenz». Erwartet: Gebäude wählen. Gesehen: so, mit «15 Rechnungen in der Abrechnungsperiode».
3. Schritt 3, Heizprofil und Verwaltungspauschale unverändert, «Weiter».
4. Schritt 4 Vorschau. Erwartet: eine Frage, ob mit Öl geheizt wird. Gesehen: keine solche Frage; «Anzahl Abrechnungen 0», Hinweis, dass alle Mietverträge schon eine Abrechnung haben. «Weiter» zeigt nur die Meldung, Entwürfe zu löschen.
5. Weil die Vorschau keinen Weg zeigte, bin ich über «Gebäude» zur Seepark Residenz gegangen. Erwartet: irgendwo «Heizung» oder «Tank». Gesehen: die Karte «Brennstoff im Tank oder Lager» mit Eingabefeldern; keine Checkbox. Über «Bearbeiten» fand ich unter «Weitere Angaben» die Checkbox «Kein Tank oder Tank stillgelegt».
6. Häkchen gesetzt, «Änderungen speichern». Erwartet: Bestätigung. Gesehen: Rückkehr zur Gebäudeseite, Meldung «Gebäude Seepark Residenz gespeichert», «Tank: Keiner oder stillgelegt». Aber die Tank-Karte unten ist unverändert da (P-2).
7. Erneut Vorschau 2025 Seepark Residenz. Erwartet: keine Tankfrage. Gesehen: wie in Schritt 4, also keine Tankfrage, aber auch vorher keine. Aussagelos.
8. Zurück auf «Bearbeiten»: Häkchen ist gesetzt. Zurücknehmen ginge hier; auf der Gebäudeseite steht das nicht (P-3). Ich habe das Häkchen gesetzt gelassen.

## Verwirrung

- «Tank stillgelegt»: verstehe ich. Aber was ist mit dem Jahr, in dem stillgelegt wird? Der Satz «Im Jahr der Stilllegung erfassen Sie noch den Endbestand, auch wenn er 0 ist.» sagt mir nicht, wo und wann (P-1). Ich würde vermutlich gleich im Januar das Häkchen setzen und den Endbestand vergessen.
- «Tankbestand», «Endbestand», «Anfangsbestand», «Bestand speichern», «Brennstoff im Tank oder Lager»: viele ähnliche Wörter (P-4).
- «Heizmaterial» im Hilfetext, «Brennstoff» in der Karte: dasselbe?

## Fehlerrisiken

- Im Stilllegungsjahr Häkchen zu früh setzen, Endbestand nie erfassen: dann fehlt wohl der Verbrauch der letzten Tankfüllung in der Abrechnung (P-1).
- Nach dem Speichern trotzdem einen Wert in der Tank-Karte eingeben, weil sie weiter angeboten wird (P-2).
- Bei Pellets oder Holz das Häkchen nicht finden oder nicht setzen, weil nur von «Tank» die Rede ist (P-4).

## Vorschläge

- **P-1:** Gebäude «Seepark Residenz» → «Bearbeiten» → Hilfetext der Checkbox lesen. Hilfreich: «Wird der Tank in diesem Jahr stillgelegt, erfassen Sie zuerst auf der Gebäudeseite unter «Brennstoff im Tank oder Lager» den Endbestand per 31.12. (auch 0) und erstellen Sie die Abrechnung dieses Jahres. Setzen Sie das Häkchen erst danach.» (oder was fachlich richtig ist).
- **P-2:** Häkchen setzen, speichern, Gebäudeseite nach unten scrollen. Hilfreich: in der Karte ein Satz wie «Sie haben angegeben, dass das Gebäude keinen Tank hat oder der Tank stillgelegt ist. Hier müssen Sie nichts erfassen.», oder die Karte zuklappen.
- **P-3:** Gebäudeseite nach dem Speichern. Hilfreich: neben «Keiner oder stillgelegt» ein kurzer Satz «Ändern über «Bearbeiten»» oder ein Link dorthin.
- **P-4:** Checkbox, Anzeige und Karte vergleichen. Hilfreich: ein Wortpaar durchgehend, z. B. «Kein Tank oder Lager für Brennstoff, oder stillgelegt».

## Nicht geprüft

- Die Frage zum Heizen mit Öl in der Vorschau, ihr Text, ihr Weg zur Checkbox und ob sie nach dem Speichern verschwindet: In der Seepark Residenz sind für 2025 schon Entwürfe für alle Mietverträge vorhanden, die Vorschau zeigt deshalb 0 Abrechnungen und keine Frage. Die Entwürfe habe ich nicht gelöscht (nicht von mir erstellt). Für einen neuen Lauf müssten die Seepark-Entwürfe 2025 vor dem Start entfernt werden.
- Abrechnungen erstellen (Schritt 5): laut Aufgabe nicht.
- Das Stilllegungsjahr selbst (Endbestand 0 erfassen, dann Häkchen): nicht durchgespielt, nur den Text beurteilt.
