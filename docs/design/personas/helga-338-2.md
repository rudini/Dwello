# Helga – «Neu berechnen» mit Rückfrage und Erfolgsmeldung, zweite Runde (#338)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (einmal 200 %), Maus. App: Persona-Stack auf http://localhost:3300, Deutsch, einmal Französisch. Gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-338-2/`.

## Stand der Befunde aus der ersten Runde (helga-338.md)

| ID alt | Status | Begründung |
|---|---|---|
| P-1 (Bestätigung ausser Sicht) | **behoben** | Die Seite springt nach dem Bestätigen weiterhin nach oben (scrollY 3270 → 0), der Fokus liegt jetzt aber auf der Überschrift «Abrechnung NK-22222222-2025-0001», und die grüne Meldung «Der Entwurf ist neu berechnet. Er rechnet die Rechnungen ab, wie sie jetzt sind.» steht unten rechts im sichtbaren Bereich (Screenshot 08). Ich musste nicht scrollen. Die Meldung ist als `status` ausgezeichnet. |
| P-2 (keine Rückfrage, nicht gesagt was bleibt) | **behoben** | Vor dem Rechnen kommt das Fenster «Entwurf neu berechnen»: «Dwello berechnet den Entwurf NK-22222222-2025-0001 mit den Rechnungen, wie sie jetzt sind. Nummer, Heizprofil, Verwaltungspauschale, Abrechnungsdatum, Zahlungsfrist und Bemerkung bleiben. Beträge, Positionen und Saldo ändern sich. Ein schon erstelltes PDF wird verworfen.» Knöpfe «Abbrechen» (hat den Fokus) und «Neu berechnen». Abbrechen schliesst ohne Wirkung. |

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung (Entwurf), Erfolgsmeldung | Die Erfolgsmeldung verschwindet von selbst nach etwa 6 bis 10 Sekunden (nach 6 s noch da, nach 10 s weg). Ich lese langsam und schaue zuerst auf die Zahlen; danach ist die Meldung weg und es bleibt nur die leere Fläche, wo vorher der gelbe Hinweis war. |
| P-2 | Minor | Abrechnung (Entwurf), 200 % Zoom | Bei 200 % liegt die Erfolgsmeldung über der unteren Hälfte des Knopfs «Per E-Mail senden» (Screenshot 14). Ausgerechnet der Hauptknopf ist halb verdeckt, bis die Meldung weg ist oder ich sie mit dem X schliesse. |
| P-3 | Nit | Abrechnung (Entwurf), Erfolgsmeldung | Die Meldung sagt nur, dass neu gerechnet wurde. Dass der Saldo von Rückerstattung CHF 34.60 auf Nachzahlung CHF 89.00 gekippt ist und dass ich das PDF neu erstellen muss, sagt sie nicht. Das Fenster vorher hatte das PDF erwähnt, danach steht der Knopf nur still «PDF erstellen». |
| P-4 | Nit | Rückfrage «Entwurf neu berechnen» | Auch wenn sich keine Rechnung geändert hat (kein gelber Hinweis mehr), sagt das Fenster «Beträge, Positionen und Saldo ändern sich». Beim zweiten Mal hat sich nichts geändert. Besser wäre «können sich ändern». |

## Zahlen für die Datenprüfung

Abrechnung **NK-22222222-2025-0001**, Thomas Weber, Seepark Residenz, Wohnung A1, 01.01.–31.12.2025, 365 Mietstage. Statement-ID 7b4e8299-fc55-47cf-ad12-e4d36dbf61e0. Nummer nach dem Neu berechnen gleich.

| Position | vorher | nachher |
|---|---|---|
| TV/Kabelanschluss (Pro Einheit, 25 %, Gebäude 912.00) | 228.00 | 228.00 |
| Hauswart (Pro Fläche, 21.25 %, Gebäude 3’060.00) | 650.25 | 650.25 |
| Heizung (Pro Fläche, 21.25 %, Gebäude 4’115.00) | 874.44 | 874.44 |
| Kaltwasser (Pro Fläche, 21.25 %, Gebäude 2’060.00) | 437.75 | 437.75 |
| Allgemeinstrom (Pro Fläche, 21.25 %, Gebäude 499.30) | 106.10 | 106.10 |
| Hauswart **eigene Zeile** (Gleichmässig pro Wohnung, 25 %, Gebäude 480.00) | – | 120.00 |
| Zwischensumme | 2’296.54 | 2’416.54 |
| Verwaltungspauschale 3 % | 68.90 | 72.50 |
| Ihre Nebenkosten | 2’365.44 | 2’489.04 |
| Akontobeiträge | − 2’400.00 | − 2’400.00 |
| vor Rundung | Rückerstattung 34.56 | Nachzahlung 89.04 |
| Rundung auf 5 Rappen | + 0.04 | − 0.04 |
| **Saldo** | **Rückerstattung CHF 34.60** | **Nachzahlung CHF 89.00** |

