# Marco – Wohnungssuche auf dem Handy (B1 in «Seepark Residenz»)

Persona: Marco, 38, Handy 390 × 844, Touch. Nur geschaut, nichts gespeichert.
App: Persona-Stack, http://localhost:3300, Demodaten.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Wohnungen, nach «Filter zurücksetzen» (Link im Leerzustand) und nach «Zurück» im Browser | Die Liste zeigt wieder alle 13 Wohnungen, aber das Suchfeld behält den alten Begriff (z. B. «Zürichberg») und das Gebäude-Feld die alte Auswahl («Seepark Residenz»). Tippe ich danach auf «Suchen», bin ich wieder bei «Keine Wohnungen gefunden». Gleich bei «Zurück»: Liste und Formular zeigen verschiedene Suchen. |
| P-2 | Major | Wohnungen, Suche «Seepark B1» | Gebäudename und Wohnungsnummer zusammen («Seepark B1», auch «Residenz B1») ergeben «Keine Wohnungen gefunden», obwohl B1 in Seepark Residenz existiert. Der Leertext sagt nicht, dass nur eines von beiden geht. |
| P-3 | Minor | Wohnungen, Leerzustand | «Keine Wohnung passt zu Ihrer Suche» nennt den Suchbegriff nicht und gibt keinen Tipp, wie man sucht (z. B. nur Nummer, oder Gebäude im Feld «Gebäude» wählen). |
| P-4 | Minor | Wohnungen, Formular | Es gibt keine Live-Suche: Nach dem Tippen ändert sich nichts, bis ich «Suchen» oder Enter tippe. Ging gut, aber beim ersten Mal habe ich kurz gewartet. Ausserdem steht «Filter zurücksetzen» im Formular auch nach dem Zurücksetzen noch da (Folge von P-1). |
| P-5 | Nit | Wohnungen, Liste | Die Überschrift «13 Wohnungen» steht über einer Seite mit 12 Karten; erst ganz unten steht «Seite 1 von 2». Ein «1–12 von 13» oben würde Suchen nach der fehlenden Wohnung ersparen. |
| P-6 | Nit | Wohnungen, Feld «Gebäude» | Reihenfolge im Auswahlfeld: Alpenblick, Seepark Residenz, Musterhaus Zentrum, die Liste ist aber alphabetisch sortiert (Alpenblick, Musterhaus, Seepark). |

**Aufgabe geschafft:** ja (B1 gefunden, Leersuche und Rückweg zu allen Wohnungen gingen), mit Stolpern bei P-1 und P-2.

**Aufwand:** etwa 3 Minuten, rund 12 Taps (Menü, Wohnungen, Suche «Seepark», Suchen, erweitert auf «Seepark B1», Leer, neu «B1», Suchen, «Zürichberg», Suchen, Filter zurücksetzen, dann gemerkt, dass das Formular noch alt ist).

## Ablauf

