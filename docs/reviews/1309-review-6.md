# Code-Review 1309-6 (Merge-Slice, Runde 2, Delta e6c00695..fe6b5942)

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| – | – | – | Keine neuen Befunde |

Geschlossen: C-1

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, fitness und Backend-type-check bestanden; Backend `bun run test` (2215, mit Coverage) bestanden; E2E chromium statement-detail.feature und statement-generate.feature (257) bestanden; vitest nicht neu gelaufen (seit e6c00695 keine Änderung im Frontend, dort 4699 bestanden).
- Dass die zwei neuen pg-Tests vor dem Fix rot waren, habe ich nur durch Lesen beurteilt. Mit dem alten `keyFailure` (Prüfung nur am 01.01. mit der heutigen Fläche) ergibt Fall 1 `[]` statt NEGATIVE, Fall 2 NEGATIVE statt `[]`. Beide wären also rot gewesen.

Geprüft: `cutDays` liefert dieselben Schnitttage wie das frühere `partsOf` (gleiche Filtergrenzen, dedupliziert, sortiert), `partsOf` verhält sich also gleich. `keyFailure` prüft jetzt am Periodenbeginn und an jedem Tag «Aufgehoben ab» oder jedem Tag mit neuen Werten, jeweils mit `countingWith`, also mit Fläche und Zimmeranzahl des Tages wie in der Berechnung. Das alte Verhalten bei «Aufgehoben ab» bleibt (Startdatum ausgenommen, `countingOn` in `countingWith`). Die Testdaten (2.01 mit 70 m², 1.01 mit 40↔60 m² ab 01.07.2025, Formel `{area} - 45`) zeigen beide Fälle aus C-1. Der Test räumt seine Daten auf.