Gleich geblieben: Heizprofil «Heizung + Warmwasser (nicht angewendet: Mietvertrag über die ganze Periode)», Zahlungsfrist 18.11.2026 (vorher Beschriftung «Rückerstattung bis», nachher «Zahlungsfrist»), Abrechnungsdatum 19.10.2026. Verlauf nachher nur «Erstellt 19.10.2026, 12:42», «PDF erstellt» ist weg, der Knopf heisst «PDF erstellen».
Erfasste Rechnung: Hauswartung Keller GmbH, «Hauswartung Nachtrag 2025», CHF 480.00, Rechnungsdatum 31.12.2025, Kategorie Hauswart, **ohne Verteilschlüssel** (wie in Runde 1, damit die Zahlen vergleichbar sind; die Rechnungsseite zeigt «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt»), umlagefähig, ohne Beleg. Rechnungs-ID a8147993-df53-4fe3-b068-ff4a68993298.
Nachgerechnet: 480 / 4 = 120.00; 2’296.54 + 120.00 = 2’416.54; 3 % = 72.496 → 72.50; 2’489.04 − 2’400.00 = 89.04 → 89.00. Gleich wie in Runde 1. Für mich stimmt das.
«Neu berechnen» bei Weber bestätigt: dreimal mit «Neu berechnen» (einmal mit Wirkung, dann zweimal ohne geänderte Rechnung: einmal zum Messen der Meldung, einmal bei 200 %), einmal auf Französisch «Recalculer» (ohne Änderung), einmal abgebrochen. Die Beträge blieben danach gleich. Die Entwürfe 0002 (Sarah Meier), 0003 (Nina Brunner) und 0004 (Marco Bernasconi) habe ich nicht neu berechnet; Meier habe ich auf Französisch nur angesehen, sie zeigt weiter den Hinweis.

## Beobachtungen

- Die Erfolgsmeldung erscheint unten rechts als kleines Feld, nicht oben auf der Seite. Bei 150 % ist sie gut sichtbar und gut lesbar, mit grünem Haken und Text, und mit einem X zum Schliessen.
- Nach dem Neu berechnen bleibt zwischen «Status: Entwurf» und «Kostenaufstellung» eine grosse leere Fläche (schon in Runde 1 so).
- Der gelbe Hinweis «Rechnungen seit der Abrechnung geändert» sagt weiterhin «Wählen Sie «Neu berechnen»», der Knopf steht aber weit unten unter «Weitere Aktionen» (alte P-3, hier nicht geändert).
- Auf dem veralteten Entwurf bleibt «Per E-Mail senden» der grosse Hauptknopf oben. Ich könnte also den alten Stand versenden, bevor ich neu rechne.
- Die Positionen sind nach dem Neu berechnen anders sortiert (Heizung vor Hauswart), und die neue Hauswart-Zeile steht ganz unten als zweite «Hauswart»-Zeile. Das hat mich wie in Runde 1 verwirrt (Verteilschlüssel im Rechnungsformular «optional» und nicht aus der Kategorie übernommen).
- Französisch: Hinweis («Factures modifiées depuis le décompte … Choisissez « Recalculer » …»), Knopf «Recalculer», Fenster «Recalculer le brouillon» mit «Annuler»/«Recalculer» und Meldung «Le brouillon est recalculé. Il facture les factures telles qu’elles sont maintenant.» sind ganz französisch, kein deutsches Wort gesehen. «PDF en allemand» beim PDF-Knopf ist ein Hinweis auf die Sprache des PDFs, kein Übersetzungsfehler. «Il facture les factures» klingt holprig, wie im Deutschen «Er rechnet die Rechnungen ab».
- Die Sprache habe ich danach wieder auf Deutsch gestellt.

## Aufgabe geschafft: ja

Rechnung erfasst, Hinweis gesehen, Rückfrage gelesen, bestätigt, Erfolgsmeldung ohne Scrollen gesehen, neue Beträge stimmen. Französisch geprüft.

## Aufwand

Etwa 8 Minuten, rund 15 Schritte: Abrechnungen → Weber ansehen → «Rechnung erfassen» → 7 Felder → speichern → Abrechnungen → Weber → nach unten scrollen → «Neu berechnen» → Fenster lesen → «Neu berechnen» → Meldung und Zahlen ansehen. Deutlich weniger Suchen als in Runde 1, weil ich die Bestätigung nicht mehr unten suchen musste.

## Ablauf

