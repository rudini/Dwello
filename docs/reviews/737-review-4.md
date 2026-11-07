# Review 4, #737 (P-1, Runde 2): Delta 3e2a02c..9c37027

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Geschlossen: C-1

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: Backend `bun test` formula-codes (8 bestanden), E2E chromium `-g "distribution-key-(new|edit) |Verteilschlüssel"` (49 bestanden), `bun run lint`.
- Den Rot-Lauf beider neuer Tests habe ich nur durch Lesen beurteilt. Das Szenario (distribution-keys.feature:74–78) erwartet über den Step `zeigt der Test nur den Fehler` (distribution-keys.steps.ts:176) den ganzen Satz aus messages/de.json:556. Ohne den «Prüfen Sie …»-Satz wäre es rot. Der Backend-Test (formula-codes.test.ts:44–52) prüft den Code `FORMULA_ALL_ZERO` und den ganzen Text aus formula.service.ts:304. Ohne den Satz wäre auch er rot. Gesehen habe ich keinen der beiden Läufe.

Geprüft: `{units} - 1` ergibt bei allen vier Beispielwohnungen 0, denn jede hat units 1 (formula.service.ts:238–246). Damit trifft die Formel genau `FORMULA_ALL_ZERO` und keinen anderen Fehler. Die erwarteten Texte stimmen wörtlich mit de.json:556 und formula.service.ts:304 überein. Das neue Szenario hat kein `@wip`, ist neu und ändert kein bestehendes. Der Step ruft nur eine Question auf. Nichts im Delta gehört nicht zur Anforderung. Ponytail: keine Befunde.