1. **Menü öffnen, «Wohnungen».** Erwartet: Liste mit Suche. Gesehen: Titel «Wohnungen», darunter ein Kasten mit «Suche (optional)» (Platzhalter «Wohnungsnummer oder Gebäude»), «Gebäude (optional)», «Mietstatus (optional)», Knopf «Suchen». Darunter «13 Wohnungen», 12 Karten (Alpenblick, Musterhaus Zentrum, Seepark Residenz A1, A2, B1), unten «Seite 1 von 2» und «Nächste Seite». Kein seitliches Scrollen bei 390 px. Seite 2 zeigt genau eine Karte (B2); 12 + 1 = 13, passt.
2. **«Seepark» tippen.** Erwartet: Liste filtert beim Tippen. Gesehen: nichts passiert (P-4). Nach Tipp auf «Suchen»: URL mit `search=Seepark`, «4 Wohnungen» (A1, A2, B1, B2), keine Seitennavigation, neu ein Link «Filter zurücksetzen» im Formular. Zahl und Karten stimmen.
3. **Eingrenzen: « B1» anhängen, Enter.** Erwartet: nur B1. Gesehen: «Keine Wohnungen gefunden … Wählen Sie andere Filter oder zeigen Sie alle Wohnungen.» (P-2). «Residenz B1» genauso. Ich dachte kurz, B1 gibt es nicht, obwohl ich die Karte eben gesehen hatte.
4. **Nur «B1» suchen.** Gesehen: «1 Wohnung», Karte «Wohnung B1», Seepark Residenz, Leer, 1. OG, 3.5 Zimmer, 75 m². Klein geschrieben («b1») gleich. Auch der andere Weg geht: Gebäude «Seepark Residenz» wählen + «B1» → «1 Wohnung». Ziel erreicht.
5. **Etwas suchen, das es nicht gibt: «Zürichberg».** Gesehen: Leerzustand mit Lupenbild, «Keine Wohnungen gefunden» und grossem Knopf «Filter zurücksetzen» (48 px hoch, gut zu treffen). Die Seite war dabei etwas nach unten gescrollt, der Leerzustand stand gleich im Bild – gut.
6. **«Filter zurücksetzen» im Leerzustand tippen.** Erwartet: alles leer, alle Wohnungen. Gesehen: Liste mit «13 Wohnungen», aber oben im Feld steht noch «Zürichberg» und (wenn vorher gewählt) «Seepark Residenz» (P-1). Erneutes «Suchen» bringt wieder «Keine Wohnungen gefunden». Der kleine «Filter zurücksetzen» im Formular leert dagegen alles richtig. Nach Neuladen ist das Formular auch leer.
7. **Browser-Zurück** (vom Ergebnis «B1» zurück zu «Seepark»): Liste zeigt «4 Wohnungen», im Suchfeld steht aber weiter «B1» (P-1).

## Verwirrung

- Platzhalter «Wohnungsnummer oder Gebäude»: das «oder» habe ich als «beides geht» gelesen, nicht als «nur eines».
- Zwei Mal «Filter zurücksetzen» auf einem Bildschirm (Link im Formular, Knopf im Leerzustand), die sich verschieden verhalten.
- «Filter» – ich habe gesucht, nicht gefiltert; verstanden habe ich es trotzdem.
- Begriffe Vermietet/Leer usw. sind unten gut erklärt.

## Fehlerrisiken

- P-1: Wer nach dem Zurücksetzen nur die Mietstatus-Auswahl ändert und «Suchen» tippt, sucht unbemerkt weiter nach dem alten Begriff/Gebäude und sieht zu wenig oder keine Wohnungen – man glaubt dann, Wohnungen fehlen.
- P-2: Man schliesst, die Wohnung existiert nicht, und erfasst sie womöglich doppelt über «Wohnung erfassen».

## Vorschläge

- **P-1:** Wohnungen → «Zürichberg» suchen → im Leerzustand «Filter zurücksetzen» tippen → Suchfeld zeigt noch «Zürichberg». Ebenso: «Seepark» suchen, «B1» suchen, Browser-Zurück → Liste «4 Wohnungen», Feld «B1». Hilfe: Formularfelder immer aus der aktuellen Adresse befüllen (auch bei Navigation ohne Neuladen), «Filter zurücksetzen» im Formular nur zeigen, wenn ein Filter aktiv ist.
- **P-2:** Wohnungen → «Seepark B1» → Suchen → «Keine Wohnungen gefunden». Hilfe: mehrere Wörter je einzeln suchen (Gebäude UND Nummer), oder mindestens Hilfetext am Feld: «Suchen Sie nach Nummer oder Gebäude. Zum Eingrenzen wählen Sie das Gebäude unten.»
- **P-3:** Leertext mit dem Begriff: «Keine Wohnung passt zu «Seepark B1».» plus Tipp wie oben.
- **P-4:** Entweder Live-Suche oder ein kurzer Hinweis; der Rest erledigt sich mit P-1.
- **P-5:** Oben «13 Wohnungen, 1–12 angezeigt» oder ähnlich.
- **P-6:** Gebäude im Auswahlfeld gleich sortieren wie die Liste.

## Nicht geprüft

- Nichts gespeichert (Auftrag: nur schauen).
- Mietstatus-Filter nur am Rand (immer «Alle»); Kombination mit Seitenwechsel bei mehr als 12 Treffern nicht möglich, da keine Suche mehr als 6 Treffer ergab.
- Dunkelmodus, andere Sprachen, langsame Verbindung nicht geprüft.
- Bildschirmtastatur selbst kann ich nicht sehen; Enter im Suchfeld (entspricht «Los») funktioniert.