1. **Weber vorher.** Erwartet: Rückerstattung wie letztes Mal. Gesehen: Saldo Rückerstattung CHF 34.60, Verlauf «Erstellt» und «PDF erstellt», kein Hinweis. Wie erwartet.
2. **Rechnung erfassen.** Erwartet: dasselbe Formular. Gesehen: gleich wie in Runde 1; Verteilschlüssel bleibt nach Wahl von «Hauswart» leer («Verteilschlüssel auswählen»), der Hilfetext sagt jetzt klar «Ohne Verteilschlüssel werden die Kosten gleichmässig pro Wohnung verteilt». Gespeichert, Warnung «Abrechnungen nicht aktuell» mit dem langen Absatz (unverändert).
3. **Weber mit Hinweis.** Erwartet: gelber Hinweis oben. Gesehen: «Rechnungen seit der Abrechnung geändert … 1 Rechnung …» direkt unter dem Status (Screenshot 05). Gut.
4. **«Neu berechnen» geklickt.** Erwartet (nach Runde 1): eine Rückfrage. Gesehen: Fenster mit Titel «Entwurf neu berechnen» und dem Satz, was bleibt und was sich ändert (Screenshot 07). Ich weiss jetzt vor dem Bestätigen, dass Nummer, Heizprofil, Pauschale, Datum, Frist und Bemerkung bleiben und das PDF verworfen wird. Der Fokus liegt auf «Abbrechen», das finde ich vorsichtig und gut.
5. **Abbrechen ausprobiert.** Erwartet: nichts passiert. Gesehen: Fenster zu, Hinweis noch da. Gut.
6. **Bestätigt.** Erwartet: Meldung, dass es geklappt hat. Gesehen: Seite springt nach oben, oben Überschrift und Knöpfe, unten rechts grüne Meldung «Der Entwurf ist neu berechnet …» (Screenshot 08). Gelber Hinweis weg. Ohne Scrollen gesehen. Gut.
7. **Zahlen prüfen.** Erwartet: Hauswart etwas höher. Gesehen: neue Zeile «Hauswart, Gleichmässig pro Wohnung, CHF 120.00», Saldo jetzt Nachzahlung CHF 89.00 (Tabelle oben). Nachgerechnet, stimmt.
8. **Meldung beobachtet.** Erwartet: sie bleibt, bis ich sie wegklicke. Gesehen: nach 6 s noch da, nach 10 s weg (P-1).
9. **200 % Zoom.** Fenster gut lesbar, Knöpfe gross. Meldung verdeckt den Knopf «Per E-Mail senden» halb (P-2).
10. **Französisch.** Sprache oben über «Deutsch» → «Français». Meiers Entwurf zeigt den Hinweis auf Französisch, Webers Fenster und Meldung ebenfalls (Screenshots 10–12). Zurück auf Deutsch.

## Verwirrung

- «Er rechnet die Rechnungen ab, wie sie jetzt sind»: «Er» ist der Entwurf; ich musste den Satz zweimal lesen (wie in Runde 1).
- «Ein schon erstelltes PDF wird verworfen»: «verworfen» heisst gelöscht? Ich hätte «gelöscht, Sie erstellen es danach neu» besser verstanden.
- «Beträge, Positionen und Saldo ändern sich» beim zweiten Mal, obwohl sich nichts ändern konnte (P-4).
- Zwei Zeilen «Hauswart» mit verschiedenen Verteilschlüsseln (nicht Teil dieser Änderung).

## Fehlerrisiken

- Wer die Meldung verpasst (P-1), sieht nur, dass der Hinweis weg ist. Das reicht meistens, aber eine langsame Leserin ist unsicher, ob es geklappt hat.
- Der Saldo kippt von Rückerstattung zu Nachzahlung; das Fenster sagt nur allgemein «Saldo ändert sich», die Meldung danach nennt die neue Zahl nicht (P-3). Wer dem Mieter schon eine Rückerstattung angekündigt hat, merkt es nur beim Vergleichen.
- Der veraltete Entwurf lässt sich oben über «Per E-Mail senden» verschicken, ohne vorher neu zu rechnen.

## Vorschläge

- **P-1:** Rechnung in Seepark 2025 erfassen → Abrechnung NK-22222222-2025-0001 → «Neu berechnen» → im Fenster «Neu berechnen» → 10 Sekunden warten: Meldung weg. Hilfreich: die Meldung stehen lassen, bis ich sie schliesse oder die Seite verlasse, oder sie oben an die Stelle des gelben Hinweises setzen (dann füllt sie auch die leere Fläche).
- **P-2:** Gleicher Weg bei 200 % Zoom (Fenster 720 × 450 CSS-Pixel). Hilfreich: die Meldung so setzen, dass sie keine Knöpfe verdeckt, etwa im Seiteninhalt unter dem Status statt schwebend.
- **P-3:** Gleicher Weg. Hilfreich: «Der Entwurf ist neu berechnet. Saldo vorher: Rückerstattung CHF 34.60, jetzt: Nachzahlung CHF 89.00. Erstellen Sie das PDF neu.»
- **P-4:** Abrechnung ohne gelben Hinweis öffnen → «Neu berechnen». Hilfreich: «Beträge, Positionen und Saldo können sich ändern», oder ohne geänderte Rechnungen ein Satz «Seit dem Erstellen hat sich keine Rechnung geändert.»

## Nicht geprüft

- Ein Fehler beim Neu berechnen (kein fehlschlagender Request verlangt).
- Italienisch und Englisch: nur Französisch verlangt.
- Das neue PDF: nicht erstellt, um nicht über den Auftrag hinaus zu ändern.
- Mobile Ansicht: nicht Helgas Gerät.
- Die anderen drei Seepark-Entwürfe neu berechnen: absichtlich nicht (Auftrag).
