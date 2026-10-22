# Review #597, Runde 3 (Abschlussrunde), Delta b8b2a62..24fa35d

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

## Status der offenen IDs aus 597-review-2.md

- **C-2 (Major): geschlossen.** `tests/e2e/features/apartment-new.feature:23-32` legt die Wohnung «K2» über das Formular «Neue Wohnung» mit Stockwerk −2 an und erwartet auf der Detailseite «2. UG». Das Szenario nutzt nur vorhandene Steps (`apartment-form.steps.ts:43`, `apartment-detail.steps.ts:59`). Gelesen: Auf 4874c0f gibt es im UI-Pfad keine Option −2, das Szenario schlägt dort also fehl. Es trägt kein `@wip`. Der Name «K2» ist im Szenario eindeutig (die Grundlage legt nur «1.01» an).

## Nicht bestätigt

- Diese Ergebnisse hat nur der Aufrufer gemeldet, ich habe die Läufe nicht wiederholt: der Rot-Lauf des Szenarios mit `src/lib/apartment.ts` von 4874c0f (Timeout bei selectOption) und `apartment-new.feature` grün in chromium und api (7).
- Der API-Pfad des Szenarios war wohl schon auf der Basis grün, denn das Backend nahm −2 bereits an. Das Rot zeigt nur der UI-Pfad. Für einen Befund aus dem Formular ist das ausreichend.
- Dass die Persona-Befunde P-1/P-2 geschlossen sind und P-4 wie in #597 Punkt 5 entschieden bleibt: vom Aufrufer gemeldet. `docs/design/personas/dr-weber-597.md` habe ich nicht bewertet, die Datei liegt ausserhalb des Code-Deltas.

Geprüft: Das Delta im Code besteht nur aus diesem Szenario. Es enthält keine neuen Texte, Bildschirme, testids oder Steps und keine fremden Änderungen. Ponytail: kein Befund.
