# Helga – #368 Slice A: Vereinbarte Nebenkosten aus dem bisherigen Mietvertrag

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus, Deutsch. App: Persona-Stack (http://localhost:3300), gespeichert nur in «Musterhaus Zentrum» (neuer Mietvertrag) und, wie verlangt, beim beendeten Mietvertrag von Sarah Meier (Seepark Residenz).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/helga-368A/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Mietvertrag, Schritt 4 «Miete», «Vereinbarte Nebenkosten» (aus bisherigem Mietvertrag) | Der Hilfetext sagt: «Kreuzen Sie Nebenkosten an, die Sie mit dem amtlichen Formular neu eingeführt haben». Das ist aber ein ganz neuer Mietvertrag für eine andere Wohnung in einem anderen Haus. Wenn Sarah im neuen Vertrag den Lift bezahlt, würde ich glauben, ich brauche zuerst ein amtliches Formular, und den Lift lieber nicht ankreuzen. Dann rechne ich ihr den Lift nie ab. |
| P-2 | Minor | Gleicher Ort | Im Text mit der Übernahme fehlt, was im gewöhnlichen Text steht: dass ich mit dem **unterschriebenen** Mietvertrag vergleichen soll und dass Dwello nur angekreuzte Nebenkosten abrechnet. Welcher «bisherige Mietvertrag» gemeint ist (Wohnung A2, Seepark Residenz, bis 30.06.2025), steht auch nicht da. |

## Beobachtungen

- Den Link «Neuen Mietvertrag für Sarah Meier erfassen» gibt es nur unter «Bearbeiten», nicht auf der Seite des Mietvertrags selbst. Dort steht er in einem langen grauen Textblock zu Mieter- und Wohnungswechsel, Todesfall und Scheidung. Ich habe ihn nur gefunden, weil ich ohnehin auf «Bearbeiten» musste.
- Im Assistenten war der Vertragsbeginn schon auf 01.07.2025 gesetzt (Tag nach dem alten Vertragsende), mit der Warnung «liegt in der Vergangenheit». Bei einer Wohnung in einem anderen Haus passt das selten; ich musste das Datum überschreiben.
- Die Verwaltungspauschale wurde nicht vom alten Vertrag übernommen (keine Auswahl getroffen), die Zusatzmiete auch nicht (das ist hier richtig, es ist eine andere Wohnung). Nur die Nebenkosten wurden übernommen. Bei der Verwaltungspauschale habe ich wie im alten Vertrag «Ja, zum Satz des Abrechnungslaufs» gewählt.
- Nach dem Speichern der Änderung am alten Vertrag überdeckt die Meldung «Mietvertrag von Sarah Meier gespeichert» rechts oben einen Teil der gelben Box «3 Abrechnungen fehlen» (Screenshot 07). Die Meldung lässt sich schliessen.
- Auf Schritt 5 «Prüfen» steht bei «Vereinbarte Nebenkosten» die Liste ohne Lift, aber kein Hinweis mehr, dass sie aus dem alten Vertrag kommt. Für mich war das kein Problem.
- Ein neuer Vertrag ohne den Link (Thomas Weber, Wohnung 3.02, nicht gespeichert) zeigt wie bisher alle Häkchen gesetzt und den Text «Dwello hat alle umlagefähigen Kategorien angekreuzt. Entfernen Sie das Häkchen bei jeder, die im unterschriebenen Mietvertrag nicht steht …». Den Text verstehe ich besser.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 20 Schritte: Menü, Mietverträge, Sarah Meier, Bearbeiten, Häkchen bei Lift entfernen, speichern, wieder Bearbeiten, Link zum neuen Mietvertrag, 5 Schritte im Assistenten (Datum geändert, Miete, Akonto, Verwaltungspauschale), speichern, neuen Vertrag öffnen.

## Ablauf

1. **Mietverträge über das Menü öffnen.** Erwartet: eine Liste. Gesehen: 11 Mietverträge, Sarah Meier mit «Beendet 01.08.2021 – 30.06.2025, gekündigt». Gut zu finden.
2. **Vertrag von Sarah Meier öffnen.** Erwartet: die vereinbarten Nebenkosten. Gesehen: unter «Vertragsdauer» die Liste «Heizung, Warmwasser, …, Lift, …, Kaminfeger». Einen Link für einen neuen Vertrag sah ich hier nicht.
3. **Bearbeiten, Häkchen bei «Lift» entfernen, «Änderungen speichern».** Erwartet: gespeichert, Lift weg. Gesehen: zurück auf der Vertragsseite, grüne Meldung «Mietvertrag von Sarah Meier gespeichert», die Liste jetzt ohne Lift (Screenshot 07). Das klappte ohne Rückfrage.
4. **Link zum neuen Mietvertrag suchen.** Erwartet: auf der Vertragsseite. Gesehen: nur unter «Bearbeiten», als «Neuen Mietvertrag für Sarah Meier erfassen» nach vier Absätzen Text (Screenshot 05).
5. **Schritt 1 «Mieter».** Sarah Meier war schon gewählt. Gut.
6. **Schritt 2 «Wohnung».** «Wohnung 2.02 - Musterhaus Zentrum, 2.5 Zimmer, 65 m²» gewählt; freie Wohnungen stehen oben. Gut.
7. **Schritt 3 «Vertragsdauer».** Erwartet: leer oder heute. Gesehen: 01.07.2025 eingesetzt mit der Warnung «liegt in der Vergangenheit». Auf 01.11.2026 geändert, die Warnung verschwand, «Sonntag, 1. November 2026» stand darunter.
8. **Schritt 4 «Miete».** 1400 und 200 eingetragen. Unten bei «Vereinbarte Nebenkosten» (Screenshot 12/13): alle angekreuzt ausser **Lift**, genau wie im alten Vertrag. Der Text darüber: «Dwello hat die vereinbarten Nebenkosten aus dem bisherigen Mietvertrag übernommen. Kreuzen Sie Nebenkosten an, die Sie mit dem amtlichen Formular neu eingeführt haben, und entfernen Sie das Häkchen bei jeder, die im neuen Mietvertrag nicht mehr gilt.»
   - *Warum ist so angekreuzt?* Ja, das verstehe ich: Es kommt aus Sarahs altem Vertrag. Der Lift fehlt wie dort.
   - *Was, wenn der neue Vertrag den Lift enthält?* Hier bin ich unsicher. Ein «amtliches Formular» habe ich nicht, Sarah unterschreibt doch einen neuen Vertrag. Muss ich trotzdem ein Formular schicken, bevor ich den Lift ankreuzen darf? Ich würde das Häkchen eher nicht setzen oder jemanden fragen (P-1).
9. **Schritt 5 «Prüfen».** Liste ohne Lift, Monatlich total CHF 1’600.00. «Mietvertrag speichern».
10. **Nach dem Speichern.** Erwartet: die Seite des neuen Vertrags. Gesehen: die Liste der Mietverträge, jetzt 12, oben «Sarah Meier, Wohnung 2.02 · Musterhaus Zentrum, Künftig ab 01.11.2026, unbefristet», CHF 1’400.00 / 1’600.00.
11. **Neuen Vertrag öffnen.** «Vereinbarte Nebenkosten: Heizung, Warmwasser, Kaltwasser, Abwasser, Allgemeinstrom, Hauswart, Gartenpflege, Schneeräumung, Kehricht, TV/Kabelanschluss, Kaminfeger»: ohne Lift, wie gewollt. Unter «Bearbeiten» ist Lift nicht angekreuzt.

## Verwirrung

- «amtliches Formular»: Welches Formular? Für einen neuen Vertrag? Bei der Verwaltungspauschale steht etwas von «während der Mietdauer», hier bei den Nebenkosten nicht.
- «bisheriger Mietvertrag»: Sarah hatte eine andere Wohnung in einem anderen Haus. Dass der Vertrag von Wohnung A2 gemeint ist, habe ich mir gedacht, gesagt wird es nicht.
- «nicht mehr gilt»: Klingt, als liefe der alte Vertrag weiter.

## Fehlerrisiken

- P-1: Wer den Text wörtlich nimmt, kreuzt Nebenkosten, die neu im Vertrag stehen, nicht an. Dann rechnet Dwello sie nie ab, und der Vermieter bleibt auf den Kosten sitzen (hier: Lift im Musterhaus Zentrum).
- Umgekehrt: Wer vom alten Vertrag eine Nebenkost übernimmt, die das neue Haus anders oder gar nicht vereinbart hat, merkt das nur, wenn ihm gesagt wird, dass er mit dem **unterschriebenen** neuen Vertrag vergleichen soll (P-2).
- Vertragsbeginn in der Vergangenheit: Wer die Warnung übersieht, speichert einen Vertrag ab 01.07.2025.

## Vorschläge

- **P-1**, Wiederholen: Mietvertrag von Sarah Meier, Bearbeiten, «Neuen Mietvertrag für Sarah Meier erfassen», Wohnung 2.02 Musterhaus Zentrum, Vertragsbeginn 01.11.2026, Schritt 4, Text bei «Vereinbarte Nebenkosten» lesen. Was helfen würde: Den Hinweis auf das amtliche Formular weglassen, wo es um einen neuen Vertrag geht. Etwa: «Dwello hat die vereinbarten Nebenkosten aus dem bisherigen Mietvertrag übernommen. Vergleichen Sie sie mit dem neuen, unterschriebenen Mietvertrag: Kreuzen Sie an, was neu dazukommt, und entfernen Sie das Häkchen bei allem, was dort nicht steht.»
- **P-2**, gleicher Ort. Was helfen würde: den alten Vertrag nennen («aus dem Mietvertrag für Wohnung A2, Seepark Residenz, bis 30.06.2025») und den Satz «Nur angekreuzte Nebenkosten rechnet Dwello dem Mieter ab» wie im gewöhnlichen Text behalten.

## Nicht geprüft

- 200 % Zoom: nicht versucht, nur 150 %.
- Was passiert, wenn das Häkchen bei Lift im neuen Vertrag gesetzt wird: nicht gespeichert, weil die Aufgabe den Vertrag ohne Lift verlangte.
- Ob die Nebenkostenabrechnung später den Lift weglässt: es gibt für den künftigen Vertrag noch keine Abrechnungsperiode.
- Andere Sprachen und Dunkelmodus.
